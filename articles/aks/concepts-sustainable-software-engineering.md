---
title: Concepts - Sustainable software engineering in Azure Kubernetes Services (AKS)
description: Learn about sustainable software engineering in Azure Kubernetes Service (AKS).
services: container-service
ms.topic: conceptual
ms.date: 10/25/2022
---

# Sustainable software engineering practices in Azure Kubernetes Service (AKS)

The sustainable software engineering principles are a set of competencies to help you define, build, and run sustainable applications. The overall goal is to reduce the carbon footprint in every aspect of your application. The Azure Well-Architected Framework guidance for sustainability aligns with the [The Principles of Sustainable Software Engineering](https://principles.green/) from the [Green Software Foundation](https://greensoftware.foundation/), and provides an overview of the principles of sustainable software engineering.

Sustainable software engineering is a shift in priorities and focus. In many cases, the way most software is designed and run highlights fast performance and low latency. Meanwhile, sustainable software engineering focuses on reducing as much carbon emission as possible. Consider the following:

* Applying sustainable software engineering principles can give you faster performance or lower latency, such as by lowering total network traversal.
* Reducing carbon emissions may cause slower performance or increased latency, such as delaying low-priority workloads.

The guidance found in this article is focused on Azure Kubernetes Services you're building or operating on Azure and includes design and configuration checklists, recommended design, and configuration options. Before applying sustainable software engineering principles to your application, review the priorities, needs, and trade-offs of your application.

## Prerequisites

* Understanding the Well-Architected Framework sustainability guidance can help you produce a high quality, stable, and efficient cloud architecture. We recommend that you start by reading more about [sustainable workloads](/azure/architecture/framework/sustainability/sustainability-get-started) and reviewing your workload using the [Microsoft Azure Well-Architected Review](https://aka.ms/assessments) assessment.
* Having clearly defined business requirements is crucial when building applications, as they might have a direct impact on both cluster and workload architectures and configurations. When building or updating existing applications, review the Well-Architected Framework sustainability design areas, alongside your application's holistic lifecycle.

## Understanding the shared responsibility model

Sustainability – just like security – is a shared responsibility between the cloud provider and the customer or partner designing and deploying AKS clusters on the platform. Deploying AKS does not automatically make it sustainable, even if the [data centers are optimized for sustainability](https://infrastructuremap.microsoft.com/fact-sheets). Applications that aren't optimized may still emit more carbon than necessary.

Learn more about the [shared responsibility model for sustainability](/azure/architecture/framework/sustainability/sustainability-design-methodology#a-shared-responsibility).

## Design principles

**[Carbon Efficiency](https://learn.greensoftware.foundation/practitioner/carbon-efficiency)**: Emit the least amount of carbon possible.

A carbon efficient cloud application is one that is optimized, and the starting point is the cost optimization.

**[Energy Efficiency](https://learn.greensoftware.foundation/practitioner/energy-efficiency/)**: Use the least amount of energy possible.

One way to increase energy efficiency, is to run the application on as few servers as possible, with the servers running at the highest utilization rate; thereby increasing hardware efficiency as well.

**[Hardware Efficiency](https://learn.greensoftware.foundation/practitioner/hardware-efficiency)**: Use the least amount of embodied carbon possible.

There are two main approaches to hardware efficiency:

* For end-user devices, it's extending the lifespan of the hardware.
* For cloud computing, it's increasing the utilization of the resource.

**[Carbon Awareness](https://learn.greensoftware.foundation/practitioner/carbon-awareness)**: Do more when the electricity is cleaner and do less when the electricity is dirtier.

Being carbon aware means responding to shifts in carbon intensity by increasing or decreasing your demand.

## Design patterns and practices

We recommend careful consideration of these design patterns for building a sustainable workload on Azure Kubernetes Service, before reviewing the detailed recommendations in each of the design areas.

| Design pattern | Applies to workload | Applies to cluster |
| --- | --- | --- |
| [Design for independent scaling of logical components](#design-for-independent-scaling-of-logical-components) | ✔️ |  |
| [Design for event-driven scaling](#design-for-event-driven-scaling) | ✔️ |  |
| [Aim for stateless design](#aim-for-stateless-design) | ✔️ |  |
| [Enable cluster and node auto-updates](#enable-cluster-and-node-auto-updates) |  | ✔️ |
| [Install supported add-ons and extensions](#install-supported-add-ons-and-extensions) | ✔️ | ✔️ |
| [Containerize your workload where applicable](#containerize-your-workload-where-applicable) | ✔️ |  |
| [Use energy efficient hardware](#use-energy-efficient-hardware) |  | ✔️ |
| [Match the scalability needs and utilize auto-scaling and bursting capabilities](#match-the-scalability-needs-and-utilize-auto-scaling-and-bursting-capabilities) |  | ✔️ |
| [Turn off workloads and node pools outside of business hours](#turn-off-workloads-and-node-pools-outside-of-business-hours) | ✔️ | ✔️ |
| [Delete unused resources](#delete-unused-resources) | ✔️ | ✔️ |
| [Tag your resources](#tag-your-resources) | ✔️ | ✔️ |
| [Optimize storage utilization](#optimize-storage-utilization) | ✔️ | ✔️ |
| [Choose a region that is closest to users](#choose-a-region-that-is-closest-to-users) | | ✔️ |
| [Reduce network traversal between nodes](#reduce-network-traversal-between-nodes) | | ✔️ |
| [Evaluate using a service mesh](#evaluate-using-a-service-mesh) | | ✔️ |
| [Optimize log collection](#optimize-log-collection) | ✔️  | ✔️ |
| [Cache static data](#cache-static-data) | ✔️ | ✔️ |
| [Evaluate whether to use TLS termination](#evaluate-whether-to-use-tls-termination) | ✔️ | ✔️ |
| [Use cloud native network security tools and controls](#use-cloud-native-network-security-tools-and-controls) | ✔️ | ✔️ |
| [Scan for vulnerabilities](#scan-for-vulnerabilities) | ✔️ | ✔️ |

## Application design

Explore this section to learn more about how to optimize your applications for a more sustainable application design.

### Design for independent scaling of logical components

A microservice architecture may reduce the compute resources required, as it allows for independent scaling of its logical components and ensures they are scaled according to the demand.

* Consider using [Dapr Framework](https://dapr.io/) or [other CNCF projects](/azure/architecture/example-scenario/apps/build-cncf-incubated-graduated-projects-aks) to help you separate your application functionality into different microservices, to allow independent scaling of its logical components.

### Design for event-driven scaling

Scaling your workload based on relevant business metrics such as HTTP requests, queue length, and cloud events can help reduce its resource utilization, hence its carbon emissions.

* Use [Keda](https://keda.sh/) when building event-driven applications to allow scaling down to zero when there is no demand.

### Aim for stateless design

Removing state from your design reduces the in-memory or on-disk data required by the workload to function.

* Consider [stateless design](/azure/aks/operator-best-practices-multi-region#remove-service-state-from-inside-containers) to reduce unnecessary network load, data processing, and compute resources.

## Application platform

Explore this section to learn how to make better informed platform-related decisions around sustainability.

### Enable cluster and node auto-updates

An up-to-date cluster avoids unnecessary performance issues and ensures you benefit from the latest performance improvements and compute optimizations.

* Enable [cluster auto-upgrade](/azure/aks/auto-upgrade-cluster) and [apply security updates to nodes automatically using GitHub Actions](/azure/aks/node-upgrade-github-actions), to ensure your cluster has the latest improvements.

### Install supported add-ons and extensions

Add-ons and extensions covered by the [AKS support policy](/azure/aks/support-policies) provide additional and supported functionality to your cluster while allowing you to benefit from the latest performance improvements and energy optimizations throughout your cluster lifecycle.

* Ensure you install [KEDA](/azure/aks/integrations#available-add-ons) as an add-on and [GitOps & Dapr](/azure/aks/cluster-extensions?tabs=azure-cli#currently-available-extensions) as extensions.

### Containerize your workload where applicable

Containers allow for reducing unnecessary resource allocation and making better use of the resources deployed as they allow for bin packing and require less compute resources than virtual machines.

* Use [Draft](/azure/aks/draft) to simplify application containerization by generating Dockerfiles and Kubernetes manifests.

### Use energy efficient hardware

Ampere's Cloud Native Processors are uniquely designed to meet both the high performance and power efficiency needs of the cloud.

* Evaluate if nodes with [Ampere Altra Arm–based processors](https://azure.microsoft.com/blog/azure-virtual-machines-with-ampere-altra-arm-based-processors-generally-available/) are a good option for your workloads.

### Match the scalability needs and utilize auto-scaling and bursting capabilities

An oversized cluster does not maximize utilization of compute resources and can lead to a waste of energy. Separate your applications into different node pools to allow for cluster right sizing and independent scaling according to the application requirements. As you run out of capacity in your AKS cluster, grow from AKS to ACI to scale out additional pods to serverless nodes and ensure your workload uses all the allocated resources efficiently.

* Size your cluster to match the scalability needs of your application and [use cluster autoscaler](/azure/aks/cluster-autoscaler) in combination with [virtual nodes](/azure/aks/virtual-nodes) to rapidly scale and maximize compute resource utilization. Additionally, [enforce resource quotas](/azure/aks/operator-best-practices-scheduler#enforce-resource-quotas) at the namespace level and [scale user node pools to 0](/azure/aks/scale-cluster?tabs=azure-cli#scale-user-node-pools-to-0) when there is no demand.

### Turn off workloads and node pools outside of business hours

Workloads may not need to run continuously and could be turned off to reduce energy waste, hence carbon emissions. You can completely turn off (stop) your node pools in your AKS cluster, allowing you to also save on compute costs.

* Use the [node pool stop / start](/azure/aks/start-stop-nodepools) to turn off your node pools outside of business hours, and [KEDA CRON scaler](https://keda.sh/docs/2.7/scalers/cron/) to scale down your workloads (pods) based on time.

## Operational procedures

Explore this section to set up your environment for measuring and continuously improving your workloads cost and carbon efficiency.

### Delete unused resources

Unused resources such as unreferenced images and storage resources should be identified and deleted as they have a direct impact on hardware and energy efficiency. Identifying and deleting unused resources must be treated as a process, rather than a point-in-time activity to ensure continuous energy optimization.

* Use [Azure Advisor](/azure/advisor/advisor-cost-recommendations) to identify unused resources and [ImageCleaner](/azure/aks/image-cleaner?tabs=azure-cli) to clean up stale images and remove an area of risk in your cluster.

### Tag your resources

Getting the right information and insights at the right time is important for producing reports about performance and resource utilization.

* Set [Azure tags on your cluster](/azure/aks/use-tags) to enable monitoring of your workloads.

## Storage

Explore this section to learn how to design a more sustainable data storage architecture and optimize existing deployments.

### Optimize storage utilization

The data retrieval and data storage operations can have a significant impact on both energy and hardware efficiency. Designing solutions with the correct data access pattern can reduce energy consumption and embodied carbon.

* Understand the needs of your application to [choose the appropriate storage](/azure/aks/operator-best-practices-storage#choose-the-appropriate-storage-type) and define it using [storage classes](/azure/aks/operator-best-practices-storage#create-and-use-storage-classes-to-define-application-needs) to avoid storage underutilization. Additionally, consider [provisioning volumes dynamically](/azure/aks/operator-best-practices-storage#dynamically-provision-volumes) to automatically scale the number of storage resources.

## Network and connectivity

Explore this section to learn how to enhance and optimize network efficiency to reduce unnecessary carbon emissions.

### Choose a region that is closest to users

The distance from a data center to the users has a significant impact on energy consumption and carbon emissions. Shortening the distance a network packet travels improves both your energy and carbon efficiency.

* Review your application requirements and [Azure geographies](https://azure.microsoft.com/explore/global-infrastructure/geographies/#overview) to choose a region that is the closest to the majority of where the network packets are going.

### Reduce network traversal between nodes

Placing nodes in a single region or a single availability zone reduces the physical distance between the instances. However, for business critical workloads, you need to ensure your cluster is spread across multiple availability-zones, which may result in more network traversal and increase in your carbon footprint.

* Consider deploying your nodes within a [proximity placement group](/azure/virtual-machines/co-location) to reduce the network traversal by ensuring your compute resources are physically located close to each other. For critical workloads configure [proximity placement groups with availability zones](/azure/aks/reduce-latency-ppg#configure-proximity-placement-groups-with-availability-zones).

### Evaluate using a service mesh

A service mesh deploys additional containers for communication, typically in a [sidecar pattern](/azure/architecture/patterns/sidecar), to provide more operational capabilities leading to an increase in CPU usage and network traffic. Nevertheless, it allows you to decouple your application from these capabilities as it moves them out from the application layer, and down to the infrastructure layer.

* Carefully consider the increase in CPU usage and network traffic generated by [service mesh](/azure/aks/servicemesh-about) communication components before making the decision to use one.

### Optimize log collection

Sending and storing all logs from all possible sources (workloads, services, diagnostics and platform activity) can considerably increase storage and network traffic, which would impact higher costs and carbon emissions.

* Make sure you are collecting and retaining only the log data necessary to support your requirements. [Configure data collection rules for your AKS workloads](/azure/azure-monitor/containers/container-insights-agent-config#data-collection-settings) and implement design considerations for [optimizing your Log Analytics costs](/azure/architecture/framework/services/monitoring/log-analytics/cost-optimization).

### Cache static data

Using Content Delivery Network (CDN) is a sustainable approach to optimizing network traffic because it reduces the data movement across a network. It minimizes latency through storing frequently read static data closer to users, and helps reduce network traffic and server load.

* Ensure you [follow best practices](/azure/architecture/best-practices/cdn) for CDN and consider using [Azure CDN](/azure/cdn/cdn-how-caching-works?toc=%2Fazure%2Ffrontdoor%2FTOC.json) to lower the consumed bandwidth and keep costs down.

## Security

Explore this section to learn more about the recommendations leading to a sustainable, right-sized security posture.

### Evaluate whether to use TLS termination

Transport Layer Security (TLS) ensures that all data passed between the web server and web browsers remain private and encrypted. However, terminating and re-establishing TLS increases CPU utilization and might be unnecessary in certain architectures. A balanced level of security can offer a more sustainable and energy efficient workload, while a higher level of security may increase the compute resource requirements.

* Review the information on TLS termination when using [Application Gateway](/azure/application-gateway/ssl-overview) or [Azure Front Door](/azure/application-gateway/ssl-overview). Consider if you can terminate TLS at your border gateway and continue with non-TLS to your workload load balancer and onwards to your workload.

### Use cloud native network security tools and controls

Azure Font Door and Application Gateway help manage traffic from web applications while Azure Web Application Firewall provides protection against OWASP top 10 attacks and load shedding bad bots. Using these capabilities helps remove unnecessary data transmission and reduces the burden on the cloud infrastructure, with lower bandwidth and less infrastructure requirements.

* Use [Application Gateway Ingress Controller (AGIC) in AKS](/azure/architecture/example-scenario/aks-agic/aks-agic) to filter and offload traffic at the network edge from reaching your origin to reduce energy consumption and carbon emissions.

### Scan for vulnerabilities

Many attacks on cloud infrastructure seek to misuse deployed resources for the attacker's direct gain leading to an unnecessary spike in usage and cost. Vulnerability scanning tools help minimize the window of opportunity for attackers and mitigate any potential malicious usage of resources.

* Follow recommendations from [Microsoft Defender for Cloud](/security/benchmark/azure/security-control-vulnerability-management) and run automated vulnerability scanning tools such as [Defender for Containers](/azure/defender-for-cloud/defender-for-containers-va-acr) to avoid unnecessary resource usage by identifying vulnerabilities in your images and minimizing the window of opportunity for attackers.

## Next steps

> [!div class="nextstepaction"]
> [Azure Well-Architected Framework review of AKS](/azure/architecture/framework/services/compute/azure-kubernetes-service/azure-kubernetes-service)
