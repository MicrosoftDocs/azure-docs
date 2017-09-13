---
title: Use a Windows VM MSI to access KeyVault
description: A tutorial that walks you through the process of using a Windows VM Managed Service Identity (MSI) to access KeyVault. 
services: active-directory
documentationcenter: ''
author: elizakuzmenko
manager: mbaldwin
editor: bryanla

ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/14/2017
ms.author: elkuzmen
---

# Use Managed Service Identity (MSI) with a Windows VM to access KeyVault 
This tutorial shows you how to enable Managed Service Identity (MSI) for a Windows Virtual Machine, and then use that identity to access the Azure Key Vault. Managed Service Identities are automatically managed by Azure and enable you to authenticate to services that support Azure AD authentication without needing to insert credentials into your code. 
You will learn how to:


> [!div class="checklist"]
> * Enable Managed Service Identity on a Windows Virtual Machine 
> * Grant your VM access to a secret stored in a Key Vault 
> * Get an access token using the VM identity and use it to retrieve the secret from Key Vault 


If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Login to Azure
Login to the Azure portal at [https://portal.azure.com](https://portal.azure.com)


## Create a Windows virtual machine in a new resource group
For this tutorial, we create a new Windows VM.  You can also enable MSI on an existing VM.

1.	Click the **New** button found on the upper left-hand corner of the Azure portal.
2.	Select **Compute**, and then select **Windows Server 2016 Datacenter**. 
3.	Enter the virtual machine information. The **Username** and **Password** created here is the credentials you use to login to the virtual machine.
4.  Choose the proper **Subscription** for the virtual machine in the dropdown.
5.	To select a new **Resource Group** you would like to virtual machine to be created in, choose **Create New**. When complete, click **OK**.
6.	Select the size for the VM. To see more sizes, select **View all** or change the **Supported disk type** filter. On the settings blade, keep the defaults and click **OK**.

![Alt image text](media/msi-tutorial-windows-vm-access-arm/msi-windows-vm.png)

## Enable MSI on your VM 
A Virtual Machine MSI enables you to get access tokens from Azure AD without you needing to put credentials into your code. Enabling MSI tells Azure to create a managed identity for your VM. Under the covers, enabling MSI does two things: it installs the MSI VM extension on your VM, and it enables MSI in Azure Resource Manager.

1.	Select the **Virtual Machine** that you want to enable MSI on.  
2.	On the left navigation bar click **Configuration**. 
3.	You see **Managed Service Identity**. To register and enable the MSI, select **Yes**, if you wish to disable it, choose No. 
4.	Ensure you click **Save** to save the configuration.  

![Alt image text](media/msi-tutorial-windows-vm-access-arm/msi-windows-configured.png)

5. If you wish to check and verify which extensions are on this VM, click **Extensions**. If MSI is enabled, then **ManagedIdentityExtensionforWindows** appears in the list.

![Alt image text](media/msi-tutorial-windows-vm-access-arm/msi-windows-extension.png)

## Grant your VM access to a Resource Group in ARM
Using MSI your code can get access tokens to authenticate to resources that support Azure AD authentication.  The Azure Resource Manager supports Azure AD authentication.  First, we need to grant this VM’s identity access to a resource in ARM, in this case the Resource Group in which the VM is contained.  
=======

## Grant your VM access to a Secret stored in a Key Vault  
Using MSI your code can get access tokens to authenticate to resources that support Azure AD authentication.  However, not all Azure services support Azure AD authentication. To use MSI with services that don’t support Azure AD authentication, you can store the credentials you need for those services in Azure Key Vault, and use MSI to authenticate to Key Vault to retrieve the credentials. 

First, we need to create a Key Vault and grant our VM’s identity access to the Key Vault.   

1. At the top of the left navigation bar select **+ New** then **Security + Identity** then **Key Vault**.  
2. Provide a **Name** for the new Key Vault. 
3. Locate the Key Vault in the same subscription and resource group as the VM you created earlier. 
4. Select **Access policies** and click **Add new**. 
5. In Configure from template, select **Secret Management**. 
6. Choose **Select Principal**, and in the search field enter the name of the VM you created earlier.  Select the VM in the result list and click **Select**. 
7. Click **OK** to finishing adding the new access policy, and **OK** to finish access policy selection. 
8. Click **Create** to finish creating the Key Vault. 

Next, add a secret to the Key Vault, so that later you can retrieve the secret using code running in your VM: 

1. Select **All Resources**, and find and select the Key Vault you just created. 
2. Select **Secrets**, and click **Add**. 
3. From **Upload options** select **Manual**. 
4. Enter a name and value for the secret.  The value can be anything you want. 
5. Leave the activation date and expiration date clear, and leave **Enabled** as **Yes**. 
6. Click **Create** to create the secret. 
 
## Get an access token using the VM identity and use it retrieve the secret from the Key Vault  

 



## Related content

- For an overview of MSI, see [Managed Service Identity overview](../active-directory/msi-overview.md).

Use the following comments section to provide feedback and help us refine and shape our content.
