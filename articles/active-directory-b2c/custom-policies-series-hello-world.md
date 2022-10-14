---
title: Write your first custom policy - Hello World! 
titleSuffix: Azure AD B2C
description: Learn how to write your first custom policy. A custom that shows of returns Hello World message. 
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.custom: b2c-docs-improvements
ms.date: 10/30/2022
ms.author: kengaderdus
ms.subservice: B2C
---

# Write your first custom policy - Hello World! 

In your applications you use user flows that enable users to sign up, sign in, or manage their profile. When user flows don't cover all your business specific needs, you use custom policies. 

While you can use pre-made [custom policy starter pack](/tutorial-create-user-flows.md?pivots=b2c-custom-policy#custom-policy-starter-pack), it's important for you understand how custom policy are built from scratch. In this articles, you'll learn how to create your first custom policy from scratch. 

## Prerequisites 

- If you don't have one already, [create an Azure AD B2C tenant](tutorial-create-tenant.md) that is linked to your Azure subscription.
- [Register a web application](tutorial-register-applications.md), and [enable ID token implicit grant](tutorial-register-applications.md#enable-id-token-implicit-grant). For the Redirect URI, use https://jwt.ms. 
- You must have [Visual Studio Code (VS Code)](https://code.visualstudio.com/) installed in your computer. 

## Step 1 - Configure the signing and encryption keys

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
            <BuildingBlocks>
    
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
    Replace `yourtenant` with the sub-domain name of your tenant name, such as `contoso`. Learn how to [Get your tenant name](tenant-management-read-tenant-name.md#get-your-tenant-name).

1. To declare a claim, add the following code in `BuildingBlocks` section of the `ContosoCustomPolicy.XML` file: 

    ```xml
      <ClaimsSchema>
        <ClaimType Id="objectId">
            <DisplayName>subject Object ID</DisplayName>
            <DataType>string</DataType>
            <UserHelpText>Object identifier (ID) of the subject object in Azure AD.</UserHelpText>
        </ClaimType>
        <ClaimType Id="message">
            <UserHelpText>The message</UserHelpText>
            <DataType>string</DataType>
            <UserHelpText>It holds the Hello World message</UserHelpText>
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
    ```
    
    We've declared a JWT Token Issuer. In the `CryptographicKeys` section, if you used different names to configure the signing and encryption keys in [step 1](), make sure you update the value of `StorageReferenceId`.  

1. In the `UserJourneys` section of the `ContosoCustomPolicy.XML` file, add the following code:

## Step 3 - Upload and test custom policy

