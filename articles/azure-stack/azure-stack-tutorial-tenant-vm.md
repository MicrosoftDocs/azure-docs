---
title: Make virtual machines available to your Azure Stack users| Microsoft Docs
description: Tutorial to make virtual machines available on Azure Stack
services: azure-stack
documentationcenter: ''
author: vhorne
manager: 
editor: ''

ms.assetid:
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 5/10/2017
ms.author: victorh

---
# Make virtual machines available to your Azure Stack users
As an Azure Stack administrator, you can create offers that your users (sometimes referred to as tenants) can subscribe to. Using their subscription, users can then consume Azure Stack services.

This article shows you how to create an offer, and then test it. 
For the test, you will log in to the portal as a user, subscribe to the offer, and then create a virtual machine using the subscription.

What you will learn:

> [!div class="checklist"]
> * Create an offer
> * Add an image
> * Test the offer


In Azure Stack, services are delivered to users using subscriptions, offers, and plans. Users can subscribe to multiple offers. Offers can have one or more plans, and plans can have one or more services.

![](media/azure-stack-key-features/image4.png)

To learn more, see [Key features and concepts in Azure Stack](azure-stack-key-features.md).

## Create an offer

Now you can get things ready for your users. Create an offer that they can then subscribe to.

1. **Set quotas**

   Quotas define the limits of resources that a user subscription can provision or consume. For example, a quota might allow a user to create up to five VMs. To add a service to a plan, the administrator must configure the quota settings for that service.

   a. In a browser, go to [https://adminportal.local.azurestack.external](https://adminportal.local.azurestack.external/). Sign in to the Azure Stack portal as an administrator (by using the credentials that you provided during deployment).

   b. Select **New**, then **Tenant Offers + Plans**, and select **Quota**.

   c. Select the first service for which you want to create a quota. For an IaaS quota, follow these steps for the Compute, Network, and Storage services.
   In this example, we first create a quota for the Compute service. In the **Namespace** list, select the **Microsoft.Compute** namespace.
   
   > ![Creating a new Compute quota](./media/azure-stack-setting-quota/NewComputeQuota.PNG)
   > 
   > 
   d. Choose the location where the quota is defined (for example, 'local').

   e. On the **Quota Settings** item, it says **Set the
   Capacity of Quota**. Click this item to configure the quota settings.

   f. On the **Set Quotas** blade, you see all the Compute resources for which
   you can configure limits. Each type has a default
   value that's associated with it. You can change these values or you can select the **Ok** button at the bottom of the blade to accept
   the defaults.
   
   > ![Setting a Compute quota](./media/azure-stack-setting-quota/SetQuotasBladeCompute.PNG)
   > 
   > 

   g. After you have configured the values and clicked **Ok**, the **Quota
   Settings** item appears as **Configured**. Click **Ok** to
   create the **Quota** resource.
   
   You should see a notification indicating that the quota resource is
   being created.

   h. After the quota set has been successfully created, you receive a second notification. The Compute service quota is now ready to be associated with a plan. Repeat these steps with the Network and Storage services, and you are ready to create an IaaS plan!
   
   > ![Notification upon quota creation success](./media/azure-stack-setting-quota/QuotaSuccess.png)
   > 
   > 

2. **Create a plan**

    Plans are groupings of one or more services. As a provider, you can create plans to offer to your users. In turn, your users subscribe to your offers to use the plans and services they include.

   a. In an internet browser, navigate to https://adminportal.local.azurestack.external.

   b. [Sign in](azure-stack-connect-azure-stack.md) to the Azure Stack Portal as a service administrator. Enter the credentials for the account that you created during step 5 of the [Run the PowerShell script](azure-stack-run-powershell-script.md) section.

   Service administrators can create offers and plans, and manage users.

   c. To create a plan and offer that users can subscribe to, click **New** > **Tenant Offers + Plans** > **Plan**.

   ![](media/azure-stack-create-plan/image01.png)

   d. In the **New Plan** blade, fill in **Display Name** and **Resource Name**. The Display Name is the plan's friendly name that users see. Only the admin can see the Resource Name. It's the name that admins use to work with the plan as an Azure Resource Manager resource.

   ![](media/azure-stack-create-plan/image02.png)

   e. Create a new **Resource Group**, or select an existing one, as a container for the plan.

   ![](media/azure-stack-create-plan/image02a.png)

   f. Click **Services**, select **Microsoft.Compute**, **Microsoft.Network**, and **Microsoft.Storage**, and then click **Select**.

   ![](media/azure-stack-create-plan/image03.png)

   g. Click **Quotas**, click **Microsoft.Storage (local)**, and then either select the default quota or click **Create new quota** to customize the quota.

   ![](media/azure-stack-create-plan/image04.png)

   h. Type a name for the quota, click **Quota Settings**, set the quota values and click **OK**, and then click **OK**.

   ![](media/azure-stack-create-plan/image06.png)

   i. Click **Microsoft.Network (local)**, and then either select the default quota or click **Create new quota** to customize the quota.

   ![](media/azure-stack-create-plan/image07.png)

   j. Type a name for the quota, click **Quota Settings**, set the quota values and click **OK**, and then click **OK**.

   ![](media/azure-stack-create-plan/image08.png)

   k. Click **Microsoft.Compute (local)**, and then either select the default quota or click **Create new quota** to customize the quota.

   ![](media/azure-stack-create-plan/image09.png)

   l. Type a name for the quota, click **Quota Settings**, set the quota values and click **OK**, and then click **OK**.

   ![](media/azure-stack-create-plan/image10.png)

   m. In the **Quotas** blade, click **OK**, and then in the **New Plan** blade, click **Create** to create the plan.

   ![](media/azure-stack-create-plan/image11.png)

   n. To see your new plan, click **All resources**, then search for the plan and click its name.

   ![](media/azure-stack-create-plan/image12.png)

3. **Create an offer**

   Offers are groups of one or more plans that providers present to users to purchase or subscribe to.

   a. [Sign in](azure-stack-connect-azure-stack.md) to the portal as a service administrator and then click **New** > **Tenant Offers + Plans** > **Offer**.
   ![](media/azure-stack-create-offer/image01.png)

   b. In the **New Offer** blade, fill in **Display Name** and **Resource Name**, and then select a new or existing **Resource Group**. The Display Name is the offer's friendly name. Only the admin can see the Resource Name. It's the name that admins use to work with the offer as an Azure Resource Manager resource.

   ![](media/azure-stack-create-offer/image01a.png)

   c. Click **Base plans** and, in the **Plan** blade, select the plans you want to include in the offer, and then click **Select**. Click **Create** to create the offer.

   ![](media/azure-stack-create-offer/image02.png)

   d. Click **Offers** and then click the offer you just created.

    ![](media/azure-stack-create-offer/image03.png)

   e. Click **Change State**, and then click **Public**.

   ![](media/azure-stack-create-offer/image04.png)


## Add an image

Before you can provision virtual machines, you must add an image to the Azure Stack marketplace. This example shows you how to add a Windows Server 2016 image, but you can add the image of your choice, including Linux images.This step can take almost an hour to complete!

For information about adding different items to the marketplace , see [The Azure Stack Marketplace](azure-stack-marketplace.md).

> [!NOTE]
> If you have registered your Azure Stack instance with Azure, then you can download the Windows Server 2016 VM image from the Azure Marketplace by using the steps described in the [Download marketplace items from Azure to Azure Stack](azure-stack-download-azure-marketplace-item.md) topic. 

1. After deploying Azure Stack, sign in to the MAS-CON01 virtual machine.

2. Go to https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2016 and download the Windows Server 2016 evaluation. When prompted, select the **ISO** version of the download. Record the path to the download location, which is used later in these steps.

3. Open PowerShell ISE as an administrator.

4. [Install PowerShell for Azure Stack](azure-stack-powershell-install.md).

5. [Download the Azure Stack tools from GitHub](azure-stack-powershell-download.md).
   
   > [!NOTE]
   > Make sure that you download and extract the Azure Stack tool repository to a folder that is NOT under the C:\Windows\System32 directory.  
   
6. Import the Azure Stack Connect and ComputeAdmin modules by using the following commands:
   ```powershell
   Import-Module .\Connect\AzureStack.Connect.psm1
   Import-Module .\ComputeAdmin\AzureStack.ComputeAdmin.psm1
   ```
7. Create the Azure Stack administrator's AzureRM environment by using the following cmdlet:
   ```powershell
   Add-AzureStackAzureRmEnvironment `
     -Name "AzureStackAdmin" `
     -ArmEndpoint "https://adminmanagement.local.azurestack.external" 
   ```

8. Get the GUID value of the Active Directory(AD) user that is used to deploy the Azure Stack. If your Azure Stack environment is deployed by using:  

    a. **Azure Active Directory**, use the following cmdlet:
    
    ```PowerShell
    $TenantID = Get-DirectoryTenantID `
      -AADTenantName "<myaadtenant>.onmicrosoft.com" `
      -EnvironmentName AzureStackAdmin
    ```
    b. **Active Directory Federation Services**, use the following cmdlet:
    
    ```PowerShell
    $TenantID = Get-DirectoryTenantID `
      -ADFS 
      -EnvironmentName AzureStackAdmin 
    ```
   
9. Add the Windows Server 2016 image to the Azure Stack marketplace by running the `New-Server2016VMImage` cmdlet. Replace *Path_to_ISO* with the path to the WS2016 ISO you downloaded. See the [Parameters](#parameters) section for information about the allowed parameters.

   ```powershell
   $ISOPath = "<Fully_Qualified_Path_to_ISO>"
  
   # Store the service administrator account credentials in a variable 
   $UserName='<Username of the service administrator account>'
   $Password='<Admin password provided when deploying Azure Stack>'| ConvertTo-SecureString -Force -AsPlainText
   $Credential=New-Object PSCredential($UserName,$Password)

   # Add a Windows Server 2016 Evaluation VM Image.
   New-Server2016VMImage `
     -ISOPath $ISOPath `
     -TenantId $TenantID `
     -EnvironmentName "AzureStackAdmin" `
     -Net35 $True `
     -AzureStackCredentials $Credential
   ```
   To ensure that the Windows Server 2016 VM image has the latest cumulative update, include the `IncludeLatestCU` parameter when running the previous cmdlet. 

   When you run the `New-Server2016VMImage` cmdlet, the output displays a warning message that says, “Unable to acquire token for tenant ‘Common’”, which you can ignore and the download continues. The output also displays the “Downloading” message for a while and if the download is successful, it ends with the “StatusCode: Created” message.

### Parameters

|New-Server2016VMImage parameters|Required?|Description|
|-----|-----|------|
|ArmEndpoint|No|The Azure Resource Manager endpoint for your Azure Stack environment. The default is the one used by the Proof of Concept (PoC) environment.|
|AzureStackCredentials|Yes|The credentials provided during deployment that are used to sign in to the Azure Stack Administrator portal. |
|EnvironmentName|yes|The Azure Stack administrator's PowerShell environment name. |
|IncludeLatestCU|No|Set this switch to apply the latest Windows Server 2016 cumulative update to the new VHD.|
|ISOPath|Yes|The full path to the downloaded Windows Server 2016 ISO.|
|Net35|No|This parameter allows you to install the .NET 3.5 runtime on the Windows Server 2016 image. By default, this value is set to true. It is mandatory that the image contains the .NET 3.5 runtime to install the SQL or MYSQL resource providers. |
|TenantID|Yes|The GUID value of your Azure Stack Tenant ID.|
|Version|No|This parameter allows you to choose whether to add a Core or Full (or both) Windows Server 2016 images. Valid values include Full (the default this parameter is not provided), Core, and Both.|
|VHDSizeInMB|No|Sets the size (in MB) of the VHD image to be added to your Azure Stack environment. Default value is 40960 MB.|
|CreateGalleryItem|No|Specifies if a Marketplace item should be created for the Windows Server 2016 image. By default, this value is set to true.|
|location |No |Specifies the location to which the Windows Server 2016 image should be published. By default, this value is set to local.|
|CUUri |No |Set this value to choose the Windows Server 2016 cumulative update from a specific URI. |
|CUPath |No |Set this value to choose the Windows Server 2016 cumulative update from a local path. This option is helpful if you have deployed Azure Stack in a disconnected environment.|


## Test the offer

Now that you’ve created an offer, you can test it. Log in as a user and subscribe to the offer and then add a virtual machine.

1. **Subscribe to an offer**

   Now you can log in to the portal as a user to subscribe to an offer.

   a. On the Azure Stack POC computer, log in to `https://portal.local.azurestack.external` as a user(azure-stack-connect-azure-stack.md) and click **Get a Subscription**.

   ![](media/azure-stack-subscribe-plan-provision-vm/image01.png)

   b. In the **Display Name** field, type a name for your subscription, click **Offer**, click one of the offers in the **Choose an offer** blade, and then click **Create**.

   ![](media/azure-stack-subscribe-plan-provision-vm/image02.png)

   c. To view the subscription you created, click **More services**, click **Subscriptions**, then click your new subscription.  

   After you subscribe to an offer, refresh the portal to see which services are part of the new subscription.

2. **Provision a virtual machine**

   Now you can log in to the portal as a user to provision a virtual machine using the subscription. 

   a. On the Azure Stack POC computer, log in to `https://portal.local.azurestack.external` as a user, and then click **New** > **Virtual machines** > **Windows Server 2016 Datacenter Eval**.  

   b. In the **Basics** blade, type a **Name**, **User name**, and **Password**. For **VM disk type**, choose **HDD**. Choose a **Subscription**. Create a **Resource group**, or select an existing one, and then click **OK**.  

   c. In the **Choose a size** blade, click **A1 Basic**, and then click **Select**.  

   d. In the **Settings** blade, click **Virtual network**. In the **Choose virtual network** blade, click **Create new**. In the **Create virtual network** blade, accept all the defaults, and click **OK**. In the **Settings** blade, click **OK**.

   ![](media/azure-stack-provision-vm/image04.png)

   e. In the **Summary** blade, click **OK** to create the virtual machine.  

   f. To see your new virtual machine, click **All resources**, then search for the virtual machine and click its name.

    ![](media/azure-stack-provision-vm/image06.png)

What you learned in this tutorial:

> [!div class="checklist"]
> * Create an offer
> * Add an image
> * Test the offer

> [!div class="nextstepaction"]
> [Make web, mobile, and API apps available to your Azure Stack users](azure-stack-tutorial-app-service.md)