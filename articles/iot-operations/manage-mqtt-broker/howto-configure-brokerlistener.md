---
title: Secure MQTT broker communication using BrokerListener
description: Understand how to use the BrokerListener resource to secure MQTT broker communications including authorization, authentication, and TLS.
author: PatAltimore
ms.author: patricka
ms.service: azure-iot-operations
ms.subservice: azure-mqtt-broker
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 10/29/2024

#CustomerIntent: As an operator, I want understand options to secure MQTT communications for my IoT Operations solution.
---

# Secure MQTT broker communication using BrokerListener

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

To customize the network access and security use the *BrokerListener* resource. A listener corresponds to a network endpoint that exposes the broker to the network. You can have one or more *BrokerListener* resources for each *Broker* resource, and thus multiple ports with different access control each.

Each listener port can have its own authentication and authorization rules that define who can connect to the listener and what actions they can perform on the broker. You can use *BrokerAuthentication* and *BrokerAuthorization* resources to specify the access control policies for each listener. This flexibility allows you to fine-tune the permissions and roles of your MQTT clients, based on their needs and use cases.

> [!TIP]
> You can only access the default MQTT broker deployment by using the cluster IP, TLS, and a service account token. Clients connecting from outside the cluster need extra configuration before they can connect.

Listeners have the following characteristics:

- You can have up to three listeners. One listener per service type of `loadBalancer`, `clusterIp`, or `nodePort`. The default *BrokerListener* named *default* is service type `clusterIp`.
- Each listener supports multiple ports
- BrokerAuthentication and BrokerAuthorization references are per port
- TLS configuration is per port
- Service names must be unique
- Ports cannot conflict over different listeners

For a list of the available settings, see the [Broker Listener](/rest/api/iotoperationsmq/broker-listener) API reference.

## Default BrokerListener

When you deploy Azure IoT Operations Preview, the deployment also creates a *BrokerListener* resource named `default` in the `azure-iot-operations` namespace. This listener is linked to the default *Broker* resource named `default` that's also created during deployment. The default listener exposes the broker on port 18883 with TLS and SAT authentication enabled. The TLS certificate is [automatically managed](#configure-tls-with-automatic-certificate-management) by cert-manager. Authorization is disabled by default.

To view or edit the listener:

# [Portal](#tab/portal)

1. In the Azure portal, navigate to your IoT Operations instance.
1. Under **Azure IoT Operations resources**, select **MQTT Broker**.

    :::image type="content" source="media/howto-configure-brokerlistener/configure-broker-listener.png" alt-text="Screenshot using Azure portal to view Azure IoT Operations MQTT configuration.":::

1. From the broker listener list, select the **default** listener.

    :::image type="content" source="media/howto-configure-brokerlistener/default-broker-listener.png" alt-text="Screenshot using Azure portal to view or edit the default broker listener.":::

1. Review the listener settings and make any changes as needed.

# [Bicep](#tab/bicep)

To edit the default listener, create a Bicep `.bicep` file with the following content. Update the settings as needed, and replace the placeholder values like `<AIO_INSTANCE_NAME>` with your own.

```bicep
param aioInstanceName string = '<AIO_INSTANCE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'

resource aioInstance 'Microsoft.IoTOperations/instances@2024-08-15-preview' existing = {
  name: aioInstanceName
}
resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}
resource BrokerListener 'Microsoft.IoTOperations/instances/dataflowEndpoints@2024-08-15-preview' = {
  parent: aioInstanceName
  name: endpointName
  extendedLocation: {
    name: customLocationName
    type: 'CustomLocation'
  }
  properties: {
    brokerRef: 'default'
    serviceName: 'aio-broker'
    serviceType: 'ClusterIp'
    ports: [
      {
        authenticationRef: 'default'
        port: 18883
        protocol: 'Mqtt'
        tls: {
          certManagerCertificateSpec: {
            issuerRef: {
              group: 'cert-manager.io'
              kind: 'Issuer'
              name: 'mq-dmqtt-frontend'
            }
          }
          mode: 'Automatic'
        }
      }
    ]
  }
}

```

Deploy the Bicep file using Azure CLI.

```azurecli
az stack group create --name MyDeploymentStack --resource-group <RESOURCE_GROUP> --template-file <FILE>.bicep --dm None --aou deleteResources --yes
```

# [Kubernetes](#tab/kubernetes)

To view the default *BrokerListener* resource, use the following command:

```bash
kubectl get brokerlistener default -n azure-iot-operations -o yaml
```

The output should look similar to this, with most metadata removed for brevity:

```yaml
apiVersion: mqttbroker.iotoperations.azure.com/v1beta1
kind: BrokerListener
metadata:
  name: default
  namespace: azure-iot-operations
spec:
  brokerRef: default
  serviceName: aio-broker
  serviceType: ClusterIp
  ports:
  - authenticationRef: default
    port: 18883
    protocol: Mqtt
    tls:
      certManagerCertificateSpec:
        issuerRef:
          group: cert-manager.io
          kind: Issuer
          name: mq-dmqtt-frontend
      mode: Automatic
```

To learn more about the default BrokerAuthentication resource linked to this listener, see [Default BrokerAuthentication resource](howto-configure-authentication.md#default-brokerauthentication-resource).

### Update the default broker listener

The default *BrokerListener* uses the service type *ClusterIp*. You can have only one listener per service type. If you want to add more ports to service type *ClusterIp*, you can update the default listener to add more ports. For example, you could add a new port 1883 with no TLS and authentication off with the following kubectl patch command:

```bash
kubectl patch brokerlistener default -n azure-iot-operations --type='json' -p='[{"op": "add", "path": "/spec/ports/", "value": {"port": 1883, "protocol": "Mqtt"}}]'
```

---

## Create new broker listeners

This example shows how to create a new *BrokerListener* resource named *loadbalancer-listener* for a *Broker* resource. The *BrokerListener* resource defines a two ports that accept MQTT connections from clients.

- The first port listens on port 1883 with no TLS and authentication off. Clients can connect to the broker without encryption or authentication.
- The second port listens on port 18883 with TLS and authentication enabled. Only authenticated clients can connect to the broker with TLS encryption. TLS is set to `automatic`, which means that the listener uses cert-manager to get and renew its server certificate.

# [Portal](#tab/portal)

1. In the Azure portal, navigate to your IoT Operations instance.
1. Under **Azure IoT Operations resources**, select **MQTT Broker**.
1. Select **MQTT broker listener for LoadBalancer** > **Create**. You can only create one listener per service type. If you already have a listener of the same service type, you can add more ports to the existing listener.

    :::image type="content" source="media/howto-configure-brokerlistener/create-loadbalancer.png" alt-text="Screenshot using Azure portal to create MQTT broker for load balancer listener.":::

    Enter the following settings:

    | Setting        | Description                                                                                   |
    | -------------- | --------------------------------------------------------------------------------------------- |
    | Name           | Name of the BrokerListener resource.                                                          |
    | Service name   | Name of the Kubernetes service associated with the BrokerListener.                            |
    | Service type   | Type of broker service, such as *LoadBalancer*, *NodePort*, or *ClusterIP*.                   |
    | Port           | Port number on which the BrokerListener listens for MQTT connections.                         |
    | Authentication | The [authentication resource reference](howto-configure-authentication.md).                   |
    | Authorization  | The [authorization resource reference](howto-configure-authorization.md).                     |
    | TLS            | Indicates whether TLS is enabled for secure communication. Can be set to [automatic](#configure-tls-with-automatic-certificate-management) or [manual](#configure-tls-with-manual-certificate-management). |

1. Select **Create listener**.

# [Bicep](#tab/bicep)

```bicep
param aioInstanceName string = '<AIO_INSTANCE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'

resource aioInstance 'Microsoft.IoTOperations/instances@2024-08-15-preview' existing = {
  name: aioInstanceName
}
resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}
resource BrokerListener 'Microsoft.IoTOperations/instances/dataflowEndpoints@2024-08-15-preview' = {
  parent: aioInstanceName
  name: endpointName
  extendedLocation: {
    name: customLocationName
    type: 'CustomLocation'
  }
  properties: {
    brokerRef: 'default'
    serviceName: 'aio-broker'
    serviceType: 'ClusterIp'
    ports: [
      {
        authenticationRef: 'default'
        port: 18883
        protocol: 'Mqtt'
        tls: {
          certManagerCertificateSpec: {
            issuerRef: {
              group: 'cert-manager.io'
              kind: 'Issuer'
              name: 'mq-dmqtt-frontend'
            }
          }
          mode: 'Automatic'
        }
      }
    ]
  }
}

```

# [Kubernetes](#tab/kubernetes)

To create these *BrokerListener* resources, apply this YAML manifest to your Kubernetes cluster:

```yaml
apiVersion: mqttbroker.iotoperations.azure.com/v1beta1
kind: BrokerListener
metadata:
  name: loadbalancer-listener
  namespace: azure-iot-operations
spec:
  brokerRef: default
  serviceType: LoadBalancer
  serviceName: aio-broker-loadbalancer
  ports:
  - port: 1883
    protocol: Mqtt
  - port: 18883
    authenticationRef: default
    protocol: Mqtt
    tls:
      mode: Automatic
      certManagerCertificateSpec:
        issuerRef:
            name: e2e-cert-issuer
            kind: Issuer
            group: cert-manager.io
```

For more information about authentication, see [Configure MQTT broker authentication](howto-configure-authentication.md). For more information about authorization, see [Configure MQTT broker authorization](howto-configure-authorization.md). For more information about TLS, see [Configure TLS with automatic certificate management](#configure-tls-with-automatic-certificate-management) or [Configure TLS with manual certificate management](#configure-tls-with-manual-certificate-management) sections.

---

## Configure TLS with automatic certificate management

To enable TLS with automatic certificate management, specify the TLS settings on a listener port.

### Verify cert-manager installation

With automatic certificate management, you use cert-manager to manage the TLS server certificate. By default, cert-manager is installed alongside Azure IoT Operations Preview in the `azure-iot-operations` namespace already. Verify the installation before proceeding.

1. Use `kubectl` to check for the pods matching the cert-manager app labels.

    ```bash
    kubectl get pods --namespace azure-iot-operations -l 'app in (cert-manager,cainjector,webhook)'
    ```
    
    ```Output
    NAME                                           READY   STATUS    RESTARTS       AGE
    aio-cert-manager-64f9548744-5fwdd              1/1     Running   4 (145m ago)   4d20h
    aio-cert-manager-cainjector-6c7c546578-p6vgv   1/1     Running   4 (145m ago)   4d20h
    aio-cert-manager-webhook-7f676965dd-8xs28      1/1     Running   4 (145m ago)   4d20h
    ```

1. If you see the pods shown as ready and running, cert-manager is installed and ready to use. 

> [!TIP]
> To further verify the installation, check the cert-manager documentation [verify installation](https://cert-manager.io/docs/installation/kubernetes/#verifying-the-installation). Remember to use the `azure-iot-operations` namespace.

### Create an Issuer for the TLS server certificate

The cert-manager *Issuer* resource defines how certificates are automatically issued. Cert-manager [supports several Issuers types natively](https://cert-manager.io/docs/configuration/). It also supports an [external](https://cert-manager.io/docs/configuration/external/) issuer type for extending functionality beyond the natively supported issuers. MQTT broker can be used with any type of cert-manager issuer.

> [!IMPORTANT]
> During initial deployment, Azure IoT Operations is installed with a default Issuer for TLS server certificates. You can use this issuer for development and testing. For more information, see [Default root CA and issuer with Azure IoT Operations](#default-root-ca-and-issuer). The steps below are only required if you want to use a different issuer.

The approach to create the issuer is different depending on your scenario. The following sections list examples to help you get started.

# [Development or test](#tab/test)

The CA issuer is useful for development and testing. It must be configured with a certificate and private key stored in a Kubernetes secret.

#### Set up the root certificate as a Kubernetes secret

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

Cert-manager creates a CA certificate using its defaults. The properties of this certificate can be changed by modifying the Certificate specification. See [cert-manager documentation](https://cert-manager.io/docs/reference/api-docs/#cert-manager.io/v1.CertificateSpec) for a list of valid options.

#### Distribute the root certificate

The prior example stores the CA certificate in a Kubernetes secret called `test-ca`. The certificate in PEM format can be retrieved from the secret and stored in a file `ca.crt` with the following command:

```bash
kubectl get secret test-ca -n azure-iot-operations -o json | jq -r '.data["tls.crt"]' | base64 -d > ca.crt
```

This certificate must be distributed and trusted by all clients. For example, use `--cafile` flag for a mosquitto client.

#### Create issuer based on CA certificate

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

### Enable TLS automatic certificate management for a port

The following is an example of a BrokerListener resource that enables TLS on port 8884 with automatic certificate management.

# [Portal](#tab/portal)

1. In the Azure portal, navigate to your IoT Operations instance.
1. Under **Azure IoT Operations resources**, select **MQTT Broker**.
1. Select or create a listener. You can only create one listener per service type. If you already have a listener of the same service type, you can add more ports to the existing listener.
1. You can add TLS settings to the listener by selecting the **TLS** on an existing port or by adding a new port.

    :::image type="content" source="media/howto-configure-brokerlistener/tls-auto.png" alt-text="Screenshot using Azure portal to create MQTT broker for load balancer listener with automatic TLS certificates." lightbox="media/howto-configure-brokerlistener/tls-auto.png":::

    Enter the following settings:

    | Setting        | Description                                                                                   |
    | -------------- | --------------------------------------------------------------------------------------------- |
    | Port           | Port number on which the BrokerListener listens for MQTT connections.  Required.              |
    | Authentication | The [authentication resource reference](howto-configure-authentication.md).                   |
    | Authorization  | The [authorization resource reference](howto-configure-authorization.md).                     |
    | TLS            | Select the *Add* button.                                                                      |
    | Issuer name    | Name of the cert-manager issuer. Required.                                                    |
    | Issuer kind    | Kind of the cert-manager issuer. Required.                                                    |
    | Issuer group   | Group of the cert-manager issuer. Required.                                                   |
    | Private key algorithm | Algorithm for the private key.                                                         |
    | Private key rotation policy | Policy for rotating the private key.                                             |
    | DNS names      | DNS subject alternate names for the certificate.                                              |
    | IP addresses   | IP addresses of the subject alternate names for the certificate.                              |
    | Secret name    | Kubernetes secret containing an X.509 client certificate.                                     |
    | Duration       | Total lifetime of the TLS server certificate Defaults to 90 days.                             |
    | Renew before   | When to begin renewing the certificate.                                                       |

1. Select **Save** to save the TLS settings.

# [Bicep](#tab/bicep)

```bicep
param aioInstanceName string = '<AIO_INSTANCE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'

resource aioInstance 'Microsoft.IoTOperations/instances@2024-08-15-preview' existing = {
  name: aioInstanceName
}
resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}
resource BrokerListener 'Microsoft.IoTOperations/instances/dataflowEndpoints@2024-08-15-preview' = {
  parent: aioInstanceName
  name: endpointName
  extendedLocation: {
    name: customLocationName
    type: 'CustomLocation'
  }
  properties: {
    brokerRef: 'default'
    serviceType: 'loadBalancer'
    serviceName: 'aio-broker-loadbalancer-tls'
    ports: [
      {
        port: 8884
        tls: {
          mode: 'Automatic'
          certManagerCertificateSpec: {
            issuerRef: {
              name: 'my-issuer'
              kind: 'Issuer'
            }
          }
        }
      }
    ]
  }
}

```

#### Optional: Configure server certificate parameters

The only required parameters are `issuerRef.name` and `issuerRef.kind`. All properties of the generated TLS server certificates are automatically chosen. However, MQTT broker allows certain properties to be customized by specifying them in the BrokerListener resource, under `tls.automatic.issuerRef`. The following is an example of all supported properties:

```bicep
    ports: [
      {
        port: 8884
        tls: {
          mode: 'Automatic'
          certManagerCertificateSpec: {
            issuerRef: {
              // Name of issuer. Required.
              name: 'my-issuer'
              // 'Issuer' or 'ClusterIssuer'. Required.
              kind: 'Issuer'
              // Issuer group. Optional; defaults to 'cert-manager.io'.
              // External issuers may use other groups.
              group: 'cert-manager.io'
            }
            // Namespace of certificate. Optional; omit to use default namespace.
            namespace: 'az'
            // Where to store the generated TLS server certificate. Any existing
            // data at the provided secret will be overwritten.
            // Optional; defaults to 'my-issuer-{port}'.
            secret: 'my-issuer-8884'
            // Parameters for the server certificate's private key.
            // Optional; defaults to rotationPolicy: Always, algorithm: ECDSA, size: 256.
            privateKey: {
              rotationPolicy: 'Always'
              algorithm: 'ECDSA'
              size: 256
            }
            // Total lifetime of the TLS server certificate. Optional; defaults to '720h' (30 days).
            duration: '720h'
            // When to begin renewing the certificate. Optional; defaults to '240h' (10 days).
            renewBefore: '240h'
            // Any additional SANs to add to the server certificate. Omit if not required.
            san: {
              dns: [
                'iotmq.example.com'
                // To connect to the broker from a different namespace, add the following DNS name:
                'aio-broker.azure-iot-operations.svc.cluster.local'
              ]
              ip: [
                '192.168.1.1'
              ]
            }
          }
        }
      }

```

# [Kubernetes](#tab/kubernetes)

Modify the `tls` setting in a BrokerListener resource to specify a TLS port and *Issuer* for the frontends.

```yaml
apiVersion: mqttbroker.iotoperations.azure.com/v1beta1
kind: BrokerListener
metadata:
  name: loadbalancer-tls
  namespace: azure-iot-operations
spec:
  brokerRef: default
  serviceType: loadBalancer
  serviceName: aio-broker-loadbalancer-tls # Avoid conflicts with default service name 'aio-broker'
  ports:
  - port: 8884 # Avoid conflicts with default port 18883
    tls:
      mode: Automatic
      certManagerCertificateSpec:
        issuerRef:
          name: my-issuer
          kind: Issuer
```

Once the BrokerListener resource is configured, MQTT broker automatically creates a new service with the specified port and TLS enabled.

#### Optional: Configure server certificate parameters

The only required parameters are `issuerRef.name` and `issuerRef.kind`. All properties of the generated TLS server certificates are automatically chosen. However, MQTT broker allows certain properties to be customized by specifying them in the BrokerListener resource, under `tls.automatic.issuerRef`. The following is an example of all supported properties:

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
  # To connect to the broker from a different namespace, add the following DNS name:
  - aio-broker.azure-iot-operations.svc.cluster.local
  ip:
  - 192.168.1.1
```

#### Verify deployment

Use kubectl to check that the service associated with the BrokerListener resource is running. From the example above, the service name is `my-new-tls-listener` and the namespace is `azure-iot-operations`. The following command checks the service status:

```console 
$ kubectl get service my-new-tls-listener -n azure-iot-operations
NAME                   TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
my-new-tls-listener    LoadBalancer   10.X.X.X        172.X.X.X     8884:32457/TCP   33s
```

---

#### Connect to the broker with TLS

Once the server certificate is configured, TLS is enabled. To test with mosquitto:

```bash
mosquitto_pub -h $HOST -p 8884 -V mqttv5 -i "test" -t "test" -m "test" --cafile ca.crt
```

The `--cafile` argument enables TLS on the mosquitto client and specifies that the client should trust all server certificates issued by the given file. You must specify a file that contains the issuer of the configured TLS server certificate.

Replace `$HOST` with the appropriate host:

- If connecting from [within the same cluster](howto-test-connection.md#connect-from-a-pod-within-the-cluster-with-default-configuration), replace with the service name given (`my-new-tls-listener` in example) or the service `CLUSTER-IP`.
- If connecting from outside the cluster, the service `EXTERNAL-IP`.

Remember to specify authentication methods if needed.

### Default root CA and issuer

To help you get started, Azure IoT Operations is deployed with a default "quickstart" root CA and issuer for TLS server certificates. You can use this issuer for development and testing. For more information, see [Default root CA and issuer for TLS server certificates](../deploy-iot-ops/concept-default-root-ca.md).

For production, you must configure a CA issuer with a certificate from a trusted CA, as described in the previous sections.


## Configure TLS with manual certificate management

To manually configure MQTT broker to use a specific TLS certificate, specify it in a BrokerListener resource with a reference to a Kubernetes secret. Then deploy it using kubectl. This article shows an example to configure TLS with self-signed certificates for testing.

### Create certificate authority with Step CLI

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

### Create server certificate

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

Here, `mqtts-endpoint` and `localhost` are the Subject Alternative Names (SANs) for MQTT broker's frontend in Kubernetes and local clients, respectively. To connect over the internet, add a `--san` with [an external IP](#use-external-ip-for-the-server-certificate). The `--no-password --insecure` flags are used for testing to skip password prompts and disable password protection for the private key because it's stored in a Kubernetes secret. For production, use a password and store the private key in a secure location like Azure Key Vault.

#### Certificate key algorithm requirements

Both EC and RSA keys are supported, but all certificates in the chain must use the same key algorithm. If you import your own CA certificates, ensure that the server certificate uses the same key algorithm as the CAs.

### Import server certificate chain as a Kubernetes secret

1. Create a full server certificate chain, where the order of the certificates matters: the server certificate is the first one in the file, the intermediate is the second.

    ```bash
    cat  mqtts-endpoint.crt intermediate_ca.crt  > server_chain.crt
    ```

1. Create a Kubernetes secret with the server certificate chain and server key using kubectl.

    ```bash
    kubectl create secret tls server-cert-secret -n azure-iot-operations \
    --cert server_chain.crt \
    --key mqtts-endpoint.key
    ```

### Enable TLS manual certificate management for a port

The following is an example of a BrokerListener resource that enables TLS on port 8884 with manual certificate management.

# [Portal](#tab/portal)

1. In the Azure portal, navigate to your IoT Operations instance.
1. Under **Azure IoT Operations resources**, select **MQTT Broker**.
1. Select or create a listener. You can only create one listener per service type. If you already have a listener of the same service type, you can add more ports to the existing listener.
1. You can add TLS settings to the listener by selecting the **TLS** on an existing port or by adding a new port.

    :::image type="content" source="media/howto-configure-brokerlistener/tls-manual.png" alt-text="Screenshot using Azure portal to create MQTT broker for load balancer listener with manual TLS certificates." lightbox="media/howto-configure-brokerlistener/tls-manual.png":::

    Enter the following settings:

    | Setting        | Description                                                                                   |
    | -------------- | --------------------------------------------------------------------------------------------- |
    | Port           | Port number on which the BrokerListener listens for MQTT connections.  Required.              |
    | Authentication | The [authentication resource reference](howto-configure-authentication.md).                   |
    | Authorization  | The [authorization resource reference](howto-configure-authorization.md).                     |
    | TLS            | Select the *Add* button.                                                                      |
    | Secret name    | Kubernetes secret containing an X.509 client certificate.                                     |

1. Select **Save** to save the TLS settings.

# [Bicep](#tab/bicep)

```bicep
param aioInstanceName string = '<AIO_INSTANCE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'

resource aioInstance 'Microsoft.IoTOperations/instances@2024-08-15-preview' existing = {
  name: aioInstanceName
}
resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}
resource BrokerListener 'Microsoft.IoTOperations/instances/dataflowEndpoints@2024-08-15-preview' = {
  parent: aioInstanceName
  name: endpointName
  extendedLocation: {
    name: customLocationName
    type: 'CustomLocation'
  }
  properties: {
    brokerRef: 'default'
    // Optional, defaults to clusterIP
    serviceType: 'loadBalancer'
    // Match the SAN in the server certificate
    serviceName: 'aio-broker-loadbalancer-tls'
    ports: [
      {
        // Avoid port conflict with default listener at 18883
        port: 8885
        tls: {
          mode: 'Manual'
          manual: {
            secretRef: 'server-cert-secret'
          }
        }
      }
    ]
  }
}

```

# [Kubernetes](#tab/kubernetes)

Modify the `tls` setting in a *BrokerListener* resource to specify manual TLS configuration referencing the Kubernetes secret. Note the name of the secret used for the TLS server certificate (`server-cert-secret` in the example previously).

```yaml
apiVersion: mqttbroker.iotoperations.azure.com/v1beta1
kind: BrokerListener
metadata:
  name: loadbalancer-tls
  namespace: azure-iot-operations
spec:
  brokerRef: default
  serviceType: loadBalancer # Optional, defaults to clusterIP
  serviceName: aio-broker-loadbalancer-tls # Match the SAN in the server certificate
  ports:
  - port: 8885 # Avoid port conflict with default listener at 18883
    tls:
      mode: Manual
      manual:
        secretRef: server-cert-secret
```

Once the *BrokerListener* resource is created, the operator automatically creates a Kubernetes service and deploys the listener. You can check the status of the service by running `kubectl get svc`.

---

### Connect to the broker with TLS

To test the TLS connection with mosquitto client, publish a message and pass the root CA certificate in the parameter `--cafile`.

```bash
mosquitto_pub -d -h localhost -p 8885 -i "my-client" -t "test-topic" -m "Hello" --cafile root_ca.crt
```

```Output
Client my-client sending CONNECT
Client my-client received CONNACK (0)
Client my-client sending PUBLISH (d0, q0, r0, m1, 'test-topic', ... (5 bytes))
Client my-client sending DISCONNECT
```

> [!TIP]
> To use localhost, the port must be available on the host machine. For example, `kubectl port-forward svc/mqtts-endpoint 8885:8885 -n azure-iot-operations`. With some Kubernetes distributions like K3d, you can add a forwarded port with `k3d cluster edit $CLUSTER_NAME --port-add 8885:8885@loadbalancer`.

> [!NOTE]
> To connect to the broker you need to distribute root of trust to the clients, also known as trust bundle. In this case the root of trust is the self-signed root CA created Step CLI. Distribution of root of trust is required for the client to verify the server certificate chain. If your MQTT clients are workloads on the Kubernetes cluster you also need to create a ConfigMap with the root CA and mount it in your Pod.

Remember to specify username, password, etc. if MQTT broker authentication is enabled.

#### Use external IP for the server certificate

To connect with TLS over the internet, MQTT broker's server certificate must have its external hostname as a SAN. In production, this is usually a DNS name or a well-known IP address. However, during dev/test, you might not know what hostname or external IP is assigned before deployment. To solve this, deploy the listener without the server certificate first, then create the server certificate and secret with the external IP, and finally import the secret to the listener.

If you try to deploy the example TLS listener `manual-tls-listener` but the referenced Kubernetes secret `server-cert-secret` doesn't exist, the associated service gets created, but the pods don't start. The service is created because the operator needs to reserve the external IP for the listener.

```bash
kubectl get svc mqtts-endpoint -n azure-iot-operations
```

```Output
NAME                   TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)             AGE
mqtts-endpoint         LoadBalancer   10.X.X.X        172.X.X.X     8885:30674/TCP      1m15s
```

However, this behavior is expected and it's okay to leave it like this while we import the server certificate. The health manager logs mention MQTT broker is waiting for the server certificate.

```bash
kubectl logs -l app=health-manager -n azure-iot-operations
```

```Output
...
<6>2023-11-06T21:36:13.634Z [INFO] [1] - Server certificate server-cert-secret not found. Awaiting creation of secret.
```

> [!NOTE]
> Generally, in a distributed system, pods logs aren't deterministic and should be used with caution. The right way for information like this to surface is through Kubernetes events and custom resource status, which is in the backlog. Consider the previous step as a temporary workaround.

Even though the frontend pods aren't up, the external IP is already available.

```bash
kubectl get svc mqtts-endpoint -n azure-iot-operations
```

```Output
NAME                   TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)             AGE
mqtts-endpoint         LoadBalancer   10.X.X.X        172.X.X.X     8885:30674/TCP      1m15s
```

From here, follow the same steps as previously to create a server certificate with this external IP in `--san` and create the Kubernetes secret in the same way. Once the secret is created, it's automatically imported to the listener. 

## Related content

- [Configure MQTT broker authorization](howto-configure-authorization.md)
- [Configure MQTT broker authentication](howto-configure-authentication.md)
