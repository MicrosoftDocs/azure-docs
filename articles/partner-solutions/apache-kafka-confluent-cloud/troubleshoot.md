---
title: Troubleshooting Apache Kafka & Apache Flink on Confluent Cloud
description: This article provides information about troubleshooting and frequently asked questions (FAQ) for Confluent Cloud on Azure.
# customerIntent: As a developer I want to troubleshoot an error or get an answer to questions I have about using Apache Kafka & Apache Flink on Confluent Cloud.
ms.topic: conceptual
ms.date: 1/31/2024
---

# Troubleshooting Apache Kafka & Apache Flink on Confluent Cloud solutions

This document contains information about troubleshooting your solutions that use Apache Kafka® & Apache Flink® on Confluent Cloud™ - An Azure Native ISV Service.

If you don't find an answer or can't resolve a problem, [create a request through the Azure portal](get-support.md) or contact [Confluent support](https://support.confluent.io).

## Can't find offer in the Marketplace

To find the offer in the Azure Marketplace, use the following steps:

1. In the [Azure portal](https://portal.azure.com), select **Create a resource**.
1. Search for _Apache Kafka® & Apache Flink® on Confluent Cloud™ - An Azure Native ISV Service_.
1. Select the application tile.

If the offer isn't displayed, contact [Confluent support](https://support.confluent.io). Your Microsoft Entra tenant ID must be on the list of allowed tenants. To learn how to find your tenant ID, see [How to find your Microsoft Entra tenant ID](/azure/active-directory-b2c/tenant-management-read-tenant-name).

## Purchase errors

[!INCLUDE [marketplace-purchase-errors](../includes/marketplace-purchase-errors.md)]

If those options don't solve the problem, contact [Confluent support](https://support.confluent.io).

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

If you're unable to delete Confluent resources, verify you have permissions to delete the resource. You must be allowed to take Microsoft.Confluent/*/Delete actions. For information about viewing permissions, see [List Azure role assignments using the Azure portal](../../role-based-access-control/role-assignments-list-portal.yml).

If you have the correct permissions but still can't delete the resource, contact [Confluent support](https://support.confluent.io). This condition might be related to Confluent's retention policy. Confluent support can delete the organization and email address for you.

## Unable to use single sign-on

If SSO isn't working for the Confluent Cloud SaaS portal, verify you're using the correct Microsoft Entra ID email. You must also have consented to allow access for the Confluent Cloud software as a service (SaaS) portal. 

If the problem persists, contact [Confluent support](https://support.confluent.io).

## Unable to create a service connection to Confluent Kafka using Service Connector

1. Ensure that your Confluent organization is up and running.
1. If you have opted for the Confluent marketplace resource, please ensure that your Azure Native Confluent organization is still active and not in an unsubscribed status.
1. If you're using a schema-based data type like AVRO, please ensure you also opt for configuring the schema registry.

## Unable to see the list of connectors using Confluent connectors

If you're not able to see the list of connectors, please make sure you have the Subscription owner or contributor rights. If not, contact your Azure subscription administrator.

## Creating a Confluent connector fails

1. If you're not able to create a connector, please check if you have the right permissions and all the mandatory fields are inputted.
1. Check that the Azure service you're trying to connect to is configured properly.  
1. If the issue still persists, contact [Confluent support](https://support.confluent.io).

## Not able to see my Confluent connector in the list

1. If you just created a new connector and are not able to see it in the list of connectors, select **Refresh**.
2. If you still do not see your connector, contact [Confluent support](https://support.confluent.io).

## Next steps

- Learn about [managing your instance](manage.md) of Apache Kafka & Apache Flink on Confluent Cloud.
- Get started with Apache Kafka & Apache Flink on Confluent Cloud - An Azure Native ISV Service on

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Confluent%2Forganizations)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/confluentinc.confluent-cloud-azure-prod?tab=Overview)
