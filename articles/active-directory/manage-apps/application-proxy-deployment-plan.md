---
title: Plan an Application Proxy Deployment
description: An end-to-end guide for planning the deployment of Application proxy within your organization
services: active-directory
documentationcenter: 'azure'
author: barbaraselden
manager: CelesteDG

ms.assetid: 
ms.service: active-directory
ms.component: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.date: 04-04-2019
ms.author: barbaraselden
ms.reviewer: 

---


# Planning an Azure AD Application Proxy deployment

Azure Active Directory (Azure AD) Application Proxy is a secure and cost-effective remote access solution for on-premises applications. It provides an immediate transition path for “Cloud First” organizations to manage access to legacy on-premises applications that aren’t yet capable of using modern protocols. For additional introductory information, see [What is Application Proxy](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy) and [How Application Proxy Works](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy).

This article includes the resources you need to plan, operate, and manage Azure AD Application Proxy. 

## Plan your implementation

The following section provides a broad view of the key planning elements that will set you up for an efficient deployment experience. 

### Prerequisites

The following are prerequisites that should be met prior to beginning your implementation. You can see more information on setting up your environment including these prerequisites in this [tutorial](application-proxy-add-on-premises-application.md).

* **Connectors**: Connectors are lightweight agents that can be deployed onto physical hardware on-premises, a VM hosted within any hypervisor solution, or a VM hosted in Azure to facilitate outbound connection to the Application Proxy service. See [Understand Azure AD App Proxy Connectors](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-connectors)Understand Azure AD Application Proxy connectors for a more detailed overview.

   * Connector hosts must [be enabled for TLS 1.2d](application-proxy-add-on-premises-application.md) before installing the connectors.

   * If possible, connectors should be deployed in the [same network](application-proxy-network-topology) and segment as the back-end web application servers. It is best to deploy connector hosts after you have completed a discovery of applications.

* **Network access settings**: Azure AD Application Proxy connectors [attempt to connect to Azure via HTTPS (TCP Port 443) or HTTP (TCP Port 80)](application-proxy-add-on-premises-application.md). 

   * Terminating connector TLS traffic is not supported and will prevent connectors from establishing a secure channel with their respective Azure App Proxy endpoints.

   * Avoid all forms of inline inspection on outbound TLS communications between connectors and Azure. Internal inspection between a connector and backend applications is possible, but could degrade the user experience, and as such, is not recommended.

   * Load balancing of the Proxy connectors themselves is also not supported, or even necessary.

### Important considerations before configuring Azure AD Application Proxy

The following core requirements must be met in order to configure and implement Azure AD Application Proxy.

*  **Azure onboarding**: Prior to deploying application proxy, user identities must be synchronized from an on-premises directory or created directly within your Azure AD tenants. This allows Azure AD to pre-authenticate users before granting them access to App Proxy published applications and to have the necessary user identifier information to perform single sign-on (SSO).

* **Public certificate**: If you are using custom domain names, you must procure a public certificate issued by a non-Microsoft trusted certificate authority. Depending on your organizational requirements, this can take some time and we recommend beginning the process as early as possible. Azure Application Proxy supports standard, [wildcard](application-proxy-wildcard.md), or SAN-based certificates.

* **Domain requirements**: Single sign-on to your published applications using Kerberos Constrained Delegation (KCD) requires that a connector host is domain-joined to the same AD domain as the applications being publishing. For detailed information on the topic, see [KCD for single sign-on](application-proxy-configure-single-sign-on-with-kcd.md) with Application Proxy. The connector service has been designed to run in the context of the local system and should not be configured to use a custom identity.

* **DNS records for URLs**

   * A prerequisite to using custom domains in Application Proxy is to create a CNAME record in public DNS, allowing clients to resolve the custom defined external URL to the pre-defined Application Proxy address. Failing to create a CNAME record for an application that uses a custom domain will prevent remote users from connecting to the application. Steps required to add CNAME records can vary from DNS provider to provider, so learn how to [manage DNS records and record sets by using the Azure portal](https://docs.microsoft.com/azure/dns/dns-operations-recordsets-portal).

   * Similarly, connector hosts must be able to resolve the internal URL of applications being published.

* **Administrative rights and roles**

   * **Connector installation** requires local admin rights of the Windows server that it is being installed on, plus a minimum of an Application Admin role to authenticate and register the connector instance to your Azure AD tenant. A role elevation may be required to obtain Application Administrator rights through [Privileged Identity Manager](https://docs.microsoft.com/azure/active-directory/privileged-identity-management/pim-configure) (PIM), so make sure your account is eligible. 

   * **Global administrative permission** are only required to enable the Application Proxy service and register connectors, but general publishing and administration of applications must be performed through either one of two new RBAC roles that eligible users can request through Privileged Identity Manager:

   * Application Administrator: In this role, you can manage all applications in the directory including registrations, SSO settings, user and group assignments and licensing, Application Proxy settings, and consent. It does not grant the ability to manage conditional access.

   * Cloud Application Administrator: This role grants all the abilities of the Application Administrator, except that it does not allow management of Application Proxy settings.

* **Licensing**: Application Proxy is available through the Azure AD Basic subscription. Refer to the [Azure Active Directory Pricing page](https://azure.microsoft.com/pricing/details/active-directory/) for a full list of licensing options and features. 

 

### Application Discovery

Compile an inventory of all internal applications that are in scope for being published via Application Proxy by collecting the following information: 

| Service Type| For example: SharePoint, SAP, CRM, Custom Web Application, API |
| - | - |
| Application platform| For example: Windows IIS, Apache on Linux, Tomcat, NGINX |
| Domain membership| Web server’s fully qualified domain name (FQDN). |
| Application location| Where the web server or farm is located in your infrastructure |
| Internal access| The exact URL used when accessing the application internally. <br> If a farm, what type of load balancing is in use? <br> Whether the application draws content from sources other than itself.<br> Determine if the application operates over WebSockets. |
| External access| The vendor solution that the application is already exposed to externally. <br> The URL you want to use for external access. If SharePoint, ensure Alternate Access Mappings are configured per [this guidance](https://docs.microsoft.com/SharePoint/administration/configure-alternate-access-mappings). If not, you will need to define external URLs. |
| Public certificate| If using a custom domain, procure a certificate with a corresponding subject anme. if a certificate exists note the seriel number and location from where it can be obtained. |
| Authentication type| The type of authentication supported by the application support such as Basic, Windows Integration Authentication, forms-based, header-based, and claims. <br>If the application is configured to run under a specific domain account, note the Fully Qualified Domain Name (FQDN) of the service account.<br> If SAML-based, the identifier and reply URLs. <br> If header-based, the vendor solution and specific requirement for handling authentication type. |
| Connector group name| The logical name for the group of connectors that will be designated to provide the conduit and SSO to this backend application. |
| Users/Groups access| The users or user groups that will be granted external access to the application. |
| Additional requirements| Note any additional remote access or security requirements that should be factored into publishing the application. |

You can download this [application inventory spreadsheet](https://aka.ms/appdiscovery) to inventory your apps.

### Define organizational requirements

The following are areas for which you should define your organization’s business requirements. Each area contains examples of requirements

 **Access**

* Domain and Azure AD users can access published applications securely with seamless single sign-on (SSO) when using any domain joined or Azure AD joined devices.

* Users with approved personal devices can securely access published applications provided they have enrolled in MFA and have registered the Microsoft Authenticator app on their mobile phone as an authentication method.

**Governance** 

* Administrators can define and monitor the lifecycle of user assignments to applications published through Application Proxy.

**Security**

* Only users assigned to applications via group membership or individually can access those applications.

**Performance**

* Accessing corporate applications from outside the internal network meets company performance standards.

**User Experience**

* Users are aware of how to access their applications by using familiar company URLs on any device platform.

**Auditing**
* Administrators are able to audit user access activity.


### Best practices for a pilot

Determine the amount of time and effort needed to fully commission a single application for remote access with Single sign-on (SSO) by running a pilot that takes all factors into account, such as its initial discovery, publishing, and general testing. Using a simple IIS-based web application that is already preconfigured for Integrated Windows Authentication (IWA) would help in establishing an indicative baseline, as this setup requires minimal effort to successfully pilot remote access and SSO. 

The following design elements should help facilitate an optimal pilot implementation directly in a production tenant.  

**Connector management**:  

* Connectors play a key role in providing the on-premises conduit to your applications. Using the **Default** connector group is adequate for initial pilot testing of published applications before commissioning them into production. Successfully tested applications can then be relocated to production connector groups.

**Application management**:

* Your workforce is most likely to remember an external URL is familiar and relevant. Avoid publishing your application using our pre-defined msappproxy.net or onmicrosoft.com suffixes. Instead, provide a familiar top-level verified domain, prefixed with a logical hostname such as *intranet.<customers_domain>.com*.

* Restrict visibility of the pilot application’s icon to a limited group of users by hiding its launch icon form the Azure MyApps portal. When ready for production you will be able to scope the app to its respective targeted audience, either in the same pre-production tenant, or by also publishing the  application in your production tenant.

**Single sign-on settings**:
Some SSO settings have specific dependencies that can take time to setup, so avoid change control delays by ensuring these are performed ahead of time. This includes domain joining connector hosts to perform SSO using Kerberos Constrained Delegation (KCD), but also taking care of other time-consuming activities. E.g. Setting up a PING Access instance, if needing header based SSO.

**SSL Between Connector Host and Target Application**: Security is paramount, so TLS between the connector host and target applications should always be used. Particularly if the web application is configured for forms-based authentication (FBA), as user credentials are then effectively transmitted in clear text.

**Implement incrementally and test each step**. 
Conduct basic functional testing after publishing an application to ensure that all user and business requirements are met by following the directions below:

1. Test and validate general access to the web application with pre-authentication disabled.
2. If successful enable pre-authentication and assign users and groups. Test and validate access.
3. With that done add the SSO method for your application and test again to validate access.
4. Apply Conditional Access and MFA policies as required. Test and validate access.

**Troubleshooting Tools**: When troubleshooting, always start by validating access to the published backend application from the browser on the connector host, and confirm that the application functions as expected. The simpler your setup, the easier it will be to determine root cause, so consider trying to reproduce issues with a minimal configuration such as using only a single connector and no SSO. In some cases, web debugging tools such as Telerik’s Fiddler can prove indispensable to troubleshoot access or content issues in applications being accessed through a proxy. Fiddler can also act as a proxy to help trace and debug traffic for mobile platforms such as iOS and Android, and pretty much anything that can be configured to route via a proxy. See the [troubleshooting guide](/application-proxy-troubleshoot.md) for more information.

## Implement Your Solution

### Deploy Application Proxy

The steps to deploy your Application Proxy are covered in this [tutorial for adding an on-premises application for remote access](application-proxy-add-on-premises-application.md). If the installation is not successful, select  **Troubleshoot Application Proxy**  in the portal or use the troubleshooting guide[ for Problems with installing the Application Proxy Agent Connector](application-proxy-connector-installation-problem.md).

### Publish applications via Application Proxy

Publishing applications assumes that you have already satisfied all the pre-requisites and that you have several connectors showing as registered and active in the Application Proxy page. 

In addition to the aforementioned portal experience, Azure AD Application Proxy can also be published via  [PowerShell](https://docs.microsoft.com/powershell/module/azuread/?view=azureadps-2.0-preview).

Below are some best practices to follow when publishing an application:

* **Use Connector Groups**: Assign a connector group that has been designated for publishing each respective application.

* **Set Backend Application Timeout**: This setting is useful in scenarios where the application might require more than 75 seconds to process a client transaction, for example when a client sends a query to a web application that acts as a front end to a database. The front end sends this query to its backend database server and waits for a response, but by the time it receives a response, the client side of the conversation times out. Setting this to Long provides 180 seconds for longer transactions to complete.

* **Use Appropriate Cookie Types**

   * **HTTP-Only Cookie**: Provides additional security by having Application Proxy include the HTTPOnly flag in set-cookie HTTP response headers, thereby helping to mitigate exploits such as cross-site scripting (XSS). Leave this set to No for clients/user agents that do require access to the session cookie. E.g. RDP/MTSC client connecting to a Remote Desktop Gateway published via App Proxy.

   * **Secure Cookie**: Enabling this restricts the issuance of the cookie to "secure" channels. So, when a cookie is set with the Secure attribute, the user agent (Client-side app) will only include the cookie in HTTP requests if the request is transmitted over a TLS secured channel. This helps mitigate the risk of a cookie being compromised over clear text channels, so should be enabled.

   * **Persistent Cookie**: Allows the Application Proxy session cookie to persist between browser closures by remaining valid until it either expires or is deleted. Used for scenarios where a rich application such as office may need to access a document within a published web application, without the user being re-prompted for authentication. Enable with caution however, as persistent cookies can ultimately leave a service at risk of unauthorized access, if not used in conjunction with other compensating controls. This setting should be avoided and only used for older applications that cannot share cookies between processes. It is preferred to update your application to handle sharing cookies between processes instead of using this setting.

   *  **Use Secure Cookie** : Enabling this restricts the issuance of the cookie to "secure" channels. So, when a cookie is set with the Secure attribute, the user agent (Client-side app) will only include the cookie in HTTP requests if the request is transmitted over a TLS secured channel. This helps mitigate the risk of a cookie being compromised over clear text channels.

* **Translate URLs in Headers**: Unless your application requires the original host header in the client request, leave this value set to Yes. You would enable this for scenarios where internal DNS cannot be configured to match the organization’s public namespace(a.k.a Split DNS), so the alternative is to have the connector use the FQDN in the internal URL for routing of the actual traffic, and the FQDN in the external URL, as the host-header. In most cases this should allow the application to function as normal, when accessed remotely, but your users lose the benefits of having a matching inside & outside URL.

* **Translate URLs in Application Body**: Turn on Application Body link translation for an app when you want the links from that app to be translated in responses back to the client. If enabled, this function provides a best effort attempt at translating all internal links that App Proxy finds in HTML and CSS responses being returned to clients. It is particularly useful when publishing apps that are known to contain either hardcoded absolute or NetBIOS shortname links in the content, or apps with content that links to other on-premises applications. 

For scenarios where a published app links to other published apps, link translation is enabled for each application, so that you have control over the user experience at the per-app level.

For example, suppose that you have three applications published through Application Proxy that all link to each other: Benefits, Expenses, and Travel, plus a fourth app, Feedback, that isn't published through Application Proxy.

![Picture 1](media/App-proxy-deployment-plan/link-translation.png)

When you enable link translation for the Benefits app, the links to Expenses and Travel are redirected to the external URLs for those apps, so that users accessing the applications from outside the corporate network can access them. Links from Expenses and Travel back to Benefits don't work because link translation has not been enabled for those two apps. The link to Feedback is not redirected because there is no external URL, so users using the benefits app will not be able to access the feedback app from outside the corporate network. See detailed information on [link translation and other redirect options](application-proxy-configure-hard-coded-link-translation.md).

### Access your application

Several options exist for managing access to App Proxy published resources, so choose the most appropriate for your given scenario and scalability needs.. Common approaches include: utilizing on-premises groups that are being synced via Azure AD Connect, creating Dynamic Groups in Azure AD based on user attributes, using self-service groups that are managed by a resource owner, or a combination of all of these. Please see the linked resources for the benefits of each.

The most straight forward way of assigning users access to an application is going into the **Users and Groups** options from the left-hand pane of your published application and directly assigning groups or individuals.

![Picture 24](media/App-proxy-deployment-plan/add-user.png)

Another option is to allow users to self-service access to your application by assigning a group that they are not currently a member of and configuring the self-serve options.

![Picture 25](media/App-proxy-deployment-plan/allow-access.png)

If enabled, users will then be able to log into the MyApps portal and request access, whereby they will either be auto approved and added to the already permitted self-service group, or need approving by a designated approver(s).

Note that guest users can also be [invited to access internal applications published via Application Proxy through Azure AD B2B](https://docs.microsoft.com/azure/active-directory/b2b/add-users-information-worker).

For on premises applications that are normally accessible anonymously, requiring no authentication, you may prefer to disable the option located in the application’s **Properties** blade.

![Picture 26](media/App-proxy-deployment-plan/assignment-required.png)


Leaving this option set to No allows users to access the on-premises application via Azure AD App Proxy without permissions, so use with caution.

Once your application is published, it should be accessible by typing its external URL directly in a browser or by locating its icon once logged into [https://myapps.microsoft.com](https://myapps.microsoft.com/).

#

### Enable pre-authentication

Verify that your application is accessible through the Application Proxy. The expected behavior is that Azure AD will challenge you for authentication and then the backend application should also do the same if it requires authentication.
1. Navigate to Azure Active Directory > Enterprise applications > All applications and choose the app you want to manage.

2. Select Application Proxy.

3. In the Pre-Authentication field, use the dropdown list to select Azure Active Directory, and hit Save

Note that changing the pre-authentication from Passthrough to Azure Active Directory also configures the external URL with HTTPS, so any application initially configured for HTTP will now be secured with HTTPS.

### Single Sign-On

SSO provides the best possible user experience and security because users only need to sign in once when accessing Azure Active Directory. Once authenticated, SSO is handled by the Application Proxy connector authentication to the on-premises application on behalf of the user. The backend application processes the login as if it were the user themselves. 

Performing SSO is only possible if Azure AD recognizes the user requesting access to a resource, so your application must be configured to pre-authenticate users upon access. 

The Passthrough option allows users to access the published application without ever having to authenticate to Azure AD, so Azure AD could not perform “on behalf of” SSO to an application without a user identity to send down to the connector.

Read [Single sign-on to applications in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on) to help you choose the most appropriate SSO method when configuring your applications.

###  Working with other types of applications

Azure AD Application Proxy can also publish other types of applications that have been developed to leverage our Azure AD Authentication Library ([ADAL](https://docs.microsoft.com/azure/active-directory/develop/active-directory-authentication-libraries)) or Microsoft Authentication Library ([MSAL](https://azure.microsoft.com/blog/start-writing-applications-today-with-the-new-microsoft-authentication-sdks/)). It supports native client apps by consuming Azure AD issued tokens that are received in the header information of client request to perform pre-authentication on behalf of the users. 

Read [publishing native and mobile client apps](https://docs.microsoft.com/azure/active-directory/active-directory-application-proxy-native-client) and [claims-based applications](https://docs.microsoft.com/azure/active-directory/active-directory-application-proxy-claims-aware-apps) to learn about available configurations of Application Proxy.

### Use Conditional Access to strengthen security

Business security requires a holistic and innovative approach that can protect from and respond to complex threats \ on-premises, as well as in the cloud. Attackers most often gain corporate network access through weak, default, or stolen user credentials, so Microsoft identity-driven security shuts down credential theft by managing and protecting both privileged and non-privileged identities. 

The following capabilities can be leveraged to support Azure AD Application Proxy:

* User and location-based conditional access: Keep sensitive data protected by limiting user access based on geolocation or an IP address with [location-based conditional access policies](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-locations).

* Device-based conditional access: Ensure only enrolled, approved, and compliant devices can access corporate data with [device-based conditional access](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-policy-connected-applications).

* Application-based conditional access: Work doesn't have to stop when a user is not on the corporate network. [Secure access to corporate cloud and on-premises apps](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-mam) and maintain control with conditional access.

* Risk-based conditional access: Protect your data from malicious hackers with a [risk-based conditional access policy](https://www.microsoft.com/cloud-platform/conditional-access) that can be applied to all apps and all users, whether on-premises or in the cloud.

* Azure AD Application Panel: With your Application Proxy service deployed, and applications securely published, offer your users a simple hub to discover and access all their applications. Enable them to be more productive with self-service capabilities, such as the ability to request access to new apps and groups or manage access to these resources on behalf of others, through the [Access Panel](https://aka.ms/AccessPanelDPDownload).

 

## Manage your implementation

### Required roles

Microsoft advocates the principle of granting the least possible privledge to perform needed tasks with Azure active Directory. [Review the different Azure roles that are available](https://docs.microsoft.com/azure/active-directory/active-directory-assign-admin-roles-azure-portal) and choose the right one to address the needs of each persona. Some roles may need to be applied temporarily and removed after the deployment has been completed.

| Business Role| Business tasks| AAD Roles |
| - | -| -|
| Help Desk Admin| Typically limited to qualifying end user reported issues and performing limited tasks such as changing users’ passwords, invalidating refresh tokens, and monitoring service health. | Helpdesk Administrator |
| Identity Admin| Read Azure Active Directory sign-in reports and audit logs to debug App Proxy related issues.| Security reader |
| Application owner| Create and manage all aspects of enterprise applications, application registrations, and application proxy settings.| Application Admin |
| Infrastructure Admin| Certificate Rollover Owner| Application Admin |


 

Use [Privileged Identity Management](https://docs.microsoft.com/azure/active-directory/active-directory-privileged-identity-management-configure) to manage your roles to provide additional auditing, control, and access review for users with directory permissions.

Choose a scaled approach when managing access to resources. Common approaches include: utilizing on-premises groups by syncing via Azure AD Connect, [creating Dynamic Groups in Azure AD based on user attributes](https://docs.microsoft.com/azure/active-directory/active-directory-groups-dynamic-membership-azure-portal), or creating [self-service groups](https://docs.microsoft.com/azure/active-directory/active-directory-accessmanagement-self-service-group-management) in Azure AD managed by a resource owner.

### Reporting and monitoring

Azure AD can provide additional insights into your organization’s user provisioning usage and operational health through audit logs and reports. 

Application audit logs

 These logs provide insight into logins to applications configured with Application Proxy, as well as information about the device and the user accessing the application. They are located in the Azure management portal and in Audit API.

Windows event logs and performance counters

Connectors have both admin and session logs. The admin logs include key events and their errors. The session logs include all the transactions and their processing details. Logs and counters are located in Windows Event Logs, and follow this [tutorial to configure event log data sources in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/data-sources-windows-events).

### Troubleshooting Guide & Steps

Learn more about common issues and how to resolve them with our guide to [troubleshooting](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-troubleshoot) error messages. These articles cover common scenarios, but you can also create your own troubleshooting guides for your support organization. 

* [Problem displaying app page](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-page-appearance-broken-problem)

* [Application load is too long](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-page-load-speed-problem)

* [Links on application page not working](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-page-links-broken-problem)

* [What ports to open for my app](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-connectivity-ports-how-to)

* [No working connector in a connector group for my app](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-connectivity-no-working-connector)

* [Configure in admin portal](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-config-how-to)

* [Configure single sign-on to my app](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-config-sso-how-to)

* [Problem creating an app in admin portal](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-config-problem)

* [Configure Kerberos Constrained Delegation](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-back-end-kerberos-constrained-delegation-how-to)

* [Configure with PingAccess](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-back-end-ping-access-how-to)

* [Can't Access this Corporate Application error](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-sign-in-bad-gateway-timeout-error)

* [Problem installing the Application Proxy Agent Connector](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-connector-installation-problem)

* [Sign-in problem](https://docs.microsoft.com/azure/active-directory/manage-apps/application-sign-in-problem-on-premises-application-proxy)

 

 

 
