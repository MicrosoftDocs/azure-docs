---
title: What is Azure AI Studio?
titleSuffix: Azure AI Studio
description: Azure AI Studio is a trusted platform that empowers developers to drive innovation and shape the future with AI in a safe, secure, and responsible way.
manager: nitinme
keywords: Azure AI services, cognitive
ms.service: azure-ai-studio
ms.topic: overview
ms.date: 5/21/2024
ms.reviewer: eur
ms.author: eur
author: eric-urban
ms.custom: ignite-2023, build-2024
---

# What is Azure AI Studio?

[Azure AI Studio](https://ai.azure.com) is a trusted platform that empowers developers to drive innovation and shape the future with AI in a safe, secure, and responsible way. The comprehensive platform accelerates the development of production-ready copilots to support enterprise chat, content generation, data analysis, and more. Developers can explore cutting-edge APIs and models for their use cases; build and test solutions with collaborative and responsible AI tools, safeguards, and best practices; deploy AI innovations for use in websites, applications, and other production environments; and manage solutions with continuous monitoring and governance in production.

:::image type="content" source="./media/explore/ai-studio-home.png" alt-text="Screenshot of the Azure AI Studio home page." lightbox="./media/explore/ai-studio-home.png":::

[AI Studio](https://ai.azure.com) is designed for developers to:

- Build generative AI applications on an enterprise-grade platform. 
- Directly from the studio you can interact with a project code-first via [Visual Studio Code (Web)](how-to/develop/vscode.md).
- AI Studio is a trusted and inclusive platform that empowers developers of all abilities and preferences to innovate with AI and shape the future. 
- Seamlessly explore, build, test, and deploy using cutting-edge AI tools and ML models, grounded in responsible AI practices. 
- Build together as one team. Your [AI Studio hub](./concepts/ai-resources.md) provides enterprise-grade security, and a collaborative environment with shared files and connections to pretrained models, data and compute.
- Organize your way. Your [AI Studio project](./how-to/create-projects.md) helps you save state, allowing you iterate from first idea, to first prototype, and then first production deployment. Also easily invite others to collaborate along this journey.

With AI Studio, you can evaluate model responses and orchestrate prompt application components with prompt flow for better performance. The platform facilitates scalability for transforming proof of concepts into full-fledged production with ease. Continuous monitoring and refinement support long-term success.  

### API and model choice 

Identify the best AI services and models for your use case. 
- Azure AI services 
- Azure OpenAI Service 
- Model catalog: Managed compute and serverless APIs
- Model benchmarks: Compare models by performance and key parameters

**Build intelligent apps with industry-leading APIs.** Develop multimodal, multi-lingual AI with out-of-the-box and customizable APIs and models. 

**Discover models for your use case.** Choose from the latest cutting-edge foundation and open models. Benchmark models by performance and key parameters and deploy what’s right for your use case. 

**Deploy serverless models.** Get started quickly with ready-to-use APIs, without the need to provision GPUs. 

### Complete AI toolchain 

Access collaborative, comprehensive tooling to support the development lifecycle and differentiate your apps.
- Azure AI Search
- Fine-tuning
- Prompt flow
- Open frameworks
- Tracing and debugging
- Evaluations

**Ground models on your secure data.** Use your protected data to customize models with advanced fine-tuning and for contextually relevant retrieval augmented generation. 

**Orchestrate and debug AI workflows.** Streamline app development with easy-to-use prompt orchestration, tracing, and debugging via interactive visual and code-first workflows. 

**Streamline model and app evaluations.** Systematically measure and improve app performance with manual and automated evaluations. 

### Responsible AI tools and practices 

Design and safeguard applications.
- Responsible AI principles
- Azure AI Content Safety 

**Design apps responsibly.** Confidently build apps with technologies, templates, and best practices to help manage risk, improve accuracy, protect privacy, reinforce transparency, and simplify compliance. 

**Safeguard apps with configurable filters and controls.** Detect and filter content, protect personal identifiable information (PII), and safeguard applications against prompt attacks. 

### Enterprise-grade production at scale 

Deploy AI innovations to Azure’s managed infrastructure with continuous monitoring and governance across environments. 
- Collaborative hubs
- LLMOps
- Monitoring & observability
- IT governance
- Security & privacy
- RBAC
- Microsoft Copilot Copyright Commitment

**Deploy to production.** Scale AI for use in websites, applications, and other production environments. 

**Operationalize and monitor workflows.** Continuously monitor AI safety, quality, and token consumption in production. Automate workflows and alerts for timely issue resolution. 

**Enable developer agility and enterprise governance at scale.** Provide easy project creation and resource management across the organization and enterprise controls for security, privacy, and compliance. 

## Home page

Go to the **Home** page to create or access hubs and projects, explore the model catalog, access the AI services try-out experiences, dive into documentation, and more.

:::image type="content" source="./media/explore/ai-studio-home.png" alt-text="Screenshot of the Azure AI Studio home page with links to get started." lightbox="./media/explore/ai-studio-home.png":::

### Model catalog

The model catalog is a collection of models that you can use in your projects. You can filter the models by collection, inference task (such as summarization and chat completion), license, and more.

:::image type="content" source="media/explore/home-model-catalog.png" alt-text="Screenshot of the model catalog on the AI Studio home page." lightbox= "media/explore/home-model-catalog.png":::

### Model benchmarks

Assess model performance with evaluated metrics for accuracy, coherence, fluency, and similarity. Compare benchmarks across models and datasets available in the industry to assess which one meets your business scenario.

The model benchmarks tool helps you compare the performance of different models on a specific task. You can select a task, such as question answering or text generation, and see how different models perform on that task. You can also filter by specific models or model collections to see how they compare to each other.

:::image type="content" source="media/explore/home-model-benchmarks.png" alt-text="Screenshot of the model benchmarks page in AI Studio." lightbox= "media/explore/home-model-benchmarks.png":::

### Prompt catalog

Prompt engineering is an important aspect of working with generative AI models as it allows users to have greater control, customization, and influence over the outputs. By skillfully designing prompts, users can harness the capabilities of generative AI models to generate desired content, address specific requirements, and cater to various application domains.   

The prompt catalog is a collection of prompts for common use cases such as generating text or images. You can filter the prompts by modality (such as chat, completions, image, and video), by industry (such as retail and education), and by task (such as summarization and chat completion).

:::image type="content" source="media/explore/home-prompt-catalog.png" alt-text="Screenshot of the prompt catalog on the AI Studio home page." lightbox= "media/explore/home-prompt-catalog.png":::

Choose a sample prompt to see how it works or as a starting point for your project. Then customize it for your scenario and evaluate how it performs before integrating into your app.

### AI Services

From the **AI Services** page, you can jump to try-out experiences for different [Azure AI services](../ai-services/what-are-ai-services.md?context=/azure/ai-studio/context/context) and models. For example, you can try out Speech, Language, Vision, Document Intelligence, Content Safety, and more. For more information about Azure AI services, see [What are Azure AI services?](../ai-services/what-are-ai-services.md?context=/azure/ai-studio/context/context) and [Try out AI services](ai-services/connect-ai-services.md).

:::image type="content" source="media/explore/home-ai-services.png" alt-text="Screenshot of the AI Services home page." lightbox= "media/explore/home-ai-services.png":::

> [!NOTE]
> Although Azure OpenAI Service isn't listed on the **AI Services** page, it's also an Azure AI service. You can access Azure OpenAI models from the model catalog, playground, deployments, and other locations in AI Studio.

### Management

From the left navigation pane on the **Home** page, you can access following pages under **Management:**

**All hubs:** This is one of the places in AI Studio where you can create new hubs. You can view a list of all the hubs that you have access to in Azure AI Studio. You can also filter the hubs by name, region, or resource group. For more information about hubs, see [AI Studio hubs for your projects](concepts/ai-resources.md).

**Resources and keys:** Provides information about the Azure AI services (including Azure OpenAI) resources and keys that you have access to in Azure AI Studio. You can see the name of each Azure resource, the subscription it belongs to, the region it's in, the pricing tier, the endpoint URL, and the key that you need to access the resource. 

**Quota:** The quota section provides information about your quota usage and limits for virtual machines for compute and Azure OpenAI model deployments. For more information about quotas, see [Quotas and limits for Azure AI Studio](./how-to/quota.md).

## Hub view

You (or your admin) use a hub for enterprise configuration, a unified data story, and built-in governance. There's a centralized backend infrastructure to reduce complexity for developers. For more information about hubs and dependencies, see [AI Studio architecture](concepts/architecture.md).

After you've created a hub (whether or not you have a project in it), you can view the hub's details, manage settings, and access resources. From the left navigation pane on the **Home** page, select **All hubs** and then select a hub to view its details.

From the left navigation pane on the **Hub overview** page, you can access the same model catalog, model benchmarks, prompt catalog, and AI Services pages that you can access from the [**Home** page](#home-page). You can also access the following pages:

- **All projects:** This is one of the places in AI Studio where you can create new projects. You can view a list of all the projects that you have access to in the hub. You can also filter the projects by project name, hub name, or region. For more information about creating projects, see [Create a project](how-to/create-projects.md).
- **Playgrounds:** This is where you can experiment with your data and prompts for generative AI models. Available playgrounds include chat, assistants, and more. 
- **Shared resources:** This is where you can view and manage shared resources in the hub. Shared resources include [deployments](./concepts/deployments-overview.md), [connections](./concepts/connections.md), [compute instances](./how-to/create-manage-compute.md), [users](./concepts/rbac-ai-studio.md), policies, and [content filters](./concepts/content-filtering.md). 

## Project view

You use a project to organize your work, manage resources, and collaborate with others. A project is a container for your data, models, code, and other resources. For more information about creating projects, see [create AI Studio projects](how-to/create-projects.md).

You can access a project in the following ways:
- Go to the **Home** page and select a project from the list of recent projects.
- From the left navigation pane on the **Home** page, select **All hubs** and then select a hub. Then you can select a project from the list of projects in the hub.

From the project's left navigation pane, you can access the same model catalog, model benchmarks, and prompt catalog pages that you can access from the [**Home** page](#home-page). 

:::image type="content" source="media/explore/project-view-current.png" alt-text="Screenshot of an AI Studio project overview page." lightbox= "media/explore/project-view-current.png":::

You can also access the following pages:
- Project playground: This is where you can experiment with your data and prompts for generative AI models. Available playgrounds include chat, completion, assistants, and images.
- Tools: This is where you can access tools for prompt flow, tracing, evaluations, and fine-tuning. You can also access the [Visual Studio Code (Web)](how-to/develop/vscode.md) experience from this page. 
- Components: This is where you can view and manage components in the project. Components include data, indexes, deployments, and content filters.

## Pricing and billing

Azure AI Studio is monetized through individual products customer access and consume in the platform, including API and models, complete AI toolchain, and responsible AI and enterprise grade production at scale products. Each product has its own billing model and price. 

The platform is free to use and explore. Pricing occurs at deployment level. For more information abut AI Studio pricing, see [AI Studio pricing](https://aka.ms/Azure-AI-Studio-New-Pricing-Page).

Using AI Studio also incurs cost associated with the underlying services, to learn more read [Plan and manage costs for Azure AI services](./how-to/costs-plan-manage.md).

## Region availability

AI Studio is available in most regions where Azure AI services are available. For more information, see [region support for AI Studio](reference/region-support.md).

## How to get access

You can [explore AI Studio (including the model catalog)](./how-to/model-catalog.md) without signing in. 

But for full functionality there are some requirements:
- You need an [Azure account](https://azure.microsoft.com/free/). 
- You also need to apply for access to Azure OpenAI Service by completing the form at [https://aka.ms/oai/access](https://aka.ms/oai/access). You receive a follow-up email when your subscription is added.

## Next steps 

- [Create a project](./how-to/create-projects.md)
- [Tutorial: Deploy a chat web app](tutorials/deploy-chat-web-app.md)
- [Tutorial: Using AI Studio with a screen reader](tutorials/screen-reader.md)
