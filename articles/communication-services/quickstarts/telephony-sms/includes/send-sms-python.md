---
title: include file
description: include file
services: azure-communication-services
author: lakshmans
manager: ankita

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 06/30/2021
ms.topic: include
ms.custom: include file
ms.author: lakshmans
---

Get started with Azure Communication Services by using the Communication Services Python SMS SDK to send SMS messages.

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

> [!NOTE]
> Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-python-quickstarts/tree/main/send-sms-quickstart)

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Python](https://www.python.org/downloads/) 2.7 or 3.6+.
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).
- An SMS enabled telephone number. [Get a phone number](../get-phone-number.md).

### Prerequisite check

- In a terminal or command window, run the `python --version` command to check that Python is installed.
- To view the phone numbers associated with your Communication Services resource, sign in to the [Azure portal](https://portal.azure.com/), locate your Communication Services resource and open the **phone numbers** tab from the left navigation pane.

## Setting up

### Create a new Python application

Open your terminal or command window, create a new directory for your app, and navigate to it.

```console
mkdir sms-quickstart && cd sms-quickstart
```

Use a text editor to create a file called **send-sms.py** in the project root directory and add the structure for the program, including basic exception handling. You'll add all the source code for this quickstart to this file in the following sections.

```python
import os
from azure.communication.sms import SmsClient

try:
    # Quickstart code goes here
except Exception as ex:
    print('Exception:')
    print(ex)
```

### Install the package

While still in the application directory, install the Azure Communication Services SMS SDK for Python package by using the `pip install` command.

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
# Create the SmsClient object which will be used to send SMS messages
sms_client = SmsClient.from_connection_string(<connection_string>)
```
For simplicity we are using connection strings in this quickstart, but in production environments we recommend using [service principals](../../../quickstarts/identity/service-principal.md).

## Send a 1:1 SMS Message

To send an SMS message to a single recipient, call the ```send``` method from the **SmsClient** with a single recipient phone number. You may also pass in optional parameters to specify whether the delivery report should be enabled and to set custom tags. Add this code to the end of `try` block in **send-sms.py**:

```python

# calling send() with sms values
sms_responses = sms_client.send(
    from_="<from-phone-number>",
    to="<to-phone-number>",
    message="Hello World via SMS",
    enable_delivery_report=True, # optional property
    tag="custom-tag") # optional property

```

You should replace `<from-phone-number>` with an SMS enabled phone number associated with your communication service and `<to-phone-number>` with the phone number you wish to send a message to.

> [!WARNING]
> Note that phone numbers should be provided in E.164 international standard format. (e.g.: +14255550123).

## Send a 1:N SMS Message

To send an SMS message to a list of recipients, call the ```send``` method from the **SmsClient** with a list of recipient's phone numbers. You may also pass in optional parameters to specify whether the delivery report should be enabled and to set custom tags. Add this code to the end of `try` block in **send-sms.py**:

```python

# calling send() with sms values
sms_responses = sms_client.send(
    from_="<from-phone-number>",
    to=["<to-phone-number-1>", "<to-phone-number-2>"],
    message="Hello World via SMS",
    enable_delivery_report=True, # optional property
    tag="custom-tag") # optional property

```

You should replace `<from-phone-number>` with an SMS enabled phone number associated with your communication service and `<to-phone-number-1>` `<to-phone-number-2>` with phone number(s) you wish to send a message to.

> [!WARNING]
> Note that phone numbers should be provided in E.164 international standard format. (e.g.: +14255550123).

## Optional Parameters

The `enable_delivery_report` parameter is an optional parameter that you can use to configure Delivery Reporting. This is useful for scenarios where you want to emit events when SMS messages are delivered. See the [Handle SMS Events](../handle-sms-events.md) quickstart to configure Delivery Reporting for your SMS messages.

The `tag` parameter is an optional parameter that you can use to apply a tag to the Delivery Report.

## Run the code
Run the application from your application directory with the `python` command.

```console
python send-sms.py
```

The complete Python script should look something like:

```python

import os
from azure.communication.sms import SmsClient

try:
    # Create the SmsClient object which will be used to send SMS messages
    sms_client = SmsClient.from_connection_string("<connection string>")
    # calling send() with sms values
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
