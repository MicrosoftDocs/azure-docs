<properties 
	pageTitle="Configure a virtual network using a network configuration file" 
	description="Instructions to export and import a network configuration file to the Azure Management Portal in order to create or modify virtual networks. " 
	services="virtual-network" 
	documentationCenter="" 
	authors="cherylmc" 
	manager="adinah" 
	editor="tysonn"/>

<tags
	ms.service="virtual-network"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="infrastructure-services" 
	ms.date="04/06/2015"
	ms.author="cherylmc"/>

# Configure a virtual network using a network configuration file

## Overview

To configure your virtual network, you can use the Management Portal wizard, or you can create and import a network configuration file. Azure uses the network configuration file to define your virtual network settings. 

You might prefer to use the Management Portal wizard to initially create your virtual network configuration, and then make subsequent changes by direct edits to the configuration file. For example, if you are configuring multiple virtual networks for separate subscriptions, you may want to first create a network configuration file using the Management Portal wizard. You can then export the file to use as a template, edit it to specify different settings, and then import the file back into the Management Portal. This can be an efficient way to create multiple virtual networks when you have more than one subscription. 

Or, if you want to make changes to your network configuration settings before deploying cloud services or virtual machines to the network, you can export the file, edit it, and then import it back to Azure. You can also use a network configuration file to backup your network configuration settings if you want to recreate your virtual network.

## Creating and modifying a network configuration file 
The easiest way to author a network configuration file is to export the network settings from an existing virtual network configuration, then modify the file to contain the settings that you want to configure for your virtual networks. You can also obtain a sample file and modify it.

To edit the network configuration file, you can simply open the file, make the appropriate changes, and save them. You can use any *xml* editor to make changes to the network configuration file. 

You should closely follow the guidance for network configuration file schema settings. When you author your network configuration file, the settings in the file will overwrite the settings you currently have for that subscription in Azure. If you make changes to values in the file that are not compatible with the settings guidelines, your virtual network may not be configured in the way that you intended, and in some cases, Azure will not allow you to import the file. For information about the specific settings contained in a network configuration file, see [Azure Virtual Network Configuration Schema](https://msdn.microsoft.com/library/azure/jj157100.aspx). 

Azure considers a subnet that has something deployed to it as "in use". When a subnet is in use, it cannot be modified. Before modifying, move anything that you have deployed to the subnet to a different subnet that isn't being modified.   See [Move a VM or Role Instance to a Different Subnet](https://msdn.microsoft.com/library/azure/dn643636.aspx).



## Export and import virtual network settings using the Management Portal  
You can import an export network configuration settings contained in your network configuration file by using PowerShell or the Management Portal. The instructions below will help you export and import using the Management Portal. 

### To export your network settings
When you export, all of the settings for the virtual networks in your subscription will be written to an .xml file. 

1. Log into the **Management Portal**.
2. In the Management Portal, on the bottom of the **networks** page, click **Export**. 
3. On the **Export network configuration** window, verify that you have selected the subscription for which you want to export your network settings. Then, click the checkmark on the lower right. 
4. When you are prompted, save the *NetworkConfig.xml* file to the location of your choice.
### To import your network settings


1. In the **Management Portal**, in the navigation pane on the bottom left, click **New**.
2. Click **Network Services** -> **Virtual Network** -> **Import Configuration**.
3. On the **Import the network configuration file** page, browse to your network configuration file, and then click the **next** arrow.
4. On the **Building your network** page, you'll see information on the screen showing which sections of your network configuration will be changed or created. If the changes look correct to you, click the checkmark to proceed to update or create your virtual network. 


## See Also
For more information about virtual network, see:

-  [Virtual Network Overview](http://msdn.microsoft.com/library/windowsazure/jj156007.aspx)
-  [Network Configuration Schema - optional settings for cloud services](https://msdn.microsoft.com/library/azure/jj156091.aspx)
-  [About Virtual Network Settings in the Management Portal](https://msdn.microsoft.com/library/azure/jj156074.aspx)
-  [Virtual Network FAQ](https://msdn.microsoft.com/library/azure/dn133803.aspx)
-  [Virtual Network Configuration Tasks](https://msdn.microsoft.com/library/azure/jj156206.aspx)
-  [Configure a Multi-site VPN](https://msdn.microsoft.com/library/azure/dn690124.aspx)
-  [Configure a VNet to VNet Connection](https://msdn.microsoft.com/library/azure/dn690122.aspx)



