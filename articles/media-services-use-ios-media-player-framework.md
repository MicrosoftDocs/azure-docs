<properties urlDisplayName="iOS Media Player Framework" pageTitle="Use the iOS Media Player Framework with Azure Media Services" metaKeywords="" description="Learn how to use the Media Services iOS Media Player Framework library to create rich, dynamic apps.," metaCanonical="" services="media-services" documentationCenter="" title="How to use the Azure Media Services iOS Media Player Framework" authors="juliako" solutions="" manager="dwrede" editor="" />

<tags ms.service="media-services" ms.workload="media" ms.tgt_pltfrm="mobile-ios" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="juliako" />



#How to use the Azure Media Services iOS Media Player Framework

The Azure Media Services iOS Media Player Framework library makes it easy for iPod, iPhone, and iPad developers to create rich, dynamic client applications that create and mix video and audio streams together on the fly. For example, applications that display sports content can easily insert advertisements wherever they choose and control how often those advertisements appear even when the main content is rewound. Educational applications can use the same functionality, for example, to create content in which the main lectures have asides, or sidebars, before returning to the main content.

Typically it's relatively complex work to build an application that can create content streams that result from an interaction between the application and its user - normally, you must create the entire stream from scratch and store it, in advance, on the server. Using the iOS Media Player Framework, you can build client applications that can do all of this without having control over or modifying the main content stream. You can:

- Schedule content streams in advance on the client device.
- Schedule pre-roll advertisements or inserts.
- Schedule post-roll advertisements or inserts.
- Schedule mid-roll advertisements or inserts and create ad pods.
- Control whether the mid-roll advertisement or insert plays each time the content timeline is rewound or whether it only plays once and then removes itself from the timeline.
- Dynamically insert content directly into the timeline as a result of any event, whether the user pushed a button or the application received a notification from a service - for example, a news content program could send notifications of breaking news and the application could "pause" the main content to dynamically load a breaking news stream. 

Combining these features with the media playing facilities of iOS devices makes it possible to build very rich media experiences in a very short time with fewer resources.

The SDK contains a SamplePlayer application that demonstrates how to build an iOS application that uses most of these features to create a content stream on the fly as well as enable the user to trigger an insert dynamically by pushing a button. This tutorial shows the main components of the SamplePlayer application and how you can use it as a starting point for your application.

## Getting Started with the Sample Player Application
The following steps describe how to get the application and provide a tour of the areas of the application that make use of the framework. 

1. Clone the git repository. 

    `git clone https://github.com/WindowsAzure/azure-media-player-framework`

2. Open project located at `azure-media-player-framework/src/iOS/HLSClient/`: **SamplePlayer.xcodeproj**.

 
3. Here is the structure of the sample player:

![HLS Sample Code structure](http://mingfeiy.com/wp-content/uploads/2013/01/HLS-Structure.png)

4. Under the iPad folder, there are two .xib files: **SeekbarViewController** and **SamplePlayerViewController**. They create the iPad application UI layout. Similarly, there are two .xib files under the iPhone folder defining the seekbar and controller. 

6. Main application logic resides in **SamplePlayerViewController.m** under the `Shared` folder. Most of code snippets described below are located in that file. 

## Understanding the UI Layout
There are two .xib files define our player interface. (The following discussion uses the iPad layout as the example; but the iPhone layout is very similar and the principles are the same.)
### SamplePlayerViewController_iPad.xib
![Sample Player Address Bar](http://mingfeiy.com/wp-content/uploads/2013/01/addressbar.png)

* The **Media URL** is the URL used to load a media stream. The application has a prepulated list of media URLs that you can use by using URL selection buttons. Alternatively, you can enter your own Http Live Streaming (HLS) content URL. This media content will be used as the first main content. 
**Note: please don't leave this URL empty.**

* The **URL Selection** buttons enable you to select alternate URLs from the media URL list.

### SeekbarViewController_iPad.xib
![Seek Bar Controller](http://mingfeiy.com/wp-content/uploads/2013/01/controller.png)
* Use the **Play Button** to play and pause media playback.

* The **Seek bar** projects the entire playback timeline. When you seek, please press and hold, drag to the position you want, and release the seek button on seek bar. 

**Note**: When the viewer seeks into an advertisement, a new seek bar appears with advertisement's duration. The Main seek bar only presents the main content's duration (that is, an advertisement has a duration of 0 in main seek bar).

* The **Player time** control shows two times (`Label:playerTime`), such as 00:23/02:10. In this case, 00:23 would be the current playback time and 02:10 would be the total duration of the media. 

* **SkipFroward and SkipBackward button**s  do not currently work as expected; an updated version will be released soon.

* Pressing the **Schedule Now button** while main content playing inserts an advertisement (you can define the ad source url in code-behind). Note: In the current version, you can't schedule an advertisement while the other advertisement is playing. 

### How to Schedule the Main Content
Scheduled a content clip from 0 second to 80 seconds:

    //Schedule the main content
    MediaTime *mediaTime = [[[MediaTime alloc] init] autorelease];
    mediaTime.currentPlaybackPosition = 0;
    mediaTime.clipBeginMediaTime = 0;
    mediaTime.clipEndMediaTime = 80;
        
    int clipId = 0;
    if (![framework appendContentClip:[NSURL URLWithString:url] withMediaTime:mediaTime andGetClipId:&clipId])
    {
        [self logFrameworkError];
    }

In the preceding sample code, the:

* **MediaTime** object controls the video clip you want to schedule as the main content. In the preceding example, video clip will be scheduled to have a duration of 80 seconds (from 0 second to 80 seconds);
* **clipBeginMediaTime** represents the starting time for a video to begin playback. For example, if **clipBeginMediaTime** = 5, then this video clip is started 5 seconds into the video clip.
* **clipEndMediaTime** represents the end time for a video to play back. If **clipEndMediaTime**=100, the video playback ends at the 100th second of the video clip.
*We then schedule the **MediaTime** by asking the framework to **appendContentClip**. In the preceding example, the main content URL is given in `[NSURL URLWithString:url]` and the scheduling for that media is set using **withMedia**:
 `[framework appendContentClip:[NSURL URLWithString:url] withMediaTime:mediaTime andGetClipId:&clipId])` .

**Note:** Always schedule main content before scheduling any advertisement (including pre-roll advertisement). 

### Variation: If you have two main content clips playing, you could also schedule second clip after the first one with following code:

    //Schedule second content
    NSString *secondContent=@"http://wamsblureg001orig-hs.cloudapp.net/6651424c-a9d1-419b-895c-6993f0f48a26/The%20making%20of%20Microsoft%20Surface-m3u8-aapl.ism/Manifest(format=m3u8-aapl)";
    mediaTime.currentPlaybackPosition = 0;
    mediaTime.clipBeginMediaTime = 30;
    mediaTime.clipEndMediaTime = 80;
    if (![framework appendContentClip:[NSURL URLWithString:secondContent] withMediaTime:mediaTime andGetClipId:&clipId])
    {
        [self logFrameworkError];
    }

Doing this following the preceding code schedules two content streams on the main content timeline. First one is scheduled based on `URLWithString:url` and second content is scheduled based on `URLWithString:secondContent`. For the second content, the content starts from a point 30 seconds into the media stream and ends at 80 seconds into it. 

## Advertisement scheduling 
In the current release, only a **pauseTimeline=false** advertisement is supported, which means that after an advertisement ends, the player will pick up from where main content left off. 

Here are some key points:
<ul><li> All **LinearTime.duration** needs to be 0 when scheduling an advertisement.</li>
<li> When **clipEndMediaTime** is longer than the duration of the advertisement, the advertisement ends after it is finished and no exception is thrown. You are advised to verify whether advertisement natural duration is within the render time (**clipEndMediaTime**) so you don't lose an ad opportunity.</li> 
<li> Pre-roll, mid-roll, and post-roll advertisements are supported. Pre-roll can only be scheduled at the very beginning of all content. For instance, you can't schedule a pre-roll for the second content in a rough cut editing (RCE) scenario. </li>
<li> Sticky ads and play-once ads are supported and can be used in conjunction with either pre-roll, mid-roll or post-roll advertisement.</li>
<li> Advertisement format can be either .Mp4 or HLS.</li>
</ul>
### How to Schedule Pre-roll, Mid-roll, Post-roll Ads, and Ad Pods

####Scheduling Pre-roll Advertisements

    LinearTime *adLinearTime = [[[LinearTime alloc] init] autorelease];
    NSString *adURLString = @"http://smoothstreamingdemo.blob.core.windows.net/videoasset/WA-BumpShort_120530-1.mp4";
    AdInfo *adInfo = [[[AdInfo alloc] init] autorelease];
    adInfo.clipURL = [NSURL URLWithString:adURLString];
    adInfo.mediaTime = [[[MediaTime alloc] init] autorelease];
    adInfo.mediaTime.clipBeginMediaTime = 0;
    adInfo.mediaTime.clipEndMediaTime = 5;
    adInfo.policy = [[[PlaybackPolicy alloc] init] autorelease];
    adInfo.appendTo = -1;
    adInfo.type = AdType_Preroll;
    adLinearTime.duration = 0;
    if (![framework scheduleClip:adInfo atTime:adLinearTime forType:PlaylistEntryType_Media andGetClipId:&adIndex])
    {
        [self logFrameworkError];
    }

The **AdInfo** object represents all the information about your ad clip:
* The **ClipURL** is the URL for the clip source.
* The **mediaTime** property indicates how long an ad gets to play. (**clipBeginMediaTime** is the starting time of an ad and **clipEndMediaTime** defines the end of the advertisement.) In the preceding sample code, we schedule an advertisement for 5 seconds, starting from 0 until the 5th second of the advertisement duration.
* The **Policy** object is not currently used by the framework.
* You must set the **appendTo** value to to -1 if it is not an Ad Pod. 
* The **type** value can pre-roll, mid-roll, post-roll or ad pod. For pre-roll or post-roll, because there are no timings associated with it, specify the type. 

####Scheduling Mid-roll Advertisements

If you add `adLinearTime.startTime = 23;` to the preceding code sample, the advertisement begins playing at 23 seconds in the main content timeline.

####Scheduling Post-roll Advertisements

    //Schedule Post Roll Ad
    NSString *postAdURLString=@"http://wamsblureg001orig-hs.cloudapp.net/aa152d7f-3c54-487b-ba07-a58e0e33280b/wp-m3u8-aapl.ism/Manifest(format=m3u8-aapl)";
    AdInfo *postAdInfo = [[[AdInfo alloc] init] autorelease];
    postAdInfo.clipURL = [NSURL URLWithString:postAdURLString];
    postAdInfo.mediaTime = [[[MediaTime alloc] init] autorelease];
    postAdInfo.mediaTime.clipBeginMediaTime = 0;
    postAdInfo.mediaTime.clipEndMediaTime = 5;
    postAdInfo.policy = [[[PlaybackPolicy alloc] init] autorelease];
    postAdInfo.type = AdType_Postroll;
    adLinearTime.duration = 0;
    if (![framework scheduleClip:postAdInfo atTime:adLinearTime forType:PlaylistEntryType_Media andGetClipId:&adIndex])
    {
        [self logFrameworkError];
    }

The only difference from the pre-roll advertisement scheduling is `postAdInfo.type = AdType_Postroll;`. The preceding code scheduled a 5-second advertisement as post-roll. 

#### Scheduling Ad Pods
Ad-Pod are an advertisement break with multiple advertisements playing back-to-back. Here is the code for scheduling two advertisements in one ad pod. 

    NSString *adpodSt1=@"https://portalvhdsq3m25bf47d15c.blob.core.windows.net/asset-e47b43fd-05dc-4587-ac87-5916439ad07f/Windows%208_%20Cliffjumpers.mp4?st=2012-11-28T16%3A31%3A57Z&se=2014-11-28T16%3A31%3A57Z&sr=c&si=2a6dbb1e-f906-4187-a3d3-7e517192cbd0&sig=qrXYZBekqlbbYKqwovxzaVZNLv9cgyINgMazSCbdrfU%3D";
    AdInfo *adpodInfo1 = [[[AdInfo alloc] init] autorelease];
    adpodInfo1.clipURL = [NSURL URLWithString:adpodSt1];
    adpodInfo1.mediaTime = [[[ManifestTime alloc] init] autorelease];
    adpodInfo1.mediaTime.clipBeginMediaTime = 0;
    adpodInfo1.mediaTime.clipEndMediaTime = 17;
    adpodInfo1.mediaTime = [[[PlaybackPolicy alloc] init] autorelease];
    adpodInfo1.type = AdType_Midroll;
    adpodInfo1.appendTo=-1;
    int32_t adIndex = 0;
    if (![framework scheduleClip:adpodInfo1 atTime:adLinearTime forType:PlaylistEntryType_Media andGetClipId:&adIndex])
    {
        [self logFrameworkError];
    }
        
    NSString *adpodSt2=@"https://portalvhdsq3m25bf47d15c.blob.core.windows.net/asset-532531b8-fca4-4c15-86f6-45f9f45ec980/Windows%208_%20Sign%20in%20with%20a%20Smile.mp4?st=2012-11-28T16%3A35%3A26Z&se=2014-11-28T16%3A35%3A26Z&sr=c&si=c6ede35c-f212-4ccd-84da-805c4ebf64be&sig=zcWsj1JOHJB6TsiQL5ZbRmCSsEIsOJOcPDRvFVI0zwA%3D";
    AdInfo *adpodInfo2 = [[[AdInfo alloc] init] autorelease];
    adpodInfo2.clipURL = [NSURL URLWithString:adpodSt2];
    adpodInfo2.mediaTime = [[[ManifestTime alloc] init] autorelease];
    adpodInfo2.mediaTime.clipBeginMediaTime = 0;
    adpodInfo2.mediaTime.clipEndMediaTime = 17;
    adpodInfo2.policy = [[[PlaybackPolicy alloc] init] autorelease];
    adpodInfo2.type = AdType_Pod;
    adpodInfo2.appendTo = adIndex;
    if (![framework scheduleClip:adpodInfo2 atTime:adLinearTime forType:PlaylistEntryType_Media andGetClipId:&adIndex])
    {
        [self logFrameworkError];
    }

There are a few things to note here:
* For the first clip, the **appendTo** is -1. And when we call `[framework scheduleClip:adpodInfo1 atTime:adLinearTime forType:PlaylistEntryType_Media andGetClipId:&adIndex]`, `adIndex` receives a unique value indicating the end of this first clip in the ad pod. Then for the second clip in the ad pod, align the beginning of the second ad with the end of the first by setting **appendTo** as `adpodInfo2.appendTo = adIndex;`, which specifies the ending position of the first as the location to begin the second clip. 
* Then you must set type as `AdType_Pod` to indicate this is a ad pod. 

### How to Schedule Play-Once or "Sticky" Advertisement
    AdInfo *oneTimeInfo = [[[AdInfo alloc] init] autorelease];
    oneTimeInfo.deleteAfterPlay = YES;

As illustrated in the preceding code example, if you set **deleteAfterPlay** to **YES**, this advertisement is played only once. And if you set **deleteAfterPlay** to **NO**, this advertisement continues to play, which we call a "Sticky Ad".
### Please refer to the [Azure Media Player Framework wiki](https://github.com/WindowsAzure/azure-media-player-framework/wiki) for more information.
