---
title: Azure Video Analyzer for Media (formerly Video Indexer) release notes | Microsoft Docs
description: To stay up-to-date with the most recent developments, this article provides you with the latest updates on Azure Video Analyzer for Media (formerly Video Indexer).
services: azure-video-analyzer
documentationcenter: ''
author: Juliako
manager: femila
editor: ''
ms.workload: na
ms.topic: article
ms.subservice: azure-video-analyzer-media
ms.custom: references_regions
ms.date: 08/01/2021
ms.author: juliako
---

# Video Analyzer for Media release notes

>Get notified about when to revisit this page for updates by copying and pasting this URL: `https://docs.microsoft.com/api/search/rss?search=%22Azure+Media+Services+Video+Indexer+release+notes%22&locale=en-us` into your RSS feed reader.

To stay up-to-date with the most recent Azure Video Analyzer for Media (former Video Indexer) developments, this article provides you with information about:

* The latest releases
* Known issues
* Bug fixes
* Deprecated functionality

## July 2021

### Automatic Scaling of Media Reserved Units
 
Starting August 1st 2021, Azure Video Analyzer for Media (formerly Video Indexer) enabled [Media Reserved Units (MRUs)](../../media-services/latest/concept-media-reserved-units.md) auto scaling by [Azure Media Services](../../media-services/latest/media-services-overview.md), as a result you do not need to manage them through Azure Video Analyzer for Media. That will allow price optimization, for example price reduction in many cases, based on your business needs as it is being auto scaled.

## June 2021
 
### Video Analyzer for Media deployed in six new regions
 
You can now create a Video Analyzer for Media paid account in France Central, Central US, Brazil South, West Central US, Korea Central, and Japan West regions.
  
## May 2021

### New source languages support for speech-to-text (STT), translation, and search

Video Analyzer for Media now supports STT, translation, and search in Chinese (Cantonese) ('zh-HK'), Dutch (Netherlands) ('Nl-NL'), Czech ('Cs-CZ'), Polish ('Pl-PL'), Swedish (Sweden) ('Sv-SE'), Norwegian('nb-NO'), Finnish('fi-FI'), Canadian French ('fr-CA'), Thai('th-TH'), 
Arabic: (United Arab Emirates) ('ar-AE', 'ar-EG'), (Iraq) ('ar-IQ'), (Jordan) ('ar-JO'), (Kuwait) ('ar-KW'), (Lebanon) ('ar-LB'), (Oman) ('ar-OM'), (Qatar) ('ar-QA'), (Palestinian Authority) ('ar-PS'), (Syria) ('ar-SY'), and Turkish('tr-TR'). 

These languages are available in both API and Video Analyzer for Media website. Select the language from the combobox under **Video source language**.

### New theme for Azure Video Analyzer for Media

New theme is available: 'Azure' along with the 'light' and 'dark themes. To select a theme, click on the gear icon in the top-right corner of the website, find themes under **User settings**.
 
### New open-source code you can leverage 

Three new Git-Hub projects are available at our [GitHub repository](https://github.com/Azure-Samples/media-services-video-indexer):

* Code to help you leverage the newly added [widget customization](https://github.com/Azure-Samples/media-services-video-indexer/tree/master/Embedding%20widgets).
* Solution to help you add [custom search](https://github.com/Azure-Samples/media-services-video-indexer/tree/master/VideoSearchWithAutoMLVision) to your video libraries.
* Solution to help you add [de-duplication](https://github.com/Azure-Samples/media-services-video-indexer/commit/6b828f598f5bf61ce1b6dbcbea9e8b87ba11c7b1) to your video libraries.
 
### New option to toggle bounding boxes (for observed people) on the player  

When indexing a video through our advanced video settings, you can view our new observed people capabilities. If there are people detected in your media file, you can enable a bounding box on the detected person through the media player.

## April 2021

The Video Indexer service was renamed to Azure Video Analyzer for Media.

### Improved upload experience in the portal
 
Video Analyzer for Media has a new upload experience in the [portal](https://www.videoindexer.ai). To upload your media file, press the **Upload** button from the **Media files** tab.

### New developer portal in available in gov-cloud
 
[Video Analyzer for Media Developer Portal](https://api-portal.videoindexer.ai) is now also available in Azure for US Government.

### Observed people tracing (preview)  

Azure Video Analyzer for Media now detects observed people in videos and provides information such as the location of the person in the video frame and the exact timestamp (start, end) when a person appears. The API returns the bounding box coordinates (in pixels) for each person instance detected, including its confidence. 

For example, if a video contains a person, the detect operation will list the person appearances together with their coordinates in the video frames. You can use this functionality to determine the person path in a video. It also lets you determine whether there are multiple instances of the same person in a video. 

The newly added observed people tracing feature is available when indexing your file by choosing the **Advanced option** -> **Advanced video** or **Advanced video + audio** preset (under Video + audio indexing). Standard  and basic indexing presets will not include this new advanced model. 

When you choose to see Insights of your video on the Video Analyzer for Media website, the Observed People Tracing will show up on the page with all detected people thumbnails. You can choose a thumbnail of a person and see where the person appears in the video player.  

The feature is also available in the JSON file generated by Video Analyzer for Media. For more information, see [Trace observed people in a video](observed-people-tracing.md).

### Detected acoustic events with **Audio Effects Detection** (preview)

You can now see the detected acoustic events in the closed captions file. The file can be downloaded from the Video Analyzer for Media portal and is available as an artifact in the GetArtifact API.

**Audio Effects Detection** (preview) component detects various acoustics events and classifies them into different acoustic categories (such as Gunshot, Screaming, Crowd Reaction and more). For more information, see [Audio effects detection](audio-effects-detection.md).

## March 2021

### Audio analysis 

Audio analysis is available now in additional new bundle of audio features at different price point. The new **Basic Audio** analysis preset provides a low-cost option to only extract speech transcription, translation and format output captions and subtitles. The **Basic Audio** preset will produce two separate meters on your bill, including a line for transcription and a separate line for caption and subtitle formatting. More information on the pricing, see the [Media Services pricing](https://azure.microsoft.com/pricing/details/media-services/) page.

The newly added bundle is available when indexing or re-indexing your file by choosing the **Advanced option** -> **Basic Audio** preset (under the **Video + audio indexing** drop-down box).

### New developer portal 

Video Analyzer for Media has a new [Developer Portal](https://api-portal.videoindexer.ai/), try out the new Video Analyzer for Media APIs and find all the relevant resources in one place: [GitHub repository](https://github.com/Azure-Samples/media-services-video-indexer), [Stack overflow](https://stackoverflow.com/questions/tagged/video-indexer), [Video Analyzer for Media tech community](https://techcommunity.microsoft.com/t5/azure-media-services/bg-p/AzureMediaServices/label-name/Video%20Indexer) with relevant blog posts, [Video Analyzer for Media FAQs](faq.md), [User Voice](https://feedback.azure.com/forums/932041-cognitive-services?category_id=399016) to provide your feedback and suggest features, and  ['CodePen' link](https://codepen.io/videoindexer) with widgets code samples. 
 
### Advanced customization capabilities for insight widget 

SDK is now available to embed Video Analyzer for Media's insights widget in your own service and customize its style and data. The SDK supports the standard Video Analyzer for Media insights widget and a fully customizable insights widget. Code sample is available in [Video Analyzer for Media GitHub repository](https://github.com/Azure-Samples/media-services-video-indexer/tree/master/Embedding%20widgets/widget-customization). With this advanced customization capabilities, solution developer can apply custom styling and bring customer’s own AI data and present that in the insight widget (with or without Video Analyzer for Media insights). 

### Video Analyzer for Media deployed in the US North Central , US West and Canada Central 

You can now create a Video Analyzer for Media paid account in the US North Central, US West and Canada Central regions
 
### New source languages support for speech-to-text (STT), translation and search 

Video Analyzer for Media now support STT, translation and search in Danish ('da-DK'), Norwegian('nb-NO'), Swedish('sv-SE'), Finnish('fi-FI'), Canadian French ('fr-CA'), Thai('th-TH'), Arabic ('ar-BH', 'ar-EG', 'ar-IQ', 'ar-JO', 'ar-KW', 'ar-LB', 'ar-OM', 'ar-QA', 'ar-S', and 'ar-SY'), and Turkish('tr-TR'). Those languages are available in both API and Video Analyzer for Media website. 
 
### Search by Topic in Video Analyzer for Media Website 

You can now use the search feature, at the top of  the [Video Analyzer for Media website](https://www.videoindexer.ai/account/login) page, to search for videos with specific topics. 

## February 2021

### Multiple account owners 

Account owner role was added to Video Analyzer for Media. You can add, change, and remove users; change their role. For details on how to share an account, see [Invite users](invite-users.md).

### Audio event detection (public preview)

> [!NOTE]
> This feature is only available in trial accounts. 

Video Analyzer for Media now detects the following audio effects in the non-speech segments of the content: gunshot, glass shatter, alarm, siren, explosion, dog bark, screaming, laughter, crowd reactions (cheering, clapping, and booing) and Silence. 

The newly added audio affects feature is available when indexing your file by choosing the **Advanced option** -> **Advanced audio** preset (under Video + audio indexing). Standard indexing will only include **silence** and **crowd reaction**. 

The **clapping** event type that was included in the previous audio effects model, is now extracted a part of the **crowd reaction** event type.

When you choose to see **Insights** of your video on the [Video Analyzer for Media](https://www.videoindexer.ai/) website, the Audio Effects show up on the page.

:::image type="content" source="./media/release-notes/audio-detection.png" alt-text="Audio event detection":::

### Named entities enhancement  

The extracted list of people and location was extended and updated in general. 

In addition, the model now includes people and locations in-context which are not famous, like a ‘Sam’ or ‘Home’ in the video. 

## January 2021

### Video Analyzer for Media is deployed on US Government cloud 

You can now create a Video Analyzer for Media paid account on US government cloud in Virginia and Arizona regions. 
Video Analyzer for Media free trial offering isn't available in the mentioned region. For more information go to Video Analyzer for Media Documentation. 

### Video Analyzer for Media deployed in the India Central region 

You can now create a Video Analyzer for Media paid account in the India Central region. 

### New Dark Mode for the Video Analyzer for Media website experience

The Video Analyzer for Media website experiences is now available in dark mode. 
To enable the dark mode open the settings panel and toggle on the **Dark Mode** option. 

:::image type="content" source="./media/release-notes/dark-mode.png" alt-text="Dark mode setting":::

## December 2020

### Video Analyzer for Media deployed in the Switzerland West and Switzerland North

You can now create a Video Analyzer for Media paid account in the Switzerland West and Switzerland North regions.

## October 2020

### Animated character identification improvements  

Video Analyzer for Media supports detection, grouping, and recognition of characters in animated content via integration with Cognitive Services custom vision. We added a major improvement to this AI algorithm in the detection and characters recognition, as a result insight accuracy and identified characters are significantly improved.

### Planned Video Analyzer for Media website authenticatication changes

Starting March 1st 2021, you no longer will be able to sign up and sign in to the [Video Analyzer for Media website](https://www.videoindexer.ai/) [developer portal](video-indexer-use-apis.md) using Facebook or LinkedIn.

You will be able to sign up and sign in using one of these providers: Azure AD, Microsoft, and Google.

> [!NOTE]
> The Video Analyzer for Media accounts connected to LinkedIn and Facebook will not be accessible after March 1st 2021. 
> 
> You should [invite](invite-users.md) an Azure AD, Microsoft, or Google email you own to the Video Analyzer for Media account so you will still have access. You can add an additional owner of supported providers, as described in [invite](invite-users.md). <br/>
> Alternatively, you can create a paid account and migrate the data.

## August 2020

### Mobile design for the Video Analyzer for Media website

The Video Analyzer for Media website experience is now supporting mobile devices. The user experience is responsive to adapt to your mobile screen size (excluding customization UIs). 

### Accessibility improvements and bug fixes 

As part of WCAG (Web Content Accessibility guidelines), the Video Analyzer for Media website experiences is aligned with grade C, as part of Microsoft Accessibility standards. Several bugs and improvements related to keyboard navigation, programmatic access, and screen reader were solved. 

## July 2020

### GA for multi-language identification

Multi-language identification is moved from preview to GA and ready for productive use.

There is no pricing impact related to the "Preview to GA" transition.

### Video Analyzer for Media website improvements

#### Adjustments in the video gallery

New search bar for deep insights search with additional filtering capabilities was added. Search results were also enhanced.

New list view with ability to sort and manage video archive with multiple files.

#### New panel for easy selection and configuration

Side panel for easy selection and user configuration was added, allowing simple and quick account creation and sharing as well as setting configuration.

Side panel is also used for user preferences and help.

## June 2020

### Search by topics

You can now use the search API to search for videos with specific topics (API only).

Topics is added as part of the `textScope` (optional parameter). See [API](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Search-Videos) for details.  

### Labels enhancement

The label tagger was upgraded and now includes more visual labels that can be identified.

## May 2020

### Video Analyzer for Media deployed in the East US

You can now create a Video Analyzer for Media paid account in the East US region.
 
### Video Analyzer for Media URL

Video Analyzer for Media regional endpoints were all unified to start only with www. No action item is required.

From now on, you reach www.videoindexer.ai whether it is for embedding widgets or logging into Video Analyzer for Media web applications.

Also wus.videoindexer.ai would be redirected to www. More information is available in [Embed Video Analyzer for Media widgets in your apps](video-indexer-embed-widgets.md).

## April 2020

### New widget parameters capabilities

The **Insights** widget includes new parameters: `language` and `control`.

The **Player** widget has a new `locale` parameter. Both `locale` and `language` parameters control the player’s language.

For more information, see the [widget types](video-indexer-embed-widgets.md#widget-types) section. 

### New player skin

A new player skin launched with updated design.

### Prepare for upcoming changes

* Today, the following APIs return an account object:

    * [Create-Paid-Account](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Create-Paid-Account)
    * [Get-Account](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Get-Account)
    * [Get-Accounts-Authorization](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Get-Accounts-Authorization)
    * [Get-Accounts-With-Token](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Get-Accounts-With-Token)
 
    The Account object has a `Url` field pointing to the location of the [Video Analyzer for Media website](https://www.videoindexer.ai/).
For paid accounts the `Url` field is currently pointing to an internal URL instead of the public website.
In the coming weeks we will change it and return the [Video Analyzer for Media website](https://www.videoindexer.ai/) URL for all accounts (trial and paid).

    Do not use the internal URLs, you should be using the [Video Analyzer for Media public APIs](https://api-portal.videoindexer.ai/).
* If you are embedding Video Analyzer for Media URLs in your applications and the URLs are not pointing to the [Video Analyzer for Media website](https://www.videoindexer.ai/) or the Video Analyzer for Media API endpoint (`https://api.videoindexer.ai`) but rather to a regional endpoint (for example, `https://wus2.videoindexer.ai`), regenerate the URLs.

   You can do it by either:

    * Replacing the URL with a URL pointing to the Video Analyzer for Media widget APIs (for example, the [insights widget](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Get-Video-Insights-Widget))
    * Using the Video Analyzer for Media website to generate a new embedded URL:
         
         Press **Play** to get to your video's page -> click the **&lt;/&gt; Embed** button -> copy the URL into your application:
   
    The regional URLs are not supported and will be blocked in the coming weeks.

## January 2020
 
### Custom language support for additional languages

Video Analyzer for Media now supports custom language models for `ar-SY` , `en-UK`, and `en-AU` (API only).
 
### Delete account timeframe action update

Delete account action now deletes the account within 90 days instead of 48 hours.
 
### New Video Analyzer for Media GitHub repository

A new Video Analyzer for Media GitHub with different projects, getting started guides and code samples is now available:
https://github.com/Azure-Samples/media-services-video-indexer
 
### Swagger update

Video Analyzer for Media unified **authentications** and **operations** into a single [Video Analyzer for Media OpenAPI Specification (swagger)](https://api-portal.videoindexer.ai/api-details#api=Operations&operation). Developers can find the APIs in [Video Analyzer for Media Developer Portal](https://api-portal.videoindexer.ai/).

## December 2019

### Update transcript with the new API

Update a specific section in the transcript using the [Update-Video-Index](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Update-Video-Index) API.

### Fix account configuration from the Video Analyzer for Media portal

You can now update Media Services connection configuration in order to self-help with issues like: 

* incorrect Azure Media Services resource
* password changes
* Media Services resources were moved between subscriptions  

To fix the account configuration, in the Video Analyzer for Media portal navigate to Settings > Account tab (as owner).

### Configure the custom vision account

Configure the custom vision account on paid accounts using the Video Analyzer for Media portal (previously, this was only supported by API). To do that, sign in to the Video Analyzer for Media portal, choose Model Customization > Animated characters > Configure. 

### Scenes, shots and keyframes – now in one insight pane

Scenes, shots, and keyframes are now merged into one insight for easier consumption and navigation. When you select the desired scene you can see what shots and keyframes it consists of. 

### Notification about a long video name

When a video name is longer than 80 characters, Video Analyzer for Media shows a descriptive error on upload.

### Streaming endpoint is disabled notification

When streaming endpoint is disabled, Video Analyzer for Media will show a descriptive error on the player page.

### Error handling improvement

Status code 409 will now be returned from [Re-Index Video](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Re-Index-Video) and [Update Video Index](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Update-Video-Index) APIs in case a video is actively indexed, to prevent overriding the current re-index changes by accident.

## November 2019
 
* Korean custom language models support

    Video Analyzer for Media now supports custom language models in Korean (`ko-KR`) in both the API and portal. 
* New languages supported for speech-to-text (STT)

    Video Analyzer for Media APIs now support STT in Arabic Levantine (ar-SY), English UK dialect (en-GB), and English Australian dialect (en-AU).
    
    For video upload, we replaced zh-HANS to zh-CN, both are supported but zh-CN is recommended and more accurate.
    
## October 2019
 
* Search for animated characters in the gallery

    When indexing animated characters, you can now search for them in the account’s video galley. For more information, see [Animated characters recognition](animated-characters-recognition.md).

## September 2019
 
Multiple advancements announced at IBC 2019:
 
* Animated character recognition  (public preview)

    Ability to detect group ad recognize characters in animated content, via integration with custom vision. For more information, see [Animated character detection](animated-characters-recognition.md).
* Multi-language identification (public preview)

    Detect segments in multiple languages in the audio track and create a multilingual transcript based on them. Initial support: English, Spanish, German and French. For more information, see [Automatically identify and transcribe multi-language content](multi-language-identification-transcription.md).
* Named entity extraction for People and Location

    Extracts brands, locations, and people from speech and visual text via natural language processing (NLP).
* Editorial shot type classification

    Tagging of shots with editorial types such as close up, medium shot, two shot, indoor, outdoor etc. For more information, see [Editorial shot type detection](scenes-shots-keyframes.md#editorial-shot-type-detection).
* Topic inferencing enhancement - now covering level 2
    
    The topic inferencing model now supports deeper granularity of the IPTC taxonomy. Read full details at [Azure Media Services new AI-powered innovation](https://azure.microsoft.com/blog/azure-media-services-new-ai-powered-innovation/).

## August 2019
 
### Video Analyzer for Media deployed in UK South

You can now create a Video Analyzer for Media paid account in the UK south region.

### New Editorial Shot Type insights available

New tags added to video shots provides editorial “shot types” to identify them with common editorial phrases used in the content creation workflow such as: extreme closeup, closeup, wide, medium, two shot, outdoor, indoor, left face and right face (Available in the JSON).

### New People and Locations entities extraction available

Video Analyzer for Media identifies named locations and people via natural language processing (NLP) from the video’s OCR and transcription. Video Analyzer for Media uses machine learning algorithm to recognize when specific locations (for example, the Eiffel Tower) or people (for example, John Doe) are being called out in a video.

### Keyframes extraction in native resolution

Keyframes extracted by Video Analyzer for Media are available in the original resolution of the video.
 
### GA for training custom face models from images

Training faces from images moved from Preview mode to GA (available via API and in the portal).

> [!NOTE]
> There is no pricing impact related to the "Preview to GA" transition.

### Hide gallery toggle option

User can choose to hide the gallery tab from the portal (similar to hiding the samples tab).
 
### Maximum URL size increased

Support for URL query string of 4096 (instead of 2048) on indexing a video.
 
### Support for multi-lingual projects

Projects can now be created based on videos indexed in different languages (API only).

## July 2019

### Editor as a widget

The Video Analyzer for Media AI-editor is now available as a widget to be embedded in customer applications.

### Update custom language model from closed caption file from the portal

Customers can provide VTT, SRT, and TTML file formats as input for language models in the customization page of the portal.

## June 2019

### Video Analyzer for Media deployed to Japan East

You can now create a Video Analyzer for Media paid account in the Japan East region.

### Create and repair account API (Preview)

Added a new API that enables you to [update the Azure Media Service connection endpoint or key](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Update-Paid-Account-Azure-Media-Services).

### Improve error handling on upload 

A descriptive message is returned in case of misconfiguration of the underlying Azure Media Services account.

### Player timeline Keyframes preview 

You can now see an image preview for each time on the player's timeline.

### Editor semi-select

You can now see a preview of all the insights that are selected as a result of choosing a specific insight timeframe in the editor.

## May 2019

### Update custom language model from closed caption file

[Create custom language model](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Create-Language-Model) and [Update custom language models](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Update-Language-Model) APIs now support VTT, SRT, and TTML file formats as input for language models.

When calling the [Update Video transcript API](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Update-Video-Transcript), the transcript is added automatically. The training model associated with the video is updated automatically as well. For information on how to customize and train your language models, see [Customize a Language model with Video Analyzer for Media](customize-language-model-overview.md).

### New download transcript formats – TXT and CSV

In addition to the closed captioning format already supported (SRT, VTT, and TTML), Video Analyzer for Media now supports downloading the transcript in TXT and CSV formats.

## Next steps

[Overview](video-indexer-overview.md)
