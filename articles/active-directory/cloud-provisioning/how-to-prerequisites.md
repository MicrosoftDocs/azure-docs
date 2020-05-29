---
title: 'Prerequisites for Azure AD Connect cloud provisioning in Azure AD'
description: This article describes the prerequisites and hardware requirements you need for cloud provisioning.
services: active-directory
author: billmath
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 12/06/2019
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Prerequisites for Azure AD Connect cloud provisioning
This article provides guidance on how to choose and use Azure Active Directory (Azure AD) Connect cloud provisioning as your identity solution.



## Cloud provisioning agent requirements
You need the following to use Azure AD Connect cloud provisioning:
	
- A hybrid identity administrator account for your Azure AD tenant that is not a guest user.
- An on-premises server for the provisioning agent with Windows 2012 R2 or later.
- On-premises firewall configurations.

>[!NOTE]
>The provisioning agent can currently only be installed on English language servers. Installing an English language pack on a non-English server is not a valid workaround and will result in the agent failing to install. 

The rest of the document provides step-by-step instructions for these prerequisites.

### In the Azure Active Directory admin center

1. Create a cloud-only hybrid identity administrator account on your Azure AD tenant. This way, you can manage the configuration of your tenant if your on-premises services fail or become unavailable. Learn about how to [add a cloud-only hybrid identity administrator account](../active-directory-users-create-azure-portal.md). Finishing this step is critical to ensure that you don't get locked out of your tenant.
1. Add one or more [custom domain names](../active-directory-domains-add-azure-portal.md) to your Azure AD tenant. Your users can sign in with one of these domain names.

### In your directory in Active Directory

Run the [IdFix tool](https://docs.microsoft.com/office365/enterprise/prepare-directory-attributes-for-synch-with-idfix) to prepare the directory attributes for synchronization.

### In your on-premises environment

1. Identify a domain-joined host server running Windows Server 2012 R2 or greater with a minimum of 4-GB RAM and .NET 4.7.1+ runtime.

1. The PowerShell execution policy on the local server must be set to Undefined or RemoteSigned.

1. If there's a firewall between your servers and Azure AD, configure the following items:
   - Ensure that agents can make *outbound* requests to Azure AD over the following ports:

        | Port number | How it's used |
        | --- | --- |
        | **80** | Downloads the certificate revocation lists (CRLs) while validating the TLS/SSL certificate.  |
        | **443** | Handles all outbound communication with the service. |
        | **8080** (optional) | Agents report their status every 10 minutes over port 8080, if port 443 is unavailable. This status is displayed in the Azure AD portal. |
     
   - If your firewall enforces rules according to the originating users, open these ports for traffic from Windows services that run as a network service.
   - If your firewall or proxy allows you to specify safe suffixes, add connections to \*.msappproxy.net and \*.servicebus.windows.net. If not, allow access to the [Azure datacenter IP ranges](https://www.microsoft.com/download/details.aspx?id=41653), which are updated weekly.
   - Your agents need access to login.windows.net and login.microsoftonline.com for initial registration. Open your firewall for those URLs as well.
   - For certificate validation, unblock the following URLs: mscrl.microsoft.com:80, crl.microsoft.com:80, ocsp.msocsp.com:80, and www\.microsoft.com:80. These URLs are used for certificate validation with other Microsoft products, so you might already have these URLs unblocked.

>[!NOTE]
> Installing the cloud provisioning agent on Windows Server Core is not supported.


### Additional requirements
- [Microsoft .NET Framework 4.7.1](https://www.microsoft.com/download/details.aspx?id=56116) 

#### TLS requirements

>[!NOTE]
>Transport Layer Security (TLS) is a protocol that provides for secure communications. Changing the TLS settings affects the entire forest. For more information, see [Update to enable TLS 1.1 and TLS 1.2 as default secure protocols in WinHTTP in Windows](https://support.microsoft.com/help/3140245/update-to-enable-tls-1-1-and-tls-1-2-as-default-secure-protocols-in-wi).

The Windows server that hosts the Azure AD Connect cloud provisioning agent must have TLS 1.2 enabled before you install it.

To enable TLS 1.2, follow these steps.

1. Set the following registry keys:
	
    ```
    [HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2]
    [HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Client] "DisabledByDefault"=dword:00000000 "Enabled"=dword:00000001
    [HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Server] "DisabledByDefault"=dword:00000000 "Enabled"=dword:00000001
    [HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\.NETFramework\v4.0.30319] "SchUseStrongCrypto"=dword:00000001
    ```

1. Restart the server.


## Next steps 

- [What is provisioning?](what-is-provisioning.md)
- [What is Azure AD Connect cloud provisioning?](what-is-cloud-provisioning.md)

