---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Configure Azure Media Clipper localization | Microsoft Docs 
description: Learn about Azure Media Clipper supported languages and localization support
services: media-services
keywords: clip;subclip;encoding;media
author: dbgeorge
manager: jasonsue
ms.author: dwgeo
ms.date: 03/14/2019
ms.topic: article
# Use only one of the following. Use ms.service for services, ms.prod for on premises. Remove the # before the relevant field.
ms.service: media-services
# product-name-from-white-list

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.devlang:devlang-from-white-list
# ms.suite: 
# ms.tgt_pltfrm:
# ms.reviewer:
# manager: MSFT-alias-manager-or-PM-counterpart
---

# Configure localization 

Azure Media Clipper is available in 18 languages. To set the widget language, you must define the `language` parameter during initialization. Pass in the desired language code string from the following list:
- Chinese (Simplified): zh-hans
- Chinese (Traditional): zh-hant
- Czech: cs
- Dutch, Flemish: nl
- English: en
- French: fr
- German: de
- Hungarian: hu
- Italian: it
- Japanese: ja
- Korean: ko
- Polish: pl
- Portuguese (Brazil): pt-br
- Portuguese (Portugal): pt-pt
- Russian: ru
- Spanish: es
- Swedish: sv
- Turkish: tr

To set a custom language dictionary or extend the default language dictionary, you must define the `languages` or `extraLanguages` parameter, respectively. Pass in a custom dictionary using the following JSON format:

```javascript
{
    '{language-code}': {
        '{message-id}': '{message}',
        ...
    }
    ...
}
```

For example, the following sample defines the localized English strings:

```javascript
{
    'en': {
        'VideoPlayer.noPreview': 'No video preview',
        'VideoPlayer.loadAsset': 'You must provide a valid asset',
        'AssetsPanel.name': 'Name',
        'AssetsPanel.type': 'Asset type',
        'AssetsPanel.actions': 'Actions',
        'AssetsPanel.loading': 'Loading...',
        'AssetsPanel.duration': 'Duration',
        'AssetsPanel.resolution': 'Resolution',
        'AssetsPanel.pluralFiles': '{0} assets',
        'AssetsPanel.searchFiles': 'Search assets',
        'AssetsPanel.showTypes': 'Show:',
        'AssetsPanel.typesInfo': 'Rendered assets are actual MP4 files. Dynamic manifest filters are filters applied to a parent asset\'s video segment playlist.',
        'AssetsPanel.filterTypes': 'Filters',
        'AssetsPanel.assetTypes': 'Assets',
        'AssetsPanel.assetsAll': 'All',
        'AssetsPanel.addAsset': 'Add asset to the end',
        'AssetsPanel.addFilter': 'Add filter to the timeline',
        'AssetsPanel.invalidAsset': 'The metadata of this asset is not compatible with the other assets in the timeline',
        'AssetsPanel.addAssetWarning': 'Subclipping on assets with different resolutions may cause resolution autoscaling.',
        'AssetsPanel.live': 'LIVE',
        'AssetsPanel.unknown': 'UNKNOWN',
        'AssetsPanel.minimGapNotMet': 'The asset duration must be greater than the minimum clip duration ({0} seconds)',
        'VideoPlayer.openAdvancedSettings': 'Advanced settings',
        'VideoPlayer.singleBitrate': 'Single-bitrate MP4 (rendered)',
        'VideoPlayer.multiBitrate': 'Multi-bitrate MP4 (rendered)',
        'VideoPlayer.dynamicManifest': 'Dynamic manifest filter',
        'VideoPlayer.ErrorWithMessage': 'There was an error in the video player, code {0}, message: {1}',
        'Common.cancel': 'Cancel',
        'Common.OK': 'OK',
        'AdvancedSettings.framerate': 'Frame rate',
        'Dropdown.select': 'Select an option...',
        'InputAsset.RemoveInput': 'Remove source',
        'Zoom.startTime': 'Start time',
        'Zoom.endTime': 'End time',
        'VideoPlayer.subclips': 'Subclips:',
        'VideoPlayer.length': 'Clip length:',
        'Accordion.scrollLeft': 'Scroll to the left',
        'Accordion.scrollRight': 'Scroll to the right',
        'AdvancedSettings.title': 'Advanced settings',
        'AdvancedSettings.subclipName': 'Subclip name',
        'AdvancedSettings.subclipType': 'Subclipping mode',
        'AdvancedSettings.includeAudioTracks': 'Include audio tracks',
        'AdvancedSettings.subclipTypeInfo': 'Single-bitrate and multi-bitrate MP4s are frame accurate rendered assets. Dynamic manifest filters are group-of-pictures (GOP) accurate filters applied to a parent asset. Creating filters does not create a new asset and does not require encoding. Subclipping jobs on live assets are valid as long as their mark times are within the archive window of the parent asset. Filters are valid as long as the parent asset exists and mark times are within its archive window.',
        'AdvancedSettings.frameRateInfo': 'We autodetect frame rate under most scenarios. however, If we cannot autodetect, choose a frame rate from the dropdown for the selected asset(s).',
        'AdvancedSettings.frameRateError': 'Unable to determine frame rate',
        'AdvancedSettings.subclipNameInfo': 'Choose a name for your subclip.',
        'AdvancedSettings.singleAudioTrack': '1 audio track selected',
        'AdvancedSettings.allAudioTracks': 'All audio tracks selected',
        'AdvancedSettings.someAudioTracks': '{0} audio tracks selected',
        'AdvancedSettings.includeAllAudioTracks': 'Include all audio tracks',
        'AssetsPanel.loadingError': 'Failed to retrieve assets from server.',
        'AssetsPanel.retry': 'Retry?',
        'CommandBar.prevFrameTitle': 'Move one frame backwards',
        'CommandBar.prevKeyFrameTitle': 'Move one GOP backwards',
        'CommandBar.cleanJob': 'Remove all assets',
        'CommandBar.cleanJobTitle': 'Remove all assets from timeline',
        'CommandBar.cleanJobMessage': 'This will empty all video clips from your timeline.',
        'CommandBar.update': 'Update filter',
        'CommandBar.createFilter': 'Create filter',
        'CommandBar.submit': 'Submit subclipper job',
        'CommandBar.jobErrorTitle': 'Operation failed',
        'CommandBar.jobErrorMessage': 'Your subclip failed to submit. Please try again.',
        'CommandBar.markInTitle': 'Set in at playhead',
        'CommandBar.markInPosition': 'Mark in timecode',
        'CommandBar.markOutTitle': 'Set out at playhead',
        'CommandBar.markOutPosition': 'Mark out timecode',
        'CommandBar.nextFrameTitle': 'Move one frame forward',
        'CommandBar.nextKeyFrameTitle': 'Move one GOP forward',
        'CommandBar.play': 'Play video',
        'CommandBar.pause': 'Pause video',
        'CommandBar.playPreviewTitle': 'Play subclip preview',
        'CommandBar.pausePreviewTitle': 'Pause subclip preview',
        'CommandBar.redoTitle': 'Redo last action',
        'CommandBar.removeAsset': 'Remove current asset',
        'CommandBar.undoTitle': 'Undo last action',
        'VideoPlayer.errorTitle': 'Error',
        'VideoPlayer.errorMessage': 'There was an error loading the selected asset.',
        'Timeline.markIn': 'Mark in bracket',
        'Timeline.markOut': 'Mark out bracket',
        'Timeline.playHead': 'Play head'
    }
}
```

## Next steps
See the next steps for configuring Azure Media Clipper:
- [Loading assets into Azure Media Clipper](media-services-azure-media-clipper-load-assets.md)
- [Configuring custom keyboard shortcuts](media-services-azure-media-clipper-keyboard-shortcuts.md)
- [Submitting clipping jobs from the Clipper](media-services-azure-media-clipper-submit-job.md)
