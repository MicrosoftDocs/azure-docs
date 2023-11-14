---
title: Troubleshooting your Astro deployment
description: This article provides information about getting support and troubleshooting an Apache Airflow on Astro - An Azure Native ISV Service integration.

ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 11/13/2023
---

# Troubleshooting Astro (Preview) integration with Azure

You can get support for your Astro (Preview) deployment through a **New Support request**. For further assistance, visit the [Astronomer Support](https://support.astronomer.io). In addition, this article includes  troubleshooting for problems you might experience in creating and using an Astro resource.

## Getting support

1. To contact support about an Astro resource, select the resource in the Resource menu.

1. Select the **Support + troubleshooting** in Help menu on the left of the Overview page.

1. Select **Create a support request** and fill out the details.

    :::image type="content" source="media/astronomer-troubleshoot/astronomer-support-request.png" alt-text="Screenshot of a new Astro support ticket.":::

## Troubleshooting

Here are some troubleshooting options to consider:

### Unable to create an Astro resource as not a subscription owner/ contributor

The Astro resource can only be created by users who have _Owner_ or _Contributor_ access on the Azure subscription. Ensure you have the appropriate access before setting up this integration.

### Purchase errors

#### Purchase fails because a valid credit card isn't connected to the Azure subscription or a payment method isn't associated with the subscription

Use a different Azure subscription. Or, add or update the credit card or payment method for the subscription. For more information, see [updating the credit and payment method](../../cost-management-billing/manage/change-credit-card.md).

#### The EA subscription doesn't allow Marketplace purchases

Use a different subscription. Or, check if your EA subscription is enabled for Marketplace purchase. For more information, see [Enable Marketplace purchases](../../cost-management-billing/manage/ea-azure-marketplace.md#enabling-azure-marketplace-purchases). If those options don't solve the problem, contact [Astronomer support](https://support.astronomer.io).

### DeploymentFailed error

If you get a **DeploymentFailed** error, check the status of your Azure subscription. Make sure it isn't suspended and doesn't have any billing issues.

### Resource creation takes long time

If the deployment process takes more than three hours to complete, contact support.

If the deployment fails and the Astro resource has a status of `Failed`, delete the resource. After deletion, try to create the resource again.

### Unable to use Single sign-on

If SSO isn't working for the Astronomer portal, verify you're using the correct Microsoft Entra email. You must also have consented to allow access for the Astronomer Software as a service (SaaS) portal.

> [!NOTE]
> If you are seeing an Admin consent screen along with the User consent during your first-time login using the SSO Url, then please check your [tenant consent settings](/azure/active-directory/manage-apps/configure-user-consent?pivots=portal).

For more information, see the [single sign-on guidance](astronomer-manage.md#single-sign-on).

## Next steps

- Learn about [managing your instance](astronomer-manage.md) of Astro.
- Get started with Apache Airflow on Astro – An Azure Native ISV Service on

    > [!div class="nextstepaction"]
    > [Azure portal](https://ms.portal.azure.com/?Azure_Marketplace_Astronomer_assettypeoptions=%7B%22Astronomer%22%3A%7B%22options%22%3A%22%22%7D%7D#browse/Astronomer.Astro%2Forganizations)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/astronomer1591719760654.astronomer?tab=Overview)
