
<properties 
    pageTitle="Troubleshoot hybrid collections - creation"
    description="Learn how to troubleshoot RemoteApp hybrid collection creation failures" 
    services="remoteapp" 
    solutions="" documentationCenter="" 
    authors="vkbucha" 
    manager="mbaldwin" />

<tags 
    ms.service="remoteapp" 
    ms.workload="tbd" 
    ms.tgt_pltfrm="na" 
    ms.devlang="na" 
    ms.topic="article" 
    ms.date="02/20/2015" 
    ms.author="vikbucha" />



# Troubleshoot hybrid collections - creation

Before you can troubleshoot failures during hybrid collection creation, it helps to understand how hybrid collections are created. A hybrid collection requires that RemoteApp instances are domain joined – you do this during collection creation.  When the collection creation process starts, copies of the template images you uploaded are created in the VNET and are domain joined through the Site-to-Site VPN tunnel to the domain that is resolved by the DNS IP record specified during VNET creation.

Common errors seen in the Azure Management portal:

	DNS server could not be reached

	Could not join the domain. Unable to reach the domain.

If you see one of the above errors, please check the following things:

- Verify the DNS IP configurations are valid
- Ensure that the DNS IP records are either public IP records or are part of the “local address space” you specified during VNET creation
- Verify the VNET tunnel to ensure it is active or connected state 
- Ensure the on-premises side of the VPN connection is not blocking network traffic. You can check that by looking at the logs of your local VPN device or software.
- Ensure that the domain you specified during collection creation is up and running.

	ProvisioningTimeout


If you see this error, please check the following things:

- Ensure the on-premises side of the VPN connection is not blocking network traffic. You can check that by looking at the logs of your local VPN device or software.
- Ensure that the RemoteApp template image you uploaded was properly syspreped. You can check the RemoteApp image requirements here: http://azure.microsoft.com/documentation/articles/remoteapp-create-custom-image/ 
- Please try to create a VM using the template image you uploaded and ensure that it boots up and runs fine either (a) on a local Hyper-V server (b) by creating an Azure IAAS VM in your Azure subscription. If the VM fails to get created or does not start, then this usually indicates that the template image was not prepared correctly and you would have to fix it.

	DomainJoinFailed_InvalidUserNameOrPassword

	DomainJoinFailed_InvalidParameter

If you see one of the above errors, please check the following things:

- Verify the credentials entered for domain join are valid
- Verify the domain join credentials are correct or has appropriate domain join permissions
- Verify the Organization Unit (OU) is formatted properly and does exist in the Active directory.