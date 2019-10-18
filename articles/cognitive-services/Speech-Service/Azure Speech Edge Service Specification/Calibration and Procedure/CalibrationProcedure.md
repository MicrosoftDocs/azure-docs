The following steps describe how to calibrate the equipment for Speech Platform testing:

**Step 1: Verify Room Noise Floor**
* Position the measurement microphone (connected to SLM) @ DUT Position, with no DUT present
* On the SLM, run LAeq for > 30s
* Ensure the noise floor meets the room requirements, i.e. ***Target*** < 28 dBSPL(A), ***Max*** 35 dBSPL(A)

**Step 2: Calibrate Mouth Simulator**
* Position the measurement microphone (connected to SLM) @ Mouth Simulator MRP, with no DUT present
* Mute output channels 2-6 of the multichannel soundcard
* Play back (in looped mode) the file ***EQCalibration.wav*** via the Lab PC
* On the SLM, run LAeq for > 30s and adjust soundcard output to achieve 79-89 dB(A)
* On the SLM, run the 1/3rd Octave RTA Measurement
* Adjust the EQ connected to the mouth simulator in order to achieve ***± 0.5 dB, 160-8000Hz per 3rd Octave Band***
* Play back (in looped mode) the file ***LevelCalibration.wav*** via the Lab PC
* On the SLM, run LAeq for > 30s and adjust soundcard output to achieve ***89 ± 0.5 dB(A)*** 

**Step 3: Calibrate Background Noise Playback**
* Position the measurement microphone (connected to SLM) @ DUT Position, with no DUT present
* Mute all output channels except for BGN 1 (i.e. Channel 3)
* Play back (in looped mode) the file ***EQCalibration.wav*** via the Lab PC
* On the SLM, run LAeq for > 30s and adjust soundcard output to achieve ~ 57 dB(A)
* On the SLM, run the 1/3rd Octave RTA Measurement
* Adjust the EQ connected to the BGN speaker to achieve ***± 3 dB, 160-8000Hz per 3rd Octave Band***
* Play back (in looped mode) the file ***LevelCalibration.wav*** via the Lab PC
* On the SLM, run LAeq for > 30s and adjust soundcard output to achieve ***51 ± 0.5 dB(A)***
* Repeat for each additional BGN by unmuting the channel under test and muting all remaining channels
* Mute output channels 1 and 2 to enable BGN playback of all speakers
* Play back (in looped mode) the file ***LevelCalibration.wav*** via the Lab PC
* On the SLM, run LAeq for > 30s and adjust soundcard output equally for all BGN channels to achieve ***57 ± 0.5 dB(A)***
* **Note**: the level calibration of all BGN channels should apply the same gain change to each channel.  The level matching of each individual channel shall be preserved.

#### Test Signals
The test signals required to validate a device against the Speech Platform requirements are listed in the table below:

<table>
<tr>
<th align="left">Test Signal (Stimulus)</th>
<th align="left">Generator</th>
<th align="left">Toolchain Filename</th>
<th align="left">Channel(s)</th>
</tr>

<tr>
<td>Talker Speech</td>
<td>Mouth Simulator</td>
<td>TalkerAndAmbient.wav*</td>
<td>1</td>
</tr>

<tr>
<td>Ambient Noise</td>
<td>BGN Speakers</td>
<td>TalkerAndAmbient.wav*</td>
<td>3 - 6</td>
</tr>

<tr>
<td>Echo Content (Music, Speech)</td>
<td>Device Under Test</td>
<td>Echo.wav</td>
<td>1 + 2</td>
</tr>

<tr>
<td>Quiet Multi-Talker</td>
<td>Mouth + BGN</td>
<td>MultiTalker.wav</td>
<td>1, 3-6</td>
</tr>

<tr>
<td>Multi-Talker in Noise</td>
<td>Mouth + BGN</td>
<td>MultiTalkerAndAmbient.wav*</td>
<td>1, 3-6</td>
</tr>
</table>
<i>*Created using MH Acoustics Technology</i>

> **Note**: wall-mounted devices will additional mute Channels 5 and 6 (speaker 3 and 4 of BGN), and will require level calibration (but not ###equalization) with the wall in place.

#### Verify Mouth Simulator Level at DUT Position
Each device category defines a talker level at MRP based on typical user speech.  To ensure lab alignment with the test conditions used to define performance requirements, the talker level at the DUT position needs to be verified.
 
After calibration of the mouth simulator, verify the level of speech at the DUT position using LevelCalibration.wav.  The mouth simulator level at the DUT position must match the intended level at the DUT position below.  If results do not meet the level @ DUT position, ensure the mouth simulator has been equalized and calibrated, and that the room meets the requirements in this specification.

<table>
<tr>
<th>Device Category</th>
<th>Defined Level @ MRP</th>
<th>Level @ DUT Position</th>
</tr>

<tr>
<td align ="center">Near Field</td>
<td align ="center">92 dBA</td>
<td align ="center">65 ± 0.5 dBSPL(A)</td>
</tr>

<tr>
<td align ="center">Far Field</td>
<td align ="center">99 dBA</td>
<td align ="center">63 ± 0.5 dBSPL(A)</td>
</tr>

<tr>
<td align ="center">Far Field 360°</td>
<td align ="center">99 dBA</td>
<td align ="center">63 ± 0.5 dBSPL(A)</td>
</tr>

<tr>
<td align ="center">Head Mounted Devices</td>
<td align ="center">89 dBA</td>
<td align ="center">Not defined – MRP is suitable</td>
</tr>
</table>

#### Verify Echo Playback Level for Device Category
Each device scenario in the speech platform specification has a defined level and listener reference position for calibrating the level of echo playback.

Echo is calibrated by playing back the file EchoCalibration.wav on a device for 30s, and measured using LAeq.
<table>
<tr>
<th>Device Category</th>
<th>Defined Level @ MRP</th>
<th>Level @ DUT Position</th>
</tr>

<tr>
<td align ="center">Near Field</td>
<td align ="center">0.8m</td>
<td align ="center">67*</td>
</tr>

<tr>
<td align ="center">Far Field</td>
<td align ="center">0.8m</td>
<td align ="center">70</td>
</tr>

<tr>
<td align ="center">Far Field 360°</td>
<td align ="center">0.8m</td>
<td align ="center">73</td>
</tr>

<tr>
<td align ="center">Head Mounted Devices</td>
<td align ="center">HATS Right Ear, DRP (no correction filters)</td>
<td align ="center">86 (mono devices), 80 (stereo devices)</td>
</tr>
</table>
<i>*Near Field devices that cannot achieve 67 dBA @ maximum level may use the max volume value, provided it is > 61 dBA.  Achieving playback > 67 dBA is highly recommended for an adequate audio experience.</i>

#### Multi-Talker Test Setup
For Far Field 360° devices, two stimulus files are used to assess the performance of the device with multiple talkers interacting from varied distances and angles in both Quiet and Noisy conditions.

The test setup requires that the mouth simulator is positioned and calibrated at the 2m far field test distance.  Speech utterances will rotate through the background noise speakers and mouth simulator during the test.  The utterances are identical to those in ***TalkerAndAmbient.wav*** , but instead will alternate to a different source speaker periodically through the test.  The result is scored in the same way.

The file ***MultiTalker.wav*** is a 6-channel .wav file that does not contain any background noise material.

The file ***MultiTalkerAndAmbient.wav*** is identical to the ***MultiTalker.wav*** file, with the exception that the noise stimulus present in ***TalkerAndAmbient.wav*** (channel 3-6) is mixed together with the talker utterances present in channels 3-6 of ***MultiTalker.wav***.





