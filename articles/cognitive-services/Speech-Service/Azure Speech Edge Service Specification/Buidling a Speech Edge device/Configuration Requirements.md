## CONFIGURATION REQUIREMENTS

Appropriate configuration ensures SR features are enabled on Microsoft Speech Platform devices.

### Hardware requirements


### Software requirements
All speech devices should be configured with below SR features
<p>
<table border="2">
<tr>
<th  width="80" align="left">ID</th>
<th align="left">Requirement</th>
</tr>
<tr>
<td>SR-01</td>
<td>All speech enhancements must include at least noise suppression and echo cancellation</td>
</tr>
<tr>
<td>SR-02</td>
<td>Devices must not have any undiscoverable or uncontrollable hardware, firmware or 3rd party software-based non-linear audio processing algorithms to/from the device</td>
</tr>
<tr>
<td>SR-03</td>
<td>Drivers must implement <a href="https://docs.microsoft.com/en-us/windows-hardware/drivers/audio/ksproperty-audio-mic-array-geometry" >Microphone Array Geometry Descriptors</a> correctly (examples in Appendix C)
</td>
</tr>
<tr>
<td>SR-04</td>
<td>Capture formats must use a minimum sampling rate of 16kHz, and recommended 24-bit depth</td>
</tr>
<tr>
<td>SR-05</td>
<td>All USB audio input devices must set descriptors according to the <a href="https://www.usb.org/document-library/usb-audio-devices-rev-30-and-adopters-agreement"> USB Audio Devices Rev3 Spec</a> </td>
</tr>
<tr>
<td>SR-06</td>
<td>Any personal assistant HW-KWS must support both chained (“one-shot”) commands and keyword only</td>
</tr>
<tr>
<td>SR-07</td>
<td>Audio must be free of jitter and drop-outs with low drift to ensure optimal algorithm performance</td>
</tr>
<tr>
<td>SR-08</td>
<td>Devices must provide the capability to record simultaneous raw (unprocessed) microphone streams</td>
</tr>
</table>

#### Windows Devices
In addition to configuration requirements for all speech devices, Windows devices will also require the following
<p></p>
<table border="2">
<tr>
<th  width="80" align="left">ID</th>
<th align="left">Requirement</th>
</tr>
<tr>
<td>WIN-01</td>
<td>All device drivers must support “speech” signal processing mode on the audio input</td>
</tr>
<tr>
<td>WIN-02</td>
<td>Drivers must expose all audio effects via FXModeCLSID, FXEndpointCLSID APOs OR proxy APOs if OEM pipeline is expected to be used</td>
</tr>
<tr>
<td>WIN-03</td>
<td>Drivers must support APO change notifications, and only notify the system when an APO change occurs</td>
</tr>
<tr>
<td>WIN-04</td>
<td>OEMs must meet prerequisite input levels described in <b>Microsoft Speech Platform: Hardware Guidelines</b> in order to expose AGC as an APO effect.  Otherwise, the Microsoft AGC will be applied after all OEM APO effects/pre-processing</td>
</tr>
<tr>
<td>WIN-05</td>
<td>To enable HW-KWS offloading to a DSP in S0 (“power on”) and Modern Standby states, both Noise Suppression (NS) and Acoustic Echo Cancellation (AEC) must be exposed on the burst pin.  Otherwise, the software keyword spotter (SW-KWS) will be used in S0 and Modern Standby.
<a href="https://docs.microsoft.com/en-us/windows-hardware/drivers/audio/voice-activation">More details on implementing voice activation solutions</a>
</td>
</tr>
<tr>
<td>WIN-06</td>
<td>KWS solutions must buffer all of a detected keyword, including 500ms prior to the start of the keyword</td>
</tr>
<tr>
<td>WIN-07</td>
<td>KWS solutions must have the driver include timestamps identifying the end (and optionally the start) of the keyword in the stream</td>
</tr>
<tr>
<td>WIN-08</td>
<td>SW-KWS devices must support a buffer size of ≥ 100ms on the host pin (recommended size = 100ms to balance power and latency).  HW-KWS devices are not required to support large buffers.
For more details, see <a href="https://docs.microsoft.com/en-us/windows-hardware/drivers/ddi/content/ksmedia/ns-ksmedia-_ksaudio_packetsize_constraints2">Physical Hardware and Processing Mode Constraints</a>

</td>
</tr>
<tr>
<td>WIN-09</td>
<td>Only WoV systems with HW-KWS are “Battery Certified”.  The following registry keys can be configured for OOBE via a <a href="https://docs.microsoft.com/en-us/windows/client-management/mdm/configuration-service-provider-reference">Mobile Device Management Configuration Service Provider</a> (MDM CSP) only:
<p>Path: HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Speech_OneCore\AudioPolicy
DWORD: VoiceActivationIsBatteryCertified = 1 (makes “Hey Cortana” checkbox visible in OOBE)
DWORD: VoiceActivationIsEnergyHero = 1 (above checkbox is checked by default, note AEC must enabled on the burst pin) 

To validate functionality, see Appendix D</p>
</td>
</tr>
<tr>
<td>WIN-10</td>
<td>???</td>
</tr>
<tr>
<td>WIN-11</td>
<td>The default microphone must be set to an optimal level that enables a device to pass the performance requirements in this specification.  In OS version 1605 and later, the audio driver developer will specify a default volume in their driver rather than having to use the previous (now deprecated) reg key.  

Implementation details can be found here: https://docs.microsoft.com/en-us/windows-hardware/drivers/audio/pkey-audioendpoint-default-volumeindb
</td>
</tr>
<tr>
<td>WIN-12</td>
<td>All Windows Mixed Reality HMDs must provide a sensitivity value and extension INF as defined in the <b>Windows Mixed Reality Audio Specification</b>.</td>
</tr>
<tr>
<td>WIN-13</td>
<td>For systems intending to support Far Field device categories (Far Field and Far Field 360°), a property must be set via INF according to the details here: https://docs.microsoft.com/en-us/windows-hardware/drivers/audio/pkey-devices-audiodevice-microphone-isfarfield
</td>
</tr>
<tr>
<td>WIN-14</td>
<td>Systems that support HW KWS and interleave microphone and loopback audio in a single PCM stream must set a property to use an AEC APO on the keyword burst output.

Implementation details can be found here: https://docs.microsoft.com/en-us/windows-hardware/drivers/audio/ksproperty-interleavedaudio-formatinformation
</td>
</tr>
</table>

#### Android Devices
#### Linux Devices

### Guidelines
<table border="2">
<tr>
<th  width="80" align="left">ID</th>
<th align="left">Recommendation</th>
</tr>
<tr>
<td>REC-01</td>
<td>Windows devices are recommended to support modern standby
</td>
</tr>
<tr>
<td>REC-02</td>
<td>Device should meet all <a href="http://msdn.microsoft.com/en-us/library/windows/hardware/jj134354.aspx">Device Audio requirements</a> found under Windows Hardware Certification, including the <a href="https://docs.microsoft.com/en-us/windows-hardware/test/hlk/testref/8b2c652c-71c3-4f8b-a1d2-dc40cb660168" ></a>Communications Audio Fidelity test
</td>
</tr>
<tr>
<td>REC-03</td>
<td>Windows devices may be configured to enable or disable voice activation when a device lid is closed.  The following registry key can be configured as follows via a Mobile Device Management Configuration Service Provider (MDM CSP) only: 
<p>
Path: HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Speech_OneCore\AudioPolicy</p><p>
DWORD: VoiceActivationLidStateBehavior
</p>
<table>
<tr>
<th align="left">Value</th>
<th align="left">Function</th>
<th align="left">Description</th>
</tr>
<tr>
<td>1</td>
<td>Disable Voice Activation</td>
<td>Voice Activation is <b><i>disabled</i></b> when lid is closed, independent of input suppression state</td>
</tr>
<tr><td>2</td>
<td>Override Input Suppression</td>
<td>Voice Activation is <b><i>enabled</i></b> when lid is closed, independent of input suppression state</td>
<table>
</td>
</tr>
</table>