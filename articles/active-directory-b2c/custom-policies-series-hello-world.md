---
title: Write your first Azure AD B2C custom policy - Hello World! 
titleSuffix: Azure AD B2C
description: Learn how to write your first custom policy. A custom that shows of returns Hello World message. 
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.custom: b2c-docs-improvements
ms.date: 11/06/2023
ms.author: kengaderdus
ms.reviewer: yoelh
ms.subservice: B2C
---

# Write your first Azure Active Directory B2C custom policy - Hello World! 

In your application, you can use user flows that enable users to sign up, sign in, or manage their profile. When user flows don't cover all your business specific needs, you can use [custom policies](custom-policy-overview.md). 

While you can use pre-made custom policy [starter pack](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack) to write custom policies, it's important for you understand how a custom policy is built. In this article, you learn how to create your first custom policy from scratch. 

## Prerequisites 

- If you don't have one already, [create an Azure AD B2C tenant](tutorial-create-tenant.md) that is linked to your Azure subscription.

- [Register a web application](tutorial-register-applications.md), and [enable ID token implicit grant](tutorial-register-applications.md#enable-id-token-implicit-grant). For the Redirect URI, use https://jwt.ms. 

- You must have [Visual Studio Code (VS Code)](https://code.visualstudio.com/) installed in your computer. 

[!INCLUDE [active-directory-b2c-app-integration-call-api](../../includes/active-directory-b2c-common-note-custom-policy-how-to-series.md)]

## Step 1 - Configure the signing and encryption keys

If you haven't already done so, create the following encryption keys. To automate the walk-through below, visit the [IEF Setup App](https://b2ciefsetupapp.azurewebsites.net/) and follow the instructions: 

  1. Use the steps in [Add signing and encryption keys for Identity Experience Framework applications](tutorial-create-user-flows.md?pivots=b2c-custom-policy#add-signing-and-encryption-keys-for-identity-experience-framework-applications) to create the signing key. 

  1. Use the steps in [Add signing and encryption keys for Identity Experience Framework applications](tutorial-create-user-flows.md?pivots=b2c-custom-policy#add-signing-and-encryption-keys-for-identity-experience-framework-applications) to create the encryption key.

## Step 2 - Build the custom policy file

1. In VS Code, create and open the file `ContosoCustomPolicy.XML`.

1. In the `ContosoCustomPolicy.XML` file, add the following code:
    
    ```xml
        <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <TrustFrameworkPolicy
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns:xsd="http://www.w3.org/2001/XMLSchema"
          xmlns="http://schemas.microsoft.com/online/cpim/schemas/2013/06"
          PolicySchemaVersion="0.3.0.0"
          TenantId="yourtenant.onmicrosoft.com"
          PolicyId="B2C_1A_ContosoCustomPolicy"
          PublicPolicyUri="http://yourtenant.onmicrosoft.com/B2C_1A_ContosoCustomPolicy">
        
            <BuildingBlocks>
                <!-- Building Blocks Here-->
            </BuildingBlocks>
    
            <ClaimsProviders>
                <!-- Claims Providers Here-->
            </ClaimsProviders>
            
            <UserJourneys>
                <!-- User Journeys Here-->
            </UserJourneys>
            
            <RelyingParty>
                <!-- 
                    Relying Party Here that's your policy’s entry point
                    Specify the User Journey to execute 
                    Specify the claims to include in the token that is returned when the policy runs
                -->
            </RelyingParty>
        </TrustFrameworkPolicy>

    ```
    Replace `yourtenant` with the subdomain part of your tenant name, such as `contoso`. Learn how to [Get your tenant name](tenant-management-read-tenant-name.md#get-your-tenant-name). 

    The XML elements define the top-level `TrustFrameworkPolicy` element of a policy file with its policy ID and tenant name. The TrustFrameworkPolicy element contains other XML elements that you'll use in this series.

1. To declare a claim, add the following code in `BuildingBlocks` section of the `ContosoCustomPolicy.XML` file: 

    ```xml
      <ClaimsSchema>
        <ClaimType Id="objectId">
            <DisplayName>unique object Id for subject of the claims being returned</DisplayName>
            <DataType>string</DataType>
        </ClaimType>        
        <ClaimType Id="message">
            <DisplayName>Will hold Hello World message</DisplayName>
            <DataType>string</DataType>
        </ClaimType>
      </ClaimsSchema>
    ``` 
    A [claim](claimsschema.md#claimtype) is like a variable. The claim's declaration also shows the claim's [data type](claimsschema.md#datatype). 

1. In the `ClaimsProviders` section of the `ContosoCustomPolicy.XML` file, add the following code:

    ```xml
        <ClaimsProvider>
          <DisplayName>Token Issuer</DisplayName>
          <TechnicalProfiles>
            <TechnicalProfile Id="JwtIssuer">
              <DisplayName>JWT Issuer</DisplayName>
              <Protocol Name="None" />
              <OutputTokenFormat>JWT</OutputTokenFormat>
              <Metadata>
                <Item Key="client_id">{service:te}</Item>
                <Item Key="issuer_refresh_token_user_identity_claim_type">objectId</Item>
                <Item Key="SendTokenResponseBodyWithJsonNumbers">true</Item>
              </Metadata>
              <CryptographicKeys>
                <Key Id="issuer_secret" StorageReferenceId="B2C_1A_TokenSigningKeyContainer" />
                <Key Id="issuer_refresh_token_key" StorageReferenceId="B2C_1A_TokenEncryptionKeyContainer" />
              </CryptographicKeys>
            </TechnicalProfile>
          </TechnicalProfiles>
        </ClaimsProvider>

        <ClaimsProvider>
          <!-- The technical profile(s) defined in this section is required by the framework to be included in all custom policies. -->
          <DisplayName>Trustframework Policy Engine TechnicalProfiles</DisplayName>
          <TechnicalProfiles>
            <TechnicalProfile Id="TpEngine_c3bd4fe2-1775-4013-b91d-35f16d377d13">
              <DisplayName>Trustframework Policy Engine Default Technical Profile</DisplayName>
              <Protocol Name="None" />
              <Metadata>
                <Item Key="url">{service:te}</Item>
              </Metadata>
            </TechnicalProfile>
          </TechnicalProfiles>
        </ClaimsProvider>
    ```
    
    We've declared a JWT Token Issuer. In the `CryptographicKeys` section, if you used different names to configure the signing and encryption keys in [step 1](#step-1---configure-the-signing-and-encryption-keys), make sure you use the correct value for the `StorageReferenceId`.  

1. In the `UserJourneys` section of the `ContosoCustomPolicy.XML` file, add the following code:

    ```xml
      <UserJourney Id="HelloWorldJourney">
        <OrchestrationSteps>
          <OrchestrationStep Order="1" Type="SendClaims" CpimIssuerTechnicalProfileReferenceId="JwtIssuer" />
        </OrchestrationSteps>
      </UserJourney>
    ```
    
    We've added a [UserJourney](userjourneys.md). The user journey specifies the business logic the end user goes through as Azure AD B2C processes a request. This user journey has only one step that issues a JTW token with the claims that you'll define in the next step.

1.  In the `RelyingParty` section of the `ContosoCustomPolicy.XML` file, add the following code:

    ```xml
      <DefaultUserJourney ReferenceId="HelloWorldJourney"/>
      <TechnicalProfile Id="HelloWorldPolicyProfile">
        <DisplayName>Hello World Policy Profile</DisplayName>
        <Protocol Name="OpenIdConnect" />
        <OutputClaims>
          <OutputClaim ClaimTypeReferenceId="objectId" PartnerClaimType="sub" DefaultValue="abcd-1234-efgh-5678-ijkl-etc."/>
          <OutputClaim ClaimTypeReferenceId="message" DefaultValue="Hello World!"/>
        </OutputClaims>
        <SubjectNamingInfo ClaimType="sub" />
      </TechnicalProfile>
    ```

    The [RelyingParty](relyingparty.md) section is the entry point to your policy. It specifies the [UserJourney](userjourneys.md) to execute and the claims to include in the token that is returned when the policy runs.  

After you complete [step 2](#step-2---build-the-custom-policy-file), the `ContosoCustomPolicy.XML` file should look similar to the following code: 

```xml
    <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <TrustFrameworkPolicy xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://schemas.microsoft.com/online/cpim/schemas/2013/06" PolicySchemaVersion="0.3.0.0" TenantId="Contosob2c2233.onmicrosoft.com" PolicyId="B2C_1A_ContosoCustomPolicy" PublicPolicyUri="http://Contosob2c2233.onmicrosoft.com/B2C_1A_ContosoCustomPolicy">
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
            </ClaimsSchema>
        </BuildingBlocks>
        <ClaimsProviders><!--Claims Providers Here-->
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
                <Protocol Name="None" />
                <Metadata>
                    <Item Key="url">{service:te}</Item>
                </Metadata>
                </TechnicalProfile>
            </TechnicalProfiles>
            </ClaimsProvider>
        </ClaimsProviders>
      <UserJourneys>
        <UserJourney Id="HelloWorldJourney">
          <OrchestrationSteps>
            <OrchestrationStep Order="1" Type="SendClaims" CpimIssuerTechnicalProfileReferenceId="JwtIssuer" />
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
                    <OutputClaim ClaimTypeReferenceId="objectId" PartnerClaimType="sub" DefaultValue="abcd-1234-efgh-5678-ijkl-etc."/>
                    <OutputClaim ClaimTypeReferenceId="message" DefaultValue="Hello World!"/>
                </OutputClaims>
                <SubjectNamingInfo ClaimType="sub"/>
            </TechnicalProfile>
        </RelyingParty>
    </TrustFrameworkPolicy>
```
    
## Step 3 - Upload custom policy file

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If you have access to multiple tenants, select the **Settings** icon in the top menu to switch to your Azure AD B2C tenant from the **Directories + subscriptions** menu.
1. In the Azure portal, search for and select **Azure AD B2C**.
1. In the left menu, under **Policies**, select **Identity Experience Framework**.
1. Select **Upload custom policy**, browse select and then upload the `ContosoCustomPolicy.XML` file. 


After you upload the file, Azure AD B2C adds the prefix `B2C_1A_`, so the names looks similar to **B2C_1A_CONTOSOCUSTOMPOLICY**.


## Step 4 - Test the custom policy

1. Under **Custom policies**, select **B2C_1A_CONTOSOCUSTOMPOLICY**.
1. For **Select application** on the overview page of the custom policy, select the web application such as *webapp1* that you previously registered. Make sure that the **Select reply URL** value is set to`https://jwt.ms`.
1. Select **Run now** button.

After the policy finishes execution, you're redirected to `https://jwt.ms`, and you see a decoded JWT token. It looks similar to the following JWT token snippet: 

```json
    {
      "typ": "JWT",
      "alg": "RS256",
      "kid": "pxLOMWFg...."
    }.{
      ...
      "sub": "abcd-1234-efgh-5678-ijkl-etc.",
      ...
      "acr": "b2c_1a_contosocustompolicy",
      ...
      "message": "Hello World!"
    }.[Signature]
``` 

Notice the `message` and `sub` claims, which we set as [output claims](relyingparty.md#outputclaims) in the `RelyingParty` section. 

## Next steps

In this article, you learned and used four sections that are included in an Azure AD B2C custom policy. These sections are added as child elements the `TrustFrameworkPolicy` root element: 

> [!div class="checklist"]
> - BuildingBlocks 
> - ClaimsProviders 
> - UserJourneys 
> - RelyingParty 


Next, learn:  

- How to [collect and use user inputs by using custom policy](custom-policies-series-collect-user-input.md).

- About custom policy [claims overview](custom-policy-overview.md#claims).

- How to [declare a custom policy claim](claimsschema.md). 

- About custom policy [claims data type](claimsschema.md#datatype). 

- About custom policy [user input types](claimsschema.md#userinputtype).
