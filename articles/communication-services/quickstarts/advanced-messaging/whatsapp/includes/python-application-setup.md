---
title: Include file
description: Include file
services: azure-communication-services
author: shamkh
manager: camilo.ramirez
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.subservice: advanced-messaging
ms.date: 12/20/2024
ms.topic: include
ms.custom: Include file
ms.author: shamkh
---

### Create a new Python application

In a terminal or console window, create a new folder for your application and open it.

```console
mkdir messages-quickstart && cd messages-quickstart
```

### Install the package

Use the Azure Communication Messages client library for Python [1.1.0](https://pypi.org/project/azure-communication-messages) or above.

From a console prompt, run the following command:

```console
pip install azure-communication-messages
```

For **InteractiveMessages, Reactions and Stickers**, please use below [Beta](https://pypi.org/project/azure-communication-messages/1.2.0b1/) version:

```console
pip install azure-communication-messages==1.2.0b1
```

### Set up the app framework

Create a new file called `messages-quickstart.py` and add the basic program structure.

```console
type nul > messages-quickstart.py   
```

#### Basic program structure

```python
import os

class MessagesQuickstart(object):
    print("Azure Communication Services - Advanced Messages SDK Quickstart")

if __name__ == '__main__':
    messages = MessagesQuickstart()
```
