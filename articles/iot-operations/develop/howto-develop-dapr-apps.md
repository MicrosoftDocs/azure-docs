---
title: Use Dapr to develop distributed application workloads
# titleSuffix: Azure IoT MQ
description: Develop distributed applications that talk with Azure IoT MQ using Dapr.
author: timlt
ms.author: timlt
ms.subservice: mq
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 11/14/2023

# CustomerIntent: As an developer, I want to understand how to use Dapr to develop distributed apps that talk with Azure IoT MQ.
---

# Use Dapr to develop distributed application workloads

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

The Distributed Application Runtime (Dapr) is a portable, serverless, event-driven runtime that simplifies the process of building distributed application. Dapr enables developers to build stateful or stateless apps without worrying about how the building blocks function. Dapr provides several [building blocks](https://docs.dapr.io/developing-applications/building-blocks/): state management, service invocation, actors, pub/sub, and more.  Azure IoT MQ Preview supports two of these building blocks:

- Publish and Subscribe, powered by [Azure IoT MQ MQTT broker](../manage-mqtt-connectivity/overview-iot-mq.md)
- State Management

To use Dapr pluggable components, define all the components, then add pluggable component containers to your [deployments](https://docs.dapr.io/operations/components/pluggable-components-registration/). The Dapr component listens to a Unix Domain Socket placed on the shared volume, and Dapr runtime connects with each socket and discovers all services from a given building block API that the component implements. Each deployment must have its own pluggable component defined. This guide shows you how to deploy an application using the Dapr SDK and IoT MQ pluggable components.

## Install Dapr runtime

To install the Dapr runtime, use the following Helm command. If you completed the provided Azure IoT Operations Preview [quickstart](../get-started/quickstart-deploy.md), you already installed the runtime.

```bash
helm repo add dapr https://dapr.github.io/helm-charts/
helm repo update
helm upgrade --install dapr dapr/dapr --version=1.11 --namespace dapr-system --create-namespace --wait
```

> [!IMPORTANT]
> **Dapr v1.12** is currently not supported.

## Register MQ's pluggable components

To register MQ's pluggable Pub/sub and State Management components, create the component manifest yaml, and apply it to your cluster. 

To create the yaml file, use the following component definitions:

> [!div class="mx-tdBreakAll"]
> | Component | Description |
> |-|-|
> | `metadata.name` | The component name is important and is how a Dapr application references the component. |
> | `spec.type` | [The type of the component](https://docs.dapr.io/operations/components/pluggable-components-registration/#define-the-component), which must be declared exactly as shown. It tells Dapr what kind of component (`pubsub` or `state`) it is and which Unix socket to use.  |
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
      - name: logLevel
        value: "Info"
    ---
    # State Management component
    apiVersion: dapr.io/v1alpha1
    kind: Component
    metadata:
      name: aio-mq-statestore
      namespace: azure-iot-operations
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
      - name: logLevel
        value: "Info"
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

## Set up authorization policy between the application and MQ

To configure authorization policies to Azure IoT MQ, first you create a [BrokerAuthorization resource](../manage-mqtt-connectivity/howto-configure-authorization.md). 

> [!NOTE]
> If Broker Authorization is not enabled on this cluster, you can skip this section as the applications will have access to all MQTT topics.

1. Annotate the service account `mqtt-client` with an [authorization attribute](../manage-mqtt-connectivity/howto-configure-authentication.md#create-a-service-account):

    ```bash
    kubectl annotate serviceaccount mqtt-client aio-mq-broker-auth/group=dapr-workload -n azure-iot-operations
    ```

1. Save the following yaml, which contains the BrokerAuthorization definition, to a file named `aio-mq-authz.yaml`. 

    Use the following definitions:

    > [!div class="mx-tdBreakAll"]
    > | Item | Description |
    > |-|-|
    > | `dapr-workload` | The Dapr application authorization attribute assigned to the service account |
    > | `topics` | Describe the topics required to communicate with the MQ State Store |

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
                  - "$services/statestore/#"
              - method: Subscribe
                topics:
                  - "clients/{principal.clientId}/services/statestore/#"
    ```

1. Apply the BrokerAuthorizaion definition to the cluster:

    ```bash
    kubectl apply -f aio-mq-authz.yaml
    ```

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

To deploy the Dapr application to your cluster, you can use either a Kubernetes [Pod](https://kubernetes.io/docs/concepts/workloads/pods/) or [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)

The following Pod definition defines the different volumes required to deploy the application along with the required containers.

To start, you create a yaml file that uses the following definitions:

> | Component | Description |
> |-|-|
> | `volumes.dapr-unix-domain-socket` | A shared directory to host unix domain sockets used to communicate between the Dapr sidecar and the pluggable components |
> | `volumes.mqtt-client-token` | The System Authentication Token used for authenticating the Dapr pluggable components with the IoT MQ broker |
> | `volumes.aio-ca-trust-bundle` | The chain of trust to validate the MQTT broker TLS cert. This defaults to the test certificate deployed with Azure IoT Operations |
> | `containers.mq-dapr-app` | The Dapr application container you want to deploy |

1. Save the following yaml to a file named `dapr-app.yaml`:

    ```yml
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
            dapr.io/unix-domain-socket-path: "/tmp/dapr-components-sockets"
            dapr.io/app-id: "mq-dapr-app"
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
          - name: mq-dapr-app
            image: <YOUR DAPR APPLICATION>

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

## Troubleshooting

If the application doesn't start or you see the pods in `CrashLoopBackoff`, the logs for `daprd` are most helpful. The `daprd` is a container that automatically deploys with your Dapr application.

Run the following command to view the logs:

```bash
kubectl logs dapr-workload daprd
```

## Related content

- [Develop highly available applications](concept-about-distributed-apps.md)
