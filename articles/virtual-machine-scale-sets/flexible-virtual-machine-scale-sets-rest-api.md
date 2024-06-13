---
title: Create virtual machines in a Flexible scale set using an ARM template
description: Learn how to create a Virtual Machine Scale Set in Flexible orchestration mode using an ARM template.
author: fitzgeraldsteele
ms.author: fisteele
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.date: 11/22/2022
ms.reviewer: jushiman
ms.custom: mimckitt, vmss-flex, devx-track-arm-template
---

# Create virtual machines in a scale set using an ARM template

This article steps through using an ARM template to create a Virtual Machine Scale Set. 


[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.compute%2Fvmss-flexible-orchestration-quickstart%2Fazuredeploy.json":::

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## ARM template 

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

ARM templates let you deploy groups of related resources. In a single template, you can create the Virtual Machine Scale Set, install applications, and configure autoscale rules. With the use of variables and parameters, this template can be reused to update existing, or create additional, scale sets. You can deploy templates through the Azure portal, Azure CLI, or Azure PowerShell, or from continuous integration / continuous delivery (CI/CD) pipelines.


## Review the template

```armasm
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
      "location": {
        "type": "string",
        "defaultValue": "[resourceGroup().location]",
        "metadata": {
          "description": "Location for all resources"
        }
      },
      "vmSku": {
        "type": "string",
        "defaultValue": "Standard_D2s_v3",
        "metadata": {
          "description": "Size of VMs in the VM Scale Set."
        }
      },
      "vmssName": {
        "type": "string",
        "metadata": {
          "description": "String used as a base for naming resources (9 characters or less). A hash is prepended to this string for some resources, and resource-specific information is appended."
        }
      },
      "instanceCount": {
        "type": "int",
        "defaultValue": 1,
        "minValue": 1,
        "maxValue": 100,
        "metadata": {
          "description": "Number of VM instances (100 or less)."
        }
      },
      "adminUsername": {
        "type": "string",
        "metadata": {
          "description": "Admin username on all VMs."
        }
      },
      "authenticationType": {
        "type": "string",
        "defaultValue": "sshPublicKey",
        "allowedValues": [
          "sshPublicKey",
          "password"
        ],
        "metadata": {
          "description": "Type of authentication to use on the Virtual Machine. SSH key is recommended."
        }
      },
      "adminPasswordOrKey": {
        "type": "securestring",
        "metadata": {
          "description": "SSH Key or password for the Virtual Machine. SSH key is recommended."
        }
      },
      "securityType": {
          "type": "string",
          "defaultValue": "TrustedLaunch",
          "allowedValues": [
            "Standard",
            "TrustedLaunch"
          ],
          "metadata": {
            "description": "Security Type of the Virtual Machine."
          }
      },
      "_artifactsLocation": {
        "type": "string",
        "defaultValue": "[deployment().properties.templatelink.uri]",
        "metadata": {
          "description": "The base URI where artifacts required by this template are located"
        }
      },
      "_artifactsLocationSasToken": {
        "type": "securestring",
        "defaultValue": "",
        "metadata": {
          "description": "The sasToken required to access _artifactsLocation.  When the template is deployed using the accompanying scripts, a sasToken will be automatically generated"
        }
      }
    },
    "variables": {
      "addressPrefix": "10.0.0.0/16",
      "subnetPrefix": "10.0.0.0/24",
      "networkApiVersion": "2020-11-01",
      "virtualNetworkName": "[concat(parameters('vmssName'), 'vnet')]",
      "publicIPAddressName": "[concat(parameters('vmssName'), 'pip')]",
      "subnetName": "[concat(parameters('vmssName'), 'subnet')]",
      "loadBalancerName": "[concat(parameters('vmssName'), 'lb')]",
      "publicIPAddressID": "[resourceId('Microsoft.Network/publicIPAddresses',variables('publicIPAddressName'))]",
      "networkSecurityGroupName": "[concat(parameters('vmssName'), 'nsg')]",
      "bePoolName": "[concat(parameters('vmssName'), 'bepool')]",
      "lbRuleName": "[concat(parameters('vmssName'), 'lbrule')]",
      "lbProbeName": "[concat(parameters('vmssName'), 'lbprobe')]",
      "bePoolConfigID": "[resourceId('Microsoft.Network/loadBalancers/backendAddressPools', variables('loadBalancerName'),variables('bePoolName'))]",
      "lbProbeID": "[resourceId('Microsoft.Network/loadBalancers/probes', variables('loadBalancerName'),variables('lbProbeName'))]",
      "nicName": "[concat(parameters('vmssName'), 'nic')]",
      "ipConfigName": "[concat(parameters('vmssName'), 'ipconfig')]",
      "frontEndIPConfigID": "[resourceId('Microsoft.Network/loadBalancers/frontendIPConfigurations', variables('loadBalancerName'),'loadBalancerFrontEnd')]",
      "osType": {
          "publisher": "Canonical",
          "offer": "0001-com-ubuntu-server-focal",
          "sku": "20_04-lts-gen2",
          "version": "latest"
      },
      "imageReference": "[variables('osType')]",
      "securityProfileJson": {
          "uefiSettings": {
            "secureBootEnabled": true,
            "vTpmEnabled": true
          },
          "securityType": "[parameters('securityType')]"
      },
      "linuxConfiguration": {
        "disablePasswordAuthentication": true,
        "ssh": {
          "publicKeys": [
            {
              "path": "[concat('/home/', parameters('adminUsername'), '/.ssh/authorized_keys')]",
              "keyData": "[parameters('adminPasswordOrKey')]"
            }
          ]
        }
      }
    },
    "resources": [
              {
            "type": "Microsoft.Network/networkSecurityGroups",
            "apiVersion": "2023-04-01",
            "name": "[variables('networkSecurityGroupName')]",
            "location": "[parameters('location')]",
            "properties": {
                "securityRules": [
                    {
                        "name": "AllowPort9000",
                        "properties": {
                            "protocol": "*",
                            "sourcePortRange": "*",
                            "destinationPortRange": "9000",
                            "sourceAddressPrefix": "Internet",
                            "destinationAddressPrefix": "*",
                            "access": "Allow",
                            "priority": 100,
                            "direction": "Inbound"
                        }
                    }
                ]
            }
        },
      {
        "type": "Microsoft.Network/virtualNetworks",
        "apiVersion": "2023-04-01",
        "name": "[variables('virtualNetworkName')]",
        "location": "[parameters('location')]",
        "properties": {
          "addressSpace": {
            "addressPrefixes": [
              "[variables('addressPrefix')]"
            ]
          },
          "subnets": [
            {
              "name": "[variables('subnetName')]",
              "properties": {
                "addressPrefix": "[variables('subnetPrefix')]",
                "networkSecurityGroup": {
                  "id": "[resourceId('Microsoft.Network/networkSecurityGroups', variables('networkSecurityGroupName'))]"
                }
              }
            }
          ]
        }
      },
      {
        "type": "Microsoft.Network/publicIPAddresses",
        "apiVersion": "2023-04-01",
        "name": "[variables('publicIPAddressName')]",
        "location": "[parameters('location')]",
        "sku": {
          "name": "Standard"
        },
        "properties": {

          "publicIPAllocationMethod": "Static",
          "dnsSettings": {
            "domainNameLabel": "[parameters('vmssName')]"
          }
        }
      },
      {
        "type": "Microsoft.Network/loadBalancers",
        "apiVersion": "2023-04-01",
        "name": "[variables('loadBalancerName')]",
        "location": "[parameters('location')]",
        "sku": {
          "name": "Standard"
        },
        "dependsOn": [
          "[resourceId('Microsoft.Network/publicIPAddresses', variables('publicIPAddressName'))]"
        ],
        "properties": {
          "frontendIPConfigurations": [
            {
              "name": "LoadBalancerFrontEnd",
              "properties": {
                "publicIPAddress": {
                  "id": "[variables('publicIPAddressID')]"
                }
              }
            }
          ],
          "backendAddressPools": [
            {
              "name": "[variables('bePoolName')]"
            }
          ],
          "probes": [
            {
              "name": "[variables('lbProbeName')]",
              "properties": {
                "port": 9000,
                "protocol": "Tcp",
                "numberOfProbes": 2,
                "intervalInSeconds": 5
              }
            }
          ],
          "loadBalancingRules": [
            {
              "name": "[variables('lbRuleName')]",
              "properties": {
                "frontendIPConfiguration": {
                  "id": "[variables('frontEndIPConfigID')]"
                },
                "backendAddressPool": {
                  "id": "[variables('bePoolConfigID')]"
                },
                "probe": {
                  "id": "[variables('lbProbeID')]"
                },
                "loadDistribution": "Default",
                "backendPort": 9000,
                "frontendPort": 9000,
                "protocol": "Tcp",
                "idleTimeoutInMinutes": 4,
                "enableFloatingIP": false,
                "enableTcpReset": false,
                "disableOutboundSnat": false
              }
             }
          ]
        }
      },
      {
        "type": "Microsoft.Compute/virtualMachineScaleSets",
        "apiVersion": "2023-09-01",
        "name": "[parameters('vmssName')]",
        "location": "[parameters('location')]",
        "sku": {
          "name": "[parameters('vmSku')]",
          "tier": "Standard",
          "capacity": "[parameters('instanceCount')]"
        },
        "dependsOn": [
          "[resourceId('Microsoft.Network/loadBalancers', variables('loadBalancerName'))]",
          "[resourceId('Microsoft.Network/virtualNetworks', variables('virtualNetworkName'))]"
        ],
        "properties": {
          "orchestrationMode": "Flexible",
          "platformFaultDomainCount": 1,
          "singlePlacementGroup": false,
          "virtualMachineProfile": {
            "storageProfile": {
              "osDisk": {
                "createOption": "FromImage",
                "caching": "ReadWrite"
              },
              "imageReference": "[variables('imageReference')]"
            },
            "osProfile": {
              "computerNamePrefix": "[parameters('vmssName')]",
              "adminUsername": "[parameters('adminUsername')]",
              "adminPassword": "[parameters('adminPasswordOrKey')]",
              "linuxConfiguration": "[if(equals(parameters('authenticationType'), 'password'), null(), variables('linuxConfiguration'))]"
            },
            "securityProfile": "[if(equals(parameters('securityType'), 'TrustedLaunch'), variables('securityProfileJson'), null())]",
            "networkProfile": {
              "networkApiVersion": "[variables('networkApiVersion')]",
              "networkInterfaceConfigurations": [
                {
                  "name": "[variables('nicName')]",
                  "properties": {
                    "primary": true,
                    "ipConfigurations": [
                      {
                        "name": "[variables('ipConfigName')]",
                        "properties": {
                          "primary": true,
                          "subnet": {
                            "id": "[resourceId('Microsoft.Network/virtualNetworks/subnets', variables('virtualNetworkName'), variables('subnetName'))]"
                          },
                          "loadBalancerBackendAddressPools": [
                            {
                              "id": "[resourceId('Microsoft.Network/loadBalancers/backendAddressPools', variables('loadBalancerName'), variables('bePoolName'))]"
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            },
            "extensionProfile": {
              "extensions": [
                {
                  "name": "lapextension",
                  "properties": {
                    "publisher": "Microsoft.Azure.Extensions",
                    "type": "CustomScript",
                    "typeHandlerVersion": "2.0",
                    "autoUpgradeMinorVersion": true,
                    "settings": {
                      "fileUris": [
                        "[uri(parameters('_artifactsLocation'), concat('installserver.sh', parameters('_artifactsLocationSasToken')))]",
                        "[uri(parameters('_artifactsLocation'), concat('workserver.py', parameters('_artifactsLocationSasToken')))]"
                      ],
                      "commandToExecute": "bash installserver.sh"
                    }
                  }
                }
              ]
            }
          }
        }
      },
      {
        "type": "Microsoft.Insights/autoscaleSettings",
        "apiVersion": "2022-10-01",
        "name": "[concat(parameters('vmssName'), '-autoscalehost')]",
        "location": "[parameters('location')]",
        "dependsOn": [
          "[resourceId('Microsoft.Compute/virtualMachineScaleSets', parameters('vmSSName'))]"
        ],
        "properties": {
          "name": "[concat(parameters('vmssName'), '-autoscalehost')]",
          "targetResourceUri": "[resourceId('Microsoft.Compute/virtualMachineScaleSets', parameters('vmSSName'))]",
          "enabled": true,
          "profiles": [
            {
              "name": "Profile1",
              "capacity": {
                "minimum": "1",
                "maximum": "10",
                "default": "1"
              },
              "rules": [
                {
                  "metricTrigger": {
                    "metricName": "Percentage CPU",
                    "metricResourceUri": "[resourceId('Microsoft.Compute/virtualMachineScaleSets', parameters('vmSSName'))]",
                    "timeGrain": "PT1M",
                    "statistic": "Average",
                    "timeWindow": "PT5M",
                    "timeAggregation": "Average",
                    "operator": "GreaterThan",
                    "threshold": 60
                  },
                  "scaleAction": {
                    "direction": "Increase",
                    "type": "ChangeCount",
                    "value": "1",
                    "cooldown": "PT1M"
                  }
                },
                {
                  "metricTrigger": {
                    "metricName": "Percentage CPU",
                    "metricResourceUri": "[resourceId('Microsoft.Compute/virtualMachineScaleSets', parameters('vmSSName'))]",
                    "timeGrain": "PT1M",
                    "statistic": "Average",
                    "timeWindow": "PT5M",
                    "timeAggregation": "Average",
                    "operator": "LessThan",
                    "threshold": 30
                  },
                  "scaleAction": {
                    "direction": "Decrease",
                    "type": "ChangeCount",
                    "value": "1",
                    "cooldown": "PT1M"
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  }
```

These resources are defined in the template:

- [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualnetworks)
- [**Microsoft.Network/publicIPAddresses**](/azure/templates/microsoft.network/publicipaddresses)
- [**Microsoft.Network/loadBalancers**](/azure/templates/microsoft.network/loadbalancers)
- [**Microsoft.Compute/virtualMachineScaleSets**](/azure/templates/microsoft.compute/virtualmachinescalesets)
- [**Microsoft.Insights/autoscaleSettings**](/azure/templates/microsoft.insights/autoscalesettings)
- [**Microsoft.Network/networkSecurityGroups**](/azure/templates/microsoft.network/networksecuritygroups)

### Define a scale set

To create a scale with a template, you define the appropriate resources. The core parts of the Virtual Machine Scale Set resource type are:

| Property                     | Description of property                                  | Example template value                    |
|------------------------------|----------------------------------------------------------|-------------------------------------------|
| type                         | Azure resource type to create                            | Microsoft.Compute/virtualMachineScaleSets |
| name                         | The scale set name                                       | myScaleSet                                |
| location                     | The location to create the scale set                     | East US                                   |
| sku.name                     | The VM size for each scale set instance                  | Standard_A1                               |
| sku.capacity                 | The number of VM instances to initially create           | 2                                         |
| imageReference               | The platform or custom image to use for the VM instances | Canonical Ubuntu Server 16.04-LTS         |
| osProfile.computerNamePrefix | The name prefix for each VM instance                     | myvmss                                    |
| osProfile.adminUsername      | The username for each VM instance                        | azureuser                                 |
| osProfile.adminPassword      | The password for each VM instance                        | P@ssw0rd!                                 |

To customize a scale set template, you can change the VM size or initial capacity. Another option is to use a different platform or a custom image.

### Add a sample application

To test your scale set, install a basic web application. When you deploy a scale set, VM extensions can provide post-deployment configuration and automation tasks, such as installing an app. Scripts can be downloaded from Azure storage or GitHub, or provided to the Azure portal at extension run-time. To apply an extension to your scale set, you add the *extensionProfile* section to the preceding resource example. The extension profile typically defines the following properties:

- Extension type
- Extension publisher
- Extension version
- Location of configuration or install scripts
- Commands to execute on the VM instances

The template uses the Custom Script Extension to install [Bottle](https://bottlepy.org/docs/dev/), a Python web framework, and a simple HTTP server.

Two scripts are defined in **fileUris** - *installserver.sh*, and *workserver.py*. These files are downloaded from GitHub, then *commandToExecute* runs `bash installserver.sh` to install and configure the app.

## Deploy the template

You can also deploy a Resource Manager template by using Azure CLI:

```azurecli-interactive
# Create a resource group
az group create --name myResourceGroup --location EastUS

# Deploy template into resource group
az deployment group create -g myResourceGroup -f azuredeploy.json --parameters _artifactsLocation=https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/application-workloads/python/vmss-bottle-autoscale/azuredeploy.json
```

Answer the prompts to provide a scale set name, instance count, and admin credentials for the VM instances. It takes a few minutes for the scale set and supporting resources to be created.

## Validate the deployment

To see your scale set in action, access the sample web application in a web browser. Obtain the public IP address of the load balancer with [az network public-ip list](/cli/azure/network/public-ip) as follows:

```azurecli-interactive
az network public-ip list \
    --resource-group myResourceGroup \
    --query [*].ipAddress -o tsv
```

Enter the public IP address of the load balancer in to a web browser in the format *http:\//publicIpAddress:9000/do_work*. The load balancer distributes traffic to one of your VM instances, as shown in the following example:

![Default web page in NGINX](../virtual-machine-scale-sets/media/virtual-machine-scale-sets-create-template/running-python-app.png)

## Clean up resources

When no longer needed, you can use [az group delete](/cli/azure/group) to remove the resource group, scale set, and all related resources as follows. The `--no-wait` parameter returns control to the prompt without waiting for the operation to complete. The `--yes` parameter confirms that you wish to delete the resources without an additional prompt to do so.

```azurecli-interactive
az group delete --name myResourceGroup --yes --no-wait
```


## Next steps
> [!div class="nextstepaction"]
> [Learn how to create a Flexible scale set in the Azure portal.](flexible-virtual-machine-scale-sets-portal.md)
