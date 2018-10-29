---
title: Dynamically banned passwords in Azure AD
description: Ban weak passwords from your environment with Azure AD dynamically banned passwords

services: active-directory
ms.service: active-directory
ms.component: authentication
ms.topic: conceptual
ms.date: 07/11/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: mtillman
ms.reviewer: rogoya

---
# Eliminate bad passwords in your organization

|     |
| --- |
| Azure AD password protection and the custom banned password list are public preview features of Azure Active Directory. For more information about previews, see  [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)|
|     |

Industry leaders tell you not to use the same password in multiple places, to make it complex, and to not make it simple like Password123. How can organizations guarantee that their users are following guidance? How can they make sure users aren't using common passwords or passwords that are known to be included in recent data breaches?

## Global banned password list

Microsoft is always working to stay one step ahead of cyber-criminals. Therefore the Azure AD Identity Protection team continually look for commonly used and compromised passwords. They then block those passwords that are deemed too common in what is called the global banned password list. Cyber-criminals also use similar strategies in their attacks, therefore Microsoft does not publish the contents of this list publicly. These vulnerable passwords are blocked before they become a real threat to Microsoft's customers. For more information about current security efforts, see the [Microsoft Security Intelligence Report](https://www.microsoft.com/security/intelligence-report).

## Preview: Custom banned password list

Some organizations may want to take security one step further by adding their own customizations on top of the global banned password list in what Microsoft calls the custom banned password list. Enterprise customers like Contoso could then choose to block variants of their brand names, company-specific terms, or other items.

The custom banned password list and the ability to enable on-premises Active Directory integration is managed using the Azure portal.

![Modify the custom banned password list under Authentication Methods in the Azure portal](./media/concept-password-ban-bad/authentication-methods-password-protection.png)

## On-premises hybrid scenarios

Protecting cloud-only accounts is helpful but many organizations maintain hybrid scenarios including on-premises Windows Server Active Directory. It is possible to install Azure AD password protection for Windows Server Active Directory (preview) agents on-premises to extend the banned password lists to your existing infrastructure. Now users and administrators who change, set, or reset passwords on-premises are required to comply with the same password policy as cloud-only users.

## How does the banned password list work

The banned password list matches passwords in the list by converting the string to lowercase and comparing to the known banned passwords within an edit distance of 1 with fuzzy matching.

Example: The word password is blocked for an organization
   - A user tries to set their password to "P@ssword" that is converted to "password" and because it is a variant of password is blocked.
   - An administrator attempts to set a users password to "Password123!" that converted to "password123!" and because it is a variant of password is blocked.

Each time a user resets or changes their Azure AD password it flows through this process to confirm that it is not on the banned password list. This check is included in hybrid scenarios using self-service password reset, password hash sync, and pass-through authentication.

## License requirements

|   | Azure AD password protection with global banned password list | Azure AD password protection with custom banned password list|
| --- | --- | --- |
| Cloud-only users | Azure AD Free | Azure AD Basic |
| Users synchronized from on-premises Windows Server Active Directory | Azure AD Premium P1 or P2 | Azure AD Premium P1 or P2 |

Additional licensing information, including costs, can be found on the [Azure Active Directory pricing site](https://azure.microsoft.com/pricing/details/active-directory/).

## What do users see

When a user attempts to reset a password to something that would be banned, they see the following error message:

Unfortunately, your password contains a word, phrase, or pattern that makes your password easily guessable. Please try again with a different password.

## Next steps

* [Configure the custom banned password list](howto-password-ban-bad.md)
* [Enable Azure AD password protection agents on-premises](howto-password-ban-bad-on-premises.md)
