---
title: Microsoft CloudKnox Permissions Management dashboard
description: How to use the Microsoft CloudKnox Permissions Management dashboard.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: overview
ms.date: 01/03/2022
ms.author: v-ydequadros
---

# Microsoft CloudKnox Permissions Management dashboard

The Microsoft CloudKnox Permissions Management dashboard provides an overview of the authorization system and account activity being monitored. 

This topic provides an overview of the components of the CloudKnox dashboard.

- **Authorization system types** - A drop down list of authorization system types you can access. May include Amazon Web Services (AWS), Microsoft Azure (Azure), Google Cloud Platform (GCP), and so on.
 
- **Authorization systems** - Displays a **List** of accounts and **Folders** in the selected authorization system you can access.

- **Privilege Creep Index (PCI)** - A graph displaying the **# of Identities contributing to PCI** and the related PCI.
    - The graph displays a bubble in the upper-right corner with the the number of identities that are considered high risk. *High risk* refers to the number of users who have permissions that exceed their normal or required usage.
    - To display a list of the number of identities contributing to the **Low PCI**, **Medium PCI**, and **High PCI**, select the list icon in the upper-right of the graph.
    - To display the PCI graph again, select the graph icon in the upper-right of the list box. 

- **Highest PCI change** - A list of your accounts, the PCI, and the change in the PCI over the past 7 days.
    - To download the list, select the down arrow in the upper-right of the list box.

        The following message displays: **We'll email you a link to download the file.** 
        - Check your email for the message from the [CloudKnox Customer Success Team](reports@cloudknox.io) which contains a link to the **PCI History** report in Microsoft Excel format.
        - The email includes a link to the **Reports** dashboard where you can configure how and when you can automatically receive reports.
    - To view all the PCI changes, select **View All**.

- **Identity** - A summary of the **Findings** that includes the number of identities that are:
    - **Inactive Roles**
    - **Roles That Can Access Secret Information**
    - **Over Provisioned Active Roles**
    - **Resources That Can Access Secret Information**
    - **Roles With Privilege Escalation** 

    To expand the list to all findings, select **All Findings**.

- **Resources** - A summary of the **Findings** that includes the number of resources that are:
    - **Open Security Groups**
    - **Instances With Access To S3 buckets**
    - **Unencrypted S3 buckets**
    - **SSE-S3 Encrypted buckets**
    - **S3 Bucket Accessible Externally** 



<!---## Next steps--->