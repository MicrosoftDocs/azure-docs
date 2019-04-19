---
title: Configure IPv6 endpoints in a Resource Manger template (preview)
titlesuffix: Azure Virtual Network
description: Enable IPv6 endpoints in Azure Virtual Network using Azure Resource Manager VM templates.
services: virtual-network
documentationcenter: na
author: KumudD
manager: twooley
ms.service: virtual-network
ms.devlang: NA
ms.topic: article
ms.workload: infrastructure-services
ms.date: 03/20/2019
ms.author: kumud
---

# Deploy a dual stack (IPv4 + IPv6) application in Azure - Template (Preview)

This article provides a list of IPv6 configuration tasks with the portion of the Azure Resource Manager VM template that applies to. Use the template described in this article to deploy a dual stack (IPv4 + IPv6) application in Azure that includes a dual stack virtual network with IPv4 and IPv6 subnets, a load balancer with dual (IPv4 + IPv6) front-end configurations, VMs with NICs that have a dual IP configuration, network security group, and public IPs. 

## Required configurations

Search for the template sections in the template to see where they should occur.

### IPv6 addressSpace for the virtual network

Template section to add:

```JSON
        "addressSpace": {
          "addressPrefixes": [
            "[variables('vnetv4AddressRange')]",
            "[variables('vnetv6AddressRange')]"    
```

### IPv6 subnet within the IPv6 virtual network addressSpace

Template section to add:
```JSON
          {
            "name": "V6Subnet",
            "properties": {
              "addressPrefix": "[variables('subnetv6AddressRange')]"
            }

```

### IPv6 configuration for the NIC

Template section to add:
```JSON
          {
            "name": "ipconfig-v6",
            "properties": {
              "privateIPAllocationMethod": "Dynamic",
	      "privateIPAddressVersion":"IPv6",
              "subnet": {
                "id": "[variables('v6-subnet-id')]"
              },
              "loadBalancerBackendAddressPools": [
                {
                  "id": "[concat(resourceId('Microsoft.Network/loadBalancers','loadBalancer'),'/backendAddressPools/LBBAP-v6')]"
                }
```

### IPv6 network security group (NSG) rules

```JSON
          {
            "name": "default-allow-rdp",
            "properties": {
              "description": "Allow RDP",
              "protocol": "Tcp",
              "sourcePortRange": "33819-33829",
              "destinationPortRange": "5000-6000",
              "sourceAddressPrefix": "ace:cab:deca:deed::/64",
              "destinationAddressPrefix": "cab:ace:deca:deed::/64",
              "access": "Allow",
              "priority": 1003,
              "direction": "Inbound"
            }
```

## Conditional configuration

If you're using a network virtual appliance, add IPv6 routes in the Route Table. Otherwise, this configuration is optional.

```JSON
    {
      "type": "Microsoft.Network/routeTables",
      "name": "v6route",
      "apiVersion": "[variables('ApiVersion')]",
      "location": "[resourceGroup().location]",
      "properties": {
        "routes": [
          {
            "name": "v6route",
            "properties": {
              "addressPrefix": "ace:cab:deca:deed::/64",
              "nextHopType": "VirtualAppliance",
              "nextHopIpAddress": "deca:cab:ace:f00d::1"
            }
```

## Optional configuration

### IPv6 Internet access for the virtual network

```JSON
{
            "name": "LBFE-v6",
            "properties": {
              "publicIPAddress": {
                "id": "[resourceId('Microsoft.Network/publicIPAddresses','lbpublicip-v6')]"
              }
```

### IPv6 Public IP addresses

```JSON
	{
      "apiVersion": "[variables('ApiVersion')]",
      "type": "Microsoft.Network/publicIPAddresses",
      "name": "lbpublicip-v6",
      "location": "[resourceGroup().location]",
      "properties": {
        "publicIPAllocationMethod": "Dynamic",
		"publicIPAddressVersion": "IPv6"
      }
```

### IPv6 Front end for Load Balancer

```JSON
		  {
            "name": "LBFE-v6",
            "properties": {
              "publicIPAddress": {
                "id": "[resourceId('Microsoft.Network/publicIPAddresses','lbpublicip-v6')]"
              }
```

### IPv6 Back-end address pool for Load Balancer

```JSON
              "backendAddressPool": {
                "id": "[concat(resourceId('Microsoft.Network/loadBalancers', 'loadBalancer'), '/backendAddressPools/LBBAP-v6')]"
              },
              "protocol": "Tcp",
              "frontendPort": 8080,
              "backendPort": 8080
            },
            "name": "lbrule-v6"
```

### IPv6 load balancer rules to associate incoming and outgoing ports

```JSON
          {
            "name": "ipconfig-v6",
            "properties": {
              "privateIPAllocationMethod": "Dynamic",
	      "privateIPAddressVersion":"IPv6",
              "subnet": {
                "id": "[variables('v6-subnet-id')]"
              },
              "loadBalancerBackendAddressPools": [
                {
                  "id": "[concat(resourceId('Microsoft.Network/loadBalancers','loadBalancer'),'/backendAddressPools/LBBAP-v6')]"
                }
```

## Sample VM template JSON

```JSON
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "adminUsername": {
      "type": "string",
      "metadata": {
        "description": "The name of the administrator of the new VM. Exclusion list: 'admin','administrator'"
      }
    },
    "adminPassword": {
      "type": "securestring",
      "metadata": {
        "description": "The password for the administrator account of the new VM"
      }
    }
  },
  "variables": {
    "vnetv4AddressRange": "10.0.0.0/16",
    "vnetv6AddressRange": "ace:cab:deca::/48",
    "subnetv4AddressRange": "10.0.0.0/24",
    "subnetv6AddressRange": "ace:cab:deca:deed::/64",
    "subnetName": "Subnet",
    "newStorageAccountName": "[concat('st', uniqueString(resourceGroup().id))]",
    "v6subnetName": "V6Subnet",
    "availabilitySetName": "myavlset",
    "v4-subnet-id": "[concat(resourceId('Microsoft.Network/virtualNetworks','VNET'),'/subnets/',variables('subnetName'))]",
    "v6-subnet-id": "[concat(resourceId('Microsoft.Network/virtualNetworks','VNET'),'/subnets/',variables('v6subnetName'))]",
    "ApiVersion": "2017-10-01",
    "numberOfInstances": 2,
    "vmName": "vm",
	"publicipName": "publicIp",
    "imagePublisher": "MicrosoftWindowsServer",
    "imageOffer": "WindowsServer",
    "imageSku": "2012-R2-Datacenter"
  },
  "resources": [
    {
      "apiVersion": "[variables('ApiVersion')]",
      "type": "Microsoft.Network/publicIPAddresses",
      "name": "[concat(variables('publicipName'), copyindex())]",
      "copy": {
        "name": "publicIpLoop",
        "count": "[variables('numberOfInstances')]"
      },
      "location": "[resourceGroup().location]",
      "properties": {
        "publicIPAllocationMethod": "Dynamic"
      }
    },
	{
      "apiVersion": "[variables('ApiVersion')]",
      "type": "Microsoft.Network/publicIPAddresses",
      "name": "lbpublicip",
      "location": "[resourceGroup().location]",
      "properties": {
        "publicIPAllocationMethod": "Dynamic"
      }
    },
	{
      "apiVersion": "[variables('ApiVersion')]",
      "type": "Microsoft.Network/publicIPAddresses",
      "name": "lbpublicip-v6",
      "location": "[resourceGroup().location]",
      "properties": {
        "publicIPAllocationMethod": "Dynamic",
		"publicIPAddressVersion": "IPv6"
      }
    },
    {
      "type": "Microsoft.Compute/availabilitySets",
      "name": "[variables('availabilitySetName')]",
      "apiVersion": "2016-04-30-preview",
      "location": "[resourceGroup().location]",
      "properties": {
        "platformFaultDomainCount": "1",
        "platformUpdateDomainCount": "1",
        "managed": "true"
      }
    },
    {
      "apiVersion": "2015-06-15",
      "type": "Microsoft.Storage/storageAccounts",
      "name": "[variables('newStorageAccountName')]",
      "location": "eastus2",
      "properties": {
        "accountType": "Standard_LRS"
      }
    },
    {
      "apiVersion": "[variables('ApiVersion')]",
      "name": "loadBalancer",
      "type": "Microsoft.Network/loadBalancers",
      "location": "[resourceGroup().location]",
	   "dependsOn": [
        "Microsoft.Network/publicIPAddresses/lbpublicip",
		"Microsoft.Network/publicIPAddresses/lbpublicip-v6",
      ],
      "properties": {
        "frontendIpConfigurations": [
          {
            "name": "LBFE",
            "properties": {
              "publicIPAddress": {
                "id": "[resourceId('Microsoft.Network/publicIPAddresses', 'lbpublicip')]"
              }
            }
          },
		  {
            "name": "LBFE-v6",
            "properties": {
              "publicIPAddress": {
                "id": "[resourceId('Microsoft.Network/publicIPAddresses','lbpublicip-v6')]"
              }
            }
          }
        ],
        "backendAddressPools": [
          {
            "name": "LBBAP"
          },
		  {
            "name": "LBBAP-v6"
          }
        ],
        "loadBalancingRules": [
          {
            "properties": {
              "frontendIPConfiguration": {
                "id": "[concat(resourceId('Microsoft.Network/loadBalancers', 'loadBalancer'), '/frontendIpConfigurations/LBFE')]"
              },
              "backendAddressPool": {
                "id": "[concat(resourceId('Microsoft.Network/loadBalancers', 'loadBalancer'), '/backendAddressPools/LBBAP')]"
              },
              "protocol": "Tcp",
              "frontendPort": 8080,
              "backendPort": 8080,
              "idleTimeoutInMinutes": 15
            },
            "name": "lbrule"
          },
		  {
            "properties": {
              "frontendIPConfiguration": {
                "id": "[concat(resourceId('Microsoft.Network/loadBalancers', 'loadBalancer'), '/frontendIpConfigurations/LBFE-v6')]"
              },
              "backendAddressPool": {
                "id": "[concat(resourceId('Microsoft.Network/loadBalancers', 'loadBalancer'), '/backendAddressPools/LBBAP-v6')]"
              },
              "protocol": "Tcp",
              "frontendPort": 8080,
              "backendPort": 8080
            },
            "name": "lbrule-v6"
          }
        ]
      }
    },
    {
      "apiVersion": "[variables('ApiVersion')]",
      "type": "Microsoft.Network/virtualNetworks",
      "name": "VNET",
      "location": "[resourceGroup().location]",
      "properties": {
        "dhcpOptions":{
            "dnsServers": ["df5:43::","df5:45::"]
        },
        "addressSpace": {
          "addressPrefixes": [
            "[variables('vnetv4AddressRange')]",
            "[variables('vnetv6AddressRange')]"    
          ]
        },
        "subnets": [
          {
            "name": "Subnet",
            "properties": {
              "addressPrefix": "[variables('subnetv4AddressRange')]"
            }
          },
          {
            "name": "V6Subnet",
            "properties": {
              "addressPrefix": "[variables('subnetv6AddressRange')]"
            }
          }
        ]
      }
    },
    {
      "apiVersion": "[variables('ApiVersion')]",
      "type": "Microsoft.Network/networkSecurityGroups",
      "name": "nsgv6",
      "location": "[resourceGroup().location]",
      "properties": {
        "securityRules": [
          {
            "name": "allow-all",
            "properties": {
              "description": "Allow All",
              "protocol": "*",
              "sourcePortRange": "*",
              "destinationPortRange": "*",
              "sourceAddressPrefix": "*",
              "destinationAddressPrefix": "*",
              "access": "Allow",
              "priority": 1001,
              "direction": "Inbound"
            }
          },
          {
            "name": "allow-out-all",
            "properties": {
              "description": "Allow out All",
              "protocol": "*",
              "sourcePortRange": "*",
              "destinationPortRange": "*",
              "sourceAddressPrefix": "*",
              "destinationAddressPrefix": "*",
              "access": "Allow",
              "priority": 1002,
              "direction": "Outbound"
            }
          },
          {
            "name": "default-allow-rdp",
            "properties": {
              "description": "Allow RDP",
              "protocol": "Tcp",
              "sourcePortRange": "33819-33829",
              "destinationPortRange": "5000-6000",
              "sourceAddressPrefix": "ace:cab:deca:deed::/64",
              "destinationAddressPrefix": "cab:ace:deca:deed::/64",
              "access": "Allow",
              "priority": 1003,
              "direction": "Inbound"
            }
          },
          {
            "name": "default-allow-abc",
            "properties": {
              "description": "Allow abc",
              "protocol": "Tcp",
              "sourcePortRange": "33819-33829",
              "destinationPortRange": "5000-6000",
              "sourceAddressPrefix": "ace:cab:deca:deed::/64",
              "destinationAddressPrefixes": ["cab:ace:deca:deed::/64", "ace:cab:deca:dffa::/64"],
              "access": "Allow",
              "priority": 1004,
              "direction": "Inbound"
            }
          },
          {
            "name": "default-allow-bca",
            "properties": {
              "description": "Allow bca",
              "protocol": "Tcp",
              "sourcePortRange": "33819-33829",
              "destinationPortRange": "5000-6000",
              "sourceAddressPrefixes": ["ace:cab:deca:deed::/64", "cab:ace:deca:deed::/64"],
              "destinationAddressPrefixes": ["fab:cab:deca:deed::/64", "fab:ace:deca:deed::/64"],
              "access": "Allow",
              "priority": 1005,
              "direction": "Inbound"
            }
          }
        ]
      }
    },
    {
      "type": "Microsoft.Network/routeTables",
      "name": "v6route",
      "apiVersion": "[variables('ApiVersion')]",
      "location": "[resourceGroup().location]",
      "properties": {
        "routes": [
          {
            "name": "v6route",
            "properties": {
              "addressPrefix": "ace:cab:deca:deed::/64",
              "nextHopType": "VirtualAppliance",
              "nextHopIpAddress": "deca:cab:ace:f00d::1"
            }
          }
        ]
      }
    },
    {
      "apiVersion": "[variables('ApiVersion')]",
      "type": "Microsoft.Network/networkInterfaces",
      "name": "[concat(variables('vmName'),copyindex())]",
      "copy": {
        "name": "netIntLoop",
        "count": "[variables('numberOfInstances')]"
      },
      "location": "[resourceGroup().location]",
      "dependsOn": [
        "Microsoft.Network/virtualNetworks/VNET",
        "Microsoft.Network/networkSecurityGroups/nsgv6",
        "Microsoft.Network/loadBalancers/loadBalancer",
		"[concat('Microsoft.Network/publicIPAddresses/',variables('publicipName'),copyindex())]",
      ],
      "properties": {
        "networkSecurityGroup": {
          "id": "[resourceId('Microsoft.Network/networkSecurityGroups','nsgv6')]"
        },
        "ipConfigurations": [
          {
            "name": "ipconfig-v4",
            "properties": {
              "privateIPAllocationMethod": "Dynamic",
	      "privateIPAddressVersion":"IPv4",
              "primary": "true",
              "publicIPAddress": {
                "id": "[resourceId('Microsoft.Network/publicIPAddresses',concat(variables('publicipName'),copyindex()))]"
              },
              "subnet": {
                "id": "[variables('v4-subnet-id')]"
              },
              "loadBalancerBackendAddressPools": [
                {
                  "id": "[concat(resourceId('Microsoft.Network/loadBalancers','loadBalancer'),'/backendAddressPools/LBBAP')]"
                }
              ]
            }
          },
          {
            "name": "ipconfig-v6",
            "properties": {
              "privateIPAllocationMethod": "Dynamic",
	      "privateIPAddressVersion":"IPv6",
              "subnet": {
                "id": "[variables('v6-subnet-id')]"
              },
              "loadBalancerBackendAddressPools": [
                {
                  "id": "[concat(resourceId('Microsoft.Network/loadBalancers','loadBalancer'),'/backendAddressPools/LBBAP-v6')]"
                }
              ]
            }
          }
        ]
      }
    },
    {
      "apiVersion": "2016-04-30-preview",
      "type": "Microsoft.Compute/virtualMachines",
      "name": "[concat(variables('vmName'), copyindex())]",
      "copy": {
        "name": "virtualMachineLoop",
        "count": "[variables('numberOfInstances')]"
      },
      "location": "[resourceGroup().location]",
      "dependsOn": [
        "[resourceId('Microsoft.Storage/storageAccounts',variables('newStorageAccountName'))]",
        "[concat('Microsoft.Network/networkInterfaces/',variables('vmName'),copyindex())]",
        "[concat('Microsoft.Compute/availabilitySets/', variables('availabilitySetName'))]"
      ],
      "properties": {
        "availabilitySet": {
          "id": "[resourceId('Microsoft.Compute/availabilitySets', variables('availabilitySetName'))]"
        },
        "hardwareProfile": {
          "vmSize": "Standard_A1"
        },
        "osProfile": {
          "computerName": "[concat(variables('vmName'), copyindex())]",
          "adminUsername": "[parameters('adminUserName')]",
          "adminPassword": "[parameters('adminPassword')]"
        },
        "storageProfile": {
          "imageReference": {
            "publisher": "[variables('imagePublisher')]",
            "offer": "[variables('imageOffer')]",
            "sku": "[variables('imageSku')]",
            "version": "latest"
          },
          "osDisk": {
            "createOption": "FromImage"
          }
        },
        "networkProfile": {
          "networkInterfaces": [
            {
              "id": "[resourceId('Microsoft.Network/networkInterfaces',concat(variables('vmName'),copyindex()))]"
            }
          ]
        }
      }
    }
  ]
}
```

## Next steps

You can find details about pricing for [public IP addresses](https://azure.microsoft.com/pricing/details/ip-addresses/), [network bandwidth](https://azure.microsoft.com/pricing/details/bandwidth/), or [Load Balancer](https://azure.microsoft.com/pricing/details/load-balancer/).