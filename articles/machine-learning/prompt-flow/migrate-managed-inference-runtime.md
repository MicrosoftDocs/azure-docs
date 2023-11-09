---
title: Migrate managed online endpoint/deployment runtime to compute instance or serverless runtime
titleSuffix: Azure Machine Learning
description: Migrate managed online endpoint/deployment runtime to compute instance or serverless runtime.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
author: cloga
ms.author: lochen
ms.reviewer: lagayhar
ms.date: 08/31/2023

---

# Deprecation plan for managed online endpoint/deployment runtime

Managed online endpoint/deployment as runtime is deprecated. We recommend you migrate to compute instance or serverless runtime.

From **September 2023**, we'll stop the creation for managed online endpoint/deployment as runtime, the existing runtime will still be supported until **November 2023**.

## Migrate to compute instance runtime

If the existing managed online endpoint/deployment runtime is used by yourself and you didn't share with other users, you can migrate to compute instance runtime.

- Create compute instance yourself or ask the workspace admin to create one for you. To learn more, see [Create and manage an Azure Machine Learning compute instance](../how-to-create-compute-instance.md).
- Using the compute instance to create a runtime. You can reuse the custom environment of the existing managed online endpoint/deployment runtime. To learn more, see [Customize environment for runtime](how-to-customize-environment-runtime.md).

## Next steps

- [Customize environment for runtime](how-to-customize-environment-runtime.md)
- [Create and manage runtimes](how-to-create-manage-runtime.md)
