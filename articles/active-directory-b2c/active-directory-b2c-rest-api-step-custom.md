---
title: 'Walkthrough: REST API claims exchange as a step in your B2C Custom Policies| Microsoft Docs'
description: A topic on Azure Active Directory B2C custom policies integrating with API
services: active-directory-b2c
documentationcenter: ''
author: rojasja
manager: krassk
editor: rojasja

ms.assetid:
ms.service: active-directory-b2c
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: article
ms.devlang: na
ms.date: 04/24/2017
ms.author: joroja
---

# Walkthrough: Integrate REST API claims exchanges in your Azure AD B2C user journeys as an orchestration step

The **Identity Experience Framework** (IEF) underlying Azure AD B2C enables the identity developer to integrate an interaction with a RESTful API in a user journey.  

At the end of this walkthrough you will be able to create Azure AD B2C user journeys which interact with RESTful services.

The IEF sends data in claims and receives data back in claims.  The REST API claims exchange can be designed as an orchestrations step.

- This can trigger an external action - for instance, it can log an event in an external database.
- This can also be used to fetch a value and subsequently stores it in the user database.
- The claims received can be later used to change the flow of execution.

The interaction can also be designed as a validation profile. For more information about that, please see [Walkthrough: Integrate REST API claims exchanges in your Azure AD B2C user journeys as validation on user input](active-directory-b2c-rest-api-validation-custom.md).

The scenario is that when a user performs a profile edit, we would like to lookup the user in an external system, get the city where that user is registered and return that attribute as a claim back to the application.

## Prerequisites

- An Azure AD B2C tenant configure to complete a local account signup/signin as described in [Getting Started](active-directory-b2c-get-started-custom.md).
- A REST API endpoint to interact with - this walkthrough uses a very simple Azure Function Apps WebHook as an example
- **Recommended**: Complete the [REST API claims exchange walkthrough as a validation step](active-directory-b2c-rest-api-validation-custom.md).

## Step 1 - Prepare the REST API function

> [!NOTE]
> Set up of REST API functions is outside the scope of this article. [Azure Function Apps](https://docs.microsoft.com/azure/azure-functions/functions-reference) provides an excellent toolkit to create RESTful services in the cloud.

We have set up an Azure Function that receives a claim `email`, and simply returns the claim `city` with the assigned value of `Redmond`. The sample Azure function is here: [Github](https://github.com/Azure-Samples/active-directory-b2c-advanced-policies/tree/master/AzureFunctionsSamples)

The `userMessage` claim returned by the Azure Function is optional in this context and will be ignored by the IEF.  It could potentially be used as a message passed to the application and presented to the user later.

```
if (requestContentAsJObject.email == null)
    {
        return request.CreateResponse(HttpStatusCode.BadRequest);
    }

    var email = ((string) requestContentAsJObject.email).ToLower();


     return request.CreateResponse<ResponseContent>(
            HttpStatusCode.OK,
            new ResponseContent
            {
                version = "1.0.0",
                status = (int) HttpStatusCode.OK,
                userMessage = "User Found",
                city = "Redmond"
            },
            new JsonMediaTypeFormatter(),
            "application/json");
```

**Azure Function Apps** makes it easy to Get Function URL, which includes the identifier of the specific function.  In this case, the URL is: https://wingtipb2cfuncs.azurewebsites.net/api/LookUpLoyaltyWebHook?code=MQuG7BIE3eXBaCZ/YCfY1SHabm55HEphpNLmh1OP3hdfHkvI2QwPrw==, and you may use it for testing purposes.

## Step 2 - Configure the RESTful API claims exchange as a technical profile in your TrustFrameworExtensions.xml file

A technical profile is the full configuration of the exchange desired with the RESTful service. Open the `TrustFrameworkExtensions.xml` file and add the XML snippet below inside the `<ClaimsProvider>` element.

> [!NOTE]
> Consider the “Restful Provider, Version 1.0.0.0”  described below as the protocol as the function that will interact with the external service.  A full definition of the schema can be found <!-- TODO: Link to RESTful Provider schema definition>-->

```XML
<ClaimsProvider>
        <DisplayName>REST APIs</DisplayName>
        <TechnicalProfiles>
            <TechnicalProfile Id="AzureFunctions-LookUpLoyaltyWebHook">     
                <DisplayName>Check LookUpLoyalty Web Hook Azure Function</DisplayName>
                <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.RestfulProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
                <Metadata>
                    <Item Key="ServiceUrl">https://wingtipb2cfuncs.azurewebsites.net/api/LookUpLoyaltyWebHook?code=MQuG7BIE3eXBaCZ/YCfY1SHabm55HEphpNLmh1OP3hdfHkvI2QwPrw==</Item>
                    <Item Key="AuthenticationType">None</Item>
                    <Item Key="SendClaimsIn">Body</Item>
                </Metadata>
                <InputClaims>
                    <InputClaim ClaimTypeReferenceId="givenName" PartnerClaimType="email" />
                </InputClaims>
                <OutputClaims>
                    <OutputClaim ClaimTypeReferenceId="city" PartnerClaimType="city" />
                </OutputClaims>
                <UseTechnicalProfileForSessionManagement ReferenceId="SM-Noop" />
            </TechnicalProfile>
        </TechnicalProfiles>
    </ClaimsProvider>
```

The `<InputClaims>` element defines the claims that will be sent from the IEF to the REST service. In the above example, the contents of the claim `givenName` will be sent to the REST service as claim `email`.  

The `<OutputClaims>` element defines the claims that the IEF will expect from the REST service. Regardless of the number of claims that are received, the IEF will only use those identified here. In this example, a claim received as `city` will be mapped to an IEF claim `city`.

## Step 3 - Add a new claim `city` to the schema of your TrustFrameworkExtensions.xml file

The claim `city` is not otherwise defined anywhere in our schema. So we will add a definition inside the element `<BuildingBlocks>` which can be found at the beginning of the  `TrustFrameworkExtensions.xml` file.

```XML
<BuildingBlocks>
<!--The claimtype city must be added to the TrustFrameworkPolicy-->
<!-- You can add new claims in the BASE file Section III, or in the extensions file-->
<ClaimsSchema>
        <ClaimType Id="city">
            <DisplayName>City</DisplayName>
            <DataType>string</DataType>
            <UserHelpText>Your city</UserHelpText>
            <UserInputType>TextBox</UserInputType>
        </ClaimType>
    </ClaimsSchema>
  </BuildingBlocks>
```

## Step 4 - Include the REST service claims exchange as an Orchestration Step in your Profile Edit User journey in your TrustFrameworkExtensions.xml

We have decided to add the step the profile edit user journey, after the user has authenticated (Orchestration steps 1-4 – see below), and the user has provided the updated profile information (Step 5).

> [!NOTE]
> There are many use cases where the REST API Call can be used as an Orchestration Step.  As an Orchestration Step, it may be used as an update to an external system once a user has successfully completed a task like first time registration, or profile update to keep information synchronized.  In this case it is used to augment the information provided to the application after profile edit.

Copy the profile edit user journey XML code from the `TrustFrameworkBase.xml` file to your `TrustFrameworkExtensions.xml` file inside the `<UserJourneys>` element, then make the modification under step 6.

```XML
<OrchestrationStep Order="6" Type="ClaimsExchange">
		  <ClaimsExchanges>
				<ClaimsExchange Id="GetLoyaltyData" TechnicalProfileReferenceId="AzureFunctions-LookUpLoyaltyWebHook" />
			</ClaimsExchanges>
		</OrchestrationStep>
```

> [!IMPORTANT]
> If the order does not match your version just make sure you insert as the step before the ClaimsExchange Type `SendClaims`

The final UserJourney XML should look like this:

```XML
<UserJourney Id="ProfileEdit">
      <OrchestrationSteps>
        <OrchestrationStep Order="1" Type="ClaimsProviderSelection" ContentDefinitionReferenceId="api.idpselections">
          <ClaimsProviderSelections>
            <ClaimsProviderSelection TargetClaimsExchangeId="FacebookExchange" />
            <ClaimsProviderSelection TargetClaimsExchangeId="LocalAccountSigninEmailExchange" />
          </ClaimsProviderSelections>
        </OrchestrationStep>
        <OrchestrationStep Order="2" Type="ClaimsExchange">
          <ClaimsExchanges>
            <ClaimsExchange Id="FacebookExchange" TechnicalProfileReferenceId="Facebook-OAUTH" />
            <ClaimsExchange Id="LocalAccountSigninEmailExchange" TechnicalProfileReferenceId="SelfAsserted-LocalAccountSignin-Email" />
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
            <ClaimsExchange Id="AADUserRead" TechnicalProfileReferenceId="AAD-UserReadUsingAlternativeSecurityId" />
          </ClaimsExchanges>
        </OrchestrationStep>
        <OrchestrationStep Order="4" Type="ClaimsExchange">
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
        <OrchestrationStep Order="5" Type="ClaimsExchange">
          <ClaimsExchanges>
            <ClaimsExchange Id="B2CUserProfileUpdateExchange" TechnicalProfileReferenceId="SelfAsserted-ProfileUpdate" />
          </ClaimsExchanges>
           </OrchestrationStep>
           <!-- Add a step 6 to the user journey before the jwt token is created-->
        <OrchestrationStep Order="6" Type="ClaimsExchange">
          <ClaimsExchanges>
                <ClaimsExchange Id="GetLoyaltyData" TechnicalProfileReferenceId="AzureFunctions-LookUpLoyaltyWebHook" />
            </ClaimsExchanges>
            </OrchestrationStep>
        <OrchestrationStep Order="7" Type="SendClaims" CpimIssuerTechnicalProfileReferenceId="JwtIssuer" />
      </OrchestrationSteps>
      <ClientDefinition ReferenceId="DefaultWeb" />
    </UserJourney>
```

## Step 5 - Add the Claim “city” to your Relying Party policy file so the claim is sent to your application

To do this, edit your `ProfileEdit.xml` RP file and modify the `<TechnicalProfile Id="PolicyProfile">` element to add the following:
`<OutputClaim ClaimTypeReferenceId="city" />`.

After adding the new claim, the TechnicalProfile looks like this:

```XML
<DisplayName>PolicyProfile</DisplayName>
    <Protocol Name="OpenIdConnect" />
    <OutputClaims>
      <OutputClaim ClaimTypeReferenceId="objectId" PartnerClaimType="sub"/>
      <OutputClaim ClaimTypeReferenceId="city" />
    </OutputClaims>
    <SubjectNamingInfo ClaimType="sub" />
</TechnicalProfile>
```

## Step 6 - Upload your changes and test

You will be overwriting existing versions of the policy.

1.	(OPTIONAL) Saved the existing version (by downloading) of your extensions file before you proceed.  We recommend that you do not upload multiple versions of the extensions file to keep initial complexity low.
2.	(OPTIONAL) you may rename the new version of the policy edit file PolicyId by changing   PolicyId="B2C_1A_TrustFrameworkProfileEdit"
3.	Upload the extensions file
4.	Upload the policy edit Relying Party file
5.	Use **Run Now** to test the policy.  Review the token returned by the IEF back to the application.

If everything is set up correctly, the token will include the new claim `city`, with the value `Redmond`.

```JSON
{
  "exp": 1493053292,
  "nbf": 1493049692,
  "ver": "1.0",
  "iss": "https://login.microsoftonline.com/f06c2fe8-709f-4030-85dc-38a4bfd9e82d/v2.0/",
  "sub": "a58e7c6c-7535-4074-93da-b0023fbaf3ac",
  "aud": "4e87c1dd-e5f5-4ac8-8368-bc6a98751b8b",
  "acr": "b2c_1a_trustframeworkprofileedit",
  "nonce": "defaultNonce",
  "iat": 1493049692,
  "auth_time": 1493049692,
  "city": "Redmond"
}
```

## Next Steps

[Use a REST API as a validation step](active-directory-b2c-rest-api-validation-custom.md)

[How to modify profile edit to gather additional information from your users](active-directory-b2c-create-custom-attributes-profile-edit-custom.md)
