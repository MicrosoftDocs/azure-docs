---
title: 'Quickstart: Create an Azure Database for MySQL - Flexible Server - Azure portal'
description: This article walks you through using the Azure portal to create an Azure Database for MySQL - Flexible Server in minutes.
ms.service: mysql
ms.subservice: flexible-server
ms.topic: quickstart
author: shreyaaithal
ms.author: shaithal
ms.custom: mvc, mode-ui
ms.date: 06/13/2022
---

# Quickstart: Use the Azure portal to create an Azure Database for MySQL - Flexible Server

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]


Azure Database for MySQL - Flexible Server is a managed service that you can use to run, manage, and scale highly available MySQL servers in the cloud. This quickstart shows you how to create a flexible server by using the Azure portal.

If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

## Sign in to the Azure portal
Sign in to the [Azure portal](https://portal.azure.com). Enter your credentials to sign in to the portal. The default view is your service dashboard.

## Create an Azure Database for MySQL flexible server

You create a flexible server with a defined set of [compute and storage resources](./concepts-compute-storage.md). You create the server within an [Azure resource group](../../azure-resource-manager/management/overview.md).

Complete these steps to create a flexible server:

1. Search for and select **Azure Database for MySQL servers** in the portal:

    > :::image type="content" source="./media/quickstart-create-server-portal/find-mysql-portal.png" alt-text="Screenshot that shows a search for Azure Database for MySQL servers.":::

2. Select **Create**.

3. On the **Select Azure Database for MySQL deployment option** page, select **Flexible server** as the deployment option:

    > :::image type="content" source="./media/quickstart-create-server-portal/azure-mysql-deployment-option.png" alt-text="Screenshot that shows the Flexible server option.":::

4. On the **Basics** tab, enter the following information:

    > :::image type="content" source="./media/quickstart-create-server-portal/create-form.png" alt-text="Screenshot that shows the Basics tab of the Flexible server page.":::

    |**Setting**|**Suggested value**|**Description**|
    |---|---|---|
    Subscription|Your subscription name|The Azure subscription that you want to use for your server. If you have multiple subscriptions, choose the subscription in which you want to be billed for the resource.|
    Resource group|**myresourcegroup**| A new resource group name or an existing one from your subscription.|
    Server name |**mydemoserver**|A unique name that identifies your flexible server. The domain name `mysql.database.azure.com` is appended to the server name you provide. The server name can contain only lowercase letters, numbers, and the hyphen (-) character. It must contain between 3 and 63 characters.|
    Region|The region closest to your users| The location that's closest to your users.|
    Workload type| Development | For production workload, you can choose Small/Medium-size or Large-size depending on [max_connections](concepts-server-parameters.md#max_connections) requirements|
    Availability zone| No preference | If your application client is provisioned in a specific availability zone, you can specify your flexible server in the same availability zone to collocate application cutting down network latency across zones.|
    High Availability| Unchecked | For production servers, choose between [zone redundant high availability](concepts-high-availability.md#zone-redundant-ha-architecture) and [same-zone high availability](concepts-high-availability.md#same-zone-ha-architecture). This is highly recommended for business continuity and protection against VM failures|
    |Standby availability zone| No preference| Choose the standby server zone location and colocate it with the application standby server in case of zone failure |
    MySQL version|**5.7**| A MySQL major version.|
    Admin username |**mydemouser**| Your own sign-in account to use when you connect to the server. The admin user name can't be **azure_superuser**, **admin**, **administrator**, **root**, **guest**, **sa**, or **public**.|
    Password |Your password| A new password for the server admin account. It must contain between 8 and 128 characters. It must also contain characters from three of the following categories: English uppercase letters, English lowercase letters, numbers (0 through 9), and non-alphanumeric characters (!, $, #, %, and so on).|
    Compute + storage | **Burstable**, **Standard_B1ms**, **10 GiB**, **100 iops**, **7 days** | The compute, storage, IOPS, and backup configurations for your new server. Select **Configure server**. **Burstable**, **Standard_B1ms**, **10 GiB**, **100 iops**, and **7 days** are the default values for **Compute tier**, **Compute size**, **Storage size**, **iops**, and backup **Retention period**. You can leave those values as is or adjust them. For faster data loads during migration, it is recommended to increase the IOPS to the maximum size supported by compute size and later scale it back to save cost. To save the compute and storage selection, select **Save** to continue with the configuration. The following screenshot shows the compute and storage options.|

    > :::image type="content" source="./media/quickstart-create-server-portal/compute-storage.png" alt-text="Screenshot that shows compute and storage options.":::

5. Configure networking options.

    On the **Networking** tab, you can choose how your server is reachable. Azure Database for MySQL - Flexible Server provides two ways to connect to your server:
   - Public access (allowed IP addresses)
   - Private access (VNet Integration)

    When you use public access, access to your server is limited to allowed IP addresses that you add to a firewall rule. This method prevents external applications and tools from connecting to the server and any databases on the server, unless you create a rule to open the firewall for a specific IP address or range. When you use private access (VNet Integration), access to your server is limited to your virtual network. [Learn more about connectivity methods in the concepts article.](./concepts-networking.md)

     In this quickstart, you'll learn how to enable public access to connect to the server. On the **Networking tab**, for **Connectivity method** select **Public access**. For configuring **Firewall rules**, select **Add current client IP address**.

    > [!NOTE]
    > You can't change the connectivity method after you create the server. For example, if you select **Public access (allowed IP addresses)** when you create the server, you can't change to **Private access (VNet Integration)** after the server is created. We highly recommend that you create your server with private access to help secure access to your server via VNet Integration. [Learn more about private access in the concepts article.](./concepts-networking.md)

    > :::image type="content" source="./media/quickstart-create-server-portal/networking.png" alt-text="Screenshot that shows the Networking tab.":::

6. Select **Review + create** to review your flexible server configuration.

7. Select **Create** to provision the server. Provisioning can take a few minutes.

8. Select **Notifications** on the toolbar (the bell button) to monitor the deployment process. After the deployment is done, you can select **Pin to dashboard**, which creates a tile for the flexible server on your Azure portal dashboard. This tile is a shortcut to the server's **Overview** page. When you select **Go to resource**, the server's **Overview** page opens.

By default, these databases are created under your server: information_schema, mysql, performance_schema, and sys.

> [!NOTE]
> To avoid connectivity problems, check if your network allows outbound traffic over port 3306, which is used by Azure Database for MySQL - Flexible Server.

## Connect to the server 
Before getting started, download the [public SSL certificate](https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem) for certificate authority verification. 

For MySQL servers created with **public access** connectivity method, you can get started quickly with built-in MySQL command line client tool by clicking on **Connect** button in **Overview** page.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/quickstart-create-server-portal/connect-on-overview.png" alt-text="Screenshot that how to connect with Azure cloud shell.":::

You can go to **Connect** page to view more details on how to connect locally with MySQL client tool or perform import and export data operations. 

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/quickstart-create-server-portal/connect-mysql-flexible-server.png" alt-text="Screenshot that shows connect page.":::

> [!IMPORTANT]
> If you see the following error message while connecting to your flexible server following the command earlier, you missed setting the firewall rule using the "Allow public access from any Azure service within Azure to this server" mentioned earlier or the option isn't saved. Please retry setting firewall and try again.
> ERROR 2002 (HY000): Can't connect to MySQL server on \<servername\> (115)

## Clean up resources
When no longer needed, you can delete the resource group with MySQL Flexible Server. To do so, select the resource group for the MySQL flexible server resource and select **Delete**, then confirm the name of the resource group to delete.

## Next steps

> [!div class="nextstepaction"]
> [Build a PHP (Laravel) web app with MySQL](tutorial-php-database-app.md)

> [!div class="nextstepaction"]
> [Connect to a MySQL server in a virtual network](./quickstart-create-connect-server-vnet.md)
