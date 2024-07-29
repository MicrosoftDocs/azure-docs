---
title: Connect a Cloud Service (classic) to a custom Domain Controller | Microsoft Docs
description: Learn how to connect your web/worker roles to a custom AD Domain using PowerShell and AD Domain Extension
ms.topic: article
ms.service: cloud-services
ms.date: 07/23/2024
author: hirenshah1
ms.author: hirshah
ms.reviewer: mimckitt
ms.custom: compute-evergreen
---

# Connecting Azure Cloud Services (classic) Roles to a custom AD Domain Controller hosted in Azure

[!INCLUDE [Cloud Services (classic) deprecation announcement](includes/deprecation-announcement.md)]

We first set up a virtual network in Azure. We then add an Active Directory Domain Controller (hosted on an Azure Virtual Machine) to the virtual network. Next, we add existing cloud service roles to the precreated virtual network, then connect them to the Domain Controller.

Before we get started, couple of things to keep in mind:

1. This tutorial uses PowerShell, so make sure you have Azure PowerShell installed and ready to go. To get help with setting up Azure PowerShell, see [How to install and configure Azure PowerShell](/powershell/azure/).
2. Your AD Domain Controller and Web/Worker Role instances need to be in the virtual network.

Follow this step-by-step guide and if you run into any issues, leave us a comment at the end of the article.

The network that is referenced by the cloud service must be a **classic virtual network**.

## Create a virtual network
You can create a virtual network in Azure using the Azure portal or PowerShell. For this tutorial, PowerShell is used. To create a virtual network using the Azure portal, see [Create a virtual network](../virtual-network/quick-create-portal.md). The article covers creating a virtual network (Resource Manager), but you must create a virtual network (Classic) for cloud services. To do so, in the portal, select **Create a resource**, type *virtual network* in the **Search** box, and then press **Enter**. In the search results, under **Everything**, select **virtual network**. Under **Select a deployment model**, select **Classic**, then select **Create**. You can then follow the steps in the article.

```powershell
#Create virtual network

$vnetStr =
@"<?xml version="1.0" encoding="utf-8"?>
<NetworkConfiguration xmlns:xsd="https://www.w3.org/2001/XMLSchema" xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/ServiceHosting/2011/07/NetworkConfiguration">
    <VirtualNetworkConfiguration>
    <VirtualNetworkSites>
        <VirtualNetworkSite name="[your-vnet-name]" Location="West US">
        <AddressSpace>
            <AddressPrefix>[your-address-prefix]</AddressPrefix>
        </AddressSpace>
        <Subnets>
            <Subnet name="[your-subnet-name]">
            <AddressPrefix>[your-subnet-range]</AddressPrefix>
            </Subnet>
        </Subnets>
        </VirtualNetworkSite>
    </VirtualNetworkSites>
    </VirtualNetworkConfiguration>
</NetworkConfiguration>
"@;

$vnetConfigPath = "<path-to-vnet-config>"
Set-AzureVNetConfig -ConfigurationPath $vnetConfigPath
```

## Create a Virtual Machine
Once you complete setting up the virtual network, you need to create an AD Domain Controller. For this tutorial, we set up an AD Domain Controller on an Azure Virtual Machine (VM).

Create a virtual machine through PowerShell using the following commands:

```powershell
# Initialize variables
# VNet and subnet must be classic virtual network resources, not Azure Resource Manager resources.

$vnetname = '<your-vnet-name>'
$subnetname = '<your-subnet-name>'
$vmsvc1 = '<your-hosted-service>'
$vm1 = '<your-vm-name>'
$username = '<your-username>'
$password = '<your-password>'
$affgrp = '<your- affgrp>'

# Create a VM and add it to the virtual network

New-AzureQuickVM -Windows -ServiceName $vmsvc1 -Name $vm1 -ImageName $imgname -AdminUsername $username -Password $password -AffinityGroup $affgrp -SubnetNames $subnetname -VNetName $vnetname
```

## Promote your Virtual Machine to a Domain Controller
To configure the Virtual Machine as an AD Domain Controller, you need to sign in to the VM and configure it.

To sign in to the VM, you can get the remote desktop protocol (RDP) file through PowerShell, use the following commands:

```powershell
# Get RDP file
Get-AzureRemoteDesktopFile -ServiceName $vmsvc1 -Name $vm1 -LocalPath <rdp-file-path>
```

Once you sign into the VM, set up your Virtual Machine as an AD Domain Controller by following the step-by-step guide on [How to set up your customer AD Domain Controller](https://social.technet.microsoft.com/wiki/contents/articles/12370.windows-server-2012-set-up-your-first-domain-controller-step-by-step.aspx).

## Add your Cloud Service to the virtual network
Next, you need to add your cloud service deployment to the new virtual network. To add your cloud service deployment, modify your cloud service cscfg by adding the relevant sections to your cscfg using Visual Studio or the editor of your choice.

```xml
<ServiceConfiguration serviceName="[hosted-service-name]" xmlns="http://schemas.microsoft.com/ServiceHosting/2008/10/ServiceConfiguration" osFamily="[os-family]" osVersion="*">
    <Role name="[role-name]">
    <Instances count="[number-of-instances]" />
    </Role>
    <NetworkConfiguration>

    <!--optional-->
    <Dns>
        <DnsServers><DnsServer name="[dns-server-name]" IPAddress="[ip-address]" /></DnsServers>
    </Dns>
    <!--optional-->

    <!--VNet settings
        VNet and subnet must be classic virtual network resources, not Azure Resource Manager resources.-->
    <VirtualNetworkSite name="[virtual-network-name]" />
    <AddressAssignments>
        <InstanceAddress roleName="[role-name]">
        <Subnets>
            <Subnet name="[subnet-name]" />
        </Subnets>
        </InstanceAddress>
    </AddressAssignments>
    <!--VNet settings-->

    </NetworkConfiguration>
</ServiceConfiguration>
```

Next build your cloud services project and deploy it to Azure. To get help with deploying your cloud services package to Azure, see [How to Create and Deploy a Cloud Service](cloud-services-how-to-create-deploy-portal.md)

## Connect your web/worker roles to the domain
Once your cloud service project is deployed on Azure, connect your role instances to the custom AD domain using the AD Domain Extension. To add the AD Domain Extension to your existing cloud services deployment and join the custom domain, execute the following commands in PowerShell:

```powershell
# Initialize domain variables

$domain = '<your-domain-name>'
$dmuser = '$domain\<your-username>'
$dmpswd = '<your-domain-password>'
$dmspwd = ConvertTo-SecureString $dmpswd -AsPlainText -Force
$dmcred = New-Object System.Management.Automation.PSCredential ($dmuser, $dmspwd)

# Add AD Domain Extension to the cloud service roles

Set-AzureServiceADDomainExtension -Service <your-cloud-service-hosted-service-name> -Role <your-role-name> -Slot <staging-or-production> -DomainName $domain -Credential $dmcred -JoinOption 35
```

And that's it.

Your cloud services should be joined to your custom domain controller. If you would like to learn more about the different options available for how to configure AD Domain Extension, use the PowerShell help. A couple of examples follow:

```powershell
help Set-AzureServiceADDomainExtension
help New-AzureServiceADDomainExtensionConfig
```



