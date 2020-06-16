---
title: 'Embed Internet Analyzer Client  | Microsoft Docs'
description: In this article, learn how to embed the Internet Analyzer JavaScript client in your application. 
services: internet-analyzer
author: mattcalder

ms.service: internet-analyzer
ms.topic: how-to
ms.date: 10/16/2019
ms.author: mebeatty
# Customer intent: As someone interested in creating an Internet Analyzer resource, I want to learn how to install the JavaScript client, which is necessary to run tests. 

---

# Embed the Internet Analyzer client

This article shows you how to embed the JavaScript client in your application. Installation of this client is necessary to run tests and receive scorecard analytics. **The profile-specific JavaScript client is provided after the first test has been configured.** From there, you may continue to add or remove tests to that profile without having to embed a new script. For more information on Internet Analyzer, see the [overview](internet-analyzer-overview.md). 

> [!IMPORTANT]
> This public preview is provided without a service level agreement and should not be used for production workloads. Certain features may not be supported, may have constrained capabilities, or may not be available in all Azure locations. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.
>

## Before you begin

Internet Analyzer requires access to Azure and other Microsoft services to function correctly. Please allow network access to `fpc.msedge.net` and any preconfigured endpoint URLs (visible through [CLI](internet-analyzer-cli.md)) before embedding the client.

## Find the client script URL

The script URL can be found either through the Azure portal or the Azure CLI after a test has been configured. For more information, see [Create an Internet Analyzer Resource](internet-analyzer-create-test-portal.md).

Option 1. In the Azure portal, use [this link](https://aka.ms/InternetAnalyzerPreviewPortal) to open the preview portal page for Azure Internet Analyzer. Navigate to your Internet Analyzer profile to see the script URL by going to **Settings > Configuration**.

Option 2. Using the Azure CLI, check the `scriptFileUri` Property.
```azurecli-interactive
    az extension add --name internet-analyzer    
    az internet-analyzer test list --resource-group "MyInternetAnalyzerResourceGroup" --profile-name "MyInternetAnalyzerProfile"
```

## Client details

The script is generated specifically for your profile and tests. After being loaded, the script will execute on a 2-second delay. First it contacts the Internet Analyzer service to fetch the list of endpoints configured in your tests. It then runs the measurements and uploads the timed results back to the Internet Analyzer service.

## Client examples

These examples show a few basic methods to embed the client JavaScript into your webpage or application. We use `0bfcb32638b44927935b9df86dcfe397` as an example profile ID for the script URL.

### Run on page load
The simplest method is to use the script tag inside the meta tag block. This tag will execute the script once per page load.

```html
<html>
<meta>
    <script src="//fpc.msedge.net/client/v2/0bfcb32638b44927935b9df86dcfe397/ab.min.js"></script>
</meta>
<body></body>
</html>
```

## Next steps

Read the [Internet Analyzer FAQ](internet-analyzer-faq.md)
