---
title: Redeploy the Azure Stack Development Kit (ASDK) | Microsoft Docs
description: In this article, you learn how to reinstall the ASDK.
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
ms.topic: article
ms.custom: 
ms.date: 08/01/2018
ms.author: jeffgilb
ms.reviewer: misainat
---

# Redeploy the ASDK
In this article, you learn how to redeploy the Azure Stack Development Kit (ASDK) in a non-production environment. Because upgrading the ASDK isn't supported, you need to completely redeploy it to move to a newer version. You can also redeploy the ASDK at any time that you just want to start over from scratch.

> [!IMPORTANT]
> Upgrading the ASDK to a new version isn't supported. You have to redeploy the ASDK on the development kit host computer each time you want to evaluate a newer version of Azure Stack.

## Remove Azure registration 
If you have previously registered your ASDK installation with Azure, you should remove the registration resource before redeploying the ASDK. Re-register the ASDK to enable the availability of items in the marketplace when you redeploy the ASDK. If you have not previously registered the ASDK with your Azure subscription, you can skip this section.

To remove the registration resource, use the **Remove-AzsRegistration** cmdlet to unregister Azure Stack. Then, use the **Remove-AzureRMRsourceGroup** cmdlet to delete the Azure Stack resource group from your Azure subscription:

1. Open a PowerShell console as an administrator on a computer that has access to the privileged endpoint. For the ASDK, that's the development kit host computer.

2. Run the following PowerShell commands to unregister your ASDK installation and delete the **azurestack** resource group from your Azure subscription:

  ```Powershell    
  #Import the registration module that was downloaded with the GitHub tools
  Import-Module C:\AzureStack-Tools-master\Registration\RegisterWithAzure.psm1

  # Provide Azure subscription admin credentials
  Add-AzureRmAccount

  # Provide ASDK admin credentials
  $CloudAdminCred = Get-Credential -UserName AZURESTACK\CloudAdmin -Message "Enter the cloud domain credentials to access the privileged endpoint"

  # Unregister Azure Stack
  Remove-AzsRegistration `
      -PrivilegedEndpointCredential $CloudAdminCred `
      -PrivilegedEndpoint AzS-ERCS01

  # Remove the Azure Stack resource group
  Remove-AzureRmResourceGroup -Name azurestack -Force
  ```

3. You are prompted to sign in to both your Azure subscription and the local ASDK installation when the script runs.
4. When the script completes, you should see messages similar to the following examples:

    ` De-Activating Azure Stack (this may take up to 10 minutes to complete).`
    ` Your environment is now unable to syndicate items and is no longer reporting usage data.`
    ` Remove registration resource from Azure...`
    ` "Deleting the resource..." on target "/subscriptions/<subscription information>"`
    ` ********** End Log: Remove-AzsRegistration ********* `



Azure Stack should now successfully be unregistered from your Azure subscription. Additionally, the azurestack resource group, created when you registered the ASDK with Azure, should also be deleted.

## Deploy the ASDK
To redeploy Azure Stack, you must start over from scratch as described below. The steps are different depending on whether or not you used the Azure Stack installer (asdk-installer.ps1) script to install the ASDK.

### Redeploy the ASDK using the installer script
1. On the ASDK computer, open an elevated PowerShell console and navigate to the asdk-installer.ps1 script in the **AzureStack_Installer** directory located on a non-system drive. Run the script and click **Reboot**.

   ![Run the asdk-installer.ps1 script](media/asdk-redeploy/1.png)

2. Select the base operating system (not **Azure Stack**) and click **Next**.

   ![Restart into the host operating system](media/asdk-redeploy/2.png)

3. After the development kit host reboots into the base operating system, log in as a local administrator. Locate and delete the **C:\CloudBuilder.vhdx** file that was used as part of the previous deployment. 

4. Repeat the same steps that you took to first [deploy the ASDK](asdk-install.md).

### Redeploy the ASDK without using the installer
If you did not use the asdk-installer.ps1 script to install the ASDK, you must manually reconfigure the development kit host computer before redeploying the ASDK.

1. Start the System Configuration utility by running **msconfig.exe** on the ASDK computer. On the **Boot** tab, select the host computer operating system (not Azure Stack), click **Set as default**, and then click **OK**. Click **Restart** when prompted.

      ![Set the boot configuration](media/asdk-redeploy/4.png)

2. After the development kit host reboots into the base operating system, log in as a local administrator for the development kit host computer. Locate and delete the **C:\CloudBuilder.vhdx** file that was used as part of the previous deployment. 

3. Repeat the same steps that you took to first [deploy the ASDK using PowerShell](asdk-deploy-powershell.md).


## Next steps
[Post ASDK installation configuration tasks](asdk-post-deploy.md)




