---
title: Spot Quota | Microsoft Docs
description: Spot quota requests
author: sowmyavenkat86
ms.author: svenkat
ms.date: 11/19/2019
ms.topic: article
ms.service: azure
ms.assetid: ce37c848-ddd9-46ab-978e-6a1445728a3b

---
# Spot quota: limit increase for all VM Series

Spot VMs provide a different model of Azure usage, trading a lower cost for letting Azure remove a VM as needed for Pay-as-you-go or Reserved VM Instance deployments. Read more about Spot VMs [here](https://docs.microsoft.com/azure/virtual-machine-scale-sets/use-spot).

Resource Manager supports two types of vCPU quotas for virtual machines. **Pay-as-you-go VMs and Reserved VM Instances** use standard quota. **Spot VMs** use Spot quota. 

For **Spot quota** type, Resource Manager vCPU quotas are enforced across all available VM Series as a single regional limit.

Anytime a new Spot VM is to be deployed, the sum of new and existing vCPUs usage for all Spot VM instances must not exceed the approved Spot vCPU quota limit. If the Spot quota is exceeded, the Spot VM deployment will not be allowed. You can request an increase of the Spot vCPUs quota limit from Azure portal. 

Learn more about standard vCPU quotas on the Virtual machine vCPU quotas page and Azure subscription and service limits page. Learn more about increasing the regional vCPU limit for standard quota on this [page](https://docs.microsoft.com/azure/azure-portal/supportability/regional-quota-requests).

You can now request an increase in **Spot quota limits for all VM Series** via **Help + Support** blade or the **Usages + Quota** blade in the portal.

## Request Spot quota limit increase for all VM Series per Subscription using the Help + Support blade

Follow the instructions below to create a support request via Azure's 'Help + Support' blade available in the Azure portal.

You can also **request Quota for multiple regions** through a single support case. Refer to Step 10 below for details. 


1. From https://portal.azure.com, select **Help + Support**.

   ![Help + Support](./media/resource-manager-core-quotas-request/helpsupport.png)
 
2.  Select **New support request**. 

     ![New support request](./media/resource-manager-core-quotas-request/newsupportrequest.png)

3. In the Issue type drop-down, choose **Service and subscription limits (quotas)**.

   ![Issue type drop-down](./media/resource-manager-core-quotas-request/issuetypedropdown.png)

4. Select the subscription that needs an increased quota.

   ![Select subscription newSR](./media/resource-manager-core-quotas-request/select-subscription-sr.png)
   
5. Select **Compute -VM (cores-vCPUs) subscription  limit increases** in **quota type** drop-down. 

   ![Select quota type](./media/resource-manager-core-quotas-request/select-quota-type.png)

6. In **Problem Details**, provide additional information to help process your request by clicking **Provide details**.

   ![Provide details](./media/resource-manager-core-quotas-request/provide-details.png)
   
7.	In the **Quota details*** panel, select **Deployment model** and select a **location**.

![Provide details](./media/resource-manager-core-quotas-request/3-7.png)

8. For the selected location, select **Type** value as **‘Spot’**. You can request both Standard and Spot quota types from a single support case through multi-selection support on the **Type** field. Learn more about **increasing Standard quota per VM Series** on this [page](https://docs.microsoft.com/azure/azure-portal/supportability/per-vm-quota-requests).

![Provide details](./media/resource-manager-core-quotas-request/3-8.png)

9.	Enter the new limit you would like on the subscription. 
 
 ![Provide details](./media/resource-manager-core-quotas-request/3-9.png)

10.	To request Quota for more than one location you can check on another location from the drop-down and select appropriate VM Type. You can then enter the new limits you would like.

![Provide details](./media/resource-manager-core-quotas-request/3-10.png)

11. After entering the desired quota, click **Save and Continue** on the Quota details panel to continue with the support request creation.

## Request Spot quota limit increase for all VM Series per Subscription using Usages + Quota blade

Follow the instructions below using to create a support request via Azure's 'Usage + quota' blade available in the Azure portal.

You can also **request Quota for multiple regions** through a single support case. Refer to Step 9 below for details. 

1.	From https://portal.azure.com, select **Subscriptions**.

 ![Subscriptions](./media/resource-manager-core-quotas-request/subscriptions.png)

2.	Select the subscription that needs an increased quota.

 ![Select subscription](./media/resource-manager-core-quotas-request/select-subscription.png)

3.	Select **Usage + quotas**.

 ![Select usage and quotas](./media/resource-manager-core-quotas-request/select-usage-quotas.png)

4.	In the upper right corner, select **Request increase.**

   ![Request increase](./media/resource-manager-core-quotas-request/request-increase.png)

5.	Select **Compute-VM (cores-vCPUs) subscription limit increases** as the quote type.

  ![Fill in form](./media/resource-manager-core-quotas-request/select-quota-type.png)

6.	In the **Quota details** panel, select Deployment model and select a location.

  ![Fill in form](./media/resource-manager-core-quotas-request/3-2-6.png)
 
7.	For the selected location, select **Type** value as **‘Spot’.** You can request both Standard and Spot quota types from a single support case through multi-selection support on the **Type** field. Learn more about **increasing standard quota per VM Series** on this [page](https://docs.microsoft.com/azure/azure-portal/supportability/per-vm-quota-requests).

  ![Fill in form](./media/resource-manager-core-quotas-request/3-2-7.png)
 
8.	Enter the new limit you would like on the subscription.

  ![Fill in form](./media/resource-manager-core-quotas-request/3-2-8.png)
 
9.	To request Quota for more than one location you can check on another **location** from the drop-down and select appropriate VM Type. You can then enter the new limits you would like.

  ![Fill in form](./media/resource-manager-core-quotas-request/3-2-9.png)
 
10. After entering the desired quota, click **Save and Continue** on the Quota details panel to continue with the support request creation.


