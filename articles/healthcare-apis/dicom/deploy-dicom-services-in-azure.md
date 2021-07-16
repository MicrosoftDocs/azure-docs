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

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

In this quickstart, you'll learn how to deploy the DICOM Service using the Azure portal.

## Prerequisite

To deploy the DICOM service, you must have a workspace created in the Azure portal. For more information about creating a workspace, see **Deploy Workspace in the Azure portal**.

## Deploying DICOM service

1. On the **Resource group** page of the Azure portal, select the name of your **Healthcare APIs Workspace**.

   [ ![select workspace resource group.](media/select-workspace-resource-group.png) ](media/select-workspace-resource-group.png#lightbox)

2. Select **Deploy DICOM service**.

   [ ![deploy dicom service.](media/workspace-deploy-dicom-services.png) ](media/workspace-deploy-dicom-services.png#lightbox)


3. Select **Add DICOM service**.

   [ ![add dicom service.](media/add-dicom-service.png) ](media/add-dicom-service.png#lightbox)


4. Enter a name for the DICOM service, and then select **Review + create**. 

    [ ![dicom service name.](media/enter-dicom-service-name.png) ](media/enter-dicom-service-name.png#lightbox)


   (**Optional**) Select **Next: Tags >**.

    Tags are name/value pairs used for categorizing resources. For information about tags, see [Use tags to organize your Azure resources and management hierarchy](../../azure-resource-manager/management/tag-resources.md).

5. When you notice the green validation check mark, select **Create** to deploy the DICOM service.

6. When the deployment process completes, select **Go to resource**.  

   [ ![dicom go to resource.](media/go-to-resource.png) ](media/go-to-resource.png#lightbox)



   The result of the newly deployed DICOM service is shown below.

   [ ![dicom finished deployment.](media/results-deployed-dicom-service.png) ](media/results-deployed-dicom-service.png#lightbox)



## Next steps

>[!div class="nextstepaction"]
>[Overview of the DICOM service](dicom-services-overview.md)






