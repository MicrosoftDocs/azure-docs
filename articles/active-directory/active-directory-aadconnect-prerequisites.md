<properties
   pageTitle="Azure AD Connect: Prerequisites and hardware | Microsoft Azure"
   description="This topic describes the pre-requisites and the hardware requirements for Azure AD Connect"
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
   ms.date="06/27/2016"
   ms.author="andkjell;billmath"/>

# Prerequisites for Azure AD Connect
This topic describes the pre-requisites and the hardware requirements for Azure AD Connect.

## Before you install Azure AD Connect
Before you install Azure AD Connect, there are a few things that you will need.

### Azure AD
- An Azure subscription or an [Azure trial subscription](https://azure.microsoft.com/pricing/free-trial/). This is only required for accessing the Azure portal and not for using Azure AD Connect.  If you are using PowerShell or Office 365 you do not need an Azure subscription to use Azure AD Connect. If you have an Office 365 license you can also use the Office 365 portal. With a paid Office 365 license you can also get into the Azure portal from the Office 365 portal.
- [Add and verify the domain](active-directory-add-domain.md) you plan to use in Azure AD. For example if you plan to use contoso.com for your users then make sure this domain has been verified and you are not only using the contoso.onmicrosoft.com default domain.
- An Azure AD directory will by default allow 50k objects. When you verify your domain the limit will be increased to 300k objects. If you need even more objects in Azure AD you need to open a support case to have the limit increased even further. If you need more than 500k objects, you will need a license such as Office 365, Azure AD Basic, Azure AD Premium, or Enterprise Mobility Suite.

### Prepare your on-premises data
- Review [optional sync features you can enable in Azure AD](active-directory-aadconnectsyncservice-features.md) and evaluate which features you should enable.

### On-premises servers and environment
- The AD schema version and forest functional level must be Windows Server 2003 or later. The domain controllers can run any version as long as the schema and forest level requirements are met.
- If you plan to use the feature **password writeback** the Domain Controllers must be on Windows Server 2008 (with latest SP) or later. If your DCs are on 2008 (pre-R2) then you must also apply [hotfix KB2386717](http://support.microsoft.com/kb/2386717).
- The domain controller used by Azure AD must be writable. It is not supported to use a RODC (read-only domain controller) and Azure AD Connect will not follow any write redirects.
- Azure AD Connect cannot be installed on Small Business Server or Windows Server Essentials. The server must be using Windows Server standard or better.
- Azure AD Connect must be installed on Windows Server 2008 or later.  This server may be a domain controller or a member server if using express settings. If you use custom settings, the server can also be stand-alone and does not have to be joined to a domain.
- If you install Azure AD Connect on Windows Server 2008, make sure to apply the latest hotfixes from Windows Update. The installation will not be able to start with an unpatched server.
- If you plan to use the feature **password synchronization**, the Azure AD Connect server must be on Windows Server 2008 R2 SP1 or later.
- The Azure AD Connect server must have [.NET Framework 4.5.1](#component-prerequisites) or later and [Microsoft PowerShell 3.0](#component-prerequisites) or later installed.
- If Active Directory Federation Services is being deployed, the servers where AD FS or Web Application Proxy will be installed must be Windows Server 2012 R2 or later. [Windows remote management](#windows-remote-management) must be enabled on these servers for remote installation.
- If Active Directory Federation Services is being deployed, you need [SSL Certificates](#ssl-certificate-requirements).
- If Active Directory Federation Services is being deployed, then you need to configure [name resolution](#name-resolution-for-federation-servers).
- Azure AD Connect requires a SQL Server database to store identity data. By default a SQL Server 2012 Express LocalDB (a light version of SQL Server Express) is installed and the service account for the service is created on the local machine. SQL Server Express has a 10GB size limit that enables you to manage approximately 100,000 objects. If you need to manage a higher volume of directory objects, you need to point the installation wizard to a different installation of SQL Server.
- If you use a separate SQL Server, then these requirements apply:
    - Azure AD Connect supports all flavors of Microsoft SQL Server from SQL Server 2008 (with SP4) to SQL Server 2014. Microsoft Azure SQL Database is **not supported** as a database.
    - You must use a case-insensitive SQL collation. These are identified with a \_CI_ in their name. It is **not supported** to use a case-sensitive collation, identified by \_CS_ in their name.
    - You can only have one sync engine per database instance. It is **not supported** to share the database instance with FIM/MIM Sync, DirSync, or Azure AD Sync.

### Accounts
- An Azure AD Global Administrator account for the Azure AD directory you wish to integrate with. This must be a **school or organization account** and cannot be a **Microsoft account**.
- An Enterprise Administrator account for your local Active Directory if you use express settings or upgrade from DirSync.
- [Accounts is Active Directory](active-directory-aadconnect-accounts-permissions.md) if you use the custom settings installation path.

### Azure AD Connect server configuration
- If your global administrators have MFA enabled, then the URL **https://secure.aadcdn.microsoftonline-p.com** must be in the trusted sites list. You will be prompted to add this to the trusted sites list if it is not added before you are prompted for an MFA challenge. You can use Internet Explorer to add it to your trusted sites.

### Connectivity
- The Azure AD Connect server needs DNS resolution for both intranet and internet. The DNS server must be able to resolve names both to your on-premises Active Directory as well as the Azure AD endpoints.
- If you have firewalls on your Intranet and you need to open ports between the Azure AD Connect servers and your domain controllers then see [Azure AD Connect Ports](active-directory-aadconnect-ports.md) for more information.
- If your proxy limits which URLs which can be accessed then the URLs documented in [Office 365 URLs and IP address ranges ](https://support.office.com/article/Office-365-URLs-and-IP-address-ranges-8548a211-3fe7-47cb-abb1-355ea5aa88a2) must be opened in the proxy.
    - If you are using the Microsoft Cloud in Germany or the Microsoft Azure Government cloud, then see [Azure AD Connect sync service instances considerations](active-directory-aadconnect-instances.md) for URLs.
- Azure AD Connect is by default using TLS 1.0 to communicate with Azure AD. You can change this to TLS 1.2 by following the steps in [Enable TLS 1.2 for Azure AD Connect](#enable-tls-12-for-azure-ad-connect).
- If you are using an outbound proxy for connecting to the Internet, the following setting in the **C:\Windows\Microsoft.NET\Framework64\v4.0.30319\Config\machine.config** file must be added for the installation wizard and Azure AD Connect sync to be able to connect to the Internet and Azure AD. This text must be entered at the bottom of the file.  In this code, &lt;PROXYADRESS&gt; represents the actual proxy IP address or host name.

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

- If your proxy server requires authentication, then the [service account](active-directory-aadconnect-accounts-permissions.md#azure-ad-connect-sync-service-accounts) must be located in the domain and you must use the customized settings installation path to specify a [custom service account](active-directory-aadconnect-get-started-custom.md#install-required-components). You also need a different machine.config; with this change in machine.config the installation wizard and sync engine will respond to authentication requests from the proxy server. In all installation wizard pages, excluding the **Configure** page, the signed in user's credentials are used. On the **Configure** page at the end of the installation wizard, the context is switched to the [service account](active-directory-aadconnect-accounts-permissions.md#azure-ad-connect-sync-service-accounts) which was created by you. The machine.config section should look like this.

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

See MSDN for more information about the [default proxy Element](https://msdn.microsoft.com/library/kd3cf2ex.aspx).

If you have problems with connectivity, please see [Troubleshoot connectivity problems](active-directory-aadconnect-troubleshoot-connectivity.md).

### Other
- Optional: A test user account to verify synchronization.

## Component prerequisites

### PowerShell and .Net Framework
Azure AD Connect depends on Microsoft PowerShell and .NET Framework 4.5.1. You need this version or a later version installed on your server. Depending on your Windows Server version, do the following:

- Windows Server 2012R2
  - Microsoft PowerShell is installed by default, no action is required.
  - .NET Framework 4.5.1 and later releases are offered through Windows Update. Make sure you have installed the latest updates to Windows Server in the Control Panel.
- Windows Server 2008R2 and Windows Server 2012
  - The latest version of Microsoft PowerShell is available in **Windows Management Framework 4.0**, available on [Microsoft Download Center](http://www.microsoft.com/downloads).
  - .NET Framework 4.5.1 and later releases are available on [Microsoft Download Center](http://www.microsoft.com/downloads).
- Windows Server 2008
  - The latest supported version of PowerShell is available in **Windows Management Framework 3.0**, available on [Microsoft Download Center](http://www.microsoft.com/downloads).
 - .NET Framework 4.5.1 and later releases are available on [Microsoft Download Center](http://www.microsoft.com/downloads).

### Enable TLS 1.2 for Azure AD Connect
Azure AD Connect is using TLS 1.0 by default for encrypting the communication between the sync engine server and Azure AD. You can change this by configuring .Net applications to use TLS 1.2 by default on the server. More information about TLS 1.2 can be found in [Microsoft Security Advisory 2960358 ](https://technet.microsoft.com/security/advisory/2960358).

1. TLS 1.2 cannot be enabled on Windows Server 2008. You need Windows Server 2008R2 or later. Make sure you have the .Net 4.5.1 hotfix installed for your operating system, see [Microsoft Security Advisory 2960358 ](https://technet.microsoft.com/security/advisory/2960358). You might have this or a later release installed on your server already.
2. If you use Windows Server 2008R2, make sure TLS 1.2 is enabled. On Windows Server 2012 server and later versions of the server operating systems, TLS 1.2 should already be enabled.
```
[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2]
[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Client] "DisabledByDefault"=dword:00000000 "Enabled"=dword:00000001
[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Server] "DisabledByDefault"=dword:00000000 "Enabled"=dword:00000001
```
3. For all operating systems, set this registry key and restart the server.
```
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\.NETFramework\v4.0.30319
"SchUseStrongCrypto"=dword:00000001
```
4. If you also want to enable TLS 1.2 between the sync engine server and a remote SQL Server, then make sure you have the required versions installed for [TLS 1.2 support for Microsoft SQL Server](https://support.microsoft.com/kb/3135244).

## Prerequisites for federation installation and configuration

### Windows Remote Management
When using Azure AD Connect to deploy Active Directory Federation Services or the Web Application Proxy, check the requirements below to ensure connectivity and configuration will succeed:

- If the target server is domain joined, ensure that Windows Remote Managed is enabled
    - In an elevated PSH command window, use command `Enable-PSRemoting –force`
- If the target server is a non-domain joined WAP machine, there are a couple of additional requirements
 	- On the target machine (WAP machine):
         - Ensure the winrm (Windows Remote Management / WS-Management) service is running via the Services snap-in
         - In an elevated PSH command window, use command `Enable-PSRemoting –force`
    - On the machine on which the wizard is running (if the target machine is non-domain joined or untrusted domain):
        - In an elevated PSH command window, use the command `Set-Item WSMan:\localhost\Client\TrustedHosts –Value <DMZServerFQDN> -Force –Concatenate`
 	    - In Server Manager:
 		     - add DMZ WAP host to machine pool (server manager -> Manage -> Add Servers...use DNS tab)
 		     - Server Manager All Servers tab: right click WAP server and choose Manage As..., enter local (not domain) creds for the WAP machine
 		     - To validate remote PSH connectivity, in the Server Manager All Servers tab: right click WAP server and choose Windows PowerShell.  A remote PSH session should open to ensure remote PowerShell sessions can be established.

### SSL Certificate Requirements
**Important:** it’s strongly recommended to use the same SSL certificate across all nodes of your AD FS farm as well as all Web Application proxy servers.

- The certificate must be an X509 certificate.
- You can use a self-signed certificate on federation servers in a test lab environment. However, for a production environment, we recommend that you obtain the certificate from a public CA.
    - If using a certificate that is not publicly trusted, ensure that the certificate installed on each Web Application Proxy server is trusted on both the local server and on all federation servers
- The identity of the certificate must match the federation service name (for example, sts.contoso.com).
    - The identity is either a subject alternative name (SAN) extension of type dNSName or, if there are no SAN entries, the subject name specified as a common name.  
    - Multiple SAN entries can be present in the certificate, provided one of them matches the federation service name.
    - If you are planning to use Workplace Join, an additional SAN is required with the value **enterpriseregistration.** followed by the User Principal Name (UPN) suffix of your organization, for example, **enterpriseregistration.contoso.com**.
- Certificates based on CryptoAPI next generation (CNG) keys and key storage providers are not supported. This means you must use a certificate based on a CSP (cryptographic service provider) and not a KSP (key storage provider).
- Wild card certificates are supported.

### Name resolution for federation servers
- Set up DNS records for the AD FS federation service name (e.g. sts.contoso.com) for both the intranet (your internal DNS server) and the extranet (public DNS through your domain registrar). For the intranet DNS record ensure that you use A records and not CNAME records. This is required for windows authentication to work correctly from your domain joined machine.
- If you are deploying more than one AD FS server or Web Application Proxy server, ensure that you have configured your load balancer and that the DNS records for the AD FS federation service name (e.g. sts.contoso.com) point to the load balancer.
- For windows integrated authentication to work for browser applications using Internet Explorer in your intranet, ensure that the AD FS federation service name (e.g. sts.contoso.com) is added to the intranet zone in IE. This can be controlled via group policy and deployed to all your domain joined computers.

## Azure AD Connect supporting components
The following is a list of components that Azure AD Connect will install on the server where Azure AD Connect is installed. This list is for a basic Express installation.  If you choose to use a different SQL Server on the Install synchronization services page then SQL Express LocalDB is not installed locally.

- Azure AD Connect Health
- Microsoft Online Services Sign-In Assistant for IT Professionals (installed but no dependency on it)
- Microsoft SQL Server 2012 Command Line Utilities
- Microsoft SQL Server 2012 Express LocalDB
- Microsoft SQL Server 2012 Native Client
- Microsoft Visual C++ 2013 Redistribution Package

## Hardware requirements for Azure AD Connect
The table below shows the minimum requirements for the Azure AD Connect sync computer.

| Number of objects in Active Directory | CPU | Memory | Hard drive size |
| ------------------------------------- | --- | ------ | --------------- |
| Fewer than 10,000 | 1.6 GHz | 4 GB | 70 GB |
| 10,000–50,000 | 1.6 GHz | 4 GB | 70 GB |
| 50,000–100,000 | 1.6 GHz | 16 GB | 100 GB |
| For 100,000 or more objects the full version of SQL Server is required|  |  |  |
| 100,000–300,000 | 1.6 GHz | 32 GB | 300 GB |
| 300,000–600,000 | 1.6 GHz | 32 GB | 450 GB |
| More than 600,000 | 1.6 GHz | 32 GB | 500 GB |

The minimum requirements for computers running AD FS or Web Application Servers is the following:

- CPU: Dual core 1.6 GHz or higher
- MEMORY: 2GB or higher
- Azure VM: A2 configuration or higher

## Next steps
Learn more about [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md).
