import * as types from "./actionTypes";
import axios from 'axios';

const API = "http://127.0.0.1:5000"

const getServices = (services) => ({
    type: types.GET_SERVICES,
    payload: services
});

const getPlaybook = (text) => ({
    type: types.GENERATE_PLAYBOOK,
    payload: text
});

export const generatePlaybook = (selectedServices) => {
    return function (dispatch) {
        axios
            .post(`${API}/generate-playbook`, selectedServices)
            .then((resp) => dispatch(getPlaybook(resp.data)))
            .catch(err => console.log(err));
    };
};

export const loadServices = () => {
    return function (dispatch) {
        axios
            .get(`${API}/get-services`)
            .then((resp) => dispatch(getServices(resp.data)))
            .catch(err => console.log(err));
    };
};