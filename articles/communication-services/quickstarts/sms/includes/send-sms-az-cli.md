---
title: include file
description: include file
services: azure-communication-services
author: mayssamm
manager: ankita

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 06/12/2022
ms.topic: include
ms.custom: include file
ms.author: mayssamm
---

Get started with Azure Communication Services by using the Communication module in Azure CLI to send SMS messages.

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).
- An SMS-enabled telephone number. [Get a phone number](../../telephony/get-phone-number.md).
- The latest [Azure CLI](/cli/azure/install-azure-cli-windows?tabs=azure-cli) version for your operating system.

### Prerequisite check

- In a terminal or command window, run `az --version` to check that Azure CLI is installed. 

## Setting up

### Install the communication module

Run the following command in a terminal or command window to install the communication module.

```azurecli-interactive
az extension add --name communication
```

### Sign in to Azure CLI
You'll need to [sign in to Azure CLI](/cli/azure/authenticate-azure-cli). You can sign in running the ```az login``` command from the terminal and providing your credentials.

### Make sure you're using the correct subscription

If you have multiple subscriptions in your account, make sure that you're using the correct one for this tutorial.

In a terminal or command windows, run the following command to check the current subscription.

```azurecli-interactive
az account show
```

If you need to change subscription, you can do that by running the following command.

```azurecli-interactive
az account set --subscription "<yourSubcriptionId>"
```

You need to replace `<yourSubscriptionId>` with your actual subscription ID, which you can find in the Subscriptions section in Azure portal.

### (Optional) Use Azure CLI sms operations without passing in a connection string

You can configure the `AZURE_COMMUNICATION_CONNECTION_STRING` environment variable to use Azure CLI sms operations without having to use `--connection_string` to pass in the connection string. To configure an environment variable, open a console window and select your operating system from the below tabs. Replace `<yourConnectionString>` with your actual connection string.

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

## Operations

## Send a 1:1 SMS message

To send an SMS message to a single recipient, call the `send` method from the sms module with a single recipient phone number. 

```azurecli-interactive
az communication sms send --sender "<fromPhoneNumber>" --recipient "<toPhoneNumber>" --message "Hello world via SMS for Azure CLI!" --connection-string "<yourConnectionString>"
```

Make these replacements in the code:

- Replace `<fromPhoneNumber>` with an SMS-enabled phone number that's associated with your Communication Services resource.
- Replace `<toPhoneNumber>` with a phone number that you'd like to send a message to.
- Replace `<yourConnectionString>` with your connection string.

> [!WARNING]
> Provide phone numbers in E.164 international standard format, for example, +14255550123. The value for `<fromPhoneNumber>` can also be a short code, for example, 23456 or an alphanumeric sender ID, for example, CONTOSO.

## Send a 1:N SMS message

To send an SMS message to a list of recipients, call the `send` method from the sms module with multiple recipient phone numbers. 

```azurecli-interactive
az communication sms send --sender "<fromPhoneNumber>" --recipient "<toPhoneNumber1>" "<toPhoneNumber2>" "<toPhoneNumber3>" --message "Hello world via SMS for Azure CLI!" --connection-string "<yourConnectionString>"
```

Make these replacements in the code:

- Replace `<fromPhoneNumber>` with an SMS-enabled phone number that's associated with your Communication Services resource.
- Replace `<toPhoneNumberN>` with the N'th phone number that you'd like to send a message to.
- Replace `<yourConnectionString>` with your connection string.

> [!WARNING]
> Provide phone numbers in E.164 international standard format, for example, +14255550123. The value for `<fromPhoneNumber>` can also be a short code, for example, 23456 or an alphanumeric sender ID, for example, CONTOSO.
