---
title: Data residency and resiliency for Azure Stack Edge Pro GPU/Pro R/Mini R 
description: Describes data residency posture for Azure Stack Edge.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 10/01/2021
ms.author: alkohli
---

# Data residency and resiliency for Azure Stack Edge 

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes the information that you need to help understand the data residency and resiliency behavior for Azure Stack Edge and how to enable data residency in the service.  

## About data residency for Azure Stack Edge 

Azure Stack Edge services uses [Azure Regional Pairs](../availability-zones/cross-region-replication-azure.md#azure-paired-regions) when storing and processing customer data in all the geos where the service is available. For the Southeast Asia (Singapore) region, the service is currently paired with Hong Kong Special Administrative Region. The Azure region pairing implies that any data stored in Singapore is replicated in Hong Kong SAR. Singapore has laws in place that require that the customer data not leave the country/region boundaries. 

To ensure that the customer data resides in a single region only, a new option is enabled in the Azure Stack Edge service. This option when selected, lets the service store and process the customer data only in Singapore region. The customer data is not replicated to Hong Kong SAR. There is service-specific metadata (which is not sensitive data) that is still replicated to the paired region.  

With this option enabled, the service is resilient to zone-wide outages, but not to region-wide outages. If region-wide outages are important for you, then you should select the regional pair based replication.

The single region data residency option is available only for Southeast Asia (Singapore). For all other regions, Azure Stack Edge stores and processes customer data in the customer-specified geo.

The data residency posture of the Azure Stack Edge services can be summarized for the following aspects of the service:

- Existing Azure Stack Edge ordering and management service.
- New Azure Edge Hardware Center that will be used for new orders going forward.
<!--- Telemetry for the device and the service.
- Proactive Support log collection where any logs that the service generates are stored in a single region and are not replicated to the paired region.-->

Azure Stack Edge service also integrates with the following dependent services and their behavior is also summarized: 

- Azure Arc-enabled Kubernetes
- Azure IoT Hub and Azure IoT Edge
<!--- Azure Key Vault -->

> [!NOTE]
> - If you provide a support package with a crash dump for the Azure Stack Edge device, it can contain End User Identifiable Information (EUII) or End User Pseudonymous Information (EUPI) which will be processed and stored outside South East Asia.

## Azure Stack Edge classic ordering and management resource 

If you are using the classic experience to place an order for Azure Stack Edge, the service currently uses Azure Regional Pair to implement data resiliency against region-wide outages. For existing Azure Stack Edge resources in Singapore, the data is replicated to Hong Kong SAR.

If you are creating a new Azure Stack Edge resource, you have the option to enable data residency only in Singapore. When this option is selected, data is not replicated to Hong Kong SAR. If there is a region-wide service outage, you have two options:

- Wait for the Singapore region to be restored.

- Create a resource in another region, reset the device, and manage your device via the new resource. For detailed instructions, see [Reset and reactivate your Azure Stack Edge device](azure-stack-edge-reset-reactivate-device.md).

## Azure Edge Hardware Center ordering and management resource 

The new Azure Edge Hardware Center service is now available and allows you to create and manage Azure Stack Edge resources. When placing an order in Southeast Asia region, you can select the option to have your data resides only within Singapore and not be replicated. 

In the event of region-wide outages, you won’t be able to access the order resources. You will not be able to return, cancel, or delete the resources. If you request for updates on your order status or need to initiate a device return urgently during the service outage, Microsoft Support will handle those requests.

For detailed instructions, see [Create an order via the Azure Edge Hardware Center](azure-stack-edge-gpu-deploy-prep.md#create-a-new-resource).


<!--## Azure Stack Edge telemetry

As Azure Stack Edge is a first-party Microsoft device, the telemetry from the device is automatically collected (without the user consent) and sent to Microsoft. This telemetry is stored in a common central location. This gathered telemetry provides valuable insights into enterprise deployments of Azure Stack Edge. This telemetry is also used for security, health, quality, and performance analysis.

- Microsoft collects telemetry for the infrastructure VMs (for example, Kubernetes master VM and Kubernetes worker VM) deployed on your Azure Stack Edge device and hosts. Telemetry is also gathered for other services that run on Azure Stack Edge device (for example, local Azure Resource Manager, Kubernetes dashboard). 
- The telemetry data is encrypted-in-transit as well at rest.
- Raw telemetry data sent to Microsoft is retained for 90 days. Aggregated data is retained for longer.
- For all the containerized workloads (deployed via IoT Edge and Kubernetes) and VM workloads, the application data is considered as the customer data. This data can only be accessed by the customer unless it pertains to the underlying infrastructure. 

For more information, see [Use the Kubernetes dashboard to monitor the Kubernetes cluster health on your Azure Stack Edge Pro device](azure-stack-edge-gpu-monitor-kubernetes-dashboard.md).-->

## Azure Stack Edge dependent services

Azure Arc-enabled Kubernetes, Azure IoT Hub and Azure IoT Edge, and Azure Key Vault are services that integrate with Azure Stack Edge.

### Azure Arc-enabled Kubernetes 

Azure Arc-enabled Kubernetes is available as an add-on for Azure Stack Edge. For Singapore (Southeast Asia), Azure Arc data resides only within Singapore and is not replicated in Hong Kong SAR. <!--If there is a region-wide outage, the service is not resilient.-->

<!--For all other regions, Azure Arc supports Azure Regional Pair and is resilient to any region-wide outages.--> 
<!--For more information, see [Data residency and resiliency for Azure Arc-enabled Kubernetes clusters]().-->


### Azure IoT

Azure IoT is available as an add-on for Azure Stack Edge. For Singapore (Southeast Asia), Azure IoT uses paired region and replicates data to Hong Kong SAR. This means that Azure IoT is resilient to region-wide outages. 

<!--For more information, see [Data residency and resiliency for Azure IoT]().-->


<!--### Azure Key Vault

Azure Key Vault currently uses Azure Regional Pair for region outage resiliency. For new Azure Key Vault resources, an option is now available that can be enabled at the subscription level. When enabled, if your service is deployed in Singapore (Southeast Asia), you can control the data replication to Hong Kong SAR. 

If you choose to store and process the data only in Singapore region, then the service will not be resilient to region-wide outages. -->
<!--For more information, see [Data residency and resiliency for Azure Key Vault]().-->

## Next steps

- Learn more about [Azure data residency requirements](https://azure.microsoft.com/global-infrastructure/data-residency/).
