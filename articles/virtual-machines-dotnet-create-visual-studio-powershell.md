<properties urlDisplayName="Create a virtual machine for a website" pageTitle="Creating a virtual machine for a web project using Visual Studio" metaKeywords="Visual Studio, ASP.NET, web project, virtual machine" description="Create a virtual machine for a website" metaCanonical="" services="" documentationCenter="" title="Creating a virtual machine for a website with Visual Studio" authors="ghogen" solutions="" manager="douge" editor="" />

<tags ms.service="virtual-machines" ms.workload="infrastructure-services" ms.tgt_pltfrm="vm-multiple" ms.devlang="dotnet" ms.topic="article" ms.date="09/24/2014" ms.author="ghogen" />

# Creating a virtual machine for a website with Visual Studio

When you create a web project for an Azure website, you can provision a virtual machine in Azure. You can then configure the virtual machine with additional software, or use the virtual machine for diagnostic or debugging purposes.

To create a virtual machine when you create a website, follow these steps:

1. In Visual Studio, choose **File**, **New Project**, choose **Web**, and then choose **ASP.NET Web Application**.
2. In the **New ASP.NET Project** dialog box, select the type of web application you want, and in the Azure section of the dialog box (in the lower-right corner), make sure that the **Host in the cloud** check box is selected (this check box is labeled **Create remote resources** in some installations).

	![][0]

3. Choose **Virtual Machine**, and then choose the **OK** button.
4. If prompted, sign in to Azure. The Create Virtual Machine dialog box appears.

	![][2]

5. In the DNS name box, type a name for the virtual machine. The DNS name must be unique in Azure. If the name you entered isn't available, a red exclamation point appears.
6. In the Image list, choose the operating system image you want on the virtual machine. You can choose any of the standard images or your own image that you've uploaded to Azure.
7. Leave the **Enable IIS and Web Deploy** check box selected unless you plan to install a different web server. You won't be able to publish from Visual Studio if you disable Web Deploy. You can add IIS and Web Deploy to any of the packaged Windows Server images, including your own custom images.
8. In the **Size** list, choose the size of the virtual machine.
9. Specify the login credentials for this virtual machine. Make a note of them, because you'll need them to access the machine through Remote Desktop.
10. In the **Location** list, choose the region, virtual network, or affinity group that will host the virtual machine. You can use affinity groups to make sure that Azure resources that have a lot of network traffic between them stay together in the same datacenter, or you can use regions to specify the exact datacenter location.
11. Choose **OK** to start the process of creating the virtual machine. You can follow progress in the **Output ** window.

	![][3]

12. When the virtual machine is provisioned, publish scripts are created in a **PublishScripts** node in your solution. The publish script runs and provisions a virtual machine in Azure. The **Output** window shows the status. The script performs the following actions to set up the virtual machine:

	* Creates the virtual machine if it doesn't already exist.
	* Creates a storage account with a name that begins with `devtest`, but only if there isn't already such a storage account in the specified region.
	* Creates a cloud service as a container for the virtual machine, and creates a web role for the website.
	* Configures Web Deploy on the virtual machine.
	* Configures IIS and ASP.NET on the virtual machine.

	![][4]

<br/>
13. (Optional) In **Server Explorer**, expand the **Virtual Machines** node, choose the node for the virtual machine you created, and then choose **Connect with Remote Desktop** to connect to the virtual machine.

# Next Steps

If you want to customize the publish scripts you created, see more in-depth information [here](http://msdn.microsoft.com/library/dn642480.aspx).

[0]: ./media/dotnet-visual-studio-create-virtual-machine/CreateVM_NewProject.PNG
[1]: ./media/dotnet-visual-studio-create-virtual-machine/CreateVM_SignIn.PNG
[2]: ./media/dotnet-visual-studio-create-virtual-machine/CreateVM_CreateVM.PNG
[3]: ./media/dotnet-visual-studio-create-virtual-machine/CreateVM_Provisioning.png
[4]: ./media/dotnet-visual-studio-create-virtual-machine/CreateVM_SolutionExplorer.png
