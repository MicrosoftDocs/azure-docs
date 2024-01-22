---
title: Prompt flow ecosystem
titleSuffix: Azure Machine Learning
description: Introduction to the prompt flow ecosystem, which includes the prompt flow open source project, tutorials, SDK, CLI and VS Code extension.
services: machine-learning
ms.service: machine-learning
ms.subservice: prompt-flow
ms.custom:
  - ignite-2023
ms.topic: conceptual
author: jiaochenlu
ms.author: chenlujiao
ms.reviewer: lagayhar
ms.date: 11/06/2023
---

# Prompt flow ecosystem

The prompt flow ecosystem aims to provide a comprehensive set of tutorials, tools and resources for developers who want to leverage the power of prompt flow to experimentally tune their prompts and develop their LLM-based application in pure local environment, without any dependencies on Azure resources binding. This article provides an overview of the key components within the ecosystem, which include:
 - **Prompt flow open source project** in GitHub.
 - **Prompt flow SDK and CLI** for seamless flow execution and integration with CI/CD pipeline.
 - **VS Code extension** for convenient flow authoring and development within a local environment.

## Prompt flow SDK/CLI

The prompt flow SDK/CLI empowers developers to use code manage credentials, initialize flows, develop flows, and execute batch testing and evaluation of prompt flows locally.

It's designed for efficiency, allowing simultaneous trigger of large dataset-based flow tests and metric evaluations. Additionally, the SDK/CLI can be easily integrated into your CI/CD pipeline, automating the testing process.

To get started with the prompt flow SDK, explore and follow the [SDK quick start notebook](https://github.com/microsoft/promptflow/blob/main/examples/tutorials/get-started/quickstart.ipynb) in steps.

## VS Code extension

The ecosystem also provides a powerful VS Code extension designed for enabling you to easily and interactively develop prompt flows, fine-tune your prompts, and test them with a user-friendly UI.

:::image type="content" source="./media/community-ecosystem/prompt-flow-vs-code-extension-flatten.png" alt-text="Screenshot of the prompt flow extension in the VS Code showing the UI. "lightbox = "./media/community-ecosystem/prompt-flow-vs-code-extension-flatten.png":::

To get started with the prompt flow VS Code extension, navigate to the extension marketplace to install and read the details tab.

:::image type="content" source="./media/community-ecosystem/prompt-flow-vs-code-extension.png" alt-text="Screenshot of the prompt flow extension in the VS Code marketplace. "lightbox = "./media/community-ecosystem/prompt-flow-vs-code-extension.png":::

## Transition to production in cloud

After successful development and testing of your prompt flow within our community ecosystem, the subsequent step you're considering might involve transitioning to a production-grade LLM application. We recommend Azure Machine Learning for this phase to ensure security, efficiency, and scalability.

You can seamlessly shift your local flow to your Azure resource to leverage large-scale execution and management in the cloud. To achieve this, see [Integration with LLMOps](how-to-integrate-with-llm-app-devops.md#go-back-to-studio-ui-for-continuous-development).

## Community support

The community ecosystem thrives on collaboration and support. Join the active community forums to connect with fellow developers, and contribute to the growth of the ecosystem.

[GitHub Repository: promptflow](https://github.com/microsoft/promptflow)

For questions or feedback, you can [open GitHub issue directly](https://github.com/microsoft/promptflow/issues/new) or reach out to pf-feedback@microsoft.com.


## Next steps

The prompt flow community ecosystem empowers developers to build interactive and dynamic prompts with ease. By using the prompt flow SDK and the VS Code extension, you can create compelling user experiences and fine-tune your prompts in a local environment.

- Join the [prompt flow community on GitHub](https://github.com/microsoft/promptflow).
