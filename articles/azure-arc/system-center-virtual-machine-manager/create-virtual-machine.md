---
title:  Create a virtual machine on System Center Virtual Machine Manager using Azure Arc (preview)
description: This article helps you create a virtual machine using Azure portal (preview). 
ms.date: 01/27/2023
ms.topic: conceptual
ms.services: azure-arc
ms.subservice: azure-arc-scvmm
author: jyothisuri
ms.author: jsuri
keywords: "VMM, Arc, Azure"
---


# Create a virtual machine on System Center Virtual Machine Manager using Azure Arc (preview)

Once your administrator has connected an SCVMM management server to Azure, represented VMM resources such as private clouds, VM templates in Azure, and provided you the required permissions on those resources, you'll be able to create a virtual machine in Azure.

## Prerequisites

- An Azure subscription and resource group where you have *Arc SCVMM VM Contributor* role.
- A cloud resource on which you have *Arc SCVMM Private Cloud Resource User* role.
- A virtual machine template resource on which you have *Arc SCVMM Private Cloud Resource User role*.
- A virtual network resource on which you have *Arc SCVMM Private Cloud Resource User* role.

## How to create a VM in Azure portal

1. Go to Azure portal.
2. Select **Azure Arc** as the service and then select **Azure Arc virtual machine** from the left blade.
3. Click **+ Create**, **Create an Azure Arc virtual machine** page opens.

3. Under **Basics** > **Project details**, select the **Subscription** and **Resource group** where you want to deploy the VM.
4. Under **Instance details**, provide the following details:
   - Virtual machine name - Specify the name of the virtual machine.
   - Custom location - Select the custom location that your administrator has shared with you.
   - Virtual machine kind – Select **System Center Virtual Machine Manager**.
   - Cloud – Select the target VMM private cloud.
   - Availability set - (Optional) Use availability sets to identify virtual machines that you want VMM to keep on separate hosts for improved continuity of service.
5. Under **Template details**, provide the following details:
   - Template – Choose the VM template for deployment.
   - Override template details - Select the checkbox to override the default CPU cores and memory on the VM templates.
   - Specify computer name for the VM, if the VM template has computer name associated with it.
6. Under **Administrator account**, provide the following details and click **Next : Disks >**.
   - Username
   - Password
   - Confirm password
7. Under **Disks**, you can optionally change the disks configured in the template. You can add more disks or update existing disks.
8. Under **Networking**, you can optionally change the network interfaces configured in the template. You can add Network interface cards (NICs) or update the existing NICs. You can also change the network that this NIC will be attached to provided you have appropriate permissions to the network resource.
9. Under **Advanced**, enable processor compatibility mode if required.
10. Under **Tags**, you can optionally add tags to the VM resource.
    >[!NOTE]
    > Custom properties defined for the VM in VMM will be synced as tags in Azure.

11.	Under **Review + create**, review all the properties and select **Create**. The VM will be created in a few minutes.
