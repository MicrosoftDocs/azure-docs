---

title: Azure Active Directory proof of concept playbook building blocks | Microsoft Docs
description: Explore and quickly implement Identity and Access Management scenarios
services: active-directory
keywords: azure active directory, playbook, Proof of Concept, PoC
documentationcenter: ''
author: dstefanMSFT
manager: mtillman

ms.assetid:
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/04/2017
ms.author: dstefan

---
# Azure Active Directory proof of concept playbook: Building blocks

## Catalog of roles

| Role | Description | Proof of concept (PoC) responsibility |
| --- | --- | --- |
| **Identity Architecture / development team** | This team is usually the one that designs the solution, implements prototypes, drives approvals, and finally hands off to operations | They provide the environments and are the ones evaluating the different scenarios from the manageability perspective |
| **On-Premises Identity Operations team** | Manages the different identity sources on-premises: Active Directory Forests, LDAP directories, HR systems, and Federation Identity Providers. | Provide access to on-premises resources needed for the PoC scenarios.<br/>They should be involved as little as possible|
| **Application Technical Owners** | Technical owners of the different cloud apps and services that will integrate with Azure AD | Provide details on SaaS applications (potentially instances for testing) |
| **Azure AD Global Admin** | Manages the Azure AD configuration | Provide credentials to configure the synchronization service. Usually the same team as Identity Architecture during PoC but separate during the operations phase|
| **Database team** | Owners of the Database infrastructure | Provide access to SQL environment (ADFS or Azure AD Connect) for specific scenario preparations.<br/>They should be involved as little as possible |
| **Network team** | Owners of the Network infrastructure | Provide required access at the network level for the synchronization servers to properly access the data sources and cloud services (firewall rules, ports opened, IPSec rules etc.) |
| **Security team** | Defines the security strategy, analyzes security reports from various sources, and follows through on findings. | Provide target security evaluation scenarios |

## Common Prerequisites for all building blocks

Following are some pre-requisites needed for any POC with Azure AD Premium.

| Pre-requisite | Resources |
| --- | --- |
| Azure AD tenant defined with a valid Azure subscription | [How to get an Azure Active Directory tenant](develop/quickstart-create-new-tenant.md)<br/>**Note:** If you already have an environment with Azure AD Premium licenses, you can get a zero cap subscription by navigating to https://aka.ms/accessaad <br/>Learn more at: https://blogs.technet.microsoft.com/enterprisemobility/2016/02/26/azure-ad-mailbag-azure-subscriptions-and-azure-ad-2/ and https://technet.microsoft.com/library/dn832618.aspx |
| Domains defined and verified | [Add a custom domain name to Azure Active Directory](active-directory-domains-add-azure-portal.md)<br/>**Note:** Some workloads such as Power BI could have provisioned an azure AD tenant under the covers. To check if a given domain is associated to a tenant, navigate to https://login.microsoftonline.com/{domain}/v2.0/.well-known/openid-configuration. If you get a successful response, then the domain is already assigned to a tenant and take over might be needed. If so, contact Microsoft for further guidance. Learn more about the takeover options at: [What is Self-Service Signup for Azure?](users-groups-roles/directory-self-service-signup.md) |
| Azure AD Premium or EMS trial Enabled | [Azure Active Directory Premium free for one month](https://azure.microsoft.com/trial/get-started-active-directory/) |
| You have assigned Azure AD Premium or EMS licenses to PoC users | [License yourself and your users in Azure Active Directory](active-directory-licensing-get-started-azure-portal.md) |
| Azure AD Global Admin credentials | [Assigning administrator roles in Azure Active Directory](users-groups-roles/directory-assign-admin-roles.md) |
| Optional but strongly recommended: Parallel lab environment as a fallback | [Prerequisites for Azure AD Connect](hybrid/how-to-connect-install-prerequisites.md) |

## Directory Synchronization - Password Hash Sync (PHS) - New Installation

Approximate time to Complete: one hour for less than 1,000 PoC users

### Pre-requisites

| Pre-requisite | Resources |
| --- | --- |
| Server to Run Azure AD Connect | [Prerequisites for Azure AD Connect](hybrid/how-to-connect-install-prerequisites.md) |
| Target POC users, in the same domain and part of a security group, and OU | [Custom installation of Azure AD Connect](hybrid/how-to-connect-install-custom.md#domain-and-ou-filtering) |
| Azure AD Connect Features needed for the POC are identified | [Connect Active Directory with Azure Active Directory - Configure sync features](hybrid/how-to-connect-install-roadmap.md#configure-sync-features) |
| You have needed credentials for on-premises and cloud environments  | [Azure AD Connect: Accounts and permissions](hybrid/reference-connect-accounts-permissions.md) |

### Steps

| Step | Resources |
| --- | --- |
| Download the latest version of Azure AD Connect | [Download Microsoft Azure Active Directory Connect](https://www.microsoft.com/download/details.aspx?id=47594) |
| Install Azure AD Connect with the simplest path: Express <br/>1. Filter to the target OU to minimize the Sync Cycle time<br/>2. Choose target set of users in the on-premises group.<br/>3. Deploy the features needed by the other POC Themes | [Azure AD Connect: Custom installation: Domain and OU filtering](hybrid/how-to-connect-install-custom.md#domain-and-ou-filtering) <br/>[Azure AD Connect: Custom installation: Group based filtering](hybrid/how-to-connect-install-custom.md#sync-filtering-based-on-groups)<br/>[Azure AD Connect: Integrating your on-premises identities with Azure Active Directory: Configure Sync Features](hybrid/how-to-connect-install-roadmap.md#configure-sync-features) |
| Open the Azure AD Connect UI and see the running profiles completed (Import, sync, and export) | [Azure AD Connect sync: Scheduler](hybrid/how-to-connect-sync-feature-scheduler.md) |
| Open the [Azure AD management portal](https://ms.portal.azure.com/#blade/Microsoft_AAD_IAM/UserManagementMenuBlade/), go to the "All Users" blade, add "Source of authority" column and see that the users appear, marked properly as coming from "Windows Server AD" | [Azure AD management portal](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview) |

### Considerations

1. Look at  the security considerations of password hash sync [here](hybrid/how-to-connect-password-hash-synchronization.md).  If password hash sync for pilot production users is definitively not an option, then consider the following alternatives:
   * Create test users in the production domain. Make sure you don't synchronize any other account
   * Move to an UAT environment
2.	If you want to pursue federation, it is worthwhile to understand the costs associated a federated solution with on-premises Identity Provider beyond the POC and measure that against the benefits you are looking for:
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
| Optional: If the environment has an  ADFS server, access to the server to customize web theme | [AD FS user sign-in customization](https://technet.microsoft.com/windows-server-docs/identity/ad-fs/operations/ad-fs-user-sign-in-customization) |
| Client computer to perform end-user login experience |  |
| Optional: Mobile devices to validate experience |  |

### Steps

| Step | Resources |
| --- | --- |
| Go to Azure AD Management Portal | [Azure AD Management Portal - Company Branding](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/LoginTenantBranding) |
| Upload the assets for the login page (hero logo, small logo, labels, etc.). Optionally if  you have AD FS, align the same assets with ADFS login pages | [Add company branding to your sign-in and Access Panel pages: Customizable Elements](fundamentals/customize-branding.md) |
| Wait a couple of minutes for the change to fully take effect |  |
| Log in with the POC user credential to https://myapps.microsoft.com |  |
| Confirm the look and feel in browser | [Add company branding to your sign-in and Access Panel pages](fundamentals/customize-branding.md) |
| Optionally, confirm the look and feel in other devices |  |

### Considerations

If the old look and feel remains after the customization then flush the browser client cache, and retry the operation.

## Group based licensing

Approximate time to Complete: 10 minutes

### Pre-requisites

| Pre-requisite | Resources |
| --- | --- |
| All POC users are part of a security group (either cloud or on-premises) | [Create a group and add members in Azure Active Directory](fundamentals/active-directory-groups-create-azure-portal.md) |

### Steps

| Step | Resources |
| --- | --- |
| Go to licenses blade in Azure AD Management Portal | [Azure AD Management Portal: Licensing](https://portal.azure.com/#blade/Microsoft_AAD_IAM/LicensesMenuBlade/Products) |
| Assign the licenses to the security group with POC users. | [Assign licenses to a group of users in Azure Active Directory](users-groups-roles/licensing-groups-assign.md) |

### Considerations

In case of any issues, go to [Scenarios, limitations, and known issues with using groups to manage licensing in Azure Active Directory](users-groups-roles/licensing-group-advanced.md)

## SaaS Federated SSO Configuration

Approximate time to Complete: 60 minutes

### Pre-requisites

| Pre-requisite | Resources |
| --- | --- |
| Test environment of the SaaS application available. In this guide, we use ServiceNow as an example.<br/>We strongly recommend to use a test  instance to minimize friction on navigating existing data quality and mappings. | Go to https://developer.servicenow.com/app.do#!/home to start the process of getting a test instance |
| Admin access to the ServiceNow management console | [Tutorial: Azure Active Directory integration with ServiceNow](saas-apps/servicenow-tutorial.md) |
| Target set of users to assign the application to. A security group containing the PoC users is recommended. <br/>If creating the group is not feasible, then assign the users to directly to the application for the PoC | [Assign a user or group to an enterprise app in Azure Active Directory](manage-apps/assign-user-or-group-access-portal.md) |

### Steps

| Step | Resources |
| --- | --- |
| Share the tutorial to all actors from Microsoft Documentation  | [Tutorial: Azure Active Directory integration with ServiceNow](saas-apps/servicenow-tutorial.md) |
| Set a working meeting and follow the tutorial steps with each actor. | [Tutorial: Azure Active Directory integration with ServiceNow](saas-apps/servicenow-tutorial.md) |
| Assign the app to the group identified in the Prerequisites. If the POC has conditional access in the scope, you can revisit that later and add MFA, and similar. <br/>Note this will kick in the provisioning process (if configured) |  [Assign a user or group to an enterprise app in Azure Active Directory](manage-apps/assign-user-or-group-access-portal.md) <br/>[Create a group and add members in Azure Active Directory](fundamentals/active-directory-groups-create-azure-portal.md) |
| Use Azure AD management Portal to add ServiceNow Application from Gallery| [Azure AD management Portal: Enterprise Applications](https://portal.azure.com/#blade/Microsoft_AAD_IAM/StartboardApplicationsMenuBlade/Overview) <br/>[What's new in Enterprise Application management in Azure Active Directory](active-directory-enterprise-apps-whats-new-azure-portal.md) |
| In "Single sign-on" blade of ServiceNow App enable "SAML-based Sign-on" |  |
| Fill out "Sign on URL" and "Identifier" fields with your ServiceNow URL<br/>Check the box to "Make new certificate active"<br/>and Save settings |  |
| Open "Configure ServiceNow" blade on the bottom of the panel to view customized instructions for you to configure ServiceNow |  |
| Follow instructions to configure ServiceNow |  |
| In "Provisioning" blade of ServiceNow App enable "Automatic" provisioning | [Managing user account provisioning for enterprise apps in the new Azure portal](manage-apps/configure-automatic-user-provisioning-portal.md) |
| Wait for a few minutes while provisioning completes.  In the meantime, you can check on the provisioning reports |  |
| Log in to https://myapps.microsoft.com/ as a test user that has access | [What is the Access Panel?](user-help/active-directory-saas-access-panel-introduction.md) |
| Click on the tile for the application that was just created. Confirm access |  |
| Optionally, you can check the application usage reports. Note there is some latency, so you need to wait some time to see the traffic in the reports. | [Sign-in activity reports in the Azure Active Directory portal: Usage of managed applications](reports-monitoring/concept-sign-ins.md#usage-of-managed-applications)<br/>[Azure Active Directory report retention policies](reports-monitoring/reference-reports-data-retention.md) |

### Considerations

1. Above [Tutorial](saas-apps/servicenow-tutorial.md) refers to old Azure AD management experience. But PoC is based on [Quickstart](active-directory-enterprise-apps-whats-new-azure-portal.md#quickstart-get-going-with-your-new-application-right-away) experience.
2. If the target application is not present in the gallery, then you can use "Bring your own app". Learn more: [What's new in Enterprise Application management in Azure Active Directory: Add custom applications from one place](active-directory-enterprise-apps-whats-new-azure-portal.md#add-custom-applications-from-one-place)

## SaaS Password SSO Configuration

Approximate time to Complete: 15 minutes

### Pre-requisites

| Pre-requisite | Resources |
| --- | --- |
| Test environment for SaaS applications. An example of Password SSO is HipChat and Twitter. For any other application, you need the exact URL of the page with html sign-in form. | [Twitter on Microsoft Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/aad.twitter)<br/>[HipChat on Microsoft Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/aad.hipchat) |
| Test accounts for the applications. | [Sign up for Twitter](https://twitter.com/signup?lang=en)<br/>[Sign Up for Free: HipChat](https://www.hipchat.com/sign_up) |
| Target set of users to assign the application to. A security group contained the users is recommended. | [Assign a user or group to an enterprise app in Azure Active Directory](manage-apps/assign-user-or-group-access-portal.md) |
| Local administrator access to a computer to deploy the Access Panel Extension for Internet Explorer, Chrome or Firefox | [Access Panel Extension for IE](https://account.activedirectory.windowsazure.com/Applications/Installers/x64/Access%20Panel%20Extension.msi)<br/>[Access Panel Extension for Chrome](https://go.microsoft.com/fwLink/?LinkID=311859&clcid=0x409)<br/>[Access Panel Extension for Firefox](https://go.microsoft.com/fwLink/?LinkID=626998&clcid=0x409) |

### Steps

| Step | Resources |
| --- | --- |
| Install the browser extension | [Access Panel Extension for IE](https://account.activedirectory.windowsazure.com/Applications/Installers/x64/Access%20Panel%20Extension.msi)<br/>[Access Panel Extension for Chrome](https://go.microsoft.com/fwLink/?LinkID=311859&clcid=0x409)<br/>[Access Panel Extension for Firefox](https://go.microsoft.com/fwLink/?LinkID=626998&clcid=0x409) |
| Configure Application from Gallery | [What's new in Enterprise Application management in Azure Active Directory: The new and improved application gallery](active-directory-enterprise-apps-whats-new-azure-portal.md#improvements-to-the-azure-active-directory-application-gallery) |
| Configure Password SSO | [Managing single sign-on for enterprise apps in the new Azure portal: Password-based sign on](manage-apps/what-is-single-sign-on.md#how-does-single-sign-on-with-azure-active-directory-work).|
| Assign the app to the group identified in the Prerequisites | [Assign a user or group to an enterprise app in Azure Active Directory](manage-apps/assign-user-or-group-access-portal.md) |
| Log in to https://myapps.microsoft.com/ as a test user that has access |  |
| Click on the tile for the application that was just created. | [What is the Access Panel?: Password-based SSO without identity provisioning](user-help/active-directory-saas-access-panel-introduction.md#password-based-sso-without-identity-provisioning) |
| Supply the application credential | [What is the Access Panel?: Password-based SSO without identity provisioning](user-help/active-directory-saas-access-panel-introduction.md#password-based-sso-without-identity-provisioning) |
| Close the browser and repeat the login. This time around the user should see seamless access to the application. |  |
| Optionally, you can check the application usage reports. Note there is some latency, so you need to wait some time to see the traffic in the reports. | [Sign-in activity reports in the Azure Active Directory portal: Usage of managed applications](reports-monitoring/concept-sign-ins.md#usage-of-managed-applications)<br/>[Azure Active Directory report retention policies](reports-monitoring/reference-reports-data-retention.md) |

### Considerations

If the target application is not present in the gallery, then you can use "Bring your own app". Learn more: [What's new in Enterprise Application management in Azure Active Directory: Add custom applications from one place](active-directory-enterprise-apps-whats-new-azure-portal.md#add-custom-applications-from-one-place)

 Keep in mind the following requirements:
   * Application should have a known login URL
   * The sign-in page should contain an HTML form with one more text fields that the browser extensions can auto-populate. At the minimum, it should contain username and password.

## SaaS Shared Accounts Configuration

Approximate time to Complete: 30 minutes

### Pre-requisites

| Pre-requisite | Resources |
| --- | --- |
| The list of target applications and the exact sign-in URLS ahead of time. As an example, you can use Twitter. | [Twitter on Microsoft Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/aad.twitter)<br/>[Sign up for Twitter](https://twitter.com/signup?lang=en) |
| Shared credential for this SaaS application. | [Sharing accounts using Azure AD](active-directory-sharing-accounts.md)<br/>[Azure AD automated password roll-over for Facebook, Twitter and LinkedIn now in preview! - Enterprise Mobility and Security Blog] (https://blogs.technet.microsoft.com/enterprisemobility/2015/02/20/azure-ad-automated-password-roll-over-for-facebook-twitter-and-linkedin-now-in-preview/ ) |
| Credentials for at least two team members who will access the same account. They must be part of a security group. | [Assign a user or group to an enterprise app in Azure Active Directory](manage-apps/assign-user-or-group-access-portal.md) |
| Local administrator access to a computer to deploy the Access Panel Extension for Internet Explorer, Chrome or Firefox | [Access Panel Extension for IE](https://account.activedirectory.windowsazure.com/Applications/Installers/x64/Access%20Panel%20Extension.msi)<br/>[Access Panel Extension for Chrome](https://go.microsoft.com/fwLink/?LinkID=311859&clcid=0x409)<br/>[Access Panel Extension for Firefox](https://go.microsoft.com/fwLink/?LinkID=626998&clcid=0x409) |

### Steps

| Step | Resources |
| --- | --- |
| Install the browser extension | [Access Panel Extension for IE](https://account.activedirectory.windowsazure.com/Applications/Installers/x64/Access%20Panel%20Extension.msi)<br/>[Access Panel Extension for Chrome](https://go.microsoft.com/fwLink/?LinkID=311859&clcid=0x409)<br/>[Access Panel Extension for Firefox](https://go.microsoft.com/fwLink/?LinkID=626998&clcid=0x409) |
| Configure Application from Gallery | [What's new in Enterprise Application management in Azure Active Directory: The new and improved application gallery](active-directory-enterprise-apps-whats-new-azure-portal.md#improvements-to-the-azure-active-directory-application-gallery) |
| Configure Password SSO | [Managing single sign-on for enterprise apps in the new Azure portal: Password-based sign on](manage-apps/what-is-single-sign-on.md#how-does-single-sign-on-with-azure-active-directory-work).|
| Assign the app to the group identified in the Prerequisites while assigning them credentials | [Assign a user or group to an enterprise app in Azure Active Directory](manage-apps/assign-user-or-group-access-portal.md) |
| Log in as different users that access app as the **same shared account.**  |  |
| Optionally, you can check the application usage reports. Note there is some latency, so you need to wait some time to see the traffic in the reports. | [Sign-in activity reports in the Azure Active Directory portal: Usage of managed applications](reports-monitoring/concept-sign-ins.md#usage-of-managed-applications)<br/>[Azure Active Directory report retention policies](reports-monitoring/reference-reports-data-retention.md) |


### Considerations

If the target application is not present in the gallery, then you can use "Bring your own app". Learn more: [What's new in Enterprise Application management in Azure Active Directory: Add custom applications from one place](active-directory-enterprise-apps-whats-new-azure-portal.md#add-custom-applications-from-one-place)

 Keep in mind the following requirements:
   * Application should have a known login URL
   * The sign-in page should contain an HTML form with one more text fields that the browser extensions can auto-populate. At the minimum, it should contain username and password.

## App Proxy Configuration

Approximate time to Complete: 20 minutes

### Pre-requisites

| Pre-requisite | Resources |
| --- | --- |
| A Microsoft Azure AD basic or premium subscription and an Azure AD directory for which you are a global administrator | [Azure Active Directory editions](fundamentals/active-directory-whatis.md) |
| A web application hosted on-prem that you would like to configure for remote access |  |
| A server running Windows Server 2012 R2, or Windows 8.1 or higher, on which you can install the Application Proxy Connector | [Understand Azure AD Application Proxy connectors](manage-apps/application-proxy-connectors.md) |
| If there is a firewall in the path, make sure that it's open so that the Connector can make HTTPS (TCP) requests to the Application Proxy | [Enable Application Proxy in the Azure portal: Application Proxy prerequisites](manage-apps/application-proxy-enable.md#application-proxy-prerequisites) |
| If your organization uses proxy servers to connect to the internet, take a look at the blog post Working with existing on-premises proxy servers for details on how to configure them | [Work with existing on-premises proxy servers](manage-apps/application-proxy-configure-connectors-with-proxy-servers.md) |


### Steps

| Step | Resources |
| --- | --- |
| Install a connector on the server | [Enable Application Proxy in the Azure portal: Install and register the Connector](manage-apps/application-proxy-enable.md#install-and-register-a-connector) |
| Publish the on-prem application in Azure AD as an Application Proxy application | [Publish applications using Azure AD Application Proxy](manage-apps/application-proxy-publish-azure-portal.md) |
| Assign test users | [Publish applications using Azure AD Application Proxy: Add a test user](manage-apps/application-proxy-publish-azure-portal.md#add-a-test-user) |
| Optionally, configure a single sign-on experience for your users | [Provide single sign-on with Azure AD Application Proxy](manage-apps/application-proxy-configure-single-sign-on-password-vaulting.md) |
| Test app by signing in to MyApps portal as assigned user | https://myapps.microsoft.com |

### Considerations

1. While we suggest putting the connector in your corporate network, there are cases when you will see better performance placing it in the cloud. Learn more: [Network topology considerations when using Azure Active Directory Application Proxy](manage-apps/application-proxy-network-topology.md)
2. For further security details and how this provides a particularly secure remote access solution by only maintaining outbound connections see: [Security considerations for accessing apps remotely by using Azure AD Application Proxy](manage-apps/application-proxy-security.md)

## Generic LDAP Connector configuration

Approximate time to Complete: 60 minutes

> [!IMPORTANT]
> This is an advanced configuration requiring some familiarity with FIM/MIM. If used in production, we advise questions about this configuration go through [Premier Support](https://support.microsoft.com/premier).

### Pre-requisites

| Pre-requisite | Resources |
| --- | --- |
| Azure AD Connect installed and configured | Building block: [Directory Synchronization - Password Hash Sync](#directory-synchronization--password-hash-sync-phs--new-installation) |
| ADLDS instance meeting requirements | [Generic LDAP Connector technical reference: Overview of the Generic LDAP Connector](https://docs.microsoft.com/microsoft-identity-manager/reference/microsoft-identity-manager-2016-connector-genericldap#overview-of-the-generic-ldap-connector) |
| List of workloads, that users are using and attributes associated with these workloads | [Azure AD Connect sync: Attributes synchronized to Azure Active Directory](hybrid/reference-connect-sync-attributes-synchronized.md) |


### Steps

| Step | Resources |
| --- | --- |
| Add Generic LDAP Connector | [Generic LDAP Connector technical reference: Create a new Connector](https://docs.microsoft.com/microsoft-identity-manager/reference/microsoft-identity-manager-2016-connector-genericldap#create-a-new-connector) |
| Create run profiles for created connector (full import, delta import, full synchronization, delta synchronization, export) | [Create a Management Agent Run Profile](https://technet.microsoft.com/library/jj590219(v=ws.10).aspx)<br/> [Using connectors with the Azure AD Connect Sync Service Manager](hybrid/how-to-connect-sync-service-manager-ui-connectors.md)|
| Run full import profile and verify, that there are objects in connector space | [Search for a Connector Space Object](https://technet.microsoft.com/library/jj590287(v=ws.10).aspx)<br/>[Using connectors with the Azure AD Connect Sync Service Manager: Search Connector Space](hybrid/how-to-connect-sync-service-manager-ui-connectors.md#search-connector-space) |
| Create synchronization rules, so that objects in Metaverse have necessary attributes for workloads | [Azure AD Connect sync: Best practices for changing the default configuration: Changes to Synchronization Rules](hybrid/how-to-connect-sync-best-practices-changing-default-configuration.md#changes-to-synchronization-rules)<br/>[Azure AD Connect sync: Understanding Declarative Provisioning](hybrid/concept-azure-ad-connect-sync-declarative-provisioning.md)<br/>[Azure AD Connect sync: Understanding Declarative Provisioning Expressions](hybrid/concept-azure-ad-connect-sync-declarative-provisioning-expressions.md) |
| Start full synchronization cycle | [Azure AD Connect sync: Scheduler: Start the scheduler](hybrid/how-to-connect-sync-feature-scheduler.md#start-the-scheduler) |
| In case of issues do troubleshooting | [Troubleshoot an object that is not synchronizing to Azure AD](hybrid/tshoot-connect-object-not-syncing.md) |
| Verify, that LDAP user can sign-in and access the application | https://myapps.microsoft.com |

### Considerations

> [!IMPORTANT]
> This is an advanced configuration requiring some familiarity with FIM/MIM. If used in production, we advise questions about this configuration go through [Premier Support](https://support.microsoft.com/premier).

## Groups - Delegated Ownership

Approximate time to Complete: 10 minutes

### Pre-requisites

| Pre-requisite | Resources |
| --- | --- |
| SaaS application (Federated SSO or Password SSO) has been already configured | Building block: [SaaS Federated SSO Configuration](#saas-federated-sso-configuration) |
| Cloud Group that is assigned access to the application in #1 is identified | Building block: [SaaS Federated SSO Configuration](#saas-federated-sso-configuration) <br/>[Create a group and add members in Azure Active Directory](fundamentals/active-directory-groups-create-azure-portal.md) |
| Credentials for the group owner are available | [Manage access to resources with Azure Active Directory groups](fundamentals/active-directory-manage-groups.md) |
| Credentials for the information worker accessing the apps has been identified | [What is the Access Panel?](user-help/active-directory-saas-access-panel-introduction.md) |


### Steps

| Step | Resources |
| --- | --- |
| Identify the group that has been granted access to the application, and configure the owner of given group| [Manage the settings for a group in Azure Active Directory ](fundamentals/active-directory-groups-settings-azure-portal.md) |
| Log in as the group owner, see the group membership in groups tab of access panel | [Azure Active Directory Groups Management page](https://account.activedirectory.windowsazure.com/r#/groups) |
| Add the information worker you want to test |  |
| Log in as the information worker, confirm the tile is available | [What is the Access Panel?](user-help/active-directory-saas-access-panel-introduction.md) |

### Considerations

If the application has provisioning enabled, you might need to wait a few minutes for the provisioning to complete before accessing the application as the information worker.

## SaaS and Identity Lifecycle

### Pre-requisites

| Pre-requisite | Resources |
| --- | --- |
| SaaS application (Federated SSO or Password SSO) has been already configured | Building block: [SaaS Federated SSO Configuration](#saas-federated-sso-configuration) |
| Cloud Group that is assigned access to the application in #1 is identified | Building block: [SaaS Federated SSO Configuration](#saas-federated-sso-configuration) <br/>[Create a group and add members in Azure Active Directory](fundamentals/active-directory-groups-create-azure-portal.md) |
| Credentials for the information worker accessing the apps has been identified | [What is the Access Panel?](user-help/active-directory-saas-access-panel-introduction.md) |


### Steps

| Step | Resources |
| --- | --- |
| Remove the user from the group the app is assigned to | [Manage group membership for users in your Azure Active Directory tenant](fundamentals/active-directory-groups-members-azure-portal.md) |
| Wait for a few minutes for de-provisioning | [Automated SaaS App User Provisioning in Azure AD: How does automated provisioning work?](manage-apps/user-provisioning.md#how-does-automatic-provisioning-work) |
| On a separate browser session, log in as the information worker to my apps portal and confirm that tile is missing | http://myapps.microsoft.com |


### Considerations

Extrapolate the PoC scenario to leavers and/or leave of absence scenarios. If the user gets disabled in on-premises AD or removed, there is no longer a way to log in to the SaaS application.

## Self Service Access to Application Management

Approximate time to Complete: 10 minutes

### Pre-requisites

| Pre-requisite | Resources |
| --- | --- |
| Identify POC users that will request access to the applications, as part of the security group | Building block: [SaaS Federated SSO Configuration](#saas-federated-sso-configuration) |
| Target Application deployed | Building block: [SaaS Federated SSO Configuration](#saas-federated-sso-configuration) |

### Steps

| Step | Resources |
| --- | --- |
| Go to Enterprise Applications blade in Azure AD Management Portal | [Azure AD Management Portal: Enterprise Applications](https://portal.azure.com/#blade/Microsoft_AAD_IAM/StartboardApplicationsMenuBlade/AllApps/menuId/) |
| Configure Application from Pre-requisites with self service | [What's new in Enterprise Application management in Azure Active Directory: Configure self-service application access](active-directory-enterprise-apps-whats-new-azure-portal.md#configure-self-service-application-access) |
| Log in as the information worker to my apps portal | http://myapps.microsoft.com |
| Notice "+Add app" button on op of the page. Use it to get access to the app |  |

### Considerations

The applications chosen might have provisioning requirements, so going immediately to the app might cause some errors. If the application chosen supports provisioning with azure ad and it is configured, you might use this as an opportunity to show the whole flow working end to end. See the building block for [SaaS Federated SSO Configuration](#saas-federated-sso-configuration) for further recommendations

## Self Service Password Reset

Approximate time to Complete: 15 minutes

### Pre-requisites

| Pre-requisite | Resources |
| --- | --- |
| Enable self-service password management in your tenant. | [Azure Active Directory password reset for IT administrators](user-help/active-directory-passwords-update-your-own-password.md) |
| Enable password write-back to manage passwords from on-premises. Note this requires specific Azure AD Connect versions | [Password Writeback prerequisites](authentication/howto-sspr-writeback.md) |
| Identify the PoC users that will use this functionality, and make sure they are members of a security group. The users must be non-admins to fully showcase the capability | [Customize: Azure AD Password Management: Restrict Access to password reset](authentication/howto-sspr-writeback.md) |


### Steps

| Step | Resources |
| --- | --- |
| Navigate to Azure AD Management Portal: Password Reset | [Azure AD Management Portal: Password Reset](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/PasswordReset) |
| Determine the password reset policy. For POC purposes, you can use phone call and Q & A. It is recommended to enable registration to be required on log in to access panel |  |
| Log out and log in as an information worker |  |
| Supply the Self-Service Password Reset data as configured per step 2 | https://aka.ms/ssprsetup |
| Close the browser |  |
| Start over the login process as the information worker you used in step 4 |  |
| Reset the password | [Update your own password: Reset my password](user-help/active-directory-passwords-update-your-own-password.md) |
| Try logging in with your new password to Azure AD as well as to on-premises resources |  |

### Considerations

1. If upgrading the Azure AD Connect is going to cause friction, then consider using it against cloud accounts or make it a demo against a separate environment
2. The administrators have a different policy and using the admin account to reset the password might taint the PoC and cause confusion. Make sure you use a regular user account to test the reset operations


## Azure Multi-Factor Authentication with Phone Calls

Approximate time to Complete: 10 minutes

### Pre-requisites

| Pre-requisite | Resources |
| --- | --- |
| Identify POC users that will use MFA  |  |
| Phone with good reception for MFA challenge  | [What is Azure Multi-Factor Authentication?](authentication/multi-factor-authentication.md) |

### Steps

| Step | Resources |
| --- | --- |
| Navigate to "Users and groups" blade in Azure AD Management Portal | [Azure AD Management Portal: Users and groups](https://portal.azure.com/#blade/Microsoft_AAD_IAM/UserManagementMenuBlade/Overview/menuId/) |
| Choose "All users" blade |  |
| In the top bar choose "Multi-Factor Authentication" button | Direct URL for Azure MFA portal: https://aka.ms/mfaportal |
| In the "User" settings select the PoC users and enable them for MFA | [User States in Azure Multi-Factor Authentication](authentication/howto-mfa-userstates.md) |
| Login as the PoC user, and walk through the proof-up process  |  |

### Considerations

1. The PoC steps in this building block explicitly setting MFA for a user on all logins. There are other tools such as Conditional Access, and Identity Protection that engage MFA on more targeted scenarios. This will be something to consider when moving from POC to production.
2. The PoC steps in this building block are explicitly using Phone Calls as the MFA method for expedience. As you transition from POC to production, we recommend using applications such as the [Microsoft Authenticator](user-help/microsoft-authenticator-app-how-to.md) as your second factor whenever possible.
Learn more: [DRAFT NIST Special Publication 800-63B](https://pages.nist.gov/800-63-3/sp800-63b.html)

## MFA Conditional Access for SaaS applications

Approximate time to Complete: 10 minutes

### Pre-requisites

| Pre-requisite | Resources |
| --- | --- |
| Identify PoC users to target the policy. These users should be in a security group to scope the conditional access policy | [SaaS Federated SSO Configuration](#saas-federated-sso-configuration) |
| SaaS application has been already configured |  |
| PoC users are already assigned to the application |  |
| Credentials to the POC user are available |  |
| POC user is registered for MFA. Using a phone with Good reception | https://aka.ms/ssprsetup |
| Device in the internal network. IP Address configured in the internal address range | Find your ip address: https://www.bing.com/search?q=what%27s+my+ip |
| Device in the external network (can be a phone using the carrier's mobile network) |  |

### Steps

| Step | Resources |
| --- | --- |
| Go to Azure AD Management Portal: Conditional Access blade | [Azure AD Management Portal: Conditional Access](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ConditionalAccessBlade/Policies) |
| Create Conditional Access policy:<br/>- Target PoC Users under "Users and groups"<br/>- Target PoC Application under "Cloud apps"<br/>- Target all locations except trusted ones under "Conditions" -> "Locations" **Note:** trusted IPs are configured in [MFA Portal](https://account.activedirectory.windowsazure.com/UserManagement/MfaSettings.aspx)<br/>- Require multi-factor authentication under "Grant" | [Create your conditional access policy](https://docs.microsoft.com/azure/active-directory/conditional-access/app-based-mfa#create-your-conditional-access-policy) |
| Access application from inside corporate network | [Test your conditional access policy](https://docs.microsoft.com/azure/active-directory/conditional-access/app-based-mfa#test-your-conditional-access-policy) |
| Access application from public network | [Test your conditional access policy](https://docs.microsoft.com/azure/active-directory/conditional-access/app-based-mfa#test-your-conditional-access-policy) |

### Considerations

If you are using federation, you can use the on-premises Identity Provider (IdP) to communicate the inside/outside corporate network state with claims. You can use this technique without having to manage the list of IP addresses which might be complex to assess and manage in large organizations. In that setup, you need account for the "network roaming" scenario (a user logging from the internal network, and while logged in switches locations such as a coffee shop) and make sure you understand the implications. Learn more: [Securing cloud resources with Azure Multi-Factor Authentication and AD FS: Trusted IPs for federated users](authentication/howto-mfa-adfs.md#trusted-ips-for-federated-users)

## Privileged Identity Management (PIM)

Approximate time to Complete: 15 minutes

### Pre-requisites

| Pre-requisite | Resources |
| --- | --- |
| Identify the global admin that will be part of the POC for PIM | [Start using Azure AD Privileged Identity Management](privileged-identity-management/pim-getting-started.md) |
| Identify the global admin that will become the Security Administrator | [Start using Azure AD Privileged Identity Management](privileged-identity-management/pim-getting-started.md)<br/> [Different administrative roles in Azure Active Directory PIM](privileged-identity-management/pim-roles.md) |
| Optional: Confirm if the global admins have email access to exercise email notifications in PIM | [What is Azure AD Privileged Identity Management?: Configure the role activation settings](privileged-identity-management/pim-configure.md#configure-the-role-activation-settings)


### Steps

| Step | Resources |
| --- | --- |
| Login to https://portal.azure.com as a global admin (GA) and bootstrap the PIM blade. The Global Admin that performs this step is seeded as the security administrator.  Let's call this actor GA1 | [Using the security wizard in Azure AD Privileged Identity Management](privileged-identity-management/pim-security-wizard.md) |
| Identify the global admin and move them from permanent to eligible. This should be a separate admin from the one used in step 1 for clarity. Let's call this actor GA2 | [Azure AD Privileged Identity Management: How to add or remove a user role](privileged-identity-management/pim-how-to-add-role-to-user.md)<br/>[What is Azure AD Privileged Identity Management?: Configure the role activation settings](privileged-identity-management/pim-configure.md#configure-the-role-activation-settings)  |
| Now, log in as GA2 to https://portal.azure.com and try changing "User Settings". Notice, some options are grayed out. | |
| In a new tab and in the same session as step 3, navigate now to https://portal.azure.com and add the PIM blade to the dashboard. | [Start using PIM](privileged-identity-management/pim-getting-started.md) |
| Request activation to the Global Administrator role | [How to activate or deactivate roles in Azure AD Privileged Identity Management: Activate a role](privileged-identity-management/pim-how-to-activate-role.md#activate-a-role) |
| Note, that if GA2 never signed up for MFA, registration for Azure MFA will be necessary |  |
| Go back to the original tab in step 3, and click the refresh button in the browser. Note that you now have access to change "User settings" | |
| Optionally, if your global administrators have email enabled, you can check GA1 and GA2's inbox and see the notification of the role being activated |  |
| 8	Check the audit history and observe the report to confirm the elevation of GA2 is shown. | [What is Azure AD Privileged Identity Management?: Review role activity](privileged-identity-management/pim-configure.md#review-role-activity) |

### Considerations

This capability is part of Azure AD Premium P2 and/or EMS E5

## Discovering Risk Events

Approximate time to Complete: 20 minutes

### Pre-requisites

| Pre-requisite | Resources |
| --- | --- |
| Device with Tor browser downloaded and installed | [Download Tor Browser](https://www.torproject.org/projects/torbrowser.html.en#downloads) |
| Access to POC user to do the login | [Azure Active Directory Identity Protection playbook](identity-protection/playbook.md) |

### Steps

| Step | Resources |
| --- | --- |
| Open tor browser | [Download Tor Browser](https://www.torproject.org/projects/torbrowser.html.en#downloads) |
| Log in to https://myapps.microsoft.com with the POC user account | [Azure Active Directory Identity Protection playbook: Simulating Risk Events](identity-protection/playbook.md#simulating-risk-events) |
| Wait 5-7 minutes |  |
| Log in as a global admin to https://portal.azure.com and open up the Identity Protection blade | https://aka.ms/aadipgetstarted |
| Open the risk events blade. You should see an entry under "Sign-ins from anonymous IP addresses"  | [Azure Active Directory Identity Protection playbook: Simulating Risk Events](identity-protection/playbook.md#simulating-risk-events) |

### Considerations

This capability is part of Azure AD Premium P2 and/or EMS E5

## Deploying Sign-in risk policies

Approximate time to Complete: 10 minutes

### Pre-requisites

| Pre-requisite | Resources |
| --- | --- |
| Device with Tor browser downloaded and installed | [Download Tor Browser](https://www.torproject.org/projects/torbrowser.html.en#downloads) |
| Access as a POC user to do the log in testing |  |
| POC user is registered with MFA. Make sure to use a phone with good reception | Building Block: [Azure Multi-Factor Authentication with Phone Calls](#azure-multi-factor-authentication-with-phone-calls) |


### Steps

| Step | Resources |
| --- | --- |
| Log in as a global admin to https://portal.azure.com and open the Identity Protection blade | https://aka.ms/aadipgetstarted |
| Enable a sign-in risk policy as follows:<br/>- Assigned to: POC user<br/>- Conditions: Sign-in risk medium or higher (sign-in from anonymous location is deemed as a medium risk level)<br/>- Controls: Require MFA | [Azure Active Directory Identity Protection playbook: Sign-in risk](identity-protection/playbook.md) |
| Open tor browser | [Download Tor Browser](https://www.torproject.org/projects/torbrowser.html.en#downloads) |
| Log in to https://myapps.microsoft.com with the PoC user account |  |
| Notice the MFA challenge | [Sign-in experiences with Azure AD Identity Protection: Risky sign-in recovery](identity-protection/flows.md#risky-sign-in-recovery)

### Considerations

This capability is part of Azure AD Premium P2 and/or EMS E5. To learn more about risk events visit: [Azure Active Directory risk events](reports-monitoring/concept-risk-events.md)

## Configuring certificate based authentication

Approximate time to complete: 20 minutes

### Pre-requisites

| Pre-requisite | Resources |
| --- | --- |
| Device with user certificate provisioned (Windows, iOS or Android) from Enterprise PKI | [Deploy User Certificates](https://msdn.microsoft.com/library/cc770857.aspx) |
| Azure AD domain federated with ADFS | [Azure AD Connect and federation](hybrid/how-to-connect-fed-whatis.md)<br/>[Active Directory Certificate Services Overview](https://technet.microsoft.com/library/hh831740.aspx)|
| For iOS devices have Microsoft Authenticator app installed | [Get started with the Microsoft Authenticator app](user-help/microsoft-authenticator-app-how-to.md) |

### Steps

| Step | Resources |
| --- | --- |
| Enable "Certificate Authentication" on ADFS | [Configure Authentication Policies: To configure primary authentication globally in Windows Server 2012 R2](https://technet.microsoft.com/windows-server-docs/identity/ad-fs/operations/configure-authentication-policies#to-configure-primary-authentication-globally-in-windows-server-2012-r2) |
| Optional: Enable Certificate Authentication in Azure AD for Exchange Active Sync clients | [Get started with certificate-based authentication in Azure Active Directory](./authentication/active-directory-certificate-based-authentication-get-started.md) |
| Navigate to Access Panel and authenticate using User Certificate | https://myapps.microsoft.com |

### Considerations

To learn more about caveats of this deployment visit: [ADFS: Certificate Authentication with Azure AD & Office 365](https://blogs.msdn.microsoft.com/samueld/2016/07/19/adfs-certauth-aad-o365/)



> [!NOTE]
> Possession of user certificate should be guarded. Either by managing devices or with PIN in case of smart cards.



[!INCLUDE [active-directory-playbook-toc](../../includes/active-directory-playbook-steps.md)]
