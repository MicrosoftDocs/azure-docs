---
title: include file
description: include file
services: azure-communication-services
author: lakshmans
manager: ankita

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 05/25/2022
ms.topic: include
ms.custom: include file
ms.author: lakshmans
---

Get started with Azure Communication Services by using the Communication Services Python SMS SDK to send SMS messages.

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

> [!NOTE]
> Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-python-quickstarts/tree/main/send-sms-quickstart).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Python](https://www.python.org/downloads/) 3.7+.
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).
- An SMS-enabled telephone number. [Get a phone number](../../telephony/get-phone-number.md).

### Prerequisite check

- In a terminal or command window, run the `python --version` command to check that Python is installed.
- To view the phone numbers that are associated with your Communication Services resource, sign in to the [Azure portal](https://portal.azure.com/) and locate your Communication Services resource. In the navigation pane on the left, select **Phone numbers**.

## Set up the application environment

To set up an environment for sending messages, take the steps in the following sections.

### Create a new Python application

1. Open your terminal or command window. Then use the following command to create a new directory for your app and navigate to it.

   ```console
   mkdir sms-quickstart && cd sms-quickstart
   ```

1. Use a text editor to create a file called **send-sms.py** in the project root directory and add the structure for the program, including basic exception handling.

   ```python
   import os
   from azure.communication.sms import SmsClient

   try:
       # Quickstart code goes here.
   except Exception as ex:
       print('Exception:')
       print(ex)
   ```

In the following sections, you'll add all the source code for this quickstart to the **send-sms.py** file that you just created.

### Install the package

While still in the application directory, install the Azure Communication Services SMS SDK for Python package by using the following command.

```console
pip install azure-communication-sms
```

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services SMS SDK for Python.

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| SmsClient | This class is needed for all SMS functionality. You instantiate it with your subscription information, and use it to send SMS messages.                                                                                                                 |
| SmsSendResult               | This class contains the result from the SMS service.                                          |

## Authenticate the client

Instantiate an **SmsClient** with your connection string. Learn how to [manage your resource's connection string](../../create-communication-resource.md#store-your-connection-string).

```python
# Create the SmsClient object that you use to send SMS messages.
sms_client = SmsClient.from_connection_string(<connection_string>)
```
For simplicity, this quickstart uses connection strings, but in production environments, we recommend using [service principals](../../../quickstarts/identity/service-principal.md).

## Send a 1:1 SMS message

To send an SMS message to a single recipient, call the `send` method from the **SmsClient** with a single recipient phone number. You can also provide optional parameters to specify whether the delivery report should be enabled and to set custom tags. Add this code to the end of the `try` block in **send-sms.py**:

```python

# Call send() with SMS values.
sms_responses = sms_client.send(
    from_="<from-phone-number>",
    to="<to-phone-number>",
    message="Hello World via SMS",
    enable_delivery_report=True, # optional property
    tag="custom-tag") # optional property

```

Make these replacements in the code:

- Replace `<from-phone-number>` with an SMS-enabled phone number that's associated with your communication service.
- Replace `<to-phone-number>` with the phone number that you'd like to send a message to.

> [!WARNING]
> Provide phone numbers in E.164 international standard format, for example, +14255550123. The value for `<from-phone-number>` can also be a short code, for example, 23456 or an alphanumeric sender ID, for example, CONTOSO.

## Send a 1:N SMS message

To send an SMS message to a list of recipients, call the `send` method from the **SmsClient** with a list of recipient phone numbers. You can also provide optional parameters to specify whether the delivery report should be enabled and to set custom tags. Add this code to the end of the `try` block in **send-sms.py**:

```python

# Call send() with SMS values.
sms_responses = sms_client.send(
    from_="<from-phone-number>",
    to=["<to-phone-number-1>", "<to-phone-number-2>"],
    message="Hello World via SMS",
    enable_delivery_report=True, # optional property
    tag="custom-tag") # optional property

```

Make these replacements in the code:

- Replace `<from-phone-number>` with an SMS-enabled phone number that's associated with your communication service.
- Replace `<to-phone-number-1>` and `<to-phone-number-2>` with phone numbers that you'd like to send a message to.

> [!WARNING]
> Provide phone numbers in E.164 international standard format, for example, +14255550123. The value for `<from-phone-number>` can also be a short code, for example, 23456 or an alphanumeric sender ID, for example, CONTOSO.

## Optional parameters

The `enable_delivery_report` parameter is an optional parameter that you can use to configure delivery reporting. This functionality is useful when you want to emit events when SMS messages are delivered. See the [Handle SMS Events](../handle-sms-events.md) quickstart to configure delivery reporting for your SMS messages.

The `tag` parameter is an optional parameter that you can use to apply a tag to the delivery report.

## Run the code

Run the application from your application directory with the `python` command.

```console
python send-sms.py
```

The complete Python script should look something like the following code:

```python

import os
from azure.communication.sms import SmsClient

try:
    # Create the SmsClient object that you use to send SMS messages.
    sms_client = SmsClient.from_connection_string("<connection string>")
    # Call send() with SMS values.
    sms_responses = sms_client.send(
       from_="<from-phone-number>",
       to="<to-phone-number>",
       message="Hello World via SMS",
       enable_delivery_report=True, # optional property
       tag="custom-tag") # optional property

except Exception as ex:
    print('Exception:')
    print(ex)
```
