## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).
- Install [Azure CLI](/cli/azure/install-azure-cli-windows?tabs=azure-cli).

- A purchased phone number.

## Setting up
### Add the extension
Add the Azure Communication Services extension for Azure CLI by using the `az extension` command.

```azurecli-interactive
az extension add --name communication
```

### Sign in to Azure CLI
You'll need to [sign in to Azure CLI](/cli/azure/authenticate-azure-cli). You can sign in running the ```az login``` command from the terminal and providing your credentials.

## Operations

### List purchased phone number(s)

Run the following command to retrieve all of the purchased phone numbers.

```azurecli-interactive
az communication phonenumber list --connection-string "<yourConnectionString>"
```

Make this replacement in the code:

- Replace `<yourConnectionString>` with your connection string.

### Get purchased phone number details

Run the following command to get the phone number details for a purchased phone number.

```azurecli-interactive
az communication phonenumber show --phonenumber <purchasedPhoneNumber> --connection-string "<yourConnectionString>"
```
Make these replacements in the code:

- Replace `<purchasedPhoneNumber>` with a phone number that's associated with your Communication Services resource.
- Replace `<yourConnectionString>` with your connection string.

### (Optional) Use Azure CLI phone numbers operations without passing in a connection string

You can configure the `AZURE_COMMUNICATION_CONNECTION_STRING` environment variable to use Azure CLI phone numbers operations without having to use `--connection_string` to pass in the connection string. To configure an environment variable, open a console window and select your operating system from the below tabs. Replace `<yourConnectionString>` with your actual connection string.

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