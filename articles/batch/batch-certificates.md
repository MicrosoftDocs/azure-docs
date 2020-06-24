---
title: Using certificates - Azure Batch
description: Use certificates to enable authentication of applications
services: batch
documentationcenter: .net
author: LauraBrenner
manager: evansma
editor: ''

ms.assetid: 63d9d4f1-8521-4bbb-b95a-c4cad73692d3
ms.service: batch
ms.topic: article
ms.tgt_pltfrm: 
ms.workload: big-compute
ms.date: 02/17/2020
ms.author: labrenne
ms.custom: seodec18

---
# Using certificates with Batch

Currently the main reason to use certificates with Batch is if you have applications running in Pools that need to authenticate with an endpoint. 

If you don't already have a certificate, you can create a self-signed certificate using the
`makecert` command-line tool.

## Upload certificates manually through the Azure portal

1. From the Batch account you want to upload a certificate to, select **Certificates** and then select **Add**. 

2. Upload the certificate with a .pfx or .cer extension. 

Once uploaded, the certificate is added to a list of certificates, and you can verify the thumbprint.

Now when you create a Batch pool, you can navigate to Certificates within the pool and assign the certificate you uploaded to that pool.

## Next steps

Batch has a certificate API, [AZ batch certificate create](https://docs.microsoft.com/cli/azure/batch/certificate?view=azure-cli-latest#az-batch-certificate-create)

For information on using Key Vault, see [Securely access Key Vault with Batch](credential-access-key-vault.md).
