---

title: Use Microsoft and Azure security resources to help recover from systemic identity compromise | Microsoft Docs
description: Learn how to use Microsoft and Azure security resources, such as Microsoft Defender XDR, Microsoft Sentinel, Microsoft Entra ID, Microsoft Defender for Cloud, and Microsoft Defender for IoT and Microsoft recommendations to secure your system against systemic-identity compromises.
services: security
documentationcenter: na
author: batamig
manager: raynew
editor: ''

ms.service: security
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/15/2023
ms.author: bagol

---

# Recovering from systemic identity compromise

This article describes Microsoft resources and recommendations for recovering from a systemic identity compromise attack against your organization.

The content in this article is based on guidance provided by Microsoft's Detection and Response Team (DART), which works to respond to compromises and help customers become cyber-resilient. For more guidance from the DART team, see their [Microsoft security blog series](https://www.microsoft.com/security/blog/microsoft-detection-and-response-team-dart-blog-series/).

Many organizations have transitioned to a cloud-based approach for stronger security on their identity and access management. However, your organization may also have on-premises systems in place and use varying methods of hybrid architecture. This article acknowledges that systemic identity attacks affect cloud, on-premises, and hybrid systems, and provides recommendations and references for all of these environments.

> [!IMPORTANT]
> This information is provided as-is and constitutes generalized guidance; the ultimate determination about how to apply this guidance to your IT environment and tenant(s) must consider your unique environment and needs, which each Customer is in the best position to determine.
>

## About systemic identity compromise

A systemic identity compromise attack on an organization occurs when an attacker successfully gains a foothold into the administration of an organization's identity infrastructure.

If this has happened to your organization, you are in a race against the attacker to secure your environment before further damage can be done.

- **Attackers with administrative control of an environment's identity infrastructure** can use that control to create, modify, or delete identities and identity permissions in that environment.

    In an on-premises compromise, if trusted SAML token-signing certificates are *not* stored in an [HSM](../../key-vault/keys/hsm-protected-keys.md), the attack includes access to that trusted SAML token-signing certificate.

- **Attackers can then use the certificate to forge SAML tokens** to impersonate any of the organization's existing users and accounts without requiring access to account credentials, and without leaving any traces.

- **Highly-privileged account access** can also be used to add attacker-controlled credentials to existing applications, enabling attackers to access your system undetected, such as to call APIs, using those permissions.

## Responding to the attack


Responding to systemic identity compromises should include the steps shown in the following image and table:

:::image type="content" source="media/recover-from-identity-compromise/recover-identity-compromise.png" alt-text="Steps to recover from identity compromise.":::


|Step  |Description  |
|---------|---------|
|**Establish secure communications**     |  An organization that has experienced a systemic identity compromise must assume that all communication is affected. Before taking any recovery action, you must ensure that the members of your team who are key to your investigation and response effort [can communicate securely](#establish-secure-communications). <br><br>*Securing communications must be your very first step so that you can proceed without the attacker's knowledge.*|
|**Investigate your environment**   | After you have secured communications on your core investigation team, you can start looking for initial access points and persistence techniques. [Identify your indications of compromise](#identify-indications-of-compromise), and then look for initial access points and persistence. At the same time, start [establishing continuous monitoring operations](#establish-continuous-monitoring) during your recovery efforts.        |
|**Improve security posture**     | [Enable security features and capabilities](#improve-security-posture) following best practice recommendations for improved system security moving forward.  <br><br>Make sure to continue your [continuous monitoring](#establish-continuous-monitoring) efforts as time goes on and the security landscape changes.    |
|**Regain / retain control**     |  You must regain administrative control of your environment from the attacker. After you have control again and have refreshed your system's security posture, make sure to [remediate or block](#remediate-and-retain-administrative-control) all possible persistence techniques and new initial access exploits.       |

## Establish secure communications

Before you start responding, you must be sure that you can communicate safely without the attacker eavesdropping. Make sure to isolate any communications related to the incident so that the attacker is not tipped-off to your investigation and is taken by surprise at your response actions.

For example:

1. For initial one-on-one and group communications, you may want to use PSTN calls, conference bridges that are not connected to the corporate infrastructure, and end-to-end encrypted messaging solutions.

    Communications outside these frameworks should be treated as compromised and untrusted, unless verified through a secure channel.

2. After those initial conversations, you may want to create an entirely new Microsoft 365 tenant, isolated from the organization's production tenant. Create accounts only for key personnel who need to be part of the response.

If you do create a new Microsoft 365 tenant, make sure to follow all best practices for the tenant, and especially for administrative accounts and rights. Limit administrative rights, with no trusts for outside applications or vendors.

> [!IMPORTANT]
> Make sure that you do not communicate about your new tenant on your existing, and potentially compromised, email accounts. 

For more information, see [Best practices for securely using Microsoft 365](https://www.microsoft.com/security/blog/2019/01/10/best-practices-for-securely-using-microsoft-365-the-cis-microsoft-365-foundations-benchmark-now-available/).

## Identify indications of compromise

We recommend that customers follow updates from system providers, including both Microsoft and any partners, and implement any new detections and protections provided and identify published incidents of compromise (IOCs).

Check for updates in the following Microsoft security products, and implement any recommended changes:

- [Microsoft Sentinel](../../sentinel/index.yml)
- [Microsoft 365 security solutions and services](/microsoft-365/security/)
- [Windows 10 Enterprise Security](/windows/security/)
- [Microsoft Defender for Cloud Apps ](/cloud-app-security/)
- [Microsoft Defender for IoT](../../defender-for-iot/organizations/index.yml)

Implementing new updates will help identify any prior campaigns and prevent future campaigns against your system. Keep in mind that lists of IOCs may not be exhaustive, and may expand as investigations continue.

Therefore, we recommend also taking the following actions:

- Make sure that you've applied the [Microsoft cloud security benchmark](/security/benchmark/azure), and are monitoring compliance via [Microsoft Defender for Cloud](../../security-center/index.yml).

- Incorporate threat intelligence feeds into your SIEM, such as by configuring Microsoft Purview Data Connectors in [Microsoft Sentinel](../../sentinel/understand-threat-intelligence.md).

- Make sure that any extended detection and response tools, such as [Microsoft Defender for IoT](../../defender-for-iot/organizations/how-to-work-with-threat-intelligence-packages.md), are using the most recent threat intelligence data.

For more information, see Microsoft's security documentation:

- [Microsoft security documentation](/security/)
- [Azure security documentation](../index.yml)

## Investigate your environment

Once your incident responders and key personnel have a secure place to collaborate, you can start investigating the compromised environment.

You'll need to balance getting to the bottom of every anomalous behavior and taking quick action to stop any further activity by the attacker. Any successful remediation requires an understanding of the initial method of entry and persistence methods that the attacker used, as complete as is possible at the time. Any persistence methods missed during the investigation can result in continued access by the attacker, and a potential recompromise.

At this point, you may want to perform a risk analysis to prioritize your actions. For more information, see:

- [Datacenter threat, vulnerability, and risk assessment](/compliance/assurance/assurance-threat-vulnerability-risk-assessment)
- [Track and respond to emerging threats with threat analytics](/microsoft-365/security/defender-endpoint/threat-analytics)
- [Threat and vulnerability management](/microsoft-365/security/defender-endpoint/next-gen-threat-and-vuln-mgt)

Microsoft's security services provide extensive resources for detailed investigations. The following sections describe top recommended actions.


> [!NOTE]
> If you find that one or more of the listed logging sources is not currently part of your security program, we recommend configuring them as soon as possible to enable detections and future log reviews.
>
> Make sure to configure your log retention to support your organization’s investigation goals going forward. Retain evidence as needed for legal, regulatory, or insurance purposes.
>

### Investigate and review cloud environment logs

Investigate and review cloud environment logs  for suspicious actions and attacker indications of compromise. For example, check the following logs:

- [Unified Audit Logs (UAL)](/powershell/module/exchange/search-unifiedauditlog)
- [Microsoft Entra logs](../../active-directory/reports-monitoring/overview-monitoring.md)
- [Microsoft Exchange on-premises logs](/exchange/mail-flow/transport-logs/transport-logs)
- VPN logs, such as from [VPN Gateway](../../vpn-gateway/vpn-gateway-howto-setup-alerts-virtual-network-gateway-log.md)
- Engineering system logs
- Antivirus and endpoint detection logs

### Review endpoint audit logs

Review your endpoint audit logs for on-premises changes, such as the following types of actions:

- Group membership changes
- New user account creation
- Delegations within Active Directory

Especially consider any of these changes that occur along with other typical signs of compromise or activity.

### Review administrative rights in your environments

Review administrative rights in both your cloud and on-premises environments. For example:

|Environment  |Description  |
|---------|---------|
|**All cloud environments**    |       - Review any privileged access rights in the cloud and remove any unnecessary permissions<br>    - Implement Privileged Identity Management (PIM)<br>    - Set up Conditional Access policies to limit administrative access during hardening      |
|**All on-premises environments**     |       - Review privileged access on-premises and remove unnecessary permissions<br>   - Reduce membership of built-in groups<br>    - Verify Active Directory delegations<br>    - Harden your Tier 0 environment, and limit who has access to Tier 0 assets      |
|**All Enterprise applications**     | Review for delegated permissions and consent grants that allow any of the following actions: <br><br>  - Modifying privileged users and roles <br>- Reading or accessing all mailboxes <br>- Sending or forwarding email on behalf of other users <br>- Accessing all OneDrive or SharePoint site content <br>- Adding service principals that can read/write to the directory      |
|**Microsoft 365 environments**     |Review access and configuration settings for your Microsoft 365 environment, including: <br>- SharePoint Online Sharing <br>- Microsoft Teams <br>- Power Apps <br>- Microsoft OneDrive for Business          |
| **Review user accounts in your environments**   |- Review and remove guest user accounts that are no longer needed. <br>- Review email configurations for delegates, mailbox folder permissions, ActiveSync mobile device registrations, Inbox rules, and Outlook on the Web options. <br>- Review ApplicationImpersonation rights and reduce any use of legacy authentication as much as possible. <br>- Validate that MFA is enforced and that both MFA and self-service password reset (SSPR) contact information for all users is correct.         |

## Establish continuous monitoring

Detecting attacker behavior includes several methods, and depends on the security tools your organization has available for responding to the attack.

For example, Microsoft security services may have specific resources and guidance that's relevant to the attack, as described in the sections below.

> [!IMPORTANT]
> If your investigation finds evidence of administrative permissions acquired through the compromise on your system, which have provided access to your organization's global administrator account and/or trusted SAML token-signing certificate, we recommend taking action to [remediate and retain administrative control](#remediate-and-retain-administrative-control).
>

### Monitoring with Microsoft Sentinel

Microsoft Sentinel has many built-in resources to help in your investigation, such as hunting workbooks and analytics rules that can help detect attacks in relevant areas of your environment.

Use Microsoft Sentinel's content hub to install extended security solutions and data connectors that stream content from other services in your environment. For more information, see:

- [Visualize and analyze your environment](../../sentinel/get-visibility.md)
- [Detect threats out of the box](../../sentinel/detect-threats-built-in.md)
- [Discover and deploy out-of-the-box solutions](../../sentinel/sentinel-solutions-deploy.md)

### Monitoring with Microsoft Defender for IoT

If your environment also includes Operational Technology (OT) resources, you may have devices that use specialized protocols, which prioritize operational challenges over security.

Deploy Microsoft Defender for IoT to monitor and secure those devices, especially any that aren't protected by traditional security monitoring systems. Install Defender for IoT network sensors at specific points of interest in your environment to detect threats in ongoing network activity using agentless monitoring and dynamic threat intelligence.

For more information, see [Get started with OT network security monitoring](../../defender-for-iot/organizations/getting-started.md).


### Monitoring with Microsoft Defender XDR

We recommend that you check Microsoft Defender XDR for Endpoint and Microsoft Defender Antivirus for specific guidance relevant to your attack.

Check for other examples of detections, hunting queries, and threat analytics reports in the Microsoft security center, such as in Microsoft Defender XDR, Microsoft Defender XDR for Identity, and Microsoft Defender for Cloud Apps. To ensure coverage, make sure that you install the [Microsoft Defender for Identity agent](/defender-for-identity/install-step4) on ADFS servers in addition to all domain controllers.

For more information, see:

- [Track and respond to emerging threats with threat analytics](/windows/security/threat-protection/microsoft-defender-atp/threat-analytics)
- [Understand the analyst report in threat analytics](/microsoft-365/security/defender/threat-analytics-analyst-reports)

<a name='monitoring-with-azure-active-directory'></a>

### Monitoring with Microsoft Entra ID

Microsoft Entra sign-in logs can show whether multi-factor authentication is being used correctly. Access sign-in logs directly from the Microsoft Entra area in the Azure portal, use the **Get-AzureADAuditSignInLogs** cmdlet, or view them in the **Logs** area of Microsoft Sentinel.

For example, search or filter the results for when the **MFA results** field has a value of **MFA requirement satisfied by claim in the token**. If your organization uses ADFS and the claims logged are not included in the ADFS configuration, these claims may indicate attacker activity.

Search or filter your results further to exclude extra noise. For example, you may want to include results only from federated domains. If you find suspicious sign-ins, drill down even further based on IP addresses, user accounts, and so on.

The following table describes more methods for using Microsoft Entra logs in your investigation:

|Method  |Description  |
|---------|---------|
|**Analyze risky sign-in events**     |  Microsoft Entra ID and its Identity Protection platform may generate risk events associated with the use of attacker-generated SAML tokens. <br><br>These events might be labeled as *unfamiliar properties*, *anonymous IP address*, *impossible travel*, and so on. <br><br>We recommend that you closely analyze all risk events associated with accounts that have administrative privileges, including any that may have been automatically been dismissed or remediated. For example, a risk event or an anonymous IP address might be automatically remediated because the user passed MFA. <br><br>Make sure to use [ADFS Connect Health](../../active-directory/hybrid/how-to-connect-health-adfs.md) so that all authentication events are visible in Microsoft Entra ID. |
|**Detect domain authentication properties**     |  Any attempt by the attacker to manipulate domain authentication policies will be recorded in the Microsoft Entra audit logs, and reflected in the Unified Audit log. <br><br> For example, review any events associated with **Set domain authentication** in the Unified Audit Log, Microsoft Entra audit logs, and / or your SIEM environment to verify that all activities listed were expected and planned.   |
|**Detect credentials for OAuth applications**     |  Attackers who have gained control of a privileged account may search for an application with the ability to access any user's email in the organization, and then add attacker-controlled credentials to that application. <br><br>For example, you may want to search for any of the following activities, which would be consistent with attacker behavior: <br>- Adding or updating service principal credentials <br>- Updating application certificates and secrets <br>- Adding an app role assignment grant to a user <br>- Adding Oauth2PermissionGrant |
|**Detect e-mail access by applications**     |  Search for access to email by applications in your environment. For example, use the [Microsoft Purview Audit (Premium) features](/microsoft-365/compliance/mailitemsaccessed-forensics-investigations) to investigate compromised accounts. |
|**Detect non-interactive sign-ins to service principals**     | The Microsoft Entra sign-in reports provide details about any non-interactive sign-ins that used service principal credentials.  For example, you can use the sign-in reports to find valuable data for your investigation, such as an IP address used by the attacker to access email applications.        |


## Improve security posture

If a security event has occurred in your systems, we recommend that you reflect on your current security strategy and priorities.

Incident Responders are often asked to provide recommendations on what investments the organization should prioritize, now that it’s been faced with new threats.

In addition to the recommendations documented in this article, we recommend that you consider prioritizing the areas of focus that are responsive to the post-exploitation techniques used by this attacker and the common security posture gaps that enable them.

The following sections list recommendations to improve both general and identity security posture.

### Improve general security posture

We recommend the following actions to ensure your general security posture:

- **Review [Microsoft Secure Score](/microsoft-365/security/mtp/microsoft-secure-score)** for security fundamentals recommendations customized for the Microsoft products and services you consume.

- **Ensure that your organization has extended detection and response (XDR) and security information and event management (SIEM) solutions in place**, such as [Microsoft Defender XDR for Endpoint](/microsoft-365/security/defender/microsoft-365-defender), [Microsoft Sentinel](../../sentinel/overview.md), and [Microsoft Defender for IoT](../../defender-for-iot/organizations/index.yml).

- **Review Microsoft’s [Enterprise access model](/security/compass/privileged-access-access-model)**.

### Improve identity security posture

We recommend the following actions to ensure identity-related security posture:

- **Review Microsoft's [Five steps to securing your identity infrastructure](steps-secure-identity.md)**, and prioritize the steps as appropriate for your identity architecture.

- **[Consider migrating to Microsoft Entra Security Defaults](../../active-directory/fundamentals/concept-fundamentals-security-defaults.md)** for your authentication policy.

- **Eliminate your organization’s use of legacy authentication**, if systems or applications still require it. For more information, see [Block legacy authentication to Microsoft Entra ID with Conditional Access](../../active-directory/conditional-access/block-legacy-authentication.md).

- **Treat your ADFS infrastructure and AD Connect infrastructure as a Tier 0 asset**.

- **Restrict local administrative access to the system**, including the account that is used to run the ADFS service.

    The least privilege necessary for the account running ADFS is the *Log on as a Service* User Right Assignment.

- **Restrict administrative access to limited users and from limited IP address ranges** by using Windows Firewall policies for Remote Desktop.

    We recommend that you set up a Tier 0 jump box or equivalent system.

- **Block all inbound SMB access** to the systems from anywhere in the environment. For more information, see [Beyond the Edge: How to Secure SMB Traffic in Windows](https://techcommunity.microsoft.com/t5/itops-talk-blog/beyond-the-edge-how-to-secure-smb-traffic-in-windows/ba-p/1447159). We also recommend that you stream the Windows Firewall logs to a SIEM for historical and proactive monitoring.

- If you are using a Service Account and your environment supports it, **migrate from a Service Account to a group-Managed Service Account (gMSA)**. If you cannot move to a gMSA, rotate the password on the Service Account to a complex password.

- **Ensure Verbose logging is enabled on your ADFS systems**.

## Remediate and retain administrative control

If your investigation has identified that the attacker has administrative control in the organization’s cloud or on-premises environment, you must regain control in such a way that you ensure that the attacker isn't persistent.

This section provides possible methods and steps to consider when building your administrative control recovery plan.

> [!IMPORTANT]
> The exact steps required in your organization will depend on what persistence you've discovered in your investigation, and how confident you are that your investigation was complete and has discovered all possible entry and persistence methods.
>
> Ensure that any actions taken are performed from a trusted device, built from a [clean source](/security/compass/privileged-access-access-model). For example, use a fresh, [privileged access workstation](/security/compass/privileged-access-deployment).
>

The following sections include the following types of recommendations for remediating and retaining administrative control:

- Removing trust on your current servers
- Rotating your SAML token-signing certificate, or replacing your ADFS servers if needed
- Specific remediation activities for cloud or on-premises environments

### Remove trust on your current servers

If your organization has lost control of the token-signing certificates or federated trust, the most assured approach is to remove trust, and switch to cloud-mastered identity while remediating on-premises.

Removing trust and switching to cloud-mastered identity requires careful planning and an in-depth understanding of the business operation effects of isolating identity. For more information, see [Protecting Microsoft 365 from on-premises attacks](../../active-directory/fundamentals/protect-m365-from-on-premises-attacks.md).

### Rotate your SAML token-signing certificate

If your organization decides *not* to [remove trust](#remove-trust-on-your-current-servers) while recovering administrative control on-premises, you'll have to rotate your SAML token-signing certificate after having regained administrative control on-premises, and blocked the attackers ability to access the signing certificate again.

Rotating the token-signing certificate a single time still allows the previous token-signing certificate to work. Continuing to allow previous certificates to work is a built-in functionality for normal certificate rotations, which permits a grace period for organizations to update any relying party trusts before the certificate expires.

If there was an attack, you don't want the attacker to retain access at all. Make sure that the attacker doesn't retain the ability to forge tokens for your domain.

For more information, see:

- [Revoke user access in Microsoft Entra ID](../../active-directory/enterprise-users/users-revoke-access.md)


### Replace your ADFS servers

If, instead of rotating your SAML token-signing certificate, you decide to replace the ADFS servers with clean systems, you'll need to remove the existing ADFS from your environment, and then build a new one. 

For more information, see [Remove a configuration](../../active-directory/cloud-sync/how-to-configure.md#remove-a-configuration). 

### Cloud remediation activities

In addition to the recommendations listed earlier in this article, we also recommend the following activities for your cloud environments:

|Activity  |Description  |
|---------|---------|
|**Reset passwords**     |   Reset passwords on any [break-glass accounts](../../active-directory/roles/security-emergency-access.md) and reduce the number of break-glass accounts to the absolute minimum required.    |
|**Restrict privileged access accounts**     |    Ensure that service and user accounts with privileged access are cloud-only accounts, and do not use on-premises accounts that are synced or federated to Microsoft Entra ID.  |
|**Enforce MFA**     | Enforce Multi-Factor Authentication (MFA) across all elevated users in the tenant. We recommend enforcing MFA across all users in the tenant.       |
|**Limit administrative access**     |    Implement [Privileged Identity Management](../../active-directory/privileged-identity-management/pim-configure.md) (PIM) and conditional access to limit administrative access.  <br><br>For Microsoft 365 users, implement [Privileged Access Management](https://techcommunity.microsoft.com/t5/microsoft-security-and/privileged-access-management-in-office-365-is-now-generally/ba-p/261751) (PAM) to limit access to sensitive abilities, such as eDiscovery, Global Admin, Account Administration, and more.    |
|**Review / reduce delegated permissions and consent grants**     |  Review and reduce all Enterprise Applications delegated permissions or [consent grants](/graph/auth-limit-mailbox-access) that allow any of the following functionalities: <br><br>- Modification of privileged users and roles <br>- Reading, sending email, or accessing all mailboxes <br>- Accessing OneDrive, Teams, or SharePoint content <br>- Adding Service Principals that can read/write to the directory <br>- Application Permissions versus Delegated Access       |

### On-premises remediation activities

In addition to the recommendations listed earlier in this article, we also recommend the following activities for your on-premises environments:

|Activity  |Description  |
|---------|---------|
|**Rebuild affected systems**     |   Rebuild systems that were identified as compromised by the attacker during your investigation.      |
|**Remove unnecessary admin users**     |   Remove unnecessary members from Domain Admins, Backup Operators, and Enterprise Admin groups. For more information, see [Securing Privileged Access](/security/compass/overview). |
|**Reset passwords to privileged accounts**     |  Reset passwords of all privileged accounts in the environment. <br><br>**Note**: Privileged accounts are not limited to built-in groups, but can also be groups that are delegated access to server administration, workstation administration, or other areas of your environment.      |
|**Reset the krbtgt account**     | Reset the **krbtgt** account twice using the [New-KrbtgtKeys](https://github.com/microsoft/New-KrbtgtKeys.ps1/blob/master/New-KrbtgtKeys.ps1) script. <br><br>**Note**: If you are using Read-Only Domain Controllers, you will need to run the script separately for Read-Write Domain Controllers and for Read-Only Domain Controllers.        |
|**Schedule a system restart**     |   After you validate that no persistence mechanisms created by the attacker exist or remain on your system, schedule a system restart to assist with removing memory-resident malware. |
|**Reset the DSRM password**     |  Reset each domain controller’s DSRM (Directory Services Restore Mode) password to something unique and complex.       |

### Remediate or block persistence discovered during investigation

Investigation is an iterative process, and you'll need to balance the organizational desire to remediate as you identify anomalies and the chance that remediation will alert the attacker to your detection and give them time to react.

For example, an attacker who becomes aware of the detection might change techniques or create more persistence.

Make sure to remediate any persistence techniques that you've identified in earlier stages of the investigation.

### Remediate user and service account access

In addition to the recommended actions listed above, we recommend that you consider the following steps to remediate and restore user accounts:

- **Enforce conditional access based on trusted devices**. If possible we recommend that you enforce *location-based conditional access* to suit your organizational requirements.

- **Reset passwords** after eviction for any user accounts that may have been compromised. Make sure to also implement a mid-term plan to reset credentials for all accounts in your directory.

- **Revoke refresh tokens** immediately after rotating your credentials.

    For more information, see:

    - [Revoke user access in an emergency in Microsoft Entra ID](../../active-directory/enterprise-users/users-revoke-access.md)

## Next steps

- **Get help from inside Microsoft products**, including the Microsoft Defender XDR portal, Microsoft Purview compliance portal, and Office 365 Security & Compliance Center by selecting the **Help** (**?**) button in the top navigation bar.

- **For deployment assistance**, contact us at [FastTrack](https://fasttrack.microsoft.com)

- **If you have product support-related needs**, file a [Microsoft support case](https://support.microsoft.com/contactus).

    > [!IMPORTANT]
    > If you believe you have been compromised and require assistance through an incident response, open a **Sev A** Microsoft support case.
    >
