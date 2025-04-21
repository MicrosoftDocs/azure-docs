---
title: Deploy a GeoCatalog resource | Microsoft Planetary Computer Pro
description: Learn how to deploy a Microsoft Planetary Computer Pro GeoCatalog resource using Azure portal or Azure REST API
author: aloverro
ms.author: adamloverro
ms.service: planetary-computer
ms.topic: install-set-up-deploy #Don't change
ms.date: 04/08/2025

# customer intent: As an Azure user I want to deploy a GeoCatalog resource so that I can use a GeoCatalog to organize, query, visualize and retrieve my geospatial data assets

---

# Deploy a GeoCatalog resource

This article guides the reader through the process of deploying a GeoCatalog resource. The GeoCatalog resource is the top-level container for Geospatial data stored using Microsoft Planetary Computer (MPC) Pro. Once a GeoCatalog resource is deployed, the user can begin to ingest geospatial data into MPC Pro. Geospatial data stored in a GeoCatalog is indexed, queried, and retrieved using the SpatioTemporal Access Catalog (STAC) open-standard. For more information on STAC, see [STAC overview](./stac-overview.md).

## Prerequisites

- An Azure account and subscription [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli) (For using the REST API)

## Methods

This article describes two methods for deploying an MPC Pro GeoCatalog:

1. Using the Azure portal.  
1. Using the Azure REST API.  

## Deploy GeoCatalog with the Azure portal

1. Navigate to the [Azure Portal](https://portal.azure.com/)

1. Find the **GeoCatalogs** resource type use the Azure portal search bar at the top of the page; select "GeoCatalogs" from under the list of Services.

   :::image type="content" source="media/search-for-geocatalogs.png" alt-text="Screenshot of searching for GeoCatalogs in the Azure portal.":::

1. Start the GeoCatalog creation process by either 1) selecting the **Create** button at the top left of the screen, or 2) selecting the **Create geocatalog** button in the lower center of the screen. The **Create geocatalog** button doesn't appear if you have one or more existing GeoCatalogs.

   :::image type="content" source="media/create-geocatalogs-button.png" alt-text="Screenshot of the Create GeoCatalog button in the Azure portal.":::

1. From the "Basics" tab of the "Create GeoCatalog Resource" workflow, select the Subscription and Resource Group to which you would like to deploy your GeoCatalog. Provide a unique Name for your GeoCatalog resource, and select the Azure Region you wish to deploy into. Select "Next" to proceed to the next tab.

   > [!NOTE]
   > We support deployment to the following regions in Preview:
   >
   > - East US
   > - North Central US
   > - West Europe
   > - Canada Central

   :::image type="content" source="media/complete-basics-tab-geocatalog.png" alt-text="Screenshot of the Basics tab in the Create GeoCatalog Resource workflow.":::

1. From the "Networking" tab, select your networking options. Select "Next" to proceed to the next tab.

   > [!NOTE]
   > Only *Enable public access from all networks** option is supported in Preview.

   :::image type="content" source="media/enable-public-access-from-networks.png" alt-text="Screenshot of the Networking tab in the Create GeoCatalog Resource workflow.":::

1. From the "Tags" tab, add any desired Tags to your new GeoCatalog resource. Tags are optional; refer to [Naming and Tagging Best Practices](/azure/cloud-adoption-framework/ready/azure-best-practices/naming-and-tagging) for guidance on how to use Azure Tags. Select "Next" to proceed to the next tab.

   :::image type="content" source="media/create-geocatalog-tags.png" alt-text="Screenshot of the Tags tab in the Create GeoCatalog Resource workflow.":::

1. From the "Review and create" tab, review selections made in the previous step. Make necessary corrections in previous sections by selecting the **Previous** button at the bottom of the page. You can also directly navigate to a tab in the workflow by selecting on that tab's name. Once you're satisfied with your settings and selections, select the **Create** button.

   :::image type="content" source="media/review-create-geocatalog-resource.png" alt-text="Screenshot of the Review and create tab in the Create GeoCatalog Resource workflow.":::

1. You see a "Deployment is in progress" page while you wait for your GeoCatalog deployment to complete. This process can take **10 or more minutes**. The "Status" of the resource deployment shows "Created" even before the deployment is complete.

   :::image type="content" source="media/geocatalog-deployment-in-progress.png" alt-text="Screenshot of the Deployment is in progress page in the Azure portal.":::

1. The deployment page updates to "Your deployment is complete" when the deployment finishes. You can select "Go to resource" to navigate directly to your newly created GeoCatalog resource.

   :::image type="content" source="media/geocatalog-deployment-complete.png" alt-text="Screenshot of the Your deployment is complete page in the Azure portal.":::

## Deploy GeoCatalog with the Azure REST API

1. Sign in to your Azure portal and open up Cloud Shell.

1. Create an instance of GeoCatalog by selecting Bash mode, and run the following commands:

   ```bash
   # Change the active subscription using the subscription name or id, which has been allowed for GeoCatalog preview
   az account set --subscription "sub_name or sub_id"

   # Register Microsoft.Orbital resource provider even if it's already registered to take effect for GeoCatalog.
   az provider register -n Microsoft.Orbital

   # Set up the parameters of subscription_id, resource_group, target Azure region/location, and Spatio catalog name to be created. Note the subscription_id and resource_group need to be existing resources. Update Location and Catalog_name accordingly.
   export SUBSCRIPTION_ID="sub_id"
   export RESOURCE_GROUP="rg_name"
   export LOCATION=northcentralus
   export CATALOG_NAME="catalog_name"

   # Kick off the GeoCatalog deployment process, which may take 10-20 minutes
   az rest --method PUT --uri "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Orbital/geoCatalogs/$CATALOG_NAME?api-version=2024-01-31-preview" --body '{"location": "'$LOCATION'", "Properties":{"tier":"Basic"}}'

   # Check the status of the deployment
   az rest --method GET --uri "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Orbital/geoCatalogs/$CATALOG_NAME?api-version=2024-01-31-preview"

   # Get catalog uri
   az resource show -g $RESOURCE_GROUP -n $CATALOG_NAME --namespace Microsoft.Orbital --resource-type "geocatalogs"
   ```

1. Once the deployment status shows succeeded, you should be able to see the created GeoCatalog instance on the portal under the specified resource group (note you need to check "Show hidden types" checkbox to see it).

   :::image type="content" source="media/show-hidden-roles.png" alt-text="Screenshot of GeoCatalog instance in the Azure portal under the specified resource group.":::

## Related Content

- [Delete a GeoCatalog](./delete-geocatalog-resource.md)
- [Assign a user-assigend managed identity to a GeoCatalog resource](./assign-managed-identity-geocatalog-resource.md)
- [Create a STAC Collection using Python](./create-stac-collection.md)
- [Add STAC Items to a Collection using Python](./add-stac-item-to-collection.md)
- [Use the Data Explorer](./use-explorer.md)
