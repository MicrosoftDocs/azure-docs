---
title: Dynamically banned passwords - Azure Active Directory
description: Ban weak passwords from your environment with Azure AD dynamically banned passwords

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 07/11/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: rogoya

ms.collection: M365-identity-device-management
---
# Eliminate bad passwords in your organization

Industry leaders tell you not to use the same password in multiple places, to make it complex, and to not make it simple like Password123. How can organizations guarantee that their users are following guidance? How can they make sure users aren't using common passwords or passwords that are known to be included in recent data breaches?

## Global banned password list

Microsoft is always working to stay one step ahead of cyber-criminals. Therefore the Azure AD Identity Protection team continually look for commonly used and compromised passwords. They then block those passwords that are deemed too common in what is called the global banned password list. Cyber-criminals also use similar strategies in their attacks, therefore Microsoft does not publish the contents of this list publicly. These vulnerable passwords are blocked before they become a real threat to Microsoft's customers. For more information about current security efforts, see the [Microsoft Security Intelligence Report](https://www.microsoft.com/security/operations/security-intelligence-report).

## Custom banned password list

Some organizations may want to take security one step further by adding their own customizations on top of the global banned password list in what Microsoft calls the custom banned password list. Enterprise customers like Contoso could then choose to block variants of their brand names, company-specific terms, or other items.

The custom banned password list and the ability to enable on-premises Active Directory integration is managed using the Azure portal.

![Modify the custom banned password list under Authentication Methods](./media/concept-password-ban-bad/authentication-methods-password-protection.png)

## On-premises hybrid scenarios

Protecting cloud-only accounts is helpful but many organizations maintain hybrid scenarios including on-premises Windows Server Active Directory. It is possible to install Azure AD password protection for Windows Server Active Directory agents on-premises to extend the banned password lists to your existing infrastructure. Now users and administrators who change, set, or reset passwords on-premises are required to comply with the same password policy as cloud-only users.

## How are passwords evaluated

Whenever a user changes or resets their password, the new password is checked for strength and complexity by validating it against both the global and the custom banned password list (if the latter is configured).

Even if a user’s password contains a banned password, the password may still be accepted if the overall password is strong enough otherwise. A newly configured password will go through the following steps to assess its overall strength to determine if it should be accepted or rejected.

### Step 1: Normalization

A new password first goes through a normalization process. This allows for a small set of banned passwords to be mapped to a much larger set of potentially weak passwords.

Normalization has two parts.  First, all uppercase letters are changed to lower case.  Second, common character substitutions are performed, for example:  

| Original letter  | Substituted letter |
| --- | --- |
| '0'  | 'o' |
| '1'  | 'l' |
| '$'  | 's' |
| '\@'  | 'a' |

Example: assume that the password “blank” is banned, and a user tries to change their password to “Bl@nK”. Even though “Bl@nk” is not specifically banned, the normalization process converts this password to “blank”, which is a banned password.

### Step 2: Check if password is considered banned

#### Fuzzy matching behavior

Fuzzy matching is used on the normalized password to identify if it contains a password found on either the global or the custom banned password lists. The matching process is based on an edit distance of one (1) comparison.  

Example: assume that the password “abcdef” is banned, and a user tries to change their password to one of the following:

‘abcdeg’    *(last character changed from ‘f’ to ‘g’)*
‘abcdefg’   *’(g’ appended to end)*
‘abcde’     *(trailing ‘f’ was deleted from end)*

Each of the above passwords does not specifically match the banned password "abcdef". However, since each example is within an edit distance of 1 of the banned token ‘abcdef’, they are all considered as a  match to “abcdef”.

#### Substring matching (on specific terms)

Substring matching is used on the normalized password to check for the user’s first and last name as well as the tenant name (note that tenant name matching is not done when validating passwords on an Active Directory domain controller).

Example: assume that we have a user, Pol, who wants to reset their password to “P0l123fb”. After normalization, this password would become “pol123fb”. Substring matching finds that the password contains the user’s first name “Pol”. Even though “P0l123fb” was not specifically on either banned password list, substring matching found “Pol" in the password. Therefore this password would be rejected.

#### Score Calculation

The next step is to identify all instances of banned passwords in the user's normalized new password. Then:

1. Each banned password that is found in a user’s password is given one point.
2. Each remaining unique character is given one point.
3. A password must be at least 5 points for it to be accepted.

For the next two examples, let’s assume that Contoso is using Azure AD Password Protection and has “contoso” on their custom list. Let’s also assume that “blank” is on the global list.

Example: a user changes their password to “C0ntos0Blank12”

After normalization, this password becomes “contosoblank12”. The matching process finds that this password contains two banned passwords: contoso and blank. This password is then given a score:

[contoso] + [blank] + [1] + [2] = 4 points
Since this password is under 5 points, it will be rejected.

Example: a user changes their password to “ContoS0Bl@nkf9!”.

After normalization, this password becomes “contosoblankf9!”. The matching process finds that this password contains two banned passwords: contoso and blank. This password is then given a score:

[contoso] + [blank] + [f] + [9] + [!] = 5 points
Since this password is at least 5 points, it is accepted.

   > [!IMPORTANT]
   > Please note that the banned password algorithm along with the global list can and do change at any time in Azure based on ongoing security analysis and research. For the on-premises DC agent service, updated algorithms will only take effect after the DC agent software is re-installed.

## License requirements

|   | Azure AD password protection with global banned password list | Azure AD password protection with custom banned password list|
| --- | --- | --- |
| Cloud-only users | Azure AD Free | Azure AD Premium P1 or P2 |
| Users synchronized from on-premises Windows Server Active Directory | Azure AD Premium P1 or P2 | Azure AD Premium P1 or P2 |

> [!NOTE]
> On-premises Windows Server Active Directory users that not synchronized to Azure Active Directory also avail the benefits of Azure AD password protection based on existing licensing for synchronized users.

Additional licensing information, including costs, can be found on the [Azure Active Directory pricing site](https://azure.microsoft.com/pricing/details/active-directory/).

## What do users see

When a user attempts to reset a password to something that would be banned, they see the following error message:

Unfortunately, your password contains a word, phrase, or pattern that makes your password easily guessable. Please try again with a different password.

## Next steps

* [Configure the custom banned password list](howto-password-ban-bad.md)
* [Enable Azure AD password protection agents on-premises](howto-password-ban-bad-on-premises-deploy.md)
