---
title: Guidelines for Azure Marketplace and AppSource publisher | Azure
description: Guidelines for Azure Marketplace and AppSource for app and service publishers
services:  Azure, Marketplace, Compute, Storage, Networking, Blockchain, Security

author: jm-aditi-ms
manager: pabutler



ms.service: marketplace



ms.topic: article
ms.date: 06/13/2018
ms.author: ellacroi

---

# Guidelines  

<!--
## Guidelines for AppSource  
-->
---

## Guidelines for Azure Marketplace  

### Guidelines for creating a Microsoft ID to manage a marketplace account  
If more than one person requires access to the same Microsoft ID used to create your marketplace account, then you should follow these guidelines to help you create a company account. 

>[!IMPORTANT]
>To authorize multiple users to access your Microsoft Developer Center (Dev Center) account, Microsoft recommends that you use Azure Active Directory (Azure AD) to assign roles to individual users. Each user must access the account by signing in with individual Azure AD credentials. Create your Microsoft ID by using an email address in a domain registered to your company Microsoft suggests that the email not be assigned to an individual. An example is `windowsapps@fabrikam.com`.  
>*   For more information, visit the [Issue: Microsoft ID in an Azure AD federated domain](#issue-microsoft-id-in-an-azure-ad-federated-domain) section.  

*   Limit access to the Microsoft ID to the smallest possible number of developers. 
*   Set up a corporate email distribution list (DL) that includes everyone who must access your Dev Center account. Add the DL email address to your security information. The DL enables all of the employees on the list to receive security codes when requested and to manage the security information for your Microsoft ID. If setting up a distribution list is not feasible, then the owner of the individual email account must be available to access and share the security code when prompted.  
    *   For example, the owner is prompted when new security information is added to the Microsoft ID or when the Microsoft ID is accessed from a new device.  
*   Add a company phone number that does not require an extension and is accessible to key team members.  
*   In general, you should require developers to use trusted devices to sign into your Dev Center account. All key team members should have access to the trusted devices. Using trusted devices to access reduces the requirement for sending security codes when someone is accessing the Dev Center account.  
*   If you are required to grant access to the Dev Center account from a non-trusted computer, then you should limit access to no more than five developers. Ideally, your developers should access the account from computers that share the same geographical and network location.  
*   Frequently review and verify your security information.  
    *   To view your security information, visit the Security settings page located at [account.live.com/proofs/Manage](https://account.live.com/proofs/Manage).

Your Dev Center account should be primarily accessed from trusted computers. It is critical that you access from trusted computers, because there is a limit to the number of codes generated per Dev Center account per week. Using trusted computers also enables the most secure and consistent sign-in experience. 
*   For more information about additional Dev Center account guidelines and security, visit the Opening a developer account page located at [docs.microsoft.com/windows/uwp/publish/opening-a-developer-account](https://docs.microsoft.com/windows/uwp/publish/opening-a-developer-account). 

---

#### Issue: Microsoft ID in an Azure AD federated domain  
Your corporate account may be federated through Azure Active Directory (Azure AD). If you try to create a Microsoft ID using a corporate email address that is federated with Azure AD, then you receive an error. If you receive an error, then you should check with your IT team to confirm your account is federated through Azure AD. Azure AD federated email is a known issue and Microsoft is working to resolving it.  
*   For more information about Azure AD, visit the Azure Active Directory Documentation page located at [docs.microsoft.com/azure/active-directory](https://docs.microsoft.com/azure/active-directory).

Microsoft recommends a workaround. Follow these steps to create a new email address in the `outlook.com` domain and create a rule to forward your communications.  
1.  Go to the Create account page and click on the Get a new email address link. 
    *   To sign up for your Microsoft ID, visit the Create account page located at [signup.live.com/signup](https://signup.live.com/signup).  
2.  Create the new email address and enter a password. A new Microsoft ID and an email mailbox in the `outlook.com` domain is created. Continue the registration process until the account is created.  

    >[!IMPORTANT]
    >You must use an email address or distribution list that is registered as a Microsoft ID to register in Dev Center. Microsoft recommends that you use a distribution list to remove dependency from individuals. If your email address or distribution list is not registered, then you must register now.    

    >[!Important]
    >If your any email address is located in the `Microsoft` company domain, then you are not able to use it for registration in Dev Center.  

3.  After you create the Microsoft ID with the Outlook email address, sign into your Outlook mailbox. Create an email forwarding rule. The email forwarding rule should move all emails that are received in the Outlook mailbox to the email address in your domain that you created to manage your marketplace account.  
    *   To sign into your Outlook mailbox, visit the Outlook page located at [outlook.live.com/owa](https://outlook.live.com/owa).  
    *   For more information about forwarding rules, visit the Use rules in Outlook Web App to automatically forward messages to another account page located at [support.office.com/article/Use-rules-in-Outlook-Web-App-to-automatically-forward-messages-to-another-account-1433e3a0-7fb0-4999-b536-50e05cb67fed](https://support.office.com/article/Use-rules-in-Outlook-Web-App-to-automatically-forward-messages-to-another-account-1433e3a0-7fb0-4999-b536-50e05cb67fed).  

1.  The forwarding rule sends all email and communications received in the Outlook email account to the email address in a domain registered to your company. Your `outlook.com` email address must be used to authenticate in both Dev Center and Cloud Partner Portal.  

## Next steps

*   Visit the [Azure Marketplace and AppSource Publisher Guide](https://docs.microsoft.com/azure/marketplace/marketplace-publishers-guide) page. 
 
---
