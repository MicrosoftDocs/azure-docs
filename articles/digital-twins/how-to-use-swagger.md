---
title: Understanding how to use Azure Digital Twins Swagger | Microsoft Docs
description: How to use Azure Digital Twins Swagger
author: kingdomofends
manager: alinast
ms.service: azure-digital-twins
services: azure-digital-twins
ms.topic: conceptual
ms.date: 09/28/2018
ms.author: adgera
---

# Azure Digital Twins Swagger

Each provisioned Azure Digital Twins instance includes its own automatically-generated Swagger reference documentation.

[Swagger](https://swagger.io/) (or [OpenAPI](https://www.openapis.org/)) unites complex API information into an interactive and language-agnostic reference resource. Specifically, Swagger provides critical reference material about which JSON payloads, HTTP methods, and specific endpoints to use to perform operations against an API.

>[!NOTE]
> No configuration is required to use your digital twin Swagger reference material

Your generated Management API Swagger documentation can be accessed publicly at:

```plaintext
https://[yourDigitalTwinsName].[yourLocation].azuresmartspaces.net/management/swagger
```

## More about Swagger

Swagger provides an interactive summary of your API including:

* REST API endpoints specifying required request payloads, headers, parameters, context paths, and HTTP methods.
* Example response information for validating and confirming HTTP responses.
* Error code information.

### Reference material

Automatically generated reference material is supplied explaining critical concepts and Object Models.

![Swagger reference][1]

![Swagger reference][2]

![Swagger reference][3]

### Using Swagger to test endpoints

One of the powerful functionalities Swagger provides is the ability to **Try it out** on directly through the documentation UI.

![Swagger reference][4]

![Swagger reference][5]

### Understand request requirements

Each listed endpoint includes all required request information including required parameters, their types, and which HTTP method is required to access the resource.

![Swagger reference][6]

### Swagger response data

Each listed endpoint also includes valid response body data to validate your development and tests.

![Swagger reference][7]

### Swagger OAuth 2.0 authorization

To interactively test requests against API resources protected by OAuth 2.0 see the [official documentation](https://swagger.io/docs/specification/authentication/oauth2/).

## Next steps

Read more about the Management API:

> [!div class="nextstepaction"]
> [Azure Digital Twins Management API](./concepts-management-api-limits.md)

Learn how to authenticate with your Management API:

> [!div class="nextstepaction"]
> [Authenticating with APIs](./security-authenticating-apis.md)

<!-- Images -->
[1]: media/concepts/swagger_management_top.png
[2]: media/concepts/swagger_management_models.png
[3]: media/concepts/swagger_management_model.png
[4]: media/concepts/swagger_management_try.png
[5]: media/concepts/swagger_management_tried.png
[6]: media/concepts/swagger_management_endpoints.png
[7]: media/concepts/swagger_management_response.png
