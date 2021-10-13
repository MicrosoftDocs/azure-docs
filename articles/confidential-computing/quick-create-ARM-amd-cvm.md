---
title: Quickstart - Create an Azure Confidential virtual machine with Azure CLI
description: Get started with your deployments by learning how to quickly create a confidential virtual machine using Azure CLI.
author: RunCai
ms.service: virtual-machines
ms.subservice: workloads
ms.workload: infrastructure
ms.topic: quickstart
ms.date: 10/09/2021
ms.author: RunCai
---


# Quickstart: Deploy an Azure Confidential virtual machine with Azure Resource Manager template

Get started with Azure confidential computing by using Azure CLI to create a confidential virtual machine (VM) backed by AMD SEV-SNP to achieve VM memory encryption and isolation. 

This tutorial is recommended if you're interested in deploying a confidential virtual machine with custom configuration. Otherwise, we recommend following the [confidential Computing virtual machine deployment steps for the Microsoft commercial marketplace](quick-create-marketplace.md).


## Prerequisites

If you don't have an Azure subscription, [create an account](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go/) before you begin.

> [!NOTE]
> Free trial accounts do not have access to the virtual machines used in this tutorial. Please upgrade to a Pay-As-You-Go subscription.

## Deploy the template through Azure Portal

* Select the following image to sign in to Azure and open a template. The template creates a key vault and a secret.

    [![Deploy to Azure](/media/quick-create-ARM-amd-cvm/ARM-deploy.png)](https://aka.ms/deploycvmazure)

    - **Subscription**: select an Azure subscription.
    - **Resource group**: select an existing resource group from the drop-down, or select **Create new**, enter a unique name for the resource group, and then click **OK**.
    - **Region**: select a location.  For example, **West US**.
    - **VM name**: type in your confidential virtual machine name.
    - **VM location**: select a confidential virtual machine location. Currently supported locations include **West US** and **North Europe**.
    - **VM size**: select the size of your VM.
    - **OS Image name**: select the OS image for your VM.
    - **OS disk Type**: select OS disk type.
    - **Admin username**: provide a username, such as *azureuser*.
    - **Admin password**: provide a password to use for the admin account. The password must be at least 12 characters long and meet the [defined complexity requirements](faq.yml#what-are-the-password-requirements-when-creating-a-vm-).
    - **Boot Diagnostics**: select whether you want the boot diagnostics capability for your VM. False is the default setting.
    - **Security Type**: select whether you want full OS disk encryption prior to VM deployment. **VMGuestStateOnly** does not offer OS disk encryption. **DiskWithVMGuestState** enable full OS disk encryption using platform-managed keys.
    - **Secure Boot Enabled**: select true to ensure that only properly signed boot components can load.
* Select **Review + create**. After validation completes, select **Create** to create and deploy the VM.

## Deploy the template through Azure Command-Line Interface
* Use this confidential VM template file: CVM Azuredeploy.json (https://aka.ms/CVMTemplate)
* Create a JSON file (for example, Azuredeploy.parameters.json) and copy/paste the following file examples for either Linux or Windows. Edit the parameter file as needed (for example, osImageName, adminUsername, etc.). Reference previous Parameter list for descriptions and allowed values.
* Linux parameter file example:
```bash
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

* Windows parameter file example: 
```bash
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
1. Open PowerShell, install [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
1. Sign in to Azure and set your subscription
```bash
az login
az account set --subscription <subscription id>
```
1. Set variables: Specify a virtual machine name and the Azure resource group where you want the virtual machine to be deployed in. If the resource group does not exist, it will need to be created. 
```bash
$deployName="<name of deployment>"
$resourceGroup="<name of resource group>"
$vmName= "<name of vm>"
$region="West US"
```
Example:

![Set Variables](media/quick-create-ARM-amd-cvm/Set-variables.png)]

1. Deploy Confidential virtual machine: Use the following commands in PowerShell to deploy your CVM to Azure.
```bash
az group create -n $resourceGroup -l $region

az deployment group create `
 -g $resourceGroup `
 -n $deployName `
 -u "https://cvmprivatepreviewsa.blob.core.windows.net/cvmpublicpreviewcontainer/deploymentTemplate/deployCPSCVM.json" `
 -p "<path to parameters file>" `
 -p vmLocation=$region `
    vmName=$vmName

```
Example:

![Deploy CVM](media/quick-create-ARM-amd-cvm/Deploy-CVM.png)]
