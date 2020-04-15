---
title: Accessing user information in an App Service Static Apps API
description: Learn to read authorization provider-returned user data in a function.
services: azure-functions
author: craigshoemaker
ms.service: azure-functions
ms.topic:  conceptual
ms.date: 05/08/2020
ms.author: cshoe
---

# Accessing user information in an App Service Static Apps API

Once logged in, each request to an API function includes authentication-related user information. This information is available in the request headers sent to an API function.

| Header  | Description |
|---------|-------------|
| <nobr>`x-ms-client-principal-name`</nobr> | The provider's unique identifier. Depending on the provider, this value is either the user's email address or the person's username. |
| `x-ms-client-principal-id`  | Either the user's ID for the identity provider, or a server-generated unique ID. |
| `x-ms-client-principal-idp` | The name of the identity provider used to log in. |
| `x-ms-client-principal`     | A serialized object containing values of each of the above data. |

## In the API

Authenticated user information is passed to an API function in the request header. To make this information accessible to the browser, you can return the headers in a response intended for the client.

The following example function named `user` shows how to return user information to the client.

```javascript
module.exports = async function (context, req) {
  const data = {
    name: req.headers[`x-ms-client-principal-name`],
    id: req.headers[`x-ms-client-principal-id`],
    provider: req.headers[`x-ms-client-principal-idp`],
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

## Example output

The following response is similar to what is sent to the browser based on the example shown in this article.

```json
{
    "id": "55545156",
    "name": "staticwebdev",
    ​"principal": {
      "identityProvider": "github",
      "userId": "55545156",
      "userDetails": "staticwebdev",
      "userRoles":["anonymous", "authenticated"]
      },
​    "provider": "github"
}
```

## Next steps

> [!div class="nextstepaction"]
> [Add a database](add-database.md)
