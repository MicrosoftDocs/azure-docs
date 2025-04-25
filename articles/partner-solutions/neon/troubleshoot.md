---
title: Troubleshoot Neon Serverless Postgres (Preview) 
description: This article provides information about getting support and troubleshooting Neon Serverless Postgres (Preview).
author: ProfessorKendrick
ms.topic: overview
ms.custom:

ms.date: 11/22/2024
---

# Troubleshoot Neon Serverless Postgres (Preview)

You can get support for your Neon Serverless Postgres (Preview) deployment through a New Support request. For further assistance, visit [Neon Support]. In addition, this article includes troubleshooting for problems you might experience in creating and using a Neon resource. 

## Getting support 

To contact support about Neon resource, select the resource in the Resource menu. 

   :::image type="content" source="media/troubleshoot/troubleshoot.png" alt-text="Screenshot from the Azure portal showing how to open a new support request.":::

Select **Support + troubleshooting** > **New Support Request** in the left-menu in the Azure portal.

Select **here** to create a support request. You're redirected to the partner portal where you can raise a support ticket.

## Unable to create a Neon resource as not a subscription owner/ contributor
Only users with Owner or Contributor access on the Azure subscription can create Neon resources. Ensure you have the appropriate access before setting up this integration.

## Marketplace purchase errors

### The Microsoft.SaaS resource provider isn't registered on the Azure subscription.
You must make sure your Azure subscription is registered for the resource provider before you use it. Learn more about [resource provider registration](../../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider) and [resolving errors on resource provider registration](../../azure-resource-manager/troubleshooting/error-register-resource-provider.md).

### Plan can't be purchased on a free subscription.
You can't make marketplace purchases on a free Azure subscription. Refer to the [Azure free account FAQ](https://azure.microsoft.com/pricing/purchase-options/azure-account). For more information, see [purchase SaaS offer in the Azure portal](/marketplace/purchase-saas-offer-in-azure-portal).

### Purchase failed because we couldn't find a valid payment method associated with your Azure subscription.
Use a different Azure subscription or add or update current credit card or payment method information for this subscription. For more information, see [purchase SaaS offer in the Azure portal](/marketplace/purchase-saas-offer-in-azure-portal).

### The Publisher doesn't make available Offer, Plan in your Subscription/Azure account’s region.
The offer or the specific plan isn't available to the billing account market that is connected to the Azure Subscription.

### Enrollment for Azure Marketplace is set to Free/BYOL SKUs only, purchase for Azure product isn't allowed. Contact your enrollment administrator.
Enterprise administrators can disable or enable Azure Marketplace purchases for all Azure subscriptions under their enrollment. For more information, see Azure Marketplace - Microsoft Cost Management[Enabling Azure Marketplace purchases](../../cost-management-billing/manage/ea-azure-marketplace.md#enabling-azure-marketplace-purchases). More information on different listing options is present in Introduction to listing options.

### Marketplace isn't enabled for the Azure subscription.
Enterprise administrators can disable or enable Azure Marketplace purchases for all Azure subscriptions under their enrollment. Refer to Azure Marketplace - Microsoft Cost Management.

### Plan by publisher isn't available to you for purchase due to private marketplace settings made by your tenant’s IT administrator.
Customer uses private marketplace to limit the access of its organization to specific offers and plans. The specific offer or the plan wasn't set up to be available in the tenant's private marketplace. Contact your tenant’s IT administrator.

### The EA subscription doesn't allow Marketplace purchases.
Use a different subscription or check if your EA subscription is enabled for Marketplace purchase. For more information, see Enable Marketplace purchases.
If those options don't solve the problem, contact [Neon support]. 

### Deployment Failed error
If you get a Deployment Failed error, check the status of your Azure subscription. Make sure it isn't suspended and doesn't have any billing issues.

### Resource creation takes a long time
If the deployment process takes more than three hours to complete, contact [Neon support](https://neon.tech/docs/introduction/support).
If the deployment fails and the Neon resource has a status of Failed, delete the resource. After deletion, try to create the resource again

### Other Troubleshooting resources

### Errors when connecting to your Neon database
If you encounter issues when connecting to your Neon database, refer to the [Connection errors section in the Neon documentation](https://neon.tech/docs/connect/connection-errors) for potential solutions.

### Database connection latency and timeouts
If you experience latency or timeouts while connecting to your Neon database, consult the Connection latency and timeouts section in the Neon documentation for strategies and best practices.
