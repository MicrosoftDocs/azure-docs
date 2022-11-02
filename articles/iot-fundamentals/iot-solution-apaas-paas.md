---
title: Azure IoT aPaaS and PaaS solution options
description: Explains why it's a good idea to start your IoT journey with IoT Central
author: dominicbetts
ms.service: iot-fundamentals
services: iot-fundamentals
ms.topic: overview
ms.date: 08/24/2022
ms.author: dobett
---

# What's the difference between aPaaS and PaaS solution offerings?

IoT solutions require a combination of technologies to effectively connect devices, events, and actions to cloud applications. Microsoft provides open-source [Device SDKs](../iot-develop/about-iot-sdks.md) that you can use to build the apps that run on your devices. However, there are many options for building and deploying your IoT cloud solutions. The technologies and services you use depend on your scenario's development, deployment, and management needs.

## Understand the difference between PaaS and aPaaS solutions

Microsoft enables you to create an IoT solution, by using individual PaaS services or in an aPaaS IoT solution platform.

- Platform as a service (PaaS) is a cloud computing model in which you tailor Azure hardware and software tools to a specific task or job function. With PaaS services, you're responsible for scaling and configuration, but the underlying infrastructure as a service (IaaS) is taken care of for you.
- Application platform as a service (aPaaS) provides a cloud environment to build, manage, and deliver applications to customers. aPaaS offerings take care of scaling and most of the configuration, but they still require developer input to build out a finished solution.

## Start with Azure IoT Central (aPaaS)

Using an aPaaS environment streamlines many of the complex decisions you face when building an IoT solution. Azure IoT Central is designed to simplify and accelerate IoT solution assembly and operation. It pre-assembles PaaS components into an extensible and fully managed app development platform hosted in Azure. aPaaS takes much of the guesswork and complexity out of building reliable, scalable, and secure IoT applications.

An out-of-the box web UX and API surface area make it simple to monitor device conditions, create rules, and manage millions of devices and their data remotely throughout their life cycles. Furthermore, it enables you to act on device insights by extending IoT intelligence into line-of-business applications. Azure IoT Central also offers built-in disaster recovery, multitenancy, global availability, and a predictable cost structure.

:::image type="content" source="media/iot-solution-apaas-paas/architecture-apaas.svg" alt-text="Diagram that shows the Azure IoT Central aPaaS architecture." border="false" lightbox="media/iot-solution-apaas-paas/architecture-apaas.svg":::

## Building with Azure PaaS Services

In some scenarios, you may need a higher degree of control and customization than Azure IoT Central provides. In these cases, Azure also offers individual platform as a service (PaaS) cloud services that you can use to build a custom IoT solution. For example, you might build a solution using a combination of these PaaS services:

- Azure IoT Device Provisioning Service and Azure IoT Hub for automated device provisioning, device connectivity, and management
- Azure Time Series Insights for storing and analyzing warm and cold path time series data from IoT devices
- Azure Stream Analytics for analyzing hot path data from IoT devices
- Azure IoT Edge for running AI, third-party services, or your own business logic on IoT Edge devices

:::image type="content" source="media/iot-solution-apaas-paas/architecture-paas.svg" alt-text="Diagram that shows the Azure IoT PaaS reference architecture." border="false" lightbox="media/iot-solution-apaas-paas/architecture-paas.svg":::

## Comparing approaches

Use the following table to help decide if you can use an aPaaS solution based on Azure IoT Central, or if you should consider building a PaaS solution that uses Azure IoT Hub and other Azure PaaS components.

| &nbsp; | Azure IoT Central (aPaaS) | Azure IoT Hub (PaaS) plus stream processing, data storage, and access control services |
|--------|---------------------------|----------------------------------------------------------------------------------------|
| Type of service | Fully managed aPaaS solution. It simplifies device connectivity and management at scale so that you can focus time and resources on using IoT for business transformation. This simplicity comes with a tradeoff: an aPaaS-based solution is less customizable than a PaaS-based solution. | Managed PaaS back-end solution that acts as a central message hub between your IoT application and the devices it manages. You can add functionality by using other Azure PaaS services. This approach provides great flexibility but requires more development and management effort to build and operate your solution. |
| Application templates | [Application templates](../iot-central/core/overview-iot-central-admin.md#create-applications) in Azure IoT Central help solution builders kick-start IoT solution development. You can get started with a generic application template, or use a prebuilt industry-focused application template for [retail](../iot-central/retail/tutorial-in-store-analytics-create-app.md), [energy](../iot-central/energy/tutorial-smart-meter-app.md), [government](../iot-central/government/tutorial-connected-waste-management.md), or [healthcare](../iot-central/healthcare/tutorial-continuous-patient-monitoring.md). | Not supported. You design and build your own solution using Azure IoT Hub and other PaaS services. |
| Device management | Provides seamless [device provisioning and lifecycle management experiences](../iot-central/core/overview-iot-central.md#manage-your-devices). Includes built-in device management capabilities such as *jobs*, *connectivity status*, *raw data view*, and the Device Provisioning Service (DPS). | No built-in experience. You design and build your own solutions using Azure IoT Hub primitives, such as *device twins* and *direct methods*. DPS must be enabled separately. |
| Scalability| Supports autoscaling. | There's no built-in mechanism for automatically scaling an IoT Hub. You need to deploy other solutions to enable autoscaling. See [Autoscale your Azure IoT Hub](/samples/azure-samples/iot-hub-dotnet-autoscale/iot-hub-dotnet-autoscale/). |
| Message retention | Retains data on a rolling, 30-day basis. You can continuously export data using the [export feature](../iot-central/core/howto-export-data.md). | Enables data retention in the built-in Event Hubs service for a maximum of seven days. |
| Visualizations | IoT Central has a UX that makes it simple to visualize device data, perform analytics queries, and create custom dashboards. See: [What is Azure IoT Central?](../iot-central/core/overview-iot-central.md#dashboards) | You design and build your own visualizations with your choice of technologies. |
| OPC UA protocol  | Not currently supported. | OPC Publisher is a Microsoft-supported open-source product that bridges the gap between industrial assets and Azure hosted resources. It connects to OPC UA–enabled assets or industrial connectivity software and publishes telemetry data to [Azure IoT Hub](../iot-hub/iot-concepts-and-iot-hub.md) in various formats, including IEC62541 OPC UA PubSub standard format. See: [Microsoft OPC Publisher](https://github.com/Azure/iot-edge-opc-publisher). |
| Pricing | The first two active devices within an IoT Central application are free, if their message volume doesn't exceed the threshold: 800 messages with the *Standard Tier 0 plan*, 10,000 messages with the *Standard Tier 1 plan*, or 60,000 messages with the *Standard Tier 2 plan* per month. Volumes that exceed those thresholds incur overage charges. With more than two active devices, device pricing is prorated monthly. For each hour during the billing period, the highest number of active devices is counted and billed. See: [Azure IoT Central pricing](https://azure.microsoft.com/pricing/details/iot-central/). | See: [Azure IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub/). |
| Analytics, insights, and actions | Integrated analytics experience targeted at exploration of device data in the context of device management.  | To incorporate analytics, insights, and actions, use separate Azure PaaS services such as Azure Stream Analytics, Time Series Insights, Azure Data Explorer, and Azure Synapse. |
| Big data management | Data management can be managed from Azure IoT Central itself. | You need to add and manage big data Azure PaaS services as part of your solution. |
| High availability and disaster recovery | High availability and disaster recovery capabilities are built in to Azure IoT Central and managed for you automatically. See: [Best practices for device development in Azure IoT Central](../iot-central/core/concepts-best-practices.md). | Can be configured to support multiple high availability and disaster recovery scenarios. See: [Azure IoT Hub high availability and disaster recovery](../iot-hub/iot-hub-ha-dr.md). |
| SLA | See: [SLA for Azure IoT Central](https://azure.microsoft.com/support/legal/sla/iot-central/).| See: [SLA for Azure IoT Hub](https://azure.microsoft.com/support/legal/sla/iot-hub/v1_2/). |
| Device templates | Lets you centrally define and manage device templates that help structure the characteristics and behaviors of different device types. Device templates support device management tasks and visualizations. | Requires users to create their own repository to define and manage device templates. |
| Data export | Provides data export to Azure blob storage, Azure Event Hubs, Azure Service Bus, webhooks, and Azure Data Explorer. Capabilities include filtering, enriching, and transforming messages on egress. | Provides a built-in Event Hubs compatible endpoint and can also use message routing to export data to other locations. |
| Multi-tenancy | IoT Central [organizations](../iot-central/core/howto-create-organizations.md) enable in-app multi-tenancy. You to define a hierarchy to manage which users can see which devices in your IoT Central application. | Not supported. Tenancy can be achieved by using separate   hubs per customer and/or access control can be built into the data layer of solutions.|
| Rules and actions | Provides built-in rules and actions processing. Actions include email notifications, Azure Monitor group, Power Automate, and webhook actions. See: [IoT Central rules and actions](../iot-central/core/overview-iot-central.md#rules-and-actions). | Data coming from IoT Hub can be sent to Azure Stream Analytics, Azure Time Series Insights, or Azure Event Grid. From those services, you can connect to Azure Logic apps or other custom applications to handle rules and actions processing. See: [IoT remote monitoring and notifications with Azure Logic Apps](../iot-hub/iot-hub-monitoring-notifications-with-azure-logic-apps.md). |
| SigFox/LoRaWAN protocols | Uses IoT Central Device Bridge. See: [Azure IoT Central Device Bridge](https://github.com/Azure/iotc-device-bridge#azure-iot-central-device-bridge). | Requires you to write a custom module for Azure IoT Edge and integrate it with Azure IoT Hub. |

## Next steps

Now that you've learned about the difference between aPaaS and PaaS offerings in Azure IoT a suggested next step is to read our FAQ on why start with IoT Central.
