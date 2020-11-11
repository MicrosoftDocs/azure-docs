---
title: 'Quickstart: Create an Azure DB for MySQL Flexible Server - Azure portal'
description: This article steps you through using the Azure portal to quickly create an Azure Database for MySQL Flexible Server in several minutes. 
author: ajlam
ms.author: andrela
ms.service: mysql
ms.custom: mvc
ms.topic: quickstart
ms.date: 10/22/2020
---

# Quickstart: Use the Azure portal to create an Azure Database for MySQL Flexible Server

Azure Database for MySQL Flexible Server is a managed service that you use to run, manage, and scale highly available MySQL servers in the cloud. This quickstart shows you how to create a flexible server in several using the Azure portal.

> [!IMPORTANT] 
> Azure Database for MySQL Flexible Server is currently in public preview

If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

## Sign in to the Azure portal
Open your web browser, and then go to the [Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal. The default view is your service dashboard.

## Create an Azure Database for MySQL Flexible Server

You create a flexible server with a defined set of [compute and storage resources](./concepts-compute-storage.md). You create the server within an [Azure resource group](../../azure-resource-manager/management/overview.md).

Follow these steps to create a flexible server:

1. Search for "Azure Database for MySQL" in the portal using the search box to find the service. 
    
    > :::image type="content" source="./media/quickstart-create-server-portal/find-mysql-portal.png" alt-text="Search for Azure Database for MySQL":::

2. Select **Add**. 

3. On the "Select deployment option page", select **Flexible server** as the deployment option.
     
    > :::image type="content" source="./media/quickstart-create-server-portal/deployment-option.png" alt-text="Pick deployment option":::    

4. Fill out the **Basics** form with the following information: 

    > :::image type="content" source="./media/quickstart-create-server-portal/create-form.png" alt-text="Create server form"::: 
                                    
    |**Setting**|**Suggested Value**|**Description**|
    |---|---|---|
    Subscription|Your subscription name|The Azure subscription that you want to use for your server. If you have multiple subscriptions, choose the subscription in which you'd like to be billed for the resource.|
    Resource group|*myresourcegroup*| A new resource group name or an existing one from your subscription.|
    Server name |*mydemoserver*|A unique name that identifies your flexible server. The domain name *mysql.database.azure.com* is appended to the server name you provide. The server can contain only lowercase letters, numbers, and the hyphen (-) character. It must contain at least 3 through 63 characters.|
    Admin username |*mydemouser*| Your own login account to use when you connect to the server. The admin login name can't be **azure_superuser**, **admin**, **administrator**, **root**, **guest**, or **public**.|
    Password |Your password| A new password for the server admin account. It must contain between 8 and 128 characters. Your password must contain characters from three of the following categories: English uppercase letters, English lowercase letters, numbers (0 through 9), and non-alphanumeric characters (!, $, #, %, etc.).|
    Region|The region closest to your users| The location that is closest to your users.|
    Version|5.7| MySQL major version.|
    Compute + storage | **Burstable**, **Standard_B1ms**, **10 GiB**, **7 days** | The compute, storage, and backup configurations for your new server. Select **Configure server**. *Burstable*, *Standard_B1ms*, *10 GiB*, and *7 days* are the default values for     **Compute tier**, **Compute size**, **Storage**, and **Backup Retention Period**. You can leave those sliders as is or adjust them. To save this compute and storage selection, select **Save** to continue with configurations. The below screenshot shows the compute and storage options.|
    
    > :::image type="content" source="./media/quickstart-create-server-portal/compute-storage.png" alt-text="Compute + storage":::

5. Configure Networking options

    On the Networking tab, you can choose how your server is reachable. Azure Database for MySQL Flexible Server provides two options to connect to your server via *Public access (allowed IP addresses)* and *Private access (VNet Integration)*. With *Public access (allowed IP addresses)*, access to your server is limited to allowed IP addresses added to a firewall rule. It prevents external applications and tools from connecting to the server and any databases on the server, unless you create a rule to open the firewall for a specific IP address or range. With *Private access (VNet Integration)*, access to your server is limited to your virtual network. In this quickstart, we show you how to enable public access to connect to the server. Learn more about connectivity methods in the [concepts article](./concepts-networking.md).

    > [!NOTE]
    > The connectivity method cannot be changed after creating the server. For example, if you selected *Public access (allowed IP addresses)* during create then you cannot change to *Private access (VNet Integration)* after create. We highly recommend creating a server with Private access to securely access your server using VNet Integration. Learn more about Private access in the [concepts article](./concepts-networking.md).

    > :::image type="content" source="./media/quickstart-create-server-portal/networking.png" alt-text="Configure networking":::  

6. Select **Review + create** to review your flexible server configuration.

7. Select **Create** to provision the server. Provisioning can take a few minutes.

8. Select **Notifications** on the toolbar (the bell icon) to monitor the deployment process. Once the deployment is done, you can select **Pin to dashboard**, which creates a tile for this flexible server on your Azure portal dashboard as a shortcut to the server's **Overview** page. Selecting **Go to resource** opens the server's **Overview** page.

By default, the following databases are created under your server: **information_schema**, **mysql**, **performance_schema**, and **sys**.

> [!NOTE]
> Check if your network allows outbound traffic over port 3306 that is used by Azure Database for MySQL Flexible Server to avoid connectivity issues.  

## Connect to using mysql command-line client

If you created your flexible server with *Private access (VNet Integration)*, you will need to connect to your server from a resource within the same VNet as your server. You can create a virtual machine and add it to the VNet created with your flexible server.

If you created your flexible server with *Public access (allowed IP addresses)*, you can add your local IP address to the list of firewall rules on your server.

You can choose either [mysql.exe](https://dev.mysql.com/doc/refman/8.0/en/mysql.html) or [MySQL Workbench](./connect-workbench.md) to connect to the server from your local environment. 

With mysql.exe, connect using the below command. Replace values with your actual server name and password. 

```bash
 mysql -h mydemoserver.mysql.database.azure.com -u mydemouser -p
```
## Clean up resources
You have successfully created an Azure Database for MySQL Flexible Server in a resource group.  If you don't expect to need these resources in the future, you can delete them by deleting the resource group or just delete the MySQL server. To delete the resource group, follow these steps:

1. In the Azure portal, search for and select **Resource groups**.
1. In the resource group list, choose the name of your resource group.
1. In the Overview page of your resource group, select **Delete resource group**.
1. In the confirmation dialog box, type the name of your resource group, and then select **Delete**.

To delete the server, you can click on **Delete** button on **Overview** page of your server as shown below:

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/quickstart-create-server-portal/delete-server.png" alt-text="Delete your resources":::

## Next steps

> [!div class="nextstepaction"]
> [Build a PHP (Laravel) web app with MySQL](tutorial-php-database-app.md)