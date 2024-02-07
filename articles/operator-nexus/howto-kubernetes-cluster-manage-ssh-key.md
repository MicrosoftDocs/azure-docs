---
title: Manage SSH access on Azure Operator Nexus Kubernetes cluster nodes #Required; page title is displayed in search results. Include the brand.
description: Learn how to configure and manage SSH on Azure Operator Nexus Kubernetes cluster nodes #Required; article description that is displayed in search results. 
author: dramasamy #Required; your GitHub user alias, with correct capitalization.
ms.author: dramasamy #Required; microsoft alias of author; optional team alias.
ms.service: azure-operator-nexus #Required; service per approved list. slug assigned by ACOM.
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 02/06/2024 #Required; mm/dd/yyyy format.
ms.custom: template-how-to-pattern #Required; leave this attribute/value as-is.
---

# Manage SSH keys in Azure Operator Nexus Kubernetes clusters

This article describes how to configure the SSH key on your Nexus Kubernetes agent pools and control plane (CP), during initial deployment or at a later time.

## Prerequisites

Before proceeding with this how-to guide, it's recommended that you:

* Refer to the Operator Nexus Kubernetes cluster [QuickStart guide](./quickstarts-kubernetes-cluster-deployment-bicep.md) for a comprehensive overview and steps involved.
* Ensure that you meet the outlined prerequisites to ensure smooth implementation of the guide.

## Configure Operator Nexus Kubernetes cluster node SSH keys

When you're setting up an Operator Nexus Kubernetes cluster, you need to provide SSH keys for the nodes in the cluster. SSH keys are used to authenticate connections between nodes and to allow you to connect to the nodes for troubleshooting purposes.

There are a few different ways that you can provide SSH keys for your cluster nodes.

* If you want to use the same SSH key for all nodes in your cluster, you can provide an array of public keys when you create the cluster. These keys are inserted into all agent pool nodes and control plane nodes.
* If you want to use different SSH keys for different agent pools or control plane nodes, you can provide a unique public key for each pool, allows you to manage SSH access more granularly. Any new agent pool gets added to the cluster later will inherit the cluster wide keys.
* Here are the Bicep and ARM template properties to provide SSH keys for your cluster nodes:
  * `properties.administratorConfiguration.sshPublicKeys` - For the cluster wide keys.
  * `initialAgentPoolConfigurations[].administratorConfiguration.sshPublicKeys` - For each agent pool, you can provide public keys that are inserted into the nodes in that pool.
  * `controlPlaneNodeConfiguration.administratorConfiguration.sshPublicKeys` - For the control plane, you can provide public keys that are inserted into the control plane nodes.

* If you don't provide any SSH keys when creating your cluster, no SSH keys are inserted into the nodes. This means that users can't SSH into the nodes. You can add SSH keys later by updating the cluster configuration, but can't remove those keys once it's added.
  
## Manage Operator Nexus Kubernetes cluster node SSH keys

You can manage the SSH keys for the nodes in your Operator Nexus Kubernetes cluster after the cluster has been created. Updating the SSH keys is possible, but removing all SSH keys from the cluster node isn't an option. Instead, any new keys provided will replace all existing keys.

To update the SSH keys, you can apply the same Bicep/ARM configuration used during the initial deployment with new keys or use the CLI.

### Limitations

1. You can't remove all SSH keys from the cluster nodes. You can only update them with new keys.
2. If you try to update the cluster wide key with an empty array, the operation succeeds, but the existing keys remain unchanged.
3. If you try to update the agent pool keys or control plane with an empty array, the operation succeeds, and the cluster wide keys are used instead.
4. If you try to update the keys for a cluster that was created without any keys, the new key is added, but you can't remove it.

### Update SSH keys using Azure CLI

#### Update cluster wide SSH keys

Use the following command to update the cluster wide SSH keys, which are used for all nodes in the cluster. All the nodes in the cluster will be updated with the new keys.

```azurecli
az networkcloud kubernetescluster update --name "$CLUSTER_NAME" --resource-group "$RESOURCE_GROUP" --subscription "$SUBSCRIPTION_ID" --ssh-key-values "$CLUSER_WIDE_KEY"
```

#### Update agent pool SSH keys

Use the following command to update the SSH keys for a specific agent pool. All the nodes in the agent pool will be updated with the new keys.

```azurecli
az networkcloud kubernetescluster agentpool update --agent-pool-name "agentpool1" --kubernetes-cluster-name "$CLUSTER_NAME" --resource-group "$RESOURCE_GROUP" --subscription "$SUBSCRIPTION_ID" --ssh-key-values "$AGENT_POOL_KEY"
```

#### Update control plane SSH keys

Use the following command to update the SSH keys for the control plane. All the nodes in the control plane will be updated with the new keys.

```azurecli
az networkcloud kubernetescluster update --name "$CLUSTER_NAME" --resource-group "$RESOURCE_GROUP" --subscription "$SUBSCRIPTION_ID" --control-plane-node-configuration ssh-key-values="['$CONTROL_PLANE_KEY']"
```

## Next steps

By understanding how to configure and manage SSH keys on your Operator Nexus Kubernetes cluster nodes, you can ensure that your cluster is secure and that you can access the nodes when you need to troubleshoot issues.
