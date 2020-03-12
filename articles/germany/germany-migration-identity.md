---
title: Migrate Azure identity resources, Azure Germany to global Azure
description: This article provides information about migrating your Azure identity resources from Azure Germany to global Azure.
author: gitralf
services: germany
cloud: Azure Germany
ms.author: ralfwi 
ms.service: germany
ms.date: 11/12/2019
ms.topic: article
ms.custom: bfmigrate
---

# Migrate identity resources to global Azure

> [!IMPORTANT]
> Since [August 2018](https://news.microsoft.com/europe/2018/08/31/microsoft-to-deliver-cloud-services-from-new-datacentres-in-germany-in-2019-to-meet-evolving-customer-needs/), we have not been accepting new customers or deploying any new features and services into the original Microsoft Cloud Germany locations.
>
> Based on the evolution in customers’ needs, we recently [launched](https://azure.microsoft.com/blog/microsoft-azure-available-from-new-cloud-regions-in-germany/) two new datacenter regions in Germany, offering customer data residency, full connectivity to Microsoft’s global cloud network, as well as market competitive pricing. 
>
> Take advantage of the breadth of functionality, enterprise-grade security, and comprehensive features available in our new German datacenter regions by [migrating](germany-migration-main.md) today.

This article has information that can help you migrate Azure identity resources from Azure Germany to global Azure.

The guidance on identity / tenants is intended for Azure-only customers. If you use common Azure Active Directory (Azure AD) tenants for Azure and O365 (or other Microsoft products), there are complexities in identity migration and you should first contact your Account Manager prior to using this migration guidance.

## Azure Active Directory

Azure AD in Azure Germany is separate from Azure AD in global Azure. Currently, you can't move Azure AD users from Azure Germany to global Azure.

Default tenant names in Azure Germany and global Azure are always different because Azure automatically appends a suffix based on the environment. For example, a user name for a member of the **contoso** tenant in global Azure is **user1\@contoso.microsoftazure.com**. In Azure Germany, it's **user1\@contoso.microsoftazure.de**.

When you use custom domain names (like **contoso.com**) in Azure AD, you must register the domain name in Azure. Custom domain names can be defined in *only one* cloud environment at a time. The domain validation fails when the domain is already registered in *any* instance of Azure Active Directory. For example, the user **user1\@contoso.com** that exists in Azure Germany can't also exist in global Azure under the same name at the same time. The registration for **contoso.com** would fail.

A "soft" migration in which some users are already in the new environment and some users are still in the old environment requires different sign-in names for the different cloud environments.

We don't cover each possible migration scenario in this article. A recommendation depends, for example, on how you provision users, what options you have for using different user names or UserPrincipalNames, and other dependencies. But, we've compiled some hints to help you inventory users and groups in your current environment.

To get a list of all cmdlets related to Azure AD, run:

```powershell
Get-Help Get-AzureAD*
```

### Inventory users

To get an overview of all users and groups that exist in your Azure AD instance:

```powershell
Get-AzureADUser -All $true
```

To list only enabled accounts, add the following filter:

```powershell
Get-AzureADUser -All $true | Where-Object {$_.AccountEnabled -eq $true}
```

To make a full dump of all attributes, in case you forget something:

```powershell
Get-AzureADUser -All $true | Where-Object {$_.AccountEnabled -eq $true} | Format-List *
```

To select the attributes that you need to re-create the users:

```powershell
Get-AzureADUser -All $true | Where-Object {$_.AccountEnabled -eq $true} | select UserPrincipalName,DisplayName,GivenName,Surname
```

To export the list to Excel, use the **Export-Csv** cmdlet at the end of this list. A complete export might look like this example:

```powershell
Get-AzureADUser -All $true | Where-Object {$_.AccountEnabled -eq $true} | select UserPrincipalName,DisplayName,GivenName,Surname | Export-Csv -Path c:\temp\alluserUTF8.csv -Delimiter ";" -Encoding UTF8
```

> [!NOTE]
> You can't migrate passwords. Instead, you must assign new passwords or use a self-service mechanism, depending on your scenario.
>
>Also, depending on your environment, you might need to collect other information, for example, values for **Extensions**, **DirectReport**, or **LicenseDetail**.

Format your CSV file as needed. Then, follow the steps described in [Import data from CSV](/powershell/azure/active-directory/importing-data) to re-create the users in your new environment.

### Inventory groups

To document group membership:

```powershell
Get-AzureADGroup
```

To get the list of members for each group:

```powershell
Get-AzureADGroup | ForEach-Object {$_.DisplayName; Get-AzureADGroupMember -ObjectId $_.ObjectId}
```

### Inventory service principals and applications

Although you must re-create all service principals and applications, it's a good practice to document the status of service principals and applications. You can use the following cmdlets to get an extensive list of all service principals:

```powershell
Get-AzureADServicePrincipal |Format-List *
```

```powershell
Get-AzureADApplication |Format-List *
```

You can get more information by using other cmdlets that start with `Get-AzureADServicePrincipal*` or `Get-AzureADApplication*`. 

### Inventory directory roles

To document the current role assignment:

```powershell
Get-AzureADDirectoryRole
```

Walk through each role to find users or applications that are associated with the role:

```powershell
Get-AzureADDirectoryRole | ForEach-Object {$_.DisplayName; Get-AzureADDirectoryRoleMember -ObjectId
$_.ObjectId | Format-Table}
```
For more information:

- Learn about [hybrid identity solutions](../active-directory/choose-hybrid-identity-solution.md).
- Read the blog post [Use Azure AD Connect with multiple clouds](https://blogs.technet.microsoft.com/ralfwi/2017/01/24/using-adconnect-with-multiple-clouds/) to learn about ways you can sync to different cloud environments.
- Learn more about [Azure Active Directory](https://docs.microsoft.com/azure/active-directory/).
- Read about [custom domain names](../active-directory/fundamentals/add-custom-domain.md).
- Learn how to [import data from CSV to Azure AD](/powershell/azure/active-directory/importing-data).

## Azure AD Connect

Azure AD Connect is a tool that syncs your identity data between an on-premises Active Directory instance and Azure Active Directory (Azure AD). The current version of Azure AD Connect works both for Azure Germany and global Azure. Azure AD Connect can sync to only one Azure AD instance at a time. If you want to sync to Azure Germany and global Azure at the same time, consider these options:

- Use an additional server for a second instance of Azure AD Connect. You can't have multiple instances of Azure AD Connect on the same server.
- Define a new sign-in name for your users. The domain part (after **\@**) of the sign-in name must be different in each environment.
- Define a clear "source of truth" when you also sync backward (from Azure AD to on-premises Active Directory).

If you already use Azure AD Connect to sync to and from Azure Germany, make sure that you migrate any manually created users. The following PowerShell cmdlet lists all users that aren't synced by using Azure AD Connect:

```powershell
Get-AzureADUser -All $true |Where-Object {$_.DirSyncEnabled -ne "True"}
```

For more information:

- Learn more about [Azure AD Connect](../active-directory/hybrid/reference-connect-dirsync-deprecated.md).

## Multi-Factor Authentication

You must re-create users and redefine your Azure Multi-Factor Authentication instance in your new environment. 

To get a list of user accounts for which multi-factor authentication is enabled or enforced:

1. Sign in to the Azure portal.
1. Select **Users** > **All Users** > **Multi-Factor Authentication**.
1. When you're redirected to the multi-factor authentication service page, set the appropriate filters to get a list of users.

For more information:

- Learn more about [Azure Multi-Factor Authentication](../active-directory/authentication/howto-mfa-getstarted.md).

## Next steps

Learn about tools, techniques, and recommendations for migrating resources in the following service categories:

- [Compute](./germany-migration-compute.md)
- [Networking](./germany-migration-networking.md)
- [Storage](./germany-migration-storage.md)
- [Web](./germany-migration-web.md)
- [Databases](./germany-migration-databases.md)
- [Analytics](./germany-migration-analytics.md)
- [IoT](./germany-migration-iot.md)
- [Integration](./germany-migration-integration.md)
- [Security](./germany-migration-security.md)
- [Management tools](./germany-migration-management-tools.md)
- [Media](./germany-migration-media.md)
