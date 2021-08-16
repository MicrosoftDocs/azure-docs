---
title: Encrypted connectivity using TLS/SSL in Azure Database for MySQL - Flexible Server
description: Instructions and information on how to connect using TLS/SSL in Azure Database for MySQL - Flexible Server.
author: savjani
ms.author: pariks
ms.service: mysql
ms.topic: conceptual
ms.date: 09/21/2020
---

# Connect to Azure Database for MySQL - Flexible Server with encrypted connections

[[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

> [!IMPORTANT]
> Azure Database for MySQL Flexible Server is currently in public preview

Azure Database for MySQL Flexible Server supports connecting your client applications to the MySQL server using Secure Sockets Layer (SSL) with Transport layer security(TLS) encryption. TLS is an industry standard protocol that ensures encrypted network connections between your database server and client applications, allowing you to adhere to compliance requirements.

Azure Database for MySQL Flexible Server supports encrypted connections using Transport Layer Security (TLS 1.2) by default and all incoming connections with TLS 1.0 and TLS 1.1 will be denied by default. The encrypted connection enforcement or TLS version configuration on your flexible server can be changed as discussed in this article.

Following are the different configurations of SSL and TLS settings you can have for your flexible server:

| Scenario   | Server parameter settings      | Description                                    |
|------------|--------------------------------|------------------------------------------------|
|Disable SSL enforcement | require_secure_transport = OFF |If your legacy application doesn't support encrypted connections to MySQL server, you can disable enforcement of encrypted connections to your flexible server by setting require_secure_transport=OFF.|
|Enforce SSL with TLS version < 1.2 | require_secure_transport = ON and tls_version = TLSV1 or TLSV1.1| If your legacy application supports encrypted connections but requires TLS version < 1.2, you can enable encrypted connections but configure your flexible server to allow connections with the tls version (v1.0 or v1.1) supported by your application|
|Enforce SSL with TLS version = 1.2(Default configuration)|require_secure_transport = ON and tls_version = TLSV1.2| This is the recommended and default configuration for flexible server.|
|Enforce SSL with TLS version = 1.3(Supported with MySQL v8.0 and above)| require_secure_transport = ON and tls_version = TLSV1.3| This is useful and recommended for new applications development|

> [!Note]
> Changes to SSL Cipher on flexible server is not supported. FIPS cipher suites is enforced by default when tls_version is set to TLS version 1.2 . For TLS versions other than version 1.2, SSL Cipher is set to default settings which comes with MySQL community installation.

In this article, you will learn how to:

* Configure your flexible server
  * With SSL disabled
  * With SSL enforced with TLS version < 1.2
* Connect to your flexible server using mysql command-line
  * With encrypted connections disabled
  * With encrypted connections enabled
* Verify encryption status for your connection
* Connect to your flexible server with encrypted connections using various application frameworks

## Disable SSL enforcement on your flexible server

If your client application doesn't support encrypted connections, you will need to disable encrypted connections enforcement on your flexible server. To disable encrypted connections enforcement, you will need to set require_secure_transport server parameter to OFF as shown in the screenshot and save the server parameter configuration for it to take effect. require_secure_transport is a **dynamic server parameter** which takes effect immediately and doesn't require server restart to take effect.

> :::image type="content" source="./media/how-to-connect-tls-ssl/disable-ssl.png" alt-text="Screenshot showing how to disable SSL with Azure Database for MySQL flexible server.":::

### Connect using mysql command-line client with SSL disabled

The following example shows how to connect to your server using the mysql command-line interface. Use the `--ssl-mode=DISABLED` connection string setting to disable TLS/SSL connection from mysql client. Replace values with your actual server name and password.

```bash
 mysql.exe -h mydemoserver.mysql.database.azure.com -u myadmin -p --ssl-mode=DISABLED 
```

It is important to note that setting require_secure_transport to OFF doesn't mean encrypted connections will not supported on server side. If you set require_secure_transport to OFF on flexible server but if the client connects with encrypted connection, it will still be accepted. The following connection using mysql client to a flexible server configured with require_secure_transport=OFF will also work as shown below.

```bash
 mysql.exe -h mydemoserver.mysql.database.azure.com -u myadmin -p --ssl-mode=REQUIRED
```

```output
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 17
Server version: 5.7.29-log MySQL Community Server (GPL)

Copyright (c) 2000, 2020, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> show global variables like '%require_secure_transport%';
+--------------------------+-------+
| Variable_name            | Value |
+--------------------------+-------+
| require_secure_transport | OFF   |
+--------------------------+-------+
1 row in set (0.02 sec)
```

In summary, require_secure_transport=OFF setting relaxes the enforcement of encrypted connections on flexible server and allows unencrypted connections to the server from client in addition to the encrypted connections.

## Enforce SSL with TLS version < 1.2

If your application supports connections to MySQL server with SSL, but supports TLS version < 1.2  you will require to set the TLS versions server parameter on your flexible server. To set TLS versions which you want your flexible server to support, you will need to set tls_version server parameter to TLSV1, TLSV1.1, or TLSV1 and TLSV1.1 as shown in the screenshot and save the server parameter configuration for it to take effect. tls_version is a **static server parameter** which will require a server restart for the parameter to take effect.

> :::image type="content" source="./media/how-to-connect-tls-ssl/tls-version.png" alt-text="Screenshot showing how to set tls version for a Azure Database for MySQL flexible server.":::

## Connect using mysql command-line client with TLS/SSL

### Download the public SSL certificate

To use encrypted connections with your client applications,you will need to download the [public SSL certificate](https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem) which is also available in Azure portal Networking blade as shown in the screenshot below.

> :::image type="content" source="./media/how-to-connect-tls-ssl/download-ssl.png" alt-text="Screenshot showing how to download public SSL certificate from Azure portal.":::

Save the certificate file to your preferred location. For example, this tutorial uses `c:\ssl` or `\var\www\html\bin` on your local environment or the client environment where your application is hosted. This will allow applications to connect securely to the database over SSL.

If you created your flexible server with *Private access (VNet Integration)*, you will need to connect to your server from a resource within the same VNet as your server. You can create a virtual machine and add it to the VNet created with your flexible server.

If you created your flexible server with *Public access (allowed IP addresses)*, you can add your local IP address to the list of firewall rules on your server.

You can choose either [mysql.exe](https://dev.mysql.com/doc/refman/8.0/en/mysql.html) or [MySQL Workbench](./connect-workbench.md)--> to connect to the server from your local environment.

The following example shows how to connect to your server using the mysql command-line interface. Use the `--ssl-mode=REQUIRED` connection string setting to enforce TLS/SSL certificate verification. Pass the local certificate file path to the `--ssl-ca` parameter. Replace values with your actual server name and password.

```bash
sudo apt-get install mysql-client
wget --no-check-certificate https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem
mysql -h mydemoserver.mysql.database.azure.com -u mydemouser -p --ssl-mode=REQUIRED --ssl-ca=DigiCertGlobalRootCA.crt.pem
```

> [!Note]
> Confirm that the value passed to `--ssl-ca` matches the file path for the certificate you saved.

If you try to connect to your server with unencrypted connections, you will see error stating connections using insecure transport are prohibited similar to one below:

```output
ERROR 3159 (HY000): Connections using insecure transport are prohibited while --require_secure_transport=ON.
```

## Verify the TLS/SSL connection

Execute the mysql **status** command to verify that you have connected to your MySQL server using TLS/SSL:

```dos
mysql> status
```

Confirm the connection is encrypted by reviewing the output, which should show:  **SSL: Cipher in use is**. This cipher suite shows an example and based on the client, you can see a different cipher suite.

## Connect to your flexible server with encrypted connections using various application frameworks

Connection strings that are pre-defined in the "Connection Strings" page available for your server in the Azure portal include the required parameters for common languages to connect to your database server using TLS/SSL. The TLS/SSL parameter varies based on the connector. For example, "useSSL=true", "sslmode=required", or "ssl_verify_cert=true" and other variations.

To establish an encrypted connection to your flexible server over TLS/SSL from your application, refer to the following code samples:

### WordPress

Download [SSL public certificate](https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem) and add the following lines in wp-config.php after the line ```// **MySQL settings - You can get this info from your web host** //```.

```php
//** Connect with SSL** //
define('MYSQL_CLIENT_FLAGS', MYSQLI_CLIENT_SSL);
//** SSL CERT **//
define('MYSQL_SSL_CERT','/FULLPATH/on-client/to/DigiCertGlobalRootCA.crt.pem');
```

### PHP

```php
$conn = mysqli_init();
mysqli_ssl_set($conn,NULL,NULL, "/var/www/html/DigiCertGlobalRootCA.crt.pem", NULL, NULL);
mysqli_real_connect($conn, 'mydemoserver.mysql.database.azure.com', 'myadmin', 'yourpassword', 'quickstartdb', 3306, MYSQLI_CLIENT_SSL);
if (mysqli_connect_errno($conn)) {
die('Failed to connect to MySQL: '.mysqli_connect_error());
}
```

### PHP (Using PDO)

```phppdo
$options = array(
    PDO::MYSQL_ATTR_SSL_CA => '/var/www/html/DigiCertGlobalRootCA.crt.pem'
);
$db = new PDO('mysql:host=mydemoserver.mysql.database.azure.com;port=3306;dbname=databasename', 'myadmin', 'yourpassword', $options);
```

### Python (MySQLConnector Python)

```python
try:
    conn = mysql.connector.connect(user='myadmin',
                                   password='yourpassword',
                                   database='quickstartdb',
                                   host='mydemoserver.mysql.database.azure.com',
                                   ssl_ca='/var/www/html/DigiCertGlobalRootCA.crt.pem')
except mysql.connector.Error as err:
    print(err)
```

### Python (PyMySQL)

```python
conn = pymysql.connect(user='myadmin',
                       password='yourpassword',
                       database='quickstartdb',
                       host='mydemoserver.mysql.database.azure.com',
                       ssl={'ca': '/var/www/html/DigiCertGlobalRootCA.crt.pem'})
```

### Django (PyMySQL)

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'quickstartdb',
        'USER': 'myadmin',
        'PASSWORD': 'yourpassword',
        'HOST': 'mydemoserver.mysql.database.azure.com',
        'PORT': '3306',
        'OPTIONS': {
            'ssl': {'ca': '/var/www/html/DigiCertGlobalRootCA.crt.pem'}
        }
    }
}
```

### Ruby

```ruby
client = Mysql2::Client.new(
        :host     => 'mydemoserver.mysql.database.azure.com',
        :username => 'myadmin',
        :password => 'yourpassword',
        :database => 'quickstartdb',
        :sslca => '/var/www/html/DigiCertGlobalRootCA.crt.pem'
    )
```

### Golang

```go
rootCertPool := x509.NewCertPool()
pem, _ := ioutil.ReadFile("/var/www/html/DigiCertGlobalRootCA.crt.pem")
if ok := rootCertPool.AppendCertsFromPEM(pem); !ok {
    log.Fatal("Failed to append PEM.")
}
mysql.RegisterTLSConfig("custom", &tls.Config{RootCAs: rootCertPool})
var connectionString string
connectionString = fmt.Sprintf("%s:%s@tcp(%s:3306)/%s?allowNativePasswords=true&tls=custom",'myadmin' , 'yourpassword', 'mydemoserver.mysql.database.azure.com', 'quickstartdb')
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
properties.setProperty("user", 'myadmin');
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
properties.setProperty("user", 'myadmin');
properties.setProperty("password", 'yourpassword');
conn = DriverManager.getConnection(url, properties);
```

### .NET (MySqlConnector)

```csharp
var builder = new MySqlConnectionStringBuilder
{
    Server = "mydemoserver.mysql.database.azure.com",
    UserID = "myadmin",
    Password = "yourpassword",
    Database = "quickstartdb",
    SslMode = MySqlSslMode.VerifyCA,
    SslCa = "DigiCertGlobalRootCA.crt.pem",
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
const serverCa = [fs.readFileSync("/var/www/html/DigiCertGlobalRootCA.crt.pem", "utf8")];
var conn=mysql.createConnection({
    host:"mydemoserver.mysql.database.azure.com",
    user:"myadmin",
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

* [Use MySQL Workbench to connect and query data in Azure Database for MySQL Flexible Server](./connect-workbench.md)
* [Use PHP to connect and query data in Azure Database for MySQL Flexible Server](./connect-php.md)
* [Create and manage Azure Database for MySQL Flexible Server virtual network using Azure CLI](./how-to-manage-virtual-network-cli.md).
* Learn more about [networking in Azure Database for MySQL Flexible Server](./concepts-networking.md)
* Understand more about [Azure Database for MySQL Flexible Server firewall rules](./concepts-networking-public.md#public-access-allowed-ip-addresses)
