---
title: How to configure Azure Functions with identity based connections
description: Article that shows you how to use identity based connections with Azure Functions instead of connection strings
ms.topic: conceptual
ms.date: 3/13/2021
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Using a Service Bus Queue Trigger with Identity-Based Connections

This article shows you how to configure a service bus queue trigger to use managed identities instead of secrets. To learn more about identity based connections, see [Configure an identity-based connection.](functions-reference.md#configure-an-identity-based-connection).

Prerequisite:
- Complete the [Creating a function app with identity base connections tutorial](./functions-managed-identity-tutorial.md).

In this tutorial, you'll:
- create a service bus queue trigger using managed identities
- use managed identities with local development

## Add a Service Bus Queue Trigger

Again I start with role assignments, adding the function app as a Azure Service Bus Data Owner:

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624644967309.png)

I have to configure the function app with the details of the namespace. My connection is going to be called ServiceBusConnection so I add a ServiceBusConnection__fullyQualifiedNamespace setting:

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624645004512.png)

For every connection that is used as a trigger, I must also add the credential setting that specifies that managed identity is used. So I add a `ServiceBusConnection_credential` setting with value `managedIdentity`.

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624659002007.png)

I add a service bus queue triggered function, again making sure to use the newest extension which is Microsoft.Azure.WebJobs.Extensions.ServiceBus version 5.0.0-beta4 at time of writing:

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624645067952.png)

I go through similar publish steps as before. Here's my appsettings now:

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624645077874.png)


## Use Managed Identity for local development

To test the service bus trigger I added above, I need to drop a message in the service bus queue, but the portal won't let me do that. There are plenty of other ways to write a message to a service bus queue, but this seems like a good opportunity to try using managed identity locally. First I go into VS and make sure that its configured to use my account:

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624645133535.png)

Next I go into the portal and give myself the Azure Service Bus Data Owner role - the same as what I did for my function app above:
![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624645150828.png)

Now I make a separate function app that is going to host a HTTP triggered function that uses an output binding to write to the queue. Again, making sure to use the newest extension package:
![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624645164664.png)

I modify my local.settings.json so that my local environment knows which namespace and queue the message has to be written to:

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624645198975.png)

I then set this function app as my startup project and hit F5. It outputs the URL for my function, and I call it using my browser:

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624645244319.png)

Without configuring any connection string, my local debug session is able to write the message to the queue, and then I check app insights and I see my function ran and picked up the message:

![image](https://gist.github.com/paulbatum/c301e8ca07b2561db91030a1566383fa/raw/images---Fri_Jun_25_2021_1624645272006.png)

This concludes the walkthrough.

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