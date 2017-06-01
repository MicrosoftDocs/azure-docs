## Configure a deployment user  

Create deployment credentials with the [az appservice web deployment user set](/cli/azure/appservice/web/deployment/user#set) command.

A deployment user is required for FTP and local Git deployment to a web app. The user name and password are account level. They are different from your Azure subscription credentials.

In the following command, replace *\<user-name>* and *\<password>* with a new user name and password.

```azurecli
az appservice web deployment user set --user-name <username> --password <password>
```

The user name must be unique, and the password must be strong. If you get a ` 'Conflict'. Details: 409` error, change the username. If you get a ` 'Bad Request'. Details: 400` error, use a stronger password.

You only need to create this deployment user once; you can use it for all your Azure deployments.

Record the user name and password for use in later steps when you deploy the app.