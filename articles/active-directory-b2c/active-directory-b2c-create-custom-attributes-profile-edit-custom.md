---
title: 'Azure Active Directory B2C: Add your own attributes to custom policies and use in Profile Edit| Microsoft Docs'
description: A Walkthrough on using extension properties, custom attributes, and including them in the user interface
services: active-directory-b2c
documentationcenter: ''
author: joroja
manager: krassk
editor: tbd

ms.assetid:
ms.service: active-directory-b2c
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: article
ms.devlang: na
ms.date: 04/29/2017
ms.author: joroja
---
# Azure Active Directory B2C: Using new attributes in a custom profile edit policy.

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

After completing the steps in this article, you will have created a custom attribute in your Azure AD B2C directory, (aka extension property) and will have used this new attribute as a custom claim in the profile edit user journey.


## Prerequisites

Complete the steps in the article [Getting Started with Custom Policies](active-directory-b2c-get-started-custom.md).

# Azure Active Directory B2C: Use custom attributes to collect information about your customers
Your Azure Active Directory (Azure AD) B2C directory comes with a built-in set of attributes: Given Name, Surname, City, Postal Code, userPrincipalName, etc.  However, any of the following may create a need to create a custom attribute which is more correctly called an extension property in the Azure AD directory:
* customer-facing application needs to persist an attribute such as "LoyaltyNumber"
* an identity provider has a unique user identifier that must be saved such as "uniqueUserGUID"
* a custom userjourney needs to persist the state of user sucha as "migrationStatus"
With Azure AD B2C, you can extend the set of attributes stored on each user account. You can also read and write these attributes by using the [Azure AD Graph API](active-directory-b2c-devquickstarts-graph-dotnet.md).

NOTE: We refer to a custom attribute or an extension property as a feature of the Azure AD B2C Directory.  Extension properties extend the schema of the user objects in the directory.  In order to user a custom attribute in custom policy, it must also be defined in the policy in the `ClaimsSchema` element as will show later.

NOTE: Extension properties can only be registered on an Application object even though they may contain data for a User. They belong to that application. The application must be granted write access to register an Extension property. 100 Extension properties (across ALL types and ALL applications) can be written to any single object. Extension properties are added to the target directory type and becomes immediately accessible in the Azure AD directory tenant.
If the application is deleted, those Extension properties along with any data contained in them are also removed. If an Extension property is deleted by the application, it is removed on the target directory object, and any data contained in it is removed too.

NOTE: For additional information, see the article [DIRECTORY SCHEMA EXTENSIONS | GRAPH API CONCEPTS](https://msdn.microsoft.com/Library/Azure/Ad/Graph/howto/azure-ad-graph-api-directory-schema-extensions)

NOTE: Before extension properties can be stored, a new application must be created which is used by Azure AD B2C Custom policy for storing the Extension properties. The object id of that application is to be provided in the technical profile(s).

NOTE: The Azure AD B2C directory typically includes Web API named `b2c-extensions-app`.  This application is primarily used by the b2c *built-in*  policies for the purpose of adding custom claims.  Using this application to register extensions for b2c *custom policies* is recommended for advanced users.


## Creating a new application to store the extension properties

1. Open a browsing session and navigate to the [Azure porta](https://portal.azure.com) and sign in with administrative credentials of the B2C Directory you wish to configure.
1. Click `Azure Active Directory` on the left navigation menu. You may need to search for by selecting More services>.
1. Select `App registrations` and click on `New application registration`
1. Provide the following recommended entries
* Specify a name for the web application: `WebApp-GraphAPI-DirectoryExtensions`
* Application type: Web app/API
* Sign-on URL:https://{tenantName}.onmicrosoft.com/WebApp-GraphAPI-DirectoryExtensions
1. Select `Create` . Successful completion will appear in the Notifications
1. Select the newly created web application: `WebApp-GraphAPI-DirectoryExtensions`
1. Select Settings: `Required permissions`
1. Select API `Windows Active Directory`
1. Place a checkmark in Application Permissions: `Read and write directory data`, and `Save`
1. Choose `Grant permissions` and confirm `Yes`.  Only admins of the necessary role can achieve this.
1. Copy to your clipboard and save the following from WebApp-GraphAPI-DirectoryExtensions>Settings>Properties>
*  `Application ID` . Example: `103ee0e6-f92d-4183-b576-8c3739027780`
* `Object ID`. Example : `80d8296a-da0a-49ee-b6ab-fd232aa45201`

## Modifying your custom policy to add the object id of the application

For every TechnicalProfile that will read or write extension attributes you will have to add a `<Metadata>` element with the two Items: ApplicationObjectId and ClientId which were obtained in earlier steps.

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
NOTE: The XML configuration above changes the TechnicalProfile Id="AAD-Common".  These TechnicalProfile elements are "common" because they are included in all the Azure Active Directory TechnicalProfiles with the element
```
      <IncludeTechnicalProfile ReferenceId="AAD-Common" />
```

When the TechnicalProfile effects the first WRITE to the newly created extension property, it will be created if not found.  A WRITE must precede a succesful READ.  Extension attributes in Graph API are named using the convention `extension_ApplicationObjectID_attributename`

## Using the new extension property / custom attribute in a userjourney
Custom policies refer to extensions attributes as extension_attributename, thus ommitting the ApplicationObjectId
We will modify the profile edit policy to collect an request a custom claim from the user and store it as a custom attribute (extension property)

1. Open the Relying Party(RP) file that describes your policy edit user journey.  If you are starting out, it may be advisable to dowload your already configured version of the RP-PolicyEdit file directly from the Azure B2C Custom Policy secion in the Azure Portal.  Alternative open your XML file from your storage folder.
1. Add a custom claim `loyaltyId` as shown below.  By including the custom claim in the `<RelyingParty>` element, it will be expected from the UserJourney and included in the token for the application,
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
1. Add a claim definition to the Extension policy file  `TrustFrameworkExtensions.xml` inside the ``<ClaimsSchema>`` element as shown below.
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
1. Add the same claim definition to the Base policy file `TrustFrameworkBase.xml` .  
NOTE: Adding a claimType definition in the base and the extensions file is normally not necessary, however since the next steps will add the extension_loyaltyId to TechnicalProfiles in the Base file, the policy validator will reject the upload of the base file without it.

NOTE: It may be useful to trace the execution of the userjourney named "ProfileEdit" in the TrustFrameworkBase.xml file.  a. Search in your XML editor and observe that Orchestration Step 5 invokes the TechnicalProfileReferenceID="SelfAsserted-ProfileUpdate".  b. "SelfAsserted-ProfileUpdate" has two OPTIONAL input and OutputClaims as givenName and surname.

1. Add loyaltyId as input and output claim in the TechnicalProfile "SelfAsserted-ProfileUpdate"

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
1. Add claim in TechnicalProfile "AAD-UserWriteProfileUsingObjectId" to persist the value of the claim in the extension property, for the current user in the directory.

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
1. Add claim in TechnicalProfile "AAD-UserReadUsingObjectId" to read the value of the extension attribute every time a user logs in.
NOTE: Thus far the TechnicalProfiles have been changed in the flow of local accounts only.  If the new attribute is desired in the flow of a social/federated account, a different set of TechnicalProfiles need to be changed. Follow the journey step, by step to identify those profiles

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

NOTE: The IncludeTechnicalProfile element above adds all the elements of AAD-Common to this TechnicalProfile.

## Test the custom policy using "Run Now"

     1. Open the **Azure AD B2C Blade** and navigate to **Identity Experience Framework > Custom policies**.
     1. Select the custom policy that you uploaded, and click the **Run now** button.
     1. You should be able to sign up using an email address.

The token back to your application will now include the new extension property as a custom claim preceded by extension_loyaltyId example below.

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

# Add the new claim to the flows for social account logins by changing the TechnicalProfiles listed below. These are used by social/federated account logins to write and read the user data using the alternativeSecurityId as the locator.
```
  <TechnicalProfile Id="AAD-UserWriteUsingAlternativeSecurityId">

  <TechnicalProfile Id="AAD-UserReadUsingAlternativeSecurityId">
```
# Customize the appearance of your userjourneys: [Customize UI in Custom - Walkthrough](https://needs.to.be.added)


## Reference

* A **Technical Profile (TP)** is an element type that can be thought of as a function that defines an endpoint’s name, its metadata, its protocol, and details the exchange of claims that the Identity Experience Framework should perform The Local Account SignIn is the TechnicalProfile used by the Identity Experience Framework to perform a local account login.
