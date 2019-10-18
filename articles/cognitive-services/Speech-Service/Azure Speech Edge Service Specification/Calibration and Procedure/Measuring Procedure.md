Measurement procedures vary depending on the device OS used.  All measurements conducted assume that the test environment has meet the requirements defined in this specification, and that the required equipment has been calibrated correctly.

#### Windows Devices and Peripherals
For Windows 10 devices, OS builds for 19H1 (version 18267) or greater must be used.  To verify the version of Windows, press Windows Key + R, and execute “winver.exe”.

1. Deploy Tools : 
    * On the DUT PC, copy the files from the toolchain folder “Windows\OnDevice”

2. Configure the device for EN-US:
    * Set up the DUT PC with Cortana signed in to a test account
    * Enable “Hey Cortana” in settings
    * Ensure that the system language settings are set to EN-US English

3. Execute Speech Capture:
    
    For each test scenario, execute the DUT PC Command at a command prompt.  Start the playback of the stimulus file on the Lab PC with the channel settings indicated below ~ 3s after executing the DUT PC Command.
</br>
</br>
</br>
<table>
<tr>
<th align="left">Test Scenario</th>
<th align="left">DUT PC Command</th>
<th align="left">Lab PC Playback</th>
<th align="left">Lab PC Channel Settings</th>
</tr>
<tr>

<td>Quite</td>
<td RowSpan="4"><b>SpeechRecordings.cmd c:\foldername</b>

where ‘c:\foldername’ is a unique folder name to save each test</td>
<td>TalkerAndAmbient.wav</td>
<td>Mute Channels 3-6</td>
</tr>

<tr>
<td>Noise</td>
<td>TalkerAndAmbient.wav</td>
<td>Unmute All Channels</td>
</tr>
<tr>
<td>Quiet Multi-Talker</td>
<td>MultiTalker.wav</td>
<td>Unmute All Channels</td>
</tr>
<tr>
<td>Multi-Talker in Noise</td>
<td>MultiTalkerAndAmbient.wav</td>
<td>Unmute All Channels</td>
</tr>
<tr>
<td>Echo</td>
<td><b>SpeechRecordingsAndPlayback.cmd</b></br>
Note: script will play Echo.wav after recording has started</td>
<td>TalkerAndAmbient.wav</td>
<td>Mute Channels 3-6</td>
</tr>
</table>

4. Execute Voice Activation Logging:
    * For each test scenario above, replace the DUT PC Command with KWSCaptureEnUS.cmd, executed at an admin-level command prompt
    * After the prompt displays “Capturing for 925 seconds”, start the Lab PC playback accordingly.  
    * Note that for the Echo scenario above, Echo.wav will need to be played back 2-10s after alignment chirp from the mouth simulator

If the device uses a HW-KWS solution (i.e. HW-KWS + 2nd Stage SW-KWS), an additional step must also be accomplished (not required for SW-KWS only solutions):
1.	Open the Registry Editor (regedit.exe via Admin-level command prompt)
2.	Navigate to Computer\HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Speech_OneCore\AudioPolicy
3.	Add a “DWORD” registry named HardwareVoiceActivationSwitchWithDisplayState
4.	Set the registry key to 0.  To test SWKWS only (bypass HWKWS), set this back to 1.
5.	Note that if the device does not have AEC on the burst pin, SW-KWS may need to be configured differently for the echo test according to the following scenarios:
<table>
<th>
<th>Media Playback</th>
<th>No Media Playback</th>

<tr>
<td><b> Screen Off</b></td>
<td>SW KWS</td>
<td>SW KWS</td>
</tr>

<tr>
<td><b> Screen on</b></td>
<td>SW KWS</td>
<td>HW KWS</td>
</tr>
</table>

> Note: 
SpeechRecordings.cmd captures the default processed data from the device (and after any HW-KWS, if applicable).   OEMs may wish to use the RawRecordings.cmd script for development purposes, which captures raw microphone data that has not had any speech enhancements applied.  Any unprocessed data should not be scored.

