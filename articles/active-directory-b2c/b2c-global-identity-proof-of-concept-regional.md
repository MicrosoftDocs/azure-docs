---
title: Azure Active Directory B2C global identity framework proof of concept for region-based configuration
description: Learn how to create a proof of concept regional based approach for Azure AD B2C to provide customer identity and access management for global customers.

author: gargi-sinha
manager: martinco

ms.service: active-directory

ms.topic: conceptual
ms.date: 12/15/2022
ms.author: gasinh
ms.subservice: B2C
---

# Azure Active Directory B2C global identity framework proof of concept for region-based configuration

The following section describes how to create proof of concept implementations for region-based orchestration. The completed Azure Active Directory B2C (Azure AD B2C) custom policies can be found [here](https://github.com/azure-ad-b2c/samples/tree/master/policies/global-architecture-model/region-based-approach).

## Region-based approach

Each regional Azure AD B2C tenant will require an Azure AD B2C Custom policy, which contains the following capabilities:

Sign-up journey:

* Display a screen to collect the user's username, password, and any other attributes
* Prevent sign up if the user already exists by querying the user-region mapping table
* Write the user profile to the local tenant
* Write the users username-to-region mapping into a mapping table
* Issue a token to the application

Sign-in journey:

* Display username and password screen
* Perform a lookup of the username and return its region
* Perform a local credential verification or a cross tenant credential verification
* Read the user profile from the local tenant, or via a cross tenant call
* Issue a token to the application

Password reset journey:

* Display a screen to validate the users email via email OTP
* Perform a lookup of the username and return its region
* Display a screen to capture the new password
* Write the new password to the local tenant or via a cross tenant call
* Issue a token to the application

The following block diagram shows the proof of concept. The guidance will show how to configure the Azure AD B2C tenants. The External API layer and Geo distributed lookup table isn't included as part of this guide.

![Screenshot shows the regional-based approach block diagram](media/b2c-global-identity-proof-of-concept-funnel/region-based-block-diagram.png)


### Prerequisites

1. [Create a tenant](tutorial-create-tenant.md) per region your business requires to support. You'll require at least two tenants for this proof of concept.

1. [Deploy custom policies](tutorial-create-user-flows.md) into your tenants.

### Prepare your storage layer

You'll need a storage layer, which can store the users email, objectId and region. This will allow you to track and query where the user signed up. You can use an [Azure Storage table](../storage/tables/table-storage-overview.md) to persist this data.

### Prepare your API layer

There are multiple APIs used as part of the proof of concept to demonstrate the region-based approach.

#### Verify if user already exists

An API is used during sign-up to determine whether the user exists in any region already.

The request will be as follows:

```http
POST /doesUserExistInLookupTable HTTP/1.1
Host: yourapi.com
Content-Type: application/json

{
  email: bob@contoso.com
}

```

* The response should be an HTTP 200 if the user doesn't exist.

* The response should be HTTP 409 if the user does exist.

#### Record the users region mapping

An API is used during sign-up to record which region the user has signed-up in.

The request will be as follows:

```http
POST /userToRegionLookup HTTP/1.1
Host: yourapi.com
Authorization Bearer: <token>
Content-Type: application/json

{
  "email": "bob@contoso.com"
}

```

* The response should be an HTTP 200 if the user exists.

* The response should be HTTP 409 if the user does exist.

#### Return which region the user exists in

An API is used during sign-in to determine in which region the user had signed-up. This indicates whether a cross tenant authentication is required to be performed.

The request will be as follows:

```http
POST /userToRegionLookup HTTP/1.1
Host: yourapi.com
Authorization Bearer: <token>
Content-Type: application/json

{
  "email": "bob@contoso.com"
}

```

The response should be an HTTP 200 with the users registered region and objectId.

```json
{
  "objectId": "460f9ffb-8b6b-458d-a5a4-b8f3a6816fc2",
  "region": "APAC"  
}
```

The API should respond with an HTTP 409 if the user doesn't exist, or encounters an error.


#### Write password across tenants

An API is used during the password reset flow to write the users new password in a different region that which they reset their password at.

The request will be as follows:

```http
POST /writePasswordCrossTenant HTTP/1.1
Host: yourapi.com
Authorization Bearer: <token>
Content-Type: application/json

{
  "objectId": "460f9ffb-8b6b-458d-a5a4-b8f3a6816fc2",
  "password": "some!strong123STRING"
}

```

The response should be an HTTP 200 if the process succeeds, or HTTP 409 if there's an error.

## Region-based Azure AD B2C configuration

The following sections prepare the Azure AD B2C tenant to track the region in which the user signed-up and perform cross tenant authentications or password resets if necessary.

### Sign up custom policy configuration

During sign-up, we must make sure to check the user doesn't exist in any other tenant, and write the users user-region mapping into an external table.

Modify the `LocalAccountSignUpWithLogonEmail` technical profile in the Azure AD B2C starter pack is as follows:

```xml
<TechnicalProfile Id="LocalAccountSignUpWithLogonEmail">
...
  <ValidationTechnicalProfiles>            
    <ValidationTechnicalProfile ReferenceId="REST-getTokenforExternalApiCalls" />
    <ValidationTechnicalProfile ReferenceId="REST-doesUserExistInLookupTable" />        
    <ValidationTechnicalProfile ReferenceId="AAD-UserWriteUsingLogonEmail" />
    <ValidationTechnicalProfile ReferenceId="REST-writeUserToRegionMapping" />
  </ValidationTechnicalProfiles>
  <UseTechnicalProfileForSessionManagement ReferenceId="SM-AAD" />
</TechnicalProfile>
```

The **ValidationTechnicalProfiles** will perform the following logic:

1. Get a token to call your protected API endpoints using the `REST-getTokenforExternalApiCalls` technical profile.

    * Follow the documentation [here](secure-rest-api.md?tabs=windows&pivots=b2c-custom-policy#using-oauth2-bearer) to obtain and protect your API using a Microsoft Entra bearer token.

1. Verify if the user already exists in the user-region mapping via your secured external REST API endpoint:
    * This API call is made before all sign-up's, it's critical to make sure this API has appropriate load balancing, resiliency, and failover mechanisms to uphold uptime requirements.

    * An example of a technical profile to query a user-region mapping via an external REST API is as follows:

      ```xml
      <TechnicalProfile Id="REST-doesUserExistInLookupTable ">
      <DisplayName>User to Region lookup</DisplayName>
      <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.RestfulProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
      <Metadata>
        <Item Key="ServiceUrl">https://myApi.com/doesUserExistInLookupTable</Item>
        <Item Key="AuthenticationType">Bearer</Item>
        <Item Key="UseClaimAsBearerToken">ext_Api_bearerToken</Item>
        <Item Key="SendClaimsIn">Body</Item>
        <Item Key="AllowInsecureAuthInProduction">false</Item>
      </Metadata>
      <InputClaims>
        <InputClaim ClaimTypeReferenceId="ext_Api_bearerToken" />
        <InputClaim ClaimTypeReferenceId="signInName" PartnerClaimType="email" />
      </InputClaims>
      <UseTechnicalProfileForSessionManagement ReferenceId="SM-Noop" />
      </TechnicalProfile>
      ```

     * This API should respond with HTTP 409 if the user exists, with appropriate error message to be displayed on screen. Otherwise, respond with an HTTP 200 if the user doesn't exist.

1. Write the user-region mapping via your secured external REST API endpoint

      * This API call is made before all sign up's, it's critical to make sure this API has appropriate load balancing, resiliency, and failover mechanisms to uphold uptime requirements.

      * An example of a technical profile to write the user-region mapping via an external REST API is as follows:

      ```xml
      <TechnicalProfile Id="REST-writeUserToRegionMapping">
      <DisplayName>User to Region lookup</DisplayName>
      <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.RestfulProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
      <Metadata>
        <Item Key="ServiceUrl">https://myApi.com/writeUserToRegionMapping</Item>
        <Item Key="AuthenticationType">Bearer</Item>
        <Item Key="UseClaimAsBearerToken">ext_Api_bearerToken</Item>
        <Item Key="SendClaimsIn">Body</Item>
        <Item Key="AllowInsecureAuthInProduction">false</Item>
      </Metadata>
      <InputClaims>
        <InputClaim ClaimTypeReferenceId="ext_Api_bearerToken" />
        <InputClaim ClaimTypeReferenceId="signInName" PartnerClaimType="email" />
        <InputClaim ClaimTypeReferenceId="region" DefaultValue="EMEA" />
        <InputClaim ClaimTypeReferenceId="objectId" />
      </InputClaims>
      <UseTechnicalProfileForSessionManagement ReferenceId="SM-Noop" />
      </TechnicalProfile>
      ``` 

### Sign in custom policy configuration

During sign-in, we must determine the users profile location, and authenticate them against the Azure AD B2C tenant where their profile lives.

Modify the `SelfAsserted-LocalAccountSignin-Email` technical profile in the Azure AD B2C starter pack to perform the user-region lookup, and perform cross tenant authentication when the user is from a different region to that of the tenant they've reached. Update the `ValidationTechnicalProfiles` as:

```xml
<TechnicalProfile Id="SelfAsserted-LocalAccountSignin-Email">
...
  <ValidationTechnicalProfiles>
    <ValidationTechnicalProfile ReferenceId="REST-getTokenforExternalApiCalls" />
    <ValidationTechnicalProfile ReferenceId="REST-regionLookup" />
    <ValidationTechnicalProfile ReferenceId="login-NonInteractive">
      <Preconditions>
        <Precondition Type="ClaimEquals" ExecuteActionsIf="false">
          <Value>user_region</Value>
          <Value>EMEA</Value>
          <Action>SkipThisValidationTechnicalProfile</Action>
        </Precondition>
      </Preconditions>
     <ValidationTechnicalProfile ReferenceId="REST-login-NonInteractive-APAC">
      <Preconditions>
        <Precondition Type="ClaimEquals" ExecuteActionsIf="false">
          <Value>user_region</Value>
          <Value>APAC</Value>
          <Action>SkipThisValidationTechnicalProfile</Action>
        </Precondition>
      </Preconditions>
    </ValidationTechnicalProfile>
    <ValidationTechnicalProfile ReferenceId="REST-fetchUserProfile-APAC">
      <Preconditions>
        <Precondition Type="ClaimEquals" ExecuteActionsIf="false">
          <Value>user_region</Value>
          <Value>APAC</Value>
          <Action>SkipThisValidationTechnicalProfile</Action>
        </Precondition>
      </Preconditions>
    </ValidationTechnicalProfile>
  </ValidationTechnicalProfiles>
  <UseTechnicalProfileForSessionManagement ReferenceId="SM-AAD" />
</TechnicalProfile>
```

The **ValidationTechnicalProfiles** will perform the following logic when the user submits their credentials:

1. Get a token to call your protected API endpoints using the `REST-getTokenforExternalApiCalls` technical profile.

    * Follow the documentation [here](secure-rest-api.md?tabs=windows&pivots=b2c-custom-policy#using-oauth2-bearer) to obtain and protect your API using a Microsoft Entra bearer token.

1. Look up the user-region mapping via your secured external REST API endpoint
    * This API call is made before all sign-up's, it's critical to make sure this API has appropriate load balancing, resiliency, and failover mechanisms to uphold uptime requirements.

    * An example of a technical profile to query a user-region mapping via an external REST API is as follows:

      ```xml
      <TechnicalProfile Id="REST-regionLookup">
        <DisplayName>User to Region lookup</DisplayName>
        <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.RestfulProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
        <Metadata>
          <Item Key="ServiceUrl">https://myApi.com/userToRegionLookup</Item>
          <Item Key="AuthenticationType">Bearer</Item>
          <Item Key="UseClaimAsBearerToken">ext_Api_bearerToken</Item>
          <Item Key="SendClaimsIn">Body</Item>
          <Item Key="AllowInsecureAuthInProduction">false</Item>
        </Metadata>
        <InputClaims>
          <InputClaim ClaimTypeReferenceId="ext_Api_bearerToken" />
          <InputClaim ClaimTypeReferenceId="signInName" PartnerClaimType="email" />
        </InputClaims>
        <OutputClaims>
          <OutputClaim ClaimTypeReferenceId="user_region" PartnerClaimType="region" />
          <OutputClaim ClaimTypeReferenceId="objectId" PartnerClaimType="objectId" />
        </OutputClaims>
        <UseTechnicalProfileForSessionManagement ReferenceId="SM-Noop" />
      </TechnicalProfile>
      ```
  
1. Perform local account authentication via the `login-NonInteractive` technical profile for users who signed up in this tenant. This is the default technical profile found in the Azure AD B2C starter pack.

1. Conditionally, perform a cross tenant authentication via the `REST-login-NonInteractive-[region]` technical profiles for each respective region.

    * This will also obtain an MS Graph API token from the users home tenant. Register a **Native App** Application Registration in each regional tenant with permissions to MS Graph API for the delegated permission `user.read`.

    * An example of a technical profile to perform user-region mapping via an external REST API is as follows:

        ```xml
        <TechnicalProfile Id="REST-login-NonInteractive-APAC">
          <DisplayName>non interactive authentication to APAC</DisplayName>
          <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.RestfulProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
          <Metadata>
            <Item Key="ServiceUrl">https://login.microsoftonline.com/yourAPACb2ctenant.onmicrosoft.com/oauth2/v2.0/token</Item>
            <Item Key="AuthenticationType">None</Item>
            <Item Key="SendClaimsIn">Form</Item>
            <Item Key="AllowInsecureAuthInProduction">true</Item>
          </Metadata>
          <InputClaims>
            <InputClaim ClaimTypeReferenceId="apac_client_id" PartnerClaimType="client_id" DefaultValue="cf3f6898-9a79-426a-ba16-10e1a377c843" />
            <InputClaim ClaimTypeReferenceId="ropc_grant_type" PartnerClaimType="grant_type" DefaultValue="password" />
            <InputClaim ClaimTypeReferenceId="signInName" PartnerClaimType="username" />
            <InputClaim ClaimTypeReferenceId="password" />
            <InputClaim ClaimTypeReferenceId="scope" DefaultValue="https://graph.microsoft.com/.default" AlwaysUseDefaultValue="true" />
            <InputClaim ClaimTypeReferenceId="nca" PartnerClaimType="nca" DefaultValue="1" />
          </InputClaims>
          <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="ext_Api_bearerToken" PartnerClaimType="access_token" />
          </OutputClaims>
          <UseTechnicalProfileForSessionManagement ReferenceId="SM-Noop" />
        </TechnicalProfile>
        ```

    * Replace `<yourb2ctenant>` in the `ServiceUrl` with the tenant you need to target for authentication.
    
    * Use the application registration `ApplicationId` to populate the `DefaultValue` for the `apac_client_id` input claim.

1. Conditionally, fetch the user profile using a cross tenant REST API call via the `REST-fetchUserProfile-[region]` technical profiles for each respective region.

    * An example technical profile to read the user's profile via MS Graph API is as follows:

        ```xml
        <TechnicalProfile Id="REST-fetchUserProfile-APAC">
          <DisplayName>fetch user profile cross tenant</DisplayName>
          <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.RestfulProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
          <Metadata>
            <Item Key="ServiceUrl">https://graph.microsoft.com/beta/me</Item>
            <Item Key="AuthenticationType">Bearer</Item>
            <Item Key="UseClaimAsBearerToken">graph_bearerToken</Item>
            <Item Key="SendClaimsIn">Body</Item>
          </Metadata>
          <InputClaims>
            <InputClaim ClaimTypeReferenceId="graph_bearerToken" />
          </InputClaims>
          <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="objectId" PartnerClaimType="id" />
            <OutputClaim ClaimTypeReferenceId="givenName" />
            <OutputClaim ClaimTypeReferenceId="surName" />
            <OutputClaim ClaimTypeReferenceId="displayName" />
            <OutputClaim ClaimTypeReferenceId="userPrincipalName" PartnerClaimType="upn" />
            <OutputClaim ClaimTypeReferenceId="authenticationSource" DefaultValue="localAccountAuthentication" />
          </OutputClaims>
          <UseTechnicalProfileForSessionManagement ReferenceId="SM-Noop" />
        </TechnicalProfile>
        ```

### Password reset custom policy configuration

During password reset, we must determine the users profile location, and update the password against the Azure AD B2C tenant where the user profile lives.

Modify the `LocalAccountSignUpWithLogonEmail` technical profile in the Azure AD B2C starter pack to perform the user user-region lookup, and update the password in the respective tenant. Update the `ValidationTechnicalProfiles` as:

```xml
<TechnicalProfile Id="LocalAccountDiscoveryUsingEmailAddress">
  <OutputClaims>
  ...
  <OutputClaim ClaimTypeReferenceId="ext_Api_bearerToken" DefaultValue="EMEA"/>
  </OutputClaims>
  <ValidationTechnicalProfiles>
    <ValidationTechnicalProfile ReferenceId="REST-getTokenforExternalApiCalls">
      <Preconditions>
        <Precondition Type="ClaimEquals" ExecuteActionsIf="true">
          <Value>user_region</Value>
          <Value>EMEA</Value>
          <Action>SkipThisValidationTechnicalProfile</Action>
        </Precondition>
      </Preconditions>
    </ValidationTechnicalProfile>
    <ValidationTechnicalProfile ReferenceId="REST-regionLookup" />
    <ValidationTechnicalProfile ReferenceId="AAD-UserReadUsingEmailAddress" />
  </ValidationTechnicalProfiles>
</TechnicalProfile>
```

The **ValidationTechnicalProfiles** will perform the following logic when the user submits a verified email to update their password:

1. Get a token to call your protected API endpoints

1. Look up the user-region mapping via your secured external REST API endpoint
    * This API call is made before all password reset attempts, it's critical to make sure this API has appropriate load balancing, resiliency, and failover mechanisms to uphold uptime requirements.

Modify the `LocalAccountWritePasswordUsingObjectId` technical profile to write the new password to the local tenant or conditionally to the cross regional tenant.

```xml
<TechnicalProfile Id="LocalAccountWritePasswordUsingObjectId">
  ...
  <ValidationTechnicalProfiles>
    <ValidationTechnicalProfile ReferenceId="AAD-UserWritePasswordUsingObjectId">
        <Preconditions>
          <Precondition Type="ClaimEquals" ExecuteActionsIf="false">
            <Value>user_region</Value>
            <Value>EMEA</Value>
            <Action>SkipThisValidationTechnicalProfile</Action>
          </Precondition>
        </Preconditions>
      </ValidationTechnicalProfile>
    <ValidationTechnicalProfile ReferenceId="REST-UserWritePasswordUsingObjectId-APAC">
        <Preconditions>
          <Precondition Type="ClaimEquals" ExecuteActionsIf="false">
            <Value>user_region</Value>
            <Value>APAC</Value>
            <Action>SkipThisValidationTechnicalProfile</Action>
          </Precondition>
        </Preconditions>
      </ValidationTechnicalProfile>
  </ValidationTechnicalProfiles>
</TechnicalProfile>
```

The **ValidationTechnicalProfiles** will perform the following logic when the user submits a new password:

1. Write the users new password to the directory if the user existed in the EMEA tenant (this tenant).

1. Conditionally, write the new password to the user profile in the region where the user profile lives, using a REST API call.

    ```xml
    <TechnicalProfile Id="REST-UserWritePasswordUsingObjectId-APAC">
      <DisplayName>Write password to APAC tenant</DisplayName>
      <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.RestfulProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
      <Metadata>
        <Item Key="ServiceUrl">https://myApi.com/writePasswordCrossTenant</Item>
        <Item Key="AuthenticationType">Bearer</Item>
        <Item Key="UseClaimAsBearerToken">ext_Api_bearerToken</Item>
        <Item Key="SendClaimsIn">Body</Item>
        <Item Key="DebugMode">true</Item>
      </Metadata>
      <InputClaims>
        <InputClaim ClaimTypeReferenceId="ext_Api_bearerToken" />
        <InputClaim ClaimTypeReferenceId="objectId" />
        <InputClaim ClaimTypeReferenceId="newPassword" />
      </InputClaims>
      <UseTechnicalProfileForSessionManagement ReferenceId="SM-Noop" />
    </TechnicalProfile>
    ```

## Next steps

- [Azure AD B2C global identity solutions](b2c-global-identity-solutions.md)

- [Build a global identity solution with funnel-based approach](b2c-global-identity-funnel-based-design.md)

- [Build a global identity solution with region-based approach](b2c-global-identity-region-based-design.md)

- [Azure AD B2C global identity proof of concept funnel-based configuration](b2c-global-identity-proof-of-concept-funnel.md)
