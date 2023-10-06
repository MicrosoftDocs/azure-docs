---
author: rashirg
ms.author: rajeshwarig
ms.date: 10/07/2023
ms.topic: include
ms.service: azure-operator-nexus
---

> [!NOTE]
> You can add multiple agent pools during the initial creation of your cluster itself by using the initial agent pool configurations. However, if you want to add agent pools after the initial creation, you can utilize the above command to create additional agent pools for your Nexus Kubernetes cluster.

The following output example resembles successful creation of the agent pools.

```azurepowershell
Get-AzNetworkCloudAgentPool -KubernetesClusterName myNexusK8sCluster `
-ResourceGroupName myResourceGroup `
-SubscriptionId <mySubscription> 

Location  Name                            SystemDataCreatedAt   SystemDataCreatedBy    SystemDataCreatedByType SystemDataLastModifiedAt SystemDataLastModifiedBy
--------  ----                           -------------------   -------------------    ----------------------- ------------------------      ------------
eastus  myNexusK8sCluster-nodepool-1       09/21/2023 18:14:59   <identity>                   User                07/18/2023 17:46:45           <identity>
eastus  myNexusK8sCluster-nodepool-2       09/25/2023 17:44:02   <identity>                   User                07/18/2023 17:46:45           <identity>
```
