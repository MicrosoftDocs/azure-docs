---
title: Create an Azure AMD-based confidential VM with ARM template (preview) 
description: Learn how to quickly create an AMD-based confidential virtual machine (confidential VM) using an ARM template. Deploy the confidential VM from the Azure portal or the Azure CLI.
author: RunCai
ms.service: virtual-machines
ms.subservice: workloads
ms.workload: infrastructure
ms.topic: quickstart
ms.date: 11/15/2021
ms.author: RunCai
ms.custom: mode-arm
---


# Quickstart: Deploy confidential VM with ARM template (preview)

> [!IMPORTANT]
> Confidential virtual machines (confidential VMs) in Azure Confidential Computing is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

You can use an Azure Resource Manager template (ARM template) to create a [confidential VM](confidential-vm-overview.md) quickly. The confidential VM you create runs on AMD processors backed by AMD SEV-SNP to achieve VM memory encryption and isolation. For more information, see [Confidential VM Overview](confidential-vm-overview.md).

This tutorial covers deployment of a confidential VM with a custom configuration. 

## Prerequisites

- An Azure subscription. Free trial accounts don't have access to the VMs used in this tutorial. One option is to use a [pay as you go subscription](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go/). 
- If you want to deploy from the Azure CLI, [install PowerShell](/powershell/azure/install-az-ps) and [install the Azure CLI](/cli/azure/install-azure-cli).

## Deploy confidential VM template from Azure portal

To create and deploy a confidential VM using an ARM template in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. [Open the confidential VM ARM template](./quick-create-confidential-vm-portal-amd.md). 

    1. For **Subscription**, select an Azure subscription that meets the [prerequisites](#prerequisites).
    
    1. For **Resource group**, select an existing resource group from the drop-down menu. Or, select **Create new**, enter a unique name, then select **OK**.
    
    1. For **Region**, select the Azure region in which to deploy the VM.
    
    1. For **Vm Name**, enter a name for your VM.
    
    1. For **Vm Location**, select a location for your VM. 
    
        > [!NOTE]
        > Confidential VMs are not available in all locations. For currently supported locations, see which [VM products are available by Azure region](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines).
    
    1. For **Vm Size**, select the VM size to use.
    
    1. For **Os Image Name**, select the OS image to use for your VM.
    
    1. For **Os Disk Type**, select the OS disk type to use.
    
    1. For **Admin Username**, enter an administrator username for your VM.
    
    1. For **Admin Password Or Key**, enter a password for the administrator account. Make sure your password meets the complexity requirements for [Linux VMs](../virtual-machines/linux/faq.yml#what-are-the-password-requirements-when-creating-a-vm-) or [Windows VMs](../virtual-machines/windows/faq.yml#what-are-the-password-requirements-when-creating-a-vm-).
    
    1. For **Boot Diagnostics**, select whether you want to use boot diagnostics for your VM. The default setting is **false**.
    
    1. For **Security Type**, select whether you want to use full OS disk encryption before VM deployment. The option **VMGuestStateOnly** doesn't offer OS disk encryption. The option **DiskWithVMGuestState** enables full OS disk encryption using platform-managed keys.
    
    1. For **Secure Boot Enabled**, select **true**. This setting makes sure only properly signed boot components can load.

1. Select **Review + create** to validate your configuration.

1. Wait for validation to complete. If necessary, fix any validation issues, then select **Review + create** again.

1. In the **Review + create** pane, select **Create** to deploy the VM.

## Deploy confidential VM template with Azure CLI

To create and deploy a confidential VM using an ARM template through the Azure CLI:

1. Sign in to your Azure account in the Azure CLI.

    ```powershell-interactive
    az login
    ```

1. Set your Azure subscription. Replace `<subscription-id>` with your subscription identifier. Make sure to use a subscription that meets the [prerequisites](#prerequisites).

    ```powershell-interactive
    az account set --subscription <subscription-id>
    ```

1. Set the variables for your confidential VM. Provide the deployment name (`$deployName`), the resource group (`$resourceGroup`), the VM name (`$vmName`), and the Azure region (`$region`). Replace the sample values with your own information.

    > [!NOTE]
    > Confidential VMs are not available in all locations. For currently supported locations, see which [VM products are available by Azure region](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines).

    ```powershell-interactive
    $deployName="<deployment-name>"
    $resourceGroup="<resource-group-name>"
    $vmName= "<confidential-vm-name>"
    $region="<region-name>"
    ```

    If the resource group you specified doesn't exist, create a resource group with that name.
    
    ```powershell-interactive
    az group create -n $resourceGroup -l $region
    ```

1. Deploy your VM to Azure using ARM template with custom parameter file

      
    ```powershell-interactive
    az deployment group create `
     -g $resourceGroup `
     -n $deployName `
     -u "https://aka.ms/CVMTemplate" `
     -p "<json-parameter-file-path>" `
     -p vmLocation=$region `
        vmName=$vmName
    ```


### Define custom parameter file

When you create your confidential VM using the Azure CLI, you need to define custom parameter file. To create a custom JSON parameter file:

1. Sign into your Azure account in the Azure CLI.

1. Create a JSON parameter file. For example, `azuredeploy.parameters.json`.

1. Depending on the OS image you're using, copy in the [example Windows parameter file](#example-windows-parameter-file) or the [example Linux parameter file](#example-linux-parameter-file).

1. Edit the JSON code in the parameter file as needed. For example, you might want to update the OS image name (`osImageName`), the administrator username (`adminUsername`), and more.

#### Example Windows parameter file

Use this example to create a custom parameter file for a Windows-based confidential VM.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {

    "vmSize": {
      "value": "Standard_DC2as_v5"
    },
    "osImageName": {
      "value": "Windows Server 2022 Gen 2"
    },
    "securityType": {
      "value": "DiskWithVMGuestState"
    },
    "adminUsername": {
      "value": "testuser"
    },
    "adminPasswordOrKey": {
      "value": "Password123@@"
    }
  }
}
```

#### Example Linux parameter file

Use this example to create a custom parameter file for a Linux-based confidential VM.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {

    "vmSize": {
      "value": "Standard_DC2as_v5"
    },
    "osImageName": {
      "value": "Ubuntu 20.04 LTS Gen 2"
    },
    "securityType": {
      "value": "DiskWithVMGuestState"
    },
    "adminUsername": {
      "value": "testuser"
    },
    "authenticationType": {
      "value": "sshPublicKey"
    },
    "adminPasswordOrKey": {
      "value": {your ssh public key}
    }
  }
}
```

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Create a confidential VM on AMD in the Azure portal](quick-create-confidential-vm-portal-amd.md)