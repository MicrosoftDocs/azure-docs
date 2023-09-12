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

From **September 2013**, we'll stop the creation for managed online endpoint/deployment as runtime, the existing runtime will still be supported until **November 2023**.

## Migrate to compute instance runtime

If the existing managed online endpoint/deployment runtime is used by yourself and you didn't share with other users, you can migrate to compute instance runtime.

- Create compute instance yourself or ask the workspace admin to create one for you.
- Using the compute instance to create a runtime. You can reuse the custom environment of the existing managed online endpoint/deployment runtime.

## Migrate to automatic runtime

If the existing managed online endpoint/deployment runtime is shared with other users, you must create a compute instance runtime for everyone. You can also try the new automatic runtime, which can be used in every workspace.

When using the automatic runtime, you don't need to explicitly manage compute resource and environment. Each flow can specify python dependency in `requirements.txt` in `flow.dag.yaml`. You can also change the instance type when submitting the flow. Prompt flow will try its best to reuse the compute session if it requires the same instance type and python dependency.

If the compute resource is idle for 30 minutes, it will automatically clean up. Other users can reuse the compute resource.

## Next steps

- [Customize environment for runtime](how-to-customize-environment-runtime.md)
- [Create and manage runtimes](how-to-create-manage-runtime.md)