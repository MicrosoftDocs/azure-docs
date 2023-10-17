---
title: Secure Azure IoT MQ communication
# titleSuffix: Azure IoT MQ
description: Understand how to use the BrokerListener resource to secure Azure IoT MQ communications including authorization, authentication, and TLS.
author: PatAltimore
ms.author: patricka
ms.topic: concept-article
ms.date: 10/02/2023

#CustomerIntent: As an operator, I want understand options to secure MQTT communications for my IoT Operations solution.
---

# Secure Azure IoT MQ communication

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

To customize the network access and security use the **BrokerListener** resource. A listener is a network endpoint that exposes the broker to the network. You can have one or more BrokerListener resources for each Broker resource, and thus multiple ports with different access control each.

Each listener can have its own authentication and authorization rules, which define who can connect to the listener and what actions they can perform on the broker. You can use BrokerAuthentication and BrokerAuthorization resources to specify the access control policies for each listener. This allows you to fine-tune the permissions and roles of your MQTT clients, based on their needs and use cases.

The *BrokerListener* resource has these fields:

- `brokerRef`: The name of the Broker resource that this listener belongs to. This field is required and must match an existing Broker resource in the same namespace.
- `port`: The port number that this listener listens on. This field is required and must be a valid TCP port number.
- `serviceType`: The type of the Kubernetes Service created for this listener. This subfield is optional and defaults to `loadBalancer`. Must be either `loadBalancer`, `clusterIp`, or `nodePort`.
- `serviceName`: The name of Kubernetes Service created for this listener. Kubernetes will create DNS records for this `serviceName` which clients should use to connect to IoT MQ. This subfield is optional and defaults to `azedge-dmqtt-frontend`. If multiple service types are specified across different `BrokerListeners`, each `serviceType` must have a unique `serviceName`.
- `nodePort`: If `serviceType` is `nodePort`, specify the port to use as the `nodePort`. Has no effect for other service types.
- `authenticationEnabled`: A boolean flag that indicates whether this listener requires authentication from clients. If set to `true`, this listener uses any BrokerAuthentication resources associated with it to verify and authorize the clients. If set to `false`, this listener allows any client to connect without authentication. This field is optional and defaults to `false`.
- `authorizationEnabled`: A boolean flag that indicates whether to enable policy checking for the authorization policies. If set to `true`, the broker checks the BrokerAuthorization policies for each client and topic request, and denies any request that doesn't match any rule. If no BrokerAuthorization is provided, DenyAll is used and all requests will fail. If set to `false`, the broker allows any request that does not match any rule, as long as the client is authenticated. This field is optional and defaults to `false`.
- `tls`: The TLS settings for this listener. This field is optional and can be omitted to disable TLS for the listener. To configure TLS, set it one of these types:
  - `automatic`: Indicates that this listener uses cert-manager to get and renew a certificate for the listener. To use this type, specify an `issuerRef` field to reference the cert-manager Issuer.
  - `manual`: Indicates that this listener uses a manually provided certificate for the listener. To use this type, specify a `secret` field that references a Kubernetes Secret resource containing the certificate and the private key.

## Example configuration

This example shows how to create two BrokerListener resources for a Broker resource named `my-broker`. Each BrokerListener resource defines a port and a TLS setting for a listener that accepts MQTT connections from clients.

- The first BrokerListener resource, named `my-test-listener`, defines a listener on port 1883 with no TLS and authentication off. Clients can connect to the broker without encryption or authentication.
- The second BrokerListener resource, named `my-secure-listener`, defines a listener on port 8883 with TLS and authentication enabled. Only authenticated clients can connect to the broker with TLS encryption. The `tls` field to `automatic`, which means that the listener uses cert-manager to get and renew its server certificate.

To create these BrokerListener resources, apply this YAML manifest to your Kubernetes cluster:

```yaml
apiVersion: az-edge.com/v1alpha3
kind: BrokerListener
metadata:
  name: my-test-listener
  namespace: default
spec:
  authenticationEnabled: false
  authorizationEnabled: false
  brokerRef: my-broker
  port: 1883
---
apiVersion: az-edge.com/v1alpha3
kind: BrokerListener
metadata:
  name: my-secure-listener
  namespace: default
spec:
  authenticationEnabled: true
  authorizationEnabled: false
  brokerRef: my-broker
  port: 8883
  tls:
    automatic:
      issuerRef:
        name: e2e-cert-issuer
        kind: Issuer
```

## Related content

- [Configure Azure IoT MQ authorization](../administer/howto-configure-authorization.md)
- [Configure Azure IoT MQ authentication](../administer/howto-configure-authentication.md)
- [Configure Azure IoT MQ TLS](../administer/howto-configure-tls.md)

