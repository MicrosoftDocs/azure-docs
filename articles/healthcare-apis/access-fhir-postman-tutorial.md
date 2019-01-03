---
title: Postman FHIR Server Tutorial
description: This article describes how to use Postman to interact with a FHIR Server in Azure.
services: healthcare-apis
ms.service: healthcare-apis
ms.topic: tutorial
ms.reviewer: dseven
ms.author: mihansen
author: hansenms
ms.date: 02/11/2019
---

# Postman FHIR Server Tutorial

A client application would access a FHIR server through a [REST API](https://www.hl7.org/fhir/http.html). You may also want to interact directly with the FHIR server as you build applications, for example, for debugging purposes. In this tutorial, we will walk through the steps needed to use [Postman](https://www.getpostman.com/) to access the FHIR server. Postman is a tool often used for debugging when building applications that access APIs.

## Prerequisites

- A FHIR endpoint in Azure. You can set that up using the Microsoft Healthcare APIs for FHIR. There are quickstarts available for [Azure portal](fhir-paas-portal-quickstart.md), [PowerShell](fhir-paas-powershell-quickstart.md), or [Azure CLI](fhir-paas-cli-quickstart.md).
- [Azure Active Directory authentication](configure-fhir-identity-tutorial.md) configured for the FHIR endpoint.
- Postman installed. You can get it from [https://www.getpostman.com](https://www.getpostman.com)

## Collect FHIR Server and Authentication details

In order to use Postman, you will need to know the following details:

- Your FHIR server URL, for example, `https://MYFHIRSERVICE.azurewebsites.net` or `https://MYACCOUNT.microsofthealthcare-apis.com/fhir`
- The identity provider `Authority` for your FHIR server, for example, `https://login.microsoftonline.com/{TENANT-ID}`
- The configured `Audience`, which would be set in the [Azure AD resource application registration](register-resource-aad-client-app.md).
- The `client_id` (or application ID) of the [client application](register-confidential-aad-client-app.md) you will be using to access the FHIR service.
- The `client_secret` (or application secret) of the client application.

Finally, you should check that `https://www.getpostman.com/oauth2/callback` is a registered reply URL for your client application.

## Open Postman and connect to FHIR Server

Using Postman, do a `GET` request to `https://fhir-server-url/metadata`:

![Postman Metadata Capability Statement](media/tutorial-postman/postman-metadata.png)

In this example, the FHIR server URL is `https://fhirdocsmsft.azurewebsites.net` and the capability statement of the server is available at `https://fhirdocsmsft.azurewebsites.net/metadata`. That endpoint should be accessible without authentication.

If you attempt to access restricted resources, you should then an "Authentication failed" response:

![Authentication Failed](media/tutorial-postman/postman-authentication-failed.png)

## Obtaining an access token

To obtain a valid access token, select "Authorization" and pick TYPE "OAuth 2.0":

![Set OAuth 2.0](media/tutorial-postman/postman-select-oauth2.png)

Hit "Get New Access Token" and a dialog appears:

![Request New Access Token](media/tutorial-postman/postman-request-token.png)

You will need to some details:
| Field                 | Example Value                                                                                                   | Comment                    |
|-----------------------|-----------------------------------------------------------------------------------------------------------------|----------------------------|
| Token Name            | MYTOKEN                                                                                                         | A name you choose          |
| Grant Type            | Authorization Code                                                                                              |                            |
| Callback URL          | `https://www.getpostman.com/oauth2/callback`                                                                      |                            |
| Auth URL              | `https://login.microsoftonline.com/{TENANT-ID}/oauth2/authorize?resource=https://MYFHIRSERVICE.azurewebsites.net` | resource is the `Audience` |
| Access Token URL      | `https://login.microsoftonline.com/{TENANT ID}/oauth2/token`                                                      |                            |
| Client ID             | `2a73e546-XXX-XXXX-XXXX-35d04139f7cc`                                                                            | Application ID             |
| Client Secret         | `XXXXXXXX`                                                                                                        | Secret client key          |
| State                 | `1234`                                                                                                            |                            |
| Client Authentication | Send client credentials in body                                                                                 |                 

Hit "Request Token" and you will be guided through the Azure Active Directory Authentication flow and a token will be returned to Postman. If you run into problems open the Postman Console (from the "View->Show Postman Console" menu item).

Scroll down on the returned token screen and hit "Use Token":

![Use Token](media/tutorial-postman/postman-use-token.png)

The token should now be populated in the "Access Token" field and you can select tokens from "Available Tokens". If you "Send" again to repeat the `Patient` resource search, you should get a Status `200 OK`:

![200 OK](media/tutorial-postman/postman-200-OK.png)

In this case, there are no patients in the database and the search is empty.

If you inspect the access token with a tool like [https://jwt.ms](https://jwt.ms), you should see content like:

```json
{
  "aud": "https://FHIRSERVER-AUDIENCE.azurewebsites.net",
  "iss": "https://sts.windows.net/{TENANT-ID}/",
  "iat": 1545343803,
  "nbf": 1545343803,
  "exp": 1545347703,
  "acr": "1",
  "aio": "AUQAu/8JXXXXXXXXXdQxcxn1eis459j70Kf9DwcUjlKY3I2G/9aOnSbw==",
  "amr": [
    "pwd"
  ],
  "appid": "2a73e546-7a7f-4dc3-92e2-35d04139f7cc",
  "appidacr": "1",

  ...// Truncated
}
```

In troubleshooting situations, validating that you have the correct Audience (`aud` claim) is a good place to start

## Inserting a patient

Now that you have a valid access token. You can insert a new patient. Switch to method "POST" and add the following JSON document in the body of the request:

[!code-json[](samples/sample-patient.json)]

Hit "Send" and you should see that the patient is successfully created:

![Patient Created](media/tutorial-postman/postman-patient-created.png)

If you repeat the patient search, you should now see the patient record:

![Patient Created](media/tutorial-postman/postman-patient-found.png)

