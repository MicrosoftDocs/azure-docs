---
title: Configure and manage SSH keys on Azure Operator Nexus Kubernetes cluster nodes #Required; page title is displayed in search results. Include the brand.
description: Learn how to configure and manage SSH keys on Azure Operator Nexus Kubernetes cluster nodes. #Required; article description that is displayed in search results. 
author: dramasamy #Required; your GitHub user alias, with correct capitalization.
ms.author: dramasamy #Required; microsoft alias of author; optional team alias.
ms.service: azure-operator-nexus #Required; service per approved list. slug assigned by ACOM.
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 02/06/2024 #Required; mm/dd/yyyy format.
ms.custom: template-how-to-pattern #Required; leave this attribute/value as-is.
---

# Configure and manage SSH keys on Azure Operator Nexus Kubernetes cluster nodes

This article describes how to configure and manage the SSH key on your Nexus Kubernetes agent pool and control plane nodes. SSH keys provide a secure method of accessing these nodes in your cluster.

## Prerequisites

Before proceeding with this how-to guide, it's recommended that you:

* Refer to the Operator Nexus Kubernetes cluster [QuickStart guide](./quickstarts-kubernetes-cluster-deployment-bicep.md) for a comprehensive overview and steps involved.
* Ensure that you meet the outlined prerequisites in the quickstart to ensure smooth implementation of the guide.

> [!NOTE]
> This guide assumes that you already have an existing Operator Nexus Kubernetes cluster that was created using the quickstart guide, and that you have access to either the CLI, ARM template, or Bicep used in the quickstart to update the SSH keys.

## Configure Operator Nexus Kubernetes cluster node SSH keys

When configuring an Operator Nexus Kubernetes cluster, you need to provide SSH keys for the nodes in the cluster. SSH keys provide a secure method of accessing these nodes in your cluster.

There are a few different ways that you can provide SSH keys for your cluster nodes.

* If you want to use the same SSH key for all nodes in your cluster, you can provide an array of public keys when you create the cluster. These keys are inserted into all agent pool nodes and control plane nodes.
* If you want to use different SSH keys for different agent pools or control plane nodes, you can provide a unique public key for each pool, allows you to manage SSH access more granularly, this overrides the cluster wide keys. Any new agent pool gets added to the cluster later without keys use the cluster wide keys, if it has key then it uses the provided key.
* If you don't provide any SSH keys when creating your cluster, no SSH keys are inserted into the nodes. This means that users can't SSH into the nodes. You can add SSH keys later by updating the cluster configuration, but can't remove those keys once added.

### [Azure CLI](#tab/azure-cli)

Following are the variables you need to set, along with the [QuickStart guide](./quickstarts-kubernetes-cluster-deployment-cli.md#create-an-azure-nexus-kubernetes-cluster) default values you can use for certain variables.

* `SSH_PUBLIC_KEY` -  For the cluster wide keys. Using cluster wide key with agent pool and control plane keys doesn't have any effect as the control plane and agent pool keys are used instead of the cluster wide keys.
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

### [ARM template](#tab/other)

The `administratorConfiguration` can be inserted into the `properties` object for the cluster wide keys, and into the `initialAgentPoolConfigurations[].administratorConfiguration` object for each agent pool. The `controlPlaneNodeConfiguration.administratorConfiguration` object is used for the control plane.

Update the quickstart ARM template or Bicep parameter file with the required keys so that the keys are inserted into the nodes when the cluster is created.

#### To provide cluster wide keys

```json
    "sshPublicKeys": {
      "value": [
        {
          "keyData": "ssh-rsa AAAAA...."
        },
        {
          "keyData": "ssh-rsa BBBBB...."
        }
      ]
    }
```

#### To provide keys for the control plane

```json
    "controlPlaneSshKeys": {
      "value": [
        {
          "keyData": "ssh-rsa CCCCC...."
        },
        {
          "keyData": "ssh-rsa DDDDD...."
        }
      ]
    }
```

#### To provide keys for the agent pool

```json
    "agentPoolSshKeys": {
      "value": [
        {
          "keyData": "ssh-rsa EEEEE...."
        },
        {
          "keyData": "ssh-rsa FFFFF...."
        }
      ]
    }
```

Apply the ARM template or Bicep to create the cluster.

---

## Manage Operator Nexus Kubernetes cluster node SSH keys

You can manage the SSH keys for the nodes in your Operator Nexus Kubernetes cluster after the cluster has been created. Updating the SSH keys is possible, but removing all SSH keys from the cluster node isn't an option. Instead, any new keys provided will replace all existing keys.

To update the SSH keys, you can apply the same Bicep/ARM configuration used during the initial deployment with new keys or use the CLI.

### Limitations

- You can't remove SSH keys from the cluster nodes. You can only update them with new keys.
- If you try to update the cluster wide key with an empty array, the operation succeeds, but the existing keys remain unchanged.
- If you try to update the agent pool keys or control plane with an empty array, the operation succeeds, and the cluster wide keys are used instead.
- If you try to update the keys for a cluster that was created without any keys, the new key is added, but you can't remove it.

### Before you begin

- Ensure that you have the required permissions to update the cluster configuration.
- You have the new SSH keys that you want to use for the cluster nodes.
- You have the parameters file used during the initial deployment or the variables used in the CLI command.
- To use this guide, you must have an existing Operator Nexus Kubernetes cluster that was created using the quickstart guide.

### Update cluster wide SSH keys

Use the following command to update the cluster wide SSH keys, which are used for all nodes in the cluster. The existing keys are replaced with the new keys.

> [!NOTE]
> This works only if the cluster was created with cluster wide keys. If the cluster was created with agent pool or control plane keys, this operation has no effect. Refer the next sections to update agent pool or control plane keys.

#### Azure CLI to update cluster wide SSH keys

1. Set the `SSH_PUBLIC_KEY` variable with the new SSH key.

```bash
SSH_PUBLIC_KEY="ssh-rsa CCCCC...."
```

2. Use the following command to update the cluster wide SSH keys.

```azurecli
az networkcloud kubernetescluster update --name "$CLUSTER_NAME" --resource-group "$RESOURCE_GROUP" --subscription "$SUBSCRIPTION_ID" --ssh-key-values "$SSH_PUBLIC_KEY"
```

#### Azure Resource Manager (ARM) and Bicep to update cluster wide SSH keys

1. Update the `sshPublicKeys` parameter in `kubernetes-deploy-parameters.json` with the new SSH key.

```json
    "sshPublicKeys": {
      "value": [
        {
          "keyData": "ssh-rsa CCCCC...."
        }
      ]
    }
```

2. Redeploy the template.

For ARM template:

```azurecli
    az deployment group create --resource-group myResourceGroup --template-file kubernetes-deploy.json --parameters @kubernetes-deploy-parameters.json
```

For Bicep:

```azurecli
    az deployment group create --resource-group myResourceGroup --template-file kubernetes-deploy.bicep --parameters @kubernetes-deploy-parameters.json
```

### Update agent pool SSH keys

Use the following command to update the SSH keys for a specific agent pool.

* All the nodes in the agent pool will be updated with the new keys.
* If the agent pool was created with keys, the new keys replace the existing keys.
* If the agent pool was created without keys, the new keys are added.
* If the agent pool was created with cluster wide keys, the new keys replace the existing keys.
* If you try to update the keys for a cluster that was created without any keys, the new key is added, but you can't remove it.
* If you try to update the agent pool keys with an empty array, the operation succeeds, and the cluster wide keys are used instead.

#### Azure CLI to update agent pool SSH keys

1. Set the `AGENT_POOL_KEY` variable with the new SSH key.

```bash
AGENT_POOL_KEY="ssh-rsa DDDDD...."
```

2. Use the following command to update the agent pool SSH keys.

```azurecli
az networkcloud kubernetescluster agentpool update --agent-pool-name "${CLUSTER_NAME}-nodepool-2" --kubernetes-cluster-name "$CLUSTER_NAME" --resource-group "$RESOURCE_GROUP" --subscription "$SUBSCRIPTION_ID" --ssh-key-values "$AGENT_POOL_KEY"
```

#### Azure ARM template and Bicep to update agent pool SSH keys

> [!NOTE]
> Updating node pools created through initial agent pool configuration is not possible with this method, as there is no separate agent pool template and parameter file. Only the agent pool keys for pools created after cluster creation can be updated using this method. To update the keys for the initial agent pool, refer to the CLI command provided in the previous section. If the initial agent pool was created with cluster wide keys, and if you want to update the keys for the initial agent pool, you can update the cluster wide keys.

1. Update the `agentPoolSshKeys` parameter in `kubernetes-nodepool-parameters.json` with the new SSH key.

```json
    "agentPoolSshKeys": {
      "value": [
        {
          "keyData": "ssh-rsa DDDDD...."
        }
      ]
    }
```

2. Redeploy the template.

For ARM template:

```azurecli
    az deployment group create --resource-group myResourceGroup --template-file kubernetes-add-agentpool.json --parameters @kubernetes-nodepool-parameters.json
```

For Bicep:

```azurecli
    az deployment group create --resource-group myResourceGroup --template-file kubernetes-add-agentpool.bicep --parameters @kubernetes-nodepool-parameters.json
```

### Update control plane SSH keys

Use the following command to update the SSH keys for the control plane.

* All the nodes in the control plane will be updated with the new keys.
* If the control plane was created with keys, the new keys replace the existing keys.
* If the control plane was created without keys, the new keys are added.
* If the control plane was created with cluster wide keys, the new keys replace the existing keys.
* If you try to update the keys for a cluster that was created without any keys, the new key is added, but you can't remove it.
* If you try to update the control plane keys with an empty array, the operation succeeds, and the cluster wide keys are used instead.

> [!NOTE]
> The control plane keys can be updated using the initial deployment template and parameter file, as the control plane is a part of the cluster. However, agent pool keys cannot be updated in the same way, as the agent pool is a sub-resource, unless the agent pool uses cluster wide keys.

#### Azure CLI to update control plane SSH keys

1. Set the `CONTROL_PLANE_SSH_PUBLIC_KEY` variable with the new SSH key.

```bash
CONTROL_PLANE_SSH_PUBLIC_KEY="ssh-rsa EEEEE...."
```

2. Use the following command to update the control plane SSH keys.

```azurecli
az networkcloud kubernetescluster update --name "$CLUSTER_NAME" --resource-group "$RESOURCE_GROUP" --subscription "$SUBSCRIPTION_ID" --control-plane-node-configuration ssh-key-values="['$CONTROL_PLANE_SSH_PUBLIC_KEY']"
```

#### Azure ARM template and Bicep to update control plane SSH keys

1. Update the `controlPlaneSshKeys` parameter in `kubernetes-deploy-parameters.json` with the new SSH key.

```json
    "controlPlaneSshKeys": {
      "value": [
        {
          "keyData": "ssh-rsa EEEEE...."
        }
      ]
    }
```

2. Redeploy the template.

For ARM template:

```azurecli
    az deployment group create --resource-group myResourceGroup --template-file kubernetes-deploy.json --parameters @kubernetes-deploy-parameters.json
```

For Bicep:

```azurecli
    az deployment group create --resource-group myResourceGroup --template-file kubernetes-deploy.bicep --parameters @kubernetes-deploy-parameters.json
```

## Next steps

By understanding how to configure and manage SSH keys on your Operator Nexus Kubernetes cluster nodes, you can ensure that your cluster is secure and that you can access the nodes when you need to troubleshoot issues.
