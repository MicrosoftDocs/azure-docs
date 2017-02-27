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
3.	Copy the [Test-Activation.ps1 script](https://go.microsoft.com/fwlink/?linkid=842959) to a folder on the host computer (such as C:/temp).
4.	Start PowerShell ISE as an administrator and open the Test-Activation.ps1 script.
5.	In the Step 1 section of the script, change the values for *YourAccountName*, *YourPassword*, and *YourDirectory* to match your Azure subscription.

    ```powershell
    $azureCreds = New-Object System.Management.Automation.PSCredential("YourAccountName", (ConvertTo-SecureString -String "YourPassword" -AsPlainText -Force))
    $azureDirectory = "YourDirectory"
    ```
6.	In the Step 3 section of the script, change the values for YourGUID and YourDirectory to match your Azure subscription.

    ```powershell
    $azureSubscriptionId = "YourGUID"
    $azureDirectory = "YourDirectory"
    ```
7.	Save and run the Test-Activation.ps1 script.
8.	Save the registrationOutput JSON file.
9.	In PowerShell ISE, at the **Enter after the Register Azure Stack with Azure completed, update $registrationResponse to add syndication and usage bridge, then enter to continue** prompt, press enter.
10.	At the **Azure Stack registration completed, enter to continue** prompt, press Enter to complete the registration.

## Verify the registration

1. Sign in to the Azure Stack portal as a service administrator.
2. Click **More Services** > **Marketplace Management** > **Add from Azure**.
3. If you see a list of items available from Azure (such as WordPress), your activation was successful.

## Next steps

[Connect to Azure Stack](azure-stack-connect-azure-stack.md)

