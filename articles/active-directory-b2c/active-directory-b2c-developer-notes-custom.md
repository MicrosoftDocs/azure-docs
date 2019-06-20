---
title: Developer notes for custom policies - Azure Active Directory B2C | Microsoft Docs
description: Notes for developers on configuring and maintaining Azure AD B2C with custom policies.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 03/18/2019
ms.author: marsma
ms.subservice: B2C
---

# Developer notes for custom policies in Azure Active Directory B2C

Custom policy configuration in Azure Active Directory B2C is now generally available. This method of configuration is targeted at advanced identity developers building complex identity solutions. Custom policies make the power of the Identity Experience Framework available in Azure AD B2C tenants. 
Advanced identity developers using custom policies should plan to invest some time completing walk-throughs and reading reference documents.

While most of the custom policy options available are now generally available, there are underlying capabilities, such as technical profile types and content definition APIs that are at different stages in the software lifecycle. Many more are coming. The table below specifies the level of availability at a more granular level.  

## Features that are generally available

- Author and upload custom authentication user journeys by using custom policies.  
    - Describe user journeys step-by-step as exchanges between claims providers.  
    - Define conditional branching in user journeys.  
- Interoperate with REST API-enabled services in your custom authentication user journeys.  
- Federate with identity providers that are compliant with the OpenIDConnect protocol.  
- Federate with identity providers that adhere to the SAML 2.0 protocol.   

## Responsibilities of custom policy feature-set developers

Manual policy configuration grants lower-level access to the underlying platform of Azure AD B2C and results in the creation of a unique, trust framework. The many possible permutations of custom identity providers, trust relationships, integrations with external services, and step-by-step workflows require a methodical approach to design and configuration. 

Developers consuming the custom policy feature set should adhere to the following guidelines:

- Become familiar with the configuration language of the custom policies and key/secrets management. For more information, see [TrustFrameworkPolicy](trustframeworkpolicy.md). 
- Take ownership of scenarios and custom integrations. Document your work and inform your live site organization.  
- Perform methodical scenario testing. 
- Follow software development and staging best practices with a minimum of one development and testing environment and one production environment. 
- Stay informed about new developments from the identity providers and services you integrate with. For example, keep track of changes in secrets and of scheduled and unscheduled changes to the service. 
- Set up active monitoring, and monitor the responsiveness of production environments. For more information about integrating with Application Insights, see [Azure Active Directory B2C: Collecting Logs](active-directory-b2c-custom-guide-eventlogger-appins.md). 
- Keep contact email addresses current in the Azure subscription, and stay responsive to the Microsoft live-site team emails. 
- Take timely action when advised to do so by the Microsoft live-site team.

## Terms for features in public preview

- We encourage you to use the public preview features for evaluation purposes only. 
- Service level agreements (SLAs) do not apply to the public preview features.
- Support requests for public preview features can be filed through regular support channels. 

## Features by stage and known issues

Custom policy/Identity Experience Framework capabilities are under constant and rapid development. The following table is an index of features and component availability.

### Identity Providers, Tokens, Protocols

| Feature | Development | Preview | GA | Notes |
|-------- | ----------- | ------- | -- | ----- |
| IDP-OpenIDConnect |  |  | X | For example, Google+.  |
| IDP-OAUTH2 |  |  | X | For example, Facebook.  |
| IDP-OAUTH1 (twitter) |  | X |  | For example, Twitter. |
| IDP-OAUTH1 (ex-twitter) |  |  |  | Not supported |
| IDP-SAML |  |   | X | For example, Salesforce, ADFS. |
| IDP-WSFED | X |  |  |  |
| Relying Party OAUTH1 |  |  |  | Not supported. |
| Relying Party OAUTH2 |  |  | X |  |
| Relying Party OIDC |  |  | X |  |
| Relying Party SAML | X |  |  |  |
| Relying Party WSFED | X |  |  |  |
| REST API with basic and certificate auth |  |  | X | For example, Azure Logic Apps. |

### Component Support

| Feature | Development | Preview | GA | Notes |
| ------- | ----------- | ------- | -- | ----- |
| Azure Multi Factor Authentication |  |  | X |  |
| Azure Active Directory as local directory |  |  | X |  |
| Azure Email subsystem for email verification |  |  | X |  |
| Multi-language support|  |  | X |  |
| Predicate Validations |  |  | X | For example, password complexity. |
| Using third party email service providers | X |  |  |  |

### Content Definition

| Feature | Development | Preview | GA | Notes |
| ------- | ----------- | ------- | -- | ----- |
| Error page, api.error |  |  | X |  |
| IDP selection page, api.idpselections |  |  | X |  |
| IDP selection for signup, api.idpselections.signup |  |  | X |  |
| Forgot Password, api.localaccountpasswordreset |  |  | X |  |
| Local Account Sign-in, api.localaccountsignin |  |  | X |  |
| Local Account Sign-up, api.localaccountsignup |  |  | X |  |
| MFA page, api.phonefactor |  |  | X |  |
| Self-asserted social account sign-up, api.selfasserted |  |  | X |  |
| Self-asserted profile update, api.selfasserted.profileupdate |  |  | X |  |
| Unified signup or sign-in page, api.signuporsignin, with parameter "disableSignup" |  |  | X |  |
| JavaScript / Page contract |  | X |  |  |

### App-IEF integration

| Feature | Development | Preview | GA | Notes |
| ------- | ----------- | ------- | -- | ----- |
| Query string parameter domain_hint |  |  | X | Available as claim, can be passed to IDP. |
| Query string parameter login_hint |  |  | X | Available as claim, can be passed to IDP. |
| Insert JSON into UserJourney via client_assertion | X |  |  | Will be deprecated. |
| Insert JSON into UserJourney as id_token_hint |  | X |  | Go-forward approach to pass JSON. |
| Pass IDP TOKEN to the application |  | X |  | For example, from Facebook to app. |

### Session Management

| Feature | Development | Preview | GA | Notes |
| ------- | ----------- | ------- | -- | ----- |
| SSO Session Provider |  |  | X |  |
| External Login Session Provider |  |  | X |  |
| SAML SSO  Session Provider |  |  | X |  |
| Default SSO Session Provider |  |  | X |  |

### Security

| Feature | Development | Preview | GA | Notes |
|-------- | ----------- | ------- | -- | ----- |
| Policy Keys- Generate, Manual, Upload |  |  | X |  |
| Policy Keys- RSA/Cert, Secrets |  |  | X |  |
| Policy upload |  |  | X |  |

### Developer interface

| Feature | Development | Preview | GA | Notes |
| ------- | ----------- | ------- | -- | ----- |
| Azure Portal-IEF UX |  |  | X |  |
| Application Insights UserJourney Logs |  | X |  | Used for troubleshooting during development.  |
| Application Insights Event Logs (via orchestration steps) |  | X |  | Used to monitor user flows in production. |

## Next steps
[Learn more about custom policies and the differences with user flows](active-directory-b2c-overview-custom.md).
