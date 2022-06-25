---
title: Manage an NGINX resource through the Azure portal
description: This article describes management functions for NGINX on the Azure portal. 
ms.topic: conceptual
ms.custom: event-tier1-build-2022
author: flang-msft
ms.author: franlanglois
ms.date: 05/12/2022

---

# Manage your NGINX for Azure (preview) integration through the portal

Once your NGINX resource is created in the Azure portal, you might need to get information about it or change it. Here's list of ways to manage your NGINX resource.

- [Configure managed identity](#configure-managed-identity)
- [Changing the configuration](#changing-the-configuration)
- [Adding certificates](#adding-certificates)
- [Send metrics to monitoring](#send-metrics-to-monitoring)
- [Delete an NGINX deployment](#delete-an-nginx-deployment)
- [GitHub integration](#github-integration)

## Configure managed identity

Add a new User Assigned Managed Identity.

1. From the Resource menu, select your NGINX deployment.

1. From **Settings** on the left, select **Identity**.

    :::image type="content" source="media/nginx-manage/nginx-identity.png" alt-text="Screenshot showing how to add a managed identity to NGINX resource.":::

1. To add a User Assigned identity, select **Add** in the working pane. You see a new pane for adding **User assigned managed identities** on the right that are part of the subscription. Select an identity and select **Add**.

    :::image type="content" source="media/nginx-manage/nginx-user-assigned.png" alt-text="Screenshot after user assigned managed identity is added.":::

## Changing the configuration

1. From the Resource menu, select your NGINX deployment.

1. Select **NGINX configuration** on the left.

    :::image type="content" source="media/nginx-manage/nginx-configuration.png" alt-text="Screenshot resources for NGINX configuration settings.":::

1. To upload an existing **NGINX config package**, type the appropriate `.conf file` in **File path** in the working paned and select the **+** button and for config package.

    :::image type="content" source="media/nginx-manage/nginx-config-path.png" alt-text="Screenshot of config (. C O N F) file for uploading.":::

1. You see the contents of the file in the working pane. Select **Confirm** if correct.

    :::image type="content" source="media/nginx-manage/nginx-config-upload.png" alt-text="Screenshot of upload confirmation for config file.":::

1. To edit the config file within the Editor, select the pencil icon. When you're done editing, select **Submit**.

    :::image type="content" source="media/nginx-manage/nginx-config-editor.png" alt-text="Screenshot of editor for config file with Intelisense displayed.":::

## Adding certificates

You can add a certificate by uploading it to Azure Key vault, and then associating the certificate with your deployment.

1. From the Resource menu, select your NGINX deployment.

1. Select **NGINX certificates** in **Settings** on the left.

    :::image type="content" source="media/nginx-manage/nginx-certificates.png" alt-text="Screenshot of NGINX certificate uploading.":::

1. Select **Add certificate**. You see an **Add certificate** pane on the right. Add the appropriate information

    :::image type="content" source="media/nginx-manage/nginx-add-certificate.png" alt-text="Screenshot of the add certificate pane.":::

1. When you've added the needed information, select **Save**.

## Send metrics to monitoring

1. From the Resource menu, select your NGINX deployment.

1. Select **NGINX Monitoring** under the **Settings** on the left.

    :::image type="content" source="media/nginx-manage/nginx-monitoring.png" alt-text="Screenshot of NGINX monitoring in Azure metrics.":::

1. Select **Send metrics to Azure Monitor** to enable metrics and select **Save**.

    :::image type="content" source="media/nginx-manage/nginx-send-to-monitor.png" alt-text="screenshot of nginx sent to monitoring":::

## Delete an NGINX deployment

To delete a deployment of NGINX for Azure (preview):

1. From the Resource menu, select your NGINX deployment.

1. Select **Overview** on the left.

1. Select **Delete**.

    :::image type="content" source="media/nginx-manage/nginx-delete-deployment.png" alt-text="Screenshot showing how delete an NGINX resource.":::

1. Confirm that you want to delete the NGINX resource.

    :::image type="content" source="media/nginx-manage/nginx-confirm-delete.png" alt-text="Screenshot showing the final confirmation of delete for NGINX resource.":::

1. Select **Delete**.

After the account is deleted, logs are no longer sent to NGINX, and all billing stops for NGINX through Azure Marketplace.

> [!NOTE]
> The delete button on the main account is only activated if all the sub-accounts mapped to the main account are already deleted. Refer to section for deleting sub-accounts here.

## GitHub Integration

Enable CI/CD deployments via GitHub Actions integrations.

<!-- <<Add screenshot for GitHub integration>>  -->

## Next steps

For help with troubleshooting, see [Troubleshooting NGINX integration with Azure](nginx-troubleshoot.md).
