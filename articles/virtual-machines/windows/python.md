---
title: Create a Windows VM in Azure using Python | Microsoft Docs
description: Learn to use Python to create a Windows VM in Azure.
services: virtual-machines-windows
documentationcenter: ''
author: davidmu1
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.workload: na
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 06/05/2017
ms.author: davidmu
---

# Create a Windows VM in Azure using Python

An [Azure Virtual Machine](overview.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) (VM) needs several supporting Azure resources. This article covers creating and deleting VM resources using Python. You learn how to:

> [!div class="checklist"]
> * Create a Visual Studio project
> * Install packages
> * Add code to create credentials
> * Add code to create resources
> * Add code to delete resources
> * Run the application

It takes about 20 minutes to do these steps.

## Create a Visual Studio project

1. If you haven't already, install [Visual Studio](https://docs.microsoft.com/visualstudio/install/install-visual-studio). Select **Python development** on the Workloads page, and then click **Install**. In the summary, you can see that **Python 3 64-bit (3.6.0)** is automatically selected for you. If you have already installed Visual Studio, you can add the Python workload using the Visual Studio Launcher.
2. After installing and starting Visual Studio, click **File** > **New** > **Project**.
3. Click **Templates** > **Python** > **Python Application**, enter *myPythonProject* for the name of the project, select the location of the project, and then click **OK**.

## Install packages

1. In Solution Explorer, under *myPythonProject*, right-click **Python Environments**, and then select **Add virtual environment**.
2. On the Add Virtual Environment screen, accept the default name of *env*, make sure that *Python 3.6 (64-bit)* is selected for the base interpreter, and then click **Create**.
3. Right-click the *env* environment that you created, click **Install Python Package**, enter *azure* in the search box, and then press Enter.

You should see in the output windows that the azure packages were successfully installed. 

## Add code to create credentials

Before you start this step, make sure that you have an [Active Directory service principal](../../azure-resource-manager/resource-group-create-service-principal-portal.md). You should also record the application ID, the authentication key, and the tenant ID that you need in a later step.

1. Open *myPythonProject.py* file that was created, and then add this code to enable your application to run:

    ```python
    if __name__ == "__main__":
    ```

2. To import the code that is needed, add these statements to the top of the .py file:

    ```python
    from azure.common.credentials import ServicePrincipalCredentials
    from azure.mgmt.resource import ResourceManagementClient
    from azure.mgmt.compute import ComputeManagementClient
    from azure.mgmt.network import NetworkManagementClient
    ```

3. Next in the .py file, add variables after the import statements to specify common values used in the code:
   
    ```
    SUBSCRIPTION_ID = 'subscription-id'
    GROUP_NAME = 'myResourceGroup'
    LOCATION = 'westus'
    ```

    Replace **subscription-id** with your subscription identifier.

4. To create the Active Directory credentials that you need to make requests, add this function after the variables in the .py file:

    ```python
    def get_credentials():
        credentials = ServicePrincipalCredentials(
            client_id = 'application-id',
            secret = 'authentication-key',
            tenant = 'tenant-id'
        )

        return credentials
    ```

    Replace **application-id**, **authentication-key**, and **tenant-id** with the values that you previously collected when you created your Azure Active Directory service principal.

5. To call the function that you previously added, add this code under the **if** statement at the end of the .py file:

    ```python
    credentials = get_credentials()
    ```

## Add code to create resources
 
### Initialize management clients

Management clients are needed to create and manage resources using the Python SDK in Azure. To create the management clients, add this code under the **if** statement at then end of the .py file:

```python
resource_group_client = ResourceManagementClient(
    credentials, 
    SUBSCRIPTION_ID
)
network_client = NetworkManagementClient(
    credentials, 
    SUBSCRIPTION_ID
)
compute_client = ComputeManagementClient(
    credentials, 
    SUBSCRIPTION_ID
)
```

### Create the VM and supporting resources

All resources must be contained in a [Resource group](../../azure-resource-manager/resource-group-overview.md).

1. To create a resource group, add this function after the variables in the .py file:

    ```python
    def create_resource_group(resource_group_client):
        resource_group_params = { 'location':LOCATION }
        resource_group_result = resource_group_client.resource_groups.create_or_update(
            GROUP_NAME, 
            resource_group_params
        )
    ```

2. To call the function that you previously added, add this code under the **if** statement at the end of the .py file:

    ```python
    create_resource_group(resource_group_client)
    input('Resource group created. Press enter to continue...')
    ```

[Availability sets](tutorial-availability-sets.md) make it easier for you to maintain the virtual machines used by your application.

1. To create an availability set, add this function after the variables in the .py file:
   
    ```python
    def create_availability_set(compute_client):
        avset_params = {
            'location': LOCATION,
            'sku': { 'name': 'Aligned' },
            'platform_fault_domain_count': 3
        }
        availability_set_result = compute_client.availability_sets.create_or_update(
            GROUP_NAME,
            'myAVSet',
            avset_params
        )
    ```

2. To call the function that you previously added, add this code under the **if** statement at the end of the .py file:

    ```python
    create_availability_set(compute_client)
    print("------------------------------------------------------")
    input('Availability set created. Press enter to continue...')
    ```

A [Public IP address](../../virtual-network/virtual-network-ip-addresses-overview-arm.md) is needed to communicate with the virtual machine.

1. To create a public IP address for the virtual machine, add this function after the variables in the .py file:

    ```python
    def create_public_ip_address(network_client):
        public_ip_addess_params = {
            'location': LOCATION,
            'public_ip_allocation_method': 'Dynamic'
        }
        creation_result = network_client.public_ip_addresses.create_or_update(
            GROUP_NAME,
            'myIPAddress',
            public_ip_addess_params
        )

        return creation_result.result()
    ```

2. To call the function that you previously added, add this code under the **if** statement at the end of the .py file:

    ```python
    creation_result = create_public_ip_address(network_client)
    print("------------------------------------------------------")
    print(creation_result)
    input('Press enter to continue...')
    ```

A virtual machine must be in a subnet of a [Virtual network](../../virtual-network/virtual-networks-overview.md).

1. To create a virtual network, add this function after the variables in the .py file:

    ```python
    def create_vnet(network_client):
        vnet_params = {
            'location': LOCATION,
            'address_space': {
                'address_prefixes': ['10.0.0.0/16']
            }
        }
        creation_result = network_client.virtual_networks.create_or_update(
            GROUP_NAME,
            'myVNet',
            vnet_params
        )
        return creation_result.result()
    ```

2. To call the function that you previously added, add this code under the **if** statement at the end of the .py file:
   
    ```python
    creation_result = create_vnet(network_client)
    print("------------------------------------------------------")
    print(creation_result)
    input('Press enter to continue...')
    ```

3. To add a subnet to the virtual network, add this function after the variables in the .py file:
    
    ```python
    def create_subnet(network_client):
        subnet_params = {
            'address_prefix': '10.0.0.0/24'
        }
        creation_result = network_client.subnets.create_or_update(
            GROUP_NAME,
            'myVNet',
            'mySubnet',
            subnet_params
        )

        return creation_result.result()
    ```
        
4. To call the function that you previously added, add this code under the **if** statement at the end of the .py file:
   
    ```python
    creation_result = create_subnet(network_client)
    print("------------------------------------------------------")
    print(creation_result)
    input('Press enter to continue...')
    ```

A virtual machine needs a network interface to communicate on the virtual network.

1. To create a network interface, add this function after the variables in the .py file:

    ```python
    def create_nic(network_client):
        subnet_info = network_client.subnets.get(
            GROUP_NAME, 
            'myVNet', 
            'mySubnet'
        )
        publicIPAddress = network_client.public_ip_addresses.get(
            GROUP_NAME,
            'myIPAddress'
        )
        nic_params = {
            'location': LOCATION,
            'ip_configurations': [{
                'name': 'myIPConfig',
                'public_ip_address': publicIPAddress,
                'subnet': {
                    'id': subnet_info.id
                }
            }]
        }
        creation_result = network_client.network_interfaces.create_or_update(
            GROUP_NAME,
            'myNic',
            nic_params
        )

        return creation_result.result()
    ```

2. To call the function that you previously added, add this code under the **if** statement at the end of the .py file:

    ```python
    creation_result = create_nic(network_client)
    print("------------------------------------------------------")
    print(creation_result)
    input('Press enter to continue...')
    ```

Now that you created all the supporting resources, you can create a virtual machine.

1. To create the virtual machine, add this function after the variables in the .py file:
   
    ```python
    def create_vm(network_client, compute_client):  
        nic = network_client.network_interfaces.get(
            GROUP_NAME, 
            'myNic'
        )
        avset = compute_client.availability_sets.get(
            GROUP_NAME,
            'myAVSet'
        )
        vm_parameters = {
            'location': LOCATION,
            'os_profile': {
                'computer_name': 'myVM',
                'admin_username': 'azureuser',
                'admin_password': 'Azure12345678'
            },
            'hardware_profile': {
                'vm_size': 'Standard_DS1'
            },
            'storage_profile': {
                'image_reference': {
                    'publisher': 'MicrosoftWindowsServer',
                    'offer': 'WindowsServer',
                    'sku': '2012-R2-Datacenter',
                    'version': 'latest'
                }
            },
            'network_profile': {
                'network_interfaces': [{
                    'id': nic.id
                }]
            },
            'availability_set': {
                'id': avset.id
            }
        }
        creation_result = compute_client.virtual_machines.create_or_update(
            GROUP_NAME, 
            'myVM', 
            vm_parameters
        )
    
        return creation_result.result()
    ```

    > [!NOTE]
    > This tutorial creates a virtual machine running a version of the Windows Server operating system. To learn more about selecting other images, see [Navigate and select Azure virtual machine images with Windows PowerShell and the Azure CLI](../linux/cli-ps-findimage.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
    > 
    > 

2. To call the function that you previously added, add this code under the **if** statement at the end of the .py file:

    ```python
    creation_result = create_vm(network_client, compute_client)
    print("------------------------------------------------------")
    print(creation_result)
    input('Press enter to continue...')
    ```

## Add code to delete resources

Because you are charged for resources used in Azure, it's always a good practice to delete resources that are no longer needed. If you want to delete the virtual machines and all the supporting resources, all you have to do is delete the resource group.

1. To delete the resource group and all resources, add this function after the variables in the .py file:
   
    ```python
    def delete_resources(resource_group_client):
        resource_group_client.resource_groups.delete(GROUP_NAME)
    ```

2. To call the function that you previously added, add this code under the **if** statement at the end of the .py file:
   
    ```python
    delete_resources(resource_group_client)
    ```

3. Save *myPythonProject.py*.

## Run the application

1. To run the console application, click **Start** in Visual Studio.

2. Press **Enter** after the status of each resource is returned. In the status information, you should see a **Succeeded** provisioning state. After the virtual machine is created, you have the opportunity to delete all the resources that you create. Before you press **Enter** to start deleting resources, you could take a few minutes to verify their creation in the Azure portal. If you have the Azure portal open, you might have to refresh the blade to see new resources.  

    It should take about five minutes for this console application to run completely from start to finish. It may take several minutes after the application has finished before all the resources and the resource group are deleted.


## Next Steps

- If there were issues with the deployment, a next step would be to look at [Troubleshooting resource group deployments with Azure portal](../../resource-manager-troubleshoot-deployments-portal.md)
- Learn how to manage the virtual machine that you created by reviewing [Manage virtual machines using Azure Resource Manager and PowerShell](ps-manage.md).
- Take advantage of using a template to create a virtual machine by using the information in [Create a Windows virtual machine with a Resource Manager template](ps-template.md)

