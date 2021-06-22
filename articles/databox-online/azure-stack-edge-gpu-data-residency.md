---
title: Data residency behavior of Azure Stack Edge Pro GPU/Pro R/Mini R devices
description: Describes data residency posture of your Azure Stack Edge devices.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 06/21/2021
ms.author: alkohli
---

# Enabling Data residency for your Azure Stack Edge devices

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes the information that you need to help understand the data residency behavior of Azure Stack Edge device and how to control data residency.  

## About data residency for Azure Stack Edge 

Currently the Southeast Asia (Singapore) region is paired with Hong Kong. The Azure region pairing implies that any data stored in Singapore is replicated in the corresponding paired regions which is Hong Kong. Singapore has laws in place that require that the customer data cannot leave the country boundaries. 

Microsoft has made changes to the Azure Stack Edge service so that the service-specific data is stored within a single region only and the service can also be deployed in a single region. This article covers all the changes made to the way the service-specific data is stored and the actions required by the customers to meet the data residency requirements. 

For more information, see [Single data residency for Azure services]().

## Summary of data residency behavior

The data residency posture of the Azure Stack Edge services can be categorized as follows:

- Existing Azure Stack Edge ordering and management.
- New Azure Edge Hardware Center that will be used for new orders going forward.
- Telemetry for the device and the service.
<!--- Proactive Support log collection where any logs that the service generates are stored in a single region and are not replicated to the paired region.-->

Azure Stack Edge also integrates with other services and behavior of the following dependent services is summarized:

- Azure IoT Hub and Azure IoT Edge
- Azure Key Vault 
- Azure Monitor 
- Azure Storage accounts

There are also services that are excluded from these data requirements, and these are briefly discussed later in this article.

## Azure Stack Edge ordering and management resource 

Azure Stack Edge service currently uses Azure Regional Pair to implement data resiliency against region-wide outages. For existing Azure Stack Edge resources in Singapore, the data is replicated to Hong Kong.

If you are creating a new Azure Stack Edge resource, you will have the option to select that data residency only in Singapore. If this option is selected, data will not be replicated to Hong Kong. If there is a region-wide service outage, you have two options:

- Wait for the Singapore region to be restored.

- Create a resource in another region, reset the device, and manage your device via the new resource. For detailed instructions, see [Reset and reactivate your Azure Stack Edge device](azure-stack-edge-reset-reactivate-device).

<!--The following table summarizes the data residency and outage behaviors for Azure Stack Edge v1 resource scenarios.
 
| If you... | You’ll observe this behavior...|...and this happens if there is an outage!                    |
|-----------------------|----------------------------------------------|-------------------------------------------------------------|
| Have an existing Azure Stack Edge resource                                                                                           | For existing resource, Azure Regional Pairs are used. This means that in Singapore, data will be replicated to Hong Kong. <br> Azure Stack Edge does not support migrating existing resources from Azure Regional Pair replication to Single Region Data Residency. | No changes, same as today. |
| Are creating a new Azure Stack Edge resource | See the screenshots below for the new behavior.| If the outage is zone-wide, Azure Stack Edge is resilient. <br><br>If the outage is region-wide and you have chosen Southeast Asia during resource creation/order placement: <ul><li> If you chose to replicate data across Azure regional pair (Hong Kong), current Business Continuity and Disaster Recovery (BCDR) flows will handle the service requests. Your resource will be resilient to the outage.</li><li> If you chose national boundary data residency, your data wouldn’t have replicated. You can either wait for the Singapore region to be restored or create a resource in another region, reset the device, and manage your device via the new resource.</ul> |

For more information, see storage provisioning options for applications in [Kubernetes storage for your Azure Stack Edge Pro device](azure-stack-edge-gpu-kubernetes-storage.md).-->

## Azure Edge Hardware Center Service (Preview)

For the upcoming Azure Edge Hardware Center service that allows you to create and manage Azure Stack Edge resources, when the orders are created in Southeast Asia region, you have the option to choose that the data resides only within Singapore and is not replicated. 

<!--- When you create an order resource in Southeast Asia region, the following informational message is displayed: 
    *Data related to your order will not be replicated outside Singapore (Southeast Asia Region) and hence will not be resilient to region-wide outages. Learn more.*-->

In the event of region-wide outages, you won’t be able to access the order resources. You will not be able to return, cancel, or delete the resources. If you request for updates on your order status or need to initiate a device return urgently during the service outage, Microsoft Support will handle those requests.

For detailed instructions, see [Create an order via the Azure Edge Hardware Center](azure-stack-edge-placeholder.md).

<!--## Proactive support log collection

There are two ways that allow the service to collect logs:
- Azure Stack Diagnostics and Analytics   This is an opt-in service via the Azure Stack Edge portal.
- Support package logs are categorized as logs and logs don’t come EUII classification.
Logs are considered as Support/Diagnostics data is also stored in Central (West US);

However Logs with Dumps potentially containing EUII stay in the region.
<!-- should not be in public facing doc However, there is a part of the Proactive log collection which is being done based on Device Alerts, and while the storage of these logs is in the region, the analysis is done at a central Kusto cluster. The team is looking to move the same to region storage by early [Ni]-->


## Azure Stack Edge telemetry

As Azure Stack Edge is a first-party Microsoft device, the telemetry from the device is automatically collected (without the user consent) and sent to Microsoft. This telemetry is stored in a common central location. This gathered telemetry provides valuable insights into enterprise deployments of Azure Stack Edge. This telemetry is also used for security, health, quality, and performance analysis.

- Microsoft collects telemetry for the infrastructure VMs (for example, Kubernetes master VM and Kubernetes worker VM) deployed on your Azure Stack Edge device and hosts. Telemetry is also gathered for other services that run on Azure Stack Edge device (for example, local Azure Resource Manager, Kubernetes dashboard). 
- The telemetry data is encrypted-in-transit as well at rest.
- Raw telemetry data sent to Microsoft is retained for 90 days. Aggregated data is retained for longer.
- For all the containerized workloads (deployed via IoT Edge and Kubernetes) and VM workloads, the application data is considered as the customer data. This data can only be accessed by the customer unless it pertains to the underlying infrastructure. 

For more information, see [Use the Kubernetes dashboard to monitor the Kubernetes cluster health on your Azure Stack Edge Pro device](azure-stack-edge-gpu-monitor-kubernetes-dashboard.md).

## Azure Stack Edge dependent services

### Azure Arc enabled Kubernetes clusters

For Singapore (Southeast Asia), Azure Arc data resides only within Singapore and is not replicated in Hong Kong. If there is a region-wide outage, the service is not resilient.

For all other regions, Azure Arc supports Azure Regional Pair and is resilient to any region-wide outages.

<!--
| If you...  | You’ll observe this behavior...|...and this happens if there is an outage! |
|----------------|--------------------------------|----------|
| Have an existing Azure Arc resource  | For Azure Arc - Config and Connect changes are deployed in Singapore. ZRS storage and in-region CosmosDB is used as part of this change. <br><br> In Singapore, Azure Arc only supports national data residency. This means customers will have to follow manual steps when Singapore region is down. | Manual BCDR steps, if any: To be checked with Arc PM.                                                                                     |-->

### Azure IoT

Azure IoT currently uses Azure Regional Pair for region outage resiliency. This means that for Singapore (Southeast Asia), the data is replicated to Hong Kong. 

<!--| If you...                           | You’ll observe this behavior….                                                                         | …and this happens if there is an outage! |
|-------------------------------------|--------------------------------------------------------------------------------------------------------|------------------------------------------|
| Have an existing Azure IoT resource. | Azure Regional Pairs are used. In Singapore, the data will be replicated to Hong Kong.                 | No change, same as today.                |
| Are creating an Azure IoT resource. | Currently there is no support for national data residency. This is likely to come in a future release. | Not applicable as of today.              |-->


### Azure Key Vault

Azure Key Vault currently uses Azure Regional Pair for region outage resiliency. For new Azure Key Vault resources, an option is now available that can be enabled at subscription level. When enabled, if your service is deployed in Singapore (Southeast Asia), you can control the data replication to Hong Kong. 

If you choose Singapore data residency, then service will not be resilient to region outages.

## Next steps

- Learn more about Kubernetes storage on [Azure Stack Edge device](azure-stack-edge-gpu-kubernetes-storage.md).

