---
title: "Speech CLI configuration options - Speech service"
titleSuffix: Azure Cognitive Services
description: Learn how to create and manage configuration files for use with the Azure Speech CLI.
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 01/13/2021
ms.author: erhopf
---

# Speech CLI configuration options

Speech CLI's behavior can rely on settings in configuration files, which you can refer to using a `@` symbol. The Speech CLI saves a new setting in a new `./spx/data` subdirectory that is created in the current working directory for the Speech CLI. When looking for a configuration value, the Speech CLI searches your current working directory, then in the datastore at `./spx/data`, and then in other datastores, including a final read-only datastore in the `spx` binary. 

In the Speech CLI quickstart, you used the datastore to save your `@key` and `@region` values, so you did not need to specify them with each `spx` command. Keep in mind, that you can use configuration files to store your own configuration settings, or even use them to pass URLs or other dynamic content generated at runtime.

## Create and manage configuration files in the datastore

This section shows how to use a configuration file in the local datastore to store and fetch command settings using `spx config`, and store output from Speech CLI using the `--output` option.

The following example clears the `@my.defaults` configuration file, adds key-value pairs for **key** and **region** in the file, and uses the configuration in a call to `spx recognize`.

```console
spx config @my.defaults --clear
spx config @my.defaults --add key 000072626F6E20697320636F6F6C0000
spx config @my.defaults --add region westus

spx config @my.defaults

spx recognize --nodefaults @my.defaults --file hello.wav
```

You can also write dynamic content to a configuration file. For example, the following command creates a custom speech model and stores the URL of the new model in a configuration file. The next command waits until the model at that URL is ready for use before returning.

```console
spx csr model create --name "Example 4" --datasets @my.datasets.txt --output url @my.model.txt
spx csr model status --model @my.model.txt --wait
```

The following example writes two URLs to the `@my.datasets.txt` configuration file. In this scenario, `--output` can include an optional **add** keyword to create a configuration file or append to the existing one.


```console
spx csr dataset create --name "LM" --kind Language --content https://crbn.us/data.txt --output url @my.datasets.txt
spx csr dataset create --name "AM" --kind Acoustic --content https://crbn.us/audio.zip --output add url @my.datasets.txt

spx config @my.datasets.txt
```

For more details about datastore files, including use of default configuration files (`@spx.default`, `@default.config`, and `@*.default.config` for command-specific default settings), enter this command:

```console
spx help advanced setup
```

## Next steps 

* [Batch operations with the Speech CLI](./spx-batch-operations.md)