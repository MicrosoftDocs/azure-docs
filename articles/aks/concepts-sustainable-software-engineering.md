---
title: Concepts - Sustainable software engineering in Azure Kubernetes Services (AKS)
description: Learn about sustainable software engineering in Azure Kubernetes Service (AKS).
services: container-service
ms.topic: conceptual
ms.date: 03/29/2021
---

# Sustainable software engineering practices in Azure Kubernetes Service (AKS)

The sustainable software engineering principles are a set of competencies to help you define, build, and run sustainable applications. The overall goal is to reduce the carbon footprint in every aspect of your application. The Azure Well-Architected Framework workload for sustainability aligns with the [The Principles of Sustainable Software Engineering](https://principles.green/) from the [Green Software Foundation](https://greensoftware.foundation/) and has an overview of the principles of sustainable software engineering.

Sustainable software engineering is a shift in priorities and focus. In many cases, the way most software is designed and run highlights fast performance and low latency. Meanwhile, sustainable software engineering focuses on reducing as much carbon emission as possible. Consider:

* Applying sustainable software engineering principles can give you faster performance or lower latency, such as by lowering total network traversal.
* Reducing carbon emissions may cause slower performance or increased latency, such as delaying low-priority workloads.

The guidance found in this article is focused on Azure Kubernetes Services you're building or operating on Azure and includes design and configuration checklists, recommended design, and configuration options. Before applying sustainable software engineering principles to your application, review the priorities, needs, and trade-offs of your application. 

## Prerequisites
* Understanding the Well-Architected Framework workload for sustainability guidance can help produce a high quality, stable, and efficient cloud architecture. We recommend that you start by reading more about [sustainable workloads](/azure/architecture/framework/sustainability/sustainability-get-started) and reviewing your workload using the [Microsoft Azure Well-Architected Review](https://aka.ms/assessments) assessment.

* Having clearly defined business requirements is crucial when building applications as they might have a direct impact on both cluster and workload architectures and configurations. Review the Well-Architected Framework workload for sustainability design areas alongside your application's holistic lifecycle when building or updating existing applications.

## Design checklist

We recommend careful consideration of these application design patterns for building a sustainable workload on Azure Kubernetes Services before reviewing the detailed recommendations in each of the design areas.

| Design pattern | Applies to workload | Applies to cluster |
| --- | --- | --- |
| [Design for independent scaling of logical components](#design-for-independent-scaling-of-logical-components) | ✔️ |  |
| [Design for event-driven scaling](#design-for-event-driven-scaling) | ✔️ |  |
| [Aim for stateless design](#aim-for-stateless-design) | ✔️ |  |
| [Containerize your workload where applicable](#containerize-your-workload-where-applicable) | ✔️ |  |
| [Enable cluster and node auto-updates](#enable-cluster-and-node-auto-updates) |  | ✔️ |
| [Use spot nodes when possible](#use-spot-node-pools-when-possible) |  | ✔️ |
| [Choose a region that is closest to users](#choose-a-region-that-is-closest-to-users) | | ✔️ |
| [Reduce network traversal between nodes](#reduce-network-traversal-between-nodes) | | ✔️ |
| [Evaluate using a service mesh](#evaluate-using-a-service-mesh) | | ✔️ |
| [Match the scalability needs and utilize auto-scaling and bursting capabilities](#match-the-scalability-needs-and-utilize-auto-scaling-and-bursting-capabilities) |  | ✔️ |
| [Use spot node pools when possible](#use-spot-node-pools-when-possible) |  | ✔️ |
| [Install supported add-ons and extensions](#install-supported-add-ons-and-extensions) | ✔️ | ✔️ |
| [Turn off workloads and node pools outside of business hours](#turn-off-workloads-and-node-pools-outside-of-business-hours) | ✔️ | ✔️ |
| [Delete unused resources](#delete-unused-resources) | ✔️ | ✔️ |
| [Tag your resources](#tag-your-resources) | ✔️ | ✔️ |
| [Automate cluster management and application delivery](#automate-cluster-management-and-application-delivery) | ✔️ | ✔️ |
| [Optimize storage utilization](#optimize-storage-utilization) | ✔️ | ✔️ |
| [Cache static data](#cache-static-data) | ✔️ | ✔️ |
| [Evaluate whether to use TLS termination](#evaluate-whether-to-use-tls-termination) | ✔️ | ✔️ |
| [Use cloud native network security tools and controls](#use-cloud-native-network-security-tools-and-controls) | ✔️ | ✔️ |
| [Scan for vulnerabilities](#scan-for-vulnerabilities) | ✔️ | ✔️ |

## Application design

Explore this section to know more about how to optimize your applications for a more sustainable application design.

### Design for independent scaling of logical components

A microservice architecture may reduce the compute resources required as it allows for independent scaling and ensures idle components are scaled accordingly to the demand. 

* Consider building your [CNCF projects on AKS](/azure/architecture/example-scenario/apps/build-cncf-incubated-graduated-projects-aks) and separating your application functionality into different microservices by using [Dapr](https://dapr.io/) to allow independent scaling of logical components.

### Design for event-driven scaling

Scaling your workload based on relevant business metrics such as HTTP requests, queue length, and cloud events can help reduce its resource utilization, hence its carbon emissions. 

* Use [Keda](https://keda.sh/) when building event-driven applications to allow scaling down to zero when there is no demand. 

### Aim for stateless design

Reducing in-memory or on-disk data required by the workload to function can be achieved by using an Azure platform as a service (PaaS) to store the service state. 

* Consider [stateless design](/azure/aks/operator-best-practices-multi-region#remove-service-state-from-inside-containers) to reduce unnecessary network load, data processing, and compute resources.

## Application platform

Explore this section to learn how to make better informed platform-related decisions around sustainability.

### Enable cluster and node auto-updates 

An up-to-date cluster avoids unnecessary performance issues and ensures you benefit from the latest performance improvements and energy optimizations.

* Enable [cluster auto-upgrade](/azure/aks/auto-upgrade-cluster) and [apply security updates to nodes automatically using GitHub Actions](/azure/aks/node-upgrade-github-actions) to ensure your cluster don’t miss the latest improvements.

### Install supported add-ons and extensions

Add-ons and extensions covered by the [AKS support policy](/azure/aks/support-policies) provide additional and supported functionality to your cluster while allowing you to benefit from the latest performance improvements and energy optimizations alongside your cluster lifecycle.

* Ensure you install [Keda](/azure/aks/integrations#available-add-ons) as an add-on and [Draft](/azure/aks/cluster-extensions?tabs=azure-cli#currently-available-extensions) as an extension.

### Containerize your workload where applicable

Containers allow for reducing unnecessary resource allocation and making better use of the resources deployed as they allow for bin packing and require less compute resources than virtual machines.

* Use [Draft](/azure/aks/draft) to simplify application containerization by generating Dockerfiles and Kubernetes manifests.

### Use spot node pools when possible 

Spot nodes use Spot VMs and are great for workloads that can handle interruptions, early terminations, or evictions such as batch processing jobs and development and testing environments. 

* Use [spot node pools](/azure/aks/spot-node-pool) to take advantage of unused capacity in Azure at a significant cost saving for a more sustainable platform design.

### Turn off workloads and node pools outside of business hours 

Workloads may not need to run continuously and could be turned off to reduce energy waste hence carbon emissions. You can completely turn off (stop) your node pools in your AKS cluster, allowing you to also save on compute costs.

* Use the [KEDA CRON scaler](https://keda.sh/docs/2.7/scalers/cron/) to turn off your node pools outside of business hours.

### Match the scalability needs and utilize auto-scaling and bursting capabilities 

An oversized cluster does not maximize compute resources utilization and can lead to a waste of energy. Separate your applications into different node pools to allow for cluster right sizing and independent scaling according to the application requirements. As you run out of capacity in your AKS cluster, burst from AKS to ACI to scale out additional pods to serverless nodes and ensure your wokload use all the allocated resources efficiently.

* Size your cluster to match the scalability needs of your application and [use cluster autoscaler](/azure/aks/cluster-autoscaler) in combination with [virtual nodes](/azure/aks/virtual-nodes) to rapidly scale and maximize compute resources utilization. Additionally, [enforce resource quotas](/azure/aks/operator-best-practices-scheduler#enforce-resource-quotas) at the namespace level and [scale user node pools to 0](/azure/aks/scale-cluster?tabs=azure-cli#scale-user-node-pools-to-0) when there is no demand.

## Operational procedures

Explore this section to set up your environment for measuring and continuously improving your workloads' cost and carbon efficiency.

### Delete unused resources 

Unused resources such as unreferenced images and storage resources should be identified and deleted as they have a direct impact on hardware and energy efficiency. Identifying and deleting unused resources msut be treated as a process, rather than a point-in-time activity to ensure continuous energy optimization. 

* Use [Azure Advisor](/azure/advisor/advisor-cost-recommendations) to identify unused resources and [ImageCleaner](/azure/aks/image-cleaner?tabs=azure-cli) to clean up stale images and remove an area of risk in your cluster.

### Tag your resources

Getting the right information and insights at the right time is important for producing reports about emissions.

* Set [Azure tags on your cluster](/azure/aks/use-tags) to track resources for carbon emissions.

### Automate cluster management and application delivery

Sustainable operations such as automating cluster amangement and application delivery iare on of the many paths towards carbon footprint reduction. Rather than having direct access and operating the cluster manually, most operations should happen through code changes that can be reviewed and audited.

* Leverage [GitOps for Azure Kubernetes Services](/azure/architecture/example-scenario/gitops-aks/gitops-blueprint-aks) as an operational framework for your cluster and application lifecycles to apply energy efficient development practices like CI/CD.

## Storage
Explore this section to learn how to design a more sustainable data storage architecture and optimize existing deployments.

### Optimize storage utilization 

The data retrieved and its storage can have a significant impact on both energy and carbon efficiency. Designing solutions with the correct data access pattern can reduce energy consumption and embodied carbon.

* Understand the needs of your application to [choose the appropriate storage](/azure/aks/operator-best-practices-storage#choose-the-appropriate-storage-type) and define it using [storage classes](/azure/aks/operator-best-practices-storage#create-and-use-storage-classes-to-define-application-needs) to avoid storage underutilization. Additionally, consider [provisioning volumes dynamically](/azure/aks/operator-best-practices-storage#dynamically-provision-volumes) to automatically scale the number of storage resources.

## Network and connectivity
Explore this section to learn how to enhance and optimize network efficiency to reduce unnecessary carbon emissions.

### Choose a region that is closest to users

The distance from a data center to the users has a significant impact on energy consumption and carbon emissions. Shortening the distance a network packet travels improves both your energy and carbon efficiency. 

* Review your application requirements and [Azure geographies](https://azure.microsoft.com/en-us/explore/global-infrastructure/geographies/#overview) to choose a region that is the closest to the majority of where the network packets are going.

### Reduce network traversal between nodes

Placing nodes in a single region or a single availability zone reduces the physical distance between the instances. However, as the Azure footprint grows, a single availability zone may span multiple physical data centers, which may result in more network traversal and increase in your carbon footprint. 

* Consider deploying your nodes within a [proximity placement group](/azure/virtual-machines/co-location) to reduce the network traversal by ensuring your compute resources are physically located close to each other.

### Evaluate using a service mesh 

A service mesh deploys additional containers for communication (sidecars) to provide more operational capabilities leading to CPU usage and network traffic increase. Nevertheless, it allows your application for decoupling from these capabilities as it moves them out of the application layer, and down to the infrastructure layer.

* Carefully consider the increase in CPU usage and network traffic generated by the [service mesh](/azure/aks/servicemesh-about) communication components before making the decision to use such service.

### Cache static data

Using Content Delivery Network (CDN) is a sustainable approach to optimizing network traffic because it reduces the data movement across a network. It minimizes latency through storing frequently read static data closer to users, and helps reduce the network traversal and server load.

* Ensure you [follow best practices](/azure/architecture/best-practices/cdn) for CDN and consider using [Azure CDN](/azure/cdn/cdn-how-caching-works?toc=%2Fazure%2Ffrontdoor%2FTOC.json) to lower the consumed bandwidth and keep costs down.

## Security
Explore this section to know more about the recommendations leading to a more sustainable security posture.

### Evaluate whether to use TLS termination

Transport Layer Security (TLS) ensures that all data passed between the web server and browsers remain private and encrypted. However, terminating and re-establishing TLS is CPU consumption and might be unnecessary in certain architectures. A balanced level of security can offer a more sustainable and energy efficient workload while a higher level of security may increase the requirements of compute resources.

*  Review the information on TLS termination when using [Application Gateway](/azure/application-gateway/ssl-overview) or [Azure Front Door](/azure/application-gateway/ssl-overview) and consider if you can terminate TLS at your border gateway and continue with non-TLS to your workload load balancer and onwards to your workload.

### Use cloud native network security tools and controls

Azure Font Door and Application Gateway help manage traffic from web applications while Azure Web Application Firewall provides protection against OWASP top 10 attacks and load shedding bad bots. Using these capabilities helps remove unnecessary data transmission and reduce the burden on the cloud infrastructure, with lower bandwidth and less infrastructure requirements.

* Use [Application Gateway Ingress Controller (AGIC) in AKS](/azure/architecture/example-scenario/aks-agic/aks-agic) to filter and offload traffic at the network edge from reaching your origin to reduce energy consumption and carbon emissions.

### Scan for vulnerabilities

Many attacks on cloud infrastructure seek to misuse deployed resources for the attacker's direct gain leading to an unnecessary spike in usage and cost. Vulnerability scanning tools help minimize the window of opportunity for attackers and mitigate any potential malicious usage of resources.

* Follow recommendations from [Microsoft Defender for Cloud](/security/benchmark/azure/security-control-vulnerability-management) and run automated vulnerability scanning tools such as [Defender for Containers](/azure/defender-for-cloud/defender-for-containers-va-acr) to avoid unnecessary resource usage by identifying vulnerabilities in your images and minimizing the window of opportunity for attackers.
