---
title: Configure password change using custom policies
titleSuffix: Azure AD B2C
description: Learn how to enable users to change their password using custom policies in Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 03/22/2021
ms.author: mimart
ms.subservice: B2C
zone_pivot_groups: b2c-policy-type
---

# Configure password change using custom policies in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]

In Azure Active Directory B2C (Azure AD B2C), you can enable users who are signed in with a local account to change their password without having to prove their authenticity by email verification. 

> [!TIP]
> The password change flow allows users to change their password, only when the user knows the password, and want to change it. We recommend you to  enable [self-service password reset](add-password-reset-policy.md), to support a case when the user forgot the password.

The password change flow involves following steps:

1. Sign-in with a local account. If the session is still active, Azure AD B2C authorizes the user, and skips to the next step.
1. Users must verify the **old password**, create, and confirm the **new password**.

![Password change flow](./media/add-password-change-policy/password-change-flow.png)  

::: zone pivot="b2c-user-flow"

[!INCLUDE [active-directory-b2c-limited-to-custom-policy](../../includes/active-directory-b2c-limited-to-custom-policy.md)]

::: zone-end

::: zone pivot="b2c-custom-policy"

## Prerequisites

* Complete the steps in [Get started with custom policies in Active Directory B2C](custom-policy-get-started.md).
* If you haven't already done so, [register a web application in Azure Active Directory B2C](tutorial-register-applications.md).

## Add the elements

1. Open your *TrustframeworkExtensions.xml* file and add the following **ClaimType** element with an identifier of `oldPassword` to the [ClaimsSchema](claimsschema.md) element:

    ```xml
    <BuildingBlocks>
      <ClaimsSchema>
        <ClaimType Id="oldPassword">
          <DisplayName>Old Password</DisplayName>
          <DataType>string</DataType>
          <UserHelpText>Enter your old password</UserHelpText>
          <UserInputType>Password</UserInputType>
        </ClaimType>
      </ClaimsSchema>
    </BuildingBlocks>
    ```

2. A [ClaimsProvider](claimsproviders.md) element contains the technical profile that authenticates the user. Add the following claims providers to the **ClaimsProviders** element:

    ```xml
    <ClaimsProviders>
      <ClaimsProvider>
        <DisplayName>Local Account SignIn</DisplayName>
        <TechnicalProfiles>
          <TechnicalProfile Id="login-NonInteractive-PasswordChange">
            <DisplayName>Local Account SignIn</DisplayName>
            <InputClaims>
              <InputClaim ClaimTypeReferenceId="oldPassword" PartnerClaimType="password" Required="true" />
              </InputClaims>
            <IncludeTechnicalProfile ReferenceId="login-NonInteractive" />
          </TechnicalProfile>
        </TechnicalProfiles>
      </ClaimsProvider>
      <ClaimsProvider>
        <DisplayName>Local Account Password Change</DisplayName>
        <TechnicalProfiles>
          <TechnicalProfile Id="LocalAccountWritePasswordChangeUsingObjectId">
            <DisplayName>Change password (username)</DisplayName>
            <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.SelfAssertedAttributeProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
            <Metadata>
              <Item Key="ContentDefinitionReferenceId">api.selfasserted</Item>
            </Metadata>
            <InputClaims>
              <InputClaim ClaimTypeReferenceId="objectId" />
            </InputClaims>
            <OutputClaims>
              <OutputClaim ClaimTypeReferenceId="oldPassword" Required="true" />
              <OutputClaim ClaimTypeReferenceId="newPassword" Required="true" />
              <OutputClaim ClaimTypeReferenceId="reenterPassword" Required="true" />
            </OutputClaims>
            <ValidationTechnicalProfiles>
              <ValidationTechnicalProfile ReferenceId="login-NonInteractive-PasswordChange" />
              <ValidationTechnicalProfile ReferenceId="AAD-UserWritePasswordUsingObjectId" />
            </ValidationTechnicalProfiles>
          </TechnicalProfile>
        </TechnicalProfiles>
      </ClaimsProvider>
    </ClaimsProviders>
    ```

3. The [UserJourney](userjourneys.md) element defines the path that the user takes when interacting with your application. Add the **UserJourneys** element if it doesn't exist with the **UserJourney** identified as `PasswordChange`:

    ```xml
    <UserJourneys>
      <UserJourney Id="PasswordChange">
        <OrchestrationSteps>
          <OrchestrationStep Order="1" Type="ClaimsProviderSelection" ContentDefinitionReferenceId="api.signuporsignin">
            <ClaimsProviderSelections>
              <ClaimsProviderSelection TargetClaimsExchangeId="LocalAccountSigninEmailExchange" />
            </ClaimsProviderSelections>
          </OrchestrationStep>
          <OrchestrationStep Order="2" Type="ClaimsExchange">
            <ClaimsExchanges>
              <ClaimsExchange Id="LocalAccountSigninEmailExchange" TechnicalProfileReferenceId="SelfAsserted-LocalAccountSignin-Email" />
            </ClaimsExchanges>
          </OrchestrationStep>
          <OrchestrationStep Order="3" Type="ClaimsExchange">
            <ClaimsExchanges>
              <ClaimsExchange Id="NewCredentials" TechnicalProfileReferenceId="LocalAccountWritePasswordChangeUsingObjectId" />
            </ClaimsExchanges>
          </OrchestrationStep>
          <OrchestrationStep Order="4" Type="ClaimsExchange">
            <ClaimsExchanges>
              <ClaimsExchange Id="AADUserReadWithObjectId" TechnicalProfileReferenceId="AAD-UserReadUsingObjectId" />
            </ClaimsExchanges>
          </OrchestrationStep>
          <OrchestrationStep Order="5" Type="SendClaims" CpimIssuerTechnicalProfileReferenceId="JwtIssuer" />
        </OrchestrationSteps>
        <ClientDefinition ReferenceId="DefaultWeb" />
      </UserJourney>
    </UserJourneys>
    ```

4. Save the *TrustFrameworkExtensions.xml* policy file.
5. Copy the *ProfileEdit.xml* file that you downloaded with the starter pack and name it *ProfileEditPasswordChange.xml*.
6. Open the new file and update the **PolicyId** attribute with a unique value. This value is the name of your policy. For example, *B2C_1A_profile_edit_password_change*.
7. Modify the **ReferenceId** attribute in `<DefaultUserJourney>` to match the ID of the new user journey that you created. For example, *PasswordChange*.
8. Save your changes.

## Upload and test the policy

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Make sure you're using the directory that contains your Azure AD B2C tenant by selecting the **Directory + subscription** filter in the top menu and choosing the directory that contains your tenant.
3. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
4. Select **Identity Experience Framework**.
5. On the Custom Policies page, click **Upload Policy**.
6. Select **Overwrite the policy if it exists**, and then search for and select the *TrustframeworkExtensions.xml* file.
7. Click **Upload**.
8. Repeat steps 5 through 7 for the relying party file, such as *ProfileEditPasswordChange.xml*.

### Run the policy

1. Open the policy that you changed. For example, *B2C_1A_profile_edit_password_change*.
2. For **Application**, select your application that you previously registered. To see the token, the **Reply URL** should show `https://jwt.ms`.
3. Click **Run now**. Sign in with the account that you previously created. You should now have the opportunity to change the password.

## Next steps

- Find the sample policy on [GitHub](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/tree/master/scenarios/password-change).
- Learn about how you can [configure password complexity in Azure AD B2C](password-complexity.md).
- Set up a [password reset flow](add-password-reset-policy.md).

::: zone-end
