---
title: Manage an <astronomer> resource through the Azure portal
description: This article describes management functions for <astronomer> on the Azure portal. 
author: flang-msft

ms.author: franlanglois
ms.topic: conceptual
ms.custom: event-tier1-build-2022
ms.date: 01/18/2023


---

# Manage your <astronomer> integration through the portal

Once your <astronomer> resource is created in the Azure portal, you might need to get information about it or change it. Here's list of ways to manage your <astronomer> resource.

- [Configure managed identity](#configure-managed-identity)
- [Changing the configuration](#changing-the-configuration)
- [Adding certificates](#adding-certificates)
- [Send metrics to monitoring](#send-metrics-to-monitoring)
- [Delete an <astronomer> deployment](#delete-an-<astronomer>-deployment)
- [GitHub integration](#github-integration)

## Configure managed identity

Add a new User Assigned Managed Identity.

1. From the Resource menu, select your <astronomer> deployment.

1. From **Settings** in the Resource menu, select **Identity**.

    :::image type="content" source="media/astronomer-manage/astronomer-identity.png" alt-text="Screenshot showing how to add a managed identity to <astronomer> resource.":::

1. To add a User Assigned identity, select **Add** in the working pane. You see a new pane for adding **User assigned managed identities** on the right that are part of the subscription. Select an identity and select **Add**.

    :::image type="content" source="media/astronomer-manage/astronomer-user-assigned.png" alt-text="Screenshot after user assigned managed identity is added.":::

## Changing the configuration

1. From the Resource menu, select your <astronomer> deployment.

1. Select **<astronomer> configuration** in the Resource menu.

    :::image type="content" source="media/astronomer-manage/astronomer-configuration.png" alt-text="Screenshot resources for <astronomer> configuration settings.":::

1. To upload an existing **<astronomer> config package**, type the appropriate `.conf file` in **File path** in the working paned and select the **+** button and for config package.

    :::image type="content" source="media/astronomer-manage/astronomer-config-path.png" alt-text="Screenshot of config (. C O N F) file for uploading.":::

1. You see the contents of the file in the working pane. Select **Confirm** if correct.

    :::image type="content" source="media/astronomer-manage/astronomer-config-upload.png" alt-text="Screenshot of upload confirmation for config file.":::

1. To edit the config file within the Editor, select the pencil icon. When you're done editing, select **Submit**.

    :::image type="content" source="media/astronomer-manage/astronomer-config-editor.png" alt-text="Screenshot of editor for config file with Intellisense displayed.":::

## Adding certificates

You can add a certificate by uploading it to Azure Key vault, and then associating the certificate with your deployment.

1. From the Resource menu, select your <astronomer> deployment.

1. Select **<astronomer> certificates** in **Settings** in the Resource menu.

    :::image type="content" source="media/astronomer-manage/astronomer-certificates.png" alt-text="Screenshot of <astronomer> certificate uploading.":::

1. Select **Add certificate**. You see an **Add certificate** in the working pane. Add the appropriate information

    :::image type="content" source="media/astronomer-manage/astronomer-add-certificate.png" alt-text="Screenshot of the add certificate pane.":::

1. When you've added the needed information, select **Save**.

## Send metrics to monitoring

1. From the Resource menu, select your <astronomer> deployment.

1. Select **<astronomer> Monitoring** under the **Settings** in the Resource menu.

    :::image type="content" source="media/astronomer-manage/astronomer-monitoring.png" alt-text="Screenshot of <astronomer> monitoring in Azure metrics.":::

1. Select **Send metrics to Azure Monitor** to enable metrics and select **Save**.

    :::image type="content" source="media/astronomer-manage/astronomer-send-to-monitor.png" alt-text="screenshot of astronomer sent to monitoring":::

## Delete an <astronomer> deployment

To delete a deployment of <astronomer>:

1. From the Resource menu, select your <astronomer> deployment.

1. Select **Overview** in the Resource menu.

1. Select **Delete**.

    :::image type="content" source="media/astronomer-manage/astronomer-delete-deployment.png" alt-text="Screenshot showing how to delete an <astronomer> resource.":::

1. Confirm that you want to delete the <astronomer> resource.

    :::image type="content" source="media/astronomer-manage/astronomer-confirm-delete.png" alt-text="Screenshot showing the final confirmation of delete for <astronomer> resource.":::

1. Select **Delete**.

After the account is deleted, logs are no longer sent to <astronomer>, and all billing stops for <astronomer> through Azure Marketplace.

> [!NOTE]
> The delete button on the main account is only activated if all the sub-accounts mapped to the main account are already deleted. Refer to section for deleting sub-accounts here.

## GitHub Integration

Enable CI/CD deployments via GitHub Actions integrations.

## Next steps

- For help with troubleshooting, see [Troubleshooting <astronomer> integration with Azure](astronomer-troubleshoot.md).
- Get started with <astronomer> – An Azure Native ISV Service on

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/astronomer.astronomerPLUS%2FastronomerDeployments)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/f5-networks.f5-astronomer-for-azure?tab=Overview)