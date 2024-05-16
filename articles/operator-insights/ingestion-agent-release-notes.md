---
title: What's new with Azure Operator Insights ingestion agent
description: This article has release notes for Azure Operator Insights ingestion agent. For many of the summarized issues, there are links to more details.
ms.topic: overview
ms.date: 02/28/2024
---

# What's new with Azure Operator Insights ingestion agent

The Azure Operator Insights ingestion agent receives improvements on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

- The latest releases
- Known issues
- Bug fixes

This page is updated for each new release of the ingestion agent, so revisit it regularly. If you're looking for items older than six months, you can find them in [archive for What's new with Azure Operator Insights ingestion agent](ingestion-agent-release-notes-archive.md).

## Version 2.0.0 - March 2024

Supported distributions: 
- RHEL 8
- RHEL 9

### Known issues

None

### New features

- Simplified configuration schema. This is a significant breaking change and requires manual updates to the configuration file in order to upgrade existing agents. See the [configuration reference](./ingestion-agent-configuration-reference.md) for the new schema.
- Added support for authenticating to the Data Product Key Vault with managed identities.

### Fixed

None

## Version 1.0.0 - February 2024

Supported distributions: 
- RHEL 8
- RHEL 9

### Known issues

None

### New features

This is the first release of the Azure Operator Insights ingestion agent. It supports ingestion of Affirmed MCC EDRs and of arbitrary files from an SFTP server.

### Fixed

None

## Related content

- [Azure Operator Insights ingestion agent overview](ingestion-agent-overview.md)
