---
title: Configure Azure Active Directory B2C with Asignio
titleSuffix: Azure AD B2C
description: Configure Azure Active Directory B2C with Asignio for multi-factor authentication
services: active-directory-b2c
author: gargi-sinha
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 04/20/2022
ms.author: gasinh
ms.reviewer: kengaderdus
ms.subservice: B2C
zone_pivot_groups: b2c-policy-type
---

# Configure Asignio with Azure Active Directory B2C for multi-factor authentication

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]

::: zone pivot="b2c-custom-policy"

::: zone-end

In this sample article, learn how to integrate Azure Active Directory (Azure AD B2C) authentication with [Asignio](https://www.asignio.com/). Using this integration,  organizations can provide passwordless, soft biometric, and multi-factor authentication (MFA) experience to their customers. Asignio's user friendly, web-based solution is available on any device, anytime, and anywhere. Asignio uses a combination of the patented Asignio Signature and live facial verification for user authentication. The changeable biometric signature eliminates passwords, fraud, phishing, and credential reuse through omni-channel authentication.

## Prerequisites

To get started, you'll need:

- An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).

- An [Azure AD B2C tenant](./tutorial-create-tenant.md) that's linked to your Azure subscription.

- An Asignio Client ID and Client Secret that will be issued by [Asignio](https://www.asignio.com/). These tokens are obtained by registering your mobile or web applications with Asignio.

::: zone pivot="b2c-custom-policy"

- Complete the steps in the article [get started with custom policies in Azure Active Directory B2C](./tutorial-create-user-flows.md?pivots=b2c-custom-policy).

::: zone-end

## Scenario description

This integration includes the following components:

- **Azure AD B2C**: The authorization server, responsible for verifying the user's credentials.

- **Web or mobile applications:** The web or mobile applications you wish to secure with Asignio MFA.

- **Asignio web application:** Signature biometric collection on the user's touch device.

The following architecture diagram shows the implementation.

![image shows the architecture diagram](./media/partner-asignio/partner-asignio-architecture-diagram.png)

| Step | Description |
|:--------|:--------|
| 1. | User opens Azure AD B2C's sign in page on their mobile or web application, and then signs in or signs up by entering their username.|
| 2. | Azure AD B2C redirects the user to Asignio using an OpenID Connect (OIDC) request. |
| 3. | The user is redirected to the Asignio web application to complete the biometric sign in. If the user hasn't registered their Asignio Signature, they can choose to use an SMS One-Time-Password (OTP) to authenticate the immediate request. Once authenticated, user will receive a registration link to finish creating their Asignio Signature. |
| 4. | The user authenticates via Asignio using their Asignio Signature and facial verification or voice and facial verification.|
|5. | The challenge response is then sent back to Asignio. |
| 6. | Asignio returns the OIDC response to Azure AD B2C sign in. |
| 7. | Azure AD B2C sends an authentication verification request to Asignio to confirm receipt of the authentication data. |
| 8. | The user is either granted or denied access to the application based on the authentication results. |

## Step 1: Configure an application with Asignio

Configuring an application with Asignio is accomplished through Asignio's Partner Administration site. Contact Asignio to request access to https://partner.asignio.com for your organization. Once you've obtained credentials, sign into Asignio Partner Administration and complete the following steps:

1. Create a record for your Azure AD B2C application using your Azure AD B2C tenant. When Azure AD B2C is used with Asignio, Azure AD B2C manages your connected applications. All apps in your Azure portal are represented by a single application within Asignio.

1. In the Asignio Partner Administration site, generate a Client ID and Client Secret. Once generated, store Client ID and Client Secret in a secure place, you'll need them later to configure Asignio as an Identity provider. Asignio doesn't store the Client Secret.

1. Supply redirect URI. This is the URI in your site to which the user is returned after a successful authentication. The URI that should be provided to Asignio for your Azure B2C follows the pattern - `[https://<your-b2c-domain>.b2clogin.com/<your-b2c-domain>.onmicrosoft.com/oauth2/authresp]`.

1. Upload a company logo. This logo is displayed to users on Asignio authentication when users sign into your site.

## Step 2: Register a web application in Azure AD B2C

Before your [applications](application-types.md) can interact with Azure AD B2C, they must be registered in a tenant that you manage.

For testing purposes like this tutorial, you're registering  `https://jwt.ms`, a Microsoft-owned web application that displays the decoded contents of a token (the contents of the token never leave your browser).

Follow the steps mentioned in [this tutorial](tutorial-register-applications.md?tabs=app-reg-ga) to **register a web application** and **enable ID token implicit grant** for testing a user flow or custom policy. There's no need to create a Client Secret at this time.

::: zone pivot="b2c-user-flow"

## Step 3: Configure Asignio as an identity provider in Azure AD B2C

1. Sign in to the [Azure portal](https://portal.azure.com/#home) as the global administrator of your Azure AD B2C tenant.

1. Make sure you're using the Azure Active Directory (Azure AD) tenant that contains your Azure subscription:

    1. In the Azure portal toolbar, select the **Directories + subscriptions** (:::image type="icon" source="./../active-directory/develop/media/common/portal-directory-subscription-filter.png" border="false":::) icon.
  
    1. On the **Portal settings | Directories + subscriptions** page, find your Azure AD directory in the **Directory name** list, and then select **Switch** button next to it.

1. Select **All services** in the top-left corner of the Azure portal, search for and select **Azure AD B2C**.

1. In the Azure portal, search for and select **Azure AD B2C**.

1. In the left menu, select **Identity providers**.

1. Select **New OpenID Connect Provider**.

1. Select **Identity provider type** > **OpenID Connect**.

1. Fill out the form to set up the Identity provider

   | Property | Value |
   |:--------|:-------------|
   |Name  | Login with Asignio *(or a name of your choice)*
   |Metadata URL |  `https://authorization.asignio.com/.well-known/openid-configuration`|
   | Client ID |  enter the client ID that you previously generated in [step 1](#step-1-configure-an-application-with-asignio)|
   |Client Secret |  enter the Client secret that you previously generated in [step 1](#step-1-configure-an-application-with-asignio)|
   | Scope | openid email profile |
   | Response type | code |
   | Response mode |  query |
   | Domain hint  | https://asignio.com |

1. Select **OK**.

1. Select **Map this identity provider's claims**.

1. Fill out the form to map the Identity provider:

    | Property | Value |
    |:--------------|:--------------|
    |User ID | sub |
    | Display Name |  name |
    | Given Name |    given_name |
    | Surname  | family_name |
    | Email | email |

1. Select **Save**.

## Step 4: Create a user flow policy

1. In your Azure AD B2C tenant, under **Policies**, select **User flows**.  

1. Select **New user flow**.

1. Select **Sign up and sign in** user flow type, select **Version Recommended** and then select **Create**.

1. Enter a **Name** for your user flow such as `AsignioSignupSignin`.

1. Under **Identity providers**:
   
    a. For **Local Accounts**, select **None** to disable email and password-based authentication.
    
    b. For **Custom identity providers**, select your newly created Asignio Identity provider such as **Login with Asignio**.  

1. Select **Create**.

## Step 5: Test your user flow

1. In your Azure AD B2C tenant, select **User flows**.

1. Select the newly created user flow such as **AsignioSignupSignin**.

1. For **Application**, select the web application that you previously registered in [step 2](#step-2-register-a-web-application-in-azure-ad-b2c). The **Reply URL** should show `https://jwt.ms`.

1. Select the **Run user flow** button. Your browser should be redirected to the Asignio sign in page.

1. A sign in screen will be shown; at the bottom should be a button to use **Asignio** authentication.

1. If you already have an Asignio Signature, you'll be prompted to authenticate using it. If not, you'll be prompted to supply the phone number of your device to authenticate via SMS OTP and then receive a link to register your Asignio Signature.

1. If the sign-in process is successful, your browser is redirected to https://jwt.ms, which displays the contents of the token returned by Azure AD B2C.

::: zone-end

::: zone pivot="b2c-custom-policy"

## Step 3: Create Asignio policy key

Store the client secret that you previously generated in [step 1](#step-1-configure-an-application-with-asignio) in your Azure AD B2C tenant.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Make sure you're using the directory that contains your Azure AD B2C tenant. Select the **Directories + subscriptions** icon in the portal toolbar.

1. On the **Portal settings | Directories + subscriptions** page, find your Azure AD B2C directory in the **Directory name** list, and then select **Switch**.

1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.

1. On the Overview page, select **Identity Experience Framework**.

1. Select **Policy Keys** and then select **Add**.

1. For **Options**, choose `Manual`.

1. Enter a **Name** for the policy key. For example, `AsignioClientSecret`. The prefix `B2C_1A_` is added automatically to the name of your key.

1. In **Secret**, enter your client secret that you previously recorded.

1. For **Key usage**, select `Signature`.

1. Select **Create**.

## Step 4: Configure Asignio as an Identity provider

>[!TIP]
>You should have the Azure AD B2C policy configured at this point. If not, follow the [instructions](tutorial-create-user-flows.md?pivots=b2c-custom-policy#custom-policy-starter-pack) on how to set up your Azure AD B2C tenant and configure policies.

To enable users to sign in using Asignio, you need to define Asignio as a claims provider that Azure AD B2C can communicate with through an endpoint. The endpoint provides a set of claims that are used by Azure AD B2C to verify a specific user has authenticated using digital ID available on their device, proving the user’s identity.

Use the following steps to add Asignio as a claims provider: 

1. Get the custom policy starter packs from GitHub, then update the XML files in the LocalAccounts starter pack with your Azure AD B2C tenant name:

    1. [Download the .zip file](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/archive/master.zip) or clone the repository:
        ```
            git clone https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack
        ```
    
    1. In all of the files in the **LocalAccounts** directory, replace the string `yourtenant` with the name of your Azure AD B2C tenant. For example, if the name of your B2C tenant is `contoso`, all instances of `yourtenant.onmicrosoft.com` become `contoso.onmicrosoft.com`. 

1. Open the `LocalAccounts/ TrustFrameworkExtensions.xml`.

1. Find the **ClaimsProviders** element. If it doesn't exist, add it under the root element, `TrustFrameworkPolicy`.

1. Add a new **ClaimsProvider** similar to the one shown below:

   ```xml
    <ClaimsProvider>
      <Domain>contoso.com</Domain>
      <DisplayName>Asignio</DisplayName>
      <TechnicalProfiles>
        <TechnicalProfile Id="Asignio-Oauth2">
          <DisplayName>Asignio</DisplayName>
          <Description>Login with your Asignio account</Description>
          <Protocol Name="OAuth2" />
          <Metadata>
            <Item Key="ProviderName">authorization.asignio.com</Item>
            <Item Key="authorization_endpoint">https://authorization.asignio.com/authorize</Item>
            <Item Key="AccessTokenEndpoint">https://authorization.asignio.com/token</Item>
            <Item Key="ClaimsEndpoint">https://authorization.asignio.com/userinfo</Item>
            <Item Key="ClaimsEndpointAccessTokenName">access_token</Item>
            <Item Key="BearerTokenTransmissionMethod">AuthorizationHeader</Item>
            <Item Key="HttpBinding">POST</Item>
            <Item Key="scope">openid profile email</Item>
            <Item Key="UsePolicyInRedirectUri">0</Item>
            <!-- Update the Client ID below to the Asignio Application ID -->
            <Item Key="client_id">00000000-0000-0000-0000-000000000000</Item>
            <Item Key="IncludeClaimResolvingInClaimsHandling">true</Item>


            <!-- trying to add additional claim-->
            <!--Insert b2c-extensions-app application ID here, for example: 11111111-1111-1111-1111-111111111111-->
            <Item Key="11111111-1111-1111-1111-111111111111"></Item>
            <!--Insert b2c-extensions-app application ObjectId here, for example: 22222222-2222-2222-2222-222222222222-->
            <Item Key="22222222-2222-2222-2222-222222222222"></Item>
            <!-- The key below allows you to specify each of the Azure AD tenants that can be used to sign in. Update the GUIDs below for each tenant. -->
            <!--<Item Key="ValidTokenIssuerPrefixes">https://login.microsoftonline.com/11111111-1111-1111-1111-111111111111</Item>-->
            <!-- The commented key below specifies that users from any tenant can sign-in. Uncomment if you would like anyone with an Azure AD account to be able to     sign in. -->
            <Item Key="ValidTokenIssuerPrefixes">https://login.microsoftonline.com/</Item>
          </Metadata>
          <CryptographicKeys>
            <Key Id="client_secret" StorageReferenceId="B2C_1A_AsignioSecret" />
          </CryptographicKeys>
          <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="issuerUserId" PartnerClaimType="sub" />
            <OutputClaim ClaimTypeReferenceId="tenantId" PartnerClaimType="tid" AlwaysUseDefaultValue="true" DefaultValue="{Policy:TenantObjectId}" />
            <OutputClaim ClaimTypeReferenceId="authenticationSource" DefaultValue="socialIdpAuthentication" AlwaysUseDefaultValue="true" />
            <OutputClaim ClaimTypeReferenceId="identityProvider" PartnerClaimType="iss" DefaultValue="https://authorization.asignio.com" />
            <OutputClaim ClaimTypeReferenceId="identityProviderAccessToken" PartnerClaimType="{oauth2:access_token}" />
            <OutputClaim ClaimTypeReferenceId="givenName" PartnerClaimType="given_name" />
            <OutputClaim ClaimTypeReferenceId="surName" PartnerClaimType="family_name" />
            <OutputClaim ClaimTypeReferenceId="displayName" PartnerClaimType="name" />
            <OutputClaim ClaimTypeReferenceId="email" PartnerClaimType="email" />
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

1. Set **client_id** with the Asignio Application ID that you previously recorded in [step 1](#step-1-configure-an-application-with-asignio).

1. Update **client_secret** section with the name of the policy key created in [step 3](#step-3-create-asignio-policy-key). For example, `B2C_1A_AsignioSecret`:

   ```xml
   <Key Id="client_secret" StorageReferenceId="B2C_1A_AsignioSecret" />
   ```

1. Save the changes.

## Step 5: Add a user journey

At this point, you've set up the identity provider, but it's not yet available in any of the sign in pages. If you've your own custom user journey continue to [step 7](#step-6-add-the-identity-provider-to-a-user-journey), otherwise, create a duplicate of an existing template user journey as follows:

1. Open the `LocalAccounts/ TrustFrameworkBase.xml` file from the starter pack.

1. Find and copy the entire contents of the **UserJourney** element that includes `Id=SignUpOrSignIn`.

1. Open the `LocalAccounts/ TrustFrameworkExtensions.xml` and find the **UserJourneys** element. If the element doesn't exist, add one.

1. Paste the entire content of the UserJourney element that you copied as a child of the UserJourneys element.

1. Rename the `Id` of the user journey. For example, `Id=AsignioSUSI`.

## Step 6: Add the identity provider to a user journey

Now that you have a user journey, add the new identity provider to the user journey.

1. Find the orchestration step element that includes `Type=CombinedSignInAndSignUp`, or `Type=ClaimsProviderSelection` in the user journey. It's usually the first orchestration step. The **ClaimsProviderSelections** element contains a list of identity providers that a user can sign in with. The order of the elements controls the order of the sign in buttons presented to the user. Add a **ClaimsProviderSelection** XML element. Set the value of **TargetClaimsExchangeId** to a friendly name, such as `AsignioExchange`.

1. In the next orchestration step, add a **ClaimsExchange** element. Set the **Id** to the value of the target claims exchange ID. Update the value of **TechnicalProfileReferenceId** to the ID of the technical profile you created earlier while adding the claims provider, for example, `Asignio-Oauth2`.

The following XML demonstrates orchestration steps of a user journey with the identity provider:

```xml
    <UserJourney Id="AsignioSUSI">
      <OrchestrationSteps>
        <OrchestrationStep Order="1" Type="CombinedSignInAndSignUp" ContentDefinitionReferenceId="api.signuporsignin">
          <ClaimsProviderSelections>
            <ClaimsProviderSelection TargetClaimsExchangeId="AsignioExchange" />
            <ClaimsProviderSelection ValidationClaimsExchangeId="LocalAccountSigninEmailExchange" />
          </ClaimsProviderSelections>
          <ClaimsExchanges>
            <ClaimsExchange Id="LocalAccountSigninEmailExchange" TechnicalProfileReferenceId="SelfAsserted-LocalAccountSignin-Email" />
          </ClaimsExchanges>
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
            <ClaimsExchange Id="AsignioExchange" TechnicalProfileReferenceId="Asignio-Oauth2" />
            <ClaimsExchange Id="SignUpWithLogonEmailExchange" TechnicalProfileReferenceId="LocalAccountSignUpWithLogonEmail" />
          </ClaimsExchanges>
        </OrchestrationStep>
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
        <!-- Show self-asserted page only if the directory does not have the user account already (i.e. we do not have an objectId). This can only happen when authentication happened using a social IDP. If local account was created or authentication done using ESTS in step 2, then an user account must exist in the directory by this time. -->
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
        <!-- This step reads any user attributes that we may not have received when authenticating using ESTS so they can be sent            in the token. -->
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
        <!-- The previous step (SelfAsserted-Social) could have been skipped if there were no attributes to collect from the user. So, in that case, create the user in the directory if one does not already exist (verified using objectId which would be set from the last step if account was created in the directory. -->
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

Learn more about [User Journeys](custom-policy-overview.md#user-journeys).

## Step 7: Configure the relying party policy

The relying party policy, for example [SignUpSignIn.xml](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/blob/main/LocalAccounts/SignUpOrSignin.xml), specifies the user journey which Azure AD B2C will execute. Find the **DefaultUserJourney** element within relying party. Update the **ReferenceId** to match the user journey ID, in which you added the identity provider.

In the following example, for the `AsignioSUSI` user journey, the **ReferenceId** is set to `AsignioSUSI`:

```xml
   <RelyingParty>
        <DefaultUserJourney ReferenceId="AsignioSUSI" />
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
            <OutputClaim ClaimTypeReferenceId="correlationId" DefaultValue="{Context:CorrelationId}" />
          </OutputClaims>
          <SubjectNamingInfo ClaimType="sub" />
        </TechnicalProfile>
      </RelyingParty>

```

## Step 8: Upload the custom policy

1. Sign in to the [Azure portal](https://portal.azure.com/#home).

1. Make sure you're using the directory that contains your Azure AD B2C tenant:

   a. Select the **Directories + subscriptions** icon in the portal toolbar.

   b. On the **Portal settings | Directories + subscriptions** page, find your Azure AD B2C directory in the **Directory name** list, and then select **Switch**.

1. In the [Azure portal](https://portal.azure.com/#home), search for and select **Azure AD B2C**.

1. Under Policies, select **Identity Experience Framework**.

1. Select **Upload Custom Policy**, and then upload the two policy files that you changed, in the following order: the extension policy, for example `TrustFrameworkExtensions.xml`, then the relying party policy, such as `SignUpOrSignin.xml`.

## Step 9: Test your custom policy

1. In your Azure AD B2C tenant blade, and under **Policies**, select **Identity Experience Framework**.

1. Under **Custom policies**, select **AsignioSUSI**.

1. For **Application**, select the web application that you previously registered as part of this article's prerequisites. The **Reply URL** should show `https://jwt.ms`.

1. Select **Run now**. Your browser should be redirected to the Asignio sign in page. 

1. A sign in screen will be shown; at the bottom should be a button to use **Asignio** authentication.

1. If you already have an Asignio Signature, you'll be prompted to authenticate with your Asignio Signature. If not, you'll be prompted to supply the phone number of your device to authenticate via SMS OTP and then receive a link to register your Asignio Signature.

1. If the sign-in process is successful, your browser is redirected to https://jwt.ms, which displays the contents of the token returned by Azure AD B2C.

::: zone-end

## Next steps

For additional information, review the following articles:

- [Azure AD B2C docs](solution-articles.md)

- [Ask your question on Stackoverflow](https://stackoverflow.com/questions/tagged/azure-ad-b2c)

- [Azure AD B2C Samples](https://stackoverflow.com/questions/tagged/azure-ad-b2c)

- [Azure AD B2C YouTube training playlist](https://www.youtube.com/playlist?list=PL3ZTgFEc7LyuJ8YRSGXBUVItCPnQz3YX0)

- [Custom policies in Azure AD B2C](custom-policy-overview.md)

- [Get started with custom policies in Azure AD B2C](tutorial-create-user-flows.md?pivots=b2c-custom-policy)
