---
title: Include file
description: Include file
author: dominicbetts
ms.topic: include
ms.date: 11/21/2025
ms.author: dobett
ms.custom:
  - include file
---

To use the operations experience to create secrets in the key vault, the user requires **Key Vault Secrets Officer** permissions at the resource level in Azure.

In a test or development environment, use the following steps to assign the **Key Vault Secrets Officer** role to your user at the resource group level where the Azure IoT Operations instance and Azure Key Vault instance are deployed:

1. To find the name of the resource group, go to the [operations experience](https://iotoperations.azure.com) web UI, go to the **Instances** page and find your Azure IoT Operations instance. The resource group name is shown in the **Resource group** field.

1. Go to the [Azure portal](https://portal.azure.com) and then go to the resource group where your Azure IoT Operations instance and Azure Key Vault instance are deployed.

    > [!TIP]
    > Use the search box at the top of the Azure portal to quickly find the resource group by typing in the name.

1. Select **Access control (IAM)** from the left-hand menu. Then select **+ Add > Add role assignment**.

1. On the **Role** tab, select **Key Vault Secrets Officer** from the list of roles, and then select **Next**.

1. On the **Members** tab, select **User, group, or service principal**, select **Select members**, select the user you want to assign the **Key Vault Secrets Officer** role to, and then select **Next**.

1. Select **Review + assign** to complete the role assignment.

In a production environment, follow best practices to secure the Azure Key Vault you use with Azure IoT Operations. For more information, see [Best practices for using Azure Key Vault](/azure/key-vault/general/best-practices).
