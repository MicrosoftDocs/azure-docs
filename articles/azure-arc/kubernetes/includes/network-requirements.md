---
ms.service: azure-arc
ms.topic: include
ms.date: 09/28/2023
---

### [Azure Cloud](#tab/azure-cloud)

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

### [Azure Government](#tab/azure-government)

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

#### [Microsoft Azure operated by 21Vianet](#tab/azure-china)

> [!IMPORTANT]
> Azure Arc agents require the following outbound URLs on `https://:443` to function.
> For `*.servicebus.chinacloudapi.cn`, websockets need to be enabled for outbound access on firewall and proxy.

| Endpoint (DNS) | Description |
| ----------------- | ------------- |
| `https://management.chinacloudapi.cn` | Required for the agent to connect to Azure and register the cluster. |
| `https://<region>.dp.kubernetesconfiguration.azure.cn` | Data plane endpoint for the agent to push status and fetch configuration information. |
| `https://login.chinacloudapi.cn`<br/>`https://<region>.login.chinacloudapi.cn`<br/>`login.partner.microsoftonline.cn`| Required to fetch and update Azure Resource Manager tokens. |
| `mcr.azk8s.cn` | Required to pull container images for Azure Arc agents.          |
| `https://gbl.his.arc.azure.cn` |  Required to get the regional endpoint for pulling system-assigned Managed Identity certificates. |
| `https://*.his.arc.azure.cn` |  Required to pull system-assigned Managed Identity certificates. |
|`https://k8connecthelm.azureedge.net` | `az connectedk8s connect` uses Helm 3 to deploy Azure Arc agents on the Kubernetes cluster. This endpoint is needed for Helm client download to facilitate deployment of the agent helm chart. |
|`guestnotificationservice.azure.cn`<br/>`*.guestnotificationservice.azure.cn`<br/>`sts.chinacloudapi.cn`<br/>`https://k8sconnectcsp.azureedge.net` | For [Cluster Connect](../cluster-connect.md) and for [Custom Location](../custom-locations.md) based scenarios. |
|`*.servicebus.chinacloudapi.cn` | For [Cluster Connect](../cluster-connect.md) and for [Custom Location](../custom-locations.md) based scenarios. |
|`https://graph.chinacloudapi.cn/` | Required when [Azure RBAC](../azure-rbac.md) is configured. |
|`*.arc.azure.cn` | Required to manage connected clusters in Azure portal.|
|`https://<region>.obo.arc.azure.cn:8084/` | Required when [Cluster Connect](../cluster-connect.md) is configured. |
|`dl.k8s.io`| Required when [automatic agent upgrade](../agent-upgrade.md#toggle-automatic-upgrade-on-or-off-when-connecting-a-cluster-to-azure-arc) is enabled. |
|`quay.azk8s.cn`<br/>`registryk8s.azk8s.cn`<br/>`k8sgcr.azk8s.cn`<br/>`usgcr.azk8s.cn`<br/>`dockerhub.azk8s.cn/<repo-name>/<image-name>:<version>`|Container registry proxy servers for Azure China VMs.|