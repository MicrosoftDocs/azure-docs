---
title: Azure Container Instances states
description: Learn about the states of Azure Container Instances provisioning operations, containers, and container groups.
ms.topic: article
ms.date: 03/25/2021
---

# Azure Container Instances states

Azure Container Instances displays several independent state values. This article catalogs those values, where they can be found, and what they indicate.

## Container Groups

This value is the state of the deployed container group on the backend. In the Azure portal, you can find container group state under Essentials in the Overview blade.

:::image type="content" source="./media/container-state/container-group-state.png" alt-text="The overview blade for the resource in the Azure portal is shown in a web browser. The text 'Status: Running' is highlighted.":::

- **Running**: The container group is running and will continue to try to run until a user action or a stop caused by the restart policy occurs.

- **Stopped**: The container group has been stopped and will not be scheduled to run without user action.

- **Pending**: The container group is waiting to initialize (finish running init containers, mount Azure file volumes). The container continues to attempt to get to the **Running** state unless a user action (stop/delete) happens.

- **Succeeded**: The container group has run to completion successfully. Only applicable for *Never* and *On Failure* restart policies.

- **Failed**: The container group failed to run to completion. Only applicable with a *Never* restart policy. This state indicates either an init container failure, Azure file mount failure, or user container failure.

The following table shows what states are applicable to a container group based on the designated restart policy:

|Value|Never|On Failure|Always|
|--|--|--|--|
|Running|Yes|Yes|Yes|
|Stopped|Yes|Yes|Yes|
|Pending|Yes|Yes|Yes|
|Succeeded|Yes|Yes|No|
|Failed|Yes|No|No|


## Containers

This value is the state of a single container in a container group. In the Azure portal, container state is shown on the Containers blade.

:::image type="content" source="./media/container-state/container-state.png" alt-text="The Containers blade in the Azure portal is shown. A table is shown, and 'Running' under the 'State' column is highlighted. ":::

- **Running**: The container is running.

- **Waiting**: The container is waiting to run. This state indicates either init containers are still running, or the container is backing off due to a crash loop.

- **Terminated**: The container has terminated, accompanied with an exit code value.

## Provisioning

This value is the state of the last operation performed on a container group. Generally, this operation is a PUT(create), but it can also be a POST(start/stop) or DELETE (delete).

- **Pending**: The container group is waiting for infrastructure setup, such as a node assignment, virtual network provisioning, or anything else needed prior to pulling the user image.

- **Creating**: The infrastructure setup has finished. The container group is now getting brought up and receiving the resources it needs (mounting Azure file volumes, getting ingress IP address, etc.).

- **Succeeded**: The container group has succeeded in getting its containers into the running state and has received all resources it needs. If the latest operation was to stop the container group, this indicates the operation completed successfully.

- **Unhealthy**: The container group is unhealthy. For an unexpected state, such as if a node is down, a job is automatically triggered to repair the container group by moving it.

- **Repairing**: The container group is getting moved in order to repair an unhealthy state.

- **Failed**: The container group failed to reach the **Succeeded** provisioning state within the timeout of 30 minutes. If the last operation was not a create/start, this indicates that the operation failed.
    > [!NOTE]
    > A failed state does not mean that the resource is removed or stops attempting to succeed. The container group state will indicate the current state of the group. If you want to ensure the container group does not run after a **Failed** provisioning state, then you will have to stop or delete it.
