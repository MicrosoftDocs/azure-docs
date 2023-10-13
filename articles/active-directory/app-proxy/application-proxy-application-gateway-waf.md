---
title: Using Application Gateway WAF to protect your application
description: How to add Web Application Firewall protection for apps published with Microsoft Entra application proxy.
services: active-directory
author: beatrizsilv
ms.service: active-directory
ms.subservice: app-proxy
ms.workload: identity
ms.topic: how-to
ms.date: 07/22/2022
ms.author: besilvei
ms.reviewer: ashishj
---

# Using Application Gateway WAF to protect your application

When using Microsoft Entra application proxy to expose applications deployed on-premises, on sealed Azure Virtual Networks, or in other public clouds, you can integrate a Web Application Firewall (WAF) in the data flow in order to protect your application from malicious attacks.

## What is Azure Web Application Firewall?

Azure Web Application Firewall (WAF) on Azure Application Gateway provides centralized protection of your web applications from common exploits and vulnerabilities. Web applications are increasingly targeted by malicious attacks that exploit commonly known vulnerabilities. SQL injection and cross-site scripting are among the most common attacks. For more information about Azure WAF on Application Gateway, see [What is Azure Web Application Firewall on Azure Application Gateway?][waf-overview].

## Deployment steps

This article guides you through the steps to securely expose a web application on the Internet, by integrating the Microsoft Entra application proxy with Azure WAF on Application Gateway. In this guide we'll be using the Microsoft Entra admin center. The reference architecture for this deployment is represented below.   

![Diagram of deployment described.](./media/application-proxy-waf/application-proxy-waf.png)

### Configure Azure Application Gateway to send traffic to your internal application.

Some steps of the Application Gateway configuration will be omitted in this article. For a detailed guide on how to create and configure an Application Gateway, see [Quickstart: Direct web traffic with Azure Application Gateway - Microsoft Entra admin center][appgw_quick].

##### 1. Create a private-facing HTTPS listener.

This will allow users to access the web application privately when connected to the corporate network.

![Screenshot of Application Gateway listener.](./media/application-proxy-waf/application-gateway-listener.png)

##### 2. Create a backend pool with the web servers.

In this example, the backend servers have Internet Information Services (IIS) installed. 

![Screenshot of Application Gateway backend.](./media/application-proxy-waf/application-gateway-backend.png)

##### 3. Create a backend setting. 

This will determine how requests will reach the backend pool servers.

![Screenshot of Application Gateway backend setting.](./media/application-proxy-waf/application-gateway-backend-settings.png)
 
 ##### 4. Create a routing rule that ties the listener, the backend pool, and the backend setting created in the previous steps.
 
 ![Screenshot of adding rule to Application Gateway 1.](./media/application-proxy-waf/application-gateway-add-rule-1.png)
 ![Screenshot of adding rule to Application Gateway 2.](./media/application-proxy-waf/application-gateway-add-rule-2.png)
 
 ##### 5. Enable the WAF in the Application Gateway and set it to Prevention mode.
 
 ![Screenshot of enabling waf in Application Gateway.](./media/application-proxy-waf/application-gateway-enable-waf.png)
 
 <a name='configure-your-application-to-be-remotely-accessed-through-application-proxy-in-azure-ad'></a>

### Configure your application to be remotely accessed through Application Proxy in Microsoft Entra ID.
 
As represented in the diagram above, both connector VMs, the Application Gateway, and the backend servers were deployed in the same VNET in Azure. This setup also applies to applications and connectors deployed on-premises. 

For a detailed guide on how to add your application to Application Proxy in Microsoft Entra ID, see [Tutorial: Add an on-premises application for remote access through Application Proxy in Microsoft Entra ID][appproxy-add-app]. For more information about performance considerations concerning the Application Proxy connectors, see [Optimize traffic flow with Microsoft Entra application proxy][appproxy-optimize]. 
 
![Screenshot of Application Proxy configuration.](./media/application-proxy-waf/application-proxy-configuration.png)

In this example, the same URL was configured as the internal and external URL. Remote clients will access the application over the Internet on port 443, through the Application Proxy, whereas clients connected to the corporate network will access the application privately through the Application Gateway directly, also on port 443. For a detailed step on how to configure custom domains in Application Proxy, see [Configure custom domains with Microsoft Entra application proxy][appproxy-custom-domain].

To ensure the connector VMs send requests to the Application Gateway, an [Azure Private DNS zone][private-dns] was created with an A record pointing www.fabrikam.one to the private frontend IP of the Application Gateway.

### Test the application.

After [adding a user for testing](./application-proxy-add-on-premises-application.md#add-a-user-for-testing), you can test the application by accessing https://www.fabrikam.one. The user will be prompted to authenticate in Microsoft Entra ID, and upon successful authentication, will access the application. 

![Screenshot of authentication step.](./media/application-proxy-waf/sign-in-2.png)
![Screenshot of server response.](./media/application-proxy-waf/application-gateway-response.png)

### Simulate an attack.

To test if the WAF is blocking malicious requests, you can simulate an attack using a basic SQL injection signature. For example, "https://www.fabrikam.one/api/sqlquery?query=x%22%20or%201%3D1%20--".

![Screenshot of WAF response.](./media/application-proxy-waf/waf-response.png)

An HTTP 403 response confirms that the request was blocked by the WAF.

The Application Gateway [Firewall logs][waf-logs] provide more details about the request and why it was blocked by the WAF.

![Screenshot of waf logs.](./media/application-proxy-waf/waf-log.png)

## Next steps

To prevent false positives, learn how to [Customize Web Application Firewall rules](/azure/web-application-firewall/ag/application-gateway-customize-waf-rules-portal), configure [Web Application Firewall exclusion lists](/azure/web-application-firewall/ag/application-gateway-waf-configuration?tabs=portal), or [Web Application Firewall custom rules](/azure/web-application-firewall/ag/create-custom-waf-rules).

[waf-overview]: /azure/web-application-firewall/ag/ag-overview
[appgw_quick]: /azure/application-gateway/quick-create-portal
[appproxy-add-app]: ./application-proxy-add-on-premises-application.md
[appproxy-optimize]: ./application-proxy-network-topology.md
[appproxy-custom-domain]: ./application-proxy-configure-custom-domain.md
[private-dns]: /azure/dns/private-dns-getstarted-portal
[waf-logs]: /azure/application-gateway/application-gateway-diagnostics#firewall-log
