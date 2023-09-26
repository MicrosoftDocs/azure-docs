---
title: Known issue - Existing Kubernetes compute cannot be updated
titleSuffix: Azure Machine Learning
description: Updating a Kubernetes attached compute instance using the az ml attach command appears to succeed but does not.
author: s-polly
ms.author: scottpolly
ms.topic: troubleshooting  
ms.service: machine-learning
ms.subservice: core
ms.date: 08/04/2023
ms.custom: known-issue
---

# Known issue  - Existing Kubernetes compute cannot be update with `az ml compute attach` command

Updating a Kubernetes attached compute instance using the `az ml attach` command appears to succeed but does not.
 

[!INCLUDE [dev v2](../includes/machine-learning-dev-v2.md)]

**Status:** Open

**Problem area:** Inferencing

## Symptoms

When running the command `az ml compute attach --resource-group <rgname> --workspace-name <ws name> --type Kubernetes --name <existing attached compute name(aaaaa)> --resource-id "<resource URI>" --namespace <deployment name>`, the Workspace UI will display a success message indicating that the compute update was successful, however the compute will not have changed.

## Cause

The `az ml compute attach` command is not currently supported for use with Kubernetes compute. At this time, the CLI v2 and SDK v2 do not allow updating any configuration of an existing Kubernetes compute.


## Next steps

- [About known issues](azure-machine-learning-known-issues.md)
