---
title: Azure Load Balancer concepts
description: Overview of Azure Load Balancer concepts
services: load-balancer
author: errobin
ms.service: load-balancer
ms.topic: overview
ms.date: tbd
ms.author: errobin

---

# Backend Pool Management

The Backend Pool of the Load Balancer is a fundamental component which defines the group of compute resource that will serve traffic for a given Load Balancing rule. By configuring a Backend Pool correctly you will have defined an eligble machines to serve traffic. There are two ways of configuring a Backend Pool, by Network Interface Card (NIC) and by a combination IP address and Virtual Network (VNET) Resource ID. In most scenarios involving VMs and VMSSes it is recommended to configuring your Backend Pool by NIC as this builds the most direct link between your resource and the Backend Pool. For scenarios involving containers and Kubernetes Pods which do not have a NIC or for preallocation of a range of IP addresses for Backend resources, you can configure your Backend Pool by IP Address and VNET ID combination.

When configuring by either NIC or IP Address and VNET ID through Portal, the UI will walk you through each step and all configuration updates will be handled in the backend. The configuration sections of this article will focus on Azure PowerShell, CLI, REST API and ARM Templates to give insight into how the Backend Pools are structured for each configuration option.

## Configuring Backend Pool by NIC
When configuring a Backend Pool by NIC, it is important to keep in mind that the Backend Pool is created as part of the Load Balancer operation and members are added to the Backend Pool as part of the IP Configuration property of their Network Interface during the Network Interface operation. The following examples are focused on the create and populate operations for the Backend Pool to highlight this workflow and relationship.

### REST API
When configuring the Backend Pool for a NIC-based configuraiton, you will create the Backend Pool via the [PUT Load Balancer] (https://docs.microsoft.com/rest/api/load-balancer/loadbalancers/createorupdate#create-load-balancer) command and then add resources to the Backend Pool via the PUT Network Interface (command. 


PUT https://management.azure.com/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb?api-version=2020-05-01

{
  "location": "eastus",
  "properties": {
    "frontendIPConfigurations": [
      {
        "name": "fe-lb",
        "properties": {
          "subnet": {
            "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnetlb/subnets/subnetlb"
          }
        }
      }
    ],
    "backendAddressPools": [
      {
        "name": "be-lb",
        "properties": {}
      }
    ],
    "loadBalancingRules": [
      {
        "name": "rulelb",
        "properties": {
          "frontendIPConfiguration": {
            "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/frontendIPConfigurations/fe-lb"
          },
          "frontendPort": 80,
          "backendPort": 80,
          "enableFloatingIP": true,
          "idleTimeoutInMinutes": 15,
          "protocol": "Tcp",
          "enableTcpReset": false,
          "loadDistribution": "Default",
          "backendAddressPool": {
            "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/backendAddressPools/be-lb"
          },
          "probe": {
            "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/probes/probe-lb"
          }
        }
      }
    ],
    "probes": [
      {
        "name": "probe-lb",
        "properties": {
          "protocol": "Http",
          "port": 80,
          "requestPath": "healthcheck.aspx",
          "intervalInSeconds": 15,
          "numberOfProbes": 2
        }
      }
    ],
    "inboundNatRules": [
      {
        "name": "in-nat-rule",
        "properties": {
          "frontendIPConfiguration": {
            "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/frontendIPConfigurations/fe-lb"
          },
          "frontendPort": 3389,
          "backendPort": 3389,
          "enableFloatingIP": true,
          "idleTimeoutInMinutes": 15,
          "protocol": "Tcp",
          "enableTcpReset": false
        }
      }
    ],
    "inboundNatPools": []
  }
}


Create a Network Interface and add it to the Backend Pool you have created via the IP Configurations property.

PUT https://management.azure.com/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/networkInterfaces/test-nic?api-version=2020-05-01

{
  "properties": {
    "enableAcceleratedNetworking": true,
    "ipConfigurations": [
      {
        "name": "ipconfig1",
        "properties": {
          "publicIPAddress": {
            "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/publicIPAddresses/test-ip"
          },
          "subnet": {
            "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/rg1-vnet/subnets/default"
          },
          "loadBalancerBackendAddressPools": {
                                    "id": "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/backendAddressPools/be-lb"
          }
        }
      }
    ]
  },
  "location": "eastus"
}

Create a VM and add the NIC to the Backend Pool

PUT https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/{vm-name}?api-version=2019-12-01

JSON Request Body:
{
  "location": "eastus",
  "properties": {
    "hardwareProfile": {
      "vmSize": "Standard_D1_v2"
    },
    "storageProfile": {
      "osDisk": {
        "name": "myVMosdisk",
        "image": {
          "uri": "http://{existing-storage-account-name}.blob.core.windows.net/{existing-container-name}/{existing-generalized-os-image-blob-name}.vhd"
        },
        "osType": "Windows",
        "createOption": "FromImage",
        "caching": "ReadWrite",
        "vhd": {
          "uri": "http://{existing-storage-account-name}.blob.core.windows.net/{existing-container-name}/myDisk.vhd"
        }
      }
    },
    "osProfile": {
      "adminUsername": "{your-username}",
      "computerName": "myVM",
      "adminPassword": "{your-password}"
    },
    "networkProfile": {
      "networkInterfaces": [
        {
          "id": "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{existing-nic-name}",
          "properties": {
            "primary": true
          }
        }
      ]
    }
  }
}

Retrieve the Backend Pool information for the Load Balancer to confirm that this Network Interace is added to the Backend Pool.

GET https://management.azure.com/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/backendAddressPools/be-lb?api-version=2020-05-01


### PowerShell


### CLI

### ARM Template


## Configuring Backend Pool by IP Address and VNET ID
