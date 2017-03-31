---
title: Azure Active Directory PoC Playbook Building Blocks| Microsoft Docs
description: Explore and quickly implement Identity and Access Management scenarios 
services: active-directory
keywords: azure active directory, playbook, Proof of Concept, PoC
documentationcenter: ''
author: dstefan
manager: asuthar

ms.assetid: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 3/28/2017
ms.author: dstefan

---
# Azure Active Directory Proof of Concept Playbook: Building Blocks

## Catalog of Actors

| Actor | Description | PoC Responsibility | 
| --- | --- | --- |
| **Identity Architecture / development team** | This team is usually the one that designs the solution, implements prototypes, drives approvals and finally hands off to operations | They provide the environments and are the ones evaluating the different scenarios from the manageability perspective |
| **On-Premises Identity Operations team** | Manages the different identity sources on-premises: Active Directory Forests, LDAP directories, HR systems, and Federation Identity Providers. | Provide access to onpremises resources needed for the PoC scenarios.<br/>They should be involved as little as possible| 
| **Application Technical Owners** | Technical owners of the different cloud apps and services that will integrate with Azure AD | Provide details on SaaS applications (potentially instances for testing) |
| **Azure AD Global Admin** | Manages the Azure AD configuration | Provide credentials to configure the synchronization service. Usually the same team as Identity Architecture during PoC but separate during the operations phase|
| **Database team** | Owners of the Database infrastructure | Provide access to SQL environment (ADFS or Azure AD Connect) for specific scenario preparations.<br/>They should be involved as little as possible |
| **Network team** | Owners of the Network infrastructure | Provide required access at the network level for the synchronization servers to properly access the data sources and cloud services (firewall rules, ports opened, IPSec rules etc.) | 
| **Security team** | Defines the security strategy, analyzes security reports from various sources and follows through on findings. | Provide target security evaluation scenarios | 

## Common Prerequisites for all building blocks

Below are some pre-requisites needed for any POC with Azure AD Premium. 

| Pre-requisite | Resources | 
| --- | --- |
| Azure AD tenant defined with a valid Azure subscription | [How to get an Azure Active Directory tenant](active-directory-howto-tenant.md)<br/>>[!Note]If you already have an environment with Azure AD Premium licenses, you can get a zero cap subscription by navigating to https://aka.ms/accessaad <br/>> Learn more at: https://blogs.technet.microsoft.com/enterprisemobility/2016/02/26/azure-ad-mailbag-azure-subscriptions-and-azure-ad-2/ and https://technet.microsoft.com/library/dn832618.aspx | 
| Domains defined and verified | [Add a custom domain name to Azure Active Directory](active-directory-domains-add-azure-portal.md)<br/>>[!Note]Some workloads such as Power BI could have provisioned an azure AD tenant under the covers. To check if a given domain is associated to a tenant, navigate to https://login.microsoftonline.com/{domain}/v2.0/.well-known/openid-configuration. If you get a successful response, then the domain is already assigned to a tenant and take over might be needed. If this is the case, please contact Microsoft for further guidance. Learn more about the takeover options at: [What is Self-Service Signup for Azure?](active-directory-self-service-signup) | 
| Azure AD Premium or EMS trial Enabled | [Azure Active Directory Premium free for one month](https://azure.microsoft.com/trial/get-started-active-directory/) |
| You have assigned Azure AD Premium or EMS licenses to PoC users | [License yourself and your users in Azure Active Directory](active-directory-licensing-get-started-azure-portal.md) | 
| Azure AD Global Admin credentials | [Assigning administrator roles in Azure Active Directory](active-directory-assign-admin-roles-azure-portal.md) |
| Optional but strongly recommended: Parallel lab environment as a fallback | [Prerequisites for Azure AD Connect](./connect/active-directory-aadconnect-prerequisites.md) | 

## Directory Synchronization – Password Hash Sync (PHS) – New Installation 

Approximate time to Complete: 1 hour for less than 1,000 PoC users

### Pre-requisites

| Pre-requisite | Resources |
| --- | --- |
| Server to Run Azure AD Connect | [Prerequisites for Azure AD Connect](./connect/active-directory-aadconnect-prerequisites.md) |
| Target POC users, in the same domain and part of a security group, and OU | [Custom installation of Azure AD Connect](./connect/active-directory-aadconnect-get-started-custom.md#domain-and-ou-filtering) |
| Azure AD Connect Features needed for the POC are identified | [Connect Active Directory with Azure Active Directory - Configure sync features](./connect/active-directory-aadconnect.md#configure-sync-features) |
| You have needed credentials for on prem and cloud environments  | [Azure AD Connect: Accounts and permissions](./connect/active-directory-aadconnect-accounts-permissions.md) | 

### Steps

| Step | Resources |
| --- | --- |
| Download the latest version of Azure AD Connect | [Download Microsoft Azure Active Directory Connect](https://www.microsoft.com/download/details.aspx?id=47594) |
| Install Azure AD Connect with the simplest path – Express <br/>1. Filter to the target OU to minimize the Sync Cycle time<br/>2. Choose target set of users in the on-premises group.<br/>3. Deploy the features needed by the other POC Themes | [Azure AD Connect: Custom installation: Domain and OU filtering](./connect/active-directory-aadconnect-get-started-custom.md#domain-and-ou-filtering) <br/>[Azure AD Connect: Custom installation: Group based filtering](./connect/active-directory-aadconnect-get-started-custom.md#sync-filtering-based-on-groups)<br/>[Azure AD Connect: Integrating your on-premises identities with Azure Active Directory: Configure Sync Features](./connect/active-directory-aadconnect.md#configure-sync-features) |
| Open the Azure AD Connect UI and see the running profiles completed (Import, sync, and export) | [Azure AD Connect sync: Scheduler](./connect/active-directory-aadconnectsync-feature-scheduler.md) || Open the [Azure AD management portal](https://ms.portal.azure.com/#blade/Microsoft_AAD_IAM/UserManagementMenuBlade/), go to the "All Users" blade, add "Source of authority" column and see that the users appear, marked properly as coming from "Windows Server AD" | [Azure AD management portal](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview) |
### Considerations

1. Please look at  the security considerations of password hash sync [here](./connect/active-directory-aadconnectsync-implement-password-synchronization.md).  If password hash sync for pilot production users is definitively not an option, then consider the following alternatives:
   * Create test users in the production domain. Make sure you don’t synchronize any other account
   * Move to an UAT environment
2.	If you want to pursue federation, it is worthwhile to understand the costs associated a federated solution with on premises Identity Provider beyond the POC and measure that against the benefits you are looking for:
    * It is in the critical path so you have to design for high availability
    * It is an on-premises service you need to capacity plan
    * It is an on-premises service you need to monitor/maintain/patch
 
Learn more: [Understanding Office 365 identity and Azure Active Directory - Federated Identity](https://support.office.com/article/Understanding-Office-365-identity-and-Azure-Active-Directory-06a189e7-5ec6-4af2-94bf-a22ea225a7a9#bk_federated)

## Branding 

Approximate time to Complete: 15 minutes

### Pre-requisites

| Pre-requisite | Resources |
| --- | --- |
| Assets (Images, Logos, etc.); For best visualization make sure the assets have the recommended sizes. | [Add company branding to your sign-in page in the Azure Active Directory](active-directory-branding-custom-signon-azure-portal.md) |
| Optional: If the environment has an  AD FS server, access to the server to customize web theme | [AD FS user sign-in customization](https://technet.microsoft.com/windows-server-docs/identity/ad-fs/operations/ad-fs-user-sign-in-customization) | 
| Client computer to perform end user login experience |  | 
| Optional: Mobile devices to validate experience |  | 

### Steps

| Step | Resources |
| --- | --- |
| Go to Azure AD Management Portal | [Azure AD Management Portal - Company Branding](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/LoginTenantBranding) | 
| Upload the assets for the login page (hero logo, small logo, labels, etc.). Optionally if  you have AD FS, align the same assets with AD FS login pages | [Add company branding to your sign-in and Access Panel pages: Customizable Elements](active-directory-add-company-branding#customizable-elements) |
| Wait a couple of minutes for the change to fully take effect |  | 
| Login with the POC user credential to https://myapps.microsoft.com |  | 
| Confirm the look and feel in browser | [Add company branding to your sign-in and Access Panel pages: Access Panel Page customization](active-directory-add-company-branding.md#access-panel-page-customization) <br/>[Add company branding to your sign-in and Access Panel pages: Testing and examples](active-directory-add-company-branding.md#testing-and-examples) |
| Optionally, confirm the look and feel in other devices |  | 

### Considerations

If the old look and feel remains after the customization then flush the browser client cache, and retry the operation.

## Group based licensing

Approximate time to Complete: 10 minutes

### Pre-requisites

| Pre-requisite | Resources |
| --- | --- |
| All POC users are part of a security group (either cloud or on-premises) | [Create a group and add members in Azure Active Directory](active-directory-groups-create-azure-portal.md) | 

### Steps

| Step | Resources |
| --- | --- |
| Go to licenses blade in Azure AD Management Portal | [Azure AD Management Portal: Licensing](https://portal.azure.com/#blade/Microsoft_AAD_IAM/LicensesMenuBlade/Products) | 
| Assign the licenses to the security group with POC users. | [Assign licenses to a group of users in Azure Active Directory](active-directory-licensing-group-assignment-azure-portal.md) | 

### Considerations

In case of any issues, go to [Scenarios, limitations, and known issues with using groups to manage licensing in Azure Active Directory](active-directory-licensing-group-advanced.md)

## SaaS Federated SSO Configuration 

Approximate time to Complete: 60 minutes

### Pre-requisites

| Pre-requisite | Resources |
| --- | --- |
| Test environment of the SaaS application available. In this guide, we use ServiceNow as an example.<br/>We strongly recommend to use a test  instance to minimize friction on navigating existing data quality and mappings. | Go to https://developer.servicenow.com/app.do#!/home to start the process of getting a test instance | 
| Admin access to the ServiceNow management console | [Tutorial: Azure Active Directory integration with ServiceNow](active-directory-saas-servicenow-tutorial.md) | 
| Target set of users to assign the application to. A security group containing the PoC users is recommended. <br/>If creating the group is not feasible, then assign the users to directly to the application for the PoC | [Assign a user or group to an enterprise app in Azure Active Directory](active-directory-coreapps-assign-user-azure-portal.md) |

### Steps

| Step | Resources |
| --- | --- |
| Share the tutorial to all actors from Microsoft Documentation  | [Tutorial: Azure Active Directory integration with ServiceNow](active-directory-saas-servicenow-tutorial.md) | 
| Set a working meeting and follow the tutorial steps with each actor. | [Tutorial: Azure Active Directory integration with ServiceNow](active-directory-saas-servicenow-tutorial.md) | 
| Assign the app to the group identified in the Prerequisites. If the POC has conditional access in the scope, you can revisit that later and add MFA, and similar. <br/>Note this will kick in the provisioning process (if configured) |  [Assign a user or group to an enterprise app in Azure Active Directory](active-directory-coreapps-assign-user-azure-portal.md) <br/>[Create a group and add members in Azure Active Directory](active-directory-groups-create-azure-portal.md) |
| Use Azure AD management Portal to add ServiceNow Application from Gallery| [Azure AD management Portal: Enterprise Applications](https://portal.azure.com/#blade/Microsoft_AAD_IAM/StartboardApplicationsMenuBlade/Overview) <br/>[What's new in Enterprise Application management in Azure Active Directory](active-directory-enterprise-apps-whats-new-azure-portal.md) | 
| In "Single sign-on" blade of ServiceNow App enable "SAML-based Sign-on" in "Single sign-on" blade of ServiceNow App |  | 
| Fill out "Sign on URL" and "Identifier" fields with your ServiceNow URL<br/>Check the box to "Make new certificate active"<br/>and Save settings |  |
| Open "Configure ServiceNow" blade on the bottom of the panel to view customized instructions for you to configure ServiceNow |  | 
| Follow instructions to configure ServiceNow |  |
| In "Provisioning" blade of ServiceNow App enable "Automatic" provisionig | [Managing user account provisioning for enterprise apps in the new Azure portal](active-directory-enterprise-apps-manage-provisioning.md) |
| Wait for a few minutes while provisioning completes.  In the meantime, you can check on the provisioning reports |  | 
| Log in to https://myapps.microsoft.com/ as a test user that has access | [What is the Access Panel?](active-directory-saas-access-panel-introduction) |
| Click on the tile for the application that was just created. Confirm access |  | 
| Optionally, you can check the application usage reports. Note there is some latency, so you need to wait some time to see the traffic in the reports. | [Sign-in activity reports in the Azure Active Directory portal: Usage of managed applications](active-directory-reporting-activity-sign-ins.md#usage-of-managed-applications)<br/>[Azure Active Directory report retention policies](active-directory-reporting-retention.md) |

### Considerations

1. Above [Tutorial](active-directory-saas-servicenow-tutorial.md) refers to old Azure AD management experience. But PoC is based on [Quick start](active-directory-enterprise-apps-whats-new-azure-portal#quick-start-get-going-with-your-new-application-right-away) experience.
2. If the target application is not present in the gallery, then you can use bring your own app. Learn more: [What's new in Enterprise Application management in Azure Active Directory: Add custom applications from one place](active-directory-enterprise-apps-whats-new-azure-portal.md#add-custom-applications-from-one-place)

## SaaS Password SSO Configuration

Approximate time to Complete: 15 minutes

### Pre-requisites

| Pre-requisite | Resources |
| --- | --- |
| Test environment for SaaS applications. An example of Password SSO is HipChat and Twitter. For any other application, you need the exact URL of the page with html sign in form. | [Twitter on Microsoft Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/aad.twitter)<br/>[HipChat on Microsoft Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/aad.hipchat) | 
| Test accounts for the applications. | [Sign up for Twitter](https://twitter.com/signup?lang=en)<br/>[Sign Up for Free | HipChat](https://www.hipchat.com/sign_up) |
| Target set of users to assign the application to. A security group contained the users is recommended. | [Assign a user or group to an enterprise app in Azure Active Directory](active-directory-coreapps-assign-user-azure-portal.md) |
| Local administrator access to a computer to deploy the Access Panel Extension for Internet Explorer, Chrome or Firefox | [Access Panel Extension for IE](https://account.activedirectory.windowsazure.com/Applications/Installers/x64/Access%20Panel%20Extension.msi)<br/>[Access Panel Extension for Chrome](https://go.microsoft.com/fwLink/?LinkID=311859&clcid=0x409)<br/>[Access Panel Extension for Firefox](https://go.microsoft.com/fwLink/?LinkID=626998&clcid=0x409) |

### Steps

| Step | Resources |
| --- | --- |
| Install the browser extension | [Access Panel Extension for IE](https://account.activedirectory.windowsazure.com/Applications/Installers/x64/Access%20Panel%20Extension.msi)<br/>[Access Panel Extension for Chrome](https://go.microsoft.com/fwLink/?LinkID=311859&clcid=0x409)<br/>[Access Panel Extension for Firefox](https://go.microsoft.com/fwLink/?LinkID=626998&clcid=0x409) |
| Configure Application from Gallery | [What's new in Enterprise Application management in Azure Active Directory: The new and improved application gallery](active-directory-enterprise-apps-whats-new-azure-portal#the-new-and-improved-application-gallery) |
| Configure Password SSO | [Managing single sign-on for enterprise apps in the new Azure portal: Password-based sign on](active-directory-enterprise-apps-manage-sso.md#password-based-sign-on) |
| Assign the app to the group identified in the Prerequisites | [Assign a user or group to an enterprise app in Azure Active Directory](active-directory-coreapps-assign-user-azure-portal.md) |
| Log in to https://myapps.microsoft.com/ as a test user that has access |  |
| Click on the tile for the application that was just created. | [What is the Access Panel?: Password-based SSO without identity provisioning](active-directory-saas-access-panel-introduction.md#password-based-sso-without-identity-provisioning) | 
| Supply the application credential | [What is the Access Panel?: Password-based SSO without identity provisioning](active-directory-saas-access-panel-introduction.md#password-based-sso-without-identity-provisioning) |
| Close the browser and repeat the login. This time around the user should see seamless access to the application. |  | 
| Optionally, you can check the application usage reports. Note there is some latency, so you need to wait some time to see the traffic in the reports. | [Sign-in activity reports in the Azure Active Directory portal: Usage of managed applications](active-directory-reporting-activity-sign-ins.md#usage-of-managed-applications)<br/>[Azure Active Directory report retention policies](active-directory-reporting-retention.md) |

### Considerations


1. If the target application is not present in the gallery, then you can use bring your own app. Learn more: [What's new in Enterprise Application management in Azure Active Directory: Add custom applications from one place](active-directory-enterprise-apps-whats-new-azure-portal.md#add-custom-applications-from-one-place)

    Keep in mind the following requirements:
    * Application should have a known login URL
    * The sign in page should contain an HTML form with one more text fields that the browser extensions can auto-populate. At the minimum, it should contain username and password. 

## SaaS Shared Accounts Configuration



### Pre-requisites

| Pre-requisite | Resources |
| --- | --- |
| 

### Steps

| Step | Resources |
| --- | --- |
| 

### Considerations



## Groups – Delegated Ownership 



### Pre-requisites

| Pre-requisite | Resources |
| --- | --- |
| 

### Steps

| Step | Resources |
| --- | --- |
| 

### Considerations



## Self Service Password Reset



### Pre-requisites

| Pre-requisite | Resources |
| --- | --- |
| 

### Steps

| Step | Resources |
| --- | --- |
| 

### Considerations



## Self Service Access to Application Management 



### Pre-requisites

| Pre-requisite | Resources |
| --- | --- |
| 

### Steps



### Considerations



## Azure Multi-Factor Authentication with Phone Calls



### Pre-requisites

| Pre-requisite | Resources |
| --- | --- |
| 

### Steps

| Step | Resources |
| --- | --- |
| 

### Considerations



## MFA Conditional Access for SaaS applications 



### Pre-requisites

| Pre-requisite | Resources |
| --- | --- |
| 

### Steps

| Step | Resources |
| --- | --- |
| 

### Considerations



## Privileged Identity Management (PIM) 



### Pre-requisites

| Pre-requisite | Resources |
| --- | --- |
| 

### Steps

| Step | Resources |
| --- | --- |
| 

### Considerations



## Discovering Risk Events



### Pre-requisites

| Pre-requisite | Resources |
| --- | --- |
| 

### Steps

| Step | Resources |
| --- | --- |
| 

### Considerations



## Deploying Sign-in risk policies 



### Pre-requisites

| Pre-requisite | Resources |
| --- | --- |
| 

### Steps

| Step | Resources |
| --- | --- |
| 

### Considerations



[!INCLUDE [active-directory-playbook-toc](../../includes/active-directory-playbook-toc.md)]