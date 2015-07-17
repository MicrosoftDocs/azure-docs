<table cellspacing="0" border="1">
<tr>
   <th align="left" valign="middle">Resource</th>
   <th align="left" valign="middle">Default Limit</th>
</tr>
<tr>
   <td valign="middle"><p>Database size</p></td>
   <td valign="middle"><p>Depends on performance level <sup>1</sup></p></td>
</tr>
<tr>
   <td valign="middle"><p>Logins</p></td>
   <td valign="middle"><p>Depends on performance level <sup>1</sup></p></td>
</tr>
<tr>
   <td valign="middle"><p>Memory usage</p></td>
   <td valign="middle"><p>16 MB memory grant for more than 20 seconds</p></td>
</tr>
<tr>
   <td valign="middle"><p>Sessions</p></td>
   <td valign="middle"><p>Depends on performance level <sup>1</sup></p></td>
</tr>
<tr>
   <td valign="middle"><p>Tempdb size</p></td>
   <td valign="middle"><p>5 GB</p></td>
</tr>
<tr>
   <td valign="middle"><p>Transaction duration</p></td>
   <td valign="middle"><p>24 hours<sup>2</sup></p></td>
</tr>
<tr>
   <td valign="middle"><p>Locks per transaction</p></td>
   <td valign="middle"><p>1 million</p></td>
</tr>
<tr>
   <td valign="middle"><p>Size per transaction</p></td>
   <td valign="middle"><p>2 GB</p></td>
</tr>
<tr>
   <td valign="middle"><p>Percent of total log space used per transaction</p></td>
   <td valign="middle"><p>20%</p></td>
</tr>
<tr>
   <td valign="middle"><p>Max concurrent requests (worker threads)</p></td>
   <td valign="middle"><p>Depends on performance level <sup>1</sup></p></td>
</tr>
</table>

<sup>1</sup>SQL Database has performance tiers, such as Basic, Standard, and Premium. Standard and Premium are also divided into performance levels. For detailed limits per tier and service level, see [Azure SQL Database Service Tiers and Performance Levels](https://msdn.microsoft.com/library/azure/dn741336.aspx).

<sup>2</sup>If the transaction locks a resource required by an underlying system task, then the max duration is 20 seconds.