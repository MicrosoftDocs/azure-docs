---
title: Create server group with private access - Hyperscale (Citus) - Azure Database for PostgreSQL
description: Connect a VM to a server group private endpoint
ms.author: jonels
author: jonels-msft
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: tutorial
ms.date: 01/14/2022
---

# Create server group with private access in Azure Database for PostgreSQL - Hyperscale (Citus)

This tutorial creates a virtual machine and a Hyperscale (Citus) server group,
and establishes [private access](concepts-private-access.md) between
them.

## Create a virtual network

First, we’ll set up a resource group and virtual network. It will hold our
server group and virtual machine.

```sh
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

For demonstration, we’ll use a virtual machine running Debian Linux, and the
`psql` PostgreSQL client.

```sh
# provision the VM
az vm create \
	--resource-group link-demo \
	--name link-demo-vm \
	--vnet-name link-demo-net \
	--subnet link-demo-subnet \
	--nsg link-demo-nsg \
	--public-ip-address link-demo-net-ip \
	--image debian \
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

## Create a server group with a private link

1. Select **Create a resource** in the upper left-hand corner of the Azure portal.

2. Select **Databases** from the **New** page, and select **Azure Database for
   PostgreSQL** from the **Databases** page.

3. For the deployment option, select the **Create** button under **Hyperscale
   (Citus) server group**.

4. Fill out the new server details form with the following information:

	- **Resource group**: `link-demo`
	- **Server group name**: `link-demo-sg`
	- **Location**: `East US`
	- **Password**: (your choice)

	> [!NOTE]
	>
	> The server group name must be globally unique across Azure because it
	> creates a DNS entry. If `link-demo-sg` is unavailable, please choose
	> another name and adjust the steps below accordingly.

5. Select **Configure server group**, choose the **Basic** plan, and select
   **Save**.

6. Select **Next: Networking** at the bottom of the page.

7. Select **Private access**.

8. A screen appears called **Create private endpoint**. Enter these values and
   select **OK**:

	- **Resource group**: `link-demo`
	- **Location**: `(US) East US`
	- **Name**: `link-demo-sg-c-pe1`
	- **Target sub-resource**: `coordinator`
	- **Virtual network**: `link-demo-net`
	- **Subnet**: `link-demo-subnet`
	- **Integrate with private DNS zone**: Yes

9. After creating the private endpoint, select **Review + create** to create
   your Hyperscale (Citus) server group.

## Access the server group privately from the virtual machine

The private link allows our virtual machine to connect to our server group,
and prevents external hosts from doing so. In this step, we'll check that
the `psql` database client on our virtual machine can communicate with the
coordinator node of the server group.

```sh
# save db URI
#
# obtained from Settings -> Connection Strings in the Azure portal
#
# replace {your_password} in the string with your actual password
PG_URI='host=c.link-demo-sg.postgres.database.azure.com port=5432 dbname=citus user=citus password={your_password} sslmode=require'

# attempt to connect to server group with psql in the virtual machine
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

We've seen how to create a private link between a virtual machine and a
Hyperscale (Citus) server group. Now we can deprovision the resources.

Delete the resource group, and the resources inside will be deprovisioned:

```sh
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
