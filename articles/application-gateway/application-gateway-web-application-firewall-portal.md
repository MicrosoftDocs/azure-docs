---
title: Create or update an application gateway with a web application firewall | Microsoft Docs
description: Learn how to create an application gateway with a web application firewall by using the portal
services: application-gateway
documentationcenter: na
author: davidmu1
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
ms.author: davidmu

---

# Create an application gateway with a web application firewall by using the portal

> [!div class="op_single_selector"]
> * [Azure portal](application-gateway-web-application-firewall-portal.md)
> * [PowerShell](application-gateway-web-application-firewall-powershell.md)
> * [Azure CLI](application-gateway-web-application-firewall-cli.md)

Learn how to create a web application firewall (WAF)-enabled application gateway.

The WAF in Azure Application Gateway protects web applications from common web-based attacks like SQL injection, cross-site scripting attacks, and session hijacks. A WAF protects against many of the OWASP top 10 common web vulnerabilities.

## Scenarios

This article presents two scenarios. In the first scenario, you learn how to [create an application gateway with a WAF](#create-an-application-gateway-with-web-application-firewall). In the second scenario, you learn how to [add a WAF to an existing application gateway](#add-web-application-firewall-to-an-existing-application-gateway).

![Scenario example][scenario]

> [!NOTE]
> You can add custom health probes, back-end pool addresses, and additional rules to the application gateway. These applications are configured after the application gateway is configured and not during initial deployment.

## Before you begin

 An application gateway requires its own subnet. When you create a virtual network, ensure that you leave enough address space to have multiple subnets. After you deploy an application gateway to a subnet, only additional application gateways can be added to the subnet.

## <a name="add-web-application-firewall-to-an-existing-application-gateway"></a>Add a web application firewall to an existing application gateway

This example updates an existing application gateway to support a WAF in **Prevention** mode.

1. In the Azure portal **Favorites** pane, select **All resources**. On the **All resources** blade, select the existing application gateway. If the subscription you selected already has several resources in it, enter the name in the **Filter by name** box to easily access the DNS zone.

   ![Existing application gateway selection][1]

2. Select **Web application firewall**, and update the application gateway settings. When the update finishes, select **Save**. 

3. Use the following settings to update an existing application gateway to support a WAF:

   | **Setting** | **Value** | **Details**
   |---|---|---|
   |**Upgrade to WAF tier**| Checked | This option sets the tier of the application gateway to the WAF tier.|
   |**Firewall status**| Enabled | This setting enables the firewall on the WAF.|
   |**Firewall mode** | Prevention | This setting is how a WAF deals with malicious traffic. **Detection** mode only logs the events. **Prevention** mode logs the events and stops the malicious traffic.|
   |**Rule set**|3.0|This setting determines the [core rule set](application-gateway-web-application-firewall-overview.md#core-rule-sets) that's used to protect the back-end pool members.|
   |**Configure disabled rules**|Varies|To prevent possible false positives, you can use this setting to disable certain [rules and rule groups](application-gateway-crs-rulegroups-rules.md).|

    >[!NOTE]
    > When you upgrade an existing application gateway to the WAF SKU, the SKU size changes to **medium**. After configuration finishes, you can reconfigure this setting.

    ![Basic settings][2-1]

    > [!NOTE]
    > To view WAF logs, enable diagnostics and select **ApplicationGatewayFirewallLog**. Choose an instance count of **1** for testing purposes only. We do not recommend an instance count under **2** because it's not covered by the SLA. Small gateways aren't available when you use a WAF.

## Create an application gateway with a web application firewall

This scenario will:

* Create a medium WAF application gateway with two instances.
* Create a virtual network named AdatumAppGatewayVNET with a reserved CIDR block of 10.0.0.0/16.
* Create a subnet called Appgatewaysubnet that uses 10.0.0.0/28 as its CIDR block.
* Configure a certificate for SSL offload.

1. Sign in to the [Azure portal](https://portal.azure.com). If you don't already have an account, you can sign up for a [free one-month trial](https://azure.microsoft.com/free).

2. In the **Favorites** pane on the portal, select **New**.

3. On the **New** blade, select **Networking**. On the **Networking** blade, select **Application Gateway**, as shown in the following image:

    ![Application gateway creation][1]

4. On the **Basics** blade that appears, enter the following values, and then select **OK**:

   | **Setting** | **Value** | **Details**
   |---|---|---|
   |**Name**|AdatumAppGateway|The name of the application gateway.|
   |**Tier**|WAF|Available values are Standard and WAF. To learn more about a WAF, see [Web application firewall](application-gateway-web-application-firewall-overview.md).|
   |**SKU Size**|Medium|Standard tier options are **Small**, **Medium**, and **Large**. WAF tier options are **Medium** and **Large** only.|
   |**Instance count**|2|The number of instances of the application gateway for high availability. Use instance counts of 1 for testing purposes only.|
   |**Subscription**|[Your subscription]|Select a subscription to use to create the application gateway.|
   |**Resource group**|**Create new:** AdatumAppGatewayRG|Create a resource group. The resource group name must be unique within the subscription you selected. To learn more about resource groups, read the [Resource Manager](../azure-resource-manager/resource-group-overview.md?toc=%2fazure%2fapplication-gateway%2ftoc.json#resource-groups) overview article.|
   |**Location**|West US||

   ![Basic settings configuration][2-2]

5. On the **Settings** blade that appears under **Virtual network**, select **Choose a virtual network**. On the **Choose virtual network** blade, select **Create new**.

   ![Virtual network choice][2]

6. On the **Create virtual network blade**, enter the following values, and then select **OK**. The **Subnet** field on the **Settings** blade is populated with the subnet you chose.

   |**Setting** | **Value** | **Details** |
   |---|---|---|
   |**Name**|AdatumAppGatewayVNET|The name of the application gateway.|
   |**Address space**|10.0.0.0/16| This value is the address space for the virtual network.|
   |**Subnet name**|AppGatewaySubnet|The name of the subnet for the application gateway.|
   |**Subnet address range**|10.0.0.0/28 | This subnet allows more additional subnets in the virtual network for back-end pool members.|

7. On the **Settings** blade under **Frontend IP configuration**, select **Public** as the **IP address type**.

8. On the **Settings** blade under **Public IP address**, select **Choose a public IP address**. On the **Choose public IP address** blade, select **Create new**.

   ![Public IP address choice][3]

9. On the **Create public IP address** blade, accept the default value, and select **OK**. The **Public IP address** field is populated with the public IP address you chose.

10. On the **Settings** blade under **Listener configuration**, select **HTTP** under **Protocol**. A certificate is required to use **HTTPS**. The private key for the certificate is needed. Provide a .pfx export of the certificate, and enter the password for the file.

11. Configure specific settings for the **WAF**.

   |**Setting** | **Value** | **Details** |
   |---|---|---|
   |**Firewall status**| Enabled| This setting turns the WAF on or off.|
   |**Firewall mode** | Prevention| This setting determines the actions the WAF takes on malicious traffic. **Detection** mode only logs traffic. **Prevention** mode logs and stops traffic with a 403 Unauthorized response.|


12. Review the **Summary** page, and select **OK**. Now the application gateway is queued up and created.

13. After the application gateway is created, go to it in the portal to continue configuration of the application gateway.

    ![Application gateway resource view][10]

These steps create a basic application gateway with default settings for the listener, back-end pool, back-end HTTP settings, and rules. After the provisioning finishes successfully, you can modify these settings to suit your deployment.

> [!NOTE]
> Application gateways created with the basic WAF configuration are configured with CRS 3.0 for protections.

## Next steps

To configure a custom domain alias for the [public IP address](../dns/dns-custom-domain.md#public-ip-address), you can use Azure DNS or another DNS provider.

To configure diagnostic logging to log the events that are detected or prevented with WAF, see [Application Gateway diagnostics](application-gateway-diagnostics.md).

To create custom health probes, see [Create a custom health probe](application-gateway-create-probe-portal.md).

To configure SSL offloading and take the costly SSL subscription off your web servers, see [Configure SSL offload](application-gateway-ssl-portal.md).

<!--Image references-->
[1]: ./media/application-gateway-web-application-firewall-portal/figure1.png
[2]: ./media/application-gateway-web-application-firewall-portal/figure2.png
[2-1]: ./media/application-gateway-web-application-firewall-portal/figure2-1.png
[2-2]: ./media/application-gateway-web-application-firewall-portal/figure2-2.png
[3]: ./media/application-gateway-web-application-firewall-portal/figure3.png
[10]: ./media/application-gateway-web-application-firewall-portal/figure10.png
[scenario]: ./media/application-gateway-web-application-firewall-portal/scenario.png
