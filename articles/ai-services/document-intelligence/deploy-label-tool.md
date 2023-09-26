---
title: Deploy the Document Intelligence (formerly Form Recognizer) Sample Labeling tool
titleSuffix: Azure AI services
description: Learn the different ways you can deploy the Document Intelligence Sample Labeling tool to help with supervised learning.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: how-to
ms.date: 07/18/2023
ms.author: lajanuar
monikerRange: 'doc-intel-2.1.0'
---


# Deploy the Sample Labeling tool

**This article applies to:** ![Document Intelligence v2.1 checkmark](media/yes-icon.png) **Document Intelligence v2.1**.

>[!TIP]
>
> * For an enhanced experience and advanced model quality, try the [Document Intelligence v3.0 Studio](https://formrecognizer.appliedai.azure.com/studio).
> * The v3.0 Studio supports any model trained with v2.1 labeled data.
> * You can refer to the [API migration guide](v3-1-migration-guide.md) for detailed information about migrating from v2.1 to v3.0.
> * *See* our [**REST API**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true) or [**C#**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true), [**Java**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true), [**JavaScript**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true), or [Python](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true) SDK quickstarts to get started with the v3.0 version.

> [!NOTE]
> The [cloud hosted](https://fott-2-1.azurewebsites.net/) labeling tool is available at [https://fott-2-1.azurewebsites.net/](https://fott-2-1.azurewebsites.net/). Follow the steps in this document only if you want to deploy the Sample Labeling tool for yourself. 

The Document Intelligence Sample Labeling tool is an application that provides a simple user interface (UI), which you can use to manually label forms (documents) for supervised learning. In this article, we provide links and instructions that teach you how to:

* [Run the Sample Labeling tool locally](#run-the-sample-labeling-tool-locally)
* [Deploy the Sample Labeling tool to an Azure Container Instance (ACI)](#deploy-with-azure-container-instances-aci)
* [Use and contribute to the open-source OCR Form Labeling Tool](#open-source-on-github)

## Run the Sample Labeling tool locally

The fastest way to start labeling data is to run the Sample Labeling tool locally. The following quickstart uses the Document Intelligence REST API and the Sample Labeling tool to train a custom model with manually labeled data.

* [Get started with Azure AI Document Intelligence](label-tool.md).

## Deploy with Azure Container Instances (ACI)

Before we get started, it's important to note that there are two ways to deploy the Sample Labeling tool to an Azure Container Instance (ACI). Both options are used to run the Sample Labeling tool with ACI:

* [Using the Azure portal](#azure-portal)
* [Using the Azure CLI](#azure-cli)

### Azure portal

Follow these steps to create a new resource using the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com/signin/index/).
2. Select **Create a resource**.
3. Next, select **Web App**.

   > [!div class="mx-imgBorder"]
   > ![Select web app](./media/quickstarts/create-web-app.png)

4. First, make sure that the **Basics** tab is selected. Now, you're going to need to provide some information:

   > [!div class="mx-imgBorder"]
   > ![Select Basics](./media/quickstarts/select-basics.png)
   * Subscription - Select an existing Azure subscription
   * Resource Group - You can reuse an existing resource group or create a new one for this project. Creating a new resource group is recommended.
   * Name - Give your web app a name.
   * Publish - Select **Docker Container**
   * Operating System -  Select **Linux**
   * Region - Choose a region that makes sense for you.
   * Linux Plan - Select a pricing tier/plan for your app service.

   > [!div class="mx-imgBorder"]
   > ![Configure your web app](./media/quickstarts/select-docker.png)

5. Next, select the **Docker** tab.

   > [!div class="mx-imgBorder"]
   > ![Select Docker](./media/quickstarts/select-docker.png)

6. Now let's configure your Docker container. All fields are required unless otherwise noted:
<!-- markdownlint-disable MD025 -->

* Options - Select **Single Container**
* Image Source - Select **Private Registry**
* Server URL - Set to `https://mcr.microsoft.com`
* Username (Optional) - Create a username.
* Password (Optional) - Create a secure password that you can remember.
* Image and tag - Set to `mcr.microsoft.com/azure-cognitive-services/custom-form/labeltool:latest-2.1`
* Continuous Deployment - Set to **On** if you want to receive automatic updates when the development team makes changes to the Sample Labeling tool.
* Startup command - Set to `./run.sh eula=accept`

> [!div class="mx-imgBorder"]
> ![Configure Docker](./media/quickstarts/configure-docker.png)

* Next, select **Review + Create**, then **Create** to deploy your web app. When complete, you can access your web app at the URL provided in the **Overview** for your resource.

### Continuous deployment

After you've created your web app, you can enable the continuous deployment option:

* From the left pane, choose **Container settings**.
* In the main window, navigate to Continuous deployment and toggle between the **On** and **Off** buttons to set your preference:

:::image type="content" source="media/label-tool/continuous-deployment.png" alt-text="Screenshot of enlargement of container settings for continuous deployment." lightbox="media/label-tool/continuous-deployment-bigger.png":::

> [!NOTE]
> When creating your web app, you can also configure authorization/authentication. This is not necessary to get started.

> [!IMPORTANT]
> You may need to enable TLS for your web app in order to view it at its `https` address. Follow the instructions in [Enable a TLS endpoint](../../container-instances/container-instances-container-group-ssl.md) to set up a sidecar container than enables TLS/SSL for your web app.
<!-- markdownlint-disable MD001 -->
### Azure CLI

As an alternative to using the Azure portal, you can create a resource using the Azure CLI. Before you continue, you need to install the [Azure CLI](/cli/azure/install-azure-cli). You can skip this step if you're already working with the Azure CLI.

There's a few things you need know about this command:

* `DNS_NAME_LABEL=aci-demo-$RANDOM` generates a random DNS name.
* This sample assumes that you have a resource group that you can use to create a resource. Replace `<resource_group_name>` with a valid resource group associated with your subscription.
* You need to specify where you want to create the resource. Replace `<region name>` with your desired region for the web app.
* This command automatically accepts EULA.

From the Azure CLI, run this command to create a web app resource for the Sample Labeling tool:

<!-- markdownlint-disable MD024 -->

```azurecli
DNS_NAME_LABEL=aci-demo-$RANDOM

az container create \
  --resource-group <resource_group_name> \
  --name <name> \
  --image mcr.microsoft.com/azure-cognitive-services/custom-form/labeltool:latest-2.1 \
  --ports 3000 \
  --dns-name-label $DNS_NAME_LABEL \
  --location <region name> \
  --cpu 2 \
  --memory 8 \
  --command-line "./run.sh eula=accept"

```

### Connect to Azure AD for authorization

It's recommended that you connect your web app to Azure Active Directory (Azure AD). This connection ensures that only users with valid credentials can sign in and use your web app. Follow the instructions in [Configure your App Service app](../../app-service/configure-authentication-provider-aad.md) to connect to Azure Active Directory.

## Open source on GitHub

The OCR Form Labeling Tool is also available as an open-source project on GitHub. The tool is a web application built using React + Redux, and is written in TypeScript. To learn more or contribute, see [OCR Form Labeling Tool](https://github.com/microsoft/OCR-Form-Tools/blob/master/README.md).

## Next steps

Use the [Train with labels](label-tool.md) quickstart to learn how to use the tool to manually label training data and perform supervised learning.
