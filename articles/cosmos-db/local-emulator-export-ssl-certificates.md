---
title: Export the Azure Cosmos DB Emulator certificates
description: Learn how to export the Azure Cosmos DB emulator certificate for use with Java, Python, and Node.js apps. The certificates should be exported and used for languages and runtime environments that don't use the Windows Certificate Store. 
ms.service: cosmos-db
ms.topic: how-to
ms.date: 09/17/2020
author: deborahc
ms.author: dech
ms.custom: devx-track-python, devx-track-java, contperfq1
---

# Export the Azure Cosmos DB Emulator certificates for use with Java, Python, and Node.js apps

The Azure Cosmos DB emulator provides a local environment that emulates the Azure Cosmos DB service for development purposes. Azure Cosmos emulator supports only secure communication through TLS connections.

Certificates in the Azure Cosmos DB local emulator are generated the first time you run the emulator. There are two certificates. One of them is used to connect to the local emulator and the other is used to manage default encryption of the emulator data within the emulator. The certificate you want to export is the connection certificate with the friendly name "DocumentDBEmulatorCertificate".

When you use the emulator to develop apps in different languages such as Java, Python, or Node.js, you need to export the emulator certificate and import it into the required certificate store.

The .NET language and runtime uses the Windows Certificate Store to securely connect to the Azure Cosmos DB local emulator when the application is run on a Windows OS host. Other languages have their own method of managing and using certificates. For example, Java uses its own [certificate store](https://docs.oracle.com/cd/E19830-01/819-4712/ablqw/index.html), Python uses [socket wrappers](https://docs.python.org/2/library/ssl.html), and Node.js uses [tlsSocket](https://nodejs.org/api/tls.html#tls_tls_connect_options_callback).

This article demonstrates how to export the TLS/SSL certificates for use in different languages and runtime environments that do not integrate with the Windows Certificate Store. You can read more about the emulator in [Use the Azure Cosmos DB Emulator for development and testing](./local-emulator.md).

## <a id="export-emulator-certificate"></a>Export the Azure Cosmos DB TLS/SSL certificate

You need to export the emulator certificate to successfully use the emulator endpoint from languages and runtime environments that do not integrate with the Windows Certificate Store. You can export the certificate using the Windows Certificate Manager. Use the following step-by-step instructions to export the "DocumentDBEmulatorCertificate" certificate as a BASE-64 encoded X.509 (.cer) file:

1. Start the Windows Certificate manager by running certlm.msc and navigate to the Personal->Certificates folder and open the certificate with the friendly name **DocumentDbEmulatorCertificate**.

    :::image type="content" source="./media/local-emulator-export-ssl-certificates/database-local-emulator-export-step-1.png" alt-text="Azure Cosmos DB local emulator export step 1":::

1. Click on **Details** then **OK**.

    :::image type="content" source="./media/local-emulator-export-ssl-certificates/database-local-emulator-export-step-2.png" alt-text="Azure Cosmos DB local emulator export step 2":::

1. Click **Copy to File...**.

    :::image type="content" source="./media/local-emulator-export-ssl-certificates/database-local-emulator-export-step-3.png" alt-text="Azure Cosmos DB local emulator export step 3":::

1. Click **Next**.

    :::image type="content" source="./media/local-emulator-export-ssl-certificates/database-local-emulator-export-step-4.png" alt-text="Azure Cosmos DB local emulator export step 4":::

1. Click **No, do not export private key**, then click **Next**.

    :::image type="content" source="./media/local-emulator-export-ssl-certificates/database-local-emulator-export-step-5.png" alt-text="Azure Cosmos DB local emulator export step 5":::

1. Click on **Base-64 encoded X.509 (.CER)** and then **Next**.

    :::image type="content" source="./media/local-emulator-export-ssl-certificates/database-local-emulator-export-step-6.png" alt-text="Azure Cosmos DB local emulator export step 6":::

1. Give the certificate a name. In this case **documentdbemulatorcert** and then click **Next**.

    :::image type="content" source="./media/local-emulator-export-ssl-certificates/database-local-emulator-export-step-7.png" alt-text="Azure Cosmos DB local emulator export step 7":::

1. Click **Finish**.

    :::image type="content" source="./media/local-emulator-export-ssl-certificates/database-local-emulator-export-step-8.png" alt-text="Azure Cosmos DB local emulator export step 8":::

## Use the certificate with Java apps

When running Java applications or MongoDB applications that uses a Java based client, it is easier to install the certificate into the Java default certificate store than passing the `-Djavax.net.ssl.trustStore=<keystore> -Djavax.net.ssl.trustStorePassword="<password>"` flags. For example, the included Java Demo application (`https://localhost:8081/_explorer/index.html`) depends on the default certificate store.

Follow the instructions in the [Adding a Certificate to the Java Certificates Store](https://docs.microsoft.com/azure/java-add-certificate-ca-store) to import the X.509 certificate into the default Java certificate store. Keep in mind you will be working in the *%JAVA_HOME%* directory when running keytool. After the certificate is imported into the certificate store, clients for SQL and Azure Cosmos DB's API for MongoDB will be able to connect to the Azure Cosmos Emulator.

Alternatively you can run the following bash script to import the certificate:

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

Once the "CosmosDBEmulatorCertificate" TLS/SSL certificate is installed, your application should be able to connect and use the local Azure Cosmos DB Emulator. If you have any issues, you can follow the [Debugging SSL/TLS connections](https://docs.oracle.com/javase/7/docs/technotes/guides/security/jsse/ReadDebug.html) article. In most cases, the certificate may not be installed into the *%JAVA_HOME%/jre/lib/security/cacerts* store. For example, if you have multiple installed versions of Java your application may be using a different cacerts store than the one you updated.

## Use the certificate with Python apps

When connecting to the emulator from Python apps, TLS verification is disabled. By default the [Python SDK(version 2.0.0 or higher)](sql-api-sdk-python.md) for the SQL API will not try to use the TLS/SSL certificate when connecting to the local emulator. If however you want to use TLS validation, you can follow the examples in the [Python socket wrappers](https://docs.python.org/2/library/ssl.html) documentation.

## How to use the certificate in Node.js

When connecting to the emulator from Node.js SDKs, TLS verification is disabled. By default the [Node.js SDK(version 1.10.1 or higher)](sql-api-sdk-node.md) for the SQL API will not try to use the TLS/SSL certificate when connecting to the local emulator. If however you want to use TLS validation, you can follow the examples in the [Node.js documentation](https://nodejs.org/api/tls.html#tls_tls_connect_options_callback).

## Rotate emulator certificates

You can force regenerate the emulator certificates by selecting **Reset Data** from the Azure Cosmos DB emulator running in the Windows Tray. Note that this action will also wipe out all the data stored locally by the emulator.

:::image type="content" source="./media/local-emulator-export-ssl-certificates/database-local-emulator-reset-data.png" alt-text="Azure Cosmos DB local emulator reset data":::

If you have installed the certificate into the Java certificate store or used them elsewhere, you need to re-import them using the current certificates. Your application can't connect to the local emulator until you update the certificates.

## Next steps

* [Use command line parameters and PowerShell commands to control the emulator](emulator-command-line-parameters.md)
* [Debug issues with the emulator](troubleshoot-local-emulator.md)

