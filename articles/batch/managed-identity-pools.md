---
title: Configure managed identities in Batch pools
description: Learn how to enable user-assigned managed identities on Batch pools and how to use managed identities within the nodes.
ms.topic: conceptual
ms.date: 04/03/2023
ms.devlang: csharp
ms.custom: devx-track-linux
---
# Configure managed identities in Batch pools

[Managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md) eliminate
complicated identity and credential management by providing an identity for the Azure resource in Microsoft Entra ID
(Azure AD ID). This identity is used to obtain Microsoft Entra tokens to authenticate with target
resources in Azure.

This topic explains how to enable user-assigned managed identities on Batch pools and how to use managed identities within the nodes.

> [!IMPORTANT]
> Pools must be configured using [Virtual Machine Configuration](nodes-and-pools.md#virtual-machine-configuration) in order to use managed identities.
>
> Creating pools with managed identities can be done by using the [Batch .NET management library](/dotnet/api/overview/azure/batch#management-library), but is not currently supported with the [Batch .NET client library](/dotnet/api/overview/azure/batch#client-library).

## Create a user-assigned managed identity

First, [create your user-assigned managed identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md) in the same tenant as your Batch account. You can create the identity using the Azure portal, the Azure Command-Line Interface (Azure CLI), PowerShell, Azure Resource Manager, or the Azure REST API. This managed identity doesn't need to be in the same resource group or even in the same subscription.

> [!IMPORTANT]
> A system-assigned managed identity created for a Batch account for [customer data encryption](batch-customer-managed-key.md)
> cannot be used as a user-assigned managed identity on a Batch pool as described in this document. If you wish to use the same
> managed identity on both the Batch account and Batch pool, then use a common user-assigned managed identity instead.

## Create a Batch pool with user-assigned managed identities

After you've created one or more user-assigned managed identities, you can create a Batch pool with that identity or those identities. You can:

- [Use the Azure portal to create the Batch pool](#create-batch-pool-in-azure-portal)
- [Use the Batch .NET management library to create the Batch pool](#create-batch-pool-with-net)

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
var poolParameters = new Pool(name: "yourPoolName")
    {
        VmSize = "standard_d2_v3",
        ScaleSettings = new ScaleSettings
        {
            FixedScale = new FixedScaleSettings
            {
                TargetDedicatedNodes = 1
            }
        },
        DeploymentConfiguration = new DeploymentConfiguration
        {
            VirtualMachineConfiguration = new VirtualMachineConfiguration(
                new ImageReference(
                    "Canonical",
                    "0001-com-ubuntu-server-jammy",
                    "22_04-lts",
                    "latest"),
                "batch.node.ubuntu 22.04")
        },
        Identity = new BatchPoolIdentity
        {
            Type = PoolIdentityType.UserAssigned,
            UserAssignedIdentities = new Dictionary<string, UserAssignedIdentities>
            {
                ["Your Identity Resource Id"] =
                    new UserAssignedIdentities()
            }
        }
    };

var pool = await managementClient.Pool.CreateWithHttpMessagesAsync(
    poolName:"yourPoolName",
    resourceGroupName: "yourResourceGroupName",
    accountName: "yourAccountName",
    parameters: poolParameters,
    cancellationToken: default(CancellationToken)).ConfigureAwait(false);
```

> [!IMPORTANT]
> Managed identities are not updated on existing VMs once a pool has been started. It is recommended to scale the pool down to zero before modifying the identity collection to ensure all VMs
> have the same set of identities assigned.

## Use user-assigned managed identities in Batch nodes

Many Azure Batch functions that access other Azure resources directly on the compute nodes, such as Azure Storage or
Azure Container Registry, support managed identities. For more information on using managed identities with Azure Batch,
see the following links:

- [Resource files](resource-files.md)
- [Output files](batch-task-output-files.md#using-managed-identity)
- [Azure Container Registry](batch-docker-container-workloads.md#managed-identity-support-for-acr)
- [Azure Blob container file system](virtual-file-mount.md#azure-blob-container)

You can also manually configure your tasks so that the managed identities can directly access [Azure resources that support managed identities](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md).

Within the Batch nodes, you can get managed identity tokens and use them to authenticate through Microsoft Entra authentication via the [Azure Instance Metadata Service](../virtual-machines/windows/instance-metadata-service.md).

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
