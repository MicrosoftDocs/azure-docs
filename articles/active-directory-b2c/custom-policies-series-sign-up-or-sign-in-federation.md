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
ms.subservice: B2C
---


# Set up a sign-up and sign-in flow with a social account by using Azure Active Directory B2C custom policy

Refer to [Set up a sign-up and sign-in flow by using Azure Active Directory B2C custom policy](custom-policies-series-sign-up-or-sign-in.md) - local account used. 

In this article, we add sign in with Facebook, so a user can select if they want to use a local account or social account. 

Explain that authentication is delegated to Facebook 

Social IDPs use `AlternativeSecurityId` as opposed to objectId 


## Prerequisites

- If you don't have one already, [create an Azure AD B2C tenant](tutorial-create-tenant.md) that is linked to your Azure subscription.

- [Register a web application](tutorial-register-applications.md), and [enable ID token implicit grant](tutorial-register-applications.md#enable-id-token-implicit-grant). For the Redirect URI, use https://jwt.ms.  

- You must have [Visual Studio Code (VS Code)](https://code.visualstudio.com/) installed in your computer. 

- Complete the steps in [Set up a sign-up and sign-in flow by using Azure Active Directory B2C custom policy](custom-policies-series-sign-up-or-sign-in.md). This article is a part of [Create and run your own custom policies how-to guide series](custom-policies-series-overview.md).  


[!INCLUDE [active-directory-b2c-app-integration-call-api](../../includes/active-directory-b2c-common-note-custom-policy-how-to-series.md)]


## Step 1 - Create Facebook application  

Use the steps outlined in [Create a Facebook application](identity-provider-facebook.md?pivots=b2c-custom-policy#create-a-facebook-application) to obtain Facebook *App ID* and *App Secret*. Skip the prerequisites and the rest of the steps in the [Set up sign up and sign in with a Facebook account](identity-provider-facebook.md?pivots=b2c-custom-policy) article.

## Step 2 - Create the Facebook policy key

Use the steps outlined in [Create the Facebook key](identity-provider-facebook?pivots=b2c-custom-policy#create-a-policy-key) store a policy key in your Azure AD B2C tenant. Skip the prerequisites and the rest of the steps in the [Set up sign up and sign in with a Facebook account](identity-provider-facebook.md?pivots=b2c-custom-policy) article.

## Step 3  Configure sign-in with Facebook

### Declare additional claims


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

otherMails* (find out if we need this claim)

<more claims: study the claims transformations and and AAD TPs for social accounts>



### Claims transformations 

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

<InputClaimsTransformation ReferenceId="CreateOtherMailsFromEmail" /> called by AAD-UserWriteUsingAlternativeSecurityId is it needed

### Create Azure AD Technical Profiles

writes social account using `AlternativeSecurityId`

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
            <!--<PersistedClaim ClaimTypeReferenceId="otherMails" />-->
            <PersistedClaim ClaimTypeReferenceId="givenName" />
            <PersistedClaim ClaimTypeReferenceId="surname" />
        </PersistedClaims>
        <OutputClaims>
            <OutputClaim ClaimTypeReferenceId="objectId" />
            <OutputClaim ClaimTypeReferenceId="newUser" PartnerClaimType="newClaimsPrincipalCreated" />

        </OutputClaims>

    </TechnicalProfile>
```

Reads social account using `AlternativeSecurityId`

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
            <!---<OutputClaim ClaimTypeReferenceId="otherMails" />-->
            <OutputClaim ClaimTypeReferenceId="givenName" />
            <OutputClaim ClaimTypeReferenceId="surname" />
        </OutputClaims>
        <!--<IncludeTechnicalProfile ReferenceId="AAD-Common" />-->
    </TechnicalProfile>
 ```

### Content definition for Social interface 

After sign in, collect some info via a self-asserted TP, we need content definition for this TP

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

### Social interface TP

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
                    <!---User will be asked to input these values-->
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
                    <!--<UseTechnicalProfileForSessionManagement ReferenceId="SM-SocialSignup" />-->
                  </TechnicalProfile>
            </TechnicalProfiles>
        </ClaimsProvider>
```


`SelfAsserted-Social` to collect additional details before you submit. Uses `AAD-UserWriteUsingAlternativeSecurityId` as a validation TP

Uses `socialAccountsignupContentDefinition` content definition


### Step 3.1 - Configure Facebook OAuth Technical Profile

In the *ClaimsProviders* section, add a ClaimsProvider element, which contains a OAuth2 Technical profile by using the following code: 

Refer the user to learn more about [OAuth2 technical profile](oauth2-technical-profile.md)

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
      
                  <!-- The Facebook required HTTP GET method, but the access token response is in JSON format from 3/27/2017 -->
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
                <!--<UseTechnicalProfileForSessionManagement ReferenceId="SM-SocialLogin" />-->
              </TechnicalProfile>
            </TechnicalProfiles>
        </ClaimsProvider>
```

Replace:
- `facebook-app-id` with 
- `facebook-policy-key` with 

## Step 4 - Update the User Journey Orchestration Steps

We'll make no references to the local account sign in, only social account. 

Identify your `HelloWorldJourney` *UserJourney* and replace all the Orchestration Steps with the steps shown in the following code: 

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
Explain the order of the Orchestration Steps

## Step 5 - Update Relying Party Output Claims 

Replace Relying Party Output Claims with the following:

```xml
    <OutputClaim ClaimTypeReferenceId="displayName" />
    <OutputClaim ClaimTypeReferenceId="givenName" />
    <OutputClaim ClaimTypeReferenceId="surname" />
    <OutputClaim ClaimTypeReferenceId="email" />
    <OutputClaim ClaimTypeReferenceId="objectId" PartnerClaimType="sub"/>
    <OutputClaim ClaimTypeReferenceId="identityProvider" />
```
## Step 6 - Upload policy

## Step 7 - Test policy 

Observation: 

On running the policy, you're redirected to facebook. Typically, in an app, you'd add a button, that, when selected, runs the policy. If it's the first time (using facebook), you see a screen to collect more information <add an image>. you don't see this in subsequent sign in. 

## Next steps 

We made references only to social sign in artifacts. it means we've some elements or code that we don't need use.  
How to read an existing custom policy file to remove code that's not needed.