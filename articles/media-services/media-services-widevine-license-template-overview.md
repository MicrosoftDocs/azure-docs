<properties 
	pageTitle="Widevine License Template Overview" 
	description="This topic gives an overview of a Widevine license template that used to configure Widevine licenses." 
	authors="juliako" 
	manager="erikre" 
	editor="" 
	services="media-services" 
	documentationCenter=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/22/2016"  
	ms.author="juliako"/>

#Widevine License Template Overview

##Overview

Azure Media Services now enables you to configure and request Widevine licenses. When the end user player tries to play your Widevine protected content, a request is sent to the license delivery service to obtain a license. If the license service approves the request, it issues the license which is sent to the client and can be used to decrypt and play the specified content.

Widevine license request is formatted as a JSON message.  

Note that you can choose to create an empty message with no values just "{}" and a license template will be created with all defaults.  

	{  
	   “payload”:“<license challenge>”,
	   “content_id”: “<content id>” 
	   “provider”: ”<provider>”
	   “allowed_track_types”:“<types>”,
	   “content_key_specs”:[  
	      {  
	         “track_type”:“<track type 1>”
	      },
	      {  
	         “track_type”:“<track type 2>”
	      },
	      …
	   ],
	   “policy_overrides”:{  
	      “can_play”:<can play>,
	      “can persist”:<can persist>,
	      “can_renew”:<can renew>,
	      “rental_duration_seconds”:<rental duration>,
	      “playback_duration_seconds”:<playback duration>,
	      “license_duration_seconds”:<license duration>,
	      “renewal_recovery_duration_seconds”:<renewal recovery duration>,
	      “renewal_server_url”:”<renewal server url>”,
	      “renewal_delay_seconds”:<renewal delay>,
	      “renewal_retry_interval_seconds”:<renewal retry interval>,
	      “renew_with_usage”:<renew with usage>
	   }
	}

##JSON message

Name | Value | Description
---|---|---
payload |Base64 encoded string |The license request sent by a client. 
content_id | Base64 encoded string|Identifier used to derive KeyId(s) and Content Key(s) for each content_key_specs.track_type.
provider |string |Used to look up content keys and policies. Required.
policy_name | string |Name of a previously registered policy. Optional
allowed_track_types | enum  | SD_ONLY or SD_HD. Controls which content keys should be included in a license
content_key_specs | array of JSON structures, see **Content Key Specs** below | A finer grained control on what content keys to return. See Content Key Spec below for details.  Only one of allowed_track_types and content_key_specs can be specified. 
use_policy_overrides_exclusively | boolean. true or false | Use policy attributes specified by policy_overrides and omit all previously stored policy.
policy_overrides | JSON structure, see **Policy Overrides** below | Policy settings for this license.  In the event this asset has a pre-defined policy, these specified values will be used. 
session_init | JSON structure, see **Session Initialization** below | Optional data passed to license.
parse_only | boolean. true or false | The license request is parsed but no license is issued. However, values form the license request are returned in the response.  

##Content Key Specs 

If a pre-existing policy exist, there is no need to specify any of the values in the Content Key Spec.  The pre-existing policy associated with this content will be used to determine the output protection such as HDCP and CGMS.  If a pre-existing policy is not registered with the Widevine License Server, the content provider can inject the values into the license request.   


Each content_key_specs must be specified for all tracks, regardless of the option use_policy_overrides_exclusively. 


Name | Value | Description
---|---|---
content_key_specs. track_type | string | A track type name. If content_key_specs is specified in the license request, make sure to specify all track types explicitly. Failure to do so will result in failure to playback past 10 seconds. 
content_key_specs  <br/> security_level | uint32 | Defines client robustness requirements for playback. <br/> 1 - Software-based whitebox crypto is required. <br/> 2 - Software crypto and an obfuscated decoder is required. <br/> 3 - The key material and crypto operations must be performed within a hardware backed trusted execution environment. <br/> 4 - The crypto and decoding of content must be performed within a hardware backed trusted execution environment.  <br/> 5 - The crypto, decoding and all handling of the media (compressed and uncompressed) must be handled within a hardware backed trusted execution environment.  
content_key_specs <br/> required_output_protection.hdc | string - one of: HDCP_NONE, HDCP_V1, HDCP_V2 | Indicates whether HDCP is require
content_key_specs <br/>key | Base64 <br/>encoded string|Content key to use for this track. If specified, the track_type or key_id is required.  This option allows the content provider to inject the content key for this track instead of letting Widevine license server generate or lookup a key.
content_key_specs.key_id| Base64 encoded string  binary, 16 bytes | Unique identifier for the key. 


##Policy Overrides 

Name | Value | Description
---|---|---
policy_overrides. can_play | boolean. true or false | Indicates that playback of the content is allowed. Default is false.
policy_overrides. can_persist | boolean. true or false |Indicates that the license may be persisted to non-volatile storage for offline use. Default is false.
policy_overrides. can_renew | boolean true or false |Indicates that renewal of this license is allowed. If true, the duration of the license can be extended by heartbeat. Default is false. 
policy_overrides. license_duration_seconds | int64 | Indicates the time window for this specific license. A value of 0 indicates that there is no limit to the duration. Default is 0. 
policy_overrides. rental_duration_seconds | int64 | Indicates the time window while playback is permitted. A value of 0 indicates that there is no limit to the duration. Default is 0. 
policy_overrides. playback_duration_seconds | int64 | The viewing window of time once playback starts within the license duration. A value of 0 indicates that there is no limit to the duration. Default is 0. 
policy_overrides. renewal_server_url |string | All heartbeat (renewal) requests for this license shall be directed to the specified URL. This field is only used if can_renew is true.
policy_overrides. renewal_delay_seconds |int64 |How many seconds after license_start_time, before renewal is first attempted. This field is only used if can_renew is true. Default is 0 
policy_overrides. renewal_retry_interval_seconds | int64 | Specifies the delay in seconds between subsequent license renewal requests, in case of failure. This field is only used if can_renew is true. 
policy_overrides. renewal_recovery_duration_seconds | int64 | The window of time, in which playback is allowed to continue while renewal is attempted, yet unsuccessful due to backend problems with the license server. A value of 0 indicates that there is no limit to the duration. This field is only used if can_renew is true.
policy_overrides. renew_with_usage | boolean true or false |Indicates that the license shall be sent for renewal when usage is started. This field is only used if can_renew is true. 

##Session Initialization

Name | Value | Description
---|---|---
provider_session_token | Base64 encoded string |This session token is passed back in the license and will exist in subsequent renewals.  The session token will not persist beyond sessions. 
provider_client_token | Base64 encoded string | Client token to send back in the license response.  If the license request contains a client token, this value is ignored. The client token will persist beyond license sessions.
override_provider_client_token | boolean. true or false |If false and the license request contains a client token, use the token from the request even if a client token was specified in this structure.  If true, always use the token specified in this structure.

##Configure your Widevine licenses using .NET types

Media Services provides .NET APIs that let you configure your Widevine licenses. 

###Classes as defined in the Media Services .NET SDK

The following are the definitions of these types.

	public class WidevineMessage
	{
	    public WidevineMessage();
	
	    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
	    public AllowedTrackTypes? allowed_track_types { get; set; }
	    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
	    public ContentKeySpecs[] content_key_specs { get; set; }
	    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
	    public object policy_overrides { get; set; }
	}

    [JsonConverter(typeof(StringEnumConverter))]
    public enum AllowedTrackTypes
    {
        SD_ONLY = 0,
        SD_HD = 1
    }
    public class ContentKeySpecs
    {
        public ContentKeySpecs();

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string key_id { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public RequiredOutputProtection required_output_protection { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int? security_level { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string track_type { get; set; }
    }

    public class RequiredOutputProtection
    {
        public RequiredOutputProtection();

        public Hdcp hdcp { get; set; }
    }

    [JsonConverter(typeof(StringEnumConverter))]
    public enum Hdcp
    {
        HDCP_NONE = 0,
        HDCP_V1 = 1,
        HDCP_V2 = 2
    }

###Example

The following example shows how to use .NET APIs to configure  a simple Widevine license.

    private static string ConfigureWidevineLicenseTemplate()
    {
        var template = new WidevineMessage
        {
            allowed_track_types = AllowedTrackTypes.SD_HD,
            content_key_specs = new[]
            {
                new ContentKeySpecs
                {
                    required_output_protection = new RequiredOutputProtection { hdcp = Hdcp.HDCP_NONE},
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


##Media Services learning paths

[AZURE.INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

##Provide feedback

[AZURE.INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]


##See also

[Using PlayReady and/or Widevine Dynamic Common Encryption](media-services-protect-with-drm.md)
