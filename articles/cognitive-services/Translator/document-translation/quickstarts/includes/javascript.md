---
title: "Quickstart: Document Translation JavaScript"
description: 'Document translation processing using the REST API and JavaScript programming language'
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: include
ms.date: 12/08/2022
ms.author: lajanuar
recommendations: false
---

For this quickstart, we'll use the Node.js JavaScript runtime environment to create and run the application.

## Set up your Node.js environment

1. If you haven't done so already, install the latest version of [Node.js](https://nodejs.org/en/download/). Node Package Manager (npm) is included with the Node.js installation.

    > [!TIP]
    >
    > If you're new to Node.js, try the [Introduction to Node.js](/training/modules/intro-to-nodejs/) Learn module.

1. In a console window (such as cmd, PowerShell, or Bash), create and navigate to a new directory for your app named `document-translation`.

    ```console
        mkdir document-translation && cd document-translation
    ```

   ```powershell
     mkdir document-translation; cd document-translation
   ```

1. Run the npm init command to initialize the application and scaffold your project.

    ```console
       npm init
    ```

1. Specify your project's attributes using the prompts presented in the terminal.

    * The most important attributes are name, version number, and entry point.
    * We recommend keeping `index.js` for the entry point name. The description, test command, GitHub repository, keywords, author, and license information are optional attributes—they can be skipped for this project.
    * Accept the suggestions in parentheses by selecting **Return** or **Enter**.
    * After you've completed the prompts, a `package.json` file will be created in your document-translation directory.

1. Use npm to install the `axios` HTTP library and `uuid` package in your document-translation app directory:

    ```console
       npm install axios uuid
    ```

1. Create the `index.js` file in the app directory.

     > [!TIP]
    >
    > * You can create a new file using PowerShell.
    > * Open a PowerShell window in your project directory by holding down the Shift key and right-clicking the folder.
    > * Type the following command **New-Item index.js**.
    >
    > * You can also create a new file named `index.js` in your IDE and save it to the `document-translation` directory.

## Build your JavaScript application

Add the following code sample to your `index.js` file. **Make sure you update the key variable with the value from your Azure portal Translator instance**:

## Run your JavaScript application

Once you've added the code sample to your application, run your program:

1. Navigate to your application directory (document-translation).

1. Type the following command in your terminal:

    ```console
    node index.js
    ```
