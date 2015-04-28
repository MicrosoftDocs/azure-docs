<properties 
	pageTitle="How to create a hybrid collection for RemoteApp" 
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
	ms.date="04/28/2015" 
	ms.author="elizapo"/>

# How to create a hybrid collection for RemoteApp

There are two kinds of RemoteApp collections: 

- Cloud: resides completely in Azure and is created using the **Quick create** option in the Azure management portal.  
- Hybrid: includes a virtual network for on-premises access and is created using the **Create with VNET** option in the management portal.

This tutorial walks you through the process of creating a hybrid collection. There are seven steps: 

1.	Create a [custom image for RemoteApp](remoteapp-imageoptions.md) or pick one of the images included with your subscription.
2. Set up your virtual network.
2.	Create a RemoteApp collection.
2.	Link your collection to your virtual network.
3.	Add a template image to your collection.
4.	Configure directory synchronization. RemoteApp requires that you integrate with Azure Active Directory by either 1) configuring Azure Active Directory Sync with the Password Sync option, or 2) configuring Azure Active Directory Sync without the Password Sync option but using a domain that is federated to AD FS. Check out the [configuration info for Active Directory with RemoteApp](remoteapp-ad.md).
5.	Publish RemoteApp apps.
6.	Configure user access.

**Before you begin**

You need to do the following before creating the collection:

- [Sign up](http://azure.microsoft.com/services/remoteapp/) for RemoteApp. 
- Create a user account in Active Directory to use as the RemoteApp service account. Restrict the permissions for this account so that it can only join machines to the domain.
- Gather information about your on-premises network: IP address information and VPN device details.
- Install the [Azure PowerShell](install-configure-powershell.md) module.
- Gather information about the users that you want to grant access to. This can be either Microsoft account information or Active Directory work account information.
- Create your template image. A RemoteApp template image contains the apps and programs that you want to publish for your users. See [Create a RemoteApp image](remoteapp-imageoptions.md) for more information. 
- [Configure Active Directory for RemoteApp](remoteapp-ad.md).



## Step 1: Set up your virtual network
You can deploy a hybrid RemoteApp collection that uses an existing Azure virtual network, or you can create a new virtual network. A virtual network lets your users access data on your local network through RemoteApp remote resources. Using an Azure virtual network gives your collection direct network access to other Azure services and virtual machines deployed to that virtual network.

### Create an Azure VNET and join it to your Active Directory deployment

Start by creating a [virtual network](https://msdn.microsoft.com/library/azure/dn631643.aspx). This is done on the **Network** tab in the Azure Management portal. You need to connect your virtual network to the Active Directory deployment that is synchronized to your Azure Active Directory tenant.

See [About Virtual Network Settings in the Management Portal](https://msdn.microsoft.com/library/azure/jj156074.aspx) for more information.

### Make sure your virtual network is ready for RemoteApp
Before you create your RemoteApp collection, let's make sure that your new virtual network is ready. You can validate this by doing the following:

1. Create an Azure virtual machine inside the subnet of the virtual network you just created for RemoteApp.
2. Use Remote Desktop to connect to the virtual machine. (Click **Connect**.)
3. Join it to the same Active Directory deployment that you want to use for RemoteApp.

Did that work? Your virtual network and subnet are ready for RemoteApp!

You can find more information about creating Azure virtual machines and connecting to them with Remote Desktop [here](https://msdn.microsoft.com/library/azure/jj156003.aspx).

## Step 2: Create a RemoteApp collection ##



1. In the [Azure Management Portal](http://manage.windowsazure.com), go to the RemoteApp page.
2. Click **New > Create with VNET**.
3. Enter a name for your collection.
4. Choose the plan that you want to use - standard or basic.
5. Click **Create RemoteApp collection**.

After your RemoteApp collection has been created, go to the RemoteApp **Quick Start** page to continue with the set up steps.

## Step 3: Link your collection to the virtual network ##

 
1. On the **Quick Start** page, click **link a virtual network**.
2. Choose the virtual network you want to use from the drop-down list.
3. Choose the region you want to use, and make sure the correct subscription shows up in the field. 
5. Back on the **Quick Start** page, click **join local domain**. Add the RemoteApp service account to your local Active Directory domain. You will need the domain name, organizational unit, service account user name and password. 

	This is the information you gathered if you followed the steps in [Configure Active Directory for Azure RemoteApp](remoteapp-ad.md).


## Step 4: Link to a RemoteApp image ##

A RemoteApp template image contains the programs that you want to share with users. You can either create a new [template image](remoteapp-imageoptions.md) or link to an existing image (one already imported or uploaded to Azure RemoteApp). You can also link to one of the RemoteApp [template images](remoteapp-images.md) that contain Office 365 or Office 2013 (for trial use) programs. 

If you are uploading the new image, you need to enter the name and choose the location for the image. On the next page of the wizard, you'll see a set of PowerShell cmdlets - copy and run these cmdlets from an elevated Windows PowerShell prompt to upload the specified image.

If you are linking to an existing template image, simply specify the image name, location, and associated Azure subscription.



## Step 5: Configure Active Directory directory synchronization ##

RemoteApp requires that you integrate with Azure Active Directory by either 1) configuring Azure Active Directory Sync with the Password Sync option, or 2) configuring Azure Active Directory Sync without the Password Sync option but using a domain that is federated to AD FS. See [Directory synchronization roadmap](http://msdn.microsoft.com//library/azure/hh967642.aspx) for planning information and detailed steps.

## Step 6: Publish RemoteApp apps ##

A RemoteApp app is the app or program that you provide to your users. It is located in the template image you uploaded for the collection. When a user accesses an app, it appears to run in their local environment, but it is really running in Azure. 

Before your users can access RemoteApp apps, you need to publish them to the end-user feed – a list of available apps that your users access through the Remote Desktop client.
 
You can publish multiple apps to your RemoteApp collection. From the RemoteApp publishing page, click **Publish** to add an app. You can either publish from the Start menu of the template image or by specifying the path on the template image for the app. If you choose to add from the Start menu, choose the program to app. If you choose to provide the path to the app, provide a name for the app and the path to where it is installed on the template image.

## Step 7: Configure user access ##

Now that you have created your RemoteApp collection, you need to add the users that you want to be able to use your remote resources. The users that you provide access to need to exist in the Active Directory tenant associated with the subscription you used to create this RemoteApp collection.

1.	From the Quick Start page, click **Configure user access**. 
2.	Enter the work account (from Active Directory) or Microsoft account that you want to grant access for.

	**Notes:** 

	Make sure that you use the “user@domain.com” format.

	If you are using Office 365 ProPlus in your collection, you must use the Active Directory identities for your users. This helps validate licensing. 


3.	Once the users are validated, click **Save**.


## Next steps ##
That's it - you have successfully created and deployed your RemoteApp hybrid collection. The next step is to have your users download and install the Remote Desktop client. You can find the URL for the client on the RemoteApp Quick Start page. Then, have users log into the client and access the apps you published.


