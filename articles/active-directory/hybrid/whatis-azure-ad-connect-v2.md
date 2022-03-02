---
title: 'What is Azure AD Connect V2.0? | Microsoft Docs'
description: Learn about the next version of Azure AD Connect.
services: active-directory
author: billmath
manager: karenhoran
ms.service: active-directory
ms.workload: identity
ms.topic: overview
ms.date: 09/22/2021
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management, has-adal-ref
---

# Introduction to Azure AD Connect V2.0 

The first version of Azure Active Directory (Azure AD) Connect was released several years ago. Since then, we've scheduled several components of Azure AD Connect for deprecation and updates to newer versions. 

To update all these components individually requires a lot of time and planning. To address this drawback, we've bundled as many of these newer components into a new, single release, so you have to update Azure AD Connect only once. This release, Azure AD Connect V2.0, is the same software you're already using to accomplish your hybrid identity goals, but it's updated with the latest foundational components. 

## What are the major changes? 

### SQL Server 2019 LocalDB 

Earlier versions of Azure AD Connect shipped with the SQL Server 2012 LocalDB feature. V2.0 ships with SQL Server 2019 LocalDB, which promises enhanced stability and performance and has several security-related bug fixes. In July 2022, SQL Server 2012 will no longer have extended support. For more information, see [Microsoft SQL 2019](https://www.microsoft.com/sql-server/sql-server-2019).

### MSAL authentication library 

Earlier versions of Azure AD Connect shipped with the Azure Active Directory Authentication Library (ADAL). This library will be deprecated in June 2022. The Azure AD Connect V2.0 release ships with the newer Microsoft Authentication Library (MSAL). For more information, see [Overview of the MSAL library](../../active-directory/develop/msal-overview.md).

### Visual C++ Redistributable 14 runtime 

SQL Server 2019 requires the Visual C++ Redistributable 14 runtime, so we have updated the C++ runtime library to use this version. This library is installed with the Azure AD Connect V2.0 package, so you don't have to take any action to get the C++ runtime update. 

### TLS 1.2 

The Transport Layer Security (TLS) 1.0 and TLS 1.1 protocols are deemed unsafe and are being deprecated by Microsoft. Azure AD Connect V2.0 supports only TLS 1.2. All versions of Windows Server that are supported for Azure AD Connect V2.0 already default to TLS 1.2. If your server doesn't support TLS 1.2, you need to enable it before you can deploy Azure AD Connect V2.0. For more information, see [TLS 1.2 enforcement for Azure AD Connect](reference-connect-tls-enforcement.md).

### All binaries signed with SHA-2 

We noticed that some components have Secure Hash Algorithm 1 (SHA-1) signed binaries. We no longer support SHA-1 for downloadable binaries, and we've upgraded all binaries to SHA-2 signing. The digital signatures are used to ensure that the updates come directly from Microsoft and aren't tampered with during delivery. Because of weaknesses in the SHA-1 algorithm, and to align with industry standards, we've changed the signing of Windows updates to use the more secure SHA-2 algorithm.  

No action is required of you at this time. 

### Windows Server 2012 and 2012 R2 are no longer supported 

SQL Server 2019 requires Windows Server 2016 or later as a server operating system. Because Azure AD Connect V2.0 contains SQL Server 2019 components, we no longer support earlier Windows Server versions. 

You can't install this version on earlier Windows Server versions. We suggest that you upgrade your Azure AD Connect server to Windows Server 2019, which is the most recent version of the Windows Server operating system. 

For more information about upgrading from earlier Windows Server versions to Windows Server 2019, see [Install, upgrade, or migrate to Windows Server](/windows-server/get-started-19/install-upgrade-migrate-19). 

### PowerShell 5.0 

The Azure AD Connect V2.0 release contains several cmdlets that require PowerShell 5.0 or later, so this requirement is a new prerequisite for Azure AD Connect. 

For more information, see [Windows PowerShell System Requirements](/powershell/scripting/windows-powershell/install/windows-powershell-system-requirements#windows-powershell-50).

 >[!NOTE]
 >PowerShell 5.0 is already part of Windows Server 2016, so you probably don't have to take action as long as you're using a recent Window Server version. 

## What else do I need to know? 

**Why is this upgrade important for me?** </br>
Next year, several components in your current Azure AD Connect server installations will go out of support. If you're using unsupported products, it will be harder for our support team to provide you with the support experience your organization requires. We recommend that you upgrade to this newer version as soon as possible. 

This upgrade is especially important, because we've had to update our prerequisites for Azure AD Connect. You might need additional time to plan and update your servers to the newest versions of the prerequisites. 

**Is there any new functionality I need to know about?** </br>
No, this release doesn't contain new functionality. It only updates some of the foundational components on Azure AD Connect. 

**Can I upgrade from earlier versions to V2.0?** </br>
Yes, upgrading from earlier versions of Azure AD Connect to Azure AD Connect V2.0 is supported. To determine your best strategy, see [Azure AD Connect: Upgrade from a previous version to the latest](how-to-upgrade-previous-version.md). 

**Can I export the configuration of my current server and import it in Azure AD Connect V2.0?** </br>
Yes, and it's a great way to migrate to Azure AD Connect V2.0, especially if you're also upgrading to a new operating system version. For more information, see [Import and export Azure AD Connect configuration settings](how-to-connect-import-export-config.md). 

**I have enabled auto upgrade for Azure AD Connect. Will I get this new version automatically?** </br> 
No, Azure AD Connect V2.0 isn't available for auto upgrade at this time. 

**I am not ready to upgrade yet. How much time do I have?** </br>
All Azure AD Connect V1 versions will be retired on August 31, 2022, so you should upgrade to Azure AD Connect V2.0 as soon as you can. For the time being, we'll continue to support earlier versions of Azure AD Connect, but it might be difficult to provide a good support experience if some Azure AD Connect components are no longer supported. This upgrade is particularly important for ADAL and TLS 1.0/1.1, because these services might stop working unexpectedly after they're deprecated. 

**I use an external SQL database and do not use SQL 2012 LocalDB. Do I still have to upgrade?** </br>
Yes, you need to upgrade to remain in a supported state, even if you don't use SQL Server 2012, because of the TLS 1.0/1.1 and ADAL deprecation. Note that SQL Server 2012 can still be used as an external SQL database with Azure AD Connect V2.0. The SQL 2019 drivers in Azure AD Connect V2.0 are compatible with SQL Server 2012.

**After the upgrade of my Azure AD Connect instance to V2.0, will the SQL 2012 components automatically get uninstalled?** </br>
No, the upgrade to SQL 2019 doesn't remove any SQL 2012 components from your server. If you no longer need these components, follow the instructions in [Uninstall an existing instance of SQL Server](/sql/sql-server/install/uninstall-an-existing-instance-of-sql-server-setup).

**What happens if I don't upgrade?** </br>
Until a component that's being retired is actually deprecated, your current version of Azure AD Connect will keep working and you won't see any impact. 

We expect TLS 1.0/1.1 to be deprecated in January 2022. You need to make sure that you're no longer using these protocols by that date, because your service might stop working unexpectedly. You can manually configure your server for TLS 1.2, though, which doesn't require an upgrade to Azure AD Connect V2.0. 

In June 2022, ADAL will no longer be supported. At that time, authentication might stop working unexpectedly, and the Azure AD Connect server won't work properly. We strongly recommend that you upgrade to Azure AD Connect V2.0 before June 2022. You can't upgrade to a supported authentication library with your current Azure AD Connect version. 

**After I upgraded to Azure AD Connect V2.0, the ADSync PowerShell cmdlets don't work. What can I do?** </br>
This is a known issue. To resolve this, restart your PowerShell session after you install or upgrade to Azure AD Connect V2.0, and then reimport the module. To import the module, do the following:
 
 1. Open Windows PowerShell with administrative privileges.
 1. Run the following command: 
 
     ```powershell
     Import-module -Name "C:\Program Files\Microsoft Azure AD Sync\Bin\ADSync"
     ```

## License requirements for using Azure AD Connect V2.0

[!INCLUDE [active-directory-free-license.md](../../../includes/active-directory-free-license.md)]

## License requirements for using Azure AD Connect Health
[!INCLUDE [active-directory-free-license.md](../../../includes/active-directory-p1-license.md)]

## Next steps

- [Hardware and prerequisites](how-to-connect-install-prerequisites.md) 
- [Express settings](how-to-connect-install-express.md)
- [Customized settings](how-to-connect-install-custom.md)
