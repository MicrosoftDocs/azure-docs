---
title: Install Azure IoT OPC UA Broker
description: How to install Azure IoT OPC UA Broker using helm
author: timlt
ms.author: timlt
# ms.subservice: opcua-broker
ms.topic: how-to 
ms.date: 10/23/2023

# CustomerIntent: As an industrial edge IT or operations user, I want to to install OPC UA Broker
# in standalone mode. This lets my OPC UA assets exchange data with my cluster and the cloud. 
---

# Install Azure IoT OPC UA Broker (preview) by using helm

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

By using OPC UA Broker, you can manage the OPC UA assets that are part of your solution. This article shows you how to install OPC UA Broker in standalone mode. Running in standalone mode gives you the option to install other third party components and to manage assets without using the full Azure IoT Operations platform.


## Prerequisites

- An installed Kubernetes environment. 
- An [MQTT v5.0](https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html) compliant broker as your  messaging infrastructure. To install an MQTT broker, we recommend the steps described in [Quickstart: Deploy Azure IoT Operations to an Arc-enabled Kubernetes cluster](../get-started/quickstart-deploy.md). The deployment process sets up Azure IoT MQ (preview), an MQTT broker.  
- A certificate manager for SSL certificate management.  The admission controller requires SSL communication.  If you previously followed the steps described in [Quickstart: Deploy Azure IoT Operations to an Arc-enabled Kubernetes cluster](../get-started/quickstart-deploy.md), a certificate manager is installed with Azure IoT Operations. 
- Optionally, an installation of Akri if you want to autodetect OPC UA assets. If you previously followed the steps described in [Quickstart: Deploy Azure IoT Operations to an Arc-enabled Kubernetes cluster](../get-started/quickstart-deploy.md), the commercial version of Akri called Azure IoT Akri (preview) is installed with Azure IoT Operations. To install the open source Akri, follow the Akri [installation instructions](https://docs.akri.sh/user-guide/getting-started).

## Features supported

The following features are supported for installing OPC UA Broker: 

| Feature                              | Supported | Symbol      |
| ------------------------------------ | --------- | :---------: |
| Anonymous authentication             | Supported |     ✅     |
| Server Account Token authentication  | Supported |     ✅     |
| AMD64 Support                        | Supported |     ✅     |
| ARM64 Support                        | Supported |     ✅     |

## Install OPC UA Broker

 OPC UA Broker is packaged as a [helm](https://helm.sh) chart. You can use a helm command to deploy OPC UA Broker and related Custom Resource Definitions to a Kubernetes cluster.  Another option is to deploy  OPC UA Broker via the Azure CLI k8s-extension to an Arc enabled Kubernetes cluster.

 OPC UA Broker uses a multi-architecture container, which contains AMD64 and ARM64 images that use the same tag.

### Use OPC UA Broker with Azure IoT MQ

If you installed Azure IoT Operations as shown in the prerequisites, the setup installed Azure IoT MQ.  The setup also included Service Account Token (SAT) access. 

Use the following helm command to deploy OPC UA Broker to your Kubernetes cluster:

# [bash](#tab/bash)

```bash
helm upgrade -i opcuabroker oci://mcr.microsoft.com/opcuabroker/helmchart/microsoft.iotoperations.opcuabroker \
    --set image.registry=mcr.microsoft.com \
    --version 0.1.0-preview.2 \
    --namespace opcuabroker \
    --create-namespace \
    --set secrets.kind=k8s \
    --set mqttBroker.address=mqtt://aio-mq-dmqtt-frontend.default:1883 \
    --set opcPlcSimulation.deploy=true \
    --wait
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
helm upgrade -i opcuabroker oci://mcr.microsoft.com/opcuabroker/helmchart/microsoft.iotoperations.opcuabroker `
    --set image.registry=mcr.microsoft.com `
    --version 0.1.0-preview.2 `
    --namespace opcuabroker `
    --create-namespace `
    --set secrets.kind=k8s `
    --set mqttBroker.address=mqtt://aio-mq-dmqtt-frontend.default:1883 `
    --set opcPlcSimulation.deploy=true `
    --wait
```
---

If you installed MQ into a different namespace than `default`, specify the corresponding address of MQTT broker by adding the following line to the previous command.

# [bash](#tab/bash)

`--set mqttBroker.address=mqtt://aio-mq-dmqtt-frontend.<your-aio-mq-namespace>:1883 \`

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
--set mqttBroker.address=mqtt://aio-mq-dmqtt-frontend.<your-aio-mq-namespace>:1883 `
```
---

You can configure MQ for a specific audience for SAT-based authentication by using the `spec.authenticationMethods[].sat.audiences[]` of `BrokerAuthentication` custom resource. If you did that,  configure the same audience for OPC UA Broker by using `mqttBroker.serviceAccountTokenAudience`. You can find more details on using SAT-based authentication with MQ at [Configure Azure IoT MQ authentication](../administer/howto-configure-authentication.md). You can modify the original deployment of OPC UA Broker from the [Prerequisites](#prerequisites) to set SAT audience. 

The following example shows how to configure OPC UA Broker for the `aio-mq` audience:

# [bash](#tab/bash)

`--set mqttBroker.serviceAccountTokenAudience=aio-mq \`

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
--set mqttBroker.serviceAccountTokenAudience=aio-mq `
```
---

To use OPC UA Broker with Mosquitto, specify the following parameters:

# [bash](#tab/bash)

```bash
--set deployOwnMqttBroker=true \
--set mqttBroker.address=mqtt://mosquitto.opcuabroker:1883 \
--set mqttBroker.authenticationMethod="none" \
```


# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
--set deployOwnMqttBroker=true `
--set mqttBroker.address=mqtt://mosquitto.opcuabroker:1883 `
--set mqttBroker.authenticationMethod="none" `
```
---

### Use OPC UA Broker with TLS-enabled MQ

Azure IoT MQ supports exposing a TLS-enabled endpoint for communication. There are two documented ways to enable a TLS-enabled endpoint:

- [Configure TLS with automatic certificate management to secure MQTT communication](../administer/howto-configure-tls-auto.md)
- [Configure TLS with manual certificate management to secure MQTT communication](../administer/howto-configure-tls-manual.md)

In the automatic steps, if `spec.authenticationEnabled` is set to `true` for `BrokerListener` custom resource, you should create a custom resource of type `BrokerAuthentication`. 

For more details on supported authentication methods, see [Configure Azure IoT MQ authentication](../administer/howto-configure-authentication.md). 

For deployment of OPC UA Broker SAT-based authentication should be added when `BrokerAuthentication` class is created manually. SAT-based authentication is enabled with the default deployment of MQ with `--set global.quickstart=true`.

Regardless how TLS is enabled for MQ, OPC UA Broker requires the public part of a CA certificate for validation. For details on the automatic steps, see [Configure TLS with automatic certificate management to secure MQTT communication](../administer/howto-configure-tls-auto.md#distribute-the-root-certificate).  In this case, assume that the CA certificate output of that step is stored in a `tls.crt` file.

To enable TLS-based communication for OPC UA Broker, create a ConfigMap containing the CA certificate.  For example, name the CA certificate `mqtt-ca-cert`:

# [bash](#tab/bash)

```bash
kubectl create configmap mqtt-ca-cert --from-file=tls.crt --namespace opcuabroker
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
kubectl create configmap mqtt-ca-cert --from-file=tls.crt --namespace opcuabroker
```
---

The previous step creates a `ConfigMap` named `mqtt-ca-cert` with the `tls.crt` key in it. You can use this information for deployment of OPC UA Broker:

# [bash](#tab/bash)

```bash
helm upgrade -i opcuabroker oci://mcr.microsoft.com/opcuabroker/helmchart/microsoft.iotoperations.opcuabroker \
    --set image.registry=mcr.microsoft.com \
    --version 0.1.0-preview.2 \
    --namespace opcuabroker \
    --create-namespace \
    --set mqttBroker.address=mqtts://aio-mq-dmqtt-frontend.default:8883 \
    --set mqttBroker.caCertConfigMapRef=mqtt-ca-cert \
    --set mqttBroker.caCertKey=tls.crt \
    --set opcPlcSimulation.deploy=true \
    --set secrets.kind=k8s \
    --wait
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
helm upgrade -i opcuabroker oci://mcr.microsoft.com/opcuabroker/helmchart/microsoft.iotoperations.opcuabroker `
    --set image.registry=mcr.microsoft.com `
    --version 0.1.0-preview.2 `
    --namespace opcuabroker `
    --create-namespace `
    --set mqttBroker.address=mqtts://aio-mq-dmqtt-frontend.default:8883 `
    --set mqttBroker.caCertConfigMapRef=mqtt-ca-cert `
    --set mqttBroker.caCertKey=tls.crt `
    --set opcPlcSimulation.deploy=true `
    --set secrets.kind=k8s `
    --wait
```
---

When you use TLS-enabled MQ, note the following details: 

- To connect to a TLS-enabled MQTT broker endpoint, use the `mqtts://` protocol. 
- When you use `mqtts://` protocol, `mqttBroker.caCertConfigMapRef` and `mqttBroker.caCertKey` values are required.
- Configuration of port `8883` of the TLS-enabled endpoint for MQ is part of `BrokerListener` custom resource. OPC UA Broker should be set up to connect to the configured port.
- The `BrokerAuthentication` custom resource of MQ defines the audience for SAT-based authentication in `spec.authenticationMethods[].sat.audiences[]`.  Use the same value when you deploy OPC UA Broker as `mqttBroker.serviceAccountTokenAudience`.

### Upgrade an existing OPC UA Broker deployment for High Availability

You can deploy OPC UA Broker with High Availability mode enabled. When you do that, it creates for all Connector deployments a scale set of two Kubernetes Connector pods with [anti-affinity](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity) configured. The two pods are deployed on different nodes if the infrastructure supports this type of deployment. At any given time, one of the two pods is active and one is passive.  The active one maintains an open session to the OPC UA Server and emits telemetry and event messages. The passive one remains on  standby to take over and connect to the OPC UA server to continue emitting messages. The OPC UA Broker controls the failover process.  Failover is triggered if the active pod crashes. OPC UA Broker then starts a new passive pod.

The following diagram shows the architecture:
:::image type="content" source="media/howto-install-opcua-broker-using-helm/high-availability-schema.png" alt-text="Diagram of Connector pods and MQTT Broker":::

### Configure scale up and scale out behavior

The OPC UA Broker supervisor creates Connector deployment instances dynamically.

OPC UA Broker tries to group assets that share the same endpoint profile into the same Connector deployment. The maximum load of a Connector deployment is measured in number of data points processed by it and you can configure it by using `opcUaConnector.maxDataPointsPerSecond`.

To assign new `Asset` instances to Connector deployments, note the following rules:

- If there's a Connector deployment that handles less than 70% of the configured `maxDataPointsPerSecond`, new Assets are still assigned to this Connector deployment.

- If all Connector deployments have less than 30% capacity and a new asset is created, a new Connector deployment is created and the new Asset is assigned to it.

- If the maximum number of deployments configured by `opcUaConnector.maxNumberOfDeployments` is reached, no new Connector deployments are created.

- If there are multiple Connector deployments with a load lower than 70%, a new Asset is assigned to the Connector deployment with the lowest load.

> [!NOTE]
> In the OPC UA Broker (preview) release, the broker does not re-balance endpoint profiles or assets after the initial assignment. OPC UA Broker also does not delete Connector deployments that are no longer used.

#### OPC UA Broker load estimation

The load generated by an asset is calculated based on the number of data points and events of the Asset. 

To enable debugging the asset assignment, all relevant information is added to tracing. The trace `Maintain infrastructure` of the `supervisor` pod contains an attribute `assets` that lists all assets including their endpoint profiles and an attribute `BrokerLoads` that contains the deployed Connector and the calculated load per Connector.

> [!NOTE]
> It's not possible to define a publishing interval on asset level in the OPC UA Broker (preview), OPC UA Broker assumes publishing for data points and events each second. You can adjust `opcUaConnector.maxDataPointsPerSecond` if needed.

#### OPC UA Broker scale configuration

The following code example shows how to configure scale:

# [bash](#tab/bash)

```bash
helm upgrade -i opcuabroker oci://mcr.microsoft.com/opcuabroker/helmchart/microsoft.iotoperations.opcuabroker \
    --namespace opcuabroker \
    --set opcUaConnector.maxNumberOfDeployments=50 \
    --set opcUaConnector.maxDataPointsPerSecond=10000 \
    --reuse-values \
    --wait
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
helm upgrade -i opcuabroker oci://mcr.microsoft.com/opcuabroker/helmchart/microsoft.iotoperations.opcuabroker `
    --namespace opcuabroker `
    --set opcUaConnector.maxNumberOfDeployments=50 `
    --set opcUaConnector.maxDataPointsPerSecond=10000 `
    --reuse-values `
    --wait
```
---

#### OPC UA Broker scale metrics

The OPC UA Broker enables tracking of workload distribution by using metrics.

| Metric                   | Meaning                                                                                                                                             |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| aio.opc.broker.assets    | The number of assets per Connector deployment                                                                                                       |
| aio.opc.broker.endpoints | The number of endpoint profiles per Connector deployment                                                                                            |
| aio.opc.broker.load      | The load per Connector deployment                                                                                                                   |
| aio.opc.schema.brokers   | The number of Connector deployments per scheme (this relates to the scheme part of the `targetAddress` of the corresponding `AssetEndpointProfile`) |

#### Upgrade an MQ deployment for High Availability

The following code example shows how to upgrade and MQ deployment for High Availability mode:

# [bash](#tab/bash)

```bash
helm upgrade -i opcuabroker oci://mcr.microsoft.com/opcuabroker/helmchart/microsoft.iotoperations.opcuabroker \
    --set image.registry=mcr.microsoft.com \
    --version 0.1.0-preview.2 \
    --namespace opcuabroker \
    --create-namespace \
    --set opcPlcSimulation.deploy=true \
    --set opcUaConnector.highAvailability=true \
    --set secrets.kind=k8s \
    --wait
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
helm upgrade -i opcuabroker oci://mcr.microsoft.com/opcuabroker/helmchart/microsoft.iotoperations.opcuabroker `
    --set image.registry=mcr.microsoft.com `
    --version 0.1.0-preview.2 `
    --namespace opcuabroker `
    --create-namespace `
    --set opcPlcSimulation.deploy=true `
    --set opcUaConnector.highAvailability=true `
    --set secrets.kind=k8s `
    --wait
```
---


#### Use Azure Key Vault Provider for Secrets Store CSI Driver

The OPC UA Broker supports use of [Azure Key Vault Provider for Secrets Store CSI Driver](../../aks/csi-secrets-store-driver.md) for consumption of credentials instead of using native [Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/).

To enable using Azure Key Vault Provider, deploy the CSI driver into Kubernetes cluster, and enable it. See the following articles for further details: 

- [Use the Azure Key Vault Provider for Secrets Store CSI Driver in an Azure Kubernetes Service (AKS) cluster](../../aks/csi-secrets-store-driver.md)
- [Provide an identity to access the Azure Key Vault Provider for Secrets Store CSI Driver in Azure Kubernetes Service (AKS)](../../aks/csi-secrets-store-identity-access.md)

As an alternative to the steps in the preceding linked articles, you can run the following script to set up CSI driver for your cluster:

- [setup.sh](https://github.com/Azure/project-alice-springs/blob/main/automation/setup.sh)

During the setup process, create a Service Principal with permissions to read secrets and certificates from Azure Key Vault. Credentials for accessing Azure Key Vault as that Service Principal should be stored as a Kubernetes Secret in the namespaces where OPC UA Broker will be deployed.  In the example the Kubernetes Secret is `aio-akv-sp` which contains `clientid` and `clientsecret` keys.

To use Azure Key Vault Provider for Secrets Store CSI Driver, run the deployment with the following values:

# [bash](#tab/bash)

```bash
helm upgrade -i opcuabroker oci://mcr.microsoft.com/opcuabroker/helmchart/microsoft.iotoperations.opcuabroker \
    --set image.registry=mcr.microsoft.com \
    --version 0.1.0-preview.2 \
    --namespace opcuabroker \
    --create-namespace \
    --set mqttBroker.address=mqtt://aio-mq-dmqtt-frontend.default:1883 \
    --set opcPlcSimulation.deploy=true \
    --set secrets.kind=csi \
    --set secrets.csiServicePrincipalSecretRef=aio-akv-sp \
    --wait
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
helm upgrade -i opcuabroker oci://mcr.microsoft.com/opcuabroker/helmchart/microsoft.iotoperations.opcuabroker `
    --set image.registry=mcr.microsoft.com `
    --version 0.1.0-preview.2 `
    --namespace opcuabroker `
    --create-namespace `
    --set mqttBroker.address=mqtt://aio-mq-dmqtt-frontend.default:1883 `
    --set opcPlcSimulation.deploy=true `
    --set secrets.kind=csi `
    --set secrets.csiServicePrincipalSecretRef=aio-akv-sp `
    --wait
```
---

When you configure the Secrets Store CSI Driver configuration, you modify the following values:

- `secrets.kind`.  The value should be `csi` (for Secrets Store CSI Driver) or `K8s`` (for native Kubernetes Secrets)
- `secrets.csiDriver`. The default value is `secrets-store.csi.k8s.io`. Confirm with your cluster administrator as the value should be registered in the cluster.
- `secrets.csiServicePrincipalSecretRef`. This value references the Kubernetes Secret containing sensitive information to pass to the CSI driver to complete the CSI calls.

## helm chart parameters

The following table contains parameters you can use with a helm chart. 

> [!div class="mx-tdBreakAll"]
> | Name                                         | Required | Datatype         | Default                        | Description                                                                                                                                                           |
> | -------------------------------------------- | -------- | ---------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
> | `deployOwnMqttBroker`                        | false    | Boolean          | `false`                                                 | Controls if Mosquitto should be deployed in OPC UA Broker runtime namespace                                                                                  |
> | `logging.logLevel`                           | false    | Enumeration      | `Information`                                           | The default logging level used by OPC UA Broker runtime [`Trace`, `Debug`, `Information`, `Warning`, `Error`, `Critical`, `None`]                            |
> | `payloadCompression`                         | false    | Enumeration      | `none`                                                  | Defines compression method that should be used for data messages [`none`, `gzip`, `brotli`]                                                                           |
> | `mqttBroker.authenticationMethod`            | false    | Enumeration      | `serviceAccountToken`                                   | Defines how the OPC UA Broker Runtime should authenticate at MQTT Broker [none, serviceAccountToken]                                                         |
> | `mqttBroker.address`                         | false    | String           | `mqtts://azedge-dmqtt-frontend.default:8883`            | Address of MQTT V5 compatible broker. For a broker running as a Kubernetes Service that is `<service-name>.<namespace>.<port>`                                        |
> | `mqttBroker.serviceAccountTokenAudience`     | false    | String           | `aio-mq`                                                | Intended audience of service account token (SAT).                                                                                                                     |
> | `mqttBroker.caCertConfigMapRef`              | false    | String           | `null`                                                  | Name of the `ConfigMap` that contains the CA certificate for MQTT TLS. **Required** if protocol of `mqttBroker.address` is `mqtts://`.                                |
> | `mqttBroker.caCertKey`                       | false    | String           | `null`                                                  | Key in the `mqttBroker.caCertConfigMapRef` `ConfigMap` that contains the CA certificate for MQTT TLS. **Required** if protocol of `mqttBroker.address` is `mqtts://`. |
> | `opcPlcSimulation.deploy`                    | false    | Boolean          | `false`                                                 | Controls if OPC PLC (OPC UA Server simulation) should be deployed in OPC UA Broker runtime namespace                                                         |
> | `opcPlcSimulation.image`                     | false    | String           | `mcr.microsoft.com/iotedge/opc-plc`                     | Image of OPC PLC to deploy                                                                                                                                            |
> | `opcPlcSimulation.tag`                       | false    | String           | `2.9.8`                                                 | Image tag of OPC PLC to deploy                                                                                                                                        |
> | `opcPlcSimulation.pullPolicy`                | false    | Enumeration      | `Always`                                                | Kubernetes image pull policy for OPC PLC [IfNotPresent, Always, Never]                                                                                                           |
> | `opcPlcSimulation.pullSecrets`               | false    | List of Objects  | `[]`                                                    | Kubernetes secrets to use for pulling OPC PLC images. Use standard Kubernetes syntax for `spec.imagePullSecrets`                                                      |
> | `opcPlcSimulation.simulations`               | false    | Unsigned Integer | `1`                                                     | Number of OPC PLCs to deploy                                                                                                                                          |
> | `opcPlcSimulation.fastNodes`                 | false    | Unsigned Integer | `2000`                                                  | Number of fast nodes                                                                                                                                                  |
> | `opcPlcSimulation.slowNodes`                 | false    | Unsigned Integer | `25`                                                    | Number of slow nodes                                                                                                                                                  |
> | `opcPlcSimulation.maxSessionCount`           | false    | Unsigned Integer | `100`                                                   | Maximum number of parallel sessions                                                                                                                                   |
> | `opcPlcSimulation.maxSubscriptionCount`      | false    | Unsigned Integer | `100`                                                   | Maximum number of subscriptions                                                                                                                                       |
> | `opcPlcSimulation.maxQueuedRequestCount`     | false    | Unsigned Integer | `2000`                                                  | Maximum number of requests that is queued waiting for a thread                                                                                                   |
> | `opcPlcSimulation.resources`                 | false    | Object           | `{}`                                                    | Defines Pod resource requests and limits. Use standard Kubernetes syntax for `spec.containers[].resources`                                                            |
> | `supervisor.image`                           | false    | String           | `mcr.microsoft.com/opcuabroker/supervisor`           | Container image OPC UA Broker supervisor Supervisor                                                                                                                   |
> | `supervisor.tag`                             | false    | String           | `0.1.0-preview.2`                                   | Image tag of OPC UA Broker supervisor Supervisor                                                                                                                      |
> | `supervisor.pullPolicy`                      | false    | Enumeration      | `Always`                                                | Kubernetes image pull policy for Edge Application Supervisor [IfNotPresent, Always, Never]                                                                                       |
> | `supervisor.pullSecrets`                     | false    | List of Objects  | `[]`                                                    | Kubernetes secrets to use for pulling Edge Application Supervisor images. Use standard Kubernetes syntax for `spec.imagePullSecrets`                                  |
> | `supervisor.resources.limits.cpu`            | false    | string           | `500m`                                                  | Kubernetes CPU limit for the supervisor container in millicore notation                                                                                               |
> | `supervisor.resources.limits.memory`         | false    | string           | `750Mi`                                                 | Kubernetes memory limit for the supervisor container in power of two notation                                                                                         |
> | `supervisor.resources.requests.cpu`          | false    | string           | `200m`                                                  | Kubernetes CPU request for the supervisor container in millicore notation                                                                                             |
> | `supervisor.resources.requests.memory`       | false    | string           | `250Mi`                                                 | Kubernetes memory request for the supervisor container in power of two notation                                                                                       |
> | `connectorSidecar.image`                     | false    | String           | `mcr.microsoft.com/opcuabroker/connector-sidecar`    | Image of Connector sidecar                                                                                                                                            |
> | `connectorSidecar.tag`                       | false    | String           | `0.1.0-preview.2`                                   | Image tag of Connector sidecar                                                                                                                                        |
> | `connectorSidecar.resources.limits.cpu`      | false    | string           | `500m`                                                  | Kubernetes CPU limit for the connector sidecar container in millicore notation                                                                                        |
> | `connectorSidecar.resources.limits.memory`   | false    | string           | `500Mi`                                                 | Kubernetes memory limit for the connector sidecar container in power of two notation                                                                                  |
> | `connectorSidecar.resources.requests.cpu`    | false    | string           | `300m`                                                  | Kubernetes CPU request for the connector sidecar container in millicore notation                                                                                      |
> | `connectorSidecar.resources.requests.memory` | false    | string           | `250Mi`                                                 | Kubernetes memory request for the connector sidecar container in power of two notation                                                                                |
> | `opcUaConnector.highAvailability`            | false    | Boolean          | `false`                                                 | Controls if the OPC UA Connector deployment is using an active/passive pod configuration to enable High Availability                                                  |
> | `opcUaConnector.image`                       | false    | String           | `mcr.microsoft.com/opcuabroker/opcua-connector`      | Image of OPC UA Connector                                                                                                                                             |
> | `opcUaConnector.tag`                         | false    | String           | `0.1.0-preview.2`                                   | Image tag of OPC UA Connector                                                                                                                                         |
> | `opcUaConnector.resources.limits.cpu`        | false    | string           | `1500m`                                                 | Kubernetes CPU limit for the OPC UA connector container in millicore notation                                                                                         |
> | `opcUaConnector.resources.limits.memory`     | false    | string           | `1Gi`                                                   | Kubernetes memory limit for the OPC UA connector container in power of two notation                                                                                   |
> | `opcUaConnector.resources.requests.cpu`      | false    | string           | `300m`                                                  | Kubernetes CPU request for the OPC UA connector container in millicore notation                                                                                       |
> | `opcUaConnector.resources.requests.memory`   | false    | string           | `250Mi`                                                 | Kubernetes memory request for the OPC UA connector container in power of two notation                                                                                 |
> | `opcUaConnector.maxNumberOfDeployments`      | false    | Unsigned Integer | 10                                                      | The maximum number of OPC UA Broker deployments (hard limit)                                                                                                          |
> | `opcUaConnector.maxDataPointsPerSecond`      | false    | Unsigned Integer | 5000                                                    | The maximum number of data points and events emitted per second by an OPC UA Broker deployment (soft limit)                                                           |
> | `openTelemetry.enabled`                      | false    | Boolean          | `false`                                                 | Enables the OpenTelemetry integration                                                                                                                                 |
> | `openTelemetry.endpoints`                    | false    | Map of Objects   | `{}`                                                    | Map of OpenTelemetry endpoint configurations. For information see [Configure OpenTelemetry endpoints](#configure-opentelemetry-endpoints)                       |
> | `admissionController.deploy`                 | false    | Boolean          | `false`                                                 | Controls if admission controller service should be deployed in OPC UA Broker runtime namespace                                                               |
> | `admissionController.image`                  | false    | String           | `mcr.microsoft.com/opcuabroker/admission-controller` | Image of admission controller                                                                                                                                         |
> | `admissionController.tag`                    | false    | String           | `0.1.0-preview.2`                                   | Image tag of admission controller                                                                                                                                     |
> | `admissionController.pullPolicy`             | false    | Enumeration      | `Always`                                                | Kubernetes image pull policy for admission controller [IfNotPresent, Always, Never]                                                                                              |
> | `admissionController.pullSecrets`            | false    | List of Objects  | `[]`                                                    | Kubernetes secrets to use for pulling admission controller images. Use standard Kubernetes syntax for `spec.imagePullSecrets`                                         |
> | `secrets.kind`                               | false    | Enumeration      | `csi`                                                   | Type of secrets that OPC UA connector should consume. Valid values are `k8s` or `csi`.                                                                         |
> | `secrets.csiDriver`                          | false    | String           | `secrets-store.csi.k8s.io`                              | Name of CSI driver. Should be registered in the cluster. Used only if `secrets.kind` is set to `csi`.                                                                 |
> | `secrets.csiServicePrincipalSecretRef`       | true     | String           | `null`                                                  | Reference to Kubernetes Secret containing credentials of Service Principal. Required only if `secrets.kind` is set to `csi`.                                          |


### Deploy to an Azure Arc-enabled cluster

If your [Kubernetes cluster is connected to Azure Arc](../../azure-arc/kubernetes/quickstart-connect-cluster.md), you can deploy OPC UA Broker by using the Azure CLI with the following command line:

# [bash](#tab/bash)

```bash
  az k8s-extension create \
    --extension-type microsoft.iotoperations.opcuabroker \
    --version 0.1.0-preview.2 \
    --name <name of the extension in the cluster> \
    --release-train staging \
    --cluster-name <name of the Arc enabled cluster> \
    --resource-group <resource group of the Arc resource> \
    --cluster-type connectedClusters \
    --scope cluster \
    --release-namespace <your-opcuabroker-namespace> \
    --auto-upgrade-minor-version false \
    --config mqttBroker.address=mqtt://aio-mq-dmqtt-frontend.<your-aio-mq-namespace>:1883 \
    --config opcPlcSimulation.deploy=true \
    --config secrets.kind=k8s
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
  az k8s-extension create `
    --extension-type microsoft.iotoperations.opcuabroker `
    --version 0.1.0-preview.2 `
    --name <name of the extension in the cluster> `
    --release-train staging `
    --cluster-name <name of the Arc enabled cluster> `
    --resource-group <resource group of the Arc resource> `
    --cluster-type connectedClusters `
    --scope cluster `
    --release-namespace <your-opcuabroker-namespace> `
    --auto-upgrade-minor-version false `
    --config mqttBroker.address=mqtt://aio-mq-dmqtt-frontend.<your-aio-mq-namespace>:1883 `
    --config opcPlcSimulation.deploy=true `
    --config secrets.kind=k8s
```
---

Currently, the `microsoft.iotoperations.opcuabroker` extension supports the following regions: `eastus`, `eastus2`, `westus3` , `eastus2euap`, and `westeurope`. You can configure the extension with the same parameters as the helm chart.

To validate and diagnose the status of your extension, use the following command:

# [bash](#tab/bash)

```bash
  az k8s-extension show \
   --name <name of the extension in the cluster> \
   --cluster-name <name of the Arc enabled cluster> \
   --resource-group <resource group of the Arc resource> \
   --cluster-type connectedClusters
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
  az k8s-extension show `
    --name <name of the extension in the cluster> `
    --cluster-name <name of the Arc enabled cluster> `
    --resource-group <resource group of the Arc resource> `
    --cluster-type connectedClusters
```
---

You can uninstall the extension with the following command:

# [bash](#tab/bash)

```bash
  az k8s-extension delete \
   --name <name of the extension in the cluster> \
   --cluster-name <name of the Arc enabled cluster> \
   --resource-group <resource group of the Arc resource> \
   --cluster-type connectedClusters
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
  az k8s-extension delete `
    --name <name of the extension in the cluster> `
    --cluster-name <name of the Arc enabled cluster> `
    --resource-group <resource group of the Arc resource> `
    --cluster-type connectedClusters
```
---


### Configure OpenTelemetry endpoints

You can define multiple endpoints for OpenTelemetry integration. For each endpoint, you add a property with the name of the endpoint and an object containing its configuration to `openTelemetry.endpoints`. The endpoint configuration object supports the following properties:

| Name                            | Required | Datatype         | Default      | Description                                                                               |
| ------------------------------- | -------- | ---------------- | ------------ | ----------------------------------------------------------------------------------------- |
| `uri`                           | true     | String           |              | Endpoint address of the OpenTelemetry collector.                                          |
| `protocol`                      | true     | Enumeration      |              | Protocol used for the connection to the OpenTelemetry collector. [`grpc`, `httpprotobuf`] |
| `exportIntervalMilliseconds`    | false    | Unsigned Integer | `60000`      | Interval for batch export to the OpenTelemetry collector in ms.                           |
| `assetTraceSamplingProbability` | false    | Double           | `0.01`       | Probability that data changes or events are traced. Must be between 0 and 1.          |
| `emitLogs`                      | false    | Boolean          | `true`       | Whether logs should be emitted to this endpoint.                                          |
| `emitMetrics`                   | false    | Boolean          | `true`       | Whether metrics should be emitted to this endpoint.                                       |
| `emitTraces`                    | false    | Boolean          | `true`       | Whether traces should be emitted to this endpoint.                                        |
| `temporalityPreference`         | false    | Enumeration      | `cumulative` | Sets the temporality preference for the metric reader. [`cumulative`, `delta`]            |

The following example shows how to configure an endpoint:

```yml
openTelemetry:
  enabled: "true"
  endpoints:
    # default otel endpoint configuration
    default:
      uri: http://otel-collector.opcuabroker-monitoring.svc.cluster.local:4317
      protocol: grpc
      exportIntervalMilliseconds: 60000
      assetTraceSamplingProbability: 0.01
      emitLogs: true
      emitMetrics: true
      emitTraces: true
      temporalityPreference: cumulative
```

> [!TIP]
> You can use [k9s](https://k9scli.io), a text UI tool to efficiently manage your Kubernetes environment. Type `k9s` in the terminal to open it. For more information, see [k9s docs](https://k9scli.io/topics/commands/).


## Next step

In this article, you learned how to install and configure OPC UA Broker in standalone mode.  Here's the suggested next step to start using your OPC UA Broker deployment:
> [!div class="nextstepaction"]
> [Connect an OPC UA server to Azure IoT OPC UA Broker](howto-connect-an-opcua-server.md)

