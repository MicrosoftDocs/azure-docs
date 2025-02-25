---
title: include file
description: include file
author: Deepika0530
manager: komivi.agbakpem
services: azure-communication-services
ms.author: v-deepikal
ms.date: 17/02/2024
ms.topic: include
ms.service: azure-communication-services
ms.custom: include files
---

Get started with Azure Communication Services by using the Azure PowerShell communication module to send Email messages.

Completing this quick start incurs a small cost of a few USD cents or less in your Azure account.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure Email Communication Services resource created and ready with a provisioned domain. [Get started with creating an Email Communication Resource](../../create-email-communication-resource.md).
- An active Azure Communication Services resource connected to an Email Domain and its connection string. [Get started by connecting an Email Communication Resource with a Azure Communication Resource](../../connect-email-communication-resource.md).
- The latest [Azure PowerShell](/powershell/azure/install-azps-windows).

### Prerequisite check
- In a windows powershell, run the `Get-Module -ListAvailable -Name Az.Communication` command to check whether the communication module is installed or not.
- To view the domains verified with your Email Communication Services resource, sign in to the [Azure portal](https://portal.azure.com/). Locate your Email Communication Services resource and open the **Provision domains** tab from the left navigation pane.

## Setting up
### Install communication module
Install the Azure Communication Services module for Azure PowerShell by using the `Install-Module -Name Az.Communication` command.

```azurepowershell-interactive
Install-Module -Name Az.Communication
```
After installing Communication module, run the `Get-Command -Module Az.Communication` command to get all the communication modules.

```azurepowershell-interactive
Get-Command -Module Az.Communication
```

## Send an email message with inline attachment

Queues an email message to be sent to one or more recipients with only required fields.

```azurepowershell-interactive
$emailRecipientTo = @(
   @{
        Address = "<emailalias@emaildomain.com>"
        DisplayName = "Email DisplayName"
    },
   @{
        Address = "<emailalias1@emaildomain.com>"
        DisplayName = "Email DisplayName"
    }
)

$fileBytes = [System.IO.File]::ReadAllBytes("<image file path>")

$emailAttachment = @(
    @{
        ContentInBase64 = $fileBytes
        ContentType = "<image/png>"
        Name = "<inline-attachment.png>"
        contentId = "<contentId>"
    }
)

$message = @{
    ContentSubject = "Test Email"
    RecipientTo = @($emailRecipientTo)  # Array of email address objects
    SenderAddress = '<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>'
    Attachment = @($emailAttachment) # Array of attachments
    ContentHtml = "<html><head><title>Enter title</title></head><body><img src='cid:<contentId>' alt='Company Logo'/><h1>This is the first email from ACS - Azure PowerShell</h1></body></html>"
    ContentPlainText = "This is the first email from ACS - Azure PowerShell"
}
```

Make these replacements in the code:

- Replace `<yourEndpoint>` with your endpoint.
- Replace `<emailalias@emaildomain.com>` with the email address you would like to send a message to.
- Replace `<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>` with the MailFrom address of your verified domain.
- Replace `<image file path>` with the actual file paths of the attachments you want to send.
- Replace `<image/png>` with the appropriate content types for your attachments.
- Replace `<inline-attachment.png>` with the filenames of your attachments.
- Replace `<contentId>` with the Content-ID for your inline attachment.

Queues an email message to be sent to one or more inline attachments.

```azurepowershell-interactive
$emailRecipientTo = @(
   @{
        Address = "<emailalias@emaildomain.com>"
        DisplayName = "Email DisplayName"
    },
   @{
        Address = "<emailalias1@emaildomain.com>"
        DisplayName = "Email DisplayName"
    }
)

$fileBytes1 = [System.IO.File]::ReadAllBytes("<image file path1>")
$fileBytes2 = [System.IO.File]::ReadAllBytes("<image file path2>")
$fileBytes3 = [System.IO.File]::ReadAllBytes("<image file path3>")

$emailAttachment = @(
    @{
        ContentInBase64 = $fileBytes1
        ContentType = "<image/png>"
        Name = "<inline-attachment1.png>"
        contentId = "<contentId1>"
    },
    @{
        ContentInBase64 = $fileBytes2
        ContentType = "<image/png>"
        Name = "<inline-attachment2.png>"
        contentId = "<contentId2>"
    },
    @{
        ContentInBase64 = $fileBytes3
        ContentType = "<image/png>"
        Name = "<inline-attachment3.png>"
        contentId = "<contentId3>"
    }
)

$message = @{
    ContentSubject = "Test Email"
    RecipientTo = @($emailRecipientTo)  # Array of email address objects
    SenderAddress = '<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>'
    Attachment = @($emailAttachment) # Array of attachments
    ContentHtml = "<html><head><title>Enter title</title></head><body><img src='cid:<contentId1>' alt='Company Logo'/><img src='cid:<contentId2>' alt='Company Logo'/><img src='cid:<contentId3>' alt='Company Logo'/><h1>This is the first email from ACS - Azure PowerShell</h1></body></html>"
    ContentPlainText = "This is the first email from ACS - Azure PowerShell"
}
```

Make these replacements in the code:

- Replace `<yourEndpoint>` with your endpoint.
- Replace `<emailalias@emaildomain.com> and <emailalias1@emaildomain.com>` with the email addresses you would like to send a message to.
- Replace `<image file path1>` `<image file path2>` `<image file path3>` with the actual file paths of the attachments you want to send.
- Replace `<image/png>` with the appropriate content types for your attachments.
- Replace `<inline-attachment1.png>` `<inline-attachment2.png>` `<inline-attachment3.png>` with the filenames of your attachments.
- Replace `<contentId1>` `<contentId2>` `<contentId3>` with the Content-ID for your inline attachment.

### Optional parameters

The following optional parameters are available in Azure PowerShell.

- `ContentHtml` can be used to specify the HTML body of the email.

- `ContentPlainText` used to specify the plain text body of the email.

- `Attachment` sets the list of email attachments and inline attachments. This parameter accepts an array of file paths or attachment objects.

>[!NOTE] 
> Please note that we limit the total size of an email request (which includes both regular and inline attachments) to 10MB.

- `Header` custom email headers to be passed and sets email importance level (high, normal, or low).

- `RecipientBcc` array of recipients for the BCC field.

- `RecipientCc` array of recipients for the CC field.

- `ReplyTo` array of email addresses where recipients replies will be sent to.

- `UserEngagementTrackingDisabled` indicates whether user engagement tracking should be disabled for this request if the resource-level user engagement tracking setting was already enabled in the control plane.

Also, you can use a list of recipients with `RecipientCc` and `RecipientBcc` similar to `RecipientTo`. There needs to be at least one recipient in `RecipientTo` or `RecipientCc` or `RecipientBcc`.

