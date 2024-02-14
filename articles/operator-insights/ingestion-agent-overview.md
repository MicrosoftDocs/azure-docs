---
title: Overview of SFTP Ingestion Agents for Azure Operator Insights
description: Understand how ingestion agents for Azure Operator Insights collect and upload data about your network to Azure
author: rcdun
ms.author: rdunstan
ms.reviewer: sergeyche
ms.service: operator-insights
ms.topic: concept-article
ms.date: 12/8/2023

#CustomerIntent: As a someone deploying Azure Operator Insights, I want to understand how ingestion agents work so that I can set one up and configure it for my network.
---

# Ingestion agent overview

An _ingestion agent_ uploads data to an Azure Operator Insights data product. We provide an ingestion agent that you can install on a virtual machine to upload data from your network. This ingestion agent supports uploading:

- Affirmed Mobile Content Cloud (MCC) Event Data Record (EDR) data streams.
- Files stored on an SFTP server.

> [!WARNING]
> TODO Update with content from [SFTP Ingestion Agent overview](sftp-agent-overview.md)

## Next step

> [!div class="nextstepaction"]
> [Install the Azure Operator Insights ingestion agent and configure it to upload data](set-up-ingestion-agent.md)