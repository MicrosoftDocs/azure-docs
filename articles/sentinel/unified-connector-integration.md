---
title: Connect using unified connectors
description: Learn how to connect to the Unified Connectors Platform that simplifies connector management across Microsoft security products including Microsoft Sentinel, Defender for Cloud, and Defender for Identity.
author: mberdugo
contributors:
ms.topic: how-to
ms.date: 08/10/2025
ms.author: monaberdugo
ms.reviewer: Oded Weber

#customer intent: As a Microsoft Defender for Identity user, I want to simplify my connections by using a unified connector so I can manage my Okta integration more efficiently.
---

# Connect to Microsoft Sentinel using a unified connector

[Unified connectors](./unified-connector.md) are the preferred way to create a connection. Even if you already have a connector to a product, we recommend removing it and installing a unified connector where possible.

## Prerequisites

### Microsoft Sentinel workspace

  1. In the Microsoft Security portal, navigate to **Settings** -> **Microsoft Sentinel**.
  1. Identify the Sentinel workspace currently connected.
  1. The Okta connector can be linked to any of your connected workspaces. Decide which workspace you want to connect to your Okta account.

### Azure access permissions

The user setting up the Okta connector must have the following roles:

- **Log Analytics Contributor** – Required to write data into the Log Analytics workspace and manage the Data Collection Rule (DCR).
- **Microsoft Sentinel Contributor** – Required to modify connector settings in Sentinel.

If you are connecting to both Sentinel and Defender for Identity, you need permissions for both products.

Check user roles under the **Access control (IAM)** section of the **Log analytics workspace**.
If you need to assign these roles, allow 15 minutes for the changes to propagate before proceeding.

### Okta credentials

From your Okta account, you need the following information:

- **Domain name**: The URL of your Okta account without the `http://` prefix. For example, `yourcompany.okta.com`.
- **API token**: An Okta API token. To generate an API token, follow the instructions in [Create an API token](https://developer.okta.com/docs/guides/create-an-api-token/main/).

For information about integrating Okta with Defender for Identity, see [Integrate Okta with Microsoft Defender for Identity](/defender-for-identity/okta-integration).

## Configure a connector to a Sentinel workspace

To create a unified connector instance in Microsoft Sentinel, follow these steps:

1. Go to the Data connectors Gallery [directly](https://security.microsoft.com/sentinel/unified-connector), or navigate to it via **System** -> **Data management** -> **Data connectors**.

   :::image type="content" source="./media/unified-connector-integration/connectors-gallery.png" alt-text="Screenshot of connectors gallery.":::

   For more information about the Data connectors Gallery, see [Data connectors Gallery](./unified-connector.md#data-connectors-gallery).

1. Go to the **Unified connectors** section of the **My connectors** tab .

   :::image type="content" source="./media/unified-connector-integration/okta-connector.png" alt-text="Screenshot of Okta connector in the Connectors Gallery.":::

1. Select a connector (in this example, the **Okta Single Sign-On** connector). A side panel opens with more information about the connector, including prerequisites.

   :::image type="content" source="./media/unified-connector-integration/okta-connector-pane.png" alt-text="Screenshot of Okta connector configuration page.":::

1. Select **Connect a connector** to open the connector configuration wizard.
1. In the **Name and connection details** section, provide the following information:
   - **Connector name**: A descriptive user friendly name for the connector.
   - **Domain name**: The Okta domain, such as `yourcompany.okta.com`.
   - **API key**: Paste the [API key](#okta-credentials). Don't include the *Authorization* prefix, only the token value.
   Select **Next**.

1. In the **Select products** section, check the products you want to connect to. Check *SIEM* to enable the connector for Microsoft Sentinel.

   :::image type="content" source="./media/unified-connector-integration/select-products.png" alt-text="Screenshot of the select products section of the connector wizard.":::

1. Configure the product details for each product you selected:

   - Select the required workspace, whose permissions you validated [earlier](#azure-access-permissions).
   - Select the table manager.

1. Select **Connect**. The **Connect** button is only active when all the required fields are valid.

The connection process can take up to two minutes. If an error occurs, follow the provided error message for troubleshooting.

The initial state of the connector is *Pending* until the initial data is received successfully. It can take up to 30 minutes to receive data. If data isn't successfully received, the connector moves to an *Error* state.

Connectors that are successfully connected, appear in the **My Connectors tab**, and Okta system logs are ingested into your **Log Analytics workspace**.

## Manage your connector

Existing connectors appear in the **My Connectors** tab.

:::image type="content" source="./media/unified-connector-integration/my-connectors.png" alt-text="Screenshot of unified connectors list in the My connectors tab.":::

### Edit a connector

To edit a connector, select it and then select **Manage** from the connector side panel.

:::image type="content" source="./media/unified-connector-integration/manage-connector.png" alt-text="Screenshot of Okta health page with Manage button highlighted.":::

### Delete a connector

You can delete a connector in one of two ways:

- Select it and then select **Delete** from the connector side panel.
- Check the connector in the **My Connectors** tab and then select **Delete** from above the connector list.

:::image type="content" source="./media/unified-connector-integration/delete-connector.png" alt-text="Screenshot of Okta connector selected and the delete button highlighted.":::

## Verify data ingestion in Log analytics

To verify that the Okta connector is successfully ingesting data into your Log Analytics workspace, first ensure that your Okta account is generating system logs. If no logs are generated, manually generate some test logs.

- From the Microsoft Security portal: navigate to **Investigation & response** > **Hunting** > **Advanced hunting**. Once Okta logs are ingested into your workspace, you should find an *OktaSystemLogs* table under the *Microsoft Sentinel* tab
- From Azure portal, navigate to your selected **Log Analytics Workspace** > **Logs** > **OktaSystemLogs**.

> [!NOTE]
>
> - It can take up to 30 minutes from when you create the the connector instance for the *OktaSystemLogs* table to appear, containing your Okta system logs.
> - The connector will only ingest system logs from one hour before the instance was created.

## Considerations and limitations

- All connectors are now found in the [Data connectors Gallery](https://security.microsoft.com/sentinel/unified-connector) and not in the Content hub. Sentinel connectors have moved from the Content hub to the gallery, but the experience remains the same. To see the unified connectors or Sentinel connectors, go to the [Data connectors Gallery](https://security.microsoft.com/sentinel/unified-connector).
