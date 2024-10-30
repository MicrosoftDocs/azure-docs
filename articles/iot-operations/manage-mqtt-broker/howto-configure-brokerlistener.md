---
title: Secure MQTT broker communication using BrokerListener
description: Understand how to use the BrokerListener resource to secure MQTT broker communications including authorization, authentication, and TLS.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-mqtt-broker
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 10/18/2024

#CustomerIntent: As an operator, I want understand options to secure MQTT communications for my IoT Operations solution.
ms.service: azure-iot-operations
---

# Secure MQTT broker communication using BrokerListener

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

To customize the network access and security use the *BrokerListener* resource. A listener corresponds to a network endpoint that exposes the broker to the network. You can have one or more *BrokerListener* resources for each *Broker* resource, and thus multiple ports with different access control each.

Each listener port can have its own authentication and authorization rules that define who can connect to the listener and what actions they can perform on the broker. You can use *BrokerAuthentication* and *BrokerAuthorization* resources to specify the access control policies for each listener. This flexibility allows you to fine-tune the permissions and roles of your MQTT clients, based on their needs and use cases.

> [!TIP]
> You can only access the default MQTT broker deployment by using the cluster IP, TLS, and a service account token. Clients connecting from outside the cluster need extra configuration before they can connect.

Listeners have the following characteristics:

- You can have up to three listeners. One listener per service type of `loadBalancer`, `clusterIp`, or `nodePort`. The default *BrokerListener* named *listener* is service type `clusterIp`.
- Each listener supports multiple ports
- BrokerAuthentication and BrokerAuthorization references are per port
- TLS configuration is per port
- Service names must be unique
- Ports cannot conflict over different listeners

For a list of the available settings, see the [Broker Listener](/rest/api/iotoperationsmq/broker-listener) API reference.

## Default BrokerListener

When you deploy Azure IoT Operations Preview, the deployment also creates a *BrokerListener* resource named `default` in the `azure-iot-operations` namespace. This listener is linked to the default *Broker* resource named `default` that's also created during deployment. The default listener exposes the broker on port 18883 with TLS and SAT authentication enabled. The TLS certificate is [automatically managed](howto-configure-tls-auto.md) by cert-manager. Authorization is disabled by default.

To view or edit the listener:

# [Portal](#tab/portal)

1. In the Azure portal, navigate to your IoT Operations instance.
1. Under **Azure IoT Operations resources**, select **MQTT Broker**.

    :::image type="content" source="media/howto-configure-brokerlistener/configure-broker-listener.png" alt-text="Screenshot using Azure portal to view Azure IoT Operations MQTT configuration.":::

1. From the broker listener list, select the **default** listener.

    :::image type="content" source="media/howto-configure-brokerlistener/default-broker-listener.png" alt-text="Screenshot using Azure portal to view or edit the default broker listener.":::

1. Review the listener settings and make any changes as needed.

# [Kubernetes](#tab/kubernetes)

To view the default *BrokerListener* resource, use the following command:

```bash
kubectl get brokerlistener listener -n azure-iot-operations -o yaml
```

The output should look similar to this, with most metadata removed for brevity:

```yaml
apiVersion: mqttbroker.iotoperations.azure.com/v1beta1
kind: BrokerListener
metadata:
  name: listener
  namespace: azure-iot-operations
spec:
  brokerRef: default
  serviceName: aio-broker
  serviceType: ClusterIp
  ports:
  - authenticationRef: authn
    port: 18883
    protocol: Mqtt
    tls:
      certManagerCertificateSpec:
        issuerRef:
          group: cert-manager.io
          kind: Issuer
          name: mq-dmqtt-frontend
      mode: Automatic
```

To learn more about the default BrokerAuthentication resource linked to this listener, see [Default BrokerAuthentication resource](howto-configure-authentication.md#default-brokerauthentication-resource).

### Update the default broker listener

The default *BrokerListener* uses the service type *ClusterIp*. You can have only one listener per service type. If you want to add more ports to service type *ClusterIp*, you can update the default listener to add more ports. For example, you could add a new port 1883 with no TLS and authentication off with the following kubectl patch command:

```bash
kubectl patch brokerlistener listener -n azure-iot-operations --type='json' -p='[{"op": "add", "path": "/spec/ports/", "value": {"port": 1883, "protocol": "Mqtt"}}]'
```

---

## Create new broker listeners

This example shows how to create a new *BrokerListener* resource named *loadbalancer-listener* for a *Broker* resource. The *BrokerListener* resource defines a two ports that accept MQTT connections from clients.

- The first port listens on port 1883 with no TLS and authentication off. Clients can connect to the broker without encryption or authentication.
- The second port listens on port 18883 with TLS and authentication enabled. Only authenticated clients can connect to the broker with TLS encryption. TLS is set to `automatic`, which means that the listener uses cert-manager to get and renew its server certificate.

# [Portal](#tab/portal)

1. In the Azure portal, navigate to your IoT Operations instance.
1. Under **Azure IoT Operations resources**, select **MQTT Broker**.
1. Select **MQTT broker listener for LoadBalancer** > **Create**. You can only create one listener per service type. If you already have a listener of the same service type, you can add more ports to the existing listener.

    :::image type="content" source="media/howto-configure-brokerlistener/create-loadbalancer.png" alt-text="Screenshot using Azure portal to create MQTT broker for load balancer listener.":::

    Enter the following settings:

    | Setting        | Description                                                                                   |
    | -------------- | --------------------------------------------------------------------------------------------- |
    | Name           | Name of the BrokerListener resource.                                                          |
    | Service name   | Name of the Kubernetes service associated with the BrokerListener.                            |
    | Service type   | Type of broker service, such as *LoadBalancer*, *NodePort*, or *ClusterIP*.                   |
    | Port           | Port number on which the BrokerListener listens for MQTT connections.                         |
    | Authentication | The [authentication resource reference](howto-configure-authentication.md).                   |
    | Authorization  | The [authorization resource reference](howto-configure-authorization.md).                     |
    | TLS            | Indicates whether TLS is enabled for secure communication. Can be set to [automatic](howto-configure-tls-auto.md) or [manual](howto-configure-tls-manual.md). |

1. Select **Create listener**.

# [Kubernetes](#tab/kubernetes)

To create these *BrokerListener* resources, apply this YAML manifest to your Kubernetes cluster:

```yaml
apiVersion: mqttbroker.iotoperations.azure.com/v1beta1
kind: BrokerListener
metadata:
  name: loadbalancer-listener
  namespace: azure-iot-operations
spec:
  brokerRef: default
  serviceType: LoadBalancer
  serviceName: aio-broker-loadbalancer
  ports:
  - port: 1883
    protocol: Mqtt
  - port: 18883
    authenticationRef: authn
    protocol: Mqtt
    tls:
      mode: Automatic
      certManagerCertificateSpec:
        issuerRef:
            name: e2e-cert-issuer
            kind: Issuer
            group: cert-manager.io
```

For more information about authentication, see [Configure MQTT broker authentication](howto-configure-authentication.md). For more information about authorization, see [Configure MQTT broker authorization](howto-configure-authorization.md). For more information about TLS, see [Configure TLS with automatic certificate management to secure MQTT communication in MQTT broker](howto-configure-tls-auto.md) or [Configure TLS with manual certificate management to secure MQTT communication in MQTT broker](howto-configure-tls-manual.md).

---

## Related content

- [Configure MQTT broker authorization](howto-configure-authorization.md)
- [Configure MQTT broker authentication](howto-configure-authentication.md)
- [Configure MQTT broker TLS with automatic certificate management](howto-configure-tls-auto.md)
- [Configure MQTT broker TLS with manual certificate management](howto-configure-tls-manual.md)
