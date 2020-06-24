---
title: 'Azure AD Connect: Prerequisites and hardware | Microsoft Docs'
description: This topic describes the pre-requisites and the hardware requirements for Azure AD Connect
services: active-directory
documentationcenter: ''
author: billmath
manager: daveba
editor: ''
ms.assetid: 91b88fda-bca6-49a8-898f-8d906a661f07
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.date: 02/27/2020
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---
# Prerequisites for Azure AD Connect
This topic describes the pre-requisites and the hardware requirements for Azure AD Connect.

## Before you install Azure AD Connect
Before you install Azure AD Connect, there are a few things that you need.

### Azure AD
* An Azure AD tenant. You get one with an [Azure free trial](https://azure.microsoft.com/pricing/free-trial/). You can use one of the following portals to manage Azure AD Connect:
  * The [Azure portal](https://portal.azure.com).
  * The [Office portal](https://portal.office.com).  
* [Add and verify the domain](../active-directory-domains-add-azure-portal.md) you plan to use in Azure AD. For example, if you plan to use contoso.com for your users then make sure this domain has been verified and you are not only using the contoso.onmicrosoft.com default domain.
* An Azure AD tenant allows by default 50k objects. When you verify your domain, the limit is increased to 300k objects. If you need even more objects in Azure AD, then you need to open a support case to have the limit increased even further. If you need more than 500k objects, then you need a license, such as Office 365, Azure AD Basic, Azure AD Premium, or Enterprise Mobility and Security.

### Prepare your on-premises data
* Use [IdFix](https://support.office.com/article/Install-and-run-the-Office-365-IdFix-tool-f4bd2439-3e41-4169-99f6-3fabdfa326ac) to identify errors such as duplicates and formatting problems in your directory before you synchronize to Azure AD and Office 365.
* Review [optional sync features you can enable in Azure AD](how-to-connect-syncservice-features.md) and evaluate which features you should enable.

### On-premises Active Directory
* The AD schema version and forest functional level must be Windows Server 2003 or later. The domain controllers can run any version as long as the schema and forest level requirements are met.
* If you plan to use the feature **password writeback**, then the Domain Controllers must be on Windows Server 2008 R2 or later.
* The domain controller used by Azure AD must be writable. It is **not supported** to use a RODC (read-only domain controller) and Azure AD Connect does not follow any write redirects.
* It is **not supported** to use on-premises forests/domains using "dotted" (name contains a period ".") NetBios names.
* It is recommended to [enable the Active Directory recycle bin](how-to-connect-sync-recycle-bin.md).

### Azure AD Connect server
>[!IMPORTANT]
>The Azure AD Connect server contains critical identity data and should be treated as a Tier 0 component as documented in [the Active Directory administrative tier model](https://docs.microsoft.com/windows-server/identity/securing-privileged-access/securing-privileged-access-reference-material)

* Azure AD Connect cannot be installed on Small Business Server or Windows Server Essentials before 2019 (Windows Server Essentials 2019 is supported). The server must be using Windows Server standard or better.
* Installing Azure AD Connect on a Domain Controller is not recommended due to security practices and more restrictive settings that can prevent Azure AD Connect from installing correctly.
* The Azure AD Connect server must have a full GUI installed. It is **not supported** to install on server core.
>[!IMPORTANT]
>Installing Azure AD Connect on small business server, server essentials, or server core is not supported.

* Azure AD Connect must be installed on Windows Server 2012 or later. This server must be domain joined and may be a domain controller or a member server.
* The Azure AD Connect server must not have PowerShell Transcription Group Policy enabled if you are using Azure AD Connect wizard to manage ADFS configuration. You can enable PowerShell transcription if you are using Azure AD Connect wizard to manage sync configuration.
* If Active Directory Federation Services is being deployed, the servers where AD FS or Web Application Proxy are installed must be Windows Server 2012 R2 or later. [Windows remote management](#windows-remote-management) must be enabled on these servers for remote installation.
* If Active Directory Federation Services is being deployed, you need [TLS/SSL Certificates](#tlsssl-certificate-requirements).
* If Active Directory Federation Services is being deployed, then you need to configure [name resolution](#name-resolution-for-federation-servers).
* If your global administrators have MFA enabled, then the URL **https://secure.aadcdn.microsoftonline-p.com** must be in the trusted sites list. You are prompted to add this site to the trusted sites list when you are prompted for an MFA challenge and it has not added before. You can use Internet Explorer to add it to your trusted sites.
* Microsoft recommends hardening your Azure AD Connect server to decrease the security attack surface for this critical component of your IT environment.  Following the recommendations below will decrease the security risks to your organization.

* Deploy Azure AD Connect on a domain joined server and restrict administrative access to domain administrators or other tightly controlled security groups.

To learn more, see: 

* [Securing administrators groups](https://docs.microsoft.com/windows-server/identity/ad-ds/plan/security-best-practices/appendix-g--securing-administrators-groups-in-active-directory)

* [Securing built-in administrator accounts](https://docs.microsoft.com/windows-server/identity/ad-ds/plan/security-best-practices/appendix-d--securing-built-in-administrator-accounts-in-active-directory)

* [Security improvement and sustainment by reducing attack surfaces](https://docs.microsoft.com/windows-server/identity/securing-privileged-access/securing-privileged-access#2-reduce-attack-surfaces )

* [Reducing the Active Directory attack surface](https://docs.microsoft.com/windows-server/identity/ad-ds/plan/security-best-practices/reducing-the-active-directory-attack-surface)

### SQL Server used by Azure AD Connect
* Azure AD Connect requires a SQL Server database to store identity data. By default a SQL Server 2012 Express LocalDB (a light version of SQL Server Express) is installed. SQL Server Express has a 10GB size limit that enables you to manage approximately 100,000 objects. If you need to manage a higher volume of directory objects, you need to point the installation wizard to a different installation of SQL Server. The type of SQL Server installation can impact the [performance of Azure AD Connect](https://docs.microsoft.com/azure/active-directory/hybrid/plan-connect-performance-factors#sql-database-factors).
* If you use a different installation of SQL Server, then these requirements apply:
  * Azure AD Connect supports all versions of Microsoft SQL Server from 2012 (with latest Service Pack) to SQL Server 2019. Microsoft Azure SQL Database is **not supported** as a database.
  * You must use a case-insensitive SQL collation. These collations are identified with a \_CI_ in their name. It is **not supported** to use a case-sensitive collation, identified by \_CS_ in their name.
  * You can only have one sync engine per SQL instance. It is **not supported** to share a SQL instance with FIM/MIM Sync, DirSync, or Azure AD Sync.

### Accounts
* An Azure AD Global Administrator account for the Azure AD tenant you wish to integrate with. This account must be a **school or organization account** and cannot be a **Microsoft account**.
* If you use [express settings](reference-connect-accounts-permissions.md#express-settings-installation) or upgrade from DirSync, then you must have an Enterprise Administrator account for your on-premises Active Directory.
* If you use the custom settings installation path then you have more options. For more information, see [Custom installation settings](reference-connect-accounts-permissions.md#custom-installation-settings).

### Connectivity
* The Azure AD Connect server needs DNS resolution for both intranet and internet. The DNS server must be able to resolve names both to your on-premises Active Directory and the Azure AD endpoints.
* If you have firewalls on your Intranet and you need to open ports between the Azure AD Connect servers and your domain controllers, then see [Azure AD Connect Ports](reference-connect-ports.md) for more information.
* If your proxy or firewall limit which URLs can be accessed, then the URLs documented in [Office 365 URLs and IP address ranges](https://support.office.com/article/Office-365-URLs-and-IP-address-ranges-8548a211-3fe7-47cb-abb1-355ea5aa88a2) must be opened.
  * If you are using the Microsoft Cloud in Germany or the Microsoft Azure Government cloud, then see [Azure AD Connect sync service instances considerations](reference-connect-instances.md) for URLs.
* Azure AD Connect (version 1.1.614.0 and after) by default uses TLS 1.2 for encrypting communication between the sync engine and Azure AD. If TLS 1.2 isn't available on the underlying operating system, Azure AD Connect incrementally falls back to older protocols (TLS 1.1 and TLS 1.0).
* Prior to version 1.1.614.0, Azure AD Connect by default uses TLS 1.0 for encrypting communication between the sync engine and Azure AD. To change to TLS 1.2, follow the steps in [Enable TLS 1.2 for Azure AD Connect](#enable-tls-12-for-azure-ad-connect).
* If you are using an outbound proxy for connecting to the Internet, the following setting in the **C:\Windows\Microsoft.NET\Framework64\v4.0.30319\Config\machine.config** file must be added for the installation wizard and Azure AD Connect sync to be able to connect to the Internet and Azure AD. This text must be entered at the bottom of the file. In this code, &lt;PROXYADDRESS&gt; represents the actual proxy IP address or host name.

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

* If your proxy server requires authentication, then the [service account](reference-connect-accounts-permissions.md#adsync-service-account) must be located in the domain and you must use the customized settings installation path to specify a [custom service account](how-to-connect-install-custom.md#install-required-components). You also need a different change to machine.config. With this change in machine.config, the installation wizard and sync engine respond to authentication requests from the proxy server. In all installation wizard pages, excluding the **Configure** page, the signed in user's credentials are used. On the **Configure** page at the end of the installation wizard, the context is switched to the [service account](reference-connect-accounts-permissions.md#adsync-service-account) that was created by you. The machine.config section should look like this.

```
    <system.net>
        <defaultProxy enabled="true" useDefaultCredentials="true">
            <proxy
            usesystemdefault="true"
            proxyaddress="http://<PROXYADDRESS>:<PROXYPORT>"
            bypassonlocal="true"
            />
        </defaultProxy>
    </system.net>
```

* When Azure AD Connect sends a web request to Azure AD as part of directory synchronization, Azure AD can take up to 5 minutes to respond. It is common for proxy servers to have connection idle timeout configuration. Please ensure the configuration is set to at least 6 minutes or more.

For more information, see MSDN about the [default proxy Element](https://msdn.microsoft.com/library/kd3cf2ex.aspx).  
For more information when you have problems with connectivity, see [Troubleshoot connectivity problems](tshoot-connect-connectivity.md).

### Other
* Optional: A test user account to verify synchronization.

## Component prerequisites
### PowerShell and .NET Framework
Azure AD Connect depends on Microsoft PowerShell and .NET Framework 4.5.1. You need this version or a later version installed on your server. Depending on your Windows Server version, do the following:

* Windows Server 2012R2
  * Microsoft PowerShell is installed by default. No action is required.
  * .NET Framework 4.5.1 and later releases are offered through Windows Update. Make sure you have installed the latest updates to Windows Server in the Control Panel.
* Windows Server 2012
  * The latest version of Microsoft PowerShell is available in **Windows Management Framework 4.0**, available on [Microsoft Download Center](https://www.microsoft.com/downloads).
  * .NET Framework 4.5.1 and later releases are available on [Microsoft Download Center](https://www.microsoft.com/downloads).


### Enable TLS 1.2 for Azure AD Connect
Prior to version 1.1.614.0, Azure AD Connect by default uses TLS 1.0 for encrypting the communication between the sync engine server and Azure AD. You can change this by configuring .NET applications to use TLS 1.2 by default on the server. More information about TLS 1.2 can be found in [Microsoft Security Advisory 2960358](https://technet.microsoft.com/security/advisory/2960358).

1.  Make sure you have the .NET 4.5.1 hotfix installed for your operating system, see [Microsoft Security Advisory 2960358](https://technet.microsoft.com/security/advisory/2960358). You might have this hotfix or a later release installed on your server already.
    ```
2. For all operating systems, set this registry key and restart the server.
    ```
    HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\.NETFramework\v4.0.30319
    "SchUseStrongCrypto"=dword:00000001
    ```
4. If you also want to enable TLS 1.2 between the sync engine server and a remote SQL Server, then make sure you have the required versions installed for [TLS 1.2 support for Microsoft SQL Server](https://support.microsoft.com/kb/3135244).

## Prerequisites for federation installation and configuration
### Windows Remote Management
When using Azure AD Connect to deploy Active Directory Federation Services or the Web Application Proxy, check these requirements:

* If the target server is domain joined, then ensure that Windows Remote Managed is enabled
  * In an elevated PowerShell command window, use command `Enable-PSRemoting –force`
* If the target server is a non-domain joined WAP machine, then there are a couple of additional requirements
  * On the target machine (WAP machine):
    * Ensure the winrm (Windows Remote Management / WS-Management) service is running via the Services snap-in
    * In an elevated PowerShell command window, use command `Enable-PSRemoting –force`
  * On the machine on which the wizard is running (if the target machine is non-domain joined or untrusted domain):
    * In an elevated PowerShell command window, use the command `Set-Item WSMan:\localhost\Client\TrustedHosts –Value <DMZServerFQDN> -Force –Concatenate`
    * In Server Manager:
      * add DMZ WAP host to machine pool (server manager -> Manage -> Add Servers...use DNS tab)
      * Server Manager All Servers tab: right click WAP server and choose Manage As..., enter local (not domain) creds for the WAP machine
      * To validate remote PowerShell connectivity, in the Server Manager All Servers tab: right click WAP server and choose Windows PowerShell. A remote PowerShell session should open to ensure remote PowerShell sessions can be established.

### TLS/SSL Certificate Requirements
* It's strongly recommended to use the same TLS/SSL certificate across all nodes of your AD FS farm and all Web Application proxy servers.
* The certificate must be an X509 certificate.
* You can use a self-signed certificate on federation servers in a test lab environment. However, for a production environment, we recommend that you obtain the certificate from a public CA.
  * If using a certificate that is not publicly trusted, ensure that the certificate installed on each Web Application Proxy server is trusted on both the local server and on all federation servers
* The identity of the certificate must match the federation service name (for example, sts.contoso.com).
  * The identity is either a subject alternative name (SAN) extension of type dNSName or, if there are no SAN entries, the subject name specified as a common name.  
  * Multiple SAN entries can be present in the certificate, provided one of them matches the federation service name.
  * If you are planning to use Workplace Join, an additional SAN is required with the value **enterpriseregistration.** followed by the User Principal Name (UPN) suffix of your organization, for example, **enterpriseregistration.contoso.com**.
* Certificates based on CryptoAPI next generation (CNG) keys and key storage providers are not supported. This means you must use a certificate based on a CSP (cryptographic service provider) and not a KSP (key storage provider).
* Wild-card certificates are supported.

### Name resolution for federation servers
* Set up DNS records for the AD FS federation service name (for example sts.contoso.com) for both the intranet (your internal DNS server) and the extranet (public DNS through your domain registrar). For the intranet DNS record, ensure that you use A records and not CNAME records. This is required for windows authentication to work correctly from your domain joined machine.
* If you are deploying more than one AD FS server or Web Application Proxy server, then ensure that you have configured your load balancer and that the DNS records for the AD FS federation service name (for example sts.contoso.com) point to the load balancer.
* For windows integrated authentication to work for browser applications using Internet Explorer in your intranet, ensure that the AD FS federation service name (for example sts.contoso.com) is added to the intranet zone in IE. This can be controlled via group policy and deployed to all your domain joined computers.

## Azure AD Connect supporting components
The following is a list of components that Azure AD Connect installs on the server where Azure AD Connect is installed. This list is for a basic Express installation. If you choose to use a different SQL Server on the Install synchronization services page, then SQL Express LocalDB is not installed locally.

* Azure AD Connect Health
* Microsoft SQL Server 2012 Command Line Utilities
* Microsoft SQL Server 2012 Express LocalDB
* Microsoft SQL Server 2012 Native Client
* Microsoft Visual C++ 2013 Redistribution Package

## Hardware requirements for Azure AD Connect
The table below shows the minimum requirements for the Azure AD Connect sync computer.

| Number of objects in Active Directory | CPU | Memory | Hard drive size |
| --- | --- | --- | --- |
| Fewer than 10,000 |1.6 GHz |4 GB |70 GB |
| 10,000–50,000 |1.6 GHz |4 GB |70 GB |
| 50,000–100,000 |1.6 GHz |16 GB |100 GB |
| For 100,000 or more objects the full version of SQL Server is required | | | |
| 100,000–300,000 |1.6 GHz |32 GB |300 GB |
| 300,000–600,000 |1.6 GHz |32 GB |450 GB |
| More than 600,000 |1.6 GHz |32 GB |500 GB |

The minimum requirements for computers running AD FS or Web Application Proxy Servers is the following:

* CPU: Dual core 1.6 GHz or higher
* MEMORY: 2 GB or higher
* Azure VM: A2 configuration or higher

## Next steps
Learn more about [Integrating your on-premises identities with Azure Active Directory](whatis-hybrid-identity.md).
