---
title: Accessing Azure Virtual Machines from Server Explorer | Microsoft Docs
description: Get an overview of how to view create and manage Azure virtual machines (VMs) in Server Explorer in Visual Studio.
services: visual-studio-online
author: ghogen
manager: douge
assetId: eb3afde6-ba90-4308-9ac1-3cc29da4ede0
ms.prod: visual-studio-dev15
ms.technology: vs-azure
ms.custom: vs-azure
ms.workload: azure-vs
ms.topic: conceptual
ms.date: 8/31/2017
ms.author: ghogen

---
# Accessing Azure Virtual Machines from Server Explorer

If you have virtual machines hosted by Azure, you can access them in Server Explorer. You must first sign in to your Azure subscription to view your mobile services. To sign in, open the shortcut menu for the Azure node in Server Explorer, and choose **Connect to Microsoft Azure**.

1. In Cloud Explorer, choose a virtual machine, and then choose the F4 key to show its properties window.

    The following table shows what properties are available, but they are all read-only. To change them, use the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040).

   | Property | Description |
   | --- | --- |
   | DNS Name |The URL with the Internet address of the virtual machine. |
   | Environment |For a virtual machine, the value of this property is always Production. |
   | Name |The name of the virtual machine. |
   | Size |The size of the virtual machine, which reflects the amount of memory and disk space that’s available. For more information, see [Virtual Machine Sizes](https://docs.microsoft.com/azure/cloud-services/cloud-services-sizes-specs). |
   | Status |Values include Starting, Started, Stopping, Stopped, and Retrieving Status. If Retrieving Status appears, the current status is unknown. The values for this property differ from the values that are used on the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040). |
   | SubscriptionID |The subscription ID for your Azure account. You can show this information on the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040) by viewing the properties for a subscription. |
2. Choose an endpoint node, and then view the **Properties** window.
3. The following table describes the available properties of endpoints, but they are read-only. To add or edit the endpoints for a virtual machine, use the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040). 

   | Property | Description |
   | --- | --- |
   | Name |An identifier for the endpoint. |
   | Private Port |The port for network access internal to your application. |
   | Protocol |The protocol that the transport layer for this endpoint uses, either TCP or UDP. |
   | Public Port |The port that’s used for public access to your application. |
