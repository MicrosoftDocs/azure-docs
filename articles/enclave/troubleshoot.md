---
title: Troubleshoot Azure Enclave
description: Troubleshoot steps for Azure Enclave.
author: jadean-msft
ms.author: jadean
ms.topic: overview
ms.service: azure-enclave
ai-usage: ai-assisted
ms.date: 10/14/2026
---

# Troubleshoot Azure Enclave

Use the following guidance to troubleshoot common Azure Enclave issues.

## General troubleshooting

### Portal links don't work in the air-gapped Azure clouds
Azure Enclave portal links (for example, **Learn More**) don't work in some Azure clouds.

Solution: Those documentation links work on Azure and Azure for US Government. You can find documentation with the same article name in the Learn portal for each cloud.

## Community troubleshooting

### API error when creating a community

If a community deployment returns this error message:

`The resource type could not be found in the namespace 'Microsoft.Mission' for api version '<api-version>'.`

Check that the deployment uses an API version supported by the runtime.

## Workload troubleshooting

### Authorization error when an operation is denied

If an operation fails with an authorization error, identify the denied action in the error. To perform `Microsoft.Network/virtualNetworks/subnets/join/action`, the caller must have the required RBAC permission and be listed as an excluded principal in a General or Advanced maintenance mode configuration. This requirement applies across currently served Azure Enclave API versions, including `2026-05-01-preview` and later. For more information, see [maintenance mode](./maintenance-mode.md).
