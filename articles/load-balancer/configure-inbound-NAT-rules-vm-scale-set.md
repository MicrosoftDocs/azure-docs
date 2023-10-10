---
title: Configure Inbound NAT Rules for Virtual Machine Scale Sets
description: Learn how to configure, update, and delete inbound NAT Rules for Virtual Machine Scale Set instances. Azure offers two options for Inbound NAT rules.
author: mbender-ms
ms.author: mbender
ms.service: load-balancer
ms.topic: how-to 
ms.date: 12/06/2022
ms.custom: template-how-to, devx-track-azurecli
---

# Configure inbound NAT Rules for Virtual Machine Scale Sets

In this article, you'll learn how to configure, update, and delete inbound NAT Rules for Virtual Machine Scale Set instances. Azure offers two options for inbound NAT rules. The first option is the ability to add a single inbound NAT rule to a single backend resource. The second option is the ability to create a group of inbound NAT rules for a backend pool. It's recommended to use the second option for inbound NAT rules when using Virtual Machine Scale Sets, since this option provides better flexibility and scalability. Learn more about the various options for [inbound NAT rules](inbound-nat-rules.md). 

## Prerequisites

- A Standard SKU [Azure Load Balancer](quickstart-load-balancer-standard-public-portal.md) in the same subscription as the Virtual Machine Scale Set.
- A [Virtual Machine Scale Set instance](configure-vm-scale-set-portal.md) in the backend pool of the load balancer.
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Add inbound NAT rules 
Individual inbound NAT rules can't be added to a Virtual Machine Scale Set. However, you can add a set of inbound NAT rules with a defined front-end port range and back-end port for all instances in the Virtual Machine Scale Set. 

To add a set of inbound NAT rules for the Virtual Machine Scale Sets, you create a set of inbound NAT rules in the load balancer that targets a backend pool using [az network lb inbound-nat-rule create](/cli/azure/network/lb/inbound-nat-rule#az-network-lb-inbound-nat-rule-create) as follows:

```azurecli

 az network lb inbound-nat-rule create \
    --resource-group MyResourceGroup \
    --name MyNatRule \
    --lb-name MyLb \
    --protocol TCP \
    --frontend-port-range-start 200 \
    --frontend-port-range-end 250 \
    --backend-port 22 \
    --backend-pool-name mybackend \
    --frontend-ip-name MyFrontendIp

```

The new inbound NAT rule can't have an overlapping front-end port range with existing inbound NAT rules. To view existing inbound NAT rules that are set up, use [az network lb inbound-nat-rule show](/cli/azure/network/lb/inbound-nat-rule#az-network-lb-inbound-nat-rule-show) as follows:

```azurecli

az network lb inbound-nat-rule show \
    --lb-name <load-balancer-name> \
    --name <nat-rule-name> \
    --resource-group <resource-group-name>

```
## Add multiple inbound NAT rules behind a Virtual Machine Scale Set 

Multiple sets of inbound NAT rules can be attached to a single Virtual Machine Scale Set, given that the rules frontend port ranges aren’t overlapping. This is accomplished by having multiple sets of inbound NAT rules that target the same backend pool as follows:

```azurecli
az network lb inbound-nat-rule create \
    --resource-group MyResourceGroup \
    --name MyNatRule \
    --lb-name MyLb \
    --protocol TCP \
    --frontend-port-range-start 200 \
    --frontend-port-range-end 250 \
    --backend-port 22 \
    --backend-pool-name mybackend \
    --frontend-ip-name MyFrontendIp 

az network lb inbound-nat-rule create \
    --resource-group MyResourceGroup \
    --name MyNatRule2 \
    --lb-name MyLb \
    --protocol TCP \
    --frontend-port-range-start 150 \
    --frontend-port-range-end 180 \
    --backend-port 80 \
    --backend-pool-name mybackend \
    --frontend-ip-name MyFrontendIp 

```
## Update inbound NAT rules 
When using inbound NAT rules with Virtual Machine Scale Sets, Individual inbound NAT rules can't be updated. However, you can update a set of inbound NAT rules that target a backend pool using [az network lb inbound-nat-rule update](/cli/azure/network/lb/inbound-nat-rule#az-network-lb-inbound-nat-rule-update) as follows:

```azurecli

az network lb inbound-nat-rule update \
    --resource-group MyResourceGroup \
    --name MyNatRule \
    --lb-name MyLb \
    --frontend-port-range-start 150 \
    --frontend-port-range-end 250 

```
## Delete inbound NAT rules 

When using inbound NAT rules with Virtual Machine Scale Sets, individual inbound NAT rules can't be deleted. However, you can delete the entire set of inbound NAT rules by deleting the inbound NAT rule that targets a specific backend pool. Use [az network lb inbound-nat-rule delete](/cli/azure/network/lb/inbound-nat-rule#az-network-lb-inbound-nat-rule-delete) to delete a set of rules:

```azurecli

az network lb inbound-nat-rule delete --resourcegroup MyResourceGroup --name MyNatRule --lb-name MyLb 

```

## Next steps
To learn more about Azure Load Balancer and Virtual Machine Scale Sets, read more about the concepts. 

Learn to use [Azure Load Balancer with Virtual Machine Scale Sets](load-balancer-standard-virtual-machine-scale-sets.md).
