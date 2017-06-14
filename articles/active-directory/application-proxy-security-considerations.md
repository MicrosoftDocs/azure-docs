---
title: Security considerations for Azure AD Application Proxy | Microsoft Docs
description: Covers security considerations for using Azure AD Application Proxy
services: active-directory
documentationcenter: ''
author: kgremban
manager: femila

ms.assetid:
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/12/2017
ms.author: kgremban

---

# Security considerations for accessing apps remotely with Azure AD Application Proxy

This article explains how Azure Active Directory (Azure AD) Application Proxy provides a secure service for publishing and accessing your applications remotely.

The following diagram shows how Azure AD enables secure remote access to your on-premises applications.

 ![Diagram of secure remote access through Azure AD Application Proxy](./media/application-proxy-security-considerations/secure-remote-access.png)

Azure AD Application Proxy offers the following security benefits:

**Authenticated access:** Only authenticated connections can access your network.

* Azure AD Application Proxy relies on the Azure AD security token service (STS) for all authentication.  Preauthentication, by its very nature, blocks a significant number of anonymous attacks, because only authenticated identities can access the back-end application.

**Conditional access:** Apply richer policy controls before connections to your network are established.

* With [conditional access](active-directory-conditional-access-azuread-connected-apps.md) you can define restrictions on what traffic is allowed to access your back-end applications, based on location, strength of authentication, and user risk profile.

**Traffic termination:** All traffic is terminated in the cloud.

* Because Azure AD Application Proxy is a reverse-proxy, all traffic to back-end applications is terminated at the service. The session can get reestablished only with the back-end server, which means that your back-end servers are not exposed to direct HTTP traffic. For example, you can more easily mitigate targeted attacks.

**All access is outbound:** You don't need to open inbound connections to the corporate network.

* Azure AD connectors maintain outbound connections to the Azure AD Application Proxy service, which means that there is no need to open firewall ports for incoming connections. Traditional proxies required a perimeter network (also known as *DMZ*, *demilitarized zone*, or *screened subnet*) and allowed access to unauthenticated connections at the network edge. This scenario resulted in the need for many additional investment in web application firewall (WAF) products to analyze traffic and offer addition protections to the environment. With Application Proxy, you don't need a perimeter network because all connections are outbound and take place over a secure channel.

**Security analytics and machine language-based intelligence:** Get cutting-edge security protection.

* [Azure AD Identity Protection](active-directory-identityprotection.md) with machine learning-driven intelligence with data is fed from our Digital Crimes Unit and Microsoft Security Response Center. Together we proactively identify compromised accounts and offer real-time protection from high-risk sign-ins. We take into account numerous factors, such as access from infected devices, through anonymizing networks, and from atypical and unlikely locations.
* Many of these reports and events are already available through an API for integration with your security information and event management (SIEM) systems.

**Remote access as a service:** You don’t have to worry about maintaining and patching on-premises servers.

* Unpatched software still accounts for a large number of attacks. Azure AD Application Proxy is an Internet-scale service that Microsoft owns, so be assured that you always get the latest security patches and upgrades.
* To improve the security of applications published by Azure AD Application Proxy, we block web crawler robots from indexing and archiving your applications. Each time a web crawler robot tries to retrieve the robot's settings for a published app, Application Proxy replies with a robots.txt file that includes `User-agent: * Disallow: /`.

## Under the hood

Azure AD Application Proxy consists of two parts:

* The cloud-based service: This service is where the external client/user connections are made.
* The Azure AD Application Proxy connector: An on-premises component, the connector listens for requests from the Azure AD Application Proxy service and handles connections to the internal applications. 

A flow between the connector and the Application Proxy service is established when:

* The connector is first set up.
* The connector pulls configuration information from the Application Proxy service, including the connector group that each connector is a member of.
* A user accesses a published application.

>[!NOTE]
>All communications occur over SSL, and they always originate at the connector to the Application Proxy service. The service is outbound only.

The connector uses a client certificate to authenticate to the Application Proxy service for nearly all calls. The only exception to this process is the initial setup step, where the client certificate is established.

### Installing the connector

When the connector is first set up, the following flow events take place:

1. The connector registration to the service happens as part of the installation of the connector. Currently, users are prompted to enter their Azure AD admin credentials. The token acquired is then presented to the Azure AD Application Proxy service.
2. Application Proxy evaluates the token to ensure that the user is a member of the company admin role within the tenant that the token was issued for. If the user is not a member of the admin role, the process is terminated.
3. The connector generates a client certificate request and passes it, with the token, to the Application Proxy service, which in turn verifies the token and signs the client certificate request.
4. The connector uses the client certificate for future communication with the Application Proxy service.
5. The connector performs an initial pull of the system configuration data from the service using its client certificate, and it is now ready to take requests.

### Updating the configuration settings

Whenever the Application Proxy service updates the configuration settings, the following flow events take place:

1. The connector connects to the configuration endpoint within the Application Proxy service by using its client certificate.
2. After the client certificate has been validated, the Application Proxy service returns configuration data to the connector (for example, the connector group that the connector should be part of).
3. If the current certificate is more than 30 days old, the connector generates a new certificate request, which effectively updates the client certificate every 30 days.

### Accessing published applications

When users access a published application, the following flow events take place:

#### The Application Proxy service checks the configuration settings for the app. 

If the app is configured to use preauthentication with Azure AD, users are redirected to the Azure AD STS to authenticate. If you configure the app to use pass-through, this step is skipped.

1. Application Proxy checks for any conditional access policy requirements for the specific application. This step ensures that the user has been assigned to the application. If two-step verification is required, the authentication sequence prompts the user for a second authentication method.

2. After all checks have passed, the Azure AD STS issues a signed token for the application and redirects the user back to the Application Proxy service.

3. Application Proxy verifies that the token was issued to correct the application. It performs other checks also, such as ensuring that the token was signed by Azure AD, and that it is still within the valid window.

4. Application Proxy sets an encrypted authentication cookie to indicate that authentication to the application has occurred. The cookie includes an expiration timestamp that's based on the token from Azure AD and other data, such as the user name that the authentication is based on. The cookie is encrypted with a private key known only to the Application Proxy service.

5. Application Proxy redirects the user back to the originally requested URL.

If any part of the preauthentication steps fails, the user’s request is denied, and the user is shown a message indicating the source of the problem.


#### Application Proxy places a request in the appropriate queue for an on-premises connector to handle. 

All requests from the connector are outbound to the Application Proxy service. Connectors keep an outbound connection open to Application Proxy. When a request comes in, Application Proxy queues up the request on one of the open connections for the connector to pick up.

The request includes items from the application, such as the request headers, data from the encrypted cookie, the user making the request, and the request ID. However, the encrypted authentication cookie is not sent to the connector.

#### The connector receives the request from the queue. 

Based on the request, Application Proxy performs one of the following actions:

* The connector confirms whether it can identify the application. If it cannot identify the application, the connector establishes a connection to the Application Proxy service to gather details about the application, and it caches the application locally.

* If the request is a simple operation (for example, there is no data within the body as is with a RESTful *GET* request), the connector makes a connection to the target internal resource and then waits for a response.

* If the request has data associated with it in the body (for example, a RESTful *POST* operation), the connector makes an outbound connection by using the client certificate to the Application Proxy instance. It makes this connection to request the data and open a connection to the internal resource. After it receives the request from the connector, the Application Proxy service begins accepting content from the user and forwards data to the connector. The connector, in turn, forwards the data to the internal resource.

#### After the request and transmission of all content to the back end is complete, the connector waits for a response.

After it receives a response, the connector makes an outbound connection to the Application Proxy service, to return the header details and begin streaming the return data.

#### Application Proxy "streams" the data to the user. 

Some processing of the headers may occur here, as needed and defined by the application.


## Next steps

[Network topology considerations when using Azure AD Application Proxy](application-proxy-network-topology-considerations.md)

[Understand Azure AD Application Proxy connectors](application-proxy-understand-connectors.md)
