<properties
   pageTitle="Prerequisites for Azure AD Connect | Microsoft Azure"
   description="Article description that will be displayed on landing pages and in most search results"
   services="active-directory"
   documentationCenter=""
   authors="andkjell"
   manager="stevenpo"
   editor="curtand"/>

<tags
   ms.service="active-directory"
   ms.workload="identity"
   ms.tgt_pltfrm="na"
   ms.devlang="na"
   ms.topic="article"
   ms.date="09/29/2015"
   ms.author="andkjell;billmath"/>

# Prerequisites for Azure AD Connect
This topic describes the pre-requisites and the hardware requirements for Azure AD Connect.

## Before you install Azure AD Connect
Before you install Azure AD Connect, there are a few things that you will need.

- An Azure subscription or an [Azure trial subscription](http://azure.microsoft.com/pricing/free-trial/) - This is only required for accessing the Azure portal and not for using Azure AD Connect.  If you are using PowerShell or Office 365 you do not need an Azure subscription to use Azure AD Connect. If you have an Office 365 license you can also use the Office 365 portal. With a paid Office 365 license you can also get into the Azure portal from the Office 365 portal.
- An Azure AD Global Administrator account for the Azure AD directory you wish to integrate with.
- An Enterprise Administrator account for your local Active Directory if you use express settings.
- Azure AD Connect must be installed on Windows Server 2008 or later.  This server may be a domain controller or a member server if using express settings. If you use custom settings, the server can also be stand-alone and does not have to be joined to a domain.
- The AD schema version and forest functional level must be Windows Server 2003 or later. The domain controllers can run any version as long as the schema and forest level requirements are met.
- If Active Directory Federation Services is being deployed, the servers where AD FS will be installed must be Windows Server 2012 R2 or later.
- Azure AD Connect requires a SQL Server database to store identity data. By default a SQL  Server 2012 Express LocalDB (a light version of SQL Server Express) is installed and the service account for the service is created on the local machine. SQL Server Express has a 10GB size limit that enables you to manage approximately 100.000 objects.
- If you need to manage a higher volume of directory objects, you need to point the installation process to a different version of SQL Server.
Azure AD Connect supports all flavors of Microsoft SQL Server from SQL Server 2008 (with SP4) to SQL Server 2014.
- If you are using an outbound proxy for connecting to the Internet, the following setting in the **C:\Windows\Microsoft.NET\Framework64\v4.0.30319\Config\machine.config** file must be added for the installation wizard and Azure AD sync to be able to connect to the Internet and Azure AD.

```
    <system.net>
        <defaultProxy>
            <proxy
            usesystemdefault="true"
            proxyaddress="http://<PROXYADDRESS>:<PROXYPORT>"
            bypassonlocal="true"
            />
        </defaultProxy>
    </system.net>
```

This text must be entered at the bottom of the file.  In this code, &lt;PROXYADRESS&gt; represents the actual proxy IP address or host name.

- Optional:  A test user account to verify synchronization.

## Component prerequisites

Azure AD Connect depends on PowerShell and .Net 4.5.1. Depending on your Windows Server version, do the following:


- Windows Server 2012R2
  - PowerShell is installed by default, no action is required.
  - .Net 4.5.1 and later are offered through Windows Update. Make sure you have installed the latest updates to Windows Server in the Control Panel.
- Windows Server 2008R2 and Windows Server 2012
  - The latest version of PowerShell is available in **Windows Management Framework 4.0**, available on [Microsoft Download Center](http://www.microsoft.com/downloads).
  - .Net 4.5.1 and later releases are available on [Microsoft Download Center](http://www.microsoft.com/downloads).
- Windows Server 2008
  - The latest supported version of PowerShell is available in **Windows Management Framework 3.0**, available on [Microsoft Download Center](http://www.microsoft.com/downloads).
 - .Net 4.5.1 and later releases are available on [Microsoft Download Center](http://www.microsoft.com/downloads).

## Azure AD Connect supporting components

The following is a list of pre-requisites and supporting components that Azure AD Connect will install on the server that you set Azure AD Connect up on. This list is for a basic Express installation.  If you choose to use a different SQL Server on the Install synchronization services page, the SQL Server 2012 components listed below are not installed.

- Microsoft SQL Server 2012 Command Line Utilities
- Microsoft SQL Server 2012 Native Client
- Microsoft SQL Server 2012 Express LocalDB
- Azure Active Directory Module for Windows PowerShell
- Microsoft Online Services Sign-In Assistant for IT Professionals
- Microsoft Visual C++ 2013 Redistribution Package


## Hardware requirements for Azure AD Connect
The table below shows the minimum requirements for the Azure AD Connect computer.

| Number of objects in Active Directory | CPU | Memory | Hard drive size |
| ------------------------------------- | --- | ------ | --------------- |
| Fewer than 10,000 | 1.6 GHz | 4 GB | 70 GB |
| 10,000–50,000 | 1.6 GHz | 4 GB | 70 GB |
| 50,000–100,000 | 1.6 GHz | 16 GB | 100 GB |
| For 100,000 or more objects the full version of SQL Server is required|  |  |  |
| 100,000–300,000 | 1.6 GHz | 32 GB | 300 GB |
| 300,000–600,000 | 1.6 GHz | 32 GB | 450 GB |
| More than 600,000 | 1.6 GHz | 32 GB | 500 GB |


For Custom options such as multiple forests or federated sign on, find out about additional requirements [here.](active-directory-aadconnect-get-started-custom.md)

## Next steps
Learn more about [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md).
