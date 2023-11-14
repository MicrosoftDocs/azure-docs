---
title: Configure Azure IoT MQ authorization
# titleSuffix: Azure IoT MQ
description: Configure Azure IoT MQ authorization using BrokerAuthorization.
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 10/28/2023

#CustomerIntent: As an operator, I want to configure authorization so that I have secure MQTT broker communications.
---

# Configure Azure IoT MQ authorization

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Authorization policies determine what actions the clients can perform on the broker, such as connecting, publishing, or subscribing to topics. Configure Azure IoT MQ to use one or multiple authorization policies with the *BrokerAuthorization* resource.

You can set to one *BrokerAuthorization* for each listener. Each *BrokerAuthorization* resource contains a list of rules that specify the principals and resources for the authorization policies.

> [!IMPORTANT]
> To have the *BrokerAuthorization* configuration apply to a listener, at least one *BrokerAuthentication* must also be linked to that listener.

## Configure BrokerAuthorization for listeners

The specification of a *BrokerAuthorization* resource has the following fields:

| Field Name | Required | Description |
| --- | --- | --- |
| listenerRef | Yes | The names of the BrokerListener resources that this authorization policy applies. This field is required and must match an existing *BrokerListener* resource in the same namespace. |
| authorizationPolicies | Yes | This field defines the settings for the authorization policies. |
| enableCache |  | Whether to enable caching for the authorization policies. |
| rules |  | A boolean flag that indicates whether to enable caching for the authorization policies. If set to `true`, the broker caches the authorization results for each client and topic combination to improve performance and reduce latency. If set to `false`, the broker evaluates the authorization policies for each client and topic request, to ensure consistency and accuracy. This field is optional and defaults to `false`. |
| principals |  | This subfield defines the identities that represent the clients. |
| usernames |  | A list of usernames that match the clients. The usernames are case-sensitive and must match the usernames provided by the clients during authentication. |
| attributes |  | A list of key-value pairs that match the attributes of the clients. The attributes are case-sensitive and must match the attributes provided by the clients during authentication. |
| brokerResources | Yes | This subfield defines the objects that represent the actions or topics. |
| method | Yes | The type of action that the clients can perform on the broker. This subfield is required and can be one of these values: **Connect**: This value indicates that the clients can connect to the broker. - **Publish**: This value indicates that the clients can publish messages to topics on the broker. - **Subscribe**: This value indicates that the clients can subscribe to topics on the broker. |
| topics | No | A list of topics or topic patterns that match the topics that the clients can publish or subscribe to. This subfield is required if the method is Subscribe or Publish. |

The following example shows how to create a *BrokerAuthorization* resource that defines the authorization policies for a listener named *my-listener*.

```yaml
apiVersion: mq.iotoperations.azure.com/v1beta1
kind: BrokerAuthorization
metadata:
  name: "my-authz-policies"
  namespace: azure-iot-operations
spec:
  listenerRef:
    - "my-listener" # change to match your listener name as needed
  authorizationPolicies:
    enableCache: true
    rules:
      - principals:
          usernames:
            - temperature-sensor
            - humidity-sensor
          attributes:
            - city: "seattle"
              organization: "contoso"
        brokerResources:
          - method: Connect
          - method: Publish
            topics:
              - "/telemetry/{principal.username}"
              - "/telemetry/{principal.attributes.organization}"
          - method: Subscribe
            topics:
              - "/commands/{principal.attributes.organization}"
```

This broker authorization allows clients with usernames `temperature-sensor` or `humidity-sensor`, or clients with attributes `organization` with value `contoso` and `city` with value `seattle`, to:

- Connect to the broker.
- Publish messages to telemetry topics scoped with their usernames and organization. For example:
  - `temperature-sensor` can publish to `/telemetry/temperature-sensor` and `/telemetry/contoso`.
  - `humidity-sensor` can publish to `/telemetry/humidity-sensor` and `/telemetry/contoso`.
  - `some-other-username` can publish to `/telemetry/contoso`.
- Subscribe to commands topics scoped with their organization. For example:
  - `temperature-sensor` can subscribe to `/commands/contoso`.
  - `some-other-username` can subscribe to `/commands/contoso`.

To create this BrokerAuthorization resource, apply the YAML manifest to your Kubernetes cluster.

## Authorize clients that use X.509 authentication

Clients that use [X.509 certificates for authentication](./howto-configure-authentication.md) can be authorized to access resources based on X.509 properties present on their certificate or their issuing certificates up the chain.

### With certificate chain properties using attributes

To create rules based on properties from a client's certificate, its root CA, or intermediate CA, a certificate-to-attributes mapping TOML file is required. For example:

```toml
[root]
subject = "CN = Contoso Root CA Cert, OU = Engineering, C = US"

[root.attributes]
organization = "contoso"

[intermediate]
subject = "CN = Contoso Intermediate CA"

[intermediate.attributes]
city = "seattle"
foo = "bar"

[smart-fan]
subject = "CN = smart-fan"

[smart-fan.attributes]
building = "17"
```

In this example, every client that has a certificate issued by the root CA `CN = Contoso Root CA Cert, OU = Engineering, C = US` or an intermediate CA `CN = Contoso Intermediate CA` receives the attributes listed. In addition, the smart fan receives attributes specific to it.

The matching for attributes always starts from the leaf client certificate and then goes along the chain. The attribute assignment stops after the first match. In previous example, even if `smart-fan` has the intermediate certificate `CN = Contoso Intermediate CA`, it doesn't get the associated attributes.

To apply the mapping, create a certificate-to-attribute mapping TOML file as a Kubernetes secret, and reference it in `authenticationMethods.x509.attributes` for the BrokerAuthentication resource.

Then, authorization rules can be applied to clients using X.509 certificates with these attributes.

### With client certificate subject common name as username

To create authorization policies based on the *client* certificate subject common name (CN) only, create rules based on the CN.

For example, if a client has a certificate with subject `CN = smart-lock`, its username is `smart-lock`. From there, create authorization policies as normal.

## Authorize clients that use Kubernetes Service Account Tokens

Authorization attributes for SATs are set as part of the Service Account annotations. For example, to add an authorization attribute named `group` with value `authz-sat`, run the command:

```bash
kubectl annotate serviceaccount mqtt-client aio-mq-broker-auth/group=authz-sat
```

Attribute annotations must begin with `aio-mq-broker-auth/` to distinguish them from other annotations.

As the application has an authorization attribute called `authz-sat`, there's no need to provide a `clientId` or `username`. The corresponding *BrokerAuthorization* resource uses this attribute as a principal, for example:

```yaml
apiVersion: mq.iotoperations.azure.com/v1beta1
kind: BrokerAuthorization
metadata:
  name: "my-authz-policies"
  namespace: azure-iot-operations
spec:
  listenerRef:
    - "az-mqtt-non-tls-listener"
  authorizationPolicies:
    enableCache: false
    rules:
      - principals:
          attributes:
            - group: "authz-sat"
        brokerResources:
          - method: Connect
          - method: Publish
            topics:
              - "odd-numbered-orders"
          - method: Subscribe
            topics:
              - "orders"                                       
```

To learn more with an example, see [Set up Authorization Policy with Dapr Client](../develop/howto-develop-dapr-apps.md).


## Update authorization

Broker authorization resources can be updated at runtime without restart. All clients connected at the time of the update of policy are disconnected. Changing the policy type is also supported.

```bash
kubectl edit brokerauthorization my-authz-policies
```

## Disable authorization

To disable authorization, set `authorizationEnabled: false` in the BrokerListener resource. When the policy is set to allow all clients, all [authenticated clients](./howto-configure-authentication.md) can access all operations.

```yaml
apiVersion: mq.iotoperations.azure.com/v1beta1
kind: BrokerListener
metadata:
  name: "my-listener"
  namespace: azure-iot-operations
spec:
  brokerRef: "my-broker"
  authenticationEnabled: false
  authorizationEnabled: false
  port: 1883
```

## Unauthorized publish in MQTT 3.1.1

With MQTT 3.1.1, when a publish is denied, the client receives the PUBACK with no error because the protocol version doesn't support returning error code. MQTTv5 return PUBACK with reason code 135 (Not authorized) when publish is denied.

## Related content

- About [BrokerListener resource](howto-configure-brokerlistener.md)
- [Configure authentication for a BrokerListener](./howto-configure-authentication.md)
- [Configure TLS with manual certificate management](./howto-configure-tls-manual.md)
- [Configure TLS with automatic certificate management](./howto-configure-tls-auto.md)
