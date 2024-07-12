---
title: Use managed identities in the Azure Health Data Services de-identification service
description: Learn how to use managed identities with the Azure Health Data Services de-identification service using the Azure portal and ARM template.
author: jovinson-ms
ms.author: jovinson
ms.service: azure-health-data-services
ms.subservice: deidentification-service
ms.topic: how-to
ms.date: 07/10/2024
#customer intent: As a cloud administrator, I want to be able to learn how to manage use the de-identification service without managing credentials.
---

# How to use managed identities with the Azure Health Data Services de-identification service

Managed identities provide Azure services with an automatically managed identity in Microsoft Entra ID in a secure manner. This eliminates the need for developers having to manage credentials by providing an identity. There are two types of managed identities: system-assigned and user-assigned. The de-identification service supports both.

Managed identities can be used to grant the de-identification service access to your storage account for batch processing. In this article, you will learn how to assign a managed identitiy to your de-identification service.

## Prerequisites
- Understand the differences between _system-assigned_ and _user-assigned_ in [What are managed identities for Azure resources?](entra/identity/managed-identities-azure-resources/overview)
- A de-identification service in your Azure subscription. If you don't have a de-identification service yet, you can follow the steps in [Quickstart: Deploy your first de-identification service](quickstart.md).

## Create an instance of the de-identification service in Azure Health Data Services with a system assigned managed identity

# [Portal](#tab/azure-portal)
1. Access your de-identification service's settings in the Azure portal under the **Security** group in the left navigation pane.
1. Select **Identity**.
1. Within the **System assigned** tab, switch _Status_ to _On_ and click **Save**.

# [Resource Manager Template](#tab/azure-resource-manager)
Any resource of type ``Microsoft.HealthDataAIServices/deidServices`` can be created with a system-assigned identity by including the following block in 
the resource definition:

```json
"identity": {
    "type": "SystemAssigned"
}
```
---

## Assign a user-assigned managed identity to a service instance

# [Portal](#tab/azure-portal)
1. Create a user-assigned managed identity resource according to [these instructions](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities).
1. In the left navigation for your de-identification service, scroll down to the **Security** group.
1. Select **Identity**.
1. Select the **User assigned** tab and select **Add**.
1. Search for the identity you created earlier, select it, and select **Add**.

# [ARM template](#tab/azure-resource-manager)

Any resource of type ``Microsoft.HealthDataAIServices/deidServices`` can be created with a user-assigned identity by including the following block in 
the resource definition, replacing <resource-id> with the ARM resource id of the desired identity:

```json
"identity": {
    "type": "UserAssigned",
    "userAssignedIdentities": {
        "<resource-id>": {}
    }
}
```
---

## Supported scenarios using managed identities

Managed identities assigned to the de-identification service can be used to allow access to Azure Blob Storage for batch de-identification jobs. The service will acquire a token as
the managed identity to access Blob Storage and de-identify blobs that match a specified pattern. For more details, including how to grant access to your managed identity,
see [Batch de-identify files in Azure Blob Storage](how-to-batch-job.md).

## Clean up steps
When you remove a system-assigned identity, it's deleted from Microsoft Entra ID. System-assigned identities are also automatically removed from Microsoft Entra ID
when you delete the de-identification service.

# [Portal](#tab/azure-portal)
1. In the left navigation of your de-identification service, scroll down to the **Security** group.
1. Select **Identity**, then follow the steps based on the identity type:
   - **System-assigned identity**: Within the **System assigned** tab, switch _Status_ to _Off_ and click **Save**.
   - **User-assigned identity**: Select the **User assigned** tab, select the checkbox for the identity, and select **Remove**. Select **Yes** to confirm.

# [ARM template](#tab/azure-resource-manager)
Any resource of type ``Microsoft.HealthDataAIServices/deidServices`` can have system-assigned identities deleted and user-assigned identities unassigned by 
including the following block in the resource defintion:

```json
"identity": {
    "type": "None"
}
```
---

## Next steps

Learn more about managed identities for Azure resources:

- [What are managed identities for Azure resources?](/azure/active-directory/managed-identities-azure-resources/overview)