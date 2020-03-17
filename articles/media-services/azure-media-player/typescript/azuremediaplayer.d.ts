/**
 * API of Azure Media Player ([[amp]]), use azuremediaplayer.d.ts if caller is using [TypeScript](http://www.typescriptlang.org/).
 */
declare module amp {

    /**
     * The Player instance for [[amp]], for the caller to interact with.
     */
    interface Player {

        /**
         * Starts media playback.
         *
         *     myPlayer.play();
         *
         * @return The [[amp.Player]] calling this function.
         */
        play(): Player;

        /**
         * Pauses the video playback.
         *
         *     myPlayer.pause();
         *
         * @return The [[amp.Player]] calling this function.
         */
        pause(): Player;

        /**
         * Get whether or not the player is in the "paused" state.
         *
         *     var isPaused = myPlayer.paused();
         *
         * @return True if the player is in the paused state, false if not.
         */
        paused(): boolean;

        /**
         * Get whether or not the player is in the "seeking" state.
         * @return True if the player is in the seeking state, false if not.
         */
        seeking(): boolean;

        /**
         * Get whether or not the player is in the "ended" state.
         * @return True if the player is in the ended state, false if not.
         */
        ended(): boolean;

        /**
         * Gets/Sets the player level options to add new options or override the given options if
         * has already been set.
         *
         * @param  options Object of new option values
         * @return **New** object of this.options_ and options merged
         */
        options(options: Player.Options): Player.Options;
        options(): Player.Options;

        /**
         * Sets a single source to play.
         * Use this method if you know the type of the source and only have one source.
         *
         * myPlayer.src({ type: "video/mp4", src: "http://www.example.com/path/to/video.mp4" },
         * ~~~
         * ~~~
         * [{ kind: "captions" src: "http://example.com/path/to/track.vtt" srclang: "fr" label: "French"}]);
         * ~~~
         * ~~~
         *
         * @param  newSource Source object
         * @parm   optional parameter, array of the text tracks to used with the given source.
         * @return The [[amp.Player]] calling this function.
         */
        src(newSource: Player.Source, tracks?: Player.Track[]): Player;

        /**
         * Sets multiple versions of the source to play so
         * that it can be played using techs across browsers.
         *
         * ~~~
         * myPlayer.src([
         * ~~~
         * ~~~
         * { type: "application/dash+xml", src: "http://www.example.com/path/to/video.ism(format=mpd-csf-time)" },
         * ~~~
         * ~~~
         * { type: "application/dash+xml", src: "http://www.example.com/path/to/video.ism(format=mpd-time-csf)", protectionInfo: [{type: "AES", authenticationToken:"token"}] },
         * ~~~
         * ~~~
         * { type: "application/dash+xml", src: "http://www.example.com/path/to/video.ism(format=mpd-time-csf)", disableUrlRewriter: true },
         * ~~~
         * ~~~
         * { type: "application/dash+xml", src: "http://www.example.com/path/to/video.ism(format=mpd-time-csf)", streamingFormats: ["SMOOTH", "DASH"] },
         * ~~~
         * ~~~
         * { type: "video/ogg", src: "http://www.example.com/path/to/video.ogv" }],
         * ~~~
         * ~~~
         * [{ kind: "captions" src: "http://example.com/path/to/track.vtt" srclang: "fr" label: "French"}]
         * ~~~
         * ~~
         * );
         * ~~~
         * @param  newSources Array of sources
         * @parm   optional parameter, array of the text tracks to used with the given source.
         * @return The [[amp.Player]] calling this function.
         */
        src(newSources: Player.Source[], textTracks?: Player.Track[]): Player;

        /**
         * Get the fully qualified URL of the current source value e.g. http://mysite.com/video.mp4.
         * Can be used in conjuction with [[amp.Player.currentType]] to assist in rebuilding the current source object.
         * @return Current source.
         */
        currentSrc(): string;

        /**
         * Get the current source type e.g. video/mp4.
         * This can allow you rebuild the current source object so that you could load the same
         * source and tech later.
         * @return MIME type of the current source.
         */
        currentType(): string;

        /**
         * Get the protectionInfo for the current source.
         * @return Protection information of the current source.
         */
        currentProtectionInfo(): Player.ProtectionInfo;

        /**
         * Get whether or not the presentation is live.
         * @return true if the presentation is live, false if not.
         */
        isLive(): boolean;

        /**
         * Set/Get the current HeuristicProfile
         */
        currentHeuristicProfile(value: string): Player;
        currentHeuristicProfile(): string;

        /**
         * Get the current Player settings for the given key
         */
        currentPlayerSettingValue(key: string): any;

        /**
         * Get the current name of the chosen tech.
         * @return Name of tech(in Pascal case).
         */
        currentTechName(): string;

        /**
         * Gets the current video streams list.
         * @return [[amp.VideoStreamList]], undefined if not available
         */
        currentVideoStreamList(): VideoStreamList;

        /**
         * Gets the current audio streams list.
         * @return [[amp.AudioStreamList]], undefined if not available
         */
        currentAudioStreamList(): AudioStreamList;

        /**
         * Gets the video buffer information
         * @return [[amp.BufferData]], undefined if not available
         */
        videoBufferData(): BufferData;

        /**
         * Gets the audio buffer information
         * @return [[amp.BufferData]], undefined if not available
         */
        audioBufferData(): BufferData;

        /**
         * Set/Get the poster image source url.
         *
         * ##### Example of setting:
         *     myPlayer.poster('http://example.com/myImage.jpg');
         *
         * ##### Example of getting:
         *     var currentPoster = myPlayer.poster();
         *
         * @param  src Poster image source URL when setting.
         * @return The [[amp.Player]] calling this function when setting, posterURL when getting.
         */
        poster(src: string): Player
        poster(): string;

        /**
         * Set/Get whether or not the controls are showing.
         *
         * @param  value Set controls to showing or not.
         * @return The [[amp.Player]] calling this function when setting, true/false when getting.
         */
        controls(value: boolean): Player
        controls(): boolean;

        /**
         * Set/Get whether or not to autoplay on [[amp.Player.src]].
         *
         * @param  value Whether to autoplay or not.
         * @return The [[amp.Player]] calling this function when setting, true/false when getting.
         */
        autoplay(value: boolean): Player;
        autoplay(): boolean;

        /**
         * Set the current time.
         *
         * ##### Example of setting:
         *     myPlayer.currentTime(120); // 2 minutes into the video
         *
         * ##### Example of getting:
         *     var whereYouAt = myPlayer.currentTime();
         *
         * @param  seconds Time to seek to, in seconds.
         * @return The [[amp.Player]] calling this function when setting, time in seconds when getting.
         */
        currentTime(seconds: number): Player;
        currentTime(): number;

        /**
         * Gets the current absolute time, in seconds.
         * @return absolute time in seconds, undefined if not available
         */
        currentAbsoluteTime(): number;
        currentAbsoluteTime(seconds: number): Player;

        /**
         * Gets the current media time, in seconds.
         * @return media time in seconds, undefined if not available
         */
        currentMediaTime(): number;

        /**
         * Gets the download bitrate.
         * @return bitrate in bps, undefined if not available
         */
        currentDownloadBitrate(): number;

        /**
         * Gets the playback bitrate.
         * @return bitrate in bps, undefined if not available
         */
        currentPlaybackBitrate(): number;

        /**
         * Gets the presentation time offset specified in the manifest ( In seconds ).
         * Available only in DASH.
         */
        presentationTimeOffsetInSec(): number;

        /**
         * Get the length in time of the source. For live, it is the playable window.
         *
         * ##### Example:
         *     var lengthOfSource = myPlayer.duration();
         *
         * **NOTE**: The source must have started loading before the duration can be
         * known, and in the case of Flash, may not be known until the video starts
         * playing.
         *
         * @return Duration of the source, in seconds.
         */
        duration(): number;

        /**
         * Get a TimeRanges object with the times of the source that have been downloaded.
         *
         * ##### Examples:
         *      var bufferedTimeRange = myPlayer.buffered();
         *
         * Number of different ranges of time have been buffered. Usually 1.
         *
         *      var numberOfRanges = bufferedTimeRange.length;
         *
         * Time in seconds when the first range starts. Usually 0.
         *
         *      var firstRangeStart = bufferedTimeRange.start(0);
         *
         * Time in seconds when the first range ends
         *
         *      var firstRangeEnd = bufferedTimeRange.end(0);
         *
         * Length in seconds of the first time range
         *     var firstRangeLength = firstRangeEnd - firstRangeStart;
         *
         * @return TimeRanges object [following JS spec](https://developer.mozilla.org/en-US/docs/Web/API/TimeRanges).
         */
        buffered(): TimeRanges;

        /**
         * Get the current error.
         * @return Media error
         */
        error(): MediaError;

        /**
         * Set/Get volume of the source.
         *
         * ##### Example:
         *     myPlayer.volume(0.5); // Set volume to half
         *
         * 0 is off (muted), 1.0 is all the way up, 0.5 is half way.
         *
         * @param  percentAsDecimal New volume as a decimal (0 to 1.0).
         * @return The [[amp.Player]] calling this function when setting, current volume when getting.
         */
        volume(percentAsDecimal: number): Player;
        volume(): number;

        /**
         * Set/Get muted state.
         *
         * ##### Example of setting:
         *     myPlayer.muted(true); // mute the volume
         *
         * @param  value True to mute, false to unmute.
         * @return The [[amp.Player]] calling this function when setting, current mute state when getting.
         */
        muted(value: boolean): Player;
        muted(): boolean;

        /**
         * Set/Get width of the component (CSS values).
         *
         * Setting the video tag dimension values works with values in pixels, % or 'auto'.
         *
         * @param  value Value in pixels, % or 'auto'.
         * @return The [[amp.Player]] calling this function when setting, pixels when getting.
         */
        width(): Object;
        width(value: Object): Player;

        /**
         * Set/Get height of the component (CSS values).
         *
         * Setting the video tag dimension values works with values in pixels, % or 'auto'.
         *
         * @param  value Value in pixels, % or 'auto'.
         * @return The [[amp.Player]] calling this function when setting, pixels when getting.
         */
        height(): Object;
        height(value: Object): Player;

        /**
         * Get the videoWidth of the player.
         *
         * @return Video width of the player.
         */
        videoWidth(): number;

        /**
         * Get the videoHeight of the player.
         *
         * @return Video height of the player.
         */
        videoHeight(): number;

        /**
         * Check if the player is in fullscreen mode.
         *
         * ##### Example:
         *     var isFullscreen = myPlayer.isFullscreen();
         *
         * @return True if fullscreen, false if not.
         */
        isFullscreen(): boolean;

        /**
         * Increase the size of the video to full screen.
         *
         * ##### Example:
         *     myPlayer.enterFullscreen();
         *
         * In some browsers, full screen is not supported natively, so it enters
         * "full window mode", where the video fills the browser window.
         * In browsers and devices that support native full screen, sometimes the
         * browser's default controls will be shown, and not the [[amp]] custom skin.
         * This includes most mobile devices (iOS, Android) and older versions of
         * Safari.
         *
         * @return The [[amp.Player]] calling this function.
         */
        enterFullscreen(): Player;

        /**
         * Get the video to its normal size after having been in full screen mode.
         *
         * ##### Example:
         *     myPlayer.exitFullscreen();
         *
         * @return The [[amp.Player]] calling this function.
         */
        exitFullscreen(): Player;

        /**
         * Bind a listener to the Player's ready state.
         *
         * Different from event listeners in that if the ready event has already happened
         * it will trigger the function immediately.
         *
         * @param handler Ready handler
         * @return The [[amp.Player]] calling this function.
         */
        ready(handler: Function): Player;

        /**
         * Add an event listener to this Player's element.
         *
         * ##### Example:
         *	    myPlayer.addEventListener('eventType', myFunc);
         *
         * @param  eventName The event type string. Use [[amp.eventName]] for the list of event types.
         * ex: `amp.eventName.playing`
         *
         * @param  handler Event handler.
         * @return The [[amp.Player]] calling this function.
         */
        addEventListener(eventName: string, handler: Function): Player;

        /**
         * Remove an event listener from this Player's element.
         *
         * ##### Example:
         *     myPlayer.removeEventListener('eventType', myFunc);
         *
         * If myFunc is excluded, *all* listeners for the event type will be removed.
         * If eventType is excluded, *all* listeners will be removed from the component.
         *
         * @param  eventName The event type string. Use [[amp.eventName]] for the list of event types.
         * ex: `amp.eventName.playing`
         *
         * @param  handler Event handler.
         * @return The [[amp.Player]] calling this function.
         */
        removeEventListener(eventName: string, handler?: Function): Player;

        /**
         * Destroys the [[amp.Player]] and does any necessary cleanup.
         *
         * ##### Example:
         *     myPlayer.dispose();
         *
         * This is especially helpful if you are dynamically adding and removing videos
         * to/from the DOM.
         * The orignial videoTag  created by the app is also deleted as part of this dispose.
         */
        dispose(): void;

        /**
         * Get the Log traces from the player, if memoryLog is enabled.
         *
         * @param flush flush memoryLog after returning the log.
         * @return Log trace string from the player.
         */
        getMemoryLog(flush: boolean): string;

        /**
         * Get the version of AMP player in the format
         * <MajorVersion>.<MinorVersion>.<HotfixVersion>.
         *
         * @return Released AMP player version string.
         */
        getAmpVersion(): string;

        /**
         * Get the playable window length in seconds from the manifest
         *
         * @return Playable window length in seconds from the manifest
         * or undefined if not present in the tech
         */
        manifestPlayableWindowLength(): number;

        /**
         * For live presentations, get the playable window start time (current absolute time - dvr window length) and end time in seconds.
         * For VOD, returns undefined.
         *
         * Example: If the playable window is 2 hours and the stream has been going for 3 hours,
         * the returned time range would be 01:00:00 - 03:00:00
         *
         * @return Playable window start and end in seconds
         */
        currentPlayableWindow(): TimeRange;

        /**
         * Get an array of the calculated segment boundary start times in seconds.
         *
         * @return Calculated segment boundaries
         */
        segmentBoundaries(): Array<number>;

        /**
         * Get the el_ of AMP player
         *
         * @return the el_ from the underlying player.
         */
        playerElement(): HTMLVideoElement;

        /**
         * Used in live playback calculations.
         * Given a time from the current playable window, returns the associated absolute time.
         *
         * Example: If the playable window is 2 hours and the stream has been going for 3 hours,
         * if you pass the playable window time of 00:00:00, the returned absolute time would be 01:00:00 (1 hour).
         *
         * @param  {number} target player time in seconds
         * @return {number} the presentation time in seconds
         */
        toPresentationTime(time: number): number;

        /**
         * Used in live playback calculations.
         * Given an absolute time, returns the associated time from the current playable window.
         * If the given absolute time falls outside of the current playable window,
         * returns the difference between the playable window edge and the given absolute time.
         *
         * Example: If the playable window is 2 hours and the stream has been going for 3 hours,
         * if you pass the absolute time of 01:00:00 (1 hour), the returned playable window time would be 00:00:00.
         *
         * @param  {number} target presentation time in seconds
         * @return {number} the player time in seconds
         */
        fromPresentationTime(time: number): number;

        /**
         * Set a factory to allow custom XMLHttpRequest creation logic.
         *
         * @param  {factory}, Factory method. @see XMLHttpRequestFactory.
         */
        setXmlHttpRequestFactory(factory: XMLHttpRequestFactory): void;

        /**
         * Checks if the player is able to control playback rate.
         * The ability to control playback rate depends on current tech, browser and OS.
         *
         * ##### Example:
         *     var isPlaybackRateControlAvailable = myPlayer.canControlPlaybackRate();
         *
         * @return True if playback rate can be changed, False otherwise.
         */
        canControlPlaybackRate(): boolean;

        /**
         * Gets or sets the current playback rate.  A playback rate of
         * 1.0 represents normal speed and 0.5 would indicate half-speed
         * playback, for instance.
         * @see https://html.spec.whatwg.org/multipage/embedded-content.html#dom-media-playbackrate
         *
         * @param  value New playback rate to set.
         * @return The [[amp.Player]] calling this function when setting, current playback rate when getting.
         * @method playbackRate
         */
        playbackRate(): number;
        playbackRate(value: number): Player;

        /**
         * Gets or sets downloadable media options. Setting new value completely overwrites existing downloadable media.
         *
         * @param  value New downlodable media to set.
         * @return The [[amp.Player]] calling this function when setting, current downlodable media value when getting.
         * @method downloadableMedia
         */
        downloadableMedia(): amp.Player.DownloadableMediaFile[];
        downloadableMedia(value: amp.Player.DownloadableMediaFile[]): Player;

        /**
         * Set/Get playlist to play.
         *
         * @param  newPlaylist Playlist object
         */
        playlist(newPlaylist: PlayList): void;
        playlist(): PlayList;

        /**
         * Adds a mid-roll clip schedule to the currently playing clip.
         *
         * @param  newMidRoll Mid-roll to insert or cancel
         * @return The array of scheduled mid-rolls on the currently playing clip.
         */
        addMidRoll(newMidRoll: MidRoll): MidRoll[];

        /**
         * Returns newly seen splices, evt: "splicewaiting"
         *
         */
        spliceWaiting(): Splice[];


        /**
         * Return current clip that is being played.
         */
        currentClip(): Clip;

        /**
         * Get an array of associated text tracks. captions, subtitles, chapters, descriptions
         * http://www.w3.org/html/wg/drafts/html/master/embedded-content-0.html#dom-media-texttracks
         *
         * @return {Array} Array of track objects
         * @method textTracks
         */
        textTracks(): Player.Track[];

        /**
         * Returns the textTrack that is currently being shown.
         */
        getCurrentTextTrack(): Player.Track;

        /**
         * Disables text Tracks that are currently being shown.
         */
        disableTextTracks(): void;

        /**
         * Sets active text Track.
         * @param textTrack The text track.
         */
        setActiveTextTrack(textTrack: Player.Track): void;

        /**
         * Get and Set presentationLayout.
         * @param  value New prsentation layout for playback.
         */
        presentationLayout(): PresentationLayout;
        presentationLayout(value: PresentationLayout): void;
    }

    /**
     * Customizable Options for ad support.
     */
    export interface AdOptions {
        skipAd: {
            enabled: boolean; // is skip allowed or not.
            offset?: number; // Minimal time after which skip is allowed if it is enabled.
        };
    }

    /**
     * Interface describing an Advertisement.
     */
    export interface AdElement {
        // Add server URI.
        sourceUri: string;
        // Ad start time for midrolls, in seconds.
        startTime?: number;
        // Override options, take precendence over the ad server.
        options?: AdOptions;
    }

    /**
     * Main program definition.
     */
    export interface MainProgram {
        source: amp.Player.Source;
        tracks: amp.Player.Track[];
    }


    /**
     * The presentation layout defines the three logical
     * regions where ads can be inserted. All regions are
     * optional.
     */
    export interface PresentationLayout {
        // Pre-Roll definition, ad will be played before the content playback starts.
        preRoll?: AdElement;
        // Mid-roll definition, ad will be played at a specified startTime, which is offset from the start time of content.
        midRoll?: AdElement[];
        // Post-roll definition, ad will be played after content had finished playing.
        postRoll?: AdElement;
        // Main program definition, this is the content that will be played. Contains source and track info.
        mainProgram: MainProgram;
    }

    /**
     * Assest representing a media source.
     */
    export interface Asset {
        name: string;
        source: Player.Source;
        track?: Player.Track[];
    }

    /**
     * Playable logical section of an Asset.
     */
    export interface Clip {

        name: string;

        /**
         * Is current Clip an advertisement or not.
         */
        isAd: boolean;

        /**
         * The asset from where this clip was defined.
         */
        parent: Asset;

        /**
         * The clip offset in seconds from the beginning of the asset.
         */
        offset: number;

        /**
         * The clip duration in seconds, cannot extend past the end of the asset
         */
        duration?: number;

        /**
         * If set to true, clip presentation ends when the amount of time specified
         * as duration has passed from when clip source was set, regardless of play status.
         * Defaults to false.
         *
         */
        timedReturn?: boolean;

        /**
         * Optional URI to direct a user to when a click occurs while clip is active
         *
         */
        clickThrough?: string;

        /**
         *If set, the number of seconds to play before this clip becomes skippable
         *Defaults to not skippable.
         *
         */
        skippable?: number;
    }

    /**
     * A presentation set.
     */
    interface PlayList {
        name: string;

        /**
         * List of clips in presentation order
         */
        clips: Clip[];

        /**
         * Whether current clip timeline should be paused during mid-roll insertions
         */
        pauseTimeline?: boolean;
    }


    /**
     * An insertion opportunity in the current presentation.
     */
    interface Splice {

        /**
         * Splice unique identifier.
         */
        id: number;

        /**
         * Start time of the splice event as an offset from the beginning of the current clip in seconds.
         * -1 if this is an immediate splice.
         */
        startOffset: number;

        /**
         * Splice signal is an opportunity to exit from current clip.
         */
        out?: boolean;

        /**
         * Duration of the splice event, in seconds.
         */
        duration?: number;

        /**
         * Set to true indicates that a previously sent splice event should be cancelled.
         * Defaults to false.
         */
        cancel?: boolean;
    }

    /**
     * An insertion element into the current presentation.
     */
    interface MidRoll {

        /**
         * Splice information.
         */
        splice: Splice;

        /**
         * Clip information. Not present when cancelling.
         */
        clip?: Clip;
    }

    /**
    * Interface describing factory method for creation of XmlHttpRequestWrapper.
    */
    export interface XMLHttpRequestFactory {
        (): XMLHttpRequestWrapper;
    }

    /**
     * CORS setting values.
     */
    export class CorsConfig {
        static Anonymous: string;
        static UseCredentials: string;
    }

   /**
    * Interface describing a HttpRequest.
    * @see <a href="https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest">XMLHttpRequest</a>
    */
    export interface XMLHttpRequestWrapper {
        onabort: (ev: Event) => any;
        onerror: (ev: Event) => any;
        onload: (ev: Event) => any;
        onloadend: (ev: ProgressEvent) => any;
        onloadstart: (ev: Event) => any;
        onprogress: (ev: ProgressEvent) => any;
        ontimeout: (ev: ProgressEvent) => any;
        onreadystatechange: (ev: ProgressEvent) => any;
        responseType: string;
        timeout: number;
        msCaching: string;
        readyState: number;
        status: number;
        statusText: string;
        response: any;
        setRequestHeader(header: string, value: string): void;
        abort(): void;
        open(method: string, url: string, async?: boolean, user?: string, password?: string): void;
        getResponseHeader(header: string): string;
        send(data?: any): void;
    }

    /**
    * Interface describing a time range
    */
    export interface TimeRange {
        startInSec: number;
        endInSec: number;
    }

    /**
     * Custom MediaError to report why playback failed
     */
    interface MediaError {

        /**
         * Error codes (see [[amp.ErrorCode]])
         * Bits [31-28] - Tech Id
         * ```
         * Unknown          = 0
         * AMP              = 1
         * AzureHtml5JS     = 2
         * FlashSS          = 3
         * SilverlightSS    = 4
         * Html5            = 5
         *.Html5FairPlayHLS = 6
         * ```
         * Bits [27-20] - High level code
         * ```
         * 'MEDIA_ERR_CUSTOM'               = 0
         * 'MEDIA_ERR_ABORTED'              = 1
         * 'MEDIA_ERR_NETWORK'              = 2
         * 'MEDIA_ERR_DECODE'               = 3
         * 'MEDIA_ERR_SRC_NOT_SUPPORTED'    = 4
         * 'MEDIA_ERR_ENCRYPTED'            = 5
         * 'SRC_PLAYER_MISMATCH'            = 6
         * 'MEDIA_ERR_UNKNOWN'              = 0xFF
         * ```
         * Bits [19-0]  - More details of the error. See [[amp.errorCode]].
         */
        code: number;

        /**
         * Optional error with more details
         */
        message: string;
    }

    /**
     * Video stream list, returned from [[amp.Player.currentVideoStreamList]]
     */
    interface VideoStreamList {
        /**
        * Array of available video streams
        */
        streams: VideoStream[];

        /**
         * Video stream that is currently selected, for multi video streams, only 1 stream can be selected
         */
        selectedIndex: number;
    }

    /**
     * Video stream properties and functions
     */
    interface VideoStream {
        /**
         * Name of video stream
         */
        name: string;

        /**
         * codec of video stream
         */
        codec: string;

        /**
         * Array of video tracks
         */
        tracks: VideoTrack[];

        /**
         * Select single track playback by tracks index. When selection has been honored, "changed"
         * event will fire.
         * @param index Index from tracks. If -1, enable auto switching heuristics.
         */
        selectTrackByIndex(index: number): void;

        /**
         * Method to add a listener to an event
         * @param streamEventName string of event name, available events are defined in [[amp.streamEventName]]
         * @param handler handler that is called when event occurs
         */
        addEventListener(streamEventName: string, handler: Function): void;

        /**
         * Method to remove a listener from an event
         * @param streamEventName string of event name, available events are defined in [[amp.streamEventName]]
         * @param handler handler that should be removed
         */
        removeEventListener(streamEventName: string, handler: Function): void;
    }

    /**
     * Video track properties and functions
     */
    interface VideoTrack {
        /**
         * Returns the width of the track
         **/
        width?: number;

        /**
         * Returns the height of the track
         **/
        height?: number;

        /**
         * Returns the bitrate of the track in bits per second
         **/
        bitrate: number;

        /**
         * Returns whether the track is currently selectable for download
         **/
        selectable: boolean;
    }

    interface AudioStreamList {
        /**
        * Array of available audio streams
        */
        streams: AudioStream[];

        /**
         * Audio stream that is currently enabled, currently only 1 stream can be enabled at a single time. Returns array of indices
         */
        enabledIndices: number[];

        /**
         * Switch the audiostream currently playing (current implementation is exclusive)
         * @param streamIndex the index of the stream to switch to
         */
        switchIndex(streamIndex: number): void;

        /**
         * Method to add a listener to an event
         * @param streamEventName string of event name, available events are defined in StreamEventName class
         * @param handler handler that is called when event occurs
         */
        addEventListener(streamEventName: string, handler: Function): void;

        /**
         * Method to remove a listener from an event
         * @param streamEventName string of event name, available events are defined in StreamEventName class
         * @param handler handler that should be removed
         */
        removeEventListener(streamEventName: string, handler: Function): void;

    }

    interface AudioStream {
        /**
         * name of audio stream
         */
        name: string;

        /**
         * codec of audio stream
         */
        codec: string;

        /**
         * Language of audio stream, specified in RFC 5646
         */
        language: string;

        /**
         * bitrate of audio stream
         */
        bitrate: number;

        /**
         * Whether this stream is enabled
         */
        enabled: boolean;

    }

    /**
     * Buffer data, returned from [[amp.Player.videoBufferData]] and [[amp.Player.audioBufferData]]
     */
    export interface BufferData {
        /**
        * Buffer level in seconds
        */
        bufferLevel: number;

        /**
        * Bandwidth used to make heuristic decision, available with [[amp.Player.videoBufferData]] only, in bps
        */
        perceivedBandwidth?: number;
        /**
         * Returns the most recent download requested, evt: "downloadrequested"
         **/
        downloadRequested: MediaDownload;

        /**
         * Returns the most recent download completed, evt: "downloadcompleted"
         **/
        downloadCompleted: MediaDownloadCompleted;

        /**
         * Returns the most recent download decrypted, evt: "downloaddecrypted
         **/
        downloadDecrypted: MediaDownloadDecrypted;

        /**
         * Returns the most recent download failed, evt: "downloadfailed"
         **/
        downloadFailed: MediaDownloadFailed;

        /**
         * Method to add a listener to an event
         * @param eventName string of event name, available events are defined in BufferDataEventName class
         * @param handler handler that is called when event occurs
         */
        addEventListener(eventName: string, handler: Function): void;

        /**
         * Method to remove a listener from an event
         * @param eventName string of event name, available events are defined in BufferDataEventName class
         * @param handler handler that should be removed
         */
        removeEventListener(eventName: string, handler: Function): void;
    }

    export interface MediaDownload {
        /**
         * Returns the url for this download
         **/
        url: string;

        /**
         * Returns the bitrate for this download, in bps
         **/
        bitrate: number;

        /**
         * Returns the media time for this download in seconds, null, if initialization download
         **/
        mediaTime: number;
    }

    export interface MediaDownloadCompleted {
        /**
         * Returns the measured bandwidth for this download, in bps
         **/
        measuredBandwidth: number;

        /**
         * Returns the total bytes for this download
         **/
        totalBytes: number;

        /**
         * Returns the total time to download, in ms
         **/
        totalDownloadMs: number;

        /**
         * Returns the media download information
         **/
        mediaDownload: MediaDownload;

        /**
         * An Object containing Key value pair of response headers.
         * If needed the requested headers can be passed in player options.
         **/
        responseHeaders?: { [key: string]: string };
    }

    export interface MediaDownloadDecrypted {
        /**
         * Returns the media download information
         **/
        mediaDownload: MediaDownload;
    }

    export interface MediaDownloadFailed {
        /**
         * Error code of the failure
         **/
        code: number;

        /**
         * Optional information on failure
         **/
        message?: string;

        /**
         * Returns the media download information
         **/
        mediaDownload: MediaDownload;
    }

    /**
     * Event types from [[amp]]
     */
    export class eventName {
        /**
         * Buffer has met pre-roll level. Note: There are some variation across techs.
         * On Html5 tech, this event is only raised for the first set source,
         * if source is set again on the same player, this event will not occur again.
         */
        static canplaythrough: string;

        /**
         * [[amp.Player.duration]] property has changed.
         */
        static durationchange: string;

        /**
         * [[amp.Player.ended]] property has changed.
         */
        static ended: string;

        /**
         * Error occurred, playback will stop, check [[amp.Player.error]] property.
         */
        static error: string;

        /**
         * [[amp.Player.isFullscreen]] property has changed.
         */
        static fullscreenchange: string;

        /**
         * Playback is looking for media data.
         */
        static loadstart: string;

        /**
         * Media data has been rendered for the first time.
         */
        static loadeddata: string;

        /**
         * [[amp.Player.currentVideoStreamList]] maybe available.
         */
        static loadedmetadata: string;

        /**
         * Playback has paused, check [[amp.Player.paused]] property.
         */
        static pause: string;

        /**
         * Play function has begun.
         */
        static play: string;

        /**
         * Play function has completed, check [[amp.Player.paused]] property.
         */
        static playing: string;

        /**
         *  Seek has complete, check [[amp.Player.seeking]] property.
         */
        static seeked: string;

        /**
         * Seek has begun.
         */
        static seeking: string;

        /**
         * App has set the source. SDN plugins should wait for this event before modifying
         * [[amp.Player.Options.sourceList]].
         */
        static sourceset: string;

        /**
         * [[amp.Player.currentTime]] property has changed.
         */
        static timeupdate: string;

        /**
         * [[amp.Player.volume]] property has changed.
         */
        static volumechange: string;

        /**
         * Playback has been paused to build a low buffer.
         */
        static waiting: string;

        /**
         * [[amp.Player.currentDownloadBitrate]] property has changed.
         */
        static downloadbitratechanged: string;

        /**
         * [[amp.Player.currentPlaybackBitrate]] property has changed.
         */
        static playbackbitratechanged: string;

        /**
         * [[amp.Player.playbackRate]] property has changed.
         */
        static ratechange: string;

        /**
         * [[amp.Player.dispose]] was called.
         */
        static disposing: string;

        /**
         * [[amp.Player.spliceWaiting]] msg was received.
         */
        static splicewaiting: string;

        /**
         * emsg boxes are available by examining the event [[amp.Player.emsgAvailable]].
         * Available only in DASH 
         *
         * ##### Example:
         *     myPlayer.addEventListener(amp.eventName.emsgAvailable, function (event, info) {
         *         // emsg boxes are in info.data
         *     });
         *
         */
        static emsgAvailable: string;

        /**
         * [[amp.Player.start]] Playback started.
         */
        static start: string;

        /**
         * [[amp.Player.firstquartile]] Playback reached first quartile.
         */
        static firstquartile: string;

        /**
         * [[amp.Player.midpoint]] Playback reached middle.
         */
        static midpoint: string;

        /**
         * [[amp.Player.thirdquartile]] Playback reached third quarter.
         */
        static thirdquartile: string;

        /**
         * [[amp.Player.complete]] Playback reached end. Synonym of 'ended'
         */
        static complete: string;

        /**
         * [[amp.Player.mute]] Playback was muted.
         */
        static mute: string;

        /**
         * [[amp.Player.unmute]] Player was unmuted.
         */
        static unmute: string;

        /**
         * [[amp.Player.rewind]] Playback was rewound.
         */
        static rewind: string;

        /**
         * [[amp.Player.resume]] Player started after a pause.
         */
        static resume: string;

        /**
         * [[amp.Player.fullscreen]] Player has entered fullscreen mode.
         */
        static fullscreen: string;

        /**
         * [[amp.Player.exitfullscreen]] Player has exited fullscreen mode.
         */
        static exitfullscreen: string

        /**
         * [[amp.Player.click]] User clicked on video frame.
         */
        static click: string;

        /**
         * [[amp.Player.skip]] Skip UI control was used.
         */
        static skip: string;

        /**
         * [[amp.Player.errorInPlayingAd]] player encountered an error when playing an advertisement clip.
         */
        static errorInPlayingAd: string;

        /**
         * [[amp.Player.livestartupretry]] player encountered an retry while trying to play a live content, and being retried.
         */
        static livestartupretry: string;
        /**
         * The decryptor has initialized in AES Handler.
         */
        static decryptorInitialized: string;
    }

    /**
     * Stream Event types from [[amp.Player.currentVideoStreamList]]
     */
    export class streamEventName {
        /**
         * Track has been selected in [[amp.Player.currentVideoStreamList]]
         */
        static trackselected: string;
    }

    /**
     * Stream Event types from [[amp.Player.currentAudioStreamList]]
     */
    export class streamListEventName {
        /**
         * Stream has been selected in [[amp.Player.currentAudioStreamList]]
         */
        static streamselected: string;
        /**
         * Index chosen did not exist in the list of audio streams in [[amp.Player.currentAudioStreamList]]
         */
        static streamindexinvalid: string;
        /**
         * Currently, stream selection is only supported when single stream is
         * enabled in [[amp.Player.currentAudioStreamList]]
         */
        static streamselectnotsupported: string;
    }

    /**
     * BufferData Events from [[amp.Player.videoBufferData]] or [[amp.Player.audioBufferData]]
     */
    export class bufferDataEventName {
         /**
         * Download of media has been requested from [[amp.Player.videoBufferData]] or [[amp.Player.audioBufferData]]
         */
        static downloadrequested: string;

         /**
         * Download of media has been completed from [[amp.Player.videoBufferData]] or [[amp.Player.audioBufferData]]
         */
        static downloadcompleted: string;

        /**
         * Download of media has been decrypted from [[amp.Player.videoBufferData]] or [[amp.Player.audioBufferData]].
         * Happens only for AES.
         */
        static downloaddecrypted: string;

         /**
         * Download of media has failed from [[amp.Player.videoBufferData]] or [[amp.Player.audioBufferData]]
         */
        static downloadfailed: string;
    }

    /**
     * Protection types for [[amp]]
     */
    export class protectionType {
        /**
         * Source is PlayReady encrypted.
         */
        static PlayReady: string;

        /**
         * Source is Widevine encrypted.
         */
        static Widevine: string;

        /**
         * Source is [AES envelope](http://msdn.microsoft.com/en-us/library/azure/dn783457.aspx) encrypted.
         */
        static AES: string;

        /**
         * Source is FairPlay encrypted.
         */
        static FairPlay: string;
    }

    /**
     * Error codes for [[amp.MediaError.code]] for bits 27-0.
     */
    export class errorCode {
        /**
         * MEDIA_ERR_ABORTED errors start value (0x00100000).
         */
        static abortedErrStart: number;

        /**
         * Generic abort error (0x00100000).
         */
        static abortedErrUnknown: number;

        /**
         * Abort error, not implemented (0x00100001).
         */
        static abortedErrNotImplemented: number;

        /**
         * The page is loaded over HTTPS, but the source is set to serve over HTTP.
         * The content must be served over HTTPS when the page is loaded over HTTPS (0x00100002).
         */
        static abortedErrHttpMixedContentBlocked: number;

        /**
         * MEDIA_ERR_ABORTED errors end value (0x001FFFFF).
         */
        static abortedErrEnd: number;

        /**
         * MEDIA_ERR_NETWORK errors start value (0x00200000).
         */
        static networkErrStart: number;

        /**
         * Generic network error (0x00200000).
         */
        static networkErrUnknown: number;

        /**
         * Http error response start value (0x00200190).
         */
        static networkErrHttpResponseBegin: number;

        /**
         * Http 400 error response (0x00200190).
         */
        static networkErrHttpBadUrlFormat: number;

        /**
         * Http 401 error response (0x00200191).
         */
        static networkErrHttpUserAuthRequired: number;

        /**
         * Http 403 error response (0x00200193).
         */
        static networkErrHttpUserForbidden: number;

        /**
         * Http 404 error response (0x00200194).
         */
        static networkErrHttpUrlNotFound: number;

        /**
         * Http 405 error response (0x00200195).
         */
        static networkErrHttpNotAllowed: number;

        /**
         * Http 410 error response (0x0020019A).
         */
        static networkErrHttpGone: number;

        /**
         * Http 412 error response (0x0020019C).
         */
        static networkErrHttpPreconditionFailed: number;

        /**
         * Http 500 error response (0x002001F4).
         */
        static networkErrHttpInternalServerFailure: number;

        /**
         * Http 502 error response (0x002001F6).
         */
        static networkErrHttpBadGateway: number;

        /**
         * Http 503 error response (0x002001F7).
         */
        static networkErrHttpServiceUnavailable: number;

        /**
         * Http 504 error response (0x002001F8).
         */
        static networkErrHttpGatewayTimeout: number;

        /**
         * Http error response end value (0x00200257).
         */
        static networkErrHttpResponseEnd: number;

        /**
         * Network timeout error (0x00200258).
         */
        static networkErrTimeout: number;

        /**
         * Connection error (0x00200259).
         */
        static networkErrError: number;

        /**
         * Request aborted (0x0020025A).
         */
        static networkErrAbort: number;

        /**
        * Client is offline (0x0020025B).
        */
        static networkErrNoInternet: number;
        
        /**
         * MEDIA_ERR_NETWORK errors end value (0x002FFFFF).
         */
        static networkErrEnd: number;

        /**
         * MEDIA_ERR_DECODE errors start value (0x00300000).
         */
        static decodeErrStart: number;

        /**
         * Generic decode error (0x00300000).
         */
        static decodeErrUnknown: number;

        /**
         * MEDIA_ERR_DECODE errors end value (0x003FFFFF).
         */
        static decodeErrEnd: number;

        /**
         * MEDIA_ERR_SRC_NOT_SUPPORTED errors start value (0x00400000).
         */
        static srcErrStart: number;

        /**
         * Generic source not supported error (0x00400000).
         */
        static srcErrUnknown: number;

        /**
         * Presentation parse error (0x00400001).
         */
        static srcErrParsePresentation: number;

        /**
         * Segment parse error (0x00400002).
         */
        static srcErrParseSegment: number;

        /**
         * Presentation not supported (0x00400003).
         */
        static srcErrUnsupportedPresentation: number;

        /**
         * Invalid segment (0x00400004).
         */
        static srcErrInvalidSegment: number;

        /**
         * MEDIA_ERR_SRC_NOT_SUPPORTED errors end value (0x004FFFFF).
         */
        static srcErrEnd: number;

        /**
         * MEDIA_ERR_ENCRYPTED errors start value (0x00500000).
         */
        static encryptErrStart: number;

        /**
         * Generic encrypted error (0x00500000).
         */
        static encryptErrUnknown: number;

        /**
         * Decryptor not found (0x00500001).
         */
        static encryptErrDecrypterNotFound: number;

        /**
         * Decryptor initialization error (0x00500002).
         */
        static encryptErrDecrypterInit: number;

        /**
         * Decryptor not supported (0x00500003).
         */
        static encryptErrDecrypterNotSupported: number;

        /**
         * Key acquire failed (0x00500004).
         */
        static encryptErrKeyAcquire: number;

        /**
         * Decryption of segment failed (0x00500005).
         */
        static encryptErrDecryption: number;

        /**
         * License acquire failed (0x00500006).
         */
        static encryptErrLicenseAcquire: number;

        /**
         * Certificate fetch failed (0x00500007).
         */
        static encryptErrCertAcquire: number;

        /**
         * MEDIA_ERR_ENCRYPTED errors end value (0x005FFFFF).
         */
        static encryptErrEnd: number;

        /**
         * SRC_PLAYER_MISMATCH errors start value (0x00600000).
         */
        static srcPlayerMismatchStart: number;

        /**
         * Generic source and tech player error (0x00600000).
         */
        static srcPlayerMismatchUnknown: number;

        /**
         * Flash plugin is not installed, if installed the source may play (0x00600001).
         * Note: If 0x00600003, both Flash and Silverlight are not installed.
         */
        static srcPlayerMismatchFlashNotInstalled: number;

        /**
         * Silverlight plugin is not installed, if installed the source may play (0x00600002).
         * Note: If 0x00600003, both Flash and Silverlight are not installed.
         */
        static srcPlayerMismatchSilverlightNotInstalled: number;

        /**
         * SRC_PLAYER_MISMATCH errors end value (0x006FFFFF).
         */
        static srcPlayerMismatchEnd: number;

        /**
         * Unknown errors (0x0FF00000).
         */
        static errUnknown: number;
    }


    /**
     * Downloadable media types for [[amp.Player.DownloadableMediaFile]]
     */
    export class downloadableMediaType {
        /**
         * Media type is a video file
         */
        static video: string;

        /**
         * Media type is a video file with closed captions overlaid on the video
         */
        static videoWithCC: string;

        /**
         * Media type is an audio file
         */
        static audio: string;

        /**
         * Media type is a transcript file
         */
        static transcript: string;
    }

    /**
     * Function to register plugins
     */
    function plugin(name: string, init: Object): void;
}

declare module amp.Player {

    /**
     * Interface for the options of [[amp]] when it is created.
     */
    interface Options {
        /**
         * Tech order for the player to decide on which tech to use.
         */
        techOrder?: string[];

        /**
         * Set the autoplay for the next playback.
         */
        autoplay?: boolean;

        /**
         * Set whether the controls should be displayed. Default is false.
         */
        controls?: boolean;

        /**
         * Set whether the video should follow the width of its container while keeping
         * the video aspect ratio. Default is false.
         */
        fluid?: boolean;

        /**
         * Sets the image that displays before the video begins playing. Defaults to no poster displayed.
         */
        poster?: string;

        /**
         * Sets the alt text for the img tag of the poster. Default is an empty string.
         */
        posterAltString?: string;

        /**
         * Set the configuration for the Tracing of [[amp]]
         */
        traceConfig?: TraceConfig;

        /**
         * Heuristics profile Name
         */
        heuristicProfile?: string;

        /**
         * custom Player settings.
         * this is a JSON object.
         * Ex: options.customPlayerSettings = { "customHeuristicSettings": { "windowSizeHeuristics": false } }
         */
        customPlayerSettings?: any;

        /**
         * Custom Player logo.
         * Ex: logo: { enabled: true }
         */
        logo?: LogoConfig;

        /**
         * Skin configuration of [[amp]]
         */
        skinConfig?: SkinConfig;

        /**
         * List of sources. SDN plugins can modify source URLs using this field.
         * SDN plugin can modify source URLs only after it catches [[amp.eventName.sourceset]] event triggered by AMP.
         */
        sourceList?: Source[];

        /**
         * Current SDN plugin
         */
        sdn?: SDN;

        /**
         * Hot keys to control playback (volume, current time, toggle full screen)
         */
        hotKeys?: HotKeys;

        /**
         * Configuration options for playback speed control
         */
        playbackSpeed?: PlaybackSpeedOptions;

        /**
         * Plugin configuration.
         */
        plugins?: any;

        /**
         * CorsConfig to be used for request made by AzureMediaPlayer.
         * Currently applied to all request [ Poster, TextTrack, Key, Fragments and Manifest ] for html5 tech.
         * Applied to [ Poster, TextTrack ]in all other tech's.
         */
        corsPolicy?: CorsConfig;

        /**
         * Segment download response headers required.
         * When provided downloadCompleted of BufferData would have a responseHeaders object containing the headers requested.
         * Available only on AzureHtml5JS tech.
         */
        headers?: string[];

        /**
         * Max time for stale data. Any Media data more then staleDataTimeLimitInSec behind
         * current playback position is flushed.
         * Disabled by default.
         */
        staleDataTimeLimitInSec?: number;

        /**
         * Boolean value specifying if audio should be muted at start.
         */
        muted?: boolean;

        /**
         * Configuration options for CEA708 closed captions
         */
        cea708CaptionsSettings?: Cea708CaptionsSettings;

        /**
         * Configuration options for IMSC1 captions
         */
        imsc1CaptionsSettings?: Imsc1CaptionsSettings[];

        /**
         * Object specifying wall clock time display settings.
         * If enabled, will display an overlay with the wall clock time, and change how the time is displayed on the control bar.
         * Disabled by default.
         */
        wallClockTimeDisplaySettings?: WallClockTimeDisplaySettings;
    }

    /**
     * Interface for the Logo of [[amp]]
     */
    interface LogoConfig {

        /**
         * Set if logo is displayed. Default is true.
         */
        enabled?: boolean;
    }

    /**
     * Interface for the SkinConfig of [[amp]]
     */
    interface SkinConfig {

        audioTracksMenu?: AudioTracksMenu;
    }

    /**
     * Interface for the AudioTracksMenu of [[amp]]
     * Controls for multi-audio scenarios.
     * Ex: audioTracksMenu: { enabled: true, useManifestForLabel: false }
     */
    interface AudioTracksMenu {

        /**
         * Set if audiotracks menu should be displayed on the default skin. Default is true.
         * Note if there is only 1 audiostream no audio selection menu will be shown.
         */
        enabled?: boolean;

        /**
         * Set to turn off automatic label generation and use label from manifest. Default is false.
         * When false, label shows language, bitrate and codec information if available and distinct
         * When fields aren't available, stream will be called "Track {i}"
         * When true, the label will use the audiostream name specified in the manifest
         */
        useManifestForLabel ?: boolean;
    }

    /**
     * Interface for the Trace Configuration of [[amp]]
     */
    interface TraceConfig {

        /**
         * list of all the targets and its configuration for the Traces.
         */
        TraceTargets?: TraceTarget[];

        /**
         * Set the trace level to log. Default value is 0.
         * values:
         * none = 0,
         * error = 1,
         * warning = 2,
         * verbose = 3
         */
        maxLogLevel: number;
    }

    /**
     * Target location and the configuration for the Traces.
     */
    interface TraceTarget {

        /**
         * Target location for the Logs.
         * Available targets are "console" or "memory"
         */
        target: string;

        /**
         * Max number of Traces. Only available for Memory Trace Target.
         */
        maxMemoryTraceCount?: number;
    }

    /**
     * Heuristic profiles for [[amp]]
     */
    export class HeuristicProfile {

        /**
         * Profile that starts the playback as fast as possible.
         * It also takes the width and height of the player into account when switching bitrates.
         * For live streams this profile tries to stay close to the live edge.
         */
        static QuickStart: string;

        /**
         * Profile that tries to play highest quality possible.
         * It builds the buffer to limit potential buffering.
         * It does not take the width and height of the player into account when switching bitrates.
         * For live streams this profile has a backoff from the live edge to avoid potential buffering.
         */
        static HighQuality: string;

        /**
         * Profile that tries to balance quality and speed.
         * It builds the buffer more than QuickStart but less than HighQuality.
         * It takes the width and height of the player into account when switching bitrates.
         * For live streams this profile tries to stay close to the live edge.
         * This is the default profile.
         */
        static Hybrid: string;

        /**
         * Profile designed to work alongside Azure Media Services low latency feature for live streaming.
         * If low latency is not enabled on the stream, this heuristic profile will not yield a latency improvement.
         */
        static LowLatency: string;
    }

    /**
     * Source object to hold the source information in [[Options]] and [[amp.Player.src]].
     */
    interface Source {

        /**
         * Source Url
         */
        src: string;

        /**
         * Mime type (ex: "application/dash+xml", "video/mp4", "application/dash+xml",
         * "application/vnd.apple.mpegurl").
         */
        type: string;

        /**
         * Array of [[ProtectionInfo]] for the source
         */
        protectionInfo?: ProtectionInfo[];

        /**
         * Streaming formats for the UrlRewiter to expand the sources from [Azure Media Services](http://azure.microsoft.com/en-us/services/media-services/)
         * (ex: "SMOOTH", "DASH", "HLS-V3" and "HLS-V4").
         * Default is all the streaming formats supported by [Azure Media Services](http://azure.microsoft.com/en-us/services/media-services/).
         */
        streamingFormats?: string[];

        /**
         * Disable UrlRewiter and use the given sources.
         * Default is false, to perform the url rewriting.
         */
        disableUrlRewriter?: boolean;
    }

    /**
     * Track object to hold the text track information in [[amp.Player.src]]
     */
    interface Track {

        /**
         * Type or category of the timed text track. [kind](http://www.w3.org/html/wg/drafts/html/master/semantics.html#attr-track-kind)
         */
        kind: string;

        /**
         * Label attribute to create a user readable title for the track. [label](http://www.w3.org/html/wg/drafts/html/master/semantics.html#attr-track-label)
         */
        label: string;

        /**
         * The address or Url of the media resource. [src](http://www.w3.org/html/wg/drafts/html/master/semantics.html#attr-track-label)
         */
        src: string;

        /**
         * The language of the text track data. [srclang](http://www.w3.org/html/wg/drafts/html/master/semantics.html#attr-track-srclang)
         */
        srclang?: string;
    }

    /**
     * Interface for protection information of the [[Source]]
     */
    interface ProtectionInfo {

        /**
         * Protection type string.
         * Use [[amp.protectionType]] for the list of protection types.
         * ex: `amp.protectionType.AES`
         */
        type: string;

        /**
         * Authentication Token for the player.
         */
        authenticationToken?: string;

        /**
         * Certificate URL for Fairplay.
         */
        certificateUrl?: string;
    }

    /**
     * Interface for SDN (Software-Defined Networking)
     */
    interface SDN {
        name: string;
    }

    /**
     * Interface for hot keys settings
     */
    interface HotKeys {

        /**
         * Volume change step
         */
        volumeStep?: number;

        /**
         * Seek step in seconds
         */
        seekStep?: number;

        /**
         * Flag to control whether muting is allowed
         */
        enableMute?: boolean;

        /**
         * Flag to control whether volume scrolling is allowed
         */
        enableVolumeScroll?: boolean;

        /**
         * Flag to control whether switching to fullscreen is allowed
         */
        enableFullscreen?: boolean;

        /**
         * Flag to control whether seeking to a percentage of a video by pressing number keys is allowed
         */
        enableNumbers?: boolean;

        /**
         * Flag to control whether seeking forth/back by 1 sec with up/down arrows is allowed
         */
        enableJogStyle?: boolean;
    }

    interface KeyValuePair<T> {
        name: string;
        value: T;
    }

    /**
     * Interface for playback speeed control configuration options
     */
    interface PlaybackSpeedOptions {
        /**
         * Enable playback speed control. Default is false.
         */
        enabled?: boolean;

        /**
         * Initial playback speed. Default is 1.0.
         * Value must be between 0.5 and 4.0 inclusively. Invalid values are ignored, and initial speed will be set to default value of 1.0.
         */
        initialSpeed?: number;

        /**
         * Playback speed levels.
         * Every element in the levels array specify name/value pair for the playback speed choice that will be available in the user selection menu.
         * Default speed levels are:
         *      [{ name: '2.0x', value: 2},
         *       { name: '1.0x', value: 1},
         *       { name: '0.5x', value: 0.5}]
         * values have to be between 0.5 and 4.0 inclusively.
         */
        speedLevels?: KeyValuePair<number>[];
    }

    /**
     * Interface for downloadable media file
     */
    interface DownloadableMediaFile {
        /**
         * The language of the downloadable media file in BCP47 format. Example: "en-us". [lang](https://tools.ietf.org/html/rfc5646)
         */
        lang: string;

        /**
         * Downloadable media file type.
         * use [[amp.downloadableMediaType]] for the list of media file types.
         * ex: `amp.downloadableMediaType.transcript`
         */
        type: string;

        /**
         * Optional media file bitrate, in bits per second.
         */
        bitrate?: number;

        /**
         * Optional media file size, in bytes.
         */
        size?: number;

        /**
         * Uri of the downloadable media file.
         */
        uri: string;
    }

    /**
     * Interface for CEA708 captions configuration options
     */
    interface Cea708CaptionsSettings {
        /**
         * Enable CEA708 auto-parsing. Default is false.
         */
        enabled?: boolean;

        /**
         * Label attribute to create a user readable title for the track. [label](http://www.w3.org/html/wg/drafts/html/master/semantics.html#attr-track-label)
         */
        label: string;

        /**
         * The language of the text track data. [srclang](http://www.w3.org/html/wg/drafts/html/master/semantics.html#attr-track-srclang)
         */
        srclang?: string;
    }

    /**
     * Interface for IMSC1 captions configuration options
     */
    interface Imsc1CaptionsSettings {
        /**
         * Label attribute to create a user readable title for the track. Cannot be empty. [label](http://www.w3.org/html/wg/drafts/html/master/semantics.html#attr-track-label)
         */
        label: string;

        /**
         * The language of the text track data. Can be empty. It needs to match the value of the xml:lang tag in the IMSC1. Example: "en-us". [srclang](http://www.w3.org/html/wg/drafts/html/master/semantics.html#attr-track-srclang)
         */
        srclang: string;
    }

    /**
     * Interface for wall clock time display settings
     */
    interface WallClockTimeDisplaySettings {
        /**
         * Enable display of wall clock time. Default is false.
         */
        enabled: boolean;

        /**
         *  Boolean specifying if to use local client time zone. If true, ignores timezone parameter. Default is false.
         */
        useLocalTimeZone?: boolean;

        /**
         *  Number specifying a time zone to display wall clock time in. Ex: -8 is Pacific Standard Time. Default is 0 (UTC)
         */
        timezone?: number;

        /*
         * Boolean specifying if the time shown in the control bar will be displayed in 12-hour am/pm format or 24-hour format. Default is true.
         */
        controlBar12HourFormat?: boolean;
    }
}

/**
 * FlashSS tech options.
 */
declare module amp.options.flashSS {

    /**
     * Url to Strobe media player
     */
    export var swf: string;

    /**
     * Url to the AdaptiveStreaming plugin for OSMF.
     */
    export var plugin: string;
}

/**
 * SilverlightSS tech options
 */
declare module amp.options.silverlightSS {

    /**
     * Url to the silverlight player
     */
    export var xap: string;
}

/**
 * AzureHtml5JS tech options
 */
declare module amp.options.azureHtml5JS {

    /**
     * Number of segments to skip in case of http errors
     */
    export var maxSkipSegments: number;

    /**
     * Number of total retries in case of http errors
     */
    export var maxTotalRetries: number;

    /**
     * Number of retries for each segment in case of http errors
     */
    export var maxRetryPerSegment: number;

    /**
     * Number of retries for key requests in case of http errors
     */
    export var maxRetriesForKeyAcquireFailure: number;

    /**
     * Wait time between retrying for another key acquire request
     */
    export var maxWaitTimeBetweenRetriesForKeyAcquireMS: number;
}

/**
 * The main function for users to create a player instance
 *
 * The `amp` function can be used to initialize or retrieve a player.
 *
 * ##### Example:
 *      var myPlayer = amp('my_video_id');
 *
 * @param  id  Video element or video element ID string
 * @param  options Optional options object for config/settings
 * @param  ready Optional ready handler
 * @return Player instance
 */
declare function amp(id: any, options?: amp.Player.Options, ready?: Function): amp.Player;

