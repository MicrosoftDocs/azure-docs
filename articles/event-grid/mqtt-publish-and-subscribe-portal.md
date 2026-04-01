---
title: MQTT Publish and Subscribe with Event Grid - Azure portal
description: Quickstart guide to use Azure Event Grid’s Message Queuing Telemetry Transport (MQTT) broker feature and Azure portal to publish and subscribe MQTT messages on a topic.
ms.topic: quickstart
ms.date: 03/27/2026
author: george-guirguis
ms.author: geguirgu
ms.reviewer: spelluru
ms.subservice: mqtt
# Customer intent: I want to know how to publish and subscribe to an Azure Event Grid MQTT topic using Azure portal.
---

# Quickstart: Publish and subscribe to MQTT messages on Event Grid Namespace by using the Azure portal
In this quickstart, you use the Azure portal to create an Event Grid namespace with MQTT broker enabled. Then you create subresources such as clients, client groups, and topic spaces. You grant clients access to publish and subscribe to topic spaces, and then publish and receive messages between clients.
 

## Prerequisites

- Create an [Azure free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) if you don't have an Azure subscription. 
- If you're new to Azure Event Grid, read through [Event Grid overview](overview.md) before starting this tutorial.
- Ensure that port 8883 is open in your firewall. The sample in this tutorial uses the MQTT protocol, which communicates over port 8883. This port might be blocked in some corporate and educational network environments.
- You need an X.509 client certificate to generate the thumbprint and authenticate the client connection.

## Generate sample client certificate and thumbprint

If you don't already have a certificate, you can create a sample certificate by using the [step CLI](https://smallstep.com/docs/step-cli/installation/). Consider installing manually for Windows.

After a successful installation of Step, open a command prompt in your user profile folder (Win+R type %USERPROFILE%).

1. To create root and intermediate certificates, run the following command. Remember the password, which you need to use in the next step.

    ```powershell
    step ca init --deployment-type standalone --name MqttAppSamplesCA --dns localhost --address 127.0.0.1:443 --provisioner MqttAppSamplesCAProvisioner
    ```    
1. Use the CA files generated to create a certificate for the first client. Ensure you use the correct path for the cert and secrets files in the command.

    ```powershell
    step certificate create client1-authn-ID client1-authn-ID.pem client1-authn-ID.key --ca .step/certs/intermediate_ca.crt --ca-key .step/secrets/intermediate_ca_key --no-password --insecure --not-after 2400h
    ```    
1. To view the thumbprint, run the Step command.

    ```powershell
    step certificate fingerprint client1-authn-ID.pem
    ```
1. Now, create a certificate for the second client. 
    
    ```powershell
    step certificate create client2-authn-ID client2-authn-ID.pem client2-authn-ID.key --ca .step/certs/intermediate_ca.crt --ca-key .step/secrets/intermediate_ca_key --no-password --insecure --not-after 2400h
    ```    
1. To view the thumbprint to use with the second client, run the Step command.

    ```powershell
    step certificate fingerprint client2-authn-ID.pem
    ```

## Create a namespace

1. Sign in to [Azure portal](https://portal.azure.com/).
1. In the search bar, type **Event Grid Namespaces**, and then select **Event Grid Namespaces** from the list.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/search-event-grid-namespace.png" alt-text="Screenshot of searching for Event Grid namespace on Azure portal.":::
1. On **Event Grid Namespaces**, select **+ Create** on the toolbar.
1. On **Create namespace**, follow these steps:

    1. Select your Azure subscription.
    1. Select an existing resource group or select **Create new** and enter a name for the resource group.
    1. Enter a unique name for the namespace. The namespace name must be unique per region because it represents a DNS entry. Don't use the name shown in the image. Instead, create your own name - it must be between 3 and 50 characters and contain only values a-z, A-Z, 0-9, and `-`.
    1. Select a location for the Event Grid namespace. Currently, Event Grid namespace is available only in select regions.
    
        :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/create-event-grid-namespace-basics.png" alt-text="Screenshot showing Event Grid namespace create flow basics tab.":::
1. Select **Review + create** at the bottom of the page.
1. On the **Review + create** tab of the **Create namespace** page, select **Create**.

    > [!NOTE]
    > To keep the quickstart simple, use only the Basics page to create a namespace. For detailed steps about configuring network, security, and other settings on other pages of the wizard, see [Create a Namespace](create-view-manage-namespaces.md).
1. After the deployment succeeds, select **Go to resource** to go to the Event Grid Namespace Overview page for your namespace.
1. In the **Overview** page, you see that the **MQTT broker** is in **Disabled** state. To enable MQTT broker, select the **Disabled** link. It redirects you to **Configuration**.
1. On **Configuration**, select the **Enable MQTT broker** option, and then select **Apply** to apply the settings.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/mqtt-enable-mqtt-on-configuration.png" alt-text="Screenshot showing Event Grid namespace configuration page to enable MQTT." lightbox="./media/mqtt-publish-and-subscribe-portal/mqtt-enable-mqtt-on-configuration.png":::


## Create clients

1. On the left menu, select **Clients** in the **MQTT broker** section.
1. On **Clients**, select **+ Client** on the toolbar.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/add-client-menu.png" alt-text="Screenshot of the Clients page with Add button selected." lightbox="./media/mqtt-publish-and-subscribe-portal/add-client-menu.png":::
1. On **Create client**, enter a **name** for the client. Client names must be unique in a namespace.
1. The client authentication name defaults to the client name. For this tutorial, change it to `client1-authn-ID`. You need to include this name as `Username` in the CONNECT packet.
1. In this tutorial, you use thumbprint based authentication. Include the first client certificate’s thumbprint in the **Primary Thumbprint**. 

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/mqtt-client1-metadata.png" alt-text="Screenshot of the configuration of client 1.":::
1. Select **Create** on the toolbar to create another client.
1. Repeat the preceding steps to create a second client named `client2`. Change the authentication name to `client2-authn-ID` and include the **second** client certificate’s thumbprint in the **Primary Thumbprint**. 

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/mqtt-client2-metadata.png" alt-text="Screenshot of the configuration of client 2.":::

    > [!NOTE]
    > - To keep the quickstart simple, use thumbprint match for authentication. For detailed steps on using X.509 CA certificate chain for client authentication, see [client authentication using certificate chain](./mqtt-certificate-chain-client-authentication.md).
    > - Also, use the default `$all` client group, which includes all the clients in the namespace for this exercise. To learn more about creating custom client groups using client attributes, see client groups.
    
## Create topic spaces

1. On the left menu, select **Topic spaces** in the **MQTT broker** section.
1. On **Topic spaces**, select **+ Topic space** on the toolbar.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/create-topic-space-menu.png" alt-text="Screenshot of Topic spaces page with create button selected." lightbox="./media/mqtt-publish-and-subscribe-portal/create-topic-space-menu.png":::
1. Enter a **name** for the topic space.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/create-topic-space-name.png" alt-text="Screenshot of Create topic space with the name.":::
1. Select **+ Add topic template** to add a topic template. A topic template defines the topic hierarchy for the topic space. You can have multiple topic templates under a topic space, and each topic template can have its own topic hierarchy.
1. Enter `contosotopics/topic1` for the topic template, and then select **Create** to create the topic space.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/create-topic-space.png" alt-text="Screenshot of topic space configuration.":::

## Configuring access control by using permission bindings

1. In the left menu, select **Permission bindings** in the **MQTT broker** section.
1. On **Permission bindings**, select **+ Permission binding** on the toolbar.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/create-permission-binding-menu.png" alt-text="Screenshot that shows the Permission bindings page with the Create button selected." lightbox="./media/mqtt-publish-and-subscribe-portal/create-permission-binding-menu.png":::    
1. Configure the permission binding as follows:
    1. Enter a **name** for the permission binding. For example, `contosopublisherbinding`.
    1. For **client group name**, select **$all**. 
    1. For **Topic space name**, select the topic space you created in the previous step. 
    1. Grant the **Publisher** permission to the client group on the topic space.

        :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/create-permission-binding-1.png" alt-text="Screenshot showing creation of first permission binding.":::
1. Select **Create** to create the permission binding.
1. Create one more permission binding (`contososubscriberbinding`) by selecting **+ Permission binding** on the toolbar.
1. Enter a name and give the **$all** client group **Subscriber** access to the **ContosoTopicSpace** as shown.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/create-permission-binding-2.png" alt-text="Screenshot showing creation of second permission binding.":::
1. Select **Create** to create the permission binding.

## Connect clients to the namespace by using MQTTX app

1. To publish and subscribe to MQTT messages, use any tool you like. For demonstration purposes, this article shows how to publish and subscribe by using the MQTTX app. You can download the app from [https://mqttx.app/](https://mqttx.app/).
1. Select **+** on the navigation bar to the left. 
1. Configure `client1` with  
    - **Name** as `client1` (this value can be anything)
    - **Client ID** as `client1-session1` (Client ID in the CONNECT packet identifies the session ID for the client connection)
    - **Username** as `client1-authn-ID`. This value must match the value of **Client Authentication Name** that you specified when you created the client in the Azure portal. 
    
        > [!IMPORTANT]
        > Username must match the client authentication name in client metadata.
1. Update the host name to MQTT hostname from the **Overview** page of the namespace.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/event-grid-namespace-overview.png" alt-text="Screenshot showing Event Grid namespace overview page, which has MQTT hostname." lightbox="./media/mqtt-publish-and-subscribe-portal/event-grid-namespace-overview.png":::
1. Update the **port** to **8883**.
1. Toggle **SSL/TLS** to **On**.
1. Toggle **SSL Secure** to **On**, to ensure service certificate validation.
1. Select **Certificate** as **CA or Self signed certificates**.
1. Provide the path for client certificate file.
1. Provide the path for the client key file.
1. Leave the rest of the settings with predefined default values.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/mqttx-app-client1-configuration-1.png" alt-text="Screenshot showing client 1 configuration part 1 on MQTTX app." lightbox="./media/mqtt-publish-and-subscribe-portal/mqttx-app-client1-configuration-1.png":::
1. Select **Connect** to connect the client to the MQTT broker.
1. To connect the second client `client2`, repeat the preceding steps by using the corresponding authentication information as shown.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/mqttx-app-client2-configuration-1.png" alt-text="Screenshot showing client 2 configuration part 1 on MQTTX app." lightbox="./media/mqtt-publish-and-subscribe-portal/mqttx-app-client2-configuration-1.png":::

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/mqttx-app-client2-configuration-2.png" alt-text="Screenshot showing client 2 configuration part 2 on MQTTX app." lightbox="./media/mqtt-publish-and-subscribe-portal/mqttx-app-client2-configuration-2.png":::

## Publish and subscribe by using MQTTX app

1. After connecting the clients, select **+ New Subscription** for client2.
1. Add `contosotopics/topic1` as the topic and select **Confirm**. You can leave the other fields with the existing default values.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/mqttx-app-add-subscription-topic.png" alt-text="Screenshot showing subscription topic configuration on MQTTX app." lightbox="./media/mqtt-publish-and-subscribe-portal/mqttx-app-add-subscription-topic.png":::
1. Select **client1** in the left rail.
1. For client1, on top of the message compose box, type `contosotopics/topic1` as the topic to publish on.
1. Compose a message. You can use any format or a JSON as shown.
1. Select the **Send** button.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/mqttx-app-publish-topic.png" alt-text="Screenshot showing message publishing on the topic in MQTTX app." lightbox="./media/mqtt-publish-and-subscribe-portal/mqttx-app-publish-topic.png":::
1. You see the message as published in client 1.

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/mqttx-app-publish-message.png" alt-text="Screenshot showing message published on the topic in MQTTX app." lightbox="./media/mqtt-publish-and-subscribe-portal/mqttx-app-publish-message.png":::
1. Switch to **client2**. Confirm that client2 received the message. 

    :::image type="content" source="./media/mqtt-publish-and-subscribe-portal/mqttx-app-subscribe-message.png" alt-text="Screenshot showing the message received by the subscribing client on MQTTX app." lightbox="./media/mqtt-publish-and-subscribe-portal/mqttx-app-subscribe-message.png":::

## Related content
- [Tutorial: Route MQTT messages to Azure Event Hubs using namespace topics](mqtt-routing-to-event-hubs-portal-namespace-topics.md)
- [Tutorial: Route MQTT messages to Azure Functions using custom topics](mqtt-routing-to-azure-functions-portal.md)
- For code samples, go to [this repository.](https://github.com/Azure-Samples/MqttApplicationSamples/tree/main)
