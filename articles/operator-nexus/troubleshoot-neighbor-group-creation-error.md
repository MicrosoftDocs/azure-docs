---
title: "Azure Operator Nexus: Cannot create Neighbor Group(s)"
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

The user faces issues creating Neighbor Group resources in the Azure portal due to an AuthorizationFailed error for the Microsoft.Resources/deployments/action permission, which appears invalid. Additionally, the portal adds an empty ipv6Addresses array by default, causing further errors.

## Diagnosis

* Customer tries to create Neighbor Group resources for NPB using the portal. Note that creation of Neighbor Groups is successful when using the az cli.
* The following authorization error is receieved `The user does not have access for authorization to perform action 'Microsoft.Resources/deployments/action' over scope '/subscriptions/12768799-47d2-4435-aad8-c263bf62be01/providers/Microsoft.Resources/deployments/register' or the scope is invalid. If access was recently granted, please refresh your credentials. (Code: AuthorizationFailed) [ Error code: AuthorizationFailed ]'`
* Customer tries to grant access to the action `Microsoft.Resources/deployments/action` however this is not a valid permission according to Azure
* Customer is also failing to enable Network Tap Rule from the portal
* Inspecting the Neighbor Group shows that certain fields are being set when not specified, for example the customer only specified ipv4 address, but the `ipv6Addresses` field is being set.

## Mitigation steps

Follow these steps for mitigation.

### Use Az CLI to deploy the resource

  ```bash
  az deployment group create \
  --resource-group <resource-group-name> \
  --template-file <template-file.json or .bicep> \
  --parameters <parameters-file.json>
  ```

## Verification

Check the portal to see whether the resource has been created as expected.

## Related content

- If you still have questions, contact [Azure support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
- For more information about support plans, see [Azure support plans](https://azure.microsoft.com/support/plans/response/).
