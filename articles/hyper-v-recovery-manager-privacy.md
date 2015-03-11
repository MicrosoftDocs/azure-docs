<properties 
	pageTitle="Privacy information for Azure Site Recovery" 
	description="Describes additional privacy information for Azure Site Recovery" 
	services="site-recovery" 
	documentationCenter="" 
	authors="raynew" 
	manager="jwhit" 
	editor="tysonn"/>

<tags 
	ms.service="site-recovery" 
	ms.workload="backup-recovery" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/19/2015" 
	ms.author="raynew"/>

# Privacy information for Azure Site Recovery

This table provides additional privacy information for the Microsoft Azure Site Recovery service (“Service”). To view the privacy statement for Microsoft Azure services, see the
[Microsoft Azure Privacy Statement](http://go.microsoft.com/fwlink/?LinkId=324899)

<table>
<thead>
<tr>
	<th>Feature</th>
	<th>What it does</th>
	<th>Information collected</th>
	<th>Use</th>
	<th>Choice</th>
</tr>
</thead>
<tbody>
<tr>
	<td><p><b>Registration</b></p></td>
	<td><p>Register server with service so that virtual machines can be protected</p></td>
	<td><p>After registering a service the Service collects process and transmits this information:</p>
		<ul>
			<li>Management certificate information from the VMM server that’s designated to provide disaster recovery using the Service name of the VMM server</li>
			<li>The name of virtual machine clouds on your VMM server</li>
		</ul>
</td>
	<td><p>The Service uses the above information as follows:</p>
		<ul>
			<li>Management certificate—This is used to help identify and authenticate the registered VMM server for access to the Service. The Service uses the public key portion of the certificate to secure a token that only the registered VMM server can gain access to. The server needs to use this token to gain access to the Service features.</li>
			<li>Name of the VMM server—The VMM server name is required to identify and communicate with the appropriate VMM server on which the clouds are located. 
			</li>
			<li>Cloud names from the VMM server—The cloud name is required when using the Service cloud pairing/unpairing feature described below. When you decide to pair your cloud from a primary data center with another cloud in the recovery data center, the names of all the clouds from the recovery data center are presented.</li>
		</ul>
</td>
	<td><p>This information is an essential part of the Service registration process because it helps you and the Service to identify the VMM server for which you want to provide Azure Site Recovery protection, as well as to identify the correct registered VMM server. If you don’t want to send this information to the Service, do not use this Service. If you register your server and then later want to unregister it, you can do so by deleting the VMM server information from the Service portal (which is the Azure portal).</p></td>
</tr>

<tr>
	<td><p><b>Enable Azure Site Recovery protection</b></p></td>
	<td><p>The Azure Site Recovery Provider installed on the VMM server is the conduit for communicating with the Service. The Provider is a dynamic-link library (DLL) hosted in the VMM process. After the Provider is installed, the “Datacenter Recovery” feature gets enabled in the VMM administrator console. Any new or existing virtual machines in a cloud can enable a property called “Datacenter Recovery” to help protect the virtual machine. Once this property is set, the Provider sends the name and ID of the virtual machine to the Service. The virtual protection is enabled by Windows Server 2012 or Windows Server 2012 R2 Hyper-V replication technology. The virtual machine data gets replicated from one Hyper-V host to another (typically located in a different “recovery” data center).</p></td>
	<td><p>The Service collects, processes, and transmits metadata for the virtual machine, which includes the name, ID, virtual network, and the name of the cloud to which it belongs.</p>
	</td>
	<td><p>The Service uses the above information to populate the virtual machine information on your Service portal.</p>
	</td>
	<td><p>This is an essential part of the service and can’t be turned off. If you don’t want this information sent to the Service, don’t enable Azure Site Recovery protection for any virtual machines. Note that all data sent by the Provider to the Service is sent over HTTPS.</p></td>
</tr>
<tr>
	<td><p><b>Recovery plan</b></p></td>
	<td><p>This feature helps you to build an orchestration plan for the “recovery” data center. You can define the order in which the virtual machines or a group of virtual machines should be started at the recovery site. You can also specify any automated scripts to be run, or any manual action to be taken, at the time of recovery for each virtual machine. Failover (covered in the next section) is typically triggered at the Recovery Plan level for coordinated recovery.</p></td>
	<td><p>Service collects process and transmits this information as part of the recovery plan feature:</p>
		<ul>
			<li>Recovery plan, including virtual machine metadata</li>
			<li>Metadata of the automation script or the manual action note.</li>
		</ul>
	</td>
	<td><p>The metadata described above is used to build the recovery plan in your Service portal.</p>
	</td>
	<td><p>This is an essential part of the service and can’t be turned off. If you don’t want this information sent to the Service, don’t build Recovery Plans in this Service.</p></td>
</tr>
<tr>
	<td><p><b>Network mapping</b></p></td>
	<td><p>This feature allows you to map network information from the primary data center to the recovery data center. When the virtual machines are recovered on the recovery site, this mapping helps in establishing network connectivity for them.</p></td>
	<td><p>As part of the network mapping feature, the Service collects, processes, and transmits the metadata of the logical networks for each site (primary and datacenter).</p>
	</td>
	<td><p>The Service uses the metadata to populate your Service portal where you can map the network information.</p>
	</td>
	<td><p>This is an essential part of the Service and can’t be turned off. If you don’t want this information sent to the Service, don’t use the network mapping feature.</p></td>
</tr>
<tr>
	<td><p><b>Failed - planned, unplanned, text</b></p></td>
	<td><p>This feature helps failover of a virtual machine from one VMM managed data center to another VMM managed data center. The failover action is triggered by the user on their Service portal. Possible reasons for a failover include an unplalled event (for example in the case of a natural disaster0; a planned event (for example datacenter load balancing); a test failover (for example a recovery plan rehearsal).</p>
	<p>The Provider on the VMM server gets notified of the event from the Service, and executes a failover action on the Hyper-V host through VMM interfaces. Actual failover of the virtual machine from one Hyper-V host to another (typically running in a different “recovery” data center) is handled by the Windows Server 2012 or Windows Server 2012 R2 Hyper-V replication technology. After the failover is complete, the Provider installed on the VMM server of the “recovery” data center sends the success information to the Service.</p>
	</td>
	<td><p>The Service uses the above information to populate the status of the failover action information on your Service portal.</p>
	</td>
	<td><p>The Service uses the above information as follows:</p>
		<ul>
			<li>Management certificate—This is used to help identify and authenticate the registered VMM server for access to the Service. The Service uses the public key portion of the certificate to secure a token that only the registered VMM server can gain access to. The server needs to use this token to gain access to the Service features.</li>
			<li>Name of the VMM server—The VMM server name is required to identify and communicate with the appropriate VMM server on which the clouds are located. 
			</li>
			<li>Cloud names from the VMM server—The cloud name is required when using the Service cloud pairing/unpairing feature described below. When you decide to pair your cloud from a primary data center with another cloud in the recovery data center, the names of all the clouds from the recovery data center are presented.</li>
		</ul>
	</td>
	<td><p>This is an essential part of the service and can’t be turned off. If you don’t want this information sent to the Service, don’t use this Service.</p></td>
</tr>
</table>


