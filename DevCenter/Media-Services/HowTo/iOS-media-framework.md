<div chunk="../chunks/article-left-menu.md" />

#Windows Azure Media Services iOS Media Player Framework

The Windows Azure Media Services iOS Media Player Framework library makes it easy for iPod, iPhone, and iPad developers to create rich, dynamic client applications that create and mix video and audio streams together on the fly. For example, applications that display sports content can easily insert advertisements wherever they choose and control how often those advertisements appear even when the main content is rewound. Educational applications can use the same functionality, for example, to create content in which the main lectures have asides, or sidebars, before returning to the main content.

Typically it’s relatively complex work to build an application that can create content streams that result from an interaction between the application and its user – normally, you must create the entire stream from scratch and store it, in advance, on the server. Using the iOS Media Player Framework, you can build client applications that can do all of this without having control over or modifying the main content stream. You can:

- Schedule content streams in advance on the client device.
- Schedule pre-roll advertisements or inserts.
- Schedule post-roll advertisements or inserts.
- Schedule mid-roll advertisements or inserts and create ad pods.
- Control whether the mid-roll advertisement or insert plays each time the content timeline is rewound or whether it only plays once and then removes itself from the timeline.
- Dynamically insert content directly into the timeline as a result of any event, whether the user pushed a button or the application received a notification from a service – for example, a news content program could send notifications of breaking news and the application could “pause” the main content to dynamically load a breaking news stream. 

Combining these features with the media playing facilities of iOS devices makes it possible to build very rich media experiences in a very short time with fewer resources.

The SDK contains a SamplePlayer application that demonstrates how to build an iOS application that uses most of these features to create a content stream on the fly as well as enable the user to trigger an insert dynamically by pushing a button. 

## Getting Started
To get the source code of our SDKs and samples via git just type:

    git clone https://github.com/WindowsAzure/azure-media-player-framework
    cd ./azure-media-player-framework/

## Sample Application
We provide a sample application, located at `azure-media-player-framework/src/iOS/HLSClient/`. It demostrates how you could use this framework to schedule different types of advertisements. All the content and advertisements URLs are from Windows Azure Media Services. It is highly advised to start with this sample application so you could get a general idea on how this SDK works. 


### Please refer to [wiki page](https://github.com/WindowsAzure/azure-media-player-framework/wiki) for more information.
