---
title: Set up sign-up and sign-in with a Microsoft Account
titleSuffix: Azure AD B2C
description: Provide sign-up and sign-in to customers with Microsoft Accounts in your applications using Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 12/07/2020
ms.author: mimart
ms.subservice: B2C
zone_pivot_groups: b2c-policy-type
---

# Set up sign-up and sign-in with a Microsoft account using Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]

::: zone pivot="b2c-custom-policy"

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

::: zone-end

## Prerequisites

::: zone pivot="b2c-user-flow"

* [Create a user flow](tutorial-create-user-flows.md) to enable users to sign up and sign in to your application.
* If you haven't already done so, [add a web API application to your Azure Active Directory B2C tenant](add-web-api-application.md).

::: zone-end

::: zone pivot="b2c-custom-policy"

* Complete the steps in the [Get started with custom policies in Active Directory B2C](custom-policy-get-started.md).
* If you haven't already done so, [add a web API application to your Azure Active Directory B2C tenant](add-web-api-application.md).

::: zone-end

## Create a Microsoft account application

To use a Microsoft account as an [identity provider](openid-connect.md) in Azure Active Directory B2C (Azure AD B2C), you need to create an application in the Azure AD tenant. The Azure AD tenant is not the same as your Azure AD B2C tenant. If you don't already have a Microsoft account, you can get one at [https://www.live.com/](https://www.live.com/).

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Make sure you're using the directory that contains your Azure AD tenant by selecting the **Directory + subscription** filter in the top menu and choosing the directory that contains your Azure AD tenant.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **App registrations**.
1. Select **New registration**.
1. Enter a **Name** for your application. For example, *MSAapp1*.
1. Under **Supported account types**, select **Accounts in any organizational directory (Any Azure AD directory - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)**.

   For more information on the different account type selections, see [Quickstart: Register an application with the Microsoft identity platform](../active-directory/develop/quickstart-register-app.md).
1. Under **Redirect URI (optional)**, select **Web** and enter `https://<tenant-name>.b2clogin.com/<tenant-name>.onmicrosoft.com/oauth2/authresp` in the text box. Replace `<tenant-name>` with your Azure AD B2C tenant name.
1. Select **Register**
1. Record the **Application (client) ID** shown on the application Overview page. You need this when you configure the identity provider in the next section.
1. Select **Certificates & secrets**
1. Click **New client secret**
1. Enter a **Description** for the secret, for example *Application password 1*, and then click **Add**.
1. Record the application password shown in the **Value** column. You need this when you configure the identity provider in the next section.

::: zone pivot="b2c-user-flow"

## Configure a Microsoft account as an identity provider

1. Sign in to the [Azure portal](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.
1. Make sure you're using the directory that contains your Azure AD B2C tenant by selecting the **Directory + subscription** filter in the top menu and choosing the directory that contains your tenant.
1. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.
1. Select **Identity providers**, then select **Microsoft Account**.
1. Enter a **Name**. For example, *MSA*.
1. For the **Client ID**, enter the Application (client) ID of the Azure AD application that you created earlier.
1. For the **Client secret**, enter the client secret that you recorded.
1. Select **Save**.

::: zone-end

::: zone pivot="b2c-custom-policy"

## Configuring optional claims

If you want to get the `family_name` and `given_name` claims from Azure AD, you can configure optional claims for your application in the Azure portal UI or application manifest. For more information, see [How to provide optional claims to your Azure AD app](../active-directory/develop/active-directory-optional-claims.md).

1. Sign in to the [Azure portal](https://portal.azure.com). Search for and select **Azure Active Directory**.
1. From the **Manage** section, select **App registrations**.
1. Select the application you want to configure optional claims for in the list.
1. From the **Manage** section, select **Token configuration (preview)**.
1. Select **Add optional claim**.
1. Select the token type you want to configure.
1. Select the optional claims to add.
1. Click **Add**.

## Create a policy key

Now that you've created the application in your Azure AD tenant, you need to store that application's client secret in your Azure AD B2C tenant.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Make sure you're using the directory that contains your Azure AD B2C tenant. Select the **Directory + subscription** filter in the top menu and choose the directory that contains your tenant.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
1. On the Overview page, select **Identity Experience Framework**.
1. Select **Policy Keys** and then select **Add**.
1. For **Options**, choose `Manual`.
1. Enter a **Name** for the policy key. For example, `MSASecret`. The prefix `B2C_1A_` is added automatically to the name of your key.
1. In **Secret**, enter the client secret that you recorded in the previous section.
1. For **Key usage**, select `Signature`.
1. Click **Create**.

## Add a claims provider

To enable your users to sign in using a Microsoft account, you need to define the account as a claims provider that Azure AD B2C can communicate with through an endpoint. The endpoint provides a set of claims that are used by Azure AD B2C to verify that a specific user has authenticated.

You can define Azure AD as a claims provider by adding the **ClaimsProvider** element in the extension file of your policy.

1. Open the *TrustFrameworkExtensions.xml* policy file.
1. Find the **ClaimsProviders** element. If it does not exist, add it under the root element.
1. Add a new **ClaimsProvider** as follows:

    ```xml
    <ClaimsProvider>
      <Domain>live.com</Domain>
      <DisplayName>Microsoft Account</DisplayName>
      <TechnicalProfiles>
        <TechnicalProfile Id="MSA-OIDC">
          <DisplayName>Microsoft Account</DisplayName>
          <Protocol Name="OpenIdConnect" />
          <Metadata>
            <Item Key="ProviderName">https://login.live.com</Item>
            <Item Key="METADATA">https://login.live.com/.well-known/openid-configuration</Item>
            <Item Key="response_types">code</Item>
            <Item Key="response_mode">form_post</Item>
            <Item Key="scope">openid profile email</Item>
            <Item Key="HttpBinding">POST</Item>
            <Item Key="UsePolicyInRedirectUri">false</Item>
            <Item Key="client_id">Your Microsoft application client ID</Item>
          </Metadata>
          <CryptographicKeys>
            <Key Id="client_secret" StorageReferenceId="B2C_1A_MSASecret" />
          </CryptographicKeys>
          <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="issuerUserId" PartnerClaimType="oid" />
            <OutputClaim ClaimTypeReferenceId="givenName" PartnerClaimType="given_name" />
            <OutputClaim ClaimTypeReferenceId="surName" PartnerClaimType="family_name" />
            <OutputClaim ClaimTypeReferenceId="displayName" PartnerClaimType="name" />
            <OutputClaim ClaimTypeReferenceId="authenticationSource" DefaultValue="socialIdpAuthentication" />
            <OutputClaim ClaimTypeReferenceId="identityProvider" PartnerClaimType="iss" />
            <OutputClaim ClaimTypeReferenceId="email" />
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

1. Replace the value of **client_id** with the Azure AD application's *Application (client) ID* that you recorded earlier.
1. Save the file.

You've now configured your policy so that Azure AD B2C knows how to communicate with your Microsoft account application in Azure AD.

### Upload the extension file for verification

Before continuing, upload the modified policy to confirm that it doesn't have any issues so far.

1. Navigate to your Azure AD B2C tenant in the Azure portal and select **Identity Experience Framework**.
1. On the **Custom policies** page, select **Upload custom policy**.
1. Enable **Overwrite the policy if it exists**, and then browse to and select the *TrustFrameworkExtensions.xml* file.
1. Click **Upload**.

If no errors are displayed in the portal, continue to the next section.

## Register the claims provider

At this point, you've set up the identity provider, but it's not yet available in any of the sign-up or sign-in screens. To make it available, create a duplicate of an existing template user journey, then modify it so that it also has the Microsoft account identity provider.

1. Open the *TrustFrameworkBase.xml* file from the starter pack.
1. Find and copy the entire contents of the **UserJourney** element that includes `Id="SignUpOrSignIn"`.
1. Open the *TrustFrameworkExtensions.xml* and find the **UserJourneys** element. If the element doesn't exist, add one.
1. Paste the entire content of the **UserJourney** element that you copied as a child of the **UserJourneys** element.
1. Rename the ID of the user journey. For example, `SignUpSignInMSA`.

### Display the button

The **ClaimsProviderSelection** element is analogous to an identity provider button on a sign-up or sign-in screen. If you add a **ClaimsProviderSelection** element for a Microsoft account, a new button is displayed when a user lands on the page.

1. In the *TrustFrameworkExtensions.xml* file, find the **OrchestrationStep** element that includes `Order="1"` in the user journey that you created.
1. Under **ClaimsProviderSelects**, add the following element. Set the value of **TargetClaimsExchangeId** to an appropriate value, for example `MicrosoftAccountExchange`:

    ```xml
    <ClaimsProviderSelection TargetClaimsExchangeId="MicrosoftAccountExchange" />
    ```

### Link the button to an action

Now that you have a button in place, you need to link it to an action. The action, in this case, is for Azure AD B2C to communicate with a Microsoft account to receive a token.

1. Find the **OrchestrationStep** that includes `Order="2"` in the user journey.
1. Add the following **ClaimsExchange** element making sure that you use the same value for the ID that you used for **TargetClaimsExchangeId**:

    ```xml
    <ClaimsExchange Id="MicrosoftAccountExchange" TechnicalProfileReferenceId="MSA-OIDC" />
    ```

    Update the value of **TechnicalProfileReferenceId** to match that of the `Id` value in the **TechnicalProfile** element of the claims provider you added earlier. For example, `MSA-OIDC`.

1. Save the *TrustFrameworkExtensions.xml* file and upload it again for verification.

::: zone-end

::: zone pivot="b2c-user-flow"

## Add Microsoft identity provider to a user flow 

1. In your Azure AD B2C tenant, select **User flows**.
1. Click the user flow that you want to the Microsoft identity provider.
1. Under the **Social identity providers**, select **Microsoft Account**.
1. Select **Save**.
1. To test your policy, select **Run user flow**.
1. For **Application**, select the web application named *testapp1* that you previously registered. The **Reply URL** should show `https://jwt.ms`.
1. Click **Run user flow**

::: zone-end

::: zone pivot="b2c-custom-policy"

## Update and test the relying party file

Update the relying party (RP) file that initiates the user journey that you created.

1. Make a copy of *SignUpOrSignIn.xml* in your working directory, and rename it. For example, rename it to *SignUpSignInMSA.xml*.
1. Open the new file and update the value of the **PolicyId** attribute for **TrustFrameworkPolicy** with a unique value. For example, `SignUpSignInMSA`.
1. Update the value of **PublicPolicyUri** with the URI for the policy. For example,`http://contoso.com/B2C_1A_signup_signin_msa`
1. Update the value of the **ReferenceId** attribute in **DefaultUserJourney** to match the ID of the user journey that you created earlier (SignUpSignInMSA).
1. Save your changes, upload the file, and then select the new policy in the list.
1. Make sure that Azure AD B2C application that you created in the previous section (or by completing the prerequisites, for example *webapp1* or *testapp1*) is selected in the **Select application** field, and then test it by clicking **Run now**.
1. Select the **Microsoft Account** button and sign in.

::: zone-end