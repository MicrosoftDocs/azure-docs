---
title: Configure Azure Active Directory B2C with eID-Me
titleSuffix: Azure AD B2C
description: Learn how to integrate Azure AD B2C authentication with eID-Me for identity verification 
services: active-directory-b2c
author: gargi-sinha
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 1/30/2022
ms.author: gasinh
ms.subservice: B2C
zone_pivot_groups: b2c-policy-type
---

# Configure eID-Me with Azure Active Directory B2C for identity verification

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]


In this sample article, we provide guidance on how to integrate Azure Active Directory B2C (Azure AD B2C) authentication with [eID-Me](https://bluink.ca). eID-Me is an identity verification and decentralized digital identity solution for Canadian citizens. With eID-Me, Azure AD B2C tenants can strongly verify the identity of their users, obtain verified identity claims during sign up and sign in, and support multifactor authentication (MFA) and password-free sign-in using a secure digital identity. It enables organizations to meet Identity Assurance Level (IAL) 2 and Know Your Customer (KYC) requirements. This solution provides users secure sign-up and sign in experience while reducing fraud.



## Prerequisites

To get started, you'll need:

- [A Relying Party account with eID-Me](https://bluink.ca/eid-me/solutions/id-verification#contact-form).

- An Azure subscription. If you don't have one, get a [free
account](https://azure.microsoft.com/free).

- An [Azure AD B2C tenant](tutorial-create-tenant.md) that is linked to your Azure subscription.

- A [trial or production version](https://bluink.ca/eid-me/download) of eID-Me smartphone apps for users.

::: zone pivot="b2c-custom-policy"
- Complete the steps in the article [get started with custom policies in Azure Active Directory B2C](./tutorial-create-user-flows.md?pivots=b2c-custom-policy).

::: zone-end

## Scenario description

eID-Me integrates with Azure AD B2C as an OpenID Connect (OIDC) identity provider. The following components comprise the eID-Me solution with Azure AD B2C:


- **An Azure AD B2C tenant**: Your Azure AD B2C tenant need be configured as a Relying Party in eID-Me. This allows the eID-Me identity provider to trust your Azure AD B2C tenant for sign up and sign in.


- **An Azure AD B2C tenant application**: Although not strictly required, it's assumed that tenants need to have an Azure AD B2C tenant application. The application can receive identity claims received by Azure AD B2C during an eID-Me transaction.


- **eID-Me smartphone apps**: Users of your Azure AD B2C tenant need to have the eID-Me smartphone app for iOS or Android.


- **Issued eID-Me digital identities**: Before using eID-Me, users need to successfully go through the eID-Me identity proofing process. They need to have been issued a digital identity to the digital wallet within the app. This process is done from home and usually takes minutes provided the users have valid identity documents.


The eID-Me apps also provide strong authentication of the user during any transaction. X509 public key authentication using a private signing key contained within the eID-Me digital identity provides passwordless MFA.

The following diagram shows the identity proofing process, which occurs outside of Azure AD B2C flows.

![Screenshot shows the architecture of an identity proofing process flow in eID-Me](./media/partner-eid-me/partner-eid-me-identity-proofing.png)

| Steps | Description                                                                                                  |
| :---- | :----------------------------------------------------------------------------------------------------------- |
| 1.    | User uploads a selfie capture into the eID-Me smartphone application.                                        |
| 2.    | User scans and uploads a government issued identification document such as Passport or Driver license into the eID-Me smartphone application. |
| 3.    | The eID-Me smartphone application submits this data to eID-Me identity service for verification.  |                                          
| 4.    | A digital identity is issued to the user and saved in the application.                    |

The following architecture diagram shows the implementation.

![Screenshot shows the architecture of an Azure AD B2C integration with eID-Me](./media/partner-eid-me/partner-eid-me-architecture-diagram.png)

| Steps | Description                                                                                                                                         |
| :---- | :-------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.    | User opens Azure AD B2C's sign in page, and then signs in or signs up by entering their username.                                                   |
| 2.    | User is forwarded to Azure AD B2C’s combined sign-in and sign-up policy.                                                                           |
| 3.    | Azure AD B2C redirects the user to the eID-Me identity router using the OIDC authorization code flow.                                               |
| 4.    | The eID-Me router sends a push notification to the user’s mobile app including all context details of the authentication and authorization request. |
| 5.    | The user reviews the authentication challenge; if accepted the user is prompted for identity claims, proving the user’s identity.                   |
| 6.    | The challenge response is returned to the eID-Me router.                                                                                            |
| 7.    | The eID-Me router then replies to Azure AD B2C with the authentication result.                                                                      |
| 8.    | Response from Azure AD B2C is sent as an ID token to the application.                                                                               |
| 9.    | Based on the authentication result, the user is granted or denied access.                                                                                  |


## Onboard with eID-Me

[Contact eID-Me](https://bluink.ca/contact) and configure a test or production environment to set up Azure AD B2C tenants as a Relying Party. Tenants must determine what identity claims they'll need from their consumers as they sign up using eID-Me.

## Step 1: Configure an application in eID-Me

To configure your tenant application as a Relying Party in eID-Me the following information should be supplied to eID-Me:

| Property                           | Description                                                                                                                                                                                                                                                                                                                                                                                                      |
| :--------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name                               | Azure AD B2C/your desired application name                                                                                                                                                                                                                                                                                                                                                                       |
| Domain                             | name.onmicrosoft.com                                                                                                                                                                                                                                                                                                                                                                                             |
| Redirect URIs                      | https://jwt.ms                                                                                                                                                                                                                                                                                                                                                                       |
| Redirect URLs                      | `https://your-B2C-tenant-name.b2clogin.com/your-B2C-tenant-name.onmicrosoft.com/oauth2/authresp`<br>For Example: `https://fabrikam.b2clogin.com/fabrikam.onmicrosoft.com/oauth2/authresp`<br>If you use a custom domain, enter https://your-domain-name/your-tenant-name.onmicrosoft.com/oauth2/authresp.<br> Replace your-domain-name with your custom domain, and your-tenant-name with the name of your tenant. |
| URL for application home page      | Will be displayed to the end user                                                                                                                                                                                                                                                                                                                                                                                |
| URL for application privacy policy | Will be displayed to the end user                                                                                                                                                                                                                                                                                                                                                                                |

eID-Me will provide a Client ID and a Client Secret once the Relying Party has been configured with eID-Me. 

>[!NOTE]
>You'll need Client ID and Client secret later to configure the Identity provider in Azure AD B2C.

::: zone pivot="b2c-user-flow"

## Step 2: Add a new Identity provider in Azure AD B2C

1. Sign in to the [Azure portal](https://portal.azure.com/#home) as the global administrator of your Azure AD B2C tenant.

2. Make sure you're using the directory that contains your Azure AD B2C tenant by selecting the **Directory + subscription** filter in the top menu and choosing the directory that contains your tenant.

3. Choose **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.

4. Navigate to **Dashboard** > **Azure Active Directory B2C** > **Identity providers**.

5. Select **New OpenID Connect Provider**.

6. Select **Add**.

## Step 3: Configure an Identity provider

To configure an identity provider, follow these steps:

1. Select **Identity provider type** > **OpenID Connect**

2. Fill out the form to set up the Identity provider:

   | Property      | Value                                           |
   | :------------ | :---------------------------------------------- |
   | Name          | Enter eID-Me Passwordless/a name of your choice |
   | Client ID     | Provided by eID-Me                              |
   | Client Secret | Provided by eID-Me                              |
   | Scope         | openid email profile                            |
   | Response type | code                                            |
   | Response mode | form post                                       |

3. Select **OK**.

4. Select **Map this identity provider’s claims**.

5. Fill out the form to map the Identity provider:

   | Property     | Value             |
   | :----------- | :---------------- |
   | User ID      | sub               |
   | Display name | name              |
   | Given name   | given_name        |
   | Surname      | family_name       |
   | Email        | email             |

6. Select **Save** to complete the setup for your new OIDC Identity provider.

## Step 4: Configure multi-factor authentication

eID-Me is a decentralized digital identity with strong two-factor user authentication built in. Since eID-Me is already a multi-factor authenticator, you don't need to configure any multi-factor authentication settings in your user flows when using eID-Me. eID-Me offers a fast and simple user experience, which also eliminates the need for any additional passwords.

## Step 5: Create a user flow policy

You should now see eID-Me as a new OIDC Identity provider listed within your B2C identity providers.  

1. In your Azure AD B2C tenant, under **Policies**, select **User flows**.  

2. Select **New user flow**

3. Select **Sign up and sign in** > **Version** > **Create**.

4. Enter a **Name** for your policy.

5. In the Identity providers section, select your newly created eID-Me Identity provider.  

6. Select **None** for Local Accounts to disable email and password-based authentication.

7. Select **Run user flow**

8. In the form, enter the Replying URL, such as `https://jwt.ms`.

9. The browser will be redirected to the eID-Me sign-in page. Enter the account name registered during User registration. The user will receive a push notification to their mobile device where the eID-Me application is installed; upon opening the notification, the user will be presented with an authentication challenge

10. Once the authentication challenge is accepted, the browser will redirect the user to the replying URL.

## Next steps

For additional information, review the following articles:

- [eID-Me and Azure AD B2C integration guide](https://bluink.ca/eid-me/azure-b2c-integration-guide)

- [Custom policies in Azure AD B2C](./custom-policy-overview.md)

- [Get started with custom policies in Azure AD B2C](./tutorial-create-user-flows.md?pivots=b2c-custom-policy)

::: zone-end

::: zone pivot="b2c-custom-policy"

>[!NOTE]
>In Azure AD B2C, [**custom policies**](./user-flow-overview.md) are designed primarily to address complex scenarios. For most scenarios, we recommend that you use built-in [**user flows**](./user-flow-overview.md).

## Step 2: Create a policy key

Store the client secret that you previously recorded in your Azure AD B2C tenant.

1. Sign in to the [Azure portal](https://portal.azure.com/).

2. Make sure you're using the directory that contains your Azure AD B2C tenant. Select the **Directories + subscriptions** icon in the portal toolbar.

3. On the **Portal settings | Directories + subscriptions** page, find your Azure AD B2C directory in the **Directory name** list, and then select **Switch**.

4. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.

5. On the Overview page, select **Identity Experience Framework**.

6. Select **Policy Keys** and then select **Add**.

7. For **Options**, choose `Manual`.

8. Enter a **Name** for the policy key. For example, `eIDMeClientSecret`. The prefix `B2C_1A_` is added automatically to the name of your key.

9. In **Secret**, enter your client secret that you previously recorded.

10. For **Key usage**, select `Signature`.

11. Select **Create**.

## Step 3: Configure eID-Me as an Identity provider

To enable users to sign in using eID-Me decentralized identity, you need to define eID-Me as a claims provider that Azure AD B2C can communicate with through an endpoint. The endpoint provides a set of claims that are used by Azure AD B2C to verify a specific user has authenticated using digital ID available on their device, proving the user’s identity.

You can define eID-Me as a claims provider by adding it to the **ClaimsProvider** element in the extension file of your policy

1. Open the `TrustFrameworkExtensions.xml`.

2. Find the **ClaimsProviders** element. If it doesn't exist, add it under the root element.

3. Add a new **ClaimsProvider** as follows:

   ```xml
      <ClaimsProvider>
      <Domain>eID-Me</Domain>
      <DisplayName>eID-Me</DisplayName>
      <TechnicalProfiles>
        <TechnicalProfile Id="eID-Me-OIDC">
          <!-- The text in the following DisplayName element is shown to the user on the claims provider 
   selection screen. -->
          <DisplayName>eID-Me for Sign In</DisplayName>
          <Protocol Name="OpenIdConnect" />
          <Metadata>
            <Item Key="ProviderName">https://eid-me.bluink.ca</Item>
            <Item Key="METADATA">https://demoeid.bluink.ca/.well-known/openid-configuration</Item>
            <Item Key="response_types">code</Item>
            <Item Key="scope">openid email profile</Item>
            <Item Key="response_mode">form_post</Item>
            <Item Key="HttpBinding">POST</Item>
            <Item Key="token_endpoint_auth_method">client_secret_post</Item>
            <Item Key="client_id">eid_me_rp_client_id</Item>
            <Item Key="UsePolicyInRedirectUri">false</Item>
          </Metadata>
          <CryptographicKeys>
            <Key Id="client_secret" StorageReferenceId="B2C_1A_eIDMeClientSecret" />
          </CryptographicKeys>
          <InputClaims />
          <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="issuerUserId" PartnerClaimType="sub" />
            <OutputClaim ClaimTypeReferenceId="tenantId" PartnerClaimType="tid" />
            <OutputClaim ClaimTypeReferenceId="givenName" PartnerClaimType="given_name" />
            <OutputClaim ClaimTypeReferenceId="surName" PartnerClaimType="family_name" />
            <OutputClaim ClaimTypeReferenceId="displayName" PartnerClaimType="name" />
            <OutputClaim ClaimTypeReferenceId="email" PartnerClaimType="email" />
            <OutputClaim ClaimTypeReferenceId="IAL" PartnerClaimType="identity_assurance_level_achieved" DefaultValue="unknown IAL" />
            <OutputClaim ClaimTypeReferenceId="authenticationSource" DefaultValue="socialIdpAuthentication" AlwaysUseDefaultValue="true" />
            <OutputClaim ClaimTypeReferenceId="identityProvider" PartnerClaimType="iss" />
            <OutputClaim ClaimTypeReferenceId="locality" PartnerClaimType="locality" DefaultValue="unknown locality" />
            <OutputClaim ClaimTypeReferenceId="region" PartnerClaimType="region" DefaultValue="unknown region" />
          </OutputClaims>
          <OutputClaimsTransformations>
            <OutputClaimsTransformation ReferenceId="CreateRandomUPNUserName" />
            <OutputClaimsTransformation ReferenceId="CreateUserPrincipalName" />
            <OutputClaimsTransformation ReferenceId="CreateAlternativeSecurityId" />
            <OutputClaimsTransformation ReferenceId="CreateSubjectClaimFromAlternativeSecurityId" />
          </OutputClaimsTransformations>
          <UseTechnicalProfileForSessionManagement ReferenceId="SM-SocialLogin" />
        </TechnicalProfile>
      </TechnicalProfiles>
    </ClaimsProvider>
   ```

4. Set **eid_me_rp_client_id** with your eID-Me Relying Party Client ID.

5. Save the file.

There are additional identity claims that eID-Me supports and can be added. 

1. Open the `TrustFrameworksExtension.xml`

2. Find the `BuildingBlocks` element.  This is where additional identity claims that eID-Me supports can be added. Full lists of supported eID-Me identity claims with descriptions are mentioned at `http://www.oid-info.com/get/1.3.6.1.4.1.50715` with the OIDC identifiers used here [https://eid-me.bluink.ca/.well-known/openid-configuration](https://eid-me.bluink.ca/.well-known/openid-configuration).

   ```xml
   <BuildingBlocks>
   <ClaimsSchema>
    <ClaimType Id="IAL">
        <DisplayName>Identity Assurance Level</DisplayName>
        <DataType>string</DataType>
        <DefaultPartnerClaimTypes>
          <Protocol Name="OpenIdConnect" PartnerClaimType="identity_assurance_level_achieved" />
        </DefaultPartnerClaimTypes>
        <AdminHelpText>The Identity Assurance Level Achieved during proofing of the digital identity.</AdminHelpText>
        <UserHelpText>The Identity Assurance Level Achieved during proofing of the digital identity.</UserHelpText>
        <UserInputType>Readonly</UserInputType>
      </ClaimType>
 
   <ClaimType Id="picture">
        <DisplayName>Portrait Photo</DisplayName>
        <DataType>string</DataType>
        <DefaultPartnerClaimTypes>
          <Protocol Name="OpenIdConnect" PartnerClaimType="thumbnail_portrait" />
        </DefaultPartnerClaimTypes>
        <AdminHelpText>The portrait photo of the user.</AdminHelpText>
        <UserHelpText>Your portrait photo.</UserHelpText>
        <UserInputType>Readonly</UserInputType>
      </ClaimType>
 
    <ClaimType Id="middle_name">
        <DisplayName>Portrait Photo</DisplayName>
        <DataType>string</DataType>
        <DefaultPartnerClaimTypes>
          <Protocol Name="OpenIdConnect" PartnerClaimType="middle_name" />
        </DefaultPartnerClaimTypes>
        <UserHelpText>Your middle name.</UserHelpText>
        <UserInputType>TextBox</UserInputType>
      </ClaimType>
 
   <ClaimType Id="birthdate">
        <DisplayName>Date of Birth</DisplayName>
        <DataType>string</DataType>
        <DefaultPartnerClaimTypes>
          <Protocol Name="OpenIdConnect" PartnerClaimType="birthdate" />
        </DefaultPartnerClaimTypes>
        <AdminHelpText>The user's date of birth.</AdminHelpText>
        <UserHelpText>Your date of birth.</UserHelpText>
        <UserInputType>TextBox</UserInputType>
      </ClaimType>
 
    <ClaimType Id="gender">
        <DisplayName>Gender</DisplayName>
        <DataType>string</DataType>
        <DefaultPartnerClaimTypes>
          <Protocol Name="OpenIdConnect" PartnerClaimType="gender" />
        </DefaultPartnerClaimTypes>
        <AdminHelpText>The user's gender.</AdminHelpText>
        <UserHelpText>Your gender.</UserHelpText>
        <UserInputType>TextBox</UserInputType>
      </ClaimType>
    
    <ClaimType Id="street_address">
        <DisplayName>Locality/City</DisplayName>
        <DataType>string</DataType>
        <DefaultPartnerClaimTypes>
          <Protocol Name="OpenIdConnect" PartnerClaimType="street_address" />
        </DefaultPartnerClaimTypes>
        <AdminHelpText>The user's full street address, which MAY include house number, street name, post office box.</AdminHelpText>
        <UserHelpText>Your street address of residence.</UserHelpText>
        <UserInputType>TextBox</UserInputType>
      </ClaimType>
 
   <ClaimType Id="locality">
        <DisplayName>Locality/City</DisplayName>
        <DataType>string</DataType>
        <DefaultPartnerClaimTypes>
          <Protocol Name="OpenIdConnect" PartnerClaimType="locality" />
        </DefaultPartnerClaimTypes>
        <AdminHelpText>The user's current city or locality of residence.</AdminHelpText>
        <UserHelpText>Your current city or locality of residence.</UserHelpText>
        <UserInputType>TextBox</UserInputType>
      </ClaimType>

      <ClaimType Id="region">
        <DisplayName>Province or Territory</DisplayName>
        <DataType>string</DataType>
        <DefaultPartnerClaimTypes>
          <Protocol Name="OpenIdConnect" PartnerClaimType="region" />
        </DefaultPartnerClaimTypes>
        <AdminHelpText>The user's current province or territory of residence.</AdminHelpText>
        <UserHelpText>Your current province or territory of residence.</UserHelpText>
        <UserInputType>TextBox</UserInputType>
      </ClaimType>

      <ClaimType Id="country">
        <DisplayName>Country</DisplayName>
        <DataType>string</DataType>
        <DefaultPartnerClaimTypes>
          <Protocol Name="OpenIdConnect" PartnerClaimType="country" />
        </DefaultPartnerClaimTypes>
        <AdminHelpText>The user's current country of residence.</AdminHelpText>
        <UserHelpText>Your current country of residence.</UserHelpText>
        <UserInputType>TextBox</UserInputType>
      </ClaimType>

      <ClaimType Id="dl_number">
        <DisplayName>Driver's Licence Number</DisplayName>
        <DataType>string</DataType>
        <DefaultPartnerClaimTypes>
          <Protocol Name="OpenIdConnect" PartnerClaimType="dl_number" />
        </DefaultPartnerClaimTypes>
        <AdminHelpText>The user's driver's licence number.</AdminHelpText>
        <UserHelpText>Your driver's licence number.</UserHelpText>
        <UserInputType>TextBox</UserInputType>
      </ClaimType>

      <ClaimType Id="dl_class">
        <DisplayName>Driver's Licence Class</DisplayName>
        <DataType>string</DataType>
        <DefaultPartnerClaimTypes>
          <Protocol Name="OpenIdConnect" PartnerClaimType="dl_class" />
        </DefaultPartnerClaimTypes>
        <AdminHelpText>The user's driver's licence class.</AdminHelpText>
        <UserHelpText>Your driver's licence class.</UserHelpText>
        <UserInputType>TextBox</UserInputType>
      </ClaimType>
    </ClaimsSchema>

   ```

## Step 4: Add a user journey

At this point, the identity provider has been set up, but it's not yet available in any of the sign-in pages. If you don't have your own custom user journey, create a duplicate of an existing template user journey, otherwise continue to the next step.  

1. Open the `TrustFrameworkBase.xml` file from the starter pack.

2. Find and copy the entire contents of the **UserJourneys** element that includes ID=`SignUpOrSignIn`.

3. Open the `TrustFrameworkExtensions.xml` and find the **UserJourneys** element. If the element doesn't exist, add one.

4. Paste the entire content of the **UserJourney** element that you copied as a child of the **UserJourneys** element.

5. Rename the ID of the user journey. For example,  ID=`CustomSignUpSignIn`

## Step 5: Add the identity provider to a user journey

Now that you have a user journey, add the new identity provider to the user journey. 

1. Find the orchestration step element that includes Type=`CombinedSignInAndSignUp`, or Type=`ClaimsProviderSelection` in the user journey. It's usually the first orchestration step. The **ClaimsProviderSelections** element contains a list of identity providers that a user can sign in with. The order of the elements controls the order of the sign-in buttons presented to the user. Add a **ClaimsProviderSelection** XML element. Set the value of **TargetClaimsExchangeId** to a friendly name.

2. In the next orchestration step, add a **ClaimsExchange** element. Set the **Id** to the value of the target claims exchange ID. Update the value of **TechnicalProfileReferenceId** to the ID of the technical profile you created earlier.

   The following XML demonstrates **7** orchestration steps of a user journey with the identity provider:

   ```xml
    <UserJourney Id="eIDME-SignUpOrSignIn">
      <OrchestrationSteps>
        <OrchestrationStep Order="1" Type="CombinedSignInAndSignUp" ContentDefinitionReferenceId="api.signuporsignin">
          <ClaimsProviderSelections>
            <ClaimsProviderSelection TargetClaimsExchangeId="eIDMeExchange" />
           </ClaimsProviderSelections>
      </OrchestrationStep>
        <!-- Check if the user has selected to sign in using one of the social providers -->
        <OrchestrationStep Order="2" Type="ClaimsExchange">
          <Preconditions>
            <Precondition Type="ClaimsExist" ExecuteActionsIf="true">
              <Value>objectId</Value>
              <Action>SkipThisOrchestrationStep</Action>
            </Precondition>
          </Preconditions>
          <ClaimsExchanges>
            <ClaimsExchange Id="eIDMeExchange" TechnicalProfileReferenceId="eID-Me-OIDC" />
          </ClaimsExchanges>
        </OrchestrationStep>
        <!-- For social IDP authentication, attempt to find the user account in the directory. -->
        <OrchestrationStep Order="3" Type="ClaimsExchange">
          <Preconditions>
            <Precondition Type="ClaimEquals" ExecuteActionsIf="true">
              <Value>authenticationSource</Value>
              <Value>localAccountAuthentication</Value>
              <Action>SkipThisOrchestrationStep</Action>
            </Precondition>
          </Preconditions>
          <ClaimsExchanges>
            <ClaimsExchange Id="AADUserReadUsingAlternativeSecurityId" TechnicalProfileReferenceId="AAD-UserReadUsingAlternativeSecurityId-NoError" />
          </ClaimsExchanges>
        </OrchestrationStep>
        <!-- Show self-asserted page only if the directory does not have the user account already (i.e. we do not have an objectId).  -->
        <OrchestrationStep Order="4" Type="ClaimsExchange">
          <Preconditions>
            <Precondition Type="ClaimsExist" ExecuteActionsIf="true">
              <Value>objectId</Value>
              <Action>SkipThisOrchestrationStep</Action>
            </Precondition>
          </Preconditions>
          <ClaimsExchanges>
            <ClaimsExchange Id="SelfAsserted-Social" TechnicalProfileReferenceId="SelfAsserted-Social" />
          </ClaimsExchanges>
        </OrchestrationStep>
        <!-- This step reads any user attributes that we may not have received when authenticating using ESTS so they can be sent in the token. -->
        <OrchestrationStep Order="5" Type="ClaimsExchange">
          <Preconditions>
            <Precondition Type="ClaimEquals" ExecuteActionsIf="true">
              <Value>authenticationSource</Value>
              <Value>socialIdpAuthentication</Value>
              <Action>SkipThisOrchestrationStep</Action>
            </Precondition>
          </Preconditions>
          <ClaimsExchanges>
            <ClaimsExchange Id="AADUserReadWithObjectId" TechnicalProfileReferenceId="AAD-UserReadUsingObjectId" />
          </ClaimsExchanges>
        </OrchestrationStep>
        <!-- The previous step (SelfAsserted-Social) could have been skipped if there were no attributes to collect 
             from the user. So, in that case, create the user in the directory if one does not already exist 
             (verified using objectId which would be set from the last step if account was created in the directory. -->
        <OrchestrationStep Order="6" Type="ClaimsExchange">
          <Preconditions>
            <Precondition Type="ClaimsExist" ExecuteActionsIf="true">
              <Value>objectId</Value>
              <Action>SkipThisOrchestrationStep</Action>
            </Precondition>
          </Preconditions>
          <ClaimsExchanges>
            <ClaimsExchange Id="AADUserWrite" TechnicalProfileReferenceId="AAD-UserWriteUsingAlternativeSecurityId" />
          </ClaimsExchanges>
        </OrchestrationStep>
        <OrchestrationStep Order="7" Type="SendClaims" CpimIssuerTechnicalProfileReferenceId="JwtIssuer" />
      </OrchestrationSteps>
      <ClientDefinition ReferenceId="DefaultWeb" />
    </UserJourney>

   ```

## Step 6: Configure the relying party policy

The relying party policy specifies the user journey which Azure AD B2C will execute. You can also control what claims are passed to your application by adjusting the **OutputClaims** element of the **eID-Me-OIDC-Signup** TechnicalProfile element. In this sample, the application will receive the user’s postal code, locality, region, IAL, portrait, middle name, and birth date. It also receives the boolean **signupConditionsSatisfied** claim, which indicates whether an account has been created or not:

   ```xml
    <RelyingParty>
        <DefaultUserJourney ReferenceId="eIDMe-SignUpOrSignIn" />
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
            <OutputClaim ClaimTypeReferenceId="postalCode" PartnerClaimType="postal_code" DefaultValue="unknown postal_code" />
            <OutputClaim ClaimTypeReferenceId="locality" PartnerClaimType="locality" DefaultValue="unknown locality" />
            <OutputClaim ClaimTypeReferenceId="region" PartnerClaimType="region" DefaultValue="unknown region" />
            <OutputClaim ClaimTypeReferenceId="IAL" PartnerClaimType="identity_assurance_level_achieved" DefaultValue="unknown IAL" />
            <OutputClaim ClaimTypeReferenceId="picture" PartnerClaimType="thumbnail_portrait" DefaultValue="unknown portrait" />
            <OutputClaim ClaimTypeReferenceId="middle_name" PartnerClaimType="middle_name" DefaultValue="unknown middle name" />
            <OutputClaim ClaimTypeReferenceId="birthdate" PartnerClaimType="birthdate" DefaultValue="unknown DOB" />
            <OutputClaim ClaimTypeReferenceId="newUser" PartnerClaimType="signupConditionsSatisfied" DefaultValue="false" />
          </OutputClaims>
          <SubjectNamingInfo ClaimType="sub" />
        </TechnicalProfile>
      </RelyingParty>

   ```

## Step 7: Upload the custom policy

1. Sign in to the [Azure portal](https://portal.azure.com/#home).

2. Make sure you're using the directory that contains your Azure AD B2C tenant. Select the **Directories + subscriptions** icon in the portal toolbar.

3. On the **Portal settings | Directories + subscriptions** page, find your Azure AD B2C directory in the **Directory name** list, and then select **Switch**.

4. In the [Azure portal](https://portal.azure.com/#home), search for and select **Azure AD B2C**.

5. Under Policies, select **Identity Experience Framework**.
Select **Upload Custom Policy**, and then upload the two policy files that you changed, in the following order: the extension policy, for example `TrustFrameworkBase.xml`, then the relying party policy, such as `SignUp.xml`.

## Step 8: Test your custom policy

1. Select your relying party policy, for example `B2C_1A_signup`.

2. For **Application**, select a web application that you [previously registered](./tutorial-register-applications.md). The **Reply URL** should show `https://jwt.ms`.

3. Select the **Run now** button.

4. The sign-up policy should invoke eID-Me immediately.  If sign-in is used, then select eID-Me to sign in with eID-Me.

If the sign-in process is successful, your browser is redirected to `https://jwt.ms`, which displays the contents of the token returned by Azure AD B2C.

## Next steps

For additional information, review the following articles:

- [Custom policies in Azure AD B2C](./custom-policy-overview.md)

- [Get started with custom policies in Azure AD B2C](./tutorial-create-user-flows.md?pivots=b2c-custom-policy)

- [Sample code to integrate Azure AD B2C with eID-Me](https://github.com/bluink-stephen/eID-Me_Azure_AD_B2C)

- [eID-Me and Azure AD B2C integration guide](https://bluink.ca/eid-me/azure-b2c-integration-guide)

::: zone-end
