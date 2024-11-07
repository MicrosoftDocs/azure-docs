---
title: Troubleshooting Neon Serverless Postgres - An Azure Native ISV Service
description: Learn how to troubleshoot Neon Serverless Postgres - An Azure Native ISV Service.
author: ProfessorKendrick
ms.topic: overview
ms.custom:

ms.date: 11/06/2024
---

# Troubleshooting Neon Serverless Postgres

## Unable to create a Neon resource as not a subscription owner/ contributor
Neon resources can only be created by users who have Owner or Contributor access on the Azure subscription. Ensure you have the appropriate access before setting up this integration.

## Marketplace purchase errors

### The Microsoft.SaaS RP is not registered on the Azure subscription.
Before you use a resource provider, you must make sure your Azure subscription is registered for the resource provider. Learn more about Resource provider registration and resolving errors on RP registration.

### Plan cannot be purchased on a free subscription, please upgrade your account.
You can't make marketplace purchases on a free Azure subscription. Refer to the Azure free Account FAQ. For more information, see purchase SaaS offer in the Azure portal.

### Purchase has failed because we couldn't find a valid payment method associated with your Azure subscription.
Use a different Azure subscription or add or update current credit card or payment method information for this subscription. For more information, see purchase SaaS offer in the Azure portal.

### The Publisher does not make available Offer, Plan in your Subscription/Azure account’s region.
The offer or the specific plan isn't available to the billing account market that is connected to the Azure Subscription.

### Enrollment for Azure Marketplace is set to Free/BYOL SKUs only, purchase for Azure product is not allowed. Please contact your enrollment administrator to change EA settings.
Enterprise administrators can disable or enable Azure Marketplace purchases for all Azure subscriptions under their enrollment. For more information, see Azure Marketplace - Microsoft Cost Management. More information on different listing options is present in Introduction to listing options

### Marketplace is not enabled for the Azure subscription.
Enterprise administrators can disable or enable Azure Marketplace purchases for all Azure subscriptions under their enrollment. Refer Azure Marketplace - Microsoft Cost Management.

### Plan by publisher is not available to you for purchase due to private marketplace settings made by your tenant’s IT administrator.
Customer uses private marketplace to limit the access of its organization to specific offers and plans. The specific offer or the plan weren't set up to be available in the tenant's private marketplace. Contact your tenant’s IT administrator.

### The EA subscription doesn't allow Marketplace purchases.
Use a different subscription or check if your EA subscription is enabled for Marketplace purchase. For more information, see Enable Marketplace purchases.
If those options don't solve the problem, contact [Neon support]. 

## Deployment Failed error
If you get a Deployment Failed error, check the status of your Azure subscription. Make sure it isn't suspended and doesn't have any billing issues.

## Resource creation takes a long time
If the deployment process takes more than three hours to complete, contact [Neon support].
If the deployment fails and the Neon resource has a status of Failed, delete the resource. After deletion, try to create the resource again

## Other Troubleshooting resources

### Errors when connecting to your Neon database
If you encounter issues when connecting to your Neon database, refer to the Connection errors section in the Neon documentation for potential solutions.

### Database connection latency and timeouts
If you experience latency or timeouts while connecting to your Neon database, consult the Connection latency and timeouts section in the Neon documentation for strategies and best practices.
