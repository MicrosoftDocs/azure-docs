---
title: Configure customer-enabled disaster recovery in Azure Center for SAP solutions
description: Learn how to configure customer-enabled disaster recovery for Virtual Instance for SAP solutions resources in Azure Center for SAP solutions.
author: jjaygbay1
ms.author: jacobjaygbay
ms.topic: how-to
ms.custom: references_regions
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.date: 04/16/2026
# Customer intent: As an SAP administrator, I want to configure customer-enabled disaster recovery for my SAP systems in Azure, so that I can ensure cross-region resiliency and minimize downtime during regional outages.
---

# Configure customer-enabled disaster recovery in Azure Center for SAP solutions

Azure Center for SAP solutions is a zone-redundant service. The service might experience downtime because no paired region exists, and there's no Microsoft-initiated failover during a region outage. This article explains strategies to achieve cross-region resiliency for Virtual Instance for SAP solutions resources with customer-enabled disaster recovery (DR). Also, steps to follow when a region where your Virtual Instance for SAP solutions resource exists is down.

You must configure disaster recovery for SAP systems that you deploy by using Azure Center for SAP solutions. For more information, see [Disaster recovery overview and infrastructure guidelines for SAP workload](/azure/sap/workloads/disaster-recovery-overview-guide).

When a region outage occurs, you're notified. The following sections describe the steps you can follow to get the Virtual Instance for SAP solutions resources running in a different region.

## Prerequisites

- An SAP system deployed by using Azure Center for SAP solutions or registered with Azure Center for SAP solutions.
- DR configured for your SAP system by using the [Disaster recovery overview and infrastructure guidelines for SAP workload](/azure/sap/workloads/disaster-recovery-overview-guide).

## Understand region-down scenarios and mitigation steps

| Case | Service region | Workload region | Scenario | Mitigation steps |
|------|----------------|-----------------|----------|------------------|
| 1 | A (down) | B | Azure Center for SAP solutions service region is down. | Register the workload with an Azure Center for SAP solutions service available in another region by using PowerShell or CLI, which allow you to select an available service location. |
| 2 | A | B (down) | SAP workload region is down. | 1. Perform workload failover to the DR region (outside of Azure Center for SAP solutions). <br><br> 2. Register the failed-over workload by using PowerShell or CLI. |
| 3 | A (down) | B (down) | Both the service and SAP workload regions are down. | 1. Perform workload failover to the DR region (outside of Azure Center for SAP solutions). <br><br> 2. Register the failed-over workload with an Azure Center for SAP solutions service available in another region by using PowerShell or CLI. |

## Re-register the SAP system during a regional outage

1. If the region where your SAP workload exists is down (cases 1 and 2), perform workload failover to the DR region outside of Azure Center for SAP solutions and have the workload running in a secondary region.

1. If the Azure Center for SAP solutions service is down (cases 1 and 3) in the region where your Virtual Instance for SAP solutions resource exists, register your SAP system with another available region.

   ```azurepowershell-interactive
   New-AzWorkloadsSapVirtualInstance `
       -ResourceGroupName 'TestRG' `
       -Name L46 `
       -Location eastus `
       -Environment 'NonProd' `
       -SapProduct 'S4HANA' `
       -CentralServerVmId '/subscriptions/sub1/resourcegroups/rg1/providers/microsoft.compute/virtualmachines/l46ascsvm' `
       -Tag @{k1 = "v1"; k2 = "v2"} `
       -ManagedResourceGroupName "acss-L46-rg" `
       -ManagedRgStorageAccountName 'acssstoragel46' `
       -IdentityType 'UserAssigned' `
       -UserAssignedIdentity @{'/subscriptions/sub1/resourcegroups/rg1/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ACSS-MSI'= @{}}
   ```

The following table lists the locations where Azure Center for SAP solutions is available. Choose a region within the same geography where your SAP infrastructure resources are located.

| Azure Center for SAP solutions service locations |
|---|
| Australia East |
| Central India |
| East Asia |
| East US |
| East US 2 |
| North Europe |
| West Europe |
| West US 3 |

## Related content

- [Deploy a new SAP system with Azure Center for SAP solutions](deploy-s4hana.md)
- [Register an existing SAP system](register-existing-system.md)
- [Disaster recovery overview and infrastructure guidelines for SAP workload](/azure/sap/workloads/disaster-recovery-overview-guide)
