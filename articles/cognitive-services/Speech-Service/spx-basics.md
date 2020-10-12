---
title: "Speech CLI basics"
titleSuffix: Azure Cognitive Services
description: Learn how to use the Speech CLI command tool to work with the Speech Service with no code and minimal setup. 
services: cognitive-services
author: trevorbye
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 04/04/2020
ms.author: trbye
---

# Learn the basics of the Speech CLI

In this article, you learn the basic usage patterns of the Speech CLI, a command line tool to use the Speech service without writing code. You can quickly test out the main features of the Speech service, without creating development environments or writing any code, to see if your use-cases can be adequately met. Additionally, the Speech CLI is production ready and can be used to automate simple workflows in the Speech service, using `.bat` or shell scripts.

[!INCLUDE [](includes/spx-setup.md)]

## Basic usage

This section shows a few basic SPX commands that are often useful for first-time testing and experimentation. Start by viewing the help built in to the tool by running the following command.

```shell
spx
```

Notice **see:** help topics listed right of command parameters. You can enter these commands to get detailed help about sub-commands.

You can search help topics by keyword. For example, enter the following command to see a list of Speech CLI usage examples:

```shell
spx help find --topics "examples"
```

Enter the following command to see options for the recognize command:

```shell
spx help recognize
```

Now use the Speech service to perform some speech recognition using your default microphone by running the following command.

```shell
spx recognize --microphone
```

After entering the command, SPX will begin listening for audio on the current active input device, and stop after you press `ENTER`. The recorded speech is then recognized and converted to text in the console output. Text-to-speech synthesis is also easy to do using the Speech CLI. 

Running the following command will take the entered text as input, and output the synthesized speech to the current active output device.

```shell
spx synthesize --text "Testing synthesis using the Speech CLI" --speakers
```

In addition to speech recognition and synthesis, you can also do speech translation with the Speech CLI. Similar to the speech recognition command above, run the following command to capture audio from your default microphone, and perform translation to text in the target language.

```shell
spx translate --microphone --source en-US --target ru-RU --output file C:\some\file\path\russian_translation.txt
```

In this command, you specify both the source (language to translate **from**), and the target (language to translate **to**) languages. Using the `--microphone` argument will listen to audio on the current active input device, and stop after you press `ENTER`. The output is a text translation to the target language, written to a text file.

> [!NOTE]
> See the [language and locale article](language-support.md) for a list of all supported languages with their corresponding locale codes.

### Configuration files in the datastore

The Speech CLI can read and write multiple settings in configuration files, which are stored in the local Speech CLI datastore, and are named within Speech CLI calls using a @ symbol. Speech CLI attempts to save a new setting in a new `./spx/data` subdirectory it creates in the current working directory.
When seeking a configuration value, Speech CLI looks in your current working directory, then in the `./spx/data` path.
Previously, you used the datastore to save your `@key` and `@region` values, so you did not need to specify them with each command line call.
You can also use configuration files to store your own configuration settings, or even use them to pass URLs or other dynamic content generated at runtime.

This section shows use of a configuration file in the local datastore to store and fetch command settings using `spx config`, and store output from Speech CLI using the `--output` option.

The following example clears the `@my.defaults` configuration file,
adds key-value pairs for **key** and **region** in the file, and uses the configuration
in a call to `spx recognize`.

```shell
spx config @my.defaults --clear
spx config @my.defaults --add key 000072626F6E20697320636F6F6C0000
spx config @my.defaults --add region westus

spx config @my.defaults

spx recognize --nodefaults @my.defaults --file hello.wav
```

You can also write dynamic content to a configuration file. For example, the following command creates a custom speech model and stores the URL
of the new model in a configuration file. The next command waits until the model at that URL is ready for use before returning.

```shell
spx csr model create --name "Example 4" --datasets @my.datasets.txt --output url @my.model.txt
spx csr model status --model @my.model.txt --wait
```

The following example writes two URLs to the `@my.datasets.txt` configuration file.
In this scenario, `--output` can include an optional **add** keyword to create a configuration file or append to the existing one.


```shell
spx csr dataset create --name "LM" --kind Language --content https://crbn.us/data.txt --output url @my.datasets.txt
spx csr dataset create --name "AM" --kind Acoustic --content https://crbn.us/audio.zip --output add url @my.datasets.txt

spx config @my.datasets.txt
```

For more details about datastore files, including use of default configuration files (`@spx.default`, `@default.config`, and `@*.default.config` for command-specific default settings), enter this command:

```shell
spx help advanced setup
```

## Batch operations

The commands in the previous section are great for quickly seeing how the Speech service works. However, when assessing whether or not your use-cases can be met, you likely need to perform batch operations against a range of input you already have, to see how the service handles a variety of scenarios. This section shows how to:

* Run batch speech recognition on a directory of audio files
* Iterate through a `.tsv` file and run batch text-to-speech synthesis

## Batch speech recognition

If you have a directory of audio files, it's easy with the Speech CLI to quickly run batch-speech recognition. Simply run the following command, pointing to your directory with the `--files` command. In this example, you append `\*.wav` to the directory to recognize all `.wav` files present in the dir. Additionally, specify the `--threads` argument to run the recognition on 10 parallel threads.

> [!NOTE]
> The `--threads` argument can be also used in the next section for `spx synthesize` commands, and the available threads will depend on the CPU and its current load percentage.

```shell
spx recognize --files C:\your_wav_file_dir\*.wav --output file C:\output_dir\speech_output.tsv --threads 10
```

The recognized speech output is written to `speech_output.tsv` using the `--output file` argument. The following is an example of the output file structure.

```output
audio.input.id    recognizer.session.started.sessionid    recognizer.recognized.result.text
sample_1    07baa2f8d9fd4fbcb9faea451ce05475    A sample wave file.
sample_2    8f9b378f6d0b42f99522f1173492f013    Sample text synthesized.
```

## Batch text-to-speech synthesis

The easiest way to run batch text-to-speech is to create a new `.tsv` (tab-separated-value) file, and leverage the `--foreach` command in the Speech CLI. Consider the following file `text_synthesis.tsv`:

```output
audio.output    text
C:\batch_wav_output\wav_1.wav    Sample text to synthesize.
C:\batch_wav_output\wav_2.wav    Using the Speech CLI to run batch-synthesis.
C:\batch_wav_output\wav_3.wav    Some more text to test capabilities.
```

 Next, you run a command to point to `text_synthesis.tsv`, perform synthesis on each `text` field, and write the result to the corresponding `audio.output` path as a `.wav` file. 

```shell
spx synthesize --foreach in @C:\your\path\to\text_synthesis.tsv
```

This command is the equivalent of running `spx synthesize --text Sample text to synthesize --audio output C:\batch_wav_output\wav_1.wav` **for each** record in the `.tsv` file. A couple things to note:

* The column headers, `audio.output` and `text`, correspond to the command line arguments `--audio output` and `--text`, respectively. Multi-part command line arguments like `--audio output` should be formatted in the file with no spaces, no leading dashes, and periods separating strings, e.g. `audio.output`. Any other existing command line arguments can be added to the file as additional columns using this pattern.
* When the file is formatted in this way, no additional arguments are required to be passed to `--foreach`.
* Ensure to separate each value in the `.tsv` with a **tab**.

However, if you have a `.tsv` file like the following example, with column headers that **do not match** command line arguments:

```output
wav_path    str_text
C:\batch_wav_output\wav_1.wav    Sample text to synthesize.
C:\batch_wav_output\wav_2.wav    Using the Speech CLI to run batch-synthesis.
C:\batch_wav_output\wav_3.wav    Some more text to test capabilities.
```

You can override these field names to the correct arguments using the following syntax in the `--foreach` call. This is the same call as above.

```shell
spx synthesize --foreach audio.output;text in @C:\your\path\to\text_synthesis.tsv
```

## Next steps

* Complete the [speech recognition](./quickstarts/speech-to-text-from-microphone.md) or [speech synthesis](./quickstarts/text-to-speech.md) quickstarts using the SDK.
