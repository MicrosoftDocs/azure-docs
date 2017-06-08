---
title: 'Quickstart: Create Azure Database for MySQL server - Azure portal | Microsoft Docs'
description: This article steps you through using the Azure portal to quickly create a sample Azure Database for MySQL server in about five minutes. 
services: mysql
author: v-chenyh
ms.author: v-chenyh
manager: jhubbard
editor: jasonh
ms.assetid: 
ms.service: mysql
ms.devlang: na
ms.topic: hero-article
ms.tgt_pltfrm: portal
ms.date: 06/07/2017
ms.custom: mvc
---

# Create an Azure Database for MySQL server using Azure portal
This article walks you through using the Azure portal to create an Azure Database for MySQL server in about five minutes. 

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Log in to Azure
Open your web browser, and navigate to the [Microsoft Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal. The default view is your service dashboard.

## Create Azure Database for MySQL server
1. Click the **New** button found on the upper left corner of the Azure portal.

2. Select **Databases** from the **New** page, and select **Azure Database for MySQL** from the **Databases** page. You can also type **MySQL** in the New page search box to find the service.
![Azure portal - new - database - MySQL](./media/quickstart-create-mysql-server-database-using-azure-portal/2_navigate-to-mysql.png)

3. Fill out the new server details form with the following information, as shown on the preceding image:
| **Setting** | **Suggested value** | **Field Description** |
|---|---|---|
| *Server name* | myserver4demo  | Server name has to be globally unique. |
| *Subscription* | mysubscription | Select your subscription from the drop-down. |
| *Resource group* | myresourcegroup | Create a resource group or use an existing one. |
| *Server admin login* | myadmin | Setup admin account name. |
| *Password* |  | Set a strong admin account password. |
| *Confirm password* |  | Confirm the admin account password. |
| *Location* |  | Select an available region. |
| *Version* | 5.7 | Choose the latest version. |
| *Configure performance* | Basic, 50 compute units, 50 GB  | Choose **Pricing tier**, **Compute Units**, **Storage (GB)**, and then click **OK**. |
| *Pin to Dashboard* | Check | Recommended to check this box so you may find the server easily later on |

Click **Configure performance** to specify the pricing tier and performance level for your new database. For this quick start, select Basic Tier, 50 Compute Units and 50 GB of included storage. Then click **OK** to save the pricing tier.
![Azure portal - create MySQL by providing the required form input](./media/quickstart-create-mysql-server-database-using-azure-portal/3_create-server.png)

Then, click **Create**. In a minute or two, a new Azure Database for MySQL server is running in the cloud. Click **Notifications** (bell icon) button on the toolbar to monitor the deployment process.

## Configure the firewall
Before connecting to Azure Database for MySQL from your client for the first time, you must configure the firewall and add the client's public network IP address (or IP address range) to the whitelist.

1. After the deployment completes, click **All Resources** from the left-hand menu and type in the name **myserver4demo** to search for your newly created server. Click the server name listed in the search result. The Overview page for your server opens and provides options for further configuration.

2. In the server blade, select **Connection Security**.

3. Click **Add My IP** to add your local computer's IP address, or configure a range of IP addresses. Remember to click **Save** after you have created the rules.
  ![Azure portal - add firewall rule and save](./media/quickstart-create-mysql-server-database-using-azure-portal/5_firewall-settings.png)

## Get connection information
Get the fully qualified domain name for your Azure MySQL server in the Azure portal. You use the fully qualified domain name to connect to your server using the **mysql.exe** command line tool.

1.	In [Azure portal](https://portal.azure.com/), click **All resources** from the left-hand menu, and click your Azure Database for MySQL server.

2.	Click **Properties**. Note down **SERVER NAME** and **SERVER ADMIN LOGIN**.
In this example, the server name is *myserver4demo.mysql.database.azure.com*, and the server admin login is *myadmin@myserver4demo*.

## Connect to the server using mysqlexe command-line tool
Use [mysql command-line tool](https://dev.mysql.com/doc/refman/5.7/en/mysql.html) to establish a connection to your Azure Database for MySQL server. You can run the mysql command-line tool from the Azure Cloud Shell in the browser or from your own machine using mysql tools installed locally. To launch the Azure Cloud Shell, click the `Try It` button on a code block in this article, or visit the Azure portal and click the `>_` icon in the top right toolbar. 

Type the command to connect:
```azurecli-interactive
mysql -h myserver4demo.mysql.database.azure.com -u myadmin@myserver4demo -p
```

2. View server status:

```sql
 mysql> status
```
  ![Command prompt - mysql command line example](./media/quickstart-create-mysql-server-database-using-azure-portal/7_connect-to-server.png)

> [!TIP]
> For additional commands, see [MySQL 5.6 Reference Manual - Chapter 4.5.1](https://dev.mysql.com/doc/refman/5.6/en/mysql.html).

You can create multiple databases within a MySQL server. There is no limit to the number of databases that can be created, but multiple databases share the same server resources.  

## Connect to the server using the MySQL Workbench GUI tool
1.	Launch the MySQL Workbench application on your client computer. You can download and install MySQL Workbench from [here](https://dev.mysql.com/downloads/workbench/).

2.	In **Setup New Connection** dialog box, enter the following information on **Parameters** tab:

![setup new connection](./media/quickstart-create-mysql-server-database-using-azure-portal/setup-new-connection.png)

| **Setting** | **Suggested value** | **Field Description** |
|---|---|---|
|	*Connection Name* | My Connection| Specify a label for this connection. |
| *Connection Method* | Standard (TCP/IP) | Standard (TCP/IP) is sufficient. |
| *Hostname* | myserver4demo.mysql.database.azure.com | Use the fully qualified server name for your server. |
| *Port* | 3306 | Use the default port 3306. |
| *Username* | myadmin@myserver4demo  | Use the server admin login you noted previously. |
| *Password* | your password | Click Store in Vault... button to save the password. |

3.	Click **Test Connection** to test if all parameters are correctly configured.

4.	Now, you can click the connection just created to successfully connect to the server.

> [!NOTE]
> SSL is enforced by default on your server which requires extra configuration in order to connect successfully. See [Configure SSL connectivity in your application to securely connect to Azure Database for MySQL](./howto-configure-ssl.md).  If you want to disable SSL for this quick start, visit the the Azure portal and click the Connection security page to disable the Enforce SSL connection toggle button.

## Clean up resources
If you don't need these resources for another quickstart/tutorial, you can delete them by doing the following:

1. From the left-hand menu in the Azure portal, click **Resource groups** and then click **myresource**. 
2. On your resource group page, click **Delete**, type **myresource** in the text box, and then click **Delete**.

## Next steps

> [!div class="nextstepaction"]
> [Design your first Azure Database for MySQL database](./tutorial-design-database-using-portal.md)

