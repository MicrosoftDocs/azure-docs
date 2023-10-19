---
title: 'Install the Microsoft Entra Connect cloud provisioning agent using a command-line interface (CLI) and PowerShell'
description: Learn how to install the Microsoft Entra Connect cloud provisioning agent by using PowerShell cmdlets.
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 08/29/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---


# Install the Microsoft Entra Provisioning Agent by using a CLI and PowerShell
This article shows you how to install the Microsoft Entra Provisioning Agent by using PowerShell cmdlets.
 
>[!NOTE]
>This article deals with installing the provisioning agent by using the command-line interface (CLI). For information on how to install the Microsoft Entra Provisioning Agent by using the wizard, see [Install the Microsoft Entra Provisioning Agent](how-to-install.md).

## Prerequisite

The Windows server must have TLS 1.2 enabled before you install the Microsoft Entra Provisioning Agent by using PowerShell cmdlets. To enable TLS 1.2, follow the steps in [Prerequisites for Microsoft Entra Cloud Sync](how-to-prerequisites.md#tls-requirements).

>[!IMPORTANT]
>The following installation instructions assume that all the [prerequisites](how-to-prerequisites.md) were met.

<a name='install-the-azure-ad-connect-provisioning-agent-by-using-powershell-cmdlets-'></a>

## Install the Microsoft Entra Provisioning Agent by using PowerShell cmdlets 

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

[!INCLUDE [sign in](../../../../includes/cloud-sync-sign-in.md)]
 3. Select **Manage**.
 4. Click **Download provisioning agent**
 5. On the right, click **Accept terms and download**.
 6. For the purposes of these instructions, the agent was downloaded to the C:\temp folder.
 7. Install ProvisioningAgent in quiet mode.
       ```
      $installerProcess = Start-Process 'c:\temp\AADConnectProvisioningAgentSetup.exe' /quiet -NoNewWindow -PassThru 
      $installerProcess.WaitForExit()

       ```
 8. Import the Provisioning Agent PS module.
       ```
       Import-Module "C:\Program Files\Microsoft Azure AD Connect Provisioning Agent\Microsoft.CloudSync.PowerShell.dll" 
       ```
 9. Connect to Microsoft Entra ID by using an account with the hybrid identity role. You can customize this section to fetch a password from a secure store. 
       ```
       $hybridAdminPassword = ConvertTo-SecureString -String "Hybrid identity admin password" -AsPlainText -Force 
    
       $hybridAdminCreds = New-Object System.Management.Automation.PSCredential -ArgumentList ("HybridIDAdmin@contoso.onmicrosoft.com", $hybridAdminPassword) 
       
       Connect-AADCloudSyncAzureAD -Credential $hybridAdminCreds 
       ```
 10. Add the gMSA account, and provide credentials of the domain admin to create the default gMSA account.
       ```
       $domainAdminPassword = ConvertTo-SecureString -String "Domain admin password" -AsPlainText -Force 
    
       $domainAdminCreds = New-Object System.Management.Automation.PSCredential -ArgumentList ("DomainName\DomainAdminAccountName", $domainAdminPassword) 
    
       Add-AADCloudSyncGMSA -Credential $domainAdminCreds 
       ```
 11. Or use the preceding cmdlet to provide a precreated gMSA account.
       ```
       Add-AADCloudSyncGMSA -CustomGMSAName preCreatedGMSAName$ 
       ```
 12. Add the domain.
       ```
       $contosoDomainAdminPassword = ConvertTo-SecureString -String "Domain admin password" -AsPlainText -Force 
    
       $contosoDomainAdminCreds = New-Object System.Management.Automation.PSCredential -ArgumentList ("DomainName\DomainAdminAccountName", $contosoDomainAdminPassword) 
    
       Add-AADCloudSyncADDomain -DomainName contoso.com -Credential $contosoDomainAdminCreds 
       ```
 13. Or use the preceding cmdlet to configure preferred domain controllers.
       ```
       $preferredDCs = @("PreferredDC1", "PreferredDC2", "PreferredDC3") 
    
       Add-AADCloudSyncADDomain -DomainName contoso.com -Credential $contosoDomainAdminCreds -PreferredDomainControllers $preferredDCs 
       ```
 14. Repeat the previous step to add more domains. Provide the account names and domain names of the respective domains.
 15. Restart the service.
       ```
       Restart-Service -Name AADConnectProvisioningAgent  
       ```
 16. Go to the Microsoft Entra admin center to create the cloud sync configuration.

## Provisioning agent gMSA PowerShell cmdlets
Now that you've installed the agent, you can apply more granular permissions to the gMSA. For information and step-by-step instructions on how to configure the permissions, see [Microsoft Entra Connect cloud provisioning agent gMSA PowerShell cmdlets](how-to-gmsa-cmdlets.md).

## Installing against US government cloud
By default, the Microsoft Entra Provisioning Agent installs against the default Azure cloud environment.  If you are installing the agent for use in the US government cloud do the following:

- In step #8, add **ENVIRONMENTNAME=AzureUSGovernment** to the command line like the example.
    ```
    $installerProcess = Start-Process -FilePath "c:\temp\AADConnectProvisioningAgent.Installer.exe" -ArgumentList "/quiet ENVIRONMENTNAME=AzureUSGovernment" -NoNewWindow -PassThru 
    $installerProcess.WaitForExit()
   ```

## Next steps 

- [What is provisioning?](../what-is-provisioning.md)
- [Microsoft Entra Connect cloud provisioning agent gMSA PowerShell cmdlets](how-to-gmsa-cmdlets.md)
- [What is Microsoft Entra Cloud Sync?](what-is-cloud-sync.md)
