---
title: "Virtual Network service endpoints and rules for Azure SQL Database | Microsoft Docs"
description: "Mark a subnet as a Virtual Network service endpoint. Then the endpoint as a virtual network rule to the ACL your Azure SQL Database. You SQL Database then accepts communication from all virtual machines and other nodes on the subnet."
services: sql-database
documentationcenter: ''
author: MightyPen
manager: jhubbard
editor: ''
tags: ''

ms.assetid: 
ms.service: sql-database
ms.custom: "VNet Service endpoints"
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: "On Demand"
ms.date: 10/30/2017
ms.author: genemi
---
# Use Virtual Network service endpoints and rules for Azure SQL Database

*Virtual network rules* are one firewall security feature that controls whether your Azure SQL Database server accepts communications that are sent from particular subnets in virtual networks. This article explains why the virtual network rule feature is sometimes your best option for securely allowing communication to your Azure SQL Database.

To create a virtual network rule, there must first be a [virtual network service endpoint][vm-virtual-network-service-endpoints-overview-649d] for the rule to reference.


> [!NOTE]
> For Azure SQL Database, this feature is available in Preview for the following Azure regions:
>
> - WestCentralUS, WestUS2, and EastUS.


#### How to create a virtual network rule

If you only create a virtual network rule, you can skip ahead to the steps and explanation [later in this article](#anchor-how-to-by-using-firewall-portal-59j).






<a name="anch-terminology-and-description-82f" />

## Terminology and description

**Virtual network:** You can have virtual networks associated with your Azure subscription.

**Subnet:** A virtual network contains **subnets**. Any Azure virtual machines (VMs) that you have are assigned to subnets. One subnet can contain multiple VMs or other compute nodes. Compute nodes that are outside of your virtual network cannot access your virtual network unless you configure your security to allow access.

**Virtual Network service endpoint:** A [Virtual Network service endpoint][vm-virtual-network-service-endpoints-overview-649d] is a subnet whose property values include one or more formal Azure service type names. In this article we are interested in the type name of **Microsoft.Sql**, which refers to the Azure service named SQL Database.

**Virtual network rule:** A virtual network rule for your SQL Database server is a subnet that is listed in the access control list (ACL) of your SQL Database server. To be in the ACL for your SQL Database, the subnet must contain the **Microsoft.Sql** type name.

A virtual network rule tells your SQL Database server to accept communications from every node that is on the subnet.







<a name="anch-benefits-of-a-vnet-rule-68b" />

## Benefits of a virtual network rule

Until you take action, the VMs on your subnets cannot communicate with your SQL Database. The rationale for choosing the virtual network rule approach to allowing the communication requires a compare-and-contrast discussion involving the competing security options offered by the firewall.

#### A. Allow access to Azure services

The firewall pane has an **ON/OFF** button that is labeled **Allow access to Azure services**. The **ON** setting allows communications from all Azure IP addresses and all Azure subnets. These Azure IPs or subnets might not be owned by you. This **ON** setting is probably more open than you want your SQL Database to be. The virtual network rule feature offers much finer granular control.

#### B. IP rules

The SQL Database firewall allows you to specify IP address ranges from which communications are accepted into SQL Database. This approach is fine for stable IP addresses that are outside the Azure private network. But many nodes inside the Azure private network are configured with *dynamic* IP addresses. Dynamic IP addresses might change, such as when your VM is restarted. It would be folly to specify a dynamic IP address in a firewall rule, in a production environment.

You can salvage the IP option by obtaining a *static* IP address for your VM. For details, see [Configure private IP addresses for a virtual machine by using the Azure portal][vm-configure-private-ip-addresses-for-a-virtual-machine-using-the-azure-portal-321w].

However, the static IP approach can become difficult to manage, and it is costly when done at scale. Virtual network rules are easier to establish and to manage.

#### C. Cannot yet have SQL Database on a subnet

If your Azure SQL Database server was a node on a subnet in your virtual network, all nodes within the virtual network could communicate with your SQL Database. In this case your VMs could communicate with SQL Database without needing any virtual network rules or IP rules.

However as of September 2017, the Azure SQL Database service is not yet among the services that can be assigned to a subnet.






<a name="anch-details-about-vnet-rules-38q" />

## Details about virtual network rules

This section describes several details about virtual network rules.

#### Only one geographic region

Each Virtual Network service endpoint applies to only one Azure region. The endpoint does not enable other regions to accept communication from the subnet.

Any virtual network rule is limited to the region that its underlying endpoint applies to.

#### Server-level, not database-level

Each virtual network rule applies to your whole Azure SQL Database server, not just to one particular database on the server. In other words, virtual network rule applies at the server-level, not at the database-level.

- In contrast, IP rules can apply at either level.

#### Security administration roles

There is a separation of security roles in the administration of Virtual Network service endpoints. Action is required from each of the following roles:

- **Network Admin:** &nbsp; Turn on the endpoint.
- **Database Admin:** &nbsp; Update the access control list (ACL) to add the given subnet to the SQL Database server.

*RBAC alternative:* 

The roles of Network Admin and Database Admin have more capabilities than are needed to manage virtual network rules. Only a subset of their capabilities is needed.

You have the option of using [role-based access control (RBAC)][rbac-what-is-813s] in Azure to create a single custom role that has only the necessary subset of capabilities. The custom role could be used instead of involving either the Network Admin or the Database Admin. The surface area of your security exposure is lower if you add a user to a custom role, versus adding the user to the other two major administrator roles.






## Limitations

For Azure SQL Database, the virtual network rules feature has the following limitations:

- At present, an Azure Web App in a subnet that has **Service Endpoints** turned on does not yet function as expected. We are working on enabling this functionality.
    - Until this feature is fully implemented, we recommend that you move your Web App to a different subnet that does not have service endpoints turned on for SQL.

- In the firewall for your SQL Database, each virtual network rule references a subnet. All these referenced subnets must be hosted in the same geographic region that hosts the SQL Database.

- Each Azure SQL Database server can have up to 128 ACL entries for any given virtual network.

- Virtual network rules apply only to Azure Resource Manager virtual networks; and not to [classic deployment model][arm-deployment-model-568f] networks.

- On the firewall, IP address ranges do apply to the following networking items, but virtual network rules do not:
    - [Site-to-Site (S2S) virtual private network (VPN)][vpn-gateway-indexmd-608y]
    - On-premises via [ExpressRoute][expressroute-indexmd-744v]

#### ExpressRoute

If your network is connected to the Azure network through use of [ExpressRoute][expressroute-indexmd-744v], each circuit is configured with two public IP addresses at the Microsoft Edge. The two IP addresses are used to connect to Microsoft Services, such as to Azure Storage, by using Azure Public Peering.

To allow communication from your circuit to Azure SQL Database, you must create IP network rules for the public IP addresses of your circuits. In order to find the public IP addresses of your ExpressRoute circuit, open a support ticket with ExpressRoute by using the Azure portal.


<!--
FYI: Re ARM, 'Azure Service Management (ASM)' was the old name of 'classic deployment model'.
When searching for blogs about ASM, you probably need to use this old and now-forbidden name.
-->





## Errors 40914 and 40615

Connection error 40914 relates to *virtual network rules*, as specified on the Firewall pane in the Azure portal. Error 40615 is similar, except it relates to *IP address rules* on the Firewall.

#### Error 40914

*Message text:* Cannot open server '*[server-name]*' requested by the login. Client is not allowed to access the server.

*Error description:* The client is in a subnet that has virtual network server endpoints. But the Azure SQL Database server has no virtual network rule that grants to the subnet the right to communicate with the SQL Database.

*Error resolution:* On the Firewall pane of the Azure portal, use the virtual network rules control to [add a virtual network rule](#anchor-how-to-by-using-firewall-portal-59j) for the subnet.

#### Error 40615

*Message text:* Cannot open server '{0}' requested by the login. Client with IP address '{1}' is not allowed to access the server.

*Error description:* The client is trying to connect from an IP address that is not authorized to connect to the Azure SQL Database server. The server firewall has no IP address rule that allows a client to communicate from the given IP address to the SQL Database.

*Error resolution:* Enter the client's IP address as an IP rule. Do this by using the Firewall pane in the Azure portal.


A list of several SQL Database error messages is documented [here][sql-database-develop-error-messages-419g].





<a name="anchor-how-to-by-using-firewall-portal-59j" />

## Portal can create a virtual network rule

This section illustrates how you can use the [Azure portal][http-azure-portal-link-ref-477t] to create a *virtual network rule* in your Azure SQL Database. The rule tells your SQL Database to accept communication from a particular subnet that has been tagged as being a *Virtual Network service endpoint*.

#### PowerShell alternative

A PowerShell script can also create virtual network rules. The crucial cmdlet **New-AzureRmSqlServerVirtualNetworkRule**. If interested, see [PowerShell to create a Virtual Network service endpoint and rule for Azure SQL Database][sql-db-vnet-service-endpoint-rule-powershell-md-52d].

#### Prerequisites

You must already have a subnet that is tagged with the particular Virtual Network service endpoint *type name* relevant to Azure SQL Database.

- The relevant endpoint type name is **Microsoft.Sql**.
- If your subnet might not be tagged with the type name, see [Verify your subnet is an endpoint][sql-db-vnet-service-endpoint-rule-powershell-md-a-verify-subnet-is-endpoint-ps-100].

<a name="a-portal-steps-for-vnet-rule-200" />

### Azure portal steps

1. Log in to the [Azure portal][http-azure-portal-link-ref-477t].

2. Then navigate the portal to **SQL servers** &gt; **Firewall / Virtual Networks**.

3. Set the **Allow access to Azure services** control to OFF.

    > [!IMPORTANT]
    > If you leave the control set to ON, then your Azure SQL Database server accepts communication from any subnet, which might be excessive access from a security point of view. The Microsoft Azure Virtual Network service endpoint feature, in coordination with the virtual network rule feature of SQL Database, together can reduce your security surface area.

4. Click the **+ Add existing** control, in the **Virtual networks** section.

    ![Click add existing (subnet endpoint, as a SQL rule).][image-portal-firewall-vnet-add-existing-10-png]

5. In the new **Create/Update** pane, fill in the controls with the names of your Azure resources.
 
    > [!TIP]
    > You must include the correct **Address prefix** for your subnet. You can find the value in the portal. Navigate **All resources** &gt; **All types** &gt; **Virtual networks**. The filter displays your virtual networks. Click your virtual network, and then click **Subnets**. The **ADDRESS RANGE** column has the Address prefix you need.

    ![Fill in fields for new rule.][image-portal-firewall-create-update-vnet-rule-20-png]

6. Click the **OK** button near the bottom of the pane.

7.  See the resulting virtual network rule on the firewall pane.

    ![See the new rule, on the firewall pane.][image-portal-firewall-vnet-result-rule-30-png]






<a name="anchor-how-to-links-60h" />

## Related articles

- [Use PowerShell to create a Virtual Network service endpoint, and then a virtual network rule for Azure SQL Database][sql-db-vnet-service-endpoint-rule-powershell-md-52d]
- [Azure virtual network service endpoints][vm-virtual-network-service-endpoints-overview-649d]
- [Azure SQL Database server-level and database-level firewall rules][sql-db-firewall-rules-config-715d]

The Microsoft Azure Virtual Network service endpoints feature, and the virtual network rule feature for Azure SQL Database, both became available in late September 2017.





<!-- Link references, to images. -->

[image-portal-firewall-vnet-add-existing-10-png]: media/sql-database-vnet-service-endpoint-rule-overview/portal-firewall-vnet-add-existing-10.png

[image-portal-firewall-create-update-vnet-rule-20-png]: media/sql-database-vnet-service-endpoint-rule-overview/portal-firewall-create-update-vnet-rule-20.png

[image-portal-firewall-vnet-result-rule-30-png]: media/sql-database-vnet-service-endpoint-rule-overview/portal-firewall-vnet-result-rule-30.png



<!-- Link references, to text, Within this same Github repo. -->

[arm-deployment-model-568f]: ../azure-resource-manager/resource-manager-deployment-model.md#classic-deployment-characteristics

[expressroute-indexmd-744v]: ../expressroute/index.md

[rbac-what-is-813s]: ../active-directory/role-based-access-control-what-is.md

[sql-db-firewall-rules-config-715d]: sql-database-firewall-configure.md

[sql-database-develop-error-messages-419g]: sql-database-develop-error-messages.md

[sql-db-vnet-service-endpoint-rule-powershell-md-52d]: sql-database-vnet-service-endpoint-rule-powershell.md

[sql-db-vnet-service-endpoint-rule-powershell-md-a-verify-subnet-is-endpoint-ps-100]: sql-database-vnet-service-endpoint-rule-powershell.md#a-verify-subnet-is-endpoint-ps-100

[vm-configure-private-ip-addresses-for-a-virtual-machine-using-the-azure-portal-321w]: ../virtual-network/virtual-networks-static-private-ip-arm-pportal.md

[vm-virtual-network-service-endpoints-overview-649d]: https://docs.microsoft.com/azure/virtual-network/virtual-network-service-endpoints-overview

[vpn-gateway-indexmd-608y]: ../vpn-gateway/index.md



<!-- Link references, to text, Outside this Github repo (HTTP). -->

[http-azure-portal-link-ref-477t]: https://portal.azure.com/




<!-- ??2
#### Syntax related articles
- REST API Reference, including JSON

- Azure CLI

- ARM templates
-->

