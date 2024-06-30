---
title: Compute session in Azure Machine Learning prompt flow
titleSuffix: Azure Machine Learning
description: Learn about how in Azure Machine Learning prompt flow, the execution of flows is facilitated by using compute session.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.custom:
  - ignite-2023
  - build-2024
ms.topic: conceptual
author: likebupt
ms.author: keli19
ms.reviewer: lagayhar
ms.date: 06/30/2023
---

# Compute session in prompt flow

In Azure Machine Learning prompt flow, the execution of flows is facilitated by using compute session.

## Compute sessions

In prompt flow, compute sessions serve as computing resources that enable customers to execute their flows seamlessly. A compute session is equipped with a prebuilt Docker image that includes our built-in tools, ensuring that all necessary tools are readily available for execution. Compute session is managed by Azure Machine Learning, providing users with a convenient and efficient way to execute their flows without the need to manage the underlying infrastructure.

Within the Azure Machine Learning workspace, users have the option to create a compute session using the predefined base image. This base image is set up to reference the prebuilt Docker image, providing users with a convenient and efficient way to get started. We regularly update the base image to ensure it aligns with the latest version of the Docker image. Customer can also add python packages to the base image via the `requirements.txt` file, which will be installed during the creation of the compute session and manually install them in running compute session.

For users seeking further customization, prompt flow offers the flexibility to create a custom base image. By utilizing our prebuilt Docker image as a foundation, users can easily customize their image by adding their preferred packages, configurations, or other dependencies. Once customized, the environment can be published as a custom base image within the Azure Machine Learning workspace, allowing users to create a compute session based on their custom base image.

In addition to flow execution, the compute session is also utilized to validate and ensure the accuracy and functionality of the tools incorporated within the flow, when users make updates to the prompt or code content.

## Next steps

- [Manage compute session in prompt flow](how-to-manage-compute-session.md)
