---
title: Deploy Azure Operator 5G Core on Azure Kubernetes Service
description: Learn how to deploy Azure Operator 5G Core on the Azure Kubernetes Service
author: HollyCl
ms.author: HollyCl
ms.service: azure
ms.topic: how-to #required; leave this attribute/value as-is.
ms.date: 02/13/2024

---

# Deploy Azure Operator 5G Core on Azure Kubernetes Service

This article shows you how to deploy Azure Operator 5G Core on the Azure Kubernetes Service. The first portion discusses the initial cluster creation; the second shows you how to modify the cluster to add the data plane ports.

## Prerequisites

To deploy on the Azure Kubernetes service, you must have the following configurations:

- [Resource Group/Subscription](../cost-management-billing/manage/create-enterprise-subscription.md)
- The [Azure Operator 5G Core release version and corresponding Kubernetes version](overview-product.md#compatibility)
- [Networks created for network functions](#create-networks-for-network-functions)
- Sizing (the number of worker nodes/VM sizes/flavors/subnet sizes)
- Availability Zones
- Federations installed
- Appropriate [roles and permissions](../role-based-access-control/role-assignments-portal.md) in your Tenant to create the cluster, modify the Azure Virtual Machine Scale Sets, and [add user defined routes](../virtual-network/virtual-networks-udr-overview.md) to virtual network in case you’re going to deploy UPF. Validation was done with Subscription level contributor access. However, access/ role requirements can change over time as code in Azure changes.
 

## Create networks for network functions

For SMF/AMF specifically, you must have the following frontend VIP IPs:

- N2 secondary and primary
- S1, S6, S11, S10
- N26 AMF and MME 

Topology and quantity of Vnets and Subnets can differ based on your custom requirements. For more information, see Quickstart: Use the Azure portal to create a virtual network [this article](../virtual-network/quick-create-portal.md). 

A reference deployment of Azure Operator 5G Core, per cluster, has one virtual network and three constituent subnets, all part of the same virtual network.

- One for Azure Kubernetes Services itself – a /24
- One for the VIPs that the Azure Kubernetes Services creates – a /25
- A utility subnet that points to the data plane ports - /26

User defined routes (UDRs) are added to other virtual networks that point to this virtual network. Traffic is then pointed to the cluster for data plane and signaling traffic.

> [!NOTE]
> In a reference deployment, as more clusters are added, more subnets are added to the same vnet.

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
1. Turn **Azure monitor** to **off**.
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
    
## Modify SMF or AMF network function 

For the VIP IPs for AMF from the previous section, depending on your network topology, create a single or multiple Azure LoadBalancer(s) of type **Microsoft.Network/loadBalancers** standard SKU, Regional.

Frontend IP configuration for this LoadBalancer should come based on the ip configuration from the input requirements.

### Backend LoadBalancer rules

The backend of this load balancer should point to the data plane ports you created for the requisite networks you created. For instance, if you have a data plane port for n26 interface specifically, attach the load balancer backend address pool to that n26 data plane nic port. For example:

```
"frontendPort": 0,
"backendPort": 0,
"enableFloatingIP": true,
"idleTimeoutInMinutes": 4,
"protocol": "All",
"enableTcpReset": false,
"loadDistribution": "SourceIP",
"disableOutboundSnat": true,
```
## Health probes

For health probes, use the following settings:
 
```
Protocol: TCP, intervalInSeconds: 5, numberOfProbes: 1, probeThreshold: 1, ProbePort: 30100.
```

## Create a Network Function Service server 

Azure Operator 5G Core requires Network Function Service (NFS) storage. Follow [these instructions](../storage/files/storage-files-quick-create-use-linux.md) to create this storage.

```azurecli
$RG_NAME – The name of your resource group
$STORAGEACCOUNT-NAME – A unique name for this storage account
$VNET_NAME – The name of your private vnet
$CONNECTION_NAME – A unique name for this private connection
$SUBNET_NAME – The name of your subnet that’s used to connect to your AKS
$STORAGE_RESOURCE – A unique name for this storage resource

# Create Storage Account
$ az storage account create --resource-group $RG_NAME --name $STORAGEACCOUNT_NAME --location $AZURE_REGION --sku Premium_LRS --kind FileStorage

# Disable secure transfer
$ az storage account update -g $RG_NAME -n $STORAGEACCOUNT_NAME--https-only false

# Disable subnet polices
$ az network vnet subnet update --name $SUBNET_NAME --resource-group $RG_NAME --vnet-name $VNET_NAME --disable-private-endpoint-network-policies true

# Create private endpoint for NFS mount
$ az network private-endpoint create --resource-group $RG_NAME --name $PRIVATE_ENDPOINT_NAME –location $LOCATION --subnet $SUBNET_NAME--vnet-name $VNETNAME --private-connection-resource-id $STORAGE_RESOURCE

--group-id "file" --connection-name snet1-cnct
```

## Next steps

- Learn about the [Deployment order on Azure Kubernetes Services](concept-deployment-order.md).
- [Deploy Azure Operator 5G Core observability](quickstart-deploy-observability.md).
- [Deploy a network function](quickstart-deploy-network-functions.md).
