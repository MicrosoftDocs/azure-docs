---
title: Plan a Microsoft Entra application proxy Deployment
description: An end-to-end guide for planning the deployment of Application proxy within your organization
services: active-directory
author: kenwith
manager: amycolannino
ms.service: active-directory
ms.subservice: app-proxy
ms.workload: identity
ms.topic: conceptual
ms.date: 09/14/2023
ms.author: kenwith
---

# Plan a Microsoft Entra application proxy deployment

Microsoft Entra application proxy is a secure and cost-effective remote access solution for on-premises applications. It provides an immediate transition path for “Cloud First” organizations to manage access to legacy on-premises applications that aren’t yet capable of using modern protocols. For additional introductory information, see [What is Application Proxy](./application-proxy.md).

Application Proxy is recommended for giving remote users access to internal resources. Application Proxy replaces the need for a VPN or reverse proxy for these remote access use cases. It is not intended for users who are on the corporate network. These users who use Application Proxy for intranet access may experience undesirable performance issues.

This article includes the resources you need to plan, operate, and manage Microsoft Entra application proxy.

## Plan your implementation

The following section provides a broad view of the key planning elements that will set you up for an efficient deployment experience.

### Prerequisites

You need to meet the following prerequisites before beginning your implementation. You can see more information on setting up your environment, including these prerequisites, in this [tutorial](application-proxy-add-on-premises-application.md).

* **Connectors**: Connectors are lightweight agents that you can deploy onto:
   * Physical hardware on-premises
   * A VM hosted within any hypervisor solution
   * A VM hosted in Azure to enable outbound connection to the Application Proxy service.

* See [Understand Microsoft Entra application proxy Connectors](application-proxy-connectors.md) for a more detailed overview.

     * Connector machines must [be enabled for TLS 1.2](application-proxy-add-on-premises-application.md) before installing the connectors.

     * If possible, deploy connectors in the [same network](application-proxy-network-topology.md) and segment as the back-end web application servers. It's best to deploy connectors after you complete a discovery of applications.
     * We recommend that each connector group has at least two connectors to provide high availability and scale. Having three connectors is optimal in case you may need to service a machine at any point. Review the [connector capacity table](./application-proxy-connectors.md#capacity-planning) to help with deciding what type of machine to install connectors on. The larger the machine the more buffer and performant the connector will be.

* **Network access settings**: Microsoft Entra application proxy connectors [connect to Azure via HTTPS (TCP Port 443) and HTTP (TCP Port 80)](application-proxy-add-on-premises-application.md).

   * Terminating connector TLS traffic isn't supported and will prevent connectors from establishing a secure channel with their respective Azure App Proxy endpoints.

   * Avoid all forms of inline inspection on outbound TLS communications between connectors and Azure. Internal inspection between a connector and backend applications is possible, but could degrade the user experience, and as such, isn't recommended.

   * Load balancing of the connectors themselves is also not supported, or even necessary.

<a name='important-considerations-before-configuring-azure-ad-application-proxy'></a>

### Important considerations before configuring Microsoft Entra application proxy

The following core requirements must be met in order to configure and implement Microsoft Entra application proxy.

*  **Azure onboarding**: Before deploying application proxy, user identities must be synchronized from an on-premises directory or created directly within your Microsoft Entra tenants. Identity synchronization allows Microsoft Entra ID to pre-authenticate users before granting them access to App Proxy published applications and to have the necessary user identifier information to perform single sign-on (SSO).

* **Conditional Access requirements**: We do not recommend using Application Proxy for intranet access because this adds latency that will impact users. We recommend using Application Proxy with pre-authentication and Conditional Access policies for remote access from the internet.  An  approach to provide Conditional Access for intranet use is to modernize applications so they can directly authenticate with Microsoft Entra ID. Refer to [Resources for migrating applications to Microsoft Entra ID](../manage-apps/migration-resources.md) for more information.

* **Service limits**: To protect against overconsumption of resources by individual tenants there are throttling limits set per application and tenant. To see these limits refer to [Microsoft Entra service limits and restrictions](../enterprise-users/directory-service-limits-restrictions.md). These throttling limits are based on a benchmark far above typical usage volume and provides ample buffer for a majority of deployments.

* **Public certificate**: If you are using custom domain names, you must procure a TLS/SSL certificate. Depending on your organizational requirements, getting a certificate can take some time and we recommend beginning the process as early as possible. Azure Application Proxy supports standard, [wildcard](application-proxy-wildcard.md), or SAN-based certificates. For more details see [Configure custom domains with Microsoft Entra application proxy](application-proxy-configure-custom-domain.md).

* **Domain requirements**: Single sign-on to your published applications using Kerberos Constrained Delegation (KCD) requires that the server running the Connector and the server running the app are domain joined and part of the same domain or trusting domains.
For detailed information on the topic, see [KCD for single sign-on](application-proxy-configure-single-sign-on-with-kcd.md) with Application Proxy. The connector service runs in the context of the local system and should not be configured to use a custom identity.

* **DNS records for URLs**

   * Before using custom domains in Application Proxy you must create a CNAME record in public DNS, allowing clients to resolve the custom defined external URL to the pre-defined Application Proxy address. Failing to create a CNAME record for an application that uses a custom domain will prevent remote users from connecting to the application. Steps required to add CNAME records can vary from DNS provider to provider, so learn how to [manage DNS records and record sets by using the Microsoft Entra admin center](/azure/dns/dns-operations-recordsets-portal).

   * Similarly, connector hosts must be able to resolve the internal URL of applications being published.

* **Administrative rights and roles**

   * **Connector installation** requires local admin rights to the Windows server that it's being installed on. It also requires a minimum of an *Application Administrator* role to authenticate and register the connector instance to your Microsoft Entra tenant.

   * **Application publishing and administration** require the *Application Administrator* role. Application Administrators can manage all applications in the directory including registrations, SSO settings, user and group assignments and licensing, Application Proxy settings, and consent. It doesn't grant the ability to manage Conditional Access. The *Cloud Application Administrator* role has all the abilities of the Application Administrator, except that it does not allow management of Application Proxy settings.

* **Licensing**: Application Proxy is available through a Microsoft Entra ID P1 or P2 subscription. Refer to the [Microsoft Entra pricing page](https://www.microsoft.com/security/business/identity-access-management/azure-ad-pricing) for a full list of licensing options and features.

### Application Discovery

Compile an inventory of all in-scope applications that are being published via Application Proxy by collecting the following information:

| Information Type| Information to collect |
|---|---|
| Service Type| For example: SharePoint, SAP, CRM, Custom Web Application, API |
| Application platform | For example: Windows IIS, Apache on Linux, Tomcat, NGINX |
| Domain membership| Web server’s fully qualified domain name (FQDN) |
| Application location | Where the web server or farm is located in your infrastructure |
| Internal access | The exact URL used when accessing the application internally. <br> If a farm, what type of load balancing is in use? <br> Whether the application draws content from sources other than itself.<br> Determine if the application operates over WebSockets. |
| External access | The vendor solution that the application may already be exposed throught, externally. <br> The URL you want to use for external access. If SharePoint, ensure Alternate Access Mappings are configured per [this guidance](/SharePoint/administration/configure-alternate-access-mappings). If not, you will need to define external URLs. |
| Public certificate | If using a custom domain, procure a certificate with a corresponding subject name. if a certificate exists note the serial number and location from where it can be obtained. |
| Authentication type| The type of authentication supported by the application support such as Basic, Windows Integration Authentication, forms-based, header-based, and claims. <br>If the application is configured to run under a specific domain account, note the Fully Qualified Domain Name (FQDN) of the service account.<br> If SAML-based, the identifier and reply URLs. <br> If header-based, the vendor solution and specific requirement for handling authentication type. |
| Connector group name | The logical name for the group of connectors that will be designated to provide the conduit and SSO to this backend application. |
| Users/Groups access | The users or user groups that will be granted external access to the application. |
| Additional requirements | Note any additional remote access or security requirements that should be factored into publishing the application. |

You can download this [application inventory spreadsheet](https://aka.ms/appdiscovery) to inventory your apps.

### Define organizational requirements

The following are areas for which you should define your organization’s business requirements. Each area contains examples of requirements

 **Access**

* Remote users with domain-joined or Microsoft Entra joined devices can access published applications securely with seamless single sign-on (SSO).

* Remote users with approved personal devices can securely access published applications provided they are enrolled in MFA and have registered the Microsoft Authenticator app on their mobile phone as an authentication method.

**Governance**

* Administrators can define and monitor the lifecycle of user assignments to applications published through Application Proxy.

**Security**

* Only users assigned to applications via group membership or individually can access those applications.

**Performance**

* There is no degradation of application performance compared to accessing application from the internal network.

**User Experience**

* Users are aware of how to access their applications by using familiar company URLs on any device platform.

**Auditing**
* Administrators are able to audit user access activity.


### Best practices for a pilot

Determine the amount of time and effort needed to fully commission a single application for remote access with Single sign-on (SSO). Do so by running a pilot that considers its initial discovery, publishing, and general testing. Using a simple IIS-based web application that is already preconfigured for integrated Windows authentication (IWA) would help establish a baseline, as this setup requires minimal effort to successfully pilot remote access and SSO.

The following design elements should increase the success of your pilot implementation directly in a production tenant.

**Connector management**:

* Connectors play a key role in providing the on-premises conduit to your applications. Using the **Default** connector group is adequate for initial pilot testing of published applications before commissioning them into production. Successfully tested applications can then be moved to production connector groups.

**Application management**:

* Your workforce is most likely to remember an external URL is familiar and relevant. Avoid publishing your application using our pre-defined msappproxy.net or onmicrosoft.com suffixes. Instead, provide a familiar top-level verified domain, prefixed with a logical hostname such as *intranet.<customers_domain>.com*.

* Restrict visibility of the pilot application’s icon to a pilot group by hiding its launch icon form the Azure MyApps portal. When ready for production you can scope the app to its respective targeted audience, either in the same pre-production tenant, or by also publishing the  application in your production tenant.

**Single sign-on settings**:
Some SSO settings have specific dependencies that can take time to set up, so avoid change control delays by ensuring dependencies are addressed ahead of time. This includes domain joining connector hosts to perform SSO using Kerberos Constrained Delegation (KCD) and taking care of other time-consuming activities.

**TLS Between Connector Host and Target Application**: Security is paramount, so TLS between the connector host and target applications should always be used. Particularly if the web application is configured for forms-based authentication (FBA), as user credentials are then effectively transmitted in clear text.

**Implement incrementally and test each step**.
Conduct basic functional testing after publishing an application to ensure that all user and business requirements are met by following the directions below:

1. Test and validate general access to the web application with pre-authentication disabled.
2. If successful enable pre-authentication and assign users and groups. Test and validate access.
3. Then add the SSO method for your application and test again to validate access.
4. Apply Conditional Access and MFA policies as required. Test and validate access.

**Troubleshooting Tools**: When troubleshooting, always start by validating access to the published application from the browser on the connector host, and confirm that the application functions as expected. The simpler your setup, the easier to determine root cause, so consider trying to reproduce issues with a minimal configuration such as using only a single connector and no SSO. In some cases, web debugging tools such as Telerik’s Fiddler can prove indispensable to troubleshoot access or content issues in applications accessed through a proxy. Fiddler can also act as a proxy to help trace and debug traffic for mobile platforms such as iOS and Android, and virtually anything that can be configured to route via a proxy. See the [troubleshooting guide](application-proxy-troubleshoot.md) for more information.

## Implement Your Solution

### Deploy Application Proxy

The steps to deploy your Application Proxy are covered in this [tutorial for adding an on-premises application for remote access](application-proxy-add-on-premises-application.md). If the installation isn't successful, select  **Troubleshoot Application Proxy**  in the portal or use the troubleshooting guide [for Problems with installing the Application Proxy Agent Connector](application-proxy-connector-installation-problem.md).

### Publish applications via Application Proxy

Publishing applications assumes that you have satisfied all the pre-requisites and that you have several connectors showing as registered and active in the Application Proxy page.

You can also publish applications by using [PowerShell](/powershell/module/azuread/?view=azureadps-2.0-preview&preserve-view=true).

Below are some best practices to follow when publishing an application:

* **Use Connector Groups**: Assign a connector group that has been designated for publishing each respective application. We recommend that each connector group has at least two connectors to provide high availability and scale. Having three connectors is optimal in case you may need to service a machine at any point. Additionally, see [Publish applications on separate networks and locations using connector groups](application-proxy-connector-groups.md) to see how you can also use connector groups to segment your connectors by network or location.

* **Set Backend Application Timeout**: This setting is useful in scenarios where the application might require more than 75 seconds to process a client transaction. For example when a client sends a query to a web application that acts as a front end to a database. The front end sends this query to its back-end database server and waits for a response, but by the time it receives a response, the client side of the conversation times out. Setting the timeout to Long provides 180 seconds for longer transactions to complete.

* **Use Appropriate Cookie Types**

   * **HTTP-Only Cookie**: Provides additional security by having Application Proxy include the HTTPOnly flag in set-cookie HTTP response headers. This setting helps to mitigate exploits such as cross-site scripting (XSS). Leave this set to No for clients/user agents that do require access to the session cookie. For example, RDP/MTSC client connecting to a Remote Desktop Gateway published via App Proxy.

   * **Secure Cookie**: When a cookie is set with the Secure attribute, the user agent (Client-side app) will only include the cookie in HTTP requests if the request is transmitted over a TLS secured channel. This helps mitigate the risk of a cookie being compromised over clear text channels, so should be enabled.

   * **Persistent Cookie**: Allows the Application Proxy session cookie to persist between browser closures by remaining valid until it either expires or is deleted. Used for scenarios where a rich application such as office accesses a document within a published web application, without the user being re-prompted for authentication. Enable with caution however, as persistent cookies can ultimately leave a service at risk of unauthorized access, if not used in conjunction with other compensating controls. This setting should only be used for older applications that can't share cookies between processes. It's better to update your application to handle sharing cookies between processes instead of using this setting.

* **Translate URLs in Headers**: You enable this for scenarios where internal DNS cannot be configured to match the organization’s public namespace(a.k.a Split DNS). Unless your application requires the original host header in the client request, leave this value set to Yes. The alternative is to have the connector use the FQDN in the internal URL for routing of the actual traffic, and the FQDN in the external URL, as the host-header. In most cases this alternative should allow the application to function as normal, when accessed remotely, but your users lose the benefits of having a matching inside & outside URL.

* **Translate URLs in Application Body**: Turn on Application Body link translation for an app when you want the links from that app to be translated in responses back to the client. If enabled, this function provides a best effort attempt at translating all internal links that App Proxy finds in HTML and CSS responses being returned to clients. It is useful when publishing apps that contain either hard-coded absolute or NetBIOS shortname links in the content, or apps with content that links to other on-premises applications.

For scenarios where a published app links to other published apps, enable link translation for each application so that you have control over the user experience at the per-app level.

For example, suppose that you have three applications published through Application Proxy that all link to each other: Benefits, Expenses, and Travel, plus a fourth app, Feedback, that isn't published through Application Proxy.

![Picture 1](media/App-proxy-deployment-plan/link-translation.png)

When you enable link translation for the Benefits app, the links to Expenses and Travel are redirected to the external URLs for those apps, so that users accessing the applications from outside the corporate network can access them. Links from Expenses and Travel back to Benefits don't work because link translation hasn't been enabled for those two apps. The link to Feedback isn't redirected because there's no external URL, so users using the Benefits app won't be able to access the feedback app from outside the corporate network. See detailed information on [link translation and other redirect options](application-proxy-configure-hard-coded-link-translation.md).

### Access your application

Several options exist for managing access to App Proxy published resources, so choose the most appropriate for your given scenario and scalability needs. Common approaches include: using on-premises groups that are being synced via Microsoft Entra Connect, creating Dynamic Groups in Microsoft Entra ID based on user attributes, using self-service groups that are managed by a resource owner, or a combination of all of these. See the linked resources for the benefits of each.

The most straight forward way of assigning users access to an application is going into the **Users and Groups** options from the left-hand pane of your published application and directly assigning groups or individuals.

![Picture 24](media/App-proxy-deployment-plan/add-user.png)

You can also allow users to self-service access to your application by assigning a group that they aren't currently a member of and configuring the self-serve options.

![Picture 25](media/App-proxy-deployment-plan/allow-access.png)

If enabled, users will then be able to log into the MyApps portal and request access, and either be auto approved and added to the already permitted self-service group, or need approval from a designated approver.

Guest users can also be [invited to access internal applications published via Application Proxy through Microsoft Entra B2B](../external-identities/add-users-information-worker.md).

For on premises applications that are normally accessible anonymously, requiring no authentication, you may prefer to disable the option located in the application’s **Properties**.

![Picture 26](media/App-proxy-deployment-plan/assignment-required.png)


Leaving this option set to No allows users to access the on-premises application via Microsoft Entra application proxy without permissions, so use with caution.

Once your application is published, it should be accessible by typing its external URL in a browser or by its icon at [https://myapps.microsoft.com](https://myapps.microsoft.com/).

### Enable pre-authentication

Verify that your application is accessible through Application Proxy accessing it via the external URL.
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **All applications** and choose the app you want to manage.


2. Select **Application Proxy**.

3. In the **Pre-Authentication** field, use the dropdown list to select **Microsoft Entra ID**, and select **Save**.

With pre-authentication enabled, Microsoft Entra ID will challenge users first for authentication and if single sign-on is configured then the back-end application will also verify the user before access to the application is granted. Changing the pre-authentication mode from Passthrough to Microsoft Entra ID also configures the external URL with HTTPS, so any application initially configured for HTTP will now be secured with HTTPS.

### Enable Single Sign-On

SSO provides the best possible user experience and security because users only need to sign in once when accessing Microsoft Entra ID. Once a user has pre-authenticated, SSO is performed by the Application Proxy connector authenticating to the on-premises application, on behalf of the user. The backend application processes the login as if it were the user themselves.

Choosing the **Passthrough** option allows users to access the published application without ever having to authenticate to Microsoft Entra ID.

Performing SSO is only possible if Microsoft Entra ID can identify the user requesting access to a resource, so your application must be configured to pre-authenticate users with Microsoft Entra ID upon access for SSO to function, otherwise the SSO options will be disabled.

Read [Single sign-on to applications in Microsoft Entra ID](../manage-apps/what-is-single-sign-on.md) to help you choose the most appropriate SSO method when configuring your applications.

###  Working with other types of applications

Microsoft Entra application proxy can also support applications that have been developed to use the [Microsoft Authentication Library (MSAL)](../develop/v2-overview.md). It supports native client apps by consuming Microsoft Entra ID issued tokens received in the header information of client request to perform pre-authentication on behalf of the users.

Read [publishing native and mobile client apps](./application-proxy-configure-native-client-application.md) and [claims-based applications](./application-proxy-configure-for-claims-aware-applications.md) to learn about available configurations of Application Proxy.

### Use Conditional Access to strengthen security

Application security requires an advanced set of security capabilities that can protect from and respond to complex threats on-premises and in the cloud. Attackers most often gain corporate network access through weak, default, or stolen user credentials.  Microsoft identity-driven security reduces use of stolen credentials by managing and protecting both privileged and non-privileged identities.

The following capabilities can be used to support Microsoft Entra application proxy:

* User and location-based Conditional Access: Keep sensitive data protected by limiting user access based on geo-location or an IP address with [location-based Conditional Access policies](../conditional-access/location-condition.md).

* Device-based Conditional Access: Ensure only enrolled, approved, and compliant devices can access corporate data with [device-based Conditional Access](../conditional-access/concept-conditional-access-grant.md).

* Application-based Conditional Access: Work doesn't have to stop when a user isn't on the corporate network. [Secure access to corporate cloud and on-premises apps](../conditional-access/howto-policy-approved-app-or-app-protection.md) and maintain control with Conditional Access.

* Risk-based Conditional Access: Protect your data from malicious hackers with a [risk-based Conditional Access policy](https://www.microsoft.com/cloud-platform/conditional-access) that can be applied to all apps and all users, whether on-premises or in the cloud.

* Microsoft Entra My Apps: With your Application Proxy service deployed, and applications securely published, offer your users a simple hub to discover and access all their applications. Increase productivity with self-service capabilities, such as the ability to request access to new apps and groups or manage access to these resources on behalf of others, through [My Apps](https://aka.ms/AccessPanelDPDownload).

## Manage your implementation

### Required roles

Microsoft advocates the principle of granting the least possible privilege to perform needed tasks with Microsoft Entra ID. [Review the different Azure roles that are available](../roles/permissions-reference.md) and choose the right one to address the needs of each persona. Some roles may need to be applied temporarily and removed after the deployment is completed.

| Business role| Business tasks| Microsoft Entra roles |
|---|---|---|
| Help desk admin | Typically limited to qualifying end user reported issues and performing limited tasks such as changing users’ passwords, invalidating refresh tokens, and monitoring service health. | Helpdesk Administrator |
| Identity admin| Read Microsoft Entra sign-in reports and audit logs to debug App Proxy related issues.| Security reader |
| Application owner| Create and manage all aspects of enterprise applications, application registrations, and application proxy settings.| Application Admin |
| Infrastructure admin | Certificate Rollover Owner | Application Admin |

Minimizing the number of people who have access to secure information or resources will help in reducing the chance of a malicious actor obtaining unauthorized access, or an authorized user inadvertently impacting a sensitive resource.

However, users still need to carry out day to day privileged operations, so enforcing just-in-time (JIT) based [Privileged Identity Management](../privileged-identity-management/pim-configure.md) policies to provide on-demand privileged access to Azure resources and Microsoft Entra ID is our recommended approach towards effectively managing administrative access and auditing.

### Reporting and monitoring

Microsoft Entra ID provides additional insights into your organization’s application usage and operational health through [audit logs and reports](../reports-monitoring/concept-provisioning-logs.md?context=azure/active-directory/manage-apps/context/manage-apps-context). Application Proxy also makes it very easy to monitor connectors from the Microsoft Entra admin center and Windows Event Logs.

#### Application audit logs

These logs provide detailed information about logins to applications configured with Application Proxy and the device and the user accessing the application. [Audit logs](../reports-monitoring/concept-provisioning-logs.md?context=azure/active-directory/manage-apps/context/manage-apps-context) are located in the Microsoft Entra admin center and in [Audit API](/graph/api/resources/directoryaudit) for export. Additionally, [usage and insights reports](../reports-monitoring/concept-usage-insights-report.md?context=azure/active-directory/manage-apps/context/manage-apps-context) are also available for your application.

#### Application Proxy Connector monitoring

The connectors and the service take care of all the high availability tasks. You can monitor the status of your connectors from the Application Proxy page in the Microsoft Entra admin center. For more information about connector maintenance see [Understand Microsoft Entra application proxy Connectors](./application-proxy-connectors.md#maintenance).

![Example: Microsoft Entra application proxy connectors](./media/application-proxy-connectors/app-proxy-connectors.png)

#### Windows event logs and performance counters

Connectors have both admin and session logs. The admin logs include key events and their errors. The session logs include all the transactions and their processing details. Logs and counters are located in Windows Event Logs for more information see [Understand Microsoft Entra application proxy Connectors](./application-proxy-connectors.md#under-the-hood). Follow this [tutorial to configure event log data sources in Azure Monitor](/azure/azure-monitor/agents/data-sources-windows-events).

### Troubleshooting guide and steps

Learn more about common issues and how to resolve them with our guide to [troubleshooting](application-proxy-troubleshoot.md) error messages.

The following articles cover common scenarios that can also be used to create troubleshooting guides for your support organization.

* [Problem displaying app page](application-proxy-page-appearance-broken-problem.md)
* [Application load is too long](application-proxy-page-load-speed-problem.md)
* [Links on application page not working](application-proxy-page-links-broken-problem.md)
* [What ports to open for my app](application-proxy-add-on-premises-application.md)
* [No working connector in a connector group for my app](application-proxy-connectivity-no-working-connector.md)
* [Configure in admin portal](application-proxy-config-how-to.md)
* [Configure single sign-on to my app](application-proxy-config-sso-how-to.md)
* [Problem creating an app in admin portal](application-proxy-config-problem.md)
* [Configure Kerberos Constrained Delegation](application-proxy-back-end-kerberos-constrained-delegation-how-to.md)
* [Configure with PingAccess](application-proxy-ping-access-publishing-guide.md)
* [Can't Access this Corporate Application error](application-proxy-sign-in-bad-gateway-timeout-error.md)
* [Problem installing the Application Proxy Agent Connector](application-proxy-connector-installation-problem.md)
* [Sign-in problem](application-sign-in-problem-on-premises-application-proxy.md)
