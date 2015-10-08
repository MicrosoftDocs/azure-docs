<properties
	pageTitle="Use dynamic common encryption to protect  your live and on-demand content with PlayReady and/or Widevine DRM"
	description="Microsoft Azure Media Services enables you to deliver MPEG-DASH, Smooth Streaming, and Http-Live-Streaming (HLS) streams protected with Microsoft PlayReady DRM. It also enables you to delivery DASH encrypted with Widevine DRM. This topic shows how to dynamically encrypt with PlayReady and Widevine DRM."
	services="media-services"
	documentationCenter=""
	authors="Juliako"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="media-services"
	ms.workload="media"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article" 
	ms.date="10/07/2015"
	ms.author="juliako"/>


#Use dynamic common encryption to protect your live and on-demand content with PlayReady and/or Widevine DRM

> [AZURE.SELECTOR]
- [.NET](media-services-protect-with-drm.md)
- [Java](https://github.com/southworkscom/azure-sdk-for-media-services-java-samples)

Microsoft Azure Media Services enables you to deliver MPEG-DASH, Smooth Streaming, and Http-Live-Streaming (HLS) streams protected with [Microsoft PlayReady DRM](https://www.microsoft.com/playready/overview/). It also enables you to delivery DASH encrypted with Widevine DRM. Both PlayReady and Widewine are encrypted per the Common Encryption (CENC) specification. You can use [AMS .NET SDK](https://www.nuget.org/packages/windowsazure.mediaservices/) (starting with the version 3.5.1) or REST API to configure your AssetDeliveryConfiguration to use Widevine.

Media Services also provides a service for delivering Microsoft PlayReady licenses. Media Services also provides APIs that let you configure the rights and restrictions that you want for the PlayReady DRM runtime to enforce when a user is trying to play back protected content. When a user requests to watch PlayReady protected content, the client player application requests the content from Azure Media Services. Azure Media Services then redirects the client to an Azure Media Services PlayReady licensing server that authenticates and authorizes the user’s access to the content. A PlayReady license contains the decryption key that can be used by the client player to decrypt and stream the content.

>[AZURE.NOTE] Currently, Media Services does not provide a Widevine license server. You can use the following AMS partners to help you deliver Widevine licenses: [Axinom](http://www.axinom.com/press/ibc-axinom-drm-6/), [EZDRM](http://ezdrm.com/), [castLabs](http://castlabs.com/company/partners/azure/).

Media Services supports multiple ways of authenticating users who make key requests. The content key authorization policy could have one or more authorization restrictions: open, token restriction, or IP restriction. The token restricted policy must be accompanied by a token issued by a Secure Token Service (STS). Media Services supports tokens in the [Simple Web Tokens](https://msdn.microsoft.com/library/gg185950.aspx#BKMK_2) (SWT) format and [JSON Web Token](https://msdn.microsoft.com/library/gg185950.aspx#BKMK_3) (JWT) format. For more information, see Configure the content key’s authorization policy.

To take advantage of dynamic encryption, you need to have an asset that contains a set of multi-bitrate MP4 files or multi-bitrate Smooth Streaming source files. You also need to configure the delivery policy for the asset (described later in this topic). Then, based on the format specified in the streaming URL, the On-Demand Streaming server will ensure that the stream is delivered in the protocol you have chosen. As a result, you only need to store and pay for the files in single storage format and Media Services service will build and serve the appropriate response based on requests from a client.

This topic would be useful to developers that work on applications that deliver protected media. The topic shows you how to configure the PlayReady license delivery service with authorization policies so that only authorized clients could receive PlayReady licenses. It also shows how to use dynamic encryption.

>[AZURE.NOTE]To start using dynamic encryption, you must first get at least one scale unit (also known as streaming unit). For more information, see [How to Scale a Media Service](media-services-manage-origins.md#scale_streaming_endpoints).

##Configuring DRM Dynamic Encryption and PlayReady License Delivery Service

The following are general steps that you would need to perform when protecting your assets with PlayReady, using the Media Services license delivery service, and also using dynamic encryption.

1. Create an asset and upload files into the asset. 
1. Encode the asset containing the file to the adaptive bitrate MP4 set.
1. Create a content key and associate it with the encoded asset. In Media Services, the content key contains the asset’s encryption key. For more information.
1. Configure the content key’s authorization policy. The content key authorization policy must be configured by you and met by the client in order for the content key to be delivered to the client. 
1. Configure the delivery policy for an asset. The delivery policy configuration includes: delivery protocol (for example, MPEG DASH, HLS, HDS, Smooth Streaming or all), the type of dynamic encryption (for example, common encryption), PlayReady license acquisition URL. 
 
	You could apply different policy to each protocol on the same asset. For example, you could apply PlayReady encryption to Smooth/DASH and AES Envelope to HLS. Any protocols that are not defined in a delivery policy (for example, you add a single policy that only specifies HLS as the protocol) will be blocked from streaming. The exception to this is if you have no asset delivery policy defined at all. Then, all protocols will be allowed in the clear.
1. Create an OnDemand locator in order to get a streaming URL.

You will find a complete .NET example at the end of the topic.

The following image demonstrates the workflow described above. Here the token is used for authentication.

![Protect with PlayReady](./media/media-services-content-protection-overview/media-services-content-protection-with-drm.png)

The rest of this topic provides detailed explanations, code examples, and links to topics that show you how to achieve the tasks described above. 

##Current limitations

If you add or update your asset’s delivery policy, you must delete an existing locator (if any) and create a new locator.

##Create an asset and upload files into the asset

In order to manage, encode, and stream your videos, you must first upload your content into Microsoft Azure Media Services. Once uploaded, your content is stored securely in the cloud for further processing and streaming. 

For detailed information, see [Upload Files into a Media Services account](media-services-dotnet-upload-files.md).

##Encode the asset containing the file to the adaptive bitrate MP4 set

With dynamic encryption all you need is to create an asset that contains a set of multi-bitrate MP4 files or multi-bitrate Smooth Streaming source files. Then, based on the specified format in the manifest or fragment request, the On-Demand Streaming server will ensure that you receive the stream in the protocol you have chosen. As a result, you only need to store and pay for the files in single storage format and Media Services service will build and serve the appropriate response based on requests from a client. For more information, see the [Dynamic Packaging Overview](media-services-dynamic-packaging-overview.md) topic.

For instructions on how to encode, see [How to encode an asset using Media Encoder Standard](media-services-dotnet-encode-with-media-encoder-standard.md).
	

##<a id="create_contentkey"></a>Create a content key and associate it with the encoded asset

In Media Services, the content key contains the key that you want to encrypt an asset with.

For detailed information, see [Create content key](media-services-dotnet-create-contentkey.md).


##<a id="configure_key_auth_policy"></a>Configure the content key’s authorization policy

Media Services supports multiple ways of authenticating users who make key requests. The content key authorization policy must be configured by you and met by the client (player) in order for the key to be delivered to the client. The content key authorization policy could have one or more authorization restrictions: open, token restriction, or IP restriction.

For detailed information, see [Configure Content Key Authorization Policy](media-services-dotnet-configure-content-key-auth-policy.md#playready-dynamic-encryption).

##<a id="configure_asset_delivery_policy"></a>Configure asset delivery policy 

Configure the delivery policy for your asset. Some things that the asset delivery policy configuration includes:

- The PlayReady license acquisition URL. 
- The asset delivery protocol (for example, MPEG DASH, HLS, HDS, Smooth Streaming or all). 
- The type of dynamic encryption (in this case, common encryption). 

For detailed information, see [Configure asset delivery policy ](media-services-rest-configure-asset-delivery-policy.md).

##<a id="create_locator"></a>Create an OnDemand streaming locator in order to get a streaming URL

You will need to provide your user with the streaming URL for Smooth, DASH or HLS.

>[AZURE.NOTE]If you add or update your asset’s delivery policy, you must delete an existing locator (if any) and create a new locator.

For instructions on how to publish an asset and build a streaming URL, see [Build a streaming URL](media-services-deliver-streaming-content.md).

##Get a test token

Get a test token based on the token restriction that was used for the key authorization policy.

	// Deserializes a string containing an Xml representation of a TokenRestrictionTemplate
	// back into a TokenRestrictionTemplate class instance.
	TokenRestrictionTemplate tokenTemplate = 
	    TokenRestrictionTemplateSerializer.Deserialize(tokenTemplateString);
	
	// Generate a test token based on the data in the given TokenRestrictionTemplate.
	//The GenerateTestToken method returns the token without the word “Bearer” in front
	//so you have to add it in front of the token string. 
	string testToken = TokenRestrictionTemplateSerializer.GenerateTestToken(tokenTemplate);
	Console.WriteLine("The authorization token is:\nBearer {0}", testToken);

	
You can use the [AMS Player](http://amsplayer.azurewebsites.net/azuremediaplayer.html) to test your stream.

##<a id="example"></a>Example

1. Create a new Console project.
1. Use NuGet to install and add Azure Media Services .NET SDK Extensions. Installing this package, also installs Media Services .NET SDK and adds all other required dependencies.
2. Add config file that contains the account name and key information:

	
		<?xml version="1.0" encoding="utf-8"?>
		<configuration>
		    <startup> 
		        <supportedRuntime version="v4.0" sku=".NETFramework,Version=v4.5" />
		    </startup>
			  <appSettings>
			
			    <add key="MediaServicesAccountName" value="AccountName"/>
			    <add key="MediaServicesAccountKey" value="AccountKey"/>
			
			    <add key="Issuer" value="http://testacs.com"/>
			    <add key="Audience" value="urn:test"/>
			  </appSettings>
		</configuration>

1. Overwrite the code in your Program.cs file with the code shown in this section.
	
	Make sure to update variables to point to folders where your input files are located.

		using System;
		using System.Collections.Generic;
		using System.Configuration;
		using System.IO;
		using System.Linq;
		using System.Text;
		using System.Threading;
		using System.Threading.Tasks;
		using System.Xml.Linq;
		using Microsoft.WindowsAzure.MediaServices.Client;
		using Microsoft.WindowsAzure.MediaServices.Client.ContentKeyAuthorization;
		using Microsoft.WindowsAzure.MediaServices.Client.DynamicEncryption;
		
		namespace PlayReadyDynamicEncryptAndKeyDeliverySvc
		{
		    class Program
		    {
		        // Read values from the App.config file.
		        private static readonly string _mediaServicesAccountName =
		            ConfigurationManager.AppSettings["MediaServicesAccountName"];
		        private static readonly string _mediaServicesAccountKey =
		            ConfigurationManager.AppSettings["MediaServicesAccountKey"];
		
		        private static readonly Uri _sampleIssuer =
		            new Uri(ConfigurationManager.AppSettings["Issuer"]);
		        private static readonly Uri _sampleAudience =
		            new Uri(ConfigurationManager.AppSettings["Audience"]);
		
		        // Field for service context.
		        private static CloudMediaContext _context = null;
		        private static MediaServicesCredentials _cachedCredentials = null;
		
		        private static readonly string _mediaFiles =
		            Path.GetFullPath(@"../..\Media");
		
		        private static readonly string _singleMP4File =
		            Path.Combine(_mediaFiles, @"BigBuckBunny.mp4");
		
		        static void Main(string[] args)
		        {
		            // Create and cache the Media Services credentials in a static class variable.
		            _cachedCredentials = new MediaServicesCredentials(
		                            _mediaServicesAccountName,
		                            _mediaServicesAccountKey);
		            // Used the cached credentials to create CloudMediaContext.
		            _context = new CloudMediaContext(_cachedCredentials);
		
		            bool tokenRestriction = false;
		            string tokenTemplateString = null;
		
		            IAsset asset = UploadFileAndCreateAsset(_singleMP4File);
		            Console.WriteLine("Uploaded asset: {0}", asset.Id);
		
		            IAsset encodedAsset = EncodeToAdaptiveBitrateMP4Set(asset);
		            Console.WriteLine("Encoded asset: {0}", encodedAsset.Id);
		
		            IContentKey key = CreateCommonTypeContentKey(encodedAsset);
		            Console.WriteLine("Created key {0} for the asset {1} ", key.Id, encodedAsset.Id);
		            Console.WriteLine("PlayReady License Key delivery URL: {0}", key.GetKeyDeliveryUrl(ContentKeyDeliveryType.PlayReadyLicense));
		            Console.WriteLine();
		    
		            if (tokenRestriction)
		                tokenTemplateString = AddTokenRestrictedAuthorizationPolicy(key);
		            else
		                AddOpenAuthorizationPolicy(key);
		
		            Console.WriteLine("Added authorization policy: {0}", key.AuthorizationPolicyId);
		            Console.WriteLine();
		
		            CreateAssetDeliveryPolicy(encodedAsset, key);
		            Console.WriteLine("Created asset delivery policy. \n");
		            Console.WriteLine();
		
		            if (tokenRestriction && !String.IsNullOrEmpty(tokenTemplateString))
		            {
		                // Deserializes a string containing an Xml representation of a TokenRestrictionTemplate
		                // back into a TokenRestrictionTemplate class instance.
		                TokenRestrictionTemplate tokenTemplate =
		                    TokenRestrictionTemplateSerializer.Deserialize(tokenTemplateString);
		
		                // Generate a test token based on the the data in the given TokenRestrictionTemplate.
		                // Note, you need to pass the key id Guid because we specified 
		                // TokenClaim.ContentKeyIdentifierClaim in during the creation of TokenRestrictionTemplate.
		                Guid rawkey = EncryptionUtils.GetKeyIdAsGuid(key.Id);
		
		                //The GenerateTestToken method returns the token without the word “Bearer” in front
		                //so you have to add it in front of the token string. 
		                string testToken = TokenRestrictionTemplateSerializer.GenerateTestToken(tokenTemplate, null, rawkey, DateTime.UtcNow.AddDays(365));
		                Console.WriteLine("The authorization token is:\nBearer {0}", testToken);
		                Console.WriteLine();
		            }
		
		            // You can use the http://smf.cloudapp.net/healthmonitor player 
		            // to test the smoothStreamURL URL.
		            //
		            string url = GetStreamingOriginLocator(encodedAsset);
		            Console.WriteLine("Encrypted Smooth Streaming URL: {0}/manifest", url);
		
		
		            Console.ReadLine();
		        }
		
		        static public IAsset UploadFileAndCreateAsset(string singleFilePath)
		        {
		            if (!File.Exists(singleFilePath))
		            {
		                Console.WriteLine("File does not exist.");
		                return null;
		            }
		
		            var assetName = Path.GetFileNameWithoutExtension(singleFilePath);
		            IAsset inputAsset = _context.Assets.Create(assetName, AssetCreationOptions.StorageEncrypted);
		
		            var assetFile = inputAsset.AssetFiles.Create(Path.GetFileName(singleFilePath));
		
		            Console.WriteLine("Created assetFile {0}", assetFile.Name);
		
		            var policy = _context.AccessPolicies.Create(
		                                    assetName,
		                                    TimeSpan.FromDays(30),
		                                    AccessPermissions.Write | AccessPermissions.List);
		
		            var locator = _context.Locators.CreateLocator(LocatorType.Sas, inputAsset, policy);
		
		            Console.WriteLine("Upload {0}", assetFile.Name);
		
		            assetFile.Upload(singleFilePath);
		            Console.WriteLine("Done uploading {0}", assetFile.Name);
		
		            locator.Delete();
		            policy.Delete();
		
		            return inputAsset;
		        }
		
	
				static public IAsset EncodeToAdaptiveBitrateMP4Set(IAsset asset)
				{
				    // Declare a new job.
				    IJob job = _context.Jobs.Create("Media Encoder Standard Job");
				    // Get a media processor reference, and pass to it the name of the 
				    // processor to use for the specific task.
				    IMediaProcessor processor = GetLatestMediaProcessorByName("Media Encoder Standard");
				
				    // Create a task with the encoding details, using a string preset.
				    // In this case "H264 Multiple Bitrate 720p" preset is used.
				    ITask task = job.Tasks.AddNew("My encoding task",
				        processor,
				        "H264 Multiple Bitrate 720p",
				        TaskOptions.None);
				
				    // Specify the input asset to be encoded.
				    task.InputAssets.Add(asset);
				    // Add an output asset to contain the results of the job. 
				    // This output is specified as AssetCreationOptions.None, which 
				    // means the output asset is not encrypted. 
				    task.OutputAssets.AddNew("Output asset",
				        AssetCreationOptions.None);
				
				    job.StateChanged += new EventHandler<JobStateChangedEventArgs>(JobStateChanged);
				    job.Submit();
				    job.GetExecutionProgressTask(CancellationToken.None).Wait();
				
				    return job.OutputMediaAssets[0];
				}

		
		        static public IContentKey CreateCommonTypeContentKey(IAsset asset)
		        {
		            // Create common encryption content key
		            Guid keyId = Guid.NewGuid();
		            byte[] contentKey = GetRandomBuffer(16);
		
		            IContentKey key = _context.ContentKeys.Create(
		                                    keyId,
		                                    contentKey,
		                                    "ContentKey",
		                                    ContentKeyType.CommonEncryption);
		
		            // Associate the key with the asset.
		            asset.ContentKeys.Add(key);
		
		            return key;
		        }
		
		    static public void AddOpenAuthorizationPolicy(IContentKey contentKey)
		    {
		
		        // Create ContentKeyAuthorizationPolicy with Open restrictions 
		        // and create authorization policy          
		
		        List<ContentKeyAuthorizationPolicyRestriction> restrictions = new List<ContentKeyAuthorizationPolicyRestriction>
		        {
		            new ContentKeyAuthorizationPolicyRestriction 
		            { 
		                Name = "Open", 
		                KeyRestrictionType = (int)ContentKeyRestrictionType.Open, 
		                Requirements = null
		            }
		        };
		
		        // Configure PlayReady license template.
		        string newLicenseTemplate = ConfigurePlayReadyLicenseTemplate();
		
		        IContentKeyAuthorizationPolicyOption policyOption =
		            _context.ContentKeyAuthorizationPolicyOptions.Create("",
		                ContentKeyDeliveryType.PlayReadyLicense,
		                    restrictions, newLicenseTemplate);
		
		        IContentKeyAuthorizationPolicy contentKeyAuthorizationPolicy = _context.
		                    ContentKeyAuthorizationPolicies.
		                    CreateAsync("Deliver Common Content Key with no restrictions").
		                    Result;
		
		
		        contentKeyAuthorizationPolicy.Options.Add(policyOption);
		
		        // Associate the content key authorization policy with the content key.
		        contentKey.AuthorizationPolicyId = contentKeyAuthorizationPolicy.Id;
		        contentKey = contentKey.UpdateAsync().Result;
		    }
		
		        public static string AddTokenRestrictedAuthorizationPolicy(IContentKey contentKey)
		        {
		            string tokenTemplateString = GenerateTokenRequirements();
		
		            IContentKeyAuthorizationPolicy policy = _context.
		                                    ContentKeyAuthorizationPolicies.
		                                    CreateAsync("HLS token restricted authorization policy").Result;
		
		            List<ContentKeyAuthorizationPolicyRestriction> restrictions = new List<ContentKeyAuthorizationPolicyRestriction>
		            {
		                new ContentKeyAuthorizationPolicyRestriction 
		                { 
		                    Name = "Token Authorization Policy", 
		                    KeyRestrictionType = (int)ContentKeyRestrictionType.TokenRestricted,
		                    Requirements = tokenTemplateString, 
		                }
		            };
		
		            // Configure PlayReady license template.
		            string newLicenseTemplate = ConfigurePlayReadyLicenseTemplate();
		
		            IContentKeyAuthorizationPolicyOption policyOption =
		                _context.ContentKeyAuthorizationPolicyOptions.Create("Token option",
		                    ContentKeyDeliveryType.PlayReadyLicense,
		                        restrictions, newLicenseTemplate);
		
		            IContentKeyAuthorizationPolicy contentKeyAuthorizationPolicy = _context.
		                        ContentKeyAuthorizationPolicies.
		                        CreateAsync("Deliver Common Content Key with no restrictions").
		                        Result;
		            
		            policy.Options.Add(policyOption);
		
		            // Add ContentKeyAutorizationPolicy to ContentKey
		            contentKeyAuthorizationPolicy.Options.Add(policyOption);
		
		            // Associate the content key authorization policy with the content key
		            contentKey.AuthorizationPolicyId = contentKeyAuthorizationPolicy.Id;
		            contentKey = contentKey.UpdateAsync().Result;
		
		            return tokenTemplateString;
		        }
		
		        static private string GenerateTokenRequirements()
		        {
		            TokenRestrictionTemplate template = new TokenRestrictionTemplate(TokenType.SWT);
		
		            template.PrimaryVerificationKey = new SymmetricVerificationKey();
		            template.AlternateVerificationKeys.Add(new SymmetricVerificationKey());
		            template.Audience = _sampleAudience.ToString();
		            template.Issuer = _sampleIssuer.ToString();
		            template.RequiredClaims.Add(TokenClaim.ContentKeyIdentifierClaim);
		
		            return TokenRestrictionTemplateSerializer.Serialize(template);
		        } 
		
		        static private string ConfigurePlayReadyLicenseTemplate()
		        {
		            // The following code configures PlayReady License Template using .NET classes
		            // and returns the XML string.
		             
		            PlayReadyLicenseResponseTemplate responseTemplate = new PlayReadyLicenseResponseTemplate();
		            PlayReadyLicenseTemplate licenseTemplate = new PlayReadyLicenseTemplate();
		
		            responseTemplate.LicenseTemplates.Add(licenseTemplate);
		
		            return MediaServicesLicenseTemplateSerializer.Serialize(responseTemplate);
		        }
		
		
				static public void CreateAssetDeliveryPolicy(IAsset asset, IContentKey key)
				{
				    Uri acquisitionUrl = key.GetKeyDeliveryUrl(ContentKeyDeliveryType.PlayReadyLicense);
				
				    Dictionary<AssetDeliveryPolicyConfigurationKey, string> assetDeliveryPolicyConfiguration =
				        new Dictionary<AssetDeliveryPolicyConfigurationKey, string>
				    {
				        {AssetDeliveryPolicyConfigurationKey.PlayReadyLicenseAcquisitionUrl, acquisitionUrl.ToString()},
				        {AssetDeliveryPolicyConfigurationKey.WidevineLicenseAcquisitionUrl,"http://testurl"},
				        
				    };
				
				    var assetDeliveryPolicy = _context.AssetDeliveryPolicies.Create(
				            "AssetDeliveryPolicy",
				        AssetDeliveryPolicyType.DynamicCommonEncryption,
				        AssetDeliveryProtocol.Dash,
				        assetDeliveryPolicyConfiguration);
				
				   
				    // Add AssetDelivery Policy to the asset
				    asset.DeliveryPolicies.Add(assetDeliveryPolicy);
				
				}
		
		        /// <summary>
		        /// Gets the streaming origin locator.
		        /// </summary>
		        /// <param name="assets"></param>
		        /// <returns></returns>
		        static public string GetStreamingOriginLocator(IAsset asset)
		        {
		
		            // Get a reference to the streaming manifest file from the  
		            // collection of files in the asset. 
		
		            var assetFile = asset.AssetFiles.Where(f => f.Name.ToLower().
		                                         EndsWith(".ism")).
		                                         FirstOrDefault();
		
		            // Create a 30-day readonly access policy. 
		            IAccessPolicy policy = _context.AccessPolicies.Create("Streaming policy",
		                TimeSpan.FromDays(30),
		                AccessPermissions.Read);
		
		            // Create a locator to the streaming content on an origin. 
		            ILocator originLocator = _context.Locators.CreateLocator(LocatorType.OnDemandOrigin, asset,
		                policy,
		                DateTime.UtcNow.AddMinutes(-5));
		
		            // Create a URL to the manifest file. 
		            return originLocator.Path + assetFile.Name;
		        }
		
		        static private byte[] GetRandomBuffer(int length)
		        {
		            var returnValue = new byte[length];
		
		            using (var rng =
		                new System.Security.Cryptography.RNGCryptoServiceProvider())
		            {
		                rng.GetBytes(returnValue);
		            }
		
		            return returnValue;
		        }


				static private void JobStateChanged(object sender, JobStateChangedEventArgs e)
				{
				    Console.WriteLine("Job state changed event:");
				    Console.WriteLine("  Previous state: " + e.PreviousState);
				    Console.WriteLine("  Current state: " + e.CurrentState);
				    switch (e.CurrentState)
				    {
				        case JobState.Finished:
				            Console.WriteLine();
				            Console.WriteLine("Job is finished. Please wait while local tasks or downloads complete...");
				            break;
				        case JobState.Canceling:
				        case JobState.Queued:
				        case JobState.Scheduled:
				        case JobState.Processing:
				            Console.WriteLine("Please wait...\n");
				            break;
				        case JobState.Canceled:
				        case JobState.Error:
				
				            // Cast sender as a job.
				            IJob job = (IJob)sender;
				
				            // Display or log error details as needed.
				            break;
				        default:
				            break;
				    }
				}
				
				
				static private IMediaProcessor GetLatestMediaProcessorByName(string mediaProcessorName)
				{
				    var processor = _context.MediaProcessors.Where(p => p.Name == mediaProcessorName).
				    ToList().OrderBy(p => new Version(p.Version)).LastOrDefault();
				
				    if (processor == null)
				        throw new ArgumentException(string.Format("Unknown media processor", mediaProcessorName));
				
				    return processor;
				}
		    }
		}


##Media Services learning paths

You can view AMS learning paths here:

- [AMS Live Streaming Workflow](http://azure.microsoft.com/documentation/learning-paths/media-services-streaming-live/)
- [AMS on Demand Streaming Workflow](http://azure.microsoft.com/documentation/learning-paths/media-services-streaming-on-demand/)

##See also

[Configure Widevine packaging with AMS](http://mingfeiy.com/how-to-configure-widevine-packaging-with-azure-media-services)