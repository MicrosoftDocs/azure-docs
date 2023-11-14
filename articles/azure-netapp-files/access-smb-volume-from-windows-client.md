---
title: Access SMB volumes from Microsoft Entra joined Windows virtual machines
description: Learn how to access Azure NetApp Files SMB volumes from an on-premises environment using Microsoft Entra ID.
ms.service: azure-netapp-files
ms.workload: storage
ms.topic: how-to
author: b-ahibbard
ms.author: anfdocs
ms.date: 09/21/2023
---
# Access SMB volumes from Microsoft Entra joined Windows virtual machines

You can use Microsoft Entra ID with the Hybrid Authentication Management module to authenticate credentials in your hybrid cloud. This solution enables Microsoft Entra ID to become the trusted source for both cloud and on-premises authentication, circumventing the need for clients connecting to Azure NetApp Files to join the on-premises AD domain. 

>[!NOTE]
>Using Microsoft Entra ID for authenticating [hybrid user identities](../active-directory/hybrid/whatis-hybrid-identity.md) allows Microsoft Entra users to access Azure NetApp Files SMB shares. This means your end users can access Azure NetApp Files SMB shares without requiring a line-of-sight to domain controllers from Microsoft Entra hybrid joined and Microsoft Entra joined VMs. Cloud-only identities aren't currently supported. For more information, see [Understand guidelines for Active Directory Domain Services site design and planning](understand-guidelines-active-directory-domain-service-site.md).

:::image type="content" source="../media/azure-netapp-files/diagram-windows-joined-active-directory.png" alt-text="Diagram of SMB volume joined to Microsoft Entra ID." lightbox="../media/azure-netapp-files/diagram-windows-joined-active-directory.png":::

## Requirements and considerations 

* Azure NetApp Files NFS volumes and dual-protocol (NFSv4.1 and SMB) volumes are not supported.
* NFSv3 and SMB dual-protocol volumes with NTFS security style are supported.
* You must have installed and configured [Microsoft Entra Connect](https://www.microsoft.com/download/details.aspx?id=47594) to synchronize your AD DS users with Microsoft Entra ID. For more information, see [Get started with Microsoft Entra Connect by using express settings](../active-directory/hybrid/connect/how-to-connect-install-express.md).  

    Verify the hybrid identities are synced with Microsoft Entra users. In the Azure portal under **Microsoft Entra ID**, navigate to **Users**. You should see that user accounts from AD DS are listed and the property, **On-premises sync enabled** shows "yes". 
    
    >[!NOTE]
    >After the initial configuration of Microsoft Entra Connect, when you add a new AD DS user, you must run the `Start-ADSyncSyncCycle` command in the Administrator PowerShell to synchronize the new user to Microsoft Entra ID or wait for the scheduled sync to occur. 

* You must have created an [SMB volume for Azure NetApp Files](azure-netapp-files-create-volumes-smb.md).
* You must have a Windows virtual machine (VM) with Microsoft Entra login enabled. For more information, see [Log in to a Windows VM in Azure by using Microsoft Entra ID](../active-directory/devices/howto-vm-sign-in-azure-ad-windows.md). Be sure to [Configure role assignments for the VM](../active-directory/devices/howto-vm-sign-in-azure-ad-windows.md#configure-role-assignments-for-the-vm) to determine which accounts can log in to the VM.
* DNS must be properly configured so the client VM can access your Azure NetApp Files volumes via the fully qualified domain name (FQDN).

## Steps

The configuration process takes you through five process:
* Add the CIFS SPN to the computer account
* Register a new Microsoft Entra application
* Sync CIFS password from AD DS to the Microsoft Entra application registration 
* Configure the Microsoft Entra joined VM to use Kerberos authentication
* Mount the Azure NetApp Files SMB volumes 

### Add the CIFS SPN to the computer account 

1. From your AD DS domain controller, open **Active Directory Users and Computers**. 
1. Under the **View** menu, select **Advanced Features**. 
1. Under **Computers**, right-click on the computer account created as part of the Azure NetApp Files volume then select **Properties**.  
1. Under **Attribute Editor,** locate `servicePrincipalName`. In the Multi-valued string editor, add the CIFS SPN value using the CIFS/FQDN format. 

:::image type="content" source="../media/azure-netapp-files/multi-value-string-editor.png" alt-text="Screenshot of multi-value string editor window." lightbox="../media/azure-netapp-files/multi-value-string-editor.png":::

<a name='register-a-new-azure-ad-application'></a>

### Register a new Microsoft Entra application

1. In the Azure portal, navigate to **Microsoft Entra ID**. Select **App Registrations**.
1. Select **+ New registration**.
1. Assign a **Name**. Under select the **Supported account type**, choose **Accounts in this organizational directory only (Single tenant)**.
1. Select **Register**.

:::image type="content" source="../media/azure-netapp-files/register-application-active-directory.png" alt-text="Screenshot to register application." lightbox="../media/azure-netapp-files/register-application-active-directory.png":::
        
1. Configure the permissions for the application. From your **App Registrations**, select **API Permissions** then **Add a permission**. 
1. Select **Microsoft Graph** then **Delegated Permissions**. Under **Select Permissions**, select **openid** and **profile** under **OpenId permissions**.

    :::image type="content" source="../media/azure-netapp-files/api-permissions.png" alt-text="Screenshot to register API permissions." lightbox="../media/azure-netapp-files/api-permissions.png":::

1. Select **Add permission**. 
1. From **API Permissions**, select **Grant admin consent for...**.

    :::image type="content" source="../media/azure-netapp-files/grant-admin-consent.png" alt-text="Screenshot to grant API permissions." lightbox="../media/azure-netapp-files/grant-admin-consent.png ":::

1. From **Authentication**, under **App instance property lock**, select **Configure** then deselect the checkbox labeled **Enable property lock**.

    :::image type="content" source="../media/azure-netapp-files/authentication-registration.png" alt-text="Screenshot of app registrations." lightbox="../media/azure-netapp-files/authentication-registration.png":::

1. From **Overview**, make note of the **Application (client) ID**, which is required later. 

<a name='sync-cifs-password-from-ad-ds-to-the-azure-ad-application-registration'></a>

### Sync CIFS password from AD DS to the Microsoft Entra application registration

1. From your AD DS domain controller, open PowerShell.
1. Install the [Hybrid Authentication Management module](/azure/azure-sql/managed-instance/winauth-azuread-setup-incoming-trust-based-flow) for synchronizing passwords. 

    ```powershell
    Install-Module -Name AzureADHybridAuthenticationManagement -AllowClobber -Force 
    ```

1. Define the following variables:  
    * `$servicePrincipalName`: The SPN details from mounting the Azure NetApp Files volume. Use the CIFS/FQDN format. For example: `CIFS/NETBIOS-1234.CONTOSO.COM`
    * `$targetApplicationID`: Application (client) ID of the Microsoft Entra application.
    * `$domainCred`: use `Get-Credential` (should be an AD DS domain administrator)
    * `$cloudCred`: use `Get-Credential` (should be a Microsoft Entra Global Administrator)

    ```powershell
    $servicePrincipalName = CIFS/NETBIOS-1234.CONTOSO.COM
    $targetApplicationID = 0c94fc72-c3e9-4e4e-9126-2c74b45e66fe
    $domainCred = Get-Credential
    $cloudCred = Get-Credential
    ```
    >[!NOTE]
    >The `Get-Credential` command will initiate a pop-up Window where you can enter credentials.

1. Import the CIFS details to Microsoft Entra ID: 

    ```powershell
    Import-AzureADKerberosOnPremServicePrincipal -Domain $domain -DomainCredential $domainCred -CloudCredential $cloudCred -ServicePrincipalName $servicePrincipalName -ApplicationId $targetApplicationId 
    ```

<a name='configure-the-azure-ad-joined-vm-to-use-kerberos-authentication'></a>

### Configure the Microsoft Entra joined VM to use Kerberos authentication

1. Log in to the Microsoft Entra joined VM using hybrid credentials with administrative rights (for example: user@mydirectory.onmicrosoft.com).
1. Configure the VM: 
    1. Navigate to **Edit group policy** > **Computer Configuration** > **Administrative Templates** > **System** > **Kerberos**.
    1. Enable **Allow retrieving the Microsoft Entra Kerberos Ticket Granting Ticket during logon**.
    1. Enable **Define host name-to-Kerberos realm mappings**. Select **Show** then provide a **Value name** and **Value** using your domain name preceded by a period. For example:
        * Value name: KERBEROS.MICROSOFTONLINE.COM
        * Value: .contoso.com

    :::image type="content" source="../media/azure-netapp-files/define-host-name-to-kerberos.png" alt-text="Screenshot to define how-name-to-Kerberos real mappings." lightbox="../media/azure-netapp-files/define-host-name-to-kerberos.png":::

### Mount the Azure NetApp Files SMB volumes 

1. Log into to the Microsoft Entra joined VM using a hybrid identity account synced from AD DS.
2. Mount the Azure NetApp Files SMB volume using the info provided in the Azure portal. For more information, see [Mount SMB volumes for Windows VMs](mount-volumes-vms-smb.md).
3. Confirm the mounted volume is using Kerberos authentication and not NTLM authentication. Open a command prompt, issue the `klist` command; observe the output in the cloud TGT (krbtgt) and CIFS server ticket information.

    :::image type="content" source="../media/azure-netapp-files/klist-output.png" alt-text="Screenshot of CLI output." lightbox="../media/azure-netapp-files/klist-output.png":::

## Further information 

* [Understand guidelines for Active Directory Domain Services](understand-guidelines-active-directory-domain-service-site.md)
* [Create and manage Active Directory connections](create-active-directory-connections.md)
* [Introduction to Microsoft Entra Connect V2.0](../active-directory/hybrid/connect/whatis-azure-ad-connect-v2.md)
