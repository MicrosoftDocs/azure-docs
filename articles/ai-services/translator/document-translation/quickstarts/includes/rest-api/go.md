---
title: "Quickstart: Document Translation Go"
description: 'Document Translation processing using the REST API and Go programming language'
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.topic: include
ms.date: 07/18/2023
ms.author: lajanuar
recommendations: false
---

<!-- markdownlint-disable MD051 -->

## Set up your Go environment

You can use any text editor to write Go applications. We recommend using the latest version of [Visual Studio Code and the Go extension](/azure/developer/go/configure-visual-studio-code).

> [!TIP]
> If you're new to Go, try the [Get started with Go](/training/modules/go-get-started/) Learn module.

If you haven't already done so, [download and install Go](https://go.dev/doc/install).

1. Download the Go version for your operating system.
1. Once the download is complete, run the installer.
1. Open a command prompt and enter the following to confirm Go was installed:

    ```console
    go version
    ```

<!-- > [!div class="nextstepaction"]
> [I ran into an issue setting up my environment.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=GO&Pillar=Language&Product=Document-translation&Page=quickstart&Section=Set-up-the-environment) -->

## Translate all documents in a storage container

1. In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app called **document-translation-qs**, and navigate to it.

1. Create a new Go file named **document-translation.go** in the **document-translation-qs** directory.

1. Copy and paste the document translation [code sample](#code-sample) into your **document-translation.go** file.

    * Update **`{your-document-translation-endpoint}`** and **`{your-key}`** with values from your Azure portal Translator instance.

    * Update the **`{your-source-container-SAS-URL}`** and **`{your-target-container-SAS-URL}`** with values from your Azure portal Storage account containers instance.

## Code sample

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../../../key-vault/general/overview.md). For more information, see Azure AI services [security](../../../../../../ai-services/security-features.md).

```go
package main

import (
  "bytes"
  "encoding/json"
  "fmt"
  "net/http"
)

func main() {

    httpposturl := "{your-document-translation-endpoint}/translator/text/batch/v1.1/batches"
    fmt.Println("Response", httpposturl)

    var jsonData = []byte(`{
        "inputs": [
            {
                "source": {
                    "sourceUrl": "{your-source-container-SAS-URL}"
                },
                "targets": [
                    {
                        "{your-target-container-SAS-URL}",
                        "language": "fr"
                    }
                ]
            }
        ]
    }`)

    request, error := http.NewRequest("POST", httpposturl, bytes.NewBuffer(jsonData))
    request.Header.Set("Content-Type", "application/json")
    request.Header.Set("Ocp-Apim-Subscription-Key", "{your-key}")

    client := &http.Client{}
    response, error := client.Do(request)
    if error != nil {
        panic(error)
    }
    defer response.Body.Close()

    fmt.Println("response Status:", response.Status)
    var printHeader = (response.Header)
    prettyJSON, _ := json.MarshalIndent(printHeader, "", "  ")
    fmt.Printf("%s\n", prettyJSON)
}
```

## Run your Go application

Once you've added a code sample to your application, your Go program can be executed in a command or terminal prompt. Make sure your prompt's path is set to the **document-translation-qs** folder and use the following command:

```console
go run document-translation.go
```

Upon successful completion: 

* The translated documents can be found in your target container.
* The successful POST method returns a `202 Accepted` response code indicating that the service created the batch request.
* The POST request also returns response headers including `Operation-Location` that provides a value used in subsequent GET requests.

> [!div class="nextstepaction"]
> [I successfully translated my document.](#next-steps)  [I ran into an issue.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=GO&Pillar=Language&Product=Document-translation&Page=quickstart&Section=Translate-documents)
