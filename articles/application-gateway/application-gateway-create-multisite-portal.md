---
title: Host multiple sites with Azure Application Gateway | Microsoft Docs
description: This page provides instructions to configure an existing Azure application gateway for hosting multiple web applications on the same gateway with the Azure portal.
documentationcenter: na
services: application-gateway
author: georgewallace
manager: timlt
editor: tysonn

ms.assetid: 95f892f6-fa27-47ee-b980-7abf4f2c66a9
ms.service: application-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 01/23/2017
ms.author: gwallace

---
# Configure an existing application gateway for hosting multiple web applications

> [!div class="op_single_selector"]
> * [Azure portal](application-gateway-create-multisite-portal.md)
> * [Azure Resource Manager PowerShell](application-gateway-create-multisite-azureresourcemanager-powershell.md)
> 
> 

Multiple site hosting allows you to deploy more than one web application on the same application gateway. It relies on presence of host header in the incoming HTTP request, to determine which listener would receive traffic. The listener then directs traffic to appropriate backend pool as configured in the rules definition of the gateway. In SSL enabled web applications, application gateway relies on the Server Name Indication (SNI) extension to choose the correct listener for the web traffic. A common use for multiple site hosting is to load balance requests for different web domains to different back-end server pools. Similarly multiple subdomains of the same root domain could also be hosted on the same application gateway.

## Scenario

In the following example, application gateway is serving traffic for contoso.com and fabrikam.com with two back-end server pools: contoso server pool and fabrikam server pool. Similar setup could be used to host subdomains like app.contoso.com and blog.contoso.com.

![multisite scenario][multisite]

## Before you begin

This scenario adds multi-site support to an existing application gateway. To complete this scenario, an existing application gateway needs to be available to configure. Visit [Create an application gateway by using the portal](application-gateway-create-gateway-portal.md) to learn how to create a basic application gateway in the portal.

The following are the steps needed to update the application gateway:

1. Create back-end pools to use for each site.
2. Create a listener for each site application gateway supports.
3. Create rules to map each listener with the appropriate back-end.

## Requirements

* **Back-end server pool:** The list of IP addresses of the back-end servers. The IP addresses listed should either belong to the virtual network subnet or should be a public IP/VIP. FQDN can also be used.
* **Back-end server pool settings:** Every pool has settings like port, protocol, and cookie-based affinity. These settings are tied to a pool and are applied to all servers within the pool.
* **Front-end port:** This port is the public port that is opened on the application gateway. Traffic hits this port, and then gets redirected to one of the back-end servers.
* **Listener:** The listener has a front-end port, a protocol (Http or Https, these values are case-sensitive), and the SSL certificate name (if configuring SSL offload). For multi-site enabled application gateways, host name and SNI indicators are also added.
* **Rule:** The rule binds the listener, the back-end server pool, and defines which back-end server pool the traffic should be directed to when it hits a particular listener. Rules are processed in the order they are listed, and traffic will be directed via the first rule that matches regardless of specificity. For example, if you have a rule using a basic listener and a rule using a multi-site listener both on the same port, the rule with the multi-site listener must be listed before the rule with the basic listener in order for the multi-site rule to function as expected. 
* **Certificates:** Each listener requires a unique certificate, in this example 2 listeners are created for multi-site. Two .pfx certificates and the passwords for them need to be created.

## Create back-end pools for each site

A back-end pool for each site that application gateway supports is needed, in this case 2 are be created, one for contoso11.com and one for fabrikam11.com.

### Step 1

Navigate to an existing application gateway in the Azure portal (https://portal.azure.com). Select **Backend pools** and click **Add**

![add backend pools][7]

### Step 2

Fill in the information for the back-end pool **pool1**, adding the ip addresses or FQDNs for the back-end servers and click **OK**

![backend pool pool1 settings][8]

### Step 3

On the backend-pools blade click **Add** to add an additional back-end pool **pool2**, adding the ip addresses or FQDNS for the back-end servers and click **OK**

![backend pool pool2 settings][9]

## Create listeners for each back-end

Application Gateway relies on HTTP 1.1 host headers to host more than one website on the same public IP address and port. The basic listener created in the portal does not contain this property.

### Step 1

Click **Listeners** on the existing application gateway and click **Multi-site** to add the first listener.

![listeners overview blade][1]

### Step 2

Fill out the information for the listener. In this example SSL termination is configured, create a new frontend port. Upload the .pfx certificate to be used for SSL termination. The only difference on this blade compared to the standard basic listener blade is the hostname.

![listener properties blade][2]

### Step 3

Click **Multi-site** and create another listener as described in the previous step for the second site. Make sure to use a different certificate for the second listener. The only difference on this blade compared to the standard basic listener blade is the hostname. Fill out the information for the listener and click **OK**.

![listener properties blade][3]

> [!NOTE]
> Creation of listeners in the Azure portal for application gateway is a long running task, it may take some time to create the two listeners in this scenario. When complete the listeners show in the portal as seen in the following image:

![listener overview][4]

## Create rules to map listeners to backend pools

### Step 1

Navigate to an existing application gateway in the Azure portal (https://portal.azure.com). Select **Rules** and choose the existing default rule **rule1** and click **Edit**.

### Step 2

Fill out the rules blade as seen in the following image. Choosing the first listener and first pool and clicking **Save** when complete.

![edit existing rule][6]

### Step 3

Click **Basic rule** to create the second rule. Fill out the form with the second listener and second backend pool and click **OK** to save.

![add basic rule blade][10]

This scenario completes configuring an existing application gateway with multi-site support through the Azure portal.

## Next steps

Learn how to protect your websites with [Application Gateway - Web Application Firewall](application-gateway-webapplicationfirewall-overview.md)

<!--Image references-->
[1]: ./media/application-gateway-create-multisite-portal/figure1.png
[2]: ./media/application-gateway-create-multisite-portal/figure2.png
[3]: ./media/application-gateway-create-multisite-portal/figure3.png
[4]: ./media/application-gateway-create-multisite-portal/figure4.png
[5]: ./media/application-gateway-create-multisite-portal/figure5.png
[6]: ./media/application-gateway-create-multisite-portal/figure6.png
[7]: ./media/application-gateway-create-multisite-portal/figure7.png
[8]: ./media/application-gateway-create-multisite-portal/figure8.png
[9]: ./media/application-gateway-create-multisite-portal/figure9.png
[10]: ./media/application-gateway-create-multisite-portal/figure10.png
[multisite]: ./media/application-gateway-create-multisite-portal/multisite.png
