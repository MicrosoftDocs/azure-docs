---
title: "Quickstart: Document Translation Go"
description: 'Document translation processing using the REST API and Go programming language'
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: include
ms.date: 12/08/2022
ms.author: lajanuar
recommendations: false
---

## Set up your Go environment

You can use any text editor to write Go applications. We recommend using the latest version of [Visual Studio Code and the Go extension](/azure/developer/go/configure-visual-studio-code).

> [!TIP]
>
> If you're new to Go, try the [Get started with Go](/training/modules/go-get-started/) Learn module.

1. If you haven't done so already, [download and install Go](https://go.dev/doc/install).

    * Download the Go version for your operating system.
    * Once the download is complete, run the installer.
    * Open a command prompt and enter the following to confirm Go was installed:

        ```console
          go version
        ```

## Build your Go application

1. In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app called **document-translation**, and navigate to it.

1. Create a new GO file named **document-translation.go** from the **document-translation** directory.

1. Copy and paste the provided code sample into your **document-translation.go** file. Make sure you update the key variable with the value from your Azure portal Translator instance:


## Run your Go application

Once you've added a code sample to your application, your Go program can be executed in a command or terminal prompt. Make sure your prompt's path is set to the **document-translation** folder and use the following command:

```console
 go run document-translation.go
```