<properties title="How to create a hybrid deployment of RemoteApp" pageTitle="How to create a hybrid deployment of RemoteApp" description="Learn how to create a deployment of RemoteApp that connects to your internal network." metaKeywords="" services="" solutions="" documentationCenter="" authors="elizapo"  />

#How to create a cloud deployment of RemoteApp

There are two kinds of RemoteApp deployment: 

- Cloud: resides completely in Azure and is created using the **Quick create** option in the Azure management portal.  
- Hybrid: includes a virtual network for on-premise access.

This tutorial walks you through the process of creating a cloud deployment. There are four steps: 

1.	Create a RemoteApp service.
2.	Configure directory synchronization. RemoteApp requires this to synchronize users, groups, contacts, and passwords from your on-premise Active Directory to Azure to your Azure Active Directory tenant.
5.	Publish RemoteApp programs.
6.	Configure user access.


**Step 1: Create a RemoteApp service**



1. In the [Windows Azure Management Portal](http://manage.windowsazure.com), go to the RemoteApp page.
2. Click **New > Quick Create**.

3. Enter a name for your service and select your region.
4. Choose the subscription that you want to use to create this service.
5. Choose the template to use for this service. 

	**Tip:** Your subscription for RemoteApp comes with a template image that contains Office 2013 programs ready to publish.
1. Click **Create RemoteApp service**.

After your RemoteApp service has been created, go to the RemoteApp **Quick Start** page to continue with the set up steps.


**Step 2: Configure Active Directory directory synchronization**

RemoteApp requires directory synchronization between Azure Active Directory and your on-premise Active Directory to synchronize users, groups, contacts, and passwords to your Azure Active Directory tenant. See [Directory synchronization roadmap](http://msdn.microsoft.com/en-us/library/azure/hh967642.aspx) for planning information and detailed steps.

**Step 3: Publish RemoteApp programs**

A RemoteApp program is the app or program that you provide to your users. It is located in the template image you uploaded for the service. When an end user accesses a RemoteApp program, the program appears to run in their local environment, but it is really running in Azure. 

Before your users can access RemoteApp programs, you need to publish them to the end user feed – a list of available programs that your users access through the Azure portal.
 
You can publish multiple programs to your RemoteApp service. From the RemoteApp programs page, click **Publish** to add a program. You can either publish from the Start menu or by specifying the path on the template image for the program. If you choose to add from the Start menu, choose the program to publish. If you choose to provide the path to the program, provide a name for the program and the path to where the program is installed on the template image.

**Step 4: Configure user access**

Now that you have created your RemoteApp service, you need to add the users and groups that you want to be able to use your remote resources. 

1.	From the Quick Start page, click **Configure user access**. 
2.	If you are creating a hybrid deployment (with virtual network), enter the organizational account (from Active Directory) for the user or group that you want to grant access for.
3.	If you are creating a cloud deployment, enter either an organizational account or a Microsoft account.

	For users, make sure that you use the “user@domain.com” or “domain/user” format. For groups, you can just enter the group name.

3.	Once the users or groups are validated, click **Save**.





