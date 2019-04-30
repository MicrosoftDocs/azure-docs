---
title: 'REST API: Filesystem operations on Azure Data Lake Storage Gen1 | Microsoft Docs'
description: Use WebHDFS REST APIs to perform filesystem operations on Azure Data Lake Storage Gen1
services: data-lake-store
documentationcenter: ''
author: twooley
manager: mtillman
editor: cgronlun

ms.service: data-lake-store
ms.devlang: na
ms.topic: conceptual
ms.date: 05/29/2018
ms.author: twooley

---
# Filesystem operations on Azure Data Lake Storage Gen1 using REST API
> [!div class="op_single_selector"]
> * [.NET SDK](data-lake-store-data-operations-net-sdk.md)
> * [Java SDK](data-lake-store-get-started-java-sdk.md)
> * [REST API](data-lake-store-data-operations-rest-api.md)
> * [Python](data-lake-store-data-operations-python.md)
>
> 

In this article, you learn how to use WebHDFS REST APIs and Data Lake Storage Gen1 REST APIs to perform filesystem operations on Azure Data Lake Storage Gen1. For instructions on how to perform account management operations on Data Lake Storage Gen1 using REST API, see [Account management operations on Data Lake Storage Gen1 using REST API](data-lake-store-get-started-rest-api.md).

## Prerequisites
* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

* **Azure Data Lake Storage Gen1 account**. Follow the instructions at [Get started with Azure Data Lake Storage Gen1 using the Azure portal](data-lake-store-get-started-portal.md).

* **[cURL](https://curl.haxx.se/)**. This article uses cURL to demonstrate how to make REST API calls against a Data Lake Storage Gen1 account.

## How do I authenticate using Azure Active Directory?
You can use two approaches to authenticate using Azure Active Directory.

* For end-user authentication for your application (interactive), see [End-user authentication with Data Lake Storage Gen1 using .NET SDK](data-lake-store-end-user-authenticate-rest-api.md).
* For service-to-service authentication for your application (non-interactive), see [Service-to-service authentication with Data Lake Storage Gen1 using .NET SDK](data-lake-store-service-to-service-authenticate-rest-api.md).


## Create folders
This operation is based on the WebHDFS REST API call defined [here](https://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Make_a_Directory).

Use the following cURL command. Replace **\<yourstorename>** with your Data Lake Storage Gen1 account name.

    curl -i -X PUT -H "Authorization: Bearer <REDACTED>" -d "" 'https://<yourstorename>.azuredatalakestore.net/webhdfs/v1/mytempdir/?op=MKDIRS'

In the preceding command, replace \<`REDACTED`\> with the authorization token you retrieved earlier. This command creates a directory called **mytempdir** under the root folder of your Data Lake Storage Gen1 account.

If the operation completes successfully, you should see a response like the following snippet:

    {"boolean":true}

## List folders
This operation is based on the WebHDFS REST API call defined [here](https://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#List_a_Directory).

Use the following cURL command. Replace **\<yourstorename>** with your Data Lake Storage Gen1 account name.

    curl -i -X GET -H "Authorization: Bearer <REDACTED>" 'https://<yourstorename>.azuredatalakestore.net/webhdfs/v1/?op=LISTSTATUS'

In the preceding command, replace \<`REDACTED`\> with the authorization token you retrieved earlier.

If the operation completes successfully, you should see a response like the following snippet:

    {
    "FileStatuses": {
        "FileStatus": [{
            "length": 0,
            "pathSuffix": "mytempdir",
            "type": "DIRECTORY",
            "blockSize": 268435456,
            "accessTime": 1458324719512,
            "modificationTime": 1458324719512,
            "replication": 0,
            "permission": "777",
            "owner": "<GUID>",
            "group": "<GUID>"
        }]
    }
    }

## Upload data
This operation is based on the WebHDFS REST API call defined [here](https://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Create_and_Write_to_a_File).

Use the following cURL command. Replace **\<yourstorename>** with your Data Lake Storage Gen1 account name.

	curl -i -X PUT -L -T 'C:\temp\list.txt' -H "Authorization: Bearer <REDACTED>" 'https://<yourstorename>.azuredatalakestore.net/webhdfs/v1/mytempdir/list.txt?op=CREATE'

In the preceding syntax **-T** parameter is the location of the file you are uploading.

The output is similar to the following snippet:
   
	HTTP/1.1 307 Temporary Redirect
	...
	Location: https://<yourstorename>.azuredatalakestore.net/webhdfs/v1/mytempdir/list.txt?op=CREATE&write=true
	...
	Content-Length: 0

	HTTP/1.1 100 Continue

	HTTP/1.1 201 Created
	...

## Read data
This operation is based on the WebHDFS REST API call defined [here](https://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Open_and_Read_a_File).

Reading data from a Data Lake Storage Gen1 account is a two-step process.

* You first submit a GET request against the endpoint `https://<yourstorename>.azuredatalakestore.net/webhdfs/v1/mytempdir/myinputfile.txt?op=OPEN`. This call returns a location to submit the next GET request to.
* You then submit the GET request against the endpoint `https://<yourstorename>.azuredatalakestore.net/webhdfs/v1/mytempdir/myinputfile.txt?op=OPEN&read=true`. This call displays the contents of the file.

However, because there is no difference in the input parameters between the first and the second step, you can use the `-L` parameter to submit the first request. `-L` option essentially combines two requests into one and makes cURL redo the request on the new location. Finally, the output from all the request calls is displayed, like shown in the following snippet. Replace **\<yourstorename>** with your Data Lake Storage Gen1 account name.

    curl -i -L GET -H "Authorization: Bearer <REDACTED>" 'https://<yourstorename>.azuredatalakestore.net/webhdfs/v1/mytempdir/myinputfile.txt?op=OPEN'

You should see an output similar to the following snippet:

    HTTP/1.1 307 Temporary Redirect
    ...
    Location: https://<yourstorename>.azuredatalakestore.net/webhdfs/v1/mytempdir/somerandomfile.txt?op=OPEN&read=true
    ...

    HTTP/1.1 200 OK
    ...

    Hello, Data Lake Store user!

## Rename a file
This operation is based on the WebHDFS REST API call defined [here](https://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Rename_a_FileDirectory).

Use the following cURL command to rename a file. Replace **\<yourstorename>** with your Data Lake Storage Gen1 account name.

    curl -i -X PUT -H "Authorization: Bearer <REDACTED>" -d "" 'https://<yourstorename>.azuredatalakestore.net/webhdfs/v1/mytempdir/myinputfile.txt?op=RENAME&destination=/mytempdir/myinputfile1.txt'

You should see an output similar to the  following snippet:

    HTTP/1.1 200 OK
    ...

    {"boolean":true}

## Delete a file
This operation is based on the WebHDFS REST API call defined [here](https://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Delete_a_FileDirectory).

Use the following cURL command to delete a file. Replace **\<yourstorename>** with your Data Lake Storage Gen1 account name.

    curl -i -X DELETE -H "Authorization: Bearer <REDACTED>" 'https://<yourstorename>.azuredatalakestore.net/webhdfs/v1/mytempdir/myinputfile1.txt?op=DELETE'

You should see an output like the following:

    HTTP/1.1 200 OK
    ...

    {"boolean":true}

## Next steps
* [Account management operations on Data Lake Storage Gen1 using REST API](data-lake-store-get-started-rest-api.md).

## See also
* [Azure Data Lake Storage Gen1 REST API Reference](https://docs.microsoft.com/rest/api/datalakestore/)
* [Open Source Big Data applications compatible with Azure Data Lake Storage Gen1](data-lake-store-compatible-oss-other-applications.md)

