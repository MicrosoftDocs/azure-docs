---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 03/05/2020
 ms.author: rogarana
 ms.custom: include file
---

[!INCLUDE [virtual-machines-disks-incremental-snapshots-description](virtual-machines-disks-incremental-snapshots-description.md)]

## Restrictions

[!INCLUDE [virtual-machines-disks-incremental-snapshots-restrictions](virtual-machines-disks-incremental-snapshots-restrictions.md)]

## CLI

You can create an incremental snapshot with the Azure CLI, you will need the latest version of Azure CLI. 

On Windows, the following command will either install or update your existing installation to the latest version:
```PowerShell
Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile .\AzureCLI.msi; Start-Process msiexec.exe -Wait -ArgumentList '/I AzureCLI.msi /quiet'
```
On Linux, the CLI installation will vary depending on operating system version.  See [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) for your particular Linux version.

To create an incremental snapshot, use [az snapshot create](https://docs.microsoft.com/cli/azure/snapshot?view=azure-cli-latest#az-snapshot-create) with the `--incremental` parameter.

The following example creates an incremental snapshot, replace `<yourDesiredSnapShotNameHere>`, `<yourResourceGroupNameHere>`,`<exampleDiskName>`, and `<exampleLocation>` with your own values, then run the example:

```bash
sourceResourceId=$(az disk show -g <yourResourceGroupNameHere> -n <exampleDiskName> --query '[id]' -o tsv)

az snapshot create -g <yourResourceGroupNameHere> \
-n <yourDesiredSnapShotNameHere> \
-l <exampleLocation> \
--source "$sourceResourceId" \
--incremental
```

You can identify incremental snapshots from the same disk with the `SourceResourceId` and the `SourceUniqueId` properties of snapshots. `SourceResourceId` is the Azure Resource Manager resource ID of the parent disk. `SourceUniqueId` is the value inherited from the `UniqueId` property of the disk. If you were to delete a disk and then create a new disk with the same name, the value of the `UniqueId` property changes.

You can use `SourceResourceId` and `SourceUniqueId` to create a list of all snapshots associated with a particular disk. The following example will list all incremental snapshots associated with a particular disk but, it requires some setup.

This example uses jq for querying the data. To run the example, you must [install jq](https://stedolan.github.io/jq/download/).

Replace `<yourResourceGroupNameHere>` and `<exampleDiskName>` with your values, then you can use the following example to list your existing incremental snapshots, as long as you've also installed jq:

```bash
sourceUniqueId=$(az disk show -g <yourResourceGroupNameHere> -n <exampleDiskName> --query '[uniqueId]' -o tsv)

 
sourceResourceId=$(az disk show -g <yourResourceGroupNameHere> -n <exampleDiskName> --query '[id]' -o tsv)

az snapshot list -g <yourResourceGroupNameHere> -o json \
| jq -cr --arg SUID "$sourceUniqueId" --arg SRID "$sourceResourceId" '.[] | select(.incremental==true and .creationData.sourceUniqueId==$SUID and .creationData.sourceResourceId==$SRID)'
```

## Resource Manager template

You can also use Azure Resource Manager templates to create an incremental snapshot. You'll need to make sure the apiVersion is set to **2019-03-01** and that the incremental property is also set to true. The following snippet is an example of how to create an incremental snapshot with Resource Manager templates:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "diskName": {
      "type": "string",
      "defaultValue": "contosodisk1"
    },
  "diskResourceId": {
    "defaultValue": "<your_managed_disk_resource_ID>",
    "type": "String"
  }
  }, 
  "resources": [
  {
    "type": "Microsoft.Compute/snapshots",
    "name": "[concat( parameters('diskName'),'_snapshot1')]",
    "location": "[resourceGroup().location]",
    "apiVersion": "2019-03-01",
    "properties": {
      "creationData": {
        "createOption": "Copy",
        "sourceResourceId": "[parameters('diskResourceId')]"
      },
      "incremental": true
    }
  }
  ]
}
```

## Next steps

If you'd like to see sample code demonstrating the differential capability of incremental snapshots, using .NET, see [Copy Azure Managed Disks backups to another region with differential capability of incremental snapshots](https://github.com/Azure-Samples/managed-disks-dotnet-backup-with-incremental-snapshots).
