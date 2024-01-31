---
author: karlerickson
ms.author: v-shilichen
ms.service: spring-apps
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 08/09/2023
---

<!-- 
Use the following line at the end of the heading Prerequisites, with blank lines before and after. Each quickstart should provide two tools for developers.

[!INCLUDE [quickstart-tool-introduction](includes/quickstart/quickstart-tool-introduction.md)]
-->

This article provides the following options for deploying to Azure Spring Apps:

::: zone pivot="sc-consumption-plan,sc-standard"

- The **Azure portal** option is the easiest and the fastest way to create resources and deploy applications with a single click. This option is suitable for Spring developers who want to quickly deploy applications to Azure cloud services.
- The **Azure portal + Maven plugin** option is a more conventional way to create resources and deploy applications step by step. This option is suitable for Spring developers using Azure cloud services for the first time.
- The **Azure Developer CLI** option is a more efficient way to automatically create resources and deploy applications through simple commands. The Azure Developer CLI uses a template to provision the Azure resources needed and to deploy the application code. This option is suitable for Spring developers who are familiar with Azure cloud services.

::: zone-end

::: zone pivot="sc-enterprise"

- The **Azure portal** option is the easiest and the fastest way to create resources and deploy applications with a single click. This option is suitable for Spring developers who want to quickly deploy applications to Azure cloud services.
- The **Azure portal + Maven plugin** option is a more conventional way to create resources and deploy applications step by step. This option is suitable for Spring developers using Azure cloud services for the first time.
- The **Azure CLI** option uses a powerful command line tool to manage Azure resources. This option is suitable for Spring developers who are familiar with Azure cloud services.
- The **IntelliJ** option uses a powerful Java IDE to easily manage Azure resources. This option is suitable for Spring developers who are familiar with Azure cloud services and IntelliJ IDEA.
- The **Visual Studio Code** option uses a lightweight but powerful source code editor, which can easily manage Azure resources. This option is suitable for Spring developers who are familiar with Azure cloud services and Visual Studio Code.

::: zone-end