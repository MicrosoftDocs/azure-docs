---
title: Access and customize the new developer portal - Azure API Management | Microsoft Docs
description: Learn how to use the new developer portal in API Management.
services: api-management
documentationcenter: API Management
author: mikebudzynski
manager: cfowler
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/12/2019
ms.author: apimpm
---

# Access and customize the new developer portal in Azure API Management

This article shows you how to access the new Azure API Management developer portal. It walks you through the visual editor experience - adding and editing content - as well as customizing the look of the website.

![New API Management developer portal](media/api-management-howto-developer-portal/cover.png)

## <a name="prerequisites"></a> Prerequisites

- Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).
- Import and publish an Azure API Management instance. For more information, see [Import and publish](import-and-publish.md).

[!INCLUDE [premium-dev-standard-basic.md](../../includes/api-management-availability-premium-dev-standard-basic.md)]

> [!NOTE]
> The new developer portal is currently in preview.

## <a name="managed-vs-self-hosted"></a> Managed and self-hosted versions

You can build your developer portal in two ways:

- **Managed version** - by editing and customizing the portal, which is built into your API Management instance and is accessible through the URL `<your-api-management-instance-name>.developer.azure-api.net`.
- **Self-hosted version** - by deploying and self-hosting your portal outside of an API Management instance. This approach allows you to edit the portal's codebase and extend the provided core functionality. For details and instructions, refer to the [GitHub repository with the source code of the portal][1].

## <a name="managed-access"></a> Access the managed version of the portal

Follow the steps below to access the managed version of the portal.

1. Go to your API Management service instance in the Azure portal.
1. Click on the **New developer portal (preview)** button in the top navigation bar. A new browser tab with an administrative version of the portal will open. If you're accessing the portal for the first time, the default content will be automatically provisioned.

## <a name="managed-tutorial"></a> Edit and customize the managed version of the portal

In the video below we demonstrate how to edit the content of the portal, customize the website's look, and publish the changes.

> [!VIDEO https://www.youtube.com/embed/5mMtUSmfUlw]

## <a name="faq"></a> Frequently asked questions

In this section we answer common questions about the new developer portal, which are of general nature. For questions specific to the self-hosted version, refer to [the wiki section of the GitHub repository](https://github.com/Azure/api-management-developer-portal/wiki).

### How can I migrate content from the old developer portal to the new one?

You can't. The portals are incompatible.

### When will the portal become generally available?

The portal is currently in preview and it will become generally available by the end of the calendar year (2019). The preview version shouldn't be used for production purposes.

### Will the old portal be deprecated?

Yes, it will be deprecated after the new one becomes generally available. If you have concerns, raise them [in a dedicated GitHub issue](https://github.com/Azure/api-management-developer-portal/issues/121).

### Does the new portal have all the features of the old portal?

The goal of general availability is to provide a scenario-based feature parity with the old portal. Until then, the preview version might not have selected features implemented.

The exceptions are the *Applications* and *Issues* from the old portal, which won't be available in the new portal. If you use *Issues* in the old portal and need them in the new one, post a comment in [a dedicated GitHub issue](https://github.com/Azure/api-management-developer-portal/issues/122).

### I've found bugs and/or I'd like to request a feature.

Great! You can provide us feedback, submit a feature request, or file a bug report through [the GitHub repository's Issues section](https://github.com/Azure/api-management-developer-portal/issues). While you're there, we'd also appreciate your feedback on the issues marked with the `community` label.

### I want to move the content of the new portal between environments. How can I do that and do I need to go with the self-hosted version?

You can do so in both portal versions - managed and self-hosted. The new developer portal supports extracting content through the management API of your API Management service. The APIs are documented [in the wiki section of the GitHub repository](https://github.com/Azure/api-management-developer-portal/wiki/). We have also written [a script](https://github.com/Azure/api-management-developer-portal/blob/master/scripts/migrate.bat), which might help you get started.

We're still working on aligning this process with the API Management DevOps resource kit.

### How can I select a *layout* when creating a new *page*?

A *layout* gets applied to a page by matching its URL template to the *page's* URL. For example, *layout* with a URL template of `/wiki/*` will be applied to every *page* with the `/wiki/` segment: `/wiki/getting-started`, `/wiki/styles`, and so on.

### Why doesn't the interactive developer console work?

It is likely related to CORS. The interactive console makes a client-side API request from the browser. You can resolve the CORS problem by adding [a CORS policy](https://docs.microsoft.com/azure/api-management/api-management-cross-domain-policies#CORS) on your API(s). You can either specify all the parameters manually (for example, origin as https://contoso.com) or use a wildcard `*` value.

## Next steps

Learn more about the new developer portal:

- [GitHub repository with the source code][1]
- [Instructions on self-hosting the portal][2]
- [Public roadmap of the project][3]

[1]: https://aka.ms/apimdevportal
[2]: https://github.com/Azure/api-management-developer-portal/wiki
[3]: https://github.com/Azure/api-management-developer-portal/projects