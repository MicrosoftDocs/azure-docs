---
title: Azure Media Services v3 with Widevine license template overview
description: This topic gives an overview of a Widevine license template that is used to configure Widevine licenses.
author: juliako
manager: femila
editor: ''
services: media-services
documentationcenter: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/07/2020
ms.author: juliako

---
# Media Services v3 with Widevine license template overview

Azure Media Services enables you to encrypt your content with **Google Widevine**. Media Services also provides a service for delivering Widevine licenses. You can use Azure Media Services APIs to configure Widevine licenses. When a player tries to play your Widevine-protected content, a request is sent to the license delivery service to obtain the license. If the license service approves the request, the service issues the license. It's sent to the client and is used to decrypt and play the specified content.

A Widevine license request is formatted as a JSON message.  

>[!NOTE]
> You can create an empty message with no values, just "{}." Then a license template is created with defaults. The default works for most cases. Microsoft-based license-delivery scenarios should always use the defaults. If you need to set the "provider" and "content_id" values, a provider must match Widevine credentials.

    {  
       "payload":"<license challenge>",
       "content_id": "<content id>"
       "provider": "<provider>"
       "allowed_track_types":"<types>",
       "content_key_specs":[  
          {  
             "track_type":"<track type 1>"
          },
          {  
             "track_type":"<track type 2>"
          },
          …
       ],
       "policy_overrides":{  
          "can_play":<can play>,
          "can persist":<can persist>,
          "can_renew":<can renew>,
          "rental_duration_seconds":<rental duration>,
          "playback_duration_seconds":<playback duration>,
          "license_duration_seconds":<license duration>,
          "renewal_recovery_duration_seconds":<renewal recovery duration>,
          "renewal_server_url":"<renewal server url>",
          "renewal_delay_seconds":<renewal delay>,
          "renewal_retry_interval_seconds":<renewal retry interval>,
          "renew_with_usage":<renew with usage>
       }
    }

## JSON message

| Name | Value | Description |
| --- | --- | --- |
| payload |Base64-encoded string |The license request sent by a client. |
| content_id |Base64-encoded string |Identifier used to derive the key ID and content key for each content_key_specs.track_type. |
| provider |string |Used to look up content keys and policies. If Microsoft key delivery is used for Widevine license delivery, this parameter is ignored. |
| policy_name |string |Name of a previously registered policy. Optional. |
| allowed_track_types |enum |SD_ONLY or SD_HD. Controls which content keys are included in a license. |
| content_key_specs |Array of JSON structures, see the section "Content key specs."  |A finer-grained control on which content keys to return. For more information, see the section "Content key specs." Only one of the allowed_track_types and content_key_specs values can be specified. |
| use_policy_overrides_exclusively |Boolean, true or false |Use policy attributes specified by policy_overrides, and omit all previously stored policy. |
| policy_overrides |JSON structure, see the section "Policy overrides." |Policy settings for this license.  In the event this asset has a predefined policy, these specified values are used. |
| session_init |JSON structure, see the section "Session initialization." |Optional data is passed to the license. |
| parse_only |Boolean, true or false |The license request is parsed, but no license is issued. However, values from the license request are returned in the response. |

## Content key specs
If a pre-existing policy exists, there is no need to specify any of the values in the content key spec. The pre-existing policy associated with this content is used to determine the output protection, such as High-bandwidth Digital Content Protection (HDCP) and the Copy General Management System (CGMS). If a pre-existing policy isn't registered with the Widevine license server, the content provider can inject the values into the license request.   

Each content_key_specs value must be specified for all tracks, regardless of the use_policy_overrides_exclusively option. 

| Name | Value | Description |
| --- | --- | --- |
| content_key_specs. track_type |string |A track type name. If content_key_specs is specified in the license request, make sure to specify all track types explicitly. Failure to do so results in failure to play back past 10 seconds. |
| content_key_specs  <br/> security_level |uint32 |Defines client robustness requirements for playback. <br/> - Software-based white-box cryptography is required. <br/> - Software cryptography and an obfuscated decoder are required. <br/> - The key material and cryptography operations must be performed within a hardware-backed trusted execution environment. <br/> - The cryptography and decoding of content must be performed within a hardware-backed trusted execution environment.  <br/> - The cryptography, decoding, and all handling of the media (compressed and uncompressed) must be handled within a hardware-backed trusted execution environment. |
| content_key_specs <br/> required_output_protection.hdc |string, one of HDCP_NONE, HDCP_V1, HDCP_V2 |Indicates whether HDCP is required. |
| content_key_specs <br/>key |Base64-<br/>encoded string |Content key to use for this track. If specified, the track_type or key_id is required. The content provider can use this option to inject the content key for this track instead of letting the Widevine license server generate or look up a key. |
| content_key_specs.key_id |Base64-encoded string binary, 16 bytes |Unique identifier for the key. |

## Policy overrides
| Name | Value | Description |
| --- | --- | --- |
| policy_overrides&#46;can_play |Boolean, true or false |Indicates that playback of the content is allowed. Default is false. |
| policy_overrides&#46;can_persist |Boolean, true or false |Indicates that the license might be persisted to nonvolatile storage for offline use. Default is false. |
| policy_overrides&#46;can_renew |Boolean, true or false |Indicates that renewal of this license is allowed. If true, the duration of the license can be extended by heartbeat. Default is false. |
| policy_overrides&#46;license_duration_seconds |int64 |Indicates the time window for this specific license. A value of 0 indicates that there is no limit to the duration. Default is 0. |
| policy_overrides&#46;rental_duration_seconds |int64 |Indicates the time window while playback is permitted. A value of 0 indicates that there is no limit to the duration. Default is 0. |
| policy_overrides&#46;playback_duration_seconds |int64 |The viewing window of time after playback starts within the license duration. A value of 0 indicates that there is no limit to the duration. Default is 0. |
| policy_overrides&#46;renewal_server_url |string |All heartbeat (renewal) requests for this license is directed to the specified URL. This field is used only if can_renew is true. |
| policy_overrides&#46;renewal_delay_seconds |int64 |How many seconds after license_start_time before renewal is first attempted. This field is used only if can_renew is true. Default is 0. |
| policy_overrides&#46;renewal_retry_interval_seconds |int64 |Specifies the delay in seconds between subsequent license renewal requests, in case of failure. This field is used only if can_renew is true. |
| policy_overrides&#46;renewal_recovery_duration_seconds |int64 |The window of time in which playback can continue while renewal is attempted, yet unsuccessful due to back-end problems with the license server. A value of 0 indicates that there is no limit to the duration. This field is used only if can_renew is true. |
| policy_overrides&#46;renew_with_usage |Boolean, true or false |Indicates that the license is sent for renewal when usage starts. This field is used only if can_renew is true. |

## Session initialization
| Name | Value | Description |
| --- | --- | --- |
| provider_session_token |Base64-encoded string |This session token is passed back in the license and exists in subsequent renewals. The session token doesn't persist beyond sessions. |
| provider_client_token |Base64-encoded string |Client token to send back in the license response. If the license request contains a client token, this value is ignored. The client token persists beyond license sessions. |
| override_provider_client_token |Boolean, true or false |If false and the license request contains a client token, use the token from the request even if a client token was specified in this structure. If true, always use the token specified in this structure. |

## Configure your Widevine license with .NET 

Media Services provides a class that lets you configure a Widevine license. To construct the license, pass JSON to [WidevineTemplate](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.media.models.contentkeypolicywidevineconfiguration.widevinetemplate?view=azure-dotnet#Microsoft_Azure_Management_Media_Models_ContentKeyPolicyWidevineConfiguration_WidevineTemplate).

To configure the template, you can:

### Directly construct a JSON string

This method may be error-prone. It is recommended to use other method, described in [Define needed classes and serialize to JSON](#classes).

```csharp
ContentKeyPolicyWidevineConfiguration objContentKeyPolicyWidevineConfiguration = new ContentKeyPolicyWidevineConfiguration
{
    WidevineTemplate = @"{""allowed_track_types"":""SD_HD"",""content_key_specs"":[{""track_type"":""SD"",""security_level"":1,""required_output_protection"":{""hdcp"":""HDCP_V2""}}],""policy_overrides"":{""can_play"":true,""can_persist"":true,""can_renew"":false}}"
};
```

### <a id="classes"></a> Define needed classes and serialize to JSON

#### Define classes

The following example shows an example of definitions of classes that map to Widevine JSON schema. You can instantiate the classes before serializing them to JSON string.  

```csharp
/// <summary>
/// Widevine PolicyOverrides class.
/// </summary>
public class PolicyOverrides
{
    /// <summary>
    /// Gets or sets a value indicating whether playback of the content is allowed. Default is false.
    /// </summary>
    [JsonProperty("can_play")]
    public bool CanPlay { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether the license might be persisted to nonvolatile storage for offline use. Default is false.
    /// </summary>
    [JsonProperty("can_persist")]
    public bool CanPersist { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether renewal of this license is allowed. If true, the duration of the license can be extended by heartbeat. Default is false.
    /// </summary>
    [JsonProperty("can_renew")]
    public bool CanRenew { get; set; }

    /// <summary>
    /// Gets or sets the time window while playback is permitted. A value of 0 indicates that there is no limit to the duration. Default is 0.
    /// </summary>
    [JsonProperty("rental_duration_seconds")]
    public int RentalDurationSeconds { get; set; }

    /// <summary>
    /// Gets or sets the viewing window of time after playback starts within the license duration. A value of 0 indicates that there is no limit to the duration. Default is 0.
    /// </summary>
    [JsonProperty("playback_duration_seconds")]
    public int PlaybackDurationSeconds { get; set; }

    /// <summary>
    /// Gets or sets the time window for this specific license. A value of 0 indicates that there is no limit to the duration. Default is 0.
    /// </summary>
    [JsonProperty("license_duration_seconds")]
    public int LicenseDurationSeconds { get; set; }
}

/// <summary>
/// Widevine ContentKeySpec class.
/// </summary>
public class ContentKeySpec
{
    /// <summary>
    /// Gets or sets track type.
    /// If content_key_specs is specified in the license request, make sure to specify all track types explicitly.
    /// Failure to do so results in failure to play back past 10 seconds.
    /// </summary>
    [JsonProperty("track_type")]
    public string TrackType { get; set; }

    /// <summary>
    /// Gets or sets client robustness requirements for playback.
    /// Software-based white-box cryptography is required.
    /// Software cryptography and an obfuscated decoder are required.
    /// The key material and cryptography operations must be performed within a hardware-backed trusted execution environment.
    /// The cryptography and decoding of content must be performed within a hardware-backed trusted execution environment.
    /// The cryptography, decoding, and all handling of the media (compressed and uncompressed) must be handled within a hardware-backed trusted execution environment.
    /// </summary>
    [JsonProperty("security_level")]
    public int SecurityLevel { get; set; }

    /// <summary>
    /// Gets or sets the OutputProtection.
    /// </summary>
    [JsonProperty("required_output_protection")]
    public OutputProtection RequiredOutputProtection { get; set; }
}

/// <summary>
/// OutputProtection Widevine class.
/// </summary>
public class OutputProtection
{
    /// <summary>
    /// Gets or sets HDCP protection.
    /// Supported values : HDCP_NONE, HDCP_V1, HDCP_V2
    /// </summary>
    [JsonProperty("hdcp")]
    public string HDCP { get; set; }

    /// <summary>
    /// Gets or sets CGMS.
    /// </summary>
    [JsonProperty("cgms_flags")]
    public string CgmsFlags { get; set; }
}

/// <summary>
/// Widevine template.
/// </summary>
public class WidevineTemplate
{
    /// <summary>
    /// Gets or sets the allowed track types.
    /// SD_ONLY or SD_HD.
    /// Controls which content keys are included in a license.
    /// </summary>
    [JsonProperty("allowed_track_types")]
    public string AllowedTrackTypes { get; set; }

    /// <summary>
    /// Gets or sets a finer-grained control on which content keys to return.
    /// For more information, see the section "Content key specs."
    /// Only one of the allowed_track_types and content_key_specs values can be specified.
    /// </summary>
    [JsonProperty("content_key_specs")]
    public ContentKeySpec[] ContentKeySpecs { get; set; }

    /// <summary>
    /// Gets or sets policy settings for the license.
    /// In the event this asset has a predefined policy, these specified values are used.
    /// </summary>
    [JsonProperty("policy_overrides")]
    public PolicyOverrides PolicyOverrides { get; set; }
}
```

#### Configure the license

Use classes defined in the previous section to create JSON that is used to configure [WidevineTemplate](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.media.models.contentkeypolicywidevineconfiguration.widevinetemplate?view=azure-dotnet#Microsoft_Azure_Management_Media_Models_ContentKeyPolicyWidevineConfiguration_WidevineTemplate):

```csharp
private static ContentKeyPolicyWidevineConfiguration ConfigureWidevineLicenseTempate()
{
    WidevineTemplate template = new WidevineTemplate()
    {
        AllowedTrackTypes = "SD_HD",
        ContentKeySpecs = new ContentKeySpec[]
        {
            new ContentKeySpec()
            {
                TrackType = "SD",
                SecurityLevel = 1,
                RequiredOutputProtection = new OutputProtection()
                {
                    HDCP = "HDCP_V2"
                }
            }
        },
        PolicyOverrides = new PolicyOverrides()
        {
            CanPlay = true,
            CanPersist = true,
            CanRenew = false,
            RentalDurationSeconds = 2592000,
            PlaybackDurationSeconds = 10800,
            LicenseDurationSeconds = 604800,
        }
    };

    ContentKeyPolicyWidevineConfiguration objContentKeyPolicyWidevineConfiguration = new ContentKeyPolicyWidevineConfiguration
    {
        WidevineTemplate = Newtonsoft.Json.JsonConvert.SerializeObject(template)
    };
    return objContentKeyPolicyWidevineConfiguration;
}
```

## Additional notes

* Widevine is a service provided by Google Inc. and subject to the terms of service and Privacy Policy of Google, Inc.

## Next steps

Check out how to [protect with DRM](protect-with-drm.md)
