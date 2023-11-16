---
title: Configure TLS with manual certificate management to secure MQTT communication
# titleSuffix: Azure IoT MQ
description: Configure TLS with manual certificate management to secure MQTT communication between the MQTT broker and client.
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 10/29/2023

#CustomerIntent: As an operator, I want to configure IoT MQ to use TLS so that I have secure communication between the MQTT broker and client.
---

# Configure TLS with manual certificate management to secure MQTT communication

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

You can configure TLS to secure MQTT communication between the MQTT broker and client using a [BrokerListener resource](howto-configure-brokerlistener.md). You can configure TLS with manual or automatic certificate management. 

To manually configure Azure IoT MQ to use a specific TLS certificate, specify it in a BrokerListener resource with a reference to a Kubernetes secret. Then deploy it using kubectl. This article shows an example to configure TLS with self-signed certificates for testing.

## Create certificate authority with Step CLI

[Step](https://smallstep.com/) is a certificate manager that can quickly get you up and running when creating and managing your own private CA. 

1. [Install Step CLI](https://smallstep.com/docs/step-cli/installation/) and create a root certificate authority (CA) certificate and key.

    ```bash
    step certificate create --profile root-ca "Example Root CA" root_ca.crt root_ca.key
    ```

1. Create an intermediate CA certificate and key signed by the root CA.

    ```bash
    step certificate create --profile intermediate-ca "Example Intermediate CA" intermediate_ca.crt intermediate_ca.key \
    --ca root_ca.crt --ca-key root_ca.key
    ```

## Create server certificate

Use Step CLI to create a server certificate from the signed by the intermediate CA.

```bash
step certificate create mqtts-endpoint mqtts-endpoint.crt mqtts-endpoint.key \
--profile leaf \
--not-after 8760h \
--san mqtts-endpoint \
--san localhost \
--ca intermediate_ca.crt --ca-key intermediate_ca.key \
--no-password --insecure
```

Here, `mqtts-endpoint` and `localhost` are the Subject Alternative Names (SANs) for Azure IoT MQ's broker frontend in Kubernetes and local clients, respectively. To connect over the internet, add a `--san` with [an external IP](#use-external-ip-for-the-server-certificate). The `--no-password --insecure` flags are used for testing to skip password prompts and disable password protection for the private key because it's stored in a Kubernetes secret. For production, use a password and store the private key in a secure location like Azure Key Vault.

### Certificate key algorithm requirements

Both EC and RSA keys are supported, but all certificates in the chain must use the same key algorithm. If you import your own CA certificates, ensure that the server certificate uses the same key algorithm as the CAs.

## Import server certificate as a Kubernetes secret

Create a Kubernetes secret with the certificate and key using kubectl.

```bash
kubectl create secret tls server-cert-secret -n azure-iot-operations \
--cert mqtts-endpoint.crt \
--key mqtts-endpoint.key
```

## Enable TLS for a listener

Modify the `tls` setting in a BrokerListener resource to specify manual TLS configuration referencing the Kubernetes secret. Note the name of the secret used for the TLS server certificate (`server-cert-secret` in the example previously).

```yaml
apiVersion: mq.iotoperations.azure.com/v1beta1
kind: BrokerListener
metadata:
  name: manual-tls-listener
  namespace: azure-iot-operations
spec:
  brokerRef: broker
  authenticationEnabled: false # If true, BrokerAuthentication must be configured
  authorizationEnabled: false
  serviceType: loadBalancer # Optional, defaults to clusterIP
  serviceName: mqtts-endpoint # Match the SAN in the server certificate
  port: 8885 # Avoid port conflict with default listener at 8883
  tls:
    manual:
      secretName: server-cert-secret
```

Once the BrokerListener resource is created, the operator automatically creates a Kubernetes service and deploys the listener. You can check the status of the service by running `kubectl get svc`.

## Connect to the broker with TLS

1. To test the TLS connection with mosquitto, first create a full certificate chain file with Step CLI.

    ```bash
    cat root_ca.crt intermediate_ca.crt > chain.pem
    ```

1. Use mosquitto to publish a message.

    ```console
    $ mosquitto_pub -d -h localhost -p 8885 -i "my-client" -t "test-topic" -m "Hello" --cafile chain.pem
    Client my-client sending CONNECT
    Client my-client received CONNACK (0)
    Client my-client sending PUBLISH (d0, q0, r0, m1, 'test-topic', ... (5 bytes))
    Client my-client sending DISCONNECT
    ```

> [!TIP]
> To use localhost, the port must be available on the host machine. For example, `kubectl port-forward svc/mqtts-endpoint 8885:8885 -n azure-iot-operations`. With some Kubernetes distributions like K3d, you can add a forwarded port with `k3d cluster edit $CLUSTER_NAME --port-add 8885:8885@loadbalancer`.

Remember to specify username, password, etc. if authentication is enabled.

### Use external IP for the server certificate

To connect with TLS over the internet, Azure IoT MQ's server certificate must have its external hostname as a SAN. In production, this is usually a DNS name or a well-known IP address. However, during dev/test, you might not know what hostname or external IP is assigned before deployment. To solve this, deploy the listener without the server certificate first, then create the server certificate and secret with the external IP, and finally import the secret to the listener.

If you try to deploy the example TLS listener `manual-tls-listener` but the referenced Kubernetes secret `server-cert-secret` doesn't exist, the associated service gets created, but the pods don't start. The service is created because the operator needs to reserve the external IP for the listener.

```console
$ kubectl get svc mqtts-endpoint -n azure-iot-operations
NAME                   TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)             AGE
mqtts-endpoint         LoadBalancer   10.43.93.6      172.18.0.2    8885:30674/TCP      1m15s
```

However, this behavior is expected and it's okay to leave it like this while we import the server certificate. The health manager logs mention Azure IoT MQ is waiting for the server certificate.

```console
$ kubectl logs -l app=health-manager -n azure-iot-operations
...
<6>2023-11-06T21:36:13.634Z [INFO] [1] - Server certificate server-cert-secret not found. Awaiting creation of secret.
```

> [!NOTE]
> Generally, in a distributed system, pods logs aren't deterministic and should be used with caution. The right way for information like this to surface is through Kubernetes events and custom resource status, which is in the backlog. Consider the previous step as a temporary workaround.

Even though the frontend pods aren't up, the external IP is already available.

```console
$ kubectl get svc mqtts-endpoint -n azure-iot-operations
NAME                   TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)             AGE
mqtts-endpoint         LoadBalancer   10.43.93.6      172.18.0.2    8885:30674/TCP      1m15s
```

From here, follow the same steps as previously to create a server certificate with this external IP in `--san` and create the Kubernetes secret in the same way. Once the secret is created, it's automatically imported to the listener. 

## Related content

- About [BrokerListener resource](howto-configure-brokerlistener.md)
- [Configure authorization for a BrokerListener](./howto-configure-authorization.md)
- [Configure authentication for a BrokerListener](./howto-configure-authentication.md)
- [Configure TLS with automatic certificate management](./howto-configure-tls-auto.md)
