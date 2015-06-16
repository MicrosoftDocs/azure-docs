<table cellspacing="0" border="1">
<tr>
   <th align="left" valign="middle">Resource</th>
   <th align="left" valign="middle">Default Limit</th>
   <th align="left" valign="middle">Maximum Limit</th>
</tr>
<tr>
   <td valign="middle"><p><a href="http://azure.microsoft.com/documentation/services/virtual-machines/">Virtual machines</a> per cloud service<sup>1</sup></p></td>
   <td valign="middle"><p>50</p></td>
   <td valign="middle"><p>50</p></td>
</tr>
<tr>
   <td valign="middle"><p>Input Endpoints per cloud service<sup>2</sup></p></td>
   <td valign="middle"><p>150</p></td>
   <td valign="middle"><p>150</p></td>
</tr>
</table>

<sup>1</sup>When you create a virtual machine outside of an Azure Resource Group, a cloud service is automatically created to contain the machine. You can then add multiple virtual machines in that same Cloud Service.

<sup>2</sup>Input endpoints are used to allow communication to the virtual machines that is external to the containing cloud service. Virtual machines within the same cloud service automatically allow communication between all UDP and TCP ports for internal communication.
