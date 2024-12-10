---
title: Govern APIs - VS Code extension
description: API developers can use the Azure API Center extension for Visual Studio Code to govern their organization's APIs.
author: dlepow
ms.service: azure-api-center
ms.topic: how-to
ms.date: 10/16/2024
ms.author: danlep 
ms.custom: 
# Customer intent: As an API developer, I want to use my Visual Studio Code environment to check API compliance in my organization's API center.
---

# Govern APIs with the Azure API Center extension for Visual Studio Code

To maximize success of your API governance efforts, it's critical to shift-left governance early into the API development cycle. This approach allows API developers to create APIs correctly from the beginning, saving them from wasted development effort and mitigating noncompliant APIs later in the development process. 

The Azure API Center extension for Visual Studio Code includes the following governance capabilities for API developers:
 
* Evaluating API designs against API style guides as the API is developed in Visual Studio Code. 
* Early detection of breaking changes so that APIs remain reliable and function as expected, preserving the trust of end-users and stakeholders. 

API developers can also take advantage of features in the extension to [register APIs](build-register-apis-vscode-extension.md) in the API center and [discover and consume APIs](discover-apis-vscode-extension.md).

[!INCLUDE [vscode-extension-basic-prerequisites](includes/vscode-extension-basic-prerequisites.md)]  

* [Spectral extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=stoplight.spectral) - to run shift-left API design conformance checks in Visual Studio Code
* [Optic CLI](https://github.com/opticdev/optic) - to detect breaking changes between API specification documents

[!INCLUDE [vscode-extension-setup](includes/vscode-extension-setup.md)]  

## API design conformance

To ensure design conformance with organizational standards as you build APIs, the Azure API Center extension for Visual Studio Code provides integrated support for API specification linting with [Spectral](https://stoplight.io/open-source/spectral).

1. Use the **Ctrl+Shift+P** keyboard shortcut to open the Command Palette. Type **Azure API Center: Set active API Style Guide** and hit **Enter**.
2. Select one of the default rules provided, or, if your organization has a style guide already available, use **Select Local File** or **Input Remote URL** to specify the active ruleset in Visual Studio Code. Hit **Enter**.

Once an active API style guide is set, opening any OpenAPI or AsyncAPI-based specification file triggers a local linting operation in Visual Studio Code. Results are displayed both inline in the editor and in the Problems window (**View** > **Problems** or **Ctrl+Shift+M**).

:::image type="content" source="media/govern-apis-vscode-extension/local-linting.png" alt-text="Screenshot of local-linting in Visual Studio Code." lightbox="media/govern-apis-vscode-extension/local-linting.png":::

## Breaking change detection

When introducing new versions of your API, it's important to ensure that changes introduced do not break API consumers on previous versions of your API. The Azure API Center extension for Visual Studio Code makes this easy with breaking change detection for OpenAPI specification documents powered by [Optic](https://github.com/opticdev/optic).

1. Use the **Ctrl+Shift+P** keyboard shortcut to open the Command Palette. Type **Azure API Center: Detect Breaking Change** and hit **Enter**.
2. Select the first API specification document to compare. Valid options include API specifications found in your API center, a local file, or the active editor in Visual Studio Code.
3. Select the second API specification document to compare. Valid options include API specifications found in your API center, a local file, or the active editor in Visual Studio Code.

Visual Studio Code opens a diff view between the two API specifications. Any breaking changes are displayed both inline in the editor and in the Problems window (**View** > **Problems** or **Ctrl+Shift+M**).

:::image type="content" source="media/govern-apis-vscode-extension/breaking-changes.png" alt-text="Screenshot of breaking changes detected in Visual Studio Code." lightbox="media/govern-apis-vscode-extension/breaking-changes.png":::


## Related content

* [Azure API Center - key concepts](key-concepts.md)
* [Build and register APIs with the Azure API Center extension for Visual Studio Code](build-register-apis-vscode-extension.md)
* [Discover and consume APIs with the Azure API Center extension for Visual Studio Code](discover-apis-vscode-extension.md)
* [Enable and view platform API catalog in Visual Studio Code](enable-platform-api-catalog-vscode-extension.md)

