---
title: Connect an OPC UA server
description: How to connect an OPC UA server to Azure IoT OPC UA Broker (preview)
author: timlt
ms.author: timlt
# ms.subservice: opcua-broker
ms.topic: how-to 
ms.date: 10/23/2023

# CustomerIntent: As an industrial edge IT or operations user, I want to to connect an OPC UA server to 
# Azure IoT OPC UA Broker. This enables OPC UA servers in my solution to exchange data with my cluster.
---

# Connect an OPC UA server to Azure IoT OPC UA Broker (preview)

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this article, you learn how to connect an OPC UA server to Azure IoT OPC UA Broker (preview). You can then start to use OPC UA Broker to define and manage OPC UA assets.

## Prerequisites

- Install OPC UA Broker. For more information, see [Install Azure IoT OPC UA Broker (preview) by using helm](howto-install-opcua-broker-using-helm.md).

## Features supported

The following features are supported to connect an OPC UA server: 

| Feature                                                 | Supported | Symbol     |
| ------------------------------------------------------- | --------- | :-------:  |
| High Availability                                       | Supported |     ✅     |
| Payload Compression                                     | Supported |     ✅     |
| Configure OPC UA Connector Application name             | Supported |     ✅     |
| Anonymous user authentication                           | Supported |     ✅     |
| Username and Password user authentication               | Supported |     ✅     |
| Manage OPC UA Connector Application certificate         | Supported |     ✅     |
| Autoaccept untrusted certificates                       | Supported |     ✅     |
| Configure default Subscription PublishingInterval       | Supported |     ✅     |
| Configure default MonitoredItem SamplingInterval        | Supported |     ✅     |
| Configure default MonitoredItem QueueSize               | Supported |     ✅     |
| Configure endpoint selection based on Security level    | Supported |     ✅     |
| Configure max number of MonitoredItems per Subscription | Supported |     ✅     |
| Configure OPC UA Session creation timeout               | Supported |     ✅     |


## Set up sample lab environments
For each OPC UA Server endpoint, start a separate OPC UA Connector and pass in the OPC UA Discovery URL of the OPC UA Server.

### Connect with anonymous access
This example shows how to connect an OPC UA server with anonymous access to publish telemetry into an MQTT broker.

The value of `opcUaConnector.settings.discoveryUrl` is set to `opc.tcp://opcplc-000000.opcuabroker:50000` in the following code example.  This value is the address of the sample OPC PLC deployed in the namespace of OPC UA Broker runtime. The value needs to be changed accordingly if a namespace other than `opcuabroker` was used for deployment of OPC UA Broker, or if you need to connect to a different OPC UA Server.

# [bash](#tab/bash)

```bash
helm upgrade -i aio-opcplc-connector oci://mcr.microsoft.com/opcuabroker/helmchart/aio-opc-opcua-connector \
  --version 0.1.0-preview.2 \
  --namespace opcuabroker \
  --set opcUaConnector.settings.discoveryUrl="opc.tcp://opcplc-000000.opcuabroker:50000" \
  --set opcUaConnector.settings.autoAcceptUntrustedCertificates=true \
  --wait
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
helm upgrade -i aio-opcplc-connector oci://mcr.microsoft.com/opcuabroker/helmchart/aio-opc-opcua-connector `
  --version 0.1.0-preview.2 `
  --namespace opcuabroker `
  --set opcUaConnector.settings.discoveryUrl="opc.tcp://opcplc-000000.opcuabroker:50000" `
  --set opcUaConnector.settings.autoAcceptUntrustedCertificates=true `
  --wait
```
---

The OPC UA Server is the container build from a [GitHub repository](https://github.com/Azure-Samples/iot-edge-opc-plc). The command line reference on GitHub shows the default username and password, which you can use optionally. To use the defaults, place them in shell variables as shown in code examples in the following section.

### Connect with username and password
This section contains examples that show how to connect an OPC UA server by using a username and password. OPC UA Broker stores all secrets like usernames, passwords, certificates, and certificate lists in secrets. 

The following types of secrets are supported:

- [Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)
- Secrets provided by [Azure Key Vault provider for Secrets Store CSI Driver](../../aks/csi-secrets-store-driver.md)

A Kubernetes Secret is structured as a dictionary holding multiple key-value pairs. Each key-value pair stores the sensitive data in the value.
The same approach applies to CSI secrets, they contain sensitive credentials in the form of key-value pairs.

OPC UA Broker only uses references to secrets and doesn't directly use sensitive values. The type of secrets that OPC UA Broker should reference is specified at deployment time in the `secrets.kind` configuration parameter. For more information, see [Install Azure IoT OPC UA Broker (preview) by using helm](howto-install-opcua-broker-using-helm.md).

OPC UA Broker supports two types of references to secrets:

- `<secret>` is intended to reference all key-value pairs in the secret. OPC UA Broker dereferences it by creating a file for each key-value pair that is named after the key, and by using the value as the file's content. All the files are added to a directory named `<secret>`. This directory is mapped into the file system of a pod that uses the secret reference. You can use the `<secret>` type to reference secrets like certificate lists.
- `<secret>/<key>` is intended to reference only one key-value pair of the secret identified by `<key>`. In this case, the dereferencing only creates one file with filename `<key>` and uses the value as the file's content. The file is added to a directory named `<secret>`. This directory is mapped into the file system of a pod that uses the secret reference. You can use the `<secret>/<key>` type to reference secrets like username, password, and others.

#### Connect with username and password stored in Kubernetes Secrets
This example shows how to connect an OPC UA server with a username and password stored in Kubernetes Secrets. 

OPC UA Broker uses [Container Storage Interface](https://kubernetes.io/blog/2019/01/15/container-storage-interface-ga/) (CSI) for Kubernetes to mount secrets into volumes and keep the secrets data up to date. Ensure that the Kubernetes Secrets are deployed in the same namespace and before OPC UA Connector is deployed.

> [!NOTE]
> The following steps apply if you set `secrets.kind` to `k8s` during [installation of OPC UA Broker](howto-install-opcua-broker-using-helm.md).

# [bash](#tab/bash)

```bash
# Load secrets and store them into shell variables
Username="$(cat /tmp/opcuabroker/secrets/username)"
Password="$(cat /tmp/opcuabroker/secrets/password)"
RuntimeNamespace="opcuabroker"

# Create deployment namespace where Secret will be placed
kubectl create namespace $RuntimeNamespace

# Create Kubernetes Secret
kubectl create secret generic opc-ua-connector-secrets --from-literal=username=$Username --from-literal=password=$Password --namespace $RuntimeNamespace

# Install OPC UA Connector
helm upgrade -i aio-opcplc-connector oci://mcr.microsoft.com/opcuabroker/helmchart/aio-opc-opcua-connector \
  --version 0.1.0-preview.2 \
  --namespace opcuabroker \
  --set opcUaConnector.settings.discoveryUrl="opc.tcp://opcplc-000000.opcuabroker:50000" \
  --set opcUaConnector.settings.authenticationMode="UsernamePassword" \
  --set opcUaConnector.settings.userNameReference="opc-ua-connector-secrets/username" \
  --set opcUaConnector.settings.passwordReference="opc-ua-connector-secrets/password" \
  --set opcUaConnector.settings.autoAcceptUntrustedCertificates=true \
  --wait
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
# Load secrets and store them into shell variables
$Username=Get-Content /tmp/opcuabroker/secrets/username
$Password=Get-Content  /tmp/opcuabroker/secrets/password
$RuntimeNamespace="opcuabroker"

# Create deployment namespace where Secret will be placed
kubectl create namespace $RuntimeNamespace

# Create Kubernetes Secret
kubectl create secret generic opc-ua-connector-secrets --from-literal=username=$Username --from-literal=password=$Password --namespace $RuntimeNamespace

# Install OPC UA Connector
helm upgrade -i aio-opcplc-connector oci://mcr.microsoft.com/opcuabroker/helmchart/aio-opc-opcua-connector `
  --version 0.1.0-preview.2 `
  --namespace opcuabroker `
  --set opcUaConnector.settings.discoveryUrl="opc.tcp://opcplc-000000.opcuabroker:50000" `
  --set opcUaConnector.settings.authenticationMode="UsernamePassword" `
  --set opcUaConnector.settings.userNameReference="opc-ua-connector-secrets/username" `
  --set opcUaConnector.settings.passwordReference="opc-ua-connector-secrets/password" `
  --set opcUaConnector.settings.autoAcceptUntrustedCertificates=true `
  --wait
```
---

#### Connect with username and password stored in Azure Key Vault
This example shows how to connect an OPC UA server with a username and password stored in Azure Key Vault.  

To access a username and password stored in Azure Key Vault, confirm the following criteria are true:

- An Azure Key Vault instance and provider are configured to allow access. For more information, see [Provide an identity to access the Azure Key Vault provider for Secrets Store CSI Driver in Azure Kubernetes Service (AKS)](../../aks/csi-secrets-store-identity-access.md).
- Azure Key Vault Secrets are created and contain the username and password.
- An instance of the `SecretProviderClass` custom resource is created with configuration to reference Azure Key Vault secrets.
- The `aio-opc-opcua-connector` helm chart is deployed with references to the `SecretProviderClass` instance.

> [!NOTE]
> The following steps apply if you set `secrets.kind` to `csi` during [installation of OPC UA Broker](howto-install-opcua-broker-using-helm.md).

To create Azure Key Vault secrets, see the following code: 

# [bash](#tab/bash)

```bash
# Create username Secret in Azure Key Vault
az keyvault secret set --name "username" --vault-name <azure-key-vault-name> --value "user1" --content-type "text/plain"

# Create password Secret in Azure Key Vault
az keyvault secret set --name "password" --vault-name <azure-key-vault-name> --value "password" --content-type "text/plain"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
# Create username Secret in Azure Key Vault
az keyvault secret set --name "username" --vault-name <azure-key-vault-name> --value "user1" --content-type "text/plain"

# Create password Secret in Azure Key Vault
az keyvault secret set --name "password" --vault-name <azure-key-vault-name> --value "password" --content-type "text/plain"
```
---

To create an instance of the `SecretProviderClass` custom resource, first store the values in a file named `aio-opc-ua-broker-user-authentication.yaml` as shown in the following example:

```yml
apiVersion: secrets-store.csi.x-k8s.io/v1
kind: SecretProviderClass
metadata:
  name: aio-opc-ua-broker-user-authentication
  namespace: opcuabroker
spec:
  provider: azure
  parameters:
    usePodIdentity: 'false'
    keyvaultName: <azure-key-vault-name>
    tenantId: <azure-tenant-id>
    objects: |
      array:
        - |
          objectName: username
          objectType: secret
          objectVersion: ""
        - |
          objectName: password
          objectType: secret
          objectVersion: ""
```

For more samples and a description of fields, see the [Azure/secrets-store-csi-driver-provider-azure](https://github.com/Azure/secrets-store-csi-driver-provider-azure) repository.

To create an instance of `SecretProviderClass` custom resource, see the following code:

# [bash](#tab/bash)

```bash
kubectl apply -f aio-opc-ua-broker-user-authentication.yaml --namespace opcuabroker
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
kubectl apply -f aio-opc-ua-broker-user-authentication.yaml --namespace opcuabroker
```
---

To reference the `SecretProviderClass` instance in a deployment, you can reference the `aio-opc-ua-broker-user-authentication` `SecretProviderClass` instance you created, and access the `username` and `password` secrets.  Reference the instance as shown in the following code: 

# [bash](#tab/bash)

```bash
helm upgrade -i aio-opcplc-connector oci://mcr.microsoft.com/opcuabroker/helmchart/aio-opc-opcua-connector \
  --version 0.1.0-preview.2 \
  --namespace opcuabroker \
  --create-namespace \
  --set opcUaConnector.settings.discoveryUrl="opc.tcp://opcplc-000000.opcuabroker:50000" \
  --set opcUaConnector.settings.autoAcceptUntrustedCertificates=true \
  --set opcUaConnector.settings.authenticationMode="UsernamePassword" \
  --set opcUaConnector.settings.usernameReference="aio-opc-ua-broker-user-authentication/username" \
  --set opcUaConnector.settings.passwordReference="aio-opc-ua-broker-user-authentication/password" \
  --wait
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
helm upgrade -i aio-opcplc-connector oci://mcr.microsoft.com/opcuabroker/helmchart/aio-opc-opcua-connector `
  --version 0.1.0-preview.2 `
  --namespace opcuabroker `
  --create-namespace `
  --set opcUaConnector.settings.discoveryUrl="opc.tcp://opcplc-000000.opcuabroker:50000" `
  --set opcUaConnector.settings.autoAcceptUntrustedCertificates=true `
  --set opcUaConnector.settings.authenticationMode="UsernamePassword" `
  --set opcUaConnector.settings.usernameReference="aio-opc-ua-broker-user-authentication/username" `
  --set opcUaConnector.settings.passwordReference="aio-opc-ua-broker-user-authentication/password" `
  --wait
```
---

### Connect and provide an application certificate for OPC UA Connector
By default, the OPC UA Connector module creates a self-signed X.509 V3 application certificate on startup. This self-signed certificate is useful for demonstration. 

> [!IMPORTANT]
> For production use, Microsoft strongly recommends using your own certificates with a higher level of cryptographic trust.

OPC UA Connector supports configuration of the application certificate to be used along with its private key, by using helm chart values. A secret is used for storing the certificate and its private key, which is then mounted to the pod of OPC UA Connector for consumption.

To configure a custom application certificate, you need the following items: 

- A certificate in DER format stored in a file with `.der` extension
- A private key stored in the [PKCS #12](https://reference.opcfoundation.org/GDS/v105/docs/2#PKCS12) format with a `.pfx` extension, or stored in the OpenSSL PEM format
- A thumbprint of the certificate

Next, create a secret that contains the certificate and the private key. Create the secret in the namespace where `aio-opcplc-connector` helm chart is deployed.

> [!NOTE]
> The certificate and the private key should have the same base filename (apart from extension). Otherwise the OPC UA stack fails to find a matching private key.

#### Generate a self-signed application certificate using OpenSSL
To generate a self-signed application certificate using OpenSSL, use the following example code: 

# [bash](#tab/bash)

```bash
# Create cert.pem and key.pem
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -sha256 -days 365 -nodes \
  -subj "/CN=opcuabroker-opc-ua-connector" \
  -addext "subjectAltName=URI:urn:microsoft.com:opc:ua:opcuaconnector" \
  -addext "keyUsage=critical, nonRepudiation, digitalSignature, keyEncipherment, dataEncipherment, keyCertSign" \
  -addext "extendedKeyUsage = critical, serverAuth, clientAuth"

mkdir secret

# Transform cert.pem to cert.der
openssl x509 -outform der -in cert.pem -out secret/cert.der

# Rename key.pem to cert.pem as the private key needs to have the same file name as the certificate
cp key.pem secret/cert.pem

# Get thumbprint of the certificate
Thumbprint="$(openssl dgst -sha1 -hex  secret/cert.der | cut -d' ' -f2)"
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
# Create cert.pem and key.pem
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -sha256 -days 365 -nodes `
  -subj "/CN=opcuabroker-opc-ua-connector" `
  -addext "subjectAltName=URI:urn:microsoft.com:opc:ua:opcuaconnector" `
  -addext "keyUsage=critical, nonRepudiation, digitalSignature, keyEncipherment, dataEncipherment, keyCertSign" `
  -addext "extendedKeyUsage = critical, serverAuth, clientAuth"

md secret

# Transform cert.pem to cert.der
openssl x509 -outform der -in cert.pem -out secret/cert.der

# Rename key.pem to cert.pem as the private key needs to have the same file name as the certificate
copy key.pem secret/cert.pem

# Get thumbprint of the certificate
$Thumbprint = (Get-FileHash -Path secret/cert.der -Algorithm SHA1).Hash
```
---

#### Use Kubernetes Secrets
This section shows how to use Kubernetes Secrets in your application.

> [!NOTE]
> The following steps apply if you set `secrets.kind` to `k8s` during [installation of OPC UA Broker](howto-install-opcua-broker-using-helm.md).

##### Store the application certificate and its private key in a Kubernetes Secret
Use the following commands to store the application certificate and its private key in a Kubernetes Secret.

The following code block builds on the previous steps that store the certificate in a `./secret/cert.der` file and its private key in a `./secret/cert.pem` file. Adapt the commands according to the location of your files.

# [bash](#tab/bash)

```bash
# Put cert.der Application certificate and cert.pem private key into own-certs Kubernetes Secret in opcua namespace
kubectl create secret generic own-certs \
  -n $RuntimeNamespace \
  --from-file=./secret/cert.der \
  --from-file=./secret/cert.pem
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
# Put cert.der Application certificate and cert.pem private key into own-certs Kubernetes Secret in opcua namespace
kubectl create secret generic own-certs `
  -n $RuntimeNamespace `
  --from-file=./secret/cert.der `
  --from-file=./secret/cert.pem
```
---

##### Deploy the aio-opcplc-connector helm chart
In this section, you use the `opcUaConnector.settings.transportAuthentication.ownCertReference` and `opcUaConnector.settings.transportAuthentication.ownCertThumbprint` settings to 
indicate to OPC UA Connector to load the application certificate and its private key from the Kubernetes Secret. The OPC UA Broker runtime dereferences the `<secret-name>` references. The OPC UA Broker runtime also maps the contents of the secret into the OPC UA Connector's filesystem for the OPC UA stack to use at runtime.

# [bash](#tab/bash)

```bash
helm upgrade -i aio-opcplc-connector oci://mcr.microsoft.com/opcuabroker/helmchart/aio-opc-opcua-connector \
  --version 0.1.0-preview.2 \
  --namespace opcuabroker \
  --set opcUaConnector.settings.discoveryUrl="opc.tcp://opcplc-000000.opcuabroker:50000" \
  --set opcUaConnector.settings.autoAcceptUntrustedCertificates=true \
  --set opcUaConnector.settings.transportAuthentication.ownCertReference="own-certs" \
  --set opcUaConnector.settings.transportAuthentication.ownCertThumbprint=$Thumbprint \
  --wait
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
helm upgrade -i aio-opcplc-connector oci://mcr.microsoft.com/opcuabroker/helmchart/aio-opc-opcua-connector \
  --version 0.1.0-preview.2 \
  --namespace opcuabroker \
  --set opcUaConnector.settings.discoveryUrl="opc.tcp://opcplc-000000.opcuabroker:50000" \
  --set opcUaConnector.settings.autoAcceptUntrustedCertificates=true \
  --set opcUaConnector.settings.transportAuthentication.ownCertReference="own-certs" \
  --set opcUaConnector.settings.transportAuthentication.ownCertThumbprint=$Thumbprint \
  --wait
```
---

#### Use secrets provided by Azure Key Vault Provider for Secrets Store CSI Driver

OPC UA Broker supports storing the application certificate and its private key in Azure Key Vault, and then consuming them by using the [Azure Key Vault provider for Secrets Store CSI Driver](../../aks/csi-secrets-store-driver.md). This process works in the same way as the previous example for username and password. 

> [!NOTE]
> The following steps apply if you set `secrets.kind` to `csi` during [installation of OPC UA Broker](howto-install-opcua-broker-using-helm.md).

The following list includes the basic steps to use secrets provided by Azure Key Vault Provider: 

- Store the application certificate and its private key in Azure Key Vault.
- Create an instance of the `SecretProviderClass` custom resource with configuration to reference application certificate and its private key from Azure Key Vault.
- Deploy the `aio-opc-opcua-connector` helm chart with references to the `SecretProviderClass` instance.

#### Store the Application certificate and its private key as secrets in Azure Key Vault
The following code block builds on the previous steps that store the certificate in the `./secret/cert.der` file and its private key in the `./secret/cert.pem` file. Adapt the commands according to the location of your files.

# [bash](#tab/bash)

```bash
# Upload cert.der Application certificate as secret to Azure Key Vault
az keyvault secret set \
  --name "az-e4i-opc-ua-connector-der" \
  --vault-name <azure-key-vault-name> \
  --file ./secret/cert.der \
  --encoding hex \
  --content-type application/pkix-cert

# Upload cert.pem private key as secret to Azure Key Vault
az keyvault secret set \
  --name "az-e4i-opc-ua-connector-pem" \
  --vault-name <azure-key-vault-name> \
  --file ./secret/cert.pem \
  --encoding hex \
  --content-type application/x-pem-file
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
# Upload cert.der Application certificate as secret to Azure Key Vault
az keyvault secret set `
  --name "az-e4i-opc-ua-connector-der" `
  --vault-name <azure-key-vault-name> `
  --file ./secret/cert.der `
  --encoding hex `
  --content-type application/pkix-cert

# Upload cert.pem private key as secret to Azure Key Vault
az keyvault secret set `
  --name "az-e4i-opc-ua-connector-pem" `
  --vault-name <azure-key-vault-name> `
  --file ./secret/cert.pem `
  --encoding hex `
  --content-type application/x-pem-file
```
---

##### Create an instance of the `SecretProviderClass` custom resource
To create an instance of the `SecretProviderClass` custom resource, first store the values in a file named `aio-opc-ua-broker-client-certificate.yaml` as shown in the following example:

```yml
apiVersion: secrets-store.csi.x-k8s.io/v1
kind: SecretProviderClass
metadata:
  name: aio-opc-ua-broker-client-certificate
  namespace: opcuabroker
spec:
  provider: azure
  parameters:
    usePodIdentity: 'false'
    keyvaultName: <azure-key-vault-name>
    tenantId: <azure-tenant-id>
    objects: |
      array:
        - |
          objectName: az-e4i-opc-ua-connector-der
          objectType: secret
          objectAlias: az-e4i-opc-ua-connector.der
          objectEncoding: hex
        - |
          objectName: az-e4i-opc-ua-connector-pem
          objectType: secret
          objectAlias: az-e4i-opc-ua-connector.pem
          objectEncoding: hex
```

For more samples and a description of fields, see the [Azure/secrets-store-csi-driver-provider-azure](https://github.com/Azure/secrets-store-csi-driver-provider-azure) repository.

To create an instance of `SecretProviderClass` custom resource, see the following code:

# [bash](#tab/bash)

```bash
kubectl apply -f aio-opc-ua-broker-client-certificate.yaml --namespace opcuabroker
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
kubectl apply -f aio-opc-ua-broker-client-certificate.yaml --namespace opcuabroker
```
---

##### Deploy the aio-opcplc-connector helm chart
In this section, you use the `opcUaConnector.settings.transportAuthentication.ownCertReference` and `opcUaConnector.settings.transportAuthentication.ownCertThumbprint` settings to 
indicate to OPC UA Connector to load the application certificate and its private key from the `aio-opc-ua-broker-client-certificate` `SecretProviderClass` instance. The OPC UA Broker runtime dereferences the `<secret-name>` references. The OPC UA Broker runtime also maps the contents of the secret into the OPC UA Connector's filesystem for the OPC UA stack to use at runtime.

# [bash](#tab/bash)

```bash
helm upgrade -i aio-opcplc-connector oci://mcr.microsoft.com/opcuabroker/helmchart/aio-opc-opcua-connector \
  --version 0.1.0-preview.2 \
  --namespace opcuabroker \
  --set opcUaConnector.settings.discoveryUrl="opc.tcp://opcplc-000000.opcuabroker:50000" \
  --set opcUaConnector.settings.autoAcceptUntrustedCertificates=true \
  --set opcUaConnector.settings.transportAuthentication.ownCertReference="aio-opc-ua-broker-client-certificate" \
  --set opcUaConnector.settings.transportAuthentication.ownCertThumbprint=$Thumbprint \
  --wait
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
helm upgrade -i aio-opcplc-connector oci://mcr.microsoft.com/opcuabroker/helmchart/aio-opc-opcua-connector `
  --version 0.1.0-preview.2 `
  --namespace opcuabroker `
  --set opcUaConnector.settings.discoveryUrl="opc.tcp://opcplc-000000.opcuabroker:50000" `
  --set opcUaConnector.settings.autoAcceptUntrustedCertificates=true `
  --set opcUaConnector.settings.transportAuthentication.ownCertReference="aio-opc-ua-broker-client-certificate" `
  --set opcUaConnector.settings.transportAuthentication.ownCertThumbprint=$Thumbprint `
  --wait
```
---

## Verify the deployment
To verify that the deployment worked, you can use the following command:

# [bash](#tab/bash)

```bash
kubectl get pods -n opcuabroker
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
kubectl get pods -n opcuabroker
```
---

## Check high availability requirements
When you enable high availability (for more information, see [Upgrade an MQ deployment for High Availability](howto-install-opcua-broker-using-helm.md#upgrade-an-mq-deployment-for-high-availability)), you need to configure the OPC UA Connector with the username and password set to appropriate values. The [OPC UA TransferSubscriptions service call](https://reference.opcfoundation.org/Core/Part4/v104/docs/5.13.7) requires a secure and authenticated session. If your environment doesn't meet these conditions, high availability fails and the failover recreates the subscriptions and monitored items. This failover process can cause disruptions in the data that OPC UA Connector emits.

## Available parameters

The following table contains parameters you can use with a helm chart.

> [!div class="mx-tdBreakAll"]
> | Name                                                                | Mandatory | Datatype         | Default                   | Comment                                                                                                                                                                                                                                                                                                                       |
> | ------------------------------------------------------------------- | --------- | ---------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
> | `opcUaConnector.settings.authenticationMode`                        | false     | Enumeration      | `Anonymous`               | Selects the OPC UA UserTokenType OPC UA Connector should use to authenticate the user of the OPC UA session at the OPC UA Server [`Anonymous`, `UsernamePassword`].                                                                                                                                                           |
> | `opcUaConnector.settings.userNameReference`                         | false     | String           | `null`                    | A reference to a Kubernetes Secret in the form `<secret>/<key>`. The value of the `<key` in the Kubernetes Secret is the username OPC UA Connector will use to authenticate the user of the OPC UA session at the OPC UA Server (requires `opcUaConnector.settings.authenticationMode` set to `UsernamePassword`).            |
> | `opcUaConnector.settings.passwordReference`                         | false     | String           | `null`                    | A reference to a Kubernetes Secret in the form `<secret>/<key>`. The value of the `<key` in the Kubernetes Secret is the password OPC UA Connector will use to authenticate the configured user of the OPC UA session at the OPC UA Server (requires `opcUaConnector.settings.authenticationMode` set to `UsernamePassword`). |
> | `opcUaConnector.settings.defaultPublishingInterval`                 | false     | Unsigned Integer | `1000`                    | Default OPC UA PublishingInterval in milliseconds for OPC UA nodes                                                                                                                                                                                                                                                            |
> | `opcUaConnector.settings.defaultSamplingInterval`                   | false     | Unsigned Integer | `500`                     | Default OPC UA SamplingInterval in milliseconds for OPC UA nodes                                                                                                                                                                                                                                                              |
> | `opcUaConnector.settings.defaultQueueSize`                          | false     | Unsigned Integer | `15`                      | Default OPC UA QueueSize for OPC UA nodes                                                                                                                                                                                                                                                                                     |
> | `opcUaConnector.settings.discoveryUrl`                              | true      | String           | `null`                    | Discovery EndpointUrl of the OPC UA Server to connect to                                                                                                                                                                                                                                                                      |
> | `opcUaConnector.settings.maxItemsPerSubscription`                   | false     | Unsigned Integer | `1000`                    | Maximum amount of OPC UA nodes with same OPC UA PublishingInterval that should be monitored as part of the same OPC UA subscription                                                                                                                                                                                           |
> | `opcUaConnector.settings.autoAcceptUntrustedCertificates`           | false     | Boolean          | `false`                   | Auto-accept any OPC UA Server certificate.                                                                                                                                                                                                                                                                                    |
> | `opcUaConnector.settings.sessionTimeout`                            | false     | Unsigned Integer | `600000`                  | Timeout when creating an OPC UA session in milliseconds                                                                                                                                                                                                                                                                       |
> | `opcUaConnector.settings.transportAuthentication.ownCertReference`  | false     | String           | `null`                    | Reference to Kubernetes Secret (in `<secret-name>` format) that contains private keys to be used by the application and X.509 v3 certificates associated with them.                                                                                                                                                             |
> | `opcUaConnector.settings.transportAuthentication.ownCertThumbprint` | false     | String           | `null`                    | Thumbprint of application certificate.                                                                                                                                                                                                            |

## Next step

In this article, you learned how to connect an OPC UA server to OPC UA Broker.  Here's the suggested next step to work with your OPC UA Broker deployment:
> [!div class="nextstepaction"]
> [Define OPC UA assets using OPC UA Broker](howto-define-opcua-assets.md)