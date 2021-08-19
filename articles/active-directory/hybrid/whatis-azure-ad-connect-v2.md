---
title: 'What is Azure AD Connect v2.0? | Microsoft Docs'
description: Learn about the next version of Azure AD Connect.
services: active-directory
author: billmath
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.topic: overview
ms.date: 06/24/2021
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Introduction to Azure AD Connect V2.0 

Azure AD Connect was released several years ago.  Since this time, several of the components that Azure AD Connect uses have been scheduled for deprecation and updated to newer versions.  To attempt to update all of these components individually would take time and planning.  

To address this, we wanted to bundle as many of these newer components into a new, single release, so you only have to update once. This release will be Azure AD Connect V2.0.  This is a new version of the same software used to accomplish your hybrid identity goals that is built using the latest foundational components. 

## What are the major changes? 

### SQL Server 2019 LocalDB 

The previous versions of Azure AD Connect shipped with a SQL Server 2012 LocalDB. V2.0 ships with a SQL Server 2019 LocalDB, which promises enhanced stability and performance and has several security-related bug fixes. SQL Server 2012 will go out of extended support in July 2022. For more information see [Microsoft SQL 2019](https://www.microsoft.com/sql-server/sql-server-2019).

### MSAL authentication library 

The previous versions of Azure AD Connect shipped with the ADAL authentication library. This library will be deprecated in June 2022. The V2.0 release ships with the newer MSAL library. For more information see [Overview of the MSAL library](../../active-directory/develop/msal-overview.md).

### Visual C++ Redist 14 

SQL Server 2019 requires the Visual C++ Redist 14 runtime, so we are updating the C++ runtime library to use this version. This will be installed with the Azure AD Connect V2.0 package, so you do not have to take any action for the C++ runtime update. 

### TLS 1.2 

TLS1.0 and TLS 1.1 are protocols that are deemed unsafe and are being deprecated by Microsoft. This release of Azure AD Connect will only support TLS 1.2. If your server does not support TLS 1.2 you will need to enable this before you can deploy Azure AD Connect V2.0. For more information, see [TLS 1.2 enforcement for Azure AD Connect](reference-connect-tls-enforcement.md).

### All binaries signed with SHA2 

We noticed that some components had SHA1 signed binaries. We no longer support SHA1 for downloadable binaries and we upgraded all binaries to SHA2 signing. The digital signatures are used to ensure that the updates come directly from Microsoft and were not tampered with during delivery. Because of weaknesses in the SHA-1 algorithm and to align to industry standards, we have changed the signing of Windows updates to use the more secure SHA-2 algorithm."  

There is no action needed from your side. 

### Windows Server 2012 and Windows Server 2012 R2 are no longer supported 

SQL Server 2019 requires Windows Server 2016 or newer as a server operating system. Since AAD Connect v2 contains SQL Server 2019 components, we no longer can support older Windows Server versions.  

You cannot install this version on an older Windows Server version. We suggest you upgrade your Azure AD Connect server to Windows Server 2019, which is the most recent version of the Windows Server operating system. 

This [article](/windows-server/get-started-19/install-upgrade-migrate-19) describes the upgrade from older Windows Server versions to Windows Server 2019. 

### PowerShell 5.0 

This release of Azure AD Connect contains several cmdlets that require PowerShell 5.0, so this requirement is a new prerequisite for Azure AD Connect.  

More details about PowerShell prerequisites can be found [here](/powershell/scripting/windows-powershell/install/windows-powershell-system-requirements?view=powershell-7.1#windows-powershell-50).

 >[!NOTE]
 >PowerShell 5 is already part of Windows Server 2016 so you probably do not have to take action as long as you are on a recent Window Server version. 

## What else do I need to know? 


**Why is this upgrade important for me?** </br>
Next year several of the components in your current Azure AD Connect server installations will go out of support. If you are using unsupported products, it will be harder for our support team to provide you with the support experience your organization requires. So we recommend all customers to upgrade to this newer version as soon as they can. 

This upgrade is especially important since we have had to update our prerequisites for Azure AD Connect and you may need additional time to plan and update your servers to the newer versions of these prerequisites 

**Is there any new functionality I need to know about?** </br>
No – this release does not contain any new functionality. This release only contains updates of some of the foundational components on Azure AD Connect. 

**Can I upgrade from any previous version to V2.0?** </br>
Yes – upgrades from any previous version of Azure AD Connect to Azure AD Connect V2.0 is supported. Please follow the guidance in this article to determine what is the best upgrade strategy for you. 

**Can I export the configuration of my current server and import it in Azure AD Connect V2.0?** </br>
Yes, you can do that, and it is a great way to migrate to Azure AD Connect V2.0 – especially if you are also upgrading to a new operating system version. You can read more about the Import/export configuration feature and how you can use it in this [article](how-to-connect-import-export-config.md). 

**I have enabled auto upgrade for Azure AD Connect – will I get this new version automatically?** </br> 
No – Azure AD Connect V2.0 will not be made available for auto upgrade at this time. 

**I am not ready to upgrade yet – how much time do I have?** </br>
You should upgrade to Azure AD Connect V2.0 as soon as you can. For the time being we will continue to support older versions of Azure AD Connect, but it may prove difficult to provide a good support experience if some of the components in Azure AD Connect have dropped out of support. This upgrade is particularly important for ADAL and TLS1.0/1.1 as these services might stop working unexpectedly after they are deprecated. 

**I use an external SQL database and do not use SQL 2012 LocalDb – do I still have to upgrade?** </br>
Yes, you still need to upgrade to remain in a supported state even if you do not use SQL Server 2012, due to the TLS1.0/1.1 and ADAL deprecation. 

**What happens if I do not upgrade?** </br>
Until one of the components that are being retired are actually deprecated, you will not see any impact. Azure AD Connect will keep on working. 

We expect TLS 1.0/1.1 to be deprecated in January 2022, and you need to make sure you are not using these protocols by that date as your service may stop working unexpectedly. You can manually configure your server for TLS 1.2 though, and that does not require an update of Azure AD Connect to V2.0 

In June 2022, ADAL will go out of support. When ADAL goes out of support authentication may stop working unexpectedly and this will block the Azure AD Connect server from working properly. We strongly advise you to upgrade to Azure AD Connect V2.0 before June 2022. You cannot upgrade to a supported authentication library with your current Azure AD Connect version. 

**After upgrading to 2.0 the ADSync PowerShell cmdlets do not work?** </br>
This is a known issue.  To resolve this, restart your PowerShell session after installing or upgrading to version 2.0 and then re-import the module.  Use the following instructions to import the module.
 
 1.  Open Windows PowerShell with administrative privileges
 2.  Type or copy and paste the following: 
    ``` powershell
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

This article describes the upgrade from older Windows Server versions to Windows Server 2019.