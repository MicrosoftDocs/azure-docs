---
title: "Tutorial: Add assets"
description: "Tutorial: Add OPC UA assets that publish messages to the MQTT broker in your Azure IoT Operations cluster."
author: dominicbetts
ms.author: dobett
ms.topic: tutorial
ms.custom:
  - ignite-2023
ms.date: 04/30/2025

#CustomerIntent: As an OT user, I want to create assets in Azure IoT Operations so that I can subscribe to asset data points, and then process the data before I send it to the cloud.
---

# Tutorial: Add OPC UA assets to your Azure IoT Operations cluster

In this tutorial, you manually add OPC UA assets to your Azure IoT Operations cluster. These assets publish messages to the MQTT broker in your Azure IoT Operations cluster. Typically, an OT user completes these steps.

An _asset_ is a physical device or logical entity that represents a device, a machine, a system, or a process. For example, a physical asset could be a pump, a motor, a tank, or a production line. A logical asset that you define can have properties, stream data points, or generate events.

_OPC UA servers_ are software applications that communicate with assets. _OPC UA tags_ are data points that OPC UA servers expose. OPC UA tags can provide real-time or historical data about the status, performance, quality, or condition of assets.

In this tutorial, you use the operations experience web UI to create your assets. You can also use the [Azure CLI to complete some of these tasks](/cli/azure/iot/ops/asset).

## Prerequisites

An instance of Azure IoT Operations with secure settings enabled deployed in a Kubernetes cluster. To create an instance, use one of the following to deploy Azure IoT Operations:

- [Quickstart: Run Azure IoT Operations in GitHub Codespaces with K3s](../get-started-end-to-end-sample/quickstart-deploy.md) provides simple instructions to deploy an Azure IoT Operations instance that you can use for the tutorials. Then, to enable secure settings follow the steps in [Enable secure settings in Azure IoT Operations](../deploy-iot-ops/howto-enable-secure-settings.md).
- [Deployment overview](../deploy-iot-ops/overview-deploy.md) provides detailed instructions to deploy an Azure IoT Operations instance on Windows using Azure Kubernetes Service Edge Essentials or Ubuntu using K3s. Follow the steps in the deployment article for a secure settings deployment.

After you enable secure settings, the resource group that contains your Azure IoT Operations instance also contains the following resources:

- An Azure Key Vault instance to store the secrets to synchronize into your Kubernetes cluster.
- A user-assigned managed identity that Azure IoT Operations uses to access the Azure Key Vault instance.
- A user-assigned managed identity that Azure IoT Operations components such as data flows can use to uses to connect to cloud endpoints such as Azure Event Hubs.

Ensure that when you configure secure settings that you [give your user account permissions to manage secrets](/azure/key-vault/secrets/quick-create-cli#give-your-user-account-permissions-to-manage-secrets-in-key-vault) with the **Key Vault Secrets Officer** role.

To sign in to the operations experience web UI, you need a Microsoft Entra ID account with at least contributor permissions for the resource group that contains your **Kubernetes - Azure Arc** instance. To learn more, see [Operations experience web UI](../discover-manage-assets/howto-manage-assets-remotely.md#prerequisites).

Unless otherwise noted, you can run the console commands in this tutorial in either a Bash or PowerShell environment.

## What problem will we solve?

The data that OPC UA servers expose can have a complex structure and can be difficult to understand. Azure IoT Operations provides a way to model OPC UA assets as tags, events, and properties. This modeling makes it easier to understand the data and to use it in downstream processes such as the MQTT broker and data flows.

The tutorial also explains how to use credentials stored in Azure Key Vault to authenticate to the simulated OPC UA server.

## Deploy the OPC PLC simulator

This tutorial uses the OPC PLC simulator to generate sample data. To deploy the OPC PLC simulator:

1. Download the [opc-plc-tutorial-deployment.yaml](https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/refs/heads/main/samples/quickstarts/opc-plc-tutorial-deployment.yaml) file from the GitHub repository. To download using the command line, run the following command:

    ```console
    wget https://raw.githubusercontent.com/Azure-Samples/explore-iot-operations/refs/heads/main/samples/quickstarts/opc-plc-tutorial-deployment.yaml -O opc-plc-tutorial-deployment.yaml
    ```

1. Open the `opc-plc-tutorial-deployment.yaml` file you downloaded in a text editor and change the password for the simulator. The password is set using the `--defaultpassword` parameter. Make a note of the password value, you need it later. Then, save your changes.

1. To deploy the OPC PLC simulator to your cluster, run the following command:

    ```console
    kubectl apply -f opc-plc-tutorial-deployment.yaml
    ```

The following snippet shows the YAML file that you applied:

:::code language="yaml" source="~/azure-iot-operations-samples/samples/quickstarts/opc-plc-tutorial-deployment.yaml":::

## Establish mutual trust

Before the OPC PLC simulator can send data to the connector for OPC UA, you need to establish mutual trust between them. In this tutorial, the OPC PLC simulator and the connector for OPC UA use self-signed certificates to establish the mutual trust with the connector for OPC UA:

- The simulator's application instance certificate is stored in the `opc-plc-default-application-cert` Kubernetes secret.
- The connector for OPC UA's application instance certificate is stored in the `aio-opc-opcuabroker-default-application-cert` Kubernetes secret.

> [!IMPORTANT]
> In a production environment use enterprise grade application instance certificates to establish the mutual trust. To learn more, see [Configure an enterprise grade application instance certificate](../discover-manage-assets/howto-configure-opcua-certificates-infrastructure.md#configure-an-enterprise-grade-application-instance-certificate).

### Add the connector's certificate to the simulator's trust list

Each OPC UA server has its own mechanism for managing the trust list. To add the connector's certificate to the simulator's trust list, run the following commands:

```bash
cert=$(kubectl -n azure-iot-operations get secret aio-opc-opcuabroker-default-application-cert -o jsonpath='{.data.tls\.crt}' | base64 -d)
data=$(kubectl create secret generic temp --from-literal=opcuabroker.crt="$cert" --dry-run=client -o jsonpath='{.data}')
kubectl patch secret opc-plc-trust-list -n azure-iot-operations -p "{\"data\": $data}"
```

```powershell
$cert = kubectl -n azure-iot-operations get secret aio-opc-opcuabroker-default-application-cert -o jsonpath='{.data.tls\.crt}' | base64 -d
$data = kubectl create secret generic temp --from-literal=opcuabroker.crt="$cert" --dry-run=client -o jsonpath='{.data}'
kubectl patch secret opc-plc-trust-list -n azure-iot-operations -p "{""data"": $data}"
```

### Add the simulator's certificate to the connector's trust list

Every OPC UA server type has its own mechanism for managing its application instance certificate. To download the simulator's certificate to a file called `opcplc-000000.crt`, run the following command:

```console
kubectl -n azure-iot-operations get secret opc-plc-default-application-cert -o jsonpath='{.data.tls\.crt}' | base64 -d > opcplc-000000.crt
```

To add the simulator's certificate to the connector's trust list:

1. Go to the [operations experience](https://iotoperations.azure.com) web UI and sign in with your Microsoft Entra ID credentials.

1. Select your site. If you're working with a new deployment, there are no sites yet. You can find the cluster you created in the previously by selecting **View unassigned instances**. In the operations experience, an instance represents a cluster where you deployed Azure IoT Operations.

    :::image type="content" source="media/tutorial-add-assets/site-list.png" lightbox="media/tutorial-add-assets/site-list.png" alt-text="Screenshot that shows the unassigned instances node in the operations experience.":::

1. Select the instance where you deployed Azure IoT Operations:

    :::image type="content" source="media/tutorial-add-assets/cluster-list.png" lightbox="media/tutorial-add-assets/cluster-list.png" alt-text="Screenshot of Azure IoT Operations instance list.":::

    > [!TIP]
    > If you don't see any instances, you might not be in the right Microsoft Entra ID tenant. You can change the tenant from the top right menu in the operations experience.

1. Select **Asset endpoints** and then **Manage certificates and secrets**:

    :::image type="content" source="media/tutorial-add-assets/manage-certificates.png" lightbox="media/tutorial-add-assets/manage-certificates.png" alt-text="Screenshot that shows how to find the manage certificates page in the operations experience.":::

1. On the **Certificates page**, select **Trust list** and then **Add new certificate**:

    :::image type="content" source="media/tutorial-add-assets/add-certificate.png" lightbox="media/tutorial-add-assets/add-certificate.png" alt-text="Screenshot that shows how to add a certificate to the trust list in the operations experience.":::

1. Select **Upload certificate** and choose the `opcplc-000000.crt` file you downloaded previously. Then select **Upload**:

    :::image type="content" source="media/tutorial-add-assets/uploaded-certificate.png" lightbox="media/tutorial-add-assets/uploaded-certificate.png" alt-text="Screenshot that shows a successful certificate upload.":::

1. Select **Apply**.

The simulator's application instance certificate is now in the connector for OPC UA's trust list.

## Add an asset endpoint

In this step, you use the operations experience to add an asset endpoint that enables you to connect to the OPC PLC simulator. To add an asset endpoint:

1. Select **Asset endpoints** and then **Create asset endpoint**:

    :::image type="content" source="media/tutorial-add-assets/asset-endpoints.png" lightbox="media/tutorial-add-assets/asset-endpoints.png" alt-text="Screenshot that shows the asset endpoints page in the operations experience.":::

1. Enter the following endpoint information:

    | Field | Value |
    | --- | --- |
    | Asset endpoint name | `opc-ua-connector-0` |
    | OPC UA server URL | `opc.tcp://opcplc-000000:50000` |
    | User authentication mode | `Username password` |
    | Synced secret name | `plc-credentials` |

In this tutorial, you add new secrets to your Azure Key Vault instance from the operations experience web UI. The secrets are automatically synced to your Kubernetes cluster:

1. To add a username reference, select **Add reference**, then **Create new**.

1. Enter `plcusername` as the secret name and `contosouser` as the secret value. Then select **Apply**.

1. To add a password reference, select **Add reference**, then **Create new**.

1. Enter `plcpassword` as the secret name and the password you added to the opc-plc-deployment.yaml file as the secret value. Then select **Apply**.

1. To save the asset endpoint definition, select **Create**.

This configuration deploys a new asset endpoint called `opc-ua-connector-0` to the cluster. You can view the asset endpoint in the Azure portal or you can use `kubectl` to view the asset endpoints in your Kubernetes cluster:

```console
kubectl get assetendpointprofile -n azure-iot-operations
```

You can see the `plcusername` and `plcpassword` secrets in the Azure Key Vault instance in your resource group. The secrets are synced to your Kubernetes cluster where you can see them by using the `kubectl get secret plc-credentials -n azure-iot-operations` command. You can also see the secrets in the operations experience on the **Manage synced secrets** page.

## Manage your assets

After you select your instance in operations experience, you see the available list of assets on the **Assets** page. If there are no assets yet, this list is empty:

:::image type="content" source="media/tutorial-add-assets/create-asset-empty.png" lightbox="media/tutorial-add-assets/create-asset-empty.png" alt-text="Screenshot of Azure IoT Operations empty asset list.":::

### Create an asset

To create an asset, select **Create asset**. Then enter the following asset information:

| Field | Value |
| --- | --- |
| Asset Endpoint | `opc-ua-connector-0` |
| Asset name | `thermostat` |
| Description | `A simulated thermostat asset` |
| Default MQTT topic | `azure-iot-operations/data/thermostat` |

Remove the existing **Custom properties** and add the following custom properties. Be careful to use the exact property names, as the Power BI template in a later tutorial queries for them:

| Property name | Property detail |
|---------------|-----------------|
| batch         | 102             |
| customer      | Contoso         |
| equipment     | Boiler          |
| isSpare       | true            |
| location      | Seattle         |

:::image type="content" source="media/tutorial-add-assets/create-asset-details.png" lightbox="media/tutorial-add-assets/create-asset-details.png" alt-text="Screenshot of Azure IoT Operations asset details page.":::

Select **Next** to go to the **Add tags** page.

### Create OPC UA tags

Add two OPC UA tags on the **Add tags** page. To add each tag, select **Add tag or CSV** and then select **Add tag**. Enter the tag details shown in the following table:

| Node ID            | Tag name    | Observability mode |
| ------------------ | ----------- | ------------------ |
| ns=3;s=SpikeData   | temperature | None               |

The node ID here is specific to the OPC UA simulator. The node generates random values within a specified range and also has intermittent spikes.

The **Observability mode** is one of the following values: `None`, `Gauge`, `Counter`, `Histogram`, or `Log`.

You can select **Manage default settings** to change the default sampling interval and queue size for each tag.

:::image type="content" source="media/tutorial-add-assets/add-tag.png" lightbox="media/tutorial-add-assets/add-tag.png" alt-text="Screenshot of Azure IoT Operations add tag page.":::

Select **Next** to go to the **Add events** page and then **Next** to go to the **Review** page.

### Review

Review your asset and tag details and make any adjustments you need before you select **Create**:

:::image type="content" source="media/tutorial-add-assets/review-asset.png" lightbox="media/tutorial-add-assets/review-asset.png" alt-text="Screenshot of Azure IoT Operations create asset review page.":::

This configuration deploys a new asset called `thermostat` to the cluster. You can view your assets in your resource group in the Azure portal. You can also use `kubectl` to view the assets locally in your cluster:

```console
kubectl get assets -n azure-iot-operations
```

## View resources in the Azure portal

To view the asset endpoint and asset you created in the Azure portal, go to the resource group that contains your Azure IoT Operations instance. You can see the thermostat asset in the **Azure IoT Operations** resource group. If you select **Show hidden types**, you can also see the asset endpoint:

:::image type="content" source="media/tutorial-add-assets/azure-portal.png" lightbox="media/tutorial-add-assets/azure-portal.png" alt-text="Screenshot of Azure portal showing the Azure IoT Operations resource group including the asset and asset endpoint.":::

The portal enables you to view the asset details. Select **JSON View** for more details:

:::image type="content" source="media/tutorial-add-assets/thermostat-asset.png" lightbox="media/tutorial-add-assets/thermostat-asset.png" alt-text="Screenshot of Azure IoT Operations asset details in the Azure portal.":::

## Verify data is flowing

[!INCLUDE [deploy-mqttui](../includes/deploy-mqttui.md)]

To verify that the thermostat asset you added is publishing data, view the messages in the `azure-iot-operations/data` topic:

```output
Client $server-generated/0000aaaa-11bb-cccc-dd22-eeeeee333333 received PUBLISH (d0, q0, r0, m0, 'azure-iot-operations/data/thermostat', ... (92 bytes))
azure-iot-operations/data/thermostat {"temperature":{"SourceTimestamp":"2025-02-14T11:27:44.5030912Z","Value":48.17536741017152}}
Client $server-generated/0000aaaa-11bb-cccc-dd22-eeeeee333333 received PUBLISH (d0, q0, r0, m0, 'azure-iot-operations/data/thermostat', ... (90 bytes))
azure-iot-operations/data/thermostat {"temperature":{"SourceTimestamp":"2025-02-14T11:27:45.50333Z","Value":98.22872507286887}}
Client $server-generated/0000aaaa-11bb-cccc-dd22-eeeeee333333 received PUBLISH (d0, q0, r0, m0, 'azure-iot-operations/data/thermostat', ... (92 bytes))
azure-iot-operations/data/thermostat {"temperature":{"SourceTimestamp":"2025-02-14T11:27:46.503381Z","Value":12.533323356430426}}
```

If there's no data flowing, restart the `aio-opc-opc.tcp-1` pod:

1. Find the name of your `aio-opc-opc.tcp-1` pod by using the following command:

    ```console
    kubectl get pods -n azure-iot-operations
    ```

    The name of your pod looks like `aio-opc-opc.tcp-1-849dd78866-vhmz6`.

1. Restart the `aio-opc-opc.tcp-1` pod by using a command that looks like the following example. Use the `aio-opc-opc.tcp-1` pod name from the previous step:

    ```console
    kubectl delete pod aio-opc-opc.tcp-1-849dd78866-vhmz6 -n azure-iot-operations
    ```

The sample tags you added in the previous tutorial generate messages from your asset that look like the following example:

```json
{
    "temperature":{
        "Value":24.86898871648548,
        "SourceTimestamp":"2025-04-25T14:50:07.195274Z"
    }
}
```

## How did we solve the problem?

In this tutorial, you added an asset endpoint and then defined an asset and tags. The assets and tags model data from the OPC UA server to make the data easier to use in an MQTT broker and other downstream processes.

You used credentials stored in Azure Key Vault to authenticate to the OPC UA server. This approach is more secure than hardcoding credentials in your asset definition.

You use the thermostat asset you defined in the next tutorial.

## Clean up resources

If you're continuing on to the next tutorial, keep all of your resources.

[!INCLUDE [tidy-resources](../includes/tidy-resources.md)]

## Next step

[Tutorial: Send messages from your asset to the cloud using a data flow](tutorial-upload-messages-to-cloud.md).
