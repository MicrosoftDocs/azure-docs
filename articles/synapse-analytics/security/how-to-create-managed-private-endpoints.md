---
title: Create a Managed private endpoint to connect to your data source results. Include the brand.
description: This article will teach you how to create a Managed private endpoint to your data sources from an Azure Synapse workspace.  
author: RonyMSFT 
ms.service: synapse-analytics 
ms.topic: how-to 
ms.date: 03/15/2020 
ms.author: ronytho
ms.reviewer: jrasnick
---

# Create a Managed private endpoint to your data source

This article will teach you how to create a Managed private endpoint to your data source in Azure. See [Managed private endpoints](./synapse-workspace-managed-private-endpoints.md) to learn more.

## Step 1: Open your Azure Synapse workspace in Azure portal
You can create a Managed private endpoint to your data source from Azure Synapse Studio. Select the **Overview** tab in Azure portal and select **Launch Synapse Studio**.
![Launch Azure Synapse Studio](../media/security/managed-private-endpoint-1.png)

## Step 2: Navigate to the Managed Virtual Networks tab in Synapse Studio

In Azure Synapse Studio, select the **Manage** tab from the left navigation. Select **Managed Virtual Networks** and then select **+ New**.
![Create a new Managed private endpoint](../media/security/managed-private-endpoint-2.png)

## Step 3: Select the data source type
Select the data source type. In this case, the target data source is an ADLS gen2 account. Select **Continue**.
![Select a target data source type](../media/security/managed-private-endpoint-3.png)

## Step 4: Enter information about the data source
In the next window, enter information about the data source. In this example, we are creating a Managed private endpoint to an ADLS gen2 account. Enter a **Name** for the Managed private endpoint. Provide an **Azure subscription** and a **Storage account name**. Select **Create**.
![Enter target data source details](../media/security/managed-private-endpoint-4.png)

## Step 5: Verify that your Managed private endpoint was successfully created
After your request is submitted, you will see the status of your request. Verify that your Managed private endpoint was created successfully by checking its *Provisioning State*. You can see that the Managed private endpoint to the ADLS gen2 account was successfully created. You can also see that the *Approval State* is *Pending*. The owner of the resource to which you are creating a Managed private endpoint must approve or deny the request before the private link is established or not. 

![Managed private endpoint creation request status](../media/security/managed-private-endpoint-5.png)


## Next steps

Learn more about [Managed private endpoints](./synapse-workspace-managed-private-endpoints.md)