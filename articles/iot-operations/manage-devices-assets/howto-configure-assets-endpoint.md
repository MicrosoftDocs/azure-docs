---
title: Configure an assets endpoint
description: An asset endpoint profile connects OPC UA servers to OPC UA connector modules. Without an asset endpoint profile, data can't flow from an OPC UA server to OPC UA Broker and Azure IoT MQ.
author: dominicbetts
ms.author: dobett
ms.topic: how-to
ms.date: 10/13/2023

#CustomerIntent: As an OT user, I want configure my IoT Operations environment to so that data can flow from my OPC UA servers through to the MQTT broker.
---

# Configure an assets endpoint

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

[!INCLUDE [assets-servers](../includes/assets-servers.md)]

An asset endpoint profile is a custom resource that connects OPC UA servers to OPC UA connector modules. This connection enables an OPC UA connector to access an asset's data points. Without an asset endpoint profile, data can't flow from an OPC UA server to the Azure IoT OPC UA Broker instance and Azure IoT MQ instance. After you configure the custom resources in your cluster, a connection is established to the downstream OPC UA server and the server forwards telemetry to the OPC UA Broker instance.

The [quick setup](#quick-setup) section gets you started by using the built-in OPC-PLC simulator. The remaining sections describe how to configure more complex scenarios, such as custom authentication.

## Prerequisites

To configure an assets endpoint, you need a running instance of Azure IoT Operations – enabled by Azure Arc.

## Quick setup

By default, an Azure IoT Operations deployment includes a built-in OPC PLC simulator. Apply the following manifest to your kubernetes cluster using `kubectl apply -f <your-file-name>.yaml` to create an asset endpoint profile that uses the built-in OPC PLC simulator:

```yaml
apiVersion: e4i.microsoft.com/v1
kind: Application
metadata:
  name: alice-springs-solution
  namespace: alice-springs
spec:
  name: alice-springs-solution
  description: This is a sample application running OPC UA Connector for testing.
  payloadCompression: none
---
apiVersion: e4i.microsoft.com/v1
kind: Module
metadata:
  name: opc-ua-connector-0
  namespace: alice-springs-solution
spec:
  type: opc-ua-connector
  name: opc-ua-connector-0
  description: Connect to opc.tcp://opcplc-000000.alice-springs:50000 and forward data to the configured broker
  settings: |-
    {
      "OpcUaConnectionOptions":
      {
        "DiscoveryUrl": "opc.tcp://opcplc-000000.alice-springs:50000",
        "UseSecurity": true,
        "LoadComplexTypes": true,
        "AuthenticationMode": "Anonymous",
        "SessionTimeout": 600000,
        "DefaultPublishingInterval": 1000,
        "DefaultSamplingInterval": 500,
        "DefaultQueueSize": 15,
        "MaxItemsPerSubscription": 1000,
        "AutoAcceptUntrustedCertificates": true
      },
      "OpcUaConfigurationOptions": {
        "ApplicationName": "az-e4i-opcua-connector-0",
        "ModuleName": "opc-ua-connector-0",
      }
    }
```

This manifest deploys a new module called `opc-ua-connector-0` to the `alice-springs-solution` namespace. To start using the newly created asset endpoint profile, create an asset through the [Digital Operations (preview)](https://digitaloperations.azure.com) portal, specify `opc-ua-connector-0` in the **Endpoint profile** field:

:::image type="content" source="media/howto-configure-assets-endpoint/asset-endpoint-profile.png" alt-text="Screenshot that shows how to use the asset endpoint profile in the Digital Operations portal.":::

By default, assets are created in the `alice-springs-solution` namespace where you created the asset endpoint profile.

When you specify the asset tags in the digital operations experience portal, you can now use any of the simulated node IDs such as `nsu=http://microsoftcom/Opc/OpcPlc/;s=FastUInt1`:

:::image type="content" source="media/howto-configure-assets-endpoint/tag-definition.png" alt-text="Screenshot that shows how to use a node ID when you define a tag in the Digital Operations portal.":::

An OPC UA connector pod discovers the asset after you create it. The pod uses the endpoint profile that you specified in the asset definition to connect to an OPC UA server. If the OPC PLC simulator is running, data flows from the simulator, to the connector, to the OPC UA broker, and finally to the MQTT broker.

## Custom setup

The remaining sections in this article include instructions for more complex asset endpoint profile scenarios, such as custom authentication.

### Configure an endpoint profile using a username and password

The YAML file shown in the previous section uses the `Anonymous` authentication mode. This mode doesn't require a username or password. If you want to use the `UsernamePassword` authentication mode, you must configure the endpoint profile accordingly.

### Create a Kubernetes secret for the OPC UA server connection

The following script shows how to create a secret for the username and password and add it to the Kubernetes store:

```sh
# NAMESPACE is the namespace containing the MQ broker.
export NAMESPACE="alice-springs-solution"

# Set the desired username and password here.
export USERNAME="username"
export PASSWORD="password"

echo "Storing k8s username and password generic secret..."
kubectl create secret generic opc-ua-connector-secrets --from-literal=username=$USERNAME --from-literal=password=$PASSWORD --namespace $NAMESPACE
```

The following example YAML file shows the configuration for an asset endpoint profile that uses the `UsernamePassword` authentication mode. The configuration references the secret you created previously:

```yaml
apiVersion: e4i.microsoft.com/v1
kind: Application
metadata:
  name: alice-springs-solution
  namespace: alice-springs
spec:
  name: alice-springs-solution
  description: This is a sample application running OPC UA Connector for testing.
  payloadCompression: none
---
apiVersion: e4i.microsoft.com/v1
kind: Module
metadata:
  name: opc-ua-connector-1
  namespace: alice-springs-solution
spec:
  type: opc-ua-connector
  name: opc-ua-connector-1
  description: Connect to opc.tcp://opcplc-000000.alice-springs:50000 and forward data to the configured broker
  settings: |-
    {
      "OpcUaConnectionOptions":
      {
        "DiscoveryUrl": "opc.tcp://opcplc-000000.alice-springs:50000",
        "UseSecurity": true,
        "LoadComplexTypes": true,
        "AuthenticationMode": "UsernamePassword",
        "UserNameFile": "@@sec_k8s_opc-ua-connector-secrets/username",
        "PasswordFile": "@@sec_k8s_opc-ua-connector-secrets/password",
        "SessionTimeout": 600000,
        "DefaultPublishingInterval": 1000,
        "DefaultSamplingInterval": 500,
        "DefaultQueueSize": 15,
        "MaxItemsPerSubscription": 1000,
        "AutoAcceptUntrustedCertificates": true
      },
      "OpcUaConfigurationOptions": {
        "ApplicationName": "az-e4i-opcua-connector-0",
        "ModuleName": "opc-ua-connector-1",
      }
    }
```

## Related content

[Create assets and tags](howto-add-assets.md)
