<properties
   pageTitle="Encrypt an Azure Virtual Machine | Microsoft Azure"
   description="This document helps you to encrypt an Azure Virtual Machine after receiving an alert from Azure Security Center."
   services="security, security-center"
   documentationCenter="na"
   authors="TomShinder"
   manager="swadhwa"
   editor=""/>

<tags
   ms.service="security"
   ms.devlang="na"
   ms.topic="hero-article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="05/27/2016"
   ms.author="tomsh"/>

# Encrypt an Azure Virtual Machine
Azure Security Center will alert you if you have virtual machines that are not encrypted. These alerts will show as High Severity and the recommendation is to encrypt these virtual machines.

![Disk encryption recommendation](./media/security-center-disk-encryption\security-center-disk-encryption-fig1.png)

> [AZURE.NOTE] The information in this document applies to the preview release of Azure Security Center.

To encrypt Azure Virtual Machines that have been identified by Azure Security Center as needing encryption, we recommend the following steps:

- Install and configure Azure PowerShell. This will enable you to run the PowerShell commands required to set up the prerequisites required to encrypt Azure Virtual Machines.
- Obtain and run the Azure Disk Encryption Prerequisites Azure PowerShell script
- Encrypt your virtual machines

The goal of this document is to enable you to encrypt your virtual machines, even if you have little or no background in Azure PowerShell.
This document assumes you are using Windows 10 as the client machine from which you will configure Azure Disk Encryption.

There are many approaches that can be used to setup the prerequisites and to configure encryption for Azure Virtual Machines. If you are already well-versed in Azure PowerShell or Azure CLI, then you may prefer to use alternate approaches.

> [AZURE.NOTE] To learn more about alternate approaches to configuring encryption for Azure virtual machines, please see [Azure Disk Encryption for Windows and Linux Azure Virtual Machines](https://gallery.technet.microsoft.com/Azure-Disk-Encryption-for-a0018eb0).

## Install and configure Azure PowerShell
You need Azure PowerShell version 1.2.1 or above installed on your computer. The article [How to install and configure Azure PowerShell](../powershell-install-configure.md) contains all the steps you need to provision your computer to work with Azure PowerShell. The most straightforward approach is to use the Web PI installation approach mentioned in that article. Even if you already have Azure PowerShell installed, install again using the Web PI approach so that you have the latest version of Azure PowerShell.


## Obtain and run the Azure disk encryption prerequisites configuration script
The Azure Disk Encryption Prerequisites Configuration Script will set up all the prerequisites required for encrypting your Azure Virtual Machines.

1.	Go to the GitHub page that has the [Azure Disk Encryption Prerequisite Setup Script](https://github.com/Azure/azure-powershell/blob/dev/src/ResourceManager/Compute/Commands.Compute/Extension/AzureDiskEncryption/Scripts/AzureDiskEncryptionPreRequisiteSetup.ps1).
2.	On the GibHub page, click the **Raw** button.
3.	Use **CTRL-A** to select all the text on the page and then use **CTRL-C** to copy all the text on the page to the clipboard.
4.	Open **Notepad** and paste the copied text into Notepad.
5.	Create a new folder on your C: drive named **AzureADEScript**.
6.	Save the Notepad file – click **File**, then click **Save As**. In the File name textbox, enter **“ADEPrereqScript.ps1”** and click **Save**. (make sure you put the quotation marks around the name, otherwise it will save the file with a .txt file extension).

Now that the script content is saved, open the script in the PowerShell ISE:

1.	In the Start Menu, click **Cortana**. Ask **Cortana** “PowerShell” by typing **PowerShell** in the Cortana search text box.
2.	Right click **Windows PowerShell ISE** and click **Run as administrator**.
3.	In the **Administrator: Windows PowerShell ISE** window, click **View** and then click **Show Script Pane**.
4.	If you see the **Commands** pane on the right side of the window, click the **“x”** in the top right corner of the pane to close it. If the text is too small for you to see, use **CTRL+Add** (“Add” is the “+” sign). If the text is too large, use **CTRL+Subtract** (Subtract is the “-“ sign).
5.	Click **File** and then click **Open**. Navigate to the **C:\AzureADEScript** folder and the double-click on the **ADEPrereqScript**.
6.	The **ADEPrereqScript** contents should now appear in the PowerShell ISE and is color-coded to help you see various components, such as commands, parameters and variables more easily.

You should now see something like the figure below.

![PowerShell ISE window](./media/security-center-disk-encryption\security-center-disk-encryption-fig2.png)

The top pane is referred to as the “script pane” and the bottom pane is referred to as the “console”. We will use these terms later in this article.

## Run the Azure disk encryption prerequisites PowerShell command

The Azure Disk Encryption Prerequisites script will ask you for the following information after you start the script:

- **Resource Group Name** - Name of the Resource Group that you want to put the Key Vault into.  A new Resource Group with the name you enter will be created if there isn’t already one with that name created. If you already have a Resource Group that you want to use in this subscription, then enter the name of that Resource Group.
- **Key Vault Name** - Name of the Key Vault in which encryption keys are to be placed. A new Key Vault with this name will be created if you don’t already have a Key Vault with this name. If you already have a Key Vault that you want to use, enter the name of the existing Key Vault.
- **Location** - Location of the Key Vault. Make sure the Key Vault and VMs to be encrypted are in the same location. If you don’t know the location, there are steps later in this article that will show you how to find out.
- **Azure Active Directory Application Name** - Name of the Azure Active Directory application that will be used to write secrets to the Key Vault. A new application with this name will be created if one doesn't exist. If you already have an Azure Active Directory application that you want to use, enter the name of that Azure Active Directory application.

> [AZURE.NOTE] If you’re curious as to why you need to create an Azure Active Directory application, please see *Register an application with Azure Active Directory* section in the article [Getting Started with Azure Key Vault](../key-vault/key-vault-get-started.md).

Perform the following steps to encrypt an Azure Virtual Machine:

1.	If you closed the PowerShell ISE, open an elevated instance of the PowerShell ISE. Follow the instructions earlier in this article if the PowerShell ISE is not already open. If you closed the script, then open the **ADEPrereqScript.ps1** clicking **File**, then **Open** and selecting the script from the **c:\AzureADEScript** folder. If you have followed this article from the start, then just move on to the next step.
2.	In the console of the PowerShell ISE (the bottom pane of the PowerShell ISE), change the focus to the local of the script by typing **cd c:\AzureADEScript** and press **ENTER**.
3.	Set the execution policy on your machine so that you can run the script. Type **Set-ExecutionPolicy Unrestricted** in the console and then press ENTER. If you see a dialog box telling about the effects of the change to execution policy, click either **Yes to all** or **Yes** (if you see **Yes to all**, select that option – if you do not see **Yes to all**, then click **Yes**).
4.	Log into your Azure account. In the console, type **Login-AzureRmAccount** and press **ENTER**. A dialog box will appear in which you enter your credentials (make sure you have rights to change the virtual machines – if you do not have rights, you will not be able to encrypt them. If you are not sure, ask your subscription owner or administrator). You should see information about your **Environment**, **Account**, **TenantId**, **SubscriptionId** and **CurrentStorageAccount**. Copy the **SubscriptionId** to Notepad. You will need to use this in step #6.
5.	Find what subscription your virtual machine belongs to and its location. Go to [https://portal.azure.com](ttps://portal.azure.com) and log in.  On the left side of the page, click **Virtual Machines**. You will see a list of your virtual machines and the subscriptions they belong to.

	![Virtual Machines](./media/security-center-disk-encryption\security-center-disk-encryption-fig3.png)

6.	Return to the PowerShell ISE. Set the subscription context in which the script will be run. In the console, type **Select-AzureRmSubscription –SubscriptionId <your_subscription_Id>** (replace **< your_subscription_Id >** with your actual Subscription ID) and press **ENTER**. You will see information about the Environment, **Account**, **TenantId**, **SubscriptionId** and **CurrentStorageAccount**.
7.	You are now ready to run the script. Click the **Run Script** button or press **F5** on the keyboard.

	![Executing PowerShell Script](./media/security-center-disk-encryption\security-center-disk-encryption-fig4.png)

8.	The script asks for **resourceGroupName:** - enter the name of *Resource Group* you want to use, then press **ENTER**. If you don’t have one, enter a name you want to use for a new one. If you already have a *Resource Group* that you want to use (such as the one that your virtual machine is in), enter the name of the existing Resource Group.
9.	The script asks for **keyVaultName:** - enter the name of the *Key Vault* you want to use, then press ENTER. If you don’t have one, enter a name you want to use for a new one. If you already have a Key Vault that you want to use, enter the name of the existing *Key Vault*.
10.	The script asks for **location:** - enter the name of the location in which the VM you want to encrypt is located, then press **ENTER**. If you don’t remember the location, go back to step #5.
11.	The script asks for **aadAppName:** - enter the name of the *Azure Active Directory* application you want to use, then press **ENTER**. If you don’t have one, enter a name you want to use for a new one. If you already have an *Azure Active Directory application* that you want to use, enter the name of the existing *Azure Active Directory application*.
12.	A log in dialog box will appear. Provide your credentials (yes, you have logged in once, but now you need to do it again).
13.	The script runs and when complete it will ask you to copy the values of the **aadClientID**, **aadClientSecret**, **diskEncryptionKeyVaultUrl**, and **keyVaultResourceId**. Copy each of these values to the clipboard and paste them into Notepad.
14.	Return to the PowerShell ISE and place the cursor at the end of the last line, and press **ENTER**.

The output of the script should look something like the screen below:

![PowerShell output](./media/security-center-disk-encryption\security-center-disk-encryption-fig5.png)

## Encrypt the Azure virtual machine

You are now ready to encrypt your virtual machine. If your virtual machine is located in the same Resource Group as your Key Vault, you can move on to the encryption steps section. However, if your virtual machine is not in the same Resource Group as your Key Vault, you will need to enter the following in the console in the PowerShell ISE:

**$resourceGroupName = <’Virtual_Machine_RG’>**

Replace **< Virtual_Machine_RG >** with the name of the Resource Group in which your virtual machines are contained, surrounded by a single quote. Then press **ENTER**.
To confirm that the correct Resource Group name was entered, type the following in the PowerShell ISE console:

**$resourceGroupName**

Press **ENTER**. You should see the name of Resource Group that your virtual machines are located in. For example:

![PowerShell output](./media/security-center-disk-encryption\security-center-disk-encryption-fig6.png)

### Encryption steps

First, you need to tell PowerShell the name of the virtual machine you want to encrypt. In the console, type:

**$vmName = <’your_vm_name’>**

Replace **<’your_vm_name’>** with the name of your VM (make sure the name is surrounded by a single quote) and then press **ENTER**.

To confirm that the correct VM name was entered, type:

**$vmName**

Press **ENTER**. You should see the name of the virtual machine you want to encrypt. For example:

![PowerShell output](./media/security-center-disk-encryption\security-center-disk-encryption-fig7.png)

There are two ways you can run the encryption command to encrypt the virtual machine. The first method is to type the following command in the PowerShell ISE console:

~~~
Set-AzureRmVMDiskEncryptionExtension -ResourceGroupName $resourceGroupName -VMName $vmName -AadClientID $aadClientID -AadClientSecret $aadClientSecret -DiskEncryptionKeyVaultUrl $diskEncryptionKeyVaultUrl -DiskEncryptionKeyVaultId $keyVaultResourceId
~~~

After typing this command press **ENTER**.

The second method is to click in the script pane (the top pane of the PowerShell ISE) and scroll down to the bottom of the script. Highlight the command listed above, and then right click it and then click **Run Selection** or press **F8** on the keyboard.

![PowerShell ISE](./media/security-center-disk-encryption\security-center-disk-encryption-fig8.png)

Regardless of the method you use, a dialog box will appear informing you that it will take 10-15 minutes for the operation to complete. Click **Yes**.

While the encryption process is taking place, you can return to the Azure Portal and see the status of the virtual machine. On the left side of the page, click **Virtual Machines**, then in the **Virtual Machines** blade, click the name of the virtual machine you’re encrypting. In the blade that appears, you’ll notice that the **Status** says that it’s **Updating**. This demonstrates that encryption is in process.

![More details about the VM](./media/security-center-disk-encryption\security-center-disk-encryption-fig9.png)

Return to the PowerShell ISE. When the script completes, you’ll see what appears in the figure below.

![PowerShell output](./media/security-center-disk-encryption\security-center-disk-encryption-fig10.png)

To demonstrate that the virtual machine is now encrypted, return to the Azure Portal and click **Virtual Machines** on the left side of the page. Click the name of the virtual machine you encrypted. In the **Settings** blade, click **Disks**.

![Settings options](./media/security-center-disk-encryption\security-center-disk-encryption-fig11.png)

On the **Disks** blade, you will see that **Encryption** is **Enabled**.

![Disks properties](./media/security-center-disk-encryption\security-center-disk-encryption-fig12.png)


## Next steps

In this document, you learned how to encrypt an Azure Virtual Machine. To learn more about Azure Security Center, see the following:

- [Security health monitoring in Azure Security Center](security-center-monitoring.md) – Learn how to monitor the health of your Azure resources
- [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) - Learn how to manage and respond to security alerts
- [Azure Security Center FAQ](security-center-faq.md) – Find frequently asked questions about using the service
- [Azure Security Blog](http://blogs.msdn.com/b/azuresecurity/) – Find blog posts about Azure security and compliance
