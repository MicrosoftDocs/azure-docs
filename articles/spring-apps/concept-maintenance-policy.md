---
title:  "Auto patching and planned maintenance"
description: This article describes Maintanence Policy for Azure Spring Apps.
author: zhiyongli
ms.author: zhiyongli
ms.service: spring-apps
ms.topic: conceptual
ms.date: 06/14/2023
---


# Auto patching and planned maintenance

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

Azure Spring Apps is a managed service that can greatly reduce your burden of frequent updates for security patches, managed components and infrastructure maintenance. In this article, we will discuss the risks and efforts that you no longer need to worry about, how Azure Spring Apps delivers such experience and the your flexibility in controlling such updates.

## Unceasing barrage of software updates

The term "unceasing barrage of server-side software updates" refers to the frequent and continuous stream of updates that are released for server software. This can include updates for the operating system, K8S, JDK, Application Performance Monitoring tools, application libraries and dependencies, and other applications that are used to run a server. 

These updates are released by software vendors to fix bugs, patch security vulnerabilities, and introduce new features. The updates can be frequent and regular, and organizations need to install them in a timely manner to ensure that their servers are secure and functioning properly. Maintenance updates for operating systems are monthly, K8S distributions are quarterly, JDK builds are quarterly, APMs are every few weeks, app libraries and dependencies are updated every few weeks. Further security patches across the stack are released regularly and their schedules vary.

These updates can require significant time and effort to install and configure, and they can sometimes cause problems if they are not compatible with other software running on the server. Additionally, frequent updates can be disruptive to users who rely on the services provided by the server, as they may need to be temporarily taken offline while updates are installed.

These updates usually involve large volume of patches or updates, require scaling coordination across application development teams and DevOps teams, need repeated execution of pipelines from testing, certification, staging and deployment. If the pipelines are stateful or non-reproducible, there is more effort to consider.

In summary, the constant need to install updates can be time-consuming and disruptive, which is why some people may find it overwhelming or burdensome.

## Auto patching of Azure Spring Apps

Are you tired of the never-ending cycle of server software updates? It's time to break free and focus on what really matters - driving innovation and growth in your business. Introducing Azure Spring Apps - our powerful platform that automates software patching, freeing up your time and resources to focus on business-critical tasks. With auto-patching, you can rest assured that your applications are always up-to-date and secure, without the hassle of manual updates. Whether you're managing a single app or a complex enterprise environment, Azure Spring Apps simplifies the patching process and streamlines your workflow.

You take care of the apps, and we take care of everything else.

Azure Spring Apps is on-point for autopatch running periodically. You can configure planned maintenance for the autopatch to run within a time range you specify, and we will have hotfixes deployed for any critical vulnerabilities.

Apart from the planned maintenance, you can update your apps at any time. For Enterprise Tier, Tanzu build service makes sure that apps are patchable at all times. For all tiers, you can take charge of the dependencies as long as they are in check with the [version support of SDKs](concept-app-customer-responsibilities.md).

With Azure Spring Apps’ auto patching feature, you can rest easy knowing that your systems and software are always protected against the latest known security threats and vulnerabilities. Auto patching is a proactive shield that automatically updates your systems and software with the latest security patches, reducing the risk of a security breach or system downtime. Before and after each execution of auto patching, you will also receive notifications and find event logs to help you keep track of the details. Through this automatic patching process, you can save time and resources, freeing up your team to focus on more important tasks.

Take control of your system's security with Azure's auto patching feature and stay one step ahead of the game.

## Planned maintenance

Auto patching usually happens less than once a month, except for urgent security patches. Each execution of auto patching is called a planned maintenance. You may configure the prefered day of week and time range for planned maintenance to occur.

A planned maintenance will upgrade the following components and restart your applications for the upgrades to take full effect. The upgrades are applied progressively through the regions following [Azure Safe Deployment Practices](https://azure.microsoft.com/blog/advancing-safe-deployment-practices/).

There are serverl types of components in Azure Spring Apps
 - Customer application: runnable application with wrapped library provided by the customer
 - Base image components: image enviroment to run the customer application, include integrated APM, JDK, polyglot SDK and base OS image.
 - Managed middleware: middleware provided by Azure Spring Apps, such as [Tanzu Components](vmware-tanzu-components.md) for Enterprise Tier, and Eureka and Config Server for other tiers
 - Runtime infrastructure: backend infrastructure to run the system, such Kubernetes and host OS

### Customer application
Customer needs to be responsible for the upgrade of the libraries in customer applications, please refer to [version support of SDKs](concept-app-customer-responsibilities.md) for details.

### Base image components
Since customer applications run inside the environment defined by the base image components, the upgrade will only take effect when customer applications are restarted. Azure Spring Apps will perform rolling restart on the customer applications in a planned maintenance to apply the upgrade.

### Managed middleware
Similar to base image components, managed middleware is also part of the environment for customer applications to run. Azure Spring Apps will perform rolling restart on the customer applications in a planned maintenance to apply the upgrade.

### Runtime infrastructure
Azure Spring Apps will perform rolling upgrade for the runtime infrastructure. The underlying kubernetes cluster will be upgraded.

## Upgrade frequency
Auto patching usually happens less than once a month, and for each planned maintenance, there may be different components involved. Here are the expected frequencies of some specific components.

| Type | Component      | Frequency of Maintenance Updates | Security patch |
|---------------------|----------------------------|---------------------|----------------------------|
| Base Image Components     |     APM      | Every Few weeks            | Vary|
| Base Image Components     |     JDK/SDK      | Quarterly            | Vary|
| Base Image Components     |     Base Image      | Every Few weeks             | Vary|
| Managed Middleware     |     Config Server/Eureka      | Quarterly            | Vary|
| Managed Middleware     |     Tanzu Components      | Quarterly            | Vary|
| Runtime Infrastructure    |     Kubernetes      | Quarterly            | Vary|
| Runtime Infrastructure     |     Host OS      | Monthly            | Vary|

Security patches are usually applied along with a planned maintenance, but in some rare cases of urgent security patches, there can be special planned maintenances just for such security patches.

## Notifications for planned maintenance
Before each planned maintenance, you will find a release note in Activity Logs, describing what components will be upgraded for this round.

:::image type="content" source="media/concept-maintenance-policy/release-note.png" alt-text="Screenshot of the Azure portal showing the Activity Log page with a release note." lightbox="media/concept-maintenance-policy/release-note.png":::

   > [!NOTE]
   > After receiving the release note, you may choose to restart or redeploy your applications manually, to make the upgrade take effect earlier than the configured time for planned maintenance.

For Enterprise Tier, the build service will help you patch the base image. If the builder is upgraded in a planned maintenance, your build result images will also be upgraded automatically. Builder upgrade notifications can also be found from Activity Logs. For the new build result images to take effect, you may also restart your applications manually before a planned maintenance happens.

