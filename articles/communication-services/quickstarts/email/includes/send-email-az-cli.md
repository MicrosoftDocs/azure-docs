---
title: include file
description: include file
author: mayssamm
manager: ankita
services: azure-communication-services
ms.author: mayssamm
ms.date: 02/03/2023
ms.topic: include
ms.service: azure-communication-services
ms.custom: include files
---

Get started with Azure Communication Services by using the Azure CLI communication extension to send Email messages.

Completing this quick start incurs a small cost of a few USD cents or less in your Azure account.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure Email Communication Services resource created and ready with a provisioned domain. [Get started with creating an Email Communication Resource](../create-email-communication-resource.md).
- An active Azure Communication Services resource connected to an Email Domain and its connection string. [Get started by connecting an Email Communication Resource with a Azure Communication Resource](../connect-email-communication-resource.md).
- The latest [Azure CLI](/cli/azure/install-azure-cli-windows?tabs=azure-cli).

### Prerequisite check
- In a terminal or command window, run the `az --version` command to check that Azure CLI and the communication extension are installed.
- To view the domains verified with your Email Communication Services resource, sign in to the [Azure portal](https://portal.azure.com/). Locate your Email Communication Services resource and open the **Provision domains** tab from the left navigation pane.

## Setting up
### Add the extension
Add the Azure Communication Services extension for Azure CLI by using the `az extension` command.

```azurecli-interactive
az extension add --name communication
```

### Sign in to Azure CLI
You need to [sign in to Azure CLI](/cli/azure/authenticate-azure-cli). You can sign in running the ```az login``` command from the terminal and providing your credentials.


### Store your connection string in an environment variable 

You can configure the `AZURE_COMMUNICATION_CONNECTION_STRING` environment variable to use Azure CLI keys operations without having to use `--connection_string` to pass in the connection string. To configure an environment variable, open a console window and select your operating system from the below tabs. Replace `<connectionString>` with your actual connection string.

##### [Windows](#tab/windows)

```console
setx AZURE_COMMUNICATION_STRING "<yourConnectionString>"
```

After you add the environment variable, you may need to restart any running programs that will need to read the environment variable, including the console window. For example, if you're using Visual Studio as your editor, restart Visual Studio before running the example. 

##### [macOS](#tab/unix)

Edit your **`.zshrc`**, and add the environment variable:

```bash
export AZURE_COMMUNICATION_STRING="<connectionString>"
```

After you add the environment variable, run `source ~/.zshrc` from your console window to make the changes effective. If you created the environment variable with your IDE open, you may need to close and reopen the editor, IDE, or shell in order to access the variable. 

##### [Linux](#tab/linux)

Edit your **`.bash_profile`**, and add the environment variable:

```bash
export AZURE_COMMUNICATION_STRING="<connectionString>"
```

After you add the environment variable, run `source ~/.bash_profile` from your console window to make the changes effective. If you created the environment variable with your IDE open, you may need to close and reopen the editor, IDE, or shell in order to access the variable. 

---

## Send an email message

```azurecli-interactive
az communication email send
	--connection-string "yourConnectionString"
	--sender "<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>"
	--to "<emailalias@emaildomain.com>"
	--subject "Welcome to Azure Communication Services Email" --text "This email message is sent from Azure Communication Services Email using Azure CLI." 
```

Make these replacements in the code:

- Replace `<yourConnectionString>` with your connection string.
- Replace `<emailalias@emaildomain.com>` with the email address you would like to send a message to.
- Replace `<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>` with the MailFrom address of your verified domain.

The above command also performs a polling on the messageId and returns the status of the email delivery. The status can be one of the following:

[!INCLUDE [Email Message Status](./email-operation-status.md)]

### Optional parameters

The following optional parameters are available in Azure CLI.

- `--html` can be used instead of `--text` for html email body.

- `--importance` sets the importance type for the email. Known values are: high, normal, and low. Default is normal.

- `--to` sets the list of email recipients.

- `--cc` sets carbon copy email addresses.

- `--bcc` sets blind carbon copy email addresses.

- `--reply-to` sets Reply-To email address.

- `--disable-tracking` indicates whether user engagement tracking should be disabled for this request.

- `--attachments` sets the list of email attachments.

- `--attachment-types` sets the list of email attachment types, in the same order of attachments.

Also, you can use a list of recipients with `--cc` and `--bcc` similar to `--to`. There needs to be at least one recipient in `--to` or `--cc` or `--bcc`.
 
