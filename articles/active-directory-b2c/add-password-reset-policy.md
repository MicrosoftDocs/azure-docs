---
title: Set up a password reset flow
titleSuffix: Azure AD B2C
description: Learn how to set up a password reset flow in Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 02/03/2021
ms.author: mimart
ms.subservice: B2C
zone_pivot_groups: b2c-policy-type
---

# Set up a password reset flow in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]

## Password rest flow

The [Sign In and Sign Up journey](add-sign-up-and-sign-in-policy.md) allows users to reset their password using the **Forgot your password?** link. The password reset flow involves following steps:

1. From the sign-up and sign-in page, user clicks on the "Forgot your password?" link. Azure AD B2C initiates the password reset flow. 
1. Users provide and verify their email with a Timed One Time Passcode.
1. Enter a new password.

![Password reset flow](./media/add-password-reset-policy/password-reset-flow.png)

The password reset flow is applicable to local accounts in Azure AD B2C that use an [email address](identity-provider-local.md#email-sign-in) or [username](identity-provider-local.md#username-sign-in) with a password for sign-in. The password reset flow doesn't apply to federated accounts.

A common practice after migrating users to Azure AD B2C with random passwords is to have the users verify their email addresses and reset their passwords during first sign-in. Or force reset the password after administrator change the password. To enable this feature see [force password reset](force-password-reset.md).

## Prerequisites

[!INCLUDE [active-directory-b2c-customization-prerequisites](../../includes/active-directory-b2c-customization-prerequisites.md)]

## Self-Service password reset (recommended)

The self-Service password reset new feature enables password reset functionality for users by clicking on the ‘Forgot your password’ link. The new password reset experience is now part of the sign-up or sign-in policy. Azure AD B2C doesn't return the [AADB2C90118 error code](#password-reset-policy-legacy) to your application. With the new experience, your application doesn't need to handle the error code, nor having separate policies for sign-in and password reset.

::: zone pivot="b2c-user-flow"

The self-service password reset experience available to user flows type of **Sign in (Recommended)**, or **Sign up and sign in (Recommended)** only. If you don't have such a user flow, create a [sign In and Sign Up](add-sign-up-and-sign-in-policy.md) user flow. 

To enable the Self-Service password reset to the sign-up or sign-in user flow:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + Subscription** icon in the portal toolbar, and then select the directory that contains your Azure AD B2C tenant.
1. In the Azure portal, search for and select **Azure AD B2C**.
1. Select **User flows**.
1. Select a sign-up or sign-in (type of Recommended) user flow you want to customize.
1. Under **Settings** in the left menu, select **Properties**.
1. Under **Password complexity**, select **Self-service password reset**.
1. Select **Save**.
1. Under **Customize** in the left menu, select **Page layouts**.
1. In the **Page Layout Version**, choose **2.1.2 - Current**, or above.
1. Select **Save**.

::: zone-end

::: zone pivot="b2c-custom-policy"

The following sections describe how to add self-service password experience to a custom policy. The sample is based on the policy files included in the custom policy starter pack, which you should have obtained in the prerequisite, [Get started with custom policies](./custom-policy-get-started.md). 

> [!TIP]
> You can find a complete sample of the password reset policy on [GitHub](https://github.com/azure-ad-b2c/samples/tree/master/policies/embedded-password-reset).

### Define a claim

A claim provides a temporary storage of data during an Azure AD B2C policy execution. The [claims schema](claimsschema.md) is the place where you declare your claims. Open the extensions file of your policy. For example, <em>`SocialAndLocalAccounts/`**`TrustFrameworkExtensions.xml`**</em>.

1. Search for the [BuildingBlocks](buildingblocks.md) element. If the element doesn't exist, add it.
1. Locate the [ClaimsSchema](claimsschema.md) element. If the element doesn't exist, add it.
1. Add the following claim to the **ClaimsSchema** element.  

```XML
<ClaimType Id="isForgotPassword">
  <DisplayName>isForgotPassword</DisplayName>
  <DataType>boolean</DataType>
  <AdminHelpText>Whether the user has clicked Forgot Password</AdminHelpText>
</ClaimType>
```

### Select the page layout version

Next you set a content definition with [page layout version](contentdefinitions.md#migrating-to-page-layout) `2.1.2`. This page version (or above) is required to enable the self-service password reset.

1. Search for the [BuildingBlocks](buildingblocks.md) element. If the element doesn't exist, add it.
1. Locate the [ContentDefinitions](contentdefinitions.md) element. If the element doesn't exist, add it.
1. Add the following claim to the **ContentDefinition** element.  

```xml
<ContentDefinition Id="api.signuporsignin">
  <DataUri>urn:com:microsoft:aad:b2c:elements:contract:unifiedssp:2.1.2</DataUri>
  <Metadata>
    <Item Key="setting.forgotPasswordLinkOverride">ForgotPasswordExchange</Item>
  </Metadata>
</ContentDefinition>
```

The `setting.forgotPasswordLinkOverride` indicates the claims exchange to be execute. Alternatively, you can set the metadata in the following technical profile.

```xml
<TechnicalProfile Id="SelfAsserted-LocalAccountSignin-Email">
  <Metadata>
    <Item Key="setting.forgotPasswordLinkOverride">ForgotPasswordExchange</Item>
  </Metadata>
</TechnicalProfile>
```

### Add a technical profile

The following claims transformation technical profile set the value of the `isForgotPassword` claim to true. This claim is used later in the user flow as an indication that users click on the **Forgot your password?** link. Find the `ClaimsProviders` element. If the element doesn't exist, add it. Add the following claims provider:  

```xml
<ClaimsProvider>
  <DisplayName>Local Account</DisplayName>
  <TechnicalProfiles>
    <TechnicalProfile Id="ForgotPassword">
      <DisplayName>Forgot your password?</DisplayName>
      <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.ClaimsTransformationProtocolProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null"/>
      <OutputClaims>
        <OutputClaim ClaimTypeReferenceId="isForgotPassword" DefaultValue="true" AlwaysUseDefaultValue="true"/>
      </OutputClaims>
    </TechnicalProfile>
  </TechnicalProfiles>
</ClaimsProvider>
```

### Add the password reset sub journey

[Sub journeys](subjourneys.md) is represented as an orchestration sequence that must be followed through for a successful transaction, such as password reset. The sub journey is called from a user journey. The type of the sub journey is `Call`, the sub journey executes, and then control is returned to the  orchestration step that is currently executing within the user journey.

Find the `SubJourneys` element. If the element doesn't exist, add it. Add the following sub journey:

```xml
<SubJourney Id="PasswordReset" Type="Call">
  <OrchestrationSteps>
    <!-- Validate user's email address. -->
    <OrchestrationStep Order="1" Type="ClaimsExchange">
      <ClaimsExchanges>
        <ClaimsExchange Id="PasswordResetUsingEmailAddressExchange" TechnicalProfileReferenceId="LocalAccountDiscoveryUsingEmailAddress" />
      </ClaimsExchanges>
    </OrchestrationStep>

    <!-- Collect and persist a new password. -->
    <OrchestrationStep Order="2" Type="ClaimsExchange">
      <ClaimsExchanges>
        <ClaimsExchange Id="NewCredentials" TechnicalProfileReferenceId="LocalAccountWritePasswordUsingObjectId" />
      </ClaimsExchanges>
    </OrchestrationStep>
  </OrchestrationSteps>
</SubJourney>
``` 

### Add a user journey 

At this point, the password reset sub journey has been set up, but it's not yet available in any of the sign-in pages. If you don't have your own custom user journey, create a duplicate of an existing template user journey, otherwise continue to the next step. 

1. Open the *TrustFrameworkBase.xml* file from the starter pack.
1. Find and copy the entire contents of the **UserJourney** element that includes `Id="SignUpOrSignIn"`.
1. Open the *TrustFrameworkExtensions.xml* and find the **UserJourneys** element. If the element doesn't exist, add one.
1. Paste the entire content of the **UserJourney** element that you copied as a child of the **UserJourneys** element.
1. Rename the Id of the user journey. For example, `Id="CustomSignUpSignIn"`.

### Add the password reset to a user journey

Now that you have a user journey, add the new identity provider to the user journey. 

1. Find the orchestration step element that includes `Type="CombinedSignInAndSignUp"`, or `Type="ClaimsProviderSelection"` in the user journey. It's usually the first orchestration step. The **ClaimsProviderSelections** element contains a list of identity providers that a user can sign in with. Add the following line:
    
    ```xml
    <ClaimsProviderSelection TargetClaimsExchangeId="ForgotPasswordExchange" />
    ```

1. In the next orchestration step, add a **ClaimsExchange** element. Add the following line:

    ```xml
    <ClaimsExchange Id="ForgotPasswordExchange" TechnicalProfileReferenceId="ForgotPassword" />
    ```

### Configure the relying party policy

The relying party policy, for example [SignUpSignIn.xml](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/blob/master/SocialAndLocalAccounts/SignUpOrSignin.xml), specifies the user journey which Azure AD B2C will execute. Find the **DefaultUserJourney** element within [relying party](../articles/active-directory-b2c/relyingparty.md). Update the  **ReferenceId** to match the user journey ID, in which you added the identity provider. 

In the following example, for the `CustomSignUpOrSignIn` user journey, the **ReferenceId** is set to `CustomSignUpOrSignIn`. You may also want to add the `isForgotPassword` to the output claims. Your application can check the return token's `isForgotPassword` claim whether the user resets the password.

```xml
<RelyingParty>
  <DefaultUserJourney ReferenceId="CustomSignUpSignIn" />
  ...
  <OutputClaims>
    ...
    <OutputClaim ClaimTypeReferenceId="isForgotPassword" DefaultValue="false" />
  </OutputClaims>
</RelyingParty>
```


### Upload the custom policy

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + Subscription** icon in the portal toolbar, and then select the directory that contains your Azure AD B2C tenant.
1. In the Azure portal, search for and select **Azure AD B2C**.
1. Under **Policies**, select **Identity Experience Framework**.
1. Select **Upload Custom Policy**, and then upload the two policy files that you changed, in the following order: the extension policy, for example `TrustFrameworkExtensions.xml`, then the relying party policy, such as `SignUpSignIn.xml`.

::: zone-end

### Test the password reset flow

1. Select a sign-up or sign-in (type of Recommended) user flow you want to test.
1. Select **Run user flow**.
1. For **Application**, select the web application named *webapp1* that you previously registered. The **Reply URL** should show `https://jwt.ms`.
1. Select **Run user flow**
1. From the sign-up or sign-in page, select **Forgot your password?**.
1. Verify the email address of the account that you previously created, and select **Continue**.
1. You now have the opportunity to change the password for the user. Change the password and select **Continue**. The token is returned to `https://jwt.ms` and should be displayed to you.
1. Check the return token's `isForgotPassword` claim value. If exists and set to true, it indicates the user reset the password.

## Password reset policy (legacy)

If the [self-service password reset](#self-service-password-reset-recommended) is not enabled, clicking this link doesn't automatically trigger a password reset user flow. Instead, the error code `AADB2C90118` is returned to your application. Your application needs to handle this error code by reinitialize the authentication library to authenticate at a Password Reset user flow. To see an example, take a look at a [simple ASP.NET sample](https://github.com/AzureADQuickStarts/B2C-WebApp-OpenIDConnect-DotNet-SUSI) that demonstrates the linking of user flows.

::: zone pivot="b2c-user-flow"

### Create a password reset user flow

To enable users of your application to reset their password, you create a password reset user flow.

1. In the Azure AD B2C tenant overview menu, select **User flows**, and then select **New user flow**.
1. On the **Create a user flow** page, select the **Password reset** user flow. 
1. Under **Select a version**, select **Recommended**, and then select **Create**.
1. Enter a **Name** for the user flow. For example, *passwordreset1*.
1. For **Identity providers**, enable **Reset password using email address**.
1. Under Application claims, click **Show more** and choose the claims that you want returned in the authorization tokens sent back to your application. For example, select **User's Object ID**.
1. Click **OK**.
1. Click **Create** to add the user flow. A prefix of *B2C_1* is automatically appended to the name.

### Test the user flow

1. Select the user flow you created to open its overview page, then select **Run user flow**.
1. For **Application**, select the web application named *webapp1* that you previously registered. The **Reply URL** should show `https://jwt.ms`.
1. Click **Run user flow**, verify the email address of the account that you previously created, and select **Continue**.
1. You now have the opportunity to change the password for the user. Change the password and select **Continue**. The token is returned to `https://jwt.ms` and should be displayed to you.

::: zone-end

::: zone pivot="b2c-custom-policy"

### Create a password reset policy

Custom policies are a set of XML files you upload to your Azure AD B2C tenant to define user journeys. We provide starter packs with several pre-built policies including: sign-up and sign-in, password reset, and profile editing policy. For more information, see [Get started with custom policies in Azure AD B2C](custom-policy-get-started.md).

::: zone-end

## Next steps

Set up a [force password reset](force-password-reset.md).


