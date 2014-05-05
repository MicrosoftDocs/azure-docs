<properties title="How to create a hybrid deployment of RemoteApp" pageTitle="How to create a hybrid deployment of RemoteApp" description="Learn how to create a deployment of RemoteApp that connects to your internal network." metaKeywords="" services="" solutions="" documentationCenter="" authors="elizapo"  />

#How to create a hybrid deployment of RemoteApp

There are two kinds of RemoteApp deployment: 

- Cloud: resides completely in Azure and is created using the **Quick create** option in the Azure management portal. A cloud deployment is good for proof of concept and testing. 
- Hybrid: includes a virtual network for on-premise access and is the best option for production use.

This tutorial walks you through the process of creating a hybrid deployment. There are six steps: 

1.	Create a RemoteApp service.
2.	Link to a virtual network.
3.	Link a template image.
4.	Configure directory synchronization. RemoteApp requires this to synchronize users, groups, contacts, and passwords from your on-premise Active Directory to Azure to your Azure Active Directory tenant.
5.	Publish RemoteApp programs.
6.	Configure user access.


**Step 1: Create a RemoteApp service**



1. In the [Windows Azure Management Portal](http://manage.windowsazure.com), go to the RemoteApp page.
2. Click **New > Create with VPN**.
3. Enter a name for your service and click **Create RemoteApp service**.

After your RemoteApp service has been created, go to the RemoteApp **Quick Start** page to continue with the set up steps.

**Step 2: Link to a virtual network**

A virtual network lets your users access data on your local network through RemoteApp remote resources. There are four steps to configure your virtual network link:

1. On the Quick Start page, click **link a remoteapp virtual network**. 
2. Choose whether to create a new virtual network or use an existing. For this tutorial, we'll create a new network.
3. Provide the following information for your new network:  
      - Name
      - Virtual network address space
      - Local address space
      - DNS server IP address
      - VPN IP address

4. Next, back on the Quick Start page, click **get script** to download a PowerShell script to configure your VPN devices devices to connect to the virtual gateway. You'll need information about the VPN device. 

	Run the script on the server in your local network that has the Routing and Remote Access Service installed. 

	**Note:** You need to do this step only if you are joining an existing virtual network.

5. On Quick Start, click **get key**. Generate an encryption key to configure communication between your local VPN device and the RemoteApp virtual network.
6. Finally, again on the Quick Start page, click **join local domain**. Add the RemoteApp service to your local Active Directory domain.


**Step 3: Link to a RemoteApp template image**

A RemoteApp template image contains the programs that you want to share with users. You can either upload a new template image or link to an existing image (one already uploaded to Azure).

If you are uploading a new image, you need to enter the name and choose the location for the image. The next step is to download and run the generated PowerShell script. This script uploads the specified image.

If you are linking to an existing image, simply specify the image name, location, and associated Azure subscription.

**Note:** You must use Windows Server 2012 R2 with Remote Desktop Session Host and the desktop experience installed to create your template image. See [Deploy Microsoft RemoteApp in your enterprise](http://go.microsoft.com/fwlink/?LinkId=397721) for more information about creating a template image.

**Step 4: Configure Active Directory directory synchronization**

RemoteApp requires directory synchronization between Azure Active Directory and your on-premise Active Directory to synchronize users, groups, contacts, and passwords to your Azure Active Directory tenant. See [Directory synchronization roadmap](http://msdn.microsoft.com/en-us/library/azure/hh967642.aspx) for planning information and detailed steps.

**Step 5: Publish RemoteApp programs**

A RemoteApp program is the app or program that you provide to your users. It is located in the template image you uploaded for the service. When an end user accesses a RemoteApp program, the program appears to run in their local environment, but it is really running in Azure. 

Before your users can access RemoteApp programs, you need to publish them to the end user feed – a list of available programs that your users access through the Azure portal.
 
You can publish multiple programs to your RemoteApp service. From the RemoteApp programs page, click **Publish** to add a program. You can either publish from the Start menu or by specifying the path on the template image for the program. If you choose to add from the Start menu, choose the program to publish. If you choose to provide the path to the program, provide a name for the program and the path to where the program is installed on the template image.

**Step 6: Configure user access**

Now that you have created your RemoteApp service, you need to add the users and groups that you want to be able to use your remote resources. 

1.	From the Quick Start page, click **Configure user access**. 
2.	If you are creating a hybrid deployment (with virtual network), enter the organizational account (from Active Directory) for the user or group that you want to grant access for.
3.	If you are creating a cloud deployment, enter either an organizational account or a Microsoft account.

	For users, make sure that you use the “user@domain.com” or “domain/user” format. For groups, you can just enter the group name.

3.	Once the users or groups are validated, click **Save**.





