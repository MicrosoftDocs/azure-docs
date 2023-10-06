---
title: Tutorial - Create a distributed highly available SAP system with Azure Center for SAP solutions with Azure CLI
description: In this tutorial you learn to create a distributed highly available SAP system in Azure Center for SAP solutions through Azure CLI.
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.custom: devx-track-azurecli
ms.topic: tutorial
ms.date: 05/04/2023
ms.author: sagarkeswani
author: sagarkeswani
#Customer intent: As a developer, I want to create a distributed highly available SAP system so that I can use the system with Azure Center for SAP solutions.
---
# Tutorial: Use Azure CLI to create infrastructure for a distributed highly available (HA) SAP system with *Azure Center for SAP solutions* with customized resource names

[Azure Center for SAP solutions](overview.md) enables you to deploy and manage SAP systems on Azure. After you deploy infrastructure and [install SAP software](install-software.md) with *Azure Center for SAP solutions*, you can use its visualization, management and monitoring capabilities through the [Virtual Instance for SAP solutions](https://github.com/MicrosoftDocs/azure-docs/blob/main/articles/sap/center-sap-solutions/manage-virtual-instance.md)

## Introduction
The [Azure CLI](/cli/azure/) is used to create and manage Azure resources from the command line or in scripts.

This tutorial shows you how to use Azure CLI to deploy infrastructure for an SAP system with highly available (HA) Three-tier Distributed architecture. You also see how to customize resource names for the Azure infrastructure that gets deployed. See the following steps:
> [!div class="checklist"]
> * Complete the pre-requisites
> * Understand the SAP SKUs available for your deployment type
> * Check for recommended SKUs for SAPS and Memory requirements for your SAP system
> * Create json configuration file with custom resource names
> * Deploy infrastructure for your SAP system


## Prerequisites

- An Azure subscription.
- If you're using Azure Center for SAP solutions for the first time, Register the **Microsoft.Workloads** Resource Provider on the subscription in which you're deploying the SAP system:

    ```azurecli-interactive
    az provider register --namespace 'Microsoft.Workloads'
    ```

- An Azure account with **Azure Center for SAP solutions administrator** and **Managed Identity Operator** role access to the subscriptions and resource groups in which you create the Virtual Instance for SAP solutions (VIS) resource.
- A **User-assigned managed identity** which has **Azure Center for SAP solutions service role** access on the Subscription or at least all resource groups (Compute, Network,Storage). If you wish to install SAP Software through the Azure Center for SAP solutions, also provide **Reader and Data Access** role to the identity on SAP bits storage account where you would store the SAP Media.
- A [network set up for your infrastructure deployment](prepare-network.md).
- Availability of minimum 4 cores of either Standard_D4ds_v4 or Standard_E4s_v3, SKUS which will be used during Infrastructure deployment and Software Installation
- [Review the quotas for your Azure subscription](../../quotas/view-quotas.md). If the quotas are low, you might need to create a support request before creating your infrastructure deployment. Otherwise, you might experience deployment failures or an **Insufficient quota** error. 
- Note the SAP Application Performance Standard (SAPS) and database memory size that you need to allow Azure Center for SAP solutions to size your SAP system. If you're not sure, you can also select the VMs. There are:
    - A single or cluster of ASCS VMs, which make up a single ASCS instance in the VIS.
    - A single or cluster of Database VMs, which make up a single Database instance in the VIS.
    - A single Application Server VM, which makes up a single Application instance in the VIS. Depending on the number of Application Servers being deployed or registered, there can be multiple application instances.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Understand the SAP certified Azure SKUs available for your deployment type

Use [az workloads sap-supported-sku](/cli/azure/workloads?view=azure-cli-latest#az-workloads-sap-supported-sku&preserve-view=true) to get a list of SKUs supported for your SAP system deployment type from Azure Center for SAP solutions

```azurecli-interactive
az workloads sap-supported-sku --app-location "eastus" --database-type "HANA" --deployment-type "ThreeTier" --environment "Prod" --high-availability-type "AvailabilitySet" --sap-product "S4HANA" --location "eastus"
```
You can use any of these SKUs recommended for App tier and Database tier when deploying infrastructure in the later steps. Or you can use the recommended SKUs by *Azure Center for SAP solutions* in the next step.

## Check for recommended SKUs for SAPS and Memory requirements for your SAP system

Use [az workloads sap-sizing-recommendation](/cli/azure/workloads?view=azure-cli-latest#az-workloads-sap-sizing-recommendation&preserve-view=true) to get SAP system sizing recommendations by providing SAPS input for application tier and memory required for database tier

```azurecli-interactive
az workloads sap-sizing-recommendation --app-location "eastus" --database-type "HANA" --db-memory 1024 --deployment-type "ThreeTier" --environment "Prod" --high-availability-type "AvailabilitySet" --sap-product "S4HANA" --saps 75000 --location "eastus2" --db-scale-method ScaleUp
```

## Create *json* configuration file with custom resource names

- Prepare a *json* file with the configuration (payload) to use for the deployment of SAP system infrastructure. You can make edits in this [sample payload](https://github.com/Azure/Azure-Center-for-SAP-solutions-preview/blob/main/Payload_Samples/CreatePayload_withTransportDirectory_withHAAvSet_withCustomResourceName.json) or use the examples listed in the [Rest API documentation](/rest/api/workloads) for Azure Center for SAP solutions 
- In this json file, provide the custom resource names for the infrastructure that is deployed for your SAP system
- The parameters available for customization are: 
    - VM Name
    - Host Name
    - Network interface name
    - OS Disk Name
    - Load Balancer Name
    - Frontend IP Configuration Names
    - Backend Pool Names
    - Health Probe Names
    - Data Disk Names: default, hanaData or hana/data, hanaLog or hana/log, usrSap or usr/sap, hanaShared or hana/shared, backup
    - Shared Storage Account Name
    - Shared Storage Account Private End Point Name

You can download the [sample payload](https://github.com/Azure/Azure-Center-for-SAP-solutions-preview/blob/main/Payload_Samples/CreatePayload_withTransportDirectory_withHAAvSet_withCustomResourceName.json) and replace the resource names and any other parameter as needed

## Deploy infrastructure for your SAP system

Use [az workloads sap-virtual-instance create](/cli/azure/workloads/sap-virtual-instance?view=azure-cli-latest#az-workloads-sap-virtual-instance-create&preserve-view=true) to deploy infrastructure for your SAP system with Three tier HA architecture.

```azurecli-interactive
az workloads sap-virtual-instance create -g <Resource Group Name> -n <VIS Name> --environment NonProd --sap-product s4hana --configuration <Payload file path> --identity "{type:UserAssigned,userAssignedIdentities:{<Managed_Identity_ResourceID>:{}}}"
```
This will deploy your SAP system and the Virtual instance for SAP solutions (VIS) resource representing your SAP system in Azure. 

## Cleanup
If you no longer wish to use the VIS resource, you can delete it by using [az workloads sap-virtual-instance delete](/cli/azure/workloads/sap-virtual-instance?view=azure-cli-latest#az-workloads-sap-virtual-instance-delete&preserve-view=true)

```azurecli-interactive
az workloads sap-virtual-instance delete -g <Resource_Group_Name> -n <VIS Name>
```
This command will only delete the VIS and other resources created by Azure Center for SAP solutions. This will not delete the deployed infrastructure like VMs, Disks etc. 


## Next steps
In this tutorial, you deployed infrastructure in Azure for an SAP system using Azure Center for SAP solutions. You used custom resource names for the infrastructure. Continue to the next article to learn how to install SAP software on the infrastructure deployed. 
> [!div class="nextstepaction"]
> [Install SAP software](install-software.md)
