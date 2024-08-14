---
title:  Create a virtual machine on System Center Virtual Machine Manager using Azure Arc
description: This article helps you create a virtual machine using Azure portal. 
ms.date: 07/01/2024
ms.topic: how-to
ms.services: azure-arc
ms.subservice: azure-arc-scvmm
author: PriskeyJeronika-MS
ms.author: v-gjeronika
manager: jsuri
keywords: "VMM, Arc, Azure"
---


# Create a virtual machine on System Center Virtual Machine Manager using Azure Arc

Once your administrator has connected an SCVMM management server to Azure, represented VMM resources such as private clouds, VM templates in Azure, and provided you the required permissions on those resources, you'll be able to create a virtual machine in Azure.

## Prerequisites

- An Azure subscription and resource group where you have *Arc SCVMM VM Contributor* role.
- A cloud resource on which you have *Arc SCVMM Private Cloud Resource User* role.
- A virtual machine template resource on which you have *Arc SCVMM Private Cloud Resource User* role.
- A virtual network resource on which you have *Arc SCVMM Private Cloud Resource User* role.

## How to create a VM in Azure portal

1. Go to Azure portal.
2. You can initiate the creation of a new VM in either of the following two ways:
   - Select **Azure Arc** as the service and then select **SCVMM management servers** under **Host environments** from the left blade. Search and select your SCVMM management server. Select **Virtual machines** under **SCVMM inventory** from the left blade and select **Add**. 
   Or
   - Select **Azure Arc** as the service and then select **Machine** under **Azure Arc resources** from the left blade. Select **Add/Create** and select **Create a machine in a connected host environment** from the dropdown.
1. Once the **Create an Azure Arc virtual machine** page opens, under **Basics** > **Project details**, select the **Subscription** and **Resource group** where you want to deploy the VM.
1. Under **Instance details**, provide the following details:
   - **Virtual machine name** - Specify the name of the virtual machine.
   - **Custom location** - Select the custom location that your administrator has shared with you.
   - **Virtual machine kind** - Select **System Center Virtual Machine Manager**.
   - **Cloud** - Select the target VMM private cloud.
   - **Availability set** - (Optional) Use availability sets to identify virtual machines that you want VMM to keep on separate hosts for improved continuity of service.
1. Under **Template details**, provide the following details:
   - **Template** - Choose the VM template for deployment.
   - **Override template defaults** - Select the checkbox to override the default CPU cores and memory on the VM templates.
   - Specify computer name for the VM if the VM template has computer name associated with it.
1. Keep the **Enable Guest Management** checkbox selected to automatically install Azure connected machine agent immediately after the creation of the VM. [Azure connected machine agent (Arc agent)](../servers/agent-overview.md) is required if you're planning to use Azure management services to govern, patch, monitor, and secure your VM through Azure.
1. Under **Administrator account**, provide the following details and select **Next : Disks >**.
   - Username
   - Password
   - Confirm password
1. Under **Disks**, you can optionally change the disks configured in the template. You can add more disks or update existing disks.
1. Under **Networking**, you can optionally change the network interfaces configured in the template. You can add Network interface cards (NICs) or update the existing NICs. You can also change the network that this NIC will be attached to provided you have appropriate permissions to the network resource.
1. Under **Advanced**, enable processor compatibility mode if required.
1. Under **Tags**, you can optionally add tags to the VM resource.
1. Under **Review + create**, review all the properties and select **Create**. The VM will be created in a few minutes.
