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

# Azure Purview Tools & Utilities
This page lists all the open-source tools and utilities that help you get started and be up and running with Azure Purview service in a matter of minutes. These tools are developed by the Azure Purview Product Group and the open source community.
Additionally, using these tools you can perform and set up automations, batch mode API executions and scripts that help run Purview smoothly and effectively for the long term on a regular basis.

Here is a list of the various tools and utilities to make Purview Adoption smoother and lightning fast amongst Azure Purview community, developers, ISVs, partners, evangelists and customers. This article contains various command line and powershell tools to make usage and adoption of Purview breezy and super fast for quick setup or Purview demo purposes; and all these utilities contain automation interfaces.

1. [Purview-API-via-Powershell](https://aka.ms/purview-api-ps) : This utility is based on and covers the entire set of [Azure Purview API Reference](https://docs.microsoft.com/rest/api/purview/) Microsoft Docs. It helps you execute all the documented Purview REST APIs through a breezy fast and easy to use Powershell interface. Use and automate Purview APIs for regular and long term usage via command-line and scripted methods. This is an alternative for customers looking to do bulk tasks in automated manner, batch mode or scheduled cron jobs; as against the GUI method of using the Azure portal and Purview Studio.

2. [Purview-Starter-Kit](https://aka.ms/PurviewKickstart) : Powershell script to perform initial set-up of Purview account. Very useful for anyone looking to set up several fresh new Purview account(s) in less than 5 minutes!

3. [Purview Lab](https://aka.ms/purviewlab) : A hands-on-lab introducing the myriad features of Purview and helping you learn the concepts in a practical and hands-on approach where you execute each step on your own by hand to develop the best possible understanding of Purview.

4. [Purview CLI](https://aka.ms/purviewcli) : Another technique of using the Purview APIs similar to [Purview-API-via-Powershell](https://aka.ms/purview-api-ps) , only difference being this tool is Python based, whereas the former is Powershell based.

5. [Purview Demo](https://aka.ms/pvdemo) : A lightning fast tool to automatically deploy Purview in a super fast and secure way at the click of a button. It just asks for your corporate email address - as simple as that ! Click a button, wait 10 minutes and boom - your Purview environment is up and running, ready to use via Azure portal, Purview Studio or any of the Purview APIs.

6. [PyApacheAtlas: Interface between Azure Purview and Apache Atlas](https://github.com/wjohnson/pyapacheatlas) using Atlas APIs: A python package to work with the Azure Purview and Apache Atlas API. Supporting bulk loading, custom lineage, and more from a Pythonic set of classes and Excel templates. The package supports programmatic interaction and an Excel template for low-code uploads.

7. [Purview EventHub Notifications Reader](https://github.com/Azure/Azure-Purview-API-PowerShell/blob/main/purview_atlas_eventhub_sample.py): This tool demonstrates how to read Purview's EventHub and catch realtime Kafka notifications from the EventHub in Atlas Notifications (https://atlas.apache.org/2.0.0/Notifications.html) format. Further, it generates an excel sheet CSV of the entities and assets on the fly that are discovered live during a scan, and any other notifications of interest that Purview generates.


## Feedback & Disclaimer
Disclaimer: None of these tools come with an express warranty from Microsoft verifying their efficacy or guarantees of functionality, however, are certified to be free of any malicious activity or viruses, neither do they collect any private or PII data.
Feedback: For any feedback about efficacy and functionality during usage please contact the respective tool owners/authors on the contact details mentioned on the corresponding github repo.


## Next steps

> [!div class="nextstepaction"] 
> [Purview-API-PowerShell](https://aka.ms/purview-api-ps) 


