---
title: 'Quickstart: Publish on an MQTT topic by using the CLI'
description: Quickstart guide to use the Azure Event Grid MQTT broker feature and the Azure CLI to publish and subscribe to MQTT messages on a topic.
ms.topic: quickstart
ms.custom:
  - build-2023
  - devx-track-azurecli
  - ignite-2023
ms.date: 06/24/2025
author: george-guirguis
ms.author: geguirgu
ms.subservice: mqtt
#customer intent: As a developer, I want to use the Azure Event Grid MQTT broker for messaging of apps and IoT.
---

# Quickstart: Publish and subscribe to MQTT messages on an Event Grid namespace with the Azure CLI

In this quickstart, you use the Azure Event Grid MQTT broker feature to support messaging by using the MQTT protocol. Clients, including both devices and cloud applications, can publish and subscribe to MQTT messages over flexible hierarchical topics for scenarios such as high-scale broadcast and command and control.

In this article, you use the Azure CLI to:

- Create an Event Grid namespace and enable the MQTT broker.
- Create subresources such as clients, client groups, and topic spaces.
- Grant clients access to publish and subscribe to topic spaces.
- Publish and receive MQTT messages.

If you don't have an [Azure subscription](/azure/guides/developer/azure-developer-guide#understanding-accounts-subscriptions-and-billing), create an [Azure free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

## Prerequisites

- If you're new to Event Grid, see the [Event Grid overview](../event-grid/overview.md) before you start this tutorial.
- Register the Event Grid resource provider according to the steps in [Register the Event Grid resource provider](../event-grid/custom-event-quickstart-portal.md#register-the-event-grid-resource-provider).
- Make sure that port 8883 is open in your firewall. This tutorial uses the MQTT protocol, which communicates over port 8883. This port might be blocked in some corporate and educational network environments.
- Use the Bash environment in [Azure Cloud Shell](../cloud-shell/overview.md). For more information, see [Get started with Azure Cloud Shell](../cloud-shell/quickstart.md).
- If you prefer to run CLI reference commands locally, [install](/cli/azure/install-azure-cli) the Azure CLI. If you run on Windows or macOS, consider running the Azure CLI in a Docker container. For more information, see [Run the Azure CLI in a Docker container](/cli/azure/run-azure-cli-docker).
- If you're using a local installation, sign in to the Azure CLI by using the [`az login`](/cli/azure/reference-index#az-login) command. To finish the authentication process, follow the steps that appear in your terminal. For other sign-in options, see [Authenticate to Azure using Azure CLI](/cli/azure/authenticate-azure-cli).
- When you're prompted, install the Azure CLI extension on first use. For more information about extensions, see [Manage Azure CLI Extensions](/cli/azure/azure-cli-extensions-overview).
- Run [az version](/cli/azure/reference-index?#az-version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index?#az-upgrade).
- This article requires version 2.53.1 or later of the Azure CLI. If you're using Azure Cloud Shell, the latest version is already installed.
- You need an X.509 client certificate to generate the thumbprint and authenticate the client connection.
- Review the Event Grid namespace [CLI commands](/cli/azure/eventgrid/namespace).

## Generate a sample client certificate and thumbprint

If you don't already have a certificate, you can create a sample certificate by using the [step CLI](https://smallstep.com/docs/step-cli/installation/). Consider installing manually for Windows.

After a successful installation by using the step CLI, open a Command Prompt window in your user profile folder (`Win+R type %USERPROFILE%`).

1. To create root and intermediate certificates, run the following command. Remember the password, which you need to use in the next step.

    ```powershell
    step ca init --deployment-type standalone --name MqttAppSamplesCA --dns localhost --address 127.0.0.1:443 --provisioner MqttAppSamplesCAProvisioner
    ```

1. To create a certificate for the client, use the certificate authority (CA) files generated. Make sure to use the correct path for the cert and secrets files in the command.

    ```powershell
    step certificate create client1-authnID client1-authnID.pem client1-authnID.key --ca .step/certs/intermediate_ca.crt --ca-key .step/secrets/intermediate_ca_key --no-password --insecure --not-after 2400h
    ```

1. To view the thumbprint, run the step command.

   ```powershell
   step certificate fingerprint client1-authnID.pem
   ```

## Create a namespace

Use this command to create a namespace. Update the command with your resource group and a namespace name.

```azurecli-interactive
az eventgrid namespace create --resource-group {Resource Group} --name {Namespace Name} --topic-spaces-configuration "{state:Enabled}"
```

To keep this quickstart simple, create a namespace with minimal properties. For more information about network, security, and settings on other tabs, see [Create and manage namespaces](create-view-manage-namespaces.md).

## Create clients

Use this command to create the client. Update the command with your resource group and a namespace name.

```azurecli-interactive
az eventgrid namespace client create --resource-group {Resource Group} --namespace-name {Namespace Name} --name {Client Name} --authentication-name client1-authnID --client-certificate-authentication "{validationScheme:ThumbprintMatch,allowed-thumbprints:[Client Thumbprint]}"
```

- To keep this quickstart simple, use thumbprint match for authentication. For steps on how to use the X.509 CA certificate chain for client authentication, see [Client authentication using certificate chain](./mqtt-certificate-chain-client-authentication.md).
- For this exercise, use the default `$all client` group, which includes all the clients in the namespace. To learn more about creating custom client groups by using client attributes, see [Client groups](mqtt-client-groups.md).

## Create topic spaces

Use this command to create the topic space. Update the command with your resource group, namespace name, and topic space name.

```azurecli-interactive
az eventgrid namespace topic-space create --resource-group {Resource Group} --namespace-name {Namespace Name} --name {Topicspace Name} --topic-templates ['contosotopics/topic1']
```

## Create permission bindings

Use the `az eventgrid` command to create the first permission binding for publisher permission. Update the command with your resource group, namespace name, and permission binding name.

```azurecli-interactive
az eventgrid namespace permission-binding create --resource-group {Resource Group} --namespace-name {Namespace Name} --name {Permission Binding Name} --client-group-name '$all' --permission publisher --topic-space-name {Topicspace Name}
```

Use this command to create the second permission binding. Update the command with your resource group, namespace name, and permission binding name. This permission binding is for subscribers.

```azurecli-interactive
az eventgrid namespace permission-binding create --resource-group {Resource Group} --namespace-name {Namespace Name} --name {Name of second Permission Binding} --client-group-name '$all' --permission subscriber --topic-space-name {Topicspace Name}
```

## Publish and subscribe to MQTT messages

The following sample code is a simple .NET publisher that attempts to connect and publish to a namespace and subscribes to the MQTT topic. You can modify the code for your requirements and run it in Visual Studio or another design tool.

You need to install the MQTTnet package (version 4.1.4.563) from NuGet to run this code. In Visual Studio, right-click the project name in Solution Explorer, go to **Manage NuGet packages**, and search for **MQTTnet**. Select **MQTTnet package** and install.

> [!NOTE]
> The following sample code is for demonstration purposes only and isn't intended for production use.

### Sample C# code to connect a client, publish, and subscribe to an MQTT message on a topic

> [!IMPORTANT]
> Update the client certificate and key pem file paths depending on the location of your client certificate files. Also, ensure that the client authentication name and topic information match with your configuration.

```csharp
using MQTTnet.Client;
using MQTTnet;
using System.Security.Cryptography.X509Certificates;

string hostname = "{Your Event Grid namespace MQTT hostname}";
string clientId = "client1-session1";  //client ID can be the session identifier.  A client can have multiple sessions using username and clientId.
string x509_pem = @" client certificate cer.pem file path\client.cer.pem";  //Provide your client certificate .cer.pem file path
string x509_key = @"client certificate key.pem file path\client.key.pem";  //Provide your client certificate .key.pem file path

var certificate = new X509Certificate2(X509Certificate2.CreateFromPemFile(x509_pem, x509_key).Export(X509ContentType.Pkcs12));

var mqttClient = new MqttFactory().CreateMqttClient();

var connAck = await mqttClient!.ConnectAsync(new MqttClientOptionsBuilder()
    .WithTcpServer(hostname, 8883)
    .WithClientId(clientId)
    .WithCredentials("client1-authnID", "")  //use client authentication name in the username
    .WithTls(new MqttClientOptionsBuilderTlsParameters()
    {
        UseTls = true,
        Certificates = new X509Certificate2Collection(certificate)
    })

    .Build());

Console.WriteLine($"Client Connected: {mqttClient.IsConnected} with CONNACK: {connAck.ResultCode}");

mqttClient.ApplicationMessageReceivedAsync += async m => await Console.Out.WriteAsync($"Received message on topic: '{m.ApplicationMessage.Topic}' with content: '{m.ApplicationMessage.ConvertPayloadToString()}'\n\n");

var suback = await mqttClient.SubscribeAsync("contosotopics/topic1");
suback.Items.ToList().ForEach(s => Console.WriteLine($"subscribed to '{s.TopicFilter.Topic}' with '{s.ResultCode}'"));

while (true)
{
    var puback = await mqttClient.PublishStringAsync("contosotopics/topic1", "hello world!");
    Console.WriteLine(puback.ReasonString);
    await Task.Delay(1000);
}

```

You can replicate and modify the same code for multiple clients to publish and subscribe among the clients.

## Related content

- [Tutorial: Route MQTT messages to Azure Event Hubs using namespace topics](mqtt-routing-to-event-hubs-portal-namespace-topics.md)
- [Tutorial: Route MQTT messages to Azure Functions using custom topics](mqtt-routing-to-azure-functions-portal.md)

For code samples, go to [this GitHub repository](https://github.com/Azure-Samples/MqttApplicationSamples/tree/main).
