---
title: Azure Container Instances states
description: Learn about the states of Azure Container Instances provisioning operations, containers, and container groups.
ms.author: nickoman
author: nickomang
ms.topic: article
ms.date: 03/25/2021
---

# Azure Container Instances states

Azure Container Instances displays several independent state values. This article catalogs those values, where they can be found, and what they indicate.

## Where to find state values

In the Azure portal, state is shown in various locations. All state values are accessible via the JSON definition of the resource. This value can be found under Essentials in the Overview blade, shown below.

:::image type="content" source="./media/container-state/provisioning-state.png" alt-text="The Overview blade in the Azure portal is shown. The link 'JSON view' is highlighted.":::

State is also displayed in other locations in the Azure portal. The following table summarizes where state values can be found:

|Name|JSON path|Azure portal location|
|-|-|-|
|Container Group state|`properties.instanceView.state`|Under Essentials in the Overview blade|
|Current Container state|`properties.containers/initContainers[x].instanceView.currentState.state`|Under the Containers blade's table's **State** column|
|Previous Container state|`properties.containers/initContainers[x].instanceView.previousState.state`|Via *JSON view* under Essentials in the Overview blade|
|Provisioning state|`properties.provisioningState`|Via *JSON view* under Essentials in the Overview blade; HTTP response body|

## Container Groups

This value is the state of the deployed container group on the backend.

:::image type="content" source="./media/container-state/container-group-state.png" alt-text="The overview blade for the resource in the Azure portal is shown in a web browser. The text 'Status: Running' is highlighted.":::

- **Running**: The container group is running and will continue to try to run until a user action or a stop caused by the restart policy occurs.

- **Stopped**: The container group has been stopped and will not be scheduled to run without user action.

- **Pending**: The container group is waiting to initialize (finish running init containers, mount Azure file volumes if applicable). The container continues to attempt to get to the **Running** state unless a user action (stop/delete) happens.

- **Succeeded**: The container group has run to completion successfully. Only applicable for *Never* and *On Failure* restart policies.

- **Failed**: The container group failed to run to completion. Only applicable with a *Never* restart policy. This state indicates either an infrastructure failure (example: incorrect Azure file share credentials) or user application failure (example: application references an environment variable that does not exist).

The following table shows what states are applicable to a container group based on the designated restart policy:

|Value|Never|On Failure|Always|
|--|--|--|--|
|Running|Yes|Yes|Yes|
|Stopped|Yes|Yes|Yes|
|Pending|Yes|Yes|Yes|
|Succeeded|Yes|Yes|No|
|Failed|Yes|No|No|

## Containers

There are two state values for containers- a current state and a previous state. In the Azure portal, shown below, only current state is displayed. All state values are applicable for any given container regardless of the container group's restart policy.

> [!NOTE]
> The JSON values of `currentState` and `previousState` contain additional information, such as an exit code or a reason, that is not shown elsewhere in the Azure portal.

:::image type="content" source="./media/container-state/container-state.png" alt-text="The Containers blade in the Azure portal is shown. A table is shown, and 'Running' under the 'State' column is highlighted. ":::

- **Running**: The container is running.

- **Waiting**: The container is waiting to run. This state indicates either init containers are still running, or the container is backing off due to a crash loop.

- **Terminated**: The container has terminated, accompanied with an exit code value.

## Provisioning

This value is the state of the last operation performed on a container group. Generally, this operation is a PUT (create), but it can also be a POST (start/restart/stop) or DELETE (delete).

> [!IMPORTANT]
> Additionally, users should not create dependencies on non-terminal provisioning states. Dependencies on **Succeeded** and **Failed** states are acceptable.

In addition to the JSON view, provisioning state can be also be found in the [response body of the HTTP call](/rest/api/container-instances/2022-09-01/container-groups/create-or-update#response).

### Create, start, and restart operations

> [!IMPORTANT]
> PUT (create) operations are asynchronous. The returned value from the PUT's response body is not the final state. Making subsequent GET calls on the container group's resourceId or the AsyncOperation (returned in the PUT response headers) is the recommended way to monitor the status of the deployment.

These states are applicable to PUT (create) and POST (start/restart) events.

- **Pending**: The container group is waiting for infrastructure setup, such as a node assignment, virtual network provisioning, or anything else needed prior to pulling the user image.

- **Creating**: The infrastructure setup has finished. The container group is now getting brought up and receiving the resources it needs (mounting Azure file volumes, getting ingress IP address, etc.).

- **Succeeded**: The container group has succeeded in getting its containers into the running state and has received all resources it needs.

- **Unhealthy**: The container group is unhealthy. For an unexpected state, such as if a node is down, a job is automatically triggered to repair the container group by moving it.

- **Repairing**: The container group is getting moved in order to repair an unhealthy state.

- **Failed**: The container group failed to reach the **Succeeded** provisioning state. Failure can occur for many reasons (low capacity in the designated region, full consumption of user quota, timeout after 30 minutes, etc.). More information on the failure can be found under `events` in the JSON view.
    > [!NOTE]
    > A failed state does not mean that the resource is removed or stops attempting to succeed. The container group state will indicate the current state of the group. If you want to ensure the container group does not run after a **Failed** provisioning state, then you will have to stop or delete it.

### Stop and delete operations

These values are applicable to POST (stop) and DELETE (delete) events.

- **Succeeded**: The operation to stop or delete the container group completed successfully.

- **Failed**: The container group failed to reach the **Succeeded** provisioning state, meaning the stop/delete event did not complete. More information on the failure can be found under `events` in the JSON view.
