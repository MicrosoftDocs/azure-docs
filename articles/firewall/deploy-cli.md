---
title: Deploy and configure Azure Firewall using Azure CLI
description: In this article, you learn how to deploy and configure Azure Firewall using the Azure CLI. 
services: firewall
author: duongau
ms.service: azure-firewall
ms.custom: devx-track-azurecli
ms.date: 01/22/2026
ms.author: duau
ms.topic: how-to
#Customer intent: As an administrator new to this service, I want to control outbound network access from resources located in an Azure subnet.
# Customer intent: As an administrator deploying network security solutions, I want to configure Azure Firewall using the command-line interface, so that I can control outbound access and manage network traffic effectively within my Azure environment.
---

# Deploy and configure Azure Firewall using Azure CLI

Controlling outbound network access is an important part of an overall network security plan. For example, you may want to limit access to web sites. Or, you may want to limit the outbound IP addresses and ports that can be accessed.

One way you can control outbound network access from an Azure subnet is with Azure Firewall. With Azure Firewall, you can configure:

* Application rules that define fully qualified domain names (FQDNs) that can be accessed from a subnet. The FQDN can also [include SQL instances](sql-fqdn-filtering.md).
* Network rules that define source address, protocol, destination port, and destination address.

Network traffic is subjected to the configured firewall rules when you route your network traffic to the firewall as the subnet default gateway.

For this article, you create a simplified single VNet with three subnets for easy deployment. For production deployments, a [hub and spoke model](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke) is recommended. The firewall is in its own VNet. The workload servers are in peered VNets in the same region with one or more subnets.

* **AzureFirewallSubnet** - the firewall is in this subnet.
* **Workload-SN** - the workload server is in this subnet. This subnet's network traffic goes through the firewall.
* **AzureBastionSubnet** - Azure Bastion is in this subnet, providing secure access to the workload server.

:::image type="content" source="media/tutorial-firewall-rules-portal/Tutorial_network.png" alt-text="Diagram of network infrastructure." lightbox="media/tutorial-firewall-rules-portal/Tutorial_network.png":::

In this article, you learn how to:

* Set up a test network environment
* Deploy a firewall
* Create a default route
* Configure an application rule to allow access to www.microsoft.com
* Configure a network rule to allow access to external DNS servers
* Test the firewall

If you prefer, you can complete this procedure using the [Azure portal](tutorial-firewall-deploy-portal.md) or [Azure PowerShell](deploy-ps.md).

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- This article requires version 2.55.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Set up the network

First, create a resource group to contain the resources needed to deploy the firewall. Then create a VNet, subnets, and test servers.

### Create a resource group

The resource group contains all the resources for the deployment.

```azurecli-interactive
az group create --name Test-FW-RG --location eastus
```

### Create a VNet

This virtual network has three subnets.

> [!NOTE]
> The size of the AzureFirewallSubnet subnet is /26. For more information about the subnet size, see [Azure Firewall FAQ](firewall-faq.yml#why-does-azure-firewall-need-a--26-subnet-size).

```azurecli-interactive
az network vnet create \
  --name Test-FW-VN \
  --resource-group Test-FW-RG \
  --location eastus \
  --address-prefix 10.0.0.0/16 \
  --subnet-name AzureFirewallSubnet \
  --subnet-prefix 10.0.1.0/26
az network vnet subnet create \
  --name Workload-SN \
  --resource-group Test-FW-RG \
  --vnet-name Test-FW-VN   \
  --address-prefix 10.0.2.0/24
az network vnet subnet create \
  --name AzureBastionSubnet \
  --resource-group Test-FW-RG \
  --vnet-name Test-FW-VN   \
  --address-prefix 10.0.3.0/26
```

### Create a virtual machine

Create a NIC for Srv-Work with specific DNS server IP addresses and no public IP address to test with.

```azurecli-interactive
az network nic create \
    --resource-group Test-FW-RG \
    --name Srv-Work-NIC \
   --vnet-name Test-FW-VN \
   --subnet Workload-SN \
   --dns-servers <replace with External DNS ip #1> <replace with External DNS ip #2>
```

Now create the workload virtual machine. The following command creates an Ubuntu Server 22.04 LTS VM with SSH key authentication and installs Nginx. When prompted, save the generated private key to a `.pem` file for use when connecting through Azure Bastion.

```azurecli-interactive
az vm create \
    --resource-group Test-FW-RG \
    --name Srv-Work \
    --location eastus \
    --image Ubuntu2204 \
    --nics Srv-Work-NIC \
    --admin-username azureuser \
    --generate-ssh-keys \
    --custom-data cloud-init.txt
```

Create a `cloud-init.txt` file with the following content to install Nginx:

```yaml
#cloud-config
package_upgrade: true
packages:
  - nginx
runcmd:
  - echo '<h1>'$(hostname)'</h1>' | sudo tee /var/www/html/index.html
```

[!INCLUDE [ephemeral-ip-note.md](~/reusable-content/ce-skilling/azure/includes/ephemeral-ip-note.md)]

## Deploy the firewall

Now deploy the firewall into the virtual network.

```azurecli-interactive
az network firewall create \
    --name Test-FW01 \
    --resource-group Test-FW-RG \
    --location eastus
az network public-ip create \
    --name fw-pip \
    --resource-group Test-FW-RG \
    --location eastus \
    --allocation-method static \
    --sku standard
az network firewall ip-config create \
    --firewall-name Test-FW01 \
    --name FW-config \
    --public-ip-address fw-pip \
    --resource-group Test-FW-RG \
    --vnet-name Test-FW-VN
az network firewall update \
    --name Test-FW01 \
    --resource-group Test-FW-RG 
az network public-ip show \
    --name fw-pip \
    --resource-group Test-FW-RG
fwprivaddr="$(az network firewall ip-config list --resource-group Test-FW-RG --firewall-name Test-FW01 --query "[?name=='FW-config'].privateIpAddress" --output tsv)"
```

Note the private IP address. You'll use it later when you create the default route.

## Deploy Azure Bastion

Deploy Azure Bastion to securely connect to the Srv-Work virtual machine without requiring public IP addresses or a jump server.

```azurecli-interactive
az network public-ip create \
    --resource-group Test-FW-RG \
    --name bastion-pip \
    --sku Standard \
    --location eastus
az network bastion create \
    --name Test-Bastion \
    --public-ip-address bastion-pip \
    --resource-group Test-FW-RG \
    --vnet-name Test-FW-VN \
    --location eastus \
    --sku Basic
```

> [!NOTE]
> Azure Bastion deployment can take approximately 10 minutes to complete.

## Create a default route

Create a route table, with BGP route propagation disabled

```azurecli-interactive
az network route-table create \
    --name Firewall-rt-table \
    --resource-group Test-FW-RG \
    --location eastus \
    --disable-bgp-route-propagation true
```

Create the route.

```azurecli-interactive
az network route-table route create \
  --resource-group Test-FW-RG \
  --name DG-Route \
  --route-table-name Firewall-rt-table \
  --address-prefix 0.0.0.0/0 \
  --next-hop-type VirtualAppliance \
  --next-hop-ip-address $fwprivaddr
```

Associate the route table to the subnet

```azurecli-interactive
az network vnet subnet update \
    --name Workload-SN \
    --resource-group Test-FW-RG \
    --vnet-name Test-FW-VN \
    --address-prefixes 10.0.2.0/24 \
    --route-table Firewall-rt-table
```

## Configure an application rule

The application rule allows outbound access to www.microsoft.com.

```azurecli-interactive
az network firewall application-rule create \
   --collection-name App-Coll01 \
   --firewall-name Test-FW01 \
   --name Allow-Microsoft \
   --protocols Http=80 Https=443 \
   --resource-group Test-FW-RG \
   --target-fqdns www.microsoft.com \
   --source-addresses 10.0.2.0/24 \
   --priority 200 \
   --action Allow
```

Azure Firewall includes a built-in rule collection for infrastructure FQDNs that are allowed by default. These FQDNs are specific for the platform and can't be used for other purposes. For more information, see [Infrastructure FQDNs](infrastructure-fqdns.md).

## Configure a network rule

The network rule allows outbound access to two public DNS IP addresses of your choosing at port 53 (DNS).

```azurecli-interactive
az network firewall network-rule create \
   --collection-name Net-Coll01 \
   --destination-addresses <replace with DNS ip #1> <replace with DNS ip #2> \
   --destination-ports 53 \
   --firewall-name Test-FW01 \
   --name Allow-DNS \
   --protocols UDP \
   --resource-group Test-FW-RG \
   --priority 200 \
   --source-addresses 10.0.2.0/24 \
   --action Allow
```

## Test the firewall

Now, test the firewall to confirm that it works as expected.

1. Note the private IP address for the **Srv-Work** virtual machine:

   ```azurecli-interactive
   az vm list-ip-addresses \
   --resource-group Test-FW-RG \
   --name Srv-Work
   ```

1. In the Azure portal, navigate to the **Srv-Work** virtual machine and select **Connect** > **Connect via Bastion**.

1. Provide the username **azureuser** and upload the private key `.pem` file that was generated when you created the VM. Select **Connect** to open an SSH session.

1. In the SSH session, run the following commands to test DNS resolution:

   ```bash
   nslookup www.google.com
   nslookup www.microsoft.com
   ```

   Both commands should return answers, showing that your DNS queries are getting through the firewall.

1. Run the following commands to test web access:

   ```bash
   curl https://www.microsoft.com
   curl https://www.google.com
   ```

   The `www.microsoft.com` request should succeed and return HTML content, while the `www.google.com` request should fail or time out. This demonstrates that your firewall rules are operating as expected.

So now you've verified that the firewall rules are working:

* You can resolve DNS names using the configured external DNS server.
* You can browse to the one allowed FQDN, but not to any others.

## Clean up resources

You can keep your firewall resources for the next tutorial, or if no longer needed, delete the **Test-FW-RG** resource group to delete all firewall-related resources:

```azurecli-interactive
az group delete \
  --name Test-FW-RG
```

## Next steps

* [Tutorial: Monitor Azure Firewall logs](./firewall-diagnostics.md)
