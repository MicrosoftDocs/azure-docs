---
title: 'Quickstart: Create a NAT gateway - Azure portal'
titlesuffix: Azure Virtual Network NAT
description: This quickstart shows how to create a NAT gateway using the Azure portal
services: virtual-network
documentationcenter: na
author: asudbring
manager: KumudD
Customer intent: I want to create a NAT gateway for outbound connectivity for my virtual network.
ms.service: virtual-network
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 11/04/2019
ms.author: allensu
---

# Quickstart: Create a NAT gateway using the Azure portal

This quickstart shows you how to use Azure NAT service and create a NAT gateway to provide outbound connectivity for a virtual machine in Azure. 

>[!NOTE] 
>Azure NAT service is available as Public preview at this time and available in a limited set of [regions](https://azure.microsoft.com/global-infrastructure/regions/). This preview is provided without a service level agreement and isn't recommended for production workloads. Certain features may not be supported or may have constrained capabilities. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms) for details.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).


### Create a virtual network

Before you deploy a VM and can use your NAT gateway, we need to create the resource group and virtual network.  

1. On the upper-left side of the screen, select **Create a resource** > **Networking** > **Virtual network**.

2. In **Create virtual network**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myVNet**. |
    | Address space | Enter **192.168.0.0/16**. |
    | Subscription | Select your subscription.|
    | Resource group | Select create new - **myResourceGroupNAT**. |
    | Location | Select **East US 2**.|
    | Subnet - Name | Enter **mySubnet**. |
    | Subnet - Address range | Enter **192.168.0.0/24**. |

3. Leave the rest of the defaults and select **Create**.

### Create a VM to use the NAT service

We'll now create a VM to use the NAT service. This VM has a public IP to use as an instance-level Public IP to allow you to access the VM. NAT service is flow direction aware and will replace the default Internet destination in your subnet. The VM's public IP address won't be used for outbound connections.

1. On the upper-left side of the portal, select **Create a resource** > **Compute** > **Ubuntu Server**. 

2. In **Create a virtual machine**, type or select the following values in the **Basics** tab:
   - **Subscription** > **Resource Group**: Select **myResourceGroupNAT**.
   - **Instance Details** > **Virtual machine name**: Type **myVM**.
   - **Instance Details** > **Region** > select **East US 2**.
   - **Administrator account** > **Authentication type**: Select **Password**.
   - **Administrator account** > Enter the **Username**, **Password**, and **Confirm password** information.
   - **Inbound port rules** > **Public inbound ports**: Select **Allow selected ports**.
   - **Inbound port rules** > **Select inbound ports**: Select **SSH (22)**
   - Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.

3. In the **Networking** tab make sure the following are selected:
   - **Virtual network**: **myVnet**
   - **Subnet**: **mySubnet**
   - **Public IP** > Select **Create new**.  In the **Create public IP address** window, type **myPublicIPVM** in the **Name** field.  Leave the rest at the defaults and click **OK**.
   - **NIC network security group**: Select **Basic**.
   - **Public inbound ports**: Select **Allow selected ports**.
   - **Select inbound ports**: Confirm **SSH** is selected.

4. In the **Management** tab, under **Monitoring**, set **Boot diagnostics** to **Off**.

5. Select **Review + create**. 

6. Review the settings and click **Create**.

## Create the NAT Gateway

You can use one or more public IP address resources, public IP prefixes, or both with NAT gateway. We'll add a public IP resource, public IP prefix, and a NAT gateway resource.

This section details how you can create and configure the following components of the NAT service using the NAT gateway resource:
  - A public IP pool and public IP prefix to use for outbound flows translated by the NAT gateway resource.
  - Change the idle timeout from the default of 4 minutes to 10 minutes.

### Create a public IP address

1. On the upper-left side of the portal, select **Create a resource** > **Networking** > **Public IP address**. 

2. In **Create public IP address**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | IP Version | Select **IPv4**.
    | SKU | Select **Standard**.
    | Name | Enter **myPublicIP**. |
    | Subscription | Select your subscription.|
    | Resource group | Select **myResourceGroupNAT**. |
    | Location | Select **East US 2**.|

3. Leave the rest of the defaults and select **Create**.

### Create a public IP prefix

1. On the upper-left side of the portal, select **Create a resource** > **Networking** > **Public IP prefix**. 

2. In **Create a public IP prefix**, type or select the following values in the **Basics** tab:
   - **Subscription** > **Resource Group**: Select **myResourceGroupNAT**>
   - **Instance details** > **Name**: Type **myPublicIPprefix**.
   - **Instance details** > **Region**: Select **East US 2**.
   - **Instance details** > **Prefix size**: Select **/31 (2 addresses)**

3. Leave the rest the defaults and select **Review + create**.

4. Review the settings, and then select **Create**.
   

### Create a NAT gateway resource

1. On the upper-left side of the portal, select **Create a resource** > **Networking** > **NAT gateway**.

2. In **Create network address translation (NAT) gateway**, type or select the following values in the **Basics** tab:
   - **Subscription** > **Resource Group**: Select **myResourceGroupNAT**.
   - **Instance details** > **NAT gateway name**: Type **myNATgateway**.
   - **Instance details** > **Region**: Select **East US 2**.
   - **Instance details** > **Idle timeout (minutes)**: Type **10**.
   - Select the **Public IP** tab, or select **Next: Public IP**.

3. In the **Public IP** tab, type or select the following values:
   - **Public IP addresses**: Select **myPublicIP**.
   - **Public IP Prefixes**: Select **myPublicIPprefix**.
   - Select the **Subnet** tab, or select **Next: Subnet**.

4. In the **Subnet** tab, type or select the following values:
   - **Virtual Network**: Select **myResourceGroupNAT** > **myVnet**.
   - **Subnet name**: Select the box next to **mySubnet**.

5. Select **Review + create**.

6. Review the settings, and then select **Create**.

## Discover the IP address of the VM

1. On the left side of the portal, select **Resource groups**.
2. Select **myResourceGroupNAT**.
3. Select **myVM**.
4. In **Overview**, copy the **Public IP address** value, and paste into notepad so you can use it to access the VM.

>[!IMPORTANT]
>Copy the public IP address, and then paste it into a notepad so you can use it to access the VM.

## Sign in to VM

Open an [Azure Cloud Shell](https://shell.azure.com) in your browser. Use the IP address retrieved in the previous step to SSH to the virtual machine.

```azurecli-interactive
ssh <username>@<ip-address-destination>
```

You're now ready to use the NAT service.

## Clean up resources

When no longer needed, delete the resource group, NAT gateway, and all related resources. Select the resource group (**myResourceGroupNAT**) that contains the NAT gateway, and then select **Delete**.

## Next steps

In this tutorial, you created a NAT gateway and a VM to use the NAT service. To learn more about Azure NAT service, continue to other tutorials for Azure NAT service.

You can also review metrics in Azure Monitor to see your NAT service operating. You can diagnose issues such as resource exhaustion of available SNAT ports.  Resource exhaustion of SNAT ports is easily addressed by adding additional public IP address resources or public IP prefix resources or both.


- Learn about [Virtual Network NAT](./nat-overview.md)
- Learn about [NAT gateway resource](./nat-gateway-resource.md).
- Quickstart for deploying [NAT gateway resource using Azure CLI](./quickstart-create-nat-gateway-cli.md).
- Quickstart for deploying [NAT gateway resource using Azure PowerShell](./quickstart-create-nat-gateway-powershell.md).
- Quickstart for deploying [NAT gateway resource using Azure portal](./quickstart-create-nat-gateway-portal.md).
- [Provide feedback on the Public Preview](https://aka.ms/natfeedback).
> [!div class="nextstepaction"]

