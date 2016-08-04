<properties
	pageTitle="How to create a hybrid collection for Azure RemoteApp | Microsoft Azure"
	description="Learn how to create a deployment of RemoteApp that connects to your internal network."
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
	ms.topic="article"
	ms.date="08/15/2016"
	ms.author="elizapo"/>

# How to create a hybrid collection for Azure RemoteApp

> [AZURE.IMPORTANT]
> Azure RemoteApp is being discontinued. Read the [announcement](https://go.microsoft.com/fwlink/?linkid=821148) for details.

There are two kinds of Azure RemoteApp collections:

- Cloud: resides completely in Azure. You can choose to save all data in the cloud (so a cloud-only collection) or to connect your collection to a VNET and save data there.   
- Hybrid: includes a virtual network for on-premises access - this requires the use of Azure AD and an on-premises Active Directory environment.

Don't know which you need? Check out [Which kind of collection do you need for Azure RemoteApp](remoteapp-collections.md).

This tutorial walks you through the process of creating a hybrid collection. There are eight steps:

1.	Decide what [image](remoteapp-imageoptions.md) to use for your collection. You can create a custom image or use one of the Microsoft images included with your subscription.
2. Set up your virtual network. Check out the [VNET planning](remoteapp-planvnet.md) and [sizing](remoteapp-vnetsizing.md) information.
2.	Create a collection.
2.	Join your collection to your local domain.
3.	Add a template image to your collection.
4.	Configure directory synchronization. Azure RemoteApp requires that you integrate with Azure Active Directory by either 1) configuring Azure Active Directory Sync with the Password Sync option, or 2) configuring Azure Active Directory Sync without the Password Sync option but using a domain that is federated to AD FS. Check out the [configuration info for Active Directory with RemoteApp](remoteapp-ad.md).
5.	Publish RemoteApp apps.
6.	Configure user access.

**Before you begin**

You need to do the following before creating the collection:

- [Sign up](https://azure.microsoft.com/services/remoteapp/) for Azure RemoteApp.
- Create a user account in Active Directory to use as the Azure RemoteApp service account. Restrict the permissions for this account so that it can only join machines to the domain.
- Gather information about your on-premises network: IP address information and VPN device details.
- Install the [Azure PowerShell](../powershell-install-configure.md) module.
- Gather information about the users that you want to grant access to. You will need the Azure Active Directory user principal name (for example, name@contoso.com) for each user. Make sure that the UPN matches between Azure AD and Active Directory.
- Choose your template image. An Azure RemoteApp template image contains the apps and programs that you want to publish for your users. See [Azure RemoteApp image options](remoteapp-imageoptions.md) for more information.
- Want to use the Office 365 ProPlus image? Check out info [here](remoteapp-officesubscription.md).
- [Configure Active Directory for RemoteApp](remoteapp-ad.md).



## Step 1: Set up your virtual network
You can deploy a hybrid collection that uses an existing Azure virtual network, or you can create a new virtual network. A virtual network lets your users access data on your local network through RemoteApp remote resources. Using an Azure virtual network gives your collection direct network access to other Azure services and virtual machines deployed to that virtual network.

Make sure you review the [VNET planning](remoteapp-planvnet.md) and [VNET size](remoteapp-vnetsizing.md) information before you create your VNET.

### Create an Azure VNET and join it to your Active Directory deployment

Start by creating a [virtual network](../virtual-network/virtual-networks-create-vnet-arm-pportal.md). This is done on the **Network** tab in the Azure portal. You need to connect your virtual network to the Active Directory deployment that is synchronized to your Azure Active Directory tenant.

See [Create a virtual network using the Azure portal](../virtual-network/virtual-networks-create-vnet-arm-pportal.md) for more information.

### Make sure your virtual network is ready for Azure RemoteApp
Before you create your collection, let's make sure that your new virtual network is ready. You can validate this by doing the following:

1. Create an Azure virtual machine inside the subnet of the virtual network you just created for RemoteApp.
2. Use Remote Desktop to connect to the virtual machine. (Click **Connect**.)
3. Join it to the same Active Directory deployment that you want to use for RemoteApp.

Did that work? Your virtual network and subnet are ready for Azure RemoteApp!

You can find more information about creating Azure virtual machines and connecting to them with Remote Desktop [here](https://msdn.microsoft.com/library/azure/jj156003.aspx).

## Step 2: Create an Azure RemoteApp collection ##



1. In the [Azure portal](http://manage.windowsazure.com), go to the Azure RemoteApp page.
2. Click **New > Create with VNET**.
3. Enter a name for your collection.
4. Choose the plan that you want to use - standard or basic.
5. Choose your VNET from the drop down list and then your subnet.
6. Choose to join it to your domain.
5. Click **Create RemoteApp collection**.

After your Azure RemoteApp collection has been created, double-click the name of the collection. That will bring up the **Quick Start** page - this is where you finish configuring the collection.

Did something go wrong? Check out the [hybrid collection troubleshooting information](remoteapp-hybridtrouble.md).

## Step 3: Link your collection to the local domain ##


1. On the **Quick Start** page, click **join a local domain**.
2. Add the Azure RemoteApp service account to your local Active Directory domain. You will need the domain name, organizational unit, service account user name and password.

	This is the information you gathered if you followed the steps in [Configure Active Directory for Azure RemoteApp](remoteapp-ad.md).


## Step 4: Link to an Azure RemoteApp image ##

An Azure RemoteApp template image contains the programs that you want to share with users. You can either create a new [template image](remoteapp-imageoptions.md) or link to an existing image (one already imported or uploaded to Azure RemoteApp). You can also link to one of the Azure RemoteApp [template images](remoteapp-images.md) that contain Office 365 or Office 2013 (for trial use) programs.

If you are uploading the new image, you need to enter the name and choose the location for the image. On the next page of the wizard, you'll see a set of PowerShell cmdlets - copy and run these cmdlets from an elevated Windows PowerShell prompt to upload the specified image.

If you are linking to an existing template image, simply specify the image name, location, and associated Azure subscription.



## Step 5: Configure Active Directory directory synchronization ##

Azure RemoteApp requires that you integrate with Azure Active Directory by either 1) configuring Azure Active Directory Sync with the Password Sync option, or 2) configuring Azure Active Directory Sync without the Password Sync option but using a domain that is federated to AD FS.

Check out [AD Connect](https://blogs.technet.microsoft.com/enterprisemobility/2014/08/04/connecting-ad-and-azure-ad-only-4-clicks-with-azure-ad-connect/) - this article helps you set up directory integration in 4 steps.

See [Directory synchronization roadmap](http://msdn.microsoft.com//library/azure/hh967642.aspx) for planning information and detailed steps.

## Step 6: Publish apps ##

An Azure RemoteApp app is the app or program that you provide to your users. It is located in the template image you uploaded for the collection. When a user accesses an app, it appears to run in their local environment, but it is really running in Azure.

Before your users can access apps, you need to publish them – this lets your users access the apps through the Remote Desktop client.

You can publish multiple apps to your collection. From the publishing page, click **Publish** to add an app. You can either publish from the **Start** menu of the template image or by specifying the path on the template image for the app. If you choose to add from the **Start** menu, choose the program to add. If you choose to provide the path to the app, provide a name for the app and the path to where it is installed on the template image.

## Step 7: Configure user access ##

Now that you have created your collection, you need to add the users that you want to be able to use your remote resources. The users that you provide access to need to exist in the Active Directory tenant associated with the subscription you used to create this Azure RemoteApp collection.

1.	From the Quick Start page, click **Configure user access**.
2.	Enter the work account (from Active Directory) or Microsoft account that you want to grant access for.

	**Notes:**

	Make sure that you use the “user@domain.com” format.

	If you are using Office 365 ProPlus in your collection, you must use the Active Directory identities for your users. This helps validate licensing.


3.	Once the users are validated, click **Save**.


## Next steps ##
That's it - you have successfully created and deployed your Azure RemoteApp hybrid collection. The next step is to have your users download and install the Remote Desktop client. You can find the URL for the client on the Azure RemoteApp Quick Start page. Then, have users log into the client and access the apps you published.



### Help us help you
Did you know that in addition to rating this article and making comments down below, you can make changes to the article itself? Something missing? Something wrong? Did I write something that's just confusing? Scroll up and click **Edit on GitHub** to make changes - those will come to us for review, and then, once we sign off on them, you'll see your changes and improvements right here.
