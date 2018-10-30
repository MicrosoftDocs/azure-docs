---
title: Azure Active Directory Connect Health FAQ - Azure | Microsoft Docs
description: This FAQ answers questions about Azure AD Connect Health. This FAQ covers questions about using the service, including the billing model, capabilities, limitations, and support.
services: active-directory
documentationcenter: ''
author: billmath
manager: mtillman
editor: curtand
ms.assetid: f1b851aa-54d7-4cb4-8f5c-60680e2ce866
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/18/2017
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
* AAD Connect Health licensing does not require you to assign the license to specific users. You only need to have the requisite number of valid licenses.

Licensing information is also found on the [Azure AD Pricing page](https://aka.ms/aadpricing).

Example:

| Registered agents | Licenses needed | Example monitoring configuration |
| ------ | --------------- | --- |
| 1 | 1 | 1 Azure AD Connect server |
| 2 | 26| 1 Azure AD Connect server and 1 domain controller |
| 3 | 51 | 1 Active Directory Federation Services (AD FS) server, 1 AD FS proxy, and 1 domain controller |
| 4 | 76 | 1 AD FS server, 1 AD FS proxy, and 2 domain controllers |
| 5 | 101 | 1 Azure AD Connect server, 1 AD FS server, 1 AD FS proxy, and 2 domain controllers |

**Q: Does Azure AD Connect Health support Azure Germany Cloud?**

Azure AD Connect Health is not supported in Germany Cloud except for the [sync errors report feature](how-to-connect-health-sync.md#object-level-synchronization-error-report-preview). 

| Roles | Features | Supported in German Cloud |
| ------ | --------------- | --- |
| Connect Health for Sync | Monitoring / Insight / Alerts / Analysis | No |
|  | Sync error report | Yes |
| Connect Health for ADFS | Monitoring / Insight / Alerts / Analysis | No |
| Connect Health for ADDS | Monitoring / Insight / Alerts / Analysis | No |

To ensure the agent connectivity of Connect Health for sync, please configure the [installation requirement](how-to-connect-health-agent-install.md#outbound-connectivity-to-the-azure-service-endpoints) accordingly.   

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
 Read more about [configuring HTTP Proxy for Health Agents](how-to-connect-health-agent-install.md#configure-azure-ad-connect-health-agents-to-use-http-proxy).

If you need to configure a proxy during agent registration, you might need to modify your Internet Explorer Proxy settings beforehand.

1. Open Internet Explorer > **Settings** > **Internet Options** > **Connections** > **LAN Settings**.
2. Select **Use a Proxy Server for your LAN**.
3. Select **Advanced** if you have different proxy ports for HTTP and HTTPS/Secure.

**Q: Does Azure AD Connect Health support Basic authentication when connecting to HTTP proxies?**

No. A mechanism to specify an arbitrary user name and password for Basic authentication is not currently supported.

**Q: What firewall ports do I need to open for the Azure AD Connect Health Agent to work?**

See the [requirements section](how-to-connect-health-agent-install.md#requirements) for the list of firewall ports and other connectivity requirements.

**Q: Why do I see two servers with the same name in the Azure AD Connect Health portal?**

When you remove an agent from a server, the server is not automatically removed from the Azure AD Connect Health portal. If you manually remove an agent from a server or remove the server itself, you need to manually delete the server entry from the Azure AD Connect Health portal.

You might reimage a server or create a new server with the same details (such as machine name). If you did not remove the already registered server from the Azure AD Connect Health portal, and you installed the agent on the new server, you might see two entries with the same name.

In this case, manually delete the entry that belongs to the older server. The data for this server should be out of date.

## Health Agent registration and data freshness

**Q: What are common reasons for the Health Agent registration failures and how do I troubleshoot issues?**

The health agent can fail to register due to the following possible reasons:

* The agent cannot communicate with the required endpoints because a firewall is blocking traffic. This is particularly common on web application proxy servers. Make sure that you have allowed outbound communication to the required endpoints and ports. See the [requirements section](how-to-connect-health-agent-install.md#requirements) for details.
* Outbound communication is subjected to an SSL inspection by the network layer. This causes the certificate that the agent uses to be replaced by the inspection server/entity, and the steps to complete the agent registration fail.
* The user does not have access to perform the registration of the agent. Global admins have access by default. You can use [Role Based Access Control](how-to-connect-health-operations.md#manage-access-with-role-based-access-control) to delegate access to other users.

**Q: I am getting alerted that "Health Service data is not up to date." How do I troubleshoot the issue?**

Azure AD Connect Health generates the alert when it does not receive all the data points from the server in the last two hours. [Read more](how-to-connect-health-data-freshness.md).

## Operations questions
**Q: Do I need to enable auditing on the web application proxy servers?**

No, auditing does not need to be enabled on the web application proxy servers.

**Q: How do Azure AD Connect Health Alerts get resolved?**

Azure AD Connect Health alerts get resolved on a success condition. Azure AD Connect Health Agents detect and report the success conditions to the service periodically. For a few alerts, the suppression is time-based. In other words, if the same error condition is not observed within 72 hours from alert generation, the alert is automatically resolved.

**Q: I am getting alerted that "Test Authentication Request (Synthetic Transaction) failed to obtain a token." How do I troubleshoot the issue?**

Azure AD Connect Health for AD FS generates this alert when the Health Agent installed on an AD FS server fails to obtain a token as part of a synthetic transaction initiated by the Health Agent. The Health agent uses the local system context and attempts to get a token for a self relying party. This is a catch-all test to ensure that AD FS is in a state of issuing tokens.

Most often this test fails because the Health Agent is unable to resolve the AD FS farm name. This can happen if the AD FS servers are behind a network load balancers and the request gets initiated from a node that's behind the load balancer (as opposed to a regular client that is in front of the load balancer). This can be fixed by updating the "hosts" file located under "C:\Windows\System32\drivers\etc" to include the IP address of the AD FS server or a loopback IP address (127.0.0.1) for the AD FS farm name (such as sts.contoso.com). Adding the host file will short-circuit the network call, thus allowing the Health Agent to get the token.

**Q: I got an email indicating my machines are NOT patched for the recent ransomeware attacks. Why did I receive this email?**

Azure AD Connect Health service scanned all the machines it monitors to ensure the required patches were installed. The email was sent to the tenant administrators if at least one machine did not have the critical patches. The following logic was used to make this determination.
1. Find all the hotfixes installed on the machine.
2. Check if at least one of the HotFixes from the defined list is present.
3. If Yes, the machine is protected. If Not, the machine is at risk for the attack.

You can use the following PowerShell script to perform this check manually. It implements the above logic.

```
Function CheckForMS17-010 ()
{
    $hotfixes = "KB3205409", "KB3210720", "KB3210721", "KB3212646", "KB3213986", "KB4012212", "KB4012213", "KB4012214", "KB4012215", "KB4012216", "KB4012217", "KB4012218", "KB4012220", "KB4012598", "KB4012606", "KB4013198", "KB4013389", "KB4013429", "KB4015217", "KB4015438", "KB4015546", "KB4015547", "KB4015548", "KB4015549", "KB4015550", "KB4015551", "KB4015552", "KB4015553", "KB4015554", "KB4016635", "KB4019213", "KB4019214", "KB4019215", "KB4019216", "KB4019263", "KB4019264", "KB4019472", "KB4015221", "KB4019474", "KB4015219", "KB4019473"

    #checks the computer it's run on if any of the listed hotfixes are present
    $hotfix = Get-HotFix -ComputerName $env:computername | Where-Object {$hotfixes -contains $_.HotfixID} | Select-Object -property "HotFixID"

    #confirms whether hotfix is found or not
    if (Get-HotFix | Where-Object {$hotfixes -contains $_.HotfixID})
    {
        "Found HotFix: " + $hotfix.HotFixID
    } else {
        "Didn't Find HotFix"
    }
}

CheckForMS17-010

```

**Q: Why does the PowerShell cmdlet <i>Get-MsolDirSyncProvisioningError</i> show less sync errors in the result?**

<i>Get-MsolDirSyncProvisioningError</i> will only return DirSync provisioning errors. Besides that, Connect Health portal also shows other sync error types such as export errors. This is consistent with Azure AD Connect delta result. Read more about [Azure AD Connect Sync errors](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnect-troubleshoot-sync-errors).

**Q: Why are my ADFS audits not being generated?**

Please use PowerShell cmdlet <i>Get-AdfsProperties -AuditLevel</i> to ensure audit logs is not in disabled state. Read more about [ADFS audit logs](https://docs.microsoft.com/windows-server/identity/ad-fs/technical-reference/auditing-enhancements-to-ad-fs-in-windows-server#auditing-levels-in-ad-fs-for-windows-server-2016). Notice if there are advanced audit settings pushed to the ADFS server, any changes with auditpol.exe will be overwritten (event if Application Generated is not configured). In this case, please set the local security policy to log Application Generated failures and success. 


## Related links
* [Azure AD Connect Health](whatis-hybrid-identity-health.md)
* [Azure AD Connect Health Agent installation](how-to-connect-health-agent-install.md)
* [Azure AD Connect Health operations](how-to-connect-health-operations.md)
* [Using Azure AD Connect Health with AD FS](how-to-connect-health-adfs.md)
* [Using Azure AD Connect Health for sync](how-to-connect-health-sync.md)
* [Using Azure AD Connect Health with AD DS](how-to-connect-health-adds.md)
* [Azure AD Connect Health version history](reference-connect-health-version-history.md)
