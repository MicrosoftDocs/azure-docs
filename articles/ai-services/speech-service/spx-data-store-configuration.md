---
title: "Configure the Speech CLI datastore - Speech service"
titleSuffix: Azure AI services
description: Learn how to configure the Speech CLI datastore.
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: reference
ms.date: 05/01/2022
ms.author: eur
ms.custom: mode-api
---

# Configure the Speech CLI datastore

The [Speech CLI](spx-basics.md) can rely on settings in configuration files, which you can refer to using a `@` symbol. The Speech CLI saves a new setting in a new `./spx/data` subdirectory that is created in the current working directory for the Speech CLI. When looking for a configuration value, the Speech CLI searches your current working directory, then in the datastore at `./spx/data`, and then in other datastores, including a final read-only datastore in the `spx` binary. 

In the [Speech CLI quickstart](spx-basics.md), you used the datastore to save your `@key` and `@region` values, so you did not need to specify them with each `spx` command. Keep in mind, that you can use configuration files to store your own configuration settings, or even use them to pass URLs or other dynamic content generated at runtime.

For more details about datastore files, including use of default configuration files (`@spx.default`, `@default.config`, and `@*.default.config` for command-specific default settings), enter this command:

```console
spx help advanced setup
```

## nodefaults

The following example clears the `@my.defaults` configuration file, adds key-value pairs for **key** and **region** in the file, and uses the configuration in a call to `spx recognize`.

```console
spx config @my.defaults --clear
spx config @my.defaults --add key 000072626F6E20697320636F6F6C0000
spx config @my.defaults --add region westus

spx config @my.defaults

spx recognize --nodefaults @my.defaults --file hello.wav
```

## Dynamic configuration

You can also write dynamic content to a configuration file using the `--output` option. 

For example, the following command creates a custom speech model and stores the URL of the new model in a configuration file. The next command waits until the model at that URL is ready for use before returning.

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

## SPX config add

For readability, flexibility, and convenience, you can use a preset configuration with select output options. 

For example, you might have the following requirements for [captioning](captioning-quickstart.md):
- Recognize from the input file `caption.this.mp4`.
- Output WebVTT and SRT captions to the files `caption.vtt` and `caption.srt` respectively.
- Output the `offset`, `duration`, `resultid`, and `text` of each recognizing event to the file `each.result.tsv`.

You can create a preset configuration named `@caption.defaults` as shown here:

```console
spx config @caption.defaults --clear
spx config @caption.defaults --add output.each.recognizing.result.offset=true
spx config @caption.defaults --add output.each.recognizing.result.duration=true
spx config @caption.defaults --add output.each.recognizing.result.resultid=true
spx config @caption.defaults --add output.each.recognizing.result.text=true
spx config @caption.defaults --add output.each.file.name=each.result.tsv
spx config @caption.defaults --add output.srt.file.name=caption.srt
spx config @caption.defaults --add output.vtt.file.name=caption.vtt
```

The settings are saved to the current directory in a file named `caption.defaults`. Here are the file contents:

```
output.each.recognizing.result.offset=true
output.each.recognizing.result.duration=true
output.each.recognizing.result.resultid=true
output.each.recognizing.result.text=true
output.all.file.name=output.result.tsv
output.each.file.name=each.result.tsv
output.srt.file.name=caption.srt
output.vtt.file.name=caption.vtt
```

Then, to generate [captions](captioning-quickstart.md), you can run this command that imports settings from the `@caption.defaults` preset configuration:

```console
spx recognize --file caption.this.mp4 --format any --output vtt --output srt @caption.defaults
```

Using the preset configuration as shown previously is similar to running the following command:

```console
spx recognize --file caption.this.mp4 --format any --output vtt file caption.vtt --output srt file caption.srt --output each file each.result.tsv --output all file output.result.tsv --output each recognizer recognizing result offset --output each recognizer recognizing duration --output each recognizer recognizing result resultid --output each recognizer recognizing text
```

## Next steps 

* [Batch operations with the Speech CLI](./spx-batch-operations.md)
