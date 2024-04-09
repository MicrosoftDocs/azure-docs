---
author: rashirg
ms.author: rajeshwarig
ms.date: 09/27/2023
ms.topic: include
ms.service: azure-operator-nexus
---

After the deployment finishes, you can view the resources using the PowerShell or the Azure portal.

To view the details of the ```myNexusK8sCluster``` cluster in the ```myResourceGroup``` resource group, execute the following Azure PowerShell command:

```azurepowershell-interactive
Get-AzNetworkCloudKubernetesCluster -KubernetesClusterName myNexusK8sCluster `
-ResourceGroupName myResourceGroup `
-SubscriptionId <mySubscription>
```

Additionally, to get a list of agent pool names associated with the ```myNexusK8sCluster``` cluster in the ```myResourceGroup``` resource group, you can use the following Azure PowerShell command.

```azurepowershell-interactive
 Get-AzNetworkCloudAgentPool -KubernetesClusterName myNexusK8sCluster `
 -ResourceGroupName myResourceGroup `
 -SubscriptionId <mySubscription>
```