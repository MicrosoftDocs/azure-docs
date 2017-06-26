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
ms.date: 05/15/2017
ms.author: corywink

---
# Frequently asked questions for IoT Suite

### Where can I find the source code for the preconfigured solutions?

The source code is stored in the following GitHub repositories:
* [Remote Monitoring preconfigured solution][lnk-remote-monitoring-github]
* [Predictive maintenance preconfigured solution][lnk-predictive-maintenance-github]

### How do I update to the latest version of the remote monitoring preconfigured solution that uses the IoT Hub device management features?

* If you deploy a preconfigured solution from the https://www.azureiotsuite.com/ site, it always deploys a new instance of the latest version of the solution.
* If you deploy a preconfigured solution using the command line, you can update an existing deployment with new code. See [Cloud deployment][lnk-cloud-deployment] in the GitHub [repository][lnk-remote-monitoring-github].

### How can I add support for a new device method to the remote monitoring preconfigured solution?

See the section [Add support for a new method to the simulator][lnk-add-method] in the [Customize a preconfigured solution][lnk-customize] article.

### The simulated device is ignoring my desired property changes, why?
In the remote monitoring preconfigured solution, the simulated device code only uses the **Desired.Config.TemperatureMeanValue** and **Desired.Config.TelemetryInterval** desired properties to update the reported properties. All other desired property change requests are ignored.

### My device does not appear in the list of devices in the solution dashboard, why?

The list of devices in the solution dashboard uses a query to return the list of devices. Currently, a query cannot return more than 10K devices. Try making the search criteria for your query more restrictive.

### What's the difference between deleting a resource group in the Azure portal and clicking delete on a preconfigured solution in azureiotsuite.com?

* If you delete the preconfigured solution in [azureiotsuite.com][lnk-azureiotsuite], you delete all the resources that were provisioned when you created the preconfigured solution. If you added additional resources to the resource group, these resources are also deleted. 
* If you delete the resource group in the [Azure portal][lnk-azure-portal], you only delete the resources in that resource group. You also need to delete the Azure Active Directory application associated with the preconfigured solution in the [Azure classic portal][lnk-classic-portal].

### How many IoT Hub instances can I provision in a subscription?

By default you can provision [10 IoT hubs per subscription][link-azuresublimits]. You can create an [Azure support ticket][link-azuresupportticket] to raise this limit. As a result, since every preconfigured solution provisions a new IoT Hub, you can only provision up to 10 preconfigured solutions in a given subscription. 

### How many Azure Cosmos DB instances can I provision in a subscription?

Fifty. You can create an [Azure support ticket][link-azuresupportticket] to raise this limit, but by default, you can only provision 50 Cosmos DB instances per subscription. 

### How many Free Bing Maps APIs can I provision in a subscription?

Two. You can create only two Internal Transactions Level 1 Bing Maps for Enterprise plans in an Azure subscription. The remote monitoring solution is provisioned by default with the Internal Transactions Level 1 plan. As a result, you can only provision up to two remote monitoring solutions in a subscription with no modifications.

### I have a remote monitoring solution deployment with a static map, how do I add an interactive Bing map?

1. Get your Bing Maps API for Enterprise QueryKey from [Azure portal][lnk-azure-portal]: 
   
   1. Navigate to the Resource Group where your Bing Maps API for Enterprise is in the [Azure portal][lnk-azure-portal].
   2. Click **All Settings**, then **Key Management**. 
   3. You can see two keys: **MasterKey** and **QueryKey**. Copy the value for **QueryKey**.
      
      > [!NOTE]
      > Don't have a Bing Maps API for Enterprise account? Create one in the [Azure portal][lnk-azure-portal] by clicking + New, searching for Bing Maps API for Enterprise and follow prompts to create.
      > 
      > 
2. Pull down the latest code from the [Azure-IoT-Remote-Monitoring][lnk-remote-monitoring-github].
3. Run a local or cloud deployment following the command-line deployment guidance in the /docs/ folder in the repository. 
4. After you've run a local or cloud deployment, look in your root folder for the *.user.config file created during deployment. Open this file in a text editor. 
5. Change the following line to include the value you copied from your **QueryKey**: 
   
   `<setting name="MapApiQueryKey" value="" />`

### Can I create a preconfigured solution if I have Microsoft Azure for DreamSpark?

Currently, you cannot create a preconfigured solution with a [Microsoft Azure for DreamSpark][lnk-dreamspark] account. However, you can create a [free trial account for Azure][lnk-30daytrial] in just a couple of minutes that enables you create a preconfigured solution.

### Can I create a preconfigured solution if I have Cloud Solution Provider (CSP) subscription?

Currently, you cannot create a preconfigured solution with a Cloud Solution Provider (CSP) subscription. However, you can create a [free trial account for Azure][lnk-30daytrial] in just a couple of minutes that enables you create a preconfigured solution.

### How do I delete an AAD tenant?

See Eric Golpe's blog post [Walkthrough of Deleting an Azure AD Tenant][lnk-delete-aad-tennant].

### What is OPC UA?

OPC Unified Architecture (UA), released in 2008, is a platform-independent, service-oriented interoperability standard used by various industrial systems and devices such as industry PCs, PLCs, and sensors. OPC UA integrates all the functionality of the individual OPC Classic specifications into one extensible framework with built-in security. It is a standard that is driven by the OPC Foundation. The [OPC Foundation][lnk-opc-foundation] is a not-for-profit organization whose more than 440 members share the common goal of providing the infrastructure, specifications, technology, and processes to facilitate multi-vendor, multi-platform, secure and reliable interoperability using OPC specifications.

### Why did Microsoft choose OPC UA for the connected factory preconfigured solution?

Microsoft chose OPC UA because it is an open, non-proprietary, platform independent, industry-recognized, and proven standard. It is a requirement for Industrie 4.0 (RAMI4.0) reference architecture solutions ensuring interoperability between a broad set of manufacturing processes and equipment. Microsoft sees demand from our customers to build Industrie 4.0 solutions. Support for OPC UA helps lower the barrier for customers to achieve their goals and provides immediate business value to them.

### Next steps

You can also explore some of the other features and capabilities of the IoT Suite preconfigured solutions:

* [Predictive maintenance preconfigured solution overview][lnk-predictive-overview]
* [IoT security from the ground up][lnk-security-groundup]

[lnk-opc-foundation]: http://opcfoundation.org/
[lnk-predictive-overview]: iot-suite-predictive-overview.md
[lnk-security-groundup]: securing-iot-ground-up.md

[link-azuresupportticket]: https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade 
[link-azuresublimits]: https://azure.microsoft.com/documentation/articles/azure-subscription-service-limits/#iot-hub-limits
[lnk-azure-portal]: https://portal.azure.com
[lnk-azureiotsuite]: https://www.azureiotsuite.com/
[lnk-classic-portal]: https://manage.windowsazure.com
[lnk-remote-monitoring-github]: https://github.com/Azure/azure-iot-remote-monitoring 
[lnk-dreamspark]: https://www.dreamspark.com/Product/Product.aspx?productid=99 
[lnk-30daytrial]: https://azure.microsoft.com/free/
[lnk-delete-aad-tennant]: http://blogs.msdn.com/b/ericgolpe/archive/2015/04/30/walkthrough-of-deleting-an-azure-ad-tenant.aspx
[lnk-cloud-deployment]: https://github.com/Azure/azure-iot-remote-monitoring/blob/master/Docs/cloud-deployment.md
[lnk-add-method]: iot-suite-guidance-on-customizing-preconfigured-solutions.md#add-support-for-a-new-method-to-the-simulator
[lnk-customize]: iot-suite-guidance-on-customizing-preconfigured-solutions.md
[lnk-remote-monitoring-github]: https://github.com/Azure/azure-iot-remote-monitoring
[lnk-predictive-maintenance-github]: https://github.com/Azure/azure-iot-predictive-maintenance
