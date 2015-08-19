
<properties 
    pageTitle="Troubleshoot creating RemoteApp hybrid collections"
    description="Learn how to troubleshoot RemoteApp hybrid collection creation failures" 
    services="remoteapp" 
    documentationCenter="" 
    authors="vkbucha" 
    manager="mbaldwin" />

<tags 
    ms.service="remoteapp" 
    ms.workload="compute" 
    ms.tgt_pltfrm="na" 
    ms.devlang="na" 
    ms.topic="article" 
    ms.date="08/12/2015" 
    ms.author="elizapo" />



# Troubleshoot creating Azure RemoteApp hybrid collections

A hybrid collection is hosted in and stores data in the Azure cloud but also lets users access data and resources stored on your local network. Users can access apps by logging in with their corporate credentials synchronized or federated with Azure Active Directory. You can deploy a hybrid collection that uses an existing Azure Virtual Network, or you can create a new virtual network. We recommend that you create or use a virtual network subnet with a CIDR range large enough for expected future growth for Azure RemoteApp.

Haven't created your collection yet? See [Create a hybrid collection](remoteapp-create-hybrid-deployment.md) for the steps.

If you are having trouble creating your collection, or if the collection isn't working the way you think it should, check out the following information.

## Does your VNET use forced tunneling? ##
RemoteApp does not currently support using VNETs that have forced tunneling enabled. If you need this function, contact the [RemoteApp team](mailto:remoteappforum@microsoft.com) to request support.

After your request is approved, make sure the following ports are opened on the subnet you chose for Azure RemoteApp and the VMs in the subnet. The VMs in your subnets should also be able to access the URLs mentioned in the section about network security groups.

Outbound: TCP: 443, TCP: 10101-10175

## Does your VNET have network security groups defined? ##
If you have network security groups defined on the subnet you are using for your collection, make sure the following URLs are accessible from within your subnet: 

	https://management.remoteapp.windowsazure.com  
	https://opsapi.mohoro.com  
	https://telemetry.remoteapp.windowsazure.com  
	https://*.remoteapp.windowsazure.com  
	https://login.windows.net (if you have Active Directory)  
	https://login.microsoftonline.com  
	Azure storage *.remoteapp.windowsazure.com  
	*.core.windows.net  
	https://www.remoteapp.windowsazure.com  
	https://www.remoteapp.windowsazure.com  

Open the following ports on the virtual network subnet:

Inbound - TCP: 3030, TCP: 443  
OUtbound - TCP: 443  

You can add additional network security groups to the VMs deployed by you in the subnet for tighter control.

## Are you using your own DNS servers? And are they accessible from your VNET subnet? ##
For hybrid collections you use your own DNS servers. You specify them in your network configuration schema or through the management portal when you create your virtual network. DNS servers are used in the order that they are specified in a failover manner (as opposed to round robin).  

Make sure the DNS servers for your collection are accessible and available from the VNET subnet you specified for this collection.

For example:

	<VirtualNetworkConfiguration>
    <Dns>
      <DnsServers>
        <DnsServer name="" IPAddress=""/>
      </DnsServers>
    </Dns>
	</VirtualNetworkConfiguration>

![Define your DNS](./media/remoteapp-hybridtrouble/dnsvpn.png)

## Are you using an Active Directory domain controller in your collection? ##
Currently only one Active Directory domain can be associated with Azure RemoteApp. The hybrid collection supports only Azure Active Directory accounts that have been synced using DirSync tool from a Windows Server Active Directory deployment; specifically, either synced with the Password Synchronization option or synced with Active Directory Federation Services (AD FS) federation configured. You need to create a custom domain that matches the UPN domain suffix for your on-premises domain and set up directory integration. 

See [Configuring Active Directory for Azure RemoteApp](remoteapp-ad.md) for more information.

Make sure the domain details provided are valid and the domain controller is reachable from the VM created in the subnet used for Azure Remote App. Also make sure the service account credentials supplied have permissions to add computers to the provided domain and that the AD name provided can be resolved from the DNS provided in the VNET.

## What domain name did you specify when you created your collection? ##

The domain name you created or added must be an internal domain name (not your Azure AD domain name) and must be in resolvable DNS format (contoso.local). For example, you have an Active Directory internal name (contoso.local) and an Active Directory UPN (contoso.com) - you have to use the internal name when you create your collection.
