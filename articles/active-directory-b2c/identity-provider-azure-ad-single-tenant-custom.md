---
title: Set up sign-in with an Azure AD account by using custom policies
titleSuffix: Azure AD B2C
description: Set up sign in with an Azure Active Directory account in Azure Active Directory B2C using custom policies.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 04/20/2020
ms.author: mimart
ms.subservice: B2C
---

# Set up sign-in with an Azure Active Directory account using custom policies in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

This article shows you how to enable sign-in for users from an Azure Active Directory (Azure AD) organization by using [custom policies](custom-policy-overview.md) in Azure Active Directory B2C (Azure AD B2C).

## Prerequisites

Complete the steps in [Get started with custom policies in Azure Active Directory B2C](custom-policy-get-started.md).


[!INCLUDE [active-directory-b2c-identity-provider-azure-ad](../../includes/active-directory-b2c-identity-provider-azure-ad.md)]

## Create a policy key

You need to store the application key that you created in your Azure AD B2C tenant.

1. Make sure you're using the directory that contains your Azure AD B2C tenant. Select the **Directory + subscription filter** in the top menu, and then choose the directory that contains your Azure AD B2C tenant.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
1. Under **Policies**, select **Identity Experience Framework**.
1. Select **Policy keys** and then select **Add**.
1. For **Options**, choose `Manual`.
1. Enter a **Name** for the policy key. For example, `ContosoAppSecret`.  The prefix `B2C_1A_` is added automatically to the name of your key when it's created, so its reference in the XML in following section is to *B2C_1A_ContosoAppSecret*.
1. In **Secret**, enter your client secret that you recorded earlier.
1. For **Key usage**, select `Signature`.
1. Select **Create**.

## Add a claims provider

If you want users to sign in by using Azure AD, you need to define Azure AD as a claims provider that Azure AD B2C can communicate with through an endpoint. The endpoint provides a set of claims that are used by Azure AD B2C to verify that a specific user has authenticated.

You can define Azure AD as a claims provider by adding Azure AD to the **ClaimsProvider** element in the extension file of your policy.

1. Open the *TrustFrameworkExtensions.xml* file.
2. Find the **ClaimsProviders** element. If it does not exist, add it under the root element.
3. Add a new **ClaimsProvider** as follows:
    ```xml
    <ClaimsProvider>
      <Domain>Contoso</Domain>
      <DisplayName>Login using Contoso</DisplayName>
      <TechnicalProfiles>
        <TechnicalProfile Id="OIDC-Contoso">
          <DisplayName>Contoso Employee</DisplayName>
          <Description>Login with your Contoso account</Description>
          <Protocol Name="OpenIdConnect"/>
          <Metadata>
            <Item Key="METADATA">https://login.microsoftonline.com/tenant-name.onmicrosoft.com/v2.0/.well-known/openid-configuration</Item>
            <Item Key="client_id">00000000-0000-0000-0000-000000000000</Item>
            <Item Key="response_types">code</Item>
            <Item Key="scope">openid profile</Item>
            <Item Key="response_mode">form_post</Item>
            <Item Key="HttpBinding">POST</Item>
            <Item Key="UsePolicyInRedirectUri">false</Item>
          </Metadata>
          <CryptographicKeys>
            <Key Id="client_secret" StorageReferenceId="B2C_1A_ContosoAppSecret"/>
          </CryptographicKeys>
          <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="issuerUserId" PartnerClaimType="oid"/>
            <OutputClaim ClaimTypeReferenceId="tenantId" PartnerClaimType="tid"/>
            <OutputClaim ClaimTypeReferenceId="givenName" PartnerClaimType="given_name" />
            <OutputClaim ClaimTypeReferenceId="surName" PartnerClaimType="family_name" />
            <OutputClaim ClaimTypeReferenceId="displayName" PartnerClaimType="name" />
            <OutputClaim ClaimTypeReferenceId="authenticationSource" DefaultValue="socialIdpAuthentication" AlwaysUseDefaultValue="true" />
            <OutputClaim ClaimTypeReferenceId="identityProvider" PartnerClaimType="iss" />
          </OutputClaims>
          <OutputClaimsTransformations>
            <OutputClaimsTransformation ReferenceId="CreateRandomUPNUserName"/>
            <OutputClaimsTransformation ReferenceId="CreateUserPrincipalName"/>
            <OutputClaimsTransformation ReferenceId="CreateAlternativeSecurityId"/>
            <OutputClaimsTransformation ReferenceId="CreateSubjectClaimFromAlternativeSecurityId"/>
          </OutputClaimsTransformations>
          <UseTechnicalProfileForSessionManagement ReferenceId="SM-SocialLogin"/>
        </TechnicalProfile>
      </TechnicalProfiles>
    </ClaimsProvider>
    ```

4. Under the **ClaimsProvider** element, update the value for **Domain** to a unique value that can be used to distinguish it from other identity providers. For example `Contoso`. You don't put a `.com` at the end of this domain setting.
5. Under the **ClaimsProvider** element, update the value for **DisplayName** to a friendly name for the claims provider. This value is not currently used.

### Update the technical profile

To get a token from the Azure AD endpoint, you need to define the protocols that Azure AD B2C should use to communicate with Azure AD. This is done inside the **TechnicalProfile** element of  **ClaimsProvider**.

1. Update the ID of the **TechnicalProfile** element. This ID is used to refer to this technical profile from other parts of the policy, for example `OIDC-Contoso`.
1. Update the value for **DisplayName**. This value will be displayed on the sign-in button on your sign-in screen.
1. Update the value for **Description**.
1. Azure AD uses the OpenID Connect protocol, so make sure that the value for **Protocol** is `OpenIdConnect`.
1. Set value of the **METADATA** to `https://login.microsoftonline.com/tenant-name.onmicrosoft.com/v2.0/.well-known/openid-configuration`, where `tenant-name` is your Azure AD tenant name. For example, `https://login.microsoftonline.com/contoso.onmicrosoft.com/v2.0/.well-known/openid-configuration`
1. Set **client_id** to the application ID from the application registration.
1. Under **CryptographicKeys**, update the value of **StorageReferenceId** to the name of the policy key that you created earlier. For example, `B2C_1A_ContosoAppSecret`.

### Upload the extension file for verification

By now, you have configured your policy so that Azure AD B2C knows how to communicate with your Azure AD directory. Try uploading the extension file of your policy just to confirm that it doesn't have any issues so far.

1. On the **Custom Policies** page in your Azure AD B2C tenant, select **Upload Policy**.
1. Enable **Overwrite the policy if it exists**, and then browse to and select the *TrustFrameworkExtensions.xml* file.
1. Click **Upload**.

## Register the claims provider

At this point, the identity provider has been set up, but it's not yet available in any of the sign-up/sign-in pages. To make it available, create a duplicate of an existing template user journey, and then modify it so that it also has the Azure AD identity provider:

1. Open the *TrustFrameworkBase.xml* file from the starter pack.
1. Find and copy the entire contents of the **UserJourney** element that includes `Id="SignUpOrSignIn"`.
1. Open the *TrustFrameworkExtensions.xml* and find the **UserJourneys** element. If the element doesn't exist, add one.
1. Paste the entire content of the **UserJourney** element that you copied as a child of the **UserJourneys** element.
1. Rename the ID of the user journey. For example, `SignUpSignInContoso`.

### Display the button

The **ClaimsProviderSelection** element is analogous to an identity provider button on a sign-up/sign-in page. If you add a **ClaimsProviderSelection** element for Azure AD, a new button shows up when a user lands on the page.

1. Find the **OrchestrationStep** element that includes `Order="1"` in the user journey that you created in *TrustFrameworkExtensions.xml*.
1. Under **ClaimsProviderSelections**, add the following element. Set the value of **TargetClaimsExchangeId** to an appropriate value, for example `ContosoExchange`:

    ```XML
    <ClaimsProviderSelection TargetClaimsExchangeId="ContosoExchange" />
    ```

### Link the button to an action

Now that you have a button in place, you need to link it to an action. The action, in this case, is for Azure AD B2C to communicate with Azure AD to receive a token. Link the button to an action by linking the technical profile for your Azure AD claims provider:

1. Find the **OrchestrationStep** that includes `Order="2"` in the user journey.
1. Add the following **ClaimsExchange** element making sure that you use the same value for **Id** that you used for **TargetClaimsExchangeId**:

    ```XML
    <ClaimsExchange Id="ContosoExchange" TechnicalProfileReferenceId="OIDC-Contoso" />
    ```

    Update the value of **TechnicalProfileReferenceId** to the **Id** of the technical profile you created earlier. For example, `OIDC-Contoso`.

1. Save the *TrustFrameworkExtensions.xml* file and upload it again for verification.

## Create an Azure AD B2C application

Communication with Azure AD B2C occurs through an application that you register in your B2C tenant. This section lists optional steps you can complete to create a test application if you haven't already done so.

[!INCLUDE [active-directory-b2c-appreg-idp](../../includes/active-directory-b2c-appreg-idp.md)]

## Update and test the relying party file

Update the relying party (RP) file that initiates the user journey that you created.

1. Make a copy of *SignUpOrSignIn.xml* in your working directory, and rename it. For example, rename it to *SignUpSignInContoso.xml*.
1. Open the new file and update the value of the **PolicyId** attribute for **TrustFrameworkPolicy** with a unique value. For example, `SignUpSignInContoso`.
1. Update the value of **PublicPolicyUri** with the URI for the policy. For example, `http://contoso.com/B2C_1A_signup_signin_contoso`.
1. Update the value of the **ReferenceId** attribute in **DefaultUserJourney** to match the ID of the user journey that you created earlier. For example, *SignUpSignInContoso*.
1. Save your changes and upload the file.
1. Under **Custom policies**, select the new policy in the list.
1. In the **Select application** drop-down, select the Azure AD B2C application that you created earlier. For example, *testapp1*.
1. Copy the **Run now endpoint** and open it in a private browser window, for example, Incognito Mode in Google Chrome or an InPrivate window in Microsoft Edge. Opening in a private browser window allows you to test the full user journey by not using any currently cached Azure AD credentials.
1. Select the Azure AD sign in button, for example, *Contoso Employee*, and then enter the credentials for a user in your Azure AD organizational tenant. You're asked to authorize the application, and then enter information for your profile.

If the sign in process is successful, your browser is redirected to `https://jwt.ms`, which displays the contents of the token returned by Azure AD B2C.

## Next steps

When working with custom policies, you might sometimes need additional information when troubleshooting a policy during its development.

To help diagnose issues, you can temporarily put the policy into "developer mode" and collect logs with Azure Application Insights. Find out how in [Azure Active Directory B2C: Collecting Logs](troubleshoot-with-application-insights.md).
