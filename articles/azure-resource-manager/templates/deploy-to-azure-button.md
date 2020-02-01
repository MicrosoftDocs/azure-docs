---
title: Deploy from GitHub
description: Use deploy to Azure button to deploy templates in GitHub repository.
ms.topic: conceptual
ms.date: 01/31/2020
---
# Use button to deploy from GitHub repository

This article describes how to use the **Deploy to Azure** button to deploy templates from a GitHub repository. You can add the button directly to your GitHub repository or to a web page that references the repository.

## Use common image

To add the button to your web page or repository, use the image at:

`https://aka.ms/deploytoazurebutton`

The image appears as:

![Deploy to Azure button](https://aka.ms/deploytoazurebutton)

## Create URI for deploying template

Each link starts with the same base URI:

`https://portal.azure.com/#create/Microsoft.Template/uri/`

After that base, add the URL-encoded link to the raw template in GitHub. For example, to link to a template at:

`https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-aks/azuredeploy.json`

First, encode it.

`https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-aks%2Fazuredeploy.json`

Then, add it to the base URI.

`https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-aks%2Fazuredeploy.json`

## Add link

The link you add to your web page or GitHub repository contains the URI and the image.

```html
<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-aks%2Fazuredeploy.json" target="_blank">
  <img src="https://aka.ms/deploytoazurebutton"/>
</a>
```

You can deploy the example template with the following button:

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-aks%2Fazuredeploy.json" target="_blank">
  <img src="https://aka.ms/deploytoazurebutton"/>
</a>

## Next steps

- To learn more about templates, see [Understand the structure and syntax of Azure Resource Manager templates](template-syntax.md).

