---
title: 'Create a Custom Endpoint  | Microsoft Docs'
description: In this article, learn how to configure a custom endpoint to measure with your Internet Analyzer resource. 
services: internet-analyzer
author: mattcalder

ms.service: internet-analyzer
ms.topic: how-to
ms.date: 10/16/2019
ms.author: mebeatty
# Customer intent: (1) As someone interested in migrating to Azure from on-prem/ other cloud, I want to configure a custom endpoint to measure. (2) As someone interested in comparing my custom Azure configuration to on-prem/other cloud/ Azure, I want to configure a custom endpoint to measure. 

---

# Measure custom endpoints to evaluate in your Internet Analyzer tests 

This article demonstrates how to set up a custom endpoint to measure as part of your Internet Analyzer tests. Custom endpoints help evaluate on-premises workloads, workloads running on other cloud providers, and custom Azure configurations.  Comparing two custom endpoints in one test is possible if one endpoint is an Azure resource. For more information on Internet Analyzer, see the [overview](internet-analyzer-overview.md). 

> [!IMPORTANT]
> This public preview is provided without a service level agreement and should not be used for production workloads. Certain features may not be supported, may have constrained capabilities, or may not be available in all Azure locations. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.
>

## Before you begin

Make sure you set up an Internet Analyzer resource and select the "Custom Endpoint" option. Internet Analyzer assumes your custom endpoint is Internet accessible. For more information, see [Create an Internet Analyzer Resource](internet-analyzer-create-test-portal.md).


## Create Custom Endpoint

1. Download a transparent one-pixel test image [here](https://fpc.msedge.net/apc/trans.gif). This one-pixel image is the asset the client JavaScript will fetch to measure performance.
2. In your custom web application, deploy the test image in a publicly accessible path. The path should work over HTTPS. 
3. Copy the full custom endpoint URL (e.g. `https://contoso.com/test/trans.gif`) into the custom endpoint field during your test creation.

## Next steps

Read the [Internet Analyzer FAQ](internet-analyzer-faq.md)

