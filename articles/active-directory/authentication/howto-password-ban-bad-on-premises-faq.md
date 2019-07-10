---
title: On-premises Azure AD Password Protection FAQ - Azure Active Directory
description: On-premises Azure AD Password Protection FAQ

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: article
ms.date: 02/01/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: jsimmons
ms.collection: M365-identity-device-management
---

# Azure AD Password Protection on-premises - Frequently asked questions

## General questions

**Q: What guidance should users be given on how to select a secure password?**

Microsoft's current guidance on this topic can be found at the following link:

[Microsoft Password Guidance](https://www.microsoft.com/research/publication/password-guidance)

**Q: Is on-premises Azure AD Password Protection supported in non-public clouds?**

No - on-premises Azure AD Password Protection is only supported in the public cloud. No date has been announced for non-public cloud availability.

**Q: How can I apply Azure AD Password Protection benefits to a subset of my on-premises users?**

Not supported. Once deployed and enabled, Azure AD Password Protection doesn't discriminate - all users receive equal security benefits.

**Q: What is the difference between a password change and a password set (or reset)?**

A password change is when a user chooses a new password after proving they have knowledge of the old password. For example, this is what happens when a user logs into Windows and is then prompted to choose a new password.

A password set (sometimes called a password reset) is when an administrator replaces the password on an account with a new password, for example by using the Active Directory Users and Computers management tool. This operation requires a high level of privilege (usually Domain Admin), and the person performing the operation usually does not have knowledge of the old password. Help-desk scenarios often do this, for instance when assisting a user who has forgotten their password. You will also see password set events when a brand new user account is being created for the first time with a password.

The password validation policy behaves the same regardless of whether a password change or set is being done. The Azure AD Password Protection DC Agent service does log different events to inform you whether a password change or set operation was done.  See [Azure AD Password Protection monitoring and logging](https://docs.microsoft.com/azure/active-directory/authentication/howto-password-ban-bad-on-premises-monitor).

**Q: Why are duplicated password rejection events logged when attempting to set a weak password using the Active Directory Users and Computers management snap-in?**

The Active Directory Users and Computers management snap-in will first try to set the new password using the Kerberos protocol. Upon failure the snap-in will make a second attempt to set the password using a legacy (SAM RPC) protocol (the specific protocols used are not important). If the new password is considered weak by Azure AD Password Protection, this will result in two sets of password reset rejection events being logged.

**Q: Is it supported to install Azure AD Password Protection side by side with other password-filter-based products?**

Yes. Support for multiple registered password filter dlls is a core Windows feature and not specific to Azure AD Password Protection. All registered password filter dlls must agree before a password is accepted.

**Q: How can I deploy and configure Azure AD Password Protection in my Active Directory environment without using Azure?**

Not supported. Azure AD Password Protection is an Azure feature that supports being extended into an on-premises Active Directory environment.

**Q: How can I modify the contents of the policy at the Active Directory level?**

Not supported. The policy can only be administered using the Azure AD management portal. Also see previous question.

**Q: Why is DFSR required for sysvol replication?**

FRS (the predecessor technology to DFSR) has many known problems and is entirely unsupported in newer versions of Windows Server Active Directory. Zero testing of Azure AD Password Protection will be done on FRS-configured domains.

For more information, please see the following articles:

[The Case for Migrating sysvol replication to DFSR](https://blogs.technet.microsoft.com/askds/2010/04/22/the-case-for-migrating-sysvol-to-dfsr)

[The End is Nigh for FRS](https://blogs.technet.microsoft.com/filecab/2014/06/25/the-end-is-nigh-for-frs)

**Q: How much disk space does the feature require on the domain sysvol share?**

The precise space usage varies since it depends on factors such as the number and length of the banned tokens in the Microsoft global banned list and the per-tenant custom list, plus encryption overhead. The contents of these lists are likely to grow in the future. With that in mind, a reasonable expectation is that the feature will need at least five (5) megabytes of space on the domain sysvol share.

**Q: Why is a reboot required to install or upgrade the DC agent software?**

This requirement is caused by core Windows behavior.

**Q: Is there any way to configure a DC agent to use a specific proxy server?**

No. Since the proxy server is stateless, it's not important which specific proxy server is used.

**Q: Is it okay to deploy the Azure AD Password Protection Proxy service side by side with other services such as Azure AD Connect?**

Yes. The Azure AD Password Protection Proxy service and Azure AD Connect should never conflict directly with each other.

**Q: In what order should the DC agents and proxies be installed and registered?**

Any ordering of Proxy agent installation, DC agent installation, forest registration, and Proxy registration  is supported.

**Q: Should I be concerned about the performance hit on my domain controllers from deploying this feature?**

The Azure AD Password Protection DC Agent service shouldn't significantly impact domain controller performance in an existing healthy Active Directory deployment.

For most Active Directory deployments password change operations are a small proportion of the overall workload on any given domain controller. As an example, imagine an Active Directory domain with 10000 user accounts and a MaxPasswordAge policy set to 30 days. On average, this domain will see 10000/30=~333 password change operations each day, which is a minor number of operations for even a single domain controller. Consider a potential worst case scenario: suppose those ~333 password changes on a single DC were done over a single hour. For example, this scenario may occur when many employees all come to work on a Monday morning. Even in that case, we're still looking at ~333/60 minutes = six password changes per minute, which again is not a significant load.

However if your current domain controllers are already running at performance-limited levels (for example, maxed out with respect to CPU, disk space, disk I/O, etc.), it is advisable to add additional domain controllers or expand available disk space, before deploying this feature. Also see question above about sysvol disk space usage above.

**Q: I want to test Azure AD Password Protection on just a few DCs in my domain. Is it possible to force user password changes to use those specific DCs?**

No. The Windows client OS controls which domain controller is used when a user changes their password. The domain controller is selected based on factors such as Active Directory site and subnet assignments, environment-specific network configuration, etc. Azure AD Password Protection does not control these factors and cannot influence which domain controller is selected to change a user's password.

One way to partially reach this goal would be to deploy Azure AD Password Protection on all of the domain controllers in a given Active Directory site. This approach will provide reasonable coverage for the Windows clients that are assigned to that site, and therefore also for the users that are logging into those clients and changing their passwords.

**Q: If I install the Azure AD Password Protection DC Agent service on just the Primary Domain Controller (PDC), will all other domain controllers in the domain also be protected?**

No. When a user's password is changed on a given non-PDC domain controller, the clear-text password is never sent to the PDC (this idea is a common mis-perception). Once a new password is accepted on a given DC, that DC uses that password to create the various authentication-protocol-specific hashes of that password and then persists those hashes in the directory. The clear-text password is not persisted. The updated hashes are then replicated to the PDC. User passwords may in some cases be changed directly on the PDC, again depending on various factors such as network topology and Active Directory site design. (See the previous question.)

In summary, deployment of the Azure AD Password Protection DC Agent service on the PDC is required to reach 100% security coverage of the feature across the domain. Deploying the feature on the PDC only does not provide Azure AD Password Protection security benefits for any other DCs in the domain.

**Q: Is a System Center Operations Manager management pack available for Azure AD Password Protection?**

No.

**Q: Why is Azure still rejecting weak passwords even though I've configured the policy to be in Audit mode?**

Audit mode is only supported in the on-premises Active Directory environment. Azure is implicitly always in "enforce" mode when it evaluates passwords.

## Additional content

The following links are not part of the core Azure AD Password Protection documentation but may be a useful source of additional information on the feature.

[Azure AD Password Protection is now generally available!](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Azure-AD-Password-Protection-is-now-generally-available/ba-p/377487)

[Email Phishing Protection Guide – Part 15: Implement the Microsoft Azure AD Password Protection Service (for On-Premises too!)](https://blogs.technet.microsoft.com/cloudready/2018/10/14/email-phishing-protection-guide-part-15-implement-the-microsoft-azure-ad-password-protection-service-for-on-premises-too/)

[Azure AD Password Protection and Smart Lockout are now in Public Preview!](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Azure-AD-Password-Protection-and-Smart-Lockout-are-now-in-Public/ba-p/245423#M529)

## Microsoft Premier\Unified support training available

If you're interested in learning more about Azure AD Password Protection and deploying it in your environment, you can take advantage of a Microsoft proactive service available to those customers with a Premier or Unified support contract. The service is called Azure Active Directory: Password Protection. Contact your Technical Account Manager for more information.

## Next steps

If you have an on-premises Azure AD Password Protection question that isn't answered here, submit a Feedback item below - thank you!

[Deploy Azure AD password protection](howto-password-ban-bad-on-premises-deploy.md)
