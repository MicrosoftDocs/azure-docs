---
title: Prompt Flow community ecosystem (preview)
titleSuffix: Azure Machine Learning
description: Introduction to the Prompt flow community ecosystem, which includes the SDK and VS Code extension.
services: machine-learning
ms.service: machine-learning
ms.subservice: prompt-flow
ms.topic: conceptual
author: jiaochenlu
ms.author: chenlujiao
ms.reviewer: lagayhar
ms.date: 09/12/2023
---

# Prompt Flow community ecosystem (preview)

The Prompt Flow community ecosystem aims to provide a comprehensive set of tools and resources for developers who want to leverage the power of Prompt Flow to experimentally tune their prompts and develop their LLM-based application in a local environment. This article goes through the key components of the ecosystem, including the **Prompt Flow SDK** and the **VS Code extension**.

> [!IMPORTANT]
> Prompt flow is currently in public preview. This preview is provided without a service-level agreement, and are not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prompt flow SDK/CLI

The Prompt Flow SDK/CLI empowers developers to use code manage credentials, initialize flows, develop flows, and execute batch testing and evaluation of prompt flows locally.

It's designed for efficiency, allowing simultaneous trigger of large dataset-based flow tests and metric evaluations. Additionally, the SDK/CLI can be easily integrated into your CI/CD pipeline, automating the testing process.

To get started with the Prompt Flow SDK, explore and follow the [SDK quick start notebook](https://github.com/microsoft/promptflow/blob/main/examples/tutorials/get-started/quickstart.ipynb) in steps.

## VS Code extension

The ecosystem also provides a powerful VS Code extension designed for enabling you to easily and interactively develop prompt flows, fine-tune your prompts, and test them with a user-friendly UI.

:::image type="content" source="./media/community-ecosystem/prompt-flow-vs-code-extension-flatten.png" alt-text="Screenshot of the Prompt flow extension in the VS Code showing the UI. "lightbox = "./media/community-ecosystem/prompt-flow-vs-code-extension-flatten.png":::

To get started with the Prompt Flow VS Code extension, navigate to the extension marketplace to install and read the details tab.

:::image type="content" source="./media/community-ecosystem/prompt-flow-vs-code-extension.png" alt-text="Screenshot of the Prompt flow extension in the VS Code marketplace. "lightbox = "./media/community-ecosystem/prompt-flow-vs-code-extension.png":::

## Transition to production in cloud

After successful development and testing of your prompt flow within our community ecosystem, the subsequent step you're considering may involve transitioning to a production-grade LLM application. We recommend Azure Machine Learning for this phase to ensure security, efficiency, and scalability.

You can seamlessly shift your local flow to your Azure resource to leverage large-scale execution and management in the cloud. To achieve this, see [Integration with LLMOps](how-to-integrate-with-llm-app-devops.md#go-back-to-studio-ui-for-continuous-development).

## Community support

The community ecosystem thrives on collaboration and support. Join the active community forums to connect with fellow developers, and contribute to the growth of the ecosystem.

[GitHub Repository: promptflow](https://github.com/microsoft/promptflow)

For questions or feedback, you can [open GitHub issue directly](https://github.com/microsoft/promptflow/issues/new) or reach out to pf-feedback@microsoft.com.

## Next steps

The prompt flow community ecosystem empowers developers to build interactive and dynamic prompts with ease. By using the Prompt Flow SDK and the VS Code extension, you can create compelling user experiences and fine-tune your prompts in a local environment.

- Join the [Prompt flow community on GitHub](https://github.com/microsoft/promptflow).
