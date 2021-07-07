---
title: Deploy workspace in the Azure portal
description: In this article, you'll learn how to deploy a workspace in the Azure portal. 
author: stevewohl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 06/21/2021
ms.author: ginle
---

# Deploy workspace in the Azure portal

In this article, you’ll learn how to create a workspace by deploying an Azure Healthcare APIs 
service using the Azure portal. The workspace is a centralized logical container for all your healthcare APIs services such as FHIR services, DICOM® services, and IoT Connectors. It allows you to organize and manage certain configuration settings that are shared among all the underlying datasets and services where applicable.


## Prerequisite

Before you can create a workspace in the Azure portal, you must have an account subscription. If you 
don’t have an Azure subscription, see [Create your free Azure account today](https://azure.microsoft.com/free/search/?OCID=AID2100131_SEM_c4b0772dc7df1f075552174a854fd4bc:G:s&ef_id=c4b0772dc7df1f075552174a854fd4bc:G:s&msclkid=c4b0772dc7df1f075552174a854fd4bc).

## Create new Azure service

In the Azure portal, select **Create a resource**.

:::image type="content" source="fhir/media/healthcareapis-workspace/create-resource.png" alt-text="Create resource.":::

## Search for Azure Healthcare APIs

In the **Marketplace**, enter **Azure Healthcare APIs** in the search textbox.


:::image type="content" source="fhir/media/healthcareapis-workspace/search-for-heathcare-apis.png" alt-text="Search for Azure Healthcare APIs.":::


## Create Azure Healthcare API account

Select **Create** to create a new Azure Healthcare APIs account.


:::image type="content" source="fhir/media/healthcareapis-workspace/create-workspace-preview.png" alt-text="Create Azure Healthcare APIs account.":::


## Enter Subscription and instance details

1. Select a **Subscription** and **Resource group** from the drop-down lists or select **Create new**.

   :::image type="content" source="fhir/media/healthcareapis-workspace/create-healthcare-api-workspace-new.png" alt-text="Create Azure Healthcare APIs workspace.":::


2. Enter a **Name** for the workspace, and then select a **Region**. The name must be 3 to 24 alphanumeric characters, all in lowercase. Do not use a hyphen "-" as it is an invalid character for the name. For information about regions and availability zones, see [Regions and Availability Zones in Azure](https://docs.microsoft.com/azure/availability-zones/az-overview).

3. (**Optional**) Select **Next: Tags >**. Enter a **Name** and **Value**, and then select **Next: Review + create**. 

   :::image type="content" source="fhir/media/healthcareapis-workspace/tags-new.png" alt-text="Tags.":::

   Tags are name/value pairs used for categorizing resources. For more information about tags, see [Use tags to organize your Azure resources and management hierarchy](https://docs.microsoft.com/azure/azure-resource-manager/management/tag-resources).

4. Select **Create**.

   :::image type="content" source="fhir/media/healthcareapis-workspace/workspace-terms.png" alt-text="Terms.":::


   **Optional**: You may select **Download a template for automation** of your newly created workspace.


## Next steps

Now that the workspace is created, you can:

* Deploy FHIR services
* Deploy DICOM services
* Transform your data into different formats and secondary use through our conversion and de-identification APIs.
* Deploy an IoT Connector to ingest data from your FHIR service.

:::image type="content" source="fhir/media/healthcareapis-workspace/healthcare-apis-deploy-services.png" alt-text="Healthcare APIs deploy services.":::

> [!NOTE]
> You can deploy a FHIR Service or DICOM Service through the Azure Portal. If you would like to deploy an IoT Connector, see Deploying an IoT Connector using an ARM template.

>[!div class="nextstepaction"]
>[Workspace overview](workspace-overview.md)

