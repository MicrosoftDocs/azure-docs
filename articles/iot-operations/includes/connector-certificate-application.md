---
title: Include file
description: Include file
author: dominicbetts
ms.topic: include
ms.date: 05/12/2026
ms.author: dobett
ms.service: azure-iot-operations
ai-usage: ai-assisted
---

Each connector has its own *trust list*: the set of certificates the connector uses to validate the TLS certificate that a southbound endpoint presents when the connector establishes a secure connection to it. Add a certificate to the trust list when the southbound endpoint uses a TLS certificate that's signed by a private or enterprise certificate authority (CA), or a self-signed certificate that the connector doesn't already trust. Client certificates that the connector presents to the southbound endpoint for mutual TLS are configured separately as part of the device's user authentication.

> [!NOTE]
> For the connector for OPC UA, the trust list also handles OPC UA application-instance certificates. To learn more, see [Understand the OPC UA certificates infrastructure](../discover-manage-assets/overview-opc-ua-connector-certificates-management.md).

You can add a certificate to a connector's trust list in two ways:

- **Operations experience**. In the operations experience web UI, you can either upload a certificate file directly or pick an existing secret from Azure Key Vault. The operations experience adds the certificate to Azure Key Vault as a secret (if needed), creates the synced secret resource on the cluster, and wires it into the connector's trust list for you. To learn more, see [Manage certificates for external communications](../secure-iot-ops/howto-manage-certificates.md#manage-certificates-for-external-communications).

- **Azure CLI**. The Azure CLI flow assumes the certificate is already stored as a secret in Azure Key Vault. You use `az iot ops secretsync secret set` to create a synced secret on the cluster that references the Key Vault secret, and then `az iot ops connector template update` to add a reference to the synced secret in the connector template's trust list. To learn more, see [Add and use certificates](../secure-iot-ops/howto-manage-certificates.md?tabs=cli#add-and-use-certificates). To learn how to add a certificate to Azure Key Vault, see [Add certificates as secrets to Azure Key Vault](../secure-iot-ops/howto-manage-certificates.md#add-certificates-as-secrets-to-azure-key-vault).

The operations experience and the Azure CLI flows partially overlap. The operations experience can both upload a new certificate to Azure Key Vault and sync it to the cluster in one experience. The Azure CLI flow assumes the certificate is already in Azure Key Vault and only handles the sync and trust-list wiring.