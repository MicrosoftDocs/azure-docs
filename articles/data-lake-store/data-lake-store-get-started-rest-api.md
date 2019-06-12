---
title: 'REST API: Account management operations on Azure Data Lake Storage Gen1 | Microsoft Docs'
description: Use Azure Data Lake Storage Gen1 and WebHDFS REST API to perform account management operations in the Data Lake Storage Gen1 account
services: data-lake-store
documentationcenter: ''
author: twooley
manager: mtillman
editor: cgronlun

ms.assetid: 57ac6501-cb71-4f75-82c2-acc07c562889
ms.service: data-lake-store
ms.devlang: na
ms.topic: conceptual
ms.date: 05/29/2018
ms.author: twooley

---
# Account management operations on Azure Data Lake Storage Gen1 using REST API
> [!div class="op_single_selector"]
> * [.NET SDK](data-lake-store-get-started-net-sdk.md)
> * [REST API](data-lake-store-get-started-rest-api.md)
> * [Python](data-lake-store-get-started-python.md)
>
>

In this article, you learn how to perform account management operations on Azure Data Lake Storage Gen1 using the REST API. Account management operations include creating a Data Lake Storage Gen1 account, deleting a Data Lake Storage Gen1 account, etc. For instructions on how to perform filesystem operations on Data Lake Storage Gen1 using REST API, see [Filesystem operations on Data Lake Storage Gen1 using REST API](data-lake-store-data-operations-rest-api.md).

## Prerequisites
* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

* **[cURL](https://curl.haxx.se/)**. This article uses cURL to demonstrate how to make REST API calls against a Data Lake Storage Gen1 account.

## How do I authenticate using Azure Active Directory?
You can use two approaches to authenticate using Azure Active Directory.

* For end-user authentication for your application (interactive), see [End-user authentication with Data Lake Storage Gen1 using .NET SDK](data-lake-store-end-user-authenticate-rest-api.md).
* For service-to-service authentication for your application (non-interactive), see [Service-to-service authentication with Data Lake Storage Gen1 using .NET SDK](data-lake-store-service-to-service-authenticate-rest-api.md).


## Create a Data Lake Storage Gen1 account
This operation is based on the REST API call defined [here](https://docs.microsoft.com/rest/api/datalakestore/accounts/create).

Use the following cURL command. Replace **\<yourstoragegen1name>** with your Data Lake Storage Gen1 name.

    curl -i -X PUT -H "Authorization: Bearer <REDACTED>" -H "Content-Type: application/json" https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.DataLakeStore/accounts/<yourstoragegen1name>?api-version=2015-10-01-preview -d@"C:\temp\input.json"

In the above command, replace \<`REDACTED`\> with the authorization token you retrieved earlier. The request payload for this command is contained in the **input.json** file that is provided for the `-d` parameter above. The contents of the input.json file resemble the following snippet:

    {
    "location": "eastus2",
    "tags": {
        "department": "finance"
        },
    "properties": {}
    }    

## Delete a Data Lake Storage Gen1 account
This operation is based on the REST API call defined [here](https://docs.microsoft.com/rest/api/datalakestore/accounts/delete).

Use the following cURL command to delete a Data Lake Storage Gen1 account. Replace **\<yourstoragegen1name>** with your Data Lake Storage Gen1 account name.

    curl -i -X DELETE -H "Authorization: Bearer <REDACTED>" https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.DataLakeStore/accounts/<yourstoragegen1name>?api-version=2015-10-01-preview

You should see an output like the following snippet:

    HTTP/1.1 200 OK
    ...
    ...

## Next steps
* [Filesystem operations on Data Lake Storage Gen1 using REST API](data-lake-store-data-operations-rest-api.md).

## See also
* [Azure Data Lake Storage Gen1 REST API Reference](https://docs.microsoft.com/rest/api/datalakestore/)
* [Open Source Big Data applications compatible with Azure Data Lake Storage Gen1](data-lake-store-compatible-oss-other-applications.md)

