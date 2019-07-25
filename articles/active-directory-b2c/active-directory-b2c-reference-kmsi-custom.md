---
title: Keep Me Signed In in Azure Active Directory B2C | Microsoft Docs
description: Learn how to set up Keep Me Signed In (KMSI) in Azure Active Directory B2C.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 12/03/2018
ms.author: marsma
ms.subservice: B2C
---

# Enable Keep me signed in (KMSI) in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

You can enable Keep Me Signed In (KMSI) functionality for your web and native applications in Azure Active Directory (Azure AD) B2C. This feature grants access to returning users to the application without prompting them to reenter their username and password. This access is revoked when a user signs out.

Users should not enable this option on public computers.

![Example sign-up sign-in page showing a Keep me signed in checkbox](./media/active-directory-b2c-reference-kmsi-custom/kmsi.PNG)

## Prerequisites

An Azure AD B2C tenant that is configured to allow local account sign-up and sign-in. If you don't have a tenant, you can create one using the steps in [Tutorial: Create an Azure Active Directory B2C tenant](tutorial-create-tenant.md).

## Add a content definition element

Under the **BuildingBlocks** element of your extension file, add a **ContentDefinitions** element.

1. Under the **ContentDefinitions** element, add a **ContentDefinition** element with an identifier of `api.signuporsigninwithkmsi`.
2. Under the **ContentDefinition** element, add the **LoadUri**, **RecoveryUri**, and **DataUri** elements. The `urn:com:microsoft:aad:b2c:elements:unifiedssp:1.1.0` value of the **DataUri** element is a machine understandable identifier that brings up a KMSI check box in the sign-in pages. This value must not be changed.

    ```XML
    <BuildingBlocks>
      <ContentDefinitions>
        <ContentDefinition Id="api.signuporsigninwithkmsi">
          <LoadUri>~/tenant/default/unified.cshtml</LoadUri>
          <RecoveryUri>~/common/default_page_error.html</RecoveryUri>
          <DataUri>urn:com:microsoft:aad:b2c:elements:unifiedssp:1.1.0</DataUri>
          <Metadata>
            <Item Key="DisplayName">Signin and Signup</Item>
          </Metadata>
        </ContentDefinition>
      </ContentDefinitions>
    </BuildingBlocks>
    ```

## Add a sign-in claims provider for a local account

You can define local account sign-in as a claims provider using the **ClaimsProvider** element in the extension file of your policy:

1. Open the *TrustFrameworkExtensions.xml* file from your working directory.
2. Find the **ClaimsProviders** element. If it doesn't exist, add it under the root element. The [starter pack](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/archive/master.zip) includes a local account sign-in claims provider.
3. Add a **ClaimsProvider** element with the **DisplayName** and **TechnicalProfile** as shown in the following example:

    ```XML
    <ClaimsProviders>
      <ClaimsProvider>
        <DisplayName>Local Account SignIn</DisplayName>
        <TechnicalProfiles>
          <TechnicalProfile Id="login-NonInteractive">
            <Metadata>
              <Item Key="client_id">ProxyIdentityExperienceFrameworkAppId</Item>
              <Item Key="IdTokenAudience">IdentityExperienceFrameworkAppId</Item>
            </Metadata>
            <InputClaims>
              <InputClaim ClaimTypeReferenceId="client_id" DefaultValue="ProxyIdentityExperienceFrameworkAppID" />
              <InputClaim ClaimTypeReferenceId="resource_id" PartnerClaimType="resource" DefaultValue="IdentityExperienceFrameworkAppID" />
            </InputClaims>
          </TechnicalProfile>
        </TechnicalProfiles>
      </ClaimsProvider>
    </ClaimsProviders>
    ```

### Add the application identifiers to your custom policy

Add the application identifiers to the *TrustFrameworkExtensions.xml* file.

1. In the *TrustFrameworkExtensions.xml* file, find the **TechnicalProfile** element with the identifier of `login-NonInteractive` and the **TechnicalProfile** element with an identifier of `login-NonInteractive-PasswordChange` and replace all values of `IdentityExperienceFrameworkAppId` with the application identifier of the Identity Experience Framework application as described in [Getting started](active-directory-b2c-get-started-custom.md).

    ```
    <Item Key="client_id">8322dedc-cbf4-43bc-8bb6-141d16f0f489</Item>
    ```

2. Replace all values of `ProxyIdentityExperienceFrameworkAppId` with the application identifier of the Proxy Identity Experience Framework application as described in [Getting started](active-directory-b2c-get-started-custom.md).
3. Save the extensions file.

## Create a KMSI enabled user journey

Add the sign-in claims provider for a local account to your user journey.

1. Open the base file of your policy. For example, *TrustFrameworkBase.xml*.
2. Find the **UserJourneys** element and copy the entire contents of the **UserJourney** element that uses the identifier of `SignUpOrSignIn`.
3. Open the extension file. For example, *TrustFrameworkExtensions.xml* and find the **UserJourneys** element. If the element doesn't exist, add one.
4. Paste the entire **UserJourney** element that you copied as a child of the **UserJourneys** element.
5. Change the value of the identifier for the new user journey. For example, `SignUpOrSignInWithKmsi`.
6. Finally, in the first orchestration step change the value of **ContentDefinitionReferenceId** to `api.signuporsigninwithkmsi`. The setting of this value enables the checkbox in the user journey.
7. Save and upload the extension file and make sure that all validations succeed.

    ```XML
    <UserJourneys>
      <UserJourney Id="SignUpOrSignInWithKmsi">
        <OrchestrationSteps>
          <OrchestrationStep Order="1" Type="CombinedSignInAndSignUp" ContentDefinitionReferenceId="api.signuporsigninwithkmsi">
            <ClaimsProviderSelections>
              <ClaimsProviderSelection ValidationClaimsExchangeId="LocalAccountSigninEmailExchange" />
            </ClaimsProviderSelections>
            <ClaimsExchanges>
              <ClaimsExchange Id="LocalAccountSigninEmailExchange" TechnicalProfileReferenceId="SelfAsserted-LocalAccountSignin-Email" />
            </ClaimsExchanges>
          </OrchestrationStep>
          <OrchestrationStep Order="2" Type="ClaimsExchange">
            <Preconditions>
              <Precondition Type="ClaimsExist" ExecuteActionsIf="true">
                <Value>objectId</Value>
                <Action>SkipThisOrchestrationStep</Action>
              </Precondition>
            </Preconditions>
            <ClaimsExchanges>
              <ClaimsExchange Id="SignUpWithLogonEmailExchange" TechnicalProfileReferenceId="LocalAccountSignUpWithLogonEmail" />
            </ClaimsExchanges>
          </OrchestrationStep>
          <!-- This step reads any user attributes that we may not have received when in the token. -->
          <OrchestrationStep Order="3" Type="ClaimsExchange">
            <ClaimsExchanges>
              <ClaimsExchange Id="AADUserReadWithObjectId" TechnicalProfileReferenceId="AAD-UserReadUsingObjectId" />
            </ClaimsExchanges>
          </OrchestrationStep>
          <OrchestrationStep Order="4" Type="SendClaims" CpimIssuerTechnicalProfileReferenceId="JwtIssuer" />
        </OrchestrationSteps>
        <ClientDefinition ReferenceId="DefaultWeb" />
      </UserJourney>
    </UserJourneys>
    ```

## Create a relying party file

Update the relying party (RP) file that initiates the user journey that you created.

1. Make a copy of *SignUpOrSignIn.xml* file in your working directory, and then rename it. For example, *SignUpOrSignInWithKmsi.xml*.
2. Open the new file and update the **PolicyId** attribute for the **TrustFrameworkPolicy** with a unique value. This is the name of your policy. For example, `SignUpOrSignInWithKmsi`.
3. Change the **ReferenceId** attribute for the **DefaultUserJourney** element to match the identifier of the new user journey that you created. For example, `SignUpOrSignInWithKmsi`.

    KMSI is configured using the **UserJourneyBehaviors** element with **SingleSignOn**, **SessionExpiryType**, and **SessionExpiryInSeconds** as its first child elements. The **KeepAliveInDays** attribute controls how long the user remains signed in. In the following example, the KMSI session automatically expires after `7` days regardless of how often the user performs silent authentication. Setting the **KeepAliveInDays**  value to `0` turns off KMSI functionality. By default, this value is `0`. If the value of **SessionExpiryType** is `Rolling`, the KMSI session is extended by `7` days every time the user performs silent authentication.  If `Rolling` is selected, you should keep the number of days to minimum.

    The value of **SessionExpiryInSeconds** represents the expiry time of an SSO session. This is used internally by Azure AD B2C to check whether the session for KMSI is expired or not. The value of **KeepAliveInDays** determines the Expires/Max-Age value of the SSO cookie in the web browser. Unlike **SessionExpiryInSeconds**, **KeepAliveInDays** is used to prevent the browser from clearing the cookie when it's closed. A user can silently sign in only if the SSO session cookie exists, which is controlled by **KeepAliveInDays**, and isn't expired, which is controlled by **SessionExpiryInSeconds**.

    If a user doesn't enable **Keep me signed in** on the sign-up and sign-in page, a session expires after the time indicated by **SessionExpiryInSeconds** has passed or the browser is closed. If a user enables **Keep me signed in**, the value of **KeepAliveInDays** overrides the value of **SessionExpiryInSeconds** and dictates the session expiry time. Even if users close the browser and open it again, they can still silently sign-in as long as it's within the time of **KeepAliveInDays**. It is recommended that you set the value of **SessionExpiryInSeconds** to be a short period (1200 seconds), while the value of **KeepAliveInDays** can be set to a relatively long period (7 days), as shown in the following example:

    ```XML
    <RelyingParty>
      <DefaultUserJourney ReferenceId="SignUpOrSignInWithKmsi" />
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
        </OutputClaims>
        <SubjectNamingInfo ClaimType="sub" />
      </TechnicalProfile>
    </RelyingParty>
    ```

4. Save your changes and then upload the file.
5. To test the custom policy that you uploaded, in the Azure portal, go to the policy page, and then select **Run now**.

You can find the sample policy [here](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/tree/master/scenarios/keep%20me%20signed%20in).








