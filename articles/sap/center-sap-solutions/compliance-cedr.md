---
title: Customer enabled disaster recovery in Azure Center for SAP Solutions
description: Find out about  Customer enabled disaster recovery in Azure Center for SAP Solutions
author: sushantyadav-msft
ms.author: sushantyadav
ms.topic: overview
ms.custom: subject-reliability, references_regions
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.date: 05/15/2023
---
#  Customer enabled disaster recovery in *Azure Center for SAP solutions*
Azure Center for SAP solutions service is a zone redundant service. So, service may experience downtime because no paired region exists. There will be no Microsoft initiated failover in the event of a region outage. This article explains some of the strategies that you can use to achieve cross-region resiliency for Virtual Instance for SAP solutions resources with customer enabled disaster recovery. It has detailed steps for you to follow when a region in which your Virtual Instance for SAP solutions resource exists is down. 

You must configure disaster recovery for SAP systems that you deploy using Azure Center for SAP solutions using [Disaster recovery overview and infrastructure guidelines for SAP workload](/azure/sap/workloads/disaster-recovery-overview-guide). 

In case of a region outage, customers will be notified about it. This article has the steps you can follow to get the Virtual Instance for SAP solutions resources up and running in a different region. 

## Prerequisites for Customer enabled disaster recovery in Azure Center for SAP solutions. 
Configure disaster recovery for your SAP system deployed using Azure Center for SAP solutions or otherwise using the [Disaster recovery overview and infrastructure guidelines for SAP workload](/azure/sap/workloads/disaster-recovery-overview-guide).

## Region Down Scenarios and Mitigation Steps:

| Case # | ACSS Service Region  | SAP Workload Region  | Scenario                 | Mitigation Steps       |
|--------|-----------------|------------------|--------------------------|------------------------|
| Case 1 | A (Down)        | B                | ACSS Service region is down   | Register the workload with ACSS service available in another region using PowerShell or CLI which allow to select an available service location. |
| Case 2 | A               | B (Down)         | SAP Workload region is down  | 1. Customers should perform workload failover to DR region (outside of ACSS). <br> 2. Register the failed over workload with ACSS using PowerShell or CLI.  |
| Case 3 | A (Down)        | B (Down)         | ACSS Service and SAP workload regions are down   | 1. Customers should perform workload failover to DR region (outside of ACSS). <br> 2. Register the failed over workload with ACSS service available in another region using PowerShell or CLI which allow to select an available service location.

## Steps to re-register the SAP system with Azure Center for SAP solutions in case of regional outage:

1. In case the region where your SAP workload exists is down (case 1 and 2 mentioned in the above section), perform workload failover to DR region (outside of ACSS) and have the workload running in a secondary region.

2. In case the Azure Center for SAP solutions service is down (case 1 and 3 mentioned in the above section) in the region where your Virtual Instance for SAP solutions resource exists, register your SAP system with  another available region. 

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
    -UserAssignedIdentity @{'/subscriptions/sub1/resourcegroups/rg1/providers/Microsoft.ManagedIdentity/userAssignedIdentities/ACSS-MSI'= @{}} `
    ```
3. Following table has the list of locations where Azure Center for SAP solutions service is available. It is recommended that you choose a region within the same geography where your SAP infrastructure resources are located.  

    | **Azure Center for SAP solutions service locations** |
    | --------------------------------------------------- |
    | East US |
    | East US 2 |
    | West US 3 |
    | West Europe |
    | North Europe | 
    | Australia East | 
    | East Asia | 
    | Central India | 

## Next steps
> [!div class="nextstepaction"]
> [Deploy a new SAP system with Azure Center for SAP solutions](/azure/sap/center-sap-solutions/deploy-s4hana)
