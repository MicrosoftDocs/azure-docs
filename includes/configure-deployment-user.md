## Configure a deployment user  

For FTP and local Git, you must have a deployment user configured on the server to authenticate your deployment.

> [!NOTE]
> A deployment user is required for FTP and Local Git deployment to a Web App.
> The `username` and `password` are account-level. They are different from your Azure Subscription credentials.
>

Run the [az appservice web deployment user set](/cli/azure/appservice/web/deployment/user#set) command to create your deployment credentials.

```azurecli
az appservice web deployment user set --user-name <username> --password <password>
```

The username must be unique and the password must be strong. If you get a ` 'Conflict'. Details: 409` error, change the username. If you get a ` 'Bad Request'. Details: 400` error, use a stronger password.

You only need to create this deployment user once; you can use it for all your Azure deployments.

Record the username and password, as they are used later in a later step when you deploy the app.