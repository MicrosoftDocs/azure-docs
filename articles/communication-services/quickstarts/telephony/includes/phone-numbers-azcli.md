## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Install [Azure CLI](/cli/azure/install-azure-cli-windows?tabs=azure-cli).
- A deployed Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).
- A purchased phone number.

## Setting up
### Add the extension
Add the Azure Communication Services extension for Azure CLI by using the `az extension` command.

```azurecli-interactive
az extension add --name communication
```

### Store your connection string in an environment variable

To configure an environment variable, open a console window and select your operating system from the below tabs. Replace `<yourconnectionstring>` with your actual connection string.

#### [Windows](#tab/windows)

Open a console window and enter the following command:

```console
setx AZURE_COMMUNICATION_CONNECTION_STRING "<yourconnectionstring>"
```

After you add the environment variable, you may need to restart any running programs that will need to read the environment variable, including the console window. For example, if you are using Visual Studio as your editor, restart Visual Studio before running the example.

#### [macOS](#tab/unix)

Edit your **.zshrc**, and add the environment variable:

```bash
export AZURE_COMMUNICATION_CONNECTION_STRING="<yourconnectionstring>"
```

After you add the environment variable, run `source ~/.zshrc` from your console window to make the changes effective. If you created the environment variable with your IDE open, you may need to close and reopen the editor, IDE, or shell in order to access the variable.

#### [Linux](#tab/linux)

Edit your **.bash_profile**, and add the environment variable:

```bash
export AZURE_COMMUNICATION_CONNECTION_STRING="<yourconnectionstring>"
```

After you add the environment variable, run `source ~/.bash_profile` from your console window to make the changes effective. If you created the environment variable with your IDE open, you may need to close and reopen the editor, IDE, or shell in order to access the variable.

---

## Operations

Before running any commands, you will need to first [sign in to Azure CLI](/cli/azure/authenticate-azure-cli). You can do this through the terminal using the ```az login``` command and providing your credentials.

### Get purchased phone number details

Run the following command to get the phone number details for a purchased phone number.

```azurecli-interactive
az communication phonenumbers show-phonenumber --phonenumber +18001234567
```

### List purchased phone number(s)

Run the following command to retrieve all of the purchased phone numbers.

```azurecli-interactive
az communication phonenumbers list-phonenumbers
```