---
title: Application Gateway integration with Azure Security Center | Microsoft Docs
description: This page provides information on how Application Gateway is integrated into Azure Security Center.
documentationcenter: na
services: application-gateway
author: georgewallace
manager: timlt
editor: 

ms.assetid: e5ea5cf9-3b41-4b85-a12c-e758bff7f3ec
ms.service: application-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.custom:
ms.workload: infrastructure-services
ms.date: 03/22/2017
ms.author: gwallace

---

# Application Gateway integration with Security Center

Application Gateway provides application delivery control (ADC) features on layer 7 (HTTP/HTTPS).  Included in these capabilities is a web application firewall (WAF).  WAF protects backend web applications against common exploits and vulnerabilities. Azure Security Center provides insights into your Azure services and gives guidance on the best ways to protect your resources.  

## Overview

Application Gateway WAF is a recommendation in Security Center for a web application firewall. Web enabled resources show in the security center as high severity recommendations if they are not protected by a WAF. Recommendations for web application firewalls is shown on the **Overview** page, under **Applications**.  

![integration with security center][1]

Clicking on any recommendations in regards to web appliaction firewall will open a new blade showing the details of the recommendation.

![web resources not protected][2]

If the resources is behind an application gateway, at this point you need to enable the web application firewall on the application gateway. This action closes the recommendation.

## Next steps 

To learn how to enable web application firewall on an existing application gateway, visit [Create or update an Azure Application Gateway with Web Application Firewall](application-gateway-web-application-firewall-portal.md#add-web-application-firewall-to-an-existing-application-gateway)

[1]: ./media/application-gateway-integration-security-center/figure1.png
[2]: ./media/application-gateway-integration-security-center/figure2.png