---
title: Create an application gateway using the portal | Microsoft Docs
description: Learn how to create an Application Gateway by using the portal
services: application-gateway
documentationcenter: na
author: georgewallace
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 54dffe95-d802-4f86-9e2e-293f49bd1e06
ms.service: application-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 04/05/2017
ms.author: gwallace

---
# Create an application gateway by using the portal

> [!div class="op_single_selector"]
> * [Azure portal](application-gateway-create-gateway-portal.md)
> * [Azure Resource Manager PowerShell](application-gateway-create-gateway-arm.md)
> * [Azure Classic PowerShell](application-gateway-create-gateway.md)
> * [Azure Resource Manager template](application-gateway-create-gateway-arm-template.md)
> * [Azure CLI](application-gateway-create-gateway-cli.md)

Learn how to create an application gateway using SSL offload.

![Scenario example][scenario]

Application Gateway is a dedicated virtual appliance providing application delivery controller (ADC) as a service, offering various layer 7 load balancing capabilities for your application.

This scenario will:

1. [Create a medium application gateway](#create-an-application-gateway) using SSL offload with two instances in its own subnet.
1. [Add servers to the back-end pool](#add-servers-to-backend-pools)
1. [Delete all resources](#delete-all-resources). You incur charges for some of the resources created in this exercise while they're provisioned. To minimize the charges, after you complete the exercise, be sure to complete the steps in this section to delete the resources you create.



> [!IMPORTANT]
> Additional configuration of the application gateway, including custom health probes, backend pool addresses, and additional rules are configured after the application gateway is configured and not during initial deployment.

## Create an application gateway

To create an application gateway, complete the steps that follow. Application gateway requires its own subnet. When creating a virtual network, ensure that you leave enough address space to have multiple subnets. Once you deploy an application gateway to a subnet, only additional application gateways are able to be added to the subnet.

1. Log in to the [Azure portal](https://portal.azure.com). If you don't already have an account, you can sign up for a [free one-month trial](https://azure.microsoft.com/free)
1. In the Favorites pane of the portal, click **New**
1. In the **New** blade, click **Networking**. In the **Networking** blade, click **Application Gateway**, as shown in the following image:

    ![Creating Application Gateway][1]

1. In the **Basics** blade that appears, eneter the following values, then click **OK**:

   | **Setting** | **Value** | **Details**
   |---|---|---|
   |**Name**|AdatumAppGateway|The name of the application gateway|
   |**Tier**|Standard|Available values are Standard and WAF. Visit [web application firewall](application-gateway-web-application-firewall-overview.md) to learn more about WAF.|
   |**SKU Size**|Medium|Choices when choosing Standard tier are Small, Medium and Large. When choosing WAF tier, options are Medium and Large only.|
   |**Instance count**|2|Number of instances of the application gateway for high availability. Instance counts of 1 should only be used for testing purposes.|
   |**Subscription**|[Your subscription]|Select a subscription to create the application gateway in.|
   |**Resource group**|**Create new:** AdatumAppGatewayRG|Create a resource group. The resource group name must be unique within the subscription you selected. To learn more about resource groups, read the [Resource Manager](../azure-resource-manager/resource-group-overview.md?toc=%2fazure%2fapplication-gateway%2ftoc.json#resource-groups) overview article.|
   |**Location**|West US||

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

1. On the **Settings** blade under **Listener configuration** click **HTTPS** under **Protocol**. Doing this adds additional fields. Click the folder icon for the **Upload PFX certificate** field and choose the appropriate .pfx certificate. Enter the following information in the additional **Listener configuration** fields:

   |**Setting** | **Value** | **Details** |
   |---|---|---|
   |Name|Name of the certificate|This value is a friendly name used to reference the certificate|
   |Password|Password for .pfx| This is the password used for the private key|

1. Click **OK** on the **Settings** blade to continue.

1. Review the settings on the **Summary** blade and click **OK** to start creation of the application gateway. Creating an application gateway is a long running task and will take time to complete.

## Add servers to backend pools

Once the application gateway is created, the systems that host the application to be load balanced still need to be added to the application gateway. The IP addresses, FQDN, or NICs of these servers are added to the backend address pools.

### IP Address or FQDN

1. With the application gateway created, in the Azure portal **Favorites** pane, click **All resources**. Click the **AdatumAppGateway** application gateway in the All resources blade. If the subscription you selected already has several resources in it, you can enter **AdatumAppGateway** in the **Filter by name…** box to easily access the application gateway.

1. The application gateway you created is displayed. Click **Backend pools**, and select the current backend pool **appGatewayBackendPool**, this will open the **appGatewayBackendPool** blade.

   ![Application Gateway backend pools][4]

1. Click **Add Target** to add IP addresses of FQDN values. Choose **IP address or FQDN** as the **Type** and enter your IP address or FQDN in the field. Repeat this for additional backend pool memebers. When done click **Save**.

### Virtual Machine and NIC

You can also add Virtual Machine NICs as backend pool members. Only virtual machines within the same virtual network as the Application Gateway are available through the dropdown.

1. With the application gateway created, in the Azure portal **Favorites** pane, click **All resources**. Click the **AdatumAppGateway** application gateway in the All resources blade. If the subscription you selected already has several resources in it, you can enter **AdatumAppGateway** in the **Filter by name…** box to easily access the application gateway.

1. The application gateway you created is displayed. Click **Backend pools**, and select the current backend pool **appGatewayBackendPool**, this will open the **appGatewayBackendPool** blade.

   ![Application Gateway backend pools][5]

1. Click **Add Target** to add IP addresses of FQDN values. Choose **Virtual Machine** as the **Type** and select the virtual machine and NIC to use. When done click **Save**

   > [!NOTE]
   > Only virtual machines in the same virtual network as the application gateway are available in the drop down box.

## Delete all resources

To delete all resources created in this article, complete the following steps:

1. In the Azure portal **Favorites** pane, click **All resources**. Click the **AdatumAppGatewayRG** resource group in the All resources blade. If the subscription you selected already has several resources in it, you can enter **AdatumAppGatewayRG** in the **Filter by name…** box to easily access the resource group.
1. In the **AdatumAppGatewayRG** blade, click the **Delete** button.
1. The portal requires you to type the name of the resource group to confirm that you want to delete it. Click **Delete**, Type AdatumAppGateway for the resource group name, then click **Delete**. Deleting a resource group deletes all resources within the resource group, so always be sure to confirm the contents of a resource group before deleting it. The portal deletes all resources contained within the resource group, then deletes the resource group itself. This process takes several minutes.

## Next steps

This scenario creates a default application gateway. The next steps are to configure the application gateway by modifying settings, and adjusting rules in the gateway. These steps can be found by visiting the following articles:

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
