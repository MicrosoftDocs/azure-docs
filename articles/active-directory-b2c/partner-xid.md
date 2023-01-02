---
title: Configure Azure Active Directory B2C with xID
titleSuffix: Azure AD B2C
description: Configure Azure Active Directory B2C with xID for passwordless authentication
services: active-directory-b2c
author: gargi-sinha
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 04/27/2022
ms.author: gasinh
ms.subservice: B2C
---

# Configure xID with Azure Active Directory B2C for passwordless authentication

In this sample tutorial, learn how to integrate Azure Active Directory B2C (Azure AD B2C) authentication with the xID digital ID solution. The xID app provides users with passwordless, secure, multifactor authentication. xID-authenticated users obtain their identities verified by a My Number Card, the digital ID card issued by the Japanese government. Organizations can get users verified Personal Identification Information (customer content) through the xID API. Furthermore, the xID app generates a private key in a secure area within user's mobile device, which can be used as a digital signing device.


## Prerequisites

To get started, you'll need:

- An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).

- An [Azure AD B2C tenant](./tutorial-create-tenant.md) that's linked to your Azure subscription.

- Your xID client information provided by xID inc. [Contact xID](https://xid.inc/contact-us) for the xID client information that should include the following parameters:
  - Client ID
  - Client Secret
  - Redirect URL
  - Scopes
- Download and install the [xID app](https://x-id.me/) on your mobile device.
  - To complete registration, you'll need your own My Number Card.
  - If you use the UAT version of API, you'll also need UAT version of xID app. To install UAT app, [contact xID inc](https://xid.inc/contact-us).

## Scenario description

The following architecture diagram shows the implementation.

![image shows the architecture diagram](./media/partner-xid/partner-xid-architecture-diagram.png)

| Step | Description                                                                                                                                                                                                                                                                                                                      |
| :--- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.   | User opens Azure AD B2C's sign-in page and then signs in or signs up by entering their username.                                                                                                                                                                                                                                 |
| 2.   | Azure AD B2C redirects the user to xID authorize API endpoint using an OpenID Connect (OIDC) request. An OIDC endpoint is available containing information about the endpoints. xID Identity provider (IdP) redirects the user to the xID authorization sign-in page allowing the user to fill in or select their email address. |
| 3.   | xID IdP sends the push notification to the user's mobile device.                                                                                                                                                                                                                                                                 |
| 4.   | The user opens the xID app, checks the request, then enters the PIN or authenticates with their biometrics. If PIN or biometrics is successfully verified, xID app activates the private key and creates an electronic signature.                                                                                                |
| 5.   | xID app sends the signature to xID IdP for verification.                                                                                                                                                                                                                                                                         |
| 6.   | xID IdP shows a consent screen to the user, requesting authorization to give their personal information to the service they're signing in.                                                                                                                                                                                       |
| 7.   | xID IdP returns the OAuth authorization code to Azure AD B2C.                                                                                                                                                                                                                                                                    |
| 8.   | Azure AD B2C sends a token request using the authorization code.                                                                                                                                                                                                                                                                 |
| 9.   | xID IdP checks the token request and, if still valid, returns the OAuth access token and the ID token containing the requested user's identifier and email address.                                                                                                                                                              |
| 10.  | In addition, if the user's customer content is needed, Azure AD B2C calls the xID userdata API.                                                                                                                                                                                                                                  |
| 11.  | The xID userdata API returns the user's encrypted customer content. Users can decrypt it with their private key, which they create when requesting the xID client information.                                                                                                                                                   |
| 12.  | User is either granted or denied access to the customer application based on the verification results.                                                                                                                                                                                                                           |


## Onboard with xID

Request API documents by filling out [the request form](https://xid.inc/contact-us). In the message field, indicate that you'd like to onboard with Azure AD B2C. Then, an xID sales representative will contact you. Follow the instructions provided in the xID API document and request an xID API client. xID tech team will send client information to you in 3-4 working days.
Supply redirect URI. This is the URI in your site to which the user is returned after a successful authentication. The URI that should be provided to xID for your Azure AD B2C follows the pattern - `https://<your-b2c-domain>.b2clogin.com/<your-b2c-domain>.onmicrosoft.com/oauth2/authresp`.

## Step 1: Register a web application in Azure AD B2C

Before your [applications](application-types.md) can interact with Azure AD B2C, they must be registered in a tenant that you manage.

For testing purposes like this tutorial, you're registering  `https://jwt.ms`, a Microsoft-owned web application that displays the decoded contents of a token (the contents of the token never leave your browser).

Follow the steps mentioned in [this tutorial](tutorial-register-applications.md?tabs=app-reg-ga) to **register a web application** and **enable ID token implicit grant** for testing a user flow or custom policy. There's no need to create a Client Secret at this time.

## Step 2: Create a xID policy key

Store the client secret that you received from xID in your Azure AD B2C tenant.

1. Sign in to the [Azure portal](https://portal.azure.com/).

2. Make sure you're using the directory that contains your Azure AD B2C tenant:

   a. Select the **Directories + subscriptions** icon in the portal toolbar.

   b. On the **Portal settings | Directories + subscriptions** page, find your Azure AD B2C directory in the Directory name list, and then select **Switch**.

3. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.

4. On the Overview page, select **Identity Experience Framework**.

5. Select **Policy Keys** and then select **Add**.

6. For **Options**, choose `Manual`.

7. Enter a **Name** for the policy key. For example, `X-IDClientSecret`. The prefix `B2C_1A_` is added automatically to the name of your key.

8. In **Secret**, enter your client secret that you previously received from xID.

9. For **Key usage**, select `Signature`.

10. Select **Create**.

>[!NOTE]
>In Azure AD B2C, [**custom policies**](./user-flow-overview.md) are designed primarily to address complex scenarios.

## Step 3: Configure xID as an Identity provider

To enable users to sign in using xID, you need to define xID as a claims provider that Azure AD B2C can communicate with through an endpoint. The endpoint provides a set of claims Azure AD B2C uses to verify that a specific user has authenticated using digital identity available on their device. Proving the user's identity.

Use the following steps to add xID as a claims provider:

1. Get the custom policy starter packs from GitHub, then update the XML files in the SocialAccounts starter pack with your Azure AD B2C tenant name:

    i. Download the [.zip file](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/archive/master.zip) or [clone the repository](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack).
      
    ii. In all of the files in the **SocialAccounts** directory, replace the string `yourtenant` with the name of your Azure AD B2C tenant. For example, if the name of your B2C tenant is `contoso`, all instances of `yourtenant.onmicrosoft.com` become `contoso.onmicrosoft.com`. 

2. Open the `SocialAccounts/TrustFrameworkExtensions.xml`.

3. Find the **ClaimsProviders** element. If it doesn't exist, add it under the root element.

4. Add a new **ClaimsProvider** similar to the one shown below:

   ```xml

    <ClaimsProvider>
      <Domain>X-ID</Domain>
      <DisplayName>X-ID</DisplayName>
      <TechnicalProfiles>
        <TechnicalProfile Id="X-ID-Oauth2">
          <DisplayName>X-ID</DisplayName>
          <Description>Login with your X-ID account</Description>
          <Protocol Name="OAuth2" />
          <Metadata>
            <Item Key="METADATA">https://oidc-uat.x-id.io/.well-known/openid-configuration</Item>
            <!-- Update the Client ID below to the X-ID Application ID -->
            <Item Key="client_id">00000000-0000-0000-0000-000000000000</Item>
            <Item Key="response_types">code</Item>
            <Item Key="scope">openid verification</Item>
            <Item Key="response_mode">query</Item>
            <Item Key="HttpBinding">POST</Item>
            <Item Key="UsePolicyInRedirectUri">false</Item>
            <Item Key="DiscoverMetadataByTokenIssuer">true</Item>
            <Item Key="token_endpoint_auth_method">client_secret_basic</Item>
            <Item Key="ClaimsEndpoint">https://oidc-uat.x-id.io/userinfo</Item>
            <Item Key="ValidTokenIssuerPrefixes">https://oidc-uat.x-id.io/</Item>
          </Metadata>
          <CryptographicKeys>
            <Key Id="client_secret" StorageReferenceId="B2C_1A_XIDSecAppSecret" />
          </CryptographicKeys>
          <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="issuerUserId" PartnerClaimType="sub" />
            <OutputClaim ClaimTypeReferenceId="tenantId" PartnerClaimType="tid" />
            <OutputClaim ClaimTypeReferenceId="email" />
            <OutputClaim ClaimTypeReferenceId="sid" />
            <OutputClaim ClaimTypeReferenceId="userdataid" />
            <OutputClaim ClaimTypeReferenceId="XID_verified" />
            <OutputClaim ClaimTypeReferenceId="email_verified" />
            <OutputClaim ClaimTypeReferenceId="authenticationSource" DefaultValue="socialIdpAuthentication" AlwaysUseDefaultValue="true" />
            <OutputClaim ClaimTypeReferenceId="identityProvider" PartnerClaimType="iss" DefaultValue="https://oidc-uat.x-id.io/" />
            <OutputClaim ClaimTypeReferenceId="identityProviderAccessToken" PartnerClaimType="{oauth2:access_token}" />
          </OutputClaims>
          <OutputClaimsTransformations>
            <OutputClaimsTransformation ReferenceId="CreateRandomUPNUserName" />
            <OutputClaimsTransformation ReferenceId="CreateUserPrincipalName" />
            <OutputClaimsTransformation ReferenceId="CreateAlternativeSecurityId" />
            <OutputClaimsTransformation ReferenceId="CreateSubjectClaimFromAlternativeSecurityId" />
          </OutputClaimsTransformations>
          <UseTechnicalProfileForSessionManagement ReferenceId="SM-SocialLogin" />
        </TechnicalProfile>

      <TechnicalProfile Id="X-ID-Userdata">
        <DisplayName>Userdata (Personal Information)</DisplayName>
        <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.RestfulProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
        <Metadata>
          <Item Key="ServiceUrl">https://api-uat.x-id.io/v4/verification/userdata</Item>
          <Item Key="SendClaimsIn">Header</Item>
          <Item Key="AuthenticationType">Bearer</Item>
          <Item Key="UseClaimAsBearerToken">identityProviderAccessToken</Item>
          <!-- <Item Key="AllowInsecureAuthInProduction">true</Item> -->
          <Item Key="DebugMode">true</Item>
          <Item Key="DefaultUserMessageIfRequestFailed">Can't process your request right now, please try again later.</Item>
        </Metadata>
        <InputClaims>
          <!-- Claims sent to your REST API -->
          <InputClaim ClaimTypeReferenceId="identityProviderAccessToken" />
        </InputClaims>
        <OutputClaims>
          <!-- Claims parsed from your REST API -->
          <OutputClaim ClaimTypeReferenceId="last_name" PartnerClaimType="givenName" />
          <OutputClaim ClaimTypeReferenceId="first_name" PartnerClaimType="surname" />
          <OutputClaim ClaimTypeReferenceId="previous_name" />
          <OutputClaim ClaimTypeReferenceId="year" />
          <OutputClaim ClaimTypeReferenceId="month" />
          <OutputClaim ClaimTypeReferenceId="date" />
          <OutputClaim ClaimTypeReferenceId="prefecture" />
          <OutputClaim ClaimTypeReferenceId="city" />
          <OutputClaim ClaimTypeReferenceId="address" />
          <OutputClaim ClaimTypeReferenceId="sub_char_common_name" />
          <OutputClaim ClaimTypeReferenceId="sub_char_previous_name" />
          <OutputClaim ClaimTypeReferenceId="sub_char_address" />
          <OutputClaim ClaimTypeReferenceId="gender" />
          <OutputClaim ClaimTypeReferenceId="verified_at" />
        </OutputClaims>
        <UseTechnicalProfileForSessionManagement ReferenceId="SM-Noop" />
      </TechnicalProfile>
    </TechnicalProfiles>
    </ClaimsProvider>

   ```

4. Set **client_id** with your xID Application ID.

5. Save the changes.

## Step 4: Add a user journey

At this point, you've set up the identity provider, but it's not yet available on any of the sign-in pages. If you have a custom user journey, continue to [step 5](#step-5-add-the-identity-provider-to-a-user-journey). Otherwise, create a duplicate of an existing template user journey as follows:

1. Open the `TrustFrameworkBase.xml` file from the starter pack.

2. Find and copy the entire contents of the **UserJourneys** element that includes `ID=SignUpOrSignIn`.

3. Open the `TrustFrameworkExtensions.xml` and find the UserJourneys element. If the element doesn't exist, add one.

4. Paste the entire content of the UserJourney element that you copied as a child of the UserJourneys element.

5. Rename the ID of the user journey. For example, `ID=CustomSignUpSignIn`

## Step 5: Add the identity provider to a user journey

Now that you have a user journey add the new identity provider to the user journey.

1. Find the orchestration step element that includes Type=`CombinedSignInAndSignUp`, or Type=`ClaimsProviderSelection` in the user journey. It's usually the first orchestration step. The **ClaimsProviderSelections** element contains a list of identity providers used for signing in. The order of the elements controls the order of the sign-in buttons presented to the user. Add a **ClaimsProviderSelection** XML element. Set the value of **TargetClaimsExchangeId** to a friendly name, such as `X-IDExchange`.

2. In the next orchestration step, add a **ClaimsExchange** element. Set the **Id** to the value of the target claims exchange ID to link the xID button to `X-IDExchange` action. Next, update the value of **TechnicalProfileReferenceId** to the ID of the technical profile you created earlier `X-ID-Oauth2`.

3. Add a new Orchestration step to call xID UserInfo endpoint to return claims about the authenticated user `X-ID-Userdata`.

   The following XML demonstrates the orchestration steps of a user journey with xID identity provider:

   ```xml

    <UserJourney Id="CombinedSignInAndSignUp">
      <OrchestrationSteps>

        <OrchestrationStep Order="1" Type="CombinedSignInAndSignUp" ContentDefinitionReferenceId="api.signuporsignin">
          <ClaimsProviderSelections>
            <ClaimsProviderSelection TargetClaimsExchangeId="X-IDExchange" />
          </ClaimsProviderSelections>
        </OrchestrationStep>

        <OrchestrationStep Order="2" Type="ClaimsExchange">
          <ClaimsExchanges>
            <ClaimsExchange Id="X-IDExchange" TechnicalProfileReferenceId="X-ID-Oauth2" />
          </ClaimsExchanges>
        </OrchestrationStep>

        <OrchestrationStep Order="3" Type="ClaimsExchange">
          <ClaimsExchanges>
            <ClaimsExchange Id="X-ID-Userdata" TechnicalProfileReferenceId="X-ID-Userdata" />
          </ClaimsExchanges>
        </OrchestrationStep>

        <!-- For social IDP authentication, attempt to find the user account in the directory. -->
        <OrchestrationStep Order="4" Type="ClaimsExchange">
          <ClaimsExchanges>
            <ClaimsExchange Id="AADUserReadUsingAlternativeSecurityId" TechnicalProfileReferenceId="AAD-UserReadUsingAlternativeSecurityId-NoError" />
          </ClaimsExchanges>
        </OrchestrationStep>

        <!-- Show self-asserted page only if the directory does not have the user account already (i.e. we do not have an objectId).  -->
        <OrchestrationStep Order="5" Type="ClaimsExchange">
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

There are additional identity claims that xID supports and are referenced as part of the policy. Claims schema is the place where you declare these claims. ClaimsSchema element contains list of ClaimType elements. The ClaimType element contains the Id attribute, which is the claim name.

1. Open the `TrustFrameworksExtension.xml`

2. Find the `BuildingBlocks` element.

3. Add the following ClaimType element in the **ClaimsSchema** element of your `TrustFrameworksExtension.xml` policy

```xml
 <BuildingBlocks>
    <ClaimsSchema>
      <!-- xID -->
      <ClaimType Id="sid">
        <DisplayName>sid</DisplayName>
        <DataType>string</DataType>
      </ClaimType>
      <ClaimType Id="userdataid">
        <DisplayName>userdataid</DisplayName>
        <DataType>string</DataType>
      </ClaimType>
      <ClaimType Id="xid_verified">
        <DisplayName>xid_verified</DisplayName>
        <DataType>boolean</DataType>
      </ClaimType>
      <ClaimType Id="email_verified">
        <DisplayName>email_verified</DisplayName>
        <DataType>boolean</DataType>
      </ClaimType>
      <ClaimType Id="identityProviderAccessToken">
        <DisplayName>Identity Provider Access Token</DisplayName>
        <DataType>string</DataType>
        <AdminHelpText>Stores the access token of the identity provider.</AdminHelpText>
      </ClaimType>
      <ClaimType Id="last_name">
        <DisplayName>last_name</DisplayName>
        <DataType>string</DataType>
      </ClaimType>
      <ClaimType Id="first_name">
        <DisplayName>first_name</DisplayName>
        <DataType>string</DataType>
      </ClaimType>
      <ClaimType Id="previous_name">
        <DisplayName>previous_name</DisplayName>
        <DataType>string</DataType>
      </ClaimType>
      <ClaimType Id="year">
        <DisplayName>year</DisplayName>
        <DataType>string</DataType>
      </ClaimType>
      <ClaimType Id="month">
        <DisplayName>month</DisplayName>
        <DataType>string</DataType>
      </ClaimType>
      <ClaimType Id="date">
        <DisplayName>date</DisplayName>
        <DataType>string</DataType>
      </ClaimType>
      <ClaimType Id="prefecture">
        <DisplayName>prefecture</DisplayName>
        <DataType>string</DataType>
      </ClaimType>
      <ClaimType Id="city">
        <DisplayName>city</DisplayName>
        <DataType>string</DataType>
      </ClaimType>
      <ClaimType Id="address">
        <DisplayName>address</DisplayName>
        <DataType>string</DataType>
      </ClaimType>
      <ClaimType Id="sub_char_common_name">
        <DisplayName>sub_char_common_name</DisplayName>
        <DataType>string</DataType>
      </ClaimType>
      <ClaimType Id="sub_char_previous_name">
        <DisplayName>sub_char_previous_name</DisplayName>
        <DataType>string</DataType>
      </ClaimType>
      <ClaimType Id="sub_char_address">
        <DisplayName>sub_char_address</DisplayName>
        <DataType>string</DataType>
      </ClaimType>
      <ClaimType Id="verified_at">
        <DisplayName>verified_at</DisplayName>
        <DataType>int</DataType>
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
      <ClaimType Id="correlationId">
        <DisplayName>correlation ID</DisplayName>
        <DataType>string</DataType>
      </ClaimType>
      <!-- xID -->
    </ClaimsSchema>
  </BuildingBlocks>
```

## Step 6: Configure the relying party policy

The relying party policy, for example [SignUpSignIn.xml](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/blob/main/LocalAccounts/SignUpOrSignin.xml), specifies the user journey which Azure AD B2C will execute. First, find the **DefaultUserJourney** element within the relying party. Then, update the **ReferenceId** to match the user journey ID you added to the identity provider.

In the following example, for the xID user journey, the **ReferenceId** is set to `CombinedSignInAndSignUp`:

```xml
   <RelyingParty>
        <DefaultUserJourney ReferenceId="CombinedSignInAndSignUp" />
        <TechnicalProfile Id="PolicyProfile">
          <DisplayName>PolicyProfile</DisplayName>
          <Protocol Name="OpenIdConnect" />
          <OutputClaims>
          <OutputClaim ClaimTypeReferenceId="objectId" PartnerClaimType="sub" />
          <OutputClaim ClaimTypeReferenceId="tenantId" AlwaysUseDefaultValue="true" DefaultValue="{Policy:TenantObjectId}" />
          <OutputClaim ClaimTypeReferenceId="correlationId" DefaultValue="{Context:CorrelationId}" />
          <OutputClaim ClaimTypeReferenceId="issuerUserId" />
          <OutputClaim ClaimTypeReferenceId="givenName" PartnerClaimType="first_name" />
          <OutputClaim ClaimTypeReferenceId="surName" PartnerClaimType="last_name" />
          <OutputClaim ClaimTypeReferenceId="previous_name" />
          <OutputClaim ClaimTypeReferenceId="year" />
          <OutputClaim ClaimTypeReferenceId="month" />
          <OutputClaim ClaimTypeReferenceId="date" />
          <OutputClaim ClaimTypeReferenceId="prefecture" />
          <OutputClaim ClaimTypeReferenceId="city" />
          <OutputClaim ClaimTypeReferenceId="address" />
          <OutputClaim ClaimTypeReferenceId="sub_char_common_name" />
          <OutputClaim ClaimTypeReferenceId="sub_char_previous_name" />
          <OutputClaim ClaimTypeReferenceId="sub_char_address" />
          <OutputClaim ClaimTypeReferenceId="gender" />
          <OutputClaim ClaimTypeReferenceId="verified_at" />
          <OutputClaim ClaimTypeReferenceId="email" />
          <OutputClaim ClaimTypeReferenceId="sid" />
          <OutputClaim ClaimTypeReferenceId="userdataid" />
          <OutputClaim ClaimTypeReferenceId="xid_verified" />
          <OutputClaim ClaimTypeReferenceId="email_verified" />
          </OutputClaims>
          <SubjectNamingInfo ClaimType="sub" />
        </TechnicalProfile>
      </RelyingParty>

```

## Step 7: Upload the custom policy

1. Sign in to the [Azure portal](https://portal.azure.com/#home).

2. Make sure you're using the directory that contains your Azure AD B2C tenant: 

    a. Select the **Directories + subscriptions** icon in the portal toolbar.

    b. On the **Portal settings | Directories + subscriptions** page, find your Azure AD B2C directory in the **Directory name** list, and select **Switch**.

3. In the [Azure portal](https://portal.azure.com/#home), search for and select **Azure AD B2C**.

4. Under Policies, select **Identity Experience Framework**.

5. Select **Upload Custom Policy**, and then upload the files in the following order: 
   1. `TrustFrameworkBase.xml`, the base policy file
   2. `TrustFrameworkExtensions.xml`, the extension policy
   3. `SignUpSignIn.xml`, then the relying party policy

## Step 8: Test your custom policy

1. In your Azure AD B2C tenant, and under **Policies**, select **Identity Experience Framework**.

1. Under **Custom policies**, select **CustomSignUpSignIn**.

3. For **Application**, select the web application that you previously registered as part of this article's prerequisites. The **Reply URL** should show `https://jwt.ms`.

4. Select **Run now**. Your browser should redirect to the xID sign in page.

5. If the sign-in process is successful, your browser redirects to `https://jwt.ms`, which displays the contents of the token returned by Azure AD B2C.

## Next steps

For additional information, review the following articles:

- [Custom policies in Azure AD B2C](custom-policy-overview.md)

- [Get started with custom policies in Azure AD B2C](tutorial-create-user-flows.md?pivots=b2c-custom-policy)
