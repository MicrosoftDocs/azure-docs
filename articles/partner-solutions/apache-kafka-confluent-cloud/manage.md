---
title: Manage a Confluent Cloud
description: This article describes management of a Confluent Cloud on the Azure portal. How to set up single sign-on, delete a Confluent organization, and get support.

ms.topic: conceptual
ms.custom: devx-track-azurecli
ms.date: 11/20/2023

---

# Manage the Confluent Cloud resource

This article describes how to manage your instance of Apache Kafka for Confluent Cloud on Azure. It shows how to set up single sign-on (SSO) and delete a Confluent organization.

## Single sign-on

To implement SSO for your organization, your tenant administrator can import the gallery application. This step is optional. For information importing an application, see [Quickstart: Add an application to your Microsoft Entra tenant](../../active-directory/manage-apps/add-application-portal.md). When the tenant administrator imports the application, users don't need to explicitly consent to allow access for the Confluent Cloud portal.

To enable SSO, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to the **Overview** for your instance of the Confluent Cloud resource.
1. Select the link to **Manage on Confluent Cloud**.

   :::image type="content" source="media/manage/sso-link.png" alt-text="Confluent portal single sign-on.":::

1. If tenant administrator didn't import the gallery application for SSO consent, grant permissions and consent. This step is only needed the first time you access the link to **Manage on Confluent Cloud**.

   :::image type="content" source="media/manage/permissions-requested.png" alt-text="Grant permissions.":::

1. Choose a Microsoft Entra account for single sign-on to the Confluent Cloud portal.
1. After consent is provided, you're redirected to the Confluent Cloud portal.

## Set up cluster

For information about setting up your cluster, see [Create a Cluster in Confluent Cloud - Confluent Documentation](https://docs.confluent.io/cloud/current/clusters/create-cluster.html).

## Delete Confluent organization

When you no longer need your Confluent Cloud resource, delete the resource in Azure and Confluent Cloud.

### [Portal](#tab/azure-portal)

To delete the resources in Azure:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **All Resources** and **Filter by the name** of the Confluent Cloud resource or the **Resource Type** _Confluent organization_. Or in the Azure portal, search for the resource name.
1. In the resource's **Overview** select **Delete**.

    :::image type="content" source="media/delete-resources-icon.png" alt-text="Resource delete icon.":::

1. To confirm the deletion, type the resource name and select **Delete**.

    :::image type="content" source="media/delete-resources-prompt.png" alt-text="Prompt to confirm resource deletion.":::

### [Azure CLI](#tab/azure-cli)

Start by preparing your environment for the Azure CLI:

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

After you sign in, use the [az confluent organization delete](/cli/azure/confluent#az-confluent-organization-delete) command to delete the organization resource by name:

```azurecli
az confluent organization delete --name "myOrganization" --resource-group "myResourceGroup"
```

Or, by resource ID:

```azurecli
az confluent organization delete --id "/subscriptions/{SubID}/resourceGroups/{myResourceGroup}/providers/Microsoft.Confluent/organizations/{myOrganization}"
```

---

To delete the resource on Confluent Cloud, see the documentation for [Confluent Cloud Environments - Confluent Documentation](https://docs.confluent.io/current/cloud/using/environments.html) and [Confluent Cloud Basics - Confluent Documentation](https://docs.confluent.io/current/cloud/using/cloud-basics.html).

The cluster and all data in the cluster are permanently deleted. If your contract includes a data retention clause, Confluent keeps your data for the time period that is specified in the [Terms of Service - Confluent Documentation](https://www.confluent.io/confluent-cloud-tos).

You're billed for prorated usage up to the time of cluster deletion. After your cluster is permanently deleted, Confluent sends you an email confirmation.

## Next steps

- For help with troubleshooting, see [Troubleshooting Apache Kafka on Confluent Cloud solutions](troubleshoot.md).

- If you need to contact support, see [Get support for Confluent Cloud resource](get-support.md).

- Get started with Apache Kafka on Confluent Cloud - Azure Native ISV Service on

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Confluent%2Forganizations)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/confluentinc.confluent-cloud-azure-prod?tab=Overview)
