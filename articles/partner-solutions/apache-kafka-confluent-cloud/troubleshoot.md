---
title: Troubleshoot Apache Kafka & Apache Flink on Confluent Cloud
description: Learn how to troubleshoot and get answers to frequently asked questions for Apache Kafka & Apache Flink on Confluent Cloud in Azure Native Integrations.
ms.topic: conceptual
ms.date: 1/31/2024
# customerIntent: As a developer I want to troubleshoot an error or get an answer to questions I have about using Apache Kafka & Apache Flink on Confluent Cloud.
---

# Troubleshoot Apache Kafka & Apache Flink on Confluent Cloud solutions

This article describes how to troubleshoot your solutions that use Apache Kafka & Apache Flink on Confluent Cloud, an Azure Native Integrations service.

If you don't find an answer or can't fix a problem, [create a request through the Azure portal](get-support.md) or contact [Confluent support](https://support.confluent.io).

## Can't find the offer in Azure Marketplace

To find the offer in Azure Marketplace:

1. In the [Azure portal](https://portal.azure.com), select **Create a resource**.
1. Search for **Apache Kafka & Apache Flink on Confluent Cloud**.
1. Select the application tile.

If the offer isn't visible, contact [Confluent support](https://support.confluent.io). Your Microsoft Entra tenant ID must be on the list of allowed tenants. Learn [how to find your Microsoft Entra tenant ID](/azure/active-directory-b2c/tenant-management-read-tenant-name).

## Purchase errors

[!INCLUDE [marketplace-purchase-errors](../includes/marketplace-purchase-errors.md)]

If these options don't solve the problem, contact [Confluent support](https://support.confluent.io).

## Conflict error

If you previously registered for Confluent Cloud, you must use a different email address to create another Confluent Cloud organization resource. If you use a previously registered email address, a **Conflict** error message appears. Register again, but use a different email address.

## DeploymentFailed error

If you see a **DeploymentFailed** error message, check the status of your Azure subscription. Make sure the subscription isn't suspended and that no billing issues are associated with the subscription.

## Resource isn't displayed

In the Azure portal, if the **Overview** or **Delete** panes for Confluent Cloud aren't visible, refresh the page. This error might be an intermittent issue with the portal. If that solution doesn't work, contact [Confluent support](https://support.confluent.io).

If the Confluent Cloud resource isn't found in the Azure **All resources** list, contact [Confluent support](https://support.confluent.io).

## Resource creation takes a long time

If the deployment process takes more than three hours to complete, contact support.

If deployment fails and the Confluent Cloud resource has a status of `Failed`, delete the resource. Then try again to create the resource.

## Offer plan doesn't load

This error might be an intermittent problem with the Azure portal. Try again to deploy the offer.

## Can't delete a resource

If you can't delete a Confluent resource, check that you have permissions to delete the resource. You must be allowed to take `Microsoft.Confluent/*/Delete` actions. For information about viewing permissions, see [List Azure role assignments by using the Azure portal](../../role-based-access-control/role-assignments-list-portal.yml).

If you have the correct permissions but still can't delete the resource, contact [Confluent support](https://support.confluent.io). This condition might be related to the Confluent retention policy. Confluent support can delete the organization and email address for you.

## Single sign-on doesn't work

If single sign-on (SSO) doesn't work for the Confluent Cloud software as a service (SaaS) portal, check that you're using the correct Microsoft Entra ID email. You must also consent to allow access for the Confluent Cloud SaaS portal.

If the problem persists, contact [Confluent support](https://support.confluent.io).

## Can't create a service connection by using Service Connector

1. Ensure that your Confluent organization is active and running.
1. If you opted to use the Confluent Marketplace resource, check that your Azure Native Integrations Confluent organization is active and not in an unsubscribed status.
1. If you use a schema-based data type like AVRO, be sure that you also opted to configure the schema registry.

## List of connectors that use Confluent connectors isn't visible

If you can't see the list of connectors, make sure that you're assigned the Owner or Contributor role for the Azure subscription. To change your role assignments, contact your Azure subscription administrator.

## Creating a Confluent connector fails

1. If you can't create a connector, check that you have the required permissions and that all required fields have the correct values.
1. Check that the Azure service you're trying to connect to is configured properly.  
1. If the issue persists, contact [Confluent support](https://support.confluent.io).

## My Confluent connector isn't in the list of connectors

1. If you just created a new connector and can't see it in the list of connectors, select **Refresh**.
1. If your Confluent connector still doesn't appear in the list of connectors, contact [Confluent support](https://support.confluent.io).

## Related content

- Learn how to [manage your instance](manage.md) of Apache Kafka & Apache Flink on Confluent Cloud.
- Get started with Apache Kafka & Apache Flink on Confluent Cloud, an Azure Native Integrations service:

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Confluent%2Forganizations)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/confluentinc.confluent-cloud-azure-prod?tab=Overview)
