---
title: Create a cluster with private access - Azure Cosmos DB for PostgreSQL
description: Use Azure CLI to create a virtual network and virtual machine, then connect the VM to a cluster private endpoint.
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: ignite-2022, devx-track-azurecli
ms.topic: tutorial
ms.date: 06/05/2023
---

# Connect to a cluster with private access in Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

This tutorial creates a virtual machine (VM) and an Azure Cosmos DB for PostgreSQL cluster,
and establishes [private access](concepts-private-access.md) between
them.

## Prerequisites

- An Azure account with an active subscription. If you don't have one, [create an account for free](https://azure.microsoft.com/free).
- If you want to run the code locally, [Azure CLI](/cli/azure/install-azure-cli) installed. You can also run the code in [Azure Cloud Shell](../../cloud-shell/overview.md).

## Create a virtual network

First, set up a resource group and virtual network to hold your cluster and VM.

```azurecli
az group create \
	--name link-demo \
	--location eastus

az network vnet create \
	--resource-group link-demo \
	--name link-demo-net \
	--address-prefix 10.0.0.0/16

az network nsg create \
	--resource-group link-demo \
	--name link-demo-nsg

az network vnet subnet create \
	--resource-group link-demo \
	--vnet-name link-demo-net \
	--name link-demo-subnet \
	--address-prefixes 10.0.1.0/24 \
	--network-security-group link-demo-nsg
```

## Create a virtual machine

For demonstration, create a VM running Debian Linux and the `psql` PostgreSQL client.

```azurecli
# provision the VM

az vm create \
	--resource-group link-demo \
	--name link-demo-vm \
	--vnet-name link-demo-net \
	--subnet link-demo-subnet \
	--nsg link-demo-nsg \
	--public-ip-address link-demo-net-ip \
	--image Debian11 \
	--admin-username azureuser \
	--generate-ssh-keys

# install psql database client

az vm run-command invoke \
	--resource-group link-demo \
	--name link-demo-vm \
	--command-id RunShellScript \
	--scripts \
		"sudo touch /home/azureuser/.hushlogin" \
		"sudo DEBIAN_FRONTEND=noninteractive apt-get update" \
		"sudo DEBIAN_FRONTEND=noninteractive apt-get install -q -y postgresql-client"
```

## Create a cluster with a private link

Create your Azure Cosmos DB for PostgreSQL cluster in the [Azure portal](https://portal.azure.com).

1. In the portal, select **Create a resource** in the upper left-hand corner.
1. On the **Create a resource** page, select **Databases**, and then select **Azure Cosmos DB**.
1. On the **Select API option** page, on the **PostgreSQL** tile, select **Create**.
1. On the **Create an Azure Cosmos DB for PostgreSQL cluster** page, fill out the following information:

   - **Resource group**: Select **New**, then enter *link-demo*.
   - **Cluster name**: Enter *link-demo-sg*.

     > [!NOTE]
     > The cluster name must be globally unique across Azure because it
     > creates a DNS entry. If `link-demo-sg` is unavailable, enter another name and adjust the following steps accordingly.

   - **Location**: Select **East US**.
   - **Password**: Enter and then confirm a password.

1. Select **Next: Networking**.
1. On the **Networking** tab, for **Connectivity method**, select **Private access**.
1. On the **Create private endpoint** screen, enter or select the following values:

   - **Resource group**: `link-demo`
   - **Location**: `(US) East US`
   - **Name**: `link-demo-sg-c-pe1`
   - **Target sub-resource**: `coordinator`
   - **Virtual network**: `link-demo-net`
   - **Subnet**: `link-demo-subnet`
   - **Integrate with private DNS zone**: Yes

1. Select **OK**.
1. After you create the private endpoint, select **Review + create** and then select **Create** to create your cluster.

## Access the cluster privately from the VM

The private link allows the VM to connect to the cluster, and prevents external hosts from doing so. In this step, you check that the psql database client on your VM can communicate with the coordinator node of the cluster. In the code, replace `{your_password}` with your cluster password.

```azurecli
# replace {your_password} in the string with your actual password

PG_URI='host=c-link-demo-sg.12345678901234.postgres.cosmos.azure.com port=5432 dbname=citus user=citus password={your_password} sslmode=require'

# Attempt to connect to cluster with psql in the VM

az vm run-command invoke \
	--resource-group link-demo \
	--name link-demo-vm \
	--command-id RunShellScript \
	--scripts "psql '$PG_URI' -c 'SHOW citus.version;'" \
	--query 'value[0].message' \
	| xargs printf
```

You should see a version number for Citus in the output. If you do, then psql
was able to execute the command, and the private link worked.

## Clean up resources

You've seen how to create a private link between a VM and a
cluster. Now you can deprovision the resources.

Delete the resource group, and the resources inside will be deprovisioned:

```azurecli
az group delete --resource-group link-demo

# press y to confirm
```

## Next steps

* Learn more about [private access](concepts-private-access.md)
* Learn about [private
  endpoints](../../private-link/private-endpoint-overview.md)
* Learn about [virtual
  networks](../../virtual-network/concepts-and-best-practices.md)
* Learn about [private DNS zones](../../dns/private-dns-overview.md)
