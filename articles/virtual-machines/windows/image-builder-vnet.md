---
title: Create a Windows VM with Azure Image Builder using an existing VNET (preview)
description: Create a Windows VM with the Azure Image Builder using an existing VNET
author: cynthn
ms.author: cynthn
ms.date: 05/29/2020
ms.topic: how-to
ms.service: virtual-machines-windows
ms.subservice: imaging
ms.reviewer: danis
---
# Use Azure Image Builder for Windows VMs allowing access to an existing Azure VNET

This article shows you how you can use the Azure Image Builder to create a basic customized Windows image that has access to existing resources on a VNET. The build VM you create is deployed to a new or existing VNET you specify in your subscription. When you use an existing Azure VNET, the Azure Image Builder service does not require public network connectivity.

> [!IMPORTANT]
> Azure Image Builder is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Register the features

First, you must register for the Azure Image Builder Service. Registration grants the service permission to create, manage, and delete a staging resource group. The service also has rights to add resources the group that are required for the image build.

```powershell-interactive
# Register for Azure Image Builder Feature
Register-AzProviderFeature -FeatureName VirtualMachineTemplatePreview -ProviderNamespace Microsoft.VirtualMachineImages

Get-AzProviderFeature -FeatureName VirtualMachineTemplatePreview -ProviderNamespace Microsoft.VirtualMachineImages
# wait until RegistrationState is set to 'Registered'
```
## Set variables and permissions 

You will be using some pieces of information repeatedly. Create some variables to store that information.

```powershell-interactive
# Step 1: Import module
Import-Module Az.Accounts

# Step 2: get existing context
$currentAzContext = Get-AzContext

# destination image resource group
$imageResourceGroup="aibImageRG"

# location (see possible locations in main docs)
$location="westus2"

## if you need to change your subscription: Get-AzSubscription / Select-AzSubscription -SubscriptionName 

# get subscription, this will get your current subscription
$subscriptionID=$currentAzContext.Subscription.Id

# name of the image to be created
$imageName="win2019image01"

# image distribution metadata reference name
$runOutputName="win2019ManImg02ro"

# image template name
$imageTemplateName="window2019VnetTemplate03"

# distribution properties object name (runOutput), i.e. this gives you the properties of the managed image on completion
$runOutputName="winSvrSigR01"

# VNET properties (update to match your existing VNET, or leave as-is for demo)
# VNET name
$vnetName="myexistingvnet01"
# subnet name
$subnetName="subnet01"
# VNET resource group name
$vnetRgName="existingVnetRG"
# Existing Subnet NSG Name or the demo will create it
$nsgName="aibdemoNsg"
# NOTE! The VNET must always be in the same region as the AIB service region.
```

Create the resource group.

```powershell-interactive
New-AzResourceGroup -Name $imageResourceGroup -Location $location
```

## Configure networking

If you do not have an existing VNET\Subnet\NSG, use the following script to create one.
