---
title: Runtimes in Azure Machine Learning prompt flow (preview)
titleSuffix: Azure Machine Learning
description: Learn about how in Azure Machine Learning prompt flow, the execution of flows is facilitated by using runtimes.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
author: likebupt
ms.author: keli19
ms.reviewer: lagayhar
ms.date: 06/30/2023
---

# Runtimes in Prompt flow (preview)

In Azure Machine Learning prompt flow, the execution of flows is facilitated by using runtimes.

> [!IMPORTANT]
> Prompt flow is currently in public preview. This preview is provided without a service-level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Runtimes

In prompt flow, runtimes serve as computing resources that enable customers to execute their flows seamlessly. A runtime is equipped with a prebuilt Docker image that includes our built-in tools, ensuring that all necessary tools are readily available for execution.

Within the Azure Machine Learning workspace, users have the option to create a runtime using the predefined default environment. This default environment is set up to reference the prebuilt Docker image, providing users with a convenient and efficient way to get started. We regularly update the default environment to ensure it aligns with the latest version of the Docker image.

For users seeking further customization, Prompt flow offers the flexibility to create a custom execution environment. By utilizing our prebuilt Docker image as a foundation, users can easily customize their environment by adding their preferred packages, configurations, or other dependencies. Once customized, the environment can be published as a custom environment within the Azure Machine Learning workspace, allowing users to create a runtime based on their custom environment.

In addition to flow execution, the runtime is also utilized to validate and ensure the accuracy and functionality of the tools incorporated within the flow, when users make updates to the prompt or code content.

## Next steps

- [Create runtimes](how-to-create-manage-runtime.md)
