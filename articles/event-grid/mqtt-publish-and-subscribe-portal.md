---
title: 'Quickstart: Publish and subscribe on an MQTT topic using portal'
description: 'Quickstart guide to use Azure Event Grid MQTT and Azure portal to publish and subscribe MQTT messages on a topic.'
ms.topic: quickstart
ms.custom: build-2023
ms.date: 05/23/2023
author: veyaddan
ms.author: veyaddan
---

# Quickstart: Publish and subscribe to MQTT messages on Event Grid Namespace with Azure portal (Preview)

In this article, you use the Azure portal to do the following tasks:

1. Create an Event Grid namespace with MQTT feature 
2. Create sub resources such as clients, client groups, and topic spaces
3. Grant clients access to publish and subscribe to topic spaces
4. Publish and receive messages between clients

[!INCLUDE [mqtt-preview-note](./includes/mqtt-preview-note.md)] 

## Prerequisites

- Create an [Azure free account](https://azure.microsoft.com/free/) If you don't have an Azure subscription. 
- Read through [Event Grid overview](overview.md) before starting this tutorial, if you're new to Azure Event Grid.
- Ensure that port 8883 is open in your firewall. The sample in this tutorial uses the MQTT protocol, which communicates over port 8883. This port may be blocked in some corporate and educational network environments.
- You need an X.509 client certificate to generate the thumbprint and authenticate the client connection.

## Generate sample client certificate and thumbprint

If you don't already have a certificate, you can create a sample certificate using the [step CLI](https://smallstep.com/docs/step-cli/installation/). Consider installing manually for Windows.

After a successful installation of Step, you should open a command prompt in your user profile folder (Win+R type %USERPROFILE%).

1. To create root and intermediate certificates, run the following command. Remember the password, which needs to be used in the next step.

    ```powershell
    step ca init --deployment-type standalone --name MqttAppSamplesCA --dns localhost --address 127.0.0.1:443 --provisioner MqttAppSamplesCAProvisioner
    ```    
2. Use the CA files generated to create a certificate for the first client. Ensure to use the correct path for the cert and secrets files in the command.

    ```powershell
    step certificate create client1-authn-ID client1-authn-ID.pem client1-authn-ID.key --ca .step/certs/intermediate_ca.crt --ca-key .step/secrets/intermediate_ca_key --no-password --insecure --not-after 2400h
    ```    
3. To view the thumbprint, run the Step command.

    ```powershell
    step certificate fingerprint client1-authn-ID.pem
    ```
4. Now, create a certificate for the second client. 
    
    ```powershell
    step certificate create client2-authn-ID client2-authn-ID.pem client2-authn-ID.key --ca .step/certs/intermediate_ca.crt --ca-key .step/secrets/intermediate_ca_key --no-password --insecure --not-after 2400h
    ```    
5. To view the thumbprint to use with the second client, run the Step command.

    ```powershell
    step certificate fingerprint client2-authn-ID.pem
    ```

## Create a namespace

1. Sign in to [Azure portal](https://portal.azure.com/).
2. In the search bar, type Event Grid Namespaces, and then select **Event Grid Namespaces** from the drop-down list.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/search-event-grid-namespace.png" alt-text="Screenshot of searching for Event Grid namespace on Azure portal.":::
3. On the Event Grid Namespaces page, select **+ Create** on the toolbar.
4. On the Create namespace page, follow these steps:

    1. Select your Azure subscription.
    2. Select an existing resource group or select Create new and enter a name for the resource group.
    3. Provide a unique name for the namespace. The namespace name must be unique per region because it represents a DNS entry. Don't use the name shown in the image. Instead, create your own name - it must be between 3-50 characters and contain only values a-z, A-Z, 0-9, and `-`.
    4. Select a location for the Event Grid namespace. Currently, Event Grid namespace is available only in select regions.
    
        :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/create-event-grid-namespace-basics.png" alt-text="Screenshot showing Event Grid namespace create flow basics tab.":::
1. Select **Review + create** at the bottom of the page.
1. On the **Review + create** tab of the **Create namespace** page, select **Create**.

    > [!NOTE]
    > To keep the QuickStart simple, you'll be using only the Basics page to create a namespace. For detailed steps about configuring network, security, and other settings on other pages of the wizard, see [Create a Namespace](create-view-manage-namespaces.md).
1. After the deployment succeeds, select **Go to resource** to navigate to the Event Grid Namespace Overview page for your namespace. 
1. In the Overview page, you see that the **MQTT** is in **Disabled** state. To enable MQTT, select the **Disabled** link, it will redirect you to Configuration page.
1. On **Configuration** page, select the **Enable MQTT** option, and then select **Apply** to apply the settings.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/mqtt-enable-mqtt-on-configuration.png" alt-text="Screenshot showing Event Grid namespace configuration page to enable MQTT." lightbox="./media/mqtt-publish-and-subscribe-portal/mqtt-enable-mqtt-on-configuration.png":::


## Create clients

1. On the left menu, select **Clients** in the **MQTT** section.
2. On the **Clients** page, select **+ Client** on the toolbar.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/add-client-menu.png" alt-text="Screenshot of the Clients page with Add button selected." lightbox="./media/mqtt-publish-and-subscribe-portal/add-client-menu.png":::
1. On the **Create client** page, enter a **name** for the client. Client names must be unique in a namespace.
1. Client authentication name is defaulted to the client name. For this tutorial, change it to `client1-authn-ID`. You need to include this name as `Username` in the CONNECT packet.
1. In this tutorial, you use thumbprint based authentication. Include the first client certificate’s thumbprint in the **Primary Thumbprint**. 

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/mqtt-client1-metadata.png" alt-text="Screenshot of client 1 configuration.":::
6. Select **Create** on the toolbar to create another client.
7. Repeat the above steps to create a second client named `client2`. Change the authentication name to `client2-authn-ID` and include the **second** client certificate’s thumbprint in the **Primary Thumbprint**. 

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/mqtt-client2-metadata.png" alt-text="Screenshot of client 2 configuration.":::

    > [!NOTE]
    > - To keep the QuickStart simple, you'll be using Thumbprint match for authentication. For detailed steps on using X.509 CA certificate chain for client authentication, see [client authentication using certificate chain](./mqtt-certificate-chain-client-authentication.md).
    > - Also, we use the default `$all` client group, which includes all the clients in the namespace for this exercise. To learn more about creating custom client groups using client attributes, see client groups.
    
## Create topic spaces

1. On the left menu, select **Topic spaces** in the **MQTT** section.
2. On the **Topic spaces** page, select **+ Topic space** on the toolbar.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/create-topic-space-menu.png" alt-text="Screenshot of Topic spaces page with create button selected." lightbox="./media/mqtt-publish-and-subscribe-portal/create-topic-space-menu.png":::
1. On the **Create topic space** page, enter a name for the topic space. 
1. Select **+ Add topic template**.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/create-topic-space-name.png" alt-text="Screenshot of Create topic space with the name.":::
1. Enter `contosotopics/topic1` for the topic template, and then select **Create** to create the topic space.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/create-topic-space.png" alt-text="Screenshot of topic space configuration.":::

## Configuring access control using permission bindings

1. On the left menu, select **Permission bindings** in the **MQTT** section.
2. On the Permission bindings page, select **+ Permission binding** on the toolbar.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/create-permission-binding-menu.png" alt-text="Screenshot that shows the Permission bindings page with the Create button selected." lightbox="./media/mqtt-publish-and-subscribe-portal/create-permission-binding-menu.png":::    
1. Configure the permission binding as follows:
    1. Provide a **name** for the permission binding. For example, `contosopublisherbinding`.
    2. For **client group name**, select **$all**. 
    3. For **Topic space name**, select the topic space you created in the previous step. 
    4. Grant the **Publisher** permission to the client group on the topic space.

        :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/create-permission-binding-1.png" alt-text="Screenshot showing creation of first permission binding.":::
4. Select **Create** to create the permission binding.
5. Create one more permission binding (`contososubscriberbinding`) by selecting **+ Permission binding** on the toolbar.
6. Provide a name and give **$all** client group **Subscriber** access to the **ContosoTopicSpace** as shown.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/create-permission-binding-2.png" alt-text="Screenshot showing creation of second permission binding.":::
7. Select **Create** to create the permission binding.

## Connecting the clients to the EG Namespace using MQTTX app

1. For publish / subscribe MQTT messages, you can use any of your favorite tools. For demonstration purpose, publish / subscribe is shown using MQTTX app, which can be downloaded from https://mqttx.app/.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/mqttx-app-add-client.png" alt-text="Screenshot showing MQTTX app left rail to add new client.":::
1. Configure client1 with  
    - **Name** as `client1` (this value can be anything)
    - **Client ID** as `client1-session1` (Client ID in the CONNECT packet is used to identify the session ID for the client connection)
    - **Username** as `client1-authn-ID`. This value must match the value of **Client Authentication Name** that you specified when you created the client in the Azure portal. 
    
        > [!IMPORTANT]
        > Username must match the client authentication name in client metadata.
1. Update the host name to MQTT hostname from the Overview page of the namespace.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/event-grid-namespace-overview.png" alt-text="Screenshot showing Event Grid namespace overview page, which has MQTT hostname." lightbox="./media/mqtt-publish-and-subscribe-portal/event-grid-namespace-overview.png":::
1. Update the **port** to **8883**.
1. Toggle **SSL/TLS** to ON.
1. Toggle **SSL Secure** to ON, to ensure service certificate validation.
1. Select **Certificate** as **Self signed**.
1. Provide the path for client certificate file.
1. Provide the path for the client key file.
1. Rest of the settings can be left with predefined default values.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/mqttx-app-client1-configuration-1.png" alt-text="Screenshot showing client 1 configuration part 1 on MQTTX app." lightbox="./media/mqtt-publish-and-subscribe-portal/mqttx-app-client1-configuration-1.png":::
1. Select **Connect** to connect the client to the Event Grid MQTT service.
1. Repeat the above steps to connect the second client **client2**, with corresponding authentication information as shown.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/mqttx-app-client2-configuration-1.png" alt-text="Screenshot showing client 2 configuration part 1 on MQTTX app." lightbox="./media/mqtt-publish-and-subscribe-portal/mqttx-app-client2-configuration-1.png":::

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/mqttx-app-client2-configuration-2.png" alt-text="Screenshot showing client 2 configuration part 2 on MQTTX app." lightbox="./media/mqtt-publish-and-subscribe-portal/mqttx-app-client2-configuration-2.png":::

## Publish/subscribe using MQTTX app

1. After connecting the clients, for client2, select the **+ New Subscription** button.
2. Add `contosotopics/topic1` as topic and select **Confirm**. You can leave the other fields with existing default values.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/mqttx-app-add-subscription-topic.png" alt-text="Screenshot showing subscription topic configuration on MQTTX app." lightbox="./media/mqtt-publish-and-subscribe-portal/mqttx-app-add-subscription-topic.png":::
3. Select **client1** in left rail.
4. For client1, on top of the message compose box, type `contosotopics/topic1` as the topic to publish on.
5. Compose a message. You can use any format or a JSON as shown.
6. Select the **Send** button.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/mqttx-app-publish-topic.png" alt-text="Screenshot showing message publishing on the topic in MQTTX app." lightbox="./media/mqtt-publish-and-subscribe-portal/mqttx-app-publish-topic.png":::
7. The message should be seen as published in client 1.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/mqttx-app-publish-message.png" alt-text="Screenshot showing message published on the topic in MQTTX app." lightbox="./media/mqtt-publish-and-subscribe-portal/mqttx-app-publish-message.png":::
8. Switch to **client2**. Confirm that client2 received the message. 

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/mqttx-app-subscribe-message.png" alt-text="Screenshot showing the message received by the subscribing client on MQTTX app." lightbox="./media/mqtt-publish-and-subscribe-portal/mqttx-app-subscribe-message.png":::

## Next steps
- See [Route MQTT messages to Event Hubs](mqtt-routing-to-event-hubs-portal.md)
- For code samples, go to [this repository.](https://github.com/Azure-Samples/MqttApplicationSamples/tree/main)
