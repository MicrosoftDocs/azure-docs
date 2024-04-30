---
title: Deploy Dapr pluggable components
titleSuffix: Azure IoT MQ
description: Deploy Dapr and the IoT MQ pluggable components to a cluster.
author: PatAltimore 
ms.author: patricka 
ms.subservice: mq
ms.topic: how-to
ms.custom:
ms.date: 1/31/2024
---

# Deploy Dapr pluggable components

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

The Distributed Application Runtime (Dapr) is a portable, serverless, event-driven runtime that simplifies the process of building distributed applications. Dapr lets you build stateful or stateless apps without worrying about how the building blocks function. Dapr provides several [building blocks](https://docs.dapr.io/developing-applications/building-blocks/): pub/sub, state management, service invocation, actors, and more.  

Azure IoT MQ Preview supports two of these building blocks, powered by [Azure IoT MQ MQTT broker](../manage-mqtt-connectivity/overview-iot-mq.md):

- Publish and subscribe
- State management

To use the IoT MQ Dapr pluggable components, define the component spec for each of the APIs and then [register this to the cluster](https://docs.dapr.io/operations/components/pluggable-components-registration/). The Dapr components listen to a Unix domain socket placed on the shared volume. The Dapr runtime connects with each socket and discovers all services from a given building block API that the component implements.

## Install Dapr runtime

To install the Dapr runtime, use the following Helm command:

> [!NOTE]
> If you completed the provided Azure IoT Operations Preview [quickstart](../get-started/quickstart-deploy.md), you already installed the Dapr runtime and the following steps are not required.

```bash
helm repo add dapr https://dapr.github.io/helm-charts/
helm repo update
helm upgrade --install dapr dapr/dapr --version=1.13 --namespace dapr-system --create-namespace --wait
```

## Register MQ pluggable components

To register MQ's pluggable pub/sub and state management components, create the component manifest yaml, and apply it to your cluster. 

To create the yaml file, use the following component definitions:

> [!div class="mx-tdBreakAll"]
> | Component | Description |
> |-|-|
> | `metadata.name` | The component name is important and is how a Dapr application references the component. |
> | `metadata.annotations` | Component annotations used by the Dapr sidecar injector
> | `spec.type` | [The type of the component](https://docs.dapr.io/operations/components/pluggable-components-registration/#define-the-component), which must be declared exactly as shown. It tells Dapr what kind of component (`pubsub` or `state`) it is and which Unix socket to use. |
> | `spec.metadata.url` | The URL tells the component where the local MQ endpoint is. Defaults to `8883` is MQ's default MQTT port with TLS enabled. |
> | `spec.metadata.satTokenPath` | The Service Account Token is used to authenticate the Dapr components with the MQTT broker |
> | `spec.metadata.tlsEnabled` |  Define if TLS is used by the MQTT broker. Defaults to `true` |
> | `spec.metadata.caCertPath` | The certificate chain path for validating the broker, required if `tlsEnabled` is `true` |
> | `spec.metadata.logLevel` | The logging level of the component. 'Debug', 'Info', 'Warn' and 'Error' |

1. Save the following yaml, which contains the component definitions, to a file named `components.yaml`:

    ```yml
    # Pub/sub component
    apiVersion: dapr.io/v1alpha1
    kind: Component
    metadata:
      name: aio-mq-pubsub
      namespace: azure-iot-operations
      annotations:
        dapr.io/component-container: >
          {
            "name": "aio-mq-components",
            "image": "ghcr.io/azure/iot-mq-dapr-components:latest",
            "volumeMounts": [
              {
                "name": "mqtt-client-token",
                "mountPath": "/var/run/secrets/tokens"
              },
              {
                "name": "aio-ca-trust-bundle",
                "mountPath": "/var/run/certs/aio-mq-ca-cert"
              }
            ]
          }
    spec:
      type: pubsub.aio-mq-pubsub-pluggable # DO NOT CHANGE
      version: v1
      metadata:
      - name: url
        value: "aio-mq-dmqtt-frontend:8883"
      - name: satTokenPath
        value: "/var/run/secrets/tokens/mqtt-client-token"
      - name: tlsEnabled
        value: true
      - name: caCertPath
        value: "/var/run/certs/aio-mq-ca-cert/ca.crt"
    ---
    # State Management component
    apiVersion: dapr.io/v1alpha1
    kind: Component
    metadata:
      name: aio-mq-statestore
      namespace: azure-iot-operations
      annotations:
        dapr.io/component-container: >
          {
            "name": "aio-mq-components",
            "image": "ghcr.io/azure/iot-mq-dapr-components:latest",
            "volumeMounts": [
              {
                "name": "mqtt-client-token",
                "mountPath": "/var/run/secrets/tokens"
              },
              {
                "name": "aio-ca-trust-bundle",
                "mountPath": "/var/run/certs/aio-mq-ca-cert"
              }
            ]
          }
    spec:
      type: state.aio-mq-statestore-pluggable # DO NOT CHANGE
      version: v1
      metadata:
      - name: url
        value: "aio-mq-dmqtt-frontend:8883"
      - name: satTokenPath
        value: "/var/run/secrets/tokens/mqtt-client-token"
      - name: tlsEnabled
        value: true
      - name: caCertPath
        value: "/var/run/certs/aio-mq-ca-cert/ca.crt"
    ```

1. Apply the component yaml to your cluster by running the following command:

    ```bash
    kubectl apply -f components.yaml
    ```

    Verify the following output:

    ```output
    component.dapr.io/aio-mq-pubsub created
    component.dapr.io/aio-mq-statestore created
    ```

## Create authorization policy for IoT MQ

To configure authorization policies to Azure IoT MQ, first you create a [BrokerAuthorization](../manage-mqtt-connectivity/howto-configure-authorization.md) resource.

> [!NOTE]
> If Broker Authorization is not enabled on this cluster, you can skip this section as the applications will have access to all MQTT topics, including those needed to access the IoT MQ State Store.

1. Save the following yaml, which contains a BrokerAuthorization definition, to a file named `aio-dapr-authz.yaml`:

    ```yml
    apiVersion: mq.iotoperations.azure.com/v1beta1
    kind: BrokerAuthorization
    metadata:
      name: my-dapr-authz-policies
      namespace: azure-iot-operations
    spec:
      listenerRef:
        - my-listener # change to match your listener name as needed
      authorizationPolicies:
        enableCache: false
        rules:
          - principals:
              attributes:
                - group: dapr-workload # match to the attribute annotated to the service account
            brokerResources:
              - method: Connect
              - method: Publish
                topics:
                  - "$services/statestore/#"
              - method: Subscribe
                topics:
                  - "clients/{principal.clientId}/services/statestore/#"
    ```

1. Apply the BrokerAuthorizaion definition to the cluster:

    ```bash
    kubectl apply -f aio-dapr-authz.yaml
    ```

## Next steps

Now that you have deployed the Dapr components, you can [Use Dapr to develop distributed applications](howto-develop-dapr-apps.md).
