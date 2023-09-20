---
title: Backend health
titleSuffix: Azure Application Gateway
description: Learn how to use Backend health report in Azure Application Gateway
services: application-gateway
author: jaesoni
ms.service: application-gateway
ms.topic: article
ms.date: 09/19/2023
ms.author: jaysoni 
---

# Application Gateway - Backend health

Application Gateway health probes (default and custom) continuously monitor all the backend servers in a pool to ensure the incoming traffic is sent only to the servers that are up and running. These health checks enable a seamless data plane operation of a gateway. When a backend server can receive traffic, the probe is successful and considered healthy. Otherwise, it's considered unhealthy. The precise representation of the health probes report is also made available for your consumption through the Backend Health capability.

## Backend health report
The possible statuses for a server's health report are:
1. Healthy - Shows when the application gateway probes receive an expected response code from the backend server.
1. Unhealthy - Shows when probes don't receive a response, or the response doesn't match the expected response code or body.
1. Unknown - Occurs when the application gateway's control plane fails to communicate (for Backend Health call) with your application gateway instances or in case of [DNS resolution](application-gateway-backend-health-troubleshooting.md#updates-to-the-dns-entries-of-the-backend-pool) of the backend server's FQDN.

For complete information on the cause and solution of the Unhealthy and Unknown states, visit the [troubleshooting article](application-gateway-backend-health-troubleshooting.md).

> [!NOTE]
> The Backend health report is updated based on the respective probe's refresh interval and doesn't depend on the moment of page refresh or Backend health API request.

## Methods to view Backend health
The backend server health report can be generated through the Azure portal, REST API, PowerShell, and Azure CLI.

### Azure portal
The Application Gateway portal provides an information-rich backend health report with visualizations and tools for faster troubleshooting. Each row shows the exact target server, the backend pool it belongs to, its backend setting association (including port and protocol), and the response received by the latest probe. Visit the [Health Probes article](application-gateway-probe-overview.md) to understand how this report is composed based on the number of Backend pools, servers, and Backend settings.

For Unhealthy and Unknown statuses, you will also find a Troubleshoot link presenting you with the following tools:

1. **Azure Network Watcher's Connection troubleshoot** - Visit the [Connection Troubleshoot](../network-watcher/network-watcher-connectivity-portal.md) documentation article to learn how to use this tool. 
1. **Backend server certificate visualization** - The Backend server certificate visualization makes it easy to understand the problem area, allowing you to act on the problem quickly. The three core components in the illustration provide you with a complete picture — The client, the Application Gateway, and the Backend Server. However, the problems explained in this troubleshooting section only focus on the TLS connection between the application gateway and the backend server.

:::image type="content" source="media/application-gateway-backend-health/backend-cert-error.png" alt-text="Visualization showing certificate error on the Backend Health page":::

**Reading the illustration**
- The red lines indicate a problem with the TLS connection between the gateway and the backend server or the certificate components on the backend server.
- The red text in the Application Gateway or the Backend Server blocks indicate problems with the Backend Settings or the server certificate, respectively.
- You must act on the respective property (Application Gateway's Backend Setting or the Backend Server) depending on the error indication and location.
- A solution for each error type is available at the top, or you can visit the given documentation link to know more.


