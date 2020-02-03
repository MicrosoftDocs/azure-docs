---
title: Deploy from GitHub
description: Use deploy to Azure button to deploy templates in GitHub repository.
ms.topic: conceptual
ms.date: 02/03/2020
---
# Use button to deploy from GitHub repository

This article describes how to use the **Deploy to Azure** button to deploy templates from a GitHub repository. You can add the button directly to your GitHub repository or to a web page that references the repository.

## Use common image

To add the button to your web page or repository, use the following image:

```html
<img src="https://aka.ms/deploytoazurebutton"/>
```

The image appears as:

![Deploy to Azure button](https://aka.ms/deploytoazurebutton)

## Create URL for deploying template

To create the URL for your template, start with the raw URL to the template in your repo:

`https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-storage-account-create/azuredeploy.json`

Then, URL encode it.

`https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-storage-account-create%2Fazuredeploy.json`

Each link starts with the same base URL:

`https://portal.azure.com/#create/Microsoft.Template/uri/`

Add your URL-encoded template link to the base URL.

`https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-storage-account-create%2Fazuredeploy.json`

You have your full URL for the link.

## Create Deploy to Azure button

The link you add to your web page or GitHub repository contains the URI and the image.

```html
<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-storage-account-create%2Fazuredeploy.json" target="_blank">
  <img src="https://aka.ms/deploytoazurebutton"/>
</a>
```

You can deploy the example template with the following button:

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-storage-account-create%2Fazuredeploy.json" target="_blank">
  <img src="https://aka.ms/deploytoazurebutton"/>
</a>

## Next steps

- To learn more about templates, see [Understand the structure and syntax of Azure Resource Manager templates](template-syntax.md).
