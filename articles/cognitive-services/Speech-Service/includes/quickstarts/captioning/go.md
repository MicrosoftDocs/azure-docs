---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 02/12/2022
ms.author: eur
---

[!INCLUDE [Header](../../common/go.md)]

[!INCLUDE [Introduction](intro.md)]

## Prerequisites

[!INCLUDE [Prerequisites](../../common/azure-prerequisites.md)]

## Set up the environment

Install the [Speech SDK for Go](../../../quickstarts/setup-platform.md?pivots=programming-language-go&tabs=dotnet%252cwindows%252cjre%252cbrowser). Check the [platform-specific installation instructions](../../../quickstarts/setup-platform.md?pivots=programming-language-go) for any more requirements.

## Create captions from speech

Follow these steps to create a new GO module.

1. Open a command prompt where you want the new module, and create a new file named `speech-recognition.go`.
1. Replace the contents of `speech-recognition.go` with the code that you copy from the [captioning sample](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/captioning_sample/scenarios/csharp/dotnet/captioning/Program.cs) at GitHub.

Run the following commands to create a `go.mod` file that links to components hosted on GitHub:

```cmd
go mod init speech-recognition
go get github.com/Microsoft/cognitive-services-speech-sdk-go
```

Now build and run the code:

```cmd
go build
go run speech-recognition  -- [-f] [-h] [-i file] [-l languages] [-m] [-o file] [-p phrases] [-q] [-r number] [-s] [-t] [-u] YourSubscriptionKey YourServiceRegion
```

Usage options include:

- `-h`: Show this help and stop

- `-o file`: Output captions to the specified `file`. This flag is required.

- `-f`: Removes profane words. This setting overrides `-m` if set.

- `-m`: Replaces letters in profane words with asterisk (*) characters. This setting is overridden by `-f` if set.

- `-i`: Input speech from the specified `file`. If this is not set, audio input is from the default microphone.

- `-l languages`: Enable language identification for specified *languages`.  The comma delimited phrases must be in quotes. Example: "en-US,ja-JP"

- `-p phrases`: Add specified `phrases` to the phrase list. The semicolon delimited phrases must be in quotes. Example: "Constoso;Jessie;Rehaan"

- `-q`: Suppress console output (except errors)

- `-r number`: Set stable partial result threshold to the `number`. 

- `-s`: Emit SRT caption format instead of the default WebVTT format.

- `-t`: Capitalize intermediate results


## Clean up resources

[!INCLUDE [Delete resource](../../common/delete-resource.md)]
