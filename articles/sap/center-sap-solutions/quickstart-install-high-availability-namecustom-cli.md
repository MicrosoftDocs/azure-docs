---
title: Quickstart - Install software for a Distributed HA SAP system with Azure Center for SAP solutions with custom resource names using Azure CLI
description: Learn how to  Install software for a Distributed HA SAP system in Azure Center for SAP solutions through Azure CLI.
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.custom: devx-track-azurecli
ms.topic: quickstart
ms.date: 05/05/2023
ms.author: sagarkeswani
author: sagarkeswani
#Customer intent: As a developer, I want to Create a Distributed HA SAP system with custom resource names so that I can use the system with Azure Center for SAP solutions.
---
# Quickstart:  Install software for a Distributed High-Availability (HA) SAP system and customized resource names with Azure Center for SAP solutions using Azure CLI

The [Azure CLI](/cli/azure/) is used to create and manage Azure resources from the command line or in scripts.

[Azure Center for SAP solutions](overview.md) enables you to deploy and manage SAP systems on Azure. This article shows you how to Install SAP software for infrastructure deployed for an SAP system. In the [previous step](tutorial-create-high-availability-name-custom.md), you created infrastructure for an SAP system with highly available (HA) Distributed architecture on Azure with *Azure Center for SAP solutions* using Azure CLI. You also provided customized resource names for the deployed Azure resources. 

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
- The *json* configuration file that you used to create infrastructure in the [previous step](tutorial-create-high-availability-name-custom.md) for SAP system using PowerShell or Azure CLI. 
- As you're installing a Highly Available (HA) SAP system, get the Service Principal identifier (SPN ID) and password to authorize the Azure fence agent (fencing device) against Azure resources. For more information, see [Use Azure CLI to create a Microsoft Entra app and configure it to access Media Services API](/azure/media-services/previous/media-services-cli-create-and-configure-aad-app). 
    - For an example, see the Red Hat documentation for [Creating a Microsoft Entra Application](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/deploying_red_hat_enterprise_linux_7_on_public_cloud_platforms/configuring-rhel-high-availability-on-azure_cloud-content#azure-create-an-azure-directory-application-in-ha_configuring-rhel-high-availability-on-azure).
    - To avoid frequent password expiry, use the Azure Command-Line Interface (Azure CLI) to create the Service Principal identifier and password instead of the Azure portal.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Create *json* configuration file

- The json file for installation of SAP software is similar to the one used to Deploy infrastructure for SAP with an added section for SAP software configuration. 
- The software configuration section requires he following inputs
    - Software installation type: Keep this as "SAPInstallWithoutOSConfig"
    - BOM URL: This is the BOM file path. Example: `https://<your-storage-account>.blob.core.windows.net/sapbits/sapfiles/boms/S41909SPS03_v0010ms.yaml`
    - Software version: Azure Center for SAP solutions supports these SAP software versions viz. **SAP S/4HANA 1909 SPS03** or **SAP S/4HANA 2020 SPS 03** or **SAP S/4HANA 2021 ISS 00** or **SAP S/4HANA 2022 ISS 00**
    - Storage account ID: This is the resource ID for the storage account where the BOM file is created
    - As you are deploying an HA system, you need to provide the High Availability software configuration with the following two inputs:
        - Fencing Client ID: The client identifier for the STONITH Fencing Agent service principal
        - Fencing Client Password: The password for the Fencing Agent service principal
- You can use the [sample software installation payload file](https://github.com/Azure/Azure-Center-for-SAP-solutions-preview/blob/main/Payload_Samples/InstallPayload_withTransport_withHAAvSet_withCustomResourceName.json)

## Install SAP software 
Use [az workloads sap-virtual-instance create](/cli/azure/workloads/sap-virtual-instance?view=azure-cli-latest#az-workloads-sap-virtual-instance-create&preserve-view=true) to install SAP software

```azurecli-interactive
az workloads sap-virtual-instance create -g <Resource Group Name> -n <VIS Name> --environment NonProd --sap-product s4hana --configuration <Payload file path> --identity "{type:UserAssigned,userAssignedIdentities:{<Managed_Identity_ResourceID>:{}}}"
```

**Note:** The commands for infrastructure deployment and installation are the same but the payload file for the two needs to be different. 

## Next steps
In this quickstart, you installed SAP software on the deployed infrastructure in Azure for an SAP system with Highly Available architecture type using Azure Center for SAP solutions. You also noted that the resource names were customized for the system while deploying infrastructure. Continue to the next article to learn how to Manage your SAP system on Azure using Virtual Instance for SAP solutions
> [!div class="nextstepaction"]
> [Manage a Virtual Instance for SAP solutions](manage-virtual-instance.md)
