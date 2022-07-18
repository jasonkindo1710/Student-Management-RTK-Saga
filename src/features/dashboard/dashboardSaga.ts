import studentApi from "api/studentApi";
import { City, ListResponse, Student } from "models";
import { all, put, takeLatest } from "redux-saga/effects";
import { dashboardAction, RankingByCity } from "./dashboardSlice";
import * as Effects from "redux-saga/effects";
import cityApi from "api/cityApi";

const call: any = Effects.call;

function* fetchStatistics() {
  const responseList: Array<ListResponse<Student>> = yield all([
    call(studentApi.getAll, {
      _page: 1,
      _limit: 1,
      gender: "male",
    }),
    call(studentApi.getAll, {
      _page: 1,
      _limit: 5,
      gender: "female",
    }),
    call(studentApi.getAll, {
      _page: 1,
      _limit: 5,
      mark_gte: 8,
    }),
    call(studentApi.getAll, {
      _page: 1,
      _limit: 5,
      mark_lte: 5,
    }),
  ]);

  const statisticList = responseList.map((x) => x.pagination._totalRows);
  const [maleCount, femaleCount, highMarkCount, lowMarkCount] = statisticList;
  yield put(dashboardAction.setStatistics({ maleCount, femaleCount, highMarkCount, lowMarkCount }));
}

function* fetchHighestStudentList() {
  const { data }: ListResponse<Student> = yield call(studentApi.getAll, {
    _page: 1,
    _limit: 5,
    _sort: "mark",
    _order: "desc",
  });

  yield put(dashboardAction.setHighestStudentList(data));
}
function* fetchLowestStudentList() {
  const { data }: ListResponse<Student> = yield call(studentApi.getAll, {
    _page: 1,
    _limit: 5,
    _sort: "mark",
    _order: "asc",
  });

  yield put(dashboardAction.setLowestStudentList(data));
}
function* fetchRankingByCityList() {
  // fetch city list
  const { data: cityList }: ListResponse<City> = yield call(cityApi.getAll);
  //fetch ranking per city
  const callList = cityList.map((x) =>
    call(studentApi.getAll, {
      _page: 1,
      _limit: 5,
      _sort: "mark",
      _order: "desc",
      city: x.code,
    })
  );
  const responseList: Array<ListResponse<Student>> = yield all(callList);
  const rankingByCityList: Array<RankingByCity> = responseList.map((x, idx) => ({
    cityId: cityList[idx].code,
    cityName: cityList[idx].name,
    rankingList: x.data,
  }));

  //Update state
  yield put(dashboardAction.setRankingByCityList(rankingByCityList));
}

function* fetchDashboardData() {
  try {
    yield all([
      call(fetchStatistics),
      call(fetchHighestStudentList),
      call(fetchLowestStudentList),
      call(fetchRankingByCityList),
    ]);
    yield put(dashboardAction.fetchDataSuccess())
  } catch (error) {
    console.log("failed to fetch dashboard data", error);
    yield put(dashboardAction.fetchDataFailed())
  }
}

export default function* dashboardSaga() {
  yield takeLatest(dashboardAction.fetchData.type, fetchDashboardData);
}
