---
title: Explore your Azure resources
description: Learn to use the Resource Graph query language to explore your resources and discover how they're connected.
ms.date: 06/03/2024
ms.topic: conceptual
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---

# Explore your Azure resources with Resource Graph

Azure Resource Graph helps you explore and discover your Azure resources quickly and at scale. Engineered for fast responses, it's a great way to learn about your environment and also about the properties that exist on your Azure resources.

> [!NOTE]
> Depending on the Resource Graph table, properties will either match the casing as shown in the Azure portal or be lowercased.
> For example, the name of a resource group when querying the `resourceContainers` table will match the portal, but the
> `resourceGroup` property of resources from the `resources` table will be lowercase. This might cause unexpected results and
> can be accounted for in your queries using case-insensitive comparison operators such as `=~` instead of `==` and
> converting properties to lowercase in joins with the `tolower()` function.

## Explore virtual machines

A common resource in Azure is a virtual machine. As a resource type, virtual machines have many properties that can be queried. Each property provides an option for filtering or finding exactly the resource you're looking for.

### Virtual machine discovery

Let's start with a simple query to get a single virtual machine from our environment and look at the properties returned.

```kusto
Resources
| where type =~ 'Microsoft.Compute/virtualMachines'
| limit 1
```

```azurecli
az graph query -q "Resources | where type =~ 'Microsoft.Compute/virtualMachines' | limit 1"
```

```azurepowershell
(Search-AzGraph -Query "Resources | where type =~ 'Microsoft.Compute/virtualMachines' | limit 1").Data | ConvertTo-Json -Depth 100
```

> [!NOTE]
> The Azure PowerShell `Search-AzGraph` cmdlet returns a `PSResourceGraphResponse` by default. To
> have the output look the same as what is returned by Azure CLI, the `ConvertTo-Json` cmdlet is
> used on the `Data` property. The default value for `Depth` is _2_. Setting it to _100_ should
> convert all returned levels.

The JSON results are structured similar to the following example:

```json
[
  {
    "id": "/subscriptions/<subscriptionId>/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/virtualMachines/ContosoVM1",
    "kind": "",
    "location": "westus2",
    "managedBy": "",
    "name": "ContosoVM1",
    "plan": {},
    "properties": {
      "hardwareProfile": {
        "vmSize": "Standard_B2s"
      },
      "networkProfile": {
        "networkInterfaces": [
          {
            "id": "/subscriptions/<subscriptionId>/MyResourceGroup/providers/Microsoft.Network/networkInterfaces/contosovm2222",
            "resourceGroup": "MyResourceGroup"
          }
        ]
      },
      "osProfile": {
        "adminUsername": "localAdmin",
        "computerName": "ContosoVM1",
        "secrets": [],
        "windowsConfiguration": {
          "enableAutomaticUpdates": true,
          "provisionVMAgent": true
        }
      },
      "provisioningState": "Succeeded",
      "storageProfile": {
        "dataDisks": [],
        "imageReference": {
          "offer": "WindowsServer",
          "publisher": "MicrosoftWindowsServer",
          "sku": "2016-Datacenter",
          "version": "latest"
        },
        "osDisk": {
          "caching": "ReadWrite",
          "createOption": "FromImage",
          "diskSizeGB": 127,
          "managedDisk": {
            "id": "/subscriptions/<subscriptionId>/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/disks/ContosoVM1_OsDisk_1_11111111111111111111111111111111",
            "resourceGroup": "MyResourceGroup",
            "storageAccountType": "Premium_LRS"
          },
          "name": "ContosoVM1_OsDisk_1_11111111111111111111111111111111",
          "osType": "Windows"
        }
      },
      "vmId": "11111111-1111-1111-1111-111111111111"
    },
    "resourceGroup": "MyResourceGroup",
    "sku": {},
    "subscriptionId": "<subscriptionId>",
    "tags": {},
    "type": "microsoft.compute/virtualmachines"
  }
]
```

The properties tell us additional information about the virtual machine resource itself. These properties include: operating system, disks, tags, and the resource group and subscription it's a member of.

### Virtual machines by location

Taking what we learned about the virtual machines resource, let's use the `location` property to count all virtual machines by location. To update the query, we remove the limit and summarize the count of location values.

```kusto
Resources
| where type =~ 'Microsoft.Compute/virtualMachines'
| summarize count() by location
```

```azurecli
az graph query -q "Resources | where type =~ 'Microsoft.Compute/virtualMachines' | summarize count() by location"
```

```azurepowershell
(Search-AzGraph -Query "Resources | where type =~ 'Microsoft.Compute/virtualMachines' | summarize count() by location").Data | ConvertTo-Json
```

The JSON results are structured similar to the following example:

```json
[
  {
    "count_": 386,
    "location": "eastus"
  },
  {
    "count_": 215,
    "location": "southcentralus"
  },
  {
    "count_": 59,
    "location": "westus"
  }
]
```

We can now see how many virtual machines we have in each Azure region.

### Virtual machines by SKU

Going back to the original virtual machine properties, let's try to find all the virtual machines that have a SKU size of `Standard_B2s`. The returned JSON shows the value is stored in `properties.hardwareprofile.vmsize`. We update the query to find all virtual machines (VM) that match this size and return just the name of the VM and region.

```kusto
Resources
| where type =~ 'Microsoft.Compute/virtualMachines' and properties.hardwareProfile.vmSize == 'Standard_B2s'
| project name, resourceGroup
```

```azurecli
az graph query -q "Resources | where type =~ 'Microsoft.Compute/virtualMachines' and properties.hardwareProfile.vmSize == 'Standard_B2s' | project name, resourceGroup"
```

```azurepowershell
(Search-AzGraph -Query "Resources | where type =~ 'Microsoft.Compute/virtualMachines' and properties.hardwareProfile.vmSize == 'Standard_B2s' | project name, resourceGroup").Data | ConvertTo-Json
```

### Virtual machines connected to premium-managed disks

To get the details of premium-managed disks that are attached to these `Standard_B2s` virtual machines, we expand the query to return the resource ID of those managed disks.

```kusto
Resources
| where type =~ 'Microsoft.Compute/virtualmachines' and properties.hardwareProfile.vmSize == 'Standard_B2s'
| extend disk = properties.storageProfile.osDisk.managedDisk
| where disk.storageAccountType == 'Premium_LRS'
| project disk.id
```

```azurecli
az graph query -q "Resources | where type =~ 'Microsoft.Compute/virtualmachines' and properties.hardwareProfile.vmSize == 'Standard_B2s' | extend disk = properties.storageProfile.osDisk.managedDisk | where disk.storageAccountType == 'Premium_LRS' | project disk.id"
```

```azurepowershell
(Search-AzGraph -Query "Resources | where type =~ 'Microsoft.Compute/virtualmachines' and properties.hardwareProfile.vmSize == 'Standard_B2s' | extend disk = properties.storageProfile.osDisk.managedDisk | where disk.storageAccountType == 'Premium_LRS' | project disk.id").Data | ConvertTo-Json
```

The result is a list of disk IDs.

### Managed disk discovery

With the first record from the previous query, you explore the properties that exist on the managed disk that was attached to the first virtual machine. The updated query uses the disk ID and changes the type.

Example output from the previous query for example:

```json
[
  {
    "disk_id": "/subscriptions/<subscriptionId>/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/disks/ContosoVM1_OsDisk_1_11111111111111111111111111111111"
  }
]
```

```kusto
Resources
| where type =~ 'Microsoft.Compute/disks' and id == '/subscriptions/<subscriptionId>/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/disks/ContosoVM1_OsDisk_1_11111111111111111111111111111111'
```

Before you run the query, how did we know the `type` should now be `Microsoft.Compute/disks`? If you look at the full ID, you notice `/providers/Microsoft.Compute/disks/` as part of the string. This string fragment gives you a hint as to what type to search for. An alternative method would be to remove the limit by type and instead only search by the ID field. As the ID is unique, only one record would be returned and the `type` property on it provides that detail.

> [!NOTE]
> For this example to work, you must replace the ID field with a result from your own environment.

```azurecli
az graph query -q "Resources | where type =~ 'Microsoft.Compute/disks' and id == '/subscriptions/<subscriptionId>/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/disks/ContosoVM1_OsDisk_1_11111111111111111111111111111111'"
```

```azurepowershell
(Search-AzGraph -Query "Resources | where type =~ 'Microsoft.Compute/disks' and id == '/subscriptions/<subscriptionId>/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/disks/ContosoVM1_OsDisk_1_11111111111111111111111111111111'").Data | ConvertTo-Json
```

The JSON results are structured similar to the following example:

```json
[
  {
    "id": "/subscriptions/<subscriptionId>/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/disks/ContosoVM1_OsDisk_1_11111111111111111111111111111111",
    "kind": "",
    "location": "westus2",
    "managedBy": "",
    "name": "ContosoVM1_OsDisk_1_11111111111111111111111111111111",
    "plan": {},
    "properties": {
      "creationData": {
        "createOption": "Empty"
      },
      "diskSizeGB": 127,
      "diskState": "ActiveSAS",
      "provisioningState": "Succeeded",
      "timeCreated": "2018-09-14T12:17:32.2570000Z"
    },
    "resourceGroup": "MyResourceGroup",
    "sku": {
      "name": "Premium_LRS",
      "tier": "Premium"
    },
    "subscriptionId": "<subscriptionId>",
    "tags": {
      "environment": "prod"
    },
    "type": "microsoft.compute/disks"
  }
]
```

## Explore virtual machines to find public IP addresses

This set of queries first finds and stores all the network interface cards (NIC) resources connected to virtual machines. Then the queries use the list of NICs to find each IP address resource that is a public IP address and store those values. Finally, the queries provide a list of the public IP addresses.

```azurecli
# Use Resource Graph to get all NICs and store in the 'nics.txt' file
az graph query -q "Resources | where type =~ 'Microsoft.Compute/virtualMachines' | project nic = tostring(properties['networkProfile']['networkInterfaces'][0]['id']) | where isnotempty(nic) | distinct nic | limit 20" --output table | tail -n +3 > nics.txt

# Review the output of the query stored in 'nics.txt'
cat nics.txt
```

```azurepowershell
# Use Resource Graph to get all NICs and store in the $nics variable
$nics = (Search-AzGraph -Query "Resources | where type =~ 'Microsoft.Compute/virtualMachines' | project nic = tostring(properties['networkProfile']['networkInterfaces'][0]['id']) | where isnotempty(nic) | distinct nic | limit 20").Data

# Review the output of the query stored in the variable
$nics.nic
```

In the next query, use the file (Azure CLI) or variable (Azure PowerShell), to get the related network interface card resources details that have a public IP address attached to the NIC.

```azurecli
# Use Resource Graph with the 'nics.txt' file to get all related public IP addresses and store in 'publicIp.txt' file
az graph query -q="Resources | where type =~ 'Microsoft.Network/networkInterfaces' | where id in ('$(awk -vORS="','" '{print $0}' nics.txt | sed 's/,$//')') | project publicIp = tostring(properties['ipConfigurations'][0]['properties']['publicIPAddress']['id']) | where isnotempty(publicIp) | distinct publicIp" --output table | tail -n +3 > ips.txt

# Review the output of the query stored in 'ips.txt'
cat ips.txt
```

```azurepowershell
# Use Resource Graph  with the $nics variable to get all related public IP addresses and store in $ips variable
$ips = (Search-AzGraph -Query "Resources | where type =~ 'Microsoft.Network/networkInterfaces' | where id in ('$($nics.nic -join "','")') | project publicIp = tostring(properties['ipConfigurations'][0]['properties']['publicIPAddress']['id']) | where isnotempty(publicIp) | distinct publicIp").Data

# Review the output of the query stored in the variable
$ips.publicIp
```

Last, use the list of public IP address resources stored in the file (Azure CLI) or variable (Azure PowerShell) to get the actual public IP address from the related object and display.

```azurecli
# Use Resource Graph with the 'ips.txt' file to get the IP address of the public IP address resources
az graph query -q="Resources | where type =~ 'Microsoft.Network/publicIPAddresses' | where id in ('$(awk -vORS="','" '{print $0}' ips.txt | sed 's/,$//')') | project ip = tostring(properties['ipAddress']) | where isnotempty(ip) | distinct ip" --output table
```

```azurepowershell
# Use Resource Graph with the $ips variable to get the IP address of the public IP address resources
(Search-AzGraph -Query "Resources | where type =~ 'Microsoft.Network/publicIPAddresses' | where id in ('$($ips.publicIp -join "','")') | project ip = tostring(properties['ipAddress']) | where isnotempty(ip) | distinct ip").Data | ConvertTo-Json
```

To see how to accomplish these steps in a single query with the `join` operator, go to [List virtual machines with their network interface and public IP](../samples/advanced.md#get-virtual-networks-and-subnets-of-network-interfaces) sample.

## Next steps

- Learn more about the [query language](query-language.md).
- See the language in use in [Starter queries](../samples/starter.md).
- See advanced uses in [Advanced queries](../samples/advanced.md).
