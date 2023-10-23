---
title: Configure Azure IoT MQ in an Isolated Network
# titleSuffix: Azure IoT Layered Network Management
description: Configure Azure IoT MQ in an Isolated Network.
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.date: 10/22/2023

#CustomerIntent: As an operator, I want to configure Layered Network Management so that I have secure Azure IoT MQ.
---

# Configure Azure IoT MQ in an Isolated Network

This page describes a setup for deploying MQ on Level 4 and Level 3 and sending MQTT messages from a client on Level 3 to a client on Level 4. The following is a block diagram representation of the setup.

![MQ Setup](mq_lnm.png)

## Prerequisites
You need to setup two clusters in a basic isolated network environment to try this MQ scenario.
- A level 4 cluster which is internet facing.
- A level 3 cluster in the isolated network and connects to Arc through the Layered Network Management service at level 4.

Follow the instructions below to setup the environment:
1. [Setup an Isolated Networks Environment](/docs/e4in/setup-isolated-network/).
    - It is recommended to setup with physical machines.
    - You also need to setup the DNS server.
2. [Setup Level 4 Cluster and Deploy Layered Network Management Service](/docs/e4in/setup-l4-cluster/)
3. [Setup Level 3 Cluster and Connect to Arc](/docs/e4in/setup-l3-cluster/)

After the level 4 and level 3 cluster are both Arc-enabled, you can proceed to setup the MQ and MQTT bridge.

## Level 4 Setup

#### Deploy MQ on Level 4

Run the following command to deploy the 0.5.0 release of MQ. This installs the MQ Operator and Health Manager.

```bash
helm install e4k "oci://e4kpreview.azurecr.io/helm/az-e4k" --version 0.5.0
```

To setup the CR for MQ, create `mq-cr.yaml` file with the following content. Run `kubectl apply -f mq-cr.yaml` and wait till all pods are ready.

```
apiVersion: az-edge.com/v1alpha3
kind: Broker
metadata:
  name: "my-broker"
  namespace: default
spec:
  authImage:
    pullPolicy: Always
    repository: alicesprings.azurecr.io/dmqtt-authentication
    tag: 0.5.0
  brokerImage:
    pullPolicy: Always
    repository: alicesprings.azurecr.io/dmqtt-pod
    tag: 0.5.0
  healthManagerImage:
    pullPolicy: Always
    repository: alicesprings.azurecr.io/dmqtt-operator
    tag: 0.5.0
  mode: distributed
  cardinality:
    frontend:
      replicas: 1
    backendChain:
      replicas: 1
      partitions: 2
      workers: 1
  diagnostics:
    diagnosticServiceEndpoint: azedge-diagnostics-service:9700
    enableMetrics: true
    enableTracing: true
    logLevel: info,hyper=off,kube_client=off,tower=off,conhash=off,h2=off
    enableSelfCheck: true
---
apiVersion: az-edge.com/v1alpha3
kind: BrokerListener
metadata:
  name: "az-mqtt-non-tls-listener"
  namespace: default
spec:
  brokerRef: "my-broker"
  authenticationEnabled: false
  authorizationEnabled: false
  port: 1883
---
apiVersion: az-edge.com/v1alpha3
kind: DiagnosticService
metadata:
  name: azedge-diagnostics-service
  namespace: default
spec:
  image:
    pullPolicy: Always
    repository: alicesprings.azurecr.io/diagnostics-service
    tag: 0.5.0
  logFormat: "text"
```

#### Create TLS Server Certificate of MQ on Level 4
Follow the steps specified in [Manual TLS](/docs/mqtt-broker/listeners/manual/).
- While creating the certificate, use `azedge-dmqtt-frontend.level-4.com` as one of the SAN (in --san option of step cli).

#### Deploy TLS Listener for MQ on Level 4
> This step needs the TLS certificate created in the last step


To create the CR for TLS listener, create a file `mq-tls-listener.yaml` with the content provided below. Then run `kubectl apply -f mq-listener.yaml`

```
apiVersion: az-edge.com/v1alpha3
kind: BrokerListener
metadata:
  name: "tls-listener-manual"
  namespace: default
spec:
  brokerRef: "my-broker"
  authenticationEnabled: false
  port: 8883
  tls:
    manual:
      secretName: "my-secret"
```

#### Configure CoreDNS on Level 4 Cluster
To direct incoming traffic from MQTT Bridge at Level 3 to the in-cluster MQ service, you need to modify the coredns running on Level 4.

Run the following command.
```
kubectl edit configmap -n kube-system coredns
```
Then modify the coredns configuration as specified below.

```
apiVersion: v1
metadata:
  name: coredns
  namespace: kube-system
data:
  Corefile: |

    # Here azedge-dmqtt-frontend.level-4.com is the san name used while creating the certificate.
    # If you used any other name, specify that name here. Copy just this server block to your coredns configmap

    azedge-dmqtt-frontend.level-4.com:53 {
        hosts {
            10.43.164.168 azedge-dmqtt-frontend.level-4.com
            fallthrough
        }
    }

```
> This configuration resolves `azedge-dmqtt-frontend.level-4.com` to the `ClusterIP` 10.43.164.168 of the `azedge-dmqtt-frontend` service. Make sure to use correct ClusterIP address in this configuration.


## Level 3 setup
On Level 3 you need to deploy MQ and MQTT Bridge. MQTT Bridge is the component that receives MQTT message on a topic and sends them to another MQ. You will configure the MQTT Bridge to pass messages from Level 3 to Level 4 MQ on specified topic.

#### Deploy MQ on Level 3
Follow the steps in [Deploy MQ on Level 4](#deploy-mq-on-level-4) with the following changes:
- The MQ deployment in Level 3 does not need to be TLS enabled. You can skip the TLS listener and certificates creating.
- Change the namespace of Level 3 MQ service to `level3`.

#### Deploy and configure MQTT Bridge on Level 3
Folow the guidance in [MQTT Bridge](/docs/cloud-connectors/mqtt-bridge) to create the MQTT Bridge.
- For **MqttBridgeConnector**, in `remoteBrokerConnection` section of the YAML file, specify the name of the MQ service as below.
    ```
      remoteBrokerConnection:
        # Remote broker endpoint URL with port.
        endpoint: "azedge-dmqtt-frontend.level-4.com:8883"
        # Specifies if connection is encrypted with TLS and trusted CA cert
        tls:
          # TLS enabled or not.
          tlsEnabled: true
          trustedCaCertificateName: "ca-cert-configmap"
    ```

- For **MqttBridgeTopicMap**, use the following example content of YAML file for testing end to end message delivery.

    ```
    apiVersion: az-edge.com/v1alpha3
    kind: MqttBridgeTopicMap
    metadata:
      name: "my-topic-map"
      namespace: level3
    spec:
      mqttBridgeConnectorRef: "my-bridge"
      routes:
        - direction: local-to-remote
          name: "send-to-l4"
          source: "tol4"
          target: "froml3"
          qos: 1
        - direction: remote-to-local
          name: "receive-from-l4"
          source: "froml4"
          target: "tol3"
          qos: 1
    ```

## Testing

You can Mosquitto clients for testing end to end message delivery. Download and install [Mosquitto Clients](https://mosquitto.org/download/) on both Level 4 and Level 3. You also need to port-forward the MQ service on localhost so that Mosquitto clients can access them locally.

#### Subscribe to a topic in Level 4
Run the following command to port-forward the MQ service.  
```bash
kubectl port-forward service/azedge-dmqtt-frontend 12345:1883
```
  
Run the following command to subscribe. Note that the topic you are subscribing to is 'froml3' as specified in `MqttBridgeTopicMap` above.  
```bash
mosquitto_sub -d -h localhost -p 12345 -i "my-client" -t "froml3"
```

#### Publish to a topic from Level 3
Run the following command to port-forward the MQ service.

```bash
kubectl port-forward -n level3 service/azedge-dmqtt-frontend 12345:1883
```

Publish a message with the following command. Note that you are publishing to topic `tol4` as specified in `MqttBridgeTopicMap`
```bash
mosquitto_pub -d -h localhost -p 12345 -i "my-client-l3" -t "tol4" -m "Test"
```

#### Subscribe to a topic in Level 3
Run the following command to subscribe. Note that the topic you are subscribing to is `tol3` as specified in `MqttBridgeTopicMap` above.
```bash
mosquitto_sub -d -h localhost -p 12345 -i "my-client-l3-sub" -t "tol3"
```

#### Publish to a topic from Level 4
Run the following command to publish a message. Note that you are publishing to topic `froml4` as specified in `MqttBridgeTopicMap`
```bash
mosquitto_pub -d -h localhost -p 12345 -i "my-client-l4-pub" -t "froml4" -m "Test
```

## Related content

TODO: Add your next step link(s)


<!--
Remove all the comments in this template before you sign-off or merge to the main branch.
-->
