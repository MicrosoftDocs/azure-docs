---
title: How to enable your Azure VMware Solution resource
description: Learn how to submit a support request to enable your Azure VMware Solution resource. You can also request more hosts in your existing Azure VMware Solution private cloud.
ms.topic: how-to
ms.date: 11/12/2020
---

# How to enable Azure VMware Solution resource
Learn how to submit a support request to enable your [Azure VMware Solution](introduction.md) resource. You can also request more hosts in your existing Azure VMware Solution private cloud.

## Eligibility criteria

You'll need an Azure account in an Azure subscription. The Azure subscription must comply with one of the following criteria:

* A subscription under an [Azure Enterprise Agreement (EA)](../cost-management-billing/manage/ea-portal-agreements.md) with Microsoft.
* A Cloud Solution Provider (CSP) managed subscription under an Azure plan.


## Enable Azure VMware Solution for EA customers
Before you create your Azure VMware Solution resource, you'll need to submit a support ticket to have your hosts allocated. Once the support team receives your request, it takes up to five business days to confirm your request and allocate your hosts. If you have an existing Azure VMware Solution private cloud and want more hosts allocated, you'll go through the same process.


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

   For additional ways to register the resource provider, see [Azure resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md).

## Enable Azure VMware Solution for CSP customers 

CSPs must use [Microsoft Partner Center](https://partner.microsoft.com) to enable Azure VMware Solution for their customers. 

   >[!IMPORTANT] 
   >Azure VMware Solution service does not provide a multi-tenancy required. Hosting partners requiring it are not supported. 

1. In **Partner Center**, select **CSP** to access the **Customers** area.

   :::image type="content" source="media/enable-azure-vmware-solution/csp-customers-screen.png" alt-text="Microsoft Partner Center customers area" lightbox="media/enable-azure-vmware-solution/csp-customers-screen.png":::

1. Select your customer and then select **Add products**.

   :::image type="content" source="media/enable-azure-vmware-solution/csp-partner-center.png" alt-text="Microsoft Partner Center" lightbox="media/enable-azure-vmware-solution/csp-partner-center.png":::

1. Select **Azure plan** and then select **Add to cart**. 

1. Review and finish the general set up of the Azure plan subscription for your customer. For more information, see [Microsoft Partner Center documentation](https://docs.microsoft.com/partner-center/azure-plan-manage).

After configuring the Azure plan and the needed vSphere RBAC permissions are in place as a CSP, you'll engage Microsoft to enable the quota for an Azure plan subscription. Access Azure portal from Partner Center using **Admin On Behalf Of** (AOBO) procedure.

1. Sign in to [Partner Center](https://partner.microsoft.com).

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

   It will take up to five business days for a support representative to confirm your request.

   >[!IMPORTANT] 
   >If you already have an existing Azure VMware Solution, and you are requesting additional hosts, please note that we need five business days to allocate the hosts. 

1. If the subscription is managed by the service provider then their administration team must access Azure portal using again **Admin On Behalf Of** (AOBO) procedure from Partner Center. One in Azure portal launch a [Cloud Shell](../cloud-shell/overview.md) instance and register the **Microsoft.AVS** resource provider and proceed with the deployment of the Azure VMware Solution private cloud.  

   ```azurecli-interactive
   az provider register -n Microsoft.AVS --subscription <your subscription ID>
   ```

   For additional ways to register the resource provider, see [Azure resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md).

1. If the subscription is managed directly by the customer the registration of the **Microsoft.AVS** resource provider must be done by an user with enough permissions in the subscription, see [Azure resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md) for more details and ways to register the resource provider. 


## Next steps

After you enable your Azure VMware Solution resource, and you have the proper networking in place, you can [create a private cloud](tutorial-create-private-cloud.md).