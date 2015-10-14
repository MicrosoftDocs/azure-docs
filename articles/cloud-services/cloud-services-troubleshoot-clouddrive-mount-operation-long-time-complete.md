<properties 
   pageTitle="CloudDrive Mount operation takes too long | Microsoft Azure"
   description=""
   services="cloud-services"
   documentationCenter=""
   authors="Thraka"
   manager="msmets"
   editor=""
   tags="top-support-issue"/>
<tags 
   ms.service="cloud-services"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="tbd"
   ms.date="10/14/2015"
   ms.author="jarrettr" />

# The CloudDrive mount operation takes a long time to complete

When you call the Mount method to mount a drive containing very large numbers of files, the mount operation takes longer than expected to complete or times out.

## Contact Azure Customer Support

If you need more help at any point in this article, you can contact the Azure experts on [the MSDN Azure and the Stack Overflow forums](http://azure.microsoft.com/support/forums/).

Alternatively, you can also file an Azure support incident. Go to the [Azure Support site](http://azure.microsoft.com/support/options/) and click on **Get Support**. For information about using Azure Support, read the [Microsoft Azure Support FAQ](http://azure.microsoft.com/support/faq/).

## Cause
The problem is caused by a known issue that occurs when the drive being mounted contains hundreds of thousands or even millions of files. The majority of the time taken performing the Mount operation is spent updating the Access Control Lists (ACLs) on all of the drive's files. The API attempts to change these ACLs on the root of the drive so that lower privileged roles, such as web and worker roles, will be able to access the contents of the drive after it is mounted. However, the default settings for ACLs on an NTFS file system is to inherit the ACLs from the parent, so these ACL changes are then propagated to all files on the drive.

## Resolution
To resolve this issue and greatly lessen the time taken by the Mount operation, you need to turn off automatic ACL inheritance for the operation. To break the ACL inheritance chain, mount the drive, open a command shell, and then run the following commands, replacing "z:" with the letter of the mounted drive:

	z:
	cd \
	icacls.exe * /inheritance:d


icacls.exe will print out a list of files and directories it is processing, followed by some statistics:

	processed file: examplefile1
	processed file: examplefile2
	Successfully processed 2 files; Failed processing 0 files

Finally, you should unmount the drive. Subsequent calls to Mount should be performed much faster.

## Next steps

View more [troubleshooting articles](..\?tag=top-support-issue&service=cloud-services) for cloud services.

