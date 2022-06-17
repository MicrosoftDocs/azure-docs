## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Install [Azure CLI](/cli/azure/install-azure-cli-windows?tabs=azure-cli).

## Setting up
### Add the extension
Add the Azure Communication Services extension for Azure CLI by using the `az extension` command.

```azurecli-interactive
az extension add --name communication
```

### Sign in to Azure CLI
You will need to [sign in to Azure CLI](/cli/azure/authenticate-azure-cli). You can do this through the terminal using the ```az login``` command and providing your credentials.

### Create an ACS resource and get your connection string
If you don't have an ACS resource, you create one by running the command below.

```azurecli-interactive
az communication create --name "<communicationName>" --location "Global" --data-location "United States" --resource-group "<resourceGroup>"
```

You can get your connection string by running the command below.

```azurecli-interactive
az communication list-key --name "<communicationName>" --resource-group "<resourceGroup>"
```

For more information on ACS resources and connection strings, see [Create an Azure Communication Services resources](../../create-communication-resource.md)

### Store your connection string in an environment variable

To configure an environment variable, open a console window and select your operating system from the below tabs. Replace `<yourconnectionstring>` with your actual connection string.

#### [Windows](#tab/windows)

Open a console window and enter the following command:

```console
setx AZURE_COMMUNICATION_CONNECTION_STRING "<yourconnectionstring>"
```

After you add the environment variable, you may need to restart any running programs that will need to read the environment variable, including the console window. For example, if you're using Visual Studio as your editor, restart Visual Studio before running the example.

#### [macOS](#tab/unix)

Edit your **`.zshrc`**, and add the environment variable:

```bash
export AZURE_COMMUNICATION_CONNECTION_STRING="<yourconnectionstring>"
```

After you add the environment variable, run `source ~/.zshrc` from your console window to make the changes effective. If you created the environment variable with your IDE open, you may need to close and reopen the editor, IDE, or shell in order to access the variable.

#### [Linux](#tab/linux)

Edit your **`.bash_profile`**, and add the environment variable:

```bash
export AZURE_COMMUNICATION_CONNECTION_STRING="<yourconnectionstring>"
```

After you add the environment variable, run `source ~/.bash_profile` from your console window to make the changes effective. If you created the environment variable with your IDE open, you may need to close and reopen the editor, IDE, or shell in order to access the variable.

---

## Operations

> [!NOTE]
> The connection string environment variable must be set to try out operations in the embedded Docs Shell. 
> ```bash
> export AZURE_COMMUNICATION_CONNECTION_STRING="<yourconnectionstring>"
> ```

### Issue access token

Run the following command to issue an access token for your Communication Services identity.

```azurecli-interactive
az communication identity issue-access-token --scope chat voip --userid "8:acs:xxxxxx"
```

The `scopes` parameter defines a set of access token permissions and roles. For more information, see the list of supported actions in [Authenticate to Azure Communication Services](../../../concepts/authentication.md).

Access tokens are short-lived credentials that need to be reissued. Not doing so might cause a disruption of your application users' experience. The `expires_on` response property indicates the lifetime of the access token.

### Create an identity and issue an access token in the same request

Run the following command to create a Communication Services identity and issue an access token for it at the same time.

```azurecli-interactive
az communication identity issue-access-token --scope chat
```

The `scopes` parameter defines a set of access token permissions and roles. For more information, see the list of supported actions in [Authenticate to Azure Communication Services](../../../concepts/authentication.md).


## Store your access token in an environment variable

To configure an environment variable, open a console window and select your operating system from the below tabs. Replace `<youraccesstoken>` with your actual access token.

#### [Windows](#tab/windows)

Open a console window and enter the following command:

```console
setx AZURE_COMMUNICATION_ACCESS_TOKEN "<youraccesstoken>"
```

After you add the environment variable, you may need to restart any running programs that will need to read the environment variable, including the console window. For example, if you are using Visual Studio as your editor, restart Visual Studio before running the example.

#### [macOS](#tab/unix)

Edit your **`.zshrc`**, and add the environment variable:

```bash
export AZURE_COMMUNICATION_ACCESS_TOKEN="<youraccesstoken>"
```

After you add the environment variable, run `source ~/.zshrc` from your console window to make the changes effective. If you created the environment variable with your IDE open, you may need to close and reopen the editor, IDE, or shell in order to access the variable.

#### [Linux](#tab/linux)

Edit your **`.bash_profile`**, and add the environment variable:

```bash
export AZURE_COMMUNICATION_ACCESS_TOKEN="<youraccesstoken>"
```

After you add the environment variable, run `source ~/.bash_profile` from your console window to make the changes effective. If you created the environment variable with your IDE open, you may need to close and reopen the editor, IDE, or shell in order to access the variable.

---