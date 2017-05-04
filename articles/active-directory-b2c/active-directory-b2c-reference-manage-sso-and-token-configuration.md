---
title: 'Azure Active Directory B2C: Manage SSO and token customization with custom policies | Microsoft Docs'
description: 
services: active-directory-b2c
documentationcenter: ''
author: sama

ms.assetid: eec4d418-453f-4755-8b30-5ed997841b56
ms.service: active-directory-b2c
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: article
ms.devlang: na
ms.date: 05/02/2017
ms.author: sama

---
# Azure Active Directory B2C: Manage SSO and token customization with custom policies
Using custom policies provides you the same control over your token, session and single sign-on (SSO) configurations as through built-in policies.  To learn what each setting does, please see the documentation [here](#active-directory-b2c-token-session-sso).

## Token lifetimes and claims configuration
To change the settings on your token lifetimes, you need to add a `<ClaimsProviders>` element in the relying party file of the policy you want to impact.  The `<ClaimsProviders>` element is a child of the `<TrustFrameworkPolicy>`.  Inside you'll need to put the information that affects your token lifetimes.  The XML looks like this:

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

**Access token lifetimes**
The access token lifetime can be changed by modifying the value inside the `<Item>` with the Key="token_lifetime_secs" in seconds.  The default value in built-in is 3600 seconds (60 minutes).

**ID token lifetime**
The ID token lifetime can be changed by modifying the value inside the `<Item>` with the Key="id_token_lifetime_secs" in seconds.  The default value in built-in is 3600 seconds (60 minutes).

**Refresh token lifetime**
The refresh token lifetime can be changed by modifying the value inside the `<Item>` with the Key="refresh_token_lifetime_secs" in seconds.  The default value in built-in is 1209600 seconds (14 days).

**Refresh token sliding window lifetime**
If you would like to set a sliding window lifetime to your refresh token, modify the value inside `<Item>` with the Key="rolling_refresh_token_lifetime_secs" in seconds.  The default value in built-in is 7776000 (90 days).  If you don't want to enfore a sliding window lifetime, replace this line with:
```XML
<Item Key="allow_infinite_rolling_refresh_token">True</Item>
```
**Issuer (iss) claim**
If you want to change the Issuer (iss) claim, modify the value inside the `<Item>` with the Key="IssuanceClaimPattern".  The applicable values are `AuthorityAndTenantGuid` and `AuthorityWithTfp`.

**Setting claim representing policy ID**
The options for setting this value are TFP (trust framework policy) and ACR (authentication context reference).  
We recommend setting this to TFP, to do this, ensure the `<Item>` with the Key="AuthenticationContextReferenceClaimPattern" exists and the value is `None`.
In your `<OutputClaims>` item, add this element:
```XML
<OutputClaim ClaimTypeReferenceId="trustFrameworkPolicy" Required="true" DefaultValue="{policy}" />
```
For ACR, remove the `<Item>` with the Key="AuthenticationContextReferenceClaimPattern".

**Subject (sub) claim**
This option is defaulted to ObjectID, if you would like to switch this to `Not Supported`, do the following:

Replace this line 
```XML
<OutputClaim ClaimTypeReferenceId="objectId" PartnerClaimType="sub" />
```
with this line:
```XML
<OutputClaim ClaimTypeReferenceId="sub" />
```

## Session behavior and SSO
To change your session behavior and SSO configurations, you need to add a `<UserJourneyBehaviors>` element inside of the `<RelyingParty>` element.  The `<UserJourneyBehaviors>` element must immediately follow the `<DefaultUserJourney>`.  The inside of your `<UserJourneyBehavors>` element should look like this:

```XML
<UserJourneyBehaviors>
   <SingleSignOn Scope="Application" />
   <SessionExpiryType>Absolute</SessionExpiryType>
   <SessionExpiryInSeconds>86400</SessionExpiryInSeconds>
</UserJourneyBehaviors>
```
**Single sign-on (SSO) configuration**
To change the single sign-on configuration, you need to modify the value of `<SingleSignOn>`.  The applicable values are `Tenant`, `Application`, `Policy` and `Disabled`. 
**Web app session lifetime (minutes)**
To change the the web app session lifetime, you need to modify value of the `<SessionExpiryInSeconds>` element.  The default value in built-in policies is 86400 seconds (1440 minutes).
**Web app session timeout**
To change the web app session timeout, you need to modify the value of `<SessionExpiryType>`.  The applicable values are `Absolute` and `Rolling`.