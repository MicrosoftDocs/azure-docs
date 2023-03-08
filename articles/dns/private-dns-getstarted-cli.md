---
title: Quickstart - Create an Azure private DNS zone using the Azure CLI
description: In this quickstart, you create and test a private DNS zone and record in Azure DNS. This is a step-by-step guide to create and manage your first private DNS zone and record using Azure CLI.
services: dns
author: greg-lindsay
ms.service: dns
ms.topic: quickstart
ms.date: 09/27/2022
ms.author: greglin
ms.custom: devx-track-azurecli, mode-api
#Customer intent: As an experienced network administrator, I want to create an  Azure private DNS zone, so I can resolve host names on my private virtual networks.
---

# Quickstart: Create an Azure private DNS zone using the Azure CLI

This quickstart walks you through the steps to create your first private DNS zone and record using the Azure CLI.

A DNS zone is used to host the DNS records for a particular domain. To start hosting your domain in Azure DNS, you need to create a DNS zone for that domain name. Each DNS record for your domain is then created inside this DNS zone. To publish a private DNS zone to your virtual network, you specify the list of virtual networks that are allowed to resolve records within the zone.  These are called *linked* virtual networks. When autoregistration is enabled, Azure DNS also updates the zone records whenever a virtual machine is created, changes its' IP address, or is deleted.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- You can also complete this quickstart using [Azure PowerShell](private-dns-getstarted-powershell.md).

## Create the resource group

First, create a resource group to contain the DNS zone: 

```azurecli
az group create --name MyAzureResourceGroup --location "East US"
```

## Create a private DNS zone

The following example creates a virtual network named **myAzureVNet**. Then it creates a DNS zone named **private.contoso.com** in the **MyAzureResourceGroup** resource group, links the DNS zone to the **MyAzureVnet** virtual network, and enables automatic registration.

```azurecli
az network vnet create \
  --name myAzureVNet \
  --resource-group MyAzureResourceGroup \
  --location eastus \
  --address-prefix 10.2.0.0/16 \
  --subnet-name backendSubnet \
  --subnet-prefixes 10.2.0.0/24

az network private-dns zone create -g MyAzureResourceGroup \
   -n private.contoso.com

az network private-dns link vnet create -g MyAzureResourceGroup -n MyDNSLink \
   -z private.contoso.com -v myAzureVNet -e true
```

If you want to create a zone just for name resolution (no automatic hostname registration), you could use the `-e false` parameter.

### List DNS private zones

To enumerate DNS zones, use `az network private-dns zone list`. For help, see `az network dns zone list --help`.

Specifying the resource group lists only those zones within the resource group:

```azurecli
az network private-dns zone list \
  -g MyAzureResourceGroup
```

Omitting the resource group lists all zones in the subscription:

```azurecli
az network private-dns zone list 
```

## Create the test virtual machines

Now, create two virtual machines so you can test your private DNS zone:

```azurecli
az vm create \
 -n myVM01 \
 --admin-username AzureAdmin \
 -g MyAzureResourceGroup \
 -l eastus \
 --subnet backendSubnet \
 --vnet-name myAzureVnet \
 --nsg NSG01 \
 --nsg-rule RDP \
 --image win2016datacenter
```

```azurecli
az vm create \
 -n myVM02 \
 --admin-username AzureAdmin \
 -g MyAzureResourceGroup \
 -l eastus \
 --subnet backendSubnet \
 --vnet-name myAzureVnet \
 --nsg NSG01 \
 --nsg-rule RDP \
 --image win2016datacenter
```

Creating a virtual machine will take a few minutes to complete.

## Create an additional DNS record

To create a DNS record, use the `az network private-dns record-set [record type] add-record` command. For help with adding A records for example, see `az network private-dns record-set A add-record --help`.

 The following example creates a record with the relative name **db** in the DNS Zone **private.contoso.com**, in resource group **MyAzureResourceGroup**. The fully qualified name of the record set is **db.private.contoso.com**. The record type is "A", with IP address "10.2.0.4".

```azurecli
az network private-dns record-set a add-record \
  -g MyAzureResourceGroup \
  -z private.contoso.com \
  -n db \
  -a 10.2.0.4
```

### View DNS records

To list the DNS records in your zone, run:

```azurecli
az network private-dns record-set list \
  -g MyAzureResourceGroup \
  -z private.contoso.com
```

## Test the private zone

Now you can test the name resolution for your **private.contoso.com** private zone.

### Configure VMs to allow inbound ICMP

You can use the ping command to test name resolution. So, configure the firewall on both virtual machines to allow inbound ICMP packets.

1. Connect to myVM01, and open a Windows PowerShell window with administrator privileges.
2. Run the following command:

   ```powershell
   New-NetFirewallRule –DisplayName "Allow ICMPv4-In" –Protocol ICMPv4
   ```

Repeat for myVM02.

### Ping the VMs by name

1. From the myVM02 Windows PowerShell command prompt, ping myVM01 using the automatically registered host name:

   ```powershell
   ping myVM01.private.contoso.com
   ```

   You should see an output that looks similar to what is shown below:

   ```output
   PS C:\> ping myvm01.private.contoso.com

   Pinging myvm01.private.contoso.com [10.2.0.4] with 32 bytes of data:
   Reply from 10.2.0.4: bytes=32 time<1ms TTL=128
   Reply from 10.2.0.4: bytes=32 time=1ms TTL=128
   Reply from 10.2.0.4: bytes=32 time<1ms TTL=128
   Reply from 10.2.0.4: bytes=32 time<1ms TTL=128

   Ping statistics for 10.2.0.4:
       Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
   Approximate round trip times in milli-seconds:
       Minimum = 0ms, Maximum = 1ms, Average = 0ms
   PS C:\>
   ```

2. Now ping the **db** name you created previously:

   ```powershell
   ping db.private.contoso.com
   ```

   You should see an output that looks similar to what is shown below:

   ```output
   PS C:\> ping db.private.contoso.com

   Pinging db.private.contoso.com [10.2.0.4] with 32 bytes of data:
   Reply from 10.2.0.4: bytes=32 time<1ms TTL=128
   Reply from 10.2.0.4: bytes=32 time<1ms TTL=128
   Reply from 10.2.0.4: bytes=32 time<1ms TTL=128
   Reply from 10.2.0.4: bytes=32 time<1ms TTL=128

   Ping statistics for 10.2.0.4:
       Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
   Approximate round trip times in milli-seconds:
       Minimum = 0ms, Maximum = 0ms, Average = 0ms
   PS C:\>
   ```

## Clean up resources

When no longer needed, delete the **MyAzureResourceGroup** resource group to delete the resources created in this quickstart.

```azurecli
az group delete --name MyAzureResourceGroup
```

## Next steps

> [!div class="nextstepaction"]
> [Azure DNS Private Zones scenarios](private-dns-scenarios.md)
