---
title: 'Tutorial: Create a NAT gateway - Azure portal'
titlesuffix: Azure Virtual Network NAT
description: This quickstart shows how to create a NAT gateway using the Azure portal
services: virtual-network
documentationcenter: na
author: asudbring
manager: KumudD
Customer intent: I want to create a NAT gateway for outbound connectivity for my virtual network.
ms.service: virtual-network
ms.subservice: nat
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/24/2020
ms.author: allensu
---

# Tutorial: Create a NAT gateway using the Azure portal

This tutorial shows you how to use Azure Virtual Network NAT service. You'll create a NAT gateway to provide outbound connectivity for a virtual machine in Azure. 

If you prefer, you can do these steps using the [Azure CLI](quickstart-create-nat-gateway-cli.md), [Azure PowerShell](quickstart-create-nat-gateway-powershell.md), or deploy a [ARM Template](quickstart-create-nat-gateway-powershell.md) instead of the portal.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Virtual network and parameters

Before you deploy a VM and can use your NAT gateway, we need to create the resource group and virtual network.

In this section you'll need to replace the following parameters in the steps with the information below:

| Parameter                   | Value                |
|-----------------------------|----------------------|
| **\<resource-group-name>**  | myResourceGroupNAT |
| **\<virtual-network-name>** | myVNet          |
| **\<region-name>**          | East US 2      |
| **\<IPv4-address-space>**   | 192.168.0.0\16          |
| **\<subnet-name>**          | mySubnet        |
| **\<subnet-address-range>** | 192.168.0.0\24          |

[!INCLUDE [virtual-networks-create-new](../../includes/virtual-networks-create-new.md)]

## Create a VM to use the NAT gateway

We'll now create a VM to use the NAT service. This VM has a public IP to use as an instance-level Public IP to allow you to access the VM. NAT service is flow direction aware and will replace the default Internet destination in your subnet. The VM's public IP address won't be used for outbound connections.

1. On the upper-left side of the portal, select **Create a resource** > **Compute** > **Ubuntu Server 18.04 LTS**, or search for **Ubuntu Server 18.04 LTS** in the Marketplace search.

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
   - **Public IP** > Select **Create new**.  In the **Create public IP address** window, type **myPublicIPVM** in the **Name** field, and choose **Standard** for the **SKU**.  Click **OK**.
   - **NIC network security group**: Select **Basic**.
   - **Public inbound ports**: Select **Allow selected ports**.
   - **Select inbound ports**: Confirm **SSH** is selected.

4. In the **Management** tab, under **Monitoring**, set **Boot diagnostics** to **Off**.

5. Select **Review + create**. 

6. Review the settings and click **Create**.

## Create the NAT gateway

You can use one or more public IP address resources, public IP prefixes, or both. We'll add a public IP resource, public IP prefix, and a NAT gateway resource.

This section details how you can create and configure the following components of the NAT service using the NAT gateway resource:
  - A public IP pool and public IP prefix to use for outbound flows translated by the NAT gateway resource.
  - Change the idle timeout from the default of 4 minutes to 10 minutes.

### Create a public IP address

1. On the upper-left side of the portal, select **Create a resource** > **Networking** > **Public IP address**, or search for **Public IP address** in the Marketplace search.

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

1. On the upper-left side of the portal, select **Create a resource** > **Networking** > **Public IP prefix**, or search for **Public IP prefix** in the Marketplace search. 

2. In **Create a public IP prefix**, type or select the following values in the **Basics** tab:
   - **Subscription** > **Resource Group**: Select **myResourceGroupNAT**>
   - **Instance details** > **Name**: Type **myPublicIPprefix**.
   - **Instance details** > **Region**: Select **East US 2**.
   - **Instance details** > **Prefix size**: Select **/31 (2 addresses)**

3. Leave the rest the defaults and select **Review + create**.

4. Review the settings, and then select **Create**.
   

### Create a NAT gateway resource

1. On the upper-left side of the portal, select **Create a resource** > **Networking** > **NAT gateway**, or search for **NAT gateway** in the Marketplace search.

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

When no longer needed, delete the resource group, NAT gateway, and all related resources. Select the resource group **myResourceGroupNAT** that contains the NAT gateway, and then select **Delete**.

## Next steps

In this tutorial, you created a NAT gateway and a VM to use it. 

Review metrics in Azure Monitor to see your NAT service operating. Diagnose issues such as resource exhaustion of available SNAT ports.  Resource exhaustion of SNAT ports is addressed by adding additional public IP address resources or public IP prefix resources or both.


- Learn about [Azure Virtual Network NAT](./nat-overview.md)
- Learn about [NAT gateway resource](./nat-gateway-resource.md).
- Quickstart for deploying [NAT gateway resource using Azure CLI](./quickstart-create-nat-gateway-cli.md).
- Quickstart for deploying [NAT gateway resource using Azure PowerShell](./quickstart-create-nat-gateway-powershell.md).
- Quickstart for deploying [NAT gateway resource using Azure portal](./quickstart-create-nat-gateway-portal.md).
> [!div class="nextstepaction"]

