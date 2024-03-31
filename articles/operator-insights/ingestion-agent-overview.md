---
title: Overview of the Azure Operator Insights ingestion agent
description: Understand how ingestion agents for Azure Operator Insights collect and upload data about your network to Azure.
author: rcdun
ms.author: rdunstan
ms.reviewer: sergeyche
ms.service: operator-insights
ms.topic: concept-article
ms.date: 12/8/2023

#CustomerIntent: As a someone deploying Azure Operator Insights, I want to understand how ingestion agents work so that I can set one up and configure it for my network.
---

# Ingestion agent overview

An _ingestion agent_ uploads data to an Azure Operator Insights Data Product. We provide an ingestion agent called the Azure Operator Insights ingestion agent that you can install on a Linux virtual machine to upload data from your network. This ingestion agent supports uploading:

- Affirmed Mobile Content Cloud (MCC) Event Data Record (EDR) data streams.
- Files stored on an SFTP server.

Combining different types of source in one agent instance isn't recommended in production, but is supported for lab trials and testing.

## MCC EDR source overview

An ingestion agent configured with an MCC EDR source is designed for use with an Affirmed Networks Mobile Content Cloud (MCC). It ingests Event Data Records (EDRs) from MCC network elements, and uploads them to Azure Operator Insights. To learn more, see [Quality of Experience - Affirmed MCC Data Product](concept-mcc-data-product.md).

## SFTP pull source overview

An ingestion agent configured with an SFTP pull source collects files from one or more SFTP servers, and uploads them to Azure Operator Insights.

### File sources

An ingestion agent collects files from _ingestion pipelines_ that you configure on it. A pipeline includes the details of the SFTP server, the files to collect from it and how to manage those files.

For example, a single SFTP server might have logs, CSV files and text files. You could configure each type of file as a separate ingestion pipeline. For each ingestion pipeline, you can specify the directory to collect files from (optionally including or excluding specific files based on file paths), how often to collect files and other options. For full details of the available options, see [Configuration reference for Azure Operator Insights ingestion agent](ingestion-agent-configuration-reference.md).

Ingestion pipelines have the following restrictions:

- They must not overlap, meaning that they must not collect the same files from the same servers.
- You must configure each pipeline on exactly one agent. If you configure a pipeline on multiple agents, Azure Operator Insights receives duplicate data.

### Processing files

The ingestion agent uploads files to Azure Operator Insights during scheduled _upload runs_. The frequency of these runs is defined in the pipeline's configuration. Each upload run uploads files according to the pipeline's configuration:

- File paths and regular expressions for including and excluding files specify the files to upload.
- The _settling time_ excludes files last modified within this period from any upload. For example, if the upload run starts at 05:30 and the settling time is 60 seconds (one minute), the upload run only uploads files modified before 05:29.
- The _exclude before time_ (if set) excludes files last modified before the specified date and time.

The ingestion agent records when it last completed an upload run for a file source. It uses this record to determine which files to upload during the next upload run, using the following process:

1. The agent checks the last recorded time.
1. The agent uploads any files modified since that time. It assumes that it processed older files during a previous upload run.
1. At the end of the upload run:
    - If the agent uploaded all the files or the only errors were nonretryable errors, the agent updates the record. The new time is based on the time the upload run started, minus the settling time.
    - If the upload run had retryable errors (for example, if the connection to Azure was lost), the agent doesn't update the record. Not updating the record allows the agent to retry the upload for any files that didn't upload successfully. Retries don't duplicate any data previously uploaded.

The ingestion agent is designed to be highly reliable and resilient to low levels of network disruption. If an unexpected error occurs, the agent restarts and provides service again as soon as it's running. After a restart, the agent carries out an immediate catch-up upload run for all configured file sources. It then returns to its configured schedule.

## Authentication

The ingestion agent authenticates to two separate systems, with separate credentials.

- To authenticate to the ingestion endpoint of an Azure Operator Insights Data Product, the agent obtains a SAS token from an Azure Key Vault. The agent authenticates to this Key Vault with either a Microsoft Entra ID managed identity or service principal and certificate that you setup when you created the agent.
- To authenticate to your SFTP server, the agent can use password authentication or SSH key authentication.

For configuration instructions, see [Set up authentication to Azure](set-up-ingestion-agent.md#set-up-authentication-to-azure), [Prepare the VMs](set-up-ingestion-agent.md#prepare-the-vms) and [Configure the agent software](set-up-ingestion-agent.md#configure-the-agent-software).

## Next step

> [!div class="nextstepaction"]
> [Install the Azure Operator Insights ingestion agent and configure it to upload data](set-up-ingestion-agent.md)
