---
title: Microsoft Entra Domain Services troubleshooting | Microsoft Docs'
description: Learn how to troubleshoot common errors when you create or manage Microsoft Entra Domain Services
services: active-directory-ds
author: justinha
manager: amycolannino

ms.assetid: 4bc8c604-f57c-4f28-9dac-8b9164a0cf0b
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.custom: has-azure-ad-ps-ref
ms.topic: troubleshooting
ms.date: 09/15/2023
ms.author: justinha
---
# Common errors and troubleshooting steps for Microsoft Entra Domain Services

As a central part of identity and authentication for applications, Microsoft Entra Domain Services sometimes has problems. If you run into issues, there are some common error messages and associated troubleshooting steps to help you get things running again. At any time, you can also [open an Azure support request][azure-support] for more troubleshooting help.

This article provides troubleshooting steps for common issues in Domain Services.

<a name='you-cannot-enable-azure-ad-domain-services-for-your-azure-ad-directory'></a>

## You cannot enable Microsoft Entra Domain Services for your Microsoft Entra directory

If you have problems enabling Domain Services, review the following common errors and steps to resolve them:

| **Sample error Message** | **Resolution** |
| --- |:--- |
| *The name aaddscontoso.com is already in use on this network. Specify a name that is not in use.* |[Domain name conflict in the virtual network](troubleshoot.md#domain-name-conflict) |
| *Domain Services could not be enabled in this Microsoft Entra tenant. The service does not have adequate permissions to the application called Microsoft Entra Domain Services Sync. Delete the application called 'Microsoft Entra Domain Services Sync' and then try to enable Domain Services for your Microsoft Entra tenant.* |[Domain Services doesn't have adequate permissions to the Microsoft Entra Domain Services Sync application](troubleshoot.md#inadequate-permissions) |
| *Domain Services could not be enabled in this Microsoft Entra tenant. The Domain Services application in your Microsoft Entra tenant does not have the required permissions to enable Domain Services. Delete the application with the application identifier d87dcbc6-a371-462e-88e3-28ad15ec4e64 and then try to enable Domain Services for your Microsoft Entra tenant.* |[The Domain Services application isn't configured properly in your Microsoft Entra tenant](troubleshoot.md#invalid-configuration) |
| *Domain Services could not be enabled in this Microsoft Entra tenant. The Microsoft Entra application is disabled in your Microsoft Entra tenant. Enable the application with the application identifier 00000002-0000-0000-c000-000000000000 and then try to enable Domain Services for your Microsoft Entra tenant.* |[The Microsoft Graph application is disabled in your Microsoft Entra tenant](troubleshoot.md#microsoft-graph-disabled) |

### Domain Name conflict

**Error message**

*The name aaddscontoso.com is already in use on this network. Specify a name that is not in use.*

**Resolution**

Check that you don't have an existing AD DS environment with the same domain name on the same, or a peered, virtual network. For example, you may have an AD DS domain named *aaddscontoso.com* that runs on Azure VMs. When you try to enable a Domain Services managed domain with the same domain name of *aaddscontoso.com* on the virtual network, the requested operation fails.

This failure is due to name conflicts for the domain name on the virtual network. A DNS lookup checks if an existing AD DS environment responds on the requested domain name. To resolve this failure, use a different name to set up your managed domain, or deprovision the existing AD DS domain and then try again to enable Domain Services.

### Inadequate permissions

**Error message**

*Domain Services could not be enabled in this Microsoft Entra tenant. The service does not have adequate permissions to the application called Microsoft Entra Domain Services Sync. Delete the application called 'Microsoft Entra Domain Services Sync' and then try to enable Domain Services for your Microsoft Entra tenant.*

**Resolution**

Check if there's an application named *Microsoft Entra Domain Services Sync* in your Microsoft Entra directory. If this application exists, delete it, then try again to enable Domain Services. To check for an existing application and delete it if needed, complete the following steps:

1. In the [Microsoft Entra admin center](https://entra.microsoft.com), select **Microsoft Entra ID** from the left-hand navigation menu.
1. Select **Enterprise applications**. Choose *All applications* from the **Application Type** drop-down menu, then select **Apply**.
1. In the search box, enter *Microsoft Entra Domain Services Sync*. If the application exists, select it and choose **Delete**.
1. Once you've deleted the application, try to enable Domain Services again.

### Invalid configuration

**Error message**

*Domain Services could not be enabled in this Microsoft Entra tenant. The Domain Services application in your Microsoft Entra tenant does not have the required permissions to enable Domain Services. Delete the application with the application identifier d87dcbc6-a371-462e-88e3-28ad15ec4e64 and then try to enable Domain Services for your Microsoft Entra tenant.*

**Resolution**

Check if you have an existing application named *AzureActiveDirectoryDomainControllerServices* with an application identifier of *d87dcbc6-a371-462e-88e3-28ad15ec4e64* in your Microsoft Entra directory. If this application exists, delete it and then try again to enable Domain Services.

Use the following PowerShell script to search for an existing application instance and delete it if needed:

```powershell
$InformationPreference = "Continue"
$WarningPreference = "Continue"

$aadDsSp = Get-AzureADServicePrincipal -Filter "AppId eq 'd87dcbc6-a371-462e-88e3-28ad15ec4e64'" -ErrorAction Ignore
if ($aadDsSp -ne $null)
{
    Write-Information "Found Azure AD Domain Services application. Deleting it ..."
    Remove-AzureADServicePrincipal -ObjectId $aadDsSp.ObjectId
    Write-Information "Deleted the Azure AD Domain Services application."
}

$identifierUri = "https://sync.aaddc.activedirectory.windowsazure.com"
$appFilter = "IdentifierUris eq '" + $identifierUri + "'"
$app = Get-AzureADApplication -Filter $appFilter
if ($app -ne $null)
{
    Write-Information "Found Azure AD Domain Services Sync application. Deleting it ..."
    Remove-AzureADApplication -ObjectId $app.ObjectId
    Write-Information "Deleted the Azure AD Domain Services Sync application."
}

$spFilter = "ServicePrincipalNames eq '" + $identifierUri + "'"
$sp = Get-AzureADServicePrincipal -Filter $spFilter
if ($sp -ne $null)
{
    Write-Information "Found Azure AD Domain Services Sync service principal. Deleting it ..."
    Remove-AzureADServicePrincipal -ObjectId $sp.ObjectId
    Write-Information "Deleted the Azure AD Domain Services Sync service principal."
}
```

### Microsoft Graph disabled

**Error message**

*Domain Services could not be enabled in this Microsoft Entra tenant. The Microsoft Entra application is disabled in your Microsoft Entra tenant. Enable the application with the application identifier 00000002-0000-0000-c000-000000000000 and then try to enable Domain Services for your Microsoft Entra tenant.*

**Resolution**

Check if you've disabled an application with the identifier *00000002-0000-0000-c000-000000000000*. This application is the Microsoft Entra application and provides Graph API access to your Microsoft Entra tenant. To synchronize your Microsoft Entra tenant, this application must be enabled.

To check the status of this application and enable it if needed, complete the following steps:

1. In the [Microsoft Entra admin center](https://entra.microsoft.com), search for and select **Enterprise applications**. 
1. Choose *All applications* from the **Application Type** drop-down menu, then select **Apply**.
1. In the search box, enter *00000002-0000-0000-c000-00000000000*. Select the application, then choose **Properties**.
1. If **Enabled for users to sign-in** is set to *No*, set the value to *Yes*, then select **Save**.
1. Once you've enabled the application, try to enable Domain Services again.

<a name='users-are-unable-to-sign-in-to-the-azure-ad-domain-services-managed-domain'></a>

## Users are unable to sign in to the Microsoft Entra Domain Services managed domain

If one or more users in your Microsoft Entra tenant can't sign in to the managed domain, complete the following troubleshooting steps:

* **Credentials format** - Try using the UPN format to specify credentials, such as `dee@aaddscontoso.onmicrosoft.com`. The UPN format is the recommended way to specify credentials in Domain Services. Make sure this UPN is configured correctly in Microsoft Entra ID.

    The *SAMAccountName* for your account, such as *AADDSCONTOSO\driley* may be autogenerated if there are multiple users with the same UPN prefix in your tenant or if your UPN prefix is overly long. Therefore, the *SAMAccountName* format for your account may be different from what you expect or use in your on-premises domain.

* **Password synchronization** - Make sure that you've enabled password synchronization for [cloud-only users][cloud-only-passwords] or for [hybrid environments using Microsoft Entra Connect][hybrid-phs].
    * **Hybrid synchronized accounts:** If the affected user accounts are synchronized from an on-premises directory, verify the following areas:
    
      * You've deployed, or updated to, the [latest recommended release of Microsoft Entra Connect](https://www.microsoft.com/download/details.aspx?id=47594).
      * You've configured Microsoft Entra Connect to [perform a full synchronization][hybrid-phs].
      * Depending on the size of your directory, it may take a while for user accounts and credential hashes to be available in the managed domain. Make sure you wait long enough before trying to authenticate against the managed domain.
      * If the issue persists after verifying the previous steps, try restarting the *Microsoft Entra ID Sync Service*. From your Microsoft Entra Connect server, open a command prompt, then run the following commands:
    
        ```console
        net stop 'Microsoft Azure AD Sync'
        net start 'Microsoft Azure AD Sync'
        ```

    * **Cloud-only accounts**: If the affected user account is a cloud-only user account, make sure that the [user has changed their password after you enabled Domain Services][cloud-only-passwords]. This password reset causes the required credential hashes for the managed domain to be generated.

* **Verify the user account is active**: By default, five invalid password attempts within 2 minutes on the managed domain cause a user account to be locked out for 30 minutes. The user can't sign in while the account is locked out. After 30 minutes, the user account is automatically unlocked.
  * Invalid password attempts on the managed domain don't lock out the user account in Microsoft Entra ID. The user account is locked out only within the managed domain. Check the user account status in the *Active Directory Administrative Console (ADAC)* using the [management VM][management-vm], not in Microsoft Entra ID.
  * You can also [configure fine grained password policies][password-policy] to change the default lockout threshold and duration.

* **External accounts** - Check that the affected user account isn't an external account in the Microsoft Entra tenant. Examples of external accounts include Microsoft accounts like `dee@live.com` or user accounts from an external Microsoft Entra directory. Domain Services doesn't store credentials for external user accounts so they can't sign in to the managed domain.

## There are one or more alerts on your managed domain

If there are active alerts on the managed domain, it may prevent the authentication process from working correctly.

To see if there are any active alerts, [check the health status of a managed domain][check-health]. If any alerts are shown, [troubleshoot and resolve them][troubleshoot-alerts].

<a name='users-removed-from-your-azure-ad-tenant-are-not-removed-from-your-managed-domain'></a>

## Users removed from your Microsoft Entra tenant are not removed from your managed domain

Microsoft Entra ID protects against accidental deletion of user objects. When you delete a user account from a Microsoft Entra tenant, the corresponding user object is moved to the recycle bin. When this delete operation is synchronized to your managed domain, the corresponding user account is marked as disabled. This feature helps you recover, or undelete, the user account.

The user account remains in the disabled state in the managed domain, even if you re-create a user account with the same UPN in the Microsoft Entra directory. To remove the user account from the managed domain, you need to forcibly delete it from the Microsoft Entra tenant.

To fully remove a user account from a managed domain, delete the user permanently from your Microsoft Entra tenant using the [Remove-MsolUser][Remove-MsolUser] PowerShell cmdlet with the `-RemoveFromRecycleBin` parameter.

## Next steps

If you continue to have issues, [open an Azure support request][azure-support] for more troubleshooting help.

<!-- INTERNAL LINKS -->
[cloud-only-passwords]: tutorial-create-instance.md#enable-user-accounts-for-azure-ad-ds
[hybrid-phs]: tutorial-configure-password-hash-sync.md
[management-vm]: tutorial-create-management-vm.md
[password-policy]: password-policy.md
[check-health]: check-health.md
[troubleshoot-alerts]: troubleshoot-alerts.md
[Remove-MsolUser]: /powershell/module/msonline/remove-msoluser
[azure-support]: /azure/active-directory/fundamentals/how-to-get-support
