---
author: eric-urban
ms.service: cognitive-services
ms.topic: include
ms.date: 12/27/2021
ms.author: eur
---

## Speech CLI (also known as SPX)

>[!NOTE]
>Get started with the Azure Speech service command line interface (CLI) [here](../../spx-basics.md). The CLI enables you to use the Azure Speech service without writing any code.

## Speech CLI: 2021-May release

### New features

- SPX now supports Profile, Speaker ID and Speaker verification - Try `spx profile` and `spx speaker` from the SPX command line.
- We also added Dialog support - Try `spx dialog` from the SPX command line.
- SPX help improvements. Please give us feedback about how this works for you by opening a [GitHub issue](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues?q=is%3Aissue+is%3Aopen).
- We've decreased the size of the SPX .NET tool install.

**COVID-19 abridged testing**:

As the ongoing pandemic continues to require our engineers to work from home, pre-pandemic manual verification scripts have been significantly reduced. We test on fewer devices with fewer configurations, and the likelihood of environment-specific bugs slipping through may be increased. We still rigorously validate with a large set of automation. In the unlikely event that we missed something, please let us know on [GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues?q=is%3Aissue+is%3Aopen).<br>
Stay healthy!

## Speech CLI: 2021-March release

### New features

- Added `spx intent` command for intent recognition, replacing `spx recognize intent`.
- Recognize and intent can now use Azure functions to calculate word error rate using `spx recognize --wer url <URL>`.
- Recognize can now output results as VTT files using `spx recognize --output vtt file <FILENAME>`.
- Sensitive key info now obscured in debug/verbose output.
- Added URL checking and error message for content field in batch transcription create.

**COVID-19 abridged testing**:

As the ongoing pandemic continues to require our engineers to work from home, pre-pandemic manual verification scripts have been significantly reduced. We test on fewer devices with fewer configurations, and the likelihood of environment-specific bugs slipping through may be increased. We still rigorously validate with a large set of automation. In the unlikely event that we missed something, please let us know on [GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues?q=is%3Aissue+is%3Aopen).<br>
Stay healthy!

## Speech CLI: 2021-January release

**New features**
- Speech CLI is now available as a [NuGet package](https://www.nuget.org/packages/Microsoft.CognitiveServices.Speech.CLI/) and can be installed via .NET CLI as a .NET global tool you can call from the shell/command line.
- The [Custom Speech DevOps Template repo](https://github.com/Azure-Samples/Speech-Service-DevOps-Template) has been updated to use Speech CLI for its Custom Speech workflows.

**COVID-19 abridged testing**:
As the ongoing pandemic continues to require our engineers to work from home, pre-pandemic manual verification scripts have been significantly reduced. We test on fewer devices with fewer configurations, and the likelihood of environment-specific bugs slipping through may be increased. We still rigorously validate with a large set of automation. In the unlikely event that we missed something, please let us know on [GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues?q=is%3Aissue+is%3Aopen).<br>
Stay healthy!

## Speech CLI: 2020-October release
SPX is the command line interface to use the Azure Speech service without writing code.
Download the latest version [here](../../spx-basics.md). <br>

**New features**
- `spx csr dataset upload --kind audio|language|acoustic` – create datasets from local data, not just from URLs.
- `spx csr evaluation create|status|list|update|delete` – compare new models against baseline truth/other models.
- `spx * list` – supports non-paged experience (doesn't require --top X --skip X).
- `spx * --http header A=B` – support custom headers (added for Office for custom authentication).
- `spx help` – improved text and back-tick text color coded (blue).


## Speech CLI: 2020-June release
-   Added in-CLI help search features:
    -   `spx help find --text TEXT`
    -   `spx help find --topic NAME`
-   Updated to work with newly deployed v3.0 Batch and Custom Speech APIs:
    -   `spx help batch examples`
    -   `spx help csr examples`

**COVID-19 abridged testing:**
Due to working remotely over the last few weeks, we couldn't do as much manual verification testing as we normally do. We haven't made any changes we think could have broken anything, and our automated tests all passed. In the unlikely event that we missed something, please let us know on [GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues?q=is%3Aissue+is%3Aopen).<br>
Stay healthy!


## Speech CLI (Also Know As SPX): 2020-May release

**SPX** is a new command line tool that allows you to perform recognition, synthesis, translation, batch transcription, and custom speech management from the command line. Use it to test the Speech Service, or to script the Speech Service tasks you need to perform. Download the tool and read the documentation [here](../../spx-overview.md).
