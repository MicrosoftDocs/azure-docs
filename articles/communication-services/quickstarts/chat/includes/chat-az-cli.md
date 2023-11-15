---
title: include file
description: include file
services: azure-communication-services
author: mayssamm
manager: ankita
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 08/19/2022
ms.topic: include
ms.custom: include file, devx-track-azurecli
ms.author: mayssamm
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md?#access-your-connection-strings-and-service-endpoints-using-azure-cli).
- Install [Azure CLI](/cli/azure/install-azure-cli-windows?tabs=azure-cli).
- Note your Communication Services resource endpoint. You can get the endpoint from the Azure portal. Alternatively, you can find the endpoint url in the connection string. It's the url that comes after `endpoint=` and starts with `https://`.
- A [User Access Token](../../identity/access-tokens.md). Be sure to set the scope to **chat**, and **note the token string as well as the user_id string**. You can also use the Azure CLI and run the command below with your connection string to create a user and an access token.

  ```azurecli-interactive
  az communication identity token issue --scope chat --connection-string "yourConnectionString"
  ```

  For details, see [Use Azure CLI to Create and Manage Access Tokens](../../identity/access-tokens.md?pivots=platform-azcli).

## Setting up
### Add the extension
Add the Azure Communication Services extension for Azure CLI by using the `az extension` command.

```azurecli-interactive
az extension add --name communication
```

### Sign in to Azure CLI
You'll need to [sign in to Azure CLI](/cli/azure/authenticate-azure-cli). You can sign in running the ```az login``` command from the terminal and providing your credentials.


### (Optional) Use Azure CLI identity operations without passing in an endpoint or access token

#### Store your endpoint in an environment variable

You can configure the `AZURE_COMMUNICATION_ENDPOINT` environment variable to use Azure CLI chat operations without having to use `--endpoint` to pass in the endpoint. To configure an environment variable, open a console window and select your operating system from the below tabs. Replace `<yourEndpoint>` with your actual endpoint.

##### [Windows](#tab/windows)

Open a console window and enter the following command:

```console
setx AZURE_COMMUNICATION_ENDPOINT "<yourEndpoint>"
```

After you add the environment variable, you may need to restart any running programs that will need to read the environment variable, including the console window. For example, if you're using Visual Studio as your editor, restart Visual Studio before running the example.

##### [macOS](#tab/unix)

Edit your **`.zshrc`**, and add the environment variable:

```bash
export AZURE_COMMUNICATION_ENDPOINT="<yourEndpoint>"
```

After you add the environment variable, run `source ~/.zshrc` from your console window to make the changes effective. If you created the environment variable with your IDE open, you may need to close and reopen the editor, IDE, or shell in order to access the variable.

##### [Linux](#tab/linux)

Edit your **`.bash_profile`**, and add the environment variable:

```bash
export AZURE_COMMUNICATION_ENDPOINT="<yourEndpoint>"
```

After you add the environment variable, run `source ~/.bash_profile` from your console window to make the changes effective. If you created the environment variable with your IDE open, you may need to close and reopen the editor, IDE, or shell in order to access the variable.

---

#### Store your access token in an environment variable

You can configure the `AZURE_COMMUNICATION_ACCESS_TOKEN` environment variable to use Azure CLI chat operations without having to use `--access-token` to pass in the access token. To configure an environment variable, open a console window and select your operating system from the below tabs. Replace `<yourAccessToken>` with your actual access token.

##### [Windows](#tab/windows)

Open a console window and enter the following command:

```console
setx AZURE_COMMUNICATION_ACCESS_TOKEN "<yourAccessToken>"
```

After you add the environment variable, you may need to restart any running programs that will need to read the environment variable, including the console window. For example, if you're using Visual Studio as your editor, restart Visual Studio before running the example.

##### [macOS](#tab/unix)

Edit your **`.zshrc`**, and add the environment variable:

```bash
export AZURE_COMMUNICATION_ACCESS_TOKEN="<yourAccessToken>"
```

After you add the environment variable, run `source ~/.zshrc` from your console window to make the changes effective. If you created the environment variable with your IDE open, you may need to close and reopen the editor, IDE, or shell in order to access the variable.

##### [Linux](#tab/linux)

Edit your **`.bash_profile`**, and add the environment variable:

```bash
export AZURE_COMMUNICATION_ACCESS_TOKEN="<yourAccessToken>"
```

After you add the environment variable, run `source ~/.bash_profile` from your console window to make the changes effective. If you created the environment variable with your IDE open, you may need to close and reopen the editor, IDE, or shell in order to access the variable.

 ---

## Operations

### Start a chat thread

Use the `thread create` command to create a chat thread.

```azurecli-interactive
az communication chat thread create --topic "<chatTopic>" --endpoint "<endpoint>" --access-token "<token>"
```

If you have stored the endpoint and the access token in environment variables as stated above, you won't need to pass them to the command.

```azurecli-interactive
az communication chat thread create --topic "<chatTopic>"
```

- Use `<chatTopic>` to give the thread a topic. You can update the topic after the chat thread is created by using the `thread update-topic` command.
- Replace `<endpoint>` with your Azure Communication Services endpoint.
- Replace `<token>` with your access token obtained earlier with running `identity token issue` command. 


### Update the topic of a chat thread

```azurecli-interactive
az communication chat thread update-topic --thread "<chatThreadId>" --topic "<chatTopic>" --endpoint "<endpoint>" --access-token "<token>"
```

- Replace `<chatThreadId>` with your chat thread ID.
- Replace `<chatTopic>` with the new chat topic you want to set.
- Replace `<endpoint>` with your Azure Communication Services endpoint.
- Replace `<token>` with your access token obtained earlier with running `identity token issue` command. 


### List all chat threads

The `thread list` command returns the list of chat threads of a user.

```azurecli-interactive
az communication chat thread list --start-time "<startTime>" --endpoint "<endpoint>" --access-token "<token>"
```

- Use `<startTime>` optionally to specify the earliest point in time to get chat messages.
- Replace `<endpoint>` with your Azure Communication Services endpoint.
- Replace `<token>` with your access token obtained earlier with running `identity token issue` command. 


### Send a message to a chat thread

Use the `message send` command to send a message to a chat thread you created, identified by `threadId`.

```azurecli-interactive
az communication chat message send --thread "<chatThreadId>" --display-name "<displayName>" --content "<content>" --message-type "<messageType>"  --endpoint "<endpoint>" --access-token "<token>"
```

- Replace `<chatThreadId>` with your chat thread ID.
- Use `<content>` to provide the chat message content.
- Use `<messageType>` to specify the message content type. Possible values are `text` and `html`. If you don't specify a value, the default is `text`.
- Use `<displayName>` optionally to specify the display name of the sender.
- Replace `<endpoint>` with your Azure Communication Services endpoint.
- Replace `<token>` with your access token obtained earlier with running `identity token issue` command. 


### List chat messages in a chat thread

The `message list` command returns the list of chat messages in a chat thread.

```azurecli-interactive
az communication chat message list --thread "<chatThreadId>" --start-time "<startTime>" --endpoint "<endpoint>" --access-token "<token>"
```

- Replace `<chatThreadId>` with your chat thread ID.
- Use `<startTime>` optionally to specify the earliest point in time to get chat messages.
- Replace `<endpoint>` with your Azure Communication Services endpoint.
- Replace `<token>` with your access token obtained earlier with running `identity token issue` command. 


### Receive a chat message from a chat thread

You can retrieve chat messages by using the `message list` command.

```azurecli-interactive
az communication chat message get --thread "<chatThreadId>" --message-id "<messageId>" --endpoint "<endpoint>" --access-token "<token>"
```

- Replace `<chatThreadId>` with your chat thread ID.
- Replace `<messageId>` with the ID of the message you want to retrieve.
- Replace `<endpoint>` with your Azure Communication Services endpoint.
- Replace `<token>` with your access token obtained earlier with running `identity token issue` command. 


### Send read receipt

You use the `message receipt send` command to post a read receipt event to a thread, on behalf of a user.

```azurecli-interactive
az communication chat message receipt send --thread "<chatThreadId>" --message-id "<messageId>" --endpoint "<endpoint>" --access-token "<token>"
```

- Replace `<chatThreadId>` with your chat thread ID.
- Replace `<messageId>` to specify the ID of the latest message read by current user.
- Replace `<endpoint>` with your Azure Communication Services endpoint.
- Replace `<token>` with your access token obtained earlier with running `identity token issue` command. 


### Add a user as a participant to the chat thread

When you create a chat thread, you can then add and remove users from it. By adding users, you give them access to be able to send messages to the chat thread, and add or remove other participants. Before calling the `participant add` command, ensure that you've acquired a new access token and identity for that user.

```azurecli-interactive
az communication chat participant add --thread "<chatThreadId>" --user "<userId>" --display-name "<displayName>" --start-time "<startTime>" --endpoint "<endpoint>" --access-token "<token>"
```

- Replace `<chatThreadId>` with your chat thread ID.
- Replace `<userId>` with your userId.
- Use `<displayName>` optionally to specify the display name of the sender.
- Use `<startTime>` optionally to specify the earliest point in time to get chat messages.
- Replace `<endpoint>` with your Azure Communication Services endpoint.
- Replace `<token>` with your access token obtained earlier with running `identity token issue` command. 


### List thread participants in a chat thread

Similar to adding a participant, you can also list participants from a thread.

Use `participant list` command to retrieve the participants of the thread. 

```azurecli-interactive
az communication chat participant list --thread "<chatThreadId>" --skip "<skip>" --endpoint "<endpoint>" --access-token "<token>"
```

- Replace `<chatThreadId>` with your chat thread ID.
- Use `<skip>` optionally to skip participants up to a specified position in the response.
- Replace `<endpoint>` with your Azure Communication Services endpoint.
- Replace `<token>` with your access token obtained earlier with running `identity token issue` command. 


### Remove a participant from a chat thread

You can remove a chat participant from a chat thread by using the 'participant remove' command.

```azurecli-interactive
az communication chat participant remove --thread "<chatThreadId>" --user "<userId>" --endpoint "<endpoint>" --access-token "<token>"
```

- Replace `<chatThreadId>` with your chat thread ID.
- Replace `<userId>` with the userId you want to remove from the chat thread.
- Replace `<endpoint>` with your Azure Communication Services endpoint.
- Replace `<token>` with your access token obtained earlier with running `identity token issue` command. 
