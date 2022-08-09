## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md?#access-your-connection-strings-and-service-endpoints-using-azure-cli).
- Install [Azure CLI](/cli/azure/install-azure-cli-windows?tabs=azure-cli).

## Setting up
### Add the extension
Add the Azure Communication Services extension for Azure CLI by using the `az extension` command.

```azurecli-interactive
az extension add --name communication
```

### Sign in to Azure CLI
You'll need to [sign in to Azure CLI](/cli/azure/authenticate-azure-cli). You can sign in running the ```az login``` command from the terminal and providing your credentials.

## Operations

### Create an identity and issue an access token in the same request

Run the following command to create a Communication Services identity and issue an access token for it at the same time. The `scopes` parameter defines a set of access token permissions and roles. For more information, see the list of supported actions in [Authenticate to Azure Communication Services](../../../concepts/authentication.md).

```azurecli-interactive
az communication identity issue-access-token --scope chat --connection-string "<yourConnectionString>"
```

Make this replacement in the code:

- Replace `<yourConnectionString>` with your connection string.

### Issue access token

Run the following command to issue an access token for your Communication Services identity. The `scopes` parameter defines a set of access token permissions and roles. For more information, see the list of supported actions in [Authenticate to Azure Communication Services](../../../concepts/authentication.md).

```azurecli-interactive
az communication identity issue-access-token --scope chat --userid "<userId>" --connection-string "<yourConnectionString>"
```

Make this replacement in the code:

- Replace `<yourConnectionString>` with your connection string.
- Replace `<userId>` with your userId.

Access tokens are short-lived credentials that need to be reissued. Not doing so might cause a disruption of your application users' experience. The `expires_on` response property indicates the lifetime of the access token.

### Issue access token with multiple scopes

Run the following command to issue an access token with multiple scopes for your Communication Services identity. The `scopes` parameter defines a set of access token permissions and roles. For more information, see the list of supported actions in [Authenticate to Azure Communication Services](../../../concepts/authentication.md).

```azurecli-interactive
az communication identity issue-access-token --scope chat voip --userid "<userId>" --connection-string "<yourConnectionString>"
```

Make this replacement in the code:

- Replace `<yourConnectionString>` with your connection string.
- Replace `<userId>` with your userId.

Access tokens are short-lived credentials that need to be reissued. Not doing so might cause a disruption of your application users' experience. The `expires_on` response property indicates the lifetime of the access token.

### (Optional) Use Azure CLI identity operations without passing in a connection string

You can configure the `AZURE_COMMUNICATION_CONNECTION_STRING` environment variable to use Azure CLI identity operations without having to use `--connection_string` to pass in the connection string. To configure an environment variable, open a console window and select your operating system from the below tabs. Replace `<yourConnectionString>` with your actual connection string.

#### [Windows](#tab/windows)

Open a console window and enter the following command:

```console
setx AZURE_COMMUNICATION_CONNECTION_STRING "<yourConnectionString>"
```

After you add the environment variable, you may need to restart any running programs that will need to read the environment variable, including the console window. For example, if you're using Visual Studio as your editor, restart Visual Studio before running the example.

#### [macOS](#tab/unix)

Edit your **`.zshrc`**, and add the environment variable:

```bash
export AZURE_COMMUNICATION_CONNECTION_STRING="<yourConnectionString>"
```

After you add the environment variable, run `source ~/.zshrc` from your console window to make the changes effective. If you created the environment variable with your IDE open, you may need to close and reopen the editor, IDE, or shell in order to access the variable.

#### [Linux](#tab/linux)

Edit your **`.bash_profile`**, and add the environment variable:

```bash
export AZURE_COMMUNICATION_CONNECTION_STRING="<yourConnectionString>"
```

After you add the environment variable, run `source ~/.bash_profile` from your console window to make the changes effective. If you created the environment variable with your IDE open, you may need to close and reopen the editor, IDE, or shell in order to access the variable.

---

## Store your access token in an environment variable

To configure an environment variable, open a console window and select your operating system from the below tabs. Replace `<yourAccessToken>` with your actual access token.

#### [Windows](#tab/windows)

Open a console window and enter the following command:

```console
setx AZURE_COMMUNICATION_ACCESS_TOKEN "<yourAccessToken>"
```

After you add the environment variable, you may need to restart any running programs that will need to read the environment variable, including the console window. For example, if you're using Visual Studio as your editor, restart Visual Studio before running the example.

#### [macOS](#tab/unix)

Edit your **`.zshrc`**, and add the environment variable:

```bash
export AZURE_COMMUNICATION_ACCESS_TOKEN="<yourAccessToken>"
```

After you add the environment variable, run `source ~/.zshrc` from your console window to make the changes effective. If you created the environment variable with your IDE open, you may need to close and reopen the editor, IDE, or shell in order to access the variable.

#### [Linux](#tab/linux)

Edit your **`.bash_profile`**, and add the environment variable:

```bash
export AZURE_COMMUNICATION_ACCESS_TOKEN="<yourAccessToken>"
```

After you add the environment variable, run `source ~/.bash_profile` from your console window to make the changes effective. If you created the environment variable with your IDE open, you may need to close and reopen the editor, IDE, or shell in order to access the variable.

---