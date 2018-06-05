---
title: Five steps to secure your identity infrastructure
description: This doc outlines a list of actions administrator should implement to help them secure their organization using Azure AD
services: active-directory
author: martincoetzer
manager: manmeetb
tags: azuread
ms.service: active-directory
ms.topic: conceptual
ms.workload: identity
ms.date: 06/04/2018
ms.author: martincoetzer
---

# Five steps to secure your identity infrastructure

If you are reading this document, you are aware of the significance of security. You likely already carry the responsibility for securing your organization. If you need to convince others of the importance of security, send them to read the latest [Microsoft Security Intelligence report](https://www.microsoft.com/en-us/security/intelligence-report).

This document will help you get a more secure posture using the capabilities of Azure Active Directory (AD) by providing a five-step checklist to inoculate your organization against cyber-attacks.

This checklist will help you quickly deploy critical recommended actions to protect your organization immediately by explaining how to:

1. Strengthen your credentials
2. Reduce your attack surface area
3. Automate threat response
4. Increase your awareness of auditing and monitoring
5. Enable more predictable and complete end-user security with self-help

It is important to note that many of the security capabilities referenced in this document apply only to apps, which are configured to use Azure Active Directory as their identity provider. Configuring apps for single sign-on assures that the benefits of credential policies, threat detection, auditing, logging, and other features accrue to those applications. It is fair to say [single sign-on through Azure Active Directory](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-enterprise-apps-manage-sso) is the foundation on which all these recommendations are based.

## Before we begin: Protect privileged accounts with multi-factor authentication

Before you begin this checklist, make sure you don’t get compromised while you are reading this checklist. You first need to protect your privileged accounts.

Attackers who get control of privileged accounts can do tremendous damage, so it is critical to protect these accounts first. Enable and require [multi-factor authentication](https://docs.microsoft.com/en-us/azure/multi-factor-authentication/multi-factor-authentication) (MFA) for all administrators in your organization using conditional access [policies based on privileged directory roles](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-conditional-access-app-based-mfa). **If you haven’t implemented MFA, do it now! It’s that important.**

All set? Let’s get started on the checklist.

## Step 1 - Strengthen your credentials

Most enterprise security breaches originate with an account compromised by one of a handful of methods such as password spray, breach replay, or phishing as explained in this video:
> [!VIDEO https://channel9.msdn.com/events/Ignite/Microsoft-Ignite-Orlando-2017/BRK3016/player]

If users in your identity system are using weak passwords and not strengthening them with multi-factor authentication, it isn’t a matter of if or when you get compromised – just how often.

### Enable and require multi-factor authentication for all users

Given the frequency of passwords being guessed, phished, attacked with malware, or reused, it is critical to back the password with some form of strong credential – learn more about [multi-factor authentication](https://docs.microsoft.com/en-us/azure/multi-factor-authentication/multi-factor-authentication).

### Turn off complexity and expiration rules. Ban commonly attacked passwords instead

Many organizations use the traditional complexity (for example, special characters) and password expiration rules. [Microsoft's research](https://aka.ms/passwordguidance) has shown that these policies are harmful, causing users to choose passwords that are easier to guess.

Our recommendation, consistent with [NIST guidance](https://pages.nist.gov/800-63-3/sp800-63b.html), are to:

1. Require passwords have at least 8 characters. Longer is not necessarily better, as they cause users to choose predictable passwords, save passwords in files, or write them down.

2. Disable expiration rules that drive users to easily guessed passwords. such as **Summer2018!** and [stop forcing users to change their password](https://docs.microsoft.com/en-us/azure/active-directory/authentication/concept-sspr-policy) here.

3. Prevent users from choosing commonly attacked passwords by checking their passwords against commonly used attacker passwords. Azure Active Directory’s [dynamic banned password](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-secure-passwords) feature uses current attacker behavior to prevent users from setting passwords that can easily be guessed. This capability is always on, but only applies to passwords set in Azure AD. If you are in a hybrid deployment with on-premises Active Directory, enable [password writeback](https://docs.microsoft.com/en-us/azure/active-directory/authentication/howto-sspr-writeback) to take advantage of cloud password change with Self-Service Password Reset.

Organizations using on-premises AD and syncing to Azure AD should implement intelligent password policies based on the [Password Guidance](https://aka.ms/passwordguidance) white paper.

### Implement password hash synchronization

If your organization uses a hybrid identity solution, then you should enable password hash synchronization for the following reasons:

1. The [Users with leaked credentials](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-reporting-risk-events) report in the Azure AD management warns you of user credentials that have been exposed on the "dark web." The report compares stolen credentials that we detect to the credentials in use by your organization by simulating a login with those credentials. There is an incredible volume of passwords leaked via phishing, malware, and password reuse on third-party sites that are later breached. Microsoft discovers many of these leaked credentials and will tell you if they match credentials in your organization – but only if you [enable password hash synchronization](https://docs.microsoft.com/en-us/azure/active-directory/connect/active-directory-aadconnectsync-implement-password-hash-synchronization)!
2. In the event of an on-premises outage (for example, due to a ransomware attack), you will be able to switch over to [cloud authentication using password hash synchronization](http://aka.ms/auth-options). This backup authentication method will allow you to continue accessing apps configured for authentication with Azure Active Directory, including Office 365.

It is important to know that password hash synchronization has [no way to revert hashed passwords back to clear text passwords](https://docs.microsoft.com/en-us/azure/active-directory/connect/active-directory-aadconnectsync-implement-password-hash-synchronization#how-password-hash-synchronization-works) and it is not possible to sign in with a password hash.

### Implement AD FS extranet lockout

Organizations that configure applications to authenticate directly to Azure AD benefit from [Azure AD smart lockout](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-secure-passwords). If you use Active Directory Federated Services (AD FS), implement AD FS [extranet lockout](https://docs.microsoft.com/en-us/windows-server/identity/ad-fs/operations/configure-ad-fs-extranet-lockout-protection). Extranet lockout protects against brute force attacks that target AD FS while preventing users from being locked out in Active Directory.

### Take advantage of intrinsically secure, easier to use credentials

Using [Windows Hello](https://docs.microsoft.com/en-us/windows/security/identity-protection/hello-for-business/hello-identity-verification), you can replace passwords with strong two-factor authentication on PCs and mobile devices. This authentication consists of a new type of user credential that is tied to a device and uses a biometric or PIN.

## Step 2 - Reduce your attack surface area

Given the pervasiveness of password compromise, minimizing the attack surface in your organization is critical. Eliminating use of older, less secure protocols, limiting access pathways, and exercising more significant control of administrative access to resources can help reduce the attack surface area and increase your security posture.

### Block legacy authentication flows

Apps that use their own legacy methods to authenticate with Azure AD and access company data pose another risk for organizations. Examples of apps using legacy authentication are POP3, IMAP4, or SMTP clients. Legacy authentication apps authenticate on behalf of the user and prevent Azure AD from doing advanced security evaluations. Modern authentication on the other hand, will reduce your security risk because it supports multi-factor authentication and conditional access. [Block legacy authentication if you use ADFS](https://docs.microsoft.com/en-us/windows-server/identity/ad-fs/operations/access-control-policies-w2k12) and [set up SharePoint Online and Exchange Online to use modern authentication](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-conditional-access-no-modern-authentication). Organizations using cloud authentication can use [conditional access policies to block legacy authentication](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-conditional-access-conditions).

### Block invalid authentication pathways

Using the "assume breach" mentality, you must reduce the impact of compromised user credentials should they happen. For each app in your environment consider the valid use cases: which groups, which networks, which devices and other elements are authorized – then block the rest. Take care to restrict the use of [highly privileged or service accounts](http://aka.ms/breakglass). With [Azure AD conditional access](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-conditional-access-azure-portal), you can control how authorized users access their apps and resources based on specific conditions you define.

### Implement Azure AD Privileged Identity Management

Another aspect of "assume breach" is the need to minimize the likelihood that a compromised account is able to operate with a privileged role.

[Azure AD Privileged Identity Management (PIM)](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-privileged-identity-management-configure) helps you minimize account privileges by helping you:

* Identify and manage users that are assigned administrative roles

* Understand unused or excessive privilege roles that you should remove

* Establish rules to ensure privileged roles are protected by MFA or approvals

* Establish rules to ensure that privileged roles are granted only long enough to accomplish the privileged task

Enable Azure AD PIM, then view the users who are assigned administrative roles and remove unnecessary accounts in those roles. For remaining privileged users, move them from permanent to eligible. Finally, establish appropriate policies to ensure that when they need to gain access to those privileged roles, they can do so securely.

A [recommended practice](http://aka.ms/breakglass) is to create at least two emergency accounts to ensure access to Azure AD if you inadvertently locked yourself out.

## Step 3 - Automate threat response

Azure Active Directory has many capabilities that automatically intercept attacks to remove the latency between detection and response. You can reduce the costs and risks when you reduce the time criminals use to embed themselves into your environment. Here are the concrete steps you can take.

### Implement user risk security policy using Azure AD Identity Protection

User risk indicates the likelihood that a user’s identity has been compromised and is calculated based on the [user risk events](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-identityprotection) that are associated with a user's identity. A user risk policy is a conditional access policy that evaluates the risk level to a specific user or group. Based on low, medium, and high risk-levels, the policy can be configured to block access or require a password change. Our recommendation is to require a password change on high risk.

![Users flagged for risk](media/azure-ad/azure-ad-sec-steps1.png)

### Implement sign-in risk policy using Azure AD Identity Protection

Sign-in risk indicates the likelihood that someone other than the account owner is attempting to sign on using the identity. A [sign-in risk policy](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-identityprotection) is a conditional access policy that evaluates the risk level to a specific user or group. Based on low, medium, high risk-level, the policy can be configured to block access or force MFA. Make sure you force multi-factor authentication on medium or above risk sign-ins.

![Manual password reset](media/azure-ad/azure-ad-sec-steps2.png)

## Step 4 - Increase your awareness with auditing and monitor security alerts

Auditing and logging of security-related events and related alerts are essential components of an efficient protection strategy. Security logs and reports provide you with an electronic record of suspicious activities and help you detect patterns that may indicate attempted or successful external penetration of the network and internal attacks. You can use auditing to monitor user activity, document regulatory compliance, perform forensic analysis, and more. Alerts provide notification of security events.

### Monitor Azure AD

Microsoft Azure services and features provide you with configurable security auditing and logging options to help you identify gaps in your security policies and mechanisms and address those gaps to help prevent breaches. You can use [Azure Logging and Auditing](https://docs.microsoft.com/en-us/azure/security/azure-log-audit) and use [Audit activity reports in the Azure Active Directory portal](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-reporting-activity-audit-logs).

### Monitor Azure AD Connect Health in Hybrid Environments

[Monitoring AD FS with Azure AD Connect Health ](https://docs.microsoft.com/en-us/azure/active-directory/connect-health/active-directory-aadconnect-health-adfs)provides you with greater insight into potential issues and visibility of attacks on your AD FS infrastructure. Azure AD Connect Health delivers alerts with details, resolution steps, and links to related documentation; usage analytics for several metrics related to authentication traffic; performance monitoring and reports.

![Azure AD Connect Health](media/azure-ad/azure-ad-sec-steps4.png)

### Monitor Azure AD Identity Protection events.

[Azure AD Identity Protection](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-identityprotection) is a monitoring and reporting tool that you can use to detect potential vulnerabilities affecting your organization’s identities. It detects risk events such as leaked credentials, impossible travel, and sign-ins from infected devices, anonymous IP addresses, IP addresses associated with the suspicious activity, and unknown locations.

![Picture 3](media/azure-ad/azure-ad-sec-steps3.png)

## Step 5 - Enable end-user self-help

As much as possible you will want to balance security with productivity. Along the same lines of approaching your journey with the mindset that you are setting a foundation for security in the long run, you can remove friction from your organization by empowering your users while remaining vigilant.

### Implement self-service password reset

Azure’s [self-service password reset (SSPR)](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-passwords-getting-started) offers a simple means for IT administrators to empower users to reset or unlock their passwords or accounts without administrator intervention. The system includes detailed reporting that tracks when users access the system, along with notifications to alert you to misuse or abuse.

### Implement self-service group management

Azure AD provides the ability to manage access to resources using security groups and Office 365 groups. These groups can be managed by group owners instead of IT administrators. Known as [self-service group management](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-accessmanagement-self-service-group-management), this feature allows group owners who are not assigned an administrative role to create and manage groups without relying on administrators to handle their requests.

### Implement Azure AD access reviews

With [Azure AD access reviews](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-azure-ad-controls-access-reviews-overview), you can manage group memberships, access to enterprise applications, and privileged role assignments to ensure you maintain a security standard that does not give users access for extended periods of time when they don’t need it.

## Summary

There are many aspects to a secure identity infrastructure, but these five steps will help you quickly accomplish a safer and secure identity infrastructure:

1. Strengthen your credentials
2. Reduce your attack surface area
3. Automate threat response
4. Increase your awareness of auditing and monitoring
5. Enable more predictable and complete end-user security with self-help

We appreciate how seriously you take identity security and hope that this document provides a useful roadmap to getting your organization to a substantially more secure posture.
