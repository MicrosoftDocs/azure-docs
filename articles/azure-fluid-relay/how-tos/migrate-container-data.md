---
description: Learn how to migrate container data from Fluid Framework 1.x to 2.0
title: Migrating Fluid data from 1.x to 2
ms.date: 06/24/2024
ms.service: azure-fluid
ms.topic: reference
---

# Migrating container data from 1.x to 2.0

Data in containers created using Fluid Framework 1.x can be loaded compatibly by Fluid Framework 2.0 with no special effort required.

However, Fluid Framework 2.0 includes new performance and cost-efficiency features that aren't compatible with clients running Fluid Framework 1.x.  If 1.x clients encounter these features during collaboration they will close their local container and become unable to collaborate on the data - only 2.0 clients will be able to load and collaborate on the container from that point on.

If your deployment strategy takes time to roll out, you'll want to ensure Fluid Framework 2.0 clients avoid using those new features until the deployment is complete.  This article explains the steps you need to take to configure Fluid Framework 2.0 to enable collaboration with 1.x clients, and then to enable the new features after deployment is complete.

## Specifying compatibility mode

In Fluid Framework 2.0, the `createContainer` and `getContainer` APIs on AzureClient and TinyliciousClient have a new parameter `compatibilityMode` which may be set to `"1"` or `"2"`.  When set to `"1"`, the 2.0 client can safely collaborate with 1.x clients.

```typescript
const azureClient = new AzureClient(/* ... */);
const { container } = await azureClient.getContainer(id, containerSchema, "1");

// ...Normal usage of the container...
```

When starting your deployment, you should use `"1"` mode to ensure 1.x clients can continue to collaborate with the 2.0 clients.  After completing your deployment in this manner (such that all clients are running 2.0 in `"1"` mode), it is safe to deploy a subsequent change that switches usage to `"2"` mode:

```typescript
const azureClient = new AzureClient(/* ... */);
const { container } = await azureClient.getContainer(id, containerSchema, "2");

// ...Normal usage of the container...
```

Even if some clients are running 2.0 in `"1"` mode, they will be able to safely collaborate with the clients running 2.0 in `"2"` mode.

Once `"2"` mode is enabled, clients will use the new 2.0 features that will improve performance and cost efficiency but will prevent 1.x clients from collaborating on the container.

## Notes

*   New containers can and should be created directly in `"2"` mode if clients running 1.x will not need to collaborate on them.
*   Moving straight from 1.x to 2.0 running in `"2"` mode is supported, but runs the risk that any 1.x clients will not be able to collaborate until they are upgraded.  If your deployment strategy is not concerned with this risk, you can migrate directly from 1.x to 2.0 in `"2"` mode.
*   Some features of 2.0 must be enabled at container creation and cannot be enabled after attach.  Most notably, this includes id compression which is a requirement for use of [SharedTree](https://fluidframework.com/docs/data-structures/tree/).  As a result, SharedTree is not supported on containers created in 1.x or on 2.0 running in `"1"` mode.
