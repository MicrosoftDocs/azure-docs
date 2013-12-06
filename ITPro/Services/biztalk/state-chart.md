<properties linkid="" urlDisplayName="" pageTitle="" metaKeywords="" description="" metaCanonical="" services="" documentationCenter="" title="BizTalk Services: BizTalk Service State Chart" authors=""  solutions="" writer="mandia" manager="paulettm" editor="cgronlun"  />



# BizTalk Services: BizTalk Service State Chart
Depending on the current state of the BizTalk Service, there are operations that you can or cannot perform on the BizTalk Service.

For example, you provision a new BizTalk Service in the Windows Azure Management Portal. When it completes successfully, the BizTalk Service is in Active state. In the Active State, you can Stop the BizTalk Service. If Stop is successful, the BizTalk Service goes to a Stopped state. If Stop fails, the BizTalk Service goes to a StopFailed state. In the StopFailed state, you can Restart the BizTalk Service. If you try an Operation that is not allowed, like Resume the BizTalk Service, the following error occurs:

**Operation not allowed**

To provision a BizTalk Service, refer to [BizTalk Services: Provisioning Using Windows Azure Management Portal](http://go.microsoft.com/fwlink/p/?LinkID=302280).

The following tables list the Operations that can be performed when the BizTalk Service is in a specific state. A check mark means the operation can be performed while in that state. A blank entry means the operation cannot be performed while in that state.

#### Start, Stop, Restart, Suspend, Resume, and Delete Operations
<table border="1">
<tr>
        <th colspan="15">Operation</th>
</tr>

<tr>
        <th rowspan="18">BizTalk Service State</th>
</tr>
<tr bgcolor="FAF9F9">
        <th> </th>
        <th>Start</th>
        <th>Stop</th>
        <th>Restart</th>
        <th>Suspend</th>
        <th>Resume</th>
        <th>Delete</th>
</tr>
<tr>
<td bgcolor="FAF9F9"><b>Active</b></td>
<td> </td>
<td><center>√</center></td>
<td><center>√</center></td>
<td><center>√</center></td>
<td> </td>
<td><center>√</center></td>
</tr>
<tr>
<td bgcolor="FAF9F9"><b>Disabled</b></td>
<td> </td>
<td> </td>
<td> </td>
<td> </td>
<td> </td>
<td><center>√</center></td>
</tr>
<tr>
<td bgcolor="FAF9F9"><b>Suspended</b></td>
<td> </td>
<td> </td>
<td> </td>
<td> </td>
<td><center>√</center></td>
<td><center>√</center></td>
</tr>
<tr>
<td bgcolor="FAF9F9"><b>Stopped</b></td>
<td><center>√</center></td>
<td> </td>
<td><center>√</center></td>
<td> </td>
<td> </td>
<td><center>√</center></td>
</tr>
<tr>
<td bgcolor="FAF9F9"><b>Service Update Failed</b></td>
<td> </td>
<td> </td>
<td> </td>
<td> </td>
<td> </td>
<td><center>√</center></td>
</tr>
<tr>
<td bgcolor="FAF9F9"><b>DisableFailed</b></td>
<td> </td>
<td> </td>
<td> </td>
<td> </td>
<td> </td>
<td><center>√</center></td>
</tr>
<tr>
<td bgcolor="FAF9F9"><b>EnableFailed</b></td>
<td> </td>
<td> </td>
<td> </td>
<td> </td>
<td> </td>
<td><center>√</center></td>
</tr>
<tr>
<td bgcolor="FAF9F9"><b>StartFailed<br/>
StopFailed<br/>
RestartFailed</b></td>
<td><center>√</center></td>
<td><center>√</center></td>
<td><center>√</center></td>
<td> </td>
<td> </td>
<td><center>√</center></td>
</tr>
<tr>
<td bgcolor="FAF9F9"><b>SuspendedFailed<br/>
ResumeFailed</b></td>
<td> </td>
<td> </td>
<td> </td>
<td><center>√</center></td>
<td><center>√</center></td>
<td><center>√</center></td>
</tr>
<tr>
<td bgcolor="FAF9F9"><b>CreatedFailed<br/>
RestoreFailed<br/></b></td>
<td> </td>
<td> </td>
<td> </td>
<td> </td>
<td> </td>
<td><center>√</center></td>
</tr>
<tr>
<td bgcolor="FAF9F9"><b>ConfigUpdateFailed</b></td>
<td> </td>
<td> </td>
<td><center>√</center></td>
<td> </td>
<td> </td>
<td><center>√</center></td>
</tr>
<tr>
<td bgcolor="FAF9F9"><b>ScaleFailed</b></td>
<td> </td>
<td> </td>
<td> </td>
<td> </td>
<td> </td>
<td><center>√</center></td>
</tr>
</table>
<br/>

####Scale, Update Configuration, and Backup Operations
<table border="1">
<tr>
        <th colspan="15">Operation</th>
</tr>

<tr>
        <th rowspan="18">BizTalk Service State</th>
</tr>
<tr bgcolor="FAF9F9">
        <th> </th>
        <th>Scale</th>
        <th>Update Configuration</th>
        <th>Backup</th>
</tr>
<tr>
<td bgcolor="FAF9F9"><b>Active</b></td>
<td><center>√</center></td>
<td><center>√</center></td>
<td><center>√</center></td>
</tr>
<tr>
<td bgcolor="FAF9F9"><b>Disabled</b></td>
<td> </td>
<td> </td>
<td> </td>
</tr>
<tr>
<td bgcolor="FAF9F9"><b>Suspended</b></td>
<td> </td>
<td> </td>
<td><center>√</center></td>
</tr>
<tr>
<td bgcolor="FAF9F9"><b>Stopped</b></td>
<td> </td>
<td> </td>
<td><center>√</center></td>
</tr>
<tr>
<td bgcolor="FAF9F9"><b>Service Update Failed</b></td>
<td> </td>
<td> </td>
<td> </td>
</tr>
<tr>
<td bgcolor="FAF9F9"><b>DisableFailed</b></td>
<td> </td>
<td> </td>
<td> </td>
</tr>
<tr>
<td bgcolor="FAF9F9"><b>EnableFailed</b></td>
<td> </td>
<td> </td>
<td> </td>
</tr>
<tr>
<td bgcolor="FAF9F9"><b>StartFailed<br/>
StopFailed<br/>
RestartFailed</b></td>
<td> </td>
<td><center>√</center></td>
<td> </td>
</tr>
<tr>
<td bgcolor="FAF9F9"><b>SuspendedFailed<br/>
ResumeFailed</b></td>
<td> </td>
<td> </td>
<td> </td>
</tr>
<tr>
<td bgcolor="FAF9F9"><b>CreatedFailed<br/>
RestoreFailed<br/></b></td>
<td> </td>
<td> </td>
<td> </td>
</tr>
<tr>
<td bgcolor="FAF9F9"><b>ConfigUpdateFailed</b></td>
<td> </td>
<td><center>√</center></td>
<td> </td>
</tr>
<tr>
<td bgcolor="FAF9F9"><b>ScaleFailed</b></td>
<td><center>√</center></td>
<td> </td>
<td> </td>
</tr>
</table>

## See Also
- [BizTalk Services: Provisioning Using Windows Azure Management Portal](http://go.microsoft.com/fwlink/p/?LinkID=302280)<br/>
- [BizTalk Services: Dashboard, Monitor and Scale tabs](http://go.microsoft.com/fwlink/p/?LinkID=302281)<br/>
- [BizTalk Services: Developer, Basic, Standard and Premium Editions Chart](http://go.microsoft.com/fwlink/p/?LinkID=302279)<br/>
- [BizTalk Services: Backup and Restore](http://go.microsoft.com/fwlink/p/?LinkID=329873)<br/>
- [BizTalk Services: Throttling](http://go.microsoft.com/fwlink/p/?LinkID=302282)<br/>
- [BizTalk Services: Issuer Name and Issuer Key](http://go.microsoft.com/fwlink/p/?LinkID=303941)<br/>
- [How do I Start Using the Windows Azure BizTalk Services SDK](http://go.microsoft.com/fwlink/p/?LinkID=302335)

[CheckMark]: ../Media/CheckMark.png