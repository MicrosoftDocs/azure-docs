## Media quality statistics for ongoing call

[!INCLUDE [public-preview-notes](../../../../includes/public-preview-include.md)]

Media quality statistics is an extended feature of the core `Call` API. You first need to obtain the MediaStats feature API object:

```java
MediaStatsCallFeature mediaStatsCallFeature = call.feature(Features.MEDIA_STATS);
```

The Media Stats feature object have the following API structure:
- `OnSampleReportedListener`: Event for listening for periodic reports of the Media Stats.
- `setSampleIntervalInSeconds(int value)`: Sets the interval in seconds of the Media Stats report generation. If not specified, sill use defaults.
- A `MediaStatsReport` object that contains the definition of the Outgoing and Incoming Media Stats categorized by Audio, Video and Screen Share.
  - `getOutgoingMediaStats()`: The list of Media Stats for Outgoing media.
    - `getAudio()`: The list of Media Stats for the Outgoing Audio.
    - `getVideo()`: The list of Media Stats for the Outgoing Video.
    - `getScreenShare()`: The list of Media Stats for the Outgoing Screen Share. 
  - `getIncomingStats()`: The list of Media Stats for Incoming media.
    - `getAudio()`: The list of Media Stats for the Incoming Audio.
    - `getVideo()`: The list of Media Stats for the Incoming Video.
    - `getScreenShare()`: The list of Media Stats for the Incoming Screen Share. 
  - `getGeneratedAt()`: The date when the report was generated. 

Then, subscribe to the `addOnSampleReportedListener` event to get regular updates about the current media quality statistics:

```java
mediaStatsCallFeature.addOnSampleReportedListener(handleSampleReportedListener);
// Optional, set the interval for Media Stats report generation
mediaStatsCallFeature.setSampleReportedIntervalInSevonds(15);

private void handleSampleReportedListener(MediaStatsReportEvent args) {
    // Obtain the Media Stats Report instance.
    MediaStatsReport report = args.getReport();

    // Obtain the Outgoing Media Stats for Audio
    OutgoingAudioMediaStats outgoingAudioMediaStats = report.getOutgoingMediaStats().getAudio();

    // Obtain the Outgoing Media Stats for Video
    OutgoingVideoMediaStats outgoingVideoMediaStats = report.getOutgoingMediaStats().getVideo();

    // Obtain the Outgoing Media Stats for Screen Share
    OutgoingScreenShareMediaStats outgoingScreenShareMediaStats report.getOutgoingMediaStats().getScreenShare();

    // Obtain the Incoming Media Stats for Audio
    IncomingAudioMediaStats incomingAudioMediaStats report.getIncomingMediaStats().getAudio();

    // Obtain the Incoming Media Stats for Video
    IncomingVideoMediaStats incomingVideoMediaStats report.getIncomingMediaStats().getVideo();

    // Obtain the Incoming Media Stats for Screen Share
    IncomingScreenShareMediaStats incomingScreenShareMediaStats report.getIncomingMediaStats().getScreenShare();
}
```

[!INCLUDE [native matrics](media-stats-native-metrics.md)]
