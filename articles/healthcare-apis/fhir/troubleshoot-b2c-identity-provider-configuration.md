---
title: Troubleshoot identity provider configuration for the FHIR service in Azure Health Data Services
description: Learn how to troubleshoot identity provider configuration for Azure Health Data Services FHIR service, including Azure AD B2C. Use API version 2023-12-01 to configure two additional identity providers for scoped access, with a JSON schema and examples.
ms.subservice: fhir
ms.topic: article
ms.date: 01/15/2024
ms.author: namalu
---

# Troubleshoot B2C identity provider configuration for the FHIR service

API version 2023-12-01 of the FHIR service in Azure Health Data Services supports two identity providers in addition to [Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/identity/). To provide scoped access to users, you configure the two identity providers by populating the `smartIdentityProviders` section of the `authenticationConfiguration` object.

## Schema for configuring identity providers

The `smartIdentityProviders` element is a JSON array that contains one or two `identity provider configurations`. The `identity provider configuration` consists of:

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

- An `audience` string which is used to validate the `aud` claim in access tokens.

- An array of `allowedDataActions`. The `allowedDataActions` array can only contain the string values **`Read`**, **`Write`**, **`Delete`**, or **`Export`**.

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

## Error Messages

Here are the error messages that occur if the FHIR service SMART identity providers fail, and recommended actions to take to resolve the issue.

* [The maximum number of SMART identity providers is 2](#the-maximum-number-of-smart-identity-providers-is-2).
* [One or more SMART identity provider authority values are null, empty or invalid](#one-or-more-smart-identity-provider-authority-values-are-null-empty-or-invalid).
* [All SMART identity provider authorities must be unique](#all-smart-identity-provider-authorities-must-be-unique).
* [The maximum number of SMART identity provider applications is 2](#the-maximum-number-of-smart-identity-provider-applications-is-2).
* [One or more SMART applications are null](#one-or-more-smart-applications-are-null).
* [One or more SMART application 'allowedDataActions' contain duplicate elements](#one-or-more-smart-application-alloweddataactions-contain-duplicate-elements).
* [One or more SMART application 'allowedDataActions' values are invalid](#one-or-more-smart-application-alloweddataactions-values-are-invalid).
* [One or more SMART application 'allowedDataActions' values are null, empty or invalid](#one-or-more-smart-application-alloweddataactions-values-are-null-empty-or-invalid).
* [One or more SMART application 'audience' values are null, empty or invalid](#one-or-more-smart-application-audience-values-are-null-empty-or-invalid).
* [All SMART identity provider application client ids must be unique](#all-smart-identity-provider-application-client-ids-must-be-unique).
* [One or more SMART application client id values are null, empty or invalid](#one-or-more-smart-application-client-id-values-are-null-empty-or-invalid).

---

#### The maximum number of SMART identity providers is 2

**Cause** - The number of identity providers configured is more than 2.

**Fix** - Reduce the number of identity providers to 2 or less.

The `smartIdentityProviders` element is an array that is validated when a provisioning request is submitted. If the array contains more than 2 identity provider configurations, the provisioning request will be rejected with this error message.

---

#### One or more SMART identity provider authority values are null, empty or invalid

**Cause** - The `authority` element of the identity provider configuration must be a fully qualified URL.  

**Fix** - Ensure all `authority` values are fully qualified URLs.

---

#### All SMART identity provider authorities must be unique

**Cause** - The `authority` elements of the 2 identity provider configurations are identical.

**Fix** - Ensure all `authority` values are unique, fully qualified URLs.

The `authority` values must not be identical. If the 2 identity providers configured have the same `authority` value, the provisioning request will be rejected with this error message.

---

#### The maximum number of SMART identity provider applications is 2

**Cause** - The number of identity provider applications in  an identity provider configuration is more than 2.

**Fix** - Reduce the number of identity provider applications to 1 or 2 per identity provider.

The `applications` element for each identity provider configuration is an array that is validated when a provisioning request is submitted. If the `applications` array in one or more identity provider configurations is more than 2 the provisioning request will be rejected with this error message.

---

#### One or more SMART applications are null

**Cause** - The `applications` element for one or more identity providers is null or contains no applications.

**Fix** - Ensure all identity provider configurations have at least one application configured.

The `applications` element for each identity provider configuration is required to contain at least one application configuration. If `applications` is null or empty, the provisioning request will be rejected with this error message.

---

#### One or more SMART application 'allowedDataActions' contain duplicate elements

**Cause** - The `allowedDataActions` array in one or more application configurations contains duplicate values.

**Fix** - Remove any duplicate values in the `allowedDataActions` arrays.

The `allowedDataActions` element is an array of string values and can only contain one of each of the four possible values **`Read`**, **`Write`**, **`Delete`**, or **`Export`**. If the array contains duplicate values, the provisioning request is rejected.

---

#### One or more SMART application 'allowedDataActions' values are invalid
**Cause** - The `allowedDataActions` array in one or more application configurations contains a value that is not **`Read`**, **`Write`**, **`Delete`**, or **`Export`**.

**Fix** - Remove any non conforming values from the `allowedDataActions` arrays.

The `allowedDataActions` element is an array of string values and can only contain one of each of the four possible values **"Read"**, **"Write"**, **"Delete"**, and **"Export"**. If the array contains values that are not one of the four (case sensitive), the provisioning request will be rejected with this error message.

---

#### One or more SMART application 'allowedDataActions' values are null, empty or invalid

**Cause** - The `allowedDataActions` array in one or more application configurations is null, empty or malformed.

**Fix** - Ensure the `allowedDataActions` element is an array of string values that contains only one of each of the four possible values **"Read"**, **"Write"**, **"Delete"**, and **"Export"**.

The `allowedDataActions` element is an array of string values and can only contain one of each of the four possible values **"Read"**, **"Write"**, **"Delete"**, and **"Export"**. If the array contains values that are not one of the four (case sensitive), the provisioning request will be rejected with this error message.

---

#### One or more SMART application 'audience' values are null, empty or invalid

**Cause** - The `audience` string in one or more application configurations is null, empty or malformed.

**Fix** - Ensure the `audience` string is not null or empty and that the value is a string type.

The `audience` element is a string value that must not be null or empty. If the value is null, empty or not of type string, the provisioning request will be rejected with this error message.

---

#### All SMART identity provider application client ids must be unique

**Cause** - The `clientId` value in one or more application configurations is the same value as another `clientId` value.

**Fix** - Ensure all `clientId` values are unique (including across identity provider configurations).

All `clientId` values must be unique across all other `clientId` values in the `smartIdentityProviders` array.

---

#### One or more SMART application client id values are null, empty or invalid

**Cause** - The `clientId` string in one or more application configurations is null, empty or malformed.

**Fix** - Ensure the `clientId` string is not null or empty and that the value is a string type.

The `clientId` element is a string value that must not be null or empty, and must be unique across all `clientId`` values. If the value is null, empty or not of type string, the provisioning request will be rejected with this error message.

---

## FHIR API request errors

There are two common error codes that might be encountered when making requests to the FHIR service using a token issued by a SMART identity provider `401 Unauthorized` or `403 Forbidden`. If the FHIR service was recently provisioned, it's a good idea to ensure that the `smartIdentityProviders` element is configured correctly as a good first step. Below is a checklist that can be used to ensure the `smartIdentityProviders` element is configured correctly.

- **Verify the `smartIdentityProviders` element is configured correctly**. 

- **Verify the `authority` string is correct**. Ensure the `authority` string is the token authority for the identity provider that issued the access token.

- **Verify the the `authority` string is a valid token authority**. Make a request for the openid-connect configuration. Append **/.well-known/openid-configuration** to the end of the `aubrowser navigatesthority` string and paste it in your browser. If the value is correct, the browser navigates to the openid-connect configuration. If it doesn't, there's a problem with the string.

   Example:

   ```http
   https://yourIdentityProvider.com/authority/v2.0/.well-known/openid-configuration

   ```

---

- **Verify the `clientId` string is correct**. Ensure the `clientId` string matches the client id (or application id) of the resource application defined in the identity provider.

---

- **Verify the `allowedDataActions` are configured correctly for the request**. Ensure the request type (for example, `GET`, `POST`, or `DELETE`) is permitted based on the `allowedDataActions` values.

   For example, if the `allowedDataActions` array contains only **`READ`**, a request that attempts to `DELETE` the resource fails with `403 Forbidden`.

---

- **Verify the JSON web token (JWT) claims**. If the access token is available, it can be decoded using online tools such as [jwt.ms](https://jwt.ms). After the token is decoded the claims can be inspected for correctness.

   :::image type="content" source="media/troubleshoot-b2c-identity-provider-configuration/json-web-token-claims.png" alt-text="Screenshot showing jwt web token claims" lightbox="media/troubleshoot-b2c-identity-provider-configuration/json-web-token-claims.png":::

---

- **Verify the iss (issuer claim)**. Make sure the `iss` claim exactly matches the `issuer` value in your identity providers OpenId Configuration.
 
   Take the `authority` value from the `smartIdentityProvider` identity provider configuration, append it with **`/.well-known/openid-configuration`**, and then paste it in your browser. If the value is correct, the browser navigates to the openid-connect configuration.
 
   Example:

   ```http
   https://yourIdentityProvider.com/authority/v2.0/.well-known/openid-configuration
   ```

---

- **Verify the azp or appId (authorized party or appId claim)**. The `azp` or `appId` claim must exactly match the `clientId` value provided in the `smartIdentityProvider` identity provider configuration.

---

- **Verify the aud (audience claim)**. The `aud` claim must exactly match the `audience` value provided in the `smartIdentityProvider` identity provider configuration.

---

- **Verify the scp (scope claim)**. The `scp` claim is required. If it's missing, the request fails. The format of the scp claim must conform to [SMART on FHIR v1 Scopes](https://www.hl7.org/fhir/smart-app-launch/1.0.0/scopes-and-launch-context/index.html#scopes-for-requesting-clinical-data). An acceptable variation of SMART on FHIR v1 Scopes replaces any forward slash (/) with a period (.) and asterisk (*) with `all`. For example, an acceptable version of the SMART on FHIR scope `patient/*.*` is `patient.all.all`.

---

- **Verify the fhirUser or extension_fhirUser (FHIR user claim)**. The `fhirUser` or `extension_fhirUser` claim is required. If it's missing, the request fails. This claim links the user in the identity provider with a user resource in the FHIR service. The value must be the fully qualified URL of a resource in the FHIR service that represents the individual the access token is issued to. For example, the access token issued to a patient that logged in should have a `fhirUser` or `extension_fhirUser` claim that has the fully qualified URL of a [patient](https://build.fhir.org/patient.html) resource in the FHIR service.

