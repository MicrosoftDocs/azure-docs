---
title: Enable private access (preview) - Hyperscale (Citus) - Azure Database for PostgreSQL
description: How to set up private link in a server group for Azure Database for PostgreSQL - Hyperscale (Citus)
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: how-to
ms.date: 10/12/2021
---

# Private access (preview) in Azure Database for PostgreSQL Hyperscale (Citus)

[Private access](concepts-hyperscale-private-access.md) (preview) allows
resources in an Azure virtual network to connect securely and privately to
nodes in a Hyperscale (Citus) server group. This howto assumes you've already
created a virtual network and subnet. For an example of setting up
prerequisites, see the [private access
tutorial](tutorial-hyperscale-private-access.md).

## Create a server group with a private endpoint

1. Select **Create a resource** in the upper left-hand corner of the Azure portal.

2. Select **Databases** from the **New** page, and select **Azure Database for
   PostgreSQL** from the **Databases** page.

3. For the deployment option, select the **Create** button under **Hyperscale
   (Citus) server group**.

4. Fill out the new server details form with your resource group, desired
   server group name, location, and database user password.

5. Select **Configure server group**, choose the desired plan, and select
   **Save**.

6. Select **Next: Networking** at the bottom of the page.

7. Select **Private access (preview)**.

	> [!NOTE]
	>
	> Private access is available for preview in only [certain
	> regions](concepts-hyperscale-limits.md#regions).
	>
	> If the private access option is not selectable for your server group
	> even though your server group is within an allowed region,
	> please open an Azure [support
	> request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest),
	> and include your Azure subscription ID, to get access.

8. A screen appears called **Create private endpoint**. Choose appropriate values
   for your existing resources, and click **OK**:

	- **Resource group**
	- **Location**
	- **Name**
	- **Target sub-resource**
	- **Virtual network**
	- **Subnet**
	- **Integrate with private DNS zone**

9. After creating the private endpoint, select **Review + create** to create
   your Hyperscale (Citus) server group.

## Enable private access on an existing server group

To create a private endpoint to a node in an existing server group, open the
**Networking** page for the server group.

1. Select **+ Add private endpoint**.

   :::image type="content" source="media/howto-hyperscale-private-access/networking.png" alt-text="Networking screen":::

1. In the **Basics** tab, confirm the **Subscription**, **Resource group**, and
   **Region**. Enter a **Name** for the endpoint, such as `my-server-group-eq`.

2. Select **Next: Resource >**. In the **Target sub-resource** choose the target
   node of the server group. Generally `coordinator` is the desired node.

3. Select **Next: Configuration >**. Choose the desired **Virtual network** and
   **Subnet**. Customize the **Private DNS integration** or accept its default
   settings.

4. Select **Next: Tags >** and add any desired tags.

5. Finally, select **Review + create >**. Review the settings and select
   **Create** when satisfied.

## Next steps

* Learn more about [private access](concepts-hyperscale-private-access.md)
  (preview).
* Follow a [tutorial](tutorial-hyperscale-private-access.md) to see private
  access (preview) in action.
