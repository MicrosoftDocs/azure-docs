---
title: Collect and manipulate user inputs by using Azure AD B2C custom policy 
titleSuffix: Azure AD B2C
description: Learn how to collect user inputs from a user and manipulate them by using Azure Active Directory B2C custom policy  
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.custom: b2c-docs-improvements
ms.date: 01/30/2023
ms.author: kengaderdus
ms.reviewer: yoelh
ms.subservice: B2C
---

# Collect and manipulate user inputs by using Azure Active Directory B2C custom policy

Azure Active Directory B2C (Azure AD B2C) custom policy custom policies allows you to collect user inputs. You can then use inbuilt methods to manipulate the user inputs.  

In this article, you'll learn how to write a custom policy that collects user inputs via a graphical user interface. You'll then access the inputs, process then, and finally return them as claims in a JWT token. To complete this task, you'll: 

- Declare claims. A claim provides temporary storage of data during an Azure AD B2C policy execution. It can store information about the user, such as first name, last name, or any other claim obtained from the user or other systems. You can learn more about claims in the [Azure AD B2C custom policy overview](custom-policy-overview.md#claims). 

- Define technical profiles. A technical profile provides an interface to communicate with different types of parties. For example, it allows you to interact with the user to collect data.

- Configure claims transformations, which you use to manipulate the claims you declare.

- Configure content definitions. A content definition defines the user interface to load. Later you can [customize the user interface](customize-ui.md) by providing your own customized HTML content.

- Configure and show user interfaces to the user by using Self-Asserted Technical Profiles and DisplayClaims.

- Call Technical Profiles in a given sequence by using Orchestration Steps.    

## Prerequisites

- If you don't have one already, [create an Azure AD B2C tenant](tutorial-create-tenant.md) that is linked to your Azure subscription.

- [Register a web application](tutorial-register-applications.md), and [enable ID token implicit grant](tutorial-register-applications.md#enable-id-token-implicit-grant). For the Redirect URI, use https://jwt.ms. 
- You must have [Visual Studio Code (VS Code)](https://code.visualstudio.com/) installed in your computer. 

- Complete the steps in [Write your first Azure AD B2C custom policy - Hello World!](custom-policies-series-hello-world.md). This article is a part of [Create and run your own custom policies how-to guide series](custom-policies-series-overview.md). 

[!INCLUDE [active-directory-b2c-app-integration-call-api](../../includes/active-directory-b2c-common-note-custom-policy-how-to-series.md)]

## Step 1 - Declare claims

Declare additional claims alongside *objectId* and *message*: 

1. In VS Code, open the `ContosoCustomPolicy.XML` file. 

1. In the `ClaimsSchema` section, add the following [ClaimType](claimsschema.md) declarations: 

    ```xml
        <ClaimType Id="givenName">
            <DisplayName>Given Name</DisplayName>
            <DataType>string</DataType>
            <UserHelpText>Your given name (also known as first name).</UserHelpText>
            <UserInputType>TextBox</UserInputType>
        </ClaimType>
        
        <ClaimType Id="surname">
            <DisplayName>Surname</DisplayName>
            <DataType>string</DataType>
            <UserHelpText>Your surname (also known as family name or last name).</UserHelpText>
            <UserInputType>TextBox</UserInputType>
        </ClaimType>
        <ClaimType Id="displayName">
            <DisplayName>Display Name</DisplayName>
            <DataType>string</DataType>
            <UserHelpText>Your display name.</UserHelpText>
            <UserInputType>TextBox</UserInputType>
        </ClaimType>
    ```  

  We've declared three Claim Types, *givenName*, *surname*, and *displayName*. These declarations include `DataType`, `UserInputType` and `DisplayName` elements: 

- **DataType** specifies the data type of the value that the claims hold. Learn more about the data types that the [DataType elements supports](claimsschema.md#datatype).  
- **UserInputType** specifies the UI control that appears on the user interface if you want to collect the value of the claim from the user. Learn more about the user [input types that Azure AD B2C supports](claimsschema.md#userinputtype).   
- **DisplayName** specifies the label for the UI control that appears on the user interface if you want to collect the value of the claim from the user.


## Step 2 - Define claims transformations 

A [ClaimsTransformation](claimstransformations.md) contains a function that you use to convert a given claim into another one. For instance, you can change a string claim from lower case to upper case. Learn more about [Claims transformations supported by Azure AD B2C](claimstransformations.md#claims-transformations-reference). 

1. In the `ContosoCustomPolicy.XML` file, add a `<ClaimsTransformations>` element as a child of the `BuildingBlocks` section. 
    ```xml
        <ClaimsTransformations>
        
        </ClaimsTransformations>
    ```

1. Add the following code inside the `ClaimsTransformations` element:

    ```xml
        <ClaimsTransformation Id="GenerateRandomObjectIdTransformation" TransformationMethod="CreateRandomString">
            <InputParameters>
            <InputParameter Id="randomGeneratorType" DataType="string" Value="GUID"/>
            </InputParameters>
            <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="objectId" TransformationClaimType="outputClaim"/>
            </OutputClaims>
        </ClaimsTransformation>
    
        <ClaimsTransformation Id="CreateDisplayNameTransformation" TransformationMethod="FormatStringMultipleClaims">
            <InputClaims>
            <InputClaim ClaimTypeReferenceId="givenName" TransformationClaimType="inputClaim1"/>
            <InputClaim ClaimTypeReferenceId="surname" TransformationClaimType="inputClaim2"/>
            </InputClaims>
            <InputParameters>
            <InputParameter Id="stringFormat" DataType="string" Value="{0} {1}"/>
            </InputParameters>
            <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="displayName" TransformationClaimType="outputClaim"/>
            </OutputClaims>
        </ClaimsTransformation>
    
        <ClaimsTransformation Id="CreateMessageTransformation" TransformationMethod="FormatStringClaim">
            <InputClaims>
            <InputClaim ClaimTypeReferenceId="displayName" TransformationClaimType="inputClaim"/>
            </InputClaims>
            <InputParameters>
            <InputParameter Id="stringFormat" DataType="string" Value="Hello {0}"/>
            </InputParameters>
            <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="message" TransformationClaimType="outputClaim"/>
            </OutputClaims>
        </ClaimsTransformation> 
    ```

    We've configured three claims transformations: 
    - *GenerateRandomObjectIdTransformation* generates a random string as specified by the *CreateRandomString* method. The *objectId* claim is updated with the generated string as specified by the `OutputClaim` element. 
        
    - *CreateDisplayNameTransformation* concatenates *givenName* and *surname* to form *displayName*. 
    
    -  *CreateMessageTransformation* concatenates *Hello* and *displayName* to form *message*. 

## Step 3 - Configure content definitions

[ContentDefinitions](contentdefinitions.md) allow you to specify URL to HTML templates that control the layout of the web pages you show to your users. You can specify specific user interfaces for each step, such as sign-in or sign-up, password reset, or error pages.

To add content definition, add the following code in `BuildingBlocks` section of the `ContosoCustomPolicy.XML` file:

```xml
    <ContentDefinitions>
        <ContentDefinition Id="SelfAssertedContentDefinition">
            <LoadUri>~/tenant/templates/AzureBlue/selfAsserted.cshtml</LoadUri>
            <RecoveryUri>~/common/default_page_error.html</RecoveryUri>
            <DataUri>urn:com:microsoft:aad:b2c:elements:contract:selfasserted:2.1.7</DataUri>
        </ContentDefinition>
    </ContentDefinitions>
```   

## Step 4 - Configure technical profiles  

In a custom policy, a [TechnicalProfile](technicalprofiles.md) is the element that implements functionality. Now that you've defined Claims and Claims Transformations, you need Technical Profiles to execute your definitions. A technical profile is declared inside the `ClaimsProvider` elements.

Azure AD B2C provides a set of technical profiles. Each technical profile performs a specific role. For instance, you use a [REST technical profile](restful-technical-profile.md) to make an HTTP call to a service endpoint. You can use a claims transformation technical profile to execute the operation you define in a Claims Transformation. Learn more about the [types of technical profiles](technicalprofiles.md) that Azure AD B2C custom policies provide.

### Set values for your claims 
 
To set values for *objectId*, *displayName* and *message* claims, you configure a technical profile that executes the *GenerateRandomObjectIdTransformation*, *CreateDisplayNameTransformation*, and *CreateMessageTransformation* claims transformations. The claims transformations are executed by the order defined in the `OutputClaimsTransformations` element. For example, it first creates the display name, then the message. 

1. Add the following `ClaimsProvider` as a child of the `ClaimsProviders` section. 
    
    ```xml
        <ClaimsProvider>
        
            <DisplayName>Technical Profiles to generate claims</DisplayName>
        </ClaimsProvider>
    
    ``` 
1. To set values for *objectId*, *displayName* and *message* claims, add the following code inside the `ClaimsProvider` element you just created:
   
    ```xml
        <!--<ClaimsProvider>-->
            <TechnicalProfiles>
                <TechnicalProfile Id="ClaimGenerator">
                    <DisplayName>Generate Object ID, displayName and message Claims Technical Profile.</DisplayName>
                    <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.ClaimsTransformationProtocolProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null"/>
                    <OutputClaims>
                        <OutputClaim ClaimTypeReferenceId="objectId"/>
                        <OutputClaim ClaimTypeReferenceId="displayName"/>
                        <OutputClaim ClaimTypeReferenceId="message"/>
                    </OutputClaims>
                    <OutputClaimsTransformations>
                        <OutputClaimsTransformation ReferenceId="GenerateRandomObjectIdTransformation"/>
                        <OutputClaimsTransformation ReferenceId="CreateDisplayNameTransformation"/>
                        <OutputClaimsTransformation ReferenceId="CreateMessageTransformation"/>
                    </OutputClaimsTransformations>
                </TechnicalProfile>
            </TechnicalProfiles>
        <!--</ClaimsProvider>-->
    ``` 

### Collect user inputs 

You generate the *displayName* claim from *givenName* and *surname*, so you need to collect then as user inputs. To collect a user input, you use a type of technical profile called [Self-Asserted](self-asserted-technical-profile.md). When you configure a self-asserted technical profile, you need to reference the content definitions as self-asserted technical profile is responsible for displaying a user interface.

1. Add the following `ClaimsProvider` as a child of the `ClaimsProviders` section. 
    
    ```xml
        <ClaimsProvider>
        
            <DisplayName>Technical Profiles to collect user's details </DisplayName>
        </ClaimsProvider>
    ```

1. Add the following code inside the `ClaimsProvider` element you just created: 

    ```xml
        <TechnicalProfiles>
            <TechnicalProfile Id="UserInformationCollector">
                <DisplayName>Collect User Input Technical Profile</DisplayName>
                <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.SelfAssertedAttributeProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null"/>
                <Metadata>
                    <Item Key="ContentDefinitionReferenceId">SelfAssertedContentDefinition</Item>
                </Metadata>
                <DisplayClaims>
                    <DisplayClaim ClaimTypeReferenceId="givenName" Required="true"/>
                    <DisplayClaim ClaimTypeReferenceId="surname" Required="true"/>
                </DisplayClaims>
                <OutputClaims>
                    <OutputClaim ClaimTypeReferenceId="givenName"/>
                    <OutputClaim ClaimTypeReferenceId="surname"/>
                </OutputClaims>
            </TechnicalProfile>
        </TechnicalProfiles>
    ```

    Notice the two display claims for the *givenName* and *surname* claims. Both of the claims are marked as required, so the user must enter the values before they submit the form displayed to them. The claims are displayed on the screen in the order defined in the *DisplayClaims* element such as, the **Given Name** and then the **Surname**. 

## Step 5 - Define user journeys

You use user journeys to define order in which the technical profiles are called. You use the `OrchestrationSteps` element to specify the steps in a user journey. 

Replace the existing contents of the `HelloWorldJourney` User Journey with the following code: 

```xml
    <OrchestrationSteps>
        <OrchestrationStep Order="1" Type="ClaimsExchange">
            <ClaimsExchanges>
                <ClaimsExchange Id="GetUserInformationClaimsExchange" TechnicalProfileReferenceId="UserInformationCollector"/>
            </ClaimsExchanges>
        </OrchestrationStep>
        <OrchestrationStep Order="2" Type="ClaimsExchange">
            <ClaimsExchanges>
                <ClaimsExchange Id="GetMessageClaimsExchange" TechnicalProfileReferenceId="ClaimGenerator"/>
            </ClaimsExchanges>
        </OrchestrationStep>
        <OrchestrationStep Order="3" Type="SendClaims" CpimIssuerTechnicalProfileReferenceId="JwtIssuer"/>
    </OrchestrationSteps>
```

According to the orchestration steps, we collect user inputs, set values for *objectId*, *displayName* and *message* claims, and finally send the Jwt token. 

## Step 6 - Update relying party 

Replace the contents of the `OutputClaims` element of the `RelyingParty` section with the following code: 

```xml
    <OutputClaim ClaimTypeReferenceId="objectId" PartnerClaimType="sub"/>
    <OutputClaim ClaimTypeReferenceId="displayName"/>
    <OutputClaim ClaimTypeReferenceId="message"/>
```

After you complete [step 6](#step-6---update-relying-party), the `ContosoCustomPolicy.XML` file should look similar to the following code:

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<TrustFrameworkPolicy xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
    xmlns="http://schemas.microsoft.com/online/cpim/schemas/2013/06" 
    PolicySchemaVersion="0.3.0.0" TenantId="yourtenant.onmicrosoft.com" 
    PolicyId="B2C_1A_ContosoCustomPolicy" 
    PublicPolicyUri="http://yourtenant.onmicrosoft.com/B2C_1A_ContosoCustomPolicy">
    
    <BuildingBlocks>
        <ClaimsSchema>
            <ClaimType Id="objectId">
                <DisplayName>unique object Id for subject of the claims being returned</DisplayName>
                <DataType>string</DataType>
            </ClaimType>
            <ClaimType Id="message">
                <DisplayName>Will hold Hello World message</DisplayName>
                <DataType>string</DataType>
            </ClaimType>

            <ClaimType Id="givenName">
                <DisplayName>Given Name</DisplayName>
                <DataType>string</DataType>
                <UserHelpText>Your given name (also known as first name).</UserHelpText>
                <UserInputType>TextBox</UserInputType>
            </ClaimType>
            <ClaimType Id="surname">
                <DisplayName>Surname</DisplayName>
                <DataType>string</DataType>
                <UserHelpText>Your surname (also known as family name or last name).</UserHelpText>
                <UserInputType>TextBox</UserInputType>
            </ClaimType>
            <ClaimType Id="displayName">
                <DisplayName>Display Name</DisplayName>
                <DataType>string</DataType>
                <UserHelpText>Your display name.</UserHelpText>
                <UserInputType>TextBox</UserInputType>
            </ClaimType>
        </ClaimsSchema>
        <ClaimsTransformations>
            <ClaimsTransformation Id="GenerateRandomObjectIdTransformation" TransformationMethod="CreateRandomString">
                <InputParameters>
                    <InputParameter Id="randomGeneratorType" DataType="string" Value="GUID"/>
                </InputParameters>
                <OutputClaims>
                    <OutputClaim ClaimTypeReferenceId="objectId" TransformationClaimType="outputClaim"/>
                </OutputClaims>
            </ClaimsTransformation>

            <ClaimsTransformation Id="CreateDisplayNameTransformation" TransformationMethod="FormatStringMultipleClaims">
                <InputClaims>
                    <InputClaim ClaimTypeReferenceId="givenName" TransformationClaimType="inputClaim1"/>
                    <InputClaim ClaimTypeReferenceId="surname" TransformationClaimType="inputClaim2"/>
                </InputClaims>
                <InputParameters>
                    <InputParameter Id="stringFormat" DataType="string" Value="{0} {1}"/>
                </InputParameters>
                <OutputClaims>
                    <OutputClaim ClaimTypeReferenceId="displayName" TransformationClaimType="outputClaim"/>
                </OutputClaims>
            </ClaimsTransformation>

            <ClaimsTransformation Id="CreateMessageTransformation" TransformationMethod="FormatStringClaim">
                <InputClaims>
                    <InputClaim ClaimTypeReferenceId="displayName" TransformationClaimType="inputClaim"/>
                </InputClaims>
                <InputParameters>
                    <InputParameter Id="stringFormat" DataType="string" Value="Hello {0}"/>
                </InputParameters>
                <OutputClaims>
                    <OutputClaim ClaimTypeReferenceId="message" TransformationClaimType="outputClaim"/>
                </OutputClaims>
            </ClaimsTransformation> 
        </ClaimsTransformations>
        <ContentDefinitions>
            <ContentDefinition Id="SelfAssertedContentDefinition">
                <LoadUri>~/tenant/templates/AzureBlue/selfAsserted.cshtml</LoadUri>
                <RecoveryUri>~/common/default_page_error.html</RecoveryUri>
                <DataUri>urn:com:microsoft:aad:b2c:elements:contract:selfasserted:2.1.7</DataUri>
            </ContentDefinition>
        </ContentDefinitions>
    </BuildingBlocks>
    <!--Claims Providers Here-->
    <ClaimsProviders>
        <ClaimsProvider>
            <DisplayName>Token Issuer</DisplayName>
            <TechnicalProfiles>
                <TechnicalProfile Id="JwtIssuer">
                    <DisplayName>JWT Issuer</DisplayName>
                    <Protocol Name="None"/>
                    <OutputTokenFormat>JWT</OutputTokenFormat>
                    <Metadata>
                        <Item Key="client_id">{service:te}</Item>
                        <Item Key="issuer_refresh_token_user_identity_claim_type">objectId</Item>
                        <Item Key="SendTokenResponseBodyWithJsonNumbers">true</Item>
                    </Metadata>
                    <CryptographicKeys>
                        <Key Id="issuer_secret" StorageReferenceId="B2C_1A_TokenSigningKeyContainer"/>
                        <Key Id="issuer_refresh_token_key" StorageReferenceId="B2C_1A_TokenEncryptionKeyContainer"/>
                    </CryptographicKeys>
                </TechnicalProfile>
            </TechnicalProfiles>
        </ClaimsProvider>

        <ClaimsProvider>
            <DisplayName>Trustframework Policy Engine TechnicalProfiles</DisplayName>
            <TechnicalProfiles>
                <TechnicalProfile Id="TpEngine_c3bd4fe2-1775-4013-b91d-35f16d377d13">
                    <DisplayName>Trustframework Policy Engine Default Technical Profile</DisplayName>
                    <Protocol Name="None"/>
                    <Metadata>
                        <Item Key="url">{service:te}</Item>
                    </Metadata>
                </TechnicalProfile>
            </TechnicalProfiles>
        </ClaimsProvider>

        <ClaimsProvider>
            <DisplayName>Claim Generator Technical Profiles</DisplayName>
            <TechnicalProfiles>
                <TechnicalProfile Id="ClaimGenerator">
                    <DisplayName>Generate Object ID, displayName and  message Claims Technical Profile.</DisplayName>
                    <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.ClaimsTransformationProtocolProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null"/>
                    <OutputClaims>
                        <OutputClaim ClaimTypeReferenceId="objectId"/>
                        <OutputClaim ClaimTypeReferenceId="displayName"/>
                        <OutputClaim ClaimTypeReferenceId="message"/>
                    </OutputClaims>
                    <OutputClaimsTransformations>
                        <OutputClaimsTransformation ReferenceId="GenerateRandomObjectIdTransformation"/>
                        <OutputClaimsTransformation ReferenceId="CreateDisplayNameTransformation"/>
                        <OutputClaimsTransformation ReferenceId="CreateMessageTransformation"/>
                    </OutputClaimsTransformations>
                </TechnicalProfile>
            </TechnicalProfiles>            
        </ClaimsProvider>

        <ClaimsProvider>
            <DisplayName>Technical Profiles to collect user's details</DisplayName>
            <TechnicalProfiles>
                <TechnicalProfile Id="UserInformationCollector">
                    <DisplayName>Collect User Input Technical Profile</DisplayName>
                    <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.SelfAssertedAttributeProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null"/>
                    <Metadata>
                        <Item Key="ContentDefinitionReferenceId">SelfAssertedContentDefinition</Item>
                    </Metadata>
                    <DisplayClaims>
                        <DisplayClaim ClaimTypeReferenceId="givenName" Required="true"/>
                        <DisplayClaim ClaimTypeReferenceId="surname" Required="true"/>
                    </DisplayClaims>
                    <OutputClaims>
                        <OutputClaim ClaimTypeReferenceId="givenName"/>
                        <OutputClaim ClaimTypeReferenceId="surname"/>
                    </OutputClaims>
                </TechnicalProfile>
            </TechnicalProfiles>
        </ClaimsProvider>
    </ClaimsProviders>

    <UserJourneys>
        <UserJourney Id="HelloWorldJourney">
            <OrchestrationSteps>
                <OrchestrationStep Order="1" Type="ClaimsExchange">
                    <ClaimsExchanges>
                        <ClaimsExchange Id="GetUserInformationClaimsExchange" TechnicalProfileReferenceId="UserInformationCollector"/>
                    </ClaimsExchanges>
                </OrchestrationStep>
                <OrchestrationStep Order="2" Type="ClaimsExchange">
                    <ClaimsExchanges>
                        <ClaimsExchange Id="GetMessageClaimsExchange" TechnicalProfileReferenceId="ClaimGenerator"/>
                    </ClaimsExchanges>
                </OrchestrationStep>
                <OrchestrationStep Order="3" Type="SendClaims" CpimIssuerTechnicalProfileReferenceId="JwtIssuer"/>
            </OrchestrationSteps>
        </UserJourney>
    </UserJourneys>

    <RelyingParty><!-- 
            Relying Party Here that's your policy’s entry point
            Specify the User Journey to execute 
            Specify the claims to include in the token that is returned when the policy runs
        -->
        <DefaultUserJourney ReferenceId="HelloWorldJourney"/>
        <TechnicalProfile Id="HelloWorldPolicyProfile">
            <DisplayName>Hello World Policy Profile</DisplayName>
            <Protocol Name="OpenIdConnect"/>
            <OutputClaims>
                <OutputClaim ClaimTypeReferenceId="objectId" PartnerClaimType="sub"/>
                <OutputClaim ClaimTypeReferenceId="displayName"/>
                <OutputClaim ClaimTypeReferenceId="message"/>
            </OutputClaims>
            <SubjectNamingInfo ClaimType="sub"/>
        </TechnicalProfile>
    </RelyingParty>
</TrustFrameworkPolicy>
```
If you haven't already done so, replace `yourtenant` with the subdomain part of your tenant name, such as `contoso`. Learn how to [Get your tenant name](tenant-management-read-tenant-name.md#get-your-tenant-name).

## Step 3 - Upload custom policy file

Follow the steps in [Upload custom policy file](custom-policies-series-hello-world.md#step-3---upload-custom-policy-file). If you're uploading a file with same name as the one already in the portal, make sure you select **Overwrite the custom policy if it already exists**.


## Step 4 - Test the custom policy

1. Under **Custom policies**, select **B2C_1A_CONTOSOCUSTOMPOLICY**.
1. For **Select application** on the overview page of the custom policy, select the web application such as *webapp1* that you previously registered. Make sure that the **Select reply URL** value is set to`https://jwt.ms`.
1. Select **Run now** button.
1. Enter **Given Name** and **Surname**, and then select **Continue**. 

    :::image type="content" source="media/custom-policies-series-collect-user-input/screenshot-of-accepting-user-inputs-in-custom-policy.png" alt-text="screenshot of accepting user inputs in custom policy.":::

After the policy finishes execution, you're redirected to `https://jwt.ms`, and you see a decoded JWT token. It looks similar to the following JWT token snippet: 

```json
    {
      "typ": "JWT",
      "alg": "RS256",
      "kid": "pxLOMWFg...."
    }.{
      ...
      "sub": "c7ae4515-f7a7....",
      ...
      "acr": "b2c_1a_contosocustompolicy",
      ...
      "name": "Maurice Paulet",
      "message": "Hello Maurice Paulet"
    }.[Signature]
``` 

## Next steps 

Next, learn:

- About [types of Technical Profiles](technicalprofiles.md#types-of-technical-profiles) in Azure AD B2C's custom policies. 

- How to [Validate user inputs by using custom policy](custom-policies-series-validate-user-input.md).