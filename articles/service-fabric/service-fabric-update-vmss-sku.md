---
title: Procedure to upgrade/migrate the SKU for PrimaryNodeType to higher SKUs | Microsoft Docs
description: Learn how to upgrade/migrate the SKU for PrimaryNodeType to higher SKUs using PowerShell commands and CLI commands.
services: service-fabric
documentationcenter: .net
author: v-rachiw
manager: navya
editor: ''

ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 05/08/2018
ms.author: v-rachiw

---
# Upgrade/migrate the SKU for Primary Node Type to higher SKU

This article describes how to upgrade/migrate the SKU of Primary Node Type of service fabric cluster to higher SKU using Azure PowerShell

## Add a new virtual machine scale set

Deploy a new virtual machine scale set and Load Balancer. The Service Fabric extension configuration (especially the node type) of new virtual machine scale set should be same as the old scale set you're trying to upgrade. Verify in the Service Fabric explorer that your new nodes are available

#### Azure PowerShell

The following example uses Azure PowerShell to deploy updated Resource Manager template *template.json* using the resource group named *myResourceGroup*:

```powershell
New-AzureRmResourceGroupDeployment -ResourceGroupName myResourceGroup -TemplateFile template.json -TemplateParameterFile parameters.json
```

#### Azure CLI

The following command uses Azure Service Fabric CLI to deploy updated Resource Manager template *template.json* using the resource group named *myResourceGroup*:

```CLI
az group deployment create --resource-group myResourceGroup --template-file template.json --parameters parameters.json
```

Refer following example to modify json template to add new virtual machine scale set resource with Primary node type in existing cluster

```json
        {
            "apiVersion": "[variables('vmssApiVersion')]",
            "type": "Microsoft.Compute/virtualMachineScaleSets",
            "name": "[parameters('vmNodeType2Name')]",
            "location": "[parameters('computeLocation')]",
            "dependsOn": [
                "[concat('Microsoft.Network/virtualNetworks/', parameters('virtualNetworkName'))]",
                "[concat('Microsoft.Network/loadBalancers/', concat('LB','-', parameters('clusterName'),'-',parameters('vmNodeType2Name')))]",
                "[concat('Microsoft.Storage/storageAccounts/', parameters('supportLogStorageAccountName'))]",
                "[concat('Microsoft.Storage/storageAccounts/', parameters('applicationDiagnosticsStorageAccountName'))]"
            ],
            "properties": {
                "overprovision": "[parameters('overProvision')]",
                "upgradePolicy": {
                    "mode": "Automatic"
                },
                "virtualMachineProfile": {
                    "extensionProfile": {
                        "extensions": [
                            {
                                "name": "[concat(parameters('vmNodeType2Name'),'_ServiceFabricNode')]",
                                "properties": {
                                    "type": "ServiceFabricNode",
                                    "autoUpgradeMinorVersion": true,
                                    "protectedSettings": {
                                        "StorageAccountKey1": "[listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('supportLogStorageAccountName')),'2015-05-01-preview').key1]",
                                        "StorageAccountKey2": "[listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('supportLogStorageAccountName')),'2015-05-01-preview').key2]"
                                    },
                                    "publisher": "Microsoft.Azure.ServiceFabric",
                                    "settings": {
                                        "clusterEndpoint": "[reference(parameters('clusterName')).clusterEndpoint]",
                                        "nodeTypeRef": "[parameters('vmNodeType0Name')]",
                                        "dataPath": "D:\\\\SvcFab",
                                        "durabilityLevel": "Bronze",
                                        "enableParallelJobs": true,
                                        "nicPrefixOverride": "[parameters('subnet0Prefix')]",
                                        "certificate": {
                                            "thumbprint": "[parameters('certificateThumbprint')]",
                                            "x509StoreName": "[parameters('certificateStoreValue')]"
                                        }
                                    },
                                    "typeHandlerVersion": "1.0"
                                }
                            },
                            {
                                "name": "[concat('VMDiagnosticsVmExt','_vmNodeType2Name')]",
                                "properties": {
                                    "type": "IaaSDiagnostics",
                                    "autoUpgradeMinorVersion": true,
                                    "protectedSettings": {
                                        "storageAccountName": "[parameters('applicationDiagnosticsStorageAccountName')]",
                                        "storageAccountKey": "[listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('applicationDiagnosticsStorageAccountName')),'2015-05-01-preview').key1]",
                                        "storageAccountEndPoint": "https://core.windows.net/"
                                    },
                                    "publisher": "Microsoft.Azure.Diagnostics",
                                    "settings": {
                                        "WadCfg": {
                                            "DiagnosticMonitorConfiguration": {
                                                "overallQuotaInMB": "50000",
                                                "EtwProviders": {
                                                    "EtwEventSourceProviderConfiguration": [
                                                        {
                                                            "provider": "Microsoft-ServiceFabric-Actors",
                                                            "scheduledTransferKeywordFilter": "1",
                                                            "scheduledTransferPeriod": "PT5M",
                                                            "DefaultEvents": {
                                                                "eventDestination": "ServiceFabricReliableActorEventTable"
                                                            }
                                                        },
                                                        {
                                                            "provider": "Microsoft-ServiceFabric-Services",
                                                            "scheduledTransferPeriod": "PT5M",
                                                            "DefaultEvents": {
                                                                "eventDestination": "ServiceFabricReliableServiceEventTable"
                                                            }
                                                        }
                                                    ],
                                                    "EtwManifestProviderConfiguration": [
                                                        {
                                                            "provider": "cbd93bc2-71e5-4566-b3a7-595d8eeca6e8",
                                                            "scheduledTransferLogLevelFilter": "Information",
                                                            "scheduledTransferKeywordFilter": "4611686018427387904",
                                                            "scheduledTransferPeriod": "PT5M",
                                                            "DefaultEvents": {
                                                                "eventDestination": "ServiceFabricSystemEventTable"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        "StorageAccount": "[parameters('applicationDiagnosticsStorageAccountName')]"
                                    },
                                    "typeHandlerVersion": "1.5"
                                }
                            }
                        ]
                    },
					"networkProfile": {
                        "networkInterfaceConfigurations": [
                            {
                                "name": "[concat(parameters('nicName'), '-2')]",
                                "properties": {
                                    "ipConfigurations": [
                                        {
                                            "name": "[concat(parameters('nicName'),'-',2)]",
                                            "properties": {
                                                "loadBalancerBackendAddressPools": [
                                                    {
                                                        "id": "[variables('lbPoolID2')]"
                                                    }
                                                ],
                                                "loadBalancerInboundNatPools": [
                                                    {
                                                        "id": "[variables('lbNatPoolID2')]"
                                                    }
                                                ],
                                                "subnet": {
                                                    "id": "[variables('subnet0Ref')]"
                                                }
                                            }
                                        }
                                    ],
                                    "primary": true
                                }
                            }
                        ]
                    },
                    "osProfile": {
                        "adminPassword": "[parameters('adminPassword')]",
                        "adminUsername": "[parameters('adminUsername')]",
                        "computernamePrefix": "[parameters('vmNodeType2Name')]",
                        "secrets": [
                            {
                                "sourceVault": {
                                    "id": "[parameters('sourceVaultValue')]"
                                },
                                "vaultCertificates": [
                                    {
                                        "certificateStore": "[parameters('certificateStoreValue')]",
                                        "certificateUrl": "[parameters('certificateUrlValue')]"
                                    }
                                ]
                            }
                        ]
                    },
                    "storageProfile": {
                        "imageReference": {
                            "publisher": "[parameters('vmImagePublisher')]",
                            "offer": "[parameters('vmImageOffer')]",
                            "sku": "[parameters('vmImageSku')]",
                            "version": "[parameters('vmImageVersion')]"
                        },
                        "osDisk": {
                            "caching": "ReadOnly",
                            "createOption": "FromImage",
                            "managedDisk": {
                                "storageAccountType": "[parameters('storageAccountType')]"
                            }
                        }
                    }
                }
            },
            "sku": {
                "name": "[parameters('vmNodeType2Size')]",
                "capacity": "[parameters('nt2InstanceCount')]",
                "tier": "Standard"
            },
            "tags": {
                "resourceType": "Service Fabric",
                "clusterName": "[parameters('clusterName')]"
            }
        },
```

## Remove old virtual machine scale set

1. Disable VM instances of old virtual machine scale set with intent to remove node. This operation may take a long time to complete. You can disable all at once and they'll be queued. Wait until all nodes are disabled. 
#### Azure PowerShell
The following example uses Azure Service Fabric PowerShell to disable node instance named *NTvm1_0* from old virtual machine scale set named *NTvm1*:
```powershell
Disable-ServiceFabricNode -NodeName NTvm1_0 -Intent RemoveNode
```
#### Azure CLI
The following command uses Azure Service Fabric CLI to disable node instance named *NTvm1_0* from old virtual machine scale set named *NTvm1*:
```CLI
sfctl node disable --node-name "_NTvm1_0" --deactivation-intent RemoveNode
```
2. Remove the complete scale set. Wait until scale set Provisioning state is succeeded
#### Azure PowerShell
The following example uses Azure PowerShell to remove the complete scale set named *NTvm1* from resource group named *myResourceGroup*:
```powershell
Remove-AzureRmVmss -ResourceGroupName myResourceGroup -VMScaleSetName NTvm1
```
#### Azure CLI
The following command uses Azure Service Fabric CLI to remove the complete scale set named *NTvm1* from resource group named *myResourceGroup*:

```CLI
az vmss delete --name NTvm1 --resource-group myResourceGroup
```

## Remove Load Balancer related to old scale set

Remove Load Balancer related to old scale set. This step will cause a brief period of downtime for the cluster

#### Azure PowerShell

The following example uses Azure PowerShell to remove Load balancer named *LB-myCluster-NTvm1* related to old scale set from resource group named *myResourceGroup*:

```powershell
Remove-AzureRmLoadBalancer -Name LB-myCluster-NTvm1 -ResourceGroupName myResourceGroup
```

#### Azure CLI

The following command uses Azure Service Fabric CLI to remove Load balancer named *LB-myCluster-NTvm1* related to old scale set from resource group named *myResourceGroup*:

```CLI
az network lb delete --name LB-myCluster-NTvm1 --resource-group myResourceGroup
```

## Remove Public IP related to old scale set

Store DNS settings of Public IP address related to old scale set into variable, then remove the Public IP address

#### Azure PowerShell

The following example uses Azure PowerShell to store DNS settings of Public IP address named *LBIP-myCluster-NTvm1* into variable and remove the IP address:

```powershell
$oldprimaryPublicIP = Get-AzureRmPublicIpAddress -Name LBIP-myCluster-NTvm1  -ResourceGroupName myResourceGroup
$primaryDNSName = $oldprimaryPublicIP.DnsSettings.DomainNameLabel
$primaryDNSFqdn = $oldprimaryPublicIP.DnsSettings.Fqdn
Remove-AzureRmPublicIpAddress -Name LBIP-myCluster-NTvm1 -ResourceGroupName myResourceGroup
```

#### Azure CLI

The following command uses Azure Service Fabric CLI to get DNS settings of Public IP address named *LBIP-myCluster-NTvm1* and remove the IP address:

```CLI
az network public-ip show --name LBIP-myCluster-NTvm1 --resource-group myResourceGroup
az network public-ip delete --name LBIP-myCluster-NTvm1 --resource-group myResourceGroup
```

## Update public IP address related to new scale set

Update DNS settings of Public IP address related to new scale set with DNS settings of Public IP address related to old scale set

#### Azure PowerShell
The following example uses Azure PowerShell to update DNS settings of public IP address named *LBIP-myCluster-NTvm3* with DNS settings stored in variables in earlier step:

```powershell
$PublicIP = Get-AzureRmPublicIpAddress -Name LBIP-myCluster-NTvm3  -ResourceGroupName myResourceGroup
$PublicIP.DnsSettings.DomainNameLabel = $primaryDNSName
$PublicIP.DnsSettings.Fqdn = $primaryDNSFqdn
Set-AzureRmPublicIpAddress -PublicIpAddress $PublicIP
```

#### Azure CLI

The following command uses Azure Service Fabric CLI to update DNS settings of public IP address named *LBIP-myCluster-NTvm3* with DNS settings of old public IP gathered in earlier step:

```CLI
az network public-ip update --name LBIP-myCluster-NTvm3 --resource-group myResourceGroup --dns-name myCluster
```

## Remove knowledge of service fabric node from FM

Notify Service Fabric that the nodes, which are down have been removed from the cluster. (Run this command for all VM instances of old virtual machine scale set)
(If the Durability level of the old virtual machine scale set was silver or gold, this step may not be needed. Since that step is done by the system automatically.)

#### Azure PowerShell
The following example uses Azure Service Fabric PowerShell to notify service fabric that the node named *NTvm1_0* has been removed:

```powershell
Remove-ServiceFabricNodeState -NodeName NTvm1_0
```

#### Azure CLI

The following command uses Azure Service Fabric CLI to notify service fabric that the node named *NTvm1_0* has been removed:

```CLI
sfctl node remove-state --node-name _NTvm1_0
```
