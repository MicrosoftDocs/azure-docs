---
title: Azure Media Player Changelog
description: Azure Media Player changelog.
author: IngridAtMicrosoft
ms.author: inhenkel
ms.service: media-services
ms.topic: overview
ms.date: 04/20/2020
---
# Changelog #

## 2.2.4 (Official Update February 22 2019) ##

### Bug Fixes 2.2.4 ###

- [Bug Fix][AMP][Accessibility] Removed a reachable phantom tab when the error screen appears
- [Bug Fix][AMP] Fixed the hotkey 'M' for IE11 and Edge
- [Bug Fix][AMP] Fixed an exception for CEA708 captions
- [Bug Fix][AMP] Fixed a video freeze issue for the Edge browser

### Changes 2.2.4 ###

- [Change][AMP] When a fragment decryption error happens, the player retries current and various fragments to recover the playback
- [Change][AMP] Made AMP more tolerant of overlapping video or audio fragments

## 2.2.3 (Official Update January 9 2019) ##

### Features ###

- [Feature][HLS] Added the audio track menu for Safari HLS playback

### Bug Fixes 2.2.3 ###

- [Bug Fix][AMP][Accessibility] During live broadcast playbacks, the "live" button cannot be selected by using the keyboard
- [Bug Fix][AMP] Fixed false positives 0x0400003 errors due to failed MSE test
- [Bug Fix][AMP] Fixed an issue where the video could freeze when starting a live stream

### Changes 2.2.3 ###

- [Change][AMP] Added more information in the log to enable better diagnostics
- [Change][AMP] When more than one bitrate is available at the same screen resolution, all the bitrates are available for selection

## 2.2.2 (Official Update) ##

### Bug Fixes 2.2.2 ###

- [Bug Fix][AMP] When the player encounters a transient network outage, it stops playback immediately
- [Bug Fix][AMP][Accessibility] The error dialog is not accessible by keyboard
- [Bug Fix][AMP] Infinite spinner displayed when playing audio only asset instead of unsupported error

### Changes 2.2.2 ###

- [Change][AMP] added localized strings for advertisement UI

## 2.2.1 (Official Update) ##

### Features 2.2.1 ###

- [Feature][CMAF] Added support for HLS CMAF

### Bug Fixes ###

- [Bug Fix][AMP] uncleared timers in retry logic yielding playback errors
- [Bug Fix][AMP][Firefox] ended event is not fired on Firefox and Chrome when stopped the live program
- [Bug Fix][AMP] Controls displayed after setsource, even when controls are set to false in player options

### Changes ###

- [Change][Live captioning] Changed API name for CEA captions from 608 to 708. For more information, see [CEA708 Captions Settings](https://docs.microsoft.com/javascript/api/azuremediaplayer/amp.player.cea708captionssettings)-->

## 2.2.0 (Official Release) ##

### Features 2.2.0 ###

- [Feature][Azurehtml5JS][Flash][LiveCaptions]CEA 708 captioning support in Azurehtml5JS and FlashSS tech for clear and AES content.

### Bug Fixes 2.2.0 ###

- [Bug Fix]Flash version detection not working in Chrome/Edge

### Changes 2.2.0 ###

- [Change][AMP][Heuristics]Changed heuristic profile name from QuickStartive to LowLatency
- [Change][Flash]Change in Flash player for version detection to enable playback of AES content with the new Adobe Flash update.

## 2.1.9 (Official Hotfix) ##

### Bug Fixes 2.1.9 ###

- [Bug Fix][Live] Exception occurring when live streams transition to video on demand/live archives

### Changes 2.1.9 ###

- [Change][Flash][AES] Modified Flash tech logic to not use sharedbytearrays for AES decryption as Adobe has blocked the usage as of Flash 30. Please note, playback will only work once Adobe deploys a new version of Flash due to a bug in v30. Please see [known issues](azure-media-player-known-issues.md) for more details

## 2.1.8 (Official Update) ##

### Bug Fixes 2.1.8 ###

- [Bug fix] Spinner occasionally doesn't show post seek and pre- play
- [Bug Fix] Player doesn't start muted when muted option enabled
- [Bug Fix] Volume slider is displayed when controls are set to false
- [Bug Fix] Playback occasionally repeating when user skips to the live edge
- [Bug Fix][Firefox] Player occasionally throws JavaScript exception on load
- [Bug Fix][Accessibility]Play/ Pause/Volume button lose focus outline when selected using keyboard controls
- [Bug Fix] Fixed memory leakage on player is disposed
- [Bug Fix] Calling src() after player errors out doesn't reset the source
- [Bug Fix][Live] AMP is in constant loading state when user clicks on the Live button after broadcast has ended
- [Bug Fix][Chrome] Player hangs and playback fails when browser minimized to background.

### Changes 2.1.8 ###

- [Change]Updated 0x0600001 errror to display when AES content is played back with Flash 30 as it's not supported at this time. Please see [known issues](azure-media-player-known-issues.md) for more details
- [Change] Added additional retries for live scenarios when manifest requests 404 or returns empty manifests.

## 2.1.7 (Official Update) ##

### Features 2.1.7 ###

- [Feature][AzureHtml5JS] Added configuration option to flush stale data in the media source buffer

### Bug Fixes 2.1.7 ###

- [Bug Fix][Accessibility][Screen Reader] Removed the blank header the player included when title is not set
- [Bug Fix][UWA] AMP throws exception when playback in Universal Windows App
- [Bug Fix][OSX] setActiveTextTrack() not working in Safari on OSx
- [Bug Fix][Live] Clicking to the live edge after disposing and re initializing player yields exception
- [Bug Fix][Skin] Current time truncated for certain assets
- [Bug Fix][DRM] fix included to support playback in browsers that support multiple CENC DRM

### Changes 2.1.7 ###

- [Change][Samples][Accessibility]Added language tag to all samples

## 2.1.6 (Official Update) ##

### Bug Fixes 2.1.6 ###

- [Bug Fix]AMP displaying incorrect duration for specific asset
- [Bug Fix][FairPlay-HLS] Fairplay errors not propagating to UI
- [Bug Fix]Custom Heuristic properties being ignored in AMP 2.1.5.

### Changes 2.1.6 ###

- [Change][FairPlayDRM] Removed the timeout for both Cert request and license request for FairPlay in order to keep parity with PlayReady and Widevine implementations
- [Change] Misc Heuristic improvements to combat blurry content

### Features 2.1.6 ###

- [Feature] Added support mpd-time-cmaf format

## 2.1.5 (Official Hotfix) ##

### Bug Fixes 2.1.5 ###

- [Bug Fix][Captions] VTT styling not rendered correctly by player
- [Bug Fix][Accessibility]Live button has no aria label

## 2.1.4 (Official Update) ##

### Bug Fixes 2.1.4 ###

- [Bug Fix][Accessibility][Focus]Users cannot tab to focus on custom buttons added to the right of the full screen button in the control bar
- [Bug Fix][IE11][Volume bar]Tabbing to volume pop-up makes the entire video screen flash in IE11 while in full-screen mode
- [Bug Fix][Skin|Flush] Space displayed between control bar and volume bar pop-up
- [Bug Fix][AMP][Captions]Old embedded tracks are not cleared when source  is changed on an existing player
- [Bug Fix][Accessibility][Narrator]Screen Reader reads volume control incorrectly
- [Bug Fix][FlashSS]Play Event occasionally doesn't fire from Flash tech
- [Bug Fix][AMP][Focus] Play/pause requires two clicks when player has focus and is in full screen mode
- [Bug Fix][AMP][Skin]Incorrect duration being displayed on progress bar for a specific asset
- [Bug Fix][Ads][Ad Butler] VAST parser doesn't handle VAST file that does not have progress event
- [Bug Fix][SDN][AMP 2.1.1] Fixed issue for Hive SDN plugin support
- [Bug Fix][Accessibility]Narrator reads "Midnight Mute Button" when user has focus of volume button

### Changes 2.1.4 ###

- [Change][Accessibility][Assistive Technology] Buttons now have aria-live property to improve experience with assistive technology
- [Change][Accessibility][Volume button|Narrator]Improved accessibility of volume button by modifying the tabbing functionality and the slider behavior. These changes make it easier for keyboard users to modify the player's volume
- [Change]Increased inactivity context menu timeout from 3 to 5 seconds
- [Change][Accessibility][Luminosity] Improved luminosity contrast ratio on dropdown menus in captions settings

## 2.1.3 (Official Update) ##

### Bug Fixes 2.1.3 ###

- [Bug Fix][Plugins|Title Overlay] Title Overlay plugin throws JS exceptions with AMP v2.X+
- [Bug Fix]Source Set event is sent to JavaScript console even when logging is turned off
- [Bug Fix][Skin] Player time tips are rendered outside context of the player when hovering over either end duration bar
- [Bug Fix][Accessibility][Screen Reader] Narrator reads "Region Landmark" or "Video Player Region Landmark" when viewer has focus on player
- [Bug Fix][AMP] Cannot disable player outline via CSS
- [Bug Fix][Accessibility]Cannot tab to focus on entire player when user is in full-screen mode
- [Bug Fix][Skin][Live]Skin not responsive to localized LIVE text in Japanese
- [Bug Fix][Skin]Duration and current time get cut off when stream > 60 min
 -[Bug Fix][iPhone|Live]player shows text for current time/duration in control bar
- [Bug Fix][AMP] Calling player heuristics APIs yields JavaScript exceptions
- [Bug Fix][Native Html5|iOS] Videotag property "playsinline" not propagating to player
- [Bug Fix][iOS|iframe]Player cannot enter fullscreen on iPhone if player is loaded in an iframe
- [Bug Fix][AMP][Heuristics]AMP always operates with hybrid profile regardless of player options
- [Bug Fix][AMP|Win8.1]throws when hosted in Win8.1 app with a webview

### Changes 2.1.3 ###

- [Change][AMP] Added CDN endpoint information in FragmentDownloadComplete event
- [Change][AMP][Live] Improved and optimized live streaming latency

## 2.1.2 (Official Hotfix) ##

### Bug Fixes 2.1.2 ####

- [Bug Fix][Accessibility][Windows Narrator]Narrator reads "Progress midnight" when user has context of progress bar and current time is 0:00
- [Bug Fix][Skin]logo size is hard-coded in JavaScript code
- [Accessibility][HotKeys] Hotkeys not enabled when player is clicked.

### Changes 2.1.2 ####

- [Change][Logging]Log manifest URL when player fails to load manifest

### Features 2.1.2 ###

- [Change][Performance][Optimization] Improved player load and start-up times

## 2.1.1 (Official Update) ##

### Bug Fixes 2.1.1 ####

- [Bug Fix][iOS]Setting Autoplay to false yields infinite spinner in Safari for iOS
- [Bug Fix] Seeking to a time greater than content duration yields infinite spinner
- [Bug Fix] Hotkeys require multiple keyboard tabs to get context of the player to work
- [Bug Fix] Video freezes for a few seconds after resizing the player in certain assets
- [Bug Fix] Infinite spinner(after seek completes) when user does multiple seeks quickly
- [Bug Fix] Control bar is not hidden during inactivity
- [Bug Fix] Opening a webapp that hosts AMP can cause the webpage to be loaded twice
- [Bug Fix] Infinite while playing content certain assets via Flash Tech
- [Bug Fix] More Options menu not being displayed with 3rd party plugins
- [Bug Fix][Skin|Tube][Live] Two live icons are displayed when player is at the live edge of a program
- [Bug Fix][Skin]Logo cannot be disabled
- [Bug Fix][DD+ Content] Continuous spinner shows up for the assets containing Dolby Digital audio track
- [Bug Fix] Latest AMP freezes when switching audio language tracks during livestream
- [Bug Fix] fixed background disappearance for spinner
- [Bug Fix]Infinite spinner in AES flash token static samples bug fixes

### Changes 2.1.1 ####

- [Change] Added Error Code for Widevine Https requirement: as of Chrome v58, widevine content must be loaded/played back via the `https://` protocol otherwise playback will fail.
- [Change] Added aria label for loading spinner so assistive technology can narrate "video loading" when content is loading  

## 2.1.0 (Official Release) ##

### Features 2.1.0 ###

- [Feature][AzureHtml5JS]VOD Ad Support for pre- mid- post-rolls
- [Feature][Beta][AzureHtml5JS] Live Ad support for pre- mid- post-rolls
- [Feature] Added new skin option  - AMP-flush
- [Feature] Added improved aria labels for better integration with screen readers/assistive technology
- [Feature][Skin] Skin now shows all icons and buttons clearly in high contrast mode

### Bug Fixes 2.1.0 ###

- [Bug Fix] Number of accessibility and UI fixes
- [Bug Fix] AMP not loading correctly in IE9

### Changes 2.1.0 ###

- [Change] Restructured DOM elements in player to accommodate ads work
- [Change] Switched from CSS to SCSS for skin development
- [Change][Samples]Added sample for VOD ads
- [Change][Samples]Added sample for playback speed
- [Change][Samples]Added sample for Flush Skin

## 2.0.0 (Beta Release) ##

- [Change]updated to VJS5
- [feature] Added new fluid API for player responsiveness fluid
- [Feature] Playback speed
- [Change] Switched from CSS to SCSS for skin

## 1.8.3 (Official Hotfix Update) ##

### Bug Fixes 1.8.3 ###

- [Bug Fix][AzureHtml5JS] Certain assets with negative DTS won't playback in Chrome

## 1.8.2 (Official Hotfix Update) ##

### Bug Fixes 1.8.2 ###

- [Bug Fix][AzureHtml5JS] Higher audio bitrates won't play back via AzureHtml5JS

## 1.8.1 (Official Update) ##

### Bug Fixes 1.8.1 ###

- [Bug Fix][iOS] Captions/subtitles not showing up in native player
- [Bug Fix][AMP] CDN-backed streaming URLs appended with authentication tokens not playing
- [Bug Fix][FairPlay] FairPlay Error code missing Tech ID (Bits [31-28] of the ErrorCode) see Error Codes for more details
- [Bug Fix][Safari][PlayReady] PlayReady content in Safari yielding infinite spinner

### Changes 1.8.1 ###

- [Change][Html5]Change native Html5 tech verbose logs to contain events from VideoTag

## 1.8.0 (Official Update) ##

### Features 1.8.0 ###

- [Features][DRM] Added FairPlay Support (see [Protected Content](azure-media-player-protected-content.md) for more info)

### Bug Fixes 1.8.0 ###

- [Bug Fix][AMP] User seek doesn't trigger a wait event when network is throttled
- [Bug Fix][FlashSS] Selecting quality in flash tech throws exception
- [Bug Fix][AMP] Dynamically selecting quality does show in context menu
- [Bug Fix][Skin] It's difficult to select the last menu item of context menus

### Changes 1.8.0 ###

- [Change] Updated player to current Chrome EME requirements
- [Change] Default techOrder changed to accommodate new tech- html5FairPlayHLS (see [Protected Content](azure-media-player-protected-content.md) for more info)
- [Change][AzureHtml5JS] Enabled MPEG-Dash playback in Safari
- [Change][Samples] Changed Multi-DRM samples to accommodate FairPlay

## 1.7.4 (Official Hotfix Update) ##

### Bug Fixes 1.7.4 ###

- [Bug Fix][Chrome] Blue outline appears around seek handle when user has context of player
- [Bug Fix][IE9] JavaScript exception thrown when player loaded in IE9

## 1.7.3 (Official Hotfix Update) ##

### Bug Fixes 1.7.3 ###

- [Bug Fix][AzureHtml5JS] Player timing out in constrained networks

### Changes 1.7.3 ###

- [Change] Enabling Webcrypto on Edge for decrypting AES content
- [Change] Optimizing AMP heuristics to account for cached chunks
- [Change][AzureHtml5JS] Optimize heuristic by reduce bandwidth estimation latency

## 1.7.2 (Official Hotfix Update) ##

### Features 1.7.2 ###
<!---API needs onboarding. Removed link to API until remedied.--->
- [Feature][AzureHtml5JS|Firefox] Enable Widevine playback with EME for Firefox 47+
- [Feature] Add event for player disposing
<!-- ([disposing](index.html#static-amp.eventname.disposing)) -->

### Bug Fixes 1.7.2 ###

- [Bug Fix] Encoded Akamai CDN URL query parameters not correctly decoded
- [Bug Fix] Exception being thrown on manifestPlayableWindowLength()
- [Bug Fix] Viewer cannot always click play on the video after the video has ended to rewatch
- [Bug Fix] Responsive sizing not conforming to rapid window size changes
- [Bug Fix][Edge|IE] Responsive sizing not taking into effect on page load for width=x, height=auto
- [Bug Fix][Android|Chrome] Chrome asking permissions to playback DRM content when content is not encrypted
- [Bug Fix][Accessibility][Edge] Keyboard controls do not correctly select context menu items
- [Bug Fix][Accessibility] Missing displayed border in high contrast mode
- [Bug Fix][FlashSS] Mouse up event listener not removed after player dispose causes exception
- [Bug Fix][FlashSS] Issue parsing manifest URL with encoded spaces
- [Bug Fix][iOS] Type error when evaluating tech.featuresVolumeControl

### Changes 1.7.2 ###

- [Change][DRM] Moved DRM checks after set source to only check when content is encrypted
- [Change][AES] Removed undefined body of type/plain from Key delivery request
- [Change][Accessibility] Windows narrator now reads "Media Player" when context is on player instead of properties

## 1.7.1 (Official Hotfix Update) ##

### Features 1.7.1 ###

- [Feature] Added option for Hybrid Heuristic profile (this profile is set by default)

### Bug Fixes 1.7.1 ###

- [Bug Fix] Responsive design doesn't work as per HTML5 standard (width=100%, height=auto)
- [Bug Fix] Percentage values for width and height not behaving as expected in v1.7.0

## 1.7.0 (Official Update) ##

### Features 1.7.0 ###
<!---API needs onboarding. Removed link until remedied.--->
- [Feature][AzureHtml5JS][FlashSS] Added currentMediaTime() to get the encoder media time of the current time in seconds
- [Feature][FlashSS] Implemented download telemetry APIs with videoBufferData() and audioBufferData()<!-- (see [BufferData](index.html#amp.bufferdata) for more details) -->
- [Feature][FlashSS] Added 'downloadbitratechanged' event
- [Feature] Loading time improved compared to older versions of player
- [Feature] Errors are logged to JavaScript console

### Bug Fixes 1.7.0 ###

- [Bug Fix] Encoded poster URL with query string parameters not displaying in player
- [Bug Fix] Exception thrown when no tech loaded and API amp.Player.poster() is called
- [Bug Fix] Exception thrown when functions try to access player after disposed
- [Bug Fix][Accessibility] Missing outline on focus on  progress bar seek head
- [Bug Fix][Accessibility] Context menus have a shadow in high contrast mode
- [Bug Fix][iOS] native player WebVTT captions playback not working
- [Bug Fix][AzureHtml5JS] Error 0x0100002 should be shown when playing HTTP stream on HTTPS site that instead yields infinite spinner as a result of mixed content
- [Bug Fix][AzureHtml5JS] Missing end segment causing looping health check error displaying a perceived infinite buffering state
- [Bug Fix][AzureHtml5JS] Incorrect audio track name in menu when useManifestForLabel=false and three letter language codes are used
- [Bug Fix][AzureHtml5JS|Chrome] Perceived infinite buffer state at the end of content caused by floating point imprecision in duration with JavaScript in Chrome
- [Bug Fix][FlashSS] Non-fatal intermittent error momentarily displayed when flash player created
- [Bug Fix][FlashSS] Playback failing when video and audio streams use different timescales due to rounding imprecision failing with "Fragment url (...) is failed to generate FLVTags"
- [Bug Fix][FlashSS] Issues parsing manifest urls with encoded spaces
- [Bug Fix][FlashSS] Missing check to determine if Flash player version >= 11.4 that causes an error in playback instead of falling back to the next tech in the techOrder
- [Bug Fix][FlashSS][AES] Issues accepting AES tokens with underscores in it
- [Bug Fix][SilverlightSS|OSX] "//" prefixing a manifest instead of the protocol (HTTP or HTTPS) is recognized as a local file yielding infinite spinner

### Changes 1.7.0 ###

- [Change][FlashSS] Merged SWF Scripts ("MSAdaptiveStreamingPlugin-osmf2.0.swf" and "StrobeMediaPlayback.2.0.swf") into a single SWF called "StrobeMediaPlayback.2.0.swf"
- [Change][FlashSS] Updated error code propagation to get more precise error codes (ex. 404s now result in 0x30200194 instead of generic error 0x30200000)

## 1.6.3 (Official Hotfix Update) ##

### Bug Fixes 1.6.3 ###

- [Bug Fix] JavaScript runtime exception when the hotkeys event handler is executed after the disposing of the player
- [Bug Fix][Android][AzureHtml5JS] No playback on mobile device using cellular network
- [Bug Fix] Updated Forge to run as web worker to free up UI

## 1.6.2 (Official Hotfix Update) ##

### Features 1.6.2 ###

- [Feature] Added additional languages for localization (see documentation for more details)

### Bug Fixes 1.6.2 ###

- [Bug Fix][IE9-10] Clicking on areas around the player minimized browser window due to IE9/IE10 bug that minimizes on window.blur()
- [Bug Fix][FlashSS] Not accepting AES tokens with underscores

## 1.6.1 (Official Hotfix Update) ##

### Bug Fixes 1.6.1 ###

- [Bug Fix][FlashSS|Edge,IE][SilverlightSS|IE] Can't get focus on other UI elements for inputs or other in IE/Edge
- [Bug Fix] AES playback failing when forge undefined
- [Bug Fix][Android][AzureHtml5JS|Chrome] Continuous spinner not playing back content when in health check loop
- [Bug Fix][IE9] console.log() not supported by IE 9 causing exception

## 1.6.0 (Official Update) ##

### Features 1.6.0 ###

- [Feature] 33% size reduction of azuremediaplayer.min.js
- [Feature][AzureHtml5JS|Edge][Untested] Support for DD+ audio streams in Edge (no codec switching after initial choice). App must select correct audio stream at this time.
- [Feature] Hot key controls (see docs for more details)
- [Feature] Progress time tip hover for time accurate seeking
- [Feature] Allow for async detection of plugins if setupDone method exists in plugin

### Bug Fixes 1.6.0 ###

- [Bug Fix] Memory log not flushing on getMemoryLog(true)
- [Bug Fix] Bitrate selection box resets on mouse move causing issue selecting lower bitrates through mouse control
- [Bug Fix] Mac Office in app crashes when performing DRM check
- [Bug Fix] CSS classes are easily accidentally overwritten
- [Bug Fix][Chrome] Update identification from user-agent string browser is Edge
- [Bug Fix][AzureHtml5JS] Captions button not showing up in tool bar in Edge(Win10) or Chrome(Mac)
- [Bug Fix][Android][AzureHtml5JS|Chrome] InvalidStateError exception on endOfStream() call on short videos
- [Bug Fix][Firefox] Removal of DRM warning caused by Firefox when checking browser capabilities
- [Bug Fix][Html5] Subtitle/Captions not shown with progressive mp4 content
- [Bug Fix][FlashSS] Messages with matching timestamps were logged in reverse order
- [Bug Fix][Accessibility][Chrome|Firefox] Tab and select controls automatically select first menu item
- [Bug Fix][Accessibility] Tab to control volume button

### Changes 1.6.0 ###

- [Change] Use AES decryption time on quality level selection
- [Change] Update URL rewriter to use HLS v4 before HLS v3 for multi-audio streams
- [Change] Set nativeControlsForTouch to false as default (must be false to work correctly)

## 1.5.0 (Official Update) ##

### Features 1.5.0 ###

- [Feature] Enhancements for general web security (prevention of injection, XSS, etc.)
- [Feature] SDN plugin integration hooks for sourceset event and options.sdn
- [Feature] Robustness handling of 5XX and 4XX errors during playback

### Bug Fixes 1.5.0 ###

- [Bug Fix] Update CSS minification to use HTML entity font codes for buttons instead of Unicode
- [Bug Fix] [AzureHtml5JS] Multi-DRM content always selecting the first element's token from protectionInfo causing second DRM to fail
- [Bug Fix] [AzureHtml5JS] Seeking never completes when seeking in an area with missing segments.
- [Bug Fix] [AzureHtml5JS|Edge] Enable prefixed EME in Edge update for PlayReady playback
- [Bug Fix] [AzureHtml5JS|Firefox] Update EME check to allow Firefox v42+ (with MSE) to fallback to Silverlight for protected content
- [Bug Fix] [FlashSS] Update error.message from number to detailed string

### Changes 1.5.0 ###

- [Change] Posters currently only work as absolute URLs.

## 1.4.0 (Official Update) ##

### Features 1.4.0 ###

- [Feature] [AzureHtml5JS|Chrome] Simple Widevine DRM support
- [Feature] [AzureHtml5JS] Robustness handling of 404/412 errors during playback

### Bug Fixes 1.4.0 ###

- [Bug Fix] [FlashSS] Enhancement for parameter validation

## 1.3.0 (Official Update) ##

### Features 1.3.0 ###

- [Feature] [AzureHtml5JS] [FlashSS] Audio switching of the same codec Multi-Audio content

### Bug Fixes 1.3.0 ###

- [Bug Fix] [AzureHtml5JS|Chrome] Intermittent infinite spinner
- [Bug Fix] [AzureHtml5JS|IE][Windows Phone] Exception causing Windows Phone to have playback issues
- [Bug Fix] [FlashSS] Autoplay set to false fails for additional instances
- [Bug Fix] UI menu sizing issues

## 1.2.0 (Official Update) ##

### Features 1.2.0 ###

- [Feature] [AzureHtml5JS|Firefox] Support when MSE is enabled
- [Feature] No longer require app to provide paths for fallback tech binaries (swf, xap). Path is relative to the Azure Media Player script.

### Bug Fixes 1.2.0 ###

- [Bug Fix] [AzureHtml5JS|Chrome] Player drifts behind live edge when player in the background
- [Bug Fix] [AzureHtml5JS|Edge] Full screen not working
- [Bug Fix] [AzureHtml5JS] Logging wasn't enabled properly when set in options
- [Bug Fix] [Flash] Both "buffering" and buffering icon show during waiting event
- [Bug Fix] Allow playback to continue if initial bandwidth request fails
- [Bug Fix] Player fails to load when initialized with undefined options
- [Bug Fix] When attempting to dispose the player after it is already disposed, a vdata exception occurs
- [Bug Fix] Quality bar icons mapped incorrectly

## 1.1.1 (Official Hotfix Update) ##

### Bug Fixes 1.1.1 ###

- [Bug Fix] Older IE full screen issue
- [Bug Fix] Plugins no longer overwritten

## 1.1.0 (Official Update) ##

### Features 1.1.0 ###

- [Feature] Update UI Localization strings

### Bug Fixes 1.1.0 ###

- [Bug Fix] Big Play Button does not have enough contrast
- [Bug Fix] Visual tab focus indicator
- [Bug Fix] Select Bitrate menu now using correct resolution information
- [Bug Fix] More options menu now dynamically sized
- [Bug Fix] Various UI issues

## 1.0.0 (Official Release) ##

### Features 1.0.0 ###

- [Feature] Basic accessibility testing for tab control, focus control, screen reader, high contrast UI
- [Feature] Updated UI
- [Feature] Dev logging
- [Feature] API for dynamically setting captions/subtitles tracks
- [Feature] Basic localization features
- [Feature] Error code consolidation across techs
- [Feature] New error code for when plugins (like Flash or Silverlight) aren't installed
- [Feature] [AzureHtml5JS] Implemented basic diagnostic events

### Bug Fixes 1.0.0 ###
<!---What is that actually supposed to say?--->
- [Bug Fix] [AzureHtml5JS] Live playback freezing on MPD updates when there are small imprecisions in the timestamp
- [Bug Fix] [AzureHtml5JS] Mitigated several Live playback issues
- [Bug Fix] [AzureHtml5JS] Flush buffers when window size heuristics is on and go to a higher resolution screen
- [Bug Fix] [AzureHtml5JS] Chrome now properly shows ended event. Linked to previous known issue of *Chrome will not properly send ended event when using AzureHtml5JS. There is an issue in the underlying browser.*
- [Bug Fix] [AzureHtml5JS] Disabled Safari for this tech in order to address *Playback issue with OSX Yosemite with AzureHtml5JS tech. There are MSE implementation issues. Temporary Mitigation: force flashSS, silverlightSS as tech order for these user agents*
- [Bug Fix] [FlashSS] loadstart fired after error occurred

## 0.2.0 (Beta) ##

### Features 0.2.0 ###

- [Feature] Completed testing for PlayReady and AES for on demand and live - see compatibility matrix
- [Feature] Handling Discontinuities
- [Feature] Support for timestamps greater than 2^53
- [Feature] URL query parameter persists to the manifest request
- [Feature] [Untested] Support for `QuickStart` and `HighQuality` heuristics profiles
- [Feature] [Untested] Exposing video stream information for bitrates, width and height on AzureHtml5JS and FlashSS
- [Feature] [Untested] Select Bitrate on AzureHtml5JS and FlashSS (see API documentation)

### Bug Fixes 0.2.0 ###

- [Bug Fix] large play button now viewable on WP8.1
- [Bug Fix] fixed multiple live playback issues
- [Bug Fix] unmute button now works on the UI
- [Bug Fix] updated UI loading experience for autoplay mode
- [Bug Fix] AMD loader issue and define method conflicts
- [Bug Fix] WP 8.1 Cordova App loading issue
- [Bug Fix] Protected content queries platform/tech supported ProtectionType to select the appropriate tech for playback.  Fixes previous known issue of '_PlayReady content on Chrome (desktop) / Safari 8 (on OSX Yosemite) currently does not fallback to Silverlight player_'
- [Bug Fix] uncaught exception on WinServer 2012 R2 due to Media Foundation not installed on that machine by default.  Attempt to use HTML video tag APIs, that are not implemented, thus throwing an error. Current mitigation is to catch that error and return false instead of throwing the error.
- [Bug Fix] always get the init segment after seek or http failure to prevent glitches during playback
- [Bug Fix] turn off tracking simulated progress and timeupdates when Error has occurred.
- [Bug Fix] remove right click menu
- [Bug Fix] [AzureHtml5JS] error message not being displayed when invalid token set for PlayReady content
- [Bug Fix] [AzureHtml5JS] going fullscreen during live playback wasn't taking window size heuristics into account
- [Bug Fix] [FlashSS] Removed Strobe Media Player displayed messages so that only Azure Media Player messages are shown
- [Bug Fix] [SilverlightSS] not getting 'seeked' event when we seek beyond duration or less than 0

## 0.1.0 (Beta Release) ##

Initial Pre-Release

## Next steps ##

- [Azure Media Player Quickstart](azure-media-player-quickstart.md)
