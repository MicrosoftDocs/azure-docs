---
title: 'Prerequisites for Azure AD Connect cloud provisioning in Azure AD'
description: This topic describes the pre-requisites and the hardware requirements cloud provisioning.
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
This topic provides guidance on choosing and using Azure AD Connect cloud provisioning as your identity solution.



## Cloud provisioning agent requirements
You are going to need the following to use Azure AD Connect cloud provisioning:
	
- a global administrator account for your Azure AD tenant
- an on-premises server for the provisioning agent with Windows 2012 R2 or later
- on-premises firewall configurations

The rest of the document will provide step-by-step instructions for these prerequisites.

### In the Azure Active Directory admin center

1. Create a cloud-only global administrator account on your Azure AD tenant. This way, you can manage the configuration of your tenant should your on-premises services fail or become unavailable. Learn about [adding a cloud-only global administrator account](../active-directory-users-create-azure-portal.md). Completing this step is critical to ensure that you don't get locked out of your tenant.
2. Add one or more [custom domain names](../active-directory-domains-add-azure-portal.md) to your Azure AD tenant. Your users can sign in with one of these domain names.

### In your on-premises environment

1. Identity a domain-joined host server running Windows Server 2012 R2 or greater with minimum of 4 GB RAM and .NET 4.7.1+ runtime 

2. If there is a firewall between your servers and Azure AD, configure the following items:
   - Ensure that agents can make *outbound* requests to Azure AD over the following ports:

     | Port number | How it's used |
     | --- | --- |
     | **80** | Downloads the certificate revocation lists (CRLs) while validating the SSL certificate |
     | **443** | Handles all outbound communication with the service |
     | **8080** (optional) | Agents report their status every ten minutes over port 8080, if port 443 is unavailable. This status is displayed on the Azure AD portal. |
     
     If your firewall enforces rules according to the originating users, open these ports for traffic from Windows services that run as a network service.
   - If your firewall or proxy allows you to specify safe suffixes, then add connections to **\*.msappproxy.net** and **\*.servicebus.windows.net**. If not, allow access to the [Azure datacenter IP ranges](https://www.microsoft.com/download/details.aspx?id=41653), which are updated weekly.
   - Your agents need access to **login.windows.net** and **login.microsoftonline.com** for initial registration. Open your firewall for those URLs as well.
   - For certificate validation, unblock the following URLs: **mscrl.microsoft.com:80**, **crl.microsoft.com:80**, **ocsp.msocsp.com:80**, and **www\.microsoft.com:80**. Since these URLs are used for certificate validation with other Microsoft products you may already have these URLs unblocked.

### Verify the port
To verify the Azure is listening on port 443 and that your agent can communicate with it, you can use the following:

https://aadap-portcheck.connectorporttest.msappproxy.net/ 

This test will verify that your agents are able to communicate with Azure over port 443.  Open a browser and navigate to the above URL from the server where the agent is installed.
![Services](media/how-to-install/verify2.png)

### Additional requirements
- [Microsoft .NET Framework 4.7.1](https://www.microsoft.com/download/details.aspx?id=56116) 

#### TLS requirements

>[!NOTE]
>The Transport Layer Security (TLS) is a protocol that provides for secure communications.  Changing the TLS settings affects the entire forest.  For more information see [Update to enable TLS 1.1 and TLS 1.2 as default secure protocols in WinHTTP in Windows](https://support.microsoft.com/help/3140245/update-to-enable-tls-1-1-and-tls-1-2-as-default-secure-protocols-in-wi)

The Windows server that will host the Azure AD Connect cloud provisioning agent needs to have TLS 1.2 enabled before you install it.

To enable TLS 1.2:

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

