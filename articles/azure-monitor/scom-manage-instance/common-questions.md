---
ms.assetid: 
title: Azure Monitor SCOM Managed Instance frequently asked questions
description: This article summarizes frequently asked questions about Azure Monitor SCOM Managed Instance.
author: PriskeyJeronika-MS
ms.author: v-gjeronika
manager: jsuri
ms.date: 05/24/2024
ms.service: system-center
ms.subservice: operations-manager-managed-instance
ms.topic: faq
---

# Azure Monitor SCOM Managed Instance frequently asked questions

This article summarizes frequently asked questions about Azure Monitor SCOM Managed Instance.

## Virtual Network (VNet)

**What regions do the VNet need to be in?**

To maintain latency, we recommend you have the VNet in the same region as your other Azure resources.

**What address range does the VNet need?**

The minimum address space is /27 (which means /28 and above wouldn't work).

**How many subnets does the VNet need to have?**

- VNet needs two subnets. 
    - For SCOM Managed Instance
    - For SQL Managed Instance
- The subnet for SQL Managed Instance instance will be a delegated (dedicated) subnet and won't be used by the SCOM Managed Instance. Name the subnets accordingly to avoid confusion in the future while you create the SQL Managed Instance/SCOM Managed Instance.

**What address range do the two subnets need?**

The minimum address space needs to be /27 for SQL MI subnet and /28 for the SCOM Managed Instance subnet.

**Do the subnets need to specify a NAT gateway or Service Endpoint?**

No, both the options can be left blank.

**Are there limitations on the security options in the Create VNet experience (BastionHost, DDoS, Firewall)?**

No, you can disable all of them or enable any of them based on your organization's preferences.

**I created separate VNets in Azure. What steps do I need to take?**

If you have multiple VNets created, you need to peer your VNets. If you're peering any two networks, ensure to peer from both networks to each other. Thus, if you peer three networks, you need to do six peerings. For more information on peering, see [Azure Virtual Network peering](/azure/virtual-network/virtual-network-peering-overview).

**What options do I select while peering?**

- You need to specify a peering name (in the field **Peering link name**).
- The first name is used to name the peer network from the current network to the other network. The second name is used to name the peer network from the other network to this network.
- In the section *Virtual Network*, specify the name of the VNet that you're peering. If you can't find the VNet, you can search for it using the *Resource ID*. Retain the rest of the options as default.

     :::image type="Add peering" source="media/operations-manager-managed-instance-common-questions/add-peering-inline.png" alt-text="Screenshot showing add peering screen." lightbox="media/operations-manager-managed-instance-common-questions/add-peering-expanded.png":::

## SQL managed instance

**I don't see my region in SQL MI. How do I solve that?**

1. If you don't see the region that you want to choose (West US or West Europe) in the list of regions, select **Not seeing a region**, and then select **Request quota increase for your subscription**.

    :::image type="Region error" source="media/operations-manager-managed-instance-common-questions/region-error.png" alt-text="Screenshot showing region error.":::

1. Enter the required fields in **Basics** and go to **Details** to enter the **Problem details**.

    :::image type="New support request" source="media/operations-manager-managed-instance-common-questions/new-support-request-inline.png" alt-text="Screenshot showing new support request." lightbox="media/operations-manager-managed-instance-common-questions/new-support-request-expanded.png":::

1. Select **Enter details**. **Quota details** page opens on the right pane. In *Region*, choose the desired region and change the limits as desired (10 subnets and 500 vCores should suffice). Select **Save and continue** and then select **Next: Review + create >>** to raise the ticket. It might take 24 hours for the ticket to get resolved. Wait for it to get resolved before proceeding to create the SQL MI instance.

## Azure role-based access control (RBAC)

**What is Azure RBAC?**

Azure RBAC is the role-based access control system that Azure follows while granting permissions. For more information, see [Azure role-based access control](/azure/role-based-access-control/overview). 

Azure RBAC is divided into Azure roles and Azure Active Directory roles. At a high level, Azure roles control permissions to manage Azure resources, while Azure Active Directory roles control permissions to manage Azure Active Directory resources. The following table compares some of the differences.

:::image type="Comparision of Azure roles and Azure active directory roles" source="media/operations-manager-managed-instance-common-questions/comparision-of-azure-roles-and-azure-active-directory-roles.png" alt-text="Screenshot of Azure roles and Azure active directory roles.":::

Below is the high-level view of how the classic subscription administrator roles, Azure roles, and Azure AD roles are related.

:::image type="Azure active directory roles" source="media/operations-manager-managed-instance-common-questions/azure-active-directory-roles.png" alt-text="Screenshot of Azure active directory roles.":::

**What is a Global Administrator role?**

Users with the Global administrator role have access to all administrative features in Azure Active Directory and services that use Azure Active Directory identities, such as:
   - Microsoft 365 Defender portal
   - Compliance portal
   - Exchange Online
   - SharePoint Online
   - Skype for Business Online

## Other queries

**What if there's an error during the deployment?**

During the deployment phase, there can be several reasons why deploying a SCOM Managed Instance shows an error. It might be some backend error, or you might have given the wrong credentials for one of the accounts. In the scenario of an error during deployment, it's best to delete the instance and create one again. For more information, see [Troubleshoot issues with Azure Monitor SCOM Managed Instance](./troubleshoot-scom-managed-instance.md).

**What is the procedure to delete an instance?**

You can either delete the instance from the instance view itself or from the *Resource Group* view. 

In the instance view, select *Delete* from the top menu and wait for the confirmation that the instance has been deleted. 

:::image type="Delete option" source="media/operations-manager-managed-instance-common-questions/delete.png" alt-text="Screenshot showing delete option.":::

Alternatively, go to your resource group view (search for Resource Group in the Azure search bar, and in the list of results, open your resource group). If you created a separate resource group for SCOM Managed Instance, delete the resource group. Otherwise, in the resource group, search for your instance and select *Delete*. 

Once the instance is deleted, you'll also have to delete the two databases created in SQL MI. In the resource view, select the two databases (depending on what name you gave to your SQL MI instance) and select **Delete**. With the two databases deleted, you can recreate your SCOM Managed Instance.

**If an Arc instance to connect to private cloud with some resources is available, will SCOM Managed Instance scale to those resources?**

Currently not supported. Today, independent of System Center Operations Manager, customers can install an Arc agent on a VM running on-premises and start seeing the resource in the Azure portal. Once they start seeing the resource in the Azure portal, they can use the Azure services for that resource (and incur the appropriate costs).

**How will network monitoring be done on SCOM Managed Instance?**

SCOM Managed Instance and System Center Operations Manager share the same feature set. You can use the same Management packs that you use in on-premises to carry out network monitoring via SCOM Managed Instance.

**How is SCOM Managed Instance different from running System Center Operations Manager in Azure VMs?**

- SCOM Managed Instance is native to Azure, while running System Center Operations Manager in Azure VMs isn't a native solution. This means, SCOM Managed Instance integrates smoothly with Azure and all of Azure’s updates are available to SCOM Managed Instance.
- In terms of ease of deployment, SCOM Managed Instance is easy to deploy, while running VMs in Azure takes possibly months of effort (and requires in-depth technical knowledge).
- SCOM Managed Instance uses SQL MI as the backend for database management by default.
- SCOM Managed Instance comes with built-in scaling, patching features, and integrated reports.

**What does line-of-sight mean?**

Being in the same private network so that the IPs assigned to each component in the network can be a private IP.

**Can I view the SCOM Managed Instance resources and VMs in my subscription?**

Since this instance requires you to create the SCOM Managed Instance in your subscription, all the SCOM Managed Instance resources (including the VMs) will be visible to you. However, we recommend not to do any actions on the VMs and other resources while you're operating SCOM Managed Instance to avoid unforeseen complexities.

## Monitoring scenarios

**Can I reuse existing System Center Operations Manager Gateway servers with SCOM Managed Instance?**

No.  

SCOM Managed Instance Managed Gateways can be configured on any Azure and Arc-enabled server, which doesn’t have Operations Manager Gateway software on it. If you want to reuse Operations Manager on-premises Gateway servers with SCOM Managed Instance, uninstall Operations Manager Gateway software on it. To configure SCOM Managed Instance Managed Gateway, see [Configure monitoring of servers via SCOM Managed Instance Gateway](monitor-arc-enabled-vm-with-scom-managed-instance.md#configure-monitoring-of-servers-via-scom-managed-instance-gateway).

**Can SCOM Managed Instance Managed Gateway multi-home with System Center Operations Manager on-premises Management server?**

No. Multi-homing on SCOM Managed Instance Managed Gateway isn't possible.  

**What certificate is used in SCOM Managed Instance Managed Gateway for authentication?**

The certificates are assigned by Microsoft and are signed by CA. There's no requirement for manual management of certificates on Managed Gateways.  

**Can SCOM Managed Instance monitor on-premises machines without Arc installed?**

Yes, if there's a direct connectivity (line-of-sight) between SCOM Managed Instance and on-premises machine via VPN/ER, you can monitor these machines. For more information, see [Configure monitoring of on-premises servers](monitor-arc-enabled-vm-with-scom-managed-instance.md#configure-monitoring-of-on-premises-servers).

## Monitored Resources (Agents)/Managed Gateway Servers

**Can we perform actions on on-premises monitored resources?**

You can't perform actions on the on-premises monitored resources, but can view them. Additionally, if the monitored objects are deleted, the portal will automatically remove those on-premises objects after six hours.

**How often are the connectivity synchronizations performed for monitored resources and managed gateways?**

The monitored resources and managed gateways connectivity status are updated every minute, you can view the same in the Properties context menu.

**What happens if an agent is already installed on the machine?**

The same agent will be used and multi-homed to the SCOM Managed Instance.

**Which extension version of SCOM Managed Instance supports agent (monitored resource) or managed gateway servers?**

The capability is enabled with SCOM Managed Instance extension >=91.

**How can we view the complete list of properties for a monitored resource or a managed gateway?**

You can view the list of properties for a monitored resource or a managed gateway in the **Properties** context menu.

**Which machine types are eligible for monitoring?**

SCOM Managed Instance enables monitoring of Azure and Arc-enabled machines. Additionally, it displays information about on-premises machines that are directly connected to the SCOM Managed Instance.

**What is the expected duration for the health and connectivity states to be updated after onboarding?**

The initial retrieval of health and connectivity states on the portal takes approximately five to seven minutes. Subsequently, heartbeats occur every minute.

**What is the minimum required .NET version for the agent (monitored resources) or gateway servers?**

The minimum required .NET Framework version is 4.7.2.

**How do we check whether the agent (monitored resources) or gateway has line of sight to Azure endpoint <*.workloadnexus.com>?**

On the agent/gateway server to be onboarded,  
- Check if it has the outbound connectivity to *.workloadnexus.azure.com 
- Check if the firewall has been opened for this URL.

For example: `Test-NetConnection westus.workloadnexus.azure.com -Port 443`

**How can we determine if an agent (monitored resource) or gateway has a line of sight to the management servers?**

On the agent/gateway server to be onboarded, check if it has the outbound connectivity to management servers load balancers endpoint.

For example: `Test-NetConnection wlnxMWH160LB.scommi.com -Port 5723`

**How can we verify if the machine has TLS 1.2, or a higher version enabled, and TLS 1.1 disabled?**

The agent and gateway server machines needs TLS 1.2 or more enabled, and TLS 1.1 disabled to get the successful onboarding and monitoring.
 
For more information, see [the process for enabling TLS 1.2](/mem/configmgr/core/plan-design/security/enable-tls-1-2).


## Monitored Resources (Agents)

**Are Linux machines permitted for monitoring?**

Currently, we don't support monitoring of Azure and Arc-enabled Linux machines. However, they can be managed via the Arc-enabled gateway servers.

**Is it possible to configure an agent to communicate with multiple SCOM Managed Instances?**

No. You can't configure an agent to communicate with multiple SCOM Managed Instances, but it can have a multi-home configuration for on-premises System Center Operations Manager and a SCOM Managed Instance.

## Managed Gateway Servers

**Is it permissible to use Azure Windows machines as gateway servers?**

Currently, only Arc-enabled machines are permitted as gateway servers.

**Is it possible to configure gateway servers with multi-homing?**

Currently, multi-homing for gateway servers isn't supported.

## Next steps

[SCOM Managed Instance overview](overview.md)