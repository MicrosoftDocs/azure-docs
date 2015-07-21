<table cellspacing="0" border="1">
<tr>
   <th align="left" valign="middle">Resource</th>
   <th align="left" valign="middle">Default Limit</th>
   <th align="left" valign="middle">Maximum Limit</th>
</tr>
<tr>
   <td valign="middle"><p>Azure Media Services (AMS) accounts in a single subscription</p></td>
   <td valign="middle"><p></p></td>
   <td valign="middle"><p>25</p></td>
</tr>
<tr>
   <td valign="middle"><p>Assets per AMS account</p></td>
   <td valign="middle"><p></p></td>
   <td valign="middle"><p>1,000,000</p></td>
</tr>
<tr>
   <td valign="middle"><p>Chained tasks per job</p></td>
   <td valign="middle"><p></p></td>
   <td valign="middle"><p>30</p></td>
</tr>
<tr>
   <td valign="middle"><p>Assets per task</p></td>
   <td valign="middle"><p></p></td>
   <td valign="middle"><p>50</p></td>
</tr>
<tr>
   <td valign="middle"><p>Assets per job</p></td>
   <td valign="middle"><p></p></td>
   <td valign="middle"><p>100</p></td>
</tr>
<tr>
   <td valign="middle"><p>Jobs per AMS account </p></td>
   <td valign="middle"><p></p></td>
   <td valign="middle"><p>50,000<sup>2</sup></p></td>
</tr>
<tr>
   <td valign="middle"><p>Unique locators associated with an asset at one time</p></td>
   <td valign="middle"><p></p></td>
   <td valign="middle"><p>5<sup>4</sup></p></td>
</tr>
<tr>
   <td valign="middle"><p>Live channels per AMS account </p></td>
   <td valign="middle"><p>5</p></td>
   <td valign="middle"><p>N/A<sup>1</sup></p></td>
</tr>
<tr>
   <td valign="middle"><p>Programs in stopped state per channel </p></td>
   <td valign="middle"><p>50</p></td>
   <td valign="middle"><p>N/A<sup>1</sup></p></td>
</tr><tr>
   <td valign="middle"><p>Programs in running state per channel </p></td>
   <td valign="middle"><p>3</p></td>
   <td valign="middle"><p>N/A<sup>1</sup></p></td>
</tr><tr>
   <td valign="middle"><p>Streaming endpoints in running state per AMS account</p></td>
   <td valign="middle"><p>2</p></td>
   <td valign="middle"><p>N/A<sup>1</sup></p></td>
</tr>
<tr>
   <td valign="middle"><p>Streaming units per streaming endpoint </p></td>
   <td valign="middle"><p>10 </p></td>
   <td valign="middle"><p>N/A<sup>1</sup></p></td>
</tr>
<tr>
   <td valign="middle"><p>Encoding units per AMS account </p></td>
   <td valign="middle"><p>25</p></td>
   <td valign="middle"><p>N/A<sup>1</sup></p></td>
</tr>
</table>

<sup>1</sup> You can request to update the limits for this quota by opening a support ticket. Do not create more AMS accounts to increase limits, instead submit a support ticket.

<sup>2</sup> This number includes queued, finished, active, and canceled jobs. It does not include deleted jobs. You can delete the old jobs using **IJob.Delete** or the **DELETE** HTTP request.

<sup>3</sup> When making a request to list Job entities, a maximum of 1,000 will be returned per request. If you need to keep track of all submitted Jobs, you can use top/skip as described in [OData system query options](http://msdn.microsoft.com/library/gg309461.aspx).

<sup>4</sup> Locators are not designed for managing per-user access control. To give different access rights to individual users, use Digital Rights Management (DRM) solutions.



