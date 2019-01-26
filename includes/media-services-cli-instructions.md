---
title: include file
description: include file
services: media-services
author: Juliako
ms.service: media-services
ms.topic: include
ms.date: 01/25/2019
ms.author: juliako
ms.custom: include file
---

## Open CLI Shell

It is recommended to use the [Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/overview?view=azure-cli-latest). The Cloud Shell is a free, interactive shell that you can use to run the steps in this article. Common Azure tools are preinstalled and configured in Cloud Shell for you to use with your account. Just select the Copy button to copy the code, paste it in Cloud Shell, and then press Enter to run it. There are a few ways to open Cloud Shell:

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest). 

### Login

To start using CLI shell (in the cloud or locally), run `az login` to create a connection with Azure.

If the CLI can open your default browser, it will do so and load a sign-in page. Otherwise, you need to open a browser page and follow the instructions on the command line to enter an authorization code after navigating to https://aka.ms/devicelogin in your browser.

### Specify location of files

Many Media Services CLI commands allow you to pass a parameter with a file name. 

If you are using the **Azure Cloud Shell**, upload your file to the Cloud Shell (find the upload/download files button at the top of the shell window). 

![Upload files]

Then, reference the file like this: `@{FileName}`. 

If you are using the Azure CLI locally, specify the whole file path. For example, `@c:\tracks.json`.


[Upload files]: ./media/media-services-cli/upload-download-files.png