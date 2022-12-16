---
ms.service: azure-arc
ms.topic: include
ms.date: 12/13/2022
---


> [!IMPORTANT]
> Azure Arc agents require the following outbound URLs on `https://:443` to function.
> For `*.servicebus.windows.net`, websockets need to be enabled for outbound access on firewall and proxy.

### [Azure Cloud](#tab/azure-cloud)

| Endpoint (DNS) | Description |
| ----------------- | ------------- |
| `https://management.azure.com` | Required for the agent to connect to Azure and register the cluster. |
| `https://<region>.dp.kubernetesconfiguration.azure.com` | Data plane endpoint for the agent to push status and fetch configuration information. |
| `https://login.microsoftonline.com`<br/>`https://<region>.login.microsoft.com`<br/>`login.windows.net`| Required to fetch and update Azure Resource Manager tokens. |
| `https://mcr.microsoft.com`<br/>`https://*.data.mcr.microsoft.com` | Required to pull container images for Azure Arc agents.                                                                  |
| `https://gbl.his.arc.azure.com` |  Required to get the regional endpoint for pulling system-assigned Managed Identity certificates. |
| `https://*.his.arc.azure.com` |  Required to pull system-assigned Managed Identity certificates. |
|`https://k8connecthelm.azureedge.net` | `az connectedk8s connect` uses Helm 3 to deploy Azure Arc agents on the Kubernetes cluster. This endpoint is needed for Helm client download to facilitate deployment of the agent helm chart. |
|`guestnotificationservice.azure.com`<br/>`*.guestnotificationservice.azure.com`<br/>`sts.windows.net`<br/>`https://k8sconnectcsp.azureedge.net` | For [Cluster Connect](../cluster-connect.md) and for [Custom Location](../custom-locations.md) based scenarios. |
|`*.servicebus.windows.net` | For [Cluster Connect](../cluster-connect.md) and for [Custom Location](../custom-locations.md) based scenarios. |
|`https://graph.microsoft.com/` | Required when [Azure RBAC](../azure-rbac.md) is configured |

### [Azure Government](#tab/azure-government)

| Endpoint (DNS) | Description |
| ----------------- | ------------- |
|`https://management.usgovcloudapi.net`  | Required for the agent to connect to Azure and register the cluster. |
| `https://<region>.dp.kubernetesconfiguration.azure.us` | Data plane endpoint for the agent to push status and fetch configuration information. |
| `https://login.microsoftonline.us`<br/>`<region>.login.microsoftonline.us` | Required to fetch and update Azure Resource Manager tokens. |
| `https://mcr.microsoft.com`<br/>`https://*.data.mcr.microsoft.com` | Required to pull container images for Azure Arc agents.                                                                  |
| `https://gbl.his.arc.azure.us` |  Required to get the regional endpoint for pulling system-assigned Managed Identity certificates. |
| `https://usgv.his.arc.azure.us` |  Required to pull system-assigned Managed Identity certificates. |
|`https://k8connecthelm.azureedge.net` | `az connectedk8s connect` uses Helm 3 to deploy Azure Arc agents on the Kubernetes cluster. This endpoint is needed for Helm client download to facilitate deployment of the agent helm chart. |
|`guestnotificationservice.azure.com`<br/>`*.guestnotificationservice.azure.com`<br/>`sts.windows.net`<br/>`https://k8sconnectcsp.azureedge.net` | For [Cluster Connect](../cluster-connect.md) and for [Custom Location](../custom-locations.md) based scenarios. |
|`*.servicebus.windows.net` | For [Cluster Connect](../cluster-connect.md) and for [Custom Location](../custom-locations.md) based scenarios. |
|`https://graph.microsoft.com/` | Required when [Azure RBAC](../azure-rbac.md) is configured |

---

> [!NOTE]
> To translate the `*.servicebus.windows.net` wildcard into specific endpoints, use the command `\GET https://guestnotificationservice.azure.com/urls/allowlist?api-version=2020-01-01&location=<location>`. Within this command, the region must be specified for the `<location>` placeholder.

> [!IMPORTANT]
> To view and manage connected clusters in the Azure portal, be sure that your network allows traffic to `*.arc.azure.net`.