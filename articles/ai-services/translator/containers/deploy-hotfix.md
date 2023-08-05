---
title: Deploy hotfix in Translator container
titleSuffix: How to deploy a hotfix in the Translator container environment.
services: cognitive-services
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: how-to
ms.date: 08/04/2023
ms.author: lajanuar
recommendations: false
keywords: on-premises, Docker, container, identify, hotfix, phrasefix, sentfix, format
---

# Deploy hotfix in Translator container

Microsoft Translator containers enable you to run several features of the Translator service in your own environment. Containers are great for specific security and data governance requirements. At  times, you may need to implement dynamic updates within your container. To implement a quick-fix engineering solution, you can create a **phrase&#8203;fix** glossary file to specify that a listed phrase is translated in a specified way and/or a **sent&#8203;fix** glossary file to specify an exact target translation for a source sentence. The **phrase&#8203;fix** and **sent&#8203;fix** files are encrypted, included with your translation request, and read directly into memory at runtime. However, when you deploy your Translator application in a container environment, you may realize that you need to make a correction or fine tune your **phrase&#8203;fix** or **sent&#8203;fix** files at deployment. The correction can be implemented using our hotfix folder feature.

## Hotfix feature workflow

The hot fix folder is encoded in **UTF-16 LE BOM** format and nests **phrase&#8203;fix** or **sent&#8203;fix** source and target language files.

    > [!IMPORTANT]
    > **UTF-16 LE** is the only accepted file format for the hotfix folders. For more information about encoding your files, *see* [Encoding](/powershell/module/microsoft.powershell.management/set-content?view=powershell-7.2#-encoding)

1. To get started, you need to create and name your hotfix folder. Let's name our folder `customhotfix`. Each folder can have **phrase&#8203;fix** and **sent&#8203;fix** files. You provide the source (`src`) and target (`tgt`) language codes with the following naming convention:

    |Hotfix folder file name format|Example file name |
    |-----|-----|
    |{`src`}.{`tgt`}.{container-glossary}.{phrase&#8203;fix}.src.snt|en.es.container-glossary.phrasefix.src.snt|
    |{`src`}.{`tgt`}.{container-glossary}.{phrase&#8203;fix}.tgt.snt|en.es.container-glossary.phrasefix.tgt.snt|
    |{`src`}.{`tgt`}.{container-glossary}.{sent&#8203;fix}.src.snt|en.es.container-glossary.sentfix.src.snt|
    |{`src`}.{`tgt`}.{container-glossary}.{sent&#8203;fix}.tgt.snt|en.es.container-glossary.sentfix.tgt.snt|

1. Next, create a `version.json` file within the `customhotfix` folder to dynamically reload hotfix entry changes. The `version.json` file should contain the following parameters:

* **VersionId**. An integer value.
* **HotfixReloadInterval**. Default value is 5 minutes.
* **HotfixReloadEnabled**. Default value is true.

***Sample version.json file***

    ```json
    {
  
        "VersionId": 5,
        "HotfixReloadInterval": 5,
        "HotfixReloadEnabled": true
  
    }
    ```

## Hotfix Docker run command

    ```dockerfile
    docker run -d -p 5000:5000 --name transcont -v /mnt/d/models:/usr/local/models -v /mnt/d /customerhotfix:/usr/local/customhotfix  -e Languages=en,es -e EULA=accept -e apikey=*** -e EULA='accept' -e HotfixDataFolder=/usr/local/customhotfix -e billing={billing endpoint}  mcr.microsoft.com/azure-cognitive-services/translator/text-translation:latest
    ```

## Next steps

[Install and run containers in connected environments](translator-how-to-install-container.md)

[Install and run containers in disconnected environments](translator-disconnected-containers.md)
