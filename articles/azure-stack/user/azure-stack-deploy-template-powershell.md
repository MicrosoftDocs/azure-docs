---
title: Deploy templates using PowerShell in Azure Stack | Microsoft Docs
description: Deploy a template to Azure Stack using PowerShell.
services: azure-stack
documentationcenter: ''
author: sethmanheim
manager: femila
editor: ''

ms.assetid: 12fe32d7-0a1a-4c02-835d-7b97f151ed0f
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/18/2018
ms.author: sethm
ms.reviewer:

---

# Deploy a template to Azure Stack using PowerShell

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

You can use PowerShell to deploy Azure Resource Manager templates to Azure Stack. This article describes how to use PowerShell to deploy a template.

## Run AzureRM PowerShell cmdlets

This example uses AzureRM PowerShell cmdlets and a template stored on GitHub. The template creates a Windows Server 2012 R2 Datacenter virtual machine.

>[!NOTE]
>Before you try this example, make sure that you've [configured PowerShell](azure-stack-powershell-configure-user.md) for an Azure Stack user.

1. Go to [http://aka.ms/AzureStackGitHub](http://aka.ms/AzureStackGitHub) and find the **101-simple-windows-vm** template. Save the template to this location: C:\\templates\\azuredeploy-101-simple-windows-vm.json.
2. Open an elevated PowerShell command prompt.
3. Replace *username* and *password* in the following script with your username and password, and then run the script.

   ```PowerShell
   # Set deployment variables
   $myNum = "001" #Modify this per deployment
   $RGName = "myRG$myNum"
   $myLocation = "local"
   
   # Create resource group for template deployment
   New-AzureRmResourceGroup -Name $RGName -Location $myLocation
   
   # Deploy simple IaaS template
   New-AzureRmResourceGroupDeployment `
       -Name myDeployment$myNum `
       -ResourceGroupName $RGName `
       -TemplateFile c:\templates\azuredeploy-101-simple-windows-vm.json `
       -NewStorageAccountName mystorage$myNum `
       -DnsNameForPublicIP mydns$myNum `
       -AdminUsername <username> `
       -AdminPassword ("<password>" | ConvertTo-SecureString -AsPlainText -Force) `
       -VmName myVM$myNum `
       -WindowsOSVersion 2012-R2-Datacenter
   ```

   >[!IMPORTANT]
   >Every time you run this script, increment the value of the `$myNum` parameter to prevent overwriting your deployment.

4. Open the Azure Stack portal, select **Browse**, and then select  **Virtual machines** to find your new virtual machine (**myDeployment001**).

## Next steps

[Deploy templates with Visual Studio](azure-stack-deploy-template-visual-studio.md)
