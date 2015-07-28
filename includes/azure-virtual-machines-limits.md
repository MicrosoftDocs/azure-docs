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
   <td valign="middle"><p>Input endpoints per cloud service<sup>2</sup></p></td>
   <td valign="middle"><p>150</p></td>
   <td valign="middle"><p>150</p></td>
</tr>
</table>

<sup>1</sup>Virtual machines created in Service Management (instead of Resource Manager) are automatically stored in a cloud service. You can add more virtual machines to that cloud service for load balancing and availability. See  [How to Connect Virtual Machines with a Virtual Network or Cloud Service](../virtual-machines/cloud-services-connect-virtual-machine.md).

<sup>2</sup>Input endpoints allow communications to a virtual machine from outside the virtual machine's cloud service. Virtual machines in the same cloud service or virtual network can automatically communicate with each other. See [How to Set Up Endpoints to a Virtual Machine](../virtual-machines/virtual-machines-set-up-endpoints.md).
