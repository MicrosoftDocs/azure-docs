---
title: Quickstart - Deploy distributed non-HA SAP system with PowerShell
description: Learn how to create a distributed non-HA SAP system in Azure Center for SAP solutions by using the Azure PowerShell module.
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.custom: devx-track-azurepowershell
ms.topic: quickstart
ms.date: 04/08/2026
ms.author: sagarkeswani
author: sagarkeswani
#customer intent: As a developer, I want to deploy a distributed non-high-availability SAP system in Azure by using PowerShell so that I can use the system with Azure Center for SAP solutions.
---

# Quickstart: Deploy infrastructure for a distributed non-high-availability SAP system with Azure Center for SAP solutions

In this quickstart, you deploy infrastructure for an SAP system with a non-high-availability (non-HA) distributed architecture on Azure. You use the Azure PowerShell module to create a Virtual Instance for SAP solutions (VIS) resource through Azure Center for SAP solutions.

After you deploy infrastructure and [install SAP software](install-software.md), you can use visualization, management, and monitoring capabilities through the Azure portal. For example, you can:

- View and track the SAP system as an Azure resource using VIS.
- Get recommendations for your SAP infrastructure, operating system configurations, and more based on quality checks that evaluate best practices for SAP on Azure.
- Get health and status information about your SAP system.
- Start and stop the SAP application tier.
- Start and stop individual instances of Advanced Business Application Programming SAP Central Services (ASCS), Application server, and HANA database.
- Monitor the Azure infrastructure metrics for the SAP system resources.
- View cost analysis for the SAP system.

## Prerequisites

- An Azure subscription. If you don't have an Azure account, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.
- The [Azure PowerShell](/powershell/azure/new-azureps-module-az) module is installed on your device.
- If you're using Azure Center for SAP solutions for the first time, the **Microsoft.Workloads** resource provider registered on your subscription. Use [Register-AzResourceProvider](/powershell/module/az.Resources/Register-azResourceProvider):

  ```azurepowershell
  Register-AzResourceProvider -ProviderNamespace "Microsoft.Workloads"
  ```

- An Azure account with **Azure Center for SAP solutions administrator** and **Managed Identity Operator** role access to the subscriptions and resource groups in which you create the VIS resource.
- A **User-assigned managed identity** that has **Azure Center for SAP solutions service role** access on the subscription or at least all resource groups (Compute, Network, Storage). If you want to install SAP software through Azure Center for SAP solutions, also provide **Reader and Data Access** role to the identity on the SAP bits storage account where you store the SAP media.
- A [network set up for your infrastructure deployment](prepare-network.md).
- A minimum of four cores of either `Standard_D4ds_v4` or `Standard_E4s_v3` SKUs, which are used during infrastructure deployment and software installation.
- Sufficient [Azure subscription quotas](/azure/quotas/view-quotas). If the quotas are low, you might need to create a support request before creating your infrastructure deployment. Otherwise, you might experience deployment failures or an **Insufficient quota** error.
- The SAP Application Performance Standard (SAPS) and database memory size that you need to allow Azure Center for SAP solutions to size your SAP system. If you're not sure, you can also select the virtual machines (VMs). The VMs include:
  - A single or cluster of ASCS VMs, which make up a single ASCS instance in the VIS.
  - A single or cluster of Database VMs, which make up a single Database instance in the VIS.
  - A single Application Server VM, which makes up a single Application instance in the VIS. Depending on the number of Application Servers being deployed or registered, there can be multiple application instances.

- Azure Cloud Shell or Azure PowerShell.

  The steps in this quickstart run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code and then paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

  You can also [install Azure PowerShell locally](/powershell/azure/install-Az-ps) to run the cmdlets. The steps in this article require Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find your installed version. If you need to upgrade, see [Update the Azure PowerShell module](/powershell/azure/install-Az-ps#update-the-azure-powershell-module).

  If you run PowerShell locally, run `Connect-AzAccount` to connect to Azure.

## Get SAP system sizing recommendations

Get SAP system sizing recommendations by providing SAPS input for the application tier and memory required for the database tier.

1. Run [Invoke-AzWorkloadsSapSizingRecommendation](/powershell/module/az.workloads/invoke-azworkloadssapsizingrecommendation) to get sizing recommendations:

   ```azurepowershell
   Invoke-AzWorkloadsSapSizingRecommendation -Location eastus `
       -AppLocation eastus `
       -DatabaseType HANA `
       -DbMemory 256 `
       -DeploymentType ThreeTier `
       -Environment NonProd `
       -SapProduct S4HANA `
       -Sap 10000 `
       -DbScaleMethod ScaleUp
   ```

1. Review the output to determine the recommended VM SKUs for your SAP system.

## Create a JSON configuration file

To deploy SAP system infrastructure, prepare a JSON file with the payload.

1. Download or create a JSON payload file. You can use the [sample payload](https://github.com/Azure/Azure-Center-for-SAP-solutions-preview/blob/main/Payload_Samples/CreatePayloadDistributedNon-HA.json) as a starting point, or see the examples in the [REST API documentation](/rest/api/workloads) for Azure Center for SAP solutions.

1. Edit the payload file to match your environment settings, such as resource group names, locations, and VM sizes.

1. Save the file as `CreatePayload.json` in your working directory.

## Deploy infrastructure for your SAP system

Deploy infrastructure for your SAP system with a three-tier non-HA architecture by using the JSON configuration file you created.

1. Run [New-AzWorkloadsSapVirtualInstance](/powershell/module/az.workloads/new-azworkloadssapvirtualinstance) to deploy the infrastructure:

   ```azurepowershell
   New-AzWorkloadsSapVirtualInstance `
       -ResourceGroupName 'PowerShell-CLI-TestRG' `
       -Name L46 `
       -Location eastus `
       -Environment 'NonProd' `
       -SapProduct 'S4HANA' `
       -Configuration .\CreatePayload.json `
       -Tag @{k1 = "v1"; k2 = "v2"} `
       -IdentityType 'UserAssigned' `
       -ManagedResourceGroupName "L46-rg" `
       -UserAssignedIdentity @{'/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourcegroups/SAP-E2ETest-rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/E2E-RBAC-MSI'= @{}}
   ```

1. Wait for the deployment to complete. The command creates all the required Azure infrastructure resources for your SAP system.

## Next step

In this quickstart, you deployed infrastructure in Azure for an SAP system by using Azure Center for SAP solutions. Continue to the next article to learn how to install SAP software on the infrastructure you deployed.

> [!div class="nextstepaction"]
> [Install SAP software](install-software.md)
