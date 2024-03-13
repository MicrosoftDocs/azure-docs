---
title: Known issue - Existing Kubernetes compute can't be updated
titleSuffix: Azure Machine Learning
description: Updating a Kubernetes attached compute instance using the az ml attach command appears to succeed but doesn't.
author: s-polly
ms.author: scottpolly
ms.topic: troubleshooting  
ms.service: machine-learning
ms.subservice: core
ms.date: 08/04/2023
ms.custom: known-issue
---

# Known issue  - Existing Kubernetes compute can't be updated with `az ml compute attach` command

[!INCLUDE [dev v2](../includes/machine-learning-dev-v2.md)]

Updating a Kubernetes attached compute instance using the `az ml attach` command appears to succeed but doesn't.
 
**Status:** Open

**Problem area:** Inferencing

## Symptoms

When running the command `az ml compute attach --resource-group <resource-group-name> --workspace-name <workspace-name> --type Kubernetes --name <existing-attached-compute-name> --resource-id "<cluster-resource-id>" --namespace <kubernetes-namespace>`, The CLI returns a success message indicating that the compute has been successfully updated. However the compute won't be updated.

## Cause

The `az ml compute attach` command currently does not support updating existing Kubernetes compute. 


## Next steps

- [About known issues](azure-machine-learning-known-issues.md)
