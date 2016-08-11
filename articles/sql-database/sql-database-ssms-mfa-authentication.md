<properties
   pageTitle="SSMS support for Azure AD MFA with SQL Database and SQL Data Warehouse | Microsoft Azure"
   description="Use Multi-Factored Authentication with SSMS for SQL Database and SQL Data Warehouse."
   services="sql-database"
   documentationCenter=""
   authors="BYHAM"
   manager="jhubbard"
   editor=""
   tags=""/>

<tags
   ms.service="sql-database"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="data-management"
   ms.date="08/15/2016"
   ms.author="rick.byham@microsoft.com"/>

# SSMS support for Azure AD MFA with SQL Database and SQL Data Warehouse

Azure SQL Database and Azure SQL Data Warehouse now support connections from SQL Server Management Studio (SSMS) using *Active Directory Universal Authentication*. Active Directory Universal Authentication is an interactive work flow that supports *Azure Multi-Factor Authentication* (MFA). Azure MFA helps safeguard access to data and applications while meeting user demand for a simple sign-in process. It delivers strong authentication with a range of easy verification options—phone call, text message, smart cards with pin, or mobile app notification—allowing users to choose the method they prefer. For a description of Multi-Factor Authentication, see [Multi-Factor Authentication](../multi-factor-authentication/multi-factor-authentication.md).

SSMS now supports:
- Interactive MFA with Azure AD with the potential for pop-up dialog box validation.
- Non-interactive Active Directory Password and Active Directory Integrated Authentication methods that can be used in many different applications (ADO.NET, JDBC, ODBC, etc.). These two methods never result in pop-up dialog boxes.

When the user account is configured for MFA the interactive authentication work flow requires additional user interaction through pop-up dialog boxes, smart card use, etc. When the user account is configured for MFA, the user must select Azure Universal Authentication to connect. If the user account does not require MFA, the user can still use the other two Azure Active Directory Authentication options.

## Active Directory Universal Authentication limitations for SQL Database and SQL Data Warehouse

- SSMS is the only tool currently enabled for MFA through Active Directory Universal Authentication.
- Only a single Azure Active Directory account can log in for an instance of SSMS using Universal Authentication. To log in as another Azure AD account, you must use another instance of SSMS. (This restriction is limited to Active Directory Universal Authentication; you can log in to different servers using Active Directory Password Authentication, Active Directory Integrated Authentication, or SQL Server Authentication).
- SSMS supports Active Directory Universal Authentication for Object Explorer, Query Editor, and Query Store visualization.
- Neither DacFx nor the Schema Designer support Universal Authentication.
- MSA accounts are not supported for Active Directory Universal Authentication.
- Active Directory Universal Authentication is not supported in SSMS for users that are imported into the current Active Directory from other Active Directories.
- There are no additional software requirements for Active Directory Universal Authentication except that you must use a supported version of SSMS.

## Configuration steps

Implementing Multi-Factor Authentication requires four basic steps.
1. **Configure an Azure Active Directory** – For more information, see [Integrating your on-premises identities with Azure Active Directory](../active-directory/active-directory-aadconnect.md), [Add your own domain name to Azure AD](https://azure.microsoft.com/blog/2012/11/28/windows-azure-now-supports-federation-with-windows-server-active-directory/), [Microsoft Azure now supports federation with Windows Server Active Directory](https://azure.microsoft.com/blog/2012/11/28/windows-azure-now-supports-federation-with-windows-server-active-directory/), [Administering your Azure AD directory](https://msdn.microsoft.com/library/azure/hh967611.aspx), and [Manage Azure AD using Windows PowerShell](https://msdn.microsoft.com/library/azure/jj151815.aspx).
2. **Configure MFA** – For step-by-step instructions, see [Configuring Azure Multi-Factor Authentication](../multi-factor-authentication/multi-factor-authentication-whats-next.md). 
3. **Configure SQL Database or SQL Data Warehouse for Azure AD Authentication** – For step-by-step instructions, see [Connecting to SQL Database or SQL Data Warehouse By Using Azure Active Directory Authentication](sql-database-aad-authentication.md).
4. **Download SSMS** – On the client computer, download the latest SSMS (at least August 2016), from [Download SQL Server Management Studio (SSMS)](https://msdn.microsoft.com/library/mt238290.aspx).

## Connecting by using Universal Authentication with SSMS

The following steps show how to connect to SQL Database or SQL Data Warehouse by using the latest SSMS.

1. To connect using Universal Authentication, on the **Connect to Server** dialog box, select **Active Directory Universal Authentication**.
![1mfa-universal-connect][1]

2. As usual for SQL Database and SQL Data Warehouse you must click **Options** and specify the database on the **Options** dialog box. Then click **Connect**.
3. When the **Sign in to your account** dialog box appears, provide the account and password of your Azure Active Directory identity.
![2mfa-sign-in][2]

    > [AZURE.NOTE] For Universal Authentication with an account which does not require MFA, you connect at this point. For users requiring MFA, continue with the following steps.
 
4. Two MFA setup dialog boxes might appear. This one time operation depends on the MFA administrator setting, and therefore may be optional. For an MFA enabled domain this step is sometimes pre-defined (for example, the domain requires users to use a smartcard and pin).
![3mfa-setup][3]

5. The second possible one time dialog box allows you to select the details of your authentication method. The possible options are configured by your administrator.
![4mfa-verify-1][4]
 
6. The Azure Active Directory sends the confirming information to you. When you receive the verification code, enter it into the **Enter verification code** box, and click **Sign in**.
![5mfa-verify-2][5]

When verification is complete, SSMS connects normally presuming valid credentials and firewall access.

## See also
[Configure an Azure SQL Database server-level firewall rule using the Azure portal](sql-database-configure-firewall-settings.md)
[SQL Database Authentication and Authorization: Granting Access](sql-database-manage-logins.md)

[1]: ./media/sql-database-ssms-mfa-auth/1mfa-universal-connect.png
[2]: ./media/sql-database-ssms-mfa-auth/2mfa-sign-in.png
[3]: ./media/sql-database-ssms-mfa-auth/3mfa-setup.png
[4]: ./media/sql-database-ssms-mfa-auth/4mfa-verify-1.png
[5]: ./media/sql-database-ssms-mfa-auth/5mfa-verify-2.png

