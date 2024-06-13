---
title: Quickstart - Create a distributed non-HA SAP system with Azure Center for SAP solutions with PowerShell
description: Learn how to create a distributed non-HA SAP system in Azure Center for SAP solutions through Azure PowerShell module.
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.custom: devx-track-azurepowershell
ms.topic: quickstart
ms.date: 05/04/2023
ms.author: sagarkeswani
author: sagarkeswani
#Customer intent: As a developer, I want to create a distributed non-HA SAP system so that I can use the system with Azure Center for SAP solutions.
---
# Quickstart: Create infrastructure for a distributed non-high-availability SAP system with *Azure Center for SAP solutions* 

The [Azure PowerShell AZ](/powershell/azure/new-azureps-module-az) module is used to create and manage Azure resources from the command line or in scripts.

[Azure Center for SAP solutions](overview.md) enables you to deploy and manage SAP systems on Azure. This article shows you how to deploy infrastructure for an SAP system with non highly available (HA) Distributed architecture on Azure with *Azure Center for SAP solutions* using Az PowerShell module. Alternatively, you can deploy SAP systems using the Azure CLI, or in the Azure Portal. 

After you deploy infrastructure and [install SAP software](install-software.md) with *Azure Center for SAP solutions*, you can use its visualization, management and monitoring capabilities through the Azure portal. For example, you can:

- View and track the SAP system as an Azure resource, called the *Virtual Instance for SAP solutions (VIS)*.
- Get recommendations for your SAP infrastructure, Operating System configurations etc. based on quality checks that evaluate best practices for SAP on Azure.
- Get health and status information about your SAP system.
- Start and Stop SAP application tier.
- Start and Stop individual instances of ASCS, App server and HANA Database.
- Monitor the Azure infrastructure metrics for the SAP system resources.
- View Cost Analysis for the SAP system.

## Prerequisites

- An Azure subscription.
- If you are using Azure Center for SAP solutions for the first time, Register the **Microsoft.Workloads** Resource Provider on the subscription in which you are deploying the SAP system. Use [Register-AzResourceProvider](/powershell/module/az.Resources/Register-azResourceProvider), as follows:

    ```powershell
    Register-AzResourceProvider -ProviderNamespace "Microsoft.Workloads"
    ```

- An Azure account with **Azure Center for SAP solutions administrator** and **Managed Identity Operator** role access to the subscriptions and resource groups in which you'll create the Virtual Instance for SAP solutions (VIS) resource.
- A **User-assigned managed identity** which has **Azure Center for SAP solutions service role** access on the Subscription or atleast all resource groups (Compute, Network,Storage). If you wish to install SAP Software through the Azure Center for SAP solutions, also provide **Reader and Data Access** role to the identity on SAP bits storage account where you would store the SAP Media.
- A [network set up for your infrastructure deployment](prepare-network.md).
- Availability of minimum 4 cores of either Standard_D4ds_v4 or Standard_E4s_v3 SKUS which will be used during Infrastructure deployment and Software Installation
- [Review the quotas for your Azure subscription](../../quotas/view-quotas.md). If the quotas are low, you might need to create a support request before creating your infrastructure deployment. Otherwise, you might experience deployment failures or an **Insufficient quota** error. 
- Note the SAP Application Performance Standard (SAPS) and database memory size that you need to allow Azure Center for SAP solutions to size your SAP system. If you're not sure, you can also select the VMs. There are:
    - A single or cluster of ASCS VMs, which make up a single ASCS instance in the VIS.
    - A single or cluster of Database VMs, which make up a single Database instance in the VIS.
    - A single Application Server VM, which makes up a single Application instance in the VIS. Depending on the number of Application Servers being deployed or registered, there can be multiple application instances.

- Azure Cloud Shell or Azure PowerShell.

  The steps in this quickstart run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloudshell** at the upper-right corner of a code block. Select **Copy** to copy the code and then paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

  You can also [install Azure PowerShell locally](/powershell/azure/install-Az-ps) to run the cmdlets. The steps in this article require Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find your installed version. If you need to upgrade, see [Update the Azure PowerShell module](/powershell/azure/install-Az-ps#update-the-azure-powershell-module).

  If you run PowerShell locally, run `Connect-AzAccount` to connect to Azure.

## Right Size the SAP system you want to deploy

Use [Invoke-AzWorkloadsSapSizingRecommendation](/powershell/module/az.workloads/invoke-azworkloadssapsizingrecommendation) to get SAP system sizing recommendations by providing SAPS input for application tier and memory required for database tier

```powershell
Invoke-AzWorkloadsSapSizingRecommendation -Location eastus -AppLocation eastus -DatabaseType HANA -DbMemory 256 -DeploymentType ThreeTier -Environment NonProd -SapProduct S4HANA -Sap 10000 -DbScaleMethod ScaleUp
```

## Create *json* configuration file

Prepare a *json* file with the payload that will be used for the deployment of SAP system infrastructure. You can make edits in this [sample payload](https://github.com/Azure/Azure-Center-for-SAP-solutions-preview/blob/main/Payload_Samples/CreatePayloadDistributedNon-HA.json) or use the examples listed in the [Rest API documentation](/rest/api/workloads) for Azure Center for SAP solutions 

## Deploy infrastructure for your SAP system

Use [New-AzWorkloadsSapVirtualInstance](/powershell/module/az.workloads/new-azworkloadssapvirtualinstance) to deploy infrastructure for your SAP system with Three tier non-HA architecture

```powershell
New-AzWorkloadsSapVirtualInstance -ResourceGroupName 'PowerShell-CLI-TestRG' -Name L46 -Location eastus -Environment 'NonProd' -SapProduct 'S4HANA' -Configuration .\CreatePayload.json -Tag @{k1 = "v1"; k2 = "v2"} -IdentityType 'UserAssigned' -ManagedResourceGroupName "L46-rg" -UserAssignedIdentity @{'/subscriptions/49d64d54-e966-4c46-a868-1999802b762c/resourcegroups/SAP-E2ETest-rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/E2E-RBAC-MSI'= @{}}
```


## Next steps
In this quickstart, you deployed infrastructure in Azure for an SAP system using Azure Center for SAP solutions. Continue to the next article to learn how to install SAP software on the infrastructure deployed. 
> [!div class="nextstepaction"]
> [Install SAP software](install-software.md)
