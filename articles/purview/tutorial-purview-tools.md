---
title: Learn about Azure Purview open-source tools and utilities
description:  This tutorial lists various tools and utilities available in Azure Purview and discusses their usage.
author: abandyop
ms.author: arindamba
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: tutorial
ms.date: 10/10/2021
# Customer Intent: As an Azure Purview administrator, I want to kickstart and be up and running with Azure Purview service in a matter of minutes; additionally, I want to perform and set up automations, batch-mode API executions and scripts that help me run Azure Purview smoothly and effectively for the long-term on a regular basis.
---

# Azure Purview open-source tools and utilities

This article lists several open-source tools and utilities (command-line, python, and PowerShell interfaces) that help you get started quickly on Azure Purview service in a matter of minutes! These tools have been authored & developed by collective effort of the Azure Purview Product Group and the open-source community. The objective of such tools is to make learning, starting up, regular usage, and long-term adoption of Azure Purview breezy and super fast.

### Intended audience

- Azure Purview community including customers, developers, ISVs, partners, evangelists, and enthusiasts. 

- Azure Purview catalog is based on [Apache Atlas](https://atlas.apache.org/) and extends full support for Apache Atlas APIs. We welcome Apache Atlas community, enthusiasts, and developers to wholeheartedly build on and evangelize Azure Purview.

### Azure Purview customer journey stages

- *Azure Purview Learners*: Learners who are starting fresh with Azure Purview service and are keen to understand and explore how a multi-cloud unified data governance solution works. A section of learners includes users who want to compare and contrast Azure Purview with other competing solutions in the data governance market and try it before adopting for long-term usage.

- *Azure Purview Innovators*: Innovators who are keen to understand existing and latest features, ideate, and conceptualize features upcoming on Azure Purview. They are adept at building and developing solutions for customers, and have futuristic forward-looking ideas for the next-gen cutting-edge data governance product.

- *Azure Purview Enthusiasts/Evangelists*: Enthusiasts who are a combination of Learners and Innovators. They have developed solid understanding and knowledge of Azure Purview, hence, are upbeat about adoption of Azure Purview. They can help evangelize Azure Purview as a service and educate several other Azure Purview users and probable customers across the globe.

- *Azure Purview Adopters*: Adopters who have migrated from starting up and exploring Azure Purview and are smoothly using Azure Purview for more than a few months.

- *Azure Purview Long-Term Regular Users*: Long-term users who have been using Azure Purview for more than one year and are now confident and comfortable using most advanced Azure Purview use cases on the Azure portal and Azure Purview Studio; furthermore they have near perfect knowledge and awareness of the Azure Purview REST APIs and the additional use cases supported via Azure Purview APIs.


## Azure Purview open-source tools and utilities list

1. [Purview-API-via-PowerShell](https://github.com/Azure/Azure-Purview-API-PowerShell/blob/main/README.md) 

    - **Recommended customer journey stages**: *Learners, Innovators, Enthusiasts, Adopters, Long-Term Regular Users*
    - **Description**: This utility is based on and covers the entire set of [Azure Purview REST API Reference](/rest/api/purview/) Microsoft Docs. [Download & Install from PowerShell Gallery](https://aka.ms/purview-api-ps). It helps you execute all the documented Azure Purview REST APIs through a breezy fast and easy to use PowerShell interface. Use and automate Azure Purview APIs for regular and long-term usage via command-line and scripted methods. This is an alternative for customers looking to do bulk tasks in automated manner, batch-mode, or scheduled cron jobs; as against the GUI method of using the Azure portal and Azure Purview Studio. Detailed documentation, sample usage guide, self-help, and examples are available on [GitHub:Azure-Purview-API-PowerShell](https://github.com/Azure/Azure-Purview-API-PowerShell).

1. [Purview-Starter-Kit](https://aka.ms/PurviewKickstart)

    - **Recommended customer journey stages**: *Learners, Innovators, Enthusiasts*
    - **Description**: PowerShell script to perform initial set up of Azure Purview account. Useful for anyone looking to set up several fresh new Azure Purview account(s) in less than 5 minutes!

1. [Azure Purview Lab](https://aka.ms/purviewlab)

    - **Recommended customer journey stages**: *Learners, Innovators, Enthusiasts*
    - **Description**: A hands-on-lab introducing the myriad features of Azure Purview and helping you learn the concepts in a practical and hands-on approach where you execute each step on your own by hand to develop the best possible understanding of Azure Purview.

1. [Azure Purview CLI](https://aka.ms/purviewcli)

    - **Recommended customer journey stages**: *Innovators, Enthusiasts, Adopters, Long-Term Regular Users*
    - **Description**: Python-based tool to execute the Azure Purview APIs similar to [Purview-API-via-PowerShell](https://aka.ms/purview-api-ps) but has limited/lesser functionality than the PowerShell-based framework.

1. [Azure Purview Demo](https://aka.ms/pvdemo)

    - **Recommended customer journey stages**: *Learners, Innovators, Enthusiasts*
    - **Description**: An Azure Resource Manager (ARM) template-based tool to automatically set up and deploy fresh new Azure Purview account quickly and securely at the issue of just one command. It is similar to [Purview-Starter-Kit](https://aka.ms/PurviewKickstart), the extra feature being it deploys a few more pre-configured data sources - Azure SQL Database, Azure Data Lake Storage Gen2 Account, Azure Data Factory, Azure Synapse Analytics Workspace

1. [PyApacheAtlas: Interface between Azure Purview and Apache Atlas](https://github.com/wjohnson/pyapacheatlas) using Atlas APIs

    - **Recommended customer journey stages**: *Innovators, Enthusiasts, Adopters, Long-Term Regular Users*
    - **Description**: A python package to work with Azure Purview and Apache Atlas API. Supports bulk loading, custom lineage, and more from a Pythonic set of classes and Excel templates. The package supports programmatic interaction and an Excel template for low-code uploads.

1. [Azure Purview EventHub Notifications Reader](https://github.com/Azure/Azure-Purview-API-PowerShell/blob/main/purview_atlas_eventhub_sample.py)

    - **Recommended customer journey stages**: *Innovators, Enthusiasts, Adopters, Long-Term Regular Users*
    - **Description**: This tool demonstrates how to read Azure Purview's EventHub and catch real-time Kafka notifications from the EventHub in Atlas Notifications (https://atlas.apache.org/2.0.0/Notifications.html) format. Further, it generates an excel sheet CSV of the entities and assets on the fly that are discovered live during a scan, and any other notifications of interest that Azure Purview generates.


## Feedback and disclaimer

None of the tools come with an express warranty from Microsoft verifying their efficacy or guarantees of functionality. They are certified to be free of any malicious activity or viruses, and guaranteed to not collect any private or sensitive data.

For feedback or questions about efficacy and functionality during usage, contact the respective tool owners and authors on the contact details mentioned in the respective GitHub repo.


## Next steps

> [!div class="nextstepaction"] 
> [Purview-API-PowerShell](https://aka.ms/purview-api-ps) 
