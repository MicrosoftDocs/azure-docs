---
title: placeholder title
description: placeholder description text
author: apimpm
ms.author: edoyle
ms.date: 11/30/2020
ms.service: api-management
ms.topic: how-to
---

In this tutorial, we describe how to setup your local development environment, carry out changes in the developer portal, and publish and deploy them to an Azure Storage Account.

If you have already uploaded or modified media files in the managed portal, you need to follow the [[Move from managed to self-hosted]] guide instead.

## Requirements

To set up a local development environment, you need to have:

- API Management instance. If you don't have one, [follow this tutorial](https://docs.microsoft.com/azure/api-management/get-started-create-service-instance).
- Storage Account with [the static websites feature](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blob-static-website) enabled. Learn [how to create a new Storage Account in Azure](https://docs.microsoft.com/azure/storage/common/storage-quickstart-create-account?tabs=azure-portal).
- Git on your machine. Install it by following [this Git tutorial](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).
- Node.js (LTS version, `v10.15.0` or later) and npm on your machine. Follow [this tutorial](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to install them.
- Azure CLI. Follow [the Azure CLI installation steps](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows?view=azure-cli-latest).

## Step 1: Setup local environment

Clone the repository, switch to the latest developer portal release, and install npm packages.

Before you run the code below, check the current release tag in the [Releases section of the repository](https://github.com/Azure/api-management-developer-portal/releases) and replace the sample `10.11.12` value below with it.

```sh
git clone https://github.com/Azure/api-management-developer-portal.git
cd api-management-developer-portal
git checkout 10.11.12
npm install
```

Note: If you wish to have the best experience with the developer portal, always use the latest [GitHub release](https://github.com/Azure/api-management-developer-portal/releases) and keep updating your fork. The `master` branch of this repository is used for daily development purposes and contains unstable version of the software.

## Step 2: Configure

The developer portal requires API Management's REST API to manage the content.

### File `./src/config.design.json`

```json
{
  "managementApiUrl": "https://<service-name>.management.azure-api.net/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/xxxxx/providers/Microsoft.ApiManagement/service/<service-name>",
  "managementApiAccessToken": "SharedAccessSignature ...",
  "environment": "development",
  "backendUrl": "https://<service-name>.developer.azure-api.net",
  "useHipCaptcha": false
}
```

1. Replace `<service-name>` in `"managementApiUrl": "https://<service-name>.management.azure-api.net/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/xxxxx/providers/Microsoft.ApiManagement/service/<service-name>"` with the name of your API Management instance. For example: `https://contoso-api.management.azure-api.net/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/xxxxx/providers/Microsoft.ApiManagement/service/contoso-api`. You don't need to replace the `xxx...x` strings.
1. [Enable the direct REST API access](https://docs.microsoft.com/en-us/rest/api/apimanagement/apimanagementrest/azure-api-management-rest-api-authentication#ManuallyCreateToken) to your API Management instance. Copy the generated token and place it in the `"managementApiAccessToken": "SharedAccessSignature ..."` parameter.
1. Replace `<service-name>` in `"backendUrl": "https://<service-name>.management.azure-api.net"` with the name of your API Management instance. For example: `https://contoso-api.management.azure-api.net`.
1. If you'd like to enable CAPTCHA in your developer portal, follow the [[Enable CAPTCHA]] tutorial.

### File `./src/config.publish.json`

```json
{
  "managementApiUrl": "https://<service-name>.management.azure-api.net/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/xxxxx/providers/Microsoft.ApiManagement/service/<service-name>",
  "managementApiAccessToken": "SharedAccessSignature...",
  "environment": "publishing",
  "useHipCaptcha": false
}
```

1. Copy and paste the `"managementApiUrl"`, and `"managementApiAccessToken"` values from the previous configuration file.
1. Provide the connection string to your Storage Account in the `"blobStorageConnectionString": "DefaultEndpointsProtocol=https;AccountName=..."` parameter. You can find it the *Access keys* section of your Storage Account in the Azure portal. This storage account will host your portal.
1. If you'd like to enable CAPTCHA in your developer portal, follow the [[Enable CAPTCHA]] tutorial.

### File `./src/config.runtime.json`

```json
{
  "managementApiUrl": "https://<service-name>.management.azure-api.net/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/xxxxx/providers/Microsoft.ApiManagement/service/<service-name>",
  "environment": "runtime",
  "backendUrl": "https://<service-name>.developer.azure-api.net"
}
```

1. Copy and paste the `"managementApiUrl"` value from the previous configuration file.
1. Replace `<service-name>` in `"backendUrl": "https://<service-name>.developer.azure-api.net"` with the name of your API Management instance.

### Storage Account

Configure the *Static website* feature in your Storage Account by providing routes to the index and error pages:

1. Navigate to your Storage Account in the Azure portal and click on *Static website* from the menu on the left.
1. In the field *Index document name* type *index.html*.
1. In the field *Error document path* type *404/index.html*.
1. Click *Save*.

Enable CORS:

1. Navigate to your Storage Account in the Azure portal and click on *CORS* from the menu on the left.
1. Set:
    - *Allowed origins* to **\***
    - *Allowed headers* to **\***
    - *Exposed headers* to **\***
    - *Max age* to **0**
1. Select all the HTTP verbs in the *Allowed methods* column.
1. Click *Save*.

## Step 3: Provision the default template

API Management service does not contain any portal content by default, so you need to provision it manually. Do not run this step if you already have the portal content in your API Management service (for example, if you're migrating from the managed version).

First, specify the following parameters in the `scripts\generate.bat` file:

```sh
set management_endpoint="<service-name>.management.azure-api.net"
set access_token="SharedAccessSignature ..."
set source_folder="..."
```

| Parameter name in `generate.bat` | Parameter description                                  | Notes                                                                                                                                                                                                               |
|----------------------------------|--------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `management_endpoint`            | API Management direct API endpoint                     |                                                                                                                                                                                                                     |
| `access_token`                   | API Management REST API access token                   | It's the same access token you used for the `./src/config.design.json` and `./src/config.publish.json` files.                                                                                                       |                                                                                                                                                                               |
| `source_folder`                    | Location of the folder with the data and media content.| You don't need to change this value.                                                                                                                                                                                |


Execute the data generation script, which will upload content through the REST API:

```sh
cd scripts.v2
.\generate.bat
cd ..
```

## Step 4: Run the portal

Now you can build and run a local portal instance in the development mode (with all the optimizations turned off and source maps turned on).

Execute the command:

```sh
npm start
```

It will automatically open the default browser with your local developer portal instance. The default address is `http://localhost:8080`, but the port can change if `8080` is already occupied. Any changes to the codebase of the project will trigger a rebuild and refresh your browser window.

## Step 5: Edit through the visual editor

Customize your portal, author content, organize the structure of the website, and style its appearance through the built-in visual editor. Refer to [the Azure documentation tutorial for the managed version of the portal](https://aka.ms/apimdocs/customizeportal), which covers the basics of the administrative user interface and lists recommended changes to the default content.

![API Management developer portal development - save content](media/readme-dev-save.png)

## Step 6: Publish locally

The portal data is described in form of strong-typed objects. The following command will translate them into static files and place the output in the `./dist/website` directory:

```sh
npm run publish
```

![API Management developer portal development - generate static files](media/readme-dev-generate.png)

## Step 7: Upload

Use Azure CLI to upload the locally generated static files to a blob, and make them accessible to your visitors:

```sh
az storage blob upload-batch --source dist/website --destination $web --connection-string <account-connection-string>
```

Replace `<account-connection-string>` with the connection string of your Storage Account. You can get it from the *Access keys* section of your Storage Account, similarly to how you did it for the `./src/config.publish.json` file.

![API Management developer portal development - publish portal](media/readme-dev-upload.png)

## Step 8: Visit your website

Your website is now live under the hostname specified in your Azure Storage properties (*Primary endpoint* in *Static websites*).

![API Management developer portal development - visit portal](media/readme-dev-visit.png)

## Step 9: Change API Management notification templates

You need to replace the developer portal URL in the API Management notification templates to point to the self-hosted portal. [This Azure documentation article](https://docs.microsoft.com/azure/api-management/api-management-howto-configure-notifications) explains how to edit them.

In particular, we recommend the following changes to the default templates 

| Notification template | Original content part to modify | Example of content part modification (assuming portal hosted at `https://portal.contoso.com/`) |
| -- | -- | -- |
| Email change confirmation |  `<a id="confirmUrl" href="$ConfirmUrl" style="text-decoration:none"><strong>$ConfirmUrl</strong></a>` |
| New developer account confirmation | `<a id="confirmUrl" href="$ConfirmUrl" style="text-decoration:none"><strong>$ConfirmUrl</strong></a>` | `<a id="confirmUrl" href="https://portal.contoso.com/signup?$ConfirmQuery" style="text-decoration:none"><strong>https://portal.contoso.com/signup?$ConfirmQuery</strong></a>` |
| Invite user | `<a href="$ConfirmUrl">$ConfirmUrl</a>` | `<a href="https://portal.contoso.com/confirm-v2/identities/basic/invite?$ConfirmQuery">https://portal.contoso.com/confirm-v2/identities/basic/invite?$ConfirmQuery</a>` |
| New subscription activated | `Visit the developer <a href="http://$DevPortalUrl/developer">profile area</a> to manage your subscription and subscription keys` | `Visit the developer <a href="https://portal.contoso.com/profile">profile area</a> to manage your subscription and subscription keys` |
| New subscription activated | `Thank you for subscribing to the <a href="http://$DevPortalUrl/products/$ProdId"><strong>$ProdName</strong></a> and welcome to the $OrganizationName developer community. We are delighted to have you as part of the team and are looking forward to the amazing applications you will build using our API!` | `Thank you for subscribing to the <a href="https://portal.contoso.com/product#product=$ProdId"><strong>$ProdName</strong></a> and welcome to the $OrganizationName developer community. We are delighted to have you as part of the team and are looking forward to the amazing applications you will build using our API!` |
| New subscription activated | `<a href="http://$DevPortalUrl/docs/services?product=$ProdId">Learn about the API</a>` | `<a href="https://portal.contoso.com/product#product=$ProdId">Learn about the API</a>` |
| New subscription activated | `<p style="font-size:12pt;font-family:'Segoe UI'"><strong><a href="http://$DevPortalUrl/applications">Feature your app in the app gallery</a></strong></p><p style="font-size:12pt;font-family:'Segoe UI'">You can publish your application on our gallery for increased visibility to potential new users.</p><p style="font-size:12pt;font-family:'Segoe UI'"><strong><a href="http://$DevPortalUrl/issues">Stay in touch</a></strong></p><p style="font-size:12pt;font-family:'Segoe UI'">If you have an issue, a question, a suggestion, a request, or if you just want to tell us something, go to the <a href="http://$DevPortalUrl/issues">Issues</a> page on the developer portal and create a new topic.</p>` | (remove) |
| Password change confirmation | `<a href="$DevPortalUrl">$DevPortalUrl</a>` | `<a href="https://portal.contoso.com/confirm-password?$ConfirmQuery">https://portal.contoso.com/confirm-password?$ConfirmQuery</a>` |
| All templates | *Footer link pointing to the developer portal* | *Use `https://portal.contoso.com/` instead* |

## Next steps

- [[Enable CAPTCHA]]
- Learn about [[Alternative processes for self-hosted portal]]
