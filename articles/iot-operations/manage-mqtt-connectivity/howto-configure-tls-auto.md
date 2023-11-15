---
title: Configure TLS with automatic certificate management to secure MQTT communication
# titleSuffix: Azure IoT MQ
description: Configure TLS with automatic certificate management to secure MQTT communication between the MQTT broker and client.
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 10/29/2023

#CustomerIntent: As an operator, I want to configure IoT MQ to use TLS so that I have secure communication between the MQTT broker and client.
---

# Configure TLS with automatic certificate management to secure MQTT communication

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

You can configure TLS to secure MQTT communication between the MQTT broker and client using a [BrokerListener resource](howto-configure-brokerlistener.md). You can configure TLS with manual or automatic certificate management. 

## Verify cert-manager installation

With automatic certificate management, you use cert-manager to manage the TLS server certificate. By default, cert-manager is installed alongside Azure IoT Operations in the `azure-iot-operations` namespace already. Verify the installation before proceeding.

1. Use `kubectl` to check for the pods matching the cert-manager app labels.

    ```console
    $ kubectl get pods --namespace azure-iot-operations -l 'app in (cert-manager,cainjector,webhook)'
    NAME                                           READY   STATUS    RESTARTS       AGE
    aio-cert-manager-64f9548744-5fwdd              1/1     Running   4 (145m ago)   4d20h
    aio-cert-manager-cainjector-6c7c546578-p6vgv   1/1     Running   4 (145m ago)   4d20h
    aio-cert-manager-webhook-7f676965dd-8xs28      1/1     Running   4 (145m ago)   4d20h
    ```

1. If you see the pods shown as ready and running, cert-manager is installed and ready to use. 

> [!TIP]
> To further verify the installation, check the cert-manager documentation [verify installation](https://cert-manager.io/docs/installation/kubernetes/#verifying-the-installation). Remember to use the `azure-iot-operations` namespace.

## Create an Issuer for the TLS server certificate

The cert-manager Issuer resource defines how certificates are automatically issued. Cert-manager [supports several Issuers types natively](https://cert-manager.io/docs/configuration/). It also supports an [external](https://cert-manager.io/docs/configuration/external/) issuer type for extending functionality beyond the natively supported issuers. IoT MQ can be used with any type of cert-manager issuer.

> [!IMPORTANT]
> During initial deployment, Azure IoT Operations is installed with a default Issuer for TLS server certificates. You can use this issuer for development and testing. For more information, see [Default root CA and issuer with Azure IoT Operations](#default-root-ca-and-issuer-with-azure-iot-operations). The steps below are only required if you want to use a different issuer.

The approach to create the issuer is different depending on your scenario. The following sections list examples to help you get started.

# [Development or test](#tab/test)

The CA issuer is useful for development and testing. It must be configured with a certificate and private key stored in a Kubernetes secret.

### Set up the root certificate as a Kubernetes secret

If you have an existing CA certificate, create a Kubernetes secret with the CA certificate and private key PEM files. Run the following command and you have set up the root certificate as a Kubernetes secret and can skip the next section.

```bash
kubectl create secret tls test-ca --cert tls.crt --key tls.key -n azure-iot-operations
```

If you don't have a CA certificate, cert-manager can generate a root CA certificate for you. Using cert-manager to generate a root CA certificate is known as [bootstrapping](https://cert-manager.io/docs/configuration/selfsigned/#bootstrapping-ca-issuers) a CA issuer with a self-signed certificate.

1. Start by creating `ca.yaml`:

    ```yaml
    apiVersion: cert-manager.io/v1
    kind: Issuer
    metadata:
      name: selfsigned-ca-issuer
      namespace: azure-iot-operations
    spec:
      selfSigned: {}
    ---
    apiVersion: cert-manager.io/v1
    kind: Certificate
    metadata:
      name: selfsigned-ca-cert
      namespace: azure-iot-operations
    spec:
      isCA: true
      commonName: test-ca
      secretName: test-ca
      issuerRef:
        # Must match Issuer name above
        name: selfsigned-ca-issuer
        # Must match Issuer kind above
        kind: Issuer
        group: cert-manager.io
      # Override default private key config to use an EC key
      privateKey:
        rotationPolicy: Always
        algorithm: ECDSA
        size: 256
    ```

1. Create the self-signed CA certificate with the following command:

    ```bash
    kubectl apply -f ca.yaml
    ```

Cert-manager creates a CA certificate using its defaults. The properties of this certificate can be changed by modifying the Certificate spec. See [cert-manager documentation](https://cert-manager.io/docs/reference/api-docs/#cert-manager.io/v1.CertificateSpec) for a list of valid options.

### Distribute the root certificate

The prior example stores the CA certificate in a Kubernetes secret called `test-ca`. The certificate in PEM format can be retrieved from the secret and stored in a file `ca.crt` with the following command:

```bash
kubectl get secret test-ca -n azure-iot-operations -o json | jq -r '.data["tls.crt"]' | base64 -d > ca.crt
```

This certificate must be distributed and trusted by all clients. For example, use `--cafile` flag for a mosquitto client.

You can use Azure Key Vault to manage secrets for Azure IoT MQ instead of Kubernetes secrets. To learn more, see [Manage secrets using Azure Key Vault or Kubernetes secrets](../manage-mqtt-connectivity/howto-manage-secrets.md).

### Create issuer based on CA certificate

Cert-manager needs an issuer based on the CA certificate generated or imported in the earlier step. Create the following file as `issuer-ca.yaml`:

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: my-issuer
  namespace: azure-iot-operations
spec:
  ca:
    # Must match secretName of generated or imported CA cert
    secretName: test-ca
```

Create the issuer with the following command:

```bash
kubectl apply -f issuer-ca.yaml
```

The prior command creates an issuer for issuing the TLS server certificates. Note the name and kind of the issuer. In the example,  name `my-issuer` and kind `Issuer`. These values are set in the BrokerListener resource later.

# [Production](#tab/prod)

For production, check cert-manager documentation to see which issuer works best for you. For example, with [Vault Issuer](https://developer.hashicorp.com/vault/tutorials/kubernetes/kubernetes-cert-manager):

1. Deploy the vault in an environment of choice, like [Kubernetes](https://developer.hashicorp.com/vault/tutorials/kubernetes/kubernetes-raft-deployment-guide). Initialize and unseal the vault accordingly.
1. Create and configure the PKI secrets engine by importing your CA certificate.
1. Configure vault with role and policy for issuing server certificates.

    The following is an example role. Note `ExtKeyUsageServerAuth` makes the server certificate work:

    ```bash
    vault write pki/roles/my-issuer \
      allow_any_name=true \
      client_flag=false \
      ext_key_usage=ExtKeyUsageServerAuth \
      no_store=true \
      max_ttl=240h
    ```

    Example policy for the role:

    ```hcl
    path "pki/sign/my-issuer" {
      capabilities = ["create", "update"]
    }
    ```

1. Set up authentication between cert-manager and vault using a method of choice, like [SAT](https://developer.hashicorp.com/vault/docs/auth/kubernetes).
1. [Configure the cert-manager Vault Issuer](https://cert-manager.io/docs/configuration/vault/).

---

### Enable TLS for a port

Modify the `tls` setting in a BrokerListener resource to specify a TLS port and Issuer for the frontends. The following is an example of a BrokerListener resource that enables TLS on port 8884 with automatic certificate management.

```yaml
apiVersion: mq.iotoperations.azure.com/v1beta1
kind: BrokerListener
metadata:
  name: my-new-tls-listener
  namespace: azure-iot-operations
spec:
  brokerRef: broker
  authenticationEnabled: false # If set to true, a BrokerAuthentication resource must be configured
  authorizationEnabled: false
  serviceType: loadBalancer # Optional; defaults to 'clusterIP'
  serviceName: my-new-tls-listener # Avoid conflicts with default service name 'aio-mq-dmqtt-frontend'
  port: 8884 # Avoid conflicts with default port 8883
  tls:
    automatic:
      issuerRef:
        name: my-issuer
        kind: Issuer
```

Once the BrokerListener resource is configured, IoT MQ automatically creates a new service with the specified port and TLS enabled.

### Optional: Configure server certificate parameters

The only required parameters are `issuerRef.name` and `issuerRef.kind`. All properties of the generated TLS server certificates are automatically chosen. However, IoT MQ allows certain properties to be customized by specifying them in the BrokerListener resource, under `tls.automatic.issuerRef`. The following is an example of all supported properties:

```yaml
# cert-manager issuer for TLS server certificate. Required.
issuerRef:
  # Name of issuer. Required.
  name: my-issuer
  # 'Issuer' or 'ClusterIssuer'. Required.
  kind: Issuer
  # Issuer group. Optional; defaults to 'cert-manager.io'.
  # External issuers may use other groups.
  group: cert-manager.io
# Namespace of certificate. Optional; omit to use default namespace.
namespace: az
# Where to store the generated TLS server certificate. Any existing
# data at the provided secret will be overwritten.
# Optional; defaults to 'my-issuer-{port}'.
secret: my-issuer-8884
# Parameters for the server certificate's private key.
# Optional; defaults to rotationPolicy: Always, algorithm: ECDSA, size: 256.
privateKey:
  rotationPolicy: Always
  algorithm: ECDSA
  size: 256
# Total lifetime of the TLS server certificate. Optional; defaults to '720h' (30 days).
duration: 720h
# When to begin renewing the certificate. Optional; defaults to '240h' (10 days).
renewBefore: 240h
# Any additional SANs to add to the server certificate. Omit if not required.
san:
  dns:
  - iotmq.example.com
  ip:
  - 192.168.1.1
```

### Verify deployment

Use kubectl to check that the service associated with the BrokerListener resource is running. From the example above, the service name is `my-new-tls-listener` and the namespace is `azure-iot-operations`. The following command checks the service status:

```console 
$ kubectl get service my-new-tls-listener -n azure-iot-operations
NAME                   TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
my-new-tls-listener    LoadBalancer   10.43.241.171   XXX.XX.X.X    8884:32457/TCP   33s
```

### Connect to the broker with TLS

Once the server certificate is configured, TLS is enabled. To test with mosquitto:

```bash
mosquitto_pub -h $HOST -p 8884 -V mqttv5 -i "test" -t "test" -m "test" --cafile ca.crt
```

The `--cafile` argument enables TLS on the mosquitto client and specifies that the client should trust all server certificates issued by the given file. You must specify a file that contains the issuer of the configured TLS server certificate.

Replace `$HOST` with the appropriate host:

- If connecting from [within the same cluster](howto-test-connection.md#connect-from-a-pod-within-the-cluster-with-default-configuration), replace with the service name given (`my-new-tls-listener` in example) or the service `CLUSTER-IP`.
- If connecting from outside the cluster, the service `EXTERNAL-IP`.

Remember to specify authentication methods if needed. For example, username and password.

## Default root CA and issuer with Azure IoT Operations

To help you get started, Azure IoT Operations is deployed with a default "quickstart" root CA and issuer for TLS server certificates. You can use this issuer for development and testing. 

* The CA certificate is self-signed and not trusted by any clients outside of Azure IoT Operations. The subject of the CA certificate is `CN = Azure IoT Operations Quickstart Root CA - Not for Production` and it expires in 30 days from the time of installation.

* The root CA certificate is stored in a Kubernetes secret called `aio-ca-key-pair-test-only`.

* The public portion of the root CA certificate is stored in a ConfigMap called `aio-ca-trust-bundle-test-only`. You can retrieve the CA certificate from the ConfigMap and inspect it with kubectl and openssl.

  ```console
  $ kubectl get configmap aio-ca-trust-bundle-test-only -n azure-iot-operations -o json | jq -r '.data["ca.crt"]' | openssl x509 -text -noout
  Certificate:
      Data:
          Version: 3 (0x2)
          Serial Number:
              74:d8:b6:fe:63:5a:7d:24:bd:c2:c0:25:c2:d2:c7:94:66:af:36:89
          Signature Algorithm: ecdsa-with-SHA256
          Issuer: CN = Azure IoT Operations Quickstart Root CA - Not for Production
          Validity
              Not Before: Nov  2 00:34:31 2023 GMT
              Not After : Dec  2 00:34:31 2023 GMT
          Subject: CN = Azure IoT Operations Quickstart Root CA - Not for Production
          Subject Public Key Info:
              Public Key Algorithm: id-ecPublicKey
                  Public-Key: (256 bit)
                  pub:
                      04:51:43:93:2c:dd:6b:7e:10:18:a2:0f:ca:2e:7b:
                      bb:ba:5c:78:81:7b:06:99:b5:a8:11:4f:bb:aa:0d:
                      e0:06:4f:55:be:f9:5f:9e:fa:14:75:bb:c9:01:61:
                      0f:20:95:cd:9b:69:7c:70:98:f8:fa:a0:4c:90:da:
                      5b:1a:d7:e7:6b
                  ASN1 OID: prime256v1
                  NIST CURVE: P-256
          X509v3 extensions:
              X509v3 Basic Constraints: critical
                  CA:TRUE
              X509v3 Key Usage: 
                  Certificate Sign
              X509v3 Subject Key Identifier: 
                  B6:DD:8A:42:77:05:38:7A:51:B4:8D:8E:3F:2A:D1:79:32:E9:43:B9
      Signature Algorithm: ecdsa-with-SHA256
          30:44:02:20:21:cd:61:d7:21:86:fd:f8:c3:6d:33:36:53:e3:
          a6:06:3c:a6:80:14:13:55:16:f1:19:a8:85:4b:e9:5d:61:eb:
          02:20:3e:85:8a:16:d1:0f:0b:0d:5e:cd:2d:bc:39:4b:5e:57:
          38:0b:ae:12:98:a9:8f:12:ea:95:45:71:bd:7c:de:9d
  ```

* By default, there's already a CA issuer configured in the `azure-iot-operations` namespace called `aio-ca-issuer`. It's used as the common CA issuer for all TLS server certificates for IoT Operations. IoT MQ uses an issuer created from the same CA certificate to issue TLS server certificates for the default TLS listener on port 8883. You can inspect the issuer with the following command:

  ```console
  $ kubectl get issuer aio-ca-issuer -n azure-iot-operations -o yaml
  apiVersion: cert-manager.io/v1
  kind: Issuer
  metadata:
    annotations:
      meta.helm.sh/release-name: azure-iot-operations
      meta.helm.sh/release-namespace: azure-iot-operations
    creationTimestamp: "2023-11-01T23:10:24Z"
    generation: 1
    labels:
      app.kubernetes.io/managed-by: Helm
    name: aio-ca-issuer
    namespace: azure-iot-operations
    resourceVersion: "2036"
    uid: c55974c0-e0c3-4d35-8c07-d5a0d3f79162
  spec:
    ca:
      secretName: aio-ca-key-pair-test-only
  status:
    conditions:
    - lastTransitionTime: "2023-11-01T23:10:59Z"
      message: Signing CA verified
      observedGeneration: 1
      reason: KeyPairVerified
      status: "True"
      type: Ready
  ```

For production, you must configure a CA issuer with a certificate from a trusted CA, as described in the previous sections.

## Related content

- About [BrokerListener resource](howto-configure-brokerlistener.md)
- [Configure authorization for a BrokerListener](./howto-configure-authorization.md)
- [Configure authentication for a BrokerListener](./howto-configure-authentication.md)
- [Configure TLS with manual certificate management](./howto-configure-tls-manual.md)
