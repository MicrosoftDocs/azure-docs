---
title: 'How to deploy pipeline as batch endpoint'
titleSuffix: Azure Machine Learning
description: Learn how to deploy pipeline component as batch endpoint to trigger the pipeline using REST endpoint
ms.reviewer: lagayhar
author: zhanxia
ms.author: zhanxia
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.date: 4/28/2023
---

After building your machine learning pipeline, you can deploy your pipeline as a REST endpoint for following scenarios:

- You want to run your pipeline from other platforms out of Azure Machine Learning (for example: custom Java code, Azure DevOps, GitHub Actions, Azure Data Factory). A REST endpoint lets you do this easily because it doesn't depend on the language.
- You want to change the logic of your endpoint without affecting the downstream consumers who use a fixed URI interface.

To deploy your pipeline as a REST endpoint, you need to first convert your pipeline into a [pipeline component](./how-to-use-pipeline-component.md), and then deploy the pipeline component as a batch endpoint. This is the equivalent feature with published pipeline/pipeline endpoint in SDK v1.

To learn how to deploy your pipeline as a batch endpoint, see this document:

[to-do: add link to how-to-use-batch-pipeline-deployment after it published]