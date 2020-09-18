---
title: How to enable your Azure VMware Solution resource
description: Learn how to submit a support request to enable your Azure VMware Solution resource. You can also request more nodes in your existing Azure VMware Solution private cloud.
ms.topic: how-to
ms.date: 09/22/2020
---

# How to enable Azure VMware Solution resource
Learn how to submit a support request to enable your Azure VMware Solution resource. You can also request more nodes in your existing Azure VMware Solution private cloud.

## Eligibility criteria

* You'll need an [Azure Enterprise Agreement (EA)](https://docs.microsoft.com/azure/cost-management-billing/manage/ea-portal-agreements) with Microsoft.
* You'll need an Azure account in an Azure subscription.


## Enable Azure VMware Solution resource
Before you create your Azure VMware Solution resource, you'll need to submit a support ticket to have your nodes allocated. Once the support team receives your request, it takes up to five business days to confirm your request and allocate your nodes. If you have an existing Azure VMware Solution private cloud and want more nodes allocated, you'll go through the same process.


1. In your Azure portal, under **Help + Support**, create a **[New support request](https://rc.portal.azure.com/#create/Microsoft.Support)** and provide the following information for the ticket:
   - **Issue type:** Technical
   - **Subscription:** Select your subscription
   - **Service:** All services > Azure VMware Solution
   - **Resource:** General question 
   - **Summary:** Need capacity
   - **Problem type:** Capacity Management Issues
   - **Problem subtype:** Customer Request for Additional Host Quota/Capacity

1. In the **Description** of the support ticket, on the **Details** tab, provide:

   - POC or Production 
   - Region Name
   - Number of nodes
   - Any other details

   >[!NOTE]
   >Azure VMware Solution recommends a minimum of three nodes to spin up your private cloud and for redundancy N+1 nodes. 

1. Select **Review + Create** to submit the request.

   It will take up to five business days for a support representative to confirm your request.

   >[!IMPORTANT] 
   >If you already have an existing Azure VMware Solution, and you are requesting additional nodes, please note that we need five business days to allocate the nodes. 

1. Before you can provision your nodes, make sure that you register the **Microsoft.AVS** resource provider in the Azure portal.  

   ```azurecli-interactive
   az provider register -n Microsoft.AVS --subscription <your subscription ID>
   ```

   For additional ways to register the resource provider, see [Azure resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md).