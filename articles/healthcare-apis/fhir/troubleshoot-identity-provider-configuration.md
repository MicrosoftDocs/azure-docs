---
title: Troubleshoot identity provider configuration for the FHIR service in Azure Health Data Services
description: Learn how to troubleshoot identity provider configuration for the FHIR service in Azure Health Data Services, including Azure Active Directory B2C. Use API version 2023-12-01 to configure two non-Microsoft identity providers for scoped access.
services: healthcare-apis
author: namalu
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: tutorial
ms.date: 01/15/2024
ms.author: namalu
---

# Troubleshoot identity provider configuration for the FHIR service

API version 2023-12-01 of the FHIR&reg; service in Azure Health Data Services supports two identity providers in addition to [Microsoft Entra ID](/entra/identity/). To provide scoped access to users, you configure the two identity providers by populating the `smartIdentityProviders` section of the `authenticationConfiguration` object.

## Error messages

Here are the error messages that occur if the FHIR service SMART identity providers fail, and recommended actions to take to resolve the issue.

| Error | Cause | Fix |
| --- | --- | --- |
| **The maximum number of SMART identity providers is 2.** | The number of identity providers configured is more than two. | Reduce the number of identity providers to two or less. |
| **One or more SMART identity provider authority values are null, empty, or invalid.** | The `authority` element of the identity provider configuration must be a fully qualified URL. | Ensure all `authority` values are fully qualified URLs. |
| **All SMART identity provider authorities must be unique.** | The `authority` elements of the two identity provider configurations are identical. | Ensure all `authority` values are unique, fully qualified URLs. |
| **The maximum number of SMART identity provider applications is 2.** | The number of identity provider applications in an identity provider configuration is more than two. | Reduce the number of identity provider applications to one or two per identity provider. |
| **One or more SMART applications are null.** | The `applications` element for one or more identity providers is null or contains no applications. | Ensure all identity provider configurations have at least one application configured. |
| **One or more SMART application `allowedDataActions` contain duplicate elements.** | The `allowedDataActions` array in one or more application configurations contains duplicate values. | Remove any duplicate values in the `allowedDataActions` arrays. |
| **One or more SMART application `allowedDataActions` values are invalid.** | The only acceptable value in the `allowedDataActions` array is `Read`.| Remove any nonconforming values from the `allowedDataActions` arrays. |
| **One or more SMART application `allowedDataActions` values are null, empty, or invalid.** | The `allowedDataActions` array in one or more application configurations is null, empty, or malformed. | The only acceptable value in the `allowedDataActions` array is `Read`. |
| **One or more SMART application `audience` values are null, empty, or invalid.** | The `audience` string in one or more application configurations is null, empty, or malformed. | Ensure the `audience` string isn't null or empty and that the value is a string type. |
| **All SMART identity provider application client ids must be unique.** | The `clientId` value in one or more application configurations is the same value as another `clientId` value. | Ensure all `clientId` values are unique (including across identity provider configurations). |
| **One or more SMART application client id values are null, empty, or invalid.** | The `clientId` string in one or more application configurations is null, empty, or malformed. | Ensure the `clientId` string isn't null or empty and that the value is a string type. |

## FHIR API request errors

When you use a token issued by a SMART identity provider to make requests to the FHIR service, you might encounter two common error codes: `401 Unauthorized` or `403 Forbidden`. To start troubleshooting, check the configuration of the `smartIdentityProviders` element, especially if the FHIR service is new.

Follow these steps to verify the correct configuration of the `smartIdentityProviders` element.

1. **Verify the `smartIdentityProviders` element is configured correctly**. 

1. **Verify the `authority` string is correct**. Ensure the `authority` string is the token authority for the identity provider that issued the access token.

1. **Verify the the `authority` string is a valid token authority**. Make a request for the openid-connect configuration. Append `/.well-known/openid-configuration` to the end of the `aubrowser navigatesthority` string, and then paste it into your browser. If the value is correct, the browser navigates to the `openid-connect configuration`. If it doesn't, there's a problem with the string.

   Example:

   ```http
   https://<YOUR_IDENTITY_PROVIDER_AUTHORITY>/authority/v2.0/.well-known/openid-configuration

   ```

4. **Verify the `clientId` string is correct**. Ensure the `clientId` string matches the client ID (or application ID) of the resource application defined in the identity provider.

5. **Verify the request method is GET**. The only supported request type is `GET`, because the `allowedDataActions` values only supports `Read`.

6. **Verify the JSON web token (JWT) claims**. If the access token is available, decode it by using online tools such as [jwt.ms](https://jwt.ms). After the token is decoded, the claims can be inspected for correctness.

   :::image type="content" source="media/troubleshoot-identity-provider-configuration/json-web-token-claims.png" alt-text="Screenshot showing jwt web token claims." lightbox="media/troubleshoot-identity-provider-configuration/json-web-token-claims.png":::

7. **Verify the iss (issuer claim)**. Make sure the `iss` claim exactly matches the `issuer` value in your identity providers OpenId Configuration.
 
   Take the `authority` value from the `smartIdentityProvider` identity provider configuration, append it with **`/.well-known/openid-configuration`**, and then paste it in your browser. If the value is correct, the browser navigates to the openid-connect configuration.
 
   Example:

   ```http
   https://<YOUR_IDENTITY_PROVIDER_AUTHORITY>/authority/v2.0/.well-known/openid-configuration
   ```

8. **Verify the azp or appid (authorized party or appid claim)**. The `azp` or `appid` claim must exactly match the `clientId` value provided in the `smartIdentityProvider` identity provider configuration.

9. **Verify the aud (audience claim)**. The `aud` claim must exactly match the `audience` value provided in the `smartIdentityProvider` identity provider configuration.

10. **Verify the scp (scope claim)**. The `scp` claim is required. If it's missing, the request fails. The format of the scp claim must conform to [SMART on FHIR v1 Scopes](https://www.hl7.org/fhir/smart-app-launch/1.0.0/scopes-and-launch-context/index.html#scopes-for-requesting-clinical-data). It's important to note that the FHIR service currently only supports Read scopes. An acceptable variation of SMART on FHIR v1 Scopes replaces any forward slash (/) with a period (.) and asterisk (*) with `all`. For example, an acceptable version of the SMART on FHIR scope `patient/*.read` is `patient.all.read`.

> [!NOTE]
> Only `read` scopes are supported.

11. **Verify the fhirUser or extension_fhirUser (FHIR user claim)**. The `fhirUser` or `extension_fhirUser` claim is required. If it's missing, the request fails. This claim links the user in the identity provider with a user resource in the FHIR service. The value must be the fully qualified URL of a resource in the FHIR service that represents the individual that the access token is issued to. For example, the access token issued to a patient that logged in should have a `fhirUser` or `extension_fhirUser` claim that has the fully qualified URL of a [patient](https://build.fhir.org/patient.html) resource in the FHIR service.

## Schema for configuring identity providers

The `smartIdentityProviders` element is a JSON array that contains one or two `identity provider configurations`. An `identity provider configuration` consists of:

- An `authority` string value that must be the fully qualified URL of the identity providers token authority.

- An `applications` array that contains identity provider resource `application configurations`.

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
              "allowedDataActions": "array",
              "audience": "string"
            }
          ]
        }
      ]
    }
  }
}
```

The `applications` element is a JSON array that contains one or two `application configurations`. 

The `application configuration` consists of:

- A `clientId` string value for the client ID (also known as application ID) of the identity provider resource application.

- An `audience` string used to validate the `aud` claim in access tokens.

- An array of `allowedDataActions`. The `allowedDataActions` array can only contain the string value `Read`.

```json
{
  "authority": "string",
  "applications": [
    {
      "clientId": "string",
      "allowedDataActions": "array",
      "audience": "string"
    }
  ]
}
```

```json
{
  "clientId": "string",
  "allowedDataActions": "array",
  "audience": "string"
}
```

## Next steps

[Use Azure Active Directory B2C to grant access to the FHIR service](azure-ad-b2c-setup.md)

[Configure multiple identity providers](configure-identity-providers.md)

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
