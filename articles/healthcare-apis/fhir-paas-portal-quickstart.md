---
title: Deploy Microsoft Healthcare APIs for FHIR using Azure Portal
description: Deploy Microsoft Healthcare APIs for FHIR using Azure Portal.
services: healthcare-apis
author: hansenms
ms.service: healthcare-apis
ms.topic: quickstart 
ms.date: 02/07/2019
ms.author: mihansen
---

# Quickstart: Deploy Microsoft Healthcare APIs using Azure portal

In this quickstart, you'll learn how to deploy Microsoft Healthcare APIs using the Azure Portal.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create new resource

Open the [Azure portal](https://portal.azure.com) and click **Create a resource**

![Create a resource](media/quickstart-paas-portal/portal-create-resource.png)

## Search for Microsoft Healthcare APIs

You can find Microsoft Healthcare APIs by typing "Healthcare APIs" into the search box:

![Search for Healthcare APIs](media/quickstart-paas-portal/portal-search-healthcare-apis.png)

## Create Healthcare APIs account

Select **Create** to create a new Healthcare APIs account:

![Create Healthcare APIs account](media/quickstart-paas-portal/portal-create-healthcare-apis.png)

## Enter account details

Select an existing resource group or create a new one, choose a name for the account, and finally click **Review + create**:

![New healthcare api details](media/quickstart-paas-portal/portal-new-healthcareapi-details.png)

Confirm creation and await FHIR API deployment.

## Additional settings

Click **Next: Additional settings** to configure the identity object IDs that should be allowed to access this Azure API for FHIR:


![Configure allowed object IDs](media/quickstart-paas-portal/configure-allowed-oids.png)

See [how to find identity object IDs](find-identity-object-ids.md) for details on how to locate identity object IDs for users and service principals.

## Fetch FHIR API capability statement

To validate that the new FHIR API account is provisioned, fetch a capability statement by pointing a browser to `https://<ACCOUNT-NAME>.microsofthealthcareapis.com/metadata`:

![Capability statement in browser](media/quickstart-paas-portal/portal-metadata-browser.png)

## Clean up resources

When no longer needed, you can delete the resource group, Microsoft Healthcare APIs, and all related resources. To do so, select the resource group containing the Microsoft Healthcare APIs account, select **Delete resource group**, then confirm the name of the resource group to delete.

## Next steps

In this tutorial, you've deployed the Microsoft Healthcare APIs for FHIR into your subscription. To learn how to access the FHIR API using Postman, proceed to the Postman tutorial.

>[!div class="nextstepaction"]
>[Access FHIR API using Postman](access-fhir-postman-tutorial.md)