---
title: Tutorial - python
description: Create a virtual machine and assign an automanage best practices configuration profile to it.
author: andrsmith
ms.service: automanage
ms.workload: infrastructure
ms.topic: tutorial
ms.date: 08/25/2022
ms.author: andrsmith
---

# Tutorial: Create a virtual machine and assign an Automanage profile to it

In this tutorial, you will create a resource group and a virtual machine. You will then assign an Automanage Best Practices configuration profile to the new machine using the Python SDK

## Prerequisites 

- [Python](https://www.python.org/downloads/)
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows?tabs=azure-cli) or [Azure PowerShell](https://docs.microsoft.com/en-us/powershell/azure/install-az-ps?view=azps-8.2.0)

## Create Resources

### Sign in to Azure 

sign in to Azure by using following command:

# [Azure CLI](#tab/azure-cli)
```azurecli
az login
```
# [Azure PowerShell](#tab/azure-powershell)
```azurepowershell
Connect-AzAccount
```

### Create Resource Group

Create a resource group:

# [Azure CLI](#tab/azure-cli)
```azurecli
az group create --name "test-rg" --location "eastus"
```
# [Azure PowerShell](#tab/azure-powershell)
```azurepowershell
new-azResourceGroup -Name "test-rg" -Location "eastus"
```

### Create Virtual Machine

Create a Windows virtual machine:

# [Azure CLI](#tab/azure-cli)
```azurecli
az vm create `
    --resource-group "test-rg" `
    --name "testvm" `
    --location "eastus" `
    --image win2016datacenter `
    --admin-username testUser `
    --size Standard_D2s_v3 `
    --storage-sku Standard_LRS
```
# [Azure PowerShell](#tab/azure-powershell)
```azurepowershell
New-AzVm `
    -ResourceGroupName 'test-rg' `
    -Name 'testvm' `
    -Location 'eastus' `
    -VirtualNetworkName 'testvm-vnet' `
    -SubnetName 'testvm-subnet' `
    -SecurityGroupName 'test-vm-nsg'
```

---
## Assign Best Practices Profile to Virtual Machine

Now that we have successfully created a resource group and a virtual machine, it's time to set up a Python project and assign an Automanage Best Practices configuration profile to the newly created virtual machine.

### Install Python Packages

Install the Azure Identity and Azure Automanage packages using `pip`:

`pip install azure-mgmt-automanage`
`pip install azure-identity`

### Import Packages

Create an `app.py` file and import the installed packages within it:

```python
from azure.identity import DefaultAzureCredential
from azure.mgmt.automanage import AutomanageClient
```

Set some local variables: 

```python
sub = "<sub ID>"
rg = "test-rg"
vm = "testvm"
```

### Authenticate to Azure & Create an Automanage Client

Use the **DefaultAzureCredential** within the `azure-identity` package to **authenticate** to Azure. Then, use the credential to create an **Automanage Client**.

```python
credential = DefaultAzureCredential()
client = AutomanageClient(credential, sub)
```

### Create a Best Practices Profile Assignment 

Now we will create an assignment between our new virtual machine and a Best Practices profile: 

```python
assignment = {
    "properties": {
        "configurationProfile": "/providers/Microsoft.Automanage/bestPractices/AzureBestPracticesProduction",
    }
}

# assignment name must be 'default'
client.configuration_profile_assignments.create_or_update(
    "default", rg, vm, assignment)
```

Run the python file: 

`python app.py`

---
## View Assignment in the Portal

Navigate to the virtual machine and select the **Automanage** blade: 
![automanage blade](../media/tutorial-imgs/automanage-blade.png)

View the Automanage Profile now enabled on the virtual machine:
![automanage blade](../media/tutorial-imgs/automanage.png)

