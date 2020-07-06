---
title: Group managed service accounts for Azure AD Domain Services | Microsoft Docs
description: Learn how to create a group managed service account (gMSA) for use with Azure Active Directory Domain Services managed domains
services: active-directory-ds
author: iainfoulds
manager: daveba

ms.assetid: e6faeddd-ef9e-4e23-84d6-c9b3f7d16567
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: how-to
ms.date: 03/30/2020
ms.author: iainfou

---
# Create a group managed service account (gMSA) in Azure Active Directory Domain Services

Applications and services often need an identity to authenticate themselves with other resources. For example, a web service may need to authenticate with a database service. If an application or service has multiple instances, such as a web server farm, manually creating and configuring the identities for those resources gets time consuming.

Instead, a group managed service account (gMSA) can be created in the Azure Active Directory Domain Services (Azure AD DS) managed domain. The Windows OS automatically manages the credentials for a gMSA, which simplifies the management of large groups of resources.

This article shows you how to create a gMSA in a managed domain using Azure PowerShell.

## Before you begin

To complete this article, you need the following resources and privileges:

* An active Azure subscription.
    * If you don't have an Azure subscription, [create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* An Azure Active Directory tenant associated with your subscription, either synchronized with an on-premises directory or a cloud-only directory.
    * If needed, [create an Azure Active Directory tenant][create-azure-ad-tenant] or [associate an Azure subscription with your account][associate-azure-ad-tenant].
* An Azure Active Directory Domain Services managed domain enabled and configured in your Azure AD tenant.
    * If needed, complete the tutorial to [create and configure an Azure Active Directory Domain Services manged domain][create-azure-ad-ds-instance].
* A Windows Server management VM that is joined to the Azure AD DS managed domain.
    * If needed, complete the tutorial to [create a management VM][tutorial-create-management-vm].

## Managed service accounts overview

A standalone managed service account (sMSA) is a domain account whose password is automatically managed. This approach simplifies service principal name (SPN) management, and enables delegated management to other administrators. You don't need to manually create and rotate credentials for the account.

A group managed service account (gMSA) provides the same management simplification, but for multiple servers in the domain. A gMSA lets all instances of a service hosted on a server farm use the same service principal for mutual authentication protocols to work. When a gMSA is used as service principal, the Windows operating system again manages the account's password instead of relying on the administrator.

For more information, see [group managed service accounts (gMSA) overview][gmsa-overview].

## Using service accounts in Azure AD DS

As managed domains are locked down and managed by Microsoft, there are some considerations when using service accounts:

* Create service accounts in custom organizational units (OU) on the managed domain.
    * You can't create a service account in the built-in *AADDC Users* or *AADDC Computers* OUs.
    * Instead, [create a custom OU][create-custom-ou] in the managed domain and then create service accounts in that custom OU.
* The Key Distribution Services (KDS) root key is pre-created.
    * The KDS root key is used to generate and retrieve passwords for gMSAs. In Azure AD DS, the KDS root is created for you.
    * You don't have privileges to create another, or view the default, KDS root key.

## Create a gMSA

First, create a custom OU using the [New-ADOrganizationalUnit][New-AdOrganizationalUnit] cmdlet. For more information on creating and managing custom OUs, see [Custom OUs in Azure AD DS][create-custom-ou].

> [!TIP]
> To complete these steps to create a gMSA, [use your management VM][tutorial-create-management-vm]. This management VM should already have the required AD PowerShell cmdlets and connection to the managed domain.

The following example creates a custom OU named *myNewOU* in the managed domain named *aaddscontoso.com*. Use your own OU and managed domain name:

```powershell
New-ADOrganizationalUnit -Name "myNewOU" -Path "DC=aaddscontoso,DC=COM"
```

Now create a gMSA using the [New-ADServiceAccount][New-ADServiceAccount] cmdlet. The following example parameters are defined:

* **-Name** is set to *WebFarmSvc*
* **-Path** parameter specifies the custom OU for the gMSA created in the previous step.
* DNS entries and service principal names are set for *WebFarmSvc.aaddscontoso.com*
* Principals in *AADDSCONTOSO-SERVER$* are allowed to retrieve the password use the identity.

Specify your own names and domain names.

```powershell
New-ADServiceAccount -Name WebFarmSvc `
    -DNSHostName WebFarmSvc.aaddscontoso.com `
    -Path "OU=MYNEWOU,DC=aaddscontoso,DC=com" `
    -KerberosEncryptionType AES128, AES256 `
    -ManagedPasswordIntervalInDays 30 `
    -ServicePrincipalNames http/WebFarmSvc.aaddscontoso.com/aaddscontoso.com, `
        http/WebFarmSvc.aaddscontoso.com/aaddscontoso, `
        http/WebFarmSvc/aaddscontoso.com, `
        http/WebFarmSvc/aaddscontoso `
    -PrincipalsAllowedToRetrieveManagedPassword AADDSCONTOSO-SERVER$
```

Applications and services can now be configured to use the gMSA as needed.

## Next steps

For more information about gMSAs, see [Getting started with group managed service accounts][gmsa-start].

<!-- INTERNAL LINKS -->
[create-azure-ad-tenant]: ../active-directory/fundamentals/sign-up-organization.md
[associate-azure-ad-tenant]: ../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md
[create-azure-ad-ds-instance]: tutorial-create-instance.md
[tutorial-create-management-vm]: tutorial-create-management-vm.md
[create-custom-ou]: create-ou.md

<!-- EXTERNAL LINKS -->
[New-ADOrganizationalUnit]: /powershell/module/addsadministration/New-AdOrganizationalUnit
[New-ADServiceAccount]: /powershell/module/addsadministration/New-AdServiceAccount
[gmsa-overview]: /windows-server/security/group-managed-service-accounts/group-managed-service-accounts-overview
[gmsa-start]: /windows-server/security/group-managed-service-accounts/getting-started-with-group-managed-service-accounts
