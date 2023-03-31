---
title: 'Tutorial: Configure dual-stack outbound connectivity with a NAT gateway and a public load balancer'
titleSuffix: Azure Virtual Network NAT
description: Learn how to configure outbound connectivity for a dual stack network with a NAT gateway and a public load balancer.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.subservice: nat
ms.topic: tutorial
ms.date: 02/05/2023
ms.custom: template-tutorial, devx-track-azurecli
---

# Tutorial: Configure dual stack outbound connectivity with a NAT gateway and a public load balancer

In this tutorial, learn how to configure NAT gateway and a public load balancer to a dual stack subnet in order to allow for outbound connectivity for v4 workloads using NAT gateway and v6 workloads using Public Load balancer.

NAT gateway supports the use of IPv4 public IP addresses for outbound connectivity whereas load balancer supports both IPv4 and IPv6 public IP addresses. When NAT gateway with an IPv4 public IP is present with a load balancer using an IPv4 public IP address, NAT gateway takes precedence over load balancer for providing outbound connectivity. When a NAT gateway is deployed in a dual-stack network with a IPv6 load balancer, IPv4 outbound traffic is handled by the NAT gateway, and IPv6 outbound traffic is handled by the load balancer.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network
> * Create a NAT gateway with an IPv4 public address
> * Add IPv6 to the virtual network
> * Create a public load balancer with an IPv6 public address
> * Create a dual-stack virtual machine
> * Validate outbound connectivity from your dual stack virtual machine

## Prerequisites

# [**Portal**](#tab/dual-stack-outbound-portal)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

# [**CLI**](#tab/dual-stack-outbound--cli)

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- This tutorial requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

---

## Create virtual network

In this section, create a virtual network for the virtual machine and load balancer.

# [**Portal**](#tab/dual-stack-outbound-portal)

1. Sign-in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. Select **+ Create**.

1. In the **Basics** tab of **Create virtual network**, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter **TutorialIPv6NATLB-rg**. </br> Select **OK**. |
    | **Instance details** |   |
    | Name | Enter **myVNet**. |
    | Region | Select **West US 2**. |

1. Select the **IP Addresses** tab, or **Next: IP Addresses**.

1. Leave the default IPv4 address space of **10.1.0.0/16**. If the default is absent or different, enter an IPv4 address space of **10.1.0.0/16**.

1. Select **default** under **Subnet name**. If default is missing, select **+ Add subnet**.

1. In **Subnet name**, enter **myBackendSubnet**.

1. Leave the default IPv4 subnet of **10.1.0.0/24**.

1. Select **Save**. If creating a subnet, select **Add**.

1. Select the **Security** tab or select **Next: Security**.

1. In **BastionHost**, select **Enable**.

1. Enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Bastion name | **myBastion** |
    | AzureBastionSubnet address space | Enter **10.1.1.0/26**. |
    | Public IP address | Select **Create new**. </br> Enter **myPublicIP-Bastion** in **Name**. </br> Select **OK**. |

1. Select the **Review + create**.

1. Select **Create**.

# [**CLI**](#tab/dual-stack-outbound--cli)

### Create a resource group

An Azure resource group is a logical container where Azure resources are deployed and managed.

Create a resource group with [az group create](/cli/azure/group#az-group-create).

```azurecli-interactive
az group create \
    --name TutorialIPv6NATLB-rg \
    --location westus2
```

### Create network and subnets

Use [az network vnet create](/cli/azure/network/vnet#az_network_vnet_create) to create the virtual network.

```azurecli-interactive
az network vnet create \
    --resource-group TutorialIPv6NATLB-rg \
    --location westus2 \
    --name myVNet \
    --address-prefixes '10.1.0.0/16'
```

Use [az network vnet subnet create](/cli/azure/network/vnet/subnet#az_network_vnet_subnet_create) to create the IPv4 subnet for the virtual network and the Azure Bastion subnet. 

```azurecli-interactive
az network vnet subnet create \
    --name myBackendSubnet \
    --resource-group TutorialIPv6NATLB-rg \
    --vnet-name myVNet \
    --address-prefixes '10.1.0.0/24'
```

```azurecli-interactive
az network vnet subnet create \
    --name AzureBastionSubnet \
    --resource-group TutorialIPv6NATLB-rg \
    --vnet-name myVNet \
    --address-prefixes '10.1.1.0/26'
```

### Create bastion host

Use [az network public-ip create](/cli/azure/network/public-ip#az_network_public_ip_create) to create a public IP address for the bastion host.

```azurecli-interactive
az network public-ip create \
    --resource-group TutorialIPv6NATLB-rg \
    --name myPublicIP-Bastion \
    --sku standard \
    --zone 1 2 3
```

Use [az network bastion create](/cli/azure/network/bastion#az_network_bastion_create) to create the bastion host.

```azurecli-interactive
az network bastion create \
    --resource-group TutorialIPv6NATLB-rg \
    --name myBastion \
    --public-ip-address myPublicIP-Bastion \
    --vnet-name myVNet \
    --location westus2
```

---

It takes a few minutes for the bastion host to deploy. You can proceed to the next steps when the virtual network is deployed.

## Create NAT gateway

The NAT gateway provides the outbound connectivity for the IPv4 portion of the virtual network. Use the following example to create a NAT gateway.

# [**Portal**](#tab/dual-stack-outbound-portal)

1. In the search box at the top of the portal, enter **NAT gateway**. Select **NAT gateways** in the search results.

1. Select **+ Create**.

1. In the **Basics** tab of **Create network address translation (NAT) gateway**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **TutorialIPv6NATLB-rg**. |
    | **Instance details** |   |
    | NAT gateway name | Enter **myNATgateway**. |
    | Region | Select **West US 2**. |
    | Availability zone | Select a zone or **No Zone**. |
    | TCP idle timeout (minutes) | Leave the default of **4**. |

1. Select **Next: Outbound IP**.

1. In **Public IP addresses**, select **Create a new public IP address**.

1. Enter **myPublicIP-NAT** in **Name**. Select **OK**.

1. Select **Next: Subnet**.

1. In **Virtual network**, select **myVNet**.

1. In the list of subnets, select the box for **myBackendSubnet**.

1. Select **Review + create**.

1. Select **Create**.


# [**CLI**](#tab/dual-stack-outbound--cli)

Use [az network public-ip create](/cli/azure/network/public-ip#az_network_public_ip_create) to create a public IPv4 address for the NAT gateway.

```azurecli-interactive
az network public-ip create \
    --resource-group TutorialIPv6NATLB-rg \
    --name myPublicIP-NAT \
    --sku standard \
    --zone 1 2 3
```

Use [az network nat gateway create](/cli/azure/network/nat/gateway#az-network-nat-gateway-create) to create the NAT gateway.

```azurecli-interactive
az network nat gateway create \
    --resource-group TutorialIPv6NATLB-rg \
    --name myNATgateway \
    --public-ip-addresses myPublicIP-NAT \
    --idle-timeout 4
```

Use [az network vnet subnet update](/cli/azure/network/vnet/subnet#az_network_vnet_subnet_update) to associate the NAT gateway with **myBackendSubnet**.

```azurecli-interactive
az network vnet subnet update \
    --resource-group TutorialIPv6NATLB-rg \
    --vnet-name myVNet \
    --name myBackendSubnet \
    --nat-gateway myNATgateway
```

---

## Add IPv6 to virtual network

The addition of IPv6 to the virtual network must be done after the NAT gateway is associated with **myBackendSubnet**. Use the following example to add and IPv6 address space and subnet to the virtual network you created in the previous steps.

# [**Portal**](#tab/dual-stack-outbound-portal)

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. Select **myVNet**.

1. In **Settings**, select **Address space**.

1. In the box that displays **Add additional address range**, enter **2404:f800:8000:122::/63**.

1. Select **Save**.

1. Select **Subnets** in **Settings**.

1. Select **myBackendSubnet** in the list of subnets.

1. Select the box next to **Add IPv6 address space**.

1. Enter **2404:f800:8000:122::/64** in **IPv6 address space**.

1. Select **Save**.

# [**CLI**](#tab/dual-stack-outbound--cli)

Use [az network vnet update](/cli/azure/network/vnet#az-network-vnet-update) to add the IPv6 address space to the virtual network.

```azurecli-interactive
az network vnet update \
    --address-prefixes 10.1.0.0/16 2404:f800:8000:122::/63 \
    --name myVNet \
    --resource-group TutorialIPv6NATLB-rg
```

Use [az network vnet subnet update](/cli/azure/network/vnet/subnet#az_network_vnet_subnet_update) to add the IPv6 subnet to the virtual network.

```azurecli-interactive
az network vnet subnet update \
    --address-prefixes 10.1.0.0/24 2404:f800:8000:122::/64 \
    --name myBackendSubnet \
    --vnet-name myVNet \
    --resource-group TutorialIPv6NATLB-rg
```
---

## Create dual-stack virtual machine

The network configuration of the virtual machine has IPv4 and IPv6 configurations. Create the virtual machine with an internal IPv4 address. Then add the IPv6 configuration to the network interface of the virtual machine.

# [**Portal**](#tab/dual-stack-outbound-portal)

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **+ Create** then **Azure virtual machine**.

1. In the **Basics** tab of **Create a virtual machine**, enter or select the following information:

    | Setting | Value | 
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **TutorialIPv6NATLB-rg**. |
    | **Instance details** |  |
    | Virtual machine name | Enter **myVM**. |
    | Region | Select **(US) West US 2**. |
    | Availability options | Leave the default of **No infrastructure redundancy required**. |
    | Security type | Leave the default of **Standard**. |
    | Image | Select **Windows Server 2022 Datacenter - x64 Gen2**. |
    | Size | Select a size. |
    | **Administrator account** |  |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Confirm password. |
    | **Inbound port rules** |   |
    | Public inbound ports | Select **None**. |

1. Select the **Networking** tab, or **Next: Disks** then **Next: Networking**.

1. In the **Networking tab**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Network interface** |  |
    | Virtual network | Select **myVNet**. |
    | Subnet | Select **myBackendSubnet (10.1.0.0/24,2404:f800:8000:122::/64)**. |
    | Public IP | Select **None**. |
    | NIC network security group | Select **Basic**. |
    | Public inbound ports | Select **None**. |

1. Select **Review + create**.

1. Select **Create**.

Wait for the virtual machine to finish deploying before continuing on to the next steps.

### Add IPv6 to virtual machine

The support IPv6, the virtual machine must have a IPv6 network configuration added to the network interface. Use the following example to add a IPv6 network configuration to the virtual machine.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **myVM**.

1. In **Settings** select **Networking**.

1. Select the name of the network interface in the **Network Interface:** field. The name of the network interface is the virtual machine name plus a random number. In this example, it's **myVM202**.

1. In the network interface properties, select **IP configurations** in **Settings**.

1. Select **+ Add**.

1. Enter or select the following information in **Add IP configuration**:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **ipv6config**. |
    | IP version | Select **IPv6**. |

1. Leave the rest of the settings at the defaults and select **OK**.

# [**CLI**](#tab/dual-stack-outbound--cli)

### Create NSG

Use [az network nsg create](/cli/azure/network/nsg#az-network-nsg-create) to create a network security group for the virtual machine.

```azurecli-interactive
az network nsg create \
    --name myNSG \
    --resource-group TutorialIPv6NATLB-rg
```

Use [az network nsg rule create](/cli/azure/network/nsg/rule#az-network-nsg-rule-create) to create a rule for RDP connectivity to the virtual machine.

```azurecli-interactive
az network nsg rule create \
    --resource-group TutorialIPv6NATLB-rg \
    --nsg-name myNSG \
    --name myNSGRuleRDP \
    --protocol '*' \
    --direction inbound \
    --source-address-prefix '*' \
    --source-port-range '*' \
    --destination-address-prefix '*' \
    --destination-port-range 3389 \
    --access allow \
    --priority 200
```

### Create network interface

Use [az network nic create](/cli/azure/network/nic#az-network-nic-create) to create the network interface for the virtual machine.

```azurecli-interactive
az network nic create \
    --name myNIC \
    --resource-group TutorialIPv6NATLB-rg \
    --vnet-name myVNet \
    --subnet myBackendSubnet \
    --private-ip-address-version IPv4 
```

### Add IPv6 to network interface

The support IPv6, the virtual machine must have a IPv6 network configuration added to the network interface. IPv6 can't be the primary IP configuration for a virtual machine network interface. For more information, see [Overview of IPv6](../ip-services/ipv6-overview.md).

Use [az network nic ip-config create](/cli/azure/network/nic/ip-config#az_network_nic_ip_config_create) to add the IPv6 configuration to the network interface.

```azurecli-interactive
az network nic ip-config create \
    --name ipconfig-IPv6 \
    --nic-name myNIC \
    --resource-group TutorialIPv6NATLB-rg \
    --vnet-name myVNet \
    --subnet myBackendSubnet \
    --private-ip-address-version IPv6
```

### Create the virtual machine

Use [az vm create](/cli/azure/vm#az-vm-create) to create the virtual machine.

```azurecli-interactive
az vm create \
    --name myVM \
    --resource-group TutorialIPv6NATLB-rg \
    --admin-username azureuser \
    --image Win2022Datacenter \
    --nics myNIC
 ```
---

## Create public load balancer

The public load balancer has a front-end IPv6 address and outbound rule for the backend pool of the load balancer. The outbound rule controls the behavior of the external IPv6 connections for virtual machines in the backend pool. Use the following example to create an IPv6 public load balancer.

# [**Portal**](#tab/dual-stack-outbound-portal)

1. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

1. Select **+ Create**.

1. In the **Basics** tab of **Create load balancer**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **TutorialIPv6NATLB-rg**. |
    | **Instance details** |  |
    | Name | Enter **myLoadBalancer**. |
    | Region | Select **West US 2**. |
    | SKU | Leave the default of **Standard**. |
    | Type | Select **Public**. |

1. Select **Next: Frontend IP configuration**.

1. Select **+ Add a frontend IP configuration**. 

1. Enter or select the following information in **Add frontend IP configuration**:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myFrontend-IPv6**. |
    | IP version | Select **IPv6**. |
    | IP type | Select **IP address**. |
    | Public IP address | Select **Create new**. </br> In **Name** enter **myPublicIP-IPv6**. </br> Select **OK**. |

1. Select **Add**.

1. Select **Next: Backend pools**.

1. Select **+ Add a backend pool**.

1. Enter or select the following information in **Add backend pool**:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myBackendPool**. |
    | Virtual network | Select **myVNet (TutorialIPv6NATLB-rg)**. |
    | Backend Pool Configuration | Leave the default of **NIC**. |

1. Select **Save**.

1. Select **Next: Inbound rules** then **Next: Outbound rules**.

1. Select **Add an outbound rule**.

1. Enter or select the following information in **Add outbound rule**:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **myOutboundRule**. |
    | IP Version | Select **IPv6**. |
    | Frontend IP address | Select **myFrontend-IPv6**. |
    | Protocol | Leave the default of **All**. |
    | Idle timeout (minutes) | Leave the default of **4**. |
    | TCP Reset | Leave the default of **Enabled**. |
    | Backend pool | Select **myBackendPool**. |
    | **Port allocation** |   |
    | Port allocation | Select **Manually choose number of outbound ports**. |
    | **Outbound ports** |  |
    | Choose by | Select **Ports per instance**. |
    | Ports per instance | Enter **20000**. |

1. Select **Add**.

1. Select **Review + create**.

1. Select **Create**.

Wait for the load balancer to finish deploying before proceeding to the next steps.

### Add virtual machine to load balancer

1. In the search box at the top of the portal, enter **Load balancer**. Select **Load balancers** in the search results.

1. Select **myLoadBalancer**.

1. In **Settings** select **Backend pools**.

1. Select **myBackendPool**.

1. In **Virtual network** select **myVNet (TutorialIPv6NATLB-rg)**.

1. In **IP configurations** select **+ Add**.

1. Select the checkbox for **myVM** that corresponds with the **IP configuration** of **ipv6config**. Don't select **ipconfig1**.

1. Select **Add**.

1. Select **Save**. 


# [**CLI**](#tab/dual-stack-outbound--cli)

Use [az network public-ip create](/cli/azure/network/public-ip#az_network_public_ip_create) to create a public IPv6 address for the frontend IP address of the load balancer.

```azurecli-interactive
az network public-ip create \
    --resource-group TutorialIPv6NATLB-rg \
    --name myPublicIP-IPv6 \
    --sku standard \
    --version IPv6 \
    --zone 1 2 3
```

Use [az network lb create](/cli/azure/network/lb#az-network-lb-create) to create the load balancer.

```azurecli-interactive
az network lb create \
    --name myLoadBalancer \
    --resource-group TutorialIPv6NATLB-rg \
    --backend-pool-name myBackendPool \
    --frontend-ip-name myFrontend-IPv6 \
    --location westus2 \
    --public-ip-address myPublicIP-IPv6 \
    --sku Standard
```

Use [az network lb outbound-rule create](/cli/azure/network/lb/outbound-rule#az-network-lb-outbound-rule-create) to create the outbound rule for the backend pool of the load balancer.  The outbound rule enables outbound connectivity for virtual machines in the backend pool of the load balancer.

```azurecli-interactive
az network lb outbound-rule create \
    --address-pool myBackendPool \
    --frontend-ip-configs myFrontend-IPv6 \
    --lb-name myLoadBalancer \
    --name myOutBoundRule \
    --protocol All \
    --resource-group TutorialIPv6NATLB-rg \
    --outbound-ports 20000 \
    --enable-tcp-reset true
```

### Add virtual machine to load balancer

Use [az network nic ip-config address-pool add](/cli/azure/network/nic/ip-config/address-pool#az-network-nic-ip-config-address-pool-add) to add the network interface of the virtual machine to the backend pool of the load balancer.

```azurecli-interactive
az network nic ip-config address-pool add \
    --address-pool myBackendPool \
    --ip-config-name ipconfig-IPv6 \
    --nic-name myNIC \
    --resource-group TutorialIPv6NATLB-rg \
    --lb-name myLoadBalancer
```

---

## Validate outbound connectivity

Connect to the virtual machine with Azure Bastion to verify the IPv4 and IPv6 outbound traffic.

### Obtain IPv4 and IPv6 public IP addresses

Before you can validate outbound connectivity, make not of the IPv4, and IPv6 public IP addresses you created previously. Use the following example to obtain the public IP addresses.

# [**Portal**](#tab/dual-stack-outbound-portal)

1. In the search box at the top of the portal, enter **Public IP address**. Select **Public IP addresses** in the search results.

1. Select **myPublicIP-NAT**.

1. Make note of the address in **IP address**. In this example, it's **20.230.191.5**.

1. Return to **Public IP addresses**.

1. Select **myPublicIP-IPv6**.

1. Make note of the address in **IP address**. In this example, it's **2603:1030:c02:8::14**.


# [**CLI**](#tab/dual-stack-outbound--cli)

Use [az network public-ip show](/cli/azure/network/public-ip#az-network-public-ip-show) to obtain the IPv4 and IPv6 public IP addresses.

### IPv4

```azurecli-interactive
az network public-ip show \
    --resource-group TutorialIPv6NATLB-rg \
    --name myPublicIP-NAT \
    --query ipAddress \
    --output tsv
```

```output
azureuser@Azure:~$ az network public-ip show \
    --resource-group TutorialIPv6NATLB-rg \
    --name myPublicIP-NAT \
    --query ipAddress \
    --output tsv
40.90.217.214
```

### IPv6

```azurecli-interactive
az network public-ip show \
    --resource-group TutorialIPv6NATLB-rg \
    --name myPublicIP-IPv6 \
    --query ipAddress \
    --output tsv
```

```output
azureuser@Azure:~$ az network public-ip show \
    --resource-group TutorialIPv6NATLB-rg \
    --name myPublicIP-IPv6 \
    --query ipAddress \
    --output tsv
2603:1030:c04:3::4d
```

---

Make note of both IP addresses. Use the IPs to verify the outbound connectivity for each stack.

### Test connectivity

# [**Portal**](#tab/dual-stack-outbound-portal)

1. Sign-in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **myVM**.

1. In the **Overview** of **myVM**, select **Connect** then **Bastion**. 

1. Enter the username and password you created when you created the virtual machine.

1. Select **Connect**.

1. On the desktop of **myVM**, open **Microsoft Edge**.

1. To confirm the IPv4 address, enter `http://v4.testmyipv6.com` in the address bar.

1. You should see the IPv4 address displayed. In this example, the IP of **20.230.191.5** is displayed.

    :::image type="content" source="./media/tutorial-dual-stack-outbound-nat-load-balancer/portal-verify-ipv4.png" alt-text="Screenshot of outbound IPv4 public IP address from portal steps.":::

1. In the address bar, enter `http://v6.testmyipv6.com`

1. You should see the IPv6 address displayed. In this example, the IP of **2603:1030:c02:8::14** is displayed.

    :::image type="content" source="./media/tutorial-dual-stack-outbound-nat-load-balancer/portal-verify-ipv6.png" alt-text="Screenshot of outbound IPv6 public IP address from portal steps.":::

1. Close the bastion connection to **myVM**.


# [**CLI**](#tab/dual-stack-outbound--cli)

1. Sign-in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **myVM**.

1. In the **Overview** of **myVM**, select **Connect** then **Bastion**. 

1. Enter the username and password you created when you created the virtual machine.

1. Select **Connect**.

1. On the desktop of **myVM**, open **Microsoft Edge**.

1. To confirm the IPv4 address, enter `http://v4.testmyipv6.com` in the address bar.

1. You should see the IPv4 address displayed. In this example, the IP of **40.90.217.214** displayed.

    :::image type="content" source="./media/tutorial-dual-stack-outbound-nat-load-balancer/cli-verify-ipv4.png" alt-text="Screenshot of outbound IPv4 public IP address from CLI steps.":::

1. In the address bar, enter `http://v6.testmyipv6.com`

1. You should see the IPv6 address displayed. In this example, the IP of **2603:1030:c04:3::4d**  is displayed.

    :::image type="content" source="./media/tutorial-dual-stack-outbound-nat-load-balancer/cli-verify-ipv6.png" alt-text="Screenshot of outbound IPv6 public IP address from CLI steps.":::

1. Close the bastion connection to **myVM**.

---
## Clean up resources

When your finished with the resources created in this article, delete the resource group and all of the resources it contains.

# [**Portal**](#tab/dual-stack-outbound-portal)

1. In the search box at the top of the portal, enter **TutorialIPv6NATLB-rg**. Select **TutorialIPv6NATLB-rg** in the search results in **Resource groups**.

1. Select **Delete resource group**.

1. Enter **TutorialIPv6NATLB-rg** for **TYPE THE RESOURCE GROUP NAME** and select **Delete**.

# [**CLI**](#tab/dual-stack-outbound--cli)

Use [az group delete](/cli/azure/group#az-group-delete) to delete the resource group and the resources it contains.

```azurecli-interactive
az group delete \
    --name TutorialIPv6NATLB-rg
```

---

## Next steps

Advance to the next article to learn how to:
> [!div class="nextstepaction"]
> [Integrate NAT gateway in a hub and spoke network](tutorial-hub-spoke-route-nat.md)
