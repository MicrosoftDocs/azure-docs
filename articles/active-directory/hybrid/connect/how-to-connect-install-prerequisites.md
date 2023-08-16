---
title: 'Azure AD Connect: Prerequisites and hardware'
description: This article describes the prerequisites and the hardware requirements for Azure AD Connect.
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
editor: ''
ms.assetid: 91b88fda-bca6-49a8-898f-8d906a661f07
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 05/02/2023
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---
# Prerequisites for Azure AD Connect
This article describes the prerequisites and the hardware requirements for Azure Active Directory (Azure AD) Connect.

## Before you install Azure AD Connect
Before you install Azure AD Connect, there are a few things that you need.

### Azure AD
* You need an Azure AD tenant. You get one with an [Azure free trial](https://azure.microsoft.com/pricing/free-trial/). You can use one of the following portals to manage Azure AD Connect:
  * The [Azure portal](https://portal.azure.com).
  * The [Office portal](https://portal.office.com).
* [Add and verify the domain](../../fundamentals/add-custom-domain.md) you plan to use in Azure AD. For example, if you plan to use contoso.com for your users, make sure this domain has been verified and you're not using only the contoso.onmicrosoft.com default domain.
* An Azure AD tenant allows, by default, 50,000 objects. When you verify your domain, the limit increases to 300,000 objects. If you need even more objects in Azure AD, open a support case to have the limit increased even further. If you need more than 500,000 objects, you need a license, such as Microsoft 365, Azure AD Premium, or Enterprise Mobility + Security.

### Prepare your on-premises data
* Use [IdFix](https://github.com/Microsoft/idfix) to identify errors such as duplicates and formatting problems in your directory before you [synchronize to Azure AD and Microsoft 365](https://support.office.com/article/Install-and-run-the-Office-365-IdFix-tool-f4bd2439-3e41-4169-99f6-3fabdfa326ac).
* Review [optional sync features you can enable in Azure AD](how-to-connect-syncservice-features.md), and evaluate which features you should enable.

### On-premises Active Directory
* The Active Directory schema version and forest functional level must be Windows Server 2003 or later. The domain controllers can run any version as long as the schema version and forest-level requirements are met. You might require [a paid support program](/lifecycle/policies/fixed#extended-support) if you require support for domain controllers running Windows Server 2016 or older.
* The domain controller used by Azure AD must be writable. Using a read-only domain controller (RODC) *isn't supported*, and Azure AD Connect doesn't follow any write redirects.
* Using on-premises forests or domains by using "dotted" (name contains a period ".") NetBIOS names *isn't supported*.
* We recommend that you [enable the Active Directory recycle bin](how-to-connect-sync-recycle-bin.md).

### PowerShell execution policy
Azure Active Directory Connect runs signed PowerShell scripts as part of the installation. Ensure that the PowerShell execution policy will allow running of scripts.

The recommended execution policy during installation is "RemoteSigned".

For more information on setting the PowerShell execution policy, see [Set-ExecutionPolicy](/powershell/module/microsoft.powershell.security/set-executionpolicy).


### Azure AD Connect server
The Azure AD Connect server contains critical identity data. It's important that administrative access to this server is properly secured. Follow the guidelines in [Securing privileged access](/windows-server/identity/securing-privileged-access/securing-privileged-access). 

The Azure AD Connect server must be treated as a Tier 0 component as documented in the [Active Directory administrative tier model](/windows-server/identity/securing-privileged-access/securing-privileged-access-reference-material). We recommend hardening the Azure AD Connect server as a Control Plane asset by following the guidance provided in [Secure Privileged Access](/security/compass/overview) 

To read more about securing your Active Directory environment, see [Best practices for securing Active Directory](/windows-server/identity/ad-ds/plan/security-best-practices/best-practices-for-securing-active-directory).

#### Installation prerequisites

- Azure AD Connect must be installed on a domain-joined Windows Server 2016 or later. We recommend using domain-joined Windows Server 2022. You can deploy Azure AD Connect on Windows Server 2016 but since Windows Server 2016 is in extended support, you may require [a paid support program](/lifecycle/policies/fixed#extended-support) if you require support for this configuration.
- The minimum .NET Framework version required is 4.6.2, and newer versions of .NET are also supported.  .NET version 4.8 and greater offers the best accessibility compliance.
- Azure AD Connect can't be installed on Small Business Server or Windows Server Essentials before 2019 (Windows Server Essentials 2019 is supported). The server must be using Windows Server standard or better. 
- The Azure AD Connect server must have a full GUI installed. Installing Azure AD Connect on Windows Server Core isn't supported. 
- The Azure AD Connect server must not have PowerShell Transcription Group Policy enabled if you use the Azure AD Connect wizard to manage Active Directory Federation Services (AD FS) configuration. You can enable PowerShell transcription if you use the Azure AD Connect wizard to manage sync configuration. 
- If AD FS is being deployed: 
    - The servers where AD FS or Web Application Proxy are installed must be Windows Server 2012 R2 or later. Windows remote management must be enabled on these servers for remote installation. You may require [a paid support program](/lifecycle/policies/fixed#extended-support) if you require support for Windows Server 2016 and older.
    - You must configure TLS/SSL certificates. For more information, see [Managing SSL/TLS protocols and cipher suites for AD FS](/windows-server/identity/ad-fs/operations/manage-ssl-protocols-in-ad-fs) and [Managing SSL certificates in AD FS](/windows-server/identity/ad-fs/operations/manage-ssl-certificates-ad-fs-wap).
    - You must configure name resolution. 
- It is not supported to break and analyze traffic between Azure AD Connect and Azure AD. Doing so may disrupt the service.
- If your Hybrid Identity Administrators have MFA enabled, the URL `https://secure.aadcdn.microsoftonline-p.com` *must* be in the trusted sites list. You're prompted to add this site to the trusted sites list when you're prompted for an MFA challenge and it hasn't been added before. You can use Internet Explorer to add it to your trusted sites.
- If you plan to use Azure AD Connect Health for syncing, ensure that the prerequisites for Azure AD Connect Health are also met. For more information, see [Azure AD Connect Health agent installation](how-to-connect-health-agent-install.md).

### Harden your Azure AD Connect server 
We recommend that you harden your Azure AD Connect server to decrease the security attack surface for this critical component of your IT environment. Following these recommendations will help to mitigate some security risks to your organization.

- We recommend hardening the Azure AD Connect server as a Control Plane (formerly Tier 0) asset by following the guidance provided in [Secure Privileged Access](/security/compass/overview) and [Active Directory administrative tier model](/windows-server/identity/securing-privileged-access/securing-privileged-access-reference-material).
- Restrict administrative access to the Azure AD Connect server to only domain administrators or other tightly controlled security groups.
- Create a [dedicated account for all personnel with privileged access](/windows-server/identity/securing-privileged-access/securing-privileged-access). Administrators shouldn't be browsing the web, checking their email, and doing day-to-day productivity tasks with highly privileged accounts.
- Follow the guidance provided in [Securing privileged access](/windows-server/identity/securing-privileged-access/securing-privileged-access). 
- Deny use of NTLM authentication with the AADConnect server. Here are some ways to do this: [Restricting NTLM on the AADConnect Server](/windows/security/threat-protection/security-policy-settings/network-security-restrict-ntlm-outgoing-ntlm-traffic-to-remote-servers) and [Restricting NTLM on a domain](/windows/security/threat-protection/security-policy-settings/network-security-restrict-ntlm-ntlm-authentication-in-this-domain)
- Ensure every machine has a unique local administrator password. For more information, see [Local Administrator Password Solution (Windows LAPS)](/windows-server/identity/laps/laps-overview) can configure unique random passwords on each workstation and server store them in Active Directory protected by an ACL. Only eligible authorized users can read or request the reset of these local administrator account passwords. Additional guidance for operating an environment with Windows LAPS and privileged access workstations (PAWs) can be found in [Operational standards based on clean source principle](/windows-server/identity/securing-privileged-access/securing-privileged-access-reference-material#operational-standards-based-on-clean-source-principle). 
- Implement dedicated [privileged access workstations](https://4sysops.com/archives/understand-the-microsoft-privileged-access-workstation-paw-security-model/) for all personnel with privileged access to your organization's information systems. 
- Follow these [additional guidelines](/windows-server/identity/ad-ds/plan/security-best-practices/reducing-the-active-directory-attack-surface) to reduce the attack surface of your Active Directory environment.
- Follow the [Monitor changes to federation configuration](how-to-connect-monitor-federation-changes.md) to set up alerts to monitor changes to the trust established between your Idp and Azure AD. 
- Enable Multi Factor Authentication (MFA) for all users that have privileged access in Azure AD or in AD. One security issue with using Azure AD Connect is that if an attacker can get control over the Azure AD Connect server they can manipulate users in Azure AD. To prevent an attacker from using these capabilities to take over Azure AD accounts, MFA offers protections so that even if an attacker manages to e.g. reset a user's password using Azure AD Connect they still cannot bypass the second factor.
- Disable Soft Matching on your tenant. Soft Matching is a great feature to help transferring source of authority for existing cloud managed objects to Azure AD Connect, but it comes with certain security risks. If you do not require it, you should [disable Soft Matching](how-to-connect-syncservice-features.md#blocksoftmatch).
- Disable Hard Match Takeover. Hard match takeover allows Azure AD Connect to take control of a cloud managed object and changing the source of authority for the object to Active Directory. Once the source of authority of an object is taken over by Azure AD Connect, changes made to the Active Directory object that is linked to the Azure AD object will overwrite the original Azure AD data - including the password hash, if Password Hash Sync is enabled. An attacker could use this capability to take over control of cloud managed objects. To mitigate this risk, [disable hard match takeover](/powershell/module/msonline/set-msoldirsyncfeature?view=azureadps-1.0&preserve-view=true#example-3-block-cloud-object-takeover-through-hard-matching-for-the-tenant).

### SQL Server used by Azure AD Connect
* Azure AD Connect requires a SQL Server database to store identity data. By default, a SQL Server 2019 Express LocalDB (a light version of SQL Server Express) is installed. SQL Server Express has a 10-GB size limit that enables you to manage approximately 100,000 objects. If you need to manage a higher volume of directory objects, point the installation wizard to a different installation of SQL Server. The type of SQL Server installation can impact the [performance of Azure AD Connect](./plan-connect-performance-factors.md#sql-database-factors).
* If you use a different installation of SQL Server, these requirements apply:
  * Azure AD Connect support all mainstream supported SQL Server versions up to SQL Server 2019 running on Windows. Please refer to the [SQL Server lifecycle article](/lifecycle/products/?products=sql-server) to verify the support status of your SQL Server version. SQL Server 2012 is no longer supported. Azure SQL Database *isn't supported* as a database.  This includes both Azure SQL Database and Azure SQL Managed Instance.
  * You must use a case-insensitive SQL collation. These collations are identified with a \_CI_ in their name. Using a case-sensitive collation identified by \_CS_ in their name *isn't supported*.
  * You can have only one sync engine per SQL instance. Sharing a SQL instance with FIM/MIM Sync, DirSync, or Azure AD Sync *isn't supported*.

### Accounts
* You must have an Azure AD Global Administrator account or Hybrid Identity Administrator account for the Azure AD tenant you want to integrate with. This account must be a *school or organization account* and can't be a *Microsoft account*.
* If you use [express settings](reference-connect-accounts-permissions.md#express-settings-installation) or upgrade from DirSync, you must have an Enterprise Administrator account for your on-premises Active Directory.
* If you use the custom settings installation path, you have more options. For more information, see [Custom installation settings](reference-connect-accounts-permissions.md#custom-installation-settings).

### Connectivity
* The Azure AD Connect server needs DNS resolution for both intranet and internet. The DNS server must be able to resolve names both to your on-premises Active Directory and the Azure AD endpoints.
* Azure AD Connect requires network connectivity to all configured domains
* Azure AD Connect requires network connectivity to the root domain of all configured forest
* If you have firewalls on your intranet and you need to open ports between the Azure AD Connect servers and your domain controllers, see [Azure AD Connect ports](reference-connect-ports.md) for more information.
* If your proxy or firewall limit which URLs can be accessed, the URLs documented in [Office 365 URLs and IP address ranges](https://support.office.com/article/Office-365-URLs-and-IP-address-ranges-8548a211-3fe7-47cb-abb1-355ea5aa88a2) must be opened. Also see [Safelist the Azure portal URLs on your firewall or proxy server](../../../azure-portal/azure-portal-safelist-urls.md).
  * If you're using the Microsoft cloud in Germany or the Microsoft Azure Government cloud, see [Azure AD Connect sync service instances considerations](reference-connect-instances.md) for URLs.
* Azure AD Connect (version 1.1.614.0 and after) by default uses TLS 1.2 for encrypting communication between the sync engine and Azure AD. If TLS 1.2 isn't available on the underlying operating system, Azure AD Connect incrementally falls back to older protocols (TLS 1.1 and TLS 1.0). From Azure AD Connect version 2.0 onwards. TLS 1.0 and 1.1 are no longer supported and installation will fail if TLS 1.2 is not enabled.
* Prior to version 1.1.614.0, Azure AD Connect by default uses TLS 1.0 for encrypting communication between the sync engine and Azure AD. To change to TLS 1.2, follow the steps in [Enable TLS 1.2 for Azure AD Connect](#enable-tls-12-for-azure-ad-connect).
* If you're using an outbound proxy for connecting to the internet, the following setting in the **C:\Windows\Microsoft.NET\Framework64\v4.0.30319\Config\machine.config** file must be added for the installation wizard and Azure AD Connect sync to be able to connect to the internet and Azure AD. This text must be entered at the bottom of the file. In this code, *&lt;PROXYADDRESS&gt;* represents the actual proxy IP address or host name.

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

* If your proxy server requires authentication, the [service account](reference-connect-accounts-permissions.md#adsync-service-account) must be located in the domain. Use the customized settings installation path to specify a [custom service account](how-to-connect-install-custom.md#install-required-components). You also need a different change to machine.config. With this change in machine.config, the installation wizard and sync engine respond to authentication requests from the proxy server. In all installation wizard pages, excluding the **Configure** page, the signed-in user's credentials are used. On the **Configure** page at the end of the installation wizard, the context is switched to the [service account](reference-connect-accounts-permissions.md#adsync-service-account) that you created. The machine.config section should look like this:

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

* If the proxy configuration is being done in an existing setup, the **Microsoft Azure AD Sync service** needs to be restarted once for the Azure AD Connect to read the proxy configuration and update the behavior. 
* When Azure AD Connect sends a web request to Azure AD as part of directory synchronization, Azure AD can take up to 5 minutes to respond. It's common for proxy servers to have connection idle timeout configuration. Ensure the configuration is set to at least 6 minutes or more.

For more information, see MSDN about the [default proxy element](/dotnet/framework/configure-apps/file-schema/network/defaultproxy-element-network-settings).
For more information when you have problems with connectivity, see [Troubleshoot connectivity problems](tshoot-connect-connectivity.md).

### Other
Optional: Use a test user account to verify synchronization.

## Component prerequisites
### PowerShell and .NET Framework
Azure AD Connect depends on Microsoft PowerShell 5.0 and .NET Framework 4.5.1. You need this version or a later version installed on your server. 

### Enable TLS 1.2 for Azure AD Connect
Prior to version 1.1.614.0, Azure AD Connect by default uses TLS 1.0 for encrypting the communication between the sync engine server and Azure AD. You can configure .NET applications to use TLS 1.2 by default on the server. For more information about TLS 1.2, see [Microsoft Security Advisory 2960358](/security-updates/SecurityAdvisories/2015/2960358).

1. Make sure you have the .NET 4.5.1 hotfix installed for your operating system. For more information, see [Microsoft Security Advisory 2960358](/security-updates/SecurityAdvisories/2015/2960358). You might have this hotfix or a later release installed on your server already.

1. For all operating systems, set this registry key and restart the server.
    ```
    HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\.NETFramework\v4.0.30319
    "SchUseStrongCrypto"=dword:00000001
    ```
1. If you also want to enable TLS 1.2 between the sync engine server and a remote SQL Server, make sure you have the required versions installed for [TLS 1.2 support for Microsoft SQL Server](https://support.microsoft.com/kb/3135244).

### DCOM prerequisites on the synchronization server
During the installation of the synchronization service, Azure AD Connect checks for the presence of the following registry key:

- HKEY_LOCAL_MACHINE:  Software\Microsoft\Ole

Under this registry key, Azure AD Connect will check to see if the following values are present and uncorrupted: 

- [MachineAccessRestriction](/windows/win32/com/machineaccessrestriction)
- [MachineLaunchRestriction](/windows/win32/com/machinelaunchrestriction)
- [DefaultLaunchPermission](/windows/win32/com/defaultlaunchpermission)

## Prerequisites for federation installation and configuration
### Windows Remote Management
When you use Azure AD Connect to deploy AD FS or the Web Application Proxy (WAP), check these requirements:

* If the target server is domain joined, ensure that Windows Remote Managed is enabled.
  * In an elevated PowerShell command window, use the command `Enable-PSRemoting –force`.
* If the target server is a non-domain-joined WAP machine, there are a couple of additional requirements:
  * On the target machine (WAP machine):
    * Ensure the Windows Remote Management/WS-Management (WinRM) service is running via the Services snap-in.
    * In an elevated PowerShell command window, use the command `Enable-PSRemoting –force`.
  * On the machine on which the wizard is running (if the target machine is non-domain joined or is an untrusted domain):
    * In an elevated PowerShell command window, use the command `Set-Item.WSMan:\localhost\Client\TrustedHosts –Value <DMZServerFQDN> -Force –Concatenate`.
    * In the server manager:
      * Add a DMZ WAP host to a machine pool. In the server manager, select **Manage** > **Add Servers**, and then use the **DNS** tab.
      * On the **Server Manager All Servers** tab, right-click the WAP server, and select **Manage As**. Enter local (not domain) credentials for the WAP machine.
      * To validate remote PowerShell connectivity, on the **Server Manager All Servers** tab, right-click the WAP server and select **Windows PowerShell**. A remote PowerShell session should open to ensure remote PowerShell sessions can be established.

### TLS/SSL certificate requirements
* We recommend that you use the same TLS/SSL certificate across all nodes of your AD FS farm and all Web Application Proxy servers.
* The certificate must be an X509 certificate.
* You can use a self-signed certificate on federation servers in a test lab environment. For a production environment, we recommend that you obtain the certificate from a public certificate authority.
  * If you're using a certificate that isn't publicly trusted, ensure that the certificate installed on each Web Application Proxy server is trusted on both the local server and on all federation servers.
* The identity of the certificate must match the federation service name (for example, sts.contoso.com).
  * The identity is either a subject alternative name (SAN) extension of type dNSName or, if there are no SAN entries, the subject name is specified as a common name.
  * Multiple SAN entries can be present in the certificate provided one of them matches the federation service name.
  * If you're planning to use Workplace Join, an additional SAN is required with the value **enterpriseregistration.** followed by the user principal name (UPN) suffix of your organization, for example, enterpriseregistration.contoso.com.
* Certificates based on CryptoAPI next-generation (CNG) keys and key storage providers (KSPs) aren't supported. As a result, you must use a certificate based on a cryptographic service provider (CSP) and not a KSP.
* Wild-card certificates are supported.

### Name resolution for federation servers
* Set up DNS records for the AD FS name (for example, sts.contoso.com) for both the intranet (your internal DNS server) and the extranet (public DNS through your domain registrar). For the intranet DNS record, ensure that you use A records and not CNAME records. Using A records is required for Windows authentication to work correctly from your domain-joined machine.
* If you're deploying more than one AD FS server or Web Application Proxy server, ensure that you've configured your load balancer and that the DNS records for the AD FS name (for example, sts.contoso.com) point to the load balancer.
* For Windows integrated authentication to work for browser applications using Internet Explorer in your intranet, ensure that the AD FS name (for example, sts.contoso.com) is added to the intranet zone in Internet Explorer. This requirement can be controlled via Group Policy and deployed to all your domain-joined computers.

## Azure AD Connect supporting components
Azure AD Connect installs the following components on the server where Azure AD Connect is installed. This list is for a basic Express installation. If you choose to use a different SQL Server on the **Install synchronization services** page, SQL Express LocalDB isn't installed locally.

* Azure AD Connect Health
* Microsoft SQL Server 2019 Command Line Utilities
* Microsoft SQL Server 2019 Express LocalDB
* Microsoft SQL Server 2019 Native Client
* Microsoft Visual C++ 14 Redistribution Package

## Hardware requirements for Azure AD Connect
The following table shows the minimum requirements for the Azure AD Connect sync computer.

| Number of objects in Active Directory | CPU | Memory | Hard drive size |
| --- | --- | --- | --- |
| Fewer than 10,000 |1.6 GHz |6 GB |70 GB |
| 10,000–50,000 |1.6 GHz |6 GB |70 GB |
| 50,000–100,000 |1.6 GHz |16 GB |100 GB |
| For 100,000 or more objects, the full version of SQL Server is required. For performance reasons, installing locally is preferred. The following values are valid only for Azure AD Connect installation. If SQL Server will be installed on the same server, further memory, drive, and CPU is required. | | | |
| 100,000–300,000 |1.6 GHz |32 GB |300 GB |
| 300,000–600,000 |1.6 GHz |32 GB |450 GB |
| More than 600,000 |1.6 GHz |32 GB |500 GB |

The minimum requirements for computers running AD FS or Web Application Proxy servers are:

* CPU: Dual core 1.6 GHz or higher
* Memory: 2 GB or higher
* Azure VM: A2 configuration or higher

## Next steps
Learn more about [Integrating your on-premises identities with Azure Active Directory](../whatis-hybrid-identity.md).
