---
title: "Quickstart: Document Translation REST API"
description: 'Document Translation processing using the REST API'
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: include
ms.date: 07/18/2023
ms.author: lajanuar
recommendations: false
---

<!-- markdownlint-disable MD051 -->

## Set up your programming environment

In this quickstart, we use the cURL command line tool to make Document Translation REST API calls.

> [!NOTE]
> The cURL package is pre-installed on most Windows 10 and Windows 11 and most macOS and Linux distributions. You can check the package version with the following commands:
> Windows: `curl.exe -V`.
> macOS `curl -V`
> Linux: `curl --version`

If you don't have cURL installed, here are links for your platform:

* [Windows](https://curl.haxx.se/windows/).
* [Mac or Linux](https://learn2torials.com/thread/how-to-install-curl-on-mac-or-linux-(ubuntu)-or-windows).

<!-- > [!div class="nextstepaction"]
> [I ran into an issue setting up my environment.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=RESTAPI&Pillar=Language&Product=Document-translation&Page=quickstart&Section=Set-up-the-environment) -->

## Translate documents (POST Request)

1. Using your preferred editor or IDE, create a new directory for your app named `document-translation`.

1. Create a new json file called **document-translation.json** in your **document-translation** directory.

1. Copy and paste the document translation **request sample** into your `document-translation.json` file. Replace **`{your-source-container-SAS-URL}`** and **`{your-target-container-SAS-URL}`** with values from your Azure portal Storage account containers instance.

    `**Request sample**`

    ```json
    {
      "inputs":[
        {
          "source":{
            "sourceUrl":"{your-source-container-SAS-URL}"
          },
          "targets":[
            {
              "targetUrl":"{your-target-container-SAS-URL}",
              "language":"fr"
            }
          ]
        }
      ]
    }
    ```

### Build and run the POST request

Before you run the **POST** request, replace `{your-source-container-SAS-URL}` and `{your-key}` with the endpoint value from your Azure portal Translator instance.

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../../../key-vault/general/overview.md). For more information, *see* Azure AI services [security](../../../../../../ai-services/security-features.md).

***PowerShell***

```powershell
cmd /c curl "{your-document-translator-endpoint}/translator/text/batch/v1.1/batches" -i -X POST --header "Content-Type: application/json" --header "Ocp-Apim-Subscription-Key: {your-key}" --data "@document-translation.json"
```

***command prompt / terminal***

```curl
curl "{your-document-translator-endpoint}/translator/text/batch/v1.1/batches" -i -X POST --header "Content-Type: application/json" --header "Ocp-Apim-Subscription-Key: {your-key}" --data "@document-translation.json"
```

Upon successful completion: 

* The translated documents can be found in your target container.
* The successful POST method returns a `202 Accepted` response code indicating that the service created the batch request.
* The POST request also returns response headers including `Operation-Location` that provides a value used in subsequent GET requests.

<!-- > [!div class="nextstepaction"]
> [I successfully translated my document.](#next-steps)  [I ran into an issue.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=RESTAPI&Pillar=Language&Product=Document-translation&Page=quickstart&Section=Translate-documents) -->
