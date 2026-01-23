import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Assignment_Key {
  id: UUIDString;
  __typename?: 'Assignment_Key';
}

export interface CourseInstructor_Key {
  courseId: UUIDString;
  instructorId: UUIDString;
  __typename?: 'CourseInstructor_Key';
}

export interface Course_Key {
  id: UUIDString;
  __typename?: 'Course_Key';
}

export interface CreateAssignmentData {
  assignment_insert: Assignment_Key;
}

export interface CreateAssignmentVariables {
  courseId: UUIDString;
  title: string;
  description: string;
  dueDate: DateString;
  maxGrade: number;
  status: string;
}

export interface Enrollment_Key {
  userId: UUIDString;
  courseId: UUIDString;
  __typename?: 'Enrollment_Key';
}

export interface GetAssignmentsForCourseData {
  assignments: ({
    id: UUIDString;
    title: string;
    description?: string | null;
    dueDate: DateString;
    grade?: number | null;
    maxGrade?: number | null;
    status: string;
  } & Assignment_Key)[];
}

export interface GetAssignmentsForCourseVariables {
  courseId: UUIDString;
}

export interface Instructor_Key {
  id: UUIDString;
  __typename?: 'Instructor_Key';
}

export interface ListCoursesData {
  courses: ({
    id: UUIDString;
    courseCode: string;
    name: string;
    department?: string | null;
  } & Course_Key)[];
}

export interface SeedCoursesData {
  course_insertMany: Course_Key[];
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface SeedCoursesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<SeedCoursesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<SeedCoursesData, undefined>;
  operationName: string;
}
export const seedCoursesRef: SeedCoursesRef;

export function seedCourses(): MutationPromise<SeedCoursesData, undefined>;
export function seedCourses(dc: DataConnect): MutationPromise<SeedCoursesData, undefined>;

interface ListCoursesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListCoursesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListCoursesData, undefined>;
  operationName: string;
}
export const listCoursesRef: ListCoursesRef;

export function listCourses(): QueryPromise<ListCoursesData, undefined>;
export function listCourses(dc: DataConnect): QueryPromise<ListCoursesData, undefined>;

interface CreateAssignmentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAssignmentVariables): MutationRef<CreateAssignmentData, CreateAssignmentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateAssignmentVariables): MutationRef<CreateAssignmentData, CreateAssignmentVariables>;
  operationName: string;
}
export const createAssignmentRef: CreateAssignmentRef;

export function createAssignment(vars: CreateAssignmentVariables): MutationPromise<CreateAssignmentData, CreateAssignmentVariables>;
export function createAssignment(dc: DataConnect, vars: CreateAssignmentVariables): MutationPromise<CreateAssignmentData, CreateAssignmentVariables>;

interface GetAssignmentsForCourseRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAssignmentsForCourseVariables): QueryRef<GetAssignmentsForCourseData, GetAssignmentsForCourseVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetAssignmentsForCourseVariables): QueryRef<GetAssignmentsForCourseData, GetAssignmentsForCourseVariables>;
  operationName: string;
}
export const getAssignmentsForCourseRef: GetAssignmentsForCourseRef;

export function getAssignmentsForCourse(vars: GetAssignmentsForCourseVariables): QueryPromise<GetAssignmentsForCourseData, GetAssignmentsForCourseVariables>;
export function getAssignmentsForCourse(dc: DataConnect, vars: GetAssignmentsForCourseVariables): QueryPromise<GetAssignmentsForCourseData, GetAssignmentsForCourseVariables>;

