---
title: REST API claims exchanges as validation in Azure Active Directory B2C | Microsoft Docs
description: A topic on Azure Active Directory B2C custom policies.
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

# Walkthrough: Integrate REST API claims exchanges in your Azure AD B2C user journey as validation on user input

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

The Identity Experience Framework (IEF) that underlies Azure Active Directory B2C (Azure AD B2C) enables the identity developer to integrate an interaction with a RESTful API in a user journey.  

At the end of this walkthrough, you will be able to create an Azure AD B2C user journey that interacts with RESTful services.

The IEF sends data in claims and receives data back in claims. The interaction with the API:

- Can be designed as a REST API claims exchange or as a validation profile, which happens inside an orchestration step.
- Typically validates input from the user. If the value from the user is rejected, the user can try again to enter a valid value with the opportunity to return an error message.

You can also design the interaction as an orchestration step. For more information, see [Walkthrough: Integrate REST API claims exchanges in your Azure AD B2C user journey as an orchestration step](active-directory-b2c-rest-api-step-custom.md).

For the validation profile example, we will use the profile edit user journey in the starter pack file ProfileEdit.xml.

We can verify that the name provided by the user in the profile edit is not part of an exclusion list.

## Prerequisites

- An Azure AD B2C tenant configured to complete a local account sign-up/sign-in, as described in [Getting started](active-directory-b2c-get-started-custom.md).
- A REST API endpoint to interact with. For this walkthrough, we've set up a demo site called [WingTipGames](https://wingtipgamesb2c.azurewebsites.net/) with a REST API service.

## Step 1: Prepare the REST API function

> [!NOTE]
> Setup of REST API functions is outside the scope of this article. [Azure Functions](https://docs.microsoft.com/azure/azure-functions/functions-reference) provides an excellent toolkit to create RESTful services in the cloud.

We have created an Azure function that receives a claim that it expects as `playerTag`. The function validates whether this claim exists. You can access the complete Azure function code in [GitHub](https://github.com/Azure-Samples/active-directory-b2c-advanced-policies/tree/master/AzureFunctionsSamples).

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

The IEF expects the `userMessage` claim that the Azure function returns. This claim will be presented as a string to the user if the validation fails, such as when a 409 conflict status is returned in the preceding example.

## Step 2: Configure the RESTful API claims exchange as a technical profile in your TrustFrameworkExtensions.xml file

A technical profile is the full configuration of the exchange desired with the RESTful service. Open the TrustFrameworkExtensions.xml file and add the following XML snippet inside the `<ClaimsProviders>` element.

> [!NOTE]
> In the following XML, RESTful provider `Version=1.0.0.0` is described as the protocol. Consider it as the function that will interact with the external service. <!-- TODO: A full definition of the schema can be found...link to RESTful Provider schema definition>-->

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

The `InputClaims` element defines the claims that will be sent from the IEF to the REST service. In this example, the contents of the claim `givenName` will be sent to the REST service as `playerTag`. In this example, the IEF does not expect claims back. Instead, it waits for a response from the REST service and acts based on the status codes that it receives.

## Step 3: Include the RESTful service claims exchange in self-asserted technical profile where you want to validate the user input

The most common use of the validation step is in the interaction with a user. All interactions where the user is expected to provide input are *self-asserted technical profiles*. For this example, we will add the validation to the Self-Asserted-ProfileUpdate technical profile. This is the technical profile that the relying party (RP) policy file `Profile Edit` uses.

To add the claims exchange to the self-asserted technical profile:

1. Open the TrustFrameworkBase.xml file and search for `<TechnicalProfile Id="SelfAsserted-ProfileUpdate">`.
2. Review the configuration of this technical profile. Observe how the exchange with the user is defined as claims that will be asked of the user (input claims) and claims that will be expected back from the self-asserted provider (output claims).
3. Search for `TechnicalProfileReferenceId="SelfAsserted-ProfileUpdate`, and notice that this profile is invoked as orchestration step 5 of `<UserJourney Id="ProfileEdit">`.

## Step 4: Upload and test the profile edit RP policy file

1. Upload the new version of the TrustFrameworkExtensions.xml file.
2. Use **Run now** to test the profile edit RP policy file.
3. Test the validation by providing one of the existing names (for example, mcvinny) in the **Given Name** field. If everything is set up correctly, you should receive a message that notifies the user that the player tag is already used.

## Next steps

[Modify the profile edit and user registration to gather additional information from your users](active-directory-b2c-create-custom-attributes-profile-edit-custom.md)

[Walkthrough: Integrate REST API claims exchanges in your Azure AD B2C user journey as an orchestration step](active-directory-b2c-rest-api-step-custom.md)
