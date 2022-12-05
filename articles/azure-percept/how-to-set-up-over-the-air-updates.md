---
title: Set up Azure IoT Hub to deploy over-the-air updates
description: Learn how to configure Azure IoT Hub to deploy updates over-the-air to Azure Percept DK
author: yvonne-dq
ms.author: hschang
ms.service: azure-percept
ms.topic: how-to
ms.date: 10/04/2022
ms.custom: template-how-to, ignite-fall-2021, subject-rbac-steps
---

# Set up Azure IoT Hub to deploy over-the-air updates

[!INCLUDE [Retirement note](./includes/retire.md)]

>[!CAUTION]
>**The OTA update on Azure Percept DK is no longer supported. For information on how to proceed, please visit [Update the Azure Percept DK over a USB-C cable connection](./how-to-update-via-usb.md).**

Keep your Azure Percept DK secure and up to date using over-the-air updates. In a few simple steps, you will be able to set up your Azure environment with Device Update for IoT Hub and deploy the latest updates to your Azure Percept DK.

## Prerequisites

- Azure Percept DK (devkit)
- [Azure subscription](https://azure.microsoft.com/free/)
- [Azure Percept DK setup experience](./quickstart-percept-dk-set-up.md): you connected your dev kit to a Wi-Fi network, created an IoT Hub, and connected your dev kit to the IoT Hub

## Create a Device Update Account

1. Go to the [Azure portal](https://portal.azure.com) and sign in with the Azure account you are using with Azure Percept.

1. In the search bar at the top of the page, enter **Device Update for IoT Hubs**.

1. Select **Device Update for IoT Hubs** when it appears in the search bar.

1. Select the **+Add** button in the upper-left portion of the page.

1. Select the **Azure Subscription** and **Resource Group** associated with your Azure Percept device and its IoT Hub.

1. Specify a **Name** and **Location** for your Device Update Account.

1. Check the box that says **Assign Device Update Administrator role.** 

1. Review the details and select **Review + Create**.

1. Select the **Create** button.

1. Once deployment is complete, click **Go to resource**.

## Create a Device Update Instance

1. In your Device Update for IoT Hub resource, click **Instances** under **Instance Management**.

1. Click **+ Create**, specify an instance name, and select the IoT Hub associated with your Azure Percept device. This may take a few minutes to complete.

1. Click **Create**.

## Configure IoT Hub

1. In the Instance Management **Instances** page, wait for your Device Update Instance to move to a **Succeeded** state. Click the **Refresh** icon to update the state.

1. Select the Instance that has been created for you and click **Configure IoT Hub**. In the left pane, select **I agree to make these changes** and click **Update**.

1. Wait for the process to complete successfully.

## Configure access control roles

The final step will enable you to grant permissions to users to publish and deploy updates.

1. In your Device Update for IoT Hub resource, select **Access control (IAM)**.

1. Select **Add** > **Add role assignment** to open the **Add role assignment** page.

1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

    | Setting | Value |
    | --- | --- |
    | Role | Device Update Administrator |
    | Assign access to | User, group, or service principal |
    | Members | &lt;Your account or the account deploying updates&gt; |

    ![Screenshot that shows Add role assignment page in Azure portal.](../../includes/role-based-access-control/media/add-role-assignment-page.png)

> [!TIP]
> If you would like to give more people in your organization access, you can repeat this step and make each of these users a **Device Update Administrator**.

## Next steps

You are now ready to [update your Azure Percept dev kit over-the-air](./how-to-update-over-the-air.md) using Device Update for IoT Hub.
