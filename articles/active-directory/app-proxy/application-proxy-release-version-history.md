---
title: 'Microsoft Entra application proxy: Version release history'
description: This article lists all releases of Microsoft Entra application proxy and describes new features and fixed issues.
services: active-directory
author: kenwith
manager: amycolannino
ms.service: active-directory
ms.topic: reference
ms.workload: identity
ms.date: 09/14/2023
ms.subservice: app-proxy
ms.author: kenwith
ms.reviewer: ashishj
---

# Microsoft Entra application proxy: Version release history
This article lists the versions and features of Microsoft Entra application proxy that have been released. The Microsoft Entra ID team regularly updates Application Proxy with new features and functionality. Application Proxy connectors are [updated automatically when a new major version is released](application-proxy-faq.yml#why-is-my-connector-still-using-an-older-version-and-not-auto-upgraded-to-latest-version-). 

We recommend making sure that auto-updates are enabled for your connectors to ensure you have the latest features and bug fixes. Microsoft Support might ask you to install the latest connector version to resolve a problem.

Here is a list of related resources:

| Resource                                         | Details                                                      |
| ------------------------------------------------ | ------------------------------------------------------------ |
| How to enable Application Proxy                  | Pre-requisites for enabling Application Proxy and installing and registering a connector are described in this [tutorial](application-proxy-add-on-premises-application.md). |
| Understand Microsoft Entra application proxy connectors | Find out more about [connector management](application-proxy-connectors.md) and how connectors [auto-upgrade](application-proxy-connectors.md#automatic-updates). |
| Microsoft Entra application proxy Connector Download    | [Download the latest connector](https://download.msappproxy.net/subscription/d3c8b69d-6bf7-42be-a529-3fe9c2e70c90/connector/download). |

## 1.5.3437.0

### Release status

June 20, 2023: Released for download. This version is only available for install via the download page.

### New features and improvements

- Support for Microsoft Entra Private Access.
- Updated “Third-Party Notices”.

### Fixed issues
- Silent registration of connector with credentials. See [Create an unattended installation script for the Microsoft Entra application proxy connector](application-proxy-register-connector-powershell.md) for more details.
- Fixed dropping of “Secure” and “HttpOnly” attributes on the cookies passed by backend servers when there are trailing spaces in these attributes.
- Fixed services crash when back-end server of an application sets "Set-Cookie" header with empty value.

## 1.5.2846.0

### Release status

March 22, 2022: Released for download. This version is only available for install via the download page.

### New features and improvements

- Increased the number of HTTP headers supported on HTTP requests from 41 to 60.
- Improved error handling of SSL failures between the connector and Azure services.
- Updated the default connection limit to 200 for connector traffic when going through outbound proxy. To learn more about outbound proxy, see [Work with existing on-premises proxy servers](application-proxy-configure-connectors-with-proxy-servers.md#use-the-outbound-proxy-server).
- Deprecated the use of ADAL and implemented MSAL as part of the connector installation flow.

### Fixed issues
- Return original error code and response instead of a 400 Bad Request code for failing websocket connect attempts.

## 1.5.1975.0

### Release status

July 22, 2020: Released for download
This version is only available for install via the download page. 

### New features and improvements
-	Improved support for Azure Government cloud environments. For steps on how to properly install the connector for Azure Government cloud review the [pre-requisites](../hybrid/connect/reference-connect-government-cloud.md#allow-access-to-urls) and [installation steps](../hybrid/connect/reference-connect-government-cloud.md#install-the-agent-for-the-azure-government-cloud).
- Support for using the Remote Desktop Services web client with Application Proxy. See [Publish Remote Desktop with Microsoft Entra application proxy](application-proxy-integrate-with-remote-desktop-services.md) for more details.
- Improved websocket extension negotiations. 
- Support for optimized routing between connector groups and Application Proxy cloud services based on region. See [Optimize traffic flow with Microsoft Entra application proxy](application-proxy-network-topology.md) for more details. 

### Fixed issues
- Fixed a websocket issue that forced lowercase strings.
- Fixed an issue that caused connectors to be occasionally unresponsive.

## 1.5.1626.0

### Release status

July 17, 2020: Released for download. 
This version is only available for install via the download page. 

### Fixed issues
- Resolved memory leak issue present in previous version
- General improvements for websocket support

## 1.5.1526.0

### Release status

April 07, 2020: Released for download
This version is only available for install via the download page. 

### New features and improvements
-	Connectors only use TLS 1.2 for all connections. See [Connector pre-requisites](application-proxy-add-on-premises-application.md#prerequisites) for more details.
- Improved signaling between the Connector and Azure services. This includes supporting reliable sessions for WCF communication between the Connector and Azure services and DNS caching improvements for WebSocket communications.
- Support for configuring a proxy between the Connector and the backend application. For more information see [Work with existing on-premises proxy servers](application-proxy-configure-connectors-with-proxy-servers.md).

### Fixed issues
- Removed falling back to port 8080 for communications from the Connector to Azure services.
- Added debug traces for WebSocket communications. 
- Resolved preserving the SameSite attribute when set on backend application cookies.

## 1.5.612.0

### Release status

September 20, 2018: Released for download

### New features and improvements

- Added WebSocket support for the QlikSense application. To learn more about how to integrate QlikSense with Application Proxy, see this [walkthrough](application-proxy-qlik.md). 
- Improved the installation wizard to make it easier to configure an outbound proxy. 
- Set TLS 1.2 as the default protocol for connectors. 
- Added a new End-User License Agreement (EULA).  

### Fixed issues

- Fixed a bug that caused some memory leaks in the connector.
- Updated the Azure Service Bus version, which includes a bug fix for connector timeout issues.

## 1.5.402.0

### Release status

January 19, 2018: Released for download

### Fixed issues

- Added support for custom domains that need domain translation in the cookie.

## 1.5.132.0

### Release status 

May 25, 2017: Released for download 

### New features and improvements 

Improved control over connectors' outbound connection limits. 

## 1.5.36.0

### Release status

April 15, 2017: Released for download

### New features and improvements

- Simplified onboarding and management with fewer required ports. Application Proxy now requires opening only two standard outbound ports: 443 and 80. Application Proxy continues to use only outbound connections, so you still don't need any components in a DMZ. For details, see our [configuration documentation](application-proxy-add-on-premises-application.md).  
- If supported by your external proxy or firewall, you can now open your network by DNS instead of IP range. Application Proxy services require connections to *.msappproxy.net and *.servicebus.windows.net only.


## Earlier versions

If you're using an Application Proxy connector version earlier than 1.5.36.0, update to the latest version to ensure you have the latest fully supported features.

## Next steps
- Learn more about [Remote access to on-premises applications through Microsoft Entra application proxy](application-proxy.md).
- To start using Application Proxy, see [Tutorial: Add an on-premises application for remote access through Application Proxy](application-proxy-add-on-premises-application.md).
