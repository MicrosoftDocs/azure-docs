---
author: sashasimic
description: Learn how to recover container data
title: Recovering Fluid data
ms.author: sashasimic
ms.date: 06/22/2022
ms.service: azure-fluid
ms.topic: reference
---

# Recovering Fluid data

> [!NOTE]
> This preview version is provided without a service-level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.

In this scenario, we will be exploring data recovery. We consider data to be corrupted when container reaches an invalid state where it cannot process further user actions. The outcome of corrupted state is container being unexpectedly closed. Often it is transient state, and upon reopening the container may behave as expected. In an situation where a container failes to load even after multiple retries, we offer APIs and flows you can use to recover your data, decribed below.

## How Fluid Framework and Azure Fluid Relay save state

Fluid framework periodically saves state, called summary, without any explicit backup action initiated by the user. This occurs every one (1) minute if there is no user activity, or sooner if there are more then 1000 pending ops present. Each pending op roughly translates to an individual user action (click, text input etc) that was not summarized yet. Azure Fluid Relay saves up to five (5) most recent summaries.


## Azure Client APIs

We've added following methods to AzureClient that will enable developers to recover data from corrupted containers. 

[`getContainerVersions(id, options)`](https://fluidframework.com/docs/apis/azure-client/azureclient/#azure-client-azureclient-getcontainerversions-Method)

`getContainerVersions` allows developers to view the previously generated versions of the container.

[copyContainer(id, containerSchema)](https://fluidframework.com/docs/apis/azure-client/azureclient/#azure-client-azureclient-copycontainer-Method)

`copyContainer` allows developers to generate a new detached container from a specific version of another container.

## Example Recovery Flow

```typescript

async function recoverDoc(
    client: AzureClient,
    orgContainerId: string,
    containerScema: ContainerSchema,
): Promise<string> {
    /* Collect doc versions */
    let versions: AzureContainerVersion[] = [];
    try {
        versions = await client.getContainerVersions(orgContainerId);
    } catch (e) {
        return Promise.reject(new Error("Unable to get container versions."));
    }

    for (const version of versions) {
        /* Versions are returned in chronological order.
        Attempt to copy doc from next available version */
        try {
            const { container: newContainer } = await client.copyContainer(
                orgContainerId,
                containerSchema,
                version,
            );
            return await newContainer.attach();
        } catch (e) {
            // Error. Keep going.
        }
    }

    return Promise.reject(new Error("Could not recreate document"));
}

```


## Key Observations & Constraints

### We are getting back new Container

We are not recovering existing container. `copyContainer` will give us back new instance. In this process, old container is not deleted.

### New Container is in detached state.

 New container is initially in `detached` state. We can continue working with detached container, or immediatelly attach. After calling `attach` we will get back unique Container ID, representing newly created instance.

 


