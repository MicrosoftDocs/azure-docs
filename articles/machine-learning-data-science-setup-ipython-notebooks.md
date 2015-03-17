<properties 
	title="Easy Installing, Configuring, and Launching IPython Notebooks on Azure Virtual Machines" 
	pageTitle="Easy Installing, Configuring, and Launching IPython Notebook on Azure Virtual Machines | Azure" 
	description="Easy Installing, Configuring, and Launching IPython Notebook on Azure Virtual Machines" 
	metaKeywords="" 
	services="data-science-process" 
	solutions="" 
	documentationCenter="" 
	authors="hangzh-msft;bradsev" 
	manager="jacob.spoelstra" 
	editor="cgronlun"  />

<tags 
	ms.service="data-science-process" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/16/2015" 
	ms.author="hangzh-msft;bradsev" />

 
#Setting Up IPython Notebook servers on Azure Virtual Machines
 
In this document, we describe how to set up IPython Notebook servers on Azure virtual machines, by just running two or four shell commands, in Windows or Ubuntu Linux systems, respectiely. After the setting up completes, the IPython Notebook server is **automatically launched** on the virtual machine and can be instantly accessed from web browsers on any machines. Even if the hosting virtual machines restart, the IPython Notebook server is automatically restarted. 

>[AZURE.NOTE] IPython Notebook server will be accessible around 1 minute after the virtual machine is restarted. The virtual machine needs this time to launch the IPython Notebook server.

The shell commands automate several post-install procedures, which include:

	- Installation and setup of IPython Notebook server
	- Opening TCP port in the Windows firewall for the IPython Notebook endpoint
	- Fetching sample IPython notebooks and other scripts
	- Downloading and installing useful Data Science Python packages
	- Downloading and installing Azure tools such as AzCopy and Azure Storage Explorer (Windows machine only)


## <a name="supported-os"></a>Supported operation systems

Currently, the shell script files are designed to support operation systems **Windows Server 2012** and **Ubuntu 14.04 LTS Linux** systems. They may happen to run on other operation systems without errors, but not tested or guaranteed. The support on other systems will be provided in the future upon requests.    

## <a name="create-vm"></a>Step 1: Create an Azure virtual machine and add an endpoint for IPython Notebooks

If a user already has an Azure virtual machine and just wants to set up IPython Notebook server on it, this step can be skipped and please jump to the next step to [add an endpoint for IPython Notebooks to an existing virtual machine](#add-endpoint). 
 
Before starting the process of creating virtual machines on Azure, users need to decide the size of the machine that is suitable for the size of data that the machine is going to process. Smaller machines have smaller memory size and less CPU cores than larger machines, but also less costly. 

1. Log in to `https://manage.windowsazure.com`, and click `New` in the bottom left corner. A window will be popped up. Then select `COMPUTE` > `VIRTUAL MACHINE` > `FROM GALLERY`.

	![Create workspace][9]

2. Choose an image. Since the shell scripts of setting up IPython Notebook server only work on **Windows Server 2012** and **Ubuntu 14.04 LTS Linux**, user can only choose images that are running either of these two operation systems. Then, click the right arrow to go the the next configuration page.
	
	![Create workspace][10]

	>[AZURE.NOTE] If you want to use this virtual machine to try out the examples **Cloud Data Science Process in Action** (links are provided at the bottom of the [Cloud Data Science Process map](machine-learning-data-science-how-to-create-machine-learning-service.md)), you need to select images of Windows since in these examples, some steps depend on some software that is Windows specific.

3. Input the name of the virtual machine you want to create, select the size of the machine based on the size of the data the machine is going to handle and how powerful you want the machine to be (memory size and the number of cores), the user name and the password of the machine. Then, click the right arrow to go to the next configuration page.

	![Create workspace][11]

4. Select the `REGION/AFFINITY GROUP/VIRTUAL NETWORK` as the one that the `STORAGE ACCOUNT` that you are planning to use for this virtual machine belongs to, and select the storage account. Add an endpoint at the bottom of the `ENDPOINTS` by inputting the name of the endpoint (IPython here). You can choose any string as the **NAME** of the end point, and any integer between 0 and 65536 that is **available** as the **PUBLIC PORT**. The **PRIVATE PORT** has to be **9999**. Users should **avoid** using any public port that has already been assigned for internet services. [Ports for Internet Services](http://www.chebucto.ns.ca/~rakerman/port-table.html) provides a complete list of ports that have been assigned and you cannot use. 

	![Create workspace][12]

	>[AZURE.NOTE] If the endpoint is added at the virtual machine configuration, the next step can be skipped.

5. Click the check mark, the virtual machine provisioning process will start. 

	![Create workspace][13]


It may take around 15-25 minutes to complete the virtual machine provisioning process. After the virtual machine is created, you should be able to see the status of this machine showing as **Running**.

![Create workspace][14]
	
## <a name="add-endpoint"></a>Step 2: Add an endpoint for IPython Notebooks to an existing virtual machine

If you create the virtual machine by following the instructions above, the endpoint for IPython Notebook has already been added. This step can be skipped. 

If the virtual machine has already been created, and and you need to add an endpoint for IPython Notebooks, first log into Azure management portal, click the virtual machine, and then add the endpoint for IPython Notebook server. The following figure is the screen shot after the endpoint for IPython Notebook has been added to a Windows virtual machine. 

![Create workspace][2]

## <a name="run-commands"></a>Step 3: Run shell commands on virtual machines to set up IPython Notebook server

After the virtual machine is created, user needs to [log on to the virtual machine](virtual-machines-log-on-windows-server.md) using RDP (Windows), or ssh into it using tools like [putty](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html) (Ubuntu). If it is a Windows machine, run the following command in the **Command Prompt** (**Not the Powershell command window**). Users have to run this command in the role of **Administrator**. 
 
    set script='https://raw.githubusercontent.com/Azure/Azure-MachineLearning-DataScience/master/Misc/MachineSetup/Azure_VM_Setup_Windows.ps1'

	@powershell -NoProfile -ExecutionPolicy unrestricted -Command "iex ((new-object net.webclient).DownloadString(%script%))"

After the installing completes on Windows, the IPython Notebook server will be automatically launched in the directory of `C:\Users\<user name>\Documents\IPython Notebooks`. 

If it is a Ubuntu virtual machine, run the following shell commands either in one or multiple submissions. 

    sudo apt-get install curl;
	sudo curl -O https://raw.githubusercontent.com/Azure/Azure-MachineLearning-DataScience/master/Misc/MachineSetup/Azure_VM_Setup_Ubuntu.sh;
	sudo chmod a+x Azure_VM_Setup_Ubuntu.sh;
	sudo ./AzureML_UbuntuSetup.sh 

After the installing completes on Linux, the IPython Notebook server has been automatically launched in the directory of `$HOME/ipython_notebooks`. 

During the installing process (both Ubuntu and Windows), users will be asked to input the password of the IPython Notebooks. On Windows machines, users will also be asked to input the password of the machine so that the IPython Notebook can be added as a service running on the machines. 

## <a name="access"></a>Access IPython Notebooks in web browsers
To access the IPython Notebook server, just open a web browser, and input **`https://<virtual machine DNS name>:<public port number>`** in the URL text box. Here, the `<public port number>` is the port number users specify when the IPython Notebook endpoint is added. Since 443 is the default port number for `https`, if users choose `443` as the public port number, the IPython Notebook can be accessed without explicitly claim the port number in the URL text box. Otherwise, the `:<public port number>` is required. 

Users will encounter the warning that _There is a problem with this website's security certificate_ (Internet Explorer) or _Your connection is not private_ (Chrome), as shown in the following figures. Users need to click _Continue to this website (not recommended)_ (Internet Explorer) or _Advanced_ and then _Proceed to `<DNS Name>` (unsafe)_ (Chrome) to continue. Then, users will be asked to input password to access the IPython Notebooks.

Internet Explorer:
![Create workspace][5]

Chrome:
![Create workspace][6]

After users log on to the IPython Notebooks, a directory `DataScienceSamples` will show on the browser. This directory contains the sample IPython Notebooks shared by Microsoft which aim to help users conduct data science tasks on Azure. These sample IPython Notebooks have been checked out from [**Github repository**](https://github.com/Azure/Azure-MachineLearning-DataScience/tree/master/Misc/DataScienceProcess/iPythonNotebooks) to the virtual machines during the IPython Notebook server setting up process. Microsoft is maintaining and updating this repository frequently. Users can always visit this Github repository to get the most recently updated sample IPython Notebooks. 
![Create workspace][3]

## <a name="upload"></a>Upload an existing IPython Notebook on local machine to the IPython Notebook server
IPython Notebooks provide an easy way for users to upload an existing IPython Notebook on their own local machines to the IPython Notebook server on the virtual machines. After users log on to the IPython Notebook in web browser, click into the **directory** that the IPython Notebook will be uploaded to. Then, select the IPython Notebook .ipynb file on the local machine in the **File Explorer**, and drag and drop it to the IPython Notebook directory on the web browser. Finally, click the "Upload" button, the .ipynb file will be uploaded to the IPython Notebook server, and users can start using it in the web browser.

![Create workspace][7]

![Create workspace][8]

[1]: ./media/machine-learning-data-science-setup-ipython-notebooks/add-endpoints-ubuntu.png
[2]: ./media/machine-learning-data-science-setup-ipython-notebooks/add-endpoints-after-creation.png
[3]: ./media/machine-learning-data-science-setup-ipython-notebooks/sample-ipnbs.png
[4]: ./media/machine-learning-data-science-setup-ipython-notebooks/dns-name-and-host-name.png
[5]: ./media/machine-learning-data-science-setup-ipython-notebooks/browser-warning-ie.png
[6]: ./media/machine-learning-data-science-setup-ipython-notebooks/browser-warning.png
[7]: ./media/machine-learning-data-science-setup-ipython-notebooks/upload-ipnb-1.png
[8]: ./media/machine-learning-data-science-setup-ipython-notebooks/upload-ipnb-2.png
[9]: ./media/machine-learning-data-science-setup-ipython-notebooks/create-virtual-machine-1.png
[10]: ./media/machine-learning-data-science-setup-ipython-notebooks/create-virtual-machine-2.png
[11]: ./media/machine-learning-data-science-setup-ipython-notebooks/create-virtual-machine-3.png
[12]: ./media/machine-learning-data-science-setup-ipython-notebooks/create-virtual-machine-4.png
[13]: ./media/machine-learning-data-science-setup-ipython-notebooks/create-virtual-machine-5.png
[14]: ./media/machine-learning-data-science-setup-ipython-notebooks/create-virtual-machine-6.png