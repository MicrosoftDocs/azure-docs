---
title: Azure IoT solution accelerators FAQ | Microsoft Docs
description: Frequently asked questions for IoT solution accelerators
author: dominicbetts
manager: timlt
ms.service: iot-accelerators
services: iot-accelerators
ms.topic: conceptual
ms.date: 02/15/2018
ms.author: dobett
---

# Frequently asked questions for IoT solution accelerators

See also, the [Connected Factory-specific FAQ](iot-accelerators-faq-cf.md) and the [Remote Monitoring-specific FAQ](iot-accelerators-faq-rm-v2.md) .

### Where can I find the source code for the solution accelerators?

The source code is stored in the following GitHub repositories:

* [Remote Monitoring solution accelerator (.NET)](https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet)
* [Remote Monitoring solution accelerator (Java)](https://github.com/Azure/azure-iot-pcs-remote-monitoring-java)
* [Predictive Maintenance solution accelerator](https://github.com/Azure/azure-iot-predictive-maintenance)
* [Connected Factory solution accelerator](https://github.com/Azure/azure-iot-connected-factory)

### What SDKs can I use to develop device clients for the solution accelerators?

You can find links to the different language (C, .NET, Java, Node.js, Python) IoT device SDKs in the [Microsoft Azure IoT SDKs](https://github.com/Azure/azure-iot-sdks) GitHub repositories.

If you are using the DevKit device, you can find resources and samples in the [IoT DevKit SDK](https://github.com/Microsoft/devkit-sdk) GitHub repository.

### Is the new microservices architecture available for all the three solution accelerators?

Currently, only the Remote Monitoring solution uses the microservices architecture as it covers the broadest scenario.

### What advantages does the new open-sourced microservices-based architecture provide in the new update?

Over the last two years, cloud architecture has greatly evolved. Microservices have emerged as a great pattern to achieve scale and flexibility, without sacrificing development speed. This architectural pattern is used in several Microsoft services internally with great reliability and scalability results. We are putting these learning in practice so that our customers benefit from them.

### Where can I find information about the previous version of the Remote Monitoring solution?

The previous version of the Remote Monitoring solution accelerator was known as the IoT Suite Remote Monitoring preconfigured solution. You can find the archived documentation at [https://docs.microsoft.com/previous-versions/azure/iot-suite/](https://docs.microsoft.com/previous-versions/azure/iot-suite/).

### Is the new solution accelerator available in the same geographic region as the existing solution?

Yes, the new Remote Monitoring is available in the same geographic regions.

### What's the difference between deleting a resource group in the Azure portal and clicking delete on a solution accelerator in azureiotsuite.com?

* If you delete the solution accelerator in [azureiotsuite.com](https://www.azureiotsolutions.com/), you delete all the resources that were provisioned when you created the solution accelerator. If you added additional resources to the resource group, these resources are also deleted.
* If you delete the resource group in the [Azure portal](https://portal.azure.com), you only delete the resources in that resource group. You also need to delete the Azure Active Directory application associated with the solution accelerator.

### Can I continue to leverage my existing investments in Azure IoT solution accelerators?

Yes. Any solution that exists today continues to work in your Azure subscription and the source code remains available in GitHub.

### How many IoT Hub instances can I provision in a subscription?

By default you can provision [10 IoT hubs per subscription](../azure-subscription-service-limits.md#iot-hub-limits). You can create an [Azure support ticket](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to raise this limit. As a result, since every solution accelerator provisions a new IoT Hub, you can only provision up to 10 solution accelerators in a given subscription.

### How many Azure Cosmos DB instances can I provision in a subscription?

Fifty. You can create an [Azure support ticket](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to raise this limit, but by default, you can only provision 50 Cosmos DB instances per subscription.

### How many Free Bing Maps APIs can I provision in a subscription?

Two. You can create only two Internal Transactions Level 1 Bing Maps for Enterprise plans in an Azure subscription. The Remote Monitoring solution is provisioned by default with the Internal Transactions Level 1 plan. As a result, you can only provision up to two Remote Monitoring solutions in a subscription with no modifications.

### Can I create a solution accelerator if I have Microsoft Azure for DreamSpark?

> [!NOTE]
> Microsoft Azure for DreamSpark is now known as Microsoft Imagine for students.

Currently, you cannot create a solution accelerator with a [Microsoft Azure for DreamSpark](https://azure.microsoft.com/pricing/member-offers/imagine/) account. However, you can create a [free trial account for Azure](https://azure.microsoft.com/free/) in just a couple of minutes that enables you create a solution accelerator.

### How do I delete an AAD tenant?

See Eric Golpe's blog post [Walkthrough of Deleting an Azure AD Tenant](http://blogs.msdn.com/b/ericgolpe/archive/2015/04/30/walkthrough-of-deleting-an-azure-ad-tenant.aspx).

### Next steps

You can also explore some of the other features and capabilities of the IoT solution accelerators:

* [Explore the capabilities of the Remote Monitoring solution accelerator](quickstart-remote-monitoring-deploy.md)
* [Predictive Maintenance solution accelerator overview](iot-accelerators-predictive-overview.md)
* [Deploy Connected Factory solution accelerator](quickstart-connected-factory-deploy.md)
* [IoT security from the ground up](/azure/iot-fundamentals/iot-security-ground-up)
