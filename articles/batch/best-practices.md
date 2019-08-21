---
title: Best practices - Azure Batch
description: Learn best practices and useful tips for developing your Azure Batch solution.
author: laurenhughes
ms.author: lahugh
ms.date: 08/12/2019 
ms.topic: article
manager: gwallace
---

# Azure Batch best practices

TODO: Add intro here

## Storage account

TODO: Add best practices here

## Compute nodes
### Authenticate to another service and handle secrets on the node
The recommended way to authenticate with services is to
1) Create a certificate
2) Upload the certificate to Azure Batch
3) Create a Service Principal in AAD
4) Add the certificate to the Service Principal
5) When creating your pool, specify the certificate on the certificates property.
6) The certificate will then be installed on each of your compute nodes and can be used to authenticate with your Service Principal. This service principal can then access any services it has access to such as KeyVault or EventGrid.

TODO: Add best practices here

## Pool configuration

TODO: Add best practices here

## Jobs

TODO: Add best practices here

## Tasks

TODO: Add best practices here

## Debugging

TODO: Add best practices here
