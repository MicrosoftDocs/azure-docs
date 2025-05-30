---
title: include file
description: Use the Azure CLI communication extension to send Email messages with inline attachments.
author: Deepika0530
manager: koagbakp
services: azure-communication-services
ms.author: v-deepikal
ms.date: 17/02/2025
ms.topic: include
ms.service: azure-communication-services
ms.custom: include files
---

## Send an email message with inline attachments

Use the Azure CLI communication extension to send Email messages with inline attachments.

Completing this article incurs a small cost of a few USD cents or less in your Azure account.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure Email Communication Services resource created and ready with a provisioned domain. [Create an Email Communication Resource](../../create-email-communication-resource.md).
- An active Azure Communication Services resource connected to an Email Domain and its connection string. [Connect an Email Communication Resource with a Azure Communication Resource](../../connect-email-communication-resource.md).
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

>[!NOTE] 
> Don't store your connection string as an unencrypted environment variable for production environments. This example is for testing purposes only. For production environments, you should generate new connection strings. We encourage you to encrypt connection strings and change them regularly.

##### [Windows](#tab/windows)

```console
setx AZURE_COMMUNICATION_CONNECTION_STRING "<yourConnectionString>"
```

After you add the environment variable, you may need to restart any running programs that will need to read the environment variable, including the console window. For example, if you're using Visual Studio as your editor, restart Visual Studio before running the example. 

##### [macOS](#tab/unix)

Edit your **`.zshrc`**, and add the environment variable:

```bash
export AZURE_COMMUNICATION_CONNECTION_STRING="<connectionString>"
```

After you add the environment variable, run `source ~/.zshrc` from your console window to make the changes effective. If you created the environment variable with your IDE open, you may need to close and reopen the editor, IDE, or shell in order to access the variable. 

##### [Linux](#tab/linux)

Edit your **`.bash_profile`**, and add the environment variable:

```bash
export AZURE_COMMUNICATION_CONNECTION_STRING="<connectionString>"
```

After you add the environment variable, run `source ~/.bash_profile` from your console window to make the changes effective. If you created the environment variable with your IDE open, you may need to close and reopen the editor, IDE, or shell in order to access the variable. 

---

## Send an email message with inline attachment

```azurecli-interactive
az communication email send
	--connection-string "yourConnectionString"
	--sender "<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>"
	--to "<emailalias@emaildomain.com>"
	--subject "Welcome to Azure Communication Services Email"
	--attachment-types "<inlineattachmenttype1>" # MIME type of the content being attached. Example: "png"
	--inline-attachments "<filepath>/<contentid>" # Example: "MicrosoftLogo.png/MSLogo"
	--html "<html><head><title>Welcome to Azure Communication Services Email</title></head><body><h1>This email message is sent from Azure Communication Services Email using Azure CLI.</h1><img src='cid:<contentid>' alt='<alternatetext>'/></body></html>"
```

Make these replacements in the code:

- Replace `<yourConnectionString>` with your connection string.
- Replace `<emailalias@emaildomain.com>` with the email address you would like to send a message to.
- Replace `<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>` with the MailFrom address of your verified domain.
- Replace `<inlineattachmenttype1>` with the actual attachment type of the file.
- Replace `<filepath>/<contentid>` with the file path to your attachment and the cid name or id for your inline attachment.
- Replace `<contentid>` with the CID for your inline attachment, which is referred to in the img src part of the HTML.
- Replace `<alternatetext>` with a descriptive text for the image to help with accessibility.

## Send an email message with attachment and inline attachment

```azurecli-interactive
az communication email send
	--connection-string "yourConnectionString"
	--sender "<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>"
	--to "<emailalias@emaildomain.com>"
	--subject "Welcome to Azure Communication Services Email"
	--attachment-types "<attachmenttype1>" "<inlineattachmenttype1>" # MIME type of the content being attached. Example1: "jpg" "png" & Example2: "png" "png"
	--attachments "<filepath>" # Example: "MSLogo.jpg"
	--inline-attachments "<filepath>/<contentid>" # Example: "MicrosoftLogo.png/MSLogo"
	--html "<html><head><title>Welcome to Azure Communication Services Email</title></head><body><h1>This email message is sent from Azure Communication Services Email using Azure CLI.</h1><img src='cid:<contentid>' alt='<alternatetext>'/></body></html>"
```

Make these replacements in the code:

- Replace `<yourConnectionString>` with your connection string.
- Replace `<emailalias@emaildomain.com>` with the email address you would like to send a message to.
- Replace `<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>` with the MailFrom address of your verified domain.
- Replace `<attachmenttype1>` `<inlineattachmenttype1>` with the actual attachment type of the file.
- Replace `<filepath>` with the file path to your attachment.
- Replace `<filepath>/<contentid>` with the file path to your attachment and the cid name or id for your inline attachment.
- Replace `<contentid>` with the CID for your inline attachment, which is referred to in the img src part of the HTML.
- Replace `<alternatetext>` with a descriptive text for the image to help with accessibility.

## Send an email message with multiple attachments and inline attachments

```azurecli-interactive
az communication email send
	--connection-string "yourConnectionString"
	--sender "<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>"
	--to "<emailalias@emaildomain.com>"
	--subject "Welcome to Azure Communication Services Email"
	--attachment-types "<attachmenttype1>" "<attachmenttype2>" "<inlineattachmenttype1>" "<inlineattachmenttype2>" "<inlineattachmenttype3>" # MIME type of the content being attached. Example: "png" "jpg" "png" "jpg" "bmp"
	--attachments "<filepath1>" "<filepath2>"
	--inline-attachments "<filepath1>/<contentid1>" "<filepath2>/<contentid2>" "<filepath3>/<contentid3>"
	--html "<html><head><title>Welcome to Azure Communication Services Email</title></head><body><h1>This email message is sent from Azure Communication Services Email using Azure CLI.</h1><img src='cid:<contentid1>' alt='<alternatetext>'/><img src='cid:<contentid2>' alt='<alternatetext>'/><img src='cid:<contentid3>' alt='<alternatetext>'/></body></html>"
```

Make these replacements in the code:

- Replace `<yourConnectionString>` with your connection string.
- Replace `<emailalias@emaildomain.com>` with the email address you would like to send a message to.
- Replace `<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>` with the MailFrom address of your verified domain.
- Replace `<attachmenttype1>` `<attachmenttype2>` `<inlineattachmenttype1>` `<inlineattachmenttype2>` `<inlineattachmenttype3>` with the actual attachment types of the file.
- Replace `<filepath1>` `<filepath2>` with the file paths to your attachment.
- Replace `<filepath1>/<contentid1>` `<filepath2>/<contentid2>` `<filepath3>/<contentid3>`  with the file paths to your attachment and the cid name or id for your inline attachment.
- Replace `<contentid1>` `<contentid2>` `<contentid3>` with the CID for your inline attachment, which is referred to in the img src part of the HTML.
- Replace `<alternatetext>` with a descriptive text for the image to help with accessibility.

The previous command also performs a polling on the messageId and returns the status of the email delivery. The status can be one of the following values:

[!INCLUDE [Email Message Status](../../includes/email-operation-status.md)]

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

>[!NOTE] 
> We limit the total size of an email request (which includes both regular and inline attachments) to 10 MB.

- `--attachment-types` sets the list of email attachment types, in the same order of attachments.

- `--inline-attachments` parameter embeds an attachment directly within the email body, instead of as a separate downloadable file. Inline attachments are commonly used for images or media files that should appear inline in the email content.

>[!NOTE] 
> There needs to be at least one recipient in `--to` or `--cc` or `--bcc`.
 