---
title: REST API claims exchanges as an orchestration step in Azure Active Directory B2C | Microsoft Docs
description: A topic on Azure Active Directory B2C custom policies that integrate with an API.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 04/24/2017
ms.author: davidmu
ms.component: B2C
---

# Walkthrough: Integrate REST API claims exchanges in your Azure AD B2C user journey as an orchestration step

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

The Identity Experience Framework (IEF) that underlies Azure Active Directory B2C (Azure AD B2C) enables the identity developer to integrate an interaction with a RESTful API in a user journey.  

At the end of this walkthrough, you will be able to create an Azure AD B2C user journey that interacts with RESTful services.

The IEF sends data in claims and receives data back in claims. The REST API claims exchange:

- Can be designed as an orchestration step.
- Can trigger an external action. For instance, it can log an event in an external database.
- Can be used to fetch a value and then store it in the user database.

You can use the received claims later to change the flow of execution.

You can also design the interaction as a validation profile. For more information, see [Walkthrough: Integrate REST API claims exchanges in your Azure AD B2C user journey as validation on user input](active-directory-b2c-rest-api-validation-custom.md).

The scenario is that when a user performs a profile edit, we want to:

1. Look up the user in an external system.
2. Get the city where that user is registered.
3. Return that attribute to the application as a claim.

## Prerequisites

- An Azure AD B2C tenant configured to complete a local account sign-up/sign-in, as described in [Getting started](active-directory-b2c-get-started-custom.md).
- A REST API endpoint to interact with. This walkthrough uses a simple Azure function app webhook as an example.
- *Recommended*: Complete the [REST API claims exchange walkthrough as a validation step](active-directory-b2c-rest-api-validation-custom.md).

## Step 1: Prepare the REST API function

> [!NOTE]
> Setup of REST API functions is outside the scope of this article. [Azure Functions](https://docs.microsoft.com/azure/azure-functions/functions-reference) provides an excellent toolkit to create RESTful services in the cloud.

We have set up an Azure function that receives a claim called `email`, and then returns the claim `city` with the assigned value of `Redmond`. The sample Azure function is on [GitHub](https://github.com/Azure-Samples/active-directory-b2c-advanced-policies/tree/master/AzureFunctionsSamples).

The `userMessage` claim that the Azure function returns is optional in this context, and the IEF will ignore it. You can potentially use it as a message passed to the application and presented to the user later.

```csharp
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

An Azure function app makes it easy to get the function URL, which includes the identifier of the specific function. In this case, the URL is: https://wingtipb2cfuncs.azurewebsites.net/api/LookUpLoyaltyWebHook?code=MQuG7BIE3eXBaCZ/YCfY1SHabm55HEphpNLmh1OP3hdfHkvI2QwPrw==. You can use it for testing.

## Step 2: Configure the RESTful API claims exchange as a technical profile in your TrustFrameworExtensions.xml file

A technical profile is the full configuration of the exchange desired with the RESTful service. Open the TrustFrameworkExtensions.xml file and add the following XML snippet inside the `<ClaimsProvider>` element.

> [!NOTE]
> In the following XML, RESTful provider `Version=1.0.0.0` is described as the protocol. Consider it as the function that will interact with the external service. <!-- TODO: A full definition of the schema can be found...link to RESTful Provider schema definition>-->

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

The `<InputClaims>` element defines the claims that will be sent from the IEF to the REST service. In this example, the contents of the claim `givenName` will be sent to the REST service as the claim `email`.  

The `<OutputClaims>` element defines the claims that the IEF will expect from the REST service. Regardless of the number of claims that are received, the IEF will use only those identified here. In this example, a claim received as `city` will be mapped to an IEF claim called `city`.

## Step 3: Add the new claim `city` to the schema of your TrustFrameworkExtensions.xml file

The claim `city` is not yet defined anywhere in our schema. So, add a definition inside the element `<BuildingBlocks>`. You can find this element at the beginning of the TrustFrameworkExtensions.xml file.

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

## Step 4: Include the REST service claims exchange as an orchestration step in your profile edit user journey in TrustFrameworkExtensions.xml

Add a step to the profile edit user journey, after the user has been authenticated (orchestration steps 1-4 in the following XML) and the user has provided the updated profile information (step 5).

> [!NOTE]
> There are many use cases where the REST API call can be used as an orchestration step. As an orchestration step, it can be used as an update to an external system after a user has successfully completed a task like first-time registration, or as a profile update to keep information synchronized. In this case, it's used to augment the information provided to the application after the profile edit.

Copy the profile edit user journey XML code from the TrustFrameworkBase.xml file to your TrustFrameworkExtensions.xml file inside the `<UserJourneys>` element. Then make the modification under step 6.

```XML
<OrchestrationStep Order="6" Type="ClaimsExchange">
    <ClaimsExchanges>
        <ClaimsExchange Id="GetLoyaltyData" TechnicalProfileReferenceId="AzureFunctions-LookUpLoyaltyWebHook" />
    </ClaimsExchanges>
</OrchestrationStep>
```

> [!IMPORTANT]
> If the order does not match your version, make sure that you insert the code as the step before the `ClaimsExchange` type `SendClaims`.

The final XML for the user journey should look like this:

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
        <!-- Add a step 6 to the user journey before the JWT token is created-->
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

## Step 5: Add the claim `city` to your relying party policy file so the claim is sent to your application

Edit your ProfileEdit.xml relying party (RP) file and modify the `<TechnicalProfile Id="PolicyProfile">` element to add the following:
`<OutputClaim ClaimTypeReferenceId="city" />`.

After you add the new claim, the technical profile looks like this:

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

## Step 6: Upload your changes and test

Overwrite the existing versions of the policy.

1.	(Optional:) Save the existing version (by downloading) of your extensions file before you proceed. To keep the initial complexity low, we recommend that you do not upload multiple versions of the extensions file.
2.	(Optional:) Rename the new version of the policy ID for the policy edit file by changing   `PolicyId="B2C_1A_TrustFrameworkProfileEdit"`.
3.	Upload the extensions file.
4.	Upload the policy edit RP file.
5.	Use **Run Now** to test the policy. Review the token that the IEF returns to the application.

If everything is set up correctly, the token will include the new claim `city`, with the value `Redmond`.

```JSON
{
  "exp": 1493053292,
  "nbf": 1493049692,
  "ver": "1.0",
  "iss": "https://contoso.b2clogin.com/f06c2fe8-709f-4030-85dc-38a4bfd9e82d/v2.0/",
  "sub": "a58e7c6c-7535-4074-93da-b0023fbaf3ac",
  "aud": "4e87c1dd-e5f5-4ac8-8368-bc6a98751b8b",
  "acr": "b2c_1a_trustframeworkprofileedit",
  "nonce": "defaultNonce",
  "iat": 1493049692,
  "auth_time": 1493049692,
  "city": "Redmond"
}
```

## Next steps

[Use a REST API as a validation step](active-directory-b2c-rest-api-validation-custom.md)

[Modify the profile edit to gather additional information from your users](active-directory-b2c-create-custom-attributes-profile-edit-custom.md)
