---
title: include file
description: include file
author: yogeshmo
manager: koagbakp
services: azure-communication-services
ms.author: ymohanraj
ms.date: 09/08/2022
ms.topic: include
ms.service: azure-communication-services
ms.custom: private_preview, event-tier1-build-2022
---

Get started with Azure Communication Services by using the Communication Services Python Email SDK to send Email messages.

Completing this quick start incurs a small cost of a few USD cents or less in your Azure account.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Python](https://www.python.org/downloads/) 2.7 or 3.6+.
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

The following classes and interfaces handle some of the major features of the Azure Communication Services SMS SDK for Python.

| Name | Description |
| ---- |-------------|
| EmailAddress | This interface contains an email address and an option for a display name. |
| EmailAttachment | This interface creates an email attachment by accepting a unique ID, email attachment type, and a string of content bytes. |
| EmailClient | This class is needed for all email functionality. You instantiate it with your connection string and use it to send email messages. |
| EmailClientOptions | This interface can be added to the EmailClient instantiation to target a specific API version. |
| EmailContent | This interface contains the subject, plaintext, and html of the email message. |
| EmailCustomHeader | This interface allows for the addition of a name and value pair for a custom header. |
| EmailMessage | This interface combines the sender, content, and recipients. Custom headers, importance, attachments, and reply-to email addresses can optionally be added as well. |
| EmailRecipients | This interface holds lists of EmailAddress objects for recipients of the email message, including optional lists for CC & BCC recipients. |
| SendStatusResult | This interface holds the messageId and status of the email message delivery. |

## Authenticate the client

Instantiate an **EmailClient** with your connection string. Learn how to [manage your resource's connection string](../../create-communication-resource.md#store-your-connection-string).

```python
# Create the EmailClient object that you use to send Email messages.
email_client = EmailClient.from_connection_string(<connection_string>)
```

For simplicity, this quickstart uses connection strings, but in production environments, we recommend using [service principals](../../../quickstarts/identity/service-principal.md).

## Send an email message

To send an email message, you need to
- Construct the EmailContent
- Create an EmailAddress for the recipient
- Construct the EmailRecipients
- Construct the EmailMessage with the EmailContent, EmailAddress, and the sender information from the MailFrom address of your verified domain
- Call the send method

```python
content = EmailContent(
    subject="Welcome to Azure Communication Services Email",
    plain_text="This email message is sent from Azure Communication Services Email using the Python SDK.",
)

address = EmailAddress(email="<emailalias@emaildomain.com>")
recipient = EmailRecipients(to=[address])

message = EmailMessage(
            sender="<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>",
            content=content,
            recipients=recipients
        )

response = email_client.send(message)
```

Make these replacements in the code:

- Replace `<emailalias@emaildomain.com>` with the email address you would like to send a message to.
- Replace `<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>` with the MailFrom address of your verified domain.

## Retrieve the Message ID of the email delivery

To track the status of the email delivery, you will need the `message_id` from the response.

```python
message_id = response.message_id
```

## Get the status of the email delivery

We can keep checking the email delivery status until the status is `OutForDelivery`.

```python
counter = 0
while True:
    counter+=1
    send_status = client.get_send_status(message_id)

    if (send_status):
        print(f"Email status for message_id {message_id} is {send_status.status}.")
    if (send_status.status.lower() == "queued" and counter < 12):
        time.sleep(10)  # wait for 10 seconds before checking next time.
        counter +=1
    else:
        if(send_status.status.lower() == "outfordelivery"):
            print(f"Email delivered for message_id {message_id}.")
            break
        else:
            print("Looks like we timed out for checking email send status.")
            break
```

[!INCLUDE [Email Message Status](./email-message-status.md)]

## Run the code

Run the application from your application directory with the `python` command.

```console
python send-email.py
```

## Sample code

You can download the sample app from [GitHub](https://github.com/Azure-Samples/communication-services-python-quickstarts/tree/main/send-email)

## Advanced

### Send an email message to multiple recipients

We can define multiple recipients by adding additional EmailAddresses to the EmailRecipients object. These addresses can be added as `To`, `CC`, or `BCC` recipients.

```python
to_address_1 = EmailAddress(email="<emailalias1@emaildomain.com>")
to_address_2 = EmailAddress(email="<emailalias2@emaildomain.com>")
cc_address = EmailAddress(email="<ccemailalias@emaildomain.com>")
bcc_address = EmailAddress(email="<bccemailalias@emaildomain.com>")

recipient = EmailRecipients(to=[to_address_1, to_address_2], cc=[cc_address], bcc=[bcc_address])
```

You can download the sample app demonstrating this from [GitHub](https://github.com/Azure-Samples/communication-services-java-quickstarts/tree/main/send-email)


### Send an email message with attachments

We can add an attachment by defining an EmailAttachment object and adding it to our EmailMessage object. Read the attachment file and encode it using Base64. Decode the bytes as a string and pass it into the EmailAttachment object.

```python
import base64

with open("<your-attachment-path>", "rb") as file:
    file_bytes = file.read()

file_bytes_b64 = base64.b64encode(file_bytes)

attachment = EmailAttachment(
    name="<your-attachment-name>",
    attachment_type="<your-attachment-file-type>",
    content_bytes_base64=file_bytes_b64.decode()
)

message = EmailMessage(
    sender="<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>",
    content=content,
    recipients=recipients,
    attachments=[attachment]
)
```

You can download the sample app demonstrating this from [GitHub](https://github.com/Azure-Samples/communication-services-java-quickstarts/tree/main/send-email)
