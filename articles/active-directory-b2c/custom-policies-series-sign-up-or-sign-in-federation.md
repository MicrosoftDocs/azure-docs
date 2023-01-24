---
title: Set up a sign-up and sign-in flow with a social account by using Azure Active Directory B2C custom policy
titleSuffix: Azure AD B2C
description: Learn how to configure a sign-up and sign-in flow for a social account, Facebook, by using Azure Active Directory B2C custom policy.  
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

# Set up a sign-up and sign-in flow with a social account by using Azure Active Directory B2C custom policy

In [Set up a sign-up and sign-in flow by using Azure Active Directory B2C custom policy](custom-policies-series-sign-up-or-sign-in.md) article, we set up sign-in flow for a local account by using Azure Active Directory B2C (Azure AD B2C).  

In this article, we add a sign-in flow for an external account, such as a social account like Facebook. In this case, Azure AD B2C allows a user to sign in to your application with credentials from an external social identity provider (IdP). 

For local accounts, a user account is uniquely identified by using the `objectId` [user attribute](user-profile-attributes.md). For external IdP, we use `alternativeSecurityId` user attribute though an `objectId` still exists.   

## Prerequisites

- If you don't have one already, [create an Azure AD B2C tenant](tutorial-create-tenant.md) that is linked to your Azure subscription.

- [Register a web application](tutorial-register-applications.md), and [enable ID token implicit grant](tutorial-register-applications.md#enable-id-token-implicit-grant). For the Redirect URI, use https://jwt.ms.  

- You must have [Visual Studio Code (VS Code)](https://code.visualstudio.com/) installed in your computer. 

- Complete the steps in [Set up a sign-up and sign-in flow for local account by using Azure Active Directory B2C custom policy](custom-policies-series-sign-up-or-sign-in.md). This article is a part of [Create and run your own custom policies how-to guide series](custom-policies-series-overview.md).  


[!INCLUDE [active-directory-b2c-app-integration-call-api](../../includes/active-directory-b2c-common-note-custom-policy-how-to-series.md)]


## Step 1 - Create Facebook application  

Use the steps outlined in [Create a Facebook application](identity-provider-facebook.md?pivots=b2c-custom-policy#create-a-facebook-application) to obtain Facebook *App ID* and *App Secret*. Skip the prerequisites and the rest of the steps in the [Set up sign up and sign in with a Facebook account](identity-provider-facebook.md?pivots=b2c-custom-policy) article.

## Step 2 - Create Facebook policy key

Use the steps outlined in [Create the Facebook key](identity-provider-facebook.md?pivots=b2c-custom-policy#create-a-policy-key) store a policy key in your Azure AD B2C tenant. Skip the prerequisites and the rest of the steps in the [Set up sign up and sign in with a Facebook account](identity-provider-facebook.md?pivots=b2c-custom-policy) article.

## Step 3 - Configure sign-in with Facebook

To configure sign in with Facebook, you need to perform the following steps:

- Declare additional claims
- Define additional Claims transformations to help with claims manipulations such as creating *AlternativeSecurityId*.
- Configure Facebook claims provider
- Configure Azure AD Technical Profiles to read and write the social account from and to the Azure AD database.
- Configure a SelfAsserted technical profile (for accepting additional input from user or updating user details) and its content definition. 


### Step 3.1 - Declare additional claims 

In the `ContosoCustomPolicy.XML` file, locate the *ClaimsSchema* section, and then declare additional claims by using the following code:

```xml
    <ClaimType Id="issuerUserId">
        <DisplayName>Username</DisplayName>
        <DataType>string</DataType>
        <UserHelpText/>
        <UserInputType>TextBox</UserInputType>
        <Restriction>
            <Pattern RegularExpression="^[a-zA-Z0-9]+[a-zA-Z0-9_-]*$" HelpText="The username you provided is not valid. It must begin with an alphabet or number and can contain alphabets, numbers and the following symbols: _ -" />
        </Restriction>
    </ClaimType>
    
    <ClaimType Id="identityProvider">
        <DisplayName>Identity Provider</DisplayName>
        <DataType>string</DataType>
        <DefaultPartnerClaimTypes>
            <Protocol Name="OAuth2" PartnerClaimType="idp" />
            <Protocol Name="OpenIdConnect" PartnerClaimType="idp" />
            <Protocol Name="SAML2" PartnerClaimType="http://schemas.microsoft.com/identity/claims/identityprovider" />
        </DefaultPartnerClaimTypes>
        <UserHelpText/>
    </ClaimType>
    
    <ClaimType Id="authenticationSource">
        <DisplayName>AuthenticationSource</DisplayName>
        <DataType>string</DataType>
        <UserHelpText>Specifies whether the user was authenticated at Social IDP or local account.</UserHelpText>
    </ClaimType>  
    
    <ClaimType Id="upnUserName">
        <DisplayName>UPN User Name</DisplayName>
        <DataType>string</DataType>
        <UserHelpText>The user name for creating user principal name.</UserHelpText>
    </ClaimType>
    
    <ClaimType Id="alternativeSecurityId">
        <DisplayName>AlternativeSecurityId</DisplayName>
        <DataType>string</DataType>
        <UserHelpText/>
    </ClaimType>
    
    <ClaimType Id="mailNickName">
        <DisplayName>MailNickName</DisplayName>
        <DataType>string</DataType>
        <UserHelpText>Your mail nick name as stored in the Azure Active Directory.</UserHelpText>
    </ClaimType>
    
    <ClaimType Id="newUser">
        <DisplayName>User is new or not</DisplayName>
        <DataType>boolean</DataType>
        <UserHelpText/>
    </ClaimType>
```

### Step 3.2 - Define claims transformations 

In the `ContosoCustomPolicy.XML` file, locate the *ClaimsTransformations* element, and add claims transformations by using the following code: 

 ```xml
    <ClaimsTransformation Id="CreateRandomUPNUserName" TransformationMethod="CreateRandomString">
        <InputParameters>
            <InputParameter Id="randomGeneratorType" DataType="string" Value="GUID" />
        </InputParameters>
        <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="upnUserName" TransformationClaimType="outputClaim" />
        </OutputClaims>
    </ClaimsTransformation>

    <ClaimsTransformation Id="CreateAlternativeSecurityId" TransformationMethod="CreateAlternativeSecurityId">
        <InputClaims>
            <InputClaim ClaimTypeReferenceId="issuerUserId" TransformationClaimType="key" />
            <InputClaim ClaimTypeReferenceId="identityProvider" TransformationClaimType="identityProvider" />
        </InputClaims>
        <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="alternativeSecurityId" TransformationClaimType="alternativeSecurityId" />
        </OutputClaims>
    </ClaimsTransformation>
    
    <ClaimsTransformation Id="CreateUserPrincipalName" TransformationMethod="FormatStringClaim">
        <InputClaims>
            <InputClaim ClaimTypeReferenceId="upnUserName" TransformationClaimType="inputClaim" />
        </InputClaims>
        <InputParameters>
            <InputParameter Id="stringFormat" DataType="string" Value="cpim_{0}@{RelyingPartyTenantId}" />
        </InputParameters>
        <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="userPrincipalName" TransformationClaimType="outputClaim" />
        </OutputClaims>
    </ClaimsTransformation>
 ```

We've defined three Claims Transformations, which we use to generate values for *alternativeSecurityId* and *userPrincipalName* claims. These ClaimsTransformations are invoked in the OAuth2 Technical Profile in [step 3.3](#step-33---configure-facebook-claims-provider).   

### Step 3.3 - Configure Facebook Claims Provider

To enable users to sign in using a Facebook account, you need to define the account as a claims provider that Azure AD B2C can communicate with through an endpoint. You can define a Facebook account as a claims provider. 

In the `ContosoCustomPolicy.XML` file, locate *ClaimsProviders* element, add a new ClaimsProvider by using the following code: 

```xml
    <ClaimsProvider>
        <!-- The following Domain element allows this profile to be used if the request comes with domain_hint 
                query string parameter, e.g. domain_hint=facebook.com  -->
        <Domain>facebook.com</Domain>
        <DisplayName>Facebook</DisplayName>
        <TechnicalProfiles>
            <TechnicalProfile Id="Facebook-OAUTH">
            <!-- The text in the following DisplayName element is shown to the user on the claims provider 
                    selection screen. -->
            <DisplayName>Facebook</DisplayName>
            <Protocol Name="OAuth2" />
            <Metadata>
                <Item Key="ProviderName">facebook</Item>
                <Item Key="authorization_endpoint">https://www.facebook.com/dialog/oauth</Item>
                <Item Key="AccessTokenEndpoint">https://graph.facebook.com/oauth/access_token</Item>
                <Item Key="HttpBinding">GET</Item>
                <Item Key="UsePolicyInRedirectUri">0</Item>                
                <Item Key="client_id">facebook-app-id</Item>
                <Item Key="scope">email public_profile</Item>
                <Item Key="ClaimsEndpoint">https://graph.facebook.com/me?fields=id,first_name,last_name,name,email</Item>
                <Item Key="AccessTokenResponseFormat">json</Item>
            </Metadata>
            <CryptographicKeys>
                <Key Id="client_secret" StorageReferenceId="facebook-policy-key" />
            </CryptographicKeys>
            <InputClaims />
            <OutputClaims>
                <OutputClaim ClaimTypeReferenceId="issuerUserId" PartnerClaimType="id" />
                <OutputClaim ClaimTypeReferenceId="givenName" PartnerClaimType="first_name" />
                <OutputClaim ClaimTypeReferenceId="surname" PartnerClaimType="last_name" />
                <OutputClaim ClaimTypeReferenceId="displayName" PartnerClaimType="name" />
                <OutputClaim ClaimTypeReferenceId="email" PartnerClaimType="email" />
                <OutputClaim ClaimTypeReferenceId="identityProvider" DefaultValue="facebook.com" AlwaysUseDefaultValue="true" />
                <OutputClaim ClaimTypeReferenceId="authenticationSource" DefaultValue="socialIdpAuthentication" AlwaysUseDefaultValue="true" />
            </OutputClaims>
            <OutputClaimsTransformations>
                <OutputClaimsTransformation ReferenceId="CreateRandomUPNUserName" />
                <OutputClaimsTransformation ReferenceId="CreateUserPrincipalName" />
                <OutputClaimsTransformation ReferenceId="CreateAlternativeSecurityId" />
            </OutputClaimsTransformations>
            </TechnicalProfile>
        </TechnicalProfiles>
    </ClaimsProvider>
```

Replace:
- `facebook-app-id` with the value of Facebook *appID* you obtained in [step 1](#step-1---create-facebook-application). 
- `facebook-policy-key` with the name of the Facebook policy key you obtained in [step 2](#step-2---create-facebook-policy-key).

Notice the claims transformations we defined in [step 3.2](#step-32---define-claims-transformations) in the *OutputClaimsTransformations* collection.   

### Step 3.4 - Create Azure AD Technical Profiles

Just like in sign-in with a local account, you need to configure the [Azure AD Technical Profiles](active-directory-technical-profile.md), which you use to connect to Azure AD storage, to store or read a user social account. 

1. In the `ContosoCustomPolicy.XML` file, locate the *AAD-UserUpdate* technical profile and then add a new technical profile by using the following code: 

    ```xml
        <TechnicalProfile Id="AAD-UserWriteUsingAlternativeSecurityId">
            <DisplayName>Azure Active Directory technical profile for handling social accounts</DisplayName>
            <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.AzureActiveDirectoryProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
    
            <Metadata>
                <Item Key="Operation">Write</Item>
                <Item Key="RaiseErrorIfClaimsPrincipalAlreadyExists">true</Item>
            </Metadata>        
    
            <CryptographicKeys>
                <Key Id="issuer_secret" StorageReferenceId="B2C_1A_TokenSigningKeyContainer" />
            </CryptographicKeys>
            <InputClaims>
                <InputClaim ClaimTypeReferenceId="alternativeSecurityId" PartnerClaimType="alternativeSecurityId" Required="true" />
            </InputClaims>
            <PersistedClaims>
                <!-- Required claims -->
                <PersistedClaim ClaimTypeReferenceId="alternativeSecurityId" />
                <PersistedClaim ClaimTypeReferenceId="userPrincipalName" />
                <PersistedClaim ClaimTypeReferenceId="mailNickName" DefaultValue="unknown" />
                <PersistedClaim ClaimTypeReferenceId="displayName" DefaultValue="unknown" />
    
                <!-- Optional claims -->
                <PersistedClaim ClaimTypeReferenceId="givenName" />
                <PersistedClaim ClaimTypeReferenceId="surname" />
            </PersistedClaims>
            <OutputClaims>
                <OutputClaim ClaimTypeReferenceId="objectId" />
                <OutputClaim ClaimTypeReferenceId="newUser" PartnerClaimType="newClaimsPrincipalCreated" />
            </OutputClaims>
    
        </TechnicalProfile>
    ```
    We've added a new Azure AD Technical Profile *AAD-UserWriteUsingAlternativeSecurityId* that writes a new social account into Azure AD. 

1. Replace *B2C_1A_TokenSigningKeyContainer* with the token signing key you created in [Configure the signing](custom-policies-series-hello-world.md#step-1---configure-the-signing-and-encryption-keys).  
 
1. In the `ContosoCustomPolicy.XML` file add another Azure AD Technical Profile after the *AAD-UserWriteUsingAlternativeSecurityId* Technical Profile by using the following code:   

     ```xml
        <TechnicalProfile Id="AAD-UserReadUsingAlternativeSecurityId">
            <DisplayName>Azure Active Directory</DisplayName>
            <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.AzureActiveDirectoryProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
            <Metadata>
                <Item Key="Operation">Read</Item>
                <Item Key="RaiseErrorIfClaimsPrincipalDoesNotExist">false</Item>
            </Metadata>
            <CryptographicKeys>
                <Key Id="issuer_secret" StorageReferenceId="B2C_1A_TokenSigningKeyContainer" />
                </CryptographicKeys>
            <InputClaims>
                <InputClaim ClaimTypeReferenceId="alternativeSecurityId" PartnerClaimType="alternativeSecurityId" Required="true" />
            </InputClaims>
            <OutputClaims>
                <!-- Required claims -->
                <OutputClaim ClaimTypeReferenceId="objectId" />
    
                <!-- Optional claims -->
                <OutputClaim ClaimTypeReferenceId="userPrincipalName" />
                <OutputClaim ClaimTypeReferenceId="displayName" />
                <OutputClaim ClaimTypeReferenceId="givenName" />
                <OutputClaim ClaimTypeReferenceId="surname" />
            </OutputClaims>
        </TechnicalProfile>
     ```

    We've added a new Azure AD Technical Profile *AAD-UserReadUsingAlternativeSecurityId* that reads a new social account from Azure AD. It uses `alternativeSecurityId` as a unique identifier for the social account. 

1. Replace *B2C_1A_TokenSigningKeyContainer* with the token signing key you created in [Configure the signing](custom-policies-series-hello-world.md#step-1---configure-the-signing-and-encryption-keys).

### Step 3.5 - Configure Content Definition 

After a user signs in, you can collect some information from them by using a SelfAsserted Technical Profile. So, you need to configure content definition for the SelfAsserted Technical Profile.  

In the `ContosoCustomPolicy.XML` file, locate the *ContentDefinitions* element, and then add a new content definition by using the following code: 

```xml
    <ContentDefinition Id="socialAccountsignupContentDefinition">
        <LoadUri>~/tenant/templates/AzureBlue/selfAsserted.cshtml</LoadUri>
        <RecoveryUri>~/common/default_page_error.html</RecoveryUri>
        <DataUri>urn:com:microsoft:aad:b2c:elements:contract:selfasserted:2.1.7</DataUri>
        <Metadata>
            <Item Key="DisplayName">Collect information from user page alongside those from social Idp.</Item>
        </Metadata>
    </ContentDefinition>
```
We use this content definition as a metadata in a SelfAsserted Technical Profile on the next step ([step 3.6](#step-36---configure-a-selfasserted-technical-profile)). 

### Step 3.6 - Configure a SelfAsserted Technical Profile

The SelfAsserted Technical Profile you configure in this step is used to collect more information from the user or update similar information obtained from the social account. 

In the `ContosoCustomPolicy.XML` file, locate the *ClaimsProviders* section, and then add a new claims provider by using the following code: 

```xml
        <ClaimsProvider>
            <DisplayName>Self Asserted for social sign in</DisplayName>
            <TechnicalProfiles>
                <TechnicalProfile Id="SelfAsserted-Social">
                    <DisplayName>Collect more info during social signup</DisplayName>
                    <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.SelfAssertedAttributeProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
                    <Metadata>
                      <Item Key="ContentDefinitionReferenceId">socialAccountsignupContentDefinition</Item>
                    </Metadata>
                    <CryptographicKeys>
                      <Key Id="issuer_secret" StorageReferenceId="B2C_1A_TokenSigningKeyContainer" />
                    </CryptographicKeys>
                    <InputClaims>
                      <!-- These claims ensure that any values retrieved in the previous steps (e.g. from an external IDP) are prefilled. 
                           Note that some of these claims may not have any value, for example, if the external IDP did not provide any of
                           these values, or if the claim did not appear in the OutputClaims section of the IDP.
                           In addition, if a claim is not in the InputClaims section, but it is in the OutputClaims section, then its
                           value will not be prefilled, but the user will still be prompted for it (with an empty value). -->
                      <InputClaim ClaimTypeReferenceId="displayName" />
                      <InputClaim ClaimTypeReferenceId="givenName" />
                      <InputClaim ClaimTypeReferenceId="surname" />
                    </InputClaims>
                    <!---User will be asked to input or update these values-->
                    <DisplayClaims>
                        <DisplayClaim ClaimTypeReferenceId="displayName"/>
                        <DisplayClaim ClaimTypeReferenceId="givenName"/>
                        <DisplayClaim ClaimTypeReferenceId="surname"/>
                    </DisplayClaims>

                    <OutputClaims>
                      <!-- These claims are not shown to the user because their value is obtained through the "ValidationTechnicalProfiles"
                           referenced below, or a default value is assigned to the claim. A claim is only shown to the user to provide a 
                           value if its value cannot be obtained through any other means. -->
                      <OutputClaim ClaimTypeReferenceId="objectId" />
                      <OutputClaim ClaimTypeReferenceId="newUser" />
                      <!---<OutputClaim ClaimTypeReferenceId="executed-SelfAsserted-Input" DefaultValue="true" />-->
          
                      <!-- Optional claims. These claims are collected from the user and can be modified. If a claim is to be persisted in the directory after having been 
                           collected from the user, it needs to be added as a PersistedClaim in the ValidationTechnicalProfile referenced below, i.e. 
                           in AAD-UserWriteUsingAlternativeSecurityId. -->
                      <OutputClaim ClaimTypeReferenceId="displayName" />
                      <OutputClaim ClaimTypeReferenceId="givenName" />
                      <OutputClaim ClaimTypeReferenceId="surname" />
                    </OutputClaims>
                    <ValidationTechnicalProfiles>
                      <ValidationTechnicalProfile ReferenceId="AAD-UserWriteUsingAlternativeSecurityId" />
                    </ValidationTechnicalProfiles>
                  </TechnicalProfile>
            </TechnicalProfiles>
        </ClaimsProvider>
```

The claims provider we've added contains a SelfAsserted Technical Profile, *SelfAsserted-Social*. The SelfAsserted Technical Profile uses the *AAD-UserWriteUsingAlternativeSecurityId* Technical Profile as a validation technical profile. So, the *AAD-UserWriteUsingAlternativeSecurityId* Technical Profile executes when the user selects the **Continue** button (see screenshot in [step 7](#step-7---test-policy)).     

Also, notice that we've added the content definition, *socialAccountsignupContentDefinition*, that we configured in [step 3.5](#step-35---configure-content-definition) in the metadata section.  

## Step 4 - Update the User Journey Orchestration Steps

In the `ContosoCustomPolicy.XML` file, locate the `HelloWorldJourney` *UserJourney* and replace all the Orchestration Steps with the steps shown in the following code: 

```xml
    <OrchestrationStep Order="1" Type="CombinedSignInAndSignUp">
        <ClaimsProviderSelections>
            <ClaimsProviderSelection TargetClaimsExchangeId="FacebookExchange" />
        </ClaimsProviderSelections>
    </OrchestrationStep>

    <OrchestrationStep Order="2" Type="ClaimsExchange">
        <ClaimsExchanges>
            <ClaimsExchange Id="FacebookExchange"
                TechnicalProfileReferenceId="Facebook-OAUTH" />
        </ClaimsExchanges>
    </OrchestrationStep>

    <!-- For social IDP authentication, attempt to find the user account in the
    directory. -->
    <OrchestrationStep Order="3" Type="ClaimsExchange">
        <ClaimsExchanges>
            <ClaimsExchange Id="AADUserReadUsingAlternativeSecurityId" TechnicalProfileReferenceId="AAD-UserReadUsingAlternativeSecurityId" />
        </ClaimsExchanges>
    </OrchestrationStep>

    <!-- Show self-asserted page only if the directory does not have the user account
    already (i.e. we do not have an objectId).  -->
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

    <OrchestrationStep Order="5" Type="ClaimsExchange">
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
    <OrchestrationStep Order="6" Type="SendClaims" CpimIssuerTechnicalProfileReferenceId="JwtIssuer" />
```
In the orchestration we've used make reference to technical profiles that enable a user to sign in by using a social account.  

When the custom policy runs:

- **Orchestration Step 1** - This step includes a *ClaimsProviderSelections* element, which lists the available sign-in options a user can choose from. In this case, we've one option only, *FacebookExchange*.

-  **Orchestration Step 2** - The *Facebook-OAUTH* Technical Profile executes, so the user is redirected to Facebook to sign in. 

- **Orchestration Step 3** - In step 3, the *AAD-UserReadUsingAlternativeSecurityId* Technical Profile executes to try to read the user social account from Azure AD. If the social account is found, `objectId` is returned as an output claim.    

- **Orchestration Step 4** - This step runs if the user doesn't already exist (`objectId` doesn't exist). It shows the form that collects more information from the user or updates similar information obtained from the social account.

-  **Orchestration Step 5** - This step runs if the user doesn't already exist (`objectId` doesn't exist), so the *AAD-UserWriteUsingAlternativeSecurityId* Technical Profile executes to write the social account into Azure AD.  

- **Orchestration Step 6** - Finally, step 6 assembles and returns the JWT token at the end of the policy’s execution.

## Step 5 - Update Relying Party Output Claims 

In the `ContosoCustomPolicy.XML` file, locate the *RelyingParty* element, and then replace all the output claims with the following code:

```xml
    <OutputClaim ClaimTypeReferenceId="displayName" />
    <OutputClaim ClaimTypeReferenceId="givenName" />
    <OutputClaim ClaimTypeReferenceId="surname" />
    <OutputClaim ClaimTypeReferenceId="email" />
    <OutputClaim ClaimTypeReferenceId="objectId" PartnerClaimType="sub"/>
    <OutputClaim ClaimTypeReferenceId="identityProvider" />
```
We've included the identity provider (*identityProvider*) as an output claim, so it will be available in the JWT token returned to the relying party application. 
 
## Step 6 - Upload policy

Follow the steps in [Upload custom policy file](custom-policies-series-hello-world.md#step-3---upload-custom-policy-file) to upload your policy file. If you're uploading a file with same name as the one already in the portal, make sure you select **Overwrite the custom policy if it already exists**.

## Step 7 - Test policy 

Follow the steps in [Test the custom policy](custom-policies-series-validate-user-input.md#step-6---test-the-custom-policy) to test your custom policy. 

You're redirected to a Facebook sign-in page. Enter your Facebook credentials, and then select **Log In**. 
You're directly redirected to Facebook as we set it so in our orchestration steps since we don't have multiple sign-in options to choose from. Typically, in an app, you'd add a button like **Sign in with Facebook**, which when selected, runs the policy. 

If it's the first time running this policy (social account doesn't already exist), you see a screen such as the one shown below. You won't see this screen in subsequent policy execution (social account already exist).  

:::image type="content" source="media/custom-policies-series-sign-up-or-sign-in-federation/screenshot-of-sign-in-social-account.png" alt-text="Screenshot of sign-in flow with social account."::: 

Enter or update **Display Name**, **Given Name** and the **Surname**, and then select **Continue** button.  

After the policy finishes execution, you're redirected to https://jwt.ms, and you see a decoded JWT token. It looks similar to the following JWT token snippet:

```json
{
  "typ": "JWT",
  "alg": "RS256",
  "kid": "pxLOMWFgP4T..."
}.{
   ...
  "acr": "b2c_1a_contosocustompolicy",
   ...
  "given_name": "Maurice",
  "family_name": "Paulet",
  "name": "Maurice Paulet",
  "email": "maurice.p@contoso.com",
  "idp": "facebook.com"
}.[Signature]
```

Notice the identity provider, `"idp": "facebook.com"`, has been included in the JWT token.  

## Next steps 

- Learn more about how to [Define an OAuth2 technical profile in an Azure Active Directory B2C custom policy](oauth2-technical-profile.md).