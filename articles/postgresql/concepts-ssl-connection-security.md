---
title: Configure SSL connectivity in Azure Database for PostgreSQL
description: Instructions and information to configure Azure Database for PostgreSQL and associated applications to properly use SSL connections.
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.topic: conceptual
ms.date: 03/12/2019
---
# Configure SSL connectivity in Azure Database for PostgreSQL
Azure Database for PostgreSQL prefers connecting your client applications to the PostgreSQL service using Secure Sockets Layer (SSL). Enforcing SSL connections between your database server and your client applications helps protect against "man in the middle" attacks by encrypting the data stream between the server and your application.

By default, the PostgreSQL database service is configured to require SSL connection. Optionally, you can disable requiring SSL to connect to your database service if your client application does not support SSL connectivity. 

## Enforcing SSL connections
For all Azure Database for PostgreSQL servers provisioned through the Azure portal and CLI, enforcement of SSL connections is enabled by default. 

Likewise, connection strings that are pre-defined in the "Connection Strings" settings under your server in the Azure portal include the required parameters for common languages to connect to your database server using SSL. The SSL parameter varies based on the connector, for example "ssl=true" or "sslmode=require" or "sslmode=required" and other variations.

## Configure Enforcement of SSL
You can optionally disable enforcing SSL connectivity. Microsoft Azure recommends to always enable **Enforce SSL connection** setting for enhanced security.

### Using the Azure portal
Visit your Azure Database for PostgreSQL server and click **Connection security**. Use the toggle button to enable or disable the **Enforce SSL connection** setting. Then, click **Save**. 

![Connection Security - Disable Enforce SSL](./media/concepts-ssl-connection-security/1-disable-ssl.png)

You can confirm the setting by viewing the **Overview** page to see the **SSL enforce status** indicator.

### Using Azure CLI
You can enable or disable the **ssl-enforcement** parameter using `Enabled` or `Disabled` values respectively in Azure CLI.

```azurecli
az postgres server update --resource-group myresourcegroup --name mydemoserver --ssl-enforcement Enabled
```

## Ensure your application or framework supports SSL connections
Many common application frameworks that use PostgreSQL for their database services, such as Drupal and Django, do not enable SSL by default during installation. Enabling SSL connectivity must be done after installation or through CLI commands specific to the application. If your PostgreSQL server is enforcing SSL connections and the associated application is not configured properly, the application may fail to connect to your database server. Consult your application's documentation to learn how to enable SSL connections.


## Applications that require certificate verification for SSL connectivity
In some cases, applications require a local certificate file generated from a trusted Certificate Authority (CA) certificate file (.cer) to connect securely. See the following steps to obtain the .cer file, decode the certificate and bind it to your application.

### Download the certificate file from the Certificate Authority (CA) 
The certificate needed to communicate over SSL with your Azure Database for PostgreSQL server is located [here](https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt). Download the certificate file locally.

### Install a cert decoder on your machine 
You can use [OpenSSL](https://github.com/openssl/openssl) to decode the certificate file needed for your application to connect securely to your database server. To learn how to install OpenSSL, see the [OpenSSL installation instructions](https://github.com/openssl/openssl/blob/master/INSTALL). 


### Decode your certificate file
The downloaded Root CA file is in encrypted format. Use OpenSSL to decode the certificate file. To do so, run this OpenSSL command:

```
openssl x509 -inform DER -in BaltimoreCyberTrustRoot.crt -text -out root.crt
```

### Connecting to Azure Database for PostgreSQL with SSL certificate authentication
Now that you have successfully decoded your certificate, you can now connect to your database server securely over SSL. To allow server certificate verification, the certificate must be placed in the file ~/.postgresql/root.crt in the user's home directory. (On Microsoft Windows the file is named %APPDATA%\postgresql\root.crt.). 

#### Connect using psql
The following example shows how to successfully connect to your PostgreSQL server using the psql command-line utility. Use the `root.crt` file created and the `sslmode=verify-ca` or `sslmode=verify-full` option.

Using the PostgreSQL command-line interface, execute the following command:
```bash
psql "sslmode=verify-ca sslrootcert=root.crt host=mydemoserver.postgres.database.azure.com dbname=postgres user=mylogin@mydemoserver"
```
If successful, you receive the following output:
```bash
Password for user mylogin@mydemoserver:
psql (9.6.2)
WARNING: Console code page (437) differs from Windows code page (1252)
     8-bit characters might not work correctly. See psql reference
     page "Notes for Windows users" for details.
SSL connection (protocol: TLSv1.2, cipher: ECDHE-RSA-AES256-SHA384, bits: 256, compression: off)
Type "help" for help.

postgres=>
```

## Next steps
Review various application connectivity options following [Connection libraries for Azure Database for PostgreSQL](concepts-connection-libraries.md).
