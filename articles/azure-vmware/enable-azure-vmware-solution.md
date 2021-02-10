---
title: How to enable your Azure VMware Solution resource
description: In this how-to, you'll learn how to request hosts (quota increase) and enable your Azure VMware Solution resource. You can also request more hosts in your existing Azure VMware Solution private cloud.
ms.topic: how-to
ms.custom: contperf-fy21q2
ms.date: 02/10/2021
---

# How to enable Azure VMware Solution resource

title might be: Request hosts and enable the Azure VMware Solution resource

In this how-to, you'll learn how to request hosts (quota increase) and enable your [Azure VMware Solution](introduction.md) resource. Before you can enable your Azure VMware Solution resource, you'll need to submit a support ticket to have your hosts allocated. If you have an existing Azure VMware Solution private cloud and want more hosts allocated, you'll follow the same process.

>[!IMPORTANT]
>It can take a few days to allocate the hosts depending on the number requested.  So request what is needed for provisioning so you don't need to request a quota increase as often.

## Eligibility criteria

You'll need an Azure account in an Azure subscription. The Azure subscription must follow with one of the following criteria:

* A subscription under an [Azure Enterprise Agreement (EA)](../cost-management-billing/manage/ea-portal-agreements.md) with Microsoft.
* A Cloud Solution Provider (CSP) managed subscription under an existing CSP Azure offers contract or an Azure plan.


## Enable Azure VMware Solution for EA customers

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
   - Number of hosts
   - Any other details

   >[!NOTE]
   >Azure VMware Solution recommends a minimum of three hosts to spin up your private cloud and for redundancy N+1 hosts. 

1. Select **Review + Create** to submit the request.

   It will take up to five business days for a support representative to confirm your request.

   >[!IMPORTANT] 
   >If you already have an existing Azure VMware Solution, and you are requesting additional hosts, please note that we need five business days to allocate the hosts. 

1. Before you can provision your hosts, make sure that you register the **Microsoft.AVS** resource provider in the Azure portal.  

   ```azurecli-interactive
   az provider register -n Microsoft.AVS --subscription <your subscription ID>
   ```



   For more ways to register the resource provider, see [Azure resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md).

## Enable Azure VMware Solution for CSP customers 

CSPs must use [Microsoft Partner Center](https://partner.microsoft.com) to enable Azure VMware Solution for their customers. This article uses [CSP Azure plan](/partner-center/azure-plan-lp) as an example to illustrate the purchase procedure for partners.

   >[!IMPORTANT] 
   >Azure VMware Solution service does not provide a multi-tenancy required. Hosting partners requiring it are not supported. 

1. In **Partner Center**, select **CSP** to access the **Customers** area.

   :::image type="content" source="media/enable-azure-vmware-solution/csp-customers-screen.png" alt-text="Microsoft Partner Center customers area" lightbox="media/enable-azure-vmware-solution/csp-customers-screen.png":::

1. Select your customer and then select **Add products**.

   :::image type="content" source="media/enable-azure-vmware-solution/csp-partner-center.png" alt-text="Microsoft Partner Center" lightbox="media/enable-azure-vmware-solution/csp-partner-center.png":::

1. Select **Azure plan** and then select **Add to cart**. 

1. Review and finish the general setup of the Azure plan subscription for your customer. For more information, see [Microsoft Partner Center documentation](/partner-center/azure-plan-manage).

After configuring the Azure plan and the needed [Azure RBAC permissions](/partner-center/azure-plan-manage) are in place for the subscription, you'll engage Microsoft to enable the quota for an Azure plan subscription. 

1. Access Azure portal from [Microsoft Partner Center](https://partner.microsoft.com) using **Admin On Behalf Of** (AOBO) procedure.

1. Select **CSP** to access the **Customers** area.

1. Expand customer details and select **Microsoft Azure Management Portal**.

1. In Azure portal, under **Help + Support**, create a **[New support request](https://rc.portal.azure.com/#create/Microsoft.Support)** and provide the following information for the ticket:
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
   - Number of hosts
   - Any other details
   - Is intended to host multiple customers?

   >[!NOTE]
   >Azure VMware Solution recommends a minimum of three hosts to spin up your private cloud and for redundancy N+1 hosts. 

1. Select **Review + Create** to submit the request.

1. For subscriptions managed by the service provider, their administration team must access Azure portal using the **Admin On Behalf Of** (AOBO) procedure from Partner Center. 

   1. In the Azure portal, launch a [Cloud Shell](../cloud-shell/overview.md) instance and register the **Microsoft.AVS** resource provider.     

   ```azurecli-interactive
   az provider register -n Microsoft.AVS --subscription <your subscription ID>
   ```

   For more ways to register the resource provider, see [Azure resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md).

   1. Continue to deploy the Azure VMware Solution private cloud.

1. For subscriptions managed directly by the customer, someone with enough permissions must register the resource provider. For more ways to register the resource provider, see [Azure resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md). 

## Register the resource provider

[!INCLUDE [register-resource-provider-steps](includes/register-resource-provider-steps.md)]

## Next steps

After enabling the resource, and the proper networking in place, you can [create a private cloud](tutorial-create-private-cloud.md).
