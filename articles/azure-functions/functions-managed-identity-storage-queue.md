---
title: How to configure Azure Functions with identity based connections
description: Article that shows you how to use identity based connections with Azure Functions instead of connection strings
ms.topic: conceptual
ms.date: 3/13/2021
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Using a Storage Queue Trigger with Identity-Based Connections

This article shows you how to configure a storage queue trigger to use managed identities instead of secrets. To learn more about identity based connections, see [Configure an identity-based connection.](functions-reference.md#configure-an-identity-based-connection).

Prerequisite:
- Complete the [Creating a function app with identity base connections tutorial](./functions-managed-identity-tutorial.md).

In this tutorial, you'll:
- create a storage queue trigger using managed identities

## Add a Storage Queue Trigger

Add a storage queue trigger. A prerequisite of this tutorial is having existing queue data, so I'm going to create a new storage account to represent that. I then go into the role assignments for the function app and add the Storage Queue Data Contributor role for this new storage account:

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624644797808.png)

Next, reference the new extensions. For .NET, see the next paragraph. For other languages see the [extension bundle section](#step-5-update-the-extension-bundle) above.

I make sure to update my storage extension to 5.x. This is the new storage extension for functions that uses the newest version of the Azure Storage SDK for .NET. There was a blog post about that here. At the time of writing, the newest version of the library is 5.0.0-beta4:

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624644809684.png)


This queue trigger uses a connection called "QueueConnection", so I need to configure the function app with the account name, similar to what I did above for AzureWebJobsStorage:

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624644829790.png)

I'm also using an environment variable for the name of the queue within the account (InputQueueName in the above screenshot), but its just a convenience and not necessary.

For every connection that is used as a trigger, I must also add the credential setting that specifies that managed identity is used. So I add a `QueueConnection_credential` setting with value `managedIdentity`.

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624658524131.png)

A future update to Azure Functions will remove this requirement when using system assigned identities. Once this update is live, simply setting __accountName would be enough.

My function app has been updated to have the necessary role to access the queue using managed identity, and its been configured to know what account to access, and it has a queue triggered function that uses the new extension that has support for managed identity. The only remaining step is to publish the changes. I repeat the folder publishing step, zip the content, upload it to storage calling it "queue.zip" and update my run from package URL:

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624644849689.png)

Now I go to the queue in the portal, and I add a message:

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624644858600.png)

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624644866344.png)

I wait a bit and then refresh and the message has been read:

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624644879341.png)

[!INCLUDE [clean-up-section-portal](../../includes/clean-up-section-portal.md)]

## Next steps

In this tutorial, you created a Premium function app, storage account, and Service Bus. You secured all of these resources behind private endpoints. 

Use the following links to learn more Azure Functions networking options and private endpoints:

- [Managed identity in Azure Functions](../app-service/overview-managed-identity.md)

- [Identity based connections in Azure Functions](./azure-functions/functions-reference.md#configure-an-identity-based-connection)

- [Connecting to host storage with an Identity](./azure-functions/functions-reference.md#connecting-to-host-storage-with-an-identity)

- [Creating a Function App without Azure Files](./azure-functions/storage-considerations.md#create-an-app-without-azure-files)

- [Run Azure Functions from a package file](./azure-functions/run-functions-from-deployment-package.md)

- [Use Key Vault references in Azure Functions](../app-service/app-service-key-vault-references.md)

- [Configuring the account used by Visual Studio for local development](/dotnet/api/azure/identity-readme.md#authenticating-via-visual-studio)

- [Functions documentation for local development](./azure-functions/functions-reference#local-development)

- [Azure SDK blog post about the new extensions](https://devblogs.microsoft.com/azure-sdk/introducing-the-new-azure-function-extension-libraries-beta/)

- [GitHub issue were this scenario is discussed](https://github.com/Azure/azure-functions-host/issues/6423)