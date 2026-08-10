---
title: Configure community governance
titleSuffix: Azure Enclave
description: Configure community governance.
author: jadean-msft
ms.author: jadean
ms.topic: overview
ms.date: 06/12/2026
---

# Configure community governance

These governance options are applied to all of the workloads that are part of either the community or enclave, overriding the default governance configuration for workloads.

## Prerequisites

- To access Azure Enclave, you need an Azure subscription. If you don't already have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- Before you can create an enclave, you must [create a community](./create-community-portal.md) using the Azure portal.
- **If you are using on-prem/custom DNS** - each enclave _must deploy a DNS resolver_ workload in order to resolve private endpoints for Azure Storage, Key Vault, and Log Analytics. 

## Customize governance settings on community creation
Go to community creation and customize your governance settings.

 In the context of governance for communities, the following settings can be specified for each service:

 :::image type="content" source="./media/create-community-tab-5-policy-management.png" alt-text="Screenshot showing the community policy management settings page during community creation in the portal." border="True" lightbox="./media/create-community-tab-5-policy-management.png":::

 - Enforcement: This setting determines whether the rules defined for a service are actively enforced. When enforcement is enabled, any action that violates the rules are blocked or flagged.
 - Audit Mode: This option allows for the monitoring of services without actively enforcing the rules. It's useful for understanding the effect of potential governance policies by logging all actions that would violate the rules if enforcement were > enabled.
 - Options: This setting declares whether the service is:
   - Allow: The service is allowed in the policies
   - Deny: The service isn't allowed in the policies
   - ExceptionOnly: The service isn't allowed in the policies, but manual [Policy Exemptions](./policy-compliance-exemptions.md) can be made.

> [!NOTE]
> 
> These governance options are applied to all of the workloads that are part of the community, overriding the default governance configuration for workloads.

## Configure approval settings

Community owners can configure approval requirements for resource types that support Azure Enclave approvals. Approval settings can be configured by resource type and scope so different resources can require different approver groups or approval counts.

For more information, see [Configure approval settings](./configure-approvals.md).
