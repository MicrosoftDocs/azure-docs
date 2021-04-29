---
title: Self-host the developer portal
titleSuffix: Azure API Management
description: Learn how to self-host the API Management developer portal.
author: dlepow
ms.author: apimpm
ms.date: 04/15/2021
ms.service: api-management
ms.topic: how-to
---

# Self-host the API Management developer portal

This tutorial describes how to self-host the [API Management developer portal](api-management-howto-developer-portal.md). Self-hosting gives you flexibility to extend the developer portal with custom logic and widgets that dynamically customize pages on runtime. You can self-host multiple portals for your API Management instance, with different features. When you self-host a portal, you become its maintainer and you are responsible for its upgrades. 

The following steps show how to set up your local development environment, carry out changes in the developer portal, and publish and deploy them to an Azure storage account.

If you have already uploaded or modified media files in the managed portal, see [Move from managed to self-hosted](#move-from-managed-to-self-hosted-developer-portal), later in this article.

[!INCLUDE [premium-dev-standard-basic.md](../../includes/api-management-availability-premium-dev-standard-basic.md)]

## Prerequisites

To set up a local development environment, you need to have:

- An API Management service instance. If you don't have one, see [Quickstart - Create an Azure API Management instance](get-started-create-service-instance.md).
- An Azure storage account with [the static websites feature](../storage/blobs/storage-blob-static-website.md) enabled. See [Create a storage account](../storage/common/storage-account-create.md).
- Git on your machine. Install it by following [this Git tutorial](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).
- Node.js (LTS version, `v10.15.0` or later) and npm on your machine. See [Downloading and installing Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).
- Azure CLI. Follow [the Azure CLI installation steps](/cli/azure/install-azure-cli-windows).

## Step 1: Set up local environment

To set up your local environment, you'll have to clone the repository, switch to the latest release of the developer portal, and install npm packages.

1. Clone the [api-management-developer-portal](https://github.com/Azure/api-management-developer-portal.git) repo from GitHub:

    ```console
    git clone https://github.com/Azure/api-management-developer-portal.git
    ```
1. Go to your local copy of the repo:

    ```console
    cd api-management-developer-portal
    ```

1. Check out the latest release of the portal.

    Before you run the following code, check the current release tag in the [Releases section of the repository](https://github.com/Azure/api-management-developer-portal/releases) and replace `<current-release-tag>` value with the latest release tag.
    
    ```console
    git checkout <current-release-tag>
    ```

1. Install any available npm packages:

    ```console
    npm install
    ```

> [!TIP]
> Always use the [latest portal release](https://github.com/Azure/api-management-developer-portal/releases) and keep your forked portal up-to-date. The Software Engineers use the `master` branch of this repository for daily development purposes. It has unstable versions of the software.

## Step 2: Configure JSON files, static website, and CORS settings

The developer portal requires API Management's REST API to manage the content.

### config.design.json file

Go to the `src` folder and open the `config.design.json` file.

```json
{
  "environment": "development",
  "managementApiUrl": "https://<service-name>.management.azure-api.net",
  "managementApiAccessToken": "SharedAccessSignature ...",
  "backendUrl": "https://<service-name>.developer.azure-api.net",
  "useHipCaptcha": false
}
```

Configure the file:

1. In the `managementApiUrl` value, replace `<service-name>` with the name of your API Management instance. If you configured a [custom domain](configure-custom-domain.md), use it instead (for example, `https://management.contoso.com`).

    ```json
    {
    ...
    "managementApiUrl": "https://contoso-api.management.azure-api.net"
    ...
    ``` 

1. [Manually create a SAS token](/rest/api/apimanagement/apimanagementrest/azure-api-management-rest-api-authentication#ManuallyCreateToken) to enable the direct REST API access to your API Management instance.

1. Copy the generated token and paste it as the `managementApiAccessToken` value.

1. In the `backendUrl` value, replace `<service-name>` with the name of your API Management instance. If you configured a [custom domain](configure-custom-domain.md), use it instead (for example, `https://portal.contoso.com`).

    ```json
    {
    ...
    "backendUrl": "https://contoso-api.developer.azure-api.net"
    ...
    ```

1. If you'd like to enable CAPTCHA in your developer portal, see [Enable CAPTCHA](#enable-captcha).

### config.publish.json file

Go to the `src` folder and open the `config.publish.json` file.

```json
{
  "environment": "publishing",
  "managementApiUrl": "https://<service-name>.management.azure-api.net",
  "managementApiAccessToken": "SharedAccessSignature...",
  "useHipCaptcha": false
}
```

Configure the file:

1. Copy and paste the `managementApiUrl` and `managementApiAccessToken` values from the previous configuration file.

1. If you'd like to enable CAPTCHA in your developer portal, see [Enable CAPTCHA](#enable-captcha).

### config.runtime.json file

Go to the `src` folder and open the `config.runtime.json` file.

```json
{
  "environment": "runtime",
  "managementApiUrl": "https://<service-name>.management.azure-api.net",
  "backendUrl": "https://<service-name>.developer.azure-api.net"
}
```

Configure the file:

1. Copy and paste the `managementApiUrl` value from the previous configuration file.

1. In the `backendUrl` value, replace `<service-name>` with the name of your API Management instance. If you configured a [custom domain](configure-custom-domain.md), use it instead (for example. `https://portal.contoso.com`).

    ```json
    {
    ...
    "backendUrl": "https://contoso-api.developer.azure-api.net"
    ...
    ```

### Configure the static website

Configure the **Static website** feature in your storage account by providing routes to the index and error pages:

1. Go to your storage account in the Azure portal and select **Static website** from the menu on the left.

1. On the **Static website** page, select **Enabled**.

1. In the **Index document name** field, enter *index.html*.

1. In the **Error document path** field, enter *404/index.html*.

1. Select **Save**.

### Configure the CORS settings

Configure the Cross-Origin Resource Sharing (CORS) settings:

1. Go to your storage account in the Azure portal and select **CORS** from the menu on the left.

1. In the **Blob service** tab, configure the following rules:

    | Rule | Value |
    | ---- | ----- |
    | Allowed origins | * |
    | Allowed methods | Select all the HTTP verbs. |
    | Allowed headers | * |
    | Exposed headers | * |
    | Max age | 0 |

1. Select **Save**.

## Step 3: Run the portal

Now you can build and run a local portal instance in the development mode. In development mode, all the optimizations are turned off and the source maps are turned on.

Run the following command:

```console
npm start
```

After a short time, the default browser automatically opens with your local developer portal instance. The default address is `http://localhost:8080`, but the port can change if `8080` is already occupied. Any changes to the codebase of the project will trigger a rebuild and refresh your browser window.

## Step 4: Edit through the visual editor

Use the visual editor to carry out these tasks:

- Customize your portal
- Author content
- Organize the structure of the website
- Stylize its appearance

See [Tutorial: Access and customize the developer portal](api-management-howto-developer-portal-customize.md). It covers the basics of the administrative user interface and lists recommended changes to the default content. Save all changes in the local environment, and press **Ctrl+C** to close it.

## Step 5: Publish locally

The portal data originates in the form of strong-typed objects. The following command translates them into static files and places the output in the `./dist/website` directory:

```console
npm run publish
```

## Step 6: Upload static files to a blob

Use Azure CLI to upload the locally generated static files to a blob, and make sure your visitors can get to them:

1. Open Windows Command Prompt, PowerShell, or other command shell.

1. Run the following Azure CLI command.
   
    Replace `<account-connection-string>` with the connection string of your storage account. You can get it from the **Access keys** section of your storage account.

    ```azurecli
    az storage blob upload-batch --source dist/website \
        --destination '$web' \
        --connection-string <account-connection-string>
    ```


## Step 7: Go to your website

Your website is now live under the hostname specified in your Azure Storage properties (**Primary endpoint** in **Static websites**).

## Step 8: Change API Management notification templates

Replace the developer portal URL in the API Management notification templates to point to your self-hosted portal. See [How to configure notifications and email templates in Azure API Management](api-management-howto-configure-notifications.md).

In particular, carry out the following changes to the default templates:

> [!NOTE]
> The values in the following **Updated** sections assume that you're hosting the portal at **https:\//portal.contoso.com/**. 

### Email change confirmation

Update the developer portal URL in the **Email change confirmation** notification template:

**Original content**

```html
<a id="confirmUrl" href="$ConfirmUrl" style="text-decoration:none">
  <strong>$ConfirmUrl</strong></a>
```

**Updated**

```html
<a id="confirmUrl" href="https://portal.contoso.com/signup?$ConfirmQuery" style="text-decoration:none">
  <strong>https://portal.contoso.com/signup?$ConfirmQuery</strong></a>
```

### New developer account confirmation

Update the developer portal URL in the **New developer account confirmation** notification template:

**Original content**

```html
<a id="confirmUrl" href="$ConfirmUrl" style="text-decoration:none">
  <strong>$ConfirmUrl</strong></a>
```

**Updated**

```html
<a id="confirmUrl" href="https://portal.contoso.com/signup?$ConfirmQuery" style="text-decoration:none">
  <strong>https://portal.contoso.com/signup?$ConfirmQuery</strong></a>
```

### Invite user

Update the developer portal URL in the **Invite user** notification template:

**Original content**

```html
<a href="$ConfirmUrl">$ConfirmUrl</a>
```

**Updated**

```html
<a href="https://portal.contoso.com/confirm-v2/identities/basic/invite?$ConfirmQuery">https://portal.contoso.com/confirm-v2/identities/basic/invite?$ConfirmQuery</a>
```

### New subscription activated

Update the developer portal URL in the **New subscription activated** notification template:

**Original content**

```html
Thank you for subscribing to the <a href="http://$DevPortalUrl/products/$ProdId"><strong>$ProdName</strong></a> and welcome to the $OrganizationName developer community. We are delighted to have you as part of the team and are looking forward to the amazing applications you will build using our API!
```

**Updated**

```html
Thank you for subscribing to the <a href="https://portal.contoso.com/product#product=$ProdId"><strong>$ProdName</strong></a> and welcome to the $OrganizationName developer community. We are delighted to have you as part of the team and are looking forward to the amazing applications you will build using our API!
```

**Original content**

```html
Visit the developer <a href="http://$DevPortalUrl/developer">profile area</a> to manage your subscription and subscription keys
```

**Updated**

```html
Visit the developer <a href="https://portal.contoso.com/profile">profile area</a> to manage your subscription and subscription keys
```

**Original content**

```html
<a href="http://$DevPortalUrl/docs/services?product=$ProdId">Learn about the API</a>
```

**Updated**

```html
<a href="https://portal.contoso.com/product#product=$ProdId">Learn about the API</a>
```

**Original content**

```html
<p style="font-size:12pt;font-family:'Segoe UI'">
  <strong>
    <a href="http://$DevPortalUrl/applications">Feature your app in the app gallery</a>
  </strong>
</p>
<p style="font-size:12pt;font-family:'Segoe UI'">You can publish your application on our gallery for increased visibility to potential new users.</p>
<p style="font-size:12pt;font-family:'Segoe UI'">
  <strong>
    <a href="http://$DevPortalUrl/issues">Stay in touch</a>
  </strong>
</p>
<p style="font-size:12pt;font-family:'Segoe UI'">
      If you have an issue, a question, a suggestion, a request, or if you just want to tell us something, go to the <a href="http://$DevPortalUrl/issues">Issues</a> page on the developer portal and create a new topic.
</p>
```

**Updated**

```html
<!--Remove the entire block of HTML code above.-->
```

### Password change confirmation

Update the developer portal URL in the **Password change confirmation** notification template:

**Original content**

```html
<a href="$DevPortalUrl">$DevPortalUrl</a>
```

**Updated**

```html
<a href="https://portal.contoso.com/confirm-password?$ConfirmQuery">https://portal.contoso.com/confirm-password?$ConfirmQuery</a>
```

### All templates

Update the developer portal URL in any template that has a link in the footer:

**Original content**

```html
<a href="$DevPortalUrl">$DevPortalUrl</a>
```

**Updated**

```html
<a href="https://portal.contoso.com/">https://portal.contoso.com/</a>
```

## Move from managed to self-hosted developer portal

Over time, your business requirements may change. You can end up in a situation where the managed version of the API Management developer portal no longer satisfies your needs. For example, a new requirement may force you to build a custom widget that integrates with a third-party data provider. Unlike the manged version, the self-hosted version of the portal offers you full flexibility and extensibility.

### Transition process

You can transition from the managed version to a self-hosted version within the same API Management service instance. The process preserves the modifications that you've carried out in the managed version of the portal. Make sure you back up the portal's content beforehand. You can find the backup script in the `scripts` folder of the API Management developer portal [GitHub repo](https://github.com/Azure/api-management-developer-portal).

The conversion process is almost identical to setting up a generic self-hosted portal, as shown in previous steps in this article. There is one exception in the configuration step. The storage account in the `config.design.json` file needs to be the same as the storage account of the managed version of the portal. See [Tutorial: Use a Linux VM system-assigned identity to access Azure Storage via a SAS credential](../active-directory/managed-identities-azure-resources/tutorial-linux-vm-access-storage-sas.md#get-a-sas-credential-from-azure-resource-manager-to-make-storage-calls) for instructions on how to retrieve the SAS URL.

> [!TIP]
> We recommend using a separate storage account in the `config.publish.json` file. This approach gives you more control and simplifies the management of the hosting service of your portal.

## Enable CAPTCHA

When setting up the self-hosted portal, you may have disabled CAPTCHA through the `useHipCaptcha` setting. Communication with CAPTCHA happens through an endpoint, which lets Cross-Origin Resource Sharing (CORS) happen for only the managed developer portal hostname. If your developer portal is self-hosted, it uses a different hostname and CAPTCHA won't allow the communication.

### Update the JSON config files

To enable the CAPTCHA in your self-hosted portal:

1. Assign a custom domain (for example, `api.contoso.com`) to the **Developer portal** endpoint of your API Management service.

    This domain applies to the managed version of your portal and the CAPTCHA endpoint. For steps, see [Configure a custom domain name for your Azure API Management instance](configure-custom-domain.md).

1. Go to the `src` folder in the [local environment](#step-1-set-up-local-environment) for your self-hosted portal.

1. Update the configuration `json` files:

    | File | New value | Note |
    | ---- | --------- | ---- |
    | `config.design.json`| `"backendUrl": "https://<custom-domain>"` | Replace `<custom-domain>` with the custom domain you set up in the first step. |
    |  | `"useHipCaptcha": true` | Change the value to `true` |
    | `config.publish.json`| `"backendUrl": "https://<custom-domain>"` | Replace `<custom-domain>` with the custom domain you set up in the first step. |
    |  | `"useHipCaptcha": true` | Change the value to `true` |
    | `config.runtime.json` | `"backendUrl": "https://<custom-domain>"` | Replace `<custom-domain>` with the custom domain you set up in the first step. |

1. [Publish](#step-5-publish-locally) the portal.

1. [Upload](#step-6-upload-static-files-to-a-blob) and host the newly published portal.

1. Expose the self-hosted portal through a custom domain.

The portal domain's first and second levels need to match the domain set up in the first step. For example, `portal.contoso.com`. The exact steps depend on your hosting platform of choice. If you used an Azure storage account, you can refer to [Map a custom domain to an Azure Blob Storage endpoint](../storage/blobs/storage-custom-domain-name.md) for instructions.

## Next steps

- Learn about [Alternative approaches to self-hosting](developer-portal-alternative-processes-self-host.md)
