---
title: Add your own attributes to custom policies in Azure Active Directory B2C | Microsoft Docs
description: A walkthrough on using extension properties and custom attributes and including them in the user interface.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 08/04/2017
ms.author: marsma
ms.subservice: B2C
---
# Azure Active Directory B2C: Use custom attributes in a custom profile edit policy

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

In this article, you create a custom attribute in your Azure Active Directory (Azure AD) B2C directory. You'll use this new attribute as a custom claim in the profile edit user journey.

## Prerequisites

Follow the steps in the article [Azure Active Directory B2C: Get started with custom policies](active-directory-b2c-get-started-custom.md).

## Use custom attributes to collect information about your customers in Azure AD B2C by using custom policies
Your Azure AD B2C directory comes with a built-in set of attributes. Examples are **Given Name**, **Surname**, **City**, **Postal Code**, and **userPrincipalName**. You often need to create your own attributes like these examples:
* A customer-facing application needs to persist for an attribute like **LoyaltyNumber.**
* An identity provider has a unique user identifier like **uniqueUserGUID** that must be saved.
* A custom user journey needs to persist for a state of a user like **migrationStatus**.

Azure AD B2C extends the set of attributes stored on each user account. You can also read and write these attributes by using the [Azure AD Graph API](active-directory-b2c-devquickstarts-graph-dotnet.md).

Extension properties extend the schema of the user objects in the directory. The terms *extension property*, *custom attribute*, and *custom claim* refer to the same thing in the context of this article. The name varies depending on the context, such as application, object, or policy.

Extension properties can only be registered on an application object even though they might contain data for a user. The property is attached to the application. The application object must have write access to register an extension property. A hundred extension properties, across all types and all applications, can be written to any single object. Extension properties are added to the target directory type and become immediately accessible in the Azure AD B2C directory tenant.
If the application is deleted, those extension properties along with any data contained in them for all users are also removed. If an extension property is deleted by the application, it's removed on the target directory objects, and the values are deleted.

Extension properties exist only in the context of a registered application in the tenant. The object ID of that application must be included in the **TechnicalProfile** that uses it.

>[!NOTE]
>The Azure AD B2C directory typically includes a web app named `b2c-extensions-app`. This application is primarily used by the B2C built-in policies for the custom claims created via the Azure portal. We recommend that only advanced users register extensions for B2C custom policies by using this application.  
Instructions are included in the **Next steps** section in this article.

## Create a new application to store the extension properties

1. Open a browsing session and navigate to the [Azure portal](https://portal.azure.com). Sign in with the administrative credentials of the B2C directory you want to configure.
2. Select **Azure Active Directory** on the left navigation menu. You might need to find it by selecting **More services**.
3. Select **App registrations**. Select **New application registration**.
4. Provide the following entries:
    * A name for the web application: **WebApp-GraphAPI-DirectoryExtensions**.
    * The application type: **Web app/API**.
    * The sign-on URL: **https://{tenantName}.onmicrosoft.com/WebApp-GraphAPI-DirectoryExtensions**.
5. Select **Create**.
6. Select the newly created web application.
7. Select **Settings** > **Required permissions**.
8. Select the API **Windows Azure Active Directory**.
9. Enter a checkmark in Application Permissions: **Read and write directory data**. Then select **Save**.
10. Choose **Grant permissions** and confirm **Yes**.
11. Copy the following identifiers to your clipboard and save them:
    * **Application ID**. Example: `103ee0e6-f92d-4183-b576-8c3739027780`.
    * **Object ID**. Example: `80d8296a-da0a-49ee-b6ab-fd232aa45201`.

## Modify your custom policy to add the **ApplicationObjectId**

When you followed the steps in [Azure Active Directory B2C: Get started with custom policies](active-directory-b2c-get-started-custom.md), you downloaded and modified [sample files](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/archive/master.zip) named **TrustFrameworkBase.xml**, **TrustFrameworkExtensions.xml**, **SignUpOrSignin.xml**, **ProfileEdit.xml**, and **PasswordReset.xml**. In this step, you make more modifications to those files.

* Open the **TrustFrameworkBase.xml** file and add the `Metadata` section as shown in the following example. Insert the object ID that you previously recorded for the `ApplicationObjectId` value and the application ID that you recorded for the `ClientId` value: 

    ```xml
    <ClaimsProviders>
      <ClaimsProvider>
        <DisplayName>Azure Active Directory</DisplayName>
        <TechnicalProfile Id="AAD-Common">
          <DisplayName>Azure Active Directory</DisplayName>
          <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.AzureActiveDirectoryProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />

          <!-- Provide objectId and appId before using extension properties. -->
          <Metadata>
            <Item Key="ApplicationObjectId">insert objectId here</Item>
            <Item Key="ClientId">insert appId here</Item>
          </Metadata>
          <!-- End of changes -->

          <CryptographicKeys>
            <Key Id="issuer_secret" StorageReferenceId="TokenSigningKeyContainer" />
          </CryptographicKeys>
          <IncludeInSso>false</IncludeInSso>
          <UseTechnicalProfileForSessionManagement ReferenceId="SM-Noop" />
        </TechnicalProfile>
      </ClaimsProvider>
    </ClaimsProviders>
    ```

> [!NOTE]
> When the **TechnicalProfile** writes for the first time to the newly created extension property, you might experience a one-time error. The extension property is created the first time it's used.

## Use the new extension property or custom attribute in a user journey

1. Open the **ProfileEdit.xml** file.
2. Add a custom claim `loyaltyId`. By including the custom claim in the `<RelyingParty>` element, it's included in the token for the application.
    
    ```xml
    <RelyingParty>
      <DefaultUserJourney ReferenceId="ProfileEdit" />
      <TechnicalProfile Id="PolicyProfile">
        <DisplayName>PolicyProfile</DisplayName>
        <Protocol Name="OpenIdConnect" />
        <OutputClaims>
          <OutputClaim ClaimTypeReferenceId="objectId" PartnerClaimType="sub"/>
          <OutputClaim ClaimTypeReferenceId="city" />

          <!-- Provide the custom claim identifier -->
          <OutputClaim ClaimTypeReferenceId="extension_loyaltyId" />
          <!-- End of changes -->
        </OutputClaims>
        <SubjectNamingInfo ClaimType="sub" />
      </TechnicalProfile>
    </RelyingParty>
    ```

3. Open the **TrustFrameworkExtensions.xml** file and add the`<ClaimsSchema>` element and its child elements to the `BuildingBlocks` element:

    ```xml
    <BuildingBlocks>
      <ClaimsSchema>
        <ClaimType Id="extension_loyaltyId">
          <DisplayName>Loyalty Identification Tag</DisplayName>
          <DataType>string</DataType>
          <UserHelpText>Your loyalty number from your membership card</UserHelpText>
          <UserInputType>TextBox</UserInputType>
        </ClaimType>
      </ClaimsSchema>
    </BuildingBlocks>
    ```

4. Add the same `ClaimType` definition to **TrustFrameworkBase.xml**. It's not necessary to add a `ClaimType` definition in both the base and the extensions files. However, the next steps add the `extension_loyaltyId` to **TechnicalProfiles** in the base file. So the policy validator rejects the upload of the base file without it. It might be useful to trace the execution of the user journey named **ProfileEdit** in the **TrustFrameworkBase.xml** file. Search for the user journey with the same name in your editor. Observe that Orchestration step 5 invokes the **TechnicalProfileReferenceID="SelfAsserted-ProfileUpdate**. Search and inspect this **TechnicalProfile** to familiarize yourself with the flow.

5. Open the **TrustFrameworkBase.xml** file and add `loyaltyId` as an input and output claim in the **TechnicalProfile SelfAsserted-ProfileUpdate**:

    ```xml
    <TechnicalProfile Id="SelfAsserted-ProfileUpdate">
      <DisplayName>User ID signup</DisplayName>
      <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.SelfAssertedAttributeProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
      <Metadata>
        <Item Key="ContentDefinitionReferenceId">api.selfasserted.profileupdate</Item>
      </Metadata>
      <IncludeInSso>false</IncludeInSso>
      <InputClaims>
        <InputClaim ClaimTypeReferenceId="alternativeSecurityId" />
        <InputClaim ClaimTypeReferenceId="userPrincipalName" />
        <InputClaim ClaimTypeReferenceId="givenName" />
        <InputClaim ClaimTypeReferenceId="surname" />

        <!-- Add the loyalty identifier -->
        <InputClaim ClaimTypeReferenceId="extension_loyaltyId"/>
        <!-- End of changes -->
      </InputClaims>
      <OutputClaims>
        <OutputClaim ClaimTypeReferenceId="executed-SelfAsserted-Input" DefaultValue="true" />
        <OutputClaim ClaimTypeReferenceId="givenName" />
        <OutputClaim ClaimTypeReferenceId="surname" />

        <!-- Add the loyalty identifier -->
        <OutputClaim ClaimTypeReferenceId="extension_loyaltyId"/>
        <!-- End of changes -->

      </OutputClaims>
      <ValidationTechnicalProfiles>
        <ValidationTechnicalProfile ReferenceId="AAD-UserWriteProfileUsingObjectId" />
      </ValidationTechnicalProfiles>
    </TechnicalProfile>
    ```

6. In the **TrustFrameworkBase.xml** file, add the `loyaltyId` claim to **TechnicalProfile AAD-UserWriteProfileUsingObjectId**. This addition persists the value of the claim in the extension property for the current user in the directory:

    ```xml
    <TechnicalProfile Id="AAD-UserWriteProfileUsingObjectId">
      <Metadata>
        <Item Key="Operation">Write</Item>
        <Item Key="RaiseErrorIfClaimsPrincipalAlreadyExists">false</Item>
        <Item Key="RaiseErrorIfClaimsPrincipalDoesNotExist">true</Item>
      </Metadata>
      <IncludeInSso>false</IncludeInSso>
      <InputClaims>
        <InputClaim ClaimTypeReferenceId="objectId" Required="true" />
      </InputClaims>
      <PersistedClaims>
        <PersistedClaim ClaimTypeReferenceId="objectId" />
        <PersistedClaim ClaimTypeReferenceId="givenName" />
        <PersistedClaim ClaimTypeReferenceId="surname" />

        <!-- Add the loyalty identifier -->
        <PersistedClaim ClaimTypeReferenceId="extension_loyaltyId" />
        <!-- End of changes -->

      </PersistedClaims>
      <IncludeTechnicalProfile ReferenceId="AAD-Common" />
    </TechnicalProfile>
    ```

7. In the **TrustFrameworkBase.xml** file, add the `loyaltyId` claim to **TechnicalProfile AAD-UserReadUsingObjectId** to read the value of the extension attribute every time a user signs in. So far, the **TechnicalProfiles** have been changed in the flow of local accounts only. If you want the new attribute in the flow of a social or federated account, a different set of **TechnicalProfiles** needs to be changed. See the **Next steps** section.

    ```xml
    <TechnicalProfile Id="AAD-UserReadUsingObjectId">
      <Metadata>
        <Item Key="Operation">Read</Item>
        <Item Key="RaiseErrorIfClaimsPrincipalDoesNotExist">true</Item>
      </Metadata>
      <IncludeInSso>false</IncludeInSso>
      <InputClaims>
        <InputClaim ClaimTypeReferenceId="objectId" Required="true" />
      </InputClaims>
      <OutputClaims>
        <OutputClaim ClaimTypeReferenceId="signInNames.emailAddress" />
        <OutputClaim ClaimTypeReferenceId="displayName" />
        <OutputClaim ClaimTypeReferenceId="otherMails" />
        <OutputClaim ClaimTypeReferenceId="givenName" />
        <OutputClaim ClaimTypeReferenceId="surname" />

        <!-- Add the loyalty identifier -->
        <OutputClaim ClaimTypeReferenceId="extension_loyaltyId" />
        <!-- End of changes -->

      </OutputClaims>
      <IncludeTechnicalProfile ReferenceId="AAD-Common" />
    </TechnicalProfile>
    ```

## Test the custom policy

1. Open the Azure AD B2C blade and navigate to **Identity Experience Framework** > **Custom policies**.
1. Select the custom policy that you uploaded. Select **Run now**.
1. Sign up by using an email address.

The ID token sent back to your application includes the new extension property as a custom claim preceded by **extension_loyaltyId**. See the following example:

```json
{
  "exp": 1493585187,
  "nbf": 1493581587,
  "ver": "1.0",
  "iss": "https://contoso.b2clogin.com/f06c2fe8-709f-4030-85dc-38a4bfd9e82d/v2.0/",
  "sub": "a58e7c6c-7535-4074-93da-b0023fbaf3ac",
  "aud": "4e87c1dd-e5f5-4ac8-8368-bc6a98751b8b",
  "acr": "b2c_1a_trustframeworkprofileedit",
  "nonce": "defaultNonce",
  "iat": 1493581587,
  "auth_time": 1493581587,
  "extension_loyaltyId": "abc",
  "city": "Redmond"
}
```

## Next steps

1. Add the new claim to the flows to sign in to social accounts by changing the following **TechnicalProfiles**. Social and federated accounts use these two **TechnicalProfiles** to sign in. They write and read user data by using the **alternativeSecurityId** as the locator of the user object.

   ```xml
    <TechnicalProfile Id="AAD-UserWriteUsingAlternativeSecurityId">

    <TechnicalProfile Id="AAD-UserReadUsingAlternativeSecurityId">
   ```

2. Use the same extension attributes between built-in and custom policies. When you add extension, or custom, attributes via the portal experience, those attributes are registered by using the **b2c-extensions-app** that exists in every B2C tenant. Take the following steps to use extension attributes in your custom policy:

   a. Within your B2C tenant in portal.azure.com, navigate to **Azure Active Directory** and select **App registrations**.  
   b. Find your **b2c-extensions-app** and select it.  
   c. Under **Essentials**, enter the **Application ID** and the **Object ID**.  
   d. Include them in your **AAD-Common** TechnicalProfile metadata:  

   ```xml
      <ClaimsProviders>
        <ClaimsProvider>
          <DisplayName>Azure Active Directory</DisplayName>
          <TechnicalProfile Id="AAD-Common">
            <DisplayName>Azure Active Directory</DisplayName>
            <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.AzureActiveDirectoryProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
            <!-- Provide objectId and appId before using extension properties. -->
            <Metadata>
              <Item Key="ApplicationObjectId">insert objectId here</Item> <!-- This is the "Object ID" from the "b2c-extensions-app"-->
              <Item Key="ClientId">insert appId here</Item> <!--This is the "Application ID" from the "b2c-extensions-app"-->
            </Metadata>
   ```

3. Stay consistent with the portal experience. Create these attributes by using the portal UI before you use them in your custom policies. When you create an attribute **ActivationStatus** in the portal, you must refer to it as follows:

   ```
   extension_ActivationStatus in the custom policy.
   extension_<app-guid>_ActivationStatus via Graph API.
   ```

## Reference

For more information on extension properties, see the article [Directory schema extensions | Graph API concepts](/previous-versions/azure/ad/graph/howto/azure-ad-graph-api-directory-schema-extensions).

> [!NOTE]
> * A **TechnicalProfile** is an element type, or function, that defines an endpoint’s name, metadata, and protocol. The **TechnicalProfile** details the exchange of claims that the Identity Experience Framework performs. When this function is called in an orchestration step or from another **TechnicalProfile**, the **InputClaims** and **OutputClaims** are provided as parameters by the caller.  
> * Extension attributes in the Graph API are named by using the convention `extension_ApplicationObjectID_attributename`.  
> * Custom policies refer to extension attributes as **extension_attributename**. This reference omits the **ApplicationObjectId** in XML.
