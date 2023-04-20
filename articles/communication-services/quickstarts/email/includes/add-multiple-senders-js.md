---
title: include file
description: include file
author: yogeshmo
manager: koagbakp
services: azure-communication-services
ms.author: yogeshmo
ms.date: 04/19/2023
ms.topic: include
ms.service: azure-communication-services
ms.custom: mode-other
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet/).
- An Azure Email Communication Services Resource created and ready to provision the domains [Get started with Creating Email Communication Resource](../../quickstarts/email/create-email-communication-resource.md)
- An [Azure Managed Domain](../../quickstarts/email/add-azure-managed-domains.md) or [Custom Domain](../../quickstarts/email/add-custom-verified-domains.md) provisioned and ready.
- We will be using a [service principal for authentication](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal). Set the values of the client ID, tenant ID and client secret of the AAD application as environment variables: AZURE_CLIENT_ID, AZURE_TENANT_ID, and AZURE_CLIENT_SECRET.

## Install the required packages

```console
npm install @azure/arm-communication
npm install @azure/identity
```

## Initialize the management client

To initialize your client, replace the field in the sample code below with your subscription id.

```javascript
const { CommunicationServiceManagementClient } = require("@azure/arm-communication");
const { DefaultAzureCredential } = require("@azure/identity");

const credential = new DefaultAzureCredential();
const subscriptionId = "<your-subscription-id>";

mgmtClient = new CommunicationServiceManagementClient(credential, subscriptionId);
```

## Add sender usernames

You can define the username you want to add in a parameters object. Update the code sample below with the resource group name, the email service name, and the domain name that you would like to add this username to. To add multiple sender usernames, you will need to repeat this code sample multiple times.

```javascript
const resourceGroupName = "<your-resource-group-name>";
const emailServiceName = "<your-email-service-name>";
const domainName = "<your-domain-name>";

const parameters = {
    displayName: "Contoso News Alerts",
    username: "contosoNewsAlerts",
};

await mgmtClient.senderUsernames.createOrUpdate(
    resourceGroupName,
    emailServiceName,
    domainName,
    "contosoNewsAlerts",
    parameters
);
```

## Remove sender usernames

To delete the sender username, simply call the delete function on the client.

```javascript
await mgmtClient.senderUsernames.delete(
    resourceGroupName,
    emailServiceName,
    domainName,
    "contosoNewsAlerts"
);
```

## Next steps

* [Get started with create and manage Email Communication Service in Azure Communication Service](../../quickstarts/email/create-email-communication-resource.md)

* [Get started by connecting Email Communication Service with a Azure Communication Service resource](../../quickstarts/email/connect-email-communication-resource.md)

The following documents may be interesting to you:

- Familiarize yourself with the [Email client library](../../concepts/email/sdk-features.md)
- How to send emails with custom verified domains?[Add custom domains](../../quickstarts/email/add-custom-verified-domains.md)
