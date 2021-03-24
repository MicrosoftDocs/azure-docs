---
title: 'Install the Azure AD Connect cloud provisioning agent using powershell'
description: Learn how to install the Azure AD Connect cloud provisioning agent using powershell cmdlets.
services: active-directory
author: billmath
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 11/16/2020
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---


# Install the Azure AD Connect provisioning agent using powershell cmdlets 
The following document will guide show you how to install the Azure AD Connect provisioning agent using PowerShell cmdlets.
 

## Prerequisite: 


>[!IMPORTANT]
>The following installation instructions assume that all of the [Prerequisites](how-to-prerequisites.md) have been met.
>
> The windows server needs to have TLS 1.2 enabled before you install the Azure AD Connect provisioning agent using powershell cmdlets. To enable TLS 1.2 you can use the steps found [here](how-to-prerequisites.md#tls-requirements).

 

## Install the Azure AD Connect provisioning agent using powershell cmdlets 


 1. Sign in to the Azure portal, and then go to **Azure Active Directory**.
 2. In the left menu, select **Azure AD Connect**.
 3. Select **Manage provisioning (preview)** > **Review all agents**.
 4. Download the Azure AD Connect provisioning agent from the Azure portal to a locally.  

   ![Download on-premises agent](media/how-to-install/install-9.png)</br>
 5. For purposes of these instructions, the agent was downloaded to the following folder:   “C:\ProvisioningSetup” folder. 
 6. Install ProvisioningAgent in quiet mode

   ```
   $installerProcess = Start-Process c:\temp\AADConnectProvisioningAgent.Installer.exe /quiet -NoNewWindow -PassThru 
   $installerProcess.WaitForExit()  
   ```
 7. Import Provisioning Agent PS module 

   ```
   Import-Module "C:\Program Files\Microsoft Azure AD Connect Provisioning Agent\Microsoft.CloudSync.Powershell.dll" 
   ```
 8. Connect to AzureAD using global administrator credentials, you can customize this section to fetch password from a secure store. 

   ```
   $globalAdminPassword = ConvertTo-SecureString -String "Global admin password" -AsPlainText -Force 

   $globalAdminCreds = New-Object System.Management.Automation.PSCredential -ArgumentList ("GlobalAdmin@contoso.onmicrosoft.com", $globalAdminPassword) 
   ```

   Connect-AADCloudSyncAzureAD -Credential $globalAdminCreds 

 9. Add the gMSA account, provide credentials of the domain admin to create default gMSA account 
 
   ```
   $domainAdminPassword = ConvertTo-SecureString -String "Domain admin password" -AsPlainText -Force 

   $domainAdminCreds = New-Object System.Management.Automation.PSCredential -ArgumentList ("DomainName\DomainAdminAccountName", $domainAdminPassword) 

   Add-AADCloudSyncGMSA -Credential $domainAdminCreds 
   ```
 10. Or use the above cmdlet as below to provide a pre-created gMSA account 

 
   ```
   Add-AADCloudSyncGMSA -CustomGMSAName preCreatedGMSAName$ 
   ```
 11. Add domain 

   ```
   $contosoDomainAdminPassword = ConvertTo-SecureString -String "Domain admin password" -AsPlainText -Force 

   $contosoDomainAdminCreds = New-Object System.Management.Automation.PSCredential -ArgumentList ("DomainName\DomainAdminAccountName", $contosoDomainAdminPassword) 

   Add-AADCloudSyncADDomain -DomainName contoso.com -Credential $contosoDomainAdminCreds 
   ```
 12. Or use the above cmdlet as below to configure preferred domain controllers 

   ```
   $preferredDCs = @("PreferredDC1", "PreferredDC2", "PreferredDC3") 

   Add-AADCloudSyncADDomain -DomainName contoso.com -Credential $contosoDomainAdminCreds -PreferredDomainControllers $preferredDCs 
   ```
 13. Repeat the previous step to add more domains, please provide the account names and domain names of the respective domains 
 14. Restart the service 
   ```
   Restart-Service -Name AADConnectProvisioningAgent  
   ```
 15.  Go to the azure portal to create the cloud sync configuration.

## Provisioning agent gMSA PowerShell cmdlets
Now that you have installed the agent, you can apply more granular permissions to the gMSA.  See [Azure AD Connect cloud provisioning agent gMSA PowerShell cmdlets](how-to-gmsa-cmdlets.md) for information and step-by-step instructions on configuring the permissions.

## Next steps 

- [What is provisioning?](what-is-provisioning.md)
- [Azure AD Connect cloud provisioning agent gMSA PowerShell cmdlets](how-to-gmsa-cmdlets.md)
- [What is Azure AD Connect cloud sync?](what-is-cloud-sync.md)