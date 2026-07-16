---
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: include
ms.custom: include file
ms.date: 11/18/2025
---

The Azure portal deployment experience is a helper tool that generates a deployment command based on your resources and configuration. The final step is to run an Azure CLI command, so you still need the Azure CLI prerequisites described in the previous section.

1. Sign in to [Azure portal](https://portal.azure.com).

1. In the search box, search for and select **Azure IoT Operations**.

1. Select **Create**.

1. On the **Basics** tab, provide the following information:

   | Parameter | Value |
   | --------- | ----- |
   | **Subscription** | Select the subscription that contains your Arc-enabled cluster. |
   | **Resource group** | Select the resource group that contains your Arc-enabled cluster. |
   | **Cluster name** | Select the cluster that you want to deploy Azure IoT Operations to. |
   | **Custom location name** | *Optional*: Replace the default name for the custom location. |
   | **Deployment version**| Select **1.2 (latest)** version. For more information, see [IoT Operations versions](https://aka.ms/aio-versions).|
   | **Deployment optional components > OPC UA connector** | Choose to deploy the optional connector for OPC UA component. |

1. Select **Next: Configuration**.
