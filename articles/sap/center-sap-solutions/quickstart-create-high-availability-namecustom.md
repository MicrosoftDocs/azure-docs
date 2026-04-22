---
title: Create infrastructure for a distributed HA SAP system with custom resource names by using Azure CLI
description: Learn how to create infrastructure for a distributed highly available (HA) SAP system with custom resource names in Azure Center for SAP solutions by using Azure CLI.
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.custom: devx-track-azurecli
ms.topic: quickstart
ms.date: 04/21/2026
ms.author: sagarkeswani
author: sagarkeswani
# Customer intent: As an IT administrator, I want to deploy a distributed highly available SAP system using Azure CLI so that I can efficiently manage and customize my SAP infrastructure on Azure.
---

# Create infrastructure for a distributed HA SAP system with custom resource names by using Azure CLI

In this quickstart, you use Azure CLI to deploy infrastructure for a distributed highly available (HA) SAP system with customized resource names in [Azure Center for SAP solutions](overview.md). Alternatively, you can use the [Azure PowerShell module](/powershell/module/az.workloads/new-azworkloadssapvirtualinstance).

After you deploy infrastructure and [install SAP software](install-software.md), you can manage and monitor the system through the [Virtual Instance for SAP solutions (VIS)](manage-virtual-instance.md) resource. For example, you can:

- View and track the SAP system as an Azure resource.
- Get recommendations for your SAP infrastructure and operating system configurations based on quality checks that evaluate best practices for SAP on Azure.
- Get health and status information about your SAP system.
- Start and stop the SAP application tier.
- Start and stop individual instances of Advanced Business Application Programming SAP Central Services (ASCS), Application server, and HANA database.
- Monitor the Azure infrastructure metrics for the SAP system resources.
- View cost analysis for the SAP system.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- If you're using Azure Center for SAP solutions for the first time, register the **Microsoft.Workloads** resource provider on the subscription in which you're deploying the SAP system:

  ```azurecli-interactive
  az provider register --namespace 'Microsoft.Workloads'
  ```

- An Azure account with **Azure Center for SAP solutions administrator** and **Managed Identity Operator** role access to the subscriptions and resource groups in which you create the Virtual Instance for SAP solutions (VIS) resource.
- A **User-assigned managed identity** that has **Azure Center for SAP solutions service role** access on the subscription or at least all resource groups (Compute, Network, Storage). If you want to install SAP software through Azure Center for SAP solutions, also provide **Reader and Data Access** role to the identity on the SAP bits storage account where you store the SAP media.
- A [network set up for your infrastructure deployment](prepare-network.md).
- A 4 core minimum of either Standard_D4ds_v4 or Standard_E4s_v3 SKUs, which are used during infrastructure deployment and software installation.
- [Sufficient quotas for your Azure subscription](/azure/quotas/view-quotas). If the quotas are low, you might need to create a support request before creating your infrastructure deployment. Otherwise, you might experience deployment failures or an **Insufficient quota** error.
- The SAP Application Performance Standard (SAPS) and database memory size that you need to allow Azure Center for SAP solutions to size your SAP system. If you're not sure, you can also select the VMs. There are:
  - A single or cluster of ASCS VMs, which make up a single ASCS instance in the VIS.
  - A single or cluster of database VMs, which make up a single database instance in the VIS.
  - A single Application Server VM, which makes up a single application instance in the VIS. Depending on the number of Application Servers being deployed or registered, there can be multiple application instances.

[!INCLUDE [cloud-shell-try-it.md](~/reusable-content/ce-skilling/azure/includes/cloud-shell-try-it.md)]

## Get SAP system sizing recommendations

Use [az workloads sap-sizing-recommendation](/cli/azure/workloads?view=azure-cli-latest#az-workloads-sap-sizing-recommendation&preserve-view=true) to get SAP system sizing recommendations by providing SAPS input for the application tier and memory required for the database tier.

```azurecli-interactive
az workloads sap-sizing-recommendation --app-location "eastus" --database-type "HANA" --db-memory 1024 --deployment-type "ThreeTier" --environment "Prod" --high-availability-type "AvailabilitySet" --sap-product "S4HANA" --saps 75000 --location "eastus2" --db-scale-method ScaleUp
```

## Create a JSON configuration file with custom resource names

1. To use for the deployment of SAP system infrastructure, prepare a JSON file with the configuration (payload). You can make edits in this [sample payload](https://github.com/Azure/Azure-Center-for-SAP-solutions-preview/blob/main/Payload_Samples/CreatePayload_withTransportDirectory_withHAAvSet_withCustomResourceName.json) or use the examples listed in the [REST API documentation](/rest/api/workloads) for Azure Center for SAP solutions.

1. In the JSON file, provide the custom resource names for the infrastructure that is deployed for your SAP system.

## Deploy infrastructure for your SAP system

Use [az workloads sap-virtual-instance create](/cli/azure/workloads/sap-virtual-instance?view=azure-cli-latest#az-workloads-sap-virtual-instance-create&preserve-view=true) to deploy infrastructure for your SAP system with a three-tier HA architecture.

```azurecli-interactive
az workloads sap-virtual-instance create -g <Resource Group Name> -n <VIS Name> --environment NonProd --sap-product s4hana --configuration <Payload file path> --identity "{type:UserAssigned,userAssignedIdentities:{<Managed_Identity_ResourceID>:{}}}"
```

## Related content

- [Install SAP software](install-software.md)
- [Manage a Virtual Instance for SAP solutions](manage-virtual-instance.md)
- [Monitor SAP system from the Azure portal](monitor-portal.md)
