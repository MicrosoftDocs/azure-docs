<properties 
	pageTitle="Encoding your media with Dolby Digital Plus" 
	description="This topic describes how to encode your media with Dolby Digital Plus." 
	services="media-services" 
	documentationCenter="" 
	authors="juliako" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/01/2015" 
	ms.author="juliako"/>

#Encoding your media with Dolby Digital Plus

The Azure Media Encoder supports **Dolby® Digital Plus** encoding. Dolby® Digital Plus, or Enhanced AC-3 (E-AC-3), is an advanced surround sound audio codec designed specifically for evolving media. From home theaters and PCs to mobile phones and online streaming, Dolby Digital Plus defines high-fidelity audio. You’ll get the renowned Dolby cinema experience from all your entertainment. Dolby Digital Plus is based on core Dolby Digital technologies, the established standard for cinema, broadcast, and home theater surround sound. As mobile devices proliferate, Dolby Digital Plus is also emerging as the standard for mobile entertainment. Its advanced new technologies for audio enhancement deliver even better sound quality and additional bandwidth savings. You get great content with fewer interruptions, even when bandwidth is limited.


##Set up Azure Media Encoder to encode with Dolby Digital Plus

###Get Azure Media Encoder Processor 

Dolby Digital Plus is supported by the Azure Media Encoder. To get a reference to the **Azure Media Encoder**, see the [Get media processors](media-services-get-media-processor.md) topic.

###<a id="configure_preset"></a>Configure Azure Media Encoder settings

When configuring the encoding settings for use with Azure Media Encoder, there were a number of pre-defined presets represented by easy to remember strings. The Dolby Digital Plus encoder provides a rich array of controls, see [<DolbyDigitalPlusAudioProfile>](https://msdn.microsoft.com/library/azure/dn296500.aspx) for more information. Therefore there are no pre-built string presets that use this codec. You must specify your desired encoder settings in an XML file and submit this data with your Task as shown in the following code example:
	
	string configuration = File.ReadAllText(pathToXMLConfigFile));

    ITask task = job.Tasks.AddNew("My Dolby Digital Plus Encode Task",
        processor,
        configuration,
        _clearConfig);

This topic describes several example XML presets that configure the encoder settings. The element used to configure Dolby Digital Plus encoding is [<DolbyDigitalPlusAudioProfile>](https://msdn.microsoft.com/library/azure/dn296500.aspx) which appears as a child node of the <AudioProfile> element in an Azure Media Encoder XML preset. This XML element contains a number of attributes that control various elements of the encoding.

##Encoding to Dolby Digital Plus 5.1 Multichannel

To encode to Dolby Digital Plus 5.1 Multichannel, set Codec and EncoderMode attributes to “DolbyDigitalPlus”. The number of channels encoded is specified using the AudioCodingMode attribute of the <DolbyDigitalPlusAudioProfile> element. For a 5.1 multichannel encoding set AudioCodingMode to “Mode32”. 

The following XML preset contains a complete Azure Media Encoder XML preset that produces an MP4 file with H264 Broadband 1080p video and Dolby Digital Plus 5.1 Multichannel audio. This preset also specifies to encode a Low Frequency Effects (LFE) channel, which is specified by setting the LFEOn attribute to true. Any attributes not specified will have their default values.

This XML preset should be passed to the **Azure Media Encoder** to create an encoding job as described in [this](media-services-dotnet-encode-asset.md) topic (only instead of a predefined preset string you will pass the whole XML preset, as described [here](#configure_preset)).


	<?xml version="1.0" encoding="utf-16"?>
	<!--Created for Azure Media Encoder, May 26 2013 -->
	  <Preset
	    Version="5.0">
	    <Job />
	    <MediaFile
	      DeinterlaceMode="AutoPixelAdaptive"
	      ResizeQuality="Super"
	      AudioGainLevel="1"
	      VideoResizeMode="Stretch">
	      <OutputFormat>
	        <MP4OutputFormat
	          StreamCompatibility="Standard">
	        <AudioProfile Condition="SourceContainsAudio">
	            <DolbyDigitalPlusAudioProfile
	              Codec="DolbyDigitalPlus"
	              EncoderMode="DolbyDigitalPlus"
	              AudioCodingMode="Mode32"
	              LFEOn="True"
	              SamplesPerSecond="48000"
	              BandwidthLimitingLowpassFilter="True"
	              DialogNormalization="-31">
	              <Bitrate>
	                <ConstantBitrate
	                  Bitrate="512"
	                  IsTwoPass="False"
	                  BufferWindow="00:00:00" />
	              </Bitrate>
	            </DolbyDigitalPlusAudioProfile>
	        </AudioProfile>
	          <VideoProfile Condition="SourceContainsVideo">
	            <HighH264VideoProfile
	              BFrameCount="3"
	              EntropyMode="Cabac"
	              RDOptimizationMode="Speed"
	              HadamardTransform="False"
	              SubBlockMotionSearchMode="Speed"
	              MultiReferenceMotionSearchMode="Balanced"
	              ReferenceBFrames="False"
	              AdaptiveBFrames="True"
	              SceneChangeDetector="True"
	              FastIntraDecisions="False"
	              FastInterDecisions="False"
	              SubPixelMode="Quarter"
	              SliceCount="0"
	              KeyFrameDistance="00:00:05"
	              InLoopFilter="True"
	              MEPartitionLevel="EightByEight"
	              ReferenceFrames="4"
	              SearchRange="64"
	              AutoFit="True"
	              Force16Pixels="False"
	              FrameRate="0"
	              SeparateFilesPerStream="True"
	              SmoothStreaming="False"
	              NumberOfEncoderThreads="0">
	              <Streams
	                AutoSize="False"
	                FreezeSort="False">
	                <StreamInfo
	                  Size="1920, 1080">
	                  <Bitrate>
	                    <ConstantBitrate
	                      Bitrate="6000"
	                      IsTwoPass="False"
	                      BufferWindow="00:00:05" />
	                  </Bitrate>
	                </StreamInfo>
	              </Streams>
	            </HighH264VideoProfile>
	          </VideoProfile>
	        </MP4OutputFormat>
	      </OutputFormat>
	    </MediaFile>
	  </Preset>

##Encoding to Dolby Digital Plus Stereo

To encode to Dolby Digital Plus stereo, set the Codec and EncoderMode attributes to “DolbyDigitalPlus”. The number of channels encoded is specified using the AudioCodingMode attribute. For a stereo encoding set AudioCodingMode to “Mode20”. The following XML preset example shows the <DolbyDigitalPlusAudioProfile> used to encode to 5.1 audio. Any attributes not specified will have their default values.

This XML preset should be passed to the **Azure Media Encoder** to create an encoding job as described in [this](media-services-dotnet-encode-asset.md) topic (only instead of a predefined preset string you will pass the whole XML preset, as described [here](#configure_preset)).

	<?xml version="1.0" encoding="utf-16"?>
	<!--Created for Azure Media Encoder, May 26 2013 -->
	  <Preset
	    Version="5.0">
	    <Job />
	    <MediaFile
	      DeinterlaceMode="AutoPixelAdaptive"
	      ResizeQuality="Super"
	      AudioGainLevel="1"
	      VideoResizeMode="Stretch">
	      <OutputFormat>
	        <MP4OutputFormat
	          StreamCompatibility="Standard">
	        <AudioProfile Condition="SourceContainsAudio">
	            <DolbyDigitalPlusAudioProfile
	              Codec="DolbyDigitalPlus"
	              EncoderMode="DolbyDigitalPlus"
	              AudioCodingMode="Mode20"
	              LFEOn="False"
	              SamplesPerSecond="48000"
	              DialogNormalization="-31">
	              <Bitrate>
	                <ConstantBitrate
	                  Bitrate="128"
	                  IsTwoPass="False"
	                  BufferWindow="00:00:00" />
	              </Bitrate>
	            </DolbyDigitalPlusAudioProfile>
	        </AudioProfile>
	          <VideoProfile Condition="SourceContainsVideo">
	            <HighH264VideoProfile
	              BFrameCount="1"
	              EntropyMode="Cabac"
	              RDOptimizationMode="Speed"
	              HadamardTransform="False"
	              SubBlockMotionSearchMode="Speed"
	              MultiReferenceMotionSearchMode="Speed"
	              ReferenceBFrames="False"
	              AdaptiveBFrames="True"
	              SceneChangeDetector="True"
	              FastIntraDecisions="False"
	              FastInterDecisions="False"
	              SubPixelMode="Quarter"
	              SliceCount="0"
	              KeyFrameDistance="00:00:05"
	              InLoopFilter="True"
	              MEPartitionLevel="EightByEight"
	              ReferenceFrames="4"
	              SearchRange="32"
	              AutoFit="True"
	              Force16Pixels="False"
	              FrameRate="0"
	              SeparateFilesPerStream="True"
	              SmoothStreaming="False"
	              NumberOfEncoderThreads="0">
	              <Streams
	                AutoSize="False"
	                FreezeSort="False">
	              <StreamInfo
	                Size="852, 480">
	                <Bitrate>
	                  <ConstantBitrate
	                    Bitrate="2200"
	                    IsTwoPass="False"
	                    BufferWindow="00:00:05" />
	                </Bitrate>
	              </StreamInfo>
	              </Streams>
	            </HighH264VideoProfile>
	          </VideoProfile>
	        </MP4OutputFormat>
	      </OutputFormat>
	    </MediaFile>
	  </Preset>

##Encoding to Multiple MP4 Files 

You can encode to multiple MP4s within a single XML preset. For each MP4 you want to generate, add a <Preset> element into the configuration. Each <Preset> element can contain configuration information for video, audio, or both.

###Configuration

The following configuration will generate the following outputs:

- 8 Video-only MP4 files
	- 1080p Video @ 6000 kbps
	- 1080p Video @ 4700 kbps
	- 720p Video @ 3400 kbps
	- 960 x 540 Video @ 2250 kbps
	- 960 x 540 Video @ 1500 kbps
	- 640 x 380 Video @ 1000 kbps
	- 640 x 380 Video @ 650 kbps
	- 320 x 180 Video @ 400 kbps

- 5 Audio-only MP4 files
	- AAC Audio Stereo @ 128 kbp
	- AAC Audio 5.1 @ 512 kbps
	- Dolby Digital Plus Stereo @ 128 kbps
	- Dolby Digital Plus 5.1 Multichannel @ 512 kbps
	- AAC Stereo @ 56 kbps
- A .ism manifest
- An XML file listing the properties of the generated MP4 files.
		
		<?xml version="1.0" encoding="utf-16"?>
		<!--Created for Azure Media Encoder, May 16 2013 -->
		<Presets>
		  <Preset
		    Version="5.0">
		    <Job />
		    <MediaFile
		      DeinterlaceMode="AutoPixelAdaptive"
		      ResizeQuality="Super"   
		      AudioGainLevel="1"
		      VideoResizeMode="Stretch">
		      <OutputFormat>
		        <MP4OutputFormat
		          StreamCompatibility="Standard">
		          <VideoProfile Condition="SourceContainsVideo">
		            <HighH264VideoProfile
		              BFrameCount="3"
		              EntropyMode="Cabac"
		              RDOptimizationMode="Speed"
		              HadamardTransform="False"
		              SubBlockMotionSearchMode="Speed"
		              MultiReferenceMotionSearchMode="Balanced"
		              ReferenceBFrames="False"
		              AdaptiveBFrames="True"
		              SceneChangeDetector="True"
		              FastIntraDecisions="False"
		              FastInterDecisions="False"
		              SubPixelMode="Quarter"
		              SliceCount="0"
		              KeyFrameDistance="00:00:05"
		              InLoopFilter="True"
		              MEPartitionLevel="EightByEight"
		              ReferenceFrames="4"
		              SearchRange="64"
		              AutoFit="True"
		              Force16Pixels="False"
		              FrameRate="0"
		              SeparateFilesPerStream="True"
		              SmoothStreaming="False"
		              NumberOfEncoderThreads="0">
		              <Streams
		                AutoSize="False"
		                FreezeSort="False">
		                <StreamInfo
		                  Size="1920, 1080">
		                  <Bitrate>
		                    <ConstantBitrate
		                      Bitrate="6000"
		                      IsTwoPass="False"
		                      BufferWindow="00:00:05" />
		                  </Bitrate>
		                </StreamInfo>
		                <StreamInfo
		                  Size="1920, 1080">
		                  <Bitrate>
		                    <ConstantBitrate
		                      Bitrate="4700"
		                      IsTwoPass="False"
		                      BufferWindow="00:00:05" />
		                  </Bitrate>
		                </StreamInfo>
		                <StreamInfo
		                  Size="1280, 720">
		                  <Bitrate>
		                    <ConstantBitrate
		                      Bitrate="3400"
		                      IsTwoPass="False"
		                      BufferWindow="00:00:05" />
		                  </Bitrate>
		                </StreamInfo>
		                <StreamInfo
		                  Size="960, 540">
		                  <Bitrate>
		                    <ConstantBitrate
		                      Bitrate="2250"
		                      IsTwoPass="False"
		                      BufferWindow="00:00:05" />
		                  </Bitrate>
		                </StreamInfo>
		                <StreamInfo
		                  Size="960, 540">
		                  <Bitrate>
		                    <ConstantBitrate
		                      Bitrate="1500"
		                      IsTwoPass="False"
		                      BufferWindow="00:00:05" />
		                  </Bitrate>
		                </StreamInfo>
		                <StreamInfo
		                  Size="640, 360">
		                  <Bitrate>
		                    <ConstantBitrate
		                      Bitrate="1000"
		                      IsTwoPass="False"
		                      BufferWindow="00:00:05" />
		                  </Bitrate>
		                </StreamInfo>
		                <StreamInfo
		                  Size="640, 360">
		                  <Bitrate>
		                    <ConstantBitrate
		                      Bitrate="650"
		                      IsTwoPass="False"
		                      BufferWindow="00:00:05" />
		                  </Bitrate>
		                </StreamInfo>
		                <StreamInfo
		                  Size="320, 180">
		                  <Bitrate>
		                    <ConstantBitrate
		                      Bitrate="400"
		                      IsTwoPass="False"
		                      BufferWindow="00:00:05" />
		                  </Bitrate>
		                </StreamInfo>
		              </Streams>
		            </HighH264VideoProfile>
		          </VideoProfile>
		        </MP4OutputFormat>
		      </OutputFormat>
		    </MediaFile>
		  </Preset>
		  <Preset
		    Version="5.0">
		    <Job />
		    <MediaFile
		      DeinterlaceMode="AutoPixelAdaptive"
		      ResizeQuality="Super"
		      NormalizeAudio="True"
		      AudioGainLevel="1"
		      VideoResizeMode="Stretch">
		      <OutputFormat>
		        <MP4OutputFormat
		          StreamCompatibility="PropagateSourceTimeStamps">
		          <AudioProfile>
		            <AacAudioProfile
		              Codec="AAC"
		              Channels="2"
		              BitsPerSample="16"
		              SamplesPerSecond="48000">
		              <Bitrate>
		                <ConstantBitrate
		                  Bitrate="128"
		                  IsTwoPass="False"
		                  BufferWindow="00:00:00" />
		              </Bitrate>
		            </AacAudioProfile>
		          </AudioProfile>
		        </MP4OutputFormat>
		      </OutputFormat>
		    </MediaFile>
		  </Preset>
		  <Preset
		    Version="5.0">
		    <Job />
		    <MediaFile
		      DeinterlaceMode="AutoPixelAdaptive"
		      ResizeQuality="Super"
		      NormalizeAudio="True"
		      AudioGainLevel="1"
		      VideoResizeMode="Stretch">
		      <OutputFormat>
		        <MP4OutputFormat
		          StreamCompatibility="Standard">
		          <AudioProfile>
		            <AacAudioProfile
		              Codec="AAC"
		              Channels="6"
		              BitsPerSample="16"
		              SamplesPerSecond="48000">
		              <Bitrate>
		                <ConstantBitrate
		                  Bitrate="512"
		                  IsTwoPass="False"
		                  BufferWindow="00:00:00" />
		              </Bitrate>
		            </AacAudioProfile>
		          </AudioProfile>
		        </MP4OutputFormat>
		      </OutputFormat>
		    </MediaFile>
		  </Preset>
		  <Preset
		    Version="5.0">
		    <Job />
		    <MediaFile
		      DeinterlaceMode="AutoPixelAdaptive"
		      ResizeQuality="Super"
		      NormalizeAudio="True"
		      AudioGainLevel="1"
		      VideoResizeMode="Stretch">
		      <OutputFormat>
		        <MP4OutputFormat
		          StreamCompatibility="Standard">
		          <AudioProfile>
		            <DolbyDigitalPlusAudioProfile
		              Codec="DolbyDigitalPlus"
		              EncoderMode="DolbyDigitalPlus"
		              Channels="2"
		              AudioCodingMode="Mode20"
		              LFEOn="False"
		              NinetyDegreePhaseShiftSurrounds="False"
		              ThreeDBAttenuationSurrounds="False"
		              DolbySurroundMode="NotIndicated"
		              StereoDownmixPreference="NotIndicated"
		              LtRtCenterMixLevel="-3"
		              LoRoCenterMixLevel="-3"
		              LtRtSurroundMixLevel="-3"
		              LoRoSurroundMixLevel="-3"
		              LFELowpassFilter="False"
		              SamplesPerSecond="48000"
		              BandwidthLimitingLowpassFilter="True"
		              DCHighpassFilter="True"
		              LineModeDynamicRangeControl="FilmStandard"
		              RFModeDynamicRangeControl="FilmStandard"
		              DialogNormalization="-31">
		              <Bitrate>
		                <ConstantBitrate
		                  Bitrate="128"
		                  IsTwoPass="False"
		                  BufferWindow="00:00:00" />
		              </Bitrate>
		            </DolbyDigitalPlusAudioProfile>
		          </AudioProfile>
		        </MP4OutputFormat>
		      </OutputFormat>
		    </MediaFile>
		  </Preset>
		  <Preset
		    Version="5.0">
		    <Job />
		    <MediaFile
		      DeinterlaceMode="AutoPixelAdaptive"
		      ResizeQuality="Super"
		      NormalizeAudio="True"
		      AudioGainLevel="1"
		      VideoResizeMode="Stretch">
		      <OutputFormat>
		        <MP4OutputFormat
		          StreamCompatibility="Standard">
		          <AudioProfile Condition="SourceContainsAudio">
		            <DolbyDigitalPlusAudioProfile
		              Codec="DolbyDigitalPlus"
		              EncoderMode="DolbyDigitalPlus"
		              Channels="6"
		              AudioCodingMode="Mode32"
		              LFEOn="True"
		              NinetyDegreePhaseShiftSurrounds="True"
		              ThreeDBAttenuationSurrounds="False"
		              DolbySurroundMode="NotIndicated"
		              StereoDownmixPreference="NotIndicated"
		              LtRtCenterMixLevel="-3"
		              LoRoCenterMixLevel="-3"
		              LtRtSurroundMixLevel="-3"
		              LoRoSurroundMixLevel="-3"
		              LFELowpassFilter="True"
		              SamplesPerSecond="48000"
		              BandwidthLimitingLowpassFilter="True"
		              DCHighpassFilter="True"
		              LineModeDynamicRangeControl="FilmStandard"
		              RFModeDynamicRangeControl="FilmStandard"
		              DialogNormalization="-31">
		              <Bitrate>
		                <ConstantBitrate
		                  Bitrate="512"
		                  IsTwoPass="False"
		                  BufferWindow="00:00:00" />
		              </Bitrate>
		            </DolbyDigitalPlusAudioProfile>
		          </AudioProfile>
		        </MP4OutputFormat>
		      </OutputFormat>
		    </MediaFile>
		  </Preset>
		  <Preset
		    Version="5.0">
		    <Job />
		    <MediaFile
		      DeinterlaceMode="AutoPixelAdaptive"
		      ResizeQuality="Super"
		      NormalizeAudio="True"
		      AudioGainLevel="1"
		      VideoResizeMode="Stretch">
		      <OutputFormat>
		        <MP4OutputFormat
		          StreamCompatibility="Standard">
		          <AudioProfile>
		            <AacAudioProfile
		              Codec="AAC"
		              Channels="2"
		              BitsPerSample="16"
		              SamplesPerSecond="48000">
		              <Bitrate>
		                <ConstantBitrate
		                  Bitrate="56"
		                  IsTwoPass="False"
		                  BufferWindow="00:00:00" />
		              </Bitrate>
		            </AacAudioProfile>
		          </AudioProfile>
		        </MP4OutputFormat>
		      </OutputFormat>
		    </MediaFile>
		  </Preset>
		</Presets>

##Creating Commercial Encoding Services

Some customers may wish to build a commercial encoding service on top of Azure Media Services. If you are creating such a ‘build-on’ service it is important that all Dolby Digital Plus encoding parameters are available. Please ensure that all the parameters within the <DolbyDigitalPlusAudioProfile> tag are exposed and configurable by the end-user. Please contact prolicensingsupport@dolby.com for guidance on making these parameters available.

##Using Dolby Professional Loudness Metering (DPLM) Support

The Azure Media Encoder, can use the DPLM SDK in order to measure the loudness of dialog in the input audio, and set the correct value of DialogNormalization. This feature is enabled only if the audio is being encoded to Dolby Digital Plus. DPLM is configured in a preset configuration file using the <LoudnessMetering> element that is a child of the <DolbyDigitalPlusAudioProfile> element. The following sample preset shows how to configure DPLM:
	
	<?xml version="1.0" encoding="utf-16"?>
	<Preset
	  Version="5.0">
	  <Job />
	  <MediaFile>
	    <OutputFormat>
	      <MP4OutputFormat
	        StreamCompatibility="Standard">
	    <AudioProfile>
	             <DolbyDigitalPlusAudioProfile
	               Codec="DolbyDigitalPlus"
	               EncoderMode="DolbyDigitalPlus"
	               DolbySurroundMode="NotIndicated"
	               StereoDownmixPreference="NotIndicated"
	               SamplesPerSecond="48000"
	               AudioCodingMode="Mode20"
	               Channels="2"
	               BitsPerSample="24">
	               <LoudnessMetering
	                 Mode= "ITU_R_BS_1770_2_DI"
	                 SpeechThreshold="20"
	                 TruePeakEmphasis="false"
	                 TruePeakDCBlock="false" />
	              <Bitrate>
	                <ConstantBitrate
	                  Bitrate="320"
	                  IsTwoPass="False"
	                  BufferWindow="00:00:00" />
	              </Bitrate>
	     </DolbyDigitalPlusAudioProfile>
	    </AudioProfile>
	      </MP4OutputFormat>
	    </OutputFormat>
	  </MediaFile>
	</Preset>

The <LoudnessMetering> element can only be specified within a <DolbyDigitalPlusAudioProfile> element. If the <LoudnessMetering> element is used then the DialogNormalization attribute must not be used. The encoder generate an error if both the <LoudnessMetering> element and the DialogNormalization attribute are used. All attributes of LoudnessMetering are optional, and the encoder will default to the values recommended by Dolby Laboratories, Inc.

Each attribute is described in the following sections.

###Mode Attribute

This attribute determines the loudness metering mode. Allowed values are:

 
**ITU_R_BS_1770_2_DI** (default) - indicates ITU-R BS.1770-2 plus Dialogue Intelligence

**ITU_R_BS_1770_1_DI** - indicates ITU-R BS.1770-1 plus Dialogue Intelligence

**ITU_R_BS_1770_2** - indicates ITU-R BS.1770-2

**LEQA_DI** - indicates Leq(A) plus Dialogue Intelligence

**Note:**

The** EBU R128** mode can be achieved with **ITU_R_BS_1770_2_DI**

The **Leq(A)** is included purely for legacy reasons, and should only be used in specific legacy workflows

The **ITU** has recently released an update titled BS.1770-3, which is equivalent to BS.1770-2 with TruePeakDCBlock and TruePeakEmphasis both set to false

###SpeechThreshold Attribute

Specifies a speech threshold used by DPLM to produce an integrated loudness result (for example, selecting between speech gating, level gating, and no gating). The speech threshold setting range is from 0% to 100%, in 1% increments. This parameter has an effect only when DPLM is configured in a mode that utilizes Dialogue Intelligence, which means it can only be specified if Mode is set to ITU_R_BS_1770_2_DI or ITU_R_BS_1770_1_DI. The default value, when Mode is either ITU_R_BS_1770_2_DI or ITU_R_BS_1770_1_DI, is 20%. Values for this attribute must be set in the range 0, 1 – 100.

###TruePeakDCBlock Attribute

This input parameter specifies whether the DC block within the true‐peak metering is enabled (true) or disabled (false). For more details of the DC block, refer to ITU‐R BS.1770‐2.The default value is false.

###TruePeakEmphasis Attribute

Specifies whether the emphasis filter within the true‐peak metering is enabled (true) or disabled (false). For more details of the emphasis filter, refer to ITU‐R BS.1770‐2.The default value is false.


###DPLM Results

When an encode tasks specifies the use of DPLM, the results of the loudness measurement will be included in the metadata XML in the output Asset. Following is an example.
	
	<LoudnessMeteringResultParameters 
	     DPLMVersionInformation="Dolby Professional Loudness Metering Development Kit Version 1.0"
	     DialogNormalization="-15" 
	     IntegratedLoudness="-14.8487606" 
	     IntegratedLoudnessGatingMethod="2" 
	     IntegratedLoudnessSpeechPercentage="11.673481" 
	     SamplePeak="-0.7028221" 
	     TruePeak="0.705999851" />

Each attribute is described below.

**DPLMVersionInformation** - A string representing the version of the DPLM SDK used.

**DialogNormalization** - The value of DialNorm, in decibels, measured from the input audio, that will be embedded into the output DD+ stream, in the range {-31, -30, …, -1} dB.

**IntegratedLoudness** - The integrated loudness as measured by DPLM, in the range -70 to +10 LKFS/dBFS (where dBFS is used only when Mode is set to LEQA_DI).

**IntegratedLoudnessGatingMethod** - Valid values are: 0 – None/Ungated; 1 – Speech Gated; 2 – Level Gated.

**IntegratedLoudnessSpeechPercentage** - This result contains the percentage of the input media’s timeline where speech is detected. Values range from 0% to 100%.

**SamplePeak** - This result contains the largest absolute sample value in any channel since the metering was reset, and ranges from -70 to +10 dBFS.

**TruePeak** - This result contains the largest absolute true‐peak value in any channel since the metering was reset. Refer to ITU‐R BS.1770‐2 for a description of true peak. The values can range in -70 to 12.04 dBTP.
