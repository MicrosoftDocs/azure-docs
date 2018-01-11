---
title: Azure AD dynamically banned password lists
description: Ban commonly used, commonly attacked, and known breached passwords with Azure AD dynamically banned passwords
services: active-directory
keywords: 
ms.date: 01/10/2018
ms.topic: article
author: MicrosoftGuyJFlo
ms.author: joflore
manager: mtillman
ms.reviewer: michmcla
ms.custom: it-pro

---
# Dynamically banned passwords

In the real world, passwords are often easy to guess. There are trillions of different possible passwords that can be made from eight or more letters, numbers, and special characters, but humans are creatures of habit. They choose passwords that follow simple, repeatable patterns, have personal relevance, and are easy to remember. They also reuse passwords across systems. All of that is contrary to best practices telling people not to use the same password in multiple places, to make it complex, and not to make it easy-to-guess with patterns like Password123. Unfortunately, cyber criminals know this information too.

How can organizations guarantee that their users are choosing passwords that are easy to guess? How can they make sure users aren't using common passwords or passwords that are known to be included in recent data breaches? Microsoft's answer is to enforce a system that prevents users from using passwords that are known to be common or easy to guess. This system protects users and organizations from credential theft by those cyber criminals.

The system uses two lists: one that is applied to all users, and one applied only to users of a specific tenant. It's applied at password change time. When a user tries to use a password found on one of these lists, or *like* one found on the list, the user is asked to choose a different password.

## Global banned password list

The Azure Active Directory (Azure AD) Identity Protection team continually analyzes passwords that are commonly used, commonly attacked, and found in data breaches. This password intelligence is used to create a list of banned words that is called the *global banned password list*. It contains words like "password" and "princess", keyboard patterns like "qwerty" and "qazwsx", and other common patterns like "123456". Cyber criminals compile similar intelligence, so Microsoft does not publish the contents of this list; the list is also updated as password intelligence evolves. This list is applied to all password changes in Azure AD (but not changes that happen in on-premise Active Directory that are synced to the cloud). For more information about Microsoft's current security efforts, see the [Microsoft Security Intelligence Report](https://www.microsoft.com/security/sir/default.aspx).

## Tenant-specific banned password list

Some organizations may want to take security one step further by adding their own customizations on top of the Global banned password list; this functionality is called the *tenant-specific banned password list*. Employees often use words specific to their organizations, so an enterprise customer like Contoso could then choose to block variants of their brand names, company-specific terms, famous employees, local sports teams, or other local-specific words.

## How does the banned password list work
The system matches passwords by converting the desired password to lowercase and comparing it to words on the banned password lists. If the desired password is sufficiently close to a word on the list, or contains a word on the list, it's rejected.

Examples:

  * A user wants to use **Password123** it is converted to **password123** by the system and is blocked because the list contains **password123**.
  * A user wants to use **Password123!**, it is converted to **password123!** by the system and is blocked because it contains **password123**, which is on the list.

Each time a user resets or changes their password using Azure AD it flows through this process to confirm that it is not on the banned password list. This process applies to password changes in the cloud including self-service password reset. If password writeback is enabled, any password written back to traditional Active Directory has gone through the banned password system.

However, the system is not enforced on password hash sync, so if a user changes their password on-premise in Active Directory, this system is not enforced.

## Customize tenant-specific banned password list

Tenant-specific additions can be made using the Azure Graph API using the following steps… (NEED STEP)

## License requirements

The global banned password list is included for all licensing levels of Azure AD.

The tenant-specific banned password list is included at the Azure AD P2 licensing level.

## What users see

When a user attempts to reset a password to something that would be banned, they see the following error message:

![Change password in Azure AD. Choose a password that's harder for people to guess.][1]

* Choose a password that's harder for people to guess.
* Unfortunately, your password contains a word, phrase, or pattern that makes your password easily guessable. Please try again with a different password.

## Next steps

* Find out more about [Azure Identity Protection](https://docs.microsoft.com/azure/active-directory/active-directory-identityprotection)
* Find out more about [Azure AD self-service password reset](https://docs.microsoft.com/azure/active-directory/active-directory-passwords-overview)

[1]: ./media/passwords-banned-password-list/banned-password.png