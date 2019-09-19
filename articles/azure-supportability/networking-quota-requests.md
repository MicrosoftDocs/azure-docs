---
title: Networking limit increase | Microsoft Docs
description: Networking limit increase
author: anavinahar
ms.author: anavin
ms.date: 06/19/2019
ms.topic: article
ms.service: azure
ms.assetid: ce37c848-ddd9-46ab-978e-6a1445728a3b

---

# Networking limit increase

To view your current Networking usage and quota, you can visit the **Usages + Quota** blade in the Azure portal. You can also use usage [CLI](https://docs.microsoft.com//cli/azure/network?view=azure-cli-latest#az-network-list-usages), [PowerShell](https://docs.microsoft.com/powershell/module/azurerm.network/get-azurermnetworkusage?view=azurermps-6.13.0) or the [network usage API](https://docs.microsoft.com/rest/api/virtualnetwork/virtualnetworks/listusage) to view your network usage and limits.

You can request an increase via **Help + Support** blade or the **Usages + Quota** blade in the portal.

## Request Networking quota increase at subscription level using the **Help + Support** blade

Follow the instructions below to create a support request via Azure's 'Help + Support' blade available in the Azure portal. 

1. From https://portal.azure.com, select **Help + Support**.

    ![Help + Support](./media/resource-manager-core-quotas-request/helpsupport.png)
 
2.  Select **New support request**. 

    ![New support request](./media/resource-manager-core-quotas-request/newsupportrequest.png)

3. In the Issue type dropdown, choose **Service and subscription limits (quotas)**.

    ![Issue type dropdown](./media/resource-manager-core-quotas-request/issuetypedropdown.png)

4. Select the subscription that needs an increased quota.

    ![Select subscription newSR](./media/resource-manager-core-quotas-request/select-subscription-sr.png)
   
5. Select **Networking** in **quota type** dropdown. 

    ![Select quota type](./media/networking-quota-request/select-quota-type-network.png)

6. In **Problem Details**, provide additional information to help process your request by clicking **Provide details**.

    ![Provide details](./media/resource-manager-core-quotas-request/provide-details.png)

7. In the **Quota details** panel, select Deployment model, a location and the Resources that you want to request an increase for.

    ![Quota Details DM](./media/networking-quota-request/quota-details-network.png)

8.  Enter the new limits you would like on the subscription. To remove a line, uncheck the Resource from the Resource dropdown or click the discard "x" icon. After entering the desired quota for each Resource, click **Save and Continue** on the Quota details panel to continue with the support request creation.

    ![New Limits](./media/networking-quota-request/network-new-limits.png)


## Request Networking quota increase at subscription level using **Usages + Quota** blade

Follow the instructions below using to create a support request via Azure's 'Usage + quota' blade available in the Azure portal. 

1. From https://portal.azure.com, select **Subscriptions**.

    ![Subscriptions](./media/resource-manager-core-quotas-request/subscriptions.png)

2. Select the subscription that needs an increased quota.

    ![Select subscription](./media/resource-manager-core-quotas-request/select-subscription.png)

3. Select **Usage + quotas**

    ![Select usage and quotas](./media/resource-manager-core-quotas-request/select-usage-quotas.png)

4. In the upper right corner, select **Request increase**.

    ![Request increase](./media/resource-manager-core-quotas-request/request-increase.png)

5. Follow the steps starting with step # 3 from the *Request Networking quota increase at subscription level* section using the **Help + Support** blade section

## About Networking limits

To learn more about Networking limits, see the [Networking section](../azure-subscription-service-limits.md#networking-limits) of the limits page or our Network Limits FAQ