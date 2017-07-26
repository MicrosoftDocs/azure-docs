---
title: 'Azure Active Directory B2C: Add your own attributes to custom policies and use in Profile Edit| Microsoft Docs'
description: A Walkthrough on using extension properties, custom attributes, and including them in the user interface
services: active-directory-b2c
documentationcenter: ''
author: rojasja
manager: krassk
editor:

ms.assetid:
ms.service: active-directory-b2c
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: article
ms.devlang: na
ms.date: 04/29/2017
ms.author: joroja
---
# Azure Active Directory B2C: Creating and using custom attributes in a custom profile edit policy.

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

In this article, you will create a custom attribute in your Azure AD B2C directory and use this new attribute as a custom claim in the profile edit user journey.

## Prerequisites

Complete the steps in the article [Getting Started with Custom Policies](active-directory-b2c-get-started-custom.md).

## Use custom attributes to collect information about your customers in Azure Active Directory B2C using custom policies
Your Azure Active Directory (Azure AD) B2C directory comes with a built-in set of attributes: Given Name, Surname, City, Postal Code, userPrincipalName, etc.  You will often need to create your own.  For example:
* A customer-facing application needs to persist an attribute such as "LoyaltyNumber."
* An identity provider has a unique user identifier that must be saved such as "uniqueUserGUID.""
* A custom user journey needs to persist the state of user such as "migrationStatus."

With Azure AD B2C, you can extend the set of attributes stored on each user account. You can also read and write these attributes by using the [Azure AD Graph API](active-directory-b2c-devquickstarts-graph-dotnet.md).

>[!NOTE]
>We refer to a custom attribute or an extension property as a feature of the Azure AD B2C Directory.  Extension properties extend the schema of the user objects in the directory.  To use a custom attribute as a custom claim in a policy, define it in the policy in the `ClaimsSchema`.

>[!NOTE]
>Extension properties can only be registered on an Application object even though they may contain data for a User. The property is attached to the application. The Application object must be granted write access to register an extension property. 100 Extension properties (across ALL types and ALL applications) can be written to any single object. Extension properties are added to the target directory type and becomes immediately accessible in the Azure AD B2C directory tenant.
If the application is deleted, those Extension properties along with any data contained in them for all users are also removed. If an Extension property is deleted by the Application, it is removed on the target directory object, and any data contained in it is removed too.

>[!NOTE]
>Extension properties exist only in the context of a registered  Application in the tenant. The object id of that Application must be included in the TechnicalProfile which use it

>[!NOTE]
>The Azure AD B2C directory typically includes a Web API App named `b2c-extensions-app`.  This application is primarily used by the b2c built-in  policies for the custom claims created via the Azure portal.  Using this application to register extensions for b2c custom policies is recommended only for advanced users.


## Creating a new application to store the extension properties

1. Open a browsing session and navigate to the [Azure porta](https://portal.azure.com) and sign in with administrative credentials of the B2C Directory you wish to configure.
1. Click **Azure Active Directory** on the left navigation menu. You may need to find it by selecting More services>.
1. Select **App registrations** and click **New application registration**
1. Provide the following recommended entries:
  * Specify a name for the web application: **WebApp-GraphAPI-DirectoryExtensions**
  * Application type: Web app/API
  * Sign-on URL:https://{tenantName}.onmicrosoft.com/WebApp-GraphAPI-DirectoryExtensions
1. Select **Create** . Successful completion appears in the **notifications**
1. Select the newly created web application: **WebApp-GraphAPI-DirectoryExtensions**
1. Select Settings: **Required permissions**
1. Select API **Windows Active Directory**
1. Place a checkmark in Application Permissions: **Read and write directory data**, and **Save**
1. Choose **Grant permissions** and confirm **Yes**.
1. Copy to your clipboard and save the following identifiers from WebApp-GraphAPI-DirectoryExtensions>Settings>Properties>
*  **Application ID** . Example: `103ee0e6-f92d-4183-b576-8c3739027780`
* **Object ID**. Example: `80d8296a-da0a-49ee-b6ab-fd232aa45201`

## Modifying your custom policy to add the `ApplicationObjectId`

For every TechnicalProfile that will read or write extension attributes you must add a `<Metadata>` element with the two Items: ApplicationObjectId and ClientId which were obtained in earlier steps.

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

>[!NOTE]
>The <TechnicalProfile Id="AAD-Common"> is "common" because its elements are re-used in in all the Azure Active Directory TechnicalProfiles by using the element:

```
      <IncludeTechnicalProfile ReferenceId="AAD-Common" />
```

>[!NOTE]
>When the TechnicalProfile writes for the first time to the newly created extension property, you may experience a one-time error as the property is created if not found.  .*  

## Using the new extension property / custom attribute in a user journey


1. Open the Relying Party(RP) file that describes your policy edit user journey.  If you are starting out, it may be advisable to download your already configured version of the RP-PolicyEdit file directly from the Azure B2C Custom Policy section in the Azure portal.  Alternatively, open your XML file from your storage folder.
2. Add a custom claim `loyaltyId`.  By including the custom claim in the `<RelyingParty>` element, it be passed as a parameter to the UserJourney TechnicalProfiles and included in the token for the application.
```xml
<RelyingParty>
   <DefaultUserJourney ReferenceId="ProfileEdit" />
   <TechnicalProfile Id="PolicyProfile">
     <DisplayName>PolicyProfile</DisplayName>
     <Protocol Name="OpenIdConnect" />
     <OutputClaims>
       <OutputClaim ClaimTypeReferenceId="objectId" PartnerClaimType="sub"/>
       <OutputClaim ClaimTypeReferenceId="city" />

       <OutputClaim ClaimTypeReferenceId="extension_loyaltyId" />

     </OutputClaims>
     <SubjectNamingInfo ClaimType="sub" />
   </TechnicalProfile>
 </RelyingParty>
 ```
3. Add a claim definition to the Extension policy file  `TrustFrameworkExtensions.xml` inside the ``<ClaimsSchema>`` element as shown below.
```xml
<ClaimsSchema>
		<ClaimType Id="extension_loyaltyId">
			<DisplayName>Loyalty Identification Tag</DisplayName>
			<DataType>string</DataType>
			<UserHelpText>Your loyalty number from your membership card</UserHelpText>
			<UserInputType>TextBox</UserInputType>
		</ClaimType>
</ClaimsSchema>
```
4. Add the same claim definition to the Base policy file `TrustFrameworkBase.xml` .  

>[!NOTE]
>Adding a `ClaimType` definition in both the base and the extensions file is normally not necessary, however since the next steps will add the extension_loyaltyId to TechnicalProfiles in the Base file, the policy validator will reject the upload of the base file without it.

>[!NOTE]
>It may be useful to trace the execution of the user journey named "ProfileEdit" in the TrustFrameworkBase.xml file.  Search for the user journey of the same name in your editor and observe that Orchestration Step 5 invokes the TechnicalProfileReferenceID="SelfAsserted-ProfileUpdate".  Search and inspect this TechnicalProfile to familiarize yourself with the flow.

5. Add loyaltyId as input and output claim in the TechnicalProfile "SelfAsserted-ProfileUpdate"

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

            <!-- Optional claims. These claims are collected from the user and can be modified. Any claim added here should be updated in the
                 ValidationTechnicalProfile referenced below so it can be written to directory after being updateed by the user, i.e. AAD-UserWriteProfileUsingObjectId. -->
            <InputClaim ClaimTypeReferenceId="givenName" />
            <InputClaim ClaimTypeReferenceId="surname" />
            <InputClaim ClaimTypeReferenceId="extension_loyaltyId"/>
          </InputClaims>
          <OutputClaims>
            <!-- Required claims -->
            <OutputClaim ClaimTypeReferenceId="executed-SelfAsserted-Input" DefaultValue="true" />

            <!-- Optional claims. These claims are collected from the user and can be modified. Any claim added here should be updated in the
                 ValidationTechnicalProfile referenced below so it can be written to directory after being updateed by the user, i.e. AAD-UserWriteProfileUsingObjectId. -->
            <OutputClaim ClaimTypeReferenceId="givenName" />
            <OutputClaim ClaimTypeReferenceId="surname" />
            <OutputClaim ClaimTypeReferenceId="extension_loyaltyId"/>
          </OutputClaims>
          <ValidationTechnicalProfiles>
            <ValidationTechnicalProfile ReferenceId="AAD-UserWriteProfileUsingObjectId" />
          </ValidationTechnicalProfiles>
        </TechnicalProfile>
```
6. Add claim in TechnicalProfile "AAD-UserWriteProfileUsingObjectId" to persist the value of the claim in the extension property, for the current user in the directory.

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
            <!-- Required claims -->
            <PersistedClaim ClaimTypeReferenceId="objectId" />

            <!-- Optional claims -->
            <PersistedClaim ClaimTypeReferenceId="givenName" />
            <PersistedClaim ClaimTypeReferenceId="surname" />
            <PersistedClaim ClaimTypeReferenceId="extension_loyaltyId" />

          </PersistedClaims>
          <IncludeTechnicalProfile ReferenceId="AAD-Common" />
        </TechnicalProfile>
```
7. Add claim in TechnicalProfile "AAD-UserReadUsingObjectId" to read the value of the extension attribute every time a user logs in.
NOTE: Thus far the TechnicalProfiles have been changed in the flow of local accounts only.  If the new attribute is desired in the flow of a social/federated account, a different set of TechnicalProfiles need to be changed. See next steps.

```xml
<!-- The following technical profile is used to read data after user authenticates. -->
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
         <!-- Optional claims -->
         <OutputClaim ClaimTypeReferenceId="signInNames.emailAddress" />
         <OutputClaim ClaimTypeReferenceId="displayName" />
         <OutputClaim ClaimTypeReferenceId="otherMails" />
         <OutputClaim ClaimTypeReferenceId="givenName" />
         <OutputClaim ClaimTypeReferenceId="surname" />
         <OutputClaim ClaimTypeReferenceId="extension_loyaltyId" />
       </OutputClaims>
       <IncludeTechnicalProfile ReferenceId="AAD-Common" />
     </TechnicalProfile>
```


>[!IMPORTANT]
>The IncludeTechnicalProfile element above adds all the elements of AAD-Common to this TechnicalProfile.

## Test the custom policy using "Run Now"

     1. Open the **Azure AD B2C Blade** and navigate to **Identity Experience Framework > Custom policies**.
     2. Select the custom policy that you uploaded, and click the **Run now** button.
     3. You should be able to sign up using an email address.

The  id token sent back to your application will include the new extension property as a custom claim preceded by extension_loyaltyId. See example.

```
{
  "exp": 1493585187,
  "nbf": 1493581587,
  "ver": "1.0",
  "iss": "https://login.microsoftonline.com/f06c2fe8-709f-4030-85dc-38a4bfd9e82d/v2.0/",
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

Add the new claim to the flows for social account logins by changing the TechnicalProfiles listed below. These two TechnicalProfiles are used by social/federated account logins to write and read the user data using the alternativeSecurityId as the locator of the user object.
```
  <TechnicalProfile Id="AAD-UserWriteUsingAlternativeSecurityId">

  <TechnicalProfile Id="AAD-UserReadUsingAlternativeSecurityId">
```


## Reference

* A **Technical Profile (TP)** is an element type that can be thought of as a *function* that defines an endpoint’s name, its metadata, its protocol, and details the exchange of claims that the Identity Experience Framework should perform.  When this *function* is called in an orchestration step or from another TechnicalProfile, the InputClaims and OutputClaims are provided as parameters by the caller.


* For full treatment on extension properties, see the article [DIRECTORY SCHEMA EXTENSIONS | GRAPH API CONCEPTS](https://msdn.microsoft.com/Library/Azure/Ad/Graph/howto/azure-ad-graph-api-directory-schema-extensions)

>[!NOTE]
>Extension attributes in Graph API are named using the convention `extension_ApplicationObjectID_attributename`
Custom policies refer to extensions attributes as extension_attributename, thus omitting the ApplicationObjectId in the XML
