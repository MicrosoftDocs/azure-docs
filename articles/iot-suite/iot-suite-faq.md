---
title: Azure IoT Suite FAQ | Microsoft Docs
description: Frequently asked questions for IoT Suite
services: ''
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
ms.date: 09/21/2017
ms.author: dobett

---
# Frequently asked questions for IoT Suite

See also, the connected factory-specific [FAQ](iot-suite-faq-cf.md).

### Where can I find the source code for the preconfigured solutions?

The source code is stored in the following GitHub repositories:

* [Remote monitoring preconfigured solution (.NET)](https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet)
* [Remote monitoring preconfigured solution (Java)](https://github.com/Azure/azure-iot-pcs-remote-monitoring-java)
* [Predictive maintenance preconfigured solution](https://github.com/Azure/azure-iot-predictive-maintenance)
* [Connected factory preconfigured solution](https://github.com/Azure/azure-iot-connected-factory)

### How much does it cost to provision the new remote monitoring solution?

The new preconfigured solution offers two deployment options:

* A *basic* option designed for developers looking for lower development cost or customers looking to build a demo or proof of concept.
* A *standard* option designed for enterprises wanting to deploy a production-ready infrastructure.

### How can I ensure I keep my costs down while I develop my solution?

In addition to providing two differentiated deployments, the new remote monitoring solution has a setting to enable or disable all the simulated devices on demand. Disabling the simulation reduces the data ingested in the solution and, thus, the overall cost.

### Is the new microservices architecture available for all the three preconfigured solutions?

Currently, only the remote monitoring solution uses the microservices architecture as it covers the broadest scenario.

### What advantages does the new open-sourced microservices-based architecture provide in the new update?

Over the last two years, cloud architecture has greatly evolved. Micro services have emerged as a great pattern to achieve scale and flexibility, without sacrificing development speed. This architectural pattern is used in several Microsoft services internally with great reliability and scalability results. We are putting these learning in practice so that our customers benefit from them.

### Is the new preconfigured solution available in the same geographic region as the existing solution?

Yes, the new remote monitoring is available in the same geographic regions.

### What is the difference between the basic and standard deployment options? How do I decide between the two deployment options?

Each deployment option responds to different needs. The basic deployment is designed to get started and develop PoC and small pilots. It provides a streamlined architecture with the minimum necessary resources and a lower cost. The standard deployment is designed to build and customize a production-ready solution, and provides a deployment with the necessary elements to realize that. For reliability and scale, application microservices are built as Docker containers and deployed using an orchestrator (Kubernetes by default). The orchestrator is responsible for deployment, scaling, and management of the application. You should choose an option based on your current needs. You might use one, the other, or a combination of both depending on your project stage.

### Can I continue to leverage my existing investments in Azure IoT Suite?

Yes. Any solution that exists today continues to work in your Azure subscription and the source code remains available in GitHub.

### What's the difference between deleting a resource group in the Azure portal and clicking delete on a preconfigured solution in azureiotsuite.com?

* If you delete the preconfigured solution in [azureiotsuite.com](https://www.azureiotsuite.com/), you delete all the resources that were provisioned when you created the preconfigured solution. If you added additional resources to the resource group, these resources are also deleted.
* If you delete the resource group in the [Azure portal](https://portal.azure.com), you only delete the resources in that resource group. You also need to delete the Azure Active Directory application associated with the preconfigured solution.

### How many IoT Hub instances can I provision in a subscription?

By default you can provision [10 IoT hubs per subscription](../azure-subscription-service-limits.md#iot-hub-limits). You can create an [Azure support ticket](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to raise this limit. As a result, since every preconfigured solution provisions a new IoT Hub, you can only provision up to 10 preconfigured solutions in a given subscription.

### How many Azure Cosmos DB instances can I provision in a subscription?

Fifty. You can create an [Azure support ticket](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to raise this limit, but by default, you can only provision 50 Cosmos DB instances per subscription.

### How many Free Bing Maps APIs can I provision in a subscription?

Two. You can create only two Internal Transactions Level 1 Bing Maps for Enterprise plans in an Azure subscription. The remote monitoring solution is provisioned by default with the Internal Transactions Level 1 plan. As a result, you can only provision up to two remote monitoring solutions in a subscription with no modifications.

### Can I create a preconfigured solution if I have Microsoft Azure for DreamSpark?

Currently, you cannot create a preconfigured solution with a [Microsoft Azure for DreamSpark](https://www.dreamspark.com/Product/Product.aspx?productid=99) account. However, you can create a [free trial account for Azure](https://azure.microsoft.com/free/) in just a couple of minutes that enables you create a preconfigured solution.

### Can I create a preconfigured solution if I have Cloud Solution Provider (CSP) subscription?

Currently, you cannot create a preconfigured solution with a Cloud Solution Provider (CSP) subscription. However, you can create a [free trial account for Azure](https://azure.microsoft.com/free/) in just a couple of minutes that enables you create a preconfigured solution.

### How do I delete an AAD tenant?

See Eric Golpe's blog post [Walkthrough of Deleting an Azure AD Tenant](http://blogs.msdn.com/b/ericgolpe/archive/2015/04/30/walkthrough-of-deleting-an-azure-ad-tenant.aspx).

### Next steps

You can also explore some of the other features and capabilities of the IoT Suite preconfigured solutions:

* [Predictive maintenance preconfigured solution overview](iot-suite-predictive-overview.md)
* [Connected factory preconfigured solution overview](iot-suite-connected-factory-overview.md)
* [IoT security from the ground up](securing-iot-ground-up.md)