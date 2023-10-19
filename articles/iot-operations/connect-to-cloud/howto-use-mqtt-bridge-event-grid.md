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

You can use the Azure IoT MQ MQTT bridge to connect to Azure Event Grid. This article demonstrates how to configure Azure IoT MQ for bi-directional communication with Azure Event Grid.

With self-managed (i.e. not Arc/AKS/similar) clusters, the recommended way to bridge to Event Grid MQTT broker is through X.509 certificates.

## Prerequisites

- [An Event Grid Namespace with MQTT turned on](https://learn.microsoft.com/azure/event-grid/create-view-manage-namespaces)
- [Mosquitto client](https://mosquitto.org/download/)
- [Step CLI](https://smallstep.com/docs/step-cli/installation/index.html)
- [Azure IoT MQ CRDs and operator installed](/docs/mqtt-broker/deploy/)
- Azure IoT MQ broker deployment with
  - Either no authentication or SAT authentication turned on
  - Authorization should allow the MQTT bridge connector to connect, publish, and subscribe
  - The [default instructions](/docs/mqtt-broker/deploy/#deploy-mqtt-broker-custom-resources) meet these requirements
  - This tutorial uses a deployment on AKS

## Prepare certificates

Event Grid requires X.509 authentication. For this, we use [`step` CLI](https://smallstep.com/docs/step-cli/installation/index.html) (much easier than openssl) to generate new certificates to illustrate the process. This section starts by initiate a new root certificate authority (CA) and an intermediate CA chained to it (learn more about certificate chaining). The intermediate CA is used to sign some client certificates for Azure IoT MQ and mosquitto client to use. The intermediate CA is uploaded to Event Grid in the next step as the common root of trust. So when Azure IoT MQ connects to Event Grid, it can recognize that the client certificate Azure IoT MQ presents is signed by a CA that's been allowed.

### Start clean with a CA

To keep things organized, first start with an empty directory as a clean workspace.

```bash
mkdir e4k-workspace
cd e4k-workspace
```

Next, [install Step CLI](../../tools/community-tools/) and initialize a certificate authority.

```bash
step ca init
```

Follow the prompts to finish setup. Use a memorable password (e.g. "e4k") when prompted, as the password is used many times later.

### Download the DigiCert G3 root certificate

This is required to use mosquitto client with Event Grid.

```bash
curl https://cacerts.digicert.com/DigiCertGlobalRootG3.crt.pem -o digicert.pem
```

### Generate client certificates

Use the intermediate CA to sign a client certificates for Azure IoT MQ MQTT bridge `mqttbridge` to use.

```bash
step certificate create mqttbridge mqttbridge.pem mqttbridge.key \
--ca ~/.step/certs/intermediate_ca.crt \
--ca-key ~/.step/secrets/intermediate_ca_key \
--no-password \
--insecure \
--not-after 2400h 
```

Also create a client certificate for a separate `mosquitto` client to talk Event Grid directly.

```bash
step certificate create mosquitto mosquitto.pem mosquitto.key \
--ca ~/.step/certs/intermediate_ca.crt \
--ca-key ~/.step/secrets/intermediate_ca_key \
--no-password \
--insecure \
--not-after 2400h 
```

> By using the `-no-password` and `--insecure` flags, the private key is written to disk without encryption. This makes managing the key easier for the sake of the tutorial, but isn't recommended for production.

Lastly, copy the root and intermediate CA certs (not the keys) into the current directory and rename the file extension to PEM. They're needed for later.

```bash
cp ~/.step/certs/root_ca.crt root.pem
cp ~/.step/certs/intermediate_ca.crt intermediate.pem
```

The certificates are ready in your working directory.

## Setup Event Grid

If you haven't done so already, [create an Event Grid Namespace](https://learn.microsoft.com/azure/event-grid/create-view-manage-namespaces) first.

### Configure MQTT and authentication option

When the resource is created, go to **Configuration** and check both

- **Enable MQTT** and
- **Enable alternative client authentication name sources**
  - Select **Certificate Subject Name** the dropdown.
- Set **Maximum client sessions per authentication name** to **3**

The alternative client authentication and max client sessions options allows Azure IoT MQ to use its client certificate subject name for authentication (instead of MQTT CONNECT Username). This is important so that Azure IoT MQ can spawn multiple instances and still be able to connect. To learn more, see [multi-session support](https://learn.microsoft.com/azure/event-grid/mqtt-establishing-multiple-sessions-per-client).

![MQTT configuration in Event Grid](config.png)

Click **Apply** and wait a few minutes for the configuration update to finish.

### Upload CA certificate

To get X.509 authentication and TLS to work, all participants should trust the same root CA, including Event Grid.

In the Event Grid namespace, go to **CA certificates** > **+ Certificate** > **Browse** and select `root.pem` from the working directory earlier. Provide a memorable certificate name, and select **Upload**.

![](upload-ca.png)

Similarly, upload the `intermediate.pem` as well.

![](upload-intermediate.png)

### Register Azure IoT MQ and mosquitto clients

This sets up Event Grid with the right configuration for your clients authentication.

Go to **Clients** and add a client named `mqttbridge`. Choose **Subject Matches Authentication Name** as the authentication validation scheme.

![](client.png)

Similarly, add a client for `mosquitto`. The only difference being to add a client attribute `commander` as `true`.

![](mosquitto-client.png)

### Authorization

Now that authentication is done, configure authorization with client groups, topic spaces, and permission bindings. Now The way Event Grid works is that clients must be explicitly authorized for all MQTT topics. The concepts are unique to Event Grid, but essentially boil down to a attribute-based access control model. This section sets up a simplified model where

- Azure IoT MQ's MQTT bridge can publish telemetry and receive commands
- Mosquitto client (pretending to be a commander) can publish commands

#### Create telemetry and command topic spaces

Go to **Topic spaces** and create a "telemetry" topic space with template `factory/telemetry/#`. Choose **Low fanout** for subscription support.

![](telemetry-topic-space.png)

Similarly, create a "command" topic space with template `command/#`, alow low fanout.

![](command-topic-space.png)

#### Allow all clients, including Azure IoT MQ, to publish telemetry and subscribe to commands

Create a **permission binding** to allow *all* clients to publish to the telemetry topic space.

![](can-publish-permission.png)

Similarly, create another permission binding allowing clients to subscribe to the command topic space.

![](can-sub-to-command.png)

#### Allow mosquitto to publish commands and subscribe to telemetry

To isolate mosquitto's special status as a commander, create a commanders **client group** based on the attribute set earlier with the query `attributes.commander = "true"`.

![](client-group.png)

Finally, create **two permission bindings**, one to allow the commanders group to publish to the command topic space:

![](commanders-can-command.png)

And the other to allow subscribing to the telemetry topic space:

![](commanders-can-sub-tel.png)

### Note down the Event Grid MQTT hostname

Before moving on, go to the Event Grid namespace **Overview**, find the MQTT hostname and note it down (click the copy button). You need it for the next step.

![](mqtt-hostname.png)

## Configure Azure IoT MQ MQTT bridge

Ensure that Azure IoT MQ CRDs and operator are installed, and Azure IoT MQ is up and running as specified in the prerequisites section.

### Import generated certificate as Kubernetes secret

Create a secret with kubectl using `mqttbridge.pem` and the corresponding private key.

```bash
kubectl create secret generic remote-client-secret \
--from-file=client_cert.pem=mqttbridge.pem \
--from-file=client_key.pem=mqttbridge.key \
--from-file=client_intermediate_certs.pem=intermediate.pem
```

### Create a MQTT bridge connector and topic map resources

In a new file `bridge.yaml`, specify the MQTT bridge connector and topic map configuration. Replace the `endpoint` value with the Event Grid MQTT hostname from previous step. Also, specify the namespace to match the one that has Broker deployed. For example, `namespace: {{% namespace %}}`.

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

Apply the deployment file with kubectl.

```console
$ kubectl apply -f bridge.yaml
mqttbridgeconnector.az-edge.com/my-mqtt-bridge created
mqttbridgetopicmap.az-edge.com/my-topic-map created
```

### Verify MQTT bridge deployment

Use kubectl to check the three bridge instances are ready and running.

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

Start a subscriber to Azure IoT MQ on the `command` topic.

```console
$ mosquitto_sub -t "command" -i sub_1 -d -V mqttv5 -h 20.252.32.176
Client sub_1 sending CONNECT
Client sub_1 received CONNACK (0)
Client sub_1 sending SUBSCRIBE (Mid: 1, Topic: command, QoS: 0, Options: 0x00)
Client sub_1 received SUBACK
Subscribed (mid: 1): 0

```

In a new terminal window, use mosquitto to publish a command to Event Grid MQTT broker.

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

Back to the first window, you see the command is relayed from mosquitto > Event Grid > MQTT bridge > mosquitto again.

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

Start a mosquitto client to subscribe to Event Grid on the factory telemetry topic space

```bash
mosquitto_sub -q 1 -t "factory/telemetry/#" -d -V mqttv5 \
-h example.westeurope-1.ts.eventgrid.azure.net \
-i mosquitto_sub \
--cert mosquitto.pem \
--key mosquitto.key \
--cafile digicert.pem
```

Start a two mosquitto clients to publish telemetry to Azure IoT MQ repeatedly.

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

Back to the first window, you see telemetry is published to mosquitto > Azure IoT MQ > MQTT bridge > Event Grid > mosquitto on both the temperature and humidity telemetry topics.

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

Start a mosquitto client to subscribe to Event Grid on the factory telemetry topic space

```bash
mosquitto_sub -q 1 -t "factory/telemetry/alert" -d -V mqttv5 \
-h example.westeurope-1.ts.eventgrid.azure.net \
-i mosquitto_sub \
--cert mosquitto.pem \
--key mosquitto.key \
--cafile digicert.pem
```

Start a two mosquitto clients to publish telemetry to Azure IoT MQ repeatedly without any delay, using shared subscriptions

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


<!--
Remove all the comments in this template before you sign-off or merge to the main branch.
-->
