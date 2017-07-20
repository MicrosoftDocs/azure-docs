---
title: Azure AD tiered password security | Microsoft Docs
description: Explains how Azure AD enforces strong passwords and protects users passwords from cyber criminals, 
services: active-directory
documentationcenter: ''
author: MicrosoftGuyJFlo
manager: femila

ms.assetid: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/10/2017
ms.author: joflore

---
# A multi-tiered approach to Azure AD password security

This article discusses some best practices you can follow as a user or as an administrator to protect your Azure Active Directory (Azure AD) or Microsoft Account.

 > [!NOTE]
 > Azure AD administrators can reset user passwords using the guidance in the article [Reset the password for a user in Azure Active Directory](active-directory-users-reset-password-azure-portal.md).
 >
 > Users can reset their own password using the guidance in the article [Help I forgot my Azure AD password](active-directory-passwords-update-your-own-password.md).
 >

## Password requirements

Azure AD incorporates the following common approaches to securing passwords:

* Password length requirements
* Password complexity requirements
* Regular and periodic password expiration

For information about password reset in Azure Active Directory, see the topic [Azure AD self-service password reset for the IT professional](active-directory-passwords.md).

## Azure AD password protections

Azure AD and the Microsoft Account System use industry proven approaches to ensure secure protection of user and administrator passwords including:

* Dynamically banned passwords
* Smart Password Lockout

For information about password management based on current research, see the whitepaper [Password Guidance](http://aka.ms/passwordguidance).

### Dynamically banned passwords

Azure AD and Microsoft Accounts safeguard password protection by dynamically banning commonly used passwords. The Azure ID Identity Protection team routinely analyzes banned password lists, preventing users from selecting commonly used passwords. This service is available to Azure AD and the Microsoft Account Service customers.

When creating passwords, it is important for administrators to encourage users to choose password phrases that include a unique combination of letters, numbers, characters, or words. This approach helps to make user passwords nearly impossible to be compromised but easier for users to remember.

#### Password breaches

Microsoft is always working to stay one step ahead of cyber-criminals.

The Azure AD Identity Protection team continually analyzes passwords that are commonly used. Cyber-criminals also use similar strategies to inform their attacks, such as building a [rainbow table](https://en.wikipedia.org/wiki/Rainbow_table) for cracking password hashes.

Microsoft continually analyzes [data breaches](https://www.privacyrights.org/data-breaches) to maintain a dynamically updated banned password list, which ensures that vulnerable passwords are banned before they become a real threat to Azure AD customers. For more information about our current security efforts, see the [Microsoft Security Intelligence Report](https://www.microsoft.com/security/sir/default.aspx).

### Smart Password Lockout

When Azure AD detects a potential cyber-criminal trying to hack into a user password, we lock the user account with Smart Password Lockout. Azure AD is designed to determine the risk associated with specific login sessions. Then using the most up-to-date security data, we apply lockout semantics to stop cyber threats.

If a user is locked out of Azure AD, their screen looks similar to the one that follows:

  ![Locked out of Azure AD](./media/active-directory-secure-passwords/locked-out-azuread.png)

For other Microsoft accounts, their screen looks similar to the one that follows:

  ![Locked out of a Microsoft account](./media/active-directory-secure-passwords/locked-out-ms-accounts.png)

For information about password reset in Azure Active Directory, see the topic [Azure AD self-service password reset for the IT professional](active-directory-passwords.md).

  >[!NOTE]
  >If you are an Azure AD administrator, you may want to use [Windows Hello](https://www.microsoft.com/windows/windows-hello) to avoid having your users create traditional passwords altogether.
  >

## Next steps

* [How to update your own password](active-directory-passwords-update-your-own-password.md)
* [The fundamentals of Azure identity management](fundamentals-identity.md)
* [Report on password reset activity](active-directory-passwords-reporting.md)


