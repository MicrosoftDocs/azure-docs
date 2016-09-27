<properties 
	pageTitle="Use Azure Media Services to deliver DRM licenses or AES keys" 
	description="This article describes how you can use Azure Media Services (AMS) to deliver PlayReady and/or Widevine licenses and AES keys but do the rest (encoding, encrypting, streaming) using your on-premises servers." 
	services="media-services" 
	documentationCenter="" 
	authors="Juliako" 
	manager="erikre" 
	editor=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/22/2016"
	ms.author="juliako"/>


#Use Azure Media Services to deliver DRM licenses or AES keys

Azure Media Services (AMS) enables you to ingest, encode, add content protection, and stream your content (see [this](media-services-protect-with-drm.md) article for details). However, there are customers who only want to use AMS to deliver licenses and/or keys and do encoding, encrypting and streaming using their on-premises servers. This article describes how you can use AMS to deliver PlayReady and/or Widevine licenses but do the rest with your on-premises servers. 


## Overview

Media Services provides a services for delivering PlayReady and Widevine DRM licenses and AES-128 keys. Media Services also provides APIs that let you configure the rights and restrictions that you want for the DRM runtime to enforce when a user plays back the DRM protected content. When a user requests the protected content, the player application will request a license from the AMS license service. The AMS license service will issue the license to the player (if it is authorized). The PlayReady and Widevine licenses contain the decryption key that can be used by the client player to decrypt and stream the content.

Media Services supports multiple ways of authorizing users who make license or key requests. You configure the content key's authorization policy and the policy could have one or more restrictions: open or token restriction. The token restricted policy must be accompanied by a token issued by a Secure Token Service (STS). Media Services supports tokens in the Simple Web Tokens (SWT) format and JSON Web Token (JWT) format.


The following diagram shows the main steps you need to take to use AMS to deliver PlayReady and/or Widevine licenses but do the rest with your on-premises servers.

![Protect with PlayReady](./media/media-services-deliver-keys-and-licenses/media-services-diagram1.png)

##Download sample

You can download the sample described in this article from [here](https://github.com/Azure/media-services-dotnet-deliver-drm-licenses).

##.NET code example

The code example in this topic shows how to create a common content key and get PlayReady or Widevine license acquisition URLs. You need to get the following pieces of information from AMS and configure your on-premises server: **content key**, **key id**, **license acquisition URL**. Once you configure your on-premises server, you could stream from your own streaming server. Since the encrypted stream points to AMS license server, your player will request a license from AMS. If you choose token authentication, the AMS license server will validate the token you sent through HTTPS and (if valid) will deliver the license back to your player. (The code example only shows how to create a common content key and  get PlayReady or Widevine license acquisition URLs. If you want to delivery AES-128 keys, you need to create an envelope content key and get a key acquisition URL and [this](media-services-protect-with-aes128.md) article shows how to do it).
	
	
	using System;
	using System.Collections.Generic;
	using System.Configuration;
	using System.IO;
	using System.Linq;
	using System.Threading;
	using Microsoft.WindowsAzure.MediaServices.Client;
	using Microsoft.WindowsAzure.MediaServices.Client.ContentKeyAuthorization;
	using Microsoft.WindowsAzure.MediaServices.Client.DynamicEncryption;
	using Microsoft.WindowsAzure.MediaServices.Client.Widevine;
	using Newtonsoft.Json;
	
	
	namespace DeliverDRMLicenses
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
	
	        static void Main(string[] args)
	        {
	            // Create and cache the Media Services credentials in a static class variable.
	            _cachedCredentials = new MediaServicesCredentials(
	                            _mediaServicesAccountName,
	                            _mediaServicesAccountKey);
	            // Used the cached credentials to create CloudMediaContext.
	            _context = new CloudMediaContext(_cachedCredentials);
	
	            bool tokenRestriction = true;
	            string tokenTemplateString = null;
	
	
	            IContentKey key = CreateCommonTypeContentKey();
	
	            // Print out the key ID and Key in base64 string format
	            Console.WriteLine("Created key {0} with key value {1} ", 
	                key.Id, System.Convert.ToBase64String(key.GetClearKeyValue()));
	
	            Console.WriteLine("PlayReady License Key delivery URL: {0}", 
	                key.GetKeyDeliveryUrl(ContentKeyDeliveryType.PlayReadyLicense));
	
	            Console.WriteLine("Widevine License Key delivery URL: {0}",
	                key.GetKeyDeliveryUrl(ContentKeyDeliveryType.Widevine));
	
	            if (tokenRestriction)
	                tokenTemplateString = AddTokenRestrictedAuthorizationPolicy(key);
	            else
	                AddOpenAuthorizationPolicy(key);
	
	            Console.WriteLine("Added authorization policy: {0}", 
	                key.AuthorizationPolicyId);
	            Console.WriteLine();
	            Console.ReadLine();
	        }
	
	        static public void AddOpenAuthorizationPolicy(IContentKey contentKey)
	        {
	
	            // Create ContentKeyAuthorizationPolicy with Open restrictions 
	            // and create authorization policy          
	
	            List<ContentKeyAuthorizationPolicyRestriction> restrictions = 
	                new List<ContentKeyAuthorizationPolicyRestriction>
	            {
	                new ContentKeyAuthorizationPolicyRestriction
	                {
	                    Name = "Open",
	                    KeyRestrictionType = (int)ContentKeyRestrictionType.Open,
	                    Requirements = null
	                }
	            };
	
	            // Configure PlayReady and Widevine license templates.
	            string PlayReadyLicenseTemplate = ConfigurePlayReadyLicenseTemplate();
	
	            string WidevineLicenseTemplate = ConfigureWidevineLicenseTemplate();
	
	            IContentKeyAuthorizationPolicyOption PlayReadyPolicy =
	                _context.ContentKeyAuthorizationPolicyOptions.Create("",
	                    ContentKeyDeliveryType.PlayReadyLicense,
	                        restrictions, PlayReadyLicenseTemplate);
	
	            IContentKeyAuthorizationPolicyOption WidevinePolicy =
	                _context.ContentKeyAuthorizationPolicyOptions.Create("",
	                    ContentKeyDeliveryType.Widevine,
	                    restrictions, WidevineLicenseTemplate);
	
	            IContentKeyAuthorizationPolicy contentKeyAuthorizationPolicy = _context.
	                        ContentKeyAuthorizationPolicies.
	                        CreateAsync("Deliver Common Content Key with no restrictions").
	                        Result;
	
	
	            contentKeyAuthorizationPolicy.Options.Add(PlayReadyPolicy);
	            contentKeyAuthorizationPolicy.Options.Add(WidevinePolicy);
	            // Associate the content key authorization policy with the content key.
	            contentKey.AuthorizationPolicyId = contentKeyAuthorizationPolicy.Id;
	            contentKey = contentKey.UpdateAsync().Result;
	        }
	
	        public static string AddTokenRestrictedAuthorizationPolicy(IContentKey contentKey)
	        {
	            string tokenTemplateString = GenerateTokenRequirements();
	
	            List<ContentKeyAuthorizationPolicyRestriction> restrictions = 
	                new List<ContentKeyAuthorizationPolicyRestriction>
	            {
	                new ContentKeyAuthorizationPolicyRestriction
	                {
	                    Name = "Token Authorization Policy",
	                    KeyRestrictionType = (int)ContentKeyRestrictionType.TokenRestricted,
	                    Requirements = tokenTemplateString,
	                }
	            };
	
	            // Configure PlayReady and Widevine license templates.
	            string PlayReadyLicenseTemplate = ConfigurePlayReadyLicenseTemplate();
	
	            string WidevineLicenseTemplate = ConfigureWidevineLicenseTemplate();
	
	            IContentKeyAuthorizationPolicyOption PlayReadyPolicy =
	                _context.ContentKeyAuthorizationPolicyOptions.Create("Token option",
	                    ContentKeyDeliveryType.PlayReadyLicense,
	                        restrictions, PlayReadyLicenseTemplate);
	
	            IContentKeyAuthorizationPolicyOption WidevinePolicy =
	                _context.ContentKeyAuthorizationPolicyOptions.Create("Token option",
	                    ContentKeyDeliveryType.Widevine,
	                        restrictions, WidevineLicenseTemplate);
	
	            IContentKeyAuthorizationPolicy contentKeyAuthorizationPolicy = _context.
	                        ContentKeyAuthorizationPolicies.
	                        CreateAsync("Deliver Common Content Key with token restrictions").
	                        Result;
	
	            contentKeyAuthorizationPolicy.Options.Add(PlayReadyPolicy);
	            contentKeyAuthorizationPolicy.Options.Add(WidevinePolicy);
	
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
	
	            //The PlayReadyLicenseResponseTemplate class represents the template 
	            //for the response sent back to the end user. 
	            //It contains a field for a custom data string between the license server 
	            //and the application (may be useful for custom app logic) 
	            //as well as a list of one or more license templates.
	
	            PlayReadyLicenseResponseTemplate responseTemplate = 
	                new PlayReadyLicenseResponseTemplate();
	
	            // The PlayReadyLicenseTemplate class represents a license template 
	            // for creating PlayReady licenses
	            // to be returned to the end users. 
	            // It contains the data on the content key in the license 
	            // and any rights or restrictions to be 
	            // enforced by the PlayReady DRM runtime when using the content key.
	            PlayReadyLicenseTemplate licenseTemplate = new PlayReadyLicenseTemplate();
	
	            // Configure whether the license is persistent 
	            // (saved in persistent storage on the client) 
	            // or non-persistent (only held in memory while the player is using the license).  
	            licenseTemplate.LicenseType = PlayReadyLicenseType.Nonpersistent;
	
	            // AllowTestDevices controls whether test devices can use the license or not.  
	            // If true, the MinimumSecurityLevel property of the license
	            // is set to 150.  If false (the default), 
	            // the MinimumSecurityLevel property of the license is set to 2000.
	            licenseTemplate.AllowTestDevices = true;
	
	            // You can also configure the Play Right in the PlayReady license by using the PlayReadyPlayRight class. 
	            // It grants the user the ability to playback the content subject to the zero or more restrictions 
	            // configured in the license and on the PlayRight itself (for playback specific policy). 
	            // Much of the policy on the PlayRight has to do with output restrictions 
	            // which control the types of outputs that the content can be played over and 
	            // any restrictions that must be put in place when using a given output.
	            // For example, if the DigitalVideoOnlyContentRestriction is enabled, 
	            //then the DRM runtime will only allow the video to be displayed over digital outputs 
	            //(analog video outputs won’t be allowed to pass the content).
	
	            // IMPORTANT: These types of restrictions can be very powerful 
	            // but can also affect the consumer experience. 
	            // If the output protections are configured too restrictive, 
	            // the content might be unplayable on some clients. 
	            // For more information, see the PlayReady Compliance Rules document.
	
	            // For example:
	            //licenseTemplate.PlayRight.AgcAndColorStripeRestriction = new AgcAndColorStripeRestriction(1);
	
	            responseTemplate.LicenseTemplates.Add(licenseTemplate);
	
	            return MediaServicesLicenseTemplateSerializer.Serialize(responseTemplate);
	        }
	
	
	        private static string ConfigureWidevineLicenseTemplate()
	        {
	            var template = new WidevineMessage
	            {
	                allowed_track_types = AllowedTrackTypes.SD_HD,
	                content_key_specs = new[]
	                {
	                    new ContentKeySpecs
	                    {
	                        required_output_protection = 
	                            new RequiredOutputProtection { hdcp = Hdcp.HDCP_NONE},
	                        security_level = 1,
	                        track_type = "SD"
	                    }
	                },
	                policy_overrides = new
	                {
	                    can_play = true,
	                    can_persist = true,
	                    can_renew = false
	                }
	            };
	
	            string configuration = JsonConvert.SerializeObject(template);
	            return configuration;
	        }
	
	
	        static public IContentKey CreateCommonTypeContentKey()
	        {
	            // Create envelope encryption content key
	            Guid keyId = Guid.NewGuid();
	            byte[] contentKey = GetRandomBuffer(16);
	
	            IContentKey key = _context.ContentKeys.Create(
	                                    keyId,
	                                    contentKey,
	                                    "ContentKey",
	                                    ContentKeyType.CommonEncryption);
	
	            return key;
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
	
	
	    }
	}
	

##Media Services learning paths

[AZURE.INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

##Provide feedback

[AZURE.INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]


##See also

[Using PlayReady and/or Widevine Dynamic Common Encryption](media-services-protect-with-drm.md)

[Using AES-128 Dynamic Encryption and Key Delivery Service](media-services-protect-with-aes128.md)

[Using partners to deliver Widevine licenses to Azure Media Services](media-services-licenses-partner-integration.md)