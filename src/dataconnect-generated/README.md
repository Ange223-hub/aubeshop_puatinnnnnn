# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListCourses*](#listcourses)
  - [*GetAssignmentsForCourse*](#getassignmentsforcourse)
- [**Mutations**](#mutations)
  - [*SeedCourses*](#seedcourses)
  - [*CreateAssignment*](#createassignment)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListCourses
You can execute the `ListCourses` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listCourses(): QueryPromise<ListCoursesData, undefined>;

interface ListCoursesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListCoursesData, undefined>;
}
export const listCoursesRef: ListCoursesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listCourses(dc: DataConnect): QueryPromise<ListCoursesData, undefined>;

interface ListCoursesRef {
  ...
  (dc: DataConnect): QueryRef<ListCoursesData, undefined>;
}
export const listCoursesRef: ListCoursesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listCoursesRef:
```typescript
const name = listCoursesRef.operationName;
console.log(name);
```

### Variables
The `ListCourses` query has no variables.
### Return Type
Recall that executing the `ListCourses` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListCoursesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListCoursesData {
  courses: ({
    id: UUIDString;
    courseCode: string;
    name: string;
    department?: string | null;
  } & Course_Key)[];
}
```
### Using `ListCourses`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listCourses } from '@dataconnect/generated';


// Call the `listCourses()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listCourses();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listCourses(dataConnect);

console.log(data.courses);

// Or, you can use the `Promise` API.
listCourses().then((response) => {
  const data = response.data;
  console.log(data.courses);
});
```

### Using `ListCourses`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listCoursesRef } from '@dataconnect/generated';


// Call the `listCoursesRef()` function to get a reference to the query.
const ref = listCoursesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listCoursesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.courses);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.courses);
});
```

## GetAssignmentsForCourse
You can execute the `GetAssignmentsForCourse` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getAssignmentsForCourse(vars: GetAssignmentsForCourseVariables): QueryPromise<GetAssignmentsForCourseData, GetAssignmentsForCourseVariables>;

interface GetAssignmentsForCourseRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAssignmentsForCourseVariables): QueryRef<GetAssignmentsForCourseData, GetAssignmentsForCourseVariables>;
}
export const getAssignmentsForCourseRef: GetAssignmentsForCourseRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAssignmentsForCourse(dc: DataConnect, vars: GetAssignmentsForCourseVariables): QueryPromise<GetAssignmentsForCourseData, GetAssignmentsForCourseVariables>;

interface GetAssignmentsForCourseRef {
  ...
  (dc: DataConnect, vars: GetAssignmentsForCourseVariables): QueryRef<GetAssignmentsForCourseData, GetAssignmentsForCourseVariables>;
}
export const getAssignmentsForCourseRef: GetAssignmentsForCourseRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAssignmentsForCourseRef:
```typescript
const name = getAssignmentsForCourseRef.operationName;
console.log(name);
```

### Variables
The `GetAssignmentsForCourse` query requires an argument of type `GetAssignmentsForCourseVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetAssignmentsForCourseVariables {
  courseId: UUIDString;
}
```
### Return Type
Recall that executing the `GetAssignmentsForCourse` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAssignmentsForCourseData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetAssignmentsForCourse`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAssignmentsForCourse, GetAssignmentsForCourseVariables } from '@dataconnect/generated';

// The `GetAssignmentsForCourse` query requires an argument of type `GetAssignmentsForCourseVariables`:
const getAssignmentsForCourseVars: GetAssignmentsForCourseVariables = {
  courseId: ..., 
};

// Call the `getAssignmentsForCourse()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAssignmentsForCourse(getAssignmentsForCourseVars);
// Variables can be defined inline as well.
const { data } = await getAssignmentsForCourse({ courseId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAssignmentsForCourse(dataConnect, getAssignmentsForCourseVars);

console.log(data.assignments);

// Or, you can use the `Promise` API.
getAssignmentsForCourse(getAssignmentsForCourseVars).then((response) => {
  const data = response.data;
  console.log(data.assignments);
});
```

### Using `GetAssignmentsForCourse`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAssignmentsForCourseRef, GetAssignmentsForCourseVariables } from '@dataconnect/generated';

// The `GetAssignmentsForCourse` query requires an argument of type `GetAssignmentsForCourseVariables`:
const getAssignmentsForCourseVars: GetAssignmentsForCourseVariables = {
  courseId: ..., 
};

// Call the `getAssignmentsForCourseRef()` function to get a reference to the query.
const ref = getAssignmentsForCourseRef(getAssignmentsForCourseVars);
// Variables can be defined inline as well.
const ref = getAssignmentsForCourseRef({ courseId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAssignmentsForCourseRef(dataConnect, getAssignmentsForCourseVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.assignments);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.assignments);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## SeedCourses
You can execute the `SeedCourses` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
seedCourses(): MutationPromise<SeedCoursesData, undefined>;

interface SeedCoursesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<SeedCoursesData, undefined>;
}
export const seedCoursesRef: SeedCoursesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
seedCourses(dc: DataConnect): MutationPromise<SeedCoursesData, undefined>;

interface SeedCoursesRef {
  ...
  (dc: DataConnect): MutationRef<SeedCoursesData, undefined>;
}
export const seedCoursesRef: SeedCoursesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the seedCoursesRef:
```typescript
const name = seedCoursesRef.operationName;
console.log(name);
```

### Variables
The `SeedCourses` mutation has no variables.
### Return Type
Recall that executing the `SeedCourses` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SeedCoursesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SeedCoursesData {
  course_insertMany: Course_Key[];
}
```
### Using `SeedCourses`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, seedCourses } from '@dataconnect/generated';


// Call the `seedCourses()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await seedCourses();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await seedCourses(dataConnect);

console.log(data.course_insertMany);

// Or, you can use the `Promise` API.
seedCourses().then((response) => {
  const data = response.data;
  console.log(data.course_insertMany);
});
```

### Using `SeedCourses`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, seedCoursesRef } from '@dataconnect/generated';


// Call the `seedCoursesRef()` function to get a reference to the mutation.
const ref = seedCoursesRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = seedCoursesRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.course_insertMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.course_insertMany);
});
```

## CreateAssignment
You can execute the `CreateAssignment` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createAssignment(vars: CreateAssignmentVariables): MutationPromise<CreateAssignmentData, CreateAssignmentVariables>;

interface CreateAssignmentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAssignmentVariables): MutationRef<CreateAssignmentData, CreateAssignmentVariables>;
}
export const createAssignmentRef: CreateAssignmentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createAssignment(dc: DataConnect, vars: CreateAssignmentVariables): MutationPromise<CreateAssignmentData, CreateAssignmentVariables>;

interface CreateAssignmentRef {
  ...
  (dc: DataConnect, vars: CreateAssignmentVariables): MutationRef<CreateAssignmentData, CreateAssignmentVariables>;
}
export const createAssignmentRef: CreateAssignmentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createAssignmentRef:
```typescript
const name = createAssignmentRef.operationName;
console.log(name);
```

### Variables
The `CreateAssignment` mutation requires an argument of type `CreateAssignmentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateAssignmentVariables {
  courseId: UUIDString;
  title: string;
  description: string;
  dueDate: DateString;
  maxGrade: number;
  status: string;
}
```
### Return Type
Recall that executing the `CreateAssignment` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateAssignmentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateAssignmentData {
  assignment_insert: Assignment_Key;
}
```
### Using `CreateAssignment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createAssignment, CreateAssignmentVariables } from '@dataconnect/generated';

// The `CreateAssignment` mutation requires an argument of type `CreateAssignmentVariables`:
const createAssignmentVars: CreateAssignmentVariables = {
  courseId: ..., 
  title: ..., 
  description: ..., 
  dueDate: ..., 
  maxGrade: ..., 
  status: ..., 
};

// Call the `createAssignment()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createAssignment(createAssignmentVars);
// Variables can be defined inline as well.
const { data } = await createAssignment({ courseId: ..., title: ..., description: ..., dueDate: ..., maxGrade: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createAssignment(dataConnect, createAssignmentVars);

console.log(data.assignment_insert);

// Or, you can use the `Promise` API.
createAssignment(createAssignmentVars).then((response) => {
  const data = response.data;
  console.log(data.assignment_insert);
});
```

### Using `CreateAssignment`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createAssignmentRef, CreateAssignmentVariables } from '@dataconnect/generated';

// The `CreateAssignment` mutation requires an argument of type `CreateAssignmentVariables`:
const createAssignmentVars: CreateAssignmentVariables = {
  courseId: ..., 
  title: ..., 
  description: ..., 
  dueDate: ..., 
  maxGrade: ..., 
  status: ..., 
};

// Call the `createAssignmentRef()` function to get a reference to the mutation.
const ref = createAssignmentRef(createAssignmentVars);
// Variables can be defined inline as well.
const ref = createAssignmentRef({ courseId: ..., title: ..., description: ..., dueDate: ..., maxGrade: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createAssignmentRef(dataConnect, createAssignmentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.assignment_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.assignment_insert);
});
```

