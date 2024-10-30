---
title: Azure Health Data Services quickstart
description: Learn how to create a workspace for Azure Health Data Services by using the Azure portal. The workspace is a centralized logical container for instances of the FHIR service, DICOM service, and MedTech service.
author: msjasteppe
ms.service: azure-health-data-services
ms.subservice: workspace
ms.topic: quickstart
ms.date: 06/07/2024
ms.author: jasteppe
ms.custom: mode-api
---

# Quickstart: Azure Health Data Services

Follow the steps in this article to create a workspace before you deploy instances of Azure Health Data Services in the Azure portal. The workspace is a centralized logical container for Azure Health Data services such as FHIR&reg; services, DICOM&reg; services, and MedTech services. It allows you to organize and manage configuration settings that are shared among all the underlying datasets and services.

## Prerequisites

Before you create a workspace in the Azure portal, you need an Azure account subscription. For more information, see [Create your free Azure account today](https://azure.microsoft.com/free/search/?OCID=AID2100131_SEM_c4b0772dc7df1f075552174a854fd4bc:G:s&ef_id=c4b0772dc7df1f075552174a854fd4bc:G:s&msclkid=c4b0772dc7df1f075552174a854fd4bc).

## Create a resource

1. In the Azure portal, select **Create a resource**.

   :::image type="content" source="media/healthcare-apis-quickstart/create-resource.png" alt-text="Screenshot showing resource creation." lightbox="media/healthcare-apis-quickstart/create-resource.png":::

1. In the search box, enter **Azure Health Data Services**.

   :::image type="content" source="media/healthcare-apis-quickstart/search-services-marketplace.png" alt-text="Screenshot showing how to search for Azure Health Data Services." lightbox="media/healthcare-apis-quickstart/search-services-marketplace.png":::

1. Choose **Create** to create an Azure Health Data Services account.

   :::image type="content" source="media/healthcare-apis-quickstart/create-health-data-services-resource.png" alt-text="Screenshot showing how to create a new account." lightbox="media/healthcare-apis-quickstart/create-health-data-services-resource.png":::

1. On the **Basics** tab, under **Project details**, from the dropdown lists select a **Subscription** and **Resource group**.  

1. Choose **Create new** to create a new resource group.

   :::image type="content" source="media/healthcare-apis-quickstart/create-health-data-services-workspace-basics-tab.png" alt-text="Screenshot showing the workspace settings on the Basics tab." lightbox="media/healthcare-apis-quickstart/create-health-data-services-workspace-basics-tab.png":::
   
1. Enter a **Name** for the workspace, and then select a **Region**. The name must be 3 to 24 alphanumeric characters, all lowercase. Don't use a hyphen "-" as it's an invalid character for the name. For information about regions and availability zones, see [Regions and Availability Zones in Azure](../availability-zones/az-overview.md).

1. Select **Next: Networking >**. Connect a workspace publicly with the default **Public endpoint (all networks)** option selected. You can also connect a workspace using a private endpoint by selecting the **Private endpoint** option. For more information about accessing Azure Health Data Services over a private endpoint, see [Configure Private Link for Azure Health Data Services](healthcare-apis-configure-private-link.md).

   :::image type="content" source="media/healthcare-apis-quickstart/create-workspace-networking-tab.png" alt-text="Screenshot showing the Networking tab." lightbox="media/healthcare-apis-quickstart/create-workspace-networking-tab.png":::
  
1. Select **Next: Tags >** if you want to include name and value pairs to categorize resources and view consolidated billing by applying the same tag to multiple resources and resource groups. Enter a **Name** and **Value** for the workspace, and then select **Review + create** or **Next: Review + create**. For more information about tags, see [Use tags to organize your Azure resources and management hierarchy](.././azure-resource-manager/management/tag-resources.md).

   :::image type="content" source="media/healthcare-apis-quickstart/tags-new.png" alt-text="Screenshot showing the Tags tab." lightbox="media/healthcare-apis-quickstart/tags-new.png":::

1. Review the details. Choose **Create** if you don't need to make any changes to the workspace project and instance details. If you need to make changes to the project and instance details, select **Previous**.

   :::image type="content" source="media/healthcare-apis-quickstart/workspace-review-create-tab.png" alt-text="Screenshot showing details about the workspace." lightbox="media/healthcare-apis-quickstart/workspace-review-create-tab.png":::

      **Optional**: Select **Download a template for automation** of the newly created workspace.

1. After the workspace deployment process is complete, select **Go to resource**.

   :::image type="content" source="media/healthcare-apis-quickstart/workspace-deployment-details.png" alt-text="Screenshot showing the workspace and the Go to resource button." lightbox="media/healthcare-apis-quickstart/workspace-deployment-details.png":::

1. Create instances of the FHIR service, DICOM service, and MedTech service in the newly created Azure Health Data Services workspace.

   :::image type="content" source="media/healthcare-apis-quickstart/deploy-health-data-services-workspace.png" alt-text="Screenshot showing the newly created workspace." lightbox="media/healthcare-apis-quickstart/deploy-health-data-services-workspace.png":::

## Next steps

[Deploy the FHIR service](./../healthcare-apis/fhir/fhir-portal-quickstart.md)

[Deploy the DICOM service](./../healthcare-apis/dicom/deploy-dicom-services-in-azure.md)

[Deploy the MedTech service and ingest data into the FHIR service](./../healthcare-apis/iot/deploy-iot-connector-in-azure.md)

[Convert data to FHIR format](./../healthcare-apis/fhir/convert-data-overview.md)

[!INCLUDE [FHIR and DICOM trademark statement](./includes/healthcare-apis-fhir-dicom-trademark.md)]