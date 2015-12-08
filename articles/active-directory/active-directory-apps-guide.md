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
	ms.date="12/02/2015"
	ms.author="liviodlc"/>

#SaaS App Management Guide for Azure Active Directory

This guide is intended to help IT professionals understand and use the various SaaS app-related features available in Azure Active Directory (Azure AD). This page serves as a hub for the various sections of the guide, and it offers a brief introduction to each major feature.

##Overview

[Managing Applications with Azure Active Directory (AD)](active-directory-enable-sso-scenario.md)

[Integrating Azure Active Directory with applications getting started guide](active-directory-integrating-applications-getting-started.md)

[Integrate Azure Active Directory (Azure AD) single sign-on with SaaS apps](active-directory-sso-integrate-saas-apps.md)

[Managing access to apps](active-directory-managing-access-to-apps.md)

[How and why applications are added to Azure AD](active-directory-how-applications-are-added.md) | dunno which category this fits into

##Cloud App Discovery: Find which SaaS Apps are being Used in Your Organization

[Finding unsanctioned cloud applications with Cloud App Discovery](active-directory-cloudappdiscovery-whatis.md)

[Cloud App Discovery Security and Privacy Considerations](active-directory-cloudappdiscovery-security-and-privacy-considerations.md)

[Cloud App Discovery Registry Settings for Proxy Services](active-directory-cloudappdiscovery-registry-settings-for-proxy-services.md)

##Federated Single Sign-On (SSO): Sign Into Apps Using Azure AD Accounts

[What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md) | #mess

[Integrate Azure Active Directory (Azure AD) single sign-on with SaaS apps](active-directory-sso-integrate-saas-apps.md) | overview?

[Configuring single sign-on to applications that are not in the Azure Active Directory application gallery](active-directory-saas-custom-apps.md)

[List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)

[Customizing claims issued in the SAML token for pre-integrated apps in Azure Active Directory](active-directory-saml-claims-customization.md)

[How to debug SAML-based single sign-on to applications in Azure Active Directory](active-directory-saml-debugging.md)

[Managing Certificates for Federated Single Sign-On in Azure Active Directory](active-directory-sso-certs.md)

##Password-Based Single Sign-On: Account Sharing and SSO for Non-Federated Apps

[Sharing accounts with Azure AD](active-directory-sharing-accounts.md)

[How to Deploy the Access Panel Extension for Internet Explorer using Group Policy](active-directory-saas-ie-group-policy.md)

[Troubleshooting the Access Panel Extension for Internet Explorer](active-directory-saas-ie-troubleshooting.md)

##Conditional Access: Enforce Additional Security Requirements for High-Risk Apps

[Managing Risk With Conditional Access](active-directory-conditional-access.md)

[Automatic device registration with Azure Active Directory for Windows Domain-Joined Devices](active-directory-conditional-access-automatic-device-registration.md)

[Configure automatic device registration for Windows 7 domain joined devices](active-directory-conditional-access-automatic-device-registration-windows7.md)

[Configure automatic device registration for Windows 8.1 domain joined devices](active-directory-conditional-access-automatic-device-registration-windows8_1.md)

[Azure Conditional Access Preview for SaaS Apps](active-directory-conditional-access-azuread-connected-apps.md)

[Azure Authenticator for Android](active-directory-conditional-access-azure-authenticator-app.md)

[Conditional access device policies for Office 365 services](active-directory-conditional-access-device-policies.md)

[Azure Active Directory Device Registration overview](active-directory-conditional-access-device-registration-overview.md)

[Setting up on-premises conditional access using Azure Active Directory Device Registration](active-directory-conditional-access-on-premises-setup.md)

##App Proxy: Enable SSO and Remote Access to On-Premises Applications

[Working with claims aware apps in Application Proxy](active-directory-application-proxy-claims-aware-apps.md)

[Working with conditional access](active-directory-application-proxy-conditional-access.md)

[Publish applications on separate networks and locations using Connector groups](active-directory-application-proxy-connectors.md)

[Working with custom domains in Azure AD Application Proxy](active-directory-application-proxy-custom-domains.md)

[Enabling Azure AD Application Proxy](active-directory-application-proxy-enable.md)

[How to provide secure remote access to on-premises applications](active-directory-application-proxy-get-started.md) | Overview

[How to enable native client apps to interact with proxy Applications](active-directory-application-proxy-native-client.md)

[Publish applications using Azure AD Application Proxy](active-directory-application-proxy-publish.md) | main how to?

[How to silently install the Azure AD Application Proxy Connector](active-directory-application-proxy-silent-installation.md)

[Single-sign-on with Application Proxy](active-directory-application-proxy-sso-using-kcd.md)

[Troubleshoot Application Proxy](active-directory-application-proxy-troubleshoot.md)

[Enabling hybrid access with App Proxy](active-directory-appssoaccess-enable-hybrid-access.md)

[Azure AD Domain Services (Preview)](active-directory-ds-overview.md)

##Building Apps that Integrate with Azure AD

[Azure AD and Applications: Guiding Developers](active-directory-applications-guiding-developers-for-lob-applications.md)

[Azure Active Directory Developer's Guide](active-directory-developers-guide.md)

[Integrating Applications with Azure Active Directory](active-directory-integrating-applications.md)

[Azure AD and Applications: Assigning Groups to an Application](active-directory-applications-guiding-developers-assigning-groups.md)

[Azure AD and Applications: Assigning Users to an Application](active-directory-applications-guiding-developers-assigning-users.md)

[Azure AD and Applications: Requiring User Assignment](active-directory-applications-guiding-developers-requiring-user-assignment.md)

[Azure Active Directory B2C](https://azure.microsoft.com/services/active-directory-b2c/)

[Azure Active Directory B2C preview: Sign up & Sign in Consumers in your Applications](../active-directory-b2c/active-directory-b2c-overview.md)

##Automatically Provision and Deprovision User Accounts in SaaS Apps

**Summary:** Automate the creation, maintenance, and removal of user identities in SaaS applications such as Dropbox, Salesforce, ServiceNow, and more. Match and sync existing identities between Azure AD and your SaaS apps, and control access by automatically disabling accounts when users leave the organization.

**Main Article:** [Automate User Provisioning and Deprovisioning to SaaS Applications with Azure Active Directory](active-directory-saas-app-provisioning.md)

| Article Guide
| :---: | --- |
| Learn about how it works and find answers to common questions | [Automate User Provisioning/Deprovisioning to SaaS Apps](active-directory-saas-app-provisioning.md) |
| Edit how information is synced between Azure AD and your SaaS app | [Customizing Attribute Mappings](active-directory-saas-customizing-attribute-mappings.md)<br><br>[Writing Expressions for Attribute Mappings](active-directory-saas-writing-expressions-for-attribute-mappings.md) |
| How to enable automated provisioning to any app that supports the SCIM protocol | [Set up Automated User Provisioning to any SCIM-Enabled App](active-directory-scim-provisioning.md) |
| Get notified of provisioning failures | [Provisioning Notifications](active-directory-saas-account-provisioning-notifications.md) |
| Limit who gets provisioned to an application based on their attribute values | [Scoping Filters](active-directory-saas-scoping-filters.md) |




##Tools for Managing who has Access to which Apps

[Managing access to resources with Azure Active Directory groups](active-directory-manage-groups.md)

[Dedicated groups in Azure Active Directory](active-directory-accessmanagement-dedicated-groups.md)

[Using a group to manage access to SaaS applications](active-directory-accessmanagement-group-saasapps.md)

[Using attributes to create advanced rules](active-directory-accessmanagement-groups-with-advanced-rules.md)

[Managing security groups in Azure Active Directory](active-directory-accessmanagement-manage-groups.md)

[Managing owners for a group](active-directory-accessmanagement-managing-group-owners.md)

[Setting up Azure Active Directory for self service application access management](active-directory-accessmanagement-self-service-group-management.md)

[Creating a simple rule to configure dynamic memberships for a group](active-directory-accessmanagement-simplerulegroup.md)

[Troubleshooting dynamic memberships to groups](active-directory-accessmanagement-troubleshooting.md)

also make sure to delegated/self-service stuff is included

##B2B: Enable Partner Access to Applications

[Azure Active Directory (Azure AD) B2B collaboration preview: Simple, secure cloud partner integration](active-directory-b2b-what-is-azure-ad-b2b.md)

[Azure Active Directory (Azure AD) B2B collaboration](active-directory-b2b-collaboration-overview.md)

[Current preview limitations for Azure Active Directory (Azure AD) B2B collaboration](active-directory-b2b-current-preview-limitations.md)

[Detailed walkthrough of using the Azure Active Directory (Azure AD) B2B collaboration preview](active-directory-b2b-detailed-walkthrough.md)

[Azure Active Directory (Azure AD) B2B collaboration preview: How it works](active-directory-b2b-how-it-works.md)

[CSV file format for Azure Active Directory (Azure AD) B2B collaboration preview](active-directory-b2b-references-csv-file-format.md)

[External user object attribute changes for Azure Active Directory (Azure AD) B2B collaboration preview](active-directory-b2b-references-external-user-object-attribute-changes.md)

[External user token format for Azure Active Directory (Azure AD) B2B collaboration preview](active-directory-b2b-references-external-user-token-format.md)

##Access Panel: A Portal for Users to Access Apps and More

[Introduction to Access Panel](active-directory-saas-access-panel-introduction.md)

##Reporting (needs better headline)

something about reports related to managing apps, sign ins to apps, security reports

[Getting started with Azure AD Reporting](active-directory-reporting-getting-started.md)

[Getting started with the Azure AD Reporting API](active-directory-reporting-api-getting-started.md)

##See Also

[List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)

[Azure Active Directory Hybrid Identity Design Considerations](active-directory-hybrid-identity-design-considerations-overview)
