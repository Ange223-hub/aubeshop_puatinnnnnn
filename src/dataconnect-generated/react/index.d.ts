import { SeedCoursesData, ListCoursesData, CreateAssignmentData, CreateAssignmentVariables, GetAssignmentsForCourseData, GetAssignmentsForCourseVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useSeedCourses(options?: useDataConnectMutationOptions<SeedCoursesData, FirebaseError, void>): UseDataConnectMutationResult<SeedCoursesData, undefined>;
export function useSeedCourses(dc: DataConnect, options?: useDataConnectMutationOptions<SeedCoursesData, FirebaseError, void>): UseDataConnectMutationResult<SeedCoursesData, undefined>;

export function useListCourses(options?: useDataConnectQueryOptions<ListCoursesData>): UseDataConnectQueryResult<ListCoursesData, undefined>;
export function useListCourses(dc: DataConnect, options?: useDataConnectQueryOptions<ListCoursesData>): UseDataConnectQueryResult<ListCoursesData, undefined>;

export function useCreateAssignment(options?: useDataConnectMutationOptions<CreateAssignmentData, FirebaseError, CreateAssignmentVariables>): UseDataConnectMutationResult<CreateAssignmentData, CreateAssignmentVariables>;
export function useCreateAssignment(dc: DataConnect, options?: useDataConnectMutationOptions<CreateAssignmentData, FirebaseError, CreateAssignmentVariables>): UseDataConnectMutationResult<CreateAssignmentData, CreateAssignmentVariables>;

export function useGetAssignmentsForCourse(vars: GetAssignmentsForCourseVariables, options?: useDataConnectQueryOptions<GetAssignmentsForCourseData>): UseDataConnectQueryResult<GetAssignmentsForCourseData, GetAssignmentsForCourseVariables>;
export function useGetAssignmentsForCourse(dc: DataConnect, vars: GetAssignmentsForCourseVariables, options?: useDataConnectQueryOptions<GetAssignmentsForCourseData>): UseDataConnectQueryResult<GetAssignmentsForCourseData, GetAssignmentsForCourseVariables>;
