---
title: Create an application-centric environment with Colony
description: This article demonstrates how to create an application-centric environment with Colony and Azure.
ms.topic: how-to
ms.date: 11/09/2021
---

# Create an application-centric environment with Colony

[Quali CloudShell Colony](https://azuremarketplace.microsoft.com/marketplace/apps/quali_systems.cloudshell_colony?tab=Overview) is a software-as-a-service (SaaS) platform for delivering infrastructure automation at scale. Colony works to help developers deploy applications in complex cloud environments like Azure and Kubernetes. Colony complements Azure DevTest Labs throughout the application deployment process, all the way to production. This article demonstrates how to create an application-centric environment with Colony and Azure.

## Set up the environment with Colony and Microsoft Azure

1. Sign up for your free trial of [Colony](https://azuremarketplace.microsoft.com/marketplace/apps/quali_systems.cloudshell_colony?tab=Overview).

    :::image type="content" source="./media/create-application-centric-environment/free-trial.png" alt-text="Screenshot that shows the signup for a free Colony trial.":::
1. [Link your Azure account](https://colonysupport.quali.com/hc/articles/360008222234).

    :::image type="content" source="./media/create-application-centric-environment/welcome.png" alt-text="Screenshot of the Welcome to Colony screen.":::
1. Invite users into your space.
1. [Create your first blueprint by using a YAML file](https://colonysupport.quali.com/hc/articles/360001680807-Steps-to-Developing-a-Blueprint).
    1. Link your GitHub or BitBucket blueprint repo to Colony.
    1. Use a Colony sample blueprint as the foundation, and modify as appropriate.

        :::image type="content" source="./media/create-application-centric-environment/performance-stress-tests.png" alt-text="Screenshot that shows stress tests.":::
    1. Publish your blueprint for others to use.
1. Launch your application environment into a sandbox by using Colony.

    :::image type="content" source="./media/create-application-centric-environment/blueprints.png" alt-text="Screenshot of launching your application environment into a sandbox by using Colony.":::

You can also integrate your blueprint as part of a continuous integration and continuous delivery (CI/CD) workflow in Azure Pipelines. For steps, see [Launching a Sandbox from Azure DevOps (VSTS)](https://colonysupport.quali.com/hc/articles/360008464234).

:::image type="content" source="./media/create-application-centric-environment/devops-pipeline.png" alt-text="Screenshot that shows connecting to an Azure Pipelines pipeline.":::

## Next steps

[Request a demo of Colony](https://info.quali.com/cloudshell-colony-demo-request)
