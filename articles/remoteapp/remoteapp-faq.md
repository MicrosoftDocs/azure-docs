<properties 
	pageTitle="Azure RemoteApp FAQ | Microsoft Azure" 
	description="Learn answers to the most frequently asked questions about Azure RemoteApp." 
	services="remoteapp" 
	documentationCenter="" 
	authors="lizap" 
	manager="mbaldwin" 
	editor=""/>

<tags 
	ms.service="remoteapp" 
	ms.workload="compute" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="get-started-article" 
	ms.date="06/27/2016" 
	ms.author="elizapo"/>

# Azure RemoteApp FAQ
We've heard the following questions about Azure RemoteApp. Have others? Visit the [RemoteApp forums](https://social.msdn.microsoft.com/Forums/azure/home?forum=AzureRemoteApp) and let us know what you need to know, or drop a comment down below.

## What is Azure RemoteApp? ##


- **What is Azure RemoteApp?** RemoteApp is an Azure service helps you provide secure, remote access to applications from many different user devices. Read more  about [Azure RemoteApp](remoteapp-whatis.md).
- **What are the deployment options?** There are two kinds of RemoteApp collections: cloud and hybrid. Which one you need depends on a number of factors, like whether you need domain join. We talk about all of those decisions [here](remoteapp-collections.md).

## Quick tips on using Azure RemoteApp ##
- **How long until I'm disconnected? How long can I be idle before you give me the boot?** 4 hours. If you or one of your users is idle for 4 hours, you'll be automatically signed out of Azure RemoteApp. Check out the other default settings in [Azure Subscription and Service Limits, Quotas, and Constraints](../azure-subscription-service-limits.md).
- **Can I try this service for free?** Yes. There is a free trial available for 30 days. After the trial ends, you can transition to a paid account (which you can use in production) or stop using the service. Start your free trial by going to [portal.azure.com](http://portal.azure.com) - create a new instance of RemoteApp. With the free trial, you can build 2 instances of RemoteApp with 10 users per instance. Remember that this trial only lives for 30 days.
## Azure RemoteApp subscription details ##

- **What are the service limits?** You can learn about the default settings and service limits of Azure RemoteApp in [Azure Subscription and Service Limits, Quotas, and Constraints](../azure-subscription-service-limits.md). Let us know if you have more questions.
- **How many users do I have to have?** There's a minimum of 20 users. Let me repeat that to be super clear - the MINIMUM is 20. You will be billed for 20. 
- **How much does RemoteApp cost?** Check out [Azure RemoteApp Pricing Details ](https://azure.microsoft.com/pricing/details/remoteapp/).
- **Does one type of collection cost more than another?** 
Yes, it can, depending on your collection requirements. A hybrid collection requires a connection from Azure RemoteApp to your on-premises network. If you use an existing VNET/Express Route, there is no additional cost. But if you use a new Azure VNET and either a gateway or Express Route, you will be charged for the [VPN gateway](https://azure.microsoft.com/pricing/details/vpn-gateway) or [Express Route](https://azure.microsoft.com/pricing/details/expressroute/). This cost (detailed in the links) is on top of your monthly Azure RemoteApp cost.

## Collections - what's supported, which should you use, and others
- **Are custom line-of-business (LOB) applications supported?** Yes. To use a custom application in Azure RemoteApp, create a [custom template image](remoteapp-create-custom-image.md), and then upload it to the RemoteApp collection.
- **Will my custom LOB application work in Azure RemoteApp?** The best way to figure that out is to test it. Check out the [RD Compatibility Center](http://www.rdcompatibility.com/compatibility/default.aspx).
- **Which deployment method (cloud or hybrid) is best for my organization?** Hybrid collections provide the most complete experience if you want full integration with single sign-on (SSO) and secure on-premises network connectivity. Cloud collections provide an agile and easy way to isolate your deployment by using multiple authentication methods. Read more about the [deployment options](remoteapp-whatis.md).
- **We have SQL or another database either on-premises or in Azure. Which deployment type should we use?** That depends on where your SQL or backend database is. If the database is in a private network, use the hybrid collection. If the database is exposed to the Internet and allows client connections to connect to it, you can use the cloud collection.
- **What about drive mapping, USB and serial port, clipboard sharing, and printer redirection?** All of those features are supported in Azure RemoteApp. Clipboard sharing and printer redirection is enabled by default. You can learn more about redirection [here](remoteapp-redirection.md). 


## Template images
- **Can I use a cloud or existing virtual machine as the template for my RemoteApp collection?** Yes! You can create an image based on an Azure VM, use one of the images included with your subscription, or create a custom image. Check out the [RemoteApp image options](remoteapp-imageoptions.md).


## Network options
- **The hybrid collection requires a VNET. Can we use our existing VNET?** You can if the existing VNET is an Azure VNET. See "Step 1: Set up your virtual network" in the [hybrid collection instructions](remoteapp-create-hybrid-deployment.md) for more information.
- **Can I use a VNET with a cloud collection?** Indeed you can. Check out [Create a cloud collection](remoteapp-create-cloud-deployment.md), particularly Step 1, for more information.

## Authentication options



- **How about authentication? Which methods are supported?** The cloud collection supports Microsoft accounts and Azure Active Directory accounts, which are Office 365 accounts as well. The hybrid collection supports only Azure Active Directory accounts that have been synced (using a tool like [Azure Active Directory Sync](http://blogs.technet.com/b/ad/archive/2014/09/16/azure-active-directory-sync-is-now-ga.aspx)) from a Windows Server Active Directory deployment; specifically, either synced with the Password Synchronization option or synced with Active Directory Federation Services (AD FS) federation configured. You can also configure [Multi-Factor Authentication (MFA)](https://azure.microsoft.com/services/multi-factor-authentication/).

>[AZURE.NOTE]The Azure Active Directory users must be from the tenant that's associated with your subscription. (You can view and modify your subscription on the **Settings** tab in the portal. See [Change the Azure Active Directory tenant used by RemoteApp](remoteapp-changetenant.md) for more information.)

- **Why can't I give my Azure Active Directory account access?** The Azure Active Directory users must be from the directory that's associated with your subscription. You can view or modify that directory on the Settings tab in the portal. See [Change the Azure Active Directory tenant used by RemoteApp](remoteapp-changetenant.md) for more information.

## Clients - what device can I use to access Azure RemoteApp?
You can find good client information, including steps for installing the different clients at [Accessing your apps in Azure RemoteApp](remoteapp-clients.md).

- **Which devices and operating systems do the client applications support?**
First, the computers and tablets: 
	- Windows 10 (client preview)
	- Windows 8.1 and Windows 8
	- Windows 7 Service Pack 1
	- Mac OS X
	- Windows RT
	- Android tablets
	- iPads
And the phones:
	- iPhone
	- Android Phone
	- Windows Phone
 
	[Download](https://www.remoteapp.windowsazure.com/ClientDownload/AllClients.aspx) a RemoteApp client now.
- **Does Azure RemoteApp support Thin Clients?** Yes, the following Windows Embedded thin clients are supported:
	- Windows Embedded Standard 7
	- Windows Embedded 8 Standard
	- Windows Embedded 8.1 Industry Pro
	- Windows 10 IoT Enterprise

- **Which version of Windows Server is supported for the Remote Desktop Session Host (RDSH)?** Windows Server 2012 R2.

##Support and feedback


- **What is the support plan for RemoteApp?** Support for billing and subscription management is provided at no cost. Technical support is available through the [Azure service plans](https://azure.microsoft.com/support/plans/). You can also get free community support through our [Azure discussion forum](http://social.msdn.microsoft.com/Forums/windowsazure/home?forum=AzureRemoteApp). 
- **How do I submit feedback?** Visit the [feedback forum](https://feedback.azure.com/forums/247748-azure-remoteapp/).
- **Who can I talk to learn more about Azure RemoteApp?** In addition to our [discussion forum](http://social.msdn.microsoft.com/Forums/windowsazure/home?forum=AzureRemoteApp), which is a great place to post questions, you can join the weekly [Ask the Experts webinar](https://azureinfo.microsoft.com/US-Azure-WBNR-FY15-11Nov-AzureRemoteAppAskTheExperts-Registration-Page.html), where we talk about all things RemoteApp.
- **What about RemoteApp documentation?** We're so glad you asked. In addition to the help content in the portal help drawer (just click the **?** on any page in the portal), the following articles are available to teach you all about RemoteApp:
	- **Get started:**
		- [What is RemoteApp?](remoteapp-whatis.md)
		- [What is in the RemoteApp template images?](remoteapp-images.md)
		- [How does licensing work?](remoteapp-licensing.md)
		- [How do RemoteApp and Office work together?](remoteapp-o365.md)
		- [How does redirection work in RemoteApp](remoteapp-redirection.md)?
	- **Deploy:**
		- [Create a custom template image](remoteapp-create-custom-image.md)
		- [Create a hybrid collection](remoteapp-create-hybrid-deployment.md)
		- [Create a cloud collection](remoteapp-create-cloud-deployment.md)
		- [Configure Azure Active Directory for RemoteApp](remoteapp-ad.md)
		- [Publish an app in RemoteApp](remoteapp-publish.md)
	- **Manage:**
		- [Add users](remoteapp-user.md)
		- [Best practices for configuring and using RemoteApp](remoteapp-bestpractices.md)	

	Videos! We also have a number of videos about RemoteApp. Some provide introduction ([Introduction to Azure RemoteApp](https://azure.microsoft.com/documentation/videos/cloud-cover-ep-150-azure-remote-app-with-thomas-willingham-and-nihar-namjoshi/)) while others walk you through deployment ([Cloud deployment](https://www.youtube.com/watch?v=3NAv2iwZtGc&feature=youtu.be) and [Hybrid deployment](https://www.youtube.com/watch?v=GCIMxPUvg0c&feature=youtu.be)). Check them out!

 
### Help us help you 
Did you know that in addition to rating this article and making comments down below, you can make changes to the article itself? Something missing? Something wrong? Did I write something that's just confusing? Scroll up and click **Edit on GitHub** to make changes - those will come to us for review, and then, once we sign off on them, you'll see your changes and improvements right here.
