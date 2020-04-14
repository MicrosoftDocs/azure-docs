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

| Header  | Description |
|---------|-------------|
| `x-ms-client-principal-name` | The provider's unique identifier. Depending on the provider, this is either the user's email address or the person's username. |
| `x-ms-client-principal-id`   | Either the user's ID for the identity provider, or a server-generated unique ID. |
| `x-ms-client-principal-idp`     | The name of the identity provider used to login. |
| `x-ms-client-principal`     | A serialized object containing values of each of the above data. |

## Next steps

> [!div class="nextstepaction"]
> [Add a database](add-database.md)
