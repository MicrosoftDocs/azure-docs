---
title: Run your Stream Analytics in Azure virtual network
description: This article describes how to run an Azure Stream Analytics job in an Azure virtual network.
author: ahartoon
ms.author: anboisve
ms.service: azure-stream-analytics
ms.topic: how-to
ms.date: 05/09/2025
ms.custom: references_regions, ignite-2024
---

# Run your Azure Stream Analytics job in an Azure Virtual Network
This article describes how to run your Azure Stream Analytics (ASA) job in an Azure virtual network. 

## Overview 
Virtual network support enables you to lock down access to Azure Stream Analytics to your virtual network infrastructure. This capability provides you with the benefits of network isolation and can be accomplished by [deploying a containerized instance of your ASA job inside your Virtual Network](../virtual-network/virtual-network-for-azure-services.md). Your virtual network injected ASA job can then privately access your resources within the virtual network via: 

- [Private endpoints](../private-link/private-endpoint-overview.md), which connect your virtual network injected ASA job to your data sources over private links powered by Azure Private Link.   
- [Service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md), which connect your data sources to your virtual network injected ASA job. 
- [Service tags](../virtual-network/service-tags-overview.md), which allow or deny traffic to Azure Stream Analytics. 

## Available Regions 
Virtual network integration is currently supported in the following regions:

**East US, East US 2, West US, West US 2, Central US, North Central US, Central Canada, West Europe, North Europe, Southeast Asia, Brazil South, Japan East, UK South, Central India, Australia East, France Central, Germany West Central, and UAE North.**

If your region is not listed and you're interested in using this capability, please **fill out this [form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbRzFwASREnlZFvs9gztPNuTdUMU5INk5VT05ETkRBTTdSMk9BQ0w3OEZDQi4u)**. 

We evaluate requests based on demand and feasibility, and will notify you if we are able to support your region.

## Prerequisites 

- A **General purpose V2 (GPV2) Storage account** is required for virtual network injected ASA jobs.   
    - Virtual network injected ASA jobs require access to metadata such as checkpoints to be stored in Azure tables for operational purposes.   
    - If you already have a GPV2 account provisioned with your ASA job, no extra steps are required.   
    - Users with higher scale jobs with Premium storage are still required to provide a GPV2 storage account.   
    - If you wish to protect storage accounts from public IP based access, consider configuring it using Managed Identity and Trusted Services as well. 
    
        For more information on storage accounts, see [Storage account overview](../storage/common/storage-account-overview.md) and [Create a storage account](../storage/common/storage-account-create.md?tabs=azure-portal.md).  
- An **Azure Virtual Network**, you can use existing or [create one](../virtual-network/quick-create-portal.md). 
- An operational [**Azure Nat Gateway**](../nat-gateway/quickstart-create-nat-gateway-portal.md), see IMPORTANT note below.
   
    > [!IMPORTANT]
    > ASA virtual network injected jobs use an internal container injection technology provided by Azure networking.
    >
    > To enhance the security and reliability of your Azure Stream Analytics jobs, you will need to either:
    >
    > - Configure a NAT Gateway: This will ensure that all outbound traffic from your VNET is routed through a secure and consistent public IP address.
    > 
    > - Disable Default Outbound Access: This will prevent any unintended outbound traffic from your VNET, enhancing the security of your network.
    > 
    > Azure NAT Gateway is a fully managed and highly resilient Network Address Translation (NAT) service.  When configured on a subnet, all outbound connectivity uses the NAT gateway's static public IP addresses.
    :::image type="content" source="./media/run-job-in-virtual-network/vnet-nat.png" alt-text="Diagram showing the architecture of the virtual network.":::
    
    For more information about Azure NAT Gateway, see [Azure NAT Gateway](../nat-gateway/nat-overview.md). 

- When configuring Azure IoT Hub with private endpoints, ensure that you also configure a private endpoint and corresponding DNS settings for the built-in Event Hubs-compatible endpoint. IoT Hub utilizes this endpoint to route messages, and without proper DNS resolution, services like Azure Stream Analytics may fail to connect.
- For guidance on setting up private endpoints and DNS for IoT Hub and Event Hubs, refer to the following resources:

    - [IoT Hub support for virtual networks with Azure Private Link](../iot-hub/virtual-network-support.md)
    - [Integrate Azure Event Hubs with Azure Private Link Service](../event-hubs/private-link-service.md)
    - [Azure Private Endpoint DNS configuration](../private-link/private-endpoint-dns.md)

## Subnet Considerations 
Virtual network integration depends on a dedicated subnet. 

When configuring your delegated subnet, it is crucial to consider the IP range to accommodate both current and future requirements for your ASA workload. Since the subnet size cannot be modified once established, it is recommended to select a subnet size that can support the potential scale of your job. Additionally, be aware that Azure Networking reserves the first five IP addresses within the subnet range for internal use.

The scale operation affects the real, available supported instances for a given subnet size.  

**Considerations for estimating IP ranges**:

- Make sure the subnet range doesn't collide with ASA’s subnet range. Avoid IP range 10.0.0.0 to 10.0.255.255 as it's used by ASA. 
- Reserve: 
    - **Five** IP addresses for Azure Networking 
    - **One** IP address is required to facilitate features such as sample data, test connection, and metadata discovery for jobs associated with this subnet. 
    - **Two** IP addresses are required for every six streaming unit (SU) or one SU V2 (ASA’s V2 pricing structure is launching July 1, 2023, see [here](https://aka.ms/AzureStreamAnalyticsisLaunchingaNewCompetitivePricingModel) for details)  

**Subnet Delegation and Release Behavior**:

- When you enable virtual network integration for an Azure Stream Analytics (ASA) job, the Azure portal automatically delegates the specified subnet to the ASA service.

- ASA will automatically undelegate the subnet in either of the following cases:
    - You disable virtual network integration for the last ASA job using that subnet via the Azure portal.
    - You delete the last ASA job associated with the subnet.

Note: Multiple ASA jobs can share the same subnet. The "last job" refers to the point when no other ASA jobs are using that subnet. Once the last job is removed, ASA releases the delegated subnet. This may take a few minutes to complete.

**Subnet Must Allow Intra-Subnet Traffic**:

- The subnet configuration must enable intra-subnet network traffic.
- This means that it must allow inbound and outbound traffic where both the source and destination IP addresses reside within the same subnet. Learn more [here](../virtual-network/network-security-group-how-it-works.md#intra-subnet-traffic).


## Set up virtual network integration  

### Azure portal
1. From the Azure portal, navigate to **Networking** from menu bar and select **Run this job in virtual network**. This step informs us that your job must work with a virtual network: 
1. Configure the settings as prompted and select **Save**. 

    :::image type="content" source="./media/run-job-in-virtual-network/networking-page.png" alt-text="Screenshot of the Networking page for a Stream Analytics job.":::
 
## VS Code

1. In Visual Studio Code, reference the subnet within your ASA job. This step tells your job that it must work with a subnet. 
1. In the `JobConfig.json`, set up your `VirtualNetworkConfiguration` as shown in the following image.

    :::image type="content" source="./media/run-job-in-virtual-network/virtual-network-configuration.png" alt-text="Screenshot of the sample virtual network configuration." lightbox="./media/run-job-in-virtual-network/virtual-network-configuration.png":::
    

## Set up an associated storage account  
1. On the **Stream Analytics job** page, select **Storage account settings** under **Configure** on the left menu.
1. On the **Storage account settings** page, select **Add storage account**.
1. Follow instructions to configure your storage account settings.

    :::image type="content" source="./media/run-job-in-virtual-network/storage-account-settings.png" alt-text="Screenshot of the Storage account settings page of a Stream Analytics job." :::

    
> [!IMPORTANT]
> - To authenticate with connection string, you must disable the storage account firewall settings. 
> - To authenticate with Managed Identity, you must add your Stream Analytics job to the storage account's access control list for Storage Blob Data Contributor role and 
Storage Table Data Contributor role. If you do not give your job access, the job will not be able to perform any operations. For more information on how to grant access, see Use Azure RBAC to assign a managed identity access to another resource. 

## Permissions 
You must have at least the following Role-based access control permissions on the subnet or at a higher level to configure virtual network integration through Azure portal, CLI or when setting the virtualNetworkSubnetId site property directly: 

| Action | Description |
| ------ | ------------ | 
| `Microsoft.Network/virtualNetworks/read` | Read the virtual network definition | 
| `Microsoft.Network/virtualNetworks/subnets/read` | Read a virtual network subnet definition |
| `Microsoft.Network/virtualNetworks/subnets/join/action` | Joins a virtual network |
| `Microsoft.Network/virtualNetworks/subnets/write` | Optional. Required if you need to perform subnet delegation |


If the virtual network is in a different subscription than your ASA job, you must ensure that the subscription with the virtual network is registered for the `Microsoft.StreamAnalytics` resource provider. You can explicitly register the provider by following [this documentation](../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider), but it's automatically registered when creating the job in a subscription. 

## Limitations 

- Virtual network jobs require a minimum of one SU V2 (new pricing model) or six SUs (current) 
- Make sure the subnet range doesn't collide with ASA subnet range (that is, don't use subnet range 10.0.0.0/16). 
- ASA jobs and the virtual network must be in the same region. 
- The delegated subnet can only be used by Azure Stream Analytics. 
- You can't delete a virtual network when it's integrated with ASA. You must disassociate or remove the last job* on the delegated subnet.  
- We don't support Domain Name System (DNS) refreshes currently. If DNS configurations of your virtual network are changed, you must redeploy all ASA jobs in that virtual network (subnets also need to be disassociated from all jobs and reconfigured). For more information, see [Name resolution for resources in Azure virtual networks](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md?tabs=redhat) for more information.   

## Access on-premises resources 
No extra configuration is required for the virtual network integration feature to reach through your virtual network to on-premises resources. You simply need to connect your virtual network to on-premises resources by using ExpressRoute or a site-to-site VPN. 

## Pricing details 
Outside of basic requirements listed in this document, virtual network integration has no extra charge for use beyond the Azure Stream Analytics pricing charges. 

## Troubleshooting 
The feature is easy to set up, but that doesn't mean your experience is problem free. If you encounter problems accessing your desired endpoint, contact Microsoft Support. 

> [!NOTE]
> For direct feedback on this capability, reach out to [askasa@microsoft.com](mailto:askasa@microsoft.com). 
