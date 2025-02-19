---
title: How to use service accounts in Azure Managed Grafana
description: In this guide, learn how to enable service accounts and add a service account token for Azure Managed Grafana.
author: maud-lv
ms.author: malev
ms.service: azure-managed-grafana
ms.custom: devx-track-azurecli
ms.topic: conceptual
ms.date: 11/05/2024
#customer intent: As a Grafana administrator, I want to use service accounts in Azure Managed Grafana so that I can automate operations add authenticate applications in Grafana.
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

If your existing Grafana workspace doesn't have service accounts enabled, enable them by updating the preference settings of your Grafana instance using the Azure portal or the Azure CLI.

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

### [Grafana UI](#tab/grafana-ui)

1. Go to your Grafana instance endpoint, then select **Users and access** > **Service accounts** from the left menu, and **Add service account**.

    :::image type="content" source="media/service-accounts/service-accounts.png" alt-text="Screenshot of Grafana. Add service account page.":::

1. Enter a **Display name** and a **Role** for your new Grafana service account from the options *No basic role*, *Viewer*, *Editor* or *Admin*, and select **Create**. No role is assigned by default.

1. Once the service account is created, Grafana displays information about the new service account, including its creation date, existing tokens and permissions associated with it. You will create a first token in a next step.

1. Optionally select **Service accounts** from the left menu to view a list of all the service accounts in your Grafana instance.

### [Azure CLI](#tab/cli)

1. Run the `az grafana service-account create` command to create a service account. Replace the placeholders `<azure-managed-grafana-name>`, `<service-account-name>` and `<role>` with your own information.

    Available roles: `Admin`, `Editor`, `Viewer`.
    
    ```azurecli-interactive
    az grafana service-account create --name <azure-managed-grafana-name> --service-account <service-account-name> --role <role>
    ```

1. Run the `az grafana service-account list` command to get a list of all service accounts that belong to a given Azure Managed Grafana instance. Replace `<azure-managed-grafana-name>` with the name of your Azure Managed Grafana workspace.
    
    ```azurecli
    az grafana service-account list --name <azure-managed-grafana-name> --output table
    ```
    
    Example of output:
    
    ```output
    AvatarUrl             IsDisabled    Login        Name        OrgId    Role    Tokens
    --------------------  ------------  -----------  ----------  -------  ------  --------
    /avatar/abc12345678   False         sa-account1  account1    1        Viewer  0
    ```

1. Run the `az grafana service-account show` command to get the details of a service account. Replace `<azure-managed-grafana-name>` and `<service-account-name>` with your own information.

    ```azurecli-interactive
    az grafana service-account show --name <azure-managed-grafana-name> --service-account <service-account-name>
    ```
---

## Add a service account token

Once you've created a service account, add one or more access tokens. Access tokens are generated strings used to authenticate with the Grafana API without using a username and password. Each token is associated with specific permissions, allowing you to control the level of access granted to different users or applications. Tokens can be created, managed, and revoked as needed.

### [Grafana UI](#tab/grafana-ui)

In the Grafana UI:

1. To create a service account token, select **Add service account token**.
1. Use the automatically generated **Display name** or enter a name of your choice. By default, the expiration date is set to one day after its creation date. Optionally update the suggested **Expiration date** or select **No expiration**. 

   :::image type="content" source="media/service-accounts/add-service-account-token.png" alt-text="Screenshot of the Azure platform. Add service account token page.":::

1. Select **Generate token**. The token is displayed only once, so make sure to copy and save it securely. If you lose this token, you will need to generate a new one.
1. The token is now listed in the service account details.

### [Azure CLI](#tab/cli)

In the Azure CLI:

1. Create a Grafana service account token with `az grafana service-account token create`. Replace the placeholders `<azure-managed-grafana-name>`, `<service-account-name>` and `<token-name>` with your own information.

    Optionally set an expiry time:

    | Parameter     | Description                                                                                                    | Example           |
    |---------------|----------------------------------------------------------------------------------------------------------------|-------------------|
    | `--time-to-live` | Tokens have a one day expiry time by default. Optionally disable or edit the expiry time to disable the token after a given time. Use `s` for seconds, `m` for minutes, `h` for hours, `d` for days, `w` for weeks, `M` for months or `y` for years. | `15d`      |

    ```azurecli-interactive
    az grafana service-account token create --name <azure-managed-grafana-name> --service-account <service-account-name> --token <token-name> --time-to-live 15d
    ```

1. Take note of the generated token and save it securely. If you lose this token, you will need to generate a new one.


1. Run the `az grafana service-account token list` command to get a list of all tokens that belong to a given service account. Replace the placeholders `<azure-managed-grafana-name>` and `<service-account-name>` with your own information.

    ```azurecli-interactive
    az grafana service-account token list --name <azure-managed-grafana-name> --service-account <service-account-name> --output table
    ```

    Example of output:

    ```output
    Created               Expiration            HasExpired    Name    SecondsUntilExpiration
    --------------------  --------------------  ------------  ------  ------------------------
    2024-11-05T15:09:24Z  2024-11-06T14:48:51Z  False         token1  84388.80530215
    ```

---

## Edit a service account

In this section, you learn how to update a Grafana service account.

### [Grafana UI](#tab/grafana-ui)

Actions:

- To edit the name, select the service account and under **Information** select **Edit**.
- To edit the role, select the service account and under **Information**,  select the role and choose another role name.
- To disable a service account, select a service account and at the top of the page select **Disable service account**, then select **Disable service account** to confirm. Disabled service accounts can be re-enabled by selecting **Enable service account**.

:::image type="content" source="media/service-accounts/edit-service-account.png" alt-text="Screenshot of the Azure platform. Edit service account page.":::

The notification *Service account updated* is instantly displayed.

### [Azure CLI](#tab/cli)

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

### [Grafana UI](#tab/grafana-ui)

To delete a Grafana service account, select a service account and at the top of the page select **Delete service account**, then select **Delete service account** to confirm. Deleting a service account is final and a service account can't be recovered once deleted.

### [Azure CLI](#tab/cli)

To delete a service account, run the `az grafana service-account delete` command. Replace the placeholders `<azure-managed-grafana-name>` and `<service-account-name>` with your own information.

```azurecli-interactive
az grafana service-account delete --name <azure-managed-grafana-name> --service-account <service-account-name>
```

---

## Delete a service account token

### [Grafana UI](#tab/grafana-ui)

To delete a service account token, select a service account and under **Tokens**, select **Delete (x)**. Select **Delete** to confirm.

:::image type="content" source="media/service-accounts/delete-token.png" alt-text="Screenshot of the Azure platform. Deleting service account token page.":::

### [Azure CLI](#tab/cli)

To delete a service account, run the `az grafana service-account token delete` command. Replace the placeholders `<azure-managed-grafana-name>`, `<service-account-name>` and `<token-name>` with your own information.

```azurecli-interactive
az grafana service-account token delete --name <azure-managed-grafana-name> --service-account <service-account-name> --token <token-name>
```

---

## Next steps

In this how-to guide, you learned how to create and manage service accounts and tokens to run automated operations in Azure Managed Grafana. When you're ready, explore more articles:

> [!div class="nextstepaction"]
> [Enable zone redundancy](how-to-enable-zone-redundancy.md)
