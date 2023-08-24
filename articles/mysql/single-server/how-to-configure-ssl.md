---
title: Configure SSL - Azure Database for MySQL
description: Instructions for how to properly configure Azure Database for MySQL and associated applications to correctly use SSL connections
ms.service: mysql
ms.subservice: single-server
author: savjani
ms.author: pariks
ms.topic: how-to
ms.devlang: csharp, golang, java, javascript, php, python, ruby
ms.custom: devx-track-csharp
ms.date: 06/20/2022
---

# Configure SSL connectivity in your application to securely connect to Azure Database for MySQL

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

Azure Database for MySQL supports connecting your Azure Database for MySQL server to client applications using Secure Sockets Layer (SSL). Enforcing SSL connections between your database server and your client applications helps protect against "man in the middle" attacks by encrypting the data stream between the server and your application.

## Step 1: Obtain SSL certificate

Download the certificate needed to communicate over SSL with your Azure Database for MySQL server from [https://cacerts.digicert.com/DigiCertGlobalRootG2.crt.pem](https://cacerts.digicert.com/DigiCertGlobalRootG2.crt.pem) and save the certificate file to your local drive (this tutorial uses c:\ssl for example).
**For Microsoft Internet Explorer and Microsoft Edge:** After the download has completed, rename the certificate to BaltimoreCyberTrustRoot.crt.pem.

See the following links for certificates for servers in sovereign clouds: [Azure Government](https://cacerts.digicert.com/BaltimoreCyberTrustRoot.crt.pem), [Microsoft Azure operated by 21Vianet](https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem), and [Azure Germany](https://www.d-trust.net/cgi-bin/D-TRUST_Root_Class_3_CA_2_2009.crt).

## Step 2: Bind SSL

For specific programming language connection strings, please refer to the [sample code](how-to-configure-ssl.md#sample-code) below.

### Connecting to server using MySQL Workbench over SSL

Configure MySQL Workbench to connect securely over SSL.

1. From the Setup New Connection dialogue, navigate to the **SSL** tab.

1. Update the **Use SSL** field to "Require".

1. In the **SSL CA File:** field, enter the file location of the **DigiCertGlobalRootG2.crt.pem**.

   :::image type="content" source="./media/how-to-configure-ssl/mysql-workbench-ssl.png" alt-text="Save SSL configuration":::

For existing connections, you can bind SSL by right-clicking on the connection icon and choose edit. Then navigate to the **SSL** tab and bind the cert file.

### Connecting to server using the MySQL CLI over SSL

Another way to bind the SSL certificate is to use the MySQL command-line interface by executing the following commands.

```bash
mysql.exe -h mydemoserver.mysql.database.azure.com -u Username@mydemoserver -p --ssl-mode=REQUIRED --ssl-ca=c:\ssl\DigiCertGlobalRootG2.crt.pem
```

> [!NOTE]
> When using the MySQL command-line interface on Windows, you may receive an error `SSL connection error: Certificate signature check failed`. If this occurs, replace the `--ssl-mode=REQUIRED --ssl-ca={filepath}` parameters with `--ssl`.

## Step 3:  Enforcing SSL connections in Azure

### Using the Azure portal

Using the Azure portal, visit your Azure Database for MySQL server, and then click **Connection security**. Use the toggle button to enable or disable the **Enforce SSL connection** setting, and then click **Save**. Microsoft recommends to always enable the **Enforce SSL connection** setting for enhanced security.

:::image type="content" source="./media/how-to-configure-ssl/enable-ssl.png" alt-text="Screenshot of Azure portal to Enforce SSL connections in Azure Database for MySQL":::

### Using Azure CLI

You can enable or disable the **ssl-enforcement** parameter by using Enabled or Disabled values respectively in Azure CLI.

```azurecli-interactive
az mysql server update --resource-group myresource --name mydemoserver --ssl-enforcement Enabled
```

## Step 4: Verify the SSL connection

Execute the mysql **status** command to verify that you have connected to your MySQL server using SSL:

```dos
mysql> status
```

Confirm the connection is encrypted by reviewing the output, which should show:  **SSL: Cipher in use is AES256-SHA**

## Sample code

To establish a secure connection to Azure Database for MySQL over SSL from your application, refer to the following code samples:

Refer to the list of [compatible drivers](concepts-compatibility.md) supported by the Azure Database for MySQL service.

### PHP

```php
$conn = mysqli_init();
mysqli_ssl_set($conn,NULL,NULL, "/var/www/html/DigiCertGlobalRootG2.crt.pem", NULL, NULL);
mysqli_real_connect($conn, 'mydemoserver.mysql.database.azure.com', 'myadmin@mydemoserver', 'yourpassword', 'quickstartdb', 3306, MYSQLI_CLIENT_SSL);
if (mysqli_connect_errno()) {
die('Failed to connect to MySQL: '.mysqli_connect_error());
}
```

### PHP (Using PDO)

```phppdo
$options = array(
    PDO::MYSQL_ATTR_SSL_CA => '/var/www/html/DigiCertGlobalRootG2.crt.pem'
);
$db = new PDO('mysql:host=mydemoserver.mysql.database.azure.com;port=3306;dbname=databasename', 'username@mydemoserver', 'yourpassword', $options);
```

### Python (MySQLConnector Python)

```python
try:
    conn = mysql.connector.connect(user='myadmin@mydemoserver',
                                   password='yourpassword',
                                   database='quickstartdb',
                                   host='mydemoserver.mysql.database.azure.com',
                                   ssl_ca='/var/www/html/DigiCertGlobalRootG2.crt.pem')
except mysql.connector.Error as err:
    print(err)
```

### Python (PyMySQL)

```python
conn = pymysql.connect(user='myadmin@mydemoserver',
                       password='yourpassword',
                       database='quickstartdb',
                       host='mydemoserver.mysql.database.azure.com',
                       ssl={'ca': '/var/www/html/DigiCertGlobalRootG2.crt.pem'})
```

### Django (PyMySQL)

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'quickstartdb',
        'USER': 'myadmin@mydemoserver',
        'PASSWORD': 'yourpassword',
        'HOST': 'mydemoserver.mysql.database.azure.com',
        'PORT': '3306',
        'OPTIONS': {
            'ssl': {'ca': '/var/www/html/DigiCertGlobalRootG2.crt.pem'}
        }
    }
}
```

### Ruby

```ruby
client = Mysql2::Client.new(
        :host     => 'mydemoserver.mysql.database.azure.com',
        :username => 'myadmin@mydemoserver',
        :password => 'yourpassword',
        :database => 'quickstartdb',
        :sslca => '/var/www/html/DigiCertGlobalRootG2.crt.pem'
    )
```

### Golang

```go
rootCertPool := x509.NewCertPool()
pem, _ := ioutil.ReadFile("/var/www/html/DigiCertGlobalRootG2.crt.pem")
if ok := rootCertPool.AppendCertsFromPEM(pem); !ok {
    log.Fatal("Failed to append PEM.")
}
mysql.RegisterTLSConfig("custom", &tls.Config{RootCAs: rootCertPool})
var connectionString string
connectionString = fmt.Sprintf("%s:%s@tcp(%s:3306)/%s?allowNativePasswords=true&tls=custom","myadmin@mydemoserver" , "yourpassword", "mydemoserver.mysql.database.azure.com", 'quickstartdb')
db, _ := sql.Open("mysql", connectionString)
```

### Java (MySQL Connector for Java)

```java
# generate truststore and keystore in code

String importCert = " -import "+
    " -alias mysqlServerCACert "+
    " -file " + ssl_ca +
    " -keystore truststore "+
    " -trustcacerts " +
    " -storepass password -noprompt ";
String genKey = " -genkey -keyalg rsa " +
    " -alias mysqlClientCertificate -keystore keystore " +
    " -storepass password123 -keypass password " +
    " -dname CN=MS ";
sun.security.tools.keytool.Main.main(importCert.trim().split("\\s+"));
sun.security.tools.keytool.Main.main(genKey.trim().split("\\s+"));

# use the generated keystore and truststore

System.setProperty("javax.net.ssl.keyStore","path_to_keystore_file");
System.setProperty("javax.net.ssl.keyStorePassword","password");
System.setProperty("javax.net.ssl.trustStore","path_to_truststore_file");
System.setProperty("javax.net.ssl.trustStorePassword","password");

url = String.format("jdbc:mysql://%s/%s?serverTimezone=UTC&useSSL=true", 'mydemoserver.mysql.database.azure.com', 'quickstartdb');
properties.setProperty("user", 'myadmin@mydemoserver');
properties.setProperty("password", 'yourpassword');
conn = DriverManager.getConnection(url, properties);
```

### Java (MariaDB Connector for Java)

```java
# generate truststore and keystore in code

String importCert = " -import "+
    " -alias mysqlServerCACert "+
    " -file " + ssl_ca +
    " -keystore truststore "+
    " -trustcacerts " +
    " -storepass password -noprompt ";
String genKey = " -genkey -keyalg rsa " +
    " -alias mysqlClientCertificate -keystore keystore " +
    " -storepass password123 -keypass password " +
    " -dname CN=MS ";
sun.security.tools.keytool.Main.main(importCert.trim().split("\\s+"));
sun.security.tools.keytool.Main.main(genKey.trim().split("\\s+"));

# use the generated keystore and truststore


System.setProperty("javax.net.ssl.keyStore","path_to_keystore_file");
System.setProperty("javax.net.ssl.keyStorePassword","password");
System.setProperty("javax.net.ssl.trustStore","path_to_truststore_file");
System.setProperty("javax.net.ssl.trustStorePassword","password");

url = String.format("jdbc:mariadb://%s/%s?useSSL=true&trustServerCertificate=true", 'mydemoserver.mysql.database.azure.com', 'quickstartdb');
properties.setProperty("user", 'myadmin@mydemoserver');
properties.setProperty("password", 'yourpassword');
conn = DriverManager.getConnection(url, properties);
```

### .NET (MySqlConnector)

```csharp
var builder = new MySqlConnectionStringBuilder
{
    Server = "mydemoserver.mysql.database.azure.com",
    UserID = "myadmin@mydemoserver",
    Password = "yourpassword",
    Database = "quickstartdb",
    SslMode = MySqlSslMode.VerifyCA,
    SslCa = "DigiCertGlobalRootG2.crt.pem",
};
using (var connection = new MySqlConnection(builder.ConnectionString))
{
    connection.Open();
}
```

### Node.js

```node
var fs = require('fs');
var mysql = require('mysql');
const serverCa = [fs.readFileSync("/var/www/html/DigiCertGlobalRootG2.crt.pem", "utf8")];
var conn=mysql.createConnection({
    host:"mydemoserver.mysql.database.azure.com",
    user:"myadmin@mydemoserver",
    password:"yourpassword",
    database:"quickstartdb",
    port:3306,
    ssl: {
        rejectUnauthorized: true,
        ca: serverCa
    }
});
conn.connect(function(err) {
  if (err) throw err;
});
```

## Next steps

* To learn about certificate expiry and rotation, refer [certificate rotation documentation](concepts-certificate-rotation.md)
* Review various application connectivity options following [Connection libraries for Azure Database for MySQL](concepts-connection-libraries.md)
