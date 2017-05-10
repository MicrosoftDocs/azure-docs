---
title: 'Azure Active Directory B2C: Adding Azure AD provider using custom policies | Microsoft Docs'
description: A topic on Azure Active Directory B2C custom policies
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
# Azure Active Directory B2C: Log in using Azure AD accounts

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

This article shows you how to enable login for users from a specific Azure AD organization through the use of [custom policies](active-directory-b2c-overview-custom.md).

## Prerequisites

Ensure you have completed all of the steps that show you how to [get started with custom policies](active-directory-b2c-get-started-custom.md).

This includes:

1. Creating an Azure AD B2C tenant.
1. Creating an Azure AD B2C application.
1. Registering two policy engine applications.
1. Setting up keys.
1. Setting up the starter pack.

## Create an Azure AD app

To enable login for users from a specific Azure AD organization, you need to register an application within the organizational Azure AD tenant.

>[!NOTE]
> We will refer to the organizational Azure AD tenant as `contoso.com`, and the Azure AD B2C tenant as `fabrikamb2c.onmicrosoft.com`.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. On the top bar, click on your account and under the **Directory** list, choose the organizational Azure AD tenant where you wish to register your application (i.e. contoso.com).
1. Click on **More Services** in the left-hand nav, and search for **App registrations**.
1. Choose **New application registration**.
1. Type in a **Name** for your application (e.g. Azure AD B2C App)
1. Select **Web app / API** for the Application type.
1. For the 'Sign-on URL', enter the URL below, where the `{tenantName}` should be replaced by the name of your Azure AD B2C tenant (i.e. fabrikamb2c.onmicrosoft.com).

    ```
    https://login.microsoftonline.com/te/{tenantName}.onmicrosoft.com/oauth2/authresp
    ```

1. Save the **Application ID**.
1. Click on the newly created app.
1. Under the Settings blade, click on **Keys**.
1. Create a new key and save it for the next section.

## Add the Azure AD key to Azure AD B2C

You need to store the `contoso.com` application key in your Azure AD B2C tenant. To do this:

1. Open PowerShell and navigate to the working directory `active-directory-b2c-advanced-policies`.
1. Switch into the folder with the ExploreAdmin tool.

    ```powershell
    cd active-directory-b2c-advanced-policies\ExploreAdmin
    ```

1. Import the ExploreAdmin tool into powershell.

    ```powershell
    Import-Module .\ExploreAdmin.dll
    ```

1. In the following command, replace `tenantName` with the name of your Azure AD B2C tenant (e.g. fabrikamb2c.onmicrosoft.com), `SecretReferenceId` with a name that you will use to reference the secret (e.g. ContosoAppSecret), and `ClientSecret` with the `contoso.com` application key. Run the command.

    ```PowerShell
    Set-CpimKeyContainer -Tenant {tenantName} -StorageReferenceId {SecretReferenceId} -UnencodedAsciiKey {ClientSecret}
    ```

    When you run the command, make sure you sign in with the onmicrosoft.com admin account local to the Azure AD B2C tenant. If you receive an error that says 'TokenSigningKeyContainer' cannot be found, go through the [getting started](active-directory-b2c-get-started-custom.md) guide.

1. Close PowerShell.

## Add a claims provider in your base policy

In order to allow users to log in using Azure AD, you need to define Azure AD as a claims provider. In other words, you need to specify an endpoint that Azure AD B2C will communicate with. The endpoint will *provide* a set of *claims* that are used by Azure AD B2C to verify that a specific user has authenticated. You can do this by adding Azure AD as a `<ClaimsProvider>` in the extension file of your policy.

1. Open the extension file from your working directory (TrustFrameworkExtensions.xml).
1. Find the section `<ClaimsProviders>`. If it does not exist, add it under the root node.
1. Add a new `<ClaimsProvider>` as follows:

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
            <Key Id="client_secret" StorageReferenceId="ContosoAppSecret"/>
            </CryptographicKeys>
            <OutputClaims>
                <OutputClaim ClaimTypeReferenceId="userId" PartnerClaimType="oid"/>
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

1. Under the `<ClaimsProvider>` node, update the value for `<Domain>` to an unique value that can be used to distinguish from other identity providers.
1. Under the `<ClaimsProvider>` node, update the value for `<DisplayName>` to a friendly name for the claims provider. This value is not currently used.

### Update the technical profile

In order to get a token from the Azure AD endpoint, you need to define the protocols that Azure AD B2C should use to communicate with Azure AD. This is done inside the `<TechnicalProfile>` element of the `<ClaimsProvider>`.

1. Update the id of the `<TechnicalProfile>` node. This id is used to refer to this technical profile from other parts of the policy.
1. Update the value for `<DisplayName>`. This value will be displayed on the login button in your login screen.
1. Update the value for `<Description>`.
1. Azure AD uses the OpenID Connect protocol, so ensure that `<Protocol>` is "OpenIDConnect".

You need to update the `<Metdata>` section in the XML above to reflect the configuration settings for your specific Azure AD tenant. In the XML, update the metadata values as following:

1. Set `<Item Key="METADATA">` to `https://login.windows.net/{tenantName}/.well-known/openid-configuration`, where `tenantName` is your Azure AD tenant name (e.g. contoso.com).
1. Open your browser and navigate to the `Metadata` URL that you just updated.
1. In the browser, look for the 'issuer' object and copy its value. It should look like the following `https://sts.windows.net/{tenantId}/`.
1. Paste the value for `<Item Key="ProviderName">` in the XML.
1. Set `<Item Key="client_id">` to the `Application ID` from the app registration.
1. Set `<Item Key="IdTokenAudience">` to the `Application ID` from the app registration.
1. Ensure that `<Item Key="response_types">` is set to `id_token`.
1. Ensure that `<Item Key="UsePolicyInRedirectUri">` is set to `false`.

You also need to link the [Azure AD secret that you registered in your Azure AD B2C tenant](#add-the-azure-ad-key-to-azure-ad-b2c) to the Azure AD `<ClaimsProvider>`.

1. In the `<CryptographicKeys>` section in the XML above, update the value for `StorageReferenceId` to the reference ID of the secret that you defined (e.g. ContosoAppSecret).

### Upload the extension file for verification

By now, you will have configured your policy so that Azure AD B2C knows how to communicate with your Azure AD directory. Try uploading the extension file of your policy just to confirm that it doesn't have any issues so far. To do so:

1. Go to the **All Policies** blade in your Azure AD B2C tenant.
1. Check the box for **Overwrite the policy if it exists**.
1. Upload the extension file (TrustFrameworkExtensions.xml) and ensure it does not fail the validation.

## Register the Azure AD claims provider to a User Journey

You now need to add the Azure AD identity provider into one of your user journeys. At this point, the identity provider has been set up, but it’s not available in any of the sign-up / sign-in screens. To do so, we will create a duplicate of an existing template user journey, and then modify it so that it also has the Azure AD identity provider.

1. Open the base file of your policy (e.g TrustFrameworkBase.xml)
1. Find the `<UserJourneys>` element and copy the entire `<UserJourney>` with Id=”SignUpOrSignIn”.
1. Open the extension file (e.g. TrustFrameworkExtensions.xml) and find the `<UserJourneys>` element. If the element doesn't exist, add one.
1. Paste the entire `<UserJourney>` that you copied as a child of the `<UserJourneys>` element.
1. Rename the id of the new `<UserJourney>` (i.e SignUpOrSignUsingContoso).

### Display the "button"

The `<ClaimsProviderSelection>` element is analagous to an identity provider button on a sign-up/sign-in screen. By adding an `<ClaimsProviderSelection>` element for Azure AD, a new button will show up when a user lands on the page. To do this:

1. Find the `<OrchestrationStep>` with `Order="1"` in the `<UserJourney>` that you just created.
1. Add the following:

    ```XML
    <ClaimsProviderSelection TargetClaimsExchangeId="ContosoExchange" />
    ```

1. Set `TargetClaimsExchangeId` to an appropriate value. We recommend following the same convention as others - *\[ClaimProviderName\]Exchange*.

### Link the "button" to an action

Now that you have a "button" in place, you need to link it to an action. The action, in this case, is for Azure AD B2C to communicate with Azure AD to receive a token. You can do this by linking the technical profile for your Azure AD claims provider.

1. Find the `<OrchestrationStep>` with `Order="2"` in the `<UserJourney>` node
1. Add the following:

    ```XML
    <ClaimsExchange Id="ContosoExchange" TechnicalProfileReferenceId="ContosoProfile" />
    ```

1. Update `Id` to the same value as that of `TargetClaimsExchangeId` above.
1. Update `TechnicalProfileReferenceId` to the `Id` of the technical profile you created earlier (e.g. ContosoProfile).

### Upload the updated extension file

You are done modifying the extension file. Save and upload this file and ensure that all validations succeed.

### Update the RP file

You now need to update the RP file that will initiate the user journey that you just created.

1. Make a copy of SignUpOrSignIn.xml in your working directory and rename it (e.g. SignUpOrSignInWithAAD.xml).
1. Open the new file and update the `PolicyId` attribute for `<TrustFrameworkPolicy>` with an unique value. This will be the name of your policy (e.g. SignUpOrSignInWithAAD).
1. Modify the `ReferenceId` attribute in `<DefaultUserJourney>` to match the id of the new user journey that you created (e.g. SignUpOrSignUsingContoso).
1. Save your changes and upload the file.

## Troubleshooting

Test out the custom policy that you just uploaded by opening its blade and clicking on "Run now". In case something fails, see how to [troubleshoot](active-directory-b2c-troubleshoot-custom.md).

## Next Steps
 
Provide feedback to AADB2CPreview@microsoft.com.

