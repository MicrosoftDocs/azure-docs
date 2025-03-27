---
title: Request host quota for Azure VMware Solution
description: Learn how to request host quota/capacity for Azure VMware Solution. You can also request more hosts in an existing Azure VMware Solution private cloud.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 12/19/2023
#Customer intent: As an Azure service admin, I want to request hosts for either a new private cloud deployment or I want to have more hosts allocated in an existing private cloud.
---

# Request Host Quota for Azure VMware Solution

In this article, learn how to request host quota/capacity for [Azure VMware Solution](introduction.md). You learn how to submit a support ticket to have your hosts allocated whether it's for a new deployment or an existing one. 

If you have an existing Azure VMware Solution private cloud and want more hosts allocated, follow the same process.

> [!IMPORTANT]
> It can take up to five business days to allocate the hosts, depending on the number requested. Therefore, request the amount needed for provisioning to avoid delays associated with making host increase requests.
> 
> **NEW** A new process for requesting host quota, except for our Azure Government regions.  Instructions for each scenario are provided.

## Eligibility criteria

You need an Azure account in an Azure subscription that adheres to one of the following criteria:

- A subscription under an [Azure Enterprise Agreement (EA)](../cost-management-billing/manage/ea-portal-agreements.md) with Microsoft.
- A Cloud Solution Provider (CSP) managed subscription under an existing CSP Azure offers contract or an Azure plan.
- A [Microsoft Customer Agreement (MCA)](../cost-management-billing/understand/mca-overview.md) with Microsoft.

## Request host quota for EA and MCA customers

1. In your Azure portal, under **Help + Support**, create a [Support Request](https://portal.azure.com/#create/Microsoft.Support) and provide the following information:
   - **Issue type:** Service and subscription limits (quotas)
   - **Subscription:** Select your subscription
   - **Quota Type:** Azure VMware Solution
1. Click on **Next** to "Additional Details":
   - **Request Details:** Click on Enter details, which open a side pane. Provide details based on your needs.
   - **Region:** Update with your Azure Preferred Region.
   - **SKU:** Update with your preferred SKU
   - **Number of nodes:** Update the total number of hosts for that sku to reflect the new absolute value.  For instance, if you currently have three hosts and require 3 more, the updated total should be 6. 
   - **File Upload:** Leave blank
   - **Allow collection of advanced diagnostic information?** Yes (recommended)
   - **Support plan:** Auto populated based on your plan
1. Select **Save and Continue** to submit the request.


> [!NOTE]
> - Azure VMware Solution requires a minimum of three hosts and recommends redundancy of N+1 hosts.
> - Any unused quota expires after 30 days. A new request needs to be submitted for more quota.
> - **NEW** If requesting quota to use Portable [VMware Cloud Foundation (VCF)](/azure/azure-vmware/vmware-cloud-foundations-license-portability) pricing, add the following statement as is, by replacing (N) with the Number of VCF cores you purchased from Broadcom for license portability to Azure VMware Solution. **"I acknowledge that I have procured portable VCF license from Broadcom for (N) cores to use with Azure VMware Solution."**  
> - **VCF Disclaimer** Quota allocation is processed upon request.  If you didn't submit the VCF license through registeravsvcfbyol@microsoft.com and provision the hosts, you're subject to Azure VMware Solution pay-as-you-go (PayGo) pricing.
> - **NEW** If you have an Availability Zone requirement for integrating with other Azure services; for example, Azure NetApp Files, create a technical **[New support request](https://portal.azure.com/#create/Microsoft.Support)** once the quota is allocated and before provisioning.
>   - Summary: Need a specific availability zone
>   - Problem type:  AVS Quota request 

## Request host quota for CSP customers 

CSPs must use [Microsoft Partner Center](https://partner.microsoft.com) to enable Azure VMware Solution for their customers. This article uses [CSP Azure plan](/partner-center/azure-plan-lp) as an example to illustrate the purchase procedure for partners.

Access the Azure portal using the **Admin On Behalf Of (AOBO)** procedure from Partner Center.

> [!IMPORTANT]
> Azure VMware Solution service does not support multi-tenancy support. Hosting partners requiring this feature are not supported. 

1. Configure the CSP Azure plan:

   1. In **Partner Center**, select **CSP** to access the **Customers** area.
   
      :::image type="content" source="media/pre-deployment/csp-customers-screen.png" alt-text="Screenshot shows the Microsoft Partner Center customer area." lightbox="media/pre-deployment/csp-customers-screen.png":::
   
   1. Select your customer and then select **Add products**.
   
      :::image type="content" source="media/pre-deployment/csp-partner-center.png" alt-text="Screenshot shows Azure plan selected in the Microsoft Partner Center." lightbox="media/pre-deployment/csp-partner-center.png":::
   
   1. Select **Azure plan** and then select **Add to cart**. 
      
   1. Review and finish the general setup of the Azure plan subscription for your customer. For more information, see [Microsoft Partner Center documentation](/partner-center/azure-plan-manage).
      
1. After you configure the Azure plan and you have the needed [Azure RBAC permissions](/partner-center/azure-plan-manage) in place for the subscription, you'll request the quota for your Azure plan subscription. 

   1. Access Azure portal from [Microsoft Partner Center](https://partner.microsoft.com) using the **Admin On Behalf Of (AOBO)** procedure.
   
   1. Select **CSP** to access the **Customers** area.
   
   1. Expand customer details and select **Microsoft Azure Management Portal**.
1. In the Azure portal, under **Help + Support**, create a **[New support request](https://portal.azure.com/#create/Microsoft.Support)** and provide the following information:
   - **Issue type:** Service and subscription limits (quotas)
   - **Subscription:** Select your subscription
   - **Quota Type:** Azure VMware Solution

1. Click on **Next** to "Additional Details":
   - **Request Details:** Click on Enter details, which open a side pane. Provide details based on your needs.
   - **Region:** Update with your Azure Preferred Region.
   - **SKU:** Update with your preferred SKU
   - **Number of nodes:** Update the total number of hosts for that sku to reflect the new absolute value.  For instance, if you currently have three hosts and require 3 more, the updated total should be 6.
   - **File Upload:** Leave blank
   - **Allow collection of advanced diagnostic information?** Yes (recommended)
   - **Support plan:** Auto populated based on your plan

1. Select **Save and Continue** to submit the request.

> [!NOTE]
> - Azure VMware Solution requires a minimum of three hosts and recommends redundancy of N+1 hosts.
> - Any unused quota expires after 30 days. A new request needs to be submitted for more quota.
> - **NEW** If requesting quota to use Portable [VMware Cloud Foundation (VCF)](/azure/azure-vmware/vmware-cloud-foundations-license-portability) pricing, add the following statement as is, by replacing (N) with the Number of VCF cores you purchased from Broadcom for license portability to Azure VMware Solution. **"I acknowledge that I have procured portable VCF license from Broadcom for (N) cores to use with Azure VMware Solution."**  
> - **VCF Disclaimer** Quota allocation is processed upon request.  If you didn't submit the VCF license through registeravsvcfbyol@microsoft.com and provision the hosts, you're subject to Azure VMware Solution pay-as-you-go (PayGo) pricing.
> - **NEW** If you have an Availability Zone requirement for integrating with other Azure services; for example, Azure NetApp Files, create a technical **[New support request](https://portal.azure.com/#create/Microsoft.Support)** once the quota is allocated and before provisioning.
>   - Summary: Need a specific availability zone
>   - Problem type:  AVS Quota request




## Request host quota for Azure Government Customers
In the Azure portal, under **Help + Support**, create a [New support request](https://portal.azure.com/#create/Microsoft.Support) and provide the following information:
- **Issue type:** Technical
 - **Subscription:** Select your subscription
 - **Service:** All services > Azure VMware Solution  
 - **Resource:** General question
 - **Summary:** Need capacity
 - **Problem type:** AVS Quota request
   
## Next steps

Before deploying Azure VMware Solution, you must first [register the resource provider](deploy-azure-vmware-solution.md#register-the-microsoftavs-resource-provider) with your subscription to enable the service.   
