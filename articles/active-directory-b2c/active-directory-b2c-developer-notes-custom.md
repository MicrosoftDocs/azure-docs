---
title: Developer notes on using custom policies in Azure Active Directory B2C | Microsoft Docs
description: Notes for developers on configuring and maintaining Azure AD B2C with custom policies.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 10/13/2017
ms.author: davidmu
ms.component: B2C
---

# Release notes for Azure Active Directory B2C custom policy public preview
The custom policy feature set is now available for evaluation under public preview for all Azure Active Directory B2C (Azure AD B2C) customers. This feature set is targeted at advanced identity developers building the most complex identity solutions.  

Today, this feature set requires developers to configure the Identity Experience Framework directly via XML file editing. This method of configuration is powerful and complex. Advanced identity developers using the Identity Experience Framework should plan to invest some time completing walk-throughs and reading reference documents. 

## Features included in this public preview
With the new features introduced in the public preview, developers can perform the following tasks:<br>

* Author and upload custom authentication user journeys by using custom policies. 
   * Describe user journeys step-by-step as exchanges between claims providers. 
   * Define conditional branching in user journeys. 
* Integrate REST API-enabled services in your custom authentication user journeys.  
* Add federation with identity providers that are compliant with the OpenIDConnect standard. <br>
* Add federation with identity providers that adhere to the SAML 2.0 protocol. 

## Terms of the public preview

* We encourage you to use the new features for evaluation purposes only.<br>
* The new features are not intended for use in a production environment.<br>
* Service level agreements (SLAs) do not apply to the new features. <br>
* Support requests can be filed through regular support channels. <br>
* There is no promised date for general availability.<br>
* At our discretion, and for any reason, Microsoft can flag and reject or restrict scenarios and user journeys that exceed the scope of the Azure AD B2C product charter to serve as a customer identity and access management (CIAM) platform.

## Responsibilities of custom policy feature-set developers
Manual policy configuration grants lower-level access to the underlying platform of Azure AD B2C and results in the creation of a unique, fully customizable trust framework. The possible permutations of custom identity providers, trust relationships, integrations with external services, and step-by-step workflows place greater demands on the advanced developers consuming them.

To fully benefit from the public preview, we suggest that developers consuming the custom policy feature set adhere to the following guidelines:
* Become familiar with the configuration language of the Identity Experience Framework and key/secrets management.
* Take ownership of scenarios and custom integrations.
* Perform methodical scenario testing.
* Follow software development and staging best practices with a minimum of one development and testing environment and one production environment.
* Stay informed about new developments from the identity providers and services you integrate with. For example, keep track of changes in secrets and of scheduled and unscheduled changes to the service.
* Set up active monitoring, and monitor the responsiveness of production environments.
* Keep contact email addresses current in the Azure subscription, and stay responsive to the Microsoft live-site team emails.
* Take timely action when advised to do so by the Microsoft live-site team. 

## Features by stage and known issues
Custom Policy/Identity Experience Framework capabilities are under constant and rapid development.  This table is an index of features/component availability.

Post questions in Stack Overflow at [https://aka.ms/aadb2cso](https://aka.ms/aadb2cso)


### Identity Providers, Tokens, Protocols
Interfaces with external components and applications

| Feature | Development | Preview | GA | Notes |
|---------------------------------------------|-------------|---------|----|-------|
| IDP-OpenIDConnect |  | x |  | for example, Google+ |
| IDP-OAUTH2 |  | x |  | for example, Facebook  |
| IDP-OAUTH1 |  | x |  | for example, Twitter |
| IDP-SAML |  | x |  | for example, Salesforce, ADFS |
| IDP-WSFED | x |  |  |  |
| Relying Party OAUTH |  | x |  |  |
| Relying Party OIDC |  | x |  |  |
| Relying Party SAML | x |  |  |  |
| Relying Party WSFED | x |  |  |  |
| REST API with basic and cert. auth |  | x |  | for example, Azure Functions |


### Component Support


| Feature | Development | Preview | GA | Notes |
|-------------------------------------------|-------------|---------|----|-------|
| Azure Multi Factor Authentication |  | x |  |  |
| Azure Active Directory as local directory |  | x |  |  |
| Azure Email subsystem for 2FA |  | x |  |  |
| Multi-language support|  | x |  |  |
| Password complexity | x |  |  |  |


### Content Definition

| Feature | Development | Preview | GA | Notes |
|-----------------------------------------------------------------------------|-------------|---------|----|-------|
|   Error page, api.error |  | x |  |  |
|   IDP selection page, api.idpselections |  | x |  |  |
|   IDP selection for signup, api.idpselections.signup |  | x |  |  |
|   Forgot Password, api.localaccountpasswordreset |  | x |  |  |
|   Local Account Sign-in, api.localaccountsignin |  | x |  |  |
|   Local Account Sign-up, api.localaccountsignup |  | x |  |  |
|   MFA page, api.phonefactor |  | x |  |  |
|   Self-asserted -for example social account sig-up, api.selfasserted |  | x |  |  |
|   Self-asserted profile update, api.selfasserted.profileupdate |  | x |  |  |
|   Unified signup or sign-in page, api.signuporsignin |  | x |  |  |


### App-IEF integration
| Feature | Development | Preview | GA | Notes |
|--------------------------------------------------|-------------|---------|----|-------------------------------------------------|
| Query string parameter id_token_hint | x |  |  |  |
| Query string parameter domain_hint |  | x |  | available as claim, can be passed to IDP |
| Query string parameter login_hint |  | x |  | available as claim, can be passed to IDP |
| Insert JSON into UserJourney via client_assertion | x |  |  | will be deprecated |
| Insert JSON into UserJourney as id_token_hint | x |  |  | go-forward approach to pass JSON |


### Session Management

| Feature | Development | Preview | GA | Notes |
|---------------------------------|-------------|---------|----|-------|
| SSO Session Provider |  | x |  |  |
| External Login Session Provider |  | x |  |  |
| SAML SSO  Session Provider |  | x |  |  |


### Security
| Feature | Development | Preview | GA | Notes |
|---------------------------------------------|-------------|---------|----|-------|
| Policy Keys- Generate, Manual, Upload |  | x |  |  |
| Policy Keys- RSA/Cert, Secrets |  | x |  |  |


### Developer interface
| Feature | Development | Preview | GA | Notes |
|---------------------------------------------|-------------|---------|----|-------|
| Azure Portal-IEF UX |  | x |  |  |
| Application Insights UserJourney Logs  |  | x |  |  |
| Application Insights Event Logs |x|  |  |  |



## Next steps
[Get started with custom policies](active-directory-b2c-get-started-custom.md).
