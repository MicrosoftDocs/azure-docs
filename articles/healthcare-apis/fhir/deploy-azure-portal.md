---
title: Deploy the FHIR service in Azure Health Data Services
description: Learn how to deploy the FHIR service in Azure Health Data Services by using the Azure portal. This article covers prerequisites, workspace deployment, service creation, and security settings.
author: EXPEkesheth
ms.service: healthcare-apis
ms.topic: quickstart
ms.date: 04/30/2024
ms.author: kesheth
ms.custom: mode-api
---

# Deploy the FHIR service by using the Azure portal

The Azure portal provides a web interface with guided workflows, making it an efficient tool for deploying the FHIR service and ensuring accurate configuration within Azure Health Data Services.

## Prerequisites

- Verify you have an Azure subscription and permissions for creating resource groups and deploy resources.

- Deploy a workspace for Azure Health Data Services. For steps, see [Deploy workspace in the Azure portal](../healthcare-apis-quickstart.md).

## Create a new FHIR service
 
1. From your Azure Health Data Services workspace, choose **Create FHIR service**. 
1. Choose **Add FHIR service**. 
1. On the **Create FHIR service** page, complete the fields on each tab. 
              
   - **Basics tab**: Give the FHIR service a friendly and unique name. Select the **FHIR version** (**STU3** or **R4**), and then choose **Next: Additional settings**.

     :::image type="content" source="media/fhir-service/create-ahds-fhir-service-sml.png" alt-text="Screenshot showing how to create a FHIR service from the Basics tab." lightbox="media/fhir-service/create-ahds-fhir-service-lrg.png":::

   - **Additional settings tab (optional)**: This tab allows you to:
     - **View authentication settings**: The default configuration for the FHIR service is **Use Azure RBAC for assigning data plane roles**. When configured in this mode, the authority for the FHIR service is set to the Microsoft Entra tenant for the subscription.

     - **Integration with non-Microsoft Entra ID (optional)**: Use this option when you need to configure up to two additional identity providers other than Microsoft Entra ID to authenticate and access FHIR resources with SMART on FHIR scopes.
    
     - **Setting versioning policy (optional)**: The versioning policy controls the history setting for FHIR service at the system level or individual resource type level. For more information, see [FHIR versioning policy and history management](fhir-versioning-policy-and-history-management.md). Choose **Next: Security**.

   - On the **Security settings** tab, review the fields. 

       By default, data is encrypted with Microsoft-managed keys. For additional control over encryption keys, you can supply customer-managed keys to use for encryption of data. Customer-managed keys must be stored in an Azure Key Vault. You can either create your own keys and store them in a key vault, or use the Azure Key Vault APIs to generate keys. For more information, see [Configure customer-managed keys for the FHIR service](configure-customer-managed-keys.md). Choose **Next: Tags**. 

   - On the **Tags** tab (optional), enter any tags. 
   
     Tags are name and value pairs used for categorizing resources and aren't required. For more information, see [Use tags to organize your Azure resources and management hierarchy](../../azure-resource-manager/management/tag-resources.md).

   - Choose **Review + Create** to begin the validation process. Wait until you receive confirmation that the deployment completed successfully. Review the confirmation screen, and then choose **Create** to begin the deployment. 

   The deployment process might take several minutes. When the deployment completes, you see a confirmation message.

   :::image type="content" source="media/fhir-service/deployment-success-fhir-service-sml.png" alt-text="Screenshot showing successful deployment." lightbox="media/fhir-service/deployment-success-fhir-service-sml.png":::

1. Validate the deployment. Fetch the capability statement from your new FHIR service. Fetch a capability statement by browsing to `https://<WORKSPACE-NAME>-<FHIR-SERVICE-NAME>.fhir.azurehealthcareapis.com/metadata`.

## Related content

[Access the FHIR service by using Postman](../fhir/use-postman.md)

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]

