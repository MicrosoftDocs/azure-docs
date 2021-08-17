---
title: Deploy a FHIR service within Azure Healthcare APIs
description: This article teaches users how to deploy a FHIR service in the Azure portal. 
author: stevewohl
ms.service: healthcare-apis
ms.topic: quickstart
ms.date: 08/03/2021
ms.author: ginle
---

# Deploy a FHIR service within Azure Healthcare APIs - using portal

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

In this article, you will learn how to deploy the FHIR service within the Azure Healthcare APIs using the Azure portal.

## Prerequisite

Before getting started, you should have already deployed the Azure Healthcare APIs. For more information about deploying Azure Healthcare APIs, see [Deploy workspace in the Azure portal](../healthcare-apis-quickstart.md).

## Create a new FHIR service

From the workspace, select **Deploy FHIR Services**.

[ ![Deploy FHIR service](media/fhir-service/deploy-fhir-services.png) ](media/fhir-service/deploy-fhir-services.png#lightbox)

Select **+ Add FHIR Service**.

[ ![Add FHIR service](media/fhir-service/add-fhir-service.png) ](media/fhir-service/add-fhir-service.png#lightbox)

Enter an **Account name** for your FHIR service. Select the **FHIR version** (**STU3** or **R4**), and then select **Review + create**.

[ ![Create FHIR service](media/fhir-service/create-fhir-service.png) ](media/fhir-service/create-fhir-service.png#lightbox)

Before you select **Create**, review the properties of the **Basics** and **Additional settings** of your FHIR service. If you need to go back and make changes, select **Previous**. Confirm that the **Validation success** message is displayed. 

[ ![Validate FHIR service](media/fhir-service/validation-fhir-service.png) ](media/fhir-service/validation-fhir-service.png#lightbox)

## Additional settings (optional)

You can also select the **Additional settings** tab to view the authentication settings. The default configuration for the Azure API for FHIR is to **use Azure RBAC for assigning data plane roles**. When it's configured in this mode, the "Authority" for the FHIR service will be set to the Azure Active Directory tenant of the subscription.

[ ![Additional settings FHIR service](media/fhir-service/additional-settings-tab.png) ](media/fhir-service/additional-settings-tab.png#lightbox)

Notice that the box for entering **Allowed object IDs** is grayed out. This is because we use Azure RBAC for configuring role assignments in this case.

If you wish to configure the FHIR service to use an external or secondary Azure Active Directory tenant, you can change the Authority and enter object IDs for user and groups that should be allowed access to the server.

## Fetch FHIR API capability statement

To validate that the new FHIR API account is provisioned, fetch a capability statement by browsing to `https://<WORKSPACE NAME>-<ACCOUNT-NAME>.fhir.azurehealthcareapis.com/metadata`.

## Next steps

>[!div class="nextstepaction"]
>[Access the FHIR service using Postman](../azure-api-for-fhir/access-fhir-postman-tutorial.md)

