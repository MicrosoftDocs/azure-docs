---
title: Deploy a user-managed glossary in Translator container
titleSuffix: Azure AI services
description: How to deploy a user-managed glossary in the Translator container environment.
#services: cognitive-services
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.topic: how-to
ms.date: 08/15/2023
ms.author: lajanuar
recommendations: false
---

<!-- markdownlint-disable MD036 -->
<!-- markdownlint-disable MD046 -->

# Deploy a user-managed glossary

Microsoft Translator containers enable you to run several features of the Translator service in your own environment and are great for specific security and data governance requirements.

There may be times when you're running a container with a multi-layered ingestion process when you discover that you need to implement an update to sentence and/or phrase files. Since the standard phrase and sentence files are encrypted and read directly into memory at runtime, you need to implement a quick-fix engineering solution to implement a dynamic update. This update can be implemented using our user-managed glossary feature:

* To deploy the **phrase&#8203;fix** solution, you need to create a **phrase&#8203;fix** glossary file to specify that a listed phrase is translated in a specified way.

* To deploy the **sent&#8203;fix** solution, you need to create a **sent&#8203;fix** glossary file to specify an exact target translation for a source sentence.

* The **phrase&#8203;fix** and **sent&#8203;fix** files are then included with your translation request and read directly into memory at runtime.

## Managed glossary workflow

  > [!IMPORTANT]
  > **UTF-16 LE** is the only accepted file format for the managed-glossary folders. For more information about encoding your files, *see* [Encoding](/powershell/module/microsoft.powershell.management/set-content?view=powershell-7.2#-encoding&preserve-view=true)

1. To get started manually creating the folder structure, you need to create and name your  folder. The managed-glossary folder is encoded in **UTF-16 LE BOM** format and nests **phrase&#8203;fix** or **sent&#8203;fix** source and target language files. Let's name our folder `customhotfix`. Each folder can have **phrase&#8203;fix** and **sent&#8203;fix** files. You provide the source (`src`) and target (`tgt`) language codes with the following naming convention:

    |Glossary file name format|Example file name |
    |-----|-----|
    |{`src`}.{`tgt`}.{container-glossary}.{phrase&#8203;fix}.src.snt|en.es.container-glossary.phrasefix.src.snt|
    |{`src`}.{`tgt`}.{container-glossary}.{phrase&#8203;fix}.tgt.snt|en.es.container-glossary.phrasefix.tgt.snt|
    |{`src`}.{`tgt`}.{container-glossary}.{sent&#8203;fix}.src.snt|en.es.container-glossary.sentfix.src.snt|
    |{`src`}.{`tgt`}.{container-glossary}.{sent&#8203;fix}.tgt.snt|en.es.container-glossary.sentfix.tgt.snt|

   > [!NOTE]
   >
   > * The **phrase&#8203;fix** solution is an exact find-and-replace operation. Any word or phrase listed is translated in the way specified.
   > * The **sent&#8203;fix** solution is more precise and allows you to specify an exact target translation for a source sentence. For a sentence match to occur, the entire submitted sentence must match the **sent&#8203;fix** entry. If only a portion of the sentence matches, the entry won't match.
   > * If you're hesitant about making sweeping find-and-replace changes, we recommend, at the outset, solely using the **sent&#8203;fix** solution.

1. Next, to dynamically reload glossary entry updates, create a `version.json` file within the `customhotfix` folder. The `version.json` file should contain the following parameters: **VersionId**. An integer value.

    ***Sample version.json file***

    ```json
       {

        "VersionId": 5

        }

    ```

      > [!TIP]
      >
      > Reload can be controlled by setting the following environmental variables when starting the container:
      >
      > * **HotfixReloadInterval=**. Default value is 5 minutes.
      > * **HotfixReloadEnabled=**. Default value is true.

1. Use the **docker run** command

    **Docker run command required options**

    ```dockerfile
    docker run --rm -it -p 5000:5000 \

    -e eula=accept \

    -e billing={ENDPOINT_URI} \

    -e apikey={API_KEY} \

    -e Languages={LANGUAGES_LIST} \

    -e HotfixDataFolder={path to glossary folder}

    {image}
    ```

    **Example docker run command**

    ```dockerfile

    docker run -rm -it -p 5000:5000 \
    -v /mnt/d/models:/usr/local/models -v /mnt/d /customerhotfix:/usr/local/customhotfix \
    -e EULA=accept \
    -e billing={ENDPOINT_URI} \
    -e apikey={API_Key} \
    -e Languages=en,es \
    -e HotfixDataFolder=/usr/local/customhotfix\
    mcr.microsoft.com/azure-cognitive-services/translator/text-translation:latest

   ```

## Learn more

> [!div class="nextstepaction"]
> [Create a dynamic dictionary](../dynamic-dictionary.md)   [Use a custom dictionary](../custom-translator/concepts/dictionaries.md)
