---
title: Manage an nginx integration with Azure - Azure partner solutions
description: This article describes management of nginx on the Azure portal. 
ms.topic: conceptual
ms.service: partner-services
ms.collection: na
author: flang-msft
ms.author: franlanglois
ms.date: 05/12/2022

---

# Manage the nginx integration with Azure

Once your Nginx resource is created in the Azure portal, you might need to manage it. Here is list of ways to manage your Nginx resource.

- Identity
- Certificates
- Monitoring
- GitHub integration
- Delete accounts

## Configure Managed Identity

Add a new User Assigned Managed Identity.

1. From the Resource Manager, select you Nginx resource.

1. Select Identity.

    :::image type="content" source="media/nginx-manage/nginx-identity.png" alt-text="screenshot of nginx identity resource in Azure portal.":::

1. To add a user assigned identity

    :::image type="content" source="media/nginx-manage/nginx-user-assigned.png" alt-text="screenshot of user assigned identity":::

### Nginx Configuration

1. From the Resource Manager, select your Nginx resource.

1. Select NGINX configuration on the left.

    :::image type="content" source="media/nginx-manage/nginx-configuration.png" alt-text="screenshot resources for nginx configuration settings":::

1. To upload an existing Nginx Configuration file,  select **Nginx configuration** menu item under the Settings in the left pane.

    :::image type="content" source="media/nginx-manage/nginx-config-path.png" alt-text="screenshot of config file for uploading":::

1. Provide the path of the config file and click the **+** button and for config package.

    :::image type="content" source="media/nginx-manage/nginx-config-upload.png" alt-text="screenshot of upload confirmation":::

1. To edit the config file within the Editor,

    :::image type="content" source="media/nginx-manage/nginx-config-editor.png" alt-text="asd":::

## Nginx Certificates

You can bring in your certificates and upload it to Azure Key vault and associate it with your deployment. Click on Nginx configurations under the Settings in the left pane.

:::image type="content" source="media/nginx-manage/nginx-certificates.png" alt-text="screenshot of nginx certificate configuration":::

## Nginx Monitoring

Click the Nginx Monitoring under the Settings in the left navigation pane.

:::image type="content" source="media/nginx-manage/nginx-monitoring.png" alt-text="screenshot of nginx monitoring":::

Click **Send metrics to Azure Monitor** to enable metrics and press Save.

:::image type="content" source="media/nginx-manage/nginx-send-to-monitor.png" alt-text="screenshot of nginx sent to monitoring":::



## Delete Nginx Accounts 

1. Select your Nginx resource in the Resource Manager.
1. Go to Overview on the left of the portal.
1. Select **Nginx** resource and select “Delete”.
1. Confirm that you want to delete Nginx resource.
1. Select Delete. 

> [!NOTE]
> The delete button on the main account is only activated if all the sub-accounts mapped to the main account are already deleted. Refer to section for deleting sub-accounts here.

After the account is deleted, logs are no longer sent to Nginx, and all billing stops for Nginx through Azure Marketplace.

## GitHub Integration

Enable CI/CD deployments via GitHub Actions integrations

<!-- <<Add screenshot for GitHub integration>>  -->

## Next steps

For help with troubleshooting, see [Troubleshooting nginx integration with Azure](nginx-troubleshoot.md).
