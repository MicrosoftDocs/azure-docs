<properties 
	pageTitle="Azure AD Connect - Upgrade from DirSync" 
	description="Learn how to upgrade from DirSync to Azure AD Connect." 
	services="active-directory" 
	documentationCenter="" 
	authors="shoatman" 
	manager="kbrint" 
	editor="billmath"/>

<tags 
	ms.service="azure-active-directory-connect" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/02/2015" 
	ms.author="shoatman"/>

# Upgrading DirSycn to Azure Active Director Connect

The following documentation will help you upgrade your existing DirSync installation to Azure AD Connect

## Download Azure AD Connect

To get started using Azure AD Connect you can download the latest version using the following:  [Download Azure AD Connect Public Preview](http://connect.microsoft.com/site1164/program8612) 

## Before you install Azure AD Connect
Before you install Azure AD Connect, and upgrade from DirSync here are a few things you will need.  

- The password of the existing global administrator account for your Azure AD instance (The install will remind you which account this is)
- An Enterprise Administrator account for your local Active Directory
- Optional: If you configured DirSync to use a full version of SQL Server - The information for that database instance.

### Parallel install

If you are currently synchronizing more than 50K objects then you will be given an option to perform a parallel install.  Parallel install requires a separate server or set of servers (if you require a separate server for SQL Server).  The benefit of parallel install is the opportunity to avoid synchronization downtime.  The Azure AD Connect installation will attempt to estimate the downtime that we expect, but if you've upgraded DirSync in the past your own experience is likely to be the best guide possible.

## Installing Azure AD Connect

Download Azure AD Connect and copy to your existing DirSync server.  

1. Navigate to and double-click on AzureADConnect.msi
2. Begin stepping through the wizard

For in-place upgrade the following high level steps occur:

1. Welcome to Azure AD Connect
2. Analysis of current DirSync Configuration
3. Collect Azure AD global admin password
4. Collect credentials for an enterprise admin account (only used during the installation of AAD Connect)
5. Installation of AAD Connect
    * Unintall DirSync
	* Install AAD Connect
	* Optionally begin Synchronization

Additional steps/information is required when:

* You're currently using Full SQL Server - Local or Remote
* You have more than 50K objects in scope for synchronization

## In-place upgrade - less than 50K objects - SQL Express (Walkthrough)

1. Review and agree to license terms and privacy notice.
<center>![Welcome to Azure AD](./media/active-directory-aadconnect-dirsync-upgrade-get-started/welcome.png)</center>

2. Click next to be analysis of your existing DirSync installation
<center>![Analyzing existing Directory Sync installation](./media/active-directory-aadconnect-dirsync-upgrade-get-started/analyze.png)</center>

3. When the analysis completes we will make recommendations on how to proceed.  In this scenario (less than 50K objects using SQL Express) the following screen is displayed.
<center>![Analysis completed ready to upgrade from DirSync](./media/active-directory-aadconnect-dirsync-upgrade-get-started/analysisready.png)</center>

4. Provide the password for the account you currently use to connect to Azure AD.
<center>![Enter your Azure AD credentials](./media/active-directory-aadconnect-dirsync-upgrade-get-started/connectToAzureAD.png)</center>

5. Provide an enterprise admin account for Active Directory.
<center>![Enter your Azure AD credentials](./media/active-directory-aadconnect-dirsync-upgrade-get-started/connecttoadds.png)</center>

## Azure AD Connect supporting components

The following is a list of per-requisites and supporting components that Azure AD Connect will install on the server that you set Azure AD Connect up on.  This list is for a basic Express installation.  If you choose to use a different SQL Server on the Install synchronization services page then, the SQL Server 2012 components listed below are not installed. 

- Forefront Identity Manager Azure Active Directory Connector
- Microsoft SQL Server 2012 Command Line Utilities
- Microsoft SQL Server 2012 Native Client
- Microsoft SQL Server 2012 Express LocalDB
- Azure Active Directory Module for Windows PowerShell
- Microsoft Online Services Sign-In Assistant for IT Professionals
- Microsoft Visual C++ 2013 Redistribution Package


**Additional Resources**

* [Use your on-premises identity infrastructure in the cloud](active-directory-aadconnect.md)
* [How Azure AD Connect works](active-directory-aadconnect-how-it-works.md)
* [Whats Next with Azure AD Connect](active-directory-aadconnect-whats-next.md)
* [Learn More](active-directory-aadconnect-learn-more.md)
* [Azure AD Connect on MSDN](https://msdn.microsoft.com/library/azure/dn832695.aspx)
