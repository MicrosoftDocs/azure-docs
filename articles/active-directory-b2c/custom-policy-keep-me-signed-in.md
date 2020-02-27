---
title: Keep Me Signed In in Azure Active Directory B2C
description: Learn how to set up Keep Me Signed In (KMSI) in Azure Active Directory B2C.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 02/27/2020
ms.author: marsma
ms.subservice: B2C
---

# Enable Keep me signed in (KMSI) in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

You can enable Keep Me Signed In (KMSI) functionality for users of your web and native applications that have local accounts in your Azure Active Directory B2C (Azure AD B2C) directory. This feature grants access to users returning to your application without prompting them to reenter their username and password. This access is revoked when a user signs out.

Users should not enable this option on public computers.

![Example sign-up sign-in page showing a Keep me signed in checkbox](./media/custom-policy-keep-me-signed-in/kmsi.PNG)

## Prerequisites

- An Azure AD B2C tenant that is configured to allow local account sign-in. KMSI is unsupported for external identity provider accounts.
- Complete the steps in [Get started with custom policies in Active Directory B2C](custom-policy-get-started.md).

## Configure the page identifier 

To enable keep me signed in, you need to set the content definition `DataUri` element to [page identifier](contentdefinitions#datauri) `unifiedssp`, [page version](page-layout.md) *1.1.0* and above.

1. Open the extension file of your policy. For example, <em>`SocialAndLocalAccounts/`**`TrustFrameworkExtensions.xml`**</em>. This extension file is one of the policy files included in the custom policy starter pack, which you should have obtained in the prerequisite, [Get started with custom policies](https://docs.microsoft.com/azure/active-directory-b2c/active-directory-b2c-get-started-custom).
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
    
1. Save the extensions file.



## Configure a relying party file

Update the relying party (RP) file that initiates the user journey that you created.

1. Open your custom policy file. For example, *SignUpOrSignin.xml*.

    KMSI is configured using the **UserJourneyBehaviors** element with **SingleSignOn**, **SessionExpiryType**, and **SessionExpiryInSeconds** as its first child elements. The **KeepAliveInDays** attribute controls how long the user remains signed in. In the following example, the KMSI session automatically expires after `7` days regardless of how often the user performs silent authentication. Setting the **KeepAliveInDays**  value to `0` turns off KMSI functionality. By default, this value is `0`. If the value of **SessionExpiryType** is `Rolling`, the KMSI session is extended by `7` days every time the user performs silent authentication.  If `Rolling` is selected, you should keep the number of days to minimum.

    The value of **SessionExpiryInSeconds** represents the expiry time of an SSO session. This is used internally by Azure AD B2C to check whether the session for KMSI is expired or not. The value of **KeepAliveInDays** determines the Expires/Max-Age value of the SSO cookie in the web browser. Unlike **SessionExpiryInSeconds**, **KeepAliveInDays** is used to prevent the browser from clearing the cookie when it's closed. A user can silently sign in only if the SSO session cookie exists, which is controlled by **KeepAliveInDays**, and isn't expired, which is controlled by **SessionExpiryInSeconds**.

    If a user doesn't enable **Keep me signed in** on the sign-up and sign-in page, a session expires after the time indicated by **SessionExpiryInSeconds** has passed or the browser is closed. If a user enables **Keep me signed in**, the value of **KeepAliveInDays** overrides the value of **SessionExpiryInSeconds** and dictates the session expiry time. Even if users close the browser and open it again, they can still silently sign-in as long as it's within the time of **KeepAliveInDays**. It is recommended that you set the value of **SessionExpiryInSeconds** to be a short period (1200 seconds), while the value of **KeepAliveInDays** can be set to a relatively long period (7 days), as shown in the following example:

    ```XML
    <RelyingParty>
      <DefaultUserJourney ReferenceId="SignUpOrSignIn" />
      <UserJourneyBehaviors>
        <SingleSignOn Scope="Tenant" KeepAliveInDays="7" />
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

4. Save your changes and then upload the file.
5. To test the custom policy that you uploaded, in the Azure portal, go to the policy page, and then select **Run now**.

You can find the sample policy [here](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/tree/master/scenarios/keep%20me%20signed%20in).
