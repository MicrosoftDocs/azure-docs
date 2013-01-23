#Windows Azure command-line tool for Mac and Linux

This tool provides functionality for creating, deploying, and managing virtual machines, websites and Windows Azure Mobile Services from Mac and Linux desktops. This functionality is similar to that provided by the Windows PowerShell cmdlets that are installed with the Windows Azure SDKs for .NET, Node.JS, and PHP.

To install the tool on a Mac, download and run the [Windows Azure SDK installer](http://go.microsoft.com/fwlink/?LinkId=252249).

To install the tool on Linux, install the latest version of Node.JS and then use NPM to install:

    npm install azure-cli -g

Optional parameters are shown in square brackets (for example, [parameter]). All other parameters are required.

In addition to command-specific optional parameters documented here, there are three optional parameters that can be used to display detailed output such as request options and status codes. The -v parameter provides verbose output, and the -vv parameter provides even more detailed verbose output. The --json option will output the result in raw json format.

**Table of Contents:**

* [Manage your account information and publish settings](#Manage_your_account_information_and_publish_settings)
* [Commands to manage your Windows Azure virtual machines](#Commands_to_manage_your_Azure_virtual_machines)
* [Commands to manage your Windows Azure virtual machine endpoints](#Commands_to_manage_your_Azure_virtual_machine_endpoints)
* [Commands to manage your Windows Azure virtual machine images](#Commands_to_manage_your_Azure_virtual_machine_images)
* [Commands to manage your Windows Azure virtual machine data disks](#Commands_to_manage_your_Azure_virtual_machine_data_disks)
* [Commands to manage your Windows Azure cloud services](#Commands_to_manage_your_Azure_cloud_services)
* [Commands to manage your Windows Azure certificates](#Commands_to_manage_your_Azure_certificates)
* [Commands to manage your web sites](#Commands_to_manage_your_web_sites)
* [Commands to manage Windows Azure Mobile Services](#Commands_to_manage_mobile_services)
* [Manage tool local settings](#Manage_tool_local_settings)

##<a id="Manage_your_account_information_and_publish_settings"></a>Manage your account information and publish settings
Your Windows Azure subscription information is used by the tool to connect to your account. This information can be obtained from the Windows Azure portal in a publish settings file as described here. The publish settings file can then be imported as a persistent local config setting that the tool will use for subsequent operations. You only need to import your publish settings once.

**account download [options]**

This command launches a browser to download your .publishsettings file from the Windows Azure portal.

	~$ azure account download
	info:   Executing command account download
	info:   Launching browser to https://windows.azure.com/download/publishprofile.aspx
	help:   Save the downloaded file, then execute the command
	help:   account import <file>
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

##<a id="Commands_to_manage_your_Azure_virtual_machines"></a>Commands to manage your Windows Azure virtual machines
The following diagram shows how Windows Azure virtual machines are hosted in the production deployment environment of a Windows Azure cloud service.
 
![Azure Technical Diagram](images/Azure Technical Diagram.jpg?raw=true)	

**create-new** creates the drive in blob storage (that is, e:\ in the diagram); **attach** attaches an already created but unattached disk to a virtual machine.

**vm create &lt;dns-prefix> &lt;image> &lt;userName> [password] [optional parameters]**

This command creates a new Windows Azure virtual machine. By default, each virtual machine is created in its own cloud service; however, you can specify that a virtual machine should be added to an existing cloud service through use of the -c option as documented here.

Note that the vm create command, like the Windows Azure portal, only creates virtual machines in the production deployment environment. There is currently no option for creating a virtual machine in the staging deployment environment of a cloud service. Note that a Windows Azure storage account is created by this command if one does not already exist for your subscription.

When you create a new virtual machine, you will need to specify the physical location (that is, data center) where the virtual machine will reside. You can specify a location through the --location parameter, or you can specify an affinity group through the --affinity-group parameter. If neither is provided, you are prompted to provide one from a list of valid locations.

The supplied password must be 8-123 characters long and meet the password complexity requirements of the operating system that you are using for this virtual machine.

If you anticipate the need to use SSH to manage a deployed Linux virtual machine (as is usually the case), you must enable SSH via the -s option when you create the virtual machine. It is not possible enable SSH after the virtual machine has been created.

Windows virtual machines can enable RDP later by adding port 3389 as an endpoint.

The following optional parameters are supported for this command:

**-c** create the virtual machine inside an already created deployment in a hosting service. If -vmname is not used with this option, the name of the new virtual machine will be generated automatically.<br />
**--vm-name** Specify the name of the virtual machine. This parameter takes hosting service name by default. If -vmname is not specified, the name for the new virtual machine is generated as &lt;service-name>&lt;id>, where &lt;id> is the number of existing virtual machines in the service plus 1 For example, if you use this command to add a new virtual machine to a hosting service MyService that has one existing virtual machine, the new virtual machine is named MyService2.<br /> 
**-u --blob-url** Specify the blob storage URL from which to create the virtual machine system disk. <br />
**--vm-size** Specify the size of the virtual machine. Valid values are "extrasmall", "small", "medium", "large", "extralarge". The default value is "small". <br />
**-r** Adds RDP connectivity to a Windows virtual machine. <br />
**-s** Adds SSH connectivity to a Linux virtual machine. This option can be used only when the virtual machine is created. <br />
**--location** specifies the location (for example, "North Central US"). <br />
**--affinity-group** specifies the affinity group.<br />
**-w, --virtual-network-name** Specify the virtual network on which to add the new vitual machine. Virtual networks can be set up and managed from the Windows Azure portal.<br />
**-b, --subnet-names** Specifies the subnet names to assign the virtual machine.

In this example, MSFT__Win2K8R2SP1-120514-1520-141205-01-en-us-30GB is an image provided by the platform. For more information about operating system images, see vm image list.

	~$ azure vm create my-vm-name MSFT__Windows-Server-2008-R2-SP1.11-29-2011 username --location "Western US" -r
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
	info:   Executing command vm show
	data:   {                                                                      
	data:       InstanceSize: 'Small',
	data:       InstanceStatus: 'ReadyRole',
	data:       DataDisks: [],
	data:       IPAddress: '10.26.192.206',
	data:       DNSName: 'my-vm.cloudapp.net',
	data:       InstanceStateDetails: {},
	data:       VMName: 'my-vm',
	data:       Network: {
	data:           Endpoints: [
	data:               {
	data:                   Protocol: 'tcp',
	data:                   Vip: '65.52.250.250',
	data:                   Port: '63238' ,
	data:                   LocalPort: '3389',
	data:                   Name: 'RemoteDesktop'
	data:               }
	data:           ]
	data:       },
	data:       Image: 'MSFT__Windows-Server-2008-R2-SP1.11-29-2011',
	data:       OSVersion: 'WA-GUEST-OS-1.18_201203-01'
	data:   } 
	info:   vm show command OK

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

```
~$ azure vm shutdown my-vm
info:   Executing command vm shutdown
info:   vm shutdown command OK  
```

**vm capture &lt;vm-name> &lt;target-image-name>**

This command captures a Windows Azure virtual machine image.

A virtual machine image cannot be captured while the virtual machine state unless the virtual machine state is Stopped .

	~$ azure.cmd vm capture my-vm mycaptureimagename --delete
	info:   Executing command vm capture
	+ Fetching VMs
	+ Capturing VM
	info:   vm capture command OK

##<a id="Commands_to_manage_your_Azure_virtual_machine_endpoints"></a>Commands to manage your Windows Azure virtual machine endpoints
The following diagram shows the architecture of a typical deployment of multiple instances of a virtual machine. Note that in this example port 3389 is open on each virtual machine (for RDP access), and there is also an internal IP address (for example, 168.55.11.1) on each virtual machine that is used by the load balancer to route traffic to the virtual machine. This internal IP address can also be used for communication between virtual machines.

![azurenetworkdiagram](images/azurenetworkdiagram.jpg?raw=true)
 
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

##<a id="Commands_to_manage_your_Azure_virtual_machine_images"></a>Commands to manage your Windows Azure virtual machine images

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
	info:   Executing command vm image show
	data:   {                                                                      
	data:       Label: 'Windows Server 2008 R2 SP1, Nov 2011',
	data:       Name: 'MSFT__Windows-Server-2008-R2-SP1.11-29-2011',
	data:       Description: 'Microsoft Windows Server 2008 R2 SP1',
	data:       @: { xmlns: 'http://schemas.microsoft.com/windowsazure', xmlns:i: 'http://www.w3.org/2001/XMLSchema-instance' },
	data:       Category: 'Microsoft',
	data:       OS: 'Windows',
	data:       Eula: 'http://www.microsoft.com',
	data:       LogicalSizeInGB: '30'
	data:   }
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

##<a id="Commands_to_manage_your_Azure_virtual_machine_data_disks"></a>Commands to manage your Windows Azure virtual machine data disks

Data disks are .vhd files in blob storage that can be used by a virtual machine. For more information about how data disks are deployed to blob storage, see the Windows Azure technical diagram shown earlier. 

The commands for attaching data disks (azure vm disk attach and azure vm disk attach-new) assign a Logical Unit Number (LUN) to the attached data disk, as required by the SCSI protocol. The first data disk attached to a virtual machine is assigned LUN 0, the next is assigned LUN 1, and so on.

When you detach a data disk with the azure vm disk detach command, use the &lt;lun&gt; parameter to indicate which disk to detach. Note that you should always detach data disks in reverse order, starting with the highest-numbered LUN that has been assigned. The Linux SCSI layer does not support detaching a lower-numbered LUN while a higher-numbered LUN is still attached. For example, you should not detach LUN 0 if LUN 1 is still attached.

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

##<a id="Commands_to_manage_your_Azure_cloud_services"></a>Commands to manage your Windows Azure cloud services

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


##<a id="Commands_to_manage_your_Azure_certificates"></a>Commands to manage your Windows Azure certificates

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


##<a id="Commands_to_manage_your_web_sites"></a>Commands to manage your web sites

A Windows Azure web site is a web configuration accessible by URI. Web sites are hosted in virtual machines, but you do not need to think about the details of creating and deploying the virtual machine yourself. Those details are handled for you by Windows Azure.

**site list [options]**

This command lists your web sites.

	~$ azure site list
	info:   Executing command site list
	data:   Name            State    Host names                                        
	data:   --------------  -------  --------------------------------------------------
	data:   mongosite       Running  mongosite.antdf0.antares.windows.net     
	data:   myphpsite       Running  myphpsite.antdf0.antares.windows.net     
	data:   mydrupalsite36  Running  mydrupalsite36.antdf0.antares.windows.net
	info:   site list command OK

**site create [options] [name]**

This command creates a new web site and local directory. Note that the site name must be unique. You cannot create a site with the same DNS name as an existing site.

	~$ azure site create mysite
	info:   Executing command site create
	info:   Using location northeuropewebspace
	info:   Creating a new web site
	info:   Created web site at  mysite.antdf0.antares.windows.net
	info:   Initializing repository
	info:   Repository initialized
	info:   site create command OK

**site portal [options] [name]**

This command opens the portal in a browser so you can manage your web sites.

	~$ azure site portal mysite
	info:   Executing command site portal
	info:   Launching browser to https://windows.azure.net/#Workspaces/WebsiteExtension/Website/mysite/dashboard
	info:   site portal command OK

**site browse [options] [name]**

This command opens your web site in a browser.

	~$ azure site browse mysite
	info:   Executing command site browse
	info:   Launching browser to http://mysite.antdf0.antares-test.windows-int.net
	info:   site browse command OK

**site show [options] [name]**

This command shows details for a web site.

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

This command deletes a web site.

	~$ azure site delete mysite
	info:   Executing command site delete
	info:   Deleting site mysite
	info:   Site mysite has been deleted
	info:   site delete command OK

**site start [options] [name]**

This command starts a web site.

	~$ azure site start mysite
	info:   Executing command site start
	info:   Starting site mysite
	info:   Site mysite has been started
	info:   site start command OK

**site stop [options] [name]**

This command stops a web site.

	~$ azure site stop mysite
	info:   Executing command site stop
	info:   Stopping site mysite
	info:   Site mysite has been stopped
	info:   site stop command OK


##<a id="Commands_to_manage_mobile_services"></a>Commands to manage Windows Azure Mobile Services

Windows Azure Mobile Services brings together a set of Windows Azure services that enable backend capabilities for your apps. Mobile Services commands are divided into the following categories:

+ [Commands to manage mobile service instances](#Mobile_Services)
+ [Commands to manage mobile service configuration](#Mobile_Configuration)
+ [Commands to manage mobile service tables](#Mobile_Tables)
+ [Commands to manage mobile service scripts](#Mobile_Scripts)

The following options apply to most Mobile Services commands:

+ **-h** or **--help**: Display output usage information.
+ **-s `<id>`** or **--subscription `<id>`**: Use a specific subscription, specified as `<id>`.
+ **-v** or **--verbose**: Write verbose output.
+ **--json**: Write JSON output.

###<a id="Mobile_Services"></a>Commands to manage mobile service instances

**mobile locations [options]**

This command lists Mobile Services geographic locations.

	~$ azure mobile locations
	info:    Executing command mobile locations
	info:    East US (default)
	info:    West US		
	info:    North Europe

**mobile create [options] [servicename] [sqlAdminUsername] [sqlAdminPassword]**

This command creates a mobile service along with a SQL Database and server.

	~$ azure mobile create todolist your_login_name Secure$Password
	info:    Executing command mobile create
	+ Creating mobile service
	info:    Overall application state: Healthy
	info:    Mobile service (todolist) state: ProvisionConfigured
	info:    SQL database (todolist_db) state: Provisioned
	info:    SQL server (e96ean1c6v) state: ProvisionConfigured
	info:    mobile create command OK

This command supports the following additional options:

+ **-r `<sqlServer>`**  or **--sqlServer `<sqlServer>`**:  Use an existing SQL Database server, specified as `<sqlServer>`.
+ **-d `<sqlDb>`** or **--sqlDb `<sqlDb>`**: Use existing SQL database, specified as `<sqlDb>`.
+ **-l `<location>`** or **--location `<location>`**: Create the service in a specific location, specified as `<location>`. Run azure mobile locations to get available locations.	
+ **--sqlLocation `<location>`**: Create the SQL server in a specific `<location>`; defaults to the location of the mobile service.

**mobile delete [options] [servicename]**

This command deletes a mobile service along with its SQL Database and server.

	~$ azure mobile delete todolist -a -q
	info:    Executing command mobile delete
	data:    Mobile service todolist
	data:    SQL database todolistAwrhcL60azo1C401
	data:    SQL server fh1kvbc7la
	+ Deleting mobile service
	info:    Deleted mobile service
	+ Deleting SQL server
	info:    Deleted SQL server
	+ Deleting mobile application
	info:    Deleted mobile application
	info:    mobile delete command OK

This command supports the following additional options:

+ **-d** or **--deleteData**: Delete all data from this mobile service from the database.
+ **-a** or **--deleteAll**: Delete the SQL Database and server.
+ **-q or **--quiet**: Do not prompt for confirmation. Use this option in automated scripts.

**mobile list [options]**

This command lists your mobile services.

	~$ azure mobile list
	info:    Executing command mobile list
	data:    Name          State  URL
	data:    ------------  -----  --------------------------------------
	data:    todolist      Ready  https://todolist.azure-mobile.net/
	data:    mymobileapp   Ready  https://mymobileapp.azure-mobile.net/
	info:    mobile list command OK

**mobile show [options] [servicename]**

This command displays details about a mobile service.

	~$ azure mobile show todolist
	info:    Executing command mobile show
	+ Getting information
	info:    Mobile application
	data:    status Healthy
	data:    Mobile service name todolist
	data:    Mobile service status ProvisionConfigured
	data:    SQL database name todolistAwrhcL60azo1C401
	data:    SQL database status Linked
	data:    SQL server name fh1kvbc7la
	data:    SQL server status Linked
	info:    Mobile service
	data:    name todolist
	data:    state Ready
	data:    applicationUrl https://todolist.azure-mobile.net/
	data:    applicationKey XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
	data:    masterKey XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
	data:    webspace WESTUSWEBSPACE
	data:    region West US
	data:    tables TodoItem
	info:    mobile show command OK	

**mobile restart [options] [servicename]**

This command restarts a mobile service instance.

	~$ azure mobile restart todolist
	info:    Executing command mobile restart
	+ Restarting mobile service
	info:    Service was restarted.
	info:    mobile restart command OK

**mobile log [options] [servicename]**

This command returns mobile service logs, filtering out all log types but `error`.

	~$ azure mobile log todolist -t error
	info:    Executing command mobile log
	data:
	data:    timeCreated 2013-01-07T16:04:43.351Z
	data:    type error
	data:    source /scheduler/TestingLogs.js
	data:    message This is an error.
	data:
	info:    mobile log command OK

This command supports the following additional options:

+ **-r `<query>`** or **--query `<query>`**: Executes the specified log query.
+ **-t `<type>`** or **--type `<type>`**:  Filter the returned logs by entry `<type>`, whicih can be `information`, `warning`, or `error`.
+ **-k `<skip>`** or **--skip `<skip>`**: Skips the number of rows specified by `<skip>`.
+ **-p `<top>`** or **--top `<top>`**: Returns a specific number of rows, specified by `<top>`.

Note that the **--query** parameter takes precedence over **--type**, **--skip**, and **--top**.

**mobile key regenerate [options] [servicename] [type]**

This command regenerates the mobile service application key.

	~$ azure mobile key regenerate todolist application
	info:    Executing command mobile key regenerate
	info:    New application key is SmLorAWVfslMcOKWSsuJvuzdJkfUpt40
	info:    mobile key regenerate command OK

Key types are `master` and `application`.

<div class="dev-callout"><b>Note</b>
   <p>When you regenerate keys, clients that use the old key may be unable to access your mobile service. When you regenerate the application key, you should update your app with the new key value. </p>
</div> 


###<a id="Mobile_Configuration"></a>Commands to manage mobile service configuration

**mobile config list [options] [servicename]**

This command lists configuration options for a mobile service.

	~$ azure mobile config list todolist
	info:    Executing command mobile config list
	+ Getting mobile service configuration
	data:    dynamicSchemaEnabled true
	data:    microsoftAccountClientSecret Not configured
	data:    microsoftAccountClientId Not configured
	data:    microsoftAccountPackageSID Not configured
	data:    facebookClientId Not configured
	data:    facebookClientSecret Not configured
	data:    twitterClientId Not configured
	data:    twitterClientSecret Not configured
	data:    googleClientId Not configured
	data:    googleClientSecret Not configured
	data:    apnsMode none
	data:    apnsPassword Not configured
	data:    apnsCertifcate Not configured
	info:    mobile config list command OK

**mobile config get [options] [servicename] [key]**

This command gets a specific configuration option for a mobile service, in this case dynamic schema.

	~$ azure mobile config get todolist dynamicSchemaEnabled
	info:    Executing command mobile config get
	data:    dynamicSchemaEnabled true
	info:    mobile config get command OK

**mobile config set [options] [servicename] [key] [value]**

This command sets a specific configuration option for a mobile service, in this case dynamic schema.

	~$ azure mobile config set todolist dynamicSchemaEnabled false
	info:    Executing command mobile config set
	info:    mobile config set command OK


###<a id="Mobile_Tables"></a>Commands to manage mobile service tables

**mobile table list [options] [servicename]**

This command lists all tables in your mobile service.

	~$azure mobile table list todolist
	info:    Executing command mobile table list
	data:    Name      Indexes  Rows
	data:    --------  -------  ----
	data:    Channel   1        0
	data:    TodoItem  1        0
	info:    mobile table list command OK

**mobile table show [options] [servicename] [tablename]**

This command shows returns details about a specific table.

	~$azure mobile table show todolist
	info:    Executing command mobile table show
	+ Getting table information
	info:    Table statistics:
	data:    Number of records 5
	info:    Table operations:
	data:    Operation  Script       Permissions
	data:    ---------  -----------  -----------
	data:    insert     1900 bytes   user
	data:    read       Not defined  user
	data:    update     Not defined  user
	data:    delete     Not defined  user
	info:    Table columns:
	data:    Name  Type           Indexed
	data:    ----  -------------  -------
	data:    id    bigint(MSSQL)  Yes
	data:    text      string
	data:    complete  boolean
	info:    mobile table show command OK

**mobile table create [options] [servicename] [tablename]**

This command creates a table.

	~$azure mobile table create todolist Channels
	info:    Executing command mobile table create
	+ Creating table
	info:    mobile table create command OK

This command supports the following additional option:

+ **-p `<permissions>`** or **--permissions `<permissions>`**: Comma-delimited list of `<operation>`=`<permission>` pairs, where `<operation>` is `insert`, `read`, `update`, or `delete` and `<permissions>` is `public`, `application` (default), `user`, or `admin`.

**mobile table update [options] [servicename] [tablename]**

This command changes delete permissions on a table to administrators only.

	~$azure mobile table update todolist Channels -p delete=admin
	info:    Executing command mobile table update
	+ Updating permissions
	info:    Updated permissions
	info:    mobile table update command OK

This command supports the following additional options:

+ **-p `<permissions>`** or **--permissions `<permissions>`**: Comma-delimited list of `<operation>`=`<permission>` pairs, where `<operation>` is `insert`, `read`, `update`, or `delete` and `<permissions>` is `public`, `application` (default), `user`, or `admin`.
+ **--deleteColumn `<columns>`**: Comma-delimited list of columns to delete, as `<columns>`.
+ **-q** or **--quiet**: Deletes columns without prompting for confirmation.
+ **--addIndex `<columns>`**: Comma-delimited list of columns to include in the index.
+ **--deleteIndex `<columns>`**: Comma-delimited list of columns to exclude from the index.

**mobile table delete [options] [servicename] [tablename]**

This command deletes a table.

	~$azure mobile table delete todolist Channels
	info:    Executing command mobile table delete
	Do you really want to delete the table (yes/no): yes
	+ Deleting table
	info:    mobile table delete command OK

Specify the -q parameter to delete the table without confirmation. Do this to prevent blocking of automation scripts.

**mobile data read [options] [servicename] [tablename] [query]**

This command reads data from a table.

	~$azure mobile data read todolist TodoItem
	info:    Executing command mobile data read
	data:    id  text     complete
	data:    --  -------  --------
	data:    1   item #1  false
	data:    2   item #2  true
	data:    3   item #3  false
	data:    4   item #4  true
	info:    mobile data read command OK

This command supports the following additional options:

+ **-k `<skip>`** or **--skip `<skip>`**: Skips the number of rows specified by `<skip>`.
+ **-t `<top>`** or **--top `<top>`**: Returns a specific number of rows, specified by `<top>`.
+ **-l** or **--list**: Returns data in a list format.


###<a id="Mobile_Scripts"></a>Commands to manage scripts

**mobile script list [options] [servicename]**

This command lists registered scripts, including both table and scheduler scripts.

	~$azure mobile script list todolist
	info:    Executing command mobile script list
	+ Getting script information
	info:    Table scripts
	data:    Name                   Size
	data:    ---------------------  ----
	data:    table/TodoItem.delete  256
	data:    table/Devices.insert   1660
	error:   Unable to get shared scripts
	info:    Scheduler scripts
	data:    Name                 Status     Interval   Last run   Next run
	data:    -------------------  ---------  ---------  ---------  ---------
	data:    scheduler/undefined  undefined  undefined  undefined  undefined
	data:    scheduler/undefined  undefined  undefined  undefined  undefined
	info:    mobile script list command OK

**mobile script upload [options] [servicename] [scriptname]**

This command uploads a new script named `todoitem.insert.js` from the `table` subfolder.

	~$azure mobile script upload todolist table/todoitem.insert.js
	info:    Executing command mobile script upload
	info:    mobile script upload command OK

The name of the file must be composed from the table and operation names, and it must be located in the table subfolder relative to the location where the command is executed. You can also use the **-f `<file>`** or **--file `<file>`** parameter to specify a differnt filename and path to the file that contains the script to register.

**mobile script download [options] [servicename] [scriptname]**

This command downloads the insert script from the TodoItem table to a file named `todoitem.insert.js` in the `table` subfolder.

	~$azure mobile script download todolist table/todoitem.insert.js
	info:    Executing command mobile script download
	info:    Saved script to ./table/todoitem.insert.js
	info:    mobile script download command OK

This command supports the following additional options:

+ **-p `<path>`** or **--path `<path>`**: The location in the file in which to save the script, where the current working directory is the default.
+ **-f `<file>`** or **--file `<file>`**: The name of the file in which to save the script.
+ **-o** or **--override**: Overwrite an existing file.
+ **-c** or **--console**: Write the script to the console instead of to a file.

**mobile script delete [options] [servicename] [scriptname]**

This command removes the existing insert script from the TodoItem table.

	~$azure mobile script delete todolist table/todoitem.insert.js
	info:    Executing command mobile script delete
	info:    mobile script delete command OK


##<a id="Manage_tool_local_settings"></a>Manage tool local settings

Local settings are your subscription ID and Default Storage Account Name.

**config list [options]**

This command displays config settings.

	~$ azure config list
	info:   Displaying config settings
	data:   Setting                Value                               
	data:   ---------------------  ------------------------------------
	data:   subscription           32-digit-subscription-key
	data:   defaultStorageAccount  name

**config set [options] &lt;name&gt;,&lt;value&gt;**

This command changes a config setting.

	~$ azure config set defaultStorageAccount myname
	info:   Setting 'defaultStorageAccount' to value 'myname'
	info:   Changes saved.
