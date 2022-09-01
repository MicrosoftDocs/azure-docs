---
title: Overview - Azure Arc-enabled Logic Apps
description: Learn about single-tenant Logic Apps workflows that can run anywhere that Kubernetes can run.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, kewear, rohithah, archidda, azla
ms.topic: overview
ms.date: 08/20/2022
#Customer intent: As a developer, I want to learn about automated Azure Arc-enabled logic app workflows that can run anywhere that Kubernetes can run.
---

# What is Azure Arc-enabled Logic Apps? (Preview)

> [!NOTE]
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

With Azure Arc-enabled Logic Apps, you can develop and run single-tenant based logic apps anywhere that Kubernetes can run. For example, you can run your logic app workflows on Azure, Azure Kubernetes Service, on premises, and even other cloud providers. This offering provides a centralized single-pane-of-glass management platform through Azure Arc and the Azure portal for the following capabilities:

- Use Azure Logic Apps as your integration platform.
- Connect your workflows to all your services no matter where they're hosted.
- Run your integration solutions directly alongside your services.
- Create and edit workflows using Visual Studio Code.
- Deploy using your choice of pipelines for DevOps.
- Control your infrastructure and resources in Azure, non-Azure, multiple clouds, on premises, and edge environments.

For more information, review the following documentation:

- [What is Azure Logic Apps?](../logic-apps/logic-apps-overview.md)
- [Single-tenant versus other Logic Apps environments](../logic-apps/single-tenant-overview-compare.md)
- [Azure Arc overview](../azure-arc/overview.md)
- [Azure Kubernetes Service overview](../aks/intro-kubernetes.md)
- [What is Azure Arc-enabled Kubernetes?](../azure-arc/kubernetes/overview.md)
- [What is Kubernetes?](https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/)

<a name="why-use"></a>

## Why use Azure Arc-enabled Logic Apps

With Azure Arc-enabled Logic Apps, you can create and deploy logic app workflows in the same way as in the single-tenant experience for Azure Logic Apps. You also gain more control and flexibility when you have logic apps running on a Kubernetes infrastructure that you operate and manage.

Minor differences exist between the Azure Arc and single-tenant Logic Apps experiences for creating, designing, and deploying logic apps. When you use Azure Arc-enabled Logic Apps, the major difference is that your logic apps run in a *custom location*. This location is mapped to an Azure Arc-enabled Kubernetes cluster where you have installed and enabled the Azure App Service platform extensions bundle.

For example, this cluster can be Azure Kubernetes Service, bare-metal Kubernetes, or another setup. The extensions bundle enables you to run platform services such as Azure Logic Apps, Azure Functions, and Azure App Service on your Kubernetes cluster.

For more information, review the following documentation:

- [Single-tenant versus other Azure Logic Apps environments](../logic-apps/single-tenant-overview-compare.md)
- [Azure Kubernetes Service overview](../aks/intro-kubernetes.md)
- [What is Azure Arc-enabled Kubernetes?](../azure-arc/kubernetes/overview.md)
- [Custom locations on Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/conceptual-custom-locations.md)
- [App Service, Functions, and Logic Apps on Azure Arc (Preview)](../app-service/overview-arc-integration.md)
- [Set up an Azure Arc-enabled Kubernetes cluster to run App Service, Functions, and Logic Apps (Preview)](../app-service/manage-create-arc-environment.md)

<a name="when-to-use"></a>

## When to use Azure Arc-enabled Logic Apps

Although Kubernetes provides more control and flexibility, you also have operational overhead. If you're satisfied that the Logic Apps service meets your needs, you're encouraged to continue using this service. However, consider using Azure Arc-enabled Logic Apps when you have the following scenarios:

- You already run all your apps and services on Kubernetes. You want to extend these processes and controls to all your other PaaS services.

- You want to use Logic Apps as your integration platform. However, you need fine grained networking with compute control and flexibility. You don't want to use an integration service environment (ISE) or App Service Environment (ASE).

- For security reasons, you need control over where your logic apps run, for example, in your own region or in your own datacenter. 

- You want to run your logic apps in multi-cloud scenarios and use the Logic Apps service as your sole integration platform for all your applications wherever they run.

<a name="compare"></a>

## Compare offerings

This table provides a high-level comparison between the capabilities in the current Azure Logic Apps offerings:

:::row:::
   :::column:::
      **Capability**
   :::column-end:::
   :::column:::
      **Multi-tenant Logic Apps (Consumption)**
   :::column-end:::
   :::column:::
      **Single-tenant Logic Apps (Standard)**
   :::column-end:::
   :::column:::
      **Standalone containers** <br><br>**Note**: Unsupported for workflows in production environments. For fully supported containers, [create Azure Arc-enabled Logic Apps workflows](azure-arc-enabled-logic-apps-create-deploy-workflows.md) instead.
   :::column-end:::
   :::column:::
      **Azure Arc**
   :::column-end:::
:::row-end:::
:::row:::
   :::column:::
      Local development
   :::column-end:::
   :::column:::
      Visual Studio Code, Visual Studio
   :::column-end:::
   :::column:::
      Visual Studio Code, including run history and overview with breakpoint debugging
   :::column-end:::
   :::column:::
      Visual Studio Code
   :::column-end:::
   :::column:::
      Visual Studio Code, including run history and overview with breakpoint debugging
   :::column-end:::
:::row-end:::
:::row:::
   :::column:::
      Hosting
   :::column-end:::
   :::column:::
      Run in Azure only
   :::column-end:::
   :::column:::
      Run in Azure only
   :::column-end:::
   :::column:::
      Run anywhere your containers run
   :::column-end:::
   :::column:::
      Run anywhere with an Azure Arc-enabled Kubernetes cluster
   :::column-end:::
:::row-end:::
:::row:::
   :::column:::
      Management
   :::column-end:::
   :::column:::
      Fully managed Logic Apps experience
   :::column-end:::
   :::column:::
      Fully managed Logic Apps experience
   :::column-end:::
   :::column:::
      Not managed
   :::column-end:::
   :::column:::
      Managed Logic Apps experience with operational control at the Kubernetes level
   :::column-end:::
:::row-end:::
:::row:::
   :::column:::
      Monitoring
   :::column-end:::
   :::column:::
      Monitor in the Azure portal, including run history, resubmit run, and Application Insights capabilities, if needed
   :::column-end:::
   :::column:::
      Monitor in the Azure portal, including run history, resubmit run, and Application Insights capabilities, if needed
   :::column-end:::
   :::column:::
      Monitor only with Application Insights or other container monitoring tools
   :::column-end:::
   :::column:::
      Monitor in the Azure portal, including run history, resubmit run, and Application Insights capabilities, if needed
   :::column-end:::
:::row-end:::
:::row:::
   :::column:::
      Scaling
   :::column-end:::
   :::column:::
      Control scaling using Consumption plan
   :::column-end:::
   :::column:::
      Control scaling using Standard plan
   :::column-end:::
   :::column:::
      Not available
   :::column-end:::
   :::column:::
      Control scaling using [Kubernetes-based Event Driven Autoscaling (KEDA)](https://keda.sh/). Configure scale events based on queue length.
   :::column-end:::
:::row-end:::

## Next steps

> [!div class="nextstepaction"]
> [Create and deploy workflows with Azure Arc-enabled Logic Apps](azure-arc-enabled-logic-apps-create-deploy-workflows.md)
