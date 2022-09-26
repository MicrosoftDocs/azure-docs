---
title: Managed identities
description: This topic explains how to use managed identities with Azure Video Analyzer.
ms.service: azure-video-analyzer
ms.topic: how-to
ms.date: 11/04/2021
ms.custom: ignite-fall-2021
---

# Managed identity

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]

A common challenge for developers is the management of secrets and credentials to secure communication between different services. On Azure, managed identities eliminate the need for developers having to manage credentials by providing an identity for the Azure resource in Azure Active Directory (Azure AD) and using it to obtain Azure AD tokens.

When you create an Azure Video Analyzer account, you must associate an Azure storage account with it. If you use Video Analyzer to record the live video from a camera, that data is stored as blobs in a container in the storage account. You can optionally associate an IoT Hub with your Video Analyzer account – this is needed if you use Video Analyzer edge module as a [transparent gateway](./cloud/use-remote-device-adapter.md). You must use a managed identity to grant the Video Analyzer account the appropriate access to the storage account and  IoT Hub (if needed for your solution) as follows.

## User assigned managed identity for Video Analyzer

* Create a [User-Assigned Managed Identity (UAMI)](../../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md#create-a-user-assigned-managed-identity)

> [!NOTE]
> You'll need an Azure subscription where you have access to both the [Contributor](../../role-based-access-control/built-in-roles.md#contributor) role and the [User Access Administrator](../../role-based-access-control/built-in-roles.md#user-access-administrator) role to the resource group under which you'll create new resources (user-assigned managed identity, storage account, Video Analyzer account). If you don't have the right permissions, ask your account administrator to grant you those permissions. The associated storage account must be in the same region as the Video Analyzer account. We recommend that you use a [standard general-purpose v2](../../storage/common/storage-account-overview.md#types-of-storage-accounts) storage account.
You would also need to have access to the contributor role for the IoT hub if you choose to attach one to your Video Analyzer account.

### Enable Video Analyzer account to access Storage account

* Create an Azure storage account.

* Add the [Storage Blob Data Contributor](../../role-based-access-control/built-in-roles.md#storage-blob-data-contributor) and [Reader](../../role-based-access-control/built-in-roles.md#reader) roles for the above storage account to the managed identity.

* Create the Video Analyzer account, providing the user-assigned managed identity and the storage account as values to the relevant properties.

Video Analyzer can then access storage account on your behalf using the managed identity.

### Enable Video Analyzer account to access IoT Hub

In previous section, you created a UAMI that allowed Video Analyzer to access the storage account. In this step, the Video Analyzer account will be granted access to the IoT Hub through the UAMI and then IoT Hub will be linked to your Video Analyzer account. For more details on how managed identity works with IoT Hub, please refer [IoT Hub managed identity](../../iot-hub/iot-hub-managed-identity.md)

* Go to Azure portal then Video Analyzer management blade, select **IoT Hub** under **Settings** on the left pane
* Then select **Attach** on the ‘Attach IoT Hub’ pane. In the **Attach IoT Hub** configuration pane enter the required field values:
    * Subscription - Select the Azure subscription name where IoT Hub is created
    * IoT Hub - Select existing IoT hub which need to be attached to Video Analyzer account
    * Managed Identity - Select user-assigned managed identity (created earlier in previous section) to be used to access the IoT Hub
* Click on **Save** to link IoT Hub to your Video Analyzer account

See [this](create-video-analyzer-account.md) article for an example of using the Azure portal to accomplish the above.

## Next steps

To learn more about what managed identities can do for you and your Azure applications, see [Azure AD Managed Identities](../../active-directory/managed-identities-azure-resources/overview.md).
