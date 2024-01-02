---
title: Quickstart - Install software for a distributed non-HA SAP system with Azure Center for SAP solutions with PowerShell
description: Learn how to  install software for a distributed non-HA SAP system in Azure Center for SAP solutions through Azure PowerShell module.
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.custom: devx-track-azurepowershell
ms.topic: quickstart
ms.date: 05/04/2023
ms.author: sagarkeswani
author: sagarkeswani
#Customer intent: As a developer, I want to Create a Distributed non-HA SAP system so that I can use the system with Azure Center for SAP solutions.
---
# Quickstart:  Install software for a distributed non-high-availability (HA) SAP system with Azure Center for SAP solutions using Azure PowerShell

The [Azure PowerShell AZ](/powershell/azure/new-azureps-module-az) module is used to create and manage Azure resources from the command line or in scripts.

[Azure Center for SAP solutions](overview.md) enables you to deploy and manage SAP systems on Azure. This article shows you how to  Install SAP software for infrastructure deployed for an SAP system. In the [previous step](deploy-s4hana.md), you created infrastructure for an SAP system with non highly available (HA) Distributed architecture on Azure with *Azure Center for SAP solutions* using Az PowerShell module.

After you [deploy infrastructure](deploy-s4hana.md) and install SAP software with *Azure Center for SAP solutions*, you can use its visualization, management and monitoring capabilities through the [Virtual Instance for SAP solutions](manage-virtual-instance.md). For example, you can:

- View and track the SAP system as an Azure resource, called the *Virtual Instance for SAP solutions (VIS)*.
- Get recommendations for your SAP infrastructure, Operating System configurations etc. based on quality checks that evaluate best practices for SAP on Azure.
- Get health and status information about your SAP system.
- Start and Stop SAP application tier.
- Start and Stop individual instances of ASCS, App server and HANA Database.
- Monitor the Azure infrastructure metrics for the SAP system resources.
- View Cost Analysis for the SAP system.

## Prerequisites
- An Azure subscription.
- An Azure account with **Azure Center for SAP solutions administrator** and **Managed Identity Operator** role access to the subscriptions and resource groups in which you'll create the Virtual Instance for SAP solutions (VIS) resource.
- A **User-assigned managed identity** which has **Azure Center for SAP solutions service role** access on the Subscription or atleast all resource groups (Compute, Network,Storage). 
- A storage account where you would store the SAP Media
- **Reader and Data Access** role to the **User-assigned managed identity** on the storage account where you would store the SAP Media.
- A [network set up for your infrastructure deployment](prepare-network.md).
- A deployment of S/4HANA infrastructure.
- The SSH private key for the virtual machines in the SAP system. You generated this key during the infrastructure deployment.
- You should have the SAP installation media available in a storage account. For more information, see [how to download the SAP installation media](get-sap-installation-media.md).
- The *json* configuration file that you used to create infrastructure in the [previous step](deploy-s4hana.md) for SAP system using PowerShell or Azure CLI. 

## Create *json* configuration file

- The json file for installation of SAP software is similar to the one used to Deploy infrastructure for SAP with an added section for SAP software configuration. 
- The software configuration section requires he following inputs
    - Software installation type: Keep this as "SAPInstallWithoutOSConfig"
    - BOM URL: This is the BOM file path. Example: `https://<your-storage-account>.blob.core.windows.net/sapbits/sapfiles/boms/S42022SPS00_v0001ms.yaml`
    - Software version: Azure Center for SAP solutions supports the following SAP software versions viz. **SAP S/4HANA 1909 SPS03** or **SAP S/4HANA 2020 SPS 03** or **SAP S/4HANA 2021 ISS 00** or **SAP S/4HANA 2022**
    - Storage account ID: This is the resource ID for the storage account where the BOM file is created
- You can use the [sample software installation payload file](https://github.com/Azure/Azure-Center-for-SAP-solutions-preview/blob/main/Payload_Samples/InstallPayloadDistributedNon-HA.json)

## Install SAP software 
Use [New-AzWorkloadsSapVirtualInstance](/powershell/module/az.workloads/new-azworkloadssapvirtualinstance) to install SAP software
```powershell
New-AzWorkloadsSapVirtualInstance -ResourceGroupName 'PowerShell-CLI-TestRG' -Name L46 -Location eastus -Environment 'NonProd' -SapProduct 'S4HANA' -Configuration .\InstallPayload.json -Tag @{k1 = "v1"; k2 = "v2"} -IdentityType 'UserAssigned' -ManagedResourceGroupName "L46-rg" -UserAssignedIdentity @{'/subscriptions/49d64d54-e966-4c46-a868-1999802b762c/resourcegroups/SAP-E2ETest-rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/E2E-RBAC-MSI'= @{}}
```

## Next steps
In this quickstart, you installed SAP software on the deployed infrastructure in Azure for an SAP system using Azure Center for SAP solutions. Continue to the next article to learn how to Manage your SAP system on Azure using [Virtual Instance for SAP solutions]()
> [!div class="nextstepaction"]
> [Manage a Virtual Instance for SAP solutions](manage-virtual-instance.md)
