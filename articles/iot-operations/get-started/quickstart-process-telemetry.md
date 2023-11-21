---
title: "Quickstart: process data from your OPC UA assets"
description: "Quickstart: Use a Data Processor pipeline to process data from your OPC UA assets before sending the data to a Microsoft Fabric OneLake lakehouse."
author: dominicbetts
ms.author: dobett
ms.topic: quickstart
ms.custom:
  - ignite-2023
ms.date: 10/11/2023

#CustomerIntent: As an OT user, I want to process and enrich my OPC UA data so that I can derive insights from it when I analyze it in the cloud.
---

# Quickstart: Use Data Processor pipelines to process data from your OPC UA assets

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

In this quickstart, you use Azure IoT Data Processor (preview) pipelines to process and enrich messages from your OPC UA assets before you send the data to a Microsoft Fabric OneLake lakehouse for storage and analysis.

## Prerequisites

Before you begin this quickstart, you must complete the following quickstarts:

- [Quickstart: Deploy Azure IoT Operations to an Arc-enabled Kubernetes cluster](quickstart-deploy.md)
- [Quickstart: Add OPC UA assets to your Azure IoT Operations cluster](quickstart-add-assets.md)

You also need a Microsoft Fabric subscription. You can sign up for a free [Microsoft Fabric (Preview) Trial](/fabric/get-started/fabric-trial). In your Microsoft Fabric subscription, ensure that the following settings are enabled for your tenant:

- [Allow service principals to use Power BI APIs](/fabric/admin/service-admin-portal-developer#allow-service-principals-to-use-power-bi-apis)
- [Users can access data stored in OneLake with apps external to Fabric](/fabric/admin/service-admin-portal-onelake#users-can-access-data-stored-in-onelake-with-apps-external-to-fabric)

To learn more, see [Microsoft Fabric > About tenant settings](/fabric/admin/tenant-settings-index).

## What problem will we solve?

Before you send data to the cloud for storage and analysis, you might want to process and enrich the data. For example, you might want to add contextualized information to the data, or you might want to filter out data that isn't relevant to your analysis. Azure IoT Data Processor pipelines enable you to process and enrich data before you send it to the cloud.

## Create a service principal

To create a service principal that gives your pipeline access to your Microsoft Fabric workspace:

1. Use the following Azure CLI command to create a service principal.

    ```bash
    az ad sp create-for-rbac --name <YOUR_SP_NAME> 
    ```

1. The output of this command includes an `appId`, `displayName`, `password`, and `tenant`. Make a note of these values to use when you configure access to your Fabric workspace, create a secret, and configure a pipeline destination:

    ```json
    {
        "appId": "<app-id>",
        "displayName": "<name>",
        "password": "<client-secret>",
        "tenant": "<tenant-id>"
    }
    ```

## Grant access to your Microsoft Fabric workspace

Navigate to [Microsoft Fabric](https://msit.powerbi.com/groups/me/list?experience=power-bi).

To ensure you can see the **Manage access** option in your Microsoft Fabric workspace, create a new workspace:

1. Select **Workspaces** in the left navigation bar, then select **New Workspace**:

    :::image type="content" source="media/quickstart-process-telemetry/create-fabric-workspace.png" alt-text="Screenshot that shows how to create a new Microsoft Fabric workspace.":::

1. Enter a name for your workspace such as _Your name AIO workspace_ and select **Apply**.

To grant the service principal access to your Microsoft Fabric workspace:

1. Navigate to your Microsoft Fabric workspace and select **Manage access**:

    :::image type="content" source="media/quickstart-process-telemetry/workspace-manage-access.png" alt-text="Screenshot that shows how to access the Manage access option in a workspace.":::

1. Select **Add people or groups**, then paste the display name of the service principal from the previous step and grant at least **Contributor** access to it.

    :::image type="content" source="media/quickstart-process-telemetry/workspace-add-service-principal.png" alt-text="Screenshot that shows how to add a service principal to a workspace and add it to the contributor role.":::

1. Select **Add** to grant the service principal contributor permissions in the workspace.

## Create a lakehouse

Create a lakehouse in your Microsoft Fabric workspace:

1. Navigate to **Data Engineering** and then select **Lakehouse (Preview)**:

    :::image type="content" source="media/quickstart-process-telemetry/create-lakehouse.png" alt-text="Screenshot that shows how to create a lakehouse.":::

1. Enter a name for your lakehouse such as _yourname_pipeline_destination_ and select **Create**.

## Add a secret to your cluster

To access the lakehouse from a Data Processor pipeline, you need to enable your cluster to access the service principal details you created earlier. You need to configure your Azure Key Vault with the service principal details so that the cluster can retrieve them.

Use the following command to add a secret to your Azure Key Vault that contains the client secret you made a note of when you created the service principal. You created the Azure Key Vault in the [Deploy Azure IoT Operations to an Arc-enabled Kubernetes cluster](quickstart-deploy.md) quickstart:

```azurecli
az keyvault secret set --vault-name <your-key-vault-name> --name AIOFabricSecret --value <client-secret>
```

To add the secret reference to your Kubernetes cluster, edit the **aio-default-spc** `secretproviderclass` resource:

1. Enter the following command on the machine where your cluster is running to edit the **aio-default-spc** `secretproviderclass` resource. The YAML configuration for the resource opens in your default editor:

    ```bash
    kubectl edit secretproviderclass aio-default-spc -n azure-iot-operations
    ```

1. Add a new entry to the array of secrets for your new Azure Key Vault secret. The `spec` section looks like the following example:

    ```yaml
    # Please edit the object below. Lines beginning with a '#' will be ignored,
    # and an empty file will abort the edit. If an error occurs while saving this file will be
    # reopened with the relevant failures.
    #
    apiVersion: secrets-store.csi.x-k8s.io/v1
    kind: SecretProviderClass
    metadata:
      creationTimestamp: "2023-11-16T11:43:31Z"
      generation: 2
      name: aio-default-spc
      namespace: azure-iot-operations
      resourceVersion: "89083"
      uid: cda6add7-3931-47bd-b924-719cc862ca29
    spec:                                      
      parameters:                              
        keyvaultName: <this is the name of your key vault>         
        objects: |                             
          array:                               
            - |                                
              objectName: azure-iot-operations
              objectType: secret           
              objectVersion: ""            
            - |                            
              objectName: AIOFabricSecret  
              objectType: secret           
              objectVersion: ""            
        tenantId: <this is your tenant id>
        usePodIdentity: "false"                       
      provider: azure
    ```

1. Save the changes and exit from the editor.

The CSI driver updates secrets by using a polling interval, therefore the new secret isn't available to the pod until the polling interval is reached. To update the pod immediately, restart the pods for the component. For Data Processor, run the following commands:

```bash
kubectl delete pod aio-dp-reader-worker-0 -n azure-iot-operations
kubectl delete pod aio-dp-runner-worker-0 -n azure-iot-operations
```

## Create a basic pipeline

Create a basic pipeline to pass through the data to a separate MQTT topic.

In the following steps, leave all values at their default unless otherwise specified:

1. In the [Azure IoT Operations portal](https://iotoperations.azure.com), navigate to **Data pipelines** in your cluster.  

1. To create a new pipeline, select **+ Create pipeline**.

1. Select **Configure source > MQ**, then enter information from the thermostat data MQTT topic, and then select **Apply**:

    | Parameter     | Value                               |
    | ------------- | ----------------------------------- |
    | Name          | `input data`                    |
    | Broker        | `tls://aio-mq-dmqtt-frontend:8883` |
    | Authentication| `Service account token (SAT)`                  |
    | Topic         | `azure-iot-operations/data/opc.tcp/opc.tcp-1/#`                    |
    | Data format   | `JSON`                              |

1. Select **Transform** from **Pipeline Stages** as the second stage in this pipeline. Enter the following values and then select **Apply**:

    | Parameter     | Value  |
    | ------------- | ----------- |
    | Display name  | `passthrough` |
    | Query         | `.`         |

    This simple JQ transformation passes through the incoming message unchanged.

1. Finally, select **Add destination**, select **MQ** from the list of destinations, enter the following information and then select **Apply**:

    | Parameter      | Value                             |
    | -------------- | --------------------------------- |
    | Display name   | `output data`             |
    | Broker         | `tls://aio-mq-dmqtt-frontend:8883` |
    | Authentication | `Service account token (SAT)`      |
    | Topic          | `dp-output`                 |
    | Data format    | `JSON`                              |
    | Path           | `.payload`                        |

1. Select the pipeline name, **\<pipeline-name\>**, and change it to _passthrough-data-pipeline_. Select **Apply**.
1. Select **Save** to save and deploy the pipeline. It takes a few seconds to deploy this pipeline to your cluster.
1. Connect to the MQ broker using your MQTT client again. This time, specify the topic `dp-output`.

    ```bash
    mqttui -b mqtt://127.0.0.1:1883 "dp-output"
    ```

1. You see the same data flowing as previously. This behavior is expected because the deployed _passthrough data pipeline_ doesn't transform the data. The pipeline routes data from one MQTT topic to another.

The next steps are to build two more pipelines to process and contextualize your data. These pipelines send the processed data to a Fabric lakehouse in the cloud for analysis.

## Create a reference data pipeline

Create a reference data pipeline to temporarily store reference data in a reference dataset. Later, you use this reference data to enrich data that you send to your Microsoft Fabric lakehouse.

In the following steps, leave all values at their default unless otherwise specified:

1. In the [Azure IoT Operations portal](https://iotoperations.azure.com), navigate to **Data pipelines** in your cluster.  

1. Select **+ Create pipeline** to create a new pipeline.

1. Select **Configure source > MQ**, then enter information from the reference data topic, and then select **Apply**:

    | Parameter     | Value                               |
    | ------------- | ----------------------------------- |
    | Name          | `reference data`                    |
    | Broker        | `tls://aio-mq-dmqtt-frontend:8883` |
    | Authentication| `Service account token (SAT)`       |
    | Topic         | `reference_data`                    |
    | Data format   | `JSON`                              |

1. Select **+ Add destination** and set the destination to **Reference datasets**.

1. Select **Create new** next to **Dataset** to configure a reference dataset to store reference data for contextualization. Use the information in the following table to create the reference dataset:

    | Parameter      | Value                             |
    | -------------- | --------------------------------- |
    | Name           | `equipment-data`                  |
    | Expiration time | `1h`                              |

1. Select **Create dataset** to save the reference dataset destination details. It takes a few seconds to deploy the dataset to your cluster and become visible in the dataset list view.

1. Use the values in the following table to configure the destination stage. Then select **Apply**:

    | Parameter     | Value                                   |
    | ------------- | --------------------------------------- |
    | Name          | `reference data output`                 |
    | Dataset       | `equipment-data` (select from the dropdown) |

1. Select the pipeline name, **\<pipeline-name\>**, and change it to _reference-data-pipeline_. Select **Apply**.

1. Select the middle stage, and delete it. Then, use the cursor to connect the input stage to the output stage. The result looks like the following screenshot:

    :::image type="content" source="media/quickstart-process-telemetry/reference-data-pipeline.png" alt-text="Screenshot that shows the reference data pipeline.":::

1. Select **Save** to save the pipeline.

To store the reference data, publish it as an MQTT message to the `reference_data` topic by using the mqttui tool:

```bash
mqttui -b mqtt://127.0.0.1:1883 publish "reference_data" '{ "customer": "Contoso", "batch": 102, "equipment": "Boiler", "location": "Seattle", "isSpare": true }'
```

After you publish the message, the pipeline receives the message and stores the data in the equipment data reference dataset.

## Create a data pipeline to enrich your data

Create a Data Processor pipeline to process and enrich your data before it sends it to your Microsoft Fabric lakehouse. This pipeline uses the data stored in the equipment data reference data set to enrich messages.

1. In the [Azure IoT Operations portal](https://iotoperations.azure.com), navigate to **Data pipelines** in your cluster.  

1. Select **+ Create pipeline** to create a new pipeline.

1. Select **Configure source > MQ**, use the information in the following table to enter information from the thermostat data MQTT topic, then select **Apply**:

    | Parameter     | Value |
    | ------------- | ----- |
    | Display name  | `OPC UA data` |
    | Broker        | `tls://aio-mq-dmqtt-frontend:8883` |
    | Authentication| `Service account token (SAT)` |
    | Topic         | `azure-iot-operations/data/opc.tcp/opc.tcp-1/thermostat` |
    | Data Format   | `JSON` |

1. To track the last known value (LKV) of the temperature, select **Stages**, and select **Last known values**. Use the information the following tables to configure the stage to track the LKVs of temperature for the messages that only have boiler status messages, then select **Apply**:

    | Parameter         | Value |
    | ----------------- | ----- |
    | Display name      | `lkv stage` |

    Add two properties:

    | Parameter         | Value |
    | ----------------- | ----- |
    | Input path        | `.payload.payload["temperature"]` |
    | Output path       | `.payload.payload.temperature_lkv` |
    | Expiration time    | `01h` |

    | Parameter         | Value |
    | ----------------- | ----- |
    | Input path        | `.payload.payload["Tag 10"]` |
    | Output path       | `.payload.payload.tag1_lkv` |
    | Expiration time    | `01h` |

    This stage enriches the incoming messages with the latest `temperature` and `Tag 10` values if they're missing. The tracked latest values are retained for 1 hour. If the tracked properties appear in the message, the tracked latest value is updated to ensure that the values are always up to date.

1. To enrich the message with the contextual reference data, select **Enrich** from **Pipeline Stages**. Configure the stage by using the values in the following table and then select **Apply**:

    | Parameter     | Value                            |
    | ------------- | -------------------------------- |
    | Name          | `enrich with reference dataset`  |
    | Dataset       | `equipment-data` (from dropdown) |
    | Output path   | `.payload.enrich`                |

    This step enriches your OPC UA message with data the from **equipment-data** dataset that the reference data pipeline created.

    Because you don't provide any conditions, the message is enriched with all the reference data. You can use ID-based joins (`KeyMatch`) and timestamp-based joins (`PastNearest` and `FutureNearest`) to filter the enriched reference data based on the provided conditions.

1. To transform the data, select **Transform** from **Pipeline Stages**. Configure the stage by using the values in the following table and then select **Apply**:

    | Parameter     | Value       |
    | ------------- | ----------- |
    | Display name  | construct full payload |

    The following jq expression formats the payload property to include all telemetry values and all the contextual information as key value pairs:

    ```jq
    .payload = {
        assetName: .payload.dataSetWriterName,
        Timestamp: .payload.timestamp,
        Customer: .payload.enrich?.customer,
        Batch: .payload.enrich?.batch,
        Equipment: .payload.enrich?.equipment,
        IsSpare: .payload.enrich?.isSpare,
        Location: .payload.enrich?.location,
        CurrentTemperature : .payload.payload."temperature"?.Value,
        LastKnownTemperature: .payload.payload."temperature_lkv"?.Value,
        Pressure: (if .payload.payload | has("Tag 10") then .payload.payload."Tag 10"?.Value else .payload.payload."tag1_lkv"?.Value end)
    }
    ```

    Use the previous expression as the transform expression. This transform expression builds a payload containing only the necessary key value pairs for the telemetry and contextual data. It also renames the tags with user friendly names.

1. Finally, select **Add destination**, select **Fabric Lakehouse**, then enter the following information to set up the destination. You can find the workspace ID and lakehouse ID from the URL you use to access your Fabric lakehouse. The URL looks like: `https://msit.powerbi.com/groups/<workspace ID>/lakehouses/<lakehouse ID>?experience=data-engineering`.

    | Parameter      | Value                             |
    | -------------- | --------------------------------- |
    | Name           | `processed OPC UA data`                          |
    | URL            | `https://msit-onelake.pbidedicated.windows.net`  |
    | Authentication | `Service principal`     |
    | Tenant ID      | The tenant ID you made a note of previously when you created the service principal.     |
    | Client ID      | The client ID is the app ID you made a note of previously when you created the service principal.     |
    | Secret  | `AIOFabricSecret` - the Azure Key Vault secret reference you added. |
    | Workspace      | The Microsoft Fabric workspace ID you made a note of previously.  |
    | Lakehouse      | The lakehouse ID you made a note of previously.  |
    | Table          | `OPCUA`                                          |
    | Batch path     | `.payload`                                       |

    Use the following configuration to set up the columns in the output:

    | Name | Type | Path |
    | ---- | ---- | ---- |
    | Timestamp | Timestamp | `.Timestamp` |
    | AssetName | String | `.assetName` |
    | Customer | String | `.Customer` |
    | Batch | Integer | `.Batch` |
    | CurrentTemperature | Float | `.CurrentTemperature` |
    | LastKnownTemperature | Float | `.LastKnownTemperature` |
    | Pressure | Float | `.Pressure` |
    | IsSpare | Boolean | `.IsSpare` |

1. Select the pipeline name, **\<pipeline-name\>**, and change it to _contextualized-data-pipeline_. Select **Apply**.

1. Select **Save** to save the pipeline.

1. After a short time, the data from your pipeline begins to populate the table in your lakehouse.

:::image type="content" source="media/quickstart-process-telemetry/lakehouse-preview.png" alt-text="Screenshot that shows data from the pipeline appearing in the lakehouse table.":::

## How did we solve the problem?

In this quickstart, you used Data Processor pipelines to process your OPC UA data before sending it to a Microsoft Fabric lakehouse. You used the pipelines to:

- Enrich the data with contextual information such as the customer name and batch number.
- Fill in missing data points by using last known values.
- Structure the data into a suitable format for the lakehouse table.

## Clean up resources

If you're not going to continue to use this deployment, delete the Kubernetes cluster that you deployed Azure IoT Operations to and remove the Azure resource group that contains the cluster.

You can also delete your Microsoft Fabric workspace.

## Next step

[Quickstart: Deploy Azure IoT Operations to an Arc-enabled Kubernetes cluster](quickstart-get-insights.md)
