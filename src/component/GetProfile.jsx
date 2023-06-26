import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import AddMedicationForm from "./AddMedicationForm.jsx";
import EditMedicationForm from "./EditMedicationForm.jsx";
import DeleteMedication from "./DeleteMedication.jsx";
import {
  fetchProfileData,
  addMedication,
  updateMedication,
  deleteMedication,
} from "../services/apiConfig.js";
import "./GetProfile.css";

function GetProfile({ profileData, setProfileData }) {
  // eslint-disable-next-line
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const token = localStorage.getItem("token");
  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  // eslint-disable-next-line
  const [editMode, setEditMode] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  // eslint-disable-next-line
  const [addMedicationFormVisible, setAddMedicationFormVisible] =
    useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Fetching profile data...");

    fetchProfileData(token)
      .then((data) => {
        console.log("Profile data received:", data);
        setProfileData(data);
        setIsLoggedIn(true);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [navigate, setProfileData, setIsLoggedIn, token]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [token]);

  const handleAddMedication = (medicationData) => {
    let userId = null;
    if (profileData && profileData.user && profileData.user.id) {
      userId = profileData.user.id;
    }

    const data = {
      ...medicationData,
      user: userId,
    };

    addMedication(token, data)
      .then((responseData) => {
        // Fetch the updated profile data after adding a medication
        fetchProfileData(token)
          .then((data) => {
            console.log("Medication added successfully!");
            setAddMedicationFormVisible(false); // Hide the add medication form after submission
            setIsLoggedIn(true);
            setProfileData(data); // Update the profile data with the new data
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleTakenChange = (medicationId, taken) => {
    const updatedProfileData = profileData.map((medication) => {
      if (medication.id === medicationId) {
        return { ...medication, taken: !taken };
      }
      return medication;
    });

    setProfileData(updatedProfileData);

    updateMedication(token, medicationId, { taken: !taken })
      .then((data) => {
        setProfileData(updatedProfileData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleEditMedication = (medicationId, updatedMedication) => {
    const updatedProfileData = profileData.map((medication) => {
      if (medication.id === medicationId) {
        return { ...medication, ...updatedMedication };
      }
      return medication;
    });

    setProfileData(updatedProfileData);

    updateMedication(token, medicationId, updatedMedication)
      .then((data) => {
        setProfileData(updatedProfileData);
        setUpdateSuccess(true);
        setTimeout(() => {
          setEditMode(false);
          setUpdateSuccess(false);
        }, 2000);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleEditButtonClick = (medication) => {
    setSelectedMedication(medication);
    setEditMode(true);
    setEditModalIsOpen(true);
  };

  const handleDeleteMedication = (medicationId) => {
    deleteMedication(token, medicationId)
      .then(() => {
        const updatedProfileData = profileData.filter(
          (medication) => medication.id !== medicationId
        );
        setProfileData(updatedProfileData);
        console.log("Medication deleted successfully!");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <div className="profile-container">
        {profileData ? (
          <div className="profile-data">
            <div className="profile-header">
              <h2 className="profile-title">
                {profileData[0]?.username}'s Profile
              </h2>
              <button
                className="addMedication largeButton"
                onClick={() => setAddModalIsOpen(true)}
              >
                <FontAwesomeIcon icon={faPlus} />
                Add Medication
              </button>
            </div>
            {Array.isArray(profileData) && profileData.length > 0 ? (
              <table className="profile-table">
                <thead>
                  <tr>
                    <th>Medication</th>
                    <th>Dosage</th>
                    <th>Description</th>
                    <th>Taken</th>
                    <th>Edit Medication</th>
                    <th>Delete Medication</th>
                  </tr>
                </thead>
                <tbody>
                  {profileData.map((medication) => (
                    <tr
                      key={medication.id}
                      className={medication.taken ? "medication-taken" : ""}
                    >
                      <td>{medication.medication}</td>
                      <td>{medication.dosage}</td>
                      <td>{medication.description}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={medication.taken}
                          onChange={() =>
                            handleTakenChange(medication.id, medication.taken)
                          }
                        />
                      </td>
                      <td>
                        <button
                          onClick={() => handleEditButtonClick(medication)}
                        >
                          Edit
                        </button>
                      </td>
                      <td>
                        <DeleteMedication
                          medicationId={medication.id}
                          onDeleteMedication={handleDeleteMedication}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No medication data available.</p>
            )}
          </div>
        ) : (
          <p>Loading profile data...</p>
        )}
        <Modal
          isOpen={addModalIsOpen}
          onRequestClose={() => setAddModalIsOpen(false)}
          contentLabel="Add Medication Modal"
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.75)",
            },
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
            },
          }}
        >
          <AddMedicationForm onAddMedication={handleAddMedication} />
          <button onClick={() => setAddModalIsOpen(false)}>Close</button>
        </Modal>
        <Modal
          isOpen={editModalIsOpen}
          onRequestClose={() => setEditModalIsOpen(false)}
          contentLabel="Edit Medication Modal"
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.75)",
            },
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
            },
          }}
        >
          {selectedMedication && (
            <>
              <EditMedicationForm
                medicationId={selectedMedication.id}
                medicationData={selectedMedication}
                onEditMedication={handleEditMedication}
              />
              {updateSuccess && (
                <p className="update-success-message">
                  Medication updated successfully!
                </p>
              )}
              <button onClick={() => setEditModalIsOpen(false)}>Close</button>
            </>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default GetProfile;
