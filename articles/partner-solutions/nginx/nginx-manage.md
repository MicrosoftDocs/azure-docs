---
title: Manage an NGINXaaS resource through the Azure portal
description: This article describes management functions for NGINXaaS on the Azure portal. 
author: flang-msft

ms.author: franlanglois
ms.topic: conceptual
ms.date: 01/18/2023


---

# Manage your NGINXaaS integration through the portal

Once your NGINXaaS resource is created in the Azure portal, you might need to get information about it or change it. Here's list of ways to manage your NGINXaaS resource.

- [Configure managed identity](#configure-managed-identity)
- [Changing the configuration](#changing-the-configuration)
- [Adding certificates](#adding-certificates)
- [Send metrics to monitoring](#send-metrics-to-monitoring)
- [Delete an NGINXaaS deployment](#delete-an-nginxaas-deployment)
- [GitHub integration](#github-integration)

## Configure managed identity

Add a new User Assigned Managed Identity.

1. From the Resource menu, select your NGINXaaS deployment.

1. From **Settings** in the Resource menu, select **Identity**.

    :::image type="content" source="media/nginx-manage/nginx-identity.png" alt-text="Screenshot showing how to add a managed identity to NGINXaaS resource.":::

1. To add a User Assigned identity, select **Add** in the working pane. You see a new pane for adding **User assigned managed identities** on the right that are part of the subscription. Select an identity and select **Add**.

    :::image type="content" source="media/nginx-manage/nginx-user-assigned.png" alt-text="Screenshot after user assigned managed identity is added.":::

## Changing the configuration

1. From the Resource menu, select your NGINXaaS deployment.

1. Select **NGINXaaS configuration** in the Resource menu.

    :::image type="content" source="media/nginx-manage/nginx-configuration.png" alt-text="Screenshot resources for NGINXaaS configuration settings.":::

1. To upload an existing **NGINXaaS config package**, type the appropriate `.conf file` in **File path** in the working paned and select the **+** button and for config package.

    :::image type="content" source="media/nginx-manage/nginx-config-path.png" alt-text="Screenshot of config (. C O N F) file for uploading.":::

1. You see the contents of the file in the working pane. Select **Confirm** if correct.

    :::image type="content" source="media/nginx-manage/nginx-config-upload.png" alt-text="Screenshot of upload confirmation for config file.":::

1. To edit the config file within the Editor, select the pencil icon. When you're done editing, select **Submit**.

    :::image type="content" source="media/nginx-manage/nginx-config-editor.png" alt-text="Screenshot of editor for config file with Intellisense displayed.":::

## Adding certificates

You can add a certificate by uploading it to Azure Key vault, and then associating the certificate with your deployment.

1. From the Resource menu, select your NGINXaaS deployment.

1. Select **NGINXaaS certificates** in **Settings** in the Resource menu.

    :::image type="content" source="media/nginx-manage/nginx-certificates.png" alt-text="Screenshot of NGINXaaS certificate uploading.":::

1. Select **Add certificate**. You see an **Add certificate** in the working pane. Add the appropriate information

    :::image type="content" source="media/nginx-manage/nginx-add-certificate.png" alt-text="Screenshot of the add certificate pane.":::

1. When you've added the needed information, select **Save**.

## Send metrics to monitoring

1. From the Resource menu, select your NGINXaaS deployment.

1. Select **NGINXaaS Monitoring** under the **Settings** in the Resource menu.

    :::image type="content" source="media/nginx-manage/nginx-monitoring.png" alt-text="Screenshot of NGINXaaS monitoring in Azure metrics.":::

1. Select **Send metrics to Azure Monitor** to enable metrics and select **Save**.

    :::image type="content" source="media/nginx-manage/nginx-send-to-monitor.png" alt-text="screenshot of nginx sent to monitoring":::

## Delete an NGINXaaS deployment

To delete a deployment of NGINXaaS:

1. From the Resource menu, select your NGINXaaS deployment.

1. Select **Overview** in the Resource menu.

1. Select **Delete**.

    :::image type="content" source="media/nginx-manage/nginx-delete-deployment.png" alt-text="Screenshot showing how to delete an NGINXaaS resource.":::

1. Confirm that you want to delete the NGINXaaS resource.

    :::image type="content" source="media/nginx-manage/nginx-confirm-delete.png" alt-text="Screenshot showing the final confirmation of delete for NGINXaaS resource.":::

1. Select **Delete**.

After the account is deleted, logs are no longer sent to NGINXaaS, and all billing stops for NGINXaaS through Azure Marketplace.

> [!NOTE]
> The delete button on the main account is only activated if all the sub-accounts mapped to the main account are already deleted. Refer to section for deleting sub-accounts here.

## GitHub Integration

Enable CI/CD deployments via GitHub Actions integrations.

## Next steps

- For help with troubleshooting, see [Troubleshooting NGINXaaS integration with Azure](nginx-troubleshoot.md).
- Get started with NGINXaaS – An Azure Native ISV Service on

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/NGINX.NGINXPLUS%2FnginxDeployments)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/f5-networks.f5-nginx-for-azure?tab=Overview)