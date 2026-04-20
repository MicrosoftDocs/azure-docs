---
title: Install SAP software for a distributed non-HA system by using Azure PowerShell
description: Learn how to install SAP software for a distributed non-high-availability SAP system in Azure Center for SAP solutions by using Azure PowerShell.
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.custom: devx-track-azurepowershell
ms.topic: quickstart
ms.date: 04/16/2026
ms.author: sagarkeswani
author: sagarkeswani
# Customer intent: As a cloud administrator, I want to install SAP software for a distributed non-high-availability system using PowerShell, so that I can set up and manage the SAP environment within the Azure Center for SAP solutions.
---

# Install SAP software for a distributed non-HA system by using Azure PowerShell

[Azure Center for SAP solutions](overview.md) enables you to deploy and manage SAP systems on Azure. This quickstart shows you how to install SAP software for infrastructure deployed for an SAP system. In the [previous step](deploy-s4hana.md), you created infrastructure for an SAP system with a non-highly available distributed architecture on Azure by using Azure Center for SAP solutions.

After you [deploy infrastructure](deploy-s4hana.md) and install SAP software, you can manage and monitor the system through the [Virtual Instance for SAP solutions (VIS)](manage-virtual-instance.md) resource. For example, you can:

- View and track the SAP system as an Azure resource, called the *Virtual Instance for SAP solutions (VIS)*.
- Get recommendations for your SAP infrastructure and operating system configurations based on quality checks that evaluate best practices for SAP on Azure.
- Get health and status information about your SAP system.
- Start and stop the SAP application tier.
- Start and stop individual instances of Advanced Business Application Programming SAP Central Services (ASCS), application server, and HANA database.
- Monitor the Azure infrastructure metrics for the SAP system resources.
- View cost analysis for the SAP system.

## Prerequisites

- An Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An Azure account with **Azure Center for SAP solutions administrator** and **Managed Identity Operator** role access to the subscriptions and resource groups in which you create the Virtual Instance for SAP solutions (VIS) resource.
- A **User-assigned managed identity** that has **Azure Center for SAP solutions service role** access on the subscription or at least all resource groups (compute, network, storage).
- A storage account where you store the SAP media.
- **Reader and Data Access** role assigned to the **User-assigned managed identity** on the storage account where you store the SAP media.
- A [network set up for your infrastructure deployment](prepare-network.md).
- A deployment of S/4HANA infrastructure.
- The SSH private key for the virtual machines in the SAP system. You generated this key during the infrastructure deployment.
- The SAP installation media available in a storage account. For more information, see [Download the SAP installation media](get-sap-installation-media.md).
- The JSON configuration file that you used to create infrastructure in the [previous step](deploy-s4hana.md) for the SAP system by using PowerShell or Azure CLI.

## Create a JSON configuration file

The JSON file for installation of SAP software is similar to the one used to deploy infrastructure for SAP, with an added section for SAP software configuration.

The software configuration section requires the following inputs:

- **Software installation type**: Keep this value as `SAPInstallWithoutOSConfig`.

- **BOM URL**: The BOM file path. For example, `https://<your-storage-account>.blob.core.windows.net/sapbits/sapfiles/boms/S42022SPS00_v0001ms.yaml`.

- **Software version**: Azure Center for SAP solutions supports:

  - **SAP S/4HANA 1909 SPS03**

  - **SAP S/4HANA 2020 SPS 03**

  - **SAP S/4HANA 2021 ISS 00**

  - **SAP S/4HANA 2022**

- **Storage account ID**: The resource ID for the storage account where the BOM file is created.

You can use the [sample software installation payload file](https://github.com/Azure/Azure-Center-for-SAP-solutions-preview/blob/main/Payload_Samples/InstallPayloadDistributedNon-HA.json).

## Install SAP software

Use [New-AzWorkloadsSapVirtualInstance](/powershell/module/az.workloads/new-azworkloadssapvirtualinstance) to install SAP software:

```azurepowershell
New-AzWorkloadsSapVirtualInstance -ResourceGroupName 'PowerShell-CLI-TestRG' -Name L46 -Location eastus -Environment 'NonProd' -SapProduct 'S4HANA' -Configuration .\InstallPayload.json -Tag @{k1 = "v1"; k2 = "v2"} -IdentityType 'UserAssigned' -ManagedResourceGroupName "L46-rg" -UserAssignedIdentity @{'/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourcegroups/SAP-E2ETest-rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/E2E-RBAC-MSI'= @{}}
```

## Related content

- [Manage a Virtual Instance for SAP solutions](manage-virtual-instance.md)
- [Monitor SAP system from the Azure portal](monitor-portal.md)
