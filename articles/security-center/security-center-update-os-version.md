<properties
   pageTitle="Update OS version in Azure Security Center | Microsoft Azure"
   description="This article shows you how to implement the Azure Security Center recommendation **Update OS version**."
   services="security-center"
   documentationCenter="na"
   authors="TerryLanfear"
   manager="MBaldwin"
   editor=""/>

<tags
   ms.service="security-center"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="07/29/2016"
   ms.author="terrylan"/>

# Update OS version in Azure Security Center

For virtual machines (VMs) in cloud services, Azure Security Center will recommend that the operating system (OS) be updated if there is a more recent version available.  Only cloud services web and worker roles running in production slots are monitored.

> [AZURE.NOTE] This document introduces the service by using an example deployment.  This is not a step-by-step guide.

## Implement the recommendation

1. In the **Recommendations** blade, select **Update OS version**.
![Update OS version][1]

2. This opens the blade **Update OS version**. Follow the steps in this blade to update the OS version.

## See also

This article showed you how to implement the Security Center recommendation "Update OS version." To learn more about cloud services and updating the OS version for a cloud service, see:

- [Cloud Services overview](../cloud-services/cloud-services-choose-me.md)
- [How to update a cloud service](../cloud-services/cloud-services-update-azure-service.md)
- [How to Configure Cloud Services](../cloud-services/cloud-services-how-to-configure-portal.md)

To learn more about Security Center, see the following:

- [Setting security policies in Azure Security Center](security-center-policies.md) -- Learn how to configure security policies for your Azure subscriptions and resource groups.
- [Managing security recommendations in Azure Security Center](security-center-recommendations.md) -- Learn how recommendations help you protect your Azure resources.
- [Security health monitoring in Azure Security Center](security-center-monitoring.md) -- Learn how to monitor the health of your Azure resources.
- [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) -- Learn how to manage and respond to security alerts.
- [Monitoring partner solutions with Azure Security Center](security-center-partner-solutions.md) -- Learn how to monitor the health status of your partner solutions.
- [Azure Security Center FAQ](security-center-faq.md) -- Find frequently asked questions about using the service.
- [Azure Security blog](http://blogs.msdn.com/b/azuresecurity/) -- Get the latest Azure security news and information.

<!--Image references-->
[1]: ./media/security-center-update-os-version/update-os-version.png
