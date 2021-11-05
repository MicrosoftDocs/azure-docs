---
title: IoT connector and Azure Machine Learning Service - Azure Healthcare APIs
description: In this article, you'll learn how to use IoT connector and the Azure Machine Learning Service
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.date: 11/05/2021
ms.author: jasteppe
---

# IoT connector and Azure Machine Learning Service

In this article, we'll explore using IoT connector and Azure Machine Learning Service.

## IoT connector and Azure Machine Learning Service reference architecture

IoT connector enables IoT devices seamless integration with Fast Healthcare Interoperability Resources (FHIR&#174;) services. This reference architecture is designed to accelerate adoption of Internet of Medical Things (IoMT) projects. This solution uses Azure Databricks for the Machine Learning (ML) compute. However, Azure ML Services with Kubernetes or a partner ML solution could fit into the Machine Learning Scoring Environment.

The four line colors show the different parts of the data journey.

- **Blue** = IoT data to FHIR service.
- **Green** = data path for scoring IoT data
- **Red** = Hot path for data to inform clinicians of patient risk. The goal of the hot path is to be as close to real-time as possible.
- **Orange** = Warm path for data. Still supporting clinicians in patient care. Data requests are typically triggered manually or on a refresh schedule.

:::image type="content" source="media/iot-concepts/iot-connector-machine-learning.png" alt-text="Screenshot of IoT connector and Machine Learning Service reference architecture." lightbox="media/iot-concepts/iot-connector-machine-learning.png":::

**Data ingest – Steps 1 through 5**

1. Data from IoT device or via device gateway sent to Azure IoT Hub/Azure IoT Edge.
2. Data from Azure IoT Edge sent to Azure IoT Hub.
3. Copy of raw IoT device data sent to a secure storage environment for device administration.
4. PHI IoMT payload moves from Azure IoT Hub to the IoT connector. Multiple Azure services are represented by 1 IoT connector icon.
5. Three parts to number 5: a. IoT connector request Patient resource from FHIR service. b. FHIR service sends Patient resource back to IoT connector. c. IoT Patient Observation is record in FHIR service.

**Machine Learning and AI Data Route – Steps 6 through 11**

6. Normalized ungrouped data stream sent to Azure Function (ML Input).
7. Azure Function (ML Input) requests Patient resource to merge with IoMT payload.
8. IoMT payload with PHI is sent to Event Hub for distribution to Machine Learning compute and storage.
9. PHI IoMT payload is sent to Azure Data Lake Storage Gen 2 for scoring observation over longer time windows.
10. PHI IoMT payload is sent to Azure Databricks for windowing, data fitting, and data scoring.
11. The Azure Databricks requests more patient data from data lake as needed. a. Azure Databricks also sends a copy of the scored data to the data lake.

**Notification and Care Coordination – Steps 12 - 18**

**Hot path**

12. Azure Databricks sends a payload to an Azure Function (ML Output).
13. RiskAssessment and/or Flag resource submitted to FHIR service. a. For each observation window, a RiskAssessment resource will be submitted to the FHIR service. b. For observation windows where the risk assessment is outside the acceptable range a Flag resource should also be submitted to the FHIR service.
14. Scored data sent to data repository for routing to appropriate care team. Azure SQL Server is the data repository used in this design because of its native interaction with Power BI.
15. Power BI Dashboard is updated with Risk Assessment output in under 15 minutes.

**Warm path**

16. Power BI refreshes dashboard on data refresh schedule. Typically, longer than 15 minutes between refreshes.
17. Populate Care Team app with current data.
18. Care Coordination through Microsoft Teams for Healthcare Patient App.

## Next steps

In this article, you've learned about IoT connector and Machine Learning service integration. For an overview of IoT connector, see

>[!div class="nextstepaction"]
>[IoT connector overview](iot-connector-overview.md)

(FHIR&#174;) is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
