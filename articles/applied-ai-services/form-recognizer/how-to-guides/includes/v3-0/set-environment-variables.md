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

## Set environment variables

To interact with the Form Recognizer service, you'll need to create an instance of the `DocumentAnalysisClient` class. To do so, you'll instantiate the client with your `key` and `endpoint` from the Azure portal. For this project, we'll use environment variables to store and access credentials.

> [!IMPORTANT]
>
> Don't include your key directly in the code and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../../cognitive-services/use-key-vault.md). For more information, *see* Cognitive Services [security](../../../../../cognitive-services/security-features.md).

To set the environment variable for your Form Recognizer resource key, open a console window, and follow the instructions for your operating system and development environment. Replace `<your-key>` and `<your-endpoint>` with the values from your resource in the Azure portal.

#### [Windows](#tab/windows)

* Environment variables in Windows are ***not*** case-sensitive. They are typically named in uppercase, with words joined by an underscore.

* **Set, change, delete or display an environment variable**
  | Command | Action | Example |
  |---------|--------|---------|
  | **setx** VARIABLE_NAME=value | Set or change the value of an environment variable| **setx** KEY=`<your-key>`|
  | **setx** VARIABLE_NAME= | Delete the environment variable by setting the value to an empty string.|**setx** KEY= |
  | **set** variable | Display the value of a specific environment variable| **set** KEY|
  | **set**| Display all environment variables.|**set**|

  **Set your key variable**

  ```console
    set KEY=<your-key>
  ```

  **Set your endpoint variable**

    ```console
    set ENDPOINT=<your-endpoint>
    ```

* After you SET your environment variables, you may need to restart any running programs that need to read the environment variable, including the console window. For example, if you are using Visual Studio or Visual Studio Code as your editor, restart before running the sample code.

> [!NOTE]
> If you only need to access the environment variable in the current running console, you can set the environment variable with `set` instead of `setx`.
>
> **set** modifies the current shell's (the window's) environment values, and the change is available immediately, but it is temporary. The change won't affect other shells that are running, and as soon as you close the shell, the new value is lost until you run set again.
>
 > **setx** modifies the value permanently and affects all future shells. However,  bit doesn't modify the environment where shells are already running. You have to exit the shell and reopen it before the change will be available. The variable's value will remain modified until you change it again.

#### [macOS](#tab/macOS)

* Environment variables in macOS are case-sensitive.

* Conventionally, the variable name is declared in uppercase letters.

  * The `export` command sets the variable and exports it to the global environment (available to other processes). However, it is temporary and lasts only until you close the terminal session.

  | Command | Action | Example |
  |---------|--------|---------|
  | **export** VARIABLE=value | Set or change the value of a temporary environment variable ().| **export** KEY=`<your-key>`|

  * **Set your key variable**

    ```bash
    export key=<your-key>
    ```

  * **Set your endpoint variable**

    ```bash
    export endpoint=<your-endpoint>
    ```

* You can set an environment variable permanently by placing an export command in your Bash  `~/.bash_profile` startup script:

  1. Use your favorite text editor to open the `~/.bash_profile` and add following command to create a permanent environment variable:

      ```bash
      export <VARIABLE>=<value>
      ```

        Example: **export KEY="<your_key>"**

  1. Save your changes to the `.bash_profile` file.

  1. Execute the changes by  restarting the terminal window or using the following command:

      ```bash
      source ~/.bash-profile
      ```

* Here are commands for deleting (`unset`) and displaying (`printenv`) environment variables:

  | Command | Action | Example |
  |---------|--------|---------|
  | **unset** VARIABLE | Delete an environment variable.|**unset** KEY |
  | &bullet; **printenv** VARIABLE</br> &bullet; **echo** $VARIABLE| &bullet; Display the value of a specific environment variable (with the **echo** command, precede the variable with $).| &bullet; **printenv** KEY </br>&bullet; **echo** $KEY</br>|
  | **printenv**| Display all environment variables.|**printenv**|

#### [Linux](#tab/linux)

* Environment variables in Linux are case-sensitive.

* Conventionally, the variable name is declared in uppercase letters.

  * The `export` command sets the variable and exports it to the global environment (available to other processes). However, it is temporary and lasts only until you close the terminal session:

  | Command | Action | Example |
  |---------|--------|---------|
  | **export** VARIABLE=value | Set or change the value of a temporary environment variable (only lasts until you close the terminal session).| **export** KEY=`<your-key>`|

  * **Set your key variable**

    ```bash
    export key=<your-key>
    ```

  * **Set your endpoint variable**

    ```bash
    export endpoint=<your-endpoint>
    ```

* You can set an environment variable permanently by placing an export command in your Bash `~/.bashrc` startup script:

  1. Use your favorite text editor to open the `~/.bash_profile` and add following command to create a permanent environment variable:

      ```bash
      export <VARIABLE>=<value>
      ```

        Example: **export KEY=<your_key>**

  1. Save your changes to the `.bashrc` file.

  1. Execute the changes by  restarting the terminal window or using the following command:

      ```bash
      source ~/.bashrc
      ```

* Here are the commands for deleting (`unset`) and displaying environment variables:

  | Command | Action | Example |
  |---------|--------|---------|
  | **unset** VARIABLE | Delete an environment variable.|**unset** KEY= |
  | &bullet; **printenv** VARIABLE</br> &bullet; **echo** $VARIABLE| &bullet; Display the value of an environment variable.</br>&bullet; With the **echo** command, precede the variable with $.| &bullet; **printenv** KEY </br>&bullet; **echo** $KEY</br>|
  | **printenv**| Display all environment variables.|**printenv**|

    **Set your key variable**

    ```bash
        export key=<your-key>
    ```

    **Set your endpoint variable**

    ```bash
        export endpoint=<your-endpoint>
    ```

After you add the environment variable, run  the following command from your console window to make the changes effective:

```bash
source ~/.bash_profile

```

* The following table provides commands for deleting (unset) and displaying environment variables:

  | Command | Action | Example |
  |---------|--------|---------|
  | **unset** VARIABLE | Delete an environment variable.|**unset** KEY |
  | &bullet; **printenv** VARIABLE</br> &bullet; **echo** $VARIABLE| &bullet; Display the value of a specific environment variable (with the **echo** command, precede the variable with $).| &bullet; **printenv** KEY </br>&bullet; **echo** $KEY</br>|
  | **printenv**| Display all environment variables.|**printenv**|

---
