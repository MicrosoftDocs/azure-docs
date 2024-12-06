---
title: Create an Azure Programmable Connectivity Gateway
description: In this guide, learn how to create an APC Gateway.
author: anzaman
ms.author: alzam
ms.service: azure-programmable-connectivity
ms.topic: overview 
ms.date: 07/22/2024
ms.custom: template-overview
---

# Quickstart: Create an APC Gateway
 
In this quickstart, you learn how to create an Azure Programmable Connectivity (APC) gateway and subscribe to API plans in the Azure portal.

> [!NOTE]
> Deleting and modifying existing APC Gateways is not supported during the preview. Please open a support ticket in the Azure Portal if you need to delete an APC Gateway.
>

> [!NOTE]
> Moving an APC Gateway to a different resource group is not supported. If you need to move an APC Gateway to a different resource group, you must delete it and recreate it.
>

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Register your Azure subscription with the provider `Microsoft.ProgrammableConnectivity`, following [these instructions](/azure/azure-resource-manager/management/resource-providers-and-types)

### Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com).

### Create a new APC Gateway

1. In the Azure portal, Search for **APC Gateways** and then select **Create**. 
   
   :::image type="content" source="media/search.jpg" alt-text="Screenshot of Azure portal showing the search box." lightbox="media/search.jpg":::  
     
1. Select the **Subscription**, **Resource Group**, and **Region** for the gateway.  
  
   :::image type="content" source="media/create.jpg" alt-text="Screenshot of the create gateway page in Azure portal." lightbox="media/create.jpg":::  
     
1. Provide a **Name** for the gateway and click **Next**.

### Select APIs

1. Click on the API that you want to use.
1. Select the country/region.
1. **Add** the plans you want to subscribe to.  
  
   :::image type="content" source="media/select.jpg" alt-text="Screenshot of the select APIs page in the Azure portal." lightbox="media/select.jpg":::  
     
1. Click **Done**.
1. Click **Next**.

### Provide application details

In order to use the operators' APIs, you must provide extra details, which are shared with the operators.

1. Fill out the Application name, Application description, Legal entity, Tax number, and the privacy manager's email address in the text boxes.  
  
   :::image type="content" source="media/app-details.jpg" alt-text="Screenshot of the application details page in the Azure portal." lightbox="media/app-details.jpg":::  
     
1. Click **Next**.

### Agree to operators' terms and conditions

On the **Terms and Conditions** page.

1. Click **Awaiting input** and then **I Agree**.  
  
   :::image type="content" source="media/terms.jpg" alt-text="Screenshot of the terms and conditions page in the Azure portal." lightbox="media/terms.jpg":::  
     
1. Repeat for each line.
1. Click **Next**.

### Verify details and create

Once you see the **Validation passed** message, click **Create**.  
  
   :::image type="content" source="media/verify-create.jpg" alt-text="Screenshot of the verify and create page in Azure portal." lightbox="media/verify-create.jpg":::

### Wait for approval

On clicking **Create** your APC Gateway and one or more Operator API Connections are created. Each Operator API Connection represents a connection between your APC Gateway and a particular API at a particular operator.

Operator API Connections don't finish deploying until the relevant operator has approved your onboarding request. For some operators approval is a manual process, and so may take several days.

After an operator approves your onboarding request for an Operator API Connection, you are able to use APC with that Operator API Connection. This is the case even if your APC Gateway has other Operator API Connections that are not yet approved, with that operator or with another operator.
