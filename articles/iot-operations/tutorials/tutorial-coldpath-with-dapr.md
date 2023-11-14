---
title: Create a telemetry coldpath with Dapr
# titleSuffix: Azure IoT MQ
description: Learn how to create a Dapr application that aggregates data and publishing on another topic
author: PatAltimore
ms.author: patricka
ms.topic: tutorial
ms.date: 11/13/2023

#CustomerIntent: As an operator, I want to configure IoT MQ to bridge to Azure Event Grid MQTT broker PaaS so that I can process my IoT data at the edge and in the cloud.
---

# Tutorial: Create a Telemetry Coldpath with Dapr

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this tutorial, you will learn how to subscribe to sensor data on an MQTT topic, and aggregate the data in a sliding window to then publish to a new topic.

The Dapr application in this tutorial is stateless, and will use the Distributed State Store to cache historical data used for the sliding window calculations.

The application subscribes to the topic `sensor/data` for incoming sensor data, and then publishes to `sensor/window_data` every 60 seconds.

## Prerequisites

1. [Deploy Azure IoT Operations](../get-started/quickstart-deploy.md)
1. [Setup Dapr and MQ Pluggable Components](../develop/howto-develop-dapr-apps.md)
1. [Docker](https://docs.docker.com/engine/install/) - for building the application container
1. A Container registry - for hosting the application container

## Creating the Dapr application

> [!TIP]
> For convenience, a pre-built application container is available in the container registry `ghcr.io/azure-samples/explore-iot-operations/mq-coldpath-dapr`. You can use this container to follow along if you haven't built your own.

### Building the container

The following steps will clone the GitHub repository containing the sample and then use docker to build the container:

1. Clone the [Explore IoT Operations github](https://github.com/Azure-Samples/explore-iot-operations)

    ```bash
    git clone https://github.com/Azure-Samples/explore-iot-operations
    ```

1. Change to the Dapr sample directory and build the image

    ```bash
    cd explore-iot-operations/tutorials/mq-coldpath-dapr
    docker build docker build . -t mq-coldpath-dapr
    ```

### Push to container registry

To consume the application in your Kubernetes cluster, you will need to push this to a container registry such as the [Azure Container Registry](https://learn.microsoft.com/azure/container-registry/container-registry-get-started-docker-cli). You could also push to a local container registry such as [minikube](https://minikube.sigs.k8s.io/docs/handbook/registry/) or [Docker](https://hub.docker.com/_/registry).

> | Component | Description |
> |-|-|
> | `container-alias` | The image alias containing the fully qualified path to your registry |

```bash
docker tag mq-coldpath-dapr {container-alias}
docker push {container-alias}
```

## Deploy a Dapr application

At this point you can deploy the Dapr application. When you register the components, that doesn't deploy the associated binary that's packaged in a container. You need to do that along with your application. To do this, you can use a Deployment to group the containerized Dapr application and the two components together.

To start, you create a yaml file that uses the following component definitions:

> | Component | Description |
> |-|-|
> | `volumes.dapr-unit-domain-socket` | The socket file used to communicate with the Dapr sidecar |
> | `volumes.mqtt-client-token` | The SAT used for authenticating the Dapr pluggable components with the MQTT broker |
> | `volumes.aio-mq-ca-cert-chain` | The chain of trust to validate the MQTT broker TLS cert |
> | `containers.dapr-app` | The pre-built coldpath container image. **Replace this with your own image if desired**. | 

1. Save the following deployment yaml to a file named `dapr-app.yaml`:

    ```yml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: mq-dapr-coldpath
      namespace: azure-iot-operations
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: mq-dapr-coldpath
      template:
        metadata:
          labels:
            app: mq-dapr-coldpath
          annotations:
            dapr.io/enabled: "true"
            dapr.io/unix-domain-socket-path: "/tmp/dapr-components-sockets"
            dapr.io/app-id: "mq-dapr-coldpath"
            dapr.io/app-port: "6001"
            dapr.io/app-protocol: "grpc"        
        spec:
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
          - name: mq-dapr-coldpath
            image: ghcr.io/azure-samples/explore-iot-operations/mq-coldpath-dapr:latest
            imagePullPolicy: Never

          # Container for the Pub/sub component
          - name: aio-mq-pubsub-pluggable
            image: ghcr.io/azure/iot-mq-dapr-components/pubsub:latest
            volumeMounts:
            - name: dapr-unix-domain-socket
              mountPath: /tmp/dapr-components-sockets
            - name: mqtt-client-token
              mountPath: /var/run/secrets/tokens
            - name: aio-mq-ca-cert-chain
              mountPath: /certs/aio-mq-ca-cert/
          
          # Container for the State Management component
          - name: aio-mq-statestore-pluggable
            image: ghcr.io/azure/iot-mq-dapr-components/statestore:latest
            volumeMounts:
            - name: dapr-unix-domain-socket
              mountPath: /tmp/dapr-components-sockets
            - name: mqtt-client-token
              mountPath: /var/run/secrets/tokens
            - name: aio-mq-ca-cert-chain
              mountPath: /certs/aio-mq-ca-cert/
    ```

1. Deploy the application by running the following command:

    ```bash
    kubectl apply -f app.yaml
    ```

1. Check the application has deployed successfully. The pod should report all containers are ready after a short interval, as shown below:

    ```bash
    kubectl get pods -w
    ```

    Expecting the following output:

    ```output
    pod/dapr-workload created
    NAME                          READY   STATUS              RESTARTS   AGE
    ...
    dapr-workload                 4/4     Running             0          30s
    ```


## Deploy the simulator

The repository contains a deployment for a simulator which will generate sensor data to the `sensor/data` topic.

1. Deploy the simulator:

    ```bash
    kubectl apply -f simulate-data.yaml
    ```

1. Confirm the simulator is running:

    ```bash
    kubectl logs deployment/mqtt-publisher-deployment -f 
    ```

    Expecting the following output:

    ```output
    Get:1 http://deb.debian.org/debian stable InRelease [151 kB]
    Get:2 http://deb.debian.org/debian stable-updates InRelease [52.1 kB]
    Get:3 http://deb.debian.org/debian-security stable-security InRelease [48.0 kB]
    Get:4 http://deb.debian.org/debian stable/main amd64 Packages [8780 kB]
    Get:5 http://deb.debian.org/debian stable-updates/main amd64 Packages [6668 B]
    Get:6 http://deb.debian.org/debian-security stable-security/main amd64 Packages [101 kB]
    Fetched 9139 kB in 3s (3570 kB/s)
    ...
    Messages published in the last 10 seconds: 10
    Messages published in the last 10 seconds: 10
    Messages published in the last 10 seconds: 10
    ```

## Verify the Dapr application works

1. Deploy the simulator

In the example used for this article, the application subscribes to the `orders` topic and watches for odd number orders, then republishes them to the `odd-number-orders` topic. The simplest way to verify that the application works is to use a `mosquitto` client to publish an odd number order and see if it's republished as expected.

1. Subscribe to the `sensor/window_data` topic to see the output from the Dapr application:

    ```bash
    mosquitto_sub -h localhost -p 8883 -t "sensor/window_data" --insecure
    ```

1. Verify the application is outputting a sliding windows calculation for the various sensors:

    ```output
    {"data":"{\"temperature\": {\"min\": 551.439, \"max\": 598.551, \"mean\": 573.713, \"median\": 572.7139999999999, \"count\": 6}, \"pressure\": {\"min\": 290.288, \"max\": 299.71, \"mean\": 294.7425, \"median\": 294.5425, \"count\": 6}, \"vibration\": {\"min\": 0.00111508, \"max\": 0.00488408, \"mean\": 0.00289702, \"median\": 0.002817095, \"count\": 6}}","datacontenttype":"text/plain","id":"994d6b8a-978c-42a3-9460-6b4285122d52","pubsubname":"aio-mq-pubsub","source":"mq-dapr-coldpath","specversion":"1.0","time":"2023-11-14T01:07:36Z","topic":"sensor/window_data","traceid":"00-00000000000000000000000000000000-0000000000000000-00","traceparent":"00-00000000000000000000000000000000-0000000000000000-00","tracestate":"","type":"com.dapr.event.sent"}
    ```

## Troubleshooting

If the application doesn't start or you see the pods in `CrashLoopBackoff`, the logs for `daprd` are most helpful. The `daprd` is a container that's automatically deployed with your Dapr application.

Run the following command to view the logs:

```bash
kubectl logs dapr-workload daprd
```

## Related content

- [Develop highly available applications](concept-about-distributed-apps.md)
