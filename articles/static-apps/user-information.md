---
title: Accessing user information in an Azure Static Web Apps API
description: Learn to read authorization provider-returned user data in a function.
services: azure-functions
author: craigshoemaker
ms.service: azure-functions
ms.topic:  conceptual
ms.date: 05/08/2020
ms.author: cshoe
---

# Accessing user information in an Azure Static Web Apps API

Once logged in, each request to an API function includes authentication-related user information in the request header.

## Header

The `x-ms-client-principal` header is a base64-encoded string, which includes the following user-identifying data.

| Property  | Description |
|-----------|---------|
| identityProvider | The name of the identity provider |
| userId | An Azure Static Web Apps-specific unique identifier for the user.  <ul><li>This value is unique on a per-app basis. The same user returns a different `userId` on a different Static App<li>The value persists for the lifetime of a user. If you delete and then add a user back, the `userId` returns a different value.</ul>|
| userDetails | [Username or email address of the user](authentication-authorization.md). Some providers return a user's email address, while others use send the user handle. |
| userRoles     | An array of the [user's roles](authentication-authorization.md). |

The following is a sample `x-ms-client-principal` value:

```javascript
{
  identityProvider: "facebook",
  userId: "d75b260a64504067bfc5b2905e3b8182",
  userDetails: "user@example.com",
  userRoles: [ "anonymous", "authenticated" ]
}
```

## In the API

Authenticated user information is passed to an API function in the request header. To make this information accessible to the browser, you can return the header value in a response intended for the client.

The following example function named `user` shows how to return user information to the client.

```javascript
module.exports = async function (context, req) {
  const data = {
    principal: req.headers[`x-ms-client-principal`],
  };

  context.res = {
    body: data,
  };
};
```

## In the browser

Using the [fetch](https://developer.mozilla.org/docs/Web/API/Fetch_API/Using_Fetch) API, you can access the response data using the following syntax.

```javascript
fetch("/api/user/")
  .then(response => Promise.all([response.ok, response.text()]))
  .then(data => console.log(data));
```

Using libraries like [axios](https://github.com/axios/axios) make the process of accessing returned user information even easier.

```javascript
axios.get(`/api/user`).then(response => console.log(response.data));
```

## Next steps

> [!div class="nextstepaction"]
> [Configure environment variables](environment-variables.md)
