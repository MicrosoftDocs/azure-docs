---
title: Learn about Azure Purview open-source tools and utilities
description:  This tutorial lists various tools and utilities available in Azure Purview and discusses their usage.
author: abandyop
ms.author: arindamba
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: tutorial
ms.date: 10/10/2021
# Customer intent: As an Azure Purview administrator, I want to kickstart and be up and running with Azure Purview service in a matter of minutes; additionally, I want to perform and set up automations, batch mode API executions and scripts that help me run Purview smoothly and effectively for the long term on a regular basis.
---

# Azure Purview Open-Source Tools & Utilities
This page lists several open-source tools and utilities (command line, python and powershell interfaces) that help you get kickstarted on various stages of your journey with Azure Purview service in a matter of minutes. These tools are developed by collective effort of the Azure Purview Product Group and the open source community; and are intended to make learning, starting up, regular usage and long-term adoption of Purview breezy and super fast.

### Intended Audience
- Azure Purview community including customers, developers, ISVs, partners, evangelists and enthusiasts. 
- Azure Purview catalog is based on [Apache Atlas](https://atlas.apache.org/) and extends full support for Apache Atlas APIs. We welcome Apache Atlas community, enthusiasts and developers to whole-heartedly build on and evangelize Azure Purview.

### Purview Customer Journey Stages
- *Purview Learners* : Learners who are starting fresh with Azure Purview (Microsoft Cloud marquee Data Governance service) and are keen to understand and explore how a multi-cloud unified data givernance solution works. A section of learners includes users who want to compare and contrast Purview with other competing solutions in the data governance market and try it before adopting for long-term usage.
- *Purview Innovators* : Innovators who are keen to understand existing and latest features, ideate and conceptualize features upcoming on Purview's roadmap, build and develop solutions for customers and for the future of next-gen cutting-edge data governance product.
- *Purview Enthusiasts/Evangelists* : Enthusiasts who are a combination of Learners and Innovators and have developed solid understanding and knowledge of Purview that they are upbeat about adoption of Purview. They can help evangelize Purview as a service as well as educate several other Purview users and probable users across the globe.
- *Purview Adopters* : Adopters who have migrated from starting up and exploring Purview and are smoothly using Purview for more than a few months.
- *Purview Long-Term Regular Users* : Long-term users who have been in a combination of the other customer journey stages previously and are now extremely comfortable using majority of Purview use cases on the Azure portal, Purview Studio as well as having full knowledge and awareness of the Purview REST APIs.


## Azure Purview Open-Source Tools & Utilities List

1. [Purview-API-via-Powershell](https://github.com/Azure/Azure-Purview-API-PowerShell/blob/main/README.md) 
- *Recommended Customer Journey Stages : Learners (Interactive Mode); Innovators, Enthusiasts, Adopters, Long-Term Regular Users (Batch Mode).*
- **Description** : This utility is based on and covers the entire set of [Azure Purview REST API Reference](https://docs.microsoft.com/rest/api/purview/) Microsoft Docs. [Download & Install from PowerShell Gallery](https://aka.ms/purview-api-ps). It helps you execute all the documented Purview REST APIs through a breezy fast and easy to use Powershell interface. Use and automate Purview APIs for regular and long term usage via command-line and scripted methods. This is an alternative for customers looking to do bulk tasks in automated manner, batch mode or scheduled cron jobs; as against the GUI method of using the Azure portal and Purview Studio. Detailed documentation, sample usage guide, self-help and examples are available on [GitHub:Azure-Purview-API-PowerShell](https://github.com/Azure/Azure-Purview-API-PowerShell).

2. [Purview-Starter-Kit](https://aka.ms/PurviewKickstart)
- *Recommended Customer Journey Stages : Learners, Innovators, Enthusiasts*
- **Description** : Powershell script to perform initial set-up of Purview account. Very useful for anyone looking to set up several fresh new Purview account(s) in less than 5 minutes!

3. [Purview Lab](https://aka.ms/purviewlab)
- *Recommended Customer Journey Stages : Learners, Innovators, Enthusiasts*
- Description : A hands-on-lab introducing the myriad features of Purview and helping you learn the concepts in a practical and hands-on approach where you execute each step on your own by hand to develop the best possible understanding of Purview.

4. [Purview CLI](https://aka.ms/purviewcli)
- *Recommended Customer Journey Stages : Innovators, Enthusiasts, Adopters, Long-Term Regular Users*
- **Description** : Another technique of using the Purview APIs similar to [Purview-API-via-Powershell](https://aka.ms/purview-api-ps) , only difference being this tool is Python based, whereas the former is Powershell based.

5. [Purview Demo](https://aka.ms/pvdemo)
- *Recommended Customer Journey Stages : Learners, Innovators, Enthusiasts*
- **Description** : A lightning fast tool to automatically deploy Purview in a super fast and secure way at the click of a button. It just asks for your corporate email address - as simple as that ! Click a button, wait 10 minutes and boom - your Purview environment is up and running, ready to use via Azure portal, Purview Studio or any of the Purview APIs.

6. [PyApacheAtlas: Interface between Azure Purview and Apache Atlas](https://github.com/wjohnson/pyapacheatlas) using Atlas APIs
- *Recommended Customer Journey Stages : Innovators, Enthusiasts, Adopters, Long-Term Regular Users*
- **Description** : A python package to work with Azure Purview and Apache Atlas API. Supports bulk loading, custom lineage, and more from a Pythonic set of classes and Excel templates. The package supports programmatic interaction and an Excel template for low-code uploads.

7. [Purview EventHub Notifications Reader](https://github.com/Azure/Azure-Purview-API-PowerShell/blob/main/purview_atlas_eventhub_sample.py)
- *Recommended Customer Journey Stages : Innovators, Enthusiasts, Adopters, Long-Term Regular Users*
- **Description** : This tool demonstrates how to read Purview's EventHub and catch realtime Kafka notifications from the EventHub in Atlas Notifications (https://atlas.apache.org/2.0.0/Notifications.html) format. Further, it generates an excel sheet CSV of the entities and assets on the fly that are discovered live during a scan, and any other notifications of interest that Purview generates.


## Feedback & Disclaimer
Disclaimer: None of these tools come with an express warranty from Microsoft verifying their efficacy or guarantees of functionality, however, are certified to be free of any malicious activity or viruses, neither do they collect any private or PII data.
Feedback: For any feedback about efficacy and functionality during usage please contact the respective tool owners/authors on the contact details mentioned on the corresponding github repo.


## Next steps

> [!div class="nextstepaction"] 
> [Purview-API-PowerShell](https://aka.ms/purview-api-ps) 


