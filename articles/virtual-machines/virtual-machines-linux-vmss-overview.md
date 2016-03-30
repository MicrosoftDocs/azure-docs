<properties
	pageTitle="What Are VM Scale Sets? | Microsoft Azure"
	description="Learn about VM Scale Sets."
	keywords="linux virtual machine,virtual machine scale sets" 
	services="virtual-machine-linux"
	documentationCenter=""
	authors="gatneil"
	manager="madhana"
	editor="tysonn"
	tags="azure-resource-manager" />

<tags
	ms.service="virtual-machine-linux"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/24/2016"
	ms.author="gatneil"/>

# What Are Virtual Machine Scale Sets?

Virtual Machine Scale Sets (VMSSes) allow you to manage multiple VMs as a set. At a high level, VMSSes have the following pros and cons:

Pros:

1. High availability. Each VMSS puts its VMs into an Availability Set with 5 Fault Domains (FDs) and 5 Update Domains (UDs) to ensure availability (for more information on FDs and UDs, see [VM availability](virtual-machines-linux-manage-availability.md)).
2. Easy integration with Azure Load Balancer and App Gateway.
3. Easy integration with Azure Autoscale.
4. Simplified deployment, management, and clean up of VMs.
5. Support common Windows and Linux flavors, as well as custom images.

Cons:

1. Cannot attach data disks to VM instances in a VMSS. Instead, must use Blob Storage, Azure Files, Azure Tables, or other storage solution.

## Quick-Create Using Azure CLI

If you haven't already, you can get an [Azure subscription free trial](https://azure.microsoft.com/pricing/free-trial/) and the [Azure CLI](../xplat-cli-install.md) [connected to your Azure account](../xplat-cli-connect.md). Once you do, you can run the following commands to quick-create a VMSS:

```bash
# make sure we are in ARM mode (https://azure.microsoft.com/documentation/articles/resource-manager-deployment-model/)
azure config mode arm

# quick-create a VMSS
#
# generic syntax:
# azure vmss quick-create -n VMSS-NAME -g RESOURCE-GROUP-NAME -l LOCATION -u USERNAME -p PASSWORD -C INSTANCE-COUNT -Q IMAGE-URN
#
# example:
azure vmss quick-create -n negatvmss -g negatvmssrg -l westus -u negat -p P4$$w0rd -C 5 -Q Canonical:UbuntuServer:14.04.4-LTS:latest
```

If you want to customize the location or image-urn, please look into the commands `azure location list` and `azure vm image {list-publishers|list-offers|list-skus|list|show}`.

Once this command has returned, the VMSS will have been created. This VMSS will have a load balancer (LB) with NAT rules mapping port 50,000+i on the LB to port 22 on VM i. Thus, once we figure out the FQDN of the load balancer, we will be able to ssh into our VMs:

```bash
# list load balancers in the resource group we created
#
# generic syntax:
# azure network lb list -g RESOURCE-GROUP-NAME
#
# example with some quick-and-dirty grep-fu to store the result in a variable:
line=$(azure network lb list -g nsgvmsrg | grep nsgvmssrg)
split_line=( $line )
lb_name=${split_line[1]}

# now that we have the name of the load balancer, we can show the details to find which Public IP (PIP) is associated to it
#
# generic syntax:
# azure network lb show -g RESOURCE-GROUP-NAME -n LB-NAME
#
# example with some quick-and-dirty grep-fu to store the result in a variable:
line=$(azure network lb show -g nsgvmssrg -n $lb_name | grep loadBalancerFrontEnd)
split_line=( $line )
pip_name=${split_line[4]}

# now that we have the name of the public IP address, we can show the details to find the FQDN
#
# generic syntax:
# azure network public-ip show -g RESOURCE-GROUP-NAME -n PIP-NAME
#
# example with some quick-and-dirty grep-fu to store the result in a variable:
line=$(azure network public-ip show -g nsgvmssrg -n $pip_name | grep FQDN)
split_line=( $line )
FQDN=${split_line[3]}

# now that we have the FQDN, we can ssh on port 50,000+i to ssh into VM i (where i is 0-indexed)
#
# example to ssh into VM "0":
ssh -p 50000 $FQDN
```

## Next Steps

For general information, check out the [main landing page for VMSSes](https://azure.microsoft.com/services/virtual-machine-scale-sets/).

For documentation, check out the [main documentation page for VMSSes](https://azure.microsoft.com/documentation/services/virtual-machines-scale-sets/).

For example ARM templates using VMSSes, search for "vmss" in the [Azure Quickstart Templates github repo](https://github.com/Azure/azure-quickstart-templates).
