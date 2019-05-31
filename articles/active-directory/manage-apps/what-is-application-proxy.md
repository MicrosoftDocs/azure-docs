# Using Azure AD Application Proxy to publish on-premises apps for remote users

Azure Active Directory (Azure AD) offers many features and capabilities for protecting users, apps, and data in the cloud and on-premises. In particular, Azure AD Application Proxy is a feature that can be implemented by IT professionals who wish to publish on-premises web applications externally to remote users who need access to internal apps in a secure manner.

The ability to securely access internal apps from outside your network becomes even more critical due to new scenarios opened by the modern workplace such as BYOD (Bring Your Own Device) and mobile devices where IT professionals are challenged to meet two goals:

* Empower end users to be productive anytime and anywhere
* Protect corporate assets at all times

Many organizations believe they are in control and protected when resources exist within the boundaries of their corporate networks. But in today's digital workplace, that boundary has expanded with managed mobile devices and resources and services in the cloud. Now you need to manage the complexity of protecting your users' identities and data stored on their devices and apps.

Perhaps you have already begun using Azure AD to manage users in the cloud who need to access Office 365 and other SaaS applications while still requiring access to web apps hosted on-premises. If you already have Azure AD, you can leverage it as one control plane to allow seamless and secure access to your on-premises applications. Or, maybe you are still contemplating a move to the cloud. If true, you can begin your journey to the cloud by implementing Application Proxy and taking the first step towards building a strong identity foundation.

While not comprehensive, the list below illustrates some of the things you can enable by implementing App Proxy in a hybrid coexistence scenario:

* Publish on-premises web apps externally in a simplified way without a DMZ
* Support single sign-on (SSO) across devices, resources, and apps in the cloud and on-premises
* Support multi-factor authentication for apps in the cloud and on-premises
* Quickly leverage cloud features with the security of the Microsoft Cloud
* Centralize user account management
* Centralize control of identity and security
* Automatically add or remove user access to applications based on group membership

This article will explain how leveraging Azure AD, and Application Proxy in particular, can provide remote users with a single sign-on (SSO) experience while securely connecting to on-premises apps without having to rely on a VPN or dual-homed servers and firewall rules. It will help you understand how implementing App Proxy brings the capabilities and security advantages of the cloud to your on-premises web applications and describes the architecture and topologies that are possible.

## Remote access in the past

Previously, your control plane for protecting internal resources from attackers while facilitating access by remote users was all in the DMZ, or perimeter network. But the VPN and reverse proxy solutions deployed in the DMZ used by external clients to access corporate resources aren't suited to the cloud world and typically suffer from the following drawbacks:

* Hardware costs
* Maintaining security (patching, monitoring ports, etc.)
* Authenticating users at the edge
* Authenticating users to web servers in the perimeter network
* Maintaining VPN access for remote users, that is, distribution and configuration of VPN client software, and maintaining domain-joined servers in the DMZ, which can be vulnerable to outside attacks.

In today's Cloud First world, Azure AD is best suited to control who and what gets in your network. Azure AD Application Proxy provides enhanced capabilities for integration with modern authentication and cloud-based technologies like SaaS applications and identity providers to enable users to access apps from anywhere. Not only is App Proxy more suited for today's digital workplace, it is more secure than VPN and reverse proxy solutions and easier to implement. Remote users can access your on-premises applications the same way they access O365 and other SaaS apps integrated with Azure AD. You don't need to change or update your applications to work with Application Proxy. Furthermore, App Proxy doesn't require you to open inbound connections through your firewall. With App Proxy, you simply set it and forget it.

## The future of remote access

In today's digital workplace, users work anywhere with multiple devices and apps. The only constant is user identity. That's why the first step to a secure network today is to leverage [Azure AD's identity management](https://docs.microsoft.com/azure/security/security-identity-management-overview) capabilities as your security control plane. A model that leverages identity as your control plane is typically comprised of the following components:

* An identity provider to keep track of users and user-related information
* Device directory to maintain a list of devices that have access to corporate resources, along with their corresponding device information (for example, type of device, integrity etc.)
* Policy evaluation service to determine if a user and device conforms to the policy set forth by security admins
* The ability to grant or deny access to organizational resources

With Application Proxy, Azure AD keeps track of users who need to access web apps published on-premises and in the cloud and provides a central management point for those apps. While not required, it is recommended that you also enable Azure AD conditional access to further ensure that the right people have access to those applications by defining specific conditions for how users authenticate and gain access.

**Note:** It's important to understand that Azure AD Application Proxy is intended as a VPN or reverse proxy replacement for roaming, or remote, users who need access to internal resources. It is not intended for internal users on the corporate network. Internal users who unnecessarily use Application Proxy can introduce unexpected and undesirable performance issues.

![Azure Active Directory and all your apps](./media/image1.png)

### An overview of how App Proxy works

In a nutshell, Application Proxy is an Azure AD service that you configure in the Azure portal, which enables you to publish an external public HTTP/HTTPS URL endpoint in the Azure Cloud that connects to an internal application server URL in your organization. These on-prem web apps can be integrated with Azure AD to support single sign-on and give end users the ability to access them in the same way they access Office 365 and other SaaS apps.

Components of this feature include the Application Proxy service, which runs in the cloud, the Application Proxy connector, which is a lightweight agent that runs on an on-premises server, and Azure AD, which is the identity provider. All three components work together to provide the user with a single sign-on experience to access on-premises web applications.

After signing in, external users can access on-premises web applications by using a familiar URL or the [MyApps access panel](https://docs.microsoft.com/azure/active-directory/user-help/my-apps-portal-end-user-access) from their desktop or iOS/MAC devices. For example, App Proxy can provide remote access and single sign-on to Remote Desktop, SharePoint sites, Tableau, Qlik, Outlook on the web, and line-of-business (LOB) applications.

![Azure AD Application Proxy architecture](./media/image2.png)

### Authentication

There are several ways to configure an application for single sign-on and the method you select depends on the authentication your application uses. Application Proxy supports the following types of applications:

* Web applications
* Web APIs that you want to expose to rich applications on different devices
* Applications hosted behind a Remote Desktop Gateway
* Rich client apps that are integrated with the Active Directory Authentication Library (ADAL)

App Proxy works with apps that use the following native authentication protocol:

* **[Integrated Windows Authentication (IWA)](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-configure-single-sign-on-with-kcd).** For IWA, the Application Proxy connectors use Kerberos Constrained Delegation (KCD) to authenticate users to the Kerberos application.

App Proxy also supports the following authentication protocols with third-party integration or in specific configuration scenarios:

* [**Header-based authentication**](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-configure-single-sign-on-with-ping-access). This sign-on method uses a third-party authentication service called PingAccess and is used when the application uses headers for authentication. In this scenario, authentication is handled by PingAccess.
* [**Forms- or password-based authentication**](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-configure-single-sign-on-password-vaulting). With this authentication method, users sign on to the application with a username and password the first time they access it. After the first sign-on, Azure AD supplies the username and password to the application. In this scenario, authentication is handled by Azure AD.
* [**SAML authentication**](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-configure-single-sign-on-on-premises-apps%20). SAML-based single sign-on is supported for applications that use either SAML 2.0 or WS-Federation protocols. With SAML single sign-on, Azure AD authenticates to the application by using the user's Azure AD account.

For more information on supported methods, see [Choosing a single sign-on method](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on#choosing-a-single-sign-on-method).

### Security benefits

The remote access solution offered by Application Proxy and Azure AD support several security benefits customers may take advantage of, including:

* **Authenticated access**. Application Proxy is best suited to publish applications with [pre-authentication](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-security#authenticated-access) to ensure that only authenticated connections hit your network. For applications published with pre-authentication, no traffic is allowed to pass through the App Proxy service to your on-premises environment, without a valid token. Pre-authentication, by its very nature, blocks a significant number of targeted attacks, as only authenticated identities can access the backend application.
* **Conditional Access**. Richer policy controls can be applied before connections to your network are established. With conditional access, you can define restrictions on the traffic that you allow to hit your backend application by creating policies that restrict sign-ins based on location, strength of authentication, and user risk profile. As conditional access evolves, more controls are being added to provide additional security such as integration with Microsoft Cloud App Security (MCAS). MCAS integration enables you to configure an on-premises application for [real-time monitoring](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-integrate-with-microsoft-cloud-application-security) by leveraging conditional access to monitor and control sessions in real-time based on conditional access policies.
* **Traffic termination**. All traffic to the backend application is terminated at the Application Proxy service in the cloud while the session is re-established with the backend server. This connection strategy means that your backend servers are not exposed to direct HTTP traffic and better protected against targeted DoS (denial-of-service) attacks because your firewall isn't under attack.
* **All access is outbound**. The Application Proxy connectors only use outbound connections to the Application Proxy service in the cloud over ports 80 and 443. No inbound connections, means there is no need to open firewall ports for incoming connections or components in the DMZ as all connections are outbound and over a secure channel.
* **Security Analytics and Machine Learning (ML) based intelligence**. Because it's part of Azure Active Directory, Application Proxy can leverage [Azure AD Identity Protection](https://docs.microsoft.com/azure/active-directory/identity-protection/overview) (requires [Premium P2 licensing](https://azure.microsoft.com/pricing/details/active-directory/)). Azure AD Identity Protection combines machine-learning driven security intelligence with data feeds from Microsoft's [Digital Crimes Unit](https://news.microsoft.com/stories/cybercrime/index.html) and [Microsoft Security Response Center](https://www.microsoft.com/msrc) to proactively identify compromised accounts. Identity Protection offers real-time protection from high-risk sign-ins, taking into consideration factors like accesses from infected devices, through anonymizing networks, or from atypical and unlikely locations to increase the risk profile of a session, which in turn is used for real-time protection. Many of these reports and events are already available through an API for integration with your SIEM systems.

* **Remote access as a service**. You don't have to worry about maintaining and patching on-premises servers to enable remote access. Application Proxy is an internet scale service that Microsoft owns, so you always get the latest security patches and upgrades. Unpatched software still accounts for a large number of attacks. According to the Department of Homeland Security, as many as [85 percent of targeted attacks are preventable](https://www.us-cert.gov/ncas/alerts/TA15-119A). With this service model, you don't have to carry the heavy burden of managing your edge servers anymore and scramble to patch them as needed.

* **Intune integration**. With Intune, corporate traffic is routed separately from personal traffic and Application Proxy ensures that the corporate traffic is authenticated. [Application Proxy and the Intune Managed Browser](https://docs.microsoft.com/intune/app-configuration-managed-browser#how-to-configure-application-proxy-settings-for-protected-browsers) capability can also be used together to enable remote users to securely access internal websites from iOS and Android devices.

### Roadmap to the cloud

Another major benefit of implementing Application Proxy is in extending Azure AD to your on-premises environment. In fact, implementing App Proxy is a key step in moving your organization and apps to the cloud. Moving your apps to the cloud and away from on-premises authentication can help reduce your on-premises footprint while enabling you to leverage Azure AD's identity management capabilities as your control plane. Implementing App Proxy requires little to no updates to existing applications and enables you to leverage cloud capabilities such as single sign-on, multi-factor authentication, and central management. Installing the necessary components to App Proxy is a simple process for establishing a remote access framework. And by moving to the cloud you have access to the latest features and updates and functionality such as high availability and the disaster recovery benefits of leveraging Azure AD for this service.

To learn more about migrating your apps to Azure AD, see the [Migrating Your Applications to Azure Active Directory](https://aka.ms/migrateapps/whitepaper) white paper.

## Architecture

The following diagram illustrates in general how Azure AD authentication services and Application Proxy work together to provide single sign-on to on-premises applications to end users.

![Azure AD Application Proxy authentication flow](./media/image3.png)

1. After the user has accessed the application through an endpoint, the user is redirected to the Azure AD sign-in page. If you've configured conditional access policies, specific conditions are checked at this time to ensure that you comply with your organization's security requirements.
2. After a successful sign-in, Azure AD sends a token to the user's client device.
3. The client sends the token to the Application Proxy service, which retrieves the user principal name (UPN) and security principal name (SPN) from the token.
4. Application Proxy forwards the request, which is picked up by the Application Proxy [connector](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-connectors).
5. The connector performs any additional authentication required on behalf of the user (*Optional depending on authentication method*), requests the internal endpoint of the application server and sends the request to the on-premises application.
6. The response from the application server is sent through the connector to the Application Proxy service.
7. The response is sent from the Application Proxy service to the user.

|**Component**|**Description**|
|:-|:-|
|Endpoint|The endpoint is a URL or an [end-user portal](https://docs.microsoft.com/azure/active-directory/manage-apps/end-user-experiences). Users can reach applications while outside of your network by accessing an external URL. Users within your network can access the application through a URL or an end-user portal. When users go to one of these endpoints, they authenticate in Azure AD and then are routed through the connector to the on-premises application.|
|Azure AD|Azure AD performs the authentication using the tenant directory stored in the cloud.|
|Application Proxy service|This Application Proxy service runs in the cloud as part of Azure AD. It passes the sign-on token from the user to the Application Proxy Connector. Application Proxy forwards any accessible headers on the request and sets the headers as per its protocol, to the client IP address. If the incoming request to the proxy already has that header, the client IP address is added to the end of the comma-separated list that is the value of the header.|
|Application Proxy connector|The connector is a lightweight agent that runs on a Windows Server inside your network. The connector manages communication between the Application Proxy service in the cloud and the on-premises application. The connector only uses outbound connections, so you don't have to open any inbound ports or put anything in the DMZ. The connectors are stateless and pull information from the cloud as necessary. For more information about connectors, like how they load-balance and authenticate, see [Understand Azure AD Application Proxy connectors](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-connectors).|
|Active Directory (AD)|Active Directory runs on-premises to perform authentication for domain accounts. When single sign-on is configured, the connector communicates with AD to perform any additional authentication required.|
|On-premises application|Finally, the user is able to access an on-premises application.|

Azure AD Application Proxy consists of the cloud-based Application Proxy service and an on-premises connector, which listens for requests from the Application Proxy service and handles connections to the internal applications. It is important to note that all communications occur over SSL, and always originate at the connector to the Application Proxy service, that is, are outbound only. The connector uses a client certificate to authenticate to the Application Proxy service for all calls. The only exception to the connection security is the initial setup step where the client certificate is established. See the Application Proxy [Under the hood](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-security#under-the-hood) for more details.

### Application Proxy Connectors

[Application Proxy connectors](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-connectors) are lightweight agents deployed on-premises that facilitate the outbound connection to the Application Proxy service in the cloud. The connectors must be installed on a Windows Server that has access to the backend application. Users connect to the App Proxy cloud service that routes their traffic to the apps via the connectors as illustrated below.

![Azure AD Application Proxy network connections](./media/image4.png)

Setup and registration between a connector and the App Proxy service is accomplished as follows:

1. The IT administrator opens ports 80 and 443 to outbound traffic and allows access to several URLs that are needed by the connector, the App Proxy service, and Azure AD.
2. The admin signs into the Azure portal and runs an executable to install the connector on an on-premises Windows server.
3. The connector starts to "listen" to the App Proxy service.
4. The admin adds the on-premises application to Azure AD and configures settings such as the URLs that are needed so that users can connect to their apps.

For more information, see [Plan an Azure AD Application Proxy deployment](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-deployment-plan).

It is recommended that you always deploy multiple connectors for redundancy and scale. The connectors, in conjunction with the service, take care of all the high availability tasks and can be added or removed dynamically. Each time a new request arrives it is routed to one of the connectors that is available. When a connector is running, it remains active as it connects to the service. If a connector is temporarily unavailable, it doesn't respond to this traffic. Unused connectors are tagged as inactive and removed after 10 days of inactivity.

Connectors also poll the server to find out if there is a newer version of the connector. Although you can do a manual update, connectors will update automatically as long as the Application Proxy Connector Updater service is running. For tenants with multiple connectors, the automatic updates target one connector at a time in each group to prevent downtime in your environment.

**Note**: You can monitor the Application Proxy [version history page](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-release-version-history) to be notified when updates have been released by subscribing to its RSS feed.

Each Application Proxy connector is assigned to a [connector group](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-connector-groups). All the connectors that belong to the same connector group act as a single unit for high availability and load balancing. You can create new groups, assign connectors to them in the Azure portal, then assign specific connectors to serve specific applications. It is recommended to have at least two connectors in each connector group for high availability.

Connector groups are useful when you need to support the following scenarios:

* Geographical app publishing
* Application segmentation/isolation
* Publishing web apps running in the cloud or on-premises

For more information about choosing where to install your connectors and optimizing your network, see [Network topology considerations when using Azure Active Directory Application Proxy](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-network-topology).

## Other use cases

Up to this point we've focused on how you can use App Proxy to publish on-premises apps externally while enabling single sign-on to all your cloud and on-premises apps. However, there are other use cases for App Proxy that are worth mentioning. They include:

* **Securely publish REST APIs**. For scenarios when you have business logic or APIs running on-premises or hosted in virtual machines across the cloud, Application Proxy provides a public endpoint for API access. API endpoint access, enables you to control authentication and authorization without requiring incoming ports and provides additional security through Azure AD Premium features such as multi-factor authentication and device-based Conditional Access for desktops, iOS, MAC, and Android devices using Intune. To learn more, see [How to enable native client applications to interact with proxy applications](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-configure-native-client-application) and [Protect an API by using OAuth 2.0 with Azure Active Directory and API Management](https://docs.microsoft.com/azure/api-management/api-management-howto-protect-backend-with-aad).
* **Remote Desktop Services** **(RDS)**. Standard RDS deployments require open inbound connections. However, the [RDS deployment with Application Proxy](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-integrate-with-remote-desktop-services) has a permanent outbound connection from the server running the connector service, which enables you to offer more applications to end users by publishing on-premises applications through Remote Desktop Services. You also have the ability to reduce the attack surface of the deployment with a limited set of two-step verification and conditional access controls to RDS.
* **Publish applications that connect using WebSockets**. Support with [Qlik Sense](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-qlik) is in Public Preview and will be expanded to other apps in the future.
* **Enable native client applications to interact with proxy applications**. You can use Azure AD Application Proxy to publish web apps, but it also can be used to publish [native client applications](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-configure-native-client-application) that are configured with the Azure AD Authentication Library (ADAL). Native client applications differ from web apps because they're installed on a device, while web apps are accessed through a browser.

## Conclusion

The way we work and the tools we use are changing rapidly: including the rise of employees bringing their own devices to the work environment and pervasive use of Software-as-a-Service (SaaS) applications. Because of this rise, the way organizations manage and secure their data must also evolve. Companies no longer operate solely within their own walls, protected by a moat that surrounds their border. Data travels to more locations than ever before -- across both on-premises and cloud environments. While this evolution has helped increase users' productivity and their ability to collaborate with others, it has also made protecting sensitive data more challenging.

Whether you are currently using Azure AD to manage users in a hybrid coexistence scenario or are interested in starting your journey to the cloud, implementing Azure AD Application Proxy can help reduce the size of your on-premises footprint by providing remote access as a service.

Organizations should begin taking advantage of App Proxy today to take advantage of the following benefits:

* Publish on-premises apps externally without the overhead associated with maintaining traditional VPN or other on-premises web publishing solutions and DMZ approach
* Single sign-on to all applications, be they Office 365 or other SaaS apps and including on-premises applications
* Cloud scale security where Azure AD leverages Office 365 telemetry to prevent unauthorized access
* Intune integration to ensure corporate traffic is authenticated
* Centralization of user account management
* Automatic updates to ensure you have the latest security patches
* New features as they are released; the most recent being support for SAML single sign-on and more granular management of application cookies

## Next steps

* [Plan an Azure AD Application Proxy deployment](https://docs.microsoft.com/azure/active-directory/manage-apps/application-proxy-deployment-plan) - Plan, operate, and manage Azure AD Application Proxy
* [Getting started with Enterprise Mobility + Security](https://www.microsoft.com/cloud-platform/enterprise-mobility-security-trial) -- Schedule a live demo or get a free 90-day trial for evaluation
