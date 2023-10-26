---
title: Use Node-RED to develop low-code applications
# titleSuffix: Azure IoT MQ
description: Develop low-code applications that talk with Azure IoT MQ using Node-RED.
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.date: 10/02/2023

#CustomerIntent: As an developer, I want to understand how to use Node-RED to develop low-code apps that talk with Azure IoT MQ.
---

# Use Node-RED to develop low-code applications

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

[Node-RED](https://nodered.org/) enables low-code programming for event-driven applications. It's
 a programming tool for wiring together hardware devices, APIs and online services in new and interesting ways. It provides a browser-based editor that makes it easy to wire together flows using the wide range of nodes in the palette that can be deployed to its runtime in a single-click.

Before you begin, [verify E4K is installed and running](/docs/mqtt-broker/deploy/).

## Connect Node-RED

This article demonstrates how to deploy a Node-RED environment on Kubernetes and integrate it with E4K. It uses the [node-red-K8s](https://github.com/kube-red/node-red-k8s) open-source project that includes a set of Node-RED nodes to interact with Kubernetes.

```yaml {hl_lines=[8]}
apiVersion: v1
kind: Pod
metadata:
  name: node-red
spec:
  containers:
    - name: node-red
      image: ghcr.io/kube-red/node-red-k8s:0.0.1
      imagePullPolicy: Always
      ports:
      - containerPort: 1880
        name: http-web-svc
  restartPolicy: Always
```

Next, deploy Node-RED to the Kubernetes cluster by running the following command:

```bash
kubectl apply -f pod.yaml
```

When you run `kubectl get pods`, you should see the Node-RED pod running alongside the E4K Pods as well.

```console {hl_lines=[4]}
NAME                                    READY   STATUS    RESTARTS       AGE
azedge-dmqtt-backend-0                  1/1     Running   13 (15m ago)   9d
azedge-diagnostics-574b6b8896-22qd2     1/1     Running   13 (15m ago)   9d
node-red                                1/1     Running   8 (15m ago)    8d
azedge-dmqtt-health-manager-0           1/1     Running   13 (15m ago)   9d
azedge-dmqtt-backend-1                  1/1     Running   13 (15m ago)   9d
azedge-dmqtt-authentication-0           1/1     Running   13 (15m ago)   9d
azedge-spiffe-server-5499775dff-gjtp8   2/2     Running   26 (15m ago)   9d
azedge-spiffe-agent-bbxds               1/1     Running   13 (15m ago)   9d
azedge-dmqtt-frontend-1                 1/1     Running   13 (15m ago)   9d
azedge-dmqtt-frontend-0                 1/1     Running   13 (15m ago)   9d
```

Next, port-forward the Node-RED pod to access the Node-RED client in the browser.

```bash
kubectl port-forward node-red 1880
```

To confirm the Node-RED application is running, you can run `kubectl logs node-red`.

```console

Welcome to Node-RED
===================

28 Jan 01:34:12 - [info] Node-RED version: v3.0.2
28 Jan 01:34:12 - [info] Node.js  version: v19.3.0
28 Jan 01:34:12 - [info] Linux 5.4.0-1100-azure x64 LE
28 Jan 01:34:13 - [info] Loading palette nodes
28 Jan 01:34:17 - [info] Settings file  : /data/settings.js
28 Jan 01:34:17 - [info] Context store  : 'default' [module=memory]
28 Jan 01:34:17 - [info] User directory : /data
28 Jan 01:34:17 - [warn] Projects disabled : editorTheme.projects.enabled=false
28 Jan 01:34:17 - [info] Flows file     : /data/flows.json
28 Jan 01:34:17 - [info] Creating new flow file

```

Open `http://{host-ip}:1880` to see the Node-RED web UI.

## Sample scenario

To see how we can use a low-code solution like Node-RED with E4K, we're going to create a simple flow in this exercise.

* The flow triggers every 5 seconds and retrieves a data from a public REST API providing earthquake data.
* An MQTTui client subscribes to two topics, `degrees` and `earthquake`, to which Node-RED is publishing the parsed data.
* The switch node in Node-RED unpacks the data, and publishes data with magnitude value greater than or equal to 7, to the `earthquake` topic.

### See it in action

1. **Add an Inject node** - The Inject node is configured to trigger the flow at a regular interval. Drag an Inject node onto the workspace from the palette. Double click the node to bring up the edit dialog. Set the repeat interval to every 5 seconds. Select Done to close the dialog.

2. **Add an HTTP Request node** - The HTTP Request node can be used to retrieve a web-page when triggered. The URL is a feed of significant earthquakes in the last month from the US Geological Survey web site. After adding one to the workspace, edit it to set the URL property to: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.csv`. Then select Done to close the dialog.

3. **Add a CSV node** - The CSV node converts the JSON-formatted response from the HTTP Request node to a CSV formatted string. Add a CSV node and edit its properties. Enable option for ‘First row contains column names’. Then select Done to close.

4. **Add an MQTT out node** to the output. The MQTT out node connects to an MQTT broker and publishes messages. The MQTT out node should have the following properties:

    * **Server**: azedge-dmqtt-frontend
    * **Port**: 1883
    * **Topic**: degrees
    * **Username**: client1
    * **Password**: password
    * **Name**: E4K Broker
    * **QoS**: 1

  {{< detail-tag "See E4K Broker Settings" >}}

  ![](e4k_broker.png)

  <br />

  ![](authentication.png)

  <br />

  ![](configure_e4k.png)

  <br />

  {{< /detail-tag >}}

  <br/>

6. **Add another MQTT out node** -  Use the same parameters as the first, but change the topic from `degrees` to `earthquake`.

7. **Add a Switch node** - The switch node routes messages based on their property values or sequence position. Edit its properties and configure it to check the property `msg.payload.mag`. Add a value rule for `>=`, set the value to `type number`, and value `7`. Select Done to close. Add a second wire from the `CSV node` to the `Switch node`.

8. **Add a Change node** - The change node can `Set`, `change`, `delete` or `move` properties of a message. Add a `Change` node, wired to the output of the `Switch` node. Configure it to set `msg.payload` to a `string` and enter string name as  `PANIC!`.

9. Connect the nodes together as shown in the following diagram, and select the **Deploy** button on the top right corner.

![](flow.png)

## Subscribe

Now subscribe to the `degrees` and `earthquake` topic from another MQTT client.

{{< detail-tag "See detailed commands to execute in the Quick Start Codespace" >}}

Create a new terminal in the Codespace using the + button on the top right, while ensuring the Node-RED client is continuing to publish data.

Monitor the messages received by the subscriber in real-time using a terminal UI tool called mqttui. Use the following command to subscribe to all topics and see messages arriving on the orders topic in real-time:

```bash
mqttui -b mqtt://localhost:1883 -u client2 --password password2
```

{{< /detail-tag >}}

Notice messages are published by the Node-RED flow to the *earthquake* topic when the magnitude value is above the configured threshold:

![](output_1.png)

See the [Node-RED library](https://flows.nodered.org) for more building blocks and examples from the community.


## Related content
