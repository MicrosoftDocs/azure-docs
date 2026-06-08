---
title: How to deploy a Virtual Machine with Azure Integrated HSM enabled
description: This article provides how to deploy a VM with Azure Integrated HSM enabled at boot.
services: security
author: simranparkhe
ms.service: security
ms.topic: article
ms.date: 04/30/2026
ms.author: simranparkhe
---

# How to deploy a Virtual Machine with Azure Integrated HSM

**Applies to:** :heavy_check_mark: Windows VMs

Azure Integrated HSM is a Hardware Security Module (HSM) cache and crypto accelerator designed to enhance the security and performance of cryptographic operations in a virtual machine (VM).
For customers who heavily rely on cryptography and have performance-intensive workloads, Azure Integrated HSM provides a secure way to store cryptographic keys for quick and secure retrieval. 

> [!NOTE]
> In order for a VM to use Azure Integrated HSM, include a tag `platformsettings.host_environment.AzureIntegratedHSM=True` *at the time of deployment*. Adding the tag to the VM post deployment will result in the VM not being able to use Azure Integrated HSM.

## 1. Enroll in Azure Integrated HSM flag for your subscription

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Go to your subscription.
3. In the left hand menu, select Settings.
4. Under settings select on preview features.
5. Search for *Azure Integrated HSM* and select on it.
6. Select register at the bottom of the page.
7. Wait for registration process to complete and get the success notification.

You can now proceed to create Azure Integrated HSM enabled virtual machines with that subscription.

## 2. Create a resource group

Create a resource group with the `az group create` command.
An Azure resource group is a logical container into which Azure resources are deployed and managed.
The following example creates a resource group named `myResourceGroup` in the `eastus2` location:

> [!NOTE]
> AMD v7 VMs aren't available in all locations. For currently supported locations, see which VM products are available by Azure region.

```powershell
az group create --name myResourceGroup --location eastus2
```

## 3. Create general purpose VM with Azure Integrated HSM feature enabled

### Option 1 - Azure CLI

Create a VM with the `az vm create` command.

The following example creates a VM named `myVM` and adds a user account named `azureuser`.
Azure Integrated HSM is supported only on specific VM SKUs; see the [supported SKUs](/azure/security/fundamentals/azure-integrated-hardware-security-module-overview) documentation for more on which SKUs are supported.

The VMs must support TrustedLaunch and Secure Boot in order to support Azure Integrated HSM.

```powershell
az vm create `
    --resource-group myResourceGroup `
    --name myVM `
    --size Standard_D8as_v7 `
    --admin-username azureuser `
    --admin-password <password> `
    --enable-vtpm true `
    --image "MicrosoftWindowsServer:WindowsServer:2025-datacenter-smalldisk-g2:latest" `
    --public-ip-sku Standard `
    --security-type TrustedLaunch `
    --location eastus2 `
    --enable-secure-boot true `
    --tags platformsettings.host_environment.AzureIntegratedHSM=True
```

It takes a few minutes to create the VM and supporting resources.
Once created user should be able to see the tag applied in portal in the tag section.

### Option 2 - ARM Templates

Create a resource group:

```powershell
az group create --name $resourceGroup --location $region
```

Create a VM with the `az deployment group create` command.
Input your resource group name, deployment name, and VM name.
Use the [ARM templates provided our GitHub](https://github.com/microsoft/AziHSM-Guest/tree/main/arm_templates) to deploy the VM; be sure to input the username and password you wish to use on your VM.

```powershell
az deployment group create `
  -g $resourceGroup `
  -n $deployName `
  -f ./template-azihsm-tvm.json `
  -p ./parameters-azihsm-tvm.json `
  -p vmName=$vmName
```

### Option 3 - Azure SDK

There are many different languages supported by the Azure SDK.
As an example, we will use the [AziHSM Python SDK example](https://github.com/microsoft/AziHSM-Guest/tree/main/azure_sdk/python) to deploy an AziHSM-enabled VM.

Navigate to [azure_sdk/python](https://github.com/microsoft/AziHSM-Guest/tree/main/azure_sdk/python) and create a python virtual environment and install the Azure SDK:

```powershell
python -m venv .venv
.venv/Scripts/activate # only required if deploying from a Windows machine
pip install -r requirements.txt
```

Then run the sample script provided. The script includes documentation on what resources are deployed in order to deploy a VM:

```powershell
python ./sample.py
```

## What's next

- Install guest driver and Key Service Provider to your Azure Integrated HSM enabled VM [following the instructions on our GitHub](https://github.com/microsoft/AziHSM-Guest/tree/main)
- [Azure Integrated HSM overview](/azure/security/fundamentals/azure-integrated-hardware-security-module-overview)

