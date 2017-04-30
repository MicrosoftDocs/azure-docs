---
title: 'Azure Active Directory B2C: Modify signup in custom policies and configure self asserted provider'
description: A walkthrough on adding claims to signup and configure the user input
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
# Azure Active Directory B2C: Modify signup to add new claims and configure user input.

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

After completing the steps in this article, you will have added new claims to your signup userjourney, configured how to capture user input with dropdowns, and determine required user entries


## Prerequisites

* Complete the steps in the article [Getting Started with Custom Policies](active-directory-b2c-get-started-custom.md).  Test the signup/signin userjourney to make sure it works before proceeding



Gathering additional information from your users can be achieved normally via the registration userjourney that we refer to as signup/signin, and via the profile edit user journey.  Anytime Azure AD B2C gathers information directly from the user interactively, the Identity Experience Framewrk uses its selfasserted provider.


In this article we will refer to the options offered in the Azure AD B2C Built-in policies user interface in the Azure portal and their *equivalents when using custom policies*

**Insert picture here from built-in policies**

## Define the claim, its display name and the user input type
We will use the claim type city.  Add the following element to the ClaimsSchema element in the extensions file:
```
        <ClaimType Id="city">
			<DisplayName>city</DisplayName>
			<DataType>string</DataType>
			<UserHelpText>Your city</UserHelpText>
			<UserInputType>TextBox</UserInputType>
		</ClaimType>
```
There are additional choices you can make here to customize the claim.  For a full list, refer to the **Technical Reference guide** which describes the full schema.
* <DisplayName> is a string that defines the user-facing *label*

* <UserHelpText> will be shown to the user interactively

* <UserInputType> has following options with examples:
    * `TextBox`
```
        <ClaimType Id="city">
			<DisplayName>city where you work</DisplayName>
			<DataType>string</DataType>
			<UserHelpText>Your city</UserHelpText>
			<UserInputType>TextBox</UserInputType>
		</ClaimType>
```

    * `RadioSingleSelectduration`
Allows the selection of only valid value.
*Insert picture*
```
    <ClaimType Id="city">
      <DisplayName>city where you work</DisplayName>
      <DataType>string</DataType>
      <UserInputType>RadioSingleSelect</UserInputType>
      <Restriction>
        <Enumeration Text="Bellevue" Value="bellevue" SelectByDefault="false" />
        <Enumeration Text="Redmond" Value="redmond" SelectByDefault="false" />
        <Enumeration Text="Kirkland" Value="kirkland" SelectByDefault="false" />
      </Restriction>
    </ClaimType>
```

    * `DropdownSingleSelect`
Allows the selection of only valid value.

*Insert picture*

```
<ClaimType Id="city">
       <DisplayName>city where you work</DisplayName>
       <DataType>string</DataType>
       <UserInputType>DropdownSingleSelect</UserInputType>
       <Restriction>
         <Enumeration Text="Bellevue" Value="bellevue" SelectByDefault="false" />
         <Enumeration Text="Redmond" Value="redmond" SelectByDefault="false" />
         <Enumeration Text="Kirkland" Value="kirkland" SelectByDefault="false" />
       </Restriction>
     </ClaimType>
```

    * `CheckboxMultiSelect`

Allows for the selection of one or more values.
*Insert picture*
```
<ClaimType Id="city">
        <DisplayName>Receive updates from which cities?</DisplayName>
        <DataType>string</DataType>
        <UserInputType>CheckboxMultiSelect</UserInputType>
        <Restriction>
          <Enumeration Text="Bellevue" Value="bellevue" SelectByDefault="false" />
          <Enumeration Text="Redmond" Value="redmond" SelectByDefault="false" />
          <Enumeration Text="Kirkland" Value="kirkland" SelectByDefault="false" />
        </Restriction>
      </ClaimType>
```

## Add the claim to the singup/sign userjourney

1. Add the claim to the TechnicalProfile LocalAccountSignUpWithLogonEmail so that the SelfAssertedAttributeProvider will ask the user for input interactively

```xml
<TechnicalProfile Id="LocalAccountSignUpWithLogonEmail">
          <DisplayName>Email signup</DisplayName>
          <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.SelfAssertedAttributeProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
          <Metadata>
            <Item Key="IpAddressClaimReferenceId">IpAddress</Item>
            <Item Key="ContentDefinitionReferenceId">api.localaccountsignup</Item>
            <Item Key="language.button_continue">Create</Item>
          </Metadata>
          <CryptographicKeys>
            <Key Id="issuer_secret" StorageReferenceId="TokenSigningKeyContainer" />
          </CryptographicKeys>
          <InputClaims>
            <InputClaim ClaimTypeReferenceId="email" />
          </InputClaims>
          <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="objectId" />
            <OutputClaim ClaimTypeReferenceId="email" PartnerClaimType="Verified.Email" Required="true" />
            <OutputClaim ClaimTypeReferenceId="newPassword" Required="true" />
            <OutputClaim ClaimTypeReferenceId="reenterPassword" Required="true" />
            <OutputClaim ClaimTypeReferenceId="executed-SelfAsserted-Input" DefaultValue="true" />
            <OutputClaim ClaimTypeReferenceId="authenticationSource" />
            <OutputClaim ClaimTypeReferenceId="newUser" />
            <!-- Optional claims, to be collected from the user -->
            <OutputClaim ClaimTypeReferenceId="givenName" />
            <OutputClaim ClaimTypeReferenceId="surName" />

			<OutputClaim ClaimTypeReferenceId="city"

          </OutputClaims>
          <ValidationTechnicalProfiles>
            <ValidationTechnicalProfile ReferenceId="AAD-UserWriteUsingLogonEmail" />
          </ValidationTechnicalProfiles>
          <UseTechnicalProfileForSessionManagement ReferenceId="SM-AAD" />
        </TechnicalProfile>
```

1. Add the claim to the AAD-UserWriteUsingLogonEmail to write the claim to the AAD directory after collecting it from the user

```xml
<!-- Technical profiles for local accounts -->
        <TechnicalProfile Id="AAD-UserWriteUsingLogonEmail">
          <Metadata>
            <Item Key="Operation">Write</Item>
            <Item Key="RaiseErrorIfClaimsPrincipalAlreadyExists">true</Item>
          </Metadata>
          <IncludeInSso>false</IncludeInSso>
          <InputClaims>
            <InputClaim ClaimTypeReferenceId="email" PartnerClaimType="signInNames.emailAddress" Required="true" />
          </InputClaims>
          <PersistedClaims>
            <!-- Required claims -->
            <PersistedClaim ClaimTypeReferenceId="email" PartnerClaimType="signInNames.emailAddress" />
            <PersistedClaim ClaimTypeReferenceId="newPassword" PartnerClaimType="password" />
            <PersistedClaim ClaimTypeReferenceId="displayName" DefaultValue="unknown" />
            <PersistedClaim ClaimTypeReferenceId="passwordPolicies" DefaultValue="DisablePasswordExpiration" />
            <!-- Optional claims. -->
            <PersistedClaim ClaimTypeReferenceId="givenName" />
            <PersistedClaim ClaimTypeReferenceId="surname" />

			<PersistedClaim ClaimTypeReferenceId="city" />

          </PersistedClaims>
          <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="objectId" />
            <OutputClaim ClaimTypeReferenceId="newUser" PartnerClaimType="newClaimsPrincipalCreated" />
            <OutputClaim ClaimTypeReferenceId="authenticationSource" DefaultValue="localAccountAuthentication" />
            <OutputClaim ClaimTypeReferenceId="userPrincipalName" />
            <OutputClaim ClaimTypeReferenceId="signInNames.emailAddress" />
          </OutputClaims>
          <IncludeTechnicalProfile ReferenceId="AAD-Common" />
          <UseTechnicalProfileForSessionManagement ReferenceId="SM-AAD" />
        </TechnicalProfile>
```

1. Add the claim to the TechnicalProfile that reads from the directory when a user logs in

```xml
<TechnicalProfile Id="AAD-UserReadUsingEmailAddress">
  <Metadata>
    <Item Key="Operation">Read</Item>
    <Item Key="RaiseErrorIfClaimsPrincipalDoesNotExist">true</Item>
    <Item Key="UserMessageIfClaimsPrincipalDoesNotExist">An account could not be found for the provided user ID.</Item>
  </Metadata>
  <IncludeInSso>false</IncludeInSso>
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="email" PartnerClaimType="signInNames" Required="true" />
  </InputClaims>
  <OutputClaims>
    <!-- Required claims -->
    <OutputClaim ClaimTypeReferenceId="objectId" />
    <OutputClaim ClaimTypeReferenceId="authenticationSource" DefaultValue="localAccountAuthentication" />
    <!-- Optional claims -->
    <OutputClaim ClaimTypeReferenceId="userPrincipalName" />
    <OutputClaim ClaimTypeReferenceId="displayName" />
    <OutputClaim ClaimTypeReferenceId="otherMails" />
    <OutputClaim ClaimTypeReferenceId="signInNames.emailAddress" />

    <OutputClaim ClaimTypeReferenceId="city" />

  </OutputClaims>
  <IncludeTechnicalProfile ReferenceId="AAD-Common" />
</TechnicalProfile>
```

1. Add the claim to the RP policy file so it is sent to the application in the token
In the file SignUporSignIn.xml (RP file) add the *city* claim as shown below

```xml
<RelyingParty>
    <DefaultUserJourney ReferenceId="SignUpOrSignIn" />
    <TechnicalProfile Id="PolicyProfile">
      <DisplayName>PolicyProfile</DisplayName>
      <Protocol Name="OpenIdConnect" />
      <OutputClaims>
        <OutputClaim ClaimTypeReferenceId="displayName" />
        <OutputClaim ClaimTypeReferenceId="givenName" />
        <OutputClaim ClaimTypeReferenceId="surname" />
        <OutputClaim ClaimTypeReferenceId="email" />
        <OutputClaim ClaimTypeReferenceId="objectId" PartnerClaimType="sub"/>
        <OutputClaim ClaimTypeReferenceId="identityProvider" />

		<OutputClaim ClaimTypeReferenceId="city" />

      </OutputClaims>
      <SubjectNamingInfo ClaimType="sub" />
    </TechnicalProfile>
  </RelyingParty>
  ```





  ## Test the custom policy using "Run Now"

       1. Open the **Azure AD B2C Blade** and navigate to **Identity Experience Framework > Custom policies**.
       1. Select the custom policy that you uploaded, and click the **Run now** button.
       1. You should be able to sign up using an email address.

  The token back to your application will now include the city claim.
```
{
  "exp": 1493596822,
  "nbf": 1493593222,
  "ver": "1.0",
  "iss": "https://login.microsoftonline.com/f06c2fe8-709f-4030-85dc-38a4bfd9e82d/v2.0/",
  "sub": "9c2a3a9e-ac65-4e46-a12d-9557b63033a9",
  "aud": "4e87c1dd-e5f5-4ac8-8368-bc6a98751b8b",
  "acr": "b2c_1a_trustf_signup_signin",
  "nonce": "defaultNonce",
  "iat": 1493593222,
  "auth_time": 1493593222,
  "email": "joer2d2@outlook.com",
  "given_name": "Joe",
  "family_name": "Ras",
  "city": "Bellevue",
  "name": "unknown"
}
```

## OPTIONAL - Remove email verification from signup journey

To skip email verification, the policy author can remove `PartnerClaimType="Verified.Email"`. The email address will be required but not verified, unless “Required” = true is removed.

This is how the default email OutputClaim is in the local account sign up self-asserted technical profile of starter pack:

```
            <OutputClaim ClaimTypeReferenceId="email" PartnerClaimType="Verified.Email" Required="true" />
```


## Next steps

# Add the new claim to the flows for social account logins by changing the TechnicalProfiles listed below. These are used by social/federated account logins to write and read the user data using the alternativeSecurityId as the locator.
```
  <TechnicalProfile Id="AAD-UserWriteUsingAlternativeSecurityId">

  <TechnicalProfile Id="AAD-UserReadUsingAlternativeSecurityId">
```
# Customize the appearance of your userjourneys: [Customize UI in Custom - Walkthrough](https://needs.to.be.added)


## Reference

* Download the Technical Reference Guide  at **DOWNLOAD LINK PDF**
