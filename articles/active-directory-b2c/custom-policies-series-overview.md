---
title: Create and run your own custom policies in Azure Active Directory B2C
titleSuffix: Azure AD B2C
description: Learn how to create and run your own custom policies in Azure Active Directory B2C. Learn how to create Azure Active Directory B2C custom policies from scratch in a how-to guide series.

author: kengaderdus
manager: CelesteDG

ms.service: active-directory

ms.topic: how-to
ms.custom: b2c-docs-improvements
ms.date: 11/06/2023
ms.author: kengaderdus
ms.reviewer: yoelh
ms.subservice: B2C
---

# Create and run your own custom policies in Azure Active Directory B2C 

In Azure Active Directory B2C (Azure AD B2C), you can create user experiences by using [user flows or custom policies](user-flow-overview.md). You use custom policies when you want to create your own user journeys for complex identity experience scenarios that aren't supported by user flows.

User flows are already customizable such as [changing UI](customize-ui.md), [customizing language](language-customization.md) and using [custom attributes](user-flow-custom-attributes.md). However, these customizations might not cover all your business specific needs, which is the reason why you need custom policies.   

While you can use pre-made [custom policy starter pack](./tutorial-create-user-flows.md?pivots=b2c-custom-policy#custom-policy-starter-pack), it's important for you understand how custom policy is built from scratch. In this how-to guide series, you learn what you need to understand for you to customize the behavior of your user experience by using custom policies. At the end of this how-to guide series, you should be able to read and understand existing custom policies or write your own from scratch.

## Prerequisites

- You already understand how to use Azure AD B2C user flows. If you haven't already used user flows, [learn how to Create user flows and custom policies in Azure Active Directory B2C](tutorial-create-user-flows.md?pivots=b2c-user-flow). This how-to guide series is intended for identity app developers who want to leverage the power of Azure AD B2C custom policies to achieve any authentication flow experience.    

## Select an article 

This how-to guide series consists of multiple articles. We recommend that you start this series from the first article. For each article (except the first one), you're expected to use the custom policy you write in the preceding article.

|Article  | What you'll learn  |
|---------|---------|
|[Write your first Azure Active Directory B2C custom policy - Hello World!](custom-policies-series-hello-world.md) | Write your first Azure AD B2C custom policy. You return the message *Hello World!* in the JWT token. |
|[Collect and manipulate user inputs by using Azure AD B2C custom policy](custom-policies-series-collect-user-input.md) | Learn how to collect inputs from users, and how to manipulate them.|
|[Validate user inputs by using Azure Active Directory B2C custom policy](custom-policies-series-validate-user-input.md) | Learn how to validate user inputs by using techniques such as limiting user input options, regular expressions, predicates, and validation technical profiles|
|[Create branching in user journey by using Azure Active Directory B2C custom policy](custom-policies-series-branch-user-journey.md) | Learn how to create different user experiences for different users based on the value of a claim.|
|[Validate custom policy files by using TrustFrameworkPolicy schema](custom-policies-series-install-xml-extensions.md)| Learn how to validate your custom files against a custom policy schema. You also learn how to easily navigate your policy files by using Azure AD B2C Visual Studio Code (VS Code) extension.|
|[Call a REST API by using Azure Active Directory B2C custom policy](custom-policies-series-call-rest-api.md)| Learn how to write a custom policy that integrates with your own RESTful service.|
|[Create and read a user account by using Azure Active Directory B2C custom policy](custom-policies-series-store-user.md)| Learn how to store into and read user details from Microsoft Entra ID storage by using Azure AD B2C custom policy. You use the Microsoft Entra ID technical profile.|
|[Set up a sign-up and sign-in flow by using Azure Active Directory B2C custom policy](custom-policies-series-sign-up-or-sign-in.md). | Learn how to configure a sign-up and sign-in flow for a local account(using email and password) by using Azure Active Directory B2C custom policy. You show a user a sign-in interface for them to sign in by using their existing account, but they can create a new account if they don't already have one.|
| [Set up a sign-up and sign-in flow with a social account by using Azure Active Directory B2C custom policy](custom-policies-series-sign-up-or-sign-in-federation.md) | Learn how to configure a sign-up and sign-in flow for a social account, Facebook. You also learn to combine local and social sign-up and sign-in flow.|

## Next steps 

- Learn about [Azure AD B2C TrustFrameworkPolicy BuildingBlocks](buildingblocks.md)
 
- [Write your first Azure Active Directory B2C custom policy - Hello World!](custom-policies-series-hello-world.md)
