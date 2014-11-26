<properties title="How to create a cloud deployment of RemoteApp" pageTitle="How to create a cloud deployment of RemoteApp" description="Learn how to create a deployment of RemoteApp that saves data in the Azure cloud." metaKeywords="" services="" solutions="" documentationCenter="" authors="elizapo" manager="kathyw" />

<tags ms.service="remoteapp" ms.workload="tbd" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="09/05/2014" ms.author="elizapo" ms.manager="kathyw" />

#How to create a cloud deployment of RemoteApp

There are two kinds of RemoteApp deployment: 

- Cloud: resides completely in Azure and is created using the **Quick create** option in the Azure management portal.  
- Hybrid: includes a virtual network for on-premises access and is created using the **Create with VPN** option in the management portal.

This tutorial walks you through the process of creating a cloud deployment. There are four steps: 

1.	Create a RemoteApp service.
2.	Optionally configure directory synchronization. RemoteApp requires this to synchronize users, groups, contacts, and passwords from your on-premises Active Directory to your Azure Active Directory tenant.
5.	Publish RemoteApp programs.
6.	Configure user access.

**Before you begin**

You need to do the following before creating the service:

- Sign up for the preview of RemoteApp. You can do that at [http://azure.microsoft.com/en-us/services/remoteapp/](http://azure.microsoft.com/en-us/services/remoteapp/).
- Gather information about the users and groups that you want to grant access to. This can be either Microsoft account information or Active Directory work account information for users or groups.
- This procedure assumes you are either going to use the template image that is provided as part of your subscription or that you have already uploaded the template image you want to use. If you need to upload a different template image, you can do that from the Template Images page. Just click **upload a template image** and follow the steps in the wizard. 
- Want to provide custom apps or LOB pgorams? Create a new [custom template image](http://azure.microsoft.com/en-us/documentation/articles/remoteapp-create-custom-image/) and use it in your cloud deployment.

## **Step 1: Create a RemoteApp service** ##



1. In the [Windows Azure Management Portal](http://manage.windowsazure.com), go to the RemoteApp page.
2. Click **New > Quick Create**.

3. Enter a name for your service, and select your region.
4. Choose the subscription that you want to use to create this service.
5. Choose the template to use for this service. 

	**Tip:** Your subscription for RemoteApp comes with a template image that contains Office 2013 programs, some published (such as Word) and others ready to publish. You can also create a new [custom template image](http://azure.microsoft.com/en-us/documentation/articles/remoteapp-create-custom-image/) and use it in your cloud deployment.


1. Click **Create RemoteApp service**.
	
	**Important:** It can take up to 30 minutes to provision your service.

After your RemoteApp service has been created, go to the RemoteApp **Quick Start** page to continue with the set up steps.


## **Step 2: Configure Active Directory directory synchronization (optional)** ##

If you want to use Active Directory, RemoteApp requires directory synchronization between Azure Active Directory and your on-premises Active Directory to synchronize users, groups, contacts, and passwords to your Azure Active Directory tenant. See [Directory synchronization roadmap](http://msdn.microsoft.com/en-us/library/azure/hh967642.aspx) for planning information and detailed steps.

## **Step 3: Publish RemoteApp programs** ##

A RemoteApp program is the app or program that you provide to your users. It is located in the template image you uploaded for the service. When a user accesses a RemoteApp program, the program appears to run in their local environment, but it is really running in Azure. 

Before your users can access RemoteApp programs, you need to publish them to the end-user feed – a list of available programs that your users access through the Azure portal.
 
You can publish multiple programs to your RemoteApp service. From the RemoteApp programs page, click **Publish** to add a program. You can either publish from the Start menu of the template image or by specifying the path on the template image for the program. If you choose to add from the Start menu, choose the program to publish. If you choose to provide the path to the program, provide a name for the program and the path to where the program is installed on the template image.

## **Step 4: Configure user access** ##

Now that you have created your RemoteApp service, you need to add the users and groups that you want to be able to use your remote resources. If you are using Active Directory, the users or groups that you provide access to need to exist in the Active Directory tenant associated with the subscription you used to create this RemoteApp service.

1.	From the Quick Start page, click **Configure user access**. 
2.	Enter the work account or group name (from Active Directory) or Microsoft account that you want to grant access for.

	For users, make sure that you use the “user@domain.com” format. For groups, enter the group name.

3.	Once the users or groups are validated, click **Save**.


## Next steps ##

That's it - you have successfully created and deployed your RemoteApp cloud  deployment. The next step is to have your users download and install the Remote Desktop client. You can find the URL for the client on the RemoteApp Quick Start page. Then, have users log into the client and access the RemoteApp programs you published.

