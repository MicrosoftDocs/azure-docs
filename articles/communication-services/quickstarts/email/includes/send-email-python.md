---
title: include file
description: include file
author: natekimball-msft
manager: koagbakp
services: azure-communication-services
ms.author: natekimball
ms.date: 03/02/2023
ms.topic: include
ms.service: azure-communication-services
ms.custom: mode-other
---

Get started with Azure Communication Services by using the Communication Services Python Email SDK to send Email messages.

Completing this quick start incurs a small cost of a few USD cents or less in your Azure account.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Python](https://www.python.org/downloads/) 3.7+.
- An Azure Email Communication Services resource created and ready with a provisioned domain. [Get started with creating an Email Communication Resource](../create-email-communication-resource.md).
- An active Azure Communication Services resource connected to an Email Domain and its connection string. [Get started by connecting an Email Communication Resource with a Azure Communication Resource](../connect-email-communication-resource.md).

### Prerequisite check
- In a terminal or command window, run the `python --version` command to check that Python is installed.
- To view the domains verified with your Email Communication Services resource, sign in to the [Azure portal](https://portal.azure.com/). Locate your Email Communication Services resource and open the **Provision domains** tab from the left navigation pane.

## Set up the application environment

To set up an environment for sending emails, take the steps in the following sections.

### Create a new Python application

1. Open your terminal or command window. Then use the following command to create a new directory for your app and navigate to it.

   ```console
   mkdir email-quickstart && cd email-quickstart
   ```

2. Use a text editor to create a file called **send-email.py** in the project root directory and add the structure for the program, including basic exception handling.

   ```python
   import os
   from azure.communication.email import EmailClient

   try:
       # Quickstart code goes here.
   except Exception as ex:
       print('Exception:')
       print(ex)
   ```

In the following sections, you'll add all the source code for this quickstart to the **send-email.py** file that you just created.

### Install the package

While still in the application directory, install the Azure Communication Services Email SDK for Python package by using the following command.

```console
pip install azure-communication-email
```

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Email SDK for Python.

| Name | Description |
| ---- |-------------|
| EmailAddress | An object containing an email address and an option for a display name. |
| EmailAttachment | An object that creates an email attachment by accepting an attachment name, MIME type of the content, and a Base64 encoded string of content bytes. |
| EmailClient | This class is needed for all email functionality. You instantiate it with your connection string and use it to send email messages. |
| EmailClientOptions | This class can be added to the EmailClient instantiation to target a specific API version. |
| EmailContent | This object contains the subject, plaintext, and html of the email message. |
| EmailCustomHeader | This class allows for the addition of a name and value pair for a custom header. |
| EmailMessage | This object combines the sender email address, content, and recipients. Custom headers, attachments, and reply-to email addresses can optionally be added as well. |
| EmailRecipients | This object holds lists of EmailAddress objects for recipients of the email message, including optional lists for CC & BCC recipients. |
| EmailSendOperation | This object contains the current status of the operation. |

## Authenticate the client

Instantiate an **EmailClient** with your connection string. Learn how to [manage your resource's connection string](../../create-communication-resource.md#store-your-connection-string).

```python
# Create the EmailClient object that you use to send Email messages.
email_client = EmailClient.from_connection_string(<connection_string>)
```

For simplicity, this quickstart uses connection strings, but in production environments, we recommend using [service principals](../../../quickstarts/identity/service-principal.md).

## Send an email message

To send an email message, you need to
- Construct the EmailMessage with the following:
   - `senderAddress`: A valid sender email address, found in the MailFrom field in the overview pane of the domain linked to your Email Communication Services Resource.
   - `recipients`: An object with a list of email recipients, and optionally, lists of CC & BCC email recipients. 
   - `content`: An object containing the subject, and optionally the plaintext or HTML content, of an email message.
- Call the begin_send method, which will return the result of the operation. 

```python
message = {
    "content": {
        "subject": "This is the subject",
        "plainText": "This is the body",
        "html": "html><h1>This is the body</h1></html>"
    },
    "recipients": {
        "to": [
            {
                "address": "<emailalias@emaildomain.com>",
                "displayName": "Customer Name"
            }
        ]
    },
    "senderAddress": "<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>"
}

poller = email_client.begin_send(message)
print("Result: " + poller.result())

```

Make these replacements in the code:

- Replace `<emailalias@emaildomain.com>` with the email address you would like to send a message to.
- Replace `<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>` with the MailFrom address of your verified domain.


## Get the status of the email delivery

We can poll for the status of the email delivery by setting a loop on the operation status object returned from the EmailClient's `begin_send` method:

```python
POLLER_WAIT_TIME = 10

try:
    email_client = EmailClient.from_connection_string(connection_string)

    poller = client.begin_send(message);

    time_elapsed = 0
    while not poller.done():
        print("Email send poller status: " + poller.status())

        poller.wait(POLLER_WAIT_TIME)
        time_elapsed += POLLER_WAIT_TIME

        if time_elapsed > 18 * POLLER_WAIT_TIME:
            raise RuntimeError("Polling timed out.")

    if poller.status() == "Succeeded":
        print(f"Successfully sent the email (operation id: {poller.result()['id']})")
    else:
        raise RuntimeError(str(poller.result()["error"]))

except Exception as ex:
    print(ex)
```

[!INCLUDE [Email Message Status](./email-operation-status.md)]

## Run the code

Run the application from your application directory with the `python` command.

```console
python send-email.py
```

## Sample code

You can download the sample app from [GitHub](https://github.com/Azure-Samples/communication-services-python-quickstarts/tree/main/send-email)

## Advanced

### Send an email message to multiple recipients

We can define multiple recipients by adding additional EmailAddresses to the EmailRecipients object. These addresses can be added as `to`, `cc`, or `bcc` recipients lists accordingly.

```python
message = {
    "content": {
        "subject": "This is the subject",
        "plainText": "This is the body",
        "html": "html><h1>This is the body</h1></html>"
    },
    "recipients": {
        "to": [
            {"address": "<recipient1@emaildomain.com>", "displayName": "Customer Name"},
            {"address": "<recipient2@emaildomain.com>", "displayName": "Customer Name 2"}
        ],
        "cc": [
            {"address": "<recipient1@emaildomain.com>", "displayName": "Customer Name"},
            {"address": "<recipient2@emaildomain.com>", "displayName": "Customer Name 2"}
        ],
        "bcc": [
            {"address": "<recipient1@emaildomain.com>", "displayName": "Customer Name"},
            {"address": "<recipient2@emaildomain.com>", "displayName": "Customer Name 2"}
        ]
    },
    "senderAddress": "<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>"
}
```

You can download the sample app demonstrating this from [GitHub](https://github.com/Azure-Samples/communication-services-java-quickstarts/tree/main/send-email)


### Send an email message with attachments

We can add an attachment by defining an EmailAttachment object and adding it to our EmailMessage object. Read the attachment file and encode it using Base64. Decode the bytes as a string and pass it into the EmailAttachment object.

```python
import base64

with open("<your-attachment-path>", "rb") as file:
    file_bytes = file.read()

file_bytes_b64 = base64.b64encode(file_bytes)

message = {
    "content": {
        "subject": "This is the subject",
        "plainText": "This is the body",
        "html": "html><h1>This is the body</h1></html>"
    },
    "recipients": {
        "to": [
            {
                "address": "<recipient1@emaildomain.com>",
                "displayName": "Customer Name"
            }
        ]
    },
    "senderAddress": "<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>",
    "attachments": [
        {
            "name": "<your-attachment-name>",
            "contentType": "<your-attachment-mime-type>",
            "contentInBase64": file_bytes_b64.decode()
        }
    ]
}
```

You can download the sample app demonstrating this from [GitHub](https://github.com/Azure-Samples/communication-services-java-quickstarts/tree/main/send-email)
