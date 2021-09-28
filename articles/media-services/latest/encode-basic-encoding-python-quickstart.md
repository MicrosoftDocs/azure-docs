---
title: Media Services Python basic encoding quickstart
description: This quickstart shows you how to do basic encoding with Python and Azure Media Services.
services: media-services
author: IngridAtMicrosoft
manager: femila

ms.service: media-services
ms.workload: 
ms.topic: quickstart
ms.date: 7/2/2021
ms.author: inhenkel
---

# Media Services basic encoding with Python

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

## Introduction

This quickstart shows you how to do basic encoding with Python and Azure Media Services. It uses the 2020-05-01 Media Service v3 API.

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Create a resource group to use with this quickstart.
- Create a Media Services v3 account.
- Get your storage account key.
- Create a service principal and key.

## Get the sample

Create a fork and clone the sample located in the [Python samples repository](https://github.com/Azure-Samples/media-services-v3-python). For this quickstart, we're working with the BasicEncoding sample.

## Create the .env file

Get the values from your account to create an *.env* file. That's right, save it with no name, just the extension.  Use *sample.env* as a template then save the *.env* file to the BasicEncoder folder in your local clone.

## Use Python virtual environments
For samples, we recommend that you always create and activate a Python virtual environment using the following steps:

1. Open the sample folder in VSCode or other editor
2. Create the virtual environment

    ``` bash
      # py -3 uses the global python interpreter. You can also use python -m venv .venv.
      py -3 -m venv .venv
    ```

   This command runs the Python venv module and creates a virtual environment in a folder named .venv.

3. Activate the virtual environment:

    ``` bash
      .venv\scripts\activate
    ```

  A virtual environment is a folder within a project that isolates a copy of a specific Python interpreter. Once you activate that environment (which Visual Studio Code does automatically), running pip install installs a library into that environment only. When you then run your Python code, it runs in the environment's exact context with specific versions of every library. And when you run pip freeze, you get the exact list of the those libraries. (In many of the samples, you create a requirements.txt file for the libraries you need, then use pip install -r requirements.txt. A requirements file is generally needed when you deploy code to Azure.)

## Set up

Set up and [configure your local Python dev environment for Azure](/azure/developer/python/configure-local-development-environment)

Install the azure-identity library for Python. This module is needed for Azure Active Directory authentication. See the details at [Azure Identity client library for Python](/python/api/overview/azure/identity-readme#environment-variables)

  ``` bash
  pip install azure-identity
  ```

Install the Python SDK for [Azure Media Services](/python/api/overview/azure/media-services)

The Pypi page for the Media Services Python SDK with latest version details is located at - [azure-mgmt-media](https://pypi.org/project/azure-mgmt-media/)

  ``` bash
  pip install azure-mgmt-media
  ```

Install the [Azure Storage SDK for Python](https://pypi.org/project/azure-storage-blob/)

  ``` bash
  pip install azure-storage-blob
  ```

You can optionally install ALL of the requirements for a given samples by using the "requirements.txt" file in the samples folder

  ``` bash
  pip install -r requirements.txt
  ```

## Try the code

The code below is thoroughly commented.  Use the whole script or use parts of it for your own script.

In this sample, a random number is generated for naming things so you can identify them as a group that was created together when you ran the script.  The random number is optional, and can be removed when you're done testing the script.

We're not using the SAS URL for the input asset in this sample.

[!code-python[Main](../../../media-services-v3-python/BasicEncoding/basic-encoding.py)]

## Delete resources

When you're finished with the quickstart, delete the resources created in the resource group.

## Next steps

Get familiar with the [Media Services Python SDK](/python/api/azure-mgmt-media/)

## Resources

- See the Azure Media Services [management API](/python/api/overview/azure/mediaservices/management).
- Learn how to use the [Storage APIs with Python](/azure/developer/python/azure-sdk-example-storage-use?tabs=cmd)
- Learn more about the [Azure Identity client library for Python](/python/api/overview/azure/identity-readme#environment-variables)
- Learn more about [Azure Media Services v3](./media-services-overview.md).
- Learn about the [Azure Python SDKs](/azure/developer/python)
- Learn more about [usage patterns for Azure Python SDKs](/azure/developer/python/azure-sdk-library-usage-patterns)
- Find more Azure Python SDKs in the [Azure Python SDK index](/azure/developer/python/azure-sdk-library-package-index)
- [Azure Storage Blob Python SDK reference](/python/api/azure-storage-blob/)