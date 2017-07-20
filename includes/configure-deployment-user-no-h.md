Create deployment credentials with the [az webapp deployment user set](/cli/azure/webapp/deployment/user#set) command.

A deployment user is required for FTP and local Git deployment to a web app. The user name and password are account level. They are different from your Azure subscription credentials.

In the following command, replace *\<user-name>* and *\<password>* with a new user name and password.

```azurecli-interactive
az webapp deployment user set --user-name <username> --password <password>
```

The user name must be unique. The password must be at least eight characters long, with two of the following three elements:  letters, numbers, symbols. If you get a ` 'Conflict'. Details: 409` error, change the username. If you get a ` 'Bad Request'. Details: 400` error, use a stronger password.

You only need to create this deployment user once; you can use it for all your Azure deployments.

> [!NOTE]
> Record the user name and password. You need them to deploy the web app later.
>
>