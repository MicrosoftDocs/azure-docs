---
title: "Quickstart: Access the Kubernetes API of the Fleet resource"
description: Learn how to access the Kubernetes API of the Fleet resource with Azure Kubernetes Fleet Manager.
ms.topic: quickstart
ms.date: 04/01/2024
author: schaffererin
ms.author: schaffererin
ms.service: kubernetes-fleet
---

# Quickstart: Access the Kubernetes API of the Fleet resource

If your Azure Kubernetes Fleet Manager resource was created with the hub cluster enabled, then it can be used to centrally control scenarios like Kubernetes resource propagation. In this article, you learn how to access the Kubernetes API of the hub cluster managed by the Fleet resource.

## Prerequisites

[!INCLUDE [free trial note](../../includes/quickstarts-free-trial-note.md)]

* You need a Fleet resource with a hub cluster and member clusters. If you don't have one, see [Create an Azure Kubernetes Fleet Manager resource and join member clusters using Azure CLI](quickstart-create-fleet-and-members.md).
* The identity (user or service principal) you're using needs to have the Microsoft.ContainerService/fleets/listCredentials/action on the Fleet resource.

## Access the Kubernetes API of the Fleet resource

1. Set the following environment variables for your subscription ID, resource group, and Fleet resource:

    ```azurecli-interactive
    export SUBSCRIPTION_ID=<subscription-id>
    export GROUP=<resource-group-name>
    export FLEET=<fleet-name>
    ```

2. Set the default Azure subscription to use using the [`az account set`][az-account-set] command.

    ```azurecli-interactive
    az account set --subscription ${SUBSCRIPTION_ID}
    ```

3. Get the kubeconfig file of the hub cluster Fleet resource using the [`az fleet get-credentials`][az-fleet-get-credentials] command.

    ```azurecli-interactive
    az fleet get-credentials --resource-group ${GROUP} --name ${FLEET}
    ```

    Your output should look similar to the following example output:

    ```output
    Merged "hub" as current context in /home/fleet/.kube/config
    ```

4. Set the following environment variable for the `id` of the hub cluster Fleet resource:

    ```azurecli-interactive
    export FLEET_ID=/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${GROUP}/providers/Microsoft.ContainerService/fleets/${FLEET}
    ```

5. Authorize your identity to the hub cluster Fleet resource's Kubernetes API server using the following commands:

    For the `ROLE` environment variable, you can use one of the following four built-in role definitions as the value:

    * Azure Kubernetes Fleet Manager RBAC Reader
    * Azure Kubernetes Fleet Manager RBAC Writer
    * Azure Kubernetes Fleet Manager RBAC Admin
    * Azure Kubernetes Fleet Manager RBAC Cluster Admin

    ```azurecli-interactive
    export IDENTITY=$(az ad signed-in-user show --query "id" --output tsv)
    export ROLE="Azure Kubernetes Fleet Manager RBAC Cluster Admin"
    az role assignment create --role "${ROLE}" --assignee ${IDENTITY} --scope ${FLEET_ID}
    ```

    Your output should look similar to the following example output:

    ```output
    {
      "canDelegate": null,
      "condition": null,
      "conditionVersion": null,
      "description": null,
      "id": "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<GROUP>/providers/Microsoft.ContainerService/fleets/<FLEET>/providers/Microsoft.Authorization/roleAssignments/<assignment>",
      "name": "<name>",
      "principalId": "<id>",
      "principalType": "User",
      "resourceGroup": "<GROUP>",
      "roleDefinitionId": "/subscriptions/<SUBSCRIPTION_ID>/providers/Microsoft.Authorization/roleDefinitions/18ab4d3d-a1bf-4477-8ad9-8359bc988f69",
      "scope": "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<GROUP>/providers/Microsoft.ContainerService/fleets/<FLEET>",
      "type": "Microsoft.Authorization/roleAssignments"
    }
    ```

6. Verify you can access the API server using the `kubectl get memberclusters` command.

    ```bash
    kubectl get memberclusters
    ```

    If successful, your output should look similar to the following example output:

    ```output
    NAME           JOINED   AGE
    aks-member-1   True     2m
    aks-member-2   True     2m
    aks-member-3   True     2m
    ```

## Next steps

* [Propagate resources from a Fleet hub cluster to member clusters](./quickstart-resource-propagation.md).

<!-- LINKS --->
[fleet-apispec]: https://github.com/Azure/fleet/blob/main/docs/api-references.md
[troubleshooting-guide]: https://github.com/Azure/fleet/blob/main/docs/troubleshooting/README.md
[az-fleet-get-credentials]: /cli/azure/fleet#az-fleet-get-credentials
[az-account-set]: /cli/azure/account#az-account-set
