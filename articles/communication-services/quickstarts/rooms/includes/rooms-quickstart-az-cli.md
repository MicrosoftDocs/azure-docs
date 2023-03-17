---
title: include file
description: include file
services: azure-communication-services
author: JoannaJiang
manager: ankita
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 12/01/2022
ms.topic: include
ms.custom: include file, devx-track-azurecli
ms.author: JoannaJiang
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md?#access-your-connection-strings-and-service-endpoints-using-azure-cli).
- Install [Azure CLI](/cli/azure/install-azure-cli-windows?tabs=azure-cli).
- You can get the connection string from the Azure portal by clicking the keys in the settings. 

## Setting up 

### Add the extension
Add the Azure Communication Services extension for Azure CLI by using the `az extension` command.

```azurecli-interactive
az extension add --name communication
```

### Sign in to Azure CLI
You'll need to [sign in to Azure CLI](/cli/azure/authenticate-azure-cli). You can sign in running the ```az login``` command from the terminal and providing your credentials.


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

## Operations

### Create a room

Use the `rooms create` command to create a room. 

```azurecli-interactive
az communication rooms create --presenter-participants "<participantId>" --consumer-participants "<participantId>" --attendee-participant "<participantId>" --validFrom "<validFrom>" --validUntil "<validUntil>" --connection-string "<connectionString>"
```

- Use `<participantId>` optionally to specify the type of participant as presenter-participants, consumer-participants, or attendee-participants. If you don't specify a value, the default is empty. 
- Replace `<connectionString>` with your ACS connection string. 
- Use `<joinPolicy>` optionally to specify the join policy type as either `InviteOnly` or `CommunicationServiceUsers`. If you don't specify a value, the default is `InviteOnly`.   
- Use `<validFrom>` optionally to specify the timestamp when the room is open for joining, in ISO8601 format, ex: 2022-07-14T10:21. 
- Use `<validUntil>` optionally to specify the timestamp when the room can no longer be joined, in ISO8601 format, ex: 2022-07-14T10:21. 

If you've stored the connection string in environment variables as stated above, you won't need to pass them to the command.

```azurecli-interactive
az communication rooms create 
```

- Replace `<connectionString>` with your ACS connection string.


### Get the rooms 

The `rooms get` command returns the attributes of an existing room.

```azurecli-interactive
az communication rooms get --room "<roomId>" 
```

- Use `<roomId>` mandatorily to specify the room


### Update the participant of a room

When you create a room, you can update the room by adding and removing participant from it. Before calling the `room update` command, ensure that you've acquired a new user. 
Use the `identity user create` command to create a new participant, identified by `participantId`.

```azurecli-interactive
az communication identity user create
```

Add a user as a participant to the room 

```azurecli-interactive
az communication rooms update --attendee-participant "<participantId>" --room "<roomId>"
```

- Replace `<participantId>` with your participant ID. 
- Replace `<roomId>` with your room ID.


### Update the timeframe of a room 

You can update the timestamp of a room. Before calling the `room update` command, ensure that you've acquired a new room with a valid timeframe. 

```azurecli-interactive
az communication rooms update --validFrom "<validFrom>" --validUntil "<validUntil>" --room "<roomId>"
```

- Replace `<validFrom>` with the timestamp in ISO8601 format, ex: 2022-07-14T10:21, to specify when the room is open for joining. Should be used together with `--valid-until`.
- Replace `<validUntil>` with the timestamp in ISO8601 format, ex: 2022-07-14T10:21, to specify when the room can no longer be joined. Should be used together with `--valid-from`.
- Replace `<roomId>` with your room ID. 


### Update the join policy of a room 

You can update the join policy of a room. Before calling the `room update` command, ensure that you've acquired a new room. 

```azurecli-interactive
az communication rooms update --join-policy "<joinPolicy>" --room "<roomId>"
```

- Replace `<roomId>` with your room ID.
- Use `<joinPolicy>` optionally to specify the type of join policy as either InviteOnly or CommunicationServiceUsers. 


### Delete a room 

Similar to creating a room, you can also delete a room. 

Use `room delete` command to delete the existing room. 

```azurecli-interactive
az communication rooms delete --room "<roomId>"
```

- Replace `<roomId>` with your room ID.


### Remove a participant from a room 

You can remove a room participant from a room by using `identity user delete`

```azurecli-interactive
az communication identity user delete --user "<userId>"
```

- Replace `<userId>` with your user ID obtained earlier with running `identity user create`command.
