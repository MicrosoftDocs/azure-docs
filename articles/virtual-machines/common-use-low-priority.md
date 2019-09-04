---
 title: include file
 description: include file
 services: virtual-machines
 author: cynthn
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 09/03/2019
 ms.author: cynthn
 ms.custom: include file
---


Using spot VMs allow you to take advantage of our under-utilized capacity, at a significant cost savings. At any point in time when Azure needs the capacity back, the Azure infrastructure will evict spot VMs. Therefore, spot VMs are great for workloads that can handle interruptions like batch processing jobs, dev/test environments, large compute workloads, and more.

The amount of available unutilized capacity can vary based on size, region, time of day, and more. When deploying spot VMs on scale sets, Azure will allocate the VMs if there is capacity available, but there is no SLA for these VMs. A spot scale set is deployed in a single fault domain and offers no high availability guarantees.

## Eviction Policy

When deploying spot VMs, Azure will allocate the VMs if there is capacity available, but there are no SLA guarantees. At any point in time when Azure needs the capacity back, we will evict spot VMs with 30 seconds notice. 

For the preview, VMs will be evicted based on capacity. When creating spot virtual machines, the eviction policy is set to *Deallocate*. The *Deallocate* policy moves your evicted VMs to the stopped-deallocated state, allowing you to redeploy evicted instances. However, there is no guarantee that the allocation will succeed. The deallocated VMs will count against your vCPU quota and you will be charged for your underlying disks. 

You will be notified 30 seconds before the eviction policy deallocated the VM.

## Pricing

Pricing for spot VMs is variable based on region and SKU. For more information, see [spot VM pricing](). You set a max price, in USD, using up to 5 decimal places. For example, the value `0.00432`would be a max price of $0.00432 USD per hour.

To find the variable pricing for a VM size, within a specific region, use.....


## Use the Azure CLI

The process to create a VM with low-priority using the Azure CLI is the same as detailed in the [getting started article](quick-create-cli.md). Just add the '--Priority' parameter and set it to *Spot*:

```azurecli
az vm create \
    --resource-group myResourceGroup \
    --name myVM \
    --image UbuntuLTS \
    --admin-username azureuser \
    --generate-ssh-keys \
    --priority Spot
```

## Use Azure PowerShell

The process to create a spot VM using Azure PowerShell is the same as creating other VMs, just add the '-Priority' parameter to the [New-AzVmssConfig](/powershell/module/az.compute/new-azvmconfig) portion of the script and set it to *Spot*:

```azurepowershell-interactive
$resourceGroup = "myResourceGroup"
$location = "eastus"
$vmName = "mySpotVM"
$cred = Get-Credential -Message "Enter a username and password for the virtual machine."
New-AzResourceGroup -Name $resourceGroup -Location $location
$subnetConfig = New-AzVirtualNetworkSubnetConfig -Name mySubnet -AddressPrefix 192.168.1.0/24
$vnet = New-AzVirtualNetwork -ResourceGroupName $resourceGroup -Location $location `
  -Name MYvNET -AddressPrefix 192.168.0.0/16 -Subnet $subnetConfig
$pip = New-AzPublicIpAddress -ResourceGroupName $resourceGroup -Location $location `
  -Name "mypublicdns$(Get-Random)" -AllocationMethod Static -IdleTimeoutInMinutes 4
$nsgRuleRDP = New-AzNetworkSecurityRuleConfig -Name myNetworkSecurityGroupRuleRDP  -Protocol Tcp `
  -Direction Inbound -Priority 1000 -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * `
  -DestinationPortRange 3389 -Access Allow
$nsg = New-AzNetworkSecurityGroup -ResourceGroupName $resourceGroup -Location $location `
  -Name myNetworkSecurityGroup -SecurityRules $nsgRuleRDP
$nic = New-AzNetworkInterface -Name myNic -ResourceGroupName $resourceGroup -Location $location `
  -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id -NetworkSecurityGroupId $nsg.Id

# Create a virtual machine configuration and set this to be a spot VM
$vmConfig = New-AzVMConfig -VMName $vmName -VMSize Standard_D1 -Priority "Spot" | `
Set-AzVMOperatingSystem -Windows -ComputerName $vmName -Credential $cred | `
Set-AzVMSourceImage -PublisherName MicrosoftWindowsServer -Offer WindowsServer -Skus 2016-Datacenter -Version latest | `
Add-AzVMNetworkInterface -Id $nic.Id

New-AzVM -ResourceGroupName $resourceGroup -Location $location -VM $vmConfig
```

## Use Azure Resource Manager Templates

For template deployments, use`"apiVersion": "2019-03-01"`. Add the `priority`, `evictionPolicy` and `billingProfile` properties to in your template: 

```json
                "priority": "Low",
                "evictionPolicy": "Deallocate",
                "billingProfile": {
                    "maxPrice": -1
                }
```

Here is a sample template with the added properties for a spot VM. Replace the resource names with your own and `<password>` with a password for the local administrator account on the VM.

```json
{
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
    },
    "variables": {
        "vnetId": "/subscriptions/ec9fcd04-e188-48b9-abfc-a35d515f1836/resourceGroups/TestVMSS/providers/Microsoft.Network/virtualNetworks/TestVMSS",
        "subnetName": "default",
        "networkInterfaceName": "spotVMNIC",
        "publicIpAddressName": "spotVM-ip",
        "publicIpAddressType": "Dynamic",
        "publicIpAddressSku": "Basic",
        "virtualMachineName": "spotVM",
        "osDiskType": "Premium_LRS",
        "virtualMachineSize": "Standard_D2s_v3",
        "adminUsername": "azureuser",
        "adminPassword": "<password>",
        "diagnosticsStorageAccountName": "diagstoragespot2019",
        "diagnosticsStorageAccountId": "Microsoft.Storage/storageAccounts/diagstoragespot2019",
        "diagnosticsStorageAccountType": "Standard_LRS",
        "diagnosticsStorageAccountKind": "Storage",
        "subnetRef": "[concat(variables('vnetId'), '/subnets/', variables('subnetName'))]"
    },
    "resources": [
        {
            "name": "spotVM",
            "type": "Microsoft.Network/networkInterfaces",
            "apiVersion": "2018-10-01",
            "location": "eastus",
            "dependsOn": [
                "[concat('Microsoft.Network/publicIpAddresses/', variables('publicIpAddressName'))]"
            ],
            "properties": {
                "ipConfigurations": [
                    {
                        "name": "ipconfig1",
                        "properties": {
                            "subnet": {
                                "id": "[variables('subnetRef')]"
                            },
                            "privateIPAllocationMethod": "Dynamic",
                            "publicIpAddress": {
                                "id": "[resourceId(resourceGroup().name, 'Microsoft.Network/publicIpAddresses', variables('publicIpAddressName'))]"
                            }
                        }
                    }
                ]
            }
        },
        {
            "name": "[variables('publicIpAddressName')]",
            "type": "Microsoft.Network/publicIpAddresses",
            "apiVersion": "2019-02-01",
            "location": "eastus",
            "properties": {
                "publicIpAllocationMethod": "[variables('publicIpAddressType')]"
            },
            "sku": {
                "name": "[variables('publicIpAddressSku')]"
            }
        },
        {
            "name": "[variables('virtualMachineName')]",
            "type": "Microsoft.Compute/virtualMachines",
            "apiVersion": "2019-03-01",
            "location": "eastus",
            "dependsOn": [
                "[concat('Microsoft.Network/networkInterfaces/', variables('networkInterfaceName'))]",
                "[concat('Microsoft.Storage/storageAccounts/', variables('diagnosticsStorageAccountName'))]"
            ],
            "properties": {
                "hardwareProfile": {
                    "vmSize": "[variables('virtualMachineSize')]"
                },
                "storageProfile": {
                    "osDisk": {
                        "createOption": "fromImage",
                        "managedDisk": {
                            "storageAccountType": "[variables('osDiskType')]"
                        }
                    },
                    "imageReference": {
                        "publisher": "Canonical",
                        "offer": "UbuntuServer",
                        "sku": "18.04-LTS",
                        "version": "latest"
                    }
                },
                "networkProfile": {
                    "networkInterfaces": [
                        {
                            "id": "[resourceId('Microsoft.Network/networkInterfaces', variables('networkInterfaceName'))]"
                        }
                    ]
                },
                "osProfile": {
                    "computerName": "[variables('virtualMachineName')]",
                    "adminUsername": "[variables('adminUsername')]",
                    "adminPassword": "[variables('adminPassword')]"
                },
                "diagnosticsProfile": {
                    "bootDiagnostics": {
                        "enabled": true,
                        "storageUri": "[concat('https://', variables('diagnosticsStorageAccountName'), '.blob.core.windows.net/')]"
                    }
                },
                "priority": "Low",
                "evictionPolicy": "Deallocate",
                "billingProfile": {
                    "maxPrice": -1
                }				
            }
        },
        {
            "name": "[variables('diagnosticsStorageAccountName')]",
            "type": "Microsoft.Storage/storageAccounts",
            "apiVersion": "2019-04-01",
            "location": "eastus",
            "properties": {},
            "kind": "[variables('diagnosticsStorageAccountKind')]",
            "sku": {
                "name": "[variables('diagnosticsStorageAccountType')]"
            }
        }
    ],
    "outputs": {
        "adminUsername": {
            "type": "string",
            "value": "[variables('adminUsername')]"
        }
    }
}
```


##  Frequesntly asked questions

**Q:** What maxPrice value should I use when creating low-priority VM or VMSS?
**A:** Variable pricing low-priority VM and VMSS don't apply to Microsoft internal subscriptions. You should skip and ignore maxPrice when creating a low-priority VM or VMSS, so that the default value (-1) can kick-in.

**Q:** Can I know the eviction rate of a specific VM Size?
**A:** Low-priority VM eviction triggered by 24-hour TTL is eliminated. We will provide a dashboard for internal customers to look up eviction rate of a specific VM Size across Azure regions, caused by capacity reasons.

**Q:** Once created, is a low-priority VM the same as regular on-demand VM?
**A:** Yes.

**Q:** Can I convert existing scale sets to low-priority scale sets?
**A:** No, setting the low-priority flag is only supported at creation time.

**Q:** Can I create a scale set with both regular VMs and low-priority VMs?
**A:** No, a scale set cannot support more than one priority type.

**Q:** What to do when you get evicted and you need capacity?
**A:** We recommend you use On-demand VMs instead of low-priority VMs if you need capacity right away.

**Q:** What to do in case you cannot lose infrastructure or if you don’t have resilient workload?
**A:** We recommend you use the On-demand VMs instead of low-priority VMs.

**Q:** How is quota managed for low-priority VMs?
**A:** Spot VMs and regular VMs share the same quota pool. 

**Q:** Can I request for additional quota for Low Priority?
**A:** Yes, you will be able to submit the request to increase your quota for Low Priority VMs through the automation tool.

**Q:** Can I use low-priority VMs with Batch?
**A:** Yes, you will be able to use low-priority as part of Batch. Learn more about our low-priority offering on Batch .

**Q:** Can I use low-priority VMs with AKS?
**A:** Not yet. We are working with AKS team to introduce low-priority VM option in AKS.

**Q:** Where can I post questions?
**A:** You can post and tag your question with `azurespot` at http://aka.ms/stackoverflow. 

