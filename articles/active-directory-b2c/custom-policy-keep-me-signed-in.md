---
title: Keep Me Signed In in Azure Active Directory B2C
description: Learn how to set up Keep Me Signed In (KMSI) in Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 03/26/2020
ms.author: mimart
ms.subservice: B2C
---

# Enable Keep me signed in (KMSI) in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

You can enable Keep Me Signed In (KMSI) functionality for users of your web and native applications that have local accounts in your Azure Active Directory B2C (Azure AD B2C) directory. This feature grants access to users returning to your application without prompting them to reenter their username and password. This access is revoked when a user signs out.

Users should not enable this option on public computers.

![Example sign-up sign-in page showing a Keep me signed in checkbox](./media/custom-policy-keep-me-signed-in/kmsi.PNG)

## Prerequisites

- An Azure AD B2C tenant that is configured to allow local account sign-in. KMSI is unsupported for external identity provider accounts.
- Complete the steps in [Get started with custom policies](custom-policy-get-started.md).

## Configure the page identifier

To enable KMSI, set the content definition `DataUri` element to [page identifier](contentdefinitions.md#datauri) `unifiedssp` and [page version](page-layout.md) *1.1.0* or above.

1. Open the extension file of your policy. For example, <em>`SocialAndLocalAccounts/`**`TrustFrameworkExtensions.xml`**</em>. This extension file is one of the policy files included in the custom policy starter pack, which you should have obtained in the prerequisite, [Get started with custom policies](custom-policy-get-started.md).
1. Search for the **BuildingBlocks** element. If the element doesn't exist, add it.
1. Add the **ContentDefinitions** element to the **BuildingBlocks** element of the policy.

    Your custom policy should look like the following code snippet:

    ```xml
    <BuildingBlocks>
      <ContentDefinitions>
        <ContentDefinition Id="api.signuporsignin">
          <DataUri>urn:com:microsoft:aad:b2c:elements:unifiedssp:1.1.0</DataUri>
        </ContentDefinition>
      </ContentDefinitions>
    </BuildingBlocks>
    ```

## Add the metadata to the self-asserted technical profile

To add the KMSI checkbox to the sign-up and sign-in page, set the `setting.enableRememberMe` metadata to true. Override the SelfAsserted-LocalAccountSignin-Email technical profiles in the extension file.

1. Find the ClaimsProviders element. If the element doesn't exist, add it.
1. Add the following claims provider to the ClaimsProviders element:

```xml
<ClaimsProvider>
  <DisplayName>Local Account</DisplayName>
  <TechnicalProfiles>
    <TechnicalProfile Id="SelfAsserted-LocalAccountSignin-Email">
      <Metadata>
        <Item Key="setting.enableRememberMe">True</Item>
      </Metadata>
    </TechnicalProfile>
  </TechnicalProfiles>
</ClaimsProvider>
```

1. Save the extensions file.

## Configure a relying party file

Update the relying party (RP) file that initiates the user journey that you created.

1. Open your custom policy file. For example, *SignUpOrSignin.xml*.
1. If it doesn't already exist, add a `<UserJourneyBehaviors>` child node to the `<RelyingParty>` node. It must be located immediately after `<DefaultUserJourney ReferenceId="User journey Id" />`, for example: `<DefaultUserJourney ReferenceId="SignUpOrSignIn" />`.
1. Add the following node as a child of the `<UserJourneyBehaviors>` element.

    ```xml
    <UserJourneyBehaviors>
      <SingleSignOn Scope="Tenant" KeepAliveInDays="30" />
      <SessionExpiryType>Absolute</SessionExpiryType>
      <SessionExpiryInSeconds>1200</SessionExpiryInSeconds>
    </UserJourneyBehaviors>
    ```

    - **SessionExpiryType** - Indicates how the session is extended by the time specified in `SessionExpiryInSeconds` and  `KeepAliveInDays`. The `Rolling` value (default) indicates that the session is extended every time the user performs authentication. The `Absolute` value indicates that the user is forced to reauthenticate after the time period specified.

    - **SessionExpiryInSeconds**  - The lifetime of session cookies when *keep me signed in* is not enabled, or if a user does not select *keep me signed in*. The session expires after `SessionExpiryInSeconds` has passed, or the browser is closed.

    - **KeepAliveInDays** - The lifetime of session cookies when *keep me signed* in is enabled and  the user selects *keep me signed in*.  The value of `KeepAliveInDays` takes precedence over the `SessionExpiryInSeconds` value, and dictates the session expiry time. If a user closes the browser and reopens it later, they can still silently sign-in as long as it's within the KeepAliveInDays time period.

    For more information, see [user journey behaviors](relyingparty.md#userjourneybehaviors).

We recommend that you set the value of SessionExpiryInSeconds to be a short period (1200 seconds), while the value of KeepAliveInDays can be set to a relatively long period (30 days), as shown in the following example:

```xml
<RelyingParty>
  <DefaultUserJourney ReferenceId="SignUpOrSignIn" />
  <UserJourneyBehaviors>
    <SingleSignOn Scope="Tenant" KeepAliveInDays="30" />
    <SessionExpiryType>Absolute</SessionExpiryType>
    <SessionExpiryInSeconds>1200</SessionExpiryInSeconds>
  </UserJourneyBehaviors>
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
    </OutputClaims>
    <SubjectNamingInfo ClaimType="sub" />
  </TechnicalProfile>
</RelyingParty>
```

## Test your policy

1. Save your changes, and then upload the file.
1. To test the custom policy you uploaded, in the Azure portal, go to the policy page, and then select **Run now**.
1. Type your **username** and **password**, select **Keep me signed in**, and then click **sign-in**.
1. Go back to the Azure portal. Go to the policy page, and then select **Copy** to copy the sign-in URL.
1. In the browser address bar, remove the `&prompt=login` query string parameter, which forces the user to enter their credentials on that request.
1. In the browser, click **Go**. Now Azure AD B2C will issue an access token without prompting you to sign-in again. 

## Next steps

Find the sample policy [here](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/tree/master/scenarios/keep%20me%20signed%20in).
