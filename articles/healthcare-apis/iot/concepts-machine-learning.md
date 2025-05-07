---
title: MedTech service and Azure Machine Learning Service - Azure Health Data Services
description: Learn how to use the MedTech service and the Azure Machine Learning Service
author: chachachachami
ms.service: azure-health-data-services
ms.subservice: medtech-service
ms.topic: conceptual
ms.date: 07/21/2023
ms.author: chrupa
---

# MedTech service and Azure Machine Learning Service

> [!IMPORTANT]
> As of 2/26/2025 the MedTech service will no longer be available in the following regions: UK West, UAE North, South Africa North, Qatar Central.

In this article, learn about using the MedTech service and the Azure Machine Learning Service.

## The MedTech service and Azure Machine Learning Service reference architecture

The MedTech service enables IoT devices to seamlessly integrate with FHIR&reg; services. This reference architecture is designed to accelerate adoption of Internet of Things (IoT) projects. This solution uses Azure Databricks for the Machine Learning (ML) compute. However, Azure Machine Learning Services with Kubernetes or a partner ML solution could fit into the Machine Learning Scoring Environment.

The four line colors show the different parts of the data journey.

- **Blue** = IoT data to FHIR service.
- **Green** = data path for scoring IoT data
- **Red** = Hot path for data to inform clinicians of patient risk. The goal of the hot path is to be as close to real-time as possible.
- **Orange** = Warm path for data. Still supporting clinicians in patient care. Data requests are typically triggered manually or on a refresh schedule.

:::image type="content" source="media/concepts-machine-learning/iot-connector-machine-learning.png" alt-text="Screenshot of the MedTech service and Machine Learning Service reference architecture." lightbox="media/concepts-machine-learning/iot-connector-machine-learning.png":::

## Data ingest: Steps 1 - 5

1. Data from IoT device or via device gateway sent to Azure IoT Hub/Azure IoT Edge.
2. Data from Azure IoT Edge sent to Azure IoT Hub.
3. Copy of raw IoT device data sent to a secure storage environment for device administration.
4. IoT payload moves from Azure IoT Hub to the MedTech service. The MedTech service icon represents multiple Azure services.
5. Three parts to number five: 
   1. The MedTech service requests Patient resource from the FHIR service. 
   2. The FHIR service sends Patient resource back to the MedTech service. 
   3. IoT Patient Observation is record in the FHIR service.

## Machine Learning and AI Data Route: Steps 6 - 11

6. Normalized ungrouped data stream sent to an Azure Function (ML Input).
7. Azure Function (ML Input) requests Patient resource to merge with IoT payload.
8. IoT payload is sent to an event hub for distribution to Machine Learning compute and storage.
9. IoT payload is sent to Azure Data Lake Storage Gen 2 for scoring observation over longer time windows.
10. IoT payload is sent to Azure Databricks for windowing, data fitting, and data scoring.
11. The Azure Databricks requests more patient data from data lake as needed.
    1. Azure Databricks also sends a copy of the scored data to the data lake.

## Notification and Care Coordination: Steps 12 - 18

**Hot path**

12. Azure Databricks sends a payload to an Azure Function (ML Output).
13. RiskAssessment and/or Flag resource submitted to FHIR service. 
    1. For each observation window, a RiskAssessment resource is submitted to the FHIR service. 
    2. For observation windows where the RiskAssessment is outside the acceptable range a Flag Resource should also be submitted to the FHIR service.
14. Scored data sent to data repository for routing to appropriate care team. Azure SQL Server is the data repository used in this design because of its native interaction with Power BI.
15. Power BI Dashboard is updated with RiskAssessment output in under 15 minutes.

**Warm path**

16. Power BI refreshes dashboard on data refresh schedule. Typically, longer than 15 minutes between refreshes.
17. Populate Care Team app with current data.
18. Care Coordination through Microsoft Teams for Healthcare Patient App.

## Next steps
 
[What is the MedTech service?](overview.md)
 
[Understand the MedTech service device data processing stages](overview-of-device-data-processing-stages.md)
 
[Choose a deployment method for the MedTech service](deploy-new-choose.md)
 
[!INCLUDE[FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
