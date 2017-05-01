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
ms.date: 04/04/2017
ms.author: billmath
---
# Azure AD Connect Health frequently asked questions
This article includes answers to frequently asked questions (FAQs) about Azure Active Directory (Azure AD) Connect Health. These FAQs cover questions about how to use the service, which includes the billing model, capabilities, limitations, and support.

## General questions
**Q: I manage multiple Azure AD directories. How do I switch to the one that has Azure Active Directory Premium?**

To switch between different Azure AD tenants, select the currently signed-in **User Name** on the upper-right corner, and then choose the appropriate account. If the account is not listed here, select **Sign out**, and then use the global admin credentials of the directory that has Azure Active Directory Premium enabled to sign in.

**Q: What version of identity roles are supported by Azure AD Connect Health?**

The following table lists the roles and supported operating system versions.

|Role| Operating system / Version|
|--|--|
|Active Directory Federation Services (AD FS)| <ul> <li> Windows Server 2008 R2 </li><li> Windows Server 2012  </li> <li>Windows Server 2012 R2 </li> <li> Windows Server 2016  </li> </ul>|
|Azure AD Connect | Version 1.0.9125 or higher|
|Active Directory Domain Services (AD DS)| <ul> <li> Windows Server 2008 R2 </li><li> Windows Server 2012  </li> <li>Windows Server 2012 R2 </li> <li> Windows Server 2016  </li> </ul>|

Note that the features provided by the service may differ based on the role and the operating system. In other words, all the features may not be available for all operating system versions. See the feature descriptions for details.

**Q: How many licenses do I need to monitor my infrastructure?**

* The first Connect Health Agent requires at least one Azure AD Premium license.
* Each additional registered agent requires 25 additional Azure AD Premium licenses.
* Agent count is equivalent to the total number of agents that are registered across all monitored roles (AD FS, Azure AD Connect, and/or AD DS).

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

The following numbers are an approximation:

* CPU consumption: ~1-5% increase.
* Memory consumption: Up to 10 % of the total system memory.

> [!NOTE]
> If the agent cannot communicate with Azure, the agent stores the data locally for a defined maximum limit. The agent overwrites the “cached” data on a “least recently serviced” basis.
>
>

* Local buffer storage for Azure AD Connect Health Agents: ~20 MB.
* For AD FS servers, we recommend that you provision a disk space of 1,024 MB (1 GB) for the AD FS audit channel for Azure AD Connect Health Agents to process all the audit data before it is overwritten.

**Q: Will I have to reboot my servers during the installation of the Azure AD Connect Health Agents?**

No. The installation of the agents will not require you to reboot the server. However, installation of some prerequisite steps might require a reboot of the server.

For example, on Windows Server 2008 R2, installation of .NET 4.5 Framework requires a server reboot.

**Q: Does Azure AD Connect Health work through a pass-through HTTP proxy?**

Yes. For ongoing operations, you can configure the Health Agent to use an HTTP proxy to forward outbound HTTP requests.
 Read more about [configuring HTTP Proxy for Health Agents](active-directory-aadconnect-health-agent-install.md#configure-azure-ad-connect-health-agents-to-use-http-proxy).

If you need to configure a proxy during agent registration, you might need to modify your Internet Explorer Proxy settings beforehand.

1. Open Internet Explorer > **Settings** > **Internet Options** > **Connections** > **LAN Settings**.
2. Select **Use a Proxy Server for your LAN**.
3. Select **Advanced** if you have different proxy ports for HTTP and HTTPS/Secure.

**Q: Does Azure AD Connect Health support Basic authentication when connecting to HTTP proxies?**

No. A mechanism to specify an arbitrary user name and password for Basic authentication is not currently supported.

**Q: What firewall ports do I need to open for the Azure AD Connect Health Agent to work?**

See the [requirements section](active-directory-aadconnect-health-agent-install.md#requirements) for the list of firewall ports and other connectivity requirements.

**Q: Why do I see two servers with the same name in the Azure AD Connect Health portal?**

When you remove an agent from a server, the server is not automatically removed from the Azure AD Connect Health portal. If you manually remove an agent from a server or remove the server itself, you need to manually delete the server entry from the Azure AD Connect Health portal.

You might reimage a server or create a new server with the same details (such as machine name). If you did not remove the already registered server from the Azure AD Connect Health portal, and you installed the agent on the new server, you might see two entries with the same name.

In this case, manually delete the entry that belongs to the older server. The data for this server should be out of date.

## Health Agent registration and data freshness

**Q: What are common reasons for the Health Agent registration failures and how do I troubleshoot issues?**

The health agent can fail to register due to the following possible reasons:

* The agent cannot communicate with the required endpoints because a firewall is blocking traffic. This is particularly common on web application proxy servers. Make sure that you have allowed outbound communication to the required endpoints and ports. See the [requirements section](active-directory-aadconnect-health-agent-install.md#requirements) for details.
* Outbound communication is subjected to an SSL inspection by the network layer. This causes the certificate that the agent uses to be replaced by the inspection server/entity, and the steps to complete the agent registration fail.
* The user does not have access to perform the registration of the agent. Global admins have access by default. You can use [Role Based Access Control](active-directory-aadconnect-health-operations.md#manage-access-with-role-based-access-control) to delegate access to other users.

**Q: I am getting alerted that "Health Service data is not up to date." How do I troubleshoot the issue?**

Azure AD Connect Health generates the alert when it does not receive all the data points from the server in the last two hours. There can be multiple reasons for this alert.

* The agent cannot communicate with the required endpoints because a firewall is blocking traffic. This is particularly common on web application proxy servers. Make sure that you have allowed outbound communication to the required end points and ports. See the [requirements section](active-directory-aadconnect-health-agent-install.md#requirements) for details.
* Outbound communication is subjected to an SSL inspection by the network layer. This causes the certificate that the agent uses to be replaced by the inspection server/entity, and the process fails to upload data to the Azure AD Connect Health service.
* You can use the connectivity command built into the agent. [Read more](active-directory-aadconnect-health-agent-install.md#test-connectivity-to-azure-ad-connect-health-service).
* The agents also support outbound connectivity via an unauthenticated HTTP Proxy. [Read more](active-directory-aadconnect-health-agent-install.md##configure-azure-ad-connect-health-agents-to-use-http-proxy).

## Operations questions
**Q: Do I need to enable auditing on the web application proxy servers?**

No, auditing does not need to be enabled on the web application proxy servers.

**Q: How do Azure AD Connect Health Alerts get resolved?**

Azure AD Connect Health alerts get resolved on a success condition. Azure AD Connect Health Agents detect and report the success conditions to the service periodically. For a few alerts, the suppression is time-based. In other words, if the same error condition is not observed within 72 hours from alert generation, the alert is automatically resolved.

## Related links
* [Azure AD Connect Health](active-directory-aadconnect-health.md)
* [Azure AD Connect Health Agent installation](active-directory-aadconnect-health-agent-install.md)
* [Azure AD Connect Health operations](active-directory-aadconnect-health-operations.md)
* [Using Azure AD Connect Health with AD FS](active-directory-aadconnect-health-adfs.md)
* [Using Azure AD Connect Health for sync](active-directory-aadconnect-health-sync.md)
* [Using Azure AD Connect Health with AD DS](active-directory-aadconnect-health-adds.md)
* [Azure AD Connect Health version history](active-directory-aadconnect-health-version-history.md)
