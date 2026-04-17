---
title: Install SAP software for a distributed HA system with custom resource names by using Azure CLI
description: Learn how to install SAP software for a distributed high-availability SAP system in Azure Center for SAP solutions with custom resource names.
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.custom: devx-track-azurecli
ms.topic: quickstart
ms.date: 04/16/2026
ms.author: sagarkeswani
author: sagarkeswani
# Customer intent: As a developer, I want to install software for a Distributed High-Availability SAP system using Azure CLI, so that I can deploy and manage SAP solutions with custom resource names on Azure efficiently.
---

# Install SAP software for a distributed HA system with custom resource names by using Azure CLI

[Azure Center for SAP solutions](overview.md) enables you to deploy and manage SAP systems on Azure. This quickstart shows you how to install SAP software for infrastructure deployed for an SAP system. In the [previous step](tutorial-create-high-availability-name-custom.md), you created infrastructure for an SAP system with a highly available distributed architecture. You used Azure Center for SAP solutions with Azure CLI and provided customized resource names for the deployed Azure resources.

After you deploy infrastructure and install SAP software, you can manage and monitor the system through the [Virtual Instance for SAP solutions (VIS)](manage-virtual-instance.md) resource. For example, you can:

- View and track the SAP system as an Azure resource, called the *Virtual Instance for SAP solutions (VIS)*.
- Get recommendations for your SAP infrastructure and operating system configurations based on quality checks that evaluate best practices for SAP on Azure.
- Get health and status information about your SAP system.
- Start and stop the SAP application tier.
- Start and stop individual instances of Advanced Business Application Programming SAP Central Services (ASCS), Application server, and HANA database.
- Monitor the Azure infrastructure metrics for the SAP system resources.
- View cost analysis for the SAP system.

## Prerequisites

- An Azure subscription. If you don't already have an Azure subscription, [create a free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An Azure account with **Azure Center for SAP solutions administrator** and **Managed Identity Operator** role access to the subscriptions and resource groups in which you create the Virtual Instance for SAP solutions (VIS) resource.
- A **User-assigned managed identity** that has **Azure Center for SAP solutions service role** access on the subscription or at least all resource groups (compute, network, storage).
- A storage account where you store the SAP media.
- **Reader and Data Access** role assigned to the **User-assigned managed identity** on the storage account where you store the SAP media.
- A [network set up for your infrastructure deployment](prepare-network.md).
- A deployment of S/4HANA infrastructure.
- The SSH private key for the virtual machines in the SAP system. You generated this key during the infrastructure deployment.
- The SAP installation media available in a storage account. For more information, see [Download the SAP installation media](get-sap-installation-media.md).
- The JSON configuration file that you used to create infrastructure in the [previous step](tutorial-create-high-availability-name-custom.md) for the SAP system by using PowerShell or Azure CLI.
- The service principal identifier (SPN ID) and password to authorize the Azure fence agent (fencing device) against Azure resources, because you're installing a highly available SAP system.
  - For an example, see the Red Hat documentation for [Creating a Microsoft Entra application](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/deploying_red_hat_enterprise_linux_7_on_public_cloud_platforms/configuring-rhel-high-availability-on-azure_cloud-content#azure-create-an-azure-directory-application-in-ha_configuring-rhel-high-availability-on-azure).
  - To avoid frequent password expiry, use Azure CLI to create the service principal identifier and password instead of the Azure portal.

[!INCLUDE [cloud-shell-try-it.md](~/reusable-content/ce-skilling/azure/includes/cloud-shell-try-it.md)]

## Create a JSON configuration file

The JSON file for installation of SAP software is similar to the one used to deploy infrastructure for SAP, with an added section for SAP software configuration.

The software configuration section requires the following inputs:

- **Software installation type**: Keep this value as `SAPInstallWithoutOSConfig`.

- **BOM URL**: The BOM file path. For example, `https://<your-storage-account>.blob.core.windows.net/sapbits/sapfiles/boms/S41909SPS03_v0010ms.yaml`.

- **Software version**: Azure Center for SAP solutions supports:

  -  **SAP S/4HANA 1909 SPS03**

  - **SAP S/4HANA 2020 SPS 03**

  - **SAP S/4HANA 2021 ISS 00**

  - **SAP S/4HANA 2022 ISS 00**

- **Storage account ID**: The resource ID for the storage account where the BOM file is created.

- **Fencing Client ID**: The client identifier for the STONITH Fencing Agent service principal (required for HA deployments).

- **Fencing Client Password**: The password for the Fencing Agent service principal (required for HA deployments).

You can use the [sample software installation payload file](https://github.com/Azure/Azure-Center-for-SAP-solutions-preview/blob/main/Payload_Samples/InstallPayload_withTransport_withHAAvSet_withCustomResourceName.json).

## Install SAP software

Use [az workloads sap-virtual-instance create](/cli/azure/workloads/sap-virtual-instance#az-workloads-sap-virtual-instance-create) to install SAP software:

```azurecli-interactive
az workloads sap-virtual-instance create -g <Resource Group Name> -n <VIS Name> --environment NonProd --sap-product s4hana --configuration <Payload file path> --identity "{type:UserAssigned,userAssignedIdentities:{<Managed_Identity_ResourceID>:{}}}"
```

> [!NOTE]
> The commands for infrastructure deployment and installation are the same, but the payload file for the two operations is different.

## Related content

- [Manage a Virtual Instance for SAP solutions](manage-virtual-instance.md)
- [Monitor SAP system from the Azure portal](monitor-portal.md)
