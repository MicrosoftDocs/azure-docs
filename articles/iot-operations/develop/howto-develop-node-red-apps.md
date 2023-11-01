---
title: Use Node-RED to develop low-code applications
# titleSuffix: Azure IoT MQ
description: Develop low-code applications that talk with Azure IoT MQ using Node-RED.
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.date: 10/29/2023

#CustomerIntent: As an developer, I want to understand how to use Node-RED to develop low-code apps that talk with Azure IoT MQ.
---

# Use Node-RED to develop low-code applications

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

[Node-RED](https://nodered.org/) enables low-code programming for event-driven applications. It's a programming tool for wiring together hardware devices, APIs and online services in new and interesting ways. It provides a browser-based editor that connects together flows using the wide range of nodes in the palette that can be deployed to its runtime in a single step.

Before you begin, [verify Azure Iot MQ is installed and running](../deploy/overview-deploy-iot-operations.md).

## Connect Node-RED

This article demonstrates how to deploy a Node-RED environment on Kubernetes and integrate it with IoT MQ. It uses the [node-red-K8s](https://github.com/kube-red/node-red-k8s) open-source project that includes a set of Node-RED nodes to interact with Kubernetes.

```yaml
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

1. Deploy Node-RED to the Kubernetes cluster by running the following command:

    ```bash
    kubectl apply -f pod.yaml
    ```

1. Run `kubectl get pods`. You should see the Node-RED pod running with the IoT MQ pods.

    ```Output
    NAME                                    READY   STATUS    RESTARTS       AGE
    aio-mq-dmqtt-backend-0                  1/1     Running   13 (15m ago)   9d
    azedge-diagnostics-574b6b8896-22qd2     1/1     Running   13 (15m ago)   9d
    node-red                                1/1     Running   8 (15m ago)    8d
    azedge-dmqtt-health-manager-0           1/1     Running   13 (15m ago)   9d
    aio-mq-dmqtt-backend-1                  1/1     Running   13 (15m ago)   9d
    azedge-dmqtt-authentication-0           1/1     Running   13 (15m ago)   9d
    azedge-spiffe-server-5499775dff-gjtp8   2/2     Running   26 (15m ago)   9d
    azedge-spiffe-agent-bbxds               1/1     Running   13 (15m ago)   9d
    aio-mq-dmqtt-frontend-1                 1/1     Running   13 (15m ago)   9d
    aio-mq-dmqtt-frontend-0                 1/1     Running   13 (15m ago)   9d
    ```

1. Port-forward the Node-RED pod to access the Node-RED client in the browser.

    ```bash
    kubectl port-forward node-red 1880
    ```

1. To confirm the Node-RED application is running, run `kubectl logs node-red`.

    ```Output

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

1. Open `http://{host-ip}:1880` to see the Node-RED web UI.

## Sample scenario

To see how we can use a low-code solution like Node-RED with IoT MQ, you can create a simple flow with this scenario.

* The flow triggers every 5 seconds and retrieves a data from a public REST API providing earthquake data.
* An MQTTui client subscribes to two topics, `degrees` and `earthquake` where Node-RED is publishing the parsed data.
* The switch node in Node-RED unpacks the data, and publishes data with magnitude value greater than or equal to seven, to the `earthquake` topic.

1. **Add an Inject node** - The Inject node is configured to trigger the flow at a regular interval. Drag an **Inject** node onto the workspace from the palette. Double click the node to bring up the edit dialog. Set the repeat interval to every 5 seconds. Select **Done** to close the dialog.

1. **Add an HTTP Request node** - The HTTP Request node can be used to retrieve a web-page when triggered. The URL is a feed of significant earthquakes in the last month from the US Geological Survey web site. After adding one to the workspace, edit it to set the URL property to: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.csv`. Then select **Done** to close the dialog.

1. **Add a CSV node** - The CSV node converts the JSON-formatted response from the HTTP Request node to a CSV formatted string. Add a CSV node and edit its properties. Enable option for *First row contains column names*. Then select **Done** to close.

1. **Add an MQTT out node** to the output. The MQTT out node connects to an MQTT broker and publishes messages. The MQTT out node should have the following properties:

    * **Server**: aio-mq-dmqtt-frontend
    * **Port**: 1883
    * **Topic**: degrees
    * **Username**: client1
    * **Password**: password
    * **Name**: IoT MQ Broker
    * **QoS**: 1

1. **Add another MQTT out node** - Use the same parameters as the first, but change the topic from `degrees` to `earthquake`.

1. **Add a Switch node** - The switch node routes messages based on their property values or sequence position. Edit its properties and configure it to select the property `msg.payload.mag`. Add a value rule for `>=`, set the value to `type number`, and value `7`. Select Done to close. Add a second wire from the `CSV node` to the `Switch node`.

1. **Add a Change node** - The change node can `Set`, `change`, `delete` or `move` properties of a message. Add a `Change` node, wired to the output of the `Switch` node. Configure it to set `msg.payload` to a `string` and enter string name as `PANIC!`.

1. Connect the nodes together as shown in the following diagram, and select the **Deploy** button on the top right corner.

## Subscribe

Subscribe to the `degrees` and `earthquake` topic from another MQTT client.

1. Create a new terminal in the Codespace using the + button on the top right, while ensuring the Node-RED client is continuing to publish data.

1. Monitor the messages received by the subscriber in real-time using a terminal UI tool called mqttui. Use the following command to subscribe to all topics and see messages arriving on the orders topic in real-time:

    ```bash
    mqttui -b mqtt://localhost:1883 -u client2 --password password2
    ```

The Node-RED flow publishes notice messages to the *earthquake* topic when the magnitude value is above the configured threshold.

For more building blocks and examples from the community, See the [Node-RED library](https://flows.nodered.org).

## Related content

- [Azure IoT MQ overview](../manage-mqtt-connectivity/overview-iot-mq.md)
- [Develop with Azure IoT MQ](concept-about-distributed-apps.md)