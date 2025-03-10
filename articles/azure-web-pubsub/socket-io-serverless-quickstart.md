---
title: 'Quickstart: Build chat app with Azure Function in Socket.IO Serverless Mode'
description: In this article, you familiar with the samples of using Web PubSub for Socket.IO with Azure Function in Serverless Mode.
keywords: Socket.IO, serverless, azure function, Socket.IO on Azure, multi-node Socket.IO, scaling Socket.IO, socketio, azure socketio
author: zackliu
ms.author: chenyl
ms.date: 09/01/2024
ms.service: azure-web-pubsub
ms.topic: tutorial
---

# Quickstart: Build chat app with Azure Function in Socket.IO Serverless Mode (Preview)

In this article, you'll learn how to build a chat app using Web PubSub for Socket.IO in Serverless Mode with Azure Functions. The tutorial will guide you through securing your app with identity-based authentication, while working online.

The project source uses Bicep to deploy the infrastructure on Azure, and Azure Functions Core Tools to deploy the code to the Function App.

## Prerequisites

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

+ [Azure Functions Core Tools](../azure-functions/functions-run-local.md).

+ [.NET 8.0 SDK](https://dotnet.microsoft.com/download)

+ [Node.js 18](https://nodejs.org/)  


## Get the sample code

Find the sample code: [Socket.IO Serverless Sample (TS)](https://github.com/Azure/azure-webpubsub/tree/main/sdk/webpubsub-socketio-extension/examples/chat-serverless-typescript)

```bash
git clone https://github.com/Azure/azure-webpubsub.git
cd ./sdk/webpubsub-socketio-extension/examples/chat-serverless-typescript
```

## Deploy infrastructure

The chat samples need to deploy several services in Azure:

- [Azure Function App](../azure-functions/functions-overview.md)
- [Web PubSub for Socket.IO](./socketio-overview.md)
- [Managed Identity](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities): Identity for communicating between services

We use [Bicep](../azure-resource-manager/bicep/overview.md) to deploy the infrastructure. The file locates in the `./infra` folder. Deploy it with the az command:

```azcli
az deployment sub create -n "<deployment-name>" -l "<deployment-location>" --template-file ./infra/main.bicep --parameters environmentName="<env-name>" location="<location>"
```

- `<deployment-name>`: The name of the deployment.
- `<deployment-location>`: The location of the deployment metadata. Note it's not the location where resources deploy to.
- `<env-name>`: The name is a part of the resource group name and resource name.
- `<location>`: The location of the resources.

### Review of the infrastructure

In the infrastructure release, we deploy an Azure Function App in consumption plan and the Monitor and Storage Account that required by the Function App. We also deploy a Web PubSub for Socket.IO resource in Serverless Mode.

For the identity based authentication purpose, we deploy a user-assigned managed identity, assign it to both Function App and Socket.IO resource and grant it with some permissions:

- **Storage Blob Data Owner role**: Access storage for Function App
- **Monitoring Metrics Publisher role**: Access monitor for Function App
- **Web PubSub Service Owner role**: Access Web PubSub for Socket.IO for Function App

As per [Configure your Azure Functions app to use Microsoft Entra sign-in](../app-service/configure-authentication-provider-aad.md), we create a Service Principal. To avoid using secret for the Service Principal, we use [Federated identity credentials](/graph/api/resources/federatedidentitycredentials-overview).

## Deploy sample to the Function App

We prepared a bash script to deploy the sample code to the Function App:

```bash
# Deploy the project
./deploy/deploy.sh "<deployment-name>"
```

### Review the deployment detail

We need to do two steps to deploy the sample app.

- Publish code to the Function App (Use Azure Functions Core Tools)

    ```bash
    func extensions sync
    npm install
    npm run build
    func azure functionapp publish <function-app-name>
    ```

- Configure the Web PubSub for Socket.IO to add a hub setting which can send request to the Function App. As per the limitation of Function App's Webhook provider, you need to get an extension key populated by Function. Get more details in [Trigger Binding](./socket-io-serverless-function-binding.md#trigger-binding). And as we use identity-based authentication, in the hub settings, you need to assign the target resource, which is the clientId of the Service Principal created before.

    ```bash
    code=$(az functionapp keys list -g <resource-group> -n <function-name> --query systemKeys.socketio_extension -o tsv)
    az webpubsub hub create -n <socketio-name> -g <resource-group> --hub-name "hub" --event-handler url-template="https://${<function-name>}.azurewebsites.net/runtime/webhooks/socketio?code=${code}" user-event-pattern="*" auth-type="ManagedIdentity" auth-resource="<service-principal-client-id>"
    ```

### Run Sample App

After the code is deployed, visit the website to try the sample: 

```bash
https://<function-endpoint>/api/index
```

:::image type="content" source="./media/socket-io-serverless-quickstart/chat-sample.png" alt-text="Screenshot of the serverless chat app.":::

## Next steps
Next, you can follow the tutorial to write the app step by step:

> [!div class="nextstepaction"]
> [Tutorial: Build chat app with Azure Function in Serverless Mode](./socket-io-serverless-tutorial.md)