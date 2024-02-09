---
title: UserInfo endpoint  
description: Define a UserInfo endpoint in a custom policy in Azure Active Directory B2C.

author: kengaderdus
manager: CelesteDG

ms.service: active-directory

ms.topic: reference
ms.date: 09/20/2021
ms.custom: 
ms.author: kengaderdus
ms.subservice: B2C
zone_pivot_groups: b2c-policy-type
---

# UserInfo endpoint

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]

The UserInfo endpoint is part of the [OpenID Connect standard](https://openid.net/specs/openid-connect-core-1_0.html#UserInfo) (OIDC) specification and is designed to return claims about the authenticated user. The UserInfo endpoint is defined in the relying party policy using the [EndPoint](relyingparty.md#endpoints) element.  

::: zone pivot="b2c-user-flow"

[!INCLUDE [active-directory-b2c-limited-to-custom-policy](../../includes/active-directory-b2c-limited-to-custom-policy.md)]

::: zone-end

::: zone pivot="b2c-custom-policy"

## Prerequisites

[!INCLUDE [active-directory-b2c-customization-prerequisites-custom-policy](../../includes/active-directory-b2c-customization-prerequisites-custom-policy.md)]

## UserInfo endpoint overview

The user info UserJourney specifies:

- **Authorization**: The UserInfo endpoint is protected with a bearer token. An issued access token is presented in the authorization header to the UserInfo endpoint. The policy specifies the technical profile that validates the incoming token and extracts claims, such as the objectId of the user. The objectId of the user is used to retrieve the claims to be returned in the response of the UserInfo endpoint journey. 
- **Orchestration step**: 
  - An orchestration step is used to gather information about the user. Based on the claims within the incoming access token, the user journey invokes a [Microsoft Entra ID technical profile](active-directory-technical-profile.md) to retrieve data about the user, for example, reading the user by the objectId. 
  - **Optional orchestration steps** - You can add more orchestration steps, such as a REST API technical profile to retrieve more information about the user. 
  - **UserInfo Issuer** - Specifies the list of claims that the UserInfo endpoint returns.

## Create a UserInfo endpoint

### 1. Add the Token Issuer technical profile

1. Open the *TrustFrameworkExtensions.xml* file.
1. If it doesn't exist already, add a ClaimsProvider element and its child elements as the first element under the BuildingBlocks element.
1. Add the following claims provider:

    ```xml
    <!-- 
    <ClaimsProviders> -->
      <ClaimsProvider>
        <DisplayName>Token Issuer</DisplayName>
        <TechnicalProfiles>
          <TechnicalProfile Id="UserInfoIssuer">
            <DisplayName>JSON Issuer</DisplayName>
            <Protocol Name="None" />
            <OutputTokenFormat>JSON</OutputTokenFormat>
            <CryptographicKeys>
              <Key Id="issuer_secret" StorageReferenceId="B2C_1A_TokenSigningKeyContainer" />
            </CryptographicKeys>
            <!-- The Below claims are what will be returned on the UserInfo Endpoint if in the Claims Bag-->
            <InputClaims>
              <InputClaim ClaimTypeReferenceId="objectId"/>
              <InputClaim ClaimTypeReferenceId="givenName"/>
              <InputClaim ClaimTypeReferenceId="surname"/>
              <InputClaim ClaimTypeReferenceId="displayName"/>
              <InputClaim ClaimTypeReferenceId="signInNames.emailAddress"/>
            </InputClaims>
          </TechnicalProfile>
          <TechnicalProfile Id="UserInfoAuthorization">
            <DisplayName>UserInfo authorization</DisplayName>
            <Protocol Name="None" />
            <InputTokenFormat>JWT</InputTokenFormat>
            <Metadata>
              <!-- Update the Issuer and Audience below -->
              <!-- Audience is optional, Issuer is required-->
              <Item Key="issuer">https://yourtenant.b2clogin.com/11111111-1111-1111-1111-111111111111/v2.0/</Item>
              <Item Key="audience">[ "22222222-2222-2222-2222-222222222222", "33333333-3333-3333-3333-333333333333" ]</Item>
              <Item Key="client_assertion_type">urn:ietf:params:oauth:client-assertion-type:jwt-bearer</Item>
            </Metadata>
            <CryptographicKeys>
              <Key Id="issuer_secret" StorageReferenceId="B2C_1A_TokenSigningKeyContainer" />
            </CryptographicKeys>
            <OutputClaims>
              <OutputClaim ClaimTypeReferenceId="objectId" PartnerClaimType="sub"/>
              <OutputClaim ClaimTypeReferenceId="signInNames.emailAddress" PartnerClaimType="email"/>
              <!-- Optional claims to read from the access token. -->
              <!-- <OutputClaim ClaimTypeReferenceId="givenName" PartnerClaimType="given_name"/>
                 <OutputClaim ClaimTypeReferenceId="surname" PartnerClaimType="family_name"/>
                 <OutputClaim ClaimTypeReferenceId="displayName" PartnerClaimType="name"/> -->
            </OutputClaims>
          </TechnicalProfile>
        </TechnicalProfiles>
      </ClaimsProvider>
    <!-- 
    </ClaimsProviders> -->
    ``` 

1. The InputClaims section within the **UserInfoIssuer** technical profile specifies the attributes you want to return. The UserInfoIssuer technical profile is called at the end of the user journey. 
1. The **UserInfoAuthorization** technical profile validates the signature, issuer name, and token audience, and extracts the claim from the inbound token. Change following metadata to reflect your environment:
    1. **issuer** - This value must be identical to the `iss` claim within the access token claim. Tokens issued by Azure AD B2C use an issuer in the format `https://yourtenant.b2clogin.com/your-tenant-id/v2.0/`. Learn more about [token customization](configure-tokens.md).
    1. **IdTokenAudience** - Must be identical to the `aud` claim within the access token claim. In Azure AD B2C the `aud` claim is the ID of your relying party application. This value is a collection and supports multiple values using a comma delimiter.

        In the following access token, the `iss` claim value is `https://contoso.b2clogin.com/11111111-1111-1111-1111-111111111111/v2.0/`. The `aud` claim value is `22222222-2222-2222-2222-222222222222`.

        ```json
        {
          "exp": 1605549468,
          "nbf": 1605545868,
          "ver": "1.0",
          "iss": "https://contoso.b2clogin.com/11111111-1111-1111-1111-111111111111/v2.0/",
          "sub": "44444444-4444-4444-4444-444444444444",
          "aud": "22222222-2222-2222-2222-222222222222",
          "acr": "b2c_1a_signup_signin",
          "nonce": "defaultNonce",
          "iat": 1605545868,
          "auth_time": 1605545868,
          "name": "John Smith",
          "given_name": "John",
          "family_name": "Smith",
          "tid": "11111111-1111-1111-1111-111111111111"
        }
        ```
    
1.  The OutputClaims element of the **UserInfoAuthorization** technical profile specifies the attributes you want to read from the access token. The **ClaimTypeReferenceId** is the reference to a claim type. The optional **PartnerClaimType** is the name of the claim defined in the access token.



### 2. Add the UserJourney element 

The [UserJourney](userjourneys.md) element defines the path that the user takes when interacting with your application. Add the **UserJourneys** element if it doesn't exist with the **UserJourney** identified as `UserInfoJourney`:

```xml
<!-- 
<UserJourneys> -->
  <UserJourney Id="UserInfoJourney" DefaultCpimIssuerTechnicalProfileReferenceId="UserInfoIssuer">
    <Authorization>
      <AuthorizationTechnicalProfiles>
        <AuthorizationTechnicalProfile ReferenceId="UserInfoAuthorization" />
      </AuthorizationTechnicalProfiles>
    </Authorization>
    <OrchestrationSteps >
      <OrchestrationStep Order="1" Type="ClaimsExchange">
        <Preconditions>
          <Precondition Type="ClaimsExist" ExecuteActionsIf="false">
            <Value>objectId</Value>
            <Action>SkipThisOrchestrationStep</Action>
          </Precondition>
        </Preconditions>
        <ClaimsExchanges UserIdentity="false">
          <ClaimsExchange Id="AADUserReadWithObjectId" TechnicalProfileReferenceId="AAD-UserReadUsingObjectId" />
        </ClaimsExchanges>
      </OrchestrationStep>
      <OrchestrationStep Order="2" Type="SendClaims" CpimIssuerTechnicalProfileReferenceId="UserInfoIssuer" />
    </OrchestrationSteps>
  </UserJourney>
<!-- 
</UserJourneys> -->
```

### 3. Include the endpoint to the relying party policy

To include the UserInfo endpoint in the relying party application, add an [Endpoint](relyingparty.md#endpoints) element to the *SocialAndLocalAccounts/SignUpOrSignIn.xml* file. 

```xml
<!--
<RelyingParty> -->
  <Endpoints>
    <Endpoint Id="UserInfo" UserJourneyReferenceId="UserInfoJourney" />
  </Endpoints>
<!-- 
</RelyingParty> -->
```

The completed relying party element will be as follows:

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<TrustFrameworkPolicy xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema"
  xmlns="http://schemas.microsoft.com/online/cpim/schemas/2013/06" PolicySchemaVersion="0.3.0.0" TenantId="yourtenant.onmicrosoft.com" PolicyId="B2C_1A_signup_signin" PublicPolicyUri="http://yourtenant.onmicrosoft.com/B2C_1A_signup_signin">
  <BasePolicy>
    <TenantId>yourtenant.onmicrosoft.com</TenantId>
    <PolicyId>B2C_1A_TrustFrameworkExtensions</PolicyId>
  </BasePolicy>
  <RelyingParty>
    <DefaultUserJourney ReferenceId="SignUpOrSignIn" />
    <Endpoints>
      <Endpoint Id="UserInfo" UserJourneyReferenceId="UserInfoJourney" />
    </Endpoints>
    <TechnicalProfile Id="PolicyProfile">
      <DisplayName>PolicyProfile</DisplayName>
      <Protocol Name="OpenIdConnect" />
      <OutputClaims>
        <OutputClaim ClaimTypeReferenceId="displayName" />
        <OutputClaim ClaimTypeReferenceId="givenName" />
        <OutputClaim ClaimTypeReferenceId="surname" />
        <OutputClaim ClaimTypeReferenceId="email" />
        <OutputClaim ClaimTypeReferenceId="objectId" PartnerClaimType="sub"/>
        <OutputClaim ClaimTypeReferenceId="tenantId" AlwaysUseDefaultValue="true" DefaultValue="{Policy:TenantObjectId}" />
      </OutputClaims>
      <SubjectNamingInfo ClaimType="sub" />
    </TechnicalProfile>
  </RelyingParty>
</TrustFrameworkPolicy>
```

### 4. Upload the files

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. If you have access to multiple tenants, select the **Settings** icon in the top menu to switch to your Azure AD B2C tenant from the **Directories + subscriptions** menu.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
1. Select **Identity Experience Framework**.
1. On the **Custom policies** page, select **Upload custom policy**.
1. Select **Overwrite the custom policy if it already exists**, and then search for and select the *TrustframeworkExtensions.xml* file.
1. Click **Upload**.
1. Repeat steps 5 through 7 for the relying party file, such as *SignUpOrSignIn.xml*.

## Calling the UserInfo endpoint

The UserInfo endpoint makes use of the standard OAuth2 Bearer token API, called by using the access token received when getting a token for your application. It returns a JSON response containing claims about the user. The UserInfo endpoint is hosted on Azure AD B2C at:

```http
https://yourtenant.b2clogin.com/yourtenant.onmicrosoft.com/policy-name/openid/v2.0/userinfo
```

The /.well-known configure endpoint (OpenID Connect discovery document) lists the `userinfo_endpoint` field. You can programmatically discover the UserInfo endpoint using the /.well-known configure endpoint at: 

```http
https://yourtenant.b2clogin.com/yourtenant.onmicrosoft.com/policy-name/v2.0/.well-known/openid-configuration 
```

### Test the policy

1. Under **Custom policies**, select the policy you have integrated the UserInfo endpoint with. For example, *B2C_1A_SignUpOrSignIn*.
1. Select **Run now**. 
1. Under **Select application**, select your application that you previously registered. For **Select reply url**, choose `https://jwt.ms`. For more information, see [Register a web application in Azure Active Directory B2C](tutorial-register-applications.md).
1. Sign up or sign in with an email address or a social account.
1. Copy the id_token in its encoded format from the [https://jwt.ms](https://jwt.ms) website. You can use this to submit a GET request to the UserInfo endpoint and retrieve the user information.
1. Submit a GET request to the UserInfo endpoint and retrieve the user information.

```http
GET /yourtenant.onmicrosoft.com/b2c_1a_signup_signin/openid/v2.0/userinfo
Host: b2cninja.b2clogin.com
Authorization: Bearer <your access token>
```

A successful response would look like:

```json
{
    "objectId": "44444444-4444-4444-4444-444444444444",
    "givenName": "John",
    "surname": "Smith",
    "displayName": "John Smith",
    "signInNames.emailAddress": "john.s@contoso.com"
}
```

## Provide optional claims

To provide more claims to your app, follow these steps:

1. [Add user attributes and customize user input](configure-user-input.md).
1. Modify the [Relying party policy technical profile](relyingparty.md#technicalprofile) OutputClaims element with the claims you want to provide. Use the `DefaultValue` attribute to set a default value. You can also set the default value to a [claim resolver](claim-resolver-overview.md), such as `{Context:CorrelationId}`. To force the use of the default value, set the `AlwaysUseDefaultValue` attribute to `true`. The following example adds the city claim with a default value.
    
    ```xml
    <RelyingParty>
      ...
      <TechnicalProfile Id="PolicyProfile">
        ...
        <OutputClaims>
          <OutputClaim ClaimTypeReferenceId="city" DefaultValue="Berlin" />
        </OutputClaims>
        ...
      </TechnicalProfile>
    </RelyingParty>
    ```
  
1. Modify the UserInfoIssuer technical profile  InputClaims element with the claims you want to provide. Use the `PartnerClaimType` attribute to change the name of the claim return to your app. The following example adds the city claim and change the name of some of the claims.

    ```xml
    <TechnicalProfile Id="UserInfoIssuer">
      ...
      <InputClaims>
        <InputClaim ClaimTypeReferenceId="objectId" />
        <InputClaim ClaimTypeReferenceId="city" />
        <InputClaim ClaimTypeReferenceId="givenName" />
        <InputClaim ClaimTypeReferenceId="surname" PartnerClaimType="familyName" />
        <InputClaim ClaimTypeReferenceId="displayName" PartnerClaimType="name" />
        <InputClaim ClaimTypeReferenceId="signInNames.emailAddress" PartnerClaimType="email" />
      </InputClaims>
      ...
    </TechnicalProfile>
    ```

## Next Steps

- You can find an example of a UserInfo endpoint policy on [GitHub](https://github.com/azure-ad-b2c/samples/tree/master/policies/user-info-endpoint).

::: zone-end
