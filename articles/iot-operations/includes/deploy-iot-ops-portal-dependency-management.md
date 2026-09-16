---
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: include
ms.custom: include file
ms.date: 11/18/2025
---

1. On the **Dependency management** tab, select an existing schema registry or use these steps to create one:

   1. Select **Create new**.

   1. Enter a **Schema registry name** and **Schema registry namespace**.

   1. Select **Select Azure Storage container**.

   1. Choose a storage account from the list of hierarchical namespace-enabled accounts, or select **Create** to create one.

      Schema registry requires an Azure Storage account with hierarchical namespace and public network access enabled. When creating a new storage account, choose a **General purpose v2** storage account type and set **Hierarchical namespace** to **Enabled**.

      For more information on configuring your storage account, see [Production deployment guidelines](../deploy-iot-ops/concept-production-guidelines.md#schema-registry-and-storage).

   1. Select a container in your storage account or select **Container** to create one.

   1. Select **Apply** to confirm the schema registry configurations.

1. Azure IoT Operations uses *namespaces* to organize assets and devices. Each Azure IoT Operations instance uses a single namespace for its assets and devices. On the **Dependency management** tab, select an existing Azure Device Registry namespace or use these steps to create one:

   1. Select **Create new**.

   1. On the **Basics** tab, provide the following information:

      | Parameter | Value |
      | --------- | ----- |
      | **Subscription** | Select your subscription. |
      | **Resource group** | Select the resource group that contains your Azure IoT Operations instance. |
      | **Name** | Enter a unique name for your namespace. |
      | **Region** | Select the Azure region to store your namespace. |

      Select **Next** to continue.

   1. On the **Tags** tab, you can optionally add tags to your namespace. Select **Next** to continue.

   1. On the **Review + create** tab, review your configurations and select **Create** to create the namespace.

   1. Back on the **Dependency management** tab, select the newly created namespace from the list.
