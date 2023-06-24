import axios from 'axios';
const BASE_URL = 'http://localhost:8000/api'

// const BASE_URL = process.env.NODE_ENV === 'production'
//   ? 'https://pillpal-a113c55bba4b.herokuapp.com/api'
//   : 'http://localhost:8000/api';


export async function fetchProfileData(token) {
  try {
    const response = await axios.get(`${BASE_URL}/profile/?cache=${Date.now()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch profile data");
  }
}

export async function signUp(signUpData) {
  try {
    const response = await axios.post(`${BASE_URL}/register/`, signUpData);
    const { token, user_id } = response.data;
    return { token, user_id };
  } catch (error) {
    throw new Error("Failed to sign up");
  }
}

export async function signIn(signInData) {
  try {
    const response = await axios.post(`${BASE_URL}/login/`, signInData);
    const { token, user_id } = response.data;
    return { token, user_id };
  } catch (error) {
    throw new Error("Failed to sign in");
  }
}

export async function addMedication(token, medicationData) {
  try {
    const response = await axios.post(`${BASE_URL}/profile/`, medicationData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to add medication. Please try again.");
  }
}

export const updateMedication = async (token, medicationId, updatedData) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/medications/update/${medicationId}/`,
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to update medication. Please try again.");
  }
};

export async function deleteMedication(token, medicationId) {
  try {
    const response = await axios.delete(`${BASE_URL}/medications/${medicationId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error("Medication not found");
    } else {
      throw new Error("Failed to delete medication");
    }
  }
}
