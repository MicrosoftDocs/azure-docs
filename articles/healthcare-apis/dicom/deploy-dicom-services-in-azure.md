---
title: Deploy the DICOM service using the Azure portal - Azure Healthcare APIs
description: This article describes how to deploy the DICOM service in the Azure portal. 
author: stevewohl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 07/10/2021
ms.author: aersoy
---

# Deploy DICOM service using the Azure portal

In this quickstart, you'll learn how to deploy the DICOM service using the Azure portal.

## Prerequisite

To deploy the DICOM service, you must have a workspace created in the Azure portal. For more information about creating a workspace, see **Deploy Workspace in the Azure portal**.

## Deploying DICOM service

1. On the **Resource group** page of the Azure portal, select the name of your **Healthcare APIs Workspace**.

   :::image type="content" source="./media/select-workspace-resource-group.png" alt-text="Select workspace resource group" lightbox="select-workspace-resource-group.png":::

2. Select **Deploy DICOM service**.

    :::image type="content" source="./media/workspace-deploy-dicom-services.png" alt-text="Deploy DICOM service" lightbox="workspace-deploy-dicom-services.png":::

3. Select **Add DICOM service**.

   :::image type="content" source="./media/add-dicom-service.png" alt-text="Add DICOM service" lightbox="add-dicom-service.png":::

4. Enter a name for the DICOM service, and then select **Review + create**. 

   :::image type="content" source="./media/enter-dicom-service-name.png" alt-text="Enter DICOM service name" lightbox="enter-dicom-service-name.png":::

   (**Optional**) Select **Next: Tags >**.

    Tags are name/value pairs used for categorizing resources. For information about tags, see [Use tags to organize your Azure resources and management hierarchy](../../azure-resource-manager/management/tag-resources.md).

5. When you notice the green validation check mark, select **Create** to deploy the DICOM service.

6. When the deployment process completes, select **Go to resource**.  

   :::image type="content" source="./media/go-to-resource.png" alt-text="Go to resource":::

   The result of the newly deployed DICOM service is shown below.

   :::image type="content" source="./media/results-deployed-dicom-service.png" alt-text="Result of newly deployed DICOM service":::

## Next steps

>[!div class="nextstepaction"]
>[Overview of the DICOM service](dicom-services-overview.md)






