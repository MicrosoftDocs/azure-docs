# Device Types and Scenarios

## Device Categories
Devices may be evaluated under various unique user interaction scenarios.  A minimum of one device category must be selected for validation (at the discretion of an OEM/IHV), based on the product intent:

#### 1. HMDs (Head Mounted Devices)
Products which are ***worn on the user’s head or ear(s)***, including (but not limited to) Virtual Reality and Augmented Reality devices, and Gaming, Mobile, and Chat Headsets.  Note that Windows Mixed Reality devices have additional requirements for implementation and render performance.
#### 2. Near Field
Near field devices include products such as laptops, tablets, personal speakerphones, webcams, and desktop PCs that are intended to provide ***good speech experiences up to 0.8m away from the user***.
#### 3. Far Field
Products which are intended to provide ***good speech experiences up to 4m away from the user***, and may include wall-mounted devices, PCs or PC and entertainment system accessories and peripherals.
#### 4. Far Field 360°
Far field 360° devices are products which are intended to extend beyond far field with 360° functionality and provide a higher fidelity experience (e.g. in-home smart speakers with voice assistant functions).

## Use case Scenarios

The following user scenarios represent common, generalized use cases.  IHVs may wish to test and optimize speech products and algorithms in additional scenarios beyond what is required by this specification, at their discretion



<table border="2">
<th>Test Scenario</th>
<th></th>
<th>Representative of..</th>
<th>Evaluation Parameters</th>
<th>
</table>
<table border="1">
<tr>
<td RowSpan="4">Ambient Noise</td>
<td>Quiet</td>
<td>Quiet office, living room</td>
<td>Noise ≤ 35 dBA</td>
<td>
</tr>
<tr>
<td>Noise (Medium)</td>
<td>Coffee shop, kitchen, busy home</td>
<td>Noise 57-69 dBA</td>
</tr>
<tr>
<td>Noise (Loud)</td>
<td>Busy open office, loud vehicle, public spaces</td>
<td>Noise 70-84 dBA</td>
</tr>
<tr>
<td>Noise (Very Loud)</td>
<td>Factory environment</td>
<td>Noise ≥ 85 dBA</td>
</tr>
<tr>
<td RowSpan="2">Render Playback</td>
<td>No Echo</td>
<td>No audio playback from device</td>
<td>Playback 0 dBA</td>
</tr>
<tr>
<td>Echo</td>
<td>Listening to music, podcasts</td>
<td>Playback ≥ 67 dBA</td>
</tr>
<tr>
<td RowSpan="3">Talkers</td>
<td>Single Talker</td>
<td>Single user from a fixed position</td>
<td>Fixed Distance/Angle</td>
</tr>
<tr>
<td>Multiple Talkers</td>
<td>Multiple users</td>
<td>Multiple Sources</td>
</tr>
<tr>
<td>Distractor</td>
<td>Multiple Sources</td>
<td>Single source ≥ 1m away</td>
</tr>
</table>