---
title: Set up sign-in for a multi-tenant Azure AD identity provider using custom policies in Azure Active Directory B2C | Microsoft Docs
description: Add a multi-tenant Azure AD identity provider using custom policies - Azure Active Directory B2C.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 09/20/2018
ms.author: davidmu
ms.component: B2C
---

# Set up sign-in for multi-tenant Azure Active Directory using custom policies in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

This article shows you how to enable sign-in for users using the multi-tenant endpoint for Azure Active Directory (Azure AD) by using [custom policies](active-directory-b2c-overview-custom.md) in Azure AD B2c. This allows users from multiple Azure AD tenants to sign into Azure AD B2C without configuring a technical provider for each tenant. However, guest members in any of these tenants **will not** be able to sign in. For that, you need to [individually configure each tenant](active-directory-b2c-setup-aad-custom.md).

>[!NOTE]
>`Contoso.com` is used for the organizational Azure AD tenant and `fabrikamb2c.onmicrosoft.com` is used as the Azure AD B2C tenant in the following instructions.

## Prerequisites

Complete the steps in [Get started with custom policies in Azure Active Directory B2C](active-directory-b2c-get-started-custom.md).

## Register an application

To enable sign-in for users from a specific Azure AD organization, you need to register an application within the organizational Azure AD tenant.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Make sure you're using the directory that contains organizational Azure AD tenant (contoso.com) by clicking the **Directory and subscription filter** in the top menu and choosing the directory that contains your tenant.
3. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **App registrations**.
4. Select **New application registration**.
5. Enter a name for your application. For example, `Azure AD B2C App`.
6. For the **Application type**, select `Web app / API`.
7. For the **Sign-on URL**, enter the following URL in all lowercase letters, where `your-tenant` is replaced with the name of your Azure AD B2C tenant (fabrikamb2c.onmicrosoft.com):

    ```
    https://yourtenant.b2clogin.com/your-tenant.onmicrosoft.com/oauth2/authresp
    ```
    
8. Click **Create**. Copy the **Application ID** to be used later.
9. Select the application, and then select **Settings**.
10. Select **Keys**, enter the key description, select a duration, and then click **Save**. Copy the value of the key that is displayed to be used later.
11. Under **Settings**, select **Properties**, set **Multi-tenanted** to `Yes`, and then click **Save**

## Create a policy key

You need to store the application key that you created in your Azure AD B2C tenant.

1. Make sure you're using the directory that contains your Azure AD B2C tenant by clicking the **Directory and subscription filter** in the top menu and choosing the directory that contains your tenant.
2. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
3. On the Overview page, select **Identity Experience Framework - PREVIEW**.
4. Select **Policy Keys** and then select **Add**.
5. For **Options**, choose `Manual`.
6. Enter a **Name** for the policy key. For example, `ContosoAppSecret`.  The prefix `B2C_1A_` is added automatically to the name of your key.
7. In **Secret**, enter your application key that you previously recorded.
8. For **Key usage**, select `Signature`.
9. Click **Create**.

## Add a claims provider

If you want users to sign in by using Azure AD, you need to define Azure AD as a claims provider that Azure AD B2C can communicate with through an endpoint. The endpoint provides a set of claims that are used by Azure AD B2C to verify that a specific user has authenticated. 

You can define Azure AD as a claims provider by adding Azure AD to the **ClaimsProvider** element in the extension file of your policy.

1. Open the *TrustFrameworkExtensions.xml*.
2. Find the **ClaimsProviders** element. If it does not exist, add it under the root element.
3. Add a new **ClaimsProvider** as follows:

    ```XML
    <ClaimsProvider>
      <Domain>commonaad</Domain>
      <DisplayName>Common AAD</DisplayName>
      <TechnicalProfiles>
        <TechnicalProfile Id="Common-AAD">
          <DisplayName>Multi-Tenant AAD</DisplayName>
          <Protocol Name="OpenIdConnect" />
          <Metadata>
            <!-- Update the Client ID below to the Application ID -->
            <Item Key="client_id">00000000-0000-0000-0000-000000000000</Item>
            <Item Key="UsePolicyInRedirectUri">0</Item>
            <Item Key="METADATA">https://login.microsoftonline.com/common/.well-known/openid-configuration</Item>
            <Item Key="response_types">code</Item>
            <Item Key="scope">openid</Item>
            <Item Key="response_mode">form_post</Item>
            <Item Key="HttpBinding">POST</Item>
            <Item Key="DiscoverMetadataByTokenIssuer">true</Item>
        
            <!-- The key below allows you to specify each of the Azure AD tenants that can be used to sign in. Update the GUIDs below for each tenant. -->
            <Item Key="ValidTokenIssuerPrefixes">https://sts.windows.net/00000000-0000-0000-0000-000000000000,https://sts.windows.net/11111111-1111-1111-1111-111111111111</Item>

            <!-- The commented key below specifies that users from any tenant can sign-in. Uncomment if you would like anyone with an Azure AD account to be able to sign in. -->
            <!-- <Item Key="ValidTokenIssuerPrefixes">https://sts.windows.net/</Item> -->
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

4. Under the **ClaimsProvider** element, update the value for **Domain** to a unique value that can be used to distinguish it from other identity providers.
5. Under the **TechnicalProfile** element, update the value for **DisplayName**. This value is displayed on the sign-in button on your sign-in screen.
6. Set **client_id** to the application ID from the Azure AD mulity-tenant app registration.

### Restrict access

> [!NOTE]
> Using `https://sts.windows.net` as the value for **ValidTokenIssuerPrefixes** allows all Azure AD users to sign in to your application.

You need to update the list of valid token issuers and restrict access to a specific list of Azure AD tenant users who can sign in. To obtain the values, you need to look at the metadata for each of the specific Azure AD tenants that you would like to have users sign in from. The format of the data looks like the following: `https://login.windows.net/your-tenant/.well-known/openid-configuration`, where `your-tenant` is your Azure AD tenant name (contoso.com or any other Azure AD tenant).

1. Open your browser and go to the **METADATA** URL and look for the **issuer** object and copy its value. It should look like the following: `https://sts.windows.net/tenant-id/`.
2. Copy and paste the value for the **ValidTokenIssuerPrefixes** key. You can add multiple by separating them using a comma. An example of this is commented in the sample XML above.

### Upload the extension file for verification

By now, you have configured your policy so that Azure AD B2C knows how to communicate with your Azure AD directory. Try uploading the extension file of your policy just to confirm that it doesn't have any issues so far.

1. On the **Custom Policies** page in your Azure AD B2C tenant, select **Upload Policy**.
2. Enable **Overwrite the policy if it exists**, and then browse to and select the *TrustFrameworkExtensions.xml* file.
3. Click **Upload**.

## Register the claims provider

At this point, the identity provider has been set up, but it’s not available in any of the sign-up/sign-in screens. To make it available, you create a duplicate of an existing template user journey, and then modify it so that it also has the Azure AD identity provider.

1. Open the *TrustFrameworkBase.xml* file from the starter pack.
2. Find and copy the entire contents of the **UserJourney** element that includes `Id="SignUpOrSignIn"`.
3. Open the *TrustFrameworkExtensions.xml* and find the **UserJourneys** element. If the element doesn't exist, add one.
4. Paste the entire content of the **UserJourney** element that you copied as a child of the **UserJourneys** element.
5. Rename the ID of the user journey. For example, `SignUpSignInContoso`.

### Display the button

The **ClaimsProviderSelection** element is analogous to an identity provider button on a sign-up/sign-in screen. If you add a **ClaimsProviderSelection** element for Azure AD, a new button shows up when a user lands on the page.

1. Find the **OrchestrationStep** element that includes `Order="1"` in the user journey that you created.
2. Under **ClaimsProviderSelects**, add the following element. Set the value of **TargetClaimsExchangeId** to an appropriate value, for example `AzureADExchange`:

    ```XML
    <ClaimsProviderSelection TargetClaimsExchangeId="AzureADExchange" />
    ```

### Link the button to an action

Now that you have a button in place, you need to link it to an action. The action, in this case, is for Azure AD B2C to communicate with Azure AD to receive a token. Link the button to an action by linking the technical profile for your Azure AD claims provider.

1. Find the **OrchestrationStep** that includes `Order="2"` in the user journey.
2. Add the following **ClaimsExchange** element making sure that you use the same value for **Id** that you used for **TargetClaimsExchangeId**:

    ```XML
    <ClaimsExchange Id="AzureADExchange" TechnicalProfileReferenceId="Common-AAD" />
    ```
    
    Update the value of **TechnicalProfileReferenceId** to the **Id** of the technical profile you created earlier. For example, `Common-AAD`.

3. Save the *TrustFrameworkExtensions.xml* file and upload it again for verification.

## Create an Azure AD B2C application

Communication with Azure AD B2c occurs through an application that you create in your tenant. This section lists optional steps you can complete to create a test application if you haven't already done so.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Make sure you're using the directory that contains your Azure AD B2C tenant by clicking the **Directory and subscription filter** in the top menu and choosing the directory that contains your tenant.
3. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
4. Select **Applications**, and then select **Add**.
5. Enter a name for the application, for example *testapp1*.
6. For **Web App / Web API**, select `Yes`, and then enter `https://jwt.ms` for the **Reply URL**.
7. Click **Create**.

## Update and test the relying party file

Update the relying party (RP) file that initiates the user journey that you created.

1. Make a copy of *SignUpOrSignIn.xml* in your working directory, and rename it. For example, rename it to *SignUpSignContoso.xml*.
2. Open the new file and update the value of the **PolicyId** attribute for **TrustFrameworkPolicy** with a unique value. For example, `SignUpSignInContoso`.
3. Update the value of **PublicPolicyUri** with the URI for the policy. For example,`http://contoso.com/B2C_1A_signup_signin_contoso`
4. Update the value of the **ReferenceId** attribute in **DefaultUserJourney** to match the ID of the new user journey that you created (SignUpSignContoso).
5. Save your changes, upload the file, and then select the new policy in the list.
6. Make sure that Azure AD B2C application that you created is selected in the **Select application** field, and then test it by clicking **Run now**.
