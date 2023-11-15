---
title: Use Dapr to develop distributed application workloads
# titleSuffix: Azure IoT MQ
description: Develop distributed applications that talk with Azure IoT MQ using Dapr.
author: timlt
ms.author: timlt
# ms.subservice: mq
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 10/24/2023

# CustomerIntent: As an developer, I want to understand how to use Dapr to develop distributed apps that talk with Azure IoT MQ.
---

# Use Dapr to develop distributed application workloads

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

The Distributed Application Runtime (Dapr) is a portable, serverless, event-driven runtime that simplifies the process of building distributed application. Dapr enables developers to build stateful or stateless apps without worrying about how the building blocks function. Dapr provides several [building blocks](https://docs.dapr.io/developing-applications/building-blocks/): state management, service invocation, actors, pub/sub, and more.  Azure IoT MQ Preview supports two of these building blocks:

- Publish and Subscribe, powered by [Azure IoT MQ MQTT broker](../manage-mqtt-connectivity/overview-iot-mq.md)
- State Management

To use Dapr pluggable components, define all the components, then add pluggable component containers to your [deployments](https://docs.dapr.io/operations/components/pluggable-components-registration/). Then, the component listens to a Unix Domain Socket placed on the shared volume, and Dapr runtime connects with each socket and discovers all services from a given building block API that the component implements. Each deployment must have its own plug-able component defined. This guide shows you how to deploy an application using the Dapr SDK and IoT MQ pluggable components.

## Features supported

The following features are supported for using Dapr:  

| Feature | Supported | Symbol |
|---------| :--------:| :----: |
| Component for Publish Subscribe | Supported | ✅ |
| Component for State Management (concurrency*) | Supported | ✅ |
| [Pluggable components](https://docs.dapr.io/operations/components/pluggable-components-registration/) | Supported | ✅ |

> [!NOTE]
> *Concurrency is *strong consistency*. The MQTT broker modifies the state and then returns the success message.

## Set up Dapr components

The following steps show you how to install Dapr and the MQ pluggable components, and show how to create the required authorization tokens.

### Install Dapr

To install the Dapr runtime, use the following Helm command. You might have already installed the runtime if you used the provided Azure IoT Operations Preview quickstart.

```bash
helm repo add dapr https://dapr.github.io/helm-charts/
helm repo update
helm upgrade --install dapr dapr/dapr --version=1.11 --namespace dapr-system --create-namespace --wait
```

> [!IMPORTANT]
> **Dapr v1.12** is currently not supported.

### Register MQ's pluggable components

To register MQ's pluggable Pub/sub and State Management components, create the component manifest yaml, and apply it to your cluster. 

To create the yaml file, use the following component definitions:

> [!div class="mx-tdBreakAll"]
> | Component | Description |
> |-|-|
> | `metadata.name` | The component name is important and is how [a Dapr application reaches the component](https://github.com/Azure-Samples/explore-iot-operations/samples/dapr-quickstart-go/main.go#L41). |
> | `spec.type` | [The type of the component](https://docs.dapr.io/operations/components/pluggable-components-registration/#define-the-component), which must be declared exactly as shown. It tells Dapr what kind of component (`pubsub` or `state`) it is and which Unix socket to use.  |
> | `spec.metadata.url` | The URL tells the component where the local MQ endpoint is. The shown value `8883` is MQ's default MQTT port. |
> | `spec.metadata.satTokenPath` | TBD |
> | `spec.metadata.tlsEnabled` |  Define if TLS is used by the MQTT broker. Defaults to `true` |
> | `spec.metadata.caCertPath` | The certificate chain path for validating the broker |

1. Save the following yaml, which contains the component definitions, to a file named `components.yaml`:

    ```yml
    # Pub/sub component
    apiVersion: dapr.io/v1alpha1
    kind: Component
    metadata:
      name: aio-mq-pubsub
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
        value: "/certs/aio-mq-ca-cert/ca.pem"
    ---
    # State Management component
    apiVersion: dapr.io/v1alpha1
    kind: Component
    metadata:
      name: aio-mq-statestore
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
        value: "/certs/aio-mq-ca-cert/ca.pem"
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

### Set up authentication between the workload and MQ

Your application can authenticate to MQ using any of the [supported authentication methods](../manage-mqtt-connectivity/howto-configure-authentication.md). Make sure to enable authentication on the broker listener as well. The following example uses SAT, so to begin, you create a Kubernetes service account.

1. Create a Kubernetes service account:

    ```bash
    kubectl create serviceaccount mqtt-client
    ```

1. Ensure that the service account `mqtt-client` has an [authorization attribute](../manage-mqtt-connectivity/howto-configure-authentication.md#create-a-service-account):

    ```bash
    kubectl annotate serviceaccount mqtt-client aio-mq-broker-auth/group=dapr-workload
    ```

1. Create a ConfigMap containing the CA certificate chain used to valid the MQTT broker:

    ```bash
    kubectl create configmap aio-mq-ca-cert-chain --from-file ca.pem=chain.pem
    ```

    > [!IMPORTANT]
    > The certificate chain (chain.pem above) is created when setting up the MQTT broker. See [configure TLS with manual certificate management](../manage-mqtt-connectivity/howto-configure-tls-manual.md) or [configure TLS with automatic certificate management](../manage-mqtt-connectivity/howto-configure-tls-auto.md).

## Set up authorization policy between the workload and MQ

To configure authorization policies to Azure IoT MQ, first you create a [BrokerAuthorization resource](../manage-mqtt-connectivity/howto-configure-authorization.md). 

> [!TIP]
> If Broker Authorization is not enabled on this cluster, you can skip this section as the applications will have access to allow MQTT topics.

To create the yaml file, use the following component definitions:

> [!div class="mx-tdBreakAll"]
> | Component                     | Description                           |
> | ----------------------------- | ------------------------------------- |
> | `dapr-workload`  | The Dapr application authorization attribute, a client id or username is not required due to [SAT annotations](../manage-mqtt-connectivity/howto-configure-authentication.md).        |
> | `odd-numbered-orders`   | The Dapr application publishes to this topic which is saved to the MQ state store.        |
> | `response_topic`   |  The response topic for the MQ state store.       |

1. Save the following yaml, which contains the component definitions, to a file named `aio-mq-authz.yaml`. 

    ```yml
    apiVersion: mq.iotoperations.azure.com/v1beta1
    kind: BrokerAuthorization
    metadata:
      name: my-authz-policies
      namespace: azure-iot-operations
    spec:
      listenerRef:
        - my-listener # change to match your listener name as needed
      authorizationPolicies:
        enableCache: false
        rules:
          - principals:
              attributes:
                - group: dapr-workload
            brokerResources:
              - method: Connect
              - method: Publish
                topics:
                  - "odd-numbered-orders"
                  - "$services/statestore/#"
              - method: Subscribe
                topics:
                  - "clients/{principal.clientId}/services/statestore/#"
                  - "orders"
          - principals:
              clientids:
                - "publisher"
            brokerResources:
              - method: Connect
              - method: Publish
                topics:
                  - "orders"
          - principals:
              clientids:
                - "client"
            brokerResources:
              - method: Connect
              - method: Subscribe
                topics:
                  - "#"                                           
    ```

1. Apply the broker authorization yaml to the cluster:

    ```bash
    kubectl apply -f aio-mq-authz.yaml
    ```

## Creating a Dapr application

> [!TIP]
> For convenience, we have published a quickstart sample to a container registry at `ghcr.io/azure-samples/explore-iot-operations/quickstart-sample`. You can use this container to follow along even if you haven't built your own image and you can view the [source code here](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/dapr-quickstart-go).

### Building the application

The first step is to write an application that uses the Dapr SDK to publish/subscribe or do state management. 

* Dapr [Publish and Subscribe quickstart](https://docs.dapr.io/getting-started/quickstarts/pubsub-quickstart/)
* Dapr [State Management quickstart](https://docs.dapr.io/getting-started/quickstarts/statemanagement-quickstart/)

This article uses the same code used for [MQ to develop distributed application workloads](howto-develop-mqttnet-apps.md). This sample is a Dapr workload that subscribes to a topic, gets the message, then publishes it back to another topic. The Dapr workload also uses the state store to store information from the messages.

### Package the application

After you have the Dapr application written, build it and package into a Docker container.

1. To package the application into a container, run the following command:

    ```bash
    cd /path/to/app/src
    docker build -t my-dapr-app .
    ```

2. Push it to your Container Registry.

## Deploy a Dapr application

At this point you can deploy the Dapr application. When you register the components, that doesn't deploy the associated binary that's packaged in a container. You need to do that along with your application. To do this, you can use a [Pod](https://kubernetes.io/docs/concepts/workloads/pods/) to group the containerized Dapr application and the two components together.

To start, you create a yaml file that uses the following component definitions:

> [!div class="mx-tdBreakAll"]
> | Component                     | Description                           |
> | ----------------------------- | ------------------------------------- |
> | `dapr-components-sockets`  | Referenced several times, which facilitates the communication between all parties.       |
> | `odd-numbered-orders`   | The Dapr application publishes to this topic which is saved to the MQ state store.        |

1. Save the following yaml to a file named `dapr-app.yaml`:

    ```yml
    # This is the user application that references the registered components
    apiVersion: v1
    kind: Pod
    metadata:
      name: dapr-workload
      annotations:
        dapr.io/enabled: "true"
        dapr.io/unix-domain-socket-path: "/tmp/dapr-components-sockets"
        dapr.io/app-id: "dapr-workload"
        dapr.io/app-port: "6001"      # Required for
        dapr.io/app-protocol: "http"  # Subscriber clients
    spec:
      serviceAccountName: mqtt-client

      volumes:
        - name: dapr-unix-domain-socket
          emptyDir: {}

        # SAT token used to authenticate between Dapr and the MQTT broker
        - name: mqtt-client-token
          projected:
            sources:
              - serviceAccountToken:
                  path: mqtt-client-token
                  audience: aio-mq-dmqtt
                  expirationSeconds: 86400

        # Certificate chain for Dapr to validate the MQTT broker
        - name: aio-mq-ca-cert-chain
          configMap:
            name: aio-mq-ca-cert-chain

      containers:
        # Container for the dapr quickstart application 
        - name: dapr-workload
          image: ghcr.io/azure-samples/explore-iot-operations/quickstart-sample:latest
    
        # Container for the Pub/sub component
        - name: aio-mq-pubsub-pluggable
          image: mcr.microsoft.com/azureiotoperations/dapr/mq-pubsub:0.1.0-preview
          volumeMounts:
            - name: dapr-unix-domain-socket
              mountPath: /tmp/dapr-components-sockets
            - name: mqtt-client-token
              mountPath: /var/run/secrets/tokens
            - name: aio-mq-ca-cert-chain
              mountPath: /certs/aio-mq-ca-cert/
    
        # Container for the State Management component
        - name: aio-mq-statestore-pluggable
          image: mcr.microsoft.com/azureiotoperations/dapr/mq-statestore:0.1.0-preview
          volumeMounts:
            - name: dapr-unix-domain-socket
              mountPath: /tmp/dapr-components-sockets
            - name: mqtt-client-token
              mountPath: /var/run/secrets/tokens
            - name: aio-mq-ca-cert-chain
              mountPath: /certs/aio-mq-ca-cert/
    ```

2. Deploy the component by running the following command:

    ```bash
    kubectl apply -f dapr-app.yaml
    kubectl get pods -w
    ```

    The workload pod should report all pods running after a short interval, as shown in the following example output:

    ```output
    pod/dapr-workload created
    NAME                          READY   STATUS              RESTARTS   AGE
    ...
    dapr-workload                 4/4     Running             0          30s
    ```

    
## Verify the Dapr application works

In the example used for this article, the application subscribes to the `orders` topic and watches for odd number orders, then republishes them to the `odd-number-orders` topic. The simplest way to verify that the application works is to use a `mosquitto` client to publish an odd number order and see if it's republished as expected.

1. To start a subscriber in the odd number orders topic, run the following command and leave it running in your terminal:

    ```bash
    mosquitto_sub -h localhost -i "client" -t "odd-numbered-orders"
    ```

1. In a new terminal window, publish one message with an odd number order (9) to the orders topic, as shown in the following command:

    ```bash
    mosquitto_pub -h localhost -i "publisher" -t "orders" -m '{"data": "{\"orderId\": 9, \"item\": \"item9\"}"}'
    ```

    This will publish the following json to the `orders` topic:

    ```json
    {
      "data": "{\"orderId\": 9, \"item\": \"item9\"}"
    }
    ```

1. Back in the subscriber window, the message appears alongside Dapr tracing info:

    ```json
    {
      "data": {
        "item": "item9",
        "orderId": 9
      },
      "datacontenttype": "application/json",
      "id": "9d7087e1-2f13-4655-b402-f92062ffb08a",
      "pubsubname": "aio-mq-pubsub",
      "source": "dapr-workload",
      "specversion": "1.0",
      "time": "2023-02-01T22:27:24Z",
      "topic": "odd-numbered-orders",
      "traceid": "00-00000000000000000000000000000000-0000000000000000-00",
      "traceparent": "00-00000000000000000000000000000000-0000000000000000-00",
      "tracestate": "",
      "type": "com.dapr.event.sent"
    }
    ```

## Troubleshooting

If the application doesn't start or you see the pods in `CrashLoopBackoff`, the logs for `daprd` are most helpful. The `daprd` is a container that's automatically deployed with your Dapr application.

Run the following command to view the logs:

```bash
kubectl logs dapr-workload daprd
```

## Related content

- [Develop highly available applications](concept-about-distributed-apps.md)
