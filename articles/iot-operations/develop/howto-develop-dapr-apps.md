---
title: Use Dapr to develop distributed application workloads
# titleSuffix: Azure IoT MQ
description: Develop distributed applications that talk with Azure IoT MQ using Dapr.
author: timlt
ms.author: timlt
# ms.subservice: mq
ms.topic: how-to 
ms.date: 10/24/2023

# CustomerIntent: As an developer, I want to understand how to use Dapr to develop distributed apps that talk with Azure IoT MQ.
---

# Use Dapr to develop distributed application workloads

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

The Distributed Application Runtime (Dapr) is a portable, serverless, event-driven runtime that simplifies the process of building distributed application. Dapr enables developers to build stateful or stateless apps without worrying about how the building blocks function. Dapr provides several [building blocks](https://docs.dapr.io/developing-applications/building-blocks/): state management, service invocation, actors, pub/sub, and more.  Azure IoT MQ Preview supports two of these building blocks:

1. Pub/sub, powered by the MQ distributed MQTT broker
2. State management, powered by the [MQ state store](concept-about-state-store.md)

To use Dapr pluggable components, define all the components, then add pluggable component containers to your [deployments](https://docs.dapr.io/operations/components/pluggable-components-registration/). Then, the component listens to a Unix Domain Socket placed on the shared volume, and Dapr runtime connects with each socket and discovers all services from a given building block API that the component implements. Each deployment must have its own plug-able component defined. This guide shows you how to deploy an application using the Dapr SDK and E4K pluggable components.

## Features supported

The following features are supported for using Dapr:  

| Feature | Supported | Symbol |
|---------| :--------:| :----: |
| Component for pub sub | Supported | ✅ |
| Component for state management (concurrency*) | Supported | ✅ |
| [Pluggable components](https://docs.dapr.io/operations/components/pluggable-components-registration/) | Supported | ✅ |

> [!NOTE]
> *Concurrency is *strong consistency*. The MQTT broker modifies the state and then returns the success message.

## Set up Dapr components
The following steps show you how to install Dapr and the MQ plug-able components, and show how to create the required authorization tokens.

### Install Dapr

To install the Dapr runtime, use the following Helm command. You might have already installed the runtime if you used the provided Azure IoT Operations quickstart. 

```bash
helm repo add dapr https://dapr.github.io/helm-charts/
helm repo update
helm upgrade --install dapr dapr/dapr --version=1.11 --namespace dapr-system --create-namespace --wait
```

> [!IMPORTANT]
> **Dapr v1.12** is currently not supported.

### Register MQ's pluggable components
To register MQ's pluggable pub/sub and state management components, create the component manifest yaml, and apply it to your cluster. 

To create the yaml file, use the following component definitions:

> [!div class="mx-tdBreakAll"]
> | Component                     | Description                           |
> | ----------------------------- | ------------------------------------- |
> | `metadata.name` | The component name is important and is how [a Dapr application reaches the component](https://github.com/microsoft/e4k-playground/blob/0b9b8bc846c2567f840576ed5c6e17c469891877/samples/quickstart-sample/src/main.go#L42).  |
> | `spec.metadata.type`  | [The type of the component](https://docs.dapr.io/operations/components/pluggable-components-registration/#define-the-component), which must be declared exactly as shown. It tells Dapr what kind of component (`pubsub` or `state`) it is and which Unix socket to use.  |
> | `spec.metadata.url`   | The URL tells the component where the local MQ endpoint is. The shown value 1883 is MQ's default MQTT port.    |
> | `brokerAuthMethod` / `satTokenPath`   | For [Kubernetes SAT authentication to MQ](../administer/mq/howto-configure-authentication.md). This component is specific to this example. You could use another method like [X.509](../administer/mq/howto-configure-tls-auto.md) |

1. Save the following yaml, which contains the component definitions, to a file named `components.yaml`:

    ```yml
    # Pub/sub component
    apiVersion: dapr.io/v1alpha1
    kind: Component
    metadata:
      name: orderpubsub
    spec:
      type: pubsub.e4kmqtt-pluggable # Do not change
      version: v1
      metadata:
      - name: url
        value: "aio-mq-dmqtt-frontend:1883"
      - name: brokerAuthMethod
        value: "SAT"
      - name: satTokenPath
        value: "/var/run/secrets/tokens/mqtt-client-token"
    ---
    # State management component
    apiVersion: dapr.io/v1alpha1
    kind: Component
    metadata:
      name: statestore
    spec:
      type: state.e4kstatestore-pluggable # Do not change
      version: v1
      metadata:
      - name: url
        value: "aio-mq-dmqtt-frontend:1883"
      - name: brokerAuthMethod
        value: "SAT"
      - name: satTokenPath
        value: "/var/run/secrets/tokens/mqtt-client-token"
    ```

1. Apply the component yaml to your cluster by running the following command:

    ```console
    $ kubectl apply -f components.yaml
    
    component.dapr.io/orderpubsub created
    component.dapr.io/statestore created
    ```

1. Optionally, adjust the component MQTT configuration by configuring the yaml as in the following example. You can configure more parameters under `spec.metadata`.

    ```yml
    spec:
      metadata:
      - name: clientId
        value: "my-client"
      - name: qos
        value: 1
      - name: retain
        value: "false"
      - name: cleanSession
        value: "true"
      - name: backOffMaxRetries
        value: "0"
      - name: keepAlive
        value: "300"
    ```


### Set up authentication between the workload and MQ
Your application can authenticate to MQ using any of the [supported authentication methods](../administer/mq/howto-configure-authentication.md). Make sure to enable authentication on the broker listener as well. The following example uses SAT, so to begin, you create a Kubernetes service account.

1. Create a Kubernetes service account:

    ```console
    $ kubectl create serviceaccount mqtt-client
    
    serviceaccount/mqtt-client created
    ```

1. Ensure that the service account `mqtt-client` has an [authorization attribute](../administer/mq/howto-configure-authentication.md#create-a-service-account):

    ```console
    $ kubectl annotate serviceaccount mqtt-client azedge-broker-auth/group=dapr-workload
    
    serviceaccount/mqtt-client annotated
    ```

## Set up authorization policy between the workload and MQ
To configure authorization policies to the MQ DMQTT broker, first you create a [BrokerAuthorization resource](../administer/mq/howto-configure-authorization.md). 

To create the yaml file, use the following component definitions:


> [!div class="mx-tdBreakAll"]
> | Component                     | Description                           |
> | ----------------------------- | ------------------------------------- |
> | `dapr-workload`  | The Dapr application authorization attribute, a client id or username is not required due to [SAT annotations](../administer/mq/howto-configure-authentication.md).        |
> | `odd-numbered-orders`   | The Dapr application publishes to this topic which is saved to the [MQ state store](concept-about-state-store.md).        |
> | `response_topic`   |  The response topic for the MQ state store.       |

1. Save the following yaml, which contains the component definitions, to a file named `e4k-authz.yaml`. 

    ```yml
    apiVersion: mq.iotoperations.azure.com/v1alpha4
    kind: BrokerAuthorization
    metadata:
      name: "my-authz-policies"
      namespace: {{% namespace %}}
    spec:
      listenerRef:
        - "az-mqtt-non-tls-listener"
      authorizationPolicies:
        enableCache: false
        rules:
          - principals:
              attributes:
                - group: "dapr-workload"
            brokerResources:
              - method: Connect
              - method: Publish
                topics:
                  - "odd-numbered-orders"
                  - "$store/{principal.clientId}/#"
              - method: Subscribe
                topics:
                  - "response_topic/{principal.clientId}/#"
                  - "orders"
          - principals:
              clientids:
                - "publisher1"
            brokerResources:
              - method: Connect
              - method: Publish
                topics:
                  - "orders"              
          - principals:
              clientids:
                - "client2"
            brokerResources:
              - method: Connect
              - method: Subscribe
                topics:
                  - "#"                                           
    ```

1. Deploy the broker authorization yaml to the cluster:

    ```bash
    kubectl apply -f e4k-authz.yaml
    ```

## Create a Dapr application
The first step is to write an application that uses the Dapr SDK to publish/subscribe or do state management. As an example, you can use the Dapr quickstart content:

* Dapr [pub/sub quickstart](https://docs.dapr.io/getting-started/quickstarts/pubsub-quickstart/)
* Dapr [state management quickstart](https://docs.dapr.io/getting-started/quickstarts/statemanagement-quickstart/)

This article uses the same code used for [MQ to develop distributed application workloads](howto-develop-mqttnet-apps.md). This sample is a Dapr workload that subscribes to a topic, gets the message, then publishes it back to another topic. The Dapr workload also uses the state store to store information from the messages.

## Package the application into a container
After you have the Dapr application written, build it and package into a Docker container.

To package the application into a container, run the following command:

```bash
cd /path/to/app/src
docker build -t my-dapr-app .
# Push it to docker hub or Azure Container Registry
```

> [!TIP]
> For convenience, the code sample mentioned in this section is packaged and published to a container registry at `alicesprings.azurecr.io/quickstart-sample`.  You can use this container to follow along even if you haven't built your own image.

## Deploy a Dapr application
At this point, both the pub/sub and the state management components are registered and you can deploy the Dapr application. When you register the components, that doesn't deploy the associated binary that's packaged in a container. You need to do that along with your application. To do this, you can use a [Pod](https://kubernetes.io/docs/concepts/workloads/pods/) to group the containerized Dapr application and the two components together.

To start, you create a yaml file that uses the following component definitions:


> [!div class="mx-tdBreakAll"]
> | Component                     | Description                           |
> | ----------------------------- | ------------------------------------- |
> | `dapr-components-sockets`  | Referenced several times, which facilitates the communication between all parties.       |
> | `odd-numbered-orders`   | The Dapr application publishes to this topic which is saved to the [MQ state store](concept-about-state-store.md).        |
> | `mqtt-client`   |  Lines containing this deal with SAT authentication which aren't strictly mandatory if a different authentication method is chosen.       |

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
        - name: mqtt-client-token
          projected:
            sources:
              - serviceAccountToken:
                  path: mqtt-client-token
                  audience: azedge-dmqtt
                  expirationSeconds: 86400
      containers:
        # The custom dapr application 
        - name: dapr-workload
          image: alicesprings.azurecr.io/quickstart-sample:latest
    
        # Container for the pub/sub component
        - name: e4kmqtt-pluggable
          image: alicesprings.azurecr.io/dapr/mqtte4k-pubsub:latest
          volumeMounts:
            - name: dapr-unix-domain-socket
              mountPath: /tmp/dapr-components-sockets
            - name: mqtt-client-token
              mountPath: /var/run/secrets/tokens
    
        # Container for the state management component
        - name: e4kstatestore-pluggable
          image: alicesprings.azurecr.io/dapr/e4k-statestore:latest
          volumeMounts:
            - name: dapr-unix-domain-socket
              mountPath: /tmp/dapr-components-sockets
            - name: mqtt-client-token
              mountPath: /var/run/secrets/tokens
    ```

2. Deploy the component by running the following command:

    ```bash
    kubectl apply -f dapr-app.yaml
    kubectl get pods -w
    ```

    The workload pod should report all pods running after a short interval, as shown in the following example output:

    ```console
    pod/dapr-workload created
    NAME                          READY   STATUS              RESTARTS   AGE
    ...
    dapr-workload                 4/4     Running             0          19s
    ```

    
## Verify the Dapr application works
In the example used for this article, the application subscribes to the `orders` topic and watches for odd number orders, then republishes them to the `odd-number-orders` topic. The simplest way to verify that the application works is to use a `mosquitto` client to publish an odd number order and see if it's republished as expected.

1. To start a subscriber in the odd number orders topic, run the following command and leave it running in your terminal:

    ```bash
    mosquitto_sub -h localhost -t "odd-numbered-orders" -u client2 -P password2 -i client2
    ```

1. In a new terminal window, publish one message with an odd number order (9) to the orders topic, as shown in the following command:

    ```bash
    mosquitto_pub -h localhost -t "orders" -m '{"data": "{\"orderId\": 9, \"item\": \"item9\"}"}' -i "publisher1" -u client1 -P password
    ```

Back in the subscriber window, the message appears alongside Dapr tracing info.

```json
{
  "data": {
    "item": "item9",
    "orderId": 9
  },
  "datacontenttype": "application/json",
  "id": "9d7087e1-2f13-4655-b402-f92062ffb08a",
  "pubsubname": "orderpubsub",
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

- [What is the Azure IoT MQ state store](concept-about-state-store.md)
