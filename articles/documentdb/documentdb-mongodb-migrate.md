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
ms.date: 12/06/2016
ms.author: anhoh

---
# Migrate data to DocumentDB with protocol support for MongoDB
To migrate to an Azure DocumentDB account with protocol support for MongoDB, you must:

* Download either *mongoimport* or *mongoexport* from [MongoDB](https://www.mongodb.com/download-center?);
* Have your DocumentDB account with protocol support for MongoDB [connection string](documentdb-connect-mongodb-account.md) information

# Import data to DocumentDB with protocol support for MongoDB with mongoimport

1. Find your *host*, *username*, and *password* for your DocumentDB account with protocol support for MongoDB connections in the [Azure Portal](https://portal.azure.com).

2. You can find these properties by navigating to **NoSQL (DocumentDB)** Resource Blade > **Your Account Name** > **Connection String** in the Account's left-hand navigation

3. Fill in the *host*, *username*, and *password* with the values specific for your account.

        Template: mongoimport.exe --host <your_hostname> -u <your_username> -p <your_password> --ssl --sslAllowInvalidCertificates --type json --file C:\sample.json
        
        Example: mongoimport.exe --host anhoh-host.documents.azure.com:10250 -u anhoh-host -p tkvaVkp4Nnaoirnouenrgisuner2435qwefBH0z256Na24frio34LNQasfaefarfernoimczciqisAXw== --ssl --sslAllowInvalidCertificates --db sampleDB --collection sampleColl --type json --file C:\Users\anhoh\Desktop\*.json

# Import data to DocumentDB with protocol support for MongoDB with mongorestore

mongoimport.exe --host anhoh-mongo-test.documents.azure.com:10250 -u anhoh-mongo-test -p tkvaVkp4NvQBym42bWCSYrNebEqo0IDwkLr5LqHkySG6olvBH0z256NaDVVgNLNQCexz1skbGkzmczciqisAXw== --ssl --sslAllowInvalidCertificates --db users --collection contacts --type json --file C:\Users\anhoh\Desktop\*.json

## Next steps
* Explore DocumentDB with protocol support for MongoDB [samples](documentdb-mongodb-samples.md).
