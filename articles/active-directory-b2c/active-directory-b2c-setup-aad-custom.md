---
title: 'Azure Active Directory B2C: Add an Azure AD provider by using custom policies | Microsoft Docs'
description: Learn about Azure Active Directory B2C custom policies
services: active-directory-b2c
documentationcenter: ''
author: parakhj
manager: krassk
editor: parakhj

ms.assetid: 31f0dfe5-1ad0-4a25-a53b-8acc71bcea72
ms.service: active-directory-b2c
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: article
ms.devlang: na
ms.date: 04/04/2017
ms.author: parakhj

---
# Azure Active Directory B2C: Log in by using Azure AD accounts

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

This article shows you how to enable login for users from a specific Azure Active Directory (Azure AD) organization through the use of [custom policies](active-directory-b2c-overview-custom.md).

## Prerequisites

Complete the steps in the [Getting started with custom policies](active-directory-b2c-get-started-custom.md) article.

These steps include:

1. Creating an Azure Active Directory B2C (Azure AD B2C) tenant.
2. Creating an Azure AD B2C application.
3. Registering two policy-engine applications.
4. Setting up keys.
5. Setting up the starter pack.

## Create an Azure AD app

To enable login for users from a specific Azure AD organization, you need to register an application within the organizational Azure AD tenant.

>[!NOTE]
> We will refer to the organizational Azure AD tenant as `contoso.com` and the Azure AD B2C tenant as `fabrikamb2c.onmicrosoft.com`.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. On the top bar, click on your account and under the **Directory** list, choose the organizational Azure AD tenant where you wish to register your application (i.e. contoso.com).
1. Select **More Services** in the left-hand nav, and search for **App registrations**.
1. Choose **New application registration**.
1. Enter a name for your application (for example, `Azure AD B2C App`)
1. Select **Web app / API** for the application type.
1. For the 'Sign-on URL', enter the following URL, where `yourtenant` is replaced by the name of your Azure AD B2C tenant (for example, `fabrikamb2c.onmicrosoft.com`).

    ```
    https://login.microsoftonline.com/te/yourtenant.onmicrosoft.com/oauth2/authresp
    ```

1. Save the application ID.
1. Select the newly created app.
1. Under the **Settings** blade, select **Keys**.
1. Create a new key and save it for the next section.

## Add the Azure AD key to Azure AD B2C

You need to store the `contoso.com` application key in your Azure AD B2C tenant. To do this:

1. Navigate to your Azure AD B2C tenant, and open B2C Settings>Identity Experience Framework>Policy Keys
1. Select **+Add**.
1. Options:
   * Select Option > `Manual`
   * Name: > `ContosoAppSecret`  Choose a name that matches your Azure AD tenant name.  The prefix `B2C_1A_` will be added automatically to the name of your key.
   * Paste your application key in the **Secret** box.
   * Select **Signature**.
1. Select **Create**.
1. Confirm that you've created the key `B2C_1A_ContosoAppSecret`.


## Add a claims provider in your base policy

In order to allow users to log in by using Azure AD, you need to define Azure AD as a claims provider. In other words, you need to specify an endpoint that Azure AD B2C will communicate with. The endpoint will *provide* a set of *claims* that are used by Azure AD B2C to verify that a specific user has authenticated. 

You can define Azure AD as a claims provider by adding Azure AD as a `<ClaimsProvider>` in the extension file of your policy:

1. Open the extension file from your working directory (TrustFrameworkExtensions.xml).
1. Find the `<ClaimsProviders>` section. If it does not exist, add it under the root node.
1. Add a new `<ClaimsProvider>` section as follows:

    ```XML
    <ClaimsProvider>
        <Domain>Contoso</Domain>
        <DisplayName>Login using Contoso</DisplayName>
        <TechnicalProfiles>
            <TechnicalProfile Id="ContosoProfile">
                <DisplayName>Contoso Employee</DisplayName>
                <Description>Login with your Contoso account</Description>
                <Protocol Name="OpenIdConnect"/>
                <OutputTokenFormat>JWT</OutputTokenFormat>
                <Metadata>
                    <Item Key="METADATA">https://login.windows.net/contoso.com/.well-known/openid-configuration</Item>
                    <Item Key="ProviderName">https://sts.windows.net/00000000-0000-0000-0000-000000000000/</Item>
                    <Item Key="client_id">00000000-0000-0000-0000-000000000000</Item>
                    <Item Key="IdTokenAudience">00000000-0000-0000-0000-000000000000</Item>
                    <Item Key="response_types">id_token</Item>
                    <Item Key="UsePolicyInRedirectUri">false</Item>
                </Metadata>
                <CryptographicKeys>
                    <Key Id="client_secret" StorageReferenceId="B2C_1A_ContosoAppSecret"/>
                </CryptographicKeys>
                <OutputClaims>
                    <OutputClaim ClaimTypeReferenceId="socialIdpUserId" PartnerClaimType="oid"/>
                    <OutputClaim ClaimTypeReferenceId="tenantId" PartnerClaimType="tid"/>
                    <OutputClaim ClaimTypeReferenceId="givenName" PartnerClaimType="given_name" />
                    <OutputClaim ClaimTypeReferenceId="surName" PartnerClaimType="family_name" />
                    <OutputClaim ClaimTypeReferenceId="displayName" PartnerClaimType="name" />
                    <OutputClaim ClaimTypeReferenceId="authenticationSource" DefaultValue="contosoAuthentication" />
                    <OutputClaim ClaimTypeReferenceId="identityProvider" DefaultValue="AzureADContoso" />
                </OutputClaims>
                <OutputClaimsTransformations>
                    <OutputClaimsTransformation ReferenceId="CreateRandomUPNUserName"/>
                    <OutputClaimsTransformation ReferenceId="CreateUserPrincipalName"/>
                    <OutputClaimsTransformation ReferenceId="CreateAlternativeSecurityId"/>
                    <OutputClaimsTransformation ReferenceId="CreateSubjectClaimFromAlternativeSecurityId"/>
                </OutputClaimsTransformations>
                <UseTechnicalProfileForSessionManagement ReferenceId="SM-Noop"/>
            </TechnicalProfile>
        </TechnicalProfiles>
    </ClaimsProvider>
    ```

1. Under the `<ClaimsProvider>` node, update the value for `<Domain>` to a unique value that can be used to distinguish it from other identity providers.
1. Under the `<ClaimsProvider>` node, update the value for `<DisplayName>` to a friendly name for the claims provider. This value is not currently used.

### Update the technical profile

In order to get a token from the Azure AD endpoint, you need to define the protocols that Azure AD B2C should use to communicate with Azure AD. This is done inside the `<TechnicalProfile>` element of  `<ClaimsProvider>`.

1. Update the ID of the `<TechnicalProfile>` node. This ID is used to refer to this technical profile from other parts of the policy.
1. Update the value for `<DisplayName>`. This value will be displayed on the login button in your login screen.
1. Update the value for `<Description>`.
1. Azure AD uses the OpenID Connect protocol, so ensure that the value for `<Protocol>` is `"OpenIDConnect"`.

You need to update the `<Metadata>` section in the preceding XML to reflect the configuration settings for your specific Azure AD tenant. In the XML, update the metadata values as follows:

1. Set `<Item Key="METADATA">` to `https://login.windows.net/yourAzureADtenant/.well-known/openid-configuration`, where `yourAzureADtenant` is your Azure AD tenant name (for example, contoso.com).
1. Open your browser and go to the `Metadata` URL that you just updated.
1. In the browser, look for the 'issuer' object and copy its value. It should look like the following: `https://sts.windows.net/{tenantId}/`.
1. Paste the value for `<Item Key="ProviderName">` in the XML.
1. Set `<Item Key="client_id">` to the `Application ID` from the app registration.
1. Set `<Item Key="IdTokenAudience">` to the `Application ID` from the app registration.
1. Ensure that `<Item Key="response_types">` is set to `id_token`.
1. Ensure that `<Item Key="UsePolicyInRedirectUri">` is set to `false`.

You also need to link the Azure AD secret that you registered in your Azure AD B2C tenant to the Azure AD `<ClaimsProvider>`:

* In the `<CryptographicKeys>` section in the preceding XML, update the value for `StorageReferenceId` to the reference ID of the secret that you defined (for example, `ContosoAppSecret`).

### Upload the extension file for verification

By now, you will have configured your policy so that Azure AD B2C knows how to communicate with your Azure AD directory. Try uploading the extension file of your policy just to confirm that it doesn't have any issues so far. To do so:

1. Open the **All Policies** blade in your Azure AD B2C tenant.
1. Check the **Overwrite the policy if it exists** box.
1. Upload the extension file (TrustFrameworkExtensions.xml) and ensure it does not fail the validation.

## Register the Azure AD claims provider to a user journey

You now need to add the Azure AD identity provider into one of your user journeys. At this point, the identity provider has been set up, but it’s not available in any of the sign-up/sign-in screens. To do so, we will create a duplicate of an existing template user journey, and then modify it so that it also has the Azure AD identity provider.

1. Open the base file of your policy (for example, TrustFrameworkBase.xml).
1. Find the `<UserJourneys>` element and copy the entire `<UserJourney>` with Id=”SignUpOrSignIn”.
1. Open the extension file (for example, TrustFrameworkExtensions.xml) and find the `<UserJourneys>` element. If the element doesn't exist, add one.
1. Paste the entire `<UserJourney>` that you copied as a child of the `<UserJourneys>` element.
1. Rename the ID of the new `<UserJourney>` (for example, rename as `SignUpOrSignUsingContoso`).

### Display the "button"

The `<ClaimsProviderSelection>` element is analogous to an identity provider button on a sign-up/sign-in screen. If you add a `<ClaimsProviderSelection>` element for Azure AD, a new button shows up when a user lands on the page. To do this:

1. Find the `<OrchestrationStep>` with `Order="1"` in the `<UserJourney>` that you just created.
1. Add the following:

    ```XML
    <ClaimsProviderSelection TargetClaimsExchangeId="ContosoExchange" />
    ```

1. Set `TargetClaimsExchangeId` to an appropriate value. We recommend following the same convention as others: *\[ClaimProviderName\]Exchange*.

### Link the "button" to an action

Now that you have a "button" in place, you need to link it to an action. The action, in this case, is for Azure AD B2C to communicate with Azure AD to receive a token. You can do this by linking the technical profile for your Azure AD claims provider:

1. Find the `<OrchestrationStep>` with `Order="2"` in the `<UserJourney>` node.
1. Add the following:

    ```XML
    <ClaimsExchange Id="ContosoExchange" TechnicalProfileReferenceId="ContosoProfile" />
    ```

1. Update `Id` to the same value as that of `TargetClaimsExchangeId` in the preceding section.
1. Update `TechnicalProfileReferenceId` to the ID of the technical profile you created earlier (for example, ContosoProfile).

### Upload the updated extension file

You are done modifying the extension file. Save it. Then upload the file, and ensure that all validations succeed.

### Update the RP file

You now need to update the relying party (RP) file that will initiate the user journey that you just created.

1. Make a copy of SignUpOrSignIn.xml in your working directory, and rename it (for example, rename it to SignUpOrSignInWithAAD.xml).
1. Open the new file and update the `PolicyId` attribute for `<TrustFrameworkPolicy>` with a unique value (for example, SignUpOrSignInWithAAD). <br> This will be the name of your policy (for example, B2C\_1A\_SignUpOrSignInWithAAD).
1. Modify the `ReferenceId` attribute in `<DefaultUserJourney>` to match the ID of the new user journey that you created (for example, SignUpOrSignUsingContoso).
1. Save your changes and upload the file.

## Troubleshooting

Test the custom policy that you just uploaded by opening its blade and clicking **Run now**. To diagnose problems, read about [troubleshooting](active-directory-b2c-troubleshoot-custom.md).

## Next Steps

Provide feedback to AADB2CPreview@microsoft.com.
