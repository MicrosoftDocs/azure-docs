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

To publish your configuration package to Azure blob storage, you can follow these steps, which use
the **Az.Storage** module.

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
$container = New-AzStorageAccount @newAccountParams |
    New-AzStorageContainer -Name machine-configuration -Permission Blob
```

Next, get the context of the storage account you want to store the package in. If you created
the storage account in the earlier example, you can get the context from the storage container
object saved in the `$container` variable:

```azurepowershell-interactive
$context = $container.Context
```

If you're using an existing storage container, you can use the container's [connection string][04]
with the `New-AzStorageContext` cmdlet:

```azurepowershell-interactive
$connectionString = @(
    'DefaultEndPointsProtocol=https'
    'AccountName=<storage-account-name>'
    'AccountKey=<storage-key-for-the-account>' # ends with '=='
) -join ';'
$context = New-AzStorageContext -ConnectionString $connectionString
```

Next, add the configuration package to the storage account. This example uploads the zip file
`./MyConfig.zip` to the blob container `machine-configuration`.

```azurepowershell-interactive
$setParams = @{
    Container = 'machine-configuration'
    File      = './MyConfig.zip'
    Context   = $context
}
$blob = Set-AzStorageBlobContent @setParams
$contentUri = $blob.ICloudBlob.Uri.AbsoluteUri
```

> [!NOTE]
> If you're running these examples in Cloudshell but created your zip file locally, you can
> [upload the file to Cloudshell][05].

While this next step is optional, you should add a shared access signature (SAS) token in the URL
to ensure secure access to the package. The below example generates a blob SAS token with read
access and returns the full blob URI with the shared access signature token. In this example, the
token has a time limit of three years.

```azurepowershell-interactive
$startTime = Get-Date
$endTime   = $startTime.AddYears(3)

$tokenParams = @{
    StartTime  = $startTime
    ExpiryTime = $endTime
    Container  = 'machine-configuration'
    Blob       = 'MyConfig.zip'
    Permission = 'r'
    Context    = $context
    FullUri    = $true
}
$contentUri = New-AzStorageBlobSASToken @tokenParams
```

> [!IMPORTANT]
> After you create the SAS token, note the returned URI. You can't retrieve the token after you
> create it. You can only create new tokens. For more information about SAS tokens, see
> [Grant limited access to Azure Storage resources using shared access signatures (SAS)][06].

## Next steps

- [Test the package artifact][07] from your development environment.
- Use the **GuestConfiguration** module to [create an Azure Policy definition][08] for at-scale
  management of your environment.
- [Assign your custom policy definition][09] using Azure portal.

<!-- Reference link definitions -->
[01]: ./overview.md
[02]: ../../storage/common/storage-sas-overview.md
[03]: ../../storage/common/storage-network-security.md#grant-access-from-a-virtual-network
[04]: ../../storage/common/storage-configure-connection-string.md#configure-a-connection-string-for-an-azure-storage-account
[05]: /azure/cloud-shell/using-the-shell-window#upload-and-download-files
[06]: ../../storage/common/storage-sas-overview.md
[07]: ./how-to-test-package.md
[08]: ./how-to-create-policy-definition.md
[09]: ../policy/assign-policy-portal.md
