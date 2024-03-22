---
title: Deploy to Azure button
description: Use button to deploy remote Azure Resource Manager templates.
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 03/20/2024
---

# Use a deployment button to deploy remote templates

This article describes how to use the **Deploy to Azure** button to deploy remote ARM JSON templates from a GitHub repository or an Azure storage account. You can add the button directly to the _README.md_ file in your GitHub repository. Or, you can add the button to a web page that references the repository. This method doesn't support deploying remote [Bicep files](../bicep/overview.md).

The deployment scope is determined by the template schema. For more information, see:

- [resource groups](deploy-to-resource-group.md)
- [subscriptions](deploy-to-subscription.md)
- [management groups](deploy-to-management-group.md)
- [tenants](deploy-to-tenant.md)

[!INCLUDE [permissions](../../../includes/template-deploy-permissions.md)]

## Use common image

To add the button to your web page or repository, use the following image:

```markdown
![Deploy to Azure](https://aka.ms/deploytoazurebutton)
```

```html
<img src="https://aka.ms/deploytoazurebutton"/>
```

The image appears as:

:::image type="content" source="https://aka.ms/deploytoazurebutton" alt-text="Screenshot of Deploy to Azure button.":::

## Create URL for deploying template

This section shows how to get the URLs for the templates stored in GitHub and Azure storage account, and how to format the URLs.

### Template stored in GitHub

To create the URL for your template, start with the raw URL to the template in your GitHub repo. To see the raw URL, select **Raw**.

:::image type="content" source="./media/deploy-to-azure-button/select-raw.png" alt-text="Screenshot showing how to select Raw in GitHub.":::

The format of the URL is:

```html
https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.storage/storage-account-create/azuredeploy.json
```

[!INCLUDE [Deploy templates in private GitHub repo](../../../includes/resource-manager-private-github-repo-templates.md)]

If you're using [Git with Azure Repos](/azure/devops/repos/git/) instead of a GitHub repo, you can still use the **Deploy to Azure** button. Make sure your repo is public. Use the [Items operation](/rest/api/azure/devops/git/items/get) to get the template. Your request should be in the following format:

```http
https://dev.azure.com/{organization-name}/{project-name}/_apis/git/repositories/{repository-name}/items?scopePath={url-encoded-path}&api-version=6.0
```

## Template stored in Azure storage account

The format of the URLs for the templates stored in a public container is:

```html
https://{storage-account-name}.blob.core.windows.net/{container-name}/{template-file-name}
```

For example:

```html
https://demostorage0215.blob.core.windows.net/democontainer/azuredeploy.json
```

You can secure the template with SAS token. For more information, see [How to deploy private ARM template with SAS token](./secure-template-with-sas-token.md). The following url is an example with SAS token:

```html
https://demostorage0215.blob.core.windows.net/privatecontainer/azuredeploy.json?sv=2019-07-07&sr=b&sig=rnI8%2FvKoCHmvmP7XvfspfyzdHjtN4GPsSqB8qMI9FAo%3D&se=2022-02-16T17%3A47%3A46Z&sp=r
```

## Format the URL

Once you have the URL, you need to convert the URL to a URL-encoded value. You can use an online encoder or run a command. The following PowerShell example shows how to URL encode a value.

```powershell
$url = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.storage/storage-account-create/azuredeploy.json"
[uri]::EscapeDataString($url)
```

The example URL has the following value when URL encoded.

```html
https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.storage%2Fstorage-account-create%2Fazuredeploy.json
```

Each link starts with the same base URL:

```html
https://portal.azure.com/#create/Microsoft.Template/uri/
```

Add your URL-encoded template link to the end of the base URL.

```html
https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.storage%2Fstorage-account-create%2Fazuredeploy.json
```

You have your full URL for the link.

## Create Deploy to Azure button

Finally, put the link and image together.

To add the button with Markdown in the _README.md_ file in your GitHub repository or a web page, use:

```markdown
[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.storage%2Fstorage-account-create%2Fazuredeploy.json)
```

For HTML, use:

```html
<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.storage%2Fstorage-account-create%2Fazuredeploy.json" target="_blank">
  <img src="https://aka.ms/deploytoazurebutton"/>
</a>
```

For Git with Azure repo, the button is in the format:

```markdown
[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fdev.azure.com%2Forgname%2Fprojectname%2F_apis%2Fgit%2Frepositories%2Freponame%2Fitems%3FscopePath%3D%2freponame%2fazuredeploy.json%26api-version%3D6.0)
```

## Deploy the template

To test the full solution, select the following button:

:::image type="content" source="https://aka.ms/deploytoazurebutton" alt-text="Screenshot of Deploy to Azure button with link." link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.storage%2Fstorage-account-create%2Fazuredeploy.json":::

The portal displays a pane that allows you to easily provide parameter values. The parameters are pre-filled with the default values from the template. The camel-cased parameter name, *storageAccountType*, defined in the template is turned into a space-separated string when displayed on the portal.

:::image type="content" source="./media/deploy-to-azure-button/portal.png" alt-text="Screenshot of Azure portal displaying pane for providing parameter values.":::

## Next steps

- To learn more about templates, see [Understand the structure and syntax of ARM templates](./syntax.md).
