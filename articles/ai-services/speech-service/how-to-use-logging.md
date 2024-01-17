---
title: Speech SDK logging - Speech service
titleSuffix: Azure AI services
description: Learn about how to enable logging in the Speech SDK (C++, C#, Python, Objective-C, Java).
author: eric-urban
ms.author: eur
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 07/05/2019
ms.devlang: cpp
# ms.devlang: cpp, csharp, golang, java, javascript, objective-c, python
ms.custom: devx-track-csharp, devx-track-extended-java, devx-track-python
---

# Enable logging in the Speech SDK

Logging to file is an optional feature for the Speech SDK. During development logging provides additional information and diagnostics from the Speech SDK's core components. It can be enabled by setting the property `Speech_LogFilename` on a speech configuration object to the location and name of the log file. Logging is handled by a static class in Speech SDK’s native library. You can turn on logging for any Speech SDK recognizer or synthesizer instance. All instances in the same process write log entries to the same log file.

## Sample

The log file name is specified on a configuration object. Taking the `SpeechConfig` as an example and assuming that you've created an instance called `speechConfig`:

```csharp
speechConfig.SetProperty(PropertyId.Speech_LogFilename, "LogfilePathAndName");
```

```java
speechConfig.setProperty(PropertyId.Speech_LogFilename, "LogfilePathAndName");
```

```C++
speechConfig->SetProperty(PropertyId::Speech_LogFilename, "LogfilePathAndName");
```

```Python
speech_config.set_property(speechsdk.PropertyId.Speech_LogFilename, "LogfilePathAndName")
```

```objc
[speechConfig setPropertyTo:@"LogfilePathAndName" byId:SPXSpeechLogFilename];
```

```go
import ("github.com/Microsoft/cognitive-services-speech-sdk-go/common")

speechConfig.SetProperty(common.SpeechLogFilename, "LogfilePathAndName")
```

You can create a recognizer from the configuration object. This will enable logging for all recognizers.

> [!NOTE]
> If you create a `SpeechSynthesizer` from the configuration object, it will not enable logging. If logging is enabled though, you will also receive diagnostics from the `SpeechSynthesizer`.

JavaScript is an exception where the logging is enabled via SDK diagnostics as shown in the following code snippet:

```javascript
sdk.Diagnostics.SetLoggingLevel(sdk.LogLevel.Debug);
sdk.Diagnostics.SetLogOutputPath("LogfilePathAndName");
```

## Create a log file on different platforms

For Windows or Linux, the log file can be in any path the user has write permission for. Write permissions to file system locations in other operating systems may be limited or restricted by default.

### Universal Windows Platform (UWP)

UWP applications need to be places log files in one of the application data locations (local, roaming, or temporary). A log file can be created in the local application folder:

```csharp
StorageFolder storageFolder = ApplicationData.Current.LocalFolder;
StorageFile logFile = await storageFolder.CreateFileAsync("logfile.txt", CreationCollisionOption.ReplaceExisting);
speechConfig.SetProperty(PropertyId.Speech_LogFilename, logFile.Path);
```

Within a Unity UWP application, a log file can be created using the application persistent data path folder as follows:

```csharp
#if ENABLE_WINMD_SUPPORT
    string logFile = Application.persistentDataPath + "/logFile.txt";
    speechConfig.SetProperty(PropertyId.Speech_LogFilename, logFile);
#endif
```
For more about file access permissions in UWP applications, see [File access permissions](/windows/uwp/files/file-access-permissions).

### Android

You can save a log file to either internal storage, external storage, or the cache directory. Files created in the internal storage or the cache directory are private to the application. It is preferable to create a log file in external storage.

```java
File dir = context.getExternalFilesDir(null);
File logFile = new File(dir, "logfile.txt");
speechConfig.setProperty(PropertyId.Speech_LogFilename, logFile.getAbsolutePath());
```

The code above will save a log file to the external storage in the root of an application-specific directory. A user can access the file with the file manager (usually in `Android/data/ApplicationName/logfile.txt`). The file will be deleted when the application is uninstalled.

You also need to request `WRITE_EXTERNAL_STORAGE` permission in the manifest file:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="...">
  ...
  <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
  ...
</manifest>
```

Within a Unity Android application, the log file can be created using the application persistent data path folder as follows:

```csharp
string logFile = Application.persistentDataPath + "/logFile.txt";
speechConfig.SetProperty(PropertyId.Speech_LogFilename, logFile);
```
In addition, you need to also set write permission in your Unity Player settings for Android to "External (SDCard)". The log will be written 
to a directory you can get using a tool such as AndroidStudio Device File Explorer. The exact directory path may vary between Android devices, 
location is typically the `sdcard/Android/data/your-app-packagename/files` directory.

More about data and file storage for Android applications is available [here](https://developer.android.com/guide/topics/data/data-storage.html).

#### iOS

Only directories inside the application sandbox are accessible. Files can be created in the documents, library, and temp directories. Files in the documents directory can be made available to a user. 

If you are using Objective-C on iOS, use the following code snippet to create a log file in the application document directory:

```objc
NSString *filePath = [
  [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) firstObject]
    stringByAppendingPathComponent:@"logfile.txt"];
[speechConfig setPropertyTo:filePath byId:SPXSpeechLogFilename];
```

To access a created file, add the below properties to the `Info.plist` property list of the application:

```xml
<key>UIFileSharingEnabled</key>
<true/>
<key>LSSupportsOpeningDocumentsInPlace</key>
<true/>
```

If you're using Swift on iOS, please use the following code snippet to enable logs:
```swift
let documentsDirectoryPathString = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true).first!
let documentsDirectoryPath = NSURL(string: documentsDirectoryPathString)!
let logFilePath = documentsDirectoryPath.appendingPathComponent("swift.log")
self.speechConfig!.setPropertyTo(logFilePath!.absoluteString, by: SPXPropertyId.speechLogFilename)
```

More about iOS File System is available [here](https://developer.apple.com/library/archive/documentation/FileManagement/Conceptual/FileSystemProgrammingGuide/FileSystemOverview/FileSystemOverview.html).

## Logging with multiple recognizers

Although a log file output path is specified as a configuration property into a `SpeechRecognizer` or other SDK object, SDK logging is a singleton, *process-wide* facility with no concept of individual instances. You can think of this as the `SpeechRecognizer` constructor (or similar) implicitly calling a static and internal "Configure Global Logging" routine with the property data available in the corresponding `SpeechConfig`.

This means that you can't, as an example, configure six parallel recognizers to output simultaneously to six separate files. Instead, the latest recognizer created will configure the global logging instance to output to the file specified in its configuration properties and all SDK logging will be emitted to that file.

This also means that the lifetime of the object that configured logging isn't tied to the duration of logging. Logging will not stop in response to the release of an SDK object and will continue as long as no new logging configuration is provided. Once started, process-wide logging may be stopped by setting the log file path to an empty string when creating a new object.

To reduce potential confusion when configuring logging for multiple instances, it may be useful to abstract control of logging from objects doing real work. An example pair of helper routines:

```cpp
void EnableSpeechSdkLogging(const char* relativePath)
{
	auto configForLogging = SpeechConfig::FromSubscription("unused_key", "unused_region");
	configForLogging->SetProperty(PropertyId::Speech_LogFilename, relativePath);
	auto emptyAudioConfig = AudioConfig::FromStreamInput(AudioInputStream::CreatePushStream());
	auto temporaryRecognizer = SpeechRecognizer::FromConfig(configForLogging, emptyAudioConfig);
}

void DisableSpeechSdkLogging()
{
	EnableSpeechSdkLogging("");
}
```

## Next steps

> [!div class="nextstepaction"]
> [Explore our samples on GitHub](https://aka.ms/csspeech/samples)
