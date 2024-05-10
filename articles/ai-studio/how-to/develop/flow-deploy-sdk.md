---
title: How to deploy a flow with the AzureML SDK
titleSuffix: Azure AI Studio
description: This article provides instructions on how to deploy a flow with the AzureML SDK.
manager: nitinme
ms.service: azure-ai-studio
ms.topic: how-to
ms.date: 5/21/2024
ms.reviewer: dantaylo
ms.author: eur
author: eric-urban
---

# Deploy a flow with the AzureML SDK

[!INCLUDE [Feature preview](../../includes/feature-preview.md)]

Prompt flow deployments are hosted within an endpoint, and can receive data from clients and send responses back in real-time.

You can invoke the endpoint for real-time inference for chat, copilot, or another generative AI application. Prompt flow supports endpoint deployment from a flow, or from a bulk test run.

In this article, you learn how to deploy a flow as a managed online endpoint for real-time inference. The steps you take are:

- Test your flow and get it ready for deployment.
- Create an online deployment.
- Grant permissions to the endpoint.
- Test the endpoint.
- Consume the endpoint.

## Related content

- [Get started building a chat app using the prompt flow SDK](../../quickstarts/get-started-code.md)
- [Work with projects in VS Code](vscode.md)
