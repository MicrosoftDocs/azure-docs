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

The Backend Pool of the Load Balancer is a fundamental component which defines the group of compute resource that will serve traffic for a given Load Balancing rule. By configuring a Backend Pool correctly you will have defined an eligble machines to serve traffic. There are two ways of configuring a Backend Pool, by Network Interface Card (NIC) and by a combination IP address and Virtual Network (VNET) Resource ID. 

In most scenarios involving VMs and VMSSes it is recommended to configuring your Backend Pool by NIC as this builds the most direct link between your resource and the Backend Pool. For scenarios involving containers and Kubernetes Pods which do not have a NIC or for preallocation of a range of IP addresses for Backend resources, you can configure your Backend Pool by IP Address and VNET ID combination.

When configuring by either NIC or IP Address and VNET ID through Portal, the UI will walk you through each step and all configuration updates will be handled in the backend. The configuration sections of this article will focus on Azure PowerShell, CLI, REST API and ARM Templates to give insight into how the Backend Pools are structured for each configuration option.

## Configuring Backend Pool by NIC
When configuring a Backend Pool by NIC, it is important to keep in mind that the Backend Pool is created as part of the Load Balancer operation and members are added to the Backend Pool as part of the IP Configuration property of their Network Interface during the Network Interface operation. The following examples are focused on the create and populate operations for the Backend Pool to highlight this workflow and relationship.

### REST API
When configuring the Backend Pool for a NIC-based configuraiton, you will create the Backend Pool via the [PUT Backend Pool] (https://docs.microsoft.com/rest/api/load-balancer/loadbalancers/loadbalancerbackendaddresspools/createorupdate) command and then add resources to the Backend Pool via the PUT Network Interface (https://docs.microsoft.com/rest/api/virtualnetwork/networkinterfaces/createorupdate) command. 


PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/loadBalancers/{loadBalancerName}/backendAddressPools/{backendAddressPoolName}?api-version=2020-05-01

[NOTE!] It is important to note that Backend Pools configured via Network Interface cannot be updated as part of an operation on the Backend Pool. Any addition or deletion of backend resources must occur on the Network Interface of the resource.

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

Create a VM and add the NIC refrencing the Backend Pool.

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


## Configuring Backend Pool by IP Address and Virtual Network
If you are Load Balancing to container resources or pre-populating a Backend Pool with a range of IP Addresses, you can leverage IP Address and Virtual Network to route to any valid resource whether or not it has a Network Interface. When configuring via IP address and VNET all Backend Pool management is done directly on the Backend Pool object as highlighted in the examples below.

[NOTE!] This feature is currently in preview and has the following limitations:
  * Limit of 100 IP Addresses being added
  * The backend resouces must be in the same Virtual Network as the Load Balancer
  * This feature is not currently support in the Portal UX
  
### REST API
Create the Backend Pool and define the Backend Addresses you would like to add via Address Name, IP Address, and Virtual Network ID in the JSON body of the PUT request.

PUT https://management.azure.com/subscriptions/subid/resourceGroups/testrg/providers/Microsoft.Network/loadBalancers/lb/backendAddressPools/backend?api-version=2020-05-01

JSON Request Body:

{
  "properties": {
    "loadBalancerBackendAddresses": [
      {
        "name": "address1",
        "properties": {
          "virtualNetwork": {
            "id": "/subscriptions/{Subscription ID}/resourceGroups/{Resource Group}/providers/Microsoft.Network/virtualNetworks/{VNET ID}"
          },
          "ipAddress": "10.0.0.4"
        }
      },
      {
        "name": "address2",
        "properties": {
          "virtualNetwork": {
            "id": "/subscriptions/{Subscription ID}/resourceGroups/{Resource Group}/providers/Microsoft.Network/virtualNetworks/{VNET ID}"
          },
          "ipAddress": "10.0.0.5"
        }
      }
    ]
  }
}

Retrieve the Backend Pool information for the Load Balancer to confirm that this Network Interace is added to the Backend Pool.

GET https://management.azure.com/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/loadBalancers/lb/backendAddressPools/be-lb?api-version=2020-05-01

### PowerShell
Create new backend pool: 
$backendPool = New-AzLoadBalancerBackendAddressPool -ResourceGroupName $resourceGroup	-LoadBalancerName $loadBalancerName -BackendAddressPoolName $backendPooName  

Update that backend pool with a new IP from existing VNET:  
$virtualNetwork = Get-AzVirtualNetwork -Name $vnetName -ResourceGroupName $resourceGroup 
 
$ip1 = New-AzLoadBalancerBackendAddressConfig -IpAddress "10.0.0.5" -Name "TestVNetRef" -VirtualNetwork $virtualNetwork  
 
$backendPool.LoadBalancerBackendAddresses.Add($ip1) 

Set-AzLoadBalancerBackendAddressPool -ResourceGroupName $resourceGroup  -LoadBalancerName 	$loadBalancerName -BackendAddressPoolName $backendPoolName -BackendAddressPool 
	$backendPool  


### CLI
Using CLI you can either populate the Backend Pool via command line parameters or through a JSON configuration file. 

Create and populate the Backend Pool via the command line parameters:

az network lb address-pool create \ 
--lb-name myLB \
--name myBackendPool \
--vnet {VNET resource ID} \
--backend-address name=addr1 ip-address=10.0.0.4 \ 
--backend-address name=addr2 ip-address=10.0.0.5

Create and populate the Backend Pool via JSON configuration file:
az network lb address-pool create \ 
--lb-name myLB \
--name myBackendPool \
--vnet {VNET resource ID} \
--backend-address-config-file @config_file.json

JSON Configuration file:
        [
          {
            "name": "address1",
            "virtualNetwork": "clitestvnet",
            "ipAddress": "10.0.0.4"
          },
          {
            "name": "address2",
            "virtualNetwork": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/cl
        i_test_lb_address_pool_addresses000001/providers/Microsoft.Network/virtualNetworks/clitestvn
        et",
            "ipAddress": "10.0.0.5"
          }
        ]

### ARM Template
