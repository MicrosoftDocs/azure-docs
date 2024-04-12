---
title: 'Quickstart: Create a flexible server by using the Azure portal'
description: In this quickstart, learn how to deploy a database in an instance of Azure Database for MySQL - Flexible Server by using the Azure portal.
ms.service: mysql
ms.subservice: flexible-server
ms.topic: quickstart
author: shreyaaithal
ms.author: shaithal
ms.custom: mvc, mode-ui
ms.date: 06/13/2022
---

# Quickstart: Create an instance of Azure Database for MySQL - Flexible Server by using the Azure portal

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

Azure Database for MySQL - Flexible Server is a managed service that you can use to run, manage, and scale highly available MySQL servers in the cloud. This quickstart shows you how to create an Azure Database for MySQL flexible server by using the Azure portal.

If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

## Sign in to the Azure portal

In the [Azure portal](https://portal.azure.com), enter your credentials to sign in to the portal. The default view is your service dashboard.

## Create an Azure Database for MySQL flexible server

You create an instance of Azure Database for MySQL - Flexible Server by using a defined set of [compute and storage resources](./concepts-compute-storage.md) to create a flexible server. Create the server within an [Azure resource group](../../azure-resource-manager/management/overview.md).

Complete these steps to create an Azure Database for MySQL flexible server:

1. In the Azure portal, search for and then select **Azure Database for MySQL servers**:

    :::image type="content" source="./media/quickstart-create-server-portal/find-mysql-portal.png" alt-text="Screenshot that shows a search for Azure Database for MySQL servers.":::

1. Select **Create**.

1. On the **Select Azure Database for MySQL deployment option** pane, select **Flexible server** as the deployment option:

    :::image type="content" source="./media/quickstart-create-server-portal/azure-mysql-deployment-option.png" alt-text="Screenshot that shows the Flexible server option.":::

1. On the **Basics** tab, enter or select the following information:

   |Setting|Suggested value|Description|
   |---|---|---|
   |**Subscription**|Your subscription name|The Azure subscription that you want to use for your server. If you have multiple subscriptions, choose the subscription in which you want to be billed for the resource.|
   |**Resource group**|**myresourcegroup**| Create a new resource group name, or select an existing resource group from your subscription.|
   |**Server name** |**mydemoserver**|A unique name that identifies your instance of Azure Database for MySQL - Flexible Server. The domain name `mysql.database.azure.com` is appended to the server name that you enter. The server name can contain only lowercase letters, numbers, and the hyphen (`-`) character. It must contain between 3 and 63 characters.|
   |**Region**|The region closest to your users| The location that's closest to your users.|
   |**Workload type**| Development | For  production workload, you can select **Small/Medium-size** or **Large-size** depending on [max_connections](concepts-server-parameters.md#max_connections) requirements|
   |**Availability zone**| No preference | If your application client is provisioned in a specific availability zone, you can set your Azure Database for MySQL flexible server to the same availability zone to colocate the application and reduce network latency.|
   |**High availability**| Cleared | For production servers, choose between [zone-redundant high availability](concepts-high-availability.md#zone-redundant-ha-architecture) and [same-zone high availability](concepts-high-availability.md#same-zone-ha-architecture). We recommend that you use high availability for business continuity and protection against virtual machine (VM) failure.|
   |**Standby availability zone**| No preference| Choose the standby server zone location. Colocate the server with the application standby server in case a zone failure occurs. |
   |**MySQL version**|**5.7**| A major version of MySQL.|
   |**Admin username** |**mydemouser**| Your own sign-in account to use when you connect to the server. The admin username can't be **azure_superuser**, **admin**, **administrator**, **root**, **guest**, **sa**, or **public**. The maximum number of characters that are allowed is 32. |
   |**Password** |Your password| A new password for the server admin account. It must contain between 8 and 128 characters. It also must contain characters from three of the following categories: English uppercase letters, English lowercase letters, numbers (0 through 9), and nonalphanumeric characters (`!`, `$`, `#`, `%`, and so on).|
   |**Compute + storage** | **Burstable**, **Standard_B1ms**, **10 GiB**, **100 iops**, **7 days** | The compute, storage, input/output operations per second (IOPS), and backup configurations for your new server. On the **Configure server** pane, the default values for **Compute tier**, **Compute size**, **Storage size**, **iops**, and **Retention period** (for backup) are **Burstable**, **Standard_B1ms**, **10 GiB**, **100 iops**, and **7 days**. You can keep the default values or modify these values. For faster data loads during migration, we recommend that you increase IOPS to the maximum size that's supported for the compute size that you selected. Later, scale it back to minimize cost. To save the compute and storage selection, select **Save** to continue with the configuration. <!-- The following screenshot shows compute and storage options. -->|

1. Next, configure networking options.

   On the **Networking** tab, set how your server is accessed. Azure Database for MySQL - Flexible Server offers two ways to connect to your server:

   - Public access (allowed IP addresses)
   - Private access (virtual network integration)

   When you use public access, access to your server is limited to the allowed IP addresses that you add to a firewall rule. Using this method prevents external applications and tools from connecting to the server and any databases on the server, unless you create a rule to open the firewall for a specific IP address or range of IP addresses. When you select **Create an azuredeploy.json file**, access to your server is limited to your virtual network. For more information about private access, see the [concepts](./concepts-networking.md) article.

   In this quickstart, you learn how to set public access to connect to the server. On the **Networking tab**, for **Connectivity method**, select **Public access**. To set firewall rules, select **Add current client IP address**.

   > [!NOTE]
   > You can't change the connectivity method after you create the server. For example, if you select **Public access (allowed IP addresses)** when you create the server, you can't change the setting to **Private access (VNet Integration)** after the server is deployed. We highly recommend that you create your server to use private access to help secure access to your server via virtual network integration. For more information about private access, see the [concepts](./concepts-networking.md) article.
   >
   > :::image type="content" source="./media/quickstart-create-server-portal/networking.png" alt-text="Screenshot that shows the Networking tab.":::
   >

1. Select **Review + create** to review your Azure Database for MySQL flexible server configuration.

1. Select **Create** to provision the server. Provisioning might take a few minutes.

1. On the toolbar, select **Notifications** (the bell icon) to monitor the deployment process. When deployment is finished, you can select **Pin to dashboard** to create a tile for the Azure Database for MySQL flexible server on your Azure portal dashboard. This tile is a shortcut to the server's **Overview** pane. When you select **Go to resource**, the **Overview** pane for the flexible server opens.

By default, these databases are created under your server: **information_schema**, **mysql**, **performance_schema**, and **sys**.

> [!NOTE]
> To avoid connectivity problems, check whether your network allows outbound traffic through port 3306, the port that Azure Database for MySQL - Flexible Server uses.

## Connect to the server

Before you get started, download the [public SSL certificate](https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem) to use for certificate authority verification.

If you deploy Azure Database for MySQL - Flexible Server by using the public access connectivity method, you can get started quickly by using the built-in MySQL command-line client tool or Azure Cloud Shell. To use the command-line tool, on the menu bar on the **Overview** pane, select **Connect**.

:::image type="content" source="./media/quickstart-create-server-portal/connect-on-overview.png" alt-text="Screenshot that how to connect with Azure Cloud Shell.":::

After you select **Connect**, you can see details about how to connect locally by using the Azure Database for MySQL - Flexible Server client tool and how to initiate data import and export operations.

:::image type="content" source="./media/quickstart-create-server-portal/connect-mysql-flexible-server.png" alt-text="Screenshot that shows the Connect pane.":::

> [!IMPORTANT]
> If you see the following error message when you connect to your Azure Database for MySQL flexible server, either you didn't select the **Allow public access from any Azure service within Azure to this server** checkbox when you set up your firewall rules, or the option isn't saved. Set the firewall rules, and then try again.
>
> `ERROR 2002 (HY000): Can't connect to MySQL server on <servername> (115)`

## Clean up resources

When you no longer need the resources that you created to use in this quickstart, you can delete the resource group that contains the Azure Database for MySQL - Flexible Server instance. Select the resource group for the Azure Database for MySQL - Flexible Server resource, and then select **Delete**. Enter the name of the resource group that you want to delete.

## Next step

To learn about other ways to deploy a flexible server, go to the next quickstart. You also can learn how to [build a PHP (Laravel) web app by using MySQL](tutorial-php-database-app.md).

> [!div class="nextstepaction"]
> [Connect to an instance of Azure Database for MySQL - Flexible Server in a virtual network](./quickstart-create-connect-server-vnet.md)
