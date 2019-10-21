---
title: 'Quickstart: Create a NAT Gateway - Azure portal'
titlesuffix: Azure NAT service
description: This quickstart shows how to create a NAT Gateway using the Azure portal
services: nat
documentationcenter: na
author: asudbring
manager: twooley
Customer intent: I want to create a NAT Gateway for outbound connectivity for my virtual network.
ms.service: nat
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 08/21/2019
ms.author: allensu
ms.custom: seodec18
---

# Quickstart: Create a NAT Gateway using Azure portal

This quickstart shows you how to use Azure NAT service and create a NAT gateway to provide outbound connectivity for a virtual machine in Azure. 

>[!NOTE] 
>Azure NAT service is available as Public Preview at this time and available in a limited set of [regions](https://azure.microsoft.com/global-infrastructure/regions/). This preview is provided without a service level agreement and isn't recommended for production workloads. Certain features may not be supported or may have constrained capabilities. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.comsupport/legal/preview-supplemental-terms) for details.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Prerequisites
For this quickstart, you'll need a virtual network and a virtual machine to associate with the NAT gateway.

### Create a virtual network

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

1. On the upper-left side of the portal, select **Create a resource** > **Compute** > **Ubuntu Server**. 

2. In **Create a virtual machine**, type or select the following values in the **Basics** tab:
   - **Subscription** > **Resource Group**: Select **myResourceGroupNAT**.
   - **Instance Details** > **Virtual machine name**: Type **myVM**.
   - **Instance Details** > **Region** > select **East US 2**.
   - **Administrator account** > **Authentication type**: Select **Password**.
   - **Administrator account** > Enter the **Username**, **Password** and **Confirm password** information.
   - **Inbound port rules** > **Public inbound ports**: Select **Allow selected ports**.
   - **Inbound port rules** > **Select inbound ports**: Select **SSH (22)**
   - Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.

3. In the **Networking** tab make sure the following are selected:
   - **Virtual network**: **myVnet**
   - **Subnet**: **mySubnet**
   - **Public IP** > select **Create new**, and in the **Create public IP address** window, **Name**: Type **myPublicIPVM**, **SKU**: Select **Standard**, and then select **OK**.
   - **NIC network security group**: Select **Basic**.
   - **Public inbound ports**: Select **Allow selected ports**.
   - **Select inbound ports**: Confirm **SSH** is selected.

4. In the **Management** tab, under **Monitoring**, set **Boot diagnostics** to **Off**.

5. Select **Review + create**. 

## Create the NAT Gateway

### Create a public IP address

### Create a public IP prefix

### Create a NAT gateway resource

1. On the upper-left side of the screen, select **Create a resource** > **Networking** > **NAT gateway**.

2. In **Create network address translation (NAT) gateway**, type or select the following values in the **Basics** tab:
   _ **Subscription** > **Resource Group**: Select **myResourceGroupNAT**.
   - **Instance Details** > **NAT gateway name**: Type **myNATGateway**.
   - **Instance Details** > **Region**: Select **East US 2**.
   - **Instance Details** > **Idle timeout (minutes)**: Type **10**.
   _ Select the **Public IP** tab, or select **Next: Public IP**.

3. In the **Public IP** tab, type or select the following values:
   

4. In the **Subnet** tab, type or select the following values:
  - **Virtual Network**: Select **myResourceGroupNAT** > **myVnet**.
  - **Subnet name**: Select the box next to **mySubnet**.

5. Select **Review + create**.

6. Review the settings, and then select **Create**.

## Discover the IP address of the VM

First we need to discover the IP address of the VM you've created. To retrieve the public IP address of the VM, use [az network public-ip show](/cli/azure/network/public-ip#az-network-public-ip-show). 

```azurecli-interactive
  az network public-ip show \
    --resource-group myResourceGroupNAT \
    --name myPublicIP \
    --query [ipAddress] \
    --output tsv
``` 

>[!IMPORTANT]
>Copy the public IP address, and then paste it into a notepad so you can use it to access the VM.

### Sign in to VM

Open an [Azure Cloud Shell](https://shell.azure.com) in your browser. Use the IP address retrieved in the previous step to SSH to the virtual machine.

```bash
ssh <username>@<ip-address-destination>
```

You're now ready to use the NAT service.

## Clean up resources

When no longer needed, you can use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group and all resources contained within.

```azurecli-interactive 
  az group delete \
    --name myResourceGroupNAT
```

## Next steps

In this tutorial, you created a NAT gateway and a VM to use the NAT service. To learn more about Azure NAT service, continue to other tutorials for Azure NAT service.

You can also review metrics in Azure Monitor to see your NAT service operating and diagnose issues such as resource exhaustion of available SNAT ports.  Resource exhaustion of SNAT ports is easily addressed by adding additional public IP address resources or public IP prefix resources or both.

> [!div class="nextstepaction"]

