---
title: Manage a Confluent Cloud - Azure partner solutions
description: This article describes management of a Confluent Cloud on the Azure portal. How to set up single sign-on, delete a Confluent organization, and get support.
ms.service: partner-services
ms.topic: conceptual
ms.date: 02/08/2021
author: tfitzmac
ms.author: tomfitz
---

# Manage the Confluent Cloud resource

This article describes how to manage your instance of Apache Kafka for Confluent Cloud on Azure. It shows how to set up single sign-on (SSO), delete a Confluent organization, and create a support request.

## Single sign-on

To implement SSO for your organization, your tenant administrator can import the gallery application. This step is optional. For information importing an application, see [Quickstart: Add an application to your Azure Active Directory (Azure AD) tenant](../../active-directory/manage-apps/add-application-portal.md). When the tenant administrator imports the application, users don't need to explicitly consent to allow access for the Confluent Cloud portal.

To enable SSO, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to the **Overview** for your instance of the Confluent Cloud resource.
1. Select the link to **Manage on Confluent Cloud**.

   :::image type="content" source="media/sso-link.png" alt-text="Confluent portal single sign-on.":::

1. If tenant administrator didn't import the gallery application for SSO consent, grant permissions and consent. This step is only needed the first time you access the link to **Manage on Confluent Cloud**.
1. Choose an Azure AD account for single sign-on to the Confluent Cloud portal.
1. After consent is provided, you're redirected to the Confluent Cloud portal.

## Set up cluster

For information about setting up your cluster, see [Create a Cluster in Confluent Cloud - Confluent Documentation](https://docs.confluent.io/cloud/current/clusters/create-cluster.html).

## Delete Confluent organization

When you no longer need your Confluent Cloud resource, delete the resource in Azure and Confluent Cloud.

To delete the resources in Azure:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **All Resources** and **Filter by the name** of the Confluent Cloud resource or the **Resource Type** _Confluent organization_. Or in the Azure portal, search for the resource name.
1. In the resource's **Overview** select **Delete**.

    :::image type="content" source="media/delete-resources-icon.png" alt-text="Resource delete icon.":::

1. To confirm the deletion, type the resource name and select **Delete**.

    :::image type="content" source="media/delete-resources-prompt.png" alt-text="Prompt to confirm resource deletion.":::

To delete the resource on Confluent Cloud, see the documentation for [Confluent Cloud Environments - Confluent Documentation](https://docs.confluent.io/current/cloud/using/environments.html) and [Confluent Cloud Basics - Confluent Documentation](https://docs.confluent.io/current/cloud/using/cloud-basics.html).

The cluster and all data in the cluster are permanently deleted. If your contract includes a data retention clause, Confluent keeps your data for the time period that is specified in the [Terms of Service - Confluent Documentation](https://www.confluent.io/confluent-cloud-tos).

You're billed for prorated usage up to the time of cluster deletion. After your cluster is permanently deleted, Confluent sends you an email confirmation.

## Get support

To submit a support request to Confluent, either contact [Confluent support](https://support.confluent.io) or submit a request through the portal, as shown below.

> [!NOTE]
> For first time users, reset your password before you sign in to the Confluent support portal. If you don't have an account with Confluent Cloud, send an email to `cloud-support@confluent.io` for further assistance.

In the portal, you can either submit a request through Azure Help and Support, or directly from your instance of Apache Kafka for Confluent Cloud on Azure.

To submit a request through Azure Help and Support:

1. Select **Help + support**.
1. Select **Create a support request**.
1. In the form, select **Technical** for **Issue type**. Select your subscription. In the list of services, select **Confluent on Azure**.

    :::image type="content" source="media/support-request-help.png" alt-text="Create a support request from help.":::

To submit a request from your resource, follow these steps:

1. In the Azure portal, select your Confluent organization.
1. From the menu on the screen's left side, select **New support request**.
1. To create a support request, select the link to the **Confluent portal**.

    :::image type="content" source="media/support-request.png" alt-text="Create a support request from instance.":::

## Next steps

For help with troubleshooting, see [Troubleshooting Apache Kafka for Confluent Cloud solutions](troubleshoot.md).
