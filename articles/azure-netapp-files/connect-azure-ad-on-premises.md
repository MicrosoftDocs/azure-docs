title: Connect to on-premises environment with Azure Active Directory | Microsoft Learn
description: Explains how to connect Azure NetApp Files volumes from on-premises environment using Azure Active Directory (AD).
ms.service: azure-netapp-files
ms.workload: storage
ms.topic: how-to
author: b-ahibbard
ms.author: anfdocs
ms.date: 06/12/2023
---
# Connect to on-premises environment with Azure Active Directory

Azure Active Directory (Azure AD) with the Hybrid Authentication Management module enables hybrid cloud users to authenticate cloud and on-premises credentials with Azure AD. 
[Azure AD Connect](../active-directory/hybrid/connect/whatis-azure-ad-connect-v2.md)

This allows you to 

The Azure AD with the help of Hybrid Authentication Management module enables hybrid identity organisations (those with Active Directory on-premises) to use modern credentials for their applications and enables Azure AD to become the trusted source for both cloud and on-premises authentication. 

With Azure AD the clients connecting to ANF volume need not join premises AD domain. 
Only need to join Azure AD with user identities managed/synced from on-premises Active Directory to Azure AD using Azure AD connect application. 

## Steps

Before you can connect your on-premises environment to Azure AD, you must have:

* [created an Azure NetApp Files volume](azure-netapp-files-create-volumes-smb.md).
    * The Azure NetApp Files should be mounted <!-- -->
    * Add the CIFS service provider name to the computer account created as part of the Azure NetApp Files volume. 

## Create the Azure AD Kerberos application

1. In the Azure portal, navigate to Azure AD then **App Registrations**.
1. Assign a **Name** and select the **Supported account type**. Select **Register**.
1. Configure the permissions for the application. Under **App Registrations**, select **API Permissions** then **Add a Permission**. 
1. Select **Microsoft Graph** then **Delegated Permissions**. Under **Select Permissions**, search for "open id" and select it. Then search for "profile" and add it. 
1. Grant **Admin Consent** on your application. 

### Install Azure AD Connect in your on-premises environment 

1. Sign on to your on-premises environment.
1. Create a local user and assign it administrator privileges. This user serves to connect to Azure AD. 
1. Install [Azure AD Connect](https://www.microsoft.com/download/details.aspx?id=47594).

    1. Configure SCP and synchronize. 
    1. Verify the domain local user is synced in Azure AD users. 
    <!-- how to ? -->
    >[!NOTE]
    >After the initial configuration, when you add a new local user, you must run the `Start-ADSyncSyncCycle` command in the Administrator PowerShell to synchronize the new user to Azure AD.
    
### Sync CIFS password from on-premiszes AD to Azure AD Kerberos Application 

1. Sign on to Active Directory in your on-premises environment.
2. Open PowerShell. 
1. Install the Hybrid Authentication Management module for synchronizing passwords. 

    ```powershell
    Install-Module -Name AzureADHybridAuthenticationManagement -AllowClobber -Force 
    ```

1. Provide values for: 
    * `$servicePrincipalName`: The SPN details from mounting the Azure NetApp Files volume. Use the CIFS/FQDN format. 
    * `$targetApplicationID`: Application ID of the Azure AD application 
    * `domainCred`: On-premises Active Directory administrator credentials 
    * `cloudCred`: Azure AD credentials with global administrator privilege from a fully qualified domain name.
    For example: 
    ```powershell
    $servicePrincipalName = "CIFS/NETBIOS-1234.CONTOSO.COM
    $targetApplicationID = 0c94fc72-c3e9-4e4e-9126-2c74b45e66fe
    $domainCred = Get-Credential
    $cloudCred = $cloudCred = Get-Credential
    ```

1. Import the CIFS details to Azure AD: 

    ```powershell
    Import-AzureADKerberosOnPremServicePrincipal -Domain $domain -DomainCredential $domainCred -CloudCredential $cloudCred -ServicePrincipalName $servicePrincipalName -ApplicationId $targetApplicationId 
    ```

### AAD Joined machine creation and mount to ANF Volume 

1. Create two VM in Azure NetApp Files: one registered to Azure AD and the other Azure AD-joined. 
    * The **Azure AD-registered VM** facilitates access to the Azure AD-joined machine.
        Sign onto the VM using the credentials created during machine creation in the Azure portal.
        In **Settings** under **Work and school account**, select 

    * The **Azure AD-joined VM**:
        Sign into the Azure-joined VM then launch a remote desktop to the Azure AD-joined VM.
        In **Settings** under **Work and school account**, select **Join this device to Azure Active Directory** then **Use hybrid user credentials**. Reboot the VM.

1. Sign into the Azure AD-joined VM again using your hybrid credentials (for example: AZUREAD\huser@anfdev.onmicrosoft.com).

    >[!NOTE]
    > If you run into issues signing on, select more choices then provide credentials. 

1. 
1. Manually add DNS mapping in the hosts. 
    Open `C:\Windows\System32\drivers\etc\hosts` and add entry based on the mount point and LIF, for example `10.5.1.4 NETBIOS-1234.contoso.com`. Use the credentials retrieved during the machine creation. Cloud user credentials do not have the correct permission to modify the `/etc/hosts/` file. 
1. . Mount using the mount info provided in the ANF. 
net use * \\ NETBIOS-1234.contoso.com\volume1 
1. In the `klist` command observe Cloud TGT and CIFS Service Ticket. 
<!-- why? >