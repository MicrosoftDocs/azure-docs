---
title: Authentication and authorization
description: This article provides an overview of the authentication and authorization of Azure Health Data Services.
services: healthcare-apis
author: chachachachami
ms.service: healthcare-apis
ms.topic: overview
ms.date: 06/06/2022
ms.author: chrupa
---

# Authentication and authorization for Azure Health Data Services

## Authentication

 Azure Health Data Services is a collection of secured managed services using [Microsoft Entra ID](../active-directory/index.yml), a global identity provider that supports [OAuth 2.0](https://oauth.net/2/).

For Azure Health Data Services to access Azure resources, such as storage accounts and event hubs, you must **enable the system managed identity**, and **grant proper permissions** to the managed identity. For more information, see [Azure managed identities](../active-directory/managed-identities-azure-resources/overview.md).

Azure Health Data Services doesn't support other identity providers. However, you can use their own identity provider to secure applications, and enable them to interact with the Health Data Services by managing client applications and user data access controls.

The client applications are registered in the Microsoft Entra ID and can be used to access the Azure Health Data Services. User data access controls are done in the applications or services that implement business logic.

### Application roles

Authenticated users and client applications of the Azure Health Data Services must be granted with proper application roles.

FHIR service of Azure Health Data Services provides the following roles:

* **FHIR Data Reader**: Can read (and search) FHIR data.
* **FHIR Data Writer**: Can read, write, and soft delete FHIR data.
* **FHIR Data Exporter**: Can read and export ($export operator) data.
* **FHIR Data Importer**: Can read and import ($import operator) data.
* **FHIR Data Contributor**: Can perform all data plane operations.
* **FHIR Data Converter**: Can use the converter to perform data conversion.
* **FHIR SMART User**: Role allows user to read and write FHIR data according to the [SMART IG V1.0.0 specifications](http://hl7.org/fhir/smart-app-launch/1.0.0/).

DICOM service of Azure Health Data Services provides the following roles:

* **DICOM Data Owner**: Can read, write, and delete DICOM data.
* **DICOM Data Read**: Can read DICOM data.

The MedTech service doesn't require application roles, but it does rely on the "Azure Event Hubs Data Receiver" to retrieve data stored in the event hub of the customer's subscription.

## Authorization

After being granted with proper application roles, the authenticated users and client applications can access Azure Health Data Services by obtaining a **valid access token** issued by Microsoft Entra ID, and perform specific operations defined by the application roles.
 
* For FHIR service, the access token is specific to the service or resource.
* For DICOM service, the access token is granted to the `dicom.healthcareapis.azure.com` resource, not a specific service.
* For MedTech service, the access token isn’t required because it isn’t exposed to the users or client applications.

### Steps for authorization

There are two common ways to obtain an access token, outlined in detail by the Microsoft Entra documentation: [authorization code flow](../active-directory/develop/v2-oauth2-auth-code-flow.md) and [client credentials flow](../active-directory/develop/v2-oauth2-client-creds-grant-flow.md).

Here's how an access token for Azure Health Data Services is obtained using **authorization code flow**:

1. **The client sends a request to the Microsoft Entra authorization endpoint.** Microsoft Entra ID redirects the client to a sign-in page where the user authenticates using appropriate credentials (for example: username and password, or a two-factor authentication). **Upon successful authentication, an authorization code is returned to the client.** Microsoft Entra-only allows this authorization code to be returned to a registered reply URL configured in the client application registration.

2. **The client application exchanges the authorization code for an access token at the Microsoft Entra token endpoint.** When the client application requests a token, the application may have to provide a client secret (which you can add during application registration).
 
3. **The client makes a request to the Azure Health Data Services**, for example, a `GET` request to search all patients in the FHIR service. The request **includes the access token in an `HTTP` request header**, for example, **`Authorization: Bearer xxx`**.

4. **Azure Health Data Services validates that the token contains appropriate claims (properties in the token).** If it’s valid, it completes the request and returns data to the client.

In the **client credentials flow**, permissions are granted directly to the application itself. When the application presents a token to a resource, the resource enforces that the application itself has authorization to perform an action since there’s no user involved in the authentication. Therefore, it’s different from the **authorization code flow** in the following ways:

- The user or the client doesn’t need to sign in interactively.
- The authorization code isn’t required.
- The access token is obtained directly through application permissions.

### Access token

The access token is a signed, [Base64](https://en.wikipedia.org/wiki/Base64) encoded collection of properties (claims) that convey information about the client's identity, roles, and privileges granted to the user or client.

Azure Health Data Services typically expects a [JSON Web Token](https://en.wikipedia.org/wiki/JSON_Web_Token). It consists of three parts:

* Header
* Payload (the claims)
* Signature, as shown in the image. For more information, see [Azure access tokens](../active-directory/develop/configurable-token-lifetimes.md).

[ ![JASON web token signature.](media/azure-access-token.png) ](media/azure-access-token.png#lightbox)

Use online tools such as [https://jwt.ms](https://jwt.ms/) to view the token content. For example, you can view the claims details.

|**Claim type**          |**Value**               |**Notes**                               |
|------------------------|------------------------|----------------------------------------|
|aud                     |https://xxx.fhir.azurehealthcareapis.com|Identifies the intended recipient of the token. In `id_tokens`, the audience is your app's Application ID, assigned to your app in the Azure portal. Your app should validate this value and reject the token if the value doesn’t match.|
|iss                     |https://sts.windows.net/{tenantid}/|Identifies the security token service (STS) that constructs and returns the token, and the Microsoft Entra tenant in which the user was authenticated. If the token was issued by the v2.0 endpoint, the URI ends in `/v2.0`. The GUID that indicates that the user is a consumer user from a Microsoft account is `9188040d-6c67-4c5b-b112-36a304b66dad`. Your app should use the GUID portion of the claim to restrict the set of tenants that can sign in to the app, if it's applicable.|
|iat                     |(time stamp)            |"Issued At" indicates when the authentication for this token occurred.|
|nbf                     |(time stamp)            |The "nbf" (not before) claim identifies the time before which the JWT MUST NOT be accepted for processing.|
|exp                     |(time stamp)            |The "exp" (expiration time) claim identifies the expiration time on or after which the JWT MUST NOT be accepted for processing. Note that a resource may reject the token before this time, for example if a change in authentication is required, or a token revocation has been detected.|
|aio                     |E2ZgYxxx                |An internal claim used by Microsoft Entra ID to record data for token reuse. Should be ignored.|
|appid                   |e97e1b8c-xxx            |The application ID of the client using the token. The application can act as itself or on behalf of a user. The application ID typically represents an application object, but it can also represent a service principal object in Microsoft Entra ID.|
|appidacr                |1                       |Indicates how the client was authenticated. For a public client, the value is 0. If client ID and client secret are used, the value is 1. If a client certificate was used for authentication, the value is 2.|
|idp                     |https://sts.windows.net/{tenantid}/|Records the identity provider that authenticated the subject of the token. This value is identical to the value of the Issuer claim unless the user account isn’t in the same tenant as the issuer - guests, for instance. If the claim isn’t present, it means that the value of iss can be used instead. For personal accounts being used in an organizational context (for instance, a personal account invited to a Microsoft Entra tenant), the idp claim may be 'live.com' or an STS URI containing the Microsoft account tenant 9188040d-6c67-4c5b-b112-36a304b66dad.|
|oid                     |For example, tenantid         |The immutable identifier for an object in the Microsoft identity system, in this case, a user account. This ID uniquely identifies the user across applications - two different applications signing in the same user receives the same value in the oid claim. The Microsoft Graph returns this ID as the ID property for a given user account. Because the oid allows multiple apps to correlate users, the profile scope is required to receive this claim. Note: If a single user exists in multiple tenants, the user contains a different object ID in each tenant - they’re considered different accounts, even though the user logs into each account with the same credentials.|
|rh                       |0.ARoxxx              |An internal claim used by Azure to revalidate tokens. It should be ignored.|
|sub                      |For example, tenantid        |The principle about which the token asserts information, such as the user of an app. This value is immutable and can’t be reassigned or reused. The subject is a pairwise identifier - it’s unique to a particular application ID. Therefore, if a single user signs into two different apps using two different client IDs, those apps receive two different values for the subject claim. You may or may not desire this result depending on your architecture and privacy requirements.|
|tid                      |For example, tenantid        |A GUID that represents the Microsoft Entra tenant that the user is from. For work and school accounts, the GUID is the immutable tenant ID of the organization that the user belongs to. For personal accounts, the value is 9188040d-6c67-4c5b-b112-36a304b66dad. The profile scope is required in order to receive this claim.
|uti                      |bY5glsxxx             |An internal claim used by Azure to revalidate tokens. It should be ignored.|
|ver                      |1                     |Indicates the version of the token.|
 
**The access token is valid for one hour by default. You can obtain a new token or renew it using the refresh token before it expires.**

To obtain an access token, you can use tools such as Postman, the REST Client extension in Visual Studio Code, PowerShell, CLI, curl, and the [Microsoft Entra authentication libraries](../active-directory/develop/reference-v2-libraries.md).

## Encryption

When you create a new service of Azure Health Data Services, your data is encrypted using **Microsoft-managed keys** by default. 

* FHIR service provides encryption of data at rest when data is persisted in the data store.
* DICOM service provides encryption of data at rest when imaging data including embedded metadata is persisted in the data store. When metadata is extracted and persisted in the FHIR service, it’s encrypted automatically.
* MedTech service, after data mapping and normalization, persists device messages to the FHIR service, which is encrypted automatically. In cases where device messages are sent to Azure Event Hubs, which use Azure Storage to store the data, data is automatically encrypted with Azure Storage Service Encryption (Azure SSE).

## Next steps

In this document, you learned the authentication and authorization of Azure Health Data Services. To learn how to deploy an instance of Azure Health Data Services, see

>[!div class="nextstepaction"]
>[Deploy Azure Health Data Services workspace using the Azure portal](healthcare-apis-quickstart.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
