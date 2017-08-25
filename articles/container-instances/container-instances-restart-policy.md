---
title: Run-to-completion containers in Azure Container Instances
description: Learn how to use a restart policy to run short-lived containerized applications in Azure Container Instances.
services: container-instances
documentationcenter: ''
author: mmacy
manager: timlt
editor: ''
tags:
keywords: ''

ms.assetid:
ms.service: container-instances
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/30/2017
ms.author: marsma
ms.custom: mvc
---

# Run short-lived containers in Azure Container Instances

The ease and speed of deploying containers in Azure Container Instances provides a compelling scenario for executing short-running tasks like build jobs in a container instance. With a configurable restart policy, you can ensure your containers are always restarted, or are decommissioned when their tasks have completed successfully. Because Azure Container instances are billed by the second, you're charged only for the compute resources used while your task is actively running.

## Container restart policy

When you create a container in Azure Container Instances, you can specify one of three restart policy settings:

| Restart policy   | Description |
| ---------------- | :---------- |
| **Always** (default) | Containers in the container group are always restarted. This is the default setting applied when no restart policy is specified at container creation. |
| **Never** | Containers in the container group are never restarted. The containers run at most once. |
| **OnFailure** | Containers in the container group are restarted only when a failure is detected in the application hosted on the container. The containers are run at least once. **TODO**: Note what constitutes a failed application (non-zero exit code? other?). |

## Specify a restart policy

The method by which you specify a restart policy depends on how you create your containers, such as with the Azure CLI, PowerShell, or the Azure portal. Examples are shown below for each of these methods.

* Azure CLI

  ```azurecli-interactive
  az container create \
      --name mycontainer \
      --image microsoft/aci-helloworld \
      --resource-group myResourceGroup \
      --ip-address public
      --restart-policy OnFailure
  ```

* PowerShell

  ```powershell
  New-AzureRmContainer -ResourceGroupName myResourceGroup -Name mycontainer -Image microsoft/aci-helloworld -IpAddress public -RestartPolicy OnFailure
  ```

* Azure portal

  screenshot1

## Next steps

Go here next...