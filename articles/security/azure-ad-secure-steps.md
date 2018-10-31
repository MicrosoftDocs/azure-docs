---
title: Five steps to secure your identity infrastructure in Azure Active Directory
description: This document outlines a list of important actions administrators should implement to help them secure their organization using Azure AD capabilities
services: active-directory
author: martincoetzer
manager: manmeetb
tags: azuread
ms.service: active-directory
ms.topic: conceptual
ms.workload: identity
ms.date: 06/18/2018
ms.author: martincoetzer
---

# Five steps to securing your identity infrastructure

If you're reading this document, you're aware of the significance of security. You likely already carry the responsibility for securing your organization. If you need to convince others of the importance of security, send them to read the latest [Microsoft Security Intelligence report](https://www.microsoft.com/security/intelligence-report).

This document will help you get a more secure posture using the capabilities of Azure Active Directory by using a five-step checklist to inoculate your organization against cyber-attacks.

This checklist will help you quickly deploy critical recommended actions to protect your organization immediately by explaining how to:

* Strengthen your credentials.
* Reduce your attack surface area.
* Automate threat response.
* Increase your awareness of auditing and monitoring.
* Enable more predictable and complete end-user security with self-help.

> [!NOTE]
> Many of the recommendations in this document apply only to applications that are configured to use Azure Active Directory as their identity provider. Configuring apps for Single Sign-On assures the benefits of credential policies, threat detection, auditing, logging, and other features add to those applications. [Single sign-on through Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-enterprise-apps-manage-sso) is the foundation - on which all these recommendations are based.

## Before you begin: Protect privileged accounts with MFA

Before you begin this checklist, make sure you don't get compromised while you're reading this checklist. You first need to protect your privileged accounts.

Attackers who get control of privileged accounts can do tremendous damage, so it's critical to protect these accounts first. Enable and require [Azure Multi-Factor Authentication](https://docs.microsoft.com/azure/multi-factor-authentication/multi-factor-authentication) (MFA) for all administrators in your organization using [Baseline Protection](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-baseline-protection). If you haven't implemented MFA, do it now! It's that important.

All set? Let's get started on the checklist.

## Step 1 - Strengthen your credentials 

Most enterprise security breaches originate with an account compromised with one of a handful of methods such as password spray, breach replay, or phishing. Learn more about these attacks in this video (1h 15m):
> [!VIDEO https://channel9.msdn.com/events/Ignite/Microsoft-Ignite-Orlando-2017/BRK3016/player]

If users in your identity system are using weak passwords and not strengthening them with multi-factor authentication, it isn't a matter of if or when you get compromised – just "how often."

### Make sure your organization use strong authentication

Given the frequency of passwords being guessed, phished, stolen with malware, or reused, it's critical to back the password with some form of strong credential – learn more about [Azure Multi-Factor Authentication](https://docs.microsoft.com/azure/multi-factor-authentication/multi-factor-authentication).

### Turn off traditional complexity, expiration rules, and start banning commonly attacked passwords instead

Many organizations use the traditional complexity (for example, special characters) and password expiration rules. Microsoft's research has shown these policies are harmful, causing users to choose passwords that are easier to guess.

Microsoft's recommendations, consistent with [NIST guidance](https://pages.nist.gov/800-63-3/sp800-63b.html), are to implement the following three:

1. Require passwords have at least 8 characters. Longer isn't necessarily better, as they cause users to choose predictable passwords, save passwords in files, or write them down.
2. Disable expiration rules, which drive users to easily guessed passwords such as **Summer2018!**.
3. Disable character-composition requirements and prevent users from choosing commonly attacked passwords, as they cause users to choose predictable character substitutions in passwords.

You can use [PowerShell to prevent passwords from expiring](https://docs.microsoft.com/azure/active-directory/authentication/concept-sspr-policy) on users if you create identities in Azure AD directly. Organizations using on-premises AD with Azure AD Connect to sync identities to Azure AD (also known as a hybrid deployment), should implement on-premises [intelligent password policies](https://aka.ms/passwordguidance) using [domain group policy settings](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/hh994572(v%3dws.10)) or [Windows PowerShell](https://docs.microsoft.com/powershell/module/addsadministration/set-addefaultdomainpasswordpolicy).

Azure Active Directory's [dynamic banned password](https://docs.microsoft.com/azure/active-directory/active-directory-secure-passwords) feature uses current attacker behavior to prevent users from setting passwords that can easily be guessed. This capability is always on and organizations with a hybrid deployment can benefit from this feature by enabling [password writeback](https://docs.microsoft.com/azure/active-directory/authentication/howto-sspr-writeback) or they can deploy [Azure AD password protection for Windows Server Active Directory](https://docs.microsoft.com/azure/active-directory/authentication/concept-password-ban-bad-on-premises). Azure AD password protection blocks users from choosing common passwords in general and custom passwords you can configure.

### Protect against leaked credentials and add resilience against outages

If your organization uses a hybrid identity solution, then you should enable password hash synchronization for the following two reasons:

* The [Users with leaked credentials](https://docs.microsoft.com/azure/active-directory/active-directory-reporting-risk-events) report in the Azure AD management warns you of username and password pairs, which have been exposed on the "dark web." An incredible volume of passwords is leaked via phishing, malware, and password reuse on third-party sites that are later breached. Microsoft finds many of these leaked credentials and will tell you, in this report, if they match credentials in your organization – but only if you [enable password hash synchronization](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnectsync-implement-password-hash-synchronization)!
* In the event of an on-premises outage (for example, in a ransomware attack) you'll be able to switch over to [cloud authentication using password hash synchronization](https://docs.microsoft.com/azure/security/azure-ad-choose-authn). This backup authentication method will allow you to continue accessing apps configured for authentication with Azure Active Directory, including Office 365.

Learn more about how [password hash synchronization](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnectsync-implement-password-hash-synchronization) works.

### Implement AD FS extranet lockout

Organizations, which configure applications to authenticate directly to Azure AD benefit from [Azure AD smart lockout](https://docs.microsoft.com/azure/active-directory/active-directory-secure-passwords). If you use AD FS in Windows Server 2012R2, implement AD FS [extranet lockout protection](https://docs.microsoft.com/windows-server/identity/ad-fs/operations/configure-ad-fs-extranet-soft-lockout-protection). If you use AD FS on Windows Server 2016, implement [extranet smart lockout](https://support.microsoft.com/en-us/help/4096478/extranet-smart-lockout-feature-in-windows-server-2016). AD FS Smart Extranet lockout protects against brute force attacks, which target AD FS while preventing users from being locked out in Active Directory.

### Take advantage of intrinsically secure, easier to use credentials

Using [Windows Hello](https://docs.microsoft.com/windows/security/identity-protection/hello-for-business/hello-identity-verification), you can replace passwords with strong two-factor authentication on PCs and mobile devices. This authentication consists of a new type of user credential that is tied to a device and uses a biometric or PIN.

## Step 2 - Reduce your attack surface

Given the pervasiveness of password compromise, minimizing the attack surface in your organization is critical. Eliminating use of older, less secure protocols, limiting access entry points, and exercising more significant control of administrative access to resources can help reduce the attack surface area.

### Block legacy authentication

Apps using their own legacy methods to authenticate with Azure AD and access company data, pose another risk for organizations. Examples of apps using legacy authentication are POP3, IMAP4, or SMTP clients. Legacy authentication apps authenticate on behalf of the user and prevent Azure AD from doing advanced security evaluations. The alternative, modern authentication, will reduce your security risk, because it supports multi-factor authentication and conditional access. We recommend the following three actions:

1. Block [legacy authentication if you use AD FS](https://docs.microsoft.com/windows-server/identity/ad-fs/operations/access-control-policies-w2k12).
2. Setup [SharePoint Online and Exchange Online to use modern authentication](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-no-modern-authentication).
3. Use [Conditional access policies to block legacy authentication](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-conditions#legacy-authentication).

### Block invalid authentication entry points

Using the assume breach mentality, you should reduce the impact of compromised user credentials when they happen. For each app in your environment consider the valid use cases: which groups, which networks, which devices and other elements are authorized – then block the rest. Take care to restrict the use of [highly privileged or service accounts](https://docs.microsoft.com/azure/active-directory/admin-roles-best-practices). With [Azure AD conditional access](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-azure-portal), you can control how authorized users access their apps and resources based on specific conditions you define.

Pay particular attention to service accounts (accounts used to do tasks in an automated fashion). Using Conditional Access, you can make sure such accounts can only run against the service, from the IP, and at the time of day, which is appropriate.

### Implement Azure AD Privileged Identity Management

Another impact of "assume breach" is the need to minimize the likelihood a compromised account can operate with a privileged role. 

[Azure AD Privileged Identity Management (PIM)](https://docs.microsoft.com/azure/active-directory/active-directory-privileged-identity-management-configure) helps you minimized account privileges by helping you:

* Identify and manage users assigned to administrative roles.
* Understand unused or excessive privilege roles you should remove.
* Establish rules to make sure privileged roles are protected by multi-factor authentication.
* Establish rules to make sure privileged roles are granted only long enough to accomplish the privileged task.

Enable Azure AD PIM, then view the users who are assigned administrative roles and remove unnecessary accounts in those roles. For remaining privileged users, move them from permanent to eligible. Finally, establish appropriate policies to make sure when they need to gain access to those privileged roles, they can do so securely.

As part of deploying your privileged account process, follow the [best practice to create at least two emergency accounts](https://docs.microsoft.com/azure/active-directory/admin-roles-best-practices) to make sure you have access to Azure AD if you lock yourself out.

## Step 3 - Automate threat response

Azure Active Directory has many capabilities that automatically intercept attacks, to remove the latency between detection and response. You can reduce the costs and risks, when you reduce the time criminals use to embed themselves into your environment. Here are the concrete steps you can take.

### Implement user risk security policy using Azure AD Identity Protection

User risk indicates the likelihood a user's identity has been compromised and is calculated based on the [user risk events](https://docs.microsoft.com/azure/active-directory/active-directory-identityprotection) that are associated with a user's identity. A user risk policy is a conditional access policy that evaluates the risk level to a specific user or group. Based on Low, Medium, High risk-level, a policy can be configured to block access or require a secure password change using multi-factor authentication. Microsoft's recommendation is to require a secure password change for users on high risk.

![Users flagged for risk](media/azure-ad/azure-ad-sec-steps1.png)

### Implement sign-in risk policy using Azure AD Identity Protection

Sign-in risk is the likelihood someone other than the account owner is attempting to sign on using the identity. A [sign-in risk policy](https://docs.microsoft.com/azure/active-directory/active-directory-identityprotection) is a conditional access policy that evaluates the risk level to a specific user or group. Based on the risk level (high/medium/low), a policy can be configured to block access or force multi-factor authentication. Make sure you force multi-factor authentication on Medium or above risk sign-ins.

![Sign in from anonymous IPs](media/azure-ad/azure-ad-sec-steps2.png)

## Step 4 - Increase your awareness

Auditing and logging of security-related events and related alerts are essential components of an efficient protection strategy. Security logs and reports provide you with an electronic record of suspicious activities and help you detect patterns that may indicate attempted or successful external penetration of the network, and internal attacks. You can use auditing to monitor user activity, document regulatory compliance, perform forensic analysis, and more. Alerts provide notifications of security events.

### Monitor Azure AD

Microsoft Azure services and features provide you with configurable security auditing and logging options to help you identify gaps in your security policies and mechanisms and address those gaps to help prevent breaches. You can use [Azure Logging and Auditing](https://docs.microsoft.com/azure/security/azure-log-audit) and use [Audit activity reports in the Azure Active Directory portal](https://docs.microsoft.com/azure/active-directory/active-directory-reporting-activity-audit-logs).

### Monitor Azure AD Connect Health in hybrid environments

[Monitoring ADFS with Azure AD Connect Health](https://docs.microsoft.com/azure/active-directory/connect-health/active-directory-aadconnect-health-adfs) provides you with greater insight into potential issues and visibility of attacks on your ADFS infrastructure. Azure AD Connect Health delivers alerts with details, resolution steps, and links to related documentation; usage analytics for several metrics related to authentication traffic; performance monitoring and reports.

![Azure AD Connect Health](media/azure-ad/azure-ad-sec-steps4.png)

### Monitor Azure AD Identity Protection events

[Azure AD Identity Protection](https://docs.microsoft.com/azure/active-directory/active-directory-identityprotection) is a notification, monitoring and reporting tool you can use to detect potential vulnerabilities affecting your organization's identities. It detects risk events, such as leaked credentials, impossible travel, and sign-ins from infected devices, anonymous IP addresses, IP addresses associated with the suspicious activity, and unknown locations. Enable notification alerts to receive email of users at risk and/or a weekly digest email.

![Users flagged for risk](media/azure-ad/azure-ad-sec-steps3.png)

## Step 5 - Enable end-user self-help

As much as possible you'll want to balance security with productivity. Along the same lines of approaching your journey with the mindset that you're setting a foundation for security in the long run, you can remove friction from your organization by empowering your users while remaining vigilant. 

### Implement self-service password reset

Azure's [self-service password reset (SSPR)](https://docs.microsoft.com/azure/active-directory/active-directory-passwords-getting-started) offers a simple means for IT administrators to allow users to reset or unlock their passwords or accounts without administrator intervention. The system includes detailed reporting that tracks when users access the system, along with notifications to alert you to misuse or abuse. 

### Implement self-service group management

Azure AD provides the ability to manage access to resources using security groups and Office 365 groups. These groups can be managed by group owners instead of IT administrators. Known as [self-service group management](https://docs.microsoft.com/azure/active-directory/active-directory-accessmanagement-self-service-group-management), this feature allows group owners who are not assigned an administrative role to create and manage groups without relying on administrators to handle their requests.

### Implement Azure AD access reviews

With [Azure AD access reviews](https://docs.microsoft.com/azure/active-directory/active-directory-azure-ad-controls-access-reviews-overview), you can manage group memberships, access to enterprise applications, and privileged role assignments to make sure you maintain a security standard that does not give users access for extended periods of time when they don't need it.

## Summary

There are many aspects to a secure Identity infrastructure, but this five-step checklist will help you quickly accomplish a safer and secure identity infrastructure:

* Strengthen your credentials.
* Reduce your attack surface area.
* Automate threat response.
* Increase your awareness of auditing and monitoring.
* Enable more predictable and complete end-user security with self-help.

We appreciate how seriously you take Identity Security and hope this document is a useful roadmap to a more secure posture for your organization.

## Next steps
If you need assistance to plan and deploy the recommendations, refer to the [Azure AD project deployment plans](http://aka.ms/deploymentplans) for help.
