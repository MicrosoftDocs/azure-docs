---
title: Azure Container Registry tutorial - Push an updated image to regional deployments
description: Push a modified Docker image to your geo-replicated Azure contain registry, then see the changes automatically deployed to web apps running in multiple regions. Part three of a three-part series.
services: container-registry
documentationcenter: ''
author: mmacy
manager: timlt
editor: mmacy
tags: acr, azure-container-registry, geo-replication
keywords: Docker, Containers, Registry, Azure

ms.service: container-registry
ms.devlang:
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/24/2017
ms.author: marsma
ms.custom:
---

# Push an updated image to regional deployments

This is part three in a three-part tutorial series. In the [previous tutorial](container-registry-tutorial-deploy-app.md), geo-replication was configured for two different regional Web App deployments. In this tutorial, you first modify the application, then build a new container image and push it to your geo-replicated registry. Finally, you view the change, deployed automatically by Azure Container Registry webhooks, in both Web App instances.

In this tutorial, the final part in the series:

> [!div class="checklist"]
> * Modify the web application HTML
> * Build and tag the Docker image
> * Push the change to Azure Container Registry
> * View the updated app in two different regions

If you've not yet configured the two *Web App for Containers* regional deployments, return to the previous tutorial in the series, [Deploy web app from Azure Container Registry](container-registry-tutorial-deploy-app.md).

## Modify the web application

In this step, make a change to the web application that will be highly visible once you push the updated container image to Azure Container Registry.

Find the `AcrHelloworld/Views/Home/Index.cshtml` file in the application source you [cloned from GitHub](container-registry-tutorial-prepare-registry.md#get-application-code) in a previous tutorial and open it in your favorite text editor. Add the following line below the existing `<h1>` line:

```html
<h1>MODIFIED</h1>
```

Your modified `Index.cshtml` should look similar to:

```html
@{
    ViewData["Title"] = "Azure Container Registry :: Geo-replication";
}
<style>
    body {
        background-image: url('images/azure-regions.png');
        background-size: cover;
    }
    .footer {
        position: fixed;
        bottom: 0px;
        width: 100%;
    }
</style>

<h1 style="text-align:center;color:blue">Hello World from:  @ViewData["REGION"]</h1>
<h1>MODIFIED</h1>
<div class="footer">
    <ul>
        <li>Registry URL: @ViewData["REGISTRYURL"]</li>
        <li>Registry IP: @ViewData["REGISTRYIP"]</li>
        <li>Registry Region: @ViewData["REGION"]</li>
    </ul>
</div>
```

## Rebuild the image

Now that you've updated the web application, rebuild its container image. As before, use the fully qualified image name, including the login server URL, for the tag:

```bash
docker build . -f ./AcrHelloworld/Dockerfile -t <acrName>.azurecr.io/acr-helloworld:v1
```

## Push image to Azure Container Registry

Now, push the updated *acr-helloworld* container image to your geo-replicated registry. Here, you're executing a single `docker push` command to deploy the updated image to the registry replicas in both the *West US* and *East US* regions.

```bash
docker push <acrName>.azurecr.io/acr-helloworld:v1
```

Output should appear similar to the following:

```bash
The push refers to a repository [uniqueregistryname.azurecr.io/acr-helloworld]
5b9454e91555: Pushed
d6803756744a: Layer already exists
b7b1f3a15779: Layer already exists
a89567dff12d: Layer already exists
59c7b561ff56: Layer already exists
9a2f9413d9e4: Layer already exists
a75caa09eb1f: Layer already exists
v1: digest: sha256:4c3f2211569346fbe2d1006c18cbea2a4a9dcc1eb3a078608cef70d3a186ec7a size: 1792
```

## View the webhook logs

While the image is being replicated, you can see the Azure Container Registry webhooks being triggered.

To see the regional webhooks that were created when you deployed the container to *Web Apps for Containers* in a previous tutorial, navigate to your container registry in the Azure portal, then select **Webhooks** under **SERVICES**.

![Container registry Webhooks in the Azure portal][tutorial-portal-01]

Select each Webhook to see the history of its calls and responses. You should see a row for the **push** action in the logs of both Webhooks. Here, the log for the Webhook located in the *West US* region shows the **push** action triggered by the `docker push` in the previous step:

![Container registry Webhook log in the Azure portal (West US)][tutorial-portal-02]

## View the updated web app

The Webhooks notify Web Apps that a new image has been pushed to the registry, which automatically deploys the updated container to the two regional web apps.

Verify that the application has been updated in both deployments by navigating to both regional Web App deployments in your web browser. As a reminder, you can find the URL for the deployed web app in the top-right of each App Service overview tab.

![App Service overview in the Azure portal][tutorial-portal-03]

To see the updated application, select the link in the App Service overview. Here's an example view of the app running in *West US*:

![Browser view of modified web app running in West US region][deployed-app-westus-modified]

Verify that the updated container image was also deployed to the *East US* deployment by viewing it in your browser.

![Browser view of modified web app running in East US region][deployed-app-eastus-modified]

With a single `docker push`, you've updated both regional Web App deployments, and Azure Container Registry served the container images from network-close repositories.

## Next steps

In this tutorial, you updated and pushed a new version of the web application container to your geo-replicated registry. Webhooks in Azure Container Registry notified Web Apps for Containers of the update, which triggered a local pull from the registry replicas.

In this, the final tutorial in the series, you:

> [!div class="checklist"]
> * Updated the web application HTML
> * Built and tagged the Docker image
> * Pushed the change to Azure Container Registry
> * Viewed the updated app in two different regions

<!-- IMAGES -->
[deployed-app-eastus-modified]: ./media/container-registry-tutorial-deploy-update/deployed-app-eastus-modified.png
[deployed-app-westus-modified]: ./media/container-registry-tutorial-deploy-update/deployed-app-westus-modified.png
[local-container-01]: ./media/container-registry-tutorial-deploy-update/local-container-01.png
[tutorial-portal-01]: ./media/container-registry-tutorial-deploy-update/tutorial-portal-01.png
[tutorial-portal-02]: ./media/container-registry-tutorial-deploy-update/tutorial-portal-02.png
[tutorial-portal-03]: ./media/container-registry-tutorial-deploy-update/tutorial-portal-03.png