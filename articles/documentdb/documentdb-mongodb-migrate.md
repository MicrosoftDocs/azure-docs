---
title: Migrate data to Azure DocumentDB account with protocol support for MongoDB | Microsoft Docs
description: Learn how to use mongoimport and mongorestore to import data to a DocumentDB account with protocol support for MongoDB, now available for preview.
keywords: migrate
services: documentdb
author: AndrewHoh
manager: jhubbard
editor: ''
documentationcenter: ''

ms.assetid: 352c5fb9-8772-4c5f-87ac-74885e63ecac
ms.service: documentdb
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/07/2016
ms.author: anhoh

---
# Migrate data to DocumentDB with protocol support for MongoDB
To migrate to an Azure DocumentDB account with protocol support for MongoDB, you must:

* Download either *mongoimport.exe* or *mongorestore.exe* from [MongoDB](https://www.mongodb.com/download-center)
* Have your DocumentDB account with protocol support for MongoDB [connection string](documentdb-connect-mongodb-account.md) information

## Things to know before Migrating

1. **Increase throughput** - The duration of your data migration will be influenced by how much throughput you provision for your collections. Make sure you increase the throughput for larger data migrations. Afterwards, make sure to decrease the throughput back down to save costs. Instructions on how to increase throughput in the [Azure Portal](https://portal.azure.com) can be found in [Performance levels and pricing tiers in DocumentDB](documentdb-performance-levels.md).

2. **Enable SSL** - DocumentDB has strict security requirements and standards. Make sure to enable SSL when interacting with your account. The examples below include how to enable SSL for *mongoimport* and *mongorestore*.

## Find your Connection Information (Host, Port, Username, and Password)

1. Head over to the [Azure Portal](https://portal.azure.com).

2. Click on the **NoSQL (DocumentDB)** entry on the Portal's left-hand resource navigation.

3. Find and click on your **DocumentDB with protocol support for MongoDB Account Name** in the list of DocumentDB accounts.

4. In the newly opened Account blade, click on **Connection String** in left-hand navigation.

    ![Screen shot of the Connection Blade](./media/documentdb-mongodb-migrate/ConnectionStringBlade.png)

5. The **Connection String** blade will contain all the information to successfully connect to your account.

## Import data to DocumentDB with protocol support for MongoDB with mongoimport

1. Fill in the *host*, *username*, and *password* with the values specific for your account.

    Template:

        mongoimport.exe --host <your_hostname>:10250 -u <your_username> -p <your_password> --db <your_database> --collection <your_collection> --ssl --sslAllowInvalidCertificates --type json --file C:\sample.json

    Example:

        mongoimport.exe --host anhoh-host.documents.azure.com:10250 -u anhoh-host -p tkvaVkp4Nnaoirnouenrgisuner2435qwefBH0z256Na24frio34LNQasfaefarfernoimczciqisAXw== --ssl --sslAllowInvalidCertificates --db sampleDB --collection sampleColl --type json --file C:\Users\anhoh\Desktop\*.json

2. Congratulations! You have successfully imported data to your DocumentDB account.

## Import data to DocumentDB with protocol support for MongoDB with mongorestore

1. Fill in the *host*, *username*, and *password* with the values specific for your account.

    Template:

        mongorestore.exe --host <your_hostname>:10250 -u <your_username> -p <your_password> --db <your_database> --collection <your_collection> --ssl --sslAllowInvalidCertificates <path_to_backup>

    Example:

        mongorestore.exe --host anhoh-host.documents.azure.com:10250 -u anhoh-host -p tkvaVkp4Nnaoirnouenrgisuner2435qwefBH0z256Na24frio34LNQasfaefarfernoimczciqisAXw== --ssl --sslAllowInvalidCertificates ./dumps/dump-2016-12-07

2. Congratulations! You have successfully restored data to your DocumentDB account.

## Next steps
* Explore DocumentDB with protocol support for MongoDB [samples](documentdb-mongodb-samples.md).
