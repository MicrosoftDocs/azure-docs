---
title: Export the Azure Cosmos DB Emulator certificates
description: Learn how to export the Azure Cosmos DB Emulator certificate for use with languages and environments that don't integrate with the Windows Certificate Store.
ms.service: cosmos-db
ms.topic: how-to
ms.date: 03/16/2023
ms.author: esarroyo
author: StefArroyo 
ms.custom: devx-track-python, devx-track-java, contperf-fy21q1, ignite-2022
---

# Export the Azure Cosmos DB Emulator certificates for use with Java, Python, and Node.js apps
[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

The Azure Cosmos DB Emulator provides a local environment that emulates the Azure Cosmos DB service for development purposes. Azure Cosmos DB Emulator supports only secure communication through TLS connections.

The first time you run the emulator, it generates two certificates. One of them is used to connect to the local emulator and the other is used to manage default encryption of the emulator data within the emulator. The certificate you want to export is the connection certificate with the friendly name `DocumentDBEmulatorCertificate`.

When you use the emulator to develop apps in different languages, such as Java, Python, or Node.js, you need to export the emulator certificate and import it into the required certificate store.

The .NET language and runtime uses the Windows Certificate Store to securely connect to the Azure Cosmos DB local emulator when the application is run on a Windows OS host. Other languages have their own method of managing and using certificates. Java uses its own [certificate store](https://docs.oracle.com/cd/E19830-01/819-4712/ablqw/index.html), Python uses [socket wrappers](https://docs.python.org/2/library/ssl.html), and Node.js uses [tlsSocket](https://nodejs.org/api/tls.html#tls_tls_connect_options_callback).

This article demonstrates how to export the TLS/SSL certificates for use in different languages and runtime environments that don't integrate with the Windows Certificate Store. For more information about the emulator, see [Install and use the Azure Cosmos DB Emulator](./local-emulator.md).

## <a id="export-emulator-certificate"></a>Export the Azure Cosmos DB TLS/SSL certificate

You need to export the emulator certificate to successfully use the emulator endpoint from languages and runtime environments that don't integrate with the Windows Certificate Store. You can export the certificate using the Windows Certificate Manager. After the first time you run the emulator, use the following procedure to export the `DocumentDBEmulatorCertificate` certificate as a *BASE-64 encoded X.509 (.cer)* file:

1. Run *certlm.msc* to start the Windows Certificate manager. Navigate to the **Personal** > **Certificates** folder.

1. Double-click the certificate with the friendly name **DocumentDbEmulatorCertificate** to open it.

   :::image type="content" source="./media/local-emulator-export-ssl-certificates/database-local-emulator-export-step-1.png" alt-text="Screenshot shows the personal certificates in the Certificate Manager." lightbox="./media/local-emulator-export-ssl-certificates/database-local-emulator-export-step-1.png":::

1. Select the **Details** tab.

   :::image type="content" source="./media/local-emulator-export-ssl-certificates/database-local-emulator-export-step-2.png" alt-text="Screenshot shows the General tab for the DocumentDBEmulatorCertificate certificate.":::

1. Select **Copy to File**.

   :::image type="content" source="./media/local-emulator-export-ssl-certificates/database-local-emulator-export-step-3.png" alt-text="Screenshot shows the Details tab for the DocumentDBEmulatorCertificate certificate where you can copy it to a file.":::

1. In the Certificate Export Wizard, select **Next**.

   :::image type="content" source="./media/local-emulator-export-ssl-certificates/database-local-emulator-export-step-4.png" alt-text="Screenshot shows the Certificate Export Wizard dialog.":::

1. Choose **No, do not export private key**, then select **Next**.

   :::image type="content" source="./media/local-emulator-export-ssl-certificates/database-local-emulator-export-step-5.png" alt-text="Screenshot shows the Export Private Key page.":::

1. Select **Base-64 encoded X.509 (.CER)** and then **Next**.

   :::image type="content" source="./media/local-emulator-export-ssl-certificates/database-local-emulator-export-step-6.png" alt-text="Screenshot shows the Export File Format page.":::

1. Give the certificate a name, in this case *documentdbemulatorcert*, and then select **Next**.

   :::image type="content" source="./media/local-emulator-export-ssl-certificates/database-local-emulator-export-step-7.png" alt-text="Screenshot shows the File to Export page where you enter a file name.":::

1. Select **Finish**.

   :::image type="content" source="./media/local-emulator-export-ssl-certificates/database-local-emulator-export-step-8.png" alt-text="Screenshot shows the Completing the Certificate Export Wizard where you select Finish.":::

## Use the certificate with Java apps

When you run Java applications or MongoDB applications that use a Java based client, it's easier to install the certificate into the Java default certificate store than passing the `-Djavax.net.ssl.trustStore=<keystore> -Djavax.net.ssl.trustStorePassword="<password>"` parameters. For example, the included Java Demo application (`https://localhost:8081/_explorer/index.html`) depends on the default certificate store.

Follow the instructions in the [Creating, Exporting, and Importing SSL Certificates](https://docs.oracle.com/cd/E54932_01/doc.705/e54936/cssg_create_ssl_cert.htm) to import the X.509 certificate into the default Java certificate store. Keep in mind that you work in the *%JAVA_HOME%* directory when running keytool. After the certificate is imported into the certificate store, clients for SQL and Azure Cosmos DB's API for MongoDB can connect to the Azure Cosmos DB Emulator.

Alternatively, you can run the following bash script to import the certificate:

```bash
#!/bin/bash

# If emulator was started with /AllowNetworkAccess, replace the below with the actual IP address of it:
EMULATOR_HOST=localhost
EMULATOR_PORT=8081
EMULATOR_CERT_PATH=/tmp/cosmos_emulator.cert
openssl s_client -connect ${EMULATOR_HOST}:${EMULATOR_PORT} </dev/null | sed -ne '/-BEGIN CERTIFICATE-/,/-END CERTIFICATE-/p' > $EMULATOR_CERT_PATH
# delete the cert if already exists
sudo $JAVA_HOME/bin/keytool -cacerts -delete -alias cosmos_emulator
# import the cert
sudo $JAVA_HOME/bin/keytool -cacerts -importcert -alias cosmos_emulator -file $EMULATOR_CERT_PATH
```

Once the `CosmosDBEmulatorCertificate` TLS/SSL certificate is installed, your application should be able to connect and use the local Azure Cosmos DB Emulator.

If you have any issues, see [Debugging SSL/TLS connections](https://docs.oracle.com/javase/7/docs/technotes/guides/security/jsse/ReadDebug.html). In most cases, the certificate might not be installed into the *%JAVA_HOME%/jre/lib/security/cacerts* store. For example, if there's more than one installed version of Java, your application might be using a different certificate store than the one you updated.

## Use the certificate with Python apps

When you connect to the emulator from Python apps, TLS verification is disabled. By default, the Python SDK for Azure Cosmos DB for NoSQL doesn't try to use the TLS/SSL certificate when it connects to the local emulator. For more information, see [Azure Cosmos DB for NoSQL client library for Python](nosql/quickstart-python.md).

If you want to use TLS validation, you can follow the examples in [TLS/SSL wrapper for socket objects](https://docs.python.org/3/library/ssl.html).

## How to use the certificate in Node.js

When you connect to the emulator from Node.js SDKs, TLS verification is disabled. By default, the [Node.js SDK(version 1.10.1 or higher)](nosql/sdk-nodejs.md) for the API for NoSQL doesn't try to use the TLS/SSL certificate when it connects to the local emulator. If you want to use TLS validation, follow the examples in the [Node.js documentation](https://nodejs.org/api/tls.html#tls_tls_connect_options_callback).

## Rotate emulator certificates

You can force regenerate the emulator certificates by selecting **Reset Data** from the Azure Cosmos DB Emulator icon in the Windows Tray. This action also wipes out all the data stored locally by the emulator.

:::image type="content" source="./media/local-emulator-export-ssl-certificates/database-local-emulator-reset-data.png" alt-text="Azure Cosmos DB local emulator reset data":::

If you install the certificate into the Java certificate store or used them elsewhere, you need to reimport them using the current certificates. Your application can't connect to the local emulator until you update the certificates.

## Next steps

* [Command-line and PowerShell reference for Azure Cosmos DB Emulator](emulator-command-line-parameters.md)
* [Troubleshoot issues when using the Azure Cosmos DB Emulator](troubleshoot-local-emulator.md)
