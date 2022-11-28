---
title: Azure Active Directory REST API - Test by using Postman
description: Use Postman to test the Azure App Configuration REST API
author: maud-lv
ms.author: malev
ms.service: azure-app-configuration
ms.topic: reference
ms.date: 08/17/2020
---

# Test the Azure App Configuration REST API using Postman

To test the REST API using [Postman](https://www.getpostman.com/), you'll need to include the HTTP headers required for [authentication](./rest-api-authentication-hmac.md) in your requests. Here's how to configure Postman for testing the REST API, generating the authentication headers automatically:

1. Create a new [request](https://learning.getpostman.com/docs/postman/sending_api_requests/requests/)
1. Add the `signRequest` function from the [JavaScript authentication sample](./rest-api-authentication-hmac.md#javascript) to the [pre-request script](https://learning.getpostman.com/docs/postman/scripts/pre_request_scripts/) for the request
1. Add the following code to the end of the pre-request script. Update the access key as indicated by the TODO comment

    ```js
    // TODO: Replace the following placeholders with your access key
    var credential = "<Credential>"; // Id
    var secret = "<Secret>"; // Value

    var isBodyEmpty = pm.request.body === null || pm.request.body === undefined || pm.request.body.isEmpty();

    var headers = signRequest(
        pm.request.url.getHost(),
        pm.request.method,
        pm.request.url.getPathWithQuery(),
        isBodyEmpty ? undefined : pm.request.body.toString(),
        credential,
        secret);

    // Add headers to the request
    headers.forEach(header => {
        pm.request.headers.upsert({key: header.name, value: header.value});
    })
    ```

1. Send the request
