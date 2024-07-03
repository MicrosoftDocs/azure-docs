---
title: Configure multiple service identity providers for the FHIR service in Azure Health Data Services
description: Learn how to configure multiple identity providers for the FHIR service in Azure Health Data Services by using OpenID Connect and SMART on FHIR v1 Scopes.
services: healthcare-apis
author: namalu
ms.service: healthcare-apis
ms.subservice: fhir
ms.custom: devx-track-arm-template
ms.topic: tutorial
ms.date: 01/15/2024
ms.author: namalu
---

# Configure multiple service identity providers

In addition to [Microsoft Entra ID](/entra/fundamentals/whatis), you can configure up to two additional identity providers for a FHIR service, whether the service already exists or is newly created. 

## Identity providers prerequisite
Identity providers must support OpenID Connect (OIDC), and must be able to issue JSON Web Tokens (JWT) with a `fhirUser` claim, a `azp` or `appid` claim, and an `scp` claim with [SMART on FHIR v1 Scopes](https://www.hl7.org/fhir/smart-app-launch/1.0.0/scopes-and-launch-context/index.html#scopes-for-requesting-clinical-data).

## Enable additional identity providers with Azure Resource Manager (ARM)

Add the `smartIdentityProviders` element to the FHIR service `authenticationConfiguration` to enable additional identity providers. The `smartIdentityProviders` element is optional. If you omit it, the FHIR service uses Microsoft Entra ID to authenticate requests.


| **Element** | **Type** | **Description** |
|---|---|---|
| [smartIdentityProviders](#configure-the-smartidentityproviders-array) | array | An array containing up to two identity provider configurations. This element is optional. |
| [authority](#specify-the-authority) | string | The identity provider token authority. |
| [applications](#configure-the-applications-array) | array | An array of identity provider resource application configurations. |
| [clientId](#identify-the-application-with-the-clientid-string) | string | The identity provider resource application (client) ID. |
| [audience](#validate-the-access-token-with-the-audience-string) | string | Used to validate the access token `aud` claim. |
| [allowedDataActions](#specify-the-permissions-with-the-alloweddataactions-array) | array | An array of permissions the identity provider resource application is allowed to perform. |

```json
{
  "properties": {
    "authenticationConfiguration": {
      "authority": "string",
      "audience": "string",
      "smartProxyEnabled": "bool",
      "smartIdentityProviders": [
        {
          "authority": "string",
          "applications": [
            {
              "clientId": "string",
              "audience": "string",
              "allowedDataActions": "array"
            }
          ]
        }
      ]
    }
  }
}
```

#### Configure the `smartIdentityProviders` array

If you don't need any identity providers besides Microsoft Entra ID, set the `smartIdentityProviders` array to null, or omit it from the provisioning request. Otherwise, include at least one valid identity provider configuration object in the array. You can configure up to two additional identity providers.

#### Specify the `authority`

You must specify the `authority` string for each identity provider you configure. The `authority` string is the token authority that issues the access tokens for the identity provider. The FHIR service rejects requests with a `401 Unauthorized` error code if the `authority` string is invalid or incorrect.

Before you make a provisioning request, validate the `authority` string by checking the openid-connect configuration endpoint. Append **/.well-known/openid-configuration** to the end of the `authority` string and paste it in your browser. You should see the expected configuration. If you don't, the string has a problem.

Example:

```http
https://yourIdentityProvider.com/authority/v2.0/.well-known/openid-configuration
```

#### Configure the `applications` array

You must include at least one application configuration and at most two in the `applications` array. Each application configuration has values that validate access token claims and an array that defines the permissions for the application to access FHIR resources.

#### Identify the application with the `clientId` string

The identity provider defines the application with a unique identifier called the `clientId` string (or application ID). The FHIR service validates the access token by checking the `authorized party` (azp) or `application id` (appid) claim against the `clientId` string. The FHIR service rejects requests with a `401 Unauthorized` error code if the `clientId` string and the token claim don't match exactly.

#### Validate the access token with the `audience` string

The `aud` claim in an access token identifies the intended recipient of the token. The `audience` string is the unique identifier for the recipient. The FHIR service validates the access token by checking the `audience` string against the `aud` claim. The FHIR service rejects requests with a `401 Unauthorized` error code if the `audience` string and the `aud` claim don't match exactly.

#### Specify the permissions with the `allowedDataActions` array

Include at least one permission string in the `allowedDataActions` array. You can include any valid permission strings, but avoid duplicates.

| **Valid permission string** | **Description** |
|---|---|
| Read | Allows resource `GET` requests. |

## Next steps

[Use Azure Active Directory B2C to grant access to the FHIR service](azure-ad-b2c-setup.md)

[Troubleshoot identity provider configuration](troubleshoot-identity-provider-configuration.md)

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
