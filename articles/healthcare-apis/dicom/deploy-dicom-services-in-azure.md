---
title: Deploy the DICOM Service using the Azure portal
description: In this article, you'll learn how to deploy a workspace in the Azure portal 
author: stevewohl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 06/21/2021
ms.author: aersoy
---

# Deploy DICOM Service using the Azure portal

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

In this quickstart, you'll learn how to deploy the DICOM Service using the Azure portal.

## Prerequisite

To deploy the DICOM Service, you must have a workspace created in the Azure portal. For more information about creating a workspace, see **Deploy Workspace in the Azure portal**.

## Deploying DICOM Service

1. On the **Resource group** page of the Azure portal, select the name of your **Healthcare APIs Workspace**.

   :::image type="content" source="media/select-workspace-resource-group.png" alt-text="Select workspace resource group":::

2. Select **Deploy DICOM Service**.

    :::image type="content" source="media/workspace-deploy-dicom-services.png" alt-text="Deploy DICOM Service":::

3. Select **Add DICOM Service**.

   :::image type="content" source="media/add-dicom-service.png" alt-text="Add DICOM Service":::

4. Enter a name for the DICOM Service, and then select **Review + create**. 

   :::image type="content" source="media/enter-dicom-service-name.png" alt-text="Enter DICOM Service name":::

   (**Optional**) Select **Next: Tags >**.

    Tags are name/value pairs used for categorizing resources. For more information about tags, see [Use tags to organize your Azure resources and management hierarchy](../../azure-resource-manager/management/tag-resources.md).

5. When you notice the green validation checkmark, select **Create** to deploy the DICOM Service.

6. When the deployment process completes, click **Go to resource**.  

   :::image type="content" source="media/go-to-resource.png" alt-text="Go to resource":::

   The result of the newly deployed DICOM Service is shown below.

   :::image type="content" source="media/results-deployed-dicom-service.png" alt-text="Result of newly deployed DICOM service":::

## Next steps

>[!div class="nextstepaction"]
>[Overview of DICOM Service](dicom-services-overview.md)






