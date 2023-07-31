---
title: Secure group managed service accounts
description: A guide to securing group managed service accounts (gMSAs) 
author: jricketts
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 02/09/2023
ms.author: jricketts
ms.reviewer: ajburnle
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# Secure group managed service accounts

Group managed service accounts (gMSAs) are domain accounts to help secure services. gMSAs can run on one server, or in a server farm, such as systems behind a network load balancing or Internet Information Services (IIS) server. After you configure your services to use a gMSA principal, account password management is handled by the Windows operating system (OS).

## Benefits of gMSAs

gMSAs are an identity solution with greater security that help reduce administrative overhead:

* **Set strong passwords** - 240-byte, randomly generated passwords: the complexity and length of gMSA passwords minimizes the likelihood of compromise by brute force or dictionary attacks
* **Cycle passwords regularly** - password management goes to the Windows OS, which changes the password every 30 days. Service and domain administrators don't need to schedule password changes, or manage service outages.
* **Support deployment to server farms** - deploy gMSAs to multiple servers to support load balanced solutions where multiple hosts run the same service 
* **Support simplified service principal name (SPN) management** - set up an SPN with PowerShell, when you create an account. 
  * In addition, services that support automatic SPN registrations might do so against the gMSA, if the gMSA permissions are set correctly. 

## Using gMSAs

Use gMSAs as the account type for on-premises services unless a service, such as failover clustering, doesn't support it.

> [!IMPORTANT]
> Test your service with gMSAs before it goes to production. Set up a test environment to ensure the application uses the gMSA, then accesses resources. For more information, see [Support for group managed service accounts](/system-center/scom/support-group-managed-service-accounts?view=sc-om-2022&preserve-view=true).

If a service doesn't support gMSAs, you can use a standalone managed service account (sMSA). An sMSA has the same functionality, but is intended for deployment on a single server.

If you can't use a gMSA or sMSA supported by your service, configure the service to run as a standard user account. Service and domain administrators are required to observe strong password management processes to help keep the account secure.

## Assess gMSA security posture

gMSAs are more secure than standard user accounts, which require ongoing password management. However, consider gMSA scope of access in relation to security posture. Potential security issues and mitigations for using gMSAs are shown in the following table:

| Security issue| Mitigation |
| - | - |
| gMSA is a member of privileged groups | - Review your group memberships. Create a PowerShell script to enumerate group memberships. Filter the resultant CSV file by gMSA file names</br> - Remove the gMSA from privileged groups</br> - Grant the gMSA rights and permissions it requires to run its service. See your service vendor. 
| gMSA has read/write access to sensitive resources | - Audit access to sensitive resources</br> - Archive audit logs to a SIEM, such as Azure Log Analytics or Microsoft Sentinel</br> - Remove unnecessary resource permissions if there's an unnecessary access level |


## Find gMSAs

Your organization might have gMSAs. To retrieve these accounts, run the following PowerShell cmdlets:

```powershell
Get-ADServiceAccount 
Install-ADServiceAccount 
New-ADServiceAccount 
Remove-ADServiceAccount 
Set-ADServiceAccount 
Test-ADServiceAccount 
Uninstall-ADServiceAccount
```

### Managed Service Accounts container
  
To work effectively, gMSAs must be in the Managed Service Accounts container.
  
![Screenshot of a gMSA in the Managed Service Accounts container.](./media/govern-service-accounts/secure-gmsa-image-1.png)

To find service MSAs not in the list, run the following commands:

```powershell

Get-ADServiceAccount -Filter *

# This PowerShell cmdlet returns managed service accounts (gMSAs and sMSAs). Differentiate by examining the ObjectClass attribute on returned accounts.

# For gMSA accounts, ObjectClass = msDS-GroupManagedServiceAccount

# For sMSA accounts, ObjectClass = msDS-ManagedServiceAccount

# To filter results to only gMSAs:

Get-ADServiceAccount –Filter * | where-object {$_.ObjectClass -eq "msDS-GroupManagedServiceAccount"}
```

## Manage gMSAs

To manage gMSAs, use the following Active Directory PowerShell cmdlets:

`Get-ADServiceAccount`

`Install-ADServiceAccount`

`New-ADServiceAccount`

`Remove-ADServiceAccount`

`Set-ADServiceAccount`

`Test-ADServiceAccount`

`Uninstall-ADServiceAccount`

> [!NOTE]
> In Windows Server 2012, and later versions, the *-ADServiceAccount cmdlets work with gMSAs. Learn more: [Get started with group managed service accounts](/windows-server/security/group-managed-service-accounts/getting-started-with-group-managed-service-accounts).

## Move to a gMSA

gMSAs are a secure service account type for on-premises. It's recommended you use gMSAs, if possible. In addition, consider moving your services to Azure and your service accounts to Azure Active Directory. 

   > [!NOTE] 
   > Before you configure your service to use the gMSA, see [Get started with group managed service accounts](/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/jj128431(v=ws.11)).
  
To move to a gMSA:

1. Ensure the Key Distribution Service (KDS) root key is deployed in the forest. This is a one-time operation. See, [Create the Key Distribution Services KDS Root Key](/windows-server/security/group-managed-service-accounts/create-the-key-distribution-services-kds-root-key).
2. Create a new gMSA. See, [Getting Started with Group Managed Service Accounts](/windows-server/security/group-managed-service-accounts/getting-started-with-group-managed-service-accounts).
3. Install the new gMSA on hosts that run the service.
4. Change your service identity to gMSA.
5. Specify a blank password.
6. Validate your service is working under the new gMSA identity.
7. Delete the old service account identity.

## Next steps

To learn more about securing service accounts, see the following articles:

* [Introduction to on-premises service accounts](service-accounts-on-premises.md)  
* [Secure standalone managed service accounts](service-accounts-standalone-managed.md)  
* [Secure computer accounts with Active Directory](service-accounts-computer.md)  
* [Secure user-based service accounts in Active Directory](service-accounts-user-on-premises.md)  
* [Govern on-premises service accounts](service-accounts-govern-on-premises.md)
