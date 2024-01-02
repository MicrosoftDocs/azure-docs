---
title: Known issue - After a workspace move, creating a compute instance with the same name as a previous compute instance will fail
titleSuffix: Azure Machine Learning
description: After moving a workspace to a different subscription or resource group, creating a compute instance with the same name as a previous compute instance will fail with an Etag conflict error.
author: s-polly
ms.author: scottpolly
ms.topic: troubleshooting  
ms.service: machine-learning
ms.subservice: core
ms.date: 08/14/2023
ms.custom: known-issue
---

# Known issue  - Creating compute instance after a workspace move results in an Etag conflict error.

[!INCLUDE [dev v2](../includes/machine-learning-dev-v2.md)]

After a moving a workspace to a different subscription or resource group, creating a compute instance with the same name as a previous compute instance will fail with an Etag conflict error.


**Status:** Open

**Problem area:** Compute

## Symptoms

After a workspace move, creating a compute instance with the same name as a previous compute instance will fail due to an Etag conflict error.

When you make a workspace move the compute resources aren't moved to the target subscription. However, you can't use the same compute instance names that you were using previously. 


## Solutions and workarounds

To resolve this issue, use a different name for the compute instance.

## Next steps

- [About known issues](azure-machine-learning-known-issues.md)
