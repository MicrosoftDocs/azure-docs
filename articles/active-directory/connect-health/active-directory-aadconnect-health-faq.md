---
title: Azure Active Directory Connect Health FAQ - Azure | Microsoft Docs
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
ms.date: 02/06/2017
ms.author: billmath

---
# Azure AD Connect Health frequently asked questions
This article includes answers to frequently asked questions (FAQs) about Azure Active Directory (Azure AD) Connect Health. These FAQs cover questions about how to use the service, which includes the billing model, capabilities, limitations, and support.

## General questions
**Q: I manage multiple Azure AD directories. How do I switch to the one that has Azure Active Directory Premium?**

To switch between different Azure AD tenants, select the currently signed-in **User Name** on the upper-right corner, and then choose the appropriate account. If the account is not listed here, select **Sign out**, and then use the global admin credentials of the directory that has Azure Active Directory Premium enabled to sign in.

**Q: How many licenses do I need to monitor my infrastructure?**

* The first Connect Health Agent requires at least one Azure AD Premium license.
* Each additional registered agent requires 25 additional Azure AD Premium licenses.
* Agent count is equivalent to the total number of agents that are registered across all monitored roles (Active Directory Federation Services, Azure AD Connect, and/or Active Directory Domain Services).

Licensing information is also found on the [Azure AD Pricing page](https://aka.ms/aadpricing).

Example:

| Registered agents | Licenses needed | Example monitoring configuration |
| ------ | --------------- | --- |
| 1 | 1 | 1 Azure AD Connect server |
| 2 | 26| 1 Azure AD Connect server and 1 domain controller |
| 3 | 51 | 1 Active Directory Federation Services (AD FS) server, 1 AD FS proxy, and 1 domain controller |
| 4 | 76 | 1 AD FS server, 1 AD FS proxy, and 2 domain controllers |
| 5 | 101 | 1 Azure AD Connect server, 1 AD FS server, 1 AD FS proxy, and 2 domain controllers |


## Installation questions
**Q: What is the impact of installing the Azure AD Connect Health Agent on individual servers?**

The impact of installing the Microsoft Azure AD Connect Health Agent, AD FS, web application proxy servers, Azure AD Connect (sync) servers, domain controllers is minimal with respect to the CPU, memory consumption, network bandwidth, and storage.

The following numbers are an approximation.

* CPU consumption: ~1% increase
* Memory consumption: Up to 10% of the total system memory

> [!NOTE]
> If the agent cannot communicate with Azure, the agent stores the data locally for a defined maximum limit. The agent overwrites the “cached” data on a “least recently serviced” basis.
>
>

* Local buffer storage for Azure AD Connect Health Agents: ~20 MB.
* For AD FS servers, we recommend that you provision a disk space of 1,024 MB (1 GB) for the AD FS audit channel for Azure AD Connect Health Agents to process all the audit data before it is overwritten.

**Q: Will I have to reboot my servers during the installation of the Azure AD Connect Health Agents?**

No. The installation of the agents will not require you to reboot the server. However, installation of some prerequisite steps might require a reboot of the server.

For example, on Windows Server 2008 R2, installation of .NET 4.5 Framework requires a server reboot.

**Q: Does Azure AD Connect Health Services work through a pass-through HTTP proxy?**

Yes. For ongoing operations, you can configure the Health Agent to use an HTTP proxy to forward outbound HTTP requests.

If you need to configure a proxy during agent registration, you might need to modify your Internet Explorer Proxy settings beforehand.

1. Open Internet Explorer > **Settings** > **Internet Options** > **Connections** > **LAN Settings**.
2. Select **Use a Proxy Server for your LAN**.
3. Select **Advanced** if you have different proxy ports for HTTP and HTTPS/Secure.

**Q: Does Azure AD Connect Health Services support basic authentication when connecting to HTTP proxies?**

No. A mechanism to specify an arbitrary user name and password for Basic authentication is not currently supported.
nect Health for Active Directory Domain Services (AD DS)?**

Monitoring of AD DS is supported while installed on the following operating system versions:

* Windows Server 2008 R2
* Windows Server 2012
* Windows Server 2012 R2
* Windows Server 2016

## Operations questions
**Q: Do I need to enable auditing on my AD FS application proxy servers or my web application proxy servers?**

No, auditing does not need to be enabled on the web application proxy servers. Enable it on the AD FS servers.

**Q: How do Azure AD Connect Health alerts get resolved?**

Azure AD Connect Health alerts get resolved on a success condition. Azure AD Connect Health Agents detect and report the success conditions to the service periodically. For a few alerts, the suppression is time-based. In other words, if the same error condition is not observed within 72 hours from alert generation, the alert is automatically resolved.

**Q: What firewall ports do I need to open for the Azure AD Connect Health Agent to work?**

You need to have TCP/UDP ports 443 and 5671 open so that the Azure AD Connect Health Agent can communicate with the Azure AD Health service endpoints.

**Q: Why do I see two servers with the same name in the Azure AD Connect Health portal?**

When you remove an agent from a server, the server is not automatically removed from the Azure AD Connect Health portal. If you manually remove an agent from a server or remove the server itself, you need to manually delete the server entry from the Azure AD Connect Health portal.

You might reimage a server or create a new server with the same details (such as machine name). If you did not remove the already registered server from the Azure AD Connect Health portal, and you installed the agent on the new server, you might see two entries with the same name.

In this case, manually delete the entry that belongs to the older server. The data for this server should be out of date.

## Migration questions

This section applies only to customers who were notified about an upcoming migration of their Azure AD Connect Health Service data.

**Q: Will I have to register my agents or configure my notification settings again after the migration happens?**

No, agent registration information and notification settings are moved as part of the migration.

**Q: How long after the migration will I start seeing data in the portal?**

Data will start to appear in the portal within one hour after the migration.

**Q: What happens to my existing active alerts?**

Any applicable alerts will be reactivated within one hour after the migration.


## Related links
* [Azure AD Connect Health](active-directory-aadconnect-health.md)
* [Azure AD Connect Health Agent installation](active-directory-aadconnect-health-agent-install.md)
* [Azure AD Connect Health operations](active-directory-aadconnect-health-operations.md)
* [Using Azure AD Connect Health with AD FS](active-directory-aadconnect-health-adfs.md)
* [Using Azure AD Connect Health for sync](active-directory-aadconnect-health-sync.md)
* [Using Azure AD Connect Health with AD DS](active-directory-aadconnect-health-adds.md)
* [Azure AD Connect Health version history](active-directory-aadconnect-health-version-history.md)
