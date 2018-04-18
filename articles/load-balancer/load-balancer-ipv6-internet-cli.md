---
title: Create a public load balancer with IPv6 - Azure CLI | Microsoft Docs
description: Learn how to create a public load balancer with IPv6 in Azure Resource Manager by using Azure CLI.
services: load-balancer
documentationcenter: na
author: KumudD
manager: timlt
tags: azure-resource-manager
keywords: ipv6, azure load balancer, dual stack, public ip, native ipv6, mobile, iot

ms.assetid: a1957c9c-9c1d-423e-9d5c-d71449bc1f37
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/25/2017
ms.author: kumud
---

# Create a public load balancer with IPv6 in Azure Resource Manager by using Azure CLI

> [!div class="op_single_selector"]
> * [PowerShell](load-balancer-ipv6-internet-ps.md)
> * [Azure CLI](load-balancer-ipv6-internet-cli.md)
> * [Template](load-balancer-ipv6-internet-template.md)


An Azure load balancer is a Layer-4 (TCP, UDP) load balancer. Load balancers provide high availability by distributing incoming traffic among healthy service instances in cloud services or virtual machines in a load balancer set. Load balancers can also present these services on multiple ports or multiple IP addresses or both.

## Example deployment scenario

The following diagram illustrates the load balancing solution that's deployed by using the example template described in this article.

![Load balancer scenario](./media/load-balancer-ipv6-internet-cli/lb-ipv6-scenario-cli.png)

In this scenario, you create the following Azure resources:

* Two virtual machines (VMs)
* A virtual network interface for each VM with both IPv4 and IPv6 addresses assigned
* A public load balancer with an IPv4 and an IPv6 public IP address
* An availability set that contains the two VMs
* Two load balancing rules to map the public VIPs to the private endpoints

## Deploy the solution by using Azure CLI

The following steps show how to create a public load balancer by using Azure Resource Manager with Azure CLI. With Azure Resource Manager, you create and configure each object individually, and then put them together to create a resource.

To deploy a load balancer, create and configure the following objects:

* **Front-end IP configuration**: Contains public IP addresses for incoming network traffic.
* **Back-end address pool**: Contains network interfaces (NICs) for the virtual machines to receive network traffic from the load balancer.
* **Load balancing rules**: Contains rules that map a public port on the load balancer to a port in the back-end address pool.
* **Inbound NAT rules**: Contains network address translation (NAT) rules that map a public port on the load balancer to a port for a specific virtual machine in the back-end address pool.
* **Probes**: Contains health probes that are used to check the availability of virtual machine instances in the back-end address pool.

For more information, see [Azure Resource Manager support for Load Balancer](load-balancer-arm.md).

## Set up your Azure CLI environment to use Azure Resource Manager

In this example, you run the Azure CLI tools in a PowerShell command window. To improve readability and reuse, you use PowerShell's scripting capabilities, not the Azure PowerShell cmdlets.

1. If you have never used Azure CLI, see [Install and configure Azure CLI](../cli-install-nodejs.md) and follow the instructions up to the point where you select your Azure account and subscription.

2. To switch to Resource Manager mode, run the **azure config mode** command:

    ```azurecli
    azure config mode arm
    ```

    Expected output:

        info:    New mode is arm

3. Sign in to Azure and get a list of subscriptions:

    ```azurecli
    azure login
    ```

4. At the prompt, enter your Azure credentials:

    ```azurecli
    azure account list
    ```

5. Select the subscription that you want to use, and note the subscription ID to use in the next step.

6. Set up PowerShell variables for use with the Azure CLI commands:

    ```powershell
    $subscriptionid = "########-####-####-####-############"  # enter subscription id
    $location = "southcentralus"
    $rgName = "pscontosorg1southctrlus09152016"
    $vnetName = "contosoIPv4Vnet"
    $vnetPrefix = "10.0.0.0/16"
    $subnet1Name = "clicontosoIPv4Subnet1"
    $subnet1Prefix = "10.0.0.0/24"
    $subnet2Name = "clicontosoIPv4Subnet2"
    $subnet2Prefix = "10.0.1.0/24"
    $dnsLabel = "contoso09152016"
    $lbName = "myIPv4IPv6Lb"
    ```

## Create a resource group, a load balancer, a virtual network, and subnets

1. Create a resource group:

    ```azurecli
    azure group create $rgName $location
    ```

2. Create a load balancer:

    ```azurecli
    $lb = azure network lb create --resource-group $rgname --location $location --name $lbName
    ```

3. Create a virtual network:

    ```azurecli
    $vnet = azure network vnet create  --resource-group $rgname --name $vnetName --location $location --address-prefixes $vnetPrefix
    ```

4. In this virtual network, create two subnets:

    ```azurecli
    $subnet1 = azure network vnet subnet create --resource-group $rgname --name $subnet1Name --address-prefix $subnet1Prefix --vnet-name $vnetName
    $subnet2 = azure network vnet subnet create --resource-group $rgname --name $subnet2Name --address-prefix $subnet2Prefix --vnet-name $vnetName
    ```

## Create public IP addresses for the front-end pool

1. Set up the PowerShell variables:

    ```powershell
    $publicIpv4Name = "myIPv4Vip"
    $publicIpv6Name = "myIPv6Vip"
    ```

2. Create a public IP address for the front-end IP pool:

    ```azurecli
    $publicipV4 = azure network public-ip create --resource-group $rgname --name $publicIpv4Name --location $location --ip-version IPv4 --allocation-method Dynamic --domain-name-label $dnsLabel
    $publicipV6 = azure network public-ip create --resource-group $rgname --name $publicIpv6Name --location $location --ip-version IPv6 --allocation-method Dynamic --domain-name-label $dnsLabel
    ```

    > [!IMPORTANT]
    > The load balancer uses the domain label of the public IP as its fully qualified domain name (FQDN). This a change from classic deployment, which uses the cloud service name as the load balancer FQDN.
    >
    > In this example, the FQDN is *contoso09152016.southcentralus.cloudapp.azure.com*.

## Create front-end and back-end pools

In this section, you create the following IP pools:
* The front-end IP pool that receives the incoming network traffic on the load balancer.
* The back-end IP pool where the front-end pool sends the load-balanced network traffic.

1. Set up the PowerShell variables:

    ```powershell
    $frontendV4Name = "FrontendVipIPv4"
    $frontendV6Name = "FrontendVipIPv6"
    $backendAddressPoolV4Name = "BackendPoolIPv4"
    $backendAddressPoolV6Name = "BackendPoolIPv6"
    ```

2. Create a front-end IP pool, and associate it with the public IP that you created in the previous step and the load balancer.

    ```azurecli
    $frontendV4 = azure network lb frontend-ip create --resource-group $rgname --name $frontendV4Name --public-ip-name $publicIpv4Name --lb-name $lbName
    $frontendV6 = azure network lb frontend-ip create --resource-group $rgname --name $frontendV6Name --public-ip-name $publicIpv6Name --lb-name $lbName
    $backendAddressPoolV4 = azure network lb address-pool create --resource-group $rgname --name $backendAddressPoolV4Name --lb-name $lbName
    $backendAddressPoolV6 = azure network lb address-pool create --resource-group $rgname --name $backendAddressPoolV6Name --lb-name $lbName
    ```

## Create the probe, NAT rules, and load balancer rules

This example creates the following items:

* A probe rule to check for connectivity to TCP port 80.
* A NAT rule to translate all incoming traffic on port 3389 to port 3389 for RDP.\*
* A NAT rule to translate all incoming traffic on port 3391 to port 3389 for remote desktop protocol (RDP).\*
* A load balancer rule to balance all incoming traffic on port 80 to port 80 on the addresses in the back-end pool.

\* NAT rules are associated with a specific virtual-machine instance behind the load balancer. The network traffic that arrives on port 3389 is sent to the specific virtual machine and port that's associated with the NAT rule. You must specify a protocol (UDP or TCP) for a NAT rule. You cannot assign both protocols to the same port.

1. Set up the PowerShell variables:

    ```powershell
    $probeV4V6Name = "ProbeForIPv4AndIPv6"
    $natRule1V4Name = "NatRule-For-Rdp-VM1"
    $natRule2V4Name = "NatRule-For-Rdp-VM2"
    $lbRule1V4Name = "LBRuleForIPv4-Port80"
    $lbRule1V6Name = "LBRuleForIPv6-Port80"
    ```

2. Create the probe.

    The following example creates a TCP probe that checks for connectivity to the back-end TCP port 80 every 15 seconds. After two consecutive failures, it marks the back-end resource as unavailable.

    ```azurecli
    $probeV4V6 = azure network lb probe create --resource-group $rgname --name $probeV4V6Name --protocol tcp --port 80 --interval 15 --count 2 --lb-name $lbName
    ```

3. Create inbound NAT rules that allow RDP connections to the back-end resources:

    ```azurecli
    $inboundNatRuleRdp1 = azure network lb inbound-nat-rule create --resource-group $rgname --name $natRule1V4Name --frontend-ip-name $frontendV4Name --protocol Tcp --frontend-port 3389 --backend-port 3389 --lb-name $lbName
    $inboundNatRuleRdp2 = azure network lb inbound-nat-rule create --resource-group $rgname --name $natRule2V4Name --frontend-ip-name $frontendV4Name --protocol Tcp --frontend-port 3391 --backend-port 3389 --lb-name $lbName
    ```

4. Create load balancer rules that send traffic to different back-end ports, depending on the front end that received the request.

    ```azurecli
    $lbruleIPv4 = azure network lb rule create --resource-group $rgname --name $lbRule1V4Name --frontend-ip-name $frontendV4Name --backend-address-pool-name $backendAddressPoolV4Name --probe-name $probeV4V6Name --protocol Tcp --frontend-port 80 --backend-port 80 --lb-name $lbName
    $lbruleIPv6 = azure network lb rule create --resource-group $rgname --name $lbRule1V6Name --frontend-ip-name $frontendV6Name --backend-address-pool-name $backendAddressPoolV6Name --probe-name $probeV4V6Name --protocol Tcp --frontend-port 80 --backend-port 8080 --lb-name $lbName
    ```

5. Check your settings:

    ```azurecli
    azure network lb show --resource-group $rgName --name $lbName
    ```

    Expected output:

        info:    Executing command network lb show
        info:    Looking up the load balancer "myIPv4IPv6Lb"
        data:    Id                              : /subscriptions/########-####-####-####-############/resourceGroups/pscontosorg1southctrlus09152016/providers/Microsoft.Network/loadBalancers/myIPv4IPv6Lb
        data:    Name                            : myIPv4IPv6Lb
        data:    Type                            : Microsoft.Network/loadBalancers
        data:    Location                        : southcentralus
        data:    Provisioning state              : Succeeded
        data:
        data:    Frontend IP configurations:
        data:    Name             Provisioning state  Private IP allocation  Private IP   Subnet  Public IP
        data:    ---------------  ------------------  ---------------------  -----------  ------  ---------
        data:    FrontendVipIPv4  Succeeded           Dynamic                                     myIPv4Vip
        data:    FrontendVipIPv6  Succeeded           Dynamic                                     myIPv6Vip
        data:
        data:    Probes:
        data:    Name                 Provisioning state  Protocol  Port  Path  Interval  Count
        data:    -------------------  ------------------  --------  ----  ----  --------  -----
        data:    ProbeForIPv4AndIPv6  Succeeded           Tcp       80          15        2
        data:
        data:    Backend Address Pools:
        data:    Name             Provisioning state
        data:    ---------------  ------------------
        data:    BackendPoolIPv4  Succeeded
        data:    BackendPoolIPv6  Succeeded
        data:
        data:    Load Balancing Rules:
        data:    Name                  Provisioning state  Load distribution  Protocol  Frontend port  Backend port  Enable floating IP  Idle timeout in minutes
        data:    --------------------  ------------------  -----------------  --------  -------------  ------------  ------------------  -----------------------
        data:    LBRuleForIPv4-Port80  Succeeded           Default            Tcp       80             80            false               4
        data:    LBRuleForIPv6-Port80  Succeeded           Default            Tcp       80             8080          false               4
        data:
        data:    Inbound NAT Rules:
        data:    Name                 Provisioning state  Protocol  Frontend port  Backend port  Enable floating IP  Idle timeout in minutes
        data:    -------------------  ------------------  --------  -------------  ------------  ------------------  -----------------------
        data:    NatRule-For-Rdp-VM1  Succeeded           Tcp       3389           3389          false               4
        data:    NatRule-For-Rdp-VM2  Succeeded           Tcp       3391           3389          false               4
        info:    network lb show

## Create NICs

Create NICs and associate them with NAT rules, load balancer rules, and probes.

1. Set up the PowerShell variables:

    ```powershell
    $nic1Name = "myIPv4IPv6Nic1"
    $nic2Name = "myIPv4IPv6Nic2"
    $subnet1Id = "/subscriptions/$subscriptionid/resourceGroups/$rgName/providers/Microsoft.Network/VirtualNetworks/$vnetName/subnets/$subnet1Name"
    $subnet2Id = "/subscriptions/$subscriptionid/resourceGroups/$rgName/providers/Microsoft.Network/VirtualNetworks/$vnetName/subnets/$subnet2Name"
    $backendAddressPoolV4Id = "/subscriptions/$subscriptionid/resourceGroups/$rgname/providers/Microsoft.Network/loadbalancers/$lbName/backendAddressPools/$backendAddressPoolV4Name"
    $backendAddressPoolV6Id = "/subscriptions/$subscriptionid/resourceGroups/$rgname/providers/Microsoft.Network/loadbalancers/$lbName/backendAddressPools/$backendAddressPoolV6Name"
    $natRule1V4Id = "/subscriptions/$subscriptionid/resourceGroups/$rgname/providers/Microsoft.Network/loadbalancers/$lbName/inboundNatRules/$natRule1V4Name"
    $natRule2V4Id = "/subscriptions/$subscriptionid/resourceGroups/$rgname/providers/Microsoft.Network/loadbalancers/$lbName/inboundNatRules/$natRule2V4Name"
    ```

2. Create a NIC for each back end, and add an IPv6 configuration:

    ```azurecli
    $nic1 = azure network nic create --name $nic1Name --resource-group $rgname --location $location --private-ip-version "IPv4" --subnet-id $subnet1Id --lb-address-pool-ids $backendAddressPoolV4Id --lb-inbound-nat-rule-ids $natRule1V4Id
    $nic1IPv6 = azure network nic ip-config create --resource-group $rgname --name "IPv6IPConfig" --private-ip-version "IPv6" --lb-address-pool-ids $backendAddressPoolV6Id --nic-name $nic1Name

    $nic2 = azure network nic create --name $nic2Name --resource-group $rgname --location $location --subnet-id $subnet1Id --lb-address-pool-ids $backendAddressPoolV4Id --lb-inbound-nat-rule-ids $natRule2V4Id
    $nic2IPv6 = azure network nic ip-config create --resource-group $rgname --name "IPv6IPConfig" --private-ip-version "IPv6" --lb-address-pool-ids $backendAddressPoolV6Id --nic-name $nic2Name
    ```

## Create the back-end VM resources, and attach each NIC

To create VMs, you must have a storage account. For load balancing, the VMs need to be members of an availability set. For more information about creating VMs, see [Create an Azure VM by using PowerShell](../virtual-machines/virtual-machines-windows-ps-create.md?toc=%2fazure%2fload-balancer%2ftoc.json).

1. Set up the PowerShell variables:

    ```powershell
    $storageAccountName = "ps08092016v6sa0"
    $availabilitySetName = "myIPv4IPv6AvailabilitySet"
    $vm1Name = "myIPv4IPv6VM1"
    $vm2Name = "myIPv4IPv6VM2"
    $nic1Id = "/subscriptions/$subscriptionid/resourceGroups/$rgname/providers/Microsoft.Network/networkInterfaces/$nic1Name"
    $nic2Id = "/subscriptions/$subscriptionid/resourceGroups/$rgname/providers/Microsoft.Network/networkInterfaces/$nic2Name"
    $disk1Name = "WindowsVMosDisk1"
    $disk2Name = "WindowsVMosDisk2"
    $osDisk1Uri = "https://$storageAccountName.blob.core.windows.net/vhds/$disk1Name.vhd"
    $osDisk2Uri = "https://$storageAccountName.blob.core.windows.net/vhds/$disk2Name.vhd"
    $imageurn "MicrosoftWindowsServer:WindowsServer:2012-R2-Datacenter:latest"
    $vmUserName = "vmUser"
    $mySecurePassword = "PlainTextPassword*1"
    ```

    > [!WARNING]
    > This example uses the username and password for the VMs in cleartext. Take appropriate care when you use these credentials in cleartext. For a more secure method of handling credentials in PowerShell, see the [`Get-Credential`](https://technet.microsoft.com/library/hh849815.aspx) cmdlet.

2. Create the storage account and availability set.

    You can use an existing storage account when you create the VMs. You create a new storage account by using the following command:

    ```azurecli
    $storageAcc = azure storage account create $storageAccountName --resource-group $rgName --location $location --sku-name "LRS" --kind "Storage"
    ```

3. Create the availability set:

    ```azurecli
    $availabilitySet = azure availset create --name $availabilitySetName --resource-group $rgName --location $location
    ```

4. Create the virtual machines with the associated NICs:

    ```azurecli
    $vm1 = azure vm create --resource-group $rgname --location $location --availset-name $availabilitySetName --name $vm1Name --nic-id $nic1Id --os-disk-vhd $osDisk1Uri --os-type "Windows" --admin-username $vmUserName --admin-password $mySecurePassword --vm-size "Standard_A1" --image-urn $imageurn --storage-account-name $storageAccountName --disable-bginfo-extension

    $vm2 = azure vm create --resource-group $rgname --location $location --availset-name $availabilitySetName --name $vm2Name --nic-id $nic2Id --os-disk-vhd $osDisk2Uri --os-type "Windows" --admin-username $vmUserName --admin-password $mySecurePassword --vm-size "Standard_A1" --image-urn $imageurn --storage-account-name $storageAccountName --disable-bginfo-extension
    ```

## Next steps

[Get started configuring an internal load balancer](load-balancer-get-started-ilb-arm-cli.md)  
[Configure a load balancer distribution mode](load-balancer-distribution-mode.md)  
[Configure idle TCP timeout settings for your load balancer](load-balancer-tcp-idle-timeout.md)
