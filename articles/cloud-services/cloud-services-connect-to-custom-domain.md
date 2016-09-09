<properties
  pageTitle="Connect a Cloud Service to a custom Domain Controller | Microsoft Azure"
  description="Learn how to connect your web/worker roles to a custom AD Domain using PowerShell and AD Domain Extension"
  services="cloud-services"
  documentationCenter=""
  authors="Thraka"
  manager="timlt"
  editor=""/>

  <tags
    ms.service="cloud-services"
    ms.workload="tbd"
    ms.tgt_pltfrm="na"
    ms.devlang="na"
    ms.topic="article"
    ms.date="06/22/2016"
    ms.author="adegeo"/>

# Connecting Azure Cloud Services Roles to a custom AD Domain Controller hosted in Azure

We will first set up a Virtual Network (VNet) in Azure. We will then add an Active Directory Domain Controller (hosted on an Azure Virtual Machine) to the VNet. Next, we will add existing cloud service roles to the pre-created VNet and subsequently connect them to the Domain Controller.

Before we get started, couple of things to keep in mind:

1.	This tutorial uses PowerShell, so please make sure you have Azure PowerShell installed and ready to go. To get help with setting up Azure PowerShell, see [How to install and configure Azure PowerShell](../powershell-install-configure.md).

2.	Your AD Domain Controller and Web/Worker Role instances need to be in the VNet.

Follow this step-by-step guide and if you run into any issues, leave us a comment below. Someone will get back to you (yes, we do read comments).

## Create a Virtual Network

You can create a Virtual Network in Azure using the Azure classic portal or PowerShell. For this tutorial, we will use PowerShell. To create a Virtual Network using the Azure classic portal, see [Create Virtual Network](../virtual-network/virtual-networks-create-vnet-arm-pportal.md).

```powershell
#Create Virtual Network

$vnetStr =
@"<?xml version="1.0" encoding="utf-8"?>
<NetworkConfiguration xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/ServiceHosting/2011/07/NetworkConfiguration">
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

Once you have completed setting up the Virtual Network, you will need to create an AD Domain Controller. For this tutorial, we will be setting up an AD Domain Controller on an Azure Virtual Machine.

To do this, create a virtual machine through PowerShell using the commands below:

```powershell
# Initialize variables

$vnetname = '<your-vnet-name>'
$subnetname = '<your-subnet-name>'
$vmsvc1 = '<your-hosted-service>'
$vm1 = '<your-vm-name>'
$username = '<your-username>'
$password = '<your-password>'
$affgrp = '<your- affgrp>'

# Create a VM and add it to the Virtual Network

New-AzureQuickVM -Windows -ServiceName $vmsvc1 -Name $vm1 -ImageName $imgname -AdminUsername $username -Password $password -AffinityGroup $affgrp -SubnetNames $subnetname -VNetName $vnetname
```

## Promote your Virtual Machine to a Domain Controller
To configure the Virtual Machine as an AD Domain Controller, you will need to log in to the VM and configure it.

To log in to the VM, you can get the RDP file through PowerShell, use the commands below.

```powershell
# Get RDP file
Get-AzureRemoteDesktopFile -ServiceName $vmsvc1 -Name $vm1 -LocalPath <rdp-file-path>
```

Once you are logged into the VM, setup your Virtual Machine as an AD Domain Controller by following the step-by-step guide on [How to setup your customer AD Domain Controller](http://social.technet.microsoft.com/wiki/contents/articles/12370.windows-server-2012-set-up-your-first-domain-controller-step-by-step.aspx).

## Add your Cloud Service to the Virtual Network

Next, you need to add your cloud service deployment to the VNet you just created. To do this, modify your cloud service cscfg by adding the relevant sections to your cscfg using Visual Studio or the editor of your choice.

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

    <!--VNet settings-->
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

Next build your cloud services project and deploy it to Azure. To get help with deploying your cloud services package to Azure, see [How to Create and Deploy a Cloud Service](cloud-services-how-to-create-deploy.md#deploy)

## Connect your web/worker role(s) to the domain

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

You cloud services should now be joined to your custom domain controller. If you would like to learn more about the different options available for how to configure AD Domain Extension, use the PowerShell help as shown below.

```powershell
help Set-AzureServiceADDomainExtension
help New-AzureServiceADDomainExtensionConfig
```

We would also like your feedback on if it would be useful for you to have an extension that promotes a Virtual Machine to a Domain Controller. So if you think it would be, please let us know in the comments section.

