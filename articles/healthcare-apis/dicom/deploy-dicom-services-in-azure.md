---
title: Deploy the DICOM Services using the Azure portal
description: In this article, you'll learn how to deploy a workspace in the Azure portal 
author: stevewohl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 06/21/2021
ms.author: aersoy
---

# Deploy DICOM Services using the Azure portal

In this quickstart, you'll learn how to deploy the DICOM Services using the Azure portal.

## Prerequisite

To deploy the DICOM Services, you must have a workspace created in the Azure portal. For more information about creating a workspace, see [Deploy Workspace in the Azure portal](deploy-workspace-in-portal.md).

## Deploying DICOM Services

1. On the **Resource group** page of the Azure portal, select the name of your **Healthcare APIs Workspace**.

   :::image type="content" source="dicom/media/select-workspace-resource-group.png" alt-text="Select workspace resource group":::

2. Select **Deploy DICOM Services**.

    :::image type="content" source="dicom/media/workspace-deploy-dicom-services.png" alt-text="Deploy DICOM Services":::

3. Select **Add DICOM Service**.

   :::image type="content" source="dicom/media/add-dicom-service.png" alt-text="Add DICOM Service":::

4. Enter a name for the DICOM Service, and then select **Review + create**. 

   :::image type="content" source="dicom/media/enter-dicom-service-name.png" alt-text="Enter DICOM service name":::

   (**Optional**) Select **Next: Tags >**. 
    
    Tags are name/value pairs used for categorizing resources. For more information about tags, see [Use tags to organize your Azure resources and management hierarchy](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/tag-resources).

 
5. When you notice the green validation checkmark, select **Create** to deploy the DICOM service.

6. When the deployment process completes, click **Go to resource**.  

   :::image type="content" source="dicom/media/go-to-resource.png" alt-text="Go to resource":::

   The result of the newly deployed DICOM Service is shown below.

   :::image type="content" source="dicom/media/results-deployed-dicom-service.png" alt-text="Result of newly deployed DICOM service":::

## Next steps

>[!div class="nextstepaction"]
>[Overview of DICOM Services](dicom-services-overview.md)






