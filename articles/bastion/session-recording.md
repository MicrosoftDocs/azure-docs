---
title: 'Record Bastion sessions'
titleSuffix: Azure Bastion
description: Learn how to configure and record Bastion sessions.
author: cherylmc
ms.service: bastion
ms.topic: how-to
ms.date: 05/30/2024
ms.author: cherylmc

---

# Configure Bastion session recording (Preview)

This article helps you configure Bastion session recording. [!INCLUDE [Session recording](../../includes/bastion-session-recording-description.md)]

## Before you begin

The following sections outline considerations, limitations, and prerequisites for Bastion session recording.

**Considerations and limitations**

* The Premium SKU is required for this feature.
* Session recording isn't available via native client at this time.
* Session recording supports one container/storage account at a time.
* When session recording is enabled on a bastion host, Bastion records ALL sessions that go through the recording-enabled bastion host.

**Prerequisites**

* Azure Bastion is deployed to your virtual network. See [Tutorial - Deploy Bastion using specified settings](tutorial-create-host-portal.md) for steps.
* Bastion must be configured to use **Premium SKU** for this feature. You can update to the Premium SKU from a lower SKU when you configure the session recording feature. To check your SKU and upgrade, if necessary, see [View or upgrade a SKU](upgrade-sku.md).
* The virtual machine that you connect to must either be deployed to the virtual network that contains the bastion host, or to a virtual network that is directly peered to the Bastion virtual network.

## Enable session recording

You can enable session recording when you create a new bastion host resource, or you can configure it later, after deploying Bastion.

:::image type="content" source="./media/session-recording/enable-feature.png" alt-text="Screenshot shows the configuration page for the bastion host." lightbox="./media/session-recording/enable-feature.png":::

### Steps for new Bastion deployments

When you manually configure and deploy a bastion host, you can specify the SKU tier and features at the time of deployment. For comprehensive steps to deploy Bastion, see [Deploy Bastion by using specified settings](tutorial-create-host-portal.md).

1. In the Azure portal, select **Create a Resource**.
1. Search for **Azure Bastion** and select **Create**.  
1. Fill in the values using manual settings, being sure to select the **Premium SKU**.
1. In the **Advanced** tab, select **Session Recording** to enable the session recording feature.
1. Review your details and select **Create**. Bastion immediately begins creating your bastion host. This process takes about 10 minutes to complete.

### Steps for existing Bastion deployments

If you've already deployed Bastion, use the following steps to enable session recording.

1. In the Azure portal, go to your Bastion resource.
1. On your Bastion page, in the left pane, select **Configuration**.
1. On the Configuration page, for Tier, select **Premium** if it isn't already selected. This feature requires the Premium SKU.
1. Select **Session Recording (Preview)** from the listed features.
1. Select **Apply**. Bastion immediately begins updating the settings for your bastion host. Updates take about 10 minutes.

## Configure storage account container

In this section, you set up and specify the container for session recordings.

1. Create a storage account in your resource group. For steps, see [Create a storage account](../storage/common/storage-account-create.md) and [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../storage/common/storage-sas-overview.md).

1. Within the storage account, create a **Container**. This is the container you'll use to store your Bastion session recordings. We recommend that you create an exclusive container for session recordings. For steps, see [Create a container](../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container).
1. On the page for your storage account, in the left pane, expand **Settings**. Select **Resource sharing (CORS)**.
1. Create a new policy under Blob service.
    * For **Allowed origins**, type `HTTPS://` followed by the DNS name of your bastion.
    * For **Allowed Methods**, select GET.
    * For **Max Age**, use ***86400***.
    * You can leave the other fields blank.

      :::image type="content" source="./media/session-recording/blob-service.png" alt-text="Screenshot shows the Resource sharing page for Blob service configuration." lightbox="./media/session-recording/blob-service.png":::
1. **Save** your changes at the top of the page.

## Add or update the SAS URL

To configure session recordings, you must add a SAS URL to your Bastion **Session recordings** configuration. In this section, you generate the Blob SAS URL from your container, then upload it to your bastion host.

The following steps help you configure the required settings directly on the **Generate SAS** page. However, you can optionally configure some of the settings by creating a stored access policy. You can then link the stored access policy to the SAS token on the **Generate SAS** page. If you want to create a stored access policy, either select Permissions and Start/expiry date and time in the access policy, or on the **Generate SAS** page.

1. On your storage account page, go to **Data storage -> Containers**.
1. Locate the container you created to store Bastion session recordings, then click the 3 dots (ellipses) to the right of your container and select **Generate SAS** from the dropdown list.
1. On the **Generate SAS** page, for **Permissions**, select **READ, CREATE, WRITE, LIST**.
1. For **Start and expiry date/time**, use the following recommendations:
   * Set **Start time** to be at least 15 minutes before the present time.
   * Set **Expiry time** to be long into the future.
1. Under **Allowed Protocols**, select **HTTPS** only.
1. Click **Generate SAS token and URL**. You'll see the Blob SAS token and Blob SAS URL generated at the bottom of the page.
1. Copy the **Blob SAS URL**.
1. Go to your bastion host. In the left pane, select **Session recordings**.
1. At the top of the page, select **Add or update SAS URL**. Paste your SAS URL, then click **Upload**.

## View a recording

Sessions are automatically recorded when Session Recording is enabled on the bastion host. You can view recordings in the Azure portal via an integrated web player.

1. In the Azure portal, go to your **Bastion** host.
1. In the left pane, under **Settings**, select **Session recordings**.
1. The SAS URL should already be configured (earlier in this exercise). However, if your SAS URL expired, or you need to add the SAS URL, use the previous steps to acquire and upload the Blob SAS URL.
1. Select the VM and recording link that you want to view, then select **View recording**.

## Next steps

View the [Bastion FAQ](bastion-faq.md) for additional information about Bastion.
