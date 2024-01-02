---
title: Configure Azure Key Vault Managed HSM with private endpoints
description: Learn how to integrate Azure Key Vault Managed HSM with Azure Private Link Service
author: mbaldwin
ms.author: mbaldwin
ms.date: 11/14/2022
ms.service: key-vault
ms.subservice: managed-hsm
ms.topic: how-to
ms.custom: devx-track-azurecli

---

# Integrate Managed HSM with Azure Private Link

Azure Private Link Service enables you to access Azure Services (for example, Managed HSM, Azure Storage, and Azure Cosmos DB etc.) and Azure hosted customer/partner services over a Private Endpoint in your virtual network.

An Azure Private Endpoint is a network interface that connects you privately and securely to a service powered by Azure Private Link. The private endpoint uses a private IP address from your VNet, effectively bringing the service into your VNet. All traffic to the service can be routed through the private endpoint, so no gateways, NAT devices, ExpressRoute or VPN connections, or public IP addresses are needed. Traffic between your virtual network and the service traverses over the Microsoft backbone network, eliminating exposure from the public Internet. You can connect to an instance of an Azure resource, giving you the highest level of granularity in access control.

For more information, see [What is Azure Private Link?](../../private-link/private-link-overview.md)

> [!NOTE]
> Managed HSM does not currently support IP rules or [Virtual Network Service Endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md) 
> 
## Prerequisites

To integrate a managed HSM with Azure Private Link, you will need the following:

- A Managed HSM. See [Provision and activate a managed HSM using Azure CLI](quick-create-cli.md) for more details.
- An Azure virtual network.
- A subnet in the virtual network.
- Owner or contributor permissions for both the managed HSM and the virtual network.
- The Azure CLI version 2.25.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

Your private endpoint and virtual network must be in the same region. When you select a region for the private endpoint using the portal, it will automatically filter only virtual networks that are in that region. Your HSM can be in a different region.

Your private endpoint uses a private IP address in your virtual network.


## Establish a private link connection to Managed HSM using CLI (Initial Setup)

```azurecli
az login                                                                   # Login to Azure CLI
az account set --subscription {SUBSCRIPTION ID}                            # Select your Azure Subscription
az group create -n {RESOURCE GROUP} -l {REGION}                            # Create a new Resource Group
az provider register -n Microsoft.KeyVault                                 # Register KeyVault as a provider
az keyvault update-hsm --hsm-name {HSM NAME} -g {RG} --default-action deny # Turn on firewall

az network vnet create -g {RG} -n {vNet NAME} --location {REGION}           # Create a Virtual Network

    # Create a Subnet
az network vnet subnet create -g {RG} --vnet-name {vNet NAME} --name {subnet NAME} --address-prefixes {addressPrefix}

    # Disable Virtual Network Policies
az network vnet subnet update --name {subnet NAME} --resource-group {RG} --vnet-name {vNet NAME} --disable-private-endpoint-network-policies true

    # Create a Private DNS Zone
az network private-dns zone create --resource-group {RG} --name privatelink.managedhsm.azure.net

    # Link the Private DNS Zone to the Virtual Network
az network private-dns link vnet create --resource-group {RG} --virtual-network {vNet NAME} --zone-name privatelink.managedhsm.azure.net --name {dnsZoneLinkName} --registration-enabled true

```

### Allow trusted services to access Managed HSM

When the firewall is turned on, all access to the HSM from any location that are not using a private endpoints connection will be denied, including public Internet and Azure services. Use `--bypass AzureServices` option if you want to allow Microsoft services to access your keys in your Managed HSM. The individual entities (such as an Azure Storage account or a Azure SQL Server) still need to have specific role assignments in place to be able to access a key. 

> [!NOTE]
> Only specific trusted services usage scenarios are supported. Refer to the [list of trusted services usage scenarios](../general/overview-vnet-service-endpoints.md#trusted-services) for more details.

```azurecli
az keyvault update-hsm --hsm-name {HSM NAME} -g {RG} --default-action deny --bypass AzureServices
```

### Create a Private Endpoint (Automatically Approve) 
```azurecli
az network private-endpoint create --resource-group {RG} --vnet-name {vNet NAME} --subnet {subnet NAME} --name {Private Endpoint Name}  --private-connection-resource-id "/subscriptions/{AZURE SUBSCRIPTION ID}/resourceGroups/{RG}/providers/Microsoft.KeyVault/managedHSMs/{HSM NAME}" --group-id managedhsm --connection-name {Private Link Connection Name} --location {AZURE REGION}
```

> [!NOTE]
> If you delete this HSM the private endpoint will stop working. If your recover (undelete) this HSM later, you must re-create a new private endpoint.

### Create a Private Endpoint (Manually Request Approval) 
```azurecli
az network private-endpoint create --resource-group {RG} --vnet-name {vNet NAME} --subnet {subnet NAME} --name {Private Endpoint Name}  --private-connection-resource-id "/subscriptions/{AZURE SUBSCRIPTION ID}/resourceGroups/{RG}/providers/Microsoft.KeyVault/managedHSMs/{HSM NAME}" --group-id managedhsm --connection-name {Private Link Connection Name} --location {AZURE REGION} --manual-request
```

### Manage Private Link Connections

```azurecli
# Show Connection Status
az network private-endpoint show --resource-group {RG} --name {Private Endpoint Name}

# Approve a Private Link Connection Request
az keyvault private-endpoint-connection approve --description {"OPTIONAL DESCRIPTION"} --resource-group {RG} --hsm-name {HSM NAME} –-name {PRIVATE LINK CONNECTION NAME}

# Deny a Private Link Connection Request
az keyvault private-endpoint-connection reject --description {"OPTIONAL DESCRIPTION"} --resource-group {RG} --hsm-name {HSM NAME} –-name {PRIVATE LINK CONNECTION NAME}

# Delete a Private Link Connection Request
az keyvault private-endpoint-connection delete --resource-group {RG} --hsm-name {HSM NAME} --name {PRIVATE LINK CONNECTION NAME}
```

### Add Private DNS Records
```azurecli
# Determine the Private Endpoint IP address
az network private-endpoint show -g {RG} -n {PE NAME}      # look for the property networkInterfaces then id; the value must be placed on {PE NIC} below.
az network nic show --ids {PE NIC}                         # look for the property ipConfigurations then privateIpAddress; the value must be placed on {NIC IP} below.

# https://learn.microsoft.com/azure/dns/private-dns-getstarted-cli#create-an-additional-dns-record
az network private-dns zone list -g {RG}
az network private-dns record-set a add-record -g {RG} -z "privatelink.managedhsm.azure.net" -n {HSM NAME} -a {NIC IP}
az network private-dns record-set list -g {RG} -z "privatelink.managedhsm.azure.net"

# From home/public network, you wil get a public IP. If inside a vnet with private zone, nslookup will resolve to the private ip.
nslookup {HSM NAME}.managedhsm.azure.net
nslookup {HSM NAME}.privatelink.managedhsm.azure.net
```

---

## Validate that the private link connection works

You should validate that the resources within the same subnet of the private endpoint resource are connecting to your HSM over a private IP address, and that they have the correct private DNS zone integration.

First, create a virtual machine by following the steps in [Create a Windows virtual machine in the Azure portal](../../virtual-machines/windows/quick-create-portal.md)

In the "Networking" tab:

1. Specify Virtual network and Subnet. You can create a new virtual network or select an existing one. If selecting an existing one, make sure the region matches.
1. Specify a Public IP resource.
1. In the "NIC network security group", select "None".
1. In the "Load balancing", select "No".

Open the command line and run the following command:

```console
nslookup <your-HSM-name>.managedhsm.azure.net
```

If you run the ns lookup command to resolve the IP address of a managed HSM over a public endpoint, you will see a result that looks like this:

```console
c:\ >nslookup <your-hsm-name>.managedhsm.azure.net

Non-authoritative answer:
Name:    
Address:  (public IP address)
Aliases:  <your-hsm-name>.managedhsm.azure.net
```

If you run the ns lookup command to resolve the IP address of a managed HSM over a private endpoint, you will see a result that looks like this:

```console
c:\ >nslookup your_hsm_name.managedhsm.azure.net

Non-authoritative answer:
Name:    
Address:  10.1.0.5 (private IP address)
Aliases:  <your-hsm-name>.managed.azure.net
          <your-hsm-name>.privatelink.managedhsm.azure.net
```

## Troubleshooting Guide

* Check to make sure the private endpoint is in the approved state. 
    1. Use ```az keyvault private-endpoint-connections show``` subcommand to see the status of a private endpoint connection.
    2. Make sure connection state is Approved and provisioning state is Succeeded. 
    3. Make sure the virtual network matches the one you are using.

* Check to make sure you have a Private DNS Zone resource. 
    1. You must have a Private DNS Zone resource with the exact name: privatelink.managedhsm.azure.net. 
    2. To learn how to set this up please see the following link. [Private DNS Zones](../../dns/private-dns-privatednszone.md)
    
* Check to make sure the Private DNS Zone is linked to the Virtual Network. This may be the issue if you are still getting the public IP address returned. 
    1. If the Private Zone DNS is not linked to the virtual network, the DNS query originating from the virtual network will return the public IP address of the HSM. 
    2. Navigate to the Private DNS Zone resource in the Azure portal and click the virtual network links option. 
    4. The virtual network that will perform calls to the HSM must be listed. 
    5. If it's not there, add it. 
    6. For detailed steps, see the following document [Link Virtual Network to Private DNS Zone](../../dns/private-dns-getstarted-portal.md#link-the-virtual-network)

* Check to make sure the Private DNS Zone is not missing an A record for the HSM. 
    1. Navigate to the Private DNS Zone page. 
    2. Click Overview and check if there is an A record with the simple name of your HSM. Do not specify any suffix.
    3. Make sure you check the spelling, and either create or fix the A record. You can use a TTL of 3600 (1 hour). 
    4. Make sure you specify the correct private IP address. 
    
* Check to make sure the A record has the correct IP Address. 
    1. You can confirm the IP address by opening the Private Endpoint resource in Azure portal.
    2. Navigate to the Microsoft.Network/privateEndpoints resource, in the Azure portal
    3. In the overview page look for Network interface and click that link. 
    4. The link will show the Overview of the NIC resource, which contains the property Private IP address. 
    5. Verify that this is the correct IP address that is specified in the A record.

## Limitations and Design Considerations

> [!NOTE]
> The number of managed HSMs with private endpoints enabled per subscription is an adjustable limit. The limit shown below is the default limit. If you would like to request a limit increase for your subscription, please create an Azure support ticket. We will approve these requests on a case by case basis.

**Pricing**: For pricing information, see [Azure Private Link pricing](https://azure.microsoft.com/pricing/details/private-link/).

**Maximum Number of Private Endpoints per Managed HSM**: 64.

**Default Number of Managed HSM with Private Endpoints per Subscription**: 400.

For more, see [Azure Private Link service: Limitations](../../private-link/private-link-service-overview.md#limitations)

## Next Steps

- Learn more about [Azure Private Link](../../private-link/private-link-service-overview.md)
- Learn more about [Managed HSM](overview.md)
