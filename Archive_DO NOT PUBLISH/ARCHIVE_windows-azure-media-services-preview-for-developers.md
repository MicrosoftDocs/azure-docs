<h1>Windows Azure Media Services Preview for Developers</h1>
<p>Windows Azure Media Services form an extensible media platform that integrates the best of the Microsoft Media Platform and third-party media components in Windows Azure. Media Services provide a media pipeline in the cloud that enables industry partners to extend or replace component technologies. ISVs and media providers can use Media Services to build end-to-end media solutions. This overview describes the general architecture, common development scenarios, capabilities, development options, and pricing for Media Services.</p>
<h2>Contents</h2>
<ul>
<li><a href="#techoverview">How Media Services Work</a></li>
<li><a href="#devscenarios">Development Scenarios</a></li>
<li><a href="#capabilities">Capabilities and Benefits</a></li>
<li><a href="#building">Building Media Services Applications</a></li>
<li><a href="#client">Client Development Options</a></li>
<li><a href="#pricing">Pricing and Availability</a></li>
</ul>
<p> </p>
<h2><a name="techoverview"></a>How Media Services Work</h2>
<p>This diagram illustrates the basic Media Services architecture.</p>
<p><img src="/media/net/MediaServicesArch.png" alt="Media Services Architecture" /></p>
<p> </p>
<h2><a name="devscenarios"></a>Development Scenarios</h2>
<p>Media Services support several common media development scenarios as described in the following table:</p>
<table border="2" cellspacing="0" cellpadding="5" style="border: 2px solid #000000;">
<thead>
<tr><th>Scenario</th><th>Description</th></tr>
</thead>
<tbody>
<tr>
<td>Building end-to-end workflows</td>
<td>Build comprehensive media workflows entirely in the cloud. From uploading media to distributing content, Media Services provide a range of components that can be combined to meet your specific needs. Current capabilities include upload, storage, encoding, format conversion, content protection, and on-demand streaming delivery. In the next release (expected by fall 2012), Media Services will add the following capabilities: live streaming, the ability to remux (convert the container format of a media file back to its original format and contents) on an origin server, and PlayReady Protection stream-once license delivery.</td>
</tr>
<tr>
<td>Building hybrid workflows</td>
<td>You can integrate Media Services with existing tools and processes. For example, encode content on-site then upload to Media Services for transcoding into multiple formats and deliver through Windows Azure CDN, or a third-party CDN. Media Services can be called individually via standard REST APIs for integration with external applications and services.</td>
</tr>
<tr>
<td>Providing cloud support for media players</td>
<td>Creating, managing and delivering media across multiple devices (including iOS, Android, and Windows devices) has never been easier. Media Services provide everything you need to deliver media content across platforms.</td>
</tr>
</tbody>
</table>
<p> </p>
<h2><a name="capabilities"></a>Capabilities and Benefits</h2>
<p>Media Services include the following set of capabilities for building media solutions.</p>
<h3>Encoding</h3>
<ul>
<li>Use the Windows Azure Media Encoder and work with a range of standard codecs and formats, including industry-leading IIS Smooth Streaming, and Apple HTTP Live Streaming.</li>
<li>Convert entire libraries or individual files with total control over input and output.</li>
<li>Create and add third-party conversions to the platform.</li>
<li>Supported video and audio codecs:
<ul>
<li>H.264 High, Main and Baseline Profiles</li>
<li>AAC-LC</li>
<li>HE-AAC</li>
<li>VC-1 (Windows Media Video 9) Simple, Main and Advanced Profiles</li>
<li>Windows Media Audio Standard</li>
<li>Windows Media Audio Professional</li>
<li>Dolby DD+ (coming soon)</li>
</ul>
</li>
<li>Supported format conversions:
<ul>
<li>ISO MP4 (.mp4) to Smooth Streaming File Format (PIFF 1.3) (.ismv; .isma)</li>
<li>Smooth Streaming File Format (PIFF) to Apple HTTP Live Streaming (.msu8, .ts)</li>
</ul>
</li>
</ul>
<h3>Third-Party Encoding</h3>
<ul>
<li>Support for these third-party encoders will be available soon:
<ul>
<li><a href="http://www.digital-rapids.com/">Digital Rapids</a></li>
<li><a href="http://www.vsofts.com/">Vanguard Software Solutions, Inc</a></li>
<li><a href="http://www.ateme.com/">Ateme</a></li>
</ul>
</li>
<li>Additional third-party encoding solutions will be supported and become available through the <a href="https://datamarket.azure.com/">Windows Azure Marketplace</a>.</li>
</ul>
<h3>Content Protection</h3>
<ul>
<li>Encrypt live or on-demand video and audio with standard MPEG Common Encryption or Microsoft PlayReady, the industry’s most accepted DRM for premium content.</li>
<li>Add third-party forensic or destructive watermarking to your media for an extra layer of protection. Media Services content protection partners include:
<ul>
<li><a href="http://buydrm.com/">BuyDRM</a></li>
<li><a href="http://www.civolution.com/">Civolution</a></li>
<li><a href="http://www.ezdrm.com/">EZDRM</a></li>
</ul>
</li>
</ul>
<h3>On-Demand Streaming</h3>
<ul>
<li>Seamlessly deliver content via Windows Azure CDN or a third-party CDN.</li>
<li>Add a scalable origin server with or without a CDN.</li>
<li>Scale to millions of users by adding a Windows Azure CDN or a third-party CDN.</li>
<li>Partners who support on-demand streaming with currently available products:<br />
<ul>
<li><a href="http://www.wowza.com/">Wowza</a></li>
</ul>
</li>
</ul>
<h3>Live Streaming</h3>
<ul>
<li>Live Streaming is expected to be available soon.</li>
<li>Create and publish live streaming channels, encoding with Media Services or pushing from an external feed.</li>
<li>Take advantage of built-in features:
<ul>
<li>Server-side DVR</li>
<li>Integrated ad support</li>
<li>Seamless archiving</li>
<li>Instant replay</li>
</ul>
</li>
</ul>
<h2><a name="building"></a>Building Media Services Applications</h2>
<h3>Media Services Developers</h3>
<p>Media Services developers typically fit into two groups.</p>
<ul>
<li><strong>Independent Software Vendors</strong>. (ISVs). ISVs build end-to-end media management services. These services may be used by media production companies, large content delivery providers, or consumers who directly access media applications. ISVs can programmatically connect to Media Services by using <a href="http://odata.org/">Open Data Protocol</a> (OData) 3.0 to call the REST API layer directly, or by using the Media Services SDK for .NET (the SDK simplifies the process of making calls to the REST API layer). OData is installed with <a href="http://www.microsoft.com/download/en/details.aspx?id=29306" title="WCF Data Services">WCF Data Services 5.0 for OData v3</a>. After the Media Services 1.0 RTM release, the Media Services SDK will be available on GitHub with an Apache 2.0 license, and additional languages will be supported.</li>
<li><strong>Partners</strong>. Partners build Media Services add-on components that run as part of the Media Services platform. Partners can also use the <a href="https://datamarket.azure.com/">Windows Azure Marketplace</a> to market their components. These add-ons can be used by ISVs as they develop their end-to-end services. A special Media Services Platform SDK is available for building add-on components.</li>
</ul>
<h3>The Media Services REST API</h3>
<p>The REST API is the public, programmatic interface for accessing Media Services. REST (for Representational State Transfer) is an architectural strategy for building networked client-server applications. Machines in a REST application use HTTP requests to carry out typical data operations such as reading (equivalent to a GET), writing (equivalent to a POST), or deleting data over the network. As a Media Services developer, your application calls into Media Services by using the REST API. As described earlier, ISVs will call into the REST API by using OData 3.0, or by using the Media Services SDK.</p>
<h3>Workflow of a Media Management Application</h3>
<p>In a typical media management application, there are four basic types of operations for working with media assets, and these operations make up the application workflow. Media Services provide full support for each operation in this workflow.</p>
<ul>
<li><strong>Ingest</strong>. Ingest operations bring assets into the system, for example by uploading them and encrypting them before they are placed into Windows Azure Storage. By the RTM release, Media Services will offer integration with partner components to provide fast UDP (User Datagram Protocol) upload solutions.</li>
<li><strong>Process</strong>. Processing operations involve various types of encoding, transforming, and converting tasks that you perform on media assets.</li>
<li><strong>Manage</strong>. Management operations involve working with assets that are already in Media Services. This includes listing and tagging media assets, deleting assets, editing assets, managing asset keys, DRM key management, analytics, and more.</li>
<li><strong>Deliver</strong>. Delivery operations transfers media content out of Media Services. This includes streaming content live or on-demand to clients, retrieving or downloading specific media files from the cloud, or deploying media assets to other servers, such as a CDN caching location in Windows Azure.</li>
</ul>
<h3>Entities in Media Services</h3>
<p>When you access Media Services programmatically through the REST API (using OData or using the Media Services SDK), you can see several fundamental objects for working with media content. These objects are called entities. The following table summarizes the main Media Services entities.</p>
<table border="2" cellspacing="0" cellpadding="5" style="border: 2px solid #000000;">
<thead>
<tr><th>Entity</th><th>Description</th></tr>
</thead>
<tbody>
<tr>
<td>Asset</td>
<td>An asset is a virtual entity that holds metadata about media. An asset may contain one or many files.</td>
</tr>
<tr>
<td>File</td>
<td>A file is an actual video or audio blob object on the file system or on a remote server. A file is always associated with an asset, and an asset may contain one or many files.</td>
</tr>
<tr>
<td>Job</td>
<td>A job is an entity that holds metadata about tasks. The tasks perform work on assets and files, and a job can create new assets or files. A job always has one or more associated tasks.</td>
</tr>
<tr>
<td>Task</td>
<td>A task is an individual operation of work on an asset or file. A task is associated with a job.</td>
</tr>
<tr>
<td>Access policy</td>
<td>An access policy defines the permissions to a file or an asset (who can access it, what type of access, and the duration).</td>
</tr>
<tr>
<td>Locator</td>
<td>A locator is a URI that provides time-based access to a specific asset. A locator gives you direct access to files stored in the Windows Azure Blobs service, an origin streaming server locator, or a CDN locator.</td>
</tr>
<tr>
<td>Job template</td>
<td>A job template provides reusable settings for jobs that need to be run repeatedly.</td>
</tr>
<tr>
<td>Content key</td>
<td>A content key provides secure access to an asset. It also provides encryption keys used for storage encryption, MPEG Common Encryption, or PlayReady encryption.</td>
</tr>
</tbody>
</table>
<p> </p>
<h2><a name="client"></a>Client Development Options</h2>
<p>Microsoft provides several clients in the form of SDKs and player frameworks to support playback of content served from Windows Azure Media Services or from your on-premises deployment. These clients are for developers who want to build Media Services applications that offer compelling user experiences across a range of devices and platforms. Depending on the devices that you want to build client applications for, there are options for SDKs and player frameworks available from Microsoft and other third-party partners.</p>
<h3>Client Development Tools</h3>
<h4>Mac and PCs</h4>
<p>For PCs and Macs you can target a streaming experience using <a href="http://www.microsoft.com/silverlight/">Microsoft Silverlight</a>. An SDK for Flash client development will be available soon.</p>
<ul>
<li>Silverlight
<ul>
<li><a href="http://www.iis.net/download/smoothclient">Smooth Streaming Client for Silverlight</a></li>
<li><a href="http://smf.codeplex.com/documentation">Microsoft Media Platform: Player Framework for Silverlight</a></li>
</ul>
</li>
</ul>
<h4>Windows 8</h4>
<p>For Windows 8, you can build Metro applications using any of the supported development languages and constructs like HTML, Javascript, XAML, C# and C+.</p>
<ul>
<li><a href="http://go.microsoft.com/fwlink/?LinkID=246146&amp;clcid=0x409">Smooth Streaming Client SDK for Windows 8 Metro style applications</a></li>
<li><a href="http://playerframework.codeplex.com/wikipage?title=Player%20Framework%20for%20Windows%208%20Metro%20Style%20Apps&amp;referringTitle=Home">Microsoft Media Platform: Player Framework for Windows 8 Metro-style Applications</a></li>
</ul>
<h4>Xbox</h4>
<p>Xbox supports Xbox LIVE applications that can consume Smooth Streaming content. The Xbox LIVE Application Development Kit (ADK) includes:</p>
<ul>
<li>Smooth Streaming client for Xbox LIVE ADK</li>
<li>Microsoft Media Platform: Player Framework for Xbox LIVE ADK</li>
</ul>
<h4>Embedded / other Devices</h4>
<p>These are devices like connected TVs, set-top boxes, Blu-Ray players, OTT TV boxes, and mobile devices that have a custom application development framework and a custom media pipeline. Microsoft provides the following porting kits that can be licensed, and enables partners to port Smooth Streaming playback for the platform.</p>
<ul>
<li><a href="http://www.microsoft.com/en-us/mediaplatform/sspk.aspx">Smooth Streaming Client Porting Kit</a></li>
<li><a href="http://www.microsoft.com/PlayReady/Licensing/device_technology.mspx">Microsoft PlayReady Device Porting Kit</a></li>
</ul>
<h4>Windows Phone</h4>
<p>Microsoft provides an SDK that can be used to build premium video applications for Windows Phone.</p>
<ul>
<li><a href="http://www.iis.net/download/smoothclient/">Smooth Streaming Client for Silverlight</a></li>
<li><a href="http://smf.codeplex.com/documentation/">Microsoft Media Platform: Player Framework for Silverlight</a></li>
</ul>
<h4>iOS Devices</h4>
<p>For iOS devices including iPhone, iPod, and iPad, Microsoft ships an SDK that you can use to build applications for these platforms to deliver premium video content. Smooth Streaming SDK for iOS Devices with PlayReady. For information on iOS, see the <a href="https://developer.apple.com/devcenter/ios/index.action">iOS Developer Center</a>.</p>
<ul>
<li>Smooth Streaming SDK for iOS Devices with PlayReady</li>
</ul>
<h4>Android Devices</h4>
<p>Several Microsoft partners ship SDKs for the Android platform that add the capability to play back Smooth Streaming on an Android device. Please <a href="mailto:sspkinfo@microsoft.com?subject=Partner%20SDKs%20for%20Android%20Devices">email Microsoft</a> for more details on the partners.</p>
<h3>Client Development Scenarios</h3>
<p>Microsoft's client SDKs provide APIs for programmatic access to adaptive streaming and controls, while the player frameworks enable you to build player applications. The combined client capabilities enable advanced playback and monetization scenarios while abstracting the complexities associated with network, format, and streaming.</p>
<p>Here are some leading development scenarios that these clients support*:</p>
<ul>
<li>Basic playback
<ul>
<li>APIs such as Play, Pause, Stop</li>
<li>Events for playback and diagnostics</li>
<li>Properties to track position and other attributes</li>
</ul>
</li>
<li>Advanced playback
<ul>
<li>Live Smooth Streaming DVR (seek back during a live presentation)</li>
<li>Trick Play (slow motion, fast-forward, and rewind)</li>
</ul>
</li>
<li>Multiple audio language support</li>
<li>Text streams (captions and subtitles)</li>
<li>Offline playback scenarios for download and play, download-to-own, and download-to-rent models</li>
<li>Monetization for ad-supported content
<ul>
<li>VAST/VPAID integration for ad playback integration (scheduling capabilities, tracking ad progress, and more integration features)</li>
<li>Dynamic ad insertion with IIS Live Smooth Streaming</li>
<li>Rich integrated analytics with Windows Azure Media Services</li>
</ul>
</li>
<li>Content protection using Microsoft PlayReady integration for VC-1/H.264 content</li>
<li>Composite manifest support for rough-cut editing</li>
<li>Programmatic control over streaming experience with track selection capabilities for playback (for example, restricting the available bitrates, and supporting multiple camera angles in a single stream)</li>
</ul>
<p>*Not all capabilities are supported in all clients.</p>
<p> </p>
<h2><a name="pricing"></a>Pricing and Availability</h2>
<p>Media Services are currently available at no cost.</p>
<blockquote>
<p><strong>Note</strong>:   Charges for associated Windows Azure features like Storage, Egress,and CDN still apply. Further, there will be a monthly encoding quota of one terabyte during the current release.</p>
</blockquote>
<p>To sign-up for access to the Media Services Preview release, click <a href="mailto:mediaservices@microsoft.com?subject=Sign%20up%20for%20Media%20Services%20Preview">here</a>.</p>
<p>You do not need to add any text to the email. Reply using the provided subject line: "Sign up for Media Services Preview." After the Media Services Preview is available, you will receive an emailed response with setup instructions.</p>
<p> </p>
<h2>See Also</h2>
<p><a href="http://go.microsoft.com/fwlink/?linkid=245435&amp;clcid=0x409">Windows Azure Media Services Product Page</a></p>