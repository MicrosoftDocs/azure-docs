---
title: Setup an ingestion source for Microsoft Planetary Computer Pro using managed identity
description: Learn how to add credentials and ingest data into Microsoft Planetary Computer Pro using managed identities.
author: prasadkomma
ms.author: prasadkommamma
ms.service: azure
ms.topic: how-to
ms.date: 04/09/2025
#customer intent: Help customers understand how ingestion sources work and how to add them ahead of an ingestion. 
---

# Setup Ingestion Credentials for Microsoft Planetary Computer Pro using managed identity

Loading new data into the Microsoft Planetary Computer Pro GeoCatalog resource is called **ingestion.** A GeoCatalog needs permissions, or ingestion Sources, to access data that is stored externally to the GeoCatalog resource.
  
In this guide, you learn how to:

- [Create a user assigned managed identity](#create-a-user-assigned-managed-identity)
- [Give a user assigned managed identity Storage Blob Data Reader to Azure Blob Storage](#give-a-user-assigned-managed-identity-storage-blob-data-reader-to-azure-blob-storage)
- [Associate a user assigned managed identity to a GeoCatalog](#associate-the-user-assigned-managed-identity-with-your-geocatalog-resource)
- [Setup an ingestion source](#setup-an-ingestion)

All four steps are required to setup your GeoCatalog resource to read data from an external ingestion source. 

## Prerequisites

- A Microsoft Planetary Computer Pro GeoCatalog deployed to your Azure Subscription. See [Deploy a GeoCatalog resource](./deploy-geocatalog-resource.md).

- An Azure Blob container setup with the correct permissions to assign managed identities. See [Create an Azure storage account](/azure/storage/common/storage-account-create?tabs=azure-portal).

## Managed identity vs. SAS tokens

[Managed identities](/entra/identity/managed-identities-azure-resources/overview) provide an automatically managed identity in Microsoft Entra ID for applications to use when connecting to resources that support Microsoft Entra authentication.

[Shared Access Signatures (SAS)](/azure/storage/common/storage-sas-overview) create cryptographic credentials for access to a resource such as Azure Blob Storage. 

Managed identities are a more secure, automated mechanism for establishing persistent access to a storage account and are the recommended approach for providing secure access to Azure Blob Storage for data ingestion. 

Managed identities only work within a single Microsoft Entra tenant, therefore the SAS Token approach is useful when moving data from storage that is in a storage account outside of your tenant. Data ingestion is specific to a Blob Container, and SAS tokens from the root storage resource aren't permitted. 

This guide show how to use the managed identity approach. If SAS tokens are more appropriate for your use case, see how to [setup ingestion credentials using SAS](./setup-ingestion-credentials-sas-tokens.md).

## Create a user assigned managed identity

Navigate to the [Azure portal](https://portal.azure.com/) to create a new managed identity resource. In the search bar, search for **managed identities**. 

![Screenshot of the Azure portal showing the managed identities search results. The search bar at the top has "managed identities" entered, and the results display the managed identities service.](media/ingestion-source-MI-search.png)

Select the **Create** button to begin the process. In the dialogue, you'll have the opportunity to assign the managed identity to a Subscription, Resource Group and Region. Once you have entered the data, select the **Review + create** and then the **Create** button. 

![Screenshot of the Azure portal showing the creation of a managed identity. The interface displays fields for selecting the subscription, resource group, and region. A "Review + create" button is visible at the bottom of the form.](media/ingestion-source-MI-create.png)

Next, we associate this managed identity to our Geocatalog. 

## Give a user assigned managed identity Storage Blob Data Reader to Azure Blob Storage

Navigate back to the Azure Portal and go to the storage resource you wish to use to ingest data into Microsoft Planetary Computer Pro. Once at that resource, select the **Access Control (IAM)** button in the sidebar and then select **"Add the assignment"** button.   

![Screenshot of the Azure portal showing the "Add role assignment" pane. The interface displays fields to select a role, assign access to a user, group, or managed identity, and choose specific members.](media/ingestion-source-MI-give-permissions.png)

Next, search for the **"Storage Blob Data Reader"** role inside the search reader. Select the **"Storage Blob Data Reader"** and press the **"Next"** button. 

![Screenshot of the Azure portal showing the "Role assignment" pane. The interface displays fields to select a role, assign access to a user, group, or managed identity, and choose specific members. The "Storage Blob Data Reader" role is highlighted in the list of available roles.](media/ingestion-source-MI-role.png)

In the Members pane, select **"managed identity"**, which pops up a new side bar. Select the **Subscription** where you created the user assigned managed identity in the previous steps, and then select **User assigned managed identity**. Select the user assigned managed identity and select the **Select** button to continue. 

![Screenshot of the Azure portal showing the "Review + Assign" pane. The interface displays a summary of the selected role assignment, including the role "Storage Blob Data Reader" and the associated managed identity. A "Review + Assign" button is visible at the bottom of the pane.](media/ingestion-source-MI-assign.png)

There are two dialogues to review your selection. Review your selection and select the **"Review + Assign"** Button each time. 

![Screenshot of the Azure portal showing the "Review + Assign" pane for assigning a role to a managed identity. The interface displays a summary of the selected role assignment, including the role "Storage Blob Data Reader" and the associated managed identity. A "Review + Assign" button is visible at the bottom of the pane, allowing users to confirm their selections and complete the role assignment process.](media/ingestion-source-MI-assign2.png)


## Associate the user assigned managed identity to your Geocatalog resource

### Associate using the Azure Portal

1. Login to the Azure Portal.

1. Use the search bar to search for "GeoCatalogs". Select "Geocatalogs" from under the list of Services.

![Screenshot of the Azure portal showing the GeoCatalog creation process. The interface displays fields for selecting the subscription, resource group, and region. A "Review + create" button is visible at the bottom of the form, allowing users to proceed with the creation of a GeoCatalog resource.](media/search-for-geocatalogs.png)

1. Use the filters to find your GeoCatalog and select it.

![Screenshot of the Azure portal showing filters for GeoCatalogs. The interface displays options to filter GeoCatalogs by subscription, resource group, and other criteria, helping users locate their desired GeoCatalog resource.](media/filter_geocatalog.png)

1. In the side bar, select **Identity** under the Security field. Once in this window, select the blue **Add user assigned managed identity** button

![Screenshot of the Azure portal showing the "Add user assigned managed identity" pane. The interface displays a list of available managed identities, with options to filter by subscription and resource group. A blue "Add" button is visible at the bottom of the pane, allowing users to select and assign a managed identity to the GeoCatalog resource.](media/select_identity.png)

1. Select the user assigned managed identity you created in the earlier step, and select the blue **Add** button to complete this process.
![Screenshot of the Azure portal showing the "Assign Identity" pane. The interface displays a list of available managed identities, with options to filter by subscription and resource group. A blue "Add" button is visible at the bottom of the pane, allowing users to select and assign a managed identity to the GeoCatalog resource.](media/assign_identity.png)

1. Next, we give that user assigned managed identity read access to the blob storage where data is being read from. 

## Setup an ingestion source

The final step sets up an ingestion source, or a credential with the user assigned managed identity. 

1. Navigate to your GeoCatalog resource landing page and select the "Settings" tab. 

![Screenshot of the Azure portal showing the "Create Credential" pane. The interface displays fields to select a credential type, input the container URL, and choose a managed identity. A "Create" button is visible at the bottom of the pane, allowing users to finalize the credential creation process.](media/credentials_4.png)

1. Select the **Create Credential** button, which opens a new sidebar to Create a Credential.

1. Select the **managed identity** button.

1. Input the URL of the container in the storage account containing the data you wish to ingest.

    > [!NOTE] 
    > You must input the URL of the container, not the URL of the storage account fails* 

1. Select the managed identity associated with this Azure Blob Storage account. 

1. Press the **Create** button to complete the process

![Diagram illustrating the process of setting up an ingestion source. The image shows a flowchart with steps including creating a managed identity, assigning permissions, associating the identity with a GeoCatalog, and configuring the ingestion source.](media/ingestion-source-MI-source.png)

Your credential is now set up to support ingestions.

![Screenshot of the Azure portal showing the "Credential Details" pane. The interface displays the details of a created credential, including the credential type, container URL, and associated managed identity. A "Delete" button is visible at the bottom of the pane, allowing users to remove the credential if needed.](media/credentials_6.png)

## Related content

- [Ingestion overview]()