--- 
title: Configure Managed Identity for Sources in Microsoft Planetary Computer Pro
description: Learn how to add credentials and ingest data into Microsoft Planetary Computer Pro using managed identities.
author: prasadko
ms.author: prasadkomma
ms.service: azure
ms.topic: how-to
ms.date: 04/09/2025

#customer intent: Help customers understand how ingestion sources work and how to add them ahead of an ingestion. 
---

# Configure an Ingestion Source for Microsoft Planetary Computer Pro using managed identity

Loading new data into the Microsoft Planetary Computer Pro GeoCatalog resource is called [**ingestion**](./ingestion-overview.md). A GeoCatalog needs credentials, or [ingestion sources](./ingestion-source.md), to securely access data that is stored externally to the GeoCatalog resource. 

:::image type="content" source="media/managed-identity-diagram.png" alt-text="Diagram showing the managed identity workflow for ingestion source configuration.":::
  
In this guide, you learn how to:

> [!div class="checklist"]
> - [Create a user assigned managed identity](#create-a-user-assigned-managed-identity)
> - [Give a user assigned managed identity Storage Blob Data Reader to Azure Blob Storage](#give-a-user-assigned-managed-identity-storage-blob-data-reader-to-azure-blob-storage)
> - [Associate a user assigned managed identity to a GeoCatalog](#associate-the-user-assigned-managed-identity-to-your-geocatalog-resource)
> - [Configure an ingestion source](#configure-an-ingestion-source)

All four steps are required to configure your GeoCatalog resource to read data from an external ingestion source. 

## Prerequisites

- A Microsoft Planetary Computer Pro GeoCatalog deployed to your Azure Subscription. See [Deploy a GeoCatalog resource](./deploy-geocatalog-resource.md).

- An Azure Blob container setup with the correct permissions to assign managed identities. See [Create an Azure storage account](/azure/storage/common/storage-account-create?tabs=azure-portal).

## Managed identity vs. SAS tokens

[Managed identities](/entra/identity/managed-identities-azure-resources/overview) provide an automatically managed identity in Microsoft Entra ID for applications to use when connecting to resources that support Microsoft Entra authentication.

[Shared Access Signatures (SAS)](/azure/storage/common/storage-sas-overview) create cryptographic credentials for access to a resource such as Azure Blob Storage. 

Managed identities are a more secure, automated mechanism for establishing persistent access to a storage account and are the recommended approach for providing secure access to Azure Blob Storage for data ingestion. 

Managed identities only work within a single Microsoft Entra tenant, therefore the SAS Token approach is useful when moving data from storage that is in a storage account outside of your tenant. Data ingestion is specific to a Blob Container, and SAS tokens from the root storage resource aren't permitted. 

This guide shows how to use the managed identity approach. If SAS tokens are more appropriate for your use case, see how to [setup ingestion credentials using SAS](./setup-ingestion-credentials-sas-tokens.md).

## Create a user assigned managed identity

Navigate to the [Azure portal](https://portal.azure.com/) to create a new managed identity resource. In the search bar, search for **managed identities**. 

:::image type="content" source="media/ingestion-source-MI-search.png" alt-text="Screenshot of the Azure portal showing the managed identities search results. The search bar at the top has 'managed identities' entered, and the results display the managed identities service.":::

Select the **Create** button to begin the process. In the dialogue, you have the opportunity to assign the managed identity to a Subscription, Resource Group, and Region. Once you enter the data, select the **Review + create** and then the **Create** button. 

:::image type="content" source="media/ingestion-source-MI-create.png" alt-text="Screenshot of the Azure portal showing the creation of a managed identity. The interface displays fields for selecting the subscription, resource group, and region. A 'Review + create' button is visible at the bottom of the form.":::

Next, we associate this managed identity to our Geocatalog. 

## Give a user assigned managed identity Storage Blob Data Reader to Azure Blob Storage

Navigate back to the Azure portal and go to the storage resource you wish to use to ingest data into Microsoft Planetary Computer Pro. Once at that resource, select the **Access Control (IAM)** button in the sidebar and then select **"Add the assignment"** button.   

:::image type="content" source="media/ingestion-source-MI-give-permissions.png" alt-text="Screenshot of the Azure portal showing the 'Add role assignment' pane. The interface displays fields to select a role, assign access to a user, group, or managed identity, and choose specific members.":::

Next, search for the **Storage Blob Data Reader** role inside the search reader. Select the **Storage Blob Data Reader** and press the **Next** button. 

:::image type="content" source="media/ingestion-source-MI-role.png" alt-text="Screenshot of the Azure portal showing the 'Role assignment' pane. The interface displays fields to select a role, assign access to a user, group, or managed identity, and choose specific members. The 'Storage Blob Data Reader' role is highlighted in the list of available roles.":::

In the Members pane, select **managed identity**, which pops up a new side bar. Select the **Subscription** where you created the user assigned managed identity in the previous steps, and then select **User assigned managed identity**. Select the user assigned managed identity and select the **Select** button to continue. 

:::image type="content" source="media/ingestion-source-MI-assign.png" alt-text="Screenshot of the Azure portal showing the 'Review + Assign' pane. The interface displays a summary of the selected role assignment, including the role 'Storage Blob Data Reader' and the associated managed identity. A 'Review + Assign' button is visible at the bottom of the pane.":::

There are two dialogues to review your selection. Review your selection and select the **Review + Assign** Button each time. 

:::image type="content" source="media/ingestion-source-MI-assign2.png" alt-text="Screenshot of the Azure portal showing the 'Review + Assign' pane for assigning a role to a managed identity. The interface displays a summary of the selected role assignment, including the role 'Storage Blob Data Reader' and the associated managed identity. A 'Review + Assign' button is visible at the bottom of the pane, allowing users to confirm their selections and complete the role assignment process.":::


## Associate the user assigned managed identity to your Geocatalog resource

### Associate using the Azure portal

1. Sign in to the Azure portal.

1. Use the search bar to search for **GeoCatalogs**. Select **Geocatalogs** from under the list of Services.

:::image type="content" source="media/search-for-geocatalogs.png" alt-text="Screenshot of the Azure portal showing the GeoCatalog creation process. The interface displays fields for selecting the subscription, resource group, and region. A 'Review + create' button is visible at the bottom of the form, allowing users to proceed with the creation of a GeoCatalog resource.":::

1. Use the filters to find your GeoCatalog and select it.

:::image type="content" source="media/filter_geocatalog.png" alt-text="Screenshot of the Azure portal showing filters for GeoCatalogs. The interface displays options to filter GeoCatalogs by subscription, resource group, and other criteria, helping users locate their desired GeoCatalog resource.":::

1. In the side bar, select **Identity** under the Security field. Once in this window, select the blue **Add user assigned managed identity** button

:::image type="content" source="media/select_identity.png" alt-text="Screenshot of the Azure portal showing the 'Add user assigned managed identity' pane. The interface displays a list of available managed identities, with options to filter by subscription and resource group. A blue 'Add' button is visible at the bottom of the pane, allowing users to select and assign a managed identity to the GeoCatalog resource.":::

1. Select the user assigned managed identity you created in the earlier step, and select the blue **Add** button to complete this process.
:::image type="content" source="media/assign_identity.png" alt-text="Screenshot of the Azure portal showing the 'Assign Identity' pane. The interface displays a list of available managed identities, with options to filter by subscription and resource group. A blue 'Add' button is visible at the bottom of the pane, allowing users to select and assign a managed identity to the GeoCatalog resource.":::

1. Next, we give that user assigned managed identity read access to the blob storage where data is being read from. 

## Configure an ingestion source

The final step sets up an ingestion source, or a credential with the user assigned managed identity. 

1. Navigate to your GeoCatalog resource landing page and select the "Settings" tab. 

:::image type="content" source="media/settings-link.png" alt-text="Screenshot of GeoCatalog Portal showing where the Settings button is located.":::

1. Select the **Create ingestion source** button, which opens a new sidebar to Create a Credential.

1. Select the **managed identity** button.

1. Input the URL of the container in the storage account containing the data you wish to ingest.

    > [!IMPORTANT] 
    > You must input the entire URL including the container. It isn't possible to link only the base storage account. 

1. Select the managed identity associated with this Azure Blob Storage account. 

1. Press the **Create** button to complete the process

:::image type="content" source="media/ingestion-source-MI-source.png" alt-text="Diagram showing the process of setting up an ingestion source. The image is a flowchart. It includes steps for creating a managed identity. It shows assigning permissions. It shows associating the identity with a GeoCatalog. It shows configuring the ingestion source.":::

Your credential is now set up to support ingestion.


## Next steps
Now that you have setup managed identity, its time to ingest data. 

For Single Item Ingestion:

> [!div class="nextstepaction"]
> [Adding an Item to a STAC Collection](./add-stac-item-to-collection.md)

For Bulk Ingestion:
> [!div class="nextstepaction"]
> [Ingest data into GeoCatalog with the Bulk Ingestion API](./bulk-ingestion-api.md)

## Related content

- [Ingestion overview](./ingestion-overview.md)
- [Ingestion sources](./ingestion-source.md)
- [Set up ingestion credentials using SAS tokens](./setup-ingestion-credentials-sas-tokens.md)