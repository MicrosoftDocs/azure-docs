---
title: Configure managed identities in Batch pools
description: Learn how to enable user-assigned managed identities on Batch pools and how to use managed identities within the nodes.
ms.topic: conceptual
ms.date: 12/23/2024
ms.devlang: csharp
ai-usage: ai-assisted
ms.custom:
---
# Configure managed identities in Batch pools

[Managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md) eliminate
complicated identity and credential management by providing an identity for the Azure resource in Microsoft Entra ID
(Azure AD ID). This identity is used to obtain Microsoft Entra tokens to authenticate with target
resources in Azure.

When adding a User-Assigned Managed Identity to a Batch Pool, it is crucial to set the *Identity* property in your configuration. This property links the managed identity to the pool, enabling it to access Azure resources securely. Incorrect setting of the *Identity* property can result in common errors, such as access issues or upload errors.

For more information on configuring managed identities in Azure Batch, please refer to the [Azure Batch Managed Identities documentation](/troubleshoot/azure/hpc/batch/use-managed-identities-azure-batch-account-pool).

This topic explains how to enable user-assigned managed identities on Batch pools and how to use managed identities within the nodes.

> [!IMPORTANT]
> Creating pools with managed identities can only be performed with the
> [Batch Management Plane APIs or SDKs](batch-apis-tools.md#batch-management-apis) using Entra authentication.
> It is not possible to create pools with managed identities using the
> [Batch Service APIs or SDKs](batch-apis-tools.md#batch-service-apis). For more information, see the overview
> documentation for [Batch APIs and tools](batch-apis-tools.md).

## Create a user-assigned managed identity

First, [create your user-assigned managed identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md) in the same tenant as your Batch account. You can create the identity using the Azure portal, the Azure Command-Line Interface (Azure CLI), PowerShell, Azure Resource Manager, or the Azure REST API. This managed identity doesn't need to be in the same resource group or even in the same subscription.

> [!TIP]
> A system-assigned managed identity created for a Batch account for [customer data encryption](batch-customer-managed-key.md)
> cannot be used as a user-assigned managed identity on a Batch pool as described in this document. If you wish to use the same
> managed identity on both the Batch account and Batch pool, then use a common user-assigned managed identity instead.

## Create a Batch pool with user-assigned managed identities

After you create one or more user-assigned managed identities, you can create a Batch pool with that identity or those identities. You can:

- [Use the Azure portal to create the Batch pool](#create-batch-pool-in-azure-portal)
- [Use the Batch .NET management library to create the Batch pool](#create-batch-pool-with-net)

> [!WARNING]
> In-place updates of pool managed identities are not supported while the pool has active nodes. Existing compute nodes
> will not be updated with changes. It is recommended to scale the pool down to zero compute nodes before modifying the
> identity collection to ensure all VMs have the same set of identities assigned.

### Create Batch pool in Azure portal

To create a Batch pool with a user-assigned managed identity through the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search bar, enter and select **Batch accounts**.
1. On the **Batch accounts** page, select the Batch account where you want to create a Batch pool.
1. In the menu for the Batch account, under **Features**, select **Pools**.
1. In the **Pools** menu, select **Add** to add a new Batch pool.
1. For **Pool ID**, enter an identifier for your pool.
1. For **Identity**, change the setting to **User assigned**.
1. Under **User assigned managed identity**, select **Add**.
1. Select the user assigned managed identity or identities you want to use. Then, select **Add**.
1. Under **Operating System**, select the publisher, offer, and SKU to use.
1. Optionally, enable the managed identity in the container registry:
    1. For **Container configuration**, change the setting to **Custom**. Then, select your custom configuration.
    1. For **Start task** select **Enabled**. Then, select **Resource files** and add your storage container information.
    1. Enable **Container settings**.
    1. Change  **Container registry** to **Custom**
    1. For **Identity reference**, select the storage container.

###  Create Batch pool with .NET

To create a Batch pool with a user-assigned managed identity with the [Batch .NET management library](/dotnet/api/overview/azure/batch#management-library), use the following example code:

```csharp
var credential = new DefaultAzureCredential();
ArmClient _armClient = new ArmClient(credential);
        
var batchAccountIdentifier = ResourceIdentifier.Parse("your-batch-account-resource-id");   
BatchAccountResource batchAccount = _armClient.GetBatchAccountResource(batchAccountIdentifier);

var poolName = "HelloWorldPool";
var imageReference = new BatchImageReference()
{
    Publisher = "canonical",
    Offer = "0001-com-ubuntu-server-jammy",
    Sku = "22_04-lts",
    Version = "latest"
};
string nodeAgentSku = "batch.node.ubuntu 22.04";

var batchAccountPoolData = new BatchAccountPoolData()
{
    VmSize = "Standard_DS1_v2",
    DeploymentConfiguration = new BatchDeploymentConfiguration()
    {
        VmConfiguration = new BatchVmConfiguration(imageReference, nodeAgentSku)
    },
    ScaleSettings = new BatchAccountPoolScaleSettings()
    {
        FixedScale = new BatchAccountFixedScaleSettings()
        {
            TargetDedicatedNodes = 1
        }
    }
};

ArmOperation<BatchAccountPoolResource> armOperation = batchAccount.GetBatchAccountPools().CreateOrUpdate(
    WaitUntil.Completed, poolName, batchAccountPoolData);
BatchAccountPoolResource pool = armOperation.Value;
```

> [!NOTE]
> To include the *Identity* property use the following example code:
```csharp
   var pool = batchClient.PoolOperations.CreatePool(
       poolId: "myPool",
       virtualMachineSize: "STANDARD_D2_V2",
       cloudServiceConfiguration: new CloudServiceConfiguration(osFamily: "4"),
       targetDedicatedNodes: 1,
       identity: new PoolIdentity(
           type: PoolIdentityType.UserAssigned,
           userAssignedIdentities: new Dictionary<string, UserAssignedIdentity>
           {
               { "/subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identity-name}", new UserAssignedIdentity() }
           }
       ));
   ```

## Use user-assigned managed identities in Batch nodes

Many Azure Batch functions that access other Azure resources directly on the compute nodes, such as Azure Storage or
Azure Container Registry, support managed identities. For more information on using managed identities with Azure Batch,
see the following links:

- [Resource files](resource-files.md)
- [Output files](batch-task-output-files.md#using-managed-identity)
- [Azure Container Registry](batch-docker-container-workloads.md#managed-identity-support-for-acr)
- [Azure Blob container file system](virtual-file-mount.md#azure-blob-container)

You can also manually configure your tasks so that the managed identities can directly access [Azure resources that support managed identities](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md).

Within the Batch nodes, you can get managed identity tokens and use them to authenticate through Microsoft Entra authentication via the [Azure Instance Metadata Service](/azure/virtual-machines/windows/instance-metadata-service).

For Windows, the PowerShell script to get an access token to authenticate is:

```powershell
$Response = Invoke-RestMethod -Uri 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource={Resource App Id Url}' -Method GET -Headers @{Metadata="true"}
```

For Linux, the Bash script is:

```bash
curl 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource={Resource App Id Url}' -H Metadata:true
```

For more information, see [How to use managed identities for Azure resources on an Azure VM to acquire an access token](../active-directory/managed-identities-azure-resources/how-to-use-vm-token.md).

## Next steps

- Learn more about [Managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md).
- Learn how to use [customer-managed keys with user-managed identities](batch-customer-managed-key.md).
- Learn how to [enable automatic certificate rotation in a Batch pool](automatic-certificate-rotation.md).
