---
title: Configure Inbound NAT Rules for Virtual Machine Scale Sets
description: Learn how to configure, update, and delete inbound NAT Rules for Virtual Machine Scale Set instances. Azure offers two options for Inbound NAT rules.
author: mbender-ms
ms.author: mbender
ms.service: load-balancer
ms.topic: how-to 
ms.date: 12/06/2022
ms.custom: template-how-to 
---

# Configure Inbound NAT Rules for Virtual Machine Scale Sets

In this article you'll learn how to configure, update, and delete inbound NAT Rules for Virtual Machine Scale Set instances. Azure offers two options for Inbound NAT rules. The first option is the ability to add a single inbound NAT rule to a single backend resource. The second option is the ability to create a group of inbound NAT rules for a backend pool. Additional information on the various options is provided [here](inbound-nat-rules.md). It's recommended to use the second option for inbound NAT rules when using Virtual Machine Scale Sets, since this option provides better flexibility and scalability.  

[Add your introductory paragraph]

<!-- 3. Prerequisites 
Optional. If you need prerequisites, make them your first H2 in a how-to guide. 
Use clear and unambiguous language and use a list format.
-->

## Prerequisites

- A running instance of [Azure Load Balancer](quickstart-load-balancer-standard-public-portal.md).
- A [Virtual Machine Scale Set instance](configure-vm-scale-set-portal.md) in the backend pool of the running load balancer.

## Set up a load balancer for scaling out Virtual Machine Scale Sets 
Make sure that your instance of  is running and that the   

## Add inbound NAT rules 
Individual inbound NAT rules can't be added to a Virtual Machine Scale Set. However, you can add a set of inbound NAT rules with a defined front-end port range and back-end port for all instances in the Virtual Machine Scale Set. 

To add a whole set of inbound NAT rules for the Virtual Machine Scale Sets, first create an inbound NAT rule in the load balancer that targets a backend pool.  

The new inbound NAT rule shouldn't have an overlapping front-end port range with existing inbound NAT rules. To view existing inbound NAT rules that are set up, use this [CLI command](/cli/azure/network/lb/inbound-nat-rule?view=azure-cli-latest):

```azurecli

 az network lb inbound-nat-rule create
    -g MyResourceGroup
    --lb-name MyLb
    -n MyNatRule
    --protocol TCP
    --frontend-port-range-start 200
    --frontend-port-range-end 250
    --backend-port 22
    --backend-pool-name mybackend
    --frontend-ip-name MyFrontendIp 

```

## Update inbound NAT rules 
When using inbound NAT rules with Virtual Machine Scale Sets, Individual inbound NAT rules can't be updated. However, you can update a set of inbound NAT rules that target a backend pool. 

az network lb inbound-nat-rule update
    -g MyResourceGroup
    --lb-name MyLb
    -n MyNatPool
    --frontend-port-range-start 150
    --frontend-port-range-end 250 

## Delete inbound NAT rules 

When using inbound NAT rules with Virtual Machine Scale Sets, Individual inbound NAT rules can't be deleted. However, you can delete the entire set of inbound NAT rules by deleting the inbound NAT rule that targets a specific backend pool. 

```azurecli

az network lb inbound-nat-rule delete -g MyResourceGroup --lb-name MyLb -n MyNatRule 

```

## Multiple Inbound NAT rules behind a Virtual Machine Scale Set 

Multiple inbound NAT rules can be attached to a single Virtual Machine Scale Set, given that the rules frontend port ranges aren’t overlapping. This is accomplished by having multiple inbound NAT rules that target the same backend pool. A full example using the CLI is shown. 

```azurecli
az network lb inbound-nat-rule create
    -g MyResourceGroup
    --lb-name MyLb
    -n MyNatRule
    --protocol TCP
    --frontend-port-range-start 200
    --frontend-port-range-end 250
    --backend-port 22
    --backend-pool-name mybackend
    --frontend-ip-name MyFrontendIp 

az network lb inbound-nat-rule create  
        -g MyResourceGroup  
        --lb-name MyLb 
        -n MyNatRule2 
        --protocol TCP  
        --frontend-port-range-start 150  
        --frontend-port-range-end 180  
        --backend-port 80 
        --backend-pool-name mybackend  
        --frontend-ip-name MyFrontendIp 

```


## Next steps
To learn more about Azure Load Balancer and Virtual Machine Scale Sets, read more about the concepts. 

Learn to use [Azure Load Balancer with Virtual Machine Scale Sets](load-balancer-standard-virtual-machine-scale-sets.md).
