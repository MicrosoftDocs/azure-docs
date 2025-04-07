---
title: Set up sign-up and sign-in with a WeChat account
titleSuffix: Azure AD B2C
description: Provide sign-up and sign-in to customers with WeChat accounts in your applications using Azure Active Directory B2C.
author: garrodonnell
manager: CelesteDG
ms.service: azure-active-directory
ms.topic: how-to
ms.date: 09/16/2021
ms.author: godonnell
ms.subservice: b2c
zone_pivot_groups: b2c-policy-type

#Customer Intent: As a developer using Azure Active Directory B2C, I want to set up sign-up and sign-in with a WeChat account, so that users can authenticate using their WeChat credentials.

---

# Set up sign-up and sign-in with a WeChat account using Azure Active Directory B2C


[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]

[!INCLUDE [active-directory-b2c-public-preview](../../includes/active-directory-b2c-public-preview.md)]

## Prerequisites

[!INCLUDE [active-directory-b2c-customization-prerequisites](../../includes/active-directory-b2c-customization-prerequisites.md)]
* Get an approved Weixin Open Platform account at [https://kf.qq.com](https://kf.qq.com/faq/161220Brem2Q161220uUjERB.html).
* Get an approved application on Weixin Open Platform.

## Create a WeChat application

To enable sign-in for users with a WeChat account in Azure Active Directory B2C (Azure AD B2C), you need to create an application in [WeChat management center](https://open.weixin.qq.com/). If you don't already have a Weixin Open Platform account, you can get information at [https://kf.qq.com](https://kf.qq.com/faq/161220Brem2Q161220uUjERB.html). The Weixin Open Platform account and application must be approved to link WeChat as an identity provider to your user flow.

### Register a WeChat application

1. Sign in to [https://open.weixin.qq.com/](https://open.weixin.qq.com/) with your WeChat credentials.
1. Select **管理中心** (management center).
1. Follow the steps to register a new application.
1. In the **Development information** section, set the "Authorization callback domain" to `your-tenant-name.b2clogin.com`.
1. Ensure that the application status is "Approved".
1. At the top of **Application details**, copy the **APP ID** and **APP KEY**. You need both of them to configure the identity provider to your tenant.

::: zone pivot="b2c-user-flow"

## Configure WeChat as an identity provider

1. Sign in to the [Azure portal](https://portal.azure.com/) with an account that has at least [External Identity Provider Administrator](/entra/identity/role-based-access-control/permissions-reference#external-identity-provider-administrator) privileges.
1. If you have access to multiple tenants, select the **Settings** icon in the top menu to switch to your Azure AD B2C tenant from the **Directories + subscriptions** menu.
1. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.
1. Select **Identity providers**, then select **WeChat (Preview)**.
1. Enter a **Name**. For example, *WeChat*.
1. For the **Client ID**, enter the APP ID of the WeChat application that you created earlier.
1. For the **Client secret**, enter the APP KEY that you recorded.
1. Select **Save**.

    :::image type="content" source="media/identity-provider-azure-ad-b2c/wechat-client-configuration.png" alt-text="Screenshot that shows the Configure social identity provider window, with completed form fields for social identity provider name, WeChat client ID, and app secret." lightbox="media/identity-provider-azure-ad-b2c/wechat-client-configuration.png":::

## Add WeChat identity provider to a user flow 

1. In your Azure AD B2C tenant, select **User flows**.
1. Click the user flow that you want to add the WeChat identity provider.
1. Under the **Social identity providers**, select **WeChat**.
1. Select **Save**.

   :::image type="content" source="media/identity-provider-azure-ad-b2c/link-wechat-identity-provider.png" alt-text="Screenshot showing WeChat as a selected identity provider in the Identity Providers section." lightbox="media/identity-provider-azure-ad-b2c/link-wechat-identity-provider.png":::

1. To test your policy, select **Run user flow**.
1. For **Application**, select the web application named *testapp1* that you previously registered. The **Reply URL** should show `https://jwt.ms`.
1. Select the **Run user flow** button.
1. From the sign-up or sign-in page, select **WeChat** to sign in with WeChat account.

If the sign-in process is successful, your browser is redirected to `https://jwt.ms`, which displays the contents of the token returned by Azure AD B2C.

::: zone-end

::: zone pivot="b2c-custom-policy"

## Create a policy key

You need to store the client secret that you previously recorded in your Azure AD B2C tenant.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. If you have access to multiple tenants, select the **Settings** icon in the top menu to switch to your Azure AD B2C tenant from the **Directories + subscriptions** menu.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
1. On the Overview page, select **Identity Experience Framework**.
1. Select **Policy Keys** and then select **Add**.
1. For **Options**, choose `Manual`.
1. Enter a **Name** for the policy key. For example, `WeChatSecret`. The prefix `B2C_1A_` is added automatically to the name of your key.
1. In **Secret**, enter your client secret that you previously recorded.
1. For **Key usage**, select `Signature`.
1. Click **Create**.

## Configure WeChat as an identity provider

To enable users to sign in using a WeChat account, you need to define the account as a claims provider that Azure AD B2C can communicate with through an endpoint. The endpoint provides a set of claims that are used by Azure AD B2C to verify that a specific user has authenticated.

You can define a WeChat account as a claims provider by adding it to the **ClaimsProviders** element in the extension file of your policy.

1. Open the *TrustFrameworkExtensions.xml*.
2. Find the **ClaimsProviders** element. If it does not exist, add it under the root element.
3. Add a new **ClaimsProvider** as follows:

    ```xml
    <ClaimsProvider>
      <Domain>wechat.com</Domain>
      <DisplayName>WeChat (Preview)</DisplayName>
      <TechnicalProfiles>
        <TechnicalProfile Id="WeChat-OAuth2">
          <DisplayName>WeChat</DisplayName>
          <Protocol Name="OAuth2" />
          <Metadata>
            <Item Key="ProviderName">wechat</Item>
            <Item Key="authorization_endpoint">https://open.weixin.qq.com/connect/qrconnect</Item>
            <Item Key="AccessTokenEndpoint">https://api.weixin.qq.com/sns/oauth2/access_token</Item>
            <Item Key="ClaimsEndpoint">https://api.weixin.qq.com/sns/userinfo</Item>
            <Item Key="scope">snsapi_login</Item>
            <Item Key="HttpBinding">GET</Item>
            <Item Key="AccessTokenResponseFormat">json</Item>
            <Item Key="ClientIdParamName">appid</Item>
            <Item Key="ClientSecretParamName">secret</Item>
            <Item Key="ExtraParamsInAccessTokenEndpointResponse">openid</Item>
            <Item Key="ExtraParamsInClaimsEndpointRequest">openid</Item>
            <Item Key="ResponseErrorCodeParamName">errcode</Item>
            <Item Key="external_user_identity_claim_id">unionid</Item>
          <Item Key="client_id">Your WeChat application ID</Item>
          </Metadata>
          <CryptographicKeys>
            <Key Id="client_secret" StorageReferenceId="B2C_1A_WeChatSecret" />
          </CryptographicKeys>
          <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="UserId" PartnerClaimType="unionid" />
            <OutputClaim ClaimTypeReferenceId="identityProvider" DefaultValue="wechat.com" AlwaysUseDefaultValue="true" />
            <OutputClaim ClaimTypeReferenceId="authenticationSource" DefaultValue="socialIdpAuthentication" AlwaysUseDefaultValue="true" />
          </OutputClaims>
          <OutputClaimsTransformations>
            <OutputClaimsTransformation ReferenceId="CreateRandomUPNUserName" />
            <OutputClaimsTransformation ReferenceId="CreateUserPrincipalName" />
            <OutputClaimsTransformation ReferenceId="CreateAlternativeSecurityId" />
            <OutputClaimsTransformation ReferenceId="CreateSubjectClaimFromAlternativeSecurityId" />
          </OutputClaimsTransformations>
          <UseTechnicalProfileForSessionManagement ReferenceId="SM-SocialLogin" />
        </TechnicalProfile>
      </TechnicalProfiles>
    </ClaimsProvider>
    ```

4. Set **client_id** to the application ID from the application registration.
5. Save the file.

[!INCLUDE [active-directory-b2c-add-identity-provider-to-user-journey](../../includes/active-directory-b2c-add-identity-provider-to-user-journey.md)]


```xml
<OrchestrationStep Order="1" Type="CombinedSignInAndSignUp" ContentDefinitionReferenceId="api.signuporsignin">
  <ClaimsProviderSelections>
    ...
    <ClaimsProviderSelection TargetClaimsExchangeId="WeChatExchange" />
  </ClaimsProviderSelections>
  ...
</OrchestrationStep>

<OrchestrationStep Order="2" Type="ClaimsExchange">
  ...
  <ClaimsExchanges>
    <ClaimsExchange Id="WeChatExchange" TechnicalProfileReferenceId="WeChat-OAuth2" />
  </ClaimsExchanges>
</OrchestrationStep>
```

[!INCLUDE [active-directory-b2c-configure-relying-party-policy](../../includes/active-directory-b2c-configure-relying-party-policy-user-journey.md)]

## Test your custom policy

1. Select your relying party policy, for example `B2C_1A_signup_signin`.
1. For **Application**, select a web application that you [previously registered](tutorial-register-applications.md). The **Reply URL** should show `https://jwt.ms`.
1. Select the **Run now** button.
1. From the sign-up or sign-in page, select **WeChat** to sign in with WeChat account.

If the sign-in process is successful, your browser is redirected to `https://jwt.ms`, which displays the contents of the token returned by Azure AD B2C.

::: zone-end
