---
title: Manage an NGINXaaS Resource Through the Azure portal
description: Learn about managing your NGINXaaS instance on the Azure portal, including configuring managed identities, adding certificates, and sending metrics to Azure Monitor.
ms.topic: how-to
ms.date: 05/12/2025
#customer intent: As an NGInX administrator, I want to manage my NGINXaaS instance by using the Azure portal.
---

# Manage your NGINXaaS integration through the Azure portal

After you create your NGINXaaS resource in the Azure portal, you might need to get information about it or change it.

[!INCLUDE [manage](../includes/manage.md)]

:::image type="content" source="media/nginx-manage/nginx-resource-overview.png" alt-text="Screenshot of an NGINXaaS resource in the Azure portal with the overview displayed." lightbox="media/nginx-manage/nginx-resource-overview.png":::

Here are some management tasks:

- [Configure managed identity](#configure-managed-identity)
- [Change the configuration](#change-the-configuration)
- [Add a certificate](#add-a-certificate)
- [Send metrics to monitoring](#send-metrics-to-monitoring)
- [Delete an NGINXaaS deployment](#delete-a-resource)
- [GitHub integration](#github-integration)

## Configure managed identity

Add a new User Assigned Managed Identity.

1. In your NGINXaaS deployment, in the left menu, select **Settings** > **Identity**.

1. Select **User assigned**, then select **Add**.

   :::image type="content" source="media/nginx-manage/nginx-identity.png" alt-text="Screenshot showing how to add a managed identity to NGINXaaS resource." lightbox="media/nginx-manage/nginx-identity.png":::

1. Under **Add user assigned managed identity**, select your subscription and then select an identity.

1. Select **Add**.

## Change the configuration

Change your configuration file.

1. In your NGINXaaS deployment, in the left menu, select **Settings** > **NGINXaaS configuration**.

1. Select **Upload config package**.

   :::image type="content" source="media/nginx-manage/nginx-config-upload.png" alt-text="Screenshot of upload confirmation for config file." lightbox="media/nginx-manage/nginx-config-upload.png":::

1. In **Upload configuration**, drag your file to the upload area or browse to upload it.

1. Specify a **Root file**.

1. This change replaces existing files. Select the option to proceed, then select **Upload**.

Besides replacing your configuration file, you can edit it in this page. Select the pencil icon. When you're done editing, select **Submit**.

## Add a certificate

You can add a certificate. First, upload your certificate to Azure Key Vault. For more information, see [Import a certificate in Azure Key Vault](/azure/key-vault/certificates/tutorial-import-certificate). Then follow these steps:

1. In your NGINXaaS deployment, in the left menu, select **Settings** > **NGINXaaS certificates**.

1. Select **Add certificate**.

   :::image type="content" source="media/nginx-manage/nginx-add-certificate.png" alt-text="Screenshot of the add certificate pane." lightbox="media/nginx-manage/nginx-add-certificate.png":::

1. In the **Add certificate** pane, choose **Select certificate** and choose your certificate from the options.

1. Select **Add certificate**.

## Send metrics to monitoring

You can send metrics to Azure Monitor to take advantage of its monitoring capabilities.

1. In your NGINXaaS deployment, in the left menu, select **Settings** > **NGINXaaS Monitoring**.

1. For **Send metrics to Azure Monitor**, select **On**, then select **Save**

## Delete a resource

[!INCLUDE [delete-resource](../includes/delete-resource.md)]

After the account is deleted, logs are no longer sent to NGINXaaS.

> [!NOTE]
> The delete button on the main account is only activated if all the subaccounts mapped to the main account are already deleted.

## GitHub integration

Enable CI/CD deployments by using GitHub Actions integrations.

## Next step

> [!div class="nextstepaction"]
> [Troubleshooting NGINXaaS integration with Azure](troubleshoot.md)
