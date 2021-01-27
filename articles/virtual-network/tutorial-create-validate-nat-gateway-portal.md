---
title: 'Tutorial: Create and test a NAT Gateway - Azure portal'
titlesuffix: Azure Virtual Network NAT
description: This tutorial shows how to create a NAT Gateway using the Azure portal and test the NAT service
services: virtual-network
documentationcenter: na
author: asudbring
manager: KumundD
Customer intent: I want to test a NAT Gateway for outbound connectivity for my virtual network.
ms.service: virtual-network
ms.subservice: nat
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/24/2020
ms.author: allensu

---
# Tutorial: Create a NAT Gateway using the Azure portal and test the NAT service

In this tutorial, you'll create a NAT gateway to provide outbound connectivity for virtual machines in Azure. To test the NAT gateway, you deploy a source and destination virtual machine. You'll test the NAT gateway by making outbound connections to a public IP address from the source to the destination virtual machine.  This tutorial deploys source and destination in two different virtual networks in the same resource group for simplicity only.

If you prefer, you can do these steps using the [Azure CLI](tutorial-create-validate-nat-gateway-cli.md) or [Azure PowerShell](tutorial-create-validate-nat-gateway-powershell.md) instead of the portal.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Prepare the source for outbound traffic

We'll guide you through configuration of a full test environment and the execution of the tests itself in the next steps. We'll start with the source, which will use the NAT gateway resource we create in later steps.

## Virtual network and parameters

Before you deploy a VM and can use your NAT gateway, we need to create the resource group and virtual network.

In this section you'll need to replace the following parameters in the steps with the information below:

| Parameter                   | Value                |
|-----------------------------|----------------------|
| **\<resource-group-name>**  | myResourceGroupNAT |
| **\<virtual-network-name>** | myVNetsource          |
| **\<region-name>**          | East US 2      |
| **\<IPv4-address-space>**   | 192.168.0.0/16          |
| **\<subnet-name>**          | mySubnetsource        |
| **\<subnet-address-range>** | 192.168.0.0/24          |

[!INCLUDE [virtual-networks-create-new](../../includes/virtual-networks-create-new.md)]

## Create source virtual machine

We'll now create a VM to use the NAT service. This VM has a public IP to use as an instance-level Public IP to allow you to access the VM. NAT service is flow direction aware and will replace the default Internet destination in your subnet. The VM's public IP address won't be used for outbound connections.

To test the NAT gateway, we'll assign a public IP address resource as an instance-level Public IP to access this VM from the outside. This address is only used to access it for the test.  We'll demonstrate how the NAT service takes precedence over other outbound options.

You could also create this VM without a public IP and create another VM to use as a jumpbox without a public IP as an exercise.

1. On the upper-left side of the portal, select **Create a resource** > **Compute** > **Ubuntu Server 18.04 LTS**, or search for **Ubuntu Server 18.04 LTS** in the Marketplace search.

2. In **Create a virtual machine**, enter or select the following values in the **Basics** tab:
   - **Subscription** > **Resource Group**: Select **myResourceGroupNAT**.
   - **Instance Details** > **Virtual machine name**: enter **myVMsource**.
   - **Instance Details** > **Region** > select **East US 2**.
   - **Administrator account** > **Authentication enter**: Select **Password**.
   - **Administrator account** > Enter the **Username**, **Password**, and **Confirm password** information.
   - **Inbound port rules** > **Public inbound ports**: Select **Allow selected ports**.
   - **Inbound port rules** > **Select inbound ports**: Select **SSH (22)**
   - Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.

3. In the **Networking** tab make sure the following are selected:
   - **Virtual network**: **myVnetsource**
   - **Subnet**: **mySubnetsource**
   - **Public IP** > Select **Create new**.  In the **Create public IP address** window, enter **myPublicIPsourceVM** in the **Name** field. Select **Standard** for the **SKU**. Leave the rest at the defaults and click **OK**.
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

1. On the upper-left side of the portal, select **Create a resource** > **Networking** > **Public IP address**, or search for **Public IP address** in the Marketplace search. 

2. In **Create public IP address**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | IP Version | Select **IPv4**.
    | SKU | Select **Standard**.
    | Name | Enter **myPublicIPsource**. |
    | Subscription | Select your subscription.|
    | Resource group | Select **myResourceGroupNAT**. |
    | Location | Select **East US 2**.|

3. Leave the rest of the defaults and select **Create**.

### Create a public IP prefix

1. On the upper-left side of the portal, select **Create a resource** > **Networking** > **Public IP prefix**, or search for **Public IP prefix** in the Marketplace search.

2. In **Create a public IP prefix**, enter or select the following values in the **Basics** tab:
   - **Subscription** > **Resource Group**: Select **myResourceGroupNAT**>
   - **Instance details** > **Name**: enter **myPublicIPprefixsource**.
   - **Instance details** > **Region**: Select **East US 2**.
   - **Instance details** > **Prefix size**: Select **/31 (2 addresses)**

3. Leave the rest the defaults and select **Review + create**.

4. Review the settings, and then select **Create**.


### Create a NAT gateway resource

1. On the upper-left side of the portal, select **Create a resource** > **Networking** > **NAT gateway**, or search for **NAT gateway** in the Marketplace search.

2. In **Create network address translation (NAT) gateway**, enter or select the following values in the **Basics** tab:
   - **Subscription** > **Resource Group**: Select **myResourceGroupNAT**.
   - **Instance details** > **NAT gateway name**: enter **myNATgateway**.
   - **Instance details** > **Region**: Select **East US 2**.
   - **Instance details** > **Idle timeout (minutes)**: enter **10**.
   - Select the **Public IP** tab, or select **Next: Public IP**.

3. In the **Public IP** tab, enter or select the following values:
   - **Public IP addresses**: Select **myPublicIPsource**.
   - **Public IP Prefixes**: Select **myPublicIPprefixsource**.
   - Select the **Subnet** tab, or select **Next: Subnet**.

4. In the **Subnet** tab, enter or select the following values:
   - **Virtual Network**: Select **myResourceGroupNAT** > **myVnetsource**.
   - **Subnet name**: Select the box next to **mySubnetsource**.

5. Select **Review + create**.

6. Review the settings, and then select **Create**.

All outbound traffic to Internet destinations is now using the NAT service.  It isn't necessary to configure a UDR.


## Prepare destination for outbound traffic

We'll now create a destination for the outbound traffic translated by the NAT service to allow you to test it.


## Virtual network and parameters for destination

Before you deploy a VM for the destination, we need to create a virtual network where the destination virtual machine can reside. The following are the same steps as for the source VM with some small changes to expose the destination endpoint.

In this section you'll need to replace the following parameters in the steps with the information below:

| Parameter                   | Value                |
|-----------------------------|----------------------|
| **\<resource-group-name>**  | myResourceGroupNAT |
| **\<virtual-network-name>** | myVNetdestination          |
| **\<region-name>**          | East US 2      |
| **\<IPv4-address-space>**   | 10.1.0.0/16          |
| **\<subnet-name>**          | mySubnetdestination        |
| **\<subnet-address-range>** | 10.1.0.0/24          |

[!INCLUDE [virtual-networks-create-new](../../includes/virtual-networks-create-new.md)]

## Create destination virtual machine

1. On the upper-left side of the portal, select **Create a resource** > **Compute** > **Ubuntu Server 18.04 LTS**, or search for **Ubuntu Server 18.04 LTS** in the Marketplace search.

2. In **Create a virtual machine**, enter or select the following values in the **Basics** tab:
   - **Subscription** > **Resource Group**: Select **myResourceGroupNAT**.
   - **Instance Details** > **Virtual machine name**: enter **myVMdestination**.
   - **Instance Details** > **Region** > select **East US 2**.
   - **Administrator account** > **Authentication enter**: Select **Password**.
   - **Administrator account** > Enter the **Username**, **Password**, and **Confirm password** information.
   - **Inbound port rules** > **Public inbound ports**: Select **Allow selected ports**.
   - **Inbound port rules** > **Select inbound ports**: Select **SSH (22)** and **HTTP (80)**.
   - Select the **Networking** tab, or select **Next: Disks**, then **Next: Networking**.

3. In the **Networking** tab make sure the following are selected:
   - **Virtual network**: **myVnetdestination**
   - **Subnet**: **mySubnetdestination**
   - **Public IP** > Select **Create new**.  In the **Create public IP address** window, enter **myPublicIPdestinationVM** in the **Name** field. Select **Standard** for **SKU**. Leave the rest at the defaults and click **OK**.
   - **NIC network security group**: Select **Basic**.
   - **Public inbound ports**: Select **Allow selected ports**.
   - **Select inbound ports**: Confirm **SSH** and **HTTP** is selected.

4. In the **Management** tab, under **Monitoring**, set **Boot diagnostics** to **Off**.

5. Select **Review + create**.

6. Review the settings, and then select **Create**.

## Prepare a web server and test payload on destination VM

First we need to discover the IP address of the destination VM. 

1. On the left side of the portal, select **Resource groups**.
2. Select **myResourceGroupNAT**.
3. Select **myVMdestination**.
4. In **Overview**, copy the **Public IP address** value, and paste into notepad so you can use it to access the VM.

>[!IMPORTANT]
>Copy the public IP address, and then paste it into a notepad so you can use it in subsequent steps. Indicate this is the destination virtual machine.

### Sign in to destination VM

Open an [Azure Cloud Shell](https://shell.azure.com) in your browser. Use the IP address retrieved in the previous step to SSH to the virtual machine.

```azurecli-interactive
ssh <username>@<ip-address-destination>
```

Copy and paste the following commands once you've logged in.  

```bash
sudo apt-get -y update && \
sudo apt-get -y upgrade && \
sudo apt-get -y dist-upgrade && \
sudo apt-get -y autoremove && \
sudo apt-get -y autoclean && \
sudo apt-get -y install nginx && \
sudo ln -sf /dev/null /var/log/nginx/access.log && \
sudo touch /var/www/html/index.html && \
sudo rm /var/www/html/index.nginx-debian.html && \
sudo dd if=/dev/zero of=/var/www/html/100k bs=1024 count=100
```

These commands will update your virtual machine, install nginx, and create a 100-KBytes file. This file will be retrieved from the source VM using the NAT service.

Close the SSH session with the destination VM.

## Prepare test on source VM

First we need to discover the IP address of the source VM.

1. On the left side of the portal, select **Resource groups**.
2. Select **myResourceGroupNAT**.
3. Select **myVMsource**.
4. In **Overview**, copy the **Public IP address** value, and paste into notepad so you can use it to access the VM.

>[!IMPORTANT]
>Copy the public IP address, and then paste it into a notepad so you can use it in subsequent steps. Indicate this is the source virtual machine.

### Log into source VM

Open a new tab for [Azure Cloud Shell](https://shell.azure.com) in your browser.  Use the IP address retrieved in the previous step to SSH to the virtual machine. 

```azurecli-interactive
ssh <username>@<ip-address-source>
```

Copy and paste the following commands to prepare for testing the NAT service.

```bash
sudo apt-get -y update && \
sudo apt-get -y upgrade && \
sudo apt-get -y dist-upgrade && \
sudo apt-get -y autoremove && \
sudo apt-get -y autoclean && \
sudo apt-get install -y nload golang && \
echo 'export GOPATH=${HOME}/go' >> .bashrc && \
echo 'export PATH=${PATH}:${GOPATH}/bin' >> .bashrc && \
. ~/.bashrc &&
go get -u github.com/rakyll/hey

```

This command will update your virtual machine, install go, install [hey](https://github.com/rakyll/hey) from GitHub, and update your shell environment.

You're now ready to test the NAT service.

## Validate NAT service

While logged into the source VM, you can use **curl** and **hey** to generate requests to the destination IP address.

Use curl to retrieve the 100-KBytes file.  Replace **\<ip-address-destination>** in the example below with the destination IP address you have previously copied.  The **--output** parameter indicates that the retrieved file will be discarded.

```bash
curl http://<ip-address-destination>/100k --output /dev/null
```

You can also generate a series of requests using **hey**. Again, replace **\<ip-address-destination>** with the destination IP address you have previously copied.

```bash
hey -n 100 -c 10 -t 30 --disable-keepalive http://<ip-address-destination>/100k
```

This command will generate 100 requests, 10 concurrently, with a timeout of 30 seconds, and without reusing the TCP connection.  Each request will retrieve 100 Kbytes.  At the end of the run, **hey** will report some statistics about how well the NAT service did.

## Clean up resources

When no longer needed, delete the resource group, NAT gateway, and all related resources. Select the resource group **myResourceGroupNAT** that contains the NAT gateway, and then select **Delete**.

## Next steps
In this tutorial, you created a NAT gateway, created a source and destination VM, and then tested the NAT gateway.

Review metrics in Azure Monitor to see your NAT service operating. Diagnose issues such as resource exhaustion of available SNAT ports.  Resource exhaustion of SNAT ports is easily addressed by adding additional public IP address resources or public IP prefix resources or both.

- Learn about [Virtual Network NAT](./nat-overview.md)
- Learn about [NAT gateway resource](./nat-gateway-resource.md).
- Quickstart for deploying [NAT gateway resource using Azure CLI](./quickstart-create-nat-gateway-cli.md).
- Quickstart for deploying [NAT gateway resource using Azure PowerShell](./quickstart-create-nat-gateway-powershell.md).
- Quickstart for deploying [NAT gateway resource using Azure portal](./quickstart-create-nat-gateway-portal.md).

> [!div class="nextstepaction"]

