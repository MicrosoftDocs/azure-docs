---
title: Deploy a GeoCatalog resource - Microsoft Planetary Computer Pro
description: Learn how to deploy a GeoCatalog resource using Azure Portal or Azure Rest API, assign roles, and troubleshoot known issues.
author: meaghanlewis
ms.topic: quickstart
ms.service: planetary-computer
ms.date: 04/08/2025
ms.author: mosagie
---

# Deploy a GeoCatalog resource

The following tutorial guides the reader through the process of deploying a GeoCatalog resource.

There are two ways to deploy a Microsoft Planetary Computer Pro GeoCatalog:

1. Using the Azure Portal.  
1. Using the Azure Rest API.  

Extra resources provided in this tutorial include some guidance on assigning Azure Roles. Consult the "Known Issues" section of this document to help troubleshoot deployment issues you may encounter.  

## Method 1: Azure Portal deployment

1. Login to the Azure Portal using: https://aka.ms/geocatalogsprod.

1. Use the search bar to search for "GeoCatalogs"; and select "Geocatalogs" from under the list of Services.

   :::image type="content" source="media/search-for-geocatalogs.png" alt-text="Screenshot of searching for GeoCatalogs in the Azure Portal.":::

1. Start the workflow to create a new GeoCatalog by either selecting the "Create" button at the top left of the screen, or selecting the "Create geocatalog" button in the lower center of the screen. Note that the "Create geocatalog" button won't appear if you have one or more existing GeoCatalogs.

   :::image type="content" source="media/create-geocatalogs-button.png" alt-text="Screenshot of the Create GeoCatalog button in the Azure Portal.":::

1. From the "Basics" tab of the "Create GeoCatalog Resource" workflow, select the Subscription and Resource Group to which you would like to deploy your GeoCatalog. Provide a unique Name for your GeoCatalog resource, and select the Azure Region you wish to deploy into. Select "Next" to proceed to the next tab.

   > [!NOTE]
   > During the Public Preview period we support deployment to the following regions:
   >
   > - East US
   > - North Central US
   > - West Europe
   > - Canada Central

   :::image type="content" source="media/complete-basics-tab-geocatalog.png" alt-text="Screenshot of the Basics tab in the Create GeoCatalog Resource workflow.":::

1. From the "Networking" tab, select your networking options. Select "Next" to proceed to the next tab.

   > [!NOTE]
   > In Public Preview the only supported networking option is "Enable public access from all networks."

   :::image type="content" source="media/enable-public-access-from-networks.png" alt-text="Screenshot of the Networking tab in the Create GeoCatalog Resource workflow.":::

1. From the "Tags" tab, add any desired Tags to your new GeoCatalog resource. Tags are optional; please refer to [Naming and Tagging Best Practices](/azure/cloud-adoption-framework/ready/azure-best-practices/naming-and-tagging) for guidance on how to use Azure Tags. Select "Next" to proceed to the next tab.

   :::image type="content" source="media/create-geocatalog-tags.png" alt-text="Screenshot of the Tags tab in the Create GeoCatalog Resource workflow.":::

1. From the "Review and create" tab, review selections made in the previous step. If you need to make corrections, you can go back by either selecting the "Previous" button at the bottom of the page, or navigating directly to a tab in the workflow by selecting on that tab's name. Once you are satisfied with your settings and selections, select the "Create" button.

   :::image type="content" source="media/review-create-geocatalog-resource.png" alt-text="Screenshot of the Review and create tab in the Create GeoCatalog Resource workflow.":::

1. You see a "Deployment is in progress" page while you wait for your GeoCatalog deployment to complete. This process can take **10 or more minutes**. The "Status" of the resource deployment shows "Created" even before the deployment is actually complete.

   :::image type="content" source="media/geocatalog-deployment-in-progress.png" alt-text="Screenshot of the Deployment is in progress page in the Azure Portal.":::

1. The deployment page updates to "Your deployment is complete" when the deployment finishes. You can select "Go to resource" to navigate directly to your newly created GeoCatalog resource.

   :::image type="content" source="media/geocatalog-deployment-complete.png" alt-text="Screenshot of the Your deployment is complete page in the Azure Portal.":::

## Method 2: Azure Rest API using Cloud Shell Commands (az rest)

1. Login to your Azure portal and open up Cloud Shell.

1. Select Bash mode and run the following commands to provision an instance of GeoCatalog:

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

## Assign Azure Roles

In addition to all the standard built-in roles, GeoCatalog supports "GeoCatalog Administrator" and "GeoCatalog Reader" roles.

The definition of each role is described in the [IAM tab of the GeoCatalog resource on portal](/azure/role-based-access-control/role-assignments-cli).

## Known issues

1. If you're a classic admin of the Azure subscription, after you create a GeoCatalog, the GeoCatalog resource won’t inherit any role assignments from the subscription thus you may not have permission to read or write against the GeoCatalog. Workaround is to add yourself as Owner or Contributor role to either the subscription or the GeoCatalog resource.

1. You may or may not see the GeoCatalog resource in your resource group since it’s a hidden resource type. You may go to the resource group and change the view to show hidden types.