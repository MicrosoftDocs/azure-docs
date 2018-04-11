---
title: 'Add a multi-tenant Azure AD identity provider using custom policies - Azure Active Directory B2C | Microsoft Docs'
description: Add a multi-tenant Azure AD identity provider using custom policies - Azure Active Directory B2C
services: active-directory-b2c
documentationcenter: ''
author: parakhj
manager: alexsi
editor: parakhj

ms.assetid: 33c64001-5261-4ed9-8f46-b09839165250
ms.service: active-directory-b2c
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: article
ms.devlang: na
ms.date: 04/14/2018
ms.author: parakhj

---
# Azure Active Directory B2C: Allow users to sign into a multi-tenant Azure AD identity provider using custom policies

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

This article shows you how to enable sign-in for users using the common endpoint for Azure Active Directory (Azure AD) through the use of [custom policies](active-directory-b2c-overview-custom.md).

>[!NOTE]
> We use "contoso.com" for the organizational Azure AD tenant and "fabrikamb2c.onmicrosoft.com" as the Azure AD B2C tenant in the following instructions.

## Prerequisites

Complete the steps in the [Getting started with custom policies](active-directory-b2c-get-started-custom.md) article.

## Step 1. Create a multi-tenant Azure AD app

To enable sign-in for users using the multi-tenant Azure AD endpoint, you need to have a multi-tenant application registered in any of your Azure AD tenants. In this article, we will show you how to create a multi-tenant Azure AD application in your Azure AD B2C tenant. Then enable sign-in for users through the use of that multi-tenant Azure AD application.

>[!NOTE]
> If you would like Azure AD users **and users with Microsoft accounts** to sign in, skip this section and instead register an application in the [Microsoft developer portal](https://apps.dev.microsoft.com).


1. Sign in to the [Azure portal](https://portal.azure.com).
1. On the top bar, select your account. From the **Directory** list, choose the Azure AD B2C tenant where you want to register Azure AD application (fabrikamb2c.onmicrosoft.com).
1. Select **More services** in the left pane, and search for "App registrations."
1. Select **New application registration**.
1. Enter a name for your application (for example, `Azure AD B2C App`).
1. Select **Web app / API** for the application type.
1. For **Sign-on URL**, enter the following URL, where `yourtenant` is replaced by the name of your Azure AD B2C tenant (`fabrikamb2c.onmicrosoft.com`):

    >[!NOTE]
    >The value for "yourtenant" must be all lowercase in the **Sign-on URL**.

    ```
    https://login.microsoftonline.com/te/yourtenant.onmicrosoft.com/oauth2/authresp
    ```

1. Save the application ID.
1. Select the newly created application.
1. Under the **Settings** blade, select **Properties**.
1. Set **Multi-tenanted** to **Yes**.
1. Under the **Settings** blade, select **Keys**.
1. Create a new key, and save it. You will use it in the steps in the next section.

## Step 2. Add the Azure AD key to Azure AD B2C

You need to register the application key in the Azure AD B2C settings. To do this:

1. Go to the settings menu for Azure AD B2C
1. Click on **Identity Experience Framework** > **Policy Keys**.
1. Select **+Add**.
1. Select or enter these options:
   * Select **Manual**.
   * For **Name**, choose a name that matches your Azure AD tenant name (for example, `AADAppSecret`).  The prefix `B2C_1A_` is added automatically to the name of your key.
   * Paste your application key in the **Secret** box.
   * Select **Signature**.
5. Select **Create**.
6. Confirm that you've created the key `B2C_1A_AADAppSecret`.

## Step 3. Add a claims provider in your base policy

If you want users to sign in by using Azure AD, you need to define Azure AD as a claims provider. In other words, you need to specify an endpoint that Azure AD B2C will communicate with. The endpoint will provide a set of claims that are used by Azure AD B2C to verify that a specific user has authenticated. 

You can define Azure AD as a claims provider by adding Azure AD to the `<ClaimsProvider>` node in the extension file of your policy:

1. Open the extension file (TrustFrameworkExtensions.xml) from your working directory.
1. Find the `<ClaimsProviders>` section. If it does not exist, add it under the root node.
1. Add a new `<ClaimsProvider>` node as follows:

```XML
    <ClaimsProvider>
    <Domain>commonaad</Domain>
    <DisplayName>Common AAD</DisplayName>
    <TechnicalProfiles>
    <TechnicalProfile Id="Common-AAD">
        <DisplayName>Multi-Tenant AAD</DisplayName>
        <Protocol Name="OpenIdConnect" />
        <Metadata>
        <!-- Update the client ID below to Application ID -->
        <Item Key="client_id">00000000-0000-0000-0000-000000000000</Item>
        <Item Key="UsePolicyInRedirectUri">0</Item>
        <Item Key="METADATA">https://login.microsoftonline.com/common/.well-known/openid-configuration</Item>
        <Item Key="response_types">code</Item>
        <Item Key="scope">openid</Item>
        <Item Key="response_mode">form_post</Item>
        <Item Key="HttpBinding">POST</Item>
        <Item Key="DiscoverMetadataByTokenIssuer">true</Item>
        
        <!-- The key below specifies that users from any tenant can sign-in.
        The key also allows you to specify each of the Azure AD tenants that can be used to sign in.
        https://sts.windows.net/00000000-0000-0000-0000-000000000000,https://sts.windows.net/11111111-1111-1111-1111-111111111111 -->
        <Item Key="ValidTokenIssuerPrefixes">https://sts.windows.net/</Item>
        </Metadata>
        <CryptographicKeys>
        <!-- Make sure to update the reference ID of the client secret below you just created (B2C_1A_AADAppSecret) -->
        <Key Id="client_secret" StorageReferenceId="B2C_1A_AADAppSecret" />
        </CryptographicKeys>
        <OutputClaims>
        <OutputClaim ClaimTypeReferenceId="authenticationSource" DefaultValue="socialIdpAuthentication" />
        <OutputClaim ClaimTypeReferenceId="identityProvider" PartnerClaimType="iss" />
        <OutputClaim ClaimTypeReferenceId="socialIdpUserId" PartnerClaimType="sub" />
        <OutputClaim ClaimTypeReferenceId="displayName" PartnerClaimType="name" />
        <OutputClaim ClaimTypeReferenceId="givenName" PartnerClaimType="given_name" />
        <OutputClaim ClaimTypeReferenceId="surName" PartnerClaimType="family_name" />
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

1. Under the `<ClaimsProvider>` node, update the value for `<Domain>` to a unique value that can be used to distinguish it from other identity providers.
1. Under the `<TechnicalProfile>` node, update the value for `<DisplayName>`. This value will be displayed on the sign-in button on your sign-in screen.
1. Update the value for `<Description>`.
1. Set `<Item Key="client_id">` to the application ID from the Azure AD mulity-tenant app registration.

### Step 3.1 [Optional] Restrict access to specific list of Azure AD tenants
You may want to update the list of valid token issuers and restrict access to specific list of Azure AD tenants users can sign-in. To obtain the values, you will need to look at the metadata for each of the specific Azure AD tenants that you would like to have users sign in from. The format of the data looks like the following: `https://login.windows.net/yourAzureADtenant/.well-known/openid-configuration`, where `yourAzureADtenant` is your Azure AD tenant name (contoso.com or any other Azure AD tenant).
1. Open your browser and go to the metadata URL.
1. In the browser, look for the 'issuer' object and copy its value. It should look like the following: `https://sts.windows.net/{tenantId}/`.
1. Paste the value for the `ValidTokenIssuerPrefixes` key. You can add multiple by separating them using a comma. 

> [!NOTE]
> Using `https://sts.windows.net` as a prefix value will allow ALL Azure AD users to sign into your app.

## Step 4. Register the Azure AD account claims provider

### Step 4.1 Make a copy of the user journey

You now need to add the Azure AD identity provider to one of your user journeys. At this point, the identity provider has been set up, but it’s not available in any of the sign-up/sign-in screens. 

> [!NOTE] if you already copied the <UserJourneys> element from the base file of your policy to the TrustFrameworkExtensions.xml extension file, you can skip this section.

To make it available, we will create a duplicate of an existing template user journey, and then modify it so that it also has the Azure AD identity provider:

1. Open the base file of your policy (for example, TrustFrameworkBase.xml).
1. Find the `<UserJourneys>` element and **cut** the entire `<UserJourney>` node that includes `Id="SignUpOrSignIn"`.
1. Open the extension file (for example, TrustFrameworkExtensions.xml) and find the `<UserJourneys>` element. If the element doesn't exist, add one.
1. Paste the entire `<UserJourney>` node that you copied as a child of the `<UserJourneys>` element.


### Step 4.2 Display the "button"

The `<ClaimsProviderSelection>` element is analogous to an identity provider button on a sign-up/sign-in screen. If you add a `<ClaimsProviderSelection>` element for Azure AD, a new button shows up when a user lands on the page. To add this element:

1. Find the `<OrchestrationStep>` node that includes `Order="1"` in the user journey that you created.
1. Add the following:

    ```XML
    <ClaimsProviderSelection TargetClaimsExchangeId="AzureADExchange" />
    ```

1. Set `TargetClaimsExchangeId` to an appropriate value. We recommend following the same convention as others: *\[ClaimProviderName\]Exchange*.

### Step 4.3 Link the button to an action

Now that you have a button in place, you need to link it to an action. The action, in this case, is for Azure AD B2C to communicate with Azure AD to receive a token. Link the button to an action by linking the technical profile for your Azure AD claims provider:

1. Find the `<OrchestrationStep>` that includes `Order="2"` in the `<UserJourney>` node.
1. Add the following:

    ```XML
    <ClaimsExchange Id="AzureADExchange" TechnicalProfileReferenceId="Common-AAD" />
    ```

1. Update `Id` to the same value as that of `TargetClaimsExchangeId` in the preceding section.
1. Update `TechnicalProfileReferenceId` to the ID of the technical profile you created earlier (Common-AAD).

## Step 5: Upload the policy to your tenant
1. In the [Azure portal](https://portal.azure.com), switch to the [context of your Azure AD B2C tenant](active-directory-b2c-navigate-to-b2c-context.md), and then select **Azure AD B2C**.

2. Select **Identity Experience Framework**.

3. Select **All Policies**.

4. Select **Upload Policy**.

5. Select the **Overwrite the policy if it exists** check box.

6. Upload the *TrustFrameworkBase.xml* and *TrustFrameworkExtensions.xml* files, and ensure that they pass validation.

## Step 6: Test the custom policy by using Run Now
1. Select **Azure AD B2C Settings**, and then select **Identity Experience Framework**.

    >[!NOTE]
    >Run Now requires at least one application to be preregistered on the tenant. To learn how to register applications, see the Azure AD B2C [Get started](active-directory-b2c-get-started.md) article or the [Application registration](active-directory-b2c-app-registration.md) article.

1. Open **B2C_1A_signup_signin**, the relying party (RP) custom policy that you uploaded, and then select **Run now**.

1. You should now be able to sign in by using the Azure AD account.

## Step 7: (Optional) Register the Azure AD account claims provider to the Profile-Edit user journey
You might also want to add the Azure AD account identity provider to your `ProfileEdit` user journey. To make the user journey available, repeat "Step 4." This time, select the `<UserJourney>` node that contains `Id="ProfileEdit"`. Save, upload, and test your policy.



## Troubleshooting
To diagnose problems, read about [troubleshooting](active-directory-b2c-troubleshoot-custom.md).

## Next steps

Provide feedback to [AADB2CPreview@microsoft.com](mailto:AADB2CPreview@microsoft.com).
