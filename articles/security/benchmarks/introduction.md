---
title: Azure Security Benchmark Introduction
description: Security Benchmark introduction
author: msmbaldwin
manager: rkarlin

ms.service: security
ms.topic: conceptual
ms.date: 12/16/2019
ms.author: mbaldwin
ms.custom: security-benchmark

---

# Azure security benchmark introduction

You may have several years or even decades of experience with on-premises computing. You know how to secure those deployments; but the cloud is different. How do you know if your cloud deployments are secure? What are the differences between security practices for on-premises systems and cloud deployments? 

There is a large collection of white papers, best practices, reference architectures, web guidance, open-source tools, commercial solutions, intelligence feeds, and more, that can be used to help secure the cloud. Which option should you use? What can you do to get an acceptable level of security in the cloud? 

One of the best ways to secure your cloud deployments is to focus on cloud security benchmark recommendations. Benchmark recommendations, for securing any service, begin with a fundamental understanding of cybersecurity risk and how to manage it. You can then use this understanding by adopting benchmark security recommendations from your cloud service provider to help select specific security configuration settings in your environment. 

The Azure Security Benchmark includes a collection of high-impact security recommendations you can use to help secure most of the services you use in Azure. You can think of these recommendations as "general" or "organizational" as they are applicable to most Azure services. The Azure Security Benchmark recommendations are then customized for each Azure service, and this customized guidance is contained in service baseline articles. 

ASB can be used to address these two common challenges:

- Customers or service partners who are new to Azure and are looking for Azure security best practices at the overarching or individual service level. ASB provides a consistent structure and user experiences across the different Azure services. 

- Customers who are from highly regulated industries such as government, financial institutions (or service vendors who need to build systems for these customers) and need to evaluate Azure's security capability  based on an industry framework such as CIS/NIST/PCI. ASB provides an efficient approach with the controls already pre-mapped to these industry benchmarks. 

The Azure Security Benchmark documentation specifies security controls and service baselines. 

- **Security Controls**: The Azure Security Benchmark recommendations are categorized by security controls. Security controls represent high-level vendor-agnostic security requirements, such as network security and data protection. Each security control has a set of security recommendations and instructions that help you implement those recommendations. 

- **Service Baseline**: When available, Benchmark recommendations for Azure services will include Azure Security Benchmark recommendations that are tailored specifically for that service. 

The terms "Control", "Benchmark", and "Baseline" are used often in the Azure Security Benchmark documentation and it's important to understand how Azure uses those terms. 

| Term | Description | Example |
|--|--|--|
| Control | A control is a high-level description of a feature or activity that needs to be addressed and is not specific to a technology or implementation. | Data Protection is one of the security controls. This control contains specific actions that need to be addressed to help ensure data is protected. |
| Benchmark | A benchmark contains security recommendations for a specific technology, such as Azure. The recommendations are categorized by the control to which they belong. | The Azure Security benchmark comprises the security recommendations specific to the Azure platform |
| Baseline | A baseline is the security requirements for an organization. The security requirements are based on benchmark recommendations. Each organization decides which benchmark recommendations to include in their baseline. | The Contoso company creates its security baseline by choosing to require specific recommendations in the Azure Security Benchmark. |

We welcome your feedback on the Azure Security Benchmark! We encourage you to provide comments in the feedback area below. If you prefer to share your input more privately with the Azure Security Benchmark team, you are welcome to fill out the form at https://aka.ms/AzSecBenchmark 
