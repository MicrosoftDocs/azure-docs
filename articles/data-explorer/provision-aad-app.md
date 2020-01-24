---
title: Create an AAD application in Azure Data Explorer
description: Learn how to create an AAD application in Azure Data Explorer.
author: orspod
ms.author: orspodek
ms.reviewer: tzgitlin
ms.service: data-explorer
ms.topic: conceptual
ms.date: 01/24/2020
---

# Create an Azure Active Directory application registration

Azure Active Directory (Azure AD) application authentication is used for applications, such as an unattended service or a scheduled flow, that need to access Azure Data Explorer without a user present. If you're connecting to an Azure Data Explorer database using an application, such as a web app, you should authenticate using service principal authentication. This article details how to create and register an Azure AD service principal and then authorize it to access an Azure Data Explorer database.

## Create Azure AD Application Registration

Azure AD application authentication requires creating and registering an application with Azure AD. 
A service principal is automatically created when the application registration is created in an Azure AD tenant. 

1. Log in to [Azure portal](https://portal.azure.com) and open the `Azure Active Directory` blade

	![Select Azure Active Directory from portal menu](media/provision-aad-app/provisionaadapp-createappreg-select-azure-active-directory.png)

1. Select the **App registrations** blade and select **New registration**

    ![Start a new app registration](media/provision-aad-app/provisionaadapp-createappreg-new-registration.png)

1. Fill in the following: 
    * **Name** 
    * **Supported account types**
    * **Redirect URI** > **Web**
        > [!IMPORTANT] 
	    > The application type should be **Web**. The URI is optional and is left blank in this case.
    * Select **Register**

	![Register new app registration](media/provision-aad-app/provisionaadapp-createappreg-register-app.png)

1. Select the **Overview** blade and copy the **Application ID**.

	> [!NOTE]
	> You'll need the application ID to authorize the service principal to access the database.

	![Copy app registration id](media/provision-aad-app/provisionaadapp-createappreg-copy-applicationid.png)

1. In the **Certificates & secrets** blade, select **New client secret**

	![Initiate creation of client secret](media/provision-aad-app/provisionaadapp-createappreg-new-client-secret.png)

    > [!TIP]
    > This article describes using a client secret for the application's credentials.  You can also use an X509 certificate to authenticate your application. Select **Upload certificate** and follow the instructions to upload the public portion of the certificate.

1. Enter a description, expiration, and select **Add**

	![Enter client secret parameters](media/provision-aad-app/provisionaadapp-createappreg-enter-client-secret-details.png)

1. Copy the key value

	> [!NOTE]
	> When you leave this page, the key value won't be accessible.  You will need the key to configure client credentials to the database.

	![Copy client secret key value](media/provision-aad-app/provisionaadapp-createappreg-copy-client-secret.png)

Your application is created. If you only need access to an authorized Azure Data Explorer resource, such as in the programmatic example \\below\\, skip the next section. If you need support for delegated permissions, see [configure delegated permissions for the application registration](#configure-delegated-permissions-for-the-application-registration).

## Configure delegated permissions for the application registration

If your application needs to access Azure Data Explorer using the credentials of the calling user, configure delegated permissions for your application registration. For example, if you're building a web API to access Azure Data Explorer and you want to authenticate using the credentials of the user who is *calling* your API.  

1. In the **API permissions** blade, select **Add a permission**.

	![Initiate adding app registration API permission](media/provision-aad-app/provisionaadapp-configuredelegated-add-permission.png)

1. Select **APIs my organization uses**. Search for and select **KustoService**

	![Add KustoService API permission](media/provision-aad-app/provisionaadapp-configuredelegated-search-for-kustoservice.png)

1. In **Delegated permissions**, select the **user_impersonation** box and **Add permissions**

	![Select delegated permissions with user impersonation](media/provision-aad-app/provisionaadapp-configuredelegated-click-add-permissions.png)	 

## Verify Application Registration

\\Is there another way to verify. Geneva is internal only?

## Grant the service principal access to an Azure Data Explorer database

Now that your service principal application registration is created, you need to grant the corresponding service principal access to your Azure Data Explorer database. 

1. In the Web UI(\\link\\), connect to your database and open a query tab.

1. Execute the following command:

	```kusto
	.add database <DatabaseName> viewers ('<ApplicationId>') '<Notes>'
	```

	For example:
	
	```kusto
	.add database Logs viewers ('aadapp=f778b387-ba15-437f-a69e-ed9c9225278b') 'Kusto App Registration'
	```

	\\The last parameter is a string that shows up as notes when you query the roles associated with a database.\\
	
	> [!NOTE]
	> After creating the application registration, there may be a several minute delay until Azure Data Explorer can reference it. If you receive an error, that the application is not found, when executing this command, wait and try again.

For additional information see [security roles management](../security-roles.md) and [ingestion permissions](../../api/netfx/kusto-ingest-client-permissions.md).  

## Using Application Credentials to Access a Database

Use the application credentials to programmatically access your database by using the [Kusto client library](../../api/netfx/about-kusto-data.md).

```C#
. . .
string applicationClientId = "f778b387-ba15-437f-a69e-ed9c9225278b";
string applicationKey = "tBvAns1f7M75/?QI@?.4=uouC94UWBnC";
. . .
var kcsb = new KustoConnectionStringBuilder($"https://{clusterName}.kusto.windows.net/{databaseName}")
    .WithAadApplicationKeyAuthentication(
        applicationClientId,
        applicationKey,
        authority);
var client = KustoClientFactory.CreateCslQueryProvider(kcsb);
var queryResult = client.ExecuteQuery($"{query}");
```

   > [!NOTE]
   > Specify the application id and key of the application registration (service principal) created earlier.

> For more information, see [authenticate with AAD for Azure Data Explorer access](./how-to-authenticate-with-aad.md).

## AAD errors
\\should we remove

### Invalid resource error

If your application is used to authenticate users or applications for Kusto access, you must set up delegated permissions for Kusto service application, i.e. declare that your application can authenticate users or applications for Kusto access.
Not doing so will result in an error similar to the following, when an authentication attempt is made:

`AADSTS650057: Invalid resource. The client has requested access to a resource which is not listed in the requested permissions in the client's application registration...`

You will need to follow the instructions on [setting up delegated permissions for Kusto service application](#set-up-delegated-permissions-for-kusto-service-application).

### Enable user consent error

Your AAD tenant administrator may enact a policy that prevents tenant users from giving consent to applications. This situation will result in an error similar to the following, when a user tries to login to your application:

`AADSTS65001: The user or administrator has not consented to use the application with ID '<App ID>' named 'App Name'`

You will need to contact your AAD administrator to grant consent for all users in the tenant, or enable user consent for your specific application.

## Next steps

* See [Kusto connection strings](../../api/connection-strings/kusto.md) for list of supported connection strings.
