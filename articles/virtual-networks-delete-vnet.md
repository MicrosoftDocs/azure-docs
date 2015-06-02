<properties 
   pageTitle="How to delete a Virtual Network (VNet)"
   description="Learn how to delete an existing VNet"
   services="virtual-network"
   documentationCenter="na"
   authors="telmosampaio"
   manager="carolz"
   editor="tysonn" />
<tags 
   ms.service="virtual-network"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="05/29/2015"
   ms.author="telmos" />

# How to delete a Virtual Network (VNet)

If you want to delete a VNet, you can't simply click **Delete**. There are a few things you'll need to do first:

1. **Save Settings (optional) –** If you want to save the settings of the virtual network to a local file, export the configuration file before deleting your virtual network. See [Export Virtual Network Settings to a Network Configuration File](https://msdn.microsoft.com/library/azure/dn133804.aspx) for more information. Saving the settings allows you to recreate the VNet in the future, if needed.

1. **Delete the Virtual Network Gateway –** If you configured a gateway for the VNet, you need to delete it before deleting the VNet. To delete the Virtual Network Gateway, go to the Dashboard page for your virtual network. At the bottom of the page, click **Delete Gateway**.
						
	You may have to wait 5-10 minutes for the gateway to delete before continuing on to the next steps.

1. **Delete cloud services, websites, and VMs –** If you've deployed anything to the VNet, you'll need to delete those objects before you can delete the VNet.

1. **Delete your virtual network –** Click to the right of the *Name* row to highlight the VNet that you want to delete, and then click **Delete** at the bottom of the page. Follow the on-screen instructions.

1. **Additionally –** You may also choose to delete any local network settings, DNS servers, and the affinity group after deleting your virtual network.
