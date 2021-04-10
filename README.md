# Coderitter API adopted Remote Method API

An adoption of the [remote-method-api](https://github.com/c0deritter/remote-method-api) package for the Coderitter API. Also refer to the original [documentation](https://github.com/c0deritter/remote-method-api#readme).

## Related packages

This package uses [coderitter-api-remote-method-call](https://github.com/c0deritter/remote-method-api/tree/coderitter-api). Also have a look at [knight-criteria](https://github.com/c0deritter/knight-criteria) which can be used as read parameter for the corresponding remote methods calls. Also have a look at [knight-orm](https://github.com/c0deritter/knight-orm) which offers a way to interact with a database.

To carry out a remote method call from inside the browser take a look at the package [coderitter-api-postonly-request](https://github.com/c0deritter/postonly-request/tree/coderitter-api).

## Install

`npm install coderitter-api-remote-method-api`

## Overview

This package works in conjunction with [coderitter-api-remote-method-call](https://github.com/c0deritter/remote-method-call/tree/coderitter-api) which provides a simple interface to describe a remote method call and class to describe a result.

```typescript
interface RemoteMethodCall {
  methodName: string
  parameter?: any
}

class Result {
  type: string
  misfits!: Misfit[]
  remoteError!: string
  ...
}
```

### Define result classes

The Coderitter API version of this package wants you to return `Result` objects. You need to derive a class for very use case. Take a look into the [documentation of coderitter-api-remote-method-call](https://github.com/c0deritter/remote-method-call/tree/coderitter-api#readme).

```typescript
import { Result } from 'coderitter-api-remote-method-call'

class UserCreateResult extends Result {
  constructor(public createdUser: User) { super() }
}

class UserReadResult extends Result {
  constructor(public readUsers: User) { super() }
}

class UserUpdateResult extends Result {
  constructor(public updatedUser: User) { super() }
}

class UserDeleteResult extends Result {
  constructor(public deletedUser: User) { super() }
}
```

### Register remote methods

Once you defined your result classes you can register the remote methods. As parameter for the `User.read` method you can use `ReadCriteria` from the package [knight-criteria](https://github.com/c0deritter/knight-criteria) which offers a way to describe database queries. For the database access itself you can take a look at [knight-orm](https://github.com/c0deritter/knight-orm) which offers a way to interact with the database.

```typescript
import { RemoteMethodApi } from 'coderitter-api-remote-method-api'
import { ReadCriteria } from 'knight-criteria'

let api = new RemoteMethodApi

// register remote methods
api.methods = {
  'User.create': async (parameter: any) => {
    let created = db.create(parameter)
    return new UserCreateResult(created)
  },

  'User.read': async (criteria: ReadCriteria) => {
    let users = db.read(parameter)
    return new UserReadResult(users)
  },

  'User.update': async (parameter: any) => {
    let updated = db.update(parameter)
    return new UserUpdateResult(updated)
  },

  'User.delete': async (parameter: any) => {
    let deleted = db.delete(parameter)
    return new UserDeleteResult(deleted)
  }
}
```

### Call a remote method

Now you are ready to make remote method calls.

```typescript
import { RemoteMethodCall } from 'coderitter-api-remote-method-call'

let remoteMethodCall: RemoteMethodCall = {
  methodName: 'User.create',
  // the parameter can be of any type
  parameter: { name: 'Ruben' }
}

let result = await api.callMethod(remoteMethodCall)

// result is an instance of class UserCreateResult
result == {
  type: 'value',
  createdUser: {
    id: 1,
    name: 'Ruben'
  }
}
```

### Reaction to thrown exceptions inside the remotely called method

If the remotely called method throws an exception, an instance of class `Result` with a set remote error is returned.

```typescript
Result.remoteError(`There was an error with your request. We just were informed that it happened and we will look into the issue. Please try again later.`)
```

### Reaction to not supported remote method calls

If the remotely called method is not found, an instance of class `Result` with a set remote error is returned.

```typescript
Result.remoteError(`Remote method '${methodName}' not supported.`)
```

### Create a sophisticated remote method call handler with LocalMethodCall interface

Instead of assigning a remote method call directly as a function you can also assign any object satisfying the interface `MethodCall`.

```typescript
import { MethodCall } from 'coderitter-api-remote-method-api'

export default interface MethodCall {
  callMethod(parameter: any): Promise<Result>
}
```