---
title: Enable password hash sync for Azure AD Domain Services | Microsoft Docs
description: In this tutorial, learn how to enable password hash synchronization using Azure AD Connect to an Azure Active Directory Domain Services managed domain.
author: iainfoulds
manager: daveba

ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: tutorial
ms.date: 08/16/2019
ms.author: iainfou

#Customer intent: As an server administrator, I want to learn how to enable password hash synchronization with Azure AD Connect to create a hybrid environment using an on-premises AD DS domain.
---
# Tutorial: Enable password synchronization in Azure Active Directory Domain Services for hybrid environments

For hybrid environments, an Azure Active Directory (Azure AD) tenant can be configured to synchronize with an on-premises Active Directory Domain Services (AD DS) environment using Azure AD Connect. By default, Azure AD Connect doesn't synchronize legacy NTLM and Kerberos credential hashes to Azure AD. To use Azure Active Directory Domain Services (Azure AD DS) with accounts synchronized from an on-premises AD DS environment, you need to configure Azure AD Connect to synchronize the password hashes required for NTLM and Kerberos authentication. You don't need to perform these steps if you use cloud-only accounts and don't have an on-premises AD DS environment.

In this tutorial, you learn:

> [!div class="checklist"]
> * Why legacy NTLM and Kerberos password hashes are needed
> * How to configure legacy password hash synchronization for Azure AD Connect

If you don’t have an Azure subscription, [create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

To complete this tutorial, you need the following resources:

* An active Azure subscription.
    * If you don’t have an Azure subscription, [create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* An Azure Active Directory tenant associated with your subscription that's synchronized with an on-premises directory using Azure AD Connect.
    * If needed, [create an Azure Active Directory tenant][create-azure-ad-tenant] or [associate an Azure subscription with your account][associate-azure-ad-tenant].
    * If needed, [enable Azure AD Connect for password hash synchronization][enable-azure-ad-connect].
* An Azure Active Directory Domain Services managed domain enabled and configured in your Azure AD tenant.
    * If needed, [create and configure an Azure Active Directory Domain Services instance][create-azure-ad-ds-instance].
* A user account that's a member of the *Azure AD DC administrators* group in your Azure AD tenant.

## Password hash synchronization using Azure AD Connect

Azure AD Connect is used to synchronize objects like user accounts and groups from an on-premises AD DS environment into an Azure AD tenant. As part of the process, password hash synchronization enables accounts to use the same password in the on-prem AD DS environment and Azure AD.

To authenticate users on the managed domain, Azure AD DS needs password hashes in a format that's suitable for NT LAN Manager (NTLM) and Kerberos authentication. Azure AD doesn't generate or store password hashes in the format that's required for NTLM or Kerberos authentication until you enable Azure AD DS for your tenant. For security reasons, Azure AD also doesn't store any password credentials in clear-text form. Therefore, Azure AD can't automatically generate these NTLM or Kerberos password hashes based on users' existing credentials.

As prerequisite to configuring Azure AD Connect to generate the required NTLM or Kerberos password hashes for Azure AD DS, you need to first [enable Azure AD Connect for password hash synchronization][enable-azure-ad-connect]. Make sure that you [download and install the latest available release of Azure AD Connect][azure-ad-connect-download]. If you have an existing instance of Azure AD Connect, update to the latest version to make sure you can generate the legacy password hashes for NTLM and Kerberos. This functionality isn't available in early releases of Azure AD Connect or with the legacy DirSync tool. A minimum of Azure AD Connect of version *1.1.614.0* is required.

## Enable synchronization of NTLM and Kerberos credential hashes

With Azure AD Connect installed and configured to synchronize with Azure AD, now configure the legacy password hash sync for NTLM and Kerberos. Run the following PowerShell script on each AD forest to enable on-premises account NTLM and Kerberos password hashes to be synchronized. The script also initiates a full synchronization of Azure AD Connect to Azure AD:

```powershell
$adConnector = "<CASE SENSITIVE AD CONNECTOR NAME>"
$azureadConnector = "<CASE SENSITIVE AZURE AD CONNECTOR NAME>"
Import-Module adsync
$c = Get-ADSyncConnector -Name $adConnector
$p = New-Object Microsoft.IdentityManagement.PowerShell.ObjectModel.ConfigurationParameter "Microsoft.Synchronize.ForceFullPasswordSync", String, ConnectorGlobal, $null, $null, $null
$p.Value = 1
$c.GlobalParameters.Remove($p.Name)
$c.GlobalParameters.Add($p)
$c = Add-ADSyncConnector -Connector $c
Set-ADSyncAADPasswordSyncConfiguration -SourceConnector $adConnector -TargetConnector $azureadConnector -Enable $false
Set-ADSyncAADPasswordSyncConfiguration -SourceConnector $adConnector -TargetConnector $azureadConnector -Enable $true
```

Depending on the size of your directory in terms of number of accounts and groups, synchronization of the legacy password hashes to Azure AD may take some time. The passwords are then synchronized to the Azure AD DS managed domain after they've synchronized to Azure AD.

## Next steps

In this tutorial, you learned:

> [!div class="checklist"]
> * Why legacy NTLM and Kerberos password hashes are needed
> * How to configure legacy password hash synchronization for Azure AD Connect

> [!div class="nextstepaction"]
> [How password hash sync works for Azure AD Domain Services](../active-directory/hybrid/how-to-connect-password-hash-synchronization.md#password-hash-sync-process-for-azure-ad-domain-services?context=/azure/active-directory-domain-services/context/azure-ad-ds-context)

<!-- INTERNAL LINKS -->
[create-azure-ad-tenant]: ../active-directory/fundamentals/sign-up-organization.md
[associate-azure-ad-tenant]: ../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md
[create-azure-ad-ds-instance]: tutorial-create-instance.md
[enable-azure-ad-connect]: ../active-directory/hybrid/how-to-connect-install-express.md

<!-- EXTERNAL LINKS -->
[azure-ad-connect-download]: https://www.microsoft.com/download/details.aspx?id=47594
