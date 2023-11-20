---
title: Validate custom policy files by using TrustFrameworkPolicy schema  
titleSuffix: Azure AD B2C
description: Learn how to validate custom policy files by using TrustFrameworkPolicy schema and other XML extensions for Visual Studio code. You also learn to navigate custom policy file by using Azure AD B2C extension.       

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

# Validate custom policy files by using TrustFrameworkPolicy schema  

You can improve your productivity when editing or writing custom policy files by validating your files before you upload them. You can let Azure Active Directory B2C (Azure AD B2C) to validate the XML policy files when you upload them, but most errors cause the upload to fail. An example of invalid policy file is improperly formatted XML.

It's essential to use a good XML editor such as [Visual Studio Code (VS Code)](https://code.visualstudio.com/). We recommend using VS Code as it allows you to install XML extension, such as [XML Language Support by Red Hat](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-xml). A good XML editor together with extra XML extension allows you to color-codes content, pre-fills common terms, keeps XML elements indexed, and can validate against an XML schema. 

To validate custom policy files, we provide a custom policy XML schema. You can download the schema by using the link `https://raw.githubusercontent.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/master/TrustFrameworkPolicy_0.3.0.0.xsd` or refer to it from your editor by using the same link. You can also use Azure AD B2C extension for VS Code to quickly navigate through Azure AD B2C policy files, and many other functions. Lean more about [Azure AD B2C extension for VS Code](https://marketplace.visualstudio.com/items?itemName=AzureADB2CTools.aadb2c).

In this article, you learn how to: 

- Use custom policy XML schema to validate policy files. 
- Use Azure AD B2C extension for VS Code to quickly navigate through your policy files.

## Prerequisites

- You must have [Visual Studio Code (VS Code)](https://code.visualstudio.com/) installed in your computer. 

- A custom policy file such as the one we used in [Validate user inputs by using Azure AD B2C custom policy](custom-policies-series-validate-user-input.md). This article is a part of [Create and run your own custom policies how-to guide series](custom-policies-series-overview.md).         

[!INCLUDE [active-directory-b2c-app-integration-call-api](../../includes/active-directory-b2c-common-note-custom-policy-how-to-series.md)]

## Use TrustFrameworkPolicy schema

TrustFrameworkPolicy schema is a custom policy XML schema that allows you to validate policy files:

1. Install [XML extension support by Red Hat](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-xml) in your VS Code editor

1. Follow the steps in [Troubleshoot policy validity](troubleshoot.md?pivots=b2c-custom-policy#troubleshoot-policy-validity) to set up fileAssociations your VS Code editor. The instructions also include the procedure to validate your policy file.

## Use Azure AD B2C extension    

Azure AD B2C extension  allows you to understand the organization of your policy files easily. For example, the custom policy explorer allows you to see the custom policy elements you've used and to move to them quickly. 

1. Install [Azure AD B2C extension](https://marketplace.visualstudio.com/items?itemName=AzureADB2CTools.aadb2c) in your VS Code editor 

1. Follow the guidance provided in [Azure AD B2C extension](https://marketplace.visualstudio.com/items?itemName=AzureADB2CTools.aadb2c) to learn how to use Azure AD B2C extension.

> [!NOTE] 
> The community has developed the VS Code extension for Azure AD B2C to help identity developers. The extension is not supported by Microsoft and is made available strictly as-is.

## Next steps

Next, learn:

- How to [Troubleshoot Azure AD B2C custom policies](troubleshoot.md?pivots=b2c-custom-policy).

- How to make [Call a REST API by using Azure AD B2C custom policy](custom-policies-series-call-rest-api.md).