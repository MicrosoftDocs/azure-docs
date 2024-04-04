---
title: Process real-time IoT data on Apache Flink® with Azure HDInsight on AKS
description: How to integrate Azure IoT Hub and Apache Flink®.
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 04/04/2024
---

# Process real-time IoT data on Apache Flink® with Azure HDInsight on AKS

Azure IoT Hub is a managed service hosted in the cloud that acts as a central message hub for communication between an IoT application and its attached devices. You can connect millions of devices and their backend solutions reliably and securely. Almost any device can be connected to an IoT hub.

## Prerequisites

* [Create an Azure IoTHub](/azure/iot-hub/iot-hub-create-through-portal/)
* [Create Flink cluster 1.17.0 on HDInsight on AKS](./flink-create-cluster-portal.md)
* Use MSI to access ADLS Gen2
* IntelliJ for development

> [!NOTE]
> For this demonstration, we are using a Window VM as maven project develop env in the same VNET as HDInsight on AKS.


:::image type="content" source="./media/azure-iot-hub/configuration-management.png" alt-text="Diagram showing search bar in Azure portal." lightbox="./media/azure-iot-hub/configuration-management.png":::


:::image type="content" source="./media/azure-iot-hub/built-in-endpoint.png" alt-text="Screenshot shows built-in endpoints." lightbox="./media/azure-iot-hub/built-in-endpoint.png":::


:::image type="content" source="./media/azure-iot-hub/create-new-job.png" alt-text="Screenshot shows create a new job." lightbox="./media/azure-iot-hub/create-new-job.png":::

### Reference

- [Apache Flink Website](https://flink.apache.org/)
- Apache, Apache Kafka, Kafka, Apache Flink, Flink, and associated open source project names are [trademarks](../trademarks.md) of the [Apache Software Foundation](https://www.apache.org/) (ASF).