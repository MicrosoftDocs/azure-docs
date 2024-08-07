---
title: Deploy Dapr pluggable components
description: Deploy Dapr and the MQTT broker pluggable components to a cluster.
author: PatAltimore 
ms.author: patricka 
ms.subservice: azure-mqtt-broker
ms.topic: how-to
ms.custom:
ms.date: 07/02/2024
---

# Deploy Dapr pluggable components

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

The Distributed Application Runtime (Dapr) is a portable, serverless, event-driven runtime that simplifies the process of building distributed applications. Dapr lets you build stateful or stateless apps without worrying about how the building blocks function. Dapr provides several [building blocks](https://docs.dapr.io/developing-applications/building-blocks/): pub/sub, state management, service invocation, actors, and more.  

Azure IoT Operations supports two of these building blocks, powered by [MQTT broker](../manage-mqtt-broker/overview-iot-mq.md):

- Publish and subscribe
- State management

To use the Dapr pluggable components, define the component spec for each of the APIs and then [register this to the cluster](https://docs.dapr.io/operations/components/pluggable-components-registration/). The Dapr components listen to a Unix domain socket placed on the shared volume. The Dapr runtime connects with each socket and discovers all services from a given building block API that the component implements.

## Install Dapr runtime

To install the Dapr runtime, use the following Helm command:

> [!NOTE]
> If you completed the provided Azure IoT Operations Preview [quickstart](../get-started-end-to-end-sample/quickstart-deploy.md), you already installed the Dapr runtime and the following steps are not required.

```bash
helm repo add dapr https://dapr.github.io/helm-charts/
helm repo update
helm upgrade --install dapr dapr/dapr --version=1.13 --namespace dapr-system --create-namespace --wait
```

## Register MQTT broker pluggable components

To register the pub/sub and state management pluggable components, create the component manifest yaml, and apply it to your cluster. 

To create the yaml file, use the following component definitions:

> [!div class="mx-tdBreakAll"]
> | Component | Description |
> |-|-|
> | `metadata:name` | The component name is important and is how a Dapr application references the component. |
> | `metadata:annotations:dapr.io/component-container` | Component annotations used by Dapr sidecar injector, defining the image location, volume mounts and logging configuration |
> | `spec:type` | [The type of the component](https://docs.dapr.io/operations/components/pluggable-components-registration/#define-the-component), which needs to be declared exactly as shown |
> | `spec:metadata:keyPrefix` | Defines the key prefix used when communicating to the statestore backend. See the [Dapr documentation](https://docs.dapr.io/developing-applications/building-blocks/state-management/howto-share-state) for more information |
> | `spec:metadata:hostname` | The MQTT broker hostname. Default is `aio-mq-dmqtt-frontend` |
> | `spec:metadata:tcpPort` | The MQTT broker port number. Default is `8883` |
> | `spec:metadata:useTls` |  Define if TLS is used by the MQTT broker. Default is `true` |
> | `spec:metadata:caFile` | The certificate chain path for validating the MQTT broker. Required if `useTls` is `true`. This file must be mounted in the pod with the specified volume name |
> | `spec:metadata:satAuthFile ` | The Service Account Token (SAT) file is used to authenticate the Dapr components with the MQTT broker.  This file must be mounted in the pod with the specified volume name |

1. Save the following yaml, which contains the Azure IoT Operations component definitions, to a file named `components.yaml`:

    ```yml
    apiVersion: dapr.io/v1alpha1
    kind: Component
    metadata:
      name: iotoperations-pubsub
      namespace: azure-iot-operations
      annotations:
        dapr.io/component-container: >
          {
            "name": "iot-operations-dapr-components",
            "image": "ghcr.io/azure/iot-operations-dapr-components:latest",
            "volumeMounts": [
              { "name": "mqtt-client-token", "mountPath": "/var/run/secrets/tokens" },
              { "name": "aio-ca-trust-bundle", "mountPath": "/var/run/certs/aio-mq-ca-cert" }
            ],
            "env": [
                { "name": "pubSubLogLevel", "value": "Information" },
                { "name": "stateStoreLogLevel", "value": "Information" }
            ]
          }
    spec:
      type: pubsub.azure.iotoperations
      version: v1
      metadata:
      - name: hostname
        value: aio-mq-dmqtt-frontend
      - name: tcpPort
        value: 8883
      - name: useTls
        value: true
      - name: caFile
        value: /var/run/certs/aio-mq-ca-cert/ca.crt
      - name: satAuthFile
        value: /var/run/secrets/tokens/mqtt-client-token
    ---
    apiVersion: dapr.io/v1alpha1
    kind: Component
    metadata:
      name: iotoperations-statestore
      namespace: azure-iot-operations
    spec:
      type: state.azure.iotoperations
      version: v1
      metadata:
      - name: hostname
        value: aio-mq-dmqtt-frontend
      - name: tcpPort
        value: 8883
      - name: useTls
        value: true
      - name: caFile
        value: /var/run/certs/aio-mq-ca-cert/ca.crt
      - name: satAuthFile
        value: /var/run/secrets/tokens/mqtt-client-token    
    ```

1. Apply the component yaml to your cluster by running the following command:

    ```bash
    kubectl apply -f components.yaml
    ```

    Verify the following output:

    ```output
    component.dapr.io/iotoperations-pubsub created
    component.dapr.io/iotoperations-statestore created
    ```

## Create authorization policy for MQTT broker

To configure authorization policies to MQTT broker, first you create a [BrokerAuthorization](../manage-mqtt-broker/howto-configure-authorization.md) resource.

> [!NOTE]
> If Broker Authorization is not enabled on this cluster, you can skip this section as the applications will have access to all MQTT topics, including those needed to access the MQTT broker State Store.

1. Save the following yaml, which contains a BrokerAuthorization definition, to a file named `aio-dapr-authz.yaml`:

    ```yml
    apiVersion: mqttbroker.iotoperations.azure.com/v1beta1
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
