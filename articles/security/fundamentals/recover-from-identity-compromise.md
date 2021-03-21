---
title: Use Microsoft security resources to help recover from systemic identity compromise | Microsoft Docs
description: Learn how to use Microsoft security resources and recommendations to secure your system against systemic-identity compromises similar to the SolarWinds attack (Solorigate).
services: sentinel
documentationcenter: na
author: batamig
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/16/2021
ms.author: bagol

---

# Recovering from systemic identity compromise

This article describes Microsoft resources and recommendations for recovering from a systemic identity compromise attack against your organization, such as the [Nobelium](https://aka.ms/solorigate) attack of December 2020.

> [!IMPORTANT]
> This information is provided as-is and constitutes generalized guidance; the ultimate determination about how to apply this guidance to your IT environment and tenant(s) must consider your unique environment and needs, which each Customer is in the best position to determine.

## Overview

An advanced attack on an organization occurs when an attacker successfully gains a foothold into the organization's network and elevated credentials.

Intruders who are able to use administrator permissions, acquired through an on-premises compromise, can gain access to the organization's trusted SAML token-signing certificate, and then forge SAML tokens to impersonate any of the organization's existing users and accounts. 

Highly privileged account access can then be used to add illegitimate credentials to existing applications, enabling the attacker to call APIs with the illegitimate permissions.

The response to such an advanced attack should include the following objectives:

1. **Establish secure communications** for personnel key to the investigation and response effort.

1. **Investigate the environment** for persistence and initial access point, while establishing continuous monitoring operations during recovery efforts.

1. **Regain and retain administrative control** of your environment and remediate or block possible persistence techniques and initial access exploits.

1. **Improve posture** by enabling security features and capabilities following best practice recommendations.


## Establish secure communications and productivity

Before you start responding, you must be sure that you can communicate safely without the attacker eavesdropping. Make sure to isolate any communications related to the incident so that the attacker is not tipped-off to your investigation and is taken by surprise at your response actions.

For example, for initial one-on-one and group communications, you may want to use PSTN calls, conference bridges that are not connected to the corporate infrastructure, and end-to-end encrypted messaging solutions.

After those initial conversations, you may want to create an entirely new Office 365 tenant, isolated from the organization's production tenant. Create accounts only for key personnel who need to be part of the response.

If you do create a new Office 365 tenant, make sure to follow all best practices for the tenant, and especially for administrative accounts and rights. Limit administrative rights, with no trusts for outside applications or vendors. 

For more information, see [Best practices for securely using Microsoft 365](https://www.microsoft.com/security/blog/2019/01/10/best-practices-for-securely-using-microsoft-365-the-cis-microsoft-365-foundations-benchmark-now-available/).

## Identify indications of compromise

We recommend that customers follow updates from system providers, including both Microsoft and any partners, and implement any new detections and protections provided and identify published incidents of compromise (IOCs).

For example, check for updates in the following Microsoft security products, and implement any recommended changes:

- [Azure Sentinel](/azure/sentinel/)
- [Microsoft 365 security solutions and services](/microsoft-365/security/)
- [Windows 10 Enterprise Security](/windows/security/)
- [Microsoft Cloud App Security ](/cloud-app-security/)

For more information, see Microsoft's security documentation:

- [Microsoft security documentation](/security/)
- [Azure security documentation](/azure/security/)

> [!NOTE]
> Implementing new updates will help identify any prior campaigns and prevent future campaigns against your system.
>
> Keep in mind that lists of IOCs may not be exhaustive, and may expand as investigations continue.
>
## Investigate your environment

Once your incident responders and key personnel have a secure place to collaborate, you can start investigating the compromised environment.

You'll need to balance out getting to the bottom of every anomalous behavior and taking quick action to stop any further activity by the attacker. Any successful remediation requires an understanding of the initial method of entry and persistence methods that the attacker used, as complete as is possible at the time. Any persistence methods missed during the investigation can result in continued access by the attacker, and a potential recompromise.

Microsoft's security services provide extensive resources for detailed investigations. The following sections describe top recommended actions.

> [!NOTE]
> If you find that one or more of the listed logging sources is not currently part of your security program, we recommend configuring them as soon as possible to enable detections and future log reviews.
>
> Make sure to configure your log retention to support your organization’s investigation goals going forward. Retain evidence as needed for legal, regulatory, or insurance purposes.
>



### Investigate and review cloud environment logs

Investigate and review cloud environment logs  for suspicious actions and attacker indications of compromise. For example, check the following logs:

- [Unified Audit Logs (UAL)](/powershell/module/exchange/search-unifiedauditlog)
- [Azure Active Directory (Azure AD) logs](/azure/active-directory/reports-monitoring/overview-monitoring)
- [Microsoft Exchange on-premises logs](/exchange/mail-flow/transport-logs/transport-logs)
- VPN logs, such as from [VPN Gateway](/azure/vpn-gateway/vpn-gateway-howto-setup-alerts-virtual-network-gateway-log)
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
|**All cloud environments**    |       - Review any privileged access rights in the cloud and remove any unnecessary permissions. <br>    - Implement Privileged Identity Management (PIM)<br>    - Set up Conditional Access policies to limit administrative access during hardening      |
|**All on-premises environments**     |       - Review privileged access on-premise and remove unnecessary permissions.<br>   - Reduce membership of built-in groups<br>    - Verify Active Directory delegations<br>    - Harden your Tier 0 environment, and limit who has access to Tier 0 assets      |
|**All Enterprise applications**     | Review for delegated permissions and consent grants that allow any of the following actions: <br><br>  Modifying privileged users and roles <br>- Reading or accessing all mailboxes <br>- Sending or forwarding email on behalf of other users <br>- Accessing all OneDrive or SharePoint site content <br>- Adding service principals that can read/write to the directory      |
|**Office 365 environments**     |Review access and configuration settings for your Office 365 environment, including: <br>- SharePoint Online Sharing <br>- Microsoft Teams <br>- PowerApps <br>- Microsoft OneDrive for Business          |
| **Review user accounts in your environments**   |- Review and remove guest user accounts that are no longer needed. <br>- Review email configurations for delegates, mailbox folder permissions, ActiveSync mobile device registrations, Inbox rules, and Outlook on the Web options <br>- Validate that both MFA and self-service password reset (SSPR) contact information for all users is correct.         |
|     |         |

## Establish continuous monitoring

Detecting attacker behavior includes several methods, and depends on the security tools your organization has available for responding to the attack.

For example, the following Microsoft security services may have specific resources and guidance that is relevant to the attack:

- **Azure Sentinel** may have built-in resources to help in your investigation, such as [hunting workbooks](/azure/sentinel/quickstart-get-visibility)

- **Microsoft Defender for Endpoint** and **Microsoft Defender Antivirus** may have specific guidance relevant to your attack

- **Azure Active Directory** sign-in logs can show whether multi-factor authentication is being used correctly. Access sign-in logs from directly from the Azure Active Directory area in the Azure portal, or use the **Get-AzureADAuditSignInLogs** cmdlet.

    For example, search or filter the results for when the **MFA results** field has a value of **MFA requirement satisfied by claim in the token**. If your organization uses ADFS and the claims logged are not included in the ADFS configuration, these claims may indicate attacker activity.

    Search or filter your results further to exclude extra noise. For example, you may want to include results only from federated domains. If you find suspicious sign-ins, drill down even further based on IP addresses, user accounts, and so on.

    For more information, see [More Azure Active Directory monitoring methods](#more-azure-active-directory-monitoring-methods).

> [!IMPORTANT]
> If your investigation finds evidence of administrative permissions acquired through the compromise on your system, which have provided access to your organization's global administrator account and/or trusted SAML token-signing certificate, we recommend taking action to [remediate and retain administrative control](#remediate-and-retain-administrative-control).
> 

### More Azure Active Directory monitoring methods

The following table describes more methods for using Azure Active directory logs in your investigation:

|Method  |Description  |
|---------|---------|
|**Analyze risky sign-in events**     |  Azure Active Directory and its Identity Protection platform may generate risk events associated with the use of attacker-generated SAML tokens. <br><br>These events might be labeled as *unfamiliar properties*, *anonymous IP address*, *impossible travel*, and so on. <br><br>We recommend that you closely analyze all risk events associated with accounts that have administrative privileges, including any that may have been automatically been dismissed or remediated. For example, a risk event or an anonymous IP address might be automatically remediated because the user passed MFA. |
|**Detect domain authentication properties**     |  Any attempt by the attacker to manipulate domain authentication policies will be recorded in the Azure Active Directory Audit logs, and reflected in the Unified Audit log. <br><br> For example, review any events associated with **Set domain authentication** in the Unified Audit Log, Azure AD Audit logs, and / or your SIEM environment to verify that all activities listed were expected and planned.   |
|**Detect credentials for OAuth applications**     |  Attackers who have gained control of a privileged account may search for an application with the ability to access any user's email in the organization, and then add attacker-controlled credentials to that application. <br><br>For example, you may want to search for any of the following activities, which would be consistent with attacker behavior: <br>- Adding or updating service principal credentials <br>- Updating application certificates and secrets <br>- Adding an app role assignment grant to a user <br>- Adding Oauth2PermissionGrant |
|**Detect e-mail access by applications**     |  Search for access to email by applications in your environment. For example, use the [Office 365 Advanced Auditing features](/microsoft-365/compliance/mailitemsaccessed-forensics-investigations) to investigate compromised accounts. |
|**Detect non-interactive sign-ins to service principals**     | The Azure Active Directory sign-in reports provide details about any non-interactive sign-ins that used service principal credentials.  For example, you can use the sign-in reports to find valuable data for your investigation, such as an IP address used by the attacker to access email applications.        |
|     |         |


## Remediate and retain administrative control

If your investigation has identified that the attacker has administrative control in the organization’s cloud or on-premises environment, you must regain control in such a way that you ensure that the attacker isn't persistent.

This section provides possible methods and steps to consider when building your administrative control recovery plan.

> [!IMPORTANT]
> The exact steps required in your organization will depend on what persistence you've discovered in your investigation, and how confident you are that your investigation was complete and has discovered all possible entry and persistence methods.
>
> Ensure that any actions taken are performed from a trusted device, built from a [clean source](/windows-server/identity/securing-privileged-access/securing-privileged-access-reference-material). For example, use a fresh, [privileged access workstation](/security/compass/concept-azure-managed-workstation).
>
### Remove trust on your current servers

If your organization has lost control of the token-signing certificates or federated trust, the most assured approach is to remove trust, and switch to cloud-mastered identity while remediating on-premises.

Removing trust and switching to cloud-mastered identity requires careful planning and an in-depth understanding of the business operation effects of isolating identity. For more information, see [Protecting Microsoft 365 from on-premises attacks](/azure/active-directory/fundamentals/protect-m365-from-on-premises-attacks).

### Rotate your SAML token-signing certificate

If your organization decides *not* to [remove trust](#remove-trust-on-your-current-servers) while recovering administrative control on-premises, you'll have to rotate your SAML token-signing certificate after having regained administrative control on-premises, and blocked the attackers ability to access the signing certificate again.

Rotating the token-signing certificate a single time still allows the previous token-signing certificate to work. Continuing to allow previous certificates to work is a built-in functionality for normal certificate rotations, which permits a grace period for organizations to update any relying party trusts before the certificate expires.

If there was an attack, you don't want the attacker to retain access at all. Make sure to use the following steps to ensure that the attacker doesn't maintain the ability to forge tokens for your domain.

> [!CAUTION]
> The last step in this procedure logs users out of their phones, current webmail sessions, and any other items that are using the associated tokens and refresh tokens.
>

> [!TIP]
> Performing these steps in your ADFS environment creates both a primary and secondary certificate, and automatically promotes the secondary certificate to primary after a default period of 5 days.
>
> If you have Relying Party Trusts, this may have effects 5 days after the initial ADFS environment change, and should be accounted for in your plan. You can also resolve this by replacing the primary certificate a third time, using the **Urgent** flag again, and removing the secondary certificate or turning off automatic certificate rotation.
>

**To fully rotate the token-signing certificate, and prevent new token forging by an attacker**

1. Check to make sure that your **AutoCertificateRollover** parameter is set to **True**:

    ``` powershell
    Get-AdfsProperties | FL AutoCert*, Certificate*
    ```
    If **AutoCertificateRollover** isn't set to **True**, set the value as follows:

    ``` powershell
    Set-ADFSProperties -AutoCertificateRollover $true
    ```

1. Connect to the Microsoft Online Service:

    ``` powershell
    Connect-MsolService
    ```

1. Run the following command and make a note of your on-premises and cloud token signing certificate thumbprint and expiration dates:

    ``` powershell
    Get-MsolFederationProperty -DomainName <domain>
    ```

    For example:

    ```powershell
    ...
    [Not Before]
        12/9/2020 7:57:13 PM

    [Not After]
        12/9/2021 7:57:13 PM

    [Thumbprint]
        3UD1JG5MEFONKT6DQEF6D98EI8AHNTY22XPQWJFK6
    ```

1. Replace the primary token signing certificate using the **Urgent** switch. This command causes ADFS to replace the primary certificate immediately, without making it a secondary certificate:

    ```powershell
    Update-AdfsCertificate -CertificateType Token-Signing -Urgent
    ```

1. Create a secondary Token Signing certificate, without the **Urgent** switch. This command allows for two on-premises token signing certificates before synching with Azure Cloud.

    ```powershell
    Update-AdfsCertificate -CertificateType Token-Signing
    ```

1. Update the cloud environment with both the primary and secondary certificates on-premises to immediately remove the cloud published token signing certificate.

    ```powershell
    Update-MsolFederatedDomain -DomainName <domain>
    ```

    > [!IMPORTANT]
    > If this step is not performed using this method, the old token signing certificate may still be able to authenticate users.

1. To ensure that these steps have been performed correctly, verify that the certificate displayed before in step 3 is now removed:

    ```powershell
    Get-MsolFederationProperty -DomainName <domain>
    ```

1. Revoke your refresh tokens via PowerShell, to prevent access with the old tokens. 

    For more information, see:

    - [Revoke user access in Azure Active Directory](/azure/active-directory/enterprise-users/users-revoke-access)
    - [Revoke-AzureADUserAllRefreshToken PowerShell docs](/powershell/module/azuread/revoke-azureaduserallrefreshtoken)



### Replace your ADFS servers

If, instead of [rotating your SAML token-signing certificate](#rotate-your-saml-token-signing-certificate), you decide to replace the ADFS servers with clean systems, remove the existing ADFS from your environment, and then build a new one. 

For more information, see [Remove a configuration](/azure/active-directory/cloud-provisioning/how-to-configure#remove-a-configuration). 

### More cloud remediation activities

We also recommend the following activities for your cloud environments:

|Activity  |Description  |
|---------|---------|
|**Reset passwords**     |   Reset passwords on any [break-glass accounts](/azure/active-directory/roles/security-emergency-access) and reduce the number of break-glass accounts to the absolute minimum required.    |
|**Privileged access accounts**     |    Ensure that service and user accounts with privileged access are cloud-only accounts, and do not use on-premise accounts that are synced or federated to Azure Active Directory.  |
|**Enforce MFA**     | Enforce Multi-Factor Authentication (MFA) across all elevated users in the tenant. We recommend enforcing MFA across all users in the tenant.       |
|**Limit administrative access**     |    Implement [Privileged Identity Management](/azure/active-directory/privileged-identity-management/pim-configure) (PIM) and conditional access to limit administrative access.  <br><br>For Office 365 users, implement [Privileged Access Management](https://techcommunity.microsoft.com/t5/microsoft-security-and/privileged-access-management-in-office-365-is-now-generally/ba-p/261751) (PAM) to limit access to sensitive abilities, such as eDiscovery, Global Admin, Account Administration, and more.    |
|**Review / reduce delegated permissions and consent grants**     |  Review and reduce all Enterprise Applications delegated permissions or [consent grants](/graph/auth-limit-mailbox-access) that allow any of the following functionalities: <br><br>- Modification of privileged users and roles. <br>- Reading, sending email, or accessing all mailboxes. <br>- Accessing OneDrive, Teams, or SharePoint content. <br>- Adding Service Principals that can read/write to the directory. <br>- Application Permissions versus Delegated Access.       |
|     |         |

### More on-premises remediation activities

We also recommend the following activities for your on-premises environments:

|Activity  |Description  |
|---------|---------|
|**Rebuild affected systems**     |   Rebuild systems that were identified as compromised by the attacker during your investigation.      |
|**Remove unnecessary admin users**     |   Remove unnecessary members from Domain Admins, Backup Operators, and Enterprise Admin groups. For more information, see [Securing Privileged Access](/security/compass/overview). |
|**Reset passwords to privileged accounts**     |  Reset passwords of all privileged accounts in the environment. <br><br>**Note**: Privileged accounts are not limited to built-in groups, but can also be groups that are delegated access to server administration, workstation administration, or other areas of your environment.      |
|**Reset the krbtgt account**     | Reset the **krbtgt** account twice using the [New-KrbtgtKeys](https://github.com/microsoft/New-KrbtgtKeys.ps1/blob/master/New-KrbtgtKeys.ps1) script. <br><br>**Note**: If you are using Read-Only Domain Controllers, you will need to run the script separately for Read-Write Domain Controllers and for Read-Only Domain Controllers.        |
|**Schedule a system restart**     |   After you validate that no persistence mechanisms created by the attacker exist or remain on your system, schedule a system restart to assist with removing memory-resident malware. |
|**Reset the DSRM password**     |  Reset each domain controller’s DSRM (Directory Services Restore Mode) password to something unique and complex.       |
|     |         |

### Remediate or block persistence discovered during investigation

Investigation is an iterative process, and you'll need to balance the organizational desire to remediate as you identify anomalies and the chance that remediation will alert the attacker to your detection and give them time to react.

For example, an attacker who becomes aware of the detection might change techniques or create more persistence.

Make sure to remediate any persistence techniques that you've identified in earlier stages of the investigation.

> [!TIP]
> For Office 365 accounts, you can automatically remediate known persistence techniques, if any are discovered, using the scripts provided. <!-- what are these?-->
> 
### Remediate user and service account access

In addition to the recommended actions listed above, we recommend that you consider the following steps to remediate and restore user accounts:

- **Enforce conditional access based on trusted devices**. If possible we recommend that you enforce *location-based conditional access* to suit your organizational requirements.

- **Reset passwords** after eviction for any user accounts that may have been compromised. Make sure to also implement a mid-term plan to reset credentials for all accounts in your directory.

- **Revoke refresh tokens** immediately after rotating your credentials.

    For more information, see:

    - [Revoke user access in an emergency in Azure Active Directory](/azure/active-directory/enterprise-users/users-revoke-access)
    - [Revoke-AzureADUserAllRefreshToken PowerShell documentation](/powershell/module/azuread/revoke-azureaduserallrefreshtoken)

## Improve security posture

After a security event is a good time for organizations to reflect on their security strategy and priorities.

Incident Responders are often asked to provide recommendations after an event on what investments the organization should prioritize, now that it’s been faced with new threats.

In addition to the recommendations documented in this article, we recommend that you consider prioritizing the areas of focus that are responsive to the post-exploitation techniques used by this attacker and the common security posture gaps that enable them.


### General security posture

We recommend the following actions to ensure your general security posture:

- **Review [Microsoft Secure Score](/microsoft-365/security/mtp/microsoft-secure-score)** for security fundamentals recommendations customized for the Microsoft products and services you consume.

- **Ensure that your organization has EDR and SIEM solutions in place**.

- **Review Microsoft’s [Enterprise access model](/security/compass/privileged-access-access-model)**.

### Identity security posture

We recommend the following actions to ensure identity-related security posture:

- **Review Microsoft's [Five steps to securing your identity infrastructure](steps-secure-identity.md)**, and prioritize the steps as appropriate for your identity architecture.

- **[Consider migrating to Azure AD Security Defaults](/azure/active-directory/fundamentals/concept-fundamentals-security-defaults)** for your authentication policy.

- **Eliminate your organization’s use of legacy authentication**, if systems or applications still require it. For more information, see [Block legacy authentication to Azure AD with Conditional Access](/azure/active-directory/conditional-access/block-legacy-authentication).

    > [!NOTE]
    > The Exchange Team is planning to [disable Basic Authentication for the EAS, EWS, POP, IMAP, and RPS protocols](https://developer.microsoft.com/en-us/office/blogs/deferred-end-of-support-date-for-basic-authentication-in-exchange-online/) in the second half of 2021.
    >
    > As a point of clarity, Security Defaults and Authentication Policies are separate but provide complementary features.
    >
    > We recommend that customers use Authentication Policies to turn off Basic Authentication for a subset of Exchange Online protocols or to gradually turn off Basic Authentication across a large organization.
    >

- **Treat your ADFS infrastructure and AD Connect infrastructure as a Tier 0 asset**.

- **Restrict local administrative access to the system**, including the account that is used to run the ADFS service.

    The least privilege necessary for the account running ADFS is the *Log on as a Service* User Right Assignment.

- **Restrict administrative access to limited users and from limited IP address ranges** by using Windows Firewall policies for Remote Desktop.

    We recommend that you set up a Tier 0 jump box or equivalent system.

- **Block all inbound SMB access** to the systems from anywhere in the environment. For more information, see [Beyond the Edge: How to Secure SMB Traffic in Windows](https://techcommunity.microsoft.com/t5/itops-talk-blog/beyond-the-edge-how-to-secure-smb-traffic-in-windows/ba-p/1447159). We also recommend that you 
stream the Windows Firewall logs to a SIEM for historical and proactive monitoring.

- If you are using a Service Account and your environment supports it, **migrate from a Service Account to a group-Managed Service Account (gMSA)**. If you cannot move to a gMSA, rotate the password on the Service Account to a complex password.

- **Ensure Verbose logging is enabled on your ADFS systems** by running the following commands:

    ```powershell
    Set-AdfsProperties -AuditLevel verbose
    Restart-Service -Name adfssrv
    Auditpol.exe /set /subcategory:”Application Generated” /failure:enable /success:enable
    ```

## Next steps

- **Get help from inside Microsoft products**, including the Microsoft 365 security center, Office 365 Security & Compliance center, and Microsoft Defender Security Center by selecting the **?** button in the top navigation bar.

- **For deployment assistance**, contact us at [FastTrack](https://fasttrack.microsoft.com)

- **If you have product support-related needs**, file a Microsoft support case at https://support.microsoft.com/contactus.

    > [!IMPORTANT]
    > If you believe you have been compromised and require assistance through an incident response, open a **Sev A** Microsoft support case.
    >