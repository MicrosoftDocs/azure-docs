---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 01/08/2022
ms.author: eur
---

### Speech CLI 1.36.0: March 2024 release
Updated to use Speech SDK 1.36.0
#### New features
* none
#### Bug fixes
* none

### Speech CLI 1.35.0: February 2024 release
Updated to use Speech SDK 1.35.0
#### New features
* none
#### Bug fixes
* Update JMESPath dependency to latest

### Speech CLI 1.34.0: November 2023 release
Updated to use Speech SDK 1.34.0

### Speech CLI 1.33.0: October 2023 release
Updated to use Speech SDK 1.34.0

### Speech CLI 1.31.0: August 2023 release

Updated to use Speech SDK 1.31.0

### Speech CLI 1.30.0: July 2023 release

Updated to use Speech SDK 1.30.0

### Speech CLI 1.29.0: June 2023 release

Updated to use Speech SDK 1.29.0

### Speech CLI 1.28.0: May 2023 release

Updated to use Speech SDK 1.28.0

### Speech CLI 1.27.0: April 2023 release

#### Updates

* Updated to use Speech SDK 1.27.0 
* Update default endpoint to use v3.1 REST APIs for custom speech Recognition and Batch Speech Recognition.

#### Bug fixes

* Fixes related to how query parameters are parsed/configured.

### Speech CLI 1.26.0: March 2023 release

Updated to use Speech SDK 1.26.0.

### Speech CLI 1.25.0: January 2023 release

Updated to use Speech SDK 1.25.0.

### Speech CLI 1.24.0: October 2022 release

Uses Speech SDK 1.24.0.

#### New features

- Expanded "spx check" to support JMESPath queries against all spx events

#### Bug fixes

- Various improvements to robustness against JMESPath query evaluations
- Fix for truncations to file writes that may occur on resource-constrained machines

### Speech CLI 1.23.0: July 2022 release

Uses Speech SDK 1.23.0.

#### New features

- Better caption (`--output vtt` and `--output srt`) large result splitting (37 char max, 3 lines)
- Documented `spx synthesize` `--format` options (see `spx help synthesize format`)
- Documented most of `spx csr` commands/options (see `spx help csr`)
- Added `spx csr model copy` command (see `spx help csr model copy`)
- Added `--check result` option using JMES queries (see `spx help check result`)
- Improved error messages when specifying invalid command options
- Moved from .NET Core 3.1 to .NET 6.0. In order to run Speech CLI, you'll need to install the [.NET 6.0 Runtime](https://dotnet.microsoft.com/download/dotnet/6.0/runtime) (or above).

#### Bug fixes

- Updated all URLs to remove language (for example, "en-US")
- Fixed version info to report properly in all cases (previously it sometimes showed a blank)

### Speech CLI 1.22.0: June 2022 release

Uses Speech SDK 1.22.0.

#### New features

- Added `spx init` command to guide users through the Speech resource key creation without going to Azure Web Portal.
- Speech docker containers now have Azure CLI included, so the `spx init` command works out of the box.
- Added timestamp as an event output option, to make SPX more useful when calculating latencies.


### Speech CLI 1.21.0: April 2022 release

Uses Speech SDK 1.21.0.

#### New features
- WEBVTT Caption generation
    - Added `--output vtt` support to `spx translate`
    - Supports `--output vtt file FILENAME` to override default VTT FILENAME
    - Supports `--output vtt file -` to write to standard output
    - Individual VTT files are created for each target language (for example `--target en;de;fr`)
- SRT Caption generation
    - Added `--output srt` support to `spx recognize`, `spx intent`, and `spx translate`
    - Supports `--output srt file FILENAME` to override default SRT FILENAME
    - Supports `--output srt file -` to write to standard output
    - For `spx translate`, individual SRT files are created for each target language (for example `--target en;de;fr`)

#### Bug fixes
- Corrected WEBVTT timespan output to properly use `hh:mm:ss.fff` format


### Speech CLI 1.20.0: January 2022 release

#### New features
- Speaker recognition
    - `spx profile enroll` and `spx speaker [identify/verify]` now support microphone input
- Intent recognition (`spx intent`)
    - `--keyword FILE.table`
    - `--pattern` and `--patterns`
    - `--output all/each intentid`
    - `--output all/each entity json`
    - `--output all/each ENTITY entity`
    - `--once`, `--once+`, `--continuous` (continuous now default)
    - `--output all/each connection EVENT`
    - `--output all/each connection message` (for example, `text`, `path`)
- CLI console output expectation checking/authoring:
    - `--expect PATTERN` and `--not expect PATTERN` support on all commands
    - `--auto expect` to assist authoring expected patterns
- SDK logging output expectation checking/authoring
    - `--log expect PATTERN` and `--not log expect PATTERN` support on all commands
    - `--log auto expect [FILTER]` support on all commands
    - `--log FILE` support on `spx profile` and `spx speaker`
- Audio file input
    - `--format ANY` support on all commands
    - `--file -` support (reading from standard input, enabling pipe scenarios)
- Audio file output
    - `--audio output -` Writing to standard output, enabling pipe scenarios
- Output files
    - `--output all/each file -` Write to standard output
    - `--output batch file -` Write to standard output
    - `--output vtt file -` Write to standard output
    - `--output json file -` Write to standard output, for `spx csr` and `spx batch` commands
- Output properties
    - `--output […] result XXX property` (PropertyId or string)
    - `--output […] connection message received XXX property` (PropertyId or string)
    - `--output […] recognizer XXX property` (PropertyId or string)
- Azure WebJob integration
    - `spx webjob` now follows sub-command pattern
    - Updated WebJob help to reflect the sub-command pattern (see `spx help webjob`)


#### Bug fixes

- Fixed bug when both `--output vtt FILE` and `--output batch FILE` are used at the same time
- `spx [...] --zip ZIPFILENAME` now includes all binaries required for all scenarios (if present)
- `spx profile` and `spx speaker` commands now return detailed error information on cancellation


### 2021-May release

#### New features

- Added support for Profile, Speaker ID, and Speaker verification - Try `spx profile` and `spx speaker` from the command-line.
- We also added Dialog support - Try `spx dialog` from the command-line.
- Improved `spx` help. Please give us feedback about how this works for you by opening a [GitHub issue](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues?q=is%3Aissue+is%3Aopen).
- We've decreased the size of the .NET tool install.

#### COVID-19 abridged testing

As the ongoing pandemic continues to require our engineers to work from home, pre-pandemic manual verification scripts have been significantly reduced. We test on fewer devices with fewer configurations, and the likelihood of environment-specific bugs slipping through may be increased. We still rigorously validate with a large set of automation. In the unlikely event that we missed something, please let us know on [GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues?q=is%3Aissue+is%3Aopen).<br>
Stay healthy!

### 2021-March release

#### New features

- Added `spx intent` command for intent recognition, replacing `spx recognize intent`.
- Recognize and intent can now use Azure functions to calculate word error rate using `spx recognize --wer url <URL>`.
- Recognize can now output results as VTT files using `spx recognize --output vtt file <FILENAME>`.
- Sensitive key info now obscured in debug/verbose output.
- Added URL checking and error message for content field in batch transcription create.

#### COVID-19 abridged testing

As the ongoing pandemic continues to require our engineers to work from home, pre-pandemic manual verification scripts have been significantly reduced. We test on fewer devices with fewer configurations, and the likelihood of environment-specific bugs slipping through may be increased. We still rigorously validate with a large set of automation. In the unlikely event that we missed something, please let us know on [GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues?q=is%3Aissue+is%3Aopen).<br>
Stay healthy!

### 2021-January release

#### New features
- Speech CLI is now available as a [NuGet package](https://www.nuget.org/packages/Microsoft.CognitiveServices.Speech.CLI/) and can be installed via .NET CLI as a .NET global tool you can call from the shell/command-line.
- The [custom speech DevOps Template repo](https://github.com/Azure-Samples/Speech-Service-DevOps-Template) has been updated to use Speech CLI for its custom speech workflows.

#### COVID-19 abridged testing
As the ongoing pandemic continues to require our engineers to work from home, pre-pandemic manual verification scripts have been significantly reduced. We test on fewer devices with fewer configurations, and the likelihood of environment-specific bugs slipping through may be increased. We still rigorously validate with a large set of automation. In the unlikely event that we missed something, please let us know on [GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues?q=is%3Aissue+is%3Aopen).<br>
Stay healthy!

### 2020-October release
SPX is the command-line interface to use the Speech service without writing code.
Download the latest version [here](../../spx-basics.md). <br>

#### New features
- `spx csr dataset upload --kind audio|language|acoustic` – create datasets from local data, not just from URLs.
- `spx csr evaluation create|status|list|update|delete` – compare new models against baseline truth/other models.
- `spx * list` – supports non-paged experience (doesn't require --top X --skip X).
- `spx * --http header A=B` – support custom headers (added for Office for custom authentication).
- `spx help` – improved text and back-tick text color coded (blue).


### 2020-June release
-   Added in-CLI help search features:
    -   `spx help find --text TEXT`
    -   `spx help find --topic NAME`
-   Updated to work with newly deployed v3.0 Batch and custom speech APIs:
    -   `spx help batch examples`
    -   `spx help csr examples`

#### COVID-19 abridged testing
Due to working remotely over the last few weeks, we couldn't do as much manual verification testing as we normally do. We haven't made any changes we think could have broken anything, and our automated tests all passed. In the unlikely event that we missed something, please let us know on [GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues?q=is%3Aissue+is%3Aopen).<br>
Stay healthy!


### Speech CLI (Also known as SPX): 2020-May release

**SPX** is a new command-line tool that allows you to perform recognition, synthesis, translation, batch transcription, and custom speech management from the command-line. Use it to test the Speech service, or to script the Speech service tasks you need to perform. Download the tool and read the documentation [here](../../spx-overview.md).
