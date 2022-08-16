---
title: Create and manage Grafana API keys in Azure Managed Grafana
description: Learn how to generate and manage Grafana API keys, and start making API calls for Azure Managed Grafana.
author: maud-lv
ms.author: malev
ms.service: managed-grafana
ms.topic: how-to 
ms.date: 08/12/2022
---

# Generate and manage Grafana API keys in Azure Managed Grafana

In this guide, learn how to generate and manage API keys, and start making API calls to the Grafana server. Grafana API keys will enable you to create integrations between Azure Managed Grafana and other services.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- An Azure Managed Grafana instance with the API key option set to enabled. If you don't have one yet, [create an Azure Managed Grafana instance](./quickstart-managed-grafana-portal.md).

## Enable API keys

API keys are disabled by default in Azure Managed Grafana. There are two ways you can enable API keys:

- During the creation of the Azure Managed Grafana workspace, select **Enable API key creation** in the **Advanced** tab.
- In your Managed Grafana workspace, on the Azure platform, under **Settings** select **Configuration**, and then under API keys, select **Enable**.

## Generate an API key

1. Open your Azure Managed Grafana instance and from the left menu, select **Configuration >  API keys**.
    :::image type="content" source="media/create-api-keys/access-page.png" alt-text="Screenshot of the Grafana dashboard. Access API keys page.":::
1. Select **New API key**.
1. Fill out the form, and select **Add** to generate the new API key.

    | Parameter                | Description                                                                                                                                                | Example     |
    |--------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------|
    | **Key name**             | Enter a name for your new Grafana API key.                                                                                                                 | *api-key-1* |
    | **Managed Grafana role** | Choose a Managed Grafana role: Viewer, Editor or Admin.                                                                                                    | *Editor*    |
    | **Time to live**         | Enter a time before your API key expires. Use *s* for seconds, *m* for minutes, *h* for hours, *d* for days, *w* for weeks, *M* for months, *y* for years. | 7d          |

   :::image type="content" source="media/create-api-keys/form.png" alt-text="Screenshot of the Grafana dashboard. API creation form filled out.":::

1. Once the key has been generated, a message pops up with the new key and a curl command including your key. Copy this information and save it in your records now, as it will be hidden once you leave this page. If you close this page without save the new API key, you will need to generate a new one.

   :::image type="content" source="media/create-api-keys/api-key-created.png" alt-text="Screenshot of the Grafana dashboard. API key is displayed.":::

You can now use this Grafana API key to call the Grafana server.

## Make an HTTP request

Run the command below to make an HTTP request and check its status code.

1. Open a terminal and enter the following command. Replace the placeholders `<api-key>` and `<managed-grafana-endpoint>`with your own API key and Azure Managed Grafana endpoint.

   ```bash
   curl -vv H "Authorization: Bearer <api-key>" https://dashboard.scus.<managed-grafana-endpoint>/api/dashboards/home
   ```

1. Review the terminal's output. The HTTP response code `200` indicates that the request was successful. The new API key is valid.

## Manage API keys

Existing API keys are listed in **Configuration >  API keys**. By default, only active API keys are displayed. Select **Include expired keys** to view all created keys, and select **X** (Delete) to delete the API key.

:::image type="content" source="media/create-api-keys/manage.png" alt-text="Screenshot of the Grafana dashboard. API keys are listed under Configuration > API keys.":::

## Next steps

In this how-to guide, you learned how to create an API key for Azure Managed Grafana. To learn how to call Grafana APIs, see:

> [!div class="nextstepaction"]
> [Call Grafana APIs](how-to-api-calls.md)
