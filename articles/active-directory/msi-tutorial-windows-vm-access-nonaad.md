---
title: Use a Windows VM MSI to access Azure Key Vault
description: A tutorial that walks you through the process of using a Windows VM Managed Service Identity (MSI) to access Azure Key Vault. 
services: active-directory
documentationcenter: ''
author: elkuzmen
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

# Use Managed Service Identity (MSI) with a Windows VM to access Azure Key Vault 

[!INCLUDE[preview-notice](../../includes/active-directory-msi-preview-notice.md)]

This tutorial shows you how to enable Managed Service Identity (MSI) for a Windows Virtual Machine, and then use that identity to access the Azure Key Vault. Managed Service Identities are automatically managed by Azure and enable you to authenticate to services that support Azure AD authentication without needing to insert credentials into your code. 
You will learn how to:


> [!div class="checklist"]
> * Enable Managed Service Identity on a Windows Virtual Machine 
> * Grant your VM access to a secret stored in a Key Vault 
> * Get an access token using the VM identity and use it to retrieve the secret from Key Vault 


If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).

## Create a Windows virtual machine in a new resource group

For this tutorial, we create a new Windows VM. You can also enable MSI on an existing VM.

1.	Click the **New** button found on the upper left-hand corner of the Azure portal.
2.	Select **Compute**, and then select **Windows Server 2016 Datacenter**. 
3.	Enter the virtual machine information. The **Username** and **Password** created here is the credentials you use to login to the virtual machine.
4.  Choose the proper **Subscription** for the virtual machine in the dropdown.
5.	To select a new **Resource Group** you would like to virtual machine to be created in, choose **Create New**. When complete, click **OK**.
6.	Select the size for the VM. To see more sizes, select **View all** or change the **Supported disk type** filter. On the settings blade, keep the defaults and click **OK**.

    ![Alt image text](media/msi-tutorial-windows-vm-access-arm/msi-windows-vm.png)

## Enable MSI on your VM 

A Virtual Machine MSI enables you to get access tokens from Azure AD without you needing to put credentials into your code. Enabling MSI tells Azure to create a managed identity for your Virtual Machine. Under the covers, enabling MSI does two things: it installs the MSI VM extension on your VM, and it enables MSI in Azure Resource Manager.

1.	Select the **Virtual Machine** that you want to enable MSI on.  
2.	On the left navigation bar click **Configuration**. 
3.	You see **Managed Service Identity**. To register and enable the MSI, select **Yes**, if you wish to disable it, choose No. 
4.	Ensure you click **Save** to save the configuration.  

    ![Alt image text](media/msi-tutorial-linux-vm-access-arm/msi-linux-extension.png)

5. If you wish to check and verify which extensions are on this VM, click **Extensions**. If MSI is enabled, then **ManagedIdentityExtensionforWindows** appears in the list.

    ![Alt image text](media/msi-tutorial-windows-vm-access-arm/msi-windows-extension.png)

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

    ![Alt image text](media/msi-tutorial-windows-vm-access-nonaad/msi-blade.png)


Next, add a secret to the Key Vault, so that later you can retrieve the secret using code running in your VM: 

1. Select **All Resources**, and find and select the Key Vault you just created. 
2. Select **Secrets**, and click **Add**. 
3. From **Upload options** select **Manual**. 
4. Enter a name and value for the secret.  The value can be anything you want. 
5. Leave the activation date and expiration date clear, and leave **Enabled** as **Yes**. 
6. Click **Create** to create the secret. 
 
## Get an access token using the VM identity and use it retrieve the secret from the Key Vault  

Now that you have created a secret, stored it in a Key Vault, and granted your VM MSI access to the Key Vault, you can write code to retrieve the secret at run time.  To keep this example simple we’ll use simple REST calls using PowerShell.  If you don’t have PowerShell installed, download it [here](https://docs.microsoft.com/powershell/azure/overview?view=azurermps-4.3.1).

First, we’ll use the VM’s MSI to get an access token to authenticate to Key Vault:
 
1. In the portal, navigate to **Virtual Machines** and go to your Windows virtual machine and in the **Overview**, click **Connect**.
2. Enter in your **Username** and **Password** for which you added when you created the **Windows VM**.  
3. Now that you have created a **Remote Desktop Connection** with the virtual machine, open PowerShell in the remote session.  
4. In PowerShell, invoke the web request on the tenant to get the token for the local host in the specific port for the VM.  

    The PowerShell request:
    
    ```powershell
    PS C:\> $response = Invoke-WebRequest -Uri http://localhost:50342/oauth2/token -Method GET -Body @{resource="https://vault.azure.net"} -Headers @{Metadata="true"} 
    ```
    
    Next, extract the full response which is stored as a JavaScript Object Notation (JSON) formatted string in the $response object.  
    
    ```powershell
    PS C:\> $content = $response.Content | ConvertFrom-Json 
    ```
    
    Next, extract the access token from the response.  
    
    ```powershell
    PS C:\> $KeyVaultToken = $content.access_token 
    ```
    
    Finally, use PowerShell’s Invoke-WebRequest command to retrieve the secret you created earlier in the Key Vault, passing the access token in the Authorization header.  You’ll need the URL of your Key Vault, which is in the **Essentials** section of the **Overview** page of the Key Vault.  
    
    ```powershell
    PS C:\> (Invoke-WebRequest -Uri https://<your-key-vault-URL>/secrets/<secret-name>?api-version=2016-10-01 -Method GET -Headers @{Authorization="Bearer $KeyVaultToken"}).content 
    ```
    
    The response will look like this: 
    
    ```powershell
    {"value":"p@ssw0rd!","id":"https://mytestkeyvault.vault.azure.net/secrets/MyTestSecret/7c2204c6093c4d859bc5b9eff8f29050","attributes":{"enabled":true,"created":1505088747,"updated":1505088747,"recoveryLevel":"Purgeable"}} 
    ```
    
Once you’ve retrieved the secret from the Key Vault, you can use it to authenticate to a service that requires a name and password. 

## Related content

- For an overview of MSI, see [Managed Service Identity overview](../active-directory/msi-overview.md).

Use the following comments section to provide feedback and help us refine and shape our content.
