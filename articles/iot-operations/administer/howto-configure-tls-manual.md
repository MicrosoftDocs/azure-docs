---
title: Configure TLS with manual certificate management to secure MQTT communication
# titleSuffix: Azure IoT MQ
description: Configure TLS with manual certificate management to secure MQTT communication between the MQTT broker and client.
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.date: 10/16/2023

#CustomerIntent: As an operator, I want to configure IoT MQ to use TLS so that I have secure communication between the MQTT broker and client.
---

# Configure TLS with manual certificate management to secure MQTT communication

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

You can configure TLS to secure MQTT communication between the MQTT broker and client using a [BrokerListener resource](../pub-sub-mqtt/concept-brokerlistener.md). You can configure TLS with manual or automatic certificate management. 

To manually configure Azure IoT MQ to use a specific TLS certificate, specify it in a Broker Listener resource with a reference to a Kubernetes secret. Then deploy it using kubectl. This guide shows an example to set this up with self-signed certificates for testing.

## Create certificate authority with Step CLI

[Step](https://smallstep.com/) is a certificate manager that can quickly get you up and running when creating and managing your own private CA. [Install Step CLI]() and initialize a certificate authority.

```bash
step init ca
```

Follow the prompts to finish setup. Use a memorable password (For example, "mqtt") when prompted, as the password is used many times later.

## Create server certificate

Use Step CLI to create a server certificate from the signed by the private CA.

```bash
step certificate create azedge-dmqtt-frontend azedge-dmqtt-frontend.crt azedge-dmqtt-frontend.key \
--profile leaf --ca ~/.step/certs/intermediate_ca.crt \
--ca-key ~/.step/secrets/intermediate_ca_key \
--san azedge-dmqtt-frontend \
--san localhost \
--not-after 2400h --no-password --insecure
```

Here, `azedge-dmqtt-frontend` and `localhost` are the Subject Alternative Names (SANs) for Azure IoT MQ's broker frontend in Kubernetes and local clients, respectively. To connect over the internet, add a `--san` with [an external IP](#use-external-ip-for-the-server-certificate).

### Certificate key algorithm requirements

Both EC and RSA keys are supported, but all certificates in the chain must use the same key algorithm. If you import your own CA certificates, ensure that the server certificate uses the same key algorithm as the CAs.

## Import server certificate as a Kubernetes secret

Create a Kubernetes secret with the certificate and key using kubectl.

```bash
kubectl create secret tls my-secret \
--cert azedge-dmqtt-frontend.crt \
--key azedge-dmqtt-frontend.key
```

## Enable TLS for a listener

Modify the `tls` setting in a BrokerListener resource to specify manual TLS configuration referencing the Kubernetes secret. Note the name of the secret used for the TLS server certificate (`my-secret` in the example above).

```yaml
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
      secret: "my-secret"
      namespace: default # optional
```

To apply the change to an already running broker, the frontends need to be restarted. This is a temporary workaround until full update support is implemented in future release.

```bash
kubectl delete pods -l tier=frontend
```

## Connect to the broker with TLS

To test the TLS connection with mosquitto, first create a full certificate chain file with Step CLI.

```bash
cat ~/.step/certs/root_ca.crt ~/.step/certs/intermediate_ca.crt > chain.pem
```

Then, use mosquitto to publish a message.

```console
$ mosquitto_pub -d -h localhost -p 8883 -i "my-client" -t "test-topic" -m "Hello" --cafile chain.pem
Client my-client sending CONNECT
Client my-client received CONNACK (0)
Client my-client sending PUBLISH (d0, q0, r0, m1, 'test-topic', ... (5 bytes))
Client my-client sending DISCONNECT
```

Remember to specify username, password, etc. if authentication is enabled

### Use external IP for the server certificate

To connect with TLS over the internet, Azure IoT MQ's server certificate must have its external hostname as a SAN. In production, this is usually a DNS name or a well-known IP address. However, during dev/test, you might not know what hostname or external IP will be assigned before deployment. There are two ways to solve this.

### Option 1: deploy a non-TLS listener first

Deploy Azure IoT MQ with a non-TLS listener first.

```yml
apiVersion: az-edge.com/v1alpha3
kind: BrokerListener
metadata:
  name: "non-tls-listener"
  namespace: default
spec:
  brokerRef: "my-broker"
  authenticationEnabled: false
  authorizationEnabled: false
  port: 1883
```

After deployment completes, use kubectl to get the `EXTERNAL-IP`.

```console
$ kubectl get svc
NAME                          TYPE           CLUSTER-IP     EXTERNAL-IP     PORT(S)             AGE
...
azedge-dmqtt-frontend         LoadBalancer   10.43.58.212    172.18.0.2    1883:30520/TCP       17s
...
```

Finally, use this external IP as a SAN when creating the server certificate (for example `--san 172.18.0.2` in Step CLI), and follow the same steps above to deploy a listener with TLS.

### Option 2: deploy TLS listener without a Kubernetes secret

If you try to deploy Azure IoT MQ broker with only a TLS listener, but the Kubernetes secret doesn't exist, the frontend and backend pods will *not* deploy.

```console
$ kubectl get pods
NAME                                   READY   STATUS    RESTARTS   AGE
azedge-e4k-operator-655cdfc47d-2wmsl   1/1     Running   0          28s
azedge-dmqtt-health-manager-0          1/1     Running   0          11s
```

However, **this is expected** and it's ok to leave it like this while we import the server certificate.

The health manager logs mention Azure IoT MQ is waiting for the server certificate.

```console {hl_lines=11}
$ kubectl logs azedge-dmqtt-health-manager-0
[INFO] - Starting DMQTT Operator...
[INFO] - set RLIMIT_NOFILE to 1048576
[INFO] - running workers
[INFO] - Operator listening on 0.0.0.0:1883
[INFO] - Operator listening on [::]:1883
[INFO] - starting operator
[INFO] - press ctrl+c to shut down gracefully
[INFO] - reconciling object; object.ref=AzEdgeBroker.v1.az-edge.com/e4k.default object.reason=object updated
[INFO] - Server certificate my-secret not found. Awaiting creation of secret.
```

Generally, in a distributed system, pods logs are not deterministic and should be used with caution. The right way for information like this to surface is through Kubernetes events and custom resource status, which is in our backlog for public preview. Consider the above step as a temporary workaround.

Even though the frontend pods are not up, the external IP is already available.

```console
$ kubectl get svc
NAME                          TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)             AGE
kubernetes                    ClusterIP      10.43.0.1       <none>        443/TCP             6h10m
azedge-dmqtt-health-manager   ClusterIP      10.43.249.169   <none>        1883/TCP,8883/TCP   9m17s
azedge-dmqtt-frontend         LoadBalancer   10.43.93.6      172.18.0.2    8883:30674/TCP      9m15s
```

From here, follow the same steps as above to create a server certificate and secret with this external IP in `--san`, create the Kubernetes secret in the same way. Once the secret is created, it's automatically imported to the listener. You should see the logs showing the successful import:

```console
$ kubectl logs azedge-dmqtt-health-manager-0
...
[INFO] - Queried TLS server certificate my-secret.
[INFO] - reconciled default/e4k (AzEdgeBroker)
[INFO] - sending cell map to nodes, version: 1
```


## Related content

- BrokerListener resource
- Configure authorization for a BrokerListener
- Configure authentication for a BrokerListener
- Configure TLS with automatic certificate management