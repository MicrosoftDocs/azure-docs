
<properties 
    pageTitle="Troubleshoot cloud collections - creation"
    description="Learn how to troubleshoot RemoteApp cloud collection creation failures" 
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



# Troubleshoot cloud collections - creation

Common errors seen in the Azure Management portal:

	DNS server could not be reached
	ProvisioningTimeout

Cloud collections often fail during creation because of you are using custom images.  If you see one of the above errors and you are using a custom image to create the collection, please check the following things:

- Ensure that the custom image you uploaded meets image requirements. 
- Most often the common problem is that the image was not properly syspreped.  
- Verify the image can boot within Hyper-V or try creating an IAAS VM directly in your Azure subscription using the image. If the VM fails to boot and not start, then this usually indicates that the custom image was not prepared correctly.  Verify the custom image was built following the How to create a custom template image for RemoteApp

If you are using one of the Microsoft images included with your subscription, try to create the collection again. If the issue persists then please contact Microsoft support.

	PlatformImageTrialModeOnly

If you see this error this usually means that you been upgraded to a paid account but you are trying to use a Microsoft provided image that is valid only during the trial mode of the service. In this case, try to create your cloud collection again, but be sure to specify the correct image.
