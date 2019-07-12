---
title: Pass an access token through a custom policy to your application in Azure Active Directory B2C | Microsoft Docs
description: Learn how you can pass an access token for OAuth2.0 identity providers as a claim through a custom policy to your application in Azure Active Directory B2C.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 02/19/2019
ms.author: marsma
ms.subservice: B2C
---

# Pass an access token through a custom policy to your application in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-public-preview](../../includes/active-directory-b2c-public-preview.md)]

A [custom policy](active-directory-b2c-get-started-custom.md) in Azure Active Directory (Azure AD) B2C provides users of your application an opportunity to sign up or sign in with an identity provider. When this happens, Azure AD B2C receives an [access token](active-directory-b2c-reference-tokens.md) from the identity provider. Azure AD B2C uses that token to retrieve information about the user. You add a claim type and output claim to your custom policy to pass the token through to the applications that you register in Azure AD B2C.

Azure AD B2C supports passing the access token of [OAuth 2.0](active-directory-b2c-reference-oauth-code.md) and [OpenID Connect](active-directory-b2c-reference-oidc.md) identity providers. For all other identity providers, the claim is returned blank.

## Prerequisites

- Your custom policy is configured with an OAuth 2.0 or OpenID Connect identity provider.

## Add the claim elements

1. Open your *TrustframeworkExtensions.xml* file and add the following **ClaimType** element with an identifier of `identityProviderAccessToken` to the **ClaimsSchema** element:

    ```XML
    <BuildingBlocks>
      <ClaimsSchema>
        <ClaimType Id="identityProviderAccessToken">
          <DisplayName>Identity Provider Access Token</DisplayName>
          <DataType>string</DataType>
          <AdminHelpText>Stores the access token of the identity provider.</AdminHelpText>
        </ClaimType>
        ...
      </ClaimsSchema>
    </BuildingBlocks>
    ```

2. Add the **OutputClaim** element to the **TechnicalProfile** element for each OAuth 2.0 identity provider that you would like the access token for. The following example shows the element added to the Facebook technical profile:

    ```XML
    <ClaimsProvider>
      <DisplayName>Facebook</DisplayName>
      <TechnicalProfiles>
        <TechnicalProfile Id="Facebook-OAUTH">
          <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="identityProviderAccessToken" PartnerClaimType="{oauth2:access_token}" />
          </OutputClaims>
          ...
        </TechnicalProfile>
      </TechnicalProfiles>
    </ClaimsProvider>
    ```

3. Save the *TrustframeworkExtensions.xml* file.
4. Open your relying party policy file, such as *SignUpOrSignIn.xml*, and add the **OutputClaim** element to the **TechnicalProfile**:

    ```XML
    <RelyingParty>
      <DefaultUserJourney ReferenceId="SignUpOrSignIn" />
      <TechnicalProfile Id="PolicyProfile">
        <OutputClaims>
          <OutputClaim ClaimTypeReferenceId="identityProviderAccessToken" PartnerClaimType="idp_access_token"/>
        </OutputClaims>
        ...
      </TechnicalProfile>
    </RelyingParty>
    ```

5. Save the policy file.

## Test your policy

When testing your applications in Azure AD B2C, it can be useful to have the Azure AD B2C token returned to `https://jwt.ms` to be able to review the claims in it.

### Upload the files

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Make sure you're using the directory that contains your Azure AD B2C tenant by clicking the **Directory and subscription filter** in the top menu and choosing the directory that contains your tenant.
3. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
4. Select **Identity Experience Framework**.
5. On the Custom Policies page, click **Upload Policy**.
6. Select **Overwrite the policy if it exists**, and then search for and select the *TrustframeworkExtensions.xml* file.
7. Click **Upload**.
8. Repeat steps 5 through 7 for the relying party file, such as *SignUpOrSignIn.xml*.

### Run the policy

1. Open the policy that you changed. For example, *B2C_1A_signup_signin*.
2. For **Application**, select your application that you previously registered. To see the token in the example below, the **Reply URL** should show `https://jwt.ms`.
3. Click **Run now**.

    You should see something similar to the following example:

    ![Decoded token in jwt.ms with idp_access_token block highlighted](./media/idp-pass-through-custom/idp-pass-through-custom-token.PNG)

## Next steps

Learn more about tokens in the [Azure Active Directory token reference](active-directory-b2c-reference-tokens.md).
