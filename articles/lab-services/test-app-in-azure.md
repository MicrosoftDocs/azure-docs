---
title: How to test your app in Azure | Microsoft Docs
description: Learn how to create a file share in a lab and mount it on your local machine and a virtual machine in the lab, and then deploy desktop/web applications to the file share and test them.  
services: devtest-lab,virtual-machines,lab-services
documentationcenter: na
author: spelluru
manager: femila

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/04/2018
ms.author: spelluru


---
# Test your app in Azure 
This article provides steps for testing your application in Azure using DevTest Labs. First, you set up a file share within a lab and mount it as a drive on your local development machine and a VM inside a lab. Then, you use Visual Studio 2017 to deploy your app to the file share so that you can run the app on the VM in the lab.  

## Create a lab using Azure DevTest Labs 
1. [Create an Azure subscription](https://azure.microsoft.com/free/) if you don't already have one, and sign into [Azure portal](https://portal.azure.com).
2. Follow instructions in [this article](devtest-lab-create-lab.md) to create a lab using Azure DevTest Labs. Pin the lab to your dashboard so that you can easily find it next time you sign in. Azure DevTest Labs enables you to create resources within Azure quickly by minimizing waste and controlling cost. To learn more about DevTest Labs, see [overview](devtest-lab-overview.md). 

## Create an Azure Storage account
In this step, you create an Azure Storage account in the lab's resource group. 

1. On the **Overview** page for the lab, select **resource group name**. 

    ![Select resource group for the lab](media/create-mount-file-share/select-resource-group.png)
2. On the Resource Group page, select **Add** on the toolbar. 

    ![Add resource to the resource group - button](media/create-mount-file-share/add-resource-button.png)
3. Search for **Storage Account**, and select **Storage account - blob, file, table, queue** from the results list. 

    ![Search for and select storage account type](media/create-mount-file-share/select-stroage-account.png)
4. On the **Storage account - blob, file, table, queue** page, select **Create**.

    ![Create button for creating the storage](media/create-mount-file-share/storage-create-button.png)
5. On the **Create storage account** page, do the following actions: 
    1. Specify a **name** for the storage account. 
    2. For **Resource group**, select **Use existing**, and select the resource group that contains your lab. This step is an **important** step. 
    3. Select **Create**. 
    
        ![Create storage account page](media/create-mount-file-share/create-storage-account-page.png)    
6. On the **Notifications** page, select the storage account. Confirm that the storage account is created successfully. Select the **resource group** link in the notification message. Close the **Notifications** page by clicking **X** in the right corner. 

    ![Notification message](media/create-mount-file-share/storage-created-successfully.png)
7. On the **Resource group** page, select the storage account you created.  

    ![Select storage account you created](media/create-mount-file-share/select-storage-account-created.png)

## Create a file share in the storage

1. On the **Storage account** page, select **Files**. 

    ![Select Files tile](media/create-mount-file-share/select-files-tile.png)
2. Select **+ File share** button on the toolbar. 

    ![Add file share button](media/create-mount-file-share/select-add-file-share-button.png)
3. On the **File share** page, enter a **name** and **quota** for the file share, and select **Create**.

    ![Create file share](media/create-mount-file-share/specify-share-name.png)
4. After the file share is created, select the **file share** from the list. 

    ![Select file share in the list](media/create-mount-file-share/select-file-share-in-list.png)
6. On the **File share** page, select **Connect** on the toolbar. 

    ![Select connect on the toolbar](media/create-mount-file-share/select-connect-on-toolbar.png)
7. On the **Connect** page, you see different ways of mounting the file share as a drive on your machine. The next section has detailed instructions for mounting a file share. 
 

## Mount the file share 

Use the `net use` command on the **Connect** page to mount the file share on your machine. Alternatively, you can use the following instructions to persist file share credentials on your machine and to mount the share using PowerShell.   

1. On your local machine, use the script from [Persisting Azure file share credentials in Windows](../storage/files/storage-how-to-use-files-windows.md#persisting-azure-file-share-credentials-in-windows) section of [Use an Azure file share with Windows](../storage/files/storage-how-to-use-files-windows.md) article. 
2. Then, use the script from [Mount the Azure file share with PowerShell](../storage/files/storage-how-to-use-files-windows.md#mount-the-azure-file-share-with-powershell) section in the same article.  


## Create a VM in the lab

1. On the **File share** page, select the **resource group** in the breadcrumb menu at the top. You see the **Resource group** page. 
    
    ![Select resource group from breadcrumb menu](media/create-mount-file-share/select-resource-group-bread-crump.png)
2. On the **Resource group** page, select the **lab** you created in DevTest Labs.

    ![Select the lab](media/create-mount-file-share/select-devtest-lab-in-resource-group.png)
3. On the **DevTest Lab** page for your lab, select **+ Add** on the toolbar. 

    ![Add button for the lab](media/create-mount-file-share/add-button-in-lab.png)
4. On the **Choose a base** page, search for **smalldisk**, and select **[smalldisk] Windows Server 2016 Data Center**. 

    ![Choose small disk Windows server](media/create-mount-file-share/choose-small-disk-windows-server.png)
5. On the **Virtual machine** page, specify **virtual machine name**, **user name**, **password**, and select **Create**.    
    
    ![Create virtual machine page](media/create-mount-file-share/create-virtual-machine-page.png)    

## Mount the file share on your VM

1. After the virtual machine is created successfully, select the **virtual machine** from the list.    

    ![Select the lab VM](media/create-mount-file-share/select-lab-vm.png)
2. Select **Connect** on the toolbar to connect to the VM. 
3. [Install Azure PowerShell](https://azure.microsoft.com/en-us/downloads/) by using the **Windows install** link in the **Command-line tools** section. For other ways of installing Azure PowerShell, see [this article](/powershell/azure/install-azurerm-ps?view=azurermps-6.8.1).
4. Follow instructions in the [Mount the file share](#mount-the-file-share) section. 

## Publish your desktop app from Visual Studio
In this section, you publish your app from Visual Studio to a test VM in the cloud.

1. Create a desktop/web application by using Visual Studio 2017.
2. Build your app.
3. To publish your app, right-click your project in the **Solution Explorer**, and select **Publish**. 
4. In the **Publish wizard**, enter the fully qualified path for the file share. 
    
    ![Enter file share](media/create-mount-file-share/enter-file-share.png)

    You can find the fully qualified path in the **Connect** wizard of your file share within the `net use` command:

    ![Connect wizard](media/create-mount-file-share/connect-wizard.png)

    The best way to get it is by copying the `net use` command in word and extracting the relevant portion from it. 
5. Select **Next** to complete the publish workflow, and select **Finish**. When you finish the wizard steps, Visual Studio builds your application and publishes it to your file share. 


## Test the app on your test VM in the lab

1. Navigate to the virtual machine page for your VM in the lab. 
2. Select **Start** on the toolbar to start the VM if it's in stopped state. You can set up auto-start and auto-shutdown policies for your VM to avoid starting and stopping each time. 
3. Select **Connect**.

    ![Virtual machine page](media/create-mount-file-share/virtual-machine-page.png)
4. Within the virtual machine, launch **File Explorer**, and select **This PC** to find your file share.

    ![Find share on VM](media/create-mount-file-share/find-share-on-vm.png)

    > [!NOTE]
    > For any reason, if you are unable to find your file share on your virtual machine or on your local machine, you can remount it by running the `net use` command. You can find the `net use` command on the **Connect** Wizard of your **File Share** in the Azure portal.
1. Open the file share and confirm that you see the app you deployed from Visual Studio. 

    ![Open share on VM](media/create-mount-file-share/open-file-share.png)

    You can now access and test your app within the test VM you created in Azure.

## Next steps
See the following articles to learn how to use VMs in a lab. 

- [Add a VM to a lab](devtest-lab-add-vm.md)
- [Restart a lab VM](devtest-lab-restart-vm.md)
- [Resize a lab VM](devtest-lab-resize-vm.md)
