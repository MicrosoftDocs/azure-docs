---
title: Set up a resource owner password credentials flow
titleSuffix: Azure AD B2C
description: Learn how to set up the resource owner password credentials (ROPC) flow in Azure Active Directory B2C.

author: kengaderdus
manager: CelesteDG

ms.service: azure-active-directory

ms.topic: how-to
ms.date: 02/24/2025
ms.author: kengaderdus
ms.subservice: b2c
zone_pivot_groups: b2c-policy-type

#Customer intent: As a developer integrating Azure AD B2C into my application, I want to set up the resource owner password credentials flow, so that my application can exchange valid credentials for tokens and authenticate users.

---

# Set up a resource owner password credentials flow in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]

In Azure Active Directory B2C (Azure AD B2C), the resource owner password credentials (ROPC) flow is an OAuth standard authentication flow. In this flow, an application, also known as the relying party, exchanges valid credentials for tokens. The credentials include a user ID and password. The tokens returned are an ID token, access token, and a refresh token.

> [!WARNING]
> We recommend that you _don't_ use the ROPC flow. In most scenarios, more secure alternatives are available and recommended. This flow requires a very high degree of trust in the application and carries risks that aren't present in other flows. You should only use this flow when other more secure flows aren't viable.

## ROPC flow notes

In Azure Active Directory B2C (Azure AD B2C), the following options are supported:

- **Native Client**: User interaction during authentication happens when code runs on a user-side device. The device can be a mobile application that's running in a native operating system, such as Android and iOS.
- **Public client flow**: Only user credentials, gathered by an application, are sent in the API call. The credentials of the application aren't sent.
- **Add new claims**: The ID token contents can be changed to add new claims.

The following flows aren't supported:

- **Server-to-server**: The identity protection system needs a reliable IP address gathered from the caller (the native client) as part of the interaction. In a server-side API call, only the server’s IP address is used. If a dynamic threshold of failed authentications is exceeded, the identity protection system may identify a repeated IP address as an attacker.
- **Confidential client flow**: The application client ID is validated, but the application secret isn't validated.

When using the ROPC flow, consider the following limitations:

- ROPC doesn’t work when there's any interruption to the authentication flow that needs user interaction. For example, when a password expires or needs to be changed, [multifactor authentication](multi-factor-authentication.md) is required, or when more information needs to be collected during sign-in (for example, user consent).
- ROPC supports local accounts only. Users can’t sign in with [federated identity providers](add-identity-provider.md) like Microsoft, Google+, X, AD-FS, or Facebook.
- [Session Management](session-behavior.md), including [keep me signed-in (KMSI)](session-behavior.md#enable-keep-me-signed-in-kmsi), isn't applicable.


## Register an application

[!INCLUDE [active-directory-b2c-appreg-ropc](../../includes/active-directory-b2c-appreg-ropc.md)]

::: zone pivot="b2c-user-flow"

##  Create a resource owner user flow

1. Sign in to the [Azure portal](https://portal.azure.com) as the [External ID User Flow Administrator](/entra/identity/role-based-access-control/permissions-reference#external-id-user-flow-administrator) of your Azure AD B2C tenant.
1. If you have access to multiple tenants, select the **Settings** icon in the top menu to switch to your Azure AD B2C tenant from the **Directories + subscriptions** menu.
1. In the Azure portal, search for and select **Azure AD B2C**.
1. Select **User flows**, and select **New user flow**.
1. Select **Sign in using resource owner password credentials (ROPC)**.
1. Under **Version**, make sure **Preview** is selected, and then select **Create**.
1. Provide a name for the user flow, such as *ROPC_Auth*.
1. Under **Application claims**, select **Show more**.
1. Select the application claims that you need for your application, such as Display Name, Email Address, and Identity Provider.
1. Select **OK**, and then select **Create**.

::: zone-end

::: zone pivot="b2c-custom-policy"

## Prerequisite 
If you've not done so, learn how to use the custom policy starter pack in [Get started with custom policies in Active Directory B2C](tutorial-create-user-flows.md).

##  Create a resource owner policy

1. Open the *TrustFrameworkExtensions.xml* file.
 
1. Under the **BuildingBlocks** element, locate the **ClaimsSchema** element, then add the following claims types:  

    ```xml
    <ClaimsSchema>
      <ClaimType Id="logonIdentifier">
        <DisplayName>User name or email address that the user can use to sign in</DisplayName>
        <DataType>string</DataType>
      </ClaimType>
      <ClaimType Id="resource">
        <DisplayName>The resource parameter passes to the ROPC endpoint</DisplayName>
        <DataType>string</DataType>
      </ClaimType>
      <ClaimType Id="refreshTokenIssuedOnDateTime">
        <DisplayName>An internal parameter used to determine whether the user should be permitted to authenticate again using their existing refresh token.</DisplayName>
        <DataType>string</DataType>
      </ClaimType>
      <ClaimType Id="refreshTokensValidFromDateTime">
        <DisplayName>An internal parameter used to determine whether the user should be permitted to authenticate again using their existing refresh token.</DisplayName>
        <DataType>string</DataType>
      </ClaimType>
    </ClaimsSchema>
    ```

3. After **ClaimsSchema**, add a **ClaimsTransformations** element and its child elements to the **BuildingBlocks** element:

    ```xml
    <ClaimsTransformations>
      <ClaimsTransformation Id="CreateSubjectClaimFromObjectID" TransformationMethod="CreateStringClaim">
        <InputParameters>
          <InputParameter Id="value" DataType="string" Value="Not supported currently. Use oid claim." />
        </InputParameters>
        <OutputClaims>
          <OutputClaim ClaimTypeReferenceId="sub" TransformationClaimType="createdClaim" />
        </OutputClaims>
      </ClaimsTransformation>

      <ClaimsTransformation Id="AssertRefreshTokenIssuedLaterThanValidFromDate" TransformationMethod="AssertDateTimeIsGreaterThan">
        <InputClaims>
          <InputClaim ClaimTypeReferenceId="refreshTokenIssuedOnDateTime" TransformationClaimType="leftOperand" />
          <InputClaim ClaimTypeReferenceId="refreshTokensValidFromDateTime" TransformationClaimType="rightOperand" />
        </InputClaims>
        <InputParameters>
          <InputParameter Id="AssertIfEqualTo" DataType="boolean" Value="false" />
          <InputParameter Id="AssertIfRightOperandIsNotPresent" DataType="boolean" Value="true" />
        </InputParameters>
      </ClaimsTransformation>
    </ClaimsTransformations>
    ```

4. Locate the **ClaimsProvider** element that has a **DisplayName** of `Local Account SignIn` and add following technical profile:

    ```xml
    <TechnicalProfile Id="ResourceOwnerPasswordCredentials-OAUTH2">
      <DisplayName>Local Account SignIn</DisplayName>
      <Protocol Name="OpenIdConnect" />
      <Metadata>
        <Item Key="UserMessageIfClaimsPrincipalDoesNotExist">We can't seem to find your account</Item>
        <Item Key="UserMessageIfInvalidPassword">Your password is incorrect</Item>
        <Item Key="UserMessageIfOldPasswordUsed">Looks like you used an old password</Item>
        <Item Key="DiscoverMetadataByTokenIssuer">true</Item>
        <Item Key="ValidTokenIssuerPrefixes">https://sts.windows.net/</Item>
        <Item Key="METADATA">https://login.microsoftonline.com/{tenant}/.well-known/openid-configuration</Item>
        <Item Key="authorization_endpoint">https://login.microsoftonline.com/{tenant}/oauth2/token</Item>
        <Item Key="response_types">id_token</Item>
        <Item Key="response_mode">query</Item>
        <Item Key="scope">email openid</Item>
        <Item Key="grant_type">password</Item>
      </Metadata>
      <InputClaims>
        <InputClaim ClaimTypeReferenceId="logonIdentifier" PartnerClaimType="username" Required="true" DefaultValue="{OIDC:Username}"/>
        <InputClaim ClaimTypeReferenceId="password" Required="true" DefaultValue="{OIDC:Password}" />
        <InputClaim ClaimTypeReferenceId="grant_type" DefaultValue="password" />
        <InputClaim ClaimTypeReferenceId="scope" DefaultValue="openid" />
        <InputClaim ClaimTypeReferenceId="nca" PartnerClaimType="nca" DefaultValue="1" />
        <InputClaim ClaimTypeReferenceId="client_id" DefaultValue="ProxyIdentityExperienceFrameworkAppId" />
        <InputClaim ClaimTypeReferenceId="resource_id" PartnerClaimType="resource" DefaultValue="IdentityExperienceFrameworkAppId" />
      </InputClaims>
      <OutputClaims>
        <OutputClaim ClaimTypeReferenceId="objectId" PartnerClaimType="oid" />
        <OutputClaim ClaimTypeReferenceId="userPrincipalName" PartnerClaimType="upn" />
      </OutputClaims>
      <OutputClaimsTransformations>
        <OutputClaimsTransformation ReferenceId="CreateSubjectClaimFromObjectID" />
      </OutputClaimsTransformations>
      <UseTechnicalProfileForSessionManagement ReferenceId="SM-Noop" />
    </TechnicalProfile>
    ```

    Replace the **DefaultValue** of **client_id** with the Application ID of the ProxyIdentityExperienceFramework application that you created in the prerequisite tutorial. Then replace **DefaultValue** of **resource_id** with the Application ID  of the IdentityExperienceFramework application that you also created in the prerequisite tutorial.

5. Add following **ClaimsProvider** elements with their technical profiles to the **ClaimsProviders** element:

    ```xml
    <ClaimsProvider>
      <DisplayName>Azure Active Directory</DisplayName>
      <TechnicalProfiles>
        <TechnicalProfile Id="AAD-UserReadUsingObjectId-CheckRefreshTokenDate">
          <Metadata>
            <Item Key="Operation">Read</Item>
            <Item Key="RaiseErrorIfClaimsPrincipalDoesNotExist">true</Item>
          </Metadata>
          <InputClaims>
            <InputClaim ClaimTypeReferenceId="objectId" Required="true" />
          </InputClaims>
          <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="objectId" />
            <OutputClaim ClaimTypeReferenceId="refreshTokensValidFromDateTime" />
          </OutputClaims>
          <OutputClaimsTransformations>
            <OutputClaimsTransformation ReferenceId="AssertRefreshTokenIssuedLaterThanValidFromDate" />
            <OutputClaimsTransformation ReferenceId="CreateSubjectClaimFromObjectID" />
          </OutputClaimsTransformations>
          <IncludeTechnicalProfile ReferenceId="AAD-Common" />
        </TechnicalProfile>
      </TechnicalProfiles>
    </ClaimsProvider>

    <ClaimsProvider>
      <DisplayName>Session Management</DisplayName>
      <TechnicalProfiles>
        <TechnicalProfile Id="SM-RefreshTokenReadAndSetup">
          <DisplayName>Trustframework Policy Engine Refresh Token Setup Technical Profile</DisplayName>
          <Protocol Name="None" />
          <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="objectId" />
            <OutputClaim ClaimTypeReferenceId="refreshTokenIssuedOnDateTime" />
          </OutputClaims>
        </TechnicalProfile>
      </TechnicalProfiles>
    </ClaimsProvider>

    <ClaimsProvider>
      <DisplayName>Token Issuer</DisplayName>
      <TechnicalProfiles>
        <TechnicalProfile Id="JwtIssuer">
          <Metadata>
            <!-- Point to the redeem refresh token user journey-->
            <Item Key="RefreshTokenUserJourneyId">ResourceOwnerPasswordCredentials-RedeemRefreshToken</Item>
          </Metadata>
        </TechnicalProfile>
      </TechnicalProfiles>
    </ClaimsProvider>
    ```

6. Add a **UserJourneys** element and its child elements to the **TrustFrameworkPolicy** element:

    ```xml
    <UserJourney Id="ResourceOwnerPasswordCredentials">
      <PreserveOriginalAssertion>false</PreserveOriginalAssertion>
      <OrchestrationSteps>
        <OrchestrationStep Order="1" Type="ClaimsExchange">
          <ClaimsExchanges>
            <ClaimsExchange Id="ResourceOwnerFlow" TechnicalProfileReferenceId="ResourceOwnerPasswordCredentials-OAUTH2" />
          </ClaimsExchanges>
        </OrchestrationStep>
        <OrchestrationStep Order="2" Type="ClaimsExchange">
          <ClaimsExchanges>
            <ClaimsExchange Id="AADUserReadWithObjectId" TechnicalProfileReferenceId="AAD-UserReadUsingObjectId" />
          </ClaimsExchanges>
        </OrchestrationStep>
        <OrchestrationStep Order="3" Type="SendClaims" CpimIssuerTechnicalProfileReferenceId="JwtIssuer" />
      </OrchestrationSteps>
    </UserJourney>
    <UserJourney Id="ResourceOwnerPasswordCredentials-RedeemRefreshToken">
      <PreserveOriginalAssertion>false</PreserveOriginalAssertion>
      <OrchestrationSteps>
        <OrchestrationStep Order="1" Type="ClaimsExchange">
          <ClaimsExchanges>
            <ClaimsExchange Id="RefreshTokenSetupExchange" TechnicalProfileReferenceId="SM-RefreshTokenReadAndSetup" />
          </ClaimsExchanges>
        </OrchestrationStep>
        <OrchestrationStep Order="2" Type="ClaimsExchange">
          <ClaimsExchanges>
            <ClaimsExchange Id="CheckRefreshTokenDateFromAadExchange" TechnicalProfileReferenceId="AAD-UserReadUsingObjectId-CheckRefreshTokenDate" />
          </ClaimsExchanges>
        </OrchestrationStep>
        <OrchestrationStep Order="3" Type="SendClaims" CpimIssuerTechnicalProfileReferenceId="JwtIssuer" />
      </OrchestrationSteps>
    </UserJourney>
    ```

7. On the **Custom Policies** page in your Azure AD B2C tenant, select **Upload Policy**.
8. Enable **Overwrite the policy if it exists**, and then browse to and select the *TrustFrameworkExtensions.xml* file.
9. Select **Upload**.

## Create a relying party file

Next, update the relying party file that initiates the user journey that you created:

1. Make a copy of *SignUpOrSignin.xml* file in your working directory and rename it to *ROPC_Auth.xml*.
2. Open the new file and change the value of the **PolicyId** attribute for **TrustFrameworkPolicy** to a unique value. The policy ID is the name of your policy. For example, **B2C_1A_ROPC_Auth**.
3. Change the value of the **ReferenceId** attribute in **DefaultUserJourney** to `ResourceOwnerPasswordCredentials`.
4. Change the **OutputClaims** element to only contain the following claims:

    ```xml
    <OutputClaim ClaimTypeReferenceId="sub" />
    <OutputClaim ClaimTypeReferenceId="objectId" />
    <OutputClaim ClaimTypeReferenceId="displayName" DefaultValue="" />
    <OutputClaim ClaimTypeReferenceId="givenName" DefaultValue="" />
    <OutputClaim ClaimTypeReferenceId="surname" DefaultValue="" />
    ```

5. On the **Custom Policies** page in your Azure AD B2C tenant, select **Upload Policy**.
6. Enable **Overwrite the policy if it exists**, and then browse to and select the *ROPC_Auth.xml* file.
7. Select **Upload**.


::: zone-end

## Test the ROPC flow

Use your favorite API development application to generate an API call, and review the response to debug your policy. Construct a call like this example with the following information as the body of the POST request:

`https://<tenant-name>.b2clogin.com/<tenant-name>.onmicrosoft.com/B2C_1A_ROPC_Auth/oauth2/v2.0/token`

- Replace `<tenant-name>` with the name of your Azure AD B2C tenant.
- Replace `B2C_1A_ROPC_Auth` with the full name of your resource owner password credentials policy.

| Key | Value |
| --- | ----- |
| username | `user-account` |
| password | `password1` |
| grant_type | password |
| scope | openid `application-id` offline_access |
| client_id | `application-id` |
| response_type | token id_token |

- Replace `user-account` with the name of a user account in your tenant.
- Replace `password1` with the password of the user account.
- Replace `application-id` with the Application ID from the *ROPC_Auth_app* registration.
- *Offline_access* is optional if you want to receive a refresh token.

The actual POST request looks like the following example:

```https
POST /<tenant-name>.onmicrosoft.com/B2C_1A_ROPC_Auth/oauth2/v2.0/token HTTP/1.1
Host: <tenant-name>.b2clogin.com
Content-Type: application/x-www-form-urlencoded

username=contosouser.outlook.com.ws&password=Passxword1&grant_type=password&scope=openid+00001111-aaaa-2222-bbbb-3333cccc4444+offline_access&client_id=00001111-aaaa-2222-bbbb-3333cccc4444&response_type=token+id_token
```

A successful response with offline-access looks like the following example:

```json
{
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik9YQjNhdTNScWhUQWN6R0RWZDM5djNpTmlyTWhqN2wxMjIySnh6TmgwRlki...",
    "token_type": "Bearer",
    "expires_in": "3600",
    "refresh_token": "eyJraWQiOiJacW9pQlp2TW5pYVc2MUY0TnlfR3REVk1EVFBLbUJLb0FUcWQ1ZWFja1hBIiwidmVyIjoiMS4wIiwiemlwIjoiRGVmbGF0ZSIsInNlciI6Ij...",
    "id_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik9YQjNhdTNScWhUQWN6R0RWZDM5djNpTmlyTWhqN2wxMjIySnh6TmgwRlki..."
}
```

## Redeem a refresh token

Construct a POST call like the one shown here. Use the information in the following table as the body of the request:

`https://<tenant-name>.b2clogin.com/<tenant-name>.onmicrosoft.com/B2C_1A_ROPC_Auth/oauth2/v2.0/token`

- Replace `<tenant-name>` with the name of your Azure AD B2C tenant.
- Replace `B2C_1A_ROPC_Auth` with the full name of your resource owner password credentials policy.

| Key | Value |
| --- | ----- |
| grant_type | refresh_token |
| response_type | id_token |
| client_id | `application-id` |
| resource | `application-id` |
| refresh_token | `refresh-token` |

- Replace `application-id` with the Application ID from the *ROPC_Auth_app* registration.
- Replace `refresh-token` with the **refresh_token** that was sent back in the previous response.

A successful response looks like the following example:

```json
{
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ilg1ZVhrNHh5b2pORnVtMWtsMll0djhkbE5QNC1jNTdkTzZRR1RWQndhT...",
    "id_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ilg1ZVhrNHh5b2pORnVtMWtsMll0djhkbE5QNC1jNTdkTzZRR1RWQn...",
    "token_type": "Bearer",
    "not_before": 1533672990,
    "expires_in": 3600,
    "expires_on": 1533676590,
    "resource": "bef2222d56-552f-4a5b-b90a-1988a7d634c3",
    "id_token_expires_in": 3600,
    "profile_info": "eyJ2ZXIiOiIxLjAiLCJ0aWQiOiI1MTZmYzA2NS1mZjM2LTRiOTMtYWE1YS1kNmVlZGE3Y2JhYzgiLCJzdWIiOm51bGwsIm5hbWUiOiJEYXZpZE11IiwicHJlZmVycmVkX3VzZXJuYW1lIjpudWxsLCJpZHAiOiJMb2NhbEFjY291bnQifQ",
    "refresh_token": "eyJraWQiOiJjcGltY29yZV8wOTI1MjAxNSIsInZlciI6IjEuMCIsInppcCI6IkRlZmxhdGUiLCJzZXIiOiIxLjAi...",
    "refresh_token_expires_in": 1209600
}
```

## Troubleshooting

### The provided application isn't configured to allow the 'OAuth' Implicit flow

* **Symptom** - You run the ROPC flow, and get the following message: *AADB2C90057: The provided application isn't configured to allow the 'OAuth' Implicit flow*.
* **Possible causes** - The implicit flow isn't allowed for your application.
* **Resolution**: When creating your [app registration](#register-an-application) in Azure AD B2C, you need to manually edit the application manifest and set the value of the `oauth2AllowImplicitFlow` property to `true`. After you configure the `oauth2AllowImplicitFlow` property, it can take a few minutes (typically no more than five) for the change to take effect. 

## Use a native SDK or App-Auth

Azure AD B2C meets OAuth 2.0 standards for public client resource owner password credentials and should be compatible with most client SDKs. For the latest information, see [Native App SDK for OAuth 2.0 and OpenID Connect implementing modern best practices](https://appauth.io/).
