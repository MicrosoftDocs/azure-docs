---
title: Deploy the DICOM service by using the Azure portal - Azure Health Data Services
description: This article describes how to deploy the DICOM service in the Azure portal.
author: mmitrik
ms.service: healthcare-apis
ms.topic: how-to
ms.date: 10/06/2023
ms.author: mmitrik
ms.custom: mode-api
---

# Deploy the DICOM service

In this quickstart, you learn how to deploy the DICOM&reg; service by using the Azure portal.

After deployment is finished, you can use the Azure portal to go to the newly created DICOM service to see the details, including your service URL. The service URL to access your DICOM service is ```https://<workspacename-dicomservicename>.dicom.azurehealthcareapis.com```. Make sure to specify the version as part of the URL when you make requests. For more information, see [API versioning for the DICOM service](api-versioning-dicom-service.md).

> [!NOTE]
> A public preview of the DICOM service with Data Lake Storage is now available. This capability provides greater flexibility and control over your imaging data. Learn more: [Deploy the DICOM service with Data Lake Storage (Preview)](deploy-dicom-services-in-azure-data-lake.md)

## Prerequisites

To deploy the DICOM service, you need a workspace created in the Azure portal. For more information, see [Deploy a workspace in the Azure portal](../healthcare-apis-quickstart.md).

## Deploy the DICOM service

1. On the **Resource group** page of the Azure portal, select the name of your **Azure Health Data Services workspace**.

   [![Screenshot that shows selecting a workspace resource group.](media/select-workspace-resource-group.png) ](media/select-workspace-resource-group.png#lightbox)

1. Select **Deploy DICOM service**.

   [![Screenshot that shows deploying the DICOM service.](media/workspace-deploy-dicom-services.png) ](media/workspace-deploy-dicom-services.png#lightbox)

1. Select **Add DICOM service**.

   [![Screenshot that shows adding the DICOM service.](media/add-dicom-service.png) ](media/add-dicom-service.png#lightbox)

1. Enter a name for the DICOM service, and then select **Review + create**.

    [![Screenshot that shows the DICOM service name.](media/enter-dicom-service-name.png) ](media/enter-dicom-service-name.png#lightbox)

1. (Optional) Select **Next: Tags**.

    Tags are name/value pairs used for categorizing resources. For more information about tags, see [Use tags to organize your Azure resources and management hierarchy](../../azure-resource-manager/management/tag-resources.md).

1. When you notice the green validation check mark, select **Create** to deploy the DICOM service.

1. After the deployment process is finished, select **Go to resource**.

   [![Screenshot that shows Go to resource.](media/go-to-resource.png) ](media/go-to-resource.png#lightbox)

   The result of the newly deployed DICOM service is shown here.

   [![Screenshot that shows the DICOM finished deployment.](media/results-deployed-dicom-service.png) ](media/results-deployed-dicom-service.png#lightbox)

## Next steps

* [Assign roles for the DICOM service](../configure-azure-rbac.md#assign-roles-for-the-dicom-service)
* [Use DICOMweb Standard APIs with DICOM services](dicomweb-standard-apis-with-dicom-services.md)

[!INCLUDE [DICOM trademark statement](../includes/healthcare-apis-dicom-trademark.md)]