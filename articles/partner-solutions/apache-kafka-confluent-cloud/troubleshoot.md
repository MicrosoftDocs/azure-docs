---
title: Troubleshooting Apache Kafka for Confluent Cloud
description: This article provides information about troubleshooting and frequently asked questions (FAQ) for Confluent Cloud on Azure.
ms.topic: conceptual
ms.date: 02/18/2021
author: flang-msft
ms.author: franlanglois
---

# Troubleshooting Apache Kafka on Confluent Cloud solutions

This document contains information about troubleshooting your solutions that use Apache Kafka on Confluent Cloud.

If you don't find an answer or can't resolve a problem, [create a request through the Azure portal](get-support.md) or contact [Confluent support](https://support.confluent.io).

## Can't find offer in the Marketplace

To find the offer in the Azure Marketplace, use the following steps:

1. In the [Azure portal](https://portal.azure.com), select **Create a resource**.
1. Search for _Apache Kafka on Confluent Cloud_.
1. Select the application tile.

If the offer isn't displayed, contact [Confluent support](https://support.confluent.io). Your Azure Active Directory tenant ID must be on the list of allowed tenants. To learn how to find your tenant ID, see [How to find your Azure Active Directory tenant ID](/azure/active-directory-b2c/tenant-management-read-tenant-name).

## Purchase errors

* Purchase fails because a valid credit card isn't connected to the Azure subscription or a payment method isn't associated with the subscription.

  Use a different Azure subscription. Or, add or update the credit card or payment method for the subscription. For more information, see [updating the credit and payment method](../../cost-management-billing/manage/change-credit-card.md).

* The EA subscription doesn't allow Marketplace purchases.

  Use a different subscription. Or, check if your EA subscription is enabled for Marketplace purchase. For more information, see [Enable Marketplace purchases](../../cost-management-billing/manage/ea-azure-marketplace.md#enabling-azure-marketplace-purchases). If those options don't solve the problem, contact [Confluent support](https://support.confluent.io).

## Conflict error

If you've previously registered for Confluent Cloud, you must use a new email address to create another Confluent Cloud organization resource. When using a previously registered email address, you'll get a **Conflict** error. Re-register but this time with a new email address.

## DeploymentFailed error

If you get a **DeploymentFailed** error, check the status of your Azure subscription. Make sure it isn't suspended and doesn't have any billing issues.

## Resource isn't displayed

If the **Overview** or **Delete** blades for Confluent Cloud aren't displayed in portal, try refreshing the page. This error could be an intermittent issue with the portal. If that doesn't work, contact [Confluent support](https://support.confluent.io).

If the Confluent Cloud resource isn't found in the Azure **All resources** list, contact [Confluent support](https://support.confluent.io).

## Resource creation takes long time

If the deployment process takes more than three hours to complete, contact support.

If the deployment fails and Confluent Cloud resource has a status of `Failed`, delete the resource. After deletion, try again to create the resource.

## Offer plan doesn't load

This error could be an intermittent problem with the Azure portal. Try to deploy the offer again.

## Unable to delete

If you're unable to delete Confluent resources, verify you have permissions to delete the resource. You must be allowed to take Microsoft.Confluent/*/Delete actions. For information about viewing permissions, see [List Azure role assignments using the Azure portal](../../role-based-access-control/role-assignments-list-portal.md).

If you have the correct permissions but still can't delete the resource, contact [Confluent support](https://support.confluent.io). This condition might be related to Confluent's retention policy. Confluent support can delete the organization and email address for you.

## Unable to use single sign-on

If SSO isn't working for the Confluent Cloud SaaS portal, verify you're using the correct Azure Active Directory email. You must also have consented to allow access for the Confluent Cloud software as a service (SaaS) portal. For more information, see the [single sign-on guidance](manage.md#single-sign-on).

If the problem persists, contact [Confluent support](https://support.confluent.io).

## Next steps

- Learn about [managing your instance](manage.md) of Apache Kafka on Confluent Cloud.
- Get started with Apache Kafka on Confluent Cloud - Azure Native ISV Service on

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Confluent%2Forganizations)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/confluentinc.confluent-cloud-azure-prod?tab=Overview)
