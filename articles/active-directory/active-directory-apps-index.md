<properties
	pageTitle="Article Index for Application Management in Azure Active Directory | Microsoft Azure"
	description="Learn how to customize the expiration date for your federation certificates, and how to renew certificates that will soon expire."
	services="active-directory"
	documentationCenter=""
	authors="MarkusVi"
	manager="femila"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/20/2016"
	ms.author="markvi;liviodlc"/>

#Article Index for Application Management in Azure Active Directory

This page provides a comprehensive list of every document written about the various application-related features in Azure Active Directory (Azure AD).

There is a brief introduction to each major feature area, as well as guidance on which articles to read depending on what information you're looking for. 

##Overview Articles

The articles below are good starting points for those who simply want a brief explanation of Azure AD application management features.

| Article Guide |   |
| :---: | --- |
| An introduction to the application management problems that Azure AD solves | [Managing Applications with Azure Active Directory (AD)](active-directory-enable-sso-scenario.md) |
| An overview of the various features in Azure AD related to enabling single sign-on, defining who has access to apps, and how users launch apps | [Application Access and Single Sign-on in Azure Active Directory](active-directory-appssoaccess-whatis.md) |
| A look at the different steps involved when integrating apps into your Azure AD | [Integrating Azure Active Directory with Applications](active-directory-integrating-applications-getting-started.md)<br /><br />[Enabling Single Sign-On to SaaS Apps](active-directory-sso-integrate-saas-apps.md)<br /><br />[Managing Access to Apps](active-directory-managing-access-to-apps.md) |
| A technical explanation of how apps are represented in Azure AD | [How and Why Applications are Added to Azure AD](active-directory-how-applications-are-added.md) |

##Troubleshooting Articles

This section provides quick access to relevant troubleshooting guides. More information about each feature area can be found on the rest of this page.

| Feature Area |   |
| :---: | --- |
| Federated Single Sign-On | [Troubleshooting SAML-Based Single Sign-On](active-directory-saml-debugging.md) |
| Password-Based Single Sign-On | [Troubleshooting the Access Panel Extension for Internet Explorer](active-directory-saas-ie-troubleshooting.md) |
| Application Proxy | [App Proxy Troubleshooting Guide](active-directory-application-proxy-troubleshoot.md) |
| Single sign-on between on-prem AD and Azure AD | [Troubleshooting Password Synchronization](active-directory-aadconnectsync-implement-password-synchronization.md#troubleshooting-password-synchronization)<br /><br />[Troubleshooting Password Writeback](active-directory-passwords-troubleshoot.md#troubleshoot-password-writeback) | 
| Dynamic Group Memberships | [Troubleshooting Dynamic Group Memberships](active-directory-accessmanagement-troubleshooting.md) |

##Single Sign-On (SSO)

###Federated Single Sign-On: Sign into many apps using one identity

Single sign-on allows users to access a variety of apps and services using only one set of credentials. Federation is one method through which you can enable single sign-on. When users attempt to sign into federated apps, they will get redirected to their organization's official sign-in page rendered by Azure Active Directory, and are then redirected back to the app upon successful authentication.

| Article Guide |   |
| :---: | --- |
| An introduction to federation and other types of sign-on | [Single Sign-On with Azure AD](active-directory-appssoaccess-whatis.md) |
| Thousands of SaaS apps that are pre-integrated with Azure AD with simplified single sign-on configuration steps | [Getting started with the Azure AD application gallery](active-directory-appssoaccess-whatis.md#get-started-with-the-azure-ad-application-gallery)<br /><br />[Full List of Pre-Integrated Apps that Support Federation](http://aka.ms/aadfederatedapps)<br /><br />[How to Add Your App to the Azure AD App Gallery](active-directory-app-gallery-listing.md) |
| More than 150 app tutorials on how to configure single sign-on for apps such as [Salesforce](active-directory-saas-salesforce-tutorial.md), [ServiceNow](active-directory-saas-servicenow-tutorial.md), [Google Apps](active-directory-saas-google-apps-tutorial.md), [Workday](active-directory-saas-workday-tutorial.md), and many more | [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md) |
| How to manually set up and customize your single sign-on configuration | [How to Configure Federated Single Sign-On to Apps that are not in the Azure Active Directory Application Gallery](active-directory-saas-custom-apps.md)<br /><br />[How to Customize Claims Issued in the SAML Token for Pre-Integrated Apps](active-directory-saml-claims-customization.md) |
| Troubleshooting guide for federated apps that use the SAML protocol | [Troubleshooting SAML-Based Single Sign-On](active-directory-saml-debugging.md) |
| How to configure your app's certificate's expiration date, and how to renew your certificates | [Managing Certificates for Federated Single Sign-On in Azure Active Directory](active-directory-sso-certs.md) |

Federated single sign-on is available for all editions of Azure AD for up to ten apps per user. [Azure AD Premium](https://azure.microsoft.com/pricing/details/active-directory/) supports unlimited applications. If your organization has [Azure AD Basic](https://azure.microsoft.com/pricing/details/active-directory/) or [Azure AD Premium](https://azure.microsoft.com/pricing/details/active-directory/), then you can [use groups to assign access to federated applications](#managing-access-to-applications).

###Password-Based Single Sign-On: Account sharing and SSO for non-federated apps

To enable single sign-on to applications that don't support federation, Azure AD offers password management features that can securely store passwords to SaaS apps and automatically sign users into those apps. You can easily distribute credentials for newly created accounts and share team accounts with multiple people. Users don't necessarily need to know the credentials to the accounts that they're given access to.

| Article Guide |   |
| :---: | --- |
| An introduction to how password-based SSO works and a brief technical overview | [Password-Based Single Sign-On with Azure AD](active-directory-appssoaccess-whatis.md#password-based-single-sign-on) |
| A summary of the scenarios related to account sharing and how these problems are solved by Azure AD | [Sharing accounts with Azure AD](active-directory-sharing-accounts.md) |
| Automatically change the password for certain apps at a regular interval | [Automated Password Rollover (preview)](http://blogs.technet.com/b/ad/archive/2015/02/20/azure-ad-automated-password-roll-over-for-facebook-twitter-and-linkedin-now-in-preview.aspx0) |
| Deployment and troubleshooting guides for the Internet Explorer version of the Azure AD password management extension | [How to Deploy the Access Panel Extension for Internet Explorer using Group Policy](active-directory-saas-ie-group-policy.md)<br /><br />[Troubleshooting the Access Panel Extension for Internet Explorer](active-directory-saas-ie-troubleshooting.md) |

Password-based single sign-on is available for all editions of Azure AD for up to ten apps per user. [Azure AD Premium](https://azure.microsoft.com/pricing/details/active-directory/) supports unlimited applications. If your organization has [Azure AD Basic](https://azure.microsoft.com/pricing/details/active-directory/) or [Azure AD Premium](https://azure.microsoft.com/pricing/details/active-directory/), then you can [use groups to assign access to applications](#managing-access-to-applications). Automated password rollover is an [Azure AD Premium](https://azure.microsoft.com/pricing/details/active-directory/) feature.

###App Proxy: Single sign-on and remote access to on-premises applications

If you have applications in your private network that need to be accessed by users and devices outside the network, then you can use Azure AD Application Proxy to enable secure, remote access to those apps.

| Article Guide |   |
| :---: | --- |
| Overview of Azure AD Application Proxy and how it works | [Providing secure remote access to on-premises applications](active-directory-application-proxy-get-started.md) |
| Tutorials on how to configure Application Proxy and how to publish your first app | [How to Set Up Azure AD App Proxy](active-directory-application-proxy-enable.md)<br /><br />[How to Silently Install the App Proxy Connector](active-directory-application-proxy-silent-installation.md)<br /><br />[How to Publish Applications using App Proxy](active-directory-application-proxy-publish.md)<br /><br />[How to Use your own Domain Name](active-directory-application-proxy-custom-domains.md) |
| How to enable single sign-on and conditional access for apps published with App Proxy | [Single-sign-on with Application Proxy](active-directory-application-proxy-sso-using-kcd.md)<br /><br />[Conditional Access and Application Proxy](active-directory-application-proxy-conditional-access.md) |
| Guidance on how to use Application Proxy for the following scenarios | [How to Support Native Client Applications](active-directory-application-proxy-native-client.md)<br /><br />[How to Support Claims-Aware Applications](active-directory-application-proxy-claims-aware-apps.md)<br /><br />[How to Support Applications Published on Separate Networks and Locations](active-directory-application-proxy-connectors.md) |
| Troubleshooting guide for Application Proxy | [App Proxy Troubleshooting Guide](active-directory-application-proxy-troubleshoot.md) |

Application Proxy is available for all editions of Azure AD for up to ten apps per user. [Azure AD Premium](https://azure.microsoft.com/pricing/details/active-directory/) supports unlimited applications. If your organization has [Azure AD Basic](https://azure.microsoft.com/pricing/details/active-directory/) or [Azure AD Premium](https://azure.microsoft.com/pricing/details/active-directory/), then you can [use groups to assign access to applications](#managing-access-to-applications).

You may also be interested in [Azure AD Domain Services](../active-directory-domain-services/active-directory-ds-overview.md), which allows you to migrate your on-premises applications to Azure while still satisfying the identity needs of those applications.

###Enabling single sign-on between Azure AD and on-premises AD

If your organization maintains a Windows Server Active Directory on premises along with your Azure Active Directory in the cloud, then you will likely want to enable single sign-on between these two systems. Azure AD Connect (the tool that integrates these two systems together) provides multiple options for setting up single sign-on: establish federation with ADFS or another federation provider, or enable password synchronization.

| Article Guide |   |
| :---: | --- |
| An overview on the single sign-on options offered in Azure AD Connect, as well as information on managing hybrid environments | [User Sign On Options in Azure AD Connect](active-directory-aadconnect-user-signin.md) |
| General guidance for managing environments with both on-premises Active Directory and Azure Active Directory | [Azure AD Hybrid Identity Design Considerations](active-directory-hybrid-identity-design-considerations-overview.md)<br /><br />[Integrating your On-Premises Identities with Azure Active Directory](active-directory-aadconnect.md) |
| Guidance on using Password Sync to enable SSO | [Implement Password Synchronization with Azure AD Connect](active-directory-aadconnectsync-implement-password-synchronization.md)<br /><br />[Troubleshoot Password Synchronization](https://support.microsoft.com/en-us/kb/2855271) |
| Guidance on using Password Writeback to enable SSO | [Getting Started with Password Management in Azure AD](active-directory-passwords-getting-started.md)<br /><br />[Troubleshoot Password Writeback](active-directory-passwords-troubleshoot.md#troubleshoot-password-writeback) |
| Guidance on using third party identity providers to enable SSO | [List of Compatible Third-Party Identity Providers That Can Be Used to Enable Single Sign-On](https://aka.ms/ssoproviders) | 
| How Windows 10 users can enjoy the benefits of single sign-on via Azure AD Join | [Extending Cloud Capabilities to Windows 10 Devices through Azure Active Directory Join](active-directory-azureadjoin-overview.md) |

Azure AD Connect is available for [all editions of Azure Active Directory](https://azure.microsoft.com/pricing/details/active-directory/). Azure AD Self-Service Password Reset is available for [Azure AD Basic](https://azure.microsoft.com/pricing/details/active-directory/) and [Azure AD Premium](https://azure.microsoft.com/pricing/details/active-directory/). Password Writeback to on-prem AD is an [Azure AD Premium](https://azure.microsoft.com/pricing/details/active-directory/) feature. 

###Conditional Access: Enforce additional security requirements for high-risk apps

Once you set up single sign-on to your apps and resources, you can then further secure sensitive applications by enforcing specific security requirements on every sign-in to that app. For instance, you can use Azure AD to demand that all access to a particular app always require multi-factor authentication, regardless of whether or not that app innately supports that functionality. Another common example of conditional access is to require that users be connected to the organization's trusted network in order to access a particularly sensitive application.

| Article Guide |   |
| :---: | --- |
| An introduction to the conditional access capabilities offered across Azure AD, Office365, and Intune | [Managing Risk With Conditional Access](active-directory-conditional-access.md) |
| How to enable conditional access for the following types of resources | [Conditional Access for SaaS Apps](active-directory-conditional-access-azuread-connected-apps.md)<br /><br />[Conditional Access for Office 365 services](active-directory-conditional-access-device-policies.md)<br /><br />[Conditional Access for On-Premises Applications](active-directory-conditional-access-on-premises-setup.md)<br /><br />[Conditional Access for On-Premises Applications Published via Azure AD App Proxy](active-directory-application-proxy-conditional-access.md) |
| How to register devices with Azure Active Directory in order to enable device-based conditional access policies | [Overview of Azure Active Directory Device Registration](active-directory-conditional-access-device-registration-overview.md)<br /><br />[How to Enable Automatic Device Registration for Domain Joined Windows Devices](active-directory-conditional-access-automatic-device-registration.md)<br />— [Steps for Windows 8.1 devices](active-directory-conditional-access-automatic-device-registration-windows-8-1.md)<br />— [Steps for Windows 7 devices](active-directory-conditional-access-automatic-device-registration-windows7.md) |
| How to use the Android version of the Azure Authenticator app for policies involving multi-factor authentication | [Azure Authenticator for Android](active-directory-conditional-access-azure-authenticator-app.md) |

Conditional Access is an [Azure AD Premium](https://azure.microsoft.com/pricing/details/active-directory/) feature.


##Apps & Azure AD

###Cloud App Discovery: Find which SaaS apps are being used in your organization

Cloud App Discovery helps IT departments learn which SaaS apps are being used throughout the organization. It can measure app usage and popularity so that IT can determine which apps will benefit the most from being brought under IT control and being integrated with Azure AD.

| Article Guide |   |
| :---: | --- |
| A general overview of how it works | [Finding unsanctioned cloud applications with Cloud App Discovery](active-directory-cloudappdiscovery-whatis.md) |
| A deeper dive into how it works, with answers to questions on privacy | [Security and Privacy Considerations](active-directory-cloudappdiscovery-security-and-privacy-considerations.md) |
| Frequently Asked Questions | [FAQ for Cloud App Discovery](http://social.technet.microsoft.com/wiki/contents/articles/24037.cloud-app-discovery-frequently-asked-questions.aspx) |
| Tutorials for deploying Cloud App Discovery | [Group Policy Deployment Guide](http://social.technet.microsoft.com/wiki/contents/articles/30965.cloud-app-discovery-group-policy-deployment-guide.aspx)<br /><br />[System Center Deployment Guide](http://social.technet.microsoft.com/wiki/contents/articles/30968.cloud-app-discovery-system-center-deployment-guide.aspx)<br /><br />[Installing on Proxy Servers with Custom Ports](active-directory-cloudappdiscovery-registry-settings-for-proxy-services.md) |
| The change log for updates to the Cloud App Discovery agent | [Change log](http://social.technet.microsoft.com/wiki/contents/articles/24616.cloud-app-discovery-agent-changelog.aspx) |

Cloud App Discovery is an [Azure AD Premium](https://azure.microsoft.com/pricing/details/active-directory/) feature.

###Automatically provision and deprovision user accounts in SaaS apps

Automate the creation, maintenance, and removal of user identities in SaaS applications such as Dropbox, Salesforce, ServiceNow, and more. Match and sync existing identities between Azure AD and your SaaS apps, and control access by automatically disabling accounts when users leave the organization.

| Article Guide |   |
| :---: | --- |
| Learn about how it works and find answers to common questions | [Automate User Provisioning & Deprovisioning to SaaS Apps](active-directory-saas-app-provisioning.md) |
| Configure how information is mapped between Azure AD and your SaaS app | [Customizing Attribute Mappings](active-directory-saas-customizing-attribute-mappings.md)<br><br>[Writing Expressions for Attribute Mappings](active-directory-saas-writing-expressions-for-attribute-mappings.md) |
| How to enable automated provisioning to any app that supports the SCIM protocol | [Set up Automated User Provisioning to any SCIM-Enabled App](active-directory-scim-provisioning.md) |
| Get notified of provisioning failures | [Provisioning Notifications](active-directory-saas-account-provisioning-notifications.md) |
| Limit who gets provisioned to an application based on their attribute values | [Scoping Filters](active-directory-saas-scoping-filters.md) |

Automated user provisioning is available for all editions of Azure AD for up to ten apps per user. [Azure AD Premium](https://azure.microsoft.com/pricing/details/active-directory/) supports unlimited applications. If your organization has [Azure AD Basic](https://azure.microsoft.com/pricing/details/active-directory/) or [Azure AD Premium](https://azure.microsoft.com/pricing/details/active-directory/), then you can [use groups to manage which users get provisioned](#managing-access-to-applications).

###Building applications that integrate with Azure AD

If your organization is developing or maintaining line-of-business (LoB) applications, or if you're an app developer with customers who use Azure Active Directory, the following tutorials will help you integrate your applications with Azure AD. 

| Article Guide |   |
| :---: | --- |
| Guidance for both IT professionals and application developers on integrating apps with Azure AD | [The IT Pro's Guide for Developing Applications for Azure AD](active-directory-applications-guiding-developers-for-lob-applications.md)<br /><br />[The Developer's Guide for Azure Active Directory](active-directory-developers-guide.md) |
| How to application vendors can add their apps to the Azure AD App Gallery | [Listing your Application in the Azure Active Directory Application Gallery](active-directory-app-gallery-listing) |
| How to manage access to developed applications using Azure Active Directory | [How to Enable User Assignment for Developed Applications](active-directory-applications-guiding-developers-requiring-user-assignment.md)<br /><br />[Assigning Users to your App](active-directory-applications-guiding-developers-assigning-users.md)<br /><br />[Assigning Group to your App](active-directory-applications-guiding-developers-assigning-groups.md) |

If you're developing consumer-facing applications, you may be interested in using [Azure Active Directory B2C](https://azure.microsoft.com/services/active-directory-b2c/) so that you don't have to develop your own identity system to manage your users. [Learn more](../active-directory-b2c/active-directory-b2c-overview.md).


##Managing Access to Applications

###Using groups and self-service to manage who has access to which apps

To help you manage who should have access to which resources, Azure Active Directory allows you to set assignments and permissions at scale using groups. IT may choose to enable self-service features so that users can simply request permission when they need it.

| Article Guide |   |
| :---: | --- |
| An overview of Azure AD access management features | [Introduction to Managing Access to Apps](active-directory-managing-access-to-apps.md)<br /><br />[How Access Management Works in Azure AD](active-directory-manage-groups.md)<br /><br />[How to Use Groups to Manage Access to SaaS Applications](active-directory-accessmanagement-group-saasapps.md) |
| Enable self-service management of apps and groups | [Self-Service Application Management](active-directory-self-service-application-access.md)<br /><br />[Self-Service Group Management](active-directory-accessmanagement-self-service-group-management.md) |
| Instructions for setting up your groups in Azure AD | [How to Create Security Groups](active-directory-accessmanagement-manage-groups.md)<br /><br />[How to Designate Owners for a Group](active-directory-accessmanagement-managing-group-owners.md)<br /><br />[How to Use the "All Users" Group](active-directory-accessmanagement-dedicated-groups.md) |
| Use dynamic groups to automatically populate group membership using attribute-based membership rules | [Dynamic Group Membership: Advanced Rules](active-directory-accessmanagement-groups-with-advanced-rules.md)<br /><br />[Troubleshooting Dynamic Group Memberships](active-directory-accessmanagement-troubleshooting.md) |

Group-based application access management is available for [Azure AD Basic](https://azure.microsoft.com/pricing/details/active-directory/) and [Azure AD Premium](https://azure.microsoft.com/pricing/details/active-directory/). Self-service group management, self-service application management, and dynamic groups are [Azure AD Premium](https://azure.microsoft.com/pricing/details/active-directory/) features.

###B2B Collaboration: Enable partner access to applications

If your business has partnered with other companies, it's likely that you need to manage partner access to your corporate applications. Azure Active Directory B2B Collaboration provides an easy and secure way to share your apps with partners. This feature is currently in preview.

| Article Guide |   |
| :---: | --- |
| An overview of different Azure AD features that can help you manage external users such as partners, customers, etc. | [Comparing Capabilities for Managing External Identities in Azure AD](active-directory-b2b-compare-external-identities.md) |
| An introduction to B2B Collaboration preview and how to get started | [Simple, Secure, Cloud Partner Integration with Azure AD](active-directory-b2b-what-is-azure-ad-b2b.md)<br /><br />[Azure Active Directory B2B Collaboration](active-directory-b2b-collaboration-overview.md) |
| A deeper dive into Azure AD B2B Collaboration and how to use it | [B2B Collaboration: How it works](active-directory-b2b-how-it-works.md)<br /><br />[Current Limitations of Azure AD B2B Collaboration Preview](active-directory-b2b-current-preview-limitations.md)<br /><br />[Detailed walkthrough of using Azure AD B2B Collaboration Preview](active-directory-b2b-detailed-walkthrough.md) |
| Reference articles with technical details on how Azure AD B2B Collaboration works | [CSV File Format for Adding Partner Users](active-directory-b2b-references-csv-file-format.md)<br /><br />[User Attributes Affected by Azure AD B2B Collaboration](active-directory-b2b-references-external-user-object-attribute-changes.md)<br /><br />[User Token Format for Partner Users](active-directory-b2b-references-external-user-token-format.md) |

The B2B Collaboration preview is currently available for [all editions of Azure Active Directory](https://azure.microsoft.com/pricing/details/active-directory/).

###Access Panel: A portal for accessing apps and self-service features

The Azure AD Access Panel is where end-users can launch their apps and access the self-service features that allow them to manage their apps and group memberships. In addition to the Access Panel, other options for accessing SSO-enabled apps are included in the list below. 

| Article Guide |   |
| :---: | --- |
| A comparison of the different options available for deploying single sign-on apps to users | [Deploying Azure AD Integrated Applications to Users](active-directory-appssoaccess-whatis.md#deploying-azure-ad-integrated-applications-to-users) |
| An overview of the Access Panel and its mobile equivalent MyApps | [Introduction to Access Panel and MyApps](active-directory-saas-access-panel-introduction.md)<br />— [iOS](https://itunes.apple.com/us/app/my-apps-azure-active-directory/id824048653?mt=8)<br />— [Android](https://play.google.com/store/apps/details?id=com.microsoft.myapps) |
| How to access Azure AD apps from the Office 365 website | [Using the Office 365 App Launcher](https://support.office.com/en-us/article/Meet-the-Office-365-app-launcher-79f12104-6fed-442f-96a0-eb089a3f476a) |
| How to access Azure AD apps from the Intune Managed Browser mobile app | [Intune Managed Browser](https://technet.microsoft.com/en-us/library/dn878029.aspx)<br />— [iOS](https://itunes.apple.com/us/app/microsoft-intune-managed-browser/id943264951?mt=8)<br />— [Android](https://play.google.com/store/apps/details?id=com.microsoft.intune.mam.managedbrowser) |
| How to access Azure AD apps using deep links to initiate single sign-on | [Getting Direct Sign-On Links to Your Apps](active-directory-appssoaccess-whatis.md#direct-sign-on-links-for-federated-password-based-or-existing-apps) |

Access Panel is available for [all editions of Azure Active Directory](https://azure.microsoft.com/pricing/details/active-directory/).

###Reports: Easily audit app access changes and monitor sign-ins to apps

Azure Active Directory provides several reports and alerts to help you monitor your organization's access to applications. You can receive alerts for anomalous sign-ins to your apps, and you can track when and why a users' access to an application has changed.

| Article Guide |   |
| :---: | --- |
| An overview of the reporting features in Azure Active Directory | [Getting Started with Azure AD Reporting](active-directory-reporting-getting-started.md) |
| How to monitor the sign-ins and app-usage of your users | [View Your Access and Usage Reports](active-directory-view-access-usage-reports.md) |
| Track changes made to who can access a particular application | [Azure Active Directory Audit Report Events](active-directory-reporting-audit-events.md) |
| Export the data of these reports to your preferred tools using the Reporting API | [Getting Started with the Azure AD Reporting API](active-directory-reporting-api-getting-started.md) |

To see which reports are included with different editions of Azure Active Directory, [click here](active-directory-view-access-usage-reports.md#report-editions).

##See also

[What is Azure Active Directory?](active-directory-whatis.md)

[Azure Active Directory B2C](https://azure.microsoft.com/services/active-directory-b2c/)

[Azure Active Directory Domain Services](https://azure.microsoft.com/services/active-directory-ds/)

[Azure Multi-Factor Authentication](https://azure.microsoft.com/services/multi-factor-authentication/)
