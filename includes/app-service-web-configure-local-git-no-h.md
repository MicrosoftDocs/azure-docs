Configure local Git deployment to the web app with the [az appservice web source-control config-local-git](/cli/azure/appservice/web/source-control#config-local-git) command.

App Service supports several ways to deploy content to a web app, such as FTP, local Git, GitHub, Visual Studio Team Services, and Bitbucket. For this quickstart, you deploy by using local Git. That means you deploy by using a Git command to push from a local repository to a repository in Azure. 

In the following command, replace *\<app_name>* with your web app's name.

```azurecli-interactive
az appservice web source-control config-local-git --name <app_name> --resource-group myResourceGroup --query url --output tsv
```

The output has the following format:

```
https://<username>@<app_name>.scm.azurewebsites.net:443/<app_name>.git
```

The `<username>` is the [deployment user](#configure-a-deployment-user) that you created in a previous step.

Save the URI shown; you'll use it in the next step. 
