---
title: Add claims and customize user input in custom policies
titleSuffix: Azure AD B2C
description: Learn how to customize user input and add claims to the sign-up or sign-in journey in Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 03/09/2020
ms.author: mimart
ms.subservice: B2C
---
#  Add claims and customize user input using custom policies in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

In this article, you add a new user provided entry (a claim) to your sign-up or sign-in policy in Azure Active Directory B2C (Azure AD B2C).  You configure a city entry as a dropdown, and define whether it's required.

Gathering initial data from your users is achieved using the sign-up or sign-in user journey. Additional claims can be gathered later by using a profile edit user journey. Anytime Azure AD B2C gathers information directly from the user interactively, the Identity Experience Framework uses its [self-asserted technical profile](self-asserted-technical-profile.md). In this sample, you:

1. Define a city claim.
1. Ask the user for their city.
1. Persist the city to the user profile in Azure AD directory
1. Read the city claim from the user profile.
1. Return the city to your relying party application.  

## Prerequisites

Complete the steps in [Get started with custom policies](custom-policy-get-started.md). You should have a working custom policy for sign-up and sign-in with local accounts.

## Define a claim

A claim provides a temporary storage of data during an Azure AD B2C policy execution. The [claims schema](claimsschema.md) is the place where you declare your claims. The following elements are used to define the claim:

- **DisplayName** - A string that defines the user-facing label.
- [DataType](claimsschema.md#datatype) - The type of the claim.
- **UserHelpText** - Helps the user understand what is required.
- [UserInputType](claimsschema.md#userinputtype) - The type of input control, such as textbox, radio selection, drop-down list, or multiple selections.

Open the extensions file of your policy. For example, <em>`SocialAndLocalAccounts/`**`TrustFrameworkExtensions.xml`**</em>. This extensions file is one of the policy files included in the custom policy starter pack, which you should have obtained in the prerequisite, [Get started with custom policies](https://docs.microsoft.com/azure/active-directory-b2c/active-directory-b2c-get-started-custom).

1. Search for the [BuildingBlocks](buildingblocks.md) element. If the element doesn't exist, add it.
1. Locate the [ClaimsSchema](claimsschema.md) element. If the element doesn't exist, add it.
1. Add the city claim to the **ClaimsSchema** element.  

```xml
<ClaimType Id="city">
  <DisplayName>City where you work</DisplayName>
  <DataType>string</DataType>
  <UserInputType>DropdownSingleSelect</UserInputType>
  <Restriction>
    <Enumeration Text="Bellevue" Value="bellevue" SelectByDefault="false" />
    <Enumeration Text="Redmond" Value="redmond" SelectByDefault="false" />
    <Enumeration Text="Kirkland" Value="kirkland" SelectByDefault="false" />
  </Restriction>
</ClaimType>
```

## Add city to the user interface

Following technical profiles are [self-asserted](self-asserted-technical-profile.md), where a user is expected to provide input:

- **LocalAccountSignUpWithLogonEmail** - Local account sign-up flow.
- **SelfAsserted-Social** - Federated account first-time user sign-in.
- **SelfAsserted-ProfileUpdate** - Edit profile flow.

To add the city claim as an `<OutputClaim ClaimTypeReferenceId="city"/>` to the technical profiles, you override them in the extension policy. You specify the entire list of the output claims, to control the order the claims are presented on the screen.  Find the **ClaimsProviders** element. Add a new ClaimsProviders as follows:

```xml
<ClaimsProvider>
  <DisplayName>Local Account</DisplayName>
  <TechnicalProfiles>
    <!--Local account sign-up page-->
    <TechnicalProfile Id="LocalAccountSignUpWithLogonEmail">
      <OutputClaims>
       <OutputClaim ClaimTypeReferenceId="email" PartnerClaimType="Verified.Email" Required="true" />
       <OutputClaim ClaimTypeReferenceId="newPassword" Required="true" />
       <OutputClaim ClaimTypeReferenceId="reenterPassword" Required="true" />
       <OutputClaim ClaimTypeReferenceId="displayName" />
       <OutputClaim ClaimTypeReferenceId="givenName" />
       <OutputClaim ClaimTypeReferenceId="surName" />
       <OutputClaim ClaimTypeReferenceId="city"/>
     </OutputClaims>
   </TechnicalProfile>
  </TechnicalProfiles>
</ClaimsProvider>
<ClaimsProvider>
  <DisplayName>Self Asserted</DisplayName>
  <TechnicalProfiles>
    <!--Federated account first-time sign-in page-->
    <TechnicalProfile Id="SelfAsserted-Social">
      <OutputClaims>
        <OutputClaim ClaimTypeReferenceId="displayName"/>
        <OutputClaim ClaimTypeReferenceId="givenName"/>
        <OutputClaim ClaimTypeReferenceId="surname"/>
        <OutputClaim ClaimTypeReferenceId="city"/>
      </OutputClaims>
    </TechnicalProfile>
    <!--Edit profile page-->
    <TechnicalProfile Id="SelfAsserted-ProfileUpdate">
      <OutputClaims>
        <OutputClaim ClaimTypeReferenceId="displayName"/>
        <OutputClaim ClaimTypeReferenceId="givenName" />
        <OutputClaim ClaimTypeReferenceId="surname" />
        <OutputClaim ClaimTypeReferenceId="city"/>
      </OutputClaims>
    </TechnicalProfile>
  </TechnicalProfiles>
</ClaimsProvider>
```

## Read and write the city

To persist the city to the user profile in the directory, you add `<PersistedClaim ClaimTypeReferenceId="city"/>` to the relevant technical profiles. To read the city from the user profile in the directory, you add `<OutputClaim ClaimTypeReferenceId="city"/>`.  

The following technical profiles are [Active Directory technical profile](active-directory-technical-profile.md), which read and write data to the Azure Active Directory. Find the **ClaimsProviders** element.  Add a new ClaimsProviders as follows:

```xml
<ClaimsProvider>
  <DisplayName>Azure Active Directory</DisplayName>
  <TechnicalProfiles>
    <!-- Write data during a local account sign-up flow. -->
    <TechnicalProfile Id="AAD-UserWriteUsingLogonEmail">
      <PersistedClaims>
        <PersistedClaim ClaimTypeReferenceId="city"/>
      </PersistedClaims>
    </TechnicalProfile>
    <!-- Write data during a federated account first-time sign-in flow. -->
    <TechnicalProfile Id="AAD-UserWriteUsingAlternativeSecurityId">
      <PersistedClaims>
        <PersistedClaim ClaimTypeReferenceId="city"/>
      </PersistedClaims>
    </TechnicalProfile>
    <!-- Write data during edit profile flow. -->
    <TechnicalProfile Id="AAD-UserWriteProfileUsingObjectId">
      <PersistedClaims>
        <PersistedClaim ClaimTypeReferenceId="city"/>
      </PersistedClaims>
    </TechnicalProfile>
    <!-- Read data after user authenticates with a local account. -->
    <TechnicalProfile Id="AAD-UserReadUsingEmailAddress">
      <OutputClaims>  
        <OutputClaim ClaimTypeReferenceId="city" />
      </OutputClaims>
    </TechnicalProfile>
    <!-- Read data after user authenticates with a federated account. -->
    <TechnicalProfile Id="AAD-UserReadUsingObjectId">
      <OutputClaims>  
        <OutputClaim ClaimTypeReferenceId="city" />
      </OutputClaims>
    </TechnicalProfile>
  </TechnicalProfiles>
</ClaimsProvider>
```

## Include the city in the token 

To return the city claim back to the relaying party application, add the `<OutputClaim ClaimTypeReferenceId="city" />` claim to the SignUpOrSignIn.xml file so that this claim is sent to the application in the token after a successful user journey. Modify the `TechnicalProfile Id="PolicyProfile"` element to add the city output claim as `<OutputClaim ClaimTypeReferenceId="city" />`.

Your final relying party should look like following XML snippet:
 
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
      <OutputClaim ClaimTypeReferenceId="tenantId" AlwaysUseDefaultValue="true" DefaultValue="{Policy:TenantObjectId}" />
      <OutputClaim ClaimTypeReferenceId="city" DefaultValue="" />
    </OutputClaims>
    <SubjectNamingInfo ClaimType="sub" />
  </TechnicalProfile>
</RelyingParty>
 ```

## Test the custom policy

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Make sure you're using the directory that contains your Azure AD tenant by selecting the **Directory + subscription** filter in the top menu and choosing the directory that contains your Azure AD tenant.
3. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **App registrations**.
4. Select **Identity Experience Framework**.
5. Select **Upload Custom Policy**, and then upload the two policy files that you changed.
2. Select the sign-up or sign-in policy that you uploaded, and click the **Run now** button.
3. You should be able to sign up using an email address.

The sign-up screen should look similar to this:

![Screenshot of modified sign-up option](./media/custom-policy-configure-user-input/signup-with-city-claim-dropdown-example.png)

The token sent back to your application includes the `city` claim.

```json
{
  "typ": "JWT",
  "alg": "RS256",
  "kid": "X5eXk4xyojNFum1kl2Ytv8dlNP4-c57dO6QGTVBwaNk"
}.{
  "exp": 1583500140,
  "nbf": 1583496540,
  "ver": "1.0",
  "iss": "https://contoso.b2clogin.com/f06c2fe8-709f-4030-85dc-38a4bfd9e82d/v2.0/",
  "aud": "e1d2612f-c2bc-4599-8e7b-d874eaca1ee1",
  "acr": "b2c_1a_signup_signin",
  "nonce": "defaultNonce",
  "iat": 1583496540,
  "auth_time": 1583496540,
  "name": "Emily Smith",
  "email": "joe@outlook.com",
  "given_name": "Emily",
  "family_name": "Smith",
  "city": "Bellevue"
  ...
}
```

## Next steps

- Learn more about [ClaimsSchema](claimsschema.md) element in the IEF reference.
- Learn how to [Use custom attributes in a custom profile edit policy](custom-policy-custom-attributes.md).
