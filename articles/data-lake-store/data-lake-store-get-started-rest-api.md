<properties 
   pageTitle="Get started with Data Lake Store using REST API| Microsoft Azure" 
   description="Use WebHDFS REST APIs to perform operations on Data Lake Store" 
   services="data-lake-store" 
   documentationCenter="" 
   authors="nitinme" 
   manager="paulettm" 
   editor="cgronlun"/>
 
<tags
   ms.service="data-lake-store"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data" 
   ms.date="08/02/2016"
   ms.author="nitinme"/>

# Get started with Azure Data Lake Store using REST APIs

> [AZURE.SELECTOR]
- [Portal](data-lake-store-get-started-portal.md)
- [PowerShell](data-lake-store-get-started-powershell.md)
- [.NET SDK](data-lake-store-get-started-net-sdk.md)
- [Java SDK](data-lake-store-get-started-java-sdk.md)
- [REST API](data-lake-store-get-started-rest-api.md)
- [Azure CLI](data-lake-store-get-started-cli.md)
- [Node.js](data-lake-store-manage-use-nodejs.md)

In this article, you will learn how to use WebHDFS REST APIs and Data Lake Store REST APIs to perform account management as well as filesystem operations on Azure Data Lake Store. Azure Data Lake Store exposes its own REST APIs for account management operations. However, because Data Lake Store is compatible with HDFS and Hadoop ecosystem, it supports using WebHDFS REST APIs for filesystem operations.

>[AZURE.NOTE] For detailed information on the REST API support for Data Lake Store, see [Azure Data Lake Store REST API Reference](https://msdn.microsoft.com/library/mt693424.aspx).

## Prerequisites

- **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
- **Enable your Azure subscription** for Data Lake Store public preview. See [instructions](data-lake-store-get-started-portal.md#signup).
- **Create an Azure Active Directory Application**. There are two ways you can authenticate using Azure Active Direcotry - **interactive** and **non-interactive**. There are different prerequisites based on how you want to authenticate.
	* **For interactive authentication** (used in this article) - In Azure Active Directory, you must create a **Native Client application**. Once you have created the application, retrieve the following values related to the application.
		- Get **client ID** and **redirect URI** for the application
		- Set delegated permissions

	* **For non-interactive authentication** - In Azure Active Directory, you must create a **Web application**. Once you have created the application, retrieve the following values related to the application.
		- Get **client ID**, **client secret**,  and **redirect URI** for the application
		- Set delegated permissions
		- Assign the Azure Active Directory application to a role. The role can be at the level of the scope at which you want to give permission to the Azure Active Directory application. For example, you can assign the application at the subscription level or at the level of a resource group. For instructions, see [Assign application to a role](../resource-group-create-service-principal-portal.md#assign-application-to-role). 

	See [Create Active Directory application and service principal using portal](../resource-group-create-service-principal-portal.md) for instructions on how to retrieve these values, set the permissions, and assign roles.

- [cURL](http://curl.haxx.se/). This article uses cURL to demonstrate how to make REST API calls against a Data Lake Store account.

## How do I authenticate using Azure Active Directory?

You can use two approaches to authenticate using Azure Active Directory.

### Interactive (user authentication)

In this scenario, the application prompts the user to log in and all the operations are performed in the context of the user. Perform the following steps for interactive authentication.

1. Through your application, redirect the user to the following URL:

		https://login.microsoftonline.com/<TENANT-ID>/oauth2/authorize?client_id=<CLIENT-ID>&response_type=code&redirect_uri=<REDIRECT-URI>

	>[AZURE.NOTE] \<REDIRECT-URI> needs to be encoded for use in a URL. So, https://localhost, use `https%3A%2F%2Flocalhost`)

	For the purpose of this tutorial, you can replace the placeholder values in the URL above and paste it in a web browser's address bar. You will be redirected to authenticate using your Azure login. Once you succesfully log in, the response is displayed in the browser's address bar. The response will be in the following format:
		
		http://localhost/?code=<AUTHORIZATION-CODE>&session_state=<GUID>

2. Capture the authorization code from the response. For this tutorial, you can copy the authorization code from the address bar of the web browser and pass it in the POST request to the token endpoint, as shown below:

		curl -X POST https://login.microsoftonline.com/<TENANT-ID>/oauth2/token \
        -F redirect_uri=<REDIRECT-URI> \
        -F grant_type=authorization_code \
        -F resource=https://management.core.windows.net/ \
        -F client_id=<CLIENT-ID> \
        -F code=<AUTHORIZATION-CODE>

	>[AZURE.NOTE] In this case, the \<REDIRECT-URI> need not be encoded.

3. The response is a JSON object that contains an access token (e.g., `"access_token": "<ACCESS_TOKEN>"`) and a refresh token (e.g., `"refresh_token": "<REFRESH_TOKEN>"`). Your application uses the access token when accessing Azure Data Lake Store and the refresh token to get another access token when an access token expires.

		{"token_type":"Bearer","scope":"user_impersonation","expires_in":"3599","expires_on":"1461865782","not_before":	"1461861882","resource":"https://management.core.windows.net/","access_token":"<REDACTED>","refresh_token":"<REDACTED>","id_token":"<REDACTED>"}

4.  When the access token expires, you can request a new access token using the refresh token, as shown below:

		 curl -X POST https://login.microsoftonline.com/<TENANT-ID>/oauth2/token  \
      		-F grant_type=refresh_token \
      		-F resource=https://management.core.windows.net/ \
      		-F client_id=<CLIENT-ID> \
      		-F refresh_token=<REFRESH-TOKEN>
 
For more information on interactive user authentication, see [Authorization code grant flow](https://msdn.microsoft.com/library/azure/dn645542.aspx).

### Non-interactive

In this scenario, the the application provides its own credentials to perform the operations. For this, you must issue a POST request like the one shown below. 

	curl -X POST https://login.microsoftonline.com/<TENANT-ID>/oauth2/token  \
      -F grant_type=client_credentials \
      -F resource=https://management.core.windows.net/ \
      -F client_id=<CLIENT-ID> \
      -F client_secret=<AUTH-KEY>

The output of this request will include an authorization token (denoted by `access-token` in the output below) that you will subsequently pass with your REST API calls. Save this authentication token in a text file; you will need this later in this article.

	{"token_type":"Bearer","expires_in":"3599","expires_on":"1458245447","not_before":"1458241547","resource":"https://management.core.windows.net/","access_token":"<REDACTED>"}

This article uses the **non-interactive** approach. For more information on non-interactive (service-to-service calls), see [Service to service calls using credentials](https://msdn.microsoft.com/library/azure/dn645543.aspx).

## Create a Data Lake Store account

This operation is based on the REST API call defined [here](https://msdn.microsoft.com/library/mt694078.aspx).

Use the following cURL command. Replace **\<yourstorename>** with your Data Lake Store name.

	curl -i -X PUT -H "Authorization: Bearer <REDACTED>" -H "Content-Type: application/json" https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.DataLakeStore/accounts/<yourstorename>?api-version=2015-10-01-preview -d@"C:\temp\input.json"

In the above command, replace \<`REDACTED`\> with the authorization token you retrieved earlier. The request payload for this command is contained in the **input.json** file that is provided for the `-d` parameter above. The contents of the input.json file resemble the following:

	{
	"location": "eastus2",
	"tags": {
		"department": "finance"
		},
	"properties": {}
	}	

## Create folders in a Data Lake Store account

This operation is based on the WebHDFS REST API call defined [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Make_a_Directory).

Use the following cURL command. Replace **\<yourstorename>** with your Data Lake Store name.

	curl -i -X PUT -H "Authorization: Bearer <REDACTED>" -d "" https://<yourstorename>.azuredatalakestore.net/webhdfs/v1/mytempdir/?op=MKDIRS

In the above command, replace \<`REDACTED`\> with the authorization token you retrieved earlier. This command creates a directory called **mytempdir** under the root folder of your Data Lake Store account.

You should see a response like this if the operation completes successfully:

	{"boolean":true}

## List folders in a Data Lake Store account

This operation is based on the WebHDFS REST API call defined [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#List_a_Directory).

Use the following cURL command. Replace **\<yourstorename>** with your Data Lake Store name.

	curl -i -X GET -H "Authorization: Bearer <REDACTED>" https://<yourstorename>.azuredatalakestore.net/webhdfs/v1/?op=LISTSTATUS

In the above command, replace \<`REDACTED`\> with the authorization token you retrieved earlier.

You should see a response like this if the operation completes successfully:

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
			"owner": "NotSupportYet",
			"group": "NotSupportYet"
		}]
	}
	}

## Upload data into a Data Lake Store account

This operation is based on the WebHDFS REST API call defined [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Create_and_Write_to_a_File).

Uploading data using the WebHDFS REST API is a two-step process, as explained below.

1. Submit a HTTP PUT request without sending the file data to be uploaded. In the following command, replace **\<yourstorename>** with your Data Lake Store name.

		curl -i -X PUT -H "Authorization: Bearer <REDACTED>" -d "" https://<yourstorename>.azuredatalakestore.net/webhdfs/v1/mytempdir/?op=CREATE

	The output for this command will be contain a temporary redirect URL, like the one shown below.

		HTTP/1.1 100 Continue

		HTTP/1.1 307 Temporary Redirect
		...
		...
		Location: https://<yourstorename>.azuredatalakestore.net/webhdfs/v1/mytempdir/somerandomfile.txt?op=CREATE&write=true
		...
		...

2. You must now submit another HTTP PUT request against the URL listed for the **Location** property in the response. Replace **\<yourstorename>** with your Data Lake Store name.

		curl -i -X PUT -T myinputfile.txt -H "Authorization: Bearer <REDACTED>" https://<yourstorename>.azuredatalakestore.net/webhdfs/v1/mytempdir/myinputfile.txt?op=CREATE&write=true

	The output will be similar to the following:

		HTTP/1.1 100 Continue

		HTTP/1.1 201 Created
		...
		...

## Read data from a Data Lake Store account

This operation is based on the WebHDFS REST API call defined [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Open_and_Read_a_File).

Reading data from a Data Lake Store account is a two-step process.

* You first submit a GET request against the endpoint `https://<yourstorename>.azuredatalakestore.net/webhdfs/v1/mytempdir/myinputfile.txt?op=OPEN`. This will return a location to submit the next GET request to.
* You then submit the GET request against the endpoint `https://<yourstorename>.azuredatalakestore.net/webhdfs/v1/mytempdir/myinputfile.txt?op=OPEN&read=true`. This will display the contents of the file.

However, because there is no difference in the input parameters between the first and the second step, you can use the `-L` parameter to submit the first request. `-L` option essentially combines two requests into one and will make cURL redo the request on the new location. Finally, the output from all the request calls is displayed, like shown below. Replace **\<yourstorename>** with your Data Lake Store name.

	curl -i -L GET -H "Authorization: Bearer <REDACTED>" https://<yourstorename>.azuredatalakestore.net/webhdfs/v1/mytempdir/myinputfile.txt?op=OPEN

You should see an output similar to the following:

	HTTP/1.1 307 Temporary Redirect
	...
	Location: https://<yourstorename>.azuredatalakestore.net/webhdfs/v1/mytempdir/somerandomfile.txt?op=OPEN&read=true
	...
	
	HTTP/1.1 200 OK
	...
	
	Hello, Data Lake Store user!

## Rename a file in a Data Lake Store account

This operation is based on the WebHDFS REST API call defined [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Rename_a_FileDirectory).

Use the following cURL command to rename a file. Replace **\<yourstorename>** with your Data Lake Store name.

	curl -i -X PUT -H "Authorization: Bearer <REDACTED>" -d "" https://<yourstorename>.azuredatalakestore.net/webhdfs/v1/mytempdir/myinputfile.txt?op=RENAME&destination=/mytempdir/myinputfile1.txt

You should see an output similar to the following:

	HTTP/1.1 200 OK
	...
	
	{"boolean":true}

## Delete a file from a Data Lake Store account

This operation is based on the WebHDFS REST API call defined [here](http://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-hdfs/WebHDFS.html#Delete_a_FileDirectory).

Use the following cURL command to delete a file. Replace **\<yourstorename>** with your Data Lake Store name.

	curl -i -X DELETE -H "Authorization: Bearer <REDACTED>" https://<yourstorename>.azuredatalakestore.net/webhdfs/v1/mytempdir/myinputfile1.txt?op=DELETE

You should see an output like the following:

	HTTP/1.1 200 OK
	...
	
	{"boolean":true}

## Delete a Data Lake Store account

This operation is based on the REST API call defined [here](https://msdn.microsoft.com/library/mt694075.aspx).

Use the following cURL command to delete a Data Lake Store account. Replace **\<yourstorename>** with your Data Lake Store name.

	curl -i -X DELETE -H "Authorization: Bearer <REDACTED>" https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.DataLakeStore/accounts/<yourstorename>?api-version=2015-10-01-preview

You should see an output like the following:

	HTTP/1.1 200 OK
	...
	...

## See also

- [Open Source Big Data applications compatible with Azure Data Lake Store](data-lake-store-compatible-oss-other-applications.md)
 
