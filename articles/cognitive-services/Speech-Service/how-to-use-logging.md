---
title: Speech SDK logging
titleSuffix: Azure Cognitive Services
description: Enable logging in the Speech SDK.
services: cognitive-services
author: amitkumarshukla
manager: nitinme

ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 04/03/2019
ms.author: amishu
---
# Enable logging in the Speech SDK

Logging to file is an optional feature. During development it can help you to get additional information and diagnostic from the Speeck SDK core components. It can be enabled by setting the property `Speech_LogFilename` on a speech configuration object to the location and name of the log file. Logging will be activated once a recognizer is created from that configuration. It will be active on all recognizers and can't be disabled, you can't change the name of a log file during a running logging session.

## Availability

Logging is available in all supported Speech SDK programming languages, with the exception of JavaScript. Currently you can't start a logging session from a `SpeechSynthesizer`, but once a logging session has been started, you will also receive diagnostics from the `SpeechSynthesizer`.

## Sample

The log file name is specified on a configuration object. Taking the `SpeechConfig` as an exmple and assuming that you have create an instance called `config`:

  ```csharp
   config.SetProperty(PropertyId.Speech_LogFilename, "LogfilePathAndName");
   ```

  ```java
  config.setProperty(PropertyId.Speech_LogFilename, "LogfilePathAndName");
  ```

  ```C++
  config->SetProperty(PropertyId::Speech_LogFilename, "LogfilePathAndName");
  ```

  ```Python
  config.set_property(speechsdk.PropertyId.Speech_LogFilename, "LogfilePathAndName")
  ```

You can then create a recognizer from the config object. This will activate the logging functionality.

## Create a log file on different platforms

For Windows or Linux, the log file can be in any path that user has write permission. In other environments you have only access to certain file system locations by default.

### Universal Windows Platform (UWP)

To enable logging to file for UWP application, it is necessary to create a file in one of the application data locations (local, roaming or temporary) before starting a recognizer. For example, a log file can be created in an applications local folder like this:

  ```csharp
  StorageFolder storageFolder = ApplicationData.Current.LocalFolder;
  StorageFile logFile = await storageFolder.CreateFileAsync("logfile.txt", CreationCollisionOption.ReplaceExisting);
  config.SetProperty(PropertyId.Speech_LogFilename, logFile.Path);
  ```

More about file access permissions for UWP applications is available [here](https://docs.microsoft.com/en-us/windows/uwp/files/file-access-permissions).

### Android

It is possible to save a log file to internal storage, external storage, and the cache directory on Android. Files created in the internal storage or the cache directory are private to the application. It is preferable to create a log file in external storage. For example:

  ```java
  File dir = context.getExternalFilesDir(null);
  File logFile = new File(dir, "logfile.txt");
  config.setProperty(PropertyId.Speech_LogFilename, logFile.getAbsolutePath());
  ```

This will save a log file to the external storage in the root of an application-specific directory. A user can access the file with the file manager (usually in `Android/data/ApplicationName/logfile.txt`). The file will be deleted when the application is uninstalled.

It is also necessary to request `WRITE_EXTERNAL_STORAGE` permission in the manifest file:

  ```
  <manifest>
    ...
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    ...
  </manifest>
  ```

More about data and file storage for Android applications is available [here](https://developer.android.com/guide/topics/data/data-storage.html).

#### iOS

It is only possible to access the directories inside the application sandbox directory on iOS. Files can be created in the documents, library and temp directories. Files in the documents directory can be made available to a user. The following code snippet shows how to create a log file in the application document directory:

  ```objc
  NSString *filePath = [[NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) firstObject] stringByAppendingPathComponent:@"logfile.txt"];
  [speechConfig setPropertyTo:filePath byId:SPXSpeechLogFilename];
  ```

To access a created file, add the below properties to the property list of the application:

  ```
  <key>UIFileSharingEnabled</key>
  <true/>
  <key>LSSupportsOpeningDocumentsInPlace</key>
  <true/>
  ```

More about iOS File System is available [here](https://developer.apple.com/library/archive/documentation/FileManagement/Conceptual/FileSystemProgrammingGuide/FileSystemOverview/FileSystemOverview.html).

## Next steps

> [!div class="nextstepaction"]
> [Explore our samples on GitHub](https://aka.ms/csspeech/samples)
