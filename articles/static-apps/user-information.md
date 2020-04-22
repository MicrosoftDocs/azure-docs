---
title: Accessing user information in Azure Static Web Apps
description: Learn to read authorization provider-returned user data.
services: azure-functions
author: craigshoemaker
ms.service: azure-functions
ms.topic:  conceptual
ms.date: 05/08/2020
ms.author: cshoe
---

# Accessing user information in Azure Static Web Apps

Azure Static Web Apps provides authentication-related user information via a [direct request URL](#direct-access) and to [API](#api-access) functions.

## Client principal data

User information is available in the app via the `x-ms-client-principal` request header. Client principal data sent in the header is a Base64-encoded string that contains a serialized JSON object containing information about the user. The object contains the following properties:

| Property  | Description |
|-----------|---------|
| `identityProvider` | The name of the [identity provider](authentication-authorization.md). |
| `userId` | An Azure Static Web Apps-specific unique identifier for the user.  <ul><li>The value is unique on a per-app basis. For instance, the same user returns a different `userId` value on a different Static App.<li>The value persists for the lifetime of a user. If you delete and then add the same user back to the app, then the `userId` is a different value.</ul>|
| `userDetails` | Username or email address of the user. Some providers return the [user's email address](authentication-authorization.md), while others send the [user handle](authentication-authorization.md). |
| `userRoles`     | An array of the [user's assigned roles](authentication-authorization.md). |

The following example is a sample decoded `x-ms-client-principal` payload:

```json
{
  "identityProvider": "facebook",
  "userId": "d75b260a64504067bfc5b2905e3b8182",
  "userDetails": "user@example.com",
  "userRoles": [ "anonymous", "authenticated" ]
}
```

## Direct access

To get direct access to the client principal data, you can send a `GET` request to the `/.auth/me` route. When the state of your view is driven by authorization, use this approach for the best performance.

When users are logged-in, the payload from this request is a client principal JSON object. Requests from unauthenticated users returns `null`.

Using the [fetch](https://developer.mozilla.org/docs/Web/API/Fetch_API/Using_Fetch) API, you can access the client principal data using the following syntax.

```javascript
fetch("/.auth/me/")
  .then(response => response.json())
  .then(payload => {
    const { clientPrincipal } = payload;
    console.log(clientPrincipal);
  });
```

Libraries like [axios](https://github.com/axios/axios) make accessing user information even easier.

```javascript
axios.get("/.auth/me").then(response => {
  const { clientPrincipal } = response.data;
  console.log(clientPrincipal);
});
```

## API access

Client principal data is passed to API functions in the request header. To make this information accessible to the browser, you can return user data from a function.

### In the function

The following example function, named `user`, shows how to return user information to the client.

```javascript
module.exports = async function (context, req) {
  const header = req.headers["x-ms-client-principal"];
  const encoded = Buffer.from(header, "base64");
  const decoded = encoded.toString("ascii");

  context.res = {
    body: {
      clientPrincipal: JSON.parse(decoded)
    }
  };
};
```

### In the browser

Using the [fetch](https://developer.mozilla.org/docs/Web/API/Fetch_API/Using_Fetch) API, you can access the API's response  using the following syntax.

```javascript
fetch("/api/user/")
  .then(response => response.json())
  .then(payload => {
    const { clientPrincipal } = payload;
    console.log(clientPrincipal);
  });
```

Libraries like [axios](https://github.com/axios/axios) make accessing the response even easier.

```javascript
axios.get(`/api/user`).then(response => {
  const { clientPrincipal } = response.data;
  console.log(clientPrincipal);
});
```

## Next steps

> [!div class="nextstepaction"]
> [Configure environment variables](environment-variables.md)
