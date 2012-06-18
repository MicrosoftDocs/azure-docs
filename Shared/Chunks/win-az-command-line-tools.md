#Windows Azure command-line tool for Mac and Linux

This tool provides functionality for creating, deploying, and managing virtual machines and websites from Mac and Linux desktops. This functionality is similar to that provided by the Windows PowerShell cmdlets that are installed with the Windows Azure SDKs for .NET, Node.JS, and PHP.

To install the tool on a Mac, download and run the [Windows Azure SDK installer](http://go.microsoft.com/fwlink/?LinkId=252249).

To install the tool on Linux, install the latest version of Node.JS and then use NPM to install:

	npm install azure -g

Optional parameters are shown in square brackets (for example, [parameter]). All other parameters are required.

In addition to command-specific optional parameters documented here, there are three optional parameters that can be used to display detailed output such as request options and status codes. The -v parameter provides verbose output, and the -vv parameter provides even more detailed verbose output.

**Table of Contents:**

* [Manage your account information and publish settings](#Manage_your_account_information_and_publish_settings)
* [Commands to manage your Windows Azure virtual machines](#Commands_to_manage_your_Azure_virtual_machines)
* [Commands to manage your Windows Azure virtual machine endpoints](#Commands_to_manage_your_Azure_virtual_machine_endpoints)
* [Commands to manage your Windows Azure virtual machine images](#Commands_to_manage_your_Azure_virtual_machine_images)
* [Commands to manage your Windows Azure virtual machine data disks](#Commands_to_manage_your_Azure_virtual_machine_data_disks)
* [Commands to manage your Windows Azure cloud services](#Commands_to_manage_your_Azure_cloud_services)
* [Commands to manage your Windows Azure certificates](#Commands_to_manage_your_Azure_certificates)
* [Commands to manage your websites](#Commands_to_manage_your_web_sites)
* [Manage tool local settings](#Manage_tool_local_settings)

<h2 id="Manage_your_account_information_and_publish_settings">Manage your account information and publish settings</h2>

Your Windows Azure subscription information is used by the tool to connect to your account. This information can be obtained from the Windows Azure portal in a publish settings file as described here. The publish settings file can then be imported as a persistent local config setting that the tool will use for subsequent operations. You only need to import your publish settings once.

**account download [options]**

This command launches a browser to download your .publishsettings file from the Windows Azure portal.


	~$ azure account download
	info:   Executing command account download
	info:   Launching browser to https://windows.azure.com/download/publishprofile.aspx
	help:   Save the downloaded file, then execute the command
	help:     account import <file>
	info:   account download command OK


**account import [options] &lt;file>**

This command imports a publishsettings file or certificate so that it can be used by the tool going forward.

	~$ azure account import publishsettings.publishsettings
	info:   Importing publish settings file publishsettings.publishsettings
	info:   Found subscription: 3-Month Free Trial
	info:   Found subscription: Pay-As-You-Go
	info:   Setting default subscription to: 3-Month Free Trial
	warn:   The 'publishsettings.publishsettings' file contains sensitive information.
	warn:   Remember to delete it now that it has been imported.
	info:   Account publish settings imported successfully

Note: The publishsettings file can contain details (that is, subscription name and ID) about more than one subscription. When you import the publishsettings file, the first subscription is used as the default description. To use a different subscription, run the following command.

	~$ azure config set subscription <other-subscription-id>

**account clear [options]**

This command removes the stored publish settings that have been imported. Use this command if you're finished using the tool on this machine and want to assure that the tool cannot be used with your account going forward.

	~$ azure account clear
	Clearing account info.
	info:   OK

**account affinity-group list [options]**

This command lists your Windows Azure affinity groups.

Affinity groups can be set when a group of virtual machines spans multiple physical machines. The affinity group specifies that the physical machines should be as close to each other as possible, to reduce network latency.

	~$ azure account affinity-group list
	+ Fetching affinity groups
	data:   Name                                  Label   Location
	data:   ------------------------------------  ------  --------
	data:   535EBAED-BF8B-4B18-A2E9-8755FB9D733F  opentec  West US
	info:   account affinity-group list command OK

<h2 id="Commands_to_manage_your_Azure_virtual_machines">Commands to manage your Windows Azure virtual machines</h2>
The following diagram shows how Windows Azure virtual machines are hosted in the production deployment environment of a Windows Azure cloud service.
 
![Azure Technical Diagram](/media/itpro/shared/architecturediagram.jpg)

**create-new** creates the drive in blob storage (that is, e:\ in the diagram); **attach** attaches an already created but unattached disk to a virtual machine.

**vm create &lt;dns-prefix> &lt;image> &lt;userName> [password] [optional parameters]**

This command creates a new Windows Azure virtual machine. By default, each virtual machine is created in its own cloud service; however, you can specify that a virtual machine should be added to an existing cloud service through use of the -c option as documented here.

Note that the vm create command, like the Windows Azure portal, only creates virtual machines in the production deployment environment. There is currently no option for creating a virtual machine in the staging deployment environment of a cloud service. Note that a Windows Azure storage account is created by this command if one does not already exist for your subscription.

When you create a new virtual machine, you will need to specify the physical location (that is, data center) where the virtual machine will reside. You can specify a location through the --location parameter, or you can specify an affinity group through the --affinity-group parameter. If neither is provided, you are prompted to provide one from a list of valid locations.

The supplied password must be 8-123 characters long and meet the password complexity requirements of the operating system that you are using for this virtual machine.

If you anticipate the need to use SSH to manage a deployed Linux virtual machine (as is usually the case), you must enable SSH via the -s option when you create the virtual machine. It is not possible enable SSH after the virtual machine has been created.

Windows virtual machines can enable RDP later by adding port 3389 as an endpoint.

The following optional parameters are supported for this command:

**-c** create the virtual machine inside an already created deployment in a hosting service.

**--vm-name** Specify the name of the virtual machine. This parameter takes hosting service name by default. If -vmname is not specified, the name for the new virtual machine is generated as &lt;service-name>&lt;id>, where &lt;id> is the number of existing virtual machines in the service plus 1 For example, if you use this command to add a new virtual machine to a hosting service MyService that has one existing virtual machine, the new virtual machine is named MyService2.
 
**-u --blob-url** Specify the blob storage URL from which to create the virtual machine system disk. 

**--vm-size** Specify the size of the virtual machine. Valid values are "extrasmall", "small", "medium", "large", "extralarge". The default value is "small".

**-r** Adds RDP connectivity to a Windows virtual machine. 

**-s** Adds SSH connectivity to a Linux virtual machine. This option can be used only when the virtual machine is created. 

**--location** specifies the location (for example, "North Central US"). 

**--affinity-group** specifies the affinity group.

**-w, --virtual-network-name** Specify the virtual network on which to add the new vitual machine. Virtual networks can be set up and managed from the Windows Azure portal.

**-b, --subnet-names** Specifies the subnet names to assign the virtual machine.

In this example, MSFT__Win2K8R2SP1-120514-1520-141205-01-en-us-30GB is an image provided by the platform. For more information about operating system images, see vm image list.

	~$ azure vm create my-vm-name MSFT__Win2K8R2SP1-120514-1520-141205-01-en-us-30GB  username --location "Western US"-r
	info:   Executing command vm create
	Enter VM 'my-vm-name' password: ************                                     
	info:   vm create command OK
	
**vm create-from &lt;dns-prefix> &lt;role-file>**

This command creates a new Windows Azure virtual machine from a JSON role file.

	~$ azure vm create-from example.json
	info:   OK
	
**vm list [options]**

This command lists Windows Azure virtual machines. The -json option specifies that the results are returned in raw JSON format. 

	~$ azure vm list
	info:   Executing command vm list
	data:   DNS Name                          VM Name      Status                  
	data:   --------------------------------  -----------  ---------
	data:   my-vm-name.cloudapp-preview.net        my-vm        ReadyRole
	info:   vm list command OK


**vm location list [options]**

This command lists all available Windows Azure account locations.


	~$ azure vm location list
	info:   Executing command vm location list
	data:   Name                   Display Name                                    
	data:   ---------------------  ------------
	data:   Windows Azure Preview  West US     
	info:   account location list command OK


**vm show [options] &lt;name>**

This command shows details about a Windows Azure virtual machine. The -json option specifies that the results are returned in raw JSON format. 

	~$ azure vm show my-vm
	data:   DNSName "anucentos11.cloudapp-preview.net"
	data:   VMName "anucentos11"
	data:   IPAddress "10.26.196.250"
	data:   InstanceStatus "ReadyRole"
	data:   InstanceSize "Small"
	data:   Image "OpenLogic__OpenLogic-CentOS-62-20120509-en-us-30GB.vhd"
	data:   Network Endpoints 0 LocalPort "8888"
	data:   Network Endpoints 0 Name "endpname-8888-8888"
	data:   Network Endpoints 0 Port "8888"
	data:   Network Endpoints 0 Protocol "tcp"
	data:   Network Endpoints 0 Vip "65.52.250.21"
	data:   Network Endpoints 1 LocalPort "22"
	data:   Network Endpoints 1 Name "ssh"
	data:   Network Endpoints 1 Port "22"
	data:   Network Endpoints 1 Protocol "tcp"
	data:   Network Endpoints 1 Vip "65.52.250.21"

**vm delete [options] &lt;name>**

This command deletes a Windows Azure virtual machine. By default, this command does not delete the Windows Azure blob from which the the operating system disk and the data disk are created. To delete the blob as well as the virtual machine on which it is based, specify the -b option.

	~$ azure vm delete my-vm 
	info:   Executing command vm delete
	info:   vm delete command OK

**vm start [options] &lt;name>**

This command starts a Windows Azure virtual machine.

	~$ azure vm start my-vm
	info:   Executing command vm start
	info:   vm start command OK

**vm restart [options] &lt;name>**

This command restarts a Windows Azure virtual machine.

	~$ azure vm restart my-vm
	info:   Executing command vm restart
	info:   vm restart command OK

**vm shutdown [options] &lt;name>**

This command shuts down a Windows Azure virtual machine.

	~$ azure vm shutdown my-vm
	info:   Executing command vm shutdown
	info:   vm shutdown command OK  

**vm capture &lt;vm-name> &lt;target-image-name>**

This command captures a Windows Azure virtual machine image.

A virtual machine image cannot be captured while the virtual machine state unless the virtual machine state is Stopped .

	~$ azure.cmd vm capture my-vm mycaptureimagename --delete
	info:   Executing command vm capture
	+ Fetching VMs
	+ Capturing VM
	info:   vm capture command OK

<h2 id="Commands_to_manage_your_Azure_virtual_machine_endpoints">Commands to manage your Windows Azure virtual machine endpoints</h2>

The following diagram shows the architecture of a typical deployment of multiple instances of a virtual machine. Note that in this example port 3389 is open on each virtual machine (for RDP access), and there is also an internal IP address (for example, 168.55.11.1) on each virtual machine that is used by the load balancer to route traffic to the virtual machine. This internal IP address can also be used for communication between virtual machines.

![azurenetworkdiagram](/media/itpro/shared/networkdiagram.jpg)
 
External requests to virtual machines go through a load balancer. Because of this, requests cannot be specified against a particular virtual machine on deployments with multiple virtual machines. For deployments with multiple virtual machines, port mapping must be configured between the virtual machines (vm-port) and the load balancer (lb-port).

**vm endpoint create &lt;vm-name> &lt;lb-port> [vm-port]**

This command creates a virtual machine endpoint.

	~$ azure vm endpoint create my-vm 8888 8888
	azure vm endpoint create my-vm 8888 8888
	info:   Executing command vm endpoint create
	+ Fetching VM
	+ Reading network configuration
	+ Updating network configuration
	info:   vm endpoint create command OK

**vm endpoint delete &lt;vm-name> &lt;lb-port>**

This command deletes a virtual machine endpoint.

	~$ azure vm endpoint delete my-vm 8888
	azure vm endpoint delete my-vm 8888
	info:   Executing command vm endpoint delete
	+ Fetching VM
	+ Reading network configuration
	+ Updating network configuration
	info:   vm endpoint delete command OK

**vm endpoint list &lt;vm-name>**

This command lists all virtual machine endpoints. The -json option specifies that the results are returned in raw JSON format. 

	~$ azure vm endpoint list my-linux-vm
	data:   Name  External Port  Local Port                                        
	data:   ----  -------------  ----------
	data:   ssh   22             22

<h2 id="Commands_to_manage_your_Azure_virtual_machine_images">Commands to manage your Windows Azure virtual machine images</h2>
Virtual machine images are captures of already configured virtual machines that can be replicated as required.

**vm image list [options]**

This command gets a list of virtual machine images. There are three types of images: images created by Microsoft, which are prefixed with "MSFT", images created by third parties, which are usually prefixed with the name of the vendor, and images you create. To create images, you can either capture an existing virtual machine or create an image from a custom .vhd uploaded to blob storage. For more information about using a custom .vhd, see vm image create.
The -json option specifies that the results are returned in raw JSON format. 

	~$ azure vm image list
	data:   Name                                                                   Category   OS
	data:   ---------------------------------------------------------------------  ---------  -------
	data:   CANONICAL__Canonical-Ubuntu-12-04-20120519-2012-05-19-en-us-30GB.vhd   Canonical  Linux
	data:   MSFT__Windows-Server-2008-R2-SP1.11-29-2011                            Microsoft  Windows
	data:   MSFT__Windows-Server-2008-R2-SP1-with-SQL-Server-2012-Eval.11-29-2011  Microsoft  Windows
	data:   MSFT__Windows-Server-8-Beta.en-us.30GB.2012-03-22                      Microsoft  Windows
	data:   MSFT__Windows-Server-8-Beta.2-17-2012                                  Microsoft  Windows
	data:   MSFT__Windows-Server-2008-R2-SP1.en-us.30GB.2012-3-22                  Microsoft  Windows
	data:   OpenLogic__OpenLogic-CentOS-62-20120509-en-us-30GB.vhd                 OpenLogic  Linux
	data:   SUSE__SUSE-Linux-Enterprise-Server-11SP2-20120521-en-us-30GB.vhd       SUSE       Linux
	data:   SUSE__OpenSUSE64121-03192012-en-us-15GB.vhd                            SUSE       Linux
	data:   WIN2K8-R2-WINRM                                                        User       Windows
	info:   vm image list command OK   

**vm image show [options] &lt;name>**

This command shows the details of of a virtual machine image.

	~$ azure vm image show MSFT__Windows-Server-2008-R2-SP1.11-29-2011
	+ Fetching VM image
	data:   Category "Microsoft"
	data:   Label "Windows Server 2008 R2 SP1, May 2012"
	data:   LogicalSizeInGB "30"
	data:   Name "MSFT__Win2K8R2SP1-120514-1520-141205-01-en-us-30GB.vhd"
	data:   OS "Windows"
	data:   Description "Windows Server 2008 R2 is a multi-purpose server designed to increase the reliability and flexibility of your server or private cloud infra
	structure, helping you to save time and reduce costs. It provides you with powerful tools to react to business needs with greater control and confidence."
	info:   vm image show command OK

**vm image delete [options] &lt;name>**

This command deletes a virtual machine image.

	~$ azure vm image delete my-vm-image
	info:   Executing command vm image delete
	info:   VM image deleted: my-vm-image                                         
	info:   vm image delete command OK

**vm image create &lt;name> [source-path]**

This command creates a virtual machine image. Your custom .vhd files are uploaded to blob storage, and then the virtual machine image is created from there. You then use this virtual machine image to create a virtual machine. The Location and OS parameters are required.

Some systems impose per-process file descriptor limits. If this limit is exceeded, the tool displays a file descriptor limit error. You can run the command again using the -p &lt;number> parameter to reduce the maximum number of parallel uploads. The default maximum number of parallel uploads is 96.

	~$ azure vm image create mytestimage ./Sample.vhd -o windows -l "West US"
	info:   Executing command vm image create
	+ Retrieving storage accounts
	info:   VHD size : 13 MB
	info:   Uploading 13312.5 KB
	Requested:100.0% Completed:100.0% Running: 105 Time:    8s Speed:  1721 KB/s
	info:   http://myaccount.blob.core.azure.com/vm-images/Sample.vhd is uploaded successfully
	info:   vm image create command OK

<h2 id="Commands_to_manage_your_Azure_virtual_machine_data_disks">Commands to manage your Windows Azure virtual machine data disks</h2>
Data disks are .vhd files in blob storage that can be used by a virtual machine. For more information about how data disks are deployed to blob storage, see the Windows Azure technical diagram shown earlier.

**vm disk show [options] &lt;name>**

This command shows details about a Windows Azure disk.

	~$ azure vm disk show anucentos-anucentos-0-20120524070008
	info:   Executing command vm disk show
	data:   AttachedTo DeploymentName "mycentos"
	data:   AttachedTo HostedServiceName "myanucentos"
	data:   AttachedTo RoleName "myanucentos"
	data:   OS "Linux"
	data:   Location "Windows Azure Preview"
	data:   LogicalDiskSizeInGB "30"
	data:   MediaLink "http://mystorageaccount.blob.core.azure-preview.com/vhd-store/mycentos-cb39b8223b01f95c.vhd"
	data:   Name "mycentos-mycentos-0-20120524070008"
	data:   SourceImageName "OpenLogic__OpenLogic-CentOS-62-20120509-en-us-30GB.vhd"
	info:   vm disk show command OK

**vm disk list [options] [vm-name]**

This command lists Windows Azure disks, or disks attached to a specified virtual machine. if it is run with a virtual machine name parameter, it returns all disks attached to the virtual machine. Lun 1 is created with the virtual machine, and any other listed disks are attached separately.

	~$ azure vm disk list mycentos
	info:   Executing command vm disk list
	data:   Lun  Size(GB)  Blob-Name
	data:   ---  --------  --------------------------------
	data:   1    30        mycentos-cb39b8223b01f95c.vhd
	data:   2    10        mycentos-e3f0d717950bb78d.vhd
	info:   vm disk list command OK                                               

Executing this command without a virtual machine name parameter returns all disks.

	~$ azure vm disk list 
	data:   Name                                        OS
	data:   ------------------------------------------  -------
	data:   mycentos-mycentos-0-20120524070008          Linux
	data:   mycentos-mycentos-2-20120525055052
	data:   mywindows-winvm-20120522223119              Windows
	info:   vm disk list command OK

**vm disk delete [options] &lt;name>**

This command deletes a Windows Azure disk from a personal repository. The disk must be detached from the virtual machine before it is deleted.

	~$ azure vm disk delete mycentos-mycentos-2-20120525055052
	info:   Executing command vm disk delete
	info:   Disk deleted: mycentos-mycentos-2-20120525055052                  
	info:   vm disk delete command OK

**vm disk create &lt;name> [source-path]**

This command uploads and registers a Windows Azure disk. --blob-url, --location, or --affinity-group must be specified. If you use this command with [source-path], the .vhd file specified is uploaded and a new image is created. You can then attach this image to a virtual machine by using vm disk attach.

Some systems impose per-process file descriptor limits. If this limit is exceeded, the tool displays a file descriptor limit error. You can run the command again using the -p &lt;number> parameter to reduce the maximum number of parallel uploads. The default maximum number of parallel uploads is 96. 

	~$ azure vm disk create my-data-disk ~/test.vhd --location "Western US"
	info:   Executing command vm disk create
	info:   VHD size : 10 MB                                                       
	info:   Uploading 10240.5 KB
	Requested:100.0% Completed:100.0% Running:  81 Time:   11s Speed:   952 KB/s 
	info:   http://account.blob.core.azure.com/disks/test.vhd is uploaded successfully
	info:   vm disk create command OK

**vm disk attach &lt;vm-name> &lt;disk-image-name>**

This command attaches an existing disk in blob storage to an existing virtual machine deployed in a cloud service.

	~$ azure vm disk attach my-vm my-vm-my-vm-2-201242418259
	info:   Executing command vm disk attach
	info:   vm disk attach command OK

**vm disk attach-new &lt;vm-name> &lt;size-in-gb> [blob-url]**

This command attaches a data disk to a Windows Azure virtual machine. In this example, 20 is the size of the new disk, in gigabytes, to be attached. You can optionally use a blob URL as the last argument to explicitly specify the target blob to create. If you do not specify a blob URL, a blob object will be automatically generated.

	~$ azure vm disk attach-new nick-test36 20 http://nghinazz.blob.core.azure-preview.com/vhds/vmdisk1.vhd
	info:   Executing command vm disk attach-new
	info:   vm disk attach-new command OK  

**vm disk detach &lt;vm-name> &lt;lun>**

This command detaches a data disk attached to a Windows Azure virtual machine. &lt;lun> identifies the disk to be detached. To get a list of disks associated with a disk before you detach it, use vm disk-list &lt;vm-name>.

	~$ azure vm disk detach my-vm 2
	info:   Executing command vm disk detach
	info:   vm disk detach command OK

<h2 id="Commands_to_manage_your_Azure_cloud_services">Commands to manage your Windows Azure cloud services</h2>

Windows Azure cloud services are applications and services hosted on web roles and worker roles. The following commands can be used to manage Windows Azure cloud services.

**service list [options]**

This command lists Windows Azure cloud services.

	~$ azure service list
	info:   Executing command service list
	data:   Name         Status                                                    
	data:   -----------  -------
	data:   service1     Created
	data:   service2     Created
	info:   service list command OK

**service delete [options] &lt;name>**

This command deletes a Windows Azure cloud service.

	~$ azure cloud-service delete myservice
	info:   Executing command cloud-service delete myservice 
	info:   cloud-service delete command OK

<h2 id="Commands_to_manage_your_Azure_certificates">Commands to manage your Windows Azure certificates</h2>
Windows Azure certificates are cerificates (that is, SSL certificates) connected to your Windows Azure account.

**service cert list [options]**

This command lists Windows Azure certificates.

	~$ azure service cert list
	info:   Executing command service cert list
	+ Fetching cloud services                                                      
	+ Fetching certificates                                                        
	data:   Service   Thumbprint                                Algorithm
	data:   --------  ----------------------------------------  ---------
	data:   myservice  262DBF95B5E61375FA27F1E74AC7D9EAE842916C  sha1     
	info:   service cert list command OK

**service cert create &lt;dns-prefix> &lt;file> [password]**

This command uploads a certificate. Leave the password prompt blank for certificates that are not password protected.

	~$ azure service cert create nghinazz ~/publishSet.pfx
	info:   Executing command service cert create
	Cert password: 
	+ Creating certificate                                                         
	info:   service cert create command OK

**service cert delete [options] &lt;thumbprint>**

This command deletes a certificate.

	~$ azure service cert delete 262DBF95B5E61375FA27F1E74AC7D9EAE842916C
	info:   Executing command service cert delete
	+ Deleting certificate                                                         
	info:   nghinazz : cert deleted
	info:   service cert delete command OK

<h2 id="Commands_to_manage_your_web_sites">Commands to manage your websites</h2>

A Windows Azure website is a web configuration accessible by URI. Websites are hosted in virtual machines, but you do not need to think about the details of creating and deploying the virtual machine yourself. Those details are handled for you by Windows Azure.

**site list [options]**

This command lists your websites.

	~$ azure site list
	info:   Executing command site list
	data:   Name            State    Host names                                        
	data:   --------------  -------  --------------------------------------------------
	data:   mongosite       Running  mongosite.antdf0.antares.windows.net     
	data:   myphpsite       Running  myphpsite.antdf0.antares.windows.net     
	data:   mydrupalsite36  Running  mydrupalsite36.antdf0.antares.windows.net
	info:   site list command OK

**site create [options] [name]**

This command creates a new website and local directory. Note that the site name must be unique. You cannot create a site with the same DNS name as an existing site.

	~$ azure site create mysite
	info:   Executing command site create
	info:   Using location northeuropewebspace
	info:   Creating a new web site
	info:   Created website at  mysite.antdf0.antares.windows.net
	info:   Initializing repository
	info:   Repository initialized
	info:   site create command OK

**site portal [options] [name]**

This command opens the portal in a browser so you can manage your websites.

	~$ azure site portal mysite
	info:   Executing command site portal
	info:   Launching browser to https://windows.azure.net/#Workspaces/WebsiteExtension/Website/mysite/dashboard
	info:   site portal command OK

**site browse [options] [name]**

This command opens your website in a browser.

	~$ azure site browse mysite
	info:   Executing command site browse
	info:   Launching browser to http://mysite.antdf0.antares-test.windows-int.net
	info:   site browse command OK

**site show [options] [name]**

This command shows details for a website.

	~$ azure site show mysite
	info:   Executing command site show
	info:   Showing details for site
	data:   Site AdminEnabled true
	data:   Site HostNames mysite.antdf0.antares-test.windows-int.net
	data:   Site Name mysite
	data:   Site Owner 00060000814EDDEE
	data:   Site RepositorySiteName mysite
	data:   Site SelfLink https://s1.api.antdf0.antares.windows.net:454/subscriptions/444e62ff-4c5f-4116-a695-5c803ed584a5/webspaces/northeuropewebspace/sites/mysite
	data:   Site State Running
	data:   Site UsageState Normal
	data:   Site WebSpace northeuropewebspace
	data:   Config AppSettings
	data:   Config ConnectionStrings
	data:   Config DefaultDocuments 0=Default.htm, 1=Default.asp, 2=index.htm, 3=index.html, 4=iisstart.htm, 5=default.aspx, 6=index.php, 7=hostingstart.aspx
	data:   Config DetailedErrorLoggingEnabled false
	data:   Config HttpLoggingEnabled false
	data:   Config Metadata
	data:   Config NetFrameworkVersion v4.0
	data:   Config NumberOfWorkers 1
	data:   Config PhpVersion 5.3
	data:   Config PublishingPassword rJ}[Er2v[Y]q16B6vTD]n$[C2z}Z.pvgLfRcLnAp%ax]xstiLny};o@vmMAote@d
	data:   Config RequestTracingEnabled false
	data:   Repository https://mysite.scm.antdf0.antares-test.windows-int.net/
	info:   site show command OK

**site delete [options] [name]**

This command deletes a website.

	~$ azure site delete mysite
	info:   Executing command site delete
	info:   Deleting site mysite
	info:   Site mysite has been deleted
	info:   site delete command OK

**site start [options] [name]**

This command starts a website.

	~$ azure site start mysite
	info:   Executing command site start
	info:   Starting site mysite
	info:   Site mysite has been started
	info:   site start command OK

**site stop [options] [name]**

This command stops a website.

	~$ azure site stop mysite
	info:   Executing command site stop
	info:   Stopping site mysite
	info:   Site mysite has been stopped
	info:   site stop command OK

<h2 id="Manage_tool_local_settings">Manage tool local settings</h2>

Local settings are your subscription ID and Default Storage Account Name.

**config list [options]**

This command displays config settings.

	~$ azure config list
	info:   Displaying config settings
	data:   Setting                Value                               
	data:   ---------------------  ------------------------------------
	data:   subscription           32-digit-subscription-key
	data:   defaultStorageAccount  name

**config set [options] &lt;name>,&lt;value>**

This command changes a config setting.

	~$ azure config set defaultStorageAccount myname
	info:   Setting 'defaultStorageAccount' to value 'myname'
	info:   Changes saved.