---
title: How to publish custom guest configuration package artifacts
description: Learn how to publish a guest configuration package file top Azure blob storage and get a SAS token for secure access.
ms.date: 07/22/2021
ms.topic: how-to
---
# How to publish custom guest configuration package artifacts

Before you begin, it's a good idea to read the overview page for
[guest configuration](../concepts/guest-configuration.md).

Guest configuration custom .zip packages must be stored in a location that is
accessible via HTTPS by the managed machines. Examples include GitHub
repositories, an Azure Repo, Azure storage, or a web server within your private
datacenter.

Configuration packages that support `Audit` and `AuditandSet` are published the
same way. There isn't a need to do anything special during publishing based on
the package mode.

## Publish a configuration package

The preferred location to store a configuration package is Azure Blob Storage.
There are no special requirements for the storage account, but it's a good idea
to host the file in a region near your machines. If you prefer to not make the
package public, you can include a
[SAS token](../../../storage/common/storage-sas-overview.md)
in the URL or implement a
[service endpoint](../../../storage/common/storage-network-security.md#grant-access-from-a-virtual-network)
for machines in a private network.

If you don't have a storage account, use the following example to create one.

```powershell
# Creates a new resource group, storage account, and container
New-AzResourceGroup -name myResourceGroupName -Location WestUS
New-AzStorageAccount -ResourceGroupName myResourceGroupName -Name mystorageaccount -SkuName 'Standard_LRS' -Location 'WestUs' | New-AzStorageContainer -Name guestconfiguration -Permission Blob
```

To publish your configuration package to Azure blob storage, you can follow the below steps which leverages the Az.Storage module. 

First, obtain the context of the storage account in which the package will be stored. This example creates a context by specifying a connection string and saves the context in the variable $Context. 

```powershell
$Context = New-AzStorageContext -ConnectionString "DefaultEndpointsProtocol=https;AccountName=ContosoGeneral;AccountKey=< Storage Key for ContosoGeneral ends with == >;"
```

Next, add the configuration package to the storage account. This example uploads the zip file ./MyConfig.zip to the blob "guestconfiguration".

```powershell
Set-AzStorageBlobContent -Container "guestconfiguration" -File ./MyConfig.zip -Blob "guestconfiguration" -Context $Context
```

Optionally, you can add a SAS token in the URL, this ensures that the content package will be accessed securely. The below example generates a blob SAS token with full blob permission and returns the full blob URI with the shared access signature token.

```powershell
$contenturi = New-AzStorageBlobSASToken -Context $Context -FullUri -Container guestconfiguration -Blob "guestconfiguration" -Permission rwd 
```

## Next steps

- [Test the package artifact](./guest-configuration-create-test.md)
  from your development environment.
- Use the `GuestConfiguration` module to
  [create an Azure Policy definition](./guest-configuration-create-definition.md)
  for at-scale management of your environment.
- [Assign your custom policy definition](../assign-policy-portal.md) using
  Azure portal.
- Learn how to view
  [compliance details for guest configuration](./determine-non-compliance.md#compliance-details-for-guest-configuration) policy assignments.
