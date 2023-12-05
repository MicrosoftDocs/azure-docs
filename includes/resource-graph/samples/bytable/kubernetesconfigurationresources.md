---
author: davidsmatlak
ms.service: resource-graph
ms.topic: include
ms.date: 07/07/2022
ms.author: davidsmatlak
ms.custom: generated
---

### List all Azure Arc-enabled Kubernetes clusters with Azure Monitor extension

Returns the connected cluster ID of each Azure Arc-enabled Kubernetes cluster that has the Azure Monitor extension installed.

```kusto
KubernetesConfigurationResources
| where type == 'microsoft.kubernetesconfiguration/extensions'
| where properties.ExtensionType  == 'microsoft.azuremonitor.containers'
| parse id with connectedClusterId '/providers/Microsoft.KubernetesConfiguration/Extensions' *
| project connectedClusterId
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "KubernetesConfigurationResources | where type == 'microsoft.kubernetesconfiguration/extensions' | where properties.ExtensionType == 'microsoft.azuremonitor.containers' | parse id with connectedClusterId '/providers/Microsoft.KubernetesConfiguration/Extensions' * | project connectedClusterId"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "KubernetesConfigurationResources | where type == 'microsoft.kubernetesconfiguration/extensions' | where properties.ExtensionType == 'microsoft.azuremonitor.containers' | parse id with connectedClusterId '/providers/Microsoft.KubernetesConfiguration/Extensions' * | project connectedClusterId"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/KubernetesConfigurationResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.kubernetesconfiguration%2fextensions%27%0a%7c%20where%20properties.ExtensionType%20%20%3d%3d%20%27microsoft.azuremonitor.containers%27%0a%7c%20parse%20id%20with%20connectedClusterId%20%27%2fproviders%2fMicrosoft.KubernetesConfiguration%2fExtensions%27%20*%0a%7c%20project%20connectedClusterId" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/KubernetesConfigurationResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.kubernetesconfiguration%2fextensions%27%0a%7c%20where%20properties.ExtensionType%20%20%3d%3d%20%27microsoft.azuremonitor.containers%27%0a%7c%20parse%20id%20with%20connectedClusterId%20%27%2fproviders%2fMicrosoft.KubernetesConfiguration%2fExtensions%27%20*%0a%7c%20project%20connectedClusterId" target="_blank">portal.azure.us</a>
- Microsoft Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/KubernetesConfigurationResources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.kubernetesconfiguration%2fextensions%27%0a%7c%20where%20properties.ExtensionType%20%20%3d%3d%20%27microsoft.azuremonitor.containers%27%0a%7c%20parse%20id%20with%20connectedClusterId%20%27%2fproviders%2fMicrosoft.KubernetesConfiguration%2fExtensions%27%20*%0a%7c%20project%20connectedClusterId" target="_blank">portal.azure.cn</a>

---

### List all Azure Arc-enabled Kubernetes clusters without Azure Monitor extension

Returns the connected cluster ID of each Azure Arc-enabled Kubernetes cluster that is missing the Azure Monitor extension.

```kusto
Resources
| where type =~ 'Microsoft.Kubernetes/connectedClusters' | extend connectedClusterId = tolower(id) | project connectedClusterId 
| join kind = leftouter
	(KubernetesConfigurationResources
	| where type == 'microsoft.kubernetesconfiguration/extensions'
	| where properties.ExtensionType  == 'microsoft.azuremonitor.containers'
	| parse tolower(id) with connectedClusterId '/providers/microsoft.kubernetesconfiguration/extensions' *
	| project connectedClusterId
)  on connectedClusterId
| where connectedClusterId1 == ''
| project connectedClusterId
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "Resources | where type =~ 'Microsoft.Kubernetes/connectedClusters' | extend connectedClusterId = tolower(id) | project connectedClusterId | join kind = leftouter (KubernetesConfigurationResources | where type == 'microsoft.kubernetesconfiguration/extensions' | where properties.ExtensionType == 'microsoft.azuremonitor.containers' | parse tolower(id) with connectedClusterId '/providers/microsoft.kubernetesconfiguration/extensions' * | project connectedClusterId ) on connectedClusterId | where connectedClusterId1 == '' | project connectedClusterId"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "Resources | where type =~ 'Microsoft.Kubernetes/connectedClusters' | extend connectedClusterId = tolower(id) | project connectedClusterId | join kind = leftouter (KubernetesConfigurationResources | where type == 'microsoft.kubernetesconfiguration/extensions' | where properties.ExtensionType == 'microsoft.azuremonitor.containers' | parse tolower(id) with connectedClusterId '/providers/microsoft.kubernetesconfiguration/extensions' * | project connectedClusterId ) on connectedClusterId | where connectedClusterId1 == '' | project connectedClusterId"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.Kubernetes%2fconnectedClusters%27%20%7c%20extend%20connectedClusterId%20%3d%20tolower(id)%20%7c%20project%20connectedClusterId%20%0a%7c%20join%20kind%20%3d%20leftouter%0a%09(KubernetesConfigurationResources%0a%09%7c%20where%20type%20%3d%3d%20%27microsoft.kubernetesconfiguration%2fextensions%27%0a%09%7c%20where%20properties.ExtensionType%20%20%3d%3d%20%27microsoft.azuremonitor.containers%27%0a%09%7c%20parse%20tolower(id)%20with%20connectedClusterId%20%27%2fproviders%2fmicrosoft.kubernetesconfiguration%2fextensions%27%20*%0a%09%7c%20project%20connectedClusterId%0a)%20%20on%20connectedClusterId%0a%7c%20where%20connectedClusterId1%20%3d%3d%20%27%27%0a%7c%20project%20connectedClusterId" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.Kubernetes%2fconnectedClusters%27%20%7c%20extend%20connectedClusterId%20%3d%20tolower(id)%20%7c%20project%20connectedClusterId%20%0a%7c%20join%20kind%20%3d%20leftouter%0a%09(KubernetesConfigurationResources%0a%09%7c%20where%20type%20%3d%3d%20%27microsoft.kubernetesconfiguration%2fextensions%27%0a%09%7c%20where%20properties.ExtensionType%20%20%3d%3d%20%27microsoft.azuremonitor.containers%27%0a%09%7c%20parse%20tolower(id)%20with%20connectedClusterId%20%27%2fproviders%2fmicrosoft.kubernetesconfiguration%2fextensions%27%20*%0a%09%7c%20project%20connectedClusterId%0a)%20%20on%20connectedClusterId%0a%7c%20where%20connectedClusterId1%20%3d%3d%20%27%27%0a%7c%20project%20connectedClusterId" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/Resources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.Kubernetes%2fconnectedClusters%27%20%7c%20extend%20connectedClusterId%20%3d%20tolower(id)%20%7c%20project%20connectedClusterId%20%0a%7c%20join%20kind%20%3d%20leftouter%0a%09(KubernetesConfigurationResources%0a%09%7c%20where%20type%20%3d%3d%20%27microsoft.kubernetesconfiguration%2fextensions%27%0a%09%7c%20where%20properties.ExtensionType%20%20%3d%3d%20%27microsoft.azuremonitor.containers%27%0a%09%7c%20parse%20tolower(id)%20with%20connectedClusterId%20%27%2fproviders%2fmicrosoft.kubernetesconfiguration%2fextensions%27%20*%0a%09%7c%20project%20connectedClusterId%0a)%20%20on%20connectedClusterId%0a%7c%20where%20connectedClusterId1%20%3d%3d%20%27%27%0a%7c%20project%20connectedClusterId" target="_blank">portal.azure.cn</a>

---

### List all ConnectedClusters and ManagedClusters that contain a Flux Configuration

Returns the connectedCluster and managedCluster Ids for clusters that contain at least one fluxConfiguration.

```kusto
resources
| where type =~ 'Microsoft.Kubernetes/connectedClusters' or type =~ 'Microsoft.ContainerService/managedClusters' | extend clusterId = tolower(id) | project clusterId
| join
( kubernetesconfigurationresources
| where type == 'microsoft.kubernetesconfiguration/fluxconfigurations'
| parse tolower(id) with clusterId '/providers/microsoft.kubernetesconfiguration/fluxconfigurations' *
| project clusterId
) on clusterId
| project clusterId
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "resources | where type =~ 'Microsoft.Kubernetes/connectedClusters' or type =~ 'Microsoft.ContainerService/managedClusters' | extend clusterId = tolower(id) | project clusterId | join ( kubernetesconfigurationresources | where type == 'microsoft.kubernetesconfiguration/fluxconfigurations' | parse tolower(id) with clusterId '/providers/microsoft.kubernetesconfiguration/fluxconfigurations' * | project clusterId ) on clusterId | project clusterId"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "resources | where type =~ 'Microsoft.Kubernetes/connectedClusters' or type =~ 'Microsoft.ContainerService/managedClusters' | extend clusterId = tolower(id) | project clusterId | join ( kubernetesconfigurationresources | where type == 'microsoft.kubernetesconfiguration/fluxconfigurations' | parse tolower(id) with clusterId '/providers/microsoft.kubernetesconfiguration/fluxconfigurations' * | project clusterId ) on clusterId | project clusterId"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/resources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.Kubernetes%2fconnectedClusters%27%20or%20type%20%3d%7e%20%27Microsoft.ContainerService%2fmanagedClusters%27%20%7c%20extend%20clusterId%20%3d%20tolower(id)%20%7c%20project%20clusterId%0a%7c%20join%0a(%20kubernetesconfigurationresources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.kubernetesconfiguration%2ffluxconfigurations%27%0a%7c%20parse%20tolower(id)%20with%20clusterId%20%27%2fproviders%2fmicrosoft.kubernetesconfiguration%2ffluxconfigurations%27%20*%0a%7c%20project%20clusterId%0a)%20on%20clusterId%0a%7c%20project%20clusterId" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/resources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.Kubernetes%2fconnectedClusters%27%20or%20type%20%3d%7e%20%27Microsoft.ContainerService%2fmanagedClusters%27%20%7c%20extend%20clusterId%20%3d%20tolower(id)%20%7c%20project%20clusterId%0a%7c%20join%0a(%20kubernetesconfigurationresources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.kubernetesconfiguration%2ffluxconfigurations%27%0a%7c%20parse%20tolower(id)%20with%20clusterId%20%27%2fproviders%2fmicrosoft.kubernetesconfiguration%2ffluxconfigurations%27%20*%0a%7c%20project%20clusterId%0a)%20on%20clusterId%0a%7c%20project%20clusterId" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/resources%0a%7c%20where%20type%20%3d%7e%20%27Microsoft.Kubernetes%2fconnectedClusters%27%20or%20type%20%3d%7e%20%27Microsoft.ContainerService%2fmanagedClusters%27%20%7c%20extend%20clusterId%20%3d%20tolower(id)%20%7c%20project%20clusterId%0a%7c%20join%0a(%20kubernetesconfigurationresources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.kubernetesconfiguration%2ffluxconfigurations%27%0a%7c%20parse%20tolower(id)%20with%20clusterId%20%27%2fproviders%2fmicrosoft.kubernetesconfiguration%2ffluxconfigurations%27%20*%0a%7c%20project%20clusterId%0a)%20on%20clusterId%0a%7c%20project%20clusterId" target="_blank">portal.azure.cn</a>

---

### List All Flux Configurations that Are in a Non-Compliant State

Returns the fluxConfiguration Ids of configurations that are failing to sync resources on the cluster.

```kusto
kubernetesconfigurationresources
| where type == 'microsoft.kubernetesconfiguration/fluxconfigurations'
| where properties.complianceState == 'Non-Compliant'
| project id
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "kubernetesconfigurationresources | where type == 'microsoft.kubernetesconfiguration/fluxconfigurations' | where properties.complianceState == 'Non-Compliant' | project id"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "kubernetesconfigurationresources | where type == 'microsoft.kubernetesconfiguration/fluxconfigurations' | where properties.complianceState == 'Non-Compliant' | project id"
```

# [Portal](#tab/azure-portal)

:::image type="icon" source="../../../../articles/governance/resource-graph/media/resource-graph-small.png"::: Try this query in Azure Resource Graph Explorer:

- Azure portal: <a href="https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/kubernetesconfigurationresources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.kubernetesconfiguration%2ffluxconfigurations%27%0a%7c%20where%20properties.complianceState%20%3d%3d%20%27Non-Compliant%27%0a%7c%20project%20id" target="_blank">portal.azure.com</a>
- Azure Government portal: <a href="https://portal.azure.us/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/kubernetesconfigurationresources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.kubernetesconfiguration%2ffluxconfigurations%27%0a%7c%20where%20properties.complianceState%20%3d%3d%20%27Non-Compliant%27%0a%7c%20project%20id" target="_blank">portal.azure.us</a>
- Azure operated by 21Vianet portal: <a href="https://portal.azure.cn/?feature.customportal=false#blade/HubsExtension/ArgQueryBlade/query/kubernetesconfigurationresources%0a%7c%20where%20type%20%3d%3d%20%27microsoft.kubernetesconfiguration%2ffluxconfigurations%27%0a%7c%20where%20properties.complianceState%20%3d%3d%20%27Non-Compliant%27%0a%7c%20project%20id" target="_blank">portal.azure.cn</a>

---

