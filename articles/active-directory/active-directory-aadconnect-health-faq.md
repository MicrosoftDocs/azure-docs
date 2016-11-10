---
title: Azure AD Connect Health FAQ
description: This FAQ answers questions about Azure AD Connect Health. This FAQ covers questions about using the service, including the billing model, capabilities, limitations, and support.
services: active-directory
documentationcenter: ''
author: billmath
manager: samueld
editor: curtand

ms.assetid: f1b851aa-54d7-4cb4-8f5c-60680e2ce866
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/18/2016
ms.author: vakarand

---
# Azure AD Connect Health Frequently Asked Questions (FAQ)
This FAQ answers questions about Azure AD Connect Health. This FAQ covers questions about using the service, including the billing model, capabilities, limitations, and support.

## General Questions
**Q: I manage multiple Azure AD directories. How do I switch to the one with Azure Active Directory Premium?**

You can switch between different Azure AD tenants by selecting the currently signed in User Name on the top right corner and choosing the appropriate account. If the account is not listed here, select Sign out and then use the global admin credentials of the Directory that has Azure Active Directory Premium enabled to sign in.

## Installation Questions
**Q: What is the impact of installing the Azure AD Connect Health Agent on individual servers?**

The impact of installing the Microsoft Azure AD Connect Health Agents ADFS, Web Application Proxy servers, Azure AD Connect (sycn) servers, Domain Controllers is minimal with respect to the CPU, Memory consumption network bandwidth and storage.

The numbers below are an approximation.

* CPU consumption: ~1% increase
* Memory consumption: Up to 10 % of the total system memory

> [!NOTE]
> In the event of the agent being unable to communicate to Azure, the agent stores the data locally, up to a defined maximum limit. The agent overwrites the “cached” data on a “least recently serviced” basis.
> 
> 

* Local buffer storage for Azure AD Connect Health Agents: ~20 MB
* For AD FS servers, it is recommended that you provision a disk space of 1024 MB (1 GB) for the AD FS Audit Channel for Azure AD Connect Health Agents to process all the audit data before it is overwritten.

**Q: Will I have to reboot my servers during the installation of the Azure AD Connect Health Agents?**

No. The installation of the agents will not require you to reboot the server. However, installation of some of the prerequisite steps may require a reboot of the server.

For example, on Windows Server 2008 R2 the installation of .Net 4.5 Framework requires a server reboot.

**Q: Does Azure AD Connect Health Services work through a pass-through http proxy?**

Yes.  For on going operations, you can configure the Health Agent to forward outbound http requests using an HTTP Proxy. For more information, See [Configure Azure AD Connect Health Agents to use HTTP Proxy.](active-directory-aadconnect-health-agent-install.md#configure-azure-ad-connect-health-agents-to-use-http-proxy)
If you need to configure a proxy during Agent registration, you may need to modify your Internet Explorer Proxy settings beforehand.

1. Open Internet Explorer -> Settings -> Internet Options -> Connections -> LAN Settings.
2. Select Use a Proxy Server for your LAN.
3. Select Advanced if you have different proxy ports for HTTP and HTTPS/Secure.

**Q: Does Azure AD Connect Health Services support basic authentication when connecting to Http Proxies?**

No. A mechanism for specifying arbitrary username/password for Basic Authentication is not currently supported.

**Q: What version of AD DS are supported by Azure AD Connect Health for AD DS?**

Monitoring of AD DS is supported while installed on the following OS Versions:

* Windows Server 2008 R2
* Windows Server 2012
* Windows Server 2012 R2

## Operations Questions
**Q: Do I need to enable auditing on my AD FS Application Proxy Servers or my Web Application Proxy Servers?**

No, auditing does not need to be enabled on the Web Application Proxy (WAP) Servers. Enable it on the AD FS servers.

**Q: How do Azure AD Connect Health Alerts get resolved?**

Azure AD Connect Health Alerts get resolved on a success condition. Azure AD Connect Health Agents detect and report the success conditions to the service on a periodic basis. For a few alerts, the suppression is time-based. In other words, if the same error condition is not observed within 72 hours from alert generation, the alert is automatically resolved.

**Q: What firewall ports do I need to open for the Azure AD Connect Health Agent to work?**

You need to have TCP/UDP ports 443 and 5671 open for the Azure AD Connect Health Agent to be able to communicate with the Azure AD Health service endpoints.

**Q: Why do I see two servers with the same name in the Azure AD Connect Health Portal?**

When you remove an agent from a server, the server is not automatically removed from the Azure AD Connect Portal.  If you manually removed an agent from a server or removed the server itself, you need to manually delete the server entry from the Azure AD Connect Health portal. For more information, go to [delete a server or service instance.](active-directory-aadconnect-health-operations.md#delete-a-server-or-service-instance)

If you reimaged a server or created a new server with the same details(such as machine name) and  did not remove the already registered server from the Azure AD Connect Health portal, installed the agent on the new server, you may see two entries with the same name.  
In this case, you should delete the entry belonging to the older server manually. The data for this server should be out-of-date.

## Related links
* [Azure AD Connect Health](active-directory-aadconnect-health.md)
* [Azure AD Connect Health Agent Installation](active-directory-aadconnect-health-agent-install.md)
* [Azure AD Connect Health Operations](active-directory-aadconnect-health-operations.md)
* [Using Azure AD Connect Health with AD FS](active-directory-aadconnect-health-adfs.md)
* [Using Azure AD Connect Health for sync](active-directory-aadconnect-health-sync.md)
* [Using Azure AD Connect Health with AD DS](active-directory-aadconnect-health-adds.md)
* [Azure AD Connect Health Version History](active-directory-aadconnect-health-version-history.md)

