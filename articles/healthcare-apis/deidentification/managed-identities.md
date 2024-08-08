---
title: Use managed identities with the de-identification service (preview) in Azure Health Data Services
description: Learn how to use managed identities with the Azure Health Data Services de-identification service (preview) using the Azure portal and ARM template.
author: jovinson-ms
ms.author: jovinson
ms.service: azure-health-data-services
ms.subservice: deidentification-service
ms.topic: how-to
ms.date: 07/17/2024
---

# Use managed identities with the de-identification service (preview)

Managed identities provide Azure services with a secure, automatically managed identity in Microsoft Entra ID. Using managed identities eliminates the need for developers having to manage credentials by providing an identity. There are two types of managed identities: system-assigned and user-assigned. The de-identification service supports both.

Managed identities can be used to grant the de-identification service (preview) access to your storage account for batch processing. In this article, you learn how to assign a managed identity to your de-identification service.

## Prerequisites

- Understand the differences between **system-assigned** and **user-assigned** described in [What are managed identities for Azure resources?](/entra/identity/managed-identities-azure-resources/overview)
- A de-identification service (preview) in your Azure subscription. If you don't have a de-identification service, follow the steps in [Quickstart: Deploy the de-identification service](quickstart.md).

## Create an instance of the de-identification service (preview) in Azure Health Data Services with a system-assigned managed identity

# [Azure portal](#tab/portal)

1. Access the de-identification service (preview) settings in the Azure portal under the **Security** group in the left navigation pane.
1. Select **Identity**.
1. Within the **System assigned** tab, switch **Status** to **On** and choose **Save**.

# [ARM template](#tab/azure-resource-manager)

Any resource of type ``Microsoft.HealthDataAIServices/deidServices`` can be created with a system-assigned identity by including the following block in 
the resource definition:

```json
"identity": {
    "type": "SystemAssigned"
}
```

---

## Assign a user-assigned managed identity to a service instance

# [Azure portal](#tab/portal)

1. Create a user-assigned managed identity resource according to [these instructions](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities).
1. In the navigation pane of your de-identification service (preview), scroll to the **Security** group.
1. Select **Identity**.
1. Select the **User assigned** tab, and then choose **Add**.
1. Search for the identity you created, select it, and then choose **Add**.

# [ARM template](#tab/azure-resource-manager)

Any resource of type ``Microsoft.HealthDataAIServices/deidServices`` can be created with a user-assigned identity by including the following block in
the resource definition, replacing **resource-id** with the Azure Resource Manager (ARM) resource ID of the desired identity:

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

Managed identities assigned to the de-identification service (preview) can be used to allow access to Azure Blob Storage for batch de-identification jobs. The service acquires a token as
the managed identity to access Blob Storage and de-identify blobs that match a specified pattern. For more information, including how to grant access to your managed identity,
see [Quickstart: Azure Health De-identification client library for .NET](quickstart-sdk-net.md).

## Clean-up steps

When you remove a system-assigned identity, you delete it from Microsoft Entra ID. System-assigned identities are also automatically removed from Microsoft Entra ID
when you delete the de-identification service (preview).

# [Azure portal](#tab/portal)

1. In the navigation pane of your de-identification service (preview), scroll down to the **Security** group.
1. Select **Identity**, then follow the steps based on the identity type:
   - **System-assigned identity**: Within the **System assigned** tab, switch **Status** to **Off**, and then choose **Save**.
   - **User-assigned identity**: Select the **User assigned** tab, select the checkbox for the identity, and select **Remove**. Select **Yes** to confirm.

# [ARM template](#tab/azure-resource-manager)

Any resource of type ``Microsoft.HealthDataAIServices/deidServices`` can have system-assigned identities deleted and user-assigned identities unassigned by 
including this block in the resource definition:

```json
"identity": {
    "type": "None"
}
```

---

## Related content

- [What are managed identities for Azure resources?](/azure/active-directory/managed-identities-azure-resources/overview)
