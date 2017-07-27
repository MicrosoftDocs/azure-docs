Configure local Git deployment to the API app with the [az webapp source-control config-local-git](/cli/azure/appservice/web/source-control#config-local-git) command.   

App Service supports several ways to deploy content to a web app, such as FTP, local Git, GitHub, Visual Studio Team Services, and Bitbucket. For this quickstart, you deploy by using local Git. That means you deploy by using a Git command to push from a local repository to a repository in Azure.  

Use the script below to set the account-level deployment credentials you'll use when pushing the code, making sure to include your own values for the user name and password.   

```azurecli-interactive
az webapp deployment user set --user-name <desired user name> --password <desired password>
```
