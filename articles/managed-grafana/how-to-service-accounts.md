---
title: How to use service accounts in Azure Managed Grafana
description: In this guide, learn how to use service accounts in Azure Managed Grafana.
author: maud-lv
ms.author: malev
ms.service: managed-grafana
ms.topic: how-to 
ms.date: 11/30/2022
---

# How to use service accounts in Azure Managed Grafana

In this guide, learn how to use service accounts. Service accounts are used to run automated operations and authenticate applications in Grafana with the Grafana API.

Common use cases include:

- Provisioning or configuring dashboards
- Scheduling reports
- Defining alerts
- Setting up an external SAML authentication provider
- Interacting with Grafana without signing in as a user

> [!TIP]
> To switch to using service accounts, in Grafana instances created before the release of Grafana 9.1, go to **Configuration > API keys and select Migrate to service accounts now**.  Select **Yes, migrate now**. Each existing API keys will be automatically migrated into a service account with a token. The service account will be created with the same permission as the API Key and current API keys will continue to work as before.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- An Azure Managed Grafana instance. If you don't have one yet, [create an Azure Managed Grafana instance](./quickstart-managed-grafana-portal.md).

## Enable service accounts

To enable service accounts, start by enabling API keys. API keys are disabled by default in Azure Managed Grafana. If your existing Grafana workspace doesn't have API keys enabled, you can enable them by updating the preference settings of your Grafana instance.

### [Portal](#tab/azure-portal)

  1. In the Azure portal, under **Settings**, select **Configuration**, and then under **API keys**, select **Enable**.

      :::image type="content" source="media/create-api-keys/enable-api-keys.png" alt-text="Screenshot of the Azure platform. Enable API keys.":::
  1. Select **Save** to confirm that you want to activate the creation of API keys in Azure Managed Grafana.

### [Azure CLI](#tab/azure-cli)

Run the [az grafana update](/cli/azure/grafana#az-grafana-update) command to enable the creation of API keys in an existing Azure Managed Grafana instance. In the command below, replace `<azure-managed-grafana-name>` with the name of the Azure Managed Grafana instance to update.

```azurecli-interactive
az grafana update --name <azure-managed-grafana-name> --api-keys Enabled
```

---

## Create a service account

1. Go to your Grafana instance endpoint, and under **Configuration**, select **Service accounts**.
1. Select **Add service account**, and enter a **Display name** and a **Role** for your new Grafana service account: *Viewer*, *Editor* or *Admin* and select **Create**.

   :::image type="content" source="media/service-accounts/service-accounts.png" alt-text="Screenshot of Grafana. Add service account page.":::
1. A notification *Service account successfully created* appears and a list of existing service accounts is displayed.

## Add a service account token

Once you've created a service account, add one or more access tokens. Access tokens are generated strings used to authenticate to the Grafana API.

1. To create a service account token, select **Add token**.
1. Use the automatically generated **Display name** or enter a name of your choice, and optionally select an **Expiration date** or keep the default option to set no expiry date.

   :::image type="content" source="media/service-accounts/add-service-account-token.png" alt-text="Screenshot of the Azure platform. Add service account token page.":::

1. Select **Generate token**, and take note of the token generated. This token will only be shown once, so make sure you save it, at loosing a token requires creating a new one.

## Update or delete a service account

Optionally select your service account and update it in the following way:

- under **Information**, edit the service account name by selecting **Edit**
- under **Information**, edit the role by selecting the role name and selecting another role
- under **Tokens**, delete a token by selecting **Delete (x)**
- at the top of the page, select **Delete service account** to delete the Grafana service account, then select **Delete service account** to confirm. Deleting a service account is final and a service account can't be recovered once deleted.
- at the top of the page, select **Disable service account** to disable the Grafana service account, then select **Disable service account** to confirm. Disabled service accounts can be re-enabled by selecting **Enable service account**.

The notification *Service account updated* is automatically displayed as soon as you update a parameter.

## Next steps

In this how-to guide, you learned how to create an API key for Azure Managed Grafana. When you're ready, start using service accounts as the new way to authenticate applications that interact with Grafana:

> [!div class="nextstepaction"]
> [Enable zone redundancy](how-to-enable-zone-redundancy.md)
