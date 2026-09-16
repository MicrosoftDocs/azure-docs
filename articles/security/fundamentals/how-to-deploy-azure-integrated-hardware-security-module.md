---
title: Deploy a virtual machine with Azure Integrated HSM enabled
description: Learn how to deploy a VM with Azure Integrated HSM enabled at boot by using the Azure portal, Azure CLI, ARM templates, or Azure SDK.
services: security
author: simranparkhe
ms.service: security
ms.topic: article
ms.date: 04/30/2026
ms.author: simranparkhe
ai-usage: ai-assisted
---

# Deploy a virtual machine with Azure Integrated HSM enabled

**Applies to:** :heavy_check_mark: Windows VMs

Azure Integrated HSM is a hardware security module (HSM) cache and cryptographic accelerator designed to enhance the security and performance of cryptographic operations in a virtual machine (VM).
If you rely heavily on cryptography and have performance-intensive workloads, Azure Integrated HSM provides a secure way to store cryptographic keys for quick and secure retrieval.

> [!NOTE]
> For a VM to use Azure Integrated HSM, include the tag `platformsettings.host_environment.AzureIntegratedHSM=True` *at deployment time*. Adding the tag after deployment prevents the VM from using Azure Integrated HSM.

## 1. Enroll in the Azure Integrated HSM feature flag for your subscription

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Go to your subscription.
1. In the left menu, select **Settings**.
1. Under **Settings**, select **Preview features**.
1. Search for *Azure Integrated HSM*, and select it.
1. Select **Register** at the bottom of the page.
1. Wait for the registration process to complete and get the success notification.

You can now create Azure Integrated HSM-enabled virtual machines in that subscription.

## 2. Create a resource group

Create a resource group with the `az group create` command.
An Azure resource group is a logical container into which Azure resources are deployed and managed.
The following example creates a resource group named `myResourceGroup` in the `eastus2` location:

> [!NOTE]
> AMD v7 VMs aren't available in all locations. For currently supported locations, see which VM products are available by Azure region.

```powershell
az group create --name myResourceGroup --location eastus2
```

## 3. Create a general-purpose VM with Azure Integrated HSM enabled

### Option 1 - Azure CLI

Create a VM with the `az vm create` command.

The following example creates a VM named `myVM` and adds a user account named `azureuser`.
Azure Integrated HSM supports only specific VM SKUs. For more information about supported SKUs, see [Azure Integrated HSM overview](/azure/security/fundamentals/azure-integrated-hardware-security-module-overview).

The VMs must support Trusted Launch and Secure Boot to support Azure Integrated HSM.

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
After Azure creates the VM, you can see the tag in the Azure portal **Tags** section.

### Option 2 - ARM templates

Create a resource group:

```powershell
az group create --name $resourceGroup --location $region
```

Create a VM with the `az deployment group create` command.
Enter your resource group name, deployment name, and VM name.
Use the [ARM templates provided in GitHub](https://github.com/microsoft/AziHSM-Guest/tree/main/arm_templates) to deploy the VM. Enter the username and password that you want to use on your VM.

```powershell
az deployment group create `
  -g $resourceGroup `
  -n $deployName `
  -f ./template-azihsm-tvm.json `
  -p ./parameters-azihsm-tvm.json `
  -p vmName=$vmName
```

### Option 3 - Azure SDK

The Azure SDK supports many languages.
This example uses the [AziHSM Python SDK example](https://github.com/microsoft/AziHSM-Guest/tree/main/azure_sdk/python) to deploy an AziHSM-enabled VM.

Navigate to [azure_sdk/python](https://github.com/microsoft/AziHSM-Guest/tree/main/azure_sdk/python), create a Python virtual environment, and install the Azure SDK:

```powershell
python -m venv .venv
.venv/Scripts/activate # only required if deploying from a Windows machine
pip install -r requirements.txt
```

Run the provided sample script. The script includes documentation about the resources that it deploys for the VM:

```powershell
python ./sample.py
```

## Next steps

- Install the guest driver and Key Service Provider on your Azure Integrated HSM-enabled VM by following the [instructions on GitHub](https://github.com/microsoft/AziHSM-Guest/tree/main).
- [Azure Integrated HSM overview](/azure/security/fundamentals/azure-integrated-hardware-security-module-overview)
