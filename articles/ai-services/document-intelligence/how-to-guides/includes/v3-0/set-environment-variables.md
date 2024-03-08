---
title: Environment variables in Windows, macOS, and Linux
description: How to set environment variables for keys and endpoint
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: include
ms.date: 08/21/2023
ms.author: lajanuar
---

<!-- markdownlint-disable MD001 -->
<!-- markdownlint-disable MD024 -->

## Set your environment variables

To interact with the Document Intelligence service, you need to create an instance of the `DocumentAnalysisClient` class. To do so, instantiate the client with your `key` and `endpoint` from the Azure portal. For this project, use environment variables to store and access credentials.

> [!IMPORTANT]
>
> Don't include your key directly in the code and never post it publicly. For production, use a secure way to store and access your credentials, such as [Azure Key Vault](../../../../../ai-services/use-key-vault.md). For more information, see [Azure AI services security](../../../../../ai-services/security-features.md).

To set the environment variable for your Document Intelligence resource key, open a console window, and follow the instructions for your operating system and development environment. Replace *\<yourKey>* and *\<yourEndpoint>* with the values from your resource in the Azure portal.

#### [Windows](#tab/windows)

Environment variables in Windows aren't case-sensitive. They're typically declared in uppercase, with words joined by an underscore. At a command prompt, run the following commands:

1. Set your key variable:

   ```console
   setx FR_KEY <yourKey>
   ```

1. Set your endpoint variable

   ```console
   setx FR_ENDPOINT <yourEndpoint>
   ```

1. After you set your environment variables, close the Command Prompt window. The values remain modified until you change them again.

1. Restart any running programs that read the environment variable. For example, if you're using Visual Studio or Visual Studio Code as your editor, restart before running the sample code.

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue setting the environment variables.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=windows&Product=FormRecognizer&Page=how-to&Section=environment-variables) -->

Here are a few more helpful commands to use with environment variables:

| Command | Action | Example |
|---------|--------|---------|
| `setx VARIABLE_NAME=` | Delete the environment variable by setting the value to an empty string.| `setx FR_KEY=` |
| `setx VARIABLE_NAME=value` | Set or change the value of an environment variable.| `setx FR_KEY=<yourKey>`|
| `set VARIABLE_NAME` | Display the value of a specific environment variable.| `set  FR_KEY` |
| `set`| Display all environment variables.| `set`|

#### [macOS](#tab/macOS)

Environment variables in macOS are case-sensitive. Conventionally, the variable name is declared in uppercase letters.

The `export` command sets the variable and exports it to the global environment, which is available to other processes. However, the value is temporary and lasts only until you close the terminal session. Open your terminal and enter the following commands:

1. Set your key variable:

   ```bash
   export key=<yourKey>
   ```

1. Set your endpoint variable:

   ```bash
   export endpoint=<yourEndpoint>
   ```

To set an environment variable permanently, place an export command in your Bash  `~/.bash_profile` startup script:

  1. Use a text editor to open the *~/.bash_profile* file and add the following command to create a permanent environment variable:

     ```bash
     export FR_KEY=<yourKey> FR_ENDPOINT=<yourEndpoint>
     ```

     Example: `export FR_KEY="<yourKey>"`

  1. Save your changes to the *.bash_profile* file.

  1. Run the following command from your terminal window to make the changes effective:

     ```bash
     source ~/.bash-profile
     ```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue setting the environment variables.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=macos&Product=FormRecognizer&Page=how-to&Section=environment-variables) -->

Here are a few more helpful commands to use with environment variables:

| Command | Action | Example |
|---------|--------|---------|
| `unset VARIABLE_NAME` | Delete an environment variable.| `unset FR_KEY` |
| `export VARIABLE_NAME=value` | Set or change the value of a temporary environment variable.| `export FR_KEY=<yourKey>` |
| `printenv VARIABLE_NAME`</br>`echo $VARIABLE_NAME`| Display the value of a specific environment variable. With the `echo` command, precede the variable with `$`.| `printenv FR_KEY` </br>`echo $FR_KEY`|
| `printenv` | Display all environment variables.| `printenv` |

#### [Linux](#tab/linux)

Environment variables in Linux are case-sensitive. Conventionally, the variable name is declared in uppercase letters.

The `export` command sets the variable and exports it to the global environment, which is available to other processes. However, the value is temporary and lasts only until you close the terminal session:

1. Set your key variable:

   ```bash
   export FR_KEY=<yourKey>
   ```

1. Set your endpoint variable:

   ```bash
   export FR_ENDPOINT=<yourEndpoint>
   ```

To set an environment variable permanently, place an export command in your Bash `~/.bashrc` startup script:

  1. Use a text editor to open the *~/.bashrc* file and add the following command to create a permanent environment variable:

     ```bash
     export <VARIABLE>=<value>
     ```

     Example: `export FR_KEY=<yourKey>`

  1. Save your changes to the *.bashrc* file.

  1. Run the following command from your terminal window to make the changes effective:

     ```bash
     source ~/.bashrc
     ```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue setting the environment variables.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=linux&Product=FormRecognizer&Page=how-to&Section=environment-variables) -->

Here are a few more helpful commands to use with environment variables:

| Command | Action | Example |
|---------|--------|---------|
| `unset VARIABLE_NAME`| Delete an environment variable.|`unset FR_KEY=` |
| `export VARIABLE_NAME=value` | Set or change the value of a temporary environment variable.| `export FR_KEY={yourKey}`|
| `printenv VARIABLE_NAME`</br>`echo $VARIABLE_NAME`| Display the value of an environment variable. With the `echo` command, precede the variable with `$`.| `printenv FR_KEY` </br>`echo $FR_KEY`|
| `printenv`| Display all environment variables.|`printenv`|

---
