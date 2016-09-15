
<properties
    pageTitle="What's new in Azure RemoteApp? | Microsoft Azure"
    description="Learn about changes and improvements made to Azure RemoteApp"
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
    ms.date="08/15/2016"
    ms.author="elizapo" />



# What's new in Azure RemoteApp?

> [AZURE.IMPORTANT]
> Azure RemoteApp is being discontinued. Read the [announcement](https://go.microsoft.com/fwlink/?linkid=821148) for details.

One of the advantages of Azure RemoteApp is that we are always working to improve it. Every time we do, we'll announce those changes here.

## Future updates
Hey - did you know the Azure RemoteApp team posts monthly updates to the RDS blog? You can find not just what's change in Azure RemoteApp but also other information about how to use RDS. Check out their blog, [Remote Desktop Services Blog](https://blogs.msdn.microsoft.com/rds/), for information. For example, a couple of weeks ago, they posted an entry about [lifting and shifting workloads with Azure RemoteApp and Azure AD](https://blogs.msdn.microsoft.com/rds/2016/01/19/lift-and-shift-your-workloads-with-azure-remoteapp-and-azure-ad-domain-services/).
 
## September 2015
- Added Infopath to the Microsoft Office 365 template and gallery image. If you want to share Infopath, make sure to update your collections with the latest image.
- Client updates:
	- Windows client updated to make it possible for users to share feedback, especially around connection issues.
	- iOS client updated to fix error messaging and to fix a problem where your credentials expired earlier than expected.
- We're working on getting Office 2016 support tested. Once that's completed, look for updated images.
- Published a new article about the [differences between cloud and hybrid collections](remoteapp-collections.md) - this will help you choose the collection type that works best for your apps - cloud-only, cloud + VNET, or hybrid.
- Want to share QuickBooks using Azure RemoteApp but not sure of the steps? Check out [Eric's new article](remoteapp-quickbooks.md) telling you exactly what to do.

## August 2015
Big changes happened in August - here are the highlights:

- You can now use an Azure VNET with a cloud collection! Check out the [cloud creation instructions](remoteapp-create-cloud-deployment.md) for the new steps.
- Made it possible to add apps to the **Start **menu for the Windows RemoteApp client. Apps will show up in the application list, and you can pin them to the **Start **menu in Windows.
- Added a new image to the Azure VM gallery - Windows Server Remote Desktop Session Host with Microsoft Office 365 ProPlus.
- Fixed the Mac client so apps with modal windows will stop freezing.
- Documented how you can use your [Office 365 ProPlus subscription](remoteapp-officesubscription.md) with Azure RemoteApp.
- Detailed how you can [secure the apps and data](remoteapp-secure.md) in your Azure RemoteApp collection.

## July 2015

July set the stage for changes coming in August, so there's not a lot to talk about now, mostly doc updates. Here are the most recent changes:

- Added a **Support** tab to the portal so you can more easily access support resources, like the forums.
- Reworked the troubleshooting information for creating a hybrid collection. Check out [the latest and greatest](remoteapp-hybridtrouble.md) for troubleshooting tips like, how to identify the correct ports to configure for your VNET.
- Documented how [user data](remoteapp-upd.md) is created and saved in Azure RemoteApp.
- Documented how to [lock down apps](remoteapp-secure.md).
- Published the [Azure RemoteApp cmdlets](https://msdn.microsoft.com/library/mt428031.aspx).
- And finally, we started a conversation with some Azure RemoteApp users about terminology. Look for changes to the way we refer to the different collection options.

## June 2015

So many changes! The team has been very busy in June:

- Redesigned the Azure RemoteApp [landing page](https://www.remoteapp.windowsazure.com/) - check it out!
- Updated the software in all the images available as part of your subscription.
- Made improvements to hybrid collections, including forced tunneling support and checking IP subnet size before trying to create the collection.
- Discovered that the * wildcard doesn't work for webcams. Instead, you need to specify the instance ID or GUID. We'll be updating the redirection information to reflect that.
- Made it so you can add custom antivirus software to your image when you create a template image from the Azure gallery.

We've got more changes rolling out in July, so we'll be back with another update soon.

## May 2015

There have been a number of additions (and months) since we first created this topic, so this list cheats a bit and is from the beginning of March through May. Check out these new features:

- Automate everything - Azure RemoteApp now has [cmdlets in the Azure PowerShell module](remoteapp-tutorial-arawithpowershell.md).
- [Create an Azure RemoteApp image from an Azure virtual machine](remoteapp-image-on-azurevm.md). Makes uploading your custom image to Azure much quicker.
- Use an Azure VNET instead of a RemoteApp VNET to connect your corporate network resources to Azure. We've updated the [hybrid collection instructions](remoteapp-create-hybrid-deployment.md) to walk you through creating an Azure VNET (it's Step 1).
- Speaking of VNETs, check out [the new guidance](remoteapp-vnetsizing.md) around VNET size limits and limitations.
- And speaking of limits - just what are the [service limits and defaults](../azure-subscription-service-limits.md)?

Want to learn more about Azure RemoteApp? The RemoteApp team was out in force at Ignite a few weeks ago. Check out Eric's video, [The Fundamentals of Microsoft Azure RemoteApp Management and Administration](http://channel9.msdn.com/Events/Ignite/2015/BRK3868).

Need to see Azure RemoteApp in the real world? Check out the [Run any app on any device anywhere](remoteapp-anyapp.md) tutorial - it shows you how to share Access with your users, including sharing the database files. We also have a tutorial on [making Office 365](remoteapp-tutorial-o365anywhere.md) run the same on any device.

Thanks for sticking with us - back next month with more updates.


### Help us help you
Did you know that in addition to rating this article and making comments down below, you can make changes to the article itself? Something missing? Something wrong? Did I write something that's just confusing? Scroll up and click **Edit on GitHub** to make changes - those will come to us for review, and then, once we sign off on them, you'll see your changes and improvements right here.
