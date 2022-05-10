---
title: Deploy workspace in the Azure portal - Azure Health Data Services
description: This document teaches users how to deploy a workspace in the Azure portal.
author: stevewohl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 03/24/2022
ms.author: ginle
ms.custom: mode-api
---

# Deploy Azure Health Data Services workspace using Azure portal

In this article, you’ll learn how to create a workspace by deploying Azure Health Data Services through the Azure portal. The workspace is a centralized logical container for all your Azure Health Data services such as FHIR services, DICOM® services, and MedTech services. It allows you to organize and manage certain configuration settings that are shared among all the underlying datasets and services where applicable.


## Prerequisite

Before you can create a workspace in the Azure portal, you must have an account subscription. If you 
don’t have an Azure subscription, see [Create your free Azure account today](https://azure.microsoft.com/free/search/?OCID=AID2100131_SEM_c4b0772dc7df1f075552174a854fd4bc:G:s&ef_id=c4b0772dc7df1f075552174a854fd4bc:G:s&msclkid=c4b0772dc7df1f075552174a854fd4bc).

## Create new Azure service

In the Azure portal, select **Create a resource**.

[ ![Create resource](media/create-resource.png) ](media/create-resource.png#lightbox)

## Search for Azure Health Data Services

In the search box, enter **Azure Health Data Services**.

[ ![Search for HAzure Health Data Services](media/search-for-healthcare-apis.png) ](media/search-for-healthcare-apis.png#lightbox)

## Create Azure Health Data Services account

Select **Create** to create a new Azure Health Data Services account.

   [ ![Create workspace](media/create-workspace-preview.png) ](media/create-workspace-preview.png#lightbox)

## Enter Subscription and instance details

1. Select a **Subscription** and **Resource group** from the drop-down lists or select **Create new**.

   [ ![Create workspace new](media/create-healthcare-api-workspace-new.png) ](media/create-healthcare-api-workspace-new.png#lightbox)

2. Enter a **Name** for the workspace, and then select a **Region**. The name must be 3 to 24 alphanumeric characters, all in lowercase. Don't use a hyphen "-" as it's an invalid character for the name. For information about regions and availability zones, see [Regions and Availability Zones in Azure](../availability-zones/az-overview.md).

3. (**Optional**) Select **Next: Tags >**. Enter a **Name** and **Value**, and then select **Next: Review + create**. 

   [ ![Tags](media/tags-new.png) ](media/tags-new.png#lightbox)

   Tags are name/value pairs used for categorizing resources. For more information about tags, see [Use tags to organize your Azure resources and management hierarchy](.././azure-resource-manager/management/tag-resources.md).

4. Select **Create**.

[ ![Workspace terms](media/workspace-terms.png) ](media/workspace-terms.png)


   **Optional**: You may select **Download a template for automation** of your newly created workspace.


## Next steps

Now that the workspace is created, you can:

* [Deploy FHIR service](./../healthcare-apis/fhir/fhir-portal-quickstart.md)
* [Deploy DICOM service](./../healthcare-apis/dicom/deploy-dicom-services-in-azure.md)
* [Deploy a MedTech service and ingest data to your FHIR service](./../healthcare-apis/iot/deploy-iot-connector-in-azure.md)
* [Convert your data to FHIR](./../healthcare-apis/fhir/convert-data.md)

[ ![Deploy different services](media/healthcare-apis-deploy-services.png) ](media/healthcare-apis-deploy-services.png)

For more information about Azure Health Data Services workspace, see

>[!div class="nextstepaction"]
>[Workspace overview](workspace-overview.md)
