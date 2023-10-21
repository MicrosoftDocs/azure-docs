---
title: Use MQTT bridge to connect to Azure Event Grid
# titleSuffix: Azure IoT MQ
description: Configure Azure IoT MQ for bi-directional communication with Azure Event Grid.
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.date: 10/18/2023

#CustomerIntent: As an architect, I want to understand how to configure Azure IoT MQ so that I have bi-directional communication between the Azure Event Grid and clients.
---

# Use MQTT bridge to connect to Azure Event Grid

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

You can use the Azure IoT MQ MQTT bridge to connect to Azure Event Grid. Use this article to understand how to configure Azure IoT MQ for bi-directional communication with Azure Event Grid.

> [!NOTE]
> For self-managed clusters, the recommended way to bridge to Event Grid MQTT broker is through X.509 certificates.

## Prerequisites

- [An Event Grid Namespace with MQTT enabled](https://learn.microsoft.com/azure/event-grid/create-view-manage-namespaces)
- [Mosquitto client](https://mosquitto.org/download/)
- [Step CLI](https://smallstep.com/docs/step-cli/installation/index.html)
- IoT Operations instance with Azure IoT MQ component deployed
- Azure IoT MQ broker deployment with
  - Either no authentication or SAT authentication enabled
  - Authorization allows the MQTT bridge connector to connect, publish, and subscribe

## Prepare certificates

Event Grid requires X.509 authentication. You can use [`step` CLI](https://smallstep.com/docs/step-cli/installation/index.html) to generate new certificates to illustrate the process. To prepare certificates, you initiate a new root certificate authority (CA) and an intermediate CA chained to it. The intermediate CA is used to sign some client certificates for Azure IoT MQ and mosquitto client to use. The intermediate CA is uploaded to Event Grid in the next step as the common root of trust. When Azure IoT MQ connects to Event Grid, it recognizes that the client certificate Azure IoT MQ presents is signed by a CA that's allowed.

### Initiate a Certificate Authority

1. To keep certificates organized, start with an empty directory as a clean workspace.

```bash
mkdir iotmq-workspace
cd iotmq-workspace
```

1. [Install Step CLI]()
1. Use *step* to initialize a certificate authority.

    ```bash
    step ca init
    ```
    
Complete the prompts and finish setup. Use a memorable password when prompted. The password is used several times in later steps.

### Download the DigiCert G3 root certificate

The DigiCert G3 root certificate is required to use mosquitto client with Event Grid. Use the following command to use *curl* to download the certificate:

```bash
curl https://cacerts.digicert.com/DigiCertGlobalRootG3.crt.pem -o digicert.pem
```

### Generate client certificates

1. Use the intermediate CA to sign a client certificates for Azure IoT MQ MQTT bridge **mqttbridge** to use.

    ```bash
    step certificate create mqttbridge mqttbridge.pem mqttbridge.key \
    --ca ~/.step/certs/intermediate_ca.crt \
    --ca-key ~/.step/secrets/intermediate_ca_key \
    --no-password \
    --insecure \
    --not-after 2400h 
    ```
    
1. Create a client certificate for a separate `mosquitto` client to talk Event Grid directly.

    ```bash
    step certificate create mosquitto mosquitto.pem mosquitto.key \
    --ca ~/.step/certs/intermediate_ca.crt \
    --ca-key ~/.step/secrets/intermediate_ca_key \
    --no-password \
    --insecure \
    --not-after 2400h 
    ```

    > [!IMPORTANT]
    > By using the `-no-password` and `--insecure` flags, the private key is written to disk without encryption. This makes managing the key easier for the sake of the example. Using no encryption isn't recommended for production.

1. Copy the root and intermediate CA certifcates into the current directory and rename the file extension to PEM. Only copy the certificates, not the keys. The certificate files are used in later steps.

    ```bash
    cp ~/.step/certs/root_ca.crt root.pem
    cp ~/.step/certs/intermediate_ca.crt intermediate.pem
    ```

## Configure Event Grid

An Azure Event Grid Namespace is a prerequiste. If you haven't done so already, [create an Event Grid Namespace](https://learn.microsoft.com/azure/event-grid/create-view-manage-namespaces).

1. Configure MQTT and authentication option. In the Azure portal, go to Event Grid Namespace > **Configuration** and update the following settings:

    - Check **Enable MQTT**
    - Check **Enable alternative client authentication name sources**
      - Select **Certificate Subject Name**.
    - Set **Maximum client sessions per authentication name** to **3**
    
    The alternative client authentication and max client sessions options allows Azure IoT MQ to use its client certificate subject name for authentication (instead of MQTT CONNECT Username). This is important so that Azure IoT MQ can spawn multiple instances and still be able to connect. To learn more, see [multi-session support](https://learn.microsoft.com/azure/event-grid/mqtt-establishing-multiple-sessions-per-client).
    
    ![MQTT configuration in Event Grid](config.png)
    
1. Select **Apply**. The configuration update might take a few minutes.

### Upload CA certificate

To get X.509 authentication and TLS to work, all participants should trust the same root CA, including Event Grid.

1. Upload the root certificate. Go to the Event Grid Namespace > **CA certificates** > **+ Certificate** > **Browse** and select **root.pem** from your working directory. Choose a name for the root certificat and select **Upload**.

    ![](upload-ca.png)

1. Upload the intermediate certificate. Go to the Event Grid Namespace > **CA certificates** > **+ Certificate** > **Browse** and select **intermediate.pem** from your working directory. Choose a name for the intermediate certificate and select **Upload**.

### Register Azure IoT MQ and mosquitto clients

Configure Event Grid for your clients' authentication.

1. Add the MQTT bridge client. Go to Event Grid Namespace > **Clients**.
1. Using the menu, select the add client button.
1. Set the client name to **mqttbridge**.
1. Choose **Subject Matches Authentication Name** as the authentication validation scheme.

    ![](client.png)

1. Using the menu, select the add client button.
1. Set the client name to **mosquitto**.
1. Choose **Subject Matches Authentication Name** as the authentication validation scheme.
1. Add a client attribute. Set the key to `commander` and value to `true`.

    ![](mosquitto-client.png)

### Authorization

Configure authorization with client groups, topic spaces, and permission bindings. Clients must be explicitly authorized for all MQTT topics. The concepts are unique to Event Grid and use an attribute-based access control model. The following steps creates a simplified model where:

- Azure IoT MQ's MQTT bridge can publish telemetry and receive commands.
- Mosquitto client can publish commands. Simulating a *commander*.

#### Create topic spaces

1. Create the *telemetry* topic space. Go to Event Grid Namespace > **Topic spaces**.
1. Create a topic space named **telemetry** with template `factory/telemetry/#`.
1. Choose **Low fanout** for subscription support.

    ![](telemetry-topic-space.png)

1. Create the *command* topic space. Go to Event Grid Namespace > **Topic spaces**.
1. Create a topic space named **command** with template `command/#`.
1. Choose **Low fanout** for subscription support.

    ![](command-topic-space.png)

Allow all clients to publish telemetry and subscribe to commands.

1. Create a **permission binding** to allow *all* clients to publish to the telemetry topic space.

    ![](can-publish-permission.png)

1. Create another permission binding allowing clients to subscribe to the command topic space.

    ![](can-sub-to-command.png)

#### Allow mosquitto to publish commands and subscribe to telemetry

1. To isolate mosquitto's special status as a commander, create a commanders **client group** based on the attribute set earlier with the query `attributes.commander = "true"`.

    ![](client-group.png)

1. Create **two permission bindings**, one to allow the commanders group to publish to the command topic space:

    ![](commanders-can-command.png)

1. And the other to allow subscribing to the telemetry topic space:

    ![](commanders-can-sub-tel.png)


1. Note down the Event Grid MQTT hostname. go to the Event Grid Namespace >  **Overview**, find the MQTT hostname and note it. You need it for the next step.

    ![](mqtt-hostname.png)

## Configure Azure IoT MQ MQTT bridge

Ensure that Azure IoT MQ CRDs and operator are installed, and Azure IoT MQ is up and running as specified in the prerequisites section.

### Import generated certificate as Kubernetes secret

1. Create a secret with kubectl using `mqttbridge.pem` and the corresponding private key.

    ```bash
    kubectl create secret generic remote-client-secret \
    --from-file=client_cert.pem=mqttbridge.pem \
    --from-file=client_key.pem=mqttbridge.key \
    --from-file=client_intermediate_certs.pem=intermediate.pem
    ```
    
### Create a MQTT bridge connector and topic map resources

1. In a new file `bridge.yaml`, specify the MQTT bridge connector and topic map configuration. Replace the `endpoint` value with the Event Grid MQTT hostname from previous step. Also, specify the namespace to match the one that has Broker deployed. For example, `namespace: {{% namespace %}}`.

    ```yaml
    apiVersion: az-edge.com/v1alpha4
    kind: MqttBridgeConnector
    metadata:
      name: "my-mqtt-bridge"
      namespace: <SAME NAMESPACE AS BROKER>
    spec:
      protocol: v5
      image: 
        repository: edgebuilds.azurecr.io/mqttbridge 
        tag: 0.6.0
        pullPolicy: IfNotPresent   
      bridgeInstances: 3
      clientIdPrefix: "e4k"
      logLevel: "debug"
      remoteBrokerConnection:
        endpoint: "example.westeurope-1.ts.eventgrid.azure.net:8883"
        tls:
          tlsEnabled: true
        authentication:
          x509:
            clientK8sSecret: "bridge-client-cert"
    ---
    apiVersion: az-edge.com/v1alpha4
    kind: MqttBridgeTopicMap
    metadata:
      name: "my-topic-map"
      namespace: <SAME NAMESPACE AS BROKER>
    spec:
      mqttBridgeConnectorRef: "my-mqtt-bridge"
      routes:
        - direction: remote-to-local
          name: "command-from-cloud"
          source: "command/#"
          qos: 1
        - direction: local-to-remote
          name: "publish-telemetry-same-topic"
          source: "factory/telemetry/#"
          qos: 1
        - direction: local-to-remote
          name: "prioritize-alerts"
          source: "factory/telemetry/anomaly/#"
          target: "factory/telemetry/alert"
          sharedSubscription:
            groupMinimumShareNumber: 2
            groupName: "ShareTest"
          qos: 1
    ```
    
1. Apply the deployment file with *kubectl*.

    ```console
    $ kubectl apply -f bridge.yaml
    mqttbridgeconnector.az-edge.com/my-mqtt-bridge created
    mqttbridgetopicmap.az-edge.com/my-topic-map created
    ```

### Verify MQTT bridge deployment

1. Use *kubectl* to check the three bridge instances are ready and running.

    ```console {hl_lines="11-13"}
    $ kubectl get pods
    NAME                                           READY   STATUS    RESTARTS   AGE
    azedge-diagnostics-probe-0                     1/1     Running   0          3h14m
    azedge-diagnostics-765b779c74-vwwwt            1/1     Running   0          3h14m
    azedge-dmqtt-authentication-0                  1/1     Running   0          3h8m
    azedge-dmqtt-backend-0                         1/1     Running   0          3h8m
    azedge-dmqtt-backend-1                         1/1     Running   0          3h8m
    azedge-dmqtt-frontend-5f98974545-cdg44         1/1     Running   0          3h8m
    azedge-dmqtt-health-manager-0                  1/1     Running   0          3h14m
    azedge-mqtt-bridge-operator-58cf5889bd-9wzk4   1/1     Running   0          3h14m
    azedge-my-mqtt-bridge-0                        1/1     Running   0          45s
    azedge-my-mqtt-bridge-1                        1/1     Running   0          45s
    azedge-my-mqtt-bridge-2                        1/1     Running   0          45s
    azedge-probe-7968d9bbcb-p5bpj                  1/1     Running   0          3h14m
    ```
    
You can now publish on the local broker and subscribe to the EventGrid MQTT Broker and verify messages flow as expected.

## Subscribe to commands from the cloud via the bridge

<!-- To use MQTT TUI

```bash
mqttui -b mqtt://20.252.32.176
``` -->

1. Start a subscriber to Azure IoT MQ on the `command` topic.

    ```console
    $ mosquitto_sub -t "command" -i sub_1 -d -V mqttv5 -h 20.252.32.176
    Client sub_1 sending CONNECT
    Client sub_1 received CONNACK (0)
    Client sub_1 sending SUBSCRIBE (Mid: 1, Topic: command, QoS: 0, Options: 0x00)
    Client sub_1 received SUBACK
    Subscribed (mid: 1): 0
    
    ```

1. In a new terminal window, use mosquitto to publish a command to Event Grid MQTT broker.

    ```console
    $ mosquitto_pub -q 1 -t "command" -d -V mqttv5 -m "this is a command from the cloud!" \
    $ -h example.westeurope-1.ts.eventgrid.azure.net \
    $ -i mosquitto \
    $ --cert mosquitto.pem \
    $ --key mosquitto.key \
    $ --cafile digicert.pem
    Client mosquitto sending CONNECT
    Client mosquitto received CONNACK (0)
    Client mosquitto sending PUBLISH (d0, q1, r0, m1, 'command', ... (33 bytes))
    Client mosquitto received PUBACK (Mid: 1, RC:0)
    Client mosquitto sending DISCONNECT
    ```
    
In the first window, you see the command is relayed from mosquitto > Event Grid > MQTT bridge > mosquitto.

```console {hl_lines=8}
$ mosquitto_sub -t "command" -i sub_1 -d -V mqttv5 -h 20.252.32.176
Client sub_1 sending CONNECT
Client sub_1 received CONNACK (0)
Client sub_1 sending SUBSCRIBE (Mid: 1, Topic: command, QoS: 0, Options: 0x00)
Client sub_1 received SUBACK
Subscribed (mid: 1): 0
Client sub_1 received PUBLISH (d0, q0, r0, m0, 'command', ... (33 bytes))
this is a command from the cloud!
```

## Publish telemetry to the cloud via the bridge

1. Start a mosquitto client to subscribe to Event Grid on the factory telemetry topic space.

    ```bash
    mosquitto_sub -q 1 -t "factory/telemetry/#" -d -V mqttv5 \
    -h example.westeurope-1.ts.eventgrid.azure.net \
    -i mosquitto_sub \
    --cert mosquitto.pem \
    --key mosquitto.key \
    --cafile digicert.pem
    ```

1. Start a two mosquitto clients to publish telemetry to Azure IoT MQ repeatedly.

    ```bash
    mosquitto_pub -q 1 -t "factory/telemetry/temperature" -d -V mqttv5 \
    -m "this is a temperature measurement!" -h 20.252.32.176 \
    --repeat 5 --repeat-delay 1
    ```

    ```bash
    mosquitto_pub -q 1 -t "factory/telemetry/humidity" -d -V mqttv5 \
    -m "this is a humidity measurement!" -h 20.252.32.176 \
    --repeat 5 --repeat-delay 1
    ```

In the first window, you see telemetry is published to mosquitto > Azure IoT MQ > MQTT bridge > Event Grid > mosquitto on both the temperature and humidity telemetry topics.

```console
$ mosquitto_sub -q 1 -t "factory/telemetry/#" -d -V mqttv5 -h example.westeurope-1.ts.eventgrid.azure.net -i mosquitto_sub --cert mosquitto.pem --key mosquitto.key --cafile digicert.pem
Client mosquitto_sub sending CONNECT
Client mosquitto_sub received CONNACK (0)
Client mosquitto_sub sending SUBSCRIBE (Mid: 1, Topic: factory/telemetry/#, QoS: 1, Options: 0x00)
Client mosquitto_sub received SUBACK
Subscribed (mid: 1): 1
Client mosquitto_sub sending PINGREQ
Client mosquitto_sub received PINGRESP
Client mosquitto_sub received PUBLISH (d0, q1, r0, m1, 'factory/telemetry/temperature', ... (34 bytes))
Client mosquitto_sub sending PUBACK (m1, rc0)
this is a temperature measurement!
Client mosquitto_sub received PUBLISH (d0, q1, r0, m2, 'factory/telemetry/temperature', ... (34 bytes))
Client mosquitto_sub sending PUBACK (m2, rc0)
this is a temperature measurement!
Client mosquitto_sub received PUBLISH (d0, q1, r0, m3, 'factory/telemetry/temperature', ... (34 bytes))
Client mosquitto_sub sending PUBACK (m3, rc0)
this is a temperature measurement!
Client mosquitto_sub received PUBLISH (d0, q1, r0, m4, 'factory/telemetry/temperature', ... (34 bytes))
Client mosquitto_sub sending PUBACK (m4, rc0)
this is a temperature measurement!
Client mosquitto_sub received PUBLISH (d0, q1, r0, m5, 'factory/telemetry/temperature', ... (34 bytes))
Client mosquitto_sub sending PUBACK (m5, rc0)
this is a temperature measurement!
Client mosquitto_sub received PUBLISH (d0, q1, r0, m6, 'factory/telemetry/humidity', ... (31 bytes))
Client mosquitto_sub sending PUBACK (m6, rc0)
this is a humidity measurement!
Client mosquitto_sub received PUBLISH (d0, q1, r0, m7, 'factory/telemetry/humidity', ... (31 bytes))
Client mosquitto_sub sending PUBACK (m7, rc0)
this is a humidity measurement!
Client mosquitto_sub received PUBLISH (d0, q1, r0, m8, 'factory/telemetry/humidity', ... (31 bytes))
Client mosquitto_sub sending PUBACK (m8, rc0)
this is a humidity measurement!
Client mosquitto_sub received PUBLISH (d0, q1, r0, m9, 'factory/telemetry/humidity', ... (31 bytes))
Client mosquitto_sub sending PUBACK (m9, rc0)
this is a humidity measurement!
Client mosquitto_sub received PUBLISH (d0, q1, r0, m10, 'factory/telemetry/humidity', ... (31 bytes))
Client mosquitto_sub sending PUBACK (m10, rc0)
this is a humidity measurement!
```

## Use shared subscriptions

1. Start a mosquitto client to subscribe to Event Grid on the factory telemetry topic space.

    ```bash
    mosquitto_sub -q 1 -t "factory/telemetry/alert" -d -V mqttv5 \
    -h example.westeurope-1.ts.eventgrid.azure.net \
    -i mosquitto_sub \
    --cert mosquitto.pem \
    --key mosquitto.key \
    --cafile digicert.pem
    ```

1. Start a two mosquitto clients to publish telemetry to Azure IoT MQ repeatedly without any delay, using shared subscriptions

    ```bash
    mosquitto_pub -q 1 -t "factory/telemetry/anomaly/high-temperature" -d -V mqttv5 \
    -m "this is a temperature alert!" -h 20.252.32.176 \
    --repeat 500
    ```

    ```bash
    mosquitto_pub -q 1 -t "factory/telemetry/anomaly/high-humidity" -d -V mqttv5 \
    -m "this is a humidity alert!" -h 20.252.32.176 \
    --repeat 500
    ```

## Related content

TODO: Add your next step link(s)


