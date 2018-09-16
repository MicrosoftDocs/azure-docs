---
title: How to ban passwords in Azure AD
description: Ban weak passwords from your envirionment with Azure AD dynamically banned passwrords

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
# Configuring the custom banned password list

|     |
| --- |
| Azure AD password protection and the custom banned password list are public preview features of Azure Active Directory. For more information about previews, see  [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)|
|     |

Many organizations find their users create passwords using common local words such as a school, sports team, or famous person, leaving them easy to guess. Microsoft's custom banned password list allows organizations to add strings to evaluate and block, in addition to the global banned password list, when users and administrators attempt to change or reset a password.

## Add to the custom list

Configuring the custom banned password list requires an Azure Active Directory Premium P1 or P2 license. For more detailed information about Azure Active Directory licensing, see the [Azure Active Directory pricing page](https://azure.microsoft.com/pricing/details/active-directory/).|

1. Sign in to the [Azure portal](https://portal.azure.com) and browse to **Azure Active Directory**, **Authentication methods**, then **Password protection (Preview)**.
1. Set the option **Enforce custom list**, to **Yes**.
1. Add strings to the **Custom banned password list**, one string per line
   * The custom banned password list can contain up to 1000 words.
   * The custom banned password list is case-insensitive.
   * The custom banned password list considers common character substitution.
      * Example: "o" and "0" or "a" and "@"
   * The minimum string length is four characters and the maximum is 16 characters.
1. When you have added all strings, click **Save**.

> [!NOTE]
> It may take several hours for updates to the custom banned password list to be applied.

![Modify the custom banned password list under Authentication Methods in the Azure portal](./media/howto-password-ban-bad/authentication-methods-password-protection.png)

## How it works

Each time a user or administrator resets or changes an Azure AD password, it flows through the banned password lists to confirm that it is not on a list. This check is included in any passwords set or changed using Azure AD.

## What do users see

When a user attempts to reset a password to something that would be banned, they see the following error message:

Unfortunately, your password contains a word, phrase, or pattern that makes your password easily guessable. Please try again with a different password.

## Next steps

[Conceptual overview of the banned password lists](concept-password-ban-bad.md)

[Conceptual overview of Azure AD password protection](concept-password-ban-bad-on-premises.md)

[Enable on-premises integration with the banned password lists](howto-password-ban-bad-on-premises.md)
