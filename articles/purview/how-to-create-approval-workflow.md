---
title: How to create approval workflow using Power Automate or Logic Apps
description: Learn how to create approval workflow using Power Automate or Logic Apps
author: nayenama
ms.author: nayenama
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: conceptual
ms.date: 11/13/2020
---

# How to create approval workflow using Power Automate or Logic Apps

This article describes how to create approval workflows and then use approvals to manage entities in the Azure Purview Data Catalog. Workflows are created using Power Automate or Logic Apps and REST APIs. Specifically, this article describes setting up a glossary term approval workflow in Power Automate.

## Prerequisites

* An Azure account with an active subscription if you're using logic apps.

* A Power Automate license if you are using Power Automate.

## Create a glossary approval flow in Power Automate

1. Create a flow, which can be triggered either from your application, by creating items in share-point/one-drive or placing a file in share-point/one drive. You can use the different actions in logic apps/ power automate to build you flow and once approved configure HTTP connector in Power Automate to call Purview to update the glossary term.  An example of a Power Automate flow that is triggered when a file is placed in share-point is shown below.


   :::image type="content" source="media/create-approval-workflow/power-automate-connector.png" alt-text="Screenshot of the power automate":::

2. Once approved configure HTTP connector to update the term in Babylon as shown below. An example of Import glossary API is shown below

   :::image type="content" source="media/create-approval-workflow/http-connector.png" alt-text="Screenshot http connector.":::

    Each parameter in the HTTP connector is explained below:

    1. URI - REST API endpoint you are trying to call
    1. Body - JSON message for the REST API
    1. Authentication - Active Directory OAuth
    1. Tenant - your Tenant ID where the catalog is created
    1. Audience - URL provided in Rest API documentation to authenticate.
    1. Client ID - Client ID of service principal associated to Purview account
    1. Credential Type - Secret
    1. Secret - Client secret of the above client ID.

## Next steps

Follow the [Tutorial: Create and import glossary terms](starter-kit-tutorial-5.md) to learn more.
