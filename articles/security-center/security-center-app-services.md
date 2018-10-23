---
title: Protecting App Services in Azure Security Center | Microsoft Docs
description: This article helps you to get started protecting your App Services in Azure Security Center.
services: security-center
documentationcenter: na
author: rkarlin
manager: mbaldwin
editor: ''

ms.assetid: e8518710-fcf9-44a8-ae4b-8200dfcded1a
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 23/11/2018
ms.author: rkarlin

---
# Protecting App Services with Azure Security Center
This article helps you use Azure Security Center to monitor and protect your App Services.

App Services enable you to build and host web applications in the programming language of your choice without managing infrastructure. App Services offer auto-scaling and high availability, support both Windows and Linux, as well as automated deployments from GitHub, Visual Studio Team Services or any Git repository. 

Vulnerabilities in web applications are frequently exploited by attackers, because they have a common and dynamic interface for almost every organization on the Internet. Requests to applications running on top of App Services go through several gateways deployed in Azure datacenters around the world, responsible for routing each request to its corresponding application. 

Azure Security Center can run assessments and recommendations on your App Services running in the sandboxes in your VM or on-demand instances. By leveraging the visibility that Azure has as cloud provider, Security Center analyzes your App Service internal logs to monitor for common web app attacks that often run across multiple targets.

Security Center leverages the scale of the cloud to identify attacks on App Service applications and focus on emerging attacks, while attackers are on the reconnaissance phase, scanning to identify vulnerabilities across multiple websites, hosted on Azure. Security Center uses analytics and machine learning models to cover all interfaces allowing customers to interact with their applications, whether over HTTP or through a management methods. Moreover, as a first-party service in Azure, Security Center is also in a unique position to offer host-based security analytics covering the underlying compute nodes for this PaaS, enabling Security Center to detect attacks against web applications that were already exploited.

## Prerequisites

To monitor and secure your App Services, you have to have an App Service plan of Basic, Standard, Premium, Isolated, App Service LINUX, or Consumption plan - Azure Security Center does not support the Free or Shared plans in which your sandbox environment is shared with other customers and not yours alone. For more information, see [App Service Plans](https://azure.microsoft.com/pricing/details/app-service/plans/).

## Security Center protection

Azure Security Center protects the VM in which your App Services are running, the management interface, and requests and responses sent to and from the app.

Enabling protection across your App Services is natively integrated with Security Center, and requires no complesx onboarding or deployment. Because your App Services are running on Azure, users are already redirected to the Azure server, enabling Azure Security Center to get data directly from the Azure server, ensuring that Security Center is transparently connected.

App Services and Security Center do not look at your apps in Azure. But for security purposes, internal logs are collected to monitor the processes occurring in the managed VM and inside the sandbox. These logs are protected and  can be used to perform advanced queries.


## Enabling monitoring and protection of App Services

1. In Azure, choose Security Center.
2. Go to **Security policy** and choose a subscription.
3. At the end of the row of the subscription, click **Edit settings**.
4. Under **Pricing tier**, in the **App services** row, toggle your plan to **Enabled**.

![app services toggle](./media/security-center-app-services/app-services-toggle.png)

To disable monitoring and recommendations for your App Services, repeat this process and toggle your **App Services** plan to **Disabled**.



## See also
In this article, you learned how to use monitoring capabilities in Azure Security Center. To learn more about Azure Security Center, see the following:

* [Setting security policies in Azure Security Center](security-center-policies.md): Learn how to configure security settings in Azure Security Center.
* [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md): Learn how to manage and respond to security alerts.
* [Monitoring partner solutions with Azure Security Center](security-center-partner-solutions.md): Learn how to monitor the health status of your partner solutions.
* [Azure Security Center FAQ](security-center-faq.md): Find frequently asked questions about using the service.
* [Azure Security Blog](http://blogs.msdn.com/b/azuresecurity/): Find blog posts about Azure security and compliance.
