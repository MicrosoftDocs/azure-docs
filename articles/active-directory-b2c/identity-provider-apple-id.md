---
title: Set up sign-up and sign-in with an Apple ID
titleSuffix: Azure AD B2C
description: Provide sign-up and sign-in to customers with Apple ID in your applications using Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 03/15/2021
ms.custom: project-no-code
ms.author: mimart
ms.subservice: B2C
zone_pivot_groups: b2c-policy-type
---

# Set up sign-up and sign-in with an Apple ID  using Azure Active Directory B2C (Preview)

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]

::: zone pivot="b2c-custom-policy"

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

::: zone-end

## Prerequisites

[!INCLUDE [active-directory-b2c-customization-prerequisites](../../includes/active-directory-b2c-customization-prerequisites.md)]

## Create an Apple ID application

To enable sign-in for users with an Apple ID in Azure Active Directory B2C (Azure AD B2C), you need to create an application in [https://developer.apple.com](https://developer.apple.com). For more information, see [Sign in with Apple](https://developer.apple.com/sign-in-with-apple/get-started/). If you don't already have an Apple developer account, you can sign up at [Apple Developer Program](https://developer.apple.com/programs/enroll/).

1. Sign in to the [Apple Developer Portal](https://developer.apple.com/account) with your account credentials.
1. From the menu, select **Certificates, IDs, & Profiles**, and then select **(+)**.
1. For **Register a New Identifier**, select **App IDs**, and then select **Continue**.
1. For **Select a type**, select **App**, and then select **Continue**.
1. For **Register an App ID**:
    1. Enter a **Description** 
    1. Enter the **Bundle ID**, such as `com.contoso.azure-ad-b2c`. 
    1. For **Capabilities**, select **Sign in with Apple** from the capabilities list. 
    1. Take note of your App ID Prefix (Team ID) from this step. You'll need it later.
    1. Select **Continue** and then **Register**.
1. From the menu, select **Certificates, IDs, & Profiles**, and then select **(+)**.
1. For **Register a New Identifier**, select **Services IDs**, and then select **Continue**.
1. For **Register a Services ID**:
    1. Enter a **Description**. The description is shown to the user on the consent screen.
    1. Enter the **Identifier**, such as `com.consoto.azure-ad-b2c-service`. The identifier is your client ID for the OpenID Connect flow.
    1. Select **Continue**, and then select **Register**.
1. From **Identifiers**, select the identifier you created.
1. Select **Sign In with Apple**, and then select **Configure**.
    1. Select the **Primary App ID** you want to configure Sign in with Apple with.
    1. In **Domains and Subdomains**, enter `your-tenant-name.b2clogin.com`. Replace your-tenant-name with the name of your tenant. If you use a [custom domain](custom-domain.md), enter `https://your-domain-name`.
    1. In **Return URLs**, enter `https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/oauth2/authresp`. If you use a [custom domain](custom-domain.md), enter `https://your-domain-name/your-tenant-name.onmicrosoft.com/oauth2/authresp`. Replace `your-tenant-name` with the name of your tenant, and `your-domain-name` with your custom domain.
    1. Select **Next**, and then select **Done**.
    1. When the pop-up window is closed, select **Continue**, and then select **Save**.

## Creating an Apple client secret

1. From the Apple Developer portal menu, select **Keys**, and then select **(+)**.
1. For **Register a New Key**:
    1. Type a **Key Name**.
    1. Select **Sign in with Apple**, and then select **Configure**.
    1. For the **Primary App ID**, select the app you created previously, and the select **Save**.
    1. Select **Configure**, and then select **Register** to finish the key registration process.
1. For **Download Your Key**, select **Download** to download a .p8 file that contains your key.


::: zone pivot="b2c-user-flow"

## Configure Apple as an identity provider

1. Sign in to the [Azure portal](https://portal.azure.com/) as a global administrator of your Azure AD B2C tenant.
1. Select the **Directory + subscription** filter in the top menu and choose the directory that contains your Azure AD B2C tenant.
1. Under **Azure services**, select **Azure AD B2C**. Or use the search box to find and select **Azure AD B2C**.
1. Select **Identity providers**, then select **Apple (Preview)**.
1. Enter a **Name**. For example, *Apple*.
1. Enter the **Apple developer ID (Team ID)**.
1. Enter the **Apple service ID (client ID)**.
1. Enter the **Apple key ID**.
1. Select and upload the **Apple certificate data**.
1. Select **Save**.


> [!IMPORTANT] 
> - Sign in with Apple requires the Admin to renew their client secret every 6 months. 
> - During the public preview of this feature, you'll need to manually renew the Apple client secret if it expires. A warning will appear in advance on Apple identity providers Configure social IDP page, but we recommend you set your own reminder. 
> - If you need to renew the secret, open Azure AD B2C in the Azure portal, go to **Identity providers** > **Apple**, and select **Renew secret**.

## Add the Apple identity provider to a user flow

To enable users to sign in using an Apple ID, you need to add the Apple identity provider to a user flow. Sign in with Apple can be configured only for the **recommended** version of user flows. To add the Apple identity provider to a user flow:

1. In your Azure AD B2C tenant, select **User flows**.
1. Select a user flow for which you want to add the Apple identity provider. 
1. Under **Social identity providers**, select **Apple (Preview)**.
1. Select **Save**.
1. To test your policy, select **Run user flow**.
1. For **Application**, select the web application named *testapp1* that you previously registered. The **Reply URL** should show `https://jwt.ms`.
1. Select the **Run user flow** button.
1. From the sign-up or sign-in page, select **Apple** to sign in with Apple ID.

If the sign-in process is successful, your browser is redirected to `https://jwt.ms`, which displays the contents of the token returned by Azure AD B2C.

::: zone-end

::: zone pivot="b2c-custom-policy"

## Signing the client secret

Use the .p8 file you downloaded previously to sign the client secret into a JWT token. There are many libraries that can create and sign the JWT for you. Use the [Azure Function that creates a token](https://github.com/azure-ad-b2c/samples/tree/master/policies/sign-in-with-apple/azure-function) for you. 

1. Create an [Azure Function](../azure-functions/functions-create-function-app-portal.md).
1. Under **Developer**, select **Code + Test**. 
1. Copy the content of the [run.csx](https://github.com/azure-ad-b2c/samples/blob/master/policies/sign-in-with-apple/azure-function/run.csx) file, and paste it in the editor.
1. Select **Save**.
1. Make an HTTP `POST` request, and  provide the following information:

    - **appleTeamId**: Your Apple Developer Team ID
    - **appleServiceId**: The Apple Service ID (also the client ID)
    - **p8key**: The PEM format key. You can obtain this by opening the .p8 file in a text editor and copying everything between 
    `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` without line breaks.
 
The following json is an example of a call to the Azure function:

```json
{
    "appleTeamId": "ABC123DEFG",
    "appleKeyId": "URKEYID001",
    "appleServiceId": "com.yourcompany.app1",
    "p8key": "MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQg+s07NiAcuGEu8rxsJBG7ttupF6FRe3bXdHxEipuyK82gCgYIKoZIzj0DAQehRANCAAQnR1W/KbbaihTQayXH3tuAXA8Aei7u7Ij5OdRy6clOgBeRBPy1miObKYVx3ki1msjjG2uGqRbrc1LvjLHINWRD"
}
```

The Azure function responds with a properly formatted and signed client secret JWT in a response, for example:

```json
{
    "token": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjb20ueW91cmNvbXBhbnkuYXBwMSIsIm5iZiI6MTU2MDI2OTY3NSwiZXhwIjoxNTYwMzU2MDc1LCJpc3MiOiJBQkMxMjNERUZHIiwiYXVkIjoiaHR0cHM6Ly9hcHBsZWlkLmFwcGxlLmNvbSJ9.Dt9qA9NmJ_mk6tOqbsuTmfBrQLFqc9BnSVKR6A-bf9TcTft2XmhWaVODr7Q9w1PP3QOYShFXAnNql5OdNebB4g"
}
```

## Create a policy key

You need to store the client secret that you previously recorded in your Azure AD B2C tenant.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Select the **Directory + subscription** filter in the top menu and choose the directory that contains your Azure AD B2C tenant.
2. Under **Azure services**, select **Azure AD B2C**. Or use the search box to find and select **Azure AD B2C**.
1. On the **Overview** page, select **Identity Experience Framework**.
1. Select **Policy Keys**, and then select **Add**.
1. For **Options**, choose **Manual**.
1. Enter a **Name** for the policy key. For example, "AppleSecret". The prefix "B2C_1A_" is added automatically to the name of your key.
1. In **Secret**, enter the value of a token returned by the Azure Function (a JWT token).
1. For **Key usage**, select **Signature**.
1. Select **Create**.

> [!IMPORTANT] 
> - Sign in with Apple requires the Admin to renew their client secret every 6 months.
> - You'll need to manually renew the Apple client secret if it expires and store the new value in the policy key.
> - We recommend you set your own reminder within 6 months to generate a new client secret. 

## Configure Apple as an identity provider

To enable users to sign in using an Apple ID, you need to define the account as a claims provider that Azure AD B2C can communicate with through an endpoint. The endpoint provides a set of claims that are used by Azure AD B2C to verify that a specific user is authenticated.

You can define an Apple ID as a claims provider by adding it to the **ClaimsProviders** element in the extension file of your policy.

1. Open the *TrustFrameworkExtensions.xml*.
2. Find the **ClaimsProviders** element. If it does not exist, add it under the root element.
3. Add a new **ClaimsProvider** as follows:

    ```xml
    <ClaimsProvider>
      <Domain>apple.com</Domain>
      <DisplayName>Apple</DisplayName>
      <TechnicalProfiles>
        <TechnicalProfile Id="Apple-OIDC">
          <DisplayName>Apple</DisplayName>
          <Protocol Name="OpenIdConnect" />
          <Metadata>
            <Item Key="ProviderName">apple</Item>
            <Item Key="authorization_endpoint">https://appleid.apple.com/auth/authorize</Item>
            <Item Key="AccessTokenEndpoint">https://appleid.apple.com/auth/token</Item>
            <Item Key="JWKS">https://appleid.apple.com/auth/keys</Item>
            <Item Key="issuer">https://appleid.apple.com</Item>
            <Item Key="scope">name email openid</Item>
            <Item Key="HttpBinding">POST</Item>
            <Item Key="response_types">code</Item>
            <Item Key="external_user_identity_claim_id">sub</Item>
            <Item Key="response_mode">form_post</Item>
            <Item Key="ReadBodyClaimsOnIdpRedirect">user.firstName user.lastName user.email</Item>
            <Item Key="client_id">You Apple ID</Item>
            <Item Key="UsePolicyInRedirectUri">false</Item>
          </Metadata>
          <CryptographicKeys>
            <Key Id="client_secret" StorageReferenceId="B2C_1A_AppleSecret"/>
          </CryptographicKeys>
          <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="issuerUserId" PartnerClaimType="sub" />
            <OutputClaim ClaimTypeReferenceId="identityProvider" DefaultValue="https://appleid.apple.com" AlwaysUseDefaultValue="true" />
            <OutputClaim ClaimTypeReferenceId="authenticationSource" DefaultValue="socialIdpAuthentication" AlwaysUseDefaultValue="true" />
            <OutputClaim ClaimTypeReferenceId="givenName" PartnerClaimType="user.firstName"/>
            <OutputClaim ClaimTypeReferenceId="surname" PartnerClaimType="user.lastName"/>
            <OutputClaim ClaimTypeReferenceId="email" PartnerClaimType="user.email"/>
          </OutputClaims>
          <OutputClaimsTransformations>
            <OutputClaimsTransformation ReferenceId="CreateRandomUPNUserName"/>
            <OutputClaimsTransformation ReferenceId="CreateUserPrincipalName"/>
            <OutputClaimsTransformation ReferenceId="CreateAlternativeSecurityId"/>
            <OutputClaimsTransformation ReferenceId="CreateSubjectClaimFromAlternativeSecurityId"/>
          </OutputClaimsTransformations>
          <UseTechnicalProfileForSessionManagement ReferenceId="SM-SocialLogin" />
        </TechnicalProfile>
      </TechnicalProfiles>
    </ClaimsProvider>
    ```

4. Set **client_id** to the service identifier. For example, `com.consoto.azure-ad-b2c-service`.
5. Save the file.

[!INCLUDE [active-directory-b2c-add-identity-provider-to-user-journey](../../includes/active-directory-b2c-add-identity-provider-to-user-journey.md)]


```xml
<OrchestrationStep Order="1" Type="CombinedSignInAndSignUp" ContentDefinitionReferenceId="api.signuporsignin">
  <ClaimsProviderSelections>
    ...
    <ClaimsProviderSelection TargetClaimsExchangeId="AppleExchange" />
  </ClaimsProviderSelections>
  ...
</OrchestrationStep>

<OrchestrationStep Order="2" Type="ClaimsExchange">
  ...
  <ClaimsExchanges>
    <ClaimsExchange Id="AppleExchange" TechnicalProfileReferenceId="Apple-OIDC" />
  </ClaimsExchanges>
</OrchestrationStep>
```

[!INCLUDE [active-directory-b2c-configure-relying-party-policy](../../includes/active-directory-b2c-configure-relying-party-policy-user-journey.md)]

## Test your custom policy

1. Select your relying party policy, for example `B2C_1A_signup_signin`.
1. For **Application**, select a web application that you [previously registered](troubleshoot-custom-policies.md#troubleshoot-the-runtime). The **Reply URL** should show `https://jwt.ms`.
1. Select the **Run now** button.
1. From the sign-up or sign-in page, select **Apple** to sign in with Apple ID.

If the sign-in process is successful, your browser is redirected to `https://jwt.ms`, which displays the contents of the token returned by Azure AD B2C.

::: zone-end
