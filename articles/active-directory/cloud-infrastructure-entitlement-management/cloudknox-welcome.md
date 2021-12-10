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
ms.date: 12/10/2021
ms.author: v-ydequadros
---

# Welcome to the Microsoft CloudKnox Permissions Management installation 

Microsoft CloudKnox Permissions Management Sentry collects the privileges and activity data of all unique identities that can touch the infrastructure from each cloud platform and uploads the data to the Software as a Service (SaaS) portal.

If you are new to Microsoft CloudKnox Permissions Management, our solution requires one Sentry appliance per cloud platform.

 **Installation takes about 30 minutes.**

## How to install Sentry as your cloud service provider

- To open the Sentry installation page** for the appropriate cloud service provider, click:

    <p>
    <a class="md-button sentry-install-button md-button-spacing aws-sentry-install-button" href="sentry-install-aws/">
        <span class="sentry-install-button__wrapper">
            <span>AWS</span>
        </span>
        </a>
    </p><p>
        <a class="md-button sentry-install-button md-button-spacing azure-sentry-install-button" href="sentry-install-azure/">
        <span class="sentry-install-button__wrapper">
            <span>Azure</span>
        </span>
        </a>
    </p><p>
        <a class="md-button sentry-install-button md-button-spacing gcp-sentry-install-button" href="sentry-install-gcp/">
        <span class="sentry-install-button__wrapper">
            <span>GCP</span>
        </span>
        </a>
    </p><p>
        <a class="md-button sentry-install-button vcenter-sentry-install-button" href="sentry-install-vcenter/">
        <span class="sentry-install-button__wrapper">
            <span>vCenter</span>
        </span>
        </a>
    </p>

    <div class="hr hr-spacing"></div>

## What's new

### The CloudKnox dashboard

CloudKnox provides a visual, operational dashboard that summarizes and
updates key statistics and data about an authorization system on an hourly basis. This dashboard is available for Amazon Web Services (AWS), Google Cloud Platform (GCP), Microsoft Azure, and vCenter Server virtual machine.  

This data displays metrics related to avoidable risk, and allows the CloudKnox administrator to quickly and easily identify areas in which risk can be reduced in regards to the principle of least privilege. It contains the following information:

- **Privilege Creep Index** gauge/chart - The gauge identifies how many high-risk privileges have been granted to users and in which are not being utilized, and the chart conveys how many users are contributing to the privilege creep index and where they are on the scale.

- **Usage analytics summary** – A snapshot of permission metrics within the last 90 days.

### Privilege Creep Index (PCI)

The PCI is an indicator of an organization's level of exposure to insider threat risks and their ability to enforce the **Principle of least privilege (POLP)**, which is one of the most fundamental and essential concepts in security.  

PCI measures the number of unused high-risk privileges that have been granted to all unique identities. It also takes into account the number of resources that an identity has access to but has not touched over the last 90 days.   

A PCI score of 100 represents the highest risk to the organization and zero represents the lowest risk. A high risk indicates that a high percentage of identities are assigned excessive high-risk privileges and broad, but unnecessary, access to cloud resources.

<!---## Next steps--->