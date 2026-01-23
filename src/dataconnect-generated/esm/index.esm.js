import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'aubeshop1',
  location: 'us-east4'
};

export const seedCoursesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SeedCourses');
}
seedCoursesRef.operationName = 'SeedCourses';

export function seedCourses(dc) {
  return executeMutation(seedCoursesRef(dc));
}

export const listCoursesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListCourses');
}
listCoursesRef.operationName = 'ListCourses';

export function listCourses(dc) {
  return executeQuery(listCoursesRef(dc));
}

export const createAssignmentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateAssignment', inputVars);
}
createAssignmentRef.operationName = 'CreateAssignment';

export function createAssignment(dcOrVars, vars) {
  return executeMutation(createAssignmentRef(dcOrVars, vars));
}

export const getAssignmentsForCourseRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAssignmentsForCourse', inputVars);
}
getAssignmentsForCourseRef.operationName = 'GetAssignmentsForCourse';

export function getAssignmentsForCourse(dcOrVars, vars) {
  return executeQuery(getAssignmentsForCourseRef(dcOrVars, vars));
}

