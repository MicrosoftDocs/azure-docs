---
title: 'Quickstart: Create an Azure Database for MySQL flexible server - Azure portal'
description: This article walks you through using the Azure portal to create an Azure Database for MySQL flexible server in minutes. 
author: savjani
ms.author: pariks
ms.service: mysql
ms.custom: mvc
ms.topic: quickstart
ms.date: 10/22/2020
---

# Quickstart: Use the Azure portal to create an Azure Database for MySQL flexible server

[[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]


Azure Database for MySQL Flexible Server is a managed service that you can use to run, manage, and scale highly available MySQL servers in the cloud. This quickstart shows you how to create a flexible server by using the Azure portal.

> [!IMPORTANT]
> Azure Database for MySQL Flexible Server is currently in public preview.

If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

## Sign in to the Azure portal
Go to the [Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal. The default view is your service dashboard.

## Create an Azure Database for MySQL flexible server

You create a flexible server with a defined set of [compute and storage resources](./concepts-compute-storage.md). You create the server within an [Azure resource group](../../azure-resource-manager/management/overview.md).

Complete these steps to create a flexible server:

1. Search for and select **Azure Database for MySQL servers** in the portal:
    
    > :::image type="content" source="./media/quickstart-create-server-portal/find-mysql-portal.png" alt-text="Screenshot that shows a search for Azure Database for MySQL servers.":::

2. Select **Create**. 

3. On the **Select Azure Database for MySQL deployment option** page, select **Flexible server** as the deployment option:
     
    > :::image type="content" source="./media/quickstart-create-server-portal/deployment-option.png" alt-text="Screenshot that shows the Flexible server option.":::    

4. On the **Basics** tab, enter the following information: 

    > :::image type="content" source="./media/quickstart-create-server-portal/create-form.png" alt-text="Screenshot that shows the Basics tab of the Flexible server page."::: 
                                    
    |**Setting**|**Suggested value**|**Description**|
    |---|---|---|
    Subscription|Your subscription name|The Azure subscription that you want to use for your server. If you have multiple subscriptions, choose the subscription in which you want to be billed for the resource.|
    Resource group|**myresourcegroup**| A new resource group name or an existing one from your subscription.|
    Server name |**mydemoserver**|A unique name that identifies your flexible server. The domain name `mysql.database.azure.com` is appended to the server name you provide. The server name can contain only lowercase letters, numbers, and the hyphen (-) character. It must contain between 3 and 63 characters.|
    Region|The region closest to your users| The location that's closest to your users.|
    Workload type| Development | For production workload, you can choose Small/Medium-size or Large-size depending on [max_connections](concepts-server-parameters.md#max_connections) requirements|
    Availability zone| No preference | If your application in Azure VMs, virtual machine scale sets or AKS instance is provisioned in a specific availability zone, you can specify your flexible server in the same availability zone to collocate application and database to improve performance by cutting down network latency across zones.|
    High Availability| Unchecked | For production servers, choose between [zone redundant high availability](https://docs.microsoft.com/azure/mysql/flexible-server/concepts-high-availability#zone-redundant-high-availability) and [same-zone high availability](https://docs.microsoft.com/azure/mysql/flexible-server/concepts-high-availability#same-zone-high-availability). This is highly recommended for business continuity and protection against VM failures|
    MySQL version|**5.7**| A MySQL major version.|
    Admin username |**mydemouser**| Your own sign-in account to use when you connect to the server. The admin user name can't be **azure_superuser**, **admin**, **administrator**, **root**, **guest**, or **public**.|
    Password |Your password| A new password for the server admin account. It must contain between 8 and 128 characters. It must also contain characters from three of the following categories: English uppercase letters, English lowercase letters, numbers (0 through 9), and non-alphanumeric characters (!, $, #, %, and so on).|
    Compute + storage | **Burstable**, **Standard_B1ms**, **10 GiB**, **100 iops**, **7 days** | The compute, storage, IOPS, and backup configurations for your new server. Select **Configure server**. **Burstable**, **Standard_B1ms**, **10 GiB**, **100 iops**, and **7 days** are the default values for **Compute tier**, **Compute size**, **Storage size**, **iops**, and backup **Retention period**. You can leave those values as is or adjust them. For faster data loads during migration, it is recommended to increase the IOPS to the maximum size supported by compute size and later scale it back to save cost. To save the compute and storage selection, select **Save** to continue with the configuration. The following screenshot shows the compute and storage options.|

    > :::image type="content" source="./media/quickstart-create-server-portal/high-availability.png" alt-text="Screenshot that shows high availability options.":::

    > :::image type="content" source="./media/quickstart-create-server-portal/compute-storage.png" alt-text="Screenshot that shows compute and storage options.":::

5. Configure networking options.

    On the **Networking** tab, you can choose how your server is reachable. Azure Database for MySQL Flexible Server provides two ways to connect to your server: 
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
> To avoid connectivity problems, check if your network allows outbound traffic over port 3306, which is used by Azure Database for MySQL Flexible Server.  

## Connect to the server by using mysql.exe

If you created your flexible server by using private access (VNet Integration), you'll need to connect to your server from a resource within the same virtual network as your server. You can create a virtual machine and add it to the virtual network created with your flexible server. Refer configuring [private access documentation](how-to-manage-virtual-network-portal.md) to learn more.

If you created your flexible server by using public access (allowed IP addresses), you can add your local IP address to the list of firewall rules on your server. Refer [create or manage firewall rules documentation](how-to-manage-firewall-portal.md) for step by step guidance.

You can use either [mysql.exe](https://dev.mysql.com/doc/refman/8.0/en/mysql.html) or [MySQL Workbench](./connect-workbench.md) to connect to the server from your local environment. Azure Database for MySQL Flexible Server supports connecting your client applications to the MySQL service using Transport Layer Security (TLS), previously known as Secure Sockets Layer (SSL). TLS is an industry standard protocol that ensures encrypted network connections between your database server and client applications, allowing you to adhere to compliance requirements.To connect with your MySQL flexible server, you will require to download the [public SSL certificate](https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem) for certificate authority verification.

The following example shows how to connect to your flexible server using the mysql command-line interface. You will first install the mysql command-line if it is not installed already. You will download the DigiCertGlobalRootCA certificate required for SSL connections. Use the --ssl-mode=REQUIRED connection string setting to enforce TLS/SSL certificate verification. Pass the local certificate file path to the --ssl-ca parameter. Replace values with your actual server name and password.

```bash
sudo apt-get install mysql-client
wget --no-check-certificate https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem
mysql -h mydemoserver.mysql.database.azure.com -u mydemouser -p --ssl-mode=REQUIRED --ssl-ca=DigiCertGlobalRootCA.crt.pem
```

If you have provisioned your flexible server using **public access**, you can also use [Azure Cloud Shell](https://shell.azure.com/bash) to connect to your flexible server using pre-installed mysql client as shown below:

In order to use Azure Cloud Shell to connect to your flexible server, you will need to allow networking access from Azure Cloud Shell to your flexible server. To achieve this, you can go to **Networking** blade on Azure portal for your MySQL flexible server and check the box under **Firewall** section which says, "Allow public access from any Azure service within Azure to this server" as shown in the screenshot below and click Save to persist the setting.

 > :::image type="content" source="./media/quickstart-create-server-portal/allow-access-to-any-azure-service.png" alt-text="Screenshot that shows how to allow Azure Cloud Shell access to MySQL flexible server for public access network configuration.":::

> [!NOTE]
> Checking the **Allow public access from any Azure service within Azure to this server** should be used for development or testing only. It configures the firewall to allow connections from IP addresses allocated to any Azure service or asset, including connections from the subscriptions of other customers.

Click on **Try it** to launch the Azure Cloud Shell and using the following commands to connect to your flexible server. Use your server name, user name, and password in the command. 

```azurecli-interactive
wget --no-check-certificate https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem
mysql -h mydemoserver.mysql.database.azure.com -u mydemouser -p --ssl=true --ssl-ca=DigiCertGlobalRootCA.crt.pem
```
> [!IMPORTANT]
>While connecting to your flexible server using Azure Cloud Shell, you will require to use --ssl=true parameter and not --ssl-mode=REQUIRED.
> The primary reason is Azure Cloud Shell comes with pre-installed mysql.exe client from MariaDB distribution which requires --ssl parameter while mysql client from Oracle's distribution requires --ssl-mode parameter.

If you see the following error message while connecting to your flexible server following the command earlier, you missed setting the firewall rule using the "Allow public access from any Azure service within Azure to this server" mentioned earlier or the option isn't saved. Please retry setting firewall and try again.

ERROR 2002 (HY000): Can't connect to MySQL server on <servername> (115)

## Clean up resources
You have now created an Azure Database for MySQL flexible server in a resource group. If you don't expect to need these resources in the future, you can delete them by deleting the resource group, or you can just delete the MySQL server. To delete the resource group, complete these steps:

1. In the Azure portal, search for and select **Resource groups**.
1. In the list of resource groups, select the name of your resource group.
1. In the **Overview** page for your resource group, select **Delete resource group**.
1. In the confirmation dialog box, type the name of your resource group, and then select **Delete**.

To delete the server, you can select **Delete** on **Overview** page for your server, as shown here:

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/quickstart-create-server-portal/delete-server.png" alt-text="Screenshot that shows how to delete a server.":::

## Next steps

> [!div class="nextstepaction"]
> [Build a PHP (Laravel) web app with MySQL](tutorial-php-database-app.md)
