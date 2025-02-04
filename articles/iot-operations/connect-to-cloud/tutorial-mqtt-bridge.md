---
title: "Tutorial: Bi-directional MQTT bridge to Azure Event Grid"
description: Learn how to create a bi-directional MQTT bridge to Azure Event Grid using Azure IoT Operations dataflows.
author: PatAltimore
ms.author: patricka
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: tutorial
ms.date: 01/08/2025

#CustomerIntent: As an operator, I want to understand how to create a bi-directional MQTT bridge to Azure Event Grid so that I can send and receive messages between devices and services.
---

# Tutorial: Bi-directional MQTT bridge to Azure Event Grid

[!INCLUDE [kubernetes-management-preview-note](../includes/kubernetes-management-preview-note.md)]

In this tutorial, you set up a bi-directional MQTT bridge between an Azure IoT Operations MQTT broker and Azure Event Grid. To keep the tutorial simple, use the default settings for the Azure IoT Operations MQTT broker and Azure Event Grid endpoints, and no transformation is applied.

## Prerequisites

- **Azure IoT Operations**. See [Deploy Azure IoT Operations](../deploy-iot-ops/howto-deploy-iot-operations.md).
- **Dataflow profile**. See [Configure dataflow profile](howto-configure-dataflow-profile.md).

## Set environment variables

Sign in with Azure CLI:

```sh
az login
```

Set environment variables for the rest of the setup. Replace values in `<>` with valid values or names of your choice. A new Azure Event Grid namespace and topic space are created in your Azure subscription based on the names you provide:

# [Bash](#tab/bash)

```sh
# For this tutorial, the steps assume the IoT Operations cluster and the Event Grid
# are in the same subscription, resource group, and location.

# Name of the resource group of Azure Event Grid and IoT Operations cluster 
export RESOURCE_GROUP=<RESOURCE_GROUP_NAME>

# Azure region of Azure Event Grid and IoT Operations cluster
export LOCATION=<LOCATION>

# Name of the Azure Event Grid namespace
export EVENT_GRID_NAMESPACE=<EVENT_GRID_NAMESPACE>

# Name of the Arc-enabled IoT Operations cluster 
export CLUSTER_NAME=<CLUSTER_NAME>

# Subscription ID of Azure Event Grid and IoT Operations cluster
export SUBSCRIPTION_ID=<SUBSCRIPTION_ID>
```

# [PowerShell](#tab/powershell)

```powershell
# For this tutorial, the steps assume the IoT Operations cluster and the Event Grid
# are in the same subscription, resource group, and location.

# Name of the resource group of Azure Event Grid and IoT Operations cluster 
$RESOURCE_GROUP = "<RESOURCE_GROUP_NAME>"

# Azure region of Azure Event Grid and IoT Operations cluster
$LOCATION = "<LOCATION>"

# Name of the Azure Event Grid namespace
$EVENT_GRID_NAMESPACE = "<EVENT_GRID_NAMESPACE>"

# Name of the Arc-enabled IoT Operations cluster 
$CLUSTER_NAME = "<CLUSTER_NAME>"

# Subscription ID of Azure Event Grid and IoT Operations cluster
$SUBSCRIPTION_ID = "<SUBSCRIPTION_ID>"
```

---

## Create Event Grid namespace with MQTT broker enabled

[Create Event Grid namespace](../../event-grid/create-view-manage-namespaces.md) with Azure CLI. The location should be the same as the one you used to deploy Azure IoT Operations.

# [Bash](#tab/bash)

```sh
az eventgrid namespace create \
  --namespace-name $EVENT_GRID_NAMESPACE \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --topic-spaces-configuration "{state:Enabled,maximumClientSessionsPerAuthenticationName:3}"
```

# [PowerShell](#tab/powershell)

```powershell
az eventgrid namespace create `
  --namespace-name $EVENT_GRID_NAMESPACE `
  --resource-group $RESOURCE_GROUP `
  --location $LOCATION `
  --topic-spaces-configuration "{state:Enabled,maximumClientSessionsPerAuthenticationName:3}"
```

---

If the `eventgrid` extension isn't installed, you get a prompt asking if you want to install it. Select `Y` to install the extension.

By setting the `topic-spaces-configuration`, this command creates a namespace with:

* MQTT broker **enabled**
* Maximum client sessions per authentication name as **3**.

The max client sessions option allows Azure IoT Operations MQTT to spawn multiple instances and still connect. To learn more, see [multi-session support](../../event-grid/mqtt-establishing-multiple-sessions-per-client.md).

## Create a topic space

In the Event Grid namespace, create a topic space named `tutorial` with a topic template `telemetry/#`.

# [Bash](#tab/bash)

```sh
az eventgrid namespace topic-space create \
  --resource-group $RESOURCE_GROUP \
  --namespace-name $EVENT_GRID_NAMESPACE \
  --name tutorial \
  --topic-templates "telemetry/#"
```

# [PowerShell](#tab/powershell)

```powershell
az eventgrid namespace topic-space create `
  --resource-group $RESOURCE_GROUP `
  --namespace-name $EVENT_GRID_NAMESPACE `
  --name tutorial `
  --topic-templates "telemetry/#"
```

---

By using the `#` wildcard in the topic template, you can publish to any topic under the `telemetry` topic space. For example, `telemetry/temperature` or `telemetry/humidity`.

## Give Azure IoT Operations access to the Event Grid topic space

Using Azure CLI, find the principal ID for the Azure IoT Operations Arc extension. The command stores the principal ID in a variable for later use.

# [Bash](#tab/bash)

```sh
export PRINCIPAL_ID=$(az k8s-extension list \
  --resource-group $RESOURCE_GROUP \
  --cluster-name $CLUSTER_NAME \
  --cluster-type connectedClusters \
  --query "[?extensionType=='microsoft.iotoperations'].identity.principalId | [0]" -o tsv)
echo $PRINCIPAL_ID
```

# [PowerShell](#tab/powershell)

```powershell
$PRINCIPAL_ID = (az k8s-extension list `
  --resource-group $RESOURCE_GROUP `
  --cluster-name $CLUSTER_NAME `
  --cluster-type connectedClusters `
  --query "[?extensionType=='microsoft.iotoperations'].identity.principalId | [0]" -o tsv)
Write-Output $PRINCIPAL_ID
```

---

Take note of the output value for `identity.principalId`, which is a GUID value with the following format:

```Output
aaaaaaaa-bbbb-cccc-1111-222222222222
```

Then, use Azure CLI to assign publisher and subscriber roles to Azure IoT Operations MQTT for the topic space you created.

Assign the publisher role:

# [Bash](#tab/bash)

```sh
az role assignment create \
  --assignee $PRINCIPAL_ID \
  --role "EventGrid TopicSpaces Publisher" \
  --scope /subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.EventGrid/namespaces/$EVENT_GRID_NAMESPACE/topicSpaces/tutorial
```

# [PowerShell](#tab/powershell)

```powershell
az role assignment create `
  --assignee $PRINCIPAL_ID `
  --role "EventGrid TopicSpaces Publisher" `
  --scope /subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.EventGrid/namespaces/$EVENT_GRID_NAMESPACE/topicSpaces/tutorial
```

---

Assign the subscriber role:

# [Bash](#tab/bash)

```sh
az role assignment create \
  --assignee $PRINCIPAL_ID \
  --role "EventGrid TopicSpaces Subscriber" \
  --scope /subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.EventGrid/namespaces/$EVENT_GRID_NAMESPACE/topicSpaces/tutorial
```

# [PowerShell](#tab/powershell)

```powershell
az role assignment create `
  --assignee $PRINCIPAL_ID `
  --role "EventGrid TopicSpaces Subscriber" `
  --scope /subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.EventGrid/namespaces/$EVENT_GRID_NAMESPACE/topicSpaces/tutorial
```

---

> [!TIP]
> The scope matches the `id` of the topic space you created with `az eventgrid namespace topic-space create` in the previous step, and you can find it in the output of the command.

## Event Grid MQTT broker hostname

Use Azure CLI to get the Event Grid MQTT broker hostname.

# [Bash](#tab/bash)

```sh
az eventgrid namespace show \
  --resource-group $RESOURCE_GROUP \
  --namespace-name $EVENT_GRID_NAMESPACE \
  --query topicSpacesConfiguration.hostname \
  -o tsv
```

# [PowerShell](#tab/powershell)

```powershell
az eventgrid namespace show `
  --resource-group $RESOURCE_GROUP `
  --namespace-name $EVENT_GRID_NAMESPACE `
  --query topicSpacesConfiguration.hostname `
  -o tsv
```

---

Take note of the output value for `topicSpacesConfiguration.hostname` that is a hostname value that looks like:

```output
example.region-1.ts.eventgrid.azure.net
```

## Create an Azure Event Grid dataflow endpoint

Create dataflow endpoint for the Azure Event Grid. This endpoint is the destination for the dataflow that sends messages to Azure Event Grid. Replace `<EVENT_GRID_HOSTNAME>` with the MQTT hostname you got from the previous step. Include the port number `8883`.

# [Bicep](#tab/bicep)

The dataflow and dataflow endpoints Azure Event Grid can be deployed as standard Azure resources since they have Azure Resource Provider (RPs) implementations. This Bicep template file from [Bicep File for MQTT-bridge dataflow Tutorial](https://github.com/Azure-Samples/explore-iot-operations/blob/main/samples/quickstarts/dataflow.bicep) deploys the necessary dataflow and dataflow endpoints.

Download the file to your local, and make sure to replace the values for `customLocationName`, `aioInstanceName`, `eventGridHostName` with yours. 

```bicep
param customLocationName string = '<CUSTOM_LOCATION_NAME>'
param aioInstanceName string = '<AIO_INSTANCE_NAME>'
param eventGridHostName string = '<EVENT_GRID_HOSTNAME>:8883'

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}

resource aioInstance 'Microsoft.IoTOperations/instances@2024-11-01' existing = {
  name: aioInstanceName
}
resource remoteMqttBrokerDataflowEndpoint 'Microsoft.IoTOperations/instances/dataflowEndpoints@2024-11-01' = {
  parent: aioInstance
  name: 'eventgrid'
  extendedLocation: {
    name: customLocation.id
    type: 'CustomLocation'
  }
  properties: {
    endpointType: 'Mqtt'
    mqttSettings: {
      host: eventGridHostName
      authentication: {
        method: 'SystemAssignedManagedIdentity'
        systemAssignedManagedIdentitySettings: {}
      }
      tls: {
        mode: 'Enabled'
      }
    }
  }
}
```

Next, execute the following command in your terminal. Replace `<FILE>` with the name of the Bicep file you downloaded.

```sh
az deployment group create --resource-group <RESOURCE_GROUP> --template-file <FILE>.bicep
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: DataflowEndpoint
metadata:
  name: eventgrid
  namespace: azure-iot-operations
spec:
  endpointType: Mqtt
  mqttSettings:
    host: <EVENT_GRID_HOSTNAME>:8883
    authentication:
      method: SystemAssignedManagedIdentity
      systemAssignedManagedIdentitySettings: {}
    tls:
      mode: Enabled
```

---

Here, the authentication method is set to `SystemAssignedManagedIdentity` to use the managed identity of the Azure IoT Operations extension to authenticate with the Event Grid MQTT broker. This setting works because the Azure IoT Operations extension has the necessary permissions to publish and subscribe to the Event Grid topic space configured through Azure RBAC roles. Notice that no secrets, like username or password, are needed in the configuration.

Since the Event Grid MQTT broker requires TLS, the `tls` setting is enabled. No need to provide a trusted CA certificate, as the Event Grid MQTT broker uses a widely trusted certificate authority.

## Create dataflows

Create two dataflows with the Azure IoT Operations MQTT broker endpoint as the source and the Azure Event Grid endpoint as the destination, and vice versa. No need to configure transformation.

# [Bicep](#tab/bicep)

```bicep
param customLocationName string = '<CUSTOM_LOCATION_NAME>'
param aioInstanceName string = '<AIO_INSTANCE_NAME>'

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}
resource aioInstance 'Microsoft.IoTOperations/instances@2024-11-01' existing = {
  name: aioInstanceName
}
resource defaultDataflowProfile 'Microsoft.IoTOperations/instances/dataflowProfiles@2024-11-01' existing = {
  parent: aioInstance
  name: 'default'
}
resource dataflow_1 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflows@2024-11-01' = {
  parent: defaultDataflowProfile
  name: 'local-to-remote'
  extendedLocation: {
    name: customLocation.id
    type: 'CustomLocation'
  }
  properties: {
    mode: 'Enabled'
    operations: [
      {
        operationType: 'Source'
        sourceSettings: {
          endpointRef: 'default'
          serializationFormat: 'Json'
          dataSources: array('tutorial/local')
        }
      }
      {
        operationType: 'BuiltInTransformation'

        builtInTransformationSettings: {
        serializationFormat: 'Json'
        datasets: []
        filter: []
        map: [
          {
            type: 'PassThrough'
            inputs: [
              '*'
            ]
            output: '*'
          }
        ]
        }
      }
      {
        operationType: 'Destination'
        destinationSettings: {
          endpointRef: 'eventgrid'
          dataDestination: 'telemetry/aio'
        }
      }
    ]
  }
} 
resource dataflow_2 'Microsoft.IoTOperations/instances/dataflowProfiles/dataflows@2024-11-01' = {
  parent: defaultDataflowProfile
  name: 'remote-to-local'
  extendedLocation: {
    name: customLocation.id
    type: 'CustomLocation'
  }
  properties: {
    mode: 'Enabled'
    operations: [
      {
        operationType: 'Source'
        sourceSettings: {
          endpointRef: 'eventgrid'
          serializationFormat: 'Json'
          dataSources: array('telemetry/#')
        }
      }
      {
        operationType: 'BuiltInTransformation'

        builtInTransformationSettings: {
        serializationFormat: 'Json'
        datasets: []
        filter: []
        map: [
          {
            type: 'PassThrough'
            inputs: [
              '*'
            ]
            output: '*'
          }
        ]
        }
      }
      {
        operationType: 'Destination'
        destinationSettings: {
          endpointRef: 'default'
          dataDestination: 'tutorial/cloud'
        }
      }
    ]
  }
}
```

Like the dataflow endpoint, execute the following command in your terminal:

```sh
az deployment group create --resource-group <RESOURCE_GROUP> --template-file <FILE>.bicep
```

# [Kubernetes (preview)](#tab/kubernetes)


```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: Dataflow
metadata:
  name: local-to-remote
  namespace: azure-iot-operations
spec:
  profileRef: default
  operations:
  - operationType: Source
    sourceSettings:
      endpointRef: default
      dataSources:
        - tutorial/local
  - operationType: Destination
    destinationSettings:
      endpointRef: eventgrid
      dataDestination: telemetry/aio
---
apiVersion: connectivity.iotoperations.azure.com/v1
kind: Dataflow
metadata:
  name: remote-to-local
  namespace: azure-iot-operations
spec:
  profileRef: default
  operations:
  - operationType: Source
    sourceSettings:
      endpointRef: eventgrid
      dataSources:
        - telemetry/#
  - operationType: Destination
    destinationSettings:
      endpointRef: default
      dataDestination: tutorial/cloud
```

---

Together, the two dataflows form an MQTT bridge, where you:

* Use the Event Grid MQTT broker as the remote broker
* Use the local Azure IoT Operations MQTT broker as the local broker
* Use TLS for both remote and local brokers
* Use system-assigned managed identity for authentication to the remote broker
* Use Kubernetes service account for authentication to the local broker
* Use the topic map to map the `tutorial/local` topic to the `telemetry/aio` topic on the remote broker
* Use the topic map to map the `telemetry/#` topic on the remote broker to the `tutorial/cloud` topic on the local broker

> [!NOTE]
> By default, Azure IoT Operations deploys an MQTT broker as well as an MQTT broker dataflow endpoint. The MQTT broker dataflow endpoint is used to connect to the MQTT broker. The default configuration uses the built-in service account token for authentication. The endpoint is named `default` and is available in the same namespace as Azure IoT Operations. The endpoint is used as the source for the dataflow created in this tutorial. To learn more about the default MQTT broker dataflow endpoint, see [Azure IoT Operations local MQTT broker default endpoint](../connect-to-cloud/howto-configure-mqtt-endpoint.md#default-endpoint).

When you publish to the `tutorial/local` topic on the local Azure IoT Operations MQTT broker, the message is bridged to the `telemetry/aio` topic on the remote Event Grid MQTT broker. Then, the message is bridged back to the `tutorial/cloud` topic (because the `telemetry/#` wildcard topic captures it) on the local Azure IoT Operations MQTT broker. Similarly, when you publish to the `telemetry/aio` topic on the remote Event Grid MQTT broker, the message is bridged to the `tutorial/cloud` topic on the local Azure IoT Operations MQTT broker.

## Deploy MQTT client

To verify the MQTT bridge is working, deploy an MQTT client to the same namespace as Azure IoT Operations. 

# [Bicep](#tab/bicep)

Currently, Bicep doesn't apply to deploy MQTT client.

# [Kubernetes (preview)](#tab/kubernetes)

Download `mqtt-client.yaml` deployment from the GitHub sample repository.

> [!IMPORTANT]
> Don't use the MQTT client in production. The client is for testing purposes only.

```bash
wget https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/quickstarts/mqtt-client.yaml -O mqtt-client.yaml
```
Apply the deployment file with kubectl.

```bash
kubectl apply -f mqtt-client.yaml
```

```output
pod/mqtt-client created
```

---

## Start a subscriber

Use `kubectl exec` to start a shell in the mosquitto client pod.

```sh
kubectl exec --stdin --tty mqtt-client -n azure-iot-operations -- sh
```

Inside the shell, start a subscriber to the Azure IoT Operations broker on the `tutorial/#` topic space with `mosquitto_sub`.

```sh
mosquitto_sub --host aio-broker --port 18883 \
  -t "tutorial/#" \
  --debug --cafile /var/run/certs/ca.crt \
  -D CONNECT authentication-method 'K8S-SAT' \
  -D CONNECT authentication-data $(cat /var/run/secrets/tokens/broker-sat)
```

Leave the command running and open a new terminal window.

## Publish MQTT messages to the cloud via the bridge

In a new terminal window, start another shell in the mosquitto client pod.

```sh
kubectl exec --stdin --tty mqtt-client -n azure-iot-operations -- sh
```

Inside the shell, use mosquitto to publish five messages to the `tutorial/local` topic.

```sh
mosquitto_pub -h aio-broker -p 18883 \
  -m "This message goes all the way to the cloud and back!" \
  -t "tutorial/local" \
  --repeat 5 --repeat-delay 1 -d \
  --debug --cafile /var/run/certs/ca.crt \
  -D CONNECT authentication-method 'K8S-SAT' \
  -D CONNECT authentication-data $(cat /var/run/secrets/tokens/broker-sat)
```

## View the messages in the subscriber

In the subscriber shell, you see the messages you published.

```Output
Client null sending CONNECT
Client $server-generated/0000aaaa-11bb-cccc-dd22-eeeeee333333 received CONNACK (0)
Client $server-generated/0000aaaa-11bb-cccc-dd22-eeeeee333333 sending SUBSCRIBE (Mid: 1, Topic: tutorial/#, QoS: 0, Options: 0x00)
Client $server-generated/0000aaaa-11bb-cccc-dd22-eeeeee333333 received SUBACK
Subscribed (mid: 1): 0
Client $server-generated/0000aaaa-11bb-cccc-dd22-eeeeee333333 sending PINGREQ
Client $server-generated/0000aaaa-11bb-cccc-dd22-eeeeee333333 received PINGRESP
Client $server-generated/0000aaaa-11bb-cccc-dd22-eeeeee333333 received PUBLISH (d0, q0, r0, m0, 'tutorial/local', ... (52 bytes))
This message goes all the way to the cloud and back!
Client $server-generated/0000aaaa-11bb-cccc-dd22-eeeeee333333 received PUBLISH (d0, q0, r0, m0, 'tutorial/local', ... (52 bytes))
This message goes all the way to the cloud and back!
Client $server-generated/0000aaaa-11bb-cccc-dd22-eeeeee333333 received PUBLISH (d0, q0, r0, m0, 'tutorial/local', ... (52 bytes))
This message goes all the way to the cloud and back!
Client $server-generated/0000aaaa-11bb-cccc-dd22-eeeeee333333 received PUBLISH (d0, q0, r0, m0, 'tutorial/local', ... (52 bytes))
This message goes all the way to the cloud and back!
Client $server-generated/0000aaaa-11bb-cccc-dd22-eeeeee333333 received PUBLISH (d0, q0, r0, m0, 'tutorial/local', ... (52 bytes))
This message goes all the way to the cloud and back!
Client $server-generated/0000aaaa-11bb-cccc-dd22-eeeeee333333 sending PINGREQ
Client $server-generated/0000aaaa-11bb-cccc-dd22-eeeeee333333 received PINGRESP
```

Here, you see the messages are published to the local Azure IoT Operations broker to the `tutorial/local` topic, bridged to Event Grid MQTT broker, and then bridged back to the local Azure IoT Operations broker again on the `tutorial/cloud` topic. The messages are then delivered to the subscriber. In this example, the round trip time is about 80 ms.

## Check Event Grid metrics to verify message delivery

You can also check the Event Grid metrics to verify the messages are delivered to the Event Grid MQTT broker. In the Azure portal, go to the Event Grid namespace you created. Under **Metrics** > **MQTT: Successful Published Messages**. You should see the number of messages published and delivered increase as you publish messages to the local Azure IoT Operations broker.

:::image type="content" source="media/tutorial-connect-event-grid/event-grid-metrics.png" alt-text="Screenshot of the metrics view in Azure portal to show successful MQTT messages.":::

> [!TIP]
> You can check the configurations of dataflows, QoS, and message routes with the [CLI extension](/cli/azure/iot/ops#az-iot-ops-check-examples) `az iot ops check --detail-level 2`.

## Next steps

In this tutorial, you learned how to configure Azure IoT Operations for bi-directional MQTT bridge with Azure Event Grid MQTT broker. As next steps, explore the following scenarios:

* To use an MQTT client to publish messages directly to the Event Grid MQTT broker, see [Publish MQTT messages to Event Grid MQTT broker](../../event-grid/mqtt-publish-and-subscribe-cli.md). Give the client a [publisher permission binding](../../event-grid/mqtt-access-control.md) to the topic space you created, and you can publish messages to any topic under the `telemetry`, like `telemetry/temperature` or `telemetry/humidity`. All of these messages are bridged to the `tutorial/cloud` topic on the local Azure IoT Operations broker.
* To set up routing rules for the Event Grid MQTT broker, see [Configure routing rules for Event Grid MQTT broker](../../event-grid/mqtt-routing.md). You can use routing rules to route messages to different topics based on the topic name, or to filter messages based on the message content.

## Related content

* About [BrokerListener resource](../manage-mqtt-broker/howto-configure-brokerlistener.md)
* [Configure authorization for a BrokerListener](../manage-mqtt-broker/howto-configure-authorization.md)
* [Configure authentication for a BrokerListener](../manage-mqtt-broker/howto-configure-authentication.md)
* [Configure TLS with automatic certificate management](../manage-mqtt-broker/howto-configure-tls-auto.md)
