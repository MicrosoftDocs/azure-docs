---
title: Configure SSL connectivity to securely connect to Azure Database for MySQL | Microsoft Docs
description: Instructions for how to properly configure Azure Database for MySQL and associated applications to correctly use SSL connections
services: mysql
author: seanli1988
ms.author: seanli
editor: jasonwhowell
manager: jhubbard
ms.service: mysql-database
ms.topic: article
ms.date: 09/15/2017
---
# Configure SSL connectivity in your application to securely connect to Azure Database for MySQL
Azure Database for MySQL supports connecting your Azure Database for MySQL server to client applications using Secure Sockets Layer (SSL). Enforcing SSL connections between your database server and your client applications helps protect against "man in the middle" attacks by encrypting the data stream between the server and your application.

## Step 1: Obtain SSL certificate
Download the certificate needed to communicate over SSL with your Azure Database for MySQL server from [https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem](https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem) and save the certificate file to your local drive (with this tutorial, we used c:\ssl).
**For Microsoft Internet Explorer and Microsoft Edge:** After the download has completed, rename the certificate to BaltimoreCyberTrustRoot.crt.pem.

## Step 2: Bind SSL
### Connecting to server using the MySQL Workbench over SSL
Configure the MySQL Workbench to connect securely over SSL. in the MySQL Workbench on the Setup New Connection dialogue, navigate to the **SSL** tab. In the **SSL CA File:** field, enter the file location of the **BaltimoreCyberTrustRoot.crt.pem**.
![save customized tile](./media/howto-configure-ssl/mysql-workbench-ssl.png)

### Connecting to server using the MySQL CLI over SSL
Using the MySQL command-line interface, execute the following command:
```dos
mysql.exe -h mysqlserver4demo.mysql.database.azure.com -u Username@mysqlserver4demo -p --ssl-ca=c:\ssl\BaltimoreCyberTrustRoot.crt.pem
```

## Step 3:  Enforcing SSL connections in Azure 
### Using the Azure portal
Using the Azure portal, visit your Azure Database for MySQL server, and then click **Connection security**. Use the toggle button to enable or disable the **Enforce SSL connection** setting, and then click **Save**. Microsoft recommends to always enable the **Enforce SSL connection** setting for enhanced security.
![enable-ssl](./media/howto-configure-ssl/enable-ssl.png)

### Using Azure CLI
You can enable or disable the **ssl-enforcement** parameter by using Enabled or Disabled values respectively in Azure CLI.
```azurecli-interactive
az mysql server update --resource-group myresource --name mysqlserver4demo --ssl-enforcement Enabled
```

## Step 4: Verify the SSL connection
Execute the mysql **status** command to verify that you have connected to your MySQL server using SSL:
```dos
mysql> status
```
Confirm the connection is encrypted by reviewing the output, which should show:  **SSL: Cipher in use is AES256-SHA** 

## Sample code
### PHP
```
$conn = mysqli_init();
mysqli_ssl_set($conn,NULL,NULL, "/var/www/html/BaltimoreCyberTrustRoot.crt.pem", NULL, NULL) ; 
mysqli_real_connect($conn, 'myserver4demo.mysql.database.azure.com', 'myadmin@myserver4demo', 'yourpassword', 'quickstartdb', 3306);
if (mysqli_connect_errno($conn)) {
die('Failed to connect to MySQL: '.mysqli_connect_error());
}
```
### Python
```
try:
conn = mysql.connector.connect(user='myadmin@myserver4demo',password='yourpassword',database='quickstartdb',host='myserver4demo.mysql.database.azure.com',ssl_ca='/var/www/html/BaltimoreCyberTrustRoot.crt.pem')
except mysql.connector.Error as err:
 print(err)
```

## Next steps
Review various application connectivity options following [Connection libraries for Azure Database for MySQL](concepts-connection-libraries.md)
