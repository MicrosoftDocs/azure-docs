---
title: Azure IoT Suite FAQ | Microsoft Docs
description: Frequently asked questions for IoT Suite
services: iot-suite
suite: iot-suite
documentationcenter: ''
author: dominicbetts
manager: timlt
editor: ''

ms.assetid: cb537749-a8a1-4e53-b3bf-f1b64a38188a
ms.service: iot-suite
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/15/2018
ms.author: dobett

---
# Frequently asked questions for IoT Suite

See also, the [connected factory-specific FAQ](iot-suite-faq-cf.md) and the [remote monitoring-specific FAQ](iot-suite-faq-rm-v2.md) .

### Where can I find the source code for the preconfigured solutions?

The source code is stored in the following GitHub repositories:

* [Remote monitoring preconfigured solution (.NET)](https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet)
* [Remote monitoring preconfigured solution (Java)](https://github.com/Azure/azure-iot-pcs-remote-monitoring-java)
* [Predictive maintenance preconfigured solution](https://github.com/Azure/azure-iot-predictive-maintenance)
* [Connected factory preconfigured solution](https://github.com/Azure/azure-iot-connected-factory)

### What SDKs can I use to develop device clients for the preconfigured solutions?

You can find links to the different language (C, .NET, Java, Node.js, Python) IoT device SDKs in the [Microsoft Azure IoT SDKs](https://github.com/Azure/azure-iot-sdks) GitHub repositories.

If you are using the DevKit device, you can find resources and samples in the [IoT DevKit SDK](https://github.com/Microsoft/devkit-sdk) GitHub repository.

### Is the new microservices architecture available for all the three preconfigured solutions?

Currently, only the remote monitoring solution uses the microservices architecture as it covers the broadest scenario.

### What advantages does the new open-sourced microservices-based architecture provide in the new update?

Over the last two years, cloud architecture has greatly evolved. Microservices have emerged as a great pattern to achieve scale and flexibility, without sacrificing development speed. This architectural pattern is used in several Microsoft services internally with great reliability and scalability results. We are putting these learning in practice so that our customers benefit from them.

### Is the new preconfigured solution available in the same geographic region as the existing solution?

Yes, the new remote monitoring is available in the same geographic regions.

### What's the difference between deleting a resource group in the Azure portal and clicking delete on a preconfigured solution in azureiotsuite.com?

* If you delete the preconfigured solution in [azureiotsuite.com](https://www.azureiotsuite.com/), you delete all the resources that were provisioned when you created the preconfigured solution. If you added additional resources to the resource group, these resources are also deleted.
* If you delete the resource group in the [Azure portal](https://portal.azure.com), you only delete the resources in that resource group. You also need to delete the Azure Active Directory application associated with the preconfigured solution.

### Can I continue to leverage my existing investments in Azure IoT Suite?

Yes. Any solution that exists today continues to work in your Azure subscription and the source code remains available in GitHub.

### How many IoT Hub instances can I provision in a subscription?

By default you can provision [10 IoT hubs per subscription](../azure-subscription-service-limits.md#iot-hub-limits). You can create an [Azure support ticket](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to raise this limit. As a result, since every preconfigured solution provisions a new IoT Hub, you can only provision up to 10 preconfigured solutions in a given subscription.

### How many Azure Cosmos DB instances can I provision in a subscription?

Fifty. You can create an [Azure support ticket](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to raise this limit, but by default, you can only provision 50 Cosmos DB instances per subscription.

### How many Free Bing Maps APIs can I provision in a subscription?

Two. You can create only two Internal Transactions Level 1 Bing Maps for Enterprise plans in an Azure subscription. The remote monitoring solution is provisioned by default with the Internal Transactions Level 1 plan. As a result, you can only provision up to two remote monitoring solutions in a subscription with no modifications.

### Can I create a preconfigured solution if I have Microsoft Azure for DreamSpark?

> [!NOTE]
> Microsoft Azure for DreamSpark is now known as Microsoft Imagine for students.

Currently, you cannot create a preconfigured solution with a [Microsoft Azure for DreamSpark](https://azure.microsoft.com/pricing/member-offers/imagine/) account. However, you can create a [free trial account for Azure](https://azure.microsoft.com/free/) in just a couple of minutes that enables you create a preconfigured solution.

### Can I create a preconfigured solution if I have Cloud Solution Provider (CSP) subscription?

Currently, you cannot create a preconfigured solution with a Cloud Solution Provider (CSP) subscription. However, you can create a [free trial account for Azure](https://azure.microsoft.com/free/) in just a couple of minutes that enables you create a preconfigured solution.

### How do I delete an AAD tenant?

See Eric Golpe's blog post [Walkthrough of Deleting an Azure AD Tenant](http://blogs.msdn.com/b/ericgolpe/archive/2015/04/30/walkthrough-of-deleting-an-azure-ad-tenant.aspx).

### Next steps

You can also explore some of the other features and capabilities of the IoT Suite preconfigured solutions:

* [Explore the capabilities of the remote monitoring preconfigured solution](iot-suite-remote-monitoring-explore.md)
* [Predictive maintenance preconfigured solution overview](iot-suite-predictive-overview.md)
* [Connected factory preconfigured solution overview](iot-suite-connected-factory-overview.md)
* [IoT security from the ground up](securing-iot-ground-up.md)