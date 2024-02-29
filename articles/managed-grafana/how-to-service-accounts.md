---
title: How to use service accounts in Azure Managed Grafana
description: In this guide, learn how to use service accounts in Azure Managed Grafana.
author: maud-lv
ms.author: malev
ms.service: managed-grafana
ms.custom: devx-track-azurecli
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

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- An Azure Managed Grafana instance. If you don't have one yet, [create an Azure Managed Grafana instance](./quickstart-managed-grafana-portal.md).

## Enable service accounts

Service accounts are disabled by default in Azure Managed Grafana. If your existing Grafana workspace doesn't have service accounts enabled, you can enable them by updating the preference settings of your Grafana instance.

### [Portal](#tab/azure-portal)

  1. In the Azure portal, under **Settings**, select **Configuration**, and then under **API keys and service accounts**, select **Enable**.

      :::image type="content" source="media/service-accounts/enable.png" alt-text="Screenshot of the Azure platform. Enable service accounts.":::
  1. Select **Save** to confirm that you want to enable API keys and service accounts in Azure Managed Grafana.

### [Azure CLI](#tab/azure-cli)

1. Azure Managed Grafana CLI extension 0.3.0 or above is required. To update your extension, run `az extension update --name amg`.
1. Run the [az grafana update](/cli/azure/grafana#az-grafana-update) command to enable the creation of API keys and service accounts in an existing Azure Managed Grafana instance. In the command below, replace `<azure-managed-grafana-name>` with the name of the Azure Managed Grafana instance to update.

```azurecli-interactive
az grafana update --name <azure-managed-grafana-name> ---service-account Enabled
```

---

## Create a service account

Follow the steps below to create a new Grafana service account and list existing service accounts:

### [Portal](#tab/azure-portal)

1. Go to your Grafana instance endpoint, and under **Configuration**, select **Service accounts**.
1. Select **Add service account**, and enter a **Display name** and a **Role** for your new Grafana service account: *Viewer*, *Editor* or *Admin* and select **Create**.

   :::image type="content" source="media/service-accounts/service-accounts.png" alt-text="Screenshot of Grafana. Add service account page.":::
1. The page displays the notification *Service account successfully created* and some information about your new service account.
1. Select the back arrow sign to view a list of all the service accounts of your Grafana instance.

### [Azure CLI](#tab/azure-cli)

Run the `az grafana service-account create` command to create a service account. Replace the placeholders `<azure-managed-grafana-name>`, `<service-account-name>` and `<role>` with your own information.

Available roles: `Admin`, `Editor`, `Viewer`.

```azurecli-interactive
az grafana service-account create --name <azure-managed-grafana-name> --service-account <service-account-name> --role <role>
```

#### List service accounts

Run the `az grafana service-account list` command to get a list of all service accounts that belong to a given Azure Managed Grafana instance. Replace `<azure-managed-grafana-name>` with the name of your Azure Managed Grafana workspace.

```azurecli-interactive
az grafana service-account list --name <azure-managed-grafana-name> --output table
```

Example of output:

```output
AvatarUrl             IsDisabled    Login        Name        OrgId    Role    Tokens
--------------------  ------------  -----------  ----------  -------  ------  --------
/avatar/abc12345678   False         sa-account1  account1    1        Viewer  0
```

#### Display service account details

Run the `az grafana service-account show` command to get the details of a service account. Replace `<azure-managed-grafana-name>` and `<service-account-name>` with your own information.

```azurecli-interactive
az grafana service-account show --name <azure-managed-grafana-name> --service-account <service-account-name>
```

---

## Add a service account token and review tokens

Once you've created a service account, add one or more access tokens. Access tokens are generated strings used to authenticate to the Grafana API.

### [Portal](#tab/azure-portal)

1. To create a service account token, select **Add token**.
1. Use the automatically generated **Display name** or enter a name of your choice, and optionally select an **Expiration date** or keep the default option to set no expiry date.

   :::image type="content" source="media/service-accounts/add-service-account-token.png" alt-text="Screenshot of the Azure platform. Add service account token page.":::

1. Select **Generate token**, and take note of the token generated. This token will only be shown once, so make sure you save it, as loosing a token requires creating a new one.
1. Select the service account to access information about your service account, including a list of all associated tokens.

### [Azure CLI](#tab/azure-cli)

#### Create a new token

1. Create a Grafana service account token with `az grafana service-account token create`. Replace the placeholders `<azure-managed-grafana-name>`, `<service-account-name>` and `<token-name>` with your own information.

    Optionally set an expiry time:

    | Parameter     | Description                                                                                                    | Example           |
    |---------------|----------------------------------------------------------------------------------------------------------------|-------------------|
    | `--time-to-live` | Tokens have an unlimited expiry date by default. Set an expiry time to disable the token after a given time. Use `s` for seconds, `m` for minutes, `h` for hours, `d` for days, `w` for weeks, `M` for months or `y` for years. | `15d`      |

    ```azurecli-interactive
    az grafana service-account token create --name <azure-managed-grafana-name> --service-account <service-account-name> --token <token-name> --time-to-live 15d
    ```

1. Take note of the generated token. This token will only be shown once, so make sure you save it, as loosing a token requires creating a new one.

#### List service account tokens

Run the `az grafana service-account token list` command to get a list of all tokens that belong to a given service account. Replace the placeholders `<azure-managed-grafana-name>` and `<service-account-name>` with your own information.

```azurecli-interactive
az grafana service-account token list --name <azure-managed-grafana-name> --service-account <service-account-name> --output table
```

Example of output:

```output
Created               Expiration            HasExpired    Name    SecondsUntilExpiration
--------------------  --------------------  ------------  ------  ------------------------
2022-12-07T11:40:45Z  2022-12-08T11:40:45Z  False         token1  85890.870731556
2022-12-07T11:42:35Z  2022-12-22T11:42:35Z  False         token2  0
```

---

## Edit a service account

In this section, learn how to update a Grafana service account in the following ways:

- Edit the name of a service account
- Edit the role of a service account
- Disable a service account
- Enable a service account

### [Portal](#tab/azure-portal)

Actions:

- To edit the name, select the service account and under **Information** select **Edit**.
- To edit the role, select the service account and under **Information**,  select the role and choose another role name.
- To disable a service account, select a service account and at the top of the page select **Disable service account**, then select **Disable service account** to confirm. Disabled service accounts can be re-enabled by selecting **Enable service account**.

:::image type="content" source="media/service-accounts/edit-service-account.png" alt-text="Screenshot of the Azure platform. Edit service account page.":::

The notification *Service account updated* is instantly displayed.

### [Azure CLI](#tab/azure-cli)

Edit a service account with `az grafana service-account update`. Replace the placeholders `<azure-managed-grafana-name>`, and `<service-account-name>` with your own information and use one or several of the following parameters:

| Parameter       | Description                                                                                                 |
|-----------------|-------------------------------------------------------------------------------------------------------------|
| `--is-disabled` | Enter `--is-disabled true` disable a service account, or `--is-disabled false` to enable a service account. |
| `--name`        | Enter another name for your service account.                                                                |
| `--role`        | Enter another role for your service account. Available roles: `Admin`, `Editor`, `Viewer`.                  |

```azurecli-interactive
az grafana service-account update --name <azure-managed-grafana-name> --service-account <service-account-name> --role <role> --enabled false
```

To disable a service account run the `az grafana update` command and use the option `--is-disabled true`. To enable a service account, use `--is-disabled false`.

```azurecli-interactive
az grafana update --service-account Disabled --name <service-account-name>
```

---

## Delete a service account

### [Portal](#tab/azure-portal)

To delete a Grafana service account, select a service account and at the top of the page select **Delete service account**, then select **Delete service account** to confirm. Deleting a service account is final and a service account can't be recovered once deleted.

:::image type="content" source="media/service-accounts/delete.png" alt-text="Screenshot of the Azure platform. Deleting service account page.":::

### [Azure CLI](#tab/azure-cli)

To delete a service account, run the `az grafana service-account delete` command. Replace the placeholders `<azure-managed-grafana-name>` and `<service-account-name>` with your own information.

```azurecli-interactive
az grafana service-account delete --name <azure-managed-grafana-name> --service-account <service-account-name>
```

---

## Delete a service account token

### [Portal](#tab/azure-portal)

To delete a service account token, select a service account and under **Tokens**, select **Delete (x)**. Select **Delete** to confirm.

:::image type="content" source="media/service-accounts/delete-token.png" alt-text="Screenshot of the Azure platform. Deleting service account token page.":::

### [Azure CLI](#tab/azure-cli)

To delete a service account, run the `az grafana service-account token delete` command. Replace the placeholders `<azure-managed-grafana-name>`, `<service-account-name>` and `<token-name>` with your own information.

```azurecli-interactive
az grafana service-account token delete --name <azure-managed-grafana-name> --service-account <service-account-name> --toke <token-name>
```

---

## Next steps

In this how-to guide, you learned how to create and manage service accounts and tokens to run automated operations in Azure Managed Grafana. When you're ready, explore more articles:

> [!div class="nextstepaction"]
> [Enable zone redundancy](how-to-enable-zone-redundancy.md)
