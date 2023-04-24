---
title: Manage an Palo Alto resource through the Azure portal
description: This article describes management functions for Palo Alto on the Azure portal. 

ms.topic: conceptual
ms.date: 01/18/2023


---

# Manage your Palo Alto integration through the portal

Once your Palo Alto resource is created in the Azure portal, you might need to get information about it or change it. Here's list of ways to manage your Palo Alto resource.

- [Configure Netowrking and NAT](#configure-networking-NAT)
- [Configure Rulestack](#configure-the-Rulestack)
- [Enable Log settings](#enable-log-settings)
- [Enable DNS Proxy](#enable-dns-proxy)
- [Configure Rules](#configure-rules)
- [Delete an Palo Alto deployment](#delete-an-palo-alto-deployment)


## Configure Netowrking and NAT

Add a new User Assigned Managed Identity.

1. From the Resource menu, select your Palo Alto deployment.

1. From **Settings** in the Resource menu, select **Identity**.

    <!-- :::image type="content" source="media/palo-alto-manage/palo-alto-identity.png" alt-text="Screenshot showing how to add a managed identity to Palo Alto resource."::: -->

1. To add a User Assigned identity, select **Add** in the working pane. You see a new pane for adding **User assigned managed identities** on the right that are part of the subscription. Select an identity and select **Add**.

    <!-- :::image type="content" source="media/palo-alto-manage/palo-alto-user-assigned.png" alt-text="Screenshot after user assigned managed identity is added."::: -->

## Configure Rulestack

1. From the Resource menu, select your Palo Alto deployment.

1. Select **Palo Alto configuration** in the Resource menu.

    <!-- :::image type="content" source="media/palo-alto-manage/palo-alto-configuration.png" alt-text="Screenshot resources for Palo Alto configuration settings."::: -->

1. To upload an existing **Palo Alto config package**, type the appropriate `.conf file` in **File path** in the working paned and select the **+** button and for config package.

    <!-- :::image type="content" source="media/palo-alto-manage/palo-alto-config-path.png" alt-text="Screenshot of config (. C O N F) file for uploading."::: -->

1. You see the contents of the file in the working pane. Select **Confirm** if correct.

    <!-- :::image type="content" source="media/palo-alto-manage/palo-alto-config-upload.png" alt-text="Screenshot of upload confirmation for config file."::: -->

1. To edit the config file within the Editor, select the pencil icon. When you're done editing, select **Submit**.

    <!-- :::image type="content" source="media/palo-alto-manage/palo-alto-config-editor.png" alt-text="Screenshot of editor for config file with Intellisense displayed."::: -->

## Enable Log settings

You can add a certificate by uploading it to Azure Key vault, and then associating the certificate with your deployment.

1. From the Resource menu, select your Palo Alto deployment.

1. Select **Palo Alto certificates** in **Settings** in the Resource menu.

    <!-- :::image type="content" source="media/palo-alto-manage/palo-alto-certificates.png" alt-text="Screenshot of Palo Alto certificate uploading."::: -->

1. Select **Add certificate**. You see an **Add certificate** in the working pane. Add the appropriate information

    <!-- :::image type="content" source="media/palo-alto-manage/palo-alto-add-certificate.png" alt-text="Screenshot of the add certificate pane."::: -->

1. When you've added the needed information, select **Save**.

## Enable DNS Proxy

1. From the Resource menu, select your Palo Alto deployment.

1. Select **Palo Alto Monitoring** under the **Settings** in the Resource menu.

    <!-- :::image type="content" source="media/palo-alto-manage/palo-alto-monitoring.png" alt-text="Screenshot of Palo Alto monitoring in Azure metrics."::: -->

1. Select **Send metrics to Azure Monitor** to enable metrics and select **Save**.

    <!-- :::image type="content" source="media/palo-alto-manage/palo-alto-send-to-monitor.png" alt-text="screenshot of palo-alto sent to monitoring"::: -->

## Configure Rules

Enable CI/CD deployments via GitHub Actions integrations.

## Delete an Palo Alto deployment

To delete a deployment of Palo Alto:

1. From the Resource menu, select your Palo Alto deployment.

1. Select **Overview** in the Resource menu.

1. Select **Delete**.

    <!-- :::image type="content" source="media/palo-alto-manage/palo-alto-delete-deployment.png" alt-text="Screenshot showing how to delete an Palo Alto resource."::: -->

1. Confirm that you want to delete the Palo Alto resource.

    <!-- :::image type="content" source="media/palo-alto-manage/palo-alto-confirm-delete.png" alt-text="Screenshot showing the final confirmation of delete for Palo Alto resource."::: -->

1. Select **Delete**.

After the account is deleted, logs are no longer sent to Palo Alto, and all billing stops for Palo Alto through Azure Marketplace.

> [!NOTE]
> The delete button on the main account is only activated if all the sub-accounts mapped to the main account are already deleted. Refer to section for deleting sub-accounts here.


## Next steps

For help with troubleshooting, see [Troubleshooting Palo Alto integration with Azure](palo-alto-troubleshoot.md).
