---
title: Troubleshoot Azure Enclave
description: Troubleshoot steps for Azure Enclave.
author: jadean-msft
ms.author: jadean
ms.topic: overview
ms.service: azure-enclave
ms.date: 9/30/2025
---

# Troubleshoot Azure Enclave

The following are examples of errors that might be encountered and their solution.

## General troubleshooting
The general troubleshooting steps that aren't specific to an Azure Enclave resource.

### Portal Links don't work in the Air Gapped Azure environments
Azure Enclave portal links (for example, **Learn More**) don't work in some Azure clouds.

Solution: Those documentation links work on Azure and Azure for US Government. Documentation with the same article name can be found in the Learn portal for each cloud.

## Community Troubleshooting
The community troubleshooting steps that are specific to the Azure Enclave community resource.

### API error when creating first community

Scenario: Create a community for the first time in a new subscription, the following error message blocks the deployment

`"The resource type could not be found in the namespace 'Microsoft.Mission' for api version '<api-version>'."`

Solution: Ensure `Microsoft.Mission` is registered in your subscription. Follow [Get started with Azure Enclave](./onboard.md) to verify resource provider registration and required permissions, and then retry the deployment.

## Workloads

### User has permissions to write but not permissions to do something else
If the permission that was denied is one of the permissions included in the actions protected by [maintenance mode](./maintenance-mode.md) like `Microsoft.Network/virtualNetwork/subnets/join/action` this is a good indicator that maintenance mode should be enabled and then you can try again.
