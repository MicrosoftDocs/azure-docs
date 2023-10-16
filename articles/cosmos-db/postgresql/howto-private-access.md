---
title: Enable private access - Azure Cosmos DB for PostgreSQL
description: See how to set up private link in a cluster for Azure Cosmos DB for PostgreSQL.
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 09/24/2022
---

# Enable private access in Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

[Private access](concepts-private-access.md) allows resources in an Azure
virtual network to connect securely and privately to nodes in a
cluster. This how-to assumes you've already created a virtual
network and subnet. For an example of setting up prerequisites, see the
[private access tutorial](tutorial-private-access.md).

## Create a cluster with a private endpoint

1. Select **Create a resource** in the upper left-hand corner of the Azure portal.
1. On the **Create a resource** page, select **Databases**, and then select **Azure Cosmos DB**.
1. On the **Select API option** page, on the **PostgreSQL** tile, select **Create**.
1. On the **Create an Azure Cosmos DB for PostgreSQL cluster** page, select or create a **Resource group**, enter a **Cluster name** and **Location**, and enter and confirm the administrator **Password**.
1. Select **Next: Networking**.
1. On the **Networking** tab, for **Connectivity method**, select **Private access**.
1. On the **Create private endpoint** screen, enter or select appropriate values for:
   - **Resource group**
   - **Location**
   - **Name**
   - **Target sub-resource**
   - **Virtual network**
   - **Subnet**
   - **Integrate with private DNS zone**
1. Select **OK**.
1. After you create the private endpoint, select **Review + create** and then select **Create** to create your cluster.

## Enable private access on an existing cluster

To create a private endpoint to a node in an existing cluster, open the
**Networking** page for the cluster.

1. Select **Add private endpoint**.

   :::image type="content" source="media/howto-private-access/networking.png" alt-text="Screenshot of selecting Add private endpoint on the Networking screen.":::

2. On the **Basics** tab of the **Create a private endpoint** screen, confirm the **Subscription**, **Resource group**, and
   **Region**. Enter a **Name** for the endpoint, such as *my-cluster-1*, and a **Network interface name**, such as *my-cluster-1-nic*.

   > [!NOTE]
   >
   > Unless you have a good reason to choose otherwise, we recommend picking a
   > subscription and region that match those of your cluster. The
   > default values for the form fields might not be correct. Check them and
   > update if necessary.

3. Select **Next: Resource**. For **Target sub-resource**, choose the target
   node of the cluster. Usually **coordinator** is the desired node.

4. Select **Next: Virtual Network**. Choose the desired **Virtual network** and
   **Subnet**. Under **Private IP configuration**, select **Statically allocate IP address** or keep the default, **Dynamically allocate IP address**.

1. Select **Next: DNS**.
1. Under **Private DNS integration**, for **Integrate with private DNS zone**, keep the default **Yes** or select **No**.

5. Select **Next: Tags**, and add any desired tags.

6. Select **Review + create**. Review the settings, and select
   **Create** when satisfied.

## Next steps

* Learn more about [private access](concepts-private-access.md).
* Follow a [tutorial](tutorial-private-access.md) to see private access in
  action.
