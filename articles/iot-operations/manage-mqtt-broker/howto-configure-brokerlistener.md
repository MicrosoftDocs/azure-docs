---
title: Secure MQTT broker communication using BrokerListener
description: Understand how to use the BrokerListener resource to secure MQTT broker communications including authorization, authentication, and TLS.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-mqtt-broker
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 08/03/2024

#CustomerIntent: As an operator, I want understand options to secure MQTT communications for my IoT Operations solution.
---

# Secure MQTT broker communication using BrokerListener

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

To customize the network access and security use the **BrokerListener** resource. A listener corresponds to a network endpoint that exposes the broker to the network. You can have one or more BrokerListener resources for each *Broker* resource, and thus multiple ports with different access control each.

Each listener can have its own authentication and authorization rules that define who can connect to the listener and what actions they can perform on the broker. You can use *BrokerAuthentication* and *BrokerAuthorization* resources to specify the access control policies for each listener. This flexibility allows you to fine-tune the permissions and roles of your MQTT clients, based on their needs and use cases.

Listeners have the following characteristics:

- You can have up to three listeners. One listener per service type of `loadBalancer`, `clusterIp`, or `nodePort`. The default *BrokerListener* named *listener* is service type `clusterIp`.
- Each listener supports multiple ports
- AuthN and authZ references are per port
- TLS configuration is per port
- Service names must be unique
- Ports cannot conflict over different listeners

The *BrokerListener* resource has these fields:

| Field Name | Required | Description |
|------------|----------|-------------|
| brokerRef | Yes | The name of the broker resource that this listener belongs to. This field is required and must match an existing *Broker* resource in the same namespace. |
| ports[] | Yes | The listener can listen on multiple ports. List of ports that the listener accepts client connections. |
| ports.authenticationRef  | No | Reference to client authentication settings. Omit to disable authentication. To learn more about authentication, see [Configure MQTT broker authentication](howto-configure-authentication.md). |
| ports.authorizationRef   | No | Reference to client authorization settings. Omit to disable authorization.  |
| ports.nodePort           | No | Kubernetes node port. Only relevant when this port is associated with a NodePort listener. |
| ports.port               | Yes | TCP port for accepting client connections.                                  |
| ports.protocol           | No | Protocol to use for client connections. Values: `Mqtt`, `Websockets`. Default: `Mqtt` |
| ports.tls                | No | TLS server certificate settings for this port. Omit to disable TLS.         |
| ports.tls.automatic      | No | Automatic TLS server certificate management with cert-manager. [Configure TLS with automatic certificate management](howto-configure-tls-auto.md)|
| ports.tls.automatic.duration        | No | Lifetime of certificate. Must be specified using a *Go* time format (h\|m\|s). For example, 240h for 240 hours and 45m for 45 minutes. |
| ports.tls.automatic.issuerRef       | No | cert-manager issuer reference. |
| ports.tls.automatic.issuerRef.group | No | cert-manager issuer group. |
| ports.tls.automatic.issuerRef.kind  | No | cert-manager issuer kind. Values: `Issuer`, `ClusterIssuer`. |
| ports.tls.automatic.issuerRef.name  | No | cert-manager issuer name. |
| ports.tls.automatic.privateKey      | No | Type of certificate private key. |
| ports.tls.automatic.privateKey.algorithm | No | Algorithm for the private key. Values: `Ec256`, `Ec384`, `ec521`, `Ed25519`, `Rsa2048`, `Rsa4096`, `Rsa8192`. |
| ports.tls.automatic.privateKey.rotationPolicy | No | Size of the private key. Values: `Always`, `Never`. |
| ports.tls.automatic.renewBefore     | No | When to begin certificate renewal. Must be specified using a *Go* time format (h\|m\|s). For example, 240h for 240 hours and 45m for 45 minutes. |
| ports.tls.automatic.san             | No | Additional Subject Alternative Names (SANs) to include in the certificate. |
| ports.tls.automatic.san.dns         | No | DNS SANs. |
| ports.tls.automatic.san.ip          | No | IP address SANs. |
| ports.tls.automatic.secretName      | No | Secret for storing server certificate. Any existing data will be overwritten. This is a reference to the secret through an identifying name, not the secret itself. |
| ports.tls.automatic.secretNamespace | No | Certificate Kubernetes namespace. Omit to use current namespace. |
| ports.tls.manual         | No | Manual TLS server certificate management through a defined secret. For more information, see [Configure TLS with manual certificate management](howto-configure-tls-manual.md).|
| ports.tls.manual.secretName | Yes | Kubernetes secret containing an X.509 client certificate. This is a reference to the secret through an identifying name, not the secret itself. |
| ports.tls.manual.secretNamespace | No | Certificate K8S namespace. Omit to use current namespace. |
| serviceName | No | The name of Kubernetes service created for this listener. Kubernetes creates DNS records for this `serviceName` that clients should use to connect to MQTT broker. This subfield is optional and defaults to `aio-mq-dmqtt-frontend`. |
| serviceType | No | The type of the Kubernetes service created for this listener. This subfield is optional and defaults to `clusterIp`. Must be either `loadBalancer`, `clusterIp`, or `nodePort`. |

## Default BrokerListener

When you deploy Azure IoT Operations Preview, the deployment also creates a *BrokerListener* resource named `listener` in the `azure-iot-operations` namespace. This listener is linked to the default Broker resource named `broker` that's also created during deployment. The default listener exposes the broker on port 8883 with TLS and SAT authentication enabled. The TLS certificate is [automatically managed](howto-configure-tls-auto.md) by cert-manager. Authorization is disabled by default.

To inspect the listener, run:

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
  brokerRef: broker
  serviceName: aio-mq-dmqtt-frontend
  serviceType: ClusterIp
  ports:
  - authenticationRef: authn
    port: 8883
    protocol: Mqtt
    tls:
      automatic:
        issuerRef:
          apiGroup: cert-manager.io
          kind: Issuer
          name: mq-dmqtt-frontend
      mode: Automatic
```

To learn more about the default BrokerAuthentication resource linked to this listener, see [Default BrokerAuthentication resource](howto-configure-authentication.md#default-brokerauthentication-resource).

### Update the default BrokerListener

The default BrokerListener uses the service type *ClusterIp*. You can have only one listener per service type. If you want to add more ports to service type *ClusterIp*, you can update the default listener to add more ports. For example, you could add a new port 1883 with no TLS and authentication off with the following kubectl patch command:

```bash
kubectl patch brokerlistener listener -n azure-iot-operations --type='json' -p='[{"op": "add", "path": "/spec/ports/", "value": {"port": 1883, "protocol": "Mqtt"}}]'
```

## Create new BrokerListeners

This example shows how to create a new *BrokerListener* resource for a *Broker* resource named *my-broker*. The *BrokerListener* resource defines a two ports that accept MQTT connections from clients.

- The first port listens on port 1883 with no TLS and authentication off. Clients can connect to the broker without encryption or authentication.
- The second port listens on port 18883 with TLS and authentication enabled. Only authenticated clients can connect to the broker with TLS encryption. TLS is set to `automatic`, which means that the listener uses cert-manager to get and renew its server certificate.

To create these *BrokerListener* resources, apply this YAML manifest to your Kubernetes cluster:

```yaml
apiVersion: mqttbroker.iotoperations.azure.com/v1beta1
kind: BrokerListener
metadata:
  name: my-test-listener
  namespace: azure-iot-operations
spec:
  brokerRef: broker
  serviceType: loadBalancer
  serviceName: my-new-listener
  ports:
  - port: 1883
    protocol: Mqtt
  - port: 18883
    authenticationRef: authn
    protocol: Mqtt
    tls:
      automatic:
        issuerRef:
            name: e2e-cert-issuer
            kind: Issuer
            group: cert-manager.io
      mode: Automatic
```

## Related content

- [Configure MQTT broker authorization](howto-configure-authorization.md)
- [Configure MQTT broker authentication](howto-configure-authentication.md)
- [Configure MQTT broker TLS with automatic certificate management](howto-configure-tls-auto.md)
- [Configure MQTT broker TLS with manual certificate management](howto-configure-tls-manual.md)
