---
title: Validate custom policy files by using Azure AD B2C extension 
titleSuffix: Azure AD B2C
description: Learn how to validate custom policy files by using Azure AD B2C extension and other XML extensions for Visul Studio code       
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.custom: b2c-docs-improvements
ms.date: 10/30/2022
ms.author: kengaderdus
ms.subservice: B2C
---

# Validate custom policy files by using Azure AD B2C extension 

You can improve your productivity when editing or writing custom policy files by validating your files before you upload them. You can let Azure Active Directory B2C (Azure AD B2C) to validate the XML policy files when you upload them, but most errors cause the upload to fail. An example of invalid policy file is improperly formatted XML.

It's essential to use a good XML editor such as [Visual Studio Code (VS Code)](https://code.visualstudio.com/). We recommend using VS Code as it allows you to install XML extension, such as [XML Language Support by Red Hat](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-xml). A good XML editor together with extra XML extension allows you to color-codes content, pre-fills common terms, keeps XML elements indexed, and can validate against an XML schema. 


To validate custom policy files, we provide a custom policy XML schema. You can download the schema by using the link `https://raw.githubusercontent.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/master/TrustFrameworkPolicy_0.3.0.0.xsd` or refer to it from your editor by using the same link. You can also use Azure AD B2C extension for VS Code to quickly navigate through Azure AD B2C policy files, and many other functions. Lean more about [Azure AD B2C extension for VS Code](https://marketplace.visualstudio.com/items?itemName=AzureADB2CTools.aadb2c).

In this article, you'll learn how to: 

- Use custom policy XML schema to validate policy files. 
- Use Azure AD B2C extension for VS Code to quickly navigate through your policy files.

## Prerequisites

- You must have [Visual Studio Code (VS Code)](https://code.visualstudio.com/) installed in your computer. 

- A custom policy file such as the one we used in [Validate user inputs by using Azure AD B2C custom policy](custom-policies-series-validate-user-input.md). This article is a part of [Create and run your own custom policies how-to guide series](custom-policies-series-overview.md).         




extensions:
- Azure AD B2C extension(smart copy & paste, custom policy explorer, policy settings) - 
- Azure AD B2C xml schema 
- XML by Red Hat - provides fileassociation 



Use the procedure here https://learn.microsoft.com/en-us/azure/active-directory-b2c/troubleshoot?pivots=b2c-custom-policy#upload-policies-and-policy-validation to do file associations  

Ask Jas how to get the suggestions as sen in custom policies 