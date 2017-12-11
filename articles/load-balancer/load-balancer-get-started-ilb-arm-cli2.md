---
title: Create an Internal load balancer - Azure CLI 2.0 | Microsoft Docs
description: Learn how to create an internal load balancer by using the Azure CLI 2.0
services: load-balancer
documentationcenter: na
author: BrHarr
manager: TomDefeo
tags: azure-resource-manager

ms.assetid: c7a24e92-b4da-43c0-90f2-841c1b7ce489
ms.service: load-balancer
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/25/2017
ms.author: brharr
---

# Create an internal load balancer by using the Azure CLI

> [!div class="op_single_selector"]
> * [Azure Portal](../load-balancer/load-balancer-get-started-ilb-arm-portal.md)
> * [PowerShell](../load-balancer/load-balancer-get-started-ilb-arm-ps.md)
> * [Azure CLI](../load-balancer/load-balancer-get-started-ilb-arm-cli.md)
> * [Azure CLI 2.0](../load-balancer/load-balancer-get-started-ilb-arm-cli2.md)
> * [Template](../load-balancer/load-balancer-get-started-ilb-arm-template.md)

[!INCLUDE [load-balancer-basic-sku-include.md](../../includes/load-balancer-basic-sku-include.md)]

[!INCLUDE [load-balancer-get-started-ilb-intro-include.md](../../includes/load-balancer-get-started-ilb-intro-include.md)]

[!INCLUDE [load-balancer-get-started-ilb-scenario-include.md](../../includes/load-balancer-get-started-ilb-scenario-include.md)]

## Deploy the solution by using the Azure CLI

The following steps show how to create an Internal-facing load balancer by using Azure Resource Manager with CLI 2.0. With Azure Resource Manager, each resource is created and configured individually, and then put together to create a resource.

You need to create and configure the following objects to deploy a load balancer:

* **Front-end IP configuration**: contains private IP addresses for incoming network traffic
* **Back-end address pool**: contains network interfaces (NICs) that enable the virtual machines to receive network traffic from the load balancer
* **Load-balancing rules**: contains rules that map a public port on the load balancer to port in the back-end address pool
* **Inbound NAT rules**: contains rules that map a public port on the load balancer to a port for a specific virtual machine in the back-end address pool
* **Probes**: contains health probes that are used to check the availability of virtual machines instances in the back-end address pool

For more information, see [Azure Resource Manager support for Load Balancer](load-balancer-arm.md).

## Set up and Install the Azure CLI

1. If you have never used Azure CLI, see [Install and configure the Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest). Follow the instructions up to the point where you select your Azure account and subscription.

## Create an internal load balancer step by step

1. Sign in to Azure.

    ```azurecli
    az login
    ```

2. Enter the code provided into [https://aka.ms/devicelogin](https://aka.ms/devicelogin) to authenticate


## Create a resource group

All resources in Azure Resource Manager are associated with a resource group. If you haven't done so yet, create a resource group.

```azurecli
az group create --name <resource group name> --location <location>
```

## Create an internal load balancer set

1. Create an internal load balancer

    In the following scenario, a resource group named nrprg has already been created in East US region. All resources for internal load balancers, such as virtual networks and virtual network subnets, must be in the same resource group and in the same region.

    The IP address that you use must be within the subnet range of your virtual network.

    ```azurecli
    az network lb create --resource-group nrprg --name ilbset --location eastus --vnet-name nrpvnet
    --subnet nrpvnetsubnet --private-ip-address 10.0.0.7 --frontend-ip-name feilb --backend-pool-name beilb
    ```
   > [!NOTE]
   > Azure CLI requires that an Internal LB be created with a FrontEnd-IP Configuration and BackEnd-Pool all at 
   > the same time because the default create command will deploy a Public Facing LB.
    
    After you define a front-end IP address and a back-end address pool, you can create load balancer rules, inbound NAT rules, and customized health probes.

2. Create a load balancer rule for the internal load balancer.

    When you follow the next step, the command creates a load-balancer rule for listening to port 1433 in the front-end pool and sending load-balanced network traffic to the back-end address pool, also using port 1433.

    ```azurecli
    az network lb rule create --resource-group nrprg --lb-name ilbset --name ilbrule --protocol tcp --frontend-port 1433 --backend-port 1433 --frontend-ip-name feilb --backend-pool-name beilb
    ```

3. Create inbound NAT rules.

    Inbound NAT rules are used to create endpoints in a load balancer that go to a specific virtual machine instance. The previous steps created two NAT rules  for remote desktop.

    ```azurecli
    az network lb inbound-nat-rule create --resource-group nrprg --lb-name ilbset --name RDPrule1 --protocol tcp --frontend-port 5432 --backend-port 3389

    az network lb inbound-nat-rule create --resource-group nrprg --lb-name ilbset --name RDPrule2 --protocol tcp --frontend-port 5433 --backend-port 3389
    ```

4. Create health probes for the load balancer.

    A health probe checks all virtual machine instances to make sure they can send network traffic. The virtual machine instance with failed probe checks is removed from the load balancer until it goes back online and a probe check determines that it's healthy.

    ```azurecli
    az network lb probe create --resource-group nrprg --lb-name ilbset --name ilbprobe --protocol tcp --interval 300 --port 3389 --threshold 5
    ```

    > [!NOTE]
    > The Microsoft Azure platform uses a static, publicly routable IPv4 address for a variety of administrative scenarios. The IP address is 168.63.129.16. This IP address should not be blocked by any firewalls, because this can cause unexpected behavior.
    > With respect to Azure internal load balancing, this IP address is used by monitoring probes from the load balancer to determine the health state for virtual machines in a load-balanced set. If a network security group is used to restrict traffic to Azure virtual machines in an internally load-balanced set or is applied to a virtual network subnet, ensure that a network security rule is added to allow traffic from 168.63.129.16.

## Create NICs

You need to create NICs (or modify existing ones) and associate them to NAT rules, load balancer rules, and probes.

1. Create an NIC named *lb-nic1-be*, and then associate it with the *RDPRule1* NAT rule and the *beilb* back-end address pool.

    ```azurecli
    az network nic create --resource-group nrprg --name lb-nic1-be --subnet nrpvnetsubnet --vnet-name nrpvnet --lb-address-pools "/subscriptions/####################################/resourceGroups/nrprg/providers/Microsoft.Network/loadBalancers/nrplb/backendAddressPools/beilb" --lb-inbound-nat-rules "/subscriptions/####################################/resourceGroups/nrprg/providers/Microsoft.Network/loadBalancers/nrplb/inboundNatRules/rdp1" --location eastus
    ```

    Expected output:

        info:    Executing command network nic create
        + Looking up the network interface "lb-nic1-be"
        + Looking up the subnet "nrpvnetsubnet"
        + Creating network interface "lb-nic1-be"
        + Looking up the network interface "lb-nic1-be"
        data:    Id                              : /subscriptions/####################################/resourceGroups/nrprg/providers/Microsoft.Network/networkInterfaces/lb-nic1-be
        data:    Name                            : lb-nic1-be
        data:    Type                            : Microsoft.Network/networkInterfaces
        data:    Location                        : eastus
        data:    Provisioning state              : Succeeded
        data:    Enable IP forwarding            : false
        data:    IP configurations:
        data:      Name                          : NIC-config
        data:      Provisioning state            : Succeeded
        data:      Private IP address            : 10.0.0.4
        data:      Private IP Allocation Method  : Dynamic
        data:      Subnet                        : /subscriptions/####################################/resourceGroups/NRPRG/providers/Microsoft.Network/virtualNetworks/NRPVnet/subnets/NRPVnetSubnet
        data:      Load balancer backend address pools
        data:        Id                          : /subscriptions/####################################/resourceGroups/nrprg/providers/Microsoft.Network/loadBalancers/nrplb/backendAddressPools/beilb
        data:      Load balancer inbound NAT rules:
        data:        Id                          : /subscriptions/####################################/resourceGroups/nrprg/providers/Microsoft.Network/loadBalancers/nrplb/inboundNatRules/RDPRule1
        data:
        info:    network nic create command OK

2. Create an NIC named *lb-nic2-be*, and then associate it with the *RDPRule2* NAT rule and the *beilb* back-end address pool.

    ```azurecli
    az network nic create --resource-group nrprg --name lb-nic2-be --subnet nrpvnetsubnet --vnet-name nrpvnet --lb-address-pools "/subscriptions/####################################/resourceGroups/nrprg/providers/Microsoft.Network/loadBalancers/nrplb/backendAddressPools/beilb" --lb-inbound-nat-rules "/subscriptions/####################################/resourceGroups/nrprg/providers/Microsoft.Network/loadBalancers/nrplb/inboundNatRules/RDPRule2" --location eastus
    ```

3. Create a virtual machine named *DB1*, and then associate it with the NIC named *lb-nic1-be*. As is recommended, this VM is automatically created using managed disks.

    ```azurecli
    az vm create --resource-group nrprg --name DB1 --location eastus --nics lb-nic1-be --availability-set nrp-avset --admin-username rootadmin --generate-ssh-keys --image UbuntuLTS
    ```
    > [!IMPORTANT]
    > VMs in a load balancer need to be in the same availability set. Use `az vm availability-set create` to create an availability set.
    > [!NOTE]
    > When you specify a NIC card within the a VM Create command, you are not required to also pass in the 
    > VNet and corresponding Subnet as you are in other commands specified above. 

4. Create a virtual machine (VM) named *DB2*, and then associate it with the NIC named *lb-nic2-be*. As is recommended, this VM is automatically created using managed disks.

    ```azurecli
    az vm create --resource-group nrprg --name DB2 --location eastus --nic-name lb-nic2-be --availability-set nrp-avset --admin-username rootadmin --generate-ssh-keys --image UbuntuLTS
    ```

## Delete a load balancer

To remove a load balancer, use the following command:

```azurecli
az network lb delete --resource-group nrprg --name ilbset
```

## Next steps

[Configure a load balancer distribution mode by using source IP affinity](load-balancer-distribution-mode.md)

[Configure idle TCP timeout settings for your load balancer](load-balancer-tcp-idle-timeout.md)

