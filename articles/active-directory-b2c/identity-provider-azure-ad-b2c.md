---
title: Set up sign-up and sign-in with an Azure AD B2C account from another Azure AD B2C tenant
titleSuffix: Azure AD B2C
description: Provide sign-up and sign-in to customers with Azure AD B2C accounts from another tenant in your applications using Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 01/14/2021
ms.author: mimart
ms.subservice: B2C
ms.custom: fasttrack-edit, project-no-code
zone_pivot_groups: b2c-policy-type
---

# Set up sign-up and sign-in with an Azure AD B2C account from another Azure AD B2C tenant

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]

::: zone pivot="b2c-custom-policy"

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

::: zone-end

## Overview

This article describes how to set up a federation with another Azure AD B2C tenant. When your applications are protected with your Azure AD B2C, this allows users from other Azure AD B2C’s to login with their existing accounts. In the following diagram, users are able to sign-in to an Application protected by *Contoso*’s Azure AD B2C, with an account managed by *Fabrikam*’s Azure AD B2C tenant 

![Azure AD B2C federation with another Azure AD B2C tenant](./media/identity-provider-azure-ad-b2c/azure-ad-b2c-federation.png)


## Prerequisites

[!INCLUDE [active-directory-b2c-customization-prerequisites](../../includes/active-directory-b2c-customization-prerequisites.md)]

## Create an Azure AD B2C application

To use an Azure AD B2C account as an [identity provider](openid-connect.md) in your Azure AD B2C tenant (for example, Contoso), in the other Azure AD B2C (for example, Fabrikam):

1. Create a [user flow](tutorial-create-user-flows.md), or a [custom policy](custom-policy-get-started.md).
1. Then create an application in the Azure AD B2C, as describe in this section. 

To create an application.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Make sure you're using the directory that contains your other Azure AD B2C tenant (for example, Fabrikam.com).
1. In the Azure portal, search for and select **Azure AD B2C**.
1. Select **App registrations**, and then select **New registration**.
1. Enter a **Name** for the application. For example, *ContosoApp*.
1. Under **Supported account types**, select **Accounts in any identity provider or organizational directory (for authenticating users with user flows)**.
1. Under **Redirect URI**, select **Web**, and then enter the following URL in all lowercase letters, where `your-B2C-tenant-name` is replaced with the name of your Azure AD B2C tenant (for example, Contoso).

    ```
    https://your-B2C-tenant-name.b2clogin.com/your-B2C-tenant-name.onmicrosoft.com/oauth2/authresp
    ```

    For example, `https://contoso.b2clogin.com/contoso.onmicrosoft.com/oauth2/authresp`.

1. Under Permissions, select the **Grant admin consent to openid and offline_access permissions** check box.
1. Select **Register**.
1. In the **Azure AD B2C - App registrations** page, select the application you created, for example *ContosoApp*.
1. Record the **Application (client) ID** shown on the application Overview page. You need this when you configure the identity provider in the next section.
1. In the left menu, under **Manage**, select **Certificates & secrets**.
1. Select **New client secret**.
1. Enter a description for the client secret in the **Description** box. For example, *clientsecret1*.
1. Under **Expires**, select a duration for which the secret is valid, and then select **Add**.
1. Record the secret's **Value**. You need this when you configure the identity provider in the next section.


::: zone pivot="b2c-user-flow"

## Configure Azure AD B2C as an identity provider

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Make sure you're using the directory that contains the Azure AD B2C tenant you want to configure the federation (for example, Contoso). Select the **Directory + subscription** filter in the top menu and choose the directory that contains your Azure AD B2C tenant (for example, Contoso).
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
1. Select **Identity providers**, and then select **New OpenID Connect provider**.
1. Enter a **Name**. For example, enter *Fabrikam*.
1. For **Metadata url**, enter the following URL replacing `{tenant}` with the domain name of your Azure AD B2C tenant (for example, Fabrikam). Replace the `{policy}` with the policy name you configure in the other tenant:

    ```
    https://{tenant}.b2clogin.com/{tenant}.onmicrosoft.com/{policy}/v2.0/.well-known/openid-configuration
    ```

    For example, `https://fabrikam.b2clogin.com/fabrikam.onmicrosoft.com/B2C_1_susi/v2.0/.well-known/openid-configuration`.

1. For **Client ID**, enter the application ID that you previously recorded.
1. For **Client secret**, enter the client secret that you previously recorded.
1. For the **Scope**, enter the `openid`.
1. Leave the default values for **Response type**, and **Response mode**.
1. (Optional) For the **Domain hint**, enter the domain name you want to use for the [direct sign-in](direct-signin.md#redirect-sign-in-to-a-social-provider). For example, *fabrikam.com*.
1. Under **Identity provider claims mapping**, select the following claims:

    - **User ID**: *sub*
    - **Display name**: *name*
    - **Given name**: *given_name*
    - **Surname**: *family_name*
    - **Email**: *email*

1. Select **Save**.

::: zone-end

::: zone pivot="b2c-custom-policy"

## Create a policy key

You need to store the application key that you created earlier in your Azure AD B2C tenant.

1. Make sure you're using the directory that contains the Azure AD B2C tenant you want to configure the federation (for example, Contoso). Select the **Directory + subscription** filter in the top menu and choose the directory that contains your Azure AD B2C tenant (for example, Contoso).
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
1. Under **Policies**, select **Identity Experience Framework**.
1. Select **Policy keys** and then select **Add**.
1. For **Options**, choose `Manual`.
1. Enter a **Name** for the policy key. For example, `FabrikamAppSecret`.  The prefix `B2C_1A_` is added automatically to the name of your key when it's created, so its reference in the XML in following section is to *B2C_1A_FabrikamAppSecret*.
1. In **Secret**, enter your client secret that you recorded earlier.
1. For **Key usage**, select `Signature`.
1. Select **Create**.

## Add a claims provider

If you want users to sign in by using the other Azure AD B2C (Fabrikam), you need to define the other Azure AD B2C as a claims provider that Azure AD B2C can communicate with through an endpoint. The endpoint provides a set of claims that are used by Azure AD B2C to verify that a specific user has authenticated.

You can define Azure AD B2C as a claims provider by adding Azure AD B2C to the **ClaimsProvider** element in the extension file of your policy.

1. Open the *TrustFrameworkExtensions.xml* file.
1. Find the **ClaimsProviders** element. If it does not exist, add it under the root element.
1. Add a new **ClaimsProvider** as follows:
    ```xml
    <ClaimsProvider>
      <Domain>fabrikam.com</Domain>
      <DisplayName>Federation with Fabrikam tenant</DisplayName>
      <TechnicalProfiles>
        <TechnicalProfile Id="Fabrikam-OpenIdConnect">
        <DisplayName>Fabrikam</DisplayName>
        <Protocol Name="OpenIdConnect"/>
        <Metadata>
          <!-- Update the Client ID below to the Application ID -->
          <Item Key="client_id">00000000-0000-0000-0000-000000000000</Item>
          <!-- Update the metadata URL with the other Azure AD B2C tenant name and policy name -->
          <Item Key="METADATA">https://{tenant}.b2clogin.com/{tenant}.onmicrosoft.com/{policy}/v2.0/.well-known/openid-configuration</Item>
          <Item Key="UsePolicyInRedirectUri">false</Item>
          <Item Key="response_types">code</Item>
          <Item Key="scope">openid</Item>
          <Item Key="response_mode">form_post</Item>
          <Item Key="HttpBinding">POST</Item>
        </Metadata>
        <CryptographicKeys>
          <Key Id="client_secret" StorageReferenceId="B2C_1A_FabrikamAppSecret"/>
        </CryptographicKeys>
        <OutputClaims>
          <OutputClaim ClaimTypeReferenceId="issuerUserId" PartnerClaimType="sub" />
          <OutputClaim ClaimTypeReferenceId="givenName" PartnerClaimType="given_name" />
          <OutputClaim ClaimTypeReferenceId="surname" PartnerClaimType="family_name" />
          <OutputClaim ClaimTypeReferenceId="displayName" PartnerClaimType="name" />
          <OutputClaim ClaimTypeReferenceId="email" PartnerClaimType="email" />
          <OutputClaim ClaimTypeReferenceId="identityProvider" PartnerClaimType="iss"  />
          <OutputClaim ClaimTypeReferenceId="authenticationSource" DefaultValue="socialIdpAuthentication" AlwaysUseDefaultValue="true" />
          <OutputClaim ClaimTypeReferenceId="otherMails" PartnerClaimType="emails"/>    
        </OutputClaims>
        <OutputClaimsTransformations>
          <OutputClaimsTransformation ReferenceId="CreateRandomUPNUserName" />
          <OutputClaimsTransformation ReferenceId="CreateUserPrincipalName" />
          <OutputClaimsTransformation ReferenceId="CreateAlternativeSecurityId" />
        </OutputClaimsTransformations>
        <UseTechnicalProfileForSessionManagement ReferenceId="SM-SocialLogin"/>
      </TechnicalProfile>
     </TechnicalProfiles>
    </ClaimsProvider>
    ```

1. Update the following XML elements with the relevant value:

    |XML element  |Value  |
    |---------|---------|
    |ClaimsProvider\Domain  | The domain name that is used for [direct sign-in](direct-signin.md?pivots=b2c-custom-policy#redirect-sign-in-to-a-social-provider). Enter the domain name you want to use in the direct sign-in. For example, *fabrikam.com*. |
    |TechnicalProfile\DisplayName|This value will be displayed on the sign-in button on your sign-in screen. For example, *Fabrikam*. |
    |Metadata\client_id|The application identifier of the identity provider. Update the Client ID with the Application ID you created earlier in the other Azure AD B2C tenant.|
    |Metadata\METADATA|A URL that points to an OpenID Connect identity provider configuration document, which is also known as OpenID well-known configuration endpoint. Enter the following URL replacing `{tenant}` with the domain name of the other Azure AD B2C tenant (Fabrikam). Replace the `{tenant}` with the policy name you configure in the other tenant, and `{policy]` with the policy name: `https://{tenant}.b2clogin.com/{tenant}.onmicrosoft.com/{policy}/v2.0/.well-known/openid-configuration`. For example, `https://fabrikam.b2clogin.com/fabrikam.onmicrosoft.com/B2C_1_susi/v2.0/.well-known/openid-configuration`.|
    |CryptographicKeys| Update the value of **StorageReferenceId** to the name of the policy key that you created earlier. For example, `B2C_1A_FabrikamAppSecret`.| 
    

### Upload the extension file for verification

By now, you have configured your policy so that Azure AD B2C knows how to communicate with the other Azure AD B2C tenant. Try uploading the extension file of your policy just to confirm that it doesn't have any issues so far.

1. On the **Custom Policies** page in your Azure AD B2C tenant, select **Upload Policy**.
1. Enable **Overwrite the policy if it exists**, and then browse to and select the *TrustFrameworkExtensions.xml* file.
1. Click **Upload**.

## Register the claims provider

At this point, the identity provider has been set up, but it's not yet available in any of the sign-up/sign-in pages. To make it available, create a duplicate of an existing template user journey, and then modify it so that it also has the Azure AD identity provider:

1. Open the *TrustFrameworkBase.xml* file from the starter pack.
1. Find and copy the entire contents of the **UserJourney** element that includes `Id="SignUpOrSignIn"`.
1. Open the *TrustFrameworkExtensions.xml* and find the **UserJourneys** element. If the element doesn't exist, add one.
1. Paste the entire content of the **UserJourney** element that you copied as a child of the **UserJourneys** element.
1. Rename the ID of the user journey. For example, `SignUpSignInFabrikam`.

### Display the button

The **ClaimsProviderSelection** element is analogous to an identity provider button on a sign-up/sign-in page. If you add a **ClaimsProviderSelection** element for Azure AD B2C, a new button shows up when a user lands on the page.

1. Find the **OrchestrationStep** element that includes `Order="1"` in the user journey that you created in *TrustFrameworkExtensions.xml*.
1. Under **ClaimsProviderSelections**, add the following element. Set the value of **TargetClaimsExchangeId** to an appropriate value, for example `FabrikamExchange`:

    ```xml
    <ClaimsProviderSelection TargetClaimsExchangeId="FabrikamExchange" />
    ```

### Link the button to an action

Now that you have a button in place, you need to link it to an action. The action, in this case, is for Azure AD B2C to communicate with the other Azure AD B2C to receive a token. Link the button to an action by linking the technical profile for the Azure AD B2C claims provider:

1. Find the **OrchestrationStep** that includes `Order="2"` in the user journey.
1. Add the following **ClaimsExchange** element making sure that you use the same value for **Id** that you used for **TargetClaimsExchangeId**:

    ```xml
    <ClaimsExchange Id="FabrikamExchange" TechnicalProfileReferenceId="Fabrikam-OpenIdConnect" />
    ```

    Update the value of **TechnicalProfileReferenceId** to the **Id** of the technical profile you created earlier. For example, `Fabrikam-OpenIdConnect`.

1. Save the *TrustFrameworkExtensions.xml* file and upload it again for verification.

::: zone-end

::: zone pivot="b2c-user-flow"

## Add Azure AD B2C identity provider to a user flow 

1. In your Azure AD B2C tenant, select **User flows**.
1. Click the user flow that you want to add the Azure AD B2C identity provider.
1. Under the **Social identity providers**, select **Fabrikam**.
1. Select **Save**.
1. To test your policy, select **Run user flow**.
1. For **Application**, select the web application named *testapp1* that you previously registered. The **Reply URL** should show `https://jwt.ms`.
1. Click **Run user flow**
1. From the sign-up or sign-in page, select *Fabrikam* to sign in with the other Azure AD B2C tenant.

::: zone-end

::: zone pivot="b2c-custom-policy"


## Update and test the relying party file

Update the relying party (RP) file that initiates the user journey that you created.

1. Make a copy of *SignUpOrSignIn.xml* in your working directory, and rename it. For example, rename it to *SignUpSignInFabrikam.xml*.
1. Open the new file and update the value of the **PolicyId** attribute for **TrustFrameworkPolicy** with a unique value. For example, `SignUpSignInFabrikam`.
1. Update the value of **PublicPolicyUri** with the URI for the policy. For example, `http://contoso.com/B2C_1A_signup_signin_fabrikam`.
1. Update the value of the **ReferenceId** attribute in **DefaultUserJourney** to match the ID of the user journey that you created earlier. For example, *SignUpSignInFabrikam*.
1. Save your changes and upload the file.
1. Under **Custom policies**, select the new policy in the list.
1. In the **Select application** drop-down, select the Azure AD B2C application that you created earlier. For example, *testapp1*.
1. Select **Run now** 
1. From the sign-up or sign-in page, select *Fabrikam* to sign in with the other Azure AD B2C tenant.

::: zone-end

## Next steps

Learn how to [pass the other Azure AD B2C token to your application](idp-pass-through-user-flow.md).
