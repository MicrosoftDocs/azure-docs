<properties linkid="develop-media-services-how-to-guides-create-media-processor" urlDisplayName="Create a Media Processor" pageTitle="How to Create a Media Processor - Azure" metaKeywords="" description="Learn how to create a media processor component to encode, convert format, encrypt, or decrypt media content for Azure Media Services. Code samples are written in C# and use the Media Services SDK for .NET." metaCanonical="" services="media-services" documentationCenter="" title="How to: Get a Media Processor Instance" authors="migree" solutions="" manager="" editor="" />

<tags ms.service="media-services" ms.workload="media" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="migree" />





<h1>How to: Get a Media Processor Instance</h1>
This article is one in a series introducing Azure Media Services programming. The previous topic was [How to: Create an Encrypted Asset and Upload into Storage](http://go.microsoft.com/fwlink/?LinkID=301733&clcid=0x409).

In Media Services a media processor is a component that handles a specific processing task, such as encoding, format conversion, encrypting, or decrypting media content. You typically create a media processor when you are creating a task to encode, encrypt, or convert the format of media content.

The following table provides the name and description of each available media processor.

<table border="2" cellspacing="0" cellpadding="5" style="border: 2px solid #000000;">
  <thead>
    <tr>
       <th>Media Processor Name</th>
       <th>Description</th>
	<th>More Information</th>
    </tr>
  </thead>
  <tbody>
    <tr>
       <td>Azure Media Encoder</td>
       <td>Lets you run encoding tasks using the Media Encoder.</td>
       <td><a href="http://msdn.microsoft.com/en-us/library/jj129582.aspx"> Task Preset Strings for the Azure Media Encoder</a></td>
    </tr>
    <tr>
        <td>Azure Media Packager</td>
        <td>Lets you convert media assets from .mp4 to smooth streaming format. Also, lets you convert media assets from smooth streaming to the Apple HTTP Live Streaming (HLS) format.</td>
		<td><a href="http://msdn.microsoft.com/en-us/library/hh973635.aspx">Task Preset Strings for the Azure Media Packager</a></td>
    </tr>
    <tr>
        <td>Azure Media Encryptor</td>
        <td>Lets you encrypt media assets using PlayReady Protection.</td>
        <td><a href="http://msdn.microsoft.com/en-us/library/hh973610.aspx">Task Preset Strings for the Azure Media Packager</a></td>
    </tr>
    <tr>
        <td>Storage Decryption</td>
        <td>Lets you decrypt media assets that were encrypted using storage encryption.</td>
		<td>N/A</td>
    </tr>
  </tbody>
</table>

<br />

The following method shows how to get a media processor instance. The code example assumes the use of a module-level variable named **_context** to reference the server context as described in the section [How to: Connect to Media Services Programmatically].

<pre><code>
private static IMediaProcessor GetLatestMediaProcessorByName(string mediaProcessorName)
{
     var processor = _context.MediaProcessors.Where(p => p.Name == mediaProcessorName).
        ToList().OrderBy(p => new Version(p.Version)).LastOrDefault();

    if (processor == null)
        throw new ArgumentException(string.Format("Unknown media processor", mediaProcessorName));

    return processor;
}
</code></pre>

<h2>Next Steps</h2>
Now that you know how to get a media processor instance, go to the [How to Encode an Asset][] topic which will show you how to use the Azure Media Encoder to encode an asset.

[How to Encode an Asset]: http://go.microsoft.com/fwlink/?LinkId=301753
[Task Preset Strings for the Azure Media Encoder]: http://msdn.microsoft.com/en-us/library/jj129582.aspx
[How to: Connect to Media Services Programmatically]: http://www.windowsazure.com/en-us/develop/media-services/how-to-guides/set-up-computer-for-media-services
