---
ms.service: azure-arc
ms.topic: include
ms.date: 02/15/2024
---

> [!IMPORTANT]
> Azure Arc agents require the following outbound URLs on `https://:443` to function.
> For `*.servicebus.windows.net`, websockets need to be enabled for outbound access on firewall and proxy.

| Endpoint (DNS) | Description |
| ----------------- | ------------- |
| `https://management.azure.com` | Required for the agent to connect to Azure and register the cluster. |
| `https://<region>.dp.kubernetesconfiguration.azure.com` | Data plane endpoint for the agent to push status and fetch configuration information. |
| `https://login.microsoftonline.com`<br/>`https://<region>.login.microsoft.com`<br/>`login.windows.net`| Required to fetch and update Azure Resource Manager tokens. |
| `https://mcr.microsoft.com`<br/>`https://*.data.mcr.microsoft.com` | Required to pull container images for Azure Arc agents.        |
| `https://gbl.his.arc.azure.com` |  Required to get the regional endpoint for pulling system-assigned Managed Identity certificates. |
| `https://*.his.arc.azure.com` |  Required to pull system-assigned Managed Identity certificates. |
|`https://k8connecthelm.azureedge.net` | `az connectedk8s connect` uses Helm 3 to deploy Azure Arc agents on the Kubernetes cluster. This endpoint is needed for Helm client download to facilitate deployment of the agent helm chart. |
|`guestnotificationservice.azure.com`<br/>`*.guestnotificationservice.azure.com`<br/>`sts.windows.net`<br/>`https://k8sconnectcsp.azureedge.net` | For [Cluster Connect](../cluster-connect.md) and for [Custom Location](../custom-locations.md) based scenarios. |
|`*.servicebus.windows.net` | For [Cluster Connect](../cluster-connect.md) and for [Custom Location](../custom-locations.md) based scenarios. |
|`https://graph.microsoft.com/` | Required when [Azure RBAC](../azure-rbac.md) is configured. |
| `*.arc.azure.net`| Required to manage connected clusters in Azure portal. |
|`https://<region>.obo.arc.azure.com:8084/` | Required when [Cluster Connect](../cluster-connect.md) is configured. |
|`dl.k8s.io`| Required when [automatic agent upgrade](../agent-upgrade.md#toggle-automatic-upgrade-on-or-off-when-connecting-a-cluster-to-azure-arc) is enabled. |

To translate the `*.servicebus.windows.net` wildcard into specific endpoints, use the command:

```rest
GET https://guestnotificationservice.azure.com/urls/allowlist?api-version=2020-01-01&location=<region>
```

[!INCLUDE [arc-region-note](../../includes/arc-region-note.md)]
