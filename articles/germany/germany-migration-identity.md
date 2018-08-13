---
title: Migration from Azure Germany compute resources to public Azure
description: Provides help for migrating identity resources
author: gitralf
ms.author: ralfwi 
ms.date: 8/13/2018
ms.topic: article
ms.custom: bfmigrate
---

# Identity

## Azure Active Directory

Azure Active Directory in Azure Germany is separated from the Azure AD in global Azure. There's currently no way to move users between Azure Germany and global Azure.

Default tenant names are always different, since Azure appends the suffix automatically depending on the environment. For example, a user name for a member of the "contoso" tenant in global Azure is `user1@contoso.microsoftazure.com`, in Azure Germany it's `user1@contoso.microsoftazure.de`.

When using custom domain names in Azure AD (like `contoso.com`), the domain name must first be registered in Azure. Custom domain names can only be defined in **one** of the environments at the same time (similar to domain names). The domain validation fails when the domain is already registered in *any* Azure Active Directory. That means, a user `user1@contoso.com` that exists in Azure Germany can't exist also in global Azure under the same name, since already the registration for `contoso.com` would fail.

A "soft" migration, where some users are already in the new and some are still in the old environment, would require different names for the different environments.

It's beyond the scope of this document to cover each possible migration scenario, since this depends on how you provision users to Azure AD and what options you have using different user names or UserPrincipalNames. However, here are some hints how to inventory the users, groups etc. you have in your current environment.

### Inventory of Users

To get an overview of all the users and groups that exist in Azure Active Directory, you can use the following PowerShell command:

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

Although all your service principals and applications have to be created new, it's good practice to document the status. You can use the following cmdlets to get an extensive list of all the service principals

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

For a list of all available cmdlets related to Azure AD, use:

```powershell
Get-Help Get-AzureAD*
```

## Next Steps

- Learn about [hybrid identity solutions](../active-directory/choose-hybrid-identity-solution.md)
- Read [this blog](https://blogs.technet.microsoft.com/ralfwi/2017/01/24/using-adconnect-with-multiple-clouds/) about ways to synchronize in different cloud environments

## References

- [Azure Active Directory](https://docs.microsoft.com/azure/active-directory/)
- [Custom Domain Names](../active-directory/fundamentals/add-custom-domain.md)
- [Import data from CSV to Azure AD](/powershell/azure/active-directory/importing-data.md?view=azureadps-2.0)