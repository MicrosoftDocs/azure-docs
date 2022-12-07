---
title: Configure Inbound NAT Rules for Virtual Machine Scale Sets
description: #Required; article description that is displayed in search results. 
author: #Required; your GitHub user alias, with correct capitalization.
ms.author: #Required; microsoft alias of author; optional team alias.
ms.service: #Required; service per approved list. slug assigned by ACOM.
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: #Required; mm/dd/yyyy format.
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->

<!--
This template provides the basic structure of a how-to article.
See the [how-to guidance](contribute-how-to-write-howto.md) in the contributor guide.

To provide feedback on this template contact 
[the templates workgroup](mailto:templateswg@microsoft.com).
-->

<!-- 1. H1
Required. Start your H1 with a verb. Pick an H1 that clearly conveys the task the 
user will complete.
-->

# Configure Inbound NAT Rules for Virtual Machine Scale Sets

In this article you will learn how to configure, update, and delete inbound NAT Rules for virtual machine scale set instances. Azure offers two options for Inbound NAT rules. The first option is the ability to add a single inbound NAT rule to a single backend resource. The second option is the ability to create a group of inbound NAT rules for a backend pool. Additional information on the various options is provided [here](inbound-nat-rules.md). It is recommended to use the second option for inbound NAT rules when using virtual machine scale sets, since this option provides better flexibility and scalability.  

[Add your introductory paragraph]

<!-- 3. Prerequisites 
Optional. If you need prerequisites, make them your first H2 in a how-to guide. 
Use clear and unambiguous language and use a list format.
-->

## Prerequisites

- <!-- prerequisite 1 -->
- <!-- prerequisite 2 -->
- <!-- prerequisite n -->
<!-- remove this section if prerequisites are not needed -->

<!-- 4. H2s 
Required. A how-to article explains how to do a task. The bulk of each H2 should be 
a procedure.
-->

## Set up a load balancer for scaling out virtual machine scale sets 
Make sure that your instance of [Azure Load Balancer](quickstart-load-balancer-standard-public-portal.md) is running and that the [virtual machine scale set instance](configure-vm-scale-set-portal.md) is put in the backend pool of the load balancer.  

## Add inbound NAT rules 
Individual inbound NAT rules can't be added to a virtual machine scale set. However, you can add a set of inbound NAT rules with a defined front-end port range and back-end port for all instances in the virtual machine scale set. 

To add a whole set of inbound NAT rules for the virtual machine scale sets, first create an inbound NAT rule in the load balancer that targets a backend pool.  

The new inbound NAT rule should not have an overlapping front-end port range with existing inbound NAT rules. To view existing inbound NAT rules that are set up, use this [CLI command](/cli/azure/network/lb/inbound-nat-rule?view=azure-cli-latest):

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
When using inbound NAT rules with virtual machine scale sets, Individual inbound NAT rules can't be updated. However, you can update a set of inbound NAT rules that target a backend pool. 

az network lb inbound-nat-rule update  
        -g MyResourceGroup  
        --lb-name MyLb  
        -n MyNatPool 
        --frontend-port-range-start 150 
        --frontend-port-range-end 250 

## Delete inbound NAT rules 

When using inbound NAT rules with virtual machine scale sets, Individual inbound NAT rules can't be deleted. However, you can delete the entire set of inbound NAT rules by deleting the inbound NAT rule that targets a specific backend pool. 

```azurecli

az network lb inbound-nat-rule delete -g MyResourceGroup --lb-name MyLb -n MyNatRule 

```

## Multiple Inbound NAT rules behind a Virtual Machine Scale Set 

Multiple inbound NAT rules can be attached to a single virtual machine scale set, given that the rules frontend port ranges aren’t overlapping. This is accomplished by having multiple inbound NAT rules that target the same backend pool. A full example using the CLI is shown. 

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
To learn more about Azure Load Balancer and virtual machine scale sets, read more about the concepts. 

Learn to use [Azure Load Balancer with Virtual Machine Scale Sets](load-balancer-standard-virtual-machine-scale-sets.md).
