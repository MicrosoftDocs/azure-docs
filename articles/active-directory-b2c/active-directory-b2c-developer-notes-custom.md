---
title: 'Azure Active Directory B2C: Developer notes on using custom policies | Microsoft Docs'
description: Notes for developers on configuring and maintaining Azure AD B2C with custom policies
services: active-directory-b2c
documentationcenter: ''
author: rojasja
manager: krassk
editor: rojasja

ms.assetid:
ms.service: active-directory-b2c
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: article
ms.devlang: na
ms.date: 05/05/2017
ms.author: joroja

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
* Become familiar with the configuration language of the Identity Experience Engine and key/secrets management.
* Take ownership of scenarios and custom integrations.
* Perform methodical scenario testing.
* Follow software development and staging best practices with a minimum of one development and testing environment and one production environment.
* Stay informed about new developments from the identity providers and services you integrate with. For example, keep track of changes in secrets and of scheduled and unscheduled changes to the service.
* Set up active monitoring, and monitor the responsiveness of production environments.
* Keep contact email addresses current, and stay responsive to the Microsoft live-site team emails.
* Take timely action when advised to do so by the Microsoft live-site team. 


>[!NOTE]
>These features might eventually be included in Azure AD built-in policies, making them more accessible to all developers.

## Next steps
[Get started with custom policies](active-directory-b2c-get-started-custom.md).
