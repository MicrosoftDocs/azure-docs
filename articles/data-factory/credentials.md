---
title: Using credentials
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn about using Azure credentials for Azure Data Factory. 
author: nabhishek
ms.service: data-factory
ms.subservice: security
ms.topic: conceptual
ms.date: 10/25/2022
ms.author: abnarain 
ms.custom: synapse
---

# Credentials in Azure Data Factory and Azure Synapse

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

## Prerequisites

Users must have the Managed Identity Operator (Azure RBAC) role or a custom role with **Microsoft.ManagedIdentity/userAssignedIdentities/*/assign/action** RBAC action to configure a user assigned managed identity as a credential. Additional RBAC is required to create and use credentials in Synapse. [Learn more](../synapse-analytics/security/synapse-workspace-synapse-rbac-roles.md).

## Using credentials

We are introducing Credentials which can contain user-assigned managed identities, service principals, and also lists the system-assigned managed identity that you can use in the linked services that support Azure Active Directory (Azure AD) authentication. It helps you consolidate and manage all your Azure AD-based credentials.  

Below are the generic steps for using a **user-assigned managed identity** in the linked services for authentication. 

# [Azure Data Factory](#tab/data-factory)

1. If you do not have a user-assigned managed identity created in Azure, first create one in the Azure portal [Managed Identities](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.ManagedIdentity%2FuserAssignedIdentities) page.

1. Associate the user-assigned managed identity to the data factory instance using Azure portal, SDK, PowerShell, REST API. The screenshot below used Azure portal (data factory blade) to associate the user-assigned managed identity.

   :::image type="content" source="media/credentials/uami-azure-portal.png" alt-text="Screenshot showing how to use Azure portal to associate a user-assigned managed identity.":::

1. Create a **Credential** in data factory user interface interactively. You can select the user-assigned managed identity associated with the data factory in Step 1. 

   :::image type="content" source="media/credentials/create-new-credential.png" alt-text="Screenshot showing the creation of new credentials.":::

   :::image type="content" source="media/credentials/user-assigned-credential-configuration.png" alt-text="Screenshot showing the configuration of new credentials.":::

1. Create a new linked service and select **User-assigned managed identity** under authentication

   :::image type="content" source="media/credentials/create-new-linked-service.png" alt-text="Screenshot showing the new linked service with user-assigned managed identity authentication.":::

   :::image type="content" source="media/credentials/linked-service-credential-configuration.png" alt-text="Screenshot showing the new linked service configuration with User-Assigned Managed Identity and credentials selected.":::

# [Azure Synapse](#tab/synapse-analytics)

1. If you do not have a user-assigned managed identity created in Azure, first create one in the Azure portal [Managed Identities](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.ManagedIdentity%2FuserAssignedIdentities) page.

1. Associate the user-assigned managed identity to the workspace using Azure portal, SDK, PowerShell, REST API. The screenshot below used Azure portal (Identity blade) to associate the user-assigned managed identity.

   :::image type="content" source="media/credentials/synapse-uami-azure-portal.png" alt-text="Screenshot showing how to use Azure portal to associate a user-assigned managed identity.":::

1. Create a **Credential** in Synapse Studio interactively. You can select the user-assigned managed identity associated with the workspace in Step 1.

   :::image type="content" source="media/credentials/synapse-create-new-credential.png" alt-text="Screenshot showing the creation of new credentials.":::

   :::image type="content" source="media/credentials/user-assigned-credential-configuration.png" alt-text="Screenshot showing the configuration of new credentials.":::

1. Create a new linked service and select **User-assigned managed identity** under authentication

   :::image type="content" source="media/credentials/synapse-create-new-linked-service.png" alt-text="Screenshot showing the new linked service with user-assigned managed identity authentication.":::

   :::image type="content" source="media/credentials/linked-service-credential-configuration.png" alt-text="Screenshot showing the new linked service configuration with User-Assigned Managed Identity and credentials selected.":::

---

> [!NOTE] 
> You can use [SDK](/dotnet/api/microsoft.azure.management.synapse?preserve-view=true&view=azure-dotnet-preview)/ [PowerShell](/powershell/module/az.synapse/?context=%2Fazure%2Fsynapse-analytics%2Fcontext%2Fcontext&view=azps-9.1.0&preserve-view=true)/ [REST APIs](/rest/api/synapse/) for the above actions. An example of creating a user-assigned managed identity and assigning it permissions to a resource with Bicep/ARM is available in [this example](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.datafactory/data-factory-get-started).
> Linked services with user-assigned managed identity are currently not supported in Synapse Spark. 

## Next steps

- [Managed identity](data-factory-service-identity.md)

See the following topics that introduce when and how to use managed identity:

- [Store credential in Azure Key Vault](store-credentials-in-key-vault.md)
- [Copy data from/to Azure Data Lake Store using managed identities for Azure resources authentication](connector-azure-data-lake-store.md)

See [Managed Identities for Azure Resources Overview](../active-directory/managed-identities-azure-resources/overview.md) for more background on managed identities for Azure resources, which data factory managed identity is based upon.
