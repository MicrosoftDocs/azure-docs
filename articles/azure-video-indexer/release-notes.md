---
title: Azure Video Indexer release notes | Microsoft Docs
description: To stay up-to-date with the most recent developments, this article provides you with the latest updates on Azure Video Indexer.
ms.topic: article
ms.custom: references_regions
ms.date: 09/15/2022
ms.author: juliako
---

# Azure Video Indexer release notes

>Get notified about when to revisit this page for updates by copying and pasting this URL: `https://docs.microsoft.com/api/search/rss?search=%22Azure+Media+Services+Video+Indexer+release+notes%22&locale=en-us` into your RSS feed reader.

To stay up-to-date with the most recent Azure Video Indexer developments, this article provides you with information about:

* [Important notice](#upcoming-critical-changes) about planned changes
* The latest releases
* Known issues
* Bug fixes
* Deprecated functionality

## Upcoming critical changes

> [!Important]
> This section describes a critical upcoming change for the `Upload-Video` API.

### Upload-Video API

In the past, the `Upload-Video` API was tolerant to calls to upload a video from a URL where an empty multipart form body was provided in the C# code, such as:

```csharp
var content = new MultipartFormDataContent();
var uploadRequestResult = await client.PostAsync($"{apiUrl}/{accountInfo.Location}/Accounts/{accountInfo.Id}/Videos?{queryParams}", content);
```

In the coming weeks, our service will fail requests of this type.

In order to upload a video from a URL, change your code to send null in the request body:

```csharp
var uploadRequestResult = await client.PostAsync($"{apiUrl}/{accountInfo.Location}/Accounts/{accountInfo.Id}/Videos?{queryParams}", null);
```

## September 2022

### General availability of Azure Resource Management (ARM)

With the ARM-based [paid (unlimited)](accounts-overview.md) account you are able to use: 

- [Azure role-based access control (RBAC)](../role-based-access-control/overview.md).
- Managed Identity to better secure the communication between your Azure Media Services and Azure Video Indexer account, Network Service Tags, and native integration with Azure Monitor to monitor your account (audit and indexing logs). 
- Scale and automate your [deployment with ARM-template](deploy-with-arm-template.md), [bicep](deploy-with-bicep.md) or terraform. 
 
To create an ARM-based account, see [create an account](create-account-portal.md).

### New source languages support for STT, translation, and search

Now supporting source languages for STT (speech-to-text), translation, and search in Ukraine and Vietnamese. It means transcription, translation, and search features are also supported for these languages in Azure Video Indexer web applications, widgets and APIs.

For more information, see [supported languages](language-support.md).

### Configure confidence level in a person model with an API

Use the [Patch person model](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Patch-Person-Model) API to configure the confidence level for face recognition within a person model.

## August 2022

### Update topic inferencing model 

Azure Video Indexer topic inferencing model was updated and now we extract more than 6.5 million topics (for example, covering topics such as Covid virus). To benefit from recent model updates you need to re-index your video files. 

### Topic inferencing model is now available on Azure Government 

You can now leverage topic inferencing model in your Azure Video Indexer paid account on [Azure Government](../azure-government/documentation-government-welcome.md) in Virginia and Arizona regions. With this release we completed the AI parity between Azure global and Azure Government. 
To benefit from the model updates you need to re-index your video files. 

### Session length is now 30 days in the Azure Video Indexer website

The [Azure Video Indexer website](https://vi.microsoft.com) session length was extended to 30 days. You can preserve your session without having to re-login every 1 hour.

## July 2022

### The featured clothing insight (preview)

The featured clothing insight enables more targeted ads placement. 

The insight provides information of key items worn by individuals within a video and the timestamp in which the clothing appears. This allows high-quality in-video contextual advertising, where relevant clothing ads are matched with the specific time within the video in which they are viewed.

To view the featured clothing of an observed person, you have to index the video using Azure Video Indexer advanced video settings. For details on how featured clothing images are ranked and how to view this insight, see [featured clothing](observed-people-featured-clothing.md).

## June 2022

### Create Video Indexer blade improvements in Azure portal 

Azure Video Indexer now supports the creation of new resource using system-assigned managed identity or system and user assigned managed identity for the same resource. 

You can also change the primary managed identity using the **Identity** tab in the [Azure portal](https://portal.azure.com/#home). 

### Limited access of celebrity recognition and face identification features

As part of Microsoft's commitment to responsible AI, we are designing and releasing Azure Video Indexer – identification and celebrity recognition features. These features are designed to protect the rights of individuals and society and fostering transparent human-computer interaction. Thus, there is a limited access and use of Azure Video Indexer – identification and celebrity recognition features. 

Identification and celebrity recognition features require registration and are only available to Microsoft managed customers and partners. 
Customers who wish to use this feature are required to apply and submit an [intake form](https://aka.ms/facerecognition). For more information, read [Azure Video Indexer limited access](limited-access-features.md). 

Also, see the following: the [announcement blog post](https://aka.ms/AAh91ff) and [investment and safeguard for facial recognition](https://aka.ms/AAh9oye).
          
## May 2022

### Line breaking in transcripts

Improved line break logic to better split transcript into sentences. New editing capabilities are now available through the Azure Video Indexer portal, such as adding a new line and editing the line’s timestamp. For more information, see [Insert or remove transcript lines](edit-transcript-lines-portal.md).

### Azure Monitor integration
 
Azure Video Indexer now supports Diagnostics settings for Audit events. Logs of Audit events can now be exported through diagnostics settings to Azure Log Analytics, Storage, Event Hubs, or a third-party solution.

The additions enable easier access to analyze the data, monitor resource operation, and create automatically flows to act on an event. For more information, see [Monitor Azure Video Indexer](monitor-video-indexer.md).

### Video Insights improvements

Object Character Reader (OCR) is improved by 60%. Face Detection is improved by 20%. Label accuracy is improved by 30% over a wide variety of videos. These improvements are available immediately in all regions and do not require any changes by the customer.

### Service tag 

Azure Video Indexer is now part of [Network Service Tags](network-security.md). Video Indexer often needs to access other Azure resources (for example, Storage). If you secure your inbound traffic to your resources with a Network Security Group you can now select Video Indexer as part of the built-in Service Tags. This will simplify security management as we populate the Service Tag with our public IPs.

### Celebrity recognition toggle 

You can now enable or disable the celebrity recognition model on the account level (on classic account only). To turn on or off the model, go to the **Model customization** > toggle on/off the model. Once you disable the model, Video Indexer insights will not include the output of celebrity model and will not run the celebrity model pipeline. 

:::image type="content" source="./media/release-notes/celebrity-recognition.png" alt-text="Screenshot showing the celebrity recognition toggle.":::

### Azure Video Indexer repository name 

As of May 1st, our new updated repository of Azure Video Indexer widget was renamed. Use https://www.npmjs.com/package/@azure/video-indexer-widgets instead

## April 2022 

### Renamed **Azure Video Analyzer for Media** back to **Azure Video Indexer**

As of today, Azure Video analyzer for Media product name is **Azure Video Indexer** and all product related assets (web portal, marketing materials). It is a backward compatible change that has no implication on APIs and links. **Azure Video Indexer**'s new logo: 

:::image type="content" source="../applied-ai-services/media/video-indexer.svg" alt-text="New logo":::

## March 2022

### Closed Captioning files now support including speakers’ attributes

Azure Video Indexer enables you to include speakers' characteristic based on a closed captioning file that you choose to download. To include the speakers’ attributes, select Downloads -> Closed Captions -> choose the closed captioning downloadable file format (SRT, VTT, TTML, TXT, or CSV) and check **Include speakers** checkbox.

### Improvements to the widget offering

The following improvements were made:

* Azure Video Indexer widgets support more than 1 locale in a widget's parameter.
* The Insights widgets support initial search parameters and multiple sorting options. 
* The Insights widgets also include a confirmation step before deleting a face to avoid mistakes.
* The widget customization now supports width as strings (for example 100%, 100vw).

## February 2022

### Public preview of Azure Video Indexer account management based on ARM in Government cloud

Azure Video Indexer website is now supporting account management based on ARM in public preview (see, [November 2021 release note](#november-2021)).

### Leverage open-source code to create ARM based account

Added new code samples including HTTP calls to use Azure Video Indexer create, read, update and delete (CRUD) ARM API for solution developers. See [this sample](https://github.com/Azure-Samples/media-services-video-indexer/tree/master/ARM-Quick-Start).

## January 2022

### Improved audio effects detection

The audio effects detection capability was improved to have a better detection rate over the following classes:

* Crowd reactions (cheering, clapping, and booing),
* Gunshot or explosion,
* Laughter

For more information, see [Audio effects detection](audio-effects-detection.md).

### New source languages support for STT, translation, and search on the website

Azure Video Indexer introduces source languages support for STT (speech-to-text), translation, and search in Hebrew (he-IL), Portuguese (pt-PT), and Persian (fa-IR) on the [Azure Video Indexer](https://www.videoindexer.ai/) website.
It means transcription, translation, and search features are also supported for these languages in Azure Video Indexer web applications and widgets.

## December 2021

### The projects feature is now GA

The projects feature is now GA and ready for productive use. There is no pricing impact related to the "Preview to GA" transition. See [Add video clips to your projects](use-editor-create-project.md).

### New source languages support for STT, translation, and search on API level

Azure Video Indexer introduces source languages support for STT (speech-to-text), translation, and search in Hebrew (he-IL), Portuguese (pt-PT), and Persian (fa-IR) on the API level.

### Matched person detection capability

When indexing a video with Azure Video Indexer advanced video settings, you can view the new matched person detection capability. If there are people observed  in your media file, you can now view the specific person who matched each of them through the media player.

## November 2021

### Public preview of Azure Video Indexer account management based on ARM

Azure Video Indexer introduces a public preview of Azure Resource Manager (ARM) based account management. You can leverage ARM-based Azure Video Indexer APIs to create, edit, and delete an account from the [Azure portal](https://portal.azure.com/#home).

> [!NOTE]
> The Government cloud includes support for CRUD ARM based accounts from Azure Video Indexer API and from the Azure portal.
>
> There is currently no support from the Azure Video Indexer [website](https://www.videoindexer.ai).

For more information go to [create an Azure Video Indexer account](https://techcommunity.microsoft.com/t5/azure-ai/azure-video-analyzer-for-media-is-now-available-as-an-azure/ba-p/2912422).

### People’s clothing detection

When indexing a video with Azure Video Indexer advanced video settings, you can view the new people’s clothing detection capability. If there are people detected in your media file, you can now view the clothing type they are wearing through the media player.

### Face bounding box (preview)

You can now turn on a bounding box for detected faces during indexing of the media file. The face bounding box feature is available when indexing your file by choosing the **standard**, **basic**, or **advanced** indexing presets.

You can enable the bounding boxes through the player.

## October 2021

### Embed widgets in your app using Azure Video Indexer package

Use the new Azure Video Indexer (AVAM) `@azure/video-analyzer-for-media-widgets` npm package to add `insights` widgets to your app and customize it according to your needs.

The new AVAM package enables you to easily embed and communicate between our widgets and your app, instead of adding an `iframe` element to embed the insights widget. Learn more in [Embed and customize Azure Video Indexer widgets in your app](https://techcommunity.microsoft.com/t5/azure-media-services/embed-and-customize-azure-video-analyzer-for-media-widgets-in/ba-p/2847063). 

## August 2021

### Re-index video or audio files

There is now an option to re-index video or audio files that have failed during the indexing process.

### Improve accessibility support

Fixed bugs related to CSS, theming and accessibility:

* high contrast
* account settings and insights views in the [portal](https://www.videoindexer.ai).

## July 2021

### Automatic Scaling of Media Reserved Units

Starting August 1st 2021, Azure Video Indexer enabled [Media Reserved Units (MRUs)](/azure/media-services/latest/concept-media-reserved-units) auto scaling by [Azure Media Services](/azure/media-services/latest/media-services-overview), as a result you do not need to manage them through Azure Video Indexer. That will allow price optimization, for example price reduction in many cases, based on your business needs as it is being auto scaled.

## June 2021

### Azure Video Indexer deployed in six new regions

You can now create an Azure Video Indexer paid account in France Central, Central US, Brazil South, West Central US, Korea Central, and Japan West regions.

## May 2021

### New source languages support for speech-to-text (STT), translation, and search

Azure Video Indexer now supports STT, translation, and search in Chinese (Cantonese) ('zh-HK'), Dutch (Netherlands) ('Nl-NL'), Czech ('Cs-CZ'), Polish ('Pl-PL'), Swedish (Sweden) ('Sv-SE'), Norwegian('nb-NO'), Finnish('fi-FI'), Canadian French ('fr-CA'), Thai('th-TH'),
Arabic: (United Arab Emirates) ('ar-AE', 'ar-EG'), (Iraq) ('ar-IQ'), (Jordan) ('ar-JO'), (Kuwait) ('ar-KW'), (Lebanon) ('ar-LB'), (Oman) ('ar-OM'), (Qatar) ('ar-QA'), (Palestinian Authority) ('ar-PS'), (Syria) ('ar-SY'), and Turkish('tr-TR').

These languages are available in both API and Azure Video Indexer website. Select the language from the combobox under **Video source language**.

### New theme for Azure Video Indexer

New theme is available: 'Azure' along with the 'light' and 'dark themes. To select a theme, click on the gear icon in the top-right corner of the website, find themes under **User settings**.

### New open-source code you can leverage

Three new Git-Hub projects are available at our [GitHub repository](https://github.com/Azure-Samples/media-services-video-indexer):

* Code to help you leverage the newly added [widget customization](https://github.com/Azure-Samples/media-services-video-indexer/tree/master/Embedding%20widgets).
* Solution to help you add [custom search](https://github.com/Azure-Samples/media-services-video-indexer/tree/master/VideoSearchWithAutoMLVision) to your video libraries.
* Solution to help you add [de-duplication](https://github.com/Azure-Samples/media-services-video-indexer/commit/6b828f598f5bf61ce1b6dbcbea9e8b87ba11c7b1) to your video libraries.

### New option to toggle bounding boxes (for observed people) on the player

When indexing a video through our advanced video settings, you can view our new observed people capabilities. If there are people detected in your media file, you can enable a bounding box on the detected person through the media player.

## April 2021

The Video Indexer service was renamed to Azure Video Indexer.

### Improved upload experience in the portal

Azure Video Indexer has a new upload experience in the [portal](https://www.videoindexer.ai). To upload your media file, press the **Upload** button from the **Media files** tab.

### New developer portal in available in gov-cloud

[Azure Video Indexer Developer Portal](https://api-portal.videoindexer.ai) is now also available in Azure for US Government.

### Observed people tracing (preview)

Azure Video Indexer now detects observed people in videos and provides information such as the location of the person in the video frame and the exact timestamp (start, end) when a person appears. The API returns the bounding box coordinates (in pixels) for each person instance detected, including its confidence.

For example, if a video contains a person, the detect operation will list the person appearances together with their coordinates in the video frames. You can use this functionality to determine the person path in a video. It also lets you determine whether there are multiple instances of the same person in a video.

The newly added observed people tracing feature is available when indexing your file by choosing the **Advanced option** -> **Advanced video** or **Advanced video + audio** preset (under Video + audio indexing). Standard  and basic indexing presets will not include this new advanced model.

When you choose to see Insights of your video on the Azure Video Indexer website, the Observed People Tracing will show up on the page with all detected people thumbnails. You can choose a thumbnail of a person and see where the person appears in the video player.

The feature is also available in the JSON file generated by Azure Video Indexer. For more information, see [Trace observed people in a video](observed-people-tracing.md).

### Detected acoustic events with **Audio Effects Detection** (preview)

You can now see the detected acoustic events in the closed captions file. The file can be downloaded from the Azure Video Indexer portal and is available as an artifact in the GetArtifact API.

**Audio Effects Detection** (preview) component detects various acoustics events and classifies them into different acoustic categories (such as Gunshot, Screaming, Crowd Reaction and more). For more information, see [Audio effects detection](audio-effects-detection.md).

## March 2021

### Audio analysis

Audio analysis is available now in additional new bundle of audio features at different price point. The new **Basic Audio** analysis preset provides a low-cost option to only extract speech transcription, translation and format output captions and subtitles. The **Basic Audio** preset will produce two separate meters on your bill, including a line for transcription and a separate line for caption and subtitle formatting. More information on the pricing, see the [Media Services pricing](https://azure.microsoft.com/pricing/details/media-services/) page.

The newly added bundle is available when indexing or re-indexing your file by choosing the **Advanced option** -> **Basic Audio** preset (under the **Video + audio indexing** drop-down box).

### New developer portal

Azure Video Indexer has a new [Developer Portal](https://api-portal.videoindexer.ai/), try out the new Azure Video Indexer APIs and find all the relevant resources in one place: [GitHub repository](https://github.com/Azure-Samples/media-services-video-indexer), [Stack overflow](https://stackoverflow.com/questions/tagged/video-indexer), [Azure Video Indexer tech community](https://techcommunity.microsoft.com/t5/azure-media-services/bg-p/AzureMediaServices/label-name/Video%20Indexer) with relevant blog posts, [Azure Video Indexer FAQs](faq.yml), [User Voice](https://feedback.azure.com/d365community/forum/09041fae-0b25-ec11-b6e6-000d3a4f0858) to provide your feedback and suggest features, and  ['CodePen' link](https://codepen.io/videoindexer) with widgets code samples.

### Advanced customization capabilities for insight widget

SDK is now available to embed Azure Video Indexer's insights widget in your own service and customize its style and data. The SDK supports the standard Azure Video Indexer insights widget and a fully customizable insights widget. Code sample is available in [Azure Video Indexer GitHub repository](https://github.com/Azure-Samples/media-services-video-indexer/tree/master/Embedding%20widgets/widget-customization). With this advanced customization capabilities, solution developer can apply custom styling and bring customer’s own AI data and present that in the insight widget (with or without Azure Video Indexer insights).

### Azure Video Indexer deployed in the US North Central, US West and Canada Central

You can now create an Azure Video Indexer paid account in the US North Central, US West and Canada Central regions

### New source languages support for speech-to-text (STT), translation and search

Azure Video Indexer now supports STT, translation and search in Danish ('da-DK'), Norwegian('nb-NO'), Swedish('sv-SE'), Finnish('fi-FI'), Canadian French ('fr-CA'), Thai('th-TH'), Arabic ('ar-BH', 'ar-EG', 'ar-IQ', 'ar-JO', 'ar-KW', 'ar-LB', 'ar-OM', 'ar-QA', 'ar-S', and 'ar-SY'), and Turkish('tr-TR'). Those languages are available in both API and Azure Video Indexer website.

### Search by Topic in Azure Video Indexer Website

You can now use the search feature, at the top of  the [Azure Video Indexer website](https://www.videoindexer.ai/account/login) page, to search for videos with specific topics.

## February 2021

### Multiple account owners

Account owner role was added to Azure Video Indexer. You can add, change, and remove users; change their role. For details on how to share an account, see [Invite users](invite-users.md).

### Audio event detection (public preview)

> [!NOTE]
> This feature is only available in trial accounts.

Azure Video Indexer now detects the following audio effects in the non-speech segments of the content: gunshot, glass shatter, alarm, siren, explosion, dog bark, screaming, laughter, crowd reactions (cheering, clapping, and booing) and Silence.

The newly added audio affects feature is available when indexing your file by choosing the **Advanced option** -> **Advanced audio** preset (under Video + audio indexing). Standard indexing will only include **silence** and **crowd reaction**.

The **clapping** event type that was included in the previous audio effects model, is now extracted a part of the **crowd reaction** event type.

When you choose to see **Insights** of your video on the [Azure Video Indexer](https://www.videoindexer.ai/) website, the Audio Effects show up on the page.

:::image type="content" source="./media/release-notes/audio-detection.png" alt-text="Audio event detection":::

### Named entities enhancement

The extracted list of people and location was extended and updated in general.

In addition, the model now includes people and locations in-context which are not famous, like a ‘Sam’ or ‘Home’ in the video.

## January 2021

### Azure Video Indexer is deployed on US Government cloud

You can now create an Azure Video Indexer paid account on US government cloud in Virginia and Arizona regions.
Azure Video Indexer trial offering isn't available in the mentioned region. For more information go to Azure Video Indexer Documentation.

### Azure Video Indexer deployed in the India Central region

You can now create an Azure Video Indexer paid account in the India Central region.

### New Dark Mode for the Azure Video Indexer website experience

The Azure Video Indexer website experience is now available in dark mode.
To enable the dark mode open the settings panel and toggle on the **Dark Mode** option.

:::image type="content" source="./media/release-notes/dark-mode.png" alt-text="Dark mode setting":::

## December 2020 

### Azure Video Indexer deployed in the Switzerland West and Switzerland North

You can now create an Azure Video Indexer paid account in the Switzerland West and Switzerland North regions.

## October 2020

### Animated character identification improvements

Azure Video Indexer supports detection, grouping, and recognition of characters in animated content via integration with Cognitive Services custom vision. We added a major improvement to this AI algorithm in the detection and characters recognition, as a result insight accuracy and identified characters are significantly improved.

### Planned Azure Video Indexer website authenticatication changes

Starting March 1st 2021, you no longer will be able to sign up and sign in to the [Azure Video Indexer website](https://www.videoindexer.ai/) [developer portal](video-indexer-use-apis.md) using Facebook or LinkedIn.

You will be able to sign up and sign in using one of these providers: Azure AD, Microsoft, and Google.

> [!NOTE]
> The Azure Video Indexer accounts connected to LinkedIn and Facebook will not be accessible after March 1st 2021.
>
> You should [invite](invite-users.md) an Azure AD, Microsoft, or Google email you own to the Azure Video Indexer account so you will still have access. You can add an additional owner of supported providers, as described in [invite](invite-users.md). <br/>
> Alternatively, you can create a paid account and migrate the data.

## August 2020

### Mobile design for the Azure Video Indexer website

The Azure Video Indexer website experience is now supporting mobile devices. The user experience is responsive to adapt to your mobile screen size (excluding customization UIs).

### Accessibility improvements and bug fixes

As part of WCAG (Web Content Accessibility guidelines), the Azure Video Indexer website experience is aligned with grade C, as part of Microsoft Accessibility standards. Several bugs and improvements related to keyboard navigation, programmatic access, and screen reader were solved.

## July 2020

### GA for multi-language identification

Multi-language identification is moved from preview to GA and ready for productive use.

There is no pricing impact related to the "Preview to GA" transition.

### Azure Video Indexer website improvements

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

### Azure Video Indexer deployed in the East US

You can now create an Azure Video Indexer paid account in the East US region.

### Azure Video Indexer URL

Azure Video Indexer regional endpoints were all unified to start only with www. No action item is required.

From now on, you reach www.videoindexer.ai whether it is for embedding widgets or logging into Azure Video Indexer web applications.

Also wus.videoindexer.ai would be redirected to www. More information is available in [Embed Azure Video Indexer widgets in your apps](video-indexer-embed-widgets.md).

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

    The Account object has a `Url` field pointing to the location of the [Azure Video Indexer website](https://www.videoindexer.ai/).
For paid accounts the `Url` field is currently pointing to an internal URL instead of the public website.
In the coming weeks we will change it and return the [Azure Video Indexer website](https://www.videoindexer.ai/) URL for all accounts (trial and paid).

    Do not use the internal URLs, you should be using the [Azure Video Indexer public APIs](https://api-portal.videoindexer.ai/).
* If you are embedding Azure Video Indexer URLs in your applications and the URLs are not pointing to the [Azure Video Indexer website](https://www.videoindexer.ai/) or the Azure Video Indexer API endpoint (`https://api.videoindexer.ai`) but rather to a regional endpoint (for example, `https://wus2.videoindexer.ai`), regenerate the URLs.

   You can do it by either:

    * Replacing the URL with a URL pointing to the Azure Video Indexer widget APIs (for example, the [insights widget](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Get-Video-Insights-Widget))
    * Using the Azure Video Indexer website to generate a new embedded URL:

         Press **Play** to get to your video's page -> click the **&lt;/&gt; Embed** button -> copy the URL into your application:

    The regional URLs are not supported and will be blocked in the coming weeks.

## January 2020

### Custom language support for additional languages

Azure Video Indexer now supports custom language models for `ar-SY` , `en-UK`, and `en-AU` (API only).

### Delete account timeframe action update

Delete account action now deletes the account within 90 days instead of 48 hours.

### New Azure Video Indexer GitHub repository

A new Azure Video Indexer GitHub with different projects, getting started guides and code samples is now available:
https://github.com/Azure-Samples/media-services-video-indexer

### Swagger update

Azure Video Indexer unified **authentications** and **operations** into a single [Azure Video Indexer OpenAPI Specification (swagger)](https://api-portal.videoindexer.ai/api-details#api=Operations&operation). Developers can find the APIs in [Azure Video Indexer Developer Portal](https://api-portal.videoindexer.ai/).

## December 2019

### Update transcript with the new API

Update a specific section in the transcript using the [Update-Video-Index](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Update-Video-Index) API.

### Fix account configuration from the Azure Video Indexer portal

You can now update Media Services connection configuration in order to self-help with issues like:

* incorrect Azure Media Services resource
* password changes
* Media Services resources were moved between subscriptions

To fix the account configuration, in the Azure Video Indexer portal navigate to Settings > Account tab (as owner).

### Configure the custom vision account

Configure the custom vision account on paid accounts using the Azure Video Indexer portal (previously, this was only supported by API). To do that, sign in to the Azure Video Indexer portal, choose Model Customization > Animated characters > Configure.

### Scenes, shots and keyframes – now in one insight pane

Scenes, shots, and keyframes are now merged into one insight for easier consumption and navigation. When you select the desired scene you can see what shots and keyframes it consists of.

### Notification about a long video name

When a video name is longer than 80 characters, Azure Video Indexer shows a descriptive error on upload.

### Streaming endpoint is disabled notification

When streaming endpoint is disabled, Azure Video Indexer will show a descriptive error on the player page.

### Error handling improvement

Status code 409 will now be returned from [Re-Index Video](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Re-Index-Video) and [Update Video Index](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Update-Video-Index) APIs in case a video is actively indexed, to prevent overriding the current re-index changes by accident.

## November 2019

* Korean custom language models support

    Azure Video Indexer now supports custom language models in Korean (`ko-KR`) in both the API and portal.
* New languages supported for speech-to-text (STT)

    Azure Video Indexer APIs now support STT in Arabic Levantine (ar-SY), English UK dialect (en-GB), and English Australian dialect (en-AU).

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

## August 2019 updates

### Azure Video Indexer deployed in UK South

You can now create an Azure Video Indexer paid account in the UK south region.

### New Editorial Shot Type insights available

New tags added to video shots provides editorial “shot types” to identify them with common editorial phrases used in the content creation workflow such as: extreme closeup, closeup, wide, medium, two shot, outdoor, indoor, left face and right face (Available in the JSON).

### New People and Locations entities extraction available

Azure Video Indexer identifies named locations and people via natural language processing (NLP) from the video’s OCR and transcription. Azure Video Indexer uses machine learning algorithm to recognize when specific locations (for example, the Eiffel Tower) or people (for example, John Doe) are being called out in a video.

### Keyframes extraction in native resolution

Keyframes extracted by Azure Video Indexer are available in the original resolution of the video.

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

The Azure Video Indexer AI-editor is now available as a widget to be embedded in customer applications.

### Update custom language model from closed caption file from the portal

Customers can provide VTT, SRT, and TTML file formats as input for language models in the customization page of the portal.

## June 2019

### Azure Video Indexer deployed to Japan East

You can now create an Azure Video Indexer paid account in the Japan East region.

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

When calling the [Update Video transcript API](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Update-Video-Transcript), the transcript is added automatically. The training model associated with the video is updated automatically as well. For information on how to customize and train your language models, see [Customize a Language model with Azure Video Indexer](customize-language-model-overview.md).

### New download transcript formats – TXT and CSV

In addition to the closed captioning format already supported (SRT, VTT, and TTML), Azure Video Indexer now supports downloading the transcript in TXT and CSV formats.

## Next steps

[Overview](video-indexer-overview.md)
