---
title: Redeploy the Azure Stack Development Kit (ASDK) | Microsoft Docs
description: In this quickstart, you learn how to reinstall the ASDK.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: quickstart
ms.custom: mvc
ms.date: 03/16/2018
ms.author: jeffgilb
ms.reviewer: misainat
---

# Quickstart: redeploy the ASDK
In this quickstart, you redeploy the Azure Stack Development Kit (ASDK) in a non-production environment. 

> [!IMPORTANT]
> Upgrading the ASDK to a new version is not supported. You have to redeploy the ASDK on the development kit host computer each time you want to evaluate a newer version of Azure Stack.

## Remove Azure registration 
If you have previously registered your ASDK installation with Azure, you should remove the registration resource before redeploying the ASDK. Re-register the ASDK to enable marketplace syndication when you redeploy the ASDK. 

To remove the registration resource, use the **Remove-AzsRegistration** cmdlet to unregister Azure Stack. Then, use the **Remove-AzureRMRsourceGroup** cmdlet to delete the Azure Stack resource group from your Azure subscription (you need to log in to both your Azure subscription and the local ASDK installation):

> [!NOTE]
> These commands must be run from a computer that has access to the privileged endpoint. For the ASDK, that's the development kit host computer.

1. Open a PowerShell console as an administrator on the ASDK computer.

2. Run the following PowerShell commands to unregister your ASDK installation and delete the **azurestack** resource group from your Azure subscription:

  ```Powershell    
  #Import the registration module that was downloaded with the GitHub tools
  Import-Module C:\AzureStack-Tools-master\Registration\RegisterWithAzure.psm1

  # Provide Azure subscription admin credentials
  Login-AzureRmAccount

  # Provide ASDK admin credentials
  $CloudAdminCred = Get-Credential -UserName AZURESTACK\CloudAdmin -Message "Enter the cloud domain credentials to access the privileged endpoint"

  # Unregister Azure Stack
  Remove-AzsRegistration `
      -CloudAdminCredential $YourCloudAdminCredential `
      -PrivilegedEndpoint AzS-ERCS01

  # Remove the Azure Stack resource group
  Remove-AzureRmResourceGroup -Name azurestack -Force
  ```

3. When the script completes, you should see messages similar to the following example:

   ![unregister ASDK](media/asdk-redeploy-qs/0.png)

Azure Stack should now successfully be unregistered from your Azure subscription. Additionally, the azurestack resource group, created when you registered the ASDK with Azure, should also be deleted.

## Redeploy the ASDK
To redeploy Azure Stack, you must start over from scratch as described below. The steps are different depending on whether or not you used the Azure Stack installer (asdk-installer.ps1) script to install the ASDK.

### Redeploy the ASDK using the installer script
1. On the ASDK computer, open an elevated PowerShell console and navigate to the asdk-installer.ps1 script (the script should be in the **AzureStack_Installer** directory located on a non-system drive). Run the script and click **Reboot**.

   ![Run the asdk-installer.ps1 script](media/asdk-redeploy-qs/1.png)

2. Select the base operating system (not **Azure Stack**) and click **Next**.

   ![Restart into the host operating system](media/asdk-redeploy-qs/2.png)

3. After the development kit host reboots into the base operating system, log in as a local administrator for the development kit host computer. Locate and delete the CloudBuilder.vhdx file that was used as part of the previous deployment (most likely at the root of the C:). 

   ![Delete the CloudBuilder.vhdx file](media/asdk-redeploy-qs/3.png)

4. Repeat the same steps that you took to first [deploy the ASDK](asdk-deploy-qs.md).

### Redeploy the ASDK without using the installer
If you did not use the asdk-installer.ps1 script to install the ASDK, you must manually reconfigure the development kit host computer before redeploying the ASDK.

1. Start the System Configuration utility by running **msconfig.exe** on the ASDK computer. On the **Boot** tab, select the host computer operating system (not Azure Stack), click **Set as default**, and then click **OK**. Click **Restart** when prompted.

      ![Set the boot configuration](media/asdk-redeploy-qs/4.png)

2. After the development kit host reboots into the base operating system, log in as a local administrator for the development kit host computer. Locate and delete the CloudBuilder.vhdx file that was used as part of the previous deployment (most likely at the root of the C:). 

   ![Delete the CloudBuilder.vhdx file](media/asdk-redeploy-qs/5.png)

3. Repeat the same steps that you took to first [deploy the ASDK using PowerShell](asdk-deploy-powershell-qs.md).




## Next steps
In this quickstart, you redeployed the ASDK. To start evaluating the ASDK, continue on to the tutorial for adding a marketplace item.
> [!div class="nextstepaction"]
> [Add an Azure Stack marketplace item](./asdk-marketplace-item.md)





