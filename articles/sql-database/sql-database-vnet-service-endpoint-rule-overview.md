---
title: "VNet service endpoints and rules for Azure SQL Database | Microsoft Docs"
description: "Mark a subnet as a VNet service endpoint, and then add the endpoint as a VNet rule to the ACL your Azure SQL Database to thereby accept communication from all VMs and other nodes on the subnet."
services: sql-database
documentationcenter: ''
author: MightyPen
manager: jhubbard
editor: ''
tags: ''

ms.assetid: 
ms.service: sql-database
ms.custom: "VNet service endpoints"
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: ''
ms.date: 09/14/2017
ms.author: genemi
---
# VNet service endpoints and rules for Azure SQL Database

*VNet rules* are one firewall feature that control whether your Azure SQL Database server accepts communications that are sent from specific subnets in virtual networks (VNets). This article explains why the VNet rule feature is sometimes your best option for securely allowing communication to your Azure SQL Database.

#### How to create a VNet rule

If you only create a VNet rule, you can skip ahead to the steps and explanation [later in this article](#anchor-how-to-by-using-firewall-portal-59j).






<a name="anch-terminology-and-description-82f" />

## Terminology and description

**Virtual network (VNet)**: You can have virtual networks (VNets) associated with your Azure subscription.

**Subnet**: A VNet contains **subnets**. Any Azure virtual machines (VMs) that you have are assigned to subnets. One subnet can contain multiple VMs or other compute nodes. Compute nodes that are outside of your VNet cannot access your VNet unless you configure your security to allow access.

**VNet service endpoint**: A VNet service endpoint is a subnet whose property values include one or more formal Azure service type names. In this article we are interested in the type name of **Microsoft.Sql**, which refers to the Azure service named SQL Database.

**VNet rule**: A VNet rule for your SQL Database server is a subnet that is listed in the access control list (ACL) of your SQL Database server. To be in the ACL for your SQL Database, the subnet must contain the **Microsoft.Sql** type name.

A VNet rule tells your SQL Database server to accept communications from every node that is on the subnet.







<a name="anch-benefits-of-a-vnet-rule-68b" />

## Benefits of a VNet rule

Until you take action, the VMs on your subnets cannot communicate with your SQL Database. The rationale for choosing the VNet rule approach to allowing the communication requires a compare-and-contrast discussion involving the competing security options offered by the firewall.

#### A. Allow access to Azure services

The firewall pane has an **ON/OFF** button that is labeled **Allow access to Azure services**. The **ON** setting allows communications from all Azure IP addresses and all Azure subnets. These Azure IPs or subnets might not be owned by you. This **ON** setting is probably more open than you want your SQL Database to be. The VNet rule feature offers much finer granular control.

#### B. IP rules

The SQL Database firewall allows you to specify IP address ranges from which communications are accepted into SQL Database. This approach is fine for stable IP addresses that are outside the Azure private network. But many nodes inside the Azure private network are configured with *dynamic* IP addresses. Dynamic IP addresses might change, such as when your VM is restarted. It would be folly to specify a dynamic IP address in a firewall rule, in a production environment.

You can salvage the IP option by obtaining a *static* IP address for your VM. For details, see [Configure private IP addresses for a virtual machine by using the Azure portal][vm-configure-private-ip-addresses-for-a-virtual-machine-using-the-azure-portal-321w].

However, the static IP approach can become difficult to manage, and it is costly when done at scale. VNet rules are easier to establish and to manage.

#### C. Cannot yet have SQL Database on a subnet

If your Azure SQL Database server was a node on a subnet in your VNet, all nodes within the VNet could communicate with your SQL Database. In this case your VMs could communicate with SQL Database without needing any VNet rules or IP rules.

However as of September 2017, the Azure SQL Database service is not yet among the services that can be assigned to a subnet.






<a name="anch-details-about-vnet-rules-38q" />

## Details about VNet rules

This section describes several details about VNet rules.

#### Only one geographic region

Each VNet service endpoint applies to only one Azure region. The endpoint does not enable other regions to accept communication from the subnet.

Any VNet rule is limited to the region that its underlying endpoint applies to.

#### Server-level, not database-level

Each VNet rule applies to your whole Azure SQL Database server, not just to one particular database on the server. In other words, VNet rule applies at the server-level, not at the database-level.

- In contrast, IP rules can apply at either level.

#### Security administration roles

There is a separation of security roles in the administration of VNet service endpoints. Action is required from each of the following roles:

- **Network Admin:** &nbsp; Turn on the endpoint.
- **Database Admin:** &nbsp; Update the access control list (ACL) to add the given subnet to the SQL Database server.

*RBAC alternative:* 

The roles of Network Admin and Database Admin have more capabilities than are needed to manage VNet rules. Only a subset of their capabilities is needed.

You have the option of using [role-based access control (RBAC)][rbac-what-is-813s] in Azure to create a single custom role that has only the necessary subset of capabilities. The custom role could be used instead of involving either the Network Admin or the Database Admin. The surface area of your security exposure is lower if you add a user to a custom role, versus adding the user to the other two major administrator roles.

#### Limitations

The VNet rules feature has the following limitations:

- Each Azure SQL Database server can have up to 128 IP-ACL entries for any given VNet.

- VNet rules apply only to Azure Resource Manager VNETs; and not to [classic deployment model][arm-deployment-model-568f] networks.

- VNet rules do not extend to any of the following networking items:
    - On-premises via [Expressroute][expressroute-indexmd-744v]
    - [Site-to-Site (S2S) virtual private network (VPN)][vpn-gateway-indexmd-608y]


<!--
FYI: Re ARM, 'Azure Service Management (ASM)' was the old name of 'classic deployment model'.
When searching for blogs about ASM, you probably need to use this old and now-forbidden name.
-->





<a name="anchor-how-to-by-using-firewall-portal-59j" />

## How to create a VNet rule by using the portal

This section illustrates how you can use the [Azure portal][http-azure-portal-link-ref-477t] to create a *VNet rule* in your Azure SQL Database. The rule tells your SQL Database to accept communication from a particular subnet that has been tagged as being a *VNet service endpoint*.

#### PowerShell alternative

A PowerShell script can create also create VNet rules. The crucial cmdlet **New-AzureRmSqlServerVirtualNetworkRule**. If interested, see [PowerShell to create a VNet service endpoint and rule for Azure SQL Database][sql-db-vnet-service-endpoint-rule-powershell-md-52d].

#### Prerequisites

You must already have a subnet that is tagged with the particular VNet service endpoint *type name* relevant to Azure SQL Database.

- The relevant endpoint type name is **Microsoft.Sql**.
- If your subnet might not be tagged with the type name, see [Verify your subnet is an endpoint][sql-db-vnet-service-endpoint-rule-powershell-md-a-verify-subnet-is-endpoint-ps-100].

<a name="a-portal-steps-for-vnet-rule-200" />

### Portal steps

1. Log in to the [Azure portal][http-azure-portal-link-ref-477t].

2. Then navigate the portal to **SQL servers** &gt; **Firewall / Virtual Networks**.

3. Set the **Allow access to Azure services** control to OFF.

    > [!IMPORTANT]
    > If you leave the control set to ON, then your Azure SQL Database server accepts communication from any subnet, which might be excessive access from a security point of view. The Azure VNet service endpoint feature, in coordination with the VNet rule feature of SQL Database, together can reduce your security surface area.

4. Click the **+ Add existing** control, in the **Virtual networks** section.

    ![Click add existing (subnet endpoint, as a SQL rule).][image-portal-firewall-vnet-add-existing-10-png]

5. In the new **Create/Update** pane, fill in the controls with the names of your Azure resources.
 
    > [!TIP]
    > You must include the correct **Address prefix** for your subnet. You can find the value in the portal. Navigate **All resources** &gt; **All types** &gt; **Virtual networks**. The filter displays your VNets. Click your VNet, and then click **Subnets**. The **ADDRESS RANGE** column has the Address prefix you need.

    ![Fill in fields for new rule.][image-portal-firewall-create-update-vnet-rule-20-png]

6. Click the **OK** button near the bottom of the pane.

7.  See the resulting VNet rule on the firewall pane.

    ![See the new rule, on the firewall pane.][image-portal-firewall-vnet-result-rule-30-png]






<a name="anchor-how-to-links-60h" />

## Related articles

- [PowerShell to create a VNet service endpoint and rule for Azure SQL Database][sql-db-vnet-service-endpoint-rule-powershell-md-52d]
- [Azure SQL Database server-level and database-level firewall rules][sql-db-firewall-rules-config-715d]

The VNet service endpoints feature, and the VNet rule feature, both became available in late September 2017.





<!-- Link references, to images. -->

[image-portal-firewall-vnet-add-existing-10-png]: media/sql-database-vnet-service-endpoint-rule-overview/portal-firewall-vnet-add-existing-10.png

[image-portal-firewall-create-update-vnet-rule-20-png]: media/sql-database-vnet-service-endpoint-rule-overview/portal-firewall-create-update-vnet-rule-20.png

[image-portal-firewall-vnet-result-rule-30-png]: media/sql-database-vnet-service-endpoint-rule-overview/portal-firewall-vnet-result-rule-30.png



<!-- Link references, to text, Within this same Github repo. -->

[arm-deployment-model-568f]: ../azure-resource-manager/resource-manager-deployment-model.md#classic-deployment-characteristics

[expressroute-indexmd-744v]: ../expressroute/index.md

[rbac-what-is-813s]: ../active-directory/role-based-access-control-what-is.md

[sql-db-firewall-rules-config-715d]: sql-database-firewall-configure.md

[sql-db-vnet-service-endpoint-rule-powershell-md-52d]: sql-database-vnet-service-endpoint-rule-powershell.md

[sql-db-vnet-service-endpoint-rule-powershell-md-a-verify-subnet-is-endpoint-ps-100]: sql-database-vnet-service-endpoint-rule-powershell.md#a-verify-subnet-is-endpoint-ps-100

[vm-configure-private-ip-addresses-for-a-virtual-machine-using-the-azure-portal-321w]: ../virtual-network/virtual-networks-static-private-ip-arm-pportal.md

[vpn-gateway-indexmd-608y]: ../vpn-gateway/index.md



<!-- Link references, to text, Outside this Github repo (HTTP). -->

[http-azure-portal-link-ref-477t]: https://portal.azure.com/




<!-- ??2
#### Syntax related articles

- PowerShell cmdlets

- REST API Reference, including JSON

- Azure CLI

- ARM templates
-->

