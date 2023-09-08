---
title: 'Quickstart: Publish and subscribe on an MQTT topic using portal'
description: 'Quickstart guide to use Azure Event Grid MQTT and Azure portal to publish and subscribe MQTT messages on a topic'
ms.topic: quickstart
ms.custom: build-2023
ms.date: 05/23/2023
author: veyaddan
ms.author: veyaddan
---

# Quickstart: Publish and subscribe to MQTT messages on Event Grid Namespace with Azure portal (Preview)

In this article, you use the Azure portal to do the following tasks:

1. Create an Event Grid Namespace with MQTT
2. Create subresources such as Clients, Client Groups, and Topic Spaces
3. Grant clients access to publish and subscribe to topic spaces
4. Publish and receive messages between clients

[!INCLUDE [mqtt-preview-note](./includes/mqtt-preview-note.md)] 

## Prerequisites

- If you don't have an Azure subscription, create an Azure free account before you begin.
- If you're new to Azure Event Grid, read through Event Grid overview before starting this tutorial.
- Make sure that port 8883 is open in your firewall. The sample in this tutorial uses MQTT protocol, which communicates over port 8883. This port may be blocked in some corporate and educational network environments.
- You need an X.509 client certificate to generate the thumbprint and authenticate the client connection.

## Generate sample client certificate and thumbprint
If you don't already have a certificate, you can create a sample certificate using the [step CLI](https://smallstep.com/docs/step-cli/installation/).  Consider installing manually for Windows.

After a successful installation of Step, you should open a command prompt in your user profile folder (Win+R type %USERPROFILE%).

1. To create root and intermediate certificates, run the following command.  Remember the password, which needs to be used in the next step.

```powershell
step ca init --deployment-type standalone --name MqttAppSamplesCA --dns localhost --address 127.0.0.1:443 --provisioner MqttAppSamplesCAProvisioner
```

2. Using the CA files generated to create certificate for the client.  Ensure to use the correct path for the cert and secrets files in the command.

```powershell
step certificate create client1-authnID client1-authnID.pem client1-authnID.key --ca .step/certs/intermediate_ca.crt --ca-key .step/secrets/intermediate_ca_key --no-password --insecure --not-after 2400h
```

3. To view the thumbprint, run the Step command.

```powershell
step certificate fingerprint client1-authnID.pem
```

## Create a Namespace

1. Sign in to [Azure portal](https://portal.azure.com/).
2. In the search bar, type Event Grid Namespaces, and then select **Event Grid Namespaces** from the drop-down list.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/search-event-grid-namespace.png" alt-text="Screenshot of searching for Event Grid namespace on Azure portal.":::

3. On the Event Grid Namespaces page, select **+ Create** on the toolbar.
4. On the Create namespace page, follow these steps:

    1. Select your Azure subscription.
    2. Select an existing resource group or select Create new and enter a name for the resource group.
    3. Provide a unique name for the namespace.  The namespace name must be unique per region because it represents a DNS entry.  Don't use the name shown in the image. Instead, create your own name - it must be between 3-50 characters and contain only values a-z, A-Z, 0-9, and "-".
    4. Select a location for the Event Grid namespace.  Currently, Event Grid namespace is available only in select regions.
    
        :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/create-event-grid-namespace-basics.png" alt-text="Screenshot showing Event Grid namespace create flow basics tab.":::

1. Select **Review + create** at the bottom of the page.
1. On the Review + create tab of the Create namespace page, select **Create**.

    > [!NOTE]
    > To keep the QuickStart simple, you'll be using only the Basics page to create a namespace. For detailed steps about configuring network, security, and other settings on other pages of the wizard, see Create a Namespace.    
1. After the deployment succeeds, select **Go to resource** to navigate to the Event Grid Namespace Overview page for your namespace.  
1. In the Overview page, you see that the MQTT is in Disabled state.  To enable MQTT, select the **Disabled** link, it will redirect you to Configuration page.
1. On Configuration page, select the Enable MQTT option, and Apply the settings.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/mqtt-enable-mqtt-on-configuration.png" alt-text="Screenshot showing Event Grid namespace configuration page to enable MQTT.":::


## Create clients

1. Go to Clients page under MQTT section.
2. On the Clients page, select **+ Client** on the toolbar.
3. Provide a name for the client.  Client names must be unique in a namespace.
4. Client authentication name is defaulted to client name.  You may change it if you want.  You need to include this name as Username in CONNECT packet.
5. We use Thumbprint based authentication for this exercise.  Include the Client certificate’s thumbprint in the Primary Thumbprint.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/mqtt-client1-metadata.png" alt-text="Screenshot of client 1 configuration.":::
6. Select **Create** to create the client.
7. Repeat the above steps to create another client called “client2”.  

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/mqtt-client2-metadata.png" alt-text="Screenshot of client 2 configuration.":::

    > [!NOTE]
    > - To keep the QuickStart simple, you'll be using Thumbprint match for authentication.  For detailed steps on using X.509 CA certificate chain for client authentication, see [client authentication using certificate chain](./mqtt-certificate-chain-client-authentication.md).
    > - Also, we use the default $all client group, which includes all the clients in the namespace for this exercise.  To learn more about creating custom client groups using client attributes, see client groups.
    
## Create topic spaces

1. Go to Topic spaces page under MQTT section.
2. On the Topic spaces page, select **+ Topic space** on the toolbar.
3. Provide a name for the topic space.  
4. Select **+ Add topic template** to add the topic template contosotopics/topic1.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/create-topic-space.png" alt-text="Screenshot of topic space configuration.":::
5. Select **Create** to create the topic space.

## Configuring access control using permission bindings

1. Go to Permission bindings page under MQTT section.
2. On the Permission bindings page, select **+ Permission binding** on the toolbar.
3. Configure the permission binding as follows:
    1. Provide a name for the permission binding.
    2. Select the client group name as $all.  
    3. For Topic space name, select the topic space you created in the previous step.  
    4. Grant Publisher permission to the client group on the topic space.

        :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/create-permission-binding-1.png" alt-text="Screenshot showing creation of first permission binding.":::
4. Select **Create** to create the permission binding.
5. Create one more permission binding by selecting **+ Permission binding** on the toolbar.
6. Provide a name and give $all client group Subscriber access to the Topicspace1 as shown.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/create-permission-binding-2.png" alt-text="Screenshot showing creation of second permission binding.":::
7. Select **Create** to create the permission binding.

## Connecting the clients to the EG Namespace using MQTTX app

1. For publish / subscribe MQTT messages, you can use any of your favorite tools.  For demonstration purpose, publish / subscribe is shown using MQTTX app, which can be downloaded from https://mqttx.app/.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/mqttx-app-add-client.png" alt-text="Screenshot showing MQTTX app left rail to add new client.":::

1. Configure client1 with  
    - Name as client-name-1 (this value can be anything)
    - Client ID as client1-sessionID1 (Client ID in CONNECT packet is used to identify the session ID for the client connection)
    - Username as client1-authnID (Username must match the client authentication name in client metadata)

1. Update the host name to MQTT hostname from the Overview page of the namespace.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/event-grid-namespace-overview.png" alt-text="Screenshot showing Event Grid namespace overview page, which has MQTT hostname.":::

1. Update the port to 8883
1. Toggle SSL/TLS to ON.
1. Toggle SSL Secure to ON, to ensure service certificate validation.
1. Select Certificate as Self signed.
1. Provide the path to client.cer.pem file for Client Certificate File.
1. Provide the path to client.key.pem file for Client key file.
1. Rest of the settings can be left with predefined default values.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/mqttx-app-client1-configuration-1.png" alt-text="Screenshot showing client 1 configuration part 1 on MQTTX app.":::

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/mqttx-app-client1-configuration-2.png" alt-text="Screenshot showing client 1 configuration part 2 on MQTTX app.":::

1. Select Connect to connect the client to the Event Grid MQTT service.
1. Repeat the above steps to connect the second client “client2”, with corresponding authentication information as shown.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/mqttx-app-client2-configuration-1.png" alt-text="Screenshot showing client 2 configuration part 1 on MQTTX app.":::

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/mqttx-app-client2-configuration-2.png" alt-text="Screenshot showing client 2 configuration part 2 on MQTTX app.":::

## Publish/subscribe using MQTTX app

1. After connecting the clients, for client2, select the + New Subscription button.
2. Add contosotopics/topic1 as Topic and select Confirm.  You can leave the other fields with existing default values.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/mqttx-app-add-subscription-topic.png" alt-text="Screenshot showing subscription topic configuration on MQTTX app.":::

3. Select client1 in left rail.
4. In client1, on top of the message compose box, add contosotopics/topic1 as the Topic to publish on.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/mqttx-app-publish-topic.png" alt-text="Screenshot showing message publishing on the topic in MQTTX app.":::

5. Compose a message.  You can use any format or a JSON as shown.
6. Select the send button.
7. The message should be seen as Published in client 1.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/mqttx-app-publish-message.png" alt-text="Screenshot showing message published on the topic in MQTTX app.":::

8. The message should be received by the client2

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/mqttx-app-subscribe-message.png" alt-text="Screenshot showing the message received by the subscribing client on MQTTX app.":::

## Next steps
- [Route MQTT messages to Event Hubs](mqtt-routing-to-event-hubs-portal.md)
- For code samples, go to [this repository.](https://github.com/Azure-Samples/MqttApplicationSamples/tree/main)
