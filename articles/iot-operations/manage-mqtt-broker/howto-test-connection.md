---
title: Test connectivity to MQTT broker with MQTT clients
description: Learn how to use common and standard MQTT tools to test connectivity to an MQTT broker in a nonproduction environment.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-mqtt-broker
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 11/06/2024

#CustomerIntent: As an operator or developer, I want to test MQTT connectivity with tools that I'm already familiar with to know that I set up my MQTT broker correctly.
ms.service: azure-iot-operations
---

# Test connectivity to MQTT broker with MQTT clients

[!INCLUDE [kubernetes-management-preview-note](../includes/kubernetes-management-preview-note.md)]

This article shows different ways to test connectivity to an MQTT broker with MQTT clients in a nonproduction environment.

By default, an MQTT broker:

- Deploys a [Transport Layer Security (TLS) Protocol-enabled listener](howto-configure-brokerlistener.md) on port 18883 with `ClusterIp` as the service type. `ClusterIp` means that the broker is accessible only from within the Kubernetes cluster. To access the broker from outside the cluster, you must configure a service of type `LoadBalancer` or `NodePort`.
- Accepts [Kubernetes service accounts for authentication](howto-configure-authentication.md) for connections from within the cluster. To connect from outside the cluster, you must configure a different authentication method.

> [!CAUTION]
> For production scenarios, use TLS and service accounts authentication to secure your IoT solution. For more information, see:
>
> - [Configure TLS with automatic certificate management to secure MQTT communication in the MQTT broker](./howto-configure-tls-auto.md).
> - [Configure authentication in the MQTT broker](./howto-configure-authentication.md).
> - [Expose Kubernetes services to external devices](/azure/aks/hybrid/aks-edge-howto-expose-service) by using port forwarding or a virtual switch with Azure Kubernetes Services (AKS) Edge Essentials.

Before you begin, [install or configure Azure IoT Operations](../get-started-end-to-end-sample/quickstart-deploy.md). Use the following options to test connectivity to the MQTT broker with MQTT clients in a nonproduction environment.

## Connect to the default listener inside the cluster

The first option is to connect from within the cluster. This option uses the default configuration and requires no extra updates. The following examples show how to connect from within the cluster by using plain Alpine Linux and a commonly used MQTT client by using the service account and default root Certificate Authority (CA) certificate.

Download the `mqtt-client.yaml` deployment from the GitHub sample repository.

> [!IMPORTANT]
> Don't use the MQTT client in production. The client is for testing purposes only.

```bash
wget https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/main/samples/quickstarts/mqtt-client.yaml -O mqtt-client.yaml
```

Apply the deployment file with kubectl:

```bash
kubectl apply -f mqtt-client.yaml
```

```output
pod/mqtt-client created
```

After the pod is running, use `kubectl exec` to run commands inside the pod.

For example, to publish a message to the broker, open a shell inside the pod:

```bash
kubectl exec --stdin --tty mqtt-client --namespace azure-iot-operations -- sh
```

Inside the pod's shell, run the following command to publish a message to the broker:

```bash
mosquitto_pub --host aio-broker --port 18883 --message "hello" --topic "world" --debug --cafile /var/run/certs/ca.crt -D CONNECT authentication-method 'K8S-SAT' -D CONNECT authentication-data $(cat /var/run/secrets/tokens/broker-sat)
```

The output should look similar to the following example:

```Output    
Client (null) sending CONNECT
Client (null) received CONNACK (0)
Client (null) sending PUBLISH (d0, q0, r0, m1, 'world', ... (5 bytes))
Client (null) sending DISCONNECT
```

The Mosquitto client uses the service account token mounted at `/var/run/secrets/tokens/broker-sat` to authenticate with the broker. The token is valid for 24 hours. The client also uses the default root CA certificate mounted at `/var/run/certs/ca.crt` to verify the broker's TLS certificate chain.

> [!TIP]
> You can use kubectl to download the default root CA certificate to use with other clients. For example, to download the default root CA certificate to a file named `ca.crt`:
> 
> ```bash
> kubectl get configmap azure-iot-operations-aio-ca-trust-bundle -n azure-iot-operations -o jsonpath='{.data.ca\.crt}' > ca.crt
> ```

To subscribe to the topic, run the following command:

```bash
mosquitto_sub --host aio-broker --port 18883 --topic "world" --debug --cafile /var/run/certs/ca.crt -D CONNECT authentication-method 'K8S-SAT' -D CONNECT authentication-data $(cat /var/run/secrets/tokens/broker-sat)
```

The output should look similar to the following example:

```Output
Client (null) sending CONNECT
Client (null) received CONNACK (0)
Client (null) sending SUBSCRIBE (Mid: 1, Topic: world, QoS: 0, Options: 0x00)
Client (null) received SUBACK
Subscribed (mid: 1): 0
```

The Mosquitto client uses the same service account token and root CA certificate to authenticate with the broker and subscribe to the topic.

To remove the pod, run `kubectl delete pod mqtt-client -n azure-iot-operations`.

## Connect clients from outside the cluster

Because the [default broker listener](howto-configure-brokerlistener.md#default-brokerlistener) is set to the `ClusterIp` service type, you can't connect to the broker from outside the cluster directly. To prevent unintentional disruption to communication between internal IoT Operations components, we recommend that you keep the default listener unmodified and dedicated for IoT Operations internal communication. Although it's possible to create a separate Kubernetes `LoadBalancer` service to expose the cluster IP service, it's better to create a separate listener with different settings, like more common MQTT ports 1883 and 8883, to avoid confusion and potential security risks.

<!-- TODO: consider moving to the main listener article and just link from here? -->
### Node port

The easiest way to test connectivity is to use the `NodePort` service type in the listener. With that method, you can use `<nodeExternalIP>:<NodePort>` to connect as shown in the [Kubernetes documentation](https://kubernetes.io/docs/tutorials/services/connect-applications-service/#exposing-the-service).

For example, to create a new broker listener with the `NodePort` service type, service name `aio-broker-nodeport`, and listening on port 1884 (node port 31884), follow these steps.

# [Portal](#tab/portal)

1. In the Azure portal, go to your IoT Operations instance.
1. Under **Components**, select **MQTT Broker**.
1. Select **MQTT broker listener for NodePort** > **Create**. You can create only one listener per service type. If you already have a listener of the same service type, you can add more ports to the existing listener.

    > [!CAUTION]
    > Setting authentication to **None** and not configuring TLS [turns off authentication and TLS for testing purposes only](#only-turn-off-tls-and-authentication-for-testing).

    Enter the following settings:

    | Setting        | Value                                            |
    | -------------- | ------------------------------------------------ |
    | Name           | `aio-broker-nodeport`                            |
    | Service name   | Leave empty or use `aio-broker-nodeport`.             |
    | Port           | 1884                                             |
    | Authentication | Choose from existing or **None**.                 |
    | Authorization  | Choose from existing or **None**.                 |
    | Protocol       | Choose **MQTT**.                                  |
    | Node port      | 31884                                            |

1. Add TLS settings to the listener by selecting **TLS** > **Add** on the port. This step isn't required if you don't need TLS for testing. For more information, see [BrokerListener](howto-configure-brokerlistener.md).
1. Select **Create** to create the listener.

# [Bicep](#tab/bicep)

> [!CAUTION]
> Removing `authenticationRef` and `tls` settings from the configuration [turns off authentication and TLS for testing purposes only.](#only-turn-off-tls-and-authentication-for-testing)

```bicep
param aioInstanceName string = '<AIO_INSTANCE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'
param listenerName string = 'aio-broker-nodeport'

resource aioInstance 'Microsoft.IoTOperations/instances@2024-11-01' existing = {
  name: aioInstanceName
}

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}

resource defaultBroker 'Microsoft.IoTOperations/instances/brokers@2024-11-01' existing = {
  parent: aioInstance
  name: 'default'
}

resource nodePortListener 'Microsoft.IoTOperations/instances/brokers/listeners@2024-11-01' = {
  parent: defaultBroker
  name: listenerName
  extendedLocation: {
    name: customLocation.id
    type: 'CustomLocation'
  }
  properties: {
    serviceType: 'NodePort'
    ports: [
      {
        port: 1884
        nodePort: 31884 // Must be in the range 30000-32767
        authenticationRef: 'default' // Add BrokerAuthentication reference, omit setting turns off authentication for testing only
        tls: {
          // Add TLS settings
          // Omitting section turns off TLS for testing only
        }
      }
    ]
  }
}
```

Deploy the Bicep file by using the Azure CLI:

```azurecli
az deployment group create --resource-group <RESOURCE_GROUP> --template-file <FILE>.bicep
```

# [Kubernetes (preview)](#tab/kubernetes)

Create a file named `broker-nodeport.yaml` with the following configuration. Replace placeholders with your own values, including your own authentication and TLS settings.

> [!CAUTION]
> Removing `authenticationRef` and `tls` settings from the configuration [turns off authentication and TLS for testing purposes only](#only-turn-off-tls-and-authentication-for-testing).

```yaml
apiVersion: mqttbroker.iotoperations.azure.com/v1
kind: BrokerListener
metadata:
  name: aio-broker-nodeport
  namespace: azure-iot-operations
spec:
  brokerRef: default
  serviceType: NodePort
  ports:
    - port: 1883
      nodePort: 31884 # Must be in the range 30000-32767
      authenticationRef: default # Add BrokerAuthentication reference, omit setting turns off authentication for testing only
      tls:
        # Add TLS settings
        # Omitting section turns off TLS for testing only
```

Then, use kubectl to deploy the configuration:

```bash
kubectl apply -f broker-nodeport.yaml
```

---

> [!NOTE]
> By Kubernetes default, the node port number [must be in the range of 30000 to 32767](https://kubernetes.io/docs/concepts/services-networking/service/#type-nodeport).

Get the node's external IP address:

```bash
kubectl get nodes -o yaml | grep ExternalIP -C 1
```

The output should look similar to the following example:

```output
    - address: 104.197.41.11
      type: ExternalIP
    allocatable:
--
    - address: 23.251.152.56
      type: ExternalIP
    allocatable:
...
```

Use the external IP address and the node port to connect to the broker. For example, to publish a message to the broker:

```bash
mosquitto_pub --host <EXTERNAL_IP> --port 31884 --message "hello" --topic "world" --debug # Add authentication and TLS options matching listener settings
```

If there's no external IP in the output, you might be using a Kubernetes setup that doesn't expose the node's external IP address by default, like many setups of k3s, k3d, or minikube. In that case, you can access the broker with the internal IP along with the node port from machines on the same network. For example, to get the internal IP address of the node:

```bash
kubectl get nodes -o yaml | grep InternalIP -C 1
```

The output should look similar to the following example:

```output
    - address: 172.19.0.2
      type: InternalIP
    allocatable:
```

Then, use the internal IP address and the node port to connect to the broker from a machine within the same cluster. If Kubernetes is running on a local machine, like with single-node k3s, you can often use `localhost` instead of the internal IP address. If Kubernetes is running in a Docker container, like with k3d, the internal IP address corresponds to the container's IP address, and should be reachable from the host machine.

### Load balancer

Another way to expose the broker to the internet is to use the `LoadBalancer` service type. This method is more complex and might require more configuration, like setting up port forwarding.

For example, to create a new broker listener with the `LoadBalancer` service type, service name `aio-broker-loadbalancer`, and listening on port 1883, follow these steps.

# [Portal](#tab/portal)

1. In the Azure portal, go to your IoT Operations instance.
1. Under **Components**, select **MQTT Broker**.
1. Select **MQTT broker listener for NodePort** > **Create**. You can create only one listener per service type. If you already have a listener of the same service type, you can add more ports to the existing listener.

    > [!CAUTION]
    > Setting authentication to **None** and not configuring TLS [turns off authentication and TLS for testing purposes only](#only-turn-off-tls-and-authentication-for-testing).

    Enter the following settings:

    | Setting        | Value                                            |
    | -------------- | ------------------------------------------------ |
    | Name           | `aio-broker-loadbalancer`                        |
    | Service name   | Leave empty or use `aio-broker-loadbalancer`.         |
    | Port           | 1883                                             |
    | Authentication | Choose from existing or **None**.                 |
    | Authorization  | Choose from existing or **None**.                 |
    | Protocol       | Choose **MQTT**.                                  |

1. Add TLS settings to the listener by selecting **TLS** > **Add** on the port. This step isn't required if you don't need TLS for testing. For more information, see [BrokerListener](howto-configure-brokerlistener.md).
1. Select **Create** to create the listener.
1. Select **Create** to create the listener.

# [Bicep](#tab/bicep)

> [!CAUTION]
> Removing `authenticationRef` and `tls` settings from the configuration [turns off authentication and TLS for testing purposes only](#only-turn-off-tls-and-authentication-for-testing).

```bicep
param aioInstanceName string = '<AIO_INSTANCE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'
param listenerName string = 'aio-broker-loadbalancer'

resource aioInstance 'Microsoft.IoTOperations/instances@2024-11-01' existing = {
  name: aioInstanceName
}

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}

resource defaultBroker 'Microsoft.IoTOperations/instances/brokers@2024-11-01' existing = {
  parent: aioInstance
  name: 'default'
}

resource loadBalancerListener 'Microsoft.IoTOperations/instances/brokers/listeners@2024-11-01' = {
  parent: defaultBroker
  name: listenerName
  extendedLocation: {
    name: customLocation.id
    type: 'CustomLocation'
  }

  properties: {
    serviceType: 'LoadBalancer'
    ports: [
      {
        port: 1883
        authenticationRef: 'default' // Add BrokerAuthentication reference, omit setting turns off authentication for testing only
        tls: {
          // Add TLS settings
          // Omitting section turns off TLS for testing only
        }
      }
    ]
  }
}

```

Deploy the Bicep file by using the Azure CLI:

```azurecli
az deployment group create --resource-group <RESOURCE_GROUP> --template-file <FILE>.bicep
```

# [Kubernetes (preview)](#tab/kubernetes)

> [!CAUTION]
> Removing `authenticationRef` and `tls` settings from the configuration [turns off authentication and TLS for testing purposes only](#only-turn-off-tls-and-authentication-for-testing).

Create a file named `broker-loadbalancer.yaml` with configuration like the following example. Replace placeholders with your own values, including your own authentication and TLS settings.

```yaml
apiVersion: mqttbroker.iotoperations.azure.com/v1
kind: BrokerListener
metadata:
  name: aio-broker-loadbalancer
  namespace: azure-iot-operations
spec:
  brokerRef: default
  serviceType: LoadBalancer
  ports:
    - port: 1883
      authenticationRef: default # Add BrokerAuthentication reference, omit setting turns off authentication for testing only
      tls:
        # Add TLS settings
        # Omitting section turns off TLS for testing only
```

Use kubectl to deploy the configuration:

```bash
kubectl apply -f broker-loadbalancer.yaml
```

---

Get the external IP address for the broker's service:

```bash
kubectl get service aio-broker-loadbalancer --namespace azure-iot-operations
```

If the output looks similar to the following example:

```output
NAME                      TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
aio-broker-loadbalancer   LoadBalancer   10.x.x.x        x.x.x.x       1883:30382/TCP   83s
```

Then an external IP was assigned to the load balancer service. You can use the external IP address and the port to connect to the broker. For example, to publish a message to the broker:

```bash
mosquitto_pub --host <EXTERNAL_IP> --port 1883 --message "hello" --topic "world" --debug # Add authentication and TLS options matching listener settings
```

If the external IP isn't assigned, you might need to use port forwarding or a virtual switch to access the broker.

#### Use port forwarding

With [minikube](https://minikube.sigs.k8s.io/docs/), [kind](https://kind.sigs.k8s.io/), and other cluster emulation systems, an external IP might not be automatically assigned. For example, the state might show as *Pending*.

1. To access the broker, forward the broker listener port to the host.

    ```bash
    # Using aio-broker-loadbalancer service name and listener port 1883 as example
    kubectl port-forward --namespace azure-iot-operations service/aio-broker-loadbalancer <HOST_PORT>:1883
    ```

1. Leave the port forwarding command running in the terminal.

1. Connect to the broker at the host port with the same authentication and TLS configuration as the example without port forwarding.

For more information about minikube, see [Use Port Forwarding to Access Applications in a Cluster](https://kubernetes.io/docs/tasks/access-application-cluster/port-forward-access-application-cluster/).

#### Port forwarding on AKS Edge Essentials

For AKS Edge Essentials, you need to perform a few more steps. With AKS Edge Essentials, getting the external IP address might not be enough to connect to the broker. You might need to set up port forwarding and open the port on the firewall to allow traffic to the broker's service.

1. First, get the external IP address of the broker's load balancer listener:
    
    ```bash
    kubectl get service broker-loadbalancer --namespace azure-iot-operations
    ```
    
    Output should look similar to the following example:
    
    ```Output
    NAME                    TYPE           CLUSTER-IP     EXTERNAL-IP   PORT(S)          AGE
    broker-loadbalancer     LoadBalancer   10.x.x.x       192.168.0.4   1883:30366/TCP   14h
    ```
    
1. Set up port forwarding to the `broker-loadbalancer` service on the external IP address `192.168.0.4` and port `1883`:

    ```cmd
    netsh interface portproxy add v4tov4 listenport=1883 connectport=1883 connectaddress=192.168.0.4
    ```
    
1. Open the port on the firewall to allow traffic to the broker's service:

    ```powershell
    New-NetFirewallRule -DisplayName "AIO MQTT Broker" -Direction Inbound -Protocol TCP -LocalPort 1883 -Action Allow
    ```

1. Use the host's public IP address to connect to the MQTT broker.

For more information about port forwarding, see [Expose Kubernetes services to external devices](/azure/aks/hybrid/aks-edge-howto-expose-service).

#### Access through localhost

Some Kubernetes distributions can [expose](https://k3d.io/v5.1.0/usage/exposing_services/) the MQTT broker to a port on the host system (`localhost`) as part of cluster configuration. Use this approach to make it easier for clients on the same host to access the MQTT broker.

For example, to create a k3d cluster that maps the MQTT broker's default MQTT port 1883 to `localhost:1883`:

```bash
k3d cluster create --port '1883:1883@loadbalancer'
```

Or to update an existing cluster:

```bash
k3d cluster edit <CLUSTER_NAME> --port-add '1883:1883@loadbalancer'
```

Then, use `localhost` and the port to connect to the broker. For example, to publish a message to the broker:

```bash
mosquitto_pub --host localhost --port 1883 --message "hello" --topic "world" --debug # Add authentication and TLS options matching listener settings
```

## Only turn off TLS and authentication for testing

The reason that the MQTT broker uses TLS and service accounts authentication by default is to provide a secure-by-default experience that minimizes inadvertent exposure of your IoT solution to attackers. You shouldn't turn off TLS and authentication in production. Exposing the MQTT broker to the internet without authentication and TLS can lead to unauthorized access and even distributed denial-of-service attacks.

> [!WARNING]
> If you understand the risks and need to use an insecure port in a well-controlled environment, you can turn off TLS and authentication for testing purposes by removing the `tls` and `authenticationRef` settings from the listener configuration.

# [Portal](#tab/portal)

1. In the Azure portal, go to your IoT Operations instance.
1. Under **Components**, select **MQTT Broker**.
1. Select **MQTT broker listener for NodePort** or **MQTT broker listener for LoadBalancer** > **Create**. You can create only one listener per service type. If you already have a listener of the same service type, you can add more ports to the existing listener.

    > [!CAUTION]
    > Setting authentication to **None** and not configuring TLS [turns off authentication and TLS for testing purposes only](#only-turn-off-tls-and-authentication-for-testing).

    Enter the following settings:

    | Setting        | Value                                                 |
    | -------------- | ----------------------------------------------------- |
    | Name           | Enter a name for the listener.                         |
    | Service name   | Enter a service name.                                  |
    | Port           | Enter a port number.                                   |
    | Authentication | Choose **None**.                                       |
    | Authorization  | Choose **None**.                                       |
    | Protocol       | Choose **MQTT**.                                       |
    | Node port      | Enter a number between 30000 to 32767 if using node port. |

1. Select **Create** to create the listener.

# [Bicep](#tab/bicep)

> [!CAUTION]
> Removing `authenticationRef` and `tls` settings from the configuration [turns off authentication and TLS for testing purposes only](#only-turn-off-tls-and-authentication-for-testing).

```bicep
param aioInstanceName string = '<AIO_INSTANCE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'
param listenerName string = '<LISTENER_NAME>'

resource aioInstance 'Microsoft.IoTOperations/instances@2024-11-01' existing = {
  name: aioInstanceName
}

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}

resource defaultBroker 'Microsoft.IoTOperations/instances/brokers@2024-11-01' existing = {
  parent: aioInstance
  name: 'default'
}

resource nodePortListener 'Microsoft.IoTOperations/instances/brokers/listeners@2024-11-01' = {
  parent: defaultBroker
  name: listenerName
  extendedLocation: {
    name: customLocation.id
    type: 'CustomLocation'
  }

  properties: {
    serviceType: <SERVICE_TYPE> // 'LoadBalancer' or 'NodePort'
    ports: [
      {
        port: <PORT_NUMBER>
        nodePort: <PORT_NUMBER_BETWEEN_30000_32767> // If using NodePort
        // Omitting authenticationRef and tls for testing only
      }
    ]
  }
}

```

Deploy the Bicep file by using the Azure CLI:

```azurecli
az deployment group create --resource-group <RESOURCE_GROUP> --template-file <FILE>.bicep
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
apiVersion: mqttbroker.iotoperations.azure.com/v1
kind: BrokerListener
metadata:
  name: <LISTENER_NAME>
  namespace: azure-iot-operations
spec:
  brokerRef: default
  serviceType: <SERVICE_TYPE> # LoadBalancer or NodePort
  ports:
    - port: <PORT_NUMBER>
      nodePort: <PORT_NUMBER_BETWEEN_30000_32767> # If using NodePort
      # Omitting authenticationRef and tls for testing only
```

---

## Related content

- [Configure TLS with manual certificate management to secure MQTT communication](howto-configure-tls-manual.md)
- [Configure authentication](howto-configure-authentication.md)
- [Tutorial: TLS, X.509 client authentication, and attribute-based access control (ABAC) authorization](./tutorial-tls-x509.md)