---
title: Application Gateway integration with Azure Security Center | Microsoft Docs
description: This page provides information on how Application Gateway is integrated into Azure Security Center.
services: application-gateway
author: vhorne
ms.author: victorh
ms.assetid: e5ea5cf9-3b41-4b85-a12c-e758bff7f3ec
ms.service: application-gateway
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 06/07/2017
---

# Overview of integration between Application Gateway and Azure Security Center

Learn how Application Gateway and Security Center help protect your web application resources. Application gateway web application firewall (WAF) integrates with [Security Center](../security-center/security-center-intro.md) to provide a seamless view to prevent, detect, and respond to threats to unprotected web applications in your environment.

## Overview

Application Gateway WAF is a recommendation in Security Center for protecting web applications from exploits and vulnerabilities. Web enabled resources that are not protected by WAF show in the security center as high severity recommendations. Recommendations for web application firewalls are shown on the **Overview** page, under **Applications**.

![integration with security center][1]

Clicking any recommendations regarding web application firewall opens a new page showing the details of the recommendation.

## Add a web application firewall to an existing resource

Navigate to **All services** > **Security + Identity** > **Security Center** and on **Security Center - Overview**, click **Applications**. On **Security Center - Applications**, the table contains a list of applications that Security Center detected in your subscription.

![web applications][3]

By clicking on a web application with a critical issue, you get the **Application security health** page. In the image below, the web application that is not protected by a web application firewall. 

![web resources not protected][2]

Click **Add a web application firewall** under **Recommendations** to open the **Add a Web Application Firewall** page.

If you do not have an existing Application Gateway, or want to create a new one, click **Create New** and on  **Create a new Web Application Firewall**, and click **Microsoft - Application Gateway**. This takes you through the steps to create an application gateway. At this point, your web application is added as a protected resource, Security Center now tracks that this resource is protected by a web application firewall. This does not add it as a backend pool member.

If you have an existing application gateway, you can choose it under **Use existing solution**

![Page to add a web application firewall][4]

Adding a web application to an application gateway through Security Center does not add the resource as a backend pool member. This must be done on the application gateway resource directly.

## Add a resource to an existing web application firewall

Navigate to **All services** > **Security + Identity** > **Security Center** and on **Security Center - Overview**, click **Partner solutions**. Existing Security Center aware application gateways show in the **Partner Solutions** page.

![partner solutions][7]

Click **Link app** to open **Link Applications**, here you are given the options to select existing applications. Choose the applications to protect and click **OK**. This does not add the web application to the backend pool of the application gateway. This sets the resources as a protected resource so Security Center can track it. To add the resource as a backend pool member, this must be done on the application gateway, from the current page you can click **Solution console** to be taken to the application gateway resource where you can add the web application to the backend pool.

![partner solutions applications][6]

## Finalize configuration

Security Center tracks applications added to an application gateway as a protected resource.  It monitors the health of this resource and ensures that it is protected by an application gateway. The next step is to add the private IP, public IP, or NIC of your virtual machine to the backend pool of the application gateway. Until this is done an additional recommendation of **Finalize application protection** is shown until the resource is added.

![Page to add a web application firewall][5]

## Security Alerts

Within Security Center navigate to **DETECTION** > **Security Alerts**.  Here you find WAF alerts for your application gateways. Alerts are broken down by WAF rule.

![security alerts][8]

Selecting a rule will provide a list of alerts for that specific WAF rule. Each alert shows additional details on the finding. The details provide a link to the application gateway.
 
![alert details][9]

## Next steps

To learn how to enable web application firewall on an existing application gateway, visit [Create or update an Azure Application Gateway with web application firewall](application-gateway-web-application-firewall-portal.md).

[1]: ./media/application-gateway-integration-security-center/figure1.png
[2]: ./media/application-gateway-integration-security-center/figure2.png
[3]: ./media/application-gateway-integration-security-center/figure3.png
[4]: ./media/application-gateway-integration-security-center/figure4.png
[5]: ./media/application-gateway-integration-security-center/figure5.png
[6]: ./media/application-gateway-integration-security-center/figure6.png
[7]: ./media/application-gateway-integration-security-center/figure7.png
[8]: ./media/application-gateway-integration-security-center/securitycenter.png
[9]: ./media/application-gateway-integration-security-center/figure9.png