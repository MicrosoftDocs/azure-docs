---
description: Learn how to recover container data
title: Recovering Fluid data
ms.date: 06/22/2022
ms.service: azure-fluid
ms.topic: reference
---

# Recovering container data

In this scenario, we explore data recovery. We consider data to be corrupted when container reaches an invalid state where it can't process further user actions. The outcome of corrupted state is container being unexpectedly closed. Often it's transient state, and upon reopening, the container may behave as expected. In a situation where a container fails to load even after multiple retries, we offer APIs and flows you can use to recover your data, as described below.

## How Fluid Framework and Azure Fluid Relay save state

Fluid Framework periodically saves snapshots of the data in the container, which summarize all changes made to the data up to that point.  During normal loading the latest snapshot is retrieved, and any subsequent changes are applied on top of that state.

If the latest snapshot or subsequent changes are corrupt, Fluid may not be able to load them normally.  In this case, Fluid offers a collection of APIs to view the stored snapshot versions and load them in a view-only mode with no subsequent changes applied.  This allows the data to be extracted and optionally injected into a new container to resume collaboration.

## Azure client APIs

### APIs for viewing and loading container versions

The AzureClient has the following methods to support this scenario:

#### Get container versions

`getContainerVersions(id, options?)`

Retrieve a list of available versions that may be loaded from.

`Parameters:`

*   `id`:  The container ID.  This is the same ID used when calling `getContainer`.
*   `options?`:  Optionally, an options object to specify:
    *   `maxCount`:  The maximum number of versions to retrieve.  If there are more versions available than requested, the newest versions will be retrieved.  **Default: 5**

`Returns:` A promise which resolves to an array of objects that represent available versions (sorted newest to oldest). The objects have the following properties:

*   `id`:  The version ID.
    *   *Note*:  This is different from the container ID, and specifically references a snapshot version rather than the container.
*   `date`:  The timestamp when the version was generated.

#### View container version

`viewContainerVersion(id, containerSchema, version, compatibilityMode)`

Load a specific version of a container for viewing only.  Any version retrieved from `getContainerVersions` may be used, but for the purpose of recovering corrupted data it is recommended to start with the most-recent version and work backwards to find the most-recent uncorrupted version.

The container is loaded in a paused state, meaning it will not apply the subsequent changes to the data that happened after the generation of that snapshot.  When loaded in this state the container data may be read, but not edited.

`Parameters:`

*   `id`:  The container ID.  This is the same ID used when calling `getContainer`.
*   `containerSchema`:  The container schema.  This is the same schema used when calling `getContainer`.
*   `version`:  The version object referencing the version to load from.  The version object can be retrieved via `getContainerVersions`.
*   `compatibilityMode`:  The compatibility mode.  This is the same compatibility mode used when calling `getContainer`.

`Returns:` A promise which resolves to an object representing the loaded container with a single property:

*   `container`:  The container object.  This is the same type of object as the container object returned by `getContainer`, but is paused in its prior state from the selected version.

### Example

```typescript
const azureClient = new AzureClient(/* ... */);
const versions = await azureClient.getContainerVersions(id);
// Since the versions are sorted in order from newest to oldest, versions[0] will attempt to load the most recent version.
// If the most recent version is corrupted, we could try again with versions[1] and so on to find the most-recent uncorrupted version.
const { container } = await azureClient.viewContainerVersion(id, containerSchema, versions[0], "2");

// We can now start reading the data from the container.
const someData = container.initialObjects.someSharedMap.get("hello");

// With the data extracted, we can inject it into a new uncorrupted container and attach it to start collaborating again.
const { container: newContainer } = await azureClient.createContainer(containerSchema, "2");
newContainer.initialObjects.someSharedMap.set("hello", someData);
const newId = await newContainer.attach();
```

## Key observations

### We're creating a new Container

We aren't recovering (rolling back) existing container. `copyContainer` will give us new instance, with data being copied from the original container. In this process, old container isn't deleted.

### New Container is detached

 New container is initially in `detached` state. We can continue working with detached container, or immediately attach. After calling `attach` we'll get back unique Container ID, representing newly created instance.

## Post-recovery considerations

When it comes to building use cases around post-recovery scenarios, here are couple of considerations on what application might want do to get its remote collaborators all working on the same container again.

If you're modeling your application data solely using fluid containers, the communication “link” is effectively broken when the container is corrupted. Similar real-world example may be video-call where the original author shared the link with participants and that link isn't working anymore. With that perspective in mind, one option is to limit recovery permissions to original author and let them share new container link in the same way they shared original link, after recovering the copy of the original container.

Alternatively, if you're using fluid framework for transient data only, you can always use your own source-of-truth data and supporting services to manage more autonomous recovery workflows. For example, multiple clients may kick off the recovery process until your app has a first recovered copy. Your app can then notify all participating clients to transition to a new container. This can be useful as any currently active client can unblock the participating group to proceed with collaboration. One consideration here is the incurred costs of redundancy.
