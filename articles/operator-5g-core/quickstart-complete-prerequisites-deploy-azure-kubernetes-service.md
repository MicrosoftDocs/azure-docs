---

title: Prerequisites to deploy Azure Operator 5G Core Preview on Azure Kubernetes Service
description: Learn how to complete the prerequisites necessary to deploy Azure Operator 5G Core Preview on the Azure Kubernetes Service.
author: HollyCl
ms.author: HollyCl
ms.service: azure-operator-5g-core
ms.custom: devx-track-azurecli
ms.topic: quickstart #required; leave this attribute/value as-is.
ms.date: 05/31/2024
---

# Quickstart: Complete the prerequisites to deploy Azure Operator 5G Core Preview on Azure Kubernetes Service

This article shows you how to prepare the prerequisite infrastructure required to deploy the Azure Operator 5G Core. The first section discusses the preparation of the Azure Kubernetes Service cluster; the second shows you how to modify the cluster to add extra accelerated networking interfaces - Single Root I/O Virtualization (SR-IOV) interfaces, which we also refer to these interfaces interchangeably as data plane ports. Lastly, we include the preparation of the Azure loadbalncer and storage services required distribute traffic and store data from the cluster. 

## Prerequisites

To deploy on the Azure Kubernetes Service, you need the following configurations:

- [Resource Group/Subscription](../cost-management-billing/manage/create-enterprise-subscription.md)
- The [Azure Operator 5G Core release version and corresponding Kubernetes version](overview-product.md#compatibility)
- [Azure Kubernetes Service (AKS) system and user node pool vm series and sizing](../virtual-machines/dv5-dsv5-series.md) 
    - Recommended node series: system node - D8s_v5,  user node - D16s_v5
    - Recommended node count: system node-3, user node-8   
- Appropriate [roles and permissions](../role-based-access-control/role-assignments-portal.yml) in your tenant to create the cluster and modify the Azure Virtual Machine Scale Sets.
- Detailed Networks and subnet planning – [user defined routes](../virtual-network/virtual-networks-udr-overview.md) can be added to virtual networks and network interfaces as required.
- [Azure Active Directory/Entra Application ID](/entra/fundamentals/whatis)with subscription level contributor access. Throughout this article, leave unspecified settings as default.
- Express route connectivity - required to connect your Azure infrastructure to your on-premises infrastructure and exchange IP routes. The express route and required vpn gateway setup is outside the scope of this document. 

## Assign subnets for specific network functions

Azure assigns a virtual network address by default, but based on the network architecture, detailed network and subnet planning is required.

The reference deployment of Azure Operator 5G Core is a single cluster, with one virtual network and multiple constituent subnets as part of the same virtual network.

These components include:
- Azure virtual network address space - /12 
- Azure Kubernetes Services subnet –  /16
- All other subnets - /24

Additional IP subnets exist for the Access and Mobility Function (AMF) and User Plane Function (UPF). These subnets specifically require data plane ports for communication with external node elements including the radio access network (RAN).

|Infrastructure subnet  |Use  |
|---------|---------|
| Infrastructure subnet     |   storage and Azure key Vault      |
|AKS-services subnet     |  Kubernetes Container Network Interface (CNI)        |
|AO5GC_OAM subnet     |   operations and management; observability and inter-network function communications       |
|UPF_N3_subnet     | N3 accelerated network interface        |
|UPF_N6_subnet     | N6 accelerated network interface        |
|AMF_N2_subnet     | N2 accelerated network interface        |
|AMF_N2-LB_subnet     | SCTP loopback address         |
|UPF_N3-LB_subnet     | GTP-U loopback address        |
|UPF_N6-LB_subnet     | Data networks names (DNN) loopback addresses       |

The topology and quantity of vnets and subnets can differ based on your custom requirements. For more information, see [Quickstart: Use the Azure portal to create a virtual network](../virtual-network/quick-create-portal.md) to create a virtual network.

> [!NOTE]
> In the reference deployment, as more clusters are added, more subnets are added to the same vnet.

## Create the Azure Kubernetes Cluster

To deploy an Azure Kubernetes Service (AKS) cluster, you should have a basic understanding of [Kubernetes concepts](../aks/concepts-clusters-workloads.md) and advanced knowledge of Azure networking, consistent with Azure Networking Certification. Additionally:

- If you don't have an [Azure subscription](../cost-management-billing/manage/create-enterprise-subscription.md), create an [Azure free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
- If you're unfamiliar with the Azure Cloud Shell, review [What is Azure Cloud Shell?](../cloud-shell/overview.md)
- Make sure that the identity you use to create your cluster has the appropriate minimum permissions. For more information on access and identity for AKS, see [Access and identity options for Azure Kubernetes Service (AKS)](../aks/concepts-identity.md).
 
Once you complete these steps, you can create the AKS cluster:

1. Navigate and sign in to the [Azure portal](https://ms.portal.azure.com).
2. On the Azure portal home page, select **Create a Resource**.
3. In the **Categories** section, select **Containers > Azure Kubernetes Service (AKS)**.
4. On the **Basics** tab:
    - Enter the **Subscription**, **Resource Group**, **Kubernetes cluster name**, **Availability zones**, and **AKS pricing tier** based on your Azure Operator 5G Core requirements.
    - Disable **Automatic upgrade**.
    - Select **Local accounts with Kubernetes RBAC** for the **Authentication and Authorization** method.
 
     :::image type="content" source="media/quickstart-complete-prerequisites-deploy-azure-kubernetes-service/basic-tab-fields.png" alt-text="Screenshot of the Basic tab of AKS containers showing fields that must be completed to create an AKS cluster.":::  

1. Navigate to the **Add a node pool** tab, then modify the node details where required to meet infrastructure standards. In this setup, there are two node pools.  
    - Rename the sample **Node pool names** from **agentpool** and  **userpool** to **system** and **worker**. 
    - Select the appropriate pool name to edit the names and choose VM series and size based on the recommended sizing, availability, and capacity requirements.   
    - Select **system** for the **Node pool name** and **System** as the **Mode** type.
    - Select **Azure Linux** as the **OS SKU**.
    - Select **Zones 1,2,3** as the **Availability zones** and leave the **Enable Azure Spot instances** field unmarked.
    - Select **Manual** as the **Scale method**.
    - Select the appropriate **Node count** for each pool as shown.
    - Select **250** as the **Max pods per node**, and don't choose to **Enable public IP per node**. Use the default values for the remaining settings.
    - Select **update** and move to the **Networking** tab.
      
    > [!NOTE]
    > Update the worker node pool details as shown.
  
    :::image type="content" source="media/quickstart-complete-prerequisites-deploy-azure-kubernetes-service/add-a-node-tab.png" alt-text="Screenshot of the Add a node tab displaying the fields the user must update.":::

    :::image type="content" source="media/quickstart-complete-prerequisites-deploy-azure-kubernetes-service/update-node-pool.png" alt-text="Screenshot of the Create a storage account page showing the Update node pool tab, highlighting the fields that user must update for successful AKS cluster creation.":::

1. Navigate to the **Networking** tab and configure the following settings:
   - Select **Kubenet** for the **Network configuration**. 
   - Select the **Bring your own virtual network** option 
   - Select a **Virtual network** name created earlier. The default is a /16, but this name can be changed as required.
   - Leave the other values as default. 
   - Enter the **DNS name prefix**. 
   - Select **Calico** as the **Network policy**
   - Leave all other values as default.

    :::image type="content" source="media/quickstart-complete-prerequisites-deploy-azure-kubernetes-service/networking-tab.png" alt-text="Screenshot of the Networking tab highlighting the fields the user must configure for a successful AKS cluster creation.":::

7. Unless you have a specific requirement to do otherwise, don't change any values on the **Integrations** tab.
8. Navigate to the **Monitoring tab** and turn Azure monitor to **Off** by ensuring the following settings:
   - **Enable Container Logs** shouldn't be marked. This configuration ensures they're disabled.
   - **Enable Prometheus metrics** should also remain unmarked, and therefore disabled.
   - Leave the **Enable Grafana** box unmarked, and therefore disabled.
   -  Don't **Enable recommended alert rules**. 

    :::image type="content" source="media/quickstart-complete-prerequisites-deploy-azure-kubernetes-service/monitoring-tab.png" alt-text="Screenshot of the Monitoring tab highlighting fields the user must configure for a successful AKS cluster creation.":::

9. Navigate to the **Advanced** tab and mark the box to **Enable secret store CSI driver**. Don't edit any other field.
10. Note the name of the **managed Infrastructure Resource group** displayed. This name is required to modify the cluster nodes and add extra data plane ports.
11. Select **Review + create** once validation completes.

    :::image type="content" source="media/quickstart-complete-prerequisites-deploy-azure-kubernetes-service/advanced-tab.png" alt-text="Screenshot of the Advanced tab showing the checkbox and button user must select to successfully create an AKS cluster.":::

## Modify the cluster to add  more interfaces with Accelerated Networking on the worker node pool

1. Once you successfully create the cluster, navigate to the **settings** section of the AKS cluster and verify that the provisioning status of **Node pools** is **Succeeded**. 
1. Stop the AKS cluster. 
1. Navigate to the **Managed Infrastructure Resource group** referenced during the cluster creation process.
1. Select the **Virtual Machine Scale Set** resource named `aks-worker-<random-number>-vmss`.
1. Navigate to the **Networking > Network Settings tab** to add more data plane ports to the worker nodes to support the defined network subnets earlier. 
1. Select **Add network interface**. A **Create network interface** tab appears:
    
    :::image type="content" source="media/quickstart-complete-prerequisites-deploy-azure-kubernetes-service/create-network-interface-tab.png" alt-text="Screenshot showing the Create network interface tab that appears when you select Add network interface.":::    

6. On the **Create network interface** tab:
    - Enter a **Name** for the network interface. The virtual network is inactive out based on the attached virtual network you define.
    - Select only each **Subnet** that requires accelerated networking.
    - Mark **None** as the **NIC network security group**. Leave every thing else as default. 
    - Select **Create**. 
    - Repeat this step for each data plane port required in the Virtual Machine Scale Set template.
   
    :::image type="content" source="media/quickstart-complete-prerequisites-deploy-azure-kubernetes-service/create-network-interface-tab-detailed.png" alt-text="Screenshot of the Create Network interface tab highlighting the subnet and network security group selections the user should enter."::: 

1. Open a separate window and navigate to the [Azure Resource Explorer](https://resources.azure.com/). 
1. On the left side of the screen, locate the subscription for this cluster.
1. Select **Subscriptions**/**resourceGroups/&lt;your-infrastructure-resource-group-name&gt;/ &lt;providers&gt; Microsoft.Compute &gt; virtualMachineScaleSets &gt;  &lt; your Azure Virtual Machine Scale Sets name>**. 
1.  Select the virtual machine scale set associated with the user node pool, then select and change the option from **Read Only** to **Read/Write**.

    :::image type="content" source="media/quickstart-complete-prerequisites-deploy-azure-kubernetes-service/read-write-option.png" alt-text="Screenshot of buttons on the Azure Resource Explorer page that shows the Read/Write option active.":::

10. Choose **Edit** from the **Data** section of the screen.
11. For each of your data planes ports, ensure that the **enableAcceleratedNetworking** and the **enableIPForwarding** fields are set to **True**.  

    The following shows an example for the AMF_N2_subnet:

    ```properties
    "name": "AMF_N2_SUBNET",
                "properties": {
                  "primary": false,
                  "enableAcceleratedNetworking": true,
                  "disableTcpStateTracking": false,
                  "networkSecurityGroup": {
                    "id": "/subscriptions/<your subscription-id>/resourceGroups/<MC-resource group name>/providers/Microsoft.Network/networkSecurityGroups/xxxxxxxx"
                  },
                  "dnsSettings": {
                    "dnsServers": []
                  },
                  "enableIPForwarding": true,
                  "ipConfigurations": [
                    {
                      "name": "AMF_N2_SUBNET-defaultIpConfiguration",
                      "properties": {
                        "primary": true,
                        "subnet": {
                          "id": "/subscriptions/<your subscription-id>/resourceGroups/<MC-resource group name>/providers/Microsoft.Network/virtualNetworks/<your vnet name>/subnets/AMF_N2"
    ```
12. Remove the image reference from the json shown in Azure Resource Explorer. 
 
    ```properties
    ,
        "imageReference": {
              "id": "/subscriptions/<your subscription-id>/resourceGroups/AKS-CBLMariner/providers/Microsoft.Compute/galleries/AKSCBLMariner/images/V2gen2/versions/202403.04.0"
            }
    ```

13. At the top of the screen next to the **Edit** button, select the green **PUT** button to apply the configuration. 
    
    :::image type="content" source="media/quickstart-complete-prerequisites-deploy-azure-kubernetes-service/green-put-button.png" alt-text="Screenshot of the Azure Resource Explorer page that shows the data option buttons for Patch, Put, and Cancel. The Put button is highlighted.":::

1. Return to the Azure portal. Navigate to the cluster resource in the original managed infrastructure resource group. You should  see multiple accelerated interfaces in the networking section of the worker node pool. Select each interface and confirm **Accelerated networking** is enabled. 
1. Navigate to the **Overview** section of resource group with the AKS cluster, and scale it up to the desired number of workers. Then start the cluster. This action starts the associated node pools in the cluster.

## Create Load Balancer(s)for N2 Stream Control Transmission Protocol (SCTP) associations

An Azure internal Load balancer is required to support N2 SCTP connections between the AMF and RAN.  

### Create a load balancer

Create a load balancer with the following settings, attaching the load balancer to the virtual network resource you created earlier. 

1. Enter your **Subscription**, **Resource group**, and provide a name for your load balancer resource. 
1. Select the appropriate region, the **standard** sku type standard, and the **internal** load balancer, as this load balancer connects to your RAN network on a private IP address via your express route connection.
1. Select **Next** to move to the **Frontend IP configuration**

### Add a frontend IP configuration

1. Provide a **Name** for the front end IP configuration.
1. Select **IPv4** as the address type. 
1. Select the **Virtual network** to attach the load balancer to from the dropdown. This selection should be the virtual network you previously created. 
1. Select the associated subnet (in this configuration **AMF_N2-LB subnet**).
1. Select the **Static** assignment and a nonreserved **IP address** that is used for N2 SCTP associations.  
1. Select **Availability zone** as **Zone-redundant** and **Save**.
    
    :::image type="content" source="media/quickstart-complete-prerequisites-deploy-azure-kubernetes-service/load-balancer-frontend-configuration.png" alt-text="Screenshot of the Create a load balancer page showing the Add frontend IP configuration tab with fields that the user must configure highlighted.":::    

### Add backend pools

1. Provide a **Name** for the backend pool.
1. Select **NIC** as the **Backend Pool Configuration**. 
1. Add the associated machine scale set created earlier `aks-worker-<random-number>-vmss` under the IP configuration.

    :::image type="content" source="media/quickstart-complete-prerequisites-deploy-azure-kubernetes-service/load-balancer-backend-pools.png" alt-text="Screenshot of the Add backend pool tab highlighting the fields for the user to configure.":::

### Add load balancing rules

1. Select the load balancing rules.
1. Provide a **Name** for the rule.
1. Select **Ipv4** as the **IP version**. 
1. Select both the **Frontend IP address** and the associated **Backend pool**. 
1. Select **High availability ports**. 
1. Create a new **Health probe** to be used to check the backend nodes hosting the SCTP service. 
1. Provide a name for the **Health probe** with the following settings: 
    - **Protocol**: HTTP
    - **Port**: 30100
    - **Interval**: 5 

1. Select **Save**.

1. Select **Client IP** as the **Session persistence**, set the **Idle timeout (minutes)** to **4** and **Enable Floating IP**.
1. Select **Save**.

    :::image type="content" source="media/quickstart-complete-prerequisites-deploy-azure-kubernetes-service/add-load-balancing-rule.png" alt-text="Screenshot of the Add load balancing rule tab showing the fields the user must configure.":::

6. Select **Review and create**, then **Create**. 
 
Azure provisions the internal load balancer. Once provisioned, it's attached to your virtual network infrastructure subnet and is visible in your resource group. 

## Create a Network File Storage Server

Azure Operator 5G Core requires Network File Storage (NFS) storage. Use the **Create a storage account** function in the Azure portal to set up the NFS. 

### Basics tab

1. Enter your **Subscription** and **Resource group**. 
1. Provide a **Storage account name**, then select your deployment **Region** and a **Premium Performance**. 
1. Select **File share** as the **Premium account type**, then select **Zone-redundant storage** for **Redundancy**. 
1. Select **Next**. 

    :::image type="content" source="media/quickstart-complete-prerequisites-deploy-azure-kubernetes-service/create-storage-account.png" alt-text="Screenshot of the Create a storage account tab where users must enter the required fields to create the account.":::        

## Advanced tab

1. Don't enable the **Require secure transfer for REST API operations** option.
1. Don't select to **Enable Storage account key access**. 
1. Leave the **Default to Microsoft Entra authorization in the Azure portal** disabled.
1. Select **Next**. 

    :::image type="content" source="media/quickstart-complete-prerequisites-deploy-azure-kubernetes-service/create-storage-account-advanced.png" alt-text="Screenshot of the Create a storage account page showing the Advanced tab. Two selections under the Security section are highlighted for the user to mark the boxes.":::

### Networking tab

1. Select **Disable public access and use private access** for the **Network access** type. 
1. Select **Add a Private endpoint**. The **Create private endpoint** dialog appears. 
    - Select your **Subscription**, **Resource group**, and **Location**.
    - Provide a **Name** for the private endpoint resource.
    - Select **file** as the **Storage sub-resource**.
    - Select the **Virtual network** you created earlier and choose the **Subnet**; in this configuration choose the defined infra subnet. This selection enables file transfer from the AKS cluster and ensures private dns integration is enabled with your subscription and resource group.  
    - Verify the **Private DNS zone** as privatelink.file.core.windows.net and select save. 

     :::image type="content" source="media/quickstart-complete-prerequisites-deploy-azure-kubernetes-service/create-private-endpoint.png" alt-text="Screenshot of the Networking tab showing the available fields in the Create private endpoint section of the page. ":::

1. In the **Network routing** section of the **Networking** tab, select **Microsoft network routing** 
1. Select **Review + create**. 

    :::image type="content" source="media/quickstart-complete-prerequisites-deploy-azure-kubernetes-service/create-storage-account-networking.png" alt-text="Screenshot of the  Networking tab of the Create a storage account page. Two fields are highlighted, indicating that the user must complete these steps before moving on.":::

### View the storage resource

Once storage resource is created:
1. Select the **Data storage** subsection of the menu. 
1. Select **file shares** and create a new file share.
1. Provide a **Name** for your fileshare.
1. Select **protocols NFS**.
1. Select **Review + create**, then **Create**.

You can now view the resource and from the **Overview** page. Note the name of your **Mount path**; it is in the format /mount/<storage_name>/<file_share_name>.

> [!IMPORTANT]
> You'll need the /<storage_name>/<file_share_name> when you deploy AO5GC network functions.

### View the network interface

1. Select the **Networking** subsection of the menu.
1. Select **Private endpoint**, and view the details of the private endpoint. 
1. In the **Overview** section, select the **Network interface**. 

> [!NOTE]
> The Private IP address attached to the NIC - this will be from your AKS subnet range. 

You're now ready to deploy the AO5GC resources. 

## Azure Cloud Services 
 
AO5GC is a telecommunications workload that enables you to offer services to consumer and enterprise end-users. These workloads run on an NFVI layer and may depend on other NFVI services. The NFVI layer may comprise Cloud NFVI functions (for example, those also running in Azure Public Cloud). The related services that AO5GC services may depend on in Cloud NFVI are shown here. They may be updated from time to time by Microsoft.

Azure Cloud NFVi services include: 
 
- Azure Kubernetes Service (AKS): Provides a managed environment for running AO5GC containerized applications.  
- Azure Virtual Network (virtual network): Provides a secure and isolated network for AO5GC components and traffic.  
- Azure Internal Load balancer: Provides load balancing of traffic into the virtual network hosting AO5GC functions.  
- Azure ExpressRoute: Provides a dedicated and private connection between the operator's network and Azure.  
- Azure Arc: Provides a unified management and governance platform for AO5GC applications and services across Azure and on-premises environments.  
- Azure Monitor: Provides a comprehensive solution for monitoring the performance and health of AO5GC applications and services.  
- Microsoft Entra ID: Provides identity and access management for AO5GC users and administrators.  
- Azure Key Vault: Provides a secure and centralized store for managing encryption keys and secrets for AO5GC.  
- Azure VPN Gateway is a service virtual network gateway used to send encrypted traffic between an Azure virtual network and on-premises locations.  
- Azure Bastion provides secure and seamless remote access via RDP and SSH to access Azures virtual machines (VMs) without any exposure through public IP addresses.  
- Azure DNS provides name resolution by using Microsoft Azure infrastructure   
- Azure Storage offers highly available, massively scalable, durable, and secure storage for various data objects in the cloud.  
- Azure Container Registry is a private registry service for building, storing, and managing container images and related artifacts.  
 

## Related content

- Learn about the [Deployment order on Azure Kubernetes Services](concept-deployment-order.md).
- [Deploy Azure Operator 5G Core Preview](quickstart-deploy-5g-core.md).
- [Deploy a network function](how-to-deploy-network-functions.md).
