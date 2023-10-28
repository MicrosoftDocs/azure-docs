---
title: How to create and manage prompt flow runtimes
titleSuffix: Azure AI services
description: Learn how to create and manage prompt flow runtimes in Azure AI Studio.
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: how-to
ms.date: 10/1/2023
ms.author: eur
---

# How to create and manage prompt flow runtimes in Azure AI Studio

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

Prompt flow's runtime provides the computing resources required for the application to run, including a Docker image that contains all necessary dependency packages. This reliable and scalable runtime environment enables Prompt flow to efficiently execute its tasks and functions, ensuring a seamless user experience for users.

## Concepts

In prompt flow, the execution of flows is facilitated by using runtimes.

## Runtimes

In prompt flow, runtimes serve as computing resources that enable customers to execute their flows seamlessly. A runtime is equipped with a prebuilt Docker image that includes our built-in tools, ensuring that all necessary tools are readily available for execution.

Within the Azure AI project, users have the option to create a runtime using the predefined default environment. This default environment is set up to reference the prebuilt Docker image, providing users with a convenient and efficient way to get started. We regularly update the default environment to ensure it aligns with the latest version of the Docker image.

For users seeking further customization, Prompt flow offers the flexibility to create a custom execution environment. By utilizing our prebuilt Docker image as a foundation, users can easily customize their environment by adding their preferred packages, configurations, or other dependencies. Once customized, the environment can be published as a custom environment within the Azure AI project, allowing users to create a runtime based on their custom environment.

In addition to flow execution, the runtime is also utilized to validate and ensure the accuracy and functionality of the tools incorporated within the flow, when users make updates to the prompt or code content.

## Create a runtime

If you do not have a compute instance, create a new one: [Create and manage compute instance](./create-manage-compute.md).

1. Select add runtime in runtime list page.
1. Select compute instance you want to use as runtime.
    Because compute instances are isolated by user, you can only see your own compute instances or the ones assigned to you. To learn more, see [Create and manage compute instance](./create-manage-compute.md).
1. Authenticate on the compute instance. You only need to do auth one time per region in 6 month.



## Using runtime in Prompt flow authoring

When you're authoring your Prompt flow, you can select and change the runtime from left top corner of the flow page.


When performing evaluation, you can use the original runtime in the flow or change to a more powerful runtime.


## Update runtime from UI

We regularly update our base image (`mcr.microsoft.com/azureml/promptflow/promptflow-runtime-stable`) to include the latest features and bug fixes. We recommend that you update your runtime to the [latest version](https://mcr.microsoft.com/v2/azureml/promptflow/promptflow-runtime-stable/tags/list) if possible.

Every time you open the runtime details page, we'll check whether there are new versions of the runtime. If there are new versions available, you'll see a notification at the top of the page. You can also manually check the latest version by clicking the **check version** button.


Try to keep your runtime up to date to get the best experience and performance.

Go to the runtime details page and select the "Update" button at the top. Here you can update the environment to use in your runtime. If you select **use default environment**, system will attempt to update your runtime to the latest version.


> [!NOTE]
> If you used a custom environment, you need to rebuild it using the latest Prompt flow image first, and then update your runtime with the new custom environment.


## Next steps

- [Learn more about prompt flow](./prompt-flow.md)
- [Develop a flow](./flow-develop.md)
- [Develop an evaluation flow](./flow-develop-evaluation.md)