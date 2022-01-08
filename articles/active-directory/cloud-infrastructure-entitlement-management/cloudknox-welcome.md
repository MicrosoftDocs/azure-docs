---
title: Welcome to Microsoft CloudKnox Permissions Management 
description: Introduction to Microsoft CloudKnox Permissions Management installation.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: overview
ms.date: 01/07/2022
ms.author: v-ydequadros
---

# Welcome to Microsoft CloudKnox Permissions Management 

 Microsoft CloudKnox Permissions Management (CloudKnox) is a multi-cloud, hybrid cloud permissions management platform that provide granular visibility, automated remediation, and continuous monitoring consistently, enforcing least-privilege principles to reduce risk. 

CloudKnox offers complete visibility into privileged access. It helps organizations right-size permissions and consistently enforce least-privilege principles to reduce risk, and it employs continuous analytics to help prevent security breaches and ensure compliance. 

One Platform To Manage All Permissions Across All Clouds

- **Visibility**: Gain insights into effective permissions of all identities, and their usage.
 - **Remediation**: Provision Just Enough Permissions (JEP) with On Demand and JIT with the click of a button 
- **Monitoring**: Continuously monitor activity, alert on anomalies and measure sprawl with the Privilege Creep Index (PCI).

 CloudKnox enables you to:

- Evaluate where you are today and where you need to be to meet your risk mitigation goals.
- Identify the areas of greatest risk for mitigation so you know where to focus your resources.
- Improve your risk posture with actionable insights and prescriptive recommendations.

CloudKnox works with Azure, as well as the AWS and Google public clouds

 **Installation takes about 30 minutes.**

## How to install Sentry

- For information on how to install Sentry, select the link for the appropriate cloud service provider.

- [Amazon Web Services (AWS)](https://docs.cloudknox.io/Product%20Documentation%2098db130474114c96be4b3c4f27a0b297/Sentry%20Installation%20-%20AWS%20bef8e66cf2834aa69867b628f4b0a203.html)
- [Microsoft Azure](https://docs.cloudknox.io/Product%20Documentation%2098db130474114c96be4b3c4f27a0b297/Sentry%20Installation%20-%20Azure%20905a96e3a86844dfa1f952ecc8b6cfbc.html)
- [Google Cloud Platform (GCP)](https://docs.cloudknox.io/Product%20Documentation%2098db130474114c96be4b3c4f27a0b297/Sentry%20Installation%20-%20GCP%205335bc39eca14e0592d7282ab48ba479.html)


## What's new

### The CloudKnox dashboard

CloudKnox provides a visual, operational dashboard that summarizes and
updates key statistics and data about an authorization system hourly. This dashboard is available for Amazon Web Services (AWS), Google Cloud Platform (GCP), Microsoft Azure, and vCenter Server virtual machine.  

This data displays metrics related to avoidable risk and contains the following information:

- **Privilege Creep Index** gauge/chart - The gauge identifies how many high-risk privileges have been granted to users and aren't being used. The chart conveys how many users contribute to the PCI score, and where they're on the scale.

- **Usage analytics summary** – A snapshot of permission metrics within the last 90 days.

These metrics enable CloudKnox administrators to quickly and easily identify areas in which they can reduce risks related to the principle of least privilege.

### Privilege Creep Index (PCI)

The PCI is an indicator of an organization's level of exposure to insider threat risks and their ability to enforce the **Principle of least privilege (POLP)**, which is one of the most fundamental and essential concepts in security.  

PCI measures the number of unused high-risk privileges that have been granted to all unique identities. It also takes into account the number of resources that an identity has access to but hasn't touched over the last 90 days.

PCI scores of 100 represent the highest risk to the organization. They indicate a high percentage of identities with excessive high-risk privileges and broad access to cloud resources, some of which may be unnecessary to the user.

A zero score represents the lowest risk.

<!---## Next steps--->