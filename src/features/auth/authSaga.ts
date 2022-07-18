import { LoginPayload, authActions } from "./authslice";
import { call, delay, fork, put, take, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { push } from "connected-react-router";

function* handleLogin(payload: LoginPayload) {
  try {
    yield delay(1000)
    localStorage.setItem("access_token", "fakeToken");
    yield put(
      authActions.loginSuccess({
        id: 1,
        name: "Hoang",
      })
    );
    yield put(push('/admin'))
  } catch (error) {
    // yield put(authActions.loginFailed(error.message));
  }

  //redir
}
function* handleLogout() {
  console.log("Handle logout");
  yield delay(1000);
  localStorage.removeItem("access_token");
  //redirect to login page
  yield put(push('/login'))
}
function* watchLoginFlow() {
  while (true) {
    const isLoggedIn = Boolean(localStorage.getItem("access_token"));
    if (!isLoggedIn) {
      const action: PayloadAction<LoginPayload> = yield take(authActions.login.type);
      yield fork(handleLogin, action.payload);
    }

    yield take(authActions.logout.type);
    yield call(handleLogout);
  }
}

export function* authSaga() {
  yield fork(watchLoginFlow);
}
