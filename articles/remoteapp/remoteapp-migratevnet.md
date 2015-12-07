<properties 
    pageTitle="How to migrate from a RemoteApp VNET to an Azure VNET"
    description="Learn how to migrate from a RemoteApp VNET to an Azure VNET" 
    services="remoteapp" 
	documentationCenter="" 
    authors="lizap" 
    manager="mbaldwin" />

<tags 
    ms.service="remoteapp" 
    ms.workload="compute" 
    ms.tgt_pltfrm="na" 
    ms.devlang="na" 
    ms.topic="article" 
    ms.date="09/02/2015" 
    ms.author="elizapo" />



# How to migrate a hybrid collection from a RemoteApp VNET to an Azure VNET

Good news! We have enabled you to deploy hybrid RemoteApp collections directly into your existing Azure virtual networks (VNETs) instead of creating RemoteApp-specific VNETs. This lets you take advantage of the latest VNET features (like ExpressRoute) and give your hybrid collections direct network access to other Azure services and virtual machines deployed to that VNET.  (This gets you better performance and easier setup than VNET-to-VNET configurations).


Let’s say that you’ve already created a hybrid RemoteApp collection called *OriginalCollection* with a RemoteApp VNET called *RemoteAppVNET*. Here are the steps to migrate it to a new Azure VNET called *AzureVNET*.

1.	On the **Networks** tab in the [management portal](http://manage.windowsazure.com/), create a VNET called *AzureVNET*, using the same location, DNS configuration, and address space (for at least one of the *AzureVNET* subnets) as you used for *RemoteAppVNET*.
2.	Configure *AzureVNET* to either host or have network connectivity to the Active Directory deployment that *OriginalCollection* is domain joined to.
3.	On the **RemoteApps** tab, create a new RemoteApp collection called *New Collection*. (Use the **Create with VNET** option, not **Quick Create**.)
3.	Configure *NewCollection* to be deployed to a subnet in *AzureVNET*.
4.	Configure *NewCollection* to use the same image and domain join information as you used for *OriginalCollection*.
5.	After a few hours, *NewCollection* will show up in your collection list with an Active state.

Now, if you DON’T need to migrate any user information from the original collection to the new collection, do these steps next:

6.	Delete *OriginalCollection*.
7.	Delete *RemoteAppVNET*.

And, you’re done!

Alternately, if you DO need to migrate user information from the original collection to the new collection, do these steps next: 

6.	Send an email to [remoteappforum@microsoft.com](mailto:remoteappforum@microsoft.com?subject=Azure%20RemoteApp%20user%20information%20migration) with your Azure subscription ID, the name of your original collection, and the name of your new collection, and ask them to migrate your user information.
7.	Within 2 business days the RemoteApp team will move the user access list and all user documents and user settings from the original collection to the new collection.
8.	Delete *OriginalCollection*.
9.	Delete *RemoteAppVNET*.

And now, you’re done!

If you have any questions or need special assistance, please email [remoteappforum@microsoft.com](mailto:remoteappforum@microsoft.com?subject=Azure%20RemoteApp%20VNET%20migration%20help).
 