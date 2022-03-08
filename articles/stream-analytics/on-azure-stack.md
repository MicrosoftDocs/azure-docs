---
title: Run Azure Stream Analytics on Azure Stack
description: Create an Azure Stream Analytics edge job and deploy it to Azure Stack Hub via the Azure IoT Edge runtime.
ms.service: stream-analytics
author: an-emma
ms.author: raan
ms.topic: how-to
ms.date: 03/15/2021
---

# Run Azure Stream Analytics on Azure Stack

You can run Azure Stream Analytics on Azure Stack Hub as an Azure IoT Edge module. Configurations added to the IoT Edge module allow it to interact with Azure Blob Storage, Azure Event Hubs, and Azure IoT Hub running in an Azure Stack Hub subscription by allowing custom URLs found in every Azure Stack Hub employment.

With Stream Analytics on Azure Stack, you can build truly hybrid architectures for stream processing in your own private, autonomous cloud. Your cloud can be connected or disconnected with cloud-native apps by using consistent Azure services on-premises. 

This article shows you how to stream data from IoT Hub or Event Hubs to another event hub or blob storage in an Azure Stack Hub subscription and process it with Stream Analytics.

## Set up environments

Stream Analytics is a hybrid service on Azure Stack Hub. It's an IoT Edge module that's configured in Azure but can be run on Azure Stack Hub.

If you're new to Azure Stack Hub or IoT Edge, follow the instructions here to set up environments.

### Prepare the Azure Stack Hub environment

Create an Azure Stack Hub subscription. For more information, see the [tutorial for creating an Azure Stack Hub subscription](/azure-stack/user/azure-stack-subscribe-services/).

If you want to evaluate Azure Stack Hub on your own server, you can use the Azure Stack Development Kit (ASDK). For more information on the ASDK, see the [ASDK overview](/azure-stack/asdk/).

### Install the IoT Edge runtime

To run Stream Analytics on Azure Stack Hub, your device must have the IoT Edge runtime and must have network connectivity to the Azure Stack hub or be a VM running on the Azure Stack hub. The IoT Edge runtime allows Stream Analytics edge jobs to integrate with Azure Storage and Azure Event Hubs that are running on your Azure Stack hub. For more information, see [Azure Stream Analytics on IoT Edge](stream-analytics-edge.md). 

In addition to having network access to the Azure Stack Hub resources, the IoT Edge device or VM needs access to IoT Hub in the Azure public cloud to configure the Stream Analytics module. 

The following articles show how to set up the IoT Edge runtime on your device or VM:

* [Install the Azure IoT Edge runtime on Windows](../iot-edge/how-to-provision-single-device-linux-on-windows-symmetric.md)
* [Install the Azure IoT Edge runtime on Debian-based Linux systems](../iot-edge/how-to-provision-single-device-linux-symmetric.md)


## Create an Azure Stream Analytics edge job

Stream Analytics edge jobs run in containers deployed to IoT Edge devices. They're composed of two parts:
* A cloud part that's responsible for job definition: users define inputs, output, query, and other settings, such as out-of-order events, in the cloud.
* A module running on your IoT devices. It contains the Stream Analytics engine and receives the job definition from the cloud.

### Create a storage account

When you create a Stream Analytics job to run on an IoT Edge device, it needs to be stored in a way that can be called from the device. You can use an existing Azure storage account or create a new one.
1. In the Azure portal, go to **Create a resource** > **Storage** > **Storage account - blob, file, table, queue**.
1. Provide the following values to create your storage account.

   | Field | Value |
   | --- | --- |
   | Name | Provide a unique name for your storage account. |
   | Location | Choose a location close to you.|
   | Subscription | Choose the same subscription as your IoT hub.|
   | Resource Group | Use the same resource group for all the test resources that you create during the [IoT Edge quickstarts](../iot-edge/quickstart.md) and tutorials. For example, use **IoTEdgeResources**. |

1. Keep the default values for the other fields, and select **Create**.


### Create a new job

1. In the Azure portal, go to **Create a resource** > **Internet of Things** > **Stream Analytics Job**.
1. Provide the following values to create your storage account.

   | Field | Value |
   | --- | --- |
   | Job Name | Provide a name for your job. An example is **IoTEdgeJob**. |
   | Subscription | Choose the same subscription as your IoT hub.|
   | Resource Group | Use the same resource group for all the test resources that you create during the [IoT Edge quickstarts](../iot-edge/quickstart.md) and tutorials. For example, use **IoTEdgeResources**. |
   | Location | Choose a location close to you. |
   | Hosting Environment | Select **Edge**. |

1. Select **Create**.

### Configure your job

After you create your Stream Analytics job in the Azure portal, configure it with an input, an output, and a query to run on the data that passes through. You can manually specify inputs from an IoT hub or an event hub in an Azure Stack Hub subscription.

1. Go to your Stream Analytics job in the Azure portal.
1. Under **Configure**, select **Storage account settings**, and choose the storage account you created in the previous step.

   :::image type="content" source="media/on-azure-stack/storage-account-settings.png" alt-text="Screenshot that shows the Job storage account setting." lightbox="media/on-azure-stack/storage-account-settings.png":::

1. Under **Job Topology**, select **Inputs** > **Add stream input.**
1. Select **IoT Hub**, **Event Hub**, or **Edge Hub** from the dropdown list. 
1. If the input is an event hub or IoT hub in an Azure Stack Hub subscription, provide information manually as shown here.

   #### Event hub

   | Field | Value |
   | --- | --- |
   | Input alias | A friendly name that you use in the job's query to reference this input. |
   | Service Bus namespace | The namespace is a container for a set of messaging entities. When you create a new event hub, you also create the namespace. An example is `sb://<Event Hub Name>.eventhub.shanghai.azurestack.corp.microsoft.com`. |
   | Event Hub name | The name of the event hub to use as input. |
   | Event Hub policy name | The shared access policy that provides access to the event hub. Each shared access policy has a name, permissions that you set, and access keys. This option is automatically populated unless you select the option to provide the event hub settings manually. |
   | Event Hub policy key | The shared access key used to authorize access to the event hub. This option is automatically populated unless you select the option to provide the event hub settings manually. You can find it in the event hub settings. |
   | Event Hub consumer group (optional) | Use a distinct consumer group for each Stream Analytics job. This string identifies the consumer group to use to ingest data from the event hub. If no consumer group is specified, the Stream Analytics job uses the $Default consumer group. |
   | Partition count | Partition count is the number of partitions in an event hub. |

   :::image type="content" source="media/on-azure-stack/event-hub-input.png" alt-text="Screenshot that shows Event Hub Inputs." lightbox="media/on-azure-stack/event-hub-input.png":::
   
   #### IoT hub

   | Field | Value |
   | --- | --- |
   | Input alias | A friendly name that you use in the job's query to reference this input. |
   | IoT Hub | The name of the IoT hub to use as input. An example is `<IoT Hub Name>.shanghai.azurestack.corp.microsoft.com`. |
   | Shared access policy name | The shared access policy that provides access to the IoT hub. Each shared access policy has a name, permissions that you set, and access keys. |
   | Shared access policy key | The shared access key used to authorize access to the IoT hub. This option is automatically populated unless you select the option to provide the Iot hub settings manually. |
   | Consumer group (optional) | Use a different consumer group for each Stream Analytics job. The consumer group is used to ingest data from the IoT hub. Stream Analytics uses the $Default consumer group unless you specify otherwise. |
   | Partition count | Partition count is the number of partitions in an event hub. |

   :::image type="content" source="media/on-azure-stack/iot-hub-input.png" alt-text="Screenshot that shows IoT Hub inputs." lightbox="media/on-azure-stack/iot-hub-input.png" :::

1. Keep the default values for the other fields, and select **Save**.
1. Under **Job Topology**, open **Outputs**, and then select **Add**.
1. Select **Blob Storage**, **Event Hub**, or **Edge Hub** from the dropdown list.
1. If the output is an event hub or blob storage in an Azure Stack Hub subscription, provide information manually as shown here.

   #### Event hub

   | Field | Value |
   | --- | --- |
   | Output alias | A friendly name used in queries to direct the query output to this event hub. |
   | Service Bus namespace | A container for a set of messaging entities. When you created a new event hub, you also created a service bus namespace. An example is `sb://<Event Hub Name>.eventhub.shanghai.azurestack.corp.microsoft.com`. |
   | Event Hub name | The name of your event hub output. |
   | Event Hub policy name | The shared access policy, which you can create on the event hub's **Configure** tab. Each shared access policy has a name, permissions that you set, and access keys. |
   | Event Hub policy key | The shared access key that's used to authenticate access to the event hub namespace. |

   :::image type="content" source="media/on-azure-stack/event-hub-output.png" lightbox="media/on-azure-stack/event-hub-output.png" alt-text="Screenshot that shows Event Hub outputs.":::
   #### Blob storage 

   | Field | Value |
   | --- | --- |
   | Output alias | A friendly name used in queries to direct the query output to this blob storage. |
   | Storage account | The name of the storage account where you're sending your output. An example is `<Storage Account Name>.blob.shanghai.azurestack.corp.microsoft.com`. |
   | Storage account key | The secret key associated with the storage account. This option is automatically populated unless you select the option to provide the blob storage settings manually. |

> [!NOTE]
> Parquet format isn't supported for edge jobs on Azure Stack Hub. For **Minimum** rows and **Maximum** time, use **0** or leave them blank.


## Deploy Stream Analytics on a VM or device connected to Azure Stack

1. In the Azure portal, open IoT Hub. Go to **IoT Edge**, and select the device or VM you want to target for this deployment.
1. Select **Set modules** > **+ Add**, and then select **Azure Stream Analytics Module**. 
1. Select the subscription and the Stream Analytics edge job that you created. Select **Save**, and then select **Next:Routes**.

   :::image type="content" source="media/on-azure-stack/edge-modules.png" lightbox="media/on-azure-stack/edge-modules.png" alt-text="Screenshot that shows adding modules.":::

1. Select **Review + create >**.
1. In the **Review + create** step, select **Create**.

   :::image type="content" source="media/on-azure-stack/module-content.png" lightbox="media/on-azure-stack/module-content.png" alt-text="Screenshot that shows the manifest.":::

1. Confirm that the module is added to the list.

   :::image type="content" source="media/on-azure-stack/edge-deployment.png" lightbox="media/on-azure-stack/edge-deployment.png" alt-text="Screenshot that shows the deployment page.":::
## Next steps
- [Azure Stream Analytics on IoT Edge](./stream-analytics-edge.md)
- [Develop Stream Analytics edge jobs](/stream-analytics-query/stream-analytics-query-language-reference)
