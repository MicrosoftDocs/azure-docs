---
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 04/28/2021
ms.author: eur
ms.custom: ignite-fall-2021
---

Follow these steps and see the [Speech CLI quickstart](~/articles/ai-services/speech-service/spx-basics.md#download-and-install) for additional requirements for your platform.

1. Install the Speech CLI via the .NET CLI by entering this command:
   ```dotnetcli
   dotnet tool install --global Microsoft.CognitiveServices.Speech.CLI
   ```
1. Configure your Speech resource key and region, by running the following commands. Replace `SUBSCRIPTION-KEY` with your Speech resource key, and replace `REGION` with your Speech resource region:
    # [Terminal](#tab/terminal)
    
    ```console
    spx config @key --set SUBSCRIPTION-KEY
    spx config @region --set REGION
    ```
    
    # [PowerShell](#tab/powershell)
    
    ```powershell
    spx --% config @key --set SUBSCRIPTION-KEY
    spx --% config @region --set REGION
    ```
    ***
