---
title: Create or update an Azure Application Gateway with web application firewall | Microsoft Docs
description: Learn how to create an Application Gateway with web application firewall by using the portal
services: application-gateway
documentationcenter: na
author: georgewallace
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: b561a210-ed99-4ab4-be06-b49215e3255a
ms.service: application-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/03/2017
ms.author: gwallace

---

# Create an application gateway with web application firewall by using the portal

> [!div class="op_single_selector"]
> * [Azure portal](application-gateway-web-application-firewall-portal.md)
> * [Azure Resource Manager PowerShell](application-gateway-web-application-firewall-powershell.md)

Learn how to create an web application firewall enabled application gateway.

The web application firewall (WAF) in Azure Application Gateway protects web applications from common web-based attacks like SQL injection, cross-site scripting attacks, and session hijacks. Web application protects against many of the OWASP top 10 common web vulnerabilities.

## Scenarios

In this article there are two scenarios:

In the first scenario, you learn to [create an application gateway with web application firewall](#create-an-application-gateway-with-web-application-firewall)

In the second scenario, you learn to [add web application firewall to an existing application gateway](#add-web-application-firewall-to-an-existing-application-gateway).

![Scenario example][scenario]

> [!NOTE]
> Additional configuration of the application gateway, including custom health probes, backend pool addresses, and additional rules are configured after the application gateway is configured and not during initial deployment.

## Before you begin

Azure Application Gateway requires its own subnet. When creating a virtual network, ensure that you leave enough address space to have multiple subnets. Once you deploy an application gateway to a subnet,
only additional application gateways are able to be added to the subnet.

##<a name="add-web-application-firewall-to-an-existing-application-gateway"></a> Add web application firewall to an existing application gateway

This example updates an existing application gateway to support web application firewall in prevention mode.

1. In the Azure portal **Favorites** pane, click **All resources**. Click the existing Application Gateway in the **All resources** blade. If the subscription you selected already has several resources in it, you can enter the name in the **Filter by name…** box to easily access the DNS zone.

   ![Creating Application Gateway][1]

1. Click **Web application firewall** and update the application gateway settings. When complete click **Save**

    The settings to update an existing application gateway to support web application firewall are:

   | **Setting** | **Value** | **Details**
   |---|---|---|
   |**Upgrade to WAF Tier**| Checked | This sets the tier of the application gateway to the WAF tier.|
   |**Firewall status**| Enabled | Enabled | This setting enables the firewall on the WAF.|
   |**Firewall mode** | Prevention | This setting is how web application firewall deals with malicious traffic. **Detection** mode only logs the events, where **Prevention** mode logs the events and stops the malicious traffic.|
   |**Rule set**|3.0|This setting determines the [core rule set](application-gateway-web-application-firewall-overview.md#core-rule-sets) that is used to protect the backend pool members.|
   |**Configure disabled rules**|varies|To prevent possible false positives, this setting allows you to disable certain [rules and rule groups](application-gateway-crs-rulegroups-rules.md).|

    >[!NOTE]
    > When upgrading an existing application gateway to the WAF SKU, the SKU size changes to **medium**. This can be reconfigured after configuration is complete.

    ![blade showing basic settings][2-1]

    > [!NOTE]
    > To view web application firewall logs, diagnostics must be enabled and ApplicationGatewayFirewallLog selected. An instance count of 1 can be chosen for testing purposes. It is important to know that any instance count under two instances is not covered by the SLA and are therefore not recommended. Small gateways are not available when using web application firewall.

## Create an application gateway with web application firewall

This scenario will:

* Create a medium web application firewall application gateway with two instances.
* Create a virtual network named AdatumAppGatewayVNET with a reserved CIDR block of 10.0.0.0/16.
* Create a subnet called Appgatewaysubnet that uses 10.0.0.0/28 as its CIDR block.
* Configure a certificate for SSL offload.

1. Log in to the [Azure portal](https://portal.azure.com). If you don't already have an account, you can sign up for a [free one-month trial](https://azure.microsoft.com/free)
1. In the Favorites pane of the portal, click **New**
1. In the **New** blade, click **Networking**. In the **Networking** blade, click **Application Gateway**, as shown in the following image:
1. Navigate to the Azure portal, click **New** > **Networking** > **Application Gateway**

    ![Creating Application Gateway][1]

1. In the **Basics** blade that appears, eneter the following values, then click **OK**:

   | **Setting** | **Value** | **Details**
   |---|---|---|
   |**Name**|AdatumAppGateway|The name of the application gateway|
   |**Tier**|WAF|Available values are Standard and WAF. Visit [web application firewall](application-gateway-web-application-firewall-overview.md) to learn more about WAF.|
   |**SKU Size**|Medium|Choices when choosing Standard tier are Small, Medium and Large. When choosing WAF tier, options are Medium and Large only.|
   |**Instance count**|2|Number of instances of the application gateway for high availability. Instance counts of 1 should only be used for testing purposes.|
   |**Subscription**|[Your subscription]|Select a subscription to create the application gateway in.|
   |**Resource group**|**Create new:** AdatumAppGatewayRG|Create a resource group. The resource group name must be unique within the subscription you selected. To learn more about resource groups, read the [Resource Manager](../azure-resource-manager/resource-group-overview.md?toc=%2fazure%2fapplication-gateway%2ftoc.json#resource-groups) overview article.|
   |**Location**|West US||

   ![blade showing basic settings][2-2]

1. In the **Settings** blade that appears under **Virtual network**, click **Choose a virtual network**. This will open enter the **Choose virtual network** blade.  Click **Create new** to open the **Create virtual network** blade.

   ![choose a virtual network][2]

1. On the **Create virtual network blade** enter the following values, then click **OK**. This will close the **Create virtual network** and **Choose virtual network** blades. This will also populate the **Subnet** field on the **Settings** blade with the subnet chosen.

   |**Setting** | **Value** | **Details** |
   |---|---|---|
   |**Name**|AdatumAppGatewayVNET|Name of the application gateway|
   |**Address Space**|10.0.0.0/16| This is the address space for the virtual network|
   |**Subnet name**|AppGatewaySubnet|Name of the subnet for the application gateway|
   |**Subnet address range**|10.0.0.0/28| This subnet allows more additional subnets in the virtual network for backend pool members|

1. On the **Settings** blade under **Frontend IP configuration** choose **Public** as the **IP address type**

1. On the **Settings** blade under **Public IP address** click **Choose a public IP address**, this opens the **Choose public IP address** blade, click **Create new**.

   ![choose public ip][3]

1. On the **Create public IP address** blade, accept the default value and click **OK**. This will close the **Choose public IP address** blade, the **Create public IP address** blade, and populate **Public IP address** with the public IP address chosen.

1. On the **Settings** blade under **Listener configuration** click **HTTP** under **Protocol**. To use **https**, a certificate is required. The private key of the certificate is needed so a .pfx export of the certificate needs to be provided and the password for the file.

1. Configure the **WAF** specific settings.

   |**Setting** | **Value** | **Details** |
   |---|---|---|
   |**Firewall status**| Enabled| This setting turns WAF on or off.|
   |**Firewall mode** | Prevention| his setting determines the actions WAF takes on malicious traffic. If **Detection** is chosen, traffic is only logged.  If **Prevention** is chosen, traffic is logged and stopped with a 403 Unauthorized response.|


1. Review the Summary page and click **OK**.  Now the application gateway is queued up and created.

1. Once the application gateway has been created, navigate to it in the portal to continue configuration of the application gateway.

    ![Application Gateway resource view][10]

These steps create a basic application gateway with default settings for the listener, backend pool, backend http settings, and rules. You can modify these settings to suit your deployment once the provisioning is successful

> [!NOTE]
> Application gateways created with the basic web application firewall configuration are configured with CRS 3.0 for protections.

## Next steps

Learn how to configure diagnostic logging, to log the events that are detected or prevented with web application firewall by visiting [Application Gateway Diagnostics](application-gateway-diagnostics.md)

Learn how to create custom health probes by visiting [Create a custom health probe](application-gateway-create-probe-portal.md)

Learn how to configure SSL Offloading and take the costly SSL decryption off your web servers by visiting [Configure SSL Offload](application-gateway-ssl-portal.md)

<!--Image references-->
[1]: ./media/application-gateway-web-application-firewall-portal/figure1.png
[2]: ./media/application-gateway-web-application-firewall-portal/figure2.png
[2-1]: ./media/application-gateway-web-application-firewall-portal/figure2-1.png
[2-2]: ./media/application-gateway-web-application-firewall-portal/figure2-2.png
[3]: ./media/application-gateway-web-application-firewall-portal/figure3.png
[10]: ./media/application-gateway-web-application-firewall-portal/figure10.png
[scenario]: ./media/application-gateway-web-application-firewall-portal/scenario.png
