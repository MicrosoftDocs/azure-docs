---
title: Secure Azure IoT MQ communication using BrokerListener
titleSuffix: Azure IoT MQ
description: Understand how to use the BrokerListener resource to secure Azure IoT MQ communications including authorization, authentication, and TLS.
author: PatAltimore
ms.author: patricka
ms.subservice: mq
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 11/15/2023

#CustomerIntent: As an operator, I want understand options to secure MQTT communications for my IoT Operations solution.
---

# Secure Azure IoT MQ communication using BrokerListener

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

To customize the network access and security use the **BrokerListener** resource. A listener corresponds to a network endpoint that exposes the broker to the network. You can have one or more BrokerListener resources for each *Broker* resource, and thus multiple ports with different access control each.

Each listener can have its own authentication and authorization rules that define who can connect to the listener and what actions they can perform on the broker. You can use *BrokerAuthentication* and *BrokerAuthorization* resources to specify the access control policies for each listener. This flexibility allows you to fine-tune the permissions and roles of your MQTT clients, based on their needs and use cases.

The *BrokerListener* resource has these fields:

| Field Name | Required | Description |
| --- | --- | --- |
| `brokerRef` | Yes | The name of the broker resource that this listener belongs to. This field is required and must match an existing *Broker* resource in the same namespace. |
| `port` | Yes | The port number that this listener listens on. This field is required and must be a valid TCP port number. |
| `serviceType` | No | The type of the Kubernetes service created for this listener. This subfield is optional and defaults to `clusterIp`. Must be either `loadBalancer`, `clusterIp`, or `nodePort`. |
| `serviceName` | No | The name of Kubernetes service created for this listener. Kubernetes creates DNS records for this `serviceName` that clients should use to connect to IoT MQ. This subfield is optional and defaults to `aio-mq-dmqtt-frontend`. Important: If you have multiple listeners with the same `serviceType` and `serviceName`, the listeners share the same Kubernetes service. For more information, see [Service name and service type](#service-name-and-service-type). |
| `authenticationEnabled` | No | A boolean flag that indicates whether this listener requires authentication from clients. If set to `true`, this listener uses any *BrokerAuthentication* resources associated with it to verify and authenticate the clients. If set to `false`, this listener allows any client to connect without authentication. This field is optional and defaults to `false`. To learn more about authentication, see [Configure Azure IoT MQ authentication](howto-configure-authentication.md). |
| `authorizationEnabled` | No | A boolean flag that indicates whether this listener requires authorization from clients. If set to `true`, this listener uses any *BrokerAuthorization* resources associated with it to verify and authorize the clients. If set to `false`, this listener allows any client to connect without authorization. This field is optional and defaults to `false`. To learn more about authorization, see [Configure Azure IoT MQ authorization](howto-configure-authorization.md). |
| `tls` | No | The TLS settings for the listener. The field is optional and can be omitted to disable TLS for the listener. To configure TLS, set it one of these types: <br> * If set to `automatic`, this listener uses cert-manager to get and renew a certificate for the listener. To use this type, [specify an `issuerRef` field to reference the cert-manager issuer](howto-configure-tls-auto.md). <br> * If set to `manual`, the listener uses a manually provided certificate for the listener. To use this type, [specify a `secretName` field that references a Kubernetes secret containing the certificate and private key](howto-configure-tls-manual.md). <br> * If set to `keyVault`, the listener uses a certificate from Azure Key Vault. To use this type, [specify a `keyVault` field that references the Azure Key Vault instance and secret](howto-manage-secrets.md). |

## Default BrokerListener

When you deploy Azure IoT Operations, the deployment also creates a *BrokerListener* resource named `listener` in the `azure-iot-operations` namespace. This listener is linked to the default Broker resource named `broker` that's also created during deployment. The default listener exposes the broker on port 8883 with TLS and SAT authentication enabled. The TLS certificate is [automatically managed](howto-configure-tls-auto.md) by cert-manager. Authorization is disabled by default.

To inspect the listener, run:

```bash
kubectl get brokerlistener listener -n azure-iot-operations -o yaml
```

The output should look like this, with most metadata removed for brevity:

```yaml
apiVersion: mq.iotoperations.azure.com/v1beta1
kind: BrokerListener
metadata:
  name: listener
  namespace: azure-iot-operations
spec:
  brokerRef: broker
  authenticationEnabled: true
  authorizationEnabled: false
  port: 8883
  serviceName: aio-mq-dmqtt-frontend
  serviceType: clusterIp
  tls:
    automatic:
      issuerRef:
        group: cert-manager.io
        kind: Issuer
        name: mq-dmqtt-frontend
```

To learn more about the default BrokerAuthentication resource linked to this listener, see [Default BrokerAuthentication resource](howto-configure-authentication.md#default-brokerauthentication-resource).

## Create new BrokerListeners

This example shows how to create two new *BrokerListener* resources for a *Broker* resource named *my-broker*. Each *BrokerListener* resource defines a port and a TLS setting for a listener that accepts MQTT connections from clients.

- The first *BrokerListener* resource, named *my-test-listener*, defines a listener on port 1883 with no TLS and authentication off. Clients can connect to the broker without encryption or authentication.
- The second *BrokerListener* resource, named *my-secure-listener*, defines a listener on port 8883 with TLS and authentication enabled. Only authenticated clients can connect to the broker with TLS encryption. The `tls` field is set to `automatic`, which means that the listener uses cert-manager to get and renew its server certificate.

To create these *BrokerListener* resources, apply this YAML manifest to your Kubernetes cluster:

```yaml
apiVersion: mq.iotoperations.azure.com/v1beta1
kind: BrokerListener
metadata:
  name: my-test-listener
  namespace: azure-iot-operations
spec:
  authenticationEnabled: false
  authorizationEnabled: false
  brokerRef: broker
  port: 1883
---
apiVersion: mq.iotoperations.azure.com/v1beta1
kind: BrokerListener
metadata:
  name: my-secure-listener
  namespace: azure-iot-operations
spec:
  authenticationEnabled: true
  authorizationEnabled: false
  brokerRef: broker
  port: 8883
  tls:
    automatic:
      issuerRef:
        name: e2e-cert-issuer
        kind: Issuer
        group: cert-manager.io
```

## Service name and service type

If you have multiple BrokerListener resources with the same `serviceType` and `serviceName`, the resources share the same Kubernetes service. This means that the service exposes all the ports of all the listeners. For example, if you have two listeners with the same `serviceType` and `serviceName`, one on port 1883 and the other on port 8883, the service exposes both ports. Clients can connect to the broker on either port. 

There are two important rules to follow when sharing service name:

1. Listeners with the same `serviceType` must share the same `serviceName`.

1. Listeners with different `serviceType` must have different `serviceName`.

Notably, the service for the default listener on port 8883 is `clusterIp` and named `aio-mq-dmqtt-frontend`. The following table summarizes what happens when you create a new listener on a different port:

| New listener `serviceType` | New listener `serviceName` | Result |
| --- | --- | --- |
| `clusterIp` | `aio-mq-dmqtt-frontend` | The new listener creates successfully, and the service exposes both ports. |
| `clusterIp` | `my-service` | The new listener fails to create because the service type conflicts with the default listener. |
| `loadBalancer` or `nodePort` | `aio-mq-dmqtt-frontend` | The new listener fails to create because the service name conflicts with the default listener. |
| `loadBalancer` or `nodePort` | `my-service` | The new listener creates successfully, and a new service is created. |

## Related content

- [Configure Azure IoT MQ authorization](howto-configure-authorization.md)
- [Configure Azure IoT MQ authentication](howto-configure-authentication.md)
- [Configure Azure IoT MQ TLS with automatic certificate management](howto-configure-tls-auto.md)
- [Configure Azure IoT MQ TLS with manual certificate management](howto-configure-tls-manual.md)
