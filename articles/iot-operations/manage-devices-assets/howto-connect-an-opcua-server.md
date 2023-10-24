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

In this article you learn how to connect an OPC UA server to Azure IoT OPC UA Broker (preview). After this is done, you can use OPC UA Broker to define and manage OPC UA assets.

## Prerequisites

- Install OPC UA Broker. For more information see [Install Azure IoT OPC UA Broker (preview) by using helm](howto-install-opcua-broker-using-helm.md).

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
| Auto-accept untrusted certificates                      | Supported |     ✅     |
| Configure default Subscription PublishingInterval       | Supported |     ✅     |
| Configure default MonitoredItem SamplingInterval        | Supported |     ✅     |
| Configure default MonitoredItem QueueSize               | Supported |     ✅     |
| Configure endpoint selection based on Security level    | Supported |     ✅     |
| Configure max number of MonitoredItems per Subscription | Supported |     ✅     |
| Configure OPC UA Session creation timeout               | Supported |     ✅     |


## Set up example lab environments
For each OPC UA Server endpoint, start a separate OPC UA Connector and pass in the OPC UA Discovery URL of the OPC UA Server.

### Connect with anonymous access
This example shows how to connect to an OPC UA Server with anonymous access to publish telemetry into an MQTT broker.

The value of `opcUaConnector.settings.discoveryUrl` is set to `opc.tcp://opcplc-000000.opcuabroker:50000` in the following code example.  This value is the address of the sample OPC PLC deployed in the namespace of {{<oub-product-name>}} runtime. The value needs to be changed accordingly if a namespace other than `opcuabroker` was used for deployment of {{<oub-product-name>}}, or if you need to connect to a different OPC UA Server.

# [bash](#tab/bash)

```bash
helm upgrade -i aio-opcplc-connector oci://{{% oub-registry %}}/opcuabroker/helmchart/aio-opc-opcua-connector \
  --version {{% oub-version %}} \
  --namespace opcuabroker \
  --set opcUaConnector.settings.discoveryUrl="opc.tcp://opcplc-000000.opcuabroker:50000" \
  --set opcUaConnector.settings.autoAcceptUntrustedCertificates=true \
  --wait
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
helm upgrade -i aio-opcplc-connector oci://{{% oub-registry %}}/opcuabroker/helmchart/aio-opc-opcua-connector `
  --version {{% oub-version %}} `
  --namespace opcuabroker `
  --set opcUaConnector.settings.discoveryUrl="opc.tcp://opcplc-000000.opcuabroker:50000" `
  --set opcUaConnector.settings.autoAcceptUntrustedCertificates=true `
  --wait
```
---

The OPC UA Server is the container build from a [GitHub repository](https://github.com/Azure-Samples/iot-edge-opc-plc). The command line reference on GitHub shows the default username and password, which you can use optionally. To use the defaults, place them in shell variables as shown in code examples in the following section.

### Connect with username and password
{{<oub-product-name>}} keeps all secrets like usernames, passwords, certificates, and certificate lists in secrets. We support the following type of secrets:

- [Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)
- secrets provided by [Azure Key Vault Provider for Secrets Store CSI Driver](https://learn.microsoft.com/azure/aks/csi-secrets-store-driver)

A Kubernetes Secret is structured as dictionary holding multiple key value pairs, each one storing the sensitive data in the value.
The same logic applies for CSI secrets, they are containers of sensitive credentials in the form of key value pairs.

In the {{<oub-product-name>}} we only use references to secrets and no sensitive values directly. Note that the type of secrets that should be referenced by
{{<oub-product-name>}} is specified at the deployment time through `secrets.kind` configuration parameter. Please check [installation](../210-install) steps for more details.

{{<oub-product-name>}} supports two types of references to secrets:

- `<secret>` is intended to be used to reference all key-value pairs in the secret. {{<oub-product-name>}} will dereference it by creating a file for each key-value pair which is named after the key, and by using the value as the file's content. All these files will be put into a directory named `<secret>`. This directory will be mapped into the file system of a pod which is using the secret reference. This type can be used to reference secrets like certificate lists.
- `<secret>/<key>` is intended to reference only one key-value pair of the secret identified by `<key>`. In this case, the dereferencing will only create one file with filename `<key>` and use the value as the file's content. The file will be put into a directory named `<secret>`. This directory will be mapped into the file system of a pod which is using the secret reference. This type can be used to reference secrets like username, password, and others.

#### Connect with username and password stored in Kubernetes Secrets

#### Connect with username and password stored in Azure Key Vault

### Connect and provide an application certificate for OPC UA Connector

## Verify the deployment
TODO: Add introduction sentence(s)
[Include a sentence or two to explain only what is needed to complete the procedure.]
TODO: Add ordered list of procedure steps
1. Step 1
1. Step 2
1. Step 3

## Check high availability requirements
TODO: Add introduction sentence(s)
[Include a sentence or two to explain only what is needed to complete the procedure.]
TODO: Add ordered list of procedure steps
1. Step 1
1. Step 2
1. Step 3

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
> | `opcUaConnector.settings.transportAuthentication.ownCertReference`  | false     | String           | `null`                    | Reference to Kubernetes Secret (in <secret-name> format) that contains private keys to be used by the application and X.509 v3 certificates associated with them.                                                                                                                                                             |
> | `opcUaConnector.settings.transportAuthentication.ownCertThumbprint` | false     | String           | `null`                    | Thumbprint of application certificate.                                                                                                                                                                                                            |

## Next step

In this article, you learned how to connect an OPC UA server to OPC UA Broker.  Here's the suggested next step to work with your OPC UA Broker deployment:
> [!div class="nextstepaction"]
> [Define OPC UA assets using OPC UA Broker](howto-define-opcua-assets.md)