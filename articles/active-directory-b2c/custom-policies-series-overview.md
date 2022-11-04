---
title: Create and run your own custom policies in Azure Active Directory B2C
titleSuffix: Azure AD B2C
description: Learn how to create and run your own custom policies in Azure Active Directory B2C. Learn how to create Azure Active Directory B2C custom policies from scratch in a how-to guide series.
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.custom: b2c-docs-improvements
ms.date: 12/30/2022
ms.author: kengaderdus
ms.subservice: B2C
---

# Create and run your own custom policies in Azure Active Directory B2C 

In Azure Active Directory B2C (Azure AD B2C), you can create user experiences by using [user flows or custom policies](user-flow-overview.md). You use custom policies when you want to create your own user journeys for complex identity experience scenarios that aren't supported by user flows.

User flows are already customizable such as [changing UI](customize-ui.md), [customizing language](language-customization.md) and using [custom attributes](user-flow-custom-attributes.md). However, these customizations might not cover all your business specific needs, which is the reason why you need custom policies.   

While you can use pre-made [custom policy starter pack](/tutorial-create-user-flows.md?pivots=b2c-custom-policy#custom-policy-starter-pack), it's important for you understand how custom policy are built from scratch. In this how-to guide series, you'll learn all you need to customize the behavior of your user experience by using custom policies. 

## Prerequisites

- You already understand how to use Azure AD B2C user flows. If you haven't already used user flows, [learn how to Create user flows and custom policies in Azure Active Directory B2C](tutorial-create-user-flows.md?pivots=b2c-user-flow). This how-to guide series is intended for identity app developers who want to leverage the power of Azure AD B2C custom policies to achieve almost any authentication flow experience.    

## Select an article 

This how-to guide series consists of multiple articles. We recommend that you start this series from the fist article. For each article (except the first one), you're expected to use the custom policy you write in the preceding article.

|Article  | What you'll learn  |
|---------|---------|
|[Write your first Azure AD B2C custom policy - Hello World!](custom-policies-series-hello-world.md) | Write your first Azure AD B2C custom policy. You'll return the message *Hello World!* in the JWT token. |
|[Collect and manipulate user inputs by using Azure AD B2C custom policy](custom-policies-series-collect-user-input.md) | Learn how to collect inputs from users, and how to manipulate them.|
|[Validate user inputs by using Azure AD B2C custom policy](custom-policies-series-validate-user-input.md) | Learn how to validate user inputs by using techniques such as limiting user input options, regular expressions, predicates, and validation technical profiles|
|[Create branching in user journey by using Azure AD B2C custom policy](custom-policies-series-branch-in-user-journey-using-pre-conditions.md) | Learn how to create different user experiences for different users based on the value of a claim.|
|[Validate custom policy files by using TrustFrameworkPolicy schema](custom-policies-series-install-xml-extensions.md)| Learn how to validate your custom files against a custom policy schema. You also learn how to easily navigate your policy files by using Azure AD B2C Visual Studio Code (VS Code) extension.|
|[Call a REST API by using Azure AD B2C custom policy](custom-policies-series-call-rest-api.md)| Learn how to write a custom policy that integrates with your own RESTful service.|
|[Create a user record by using Azure AD B2C custom policy](custom-policies-series-store-user.md)| Learn how to store user details into Azure AD storage by using Azure AD B2C custom policy. You'll use the Azure Active Directory Technical profile.|
|[Read or update a user record by using Azure AD B2C custom policy](custom-policies-series-read-update-user.md)| Learn how to read or update user details in Azure AD storage by using Azure AD B2C custom policy. You'll use the Azure Active Directory Technical profile.|


## Next steps 

- Learn about [Azure AD B2C TrustFrameworkPolicy BuildingBlocks](buildingblocks.md)
 
- [Write your first Azure AD B2C custom policy - Hello World!](custom-policies-series-hello-world.md)

 