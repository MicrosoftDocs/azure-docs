---
author: hickeys
description: Learn how to recover container data
title: Recovering Fluid data
ms.author: hickeys
ms.date: 06/22/2022
ms.service: azure-fluid
ms.topic: reference
---

# Recovering container data

In this scenario, we'll be exploring data recovery. We consider data to be corrupted when container reaches an invalid state where it can't process further user actions. The outcome of corrupted state is container being unexpectedly closed. Often it's transient state, and upon reopening, the container may behave as expected. In a situation where a container fails to load even after multiple retries, we offer APIs and flows you can use to recover your data, as described below.

## How Fluid Framework and Azure Fluid Relay save state

Fluid framework periodically saves state, called summary, without any explicit backup action initiated by the user. This workflow occurs every one (1) minute if there's no user activity, or sooner if there are more than 1000 pending ops present. Each pending op roughly translates to an individual user action (select, text input etc.) that wasn't summarized yet.

## Azure client APIs

We've added following methods to AzureClient that will enable developers to recover data from corrupted containers. 

[`getContainerVersions(ID, options)`](https://fluidframework.com/docs/apis/azure-client/azureclient/#azure-client-azureclient-getcontainerversions-Method)

`getContainerVersions` allows developers to view the previously generated versions of the container.

[copyContainer(ID, containerSchema)](https://fluidframework.com/docs/apis/azure-client/azureclient/#azure-client-azureclient-copycontainer-Method)

`copyContainer` allows developers to generate a new detached container from a specific version of another container.

## Example recovery flow

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

## Key observations

### We're creating a new Container

We aren't recovering (rolling back) existing container. `copyContainer` will give us new instance, with data being copied from the original container. In this process, old container isn't deleted.

### New Container is detached

 New container is initially in `detached` state. We can continue working with detached container, or immediately attach. After calling `attach` we'll get back unique Container ID, representing newly created instance.
