<properties
  pageTitle="Azure IoT Suite FAQ | Microsoft Azure"
  description="Frequently asked questions for IoT Suite"
  services=""
  suite="iot-suite"
  documentationCenter=""
  authors="aguilaaj"
  manager="timlt"
  editor=""/>

<tags
  ms.service="iot-suite"
  ms.devlang="na"
  ms.topic="get-started-article"
  ms.tgt_pltfrm="na"
  ms.workload="na"
  ms.date="03/02/2016"
  ms.author="araguila"/>
   
# Frequently asked questions for IoT Suite

### How many DocumentDB instances can I provision in a subscription?

Five. You can create a support ticket to raise this limit, but by default, you can only provision five DocumentDB instances per subscription. As a result, you can only provision up to five remote monitoring preconfigured solutions in a given subscription.

### How many Free Bing Maps APIs can I provision in a subscription?

Two. You can create only two Free Bing Maps APIs in a subscription. The remote monitoring solution is provisioned by default with a Free Bing Maps API. As a result, you can only provision up to two remote monitoring solutions in a subscription with no modifications.

### What's the difference between deleting a resource group in the Azure portal and clicking delete on a preconfigured solution in azureiotsuite.com?

- If you delete the preconfigured solution in [azureiotsuite.com][lnk-azureiotsuite], you delete all the resources that were provisioned when you created the preconfigured solution; if you added additional resources to the resource group, these are also deleted. 

- If you delete the resource group in the [Azure portal][lnk-azure-portal], you only delete the resources in that resource group; you will also need to delete the Azure Active Directory application associated with the preconfigured solution in the [Azure classic portal][lnk-classic-portal].

### How do I delete an AAD tenant?

See Eric Golpe's blog post [Walkthrough of Deleting an Azure AD Tenant][lnk-delete-aad-tennant].


[lnk-azure-portal]: https://portal.azure.com
[lnk-azureiotsuite]: https://www.azureiotsuite.com/
[lnk-classic-portal]: https://manage.windowsazure.com
[lnk-delete-aad-tennant]: http://blogs.msdn.com/b/ericgolpe/archive/2015/04/30/walkthrough-of-deleting-an-azure-ad-tenant.aspx