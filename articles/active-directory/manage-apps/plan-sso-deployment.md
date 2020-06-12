---
title: Plan an Azure Active Directory single sign-on deployment
description: Guide to help you plan, deploy, and manage SSO in your organization.
services: active-directory
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: conceptual
ms.workload: identity
ms.date: 05/22/2019
ms.author: kenwith
ms.reviewer: jeedes
ms.collection: M365-identity-device-management
ms.custom: has-adal-ref
#customer intent: As an IT admin, I need to learn about single-sign on (SSO) so I can understand the feature and help others in my organization to understand its value.
---

# Plan a single sign-on deployment

Single sign-on (SSO) means accessing all applications and resources a user needs by signing in only once using a single user account. With SSO, users can access all needed applications without being required to authenticate a second time.

## Benefits of SSO

Single sign-on (SSO) adds security and convenience when users sign on to applications in Azure Active Directory (Azure AD). 

Many organizations rely on software as a service (SaaS) applications, such as Office 365, Box, and Salesforce, for end user productivity. Historically, IT staff needed to individually create and update user accounts in each SaaS application, and users needed to remember a password for each.

The Azure Marketplace has over 3000 applications with pre-integrated SSO connections, making it easy to integrate them in your tenant.

## Licensing

- **Azure AD licensing** - SSO for pre-integrated SaaS applications is free. However, the number of objects in your directory and the features you wish to deploy may require additional licenses. For a full list of license requirements, see [Azure Active Directory Pricing](https://azure.microsoft.com/pricing/details/active-directory/).
- **Application licensing** - You'll need the appropriate licenses for your SaaS applications to meet your business needs. Work with the application owner to determine whether the users assigned to the application have the appropriate licenses for their roles within the application. If Azure AD manages the automatic provisioning based on roles, the roles assigned in Azure AD must align with the number of licenses owned within the application. Improper number of licenses owned in the application may lead to errors during the provisioning/updating of a user.

## Plan your SSO team

- **Engage the right stakeholders** - When technology projects fail, it's typically due to mismatched expectations on impact, outcomes, and responsibilities. To avoid these pitfalls, [ensure that you're engaging the right stakeholders](https://aka.ms/deploymentplans) and that stakeholders understand their roles.
- **Plan communications** - Communication is critical to the success of any new service. Proactively communicate to your users about how their experience will change, when it will change, and how to gain support if they experience issues. Review the options for [how end-users will access their SSO enabled applications](end-user-experiences.md), and craft your communications to match your selection. 

## Plan your SSO protocol

An SSO implementation based on federation protocols improves security, reliability, and end user experiences and is easier to implement. Many applications are pre-integrated in Azure AD with [step-by step guides available](../saas-apps/tutorial-list.md). You can find them on our [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/). Detailed information on each SSO method can be found in the article [Single sign-on to applications in Azure Active Directory](what-is-single-sign-on.md).

There are two primary ways in which you can enable your users to single sign-on to your apps:

- **With federated single sign-on** Azure AD authenticates the user to the application by using their Azure AD account. This method is supported for applications that support protocols such as SAML 2.0, WS-Federation, or OpenID Connect, and is the richest mode of single sign-on. We recommend using Federated SSO with Azure AD when an application supports it, instead of password-based SSO and ADFS.

- **With password-based single sign-on** users sign in to the application with a username and password the first time, they access it. After the first sign-on, Azure AD supplies the username and password to the application. Password-based single sign-on enables secure application password storage and replay using a web browser extension or mobile app. This option leverages the existing sign-in process provided by the application, enables an administrator to manage the passwords, and doesn't require the user to know the password.

### Considerations for federation-based SSO

- **Using OpenID Connect and OAuth** - If the application you're connecting to supports it, use the OIDC/OAuth 2.0 method to enable your SSO to that application. This method requires less configuration and enables a richer user experience. For more information, see [OAuth 2.0](../develop/v2-oauth2-auth-code-flow.md), [OpenID Connect 1.0](../develop/v2-protocols-oidc.md), and [Azure Active Directory developer’s guide](https://docs.microsoft.com/azure/active-directory/develop/active-directory-developers-guide).
- **Endpoint Configurations for SAML-based SSO** - If you use SAML, your developers will need specific information prior to configuring the application. For more info, see [Edit the Basic SAML Configuration](configure-single-sign-on-non-gallery-applications.md).
- **Certificate management for SAML-based SSO** - When you enable Federated SSO for your application, Azure AD creates a certificate that is by default valid for three years. You can customize the expiration date for that certificate if needed. Ensure that you have processes in place to renew certificates prior to their expiration. To learn more, see [Azure AD Managing Certificates](https://docs.microsoft.com/azure/active-directory/active-directory-sso-certs).

### Considerations for password-based SSO

Using Azure AD for password-based SSO requires deploying a browser extension that will securely retrieve the credentials and fill out the login forms. Define a mechanism to deploy the extension at scale with [supported browsers](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction). Options include:

- [Group Policy for Internet Explorer](https://azure.microsoft.com/documentation/articles/active-directory-saas-ie-group-policy/)
- [Configuration Manager for Internet Explorer](https://docs.microsoft.com/configmgr/core/clients/deploy/deploy-clients-to-windows-computers)
- [User driven download and configuration for Chrome, Firefox, Microsoft Edge, or IE](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction)

To learn more, see [How to configure password single sign on](https://docs.microsoft.com/azure/active-directory/application-config-sso-how-to-configure-password-sso-non-gallery).

#### Capturing login forms metadata for applications that aren't in the gallery

Microsoft supports capturing metadata on a web application for password vaulting (capturing the username and password fields). Navigate to the login URL during the process of configuring the application to capture the forms metadata. Ask the application owner for the exact login URL. This information is used during the sign-on process, mapping Azure AD credentials to the application during sign-on.

To learn more, see [What is application access and SSO with Azure AD? – Password-based SSO](https://azure.microsoft.com/documentation/articles/active-directory-appssoaccess-whatis/).

#### Indications that metadata in forms needs to be recaptured

When applications change their HTML layout, you might need to recapture the metadata to adjust for the changes. Common symptoms that indicate that the HTML layout has change include:

- Users reporting that clicking on the application gets “stuck” in the login page
- Users reporting that the username or password isn't populated

#### Shared accounts

From the sign-in perspective, applications with shared accounts aren't different from a gallery application that uses password SSO for individual users. However, there are some additional steps required when planning and configuring an application meant to use shared accounts:

1. Work with application business users to document the following:
   1. Set of users in the organization who will use the application
   1. Existing set of credentials in the application associated with the set of users 
1. For each combination of user set and credentials, create a security group in the cloud or on-premises based on your requirements.
1. Reset the shared credentials. Once the app is deployed in Azure AD, individuals don't need the password of the shared account. Since Azure AD will store the password, consider setting it to be very long and complex. 
1. Configure automatic rollover of the password if the application supports it. That way, not even the administrator who did the initial setup will know the password of the shared account. 

## Plan your authentication method

Choosing the correct authentication method is a crucial first decision in setting up an Azure AD hybrid identity solution. Implement the authentication method that is configured by using Azure AD Connect, which also provisions users in the cloud.

To choose an authentication method, you need to consider the time, existing infrastructure, complexity, and cost of implementing your choice. These factors are different for every organization and might change over time. You should choose the one that most closely matches your specific scenario. For more information, see [Choose the right authentication method for your Azure Active Directory hybrid identity solution](https://docs.microsoft.com/azure/security/fundamentals/choose-ad-authn).

## Plan your security and governance 

Identity is the new primary pivot for security attention and investments because network perimeters have become increasingly porous and less effective with the explosion of BYOD devices and cloud applications. 

### Plan access reviews

[Access Reviews](https://docs.microsoft.com/azure/active-directory/governance/create-access-review) enable organizations to efficiently manage group memberships, access to enterprise applications, and role assignments. You should plan to review user access on a regular basis to make sure only the right people have continued access.

Some of the key topics to plan for while setting up access reviews include:

1. Identifying a cadence for access reviews that fits your business need. This can be as frequent as once a week, monthly, annually, or as an on-demand exercise.

1. Create groups that represent the reviewers of the app access reports. You'll need to ensure that stakeholders most familiar with the app and its target users and use cases are participants in your access reviews

1. Completing an access review includes taking away app access permissions to users who no longer need access. Plan for handling potential support requests from denied users. A deleted user will remain deleted in Azure AD for 30 days during which time they can be restored by an administrator if necessary. After 30 days, that user is permanently deleted. Using the Azure Active Directory portal, a Global Administrator can explicitly permanently delete a recently deleted user before that time period is reached.

### Plan auditing

Azure AD provides [reports containing technical and business insights](https://azure.microsoft.com/documentation/articles/active-directory-view-access-usage-reports/). 

Both security and activity reports are available. Security reports show users flagged for risk, and risky sign-ins. Activity reports help you understand the behavior of users in your organization by detailing sign-in activity and providing audit trails of all logins. You can use reports to manage risk, increase productivity, and monitor compliance.

| Report type | Access review | Security reports | Sign-in report |
|-------------|---------------|------------------|----------------|
| Use to review | Application permissions and usage. | Potentially compromised accounts | Who is accessing the applications |
| Potential actions | Audit access; revoke permissions | Revoke access; force security reset | Revoke access |

Azure AD retains most auditing data for 30 days and makes the data available through the Azure admin portal or through an API for you to download into your analysis systems.

### Consider using Microsoft Cloud Application Security

Microsoft Cloud App Security (MCAS) is a Cloud Access Security Broker (CASB) solution. It gives you visibility into your cloud apps and services, provides sophisticated analytics to identify and combat cyberthreats, and enables you to control how your data travels.

Deploying MCAS enables you to:

- Use Cloud Discovery to map and identify your cloud environment and the cloud apps your organization is using.
- Sanctioning and un-sanction apps in your cloud
- Use easy-to-deploy app connectors that take advantage of provider APIs, for visibility and governance of apps that you connect to
- Use Conditional Access App Control protection to get real-time visibility and control over access and activities within your cloud apps
- Helps you have continuous control by setting, and then continually fine-tuning, policies.

Microsoft Cloud Application Security (MCAS) Session control is available for any browser on any major platform on any operating system. Mobile apps and desktop apps can also be blocked or allowed. By natively integrating with Azure AD, any apps that are configured with SAML, or Open ID Connect apps with single sign-on in Azure AD can be supported, including [several featured apps](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad).

For information about MCAS, see the [Microsoft Cloud App Security overview](https://docs.microsoft.com/cloud-app-security/what-is-cloud-app-security). MCAS is a user-based subscription service. You can review licensing details in the [MCAS licensing datasheet](https://query.prod.cms.rt.microsoft.com/cms/api/am/binary/RE2NXYO).

### Use Conditional Access

With Conditional Access, you can automate criteria-based access control decisions for your cloud apps.

Conditional Access policies are enforced after the first-factor authentication has been completed. Therefore, Conditional Access is not intended as a first line defense for scenarios like denial-of-service (DoS) attacks, but can use signals from these events to determine access. For example the sign-in risk level, location of the request, and so on can be used. For more information about Conditional Access, see [the overview](https://docs.microsoft.com/azure/active-directory/conditional-access/plan-conditional-access) and the [deployment plan](https://docs.microsoft.com/azure/active-directory/conditional-access/plan-conditional-access).

## Azure SSO technical requirements

The following section details the requirements to configure your specific application including the necessary environment(s), endpoints, claim mapping, required attributes, certificates, and protocols used. You'll need this information to configure SSO in the [Azure AD portal](https://portal.azure.com/).

### Authentication mechanism details

For all pre-integrated SaaS apps, Microsoft provides a tutorial and you won't need this information. If the application isn't in our application marketplace / gallery, you may need to collect the following pieces of data:

- **Current identity provider the application uses for SSO if applicable** - For example: AD FS, PingFederate, Okta
- **Protocols supported by the target application** - For example, SAML 2.0, OpenID Connect, OAuth, Forms-Based Auth, WS-Fed, WS-Trust
- **Protocol being configured with Azure AD** - For example, SAML 2.0 or 1.1, OpenID Connect, OAuth, Forms-Based, WS-Fed

### Attribute requirements

There's a pre-configured set of attributes and attribute-mappings between Azure AD user objects and each SaaS app’s user objects. Some apps manage other types of objects such as groups. Plan the mapping of user attributes from Azure AD to your application and [customize the default attribute-mappings](https://docs.microsoft.com/azure/active-directory/manage-apps/customize-application-attributes) according to your business needs.

### Certificate requirements

The certificate for the application must be up-to-date, or there's a risk of users not being able to access the application. Most SaaS application certificates are good for 36 months. You change that certificate duration in the application blade. Make sure to document the expiration and know how you will manage your certificate renewal. 

There are two ways to manage your certificates. 

- **Automatic certificate rollover** - Microsoft supports [Signing key rollover in Azure AD](https://docs.microsoft.com/azure/active-directory/develop/active-directory-signing-key-rollover). While this is our preferred method for managing certificates, not all ISV’s supports this scenario.

- **Manually updating** - Every application has its own certificate that expires based on how it's defined. Before the application’s certificate expires, create a new certificate and send it to the ISV. This information can be pulled from the federation metadata. [Read more on federation metadata here.](https://docs.microsoft.com/azure/active-directory/develop/active-directory-federation-metadata)

## Implement SSO

Use the following phases to plan for and deploy your solution in your organization:

### User configuration for SSO

- **Identify your test users**

   Contact to the app owner and ask them to create a minimum of three test users within the application. Ensure the information that you'll use as the primary identifier is populated correctly and matches an attribute that is available in Azure AD. In most cases this will map to the “NameID” for SAML-based applications. For JWT tokens, it's the “preferred_username.”
   
   Create the user in Azure AD either manually as a cloud-based user or sync the user from on-premises using the Azure AD Connect sync engine. Ensure the information matches the claims being sent to the application.

- **Configure SSO**

   From the [list of applications](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list), locate and open the SSO tutorial for your application, then follow the tutorial’s steps on to successfully configure your SaaS application.

   If you can’t locate your application, see [Custom Application documentation](https://docs.microsoft.com/azure/active-directory/application-config-sso-how-to-configure-federated-sso-non-gallery). This will walk you through on how to add an application that is not located in the Azure AD gallery.

   Optionally, you can use claims issued in the SAML token for the enterprise application using [Microsoft’s guidance documentation](https://docs.microsoft.com/azure/active-directory/active-directory-claims-mapping). Ensure this maps to what you expect to receive in the SAML response for your application. If you encounter issues during configuration, use our guidance on [how to Debug SSO integration](https://docs.microsoft.com/azure/active-directory/develop/active-directory-saml-debugging).

Custom application onboarding is an Azure AD Premium P1 or P2 licenses feature.

### Provide SSO change communications to end users

Implement your communication plan. Make sure you're letting your end users know that a change is coming, when it has arrived, what to do now, and how to seek assistance.

### Verify end user scenarios for SSO

You can use the following test cases to conduct tests on corporate-owned and personal devices to ensure your SSO configurations are working as expected. The scenarios below assume that a user is navigating to an application URL and going through an authentication flow initiated by the service provider (SP-initiated auth flow).

| Scenario | Expected result on SP-initiated auth flow by user |
|----------|---------------------------------------------------|
| Login to application with IE while on corpnet. | Integrated Windows Authentication (IWA) occurs with no additional prompts. |
| Login to application with IE while off corpnet with new login attempt. | Forms-based prompt at AD FS Server. User successfully logs in and browser prompts for MFA. |
| Login to application with IE while off corpnet with a current session and has never performed MFA. | User does not receive prompt for first factor. User receives prompt for MFA. |
| Login to application with IE while off corpnet with a current session and has already performed MFA in this session. | User does not receive prompt for first factor. User does not receive MFA. User SSOs into application. |
| Login to application with Chrome/Firefox/Safari while off corpnet with a current session and has already performed MFA in this session. | User does not receive prompt for first factor. User does not receive MFA. User SSO’s into application. |
| Login to into application with Chrome/Firefox/Safari while off corpnet with new login attempt. | Forms-based prompt at AD FS Server. User successfully logs in and browser prompts for MFA. |
| Login to application with Chrome/Firefox while on corporate network with a current session. | User does not receive prompt for first factor. User does not receive MFA. User SSO’s into application. |
| Login to application with application mobile app with a new login attempt. | Forms-based prompt at AD FS Server. User successfully logs in and ADAL client prompts for MFA. |
| Unauthorized user attempts to log into application with login URL. | Forms-based prompt at AD FS Server. User fails to login with first factor. |
| Authorized user attempts to log in but enters an incorrect password. | User navigates to application URL and receives bad username/password error. |
| Authorized user clicks on link in an email and is already authenticated. | User clicks on URL and is signed into the application with no additional prompts. |
| Authorized user clicks on link in an email and is not yet authenticated. | User clicks on URL and is prompt to authenticate with first factor. |
| Authorized User logs into application with application mobile app (SP-initiated) with a new login attempt. | Forms-based prompt at AD FS Server. User successfully logs in and ADAL client prompts for MFA. |
| Unauthorized User attempts to log into application with login URL (SP-initiated). | Forms-based prompt at AD FS Server. User fails to login with first factor. |
| Authorized user attempts to log in but enters an incorrect password.| User navigates to application URL and receives bad username/password error. |
| Authorized user logs out and then logs in again. | If Sign-out URL is configured, user is logged out of all services and prompt to authenticate. |
| Authorized user logs out and then logs in again. | If Sign-out URL is not configured, user will be automatically logged back in using existing token from the existing Azure AD browser session. |
| Authorized user clicks on link in an email and is already authenticated. | User clicks on URL and is signed into the application with no additional prompts. |
| Authorized user clicks on link in an email and is not yet authenticated. | User clicks on URL and is prompt to authenticate with first factor. |

## Manage SSO

This section outlines the requirements and recommendations to successfully manage SSO.

### Required administrative roles

Always use the role with the fewest permissions available to accomplish the required task within Azure Active Directory. Microsoft recommends [review the different roles that are available](https://docs.microsoft.com/azure/active-directory/active-directory-assign-admin-roles-azure-portal) and choose the right one to solve your needs for each persona for this application. Some roles may need to be applied temporarily and removed after the deployment has been completed.

| Persona| Roles | Azure AD role (if required) |
|--------|-------|-----------------------------|
| Help desk admin | Tier 1 support | None |
| Identity admin | Configure and debug when issues impact Azure AD | Global admin |
| Application admin | User attestation in application, configuration on users with permissions | None |
| Infrastructure admins | Cert rollover owner | Global admin |
| Business owner/stakeholder | User attestation in application, configuration on users with permissions | None |

We recommend using [Privileged Identity Management](https://docs.microsoft.com/azure/active-directory/active-directory-privileged-identity-management-configure) (PIM) to manage your roles to provide additional auditing, control, and access review for users with directory permissions.

### SSO certificate lifecycle management

It’s important to identify the right roles and email distribution lists tasked with managing the lifecycle of the signing certificate between Azure AD and the application that is being configured with single sign-on. Here are some of the key roles we recommend having in place:

- Owner for updating user properties in application
- Owner On-Call for application break/fix support
- Closely monitored email distribution list for certificate-related change notifications

The maximum lifetime of a certificate is three years. We recommend establishing a process on how you'll handle a certificate change between Azure AD and your application. This can help prevent or minimize an outage due to a certificate expiring or force certificate rollover.

### Rollback process

After you complete testing based on your test cases, it’s time to move into production with your application. Moving to production means you will implement your planned and tested configurations in your production tenant and roll it out to your users. However, it's important to plan what to do in case your deployment doesn’t go as planned. If the SSO configuration fails during the deployment, you must understand how to mitigate any outage and reduce impact to your users.

The availability of authentication methods within the application will determine your best strategy. Always ensure you have detailed documentation for app owners on exactly how to get back to the original login configuration state in case your deployment runs into issues.

- **If your app supports multiple identity providers**, for example LDAP and AD FS and Ping, do not delete the existing SSO configuration during rollout. Instead, disable it during migration in case you need to switch it back later. 

- **If your app does not support multiple IDPs** but allows users to log in using forms-based authentication (username/password), ensure that users can fall back to this approach in case the new SSO configuration rollout fails.

### Access management

We recommend choosing a scaled approach when managing access to resources. Common approaches include utilizing on-premises groups by syncing via Azure AD Connect, [creating Dynamic Groups in Azure AD based on user attributes](https://docs.microsoft.com/azure/active-directory/active-directory-groups-dynamic-membership-azure-portal), or creating [self-service groups](https://docs.microsoft.com/azure/active-directory/active-directory-accessmanagement-self-service-group-management) in Azure AD managed by a resource owner.

### Monitor security

We recommend setting up a regular cadence in which you review the different aspects of SaaS app security and perform any remedial actions that are required.

### Troubleshooting

The following links present troubleshooting scenarios. You may want to create a specific guide for your support staff that incorporates these scenarios and the steps to fix them.

#### Consent issues

- [Unexpected consent error](https://docs.microsoft.com/azure/active-directory/manage-apps/application-sign-in-unexpected-user-consent-prompt)

- [User consent error](https://docs.microsoft.com/azure/active-directory/manage-apps/application-sign-in-unexpected-user-consent-error)

#### Sign-in issues

- [Problems signing in from a custom portal](https://docs.microsoft.com/azure/active-directory/manage-apps/application-sign-in-other-problem-deeplink)

- [Problems signing in from access panel](https://docs.microsoft.com/azure/active-directory/manage-apps/application-sign-in-other-problem-access-panel)

- [Error on application sign-in page](https://docs.microsoft.com/azure/active-directory/manage-apps/application-sign-in-problem-application-error)

- [Problem signing into a Microsoft application](https://docs.microsoft.com/azure/active-directory/manage-apps/application-sign-in-problem-first-party-microsoft)

#### SSO issues for applications listed in the Azure Application Gallery

- [Problem with password SSO for applications listed in the Azure Application Gallery](https://docs.microsoft.com/azure/active-directory/manage-apps/application-sign-in-problem-password-sso-gallery) 

- [Problem with federated SSO for applications listed in the Azure Application Gallery](https://docs.microsoft.com/azure/active-directory/manage-apps/application-sign-in-problem-federated-sso-gallery)   

#### SSO issues for applications NOT listed in the Azure Application Gallery

- [Problem with password SSO for applications NOT listed in the Azure Application Gallery](https://docs.microsoft.com/azure/active-directory/manage-apps/application-sign-in-problem-password-sso-non-gallery) 

- [Problem with federated SSO for applications NOT listed in the Azure Application Gallery](https://docs.microsoft.com/azure/active-directory/manage-apps/application-sign-in-problem-federated-sso-non-gallery)

## Next steps

[Debug SAML-based SSO](https://docs.microsoft.com/azure/active-directory/develop/active-directory-saml-debugging)

[Claim mapping for Apps via PowerShell](https://docs.microsoft.com/azure/active-directory/active-directory-claims-mapping)

[Customizing claims issued in SAML token](https://docs.microsoft.com/azure/active-directory/develop/active-directory-saml-claims-customization)

[Single Sign-on SAML protocol](https://docs.microsoft.com/azure/active-directory/develop/active-directory-single-sign-on-protocol-reference)

[Single Sign-Out SAML protocol](https://docs.microsoft.com/azure/active-directory/develop/active-directory-single-sign-out-protocol-reference)

[Azure AD B2B](https://docs.microsoft.com/azure/active-directory/active-directory-b2b-what-is-azure-ad-b2b) (for external users such as partners and vendors)

[Azure AD Conditional Access](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-azure-portal)

[Azure Identity Protection](https://docs.microsoft.com/azure/active-directory/active-directory-identityprotection)

[SSO access](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

[Application SSO Tutorial](https://docs.microsoft.com/azure/active-directory/saas-apps/tutorial-list)
