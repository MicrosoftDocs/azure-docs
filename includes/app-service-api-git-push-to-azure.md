Use the Azure CLI to get the remote deployment URL for your API App. In the following command, replace *\<app_name>* with your web app's name.

```azurecli-interactive
az webapp deployment source config-local-git --name <app_name> --resource-group myResourceGroup --query url --output tsv
```

Configure your local Git deployment to be able to push to the remote.

```bash
git remote add azure <URI from previous step>
```

Push to the Azure remote to deploy your app. You are prompted for the password you created earlier when you created the deployment user. Make sure that you enter the password you created in earlier in the quickstart, and not the password you use to log in to the Azure portal.

```bash
git push azure master
```
