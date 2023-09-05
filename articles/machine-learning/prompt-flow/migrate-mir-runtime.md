---
title: 'Migrate managed online endpoint/deployment runtime to compute instance or serverless runtime'
titleSuffix: Azure Machine Learning
description: Migrate managed online endpoint/deployment runtime to compute instance or serverless runtime
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

From **Sep 2013**, we will stop the creation for managed online endpoint/deployment as runtime, the existing runtime will still be supported until **Nov 2023**.

## Migrate to compute instance runtime

If the existing managed online endpoint/deployment runtime is using by your self, didn't share with other users, you can migrate to compute instance runtime.
- Create compute instance yourself or ask the workspace admin to create one for you.
- Using the compute instance to create a runtime for you. You reuse the custom environment of the existing managed online endpoint/deployment runtime.

## Migrate to automatic runtime

If the existing managed online endpoint/deployment runtime is shared with other users, you instead of create compute instance runtime for everyone. You can also try the new automatic runtime which can be used in every workspace.

Using automatic runtime, you didn't need to explicitly managed compute resource and environment. Each flow can specify python dependency in `requirements.txt` in `flow.dag.yaml`. You can also change instance type when submit the flow. Prompt flow will try best to reuse the compute session if they requirement the same instance type and python dependency.

If the compute resource is idle for 30 minutes, it will be automatically clean up. Other ueers can reuse the compute resource.

## Next steps

For more information, see the documentation here:
* [Customize environment for runtime](how-to-customize-environment-runtime.md)
* [Create and manage runtimes](how-to-create-manage-runtime.md)