---
ms.service: azure-arc
ms.topic: include
ms.date: 02/15/2024
---

> [!IMPORTANT]
> Azure Arc agents require the following outbound URLs on `https://:443` to function.
> For `*.servicebus.usgovcloudapi.net`, websockets need to be enabled for outbound access on firewall and proxy.

| Endpoint (DNS) | Description |
| ----------------- | ------------- |
|`https://management.usgovcloudapi.net`  | Required for the agent to connect to Azure and register the cluster. |
| `https://<region>.dp.kubernetesconfiguration.azure.us` | Data plane endpoint for the agent to push status and fetch configuration information. |
| `https://login.microsoftonline.us`<br/>`<region>.login.microsoftonline.us` | Required to fetch and update Azure Resource Manager tokens. |
| `https://mcr.microsoft.com`<br/>`https://*.data.mcr.microsoft.com` | Required to pull container images for Azure Arc agents.       |
| `https://gbl.his.arc.azure.us` |  Required to get the regional endpoint for pulling system-assigned Managed Identity certificates. |
| `https://usgv.his.arc.azure.us` |  Required to pull system-assigned Managed Identity certificates. |
|`https://k8connecthelm.azureedge.net` | `az connectedk8s connect` uses Helm 3 to deploy Azure Arc agents on the Kubernetes cluster. This endpoint is needed for Helm client download to facilitate deployment of the agent helm chart. |
|`guestnotificationservice.azure.us`<br/>`*.guestnotificationservice.azure.us`<br/>`sts.windows.net`<br/>`https://k8sconnectcsp.azureedge.net` | For [Cluster Connect](../cluster-connect.md) and for [Custom Location](../custom-locations.md) based scenarios. |
|`*.servicebus.usgovcloudapi.net` | For [Cluster Connect](../cluster-connect.md) and for [Custom Location](../custom-locations.md) based scenarios. |
|`https://graph.microsoft.com/` | Required when [Azure RBAC](../azure-rbac.md) is configured. |
|`https://usgovvirginia.obo.arc.azure.us:8084/` | Required when [Cluster Connect](../cluster-connect.md) is configured. |
|`dl.k8s.io`| Required when [automatic agent upgrade](../agent-upgrade.md#toggle-automatic-upgrade-on-or-off-when-connecting-a-cluster-to-azure-arc) is enabled. |

To translate the `*.servicebus.usgovcloudapi.net` wildcard into specific endpoints, use the command:

```rest
GET https://guestnotificationservice.azure.us/urls/allowlist?api-version=2020-01-01&location=region
```

[!INCLUDE [arc-region-note](../../includes/arc-region-note.md)]
