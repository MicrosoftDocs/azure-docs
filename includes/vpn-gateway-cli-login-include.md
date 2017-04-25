Log in to your Azure subscription with the [az login](/cli/azure/#login) command and follow the on-screen directions.

```azurecli
az login
```

If you have more than one Azure subscription, list the subscriptions for the account.

```azurecli
Az account list --all
```

Specify the subscription that you want to use.

```azurecli
Az account set --subscription <replace_with_your_subscription_id>
```

