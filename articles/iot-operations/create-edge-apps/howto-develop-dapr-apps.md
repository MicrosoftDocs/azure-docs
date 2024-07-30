---
title: Use Dapr to develop distributed applications
description: Develop distributed applications that talk with MQTT broker using Dapr.
author: PatAltimore 
ms.author: patricka 
ms.subservice: azure-mqtt-broker
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 07/02/2024

# CustomerIntent: As a developer, I want to understand how to use Dapr to develop distributed apps that talk with MQTT broker.
---

# Use Dapr to develop distributed application workloads that talk with MQTT broker

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

To use the MQTT broker Dapr pluggable components, deploy both the pub/sub and state store components in your application deployment along with your Dapr application. This guide shows you how to deploy an application using the Dapr SDK and MQTT broker pluggable components.

## Prerequisites

* Azure IoT Operations deployed - [Quickstart: Run Azure IoT Operations Preview in GitHub Codespaces with K3s](../get-started-end-to-end-sample/quickstart-deploy.md)
* MQTT broker Dapr Components deployed - [Deploy MQTT broker Dapr Components](./howto-deploy-dapr.md)

## Creating a Dapr application

### Building the application

The first step is to write an application that uses a Dapr SDK to publish/subscribe or do state management. 

* Dapr [Publish and Subscribe quickstart](https://docs.dapr.io/getting-started/quickstarts/pubsub-quickstart/)
* Dapr [State Management quickstart](https://docs.dapr.io/getting-started/quickstarts/statemanagement-quickstart/)

### Package the application

After you finish writing the Dapr application, build the container:

1. To package the application into a container, run the following command:

    ```bash
    docker build . -t my-dapr-app
    ```

1. Push it to your Container Registry of your choice, such as:

    * [Azure Container Registry](/azure/container-registry/)
    * [GitHub Packages](https://github.com/features/packages)
    * [Docker Hub](https://docs.docker.com/docker-hub/)

## Deploy a Dapr application

The following [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) definition contains the volumes required to deploy the application along with the required containers. This deployment utilizes the Dapr sidecar injector to automatically add the pluggable component pod.

The yaml contains both a ServiceAccount, used to generate SATs for authentication with MQTT broker and the Dapr application Deployment.

To create the yaml file, use the following definitions:

> | Component | Description |
> |-|-|
> | `volumes.mqtt-client-token` | The System Authentication Token used for authenticating the Dapr pluggable components with the MQTT broker |
> | `volumes.aio-ca-trust-bundle` | The chain of trust to validate the MQTT broker TLS cert. This defaults to the test certificate deployed with Azure IoT Operations |
> | `containers.mq-dapr-app` | The Dapr application container you want to deploy |

1. Save the following yaml to a file named `dapr-app.yaml`:

    ```yml
    apiVersion: v1
    kind: ServiceAccount
    metadata:
      name: dapr-client
      namespace: azure-iot-operations
      annotations:
        aio-mq-broker-auth/group: dapr-workload
    ---
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: mq-dapr-app
      namespace: azure-iot-operations
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: mq-dapr-app
      template:
        metadata:
          labels:
            app: mq-dapr-app
          annotations:
            dapr.io/enabled: "true"
            dapr.io/inject-pluggable-components: "true"
            dapr.io/app-id: "mq-dapr-app"
            dapr.io/app-port: "6001"
            dapr.io/app-protocol: "grpc"
        spec:
          serviceAccountName: dapr-client

          volumes:
          # SAT used to authenticate between Dapr and the MQTT broker
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
          # Container for the Dapr application 
          - name: mq-dapr-app
            image: <YOUR_DAPR_APPLICATION>
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
    dapr-workload                 3/3     Running             0          30s
    ```

## Troubleshooting

If the application doesn't start or you see the pods in `CrashLoopBackoff`, the logs for `daprd` are most helpful. The `daprd` is a container that automatically deploys with your Dapr application.

Run the following command to view the logs:

```bash
kubectl logs dapr-workload daprd
```

## Next steps

Now that you know how to develop a Dapr application, you can run through the tutorial to [Build an event-driven app with Dapr](tutorial-event-driven-with-dapr.md).
