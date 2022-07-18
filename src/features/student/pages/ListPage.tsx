import {
  Box,
  Button, LinearProgress,
  makeStyles,
  Typography
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import studentApi from "api/studentApi";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { selectCityList, selectCityMap } from "features/city/citySlice";
import { ListParams, Student } from "models";
import { useEffect } from "react";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { toast } from "react-toastify";
import StudentFilters from "../components/StudentFilters";
import StudentTable from "../components/StudentTable";
import {
  selectStudentFilter,
  selectStudentList,
  selectStudentLoading,
  selectStudentPagination,
  studentActions
} from "../studentSlice";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
  },
  titleContainer: {
    display: "flex",
    flexFlow: "row nowrap",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(4),
  },
  loading: {},
}));

export default function ListPage() {
  const studentList = useAppSelector(selectStudentList);
  const pagination = useAppSelector(selectStudentPagination);
  const filter = useAppSelector(selectStudentFilter);
  const loading = useAppSelector(selectStudentLoading);
  const cityMap = useAppSelector(selectCityMap);
  const cityList = useAppSelector(selectCityList);
  const match = useRouteMatch();
  const history = useHistory();

  const dispatch = useAppDispatch();
  const classes = useStyles();
  useEffect(() => {
    dispatch(studentActions.fetchStudentList(filter));
  }, [dispatch, filter]);

  const handlePageChange = (e: any, page: number) => {
    dispatch(
      studentActions.setFilter({
        ...filter,
        _page: page,
        _limit: 15,
        _order: "desc",
        _sort: "",
      })
    );
  };

  const handleSearchChange = (newFilter: ListParams) => {
    console.log("Search change: ", newFilter);
    dispatch(studentActions.setFilterWithDebounce(newFilter));
  };
  const handleFilterChange = (newFilter: ListParams) => {
    dispatch(studentActions.setFilter(newFilter));
  };
  const handleRemoveStudent = async (student: Student) => {
    try {
      //Remove student API
      await studentApi.remove(student?.id || "");

      toast.success('Remove student successfully');
      //Trigger to re-fetch student list with current filter
      const newFilter = { ...filter };
      dispatch(studentActions.setFilter(newFilter));
    } catch (error) {
      console.log("Failed to fetch student", error);
    }
  };
  const handleEditStudent = async (student: Student) => {
    history.push(`${match.url}/${student.id}`);
  };

  return (
    <Box className={classes.root}>
      {loading && <LinearProgress className={classes.loading} />}
      <Box className={classes.titleContainer}>
        <Typography variant="h4">Students</Typography>
        <Link to={`${match.url}/add`} style={{ textDecoration: "none" }}>
          <Button variant="contained" color="primary">
            Add new student
          </Button>
        </Link>
      </Box>
      <Box mb={3}>
        <StudentFilters
          filter={filter}
          cityList={cityList}
          onChange={handleFilterChange}
          onSearchChange={handleSearchChange}
        />
      </Box>

      {/* Student Table */}
      <StudentTable
        studentList={studentList}
        cityMap={cityMap}
        onEdit={handleEditStudent}
        onRemove={handleRemoveStudent}
      />

      {/* Pagination */}
      <Box my={2} display="flex" justifyContent="center">
        <Pagination
          color="primary"
          count={Math.ceil(pagination._totalRows / pagination._limit)}
          page={pagination?._page}
          onChange={handlePageChange}
        />
      </Box>
    </Box>
  );
}
