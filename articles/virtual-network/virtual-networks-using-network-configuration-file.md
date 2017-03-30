---
title: Configure an Azure Virtual Network (Classic) - Network configuration file | Microsoft Docs
description: Learn how to modify virtual networks (Classic) by exporting, changing, and importing a network configuration file using the Azure portal (Classic).
services: virtual-network
documentationcenter: ''
author: jimdial
manager: timlt
editor: tysonn

ms.assetid: c29b9059-22b0-444e-bbfe-3e35f83cde2f
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/15/2016
ms.author: jdial
ms.custom: H1Hack27Feb2017

---
# Configure a virtual network (Classic) using a network configuration file
You can configure a virtual network (Classic) by using the Azure portal (Classic), or by using a network configuration file. You cannot create or modify a virtual network through the Azure Resource Manager deployment model using a network configuration file. You also cannot use the Azure portal to create or modify a virtual network (Classic).

## Creating and modifying a network configuration file
The easiest way to author a network configuration file is to export the network settings from an existing virtual network (Classic) configuration, then modify the file to contain the settings that you want to configure for your virtual networks.

To edit the network configuration file, you can simply open the file, make the appropriate changes, then save the file. You can use any *xml* editor to make changes to the network configuration file. 

You should closely follow the guidance for [network configuration file schema settings](https://msdn.microsoft.com/library/azure/jj157100.aspx). 

Azure considers a subnet that has something deployed to it as **in use**. When a subnet is in use, it cannot be modified. Before modifying, move anything that you have deployed to the subnet to a different subnet that isn't being modified.   See [Move a VM or Role Instance to a Different Subnet](virtual-networks-move-vm-role-to-subnet.md).

## Export and import virtual network settings using the Azure portal (Classic)
You can import and export network configuration settings contained in your network configuration file by using PowerShell or the Management Portal. The instructions below will help you export and import using the Management Portal. 

### To export your network settings
When you export, all of the settings for the virtual networks in your subscription will be written to an .xml file. 

1. Log into the [Azure portal (Classic)](https://manage.windowsazure.com/).
2. In the portal, on the bottom of the **networks** page, click **Export**. 
3. On the **Export network configuration** window, verify that you have selected the subscription for which you want to export your network settings. Then, click the checkmark on the lower right. 
4. When you are prompted, save the *NetworkConfig.xml* file to the location of your choice.

### To import your network settings
1. In the portal, in the navigation pane on the bottom left, click **New**.
2. Click **Network Services** -> **Virtual Network** -> **Import Configuration**.
3. On the **Import the network configuration file** page, browse to your network configuration file, and then click the **next** arrow.
4. On the **Building your network** page, you'll see information on the screen showing which sections of your network configuration will be changed or created. If the changes look correct to you, click the check mark to proceed to update or create your virtual network. 

