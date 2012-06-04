#Commands for the Windows Azure cmdline tool for Mac and Linux

To use this tool with virtual machines and other new Windows Azure capabilities, sign up for the [free preview](https://account.windowsazure.com/PreviewFeatures).

This tool provides functionality for creating, deploying and managing virtual machines and web sites from Mac and Linux desktops. This functionality is similar to that provided by the PowerShell cmdlets that are installed with the Windows Azure SDKs for .NET, Node.JS and PHP.

To install the tool on a Mac, download and run the [Windows Azure SDK installer](/en-us/manage/downloads/).

To install the tool on Linux, install the latest version of Node.JS and then use NPM to install:

	sudo npm install azure -g

Optional parameters are show in square brackets (e.g., [parameter]). All other parameters are required.

In addition to command-specific optional parameters documented below, there are two optional parameters that can be used to display detailed output such as request options and status codes. The -v parameter provides verbose output, and the -vv parameter provides even more detailed verbose output.

**Table of Contents:**

* [Commands to manage your account information and publish settings](#Manage_your_account_information_and_publish_settings)
* [Commands to manage your Windows Azure virtual machines](#Commands_to_manage_your_Azure_virtual_machines)
* [Commands to manage your Windows Azure virtual machine endpoints](#Commands_to_manage_your_Azure_virtual_machine_endpoints)
* [Commands to manage your Windows Azure virtual machine images](#Commands_to_manage_your_Azure_virtual_machine_images)
* [Commands to manage your Windows Azure virtual machine data disks](#Commands_to_manage_your_Azure_virtual_machine_data_disks)
* [Commands to manage your Windows Azure cloud services](#Commands_to_manage_your_Azure_cloud_services)
* [Commands to manage your Windows Azure certificates](#Commands_to_manage_your_Azure_certificates)
* [Commands to manage your web sites](#Commands_to_manage_your_web_sites)
* [Manage tool local settings](#Manage_tool_local_settings)

<h2 id="Manage_your_account_information_and_publish_settings">Commands to manage your account information and publish settings</h2>
Your Windows Azure subscription information is used by the tool to connect to your account. This information can be obtained from the Windows Azure portal in a *publish settings* file as described below. The publish settings file can then be imported as a persistent local config setting that will be used by the tool for subsequent operations. You only need to import your publish settings once. 

###account download [options]

Launch a browser to download your .publishsettings file from the Windows Azure Management Portal:

	~$ azure account download
	info:   Executing command account download
	info:   Launching browser to https://windows.azure.com/download/publishprofile.aspx
	help:   Save the downloaded file, then execute the command
	help:     account import &lt;file>
	info:   account download command OK

###account import [options] &lt;file>

This command imports a publishsettings file or certificate so that it can be used by the tool going forward.

	~$ azure account import publishsettings.publishsettings
	info:   Importing publish settings file publishsettings.publishsettings
	info:   Found subscription: 3-Month Free Trial
	info:   Found subscription: Pay-As-You-Go
	info:   Setting default subscription to: 3-Month Free Trial
	warn:   The 'publishsettings.publishsettings' file contains sensitive information.
	warn:   Remember to delete it now that it has been imported.
	info:   Account publish settings imported successfully

###account clear [options]

This command will remove the stored publish settings that have been imported. Use this command if you're finished using the tool on this machine and want to assure that the tool can not be used with your account going forward.

	~$ azure account clear
	Clearing account info.
	info:   OK

###account location list [options]

This command lists all available Windows Azure account locations.

	~$ azure account location list
	info:   Executing command account location list
	data:   Name                   Display Name                                    
	data:   ---------------------  ------------
	data:   Windows Azure Preview  West US     
	info:   account location list command OK


###account affinity-group list [options]

This command lists your Windows Azure affinity groups.

Affinity-groups can be set when a group of virtual machines spans multiple physical machines. The affinity-group specifies that the physical machines should be as close to each other as possible, to reduce network latency.

	~$ azure account affinity-group list
	info:   Executing command account affinity-group list
	data:                                                                          
	data:   
	info:   account affinity-group list command OK

<h2 id="Commands_to_manage_your_Azure_virtual_machines">Commands to manage your Windows Azure virtual machines</h2>
The diagram below shows how Windows Azure virtual machines are hosted in the production deployment environment of a Windows Azure cloud service. 

![Architecture Diagram](../media/ArchitectureDiagram.jpg)

// create-new creates the drive in blob storage (i.e., e:\ in the diagram); "attach" attaches an already created but unattached disk to a VM


###vm create &lt;dns-prefix> &lt;image> &lt;userName> [password] [optional parameters]*

This command creates a new Windows Azure virtual machine. By default, each virtual machine is created in its own cloud service, however you can specify that a virtual machine should be added to an existing cloud service through use of the **-c** option as documented below.

Note that the **vm create** command, like in the Windows Azure Management Portal, only creates virtual machines in the production deployment environment. There is currently no option for creating a virtual machine in the staging deployment environment of a cloud service. Note that a Windows Azure storage account will be created by this command if one does not already exist for your subscription.

When you create a new virtual machine, you will need to specify the physical location (i.e., data center) where the virtual machine will reside. You can specify a location through the --location parameter, or specify an affinity group through the --affinity-group parameter. If neither is provided, you will be prompted to provide one from a list of valid locations.

The supplied password must be 8-123 characters long and meet the password complexity requirements of the operating system that you are using for this virtual machine.

If you anticipate the need to use SSH to manage a deployed Linux virtual machine (as is usually the case), you must enable SSH via the -s option when you create the virtual machine. It is not possible to enable SSH after the virtual machine has been created.

Windows virtual machines can enable RDP by adding port 3389 as an endpoint.

The following optional parameters are supported for this command:

- **-c** create the virtual machine inside an already created deployment in a hosting service
- **--vmname** Specify the name of the virtual machine. Takes hosting service name by default.
- **-u --blob-url** Specify the blob storage url from which to create the virtual machine system disk.
- **--vm-size** Specify the size of the virtual machine (Small, medium, large, etc.)
- **-location** specifies the location (e.g., "North Central US")
- **--affinity-group** specifies the affinity group

		~$ azure vm create my-vm-name MSFT__Windows-Server-2008-R2-SP1.11-29-2011  username --location Windows\ Azure
		info:   Executing command vm create
		Enter VM 'my-vm-name' password: ************                                     
		info:   vm create command OK`

###vm create-from &lt;dns-prefix> &lt;role-file>

Create a new Windows Azure virtual machine from json role file

	~$ azure vm create-from foo.json
	info:   OK

###vm list [options]

List Windows Azure virtual machines

	~$ azure vm list
	info:   Executing command vm list
	data:   DNS Name                          VM Name      Status                  
	data:   --------------------------------  -----------  ---------
	data:   my-vm.cloudapp-preview.net        my-vm        ReadyRole
	info:   vm list command OK

###vm show [options] &lt;name>

Show details about a Windows Azure virtual machine

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
	data:                   Port: '63238',
	data:                   LocalPort: '3389',
	data:                   Name: 'RemoteDesktop'
	data:               }
	data:           ]
	data:       },
	data:       Image: 'MSFT__Windows-Server-2008-R2-SP1.11-29-2011',
	data:       OSVersion: 'WA-GUEST-OS-1.18_201203-01'
	data:   }
	info:   vm show command OK

###vm delete [options] &lt;name>

Delete a Windows Azure virtual machine

	~$ azure vm delete my-vm
	info:   Executing command vm delete
	info:   vm delete command OK

###vm start [options] &lt;name>

Start a Windows Azure virtual machine

	~$ azure vm start my-vm
	info:   Executing command vm start
	info:   vm start command OK

###vm restart [options] &lt;name>

Restart a Windows Azure virtual machine

	~$ azure vm restart my-vm
	info:   Executing command vm restart
	info:   vm restart command OK

###vm shutdown [options] &lt;name>

Shutdown a Windows Azure virtual machine

	~$ azure vm shutdown my-vm
	info:   Executing command vm shutdown
	info:   vm shutdown command OK  

###vm capture &lt;vm-name> &lt;target-image-name>

Capture a Windows Azure virtual machine image

Capturing a virtual machine cannot be done while it's state is RoleStateStarted. Virtual machine state must be Stopped

	~$ azure.cmd vm capture my-vm mycaptureimagename --delete
	info:   Executing command vm capture
	+ Fetching VMs
	+ Capturing VM
	info:   vm capture command OK

<h2 id="Commands_to_manage_your_Azure_virtual_machine_endpoints">Commands to manage your Windows Azure virtual machine endpoints</h2>

The following diagram shows the architecture of a typical deployment of multiple instances of a virtual machine. Note that in this example port 3389 is open on each virtual machine (for RDP access), and there is also an internal IP address (e.g., 168.55.11.1) on each virtual machine that is used by the load balancer to route traffic to the virtual machine.

![Network Endpoint Diagram](../media/networkdiagram.jpg)

External requests to virtual machines go through a load balancer and as such requests cannot be specified against a particular virtual machine on deployments with multiple virtual machines. For deployments with multiple virtual machines, port mapping must be configured between the virtual machines (vm-port) and the load balancer (lb-port).
 
###vm endpoint create &lt;vm-name> &lt;lb-port> [vm-port]

Create a virtual machine endpoint

	~$ azure vm endpoint create my-vm 8888 8888
	info:   OK

###vm endpoint delete &lt;vm-name> &lt;lb-port>

Delete a virtual machine endpoint

	~$ azure vm endpoint delete my-vm 8888
	info:   OK

###vm endpoint list &lt;vm-name>

List all virtual machine endpoints

	~$ azure vm endpoint list my-vm
	data:   Name  External Port  Local Port                                        
	data:   ----  -------------  ----------
	data:   ssh   22             22

<h2 id="Commands_to_manage_your_Azure_virtual_machine_images">Commands to manage your Windows Azure VM images</h2>
Virtual machine images are captures of already configured virtual machines that can be replicated as required.

###vm image show [options] &lt;name>

Show status of a virtual machine image

	~$ azure vm image show MSFT__Windows-Server-2008-R2-SP1.11-29-2011
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

###vm image list [options]

Get a list of virtual machine images. The list includes core images provided by Windows Azure as well as personal User images.

	~$ azure vm image list
	info:   Executing command vm image list
    data:   Name                                                                  Category   OS      
    data:   --------------------------------------------------------------------  ---------  -------
    data:   CANONICAL__Canonical-Ubuntu-12-04-20120519-2012-05-19-en-us-30GB.vhd  Canonical  Linux  
    data:   MSFT__Windows-Server-2012-RC-June2012-en-us-30GB.vhd                  Microsoft  Windows
    data:   MSFT__Win2K8R2SP1-120514-1520-141205-01-en-us-30GB.vhd                Microsoft  Windows
    data:   MSFT__Windows-Server-8-Beta.en-us.30GB.2012-03-22                     Microsoft  Windows
    data:   MSFT__Sql-Server-11EVAL-11.0.2215.0-05152012-en-us-30GB.vhd           Microsoft  Windows
    data:   MSFT__Windows-Server-2008-R2-SP1.en-us.30GB.2012-3-22                 Microsoft  Windows
    data:   OpenLogic__OpenLogic-CentOS-62-20120509-en-us-30GB.vhd                OpenLogic  Linux  
    data:   SUSE__SUSE-Linux-Enterprise-Server-11SP2-20120521-en-us-30GB.vhd      SUSE       Linux  
    data:   SUSE__OpenSUSE64121-03192012-en-us-15GB.vhd                           SUSE       Linux 
	data:   my-vm-1-my-vm-1-0-2012419145114                                       USER       Windows  
	data:   my-vm-1-my-vm-2-201242418259                                          USER       Windows
	info:   vm image list command OK

###vm image delete [options] &lt;name>

Delete a virtual machine image from the personal repository

	~$ azure vm image delete my-vm-image
	info:   Executing command vm image delete
	info:   VM image deleted: my-vm-image                                         
	info:   vm image delete command OK

###vm image create &lt;name> [source-path]

Create a virtual machine image
Location and OS parameters are required

	azure.cmd vm image create mytestimage ./Sample.vhd -o windows -l "Windows Azure"
	info:   Executing command vm image create
	+ Retrieving storage accounts
	info:   VHD size : 13 MB
	info:   Uploading 13312.5 KB
	Requested:100.0% Completed:100.0% Running: 105 Time:    8s Speed:  1721 KB/s
	info:   http://myaccount.blob.core.azure.com/vm-images/SamplePictures.vhd is uploaded successfully
	info:   vm image create command OK

<h2 id="Commands_to_manage_your_Azure_virtual_machine_data_disks">Commands to manage your Windows Azure virtual machine data disks</h2>

Data disks are .vhd files in blob storage that can be used by a virtual machine. See the Windows Azure technical diagram above for an overview of how data disks are deployed to blob storage.

###vm disk show [options] &lt;name>

Show details about a Windows Azure disk

	~$ azure vm disk show my-vm-my-vm-2-201242418259
	info:   Executing command vm disk show
	data:   {                                                                      
	data:       Name: 'my-vm-my-vm-2-201242418259',
	data:       Location: 'Windows Azure Preview',
	data:       MediaLink: 'https://my.blob.core.azure.com/vhds/test.vhd',
	data:       @: { xmlns: 'http://schemas.microsoft.com/windowsazure', xmlns:i: 'http://www.w3.org/2001/XMLSchema-instance' },
	data:       Label: 'my-vm-my-vm-my-vm-2',
	data:       LogicalDiskSizeInGB: '20'
	data:   }
	info:   vm disk show command OK

###vm disk list [options] [vm-name]

List Windows Azure disk images, or disks attached to a specified virtual machine

	~$ azure vm disk list my-vm
	info:   Executing command vm disk list
	data:   Lun  Size(GB)  Blob-Name                                               
	data:   ---  --------  --------------------------------------
	data:   1    30        my-vm-my-vm-2012-04-19.vhd
	info:   vm disk list command OK

###vm disk delete [options] &lt;name>

Delete a Windows Azure disk image from personal repository
Disk must be detached from virtual machine prior to deletion

	~$ azure vm disk delete my-vm-my-vm-3-2012426221035
	info:   Executing command vm disk delete
	info:   Disk deleted: my-vm-my-vm-3-2012426221035                  
	info:   vm disk delete command OK

###vm disk create &lt;name> [source-path]

Upload and register a Windows Azure disk image
--blob-url, --location, or --affinity-group must be specified

	~$ azure vm disk create my-vm ~/test.vhd --location Windows\ Azure
	info:   Executing command vm disk create
	info:   VHD size : 10 MB                                                       
	info:   Uploading 10240.5 KB
	Requested:100.0% Completed:100.0% Running:  81 Time:   11s Speed:   952 KB/s 
	info:   http://account.blob.core.azure.com/disks/test.vhd is uploaded successfully
	info:   vm disk create command OK

###vm disk attach &lt;vm-name> &lt;disk-image-name>

This command attaches an existing disk in blob storage to an existing virtual machine deployed in a cloud service.


	~$ azure vm disk attach my-vm my-vm-my-vm-2-201242418259
	info:   Executing command vm disk attach
	info:   vm disk attach command OK

###vm disk attach-new &lt;vm-name> &lt;size-in-gb> [blob-url]

Attaches a data-disk to a Windows Azure virtual machine

	~$ azure vm disk attach-new nick-test36 20 http://nghinazz.blob.core.azure-preview.com/vhds/vmdisk1.vhd
	info:   Executing command vm disk attach-new
	info:   vm disk attach-new command OK

###vm disk detach &lt;vm-name> &lt;lun>

Detaches a data-disk attached to a Windows Azure virtual machine

	~$ azure vm disk detach my-vm 2
	info:   Executing command vm disk detach
	info:   vm disk detach command OK

<h2 id="Commands_to_manage_your_Azure_cloud_services">Commands to manage your Windows Azure cloud services</h2>

Windows Azure *cloud services* are applications and services hosted on web roles and worker roles. The following commands can be used to manage Windows Azure cloud services.
   
###service list [options]

List Windows Azure cloud services

	~$ azure service list
	info:   Executing command service list
	data:   Name         Status                                                    
	data:   -----------  -------
	data:   service1     Created
	data:   service2     Created
	info:   service list command OK

###service delete [options] &lt;name>

Delete a Windows Azure cloud service

	~$ azure cloud-service delete myservice
	info:   Executing command cloud-service delete myservice 
	info:   cloud-service delete command OK

<h2 id="Commands_to_manage_your_Azure_certificates">Commands to manage your Windows Azure certificates</h2>

Windows Azure certificates are cerificates (i.e. SSL certificates) connected to your Windows Azure account.

###service cert list [options]

List Windows Azure certificates

	~$ azure service cert list
	info:   Executing command service cert list
	+ Fetching cloud services                                                      
	+ Fetching certificates                                                        
	data:   Service   Thumbprint                                Algorithm
	data:   --------  ----------------------------------------  ---------
	data:   mysrvice  262DBF95B5E61375FA27F1E74AC7D9EAE842916C  sha1     
	info:   service cert list command OK

###service cert create &lt;dns-prefix> &lt;file> [password]

Upload a certificate

Leave password prompt blank for non-password protected certificates

	~$ azure service cert create nghinazz ~/publishSet.pfx
	info:   Executing command service cert create
	Cert password: 
	+ Creating certificate                                                         
	info:   service cert create command OK

###service cert delete [options] &lt;thumbprint>

Delete a certificate

	~$ azure service cert delete 262DBF95B5E61375FA27F1E74AC7D9EAE842916C
	info:   Executing command service cert delete
	+ Deleting certificate                                                         
	info:   nghinazz : cert deleted
	info:   service cert delete command OK

<h2 id="Commands_to_manage_your_web_sites">Commands to manage your web sites</h2>

A Windows Azure *web site* is a web configuration accessible by uri. Web sites are hosted in virtual machines, but you do not need to think about the details of creating and deploying the virtual machine yourself. Those details are handled for you by Windows Azure.

###site list [options]

List your web sites

	~$ azure site list
	info:   Executing command site list
	data:   Name            State    Host names                                        
	data:   --------------  -------  --------------------------------------------------
	data:   mongosite       Running  mongosite.antdf0.antares.windows.net     
	data:   myphpsite       Running  myphpsite.antdf0.antares.windows.net     
	data:   mydrupalsite36  Running  mydrupalsite36.antdf0.antares.windows.net
	info:   site list command OK

###site create [options] [name]

Create a new web site and local directory. Note that the site name must be unique. You can not create a site with the same DNS name as an existing site.

	~$ azure site create mysite
	info:   Executing command site create
	info:   Using location northeuropewebspace
	info:   Creating a new web site
	info:   Created website at  mysite.antdf0.antares.windows.net
	info:   Initializing repository
	info:   Repository initialized
	info:   site create command OK

###site portal [options] [name]

Opens the portal in a browser to manage your web sites. If name is specified the portal will open for that specific site.

	~$ azure site portal mysite
	info:   Executing command site portal
	info:   Launching browser to https://windows.azure.net/#Workspaces/WebsiteExtension/Website/mysite/dashboard
	info:   site portal command OK

###site browse [options] [name]

Open your web site in a browser

	~$ azure site browse mysite
	info:   Executing command site browse
	info:   Launching browser to http://mysite.antdf0.antares-test.windows-int.net
	info:   site browse command OK

###site show [options] [name]

Show details for a web site

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

###site delete [options] [name]

Delete a web site

	~$ azure site delete mysite
	info:   Executing command site delete
	info:   Deleting site mysite
	info:   Site mysite has been deleted
	info:   site delete command OK

###site start [options] [name]

Start a web site

	~$ azure site start mysite
	info:   Executing command site start
	info:   Starting site mysite
	info:   Site mysite has been started
	info:   site start command OK

###site stop [options] [name]

Stop a web site

	~$ azure site stop mysite
	info:   Executing command site stop
	info:   Stopping site mysite
	info:   Site mysite has been stopped
	info:   site stop command OK

<h2 id="Manage_tool_local_settings">Manage tool local settings</h2>
Local settings are your subscription ID and Default Storage Account Name.

###config list [options]

Display config settings

	~$ azure config list
	info:   Displaying config settings
	data:   Setting                Value                               
	data:   ---------------------  ------------------------------------
	data:   subscription           32-digit-subscription-key
	data:   defaultStorageAccount  name

###config set [options] &lt;name>,&lt;value>

Change a config setting

	~$ azure config set defaultStorageAccount myname
	info:   Setting 'defaultStorageAccount' to value 'myname'
	info:   Changes saved.