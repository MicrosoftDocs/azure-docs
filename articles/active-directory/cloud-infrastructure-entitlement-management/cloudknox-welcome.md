---
title: Welcome to the Microsoft CloudKnox Permissions Management installation
description: Introduction to Microsoft CloudKnox Permissions Management installation.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 12/16/2021
ms.author: v-ydequadros
---

# Install Microsoft CloudKnox Permissions Management Sentry 

Microsoft CloudKnox Permissions Management Sentry collects the privileges and activity data of all unique identities that can touch the infrastructure from each cloud platform. It then uploads the data to the Software as a Service (SaaS) portal.

The CloudKnox solution requires one Sentry appliance per cloud platform.

 **Installation takes about 30 minutes.**

## How to install Sentry

- For information on how to install Sentry, select the link for the appropriate cloud service provider.

- [Amazon Web Services (AWS)](https://docs.cloudknox.io/Product%20Documentation%2098db130474114c96be4b3c4f27a0b297/Sentry%20Installation%20-%20AWS%20bef8e66cf2834aa69867b628f4b0a203.html)
- [Microsoft Azure](https://docs.cloudknox.io/Product%20Documentation%2098db130474114c96be4b3c4f27a0b297/Sentry%20Installation%20-%20Azure%20905a96e3a86844dfa1f952ecc8b6cfbc.html)
- [Google Cloud Platform (GCP)](https://docs.cloudknox.io/Product%20Documentation%2098db130474114c96be4b3c4f27a0b297/Sentry%20Installation%20-%20GCP%205335bc39eca14e0592d7282ab48ba479.html)
- [vCenter](https://docs.cloudknox.io/Product%20Documentation%2098db130474114c96be4b3c4f27a0b297/Sentry%20Installation%20-%20vCenter%20ed8f594160c341aba63b3a50b0d08d34.html)

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