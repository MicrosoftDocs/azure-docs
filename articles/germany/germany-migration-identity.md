---
title: Migration of identity resources from Azure Germany to global Azure
description: This article provides help for migrating identity resources from Azure Germany to global Azure
author: gitralf
services: germany
cloud: Azure Germany
ms.author: ralfwi 
ms.service: germany
ms.date: 8/15/2018
ms.topic: article
ms.custom: bfmigrate
---

# Migration of identity resources from Azure Germany to global Azure

This article will provide you some help for the migration of Azure Identity resources from Azure Germany to global Azure.

## Azure Active Directory

Azure Active Directory in Azure Germany is separated from the Azure AD in global Azure. There's currently no way to move users between Azure Germany and global Azure.

Default tenant names are always different, since Azure appends the suffix automatically depending on the environment. For example, a user name for a member of the "contoso" tenant in global Azure is `user1@contoso.microsoftazure.com`, in Azure Germany it's `user1@contoso.microsoftazure.de`.

When using custom domain names in Azure AD (like `contoso.com`), the domain name must first be registered in Azure. Custom domain names can be defined **only in one** of the cloud environments at the same time. The domain validation fails when the domain is already registered in *any* Azure Active Directory. That means, a user `user1@contoso.com` that exists in Azure Germany can't exist also in global Azure under the same name at the same time. The registration for `contoso.com` would already fail.

A "soft" migration, where some users are already in the new and some are still in the old environment, would require different sign-in names for the different cloud environments.

It's beyond the scope of this document to cover each possible migration scenario. A recommendation depends, for example, on how you do provisioning of users, what options you have using different user names or UserPrincipalNames, or other dependencies that have to be taken into consideration. However, here are some hints how to inventory users and groups from your current environment.

For a list of all available cmdlets related to Azure AD, use:

```powershell
Get-Help Get-AzureAD*
```

### Inventory of Users

To get an overview of all the users and groups that exist in your Azure Active Directory, you can use the following PowerShell command:

```powershell
Get-AzureADUser -All $true
```

To list only enabled accounts, use the following filter:

```powershell
Get-AzureADUser -All $true | Where-Object {$_.AccountEnabled -eq $true}
```

Make a full dump of all attributes in case you forget something:

```powershell
Get-AzureADUser -All $true | Where-Object {$_.AccountEnabled -eq $true} | Format-List *
```

Select the attributes you need to re-create the users:

```powershell
Get-AzureADUser -All $true | Where-Object {$_.AccountEnabled -eq $true} | select UserPrincipalName,DisplayName,GivenName,Surname
```

To export the list to excel, use the `Export-Csv` cmdlet at the end. A complete export might look like this example:

```powershell
Get-AzureADUser -All $true | Where-Object {$_.AccountEnabled -eq $true} | select UserPrincipalName,DisplayName,GivenName,Surname | Export-Csv -Path c:\temp\alluserUTF8.csv -Delimiter ";" -Encoding UTF8
```

> [!NOTE]
> Passwords can't be migrated. You have to assign new passwords or use a self-service mechanism depending on your scenario.


> [!NOTE]
> Depending on your environment, there might be other information you need to collect, for example Extensions, DirectReport, LicenceDetail etc.

Format your CSV as needed and follow the steps given in [Importing data from CSV](/powershell/azure/active-directory/importing-data.md?view=azureadps-2.0) to re-create the users in the new environment.

### Inventory of Groups

To document group membership, use the following PowerShell cmdlets:

```powershell
Get-AzureADGroup
```

Walk through the list of groups to get the list of members for each group:

```powershell
Get-AzureADGroup | ForEach-Object {$_.DisplayName; Get-AzureADGroupMember -ObjectId $_.ObjectId}
```

### Inventory of Service Principals and Applications

Although all your service principals and applications have to be created new, it's good practice to document the status. You can use the following cmdlets to get an extensive list of all the service principals.

```powershell
Get-AzureADServicePrincipal |Format-List *
```

```powershell
Get-AzureADApplication |Format-List *
```

You can get more information by using other cmdlets starting with `Get-AzureADServicePrincipal*` or `Get-AzureADApplication*`. 

### Directory Roles

To document the current role assignment, use a similar way like shown above with groups:

```powershell
Get-AzureADDirectoryRole
```

Walk through each role to find users or applications associated with that role:

```powershell
Get-AzureADDirectoryRole | ForEach-Object {$_.DisplayName; Get-AzureADDirectoryRoleMember -ObjectId
$_.ObjectId | Format-Table}
```



## Next Steps

- Learn about [hybrid identity solutions](../active-directory/choose-hybrid-identity-solution.md)
- Read [this blog](https://blogs.technet.microsoft.com/ralfwi/2017/01/24/using-adconnect-with-multiple-clouds/) about ways to synchronize into different cloud environments

## References

- [Azure Active Directory](https://docs.microsoft.com/azure/active-directory/)
- [Custom Domain Names](../active-directory/fundamentals/add-custom-domain.md)
- [Import data from CSV to Azure AD](/powershell/azure/active-directory/importing-data.md?view=azureadps-2.0)

## ADConnect

ADConnect is a tool that synchronizes your identity data between on-premise Active Directory and Azure Active Directory. The current version of ADConnect works for both cloud environments, Azure Germany and global Azure. ADConnect can only synchronize to one Azure AD at the same time. If you want to synchronize to Azure Germany and global Azure at the same time, consider these topics:

- Use an additional server for a second instance of ADConnect. It's not supported to have multiple instances of ADConnect on the same server.
- Define a new sign-in name for your users. The domain part (after the "@") of the sign-in name must be different in both environments.
- Define a clear "source of truth" when you also synchronize backwards (from Azure AD to on-premise AD).

For more information how to synchronize in different cloud environments with ADConnect, read [this blog](https://blogs.technet.microsoft.com/ralfwi/2017/01/24/using-adconnect-with-multiple-clouds/).

If you're already using ADConnect for synchronization to and from Azure Germany, make sure you don't forget to migrate any manually created users. The following PowerShell cmdlet lists all users that are not synchronized by ADConnect:

```powershell
Get-AzureADUser -All $true |Where-Object {$_.DirSyncEnabled -ne "True"}
```

### Next Steps

- Learn about [ADConnect](../active-directory/hybrid/reference-connect-dirsync-deprecated.md)







## Multi-Factor Authentication

Since users have to be re-created in the new environment, the multi-factor authentication has to be redefined also. To get a list of user accounts that have multi-factor authentication enabled or enforced, follow these steps:

- sign in to the Azure portal
- select `Users` > `All Users` > `Multi-Factor Authentication`
- after being redirected to the multi-factor authentication service page, set the appropriate filters to get a list of users.

### Next Steps

- Learn about [Azure Multi-Factor Authentication](../active-directory/authentication/howto-mfa-getstarted.md)