---
title: High availability and load balancing for Azure AD Application Proxy | Microsoft Docs
description: How traffic distribution works with your Application Proxy deployment. Includes best practices on how to optimize connector performance and use load balancing for back-end servers.
services: active-directory
documentationcenter: ''
author: msmimart
manager: CelesteDG

ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 07/24/2019
ms.author: mimart
ms.reviewer: japere
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# High availability and load balancing of your Application Proxy connectors and applications

This article explains how traffic distribution works with your Application Proxy deployment. We'll discuss:

- How traffic is distributed among users and connectors, along with best practices for optimizing connector performance

- How traffic flows between connectors and backend app servers, with tips for load balancing among multiple backend servers

## Traffic distribution across connectors

Connectors establish their connections based on principles for high availability. There's no guarantee that traffic will always be evenly distributed across connectors. However, usage by users varies, and requests are randomly sent to Application Proxy service instances. So traffic is typically distributed almost evenly across the connectors. The diagram and steps below illustrate how connections are established between users and connectors.

![Diagram showing connections between users and connectors](media/application-proxy-high-availability-load-balancing/application-proxy-connections.png)

1. A user on a client device tries to access an on-premises application published through Application Proxy.
2. The request goes through an Azure Load Balancer to determine which Application Proxy service instance should take the request. There are tens of instances available per region to pick up the request. This method helps to evenly distribute the traffic across the service instances.
3. The request is then sent to [Service Bus](https://docs.microsoft.com/azure/service-bus-messaging/).
4. Service Bus checks if there’s an existing connector in the connector group that the connection previously used. If so, it reuses the connection. If no connector is paired with the connection yet, it will choose an available connector at random to signal to. The connector then picks up the request from Service Bus.

   - Requests go to different Application Proxy service instances in step 2, so connections are more likely to be made with different connectors. As a result, connectors are nearly evenly used within the group.

   - A connection is only reselected if the connection is broken, or if there's an idle period of 10 minutes. For example, the connection may be broken when a machine or connector service restarts or there's a network disruption.

5. The connector passes the request to the application’s backend server and the application sends back the response to the connector.
6. The connector then completes sending the response back by opening an outbound connection to the service instance the request came from. This connection is immediately closed after.

   - For each connector, there's a default limit of 200 simultaneous concurrent outbound connections that can be open.

7. The response is then passed back to the client from the service instance.
8. Subsequent requests from the same connection repeat the steps above until this connection is broken or is idle for 10 minutes.

Often an application has many resources and it will open multiple connections when it's loaded. As a result, each connection goes through the steps above, such as being allocated to a service instance and selecting a new available connector if the connection has not yet previously paired with a connector.


## Best practices for high availability of connectors

- Because of the way traffic is distributed among connectors for high availability, it's essential to always have at least two connectors in a connector group. Three connectors are preferred to provide additional buffer among connectors. To determine the correct number of connectors you needed, follow capacity planning documentation.

- Place connectors on different outbound connections to avoid a single point of failure. If connectors use the same outbound connection, a network problem with the connection may impact all connectors using it.

- Avoid forcing connectors to restart when connected to production applications. Doing so could negatively impact the distribution of traffic across connectors. Restarting connectors causes more connectors to be unavailable and forces connections to the remaining available connector. The result is an uneven use of the connectors initially.

- Avoid all forms of inline inspection on outbound TLS communications between connectors and Azure. This type of inline inspection causes degradation to the communication flow.

- Make sure to keep automatic updates running for your connectors. If the Application Proxy Connector Updater service is running, your connectors update automatically and receive the latest upgraded. If you don’t see the Connector Updater service on your server, you need to reinstall your connector to get any updates.

## Traffic flow between connectors and backend application servers

Another key area where high availability is a factor is the connection between connectors and the backend servers. When an application is published through Azure AD Application Proxy, traffic from the users to the applications flows through three hops:

1.	The user connects to the Azure AD Application Proxy service public endpoint on Azure. The connection will be established between the originating client IP address (public) of the client and the IP address of the Application Proxy endpoint. 
2.	The Application Proxy connector pulls the HTTP request from the client.
3.	The Application Proxy connector connects to the target application. The connector uses its own IP address for establishing the connection.

![Diagram of user connecting to an application via Application Proxy](media/application-proxy-high-availability-load-balancing/application-proxy-three-hops.png)

### X-Forwarded-For header field considerations
In some situations (like auditing, load balancing etc.), sharing the originating IP address of the external client with the on-premises environment is a requirement. To address the requirement, Azure AD Application Proxy connector adds the X-Forwarded-For header field with the originating client IP address (public) to the HTTP request. The appropriate network device (load balancer, firewall) or the web server / backend application can then read and use the information.

## Best practices for load balancing between multiple app servers
Using at least two connectors in the connector group assigned to the Application Proxy application and running the backend web application on multiple servers (server farm) at the same time requires having a good load-balancing strategy. This ensures that servers evenly pick up client requests and prevent over or underutilizations of servers in the server farm.
### Scenario 1: Backend application does not require session persistence
The simplest scenario is where the backend web application doesn’t require session stickiness (session persistence). Any request from the user can be handled by any backend application instance in the server farm. You can use a layer 4 load balancer and configure it with no affinity. Some options include  Microsoft Network Load Balancing and Azure Load Balancer or a load balancer from another vendor. Alternatively, round-robin DNS can be configured.
### Scenario 2: Backend application requires session persistence
In this scenario, the backend web application requires session stickiness (session persistence) during the authenticated session. All requests from the user must be handled by the backend application instance running on the same server in the server farm.
This scenario can be more complicated because the client usually establishes multiple connections to the Application Proxy service. Requests over different connections might arrive at different connectors and servers in the farm. Because each connector uses its own IP address for this communication, the load balancer can't ensure session stickiness based on the IP address of the connectors. Source IP Affinity can't be used either.
Here are some options for scenario 2:

- Option 1: Base the session persistence on a session cookie set by the load balancer. This option is recommended because it allows the load to be spread more evenly among the backend servers. It requires a layer 7 load balancer with this capability and that can handle the HTTP traffic and terminate the SSL connection. You can use Azure Application Gateway (Session Affinity) or a load balancer from another vendor. 

- Option 2: Base the session persistence on the X-Forwarded-For header field. This option requires a layer 7 load balancer with this capability and that can handle the HTTP traffic and terminate the SSL connection.  

- Option 3: Configure the backend application to not require session persistence.

Please refer to your software vendor's documentation to understand the load-balancing requirements of the backend application.

## Next steps

- [Enable Application Proxy](application-proxy-add-on-premises-application.md)
- [Enable single-sign on](application-proxy-configure-single-sign-on-with-kcd.md)
- [Enable Conditional Access](application-proxy-integrate-with-sharepoint-server.md)
- [Troubleshoot issues you're having with Application Proxy](application-proxy-troubleshoot.md)
