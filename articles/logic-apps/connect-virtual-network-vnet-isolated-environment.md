---
title: Connect to Azure virtual networks with an ISE
description: Create an integration service environment (ISE) to access Azure virtual networks (VNETs) from Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 08/20/2022
---

# Connect to Azure virtual networks from Azure Logic Apps using an integration service environment (ISE)

For scenarios where Consumption logic app resources and integration accounts need access to an [Azure virtual network](../virtual-network/virtual-networks-overview.md), create an [*integration service environment* (ISE)](connect-virtual-network-vnet-isolated-environment-overview.md). An ISE is an environment that uses dedicated storage and other resources that are kept separate from the "global" multi-tenant Azure Logic Apps. This separation also reduces any impact that other Azure tenants might have on your apps' performance. An ISE also provides you with your own static IP addresses. These IP addresses are separate from the static IP addresses that are shared by the logic apps in the public, multi-tenant service.

When you create an ISE, Azure *injects* that ISE into your Azure virtual network, which then deploys Azure Logic Apps into your virtual network. When you create a logic app or integration account, select your ISE as their location. Your logic app or integration account can then directly access resources, such as virtual machines (VMs), servers, systems, and services, in your virtual network.

![Select integration service environment](./media/connect-virtual-network-vnet-isolated-environment/select-logic-app-integration-service-environment.png)

> [!IMPORTANT]
> For logic apps and integration accounts to work together in an ISE, both must use the *same ISE* as their location.

An ISE has increased limits on:

* Run duration
* Storage retention
* Throughput
* HTTP request and response timeouts
* Message sizes
* Custom connector requests

For more information, review [Limits and configuration for Azure Logic Apps](logic-apps-limits-and-config.md). To learn more about ISEs, review [Access to Azure Virtual Network resources from Azure Logic Apps](connect-virtual-network-vnet-isolated-environment-overview.md).

This article shows you how to complete these tasks by using the Azure portal:

* Enable access for your ISE.
* Create your ISE.
* Add extra capacity to your ISE.

You can also create an ISE by using the [sample Azure Resource Manager quickstart template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.logic/integration-service-environment) or by using the Azure Logic Apps REST API, including setting up customer-managed keys:

* [Create an integration service environment (ISE) by using the Azure Logic Apps REST API](create-integration-service-environment-rest-api.md)
* [Set up customer-managed keys to encrypt data at rest for ISEs](customer-managed-keys-integration-service-environment.md)

## Prerequisites

* An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

  > [!IMPORTANT]
  > Logic app workflows, built-in triggers, built-in actions, and connectors that run in your ISE use a pricing plan 
  > that differs from the Consumption pricing plan. To learn how pricing and billing work for ISEs, review the 
  > [Azure Apps pricing model](logic-apps-pricing.md#ise-pricing). 
  > For pricing rates, review [Azure Apps pricing](logic-apps-pricing.md).

* An [Azure virtual network](../virtual-network/virtual-networks-overview.md) that has four *empty* subnets, which are required for creating and deploying resources in your ISE and are used by these internal and hidden components:

  * Azure Logic Apps Compute
  * Internal App Service Environment (connectors)
  * Internal API Management (connectors)
  * Internal Redis for caching and performance
  
  You can create the subnets in advance or when you create your ISE so that you can create the subnets at the same time. However, before you create your subnets, make sure that you review the [subnet requirements](#create-subnet).

  * The Developer ISE SKU uses three subnets, but you still have to create four subnets. The fourth subnet doesn't incur any extra cost.

  * Make sure that your virtual network [enables access for your ISE](#enable-access) so that your ISE can work correctly and stay accessible.

  * If you use a [network virtual appliance (NVA)](../virtual-network/virtual-networks-udr-overview.md#user-defined), make sure that you don't enable TLS/SSL termination or change the outbound TLS/SSL traffic. Also, make sure that you don't enable inspection for traffic that originates from your ISE's subnet. For more information, review [Virtual network traffic routing](../virtual-network/virtual-networks-udr-overview.md).

  * If you want to use custom Domain Name System (DNS) servers for your Azure virtual network, [set up those servers by following these steps](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md) before you deploy your ISE to your virtual network. For more information about managing DNS server settings, review [Create, change, or delete a virtual network](../virtual-network/manage-virtual-network.md#change-dns-servers).

    > [!NOTE]
    > If you change your DNS server or DNS server settings, you must restart your ISE so that the ISE can pick up those changes. For more information, review [Restart your ISE](ise-manage-integration-service-environment.md#restart-ISE).

<a name="enable-access"></a>

## Enable access for ISE

When you use an ISE with an Azure virtual network, a common setup problem is having one or more blocked ports. The connectors that you use for creating connections between your ISE and destination systems might also have their own port requirements. For example, if you communicate with an FTP system by using the FTP connector, the port that you use on your FTP system needs to be available, for example, port 21 for sending commands.

To make sure that your ISE is accessible and that the logic apps in that ISE can communicate across each subnet in your virtual network, [open the ports described in this table for each subnet](#network-ports-for-ise). If any required ports are unavailable, your ISE won't work correctly.

* If you have multiple ISE instances that need access to other endpoints that have IP restrictions, deploy an [Azure Firewall](../firewall/overview.md) or a [network virtual appliance](../virtual-network/virtual-networks-overview.md#filter-network-traffic) into your virtual network and route outbound traffic through that firewall or network virtual appliance. You can then [set up a single, outbound, public, static, and predictable IP address](connect-virtual-network-vnet-set-up-single-ip-address.md) that all the ISE instances in your virtual network can use to communicate with destination systems. That way, you don't have to set up extra firewall openings at those destination systems for each ISE.

   > [!NOTE]
   > You can use this approach for a single ISE when your scenario requires limiting the 
   > number of IP addresses that need access. Consider whether the extra costs for 
   > the firewall or virtual network appliance make sense for your scenario. Learn more about 
   > [Azure Firewall pricing](https://azure.microsoft.com/pricing/details/azure-firewall/).

* If you created a new Azure virtual network and subnets without any constraints, you don't need to set up [network security groups (NSGs)](../virtual-network/network-security-groups-overview.md#network-security-groups) in your virtual network to control traffic across subnets.

* For an existing virtual network, you can *optionally* set up [network security groups (NSGs)](../virtual-network/network-security-groups-overview.md#network-security-groups) to [filter network traffic across subnets](../virtual-network/tutorial-filter-network-traffic.md). If you want to go this route, or if you're already using NSGs, make sure that you [open the ports described in this table](#network-ports-for-ise) for those NSGs.

  When you set up [NSG security rules](../virtual-network/network-security-groups-overview.md#security-rules), you need to use *both* the **TCP** and **UDP** protocols, or you can select **Any** instead so you don't have to create separate rules for each protocol. NSG security rules describe the ports that you must open for the IP addresses that need access to those ports. Make sure that any firewalls, routers, or other items that exist between these endpoints also keep those ports accessible to those IP addresses.

* If you set up forced tunneling through your firewall to redirect Internet-bound traffic, review the [forced tunneling requirements](#forced-tunneling).

<a name="network-ports-for-ise"></a>

### Network ports used by your ISE

This table describes the ports that your ISE requires to be accessible and the purpose for those ports. To help reduce complexity when you set up security rules, the table uses [service tags](../virtual-network/service-tags-overview.md) that represent groups of IP address prefixes for a specific Azure service. Where noted, *internal ISE* and *external ISE* refer to the [access endpoint that's selected during ISE creation](connect-virtual-network-vnet-isolated-environment.md#create-environment). For more information, review [Endpoint access](connect-virtual-network-vnet-isolated-environment-overview.md#endpoint-access).

> [!IMPORTANT]
>
> For all rules, make sure that you set source ports to `*` because source ports are ephemeral.

#### Inbound security rules

| Source ports | Destination ports | Source service tag or IP addresses | Destination service tag or IP addresses | Purpose | Notes |
|--------------|-------------------|------------------------------------|-----------------------------------------|---------|-------|
| * | * | Address space for the virtual network with ISE subnets | Address space for the virtual network with ISE subnets | Intersubnet communication within virtual network. | Required for traffic to flow *between* the subnets in your virtual network. <br><br>**Important**: For traffic to flow between the *components* in each subnet, make sure that you open all the ports within each subnet. |
| * | 443 | Internal ISE: <br>**VirtualNetwork** <br><br>External ISE: **Internet** or see **Notes** | **VirtualNetwork** | - Communication to your logic app <br><br>- Runs history for your logic app | Rather than use the **Internet** service tag, you can specify the source IP address for these items: <br><br>- The computer or service that calls any request triggers or webhooks in your logic app <br><br>- The computer or service from where you want to access logic app runs history <br><br>**Important**: Closing or blocking this port prevents calls to logic apps that have request triggers or webhooks. You're also prevented from accessing inputs and outputs for each step in runs history. However, you're not prevented from accessing logic app runs history. |
| * | 454 | **LogicAppsManagement** |**VirtualNetwork** | Azure Logic Apps designer - dynamic properties| Requests come from the Azure Logic Apps access endpoint's [inbound IP addresses](logic-apps-limits-and-config.md#inbound) for that region. <br><br>**Important**: If you're working with Azure Government cloud, the **LogicAppsManagement** service tag won't work. Instead, you have to provide the Azure Logic Apps [inbound IP addresses](logic-apps-limits-and-config.md#azure-government-inbound) for Azure Government. |
| * | 454 | **LogicApps** | **VirtualNetwork** | Network health check | Requests come from the Azure Logic Apps access endpoint's [inbound IP addresses](logic-apps-limits-and-config.md#inbound) and [outbound IP addresses](logic-apps-limits-and-config.md#outbound) for that region. <br><br>**Important**: If you're working with Azure Government cloud, the **LogicApps** service tag won't work. Instead, you have to provide both the Azure Logic Apps [inbound IP addresses](logic-apps-limits-and-config.md#azure-government-inbound) and [outbound IP addresses](logic-apps-limits-and-config.md#azure-government-outbound) for Azure Government. |
| * | 454 | **AzureConnectors** | **VirtualNetwork** | Connector deployment | Required to deploy and update connectors. Closing or blocking this port causes ISE deployments to fail and prevents connector updates and fixes. <br><br>**Important**: If you're working with Azure Government cloud, the **AzureConnectors** service tag won't work. Instead, you have to provide the [managed connector outbound IP addresses](logic-apps-limits-and-config.md#azure-government-outbound) for Azure Government. |
| * | 454, 455 | **AppServiceManagement** | **VirtualNetwork** | App Service Management dependency ||
| * | Internal ISE: 454 <br><br>External ISE: 443 | **AzureTrafficManager** | **VirtualNetwork** | Communication from Azure Traffic Manager ||
| * | 3443 | **APIManagement** | **VirtualNetwork** | Connector policy deployment <br><br>API Management - management endpoint  | For connector policy deployment, port access is required to deploy and update connectors. Closing or blocking this port causes ISE deployments to fail and prevents connector updates and fixes. |
| * | 6379 - 6383, plus see **Notes** | **VirtualNetwork** | **VirtualNetwork** | Access Azure Cache for Redis Instances between Role Instances | For ISE to work with Azure Cache for Redis, you must open these [outbound and inbound ports described by the Azure Cache for Redis FAQ](../azure-cache-for-redis/cache-how-to-premium-vnet.md#outbound-port-requirements). |

#### Outbound security rules

| Source ports | Destination ports | Source service tag or IP addresses | Destination service tag or IP addresses | Purpose | Notes |
|--------------|-------------------|------------------------------------|-----------------------------------------|---------|-------|
| * | * | Address space for the virtual network with ISE subnets | Address space for the virtual network with ISE subnets | Intersubnet communication within virtual network | Required for traffic to flow *between* the subnets in your virtual network. <br><br>**Important**: For traffic to flow between the *components* in each subnet, make sure that you open all the ports within each subnet. |
| * | 443, 80 | **VirtualNetwork** | Internet | Communication from your logic app | This rule is required for Secure Socket Layer (SSL) certificate verification. This check is for various internal and external sites, which is the reason that the Internet is required as the destination. |
| * | Varies based on destination | **VirtualNetwork** | Varies based on destination | Communication from your logic app | Destination ports vary based on the endpoints for the external services with which your logic app needs to communicate. <br><br>For example, the destination port is port 25 for an SMTP service, port 22 for an SFTP service, and so on. |
| * | 80, 443 | **VirtualNetwork** | **AzureActiveDirectory** | Azure Active Directory ||
| * | 80, 443, 445 | **VirtualNetwork** | **Storage** | Azure Storage dependency ||
| * | 443 | **VirtualNetwork** | **AppService** | Connection management ||
| * | 443 | **VirtualNetwork** | **AzureMonitor** | Publish diagnostic logs & metrics ||
| * | 1433 | **VirtualNetwork** | **SQL** | Azure SQL dependency ||
| * | 1886 | **VirtualNetwork** | **AzureMonitor** | Azure Resource Health | Required for publishing health status to Resource Health. |
| * | 5672 | **VirtualNetwork** | **EventHub** | Dependency from Log to Event Hubs policy and monitoring agent ||
| * | 6379 - 6383, plus see **Notes** | **VirtualNetwork** | **VirtualNetwork** | Access Azure Cache for Redis Instances between Role Instances | For ISE to work with Azure Cache for Redis, you must open these [outbound and inbound ports described by the Azure Cache for Redis FAQ](../azure-cache-for-redis/cache-how-to-premium-vnet.md#outbound-port-requirements). |
| * | 53 | **VirtualNetwork** | IP addresses for any custom Domain Name System (DNS) servers on your virtual network | DNS name resolution | Required only when you use custom DNS servers on your virtual network |

In addition, you need to add outbound rules for [App Service Environment (ASE)](../app-service/environment/intro.md):

* If you use Azure Firewall, you need to set up your firewall with the App Service Environment (ASE) [fully qualified domain name (FQDN) tag](../firewall/fqdn-tags.md#current-fqdn-tags), which permits outbound access to ASE platform traffic.

* If you use a firewall appliance other than Azure Firewall, you need to set up your firewall with *all* the rules listed in the [firewall integration dependencies](../app-service/environment/firewall-integration.md#dependencies) that are required for App Service Environment.

<a name="forced-tunneling"></a>

#### Forced tunneling requirements

If you set up or use [forced tunneling](../firewall/forced-tunneling.md) through your firewall, you have to permit extra external dependencies for your ISE. Forced tunneling lets you redirect Internet-bound traffic to a designated next hop, such as your virtual private network (VPN) or to a virtual appliance, rather than to the Internet so that you can inspect and audit outbound network traffic.

If you don't permit access for these dependencies, your ISE deployment fails and your deployed ISE stops working.

* User-defined routes

  To prevent asymmetric routing, you must define a route for each and every IP address that's listed below with **Internet** as the next hop.

  * [Azure Logic Apps inbound and outbound addresses for the ISE region](logic-apps-limits-and-config.md#firewall-configuration-ip-addresses-and-service-tags)  
  * [Azure IP addresses for connectors in the ISE region, available in this download file](https://www.microsoft.com/download/details.aspx?id=56519)
  * [App Service Environment management addresses](../app-service/environment/management-addresses.md)  
  * [Azure Traffic Manager management addresses](https://azuretrafficmanagerdata.blob.core.windows.net/probes/azure/probe-ip-ranges.json)
  * [Azure API Management Control Plane IP addresses](../api-management/virtual-network-reference.md#control-plane-ip-addresses)

* Service endpoints

  You need to enable service endpoints for Azure SQL, Storage, Service Bus, KeyVault, and Event Hubs because you can't send traffic through a firewall to these services.

* Other inbound and outbound dependencies

   Your firewall *must* allow the following inbound and outbound dependencies:

   * [Azure App Service Dependencies](../app-service/environment/firewall-integration.md#deploying-your-ase-behind-a-firewall)
   * [Azure Cache Service Dependencies](../azure-cache-for-redis/cache-how-to-premium-vnet.md#what-are-some-common-misconfiguration-issues-with-azure-cache-for-redis-and-virtual-networks)
   * [Azure API Management Dependencies](../api-management/virtual-network-reference.md)

<a name="create-environment"></a>

## Create your ISE

1. In the [Azure portal](https://portal.azure.com), in the main Azure search box, enter `integration service environments` as your filter, and select **Integration Service Environments**.

   ![Find and select "Integration Service Environments"](./media/connect-virtual-network-vnet-isolated-environment/find-integration-service-environment.png)

1. On the **Integration Service Environments** pane, select **Add**.

   ![Select "Add" to create integration service environment](./media/connect-virtual-network-vnet-isolated-environment/add-integration-service-environment.png)

1. Provide these details for your environment, and then select **Review + create**, for example:

   ![Provide environment details](./media/connect-virtual-network-vnet-isolated-environment/integration-service-environment-details.png)

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Subscription** | Yes | <*Azure-subscription-name*> | The Azure subscription to use for your environment |
   | **Resource group** | Yes | <*Azure-resource-group-name*> | A new or existing Azure resource group where you want to create your environment |
   | **Integration service environment name** | Yes | <*environment-name*> | Your ISE name, which can contain only letters, numbers, hyphens (`-`), underscores (`_`), and periods (`.`). |
   | **Location** | Yes | <*Azure-datacenter-region*> | The Azure datacenter region where to deploy your environment |
   | **SKU** | Yes | **Premium** or **Developer (No SLA)** | The ISE SKU to create and use. For differences between these SKUs, review [ISE SKUs](connect-virtual-network-vnet-isolated-environment-overview.md#ise-level). <p><p>**Important**: This option is available only at ISE creation and can't be changed later. |
   | **Additional capacity** | Premium: <br>Yes <p><p>Developer: <br>Not applicable | Premium: <br>0 to 10 <p><p>Developer: <br>Not applicable | The number of extra processing units to use for this ISE resource. To add capacity after creation, review [Add ISE capacity](ise-manage-integration-service-environment.md#add-capacity). |
   | **Access endpoint** | Yes | **Internal** or **External** | The type of access endpoints to use for your ISE. These endpoints determine whether request or webhook triggers on logic apps in your ISE can receive calls from outside your virtual network. <p><p>For example, if you want to use the following webhook-based triggers, make sure that you select **External**: <p><p>- Azure DevOps <br>- Azure Event Grid <br>- Common Data Service <br>- Office 365 <br>- SAP (ISE version) <p><p>Your selection also affects the way that you can view and access inputs and outputs in your logic app runs history. For more information, review [ISE endpoint access](connect-virtual-network-vnet-isolated-environment-overview.md#endpoint-access). <p><p>**Important**: You can select the access endpoint only during ISE creation and can't change this option later. |
   | **Virtual network** | Yes | <*Azure-virtual-network-name*> | The Azure virtual network where you want to inject your environment so logic apps in that environment can access your virtual network. If you don't have a network, [create an Azure virtual network first](../virtual-network/quick-create-portal.md). <p><p>**Important**: You can *only* perform this injection when you create your ISE. |
   | **Subnets** | Yes | <*subnet-resource-list*> | Regardless you use ISE Premium or Developer, your virtual network requires four *empty* subnets for creating and deploying resources in your ISE. These subnets are used by internal Azure Logic Apps components, such as connectors and caching for performance. <p>**Important**: Make sure that you [review the subnet requirements before continuing with these steps to create your subnets](#create-subnet). |
   |||||

   <a name="create-subnet"></a>

   **Create subnets**

   Whether you plan to use ISE Premium or Developer, make sure that your virtual network has four *empty* subnets. These subnets are used for creating and deploying resources in your ISE and are used by internal Azure Logic Apps components, such as connectors and caching for performance. You *can't* change these subnet addresses after you create your environment. If you create and deploy your ISE through the Azure portal, make sure that you don't delegate these subnets to any Azure services. However, if you create and deploy your ISE through the REST API, Azure PowerShell, or an Azure Resource Manager template, you need to [delegate](../virtual-network/manage-subnet-delegation.md) one empty subnet to `Microsoft.integrationServiceEnvironment`. For more information, review [Add a subnet delegation](../virtual-network/manage-subnet-delegation.md).

   Each subnet needs to meet these requirements:

   * Uses a name that starts with either an alphabetic character or an underscore (no numbers), and doesn't use these characters: `<`, `>`, `%`, `&`, `\\`, `?`, `/`.

   * Uses the [Classless Inter-Domain Routing (CIDR) format](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing).

     > [!IMPORTANT]
     >
     > Don't use the following IP address spaces for your virtual network or subnets because they aren't resolvable by Azure Logic Apps:<p>
     > 
     > * 0.0.0.0/8
     > * 100.64.0.0/10
     > * 127.0.0.0/8
     > * 168.63.129.16/32
     > * 169.254.169.254/32

   * Uses a `/27` in the address space because each subnet requires 32 addresses. For example, `10.0.0.0/27` has 32 addresses because 2<sup>(32-27)</sup> is 2<sup>5</sup> or 32. More addresses won't provide extra benefits. To learn more about calculating addresses, review [IPv4 CIDR blocks](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing#IPv4_CIDR_blocks).

   * If you use [ExpressRoute](../expressroute/expressroute-introduction.md), you have to [create a route table](../virtual-network/manage-route-table.md) that has the following route and link that table with each subnet that's used by your ISE:

     **Name**: <*route-name*><br>
     **Address prefix**: 0.0.0.0/0<br>
     **Next hop**: Internet

   1. Under the **Subnets** list, select **Manage subnet configuration**.

      ![Manage subnet configuration](./media/connect-virtual-network-vnet-isolated-environment/manage-subnet-configuration.png)

   1. On the **Subnets** pane, select **Subnet**.

      ![Add four empty subnets](./media/connect-virtual-network-vnet-isolated-environment/add-empty-subnets.png)

   1. On the **Add subnet** pane, provide this information.

      * **Name**: The name for your subnet
      * **Address range (CIDR block)**: Your subnet's range in your virtual network and in CIDR format

      ![Add subnet details](./media/connect-virtual-network-vnet-isolated-environment/provide-subnet-details.png)

   1. When you're done, select **OK**.

   1. Repeat these steps for three more subnets.

      > [!NOTE]
      > If the subnets you try to create aren't valid, the Azure portal shows a message, 
      > but doesn't block your progress.

   For more information about creating subnets, review [Add a virtual network subnet](../virtual-network/virtual-network-manage-subnet.md).

1. After Azure successfully validates your ISE information, select **Create**, for example:

   ![After successful validation, select "Create"](./media/connect-virtual-network-vnet-isolated-environment/ise-validation-success.png)

   Azure starts deploying your environment, which usually takes within two hours to finish. Occasionally, deployment might take up to four hours. To check deployment status, on your Azure toolbar, select the notifications icon, which opens the notifications pane.

   ![Check deployment status](./media/connect-virtual-network-vnet-isolated-environment/environment-deployment-status.png)

   If deployment finishes successfully, Azure shows this notification:

   ![Deployment succeeded](./media/connect-virtual-network-vnet-isolated-environment/deployment-success-message.png)

   Otherwise, follow the Azure portal instructions for troubleshooting deployment.

   > [!NOTE]
   > If deployment fails or you delete your ISE, Azure might take up to an hour, 
   > or possibly longer in rare cases, before releasing your subnets. So, you might 
   > have to wait before you can reuse those subnets in another ISE.
   >
   > If you delete your virtual network, Azure generally takes up to two hours 
   > before releasing up your subnets, but this operation might take longer. 
   > When deleting virtual networks, make sure that no resources are still connected. 
   > For more information, review [Delete virtual network](../virtual-network/manage-virtual-network.md#delete-a-virtual-network).

1. To view your environment, select **Go to resource** if Azure doesn't automatically go to your environment after deployment finishes.

1. For an ISE that has *external* endpoint access, you need to create a network security group (NSG), if you don't have one already. You need to add an inbound security rule to the NSG to allow traffic from managed connector outbound IP addresses. To set up this rule, follow these steps:

   1. On your ISE menu, under **Settings**, select **Properties**.

   1. Under **Connector outgoing IP addresses**, copy the public IP address ranges, which also appear in this article, [Limits and configuration - Outbound IP addresses](logic-apps-limits-and-config.md#outbound).

   1. Create a network security group, if you don't have one already.
   
   1. Based on the following information, add an inbound security rule for the public outbound IP addresses that you copied. For more information, review [Tutorial: Filter network traffic with a network security group using the Azure portal](../virtual-network/tutorial-filter-network-traffic.md#create-a-network-security-group).

      | Purpose | Source service tag or IP addresses | Source ports | Destination service tag or IP addresses | Destination ports | Notes |
      |---------|------------------------------------|--------------|-----------------------------------------|-------------------|-------|
      | Permit traffic from connector outbound IP addresses | <*connector-public-outbound-IP-addresses*> | * | Address space for the virtual network with ISE subnets | * | |
      |||||||

1. To check the network health for your ISE, review [Manage your integration service environment](ise-manage-integration-service-environment.md#check-network-health).

   > [!CAUTION]
   > If your ISE's network becomes unhealthy, the internal App Service Environment (ASE) that's used by your ISE can also become unhealthy. 
   > If the ASE is unhealthy for more than seven days, the ASE is suspended. To resolve this state, check your virtual network setup. 
   > Resolve any problems that you find, and then restart your ISE. Otherwise, after 90 days, the suspended ASE is deleted, and your 
   > ISE becomes unusable. So, make sure that you keep your ISE healthy to permit the necessary traffic.
   > 
   > For more information, review these topics:
   >
   > * [Azure App Service diagnostics overview](../app-service/overview-diagnostics.md)
   > * [Message logging for Azure App Service Environment](../app-service/environment/using-an-ase.md#logging)

1. To start creating logic apps and other artifacts in your ISE, review [Add resources to integration service environments](add-artifacts-integration-service-environment-ise.md).

   > [!IMPORTANT]
   > After you create your ISE, managed ISE connectors become available for you to use, but they don't automatically appear 
   > in the connector picker on the Logic App Designer. Before you can use these ISE connectors, you have to manually 
   > [add and deploy these connectors to your ISE](add-artifacts-integration-service-environment-ise.md#add-ise-connectors-environment) 
   > so that they appear in the Logic App Designer.

## Next steps

* [Add resources to integration service environments](add-artifacts-integration-service-environment-ise.md)
* [Manage integration service environments](ise-manage-integration-service-environment.md#check-network-health)
* Learn more about [Azure Virtual Network](../virtual-network/virtual-networks-overview.md)
* Learn about [virtual network integration for Azure services](../virtual-network/virtual-network-for-azure-services.md)
