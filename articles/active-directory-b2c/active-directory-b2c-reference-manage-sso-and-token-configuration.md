---
title: Manage SSO and token customization using custom policies in Azure Active Directory B2C | Microsoft Docs
description: Learn about managing SSO and token customization using custom policies in Azure Active Directory B2C.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 10/09/2018
ms.author: marsma
ms.subservice: B2C
---

# Manage SSO and token customization using custom policies in Azure Active Directory B2C

This article provides information about how you can manage your token, session, and single sign-on (SSO) configurations using [custom policies](active-directory-b2c-overview-custom.md) in Azure Active Directory (Azure AD) B2C.

## Token lifetimes and claims configuration

To change the settings on your token lifetimes, you add a [ClaimsProviders](claimsproviders.md) element in the relying party file of the policy you want to impact.  The **ClaimsProviders** element is a child of the [TrustFrameworkPolicy](trustframeworkpolicy.md) element. 

Insert the ClaimsProviders element between the BasePolicy element and the RelyingParty element of the relying party file.

Inside, you'll need to put the information that affects your token lifetimes. The XML looks like this example:

```XML
<ClaimsProviders>
   <ClaimsProvider>
      <DisplayName>Token Issuer</DisplayName>
      <TechnicalProfiles>
         <TechnicalProfile Id="JwtIssuer">
            <Metadata>
               <Item Key="token_lifetime_secs">3600</Item>
               <Item Key="id_token_lifetime_secs">3600</Item>
               <Item Key="refresh_token_lifetime_secs">1209600</Item>
               <Item Key="rolling_refresh_token_lifetime_secs">7776000</Item>
               <Item Key="IssuanceClaimPattern">AuthorityAndTenantGuid</Item>
               <Item Key="AuthenticationContextReferenceClaimPattern">None</Item>
            </Metadata>
         </TechnicalProfile>
      </TechnicalProfiles>
   </ClaimsProvider>
</ClaimsProviders>
```

The following values are set in the previous example:

- **Access token lifetimes** - The access token lifetime value is set with **token_lifetime_secs** metadata item. The default value is 3600 seconds (60 minutes).
- **ID token lifetime** - The ID token lifetime value is set with the **id_token_lifetime_secs** metadata item. The default value is 3600 seconds (60 minutes).
- **Refresh token lifetime** - The refresh token lifetime value is set with the **refresh_token_lifetime_secs** metadata item. The default value is 1209600 seconds (14 days).
- **Refresh token sliding window lifetime** - If you would like to set a sliding window lifetime to your refresh token, set the value of **rolling_refresh_token_lifetime_secs** metadata item. The default value is 7776000 (90 days). If you don't want to enforce a sliding window lifetime, replace the item with `<Item Key="allow_infinite_rolling_refresh_token">True</Item>`.
- **Issuer (iss) claim** - The Issuer (iss) claim is set with the **IssuanceClaimPattern** metadata item. The applicable values are `AuthorityAndTenantGuid` and `AuthorityWithTfp`.
- **Setting claim representing policy ID** - The options for setting this value are `TFP` (trust framework policy) and `ACR` (authentication context reference). `TFP` is the recommended value. Set **AuthenticationContextReferenceClaimPattern** with the value of `None`. 

    In the **ClaimsSchema** element, add this element: 
    
    ```XML
    <ClaimType Id="trustFrameworkPolicy">
      <DisplayName>Trust framework policy name</DisplayName>
      <DataType>string</DataType>
    </ClaimType>
    ```
    
    In your **OutputClaims** element, add this element:
    
    ```XML
    <OutputClaim ClaimTypeReferenceId="trustFrameworkPolicy" Required="true" DefaultValue="{policy}" />
    ```

    For ACR, remove the **AuthenticationContextReferenceClaimPattern** item.

- **Subject (sub) claim** - This option defaults to ObjectID, if you would like to switch this setting to `Not Supported`, replace this line: 

    ```XML
    <OutputClaim ClaimTypeReferenceId="objectId" PartnerClaimType="sub" />
    ```
    
    with this line:
    
    ```XML
    <OutputClaim ClaimTypeReferenceId="sub" />
    ```

## Session behavior and SSO

To change your session behavior and SSO configurations, you add a **UserJourneyBehaviors** element inside of the [RelyingParty](relyingparty.md) element.  The **UserJourneyBehaviors** element must immediately follow the **DefaultUserJourney**. The inside of your **UserJourneyBehavors** element should look like this example:

```XML
<UserJourneyBehaviors>
   <SingleSignOn Scope="Application" />
   <SessionExpiryType>Absolute</SessionExpiryType>
   <SessionExpiryInSeconds>86400</SessionExpiryInSeconds>
</UserJourneyBehaviors>
```

The following values are configured in the previous example:

- **Single sign on (SSO)** - Single sign-on is configured with the **SingleSignOn**. The applicable values are `Tenant`, `Application`, `Policy`, and `Suppressed`. 
- **Web app session lifetime (minutes)** - The web app session lifetime is set with the **SessionExpiryInSeconds** element. The default value is 86400 seconds (1440 minutes).
- **Web app session time-out** - The web app session timeout is set with the **SessionExpiryType** element. The applicable values are `Absolute` and `Rolling`.
