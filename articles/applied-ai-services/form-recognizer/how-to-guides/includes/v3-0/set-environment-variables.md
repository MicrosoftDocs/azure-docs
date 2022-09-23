---
title: Environment Variables in Windows, macOS, and Linux
description: How to set environment variables for keys and endpoint
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: include
ms.date: 09/16/2022
ms.author: lajanuar
---

<!-- markdownlint-disable MD001 -->
<!-- markdownlint-disable MD024 -->

## Set environment variables

To interact with the Form Recognizer service, you'll need to create an instance of the `DocumentAnalysisClient` class. To do so, you'll instantiate the client with your `key` and `endpoint` from the Azure portal. For this project, we'll use environment variables to store and access credentials.

> [!IMPORTANT]
>
> Don't include your key directly in the code and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../../cognitive-services/use-key-vault.md). For more information, *see* Cognitive Services [security](../../../../../cognitive-services/security-features.md).

To set the environment variable for your Form Recognizer resource key, open a console window, and follow the instructions for your operating system and development environment. Replace `<yourKey>` and `<yourEndpoint>` with the values from your resource in the Azure portal.

#### [Windows](#tab/windows)

Environment variables in Windows are ***not*** case-sensitive. They are typically named in uppercase, with words joined by an underscore. Start a CMD window and execute the following:

##### **Set your key variable**

```console
  set KEY=<yourKey>
```

##### **Set your endpoint variable**

```console
set ENDPOINT=<yourEndpoint>
```

* After you `set` your environment variables, you restart any running programs that will read the environment variable, including the console window. For example, if you are using Visual Studio or Visual Studio Code as your editor, restart before running the sample code.

    > [!NOTE]
    > If you only need to access the environment variable in the current running console, you can set the environment variable with `set` instead of `setx`.
    >
    > **set** modifies the current shell's (the window's) environment values, and the change is available immediately, but it is temporary. The change won't affect other shells that are running, and as soon as you close the shell, the new value is lost until you run set again.
    >
     > **setx** modifies the value permanently and affects all future shells. However,  bit doesn't modify the environment where shells are already running. You have to exit the shell and reopen it before the change will be available. The variable's value will remain modified until you change it again.

 Here are a few helpful commands to use with environment variables:

  | Command | Action | Example |
  |---------|--------|---------|
  | **setx** VARIABLE_NAME=value | Set or change the value of an environment variable| **setx** KEY=`<yourKey>`|
  | **setx** VARIABLE_NAME= | Delete the environment variable by setting the value to an empty string.|**setx** KEY= |
  | **set** VARIABLE_NAME | Display the value of a specific environment variable| **set** KEY|
  | **set**| Display all environment variables.|**set**|

#### [macOS](#tab/macOS)

Environment variables in macOS are case-sensitive. Conventionally, the variable name is declared in uppercase letters.

* The `export` command sets the variable and exports it to the global environment (available to other processes). However, it is temporary and lasts only until you close the terminal session. Open your terminal and enter the following:

##### **Set your key variable**

```bash
export key=<yourKey>
```

##### **Set your endpoint variable**

```bash
export endpoint=<yourEndpoint>
```

* You can set an environment variable permanently by placing an export command in your Bash  `~/.bash_profile` startup script:

  1. Use your favorite text editor to open the `~/.bash_profile` and add following command to create a permanent environment variable:

      ```bash
      export KEY=<yourKey> ENDPOINT=<yourEndpoint>
      ```

        Example: **export KEY="<yourKey>"**

  1. Save your changes to the `.bash_profile` file.

  1. Run the following command from your terminal window to make the changes effective:

      ```bash
      source ~/.bash-profile
      ```

Here are a few helpful commands to use with environment variables::

  | Command | Action | Example |
  |---------|--------|---------|
  | **export** VARIABLE_NAME=value | Set or change the value of a temporary environment variable ().| **export** KEY=`<yourKey>`|
  | **unset** VARIABLE_NAME | Delete an environment variable.|**unset** KEY |
  | &bullet; **printenv** VARIABLE_NAME</br> &bullet; **echo** $VARIABLE_NAME| &bullet; Display the value of a specific environment variable (with the **echo** command, precede the variable with $).| &bullet; **printenv** KEY </br>&bullet; **echo** $KEY</br>|
  | **printenv**| Display all environment variables.|**printenv**|

#### [Linux](#tab/linux)

Environment variables in Linux are case-sensitive. Conventionally, the variable name is declared in uppercase letters.

The `export` command sets the variable and exports it to the global environment (available to other processes). However, it is temporary and lasts only until you close the terminal session:

##### **Set your key variable**

```bash
export KEY=<yourKey>
```

##### **Set your endpoint variable**

```bash
export ENDPOINT=<yourEndpoint>
```

* You can set an environment variable permanently by placing an export command in your Bash `~/.bashrc` startup script:

  1. Use your favorite text editor to open the `~/.bash_profile` and add following command to create a permanent environment variable:

      ```bash
      export <VARIABLE>=<value>
      ```

        Example: **export KEY=<yourKey>**

  1. Save your changes to the `.bashrc` file.

  1. Run the following command from your terminal window to make the changes effective:

      ```bash
      source ~/.bashrc
      ```

Here are a few helpful commands to use with environment variables:

  | Command | Action | Example |
  |---------|--------|---------|
  | **export** VARIABLE_NAME=value | Set or change the value of a temporary environment variable (only lasts until you close the terminal session).| **export** KEY=`<yourKey>`|
  | **unset** VARIABLE_NAME| Delete an environment variable.|**unset** KEY= |
  | &bullet; **printenv** VARIABLE_NAME</br> &bullet; **echo** $VARIABLE_NAME| &bullet; Display the value of an environment variable.</br>&bullet; With the **echo** command, precede the variable with $.| &bullet; **printenv** KEY </br>&bullet; **echo** $KEY</br>|
  | **printenv**| Display all environment variables.|**printenv**|

---
