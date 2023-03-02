For this script, use Azure CLI locally as it takes too long to run in Cloud Shell. 

### Sign in to Azure

Use the following script to sign in using a specific subscription.

```azurecli-interactive
subscription="<subscriptionId>" # add subscription here

az account set -s $subscription # ...or use 'az login'
```

For more information, see [set active subscription](/cli/azure/account#az-account-set) or [log in interactively](/cli/azure/reference-index#az-login)
