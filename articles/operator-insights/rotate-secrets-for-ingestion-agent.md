---
title: Rotate secrets for ingestion agents for Azure Operator Insights
description: Learn how to rotate secrets for Azure Operator Insights ingestion agents.
author: rcdun
ms.author: rdunstan
ms.reviewer: sergeyche
ms.service: operator-insights
ms.topic: how-to
ms.date: 02/29/2024

#CustomerIntent: As a someone managing an agent that has already been set up, I want to rotate its secrets so that Data Products in Azure Operator Insights continue to receive the correct data.
---
# Rotate secrets for Azure Operator Insights ingestion agents

The ingestion agent is a software package that is installed onto a Linux Virtual Machine (VM) owned and managed by you.

It uses a managed identity or service principal to obtain, from the Data Product's Azure Key Vault, the credentials needed to upload data to the Data Product's input storage account.

If you use a service principal, you must refresh its credentials before they expire. In this article, you'll rotate the service principal certificates on the ingestion agent.

## Prerequisites

None.

## Rotate certificates

1. Create a new certificate, and add it to the service principal. For instructions, refer to [Upload a trusted certificate issued by a certificate authority](/entra/identity-platform/howto-create-service-principal-portal).
1. Obtain the new certificate and private key in the base64-encoded P12 format, as described in [Set up Ingestion Agents for Azure Operator Insights](set-up-ingestion-agent.md#prepare-certificates-for-the-service-principal).
1. Copy the certificate to the ingestion agent VM.
1. Save the existing certificate file and replace with the new certificate file.
1. Restart the agent.
    ```
    sudo systemctl restart az-aoi-ingestion.service
    ```

## Related content

Learn how to:

- [Monitor and troubleshoot ingestion agents](monitor-troubleshoot-ingestion-agent.md).
- [Change configuration for ingestion agents](change-ingestion-agent-configuration.md).
- [Upgrade ingestion agents](upgrade-ingestion-agent.md).
