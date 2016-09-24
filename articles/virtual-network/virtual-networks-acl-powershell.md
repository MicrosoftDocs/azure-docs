<properties
   pageTitle="How to manage Access Control Lists (ACLs) for Endpoints by using PowerShell"
   description="Learn how to manage ACLs with PowerShell"
   services="virtual-network"
   documentationCenter="na"
   authors="jimdial"
   manager="carmonm"
   editor="tysonn" />
<tags
   ms.service="virtual-network"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="03/15/2016"
   ms.author="jdial" />

# How to manage Access Control Lists (ACLs) for Endpoints by using PowerShell

You can create and manage Network Access Control Lists (ACLs) for endpoints by using Azure PowerShell or in the Management Portal. In this topic, you'll find procedures for ACL common tasks that you can complete using PowerShell. For the list of Azure PowerShell cmdlets see [Azure Management Cmdlets](http://go.microsoft.com/fwlink/?LinkId=317721). For more information about ACLs, see [What is a Network Access Control List (ACL)?](virtual-networks-acl.md). If you want to manage your ACLs by using the Management Portal, see [How to Set Up Endpoints to a Virtual Machine](../virtual-machines/virtual-machines-windows-classic-setup-endpoints.md).

## Manage Network ACLs by using Azure PowerShell

You can use Azure PowerShell cmdlets to create, remove, and configure (set) Network Access Control Lists (ACLs). We've included a few examples of some of the ways you can configure an ACL using PowerShell.

To retrieve a complete list of the ACL PowerShell cmdlets, you can use either of the following:

	Get-Help *AzureACL*
	Get-Command -Noun AzureACLConfig

### Create a Network ACL with rules that permit access from a remote subnet

The example below illustrates a way to create a new ACL that contains rules. This ACL is then applied to a virtual machine endpoint. The ACL rules in the example below will allow access from a remote subnet. To create a new Network ACL with permit rules for a remote subnet, open an Azure PowerShell ISE. Copy and paste the script below, configuring the script with your own values, and then run the script.

1. Create the new network ACL object.

		$acl1 = New-AzureAclConfig

1. Set a rule that permits access from a remote subnet. In the example below, you set rule *100* (which has priority over rule 200 and higher) to allow the remote subnet *10.0.0.0/8* access to the virtual machine endpoint. Replace the values with your own configuration requirements. The name "SharePoint ACL config" should be replaced with the friendly name that you want to call this rule.

		Set-AzureAclConfig –AddRule –ACL $acl1 –Order 100 `
			–Action permit –RemoteSubnet "10.0.0.0/8" `
			–Description "SharePoint ACL config"

1. For additional rules, repeat the cmdlet, replacing the values with your own configuration requirements. Be sure to change the rule number Order to reflect the order in which you want the rules to be applied. The lower rule number takes precedence over the higher number.

		Set-AzureAclConfig –AddRule –ACL $acl1 –Order 200 `
			–Action permit –RemoteSubnet "157.0.0.0/8" `
			–Description "web frontend ACL config"

1. Next, you can either create a new endpoint (Add) or set the ACL for an existing endpoint (Set). In this example, we will add a new virtual machine endpoint called "web" and update the virtual machine endpoint with the ACL settings.

		Get-AzureVM –ServiceName $serviceName –Name $vmName `
		| Add-AzureEndpoint –Name "web" –Protocol tcp –Localport 80 - PublicPort 80 –ACL $acl1 `
		| Update-AzureVM

1. Next, combine the cmdlets and run the script. For this example, the combined cmdlets would look like this:

		$acl1 = New-AzureAclConfig
		Set-AzureAclConfig –AddRule –ACL $acl1 –Order 100 `
			–Action permit –RemoteSubnet "10.0.0.0/8" `
			–Description "Sharepoint ACL config"
		Set-AzureAclConfig –AddRule –ACL $acl1 –Order 200 `
			–Action permit –RemoteSubnet "157.0.0.0/8" `
			–Description "web frontend ACL config"
		Get-AzureVM –ServiceName $serviceName –Name $vmName `
		|Add-AzureEndpoint –Name "web" –Protocol tcp –Localport 80 - PublicPort 80 –ACL $acl1 `
		|Update-AzureVM

### Remove a Network ACL rule that permits access from a remote subnet

The example below illustrates a way to remove a network ACL rule.  To remove a Network ACL rule with permit rules for a remote subnet, open an Azure PowerShell ISE. Copy and paste the script below, configuring the script with your own values, and then run the script.

1. First step is to get the Network ACL object for the virtual machine endpoint. You'll then remove the ACL rule. In this case, we are removing it by rule ID. This will only remove the rule ID 0 from the ACL. It does not remove the ACL object from the virtual machine endpoint.

		Get-AzureVM –ServiceName $serviceName –Name $vmName `
		| Get-AzureAclConfig –EndpointName "web" `
		| Set-AzureAclConfig –RemoveRule –ID 0 –ACL $acl1

1. Next, you must apply the Network ACL object to the virtual machine endpoint and update the virtual machine.

		Get-AzureVM –ServiceName $serviceName –Name $vmName `
		| Set-AzureEndpoint –ACL $acl1 –Name "web" `
		| Update-AzureVM

### Remove a Network ACL from a virtual machine endpoint

In certain scenarios, you might want to remove a Network ACL object from a virtual machine endpoint. To do that, open an Azure PowerShell ISE. Copy and paste the script below, configuring the script with your own values, and then run the script.

		Get-AzureVM –ServiceName $serviceName –Name $vmName `
		| Remove-AzureAclConfig –EndpointName "web" `
		| Update-AzureVM

## Next steps

[What is a Network Access Control List (ACL)?](virtual-networks-acl.md)
