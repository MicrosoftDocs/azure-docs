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
---

# Preview: Azure AD Password Protection on-premises - Frequently asked questions

|     |
| --- |
| Azure AD Password Protection is a public preview feature of Azure Active Directory. For more information about previews, see  [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)|
|     |

## General questions

**Q: When will Azure AD Password Protection reach General Availability (GA)?**

GA is planned for Q1 CY2019 (before end of March 2019). Thank you to everyone who has supplied feedback on the feature to date - we appreciate it!

**Q: Is on-premises Azure AD Password Protection supported in non-public clouds?**

No - on-premises Azure AD Password Protection is only supported in the public cloud.

**Q: How can I apply Azure AD Password Protection benefits to a subset of my on-premises users?**

Not supported. Once deployed and enabled, Azure AD Password Protection does not discriminate - all users receive equal security benefits.

**Q: Is it supported to install Azure AD Password Protection side by side with other password-filter-based products?**

Yes. Support for multiple registered password filter dlls is a core Windows feature and not specific to Azure AD Password Protection. All registered password filter dlls must agree before a password is accepted.

**Q: Why is DFSR required for sysvol replication?**

FRS (the predecessor technology to DFSR) has many known problems and is entirely unsupported in newer versions of Windows Server Active Directory. Zero testing of Azure AD Password Protection will be done on FRS-configured domains.

For more information, please see the following articles:

[The Case for Migrating sysvol replication to DFSR](https://blogs.technet.microsoft.com/askds/2010/04/22/the-case-for-migrating-sysvol-to-dfsr)

[The End is Nigh for FRS](https://blogs.technet.microsoft.com/filecab/2014/06/25/the-end-is-nigh-for-frs)

**Q: Why is a reboot required to install or upgrade the DC agent software?**

This requirement is caused by core Windows behavior.

**Q: Is there any way to configure a DC agent to use a specific proxy server?**

No.

## Next steps

If you have an on-premises Azure AD Password Protection question that isn't answered here, submit a  Feedback item below - thank you!

[Deploy Azure AD password protection](howto-password-ban-bad-on-premises-deploy.md)
