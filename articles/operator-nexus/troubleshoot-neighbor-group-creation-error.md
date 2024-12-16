---
title: "Azure Operator Nexus: Can't create Neighbor Groups"
description: Learn how to troubleshoot Neighbor Group creation issues.
author: benhurj
ms.author: bejohnson
ms.service: azure-operator-nexus
ms.custom: azure-operator-nexus
ms.topic: troubleshooting
ms.date: 11/12/2024
# ms.custom: template-include
---

# Overview

During the creation of Neighbor Group resources in the Azure portal, an AuthorizationFailed error for the Microsoft.Resources/deployments/action permission might occur. The portal adds an empty ipv6 addresses array by default in some circumstances.

## Diagnosis

### Immediate Symptoms
* An attempt is made to create Neighbor Group resources for Network Packet Broker (NPB) using the portal. The creation of Neighbor Groups is successful when using the az CLI.
* An authorization error is received: The user doesn't have access for authorization to perform action `'Microsoft.Resources/deployments/action' over scope '/subscriptions/********-****-****-****-************/providers/Microsoft.Resources/deployments/register' or the scope is invalid. If access was recently granted, please refresh your credentials. (Code: AuthorizationFailed) [ Error code: AuthorizationFailed ]'`.
* An attempt is made to grant access to the action Microsoft.Resources/deployments/action, but this permission isn't valid in Azure.

### Troubleshooting
* Enabling Network Tap Rule from the portal is also failing.
* Upon inspection, the Neighbor Group shows that certain fields are being set when not specified. For example, only the IPv4 address was specified, but the `ipv6Addresses` field is also being set.

## Mitigation steps

Follow these steps for mitigation.

### Use Az CLI to deploy the resource
* Inspect the existing deployment and locate the template used
* Copy it into an ARM template file
* Remove empty IPv6 address array from it
* Leave parameters as they are before

  ```bash
  az deployment group create \
  --resource-group <resource-group-name> \
  --template-file <template-file> \
  --parameters <parameters-file>
  ```

## Verification

Check the portal to see whether the resource was created as expected.

## Related content

- If you still have questions, contact [Azure support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
- For more information about support plans, see [Azure support plans](https://azure.microsoft.com/support/plans/response/).
