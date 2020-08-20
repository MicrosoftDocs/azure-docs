---
title: How to set up CLI Shell
description: include file
services: media-services
author: IngridAtMicrosoft
ms.service: media-services
ms.topic: include
ms.date: 08/20/2020
ms.author: inhenkel
---

## Use CLI Shell

It is recommended to use [Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/overview?view=azure-cli-latest) to execute CLI commands. **Cloud Shell** is a free, interactive shell that you can use to run the steps in this article. Common Azure tools are preinstalled and configured in Cloud Shell for you to use with your account. It provides the flexibility of choosing the shell experience that best suits the way you work. Linux users can opt for a Bash experience, while Windows users can opt for PowerShell.

You can also install the CLI locally. See [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) for instructions for your platform.

### Sign in

Using a local install of the CLI requires signing in to Azure. This step is not required for Azure Cloud Shell. Sign in with the `az login` command.

If the CLI can open your default browser, it will do so and load a sign-in page. Otherwise, you need to open a browser page and follow the instructions on the command line to enter an authorization code after navigating to https://aka.ms/devicelogin in your browser.