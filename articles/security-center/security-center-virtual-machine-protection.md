---
title: Protect your machines and applications
description: This document addresses recommendations in Security Center that help you protect your virtual machines and computers and your web apps and App Service environments.
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.assetid: 47fa1f76-683d-4230-b4ed-d123fef9a3e8
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/11/2020
ms.author: memildin

---
# Protect your machines and applications
When Azure Security Center identifies potential security vulnerabilities, it creates recommendations that guide you through the process of configuring the needed controls to harden and protect your resources.

This article explains the **Compute and Apps** page of Security Center's resource security section.

For a full list of the recommendations you might see on this page, see [Compute and apps recommendations](recommendations-reference.md#recs-computeapp).


## View the security of your compute and apps resources

[![Security Center dashboard](./media/security-center-virtual-machine-recommendations/compute-and-apps-recs-overview.png)](./media/security-center-virtual-machine-recommendations/compute-and-apps-recs-overview.png#lightbox)

To view the status of your compute and apps resources, from the left pane in Security Center, select **Compute & apps**. The following tabs are available:

* **Overview**: lists the recommendations for all the compute and apps resources as well as their current security status 

* [**VMs and Servers**](#vms-and-computers): lists the recommendations for your VMs, computers, and current security state of each

* [**VM scale sets**](#vmscale-sets): lists the recommendations for your scale sets, 

* [**Cloud services**](#cloud-services): lists the recommendations for your web and worker roles monitored by Security Center

* [**App services**](#app-services): lists the recommendations for your App service environments and the current security state of each

* [**Containers**](#containers): lists the recommendations for your containers and security assessment of their configurations

* **Compute resources**: lists the recommendations for your compute resources, such as Service Fabric clusters and Event hubs

### What's in each tab?

Each tab has multiple sections, and in each section, you can drill down to see additional details about the item shown.

In each tab, you will also see recommendations for the relevant resources in your monitored environment. The first column lists the recommendation, the second shows the total number of resources affected, and the third shows the severity of the issue.

Each recommendation has a set of actions that you can perform after you select it. For example, if you select **Missing system updates**, the number of VMs and computers that are missing patches, and the severity of the missing update appears.

> [!NOTE]
> The security recommendations are the same as those on the **Recommendations** page, but here they're filtered to the specific resource type you've selected. For more information about how to resolve recommendations, see [Implementing security recommendations in Azure Security Center](security-center-recommendations.md).
>




### <a name="vms-and-computers"></a>VMs and Servers
The VMs and computers section gives you an overview of all security recommendations for your VMs and computers. Four types of machines are included:

![Non-Azure computer](./media/security-center-virtual-machine-recommendations/security-center-monitoring-icon1.png) Non-Azure computer.

![Azure Resource Manager VM](./media/security-center-virtual-machine-recommendations/security-center-monitoring-icon2.png) Azure Resource Manager VM.

![Azure Classic VM](./media/security-center-virtual-machine-recommendations/security-center-monitoring-icon3.png) Azure Classic VM.

![VMs identified from the workspace](./media/security-center-virtual-machine-recommendations/security-center-monitoring-icon4.png) VMs that are identified only from the workspace that is part of the viewed subscription. This includes VMs from other subscriptions that report to the workspace in this subscription, and VMs that were installed with Operations Manager direct agent, and have no resource ID.

The icon that appears under each recommendation helps you to quickly identify the VM and computer that needs attention, and the type of recommendation. You can also use the filters to search the list by **Resource type** and by **Severity**.

To drill down into the security recommendations for each VM, click on the VM.
Here you see the security details for the VM or computer. At the bottom, you can see the recommended action and the severity of each issue.

[![Cloud services](./media/security-center-virtual-machine-recommendations/recommendation-list.png)](./media/security-center-virtual-machine-recommendations/recommendation-list.png#lightbox)




### <a name="vmscale-sets"></a>Virtual machine scale sets
Security Center automatically discovers whether you have scale sets and recommends that you install the Log Analytics agent on them.

To install the Log Analytics agent: 

1. Select the recommendation **Install the monitoring agent on virtual machine scale set**. You get a list of unmonitored scale sets.

1. Select an unhealthy scale set. Follow the instructions to install the monitoring agent using an existing populated workspace or create a new one. Make sure to set the workspace [pricing tier](security-center-pricing.md) if it's not set.

   ![Install MMS](./media/security-center-virtual-machine-recommendations/install-mms.png)

To set new scale sets to automatically install the Log Analytics agent:
1. Go to Azure Policy and click **Definitions**.

1. Search for the policy **Deploy Log Analytics agent for Windows virtual machine scale sets** and click on it.

1. Click **Assign**.

1. Set the **Scope** and **Log Analytics workspace** and click **Assign**.

If you want to set all existing scale sets to install the Log Analytics agent, in Azure Policy, go to **Remediation** and apply the existing policy to existing scale sets.





### <a name="cloud-services"></a>Cloud services
For cloud services, a recommendation is created when the operating system version is out of date.

![Cloud services](./media/security-center-virtual-machine-recommendations/security-center-monitoring-fig1-new006-2017.png)

In a scenario where you have a recommendation, follow the steps in the recommendation to update the operating system. When an update is available, you will have an alert (red or orange - depending on the severity of the issue). For a full explanation of this recommendation, click **Update OS version** under the **DESCRIPTION** column.






### <a name="app-services"></a>App services
To view the App Service information, you must be on Security Center's Standard pricing tier and enable App Service in your subscription. For instructions on enabling this feature, see [Protect App Service with Azure Security Center](security-center-app-services.md).

Under **App services**, you find a list of your App service environments and the health summary based on the assessment Security Center performed.

![App services](./media/security-center-virtual-machine-recommendations/app-services.png)

There are three types of application services shown:

![App services environment](./media/security-center-virtual-machine-recommendations/ase.png) App services environment

![Web application](./media/security-center-virtual-machine-recommendations/web-app.png) Web application

![Function application](./media/security-center-virtual-machine-recommendations/function-app.png) Function application

If you select a web application, a summary view opens with three tabs:

   - **Recommendations**: based on assessments performed by Security Center that failed.
   - **Passed assessments**: list of assessments performed by Security Center that passed.
   - **Unavailable assessments**: list of assessments that failed to run due to an error or the recommendation is not relevant for the specific App service

   Under **Recommendations** is a list of the recommendations for the selected web application and severity of each recommendation.

   ![App Services recommendations](./media/security-center-virtual-machine-recommendations/app-services-rec.png)

Select a recommendation to see a description of the recommendation and a list of unhealthy resources, healthy resources, and unscanned resources.

   - The **Passed assessments** column shows a list of passed assessments. Severity of these assessments is always green.

   - Select a passed assessment from the list for a description of the assessment, a list of unhealthy and healthy resources, and a list of unscanned resources. There is a tab for unhealthy resources but that list is always empty since the assessment passed.





### <a name="containers"></a>Containers

When you open the **Containers** tab, depending on your environment, you might see any of three types of resources:

![Container host](./media/security-center-virtual-machine-recommendations/icon-container-host-rec.png) Container hosts - VMs running docker 

![Kubernetes service](./media/security-center-virtual-machine-recommendations/icon-kubernetes-service-rec.png) Azure Kubernetes Service (AKS) clusters

![Container registry](./media/security-center-virtual-machine-recommendations/icon-container-registry-rec.png) Azure Container Registry (ACR) registries - Shown only when you're on the standard pricing tier and when you have the Azure Container Registry bundle enabled.

For instructions on how to use the container security features, see [Monitoring the security of your containers](monitor-container-security.md).

Benefits of the Azure Container Registry bundle are explained [here](azure-container-registry-integration.md)

Benefits of the Kubernetes Services bundle are explained [here](azure-kubernetes-service-integration.md)

[![Containers tab](./media/security-center-virtual-machine-recommendations/container-recommendations-all-types.png)](./media/security-center-virtual-machine-recommendations/container-recommendations-all-types.png#lightbox)

To see the recommendations for a specific resource in the list, click that resource.

#### Visibility into container registries

For example, clicking the asc-demo ACR registry from the list shown in the graphic above leads to this details page:

[![Recommendations for a specific ACR registry](./media/security-center-virtual-machine-recommendations/acr-registry-recs-list.png)](./media/security-center-virtual-machine-recommendations/acr-registry-recs-list.png#lightbox)


#### Visibility into containers hosted on IaaS Linux machines

When you click one of the VMs running docker, you'll see the details page with information related to the containers on the machine, such as Docker version and the number of images running on the host.

![Recommendations for a VM running docker](./media/security-center-virtual-machine-recommendations/docker-recommendation.png)


#### Security recommendations based on CIS benchmark for Docker

Security Center scans your Docker configurations and gives you visibility into misconfigurations by providing a list of all failed rules that were assessed. Security Center provides guidelines to help you resolve these issues quickly and save time. Security Center continuously assesses the Docker configurations and provides you with their latest state.

![container tab](./media/security-center-virtual-machine-recommendations/container-cis-benchmark.png)


## Next steps
To learn more about recommendations that apply to other Azure resource types, see the following articles:

* [Full reference list of Azure Security Center's security recommendations](recommendations-reference.md)
* [Monitor identity and access in Azure Security Center](security-center-identity-access.md)
* [Protecting your network in Azure Security Center](security-center-network-recommendations.md)
* [Protecting your Azure SQL service in Azure Security Center](security-center-sql-service-recommendations.md)