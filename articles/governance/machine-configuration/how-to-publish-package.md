---
title: How to publish custom machine configuration package artifacts
description: Learn how to publish a machine configuration package file to Azure blob storage and get a SAS token for secure access.
ms.date: 04/18/2023
ms.topic: how-to
ms.custom: devx-track-azurepowershell
---
# How to publish custom machine configuration package artifacts

[!INCLUDE [Machine configuration rename banner](../includes/banner.md)]

Before you begin, it's a good idea to read the overview page for [machine configuration][01].

Machine configuration custom `.zip` packages must be stored in a location that's accessible via
HTTPS by the managed machines. Examples include GitHub repositories, an Azure Repo, Azure storage,
or a web server within your private datacenter.

Configuration packages that support `Audit` and `AuditandSet` are published the same way. There
isn't a need to do anything special during publishing based on the package mode.

## Publish a configuration package

The preferred location to store a configuration package is Azure Blob Storage. There are no special
requirements for the storage account, but it's a good idea to host the file in a region near your
machines. If you prefer to not make the package public, you can include a [SAS token][02] in the
URL or implement a [service endpoint][03] for machines in a private network.

If you don't have a storage account, use the following example to create one.

```azurepowershell-interactive
# Creates a new resource group, storage account, and container
$ResourceGroup = '<resource-group-name>'
$Location      = '<location-id>'
New-AzResourceGroup -Name $ResourceGroup -Location $Location

$newAccountParams = @{
    ResourceGroupname = $ResourceGroup
    Location          = $Location
    Name              = '<storage-account-name>'
    SkuName           = 'Standard_LRS'
}
New-AzStorageAccount @newAccountParams |
    New-AzStorageContainer -Name guestconfiguration -Permission Blob
```

To publish your configuration package to Azure blob storage, you can follow these steps, which use
the **Az.Storage** module.

First, obtain the context of the storage account you want to store the package in. This example
creates a context by specifying a connection string and saves the context in the variable
`$Context`.

```azurepowershell-interactive
$connectionString = @(
    'DefaultEndPointsProtocol=https'
    'AccountName=ContosoGeneral'
    'AccountKey=<storage-key-for-ContosoGeneral>' # ends with '=='
) -join ';'
$Context = New-AzStorageContext -ConnectionString $connectionString
```

Next, add the configuration package to the storage account. This example uploads the zip file
`./MyConfig.zip` to the blob `machineConfiguration`.

```azurepowershell-interactive
$setParams = @{
    Container = 'machineConfiguration'
    File      = './MyConfig.zip'
    Context   = $Context
}
Set-AzStorageBlobContent @setParams
```

Optionally, you can add a SAS token in the URL to ensure the content package is accessed securely.
The below example generates a blob SAS token with read access and returns the full blob URI with
the shared access signature token. In this example, the token has a time limit of three years.

```azurepowershell-interactive
$StartTime = Get-Date
$EndTime   = $startTime.AddYears(3)

$tokenParams = @{
    StartTime  = $StartTime
    EndTime    = $EndTime
    Container  = 'machineConfiguration'
    Blob       = 'MyConfig.zip'
    Permission = 'r'
    Context    = $Context
    FullUri    = $true
}
$contenturi = New-AzStorageBlobSASToken @tokenParams
```

## Next steps

- [Test the package artifact][04] from your development environment.
- Use the **GuestConfiguration** module to [create an Azure Policy definition][05] for at-scale
  management of your environment.
- [Assign your custom policy definition][06] using Azure portal.

<!-- Reference link definitions -->
[01]: ./overview.md
[02]: ../../storage/common/storage-sas-overview.md
[03]: ../../storage/common/storage-network-security.md#grant-access-from-a-virtual-network
[04]: ./how-to-test-package.md
[05]: ./how-to-create-policy-definition.md
[06]: ../policy/assign-policy-portal.md
