---
title: Deploy to Azure button
description: Use button to deploy Azure Resource Manager templates from a GitHub repository.
ms.topic: conceptual
ms.date: 05/04/2020
---
# Use a deployment button to deploy templates from GitHub repository

This article describes how to use the **Deploy to Azure** button to deploy templates from a GitHub repository. You can add the button directly to the README.md file in your GitHub repository or to a web page that references the repository. This method only supports resource group level deployment.

## Use common image

To add the button to your web page or repository, use the following image:

```html
<img src="https://aka.ms/deploytoazurebutton"/>
```

The image appears as:

![Deploy to Azure button](https://aka.ms/deploytoazurebutton)

## Create URL for deploying template

To create the URL for your template, start with the raw URL to the template in your repo:

```html
https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-storage-account-create/azuredeploy.json
```

Then, URL encode it. You can use an online encoder or run a command. The following PowerShell example shows how to URL encode a value.

```powershell
[uri]::EscapeDataString($url)
```

The example URL has the following value when URL encoded.

```html
https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-storage-account-create%2Fazuredeploy.json
```

Each link starts with the same base URL:

```html
https://portal.azure.com/#create/Microsoft.Template/uri/
```

Add your URL-encoded template link to the end of the base URL.

```html
https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-storage-account-create%2Fazuredeploy.json
```

You have your full URL for the link.

## Create Deploy to Azure button

Finally, put the link and image together.

To add the button with Markdown in the README.md file in your GitHub repository or a web page, use:

```markdown
[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-storage-account-create%2Fazuredeploy.json)
```

For HTML, use:

```html
<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-storage-account-create%2Fazuredeploy.json" target="_blank">
  <img src="https://aka.ms/deploytoazurebutton"/>
</a>
```

## Deploy the template

To test the full solution, select the following button:

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-storage-account-create%2Fazuredeploy.json)

The portal displays a pane that allows you to easily provide parameter values. The parameters are pre-filled with the default values from the template.

![Use portal to deploy](./media/deploy-to-azure-button/portal.png)

## Next steps

- To learn more about templates, see [Understand the structure and syntax of Azure Resource Manager templates](template-syntax.md).
