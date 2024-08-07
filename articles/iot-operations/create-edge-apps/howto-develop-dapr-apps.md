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

The following [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) definition contains volumes for SAT authentication and TLS certificate chain, as well as utilizing Dapr sidecar injection to automatically add the pluggable components to the Pod.

The following definition components will typically require customization to your specific application:

> | Component | Description |
> |-|-|
> | `template:metadata:annotations:dapr.io/inject-pluggable-components` | Allows the IoT Operations pluggable components to be [automatically injected](https://docs.dapr.io/operations/components/pluggable-components-registration/) into the pod |
> | `template:metadata:annotations:dapr.io/app-port` | Tells Dapr which port your application is listening on. If your application us not using this feature (such as a pubsub subscription), then remove this line |
> | `volumes:mqtt-client-token` | The System Authentication Token used for authenticating the Dapr pluggable components with the MQTT broker |
> | `volumes:aio-ca-trust-bundle` | The chain of trust to validate the MQTT broker TLS cert. This defaults to the test certificate deployed with Azure IoT Operations |
> | `containers:mq-dapr-app` | The Dapr application container you want to deploy |

> [!CAUTION]
> If your Dapr application is not listening for traffic from the Dapr sidecar, then remove the `dapr.io/app-port` and `dapr.io/app-protocol` [annotations](https://docs.dapr.io/reference/arguments-annotations-overview/) otherwise the Dapr sidecar will fail to initialize.

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
      name: my-dapr-app
      namespace: azure-iot-operations
    spec:
      selector:
        matchLabels:
          app: my-dapr-app
      template:
        metadata:
          labels:
            app: my-dapr-app
          annotations:
            dapr.io/enabled: "true"
            dapr.io/inject-pluggable-components: "true"
            dapr.io/app-id: "my-dapr-app"
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

    The pod should report 3 containers running after a short interval, as shown in the following example output:

    ```output
    NAME                          READY   STATUS              RESTARTS   AGE
    ...
    my-dapr-app                   3/3     Running             0          30s
    ```

## Troubleshooting

If the application doesn't start or you see the containers in `CrashLoopBackoff`, the logs for the `daprd` container often contains useful information.

Run the following command to view the logs for the daprd component:

```bash
kubectl logs -l app=my-dapr-app -c daprd
```

## Next steps

Now that you know how to develop a Dapr application, you can run through the tutorial to [Build an event-driven app with Dapr](tutorial-event-driven-with-dapr.md).
