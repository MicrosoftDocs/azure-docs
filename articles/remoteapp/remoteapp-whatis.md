<properties 
	pageTitle="What is Azure RemoteApp? | Microsoft Azure" 
	description="Learn how to share apps and resources to any device through Azure RemoteApp." 
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
	ms.date="06/18/2016" 
	ms.author="elizapo"/>

# What is Azure RemoteApp?

Azure RemoteApp brings the functionality of the on-premises Microsoft RemoteApp program, backed by Remote Desktop Services, to Azure. Azure RemoteApp helps you provide secure, remote access to applications from many different user devices. Azure RemoteApp basically hosts non-persistent Terminal Server sessions in the cloud, and you get to use them and share them with your users.

With Azure RemoteApp you can share apps and resources with users on almost any device. We host your apps in the cloud, meaning we take care of the hardware and scaling to meet user demands. All you have to do is upload the apps you want to share, and then get your users to use those apps. [Users get to keep their own devices](remoteapp-clients.md), while you manage everything through the Azure portal. You even have the option of using your corporate credentials, letting you ensure the security of apps and data.

Read on for more information about Azure RemoteApp, or, if we have already convinced you, [try it out now](https://azure.microsoft.com/services/remoteapp/).

Have questions about Azure RemoteApp? Check out our [FAQ](remoteapp-faq.md).

Azure RemoteApp is part of the [Microsoft Virtual Desktop Infrastructure](http://www.microsoft.com/server-cloud/products/virtual-desktop-infrastructure/explore.aspx).

**New!** Want to learn more about Azure RemoteApp? Or ready to validate Azure RemoteApp at scale? Join our weekly [ask the experts webinar](https://azureinfo.microsoft.com/AzureRemoteAppAskTheExperts-Registration-Page.html?ls=Website).

## Azure RemoteApp collections
There are two kinds of [Azure RemoteApp collections](remoteapp-collections.md):


- A **cloud collection** is hosted in and stores data for programs in the cloud. Users can access apps by logging in with their Microsoft account or corporate credentials synchronized or federated with Azure Active Directory.

	Choose a cloud collection when the application you want to share does not require a connection to any resource your company's private network (for example, through a VPN device). If the application uses resources on the Internet, OneDrive, or Azure, a cloud collection will work for you. It's also the quickest to create.

- A **hybrid collection** is hosted in and stores data in the Azure cloud but also lets users access data and resources stored on your local network. Users can access apps by logging in with their corporate credentials synchronized or federated with Azure Active Directory.

	Choose a hybrid collection if you require a connection to resources on your company's private network. For example, if the application needs access to one of the following:

	- File servers located on your intranet
	- Quicken
	- Databases behind a firewall

	This is generally more useful for large companies with lots of resources on their private networks that can't be moved to the cloud.

The different collections have different options, including networks, so figure out [which collection](remoteapp-collections.md) works best for you. 


### Updating your collection
One of the key differences between the hybrid and cloud collections is how software updates are handled. With a cloud collection that uses the preinstalled Office 365 ProPlus or Office 2013 image, you do not have to worry about any updates. The service maintains itself and rolls out updates on an ongoing basis, to both apps and the operating system.

For hybrid collections, as well as cloud collections that use a custom template image, you are in charge of maintaining the image and apps. For domain-joined images, you can control updates by using tools such as Windows Update, Group Policy, or System Center.

After you update your custom template image, you upload the new image to the Azure cloud and then update the collection to use the new image. (You can do this from the Azure RemoteApp **Quick Start** page or the Dashboard.)

See [Update your collection](remoteapp-update.md) for more information.

## Supported RemoteApp clients
Azure RemoteApp is supported on the RemoteApp client apps for Windows and Windows RT, as well as the Microsoft Remote Desktop apps for Mac, iOS and Android. Your users can use these apps on their mobile or compute devices to access the new Azure RemoteApp programs.

See [Accessing your apps in Azure RemoteApp](remoteapp-clients.md) for more information about the clients.

## Next steps
Go! Try it out! These articles help get you started with Azure RemoteApp:

- [What kind of collection do you need for Azure RemoteApp?](remoteapp-collections.md)
- [Create an Azure RemoteApp image](remoteapp-imageoptions.md)
- [How to create a cloud collection of Azure RemoteApp](remoteapp-create-cloud-deployment.md)
- [How to create a hybrid collection of Azure RemoteApp](remoteapp-create-hybrid-deployment.md)
- [How does licensing work in Azure RemoteApp?](remoteapp-licensing.md)
- [Best practices for using Azure RemoteApp](remoteapp-bestpractices.md)
- [Azure RemoteApp FAQ](remoteapp-faq.md)
 

### Help us help you 
Did you know that in addition to rating this article and making comments down below, you can make changes to the article itself? Something missing? Something wrong? Did I write something that's just confusing? Scroll up and click **Edit on GitHub** or **Edit** to make changes - those will come to us for review, and then, once we sign off on them, you'll see your changes and improvements right here.