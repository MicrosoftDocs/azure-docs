---
title: Connection strings - Azure Database for MySQL
description: This document lists the currently supported connection strings for applications to connect with Azure Database for MySQL, including ADO.NET (C#), JDBC, Node.js, ODBC, PHP, Python, and Ruby.
ms.service: mysql
ms.subservice: single-server
author: SudheeshGH
ms.author: sunaray
ms.topic: how-to
ms.custom: devx-track-python, devx-track-j, devx-track-js
ms.date: 06/20/2022
---

# How to connect applications to Azure Database for MySQL

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

This topic lists the connection string types that are supported by Azure Database for MySQL, together with templates and examples. You might have different parameters and settings in your connection string.

- To obtain the certificate, see [How to configure SSL](./how-to-configure-ssl.md).
- {your_host} = \<servername>.mysql.database.azure.com
- {your_user}@{servername} = userID format for authentication correctly.  If you only use the userID, the authentication will fail.

## ADO.NET
```ado.net
Server={your_host};Port={your_port};Database={your_database};Uid={username@servername};Pwd={your_password};[SslMode=Required;]
```

In this example, the server name is `mydemoserver`, the database name is `wpdb`, the user name is `WPAdmin`, and the password is `mypassword!2`. As a result, the connection string should be:

```ado.net
Server= "mydemoserver.mysql.database.azure.com"; Port=3306; Database= "wpdb"; Uid= "WPAdmin@mydemoserver"; Pwd="mypassword!2"; SslMode=Required;
```

## JDBC
```jdbc
String url ="jdbc:mysql://%s:%s/%s[?verifyServerCertificate=true&useSSL=true&requireSSL=true]",{your_host},{your_port},{your_database}"; myDbConn = DriverManager.getConnection(url, {username@servername}, {your_password}";
```

## Node.js
```node.js
var conn = mysql.createConnection({host: {your_host}, user: {username@servername}, password: {your_password}, database: {your_database}, Port: {your_port}[, ssl:{ca:fs.readFileSync({ca-cert filename})}}]);
```

## ODBC
```odbc
DRIVER={MySQL ODBC 5.3 UNICODE Driver};Server={your_host};Port={your_port};Database={your_database};Uid={username@servername};Pwd={your_password}; [sslca={ca-cert filename}; sslverify=1; Option=3;]
```

## PHP
```php
$con=mysqli_init(); [mysqli_ssl_set($con, NULL, NULL, {ca-cert filename}, NULL, NULL);] mysqli_real_connect($con, {your_host}, {username@servername}, {your_password}, {your_database}, {your_port});
```

## Python
```python
cnx = mysql.connector.connect(user={username@servername}, password={your_password}, host={your_host}, port={your_port}, database={your_database}[, ssl_ca={ca-cert filename}, ssl_verify_cert=true])
```

## Ruby
```ruby
client = Mysql2::Client.new(username: {username@servername}, password: {your_password}, database: {your_database}, host: {your_host}, port: {your_port}[, sslca:{ca-cert filename}, sslverify:false, sslcipher:'AES256-SHA'])
```

## Get the connection string details from the Azure portal
In the [Azure portal](https://portal.azure.com), go to your Azure Database for MySQL server, and then click **Connection strings** to get the string list for your instance:
:::image type="content" source="./media/how-to-connection-strings/connection-strings-on-portal.png" alt-text="The Connection strings pane in the Azure portal":::

The string provides details such as the driver, server, and other database connection parameters. Modify these examples to use your own parameters, such as database name, password, and so on. You can then use this string to connect to the server from your code and applications.

## Next steps
- For more information about connection libraries, see [Concepts - Connection libraries](./concepts-connection-libraries.md).
