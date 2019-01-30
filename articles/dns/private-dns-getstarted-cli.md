---
title: Create an Azure DNS private zone using the Azure CLI
description: In this tutorial, you create and test a private DNS zone and record in Azure DNS. This is a step-by-step guide to create and manage your first private DNS zone and record using Azure CLI.
services: dns
author: vhorne
ms.service: dns
ms.topic: tutorial
ms.date: 7/25/2018
ms.author: victorh
#Customer intent: As an experienced network administrator I want to create an  Azure DNS private zone, so I can resolve host names on my private virtual networks.
---

# Create an Azure DNS private zone using the Azure CLI

This tutorial walks you through the steps to create your first private DNS zone and record using the Azure CLI.

[!INCLUDE [private-dns-public-preview-notice](../../includes/private-dns-public-preview-notice.md)]

A DNS zone is used to host the DNS records for a particular domain. To start hosting your domain in Azure DNS, you need to create a DNS zone for that domain name. Each DNS record for your domain is then created inside this DNS zone. To publish a private DNS zone to your virtual network, you specify the list of virtual networks that are allowed to resolve records within the zone.  These are called *resolution virtual networks*. You may also specify a virtual network for which Azure DNS maintains hostname records whenever a VM is created, changes IP, or is deleted.  This is called a *registration virtual network*.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a DNS private zone
> * Create test virtual machines
> * Create an additional DNS record
> * Test the private zone

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

If you prefer, you can complete this tutorial using [Azure PowerShell](private-dns-getstarted-powershell.md).


[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Create the resource group

First, create a resource group to contain the DNS zone: 

```azurecli
az group create --name MyAzureResourceGroup --location "East US"
```

## Create a DNS private zone

A DNS zone is created by using the `az network dns zone create` command with a value of *Private* for the **ZoneType** parameter. The following example creates a DNS zone called **contoso.local** in the resource group called **MyAzureResourceGroup** and makes the DNS zone available to the virtual network called **MyAzureVnet**.

If the **ZoneType** parameter is omitted, the zone is created as a public zone, so it is required to create a private zone.

```azurecli
az network vnet create \
  --name myAzureVNet \
  --resource-group MyAzureResourceGroup \
  --location eastus \
  --address-prefix 10.2.0.0/16 \
  --subnet-name backendSubnet \
  --subnet-prefix 10.2.0.0/24

az network dns zone create -g MyAzureResourceGroup \
   -n contoso.local \
  --zone-type Private \
  --registration-vnets myAzureVNet
```

If you wanted to create a zone just for name resolution (no automatic hostname creation), you could use the *resolution-vnets* parameter instead of the *registration-vnets* parameter.

> [!NOTE]
> You won't be able to see the automatically created hostname records. But later, you will test to ensure they exist.

### List DNS private zones

To enumerate DNS zones, use `az network dns zone list`. For help, see `az network dns zone list --help`.

Specifying the resource group lists only those zones within the resource group:

```azurecli
az network dns zone list \
  --resource-group MyAzureResourceGroup
```

Omitting the resource group lists all zones in the subscription:

```azurecli
az network dns zone list 
```

## Create the test virtual machines

Now, create two virtual machines so you can test your private DNS zone:

```azurecli
az vm create \
 -n myVM01 \
 --admin-username test-user \
 -g MyAzureResourceGroup \
 -l eastus \
 --subnet backendSubnet \
 --vnet-name myAzureVnet \
 --image win2016datacenter

az vm create \
 -n myVM02 \
 --admin-username test-user \
 -g MyAzureResourceGroup \
 -l eastus \
 --subnet backendSubnet \
 --vnet-name myAzureVnet \
 --image win2016datacenter
```

This will take a few minutes to complete.

## Create an additional DNS record

To create a DNS record, use the `az network dns record-set [record type] add-record` command. For help with adding A records for example, see `azure network dns record-set A add-record --help`.

 The following example creates a record with the relative name **db** in the DNS Zone **contoso.local**, in resource group **MyAzureResourceGroup**. The fully qualified name of the record set is **db.contoso.local**. The record type is "A", with IP address "10.2.0.4".

```azurecli
az network dns record-set a add-record \
  -g MyAzureResourceGroup \
  -z contoso.local \
  -n db \
  -a 10.2.0.4
```

### View DNS records

To list the DNS records in your zone, run:

```azurecli
az network dns record-set list \
  -g MyAzureResourceGroup \
  -z contoso.local
```
Remember, you won't see the automatically created A records for your two test virtual machines.

## Test the private zone

Now you can test the name resolution for your **contoso.local** private zone.

### Configure VMs to allow inbound ICMP

You can use the ping command to test name resolution. So, configure the firewall on both virtual machines to allow inbound ICMP packets.

1. Connect to myVM01, and open a Windows PowerShell window with administrator privileges.
2. Run the following command:

   ```powershell
   New-NetFirewallRule –DisplayName “Allow ICMPv4-In” –Protocol ICMPv4
   ```

Repeat for myVM02.

### Ping the VMs by name

1. From the myVM02 Windows PowerShell command prompt, ping myVM01 using the automatically registered host name:
   ```
   ping myVM01.contoso.local
   ```
   You should see output that looks similar to this:
   ```
   PS C:\> ping myvm01.contoso.local

   Pinging myvm01.contoso.local [10.2.0.4] with 32 bytes of data:
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
   ```
   ping db.contoso.local
   ```
   You should see output that looks similar to this:
   ```
   PS C:\> ping db.contoso.local

   Pinging db.contoso.local [10.2.0.4] with 32 bytes of data:
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

## Delete all resources

When no longer needed, delete the **MyAzureResourceGroup** resource group to delete the resources created in this tutorial.

```azurecli
az group delete --name MyAzureResourceGroup
```

## Next steps

In this tutorial, you deployed a private DNS zone, created a DNS record, and tested the zone.
Next, you can learn more about private DNS zones.

> [!div class="nextstepaction"]
> [Using Azure DNS for private domains](private-dns-overview.md)
