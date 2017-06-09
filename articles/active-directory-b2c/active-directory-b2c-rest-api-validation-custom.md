---
title: 'Azure Active Directory B2C: REST API Claims Exchange Validation | Microsoft Docs'
description: A topic on Azure Active Directory B2C Custom Policies
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

# Walkthrough: Integrate REST API claims exchanges in your Azure AD B2C user journeys as validation on user input

The **Identity Experience Framework** (IEF) underlying Azure AD B2C enables the identity developer to integrate an interaction with a RESTful API in a user journey.  

At the end of this walkthrough you will be able to create Azure AD B2C user journeys which interact with RESTful services.

The IEF sends data in claims and receives data back in claims. The interaction with the API can be designed as a REST API claims exchange, or as a validation profile, which happens inside an orchestrations step.

- This typically validates input from the user
- If the value from the user is rejected, then the user can try again to enter a valid value with the opportunity to return an error message to the user.

The interaction can also be designed as an orchestration step. For more information, please see [Walkthrough: Integrate REST API claims exchanges in your Azure AD B2C user journeys as an orchestration step](active-directory-b2c-rest-api-step-custom.md).

For the validation profile example, we will use the Profile Edit user journey in the starter pack file ProfileEdit.xml.

We can verify that the given name provided by the user in the profile edit is not part of an excluded list.

## Prerequisites

- An Azure AD B2C tenant configure to complete a local account signup/signin as described in [Getting Started](active-directory-b2c-get-started-custom.md).
- A REST API endpoint to interact with. A demo site [WingTipGames](https://wingtipgamesb2c.azurewebsites.net/) has been set up with a REST API service that will be used for this walkthrough.

## Step 1 - Prepare the REST API function

> [!NOTE]
> Set up of REST API functions is outside the scope of this article. [Azure Function Apps](https://docs.microsoft.com/azure/azure-functions/functions-reference) provides an excellent toolkit to create RESTful services in the cloud.

We have created an Azure Function that receives a claim which it expects as “playerTag” and validates whether or not this claim exists. You can access the complete Azure function code in [GitHub](https://github.com/Azure-Samples/active-directory-b2c-advanced-policies/tree/master/AzureFunctionsSamples).

```csharp
if (requestContentAsJObject.playerTag == null)
{
  return request.CreateResponse(HttpStatusCode.BadRequest);
}

var playerTag = ((string) requestContentAsJObject.playerTag).ToLower();

if (playerTag == "mcvinny" || playerTag == "msgates123" || playerTag == "revcottonmarcus")
{
  return request.CreateResponse<ResponseContent>(
    HttpStatusCode.Conflict,
    new ResponseContent
    {
      version = "1.0.0",
      status = (int) HttpStatusCode.Conflict,
      userMessage = $"The player tag '{requestContentAsJObject.playerTag}' is already used."
    },
    new JsonMediaTypeFormatter(),
    "application/json");
}

return request.CreateResponse(HttpStatusCode.OK);
```

The `userMessage` claim returned by the Azure Function is expected by the Identity Experience Framework and will be presented as a string to the user if the validation fails, such as when a 409 conflict status is returned in the above example.

## Step 2 - Configure the RESTful API claims exchange as a technical profile in your TrustFrameworkExtensions.xml file

A technical profile is the full configuration of the exchange desired with the RESTful service. Open the `TrustFrameworkExtensions.xml` file and add the XML snippet below inside the `<ClaimsProviders>` element.

> [!NOTE]
> Consider the “Restful Provider, Version 1.0.0.0”  described below as the protocol as the function that will interact with the external service.  A full definition of the schema can be found <!-- TODO: Link to RESTful Provider schema definition>-->

```xml
<ClaimsProvider>
    <DisplayName>REST APIs</DisplayName>
    <TechnicalProfiles>
        <TechnicalProfile Id="AzureFunctions-CheckPlayerTagWebHook">
            <DisplayName>Check Player Tag Web Hook Azure Function</DisplayName>
            <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.RestfulProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
            <Metadata>
                <Item Key="ServiceUrl">https://wingtipb2cfuncs.azurewebsites.net/api/CheckPlayerTagWebHook?code=L/05YRSpojU0nECzM4Tp3LjBiA2ZGh3kTwwp1OVV7m0SelnvlRVLCg==</Item>
                <Item Key="AuthenticationType">None</Item>
                <Item Key="SendClaimsIn">Body</Item>
            </Metadata>
            <InputClaims>
                <InputClaim ClaimTypeReferenceId="givenName" PartnerClaimType="playerTag" />
            </InputClaims>
            <UseTechnicalProfileForSessionManagement ReferenceId="SM-Noop" />
        </TechnicalProfile>
        <TechnicalProfile Id="SelfAsserted-ProfileUpdate">
            <ValidationTechnicalProfiles>
                <ValidationTechnicalProfile ReferenceId="AzureFunctions-CheckPlayerTagWebHook" />
            </ValidationTechnicalProfiles>
        </TechnicalProfile>
    </TechnicalProfiles>
</ClaimsProvider>
```

The `InputClaims` element defines the claims that will be sent from the IEF to the REST service. In the above example, the contents of the claims `givenName` will be sent to the REST service as `playerTag`. In this example, the IEF does not expect claims back, and instead waits for a response from the REST service and acts based on the status codes received.

## Step 3 - Include the RESTful service claims exchange in self-asserted technical profile where you wish to validate the user input

The most common use of the validation step is in the interaction with a user.  All interactions where the user is expected to provide input, are **Self-Asserted Technical Profiles**. For this example we will add this validation to  the **Self-Asserted-ProfileUpdate** technical profile (TP).  This is the TP used by the RP policy file `Profile Edit`.

To add the claims exchange to the Self-Asserted Technical Profile:

1. Open the TrustFrameworkBase file and search for `<TechnicalProfile Id="SelfAsserted-ProfileUpdate">`.
2. Review the configuration of this TP and observe how the exchange with the user is defined as claims that will be asked of the user (input claims) and claims that will be expected back from the self asserted provider (output claims)
3. Search for `TechnicalProfileReferenceId="SelfAsserted-ProfileUpdate`, notice that this profile is invoked as Orchestration Step #6 of the `<UserJourney Id="ProfileEdit">`

## Step 4 - Upload and test the Profile Edit RP policy file

1. Upload the new version of the `TrustframeworkExtensions` file.
2. Use **Run now** to test the profile edit RP policy file.
3. Test the validation by providing one of the existing names (for example: mcvinny) in the **Given Name** field. If everything is set up correctly, you should receive a message notifying the user that the `player tag` is already used.

## Next Steps

[How to modify profile edit and user registration to gather additional information from your users](active-directory-b2c-create-custom-attributes-profile-edit-custom.md)

[Walkthrough: Integrate REST API claims exchanges in your Azure AD B2C user journeys as an orchestration step](active-directory-b2c-rest-api-step-custom.md)
