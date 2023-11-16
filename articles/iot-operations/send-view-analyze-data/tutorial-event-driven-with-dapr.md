---
title: Build event-driven apps with Dapr
# titleSuffix: Azure IoT MQ
description: Learn how to create a Dapr application that aggregates data and publishing on another topic
author: timlt
ms.author: timlt
ms.topic: tutorial
ms.date: 11/13/2023

#CustomerIntent: As an operator, I want to configure IoT MQ to bridge to Azure Event Grid MQTT broker PaaS so that I can process my IoT data at the edge and in the cloud.
---

# Build event-driven apps with Dapr

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this walkthrough, you deploy a Dapr application to the cluster. The Dapr application will consume simulated MQTT data published to Azure IoT MQ, apply a windowing function and then publish the result back to IoT MQ. This represents how high volume data can be aggregated on the edge to reduce message frequency and size. The Dapr application is stateless, and uses the IoT MQ state store to cache past values needed for the window calculations.

The Dapr application performs the following steps:

* Subscribes to the `sensor/data` topic for sensor data.
* When receiving data on this topic, it's pushed to the Azure IoT MQ state store.
* Every **10 seconds**, it fetches the data from the state store, and performs and calculates the *min*, *max*, *mean*, *median* and *75th percentile* values on sensor data timestamped in the last **30 seconds**.
* Data older than **30 seconds** is expired from the state store.
* The result is published to the `sensor/window_data` topic in JSON format.

> [!NOTE]
> This tutorial [disables Dapr CloudEvents](https://docs.dapr.io/developing-applications/building-blocks/pubsub/pubsub-raw/) which enables it to publish and subscribe using raw MQTT.

## Prerequisites

* Azure IoT Operations installed - [Deploy Azure IoT Operations](../get-started/quickstart-deploy.md)
* Dapr runtime and MQ's pluggable components installed - [Use Dapr to develop distributed application workloads](../develop/howto-develop-dapr-apps.md)

## Deploy the Dapr application

At this point, you can deploy the Dapr application. When you register the components, that doesn't deploy the associated binary that is packaged in a container. To deploy the binary along with your application, you can use a Deployment to group the containerized Dapr application and the two components together.

To start, create a yaml file that uses the following definitions:

| Component | Description |
|-|-|
| `volumes.dapr-unit-domain-socket` | The socket file used to communicate with the Dapr sidecar |
| `volumes.mqtt-client-token` | The SAT used for authenticating the Dapr pluggable components with the MQ broker and State Store |
| `volumes.aio-mq-ca-cert-chain` | The chain of trust to validate the MQTT broker TLS cert |
| `containers.mq-event-driven` | The prebuilt dapr application container. | 

1. Save the following deployment yaml to a file named `app.yaml`:

    ```yml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: mq-event-driven-dapr
      namespace: azure-iot-operations
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: mq-event-driven-dapr
      template:
        metadata:
          labels:
            app: mq-event-driven-dapr
          annotations:
            dapr.io/enabled: "true"
            dapr.io/unix-domain-socket-path: "/tmp/dapr-components-sockets"
            dapr.io/app-id: "mq-event-driven-dapr"
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
                    audience: aio-mq
                    expirationSeconds: 86400

          # Certificate chain for Dapr to validate the MQTT broker
          - name: aio-ca-trust-bundle
            configMap:
              name: aio-ca-trust-bundle-test-only

          containers:
          # Container for the dapr quickstart application 
          - name: mq-event-driven-dapr
            image: ghcr.io/azure-samples/explore-iot-operations/mq-event-driven-dapr:latest

          # Container for the Pub/sub component
          - name: aio-mq-pubsub-pluggable
            image: ghcr.io/azure/iot-mq-dapr-components/pubsub:latest
            volumeMounts:
            - name: dapr-unix-domain-socket
              mountPath: /tmp/dapr-components-sockets
            - name: mqtt-client-token
              mountPath: /var/run/secrets/tokens
            - name: aio-ca-trust-bundle
              mountPath: /var/run/certs/aio-mq-ca-cert/

          # Container for the State Management component
          - name: aio-mq-statestore-pluggable
            image: ghcr.io/azure/iot-mq-dapr-components/statestore:latest
            volumeMounts:
            - name: dapr-unix-domain-socket
              mountPath: /tmp/dapr-components-sockets
            - name: mqtt-client-token
              mountPath: /var/run/secrets/tokens
            - name: aio-ca-trust-bundle
              mountPath: /var/run/certs/aio-mq-ca-cert/
    ```

1. Deploy the application by running the following command:

    ```bash
    kubectl apply -f app.yaml
    ```

1. Confirm that the application deployed successfully. The pod should report all containers are ready after a short interval, as shown with the following command:

    ```bash
    kubectl get pods -w
    ```

    With the following output:

    ```output
    pod/dapr-workload created
    NAME                          READY   STATUS              RESTARTS   AGE
    ...
    dapr-workload                 4/4     Running             0          30s
    ```


## Deploy the simulator

The repository contains a deployment for a simulator that generates sensor data to the `sensor/data` topic.

1. Deploy the simulator:

    ```bash
    kubectl apply -f ./yaml/simulate-data.yaml
    ```

1. Confirm the simulator is running:

    ```bash
    kubectl logs deployment/mqtt-publisher-deployment -f 
    ```

    With the following output:

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

## Deploy an MQTT client

To verify the MQTT bridge is working, deploy an MQTT client to the cluster. 

1. In a new file named `client.yaml`, specify the client deployment:

    ```yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: mqtt-client
      namespace: azure-iot-operations
    spec:
      serviceAccountName: mqtt-client
      containers:
      - image: alpine
        name: mqtt-client
        command: ["sh", "-c"]
        args: ["apk add mosquitto-clients mqttui && sleep infinity"]
        volumeMounts:
        - name: mqtt-client-token
          mountPath: /var/run/secrets/tokens
        - name: aio-ca-trust-bundle
          mountPath: /var/run/certs/aio-mq-ca-cert/
      volumes:
      - name: mqtt-client-token
        projected:
          sources:
          - serviceAccountToken:
              path: mqtt-client-token
              audience: aio-mq
              expirationSeconds: 86400
      - name: aio-ca-trust-bundle
        configMap:
          name: aio-ca-trust-bundle-test-only
    ```

1. Apply the deployment file with kubectl.

    ```bash
    kubectl apply -f client.yaml
    ```

    Verify output:

    ```output
    pod/mqtt-client created
    ```

## Verify the Dapr application output

1. Start a shell in the mosquitto client pod:

    ```bash
    kubectl exec --stdin --tty mqtt-client -n azure-iot-operations -- sh
    ```

1. Subscribe to the `sensor/window_data` topic to see the publish output from the Dapr application:

    ```bash
    mosquitto_sub -L mqtts://aio-mq-dmqtt-frontend/sensor/window_data -u '$sat' -P $(cat /var/run/secrets/tokens/mqtt-client-token) --cafile /var/run/certs/aio-mq-ca-cert/ca.crt 
    ```

1. Verify the application is outputting a sliding windows calculation for the various sensors:

    ```json
    {"timestamp": "2023-11-14T05:21:49.807684+00:00", "window_size": 30, "temperature": {"min": 551.805, "max": 599.746, "mean": 579.929, "median": 581.917, "75_per": 591.678, "count": 29}, "pressure": {"min": 290.361, "max": 299.949, "mean": 295.98575862068964, "median": 296.383, "75_per": 298.336, "count": 29}, "vibration": {"min": 0.00114438, "max": 0.00497965, "mean": 0.0033943155172413792, "median": 0.00355337, "75_per": 0.00433423, "count": 29}}
    ```

## Optional - Create the Dapr application

The above tutorial uses a prebuilt container of the Dapr application. If you would like to modify and build the code yourself, follow these steps:

### Prerequisites

1. [Docker](https://docs.docker.com/engine/install/) - for building the application container
1. A Container registry - for hosting the application container

### Build the application

1. Change to the Dapr tutorial directory in the [Explore IoT Operations](https://github.com/Azure-Samples/explore-iot-operations) repository:

    ```bash
    cd explore-iot-operations/tutorials/mq-event-driven-dapr/src
    ```

1. Build the docker image:

    ```bash
    docker build docker build . -t mq-event-driven-dapr
    ```

1. To consume the application in your Kubernetes cluster, you need to push the image to a container registry such as the [Azure Container Registry](/azure/container-registry/container-registry-get-started-docker-cli). You could also push to a local container registry such as [minikube](https://minikube.sigs.k8s.io/docs/handbook/registry/) or [Docker](https://hub.docker.com/_/registry).

    ```bash
    docker tag mq-event-driven-dapr <container-alias>
    docker push <container-alias>
    ```

1. Update your `app.yaml` to pull your newly created image.

## Troubleshooting

If the application doesn't start or you see the pods in `CrashLoopBackoff`, the logs for `daprd` are most helpful. The `daprd` is a container that is automatically deployed with your Dapr application.

Run the following command to view the logs:

```bash
kubectl logs dapr-workload daprd
```

## Next steps

* [Bridge MQTT data between IoT MQ and Azure Event Grid](tutorial-connect-event-grid.md)