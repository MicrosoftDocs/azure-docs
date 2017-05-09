---
title: 'Azure Active Directory B2C: Developer Notes on Using Custom Policies | Microsoft Docs'
description: Notes to developers configuring and maintaining B2C with Custom Policies
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
The **custom policy** feature set is now available for evaluation under public preview for all Azure Active Directory B2C (Azure AD B2C) customers.  This feature set is targeted at advanced identity developers building the most complex identity solutions.  

Today, this feature set requires the developer to configure the Identity Experience Framework (IEF) directly via XML file editing.  This method of configuration is powerful and complex.  Advanced identity developers using the IEF should plan to invest time learning by completing walk-throughs and reading reference documents. 

## Features included in this public preview
The new features introduced in the public review allow developers to perform the following tasks:
1. Author and upload custom authentication user journeys using custom policies
* Describe user journeys step-by-step as exchanges between claims providers
* Define conditional branching in user journeys
2. Integrate REST API-enabled services in your custom authentication user journeys
3. Add federation with identity providers compliant with the OpenIDConnect standard
4. Add federation with identity providers adhering to the SAML 2.0 protocol



## Terms of the public preview
1. Use of the new features is encouraged for evaluation purposes only
2. The new features are not intended for use in a production environment
3. Service level agreements (SLAs) do not apply to the new features4. Support requests can be filed through the regular support channels
5. There is no promised date for general availability
6. At our discretion, and for any reason, Microsoft may flag and reject or restrict scenarios and user journeys that exceed the scope of the Azure AD B2C product charter to serve as a customer identity and access management (CIAM) platform

## Responsibilities for custom policy feature set developers
Manual policy configuration grants lower level access to the underlying platform of Azure AD B2C and results in the creation of a unique, fully customizable trust framework.  The near infinite permutations of custom identity providers, trust relationships, integrations with external services and step-by-step workflows place greater demands on the advanced developers consuming them.
In order to fully benefit from the public preview, we suggest that developers consuming the custom policy feature set adhere to the following:
* Become familiar with the configuration language of the Identity Experience Engine (IEE) and key/secrets management
* Take ownership of scenarios and custom integrations
* Perform methodical scenario testing
* Follow software development and staging best practices with a minimum of one development/testing and one production environment
* Stay informed about new developments with the identity providers and services you integrate with, for example, keep track of changes in secrets, scheduled/unscheduled changes to the service and so on- Set up active monitoring and monitor the responsiveness of their production environments
* Keep contact emails current and stay responsive to the Microsoft live-site team emails
* Take timely action when advised to do so by the Microsoft live-site team 


>[!NOTE]
>These features may eventually be included in Azure AD built-in policies, making them more accessible to all developers.

## Next steps
[Get started with custom policies](active-directory-b2c-get-started-custom.md).
