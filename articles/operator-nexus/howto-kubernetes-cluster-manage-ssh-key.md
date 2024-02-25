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
* Ensure that you meet the outlined prerequisites in the quickstart to ensure smooth implementation of the guide.

## Configure Operator Nexus Kubernetes cluster node SSH keys

When you're setting up an Operator Nexus Kubernetes cluster, you need to provide SSH keys for the nodes in the cluster. SSH keys provide a secure method of accessing the nodes in your cluster.

There are a few different ways that you can provide SSH keys for your cluster nodes.

* If you want to use the same SSH key for all nodes in your cluster, you can provide an array of public keys when you create the cluster. These keys are inserted into all agent pool nodes and control plane nodes.
* If you want to use different SSH keys for different agent pools or control plane nodes, you can provide a unique public key for each pool, allows you to manage SSH access more granularly, this overrides the cluster wide keys. Any new agent pool gets added to the cluster later without keys use the cluster wide keys, if it has key then it uses the provided key.
* If you don't provide any SSH keys when creating your cluster, no SSH keys are inserted into the nodes. This means that users can't SSH into the nodes. You can add SSH keys later by updating the cluster configuration, but can't remove those keys once it's added.

Refer the [Disconnected mode access](./howto-kubernetes-cluster-connect.md#disconnected-mode-access) guide for steps to find the cluster node IP address.

### [Azure CLI](#tab/azure-cli)

Following are the variables you need to set, along with the [quickstart guide](./quickstarts-kubernetes-cluster-deployment-cli.md#create-an-azure-nexus-kubernetes-cluster) default values you can use for certain variables.

* `SSH_PUBLIC_KEY` -  For the cluster wide keys. Note that using cluster wide key with agent pool and control plane keys doesn't have any effect as the control plane and agent pool keys are used instead of the cluster wide keys.
* `CONTROL_PLANE_SSH_PUBLIC_KEY` - For the control plane, you can provide public keys that are inserted into the control plane nodes.
* `INITIAL_AGENT_POOL_SSH_PUBLIC_KEY` - For each agent pool, you can provide public keys that are inserted into the nodes in that pool.

```azurecli
    az networkcloud kubernetescluster create \
      --name "${CLUSTER_NAME}" \
      --resource-group "${RESOURCE_GROUP}" \
      --subscription "${SUBSCRIPTION_ID}" \
      --extended-location name="${CUSTOM_LOCATION}" type=CustomLocation \
      --location "${LOCATION}" \
      --kubernetes-version "${K8S_VERSION}" \
      --aad-configuration admin-group-object-ids="[${AAD_ADMIN_GROUP_OBJECT_ID}]" \
      --admin-username "${ADMIN_USERNAME}" \
      --ssh-key-values "${SSH_PUBLIC_KEY}" \
      --control-plane-node-configuration \
        count="${CONTROL_PLANE_COUNT}" \
        vm-sku-name="${CONTROL_PLANE_VM_SIZE}" \
        ssh-key-values='["${CONTROL_PLANE_SSH_PUBLIC_KEY}"]' \
      --initial-agent-pool-configurations "[{count:${INITIAL_AGENT_POOL_COUNT},mode:System,name:${INITIAL_AGENT_POOL_NAME},vm-sku-name:${INITIAL_AGENT_POOL_VM_SIZE},ssh-key-values:['${INITIAL_AGENT_POOL_SSH_PUBLIC_KEY}']}]"\
      --network-configuration \
        cloud-services-network-id="${CSN_ARM_ID}" \
        cni-network-id="${CNI_ARM_ID}" \
        pod-cidrs="[${POD_CIDR}]" \
        service-cidrs="[${SERVICE_CIDR}]" \
        dns-service-ip="${DNS_SERVICE_IP}"
```

### [Azure ARM/Bicep](#tab/other)

The `administratorConfiguration` can be inserted into the `properties` object for the cluster wide keys, and into the `initialAgentPoolConfigurations[].administratorConfiguration` object for each agent pool. The `controlPlaneNodeConfiguration.administratorConfiguration` object is used for the control plane. Update the quickstart ARM template and Bicep templates with the required keys, and in required object.

```arm
    "administratorConfiguration": {
      "adminUsername": "[parameters('adminUsername')]",
      "sshPublicKeys": [
        {
          "keyData": "[parameters('sshPublicKey')]"
        }
      ]
    }
```

```bicep
  administratorConfiguration: {
    adminUsername: adminUsername
    sshPublicKeys: [
      {
        keyData: sshPublicKey
      }
    ]
  }
```

---

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

Use the following command to update the cluster wide SSH keys, which are used for all nodes in the cluster. All the nodes in the cluster will be updated with the new keys if the clster was created with only cluster wide keys.

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
