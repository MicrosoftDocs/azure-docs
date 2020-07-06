---
title: Backend Pool Management
description: Guide to configuring the Backend Pool of a Load Balancer
services: load-balancer
author: erichrt
ms.service: load-balancer
ms.topic: overview
ms.date: 07/06/2020
ms.author: erichrt

---

# Backend Pool Management
The Backend Pool  is a fundamental component of the Load Balancer which defines the group of compute resource that will serve traffic for a given Load Balancing rule. By configuring a Backend Pool correctly you will have defined a group of eligble machines to serve traffic. There are two ways of configuring a Backend Pool, by Network Interface Card (NIC) and by a combination IP address and Virtual Network (VNET) Resource ID. 

In most scenarios involving VMs and VMSSes it is recommended to configuring your Backend Pool by NIC as this builds the most direct link between your resource and the Backend Pool. For scenarios involving containers and Kubernetes Pods which do not have a NIC or for preallocation of a range of IP addresses for Backend resources, you can configure your Backend Pool by IP Address and VNET ID combination.

When configuring by either NIC or IP Address and VNET ID through Portal, the UI will walk you through each step and all configuration updates will be handled in the backend. The configuration sections of this article will focus on Azure PowerShell, CLI, REST API and ARM Templates to give insight into how the Backend Pools are structured for each configuration option.

## Configuring Backend Pool by NIC
When configuring a Backend Pool by NIC, it is important to keep in mind that the Backend Pool is created as part of the Load Balancer operation and members are added to the Backend Pool as part of the IP Configuration property of their Network Interface during the Network Interface operation. The following examples are focused on the create and populate operations for the Backend Pool to highlight this workflow and relationship.

[NOTE!] It is important to note that Backend Pools configured via Network Interface cannot be updated as part of an operation on the Backend Pool. Any addition or deletion of backend resources must occur on the Network Interface of the resource.

### PowerShell
Create a new Backend Pool: 
```
$backendPool = New-AzLoadBalancerBackendAddressPool -ResourceGroupName $resourceGroup	-LoadBalancerName $loadBalancerName -BackendAddressPoolName $backendPooName  
```

Create a new Network Interface and add it to the Backend Pool:
```
$nicVM1 = New-AzNetworkInterface -ResourceGroupName $rgName -Location $location `
  -Name 'MyNic1' -PublicIpAddress $RdpPublicIP_1 -LoadBalancerBackendAddressPool $bepool -Subnet $vnet.Subnets[0]
```

Retrieve the Backend Pool information for the Load Balancer to confirm that this Network Interface is added to the Backend Pool:
```
Get-AzLoadBalancerBackendAddressPool -ResourceGroupName $resourceGroup  -LoadBalancerName $loadBalancerName -BackendAddressPoolName $backendPoolName -BackendAddressPool  $bePool  
```

Create a new Virtual Machine and attach the Network Interface to place it in the Backend Pool:
```
# Create a username and password for the virtual machine
$cred = Get-Credential

# Create a virtual machine configuration
$vmConfig = New-AzVMConfig -VMName 'myVM1' -VMSize Standard_DS1_v2 `
 | Set-AzVMOperatingSystem -Windows -ComputerName 'myVM1' -Credential $cred `
 | Set-AzVMSourceImage -PublisherName MicrosoftWindowsServer -Offer WindowsServer -Skus 2019-Datacenter -Version latest `
 | Add-AzVMNetworkInterface -Id $nicVM1.Id
 
# Create a virtual machine using the configuration
$vm1 = New-AzVM -ResourceGroupName $rgName -Zone 1 -Location $location -VM $vmConfig
```


  
### CLI
Create the Backend Pool:
```
az network lb address-pool create \ 
  --lb-name myLB \
  --name myBackendPool \
```

Create a new Network Interface and add it to the Backend Pool:
```
az network nic create \
  --resource-group myResourceGroup \
  --name myNic \
  --vnet-name myVnet \
  --subnet mySubnet \
  --network-security-group myNetworkSecurityGroup \
  --lb-name myLB \
  --lb-address-pools myBackEndPool
```

Create a new Virtual Machine and attach the Network Interface to place it in the Backend Pool:
```
az vm create \
  --resource-group myResourceGroup \
  --name myVM \
  --nics myNic \
  --image UbuntuLTS \
  --admin-username azureuser \
  --generate-ssh-keys
```

### REST API
When configuring the Backend Pool for a NIC-based configuraiton, you will create the Backend Pool via the [PUT Backend Pool] (https://docs.microsoft.com/rest/api/load-balancer/loadbalancers/loadbalancerbackendaddresspools/createorupdate) command and then add resources to the Backend Pool via the PUT Network Interface (https://docs.microsoft.com/rest/api/virtualnetwork/networkinterfaces/createorupdate) command. 

Create the Backend Pool:
```
PUT https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Network/loadBalancers/{load-balancer-name}/backendAddressPools/{backend-pool-name}?api-version=2020-05-01
```

Create a Network Interface and add it to the Backend Pool you have created via the IP Configurations property of the Network Interface:

```
PUT https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Network/networkInterfaces/{nic-name}?api-version=2020-05-01
```

```
{
  "properties": {
    "enableAcceleratedNetworking": true,
    "ipConfigurations": [
      {
        "name": "ipconfig1",
        "properties": {
          "subnet": {
            "id": "/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Network/virtualNetworks/{vnet-name}/subnets/{subnet-name}"
          },
          "loadBalancerBackendAddressPools": {
                                    "id": "/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Network/loadBalancers/{load-balancer-name}/backendAddressPools/{backend-pool-name}"
          }
        }
      }
    ]
  },
  "location": "eastus"
}
```

Retrieve the Backend Pool information for the Load Balancer to confirm that this Network Interface is added to the Backend Pool:

```
GET https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name/providers/Microsoft.Network/loadBalancers/{load-balancer-name/backendAddressPools/{backend-pool-name}?api-version=2020-05-01
```

Create a VM and attach the NIC referencing the Backend Pool:

```
PUT https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Compute/virtualMachines/{vm-name}?api-version=2019-12-01
```
JSON Request Body:
```
{
  "location": "westus",
  "properties": {
    "hardwareProfile": {
      "vmSize": "Standard_D1_v2"
    },
    "storageProfile": {
      "imageReference": {
        "sku": "2016-Datacenter",
        "publisher": "MicrosoftWindowsServer",
        "version": "latest",
        "offer": "WindowsServer"
      },
      "osDisk": {
        "caching": "ReadWrite",
        "managedDisk": {
          "storageAccountType": "Standard_LRS"
        },
        "name": "myVMosdisk",
        "createOption": "FromImage"
      }
    },
    "networkProfile": {
      "networkInterfaces": [
        {
          "id": "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{nic-name}",
          "properties": {
            "primary": true
          }
        }
      ]
    },
    "osProfile": {
      "adminUsername": "{your-username}",
      "computerName": "myVM",
      "adminPassword": "{your-password}"
    }
  }
}
```

### ARM Template


## Configuring Backend Pool by IP Address and Virtual Network
If you are Load Balancing to container resources or pre-populating a Backend Pool with a range of IP Addresses, you can leverage IP Address and Virtual Network to route to any valid resource whether or not it has a Network Interface. When configuring via IP address and VNET all Backend Pool management is done directly on the Backend Pool object as highlighted in the examples below.

[NOTE!] This feature is currently in preview and has the following limitations:
  * Limit of 100 IP Addresses being added
  * The backend resouces must be in the same Virtual Network as the Load Balancer
  * This feature is not currently support in the Portal UX
  
### PowerShell
Create new backend pool: 
```
$backendPool = New-AzLoadBalancerBackendAddressPool -ResourceGroupName $resourceGroup	-LoadBalancerName $loadBalancerName -BackendAddressPoolName $backendPooName  
```

Update that backend pool with a new IP from existing VNET:  
```
$virtualNetwork = Get-AzVirtualNetwork -Name $vnetName -ResourceGroupName $resourceGroup 
 
$ip1 = New-AzLoadBalancerBackendAddressConfig -IpAddress "10.0.0.5" -Name "TestVNetRef" -VirtualNetwork $virtualNetwork  
 
$backendPool.LoadBalancerBackendAddresses.Add($ip1) 

Set-AzLoadBalancerBackendAddressPool -ResourceGroupName $resourceGroup  -LoadBalancerName $loadBalancerName -BackendAddressPoolName $backendPoolName -BackendAddressPool  $backendPool  
```

Retrieve the Backend Pool to confirm the IP address have been correctly added:
```
Get-AzLoadBalancerBackendAddressPool -ResourceGroupName $resourceGroup  -LoadBalancerName $loadBalancerName -BackendAddressPoolName $backendPoolName -BackendAddressPool  $backendPool  
```


### CLI
Using CLI you can either populate the Backend Pool via command line parameters or through a JSON configuration file. 

Create and populate the Backend Pool via the command line parameters:
```
az network lb address-pool create \ 
--lb-name myLB \
--name myBackendPool \
--vnet {VNET resource ID} \
--backend-address name=addr1 ip-address=10.0.0.4 \ 
--backend-address name=addr2 ip-address=10.0.0.5
```
Create and populate the Backend Pool via JSON configuration file:
```
az network lb address-pool create \ 
--lb-name myLB \
--name myBackendPool \
--vnet {VNET resource ID} \
--backend-address-config-file @config_file.json
```

JSON Configuration file:
```
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
```

Retrieve the Backend Pool to confirm the IP address have been correctly added:
```
az network lb address-pool show -g MyResourceGroup --lb-name MyLb -n MyBackendPool
```

Create a new Network Interface and add it to the Backend Pool:
```
az network nic create \
  --resource-group myResourceGroup \
  --name myNic \
  --vnet-name myVnet \
  --subnet mySubnet \
  --network-security-group myNetworkSecurityGroup \
  --lb-name myLB \
  --private-ip-address 10.0.0.4
```

Create a new Virtual Machine and attach the Network Interface to place it in the Backend Pool:
```
az vm create \
  --resource-group myResourceGroup \
  --name myVM \
  --nics myNic \
  --image UbuntuLTS \
  --admin-username azureuser \
  --generate-ssh-keys
```

### REST API
Create the Backend Pool and define the Backend Addresses via a PUT Backend Pool request. Configure the Backend Addresses you would like to add via Address Name, IP Address, and Virtual Network ID in the JSON body of the PUT request.

PUT request:
```
PUT https://management.azure.com/subscriptions/subid/resourceGroups/testrg/providers/Microsoft.Network/loadBalancers/lb/backendAddressPools/backend?api-version=2020-05-01
```

JSON Request Body:
```
{
  "properties": {
    "loadBalancerBackendAddresses": [
      {
        "name": "address1",
        "properties": {
          "virtualNetwork": {
            "id": "/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Network/virtualNetworks/{vnet-name}"
          },
          "ipAddress": "10.0.0.4"
        }
      },
      {
        "name": "address2",
        "properties": {
          "virtualNetwork": {
            "id": "/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Network/virtualNetworks/{vnet-name}"
          },
          "ipAddress": "10.0.0.5"
        }
      }
    ]
  }
}
```
Retrieve the Backend Pool information for the Load Balancer to confirm that this Backend Address is added to the Backend Pool:
```
GET https://management.azure.com/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Network/loadBalancers/{load-balancer-name}/backendAddressPools/{backend-pool-name}?api-version=2020-05-01
```

Create a Network Interface and add it to the Backend Pool by setting the IP Address to one of the Backend Address.

```
PUT https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Network/networkInterfaces/{nic-name}?api-version=2020-05-01
```

```
{
  "properties": {
    "enableAcceleratedNetworking": true,
    "ipConfigurations": [
      {
        "name": "ipconfig1",
        "properties": {
          "privateIPAddress": "10.0.0.4",
          "subnet": {
            "id": "/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Network/virtualNetworks/{vnet-name}/subnets/{subnet-name}"
          }
        }
      }
    ]
  },
  "location": "eastus"
}
```

Create a VM and attach the NIC referencing the Backend Pool.

```
PUT https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Compute/virtualMachines/{vm-name}?api-version=2019-12-01
```
JSON Request Body:
```
{
  "location": "eastus",
  "properties": {
    "hardwareProfile": {
      "vmSize": "Standard_D1_v2"
    },
    "storageProfile": {
      "imageReference": {
        "sku": "2016-Datacenter",
        "publisher": "MicrosoftWindowsServer",
        "version": "latest",
        "offer": "WindowsServer"
      },
      "osDisk": {
        "caching": "ReadWrite",
        "managedDisk": {
          "storageAccountType": "Standard_LRS"
        },
        "name": "myVMosdisk",
        "createOption": "FromImage"
      }
    },
    "networkProfile": {
      "networkInterfaces": [
        {
          "id": "/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/{nic-name}",
          "properties": {
            "primary": true
          }
        }
      ]
    },
    "osProfile": {
      "adminUsername": "{your-username}",
      "computerName": "myVM",
      "adminPassword": "{your-password}"
    }
  }
}
```

### ARM Template
