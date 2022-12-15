---
title: "Quickstart: Document Translation Python"
description: 'Document translation processing using the REST API and Python programming language'
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: include
ms.date: 12/08/2022
ms.author: lajanuar
recommendations: false
---

## Set up your Python project

1. If you haven't done so already, install the latest version of [Python 3.x](https://www.python.org/downloads/). The Python installer package (pip) is included with the Python installation.

    > [!TIP]
    >
    > If you're new to Python, try the [Introduction to Python](/training/paths/beginner-python/) Learn module.

1. Open a terminal window and use pip to install the Requests library and uuid0 package:

    ```console
       pip install requests uuid
    ```

    > [!NOTE]
    > We will also use a Python built-in package called json. It's used to work with JSON data.

## Build your Python application

1. Using your preferred editor or IDE, create a new directory for your app named `document-translation`.

1. Create a new Python file called **document-translation.py** in your **document-translation** directory .

1. Add the following code sample to your `document-translation.py` file. **Make sure you update the key with one of the values from your Azure portal Translator instance**.

## Run your Python application

Once you've added a code sample to your application, build and run your program:

1. Navigate to your **document-translation** directory.

1. Type the following command in your console:

    ```console
    python document-translation.py

   ```