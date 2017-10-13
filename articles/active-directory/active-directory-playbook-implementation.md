---
title: Azure Active Directory PoC Playbook Implementation | Microsoft Docs
description: Explore and quickly implement Identity and Access Management scenarios 
services: active-directory
keywords: azure active directory, playbook, Proof of Concept, PoC
documentationcenter: ''
author: dstefanMSFT
manager: asuthar

ms.assetid: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 4/12/2017
ms.author: dstefan

---
# Azure Active Directory Proof of Concept Playbook: Implementation

## Foundation - Syncing AD to Azure AD 

A hybrid identity is the foundation for most of the enterprise customers who already have an on-premises directory. The goal here is to intentionally spend as less time here as possible to show the value of the actual identity and access scenarios. 

| Scenario | Building Blocks| 
| --- | --- |  
| [Extending your on-premises identity to the cloud](#extending-your-on-premises-identity-to-the-cloud) | [Directory Synchronization - Password Hash Sync](active-directory-playbook-building-blocks.md#directory-synchronization---password-hash-sync-phs---new-installation) <br/>**Note**: If you already have DirSync/ADSync or earlier versions of Azure AD Connect, this step is optional. Some scenarios in this guide might require newer version of Azure AD Connect.  <br/>[Branding](active-directory-playbook-building-blocks.md#branding) | 
| [Assigning Azure AD licenses using groups](#assigning-azure-ad-licenses-using-groups) | [Group based licensing](active-directory-playbook-building-blocks.md#group-based-licensing) |


### Extending your on-premises identity to the cloud 

1. Bob is the Active Directory administrator at Contoso. He gets the requirement to enable identity as a service for a set of users. After execution of Azure AD Connect wizard, the identity of the target users available in the cloud. 
2. Bob asks Susie, one of the target users, to access the Azure Active Directory access panel and confirm that she can authenticate. Susie sees a branded login page and an empty access panel which is ready for enabling future application access.

### Assigning Azure AD licenses using Groups 

1. Bob is the Azure AD Global Admin and wants to allocate Azure AD licenses to a specific set of users as part of the initial rollout of Azure AD.
2. Bob creates a group for the pilot users. 
3. Bob assigns the licenses to the group
4. Susie, one of the information workers, is added to the security group as part of her job functions
5. After some time, Susie has access to the Azure AD premium license. This will enable more of the POC scenarios later on.

## Theme - Lots of apps, one identity

| Scenario | Building Blocks| 
| --- | --- |  
| [Integrate SaaS Applications - Federated SSO](#integrate-saas-applications---federated-sso) | [SaaS Federated SSO Configuration](active-directory-playbook-building-blocks.md#saas-federated-sso-configuration) <br/>[Groups - Delegated Ownership](active-directory-playbook-building-blocks.md#groups---delegated-ownership) |
| [Integrate SaaS Applications - Password SSO](#integrate-saas-applications---password-sso) | [SaaS Password SSO Configuration](active-directory-playbook-building-blocks.md#saas-password-sso-configuration) |
| [SSO and Identity Lifecycle Events](#sso-and-identity-lifecycle-events) | [SaaS and Identity Lifecycle](active-directory-playbook-building-blocks.md#saas-and-identity-lifecycle) |
| [Secure Access to Shared Accounts](#secure-access-to-shared-accounts) | [SaaS Shared Accounts Configuration](active-directory-playbook-building-blocks.md#saas-shared-accounts-configuration) |
| [Secure Remote Access to On-Premises Applications](#secure-remote-access-to-on-premises-applications) | [App Proxy Configuration](active-directory-playbook-building-blocks.md#app-proxy-configuration) |
| [Synchronize LDAP identities to Azure AD](#synchronize-ldap-identities-to-azure-ad) |  [Generic LDAP Connector configuration](active-directory-playbook-building-blocks.md#generic-ldap-connector-configuration) |

### Integrate SaaS Applications - Federated SSO 

1. Bob is the Azure AD Global Admin and receives a request from the Marketing department to enable access to their ServiceNow Instance. Bob finds the step-by-step tutorial in Azure AD documentation and follows it, and delegates the assignment of users to the app to Kevin, the head of Marketing team. 
2. Kevin logs in as the owner of ServiceNow entitlements and assigns Susie to the app. Kevin also notices that Susie's profile was created in ServiceNow automatically
3. Susie is an information worker in the Marketing department. She logs in to azure AD and finds all SaaS applications she is assigned to in myapps portal. From there, she seamlessly gets access to ServiceNow.
4. The Marketing department wants to audit who accessed ServiceNow. Bob downloads an activity report and shares it with Kevin over email.  

### SSO and Identity Lifecycle Events

1. Susie takes a leave of absence, and by corporate policy the on-premises AD account is temporary disabled. Susie now can't log in to Azure AD and therefore can't access ServiceNow. 
2. Susie makes a lateral move from Marketing to Sales. Kevin removes her access from ServiceNow. Susie logs in the azure ad myapps and she no longer sees the ServiceNow Tile. After 10 minutes, Kevin confirms that Susie account was disabled from ServiceNow Management console.

### Integrate SaaS Applications - Password SSO

1. Bob configures access to Atlassian HipChat. HipChat has Password SSO integration and grant access to Susie
2. Susie logs in to the myapps portal and sees a link to download the Azure AD IE browser extension, which she downloads
3. Upon clicking, she gets prompted for her HipChat username and password credentials. This is a one-time operation, and after completing it she has access to HipChat
4. A few days later, Susie opens myapps portal and clicks HipChat again. This time around, she gets seamless access
5. Kevin, the HipChat app owner, wants to audit who accessed the application. Bob downloads an audit report and shares it with Kevin over email. 

### Secure Access to Shared Accounts 

1. Bob is tasked to secure the shared Twitter handle for members of the Sales team. He adds Twitter as an SSO application, and assigns it to the security group of the Sales Team. He was given the credentials to the shared account and he supplies it in the system. 
2. Sharing Twitter credentials is no longer trusted due to multiple people knowing it. Bob enables automatic rollover of the Twitter password.
3. Susie, a member of the Sales team, logs in to the myapps portal and sees a link to download the Azure AD IE browser extension. She installs it.
4. Upon clicking she get access directly to Twitter. She does not know the password.
5. Arnold is also part of the sales team. He has the same experience as Susie in steps 3-4
6. The Sales department wants to audit who accessed Twitter. Bob downloads an activity report and shares it with Kevin over email. 

### Secure Remote Access to On-Premises Applications

1. Bob, the Azure AD Global Admin, has gotten numerous requests to enable employees to access several useful on-premises resources, such as the expenses application, while working remotely. He follows the [Application Proxy documentation](active-directory-application-proxy-enable.md) to install a connector and publish Expenses as an Application Proxy application. 
2. Bob share the external Expenses application URL with Susie, one of the employees who needs remote access. She accesses the link, and after authenticating against AAD, she is able to access the Expenses app and continue to be productive while remote. 
3. Bob then continues to publish additional on-premises applications using the same process and giving access to users as needed. He adds conditional access and multi-factor authentication for the more sensitive applications that he publishes, to ensure additional security.

### Synchronize LDAP identities to Azure AD

1. Bob's company has complex identity infrastructure. Most of the users are maintained inside Windows Server Active Directory Domain Services (ADDS). Some of them, are managed by HR system inside Active Directory Lightweight Directory Services (ADLDS).
2. Bob is tasked with enabling access to SaaS apps for all users (also these not present in ADDS).
3. Bob configures Generic LDAP Connector to pull data from ADLDS in Azure AD Connect.
4. Bob creates synchronization rules so LDAP users are populated into Metaverse and to Azure AD
5. Susie being LDAP user accesses her SaaS app using synchronized identity



> [!IMPORTANT] 
> This is an advanced configuration requiring some familiarity with FIM/MIM. If used in production, we advise questions about this configuration go through [Premier Support](https://support.microsoft.com/premier).



## Theme - Increase your security 

| Scenario | Building Blocks| 
| --- | --- |  
| [Secure administrator account access](#secure-administrator-account-access) | [Azure MFA with Phone Calls](active-directory-playbook-building-blocks.md#azure-multi-factor-authentication-with-phone-calls) |
| [Secure access for applications](#secure-access-to-applications) | [Conditional Access for SaaS applications](active-directory-playbook-building-blocks.md#mfa-conditional-access-for-saas-applications) |
| [Enable Just In Time administration](#enable-just-in-time-jit-administration) | [Privileged Identity Management](active-directory-playbook-building-blocks.md#privileged-identity-management-pim) |
| [Protect identities based on risk](#protect-identities-based-on-risk) | [Discovering risk events](active-directory-playbook-building-blocks.md#discovering-risk-events) <br/>[Deploying Sign-in risk policies](active-directory-playbook-building-blocks.md#deploying-sign-in-risk-policies) |
| [Authenticate without passwords using certificate based authentication](#authenticate-without-passwords-using-certificate-based-authentication) | [Configuring certificate based authentication](active-directory-playbook-building-blocks.md#configuring-certificate-based-authentication)

### Secure administrator account access

1. Bob is the Azure AD Global Administrator. He has identified Stuart as a co-administrator of the service. 
2. Bob configures Stuart's account to always require MFA to improve the security posture
3. Stuart logs in to the Azure  portal, and notices that he needs to register his phone number to continue the login
4. Subsequent logins from Stuart are now protected with Multi-Factor Authentication, and he now gets a phone call to verify his identity.

### Secure access to applications

1. Kevin is the business owner of ServiceNow. The company now wants those users to login with MFA when accessing outside the corporate network.
2. Bob, our Azure AD Global admin, adds a conditional access policy to the ServiceNow application to enable MFA for outside access
3. Susie, our information worker, logs in my apps portal and clicks the ServiceNow tile. She is now challenged with MFA.

### Enable Just in time (JIT) administration

1. Bob and Stuart are Azure AD Global Admins. They want to enable JIT access to the management roles and also to keep records on the usage of the privileged roles.
2. Bob enables PIM in the Azure AD tenant and becomes the security administrator. He changes both himself and Stuart's global admin role membership from permanent to eligible.
3. Bob and Stuart now require activating their role through the Azure portal before doing any changes to Azure AD Configuration. 

### Protect Identities based on risk 

1. Susie, an information worker attempts logging in from a tor browser. 
2. Bob checks the Azure AD identity protection dashboard, and sees Susie's login from an anonymous IP address. The security team wants to challenge such accesses users with MFA
3. Bob enables Azure AD Identity Protection Policy to challenge MFA for medium or higher risk events
4. Time goes by, and Susie logs in from Tor browser again. This time, she will see the MFA challenge

### Authenticate without passwords using certificate based authentication

1. Bob is Global Administrator for financial institution, that forbids use of passwords as an authentication factor for their applications.
2. Bob enables and enforces certificate authentication on ADFS and Azure AD
3. Susie while accessing application is prompted to authenticate using certificate

## Theme - Scale with Self Service

| Scenario | Building Blocks| 
| --- | --- |  
| [Self Service Password Reset](#self-service-password-reset) | [Self Service Password Reset](active-directory-playbook-building-blocks.md#self-service-password-reset) |
| [Self Service Access to Applications](#self-service-access-to-applications) | [Self Service Access to Applications](active-directory-playbook-building-blocks.md#self-service-access-to-application-management) |

### Self Service Password Reset 

1. Bob is the Azure AD Global admin and enables Self Service Password Management to a subset of users, including Susie. 
2. Susie logs in to myapps portal and see a message to register her security information for future password reset events.
3. Fast forward a few days, Susie forgets her password, and resets it through Azure AD portal

### Self Service Access to Applications 

1. Kevin is the business owner of ServiceNow. He wants users to "sign up" for it on demand, instead of adding them all at once
2. Bob, our Azure AD Global admin, modifies the ServiceNow application to enable self service requests
3. Susie, our information worker, logs in my apps portal and clicks the "Add more applications" button and see ServiceNow as one of the recommended applications. Then she navigates back to my apps portal and see the ServiceNow application.

[!INCLUDE [active-directory-playbook-toc](../../includes/active-directory-playbook-steps.md)]