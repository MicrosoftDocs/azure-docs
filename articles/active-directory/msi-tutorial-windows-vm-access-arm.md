---
title: Use a Windows VM MSI to access Azure Resource Manager
description: A tutorial that walks you through the process of using a Windows VM Managed Service Identity (MSI) to access Azure Resource Manager.
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

# Use a Windows VM Managed Service Identity (MSI) to access Azure Resource Manager

This tutorial shows you how to enable Managed Service Identity (MSI) for a Windows Virtual Machine, and then use that identity to access the Azure Resource Manager API. Managed Service Identities are automatically managed by Azure and enable you to authenticate to services that support Azure AD authentication without needing to insert credentials into your code. 
You will learn how to:


> [!div class="checklist"]
> * Enable MSI on a Windows Virtual Machine 
> * Grant your VM access to a Resource Group in Azure Resource Manager (ARM)
> * Get an access token using the VM identity and use it to call ARM


If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Login to Azure
Login to the Azure portal at [https://portal.azure.com](https://portal.azure.com)


## Create a Windows Virtual Machine in a new Resource Group
For this tutorial, we will create a new Windows VM.  You can also enable MSI on an existing VM.

1.	Click the **New** button found on the upper left-hand corner of the Azure portal.
2.	Select **Compute**, and then select **Windows Server 2016 Datacenter**. 
3.	Enter the virtual machine information. The **Username** and **Password** created here will be the credentials you use to login to the virtual machine.
4.  Choose the proper **Subscription** for the virtual machine in the dropdown.
5.	To select a new **Resource Group** you would like to virtual machine to be created in, choose **Create New**. When complete, click **OK**.
6.	Select the size for the VM. To see more sizes, select **View all** or change the **Supported disk type** filter. On the settings blade, keep the defaults and click **OK**.

![Alt image text](media/msi-tutorial-windows-vm-access-arm/msi-windows-vm.png)

## Enable MSI on your VM 
A Virtual Machine MSI enables you to get access tokens from Azure AD without you needing to put credentials into your code. Enabling MSI tells Azure to create a managed identity for your VM. Under the covers, enabling MSI does two things: it installs the MSI VM extension on your VM, and it enables MSI in Azure Resource Manager.

1.	Select the **Virtual Machine** that you want to enable MSI on.  
2.	On the left navigation bar click **Configuration**. 
3.	You will see **Managed Service Identity**. To register and enable the MSI, select **Yes**, if you wish to disable it, choose No. 
4.	Ensure you click **Save** to save the configuration.  

![Alt image text](media/msi-tutorial-windows-vm-access-arm/msi-windows-configured.png)

5. If you wish to check and verify which extensions are on this VM, click Extensions. If MSI is enabled, then ManagedIdentityExtensionforWindows will appear in the list.

![Alt image text](media/msi-tutorial-windows-vm-access-arm/msi-windows-extension.png)

## Grant your VM access to a Resource Group in ARM
Using MSI your code can get access tokens to authenticate to resources that support Azure AD authentication.  The Azure Resource Manager supports Azure AD authentication.  First, we need to grant this VM’s identity access to a resource in ARM, in this case the Resource Group in which the VM is contained.  

1.	Navigate to the tab for **Resource Groups**. 
2.	Select the specific **Resource Group** you created for your **Windows VM**. 
3.	Go to **Access control (IAM)** in the left panel. 
4.	Then **Add** a new role assignment for your **Windows VM**.  Choose **Role** as **Reader**. 
5.	In the next drop down, **Assign access to** the resource **Virtual Machine**. 
6.	Next, ensure the proper subscription is listed in the **Subscription** dropdown. And for **Resource Group**, select **All resource groups**. 
7.	Finally, in **Select** choose your Windows VM in the dropdown and click **Save**.

![Alt image text](media/msi-tutorial-windows-vm-access-arm/msi-windows-permissions.png)

## Get an access token using the VM identity and use it to call Azure Resource Manager (ARM) 
You will need to use **PowerShell** in this portion.  If you don’t have installed, download it [here](https://docs.microsoft.com/en-us.powershell/azure/overview?view=azurermps-4.3.1). 

1.	In the portal, navigate to **Virtual Machines** and go to your Windows virtual machine and in the **Overview**, click **Connect**. 
2.	Enter in your **Username** and **Password** for which you added when you created the Windows VM. 
3.	Now that you have created a **Remote Desktop Connection** with the virtual machine, open **PowerShell** in the remote session. 
4.	Using Powershell’s Invoke-WebRequest, make a request to the local MSI endpoint to get an access token for Azure Resource Manager.

```powershell
$response = Invoke-WebRequest -Uri http://localhost/50342/oauth2/token -Method GET -Body @resource="https://management.azure.com/"} -Headers @{Metadata="true"}
```

**Note**: The value of the "resource" parameter must be an exact match for what is expected by Azure AD. In the case of the ARM reosurce ID, you must include the trailing slash on the URI.

Next, extract the full response which is stored as a JavaScript Object Notation (JSON) formatted string in the $response object. 

```powershell
$content = $repsonse.Content | ConvertFrom-Json
```
Next, extract the access token from the response.

```powershell
$ArmToken = $content.access_token
```

Finally, call ARM using the access token. In this example, we're also using PowerShell's Invoke-WebRequest to make the call to ARM, and include the access toekn in the Authorization header.

```powershell
(Invoke-WebRequest -Uri https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP>?api-version=2016-06-01 -Method GET -ContentType "application/json" -Headers @{ Authorization ="Bearer $ArmToken"}).content
```
**Note**: The URL is case sensitive, so ensure if you are using the exact same case as you used earlier when you named the Resource Group, and the uppercase "G" in "resourceGroup".

This will return the details of the Resource Group:
```powershell
{"id":"/subscriptions/98f51385-2edc-4b79-bed9-7718de4cb861/resourceGroups/DevTest","name":"DevTest","location":"westus","properties":{"provisioningState":"Succeeded"}}
```



## Related content

- For an overview of MSI, see [Managed Service Identity overview](../active-directory/msi-overview.md).

Use the following comments section to provide feedback and help us refine and shape our content.

