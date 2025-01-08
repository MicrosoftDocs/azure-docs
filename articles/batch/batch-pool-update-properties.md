---
title: Update pool properties
description: Learn how to update existing Batch pool properties.
ms.topic: how-to
ms.date: 09/26/2024
ms.custom:
---

# Update Batch pool properties

When you create an Azure Batch pool, you specify certain properties that define the configuration
of the pool. Examples include specifying the VM size, VM image to use, virtual network configuration,
and encryption settings. However, you may need to update pool properties as your workload evolves
over time or if a VM image reaches end-of-life.

Some, but not all, of these pool properties can be patched or updated to accommodate these situations.
This article provides information about updateable pool properties, expected behaviors for
pool property updates, and examples.

> [!TIP]
> Some pool properties can only be updated using the
> [Batch Management Plane APIs or SDKs](batch-apis-tools.md#batch-management-apis) using Entra
> authentication. You will need to install or use the appropriate [API or SDK](batch-apis-tools.md)
> for these operations to be available.

## Updateable pool properties

Batch provides multiple methods to update properties on a pool. Selecting which API to use
determines the set of pool properties that can be updated as well as the update behavior.

> [!NOTE]
> If you want to update pool properties that aren't part of the following Update or Patch
> APIs, then you must recreate the pool to reflect the desired state.

### Management Plane: Pool - Update

The recommended path to updating pool properties is utilizing the
[Pool - Update API](/rest/api/batchmanagement/pool/update) as part of the
[Batch Management Plane API or SDK](batch-apis-tools.md#batch-management-apis). This API provides
the most comprehensive and flexible way to update pool properties. Using this API allows select
update of Management plane only pool properties and the ability to update other properties that
would otherwise be immutable via Data Plane APIs.

> [!IMPORTANT]
> You must use API version 2024-07-01 or newer of the Batch Management Plane API for updating pool
> properties as described in this section.

Since this operation is a `PATCH`, only pool properties specified in the request are updated.
If properties aren't specified as part of the request, then the existing values remain unmodified.

Some properties can only be updated when the pool has no active nodes in it or where the total
number of compute nodes in the pool is zero. The properties that *don't* require the pool
to be size zero for the new value to take effect are:

- applicationPackages
- certificates
- metadata
- scaleSettings
- startTask

If there are active nodes when the pool is updated with these properties, reboot of active
compute nodes may be required for changes to take effect. For more information, see the
documentation for each individual pool property.

All other updateable pool properties require the pool to be of size zero nodes to be accepted
as part of the request to update.

You may also use [Pool - Create API](/rest/api/batchmanagement/pool/create) to update these
select properties, but since the operation is a `PUT`,  the request fully replaces all
existing properties. Therefore, any property that isn't specified in the request is removed
or set with the associated default.

#### Example: Update VM Image Specification

The following example shows how to update a pool VM image configuration via the Management Plane C# SDK:

```csharp
public async Task UpdatePoolVmImage()
{
     // Authenticate
     var clientId = Environment.GetEnvironmentVariable("CLIENT_ID");
     var clientSecret = Environment.GetEnvironmentVariable("CLIENT_SECRET");
     var tenantId = Environment.GetEnvironmentVariable("TENANT_ID");
     var subscriptionId = Environment.GetEnvironmentVariable("SUBSCRIPTION_ID");
     ClientSecretCredential credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
     ArmClient client = new ArmClient(credential, subscriptionId);

     // Get an existing Batch account
     string resourceGroupName = "<resourcegroup>";
     string accountName = "<batchaccount>";
     ResourceIdentifier batchAccountResourceId = BatchAccountResource.CreateResourceIdentifier(subscriptionId, resourceGroupName, accountName);
     BatchAccountResource batchAccount = client.GetBatchAccountResource(batchAccountResourceId);

     // get the collection of this BatchAccountPoolResource
     BatchAccountPoolCollection collection = batchAccount.GetBatchAccountPools();

     // Update the pool
     string poolName = "mypool";
     BatchAccountPoolData data = new BatchAccountPoolData()
     {
         DeploymentConfiguration = new BatchDeploymentConfiguration()
         {
             VmConfiguration = new BatchVmConfiguration(new BatchImageReference()
             {
                 Publisher = "MicrosoftWindowsServer",
                 Offer = "WindowsServer",
                 Sku = "2022-datacenter-azure-edition-smalldisk",
                 Version = "latest",
             },
             nodeAgentSkuId: "batch.node.windows amd64"),
         },
     };

     ArmOperation<BatchAccountPoolResource> lro = await collection.CreateOrUpdateAsync(WaitUntil.Completed, poolName, data);
     BatchAccountPoolResource result = lro.Value;

     BatchAccountPoolData resourceData = result.Data;
     Console.WriteLine($"Succeeded on id: {resourceData.Id}");
}
```

#### Example: Update VM Size and Target Node Communication Mode

The following example shows how to update a pool VM image size and target node communication
mode to be simplified via REST API:

```http
PATCH https://management.azure.com/subscriptions/<subscriptionid>/resourceGroups/<resourcegroupName>/providers/Microsoft.Batch/batchAccounts/<batchaccountname>/pools/<poolname>?api-version=2024-07-01
```

Request Body

```json
{
    "type": "Microsoft.Batch/batchAccounts/pools",
    "parameters": {
        "properties": {
            "vmSize": "standard_d32ads_v5",
            "targetNodeCommunicationMode": "simplified"
        }
    }
}
```

### Data Plane: Pool - Patch or Update Properties

The Data Plane offers the ability to either patch or update select pool properties. The
available APIs are the [Pool - Patch API](/rest/api/batchservice/pool/patch) or the
[Pool - Update Properties API](/rest/api/batchservice/pool/update-properties) as part of
the [Batch Data Plane API or SDK](batch-apis-tools.md#batch-service-apis).

The [Patch API](/rest/api/batchservice/pool/patch) allows patching of select pool properties
as specified in the documentation such as the `startTask`. Since this operation is a `PATCH`,
only pool properties specified in the request are updated. If properties aren't specified as
part of the request, then the existing values remain unmodified.

The [Update Properties API](/rest/api/batchservice/pool/update-properties) allows select
update of the pool properties as specified in the documentation. This request fully
replaces the existing properties, therefore any property that isn't specified in the
request is removed.

Compute nodes must be rebooted for changes to take effect for the following properties:

- applicationPackageReferences
- certificateReferences
- startTask

The pool must be resized to zero active nodes for updates to the `targetNodeCommunicationMode`
property.

## FAQs

- Do I need to perform any other operations after updating pool properties while the pool
has active nodes?

Yes, for pool properties that can be updated with active nodes, there are select properties
which require compute nodes to be rebooted. Alternatively, the pool can be scaled down to
zero nodes to reflect the modified properties.

- Can I modify the Managed identity collection on the pool while the pool has active nodes?

Yes, but you shouldn't. While Batch doesn't prohibit mutation of the collection with active
nodes, we recommend avoiding doing so as that leads to inconsistency in the identity collection
if the pool scales out. We recommend to only update this property when the pool is sized zero.
For more information, see the [Configure managed identities](managed-identity-pools.md) article.

## Next steps

- Learn more about available Batch [APIs and tools](batch-apis-tools.md).
- Learn how to [check pools and nodes for errors](batch-pool-node-error-checking.md).
