<properties
	pageTitle="SaaS App Management Guide for Azure Active Directory | Microsoft Azure"
	description="Learn how to customize the expiration date for your federation certificates, and how to renew certificates that will soon expire."
	services="active-directory"
	documentationCenter=""
	authors="liviodlc"
	manager="terrylan"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="12/18/2015"
	ms.author="liviodlc"/>

#SaaS App Management Guide for Azure Active Directory

This guide is intended to help IT professionals understand and use the various SaaS app-related features available in Azure Active Directory (Azure AD).

This page offers a brief introduction to each major feature area and provides a comprehensive list of every article written about that feature. Some features are only available for certain pricing tiers, so please refer to [Azure Active Directory Pricing](https://azure.microsoft.com/pricing/details/active-directory/) for details.

##Overview

The articles below are good starting points for those who simply want a brief explanation of Azure AD's app management features. These topics are explored at depth throughout the rest of this guide.

| Article Guide |   |
| :---: | --- |
| An introduction to the application management problems that Azure AD solves | [Managing Applications with Azure Active Directory (AD)](active-directory-enable-sso-scenario.md) |
| An overview of the various features in Azure AD related to enabling single sign-on, defining who has access to apps, and how users launch apps | [Application Access and Single Sign-on in Azure Active Directory](active-directory-appssoaccess-whatis.md) |
| A look at the different steps involved when integrating apps into your Azure AD | [Integrating Azure Active Directory with Applications](active-directory-integrating-applications-getting-started.md)<br /><br />[Enabling Single Sign-On to SaaS Apps](active-directory-sso-integrate-saas-apps.md)<br /><br />[Managing Access to Apps](active-directory-managing-access-to-apps.md) |
| A technical explanation of how apps are represented in Azure AD | [How and Why Applications are Added to Azure AD](active-directory-how-applications-are-added.md) |


##Cloud App Discovery: Find which SaaS Apps are being Used in Your Organization

Cloud App Discovery helps IT departments learn which SaaS apps are being used throughout the organization. It can measure app usage and popularity so that IT can determine which apps will benefit the most from being brought under IT control and being integrated with Azure AD.

| Article Guide |   |
| :---: | --- |
| A general overview of how it works | [Finding unsanctioned cloud applications with Cloud App Discovery](active-directory-cloudappdiscovery-whatis.md) |
| A deeper dive into how it works, with answers to questions on privacy | [Security and Privacy Considerations](active-directory-cloudappdiscovery-security-and-privacy-considerations.md) |
| Frequently Asked Questions | [FAQ for Cloud App Discovery](http://social.technet.microsoft.com/wiki/contents/articles/24037.cloud-app-discovery-frequently-asked-questions.aspx) |
| Tutorials for deploying Cloud App Discovery | [Group Policy Deployment Guide](http://social.technet.microsoft.com/wiki/contents/articles/30965.cloud-app-discovery-group-policy-deployment-guide.aspx)<br /><br />[System Center Deployment Guide](http://social.technet.microsoft.com/wiki/contents/articles/30968.cloud-app-discovery-system-center-deployment-guide.aspx)<br /><br />[Installing on Proxy Servers with Custom Ports](active-directory-cloudappdiscovery-registry-settings-for-proxy-services.md) |
| The change log for updates to the Cloud App Discovery agent | [Change log](http://social.technet.microsoft.com/wiki/contents/articles/24616.cloud-app-discovery-agent-changelog.aspx) |

##Federated Single Sign-On (SSO): Sign Into Many Apps Using One Identity

Single sign-on allows users to access a variety of apps and services using only one set of credentials. Federation is one method through which you can enable single sign-on. When users attempt to sign into federated apps, they will get redirected to their organization's official sign-in page rendered by Azure Active Directory, and are then redirected back to the app upon successful authentication.

| Article Guide |   |
| :---: | --- |
| An introduction to federation and other types of sign-on | [Single Sign-On with Azure AD](active-directory-appssoaccess-whatis.md) |
| Thousands of SaaS apps that are pre-integrated with Azure AD with simplified single sign-on configuration steps | [Getting started with the Azure AD application gallery](active-directory-appssoaccess-whatis.md#get-started-with-the-azure-ad-application-gallery)<br /><br />[Full List of Pre-Integrated Apps that Support Federation](http://aka.ms/aadfederatedapps)<br /><br />[How to Add Your App to the Azure AD App Gallery](active-directory-app-gallery-listing.md) |
| More than 150 app tutorials on how to configure single sign-on for apps such as [Salesforce](active-directory-saas-salesforce-tutorial.md), [ServiceNow](active-directory-saas-servicenow-tutorial.md), [Google Apps](active-directory-saas-google-apps-tutorial.md), [Workday](active-directory-saas-workday-tutorial.md), and many more | [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md) |
| How to manually set up and customize your single sign-on configuration | [How to Configure Federated Single Sign-On to Apps that are not in the Azure Active Directory Application Gallery](active-directory-saas-custom-apps.md)<br /><br />[How to Customize Claims Issued in the SAML Token for Pre-Integrated Apps](active-directory-saml-claims-customization.md) |
| Troubleshooting guide for federated apps that use the SAML protocol | [Troubleshooting SAML-Based Single Sign-On](active-directory-saml-debugging.md) |
| How to configure your app's certificate's expiration date, and how to renew your certificates | [Managing Certificates for Federated Single Sign-On in Azure Active Directory](active-directory-sso-certs.md) |

##Password-Based Single Sign-On (SSO): Account Sharing and SSO for Non-Federated Apps

To enable single sign-on to applications that don't support federation, Azure AD offers password management features that can securely store passwords to SaaS apps and automatically sign users into those apps. You can easily distribute credentials for newly created accounts and share team accounts with multiple people. Users don't necessarily need to know the credentials to the accounts that they're given access to.

| Article Guide |   |
| :---: | --- |
| An introduction to how password-based SSO works and a brief technical overview | [Password-Based Single Sign-On with Azure AD](active-directory-appssoaccess-whatis.md#password-based-single-sign-on) |
| A summary of the scenarios related to account sharing and how these problems are solved by Azure AD | [Sharing accounts with Azure AD](active-directory-sharing-accounts.md) |
| Deployment and troubleshooting guides for the Internet Explorer version of Azure AD's password management extension | [How to Deploy the Access Panel Extension for Internet Explorer using Group Policy](active-directory-saas-ie-group-policy.md)<br /><br />[Troubleshooting the Access Panel Extension for Internet Explorer](active-directory-saas-ie-troubleshooting.md) |

##Conditional Access: Enforce Additional Security Requirements for High-Risk Apps

Once you set up single sign-on to your apps and resources, you can then further secure sensitive applications by enforcing specific security requirements on every sign-in to that app. For instance, you can use Azure AD to demand that all access to a particular app always require multi-factor authentication, regardless of whether or not that app innately supports that functionality. Another common example of conditional access is to require that users be connected to the organization's trusted network in order to access a particularly sensitive application.

| Article Guide |   |
| :---: | --- |
| An introduction to the conditional access capabilities offered across Azure AD, Office365, and Intune | [Managing Risk With Conditional Access](active-directory-conditional-access.md) |
| How to enable conditional access for the following types of resources | [Conditional Access for SaaS Apps](active-directory-conditional-access-azuread-connected-apps.md)<br /><br />[Conditional Access for Office 365 services](active-directory-conditional-access-device-policies.md)<br /><br />[Conditional Access for On-Premises Applications](active-directory-conditional-access-on-premises-setup.md)<br /><br />[Conditional Access for On-Premises Applications Published via Azure AD App Proxy](active-directory-application-proxy-conditional-access.md) |
| How to register devices with Azure Active Directory in order to enable device-based conditional access policies | [Overview of Azure Active Directory Device Registration](active-directory-conditional-access-device-registration-overview.md)<br /><br />[How to Enable Automatic Device Registration for Domain Joined Windows Devices](active-directory-conditional-access-automatic-device-registration.md)<br />— [Steps for Windows 8.1 devices](active-directory-conditional-access-automatic-device-registration-windows8_1.md)<br />— [Steps for Windows 7 devices](active-directory-conditional-access-automatic-device-registration-windows7.md) |
| How to use the Android version of the Azure Authenticator app for policies involving multi-factor authentication | [Azure Authenticator for Android](active-directory-conditional-access-azure-authenticator-app.md) |

##App Proxy: Enable SSO and Remote Access to On-Premises Applications

If you have applications in your private network that need to be accessed by users and devices outside the network, then you can use Azure AD Application Proxy to enable secure, remote access to those apps.

| Article Guide |   |
| :---: | --- |
| Overview of Azure AD Application Proxy and how it works | [Providing secure remote access to on-premises applications](active-directory-application-proxy-get-started.md)<br /><br />[How does Azure AD App Proxy Work?](active-directory-appssoaccess-enable-hybrid-access.md) |
| Tutorials on how to configure Application Proxy and how to publish your first app | [How to Set Up Azure AD App Proxy](active-directory-application-proxy-enable.md)<br /><br />[How to Silently Install the App Proxy Connector](active-directory-application-proxy-silent-installation.md)<br /><br />[How to Publish Applications using App Proxy](active-directory-application-proxy-publish.md)<br /><br />[How to Use your own Domain Name](active-directory-application-proxy-custom-domains.md) |
| How to enable single sign-on and conditional access for apps published with App Proxy | [Single-sign-on with Application Proxy](active-directory-application-proxy-sso-using-kcd.md)<br /><br />[Conditional Access and Application Proxy](active-directory-application-proxy-conditional-access.md) |
| Guidance on how to use Application Proxy for the following scenarios | [How to Support Native Client Applications](active-directory-application-proxy-native-client.md)<br /><br />[How to Support Claims-Aware Applications](active-directory-application-proxy-claims-aware-apps.md)<br /><br />[How to Support Applications Published on Separate Networks and Locations](active-directory-application-proxy-connectors.md) |
| Troubleshooting guide for Application Proxy | [App Proxy Troubleshooting Guide](active-directory-application-proxy-troubleshoot.md) |

You may also be interested in [Azure AD Domain Services](active-directory-ds-overview.md), which allows you to migrate your on-premises applications to Azure while still satisfying the identity needs of those applications.

##Building Applications that Integrate with Azure AD

If your organization is developing or maintaining line-of-business (LoB) applications, or if you're an app developer with customers who use Azure Active Directory, the following tutorials will help you integrate your applications with Azure AD. 

| Article Guide |   |
| :---: | --- |
| Guidance for both IT professionals and application developers on integrating apps with Azure AD | [The IT Pro's Guide for Developing Applications for Azure AD](active-directory-applications-guiding-developers-for-lob-applications.md)<br /><br />[The Developer's Guide for Azure Active Directory](active-directory-developers-guide.md) |
| How to application vendors can add their apps to the Azure AD App Gallery | [Listing your Application in the Azure Active Directory Application Gallery](active-directory-app-gallery-listing) |
| How to manage access to developed applications using Azure Active Directory | [How to Enable User Assignment for Developed Applications](active-directory-applications-guiding-developers-requiring-user-assignment.md)<br /><br />[Assigning Users to your App](active-directory-applications-guiding-developers-assigning-users.md)<br /><br />[Assigning Group to your App](active-directory-applications-guiding-developers-assigning-groups.md) |

If you're developing consumer-facing applications, you may be interested in using [Azure Active Directory B2C](https://azure.microsoft.com/services/active-directory-b2c/) so that you don't have to develop your own identity system to manage your users. [Learn more](../active-directory-b2c/active-directory-b2c-overview.md).

##Automatically Provision and Deprovision User Accounts in SaaS Apps

Automate the creation, maintenance, and removal of user identities in SaaS applications such as Dropbox, Salesforce, ServiceNow, and more. Match and sync existing identities between Azure AD and your SaaS apps, and control access by automatically disabling accounts when users leave the organization.

| Article Guide |   |
| :---: | --- |
| Learn about how it works and find answers to common questions | [Automate User Provisioning/Deprovisioning to SaaS Apps](active-directory-saas-app-provisioning.md) |
| Configure how information is mapped between Azure AD and your SaaS app | [Customizing Attribute Mappings](active-directory-saas-customizing-attribute-mappings.md)<br><br>[Writing Expressions for Attribute Mappings](active-directory-saas-writing-expressions-for-attribute-mappings.md) |
| How to enable automated provisioning to any app that supports the SCIM protocol | [Set up Automated User Provisioning to any SCIM-Enabled App](active-directory-scim-provisioning.md) |
| Get notified of provisioning failures | [Provisioning Notifications](active-directory-saas-account-provisioning-notifications.md) |
| Limit who gets provisioned to an application based on their attribute values | [Scoping Filters](active-directory-saas-scoping-filters.md) |


##How to Manage who has Access to which Apps

To help you manage who should have access to which resources, Azure Active Directory allows you to set assignments and permissions at scale using groups. IT departments can also delegate the configuration of these permissions to other people in the organization, such as managers or team admins. IT may choose to enable self-service access so that users can simply request permission when they need it.

| Article Guide |   |
| :---: | --- |
| An overview of Azure AD's access management features | [Introduction to Managing Access to Apps](active-directory-managing-access-to-apps.md)<br /><br />[How Access Management Works in Azure AD](active-directory-manage-groups.md)<br /><br />[How to Use Groups to Manage Access to SaaS Applications](active-directory-accessmanagement-group-saasapps.md) |
| Delegate management of apps and groups, and enable self-service management | [Self-Service and Delegated Application Management](active-directory-self-service-application-access.md)<br /><br />[Self-Service and Delegated Group Management](active-directory-accessmanagement-self-service-group-management.md) |
| Instructions for setting up your groups in Azure AD | [How to Create Security Groups](active-directory-accessmanagement-manage-groups.md)<br /><br />[How to Designate Owners for a Group](active-directory-accessmanagement-managing-group-owners.md)<br /><br />[How to Use the "All Users" Group](active-directory-accessmanagement-dedicated-groups.md) |
| Automatically populate group membership using attribute-based membership rules | [Dynamic Group Membership: Simple Rules](active-directory-accessmanagement-simplerulegroup.md)<br /><br />[Dynamic Group Membership: Advanced Rules](active-directory-accessmanagement-groups-with-advanced-rules.md)<br /><br />[Troubleshooting Dynamic Group Memberships](active-directory-accessmanagement-troubleshooting.md) |

##B2B: Enable Partner Access to Applications

If your business has partnered with other companies, it's likely that you need to manage partner access to your corporate applications. Azure Active Directory B2B Collaboration provides an easy and secure way to share your apps with partners.

| Article Guide |   |
| :---: | --- |
| An introduction to Azure AD B2B Preview and how to get started | [Simple, Secure, Cloud Partner Integration with Azure AD B2B](active-directory-b2b-what-is-azure-ad-b2b.md)<br /><br />[Azure Active Directory (Azure AD) B2B Collaboration](active-directory-b2b-collaboration-overview.md) |
| A deeper dive into Azure AD B2B Preview and how to use it | [Azure AD B2B Preview: How it works](active-directory-b2b-how-it-works.md)<br /><br />[Current Limitations of Azure AD B2B Preview](active-directory-b2b-current-preview-limitations.md)<br /><br />[Detailed walkthrough of using Azure AD B2B Preview](active-directory-b2b-detailed-walkthrough.md) |
| Reference articles with technical details on how Azure AD B2B Preview works | [CSV File Format for Adding Partner Users](active-directory-b2b-references-csv-file-format.md)<br /><br />[User Attributes Affected by Azure AD B2B Preview](active-directory-b2b-references-external-user-object-attribute-changes.md)<br /><br />[User Token Format for Partner Users](active-directory-b2b-references-external-user-token-format.md) |

##Access Panel: A Portal for Accessing Apps and Self-Service Features

The Azure AD Access Panel is where end-users can launch their apps, access self-service features, and perform delegated app/group-management responsibilities. In addition to Access Panel, other options for accessing SSO-enabled apps include: simply launching the apps directly, using the Office 365 App Launcher, using the Intune Managed Browser mobile app, or using app-specific deep links provided by Azure AD. 

| Article Guide |   |
| :---: | --- |
| A comparison of the different options available for deploying single sign-on apps to users | [Deploying Azure AD Integrated Applications to Users](active-directory-appssoaccess-whatis/#deploying-azure-ad-integrated-applications-to-users) |
| An overview of the Access Panel and its mobile equivalent MyApps | [Introduction to Access Panel and MyApps](active-directory-saas-access-panel-introduction.md)<br />— [iOS](https://itunes.apple.com/us/app/my-apps-azure-active-directory/id824048653?mt=8)<br />— [Android](https://play.google.com/store/apps/details?id=com.microsoft.myapps) |
| How to access Azure AD apps from the Office 365 website | [Using the Office 365 App Launcher](https://support.office.com/en-us/article/Meet-the-Office-365-app-launcher-79f12104-6fed-442f-96a0-eb089a3f476a) |
| How to access Azure AD apps from the Intune Managed Browser mobile app | [Intune Managed Browser](https://technet.microsoft.com/en-us/library/dn878029.aspx)<br />— [iOS](https://itunes.apple.com/us/app/microsoft-intune-managed-browser/id943264951?mt=8)<br />— [Android](https://play.google.com/store/apps/details?id=com.microsoft.intune.mam.managedbrowser) |
| How to access Azure AD apps using deep links to initiate single sign-on | [Getting Direct Sign-On Links to Your Apps](active-directory-appssoaccess-whatis.md#direct-sign-on-links-for-federated-password-based-or-existing-apps) |

##Reports: Easily Monitor App Sign-Ins and Audit Changes in App Access

Azure Active Directory provides several reports and alerts to help you monitor your organization's access to applications. You can receive alerts for anomalous sign-ins to your apps, and you can track when and why a users' access to an application has changed.

| Article Guide |   |
| :---: | --- |
| An overview of the reporting features in Azure Active Directory | [Getting Started with Azure AD Reporting](active-directory-reporting-getting-started.md) |
| How to monitor the sign-ins and app-usage of your users | [View Your Access and Usage Reports](active-directory-view-access-usage-reports.md)<br /><br />[Azure Active Directory All User Sign In Activity Report](active-directory-reporting-all-user-sign-in-activity-report.md) |
| Track changes made to who can access a particular application | [Azure Active Directory Audit Report Events](active-directory-reporting-audit-events.md) |
| Export the data of these reports to your preferred tools using the Reporting API | [Getting Started with the Azure AD Reporting API](active-directory-reporting-api-getting-started.md) |

##See Also

[What is Azure Active Directory?](active-directory-whatis.md)

[Azure Active Directory B2C](https://azure.microsoft.com/services/active-directory-b2c/)

[Azure Active Directory Domain Services](https://azure.microsoft.com/services/active-directory-ds/)

[Azure Multi-Factor Authentication](https://azure.microsoft.com/services/multi-factor-authentication/)
