---
title: Connect to a DocumentDB account with protocol support for MongoDB | Microsoft Docs
description: Learn how to connect to a DocumentDB account with protocol support for MongoDB, now available for preview. Connect by using your MongoDB connection string.
keywords: mongodb connection string
services: documentdb
author: AndrewHoh
manager: jhubbard
editor: ''
documentationcenter: ''

ms.assetid: e36f7375-9329-403b-afd1-4ab49894f75e
ms.service: documentdb
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/22/2016
ms.author: anhoh

---
# How to connect to a DocumentDB account with protocol support for MongoDB
Learn how to connect to an Azure DocumentDB account with protocol support for MongoDB using the standard MongoDB connection string URI format.  

## Quick start to connect to your DocumentDB account with protocol support for MongoDB
1. In a new window, sign in to the [Azure Portal](https://portal.azure.com).
2. In the **Left Navigation** bar of the Account Blade, click **Quick start**. To navigate to the **Account Blade**, on the Jumpbar click **More Services**, click **DocumentDB (NoSQL)** , and then select the DocumentDB account with protocol support for MongoDB.
3. Choose your platform (*.NET driver*, *Node.js driver*, *MongoDB Shell*, *Java driver*, *Python driver*). If you don't see your driver or tool listed, don't worry we continuously document more connection code snippets. Please comment below on what you'd like to see and read [Get the account's connection string information](#GetCustomConnection) to learn how to craft your own connection.
4. Copy and paste the code snippet/command, and you are ready to go.

    ![Screen shot of the quick start blade](./media/documentdb-connect-mongodb-account/QuickStartBlade.png)

## <a id="GetCustomConnection"></a> Get the account's connection string information
1. In a new window, sign in to the [Azure Portal](https://portal.azure.com).
2. In the **Left Navigation** bar of the Account Blade, click **Connection String**. To navigate to the **Account Blade**, on the Jumpbar click **More Services**, click **DocumentDB (NoSQL)** , and then select the DocumentDB account with protocol support for MongoDB.
3. The **Connection String Information** blade opens and has all the information necessary to connect to the account using a driver for MongoDB, including a pre-constructed connection string.

    ![Screen shot of the connection string blade](./media/documentdb-connect-mongodb-account/ConnectionStringBlade.png)

## Connection string requirements
> [!Important]
> DocumentDB has strict security requirements and standards. DocumentDB accounts require authentication and secure communication via **SSL**
>
>

It is important to note that DocumentDB supports the standard MongoDB connection string URI format, with a couple of specific requirements: DocumentDB accounts require authentication and secure communication via SSL.  Thus, the connection string format is:

    mongodb://username:password@host:port/[database]?ssl=true

Where the values of this string are available in the Connection String blade shown above.

* Username (required)
  * DocumentDB account name
* Password (required)
  * DocumentDB account password
* Host (required)
  * FQDN of DocumentDB account
* Port (required)
  * 10250
* Database (optional)
  * The default database used by the connection
* ssl=true (required)

For example, consider the account shown in the Connection String Information above.  A valid connection string is:

    mongodb://contoso123:<password@anhohmongo.documents.azure.com:10250/mydatabase?ssl=true

## Next steps
* Learn how to [use MongoChef](documentdb-mongodb-mongochef.md) with a DocumentDB account with protocol support for MongoDB.
* Explore DocumentDB with protocol support for MongoDB [samples](documentdb-mongodb-samples.md).
