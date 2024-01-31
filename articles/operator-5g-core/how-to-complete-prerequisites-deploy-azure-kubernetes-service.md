---
title: Prerequisites to deploy Azure Operator 5G Core on Azure Kubernetes Service
description: Learn how to complete the prerequisites necessary to deploy Azure Operator 5G Core on the Azure Kubernetes Service
author: HollyCl
ms.author: HollyCl
ms.service: azure
ms.topic: how-to #required; leave this attribute/value as-is.
ms.date: 01/30/2024

---

# Complete the prerequisites to deploy Azure Operator 5G Core on Advanced Kubernetes Service

This article shows you how to complete the prerequisite steps to deploy Azure Operator 5G Core on the Advanced Kubernetes Service. The first portion discusses the initial cluster creation; the second shows you how to modify the cluster to add the data plane ports.

## Prerequisites

To deploy on the Azure Kubernetes service, you must have the following configurations:

- Resource Group/Subscription
- The Azure Operator 5G Core release version and corresponding Kubernetes version
- Networks created for Data plane
- Sizing (the number of worker nodes/VM sizes/flavors/subnet sizes)
- Availability Zones
- Federations installed
- Appropriate roles and permissions in your Tenant to create the cluster and modify the Azure Virtual Machine Scale Sets.
 
## Create the initial cluster

1. Navigate and sign in to the [Azure portal](https://ms.portal.azure.com/).
1. On the Azure portal home pages, select **Create a Resource**.
1. In the **Categories** section, select **Containers** > **Azure Kubernetes Service (AKS)**.
1. On the **Basics** tab:
    - Enter the **Subscription**, **Resource Group**, **Cluster Name**, **Availability Zones**, and **Pricing Tier** based on your Azure Operator 5G Core requirements.
    -  Disable **Automatic upgrade**.
    - Select **Local accounts with Kubernetes RBAC** for the **Authentication and Authorization** method.
2. Navigate to the **Add a node pool** tab, then:
    - Delete the sample node pools. Use the VM size based on your sizing, availability, and NFVI capacity requirements to create a new system node pool.
    - Enter and select **system** for the **Node pool name** an as the **Mode** type.
    - Select **Azure Linux** as the **OS SKU**.
    - Select **Availability zones**: **Zones 1,2,3** and leave the **Enable Azure Post instances** field unmarked.
    - Choose **Standard D16ids vS** as the **Node size**.
    - Select **Manual** as the **Scale method**.
    - Select **1** for the **Node count**.
    - Select **250** as the **Max pods per node**, and don't mark to **Enable public IP per node**.
3. On the **Networking** tab, select Kubernetes from the **Networking Configuration** section. Then mark the box for **BYO vnet** and select the virtual network and subnet for your cluster's default network. Leave all other values as default.
1. Unless you have a specific requirement to do otherwise, don't change any values on the  **Integrations** tab.
1. Turn **Azure monitor** off.
1. Navigate to the **Advanced** tab and mark the box for **Enable Secret Store CSI Driver**. Don't edit any other field.
1. Note the name of the **Infrastructure Resource group** displayed. This name is required to modify the cluster and add data plane ports.
1. Select **Review + Create** once validation completes.
  

## Modify the cluster to add data plane ports

1. Once you successfully created the cluster, navigate to the **settings** section of the AKS cluster and verify that the provisioning status of  **Node pools** is **Succeeded**.
1. Navigate to the **Infrastructure Resource group** referenced in the cluster creation process.
1. Select the **Virtual Machine Scale Set** resource named **aks-system-\<random-number>\-vmss**.
1. Select **Scaling**. From the resulting screen, locate the **Manual Scale** section and change the **Instance Count** to **0**. Select **Save**.
1. In the **Settings** section of the **VMSS** tab:
    - Select **Instances**. The instances disappear as they're deleted.
    - Select **Add network interface**. A **Create Network Interface** tab appears. 
2. On the **Create Network Interface** tab:
    - Enter a **Name** for the network interface, mark the **NIC network security group** as **None**. 
    - Attach the network interface to your subnet based on your requirements, and select **Create**. Repeat this step for each data plane port required in the Virtual Machine Scale Set template.
3. Open a separate window and navigate to the **Azure Resource Explorer**. On the left side of the screen, locate the **Subscription** for this cluster.
1. In the Azure Resource Explorer, find the **Infrastructure Resource group** for the cluster. Select **providers** \> **Microsoft.Compute** \> **virtualMachineScaleSets** \> **\<your VMSS name\>**. 
1. Select the VMM, then select and change from **Read Only** to **Read/Write**.
1. Choose **Edit** from the **Data** section of the screen.
1. For each of your data planes, ensure that the **enableAcceleratedNetworking** and the **enableIPForwarding** fields are set to **true**. If they're set to **false**:
    1. Remove the **ImageGalleriesSection** from the json file.
    1. Change the fields to **true** and select the green **Patch** button at the top of the screen.
    1. Return to the Azure portal. Navigate to the cluster resource in the original resource group and scale it up to the desired number of workers.
    
## Next steps

- Learn about the [Deployment order on Azure Kubernetes Services](concept-deployment-order.md).
- [Deploy a cluster on Advanced Kubernetes Services (AKS)](quickstart-deploy-cluster.md).
- [Deploy Azure Operator 5G Core observability on Azure Kubernetes Services (AKS)](quickstart-deploy-observability.md).
- [Deploy a network function on Advanced Kubernetes Services (AKS)](quickstart-deploy-network-functions.md)
