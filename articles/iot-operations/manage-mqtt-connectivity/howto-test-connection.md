---
title: Test connectivity to IoT MQ with MQTT clients
description: Learn how to use common and standard MQTT tools to test connectivity to Azure IoT MQ in a nonproduction environment.
author: PatAltimore
ms.author: patricka
ms.subservice: mq
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 03/18/2024

#CustomerIntent: As an operator or developer, I want to test MQTT connectivity with tools that I'm already familiar with to know that I set up my Azure IoT MQ broker correctly.
---

# Test connectivity to Azure IoT MQ Preview with MQTT clients

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

This article shows different ways to test connectivity to Azure IoT MQ Preview with MQTT clients in a nonproduction environment.

By default, Azure IoT MQ Preview:

- Deploys a [TLS-enabled listener](howto-configure-brokerlistener.md) on port 8883 with *ClusterIp* as the service type. *ClusterIp* means that the broker is accessible only from within the Kubernetes cluster. To access the broker from outside the cluster, you must configure a service of type *LoadBalancer* or *NodePort*.

- Accepts [Kubernetes service accounts for authentication](howto-configure-authentication.md) for connections from within the cluster. To connect from outside the cluster, you must configure a different authentication method.

> [!CAUTION]
> For production scenarios, you should use TLS and service accounts authentication to secure your IoT solution. For more information, see:
> - [Configure TLS with automatic certificate management to secure MQTT communication in Azure IoT MQ Preview](./howto-configure-tls-auto.md)
> - [Configure authentication in Azure IoT MQ Preview](./howto-configure-authentication.md)
> - [Expose Kubernetes services to external devices](/azure/aks/hybrid/aks-edge-howto-expose-service) using port forwarding or a virtual switch with Azure Kubernetes Services Edge Essentials.

Before you begin, [install or deploy IoT Operations](../get-started/quickstart-deploy.md). Use the following options to test connectivity to IoT MQ with MQTT clients in a nonproduction environment.

## Connect from a pod within the cluster with default configuration

The first option is to connect from within the cluster. This option uses the default configuration and requires no extra updates. The following examples show how to connect from within the cluster using plain Alpine Linux and a commonly used MQTT client, using the service account and default root CA cert.

1. Create a file named `client.yaml` with the following configuration:

    ```yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: mqtt-client
      # Namespace must match IoT MQ BrokerListener's namespace
      # Otherwise use the long hostname: aio-mq-dmqtt-frontend.azure-iot-operations.svc.cluster.local
      namespace: azure-iot-operations
    spec:
      # Use the "mqtt-client" service account which comes with default deployment
      # Otherwise create it with `kubectl create serviceaccount mqtt-client -n azure-iot-operations`
      serviceAccountName: mqtt-client
      containers:
        # Mosquitto and mqttui on Alpine
      - image: alpine
        name: mqtt-client
        command: ["sh", "-c"]
        args: ["apk add mosquitto-clients mqttui && sleep infinity"]
        volumeMounts:
        - name: mq-sat
          mountPath: /var/run/secrets/tokens
        - name: trust-bundle
          mountPath: /var/run/certs
      volumes:
      - name: mq-sat
        projected:
          sources:
          - serviceAccountToken:
              path: mq-sat
              audience: aio-mq # Must match audience in BrokerAuthentication
              expirationSeconds: 86400
      - name: trust-bundle
        configMap:
          name: aio-ca-trust-bundle-test-only # Default root CA cert
    ```

1. Use `kubectl apply -f client.yaml` to deploy the configuration. It should only take a few seconds to start.

1. Once the pod is running, use `kubectl exec` to run commands inside the pod.

    For example, to publish a message to the broker, open a shell inside the pod:

    ```bash
    kubectl exec --stdin --tty mqtt-client --namespace azure-iot-operations -- sh
    ```

1. Inside the pod's shell, run the following command to publish a message to the broker:

    ```console
    mosquitto_pub --host aio-mq-dmqtt-frontend --port 8883 --message "hello" --topic "world" --username '$sat' --pw $(cat /var/run/secrets/tokens/mq-sat) --debug --cafile /var/run/certs/ca.crt
    ```

    The output should look similar to the following:

    ```Output    
    Client (null) sending CONNECT
    Client (null) received CONNACK (0)
    Client (null) sending PUBLISH (d0, q0, r0, m1, 'world', ... (5 bytes))
    Client (null) sending DISCONNECT
    ```

    The mosquitto client uses the service account token mounted at `/var/run/secrets/tokens/mq-sat` to authenticate with the broker. The token is valid for 24 hours. The client also uses the default root CA cert mounted at `/var/run/certs/ca.crt` to verify the broker's TLS certificate chain.

1. To subscribe to the topic, run the following command:

    ```console
    mosquitto_sub --host aio-mq-dmqtt-frontend --port 8883 --topic "world" --username '$sat' --pw $(cat /var/run/secrets/tokens/mq-sat) --debug --cafile /var/run/certs/ca.crt
    ```

    The output should look similar to the following:

    ```Output
    Client (null) sending CONNECT
    Client (null) received CONNACK (0)
    Client (null) sending SUBSCRIBE (Mid: 1, Topic: world, QoS: 0, Options: 0x00)
    Client (null) received SUBACK
    Subscribed (mid: 1): 0
    ```

    The mosquitto client uses the same service account token and root CA cert to authenticate with the broker and subscribe to the topic.

1. You can also use mqttui to connect to the broker using the service account token. The `--insecure` flag is required because mqttui doesn't support TLS certificate chain verification with a custom root CA cert.

    > [!CAUTION]
    > Using `--insecure` is not recommended for production scenarios. Only use it for testing or development purposes.

    ```console
    mqttui --broker mqtts://aio-mq-dmqtt-frontend:8883 --username '$sat' --password $(cat /var/run/secrets/tokens/mq-sat) --insecure
    ```

1. To remove the pod, run `kubectl delete pod mqtt-client -n azure-iot-operations`.

## Connect clients from outside the cluster to default the TLS port

### TLS trust chain

Since the broker uses TLS, the client must trust the broker's TLS certificate chain. You need to configure the client to trust the root CA certificate used by the broker.

To use the default root CA certificate, download it from the `aio-ca-trust-bundle-test-only` ConfigMap:

```bash
kubectl get configmap aio-ca-trust-bundle-test-only -n azure-iot-operations -o jsonpath='{.data.ca\.crt}' > ca.crt
```

Use the downloaded `ca.crt` file to configure your client to trust the broker's TLS certificate chain.

### Authenticate with the broker

By default, IoT MQ only accepts Kubernetes service accounts for authentication for connections from within the cluster. To connect from outside the cluster, you must configure a different authentication method like X.509 or username and password. For more information, see [Configure authentication](howto-configure-authentication.md).

#### Turn off authentication is for testing purposes only

To turn off authentication for testing purposes, edit the `BrokerListener` resource and set the `authenticationEnabled` field to `false`:

> [!CAUTION]
> Turning off authentication should only be used for testing purposes with a test cluster that's not accessible from the internet.

```bash
kubectl patch brokerlistener listener -n azure-iot-operations --type='json' -p='[{"op": "replace", "path": "/spec/authenticationEnabled", "value": false}]'
```

### Port connectivity

Some Kubernetes distributions can [expose](https://k3d.io/v5.1.0/usage/exposing_services/) IoT MQ to a port on the host system (localhost). You should use this approach because it makes it easier for clients on the same host to access IoT MQ. 

For example, to create a K3d cluster with mapping the IoT MQ's default MQTT port 8883 to localhost:8883:

```bash
k3d cluster create --port '8883:8883@loadbalancer'
```

But for this method to work with IoT MQ, you must configure it to use a load balancer instead of cluster IP. There are two ways to do this: create a load balancer or patch the existing default BrokerListener resource service type to load balancer.

#### Option 1: Create a load balancer

1. Create a file named `loadbalancer.yaml` with the following configuration:

    ```yaml
    apiVersion: v1
    kind: Service
    metadata:
        name: iotmq-public-svc
    spec:
        type: LoadBalancer
        ports:
        - name: mqtt1
          port: 8883
          targetPort: 8883
        selector:
          app: broker
          app.kubernetes.io/instance: broker
          app.kubernetes.io/managed-by: dmqtt-operator
          app.kubernetes.io/name: dmqtt
          tier: frontend
    ```

1. Apply the configuration to create a load balancer service:

    ```bash
    kubectl apply -f loadbalancer.yaml
    ```

#### Option 2: Patch the default load balancer

1. Edit the `BrokerListener` resource and change the `serviceType` field to `loadBalancer`.

    ```bash
    kubectl patch brokerlistener listener --namespace azure-iot-operations --type='json' --patch='[{"op": "replace", "path": "/spec/serviceType", "value": "loadBalancer"}]'
    ```

1. Wait for the service to be updated.

    ```console
    kubectl get service aio-mq-dmqtt-frontend --namespace azure-iot-operations
    ```

    Output should look similar to the following:

    ```Output
    NAME                    TYPE           CLUSTER-IP     EXTERNAL-IP   PORT(S)          AGE
    aio-mq-dmqtt-frontend   LoadBalancer   10.43.107.11   XXX.XX.X.X    8883:30366/TCP   14h
    ```

1. You can use the external IP address to connect to IoT MQ over the internet. Make sure to use the external IP address instead of `localhost`.

    ```bash
    mosquitto_pub --qos 1 --debug -h XXX.XX.X.X --message hello --topic world --username client1 --pw password --cafile ca.crt
    ```

> [!TIP]
> You can use the external IP address to connect to IoT MQ from outside the cluster. If you used the K3d command with port forwarding option, you can use `localhost` to connect to IoT MQ. For example, to connect with mosquitto client:
>
> ```bash
> mosquitto_pub --qos 1 --debug -h localhost --message hello --topic world --username client1 --pw password --cafile ca.crt --insecure
> ```
>
> In this example, the mosquitto client uses username and password to authenticate with the broker along with the root CA cert to verify the broker's TLS certificate chain. Here, the `--insecure` flag is required because the default TLS certificate issued to the load balancer is only valid for the load balancer's default service name (aio-mq-dmqtt-frontend) and assigned IPs, not localhost. 
> 
> Never expose IoT MQ port to the internet without authentication and TLS. Doing so is dangerous and can lead to unauthorized access to your IoT devices and bring unsolicited traffic to your cluster.
>
> For information on how to add localhost to the certificate's subject alternative name (SAN) to avoid using the insecure flag, see [Configure server certificate parameters](howto-configure-tls-auto.md#optional-configure-server-certificate-parameters).

#### Use port forwarding

With [minikube](https://minikube.sigs.k8s.io/docs/), [kind](https://kind.sigs.k8s.io/), and other cluster emulation systems, an external IP might not be automatically assigned. For example, it might show as *Pending* state. 

1. To access the broker, forward the broker listening port 8883 to the host.

    ```bash
    kubectl port-forward --namespace azure-iot-operations service/aio-mq-dmqtt-frontend 8883:mqtts-8883
    ```

1. Use 127.0.0.1 to connect to the broker at port 8883 with the same authentication and TLS configuration as the example without port forwarding.

Port forwarding is also useful for testing IoT MQ locally on your development machine without having to modify the broker's configuration.

To learn more, see [Use Port Forwarding to Access Applications in a Cluster](https://kubernetes.io/docs/tasks/access-application-cluster/port-forward-access-application-cluster/) for minikube and [Expose Kubernetes services to external devices](/azure/aks/hybrid/aks-edge-howto-expose-service) for Azure Kubernetes Services Edge Essentials.

## No TLS and no authentication

The reason that IoT MQ uses TLS and service accounts authentication by default is to provide a secure-by-default experience that minimizes inadvertent exposure of your IoT solution to attackers. You shouldn't turn off TLS and authentication in production.

> [!CAUTION]
> Don't use in production. Exposing IoT MQ to the internet without authentication and TLS can lead to unauthorized access and even DDOS attacks.

If you understand the risks and need to use an insecure port in a well-controlled environment, you can turn off TLS and authentication for testing purposes following these steps:

1. Create a new `BrokerListener` resource without TLS settings:

    ```yaml
    apiVersion: mq.iotoperations.azure.com/v1beta1
    kind: BrokerListener
    metadata:
      name: non-tls-listener
      namespace: azure-iot-operations
    spec:
      brokerRef: broker
      serviceType: loadBalancer
      serviceName: my-unique-service-name
      authenticationEnabled: false
      authorizationEnabled: false
      port: 1883
    ```

    The `authenticationEnabled` and `authorizationEnabled` fields are set to `false` to turn off authentication and authorization. The `port` field is set to `1883` to use common MQTT port.

1. Wait for the service to be updated.

    ```console
    kubectl get service my-unique-service-name --namespace azure-iot-operations
    ```

    Output should look similar to the following:

    ```Output
    NAME                     TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
    my-unique-service-name   LoadBalancer   10.43.144.182   XXX.XX.X.X    1883:31001/TCP   5m11s
    ```

    The new port 1883 is available.

1. Use mosquitto client to connect to the broker:

    ```console
    mosquitto_pub --qos 1 --debug -h localhost --message hello --topic world
    ```

    The output should look similar to the following:

    ```Output
    Client mosq-7JGM4INbc5N1RaRxbW sending CONNECT
    Client mosq-7JGM4INbc5N1RaRxbW received CONNACK (0)
    Client mosq-7JGM4INbc5N1RaRxbW sending PUBLISH (d0, q1, r0, m1, 'world', ... (5 bytes))
    Client mosq-7JGM4INbc5N1RaRxbW received PUBACK (Mid: 1, RC:0)
    Client mosq-7JGM4INbc5N1RaRxbW sending DISCONNECT
    ```

## Related content

- [Configure TLS with manual certificate management to secure MQTT communication](howto-configure-tls-manual.md)
- [Configure authentication](howto-configure-authentication.md)
