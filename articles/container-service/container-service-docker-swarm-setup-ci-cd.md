---
title: CI/CD with Azure Container Service and Swarm | Microsoft Docs
description: Use Azure Container Service with Docker Swarm, an Azure Container Registry, and Visual Studio Team Services to deliver continuously a multi-container .NET Core application
services: container-service
documentationcenter: ' '
author: jcorioland
manager: pierlag
tags: acs, azure-container-service
keywords: Docker, Containers, Micro-services, Swarm, Azure, Visual Studio Team Services, DevOps


ms.service: container-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/01/2016
ms.author: jucoriol

---
# Full CI/CD pipeline to deploy a multi-container application on Azure Container Service with Docker Swarm using Visual Studio Team Services
One of the biggest challenge when developping modern applications in the cloud is to be able to deliver these applications continuously. In this documentation you will learn how to implement a full CI/CD pipeline using Azure Container Service with Docker Swarm, an Azure Container Registry and Visual Studio Team Services Build & Release Management.

This article is based on a simple application, developped with ASP.NET Core and that is composed of 4 different services, three web APIs and one web front:

![MyShop sample application](./media/container-service-docker-swarm-setup-ci-cd/myshop-application.png)

You can get the code of the application on [GitHub](https://github.com/jcorioland/MyShop/tree/acs-docs)

The objectives of this article are to explain how it is possible to deliver this application continuously in a Docker Swarm cluster, using Visual Studio Team Services. The figure below details this continuous delivery pipeline:

![MyShop sample application](./media/container-service-docker-swarm-setup-ci-cd/full-ci-cd-pipeline.png)

Prerequisites to the exercises in this document:

[Create a Swarm cluster in Azure Container Service](container-service-deployment.md)

[Connect with the Swarm cluster in Azure Container Service](container-service-connect.md)

## Headings 

Two ## signs create an H2 heading - if your article needs to be structured with headings below the H1, you need to have at least TWO H2 headings.

H2 headings are rendered on the page as an automatic on-page TOC. Do not hand-code article navigation in an article. Use the H2 headings to do that.

Within an H2 section, you can use three ### signs to create H3 headings. In our content, try to avoid going deeper than 3 heading layers - the headings are often hard to distinguish on the rendered page. 

## Images
You can use images throughout a technical article. Make sure you include alt text for all your images. This helps accessibility and discoverability.

This image of the GitHub Octocats uses in-line image references:

 ![GitHub Octocats using inline link](./media/markdown-template-for-new-articles/octocats.png)

The sample markdown looks like this:
```
![GitHub Octocats using inline link](./media/markdown-template-for-new-articles/octocats.png)
```

This second image of the octocats uses reference style syntax, where you define the target as "5" and at the bottom of the article, and you list the path to image 5 in a reference section.

 ![GitHub Octocats using ref style link][5]

 The sample markdown looks like this:
 ```
  ![GitHub Octocats image][5]

  <!--Image references-->
  [5]: ./media/markdown-template-for-new-articles/octocats.png
 ``` 

## Linking
Your article will most likely contain links. Here's sample markdown for a link to a target that is not on the docs.microsoft.com site:

    [link text](url)
    [Scott Guthrie's blog](http://weblogs.asp.net/scottgu)

Here's sample markdown for a link to another technical article in the azure-docs-pr repository:

    [link text](../service-directory/article-name.md)
    [ExpressRoute circuits and routing domains](../expressroute/expressroute-circuit-peerings.md)

You can also use so-called reference style links where you define the links at the bottom of the article, and reference them like this:

    I get 10 times more traffic from [Google][gog] than from [Yahoo][yah] or [MSN][msn].

For more information about linking, see the [linking guidance](../contributor-guide/create-links-markdown.md)

## Notes and tips
You should use notes and tips judiciously. A little bit goes a long way. Put the text of the note or tip on the line after the custom markdown extension.

```
> [!NOTE]
> Note text.

> [!TIP]
> Tip text.

> [!IMPORTANT]
> Important text.
```

## Lists

A simple numbered list in markdown creates a numbered list on your published page.

1. First step.
2. Second step.
3. Third step.

Use hyphens to create unordered lists:

- Item
- Item
- Item


## Next steps
Every topic should end with 1 to 3 concrete, action oriented next steps and links to the next logical piece of content to keep the customer engaged. 

- See the [content quality guidelines](../contributor-guide/contributor-guide-pr-criteria.md#non-blocking-content-quality-items) for an example of what a good next steps section looks like. 

- Review the [custom markdown extensions](../contributor-guide/custom-markdown-extensions.md) we use for videos, reusable content, selectors, and other content features.

- Make sure your articles meet [the content quality guidelines](../contributor-guide/contributor-guide-pr-criteria.md) before you sign-off on a PR. 


<!--Image references-->
[5]: ./media/markdown-template-for-new-articles/octocats.png

<!--Reference style links - using these makes the source content way more readable than using inline links-->
[gog]: http://google.com/        
[yah]: http://search.yahoo.com/  
[msn]: http://search.msn.com/    
