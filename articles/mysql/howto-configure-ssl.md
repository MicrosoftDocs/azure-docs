---
title: Configure SSL connectivity in your application to securely connect to Azure Database for MySQL | Microsoft Docs
description: Instructions for how to properly configure Azure Database for MySQL and associated applications to correctly use SSL connections
services: mysql
author: v-chenyh
ms.author: v-chenyh
editor: jasonh
manager: jhubbard
ms.assetid: 
ms.service: mysql-database
ms.tgt_pltfrm: portal
ms.devlang: na
ms.topic: article
ms.date: 05/10/2017
---

# Configure SSL connectivity in your application to securely connect to Azure Database for MySQL
Azure Database for MySQL supports connecting your Azure Database for MySQL server to client applications using Secure Sockets Layer (SSL). Enforcing SSL connections between your database server and your client applications helps protect against "man in the middle" attacks by encrypting the data stream between the server and your application.

By default, the database service should be configured to require SSL connections when connecting to Azure Database for MySQL server.  It is recommended avoid disabling the SSL option whenever possible. 

## Enforcing SSL connections
When provisioning a new Azure Database for MySQL server through the Azure portal or CLI, enforcement of SSL connections is enabled by default. 

Likewise, connection strings that are pre-defined in the "Connection Strings" settings under your server in the Azure portal include the required parameters for common languages to connect to your database server using SSL. The SSL parameter varies based on the connector, for example "ssl=true" or "sslmode=require" or "sslmode=required" and other variations.

In some cases, applications require a local certificate file (.pem) generated from a Certificate Authority (CA) certificate file (.cer) to connect securely. See the following steps to obtain the .cer file, generate the local .pem file and bind it to your application.

### Download the certificate file from the Certificate Authority (CA) 
The certificate needed to communicate over SSL with your Azure Database for MySQL server is located [here](https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt). Download the certificate file to your local drive (with this tutorial, we will use **c:\ssl**). 

### Download and install OpenSSL on your PC 
To generate the local **.pem** file needed for your application to connect securely to your database server, you need to install OpenSSL on your local computer.

The OpenSSL libraries are provided in source code directly from the [OpenSSL Software Foundation](http://www.openssl.org). The following instructions guide you through the steps necessary to install OpenSSL on your Linux PC.

Installing OpenSSL on a Windows PC can be done in the following ways:

1. **(Recommended)** Using the built-in Bash for Windows functionality in Window 10 and above, OpenSSL is installed by default.  Instructions on how to enable Bash for Windows functionality in Windows 10 can be found [here](https://msdn.microsoft.com/commandline/wsl/install_guide).

2. Through downloading a Win32/64 application provided by the community. While the OpenSSL Software Foundation does not provide or endorse any specific Windows installers, they provide a list of available installers [here](https://wiki.openssl.org/index.php/Binaries)

### Convert your .cer certificate to a local .pem
The downloaded Root CA file will be in **.cer** format. You will need to use OpenSSL to convert the cert file to a **.pem**.  To do so, execute the openssl.exe command-line tool and execute the following command: 

```dos
OpenSSL>x509 -inform DER -in BaltimoreCyberTrustRoot.cer -out MyServerCACert.pem
```
Now that you have successfully created your certificate file (MyServerCACert.pem), you can now connect to your database server securely over SSL. 

The following examples show how to connect to your MySQL server through both the MySQL command-line interface and through using MySQL Workbench, using the **MyServerCACert.pem** file.

### Connecting to server using the MySQL CLI over SSL
Using the MySQL command-line interface, execute the following command:

```dos
mysql.exe -h yourserver. -uUsername@Servername -pYourPassword --ssl-ca=c:\ssl\MyServerCACert.pem
```
Execute the mysql **status** command to verify that you have connected to your MySQL server using SSL:

```dos
mysql> status
--------------
mysql.exe  Ver 14.14 Distrib 5.7.18, for Win64 (x86_64)

Connection id:          65535
Current database:
Current user:           jason@66.235.55.141
SSL:                    Cipher in use is AES256-SHA
Using delimiter:        ;
Server version:         5.6.26.0 MySQL Community Server (GPL)
Protocol version:       10
Connection:             janderserver.mysql.sqltest-eg1.mscds.com via TCP/IP
Server characterset:    latin1
Db     characterset:    latin1
Client characterset:    cp850
Conn.  characterset:    cp850
TCP port:               3306
Uptime:                 1 day 19 hours 9 min 43 sec

Threads: 4  Questions: 26082  Slow queries: 0  Opens: 112  Flush tables: 1  Open tables: 105  Queries per second avg: 0.167
--------------
```

### Connecting to server using the MySQL Workbench over SSL
Configuring MySQL Workbench to connect securely over SSL requires you to navigate to the **SSL** tab in the MySQL Workbench Setup New Connection dialogue, and enter the file location of the **MyServerCACert.pem** in the **SSL CA File:** field.

![save customized tile](./media/concepts-ssl-connection-security/mysql-workbench-ssl.png)

## Next steps
- Review various application connectivity options following [Connection libraries for Azure Database for MySQL](concepts-connectivity-libraries.md)