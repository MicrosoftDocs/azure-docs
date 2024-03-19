---
title: "Access the Kubernetes API of the Fleet resource"
description: Learn how to access the Kubernetes API of the Fleet resource.
ms.topic: how-to
ms.date: 03/18/2024
author: shashankbarsin
ms.author: shasb
ms.service: kubernetes-fleet
ms.custom:
  - ignite-2023
---

# Access the Kubernetes API of the Fleet resource with Azure Kubernetes Fleet Manager

If your Azure Kubernetes Fleet Manager resource was created with the hub cluster enabled, then it can be used to centrally control scenarios like Kubernetes object propagation. In this article, you learn how to access the Kubernetes API of the Fleet resource.

## Prerequisites

[!INCLUDE [free trial note](../../includes/quickstarts-free-trial-note.md)]

* You must have a Fleet resource with a hub cluster and member clusters with deployed workloads. If you don't have this resource, follow [Quickstart: Create a Fleet resource and join member clusters](quickstart-create-fleet-and-members.md).
* The identity (user or service principal) you're using needs to have the Microsoft.ContainerService/fleets/listCredentials/action and Microsoft.ContainerService/managedClusters/listClusterUserCredential/action permissions on the Fleet and AKS resource types.

## Access the Kubernetes API of the Fleet resource cluster

1. Get the kubeconfig file of the hub cluster Fleet resource using the [`az fleet get-credentials`][az-fleet-get-credentials] command.

    ```azurecli-interactive
    az fleet get-credentials --resource-group ${GROUP} --name ${FLEET}
    ```

    Your output should look similar to the following example output:

    ```output
    Merged "hub" as current context in /home/fleet/.kube/config
    ```

2. Set the following environment variable for the `id` of the hub cluster Fleet resource:

    ```azurecli-interactive
    export FLEET_ID=/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${GROUP}/providers/Microsoft.ContainerService/fleets/${FLEET}
    ```

3. Authorize your identity to the hub cluster Fleet resource's Kubernetes API server using the following commands:

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

    Your output should be similar to the following example output:

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

4. Verify the status of the member clusters using the `kubectl get memberclusters` command.

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

* Review the [API specifications][fleet-apispec] for all Fleet custom resources.
* Review our [troubleshooting guide][troubleshooting-guide] to help resolve common issues related to the Fleet APIs.

<!-- LINKS --->
[fleet-apispec]: https://github.com/Azure/fleet/blob/main/docs/api-references.md
[troubleshooting-guide]: https://github.com/Azure/fleet/blob/main/docs/troubleshooting/README.md
[az-fleet-get-credentials]: /cli/azure/fleet#az-fleet-get-credentials
