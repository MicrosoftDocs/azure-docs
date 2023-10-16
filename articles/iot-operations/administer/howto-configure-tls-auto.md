---
title: Configure TLS with automatic certificate management to secure MQTT communication
# titleSuffix: Azure IoT MQ
description: Configure TLS with automatic certificate management to secure MQTT communication between the MQTT broker and client.
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.date: 10/16/2023

#CustomerIntent: As an operator, I want to configure IoT MQ to use TLS so that I have secure communication between the MQTT broker and client.
---

# Configure TLS with automatic certificate management to secure MQTT communication

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

You can configure TLS to secure MQTT communication between the MQTT broker and client using a [BrokerListener resource](../pub-sub-mqtt/concept-brokerlistener.md). You can configure TLS with manual or automatic certificate management. 

With automatic certificate management, you use cert-manager to manage the TLS server certificate.

1. Cert-manager is required to manage the TLS server certificate. It must be installed prior to any IoT MQ deployment. However, since cert-manager interacts with cluster-wide resources, it's important to install it **no more than once per cluster**. Do not run the commands above if cert-manager is already installed on the cluster.

    Install cert-manager with the following commands:
    
    ```bash
    # Add the repo for cert-manager
    helm repo add jetstack https://charts.jetstack.io
    helm repo update
    
    # Install cert-manager to the new namespace 'cert-manager'.
    # The argument '--set extraArgs[0]...' is not required, but recommended
    # so that cert-manager cleans up deleted certificates.
    helm install cert-manager jetstack/cert-manager \
        --namespace cert-manager \
        --create-namespace \
        --version v1.11 \
        --set installCRDs=true \
        --set extraArgs[0]="--enable-certificate-owner-ref=true"
    ```
    
    For information about uninstalling cert-manager, see [uninstall cert-manager](https://cert-manager.io/docs/installation/helm/#uninstalling).
    
1. To use cert-manager, IoT MQ must be installed with `e4koperator.operator.cert_manager_enabled` set to `true`.  Currently, only the following Azure regions are supported - **eastus**, **eastus2**, **westus2**, and **westus3**.

    ```bash
    az k8s-extension create --extension-type microsoft.alicesprings.dataplane \
    --version {{% version %}} \
    --release-namespace default \
    --name my-e4k-extension \
    --cluster-name friendly \
    --resource-group friendly \
    --cluster-type connectedClusters \
    --release-train private-preview \
    --scope cluster \
    --auto-upgrade-minor-version false \
    --config global.quickstart=true \
    --config e4koperator.operator.cert_manager_enabled=true
    ```
    
    This step must be completed *after* cert-manager is installed because it creates the necessary Kubernetes RBAC permissions for the IoT MQ operator to interact with cert-manager. Creating permissions is only possible once cert-manager CRDs are available in the cluster.

1. Create an Issuer for the TLS server certificate.

    The cert-manager Issuer resource defines how certificates are automatically issued. Cert-manager [supports several Issuers types natively](https://cert-manager.io/docs/configuration/). It also supports an [external](https://cert-manager.io/docs/configuration/external/) issuer type for extending functionality beyond the natively supported issuers. IoT MQ can be used with any type of cert-manager issuer.

    The approach to create the issuer is different depending on your scenario. The following sections list examples to help you get started.

# [Development or test](#tab/test)

The CA issuer is useful for development and testing. It must be configured with a certificate and private key stored in a Kubernetes secret.

### Set up the root certificate as a Kubernetes secret

If you have an existing CA certificate, create a Kubernetes secret with the CA certificate and private key PEM files, and this step is done.

```bash
kubectl create secret tls test-ca --cert ca_cert.pem --key ca_cert_key.pem
```

If you don't have a CA certificate, cert-manager can generate a root CA certificate for you. Using cert-manager to generate a root CA certificate is known as [bootstrapping](https://cert-manager.io/docs/configuration/selfsigned/#bootstrapping-ca-issuers) a CA Issuer with a self-signed certificate. 

1. Start by creating `ca.yaml`:

    ```yaml
    apiVersion: cert-manager.io/v1
    kind: Issuer
    metadata:
      name: selfsigned-ca-issuer
    spec:
      selfSigned: {}
    ---
    apiVersion: cert-manager.io/v1
    kind: Certificate
    metadata:
      name: selfsigned-ca-cert
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
    
    cert-manager creates a CA certificate using its defaults. The properties of this certificate can be changed by modifying the Certificate spec. See [cert-manager documentation](https://cert-manager.io/docs/reference/api-docs/#cert-manager.io/v1.CertificateSpec) for a list of valid options.

### Distribute the root certificate

The example above stores the CA certificate in a Kubernetes secret called `test-ca`. The certificate in PEM format can be retrieved with the following command:

```bash
kubectl get secret test-ca -o json | jq -r '.data["tls.crt"]' | base64 -d
```

This certificate must be distributed and trusted by all clients (`--cafile` for mosquitto client, for example).

### Create Issuer based on CA certificate

Cert-manager needs an Issuer based on the CA certificate generated or imported in the previous step. Create the following file as `issuer-ca.yaml`:

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: e4k-frontend-server
spec:
  ca:
    # Must match secretName of generated or imported CA cert
    secretName: test-ca
```

2. Create the issuer with the following command:

```bash
kubectl apply -f issuer-ca.yaml
```

The command above creates an Issuer for issuing the TLS server certificates. Note the name and kind of the Issuer (`e4k-frontend-server` and `Issuer`, respectively, in the example). These values are set in `values.yaml` under `tls.issuerRef` for a configured TLS listener.

# [Production](#tab/prod)

For production, check cert-manager documentation to see which Issuer works best for you. For example, with [Vault Issuer](https://developer.hashicorp.com/vault/tutorials/kubernetes/kubernetes-cert-manager):

1. Deploy the Vault in an environment of choice, like [Kubernetes](https://developer.hashicorp.com/vault/tutorials/kubernetes/kubernetes-raft-deployment-guide). Initialize and unseal the Vault accordingly.
1. Create and configure the PKI secrets engine by importing your CA certificate.
1. Configure Vault with role and policy for issuing server certificates.

   The following is an example role. Note `ExtKeyUsageServerAuth` makes the server cert work:

   ```bash
   vault write pki/roles/e4k-frontend-server \
     allow_any_name=true \
     client_flag=false \
     ext_key_usage=ExtKeyUsageServerAuth \
     no_store=true \
     max_ttl=240h
   ```

   Example policy for the role:

   ```hcl
   path "pki/sign/e4k-frontend-server" {
     capabilities = ["create", "update"]
   }
   ```

1. Set up authentication between cert-manager and Vault using a method of choice, like [SAT](https://developer.hashicorp.com/vault/docs/auth/kubernetes).
1. [Configure the cert-manager Vault Issuer](https://cert-manager.io/docs/configuration/vault/).

---

### Enable TLS for a port

Modify the `tls` setting in a BrokerListener resource to specify a TLS port and Issuer for the frontends.

```yaml
apiVersion: az-edge.com/v1alpha3
kind: BrokerListener
metadata:
  name: "tls-listener-auto"
  namespace: default
spec:
  brokerRef: "my-broker"
  authenticationEnabled: true
  authorizationEnabled: false
  # Specify port 8883 with TLS
  # Use the Issuer name and kind created in the previous step
  port: 8883
  tls:
    automatic:
      issuerRef:
        name: e4k-frontend-server
        kind: Issuer
```

Once the BrokerListener resource is configured, IoT MQ automatically generates the TLS server certificate and accept TLS connections on the configured port.

### Optional: Configure server certificate parameters

The only required parameters are `issuerRef.name` and `issuerRef.kind`. All properties of the generated TLS server certificates will be automatically chosen. However, IoT MQ allows certain properties to be customized through fields in `values.yaml`. For a full list of customizable settings, see below.

```yaml
# cert-manager issuer for TLS server certificate. Required.
issuerRef:
  # Name of issuer. Required.
  name: e4k-frontend-server
  # 'Issuer' or 'ClusterIssuer'. Required.
  kind: Issuer
  # Issuer group. Optional; defaults to 'cert-manager.io'.
  # External issuers may use other groups.
  group: cert-manager.io
# Namespace of certificate. Optional; omit to use default namespace.
namespace: default
# Where to store the generated TLS server certificate. Any existing
# data at the provided secret will be overwritten.
# Optional; defaults to 'e4k-frontend-server-{port}'.
secret: e4k-frontend-server-8883
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
  - e4k.example.com
  ip:
  - 192.168.1.1
```

### Verify deployment

Use kubectl to check that IoT MQ pods are all ready. It might take a minute or so.

```console
$ kubectl get pods
NAME                                           READY   STATUS    RESTARTS   AGE
azedge-e4k-operator-5d66b67dcf-d6q7n           1/1     Running   0          3m55s
azedge-dmqtt-health-manager-0                  1/1     Running   0          3m33s
azedge-diagnostics-probe-0                     1/1     Running   0          3m30s
azedge-dmqtt-frontend-64dd945945-scrjv         1/1     Running   0          3m30s
azedge-dmqtt-backend-1                         1/1     Running   0          3m30s
azedge-dmqtt-backend-0                         1/1     Running   0          3m30s
azedge-dmqtt-authentication-0                  1/1     Running   0          3m30s
```

If frontend pods are missing, check operator logs with kubectl to see why.

```bash
kubectl logs azedge-dmqtt-health-manager-0
```

Then, if there's an error like:

> User "system:serviceaccount:default:azedge-dmqtt-health-manager" cannot patch resource "certificates" in API group "cert-manager.io" in the namespace "default"

This is because IoT MQ wasn't installed with `e4koperator.operator.cert_manager_enabled=true`. To resolve, enable the setting with Helm and try again.

### Connect to the broker with TLS

Once the server certificate is configured, TLS is enabled. To test with mosquitto:

```bash
mosquitto_pub -h $HOST -p 8883 -V mqttv5 -i "test" -t "test" -m "test" --cafile ca_cert.pem
```

The `--cafile` argument enables TLS on the mosquitto client and specifies that the client should trust all server certificates issued by the given file. You must specify a file that contains the issuer of the configured TLS server certificate.

Replace `$HOST` with the appropriate host:

- If connecting from within the same cluster, `azedge-dmqtt-frontend` (recommended) or the service `CLUSTER-IP`.
- If connecting from outside the cluster, the service `EXTERNAL-IP`.

Remember to specify authentication methods (username, password, etc.) if needed.

## Related content

- BrokerListener resource
- Configure authorization for a BrokerListener
- Configure authentication for a BrokerListener
- Configure TLS with manual certificate management