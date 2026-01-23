const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'aubeshop1',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const seedCoursesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SeedCourses');
}
seedCoursesRef.operationName = 'SeedCourses';
exports.seedCoursesRef = seedCoursesRef;

exports.seedCourses = function seedCourses(dc) {
  return executeMutation(seedCoursesRef(dc));
};

const listCoursesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListCourses');
}
listCoursesRef.operationName = 'ListCourses';
exports.listCoursesRef = listCoursesRef;

exports.listCourses = function listCourses(dc) {
  return executeQuery(listCoursesRef(dc));
};

const createAssignmentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateAssignment', inputVars);
}
createAssignmentRef.operationName = 'CreateAssignment';
exports.createAssignmentRef = createAssignmentRef;

exports.createAssignment = function createAssignment(dcOrVars, vars) {
  return executeMutation(createAssignmentRef(dcOrVars, vars));
};

const getAssignmentsForCourseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAssignmentsForCourse', inputVars);
}
getAssignmentsForCourseRef.operationName = 'GetAssignmentsForCourse';
exports.getAssignmentsForCourseRef = getAssignmentsForCourseRef;

exports.getAssignmentsForCourse = function getAssignmentsForCourse(dcOrVars, vars) {
  return executeQuery(getAssignmentsForCourseRef(dcOrVars, vars));
};
