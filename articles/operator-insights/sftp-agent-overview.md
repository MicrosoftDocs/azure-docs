---
title: Overview of SFTP Ingestion Agents for Azure Operator Insights
description: #Required; Keep the description within 100- and 165-characters including spaces 
author: rcdun
ms.author: rdunstan
ms.reviewer: rathishr
ms.service: operator-insights
ms.topic: concept-article #Required; leave this attribute/value as-is.
ms.date: 12/8/2023

#CustomerIntent: As a someone deploying Azure Operator Insights, I want to understand how SFTP agents work so that I can set one up and configure it for my network.
---

# SFTP Ingestion Agent overview

An SFTP Ingestion Agent collects files from one or more SFTP servers, and uploads them to Azure Operator Insights.

## File sources

An SFTP ingestion agent collects files from _file sources_ that you configure on it. A file source includes the details of the SFTP server, the files to collect from it and how to manage those files.

For example, a single SFTP server might have logs, CSV files and text files. You could configure each type of file as a separate file source. For each file source, you can specify the directory to collect files from (optionally including or excluding specific files based on file paths), how often to collect files and other options. For full details of the available options, see [SFTP Ingestion Agents configuration reference](sftp-agent-configuration.md).

File sources have the following restrictions:

- File sources must not overlap, meaning that they must not collect the same files from the same servers.
- You must configure each file source on exactly one agent. If you configure a file source on multiple agents, Azure Operator Insights receives duplicate data.

## Processing files

The SFTP agent uploads files to Azure Operator Insights during scheduled _upload runs_. The frequency of these runs is defined in the file source's configuration. Each upload run uploads files according to the file source's configuration:

- File paths and regular expressions for including and excluding files specify the files to upload.
- The _settling time_ excludes files last modified within this period from any upload. For example, if the upload run starts at 05:30 and the settling time is 60 seconds (one minute), the upload run only uploads files modified before 05:29.
- The _exclude before time_ (if set) excludes files last modified before the specified date and time.

The SFTP agent records when it last completed an upload run for a file source. It uses this record to determine which files to upload during the next upload run, using the following process:

1. The agent checks the last recorded time.
1. The agent uploads any files modified since that time. It assumes that it processed older files during a previous upload run.
1. At the end of the upload run:
    - If the agent uploaded all the files or the only errors were nonretryable errors, the agent updates the record. The new time is based on the time the upload run started, minus the settling time.
    - If the upload run had retryable errors (for example, if the connection to Azure was lost), the agent doesn't update the record. Not updating the record allows the agent to retry the upload for any files that didn't upload successfully. Retries don't duplicate any data previously uploaded.

The SFTP agent is designed to be highly reliable and resilient to low levels of network disruption. If an unexpected error occurs, the agent restarts and provides service again as soon as it's running. After a restart, the SFTP agent carries out an immediate catch-up upload run for all configured file sources. It then returns to its configured schedule.

## Authentication

The SFTP agent authenticates to two separate systems, with separate credentials.

- To authenticate to the ingestion endpoint of an Azure Operator Insights Data Product, the agent obtains a connection string from an Azure Key Vault. The agent authenticates to this Key Vault with a Microsoft Entra ID service principal and certificate that you set up when you create the agent.
- To authenticate to your SFTP server, the agent can use password authentication or SSH key authentication.

For configuration instructions, see [Set up authentication to Azure](how-to-install-sftp-agent.md#set-up-authentication-to-azure) and [Configure the connection between the SFTP server and VM](how-to-install-sftp-agent.md#configure-the-connection-between-the-sftp-server-and-vm).

## Next step

> [!div class="nextstepaction"]
> [Create and configure SFTP Ingestion Agents for Azure Operator Insights](how-to-install-sftp-agent.md)
