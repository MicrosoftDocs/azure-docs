---
title: Backend health
titleSuffix: Azure Application Gateway
description: Learn how to view and interpret the backend health report in Azure Application Gateway to monitor server status and troubleshoot unhealthy and unknown states.
services: application-gateway
author: jaesoni
ms.service: azure-application-gateway
ms.topic: concept-article
ms.date: 08/10/2026
ms.author: jaysoni
ms.custom: sfi-image-nochange
# Customer intent: As an IT administrator, I want to monitor the health of backend servers using health probes, so that I can ensure reliable traffic routing and quickly troubleshoot any issues that arise with the application gateway.
---

# Application Gateway - Backend health

Backend health is an Azure Application Gateway report that shows the current status of each backend server. Default and custom health probes continuously monitor the servers in a backend pool, and the gateway sends traffic only to servers that can receive it. This article explains the possible backend health states and how to view the report by using the Azure portal, Azure CLI, REST API, or Azure PowerShell. Use the report to identify unhealthy servers and troubleshoot problems that prevent traffic from reaching your application.

## Backend health report

The possible statuses for a server's health report are:

- **Healthy** - Application Gateway probes receive an expected response code from the backend server.
- **Unhealthy** - Probes don't receive a response, or the response doesn't match the expected response code or body.
- **Unknown** - The Application Gateway control plane can't communicate with the application gateway instances, or the [fully qualified domain name (FQDN) can't be resolved](/troubleshoot/azure/application-gateway/application-gateway-backend-health-troubleshooting#updates-to-the-dns-entries-of-the-backend-pool).

For causes and solutions for the **Unhealthy** and **Unknown** states, see [Troubleshoot backend health issues in Azure Application Gateway](/troubleshoot/azure/application-gateway/application-gateway-backend-health-troubleshooting).

> [!NOTE]
> The backend health report updates based on the respective probe's refresh interval. Refreshing the page or making a backend health API request doesn't update the report immediately.

## Methods to view backend health

You can generate the backend server health report through the Azure portal, REST API, PowerShell, and Azure CLI.

# [Azure portal](#tab/portal)

The Application Gateway portal provides a backend health report with visualizations and troubleshooting tools. Each row shows the target server, its backend pool, its backend setting association (including port and protocol), and the response received by the latest probe. To learn how the report is composed based on the number of backend pools, servers, and backend settings, see [Application Gateway health probes overview](application-gateway-probe-overview.md).

For **Unhealthy** and **Unknown** statuses, you can also use a **Troubleshoot** link that provides the following tools:

1. **Azure Network Watcher Connection troubleshoot** - To learn how to use this tool, see [Manage Connection troubleshoot](../network-watcher/connection-troubleshoot-manage.md).
1. **Backend server certificate visualization** - The visualization shows the client, the application gateway, and the backend server. The troubleshooting details focus on the Transport Layer Security (TLS) connection between the application gateway and the backend server.

    :::image type="content" source="media/application-gateway-backend-health/backend-certificate-error.png" alt-text="Screenshot of backend health details showing an unhealthy TLS connection, a misordered certificate chain, and the expected certificate order.":::

**Reading the illustration**

- A red connection line between the application gateway and backend server marks a problem with the TLS connection.
- Red certificate-chain lines in the backend server block mark a problem with the certificate components. Labels identify the leaf, intermediate, and root certificates, and an **Expected order** column shows the correct sequence.
- Red text in the Application Gateway or Backend Server block identifies a problem with the backend settings or server certificate, respectively.
- Use the error location and the provided solution to determine whether to update the application gateway backend setting or the backend server.

# [Azure CLI](#tab/azure-cli)

Use the [`az network application-gateway show-backend-health`](/cli/azure/network/application-gateway#az-network-application-gateway-show-backend-health) command to view backend health in Azure CLI. The following example shows how to view backend health for an application gateway named *applicationGateway01* in the resource group *resourceGroup*:

```azurecli
az network application-gateway show-backend-health --resource-group resourceGroup --name applicationGateway01
```

# [REST](#tab/rest)

Use the [Application Gateway Backend Health REST operation](/rest/api/application-gateway/application-gateways/backend-health) to view backend health programmatically. The following example shows how to view backend health for an application gateway named *applicationGateway01* in the resource group *resourceGroup*. Replace `{subscriptionId}` with your Azure subscription ID:

```http
POST https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/resourceGroup/providers/Microsoft.Network/applicationGateways/applicationGateway01/backendhealth?api-version=2025-07-01
```

# [Azure PowerShell](#tab/powershell)

Use the [`Get-AzApplicationGatewayBackendHealth`](/powershell/module/az.network/get-azapplicationgatewaybackendhealth) cmdlet to view backend health in Azure PowerShell. The following example shows how to view backend health for an application gateway named *applicationGateway01* in the resource group *resourceGroup*:

```powershell

Get-AzApplicationGatewayBackendHealth -Name applicationGateway01 -ResourceGroupName resourceGroup

```

---

### Example backend health response

The response identifies each backend address pool and backend settings collection. For each server, the `address` field identifies the backend target and the `health` field reports its current status.

The following snippet shows an example of the response:

```json
{
    "backendAddressPools": [
        {
            "backendAddressPool": {
                "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/resourceGroup/providers/Microsoft.Network/applicationGateways/applicationGateway01/backendAddressPools/appGatewayBackendPool"
            },
            "backendHttpSettingsCollection": [
                {
                    "backendHttpSettings": {
                        "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/resourceGroup/providers/Microsoft.Network/applicationGateways/applicationGateway01/backendHttpSettingsCollection/well-known-ca"
                    },
                    "servers": [
                        {
                            "address": "www.cloudflare.com",
                            "health": "Healthy",
                            "healthProbeLog": "Success. Received 200 status code"
                        }
                    ]
                }
            ]
        }
    ]
}
```

## Next steps

- Learn about [Application Gateway health probes](application-gateway-probe-overview.md).
- [Generate a self-signed certificate](self-signed-certificates.md) with a custom root certificate authority (CA).

