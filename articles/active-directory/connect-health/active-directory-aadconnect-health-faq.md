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
ms.date: 02/10/2017
ms.author: billmath
---
# Azure AD Connect Health Frequently Asked Questions (FAQ)
This FAQ answers questions about Azure AD Connect Health. This FAQ covers questions about using the service, including the billing model, capabilities, limitations, and support.

## General Questions
**Q: I manage multiple Azure AD directories. How do I switch between different directories in the Azure Portal?**

You can switch between different Azure AD tenants by selecting the currently signed in User Name on the top right corner and choosing the appropriate account. If the account is not listed here, select Sign out and then use the appropriate credentials of the Directory to sign in.

**Q: What version of identity roles are supported by Azure AD Connect Health?**

The following table lists the roles and supported Operating System versions.

|Role| Operating System / Version|
|--|--|
|AD FS| <ul> <li> Windows Server 2008R2 </li><li> Windows Server 2012  </li> <li>Windows Server 2012R2 </li> <li> Windows Server 2016  </li> </ul>|
|Azure AD Connect | Version 1.0.9125 or higher.|
|AD DS| <ul> <li> Windows Server 2008R2 </li><li> Windows Server 2012  </li> <li>Windows Server 2012R2 </li> <li> Windows Server 2016  </li> </ul>|

Note that the features provided by the service may differ based on the Role and the Operating System. In other words, all the features may not be available for all OS versions. See the feature descriptions for details.


## Installation Questions
**Q: What is the impact of installing the Azure AD Connect Health Agent on individual servers?**

The impact of installing the Microsoft Azure AD Connect Health Agents ADFS, Web Application Proxy servers, Azure AD Connect (sync) servers, Domain Controllers is minimal with respect to the CPU, Memory consumption network bandwidth and storage.

The numbers below are an approximation.

    * CPU consumption: ~1-5% increase
    * Memory consumption: Up to 10 % of the total system memory

> [!NOTE]
> If the health agent loses connectivity to the Connect Health service, it stores the data locally, up to a defined maximum limit. The agent overwrites the “cached” data on a “least recently serviced” basis.
>
>

* Local buffer storage for Azure AD Connect Health Agents: ~20 MB
* For AD FS servers, it is recommended that you provision a disk space of 1024 MB (1 GB) for the AD FS Audit Channel for Azure AD Connect Health Agents to process all the audit data before it is overwritten.

**Q: Will I have to reboot my servers during the installation of the Azure AD Connect Health Agents?**

No. The installation of the agents will not require you to reboot the server.

Installation of some of the prerequisite steps may require a reboot of the server. For example, on Windows Server 2008 R2 the installation of .Net 4.5 Framework requires a server reboot.

**Q: Does Azure AD Connect Health Services work through a pass-through http proxy?**

Yes.  For on going operations, you can configure the Health Agent to forward outbound http requests using an HTTP Proxy. Read more about [configuring HTTP Proxy for Health Agents](active-directory-aadconnect-health-agent-install.md#configure-azure-ad-connect-health-agents-to-use-http-proxy)

If you need to configure a proxy during Agent registration, you may need to modify your Internet Explorer Proxy settings beforehand.

1. Open Internet Explorer -> Settings -> Internet Options -> Connections -> LAN Settings.
2. Select Use a Proxy Server for your LAN.
3. Select Advanced if you have different proxy ports for HTTP and HTTPS/Secure.

**Q: Does Azure AD Connect Health Services support basic authentication when connecting to Http Proxies?**

No. A mechanism for specifying arbitrary username/password for Basic Authentication is not currently supported.

**Q: What firewall ports do I need to open for the Azure AD Connect Health Agent to work?**

See the [Requirements section](active-directory-aadconnect-health-agent-install.md#requirements) for the list of firewall ports and other connectivity requirements.


**Q: Why do I see two servers with the same name in the Azure AD Connect Health Portal?**

When you remove an agent from a server, the server is not automatically removed from the Azure AD Connect Portal.  If you manually removed an agent from a server or removed the server itself, you need to manually delete the server entry from the Azure AD Connect Health portal.

If you reimaged a server or created a new server with the same details(such as machine name) and  did not remove the already registered server from the Azure AD Connect Health portal, installed the agent on the new server, you may see two entries with the same name.  
In this case, you should delete the entry belonging to the older server manually. The data for this server should be out-of-date.

## Health Agent Registration and Data Freshness

**Q: What are the common reasons for the Health Agent registration failures and how to troubleshoot?**

The health agent can fail to register due to the following possible reasons
    * Agent is unable to communicate with the required endpoints due to firewall blocking the traffic. This is particularly common on the Web Application Proxy Servers. Ensure that you have allowed outbound communication to the required end points and ports. See the [Requirements Section](active-directory-aadconnect-health-agent-install.md#requirements) for details.
    * The outbound communication is subjected to an SSL inspection by the network layer. This causes the certificate used by the agent to be replaced by the inspection server/entity  and it fails to perform the required steps to complete the agent registration.
    * The user does not have access to perform the registration of the agent. Global admins have access by default. You can use [Role Based Access Control](active-directory-aadconnect-health-operations.md#manage-access-with-role-based-access-control) to delegate access to other users.

**Q: I am getting alerted about "Health Service data is not up to date". How to troubleshoot?**

This alert is generated by the Health Service when it does not receive all the data points from the server in the last 2 hours. There can be multiple reasons for this alert to fire.
    * Agent is unable to communicate with the required endpoints due to firewall blocking the traffic. This is particularly common on the Web Application Proxy Servers. Ensure that you have allowed outbound communication to the required end points and ports. See the [Requirements Section](active-directory-aadconnect-health-agent-install.md#requirements) for details.
    * The outbound communication is subjected to an SSL inspection by the network layer. This causes the certificate used by the agent to be replaced by the inspection server/entity and it fails to upload data to the Connect Health service.
    * You can use the connectivity command built into the agent. [Read more](active-directory-aadconnect-health-agent-install.md#test-connectivity-to-azure-ad-connect-health-service).
    * The agents also support outbound connectivity via an unauthenticated HTTP Proxy. [Read more](active-directory-aadconnect-health-agent-install.md##configure-azure-ad-connect-health-agents-to-use-http-proxy).


## Operations Questions
**Q: Do I need to enable auditing on the Web Application Proxy Servers?**

No, auditing does not need to be enabled on the Web Application Proxy (WAP) Servers.

**Q: How do Azure AD Connect Health Alerts get resolved?**

Azure AD Connect Health Alerts get resolved on a success condition. Azure AD Connect Health Agents detect and report the success conditions to the service on a periodic basis. For a few alerts, the suppression is time-based. In other words, if the same error condition is not observed within 72 hours from alert generation, the alert is automatically resolved.


## Migration Questions

This section only applies to customers, who were notified about an upcoming migration of their Azure AD Connect Health service data.

**Q: Will I have to re-register my agents or reconfigure my notification settings, after the migration happens?**

No, agent registration information and notification settings will be moved as part of the migration.

**Q: How long after the migration, will I start seeing data in the portal?**

Data will start appearing in the portal, within one hour after the migration.

**Q: What happens to my existent active alerts?**

Any applicable alerts will be reactivated, within one hour after the migration.


## Related links
* [Azure AD Connect Health](active-directory-aadconnect-health.md)
* [Azure AD Connect Health Agent Installation](active-directory-aadconnect-health-agent-install.md)
* [Azure AD Connect Health Operations](active-directory-aadconnect-health-operations.md)
* [Using Azure AD Connect Health with AD FS](active-directory-aadconnect-health-adfs.md)
* [Using Azure AD Connect Health for sync](active-directory-aadconnect-health-sync.md)
* [Using Azure AD Connect Health with AD DS](active-directory-aadconnect-health-adds.md)
* [Azure AD Connect Health Version History](active-directory-aadconnect-health-version-history.md)
