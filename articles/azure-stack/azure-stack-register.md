---
title: Register Azure Stack | Microsoft Docs
description: Register Azure Stack with your Azure subscription.
services: azure-stack
documentationcenter: ''
author: ErikjeMS
manager: byronr
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/01/2017
ms.author: erikje

---
# Register Azure Stack with your Azure Subscription

To use Azure Stack in a production environment you must first register it with your Azure subscription. After registering you can declare your business model (consumption-based or capacity-based) and Azure connection options.

> [!NOTE]
>In TP3, registering Azure Stack is not required because you don't have to select a business model or connection option. However, you can test the process and provide feedback about it.
>

## Register

1.	Sign in to the Azure Stack POC host computer as an Azure Stack administrator.
2.	Make sure you have the Azure PowerShell cmdlets on the host computer. 
3.	Close all PowerShell windows.
4.	[TEMP WORKAROUND] Copy the DLLs from \\TBD link\\ to the C:\CloudDeployment\ECEngine\bin folder on the host.
5.	Copy the Test-Activation.ps1 script to a folder on the host computer (such as C:/temp).
6.	Start PowerShell ISE as an administrator and open the Test-Activation.ps1 script.
7.	In the Step 1 section of the script, change the values for *YourAccountName*, *YourPassword*, and *YourDirectory* to match your Azure subscription.

    ```powershell
    $azureCreds = New-Object System.Management.Automation.PSCredential("YourAccountName", (ConvertTo-SecureString -String "YourPassword" -AsPlainText -Force))
    $azureDirectory = "YourDirectory"
    ```
8.	In the Step 3 section of the script, change the values for YourGUID and YourDirectory to match your Azure subscription.

    ```powershell
    $azureSubscriptionId = "YourGUID"
    $azureDirectory = "YourDirectory"
    ```
9.	Save and run the Test-Activation.ps1 script.
10.	[TEMP WORKAROUND] When you see the **Register Azure Stack with Azure completed, update $registrationResponse to add syndication and usage bridge, then enter to continue** prompt, open the C:\Temp\registrationOutput JSON file in a text editor (such as Notepad) and add the syndication and usagebridge lines as shown below. Don’t forget the comma after “Succeeded”.

    ```powershell
    {
        "id":  "/subscriptions/5c17413c-1135-479b-a046-847e1ef9fbeb/resourceGroups/acrp-3d26a799-b877-4aca-8af7-04a44cbc2d28/providers/Microsoft.AzureStack/registrations/registration-acrp-3d26a799-b877-4aca-8af7-04a44cbc2d28",
        "name":  "registration-acrp-3d26a799-b877-4aca-8af7-04a44cbc2d28",
        "type":  "Microsoft.AzureStack/registrations",
        "location":  "southcentralus",
        "etag":  "W/\"datetime\u00272017-02-21T21%3A44%3A54.0069259Z\u0027\"",
        "properties":  {
                       "ObjectId":  "93088113-b6d8-43f5-be4c-e4b93100cc60",
                       "provisioningState":  "Succeeded",
                       "syndication" : "on",
                       "usagebridge" : "off"
                   }
    }
    ```
11.	Save the registrationOutput JSON file.
12.	In PowerShell ISE, at the **Enter after the Register Azure Stack with Azure completed, update $registrationResponse to add syndication and usage bridge, then enter to continue** prompt, press enter.
13.	At the **Azure Stack registration completed, enter to continue** prompt, press Enter to complete the registration.

## Verify the registration

1. Sign in to the Azure Stack portal as a service administrator.
2. Click **More Services** > **Marketplace Management** > **Add from Azure**.
3. If you see a list of items available from Azure (such as WordPress), your activation was successful.

## Next steps

[Connect to Azure Stack](azure-stack-connect-azure-stack.md)

