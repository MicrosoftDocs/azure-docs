---
title: Connect to on-premises environment with Azure Active Directory | Microsoft Learn
description: Explains how to connect Azure NetApp Files volumes from on-premises environment using Azure Active Directory (AD).
ms.service: azure-netapp-files
ms.workload: storage
ms.topic: how-to
author: b-ahibbard
ms.author: anfdocs
ms.date: 06/16/2023
---
# Access SMB volumes from Windows clients joined to Azure Active Directory

You can use Azure Active Directory (Azure AD) with the Hybrid Authentication Management module to authenticate credentials in your hybrid cloud. This solution enables Azure AD to become the trusted source for both cloud and on-premises authentication, circumventing the need for clients connecting to Azure NetApp Files to join the on-premises AD domain. 

## Steps

Before you can connect your on-premises environment to Azure AD, you must have:

* [created an Azure NetApp Files volume](azure-netapp-files-create-volumes-smb.md).
    * Add the CIFS service provider name to the computer account created as part of the Azure NetApp Files volume in on-premises Active Directory. 

### Create the Azure AD Kerberos application

1. In the Azure portal, navigate to Azure AD then **App Registrations**.
1. Assign a **Name**. Under select the **Supported account type**, choose **Accounts in this organizational directory only (Single tenant)**. Select **Register**.

    :::image type="content" source="../media/azure-netapp-files/register-application-active-directory.png" alt-text="Screenshot to register application." lightbox="../media/azure-netapp-files/register-application-active-directory.png":::
    
1. Configure the permissions for the application. Under **App Registrations**, select **API Permissions** then **Add a Permission**. 
1. Select **Microsoft Graph** then **Delegated Permissions**. Under **Select Permissions**, search for "open ID" and select it. Then search for "profile" and add it. 

    :::image type="content" source="../media/azure-netapp-files/api-permissions.png" alt-text="Screenshot to register API permissions." lightbox="../media/azure-netapp-files/api-permissions.png":::
    
1. Grant **Admin Consent** on your application. 

### Install Azure AD Connect in your on-premises environment 

1. Sign on to your on-premises Active Directory account.
1. Create a local user and assign it administrator privileges. This user serves to connect to Azure AD. 
1. Install [Azure AD Connect](https://www.microsoft.com/download/details.aspx?id=47594) using the Azure AD global administrator account. For more information, see [Get started with Azure AD Connect by using express settings](../active-directory/hybrid/connect/how-to-connect-install-express.md).

    1. Configure SCP and synchronize. 
    1. In the Azure portal under Azure Active Directory, navigate to **Users**. Verify the domain local user is synced with Azure AD users. 
    >[!NOTE]
    >After the initial configuration, when you add a new local user, you must run the `Start-ADSyncSyncCycle` command in the Administrator PowerShell to synchronize the new user to Azure AD.
    
### Sync CIFS password from on-premises AD to Azure AD Kerberos Application 

1. Sign on to Active Directory in your on-premises environment.
2. Open PowerShell. 
1. Install the Hybrid Authentication Management module for synchronizing passwords. 

    ```powershell
    Install-Module -Name AzureADHybridAuthenticationManagement -AllowClobber -Force 
    ```

1. Provide values for: 
    * `$servicePrincipalName`: The SPN details from mounting the Azure NetApp Files volume. Use the CIFS/FQDN format. 
    * `$targetApplicationID`: Application ID of the Azure AD application 
    * `$domainCred`: use `Get-Credential`
    * `$cloudCred`: use `Get-Credential`

    ```powershell
    $servicePrincipalName = "CIFS/NETBIOS-1234.CONTOSO.COM
    $targetApplicationID = 0c94fc72-c3e9-4e4e-9126-2c74b45e66fe
    $domainCred = Get-Credential
    $cloudCred = Get-Credential
    ```

1. Import the CIFS details to Azure AD: 

    ```powershell
    Import-AzureADKerberosOnPremServicePrincipal -Domain $domain -DomainCredential $domainCred -CloudCredential $cloudCred -ServicePrincipalName $servicePrincipalName -ApplicationId $targetApplicationId 
    ```

### Create an Azure AD joined machine and mount to ANF Volume 

1. Create two VMs in Azure NetApp Files: one Azure AD-registered and the other Azure AD-joined. 
    1. The **Azure AD-registered VM** facilitates access to the Azure AD-joined machine. Sign into the AD-registered VM using the credentials created during machine creation in the Azure portal:
        In **Settings** under **Work and school account**, select **Connect to Azure > Use global Azure AD cloud account username and password**. 

    1. The **Azure AD-joined VM**:
        Sign into the Azure AD-registered VM then launch a remote desktop to the Azure AD-joined VM.
        In **Settings** under **Work and school account**, select **Join this device to Azure Active Directory** then **Use hybrid user credentials**. Reboot the VM.

1. Sign into the Azure AD-joined VM again using your hybrid credentials (for example: AZUREAD\user@anfdev.onmicrosoft.com).

    >[!NOTE]
    > If you run into issues signing on, select more choices, then provide credentials. 

1. Configure the VM:  
    1. Navigate to **Group Policy > Computer Configuration > Administrative Templates > System > Kerberos**. Enable **Allow retrieving the cloud Keberos ticket during the logon**. 

    1. Select **Define host name-to-Kerberos realm mappings**. Provide a name and vaule using the fully qualified domain name from the mount instructions (for example, name: KERBEROS.MICROSOFTONLINE.COM and value: NETBIOS-1234.contoso.com).  

    :::image type="content" source="../media/azure-netapp-files/define-host-name-to-kerberos.png" alt-text="Screenshot to define how-name-to-Kerberos real mappings." lightbox="../media/azure-netapp-files/define-host-name-to-kerberos.png":::
    
1. Manually add DNS mapping in the hosts. 
    Open `C:\Windows\System32\drivers\etc\hosts` and add an entry based on the mount point and LIF, for example `10.5.1.4 NETBIOS-1234.contoso.com`. Use the hybrid credentials retrieved during the machine creation. Cloud user credentials do not have the correct permission to modify the `/etc/hosts/` file. 
1. Mount using the mount info provided in the Azure NetApp Files. 
net use * \\ NETBIOS-1234.contoso.com\volume1 
1. Confirm the mounted volume is using Kerberos and not NTLM authentication. Open a Command Prompt to issue the `klist` command and observe the output in the cloud TGT (`krbtgt`) and CIFS server ticket information.  

## Further information 

* [Understand guidelines for Active Directory Domain Services](understand-guidelines-active-directory-domain-service-site.md)
* [Create and manage Active Directory connections](create-active-directory-connections.md)
* [Introduction to Azure AD Connect V2.0](../active-directory/hybrid/connect/whatis-azure-ad-connect-v2.md)