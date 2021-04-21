---
title: Tutorial to configure BioCatch with Azure Active Directory B2C 
titleSuffix: Azure AD B2C
description: Tutorial to configure Azure Active Directory B2C with BioCatch to identify risky and fraudulent users
services: active-directory-b2c
author: gargi-sinha
manager: martinco

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 04/20/2021
ms.author: gasinh
ms.subservice: B2C
---

# Tutorial: Configure BioCatch with Azure Active Directory B2C

In this sample tutorial, learn how to integrate Azure Active Directory (AD) B2C authentication with [BioCatch](https://www.biocatch.com/) to further augment your Customer Identity and Access Management (CIAM) security posture. BioCatch analyzes a user's physical and cognitive digital behaviors to generate insights that distinguish between legitimate customers and cyber-criminals.

## Prerequisites

To get started, you'll need:

- An Azure subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).

- [An Azure AD B2C tenant](tutorial-create-tenant.md) that is linked to your Azure subscription.

- A [BioCatch](https://www.biocatch.com/contact-us) account.

## Scenario description

BioCatch integration includes the following components:

- **A web app or web service** - The user first browses to this web service. This web service instantiates a unique client session ID that is sent to BioCatch. The client session ID then immediately begins transmitting user behavior characteristics to BioCatch.

- **A method** - Sends the unique client session ID to Azure AD B2C. In the provided example, JavaScript is used to input the value into a hidden HTML field.

- **An Azure AD B2C customized UI** - Hides an HTML field for the client session ID input from JavaScript, if using the above method

- **Azure AD B2C custom policy**

  - Takes the custom client session ID from the UI in the form of a claim. This is achieved via a self-asserted technical profile

  - Integrates with BioCatch via a REST API claims provider and passes the client session ID to the BioCatch platform

  - Multiple custom claims are returned from BioCatch for the custom policy logic to then act upon

  - A userjourney, which evaluates a returned claim, for example, session risk, and conditionally executes an action, such as invoke Multi-factor authentication (MFA).

![Diagram of the bio catch architecture.](media/partner-biocatch/biocatch-architecture-diagram.png)

| Step  | Description |
|:---|:-----------------------|
|1a     | The user browses the web service. The web service then returns HTML, CSS, or JavaScript values and configures to load the BioCatch JavaScript SDK. Client-side JavaScript configures/sets client session ID for the BioCatch SDK. Alternately, the web service can pre-configure client session ID and send to the client.        |
|1b    |  Configure the instantiated BioCatch JavaScript SDK against the BioCatch platform. Immediately begin to send user behavior characteristics to BioCatch from the client device, using the client session ID from step 1a.    |
|2     |  User tries to sign-up/sign-in and is redirected to Azure AD B2C.      |
|3a    | Part of the userjourney is a self-asserted claimsprovider, which takes the client session ID as input. This field is hidden on the screen. You can use JavaScript to input the session ID into the field. Select the *next* button, to continue the sign-up/sign-in process.|
|3b     | The client session ID is submitted to the BioCatch platform to determine a risk score. |
|3c     | BioCatch returns information about the session, such as risk score, and a recommendation on what to do – allow or block |
|3d    |The userjourney has a conditional check step, which acts upon the returned claims|
| 4   | Based on the conditional check result, an action such as *step-up MFA* is invoked|
|5    | At any time from when the user first hits the web service page, the web service can use the client session ID to query the BioCatch API to determine risk score and session information in real-time. |

## Onboard with BioCatch

Contact [BioCatch](https://www.biocatch.com/contact-us) and create an account.

## Configure the custom UI

It's recommended to hide the client session ID field. Use CSS, JavaScript, or any other method to hide the field. For testing purposes, you may unhide the field. For example, JavaScript is used to hide the input field as:

```
document.getElementById("clientSessionId").style.display = 'none';
```

## Configure  Azure AD B2C Identity Experience Framework policies

1. Configure the initial [custom policy configuration](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-get-started).

2. Create a new file, which inherits from the extensions file.

    ```
    <BasePolicy> 

        <TenantId>tenant.onmicrosoft.com</TenantId> 

        <PolicyId>B2C_1A_TrustFrameworkExtensions</PolicyId> 

      </BasePolicy> 
    ```

3. Create a reference to the custom UI to hide the input box, under the BuildingBlocks resource.

    ```
    <ContentDefinitions> 

        <ContentDefinition Id="api.selfasserted"> 

            <LoadUri>https://domain.com/path/to/selfAsserted.cshtml</LoadUri> 

            <DataUri>urn:com:microsoft:aad:b2c:elements:contract:selfasserted:2.1.0</DataUri> 

          </ContentDefinition> 

        </ContentDefinitions>
    ```

4. Add the following claims under the BuildingBlocks resource.

    ```
    <ClaimsSchema> 

          <ClaimType Id="riskLevel"> 

            <DisplayName>Session risk level</DisplayName> 

            <DataType>string</DataType>       

          </ClaimType> 

          <ClaimType Id="score"> 

            <DisplayName>Session risk score</DisplayName> 

            <DataType>int</DataType>       

          </ClaimType> 

          <ClaimType Id="clientSessionId"> 

            <DisplayName>The ID of the client session</DisplayName> 

            <DataType>string</DataType> 

            <UserInputType>TextBox</UserInputType> 

          </ClaimType> 

    <ClaimsSchema> 
    ```

5. Configure self-asserted claims provider for the client session ID field.

    ```
    <ClaimsProvider> 

          <DisplayName>Client Session ID Claims Provider</DisplayName> 

          <TechnicalProfiles> 

            <TechnicalProfile Id="login-NonInteractive-clientSessionId"> 

              <DisplayName>Client Session ID TP</DisplayName> 

              <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.SelfAssertedAttributeProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" /> 

              <Metadata> 

                <Item Key="ContentDefinitionReferenceId">api.selfasserted</Item> 

              </Metadata> 

              <CryptographicKeys> 

                <Key Id="issuer_secret" StorageReferenceId="B2C_1A_TokenSigningKeyContainer" /> 

              </CryptographicKeys> 

            <!—Claim we created earlier --> 

              <OutputClaims> 

                <OutputClaim ClaimTypeReferenceId="clientSessionId" Required="false" DefaultValue="100"/> 

              </OutputClaims> 

            <UseTechnicalProfileForSessionManagement ReferenceId="SM-AAD" /> 

            </TechnicalProfile> 

          </TechnicalProfiles> 

        </ClaimsProvider> 
    ```

6. Configure REST API claims provider for BioCatch. 

    ```
    <TechnicalProfile Id="BioCatch-API-GETSCORE"> 

          <DisplayName>Technical profile for BioCatch API to return session information</DisplayName> 

          <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.RestfulProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" /> 

          <Metadata> 

            <Item Key="ServiceUrl">https://biocatch-url.com/api/v6/score?customerID=<customerid>&amp;action=getScore&amp;uuid=<uuid>&amp;customerSessionID={clientSessionId}&amp;solution=ATO&amp;activtyType=<activity_type>&amp;brand=<brand></Item> 

            <Item Key="SendClaimsIn">Url</Item> 

            <Item Key="IncludeClaimResolvingInClaimsHandling">true</Item> 

            <!-- Set AuthenticationType to Basic or ClientCertificate in production environments --> 

            <Item Key="AuthenticationType">None</Item> 

            <!-- REMOVE the following line in production environments --> 

            <Item Key="AllowInsecureAuthInProduction">true</Item> 

          </Metadata> 

          <InputClaims> 

            <InputClaim ClaimTypeReferenceId="clientsessionId" /> 

          </InputClaims> 

          <OutputClaims> 

            <OutputClaim ClaimTypeReferenceId="riskLevel" /> 

            <OutputClaim ClaimTypeReferenceId="score" /> 

          </OutputClaims> 

          <UseTechnicalProfileForSessionManagement ReferenceId="SM-Noop" /> 

        </TechnicalProfile> 

      </TechnicalProfiles>
    ```

    > [!Note]
    > BioCatch will provide you the URL, customer ID and unique user ID (uuID) to configure. The customer SessionID claim is passed through as a querystring parameter to BioCatch. You can choose the activity type, for example *MAKE_PAYMENT*.

7. Configure the userjourney; follow the example

   1. Get the clientSessionID as a claim

   1. Call the BioCatch API to get the session information

   1. If the returned claim *risk* equals *low*, skip the step for MFA, else force user MFA

    ```
    <OrchestrationStep Order="8" Type="ClaimsExchange"> 

              <ClaimsExchanges> 

                <ClaimsExchange Id="clientSessionIdInput" TechnicalProfileReferenceId="login-NonInteractive-clientSessionId" /> 

              </ClaimsExchanges> 

            </OrchestrationStep> 

            <OrchestrationStep Order="9" Type="ClaimsExchange"> 

              <ClaimsExchanges> 

                <ClaimsExchange Id="BcGetScore" TechnicalProfileReferenceId=" BioCatch-API-GETSCORE" /> 

              </ClaimsExchanges> 

            </OrchestrationStep> 

            <OrchestrationStep Order="10" Type="ClaimsExchange"> 

              <Preconditions> 

                <Precondition Type="ClaimEquals" ExecuteActionsIf="true"> 

                  <Value>riskLevel</Value> 

                  <Value>LOW</Value> 

                  <Action>SkipThisOrchestrationStep</Action> 

                </Precondition> 

              </Preconditions> 

              <ClaimsExchanges> 

                <ClaimsExchange Id="PhoneFactor-Verify" TechnicalProfileReferenceId="PhoneFactor-InputOrVerify" /> 

              </ClaimsExchanges>  

    ```

8. Configure on relying party configuration (optional)

    It is useful to pass the BioCatch returned information to your application as claims in the token, specifically *risklevel* and *score*.

    ```
    <RelyingParty> 

        <DefaultUserJourney ReferenceId="SignUpOrSignInMfa" /> 

        <UserJourneyBehaviors> 

          <SingleSignOn Scope="Tenant" KeepAliveInDays="30" /> 

          <SessionExpiryType>Absolute</SessionExpiryType> 

          <SessionExpiryInSeconds>1200</SessionExpiryInSeconds> 

          <ScriptExecution>Allow</ScriptExecution> 

        </UserJourneyBehaviors> 

        <TechnicalProfile Id="PolicyProfile"> 

          <DisplayName>PolicyProfile</DisplayName> 

          <Protocol Name="OpenIdConnect" /> 

          <OutputClaims> 

            <OutputClaim ClaimTypeReferenceId="displayName" /> 

            <OutputClaim ClaimTypeReferenceId="givenName" /> 

            <OutputClaim ClaimTypeReferenceId="surname" /> 

            <OutputClaim ClaimTypeReferenceId="email" /> 

            <OutputClaim ClaimTypeReferenceId="objectId" PartnerClaimType="sub" /> 

            <OutputClaim ClaimTypeReferenceId="identityProvider" />                 

            <OutputClaim ClaimTypeReferenceId="riskLevel" /> 

            <OutputClaim ClaimTypeReferenceId="score" /> 

            <OutputClaim ClaimTypeReferenceId="tenantId" AlwaysUseDefaultValue="true" DefaultValue="{Policy:TenantObjectId}" /> 

          </OutputClaims> 

          <SubjectNamingInfo ClaimType="sub" /> 

        </TechnicalProfile> 

      </RelyingParty> 

    ```

## Integrate with Azure AD B2C

Follow these steps to add the policy files to Azure AD B2C

1. Sign in to the [**Azure portal**](https://portal.azure.com/) as the global administrator of your Azure AD B2C tenant.

2. Make sure you're using the directory that contains your Azure AD B2C tenant. Select **Directory + subscription** filter in the top menu and choose the directory that contains your tenant.

3. Choose **All services** in the top-left corner of the Azure portal, search for and select Azure AD B2C.

4. Navigate to **Azure AD B2C** > **Identity Experience Framework**

3. Upload all the policy files to your tenant.

## Test the solution

1. [Register a dummy application, which redirects to JWT.MS](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-register-applications?tabs=app-reg-ga)  

2. Under the **Identity Experience Framework**, select the policy you created

3. In the policy window, select the dummy JWT.MS application, and select **run now**

4. Go through sign-up flow and create an account. Token returned to JWT.MS should have 2x claims for riskLevel and score. Follow the example.  

    ```
    { 

      "typ": "JWT", 

      "alg": "RS256", 

      "kid": "_keyid" 

    }.{ 

      "exp": 1615872580, 

      "nbf": 1615868980, 

      "ver": "1.0", 

      "iss": "https://tenant.b2clogin.com/12345678-1234-1234-1234-123456789012/v2.0/", 

      "sub": "12345678-1234-1234-1234-123456789012", 

      "aud": "12345678-1234-1234-1234-123456789012", 

      "acr": "b2c_1a_signup_signin_biocatch_policy", 

      "nonce": "defaultNonce", 

      "iat": 1615868980, 

      "auth_time": 1615868980, 

      "name": "John Smith", 

      "email": "john.smith@contoso.com", 

      "given_name": "John", 

      "family_name": "Smith", 

      "riskLevel": "LOW", 

      "score": 275, 

      "tid": "12345678-1234-1234-1234-123456789012" 

    }.[Signature]  

    ```

## Additional resources

- [Custom policies in Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-overview)

- [Get started with custom policies in Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-get-started?tabs=applications)
