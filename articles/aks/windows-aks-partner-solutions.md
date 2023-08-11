---
title: Windows AKS Partner Solutions
titleSuffix: Windows Server Container Partner Solutions
description: Find partner-tested solutions that enable you to build, test, deploy, manage and monitor your Windows-based apps on Windows containers on AKS.
ms.topic: article
ms.date: 08/04/2023
---

# Windows AKS Partners Solutions

Microsoft has collaborated with partners to ensure your build, test, deployment, configuration, and monitoring of your applications perform optimally with Windows containers on AKS.  

Our 3rd party partners featured below have published introduction guides to start using their solutions with your applications running on Windows containers on AKS.

| Solutions          | Partners                                            |
|--------------------|-----------------------------------------------------|
| DevOps             | [GitLab](#gitlab) <br> [CircleCI](#circleci)        |
| Networking         | [NGINX](#f5-nginx) <br> [Calico](#calico)           |
| Observability      | [Datadog](#datadog) <br> [New Relic](#new-relic)    |
| Security           | [Prisma Cloud](#prisma-cloud)                                   |
| Storage            | [NetApp](#netapp)                                   |
| Config Management  | [Chef](#chef)                                       |


## DevOps 

DevOps streamlines the delivery process, improves collaboration across teams, and enhances software quality, ensuring swift, reliable, and continuous deployment of your Windows-based applications. 

### GitLab 

The GitLab DevSecOps Platform supports the Microsoft development ecosystem with performance, accessibility testing, SAST, DAST and Fuzzing security scanning, dependency scanning, SBOM, license management and more. 

As an extensible platform, GitLab also allows you to plug in your own tooling for any stage. GitLab's integration with Azure Kubernetes Services (AKS) enables full DevSecOps workflows for Windows and Linux Container workloads using either Push CD or GitOps Pull CD with flux manifests. Using Cloud Native Buildpaks, GitLab Auto DevOps can build, test and autodeploy OSS .NET projects.

To learn more, please our see our [joint blog](https://techcommunity.microsoft.com/t5/containers/using-gitlab-to-build-and-deploy-windows-containers-on-azure/ba-p/3889929).

### CircleCI 

CircleCI’s integration with Azure Kubernetes Services (AKS) allows you to automate, build, validate, and ship containerized Windows applications, ensuring faster and more reliable software deployment. You can easily integrate your pipeline with AKS using CircleCI orbs, which are prepacked snippets of YAML configuration.  
 
Follow this [tutorial](https://techcommunity.microsoft.com/t5/containers/continuous-deployment-of-windows-containers-with-circleci-and/ba-p/3841220) to learn how to set up a CI/CD pipeline to build a Dockerized ASP.NET application and deploy it to an AKS cluster. 

## Networking 

Ensure efficient traffic management, enhanced security, and optimal network performance with these solutions to achieve smooth application connectivity and communication. 

### F5 NGINX 

NGINX Ingress Controller deployed in AKS, on-premises, and in the cloud implements unified Kubernetes-native API gateways, load balancers, and Ingress controllers to reduce complexity, increase uptime, and provide in-depth insights into app health and performance for containerized Windows workloads. 

Running at the edge of a Kubernetes cluster, NGINX Ingress Controller ensures holistic app security with user and service identities, authorization, access control, encrypted communications, and additional NGINX App Protect modules for Layer 7 WAF and DoS app protection. 

Learn how to manage connectivity to your Windows applications running on Windows nodes in a mixed-node AKS cluster with NGINX Ingress controller in this [blog](https://techcommunity.microsoft.com/t5/containers/improving-customer-experiences-with-f5-nginx-and-windows-on/ba-p/3820344). 

### Calico 

Tigera provides an active security platform with full-stack observability for containerized workloads and Microsoft AKS as a fully managed SaaS (Calico Cloud) or a self-managed service (Calico Enterprise). The platform prevents, detects, troubleshoots, and automatically mitigates exposure risks of security breaches for workloads in Microsoft AKS.   

Its open-source offering, Calico Open Source, is the most widely adopted container networking and security solution. It specifies security and observability as code to ensure consistent enforcement of security policies, which enables DevOps, platform, and security teams to protect workloads, detect threats, achieve continuous compliance, and troubleshoot service issues in real-time.  

To learn more, [click here](https://techcommunity.microsoft.com/t5/containers/securing-windows-workloads-on-azure-kubernetes-service-with/ba-p/3815429). 

## Observability 

Observability provides deep insights into your systems, enabling rapid issue detection and resolution to enhance your application’s reliability and performance. 

### Datadog 

Datadog is the essential monitoring and security platform for cloud applications. We bring together end-to-end traces, metrics, and logs to make your applications, infrastructure, and third-party services entirely observable. Partner with Datadog for Windows on AKS environments to streamline monitoring, proactively resolve issues, and optimize application performance and availability.  

Get started by following the recommendations in our [joint blog](https://techcommunity.microsoft.com/t5/containers/gain-full-observability-into-windows-containers-on-azure/ba-p/3853603). 

### New Relic 

New Relic's Azure Kubernetes integration is a powerful solution that seamlessly connects New Relic's monitoring and observability capabilities with Azure Kubernetes Service (AKS). By deploying the New Relic Kubernetes integration, users gain deep insights into their AKS clusters' performance, health, and resource utilization. This integration allows users to efficiently manage and troubleshoot containerized applications, optimize resource allocation, and proactively identify and resolve issues in their AKS environments. With New Relic's comprehensive monitoring and analysis tools, businesses can ensure the smooth operation and optimal performance of their Kubernetes workloads on Azure. 

Check this [blog](https://techcommunity.microsoft.com/t5/containers/persistent-storage-for-windows-containers-on-azure-kubernetes/ba-p/3836781) for detailed information. 

## Security 

Ensure the integrity and confidentiality of applications, thereby fostering trust and compliance across your infrastructure. 

### Prisma Cloud

Prisma Cloud is a comprehensive Cloud-Native Application Protection Platform (CNAPP) tailor-made to help secure Windows containers on Azure Kubernetes Service (AKS). Gain continuous, real-time visibility and control over Windows container environments including vulnerability and compliance management, identities and permissions, and AI-assisted runtime defense. Integrated container scanning across the pipeline and in Azure Container Registry ensure security throughout the entire application lifecycle.  

See [our guidance](https://techcommunity.microsoft.com/t5/containers/unlocking-new-possibilities-with-prisma-cloud-and-windows/ba-p/3866485) for more details. 

## Storage 

Storage enables standardized and seamless storage interactions, ensuring high application performance and data consistency. 

### NetApp 

Astra Control provides application data management for stateful workloads on Azure Kubernetes Service (AKS). Discover your apps and define protection policies that automatically back up workloads offsite. Protect, clone, and move applications across Kubernetes environments with ease. 

Follow the steps provided in [this blog](https://techcommunity.microsoft.com/t5/containers/persistent-storage-for-windows-containers-on-azure-kubernetes/ba-p/3836781) post to dynamically provision SMB volumes for Windows AKS workloads. 

## Config management 

Automate and standardize the system settings across your environments to enhance efficiency, reduce errors, and ensuring system stability and compliance. 

### Chef 

Chef provides visibility and threat detection from build to runtime that monitors, audits, and remediates the security of your Azure cloud services and Kubernetes and Windows container assets. Chef provides comprehensive visibility and continuous compliance into your cloud security posture and helps limit the risk of misconfigurations in cloud-native environments by providing best practices based on CIS, STIG, SOC2, PCI-DSS and other benchmarks. This is part of a broader compliance offering that supports on-premises or hybrid cloud environments including applications deployed on the edge. 

To learn more about Chef’s capabilities, check out the comprehensive ‘how-to’ blog post here: [Securing Your Windows Environments Running on Azure Kubernetes Service with Chef](https://techcommunity.microsoft.com/t5/containers/securing-your-windows-environments-running-on-azure-kubernetes/ba-p/3821830). 