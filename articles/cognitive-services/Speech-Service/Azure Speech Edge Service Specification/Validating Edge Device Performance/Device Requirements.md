All devices are required to test SR performance for EN-US under each scenario described in the relevant device category.  The key performance indicators are:

**Speech Accuracy %(SA)**:  The accuracy of all transcribed speech vs. a ground truth of words “spoken” to a device.
**Voice Activation %(CA)**:  The correct acceptance ratio for keywords vs. a ground truth

For devices implementing a custom (non-Microsoft) KWS, the KWS platform provider is required to additionally test Voice Activation in each supported locale, as well as False Acceptance (FA).

## Device Requirements

#### Head Mounted Device(***s***)
<table border="1">
<tr>
<th align="left">Talkers</th>
<th align="left">Scenario</th>
<th align="left"> Ambient Noise,dBA</th>
<th align="left">Echo Level, dBA @DRP*</th>
<th align="left"><font color="sky blue" >Speech Accuracy%</font></th>
<th align="left"><font color="sky blue" >Voice Activation%%</font></th>
</tr>
<tr>
<td RowSpan="4">Adult Male,<br> Adult Female,<br> Children <br>
<b>89 dBA @ MRP</b></td>
<td>Quite</td>
<td>-</td>
<td>-</td>
<td><b>95%</b></td>
<td><b>90%</b></td>
</tr>
<tr>
<td>Echo</td>
<td>-</td>
<td>80 (stereo)<br> 86 (mono)</td>
<td><b>90%</b></td>
<td><b>90%</b></td>
</tr>
<tr>
<td>Noise(Medium)</td>
<td>57</td>
<td>-</td>
<td><b>90%</b></td>
<td><b>90%</b></td>
</tr>
<tr>
<td>Noise(Loud)</td>
<td>70</td>
<td>-</td>
<td><b>85%</b></td>
<td><b>90%</b></td>
</tr>
</table>

> *** *DRP: Drum Reference Point of HATS, i.e. no filtering is required to be applied when calibrating the echo level.***

#### Near Field Devices
<table border="1">
<tr>
<th align="left">Talkers</th>
<th align="left">Scenario</th>
<th align="left"> Ambient Noise,dBA</th>
<th align="left">Echo Level, dBA @DRP*</th>
<th align="left"><font color="sky blue" >Speech Accuracy%</font></th>
<th align="left"><font color="sky blue" >Voice Activation%%</font></th>
</tr>
<tr>
<td RowSpan="3">Adult Male,<br> Adult Female,<br> Children <br>
<b>89 dBA @ MRP</b></td>
<td>Quite</td>
<td>-</td>
<td>-</td>
<td><b>95%</b></td>
<td><b>90%</b></td>
</tr>
<tr>
<td>Echo</td>
<td>-</td>
<td>67*</td>
<td><b>90%</b></td>
<td><b>90%</b></td>
</tr>
<tr>
<td>Noise(Medium)</td>
<td>57</td>
<td>-</td>
<td><b>90%</b></td>
<td><b>90%</b></td>
</tr>
</table>

> *** *Near Field devices may substitute the maximum volume setting for this test, provided level is ≥ 61 dBA***

#### Far Field Devices
<table border="1">
<tr>
<th align="left">Talkers</th>
<th align="left">Scenario</th>
<th align="left"> Ambient Noise,dBA</th>
<th align="left">Echo Level, dBA @DRP*</th>
<th align="left"><font color="sky blue" >Speech Accuracy%</font></th>
<th align="left"><font color="sky blue" >Voice Activation%%</font></th>
</tr>
<tr>
<td RowSpan="3">Adult Male,<br> Adult Female,<br> Children <br>
<b>89 dBA @ MRP</b></td>
<td>Quite</td>
<td>-</td>
<td>-</td>
<td><b>95%</b></td>
<td><b>90%</b></td>
</tr>
<tr>
<td>Echo</td>
<td>-</td>
<td>70</td>
<td><b>90%</b></td>
<td><b>90%</b></td>
</tr>
<tr>
<td>Noise(Medium)</td>
<td>57</td>
<td>-</td>
<td><b>90%</b></td>
<td><b>90%</b></td>
</tr>
</table>

#### Far Field 360° Devices
<table border="1">
<tr>
<th align="left">Talkers</th>
<th align="left">Scenario</th>
<th align="left"> Ambient Noise,dBA</th>
<th align="left">Echo Level, dBA @DRP*</th>
<th align="left"><font color="sky blue" >Speech Accuracy%</font></th>
<th align="left"><font color="sky blue" >Voice Activation%%</font></th>
</tr>
<tr>
<td RowSpan="5">Adult Male,<br> Adult Female,<br> Children <br>
<b>89 dBA @ MRP</b></td>
<td>Quite</td>
<td>-</td>
<td>-</td>
<td><b>95%</b></td>
<td><b>90%</b></td>
</tr>
<tr>
<td>Echo</td>
<td>-</td>
<td>73</td>
<td><b>90%</b></td>
<td><b>90%</b></td>
</tr>
<tr>
<td>Noise(Medium)</td>
<td>60</td>
<td>-</td>
<td><b>90%</b></td>
<td><b>90%</b></td>
</tr>
<tr>
<td>Quiet 
Multi-Talker
</td>
<td>-</td>
<td>-</td>
<td><b>90%</b></td>
<td><b>90%</b></td>
</tr>
<tr>
<td>Multi-Talker in Noise</td>
<td>60</td>
<td>-</td>
<td><b>90%</b></td>
<td><b>90%</b></td>
</tr>
</table>