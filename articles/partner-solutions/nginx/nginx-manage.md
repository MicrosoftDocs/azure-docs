---
title: Manage an NGINX resource through the Azure portal
description: This article describes management functions for NGINX on the Azure portal. 
ms.topic: conceptual
ms.service: partner-services
author: flang-msft
ms.author: franlanglois
ms.date: 05/12/2022

---

# Manage your NGINX integration through the Azure portal

Once your NGINX resource is created in the Azure portal, you might need to get information about it or change it. Here's list of ways to manage your NGINX resource.

- [Identity](#configure-managed-identity)
- [Configuration](#nginx-configuration)
- [Certificates](#nginx-certificates)
- [Monitoring](#nginx-monitoring)
- [Delete accounts](#delete-nginx-accounts)
- [GitHub integration](#github-integration)

## Configure managed identity

Add a new User Assigned Managed Identity.

1. From the Resource menu, select your NGINX deployment.

1. From **Settings** on the left, select **Identity**.

    :::image type="content" source="media/nginx-manage/nginx-identity.png" alt-text="screenshot of nginx identity resource in Azure portal.":::

1. To add a User Assigned identity, select **Add** in the working pane. You see a new pane for adding **User assigned managed identities** on the right that are part of the subscription. Select an identity and select **Add**.

    :::image type="content" source="media/nginx-manage/nginx-user-assigned.png" alt-text="screenshot of user assigned identity":::

## Changing the configuration

1. From the Resource menu, select your NGINX deployment.

1. Select **NGINX configuration** on the left.

    :::image type="content" source="media/nginx-manage/nginx-configuration.png" alt-text="screenshot resources for nginx configuration settings":::

1. To upload an existing **NGINX config package**, type the appropriate `.conf file` in **File path** in the working paned and select the **+** button and for config package.

    :::image type="content" source="media/nginx-manage/nginx-config-path.png" alt-text="screenshot of config file for uploading":::

1. You see the contents of the file in the working pane. Select **Confirm** if correct.

    :::image type="content" source="media/nginx-manage/nginx-config-upload.png" alt-text="screenshot of upload confirmation":::

1. To edit the config file within the Editor, select the pencil icon. When you're done editing, select **Submit**.

    :::image type="content" source="media/nginx-manage/nginx-config-editor.png" alt-text="asd":::

## Adding certificates

You can add a certificate by uploading it to Azure Key vault, and then associating the certificate with your deployment.

1. From the Resource menu, select your NGINX deployment.

1. Select **NGINX certificates** in **Settings** on the left.

    :::image type="content" source="media/nginx-manage/nginx-certificates.png" alt-text="screenshot of nginx certificate configuration":::

1. Select **Add certificate**. You see an **Add certificate** pane on the right. Add the appropriate information

    :::image type="content" source="media/nginx-manage/nginx-add-certificate.png" alt-text="screenshot of the add certificate pane":::

1. When you've added the needed information, select **Save**.

## Send metrics to monitoring

1. From the Resource menu, select your NGINX deployment.

1. Select **NGINX Monitoring** under the **Settings** on the left.

    :::image type="content" source="media/nginx-manage/nginx-monitoring.png" alt-text="screenshot of nginx monitoring":::

1. Select **Send metrics to Azure Monitor** to enable metrics and select **Save**.

    :::image type="content" source="media/nginx-manage/nginx-send-to-monitor.png" alt-text="screenshot of nginx sent to monitoring":::

## Delete an NGINX deployment

To delete a deployment of NGINX for Azure:

1. From the Resource menu, select your NGINX deployment.
1. Select **Overview** on the left.
1. Select **Delete**.
1. Confirm that you want to delete the NGINX resource.
1. Select **Delete**.

After the account is deleted, logs are no longer sent to NGINX, and all billing stops for NGINX through Azure Marketplace.

> [!NOTE]
> The delete button on the main account is only activated if all the sub-accounts mapped to the main account are already deleted. Refer to section for deleting sub-accounts here.

## GitHub Integration

Enable CI/CD deployments via GitHub Actions integrations.

<!-- <<Add screenshot for GitHub integration>>  -->

## Next steps

For help with troubleshooting, see [Troubleshooting NGiNX integration with Azure](nginx-troubleshoot.md).
