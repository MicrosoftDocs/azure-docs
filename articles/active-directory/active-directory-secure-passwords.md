---
title: Secure passwords  in Azure AD and reset passwords that get blocked by Smart Password Lockout | Microsoft Docs
description: Explains what an Azure AD tenant is, and how to manage Azure through Azure Active Directory
services: active-directory
documentationcenter: ''
author: markvi
writer: v-lorisc
manager: femila

ms.assetid: 
ms.service: active-directory
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 03/02/2017
ms.author: markvi

---
# Secure passwords  in Azure AD and reset passwords that get blocked by Smart Password Lockout
This article discusses best practices you can follow as a user or as an administrator to protect your Azure Active Directory (Azure AD) and Microsoft Account Service accounts. 

 >[!NOTE]
 >Azure AD administrators can reset user passwords by clicking the directory name. From the [Azure Management portal](https://manage.windowsazure.com), choose the Users page, click the name of the user, and Reset Password. 
 >

Azure AD incorporates the following common approaches to securing passwords:
 *	Password length requirements
 *	Password “complexity” requirements
 *	Regular and periodic password expiration 

For information about password management capabilities, see [Manage passwords in Azure Active Directory](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-manage-passwords). 

## Azure AD password protection
Azure AD and the Microsoft Account System use industry proven approaches to ensure secure protection of user and administrator passwords. 

This section discusses how Azure AD protects passwords using the following methods:
 *	Dynamically banned passwords
 *	Smart Password Lockout

For information about password management based on current research, see the [Password Guidance](http://aka.ms/passwordguidance) whitepaper. 

### Dynamically banned passwords
Azure AD and Microsoft Account System safeguard password protection by dynamically banning all commonly used passwords. The Azure ID Identity Protection team routinely analyzes banned password lists, preventing users from selecting commonly used passwords. This service is available to Azure AD and the Microsoft Account Service customers. 

When creating passwords, it is important for administrators to encourage users to choose uncommon password phrases that include a unique combination of letters, numbers, and characters. This helps to make user passwords nearly impossible to be compromised. 

**Breach lists**

Azure AD is always working to stay one step ahead of cyber-criminals. One way we do that is by preventing users from creating passwords that are on the current attack list.

The Azure AD Identity Protection team continually analyzes passwords that are commonly used. Cyber-criminals also use similar strategies to inform their attacks, such as building a [rainbow table](https://en.wikipedia.org/wiki/Rainbow_table) for cracking password hashes. 

Microsoft continually analyzes [data breaches](https://www.privacyrights.org/data-breaches) to maintain a dynamically updated banned password list, which ensures that vulnerable passwords are banned before they become a real threat to Azure AD customers. For more information about our current security efforts, see the [Microsoft Security Intelligence Report](https://www.microsoft.com/security/sir/default.aspx). 

### Smart Password Lockout

When Azure AD detects a potential cyber-criminal trying to hack into a user password, we lock the user account with Smart Password Lockout. Azure AD is designed to determine the risk associated with specific login sessions. 

Using the most up-to-date security data, we apply lockout semantics to cyber threats. This way users won’t get locked out, in the case when a cyber-criminal has hacked into user passwords on your network.

If a user is locked out of Azure AD, their screen looks similar to the one below:

  ![Locked out of Azure AD](./media/active-directory-secure-passwords/locked-out-azuread.png)
  
And for other Microsoft accounts, their screen looks similar to the one below:

  ![Locked out of a Microsoft account](./media/active-directory-secure-passwords/locked-out-ms-accounts.png)

For information about password management in Azure Active Directory, see [How password management works](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-passwords-how-it-works).

  >[!NOTE]
  >If you are an Azure AD administrator, you may want to use [Windows Hello](https://www.microsoft.com/en-us/windows/windows-hello) to avoid having your users create traditional passwords altogether.
  >

## Next steps
[How to update your own password](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-passwords-update-your-own-password)<br>
[The fundamentals of Azure identity management](https://docs.microsoft.com/en-us/azure/active-directory/fundamentals-identity)<br>
[How to get operational insights with password management reports](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-passwords-get-insights#view-password-reset-activity)


