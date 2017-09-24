---
title: Create an Application Gateway - Azure Portal | Microsoft Docs
description: Learn how to create an Application Gateway by using the portal
services: application-gateway
documentationcenter: na
author: davidmu1
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 54dffe95-d802-4f86-9e2e-293f49bd1e06
ms.service: application-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 07/31/2017
ms.author: davidmu

---
# Create an application gateway with the portal

[Application Gateway](application-gateway-introduction.md) is a dedicated virtual appliance providing application delivery controller (ADC) as a service, offering various layer 7 load balancing capabilities for your application. This article takes you through the steps to create an Application Gateway using the Azure portal and adding an existing server as a backend member.

## Log in to Azure

Log in to the Azure portal at [http://portal.azure.com](http://portal.azure.com)

## Create application gateway

To create an application gateway, complete the steps that follow. Application gateway requires its own subnet. When creating a virtual network, ensure that you leave enough address space to have multiple subnets. After the application gateway is deployed to a subnet, only other application gateways can be added to it.

1. In the Favorites pane of the portal, click **New**
1. In the **New** blade, click **Networking**. In the **Networking** blade, click **Application Gateway**, as shown in the following image:

    ![Creating Application Gateway][1]

1. In the **Basics** blade that appears, enter the following values, then click **OK**:

   | **Setting** | **Value** | **Details**|
   |---|---|---|
   |**Name**|AdatumAppGateway|The name of the application gateway|
   |**Tier**|Standard|Available values are Standard and WAF. Visit [web application firewall](application-gateway-web-application-firewall-overview.md) to learn more about WAF.|
   |**SKU Size**|Medium|Choices when choosing Standard tier are Small, Medium, and Large. When choosing WAF tier, options are Medium and Large only.|
   |**Instance count**|2|Number of instances of the application gateway for high availability. Instance counts of 1 should only be used for testing purposes.|
   |**Subscription**|[Your subscription]|Select a subscription to create the application gateway in.|
   |**Resource group**|**Create new:** AdatumAppGatewayRG|Create a resource group. The resource group name must be unique within the subscription you selected. To learn more about resource groups, read the [Resource Manager](../azure-resource-manager/resource-group-overview.md?toc=%2fazure%2fapplication-gateway%2ftoc.json#resource-groups) overview article.|
   |**Location**|West US||

1. In the **Settings** blade that appears under **Virtual network**, click **Choose a virtual network**. The **Choose virtual network** blade opens.  Click **Create new** to open the **Create virtual network** blade.

   ![choose a virtual network][2]

1. On the **Create virtual network blade** enter the following values, then click **OK**. The **Create virtual network** and **Choose virtual network** blades close. This step populates the **Subnet** field on the **Settings** blade with the subnet chosen.

   | **Setting** | **Value** | **Details**|
   |---|---|---|
   |**Name**|AdatumAppGatewayVNET|Name of the application gateway|
   |**Address Space**|10.0.0.0/16|This is the address space for the virtual network|
   |**Subnet name**|AppGatewaySubnet|Name of the subnet for the application gateway|
   |**Subnet address range**|10.0.0.0/28|This subnet allows more additional subnets in the virtual network for backend pool members|

1. On the **Settings** blade under **Frontend IP configuration**, choose **Public** as the **IP address type**

1. On the **Settings** blade under **Public IP address** click **Choose a public IP address**, the **Choose public IP address** blade opens, click **Create new**.

   ![choose public ip][3]

1. On the **Create public IP address** blade, accept the default value, and click **OK**. The blade closes and populates the **Public IP address** with the public IP address chosen.

1. On the **Settings** blade under **Listener configuration**, click **HTTP** under **Protocol**. Enter the port to use in the **Port** field.

2. Click **OK** on the **Settings** blade to continue.

1. Review the settings on the **Summary** blade and click **OK** to start creation of the application gateway. Creating an application gateway is a long running task and takes time to complete.

## Add servers to backend pools

Once you create the application gateway, the systems that host the application to be load balanced still need to be added to the application gateway. The IP addresses, FQDN, or NICs of these servers are added to the backend address pools.

### IP Address or FQDN

1. With the application gateway created, in the Azure portal **Favorites** pane, click **All resources**. Click the **AdatumAppGateway** application gateway in the All resources blade. If the subscription you selected already has several resources in it, you can enter **AdatumAppGateway** in the **Filter by name…** box to easily access the application gateway.

1. The application gateway you created is displayed. Click **Backend pools**, and select the current backend pool **appGatewayBackendPool**, the **appGatewayBackendPool** blade opens.

   ![Application Gateway backend pools][4]

1. Click **Add Target** to add IP addresses of FQDN values. Choose **IP address or FQDN** as the **Type** and enter your IP address or FQDN in the field. Repeat this step for additional backend pool members. When done click **Save**.

### Virtual Machine and NIC

You can also add Virtual Machine NICs as backend pool members. Only virtual machines within the same virtual network as the Application Gateway are available through the dropdown.

1. With the application gateway created, in the Azure portal **Favorites** pane, click **All resources**. Click the **AdatumAppGateway** application gateway in the All resources blade. If the subscription you selected already has several resources in it, you can enter **AdatumAppGateway** in the **Filter by name…** box to easily access the application gateway.

1. The application gateway you created is displayed. Click **Backend pools**, and select the current backend pool **appGatewayBackendPool**, the **appGatewayBackendPool** blade opens.

   ![Application Gateway backend pools][5]

1. Click **Add Target** to add IP addresses of FQDN values. Choose **Virtual Machine** as the **Type** and select the virtual machine and NIC to use. When done click **Save**

   > [!NOTE]
   > Only virtual machines in the same virtual network as the application gateway are available in the drop down box.

## Clean up resources

When no longer needed, delete the resource group, application gateway, and all related resources. To do so, select the resource group from the application gateway blade and click **Delete**.

## Next steps

In this scenario, you deployed an application gateway and added a server to the backend. The next steps are to configure the application gateway by modifying settings, and adjusting rules in the gateway. These steps can be found by visiting the following articles:

Learn how to create custom health probes by visiting [Create a custom health probe](application-gateway-create-probe-portal.md)

Learn how to configure SSL Offloading and take the costly SSL decryption off your web servers by visiting [Configure SSL Offload](application-gateway-ssl-portal.md)

Learn how to protect your applications with [Web Application Firewall](application-gateway-webapplicationfirewall-overview.md) a feature of application gateway.

<!--Image references-->
[1]: ./media/application-gateway-create-gateway-portal/figure1.png
[2]: ./media/application-gateway-create-gateway-portal/figure2.png
[3]: ./media/application-gateway-create-gateway-portal/figure3.png
[4]: ./media/application-gateway-create-gateway-portal/figure4.png
[5]: ./media/application-gateway-create-gateway-portal/figure5.png
[scenario]: ./media/application-gateway-create-gateway-portal/scenario.png
