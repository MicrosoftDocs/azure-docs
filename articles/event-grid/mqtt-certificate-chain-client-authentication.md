---
title: 'Azure Event Grid Namespace MQTT client authentication using certificate chain'
description: 'Describes how to configure MQTT clients to authenticate using CA certificate chains.'
ms.topic: conceptual
ms.date: 04/20/2023
author: veyaddan
ms.author: veyaddan
---

# Client authentication using CA certificate chain
Use CA certificate chain in Azure Event Grid to authenticate clients while connecting to the service.

In this guide, you perform the following tasks:
1. Upload a CA certificate, the immediate parent certificate of the client certificate, to the namespace.
2. Configure client authentication settings.
3. Connect a client using the client certificate signed by the previously uploaded CA certificate.

## Prerequisites
  -	You need an Event Grid Namespace already created.
  -	You need a CA certificate chain:  Client certificates and the parent certificate (typically an intermediate certificate) that was used to sign the client certificates.

## Upload the CA certificate to the namespace
1. In Azure portal, navigate to your Event Grid namespace.
2. Under the MQTT section in left rail, navigate to CA certificates menu.

:::image type="content" source="./media/mqtt-certificate-chain-client-authentication/event-grid-namespace-upload-certificate-authority-certificate.png" alt-text="Screenshot showing the CA certificate page under MQTT section in Event Grid namespace.":::

3. Select **+ Certificate** to launch the Upload certificate page.
4. On the Upload certificate page, give a Certificate name and browse for the certificate file.
5. Select **Upload** button to add the parent certificate.

:::image type="content" source="./media/mqtt-certificate-chain-client-authentication/event-grid-namespace-parent-certificate-added.png" alt-text="Screenshot showing the added CA certificate listed in the CA certificates page.":::

## Configure client authentication settings
1. Navigate to the Clients page.
2. Select **+ Client** to add a new client.  If you want to update an existing client, you can select the client name and open the Update client page.
3. In the Create client page, add the client name, client authentication name, and the client certificate authentication validation scheme.  Typically the client authentication name would be in the subject name field for the client certificate. 

:::image type="content" source="./media/mqtt-certificate-chain-client-authentication/client-authentication-name-in-certificate-subject.png" alt-text="Screenshot showing the client metadata using the subject matches the authentication name option.":::

4. Select **Create** button to create the client.

### Sample certificate object schema

```json
{
    "properties": {
        "description": "CA certificate description",
        "encodedCertificate": "-----BEGIN CERTIFICATE-----`Base64 encoded Certificate`-----END CERTIFICATE-----"
    }
}
```

### Azure CLI configuration
Use the following commands to upload/show/delete a certificate authority (CA) certificate to the service

**Upload certificate authority root or intermediate certificate**
```azurecli-interactive
az resource create --resource-type Microsoft.EventGrid/namespaces/caCertificates --id /subscriptions/`Subscription ID`/resourceGroups/`Resource Group`/providers/Microsoft.EventGrid/namespaces/`Namespace Name`/caCertificates/`CA certificate name` --api-version  --properties @./resources/ca-cert.json
```

**Show certificate information**
```azurecli-interactive
az resource show --id /subscriptions/`Subscription ID`/resourceGroups/`Resource Group`/providers/Microsoft.EventGrid/namespaces/`Namespace Name`/caCertificates/`CA certificate name`
```

**Delete certificate**
```azurecli-interactive
az resource delete --id /subscriptions/`Subscription ID`/resourceGroups/`Resource Group`/providers/Microsoft.EventGrid/namespaces/`Namespace Name`/caCertificates/`CA certificate name`
```

## Connect the client and publish / subscribe MQTT messages

The following sample code is a simple .NET publisher that attempts to connect, and publish to a namespace, and subscribes to the topic.  You can use the code to modify per your requirement and run the below code in Visual Studio or any of your favorite tools.  

You need to install the MQTTnet package (version 4.1.4.563) from NuGet to run the code.  
(In Visual Studio, right click on the project name in Solution Explorer, go to Manage NuGet packages, search for MQTTnet.  Select MQTTnet package and install.)

> [!NOTE]
>The following sample code is only for demonstration purposes and is not intended for production use.

**Sample C# code to connect a client, publish/subscribe MQTT message on a topic**

```csharp
using MQTTnet.Client;
using MQTTnet;
using System.Security.Cryptography.X509Certificates;

string hostname = "contosoegnamespace.eastus2-1.ts.eventgrid.azure.net";
string clientId = "client3-session1";  //client ID can be the session identifier.  A client can have multiple sessions using username and clientId.
string x509_pem = @" client certificate cer.pem file path\client.cer.pem";  //Provide your client certificate .cer.pem file path
string x509_key = @"client certificate key.pem file path\client.key.pem";  //Provide your client certificate .key.pem file path

var certificate = new X509Certificate2(X509Certificate2.CreateFromPemFile(x509_pem, x509_key).Export(X509ContentType.Pkcs12));

var mqttClient = new MqttFactory().CreateMqttClient();

var connAck = await mqttClient!.ConnectAsync(new MqttClientOptionsBuilder()
    .WithTcpServer(hostname, 8883)
    .WithClientId(clientId).WithCredentials(“client3-authnid”, "")  //use client authentication name in the username
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

You can replicate and modify the code for multiple clients to perform publish / subscribe among the clients.
