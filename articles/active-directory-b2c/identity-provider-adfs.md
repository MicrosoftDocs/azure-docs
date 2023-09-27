---
title: Add AD FS as an OpenID Connect identity provider by using custom policies
titleSuffix: Azure AD B2C
description: Set up AD FS 2016 using the OpenID Connect protocol and custom policies in Azure Active Directory B2C
services: active-directory-b2c
author: garrodonnell
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 06/08/2022
ms.custom: project-no-code
ms.author: godonnell
ms.subservice: B2C
zone_pivot_groups: b2c-policy-type
---

# Add AD FS as an OpenID Connect identity provider using custom policies in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]


## Prerequisites

[!INCLUDE [active-directory-b2c-customization-prerequisites](../../includes/active-directory-b2c-customization-prerequisites.md)]


## Create an AD FS application

To enable sign-in for users with an AD FS account in Azure Active Directory B2C (Azure AD B2C), create an Application Group in your AD FS. For more information, see [Build a web application using OpenID Connect with AD FS 2016 and later](../active-directory/develop/msal-migration.md)

To create an Application Group, follow theses steps:

1. In **Server Manager**, select **Tools**, and then select **AD FS Management**.
1. In AD FS Management, right-click on **Application Groups** and select **Add Application Group**.
1. On the Application Group Wizard **Welcome** screen:
    1. Enter the **Name** of your application. For example, *Azure AD B2C application*.
    1. Under **Client-Server applications**, select the **Web browser accessing a web application** template.
    1. Select **Next**.
1. On the Application Group Wizard **Native Application** screen:
    1. Copy the **Client Identifier** value. The client identifier is your AD FS **Application ID**. You will need the application ID later in this article.
    1. In **Redirect URI**, enter `https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/oauth2/authresp`, and then **Add**. If you use a [custom domain](custom-domain.md), enter `https://your-domain-name/your-tenant-name.onmicrosoft.com/oauth2/authresp`. Replace `your-tenant-name` with the name of your tenant, and `your-domain-name` with your custom domain.
    1. Select **Next**, and then **Next**, and then **Next** again to complete the app registration wizard. 
    1. Select **Close**.


### Configure the app claims

In this step, configure the claims AD FS application returns to Azure AD B2C.  

1. In the **Application Groups**, select the application your created.
1. In the application properties window, under the **Applications**, select the **Web Application**. Then select **Edit**.
    :::image type="content" source="./media/identity-provider-adfs/ad-fs-edit-app.png" alt-text="Screenshot that shows how to edit a web application.":::
1. Select the **Issuance Transformation Rules** tab. Then select **Add Rule**.
1. In **Claim rule template**, select **Send LDAP attributes as claims**, and then **Next**.
1. Provide a **Claim rule name**. For the **Attribute store**, select **Active Directory**, add the following claims.

    | LDAP attribute | Outgoing claim type |
    | -------------- | ------------------- |
    | User-Principal-Name | upn |
    | Surname | family_name |
    | Given-Name | given_name |
    | Display-Name | name |

    Note some of the names will not display in the outgoing claim type dropdown. You need to manually type them in (the dropdown is editable).

1. Select **Finish**.
1. Select **Apply**, and then **OK**.
1. Select **OK** again to finish.


::: zone pivot="b2c-user-flow"

## Configure AD FS as an identity provider

1. Sign in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.
1. Make sure you're using the directory that contains your Azure AD B2C tenant. Select the **Directories + subscriptions** icon in the portal toolbar.
1. On the **Portal settings | Directories + subscriptions** page, find your Azure AD B2C directory in the **Directory name** list, and then select **Switch**.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
1. Select **Identity providers**, and then select **New OpenID Connect provider**.
1. Enter a **Name**. For example, *Contoso*.
1. For **Metadata url**, enter the URL of the [AD FS OpenID Connect Configuration document](/windows-server/identity/ad-fs/development/ad-fs-openid-connect-oauth-concepts#ad-fs-endpoints). For example:

    ```http
    https://adfs.contoso.com/adfs/.well-known/openid-configuration 
    ```

1. For **Client ID**, enter the application ID that you previously recorded.
1. For the **Scope**, enter the `openid`.
1. For **Response type**, select **id_token**. So, the **Client secret** value isn't needed. Learn more about use of [Client ID and secret](identity-provider-generic-openid-connect.md#client-id-and-secret) when adding a generic OpenID Connect identity provider.
1. (Optional) For the **Domain hint**, enter `contoso.com`. For more information, see [Set up direct sign-in using Azure Active Directory B2C](direct-signin.md#redirect-sign-in-to-a-social-provider).
1. Under **Identity provider claims mapping**, select the following claims:

    - **User ID**: `upn`
    - **Display name**: `unique_name`
    - **Given name**: `given_name`
    - **Surname**: `family_name`

1. Select **Save**.

## Add AD FS identity provider to a user flow 

At this point, the AD FS (Contoso) identity provider has been set up, but it's not yet available in any of the sign-in pages. To add the AD FS identity provider to a user flow:

1. In your Azure AD B2C tenant, select **User flows**.
1. Select the user flow that you want to add the AD FS identity provider (Contoso).
1. Under the **Social identity providers**, select **Contoso**.
1. Select **Save**.
1. To test your policy, select **Run user flow**.
1. For **Application**, select the web application named *testapp1* that you previously registered. The **Reply URL** should show `https://jwt.ms`.
1. Select the **Run user flow** button.
1. From the sign-up or sign-in page, select **Contoso** to sign in with the Contoso account.

If the sign-in process is successful, your browser is redirected to `https://jwt.ms`, which displays the contents of the token returned by Azure AD B2C.

::: zone-end

::: zone pivot="b2c-custom-policy"


## Configure AD FS as an identity provider

To enable users to sign in using an AD FS account, you need to define the AD FS as a claims provider that Azure AD B2C can communicate with through an endpoint. 

1. Open the *TrustFrameworkExtensions.xml*.
2. Find the **ClaimsProviders** element. If it does not exist, add it under the root element.
3. Add a new **ClaimsProvider** as follows:

    ```xml
    <ClaimsProvider>
      <Domain>contoso.com</Domain>
      <DisplayName>Contoso</DisplayName>
      <TechnicalProfiles>
        <TechnicalProfile Id="Contoso-OpenIdConnect">
          <DisplayName>Contoso</DisplayName>
          <Protocol Name="OpenIdConnect" />
          <Metadata>
            <Item Key="METADATA">https://your-adfs-domain/adfs/.well-known/openid-configuration</Item>
            <Item Key="response_types">id_token</Item>
            <Item Key="response_mode">form_post</Item>
            <Item Key="scope">openid</Item>
            <Item Key="HttpBinding">POST</Item>
            <Item Key="UsePolicyInRedirectUri">0</Item>
            <!-- Update the Client ID below to the Application ID -->
            <Item Key="client_id">Your AD FS application ID</Item>
          </Metadata>
          <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="issuerUserId" PartnerClaimType="upn" />
            <OutputClaim ClaimTypeReferenceId="givenName" PartnerClaimType="given_name" />
            <OutputClaim ClaimTypeReferenceId="surname" PartnerClaimType="family_name" />
            <OutputClaim ClaimTypeReferenceId="displayName" PartnerClaimType="unique_name" />
            <OutputClaim ClaimTypeReferenceId="identityProvider" PartnerClaimType="iss"  />
            <OutputClaim ClaimTypeReferenceId="authenticationSource" DefaultValue="socialIdpAuthentication" AlwaysUseDefaultValue="true" />
          </OutputClaims>
          <OutputClaimsTransformations>
            <OutputClaimsTransformation ReferenceId="CreateRandomUPNUserName" />
            <OutputClaimsTransformation ReferenceId="CreateUserPrincipalName" />
            <OutputClaimsTransformation ReferenceId="CreateAlternativeSecurityId" />
          </OutputClaimsTransformations>
          <UseTechnicalProfileForSessionManagement ReferenceId="SM-SocialLogin" />
        </TechnicalProfile>
      </TechnicalProfiles>
    </ClaimsProvider>
    ```

4. For the **Metadata url**, enter the URL of the [AD FS OpenID Connect Configuration document](/windows-server/identity/ad-fs/development/ad-fs-openid-connect-oauth-concepts#ad-fs-endpoints). For example:

    ```
    https://adfs.contoso.com/adfs/.well-known/openid-configuration 
    ```
5. Set **client_id** to the application ID from the application registration.
6. Save the file.

[!INCLUDE [active-directory-b2c-add-identity-provider-to-user-journey](../../includes/active-directory-b2c-add-identity-provider-to-user-journey.md)]


```xml
<OrchestrationStep Order="1" Type="CombinedSignInAndSignUp" ContentDefinitionReferenceId="api.signuporsignin">
  <ClaimsProviderSelections>
    ...
    <ClaimsProviderSelection TargetClaimsExchangeId="ContosoExchange" />
  </ClaimsProviderSelections>
  ...
</OrchestrationStep>

<OrchestrationStep Order="2" Type="ClaimsExchange">
  ...
  <ClaimsExchanges>
    <ClaimsExchange Id="ContosoExchange" TechnicalProfileReferenceId="Contoso-OpenIdConnect" />
  </ClaimsExchanges>
</OrchestrationStep>
```

[!INCLUDE [active-directory-b2c-configure-relying-party-policy](../../includes/active-directory-b2c-configure-relying-party-policy-user-journey.md)]

## Test your custom policy

1. Select your relying party policy, for example `B2C_1A_signup_signin`.
1. For **Application**, select a web application that you [previously registered](tutorial-register-applications.md). The **Reply URL** should show `https://jwt.ms`.
1. Select the **Run now** button.
1. From the sign-up or sign-in page, select **Contoso** to sign in with Contoso account.

If the sign-in process is successful, your browser is redirected to `https://jwt.ms`, which displays the contents of the token returned by Azure AD B2C.


::: zone-end

## Next steps

Learn how to [pass AD-FS token to your application](idp-pass-through-user-flow.md).
