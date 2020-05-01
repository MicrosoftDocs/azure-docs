---
title: Task preset for Azure Media Indexer
description: This topic gives an overview of task preset for Azure Media Services Media Indexer.
services: media-services
documentationcenter: ''
author: Asolanki
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 03/14/2019
ms.author: juliako
---
# Task preset for Azure Media Indexer 

Azure Media Indexer is a Media Processor that you use to perform the following tasks: make media files and content searchable, generate closed captioning tracks and keywords, index asset files that are part of your asset.

This topic describes the task preset that you need to pass to your indexing job. For complete example, see [Indexing media files with Azure Media Indexer](media-services-index-content.md).

## Azure Media Indexer Configuration XML

The following table explains elements and attributes of the configuration XML.

|Name|Require|Description|
|---|---|---|
|Input|true|Asset file(s) that you want to index.<br/>Azure Media Indexer supports the following media file formats: MP4, MOV, WMV, MP3, M4A, WMA, AAC, WAV. <br/><br/>You can specify the file name (s) in the **name** or **list** attribute of the **input** element (as shown below). If you do not specify which asset file to index, the primary file is picked. If no primary asset file is set, the first file in the input asset is indexed.<br/><br/>To explicitly specify the asset file name, do:<br/>```<input name="TestFile.wmv" />```<br/><br/>You can also index multiple asset files at once (up to 10 files). To do this:<br/>- Create a text file (manifest file) and give it an .lst extension.<br/>- Add a list of all the asset file names in your input asset to this manifest file.<br/>- Add (upload) the manifest file to the asset.<br/>- Specify the name of the manifest file in the input’s list attribute.<br/>```<input list="input.lst">```<br/><br/>**Note:** If you add more than 10 files to the manifest file, the indexing job will fail with the 2006 error code.|
|metadata|false|Metadata for the specified asset file(s).<br/>```<metadata key="..." value="..." />```<br/><br/>You can supply values for predefined keys. <br/><br/>Currently, the following keys are supported:<br/><br/>**title** and **description** - used to update the language model to improve speech recognition accuracy.<br/>```<metadata key="title" value="[Title of the media file]" /><metadata key="description" value="[Description of the media file]" />```<br/><br/>**username** and **password** - used for authentication when downloading internet files via http or https.<br/>```<metadata key="username" value="[UserName]" /><metadata key="password" value="[Password]" />```<br/>The username and password values apply to all media URLs in the input manifest.|
|features<br/><br/>Added in version 1.2. Currently, the only supported feature is speech recognition ("ASR").|false|The Speech Recognition feature has the following settings keys:<br/><br/>Language:<br/>- The natural language to be recognized in the multimedia file.<br/>- English, Spanish<br/><br/>CaptionFormats:<br/>- a semicolon-separated list of the desired output caption formats (if any)<br/>- ttml;webvtt<br/><br/><br/>GenerateKeywords:<br/>- A boolean flag specifying whether or not a keyword XML file is required.<br/>- True; False.|

## Azure Media Indexer configuration XML example

```	
<?xml version="1.0" encoding="utf-8"?>  
<configuration version="2.0">  
  <input>  
    <metadata key="title" value="[Title of the media file]" />  
    <metadata key="description" value="[Description of the media file]" />  
  </input>  
  <settings>  
  </settings>  
  
  <features>  
    <feature name="ASR">    
      <settings>  
        <add key="Language" value="English"/>  
        <add key="GenerateKeywords" value ="true" />  
      </settings>  
    </feature>  
  </features>  
  
</configuration>  
```
  
## Next steps

See [Indexing media files with Azure Media Indexer](media-services-index-content.md).

