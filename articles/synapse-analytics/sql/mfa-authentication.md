---
title: Using multifactor Microsoft Entra authentication
description: Synapse SQL support connections from SQL Server Management Studio (SSMS) using Active Directory Universal Authentication. 
author: vvasic-msft
ms.service: synapse-analytics
ms.subservice: sql
ms.topic: overview
ms.date: 04/15/2020
ms.author: vvasic
ms.reviewer: sngun
ms.custom: has-adal-ref
---

# Use multifactor Microsoft Entra authentication with Synapse SQL (SSMS support for MFA)

Synapse SQL support connections from SQL Server Management Studio (SSMS) using *Active Directory Universal Authentication*. 

This article discusses the differences between the various authentication options, and also the limitations associated with using Universal Authentication. 

**Download the latest SSMS** - On the client computer, download the latest version of SSMS, from [Download SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms?view=azure-sqldw-latest&preserve-view=true).

For all the features discussed in this article, use at least July 2017, version 17.2.  The most recent connection dialog box, should look similar to the following image:

![Screenshot shows Connect to Server dialog box where you can select a server name and authentication option.](./media/mfa-authentication/1mfa-universal-connect.png "Completes the User name box.")  

## The five authentication options  

Active Directory Universal Authentication supports the two non-interactive authentication methods:
    - `Active Directory - Password` authentication
    - `Active Directory - Integrated` authentication

There are two non-interactive authentication models as well, which can be used in many different applications (ADO.NET, JDCB, ODC, etc.). These two methods never result in pop-up dialog boxes:

- `Active Directory - Password`
- `Active Directory - Integrated`

The interactive method is that also supports Microsoft Entra multifactor authentication (MFA) is:

- `Active Directory - Universal with MFA`

Microsoft Entra multifactor authentication helps safeguard access to data and applications while meeting user demand for a simple sign-in process. It delivers strong authentication with a range of easy verification options (phone call, text message, smart cards with pin, or mobile app notification), allowing users to choose the method they prefer. Interactive MFA with Microsoft Entra ID can result in a pop-up dialog box for validation.

For a description of multifactor authentication, see [multifactor authentication](../../active-directory/authentication//concept-mfa-howitworks.md).

<a name='azure-ad-domain-name-or-tenant-id-parameter'></a>

### Microsoft Entra domain name or tenant ID parameter

Beginning with [SSMS version 17](/sql/ssms/download-sql-server-management-studio-ssms?view=azure-sqldw-latest&preserve-view=true), users that are imported into the current Active Directory from other Azure Active Directories as guest users, can provide the Microsoft Entra domain name, or tenant ID when they connect. 

Guest users include users invited from other Azure ADs, Microsoft accounts such as outlook.com, hotmail.com, live.com, or other accounts like gmail.com. This information, allows **Active Directory Universal with MFA Authentication** to identify the correct authenticating authority. This option is also required to support Microsoft accounts (MSA) such as outlook.com, hotmail.com, live.com, or non-MSA accounts. 

All these users who want to be authenticated using Universal Authentication must enter their Microsoft Entra domain name or tenant ID. This parameter represents the current Microsoft Entra domain name/tenant ID the Azure Server is linked with. 

For example, if Azure Server is associated with Microsoft Entra domain `contosotest.onmicrosoft.com` where user `joe@contosodev.onmicrosoft.com` is hosted as an imported user from Microsoft Entra domain `contosodev.onmicrosoft.com`, the domain name required to authenticate this user is `contosotest.onmicrosoft.com`. 

When the user is a native user of the Microsoft Entra ID linked to Azure Server, and is not an MSA account, no domain name or tenant ID is required. 

To enter the parameter (beginning with SSMS version 17.2), in the **Connect to Database** dialog box, complete the dialog box, selecting **Active Directory - Universal with MFA** authentication, select **Options**, complete the **User name** box, and then select the **Connection Properties** tab. 

Check the **AD domain name or tenant ID** box, and provide authenticating authority, such as the domain name (**contosotest.onmicrosoft.com**) or the GUID of the tenant ID.  

   ![Screenshot shows Connect to Server in the Connection Properties tab with values entered.](./media/mfa-authentication/mfa-tenant-ssms.png)

If you are running SSMS 18.x or later, then the AD domain name or tenant ID is no longer needed for guest users because 18.x or later automatically recognizes it.

   ![mfa-tenant-ssms](./media/mfa-authentication/mfa-no-tenant-ssms.png)

<a name='azure-ad-business-to-business-support'></a>

### Microsoft Entra business to business support   
Microsoft Entra users supported for Microsoft Entra B2B scenarios as guest users (see [What is Azure B2B collaboration](../../active-directory/external-identities/what-is-b2b.md?bc=%2fazure%2fsynapse-analytics%2fbreadcrumb%2ftoc.json&toc=%2fazure%2fsynapse-analytics%2ftoc.json) can connect to Synapse SQL only as part of members of a group created in current Microsoft Entra ID and mapped manually using the Transact-SQL `CREATE USER` statement in a given database. 

For example, if `steve@gmail.com` is invited to Azure AD `contosotest` (with the Microsoft Entra domain `contosotest.onmicrosoft.com`), a Microsoft Entra group, such as `usergroup` must be created in the Microsoft Entra ID that contains the `steve@gmail.com` member. Then, this group must be created for a specific  database (that is, MyDatabase) by Microsoft Entra SQL admin or Microsoft Entra DBO  by executing a Transact-SQL `CREATE USER [usergroup] FROM EXTERNAL PROVIDER` statement. 

After the database user is created, then the user `steve@gmail.com` can log in to `MyDatabase` using the SSMS authentication option `Active Directory – Universal with MFA support`. 

The usergroup, by default, has only the connect permission and any further data access that will need to be granted in the normal way. 

As a guest user, `steve@gmail.com` must check the box and add the AD domain name `contosotest.onmicrosoft.com` in the SSMS **Connection Property** dialog box. The **AD domain name or tenant ID** option is only supported for the Universal with MFA connection options, otherwise it is greyed out.

## Universal Authentication limitations for Synapse SQL

- SSMS and SqlPackage.exe are the only tools currently enabled for MFA through Active Directory Universal Authentication.
- SSMS version 17.2, supports multi-user concurrent access using Universal Authentication with MFA. Version 17.0 and 17.1, restricted a login for an instance of SSMS using Universal Authentication to a single Microsoft Entra account. To log in as another Microsoft Entra account, you must use another instance of SSMS. (This restriction is limited to Active Directory Universal Authentication; you can log in to different servers using Active Directory Password Authentication, Active Directory Integrated Authentication, or SQL Server Authentication).
- SSMS supports Active Directory Universal Authentication for Object Explorer, Query Editor, and Query Store visualization.
- SSMS version 17.2 provides DacFx Wizard support for Export/Extract/Deploy Data database. Once a specific user is authenticated through the initial authentication dialog using Universal Authentication, the DacFx Wizard functions the same way it does for all other authentication methods.
- The SSMS Table Designer doesn't support Universal Authentication.
- There are no additional software requirements for Active Directory Universal Authentication except that you must use a supported version of SSMS.  
- The Active Directory Authentication Library (ADAL) version for Universal authentication was updated to its latest ADAL.dll 3.13.9 available released version. See [Active Directory Authentication Library 3.14.1](https://www.nuget.org/packages/Microsoft.IdentityModel.Clients.ActiveDirectory/).  

## Next steps
For more information, see the [Connect to Synapse SQL with SQL Server Management Studio](get-started-ssms.md) article.
