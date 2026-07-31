---
title: Create infrastructure for a distributed highly available SAP system with customized resource names using Azure CLI
description: Learn how to use Azure CLI to deploy infrastructure for a distributed highly available SAP system with customized resource names in Azure Center for SAP solutions.
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 04/06/2026
ms.author: sagarkeswani
author: sagarkeswani
# Customer intent: As a developer, I want to deploy a highly available distributed SAP system using Azure CLI, so that I can efficiently manage and utilize the SAP infrastructure within Azure Center for SAP solutions.
---

# Create infrastructure for a distributed highly available SAP system with customized resource names using Azure CLI

[Azure Center for SAP solutions](overview.md) is an Azure service that deploys and manages SAP systems on Azure. When Azure Center for SAP solutions creates infrastructure, it assigns default names to Azure resources, such as virtual machines (VMs), network interfaces, and load balancers. If your organization requires specific naming conventions for governance or easier resource identification, you can customize these names during deployment.

In this article, you use Azure CLI to deploy infrastructure for a distributed, highly available (HA) SAP system and customize the resource names that Azure Center for SAP solutions assigns to the deployed infrastructure.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, you can [create a free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- The **Microsoft.Workloads** resource provider registered on the subscription where you're deploying the SAP system:

  ```azurecli-interactive
  az provider register --namespace 'Microsoft.Workloads'
  ```

- An Azure account with **Azure Center for SAP solutions administrator** and **Managed Identity Operator** role access to the subscriptions and resource groups in which you create the Virtual Instance for SAP solutions (VIS) resource.
- A **user-assigned managed identity** that has **Azure Center for SAP solutions service role** access on the subscription or at least all resource groups (Compute, Network, Storage). If you plan to install SAP software through Azure Center for SAP solutions, also assign the **Reader and Data Access** role to the identity on the storage account where you store the SAP media.
- A [network configured for your infrastructure deployment](prepare-network.md).
- A minimum of four cores of either `Standard_D4ds_v4` or `Standard_E4s_v3` SKUs available in your subscription.
- [Sufficient quotas for your Azure subscription](/azure/quotas/view-quotas). If the quotas are low, you might need to create a support request before creating your infrastructure deployment. Otherwise, you might experience deployment failures or an **Insufficient quota** error.
- The SAP Application Performance Standard (SAPS) and database memory size that you need so that Azure Center for SAP solutions can size your SAP system. If you're unsure, you can select the VMs directly, such as:
  - One or more ASCS VMs, which make up a single ASCS instance in the VIS.
  - One or more database VMs, which make up a single database instance in the VIS.
  - A single application server VM, which makes up a single application instance in the VIS. Depending on the number of application servers that you deploy or register, there can be multiple application instances.

[!INCLUDE [cloud-shell-try-it.md](~/reusable-content/ce-skilling/azure/includes/cloud-shell-try-it.md)]

## Review SAP-certified Azure SKUs for your deployment type

1. Run [az workloads sap-supported-sku](/cli/azure/workloads?view=azure-cli-latest#az-workloads-sap-supported-sku&preserve-view=true) to get a list of SKUs supported for your SAP system deployment type:

   ```azurecli-interactive
   az workloads sap-supported-sku --app-location "eastus" --database-type "HANA" --deployment-type "ThreeTier" --environment "Prod" --high-availability-type "AvailabilitySet" --sap-product "S4HANA" --location "eastus"
   ```

1. Review the output to identify supported SKUs for the app tier and database tier. You can use any of these SKUs when you deploy infrastructure, or use the recommended SKUs from the next section.

## Check recommended SKUs for SAPS and memory requirements

1. Run [az workloads sap-sizing-recommendation](/cli/azure/workloads?view=azure-cli-latest#az-workloads-sap-sizing-recommendation&preserve-view=true) to get SAP system sizing recommendations by providing SAPS input for the application tier and memory required for the database tier:

   ```azurecli-interactive
   az workloads sap-sizing-recommendation --app-location "eastus" --database-type "HANA" --db-memory 1024 --deployment-type "ThreeTier" --environment "Prod" --high-availability-type "AvailabilitySet" --sap-product "S4HANA" --saps 75000 --location "eastus2" --db-scale-method ScaleUp
   ```

1. Review the recommended SKUs from the output. You use these values when you create the configuration file.

## Create a JSON configuration file with custom resource names

1. Download the [sample payload](https://github.com/Azure/Azure-Center-for-SAP-solutions-preview/blob/main/Payload_Samples/CreatePayload_withTransportDirectory_withHAAvSet_withCustomResourceName.json) or use the examples in the [REST API documentation](/rest/api/workloads) for Azure Center for SAP solutions.

1. Open the JSON file and replace the default resource names with your custom names. The following parameters are available for customization:

   - VM name
   - Host name
   - Network interface name
   - OS disk name
   - Load balancer name
   - Frontend IP configuration names
   - Backend pool names
   - Health probe names
   - Data disk names: default, hanaData or hana/data, hanaLog or hana/log, usrSap or usr/sap, hanaShared or hana/shared, backup
   - Shared storage account name
   - Shared storage account private endpoint name

1. Save the JSON file. Remember the file path for use in the deployment command.

## Deploy infrastructure for your SAP system

1. Run [az workloads sap-virtual-instance create](/cli/azure/workloads/sap-virtual-instance?view=azure-cli-latest#az-workloads-sap-virtual-instance-create&preserve-view=true) to deploy infrastructure for your SAP system with a three-tier HA architecture:

   ```azurecli-interactive
   az workloads sap-virtual-instance create -g <Resource_Group_Name> -n <VIS_Name> --environment NonProd --sap-product s4hana --configuration <Payload_file_path> --identity "{type:UserAssigned,userAssignedIdentities:{<Managed_Identity_ResourceID>:{}}}"
   ```

1. Wait for the deployment to complete. The command creates your SAP system infrastructure and the Virtual Instance for SAP solutions (VIS) resource that represents your SAP system in Azure.

## Clean up resources

If you no longer need the VIS resource, delete it by running [az workloads sap-virtual-instance delete](/cli/azure/workloads/sap-virtual-instance?view=azure-cli-latest#az-workloads-sap-virtual-instance-delete&preserve-view=true):

```azurecli-interactive
az workloads sap-virtual-instance delete -g <Resource_Group_Name> -n <VIS_Name>
```

This command deletes only the VIS and other resources created by Azure Center for SAP solutions. It doesn't delete the deployed infrastructure, such as VMs and disks. To remove those resources, delete them separately through the Azure portal or Azure CLI.

## Next step

> [!div class="nextstepaction"]
> [Install SAP software](install-software.md)
