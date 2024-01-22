---
title: 'Quickstart: Deploy Azure API for FHIR using Azure portal'
description: In this quickstart, you'll learn how to deploy Azure API for FHIR and configure settings using the Azure portal.
services: healthcare-apis
author: expekesheth
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart 
ms.date: 09/27/2023
ms.author: kesheth
ms.custom: mode-api
---

# Quickstart: Deploy Azure API for FHIR using Azure portal

[!INCLUDE [retirement banner](../includes/healthcare-apis-azure-api-fhir-retirement.md)]

In this quickstart, you'll learn how to deploy Azure API for FHIR using the Azure portal.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create new resource

Open the [Azure portal](https://portal.azure.com) and select **Create a resource**

![Create a resource](media/quickstart-paas-portal/portal-create-resource.png)

## Search for Azure API for FHIR

You can find Azure API for FHIR by typing "FHIR" into the search box:

:::image type="content" source="media/quickstart-paas-portal/portal-search-healthcare-apis.png" alt-text="Search for Azure Health Data Services":::

## Create Azure API for FHIR account

Select **Create** to create a new Azure API for FHIR account:

:::image type="content" source="media/quickstart-paas-portal/portal-create-healthcare-apis.png" alt-text="Create Azure API for FHIR account":::

## Enter account details

Select an existing resource group or create a new one, choose a name for the account, and finally select **Review + create**:

:::image type="content" source="media/quickstart-paas-portal/portal-new-healthcare-apis-details.png" alt-text="New healthcare api details":::

Confirm creation and await FHIR API deployment.

## Additional settings (optional)

You can also select **Next: Additional settings** to view the authentication settings. The default configuration for the Azure API for FHIR is to [use Azure RBAC for assigning data plane roles](configure-azure-rbac.md). When configured in this mode, the "Authority" for the FHIR service will be set to the Microsoft Entra tenant of the subscription:

:::image type="content" source="media/rbac/confirm-azure-rbac-mode-create.png" alt-text="Default Authentication settings":::

Notice that the box for entering allowed object IDs is grayed out, since we use Azure RBAC for configuring role assignments in this case.

If you wish to configure the FHIR service to use an external or secondary Microsoft Entra tenant, you can change the Authority and enter object IDs for user and groups that should be allowed access to the server. For more information, see the [local RBAC configuration](configure-local-rbac.md) guide.

## Fetch FHIR API capability statement

To validate that the new FHIR API account is provisioned, fetch a capability statement by pointing a browser to `https://<ACCOUNT-NAME>.azurehealthcareapis.com/metadata`.

## Clean up resources

When no longer needed, you can delete the resource group, Azure API for FHIR, and all related resources. To do so, select the resource group containing the Azure API for FHIR account, select **Delete resource group**, then confirm the name of the resource group to delete.

## Next steps

In this quickstart guide, you've deployed the Azure API for FHIR into your subscription. For information about how to register applications and the Azure API for FHIR configuration settings, see


>[!div class="nextstepaction"]
>[Register Applications Overview](fhir-app-registration.md)

>[!div class="nextstepaction"]
>[Configure Azure RBAC](configure-azure-rbac.md)

>[!div class="nextstepaction"]
>[Configure local RBAC](configure-local-rbac.md)

>[!div class="nextstepaction"]
>[Configure database settings](configure-database.md)

>[!div class="nextstepaction"]
>[Configure customer-managed keys](customer-managed-key.md)

>[!div class="nextstepaction"]
>[Configure CORS](configure-cross-origin-resource-sharing.md)

>[!div class="nextstepaction"]
>[Configure Private Link](configure-private-link.md)

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
