---
title: On-premises Azure AD Password Protection FAQ
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

# Preview: Azure AD Password Protection on-premises - Frequently asked questions

|     |
| --- |
| Azure AD Password Protection is a public preview feature of Azure Active Directory. For more information about previews, see  [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)|
|     |

## General questions

**Q: When will Azure AD Password Protection reach General Availability (GA)?**

GA is planned for Q1 CY2019 (before end of March 2019). Thank you to everyone who has supplied feedback on the feature to date - we appreciate it!

**Q: What guidance should users be given on how to select a secure password?**

Microsoft's current guidance on this topic can be found at the following link:

[Microsoft Password Guidance](https://www.microsoft.com/en-us/research/publication/password-guidance)

**Q: Is on-premises Azure AD Password Protection supported in non-public clouds?**

No - on-premises Azure AD Password Protection is only supported in the public cloud. No date has been announced for non-public cloud availability.

**Q: How can I apply Azure AD Password Protection benefits to a subset of my on-premises users?**

Not supported. Once deployed and enabled, Azure AD Password Protection does not discriminate - all users receive equal security benefits.

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

The precise space usage cannot be accurately specified since it depends on factors such as the number and length of the banned password tokens in the Microsoft global banned password list and the per-tenant custom banned password list, plus encryption overhead. Note that the contents of these lists are likely to grow in the future. With that in mind, a reasonable current rule of thumb is that the feature will need at least five (5) megabytes of space on the domain sysvol share.

**Q: Why is a reboot required to install or upgrade the DC agent software?**

This requirement is caused by core Windows behavior.

**Q: Is there any way to configure a DC agent to use a specific proxy server?**

No. Note though that since the proxy server is stateless, it is not important which specific proxy server is used.

**Q: Is it okay to deploy the Azure AD Password Protection Proxy service side-by-side on a machine with other services such as Azure AD Connect?**

Yes. The Azure AD Password Protection Proxy service and Azure AD Connect should never conflict directly with each other.

**Q: Should I be concerned about the performance hit on my domain controllers from deploying this feature?**

The Azure AD Password Protection DC Agent service is designed to be as efficient as possible and should not significantly impact domain controller performance in an existing Active Directory deployment that is already sufficiently resourced.

It is useful to note that for most Active Directory deployments password change operations are a very small proportion of the overall workload on any given domain controller. As an example, imagine an Active Directory domain with 10000 user accounts and a MaxPasswordAge policy set to 30 days. On average this domain will see 10000/30=~333 password change operations each day which is a relatively minor number of operations for even a single domain controller. Pushing the example to a potential worst case scenario, suppose those ~333 password changes on a single DC were done over a single hour (for example, this may happen when a large number of employees all come to work on a Monday morning); even in this case, we're still looking at ~333/60 minutes = ~6 password changes per minute, which again is simply not a very significant load.

With that said, if your current domain controllers are already running at performance-limited levels (for example, maxed out with respect to CPU, disk space, disk I/O, etc), it would be a good idea to deploy additional domain controllers and/or expand available disk space, prior to deploying Azure AD Password Protection. Also see question above about sysvol disk space usage above.

**Q: I want to test Azure AD Password Protection on just a few DCs in my domain. How can I force user password changes to use those DCs?**

The short answer is that this is not possible. When a user changes their password, the domain controller that is used is selected by the Windows client operating system based on factors such as Active Directory site and sub-net assignments, environment-specific network configuration, etc. Azure AD Password Protection does not affect or control these factors and therefore cannot influence which domain controller is selected for a given user password change.

With that said, an approach that comes close to simulating this goal would be to deploy Azure AD Password Protection on all of the domain controllers in a given Active Directory site. This will provide reasonably ubiquitous coverage for the Windows clients assigned to that site, and therefore also for the users that are logging into those clients and changing their passwords.

**Q: If I install the Azure AD Password Protection DC Agent service on just the Primary Domain Controller (PDC), will this protect all other domain controllers in the domain?**

No. When a user's password is changed on a given non-PDC domain controller, the clear-text password is never sent to the PDC (this is a common mis-perception). Instead, once a new password is accepted on a given DC, that DC uses that password to create the various authentication-protocol-specific hashes of that password and then persists those hashes in the directory. Those updated hashes are then replicated to the PDC - but Azure AD Password Protection is not involved in that process. Note that user passwords may in some cases be changed directly on the PDC, again depending on various factors such as network topology and Active Directory site design. (See the previous question.)

To summarize: deployment of the Azure AD Password Protection DC Agent service on the PDC is required to reach 100% security coverage of the feature, but that by itself does not provide Azure AD Password Protection security benefits for any other DCs in the domain.

**Q: Is a System Center Operations Manager (SCOM) management pack available for Azure AD Password Protection?**

No.

## Additional content

The following links are not part of the core Azure AD Password Protection documentation but may be a useful source of additional information on the feature.

[Email Phishing Protection Guide – Part 15: Implement the Microsoft Azure AD Password Protection Service (for On-Premises too!)](https://blogs.technet.microsoft.com/cloudready/2018/10/14/email-phishing-protection-guide-part-15-implement-the-microsoft-azure-ad-password-protection-service-for-on-premises-too/)

[Azure AD Password Protection and Smart Lockout are now in Public Preview!](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Azure-AD-Password-Protection-and-Smart-Lockout-are-now-in-Public/ba-p/245423#M529)

## Next steps

If you have an on-premises Azure AD Password Protection question that isn't answered here, please submit a  Feedback item below - thank you!

[Deploy Azure AD password protection](howto-password-ban-bad-on-premises-deploy.md)
