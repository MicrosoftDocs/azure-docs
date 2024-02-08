---
title: Create an Azure Programmable Connectivity Gateway
description: Azure Programmable Connectivity is a cloud service that provides a simple and uniform way for developers to access programmable networks, regardless of substrate or location.
author: anzaman
ms.author: alzam
ms.service: azure-operator-nexus
ms.topic: overview 
ms.date: 01/08/2024
ms.custom: template-overview
---

# Quickstart: Create an APC Gateway
 
In this quickstart, you learn how to create an Azure Programmable Connectivity (APC) gateway and subscribe to API plans in the Azure Portal.

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

### Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com)

### Create a new APC gateway

1. In the Azure portal, Search for **APC Gateways** and then select **Create**.
   :::image type="content" source="media/search.jpg" alt-text="Screenshot of search box":::
1. Select the **Subscription**, **Resource Group** and **Region** for the gateway.
   :::image type="content" source="media/create.jpg" alt-text="Screenshot of create gateway":::
1. Provide a **Name** for the gateway and click **Next**

### Select APIs

1. Click on the API that you want to use
1. Select the country
1. **Add** the plans you want to subscribe to
   :::image type="content" source="media/select.jpg" alt-text="Screenshot of select APIs page":::
1. Click **Done**
1. Click **Next**

### Provide application details

In order to use the operators API, you must provide additional details which will be shared with the operator.

1. Fill out the Application name, Application description, Legal entity, Tax number and the provacy manger's email address in the text boxes.
   :::image type="content" source="media/appdetails.jpg" alt-text="Screenshot of application details page":::
1. Click **Next**

### Agree to operators' terms & conditions

On the **Terms and Conditions** page

1. Click **Awaiting input** and then **I Agree**
   :::image type="content" source="media/terms.jpg" alt-text="Screenshot of the terms and conditions page":::
1. Repeat the above step for each line
1. Click **Next**

### Verify details and create

Once you see the **Validation passed** message, click **Create**
   :::image type="content" source="media/verifyandcreate.jpg" alt-text="Screenshot of verify and create page":::
